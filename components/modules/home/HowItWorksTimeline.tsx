"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { ClipboardCheck, Search, Star } from "lucide-react";
import { useRef } from "react";

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

export default function HowItWorksTimeline() {
  const timelineRef = useRef<HTMLDivElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ["start 75%", "end 30%"],
  });

  const desktopLineProgress = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const mobileLineProgress = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <div ref={timelineRef} className="relative">
      <div className="pointer-events-none absolute bottom-4 left-4 top-4 w-px bg-[#d5c8bf] md:hidden dark:bg-white/12" />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute left-4 top-4 bottom-4 w-px origin-top bg-linear-to-b from-neon-orange via-neon-gold to-neon-orange md:hidden"
        style={{ scaleY: mobileLineProgress }}
      />

      <div className="pointer-events-none absolute left-6 right-6 top-4 hidden h-px bg-[#d5c8bf] md:block dark:bg-white/12" />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute left-6 right-6 top-4 hidden h-px origin-left bg-linear-to-r from-neon-orange via-neon-gold to-neon-orange md:block"
        style={{ scaleX: desktopLineProgress }}
      />

      <div className="grid gap-4 pl-10 md:grid-cols-3 md:gap-5 md:pl-0 md:pt-7">
        {STEPS.map((step, index) => {
          const Icon = step.icon;

          return (
            <motion.article
              key={step.title}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ duration: 0.45, delay: index * 0.1 }}
              className="group relative rounded-2xl border border-[#decec3] bg-[#fff7f2] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-[#d19439] hover:bg-[#fff2e8] dark:border-white/12 dark:bg-white/3 dark:hover:border-neon-gold/40 dark:hover:bg-white/5"
            >
              <span className="absolute -left-8.5 top-7 h-3 w-3 rounded-full border border-[#d19439]/60 bg-[#fff6ec] md:left-1/2 md:-top-6.5 md:-translate-x-1/2 dark:border-neon-gold/45 dark:bg-black" />
              <span className="absolute -left-8 top-7.5 h-2 w-2 rounded-full bg-neon-gold shadow-[0_0_12px_rgba(255,209,102,0.65)] md:left-1/2 md:-top-6.25 md:-translate-x-1/2" />

              <p className="mb-4 inline-flex h-8 w-8 items-center justify-center rounded-full border border-[#d19439]/40 bg-[#ffe9c8] text-xs font-bold text-[#9a6219] dark:border-neon-gold/35 dark:bg-neon-gold/10 dark:text-neon-gold">
                {index + 1}
              </p>
              <div className="mb-3 inline-flex rounded-xl border border-[#dfcfc4] bg-[#fff2e8] p-2.5 dark:border-white/12 dark:bg-black/35">
                <Icon className="h-4 w-4 text-[#b45334] dark:text-neon-orange" />
              </div>
              <h3 className="text-lg font-semibold text-[#211713] dark:text-white">{step.title}</h3>
              <p className="mt-2 text-sm leading-6 text-[#5a4a42] dark:text-[#b7b7c2]">{step.description}</p>
            </motion.article>
          );
        })}
      </div>
    </div>
  );
}
