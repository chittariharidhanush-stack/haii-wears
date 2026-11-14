import { NextResponse } from "next/server";
import db from "@/lib/db";
import { getSessionUser } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const session = await getSessionUser();
    const data = await req.json();

    const {
      customer,
      shippingAddress,
      billingAddress,
      items,
      promoCode,
      paymentMethod,
      currency = "INR",
    } = data;

    if (!customer?.email || !customer?.name || !customer?.phone) {
      return NextResponse.json({ error: "Customer name, email and phone are required." }, { status: 400 });
    }

    if (!shippingAddress?.address_line1 || !shippingAddress?.city || !shippingAddress?.postal_code || !shippingAddress?.country) {
      return NextResponse.json({ error: "Complete shipping address is required." }, { status: 400 });
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Your shopping bag is empty." }, { status: 400 });
    }

    // Verify each product and calculate genuine subtotal from database
    let calculatedSubtotal = 0;
    const verifiedItems: any[] = [];

    const getProduct = db.prepare("SELECT * FROM products WHERE id = ?");

    for (const item of items) {
      const prod = getProduct.get(item.productId) as any;
      if (!prod) {
        return NextResponse.json({ error: `Product ${item.title || item.productId} no longer exists.` }, { status: 400 });
      }

      const sizes = JSON.parse(prod.sizes_json || "[]");
      const matchedSize = sizes.find((s: any) => s.size === item.size);

      if (matchedSize && matchedSize.stock < item.quantity) {
        return NextResponse.json({
          error: `Insufficient inventory for ${prod.title} (Size: ${item.size}). Only ${matchedSize.stock} remaining.`
        }, { status: 400 });
      }

      const unitPrice = prod.sale_price && prod.sale_price > 0 ? prod.sale_price : prod.price;
      const lineTotal = unitPrice * item.quantity;
      calculatedSubtotal += lineTotal;

      const firstImage = JSON.parse(prod.images_json || "[]")[0] || item.image || "/brand/icon.svg";

      verifiedItems.push({
        productId: prod.id,
        title: prod.title,
        image: firstImage,
        size: item.size || "M",
        color: item.color || "Default",
        quantity: item.quantity,
        unitPrice,
        lineTotal,
      });
    }

    // Promo discount calculation
    let discount = 0;
    if (promoCode) {
      const cleanCode = promoCode.trim().toUpperCase();
      const discounts: Record<string, number> = {
        HAII10: 10,
        AFTERDARK: 15,
        DROP20: 20,
        FIRSTDROP: 10,
      };
      if (discounts[cleanCode]) {
        discount = Math.round((calculatedSubtotal * discounts[cleanCode]) / 100);
      }
    }

    // Shipping calculation (Free over ₹2,999 in India, intl calculated)
    const isIndia = (shippingAddress.country || "").toLowerCase() === "india";
    let shippingFee = 0;
    if (isIndia) {
      shippingFee = calculatedSubtotal >= 2999 ? 0 : 150;
    } else {
      shippingFee = calculatedSubtotal >= 8000 ? 0 : 1800; // ~$22 intl
    }

    const finalTotal = Math.max(0, calculatedSubtotal - discount + shippingFee);

    // Generate clean unique Order ID
    const randomSuffix = Math.floor(10000 + Math.random() * 90000);
    const orderNumber = `HW-ORD-${randomSuffix}`;
    const orderId = `ord_${Date.now()}_${randomSuffix}`;

    const paymentStatus = paymentMethod === "CASH_ON_DELIVERY" ? "PENDING" : "PAID";
    const fulfilmentStatus = "PROCESSING";

    // Insert order and order items in an ACID transaction
    const executeOrderTransaction = db.transaction(() => {
      db.prepare(`
        INSERT INTO orders (
          id, order_number, user_id, customer_email, customer_name, customer_phone,
          shipping_address_json, billing_address_json, subtotal, discount, shipping_fee, tax, total,
          currency, payment_method, payment_status, fulfilment_status, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
      `).run(
        orderId,
        orderNumber,
        session?.id || null,
        customer.email.toLowerCase().trim(),
        customer.name.trim(),
        customer.phone.trim(),
        JSON.stringify(shippingAddress),
        JSON.stringify(billingAddress || shippingAddress),
        calculatedSubtotal,
        discount,
        shippingFee,
        0,
        finalTotal,
        currency,
        paymentMethod || "RAZORPAY_UPI",
        paymentStatus,
        fulfilmentStatus
      );

      const insertItem = db.prepare(`
        INSERT INTO order_items (
          id, order_id, product_id, product_title, product_image, size, color, quantity, unit_price, total_price
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      const updateStock = db.prepare(`
        UPDATE products SET sizes_json = ?, stock_total = MAX(0, stock_total - ?) WHERE id = ?
      `);

      for (let i = 0; i < verifiedItems.length; i++) {
        const it = verifiedItems[i];
        insertItem.run(
          `item_${Date.now()}_${i}`,
          orderId,
          it.productId,
          it.title,
          it.image,
          it.size,
          it.color,
          it.quantity,
          it.unitPrice,
          it.lineTotal
        );

        // Deduct inventory
        const prod = getProduct.get(it.productId) as any;
        if (prod) {
          const sizes = JSON.parse(prod.sizes_json || "[]");
          const updatedSizes = sizes.map((s: any) =>
            s.size === it.size ? { ...s, stock: Math.max(0, s.stock - it.quantity) } : s
          );
          updateStock.run(JSON.stringify(updatedSizes), it.quantity, it.productId);
        }
      }
    });

    executeOrderTransaction();

    return NextResponse.json({
      success: true,
      orderId,
      orderNumber,
      total: finalTotal,
      currency,
    });
  } catch (error: any) {
    console.error("Checkout error:", error);
    return NextResponse.json({ error: error.message || "Checkout processing error" }, { status: 500 });
  }
}
