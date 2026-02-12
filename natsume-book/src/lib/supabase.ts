import { createClient } from "@supabase/supabase-js";

export function getSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) return null;
  return createClient(url, anonKey);
}

export type BlogPost = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  content: string;
  tags: string[];
  status: "draft" | "published";
  created_at: string;
  updated_at: string;
};
