"use client";

import * as React from "react";
import { toast } from "sonner";
import { fetchSavedStudios, saveStudio, unsaveStudio } from "@/lib/bookings-api";
import type { Studio } from "@/lib/types";
import { useAuth } from "@/providers/auth-provider";

interface WishlistContextValue {
  /** Studio ids the signed-in user has hearted (kept optimistic). */
  ids: Set<string>;
  /** Full saved studios — used by the dashboard's wishlist section. */
  studios: Studio[];
  loading: boolean;
  /** Id of the studio currently being toggled, so only that heart spins. */
  busyId: string | null;
  /** Optimistic toggle; resolves to the resulting "saved" flag. */
  toggle: (studioId: string, title: string) => Promise<boolean>;
  isSaved: (studioId: string) => boolean;
}

const WishlistContext = React.createContext<WishlistContextValue | null>(null);

/**
 * Shared wishlist state so every heart on every card stays in sync.
 *
 * The API scopes rows to the JWT's email, so this loads once per session and
 * applies changes optimistically — a failed request rolls the heart back and
 * reports the error through a toast.
 */
export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [studios, setStudios] = React.useState<Studio[]>([]);
  const [ids, setIds] = React.useState<Set<string>>(() => new Set());
  const [loading, setLoading] = React.useState(false);
  const [busyId, setBusyId] = React.useState<string | null>(null);

  const email = user?.email;

  const refresh = React.useCallback(async () => {
    try {
      const data = await fetchSavedStudios();
      setStudios(data);
      setIds(new Set(data.map((studio) => studio._id)));
      return data;
    } catch {
      return null;
    }
  }, []);

  React.useEffect(() => {
    let cancelled = false;

    if (!email) {
      setStudios([]);
      setIds(new Set());
      return;
    }

    setLoading(true);
    refresh().finally(() => {
      if (!cancelled) setLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, [email, refresh]);

  const toggle = React.useCallback(
    async (studioId: string, title: string) => {
      const saved = ids.has(studioId);
      const previousIds = new Set(ids);

      setBusyId(studioId);
      setIds((current) => {
        const next = new Set(current);
        if (saved) next.delete(studioId);
        else next.add(studioId);
        return next;
      });

      try {
        if (saved) await unsaveStudio(studioId);
        else await saveStudio(studioId);

        // Re-sync the full list so the dashboard grid matches the ids.
        await refresh();
        toast.success(saved ? "Removed from wishlist" : "Saved to wishlist", {
          description: title,
        });
        return !saved;
      } catch {
        setIds(previousIds); // the heart never lies
        toast.error(saved ? "Couldn't update your wishlist" : "Couldn't save studio", {
          description: "Check your connection and try once more.",
        });
        return saved;
      } finally {
        setBusyId(null);
      }
    },
    [ids, refresh]
  );

  const value = React.useMemo(
    () => ({
      ids,
      studios,
      loading,
      busyId,
      toggle,
      isSaved: (studioId: string) => ids.has(studioId),
    }),
    [ids, studios, loading, busyId, toggle]
  );

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist(): WishlistContextValue {
  const context = React.useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used inside <WishlistProvider>");
  }
  return context;
}
