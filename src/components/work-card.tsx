import { Card } from "@/components/ui/card";
import { Building } from "lucide-react";
import Link from "next/link";

interface WorkCardProps {
  title: string;
  subtitle?: string;
  href?: string;
  period: string;
  description?: string;
}

export const WorkCard = ({
  title,
  subtitle,
  href,
  period,
  description,
}: WorkCardProps) => {
  return (
    <Card className="group flex flex-col overflow-hidden border border-foreground/15 dark:border-foreground/25 hover:border-foreground/40 dark:hover:border-foreground/55 transition-colors duration-200 h-full rounded-none bg-transparent">
      {/* Stripe band */}
      <div className="bg-stripes-blueprint h-2 border-b border-foreground/15 dark:border-foreground/25" />

      <div className="flex flex-col flex-1 px-4 py-4">
        <div className="flex items-baseline justify-between gap-x-3">
          <h3 className="font-serif text-foreground text-lg font-medium tracking-tight truncate">
            {title}
          </h3>
          <div className="font-pixel text-[10px] tabular-nums text-muted-foreground shrink-0">
            {period}
          </div>
        </div>

        {subtitle && (
          <div className="mt-1 font-pixel text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
            [ {subtitle} ]
          </div>
        )}

        {description && (
          <>
            <div className="mt-4 mb-3 leader-dotted-card" aria-hidden="true" />
            <p className="font-serif text-sm leading-snug text-foreground/85">
              {description}
            </p>
          </>
        )}

        {href && (
          <div className="mt-4 flex flex-row flex-wrap items-center gap-x-4 gap-y-1.5">
            <Link
              href={href}
              target="_blank"
              aria-label={`${title} — Company website`}
              className="inline-flex items-center gap-1.5 font-pixel text-[10px] tracking-tight text-blueprint hover:text-foreground transition-colors"
            >
              <span className="size-3 inline-flex items-center justify-center">
                <Building className="size-3" />
              </span>
              <span>[ COMPANY →&nbsp;]</span>
            </Link>
          </div>
        )}
      </div>
    </Card>
  );
};
