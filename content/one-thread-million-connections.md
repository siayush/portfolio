---
title: "One thread, a million connections"
publishedAt: "2026-06-22"
summary: "A guided descent through the network stack — from the front-door reverse proxy down to the single system call that high-concurrency servers are built on. Nginx, Node.js, epoll, and non-blocking I/O, assembled into one picture."
---

![The network stack as six descending layers, from the reverse proxy down to the epoll system call](/otmc-hero.svg)

Here is a fact worth sitting with: a single modest server, on a single CPU core, running a single thread, can comfortably hold tens or hundreds of thousands of live network connections at once. No farm of machines, no thousand threads — one loop. This article takes that fact apart, top to bottom, until there is nothing left to explain.

We start at the front door, where traffic from the internet first arrives, and we descend one layer at a time. Each layer answers the question the previous one raised. Why do we put a proxy in front of our app? Because the app shouldn't face the internet directly. How does that proxy survive the flood? An event loop. What lets that loop juggle thousands without ever freezing? Non-blocking I/O. And what makes waiting on all of them at once cheap? A system call named `epoll_wait`. By the last section, the whole machine is visible at once.

## 1. The front door: why a reverse proxy

Imagine you've written a web app. It runs as a process listening on `localhost:3000`. On its own, that setup has a pile of problems. Users would have to type a port number into the address bar. The app process now faces the raw internet directly — handling encryption, slow clients, and attacks *while* trying to run your business logic. If you start a second copy on port `3001` to share the load, nothing routes traffic between them. And if you also have an API, both it and your website want port 80, but only one process can own a port.

A **reverse proxy** — Nginx is the most common one — is a server that sits *in front* of your application. The browser talks to the proxy; the proxy talks to your apps on their behalf. The word "reverse" matters: a forward proxy sits in front of *clients* to represent them; a reverse proxy sits in front of *servers* to represent them.

![A browser connects to Nginx on port 443; Nginx forwards requests to two backend app servers](/otmc-proxy.svg)

*The shape of it. The browser only ever talks to Nginx. Nginx decides which backend handles each request — and can move, restart, or multiply those backends without the public address ever changing.*

That single move buys a lot. The proxy gives you **one public entry point** and hides the app's real port. It performs **TLS termination**: it holds the certificate, decrypts incoming HTTPS, and speaks plain HTTP to your backend over localhost, so your app code never touches certificates. It does **load balancing** across multiple app copies and routes around one that crashes. It **routes** by URL, so `/api` can reach one backend and `/` another. And it **buffers** slow clients so a one-byte-per-second connection ties up the proxy instead of your app.

## 2. Under the flood: how one proxy handles so many connections

The naive way to serve connections — the old Apache model — was **one thread (or process) per connection**. It feels intuitive, but it breaks at scale. Each thread reserves a chunk of memory for its stack (often several megabytes), so ten thousand threads can eat tens of gigabytes just sitting idle, and the OS burns time context-switching between them. This wall has a name: the **C10K problem** — getting a single machine past ten thousand concurrent connections.

The insight that breaks the wall: **connections are mostly idle.** At any instant, almost every connection is just waiting — for the next packet, for a slow uploader, for the database. Real CPU work takes microseconds; the waiting takes milliseconds. So why dedicate a whole frozen thread to each wait?

![Thousands of mostly idle connections; the OS readiness list reports only the ready ones to a single-threaded event loop](/otmc-event-loop.svg)

*The event loop. A worker sets its sockets to non-blocking, hands the whole list to the OS, and sleeps until told which are ready. It then does the small, fast work each ready socket needs and loops — never frozen on any single connection.*

A useful picture: a thread-per-connection server is like hiring one waiter per table, where most waiters stand idle because their diners are still reading the menu. Nginx is one excellent waiter who walks only to a table the moment a hand goes up. One waiter serves the whole restaurant — and the readiness list is what tells the waiter exactly which hands are raised, without walking past every table to check.

To use every core, Nginx runs several workers — typically one per CPU core (`worker_processes auto;`) — each an independent single-threaded loop. The combination of non-blocking sockets, an OS readiness notifier, and the fact that connections are mostly idle is why a modest box holds connection counts that would need terabytes of thread stacks in the old model.

One caveat, and it returns later: the loop only works if nothing blocks it. A genuinely slow, CPU-bound task in the loop would stall every other connection behind it. Proxying is a perfect fit precisely because forwarding bytes is fast and I/O-bound.

