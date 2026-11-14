import { NextResponse } from "next/server";
import db from "@/lib/db";
import { getSessionUser } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getSessionUser();
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized. Admin access required." }, { status: 403 });
    }

    // Real database derived statistics
    const orderStats = db.prepare(`
      SELECT
        COUNT(*) as total_orders,
        COALESCE(SUM(CASE WHEN payment_status = 'PAID' THEN total ELSE 0 END), 0) as total_revenue,
        COALESCE(AVG(CASE WHEN payment_status = 'PAID' THEN total ELSE 0 END), 0) as avg_order_value,
        SUM(CASE WHEN fulfilment_status = 'PENDING' OR fulfilment_status = 'PROCESSING' THEN 1 ELSE 0 END) as pending_orders
      FROM orders
    `).get() as any;

    const productStats = db.prepare(`
      SELECT
        COUNT(*) as total_products,
        SUM(CASE WHEN stock_total <= 15 THEN 1 ELSE 0 END) as low_stock_count
      FROM products
    `).get() as any;

    const customerStats = db.prepare(`
      SELECT COUNT(*) as total_customers FROM users WHERE role = 'CUSTOMER'
    `).get() as any;

    const subscriberStats = db.prepare(`
      SELECT COUNT(*) as total_subscribers FROM newsletter_subscribers
    `).get() as any;

    const recentOrders = db.prepare(`
      SELECT id, order_number, customer_name, customer_email, total, currency, payment_status, fulfilment_status, created_at
      FROM orders
      ORDER BY created_at DESC
      LIMIT 6
    `).all();

    const lowStockProducts = db.prepare(`
      SELECT id, title, slug, price, stock_total
      FROM products
      WHERE stock_total <= 25
      ORDER BY stock_total ASC
      LIMIT 5
    `).all();

    return NextResponse.json({
      stats: {
        totalRevenue: Math.round(orderStats.total_revenue),
        totalOrders: orderStats.total_orders,
        avgOrderValue: Math.round(orderStats.avg_order_value),
        pendingOrders: orderStats.pending_orders || 0,
        totalProducts: productStats.total_products,
        lowStockCount: productStats.low_stock_count || 0,
        totalCustomers: customerStats.total_customers,
        totalSubscribers: subscriberStats.total_subscribers,
      },
      recentOrders,
      lowStockProducts,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to load admin stats" }, { status: 500 });
  }
}

