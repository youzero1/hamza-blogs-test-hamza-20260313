import { Metadata } from "next";
import PostCard from "@/components/PostCard";
import Pagination from "@/components/Pagination";

export const metadata: Metadata = {
  title: "Home - Latest Posts",
  description: "Browse the latest blog posts on NextBlog"
};

const POSTS_PER_PAGE = 10;

async function getPosts(page: number) {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL ||
    (process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : "http://localhost:3000");
  const res = await fetch(
    `${baseUrl}/api/posts?published=true&page=${page}&limit=${POSTS_PER_PAGE}`,
    { cache: "no-store" }
  );
  if (!res.ok) return { posts: [], total: 0 };
  return res.json();
}

export default async function HomePage({
  searchParams
}: {
  searchParams: { page?: string };
}) {
  const page = parseInt(searchParams.page || "1", 10);
  const { posts, total } = await getPosts(page);
  const totalPages = Math.ceil(total / POSTS_PER_PAGE);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
          Latest Posts
        </h1>
        <p className="text-gray-500 text-lg">
          Explore articles on technology, lifestyle, and more.
        </p>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-500 text-xl">No posts found.</p>
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
        basePath="/"
      />
    </div>
  );
}
