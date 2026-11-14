import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "A valid email address is required." }, { status: 400 });
    }

    const cleanEmail = email.toLowerCase().trim();
    const id = `sub_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

    db.prepare(`
      INSERT OR IGNORE INTO newsletter_subscribers (id, email)
      VALUES (?, ?)
    `).run(id, cleanEmail);

    return NextResponse.json({ success: true, message: "Welcome to the inner circle. You are on the priority drop list." });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to subscribe" }, { status: 500 });
  }
}
