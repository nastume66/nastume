import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-24 text-center">
      <p className="text-sm text-amber-700">404</p>
      <h1 className="mt-2 text-3xl font-bold text-zinc-900 dark:text-zinc-100">这页不在友人帐里</h1>
      <p className="mt-3 text-zinc-600 dark:text-zinc-400">你可以回到首页，或者去博客继续看学习记录。</p>
      <div className="mt-6 flex justify-center gap-3">
        <Link href="/" className="rounded-xl bg-amber-600 px-4 py-2 text-sm text-white">回首页</Link>
        <Link href="/blog" className="rounded-xl border border-zinc-300 px-4 py-2 text-sm">去博客</Link>
      </div>
    </div>
  );
}
