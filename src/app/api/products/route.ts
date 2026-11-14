import { NextResponse } from "next/server";
import db from "@/lib/db";
import { getSessionUser } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const featured = searchParams.get("featured");
    const newDrop = searchParams.get("new_drop");
    const search = searchParams.get("search");
    const sort = searchParams.get("sort");
    const limit = searchParams.get("limit");

    let query = "SELECT p.*, c.name as category_name, c.slug as category_slug FROM products p JOIN categories c ON p.category_id = c.id WHERE 1=1";
    const params: any[] = [];

    if (category && category !== "all") {
      query += " AND (c.slug = ? OR c.id = ?)";
      params.push(category, category);
    }

    if (featured === "true" || featured === "1") {
      query += " AND p.is_featured = 1";
    }

    if (newDrop === "true" || newDrop === "1") {
      query += " AND p.is_new_drop = 1";
    }

    if (search) {
      query += " AND (p.title LIKE ? OR p.description LIKE ? OR p.fit LIKE ?)";
      const pattern = `%${search}%`;
      params.push(pattern, pattern, pattern);
    }

    if (sort === "price_asc") {
      query += " ORDER BY COALESCE(p.sale_price, p.price) ASC";
    } else if (sort === "price_desc") {
      query += " ORDER BY COALESCE(p.sale_price, p.price) DESC";
    } else {
      query += " ORDER BY p.created_at DESC";
    }

    if (limit) {
      query += ` LIMIT ${parseInt(limit, 10)}`;
    }

    const rows = db.prepare(query).all(...params) as any[];

    // Parse JSON fields
    const products = rows.map((r) => ({
      ...r,
      images: JSON.parse(r.images_json || "[]"),
      sizes: JSON.parse(r.sizes_json || "[]"),
      colors: JSON.parse(r.colors_json || "[]"),
      is_featured: Boolean(r.is_featured),
      is_new_drop: Boolean(r.is_new_drop),
      in_stock: Boolean(r.in_stock),
    }));

    return NextResponse.json({ products });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch products" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getSessionUser();
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized. Admin access required." }, { status: 403 });
    }

    const data = await req.json();
    const {
      title,
      slug,
      description,
      price,
      sale_price,
      category_id,
      images,
      sizes,
      colors,
      fabric_details,
      gsm,
      fit,
      is_featured,
      is_new_drop,
      stock_total
    } = data;

    if (!title || !price || !category_id) {
      return NextResponse.json({ error: "Title, price and category are required" }, { status: 400 });
    }

    const id = `prod_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const finalSlug = slug || title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

    db.prepare(`
      INSERT INTO products (
        id, title, slug, description, price, sale_price, category_id,
        images_json, sizes_json, colors_json, fabric_details, gsm, fit,
        is_featured, is_new_drop, in_stock, stock_total
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id,
      title,
      finalSlug,
      description || "",
      Number(price),
      sale_price ? Number(sale_price) : null,
      category_id,
      JSON.stringify(images || []),
      JSON.stringify(sizes || [{ size: "M", stock: 10 }]),
      JSON.stringify(colors || [{ name: "Black", hex: "#000000" }]),
      fabric_details || "",
      gsm ? Number(gsm) : null,
      fit || "Regular",
      is_featured ? 1 : 0,
      is_new_drop ? 1 : 0,
      1,
      stock_total ? Number(stock_total) : 50
    );

    return NextResponse.json({ success: true, id, slug: finalSlug });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to create product" }, { status: 500 });
  }
}

