"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, LogOut } from "lucide-react";
import { signOutAction } from "@/lib/actions/auth";
import type { LucideIcon } from "lucide-react";

interface NavItem {
  href: string;
  icon: LucideIcon;
  label: string;
}

interface Props {
  items: NavItem[];
  userInitial: string;
  userName: string;
  userRole: string;
}

export default function MobileNav({ items, userInitial, userName, userRole }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="h-8 w-8 flex items-center justify-center rounded-lg text-neutral-600 hover:bg-neutral-100"
      >
        <Menu className="h-5 w-5" />
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <div className="relative ml-auto w-64 bg-white h-full flex flex-col p-5 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <span className="text-sm font-semibold text-neutral-900">Dashboard</span>
              <button
                onClick={() => setOpen(false)}
                className="h-7 w-7 flex items-center justify-center rounded-lg text-neutral-500 hover:bg-neutral-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <nav className="flex-1 space-y-1">
              {items.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-neutral-600 hover:bg-neutral-50 hover:text-brand-green-700 transition-colors"
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <div className="border-t border-neutral-100 pt-4">
              <div className="flex items-center gap-2 px-3 py-2 mb-2">
                <div className="h-7 w-7 rounded-full bg-brand-green-100 flex items-center justify-center text-brand-green-700 text-xs font-bold">
                  {userInitial}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium text-neutral-800 truncate">{userName}</div>
                  <div className="text-xs text-neutral-400 capitalize">{userRole}</div>
                </div>
              </div>
              <form action={signOutAction}>
                <button className="flex w-full items-center gap-2 px-3 py-2 rounded-xl text-xs text-neutral-500 hover:bg-red-50 hover:text-red-600 transition-colors">
                  <LogOut className="h-3.5 w-3.5" /> Sign Out
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
