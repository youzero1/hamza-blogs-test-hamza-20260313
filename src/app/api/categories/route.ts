import { NextRequest, NextResponse } from "next/server";
import { getDataSource } from "@/lib/db";
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
    const categoryRepo = ds.getRepository(Category);

    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");

    if (slug) {
      const category = await categoryRepo.findOne({ where: { slug } });
      if (!category) {
        return NextResponse.json({ error: "Category not found" }, { status: 404 });
      }
      return NextResponse.json({ category });
    }

    const categories = await categoryRepo.find({
      order: { name: "ASC" }
    });
    return NextResponse.json({ categories });
  } catch (error) {
    console.error("GET /api/categories error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await ensureSeeded();
    const ds = await getDataSource();
    const categoryRepo = ds.getRepository(Category);

    const body = await request.json();
    const { name, slug } = body;

    if (!name || !slug) {
      return NextResponse.json(
        { error: "Name and slug are required" },
        { status: 400 }
      );
    }

    const existing = await categoryRepo.findOne({ where: { slug } });
    if (existing) {
      return NextResponse.json(
        { error: "A category with this slug already exists" },
        { status: 409 }
      );
    }

    const category = categoryRepo.create({ name, slug });
    const saved = await categoryRepo.save(category);
    return NextResponse.json({ category: saved }, { status: 201 });
  } catch (error) {
    console.error("POST /api/categories error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
