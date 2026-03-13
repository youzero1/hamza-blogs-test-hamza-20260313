import { NextRequest, NextResponse } from "next/server";
import { getDataSource } from "@/lib/db";
import { Category } from "@/lib/entities/Category";

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const ds = await getDataSource();
    const categoryRepo = ds.getRepository(Category);
    const id = parseInt(params.id, 10);

    const category = await categoryRepo.findOne({ where: { id } });
    if (!category) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }

    return NextResponse.json({ category });
  } catch (error) {
    console.error("GET /api/categories/[id] error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const ds = await getDataSource();
    const categoryRepo = ds.getRepository(Category);
    const id = parseInt(params.id, 10);

    const category = await categoryRepo.findOne({ where: { id } });
    if (!category) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }

    const body = await request.json();
    const { name, slug } = body;

    if (slug && slug !== category.slug) {
      const existing = await categoryRepo.findOne({ where: { slug } });
      if (existing && existing.id !== id) {
        return NextResponse.json(
          { error: "A category with this slug already exists" },
          { status: 409 }
        );
      }
    }

    category.name = name ?? category.name;
    category.slug = slug ?? category.slug;

    const saved = await categoryRepo.save(category);
    return NextResponse.json({ category: saved });
  } catch (error) {
    console.error("PUT /api/categories/[id] error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const ds = await getDataSource();
    const categoryRepo = ds.getRepository(Category);
    const id = parseInt(params.id, 10);

    const category = await categoryRepo.findOne({ where: { id } });
    if (!category) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }

    await categoryRepo.remove(category);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/categories/[id] error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
