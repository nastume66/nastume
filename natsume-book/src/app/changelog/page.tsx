const logs = [
  {
    date: "2026-02-13",
    notes: [
      "统一身份展示组件（昵称/头像/邮箱）并在专栏、剧集、后台复用。",
      "优化后台与剧集交互反馈：✅ 成功 / ⏳ 处理中 / ❌ 失败。",
      "新增留言板反垃圾策略：最少字数、提交节流、重复内容拦截。",
      "新增留言板关键词过滤与高亮，提升历史留言检索效率。",
      "新增留言点赞功能（含云端计数版本，待执行 likes 表 SQL 后完全生效）。",
      "补强后台安全交互：删除文章/栏目加入二次确认。",
    ],
  },
  {
    date: "2026-02-12",
    notes: [
      "剧集页升级为‘私密观后感 + 公开短评’双层模式。",
      "新增用户资料体系（nickname/avatar），并与剧集、专栏联动展示。",
      "留言板从本地存储迁移到 Supabase 云端同步。",
      "专栏支持自定义栏目（创建、重命名、拖拽排序、筛选）。",
    ],
  },
  {
    date: "2026-02-11",
    notes: [
      "新增博客后台（Supabase）与富文本编辑器。",
      "新增博客模块与文章详情页。",
      "站点样式迭代：日间柔和模式。",
    ],
  },
];

export default function ChangelogPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">更新日志</h1>
      <p className="mt-2 text-zinc-600 dark:text-zinc-400">记录网站每次关键改动，方便追踪版本。</p>

      <div className="mt-8 space-y-4">
        {logs.map((l) => (
          <article key={l.date} className="rounded-2xl border border-amber-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <p className="text-xs text-zinc-500 dark:text-zinc-400">{l.date}</p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-zinc-800 dark:text-zinc-200">
              {l.notes.map((n) => (
                <li key={n}>{n}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </div>
  );
}
