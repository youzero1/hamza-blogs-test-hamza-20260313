"use client";

import { useState, useEffect, useCallback } from "react";

interface Category {
  id: number;
  name: string;
  slug: string;
}

interface Post {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  published: boolean;
  createdAt: string;
  category?: Category;
  categoryId?: number;
}

export default function AdminPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeTab, setActiveTab] = useState<"posts" | "categories">("posts");
  const [showPostForm, setShowPostForm] = useState(false);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const [postForm, setPostForm] = useState({
    title: "",
    slug: "",
    content: "",
    excerpt: "",
    published: false,
    categoryId: ""
  });

  const [categoryForm, setCategoryForm] = useState({
    name: "",
    slug: ""
  });

  const fetchPosts = useCallback(async () => {
    const res = await fetch("/api/posts");
    if (res.ok) {
      const data = await res.json();
      setPosts(data.posts || []);
    }
  }, []);

  const fetchCategories = useCallback(async () => {
    const res = await fetch("/api/categories");
    if (res.ok) {
      const data = await res.json();
      setCategories(data.categories || []);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
    fetchCategories();
  }, [fetchPosts, fetchCategories]);

  const showMsg = (text: string, type: "success" | "error") => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 3000);
  };

  const slugify = (text: string) =>
    text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

  const resetPostForm = () => {
    setPostForm({ title: "", slug: "", content: "", excerpt: "", published: false, categoryId: "" });
    setEditingPost(null);
    setShowPostForm(false);
  };

  const resetCategoryForm = () => {
    setCategoryForm({ name: "", slug: "" });
    setEditingCategory(null);
    setShowCategoryForm(false);
  };

  const handleEditPost = (post: Post) => {
    setEditingPost(post);
    setPostForm({
      title: post.title,
      slug: post.slug,
      content: post.content,
      excerpt: post.excerpt || "",
      published: post.published,
      categoryId: post.categoryId?.toString() || ""
    });
    setShowPostForm(true);
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setCategoryForm({ name: category.name, slug: category.slug });
    setShowCategoryForm(true);
  };

  const handlePostSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...postForm,
        categoryId: postForm.categoryId ? parseInt(postForm.categoryId) : null
      };
      const url = editingPost ? `/api/posts/${editingPost.id}` : "/api/posts";
      const method = editingPost ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        showMsg(
          editingPost ? "Post updated successfully!" : "Post created successfully!",
          "success"
        );
        resetPostForm();
        fetchPosts();
      } else {
        const err = await res.json();
        showMsg(err.error || "Failed to save post", "error");
      }
    } catch {
      showMsg("An error occurred", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePost = async (id: number) => {
    if (!confirm("Are you sure you want to delete this post?")) return;
    const res = await fetch(`/api/posts/${id}`, { method: "DELETE" });
    if (res.ok) {
      showMsg("Post deleted successfully!", "success");
      fetchPosts();
    } else {
      showMsg("Failed to delete post", "error");
    }
  };

  const handleTogglePublish = async (post: Post) => {
    const res = await fetch(`/api/posts/${post.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...post, published: !post.published, categoryId: post.categoryId || null })
    });
    if (res.ok) {
      showMsg(
        post.published ? "Post unpublished" : "Post published",
        "success"
      );
      fetchPosts();
    } else {
      showMsg("Failed to update post", "error");
    }
  };

  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const url = editingCategory
        ? `/api/categories/${editingCategory.id}`
        : "/api/categories";
      const method = editingCategory ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(categoryForm)
      });
      if (res.ok) {
        showMsg(
          editingCategory
            ? "Category updated successfully!"
            : "Category created successfully!",
          "success"
        );
        resetCategoryForm();
        fetchCategories();
      } else {
        const err = await res.json();
        showMsg(err.error || "Failed to save category", "error");
      }
    } catch {
      showMsg("An error occurred", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCategory = async (id: number) => {
    if (!confirm("Are you sure you want to delete this category?")) return;
    const res = await fetch(`/api/categories/${id}`, { method: "DELETE" });
    if (res.ok) {
      showMsg("Category deleted successfully!", "success");
      fetchCategories();
    } else {
      showMsg("Failed to delete category", "error");
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-500 mt-1">Manage your blog posts and categories</p>
        </div>
      </div>

      {message && (
        <div
          className={`mb-6 px-4 py-3 rounded-lg text-sm font-medium ${
            message.type === "success"
              ? "bg-green-50 text-green-700 border border-green-200"
              : "bg-red-50 text-red-700 border border-red-200"
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="flex gap-2 mb-8 border-b border-gray-200">
        <button
          onClick={() => setActiveTab("posts")}
          className={`px-6 py-3 font-medium text-sm transition-colors border-b-2 -mb-px ${
            activeTab === "posts"
              ? "border-indigo-600 text-indigo-600"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          Posts ({posts.length})
        </button>
        <button
          onClick={() => setActiveTab("categories")}
          className={`px-6 py-3 font-medium text-sm transition-colors border-b-2 -mb-px ${
            activeTab === "categories"
              ? "border-indigo-600 text-indigo-600"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          Categories ({categories.length})
        </button>
      </div>

      {activeTab === "posts" && (
        <div>
          <div className="flex justify-end mb-4">
            <button
              onClick={() => { resetPostForm(); setShowPostForm(true); }}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 font-medium text-sm transition-colors"
            >
              + New Post
            </button>
          </div>

          {showPostForm && (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                {editingPost ? "Edit Post" : "Create New Post"}
              </h2>
              <form onSubmit={handlePostSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                    <input
                      type="text"
                      required
                      value={postForm.title}
                      onChange={(e) =>
                        setPostForm((p) => ({
                          ...p,
                          title: e.target.value,
                          slug: p.slug || slugify(e.target.value)
                        }))
                      }
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Slug *</label>
                    <input
                      type="text"
                      required
                      value={postForm.slug}
                      onChange={(e) =>
                        setPostForm((p) => ({ ...p, slug: e.target.value }))
                      }
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Excerpt</label>
                  <textarea
                    value={postForm.excerpt}
                    onChange={(e) =>
                      setPostForm((p) => ({ ...p, excerpt: e.target.value }))
                    }
                    rows={2}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Content *</label>
                  <textarea
                    required
                    value={postForm.content}
                    onChange={(e) =>
                      setPostForm((p) => ({ ...p, content: e.target.value }))
                    }
                    rows={12}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                    placeholder="Write your post content here... Supports Markdown-like syntax."
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <select
                      value={postForm.categoryId}
                      onChange={(e) =>
                        setPostForm((p) => ({ ...p, categoryId: e.target.value }))
                      }
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="">No category</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-end">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={postForm.published}
                        onChange={(e) =>
                          setPostForm((p) => ({ ...p, published: e.target.checked }))
                        }
                        className="w-4 h-4 text-indigo-600 rounded"
                      />
                      <span className="text-sm font-medium text-gray-700">Published</span>
                    </label>
                  </div>
                </div>
                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 font-medium text-sm transition-colors disabled:opacity-50"
                  >
                    {loading ? "Saving..." : editingPost ? "Update Post" : "Create Post"}
                  </button>
                  <button
                    type="button"
                    onClick={resetPostForm}
                    className="border border-gray-300 text-gray-600 px-6 py-2 rounded-lg hover:bg-gray-50 font-medium text-sm transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            {posts.length === 0 ? (
              <div className="text-center py-16 text-gray-500">No posts yet. Create your first post!</div>
            ) : (
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Title</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Category</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {posts.map((post) => (
                    <tr key={post.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900 text-sm">{post.title}</div>
                        <div className="text-gray-400 text-xs mt-0.5">{post.slug}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {post.category?.name || <span className="text-gray-400">None</span>}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full ${
                            post.published
                              ? "bg-green-50 text-green-700"
                              : "bg-yellow-50 text-yellow-700"
                          }`}
                        >
                          {post.published ? "Published" : "Draft"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {new Date(post.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleTogglePublish(post)}
                            className="text-xs px-3 py-1.5 rounded border border-gray-300 text-gray-600 hover:bg-gray-50 font-medium transition-colors"
                          >
                            {post.published ? "Unpublish" : "Publish"}
                          </button>
                          <button
                            onClick={() => handleEditPost(post)}
                            className="text-xs px-3 py-1.5 rounded border border-indigo-300 text-indigo-600 hover:bg-indigo-50 font-medium transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeletePost(post.id)}
                            className="text-xs px-3 py-1.5 rounded border border-red-300 text-red-600 hover:bg-red-50 font-medium transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {activeTab === "categories" && (
        <div>
          <div className="flex justify-end mb-4">
            <button
              onClick={() => { resetCategoryForm(); setShowCategoryForm(true); }}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 font-medium text-sm transition-colors"
            >
              + New Category
            </button>
          </div>

          {showCategoryForm && (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                {editingCategory ? "Edit Category" : "Create New Category"}
              </h2>
              <form onSubmit={handleCategorySubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                    <input
                      type="text"
                      required
                      value={categoryForm.name}
                      onChange={(e) =>
                        setCategoryForm((c) => ({
                          ...c,
                          name: e.target.value,
                          slug: c.slug || slugify(e.target.value)
                        }))
                      }
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Slug *</label>
                    <input
                      type="text"
                      required
                      value={categoryForm.slug}
                      onChange={(e) =>
                        setCategoryForm((c) => ({ ...c, slug: e.target.value }))
                      }
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>
                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 font-medium text-sm transition-colors disabled:opacity-50"
                  >
                    {loading ? "Saving..." : editingCategory ? "Update Category" : "Create Category"}
                  </button>
                  <button
                    type="button"
                    onClick={resetCategoryForm}
                    className="border border-gray-300 text-gray-600 px-6 py-2 rounded-lg hover:bg-gray-50 font-medium text-sm transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            {categories.length === 0 ? (
              <div className="text-center py-16 text-gray-500">No categories yet. Create your first category!</div>
            ) : (
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Slug</th>
                    <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {categories.map((category) => (
                    <tr key={category.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-medium text-gray-900 text-sm">{category.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{category.slug}</td>
                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleEditCategory(category)}
                            className="text-xs px-3 py-1.5 rounded border border-indigo-300 text-indigo-600 hover:bg-indigo-50 font-medium transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteCategory(category.id)}
                            className="text-xs px-3 py-1.5 rounded border border-red-300 text-red-600 hover:bg-red-50 font-medium transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
