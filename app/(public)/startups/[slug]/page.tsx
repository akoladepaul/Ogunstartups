import { notFound } from "next/navigation";
import Link from "next/link";
import {
  Globe, Twitter, Linkedin, Instagram, MapPin, Calendar,
  Users, BadgeCheck, ArrowLeft, Briefcase,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getStartupBySlug, incrementViewCount } from "@/lib/actions/startups";
import { SECTOR_MAP } from "@/constants/sectors";
import { LGA_MAP } from "@/constants/lgas";
import { getInitials } from "@/lib/utils";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const startup = await getStartupBySlug(slug);
  if (!startup) return { title: "Not Found" };
  return {
    title: startup.name,
    description: startup.tagline ?? undefined,
    openGraph: {
      title: startup.name,
      description: startup.tagline ?? undefined,
      images: startup.cover_url ? [startup.cover_url] : startup.logo_url ? [startup.logo_url] : [],
    },
  };
}

export default async function StartupProfilePage({ params }: PageProps) {
  const { slug } = await params;
  const startup = await getStartupBySlug(slug);
  if (!startup) notFound();

  // Non-blocking view count increment
  incrementViewCount(startup.id).catch(() => {});

  return (
    <div className="pt-16 min-h-screen bg-neutral-50">
      {/* Back link */}
      <div className="section-container pt-6">
        <Link
          href="/startups"
          className="inline-flex items-center gap-1 text-sm text-neutral-500 hover:text-brand-green-600 mb-6"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Directory
        </Link>
      </div>

      {/* Cover */}
      <div className="h-48 sm:h-64 bg-gradient-to-br from-brand-green-100 to-brand-green-200 relative">
        {startup.cover_url && (
          <img src={startup.cover_url} alt="" className="w-full h-full object-cover" />
        )}
      </div>

      <div className="section-container">
        {/* Profile header */}
        <div className="bg-white rounded-2xl border border-neutral-100 p-6 -mt-10 mb-6 shadow-sm">
          <div className="flex flex-col sm:flex-row gap-5 items-start">
            {/* Logo */}
            <div className="-mt-14 shrink-0">
              {startup.logo_url ? (
                <img
                  src={startup.logo_url}
                  alt={startup.name}
                  className="h-20 w-20 rounded-2xl border-4 border-white shadow-md object-cover"
                />
              ) : (
                <div className="h-20 w-20 rounded-2xl border-4 border-white shadow-md bg-brand-green-600 flex items-center justify-center text-white font-bold text-xl">
                  {getInitials(startup.name)}
                </div>
              )}
            </div>

            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h1 className="text-2xl font-bold text-neutral-900">{startup.name}</h1>
                {startup.status === "approved" && (
                  <BadgeCheck className="h-5 w-5 text-brand-green-600" />
                )}
              </div>
              <p className="text-neutral-600 mb-3">{startup.tagline}</p>

              <div className="flex flex-wrap gap-2 mb-4">
                {startup.category && (
                  <Badge variant="sector">{SECTOR_MAP[startup.category] ?? startup.category}</Badge>
                )}
                {startup.stage && (
                  <Badge variant="stage" className="capitalize">{startup.stage}</Badge>
                )}
                {startup.is_hiring && <Badge variant="hiring">Hiring</Badge>}
                {startup.lga && (
                  <div className="flex items-center gap-1 text-xs text-neutral-500">
                    <MapPin className="h-3 w-3" />
                    {LGA_MAP[startup.lga] ?? startup.lga}
                  </div>
                )}
              </div>

              {/* Links */}
              <div className="flex items-center gap-3">
                {startup.website_url && (
                  <a href={startup.website_url} target="_blank" rel="noopener noreferrer"
                    className="text-neutral-500 hover:text-brand-green-600">
                    <Globe className="h-4 w-4" />
                  </a>
                )}
                {startup.social_links?.twitter && (
                  <a href={startup.social_links.twitter} target="_blank" rel="noopener noreferrer"
                    className="text-neutral-500 hover:text-[#1da1f2]">
                    <Twitter className="h-4 w-4" />
                  </a>
                )}
                {startup.social_links?.linkedin && (
                  <a href={startup.social_links.linkedin} target="_blank" rel="noopener noreferrer"
                    className="text-neutral-500 hover:text-[#0077b5]">
                    <Linkedin className="h-4 w-4" />
                  </a>
                )}
                {startup.social_links?.instagram && (
                  <a href={startup.social_links.instagram} target="_blank" rel="noopener noreferrer"
                    className="text-neutral-500 hover:text-[#e1306c]">
                    <Instagram className="h-4 w-4" />
                  </a>
                )}
              </div>
            </div>

            {startup.website_url && (
              <a href={startup.website_url} target="_blank" rel="noopener noreferrer">
                <Button variant="default" size="sm" className="shrink-0">
                  Visit Website
                </Button>
              </a>
            )}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 pb-16">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            {/* About */}
            {startup.description && (
              <div className="bg-white rounded-2xl border border-neutral-100 p-6">
                <h2 className="font-semibold text-neutral-900 mb-3">About</h2>
                <p className="text-neutral-600 leading-relaxed whitespace-pre-line">
                  {startup.description}
                </p>
              </div>
            )}

            {/* Products */}
            {startup.startup_products && startup.startup_products.length > 0 && (
              <div className="bg-white rounded-2xl border border-neutral-100 p-6">
                <h2 className="font-semibold text-neutral-900 mb-4">Products & Services</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {startup.startup_products.map((product: any) => (
                    <div key={product.id} className="border border-neutral-100 rounded-xl p-4">
                      {product.image_url && (
                        <img
                          src={product.image_url}
                          alt={product.name}
                          className="w-full h-32 object-cover rounded-lg mb-3"
                        />
                      )}
                      <h3 className="font-medium text-neutral-900 mb-1 text-sm">{product.name}</h3>
                      <p className="text-xs text-neutral-500 line-clamp-2">{product.description}</p>
                      {product.price && (
                        <p className="text-sm font-semibold text-brand-green-600 mt-2">
                          ₦{product.price.toLocaleString()} {product.currency}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tags */}
            {startup.tags && startup.tags.length > 0 && (
              <div className="bg-white rounded-2xl border border-neutral-100 p-6">
                <h2 className="font-semibold text-neutral-900 mb-3">Tags</h2>
                <div className="flex flex-wrap gap-2">
                  {startup.tags.map((tag: string) => (
                    <span key={tag} className="px-3 py-1 rounded-full bg-neutral-100 text-neutral-600 text-xs font-medium">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Meta info */}
            <div className="bg-white rounded-2xl border border-neutral-100 p-6">
              <h2 className="font-semibold text-neutral-900 mb-4">Details</h2>
              <div className="space-y-3">
                {startup.founded_year && (
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-neutral-400" />
                    <span className="text-neutral-600">Founded {startup.founded_year}</span>
                  </div>
                )}
                {startup.lga && (
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-neutral-400" />
                    <span className="text-neutral-600">{LGA_MAP[startup.lga] ?? startup.lga}, Ogun State</span>
                  </div>
                )}
                {startup.is_hiring && (
                  <div className="flex items-center gap-2 text-sm">
                    <Briefcase className="h-4 w-4 text-purple-500" />
                    <span className="text-purple-600 font-medium">Currently Hiring</span>
                  </div>
                )}
              </div>
            </div>

            {/* Founder */}
            {startup.profiles && (
              <div className="bg-white rounded-2xl border border-neutral-100 p-6">
                <h2 className="font-semibold text-neutral-900 mb-4">Founder</h2>
                <div className="flex items-center gap-3">
                  {startup.profiles.avatar_url ? (
                    <img
                      src={startup.profiles.avatar_url}
                      alt={startup.profiles.full_name ?? ""}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-brand-green-100 flex items-center justify-center text-brand-green-700 font-bold text-sm">
                      {getInitials(startup.profiles.full_name ?? "F")}
                    </div>
                  )}
                  <div>
                    <div className="text-sm font-medium text-neutral-900">
                      {startup.profiles.full_name ?? "Founder"}
                    </div>
                    <div className="text-xs text-neutral-500">Founder</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
