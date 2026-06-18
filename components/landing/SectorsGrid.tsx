import Link from "next/link";
import {
  Sprout, Banknote, GraduationCap, Stethoscope, Truck, Factory,
  ShoppingCart, Wind, Cpu, Palette, Building2, UtensilsCrossed, MoreHorizontal,
} from "lucide-react";
import { SECTORS } from "@/constants/sectors";

const iconMap: Record<string, React.ElementType> = {
  Sprout, Banknote, GraduationCap, Stethoscope, Truck, Factory,
  ShoppingCart, Wind, Cpu, Palette, Building2, UtensilsCrossed, MoreHorizontal,
};

const sectorColors = [
  "bg-green-50 text-green-700",
  "bg-blue-50 text-blue-700",
  "bg-purple-50 text-purple-700",
  "bg-red-50 text-red-600",
  "bg-orange-50 text-orange-700",
  "bg-yellow-50 text-yellow-700",
  "bg-cyan-50 text-cyan-700",
  "bg-teal-50 text-teal-700",
  "bg-indigo-50 text-indigo-700",
  "bg-pink-50 text-pink-700",
  "bg-slate-50 text-slate-700",
  "bg-lime-50 text-lime-700",
  "bg-neutral-50 text-neutral-600",
];

export default function SectorsGrid() {
  return (
    <section className="section-padding bg-neutral-50">
      <div className="section-container">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="heading-2 text-neutral-900 mb-3">Browse by Sector</h2>
          <p className="text-neutral-500 max-w-xl mx-auto text-sm sm:text-base">
            Ogun State&apos;s innovation ecosystem spans 13 industries — from agriculture
            to fintech and clean energy.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
          {SECTORS.map((sector, i) => {
            const Icon = iconMap[sector.icon] ?? MoreHorizontal;
            const colorClass = sectorColors[i % sectorColors.length];
            return (
              <Link
                key={sector.value}
                href={`/startups?category=${sector.value}`}
                className="group bg-white rounded-2xl border border-neutral-100 p-3 sm:p-5 hover:shadow-md hover:border-brand-green-100 transition-all duration-200 flex flex-col items-center text-center"
              >
                <div className={`h-10 w-10 sm:h-12 sm:w-12 rounded-xl flex items-center justify-center mb-2 sm:mb-3 ${colorClass} bg-opacity-60`}>
                  <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                </div>
                <span className="text-xs sm:text-sm font-semibold text-neutral-800 group-hover:text-brand-green-700">
                  {sector.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
