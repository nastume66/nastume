export default function GuestbookPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold text-zinc-900">友人帐留言</h1>
      <p className="mt-2 text-zinc-600">第一版先做展示，下一步可接数据库做真实留言。</p>

      <div className="mt-8 rounded-2xl border border-amber-200 bg-amber-50/60 p-6">
        <p className="text-sm leading-8 text-zinc-700">
          「愿每个孤独的人，都能找到愿意听自己说话的朋友。」
          <br />
          —— 你也可以在这里写下今天的心情。
        </p>
      </div>
    </div>
  );
}
