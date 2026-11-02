"use client";

import * as React from "react";
import Link from "next/link";
import { toast } from "sonner";
import {
  ArrowRightIcon,
  Building2Icon,
  CalendarCheckIcon,
  CalendarDaysIcon,
  HeartIcon,
  PlusCircleIcon,
  SparklesIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/shared/status-badge";
import { StudioCardSkeleton, TableSkeleton } from "@/components/shared/skeletons";
import {
  ResultsEmpty,
  ResultsError,
} from "@/components/studios/results-state";
import { fetchStudiosByOwner } from "@/lib/studio-api";
import { fetchMyBookings } from "@/lib/bookings-api";
import { formatDate, formatMoney } from "@/lib/format";
import { ApiError } from "@/lib/api";
import type { Booking, Studio } from "@/lib/types";
import { useAuth } from "@/providers/auth-provider";
import { useWishlist } from "@/providers/wishlist-provider";

const QUICK_ACTIONS = [
  {
    href: "/add-studio",
    label: "Add New Studio",
    description: "Publish another space",
    icon: PlusCircleIcon,
  },
  {
    href: "/my-listings",
    label: "My Listings",
    description: "Update or remove listings",
    icon: Building2Icon,
  },
  {
    href: "/my-bookings",
    label: "My Bookings",
    description: "Track every reservation",
    icon: CalendarDaysIcon,
  },
  {
    href: "/studios",
    label: "Explore Studios",
    description: "Find your next room",
    icon: SparklesIcon,
  },
] as const;

/**
 * Personal dashboard: live counts pulled from the API (listings by owner,
 * bookings and the wishlist of the signed-in user) plus quick links into the
 * three private routes.
 */
export function DashboardView() {
  const { user, loading: sessionPending } = useAuth();
  // The wishlist provider owns this list so hearts everywhere stay in sync.
  const { studios: wishlist, loading: wishlistLoading } = useWishlist();
  const [studios, setStudios] = React.useState<Studio[]>([]);
  const [bookings, setBookings] = React.useState<Booking[]>([]);
  const [status, setStatus] = React.useState<"loading" | "ready" | "error">(
    "loading"
  );
  const [message, setMessage] = React.useState("");

  const email = user?.email;

  const load = React.useCallback(async () => {
    if (!email) return;
    setStatus("loading");
    try {
      const [myStudios, myBookings] = await Promise.all([
        fetchStudiosByOwner(email),
        fetchMyBookings(),
      ]);
      setStudios(myStudios);
      setBookings(myBookings);
      setStatus("ready");
    } catch (error) {
      setMessage(
        error instanceof ApiError
          ? error.message
          : "We couldn't load your dashboard."
      );
      setStatus("error");
    }
  }, [email]);

  React.useEffect(() => {
    void load();
  }, [load]);

  if (sessionPending || status === "loading") {
    return (
      <div className="flex flex-col gap-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }, (_, index) => (
            <div key={index} className="h-28 rounded-2xl border bg-card p-5">
              <TableSkeleton rows={1} />
            </div>
          ))}
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }, (_, index) => (
            <StudioCardSkeleton key={index} />
          ))}
        </div>
      </div>
    );
  }

  if (status === "error") {
    return <ResultsError message={message} onRetry={load} />;
  }

  const pending = bookings.filter((booking) => booking.status === "Pending");
  const confirmed = bookings.filter((booking) => booking.status === "Confirmed");
  const activeListings = studios.length;

  const stats = [
    {
      label: "Studio listings",
      value: String(activeListings),
      hint: activeListings ? "live on Explore" : "publish your first one",
      icon: Building2Icon,
    },
    {
      label: "Bookings made",
      value: String(bookings.length),
      hint: `${confirmed.length} confirmed`,
      icon: CalendarCheckIcon,
    },
    {
      label: "Awaiting host",
      value: String(pending.length),
      hint: pending.length ? "pending confirmation" : "nothing pending",
      icon: CalendarDaysIcon,
    },
    {
      label: "Saved studios",
      value: String(wishlist.length),
      hint: "on your wishlist",
      icon: HeartIcon,
    },
  ];

  const recent = bookings.slice(0, 4);

  return (
    <div className="flex flex-col gap-10">
      {/* Greeting */}
      <div className="flex flex-col gap-3">
        <span className="text-xs font-semibold tracking-[0.22em] text-primary uppercase">
          Dashboard
        </span>
        <h2 className="max-w-3xl text-3xl font-bold text-balance sm:text-4xl">
          Welcome back, {user?.name?.split(" ")[0] || "creator"}
        </h2>
        <p className="max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
          Everything you host, book and save — refreshed live from the
          StudioSpace API.
        </p>
      </div>

      {/* Quick actions */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {QUICK_ACTIONS.map((action) => (
          <Link
            key={action.href}
            href={action.href}
            className="group flex items-start justify-between gap-3 rounded-2xl border bg-card p-5 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10"
          >
            <span className="flex flex-col gap-2">
              <span className="flex size-10 items-center justify-center rounded-xl bg-primary/12 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <action.icon className="size-5" />
              </span>
              <span className="font-heading text-sm font-semibold">
                {action.label}
              </span>
              <span className="text-xs text-muted-foreground">
                {action.description}
              </span>
            </span>
            <ArrowRightIcon className="size-4 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
          </Link>
        ))}
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="flex flex-col gap-2 rounded-2xl border bg-card p-5"
          >
            <span className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
              <stat.icon className="size-4 text-primary" />
              {stat.label}
            </span>
            <span className="font-heading text-3xl font-bold">{stat.value}</span>
            <span className="text-xs text-muted-foreground">{stat.hint}</span>
          </div>
        ))}
      </div>

      {/* Recent bookings */}
      <section className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-heading text-xl font-semibold">Recent bookings</h2>
          <Button
            variant="outline"
            size="sm"
            className="rounded-xl font-semibold"
            render={<Link href="/my-bookings" />}
          >
            View all
            <ArrowRightIcon className="size-4" />
          </Button>
        </div>

        {recent.length === 0 ? (
          <ResultsEmpty
            icon={CalendarDaysIcon}
            title="No reservations yet"
            description="Book a studio and its status will show up here the moment the host responds."
            action={{ label: "Explore Studios", href: "/studios" }}
          />
        ) : (
          <div className="flex flex-col gap-3">
            {recent.map((booking) => (
              <div
                key={booking._id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl border bg-card p-4"
              >
                <div className="flex flex-col gap-1">
                  <Link
                    href={`/studios/${booking.studioId}`}
                    className="font-heading text-sm font-semibold transition-colors hover:text-primary"
                  >
                    {booking.studioTitle}
                  </Link>
                  <p className="text-xs text-muted-foreground">
                    {formatDate(booking.date)} · {booking.hours} hours ·{" "}
                    {formatMoney(booking.totalCost)}
                  </p>
                </div>
                <StatusBadge status={booking.status} />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Listings preview */}
      <section className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-heading text-xl font-semibold">Your listings</h2>
          <Button
            variant="outline"
            size="sm"
            className="rounded-xl font-semibold"
            render={<Link href="/my-listings" />}
          >
            Manage
            <ArrowRightIcon className="size-4" />
          </Button>
        </div>

        {studios.length === 0 ? (
          <ResultsEmpty
            icon={SparklesIcon}
            title="No studios published yet"
            description="Turn the room you already have into income — publishing takes about five minutes."
            action={{ label: "Add New Studio", href: "/add-studio" }}
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {studios.slice(0, 3).map((studio) => (
              <Link
                key={studio._id}
                href={`/studios/edit/${studio._id}`}
                className="flex items-center justify-between gap-3 rounded-xl border bg-card p-4 transition-colors hover:border-primary/40"
              >
                <span className="flex flex-col gap-1">
                  <span className="line-clamp-1 font-heading text-sm font-semibold">
                    {studio.title}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {formatMoney(studio.hourlyRate)}/hr · {studio.location}
                  </span>
                </span>
                <Badge variant="outline">Edit</Badge>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Saved studios */}
      <section className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-heading text-xl font-semibold">Saved studios</h2>
          <span className="text-sm text-muted-foreground">
            {wishlist.length} saved
          </span>
        </div>

        {wishlistLoading ? (
          <TableSkeleton rows={2} />
        ) : wishlist.length === 0 ? (
          <ResultsEmpty
            icon={HeartIcon}
            title="Nothing on your wishlist yet"
            description="Tap the heart on any studio card and it waits here until you are ready to book."
            action={{ label: "Explore Studios", href: "/studios" }}
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {wishlist.map((studio) => (
              <Link
                key={studio._id}
                href={`/studios/${studio._id}`}
                className="flex items-center justify-between gap-3 rounded-xl border bg-card p-4 transition-colors hover:border-primary/40"
              >
                <span className="flex flex-col gap-1">
                  <span className="line-clamp-1 font-heading text-sm font-semibold">
                    {studio.title}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {formatMoney(studio.hourlyRate)}/hr · {studio.location}
                  </span>
                </span>
                <Badge variant="outline">View</Badge>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
