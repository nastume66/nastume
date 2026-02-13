"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { getSupabaseClient } from "@/lib/supabase";

type Profile = {
  nickname: string | null;
  avatar_url: string | null;
};

export default function BlogAuthEntryCard() {
  const supabase = useMemo(() => getSupabaseClient(), []);
  const [email, setEmail] = useState<string | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);

  const loadProfile = async (uid?: string) => {
    if (!supabase || !uid) {
      setProfile(null);
      return;
    }
    const { data } = await supabase.from("user_profiles").select("nickname,avatar_url").eq("id", uid).maybeSingle();
    setProfile((data as Profile | null) ?? null);
  };

  useEffect(() => {
    if (!supabase) return;

    supabase.auth.getSession().then(({ data }) => {
      setEmail(data.session?.user?.email ?? null);
      void loadProfile(data.session?.user?.id);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setEmail(session?.user?.email ?? null);
      void loadProfile(session?.user?.id);
    });

    return () => sub.subscription.unsubscribe();
  }, [supabase]);

  const displayName = profile?.nickname?.trim() || (email ? email.split("@")[0] : "友人");

  return (
    <div className="mt-6 rounded-2xl border border-amber-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      {email ? (
        <>
          <div className="flex items-center gap-2">
            {profile?.avatar_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={profile.avatar_url} alt={displayName} className="h-8 w-8 rounded-full object-cover" />
            ) : (
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-200 text-xs text-amber-800">{displayName.slice(0, 1)}</div>
            )}
            <div className="leading-tight">
              <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200">{displayName}</p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">{email}</p>
            </div>
          </div>
          <Link href="/admin" className="mt-3 inline-block text-sm font-medium text-emerald-700 hover:text-emerald-800 dark:text-emerald-400">
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
