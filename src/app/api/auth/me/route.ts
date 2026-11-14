import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import db from "@/lib/db";

export async function GET() {
  const session = await getSessionUser();
  if (!session) {
    return NextResponse.json({ user: null });
  }

  const user = db.prepare("SELECT id, name, email, role, phone, created_at FROM users WHERE id = ?").get(session.id) as any;
  if (!user) {
    return NextResponse.json({ user: null });
  }

  return NextResponse.json({ user });
}

