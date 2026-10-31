"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/auth-provider";
import { LoadingScreen } from "@/components/shared/skeletons";

/**
 * Client-side guard for private routes.
 *
 * The session lives in an HTTPOnly cookie, so a reload of any private route
 * resolves the user again — a signed-in visitor is never bounced to /login.
 * Anonymous visitors are redirected with a `redirect` param so they return to
 * the page they wanted after signing in.
 */
export function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [redirecting, setRedirecting] = React.useState(false);

  React.useEffect(() => {
    if (loading || user) return;
    setRedirecting(true);
    const target = window.location.pathname + window.location.search;
    router.replace(`/login?redirect=${encodeURIComponent(target)}`);
  }, [loading, user, router]);

  if (loading || !user || redirecting) {
    return <LoadingScreen label="Checking your session…" />;
  }

  return <>{children}</>;
}
