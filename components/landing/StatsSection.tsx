interface StatsSectionProps {
  stats: {
    startups: number;
    organizations: number;
    lgas: number;
    sectors: number;
  };
}

export default function StatsSection({ stats }: StatsSectionProps) {
  const items = [
    { label: "Registered Startups", value: stats.startups, suffix: "+" },
    { label: "Support Organizations", value: stats.organizations, suffix: "+" },
    { label: "LGAs Covered", value: stats.lgas, suffix: "" },
    { label: "Industry Sectors", value: stats.sectors, suffix: "" },
  ];

  return (
    <section className="bg-brand-green-600 py-14">
      <div className="section-container">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {items.map((item) => (
            <div key={item.label} className="text-center">
              <div className="text-4xl sm:text-5xl font-bold text-white mb-2">
                {item.value}
                {item.suffix}
              </div>
              <div className="text-brand-green-100 text-sm font-medium">
                {item.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
