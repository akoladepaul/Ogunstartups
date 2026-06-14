"use client";

import { useState } from "react";
import Link from "next/link";
import { Leaf, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signInWithEmail } from "@/lib/actions/auth";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const result = await signInWithEmail(email, password);
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
    // On success, signInWithEmail redirects to /dashboard automatically
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="h-9 w-9 rounded-xl bg-brand-green-600 flex items-center justify-center">
              <Leaf className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-brand-green-700">
              Ogun<span className="text-neutral-900">Startups</span>
            </span>
          </Link>
          <h1 className="mt-6 text-2xl font-bold text-neutral-900">Welcome back</h1>
          <p className="mt-1 text-sm text-neutral-500">Sign in to manage your startup listing</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="mt-1.5"
              />
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="mt-1.5"
              />
            </div>

            {error && (
              <div className="p-3 rounded-lg text-sm bg-red-50 text-red-700 border border-red-100">
                {error}
              </div>
            )}

            <Button
              type="submit"
              variant="default"
              className="w-full"
              disabled={loading}
            >
              {loading ? (
                <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Signing in...</>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-neutral-500">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-brand-green-600 font-medium hover:underline">
              Sign up
            </Link>
          </p>
        </div>

        <p className="mt-4 text-center text-xs text-neutral-400">
          <Link href="/" className="hover:underline">← Back to OgunStartups</Link>
        </p>
      </div>
    </div>
  );
}
