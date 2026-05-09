import { Card } from "@/components/ui/card";
import { ChevronRightIcon } from "lucide-react";
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
    <Link
      href={href || "#"}
      target={href ? "_blank" : undefined}
      className="group block"
    >
      <Card className="overflow-hidden border border-foreground/15 transition-colors hover:border-foreground/40 rounded-none bg-transparent">
        {/* Stripe band */}
        <div className="bg-stripes-blueprint h-2 border-b border-foreground/15" />

        <div className="px-4 py-4">
          <div className="flex items-baseline justify-between gap-x-3">
            <h3 className="inline-flex items-center font-serif text-foreground text-lg font-medium tracking-tight truncate">
              {title}
              <ChevronRightIcon className="size-4 ml-0.5 translate-x-0 opacity-0 transition-all duration-300 ease-out group-hover:translate-x-1 group-hover:opacity-100" />
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
              <div className="mt-3 mb-3 leader-dotted-card" aria-hidden="true" />
              <p className="font-serif text-sm leading-snug text-foreground/85">
                {description}
              </p>
            </>
          )}
        </div>
      </Card>
    </Link>
  );
};
