import { Metadata } from "next";
import { notFound } from "next/navigation";
import PostCard from "@/components/PostCard";
import Pagination from "@/components/Pagination";
import Link from "next/link";

const POSTS_PER_PAGE = 10;

async function getCategoryPosts(
  slug: string,
  page: number
) {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL ||
    (process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : "http://localhost:3000");
  const res = await fetch(
    `${baseUrl}/api/posts?categorySlug=${slug}&published=true&page=${page}&limit=${POSTS_PER_PAGE}`,
    { cache: "no-store" }
  );
  if (!res.ok) return null;
  return res.json();
}

async function getCategory(slug: string) {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL ||
    (process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : "http://localhost:3000");
  const res = await fetch(`${baseUrl}/api/categories?slug=${slug}`, {
    cache: "no-store"
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data.category || null;
}

export async function generateMetadata({
  params
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const category = await getCategory(params.slug);
  if (!category) return { title: "Category Not Found" };
  return {
    title: `${category.name} - Category`,
    description: `Browse all posts in the ${category.name} category`
  };
}

export default async function CategoryPage({
  params,
  searchParams
}: {
  params: { slug: string };
  searchParams: { page?: string };
}) {
  const page = parseInt(searchParams.page || "1", 10);
  const category = await getCategory(params.slug);

  if (!category) {
    notFound();
  }

  const data = await getCategoryPosts(params.slug, page);
  if (!data) notFound();

  const { posts, total } = data;
  const totalPages = Math.ceil(total / POSTS_PER_PAGE);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-4">
        <Link
          href="/"
          className="inline-flex items-center text-indigo-600 font-medium hover:text-indigo-800 transition-colors text-sm"
        >
          <svg
            className="mr-1 w-4 h-4"
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
          All posts
        </Link>
      </div>
      <div className="mb-10">
        <div className="inline-block bg-indigo-50 text-indigo-600 text-sm font-semibold px-3 py-1 rounded-full mb-3">
          Category
        </div>
        <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
          {category.name}
        </h1>
        <p className="text-gray-500 text-lg">
          {total} post{total !== 1 ? "s" : ""} in this category
        </p>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-500 text-xl">No posts in this category yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map(
            (post: {
              id: number;
              title: string;
              slug: string;
              excerpt: string;
              createdAt: string;
              category?: { name: string; slug: string };
            }) => (
              <PostCard
                key={post.id}
                title={post.title}
                excerpt={post.excerpt || ""}
                slug={post.slug}
                createdAt={post.createdAt}
                categoryName={post.category?.name}
                categorySlug={post.category?.slug}
              />
            )
          )}
        </div>
      )}

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        basePath={`/categories/${params.slug}`}
      />
    </div>
  );
}
