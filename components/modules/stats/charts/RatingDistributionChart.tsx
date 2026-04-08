"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { IRatingBucket } from "@/types/dashboard.type";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useTheme } from "next-themes";

interface RatingDistributionChartProps {
  title: string;
  description: string;
  data: IRatingBucket[];
}

function EmptyChartState({ title, message }: { title: string; message: string }) {
  return (
    <Card className="border-dashed border-border bg-card/70 text-foreground">
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
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const axisTickColor = isDark ? "#c8d0db" : "#6b5b53";
  const tooltipTextColor = isDark ? "#e6edf7" : "#201611";

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
    <Card className="border-border bg-card/85 text-foreground">
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
              tick={{ fill: axisTickColor, fontSize: 12 }}
            />
            <YAxis
              allowDecimals={false}
              tickLine={false}
              axisLine={false}
              tick={{ fill: axisTickColor, fontSize: 12 }}
            />
            <Tooltip
              cursor={false}
              contentStyle={{
                borderRadius: "0.75rem",
                border: "1px solid hsl(var(--border))",
                background: "hsl(var(--card))",
                color: tooltipTextColor,
              }}
              labelStyle={{ color: tooltipTextColor }}
              itemStyle={{ color: tooltipTextColor }}
            />
            <Bar dataKey="count" fill="oklch(0.68 0.19 42)" radius={[8, 8, 0, 0]} maxBarSize={58} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
