"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { getSupabaseClient } from "@/lib/supabase";
import StatusText from "@/components/common/StatusText";

type Message = {
  id: string;
  text: string;
  createdAt: string;
  nickname?: string | null;
  avatarUrl?: string | null;
};

function fallbackNickname(user: User | null) {
  if (!user?.email) return "友人";
  return user.email.split("@")[0] || "友人";
}

export default function GuestbookClient() {
  const [text, setText] = useState("");
  const [nicknameInput, setNicknameInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  const [user, setUser] = useState<User | null>(null);
  const [profileNickname, setProfileNickname] = useState("");
  const [profileAvatar, setProfileAvatar] = useState("");
  const [lastSubmitAt, setLastSubmitAt] = useState<number>(0);
  const [keyword, setKeyword] = useState("");
  const [likedIds, setLikedIds] = useState<string[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const saved = localStorage.getItem("guestbook-liked-ids");
      return saved ? (JSON.parse(saved) as string[]) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError("");
      const supabase = getSupabaseClient();

      if (!supabase) {
        setError("❌ 暂时无法连接数据服务，请稍后再试。");
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("guestbook_messages")
        .select("id, text, created_at, nickname, avatar_url")
        .order("created_at", { ascending: false })
        .limit(100);

      if (error) {
        setError("❌ 留言加载失败，请稍后重试。");
      } else {
        setMessages(
          (data ?? []).map((item) => ({
            id: item.id,
            text: item.text,
            createdAt: item.created_at,
            nickname: item.nickname,
            avatarUrl: item.avatar_url,
          }))
        );
      }

      const { data: authData } = await supabase.auth.getSession();
      const current = authData.session?.user ?? null;
      setUser(current);

      if (current) {
        const p = await supabase
          .from("user_profiles")
          .select("nickname, avatar_url")
          .eq("id", current.id)
          .maybeSingle();
        setProfileNickname(p.data?.nickname || fallbackNickname(current));
        setProfileAvatar(p.data?.avatar_url || "");
      } else {
        setProfileNickname("");
        setProfileAvatar("");
      }

      const { data: sub } = supabase.auth.onAuthStateChange(async (_e, session) => {
        const next = session?.user ?? null;
        setUser(next);
        if (next) {
          const p = await supabase
            .from("user_profiles")
            .select("nickname, avatar_url")
            .eq("id", next.id)
            .maybeSingle();
          setProfileNickname(p.data?.nickname || fallbackNickname(next));
          setProfileAvatar(p.data?.avatar_url || "");
        } else {
          setProfileNickname("");
          setProfileAvatar("");
        }
      });

      setLoading(false);
      return () => sub.subscription.unsubscribe();
    };

    void load();
  }, []);

  const sorted = useMemo(
    () => [...messages].sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt)),
    [messages]
  );

  const filtered = useMemo(() => {
    const k = keyword.trim().toLowerCase();
    if (!k) return sorted;
    return sorted.filter((m) => {
      const n = (m.nickname || "友人").toLowerCase();
      return m.text.toLowerCase().includes(k) || n.includes(k);
    });
  }, [sorted, keyword]);

  const toggleLike = (id: string) => {
    setLikedIds((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      localStorage.setItem("guestbook-liked-ids", JSON.stringify(next));
      return next;
    });
  };

  const renderHighlighted = (content: string) => {
    const k = keyword.trim();
    if (!k) return content;
    const escaped = k.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const parts = content.split(new RegExp(`(${escaped})`, "ig"));
    return parts.map((part, idx) =>
      part.toLowerCase() === k.toLowerCase() ? (
        <mark key={`${part}-${idx}`} className="rounded bg-amber-200 px-0.5 text-zinc-800">{part}</mark>
      ) : (
        <span key={`${part}-${idx}`}>{part}</span>
      )
    );
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const value = text.trim();
    if (!value || saving) return;

    if (value.length < 4) {
      setError("❌ 留言至少 4 个字再发送。");
      return;
    }

    const now = Date.now();
    if (now - lastSubmitAt < 10_000) {
      setError("❌ 发送太快了，请 10 秒后再试。");
      return;
    }

    const normalized = value.replace(/\s+/g, "").toLowerCase();
    const hasRecentDuplicate = messages.slice(0, 20).some((m) => m.text.replace(/\s+/g, "").toLowerCase() === normalized);
    if (hasRecentDuplicate) {
      setError("❌ 检测到重复留言，换一句新的吧。");
      return;
    }

    const supabase = getSupabaseClient();
    if (!supabase) {
      setError("❌ 暂时无法连接数据服务，请稍后再试。");
      return;
    }

    const finalNickname = user ? profileNickname || fallbackNickname(user) : nicknameInput.trim() || "友人";
    const finalAvatar = user ? profileAvatar || null : null;

    setSaving(true);
    setError("");

    const { data, error } = await supabase
      .from("guestbook_messages")
      .insert({
        text: value,
        nickname: finalNickname,
        avatar_url: finalAvatar,
        author_id: user?.id ?? null,
      })
      .select("id, text, created_at, nickname, avatar_url")
      .single();

    if (error || !data) {
      setError("❌ 留言发布失败，请稍后重试。");
      setSaving(false);
      return;
    }

    const msg: Message = {
      id: data.id,
      text: data.text,
      createdAt: data.created_at,
      nickname: data.nickname,
      avatarUrl: data.avatar_url,
    };

    setMessages((prev) => [msg, ...prev].slice(0, 100));
    setText("");
    if (!user) setNicknameInput("");
    setLastSubmitAt(Date.now());
    setSaving(false);
  };

  return (
    <section className="mt-8">
      <form onSubmit={onSubmit} className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
        {user ? (
          <div className="mb-3 flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50/70 px-3 py-2">
            <div className="flex items-center gap-2">
              {profileAvatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={profileAvatar} alt={profileNickname || fallbackNickname(user)} className="h-7 w-7 rounded-full object-cover" />
              ) : (
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-200 text-xs text-amber-800">
                  {(profileNickname || fallbackNickname(user)).slice(0, 1)}
                </div>
              )}
              <span className="text-sm text-emerald-800">{profileNickname || fallbackNickname(user)}</span>
            </div>
            <Link href="/admin" className="text-xs text-amber-700 hover:text-amber-800">
              去后台改昵称头像 →
            </Link>
          </div>
        ) : (
          <input
            value={nicknameInput}
            onChange={(e) => setNicknameInput(e.target.value)}
            placeholder="昵称（不填则显示“友人”）"
            className="mb-3 w-full rounded-xl border border-zinc-200 p-2 text-sm dark:border-zinc-700 dark:bg-zinc-950"
          />
        )}

        <label htmlFor="guestbook" className="mb-2 block text-sm font-medium text-zinc-700">
          写一句今天想说的话
        </label>
        <textarea
          id="guestbook"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="例如：今天也要温柔地面对世界。"
          className="min-h-24 w-full rounded-xl border border-zinc-200 p-3 text-sm outline-none ring-amber-300 placeholder:text-zinc-400 focus:ring"
        />
        <div className="mt-3 flex items-center justify-between">
          <p className="text-xs text-zinc-500">云端同步（跨设备可见，最多展示100条）</p>
          <button
            type="submit"
            disabled={saving}
            className="rounded-xl bg-amber-600 px-4 py-2 text-sm font-medium text-white hover:bg-amber-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? "⏳ 提交中..." : "发布留言"}
          </button>
        </div>
      </form>

      <StatusText message={error} className="mt-3 text-sm" />

      <div className="mt-4">
        <input
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="按关键词/昵称过滤留言"
          className="w-full rounded-xl border border-zinc-200 p-2 text-sm dark:border-zinc-700 dark:bg-zinc-950"
        />
      </div>

      <div className="mt-5 space-y-3">
        {loading ? (
          <p className="rounded-xl border border-dashed border-zinc-300 p-4 text-sm text-zinc-500">正在加载留言...</p>
        ) : filtered.length === 0 ? (
          <p className="rounded-xl border border-dashed border-zinc-300 p-4 text-sm text-zinc-500">
            {keyword.trim() ? "没有匹配的留言，换个关键词试试。" : "还没有留言，来写第一条吧。"}
          </p>
        ) : (
          filtered.map((msg) => {
            const displayName = msg.nickname?.trim() || "友人";
            return (
              <article key={msg.id} className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
                <div className="mb-2 flex items-center gap-2">
                  {msg.avatarUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={msg.avatarUrl} alt={displayName} className="h-6 w-6 rounded-full object-cover" />
                  ) : (
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-200 text-[10px] text-amber-800">{displayName.slice(0, 1)}</div>
                  )}
                  <span className="text-xs text-zinc-600">{renderHighlighted(displayName)}</span>
                </div>
                <p className="text-sm leading-7 text-zinc-700">{renderHighlighted(msg.text)}</p>
                <div className="mt-2 flex items-center justify-between">
                  <p className="text-xs text-zinc-400">{new Date(msg.createdAt).toLocaleString()}</p>
                  <button
                    type="button"
                    onClick={() => toggleLike(msg.id)}
                    className={`text-xs ${likedIds.includes(msg.id) ? "text-rose-500" : "text-zinc-500 hover:text-rose-500"}`}
                  >
                    {likedIds.includes(msg.id) ? "❤️ 已赞" : "🤍 点赞"}
                  </button>
                </div>
              </article>
            );
          })
        )}
      </div>
    </section>
  );
}
