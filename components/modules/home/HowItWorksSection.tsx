import { ClipboardCheck } from "lucide-react";

import HomeSectionFrame from "@/components/modules/home/HomeSectionFrame";
import HowItWorksTimeline from "@/components/modules/home/HowItWorksTimeline";

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
      <HowItWorksTimeline />
    </HomeSectionFrame>
  );
}
