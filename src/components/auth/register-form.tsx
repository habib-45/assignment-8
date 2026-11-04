
"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

import {
  CheckIcon,
  CircleIcon,
  EyeIcon,
  EyeOffIcon,
  Loader2Icon,
  UserPlusIcon,
} from "lucide-react";

import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { authClient } from "@/lib/auth-client";
import { PASSWORD_RULES } from "@/lib/password-rules";
import { GoogleButton } from "@/components/auth/google-button";

function describeError(error: unknown): string {
  const code =
    typeof error === "object" && error && "code" in error
      ? String((error as { code?: unknown }).code)
      : "";

  const message =
    typeof error === "object" && error && "message" in error
      ? String((error as { message?: unknown }).message)
      : String(error ?? "");

  if (
    code === "INVALID_PASSWORD" ||
    message.toLowerCase().includes("password")
  ) {
    return message || "That password doesn't meet the StudioSpace policy.";
  }

  if (
    message.toLowerCase().includes("already") ||
    code === "USER_ALREADY_EXISTS"
  ) {
    return "An account already exists for that email. Try signing in instead.";
  }

  if (message.toLowerCase().includes("email")) {
    return message;
  }

  return message || "Registration failed. Please try again.";
}

export function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const redirectTo = searchParams.get("redirect") || "/";

  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [photoUrl, setPhotoUrl] = React.useState("");
  const [password, setPassword] = React.useState("");

  const [showPassword, setShowPassword] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);

  const rules = PASSWORD_RULES.map((rule) => ({
    ...rule,
    passed: rule.test(password),
  }));

  const allRulesPassed = rules.every((rule) => rule.passed);

  const photoLooksValid =
    photoUrl.trim() === "" ||
    /^https?:\/\/\S+\.\S+/i.test(photoUrl.trim());

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (submitting) return;

    if (!name.trim() || !email.trim() || !password) {
      toast.error("Fill in the required fields", {
        description:
          "Name, email and password are needed to create your account.",
      });

      return;
    }

    if (!allRulesPassed) {
      toast.error("Password too weak", {
        description:
          "Meet all three password rules before creating the account.",
      });

      return;
    }

    if (!photoLooksValid) {
      toast.error("Check the photo URL", {
        description:
          "Use a full link starting with http:// or https://.",
      });

      return;
    }

    setSubmitting(true);

    try {
      const { error } = await authClient.signUp.email({
        name: name.trim(),
        email: email.trim(),
        password,
        image: photoUrl.trim() || undefined,
      });

      if (error) {
        toast.error("Registration failed", {
          description: describeError(error),
        });

        return;
      }

      toast.success("Account created successfully", {
        description:
          "Your account is ready. You can now sign in.",
      });

      router.replace("/login");
      router.refresh();
    } catch (error) {
      toast.error("Registration failed", {
        description: describeError(error),
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-5"
      noValidate
    >
      {/* Full Name */}

      <div className="flex flex-col gap-2">
        <Label htmlFor="name">Full name</Label>

        <Input
          id="name"
          name="name"
          autoComplete="name"
          placeholder="Ava Moreno"
          value={name}
          onChange={(event) => setName(event.target.value)}
          required
          className="h-11"
        />
      </div>

      {/* Email */}

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

      {/* Photo URL */}

      <div className="flex flex-col gap-2">
        <Label htmlFor="photo-url">Photo URL</Label>

        <Input
          id="photo-url"
          name="photoUrl"
          type="url"
          inputMode="url"
          placeholder="https://your-portrait.jpg"
          value={photoUrl}
          onChange={(event) => setPhotoUrl(event.target.value)}
          className={`h-11 ${
            photoLooksValid
              ? ""
              : "border-destructive focus-visible:border-destructive"
          }`}
        />

        <p className="text-xs text-muted-foreground">
          Optional — it becomes your avatar in the navbar.
        </p>

        {!photoLooksValid && (
          <p className="text-xs font-medium text-destructive">
            Enter a valid photo URL starting with http:// or https://.
          </p>
        )}
      </div>

      {/* Password */}

      <div className="flex flex-col gap-2">
        <Label htmlFor="password">Password</Label>

        <div className="relative">
          <Input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            placeholder="Create a password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            className="h-11 pr-11"
          />

          <button
            type="button"
            onClick={() =>
              setShowPassword((visible) => !visible)
            }
            aria-label={
              showPassword ? "Hide password" : "Show password"
            }
            className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-muted-foreground transition hover:text-foreground"
          >
            {showPassword ? (
              <EyeOffIcon className="size-4" />
            ) : (
              <EyeIcon className="size-4" />
            )}
          </button>
        </div>

        {/* Password Rules */}

        <ul className="grid gap-1.5 pt-1">
          {rules.map((rule) => (
            <li
              key={rule.id}
              className={`flex items-center gap-2 text-xs font-medium transition-colors ${
                rule.passed
                  ? "text-emerald-500"
                  : "text-muted-foreground"
              }`}
            >
              {rule.passed ? (
                <CheckIcon className="size-3.5 shrink-0" />
              ) : (
                <CircleIcon className="size-2.5 shrink-0 fill-current" />
              )}

              {rule.label}
            </li>
          ))}
        </ul>
      </div>

      {/* Register Button */}

      <Button
        type="submit"
        size="lg"
        className="h-11 w-full font-semibold"
        disabled={submitting}
      >
        {submitting ? (
          <>
            <Loader2Icon className="size-4 animate-spin" />
            Creating your account...
          </>
        ) : (
          <>
            <UserPlusIcon className="size-4" />
            Register
          </>
        )}
      </Button>

      {/* Google Signup */}

      <GoogleButton
        label="Sign up with Google"
        disabled={submitting}
        onError={(message) =>
          toast.error("Google sign-in unavailable", {
            description: message,
          })
        }
      />

      {/* Login Link */}

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}

        <Link
          href="/login"
          className="font-semibold text-primary underline-offset-4 hover:underline"
        >
          Login
        </Link>
      </p>
    </form>
  );
}
