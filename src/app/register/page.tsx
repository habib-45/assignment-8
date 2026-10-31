import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthShell } from "@/components/auth/auth-shell";
import { RegisterForm } from "@/components/auth/register-form";
import { AuthFormSkeleton } from "@/components/shared/skeletons";

export const metadata: Metadata = {
  title: "Register",
  description:
    "Create a free StudioSpace account to book creative workspaces or host your own studio.",
};

export default function RegisterPage() {
  return (
    <AuthShell
      eyebrow="Join the platform"
      title="Create your StudioSpace account"
      description="Book photo studios, sound stages and workshops by the hour — or list your own space and start earning."
    >
      <Suspense fallback={<AuthFormSkeleton />}>
        <RegisterForm />
      </Suspense>
    </AuthShell>
  );
}
