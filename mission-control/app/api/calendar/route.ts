import { NextResponse } from "next/server";

export async function GET() {
  const gateway = process.env.OPENCLAW_GATEWAY_URL || "http://127.0.0.1:18789";
  const token = process.env.OPENCLAW_GATEWAY_TOKEN || "";

  try {
    const r = await fetch(`${gateway}/tools/cron`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        ...(token ? { authorization: `Bearer ${token}` } : {})
      },
      body: JSON.stringify({ action: "list", includeDisabled: true })
    });
    const data = await r.json();
    const jobs = data?.result?.jobs || data?.jobs || [];
    return NextResponse.json({ jobs });
  } catch (e: any) {
    return NextResponse.json({ jobs: [], error: e?.message || "failed to fetch cron list" }, { status: 200 });
  }
}
