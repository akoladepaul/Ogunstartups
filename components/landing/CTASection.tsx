import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function CTASection() {
  return (
    <section className="bg-brand-green-900 py-20">
      <div className="section-container text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Is Your Startup in Ogun State?
          </h2>
          <p className="text-brand-green-200 text-lg mb-10 leading-relaxed">
            Join hundreds of founders already on OgunStartups. Connect with
            investors, government partners, and the broader ecosystem.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/login">
              <Button variant="gold" size="xl" className="gap-2 w-full sm:w-auto">
                Register a Startup <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <Link href="/organizations">
              <Button variant="outline-white" size="xl" className="w-full sm:w-auto">
                Register an Organization
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
