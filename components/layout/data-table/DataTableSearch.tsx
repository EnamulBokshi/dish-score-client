import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import { useEffect, useState } from "react";

export interface DataTableSearchProps {
  value: string;
  onSearchChange: (value: string) => void;
  placeholder?: string;
  debounceMs?: number;
}

export default function DataTableSearch({
  value,
  onSearchChange,
  placeholder,
  debounceMs,
}: DataTableSearchProps) {
  const [searchInput, setSearchInput] = useState(value ?? "");

  useEffect(() => {
    setSearchInput(value ?? "");
  }, [value]);

  useEffect(() => {
    const debounceDelay = debounceMs ?? 600;
    const timeout = setTimeout(() => {
      if (searchInput !== value) {
        onSearchChange(searchInput.trim());
      }
    }, debounceDelay);

    return () => clearTimeout(timeout);
  }, [searchInput, value, onSearchChange, debounceMs]);

  return (
    <div className="w-full">
      <div className="relative w-full max-w-md">
        <Search className="pointer-events-none absolute top-1/2 left-2.5 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder={placeholder ?? "Search..."}
          className="pl-8 pr-8"
          aria-label="Search table"
        />
        {(searchInput || value) && (
          <button
            type="button"
            className="absolute top-1/2 right-2 inline-flex h-5 w-5 -translate-y-1/2 items-center justify-center rounded-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            onClick={() => {
              setSearchInput("");
              onSearchChange("");
            }}
            aria-label="Clear search"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}
