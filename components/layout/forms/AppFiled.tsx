import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import type { AnyFieldApi } from "@tanstack/react-form";


const getErrorMessage = (error: unknown): string => {
    if (typeof error === "string") return error;
    if (error && typeof error === "object") {
        if ("message" in error && typeof error.message === "string") {
            return error.message;
    }
    }

    return String(error) || "An unknown error occurred";
};


type AppFieldProps = {
    field: AnyFieldApi;
    label: string;
    type?: "text" | "email" | "password" | "number" | "date" | "time";
    placeholder?: string;
    disabled?: boolean;
    append?: React.ReactNode;
    prepend?: React.ReactNode;
    className?: string;
    externalError?: string;
};




const AppField = ({
    field,
    label,
    type = "text",
    placeholder,
    disabled = false,
    append,
    prepend,
    className,
    externalError,
}: AppFieldProps) => {
    const clientError =
        field.state.meta.isTouched && field.state.meta.errors.length > 0
            ? getErrorMessage(field.state.meta.errors[0])
            : null;
    const firstError = clientError || externalError || null;
    const hasError = firstError !== null;

    return (
        <div className={cn("space-y-1.5", className)}>
            <Label
                htmlFor={field.name}
                className={cn(
                    hasError && "text-destructive",
                    "font-medium",
                    disabled && "cursor-not-allowed opacity-50"
                )}
            >
                {label}
            </Label>

            <div className="relative">
                {prepend && (
                    <div className="pointer-events-none absolute inset-y-0 left-0 z-10 flex items-center pl-3">
                        {prepend}
                    </div>
                )}
                <Input
                    id={field.name}
                    name={field.name}
                    type={type}
                    value={field.state.value}
                    placeholder={placeholder}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    aria-invalid={hasError}
                    aria-describedby={hasError ? `${field.name}-error` : undefined}
                    disabled={disabled}
                    className={cn(
                        prepend && "pl-10",
                        append && "pr-10",
                        hasError && "border-destructive focus:ring-destructive focus-visible:ring-destructive/20"
                    )}
                />

                {append && (
                    <div className="pointer-events-none absolute inset-y-0 right-0 z-10 flex items-center pr-3">
                        {append}
                    </div>
                )}
            </div>

            {hasError && (
                <p id={`${field.name}-error`} role="alert" className="mt-1 text-sm text-destructive">
                    {firstError}
                </p>
            )}
        </div>
    );
};


export default AppField;