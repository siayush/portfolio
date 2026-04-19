import BlurFade from "@/components/blur-fade";
import BlurFadeText from "@/components/blur-fade-text";
import { ProjectCard } from "@/components/project-card";
import { WorkCard } from "@/components/work-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { DATA } from "@/data/resume";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { MailIcon } from "lucide-react";
import { Icons } from "@/components/icons";
import { buttonVariants } from "@/components/ui/button";

const BLUR_FADE_DELAY = 0.04;

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
      <span className="text-brand font-mono" aria-hidden="true">
        &gt;
      </span>
      {children}
    </h2>
  );
}

export default function Page() {
  return (
    <main className="flex flex-col min-h-[100dvh] space-y-12">
      <section id="hero">
        <div className="mx-auto w-full max-w-2xl space-y-8">
          <div className="gap-6 flex justify-between items-start">
            <div className="flex-col flex flex-1 space-y-3">
              <BlurFadeText
                delay={BLUR_FADE_DELAY}
                className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none"
                yOffset={8}
                text={`I'm ${DATA.name.split(" ")[0]}`}
              />
              <BlurFadeText
                className="max-w-[600px] text-muted-foreground md:text-lg"
                delay={BLUR_FADE_DELAY}
                text={DATA.description}
              />
              <BlurFade delay={BLUR_FADE_DELAY * 1.5}>
                <div className="flex items-center gap-1 -ml-2 pt-1">
                  <Link
                    href={`mailto:${DATA.contact.email}`}
                    aria-label="Send email"
                    className={cn(
                      buttonVariants({ variant: "ghost", size: "icon" }),
                      "size-10 text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <MailIcon className="size-5" />
                  </Link>
                  <Link
                    href={DATA.contact.social.GitHub.url}
                    aria-label="GitHub profile"
                    className={cn(
                      buttonVariants({ variant: "ghost", size: "icon" }),
                      "size-10 text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <Icons.github className="size-5" />
                  </Link>
                  <Link
                    href={DATA.contact.social.LinkedIn.url}
                    aria-label="LinkedIn profile"
                    className={cn(
                      buttonVariants({ variant: "ghost", size: "icon" }),
                      "size-10 text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <Icons.linkedin className="size-5" />
                  </Link>
                  <Link
                    href={DATA.contact.social.X.url}
                    aria-label="X (Twitter) profile"
                    className={cn(
                      buttonVariants({ variant: "ghost", size: "icon" }),
                      "size-10 text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <Icons.x className="size-5" />
                  </Link>
                </div>
              </BlurFade>
            </div>
            <BlurFade delay={BLUR_FADE_DELAY}>
              <Avatar className="size-28 border-2 border-border shadow-sm">
                <AvatarImage alt={DATA.name} src={DATA.avatarUrl} />
                <AvatarFallback>{DATA.initials}</AvatarFallback>
              </Avatar>
            </BlurFade>
          </div>
        </div>
      </section>

      <section id="about" className="space-y-3">
        <BlurFade delay={BLUR_FADE_DELAY * 2}>
          <SectionHeading>About</SectionHeading>
        </BlurFade>
        <BlurFade delay={BLUR_FADE_DELAY * 2}>
          <p className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
            [ break → understand → build ]
          </p>
          <div className="prose max-w-full text-pretty font-sans text-sm leading-relaxed dark:prose-invert mt-3">
            {DATA.summary}
          </div>
        </BlurFade>
      </section>

      <section id="skills">
        <BlurFade delay={BLUR_FADE_DELAY * 3}>
          <div className="flex min-h-0 flex-col gap-y-4">
            <SectionHeading>Skills</SectionHeading>
            <div className="space-y-2">
              <h3 className="text-[11px] uppercase tracking-widest font-medium text-muted-foreground">
                Languages
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {DATA.languages.map((skill) => (
                  <Badge key={skill}>{skill}</Badge>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-[11px] uppercase tracking-widest font-medium text-muted-foreground">
                Technologies
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {DATA.technologies.map((skill) => (
                  <Badge key={skill}>{skill}</Badge>
                ))}
              </div>
            </div>
          </div>
        </BlurFade>
      </section>

      <section id="projects">
        <div className="flex min-h-0 flex-col gap-y-4">
          <BlurFade delay={BLUR_FADE_DELAY * 4}>
            <SectionHeading>Projects</SectionHeading>
          </BlurFade>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {DATA.projects.map((project) => (
              <BlurFade key={project.title} delay={BLUR_FADE_DELAY * 4}>
                <ProjectCard
                  key={project.title}
                  title={project.title}
                  description={project.description}
                  tags={project.technologies}
                  links={project.links}
                />
              </BlurFade>
            ))}
          </div>
        </div>
      </section>

      <section id="work">
        <div className="flex min-h-0 flex-col gap-y-4">
          <BlurFade delay={BLUR_FADE_DELAY * 5}>
            <SectionHeading>Worked With</SectionHeading>
          </BlurFade>
          <div className="flex flex-col gap-y-3">
            {DATA.work.map((work) => (
              <BlurFade key={work.company} delay={BLUR_FADE_DELAY * 5}>
                <WorkCard
                  key={work.company}
                  title={work.company}
                  subtitle={work.title}
                  href={work.href}
                  period={`${work.start} - ${work.end ?? "Present"}`}
                  description={work.description}
                />
              </BlurFade>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
