import Link from "next/link";
import {
  ArrowRight,
  Compass,
  HeartHandshake,
  Layers3,
  ShieldCheck,
  Sparkles,
  Target,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const PRINCIPLES = [
  {
    title: "Community First",
    description:
      "Real diner voices matter more than promotional copy. We prioritize authentic experiences and transparent sentiment.",
    icon: Users,
    tone: "from-[#ffe7dd] to-[#fff3ec] border-[#f3d5c8]",
  },
  {
    title: "Signal Over Noise",
    description:
      "Ratings, review quality, and helpful votes are weighted to highlight trustworthy insights instead of vanity popularity.",
    icon: Target,
    tone: "from-[#fff0db] to-[#fff8ef] border-[#efd9b1]",
  },
  {
    title: "Fair Discovery",
    description:
      "Small restaurants and hidden dishes deserve visibility. Our discovery layers surface value, not just marketing budget.",
    icon: Compass,
    tone: "from-[#e9fff7] to-[#f3fffb] border-[#cdeee2]",
  },
  {
    title: "Trust & Safety",
    description:
      "We continuously moderate abusive content and suspicious patterns to preserve a respectful, high-confidence review ecosystem.",
    icon: ShieldCheck,
    tone: "from-[#eaf2ff] to-[#f4f8ff] border-[#d0def7]",
  },
];

const TIMELINE = [
  {
    year: "2024",
    title: "Dish-Score Started",
    detail: "We began with a simple question: how can diners compare food quality beyond ads and influencer hype?",
  },
  {
    year: "2025",
    title: "Restaurant + Dish Intelligence",
    detail: "We merged dish-level and restaurant-level scoring to give complete context for every recommendation.",
  },
  {
    year: "2026",
    title: "Review Confidence Engine",
    detail: "Weighted ranking introduced to combine star ratings, review depth, and community helpful-vote trust signals.",
  },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#f3ebe6] px-4 py-8 text-[#2f2520] sm:px-6 lg:px-8 dark:bg-[#09070d] dark:text-[#f3ede9]">
      <div className="mx-auto w-full max-w-7xl space-y-8">
        <section className="relative overflow-hidden rounded-[40px] border border-[#e4d8d1] bg-[#f9f6f3] px-5 py-10 sm:px-8 lg:px-12 dark:border-[#2f2430] dark:bg-[#120d18]">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_8%_12%,rgba(142,112,97,0.14),transparent_36%),radial-gradient(circle_at_92%_8%,rgba(194,150,122,0.16),transparent_34%),linear-gradient(130deg,rgba(255,255,255,0.48),transparent_55%)]"
          />

          <div className="relative grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div className="space-y-4">
              <p className="inline-flex items-center gap-2 rounded-full border border-[#d6c8c0] bg-[#f3eeea] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#725f56] dark:border-[#3a2f3e] dark:bg-[#1a1322] dark:text-[#d9c7be]">
                <Layers3 className="h-3.5 w-3.5 text-[#8d7266]" />
                About Dish-Score
              </p>

              <h1 className="max-w-2xl text-4xl leading-tight font-extrabold text-[#2f2520] sm:text-5xl dark:text-[#f5ece6]">
                Built to Make Food Discovery
                <span className="block text-[#8d5f4f] dark:text-[#ffb293]">More Honest and Useful</span>
              </h1>

              <p className="max-w-xl text-sm leading-7 text-[#7b6a62] sm:text-base dark:text-[#bcaea8]">
                Dish-Score is a review platform designed around trust signals, not hype. We help people evaluate
                dishes and restaurants with confidence by combining ratings, review depth, and community feedback.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Button asChild className="h-10 rounded-full bg-[#6e5a52] px-5 text-white hover:bg-[#5e4c45]">
                  <Link href="/reviews">Explore Reviews</Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="h-10 rounded-full border-[#d8ccc5] bg-white px-5 text-[#665650] hover:bg-[#f6f1ee] dark:border-[#4a3950] dark:bg-[#1b1422] dark:text-[#f3d8cb] dark:hover:bg-[#251b2f]"
                >
                  <Link href="/contact" className="inline-flex items-center gap-2">
                    Talk to Our Team <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>

            <Card className="rounded-[30px] border-[#e5d7cf] bg-white/95 shadow-[0_28px_44px_-34px_rgba(82,64,56,0.45)] dark:border-[#3b2c3f] dark:bg-[#140f1d]/95 dark:shadow-[0_24px_44px_-28px_rgba(0,0,0,0.8)]">
              <CardContent className="space-y-4 p-6 sm:p-7">
                <p className="inline-flex items-center gap-2 rounded-full border border-[#eeded4] bg-[#fbf6f2] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#8b6f62] dark:border-[#4a3a4d] dark:bg-[#21192b] dark:text-[#d3c1ba]">
                  <Sparkles className="h-3.5 w-3.5 text-[#d08b58]" />
                  What We Optimize For
                </p>

                <div className="space-y-3">
                  <div className="rounded-2xl border border-[#efdfd6] bg-[#fffaf7] p-4 dark:border-[#443448] dark:bg-[#1c1526]">
                    <p className="text-sm font-semibold text-[#4a3c36] dark:text-[#f2e8e3]">Review quality over quantity</p>
                    <p className="mt-1 text-sm text-[#7a6760] dark:text-[#bcafaa]">Detailed, useful feedback gets surfaced above short, low-signal noise.</p>
                  </div>

                  <div className="rounded-2xl border border-[#efdfd6] bg-[#fffaf7] p-4 dark:border-[#443448] dark:bg-[#1c1526]">
                    <p className="text-sm font-semibold text-[#4a3c36] dark:text-[#f2e8e3]">Context-aware scoring</p>
                    <p className="mt-1 text-sm text-[#7a6760] dark:text-[#bcafaa]">Dish-level and restaurant-level insights stay connected so decisions are complete.</p>
                  </div>

                  <div className="rounded-2xl border border-[#efdfd6] bg-[#fffaf7] p-4 dark:border-[#443448] dark:bg-[#1c1526]">
                    <p className="text-sm font-semibold text-[#4a3c36] dark:text-[#f2e8e3]">Fair visibility for local gems</p>
                    <p className="mt-1 text-sm text-[#7a6760] dark:text-[#bcafaa]">Strong quality signals can outperform raw popularity.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="rounded-[34px] border border-[#e4d7cf] bg-[#f8f4f1] p-5 sm:p-7 dark:border-[#35283a] dark:bg-[#110c19]">
          <div className="mb-6">
            <p className="inline-flex items-center gap-2 rounded-full border border-[#ffc7b6] bg-[#fff2eb] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#cf5e39] dark:border-[#6c3d4c] dark:bg-[#2a1620] dark:text-[#ff9f82]">
              <HeartHandshake className="h-3.5 w-3.5 text-[#f08f56]" />
              Our Principles
            </p>
            <h2 className="mt-3 text-3xl font-extrabold text-[#2f2420] sm:text-4xl dark:text-[#f5ece6]">
              The Standards Behind Every <span className="text-[#ef4c7d]">Score</span>
            </h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {PRINCIPLES.map((principle) => {
              const Icon = principle.icon;

              return (
                <Card
                  key={principle.title}
                  className={`rounded-3xl border bg-linear-to-br ${principle.tone} shadow-[0_20px_26px_-26px_rgba(100,78,67,0.7)]`}
                >
                  <CardContent className="p-5">
                    <div className="mb-3 inline-flex rounded-xl border border-white/80 bg-white/70 p-2.5 text-[#6d584f]">
                      <Icon className="h-4.5 w-4.5" />
                    </div>
                    <h3 className="text-lg font-bold text-[#362b26] dark:text-[#201922]">{principle.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-[#665750] dark:text-[#3b323d]">{principle.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        <section className="rounded-[34px] border border-[#e5dad3] bg-white p-5 sm:p-7 dark:border-[#35283a] dark:bg-[#120d1a]">
          <div className="mb-6">
            <p className="inline-flex items-center gap-2 rounded-full border border-[#d8ccc5] bg-[#f8f1ed] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#8b6f62] dark:border-[#4a3a4d] dark:bg-[#221a2c] dark:text-[#d3c1ba]">
              <Sparkles className="h-3.5 w-3.5 text-[#a8785e]" />
              Journey
            </p>
            <h2 className="mt-3 text-3xl font-extrabold text-[#2f2420] sm:text-4xl dark:text-[#f5ece6]">
              How Dish-Score <span className="text-[#8d5f4f]">Evolved</span>
            </h2>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            {TIMELINE.map((item) => (
              <Card key={item.year} className="rounded-3xl border-[#eadfd8] bg-[#fffdfa] dark:border-[#45334a] dark:bg-[#1a1324]">
                <CardContent className="p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#a28679] dark:text-[#c9b3a8]">{item.year}</p>
                  <h3 className="mt-2 text-lg font-bold text-[#3c312c] dark:text-[#f2e8e3]">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-[#6f5f59] dark:text-[#b8aca7]">{item.detail}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
