import Link from "next/link";

interface PostCardProps {
  title: string;
  excerpt: string;
  slug: string;
  createdAt: string;
  categoryName?: string;
  categorySlug?: string;
}

export default function PostCard({
  title,
  excerpt,
  slug,
  createdAt,
  categoryName,
  categorySlug
}: PostCardProps) {
  const formattedDate = new Date(createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });

  return (
    <article className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-3">
          {categoryName && categorySlug && (
            <Link
              href={`/categories/${categorySlug}`}
              className="inline-block bg-indigo-50 text-indigo-600 text-xs font-semibold px-3 py-1 rounded-full hover:bg-indigo-100 transition-colors"
            >
              {categoryName}
            </Link>
          )}
          <time className="text-sm text-gray-500" dateTime={createdAt}>
            {formattedDate}
          </time>
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2 leading-snug">
          <Link
            href={`/posts/${slug}`}
            className="hover:text-indigo-600 transition-colors"
          >
            {title}
          </Link>
        </h2>
        <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
          {excerpt}
        </p>
        <div className="mt-4">
          <Link
            href={`/posts/${slug}`}
            className="inline-flex items-center text-indigo-600 font-medium text-sm hover:text-indigo-800 transition-colors"
          >
            Read more
            <svg
              className="ml-1 w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        </div>
      </div>
    </article>
  );
}
