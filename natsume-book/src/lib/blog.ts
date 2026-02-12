import fallbackPosts from "@/data/posts.json";
import { BlogPost, getSupabaseClient } from "@/lib/supabase";

type FallbackPost = {
  slug: string;
  title: string;
  date: string;
  summary: string;
  tags: string[];
  content: string;
};

function mapFallback(): BlogPost[] {
  return (fallbackPosts as FallbackPost[]).map((p, i) => ({
    id: `fallback-${i}`,
    slug: p.slug,
    title: p.title,
    summary: p.summary,
    content: p.content,
    tags: p.tags,
    status: "published",
    created_at: p.date,
    updated_at: p.date,
  }));
}

export async function listPublishedPosts(): Promise<BlogPost[]> {
  const supabase = getSupabaseClient();
  if (!supabase) return mapFallback();

  const blogOwnerId = process.env.NEXT_PUBLIC_BLOG_OWNER_ID?.trim();

  let query = supabase
    .from("posts")
    .select("id,slug,title,summary,content,tags,status,author_id,created_at,updated_at")
    .eq("status", "published")
    .not("author_id", "is", null)
    .order("created_at", { ascending: false });

  if (blogOwnerId) {
    query = query.eq("author_id", blogOwnerId);
  }

  const { data, error } = await query;

  if (error || !data) return mapFallback();
  return data as BlogPost[];
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const supabase = getSupabaseClient();
  if (!supabase) return mapFallback().find((p) => p.slug === slug) ?? null;

  const blogOwnerId = process.env.NEXT_PUBLIC_BLOG_OWNER_ID?.trim();

  let query = supabase
    .from("posts")
    .select("id,slug,title,summary,content,tags,status,author_id,created_at,updated_at")
    .eq("slug", slug)
    .eq("status", "published")
    .not("author_id", "is", null);

  if (blogOwnerId) {
    query = query.eq("author_id", blogOwnerId);
  }

  const { data } = await query.maybeSingle();

  if (!data) return mapFallback().find((p) => p.slug === slug) ?? null;
  return data as BlogPost;
}
