"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

type Message = {
  id: string;
  text: string;
  createdAt: string;
};

const STORAGE_KEY = "natsume-guestbook-messages";

export default function GuestbookClient() {
  const [text, setText] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw) as Message[];
      setMessages(parsed);
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  }, [messages]);

  const sorted = useMemo(
    () => [...messages].sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt)),
    [messages]
  );

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const value = text.trim();
    if (!value) return;

    const msg: Message = {
      id: crypto.randomUUID(),
      text: value,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [msg, ...prev].slice(0, 30));
    setText("");
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
          <p className="text-xs text-zinc-500">仅保存在当前浏览器（最多30条）</p>
          <button
            type="submit"
            className="rounded-xl bg-amber-600 px-4 py-2 text-sm font-medium text-white hover:bg-amber-700"
          >
            留言
          </button>
        </div>
      </form>

      <div className="mt-5 space-y-3">
        {sorted.length === 0 ? (
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
