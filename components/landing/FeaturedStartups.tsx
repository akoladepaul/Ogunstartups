import Link from "next/link";
import { ArrowRight, BadgeCheck, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getInitials } from "@/lib/utils";
import { SECTOR_MAP } from "@/constants/sectors";
import { LGA_MAP } from "@/constants/lgas";
import type { Startup } from "@/types";

interface FeaturedStartupsProps {
  startups: Startup[];
}

export default function FeaturedStartups({ startups }: FeaturedStartupsProps) {
  if (!startups.length) return null;

  return (
    <section className="section-padding bg-white">
      <div className="section-container">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="heading-2 text-neutral-900 mb-2">Featured Startups</h2>
            <p className="text-neutral-500 max-w-lg">
              Hand-picked from Ogun State&apos;s most promising ventures across every sector and LGA.
            </p>
          </div>
          <Link
            href="/startups"
            className="hidden sm:flex items-center gap-1 text-sm font-medium text-brand-green-600 hover:text-brand-green-700"
          >
            View All <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {startups.map((startup) => (
            <Link key={startup.id} href={`/startups/${startup.slug}`}>
              <div className="group bg-white border border-neutral-100 rounded-2xl p-6 hover:shadow-md hover:border-brand-green-100 transition-all duration-200">
                {/* Header */}
                <div className="flex items-center gap-3 mb-4">
                  {startup.logoUrl ? (
                    <img
                      src={startup.logoUrl}
                      alt={startup.name}
                      className="h-12 w-12 rounded-xl object-cover border border-neutral-100"
                    />
                  ) : (
                    <div className="h-12 w-12 rounded-xl bg-brand-green-600 flex items-center justify-center text-white font-bold text-sm">
                      {getInitials(startup.name)}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-semibold text-neutral-900 truncate text-sm">
                        {startup.name}
                      </h3>
                      {startup.status === "approved" && (
                        <BadgeCheck className="h-3.5 w-3.5 text-brand-green-600 shrink-0" />
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-neutral-500 mt-0.5">
                      <MapPin className="h-3 w-3" />
                      {startup.lga ? LGA_MAP[startup.lga] ?? startup.lga : "Ogun State"}
                    </div>
                  </div>
                </div>

                {/* Tagline */}
                <p className="text-sm text-neutral-600 line-clamp-2 mb-4 leading-relaxed">
                  {startup.tagline}
                </p>

                {/* Badges */}
                <div className="flex items-center gap-2 flex-wrap">
                  {startup.category && (
                    <Badge variant="sector">
                      {SECTOR_MAP[startup.category] ?? startup.category}
                    </Badge>
                  )}
                  {startup.stage && (
                    <Badge variant="stage" className="capitalize">
                      {startup.stage}
                    </Badge>
                  )}
                  {startup.isHiring && (
                    <Badge variant="hiring">Hiring</Badge>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-8 text-center sm:hidden">
          <Link
            href="/startups"
            className="inline-flex items-center gap-1 text-sm font-medium text-brand-green-600"
          >
            View All Startups <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
