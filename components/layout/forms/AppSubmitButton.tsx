import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import React from "react";

type AppSubmitButtonProps = {
  isPending: boolean;
  children: React.ReactNode;
  pendingLabel?: string;
  className?: string;
  disabled?: boolean;
};

export default function AppSubmitButton({ 
  isPending,
  children,
  pendingLabel,
  className,
  disabled,
}: AppSubmitButtonProps) {
  return (
    <Button disabled={isPending || disabled} type="submit" className={cn("w-full", className)}>
      {isPending ? (
        <>
          <Loader2 className="mr-2 animate-spin" size={16} aria-hidden="true" />
          {pendingLabel || children}
        </>
      ) : (
        children
      )}
    </Button>
  );
}
