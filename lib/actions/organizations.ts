"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { orgSchema } from "@/lib/validations/startup";
import { slugify } from "@/lib/utils";
import type { FilterOptions } from "@/types";

export async function getOrganizations(filters: FilterOptions = {}) {
  const { lga, search, page = 1, limit = 12 } = filters;
  const skip = (page - 1) * limit;

  const where: any = { status: "approved" };
  if (lga) where.lga = lga;
  if (filters.category) where.orgType = filters.category;
  if (search) {
    where.OR = [
      { name: { contains: search } },
      { tagline: { contains: search } },
      { description: { contains: search } },
    ];
  }

  const [data, count] = await Promise.all([
    prisma.organization.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
    }),
    prisma.organization.count({ where }),
  ]);

  return { data, count, page, limit, totalPages: Math.ceil(count / limit) };
}

export async function getOrganizationBySlug(slug: string) {
  return prisma.organization.findFirst({
    where: { slug, status: "approved" },
    include: { owner: { select: { name: true, image: true } } },
  });
}

export async function incrementOrgViewCount(orgId: string) {
  await prisma.organization.update({
    where: { id: orgId },
    data: { viewCount: { increment: 1 } },
  });
}

export async function getMyOrganization() {
  const session = await auth();
  if (!session?.user) return null;
  return prisma.organization.findFirst({
    where: { ownerId: session.user.id },
  });
}

export async function createOrganization(formData: FormData) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const raw = Object.fromEntries(formData.entries());
  const parsed = orgSchema.safeParse({
    ...raw,
    tags: raw.tags ? String(raw.tags).split(",").map((t) => t.trim()).filter(Boolean) : [],
  });

  if (!parsed.success) return { error: parsed.error.errors[0].message };

  const slug = slugify(parsed.data.name);
  const existing = await prisma.organization.findUnique({ where: { slug } });
  const finalSlug = existing ? `${slug}-${Date.now()}` : slug;

  await prisma.organization.create({
    data: {
      ownerId: session.user.id,
      name: parsed.data.name,
      slug: finalSlug,
      logoUrl: (raw.logoUrl as string) || null,
      tagline: parsed.data.tagline ?? null,
      description: parsed.data.description ?? null,
      orgType: parsed.data.org_type ?? null,
      lga: parsed.data.lga ?? null,
      foundedYear: parsed.data.founded_year ?? null,
      websiteUrl: parsed.data.website_url ?? null,
      tags: parsed.data.tags ?? [],
      status: "pending",
    },
  });

  revalidatePath("/organizations");
  redirect("/dashboard");
}

export async function updateOrganization(id: string, formData: FormData) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const raw = Object.fromEntries(formData.entries());
  const parsed = orgSchema.safeParse({
    ...raw,
    tags: raw.tags ? String(raw.tags).split(",").map((t) => t.trim()).filter(Boolean) : [],
  });

  if (!parsed.success) return { error: parsed.error.errors[0].message };

  const logoUrl = (raw.logoUrl as string) || undefined;

  await prisma.organization.updateMany({
    where: { id, ownerId: session.user.id },
    data: {
      name: parsed.data.name,
      tagline: parsed.data.tagline ?? null,
      description: parsed.data.description ?? null,
      logoUrl: logoUrl ?? undefined,
      orgType: parsed.data.org_type ?? null,
      lga: parsed.data.lga ?? null,
      foundedYear: parsed.data.founded_year ?? null,
      websiteUrl: parsed.data.website_url ?? null,
      tags: parsed.data.tags ?? [],
    },
  });

  revalidatePath("/dashboard");
  return { success: true };
}

// Admin
async function requireAdmin() {
  const session = await auth();
  if (!session?.user) return null;
  if ((session.user as any).role !== "admin") return null;
  return session;
}

export async function getAllOrganizationsAdmin(status?: string) {
  if (!await requireAdmin()) return [];
  return prisma.organization.findMany({
    where: status ? { status: status as any } : undefined,
    orderBy: { createdAt: "desc" },
    include: { owner: { select: { name: true, email: true } } },
  });
}

export async function approveOrganization(id: string) {
  if (!await requireAdmin()) return { error: "Unauthorized" };
  await prisma.organization.update({ where: { id }, data: { status: "approved" } });
  revalidatePath("/admin/organizations");
  revalidatePath("/organizations");
  return { success: true };
}

export async function rejectOrganization(id: string) {
  if (!await requireAdmin()) return { error: "Unauthorized" };
  await prisma.organization.update({ where: { id }, data: { status: "rejected" } });
  revalidatePath("/admin/organizations");
  return { success: true };
}
