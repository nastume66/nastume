"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getSupabaseClient, BlogPost } from "@/lib/supabase";
import MarkdownContent from "@/components/blog/MarkdownContent";

type Profile = { nickname: string | null; avatar_url: string | null };

export default function BlogDetailClient({ slug, pid }: { slug: string; pid?: string }) {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
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
      setLoading(true);
      const { data: authData } = await supabase.auth.getSession();
      const uid = authData.session?.user?.id;

      let data: BlogPost | null = null;
      let error: { message: string } | null = null;

      // 1) strongest path: fetch by explicit post id from list link
      if (pid) {
        const byId = await supabase
          .from("posts")
          .select("*")
          .eq("id", pid)
          .eq("status", "published")
          .maybeSingle();
        data = (byId.data as BlogPost | null) ?? null;
        error = byId.error ? { message: byId.error.message } : null;
      }

      // 2) fallback by slug + current owner
      if (!data && uid) {
        const owned = await supabase
          .from("posts")
          .select("*")
          .eq("slug", slug)
          .eq("status", "published")
          .eq("author_id", uid)
          .maybeSingle();
        data = (owned.data as BlogPost | null) ?? null;
        error = owned.error ? { message: owned.error.message } : error;
      }

      // 3) final fallback by slug
      if (!data) {
        const fallback = await supabase
          .from("posts")
          .select("*")
          .eq("slug", slug)
          .eq("status", "published")
          .maybeSingle();
        data = (fallback.data as BlogPost | null) ?? null;
        error = fallback.error ? { message: fallback.error.message } : error;
      }

      if (error || !data) {
        setPost(null);
        setMsg("没找到这篇文章，可能是链接 slug 不一致。你回后台点一次“编辑”后再保存，我来帮你自动修复。\n也可以回专栏页重新点一次。");
        setLoading(false);
        return;
      }

      setPost(data as BlogPost);
      if ((data as BlogPost).author_id) {
        const p = await supabase.from("user_profiles").select("nickname,avatar_url").eq("id", (data as BlogPost).author_id).maybeSingle();
        setProfile((p.data as Profile | null) ?? null);
      } else {
        setProfile(null);
      }
      setMsg("");
      setLoading(false);
    };

    void load();
    const { data: sub } = supabase.auth.onAuthStateChange(() => {
      void load();
    });

    return () => sub.subscription.unsubscribe();
  }, [slug, pid]);

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

  const displayName = profile?.nickname?.trim() || "友人";

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <Link href="/blog" className="text-sm text-amber-700 hover:text-amber-800 dark:text-amber-400">
        ← 返回专栏
      </Link>
      <h1 className="mt-4 text-3xl font-bold text-zinc-900 dark:text-zinc-100">{post.title}</h1>
      <div className="mt-2 flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
        {profile?.avatar_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={profile.avatar_url} alt={displayName} className="h-7 w-7 rounded-full object-cover" />
        ) : (
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-200 text-xs text-amber-800">{displayName.slice(0, 1)}</div>
        )}
        <span>{displayName}</span>
        <span>·</span>
        <span>{post.created_at.slice(0, 10)}</span>
      </div>

      <article className="mt-8 rounded-2xl border border-amber-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <MarkdownContent content={post.content} />
      </article>
    </div>
  );
}
