"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, Leaf, LogOut, LayoutDashboard, Clock, Building2, Newspaper, Users, BarChart3 } from "lucide-react";
import { signOutAction } from "@/lib/actions/auth";

const adminNav = [
  { href: "/admin", icon: LayoutDashboard, label: "Overview" },
  { href: "/admin/pending", icon: Clock, label: "Pending Review" },
  { href: "/admin/startups", icon: Building2, label: "Startups" },
  { href: "/admin/organizations", icon: Building2, label: "Organizations" },
  { href: "/admin/blog", icon: Newspaper, label: "Blog / Press" },
  { href: "/admin/users", icon: Users, label: "Users" },
  { href: "/admin/analytics", icon: BarChart3, label: "Analytics" },
];

export default function AdminMobileNav({ userName }: { userName: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        onClick={() => setOpen(true)}
        className="p-1.5 rounded-lg text-neutral-500 hover:bg-neutral-100"
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/50"
            onClick={() => setOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 z-50 w-64 bg-brand-green-900 flex flex-col p-5">
            <div className="flex items-center justify-between mb-8">
              <Link href="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
                <div className="h-7 w-7 rounded-lg bg-brand-green-600 flex items-center justify-center">
                  <Leaf className="h-3.5 w-3.5 text-white" />
                </div>
                <span className="text-sm font-bold text-white">
                  Admin<span className="text-brand-green-300">Panel</span>
                </span>
              </Link>
              <button
                onClick={() => setOpen(false)}
                className="p-1.5 rounded-lg text-brand-green-300 hover:text-white hover:bg-brand-green-800"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <nav className="flex-1 space-y-1">
              {adminNav.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-brand-green-200 hover:bg-brand-green-800 hover:text-white transition-colors"
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <div className="border-t border-brand-green-800 pt-4">
              <div className="px-3 py-2 mb-1">
                <div className="text-xs font-medium text-white">{userName}</div>
                <div className="text-xs text-brand-green-400">Administrator</div>
              </div>
              <form action={signOutAction}>
                <button className="flex w-full items-center gap-2 px-3 py-2 rounded-xl text-xs text-brand-green-300 hover:bg-red-900/50 hover:text-red-300 transition-colors">
                  <LogOut className="h-3.5 w-3.5" /> Sign Out
                </button>
              </form>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
