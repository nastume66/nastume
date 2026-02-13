"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { getSupabaseClient } from "@/lib/supabase";

type Message = {
  id: string;
  text: string;
  createdAt: string;
};

export default function GuestbookClient() {
  const [text, setText] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError("");
      const supabase = getSupabaseClient();

      if (!supabase) {
        setError("未检测到数据库配置，当前环境无法跨设备同步。");
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("guestbook_messages")
        .select("id, text, created_at")
        .order("created_at", { ascending: false })
        .limit(100);

      if (error) {
        setError("留言读取失败，请稍后重试。");
      } else {
        setMessages(
          (data ?? []).map((item) => ({
            id: item.id,
            text: item.text,
            createdAt: item.created_at,
          }))
        );
      }

      setLoading(false);
    };

    load();
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
      setError("未检测到数据库配置，当前环境无法跨设备同步。");
      return;
    }

    setSaving(true);
    setError("");

    const { data, error } = await supabase
      .from("guestbook_messages")
      .insert({ text: value })
      .select("id, text, created_at")
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
    };

    setMessages((prev) => [msg, ...prev].slice(0, 100));
    setText("");
    setSaving(false);
  };

  return (
    <section className="mt-8">
      <form onSubmit={onSubmit} className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
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
            {saving ? "发送中..." : "留言"}
          </button>
        </div>
      </form>

      {error ? <p className="mt-3 text-sm text-rose-600">{error}</p> : null}

      <div className="mt-5 space-y-3">
        {loading ? (
          <p className="rounded-xl border border-dashed border-zinc-300 p-4 text-sm text-zinc-500">留言加载中...</p>
        ) : sorted.length === 0 ? (
          <p className="rounded-xl border border-dashed border-zinc-300 p-4 text-sm text-zinc-500">还没有留言，写下第一条吧。</p>
        ) : (
          sorted.map((msg) => (
            <article key={msg.id} className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
              <p className="text-sm leading-7 text-zinc-700">{msg.text}</p>
              <p className="mt-2 text-xs text-zinc-400">{new Date(msg.createdAt).toLocaleString()}</p>
            </article>
          ))
        )}
      </div>
    </section>
  );
}
