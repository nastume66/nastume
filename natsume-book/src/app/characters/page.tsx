const characters = [
  {
    name: "夏目贵志",
    role: "主角",
    note: "能看见妖怪，温柔又坚定。",
    detail: "继承外婆玲子的友人帐，在归还名字的旅途中逐渐理解自己。",
  },
  {
    name: "猫咪老师（斑）",
    role: "保镖",
    note: "嘴硬心软，贪吃爱酒。",
    detail: "强大的妖怪“斑”，以招财猫外形活动，和夏目结下深厚羁绊。",
  },
  {
    name: "名取周一",
    role: "除妖师",
    note: "看似轻浮，实则可靠。",
    detail: "知名演员兼除妖师，行事成熟，常在关键时刻帮助夏目。",
  },
  {
    name: "田沼要",
    role: "朋友",
    note: "理解夏目的少数人之一。",
    detail: "虽看不见妖怪，却能感知异样，是夏目重要的人类朋友。",
  },
];

export default function CharactersPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <h1 className="text-3xl font-bold text-zinc-900">角色图鉴</h1>
      <p className="mt-2 text-zinc-600">点击“查看详情”可展开角色说明。</p>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {characters.map((c) => (
          <article key={c.name} className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-amber-700">🐾</div>
              <div>
                <h2 className="text-xl font-semibold text-zinc-900">{c.name}</h2>
                <p className="text-sm text-amber-700">{c.role}</p>
              </div>
            </div>

            <p className="text-sm leading-7 text-zinc-700">{c.note}</p>

            <details className="mt-3 rounded-xl bg-zinc-50 p-3">
              <summary className="cursor-pointer text-sm font-medium text-zinc-800">查看详情</summary>
              <p className="mt-2 text-sm leading-7 text-zinc-600">{c.detail}</p>
            </details>
          </article>
        ))}
      </div>
    </div>
  );
}
