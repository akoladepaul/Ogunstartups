import { prisma } from "@/lib/prisma";
import { BarChart3, Eye, Building2, Users, Newspaper, TrendingUp } from "lucide-react";

async function getAnalytics() {
  const [
    totalStartups,
    approvedStartups,
    pendingStartups,
    totalOrgs,
    approvedOrgs,
    totalUsers,
    totalPosts,
    publishedPosts,
    topStartups,
    topPosts,
  ] = await Promise.all([
    prisma.startup.count(),
    prisma.startup.count({ where: { status: "approved" } }),
    prisma.startup.count({ where: { status: "pending" } }),
    prisma.organization.count(),
    prisma.organization.count({ where: { status: "approved" } }),
    prisma.user.count(),
    prisma.post.count(),
    prisma.post.count({ where: { status: "published" } }),
    prisma.startup.findMany({
      where: { status: "approved" },
      orderBy: { viewCount: "desc" },
      take: 5,
      select: { name: true, slug: true, viewCount: true, category: true },
    }),
    prisma.post.findMany({
      where: { status: "published" },
      orderBy: { viewCount: "desc" },
      take: 5,
      select: { title: true, slug: true, viewCount: true, category: true },
    }),
  ]);

  return {
    totalStartups, approvedStartups, pendingStartups,
    totalOrgs, approvedOrgs, totalUsers, totalPosts, publishedPosts,
    topStartups, topPosts,
  };
}

export default async function AdminAnalyticsPage() {
  const data = await getAnalytics();

  const statCards = [
    { label: "Total Startups", value: data.totalStartups, sub: `${data.approvedStartups} live · ${data.pendingStartups} pending`, icon: Building2, color: "text-brand-green-600", bg: "bg-brand-green-50" },
    { label: "Organizations", value: data.totalOrgs, sub: `${data.approvedOrgs} approved`, icon: TrendingUp, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Registered Users", value: data.totalUsers, sub: "founders & admins", icon: Users, color: "text-purple-600", bg: "bg-purple-50" },
    { label: "Blog Posts", value: data.totalPosts, sub: `${data.publishedPosts} published`, icon: Newspaper, color: "text-amber-600", bg: "bg-amber-50" },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-8">
        <BarChart3 className="h-6 w-6 text-brand-green-600" />
        <h1 className="text-2xl font-bold text-neutral-900">Analytics</h1>
      </div>

      {/* Stat cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="bg-white rounded-2xl border border-neutral-100 p-5">
              <div className={`inline-flex h-10 w-10 items-center justify-center rounded-xl ${card.bg} mb-4`}>
                <Icon className={`h-5 w-5 ${card.color}`} />
              </div>
              <div className="text-3xl font-bold text-neutral-900 mb-1">{card.value}</div>
              <div className="text-sm font-medium text-neutral-700">{card.label}</div>
              <div className="text-xs text-neutral-400 mt-0.5">{card.sub}</div>
            </div>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Top Startups */}
        <div className="bg-white rounded-2xl border border-neutral-100 p-6">
          <div className="flex items-center gap-2 mb-5">
            <Eye className="h-4 w-4 text-neutral-400" />
            <h2 className="font-semibold text-neutral-900">Most Viewed Startups</h2>
          </div>
          <div className="space-y-3">
            {data.topStartups.length === 0 && (
              <p className="text-sm text-neutral-400">No data yet.</p>
            )}
            {data.topStartups.map((s, i) => (
              <div key={s.slug} className="flex items-center gap-3">
                <span className="text-xs font-bold text-neutral-400 w-4">{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-neutral-800 truncate">{s.name}</div>
                  <div className="text-xs text-neutral-400 capitalize">{s.category ?? "—"}</div>
                </div>
                <div className="text-sm font-semibold text-brand-green-600 shrink-0">
                  {s.viewCount.toLocaleString()} views
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Posts */}
        <div className="bg-white rounded-2xl border border-neutral-100 p-6">
          <div className="flex items-center gap-2 mb-5">
            <Eye className="h-4 w-4 text-neutral-400" />
            <h2 className="font-semibold text-neutral-900">Most Read Posts</h2>
          </div>
          <div className="space-y-3">
            {data.topPosts.length === 0 && (
              <p className="text-sm text-neutral-400">No published posts yet.</p>
            )}
            {data.topPosts.map((p, i) => (
              <div key={p.slug} className="flex items-center gap-3">
                <span className="text-xs font-bold text-neutral-400 w-4">{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-neutral-800 truncate">{p.title}</div>
                  <div className="text-xs text-neutral-400 capitalize">{p.category.replace(/_/g, " ")}</div>
                </div>
                <div className="text-sm font-semibold text-amber-600 shrink-0">
                  {p.viewCount.toLocaleString()} views
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
