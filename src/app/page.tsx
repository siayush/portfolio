import BlurFade from "@/components/blur-fade";
import BlurFadeText from "@/components/blur-fade-text";
import { ProjectCard } from "@/components/project-card";
import { WorkCard } from "@/components/work-card";
import { DATA } from "@/data/resume";
import Link from "next/link";
import { MailIcon } from "lucide-react";
import { Icons } from "@/components/icons";

const BLUR_FADE_DELAY = 0.04;

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <h2 className="font-pixel text-foreground text-lg sm:text-xl tracking-tight">
        {String(children).toUpperCase()}
      </h2>
      <div className="h-px bg-foreground/30" />
    </div>
  );
}

export default function Page() {
  return (
    <main className="flex flex-col min-h-[100dvh] space-y-12">
      <section id="hero">
        <div className="mx-auto w-full max-w-2xl space-y-6">
          <div className="flex-col flex flex-1 space-y-3">
            <BlurFadeText
              delay={BLUR_FADE_DELAY}
              className="font-pixel text-blueprint text-3xl sm:text-5xl xl:text-6xl/none leading-none tracking-tight"
              yOffset={8}
              text={`I'M ${DATA.name.split(" ")[0].toUpperCase()}.`}
            />
            <BlurFade delay={BLUR_FADE_DELAY}>
              <p className="max-w-[600px] font-serif text-foreground text-base sm:text-lg leading-snug">
                {DATA.description}
              </p>
            </BlurFade>
            <BlurFade delay={BLUR_FADE_DELAY * 1.5}>
              <div className="flex items-center gap-4 pt-1">
                <Link
                  href={`mailto:${DATA.contact.email}`}
                  aria-label="Send email"
                  className="inline-flex items-center justify-center text-muted-foreground hover:text-blueprint transition-colors"
                >
                  <MailIcon className="size-4" />
                </Link>
                <Link
                  href={DATA.contact.social.GitHub.url}
                  aria-label="GitHub profile"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center text-muted-foreground hover:text-blueprint transition-colors"
                >
                  <Icons.github className="size-4" />
                </Link>
                <Link
                  href={DATA.contact.social.LinkedIn.url}
                  aria-label="LinkedIn profile"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center text-muted-foreground hover:text-blueprint transition-colors"
                >
                  <Icons.linkedin className="size-4" />
                </Link>
                <Link
                  href={DATA.contact.social.X.url}
                  aria-label="X (Twitter) profile"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center text-muted-foreground hover:text-blueprint transition-colors"
                >
                  <Icons.x className="size-4" />
                </Link>
              </div>
            </BlurFade>
            <BlurFade delay={BLUR_FADE_DELAY * 1.8}>
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-[1fr_320px] gap-x-6 gap-y-3 items-start">
                <div className="space-y-2">
                  <p className="font-pixel text-[10px] tracking-[0.15em] text-blueprint">
                    RESOLVE
                  </p>
                  <p className="font-serif text-sm leading-snug text-foreground/85">
                    Most engineering starts as a tangle and quietly converges
                    on the curve underneath. The interesting work is in the
                    middle frames — the part where it doesn&apos;t look like
                    anything yet.
                  </p>
                  <p className="font-pixel text-[9px] tracking-[0.15em] text-muted-foreground pt-1">
                    8S LOOP · 4 CUBIC BEZIERS
                  </p>
                </div>
                <figure className="w-full">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/loop-hero.svg"
                    alt="Tangled curve resolving into a smooth circle"
                    width={320}
                    height={180}
                    decoding="async"
                    className="w-full h-auto"
                  />
                </figure>
              </div>
            </BlurFade>
          </div>
        </div>
      </section>

      <section id="about" className="space-y-3">
        <BlurFade delay={BLUR_FADE_DELAY * 2}>
          <SectionHeading>About</SectionHeading>
        </BlurFade>
        <BlurFade delay={BLUR_FADE_DELAY * 2}>
          <p className="font-pixel text-[10px] uppercase tracking-[0.15em] text-blueprint mt-3">
            [ BREAK / UNDERSTAND / BUILD ]
          </p>
          <p className="font-serif text-foreground text-base leading-relaxed mt-3 max-w-full">
            {DATA.summary}
          </p>
        </BlurFade>
      </section>

      <section id="skills" className="space-y-3">
        <BlurFade delay={BLUR_FADE_DELAY * 3}>
          <SectionHeading>Skills</SectionHeading>
        </BlurFade>
        <BlurFade delay={BLUR_FADE_DELAY * 3}>
          <div className="flex flex-col gap-y-5 mt-3">
            <div>
              <h3 className="font-serif text-foreground text-base font-medium mb-1.5">
                Languages
              </h3>
              <ul className="flex flex-wrap gap-x-5 gap-y-1 font-serif text-foreground/85">
                {DATA.languages.map((skill) => (
                  <li
                    key={skill}
                    className="flex items-baseline gap-1.5"
                  >
                    <span
                      aria-hidden="true"
                      className="text-foreground/40 select-none"
                    >
                      •
                    </span>
                    <span>{skill}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-serif text-foreground text-base font-medium mb-1.5">
                Technologies
              </h3>
              <ul className="flex flex-wrap gap-x-5 gap-y-1 font-serif text-foreground/85">
                {DATA.technologies.map((skill) => (
                  <li
                    key={skill}
                    className="flex items-baseline gap-1.5"
                  >
                    <span
                      aria-hidden="true"
                      className="text-foreground/40 select-none"
                    >
                      •
                    </span>
                    <span>{skill}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </BlurFade>
      </section>

      <section id="projects" className="space-y-3">
        <BlurFade delay={BLUR_FADE_DELAY * 4}>
          <SectionHeading>Projects</SectionHeading>
        </BlurFade>
        <div className="flex flex-col gap-y-3 mt-3">
          {DATA.projects.map((project) => (
            <BlurFade key={project.title} delay={BLUR_FADE_DELAY * 4}>
              <ProjectCard
                title={project.title}
                description={project.description}
                tags={project.technologies}
                links={project.links}
              />
            </BlurFade>
          ))}
        </div>
      </section>

      <section id="work" className="space-y-3">
        <BlurFade delay={BLUR_FADE_DELAY * 5}>
          <SectionHeading>Worked With</SectionHeading>
        </BlurFade>
        <div className="flex flex-col gap-y-3 mt-3">
          {DATA.work.map((work) => (
            <BlurFade key={work.company} delay={BLUR_FADE_DELAY * 5}>
              <WorkCard
                title={work.company}
                subtitle={work.title}
                href={work.href}
                period={`${work.start} - ${work.end ?? "Present"}`}
                description={work.description}
              />
            </BlurFade>
          ))}
        </div>
      </section>
    </main>
  );
}
