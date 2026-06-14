import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getMyStartup } from "@/lib/actions/startups";
import { getMyOrganization } from "@/lib/actions/organizations";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Eye, Edit, AlertCircle, CheckCircle, Clock, Network } from "lucide-react";

export default async function DashboardPage() {
  const session = await auth();
  const user = await prisma.user.findUnique({
    where: { id: session!.user.id },
    select: { name: true },
  });

  const [startup, org] = await Promise.all([getMyStartup(), getMyOrganization()]);

  const statusConfig = {
    pending: {
      icon: Clock,
      color: "text-yellow-600",
      bg: "bg-yellow-50 border-yellow-100",
      label: "Pending Review",
      message: "Your listing is being reviewed by our team. This typically takes 2–5 business days.",
    },
    approved: {
      icon: CheckCircle,
      color: "text-green-600",
      bg: "bg-green-50 border-green-100",
      label: "Live",
      message: "Your startup is live on OgunStartups. Share your profile link!",
    },
    rejected: {
      icon: AlertCircle,
      color: "text-red-600",
      bg: "bg-red-50 border-red-100",
      label: "Rejected",
      message: "Your listing was not approved. Please update your profile and resubmit.",
    },
    archived: {
      icon: AlertCircle,
      color: "text-neutral-500",
      bg: "bg-neutral-50 border-neutral-100",
      label: "Archived",
      message: "Your listing is currently archived.",
    },
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-neutral-900">
          Welcome back, {user?.name?.split(" ")[0] ?? "Founder"} 👋
        </h1>
        <p className="text-neutral-500 mt-1">Manage your startup listing from here.</p>
      </div>

      {!startup ? (
        <div className="max-w-lg">
          <div className="bg-white rounded-2xl border border-neutral-100 p-8 text-center">
            <div className="h-16 w-16 rounded-2xl bg-brand-green-100 flex items-center justify-center mx-auto mb-4">
              <Plus className="h-8 w-8 text-brand-green-600" />
            </div>
            <h2 className="text-lg font-semibold text-neutral-900 mb-2">
              No Startup Listed Yet
            </h2>
            <p className="text-neutral-500 text-sm mb-6">
              Register your startup to get discovered by investors, partners, and the broader Ogun State ecosystem.
            </p>
            <Link href="/dashboard/startup/new">
              <Button variant="default" size="lg" className="gap-2">
                <Plus className="h-4 w-4" /> Register Your Startup
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-6 max-w-2xl">
          {(() => {
            const config = statusConfig[startup.status as keyof typeof statusConfig];
            const Icon = config.icon;
            return (
              <div className={`flex items-start gap-3 p-4 rounded-xl border ${config.bg}`}>
                <Icon className={`h-5 w-5 mt-0.5 shrink-0 ${config.color}`} />
                <div>
                  <div className={`text-sm font-semibold ${config.color}`}>
                    Status: {config.label}
                  </div>
                  <div className="text-sm text-neutral-600 mt-0.5">{config.message}</div>
                </div>
              </div>
            );
          })()}

          <div className="bg-white rounded-2xl border border-neutral-100 p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="font-semibold text-neutral-900 text-lg">{startup.name}</h2>
                <p className="text-neutral-500 text-sm mt-0.5">{startup.tagline}</p>
              </div>
              <Badge variant={startup.status as any}>{startup.status}</Badge>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-neutral-50 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-neutral-900">{startup.viewCount}</div>
                <div className="text-xs text-neutral-500 mt-0.5">Profile Views</div>
              </div>
              <div className="bg-neutral-50 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-neutral-900">
                  {startup.products?.length ?? 0}
                </div>
                <div className="text-xs text-neutral-500 mt-0.5">Products Listed</div>
              </div>
            </div>

            <div className="flex gap-3">
              {startup.status === "approved" && (
                <Link href={`/startups/${startup.slug}`}>
                  <Button variant="outline" size="sm" className="gap-1">
                    <Eye className="h-3.5 w-3.5" /> View Live
                  </Button>
                </Link>
              )}
              <Link href={`/dashboard/startup/${startup.id}/edit`}>
                <Button variant="default" size="sm" className="gap-1">
                  <Edit className="h-3.5 w-3.5" /> Edit Profile
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Organization section */}
      <div className="mt-8 max-w-2xl">
        <h2 className="text-lg font-semibold text-neutral-900 mb-4">Your Organization</h2>
        {!org ? (
          <div className="bg-white rounded-2xl border border-neutral-100 p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-neutral-700">No organization listed</p>
              <p className="text-xs text-neutral-500 mt-0.5">
                Register an accelerator, incubator, or support organization.
              </p>
            </div>
            <Link href="/dashboard/organization/new">
              <Button variant="outline" size="sm" className="gap-1 shrink-0">
                <Network className="h-3.5 w-3.5" /> Register
              </Button>
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-neutral-100 p-6">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-neutral-900">{org.name}</h3>
                <p className="text-neutral-500 text-sm mt-0.5">{org.tagline}</p>
              </div>
              <Badge variant={org.status as any}>{org.status}</Badge>
            </div>
            {org.status === "approved" && (
              <div className="mt-4">
                <Link href={`/organizations/${org.slug}`}>
                  <Button variant="outline" size="sm" className="gap-1">
                    <Eye className="h-3.5 w-3.5" /> View Live
                  </Button>
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
