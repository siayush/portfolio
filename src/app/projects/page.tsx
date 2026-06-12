import BlurFade from "@/components/blur-fade";
import { ProjectCard } from "@/components/project-card";
import { DATA } from "@/data/resume";

export const metadata = {
  title: "Projects",
  description: "Things I've built",
};

export const dynamic = "force-static";

const BLUR_FADE_DELAY = 0.04;

export default function ProjectsPage() {
  const projects = DATA.projects;

  return (
    <section>
      <BlurFade delay={BLUR_FADE_DELAY}>
        <h1 className="font-serif text-foreground text-3xl sm:text-4xl leading-none tracking-tight">
          Things I&apos;ve built.
        </h1>
        <div className="mt-3 h-px bg-foreground/40" />
      </BlurFade>

      <div className="mt-10 flex flex-col gap-y-3">
        {projects.map((project, id) => (
          <BlurFade
            key={project.title}
            delay={BLUR_FADE_DELAY * 2 + id * 0.05}
          >
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
  );
}
