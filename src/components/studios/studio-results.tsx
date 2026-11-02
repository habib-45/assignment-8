"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ApiError } from "@/lib/api";
import { fetchStudios } from "@/lib/studio-api";
import { CATEGORY_LABELS } from "@/lib/constants";
import type { Studio } from "@/lib/types";
import { StudioCard } from "@/components/studios/studio-card";
import { StudioGridSkeleton } from "@/components/shared/skeletons";
import {
  ResultsEmpty,
  ResultsError,
} from "@/components/studios/results-state";
import { CompassIcon } from "lucide-react";

interface StudioResultsProps {
  /** Extra studios (e.g. the current user's) merged in before dedupe. */
  extraStudios?: Studio[];
}

/** Applies the active `?search=&category=&sort=` to an in-memory list. */
function applyQuery(
  studios: Studio[],
  search: string,
  category: string,
  sort: string
): Studio[] {
  const needle = search.trim().toLowerCase();

  const filtered = studios.filter((studio) => {
    if (category && studio.category !== category) return false;
    if (!needle) return true;

    const haystack = [
      studio.title,
      studio.location,
      studio.overview,
      ...studio.amenities,
      CATEGORY_LABELS[studio.category] ?? "",
    ]
      .join(" ")
      .toLowerCase();

    return haystack.includes(needle);
  });

  const sorted = [...filtered];
  switch (sort) {
    case "rating":
      return sorted.sort((a, b) => b.rating - a.rating);
    case "price-asc":
      return sorted.sort((a, b) => a.hourlyRate - b.hourlyRate);
    case "price-desc":
      return sorted.sort((a, b) => b.hourlyRate - a.hourlyRate);
    default:
      return sorted.sort(
        (a, b) => +new Date(b.createdAt) - +new Date(a.createdAt)
      );
  }
}

/**
 * Renders the studio grid for the current `?search=&category=&sort=` query
 * string. The feed itself is a flat list, so filtering and sorting happen
 * client-side; keying off `useSearchParams` means back/forward navigation and
 * reloads always show the right slice.
 */
export function StudioResults({ extraStudios = [] }: StudioResultsProps) {
  const searchParams = useSearchParams();
  const search = searchParams.get("search") ?? "";
  const category = searchParams.get("category") ?? "";
  const sort = searchParams.get("sort") ?? "newest";

  const [studios, setStudios] = useState<Studio[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [message, setMessage] = useState("");
  const requestRef = useRef(0);

  const load = useCallback(async () => {
    const id = ++requestRef.current;
    setStatus("loading");
    try {
      const data = await fetchStudios();
      if (id !== requestRef.current) return; // stale response
      setStudios(data);
      setStatus("ready");
    } catch (error) {
      if (id !== requestRef.current) return;
      setMessage(
        error instanceof ApiError
          ? error.message
          : "We couldn't load studios right now."
      );
      setStatus("error");
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const merged = useMemo(() => {
    // Injected listings (e.g. "my listings") skip the feed; dedupe by id so a
    // studio the user just created never shows up twice.
    const seen = new Set(studios.map((s) => s._id));
    const combined = [
      ...studios,
      ...extraStudios.filter((s) => !seen.has(s._id)),
    ];
    return applyQuery(combined, search, category, sort);
  }, [studios, extraStudios, search, category, sort]);

  if (status === "loading") {
    return <StudioGridSkeleton count={6} />;
  }

  if (status === "error") {
    return <ResultsError message={message} onRetry={load} />;
  }

  if (merged.length === 0) {
    const filtered = Boolean(search) || Boolean(category);
    return (
      <ResultsEmpty
        icon={CompassIcon}
        title={filtered ? "No studios match those filters" : "No studios yet"}
        description={
          filtered
            ? "Try a different category or clear your filters — new spaces are added daily."
            : "Be the first to list a workspace in this category and start earning."
        }
        action={
          filtered
            ? { label: "Clear filters", href: "/studios" }
            : { label: "Add a studio", href: "/add-studio" }
        }
      />
    );
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {merged.map((studio) => (
        <StudioCard key={studio._id} studio={studio} />
      ))}
    </div>
  );
}
