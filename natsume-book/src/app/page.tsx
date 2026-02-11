const quotes = [
  "愿你被温柔以待，即使世界偶尔粗糙。",
  "名字被归还，羁绊却会留下。",
  "能看见妖怪的人，也能看见孤独。",
];

export default function Home() {
  return (
    <div className="min-h-[calc(100vh-56px)] bg-gradient-to-b from-amber-50 via-orange-50 to-white">
      <section className="mx-auto max-w-5xl px-4 py-20">
        <p className="mb-3 text-sm font-medium tracking-widest text-amber-700">NATSUME YUUJINCHOU</p>
        <h1 className="text-4xl font-bold leading-tight text-zinc-900 md:text-5xl">
          夏目友人帐 · 治愈系动漫主题站
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-8 text-zinc-700">
          这里记录角色、剧集和那些温柔的瞬间。先做一个轻量但好看的版本，后续再加图集、时间线和互动留言。
        </p>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {quotes.map((q) => (
            <article key={q} className="rounded-2xl border border-amber-100 bg-white/80 p-4 shadow-sm">
              <p className="text-sm leading-7 text-zinc-700">“{q}”</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