## 3. The same idea in your language: Node.js and libuv

Node.js solves concurrency the same way at the network layer: a single-threaded JavaScript event loop over non-blocking sockets, using the same OS readiness mechanism. The plumbing lives in a C library called **libuv**, which plays the role Nginx implements directly in its own code. But Node adds one piece Nginx barely needs.

![A single JS event loop sits on libuv, which splits work into network I/O via epoll and a thread pool for file, DNS and crypto work](/otmc-node-libuv.svg)

*Node's architecture. Network work uses epoll/kqueue exactly like Nginx. The extra piece is the thread pool: operations like disk reads and DNS lookups have no non-blocking OS equivalent, so libuv hands them to background threads so the loop never freezes.*

Why the thread pool exists: not everything has a non-blocking version. Network sockets do — the OS will tell you when one is ready without freezing you. But reading a file, resolving a DNS name, and some crypto operations are blocking at the OS level. If Node ran those on the event loop, the loop would freeze for every file read. So libuv keeps a small pool (4 threads by default), hands those jobs off, and posts results back to the loop when they finish. Your JavaScript still feels single-threaded.

The deeper difference is about *who writes the loop's code*. Nginx runs a **configuration file** — you declare rules and its battle-tested C does the work, so you essentially cannot write a slow operation into its loop. Node runs **your arbitrary JavaScript** directly on the loop. That's the power and the footgun: a heavy synchronous computation, a giant `JSON.parse`, or a runaway regex sits on the one thread and freezes *every* connection until it finishes. This is why CPU-bound work in Node gets pushed to `worker_threads`, a child process, or a separate service.

One more contrast: scaling across cores. Nginx does it with a one-line setting. A plain `node server.js` uses one core; to use them all you run multiple processes (the `cluster` module, a manager like PM2, or many containers) behind a load balancer. And that load balancer out front is very often Nginx — closing the loop with Layer 1. The two aren't rivals; they're the same idea at different layers, frequently stacked together.

## 4. The obvious objection: if Node already serves connections, why a proxy?

It's a fair question. Node's built-in HTTP server accepts connections perfectly well on its own — `node server.js` and you're live. So the proxy isn't there because Node *can't* handle traffic. It's there because of the one fact this whole article keeps returning to: Node runs your application on a **single precious thread**, and anything that steals time from that thread steals it from every connection at once. A proxy's job is to keep the thread free.

### One process uses one core

A single Node process is a single event loop on a single core. A real server has many cores sitting idle. The only way to use them is to run several Node processes — and the moment you have more than one, something has to spread incoming connections across them. That something is a load balancer, which is exactly what the reverse proxy is.

![Nginx sits between the internet and three Node worker processes, one per CPU core](/otmc-division.svg)

*The division of labour. Several single-threaded Node workers, one per core, sit behind one Nginx that spreads connections across them and absorbs everything that would otherwise tie up an event loop.*

### Keeping the event loop clean

Recall the tradeoff from the last two layers: whatever runs on the loop must be fast and never block. Several common jobs violate that — and the proxy takes each one off Node's plate. **TLS handshakes** are CPU-heavy; Nginx terminates encryption and hands Node plain HTTP. **Slow clients** that trickle a request one byte at a time would hold a slot in Node's loop for seconds; Nginx buffers the whole request and only forwards it once it's complete and fast. **Static files** — images, CSS, bundles — are pure I/O that Nginx serves through the kernel's optimized `sendfile` path far more efficiently than a Node handler, which would spend loop time on them. The net effect: Node only ever sees complete, plaintext, application-shaped requests.

### A hardened front, and easier operations

Nginx is decades-hardened C, tested against malformed requests, oversized headers, and connection-exhaustion attacks. It's far better to let it parse hostile input from the open internet than to expose your application's request parser directly. While it's there, it also adds **gzip compression**, **response caching**, **rate limiting**, and **request-size caps** for free, and it lets Node bind an unprivileged high port like `3000` instead of needing root to own `443`. Operationally it enables zero-downtime deploys — Nginx keeps serving and drains connections while you restart the Node workers behind it — and a single front door for many services and paths.

So the answer isn't about capability. Node *can* face the internet; it just shouldn't. Its gift is application logic on one fast thread, and the proxy's gift is keeping every cross-cutting, thread-stealing concern away from it.

## 5. The bedrock: I/O, and what "non-blocking" really means

