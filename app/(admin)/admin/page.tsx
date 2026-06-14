import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

async function getAdminStats() {
  const [startups, orgs, users, pending] = await Promise.all([
    prisma.startup.count(),
    prisma.organization.count(),
    prisma.user.count(),
    prisma.startup.count({ where: { status: "pending" } }),
  ]);
  return { startups, orgs, users, pending };
}

async function getRecentActivity() {
  return prisma.startup.findMany({
    take: 8,
    orderBy: { createdAt: "desc" },
    select: { id: true, name: true, status: true, createdAt: true, category: true },
  });
}

export default async function AdminDashboard() {
  const [stats, activity] = await Promise.all([getAdminStats(), getRecentActivity()]);

  const statCards = [
    { label: "Total Startups", value: stats.startups, color: "text-brand-green-600" },
    { label: "Pending Review", value: stats.pending, color: "text-yellow-600", urgent: stats.pending > 0 },
    { label: "Organizations", value: stats.orgs, color: "text-blue-600" },
    { label: "Registered Users", value: stats.users, color: "text-purple-600" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-neutral-900 mb-6">Admin Overview</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((card) => (
          <div key={card.label} className={`bg-white rounded-2xl border p-5 ${card.urgent ? "border-yellow-200" : "border-neutral-100"}`}>
            <div className={`text-3xl font-bold mb-1 ${card.color}`}>{card.value}</div>
            <div className="text-sm text-neutral-500">{card.label}</div>
          </div>
        ))}
      </div>

      {stats.pending > 0 && (
        <div className="bg-yellow-50 border border-yellow-100 rounded-2xl p-4 mb-8 flex items-center justify-between">
          <div className="text-sm text-yellow-800">
            <span className="font-semibold">{stats.pending} startup{stats.pending !== 1 ? "s" : ""}</span> waiting for review.
          </div>
          <Link href="/admin/pending" className="text-sm font-medium text-yellow-700 hover:underline">
            Review Now →
          </Link>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-neutral-100">
        <div className="px-6 py-4 border-b border-neutral-100">
          <h2 className="font-semibold text-neutral-900">Recent Submissions</h2>
        </div>
        <div className="divide-y divide-neutral-50">
          {activity.map((item) => (
            <div key={item.id} className="px-6 py-3 flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-neutral-900">{item.name}</div>
                <div className="text-xs text-neutral-500 mt-0.5">
                  {item.category} · {formatDate(item.createdAt.toISOString())}
                </div>
              </div>
              <Badge variant={item.status as any}>{item.status}</Badge>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
