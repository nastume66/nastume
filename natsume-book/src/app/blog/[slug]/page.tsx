import Link from "next/link";
import { notFound } from "next/navigation";
import { getPostBySlug } from "@/lib/blog";
import MarkdownContent from "@/components/blog/MarkdownContent";

export const dynamic = "force-dynamic";

export default async function BlogDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return notFound();

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <Link href="/blog" className="text-sm text-amber-700 hover:text-amber-800 dark:text-amber-400">
        ← 返回博客列表
      </Link>
      <h1 className="mt-4 text-3xl font-bold text-zinc-900 dark:text-zinc-100">{post.title}</h1>
      <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">{post.created_at.slice(0, 10)}</p>

      <article className="mt-8 rounded-2xl border border-amber-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <MarkdownContent content={post.content} />
      </article>
    </div>
  );
}
