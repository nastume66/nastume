import BlogListClient from "@/components/blog/BlogListClient";
import BlogAuthEntryCard from "@/components/blog/BlogAuthEntryCard";

export const dynamic = "force-dynamic";

export default function BlogPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">我的专栏</h1>
      <p className="mt-2 text-zinc-600 dark:text-zinc-400">你可以在后台自定义栏目并发布自己的内容。</p>

      <BlogAuthEntryCard />

      <BlogListClient />
    </div>
  );
}
