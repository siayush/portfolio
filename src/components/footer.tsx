import { SocialLinks } from "@/components/social-links";

export default function Footer() {
  return (
    <footer className="mt-16">
      <div className="h-px bg-foreground/30" />
      <div className="mt-3 flex items-center">
        <SocialLinks />
      </div>
    </footer>
  );
}
