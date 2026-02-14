"use client";

import { DragEvent, useEffect, useMemo, useState } from "react";
import { getSupabaseClient, BlogCategory, BlogPost } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";
import RichTextEditor from "@/components/admin/RichTextEditor";
import UserIdentityCard from "@/components/common/UserIdentityCard";

type Profile = {
  nickname: string | null;
  avatar_url: string | null;
};

type EditorState = {
  id?: string;
  title: string;
  slug: string;
  summary: string;
  tags: string;
  content: string;
  status: "draft" | "published";
  category_id?: string;
};

const emptyEditor: EditorState = {
  title: "",
  slug: "",
  summary: "",
  tags: "",
  content: "",
  status: "draft",
  category_id: "",
};

export default function AdminClient() {
  const supabase = useMemo(() => getSupabaseClient(), []);
  const [email, setEmail] = useState("");
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [draggingCategoryId, setDraggingCategoryId] = useState<string | null>(null);
  const [editor, setEditor] = useState<EditorState>(emptyEditor);
  const [msg, setMsg] = useState("请先登录后台");
  const [user, setUser] = useState<User | null>(null);
  const [isSendingLogin, setIsSendingLogin] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [nickname, setNickname] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  const fallbackNickname = (u: User | null) => (u?.email ? u.email.split("@")[0] || "友人" : "友人");

  const loadProfile = async (uid?: string, currentUser?: User | null) => {
    if (!supabase || !uid) {
      setProfile(null);
      setNickname("");
      setAvatarUrl("");
      return;
    }
    const { data } = await supabase.from("user_profiles").select("nickname,avatar_url").eq("id", uid).maybeSingle();
    const p = (data as Profile | null) ?? null;
    setProfile(p);
    setNickname(p?.nickname || fallbackNickname(currentUser || null));
    setAvatarUrl(p?.avatar_url || "");
  };

  const loadCategories = async (uid?: string) => {
    if (!supabase || !uid) return;
    const { data } = await supabase.from("categories").select("*").eq("author_id", uid).order("sort_order", { ascending: true });
    setCategories((data || []) as BlogCategory[]);
  };

  const loadPosts = async (uid?: string) => {
    if (!supabase) return;
    if (!uid) {
      setPosts([]);
      return;
    }
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .eq("author_id", uid)
      .order("updated_at", { ascending: false });

    if (error) {
      setMsg(`读取文章失败：${error.message}（请执行 supabase/author-migration.sql + categories-migration.sql）`);
      return;
    }
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
      setMsg(current ? "已登录" : "请先点击登录邮箱链接完成认证");
      void loadPosts(current?.id);
      void loadCategories(current?.id);
      void loadProfile(current?.id, current);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      const current = session?.user ?? null;
      setUser(current);
      setMsg(current ? "已登录" : "请先点击登录邮箱链接完成认证");
      void loadPosts(current?.id);
      void loadCategories(current?.id);
      void loadProfile(current?.id, current);
    });

    return () => sub.subscription.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [supabase]);

  const login = async () => {
    if (!email.trim()) return setMsg("请先输入邮箱地址");
    if (!supabase) return setMsg("未检测到 Supabase 环境变量，请检查 NEXT_PUBLIC_SUPABASE_URL / ANON_KEY");

    try {
      setIsSendingLogin(true);
      setMsg("正在发送登录邮件...");
      const redirectBase = process.env.NEXT_PUBLIC_SITE_URL || window.location.origin;
      const { error } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: { emailRedirectTo: `${redirectBase}/admin` },
      });
      setMsg(error ? `登录失败：${error.message}` : "✅ 登录链接已发送到邮箱");
    } finally {
      setIsSendingLogin(false);
    }
  };

  const switchAccount = async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
    setUser(null);
    setPosts([]);
    setCategories([]);
    setEditor(emptyEditor);
    setProfile(null);
    setNickname("");
    setAvatarUrl("");
    setMsg("已退出登录，可输入新邮箱切换账号");
  };

  const saveProfile = async () => {
    if (!supabase || !user) return;
    setIsSavingProfile(true);
    const { error } = await supabase.from("user_profiles").upsert(
      {
        id: user.id,
        nickname: nickname.trim() || fallbackNickname(user),
        avatar_url: avatarUrl.trim() || null,
      },
      { onConflict: "id" }
    );
    setIsSavingProfile(false);
    if (error) return setMsg(`资料保存失败：${error.message}`);
    setMsg("✅ 昵称/头像已保存");
    await loadProfile(user.id, user);
  };

  const uploadAvatar = async (file: File | null) => {
    if (!supabase || !user || !file) return;
    setIsUploadingAvatar(true);
    const ext = file.name.split(".").pop() || "png";
    const path = `avatars/${user.id}-${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("blog-images").upload(path, file, { cacheControl: "3600", upsert: false });
    setIsUploadingAvatar(false);
    if (error) return setMsg(`头像上传失败：${error.message}`);
    const publicUrl = supabase.storage.from("blog-images").getPublicUrl(path).data.publicUrl;
    setAvatarUrl(publicUrl);
    setMsg("✅ 头像已上传，点“保存资料”生效");
  };

  const createCategory = async () => {
    if (!supabase || !user || !newCategoryName.trim()) return;
    const slug = newCategoryName.trim().toLowerCase().replace(/\s+/g, "-");
    const nextOrder = categories.length;
    const { error } = await supabase.from("categories").insert({
      name: newCategoryName.trim(),
      slug,
      author_id: user.id,
      sort_order: nextOrder,
    });
    if (error) return setMsg(`创建栏目失败：${error.message}`);
    setNewCategoryName("");
    await loadCategories(user.id);
    setMsg("✅ 栏目已创建");
  };

  const deleteCategory = async (id: string) => {
    if (!supabase || !user) return;
    const { error } = await supabase.from("categories").delete().eq("id", id).eq("author_id", user.id);
    if (error) return setMsg(`删除栏目失败：${error.message}`);
    await loadCategories(user.id);
    setMsg("栏目已删除");
  };

  const renameCategory = async (category: BlogCategory) => {
    if (!supabase || !user) return;
    const nextName = window.prompt("输入新的栏目名", category.name)?.trim();
    if (!nextName || nextName === category.name) return;
    const nextSlug = nextName.toLowerCase().replace(/\s+/g, "-");
    const { error } = await supabase
      .from("categories")
      .update({ name: nextName, slug: nextSlug })
      .eq("id", category.id)
      .eq("author_id", user.id);
    if (error) return setMsg(`重命名失败：${error.message}`);
    await loadCategories(user.id);
    setMsg("✅ 栏目已重命名");
  };

  const reorderCategories = async (fromId: string, toId: string) => {
    if (!supabase || !user || fromId === toId) return;
    const list = [...categories];
    const fromIndex = list.findIndex((c) => c.id === fromId);
    const toIndex = list.findIndex((c) => c.id === toId);
    if (fromIndex < 0 || toIndex < 0) return;

    const [moved] = list.splice(fromIndex, 1);
    list.splice(toIndex, 0, moved);
    setCategories(list);

    for (let i = 0; i < list.length; i += 1) {
      await supabase
        .from("categories")
        .update({ sort_order: i })
        .eq("id", list[i].id)
        .eq("author_id", user.id);
    }
    setMsg("✅ 栏目顺序已更新");
  };

  const uploadImages = async (files: FileList | null): Promise<string[]> => {
    if (!files || files.length === 0 || !supabase || !user) return [];
    const urls: string[] = [];
    for (const file of Array.from(files)) {
      const ext = file.name.split(".").pop() || "png";
      const path = `blog/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error } = await supabase.storage.from("blog-images").upload(path, file, { cacheControl: "3600", upsert: false });
      if (error) {
        setMsg(`上传失败：${error.message}`);
        return [];
      }
      urls.push(supabase.storage.from("blog-images").getPublicUrl(path).data.publicUrl);
    }
    setMsg(`✅ 已上传 ${files.length} 张图片`);
    return urls;
  };

  const save = async () => {
    if (!supabase || !user) return setMsg("请先登录后保存");
    if (!editor.title.trim() || !editor.slug.trim() || !editor.content.trim()) return setMsg("标题、slug、正文不能为空");

    const payload = {
      title: editor.title,
      slug: editor.slug,
      summary: editor.summary,
      tags: editor.tags.split(",").map((t) => t.trim()).filter(Boolean),
      content: editor.content,
      status: editor.status,
      author_id: user.id,
      category_id: editor.category_id || null,
    };

    try {
      setIsSaving(true);
      const { error } = editor.id
        ? await supabase.from("posts").update(payload).eq("id", editor.id)
        : await supabase.from("posts").insert(payload);

      if (error) return setMsg(`保存失败：${error.message}`);
      setMsg("✅ 已保存");
      setEditor(emptyEditor);
      await loadPosts(user.id);
    } finally {
      setIsSaving(false);
    }
  };

  const remove = async (id: string) => {
    if (!supabase || !user) return;
    const { error } = await supabase.from("posts").delete().eq("id", id).eq("author_id", user.id);
    setMsg(error ? `删除失败：${error.message}` : "已删除");
    if (!error) await loadPosts(user.id);
  };

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-amber-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">内容后台（可自定义栏目）</h2>
            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">{msg}</p>
          </div>
          <div className="flex w-full gap-2 md:w-auto md:min-w-[520px]">
            {user ? (
              <div className="flex w-full items-center justify-end gap-2">
                <UserIdentityCard
                  name={nickname || fallbackNickname(user)}
                  email={user.email}
                  avatarUrl={profile?.avatar_url}
                  compact
                />
                <button onClick={switchAccount} className="rounded-xl border border-zinc-300 px-3 py-2 text-sm">切换账号</button>
              </div>
            ) : (
              <>
                <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="你的邮箱" className="w-full rounded-xl border border-zinc-200 p-2 text-sm dark:border-zinc-700 dark:bg-zinc-950" />
                <button onClick={login} disabled={isSendingLogin} className="rounded-xl bg-amber-600 px-3 py-2 text-sm text-white disabled:opacity-60">{isSendingLogin ? "发送中..." : "登录"}</button>
              </>
            )}
          </div>
        </div>

        {user ? (
          <div className="mt-4 rounded-xl border border-zinc-200 p-3 dark:border-zinc-700">
            <p className="text-sm font-medium">个人资料（博客/观后感共用）</p>
            <div className="mt-2 grid gap-2 md:grid-cols-2">
              <input value={nickname} onChange={(e) => setNickname(e.target.value)} placeholder="昵称" className="w-full rounded-xl border border-zinc-200 p-2 text-sm dark:border-zinc-700 dark:bg-zinc-950" />
              <div className="space-y-2">
                <input type="file" accept="image/*" onChange={(e) => uploadAvatar(e.target.files?.[0] || null)} className="w-full rounded-xl border border-zinc-200 p-2 text-sm dark:border-zinc-700 dark:bg-zinc-950" />
                {isUploadingAvatar ? <p className="text-xs text-zinc-500">头像上传中...</p> : null}
              </div>
            </div>
            <button onClick={saveProfile} disabled={isSavingProfile} className="mt-2 rounded-xl border border-zinc-300 px-3 py-2 text-xs disabled:opacity-60">{isSavingProfile ? "保存中..." : "保存资料"}</button>
          </div>
        ) : null}

        <div className="mt-4 rounded-xl border border-zinc-200 p-3 dark:border-zinc-700">
          <p className="text-sm font-medium">栏目管理（支持重命名 + 拖拽排序）</p>
          <div className="mt-2 flex gap-2">
            <input value={newCategoryName} onChange={(e) => setNewCategoryName(e.target.value)} placeholder="新增栏目名（如 跨境电商）" className="w-full rounded-xl border border-zinc-200 p-2 text-sm dark:border-zinc-700 dark:bg-zinc-950" />
            <button onClick={createCategory} className="rounded-xl bg-zinc-900 px-3 py-2 text-sm text-white dark:bg-zinc-100 dark:text-zinc-900">新增</button>
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {categories.map((c) => (
              <div
                key={c.id}
                draggable
                onDragStart={() => setDraggingCategoryId(c.id)}
                onDragOver={(e: DragEvent<HTMLDivElement>) => e.preventDefault()}
                onDrop={async () => {
                  if (!draggingCategoryId) return;
                  await reorderCategories(draggingCategoryId, c.id);
                  setDraggingCategoryId(null);
                }}
                className="inline-flex cursor-move items-center gap-2 rounded-full bg-amber-100 px-3 py-1 text-xs text-amber-700"
                title="拖拽可排序"
              >
                <span>☰ {c.name}</span>
                <button onClick={() => renameCategory(c)} className="text-zinc-700">改名</button>
                <button onClick={() => deleteCategory(c.id)} className="text-red-600">删</button>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 space-y-3">
          <input value={editor.title} onChange={(e) => setEditor((v) => ({ ...v, title: e.target.value }))} placeholder="标题" className="w-full rounded-xl border border-zinc-200 p-2 text-sm dark:border-zinc-700 dark:bg-zinc-950" />
          <input value={editor.slug} onChange={(e) => setEditor((v) => ({ ...v, slug: e.target.value }))} placeholder="slug" className="w-full rounded-xl border border-zinc-200 p-2 text-sm dark:border-zinc-700 dark:bg-zinc-950" />
          <input value={editor.summary} onChange={(e) => setEditor((v) => ({ ...v, summary: e.target.value }))} placeholder="摘要" className="w-full rounded-xl border border-zinc-200 p-2 text-sm dark:border-zinc-700 dark:bg-zinc-950" />
          <input value={editor.tags} onChange={(e) => setEditor((v) => ({ ...v, tags: e.target.value }))} placeholder="标签（逗号分隔）" className="w-full rounded-xl border border-zinc-200 p-2 text-sm dark:border-zinc-700 dark:bg-zinc-950" />

          <select value={editor.category_id || ""} onChange={(e) => setEditor((v) => ({ ...v, category_id: e.target.value }))} className="rounded-xl border border-zinc-200 p-2 text-sm dark:border-zinc-700 dark:bg-zinc-950">
            <option value="">未分类</option>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>

          <RichTextEditor value={editor.content} onChange={(html) => setEditor((v) => ({ ...v, content: html }))} onUpload={uploadImages} />

          <select value={editor.status} onChange={(e) => setEditor((v) => ({ ...v, status: e.target.value as "draft" | "published" }))} className="rounded-xl border border-zinc-200 p-2 text-sm dark:border-zinc-700 dark:bg-zinc-950">
            <option value="draft">草稿</option>
            <option value="published">发布</option>
          </select>

          <div className="flex gap-2">
            <button onClick={save} disabled={isSaving || !user} className="rounded-xl bg-amber-600 px-4 py-2 text-sm text-white disabled:opacity-60">{isSaving ? "保存中..." : "保存文章"}</button>
            <button onClick={() => setEditor(emptyEditor)} className="rounded-xl border border-zinc-200 px-4 py-2 text-sm">清空</button>
          </div>
        </div>
      </section>

      <details className="rounded-2xl border border-amber-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <summary className="cursor-pointer text-sm font-semibold text-zinc-800 dark:text-zinc-200">我的文章列表（点击展开）</summary>
        <div className="mt-3 space-y-2">
          {posts.length === 0 ? (
            <p className="text-xs text-zinc-500 dark:text-zinc-400">还没有文章，先写第一篇吧。</p>
          ) : (
            posts.map((p) => (
              <div key={p.id} className="rounded-xl border border-zinc-200 p-3 dark:border-zinc-700">
                <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{p.title}</p>
                <p className="text-xs text-zinc-500">/{p.slug} · {p.status}</p>
                <div className="mt-2 flex gap-2 text-xs">
                  <button className="text-amber-700" onClick={() => setEditor({ id: p.id, title: p.title, slug: p.slug, summary: p.summary, tags: p.tags.join(", "), content: p.content, status: p.status, category_id: p.category_id || "" })}>编辑</button>
                  <button className="text-red-600" onClick={() => remove(p.id)}>删除</button>
                </div>
              </div>
            ))
          )}
        </div>
      </details>
    </div>
  );
}
