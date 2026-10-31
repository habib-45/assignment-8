"use client";

import * as React from "react";
import { Loader2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

interface GoogleButtonProps {
  label: string;
  disabled?: boolean;
  /** Called when the provider is missing or the handshake fails. */
  onError?: (message: string) => void;
}

/**
 * Google social sign-in.
 *
 * The provider is only registered on the server when GOOGLE_CLIENT_ID /
 * GOOGLE_CLIENT_SECRET are set, so the failure path surfaces a toast instead of
 * an unhandled rejection when the demo runs without credentials.
 */
export function GoogleButton({ label, disabled, onError }: GoogleButtonProps) {
  const [pending, setPending] = React.useState(false);

  async function handleGoogle() {
    if (pending) return;
    setPending(true);
    await authClient.signIn.social(
      {
        provider: "google",
        callbackURL: "/",
        errorCallbackURL: "/login?error=google",
      },
      {
        onSuccess: () => setPending(false),
        onError: ({ error }) => {
          setPending(false);
          onError?.(
            error.message ||
              "Google sign-in needs GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in .env.local before it can complete the handshake."
          );
        },
      }
    );
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="lg"
      className="h-11 w-full font-semibold"
      onClick={handleGoogle}
      disabled={disabled || pending}
    >
      {pending ? (
        <Loader2Icon className="size-4 animate-spin" />
      ) : (
        <svg viewBox="0 0 24 24" aria-hidden className="size-4">
          <path
            fill="currentColor"
            d="M21.35 11.1h-9.17v2.98h5.27c-.23 1.4-1.66 4.1-5.27 4.1-3.17 0-5.76-2.62-5.76-5.86s2.59-5.86 5.76-5.86c1.8 0 3.01.77 3.7 1.43l2.52-2.43C16.79 3.9 14.78 3 12.18 3 7.03 3 2.86 7.17 2.86 12.32s4.17 9.32 9.32 9.32c5.38 0 8.95-3.78 8.95-9.11 0-.61-.07-1.08-.18-1.43Z"
          />
        </svg>
      )}
      {label}
    </Button>
  );
}
