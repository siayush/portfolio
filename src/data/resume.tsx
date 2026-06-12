import { Icons } from "@/components/icons";

export const DATA = {
  name: "Ayush Gupta",
  location: "Delhi, India",
  description: "Software Engineer",
  summary:
    "software engineer working on backend, databases, and system architecture. drawn to low-level engineering and the details of how things actually work under the hood.",
  languages: ["C", "Go", "Typescript", "JavaScript", "Python"],
  technologies: [
    "MySQL",
    "MongoDB",
    "Elastic Search",
    "React",
    "NodeJs",
    "Docker",
    "Kafka",
    "AWS",
    "Redis",
  ],
  contact: {
    email: "siayush.gupta@gmail.com",
    social: {
      GitHub: {
        url: "https://github.com/siAyush",
        icon: Icons.github,
      },
      LinkedIn: {
        url: "https://www.linkedin.com/in/siayush/",
        icon: Icons.linkedin,
      },
      X: {
        url: "https://x.com/siAyushh",
        icon: Icons.x,
      },
    },
  },

  work: [
    {
      company: "Primathon",
      href: "https://primathon.in/",
      title: "SDE Backend",
      start: "May 2025",
      end: "Present",
      description:
        "building backend services and APIs. focused on performance, scalability, and clean system design.",
    },
    {
      company: "Infogain",
      href: "https://www.infogain.com/",
      title: "Software Engineer",
      start: "Dec 2021",
      end: "April 2025",
      description:
        "built server-side applications and APIs, working closely with the frontend team on integration. introduced a micro-frontend architecture for modular development, raised test coverage from 40% to 82%, led the Google Tag Manager rollout, and deployed services on AWS.",
    },
    {
      company: "NNT",
      href: "https://www.linkedin.com/company/nggawe-nirman/",
      title: "Software Engineer Intern",
      start: "June 2021",
      end: "Nov 2021",
      description:
        "built and integrated REST APIs, migrated legacy class components to functional ones, and added test coverage that cut issue-identification time by ~30%.",
    },
  ],

  projects: [
    {
      title: "Ingestor",
      description:
        "scalable log ingestion and query system with real-time pipelines, advanced filtering, and a dashboard for exploring logs at volume.",
      technologies: [
        "Go",
        "Kafka",
        "Elastic Search",
        "Docker",
        "Kibana",
        "React",
      ],
      links: [
        {
          type: "Source",
          href: "https://github.com/siAyush/ingestor",
          icon: <Icons.github className="size-3" />,
        },
      ],
    },
    {
      title: "ScratchML",
      description:
        "classic machine learning models and algorithms implemented from scratch with only NumPy.",
      technologies: ["Python", "NumPy"],
      links: [
        {
          type: "Source",
          href: "https://github.com/siAyush/ScratchML",
          icon: <Icons.github className="size-3" />,
        },
      ],
    },
    {
      title: "Natours",
      description:
        "a tour booking app with authentication, authorization, and a RESTful Node.js backend.",
      technologies: ["NodeJS", "ExpressJs", "MongoDB"],
      links: [
        {
          type: "Source",
          href: "https://github.com/siAyush/Natours",
          icon: <Icons.github className="size-3" />,
        },
      ],
    },
    {
      title: "Monkey",
      description:
        "tree-walking interpreter for the Monkey language, built from scratch in Go. supports first-class functions, closures, arrays, and hash maps.",
      technologies: ["Go", "Interpreter", "Compilers"],
      links: [
        {
          type: "Source",
          href: "https://github.com/siAyush/monkey",
          icon: <Icons.github className="size-3" />,
        },
      ],
    },
  ],
} as const;
