"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function updateUserRole(userId: string, role: "founder" | "admin" | "viewer") {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "admin") {
    return { error: "Unauthorized" };
  }
  await prisma.user.update({ where: { id: userId }, data: { role } });
  revalidatePath("/admin/users");
  return { success: true };
}

export async function deleteUser(userId: string) {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "admin") {
    return { error: "Unauthorized" };
  }
  if (userId === session.user.id) return { error: "Cannot delete your own account." };
  await prisma.user.delete({ where: { id: userId } });
  revalidatePath("/admin/users");
  return { success: true };
}
