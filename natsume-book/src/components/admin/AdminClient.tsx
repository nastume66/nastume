"use client";

import { useEffect, useMemo, useState } from "react";
import { getSupabaseClient, BlogPost } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";
import RichTextEditor from "@/components/admin/RichTextEditor";

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
  const [user, setUser] = useState<User | null>(null);
  const [isSendingLogin, setIsSendingLogin] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

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

    supabase.auth.getSession().then(({ data }) => {
      const current = data.session?.user ?? null;
      setUser(current);
      setMsg(current ? `已登录：${current.email}` : "请先点击登录邮箱链接完成认证");
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      const current = session?.user ?? null;
      setUser(current);
      setMsg(current ? `已登录：${current.email}` : "请先点击登录邮箱链接完成认证");
    });

    loadPosts();
    return () => sub.subscription.unsubscribe();
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
    try {
      setIsSendingLogin(true);
      setMsg("正在发送登录邮件...");
      const redirectBase = process.env.NEXT_PUBLIC_SITE_URL || window.location.origin;
      const { error } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: { emailRedirectTo: `${redirectBase}/admin` },
      });
      setMsg(error ? `登录失败：${error.message}` : "✅ 登录链接已发送到邮箱（请检查收件箱/垃圾箱）");
    } catch (e) {
      setMsg(`登录失败：${e instanceof Error ? e.message : "未知错误"}`);
    } finally {
      setIsSendingLogin(false);
    }
  };

  const uploadImages = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    if (!supabase) {
      setMsg("未连接 Supabase，无法上传图片");
      return;
    }
    if (!user) {
      setMsg("请先登录后再上传图片");
      return;
    }

    setMsg(`正在上传 ${files.length} 张图片...`);
    const htmlBlocks: string[] = [];

    for (const file of Array.from(files)) {
      const ext = file.name.split(".").pop() || "png";
      const path = `blog/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error } = await supabase.storage.from("blog-images").upload(path, file, {
        cacheControl: "3600",
        upsert: false,
      });
      if (error) {
        setMsg(`上传失败：${error.message}`);
        return;
      }
      const { data } = supabase.storage.from("blog-images").getPublicUrl(path);
      htmlBlocks.push(`<p><img src="${data.publicUrl}" alt="${file.name}" /></p>`);
    }

    setEditor((v) => ({ ...v, content: `${v.content}${htmlBlocks.join("\n")}` }));
    setMsg(`✅ 已上传 ${files.length} 张图片并插入正文`);
  };

  const save = async () => {
    if (!supabase) {
      setMsg("未连接 Supabase，无法保存");
      return;
    }
    if (!user) {
      setMsg("保存失败：你当前未登录（RLS 已开启），请先完成邮箱登录");
      return;
    }
    if (!editor.title.trim() || !editor.slug.trim() || !editor.content.trim()) {
      setMsg("标题、slug、正文不能为空");
      return;
    }

    const payload = {
      title: editor.title,
      slug: editor.slug,
      summary: editor.summary,
      tags: editor.tags.split(",").map((t) => t.trim()).filter(Boolean),
      content: editor.content,
      status: editor.status,
    };

    try {
      setIsSaving(true);
      setMsg("正在保存文章...");
      const { error } = editor.id
        ? await supabase.from("posts").update(payload).eq("id", editor.id)
        : await supabase.from("posts").insert(payload);

      setMsg(error ? `保存失败：${error.message}` : "✅ 已保存");
      if (!error) {
        setEditor(emptyEditor);
        await loadPosts();
      }
    } finally {
      setIsSaving(false);
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
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="你的邮箱"
            className="w-full rounded-xl border border-zinc-200 p-2 text-sm dark:border-zinc-700 dark:bg-zinc-950"
          />
          <button
            onClick={login}
            disabled={isSendingLogin}
            className="rounded-xl bg-amber-600 px-3 py-2 text-sm text-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSendingLogin ? "发送中..." : "登录"}
          </button>
        </div>

        <h3 className="mt-6 text-sm font-semibold text-zinc-800 dark:text-zinc-200">文章列表</h3>
        <div className="mt-2 space-y-2">
          {posts.map((p) => (
            <div key={p.id} className="rounded-xl border border-zinc-200 p-3 dark:border-zinc-700">
              <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{p.title}</p>
              <p className="text-xs text-zinc-500">/{p.slug} · {p.status}</p>
              <div className="mt-2 flex gap-2 text-xs">
                <button
                  className="text-amber-700"
                  onClick={() =>
                    setEditor({
                      id: p.id,
                      title: p.title,
                      slug: p.slug,
                      summary: p.summary,
                      tags: p.tags.join(", "),
                      content: p.content,
                      status: p.status,
                    })
                  }
                >
                  编辑
                </button>
                <button className="text-red-600" onClick={() => remove(p.id)}>
                  删除
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-amber-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">文章编辑器（富文本 2.0）</h2>

        <div className="mt-4 space-y-3">
          <input value={editor.title} onChange={(e) => setEditor((v) => ({ ...v, title: e.target.value }))} placeholder="标题" className="w-full rounded-xl border border-zinc-200 p-2 text-sm dark:border-zinc-700 dark:bg-zinc-950" />
          <input value={editor.slug} onChange={(e) => setEditor((v) => ({ ...v, slug: e.target.value }))} placeholder="slug（如 agent-day-3）" className="w-full rounded-xl border border-zinc-200 p-2 text-sm dark:border-zinc-700 dark:bg-zinc-950" />
          <input value={editor.summary} onChange={(e) => setEditor((v) => ({ ...v, summary: e.target.value }))} placeholder="摘要" className="w-full rounded-xl border border-zinc-200 p-2 text-sm dark:border-zinc-700 dark:bg-zinc-950" />
          <input value={editor.tags} onChange={(e) => setEditor((v) => ({ ...v, tags: e.target.value }))} placeholder="标签（逗号分隔）" className="w-full rounded-xl border border-zinc-200 p-2 text-sm dark:border-zinc-700 dark:bg-zinc-950" />

          <RichTextEditor
            value={editor.content}
            onChange={(html) => setEditor((v) => ({ ...v, content: html }))}
            onUpload={uploadImages}
          />

          <select value={editor.status} onChange={(e) => setEditor((v) => ({ ...v, status: e.target.value as "draft" | "published" }))} className="rounded-xl border border-zinc-200 p-2 text-sm dark:border-zinc-700 dark:bg-zinc-950">
            <option value="draft">草稿</option>
            <option value="published">发布</option>
          </select>

          <div className="flex gap-2">
            <button
              onClick={save}
              disabled={isSaving || !user}
              className="rounded-xl bg-amber-600 px-4 py-2 text-sm text-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSaving ? "保存中..." : user ? "保存文章" : "请先登录"}
            </button>
            <button onClick={() => setEditor(emptyEditor)} className="rounded-xl border border-zinc-200 px-4 py-2 text-sm">
              清空
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
