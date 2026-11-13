import { Header } from "@/components/header"
import { Item, SectionList } from "@/components/section-list"
import { BlogSection } from "@/components/blog-section"
import { LinksSection } from "@/components/links-section"
import { workItems } from "@/lib/work-items"

const featuredWorkItems: Item[] = workItems.slice(0, 3)

const projectItems = [
  {
    title: "ingestor",
    role: "creator",
    description:
      "scalable log ingestion and query system with real-time pipelines and a dashboard for exploring logs at volume",
    href: "https://github.com/siAyush/ingestor",
  },
  {
    title: "monkey",
    role: "creator",
    description: "tree-walking interpreter for the monkey language, from scratch in go",
    href: "https://github.com/siAyush/monkey",
  },
]

export default function HomePage() {
  return (
    <>
      <Header />
      <BlogSection />
      <SectionList
        title="work"
        items={featuredWorkItems}
        viewAllHref="/work"
        viewAllText="all work"
      />
      <SectionList
        title="projects"
        items={projectItems}
        viewAllHref="/projects"
        viewAllText="all projects"
      />
      <LinksSection />
    </>
  )
}
