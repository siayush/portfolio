import BlurFade from "@/components/blur-fade";
import { formatWordCount, getBlogPosts } from "@/data/blog";
import { formatDate } from "@/lib/utils";
import Link from "next/link";

export const metadata = {
  title: "Blog",
  description: "My thoughts",
};

const BLUR_FADE_DELAY = 0.04;

export default async function BlogPage() {
  const posts = (await getBlogPosts()).sort(
    (a, b) =>
      new Date(b.metadata.publishedAt).getTime() -
      new Date(a.metadata.publishedAt).getTime(),
  );

  const totalWords = posts.reduce((acc, p) => acc + p.wordCount, 0);

  return (
    <section>
      <BlurFade delay={BLUR_FADE_DELAY}>
        <div className="flex items-end justify-between gap-3 mb-1">
          <span className="font-pixel text-[10px] text-muted-foreground tracking-tight">
            V1.0
          </span>
          <div className="flex items-center gap-2 font-pixel text-[10px] tracking-tight">
            <span className="text-muted-foreground">DATE</span>
            <span className="text-muted-foreground/60">·</span>
            <span className="text-blueprint">WORDS</span>
          </div>
        </div>
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
                className="group flex items-baseline gap-1 py-1.5"
              >
                <span className="text-muted-foreground select-none">•</span>
                <span className="ml-2 font-serif text-base tracking-tight text-foreground group-hover:text-blueprint group-hover:underline underline-offset-4 decoration-blueprint/60">
                  {post.metadata.title.replace(/\.?$/, ".")}
                </span>
                <span className="leader-dotted" aria-hidden="true" />
                <time
                  dateTime={post.metadata.publishedAt}
                  className="font-pixel text-[10px] tabular-nums text-muted-foreground shrink-0"
                >
                  {formatDate(post.metadata.publishedAt)}
                </time>
                <span className="font-pixel text-[10px] text-muted-foreground/60 mx-1.5">
                  ·
                </span>
                <span className="font-pixel text-[10px] tabular-nums text-blueprint shrink-0">
                  {formatWordCount(post.wordCount)}
                </span>
              </Link>
            </li>
          </BlurFade>
        ))}
      </ul>

      <BlurFade delay={BLUR_FADE_DELAY * 3}>
        <div className="mt-10 flex items-center justify-between gap-3 font-pixel text-[10px] tracking-tight text-muted-foreground">
          <span>
            {posts.length} {posts.length === 1 ? "ENTRY" : "ENTRIES"}
          </span>
          <span>TOTAL · {formatWordCount(totalWords)}</span>
        </div>
      </BlurFade>
    </section>
  );
}
