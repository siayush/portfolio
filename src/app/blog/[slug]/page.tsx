import { getPost } from "@/data/blog";
import { formatDate } from "@/lib/utils";
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

  return (
    <section id="blog">
      <h1 className="title font-bold text-3xl sm:text-4xl tracking-tighter max-w-[650px]">
        {post.metadata.title}
      </h1>
      <div className="flex justify-between items-center mt-3 mb-10 text-sm max-w-[650px]">
        <Suspense fallback={<p className="h-5" />}>
          <time
            dateTime={post.metadata.publishedAt}
            className="text-xs tabular-nums text-muted-foreground"
          >
            {formatDate(post.metadata.publishedAt)}
          </time>
        </Suspense>
      </div>
      <article
        className="prose prose-sm sm:prose-base dark:prose-invert max-w-none prose-headings:tracking-tight prose-a:text-brand prose-a:no-underline hover:prose-a:underline"
        dangerouslySetInnerHTML={{ __html: post.source }}
      ></article>
    </section>
  );
}
