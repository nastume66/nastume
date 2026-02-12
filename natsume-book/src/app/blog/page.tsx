import Link from "next/link";
import { listPublishedPosts } from "@/lib/blog";

export default async function BlogPage() {
  const postList = await listPublishedPosts();

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">Agent 学习博客</h1>
      <p className="mt-2 text-zinc-600 dark:text-zinc-400">记录我的 Agent 学习过程、实验和复盘。</p>

      <div className="mt-8 space-y-4">
        {postList.map((post) => (
          <article key={post.id} className="rounded-2xl border border-amber-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">{post.title}</h2>
              <span className="text-xs text-zinc-500 dark:text-zinc-400">{post.created_at.slice(0, 10)}</span>
            </div>
            <p className="mt-2 text-sm leading-7 text-zinc-700 dark:text-zinc-300">{post.summary}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span key={tag} className="rounded-full bg-amber-100 px-2 py-1 text-xs text-amber-700 dark:bg-zinc-800 dark:text-zinc-300">
                  {tag}
                </span>
              ))}
            </div>
            <Link href={`/blog/${post.slug}`} className="mt-4 inline-block text-sm font-medium text-amber-700 hover:text-amber-800 dark:text-amber-400">
              阅读全文 →
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}
