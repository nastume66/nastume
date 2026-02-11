import Image from "next/image";
import seasons from "@/data/episodes.json";

type Season = {
  season: string;
  year: string;
  highlights: string[];
  image?: string;
};

const seasonList = seasons as Season[];

export default function EpisodesPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">剧集索引</h1>
      <p className="mt-2 text-zinc-600 dark:text-zinc-400">时间线样式，方便后续补每集观后感。</p>

      <div className="mt-10 space-y-6 border-l-2 border-amber-200 pl-6 dark:border-amber-500/40">
        {seasonList.map((s) => (
          <section key={s.season} className="relative rounded-2xl border border-amber-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <span className="absolute -left-[33px] top-7 h-3 w-3 rounded-full bg-amber-500 ring-4 ring-amber-100 dark:ring-zinc-950" />
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">{s.season}</h2>
              <span className="rounded-full bg-amber-100 px-3 py-1 text-xs text-amber-700 dark:bg-amber-500/20 dark:text-amber-300">
                {s.year}
              </span>
            </div>

            {s.image && (
              <div className="mt-4 overflow-hidden rounded-xl border border-amber-100 dark:border-zinc-700">
                <Image src={s.image} alt={s.season} width={800} height={280} className="h-36 w-full object-cover" />
              </div>
            )}

            <ul className="mt-4 list-disc space-y-1 pl-5 text-sm text-zinc-700 dark:text-zinc-300">
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
