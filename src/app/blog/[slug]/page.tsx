import { formatWordCount, getPost } from "@/data/blog";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";

export default async function Blog({
  params,
}: {
  params: {
    slug: string;
  };
}) {
  let post = await getPost(params.slug);

  if (!post) {
    notFound();
  }

  const titleWithPeriod = post.metadata.title.replace(/\.?$/, ".");
  const crumb = post.metadata.title.toUpperCase();

  return (
    <section id="blog" className="relative">
      <nav
        aria-label="Breadcrumb"
        className="font-pixel text-[10px] tracking-tight mb-8 flex items-center gap-2"
      >
        <Link
          href="/blog"
          className="text-muted-foreground hover:text-blueprint"
        >
          ← BLOG
        </Link>
        <span className="text-muted-foreground/50">/</span>
        <span className="text-blueprint truncate">{crumb}</span>
      </nav>

      <h1 className="font-serif italic text-foreground text-3xl sm:text-4xl leading-tight tracking-tight max-w-[650px]">
        {titleWithPeriod}
      </h1>

      {post.metadata.summary ? (
        <p className="mt-3 max-w-[650px] font-serif text-muted-foreground text-base sm:text-lg leading-snug">
          {post.metadata.summary}
        </p>
      ) : null}

      <div className="mt-4 max-w-[650px] flex items-center gap-3 font-pixel text-[10px] tracking-tight">
        <Suspense fallback={<span className="h-3" />}>
          <time
            dateTime={post.metadata.publishedAt}
            className="tabular-nums text-muted-foreground"
          >
            {formatDate(post.metadata.publishedAt)}
          </time>
        </Suspense>
        <span className="text-muted-foreground/50">·</span>
        <span className="tabular-nums text-blueprint">
          {formatWordCount(post.wordCount)}
        </span>
      </div>

      <div
        className="mt-10 mb-10 max-w-[650px] text-center font-pixel text-xs text-muted-foreground/70 select-none tracking-[0.4em]"
        aria-hidden="true"
      >
        — — — — —
      </div>

      <article
        className="article-dropcap prose prose-sm sm:prose-base dark:prose-invert max-w-[650px] font-serif prose-p:font-serif prose-li:font-serif prose-headings:font-sans prose-headings:tracking-tight prose-headings:text-foreground prose-p:text-foreground prose-li:text-foreground prose-strong:text-foreground prose-a:text-blueprint prose-a:no-underline hover:prose-a:underline prose-p:text-justify prose-p:hyphens-auto"
        dangerouslySetInnerHTML={{ __html: post.source }}
      ></article>
    </section>
  );
}
