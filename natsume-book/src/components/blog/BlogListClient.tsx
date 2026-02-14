"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { getSupabaseClient, BlogCategory, BlogPost } from "@/lib/supabase";

type Post = Pick<BlogPost, "id" | "slug" | "title" | "summary" | "tags" | "created_at" | "status" | "category_id" | "author_id">;

type Profile = {
  nickname: string | null;
  avatar_url: string | null;
};

export default function BlogListClient() {
  const [q, setQ] = useState("");
  const [activeTag, setActiveTag] = useState<string>("全部");
  const [activeCategory, setActiveCategory] = useState<string>("全部");
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [stateText, setStateText] = useState("正在加载文章...");
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    const supabase = getSupabaseClient();
    if (!supabase) return;

    const loadOwnPosts = async () => {
      const { data: authData } = await supabase.auth.getSession();
      const uid = authData.session?.user?.id;

      if (!uid) {
        setPosts([]);
        setCategories([]);
        setStateText("请先登录后台，专栏会按当前账号展示。");
        return;
      }

      const [postsRes, catRes] = await Promise.all([
        supabase
          .from("posts")
          .select("id,slug,title,summary,tags,status,category_id,created_at,author_id")
          .eq("status", "published")
          .eq("author_id", uid)
          .order("created_at", { ascending: false }),
        supabase.from("categories").select("*").eq("author_id", uid).order("sort_order", { ascending: true }),
      ]);

      if (postsRes.error) {
        setPosts([]);
        setStateText("文章加载失败，请稍后重试。");
        return;
      }

      setPosts((postsRes.data || []) as Post[]);
      setCategories((catRes.data || []) as BlogCategory[]);
      setStateText((postsRes.data || []).length === 0 ? "你还没有已发布文章，去后台发第一篇吧。" : "");

      const profileRes = await supabase.from("user_profiles").select("nickname,avatar_url").eq("id", uid).maybeSingle();
      setProfile((profileRes.data as Profile | null) ?? null);
    };

    void loadOwnPosts();
    const { data: sub } = supabase.auth.onAuthStateChange(() => void loadOwnPosts());
    return () => sub.subscription.unsubscribe();
  }, []);

  const categoryMap = useMemo(() => Object.fromEntries(categories.map((c) => [c.id, c.name])), [categories]);

  const tags = useMemo(() => {
    const s = new Set<string>();
    posts.forEach((p) => p.tags.forEach((t) => s.add(t)));
    return ["全部", ...Array.from(s)];
  }, [posts]);

  const categoryNames = useMemo(() => ["全部", ...categories.map((c) => c.name)], [categories]);

  const filtered = useMemo(() => {
    const k = q.trim().toLowerCase();
    return posts.filter((p) => {
      const categoryName = p.category_id ? categoryMap[p.category_id] : "未分类";
      const hitCategory = activeCategory === "全部" || categoryName === activeCategory;
      const hitTag = activeTag === "全部" || p.tags.includes(activeTag);
      const hitQ = !k || [p.title, p.summary, p.tags.join(" "), categoryName || ""].join(" ").toLowerCase().includes(k);
      return hitCategory && hitTag && hitQ;
    });
  }, [posts, q, activeTag, activeCategory, categoryMap]);

  const displayName = profile?.nickname?.trim() || "友人";

  return (
    <>
      <div className="mt-6 space-y-3 rounded-2xl border border-amber-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="搜索标题 / 栏目 / 标签 / 摘要" className="w-full rounded-xl border border-zinc-200 p-2 text-sm dark:border-zinc-700 dark:bg-zinc-950" />

        <div>
          <p className="mb-2 text-xs text-zinc-500">栏目</p>
          <div className="flex flex-wrap gap-2">
            {categoryNames.map((name) => (
              <button key={name} onClick={() => setActiveCategory(name)} className={`rounded-full px-3 py-1 text-xs ${activeCategory === name ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900" : "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"}`}>
                {name}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-2 text-xs text-zinc-500">标签</p>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <button key={tag} onClick={() => setActiveTag(tag)} className={`rounded-full px-3 py-1 text-xs ${activeTag === tag ? "bg-amber-600 text-white" : "bg-amber-100 text-amber-700 dark:bg-zinc-800 dark:text-zinc-300"}`}>
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-zinc-300 p-6 text-sm text-zinc-500 dark:border-zinc-700 dark:text-zinc-400">{stateText || "没有匹配内容，换个关键词试试。"}</div>
        ) : (
          filtered.map((post) => {
            const categoryName = post.category_id ? categoryMap[post.category_id] : "未分类";
            return (
              <article key={post.id} className="rounded-2xl border border-amber-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                <div className="flex items-center justify-between gap-3">
                  <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">{post.title}</h2>
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-medium text-emerald-700">{post.status === "published" ? "已发布" : "草稿"}</span>
                    <span className="text-xs text-zinc-500 dark:text-zinc-400">{post.created_at.slice(0, 10)}</span>
                  </div>
                </div>
                <div className="mt-2 flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
                  {profile?.avatar_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={profile.avatar_url} alt={displayName} className="h-6 w-6 rounded-full object-cover" />
                  ) : (
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-200 text-[10px] text-amber-800">{displayName.slice(0, 1)}</div>
                  )}
                  <span>{displayName}</span>
                </div>
                <p className="mt-2 text-sm leading-7 text-zinc-700 dark:text-zinc-300">{post.summary}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="rounded-full bg-zinc-100 px-2 py-1 text-xs text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">栏目：{categoryName || "未分类"}</span>
                  {post.tags.map((tag) => (
                    <span key={tag} className="rounded-full bg-amber-100 px-2 py-1 text-xs text-amber-700 dark:bg-zinc-800 dark:text-zinc-300">{tag}</span>
                  ))}
                </div>
                <Link href={`/blog/${post.slug}?pid=${post.id}`} className="mt-4 inline-block text-sm font-medium text-amber-700 hover:text-amber-800 dark:text-amber-400">阅读全文 →</Link>
              </article>
            );
          })
        )}
      </div>
    </>
  );
}
