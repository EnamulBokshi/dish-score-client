import { ClipboardCheck } from "lucide-react";

import HomeSectionFrame from "@/components/modules/home/HomeSectionFrame";
import HowItWorksTimeline from "@/components/modules/home/HowItWorksTimeline";

export default function HowItWorksSection() {
  return (
    <HomeSectionFrame
      className="py-18"
      badgeLabel="Simple Workflow"
      icon={<ClipboardCheck className="h-3.5 w-3.5 text-neon-orange dark:text-neon-gold" />}
      title="How It Works"
      description="From finding your next meal to leaving meaningful feedback, Dish Score keeps the full loop clear and fast."
      cardClassName="border-[#e7d4b4] bg-[#fff9ef]/96 shadow-[0_28px_62px_-46px_rgba(171,121,49,0.35)] dark:border-[#3b3126] dark:bg-black/45 dark:shadow-[0_30px_75px_-42px_rgba(255,209,102,0.55)]"
      backgroundGradientClassName="from-[#fff9ef] via-[#f9efe0] to-[#fff9ef] dark:from-[#07070b] dark:via-[#1f1308] dark:to-[#09070a]"
      topGlowClassName="bg-neon-gold/9 dark:bg-neon-gold/18"
      leftGlowClassName="bg-neon-orange/7 dark:bg-neon-orange/12"
      rightGlowClassName="bg-neon-gold/6 dark:bg-neon-gold/10"
      link={{
        href: "/reviews",
        label: "Explore Reviews",
      }}
    >
      <HowItWorksTimeline />
    </HomeSectionFrame>
  );
}
