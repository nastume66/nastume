"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { getSupabaseClient } from "@/lib/supabase";

export default function BlogAuthEntryCard() {
  const supabase = useMemo(() => getSupabaseClient(), []);
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    if (!supabase) return;

    supabase.auth.getSession().then(({ data }) => {
      setEmail(data.session?.user?.email ?? null);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setEmail(session?.user?.email ?? null);
    });

    return () => sub.subscription.unsubscribe();
  }, [supabase]);

  return (
    <div className="mt-6 rounded-2xl border border-amber-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      {email ? (
        <>
          <p className="text-sm text-zinc-700 dark:text-zinc-300">✅ 已登录：{email}</p>
          <Link href="/admin" className="mt-2 inline-block text-sm font-medium text-emerald-700 hover:text-emerald-800 dark:text-emerald-400">
            去后台继续写作 →
          </Link>
        </>
      ) : (
        <>
          <p className="text-sm text-zinc-700 dark:text-zinc-300">想直接写博客？现在可以从这里进入后台编辑。</p>
          <Link href="/admin" className="mt-2 inline-block text-sm font-medium text-amber-700 hover:text-amber-800 dark:text-amber-400">
            去登录并写作 →
          </Link>
        </>
      )}
    </div>
  );
}
