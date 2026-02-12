import BlogListClient from "@/components/blog/BlogListClient";

export const dynamic = "force-dynamic";

export default function BlogPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">Agent 学习博客</h1>
      <p className="mt-2 text-zinc-600 dark:text-zinc-400">记录我的 Agent 学习过程、实验和复盘。</p>

      <div className="mt-6 rounded-2xl border border-amber-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <p className="text-sm text-zinc-700 dark:text-zinc-300">想直接写博客？现在可以从这里进入后台编辑。</p>
        <a href="/admin" className="mt-2 inline-block text-sm font-medium text-amber-700 hover:text-amber-800 dark:text-amber-400">去登录并写作 →</a>
      </div>

      <BlogListClient />
    </div>
  );
}
