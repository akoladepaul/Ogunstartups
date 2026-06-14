import { getAllStartupsAdmin, approveStartup, rejectStartup, toggleFeatured } from "@/lib/actions/startups";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import Link from "next/link";

export default async function AdminStartupsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const params = await searchParams;
  const startups = await getAllStartupsAdmin(params.status);

  const statusTabs = ["all", "pending", "approved", "rejected"];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-neutral-900">Startups</h1>
        <span className="text-sm text-neutral-500">{startups.length} total</span>
      </div>

      <div className="flex gap-2 mb-6">
        {statusTabs.map((s) => (
          <Link key={s} href={s === "all" ? "/admin/startups" : `/admin/startups?status=${s}`}>
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
                <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wide">Sector</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wide">LGA</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wide">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wide">Submitted</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-50">
              {startups.map((startup) => (
                <tr key={startup.id} className="hover:bg-neutral-50">
                  <td className="px-4 py-3">
                    <div className="font-medium text-neutral-900">{startup.name}</div>
                    <div className="text-xs text-neutral-400">{(startup as any).founder?.email}</div>
                  </td>
                  <td className="px-4 py-3 capitalize text-neutral-600">{startup.category ?? "—"}</td>
                  <td className="px-4 py-3 text-neutral-600">{startup.lga ?? "—"}</td>
                  <td className="px-4 py-3">
                    <Badge variant={startup.status as any}>{startup.status}</Badge>
                  </td>
                  <td className="px-4 py-3 text-neutral-500 text-xs">{formatDate(startup.createdAt.toISOString())}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {startup.status === "pending" && (
                        <>
                          <form action={async () => { "use server"; await approveStartup(startup.id); }}>
                            <Button size="sm" variant="default" className="h-7 text-xs">Approve</Button>
                          </form>
                          <form action={async () => { "use server"; await rejectStartup(startup.id); }}>
                            <Button size="sm" variant="destructive" className="h-7 text-xs">Reject</Button>
                          </form>
                        </>
                      )}
                      {startup.status === "approved" && (
                        <form action={async () => { "use server"; await toggleFeatured(startup.id, !startup.isFeatured); }}>
                          <Button size="sm" variant="outline" className="h-7 text-xs">
                            {startup.isFeatured ? "Unfeature" : "Feature"}
                          </Button>
                        </form>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {startups.length === 0 && (
          <div className="text-center py-12 text-neutral-500 text-sm">No startups found.</div>
        )}
      </div>
    </div>
  );
}
