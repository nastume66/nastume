"use client";

import { useState } from "react";

type Character = {
  name: string;
  role: string;
  note: string;
  detail: string;
};

const characters: Character[] = [
  {
    name: "夏目贵志",
    role: "主角",
    note: "能看见妖怪，温柔又坚定。",
    detail: "继承外婆玲子的友人帐，在归还名字的旅途中逐渐理解自己，也慢慢学会接纳孤独与连接。",
  },
  {
    name: "猫咪老师（斑）",
    role: "保镖",
    note: "嘴硬心软，贪吃爱酒。",
    detail: "强大的妖怪“斑”，以招财猫外形活动。表面嫌弃夏目，关键时刻总会出手守护。",
  },
  {
    name: "名取周一",
    role: "除妖师",
    note: "看似轻浮，实则可靠。",
    detail: "知名演员兼除妖师，行事成熟，和夏目在“人类世界与妖怪世界”之间形成独特互助关系。",
  },
  {
    name: "田沼要",
    role: "朋友",
    note: "理解夏目的少数人之一。",
    detail: "虽看不见妖怪，却能感知异样。以平实和耐心给夏目重要的现实支点。",
  },
];

export default function CharactersPage() {
  const [selected, setSelected] = useState<Character | null>(null);

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <h1 className="text-3xl font-bold text-zinc-900">角色图鉴</h1>
      <p className="mt-2 text-zinc-600">点击卡片可查看角色详情。</p>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {characters.map((c) => (
          <button
            key={c.name}
            type="button"
            onClick={() => setSelected(c)}
            className="rounded-2xl border border-zinc-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-amber-700">🐾</div>
              <div>
                <h2 className="text-xl font-semibold text-zinc-900">{c.name}</h2>
                <p className="text-sm text-amber-700">{c.role}</p>
              </div>
            </div>
            <p className="text-sm leading-7 text-zinc-700">{c.note}</p>
            <p className="mt-3 text-xs text-zinc-500">点击查看详情</p>
          </button>
        ))}
      </div>

      {selected && (
        <div className="fixed inset-0 z-40 flex items-end justify-center bg-black/35 p-3 md:items-center" onClick={() => setSelected(null)}>
          <div
            className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-2 flex items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold text-zinc-900">{selected.name}</h3>
                <p className="text-sm text-amber-700">{selected.role}</p>
              </div>
              <button
                type="button"
                className="rounded-lg border border-zinc-200 px-2 py-1 text-sm text-zinc-600 hover:bg-zinc-50"
                onClick={() => setSelected(null)}
              >
                关闭
              </button>
            </div>
            <p className="mt-3 text-sm leading-7 text-zinc-700">{selected.detail}</p>
          </div>
        </div>
      )}
    </div>
  );
}
