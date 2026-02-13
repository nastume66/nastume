"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import type { User } from "@supabase/supabase-js";
import seasons from "@/data/episodes.json";
import { getSupabaseClient } from "@/lib/supabase";
import UserIdentityCard from "@/components/common/UserIdentityCard";

type Episode = { no: number; title: string; titleZh?: string };
type Season = {
  season: string;
  year: string;
  tone?: "spring" | "summer" | "autumn" | "winter";
  highlights: string[];
  image?: string;
  episodes: Episode[];
};

type PublicReview = {
  id: string;
  author_id: string;
  content: string;
  created_at: string;
};

type PublicProfile = {
  id: string;
  nickname: string | null;
  avatar_url: string | null;
};

const seasonList = seasons as Season[];

const toneClass: Record<string, string> = {
  spring: "from-emerald-50 to-lime-50 border-emerald-200",
  summer: "from-sky-50 to-cyan-50 border-sky-200",
  autumn: "from-amber-50 to-orange-50 border-amber-200",
  winter: "from-slate-50 to-zinc-50 border-slate-200",
};

function fallbackNickname(user: User | null) {
  if (!user?.email) return "友人";
  return user.email.split("@")[0] || "友人";
}

export default function EpisodesPage() {
  const supabase = useMemo(() => getSupabaseClient(), []);

  const [activeSeason, setActiveSeason] = useState(seasonList[0].season);
  const [activeEpisode, setActiveEpisode] = useState<number>(1);

  const [email, setEmail] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const [isSendingLogin, setIsSendingLogin] = useState(false);

  const [nickname, setNickname] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");

  const [note, setNote] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [publicReviews, setPublicReviews] = useState<PublicReview[]>([]);
  const [profilesMap, setProfilesMap] = useState<Record<string, PublicProfile>>({});
  const [hasMyPublicReview, setHasMyPublicReview] = useState(false);
  const [msg, setMsg] = useState("");

  const currentSeason = useMemo(
    () => seasonList.find((s) => s.season === activeSeason) || seasonList[0],
    [activeSeason]
  );

  const currentEpisode = useMemo(
    () => currentSeason.episodes.find((e) => e.no === activeEpisode),
    [currentSeason, activeEpisode]
  );

  useEffect(() => {
    if (!supabase) return;

    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => sub.subscription.unsubscribe();
  }, [supabase]);

  const loadMyProfile = async () => {
    if (!supabase || !user) {
      setNickname("");
      setAvatarUrl("");
      return;
    }

    const { data } = await supabase
      .from("user_profiles")
      .select("nickname, avatar_url")
      .eq("id", user.id)
      .maybeSingle();

    setNickname(data?.nickname || fallbackNickname(user));
    setAvatarUrl(data?.avatar_url || "");
  };

  // 个人资料维护已统一到 /admin

  const loadPublicReviews = async () => {
    if (!supabase) return;
    const { data } = await supabase
      .from("episode_reviews")
      .select("id, author_id, content, created_at")
      .eq("season", activeSeason)
      .eq("episode_no", activeEpisode)
      .order("created_at", { ascending: false })
      .limit(30);

    const reviews = (data || []) as PublicReview[];
    setPublicReviews(reviews);

    const ids = [...new Set(reviews.map((r) => r.author_id).filter(Boolean))];
    if (!ids.length) {
      setProfilesMap({});
      return;
    }

    const { data: profiles } = await supabase
      .from("user_profiles")
      .select("id, nickname, avatar_url")
      .in("id", ids);

    const map: Record<string, PublicProfile> = {};
    (profiles || []).forEach((p) => {
      map[p.id] = p as PublicProfile;
    });
    setProfilesMap(map);
  };

  const loadMyPrivateNote = async () => {
    if (!supabase || !user) {
      setNote("");
      return;
    }

    const { data } = await supabase
      .from("episode_notes")
      .select("content")
      .eq("author_id", user.id)
      .eq("season", activeSeason)
      .eq("episode_no", activeEpisode)
      .maybeSingle();

    setNote(data?.content || "");
  };

  const loadMyPublicFlag = async () => {
    if (!supabase || !user) {
      setHasMyPublicReview(false);
      return;
    }

    const { data } = await supabase
      .from("episode_reviews")
      .select("id")
      .eq("author_id", user.id)
      .eq("season", activeSeason)
      .eq("episode_no", activeEpisode)
      .maybeSingle();

    setHasMyPublicReview(Boolean(data?.id));
  };

  useEffect(() => {
    void loadPublicReviews();
    void loadMyPrivateNote();
    void loadMyPublicFlag();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeSeason, activeEpisode, user?.id]);

  useEffect(() => {
    void loadMyProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const sendLoginLink = async () => {
    if (!supabase || !email.trim()) return;
    setIsSendingLogin(true);
    setMsg("");

    const redirectBase = process.env.NEXT_PUBLIC_SITE_URL || window.location.origin;
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: { emailRedirectTo: `${redirectBase}/episodes` },
    });

    setIsSendingLogin(false);
    setMsg(error ? `登录失败：${error.message}` : "✅ 登录链接已发送，请去邮箱确认");
  };

  const savePrivateNote = async () => {
    if (!supabase || !user) return setMsg("请先登录后保存");
    setIsSaving(true);
    setMsg("");

    const { error } = await supabase.from("episode_notes").upsert(
      {
        author_id: user.id,
        season: activeSeason,
        episode_no: activeEpisode,
        content: note.trim(),
      },
      { onConflict: "author_id,season,episode_no" }
    );

    setIsSaving(false);
    setMsg(error ? `保存失败：${error.message}` : "✅ 私密观后感已保存");
  };

  const publishReview = async () => {
    if (!supabase || !user) return setMsg("请先登录后发布");
    if (!note.trim()) return setMsg("先写点内容再发布吧");

    setIsPublishing(true);
    setMsg("");

    const { error } = await supabase.from("episode_reviews").upsert(
      {
        author_id: user.id,
        season: activeSeason,
        episode_no: activeEpisode,
        content: note.trim(),
      },
      { onConflict: "author_id,season,episode_no" }
    );

    setIsPublishing(false);
    if (error) {
      setMsg(`发布失败：${error.message}`);
      return;
    }

    setMsg("✅ 已发布为公开短评");
    await loadPublicReviews();
    await loadMyPublicFlag();
  };

  const withdrawReview = async () => {
    if (!supabase || !user) return setMsg("请先登录后操作");

    const { error } = await supabase
      .from("episode_reviews")
      .delete()
      .eq("author_id", user.id)
      .eq("season", activeSeason)
      .eq("episode_no", activeEpisode);

    setMsg(error ? `撤回失败：${error.message}` : "已撤回公开短评");
    await loadPublicReviews();
    await loadMyPublicFlag();
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">剧集档案</h1>
      <p className="mt-2 text-zinc-600 dark:text-zinc-400">按季度浏览、点集记录观后感，也可以把每集当作小日记。</p>

      <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50/60 p-4 text-sm text-zinc-700">
        <p>观后感已升级为「私密（账号可见）+ 公开短评（手动发布）」双层模式，支持跨设备同步。</p>
        {!user ? (
          <div className="mt-3 flex gap-2">
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="输入邮箱获取登录链接"
              className="w-full rounded-xl border border-zinc-200 p-2 text-sm dark:border-zinc-700 dark:bg-zinc-950"
            />
            <button
              onClick={sendLoginLink}
              disabled={isSendingLogin}
              className="rounded-xl bg-amber-600 px-3 py-2 text-white disabled:opacity-60"
            >
              {isSendingLogin ? "发送中..." : "登录"}
            </button>
          </div>
        ) : (
          <div className="mt-3 space-y-3">
            <UserIdentityCard
              name={nickname || fallbackNickname(user)}
              email={user.email}
              avatarUrl={avatarUrl}
              subtitle="已登录"
            />

            <p className="text-xs text-zinc-500">
              昵称和头像已统一在后台管理维护，这里不再重复设置。
              <a href="/admin" className="ml-1 text-amber-700 hover:text-amber-800">去后台修改 →</a>
            </p>
          </div>
        )}
        {msg ? <p className="mt-2 text-xs text-zinc-600">{msg}</p> : null}
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {seasonList.map((s) => (
          <button
            key={s.season}
            onClick={() => {
              setActiveSeason(s.season);
              setActiveEpisode(1);
            }}
            className={`rounded-full px-3 py-1 text-sm ${activeSeason === s.season ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900" : "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"}`}
          >
            {s.season}
          </button>
        ))}
      </div>

      <section className={`mt-6 overflow-hidden rounded-2xl border bg-gradient-to-r p-5 ${toneClass[currentSeason.tone || "autumn"]}`}>
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-xl font-semibold text-zinc-900">{currentSeason.season}</h2>
          <span className="rounded-full bg-white/80 px-3 py-1 text-xs text-zinc-700">{currentSeason.year}</span>
        </div>

        {currentSeason.image && (
          <div className="mt-4 overflow-hidden rounded-xl border border-white/60">
            <Image src={currentSeason.image} alt={currentSeason.season} width={1000} height={320} className="h-44 w-full object-cover" />
          </div>
        )}

        <ul className="mt-4 list-disc space-y-1 pl-5 text-sm text-zinc-700">
          {currentSeason.highlights.map((h) => (
            <li key={h}>{h}</li>
          ))}
        </ul>
      </section>

      <section className="mt-6 rounded-2xl border border-amber-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">{currentSeason.season} 全部剧集</h3>
        <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6">
          {currentSeason.episodes.map((ep) => (
            <button
              key={ep.no}
              onClick={() => setActiveEpisode(ep.no)}
              className={`rounded-lg border px-2 py-2 text-left text-xs ${activeEpisode === ep.no ? "border-amber-500 bg-amber-100 text-amber-800" : "border-zinc-200 bg-white text-zinc-700 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-300"}`}
            >
              <div>
                {String(ep.no).padStart(2, "0")} · {ep.title}
              </div>
              <div className="mt-1 text-[11px] opacity-80">{ep.titleZh || `第${String(ep.no).padStart(2, "0")}话`}</div>
            </button>
          ))}
        </div>
      </section>

      <section className="mt-6 rounded-2xl border border-amber-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
          {currentSeason.season} · 第{String(activeEpisode).padStart(2, "0")}话 私密观后感
        </h3>
        <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
          原题：{currentEpisode?.title} ｜ 译名：{currentEpisode?.titleZh || `第${String(activeEpisode).padStart(2, "0")}话`}
        </p>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder={user ? "写下这一集带给你的感受..." : "登录后可写私密观后感"}
          disabled={!user}
          className="mt-3 min-h-40 w-full rounded-xl border border-zinc-200 p-3 text-sm disabled:bg-zinc-100 disabled:text-zinc-500 dark:border-zinc-700 dark:bg-zinc-950"
        />
        <div className="mt-3 flex flex-wrap gap-2">
          <button onClick={savePrivateNote} disabled={!user || isSaving} className="rounded-xl bg-amber-600 px-4 py-2 text-sm text-white disabled:opacity-60">
            {isSaving ? "保存中..." : "保存私密观后感"}
          </button>
          <button
            onClick={publishReview}
            disabled={!user || isPublishing}
            className="rounded-xl border border-zinc-300 px-4 py-2 text-sm disabled:opacity-60"
          >
            {isPublishing ? "发布中..." : "发布为公开短评"}
          </button>
          {hasMyPublicReview ? (
            <button onClick={withdrawReview} disabled={!user} className="rounded-xl border border-rose-300 px-4 py-2 text-sm text-rose-600">
              撤回公开
            </button>
          ) : null}
        </div>
      </section>

      <section className="mt-6 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">本集公开短评</h3>
        <div className="mt-3 space-y-3">
          {publicReviews.length === 0 ? (
            <p className="text-sm text-zinc-500">还没有公开短评。</p>
          ) : (
            publicReviews.map((r) => {
              const profile = profilesMap[r.author_id];
              const displayName = profile?.nickname?.trim() || "友人";
              const avatar = profile?.avatar_url || "";
              return (
                <article key={r.id} className="rounded-xl border border-zinc-200 p-3 dark:border-zinc-700">
                  <div className="mb-2 flex items-center gap-2">
                    {avatar ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={avatar} alt={displayName} className="h-7 w-7 rounded-full object-cover" />
                    ) : (
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-200 text-xs text-amber-800">
                        {displayName.slice(0, 1)}
                      </div>
                    )}
                    <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300">{displayName}</span>
                  </div>
                  <p className="text-sm leading-7 text-zinc-700 dark:text-zinc-300">{r.content}</p>
                  <p className="mt-2 text-xs text-zinc-400">{new Date(r.created_at).toLocaleString()}</p>
                </article>
              );
            })
          )}
        </div>
      </section>
    </div>
  );
}
