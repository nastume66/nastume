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
    <div className="min-h-[calc(100vh-56px)] bg-gradient-to-b from-amber-50 via-orange-50 to-white dark:from-zinc-950 dark:via-zinc-950 dark:to-zinc-900">
      <section className="mx-auto max-w-5xl px-4 py-12 md:py-24">
        <div className="mb-6 overflow-hidden rounded-2xl border border-amber-200/70 bg-gradient-to-r from-amber-100 via-orange-100 to-rose-100 p-5 text-zinc-800 dark:border-amber-500/30 dark:from-zinc-800 dark:via-zinc-800 dark:to-zinc-700 dark:text-zinc-100">
          <p className="text-sm font-medium">🍃 本周横幅</p>
          <p className="mt-1 text-sm">“把名字还给你，也把温柔还给自己。”</p>
        </div>

        <div className="relative overflow-hidden rounded-3xl border border-amber-100 bg-white/80 p-6 shadow-sm md:p-12 dark:border-zinc-800 dark:bg-zinc-900/80">
          <div className="pointer-events-none absolute -right-16 -top-16 h-52 w-52 rounded-full bg-amber-200/40 blur-2xl" />
          <div className="pointer-events-none absolute -bottom-20 -left-16 h-52 w-52 rounded-full bg-orange-200/40 blur-2xl" />

          <p className="mb-3 text-sm font-medium tracking-widest text-amber-700 dark:text-amber-400">NATSUME YUUJINCHOU</p>
          <h1 className="text-3xl font-bold leading-tight text-zinc-900 md:text-5xl dark:text-zinc-100">夏目友人帐 · 友人之庭</h1>
          <p className="mt-5 max-w-2xl text-sm leading-7 text-zinc-700 md:text-base md:leading-8 dark:text-zinc-300">
            一个温柔的小站，记录《夏目友人帐》的角色、剧集和治愈瞬间。
            现在是第二版基础框架，后续可继续加图集、时间线和互动功能。
          </p>

          <div className="mt-8 grid gap-3 md:grid-cols-3">
            {highlights.map((item) => (
              <article key={item.title} className="rounded-2xl border border-amber-100 bg-white/90 p-4 dark:border-zinc-700 dark:bg-zinc-800/80">
                <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">{item.title}</h2>
                <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-300">{item.desc}</p>
              </article>
            ))}
          </div>
        </div>

        <section className="mt-8 grid gap-4 md:grid-cols-[1.2fr_1fr]">
          <article className="rounded-2xl border border-amber-100 bg-white/80 p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/80">
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">首页插画位</h3>
            <p className="mt-2 text-sm leading-7 text-zinc-600 dark:text-zinc-300">后续可换成你喜欢的海报/截图（注意版权来源标注）。</p>
            <div className="mt-4 flex h-44 items-center justify-center rounded-xl bg-gradient-to-br from-amber-100 via-orange-100 to-rose-100 text-4xl dark:from-zinc-800 dark:via-zinc-700 dark:to-zinc-600">
              🐱🌿
            </div>
          </article>

          <div className="grid gap-4">
            {quotes.map((q) => (
              <article key={q} className="rounded-2xl border border-amber-100 bg-white/80 p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/80">
                <p className="text-sm leading-7 text-zinc-700 dark:text-zinc-300">“{q}”</p>
              </article>
            ))}
          </div>
        </section>
      </section>
    </div>
  );
}
