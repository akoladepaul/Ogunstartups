import type { Metadata } from "next";
import StartupForm from "@/components/startups/StartupForm";

export const metadata: Metadata = { title: "Register Your Startup" };

export default function NewStartupPage() {
  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-neutral-900">Register Your Startup</h1>
        <p className="text-neutral-500 mt-1">
          Fill in your startup details. Your listing will go live after admin review.
        </p>
      </div>
      <StartupForm />
    </div>
  );
}
