"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef } from "react";
import { SearchIcon, SlidersHorizontalIcon, XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EXPLORE_CATEGORIES, SORT_OPTIONS } from "@/lib/constants";
import { cn } from "cn";

const ALL = "all";

/**
 * Search + category + sort controls backed entirely by the URL, so a filtered
 * Explore page is shareable and survives a reload. Keeps the "no results"
 * state honest because the list component always re-reads the query string.
 */
export function StudioFilters({ className }: { className?: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const search = searchParams.get("search") ?? "";
  const category = searchParams.get("category") ?? "";
  const sort = searchParams.get("sort") ?? "newest";

  const applyParam = useCallback(
    (key: string, value: string) => {
      const next = new URLSearchParams(searchParams.toString());
      if (!value || value === ALL || value === "newest") {
        next.delete(key);
      } else {
        next.set(key, value);
      }
      const qs = next.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [pathname, router, searchParams]
  );

  // Debounce the free-text search so we don't push a navigation per keystroke.
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const onSearchChange = (value: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => applyParam("search", value.trim()), 350);
  };
  const commitSearch = (value: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    applyParam("search", value.trim());
  };
  useEffect(
    () => () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    },
    []
  );

  const hasFilters = Boolean(search) || category !== ALL || sort !== "newest";

  const clearAll = () => {
    router.replace(pathname, { scroll: false });
  };

  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-2xl border bg-card/60 p-4 backdrop-blur-sm md:flex-row md:items-center",
        className
      )}
    >
      <div className="relative flex-1">
        <SearchIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          key={search}
          defaultValue={search}
          placeholder="Search by title, city or amenity…"
          aria-label="Search studios"
          className="rounded-xl pl-9"
          onChange={(event) => onSearchChange(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              commitSearch(event.currentTarget.value);
            }
          }}
          onBlur={(event) => commitSearch(event.currentTarget.value)}
        />
      </div>

      <div className="grid grid-cols-2 gap-3 md:flex md:items-center">
        <Select
          value={category || ALL}
          onValueChange={(value) => applyParam("category", value ?? "")}
        >
          <SelectTrigger className="w-full rounded-xl md:w-44" aria-label="Filter by category">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>All categories</SelectItem>
            {EXPLORE_CATEGORIES.map((c) => (
              <SelectItem key={c.value} value={c.value}>
                {c.plural}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={sort || "newest"} onValueChange={(value) => applyParam("sort", value ?? "newest")}>
          <SelectTrigger className="w-full rounded-xl md:w-48" aria-label="Sort studios">
            <SlidersHorizontalIcon className="size-4 text-muted-foreground" />
            <SelectValue placeholder="Sort" />
          </SelectTrigger>
          <SelectContent>
            {SORT_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {hasFilters ? (
        <Button
          variant="ghost"
          size="sm"
          onClick={clearAll}
          className="rounded-xl text-muted-foreground"
        >
          <XIcon className="size-4" />
          Clear
        </Button>
      ) : null}
    </div>
  );
}
