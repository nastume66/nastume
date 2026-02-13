import BlogDetailClient from "@/components/blog/BlogDetailClient";

export const dynamic = "force-dynamic";

export default async function BlogDetail({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ pid?: string }>;
}) {
  const { slug } = await params;
  const { pid } = await searchParams;
  return <BlogDetailClient slug={slug} pid={pid} />;
}
