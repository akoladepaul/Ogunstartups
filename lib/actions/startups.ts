"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { adminClient } from "@/lib/supabase/admin";
import { startupSchema } from "@/lib/validations/startup";
import { slugify } from "@/lib/utils";
import type { FilterOptions } from "@/types";

export async function getStartups(filters: FilterOptions = {}) {
  const supabase = await createServerSupabaseClient();
  const { category, stage, lga, search, page = 1, limit = 12 } = filters;
  const offset = (page - 1) * limit;

  let query = supabase
    .from("startups")
    .select("*, profiles(full_name, avatar_url)", { count: "exact" })
    .eq("status", "approved")
    .range(offset, offset + limit - 1)
    .order("created_at", { ascending: false });

  if (category) query = query.eq("category", category);
  if (stage) query = query.eq("stage", stage);
  if (lga) query = query.eq("lga", lga);
  if (search) query = query.textSearch("search_vector", search, { type: "websearch" });

  const { data, error, count } = await query;
  if (error) return { data: [], count: 0, error: error.message };

  return {
    data: data ?? [],
    count: count ?? 0,
    page,
    limit,
    totalPages: Math.ceil((count ?? 0) / limit),
  };
}

export async function getFeaturedStartups(limit = 6) {
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase
    .from("startups")
    .select("*")
    .eq("status", "approved")
    .eq("is_featured", true)
    .limit(limit)
    .order("created_at", { ascending: false });
  return data ?? [];
}

export async function getStartupBySlug(slug: string) {
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase
    .from("startups")
    .select("*, profiles(full_name, avatar_url), startup_products(*)")
    .eq("slug", slug)
    .eq("status", "approved")
    .single();
  return data;
}

export async function incrementViewCount(startupId: string) {
  await adminClient.rpc("increment_view_count", { startup_id: startupId });
}

export async function createStartup(formData: FormData) {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const raw = Object.fromEntries(formData.entries());
  const parsed = startupSchema.safeParse({
    ...raw,
    is_hiring: raw.is_hiring === "on",
    tags: raw.tags ? String(raw.tags).split(",").map(t => t.trim()).filter(Boolean) : [],
  });

  if (!parsed.success) {
    return { error: parsed.error.errors[0].message };
  }

  const slug = slugify(parsed.data.name);
  const { data: existing } = await supabase
    .from("startups")
    .select("id")
    .eq("slug", slug)
    .single();

  const finalSlug = existing ? `${slug}-${Date.now()}` : slug;

  const { data, error } = await supabase
    .from("startups")
    .insert({
      ...parsed.data,
      slug: finalSlug,
      founder_id: user.id,
      status: "pending",
      location: `${parsed.data.lga ? parsed.data.lga + ", " : ""}Ogun State, Nigeria`,
    })
    .select()
    .single();

  if (error) return { error: error.message };

  revalidatePath("/startups");
  redirect(`/dashboard`);
}

export async function updateStartup(id: string, formData: FormData) {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const raw = Object.fromEntries(formData.entries());
  const parsed = startupSchema.safeParse({
    ...raw,
    is_hiring: raw.is_hiring === "on",
    tags: raw.tags ? String(raw.tags).split(",").map(t => t.trim()).filter(Boolean) : [],
  });

  if (!parsed.success) return { error: parsed.error.errors[0].message };

  const { error } = await supabase
    .from("startups")
    .update({ ...parsed.data, updated_at: new Date().toISOString() })
    .eq("id", id)
    .eq("founder_id", user.id);

  if (error) return { error: error.message };

  revalidatePath("/dashboard");
  revalidatePath(`/startups/${id}`);
  return { success: true };
}

export async function getMyStartup() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("startups")
    .select("*, startup_products(*)")
    .eq("founder_id", user.id)
    .single();
  return data;
}

export async function getStats() {
  const supabase = await createServerSupabaseClient();
  const [startups, orgs] = await Promise.all([
    supabase.from("startups").select("id", { count: "exact" }).eq("status", "approved"),
    supabase.from("organizations").select("id", { count: "exact" }).eq("status", "approved"),
  ]);
  return {
    startups: startups.count ?? 0,
    organizations: orgs.count ?? 0,
    lgas: 20,
    sectors: 13,
  };
}

// Admin actions
export async function approveStartup(id: string) {
  const { error } = await adminClient
    .from("startups")
    .update({ status: "approved", updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/startups");
  revalidatePath("/startups");
  return { success: true };
}

export async function rejectStartup(id: string, reason?: string) {
  const { error } = await adminClient
    .from("startups")
    .update({ status: "rejected", updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/startups");
  return { success: true };
}

export async function toggleFeatured(id: string, isFeatured: boolean) {
  const { error } = await adminClient
    .from("startups")
    .update({ is_featured: isFeatured })
    .eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/startups");
  revalidatePath("/");
  return { success: true };
}

export async function getAllStartupsAdmin(status?: string) {
  let query = adminClient
    .from("startups")
    .select("*, profiles(full_name, email)")
    .order("created_at", { ascending: false });
  if (status) query = query.eq("status", status);
  const { data, error } = await query;
  if (error) return [];
  return data ?? [];
}
