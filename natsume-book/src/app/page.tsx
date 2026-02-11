const quotes = [
  "愿你被温柔以待，即使世界偶尔粗糙。",
  "名字被归还，羁绊却会留下。",
  "能看见妖怪的人，也能看见孤独。",
];

const highlights = [
  { title: "角色图鉴", desc: "收录主要人物设定与关系。" },
  { title: "剧集索引", desc: "按季整理，支持补充观后感。" },
  { title: "友人帐", desc: "写下今天的心情与想说的话。" },
];

export default function Home() {
  return (
    <div className="min-h-[calc(100vh-56px)] bg-gradient-to-b from-amber-50 via-orange-50 to-white">
      <section className="mx-auto max-w-5xl px-4 py-12 md:py-24">
        <div className="relative overflow-hidden rounded-3xl border border-amber-100 bg-white/80 p-6 shadow-sm md:p-12">
          <div className="pointer-events-none absolute -right-16 -top-16 h-52 w-52 rounded-full bg-amber-200/40 blur-2xl" />
          <div className="pointer-events-none absolute -bottom-20 -left-16 h-52 w-52 rounded-full bg-orange-200/40 blur-2xl" />

          <p className="mb-3 text-sm font-medium tracking-widest text-amber-700">NATSUME YUUJINCHOU</p>
          <h1 className="text-3xl font-bold leading-tight text-zinc-900 md:text-5xl">夏目友人帐 · 友人之庭</h1>
          <p className="mt-5 max-w-2xl text-sm leading-7 text-zinc-700 md:text-base md:leading-8">
            一个温柔的小站，记录《夏目友人帐》的角色、剧集和治愈瞬间。
            现在是第二版基础框架，后续可继续加图集、时间线和互动功能。
          </p>

          <div className="mt-8 grid gap-3 md:grid-cols-3">
            {highlights.map((item) => (
              <article key={item.title} className="rounded-2xl border border-amber-100 bg-white/90 p-4">
                <h2 className="text-base font-semibold text-zinc-900">{item.title}</h2>
                <p className="mt-2 text-sm leading-6 text-zinc-600">{item.desc}</p>
              </article>
            ))}
          </div>
        </div>

        <section className="mt-8 grid gap-4 md:grid-cols-[1.2fr_1fr]">
          <article className="rounded-2xl border border-amber-100 bg-white/80 p-5 shadow-sm">
            <h3 className="text-lg font-semibold text-zinc-900">今日插画位（占位）</h3>
            <p className="mt-2 text-sm leading-7 text-zinc-600">后续可换成你喜欢的海报/截图（注意版权来源标注）。</p>
            <div className="mt-4 flex h-44 items-center justify-center rounded-xl bg-gradient-to-br from-amber-100 via-orange-100 to-rose-100 text-4xl">
              🐱🌿
            </div>
          </article>

          <div className="grid gap-4">
            {quotes.map((q) => (
              <article key={q} className="rounded-2xl border border-amber-100 bg-white/80 p-4 shadow-sm">
                <p className="text-sm leading-7 text-zinc-700">“{q}”</p>
              </article>
            ))}
          </div>
        </section>
      </section>
    </div>
  );
}
