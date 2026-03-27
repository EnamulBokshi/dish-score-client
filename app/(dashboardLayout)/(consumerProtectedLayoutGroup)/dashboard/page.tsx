import Link from "next/link";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const quickLinks = [
  { label: "Browse Restaurants", href: "/dashboard/restaurants" },
  { label: "Explore Dishes", href: "/dashboard/dishes" },
  { label: "My Reviews", href: "/dashboard/my-reviews" },
];

export default function ConsumerDashboardPage() {
  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground md:text-3xl">
          Welcome to your <span className="text-neon-orange">Dashboard</span>
        </h1>
        <p className="mt-2 text-sm text-muted-foreground md:text-base">
          Jump back into your food journey with quick access to restaurants, dishes, and your reviews.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {quickLinks.map((item) => (
          <Card key={item.href} className="border-dark-border bg-card/80 transition-colors hover:border-neon-orange/50">
            <CardHeader>
              <CardTitle className="text-base text-foreground">{item.label}</CardTitle>
            </CardHeader>
            <CardContent>
              <Link href={item.href} className="text-sm font-medium text-neon-gold hover:text-neon-orange">
                Open
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
