"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import seasons from "@/data/episodes.json";

type Episode = { no: number; title: string };
type Season = {
  season: string;
  year: string;
  tone?: "spring" | "summer" | "autumn" | "winter";
  highlights: string[];
  image?: string;
  episodes: Episode[];
};

const seasonList = seasons as Season[];

const toneClass: Record<string, string> = {
  spring: "from-emerald-50 to-lime-50 border-emerald-200",
  summer: "from-sky-50 to-cyan-50 border-sky-200",
  autumn: "from-amber-50 to-orange-50 border-amber-200",
  winter: "from-slate-50 to-zinc-50 border-slate-200",
};

export default function EpisodesPage() {
  const [activeSeason, setActiveSeason] = useState(seasonList[0].season);
  const [activeEpisode, setActiveEpisode] = useState<number>(1);
  const [note, setNote] = useState("");

  const currentSeason = useMemo(
    () => seasonList.find((s) => s.season === activeSeason) || seasonList[0],
    [activeSeason]
  );

  const noteKey = `${activeSeason}-${activeEpisode}`;

  useEffect(() => {
    const old = localStorage.getItem(`ep-note:${noteKey}`) || "";
    setNote(old);
  }, [noteKey]);

  const saveNote = () => {
    localStorage.setItem(`ep-note:${noteKey}`, note);
    alert("已保存这集观后感 ✅");
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">剧集档案</h1>
      <p className="mt-2 text-zinc-600 dark:text-zinc-400">按季度浏览、点集记录观后感，也可以把每集当作小日记。</p>

      <div className="mt-6 flex flex-wrap gap-2">
        {seasonList.map((s) => (
          <button
            key={s.season}
            onClick={() => {
              setActiveSeason(s.season);
              setActiveEpisode(1);
            }}
            className={`rounded-full px-3 py-1 text-sm ${activeSeason === s.season ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900" : "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"}`}
          >
            {s.season}
          </button>
        ))}
      </div>

      <section className={`mt-6 overflow-hidden rounded-2xl border bg-gradient-to-r p-5 ${toneClass[currentSeason.tone || "autumn"]}`}>
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-xl font-semibold text-zinc-900">{currentSeason.season}</h2>
          <span className="rounded-full bg-white/80 px-3 py-1 text-xs text-zinc-700">{currentSeason.year}</span>
        </div>

        {currentSeason.image && (
          <div className="mt-4 overflow-hidden rounded-xl border border-white/60">
            <Image src={currentSeason.image} alt={currentSeason.season} width={1000} height={320} className="h-44 w-full object-cover" />
          </div>
        )}

        <ul className="mt-4 list-disc space-y-1 pl-5 text-sm text-zinc-700">
          {currentSeason.highlights.map((h) => (
            <li key={h}>{h}</li>
          ))}
        </ul>
      </section>

      <section className="mt-6 rounded-2xl border border-amber-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">{currentSeason.season} 全部剧集</h3>
        <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6">
          {currentSeason.episodes.map((ep) => (
            <button
              key={ep.no}
              onClick={() => setActiveEpisode(ep.no)}
              className={`rounded-lg border px-2 py-2 text-xs ${activeEpisode === ep.no ? "border-amber-500 bg-amber-100 text-amber-800" : "border-zinc-200 bg-white text-zinc-700 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-300"}`}
            >
              {String(ep.no).padStart(2, "0")} · {ep.title}
            </button>
          ))}
        </div>
      </section>

      <section className="mt-6 rounded-2xl border border-amber-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
          {currentSeason.season} · 第{String(activeEpisode).padStart(2, "0")}话 观后感
        </h3>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="写下这一集带给你的感受..."
          className="mt-3 min-h-40 w-full rounded-xl border border-zinc-200 p-3 text-sm dark:border-zinc-700 dark:bg-zinc-950"
        />
        <div className="mt-3 flex gap-2">
          <button onClick={saveNote} className="rounded-xl bg-amber-600 px-4 py-2 text-sm text-white">保存观后感</button>
          <button
            onClick={() => {
              setNote("");
              localStorage.removeItem(`ep-note:${noteKey}`);
            }}
            className="rounded-xl border border-zinc-200 px-4 py-2 text-sm"
          >
            清空本集
          </button>
        </div>
      </section>
    </div>
  );
}
