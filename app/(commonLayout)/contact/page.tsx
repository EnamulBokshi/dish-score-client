import Link from "next/link";
import {
  ArrowRight,
  Clock3,
  Mail,
  MapPin,
  MessageSquareText,
  Phone,
  Send,
  Sparkles,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const CONTACT_CHANNELS = [
  {
    title: "Email Support",
    value: "support@dishscore.app",
    detail: "For account, reviews, and technical support",
    href: "mailto:support@dishscore.app",
    icon: Mail,
    tone: "border-[#f0dacc] bg-[#fff7f1]",
  },
  {
    title: "Partnership Desk",
    value: "partners@dishscore.app",
    detail: "For restaurant and growth partnerships",
    href: "mailto:partners@dishscore.app",
    icon: Sparkles,
    tone: "border-[#e7d8ef] bg-[#faf5ff]",
  },
  {
    title: "Call Us",
    value: "+1 (555) 217-9400",
    detail: "Mon-Fri, 9:00 AM to 6:00 PM",
    href: "tel:+15552179400",
    icon: Phone,
    tone: "border-[#d7e7dd] bg-[#f4fff7]",
  },
];

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[#f3ebe6] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-7xl space-y-8">
        <section className="relative overflow-hidden rounded-[40px] border border-[#e4d8d1] bg-[#f9f6f3] px-5 py-10 sm:px-8 lg:px-12">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_8%_12%,rgba(142,112,97,0.14),transparent_36%),radial-gradient(circle_at_92%_8%,rgba(208,153,120,0.16),transparent_34%),linear-gradient(130deg,rgba(255,255,255,0.48),transparent_55%)]"
          />

          <div className="relative grid gap-8 lg:grid-cols-[1fr_1fr] lg:items-center">
            <div className="space-y-4">
              <p className="inline-flex items-center gap-2 rounded-full border border-[#d6c8c0] bg-[#f3eeea] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#725f56]">
                <MessageSquareText className="h-3.5 w-3.5 text-[#8d7266]" />
                Contact Dish-Score
              </p>

              <h1 className="max-w-2xl text-4xl leading-tight font-extrabold text-[#2f2520] sm:text-5xl">
                Let’s Talk About
                <span className="block text-[#8d5f4f]">Reviews, Products, and Growth</span>
              </h1>

              <p className="max-w-xl text-sm leading-7 text-[#7b6a62] sm:text-base">
                Reach out for support, partnerships, or platform feedback. We treat every message as a chance
                to improve the quality of food discovery for everyone.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Button asChild className="h-10 rounded-full bg-[#6e5a52] px-5 text-white hover:bg-[#5e4c45]">
                  <Link href="mailto:support@dishscore.app">Email Support</Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="h-10 rounded-full border-[#d8ccc5] bg-white px-5 text-[#665650] hover:bg-[#f6f1ee]"
                >
                  <Link href="/about" className="inline-flex items-center gap-2">
                    Learn More About Us <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>

            <Card className="rounded-[30px] border-[#e5d7cf] bg-white/95 shadow-[0_28px_44px_-34px_rgba(82,64,56,0.45)]">
              <CardContent className="space-y-4 p-6 sm:p-7">
                <p className="inline-flex items-center gap-2 rounded-full border border-[#eeded4] bg-[#fbf6f2] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#8b6f62]">
                  <Clock3 className="h-3.5 w-3.5 text-[#d08b58]" />
                  Response Window
                </p>

                <div className="rounded-2xl border border-[#efdfd6] bg-[#fffaf7] p-4">
                  <p className="text-sm font-semibold text-[#4a3c36]">General inquiries</p>
                  <p className="mt-1 text-sm text-[#7a6760]">Within 24 hours on business days</p>
                </div>

                <div className="rounded-2xl border border-[#efdfd6] bg-[#fffaf7] p-4">
                  <p className="text-sm font-semibold text-[#4a3c36]">Partnership requests</p>
                  <p className="mt-1 text-sm text-[#7a6760]">Within 2 business days</p>
                </div>

                <div className="rounded-2xl border border-[#efdfd6] bg-[#fffaf7] p-4">
                  <p className="text-sm font-semibold text-[#4a3c36]">Urgent moderation reports</p>
                  <p className="mt-1 text-sm text-[#7a6760]">Prioritized same day review</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <Card className="rounded-[34px] border border-[#e4d7cf] bg-[#f8f4f1]">
            <CardContent className="p-5 sm:p-7">
              <div className="mb-6">
                <p className="inline-flex items-center gap-2 rounded-full border border-[#ffc7b6] bg-[#fff2eb] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#cf5e39]">
                  <Send className="h-3.5 w-3.5 text-[#f08f56]" />
                  Send a Message
                </p>
                <h2 className="mt-3 text-3xl font-extrabold text-[#2f2420] sm:text-4xl">
                  We’d Love to Hear Your <span className="text-[#ef4c7d]">Feedback</span>
                </h2>
              </div>

              <form className="grid gap-4" action="mailto:support@dishscore.app" method="post" encType="text/plain">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <label htmlFor="name" className="text-xs font-semibold uppercase tracking-[0.16em] text-[#9f7b6d]">
                      Full Name
                    </label>
                    <Input id="name" name="name" placeholder="Your name" className="h-11 border-[#ead9d1] bg-white" />
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="email" className="text-xs font-semibold uppercase tracking-[0.16em] text-[#9f7b6d]">
                      Email Address
                    </label>
                    <Input id="email" name="email" type="email" placeholder="you@example.com" className="h-11 border-[#ead9d1] bg-white" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="subject" className="text-xs font-semibold uppercase tracking-[0.16em] text-[#9f7b6d]">
                    Subject
                  </label>
                  <Input id="subject" name="subject" placeholder="How can we help?" className="h-11 border-[#ead9d1] bg-white" />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="message" className="text-xs font-semibold uppercase tracking-[0.16em] text-[#9f7b6d]">
                    Message
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    placeholder="Share your feedback, issue, or idea..."
                    className="min-h-36 border-[#ead9d1] bg-white"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <Button type="submit" className="h-10 rounded-full bg-[#6e5a52] px-5 text-white hover:bg-[#5e4c45]">
                    Submit Message
                  </Button>
                  <p className="text-xs text-[#8b756c]">Submitting opens your email client with the message details.</p>
                </div>
              </form>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="rounded-[34px] border border-[#e5dad3] bg-white">
              <CardContent className="space-y-4 p-5 sm:p-6">
                <h3 className="text-xl font-bold text-[#2f2520]">Direct Channels</h3>
                <div className="space-y-3">
                  {CONTACT_CHANNELS.map((channel) => {
                    const Icon = channel.icon;

                    return (
                      <Link
                        key={channel.title}
                        href={channel.href}
                        className={`block rounded-2xl border p-4 transition hover:-translate-y-0.5 ${channel.tone}`}
                      >
                        <p className="inline-flex items-center gap-2 text-sm font-semibold text-[#4e3f38]">
                          <Icon className="h-4 w-4" />
                          {channel.title}
                        </p>
                        <p className="mt-1 text-sm font-semibold text-[#2f2520]">{channel.value}</p>
                        <p className="mt-1 text-xs text-[#786761]">{channel.detail}</p>
                      </Link>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-[34px] border border-[#e5dad3] bg-white">
              <CardContent className="space-y-3 p-5 sm:p-6">
                <h3 className="text-xl font-bold text-[#2f2520]">Office Location</h3>
                <p className="inline-flex items-center gap-2 text-sm text-[#6c5c55]">
                  <MapPin className="h-4 w-4 text-[#8d5f4f]" />
                  214 Orchard Avenue, Food District, NY 10011
                </p>
                <div className="rounded-2xl border border-[#eadfd8] bg-[#faf6f3] p-4">
                  <p className="text-xs uppercase tracking-[0.16em] text-[#9d8377]">Business Hours</p>
                  <p className="mt-1 text-sm text-[#5d4d47]">Monday to Friday: 9:00 AM - 6:00 PM</p>
                  <p className="text-sm text-[#5d4d47]">Saturday: 10:00 AM - 2:00 PM</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </main>
  );
}
