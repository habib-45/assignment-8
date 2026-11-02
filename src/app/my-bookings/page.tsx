import type { Metadata } from "next";
import Link from "next/link";
import { CalendarDaysIcon, HomeIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { PrivateRoute } from "@/components/auth/private-route";
import { MyBookings } from "@/components/studios/my-bookings";

export const metadata: Metadata = {
  title: "My Bookings",
  description:
    "Track every StudioSpace reservation by status and cancel pending slots when plans change.",
};

export default function MyBookingsPage() {
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
            <CalendarDaysIcon className="size-4 text-primary" />
            My Bookings
          </span>
        </div>

        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            align="left"
            eyebrow="Reservations"
            title="Your studio bookings"
            description="Reservations stay Pending until the host confirms them. Cancel a pending slot any time — the studio reopens instantly."
          />
          <Button
            variant="outline"
            size="lg"
            className="shrink-0 rounded-xl font-semibold"
            render={<Link href="/studios" />}
          >
            Book another studio
          </Button>
        </div>

        <MyBookings />
      </PrivateRoute>
    </Container>
  );
}
