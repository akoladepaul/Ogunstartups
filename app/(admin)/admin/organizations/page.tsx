import { getAllOrganizationsAdmin, approveOrganization, rejectOrganization } from "@/lib/actions/organizations";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import Link from "next/link";

const ORG_TYPE_LABELS: Record<string, string> = {
  accelerator: "Accelerator",
  incubator: "Incubator",
  coworking: "Co-working",
  angel_network: "Angel Network",
  government_agency: "Gov. Agency",
  ngo: "NGO",
  university_hub: "Uni Hub",
  corporate_program: "Corporate",
};

export default async function AdminOrganizationsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const params = await searchParams;
  const orgs = await getAllOrganizationsAdmin(params.status);
  const statusTabs = ["all", "pending", "approved", "rejected"];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-neutral-900">Organizations</h1>
        <span className="text-sm text-neutral-500">{orgs.length} total</span>
      </div>

      <div className="flex gap-2 mb-6">
        {statusTabs.map((s) => (
          <Link key={s} href={s === "all" ? "/admin/organizations" : `/admin/organizations?status=${s}`}>
            <button className={`px-4 py-1.5 rounded-full text-sm font-medium capitalize transition-colors ${
              (params.status ?? "all") === s
                ? "bg-brand-green-600 text-white"
                : "bg-white border border-neutral-200 text-neutral-600 hover:border-brand-green-300"
            }`}>
              {s}
            </button>
          </Link>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-neutral-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-neutral-50 border-b border-neutral-100">
                <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wide">Name</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wide">Type</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wide">LGA</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wide">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wide">Submitted</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-50">
              {orgs.map((org) => (
                <tr key={org.id} className="hover:bg-neutral-50">
                  <td className="px-4 py-3">
                    <div className="font-medium text-neutral-900">{org.name}</div>
                    <div className="text-xs text-neutral-400">{(org as any).owner?.email}</div>
                  </td>
                  <td className="px-4 py-3 text-neutral-600 text-xs">
                    {org.orgType ? ORG_TYPE_LABELS[org.orgType] ?? org.orgType : "—"}
                  </td>
                  <td className="px-4 py-3 text-neutral-600">{org.lga ?? "—"}</td>
                  <td className="px-4 py-3">
                    <Badge variant={org.status as any}>{org.status}</Badge>
                  </td>
                  <td className="px-4 py-3 text-neutral-500 text-xs">{formatDate(org.createdAt.toISOString())}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {org.status === "pending" && (
                        <>
                          <form action={async () => { "use server"; await approveOrganization(org.id); }}>
                            <Button size="sm" variant="default" className="h-7 text-xs">Approve</Button>
                          </form>
                          <form action={async () => { "use server"; await rejectOrganization(org.id); }}>
                            <Button size="sm" variant="destructive" className="h-7 text-xs">Reject</Button>
                          </form>
                        </>
                      )}
                      {org.status === "approved" && (
                        <Link href={`/organizations/${org.slug}`} target="_blank"
                          className="text-xs text-brand-green-600 hover:underline">View</Link>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {orgs.length === 0 && (
          <div className="text-center py-12 text-neutral-500 text-sm">No organizations found.</div>
        )}
      </div>
    </div>
  );
}
