import type { Metadata } from "next";
import OrgForm from "@/components/organizations/OrgForm";

export const metadata: Metadata = { title: "Register Your Organization" };

export default function NewOrganizationPage() {
  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-neutral-900">Register Your Organization</h1>
        <p className="text-neutral-500 mt-1">
          List your accelerator, incubator, or support organization. Goes live after admin review.
        </p>
      </div>
      <OrgForm />
    </div>
  );
}
