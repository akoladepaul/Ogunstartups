import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { MapPin, Globe, BadgeCheck } from "lucide-react";
import { getInitials } from "@/lib/utils";
import { LGA_MAP } from "@/constants/lgas";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Support Organizations",
  description: "Discover innovation hubs, accelerators, incubators, and business support organizations in Ogun State.",
};

const ORG_TYPE_LABELS: Record<string, string> = {
  accelerator: "Accelerator",
  incubator: "Incubator",
  coworking: "Co-working Space",
  angel_network: "Angel Network",
  government_agency: "Government Agency",
  ngo: "NGO / Foundation",
  university_hub: "University Hub",
  corporate_program: "Corporate Program",
};

const orgTypeColors: Record<string, string> = {
  accelerator: "bg-blue-100 text-blue-700",
  incubator: "bg-green-100 text-green-700",
  coworking: "bg-purple-100 text-purple-700",
  angel_network: "bg-orange-100 text-orange-700",
  government_agency: "bg-red-100 text-red-700",
  ngo: "bg-teal-100 text-teal-700",
  university_hub: "bg-indigo-100 text-indigo-700",
  corporate_program: "bg-pink-100 text-pink-700",
};

export default async function OrganizationsPage() {
  const orgs = await prisma.organization.findMany({
    where: { status: "approved" },
    orderBy: [{ createdAt: "desc" }],
  });

  return (
    <div className="pt-16 min-h-screen bg-neutral-50">
      <div className="bg-white border-b border-neutral-100">
        <div className="section-container py-12">
          <h1 className="heading-2 text-neutral-900 mb-2">Support Organizations</h1>
          <p className="text-neutral-500 max-w-2xl">
            Incubators, accelerators, co-working spaces, angel networks, and
            government agencies supporting entrepreneurs across Ogun State.
          </p>
        </div>
      </div>

      <div className="section-container py-10">
        {orgs.length === 0 ? (
          <div className="text-center py-20 text-neutral-500">
            No organizations listed yet.
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {orgs.map((org) => (
              <Link key={org.id} href={`/organizations/${org.slug}`}>
                <div className="group h-full bg-white rounded-2xl border border-neutral-100 p-6 hover:shadow-md hover:border-brand-green-100 transition-all">
                  <div className="flex items-start gap-4 mb-4">
                    {org.logoUrl ? (
                      <img src={org.logoUrl} alt={org.name}
                        className="h-12 w-12 rounded-xl object-cover border border-neutral-100 shrink-0" />
                    ) : (
                      <div className="h-12 w-12 rounded-xl bg-brand-green-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
                        {getInitials(org.name)}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h3 className="font-semibold text-neutral-900 text-sm truncate group-hover:text-brand-green-700">
                          {org.name}
                        </h3>
                        {org.status === "approved" && (
                          <BadgeCheck className="h-3.5 w-3.5 text-brand-green-600 shrink-0" />
                        )}
                      </div>
                      {org.lga && (
                        <div className="flex items-center gap-1 text-xs text-neutral-500 mt-0.5">
                          <MapPin className="h-3 w-3" />
                          {LGA_MAP[org.lga] ?? org.lga}
                        </div>
                      )}
                    </div>
                  </div>

                  <p className="text-sm text-neutral-600 line-clamp-2 mb-4 leading-relaxed">
                    {org.tagline}
                  </p>

                  <div className="flex items-center justify-between">
                    {org.orgType && (
                      <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                        orgTypeColors[org.orgType] ?? "bg-neutral-100 text-neutral-700"
                      }`}>
                        {ORG_TYPE_LABELS[org.orgType] ?? org.orgType}
                      </span>
                    )}
                    {org.websiteUrl && (
                      <Globe className="h-4 w-4 text-neutral-300" />
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
