import { notFound } from "next/navigation";
import Link from "next/link";
import {
  Globe, Twitter, Linkedin, MapPin, Calendar, ArrowLeft, Building,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getOrganizationBySlug, incrementOrgViewCount } from "@/lib/actions/organizations";
import { LGA_MAP } from "@/constants/lgas";
import { getInitials } from "@/lib/utils";
import type { Metadata } from "next";

const ORG_TYPE_LABELS: Record<string, string> = {
  accelerator: "Accelerator",
  incubator: "Incubator",
  coworking: "Co-working Space",
  angel_network: "Angel Network",
  government_agency: "Government Agency",
  ngo: "NGO",
  university_hub: "University Hub",
  corporate_program: "Corporate Program",
};

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const org = await getOrganizationBySlug(slug);
  if (!org) return { title: "Not Found" };
  return {
    title: org.name,
    description: org.tagline ?? undefined,
  };
}

export default async function OrganizationProfilePage({ params }: PageProps) {
  const { slug } = await params;
  const org = await getOrganizationBySlug(slug);
  if (!org) notFound();

  incrementOrgViewCount(org.id).catch(() => {});

  const socialLinks = (org.socialLinks ?? {}) as Record<string, string>;
  const owner = (org as any).owner as { name: string | null; image: string | null } | null;

  return (
    <div className="pt-16 min-h-screen bg-neutral-50">
      <div className="section-container pt-6">
        <Link
          href="/organizations"
          className="inline-flex items-center gap-1 text-sm text-neutral-500 hover:text-brand-green-600 mb-6"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Organizations
        </Link>
      </div>

      {/* Cover */}
      <div className="h-32 sm:h-48 lg:h-64 bg-gradient-to-br from-brand-green-100 to-brand-green-200 relative">
        {org.coverUrl && (
          <img src={org.coverUrl} alt="" className="w-full h-full object-cover" />
        )}
      </div>

      <div className="section-container">
        {/* Profile header */}
        <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm -mt-6 sm:-mt-10 mb-6">
          {/* Logo strip */}
          <div className="px-4 sm:px-6 pt-0">
            <div className="inline-block -mt-8 sm:-mt-12">
              {org.logoUrl ? (
                <img
                  src={org.logoUrl}
                  alt={org.name}
                  className="h-16 w-16 sm:h-20 sm:w-20 rounded-2xl border-4 border-white shadow-md object-cover"
                />
              ) : (
                <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-2xl border-4 border-white shadow-md bg-brand-green-700 flex items-center justify-center text-white font-bold text-lg sm:text-xl">
                  {getInitials(org.name)}
                </div>
              )}
            </div>
          </div>

          {/* Info row */}
          <div className="px-4 sm:px-6 pb-4 sm:pb-6 mt-2 flex flex-col sm:flex-row sm:items-start gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h1 className="text-xl sm:text-2xl font-bold text-neutral-900 break-words">{org.name}</h1>
              </div>
              <p className="text-sm sm:text-base text-neutral-600 mb-3 leading-snug">{org.tagline}</p>

              <div className="flex flex-wrap gap-2 mb-4">
                {org.orgType && (
                  <Badge variant="sector">{ORG_TYPE_LABELS[org.orgType] ?? org.orgType}</Badge>
                )}
                {org.lga && (
                  <div className="flex items-center gap-1 text-xs text-neutral-500">
                    <MapPin className="h-3 w-3" />
                    {LGA_MAP[org.lga] ?? org.lga}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3">
                {org.websiteUrl && (
                  <a href={org.websiteUrl} target="_blank" rel="noopener noreferrer"
                    className="text-neutral-500 hover:text-brand-green-600">
                    <Globe className="h-4 w-4" />
                  </a>
                )}
                {socialLinks.twitter && (
                  <a href={socialLinks.twitter} target="_blank" rel="noopener noreferrer"
                    className="text-neutral-500 hover:text-[#1da1f2]">
                    <Twitter className="h-4 w-4" />
                  </a>
                )}
                {socialLinks.linkedin && (
                  <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer"
                    className="text-neutral-500 hover:text-[#0077b5]">
                    <Linkedin className="h-4 w-4" />
                  </a>
                )}
              </div>
            </div>

            {org.websiteUrl && (
              <a href={org.websiteUrl} target="_blank" rel="noopener noreferrer" className="shrink-0">
                <Button variant="default" size="sm" className="w-full sm:w-auto">
                  Visit Website
                </Button>
              </a>
            )}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 pb-16">
          <div className="lg:col-span-2 space-y-6">
            {org.description && (
              <div className="bg-white rounded-2xl border border-neutral-100 p-6">
                <h2 className="font-semibold text-neutral-900 mb-3">About</h2>
                <p className="text-neutral-600 leading-relaxed whitespace-pre-line">{org.description}</p>
              </div>
            )}

            {Array.isArray(org.tags) && org.tags.length > 0 && (
              <div className="bg-white rounded-2xl border border-neutral-100 p-6">
                <h2 className="font-semibold text-neutral-900 mb-3">Tags</h2>
                <div className="flex flex-wrap gap-2">
                  {(org.tags as string[]).map((tag) => (
                    <span key={tag} className="px-3 py-1 rounded-full bg-neutral-100 text-neutral-600 text-xs font-medium">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-neutral-100 p-6">
              <h2 className="font-semibold text-neutral-900 mb-4">Details</h2>
              <div className="space-y-3">
                {org.foundedYear && (
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-neutral-400" />
                    <span className="text-neutral-600">Founded {org.foundedYear}</span>
                  </div>
                )}
                {org.lga && (
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-neutral-400" />
                    <span className="text-neutral-600">{LGA_MAP[org.lga] ?? org.lga}, Ogun State</span>
                  </div>
                )}
                {org.orgType && (
                  <div className="flex items-center gap-2 text-sm">
                    <Building className="h-4 w-4 text-neutral-400" />
                    <span className="text-neutral-600">{ORG_TYPE_LABELS[org.orgType] ?? org.orgType}</span>
                  </div>
                )}
              </div>
            </div>

            {owner && (
              <div className="bg-white rounded-2xl border border-neutral-100 p-6">
                <h2 className="font-semibold text-neutral-900 mb-4">Contact</h2>
                <div className="flex items-center gap-3">
                  {owner.image ? (
                    <img src={owner.image} alt={owner.name ?? ""} className="h-10 w-10 rounded-full object-cover" />
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-brand-green-100 flex items-center justify-center text-brand-green-700 font-bold text-sm">
                      {getInitials(owner.name ?? "O")}
                    </div>
                  )}
                  <div>
                    <div className="text-sm font-medium text-neutral-900">{owner.name ?? "Representative"}</div>
                    <div className="text-xs text-neutral-500">Organization Owner</div>
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
