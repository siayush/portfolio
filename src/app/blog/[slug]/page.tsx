import BlogTOC from "@/components/blog-toc";
import BlurFade from "@/components/blur-fade";
import { formatWordCount, getBlogSlugs, getPost } from "@/data/blog";
import { formatDate } from "@/lib/utils";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

const BLUR_FADE_DELAY = 0.04;

export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return getBlogSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const post = await getPost(params.slug);
  if (!post) return {};

  const { title, summary, publishedAt } = post.metadata;
  const url = `/blog/${post.slug}`;

  return {
    title,
    description: summary,
    alternates: { canonical: url },
    openGraph: {
      title,
      description: summary,
      url,
      type: "article",
      publishedTime: publishedAt,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: summary,
    },
  };
}

export default async function Blog({
  params,
}: {
  params: {
    slug: string;
  };
}) {
  const post = await getPost(params.slug);

  if (!post) {
    notFound();
  }

  const titleWithPeriod = post.metadata.title.replace(/\.?$/, ".");

  return (
    <section id="blog" className="relative">
      <BlogTOC headings={post.headings} />

      <BlurFade delay={BLUR_FADE_DELAY}>
        <nav
          aria-label="Breadcrumb"
          className="font-pixel text-xs tracking-tight mb-8 flex items-center"
        >
          <Link
            href="/blog"
            className="text-foreground/70 hover:text-blueprint"
          >
            ← BACK
          </Link>
        </nav>
      </BlurFade>

      <BlurFade delay={BLUR_FADE_DELAY * 2}>
        <h1 className="font-serif italic text-foreground text-3xl sm:text-4xl leading-tight tracking-tight max-w-[650px]">
          {titleWithPeriod}
        </h1>
      </BlurFade>

      {post.metadata.summary ? (
        <BlurFade delay={BLUR_FADE_DELAY * 3}>
          <p className="mt-3 max-w-[650px] font-serif text-foreground/70 text-base sm:text-lg leading-snug">
            {post.metadata.summary}
          </p>
        </BlurFade>
      ) : null}

      <BlurFade delay={BLUR_FADE_DELAY * 4}>
        <div className="mt-4 max-w-[650px] flex items-center gap-3 font-pixel text-[10px] tracking-tight">
          <time
            dateTime={post.metadata.publishedAt}
            className="tabular-nums text-foreground/70"
          >
            {formatDate(post.metadata.publishedAt)}
          </time>
          <span className="text-foreground/50">·</span>
          <span className="tabular-nums text-blueprint">
            {formatWordCount(post.wordCount)}
          </span>
        </div>
      </BlurFade>

      <BlurFade delay={BLUR_FADE_DELAY * 5}>
        <div
          className="mt-10 mb-10 max-w-[650px] text-center font-pixel text-xs text-foreground/60 select-none tracking-[0.4em]"
          aria-hidden="true"
        >
          · · · · ·
        </div>
      </BlurFade>

      <BlurFade delay={BLUR_FADE_DELAY * 6}>
        <article
          className="article-dropcap prose prose-sm sm:prose-base dark:prose-invert max-w-[650px] font-serif prose-p:font-serif prose-li:font-serif prose-headings:font-sans prose-headings:tracking-tight prose-headings:text-foreground prose-headings:scroll-mt-24 prose-p:text-foreground prose-li:text-foreground prose-strong:text-foreground prose-a:text-blueprint prose-a:no-underline hover:prose-a:underline prose-img:mx-auto"
          // eslint-disable-next-line react/no-danger -- HTML is generated at build time from trusted local markdown via remark/rehype
          dangerouslySetInnerHTML={{ __html: post.source }}
        ></article>
      </BlurFade>
    </section>
  );
}
