const seasons = [
  { season: "第一季", highlights: ["初遇猫咪老师", "友人帐的秘密", "归还名字的开始"] },
  { season: "第二季", highlights: ["人与妖之间", "夏目的成长", "更深的羁绊"] },
  { season: "第三季", highlights: ["过去与现在", "新妖怪登场", "温柔延续"] },
];

export default function EpisodesPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <h1 className="text-3xl font-bold text-zinc-900">剧集索引</h1>
      <p className="mt-2 text-zinc-600">按季整理，你后面可加每集观后感。</p>
      <div className="mt-8 space-y-4">
        {seasons.map((s) => (
          <section key={s.season} className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
            <h2 className="text-xl font-semibold text-zinc-900">{s.season}</h2>
            <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-zinc-700">
              {s.highlights.map((h) => (
                <li key={h}>{h}</li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
