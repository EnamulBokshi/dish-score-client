import Link from "next/link";
import { CheckCircle2, Home, MessageSquareText } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function ContactThankYouPage() {
  return (
    <main className="min-h-screen bg-[#f3ebe6] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-4xl">
        <section className="relative overflow-hidden rounded-[40px] border border-[#e4d8d1] bg-[#f9f6f3] px-5 py-12 sm:px-8 lg:px-12">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_14%_10%,rgba(142,112,97,0.14),transparent_36%),radial-gradient(circle_at_88%_12%,rgba(170,134,112,0.14),transparent_35%),linear-gradient(130deg,rgba(255,255,255,0.48),transparent_55%)]"
          />

          <div className="relative mx-auto max-w-2xl space-y-6 text-center">
            <p className="mx-auto inline-flex items-center gap-2 rounded-full border border-[#d6c8c0] bg-[#f3eeea] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#725f56]">
              <MessageSquareText className="h-3.5 w-3.5 text-[#8d7266]" />
              Contact Request Submitted
            </p>

            <div className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-full border border-[#cfe7d6] bg-[#effbf2] text-[#2f7a45]">
              <CheckCircle2 className="h-8 w-8" />
            </div>

            <h1 className="text-4xl leading-tight font-extrabold text-[#2f2520] sm:text-5xl">
              Thank You for Reaching Out
            </h1>

            <p className="text-sm leading-7 text-[#7b6a62] sm:text-base">
              We have received your message. Our support team will review your request and respond within the stated
              support window.
            </p>

            <Card className="rounded-3xl border-[#e5d7cf] bg-white/95">
              <CardContent className="space-y-2 p-5 text-left sm:p-6">
                <p className="text-sm font-semibold text-[#4a3c36]">What happens next</p>
                <p className="text-sm text-[#7a6760]">1. Your request is logged and reviewed by our team.</p>
                <p className="text-sm text-[#7a6760]">2. We reply to the email you provided in the form.</p>
                <p className="text-sm text-[#7a6760]">3. Urgent moderation reports are prioritized for same-day review.</p>
              </CardContent>
            </Card>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
              <Button asChild className="h-10 rounded-full bg-[#6e5a52] px-5 text-white hover:bg-[#5e4c45]">
                <Link href="/">Back to Home</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="h-10 rounded-full border-[#d8ccc5] bg-white px-5 text-[#665650] hover:bg-[#f6f1ee]"
              >
                <Link href="/reviews" className="inline-flex items-center gap-2">
                  Explore Reviews <Home className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
