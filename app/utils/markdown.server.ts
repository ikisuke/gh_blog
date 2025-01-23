import { readFileSync, readdirSync } from "fs";
import { join } from "path";
import matter from "gray-matter";
import { marked } from "marked";
import type { Link } from "marked";

const DOCS_PATH = join(process.cwd(), "source", "docs");

export interface Post {
  slug: string;
  title: string;
  date: string;
  content: string;
}

export function getAllPosts(): Post[] {
  const files = readdirSync(DOCS_PATH).filter((file) => file.endsWith(".md"));

  return files.map((file) => {
    const filePath = join(DOCS_PATH, file);
    const fileContent = readFileSync(filePath, "utf-8");
    const { data, content } = matter(fileContent);

    // Convert relative links to absolute paths
    const renderer = new marked.Renderer();
    const originalLinkRenderer = renderer.link;
    renderer.link = ({ href, title, text }: Link) => {
      if (href && href.startsWith("./")) {
        href = href.replace("./", "/posts/");
      }
      return originalLinkRenderer.call(renderer, href, title, text);
    };

    return {
      slug: file.replace(".md", ""),
      title: data.title as string,
      date: data.date as string,
      content: marked.parse(content, { renderer }) as string,
    };
  });
}

export function getPostBySlug(slug: string): Post | null {
  try {
    const filePath = join(DOCS_PATH, `${slug}.md`);
    const fileContent = readFileSync(filePath, "utf-8");
    const { data, content } = matter(fileContent);

    // Convert relative links to absolute paths
    const renderer = new marked.Renderer();
    const originalLinkRenderer = renderer.link;
    renderer.link = ({ href, title, text }: Link) => {
      if (href && href.startsWith("./")) {
        href = href.replace("./", "/posts/");
      }
      return originalLinkRenderer.call(renderer, href, title, text);
    };

    return {
      slug,
      title: data.title as string,
      date: data.date as string,
      content: marked.parse(content, { renderer }) as string,
    };
  } catch {
    return null;
  }
}
