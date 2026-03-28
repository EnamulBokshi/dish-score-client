import { CalendarDays, Mail, MapPin, Shield, Store, UserRound } from "lucide-react";

import DeleteAccountSection from "@/components/modules/profile/DeleteAccountSection";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getUserInfo } from "@/services/auth.services";

type MeResponse = {
  id?: string;
  name?: string;
  email?: string;
  role?: string;
  status?: string;
  createdAt?: string;
  restaurants?: Array<{
    id: string;
    name: string;
    city?: string;
    state?: string;
    ratingAvg?: number;
  }>;
};

function formatDate(value?: string): string {
  if (!value) {
    return "Unknown";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "Unknown";
  }

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatRole(role?: string): string {
  if (!role) {
    return "Unknown";
  }

  return role
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export default async function MyProfile() {
  const user = (await getUserInfo()) as MeResponse | null;

  if (!user) {
    return (
      <Card className="border-dashed border-muted bg-card/60">
        <CardContent className="py-12 text-center text-muted-foreground">
          Unable to load your profile right now.
        </CardContent>
      </Card>
    );
  }

  const restaurants = Array.isArray(user.restaurants) ? user.restaurants : [];
  const userId = typeof user.id === "string" ? user.id : "";
  const fallbackInitial = user.name?.charAt(0)?.toUpperCase() || "U";

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground md:text-3xl">My Profile</h1>
        <p className="mt-2 text-sm text-muted-foreground md:text-base">
          View your account details and manage account settings.
        </p>
      </div>

      <Card className="border-border bg-card/85">
        <CardHeader>
          <CardTitle>Account Overview</CardTitle>
          <CardDescription>Information loaded from your authenticated profile endpoint.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
              {fallbackInitial}
            </div>
            <div>
              <p className="text-lg font-semibold text-foreground">{user.name || "Unknown User"}</p>
              <p className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                {user.email || "No email"}
              </p>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <Badge variant="secondary" className="inline-flex items-center gap-1.5">
                <Shield className="h-3.5 w-3.5" />
                {formatRole(user.role)}
              </Badge>
              <Badge variant="outline">{(user.status || "UNKNOWN").toUpperCase()}</Badge>
            </div>
          </div>

          <Separator />

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-lg border border-border bg-background/50 p-3">
              <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Member Since</p>
              <p className="mt-1 inline-flex items-center gap-1.5 text-sm font-medium">
                <CalendarDays className="h-4 w-4 text-primary" />
                {formatDate(user.createdAt)}
              </p>
            </div>

            <div className="rounded-lg border border-border bg-background/50 p-3">
              <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Managed Restaurants</p>
              <p className="mt-1 inline-flex items-center gap-1.5 text-sm font-medium">
                <Store className="h-4 w-4 text-primary" />
                {restaurants.length}
              </p>
            </div>

            <div className="rounded-lg border border-border bg-background/50 p-3">
              <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Account ID</p>
              <p className="mt-1 inline-flex items-center gap-1.5 text-sm font-medium">
                <UserRound className="h-4 w-4 text-primary" />
                <span className="truncate">{userId || "Unavailable"}</span>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {restaurants.length > 0 ? (
        <Card className="border-border bg-card/85">
          <CardHeader>
            <CardTitle>My Restaurants</CardTitle>
            <CardDescription>Restaurants associated with your owner profile.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-2">
              {restaurants.map((restaurant) => (
                <div key={restaurant.id} className="rounded-lg border border-border bg-background/50 p-3">
                  <p className="font-medium text-foreground">{restaurant.name}</p>
                  <p className="mt-1 inline-flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5" />
                    {[restaurant.city, restaurant.state].filter(Boolean).join(", ") || "Location unavailable"}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Avg rating: {typeof restaurant.ratingAvg === "number" ? restaurant.ratingAvg.toFixed(2) : "N/A"}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : null}

      <Card className="border-destructive/35 bg-destructive/5">
        <CardHeader>
          <CardTitle className="text-destructive">Danger Zone</CardTitle>
          <CardDescription>
            Permanently remove your own account using the self-delete endpoint.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {userId ? (
            <DeleteAccountSection userId={userId} />
          ) : (
            <p className="text-sm text-muted-foreground">User ID unavailable. Cannot delete account.</p>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
