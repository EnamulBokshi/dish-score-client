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
    <main className="min-h-screen bg-[#f3ebe6] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-7xl space-y-8">
        <section className="relative overflow-hidden rounded-[40px] border border-[#e4d8d1] bg-[#f9f6f3] px-5 py-10 sm:px-8 lg:px-12">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_8%_12%,rgba(142,112,97,0.14),transparent_36%),radial-gradient(circle_at_92%_8%,rgba(194,150,122,0.16),transparent_34%),linear-gradient(130deg,rgba(255,255,255,0.48),transparent_55%)]"
          />

          <div className="relative grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div className="space-y-4">
              <p className="inline-flex items-center gap-2 rounded-full border border-[#d6c8c0] bg-[#f3eeea] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#725f56]">
                <Layers3 className="h-3.5 w-3.5 text-[#8d7266]" />
                About Dish-Score
              </p>

              <h1 className="max-w-2xl text-4xl leading-tight font-extrabold text-[#2f2520] sm:text-5xl">
                Built to Make Food Discovery
                <span className="block text-[#8d5f4f]">More Honest and Useful</span>
              </h1>

              <p className="max-w-xl text-sm leading-7 text-[#7b6a62] sm:text-base">
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
                  className="h-10 rounded-full border-[#d8ccc5] bg-white px-5 text-[#665650] hover:bg-[#f6f1ee]"
                >
                  <Link href="/contact" className="inline-flex items-center gap-2">
                    Talk to Our Team <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>

            <Card className="rounded-[30px] border-[#e5d7cf] bg-white/95 shadow-[0_28px_44px_-34px_rgba(82,64,56,0.45)]">
              <CardContent className="space-y-4 p-6 sm:p-7">
                <p className="inline-flex items-center gap-2 rounded-full border border-[#eeded4] bg-[#fbf6f2] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#8b6f62]">
                  <Sparkles className="h-3.5 w-3.5 text-[#d08b58]" />
                  What We Optimize For
                </p>

                <div className="space-y-3">
                  <div className="rounded-2xl border border-[#efdfd6] bg-[#fffaf7] p-4">
                    <p className="text-sm font-semibold text-[#4a3c36]">Review quality over quantity</p>
                    <p className="mt-1 text-sm text-[#7a6760]">Detailed, useful feedback gets surfaced above short, low-signal noise.</p>
                  </div>

                  <div className="rounded-2xl border border-[#efdfd6] bg-[#fffaf7] p-4">
                    <p className="text-sm font-semibold text-[#4a3c36]">Context-aware scoring</p>
                    <p className="mt-1 text-sm text-[#7a6760]">Dish-level and restaurant-level insights stay connected so decisions are complete.</p>
                  </div>

                  <div className="rounded-2xl border border-[#efdfd6] bg-[#fffaf7] p-4">
                    <p className="text-sm font-semibold text-[#4a3c36]">Fair visibility for local gems</p>
                    <p className="mt-1 text-sm text-[#7a6760]">Strong quality signals can outperform raw popularity.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="rounded-[34px] border border-[#e4d7cf] bg-[#f8f4f1] p-5 sm:p-7">
          <div className="mb-6">
            <p className="inline-flex items-center gap-2 rounded-full border border-[#ffc7b6] bg-[#fff2eb] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#cf5e39]">
              <HeartHandshake className="h-3.5 w-3.5 text-[#f08f56]" />
              Our Principles
            </p>
            <h2 className="mt-3 text-3xl font-extrabold text-[#2f2420] sm:text-4xl">
              The Standards Behind Every <span className="text-[#ef4c7d]">Score</span>
            </h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {PRINCIPLES.map((principle) => {
              const Icon = principle.icon;

              return (
                <Card
                  key={principle.title}
                  className={`rounded-3xl border bg-gradient-to-br ${principle.tone} shadow-[0_20px_26px_-26px_rgba(100,78,67,0.7)]`}
                >
                  <CardContent className="p-5">
                    <div className="mb-3 inline-flex rounded-xl border border-white/80 bg-white/70 p-2.5 text-[#6d584f]">
                      <Icon className="h-4.5 w-4.5" />
                    </div>
                    <h3 className="text-lg font-bold text-[#362b26]">{principle.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-[#665750]">{principle.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        <section className="rounded-[34px] border border-[#e5dad3] bg-white p-5 sm:p-7">
          <div className="mb-6">
            <p className="inline-flex items-center gap-2 rounded-full border border-[#d8ccc5] bg-[#f8f1ed] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#8b6f62]">
              <Sparkles className="h-3.5 w-3.5 text-[#a8785e]" />
              Journey
            </p>
            <h2 className="mt-3 text-3xl font-extrabold text-[#2f2420] sm:text-4xl">
              How Dish-Score <span className="text-[#8d5f4f]">Evolved</span>
            </h2>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            {TIMELINE.map((item) => (
              <Card key={item.year} className="rounded-3xl border-[#eadfd8] bg-[#fffdfa]">
                <CardContent className="p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#a28679]">{item.year}</p>
                  <h3 className="mt-2 text-lg font-bold text-[#3c312c]">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-[#6f5f59]">{item.detail}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
