---
title: "One thread, a million connections"
publishedAt: "2026-06-22"
summary: "A walk down the network stack, from the reverse proxy at the front door to the single system call that high-concurrency servers are built on. Nginx, Node.js, epoll, and non-blocking I/O, in one picture."
---

![The network stack as six descending layers, from the reverse proxy down to the epoll system call](/otmc-hero.svg)

A single modest server, on one CPU core, running one thread, can comfortably hold tens or hundreds of thousands of live connections at once. No fleet of machines, no thousand threads. Just one loop. That sounds like it shouldn't work, so let's take it apart from top to bottom.

We'll start at the front door, where traffic from the internet first lands, and work down one layer at a time. Each layer answers a question the one above it raised. Why put a proxy in front of the app? Because the app shouldn't face the internet directly. How does that proxy survive the flood? An event loop. What keeps the loop from freezing while it juggles thousands of connections? Non-blocking I/O. And what makes waiting on all of them at once cheap? A system call called `epoll_wait`. By the end, the whole machine should be visible at once.

## 1. The front door: why a reverse proxy

Say you've written a web app. It runs as a process listening on `localhost:3000`. On its own, that setup has a pile of problems. Users would have to type a port number into the address bar. The process faces the raw internet directly, so it's dealing with encryption, slow clients, and attacks at the same time as your business logic. Start a second copy on port `3001` to share the load and nothing routes traffic between the two. And if you also run an API, both it and your website want port 80, but only one process can own a port.

A **reverse proxy** (Nginx is the usual choice) is a server that sits in front of your application. The browser talks to the proxy, and the proxy talks to your apps on their behalf. The word *reverse* matters. A forward proxy sits in front of clients to represent them. A reverse proxy sits in front of servers to represent them.

![A browser connects to Nginx on port 443; Nginx forwards requests to two backend app servers](/otmc-proxy.svg)

*The shape of it. The browser only ever talks to Nginx. Nginx decides which backend handles each request, and it can move, restart, or multiply those backends without the public address ever changing.*

That one move buys you a lot. The proxy gives you a single public entry point and hides the app's real port. It does **TLS termination**: it holds the certificate, decrypts incoming HTTPS, and speaks plain HTTP to your backend over localhost, so your app code never touches certificates. It **load balances** across multiple app copies and routes around one that crashes. It **routes** by URL, so `/api` can hit one backend and `/` another. And it **buffers** slow clients, so a connection trickling in one byte per second ties up the proxy instead of your app.

## 2. Under the flood: how one proxy handles so many connections

The old way to serve connections, the classic Apache model, was one thread (or process) per connection. It feels natural, but it falls apart at scale. Each thread reserves memory for its stack, often a few megabytes, so ten thousand threads can eat tens of gigabytes just sitting idle, and the OS wastes time context-switching between them. This wall even has a name, the **C10K problem**: getting a single machine past ten thousand concurrent connections.

The insight that breaks the wall is that connections are mostly idle. At any given moment almost every connection is just waiting, for the next packet, for a slow uploader, for the database to answer. The actual CPU work takes microseconds; the waiting takes milliseconds. So why pin a whole frozen thread to each wait?

![Thousands of mostly idle connections; the OS readiness list reports only the ready ones to a single-threaded event loop](/otmc-event-loop.svg)

*The event loop. A worker sets its sockets to non-blocking, hands the whole list to the OS, and sleeps until the OS says which ones are ready. Then it does the small, fast work each ready socket needs and loops. It's never frozen on any single connection.*

Here's a way to picture it. A thread-per-connection server is like hiring one waiter per table, where most waiters just stand around because their diners are still reading the menu. Nginx is the one good waiter who walks to a table only when a hand goes up. One waiter serves the whole room, and the readiness list is what tells him which hands are raised without having to check every table.

To use every core, Nginx runs several workers, usually one per CPU core (`worker_processes auto;`), each its own single-threaded loop. Non-blocking sockets, an OS readiness notifier, and the fact that connections sit idle most of the time are together why a modest box holds connection counts that would have needed terabytes of thread stacks the old way.

One caveat, and it comes back later: the loop only works as long as nothing blocks it. A genuinely slow, CPU-heavy task running in the loop would stall every other connection stuck behind it. Proxying fits perfectly because forwarding bytes is fast and I/O-bound.

## 3. The same idea in your language: Node.js and libuv

