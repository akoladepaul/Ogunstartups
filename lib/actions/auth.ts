"use server";

import { signIn, signOut, auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";

export async function signInWithEmail(email: string, password: string) {
  try {
    await signIn("credentials", { email, password, redirectTo: "/dashboard" });
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "Invalid email or password. Please try again." };
    }
    throw error;
  }
}

export async function signUp(email: string, password: string, fullName: string) {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return { error: "An account with this email already exists." };

  const hashed = await bcrypt.hash(password, 12);
  await prisma.user.create({
    data: { email, name: fullName, password: hashed, role: "founder" },
  });

  return { success: true, message: "Account created! Please sign in." };
}

export async function signOutAction() {
  await signOut({ redirectTo: "/" });
}

export async function getSession() {
  const session = await auth();
  return session?.user ?? null;
}

export async function updateProfile(formData: FormData) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const name = String(formData.get("name") ?? "").trim();
  if (!name || name.length < 2) return { error: "Name must be at least 2 characters." };

  await prisma.user.update({
    where: { id: session.user.id },
    data: { name },
  });

  revalidatePath("/dashboard/settings");
  return { success: true };
}

export async function updatePassword(formData: FormData) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const current = String(formData.get("current") ?? "");
  const next = String(formData.get("next") ?? "");
  if (next.length < 8) return { error: "New password must be at least 8 characters." };

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user?.password) return { error: "No password set on this account." };

  const valid = await bcrypt.compare(current, user.password);
  if (!valid) return { error: "Current password is incorrect." };

  const hashed = await bcrypt.hash(next, 12);
  await prisma.user.update({ where: { id: session.user.id }, data: { password: hashed } });
  return { success: true, message: "Password updated." };
}
