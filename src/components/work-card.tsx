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
      <Card className="border p-4 transition-colors hover:border-foreground/20">
        <div className="flex items-center justify-between gap-x-3">
          <h3 className="inline-flex items-center font-semibold text-sm tracking-tight">
            {title}
            <ChevronRightIcon className="size-4 ml-0.5 translate-x-0 opacity-0 transition-all duration-300 ease-out group-hover:translate-x-1 group-hover:opacity-100" />
          </h3>
          <div className="text-xs tabular-nums text-muted-foreground shrink-0">
            {period}
          </div>
        </div>
        {subtitle && (
          <div className="mt-1 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
            {subtitle}
          </div>
        )}
        {description && (
          <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
            {description}
          </p>
        )}
      </Card>
    </Link>
  );
};
