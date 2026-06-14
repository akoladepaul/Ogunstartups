import { getAllStartupsAdmin, approveStartup, rejectStartup } from "@/lib/actions/startups";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import { Clock, CheckCircle, XCircle } from "lucide-react";
import Link from "next/link";

export default async function AdminPendingPage() {
  const pending = await getAllStartupsAdmin("pending");

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="h-10 w-10 rounded-xl bg-yellow-100 flex items-center justify-center">
          <Clock className="h-5 w-5 text-yellow-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Pending Review</h1>
          <p className="text-sm text-neutral-500">{pending.length} submission{pending.length !== 1 ? "s" : ""} awaiting review</p>
        </div>
      </div>

      {pending.length === 0 ? (
        <div className="bg-white rounded-2xl border border-neutral-100 py-20 text-center">
          <CheckCircle className="h-12 w-12 text-brand-green-500 mx-auto mb-3" />
          <h2 className="font-semibold text-neutral-900 mb-1">All caught up!</h2>
          <p className="text-neutral-500 text-sm">No pending submissions right now.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {pending.map((startup) => (
            <div key={startup.id} className="bg-white rounded-2xl border border-neutral-100 p-6">
              <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="font-semibold text-neutral-900 text-lg">{startup.name}</h2>
                    <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full font-medium">
                      Pending
                    </span>
                  </div>
                  <p className="text-sm text-neutral-500 mb-3">{startup.tagline}</p>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-neutral-500 mb-4">
                    <div><span className="font-medium text-neutral-700">Sector:</span> {startup.category ?? "—"}</div>
                    <div><span className="font-medium text-neutral-700">Stage:</span> {startup.stage ?? "—"}</div>
                    <div><span className="font-medium text-neutral-700">LGA:</span> {startup.lga ?? "—"}</div>
                    <div><span className="font-medium text-neutral-700">Submitted:</span> {formatDate(startup.createdAt.toISOString())}</div>
                  </div>

                  {startup.description && (
                    <p className="text-sm text-neutral-600 line-clamp-3 bg-neutral-50 p-3 rounded-lg">
                      {startup.description}
                    </p>
                  )}

                  {(startup as any).founder && (
                    <div className="mt-3 text-xs text-neutral-500">
                      Submitted by: <span className="font-medium">{(startup as any).founder.name}</span>{" "}
                      ({(startup as any).founder.email})
                    </div>
                  )}
                </div>

                <div className="flex sm:flex-col gap-2 shrink-0">
                  <form action={async () => { "use server"; await approveStartup(startup.id); }}>
                    <Button variant="default" size="sm" className="w-full gap-1">
                      <CheckCircle className="h-3.5 w-3.5" /> Approve
                    </Button>
                  </form>
                  <form action={async () => { "use server"; await rejectStartup(startup.id); }}>
                    <Button variant="destructive" size="sm" className="w-full gap-1">
                      <XCircle className="h-3.5 w-3.5" /> Reject
                    </Button>
                  </form>
                  <Link href={`/admin/startups`}>
                    <Button variant="outline" size="sm" className="w-full text-xs">
                      Full Details
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
