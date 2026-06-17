"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PublicError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl border border-neutral-100 p-8 text-center">
        <div className="h-14 w-14 rounded-2xl bg-red-100 flex items-center justify-center mx-auto mb-5">
          <AlertTriangle className="h-7 w-7 text-red-600" />
        </div>
        <h1 className="text-xl font-bold text-neutral-900 mb-2">Something went wrong</h1>
        <p className="text-neutral-500 text-sm mb-6 leading-relaxed">
          An unexpected error occurred while loading this page.
          {error.digest && (
            <span className="block mt-2 text-xs font-mono text-neutral-400">
              Error ID: {error.digest}
            </span>
          )}
        </p>
        <div className="flex gap-3 justify-center">
          <Button onClick={reset} className="gap-2">
            <RefreshCw className="h-4 w-4" /> Try Again
          </Button>
        </div>
      </div>
    </div>
  );
}
