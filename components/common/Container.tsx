import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ResponsiveContainerProps {
  children: ReactNode;
  className?: string;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "full";
}

const maxWidthClasses = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-2xl",
  "2xl": "max-w-4xl",
  full: "max-w-full",
};

/**
 * Responsive container with consistent padding and max-width
 */
export function ResponsiveContainer({
  children,
  className,
  maxWidth = "2xl",
}: ResponsiveContainerProps) {
  return (
    <div
      className={cn(
        "mx-auto px-6 md:px-8 lg:px-12 w-full",
        maxWidthClasses[maxWidth],
        className
      )}
    >
      {children}
    </div>
  );
}

interface PageContainerProps {
  children: ReactNode;
  className?: string;
}

/**
 * Full-page container with min height and dark background
 */
export function PageContainer({ children, className }: PageContainerProps) {
  return (
    <div className={cn("min-h-screen bg-dark-bg", className)}>
      {children}
    </div>
  );
}

interface SectionProps {
  children: ReactNode;
  className?: string;
  variant?: "default" | "highlight" | "muted";
}

/**
 * Section container with optional background variants
 */
export function Section({
  children,
  className,
  variant = "default",
}: SectionProps) {
  const variantClass = {
    default: "bg-dark-bg",
    highlight: "bg-gradient-dark border-t border-b border-dark-border",
    muted: "bg-dark-card/50",
  }[variant];

  return (
    <section className={cn("py-12 md:py-16", variantClass)}>
      <ResponsiveContainer className={className}>
        {children}
      </ResponsiveContainer>
    </section>
  );
}
