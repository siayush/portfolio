import { ScrambleText } from "@/components/scramble-text"
import { Posts } from "@/components/posts"
import { getPublishedPosts, type PostSummary } from "@/lib/blog"
import { Metadata } from "next"

// Only slug and metadata cross into the client component, not post bodies.
const posts: PostSummary[] = getPublishedPosts().map(({ slug, metadata }) => ({
  slug,
  metadata,
}))

export default async function BlogPage() {
  return (
    <main className=" relative">
      <h1 className="text-4xl font-bold mb-8 text-white">
        <span className="text-accent accent-glow mr-2">*</span>
        <ScrambleText text="blog" />
      </h1>

      <p className="hidden sm:block text-sm text-gray-400 mb-8">
        press{" "}
        <kbd className="px-1 py-0.5 text-xs border border-gray-700 rounded">
          /
        </kbd>{" "}
        to search • use{" "}
        <kbd className="px-1 py-0.5 text-xs border border-gray-700 rounded">
          ctrl / ⌘ j
        </kbd>{" "}
        and{" "}
        <kbd className="px-1 py-0.5 text-xs border border-gray-700 rounded">
          ctrl / ⌘ k
        </kbd>{" "}
        or{" "}
        <kbd className="px-1 py-0.5 text-xs border border-gray-700 rounded">
          ↑
        </kbd>{" "}
        and{" "}
        <kbd className="px-1 py-0.5 text-xs border border-gray-700 rounded">
          ↓
        </kbd>{" "}
        to navigate
      </p>

      <Posts posts={posts} />
    </main>
  )
}

export const metadata: Metadata = {
  title: "Blog",
  description: "Writings on programming, computer science, and more.",
  openGraph: {
    images: [
      {
        url: "/og/home?title=blog",
      },
    ],
  },
}
