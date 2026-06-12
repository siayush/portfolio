import { DATA } from "@/data/resume";
import { MailIcon } from "lucide-react";
import Link from "next/link";

const LINKS = [
  {
    label: "Send email",
    href: `mailto:${DATA.contact.email}`,
    icon: MailIcon,
    external: false,
  },
  ...Object.entries(DATA.contact.social).map(([name, social]) => ({
    label: `${name} profile`,
    href: social.url,
    icon: social.icon,
    external: true,
  })),
];

export function SocialLinks() {
  return (
    // p-2 keeps the icons small while giving each link a ~32px touch target;
    // -ml-2 cancels the first link's padding so icons stay flush left.
    <div className="flex items-center -ml-2">
      {LINKS.map(({ label, href, icon: Icon, external }) => (
        <Link
          key={href}
          href={href}
          aria-label={label}
          target={external ? "_blank" : undefined}
          rel={external ? "noopener noreferrer" : undefined}
          className="inline-flex items-center justify-center p-2 text-muted-foreground hover:text-blueprint transition-colors"
        >
          <Icon className="size-4" />
        </Link>
      ))}
    </div>
  );
}
