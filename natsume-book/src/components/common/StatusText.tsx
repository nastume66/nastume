"use client";

import type { CSSProperties } from "react";

type Props = {
  message?: string | null;
  className?: string;
  autoHideMs?: number;
};

export default function StatusText({ message, className = "", autoHideMs = 4000 }: Props) {
  if (!message) return null;

  const isSuccess = message.startsWith("✅");
  const tone = isSuccess
    ? "text-emerald-600"
    : message.startsWith("❌")
      ? "text-rose-600"
      : message.startsWith("⏳")
        ? "text-amber-700"
        : "text-zinc-500";

  return (
    <>
      <p
        className={`text-xs ${tone} ${className}`.trim()}
        style={
          isSuccess
            ? ({ animation: `statusFadeOut ${autoHideMs}ms ease forwards` } as CSSProperties)
            : undefined
        }
      >
        {message}
      </p>
      <style jsx>{`
        @keyframes statusFadeOut {
          0%, 70% { opacity: 1; }
          100% { opacity: 0; }
        }
      `}</style>
    </>
  );
}
