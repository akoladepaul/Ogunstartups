"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";

export interface Post {
  id: string;
  authorId: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  coverImageUrl: string | null;
  category: string;
  tags: string[];
  status: "draft" | "published" | "archived";
  featured: boolean;
  startupId: string | null;
  publishedAt: Date | null;
  viewCount: number;
  readTimeMins: number | null;
  createdAt: Date;
  updatedAt: Date;
  author?: { name: string | null; image: string | null };
  startup?: { name: string; slug: string } | null;
}

export async function getPosts(options: {
  category?: string;
  search?: string;
  featured?: boolean;
  limit?: number;
  page?: number;
} = {}) {
  const { category, search, featured, limit = 12, page = 1 } = options;
  const skip = (page - 1) * limit;

  const where: any = { status: "published" };
  if (category) where.category = category;
  if (featured) where.featured = true;
  if (search) {
    where.OR = [
      { title: { contains: search } },
      { excerpt: { contains: search } },
      { content: { contains: search } },
    ];
  }

  const [data, count] = await Promise.all([
    prisma.post.findMany({
      where,
      skip,
      take: limit,
      orderBy: { publishedAt: "desc" },
      include: { author: { select: { name: true, image: true } } },
    }),
    prisma.post.count({ where }),
  ]);

  return { data: data as unknown as Post[], count, totalPages: Math.ceil(count / limit) };
}

export async function getFeaturedPosts(limit = 3) {
  const data = await prisma.post.findMany({
    where: { status: "published", featured: true },
    take: limit,
    orderBy: { publishedAt: "desc" },
    include: { author: { select: { name: true, image: true } } },
  });
  return data as unknown as Post[];
}

export async function getPostBySlug(slug: string) {
  const data = await prisma.post.findFirst({
    where: { slug, status: "published" },
    include: {
      author: { select: { name: true, image: true } },
      startup: { select: { name: true, slug: true } },
    },
  });
  return data as unknown as Post | null;
}

export async function incrementPostViews(postId: string) {
  await prisma.post.update({
    where: { id: postId },
    data: { viewCount: { increment: 1 } },
  });
}

export async function getLatestPosts(limit = 5) {
  const data = await prisma.post.findMany({
    where: { status: "published" },
    take: limit,
    orderBy: { publishedAt: "desc" },
    select: {
      id: true,
      title: true,
      slug: true,
      excerpt: true,
      coverImageUrl: true,
      category: true,
      publishedAt: true,
      author: { select: { name: true } },
    },
  });
  return data as unknown as Post[];
}

// Admin actions
export async function createPost(data: {
  title: string;
  excerpt?: string;
  content: string;
  coverImageUrl?: string;
  category: string;
  tags?: string[];
  startupId?: string;
  status?: "draft" | "published";
  featured?: boolean;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if ((session.user as any).role !== "admin") return { error: "Unauthorized" };

  const slug = slugify(data.title);
  const existing = await prisma.post.findUnique({ where: { slug } });
  const finalSlug = existing ? `${slug}-${Date.now()}` : slug;

  const wordCount = data.content.split(/\s+/).length;
  const readTimeMins = Math.max(1, Math.ceil(wordCount / 200));

  await prisma.post.create({
    data: {
      authorId: session.user.id,
      title: data.title,
      slug: finalSlug,
      excerpt: data.excerpt ?? null,
      content: data.content,
      coverImageUrl: data.coverImageUrl ?? null,
      category: data.category,
      tags: data.tags ?? [],
      status: (data.status ?? "draft") as any,
      featured: data.featured ?? false,
      startupId: data.startupId ?? null,
      readTimeMins,
      publishedAt: data.status === "published" ? new Date() : null,
    },
  });

  revalidatePath("/blog");
  redirect("/admin/blog");
}

export async function updatePost(
  id: string,
  data: Partial<{
    title: string;
    excerpt: string;
    content: string;
    coverImageUrl: string;
    category: string;
    tags: string[];
    status: "draft" | "published" | "archived";
    featured: boolean;
    startupId: string;
  }>
) {
  const wordCount = data.content?.split(/\s+/).length ?? 0;
  const readTimeMins = wordCount ? Math.max(1, Math.ceil(wordCount / 200)) : undefined;

  await prisma.post.update({
    where: { id },
    data: {
      ...data,
      tags: data.tags ?? undefined,
      status: data.status as any,
      readTimeMins,
      publishedAt: data.status === "published" ? new Date() : undefined,
    },
  });

  revalidatePath("/blog");
  revalidatePath(`/blog/${id}`);
  return { success: true };
}

export async function getAllPostsAdmin() {
  const data = await prisma.post.findMany({
    orderBy: { createdAt: "desc" },
    include: { author: { select: { name: true } } },
  });
  return data as unknown as Post[];
}
