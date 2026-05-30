import { UserPlus, LayoutDashboard, Globe } from "lucide-react";

const steps = [
  {
    icon: UserPlus,
    step: "01",
    title: "Create an Account",
    description:
      "Sign up with your email in under a minute. No credit card or complex verification required.",
  },
  {
    icon: LayoutDashboard,
    step: "02",
    title: "Build Your Profile",
    description:
      "Fill in your startup details, add your products, upload your logo, and tell your story.",
  },
  {
    icon: Globe,
    step: "03",
    title: "Get Discovered",
    description:
      "Once verified, your listing goes live for investors, partners, government, and the public.",
  },
];

export default function HowItWorks() {
  return (
    <section className="section-padding bg-neutral-50">
      <div className="section-container">
        <div className="text-center mb-14">
          <h2 className="heading-2 text-neutral-900 mb-3">How It Works</h2>
          <p className="text-neutral-500 max-w-lg mx-auto">
            Get your startup listed on OgunStartups in three simple steps.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 relative">
          {/* Connecting line */}
          <div className="absolute hidden md:block top-10 left-1/3 right-1/3 h-px border-t-2 border-dashed border-brand-green-200" />

          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div key={step.step} className="relative text-center">
                {/* Step number */}
                <div className="inline-flex flex-col items-center mb-6">
                  <div className="relative">
                    <div className="h-20 w-20 rounded-2xl bg-brand-green-600 flex items-center justify-center shadow-lg mb-2">
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-brand-gold-500 flex items-center justify-center">
                      <span className="text-white text-xs font-bold">
                        {step.step}
                      </span>
                    </div>
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-neutral-500 leading-relaxed max-w-xs mx-auto">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
