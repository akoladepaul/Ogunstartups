import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getMyOrganization } from "@/lib/actions/organizations";
import EditOrgForm from "@/components/organizations/EditOrgForm";

export const metadata: Metadata = { title: "Edit Organization" };

export default async function EditOrgPage() {
  const org = await getMyOrganization();
  if (!org) notFound();

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-neutral-900">Edit Organization</h1>
        <p className="text-neutral-500 mt-1">Update your organization profile.</p>
      </div>
      <EditOrgForm org={org as any} />
    </div>
  );
}
