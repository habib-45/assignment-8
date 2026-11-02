import type { Metadata } from "next";
import Link from "next/link";
import { Building2Icon, HomeIcon, PlusCircleIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { PrivateRoute } from "@/components/auth/private-route";
import { MyListings } from "@/components/studios/my-listings";

export const metadata: Metadata = {
  title: "My Studio Listings",
  description:
    "Manage every studio you host on StudioSpace — update details, review bookings and remove listings.",
};

export default function MyListingsPage() {
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
            <Building2Icon className="size-4 text-primary" />
            My Studio Listings
          </span>
        </div>

        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            align="left"
            eyebrow="Host dashboard"
            title="Your studio listings"
            description="Every space you publish, with instant update and delete controls."
          />
          <Button
            size="lg"
            className="shrink-0 rounded-xl font-semibold"
            render={<Link href="/add-studio" />}
          >
            <PlusCircleIcon className="size-4" />
            Add New Studio
          </Button>
        </div>

        <MyListings />
      </PrivateRoute>
    </Container>
  );
}
