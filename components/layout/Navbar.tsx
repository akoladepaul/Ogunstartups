"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/startups", label: "Startups" },
  { href: "/organizations", label: "Organizations" },
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About" },
];

export default function Navbar({ user }: { user?: { email?: string } | null }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled ? "bg-white/95 backdrop-blur-md shadow-sm" : "bg-transparent"
      )}
    >
      <div className="section-container">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-green-600">
              <Leaf className="h-4 w-4 text-white" />
            </div>
            <span className="text-lg font-bold text-brand-green-700">
              Ogun<span className="text-neutral-900">Startups</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-neutral-700 hover:text-brand-green-600 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* CTA buttons */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <Link href="/dashboard">
                <Button variant="default" size="sm">My Dashboard</Button>
              </Link>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm">Sign In</Button>
                </Link>
                <Link href="/login">
                  <Button variant="gold" size="sm">List Your Startup</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded-md text-neutral-700"
            onClick={() => setOpen(!open)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="md:hidden py-4 border-t border-neutral-100 bg-white">
            <div className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-2 py-1.5 text-sm font-medium text-neutral-700 hover:text-brand-green-600"
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="flex flex-col gap-2 pt-2 border-t border-neutral-100">
                {user ? (
                  <Link href="/dashboard" onClick={() => setOpen(false)}>
                    <Button variant="default" size="sm" className="w-full">My Dashboard</Button>
                  </Link>
                ) : (
                  <>
                    <Link href="/login" onClick={() => setOpen(false)}>
                      <Button variant="ghost" size="sm" className="w-full">Sign In</Button>
                    </Link>
                    <Link href="/login" onClick={() => setOpen(false)}>
                      <Button variant="gold" size="sm" className="w-full">List Your Startup</Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
