import { NextResponse } from "next/server";
import db from "@/lib/db";
import { hashPassword, signToken } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { name, email, password, phone } = await req.json();
    if (!name || !email || !password) {
      return NextResponse.json({ error: "Name, email and password are required" }, { status: 400 });
    }

    const existing = db.prepare("SELECT id FROM users WHERE email = ?").get(email.toLowerCase().trim());
    if (existing) {
      return NextResponse.json({ error: "An account with this email already exists" }, { status: 409 });
    }

    const userId = `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const passwordHash = hashPassword(password);

    db.prepare(`
      INSERT INTO users (id, name, email, password_hash, role, phone)
      VALUES (?, ?, ?, ?, 'CUSTOMER', ?)
    `).run(userId, name.trim(), email.toLowerCase().trim(), passwordHash, phone || null);

    const payload = {
      id: userId,
      name: name.trim(),
      email: email.toLowerCase().trim(),
      role: "CUSTOMER" as const,
    };

    const token = signToken(payload);

    const response = NextResponse.json({ success: true, user: payload });
    response.cookies.set("hw_auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60,
      path: "/",
    });

    return response;
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Registration error" }, { status: 500 });
  }
}
