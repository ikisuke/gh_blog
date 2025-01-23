import { json } from "@remix-run/node";
import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { getPostBySlug } from "~/utils/markdown.server";

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  if (!data?.post) {
    return [
      { title: "Post Not Found" },
      { name: "description", content: "Post not found" },
    ];
  }
  return [
    { title: data.post.title },
    { name: "description", content: `Read ${data.post.title}` },
  ];
};

export async function loader({ params }: LoaderFunctionArgs) {
  const post = getPostBySlug(params.slug as string);
  if (!post) {
    throw json({ message: "Post not found" }, { status: 404 });
  }
  return json({ post });
}

export default function Post() {
  const { post } = useLoaderData<typeof loader>();

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <article>
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-2">{post.title}</h1>
          <time className="text-gray-600">{post.date}</time>
        </header>
        <div
          className="prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </article>
    </div>
  );
}
