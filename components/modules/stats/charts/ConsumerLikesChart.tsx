"use client";

import { format } from "date-fns";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { IConsumerLikeWiseReviewItem } from "@/types/dashboard.type";

interface ConsumerLikesChartProps {
  data: IConsumerLikeWiseReviewItem[];
}

const AXIS_TICK_COLOR = "#c8d0db";
const TOOLTIP_TEXT_COLOR = "#e6edf7";

function EmptyChartState({ message }: { message: string }) {
  return (
    <Card className="border-dashed border-muted bg-card/60">
      <CardHeader>
        <CardTitle>Likes Per Review</CardTitle>
      </CardHeader>
      <CardContent className="flex h-72 items-center justify-center text-sm text-muted-foreground">
        {message}
      </CardContent>
    </Card>
  );
}

export default function ConsumerLikesChart({ data }: ConsumerLikesChartProps) {
  if (!Array.isArray(data)) {
    return <EmptyChartState message="Invalid likes chart data." />;
  }

  const formattedData = data
    .slice()
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
    .slice(-12)
    .map((item, index) => {
      const createdAtDate = new Date(item.createdAt);
      const label = Number.isNaN(createdAtDate.getTime())
        ? `Review ${index + 1}`
        : format(createdAtDate, "MMM d");

      return {
        reviewLabel: label,
        likes: Number(item.likeCount) || 0,
        rating: Number(item.rating) || 0,
      };
    });

  if (formattedData.length === 0 || formattedData.every((item) => item.likes === 0)) {
    return <EmptyChartState message="No likes yet on your reviews." />;
  }

  return (
    <Card className="border-border bg-card/80">
      <CardHeader>
        <CardTitle>Likes Per Review</CardTitle>
        <CardDescription>How many helpful votes your recent reviews have received.</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={formattedData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis
              dataKey="reviewLabel"
              tickLine={false}
              axisLine={false}
              tick={{ fill: AXIS_TICK_COLOR, fontSize: 12 }}
            />
            <YAxis
              allowDecimals={false}
              tickLine={false}
              axisLine={false}
              tick={{ fill: AXIS_TICK_COLOR, fontSize: 12 }}
            />
            <Tooltip
              cursor={false}
              formatter={(value, name, item) => {
                if (name === "likes") {
                  return [`${value} likes`, "Helpful votes"];
                }

                if (name === "rating") {
                  return [`${value}`, "Rating"];
                }

                return [String(value), String(name)];
              }}
              contentStyle={{
                borderRadius: "0.75rem",
                border: "1px solid hsl(var(--border))",
                background: "hsl(var(--card))",
                color: TOOLTIP_TEXT_COLOR,
              }}
              labelStyle={{ color: TOOLTIP_TEXT_COLOR }}
              itemStyle={{ color: TOOLTIP_TEXT_COLOR }}
              labelFormatter={(label, payload) => {
                const point = payload?.[0]?.payload as { rating?: number } | undefined;
                const ratingPart = point?.rating ? ` - Rating ${point.rating.toFixed(1)}` : "";
                return `${label}${ratingPart}`;
              }}
            />
            <Bar dataKey="likes" fill="oklch(0.74 0.18 86)" radius={[8, 8, 0, 0]} maxBarSize={56} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
