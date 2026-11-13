import type { Item } from "@/components/section-list"

export type Project = Item & {
  technologies: string[]
}

// Single source for project data, most notable first. The home page features
// the first two; /projects lists them all.
export const projects: Project[] = [
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
