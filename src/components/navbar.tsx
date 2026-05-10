"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
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
                  "relative font-pixel px-2 py-1 text-sm tracking-tight transition-colors rounded-none",
                  active
                    ? "text-blueprint"
                    : "text-foreground/70 hover:text-blueprint"
                )}
              >
                {label}
                {active && (
                  <motion.span
                    layoutId="nav-underline"
                    className="absolute left-0 right-0 -bottom-px h-0.5 bg-blueprint"
                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                  />
                )}
              </Link>
            </li>
          );
        })}
      </ul>
      <ModeToggle />
    </nav>
  );
}
