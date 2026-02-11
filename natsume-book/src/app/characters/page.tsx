const characters = [
  { name: "夏目贵志", role: "主角", note: "能看见妖怪，温柔又坚定。" },
  { name: "猫咪老师（斑）", role: "保镖", note: "嘴硬心软，贪吃爱酒。" },
  { name: "名取周一", role: "除妖师", note: "看似轻浮，实则可靠。" },
  { name: "田沼要", role: "朋友", note: "理解夏目的少数人之一。" },
];

export default function CharactersPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <h1 className="text-3xl font-bold text-zinc-900">角色图鉴</h1>
      <p className="mt-2 text-zinc-600">先放核心角色，后续可扩展详情页。</p>
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {characters.map((c) => (
          <article key={c.name} className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
            <h2 className="text-xl font-semibold text-zinc-900">{c.name}</h2>
            <p className="mt-1 text-sm text-amber-700">{c.role}</p>
            <p className="mt-3 text-sm leading-7 text-zinc-700">{c.note}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
