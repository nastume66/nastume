import { NextRequest, NextResponse } from "next/server";
import { grepFiles, walkMarkdown } from "../../../lib/fsSearch";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q")?.trim() || "";
  if (!q) return NextResponse.json({ hits: [] });

  const ws = process.env.OPENCLAW_WORKSPACE || "/Users/nastume/.openclaw/workspace";
  const files = walkMarkdown(ws);
  const hits = grepFiles(files, q, 120);
  return NextResponse.json({ hits });
}