Node.js handles concurrency the same way at the network layer: one single-threaded JavaScript event loop over non-blocking sockets, using the same OS readiness mechanism. The plumbing lives in a C library called **libuv**, which does the job Nginx implements directly in its own code. But Node adds one piece that Nginx barely needs.

![A single JS event loop sits on libuv, which splits work into network I/O via epoll and a thread pool for file, DNS and crypto work](/otmc-node-libuv.svg)

*Node's architecture. Network work goes through epoll/kqueue, exactly like Nginx. The extra piece is the thread pool. Operations like disk reads and DNS lookups have no non-blocking equivalent at the OS level, so libuv hands them to background threads and keeps the loop free.*

Why the thread pool is there: not everything has a non-blocking version. Network sockets do; the OS will tell you when one is ready without freezing you. But reading a file, resolving a DNS name, and some crypto operations block at the OS level. If Node ran those on the event loop, the loop would freeze on every file read. So libuv keeps a small pool (four threads by default), hands those jobs off, and posts the results back to the loop when they finish. Your JavaScript still feels single-threaded.

The deeper difference is who writes the code that runs on the loop. Nginx runs a configuration file. You declare rules and its battle-tested C does the work, so you basically can't write a slow operation into its loop. Node runs your own JavaScript directly on the loop. That's both the power and the footgun: a heavy synchronous computation, a giant `JSON.parse`, or a runaway regex sits on the one thread and freezes every connection until it's done. It's why CPU-bound work in Node gets pushed off to `worker_threads`, a child process, or a separate service.

One more difference is scaling across cores. Nginx does it with a one-line setting. A plain `node server.js` uses a single core, and to use them all you run several processes (the `cluster` module, a process manager like PM2, or a bunch of containers) behind a load balancer. And that load balancer out front is very often Nginx, which loops us right back to Layer 1. The two aren't rivals. They're the same idea at different layers, and they're often stacked together.

## 4. The obvious objection: if Node already serves connections, why a proxy?

It's a fair question. Node's built-in HTTP server accepts connections just fine on its own: `node server.js` and you're live. So the proxy isn't there because Node can't handle traffic. It's there because of the one fact this whole article keeps circling back to. Node runs your application on a single precious thread, and anything that steals time from that thread steals it from every connection at once. The proxy's whole job is to keep that thread free.

### One process uses one core

A single Node process is one event loop on one core. A real server has plenty of cores sitting idle. The only way to use them is to run several Node processes, and the moment you have more than one, something has to spread incoming connections across them. That something is a load balancer, which is exactly what the reverse proxy already is.

![Nginx sits between the internet and three Node worker processes, one per CPU core](/otmc-division.svg)

*The division of labour. Several single-threaded Node workers, one per core, sit behind one Nginx that spreads connections across them and soaks up everything that would otherwise tie up an event loop.*

### Keeping the event loop clean

Remember the tradeoff from the last two layers: whatever runs on the loop has to be fast and must never block. Several common jobs break that rule, and the proxy takes each one off Node's plate. **TLS handshakes** are CPU-heavy, so Nginx terminates encryption and hands Node plain HTTP. **Slow clients** that trickle a request in one byte at a time would hold a slot in Node's loop for seconds, so Nginx buffers the whole request and forwards it only once it's complete and fast. **Static files** like images, CSS, and bundles are pure I/O that Nginx serves through the kernel's optimized `sendfile` path far more efficiently than a Node handler could, since the handler would otherwise burn loop time on them. The result is that Node only ever sees complete, plaintext, application-shaped requests.

### A hardened front, and easier operations

Nginx is decades-hardened C, tested against malformed requests, oversized headers, and connection-exhaustion attacks. It's far safer to let it parse hostile input from the open internet than to expose your application's own request parser. While it's there it also throws in **gzip compression**, **response caching**, **rate limiting**, and **request-size caps** for free, and it lets Node bind an unprivileged high port like `3000` instead of needing root to own `443`. Operationally it gives you zero-downtime deploys, since Nginx keeps serving and drains connections while you restart the Node workers behind it, plus a single front door for many services and paths.

So the answer isn't about capability. Node can face the internet; it just shouldn't. Its gift is application logic on one fast thread, and the proxy's gift is keeping every cross-cutting, thread-stealing concern away from it.

## 5. The bedrock: I/O, and what "non-blocking" really means

