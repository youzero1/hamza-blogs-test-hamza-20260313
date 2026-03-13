import { NextRequest, NextResponse } from "next/server";
import { getDataSource } from "@/lib/db";
import { Post } from "@/lib/entities/Post";
import { Category } from "@/lib/entities/Category";
import { seedIfEmpty } from "@/lib/seed";

let seeded = false;

async function ensureSeeded() {
  if (!seeded) {
    await seedIfEmpty();
    seeded = true;
  }
}

export async function GET(request: NextRequest) {
  try {
    await ensureSeeded();
    const ds = await getDataSource();
    const postRepo = ds.getRepository(Post);

    const { searchParams } = new URL(request.url);
    const published = searchParams.get("published");
    const slug = searchParams.get("slug");
    const categorySlug = searchParams.get("categorySlug");
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);

    if (slug) {
      const post = await postRepo.findOne({
        where: { slug },
        relations: ["category"]
      });
      if (!post) {
        return NextResponse.json({ error: "Post not found" }, { status: 404 });
      }
      return NextResponse.json({ post });
    }

    const qb = postRepo
      .createQueryBuilder("post")
      .leftJoinAndSelect("post.category", "category")
      .orderBy("post.createdAt", "DESC");

    if (published === "true") {
      qb.andWhere("post.published = :published", { published: true });
    }

    if (categorySlug) {
      qb.andWhere("category.slug = :categorySlug", { categorySlug });
    }

    const total = await qb.getCount();
    const posts = await qb
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();

    return NextResponse.json({ posts, total, page, limit });
  } catch (error) {
    console.error("GET /api/posts error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await ensureSeeded();
    const ds = await getDataSource();
    const postRepo = ds.getRepository(Post);
    const categoryRepo = ds.getRepository(Category);

    const body = await request.json();
    const { title, slug, content, excerpt, published, categoryId } = body;

    if (!title || !slug || !content) {
      return NextResponse.json(
        { error: "Title, slug, and content are required" },
        { status: 400 }
      );
    }

    const existing = await postRepo.findOne({ where: { slug } });
    if (existing) {
      return NextResponse.json(
        { error: "A post with this slug already exists" },
        { status: 409 }
      );
    }

    let category: Category | null = null;
    if (categoryId) {
      category = await categoryRepo.findOne({ where: { id: categoryId } });
    }

    const post = postRepo.create({
      title,
      slug,
      content,
      excerpt: excerpt || "",
      published: published || false,
      category: category || undefined
    });

    const saved = await postRepo.save(post);
    const result = await postRepo.findOne({
      where: { id: saved.id },
      relations: ["category"]
    });
    return NextResponse.json({ post: result }, { status: 201 });
  } catch (error) {
    console.error("POST /api/posts error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
