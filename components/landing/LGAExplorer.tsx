import Link from "next/link";
import { SENATORIAL_ZONES } from "@/constants/lgas";

export default function LGAExplorer() {
  return (
    <section className="section-padding bg-white">
      <div className="section-container">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="heading-2 text-neutral-900 mb-3">Explore by LGA</h2>
          <p className="text-neutral-500 max-w-xl mx-auto text-sm sm:text-base">
            OgunStartups covers all 20 Local Government Areas across the three
            senatorial zones of Ogun State.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
          {Object.entries(SENATORIAL_ZONES).map(([zone, lgas]) => (
            <div key={zone}>
              <h3 className="text-xs font-semibold text-brand-green-600 uppercase tracking-widest mb-4">
                {zone}
              </h3>
              <div className="flex flex-col gap-2">
                {lgas.map((lga) => (
                  <Link
                    key={lga.value}
                    href={`/startups?lga=${lga.value}`}
                    className="group flex items-center justify-between px-4 py-2.5 rounded-lg border border-neutral-100 hover:border-brand-green-200 hover:bg-brand-green-50 transition-all duration-150"
                  >
                    <span className="text-sm text-neutral-700 group-hover:text-brand-green-700 font-medium">
                      {lga.label}
                    </span>
                    <span className="text-xs text-neutral-400 group-hover:text-brand-green-500">
                      →
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
