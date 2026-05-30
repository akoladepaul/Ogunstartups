"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { adminClient } from "@/lib/supabase/admin";
import { slugify } from "@/lib/utils";

export interface Post {
  id: string;
  author_id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  cover_image_url: string | null;
  category: string;
  tags: string[];
  status: "draft" | "published" | "archived";
  featured: boolean;
  startup_id: string | null;
  published_at: string | null;
  view_count: number;
  read_time_mins: number | null;
  created_at: string;
  updated_at: string;
  profiles?: { full_name: string | null; avatar_url: string | null };
  startups?: { name: string; slug: string } | null;
}

export async function getPosts(options: {
  category?: string;
  search?: string;
  featured?: boolean;
  limit?: number;
  page?: number;
} = {}) {
  const supabase = await createServerSupabaseClient();
  const { category, search, featured, limit = 12, page = 1 } = options;
  const offset = (page - 1) * limit;

  let query = supabase
    .from("posts")
    .select("*, profiles(full_name, avatar_url)", { count: "exact" })
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (category) query = query.eq("category", category);
  if (featured) query = query.eq("featured", true);
  if (search) query = query.textSearch("search_vector", search, { type: "websearch" });

  const { data, count, error } = await query;
  if (error) return { data: [], count: 0 };

  return {
    data: (data ?? []) as Post[],
    count: count ?? 0,
    totalPages: Math.ceil((count ?? 0) / limit),
  };
}

export async function getFeaturedPosts(limit = 3) {
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase
    .from("posts")
    .select("*, profiles(full_name, avatar_url)")
    .eq("status", "published")
    .eq("featured", true)
    .order("published_at", { ascending: false })
    .limit(limit);
  return (data ?? []) as Post[];
}

export async function getPostBySlug(slug: string) {
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase
    .from("posts")
    .select("*, profiles(full_name, avatar_url), startups(name, slug)")
    .eq("slug", slug)
    .eq("status", "published")
    .single();
  return data as Post | null;
}

export async function incrementPostViews(postId: string) {
  await adminClient.rpc("increment_post_views", { post_id: postId });
}

export async function getLatestPosts(limit = 5) {
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase
    .from("posts")
    .select("id, title, slug, excerpt, cover_image_url, category, published_at, profiles(full_name)")
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .limit(limit);
  return (data ?? []) as unknown as Post[];
}

// Admin actions
export async function createPost(data: {
  title: string;
  excerpt?: string;
  content: string;
  cover_image_url?: string;
  category: string;
  tags?: string[];
  startup_id?: string;
  status?: "draft" | "published";
  featured?: boolean;
}) {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "admin") return { error: "Unauthorized" };

  const slug = slugify(data.title);
  const { data: existing } = await adminClient
    .from("posts").select("id").eq("slug", slug).single();
  const finalSlug = existing ? `${slug}-${Date.now()}` : slug;

  const wordCount = data.content.split(/\s+/).length;
  const readTimeMins = Math.max(1, Math.ceil(wordCount / 200));

  const { error } = await adminClient.from("posts").insert({
    ...data,
    slug: finalSlug,
    author_id: user.id,
    read_time_mins: readTimeMins,
    published_at: data.status === "published" ? new Date().toISOString() : null,
  });

  if (error) return { error: error.message };

  revalidatePath("/blog");
  redirect("/admin/blog");
}

export async function updatePost(id: string, data: Partial<{
  title: string;
  excerpt: string;
  content: string;
  cover_image_url: string;
  category: string;
  tags: string[];
  status: "draft" | "published" | "archived";
  featured: boolean;
  startup_id: string;
}>) {
  const wordCount = data.content?.split(/\s+/).length ?? 0;
  const readTimeMins = wordCount ? Math.max(1, Math.ceil(wordCount / 200)) : undefined;

  const { error } = await adminClient
    .from("posts")
    .update({
      ...data,
      read_time_mins: readTimeMins,
      published_at: data.status === "published" ? new Date().toISOString() : undefined,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/blog");
  revalidatePath(`/blog/${id}`);
  return { success: true };
}

export async function getAllPostsAdmin() {
  const { data } = await adminClient
    .from("posts")
    .select("*, profiles(full_name)")
    .order("created_at", { ascending: false });
  return (data ?? []) as Post[];
}
