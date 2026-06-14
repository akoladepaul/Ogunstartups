import { NextResponse } from "next/server";

// NextAuth handles OAuth callbacks at /api/auth/callback/[provider]
// This route handles legacy redirects gracefully
export async function GET(request: Request) {
  const { origin } = new URL(request.url);
  return NextResponse.redirect(`${origin}/dashboard`);
}
