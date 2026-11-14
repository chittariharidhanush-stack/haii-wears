import { NextResponse } from "next/server";
import db from "@/lib/db";
import { comparePassword, signToken } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    const user = db.prepare("SELECT * FROM users WHERE email = ?").get(email.toLowerCase().trim()) as any;
    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const isValid = comparePassword(password, user.password_hash);
    if (!isValid) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const payload = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    const token = signToken(payload);

    const response = NextResponse.json({ success: true, user: payload });
    response.cookies.set("hw_auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/",
    });

    return response;
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Login error" }, { status: 500 });
  }
}
