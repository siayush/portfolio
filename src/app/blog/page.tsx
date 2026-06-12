import BlurFade from "@/components/blur-fade";
import { getBlogPosts } from "@/data/blog";
import { formatDate } from "@/lib/utils";
import Link from "next/link";

export const metadata = {
  title: "Blog",
  description: "My thoughts",
};

const BLUR_FADE_DELAY = 0.04;

export const dynamic = "force-static";

export default function BlogPage() {
  const posts = getBlogPosts().sort(
    (a, b) =>
      new Date(b.metadata.publishedAt).getTime() -
      new Date(a.metadata.publishedAt).getTime(),
  );

  return (
    <section>
      <BlurFade delay={BLUR_FADE_DELAY}>
        <h1 className="font-serif text-foreground text-3xl sm:text-4xl leading-none tracking-tight">
          Table of Contents.
        </h1>
        <div className="mt-3 h-px bg-foreground/40" />
      </BlurFade>

      <ul className="mt-10 flex flex-col">
        {posts.map((post, id) => (
          <BlurFade delay={BLUR_FADE_DELAY * 2 + id * 0.05} key={post.slug}>
            <li>
              <Link
                href={`/blog/${post.slug}`}
                className="group flex items-baseline py-1.5"
              >
                <span className="text-foreground/70 select-none">•</span>
                <span className="ml-2 flex flex-1 flex-col gap-y-0.5">
                  <span className="font-serif text-base tracking-tight text-foreground group-hover:text-blueprint group-hover:underline underline-offset-4 decoration-blueprint/60">
                    {post.metadata.title.replace(/\.?$/, ".")}
                  </span>
                  <span className="flex items-baseline shrink-0">
                    <time
                      dateTime={post.metadata.publishedAt}
                      className="font-pixel text-[10px] tabular-nums text-foreground/70"
                    >
                      {formatDate(post.metadata.publishedAt)}
                    </time>
                  </span>
                </span>
              </Link>
            </li>
          </BlurFade>
        ))}
      </ul>
    </section>
  );
}
