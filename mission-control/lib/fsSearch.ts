import fs from "node:fs";
import path from "node:path";

export function walkMarkdown(root: string, acc: string[] = []): string[] {
  if (!fs.existsSync(root)) return acc;
  for (const ent of fs.readdirSync(root, { withFileTypes: true })) {
    const p = path.join(root, ent.name);
    if (ent.isDirectory()) walkMarkdown(p, acc);
    else if (/\.(md|txt|jsonl)$/i.test(ent.name)) acc.push(p);
  }
  return acc;
}

export function grepFiles(files: string[], q: string, maxHits = 100) {
  const hits: Array<{ path: string; line?: number; excerpt: string }> = [];
  const needle = q.toLowerCase();
  for (const f of files) {
    try {
      const lines = fs.readFileSync(f, "utf8").split(/\r?\n/);
      lines.forEach((line, i) => {
        if (line.toLowerCase().includes(needle) && hits.length < maxHits) {
          hits.push({ path: f, line: i + 1, excerpt: line.trim().slice(0, 240) });
        }
      });
    } catch {}
    if (hits.length >= maxHits) break;
  }
  return hits;
}
