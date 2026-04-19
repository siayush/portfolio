import { Icons } from "@/components/icons";

export const DATA = {
  name: "Ayush Gupta",
  initials: "AG",
  url: "https://github.com/siAysuh",
  location: "Delhi, India",
  locationLink: "https://www.google.com/maps/place/Delhi",
  description: "Software Engineer",
  summary:
    "software engineer working on backend, databases, and system architecture. drawn to low-level engineering and the details of how things actually work under the hood.",
  avatarUrl: "https://avatars.githubusercontent.com/u/28400861?v=4",
  languages: ["C", "Go", "Typescript", "JavaScript", "Python", "SQL"],
  technologies: [
    "Postgres",
    "MongoDB",
    "Elastic Search",
    "React",
    "NextJs",
    "NodeJs",
    "ExpressJs",
    "Docker",
    "Kafka",
    "AWS",
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
      badges: [],
      location: "Hybrid",
      title: "SDE Backend",
      logoUrl: "/atomic.png",
      start: "May 2025",
      end: "Present",
      description: "Software Engineer with a focus on backend development.",
    },
    {
      company: "Infogain",
      href: "https://www.infogain.com/",
      badges: [],
      location: "Remote",
      title: "Software Engineer",
      logoUrl: "/atomic.png",
      start: "Dec 2021",
      end: "April 2025",
      description:
        "Implemented server-side applications using Node.js, ensuring efficient handling of backend logic. Collaborated closely with the frontend team to seamlessly integrate APIs into the frontend, ensuring smooth functionality and user experience across the application.  Implemented micro frontend architecture, enabling modular development and seamless integration of multiple frontend applications for improved scalability and maintainability.  Increased code coverage from 40% to 82% by writing comprehensive unit and integration tests, ensuring greater reliability and maintainability. Led the integration of Google Tag Manager (GTM) for improved tracking and analytics. Worked with AWS to deploy and scale applications",
    },
    {
      company: "NNT",
      href: "https://www.linkedin.com/company/nggawe-nirman/",
      badges: [],
      location: "Remote",
      title: "Software Engineer Intern",
      logoUrl: "/atomic.png",
      start: "June 2021",
      end: "Nov 2021",
      description:
        "Created and integrated REST APIs with frontend components using Node.js, facilitating seamless data retrieval and display. Contributed to the codebase by converting class-based components to functional components, improving performance, maintainability. Conducted testing and debugging, achieving 95% functionality and 30% faster issue identification with Jest.",
    },
  ],

  projects: [
    {
      title: "ingestor",
      description:
        "Efficiently manage and query vast log data volumes with a scalable Log Ingestor and Query Interface, featuring real-time ingestion, advanced filtering, and a user-friendly interface.",
      technologies: [
        "Go",
        "Kafka",
        "Elastic Search",
        "Docker",
        "Kibana",
        "Typescript",
        "NextJS",
        "Shadcn UI",
      ],
      links: [
        // {
        //   type: "Website",
        //   href: "",
        //   icon: <Icons.globe className="size-3" />,
        // },
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
        "Implementations of the Machine Learning models and algorithms from scratch using NumPy only.",
      technologies: ["Python", "NumPy"],
      links: [
        // {
        //   type: "Website",
        //   href: "",
        //   icon: <Icons.globe className="size-3" />,
        // },
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
        "An tour booking web app with user authentication and authorization.",
      technologies: ["NodeJS", "ExpressJs", "MongoDB"],
      links: [
        // {
        //   type: "Website",
        //   href: "",
        //   icon: <Icons.globe className="size-3" />,
        // },
        {
          type: "Source",
          href: "https://github.com/siAyush/Natours",
          icon: <Icons.github className="size-3" />,
        },
      ],
    },
    {
      title: "Model-Zoo",
      description: "Implementation of various deep learning models in Pytorch",
      technologies: ["Pytorch", "Python"],
      links: [
        // {
        //   type: "Website",
        //   href: "",
        //   icon: <Icons.globe className="size-3" />,
        // },
        {
          type: "Source",
          href: "https://github.com/siAyush/Model-Zoo",
          icon: <Icons.github className="size-3" />,
        },
      ],
    },
  ],
} as const;
