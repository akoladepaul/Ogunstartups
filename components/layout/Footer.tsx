import Link from "next/link";
import { Leaf, Twitter, Linkedin, Instagram, Facebook } from "lucide-react";

const footerLinks = {
  Platform: [
    { href: "/startups", label: "Startup Directory" },
    { href: "/organizations", label: "Organizations" },
    { href: "/about", label: "About Us" },
    { href: "/login", label: "List Your Startup" },
  ],
  Sectors: [
    { href: "/startups?category=agritech", label: "Agritech" },
    { href: "/startups?category=fintech", label: "Fintech" },
    { href: "/startups?category=edtech", label: "Edtech" },
    { href: "/startups?category=healthtech", label: "Healthtech" },
    { href: "/startups?category=logistics", label: "Logistics" },
    { href: "/startups?category=cleantech", label: "Cleantech" },
  ],
  LGAs: [
    { href: "/startups?lga=abeokuta_south", label: "Abeokuta South" },
    { href: "/startups?lga=sagamu", label: "Sagamu" },
    { href: "/startups?lga=ijebu_ode", label: "Ijebu Ode" },
    { href: "/startups?lga=ado_odo_ota", label: "Ado-Odo/Ota" },
    { href: "/startups?lga=ikenne", label: "Ikenne" },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-neutral-900 text-neutral-300">
      <div className="section-container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-green-600">
                <Leaf className="h-4 w-4 text-white" />
              </div>
              <span className="text-lg font-bold text-white">
                Ogun<span className="text-brand-green-400">Startups</span>
              </span>
            </Link>
            <p className="text-sm text-neutral-400 leading-relaxed mb-6">
              The central digital directory for all startups, innovation hubs,
              and business support organizations in Ogun State, Nigeria.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-neutral-500 hover:text-white transition-colors">
                <Twitter className="h-4 w-4" />
              </a>
              <a href="#" className="text-neutral-500 hover:text-white transition-colors">
                <Linkedin className="h-4 w-4" />
              </a>
              <a href="#" className="text-neutral-500 hover:text-white transition-colors">
                <Instagram className="h-4 w-4" />
              </a>
              <a href="#" className="text-neutral-500 hover:text-white transition-colors">
                <Facebook className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
                {title}
              </h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-neutral-400 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-neutral-800">
        <div className="section-container py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-neutral-500">
            © {new Date().getFullYear()} OgunStartups. Powering Ogun State&apos;s Innovation Ecosystem.
          </p>
          <p className="text-xs text-neutral-600">
            Built with ❤️ for Ogun State entrepreneurs
          </p>
        </div>
      </div>
    </footer>
  );
}
