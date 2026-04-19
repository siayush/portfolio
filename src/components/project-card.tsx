import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
    <Card className="flex flex-col overflow-hidden border hover:border-foreground/20 hover:shadow-md transition-all duration-300 ease-out h-full">
      <CardHeader className="px-4 pt-4 pb-2">
        <div className="space-y-1.5">
          <CardTitle className="text-base font-semibold tracking-tight">
            {title}
          </CardTitle>
          <div className="hidden font-sans text-xs underline print:visible">
            {link?.replace("https://", "").replace("www.", "").replace("/", "")}
          </div>
          <p className="text-pretty font-sans text-xs leading-relaxed text-muted-foreground">
            {description}
          </p>
        </div>
      </CardHeader>
      <CardContent className="mt-auto px-4 pb-3">
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {tags.map((tag) => (
              <Badge
                className="px-1.5 py-0 text-[10px] font-normal"
                variant="secondary"
                key={tag}
              >
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
      {links && links.length > 0 && (
        <CardFooter className="px-4 pb-4 pt-0">
          <div className="flex flex-row flex-wrap items-start gap-1.5">
            {links.map((l, idx) => (
              <Link
                href={l.href}
                key={idx}
                target="_blank"
                aria-label={`${title} — ${l.type}`}
              >
                <Badge className="flex gap-1.5 px-2 py-1 text-[10px] hover:bg-primary/80">
                  {l.icon}
                  {l.type}
                </Badge>
              </Link>
            ))}
          </div>
        </CardFooter>
      )}
    </Card>
  );
}
