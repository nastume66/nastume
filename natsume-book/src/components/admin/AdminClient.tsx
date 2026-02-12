"use client";

import { useEffect, useMemo, useState } from "react";
import { getSupabaseClient, BlogPost } from "@/lib/supabase";

type EditorState = {
  id?: string;
  title: string;
  slug: string;
  summary: string;
  tags: string;
  content: string;
  status: "draft" | "published";
};

const emptyEditor: EditorState = {
  title: "",
  slug: "",
  summary: "",
  tags: "",
  content: "",
  status: "draft",
};

export default function AdminClient() {
  const supabase = useMemo(() => getSupabaseClient(), []);
  const [email, setEmail] = useState("");
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [editor, setEditor] = useState<EditorState>(emptyEditor);
  const [msg, setMsg] = useState("请先登录后台");

  const loadPosts = async () => {
    if (!supabase) return;
    const { data } = await supabase.from("posts").select("*").order("updated_at", { ascending: false });
    setPosts((data || []) as BlogPost[]);
  };

  useEffect(() => {
    if (!supabase) {
      setMsg("未连接 Supabase：请先配置环境变量并重新部署");
      return;
    }
    loadPosts();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = async () => {
    if (!email.trim()) {
      setMsg("请先输入邮箱地址");
      return;
    }
    if (!supabase) {
      setMsg("未检测到 Supabase 环境变量，请检查 Vercel 的 NEXT_PUBLIC_SUPABASE_URL / ANON_KEY");
      return;
    }
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: { emailRedirectTo: window.location.origin + "/admin" },
    });
    setMsg(error ? `登录失败：${error.message}` : "登录链接已发送到邮箱（请检查收件箱/垃圾箱）");
  };

  const save = async () => {
    if (!supabase) return;
    const payload = {
      title: editor.title,
      slug: editor.slug,
      summary: editor.summary,
      tags: editor.tags.split(",").map((t) => t.trim()).filter(Boolean),
      content: editor.content,
      status: editor.status,
    };

    const { error } = editor.id
      ? await supabase.from("posts").update(payload).eq("id", editor.id)
      : await supabase.from("posts").insert(payload);

    setMsg(error ? `保存失败：${error.message}` : "已保存");
    if (!error) {
      setEditor(emptyEditor);
      await loadPosts();
    }
  };

  const remove = async (id: string) => {
    if (!supabase) return;
    const { error } = await supabase.from("posts").delete().eq("id", id);
    setMsg(error ? `删除失败：${error.message}` : "已删除");
    if (!error) await loadPosts();
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
      <section className="rounded-2xl border border-amber-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">登录与状态</h2>
        <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">{msg}</p>
        <div className="mt-3 flex gap-2">
          <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="你的邮箱" className="w-full rounded-xl border border-zinc-200 p-2 text-sm dark:border-zinc-700 dark:bg-zinc-950" />
          <button onClick={login} className="rounded-xl bg-amber-600 px-3 py-2 text-sm text-white">登录</button>
        </div>

        <h3 className="mt-6 text-sm font-semibold text-zinc-800 dark:text-zinc-200">文章列表</h3>
        <div className="mt-2 space-y-2">
          {posts.map((p) => (
            <div key={p.id} className="rounded-xl border border-zinc-200 p-3 dark:border-zinc-700">
              <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{p.title}</p>
              <p className="text-xs text-zinc-500">/{p.slug} · {p.status}</p>
              <div className="mt-2 flex gap-2 text-xs">
                <button className="text-amber-700" onClick={() => setEditor({
                  id: p.id,
                  title: p.title,
                  slug: p.slug,
                  summary: p.summary,
                  tags: p.tags.join(", "),
                  content: p.content,
                  status: p.status,
                })}>编辑</button>
                <button className="text-red-600" onClick={() => remove(p.id)}>删除</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-amber-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">文章编辑器</h2>
        <div className="mt-4 space-y-3">
          <input value={editor.title} onChange={(e) => setEditor((v) => ({ ...v, title: e.target.value }))} placeholder="标题" className="w-full rounded-xl border border-zinc-200 p-2 text-sm dark:border-zinc-700 dark:bg-zinc-950" />
          <input value={editor.slug} onChange={(e) => setEditor((v) => ({ ...v, slug: e.target.value }))} placeholder="slug（如 agent-day-3）" className="w-full rounded-xl border border-zinc-200 p-2 text-sm dark:border-zinc-700 dark:bg-zinc-950" />
          <input value={editor.summary} onChange={(e) => setEditor((v) => ({ ...v, summary: e.target.value }))} placeholder="摘要" className="w-full rounded-xl border border-zinc-200 p-2 text-sm dark:border-zinc-700 dark:bg-zinc-950" />
          <input value={editor.tags} onChange={(e) => setEditor((v) => ({ ...v, tags: e.target.value }))} placeholder="标签（逗号分隔）" className="w-full rounded-xl border border-zinc-200 p-2 text-sm dark:border-zinc-700 dark:bg-zinc-950" />
          <textarea value={editor.content} onChange={(e) => setEditor((v) => ({ ...v, content: e.target.value }))} placeholder="正文（支持简单 markdown）" className="min-h-60 w-full rounded-xl border border-zinc-200 p-3 text-sm dark:border-zinc-700 dark:bg-zinc-950" />
          <select value={editor.status} onChange={(e) => setEditor((v) => ({ ...v, status: e.target.value as "draft" | "published" }))} className="rounded-xl border border-zinc-200 p-2 text-sm dark:border-zinc-700 dark:bg-zinc-950">
            <option value="draft">草稿</option>
            <option value="published">发布</option>
          </select>
          <div className="flex gap-2">
            <button onClick={save} className="rounded-xl bg-amber-600 px-4 py-2 text-sm text-white">保存文章</button>
            <button onClick={() => setEditor(emptyEditor)} className="rounded-xl border border-zinc-200 px-4 py-2 text-sm">清空</button>
          </div>
        </div>
      </section>
    </div>
  );
}
