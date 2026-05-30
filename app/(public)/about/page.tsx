import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Leaf, Target, Users, Globe, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "About",
  description: "Learn about OgunStartups — the central digital directory for Ogun State's innovation ecosystem.",
};

const values = [
  {
    icon: Target,
    title: "Our Mission",
    description:
      "To create a single, authoritative platform that makes Ogun State's entrepreneurship ecosystem visible, connected, and accessible to the world.",
  },
  {
    icon: Users,
    title: "Who We Serve",
    description:
      "Startup founders, innovation hubs, accelerators, government agencies, investors, and anyone who wants to discover the next generation of Ogun State builders.",
  },
  {
    icon: Globe,
    title: "Our Vision",
    description:
      "A thriving, data-driven innovation ecosystem where every entrepreneur in Ogun State has a digital presence and the connections to grow.",
  },
];

export default function AboutPage() {
  return (
    <div className="pt-16 min-h-screen">
      {/* Hero */}
      <section className="bg-brand-green-900 text-white py-20">
        <div className="section-container text-center">
          <div className="inline-flex items-center gap-2 bg-brand-green-800 rounded-full px-4 py-1.5 text-sm mb-6">
            <Leaf className="h-3.5 w-3.5" />
            About OgunStartups
          </div>
          <h1 className="heading-1 text-white mb-4">
            Powering Ogun State&apos;s <br />
            <span className="text-brand-green-300">Innovation Ecosystem</span>
          </h1>
          <p className="text-brand-green-100 max-w-2xl mx-auto text-lg leading-relaxed">
            OgunStartups is the definitive digital directory connecting
            entrepreneurs, investors, support organizations, and government
            across all 20 LGAs of Ogun State, Nigeria.
          </p>
        </div>
      </section>

      {/* Values */}
      <section className="section-padding bg-white">
        <div className="section-container">
          <div className="grid md:grid-cols-3 gap-8">
            {values.map((v) => {
              const Icon = v.icon;
              return (
                <div key={v.title} className="text-center">
                  <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-green-100 mb-4">
                    <Icon className="h-7 w-7 text-brand-green-700" />
                  </div>
                  <h3 className="text-lg font-semibold text-neutral-900 mb-2">{v.title}</h3>
                  <p className="text-neutral-500 text-sm leading-relaxed">{v.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* What we do */}
      <section className="section-padding bg-neutral-50">
        <div className="section-container max-w-3xl mx-auto">
          <h2 className="heading-2 text-neutral-900 mb-6 text-center">How Listings Work</h2>
          <div className="bg-white rounded-2xl border border-neutral-100 p-8 space-y-6">
            <div>
              <h3 className="font-semibold text-neutral-900 mb-2">1. Submit Your Listing</h3>
              <p className="text-neutral-500 text-sm leading-relaxed">
                Any startup or support organization based in Ogun State can submit a listing. You&apos;ll need to create an account and fill in your details including sector, LGA, description, and products or services.
              </p>
            </div>
            <div className="border-t border-neutral-100 pt-6">
              <h3 className="font-semibold text-neutral-900 mb-2">2. Verification Review</h3>
              <p className="text-neutral-500 text-sm leading-relaxed">
                Our admin team reviews every submission for accuracy and completeness. We may reach out if additional information is needed. Listings typically go live within 2–5 business days.
              </p>
            </div>
            <div className="border-t border-neutral-100 pt-6">
              <h3 className="font-semibold text-neutral-900 mb-2">3. Your Digital Footprint</h3>
              <p className="text-neutral-500 text-sm leading-relaxed">
                Once approved, your profile is publicly visible, searchable, and indexed by search engines. Investors, government partners, and potential collaborators can discover and contact you directly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact / CTA */}
      <section className="section-padding bg-white">
        <div className="section-container text-center">
          <h2 className="heading-2 text-neutral-900 mb-4">Get In Touch</h2>
          <p className="text-neutral-500 mb-8 max-w-lg mx-auto">
            Have questions about OgunStartups, want to partner with us, or represent a government body? We&apos;d love to hear from you.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a href="mailto:hello@ogunstartups.ng">
              <Button variant="default" size="lg" className="gap-2">
                Email Us <ArrowRight className="h-4 w-4" />
              </Button>
            </a>
            <Link href="/startups">
              <Button variant="green-outline" size="lg">
                Browse Directory
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