**I/O** — input/output — is any time your program talks to something outside its own CPU and memory: a disk, a socket, a keyboard, a database. The defining trait is that the data lives somewhere the program doesn't control, and fetching it is *slow* compared to computation. Adding two numbers takes nanoseconds; waiting for a packet takes milliseconds — a million times longer. That gap is why all of this machinery exists. The real question is never *what* I/O is, but *what your thread does while it waits.*

![Two timelines for the same wait — blocking leaves the thread frozen; non-blocking serves other connections during the window](/otmc-blocking.svg)

*The whole difference. Same wait, same finish moment. Blocking spends the window asleep and idle; non-blocking spends it serving other connections. One thread does the work of thousands.*

A normal `read()` is **blocking**: if the data isn't there, the OS removes your thread from the CPU and won't wake it until data arrives. Simple to reason about, perfect for one-thing-at-a-time — but a blocking thread can wait on only one thing, which is the wasteful gray bar above and the root of the thread-per-connection wall.

Flip the socket into **non-blocking** mode (the `O_NONBLOCK` flag) and `read()` always returns immediately. If data is ready, you get it. If not, it returns `-1` with `errno` set to `EAGAIN` — the kernel saying "nothing this instant; I'd have had to block you, so go do something else and check back." That's not an error; it's the normal "nothing yet" signal, and it's what frees the thread to serve other connections.

But non-blocking alone has a trap: loop over your sockets calling `read()` and you mostly get `EAGAIN`, burning 100% of a core asking "ready yet?" forever. *This is the hole epoll fills.* The loop doesn't spin — it calls `epoll_wait` and sleeps at zero CPU, like a blocking call except it's waiting on *all* its sockets at once. The kernel wakes it only when something is genuinely ready; *then* it calls the non-blocking `read()`, which now returns data instead of `EAGAIN`.

> **The winning combination.** **Non-blocking sockets** so no single connection can freeze the thread, plus **epoll** so the thread sleeps efficiently instead of busy-polling and wakes only for sockets that are actually ready. Blocking I/O gives simplicity but one-thing-at-a-time. Non-blocking gives the freedom to juggle thousands; epoll gives back the efficient sleeping you'd otherwise lose. That pairing is the literal engine inside Nginx and Node — the answer to every "how does it handle so many connections" we started with. The last layer pulls that readiness mechanism apart: what epoll does, and why it costs almost nothing no matter how many connections you watch.

## 6. The mechanism: what epoll does, and how

Everything above rests on one Linux facility. **epoll** exists to answer a single question cheaply: *of the thousands of sockets I'm watching, which have something for me right now?* You tell it once which sockets you care about, then ask it — over and over — for just the ready ones.

![A loop registers sockets with epoll; a kernel callback appends ready ones to the ready list that the loop reads back](/otmc-epoll.svg)

*What the kernel holds. You register each socket once into an interest list. When a packet arrives, the kernel adds that socket to a ready list. When the loop asks, it gets the ready list back — already built.*

It works in three moves. You **register** each socket once, at setup. The kernel **watches** them for you: when a packet for a socket arrives, a small callback appends that socket to a ready list — so the list is built as data arrives, not when you ask. Then the loop **waits**: it sleeps at zero CPU until at least one socket is ready, and wakes with *only the ready ones* handed back. No scanning, no busy-polling.

That last part is the whole trick. The cost of a wait is proportional to how many sockets are *ready*, not how many you're *watching*. The older `select()` and `poll()` got this wrong — they re-checked every socket on every call, so cost grew with the total. epoll keeps the registration persistent and the ready list pre-built, which is the entire reason one core can babysit hundreds of thousands of sockets at once. (epoll is Linux-only; `kqueue` on macOS/BSD and IOCP on Windows do the same job, which is why libuv wraps all three behind one interface.)

## The whole machine, assembled

Read bottom to top, the layers click together. The OS exposes **non-blocking I/O** so a thread is never frozen on one socket. **epoll** turns that into something usable, letting the thread sleep cheaply and wake only for ready sockets, with the kernel maintaining the ready list via callbacks the whole time. An **event loop** built on that pair lets one thread, on one core, attend to tens of thousands of connections. **Nginx** packages the loop as a configurable proxy and runs one per core; **Node.js** packages the same loop for your own code, adding a thread pool for the blocking odds and ends. And Nginx often sits out front of a fleet of Node processes, spreading the load — the top layer balancing across copies of the layer below.

One thread, a million connections. Not magic — just the refusal to let a thread sit frozen while there is other work it could be doing.
