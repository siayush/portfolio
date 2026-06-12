import Link from "next/link";

export default function NotFound() {
  return (
    <section className="flex flex-col">
      <p className="font-pixel text-[10px] uppercase tracking-[0.15em] text-blueprint">
        [ ERROR 404 ]
      </p>
      <h1 className="mt-3 font-serif text-foreground text-3xl sm:text-4xl leading-none tracking-tight">
        Page not found.
      </h1>
      <div className="mt-3 h-px bg-foreground/40" />
      <p className="mt-6 max-w-[600px] font-serif text-foreground/85 text-base leading-snug">
        This page doesn&apos;t exist, or it moved without leaving a forwarding
        address.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex items-center gap-1.5 font-pixel text-xs tracking-tight text-blueprint hover:text-foreground transition-colors"
      >
        ← BACK HOME
      </Link>
    </section>
  );
}
