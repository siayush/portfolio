import fs from "fs";
import matter from "gray-matter";
import path from "path";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeStringify from "rehype-stringify";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";

export type PostMetadata = {
  title: string;
  publishedAt: string;
  summary?: string;
  image?: string;
};

const CONTENT_DIR = path.join(process.cwd(), "content");

function getMarkdownFiles() {
  return fs
    .readdirSync(CONTENT_DIR)
    .filter((file) => path.extname(file) === ".md");
}

export function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

// Returns a slugify that appends -1, -2, … on repeated text so heading ids
// stay unique. extractHeadings and injectHeadingIds each use a fresh slugger
// over the same headings in the same order, so their slugs always agree.
function makeSlugger() {
  const counts = new Map<string, number>();
  return (text: string) => {
    const base = slugify(text);
    const n = counts.get(base) ?? 0;
    counts.set(base, n + 1);
    return n === 0 ? base : `${base}-${n}`;
  };
}

export type Heading = { level: 2 | 3; text: string; slug: string };

export function extractHeadings(markdown: string): Heading[] {
  const headings: Heading[] = [];
  const slug = makeSlugger();
  const lines = markdown.replace(/```[\s\S]*?```/g, "").split("\n");
  for (const line of lines) {
    const m = /^(#{2,3})\s+(.+?)\s*$/.exec(line);
    if (!m) continue;
    const level = m[1].length as 2 | 3;
    const raw = m[2].replace(/`([^`]+)`/g, "$1");
    const text = raw.replace(/^\d+\.\s+/, "");
    headings.push({ level, text, slug: slug(text) });
  }
  return headings;
}

function injectHeadingIds(html: string) {
  const slug = makeSlugger();
  return html.replace(
    /<h([23])>(.*?)<\/h\1>/g,
    (_, level: string, inner: string) => {
      const cleaned = inner.replace(/^\d+\.\s+/, "");
      const text = cleaned.replace(/<[^>]+>/g, "");
      return `<h${level} id="${slug(text)}">${cleaned}</h${level}>`;
    },
  );
}

export async function markdownToHTML(markdown: string) {
  const p = await unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(rehypePrettyCode, {
      theme: {
        light: "min-light",
        dark: "min-dark",
      },
      keepBackground: false,
    })
    .use(rehypeStringify)
    .process(markdown);

  return injectHeadingIds(p.toString());
}

function countWords(markdown: string) {
  return markdown
    .replace(/```[\s\S]*?```/g, "")
    .replace(/`[^`]*`/g, "")
    .replace(/[#>*_\-[\]()!]/g, " ")
    .split(/\s+/)
    .filter(Boolean).length;
}

export function formatWordCount(words: number) {
  if (words < 1000) return `${words} WORDS`;
  return `${(words / 1000).toFixed(1)}K WORDS`;
}

export async function getPost(slug: string) {
  const filePath = path.join(CONTENT_DIR, `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;
  const source = fs.readFileSync(filePath, "utf-8");
  const { content: rawContent, data } = matter(source);
  return {
    source: await markdownToHTML(rawContent),
    metadata: data as PostMetadata,
    slug,
    wordCount: countWords(rawContent),
    headings: extractHeadings(rawContent),
  };
}

// Frontmatter + word count only — no HTML rendering. Listing pages and the
// sitemap should use this instead of paying for highlighting per post.
export function getBlogPosts() {
  return getMarkdownFiles().map((file) => {
    const slug = path.basename(file, path.extname(file));
    const source = fs.readFileSync(path.join(CONTENT_DIR, file), "utf-8");
    const { content, data } = matter(source);
    return {
      slug,
      metadata: data as PostMetadata,
      wordCount: countWords(content),
    };
  });
}

export function getBlogSlugs() {
  return getMarkdownFiles().map((f) => path.basename(f, path.extname(f)));
}
