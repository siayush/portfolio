"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ModeToggle } from "@/components/mode-toggle";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "HOME" },
  { href: "/projects", label: "PROJECTS" },
  { href: "/blog", label: "WRITING" },
];

export default function NavBar() {
  const pathname = usePathname();

  return (
    <nav className="flex justify-between items-center mb-10">
      <ul className="flex items-center gap-1 -ml-2">
        {links.map(({ href, label }) => {
          const active =
            href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "font-pixel px-2 py-1 text-xs tracking-tight transition-colors rounded-none",
                  active
                    ? "text-blueprint border-b-2 border-blueprint"
                    : "text-muted-foreground hover:text-blueprint"
                )}
              >
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
      <ModeToggle />
    </nav>
  );
}
