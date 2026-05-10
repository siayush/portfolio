"use client";

import type { Heading } from "@/data/blog";
import { useEffect, useState } from "react";

const ACTIVE_OFFSET = 120;

export default function BlogTOC({ headings }: { headings: Heading[] }) {
  const [activeSlug, setActiveSlug] = useState<string | null>(
    headings[0]?.slug ?? null,
  );

  useEffect(() => {
    if (headings.length === 0) return;

    let ticking = false;
    const update = () => {
      ticking = false;
      let current: string | null = headings[0].slug;
      for (const h of headings) {
        const el = document.getElementById(h.slug);
        if (!el) continue;
        if (el.getBoundingClientRect().top - ACTIVE_OFFSET <= 0) {
          current = h.slug;
        } else {
          break;
        }
      }
      setActiveSlug(current);
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <aside
      aria-label="On this page"
      className="hidden xl:block fixed top-24 left-8 w-[240px] max-h-[calc(100vh-8rem)] overflow-y-auto pr-4"
    >
      <h2 className="font-pixel text-[10px] tracking-tight text-muted-foreground">
        ON THIS PAGE
      </h2>
      <nav className="mt-4">
        <ul className="flex flex-col gap-1.5">
          {headings.map((h, i) => {
            const isActive = h.slug === activeSlug;
            const label = h.text.replace(/^\d+\.\s+/, "");
            return (
              <li
                key={`${h.slug}-${i}`}
                className={
                  "flex items-baseline gap-2 " +
                  (h.level === 3 ? "pl-4 text-[12px]" : "text-[13px]")
                }
              >
                <span
                  aria-hidden="true"
                  className={
                    "select-none " +
                    (isActive ? "text-blueprint" : "text-muted-foreground/70")
                  }
                >
                  •
                </span>
                <a
                  href={`#${h.slug}`}
                  aria-current={isActive ? "location" : undefined}
                  className={
                    "font-serif leading-snug transition-colors " +
                    (isActive
                      ? "text-blueprint"
                      : "text-foreground/60 hover:text-blueprint")
                  }
                >
                  {label}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
