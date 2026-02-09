"use client";
import { useEffect, useState } from "react";

type Item = { ts: string; type: string; source: string; text: string };

export function ActivityFeed() {
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    fetch("/api/activity").then(r => r.json()).then(d => setItems(d.items ?? []));
  }, []);

  return (
    <section>
      <h2 className="text-xl font-semibold mb-3">Activity Feed</h2>
      <div className="space-y-2 max-h-[380px] overflow-auto">
        {items.map((x, i) => (
          <div key={i} className="text-sm border border-zinc-800 rounded p-2">
            <div className="text-zinc-400">{x.ts} · {x.type} · {x.source}</div>
            <div>{x.text}</div>
          </div>
        ))}
        {!items.length && <div className="text-zinc-500 text-sm">No activity yet.</div>}
      </div>
    </section>
  );
}
