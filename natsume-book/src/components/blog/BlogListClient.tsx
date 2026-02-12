"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { getSupabaseClient, BlogPost } from "@/lib/supabase";

type Post = Pick<BlogPost, "id" | "slug" | "title" | "summary" | "tags" | "created_at" | "status">;

export default function BlogListClient() {
  const [q, setQ] = useState("");
  const [activeTag, setActiveTag] = useState<string>("全部");
  const [posts, setPosts] = useState<Post[]>([]);
  const [stateText, setStateText] = useState("正在加载文章...");

  useEffect(() => {
    const supabase = getSupabaseClient();
    if (!supabase) {
      setStateText("未配置 Supabase，暂时无法加载文章。");
      return;
    }

    const loadOwnPosts = async () => {
      const { data: authData } = await supabase.auth.getSession();
      const uid = authData.session?.user?.id;

      if (!uid) {
        setPosts([]);
        setStateText("请先到后台登录，博客列表将显示当前登录账号的文章。");
        return;
      }

      const { data, error } = await supabase
        .from("posts")
        .select("id,slug,title,summary,tags,status,created_at")
        .eq("status", "published")
        .eq("author_id", uid)
        .order("created_at", { ascending: false });

      if (error) {
        setPosts([]);
        setStateText(`加载失败：${error.message}`);
        return;
      }

      const result = (data || []) as Post[];
      setPosts(result);
      setStateText(result.length === 0 ? "当前账号还没有已发布文章。" : "");
    };

    void loadOwnPosts();

    const { data: sub } = supabase.auth.onAuthStateChange(() => {
      void loadOwnPosts();
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  const tags = useMemo(() => {
    const s = new Set<string>();
    posts.forEach((p) => p.tags.forEach((t) => s.add(t)));
    return ["全部", ...Array.from(s)];
  }, [posts]);

  const filtered = useMemo(() => {
    const k = q.trim().toLowerCase();
    return posts.filter((p) => {
      const hitTag = activeTag === "全部" || p.tags.includes(activeTag);
      const hitQ = !k || [p.title, p.summary, p.tags.join(" ")].join(" ").toLowerCase().includes(k);
      return hitTag && hitQ;
    });
  }, [posts, q, activeTag]);

  return (
    <>
      <div className="mt-6 space-y-3 rounded-2xl border border-amber-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="搜索标题 / 标签 / 摘要"
          className="w-full rounded-xl border border-zinc-200 p-2 text-sm dark:border-zinc-700 dark:bg-zinc-950"
        />
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <button
              key={tag}
              onClick={() => setActiveTag(tag)}
              className={`rounded-full px-3 py-1 text-xs ${activeTag === tag ? "bg-amber-600 text-white" : "bg-amber-100 text-amber-700 dark:bg-zinc-800 dark:text-zinc-300"}`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 space-y-4">
        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-zinc-300 p-6 text-sm text-zinc-500 dark:border-zinc-700 dark:text-zinc-400">
            {stateText || "没有匹配的文章，换个关键词试试。"}
          </div>
        ) : (
          filtered.map((post) => (
            <article key={post.id} className="rounded-2xl border border-amber-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">{post.title}</h2>
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-medium text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
                    {post.status === "published" ? "已发布" : "草稿"}
                  </span>
                  <span className="text-xs text-zinc-500 dark:text-zinc-400">{post.created_at.slice(0, 10)}</span>
                </div>
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
          ))
        )}
      </div>
    </>
  );
}
