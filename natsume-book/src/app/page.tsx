import Image from "next/image";
import homeData from "@/data/home.json";

const { banner, quotes, highlights } = homeData;

export default function Home() {
  return (
    <div className="min-h-[calc(100vh-56px)] bg-gradient-to-b from-amber-50 via-orange-50 to-white dark:from-zinc-950 dark:via-zinc-950 dark:to-zinc-900">
      <section className="mx-auto max-w-5xl px-4 py-10 md:py-16">
        <div className="mb-6 overflow-hidden rounded-2xl border border-amber-200/70 bg-gradient-to-r from-amber-100 via-orange-100 to-rose-100 p-5 text-zinc-800 dark:border-amber-500/30 dark:from-zinc-800 dark:via-zinc-800 dark:to-zinc-700 dark:text-zinc-100">
          <p className="text-sm font-medium">{banner.title}</p>
          <p className="mt-1 text-sm">“{banner.subtitle}”</p>
        </div>

        <div className="mb-6 overflow-hidden rounded-2xl border border-amber-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900/80">
          <Image
            src="https://cdn.myanimelist.net/images/anime/1681/108439l.jpg"
            alt="夏目友人帐 横幅"
            width={1200}
            height={420}
            className="h-56 w-full object-cover object-center md:h-72"
          />
        </div>

        <div className="relative overflow-hidden rounded-3xl border border-amber-200 bg-white p-6 shadow-sm md:p-12 dark:border-zinc-800 dark:bg-zinc-900/80">
          <div className="pointer-events-none absolute -right-16 -top-16 h-52 w-52 rounded-full bg-amber-200/40 blur-2xl" />
          <div className="pointer-events-none absolute -bottom-20 -left-16 h-52 w-52 rounded-full bg-orange-200/40 blur-2xl" />

          <p className="mb-3 text-sm font-medium tracking-widest text-amber-700 dark:text-amber-400">NATSUME YUUJINCHOU</p>
          <h1 className="text-3xl font-bold leading-tight text-zinc-900 md:text-5xl dark:text-zinc-100">夏目友人帐 · 友人之庭</h1>
          <p className="mt-5 max-w-2xl text-sm leading-7 text-zinc-700 md:text-base md:leading-8 dark:text-zinc-300">
            一个温柔的小站，记录《夏目友人帐》的角色、剧集和治愈瞬间。
            现在是第二版基础框架，后续可继续加图集、时间线和互动功能。
          </p>

          <div className="mt-8 grid gap-3 md:grid-cols-3">
            {highlights.map((item) => (
              <article key={item.title} className="rounded-2xl border border-amber-200 bg-white p-4 shadow-sm dark:border-zinc-700 dark:bg-zinc-800/80">
                <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">{item.title}</h2>
                <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-300">{item.desc}</p>
              </article>
            ))}
          </div>
        </div>

        <section className="mt-8 grid gap-4 md:grid-cols-3">
          {quotes.map((q) => (
            <article key={q} className="rounded-2xl border border-amber-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/80">
              <p className="text-sm leading-7 text-zinc-700 dark:text-zinc-300">“{q}”</p>
            </article>
          ))}
        </section>
      </section>
    </div>
  );
}
