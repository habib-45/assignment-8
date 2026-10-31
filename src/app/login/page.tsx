import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthShell } from "@/components/auth/auth-shell";
import { LoginForm } from "@/components/auth/login-form";
import { AuthFormSkeleton } from "@/components/shared/skeletons";

export const metadata: Metadata = {
  title: "Login",
  description:
    "Sign in to StudioSpace to manage your studio listings, bookings and host dashboard.",
};

export default function LoginPage() {
  return (
    <AuthShell
      eyebrow="Member access"
      title="Welcome back to StudioSpace"
      description="Pick up where you left off — your listings, bookings and saved studios are one sign-in away."
    >
      <Suspense fallback={<AuthFormSkeleton />}>
        <LoginForm />
      </Suspense>
    </AuthShell>
  );
}
