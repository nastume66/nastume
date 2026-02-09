"use client";
import { useState } from "react";

type Hit = { path: string; line?: number; excerpt: string };

export function GlobalSearch() {
  const [q, setQ] = useState("");
  const [hits, setHits] = useState<Hit[]>([]);

  async function run() {
    const r = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
    const d = await r.json();
    setHits(d.hits ?? []);
  }

  return (
    <section>
      <h2 className="text-xl font-semibold mb-3">Global Search</h2>
      <div className="flex gap-2 mb-3">
        <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search memory, docs, tasks..."
          className="flex-1 bg-zinc-950 border border-zinc-700 rounded px-3 py-2" />
        <button onClick={run} className="px-3 py-2 rounded bg-white text-black">Search</button>
      </div>
      <div className="space-y-2 max-h-[300px] overflow-auto">
        {hits.map((h, i) => (
          <div key={i} className="border border-zinc-800 rounded p-2 text-sm">
            <div className="text-zinc-400">{h.path}{h.line ? `#${h.line}` : ""}</div>
            <div>{h.excerpt}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
