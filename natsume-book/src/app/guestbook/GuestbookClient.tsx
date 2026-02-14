"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { getSupabaseClient } from "@/lib/supabase";

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

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError("");
      const supabase = getSupabaseClient();

      if (!supabase) {
        setError("暂时无法连接数据服务，请稍后再试。");
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("guestbook_messages")
        .select("id, text, created_at, nickname, avatar_url")
        .order("created_at", { ascending: false })
        .limit(100);

      if (error) {
        setError("留言加载失败，请稍后重试。");
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

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const value = text.trim();
    if (!value || saving) return;

    const supabase = getSupabaseClient();
    if (!supabase) {
      setError("暂时无法连接数据服务，请稍后再试。");
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
      setError("留言发布失败，请稍后重试。");
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
            {saving ? "提交中..." : "发布留言"}
          </button>
        </div>
      </form>

      {error ? <p className="mt-3 text-sm text-rose-600">{error}</p> : null}

      <div className="mt-5 space-y-3">
        {loading ? (
          <p className="rounded-xl border border-dashed border-zinc-300 p-4 text-sm text-zinc-500">正在加载留言...</p>
        ) : sorted.length === 0 ? (
          <p className="rounded-xl border border-dashed border-zinc-300 p-4 text-sm text-zinc-500">还没有留言，来写第一条吧。</p>
        ) : (
          sorted.map((msg) => {
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
                  <span className="text-xs text-zinc-600">{displayName}</span>
                </div>
                <p className="text-sm leading-7 text-zinc-700">{msg.text}</p>
                <p className="mt-2 text-xs text-zinc-400">{new Date(msg.createdAt).toLocaleString()}</p>
              </article>
            );
          })
        )}
      </div>
    </section>
  );
}
