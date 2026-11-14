import { NextResponse } from "next/server";
import db from "@/lib/db";
import { getSessionUser } from "@/lib/auth";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    const row = db.prepare(`
      SELECT p.*, c.name as category_name, c.slug as category_slug
      FROM products p
      JOIN categories c ON p.category_id = c.id
      WHERE p.id = ? OR p.slug = ?
    `).get(id, id) as any;

    if (!row) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const product = {
      ...row,
      images: JSON.parse(row.images_json || "[]"),
      sizes: JSON.parse(row.sizes_json || "[]"),
      colors: JSON.parse(row.colors_json || "[]"),
      is_featured: Boolean(row.is_featured),
      is_new_drop: Boolean(row.is_new_drop),
      in_stock: Boolean(row.in_stock),
    };

    return NextResponse.json({ product });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch product" }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSessionUser();
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized. Admin access required." }, { status: 403 });
    }

    const { id } = await params;
    const data = await req.json();

    const existing = db.prepare("SELECT * FROM products WHERE id = ?").get(id) as any;
    if (!existing) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const {
      title = existing.title,
      slug = existing.slug,
      description = existing.description,
      price = existing.price,
      sale_price = existing.sale_price,
      category_id = existing.category_id,
      images,
      sizes,
      colors,
      fabric_details = existing.fabric_details,
      gsm = existing.gsm,
      fit = existing.fit,
      is_featured = existing.is_featured,
      is_new_drop = existing.is_new_drop,
      in_stock = existing.in_stock,
      stock_total = existing.stock_total,
    } = data;

    db.prepare(`
      UPDATE products SET
        title = ?, slug = ?, description = ?, price = ?, sale_price = ?, category_id = ?,
        images_json = ?, sizes_json = ?, colors_json = ?, fabric_details = ?, gsm = ?, fit = ?,
        is_featured = ?, is_new_drop = ?, in_stock = ?, stock_total = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(
      title,
      slug,
      description,
      Number(price),
      sale_price ? Number(sale_price) : null,
      category_id,
      images ? JSON.stringify(images) : existing.images_json,
      sizes ? JSON.stringify(sizes) : existing.sizes_json,
      colors ? JSON.stringify(colors) : existing.colors_json,
      fabric_details,
      gsm ? Number(gsm) : null,
      fit,
      is_featured ? 1 : 0,
      is_new_drop ? 1 : 0,
      in_stock ? 1 : 0,
      Number(stock_total),
      id
    );

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to update product" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSessionUser();
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized. Admin access required." }, { status: 403 });
    }

    const { id } = await params;
    db.prepare("DELETE FROM products WHERE id = ?").run(id);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to delete product" }, { status: 500 });
  }
}

