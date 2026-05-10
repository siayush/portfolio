import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import Link from "next/link";

interface Props {
  title: string;
  description: string;
  tags: readonly string[];
  link?: string;
  links?: readonly {
    icon: React.ReactNode;
    type: string;
    href: string;
  }[];
}

export function ProjectCard({ title, description, tags, link, links }: Props) {
  return (
    <Card className="group flex flex-col overflow-hidden border border-foreground/15 dark:border-foreground/25 hover:border-foreground/40 dark:hover:border-foreground/55 transition-colors duration-200 h-full rounded-none bg-transparent">
      {/* Stripe band */}
      <div className="bg-stripes-blueprint h-2 border-b border-foreground/15 dark:border-foreground/25" />

      <div className="flex flex-col flex-1 px-4 py-4">
        <h3 className="font-serif text-foreground text-lg font-medium tracking-tight leading-tight">
          {title}
        </h3>
        <div className="hidden font-sans text-xs underline print:visible mt-0.5">
          {link?.replace("https://", "").replace("www.", "").replace("/", "")}
        </div>
        <p className="mt-2 font-serif text-sm leading-snug text-foreground/85">
          {description}
        </p>

        {tags && tags.length > 0 && (
          <>
            <div className="mt-4 mb-3 leader-dotted-card" aria-hidden="true" />
            <div className="flex flex-wrap gap-1">
              {tags.map((tag) => (
                <Badge
                  className="rounded-none border-foreground/30 bg-transparent text-foreground text-[10px] font-normal px-1.5 py-0 hover:border-foreground/60"
                  variant="outline"
                  key={tag}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </>
        )}

        {links && links.length > 0 && (
          <div className="mt-4 flex flex-row flex-wrap items-center gap-x-4 gap-y-1.5">
            {links.map((l, idx) => (
              <Link
                href={l.href}
                key={idx}
                target="_blank"
                aria-label={`${title} — ${l.type}`}
                className="inline-flex items-center gap-1.5 font-pixel text-[10px] tracking-tight text-blueprint hover:text-foreground transition-colors"
              >
                <span className="size-3 inline-flex items-center justify-center">
                  {l.icon}
                </span>
                <span>[ {l.type.toUpperCase()} →&nbsp;]</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}