**I/O**, input/output, is any time your program talks to something outside its own CPU and memory: a disk, a socket, a keyboard, a database. The defining trait is that the data lives somewhere the program doesn't control, and fetching it is slow compared to computation. Adding two numbers takes nanoseconds. Waiting for a packet takes milliseconds, a million times longer. That gap is the reason all of this machinery exists. The real question is never what I/O is, but what your thread does while it waits.

![Two timelines for the same wait: blocking leaves the thread frozen, non-blocking serves other connections during the window](/otmc-blocking.svg)

*The whole difference. Same wait, same finish time. Blocking spends the window asleep and idle. Non-blocking spends it serving other connections. One thread doing the work of thousands.*

A normal `read()` is **blocking**. If the data isn't there, the OS takes your thread off the CPU and won't wake it until data arrives. It's simple to reason about and perfect for doing one thing at a time, but a blocking thread can only ever wait on one thing. That's the wasteful gray bar above, and the root of the thread-per-connection wall.

Flip the socket into **non-blocking** mode (the `O_NONBLOCK` flag) and `read()` returns right away every time. If data is ready, you get it. If not, it returns `-1` with `errno` set to `EAGAIN`, which is the kernel saying "nothing right now; I'd have had to block you, so go do something else and check back later." That's not an error. It's the normal "nothing yet" signal, and it's what frees the thread to go serve other connections.

But non-blocking on its own has a trap. Loop over your sockets calling `read()` and you mostly get `EAGAIN` back, burning 100% of a core asking "ready yet?" over and over. This is the hole epoll fills. Instead of spinning, the loop calls `epoll_wait` and sleeps at zero CPU, like a blocking call except it's waiting on all of its sockets at once. The kernel wakes it only when something is actually ready, and only then does it call the non-blocking `read()`, which now returns real data instead of `EAGAIN`.

> **The winning combination.** Non-blocking sockets, so no single connection can freeze the thread, plus epoll, so the thread sleeps efficiently instead of busy-polling and wakes only for sockets that are genuinely ready. Blocking I/O gives you simplicity but only one thing at a time. Non-blocking gives you the freedom to juggle thousands. epoll gives back the efficient sleeping you'd otherwise lose. That pairing is the actual engine inside both Nginx and Node, and the answer to every "how does it handle so many connections" we started with. The last layer takes that readiness mechanism apart: what epoll does, and why it costs almost nothing no matter how many connections you're watching.

## 6. The mechanism: what epoll does, and how

Everything above rests on one Linux facility. **epoll** exists to answer a single question cheaply: of the thousands of sockets I'm watching, which ones have something for me right now? You tell it once which sockets you care about, and from then on you just ask it, again and again, for the ready ones.

![A loop registers sockets with epoll; a kernel callback appends ready ones to the ready list that the loop reads back](/otmc-epoll.svg)

*What the kernel holds. You register each socket once into an interest list. When a packet arrives, the kernel adds that socket to a ready list. When the loop asks, it gets that ready list back, already built.*

It works in three moves. You **register** each socket once, at setup. The kernel **watches** them for you: when a packet for a socket arrives, a small callback appends that socket to a ready list, so the list is built as data comes in rather than when you ask. Then the loop **waits**: it sleeps at zero CPU until at least one socket is ready, and wakes up with only the ready ones in hand. No scanning, no busy-polling.

That last part is the whole trick. The cost of a wait scales with how many sockets are ready, not how many you're watching. The older `select()` and `poll()` got this wrong: they re-checked every socket on every call, so the cost grew with the total. epoll keeps the registration around and the ready list pre-built, and that's the entire reason one core can babysit hundreds of thousands of sockets at once. (epoll is Linux-only. `kqueue` on macOS and BSD and IOCP on Windows do the same job, which is why libuv wraps all three behind one interface.)

## The whole machine, assembled

Read it from the bottom up and the layers fit together. The OS gives you non-blocking I/O so a thread is never frozen on one socket. epoll makes that usable, letting the thread sleep cheaply and wake only for ready sockets, while the kernel keeps the ready list up to date through callbacks. An event loop built on that pair lets one thread, on one core, look after tens of thousands of connections. Nginx packages the loop as a configurable proxy and runs one per core. Node.js packages the same loop for your own code and adds a thread pool for the blocking odds and ends. And Nginx often sits out front of a fleet of Node processes, spreading the load: the top layer balancing across copies of the layer below it.

One thread, a million connections. It isn't magic. It's just refusing to let a thread sit frozen when there's other work it could be doing.
