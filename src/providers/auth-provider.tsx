"use client";

import * as React from "react";
import { authClient } from "@/lib/auth-client";
import { ensureApiToken } from "@/lib/api";
import type { SessionUser } from "@/lib/types";

interface AuthContextValue {
  user: SessionUser | null;
  /** True while the initial session lookup is still running. */
  loading: boolean;
  refresh: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = React.createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data, isPending, refetch } = authClient.useSession();
  const sessionUser = data?.user;

  const user: SessionUser | null = sessionUser
    ? {
        id: sessionUser.id,
        name: sessionUser.name,
        email: sessionUser.email,
        image: sessionUser.image ?? undefined,
      }
    : null;

  const userId = user?.id;

  // Keep the bridged HTTPOnly JWT cookie fresh whenever a session exists so
  // protected API calls (add studio, bookings, ...) are always authorized.
  React.useEffect(() => {
    if (userId) {
      void ensureApiToken();
    }
  }, [userId]);

  const logout = React.useCallback(async () => {
    await fetch("/api/auth/token", { method: "DELETE", credentials: "include" });
    await authClient.signOut();
    await refetch();
  }, [refetch]);

  const value = React.useMemo(
    () => ({ user, loading: isPending, refresh: refetch, logout }),
    [user, isPending, refetch, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside <AuthProvider>");
  }
  return context;
}
