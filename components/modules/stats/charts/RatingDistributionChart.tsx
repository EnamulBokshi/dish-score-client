"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { IRatingBucket } from "@/types/dashboard.type";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

interface RatingDistributionChartProps {
  title: string;
  description: string;
  data: IRatingBucket[];
}

const AXIS_TICK_COLOR = "#c8d0db";
const TOOLTIP_TEXT_COLOR = "#e6edf7";

function EmptyChartState({ title, message }: { title: string; message: string }) {
  return (
    <Card className="border-dashed border-muted bg-card/60">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex h-72 items-center justify-center text-sm text-muted-foreground">
        {message}
      </CardContent>
    </Card>
  );
}

export default function RatingDistributionChart({
  title,
  description,
  data,
}: RatingDistributionChartProps) {
  if (!Array.isArray(data)) {
    return <EmptyChartState title={title} message="Invalid rating chart data." />;
  }

  const formattedData = data.map((item) => ({
    rating: `${Math.max(0, Math.min(5, Math.round(item.rating)))} star`,
    count: Number(item.count) || 0,
  }));

  if (formattedData.length === 0 || formattedData.every((item) => item.count === 0)) {
    return <EmptyChartState title={title} message="No rating distribution available yet." />;
  }

  return (
    <Card className="border-border bg-card/80">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={formattedData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis
              dataKey="rating"
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
              contentStyle={{
                borderRadius: "0.75rem",
                border: "1px solid hsl(var(--border))",
                background: "hsl(var(--card))",
                color: TOOLTIP_TEXT_COLOR,
              }}
              labelStyle={{ color: TOOLTIP_TEXT_COLOR }}
              itemStyle={{ color: TOOLTIP_TEXT_COLOR }}
            />
            <Bar dataKey="count" fill="oklch(0.68 0.19 42)" radius={[8, 8, 0, 0]} maxBarSize={58} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
