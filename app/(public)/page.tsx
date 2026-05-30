import HeroSection from "@/components/landing/HeroSection";
import StatsSection from "@/components/landing/StatsSection";
import FeaturedStartups from "@/components/landing/FeaturedStartups";
import SectorsGrid from "@/components/landing/SectorsGrid";
import LGAExplorer from "@/components/landing/LGAExplorer";
import HowItWorks from "@/components/landing/HowItWorks";
import CTASection from "@/components/landing/CTASection";
import { getFeaturedStartups, getStats } from "@/lib/actions/startups";

export const revalidate = 3600;

export default async function HomePage() {
  const [stats, featured] = await Promise.all([
    getStats(),
    getFeaturedStartups(6),
  ]);

  return (
    <>
      <HeroSection />
      <StatsSection stats={stats} />
      <FeaturedStartups startups={featured} />
      <SectorsGrid />
      <LGAExplorer />
      <HowItWorks />
      <CTASection />
    </>
  );
}
