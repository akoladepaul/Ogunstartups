"use client";

import { useState } from "react";
import Link from "next/link";
import { Leaf, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signUp } from "@/lib/actions/auth";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    const result = await signUp(email, password, name);
    if (result?.error) {
      setMessage({ text: result.error, type: "error" });
    } else {
      setMessage({ text: result.message ?? "Account created! Check your email to confirm.", type: "success" });
    }
    setLoading(false);
  };

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
          <h1 className="mt-6 text-2xl font-bold text-neutral-900">Create your account</h1>
          <p className="mt-1 text-sm text-neutral-500">List your startup on OgunStartups</p>
        </div>

        <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Full name</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)}
                placeholder="Adewale Okafor" required className="mt-1.5" />
            </div>
            <div>
              <Label htmlFor="email">Email address</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com" required className="mt-1.5" />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                placeholder="Min 8 characters" minLength={8} required className="mt-1.5" />
            </div>

            {message && (
              <div className={`p-3 rounded-lg text-sm ${
                message.type === "success"
                  ? "bg-green-50 text-green-700 border border-green-100"
                  : "bg-red-50 text-red-700 border border-red-100"
              }`}>
                {message.text}
              </div>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? <><Loader2 className="h-4 w-4 animate-spin mr-2" />Creating account...</> : "Create Account"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-neutral-500">
            Already have an account?{" "}
            <Link href="/login" className="text-brand-green-600 font-medium hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
