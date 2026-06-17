import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { signOutAction } from "@/lib/actions/auth";
import { getMyOrganization } from "@/lib/actions/organizations";
import {
  Leaf, LayoutDashboard, Building2, Package, Settings, LogOut, Network,
} from "lucide-react";
import MobileNav from "@/components/layout/MobileNav";

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Overview" },
  { href: "/dashboard/startup", icon: Building2, label: "My Startup" },
  { href: "/dashboard/products", icon: Package, label: "Products" },
  { href: "/dashboard/organization/new", icon: Network, label: "Organization" },
  { href: "/dashboard/settings", icon: Settings, label: "Settings" },
];

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const [user, org] = await Promise.all([
    prisma.user.findUnique({
      where: { id: session.user.id },
      select: { name: true, image: true, role: true },
    }),
    getMyOrganization(),
  ]);

  const orgHref = org ? `/dashboard/organization/${org.id}/edit` : "/dashboard/organization/new";

  const userInitial =
    user?.name?.[0]?.toUpperCase() ?? session.user.email?.[0]?.toUpperCase() ?? "U";

  return (
    <div className="min-h-screen bg-neutral-50 flex">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-60 shrink-0 flex-col bg-white border-r border-neutral-100 p-5">
        <Link href="/" className="flex items-center gap-2 mb-8">
          <div className="h-7 w-7 rounded-lg bg-brand-green-600 flex items-center justify-center">
            <Leaf className="h-3.5 w-3.5 text-white" />
          </div>
          <span className="text-sm font-bold text-brand-green-700">
            Ogun<span className="text-neutral-900">Startups</span>
          </span>
        </Link>

        <nav className="flex-1 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href === "/dashboard/organization/new" ? orgHref : item.href}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-neutral-600 hover:bg-neutral-50 hover:text-brand-green-700 transition-colors"
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-neutral-100 pt-4">
          <div className="flex items-center gap-2 px-3 py-2 mb-1">
            <div className="h-7 w-7 rounded-full bg-brand-green-100 flex items-center justify-center text-brand-green-700 text-xs font-bold">
              {userInitial}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-medium text-neutral-800 truncate">
                {user?.name ?? session.user.email}
              </div>
              <div className="text-xs text-neutral-400 capitalize">{user?.role}</div>
            </div>
          </div>
          <form action={signOutAction}>
            <button className="flex w-full items-center gap-2 px-3 py-2 rounded-xl text-xs text-neutral-500 hover:bg-red-50 hover:text-red-600 transition-colors">
              <LogOut className="h-3.5 w-3.5" /> Sign Out
            </button>
          </form>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 overflow-auto">
        {/* Mobile top bar */}
        <div className="md:hidden bg-white border-b border-neutral-100 px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-lg bg-brand-green-600 flex items-center justify-center">
              <Leaf className="h-3 w-3 text-white" />
            </div>
            <span className="text-sm font-bold text-brand-green-700">
              Ogun<span className="text-neutral-900">Startups</span>
            </span>
          </Link>
          <MobileNav
            orgHref={orgHref}
            userInitial={userInitial}
            userName={user?.name ?? session.user.email ?? ""}
            userRole={user?.role ?? "founder"}
          />
        </div>
        <main className="p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
