"use client";

import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [dark, setDark] = useState(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem("natsume-theme") === "dark";
  });

  useEffect(() => {
    const root = document.documentElement;
    if (dark) {
      root.classList.add("dark");
      localStorage.setItem("natsume-theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("natsume-theme", "light");
    }
  }, [dark]);

  const resetToLight = () => {
    localStorage.removeItem("natsume-theme");
    setDark(false);
    document.documentElement.classList.remove("dark");
  };

  return (
    <div className="flex items-center gap-1">
      <button
        type="button"
        onClick={() => setDark((v) => !v)}
        className="rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs text-zinc-700 shadow-sm hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
        aria-label="切换深色模式"
      >
        {dark ? "🌙 夜间" : "☀️ 日间"}
      </button>
      <button
        type="button"
        onClick={resetToLight}
        className="rounded-full border border-amber-200 bg-amber-50 px-2 py-1 text-[10px] text-amber-700 hover:bg-amber-100 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
        aria-label="重置主题"
      >
        重置
      </button>
    </div>
  );
}
