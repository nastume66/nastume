import Link from "next/link";
import { notFound } from "next/navigation";
import { getPostBySlug } from "@/lib/blog";

export const dynamic = "force-dynamic";

function renderSimpleMarkdown(text: string) {
  return text.split("\n").map((line, i) => {
    if (line.startsWith("## ")) {
      return (
        <h2 key={i} className="mt-6 text-xl font-semibold text-zinc-900 dark:text-zinc-100">
          {line.replace("## ", "")}
        </h2>
      );
    }
    if (line.startsWith("- ")) {
      return (
        <li key={i} className="ml-5 list-disc text-zinc-700 dark:text-zinc-300">
          {line.replace("- ", "")}
        </li>
      );
    }
    if (!line.trim()) return <div key={i} className="h-2" />;
    return (
      <p key={i} className="leading-8 text-zinc-700 dark:text-zinc-300">
        {line}
      </p>
    );
  });
}

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

      <article className="mt-8 space-y-1 rounded-2xl border border-amber-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        {renderSimpleMarkdown(post.content)}
      </article>
    </div>
  );
}
