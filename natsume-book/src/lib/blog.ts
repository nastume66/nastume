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

  const { data, error } = await supabase
    .from("posts")
    .select("id,slug,title,summary,content,tags,status,created_at,updated_at")
    .eq("status", "published")
    .order("created_at", { ascending: false });

  if (error || !data) return mapFallback();
  return data as BlogPost[];
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const supabase = getSupabaseClient();
  if (!supabase) return mapFallback().find((p) => p.slug === slug) ?? null;

  const { data } = await supabase
    .from("posts")
    .select("id,slug,title,summary,content,tags,status,created_at,updated_at")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (!data) return mapFallback().find((p) => p.slug === slug) ?? null;
  return data as BlogPost;
}
