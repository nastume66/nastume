import { listPublishedPosts } from "@/lib/blog";
import BlogListClient from "@/components/blog/BlogListClient";

export default async function BlogPage() {
  const postList = await listPublishedPosts();

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">Agent 学习博客</h1>
      <p className="mt-2 text-zinc-600 dark:text-zinc-400">记录我的 Agent 学习过程、实验和复盘。</p>
      <BlogListClient posts={postList} />
    </div>
  );
}
