import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";
import { getStartupById } from "@/lib/actions/startups";
import EditStartupForm from "@/components/startups/EditStartupForm";

export const metadata: Metadata = { title: "Edit Startup" };

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditStartupPage({ params }: PageProps) {
  const { id } = await params;
  const startup = await getStartupById(id);
  if (!startup) notFound();

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-neutral-900">Edit Startup</h1>
        <p className="text-neutral-500 mt-1">
          Update your startup profile. Changes go live immediately.
        </p>
      </div>
      <EditStartupForm startup={startup as any} />
    </div>
  );
}
