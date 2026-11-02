"use client";

import * as React from "react";
import Link from "next/link";
import { toast } from "sonner";
import {
  CalendarDaysIcon,
  EyeIcon,
  MapPinIcon,
  ReceiptTextIcon,
  XCircleIcon,
} from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { StudioCardSkeleton } from "@/components/shared/skeletons";
import { StatusBadge } from "@/components/shared/status-badge";
import {
  ResultsEmpty,
  ResultsError,
} from "@/components/studios/results-state";
import { formatHour, formatMoney, formatDate } from "@/lib/format";
import { FALLBACK_STUDIO_IMAGE } from "@/lib/images";
import { ApiError } from "@/lib/api";
import { fetchMyBookings, setBookingStatus } from "@/lib/bookings-api";
import type { Booking } from "@/lib/types";
import { useAuth } from "@/providers/auth-provider";

type Status = "loading" | "ready" | "error";

/**
 * My Bookings — every reservation the signed-in guest has made, with a status
 * pill and a cancel action that is only offered while the booking is still
 * Pending (the API enforces the same rule).
 */
export function MyBookings() {
  const { user, loading: sessionPending } = useAuth();
  const [bookings, setBookings] = React.useState<Booking[]>([]);
  const [status, setStatus] = React.useState<Status>("loading");
  const [message, setMessage] = React.useState("");
  const [pendingCancel, setPendingCancel] = React.useState<Booking | null>(null);
  const [cancelling, setCancelling] = React.useState(false);

  const email = user?.email;
  const load = React.useCallback(async () => {
    if (!email) return;
    setStatus("loading");
    try {
      const data = await fetchMyBookings();
      setBookings(data);
      setStatus("ready");
    } catch (error) {
      setMessage(
        error instanceof ApiError ? error.message : "We couldn't load your bookings."
      );
      setStatus("error");
    }
  }, [email]);

  React.useEffect(() => {
    void load();
  }, [load]);

  async function handleCancel() {
    if (!pendingCancel) return;
    setCancelling(true);
    try {
      const updated = await setBookingStatus(pendingCancel._id, "Cancelled");
      setBookings((current) =>
        current.map((booking) =>
          booking._id === pendingCancel._id ? updated : booking
        )
      );
      toast.success("Booking cancelled", {
        description: `${pendingCancel.studioTitle} on ${formatDate(pendingCancel.date)} is released.`,
      });
      setPendingCancel(null);
    } catch (error) {
      toast.error("Cancellation failed", {
        description:
          error instanceof ApiError
            ? error.message
            : "The booking is unchanged. Please try again.",
      });
    } finally {
      setCancelling(false);
    }
  }

  if (sessionPending || status === "loading") {
    return (
      <div className="flex flex-col gap-4">
        {Array.from({ length: 3 }, (_, index) => (
          <StudioCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (status === "error") {
    return <ResultsError message={message} onRetry={load} />;
  }

  if (bookings.length === 0) {
    return (
      <ResultsEmpty
        icon={CalendarDaysIcon}
        title="No bookings yet"
        description="When you reserve a studio it lands here with a live status — Pending until the host confirms the slot."
        action={{ label: "Explore Studios", href: "/studios" }}
      />
    );
  }

  const upcoming = bookings.filter(
    (booking) => booking.status === "Pending" || booking.status === "Confirmed"
  );

  return (
    <>
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <Badge variant="outline" className="rounded-full px-3 py-1">
          {bookings.length} booking{bookings.length === 1 ? "" : "s"}
        </Badge>
        <Badge variant="outline" className="rounded-full px-3 py-1">
          {upcoming.length} upcoming
        </Badge>
      </div>

      <div className="flex flex-col gap-4">
        {bookings.map((booking) => (
          <BookingRow
            key={booking._id}
            booking={booking}
            onCancel={() => setPendingCancel(booking)}
          />
        ))}
      </div>

      <AlertDialog
        open={Boolean(pendingCancel)}
        onOpenChange={(open) => {
          if (!open && !cancelling) setPendingCancel(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel this booking?</AlertDialogTitle>
            <AlertDialogDescription>
              {pendingCancel
                ? `${pendingCancel.studioTitle} on ${formatDate(pendingCancel.date)}, ${formatHour(pendingCancel.startTime)}–${formatHour(pendingCancel.endTime)}. The host is notified and the slot opens up again.`
                : ""}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={cancelling}>Keep booking</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              disabled={cancelling}
              onClick={(event) => {
                event.preventDefault();
                void handleCancel();
              }}
            >
              {cancelling ? "Cancelling…" : "Cancel booking"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

function BookingRow({
  booking,
  onCancel,
}: {
  booking: Booking;
  onCancel: () => void;
}) {
  const image = booking.studioImage || FALLBACK_STUDIO_IMAGE;
  const cancellable = booking.status === "Pending";

  return (
    <article className="flex flex-col gap-4 rounded-2xl border bg-card p-4 sm:flex-row sm:items-center">
      <div className="relative aspect-[4/3] w-full shrink-0 overflow-hidden rounded-xl sm:size-24 sm:aspect-auto">
        <Image
          src={image}
          alt={booking.studioTitle}
          fill
          sizes="(max-width: 640px) 100vw, 96px"
          className="object-cover"
        />
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="line-clamp-1 font-heading text-base font-semibold">
            <Link
              href={`/studios/${booking.studioId}`}
              className="transition-colors hover:text-primary"
            >
              {booking.studioTitle}
            </Link>
          </h3>
          <StatusBadge status={booking.status} />
        </div>

        <p className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <CalendarDaysIcon className="size-3.5 text-primary" />
            {formatDate(booking.date)}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <MapPinIcon className="size-3.5 text-primary" />
            {formatHour(booking.startTime)} – {formatHour(booking.endTime)}
            <span className="text-xs">({booking.hours}h)</span>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <ReceiptTextIcon className="size-3.5 text-primary" />
            {formatMoney(booking.totalCost)}
            {booking.hourlyRate ? (
              <span className="text-xs">
                ({formatMoney(booking.hourlyRate)}/hr)
              </span>
            ) : null}
          </span>
        </p>

        <p className="text-xs text-muted-foreground">
          Booked on {formatDate(booking.createdAt)} · host {booking.hostEmail || "StudioSpace"}
        </p>
      </div>

      <div className="flex flex-wrap gap-2 sm:justify-end">
        <Button
          size="sm"
          variant="outline"
          className="rounded-lg font-semibold"
          render={<Link href={`/studios/${booking.studioId}`} />}
        >
          <EyeIcon className="size-4" />
          View studio
        </Button>
        {cancellable ? (
          <Button
            size="sm"
            variant="outline"
            className="rounded-lg font-semibold text-destructive hover:bg-destructive/10"
            onClick={onCancel}
          >
            <XCircleIcon className="size-4" />
            Cancel booking
          </Button>
        ) : null}
      </div>
    </article>
  );
}
