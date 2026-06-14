"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { startupSchema } from "@/lib/validations/startup";
import { slugify } from "@/lib/utils";
import type { FilterOptions } from "@/types";

export async function getStartups(filters: FilterOptions = {}) {
  const { category, stage, lga, search, page = 1, limit = 12 } = filters;
  const skip = (page - 1) * limit;

  const where: any = { status: "approved" };
  if (category) where.category = category;
  if (lga) where.lga = lga;
  if (stage) where.stage = stage;
  if (search) {
    where.OR = [
      { name: { contains: search } },
      { tagline: { contains: search } },
      { description: { contains: search } },
    ];
  }

  const [data, count] = await Promise.all([
    prisma.startup.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: { founder: { select: { name: true, image: true } } },
    }),
    prisma.startup.count({ where }),
  ]);

  return { data, count, page, limit, totalPages: Math.ceil(count / limit) };
}

export async function getFeaturedStartups(limit = 6) {
  return prisma.startup.findMany({
    where: { status: "approved", isFeatured: true },
    take: limit,
    orderBy: { createdAt: "desc" },
  });
}

export async function getStartupBySlug(slug: string) {
  return prisma.startup.findFirst({
    where: { slug, status: "approved" },
    include: {
      founder: { select: { name: true, image: true } },
      products: true,
    },
  });
}

export async function incrementViewCount(startupId: string) {
  await prisma.startup.update({
    where: { id: startupId },
    data: { viewCount: { increment: 1 } },
  });
}

export async function createStartup(formData: FormData) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const raw = Object.fromEntries(formData.entries());
  const parsed = startupSchema.safeParse({
    ...raw,
    is_hiring: raw.is_hiring === "on",
    tags: raw.tags ? String(raw.tags).split(",").map((t) => t.trim()).filter(Boolean) : [],
  });

  if (!parsed.success) return { error: parsed.error.errors[0].message };

  const slug = slugify(parsed.data.name);
  const existing = await prisma.startup.findUnique({ where: { slug } });
  const finalSlug = existing ? `${slug}-${Date.now()}` : slug;

  await prisma.startup.create({
    data: {
      founderId: session.user.id,
      name: parsed.data.name,
      slug: finalSlug,
      tagline: parsed.data.tagline ?? null,
      description: parsed.data.description ?? null,
      logoUrl: (raw.logoUrl as string) || null,
      websiteUrl: parsed.data.website_url ?? null,
      category: parsed.data.category ?? null,
      stage: (parsed.data.stage as any) ?? null,
      foundedYear: parsed.data.founded_year ?? null,
      lga: parsed.data.lga ?? null,
      location: `${parsed.data.lga ? parsed.data.lga + ", " : ""}Ogun State, Nigeria`,
      isHiring: parsed.data.is_hiring ?? false,
      tags: parsed.data.tags ?? [],
      status: "pending",
    },
  });

  revalidatePath("/startups");
  redirect("/dashboard");
}

export async function updateStartup(id: string, formData: FormData) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const raw = Object.fromEntries(formData.entries());
  const parsed = startupSchema.safeParse({
    ...raw,
    is_hiring: raw.is_hiring === "on",
    tags: raw.tags ? String(raw.tags).split(",").map((t) => t.trim()).filter(Boolean) : [],
  });

  if (!parsed.success) return { error: parsed.error.errors[0].message };

  await prisma.startup.updateMany({
    where: { id, founderId: session.user.id },
    data: {
      name: parsed.data.name,
      tagline: parsed.data.tagline ?? null,
      description: parsed.data.description ?? null,
      websiteUrl: parsed.data.website_url ?? null,
      category: parsed.data.category ?? null,
      stage: (parsed.data.stage as any) ?? null,
      foundedYear: parsed.data.founded_year ?? null,
      lga: parsed.data.lga ?? null,
      isHiring: parsed.data.is_hiring ?? false,
      tags: parsed.data.tags ?? [],
    },
  });

  revalidatePath("/dashboard");
  revalidatePath(`/startups/${id}`);
  return { success: true };
}

export async function getStartupById(id: string) {
  const session = await auth();
  if (!session?.user) return null;
  return prisma.startup.findFirst({
    where: { id, founderId: session.user.id },
    include: { products: true },
  });
}

export async function getMyStartup() {
  const session = await auth();
  if (!session?.user) return null;

  return prisma.startup.findFirst({
    where: { founderId: session.user.id },
    include: { products: true },
  });
}

export async function getStats() {
  const [startups, organizations] = await Promise.all([
    prisma.startup.count({ where: { status: "approved" } }),
    prisma.organization.count({ where: { status: "approved" } }),
  ]);
  return { startups, organizations, lgas: 20, sectors: 13 };
}

// Admin actions
export async function approveStartup(id: string) {
  await prisma.startup.update({ where: { id }, data: { status: "approved" } });
  revalidatePath("/admin/startups");
  revalidatePath("/startups");
  return { success: true };
}

export async function rejectStartup(id: string) {
  await prisma.startup.update({ where: { id }, data: { status: "rejected" } });
  revalidatePath("/admin/startups");
  return { success: true };
}

export async function toggleFeatured(id: string, isFeatured: boolean) {
  await prisma.startup.update({ where: { id }, data: { isFeatured } });
  revalidatePath("/admin/startups");
  revalidatePath("/");
  return { success: true };
}

export async function getAllStartupsAdmin(status?: string) {
  return prisma.startup.findMany({
    where: status ? { status: status as any } : undefined,
    orderBy: { createdAt: "desc" },
    include: { founder: { select: { name: true, email: true } } },
  });
}
