import { NextRequest, NextResponse } from "next/server";
import { getDataSource } from "@/lib/db";
import { Post } from "@/lib/entities/Post";
import { Category } from "@/lib/entities/Category";

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const ds = await getDataSource();
    const postRepo = ds.getRepository(Post);
    const id = parseInt(params.id, 10);

    const post = await postRepo.findOne({
      where: { id },
      relations: ["category"]
    });

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json({ post });
  } catch (error) {
    console.error("GET /api/posts/[id] error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const ds = await getDataSource();
    const postRepo = ds.getRepository(Post);
    const categoryRepo = ds.getRepository(Category);
    const id = parseInt(params.id, 10);

    const post = await postRepo.findOne({ where: { id } });
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    const body = await request.json();
    const { title, slug, content, excerpt, published, categoryId } = body;

    if (slug && slug !== post.slug) {
      const existing = await postRepo.findOne({ where: { slug } });
      if (existing && existing.id !== id) {
        return NextResponse.json(
          { error: "A post with this slug already exists" },
          { status: 409 }
        );
      }
    }

    let category: Category | null = null;
    if (categoryId) {
      category = await categoryRepo.findOne({ where: { id: categoryId } });
    }

    post.title = title ?? post.title;
    post.slug = slug ?? post.slug;
    post.content = content ?? post.content;
    post.excerpt = excerpt ?? post.excerpt;
    post.published = published !== undefined ? published : post.published;
    post.category = category;
    post.categoryId = category ? category.id : null;

    const saved = await postRepo.save(post);
    const result = await postRepo.findOne({
      where: { id: saved.id },
      relations: ["category"]
    });
    return NextResponse.json({ post: result });
  } catch (error) {
    console.error("PUT /api/posts/[id] error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const ds = await getDataSource();
    const postRepo = ds.getRepository(Post);
    const id = parseInt(params.id, 10);

    const post = await postRepo.findOne({ where: { id } });
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    await postRepo.remove(post);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/posts/[id] error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
