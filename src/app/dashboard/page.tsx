import type { Metadata } from "next";
import Link from "next/link";
import { HomeIcon, LayoutDashboardIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/shared/container";
import { PrivateRoute } from "@/components/auth/private-route";
import { DashboardView } from "@/components/dashboard/dashboard-view";

export const metadata: Metadata = {
  title: "Dashboard",
  description:
    "Your StudioSpace command centre — listings, bookings and saved studios in one place.",
};

export default function DashboardPage() {
  return (
    <Container className="py-10 md:py-14">
      <PrivateRoute>
        <div className="mb-6 flex flex-wrap items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            className="rounded-xl text-muted-foreground"
            render={<Link href="/" />}
          >
            <HomeIcon className="size-4" />
            Home
          </Button>
          <span className="text-muted-foreground">/</span>
          <span className="flex items-center gap-2 text-sm font-medium">
            <LayoutDashboardIcon className="size-4 text-primary" />
            Dashboard
          </span>
        </div>

        <DashboardView />
      </PrivateRoute>
    </Container>
  );
}
