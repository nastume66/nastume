import AdminClient from "@/components/admin/AdminClient";

export default function AdminPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">博客后台管理</h1>
      <p className="mt-2 text-zinc-600 dark:text-zinc-400">可编辑文章、发布内容，数据持久化保存到 Supabase。</p>
      <div className="mt-8">
        <AdminClient />
      </div>
    </div>
  );
}
