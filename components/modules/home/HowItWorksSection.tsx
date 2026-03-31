import { ClipboardCheck, Search, Star } from "lucide-react";

import HomeSectionFrame from "@/components/modules/home/HomeSectionFrame";

const STEPS = [
  {
    title: "Discover",
    description:
      "Search restaurants and dishes with real community signals, then shortlist the ones worth your time.",
    icon: Search,
  },
  {
    title: "Experience",
    description:
      "Try what you found, compare expectation vs taste, and capture your own notes while details are fresh.",
    icon: ClipboardCheck,
  },
  {
    title: "Review",
    description:
      "Rate, write, and publish. Help the next diner make better decisions with honest, useful feedback.",
    icon: Star,
  },
];

export default function HowItWorksSection() {
  return (
    <HomeSectionFrame
      className="py-18"
      badgeLabel="Simple Workflow"
      icon={<ClipboardCheck className="h-3.5 w-3.5 text-neon-orange" />}
      title="How It Works"
      description="From finding your next meal to leaving meaningful feedback, Dish Score keeps the full loop clear and fast."
      cardClassName="border-neon-gold/35 bg-black/45 shadow-[0_30px_75px_-42px_rgba(255,209,102,0.55)]"
      backgroundGradientClassName="from-[#07070b] via-[#1f1308] to-[#09070a]"
      topGlowClassName="bg-neon-gold/18"
      leftGlowClassName="bg-neon-orange/12"
      rightGlowClassName="bg-neon-gold/10"
      link={{
        href: "/reviews",
        label: "Explore Reviews",
      }}
    >
      <div className="grid gap-4 md:grid-cols-3">
        {STEPS.map((step, index) => {
          const Icon = step.icon;

          return (
            <article
              key={step.title}
              className="group rounded-2xl border border-white/12 bg-white/3 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-neon-gold/40 hover:bg-white/5"
            >
              <p className="mb-4 inline-flex h-8 w-8 items-center justify-center rounded-full border border-neon-gold/35 bg-neon-gold/10 text-xs font-bold text-neon-gold">
                {index + 1}
              </p>
              <div className="mb-3 inline-flex rounded-xl border border-white/12 bg-black/35 p-2.5">
                <Icon className="h-4.5 w-4.5 text-neon-orange" />
              </div>
              <h3 className="text-lg font-semibold text-white">{step.title}</h3>
              <p className="mt-2 text-sm leading-6 text-[#b7b7c2]">{step.description}</p>
            </article>
          );
        })}
      </div>
    </HomeSectionFrame>
  );
}
