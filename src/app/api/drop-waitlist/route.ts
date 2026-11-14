import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { email, dropName } = await req.json();
    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Valid email required." }, { status: 400 });
    }

    const id = `wait_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const finalDrop = dropName || "CHAPTER 04 // NO CURFEW";

    db.prepare(`
      INSERT OR IGNORE INTO drop_notifications (id, email, drop_name)
      VALUES (?, ?, ?)
    `).run(id, email.toLowerCase().trim(), finalDrop);

    return NextResponse.json({ success: true, message: `Notification confirmed for ${finalDrop}. You will receive early access link 30 minutes before launch.` });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to join waitlist" }, { status: 500 });
  }
}

