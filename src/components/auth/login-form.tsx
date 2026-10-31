"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { EyeIcon, EyeOffIcon, Loader2Icon, LogInIcon } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/providers/auth-provider";
import { authClient } from "@/lib/auth-client";
import { GoogleButton } from "@/components/auth/google-button";

/** Turns Better Auth / fetch errors into a sentence a human can act on. */
function describeError(error: unknown): string {
  const message =
    typeof error === "object" && error && "message" in error
      ? String((error as { message?: unknown }).message)
      : String(error ?? "");
  const lower = message.toLowerCase();
  if (lower.includes("invalid") || lower.includes("credential")) {
    return "That email and password combination doesn't match an account.";
  }
  if (lower.includes("rate") || lower.includes("too many")) {
    return "Too many attempts. Please wait a moment and try again.";
  }
  if (lower.includes("fetch") || lower.includes("network")) {
    return "We couldn't reach the auth service. Please try again in a second.";
  }
  return message || "Sign in failed. Please try again.";
}

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading: sessionPending, refresh } = useAuth();

  const redirectTo = searchParams.get("redirect") || "/";
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);

  const pending = submitting || sessionPending;

  // Already signed in (e.g. opened /login from the navbar) → leave immediately.
  React.useEffect(() => {
    if (!sessionPending && user) router.replace(redirectTo);
  }, [sessionPending, user, redirectTo, router]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;

    if (!email.trim() || !password) {
      toast.error("Missing credentials", {
        description: "Enter the email and password for your StudioSpace account.",
      });
      return;
    }

    setSubmitting(true);
    const { error } = await authClient.signIn.email({
      email: email.trim(),
      password,
      rememberMe: true,
    });

    if (error) {
      setSubmitting(false);
      toast.error("Sign in failed", { description: describeError(error) });
      return;
    }

    await refresh();
    setSubmitting(false);
    toast.success("Welcome back!", {
      description: "Your session is active and your bookings are ready.",
    });
    router.replace(redirectTo);
    router.refresh();
  }

  function handleForgotPassword() {
    toast.info("Password reset isn't enabled yet", {
      description:
        "Email delivery isn't configured for this demo. Contact the studio host or use the Google sign-in option instead.",
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
      <div className="flex flex-col gap-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@studio.com"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
          className="h-11"
        />
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password">Password</Label>
          <button
            type="button"
            onClick={handleForgotPassword}
            className="text-xs font-medium text-muted-foreground underline-offset-4 transition hover:text-primary hover:underline"
          >
            Forgot password?
          </button>
        </div>
        <div className="relative">
          <Input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            placeholder="••••••••"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            className="h-11 pr-11"
          />
          <button
            type="button"
            onClick={() => setShowPassword((visible) => !visible)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-muted-foreground transition hover:text-foreground"
          >
            {showPassword ? (
              <EyeOffIcon className="size-4" />
            ) : (
              <EyeIcon className="size-4" />
            )}
          </button>
        </div>
      </div>

      <Button
        type="submit"
        size="lg"
        className="h-11 w-full font-semibold"
        disabled={submitting}
      >
        {submitting ? (
          <>
            <Loader2Icon className="size-4 animate-spin" />
            Signing you in…
          </>
        ) : (
          <>
            <LogInIcon className="size-4" />
            Login
          </>
        )}
      </Button>

      <GoogleButton
        label="Continue with Google"
        disabled={pending}
        onError={(message) =>
          toast.error("Google sign-in unavailable", { description: message })
        }
      />

      <p className="text-center text-sm text-muted-foreground">
        New to StudioSpace?{" "}
        <Link
          href={`/register${redirectTo !== "/" ? `?redirect=${encodeURIComponent(redirectTo)}` : ""}`}
          className="font-semibold text-primary underline-offset-4 hover:underline"
        >
          Create an account
        </Link>
      </p>
    </form>
  );
}
