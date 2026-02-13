import BlogDetailClient from "@/components/blog/BlogDetailClient";

export const dynamic = "force-dynamic";

export default async function BlogDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <BlogDetailClient slug={slug} />;
}
