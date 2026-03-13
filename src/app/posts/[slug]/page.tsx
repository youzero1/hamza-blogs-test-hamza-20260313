import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";

async function getPost(slug: string) {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL ||
    (process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : "http://localhost:3000");
  const res = await fetch(`${baseUrl}/api/posts?slug=${slug}`, {
    cache: "no-store"
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data.post || null;
}

export async function generateMetadata({
  params
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const post = await getPost(params.slug);
  if (!post) return { title: "Post Not Found" };
  return {
    title: post.title,
    description: post.excerpt || post.title,
    openGraph: {
      title: post.title,
      description: post.excerpt || post.title,
      type: "article"
    }
  };
}

function renderContent(content: string) {
  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (line.startsWith("### ")) {
      elements.push(
        <h3 key={i} className="text-xl font-semibold text-gray-900 mb-2 mt-5">
          {line.slice(4)}
        </h3>
      );
    } else if (line.startsWith("## ")) {
      elements.push(
        <h2 key={i} className="text-2xl font-bold text-gray-900 mb-3 mt-6">
          {line.slice(3)}
        </h2>
      );
    } else if (line.startsWith("# ")) {
      elements.push(
        <h1 key={i} className="text-3xl font-bold text-gray-900 mb-4 mt-8">
          {line.slice(2)}
        </h1>
      );
    } else if (line.startsWith("```")) {
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].startsWith("```")) {
        codeLines.push(lines[i]);
        i++;
      }
      elements.push(
        <pre
          key={i}
          className="bg-gray-900 text-gray-100 p-4 rounded-lg mb-4 overflow-x-auto"
        >
          <code>{codeLines.join("\n")}</code>
        </pre>
      );
    } else if (line.startsWith("- ")) {
      const listItems: string[] = [];
      while (i < lines.length && lines[i].startsWith("- ")) {
        listItems.push(lines[i].slice(2));
        i++;
      }
      elements.push(
        <ul key={i} className="list-disc list-inside mb-4 space-y-1">
          {listItems.map((item, idx) => (
            <li key={idx} className="text-gray-700">
              {item}
            </li>
          ))}
        </ul>
      );
      continue;
    } else if (line.trim() === "") {
      // skip empty lines
    } else {
      elements.push(
        <p key={i} className="text-gray-700 mb-4 leading-relaxed">
          {line}
        </p>
      );
    }
    i++;
  }

  return elements;
}

export default async function PostPage({
  params
}: {
  params: { slug: string };
}) {
  const post = await getPost(params.slug);

  if (!post || !post.published) {
    notFound();
  }

  const formattedDate = new Date(post.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          {post.category && (
            <Link
              href={`/categories/${post.category.slug}`}
              className="inline-block bg-indigo-50 text-indigo-600 text-sm font-semibold px-3 py-1 rounded-full hover:bg-indigo-100 transition-colors"
            >
              {post.category.name}
            </Link>
          )}
          <time className="text-gray-500 text-sm" dateTime={post.createdAt}>
            {formattedDate}
          </time>
        </div>
        <h1 className="text-4xl font-extrabold text-gray-900 leading-tight mb-4">
          {post.title}
        </h1>
        {post.excerpt && (
          <p className="text-xl text-gray-500 leading-relaxed">{post.excerpt}</p>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
        <div className="prose">{renderContent(post.content)}</div>
      </div>

      <div className="mt-8">
        <Link
          href="/"
          className="inline-flex items-center text-indigo-600 font-medium hover:text-indigo-800 transition-colors"
        >
          <svg
            className="mr-2 w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to all posts
        </Link>
      </div>
    </div>
  );
}
