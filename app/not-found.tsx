import Link from "next/link";
import { Leaf, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page Not Found",
  description: "The page you're looking for doesn't exist.",
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="h-8 w-8 rounded-xl bg-brand-green-600 flex items-center justify-center">
            <Leaf className="h-4 w-4 text-white" />
          </div>
          <span className="text-lg font-bold text-brand-green-700">
            Ogun<span className="text-neutral-900">Startups</span>
          </span>
        </div>

        <div className="h-16 w-16 rounded-2xl bg-brand-green-100 flex items-center justify-center mx-auto mb-6">
          <Search className="h-8 w-8 text-brand-green-600" />
        </div>

        <h1 className="text-5xl font-bold text-neutral-900 mb-3">404</h1>
        <h2 className="text-xl font-semibold text-neutral-800 mb-3">Page not found</h2>
        <p className="text-neutral-500 text-sm leading-relaxed mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
          Try browsing our startup directory instead.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/">
            <Button variant="default" size="lg">Back to Home</Button>
          </Link>
          <Link href="/startups">
            <Button variant="outline" size="lg">Browse Startups</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
