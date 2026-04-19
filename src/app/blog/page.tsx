import BlurFade from "@/components/blur-fade";
import { getBlogPosts } from "@/data/blog";
import { formatDate } from "@/lib/utils";
import Link from "next/link";

export const metadata = {
  title: "Blog",
  description: "My thoughts",
};

const BLUR_FADE_DELAY = 0.04;

export default async function BlogPage() {
  const posts = await getBlogPosts();

  return (
    <section>
      <BlurFade delay={BLUR_FADE_DELAY}>
        <h1 className="text-3xl sm:text-4xl font-bold mb-2 tracking-tighter">
          <span className="text-brand font-mono mr-2" aria-hidden="true">
            &gt;
          </span>
          blogs
        </h1>
        <p className="text-sm text-muted-foreground mb-8">
          Notes on building, breaking, and learning.
        </p>
      </BlurFade>
      <ul className="flex flex-col gap-1">
        {posts
          .sort(
            (a, b) =>
              new Date(b.metadata.publishedAt).getTime() -
              new Date(a.metadata.publishedAt).getTime()
          )
          .map((post, id) => (
            <BlurFade delay={BLUR_FADE_DELAY * 2 + id * 0.05} key={post.slug}>
              <li>
                <Link
                  href={`/blog/${post.slug}`}
                  className="group flex items-baseline justify-between gap-4 rounded-md px-2 py-2 -mx-2 transition-colors hover:bg-accent"
                >
                  <span className="tracking-tight text-foreground group-hover:underline underline-offset-4 decoration-foreground/30">
                    {post.metadata.title}
                  </span>
                  <time
                    dateTime={post.metadata.publishedAt}
                    className="text-xs tabular-nums text-muted-foreground shrink-0"
                  >
                    {formatDate(post.metadata.publishedAt)}
                  </time>
                </Link>
              </li>
            </BlurFade>
          ))}
      </ul>
    </section>
  );
}
