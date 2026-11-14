import { NextResponse } from "next/server";
import db from "@/lib/db";
import { getSessionUser } from "@/lib/auth";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    const order = db.prepare("SELECT * FROM orders WHERE id = ? OR order_number = ?").get(id, id) as any;
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const items = db.prepare("SELECT * FROM order_items WHERE order_id = ?").all(order.id);

    return NextResponse.json({
      order: {
        ...order,
        shipping_address: JSON.parse(order.shipping_address_json || "{}"),
        billing_address: JSON.parse(order.billing_address_json || "{}"),
        items,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch order" }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSessionUser();
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized. Admin access required." }, { status: 403 });
    }

    const { id } = await params;
    const body = await req.json();
    const { fulfilment_status, payment_status, tracking_number, carrier } = body;

    const existing = db.prepare("SELECT * FROM orders WHERE id = ?").get(id) as any;
    if (!existing) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    db.prepare(`
      UPDATE orders SET
        fulfilment_status = COALESCE(?, fulfilment_status),
        payment_status = COALESCE(?, payment_status),
        tracking_number = COALESCE(?, tracking_number),
        carrier = COALESCE(?, carrier),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(
      fulfilment_status || null,
      payment_status || null,
      tracking_number || null,
      carrier || null,
      id
    );

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to update order" }, { status: 500 });
  }
}
