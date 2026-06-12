import { SocialLinks } from "@/components/social-links";

export default function Footer() {
  return (
    <footer className="mt-auto pt-16">
      <div className="h-px bg-foreground/30" />
      <div className="mt-3 flex items-center justify-center">
        <SocialLinks />
      </div>
    </footer>
  );
}
