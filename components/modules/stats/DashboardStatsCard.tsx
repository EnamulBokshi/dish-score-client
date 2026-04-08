import { createElement } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getIconComponent } from "@/lib/iconsMapper";
import { cn } from "@/lib/utils";

interface StatsCardProps {
    title: string;
    value: string | number;
    iconName: string;
    description?: string;
    className?: string;
}

export default function StatsCard({ title, value, iconName, description, className }: StatsCardProps) {
  return (
        <Card className={cn("border-border bg-card/85 text-foreground transition-shadow hover:shadow-md dark:bg-card/85", className)}>
            <CardHeader className="flex items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                    {title}
        </CardTitle>
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/90 text-primary-foreground shadow-sm">
                    {createElement(getIconComponent(iconName), { className: "h-5 w-5" })}
        </div>
            </CardHeader>
            <CardContent className="space-y-1">
                <div className="text-2xl font-semibold tracking-tight text-foreground">{value}</div>
                {description ? (
                    <p className="mt-1 text-sm text-muted-foreground">
                        {description}
                    </p>
                ) : null}
            </CardContent>
        </Card>
    );
}
