import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { signOutAction } from "@/lib/actions/auth";
import AdminMobileNav from "@/components/layout/AdminMobileNav";
import {
  Leaf, LayoutDashboard, Building2, Users, BarChart3,
  Clock, LogOut, Newspaper,
} from "lucide-react";

const adminNav = [
  { href: "/admin", icon: LayoutDashboard, label: "Overview" },
  { href: "/admin/pending", icon: Clock, label: "Pending Review" },
  { href: "/admin/startups", icon: Building2, label: "Startups" },
  { href: "/admin/organizations", icon: Building2, label: "Organizations" },
  { href: "/admin/blog", icon: Newspaper, label: "Blog / Press" },
  { href: "/admin/users", icon: Users, label: "Users" },
  { href: "/admin/analytics", icon: BarChart3, label: "Analytics" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { name: true, role: true },
  });

  if (user?.role !== "admin") redirect("/");

  return (
    <div className="min-h-screen bg-neutral-50 flex">
      <aside className="hidden md:flex w-60 shrink-0 flex-col bg-brand-green-900 p-5">
        <Link href="/" className="flex items-center gap-2 mb-8">
          <div className="h-7 w-7 rounded-lg bg-brand-green-600 flex items-center justify-center">
            <Leaf className="h-3.5 w-3.5 text-white" />
          </div>
          <span className="text-sm font-bold text-white">
            Admin<span className="text-brand-green-300">Panel</span>
          </span>
        </Link>

        <nav className="flex-1 space-y-1">
          {adminNav.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.href} href={item.href}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-brand-green-200 hover:bg-brand-green-800 hover:text-white transition-colors">
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-brand-green-800 pt-4">
          <div className="px-3 py-2 mb-1">
            <div className="text-xs font-medium text-white">{user?.name}</div>
            <div className="text-xs text-brand-green-400">Administrator</div>
          </div>
          <form action={signOutAction}>
            <button className="flex w-full items-center gap-2 px-3 py-2 rounded-xl text-xs text-brand-green-300 hover:bg-red-900/50 hover:text-red-300 transition-colors">
              <LogOut className="h-3.5 w-3.5" /> Sign Out
            </button>
          </form>
        </div>
      </aside>

      <div className="flex-1 overflow-auto">
        <header className="bg-white border-b border-neutral-100 px-4 md:px-6 py-4 flex items-center gap-4">
          <AdminMobileNav items={adminNav} userName={user?.name ?? ""} />
          <p className="text-xs text-neutral-500 font-medium uppercase tracking-wide">
            OgunStartups Admin
          </p>
        </header>
        <main className="p-4 md:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
