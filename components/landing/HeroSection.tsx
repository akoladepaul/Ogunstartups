import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-green-50 via-white to-white" />
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "radial-gradient(circle, #16a34a 1px, transparent 1px)",
          backgroundSize: "30px 30px",
        }}
      />
      {/* Green blob */}
      <div className="absolute top-20 right-0 w-[600px] h-[600px] bg-brand-green-100 rounded-full blur-3xl opacity-40 -translate-y-1/4 translate-x-1/4" />

      <div className="relative section-container pt-20 sm:pt-24 pb-12 sm:pb-16">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left column */}
          <div className="animate-slide-up">
            <div className="inline-flex items-center gap-2 bg-brand-green-100 text-brand-green-800 rounded-full px-4 py-1.5 text-sm font-medium mb-5 sm:mb-6">
              <MapPin className="h-3.5 w-3.5" />
              Ogun State, Nigeria
            </div>

            <h1 className="heading-1 text-neutral-900 mb-4 sm:mb-6">
              Discover Ogun State&apos;s{" "}
              <span className="text-brand-green-600">Innovation</span>{" "}
              Ecosystem
            </h1>

            <p className="text-base sm:text-lg text-neutral-600 leading-relaxed mb-6 sm:mb-8 max-w-xl">
              The definitive digital directory for startups, innovation hubs,
              and business support organizations across all 20 LGAs of Ogun
              State. Connect, grow, and build the future of Nigeria&apos;s
              Gateway State.
            </p>

            <div className="flex flex-col xs:flex-row flex-wrap gap-3 sm:gap-4 mb-8 sm:mb-10">
              <Link href="/startups">
                <Button variant="default" size="lg" className="gap-2 w-full xs:w-auto">
                  Explore Directory <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="green-outline" size="lg" className="w-full xs:w-auto">
                  Register Your Startup
                </Button>
              </Link>
            </div>

            {/* Social proof */}
            <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-4 sm:gap-6 text-sm text-neutral-500">
              <div>
                <span className="font-bold text-neutral-900 text-base">150+</span>{" "}
                Startups
              </div>
              <div>
                <span className="font-bold text-neutral-900 text-base">20</span>{" "}
                LGAs
              </div>
              <div>
                <span className="font-bold text-neutral-900 text-base">13</span>{" "}
                Sectors
              </div>
              <div>
                <span className="font-bold text-neutral-900 text-base">30+</span>{" "}
                Support Orgs
              </div>
            </div>
          </div>

          {/* Right column — startup card mosaic */}
          <div className="hidden lg:block relative">
            <div className="grid grid-cols-2 gap-4">
              {heroCards.map((card, i) => (
                <div
                  key={i}
                  className={`bg-white rounded-2xl border border-neutral-100 shadow-sm p-5 ${
                    i % 3 === 1 ? "mt-6" : ""
                  }`}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className={`h-10 w-10 rounded-xl flex items-center justify-center text-white text-sm font-bold ${card.color}`}
                    >
                      {card.initial}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-neutral-900">
                        {card.name}
                      </div>
                      <div className="text-xs text-neutral-500">{card.lga}</div>
                    </div>
                  </div>
                  <span className="badge-sector">{card.sector}</span>
                </div>
              ))}
            </div>
            {/* Floating verified badge */}
            <div className="absolute -bottom-4 -left-4 bg-white rounded-xl shadow-lg border border-neutral-100 px-4 py-3 flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-brand-green-100 flex items-center justify-center">
                <span className="text-brand-green-600 text-sm">✓</span>
              </div>
              <div>
                <div className="text-xs font-semibold text-neutral-900">Verified Listings</div>
                <div className="text-xs text-neutral-500">Curated by admins</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const heroCards = [
  { name: "AgroNova", lga: "Obafemi-Owode", sector: "Agritech", initial: "AN", color: "bg-brand-green-600" },
  { name: "PayOgun", lga: "Abeokuta South", sector: "Fintech", initial: "PO", color: "bg-blue-600" },
  { name: "EduBridge", lga: "Sagamu", sector: "Edtech", initial: "EB", color: "bg-purple-600" },
  { name: "SwiftHaul", lga: "Ado-Odo/Ota", sector: "Logistics", initial: "SH", color: "bg-orange-500" },
];
