import { ScrambleText } from "@/components/scramble-text"
import { ProjectCard } from "@/components/project-card"
import { Metadata } from "next"

const projects = [
  {
    title: "ingestor",
    description:
      "scalable log ingestion and query system with real-time pipelines, advanced filtering, and a dashboard for exploring logs at volume",
    role: "creator",
    technologies: ["go", "kafka", "elastic search", "docker", "kibana", "react"],
    href: "https://github.com/siAyush/ingestor",
  },
  {
    title: "monkey",
    description:
      "tree-walking interpreter for the monkey language, built from scratch in go. supports first-class functions, closures, arrays and hash maps",
    role: "creator",
    technologies: ["go", "interpreter", "compilers"],
    href: "https://github.com/siAyush/monkey",
  },
  {
    title: "scratchml",
    description:
      "classic machine learning models and algorithms implemented from scratch with only numpy",
    role: "creator",
    technologies: ["python", "numpy"],
    href: "https://github.com/siAyush/ScratchML",
  },
  {
    title: "natours",
    description:
      "a tour booking app with authentication, authorization and a restful node.js backend",
    role: "creator",
    technologies: ["nodejs", "expressjs", "mongodb"],
    href: "https://github.com/siAyush/Natours",
  },
]

export default function ProjectsPage() {
  return (
    <main>
      <h1 className="text-4xl font-bold mb-8 text-white">
        <span className="text-accent accent-glow mr-2">*</span>
        <ScrambleText text="projects" />
      </h1>

      <p className="text-gray-400 mb-6 leading-relaxed">
        here are some of the projects i&apos;ve worked on. mostly backend
        systems, interpreters and things built from scratch to understand how
        they work.
      </p>

      <div className="space-y-6">
        {projects.map((project) => (
          <ProjectCard key={project.title} {...project} />
        ))}
      </div>
    </main>
  )
}

export const metadata: Metadata = {
  title: "Projects",
  description: "Some of the projects I've worked on.",
  openGraph: {
    images: [
      {
        url: "https://siayush.vercel.app/og/home?title=projects",
      },
    ],
  },
}
