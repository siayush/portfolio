import fs from "fs";
import matter from "gray-matter";
import path from "path";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeStringify from "rehype-stringify";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";

// type Metadata = {
//   title: string;
//   publishedAt: string;
//   summary: string;
//   image?: string;
// };

function getMDXFiles(dir: string) {
  return fs.readdirSync(dir).filter((file) => path.extname(file) === ".mdx");
}

export function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export type Heading = { level: 2 | 3; text: string; slug: string };

export function extractHeadings(markdown: string): Heading[] {
  const headings: Heading[] = [];
  const lines = markdown
    .replace(/```[\s\S]*?```/g, "")
    .split("\n");
  for (const line of lines) {
    const m = /^(#{2,3})\s+(.+?)\s*$/.exec(line);
    if (!m) continue;
    const level = m[1].length as 2 | 3;
    const raw = m[2].replace(/`([^`]+)`/g, "$1");
    const text = raw.replace(/^\d+\.\s+/, "");
    headings.push({ level, text, slug: slugify(text) });
  }
  return headings;
}

function injectHeadingIds(html: string) {
  return html.replace(
    /<h([23])>(.*?)<\/h\1>/g,
    (_, level: string, inner: string) => {
      const cleaned = inner.replace(/^\d+\.\s+/, "");
      const text = cleaned.replace(/<[^>]+>/g, "");
      return `<h${level} id="${slugify(text)}">${cleaned}</h${level}>`;
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
  const filePath = path.join("content", `${slug}.mdx`);
  let source = fs.readFileSync(filePath, "utf-8");
  const { content: rawContent, data: metadata } = matter(source);
  const content = await markdownToHTML(rawContent);
  return {
    source: content,
    metadata,
    slug,
    wordCount: countWords(rawContent),
    headings: extractHeadings(rawContent),
  };
}

async function getAllPosts(dir: string) {
  let mdxFiles = getMDXFiles(dir);
  return Promise.all(
    mdxFiles.map(async (file) => {
      let slug = path.basename(file, path.extname(file));
      let { metadata, source, wordCount } = await getPost(slug);
      return {
        metadata,
        slug,
        source,
        wordCount,
      };
    })
  );
}

export async function getBlogPosts() {
  return getAllPosts(path.join(process.cwd(), "content"));
}
