"use client";

import { format } from "date-fns";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { IMonthlyCountItem } from "@/types/dashboard.type";

interface MonthlyTrendChartProps {
  title: string;
  description: string;
  data: IMonthlyCountItem[];
  color?: string;
}

const AXIS_TICK_COLOR = "#c8d0db";
const TOOLTIP_TEXT_COLOR = "#e6edf7";

function toMonthLabel(monthKey: string): string {
  const isoMonth = `${monthKey}-01`;
  const date = new Date(isoMonth);

  if (Number.isNaN(date.getTime())) {
    return monthKey;
  }

  return format(date, "MMM yy");
}

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

export default function MonthlyTrendChart({
  title,
  description,
  data,
  color = "oklch(0.62 0.18 258)",
}: MonthlyTrendChartProps) {
  if (!Array.isArray(data)) {
    return <EmptyChartState title={title} message="Invalid monthly chart data." />;
  }

  const formattedData = data.map((item) => ({
    month: toMonthLabel(item.month),
    count: Number(item.count) || 0,
  }));

  if (formattedData.length === 0 || formattedData.every((item) => item.count === 0)) {
    return <EmptyChartState title={title} message="No monthly trend data available." />;
  }

  return (
    <Card className="border-border bg-card/80">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={formattedData}>
            <defs>
              <linearGradient id={`gradient-${title.replace(/\s+/g, "-").toLowerCase()}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.45} />
                <stop offset="95%" stopColor={color} stopOpacity={0.03} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis
              dataKey="month"
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
            <Area
              type="monotone"
              dataKey="count"
              stroke={color}
              fillOpacity={1}
              fill={`url(#gradient-${title.replace(/\s+/g, "-").toLowerCase()})`}
              strokeWidth={2.2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
