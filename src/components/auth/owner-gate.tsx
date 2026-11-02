"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ShieldAlertIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/empty-state";
import { LoadingScreen } from "@/components/shared/skeletons";
import { useAuth } from "@/providers/auth-provider";
import type { Studio } from "@/lib/types";

/**
 * Guards a listing-specific screen (edit form) so only the host who owns the
 * document can change it. The API enforces the same rule server-side — this
 * gate just turns a 403 into a friendly explanation instead of a dead form.
 */
export function OwnerGate({
  studio,
  children,
}: {
  studio: Studio;
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  if (loading) {
    return <LoadingScreen label="Checking listing permissions…" />;
  }

  const owner = studio.host.email.toLowerCase();
  const signedInAs = user?.email.toLowerCase();

  if (!signedInAs || signedInAs !== owner) {
    return (
      <EmptyState
        icon={ShieldAlertIcon}
        title="This listing belongs to another host"
        description={
          signedInAs
            ? `Only ${studio.host.email} can edit this studio. Open your own listings to make changes.`
            : "Sign in as the host of this studio to edit it."
        }
        action={
          <div className="flex flex-wrap justify-center gap-3">
            <Button
              className="rounded-xl font-semibold"
              onClick={() => router.push("/my-listings")}
            >
              Go to my listings
            </Button>
            <Button
              variant="outline"
              className="rounded-xl font-semibold"
              onClick={() => router.push(`/studios/${studio._id}`)}
            >
              View the listing
            </Button>
          </div>
        }
      />
    );
  }

  return <>{children}</>;
}
