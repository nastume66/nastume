"use client";

import { useState } from "react";
import Image from "next/image";
import charactersData from "@/data/characters.json";

type Character = {
  name: string;
  role: string;
  note: string;
  detail: string;
  emoji: string;
  color: string;
  image?: string;
};

const characters = charactersData as Character[];

export default function CharactersPage() {
  const [selected, setSelected] = useState<Character | null>(null);

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">角色图鉴</h1>
      <p className="mt-2 text-zinc-600 dark:text-zinc-400">点击卡片可查看角色详情。</p>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {characters.map((c) => (
          <button
            key={c.name}
            type="button"
            onClick={() => setSelected(c)}
            className="rounded-2xl border border-amber-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900"
          >
            <div className="mb-4 flex items-center gap-3">
              <div className={`flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br ${c.color} text-xl`}>
                {c.emoji}
              </div>
              <div>
                <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">{c.name}</h2>
                <p className="text-sm text-amber-700 dark:text-amber-400">{c.role}</p>
              </div>
            </div>

            <div className="mb-3 overflow-hidden rounded-xl border border-black/5 dark:border-white/10">
              {c.image ? (
                <Image
                  src={c.image}
                  alt={c.name}
                  width={640}
                  height={360}
                  className="h-28 w-full object-cover"
                />
              ) : (
                <div className={`h-28 bg-gradient-to-br ${c.color} dark:opacity-70`} />
              )}
            </div>

            <p className="text-sm leading-7 text-zinc-700 dark:text-zinc-300">{c.note}</p>
            <p className="mt-3 text-xs text-zinc-500 dark:text-zinc-400">点击查看详情</p>
          </button>
        ))}
      </div>

      {selected && (
        <div className="fixed inset-0 z-40 flex items-end justify-center bg-black/35 p-3 md:items-center" onClick={() => setSelected(null)}>
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl dark:bg-zinc-900" onClick={(e) => e.stopPropagation()}>
            <div className="mb-2 flex items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">{selected.name}</h3>
                <p className="text-sm text-amber-700 dark:text-amber-400">{selected.role}</p>
              </div>
              <button
                type="button"
                className="rounded-lg border border-zinc-200 px-2 py-1 text-sm text-zinc-600 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
                onClick={() => setSelected(null)}
              >
                关闭
              </button>
            </div>
            <p className="mt-3 text-sm leading-7 text-zinc-700 dark:text-zinc-300">{selected.detail}</p>
          </div>
        </div>
      )}
    </div>
  );
}
