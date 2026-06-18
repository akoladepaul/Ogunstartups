"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { productSchema } from "@/lib/validations/startup";

export async function createProduct(startupId: string, formData: FormData) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const startup = await prisma.startup.findFirst({
    where: { id: startupId, founderId: session.user.id },
    select: { id: true },
  });
  if (!startup) return { error: "Startup not found." };

  const raw = Object.fromEntries(formData.entries());
  const parsed = productSchema.safeParse(raw);
  if (!parsed.success) return { error: parsed.error.errors[0].message };

  await prisma.startupProduct.create({
    data: {
      startupId,
      name: parsed.data.name,
      description: parsed.data.description ?? null,
      url: parsed.data.url || null,
      price: parsed.data.price ?? null,
      currency: parsed.data.currency ?? "NGN",
      imageUrl: (raw.imageUrl as string) || null,
    },
  });

  revalidatePath("/dashboard/products");
  return { success: true };
}

export async function updateProduct(productId: string, formData: FormData) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const raw = Object.fromEntries(formData.entries());
  const parsed = productSchema.safeParse(raw);
  if (!parsed.success) return { error: parsed.error.errors[0].message };

  const product = await prisma.startupProduct.findFirst({
    where: { id: productId, startup: { founderId: session.user.id } },
    select: { id: true },
  });
  if (!product) return { error: "Product not found." };

  await prisma.startupProduct.update({
    where: { id: productId },
    data: {
      name: parsed.data.name,
      description: parsed.data.description ?? null,
      url: parsed.data.url || null,
      price: parsed.data.price ?? null,
      currency: parsed.data.currency ?? "NGN",
      imageUrl: (raw.imageUrl as string) || null,
    },
  });

  revalidatePath("/dashboard/products");
  return { success: true };
}

export async function deleteProduct(productId: string) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const product = await prisma.startupProduct.findFirst({
    where: { id: productId, startup: { founderId: session.user.id } },
    select: { id: true },
  });
  if (!product) return { error: "Product not found." };

  await prisma.startupProduct.delete({ where: { id: productId } });

  revalidatePath("/dashboard/products");
  return { success: true };
}
