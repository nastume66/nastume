const logs = [
  { date: "2026-02-11", note: "新增博客后台（Supabase）与编辑器" },
  { date: "2026-02-11", note: "新增博客模块与文章详情页" },
  { date: "2026-02-11", note: "站点样式迭代：日间柔和模式" },
];

export default function ChangelogPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">更新日志</h1>
      <p className="mt-2 text-zinc-600 dark:text-zinc-400">记录网站每次关键改动，方便追踪版本。</p>
      <div className="mt-8 space-y-3">
        {logs.map((l) => (
          <article key={l.date + l.note} className="rounded-2xl border border-amber-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <p className="text-xs text-zinc-500 dark:text-zinc-400">{l.date}</p>
            <p className="mt-1 text-sm text-zinc-800 dark:text-zinc-200">{l.note}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
