"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { Leaf, Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { resetPassword } from "@/lib/actions/reset-password";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token") ?? "";

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  if (!token) {
    return (
      <div className="text-center py-4">
        <p className="text-sm text-red-600 mb-4">Invalid reset link. Please request a new one.</p>
        <Link href="/forgot-password" className="text-brand-green-600 font-medium hover:underline text-sm">
          Request new link
        </Link>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const result = await resetPassword(token, password);
      if (result?.error) {
        setError(result.error);
      } else {
        setDone(true);
        setTimeout(() => router.push("/login"), 3000);
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <div className="text-center py-4">
        <CheckCircle2 className="h-12 w-12 text-brand-green-500 mx-auto mb-4" />
        <h2 className="text-lg font-semibold text-neutral-900 mb-2">Password updated!</h2>
        <p className="text-sm text-neutral-500 mb-4">Redirecting you to sign in...</p>
        <Link href="/login" className="text-brand-green-600 font-medium hover:underline text-sm">
          Sign in now
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="password">New password</Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="At least 8 characters"
          required
          minLength={8}
          className="mt-1.5"
        />
      </div>
      <div>
        <Label htmlFor="confirm">Confirm new password</Label>
        <Input
          id="confirm"
          type="password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          placeholder="Repeat your password"
          required
          className="mt-1.5"
        />
      </div>

      {error && (
        <div className="p-3 rounded-lg text-sm bg-red-50 text-red-700 border border-red-100">
          {error}
        </div>
      )}

      <Button type="submit" variant="default" className="w-full" disabled={loading}>
        {loading ? (
          <><Loader2 className="h-4 w-4 animate-spin mr-2" />Updating...</>
        ) : (
          "Set New Password"
        )}
      </Button>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="h-9 w-9 rounded-xl bg-brand-green-600 flex items-center justify-center">
              <Leaf className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-brand-green-700">
              Ogun<span className="text-neutral-900">Startups</span>
            </span>
          </Link>
          <h1 className="mt-6 text-2xl font-bold text-neutral-900">Set a new password</h1>
          <p className="mt-1 text-sm text-neutral-500">Choose a strong password for your account</p>
        </div>

        <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-8">
          <Suspense fallback={<div className="text-center py-4 text-neutral-400 text-sm">Loading...</div>}>
            <ResetPasswordForm />
          </Suspense>
        </div>

        <p className="mt-4 text-center text-xs text-neutral-400">
          <Link href="/" className="hover:underline">← Back to OgunStartups</Link>
        </p>
      </div>
    </div>
  );
}
