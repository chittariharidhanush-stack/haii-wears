import { NextResponse } from "next/server";
import db from "@/lib/db";
import { getSessionUser } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const session = await getSessionUser();
    const { searchParams } = new URL(req.url);
    const emailParam = searchParams.get("email");
    const statusParam = searchParams.get("status");
    const searchParam = searchParams.get("search");

    let query = "SELECT * FROM orders WHERE 1=1";
    const params: any[] = [];

    if (session?.role === "ADMIN") {
      if (statusParam && statusParam !== "ALL") {
        query += " AND fulfilment_status = ?";
        params.push(statusParam);
      }
      if (searchParam) {
        query += " AND (order_number LIKE ? OR customer_name LIKE ? OR customer_email LIKE ?)";
        const pattern = `%${searchParam}%`;
        params.push(pattern, pattern, pattern);
      }
    } else if (session) {
      query += " AND (user_id = ? OR customer_email = ?)";
      params.push(session.id, session.email);
    } else if (emailParam) {
      query += " AND customer_email = ?";
      params.push(emailParam.toLowerCase().trim());
    } else {
      return NextResponse.json({ orders: [] });
    }

    query += " ORDER BY created_at DESC";

    const orders = db.prepare(query).all(...params) as any[];

    // Fetch items for each order
    const getItems = db.prepare("SELECT * FROM order_items WHERE order_id = ?");

    const enriched = orders.map((o) => ({
      ...o,
      shipping_address: JSON.parse(o.shipping_address_json || "{}"),
      items: getItems.all(o.id),
    }));

    return NextResponse.json({ orders: enriched });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch orders" }, { status: 500 });
  }
}
