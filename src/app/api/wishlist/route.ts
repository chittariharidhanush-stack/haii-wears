import { NextResponse } from "next/server";
import db from "@/lib/db";
import { getSessionUser } from "@/lib/auth";

export async function GET() {
  const session = await getSessionUser();
  if (!session) {
    return NextResponse.json({ productIds: [] });
  }

  const rows = db.prepare("SELECT product_id FROM wishlists WHERE user_id = ?").all(session.id) as any[];
  return NextResponse.json({ productIds: rows.map((r) => r.product_id) });
}

export async function POST(req: Request) {
  const session = await getSessionUser();
  if (!session) {
    return NextResponse.json({ error: "Please log in" }, { status: 401 });
  }

  const { productId } = await req.json();
  if (!productId) {
    return NextResponse.json({ error: "Product ID required" }, { status: 400 });
  }

  const id = `wish_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
  db.prepare(`
    INSERT OR IGNORE INTO wishlists (id, user_id, product_id)
    VALUES (?, ?, ?)
  `).run(id, session.id, productId);

  return NextResponse.json({ success: true });
}

export async function DELETE(req: Request) {
  const session = await getSessionUser();
  if (!session) {
    return NextResponse.json({ error: "Please log in" }, { status: 401 });
  }

  const { productId } = await req.json();
  db.prepare("DELETE FROM wishlists WHERE user_id = ? AND product_id = ?").run(session.id, productId);

  return NextResponse.json({ success: true });
}
