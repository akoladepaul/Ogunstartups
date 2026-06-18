import { Suspense } from "react";
import StartupCard from "@/components/startups/StartupCard";
import StartupFilters from "@/components/startups/StartupFilters";
import { getStartups } from "@/lib/actions/startups";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Startup Directory",
  description:
    "Browse all startups in Ogun State. Filter by sector, LGA, and stage.",
};

interface PageProps {
  searchParams: Promise<{
    category?: string;
    lga?: string;
    stage?: string;
    search?: string;
    page?: string;
  }>;
}

export default async function StartupsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const page = Number(params.page ?? 1);

  const result = await getStartups({
    category: params.category,
    lga: params.lga,
    stage: params.stage,
    search: params.search,
    page,
    limit: 12,
  });

  return (
    <div className="pt-16 min-h-screen bg-neutral-50">
      {/* Header */}
      <div className="bg-white border-b border-neutral-100">
        <div className="section-container py-6 sm:py-10">
          <h1 className="heading-2 text-neutral-900 mb-1 sm:mb-2">Startup Directory</h1>
          <p className="text-neutral-500 text-sm sm:text-base">
            {result.count} startup{result.count !== 1 ? "s" : ""} registered across Ogun State
          </p>
        </div>
      </div>

      <div className="section-container py-5 sm:py-8">
        <div className="flex flex-col lg:flex-row gap-5 sm:gap-8">
          {/* Sidebar filters */}
          <aside className="lg:w-64 shrink-0">
            <Suspense>
              <StartupFilters />
            </Suspense>
          </aside>

          {/* Main grid */}
          <div className="flex-1">
            {result.data.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-5xl mb-4">🔍</div>
                <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                  No startups found
                </h3>
                <p className="text-neutral-500 mb-6">
                  Try adjusting your filters or search terms.
                </p>
                <Link href="/startups">
                  <Button variant="outline">Clear filters</Button>
                </Link>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                  {result.data.map((startup) => (
                    <StartupCard key={startup.id} startup={startup as any} />
                  ))}
                </div>

                {/* Pagination */}
                {(result.totalPages ?? 1) > 1 && (
                  <div className="flex justify-center gap-2 mt-10">
                    {page > 1 && (
                      <Link href={`/startups?page=${page - 1}`}>
                        <Button variant="outline" size="sm">← Previous</Button>
                      </Link>
                    )}
                    <span className="flex items-center px-4 text-sm text-neutral-500">
                      Page {page} of {result.totalPages ?? 1}
                    </span>
                    {page < (result.totalPages ?? 1) && (
                      <Link href={`/startups?page=${page + 1}`}>
                        <Button variant="outline" size="sm">Next →</Button>
                      </Link>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
