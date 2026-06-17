import Link from "next/link";
import { MapPin, BadgeCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getInitials } from "@/lib/utils";
import { SECTOR_MAP } from "@/constants/sectors";
import { LGA_MAP } from "@/constants/lgas";
import type { Startup } from "@/types";

export default function StartupCard({ startup }: { startup: Startup }) {
  return (
    <Link href={`/startups/${startup.slug}`}>
      <article className="group h-full bg-white border border-neutral-100 rounded-2xl overflow-hidden hover:shadow-lg hover:border-brand-green-100 transition-all duration-200">
        {/* Cover */}
        <div className="h-32 bg-gradient-to-br from-brand-green-100 to-brand-green-50 relative">
          {startup.coverUrl && (
            <img
              src={startup.coverUrl}
              alt=""
              className="w-full h-full object-cover"
            />
          )}
          {/* Logo */}
          <div className="absolute -bottom-5 left-5">
            {startup.logoUrl ? (
              <img
                src={startup.logoUrl}
                alt={startup.name}
                className="h-11 w-11 rounded-xl border-2 border-white shadow-sm object-cover"
              />
            ) : (
              <div className="h-11 w-11 rounded-xl border-2 border-white shadow-sm bg-brand-green-600 flex items-center justify-center text-white font-bold text-xs">
                {getInitials(startup.name)}
              </div>
            )}
          </div>
        </div>

        <div className="pt-8 p-5">
          {/* Name */}
          <div className="flex items-center gap-1.5 mb-1">
            <h3 className="font-semibold text-neutral-900 group-hover:text-brand-green-700 transition-colors">
              {startup.name}
            </h3>
            {startup.status === "approved" && (
              <BadgeCheck className="h-4 w-4 text-brand-green-600 shrink-0" />
            )}
          </div>

          {/* Location */}
          <div className="flex items-center gap-1 text-xs text-neutral-500 mb-3">
            <MapPin className="h-3 w-3" />
            {startup.lga ? LGA_MAP[startup.lga] ?? startup.lga : "Ogun State"}
          </div>

          {/* Tagline */}
          <p className="text-sm text-neutral-600 line-clamp-2 mb-4 leading-relaxed">
            {startup.tagline}
          </p>

          {/* Badges */}
          <div className="flex flex-wrap gap-1.5">
            {(Array.isArray(startup.categories) ? startup.categories : startup.category ? [startup.category] : []).slice(0, 2).map((cat) => (
              <Badge key={cat} variant="sector" className="text-xs">
                {SECTOR_MAP[cat] ?? cat}
              </Badge>
            ))}
            {startup.stage && (
              <Badge variant="stage" className="text-xs capitalize">
                {startup.stage}
              </Badge>
            )}
            {startup.isHiring && (
              <Badge variant="hiring" className="text-xs">Hiring</Badge>
            )}
          </div>
        </div>
      </article>
    </Link>
  );
}
