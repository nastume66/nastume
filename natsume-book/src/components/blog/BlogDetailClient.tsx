"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getSupabaseClient, BlogPost } from "@/lib/supabase";
import MarkdownContent from "@/components/blog/MarkdownContent";

export default function BlogDetailClient({ slug }: { slug: string }) {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("正在加载文章...");

  useEffect(() => {
    const supabase = getSupabaseClient();
    if (!supabase) {
      setMsg("未配置 Supabase。");
      setLoading(false);
      return;
    }

    const load = async () => {
      const { data: authData } = await supabase.auth.getSession();
      const uid = authData.session?.user?.id;

      if (!uid) {
        setMsg("请先到后台登录后查看文章。\n");
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .eq("slug", slug)
        .eq("status", "published")
        .eq("author_id", uid)
        .maybeSingle();

      if (error || !data) {
        setMsg("没找到这篇文章，可能已删除或你当前账号无权限查看。");
        setLoading(false);
        return;
      }

      setPost(data as BlogPost);
      setLoading(false);
    };

    void load();
  }, [slug]);

  if (loading) {
    return <div className="mx-auto max-w-3xl px-4 py-12 text-sm text-zinc-500">{msg}</div>;
  }

  if (!post) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12">
        <Link href="/blog" className="text-sm text-amber-700 hover:text-amber-800 dark:text-amber-400">
          ← 返回专栏
        </Link>
        <div className="mt-6 rounded-2xl border border-dashed border-zinc-300 p-6 text-sm text-zinc-500 dark:border-zinc-700 dark:text-zinc-400">
          {msg}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <Link href="/blog" className="text-sm text-amber-700 hover:text-amber-800 dark:text-amber-400">
        ← 返回专栏
      </Link>
      <h1 className="mt-4 text-3xl font-bold text-zinc-900 dark:text-zinc-100">{post.title}</h1>
      <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">{post.created_at.slice(0, 10)}</p>

      <article className="mt-8 rounded-2xl border border-amber-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <MarkdownContent content={post.content} />
      </article>
    </div>
  );
}
