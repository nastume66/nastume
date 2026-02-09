import fs from "node:fs";
import path from "node:path";
import { NextResponse } from "next/server";

function tail(file: string, lines = 200) {
  if (!fs.existsSync(file)) return [] as string[];
  const arr = fs.readFileSync(file, "utf8").split(/\r?\n/);
  return arr.slice(-lines).filter(Boolean);
}

export async function GET() {
  const ws = process.env.OPENCLAW_WORKSPACE || "/Users/nastume/.openclaw/workspace";
  const memDir = path.join(ws, "memory");
  const items: Array<{ ts: string; type: string; source: string; text: string }> = [];

  if (fs.existsSync(memDir)) {
    const files = fs.readdirSync(memDir).filter(x => x.endsWith(".md")).sort().slice(-3);
    for (const f of files) {
      const lines = tail(path.join(memDir, f), 30);
      lines.forEach((text) => items.push({ ts: "", type: "memory", source: f, text }));
    }
  }

  // Optional: ingest latest subagent transcript snippets if present
  const home = process.env.HOME || "";
  const sessionsRoot = path.join(home, ".openclaw", "agents", "main", "sessions");
  if (fs.existsSync(sessionsRoot)) {
    const jsonl = fs.readdirSync(sessionsRoot).filter(x => x.endsWith(".jsonl")).sort().slice(-2);
    for (const f of jsonl) {
      const lines = tail(path.join(sessionsRoot, f), 20);
      lines.forEach((text) => items.push({ ts: "", type: "session", source: f, text: text.slice(0, 220) }));
    }
  }

  return NextResponse.json({ items: items.slice(-200).reverse() });
}
