import { formatWordCount, getBlogSlugs, getPost } from "@/data/blog";
import { DATA } from "@/data/resume";
import { formatDate } from "@/lib/utils";
import { ImageResponse } from "next/og";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return getBlogSlugs().map((slug) => ({ slug }));
}

export const alt = "Blog post";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const BLUEPRINT = "#7083ff";

export default async function Image({
  params,
}: {
  params: { slug: string };
}) {
  const post = await getPost(params.slug);
  if (!post) {
    notFound();
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#08090a",
          color: "#fafafa",
          padding: "64px 72px",
        }}
      >
        <div
          style={{
            height: "20px",
            width: "100%",
            border: "1px solid rgba(250, 250, 250, 0.3)",
            backgroundImage: `linear-gradient(135deg, ${BLUEPRINT} 25%, transparent 25%, transparent 50%, ${BLUEPRINT} 50%, ${BLUEPRINT} 75%, transparent 75%, transparent)`,
            backgroundSize: "16px 16px",
          }}
        />
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 64,
              fontWeight: 700,
              fontStyle: "italic",
              letterSpacing: "-1px",
              lineHeight: 1.15,
            }}
          >
            {post.metadata.title.replace(/\.?$/, ".")}
          </div>
          <div
            style={{
              marginTop: 28,
              display: "flex",
              gap: 16,
              fontSize: 26,
              letterSpacing: "2px",
              color: "rgba(250, 250, 250, 0.6)",
            }}
          >
            <span>{formatDate(post.metadata.publishedAt).toUpperCase()}</span>
            <span>·</span>
            <span style={{ color: BLUEPRINT }}>
              {formatWordCount(post.wordCount)}
            </span>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 24,
            letterSpacing: "2px",
            color: "rgba(250, 250, 250, 0.6)",
          }}
        >
          <span>{DATA.name.toUpperCase()}</span>
          <span>[ WRITING ]</span>
        </div>
      </div>
    ),
    { ...size },
  );
}
