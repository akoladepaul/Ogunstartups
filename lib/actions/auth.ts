"use server";

import { signIn, signOut } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation";
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
  const { auth } = await import("@/lib/auth");
  const session = await auth();
  return session?.user ?? null;
}
