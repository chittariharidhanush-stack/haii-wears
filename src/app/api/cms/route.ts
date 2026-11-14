import { NextResponse } from "next/server";
import db from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { brandConfig } from "@/config/brand";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const key = searchParams.get("key") || "brand_config";

    const row = db.prepare("SELECT value_json FROM cms_settings WHERE key = ?").get(key) as any;
    if (row && row.value_json) {
      return NextResponse.json({ config: JSON.parse(row.value_json) });
    }

    return NextResponse.json({ config: brandConfig });
  } catch (error: any) {
    return NextResponse.json({ config: brandConfig });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getSessionUser();
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized. Admin access required." }, { status: 403 });
    }

    const { key = "brand_config", config } = await req.json();
    if (!config) {
      return NextResponse.json({ error: "Config payload required" }, { status: 400 });
    }

    db.prepare(`
      INSERT OR REPLACE INTO cms_settings (key, value_json, updated_at)
      VALUES (?, ?, CURRENT_TIMESTAMP)
    `).run(key, JSON.stringify(config));

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to update CMS" }, { status: 500 });
  }
}

