"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { CalendarDaysIcon, Loader2Icon, ShieldCheckIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ApiError } from "@/lib/api";
import { createBooking } from "@/lib/bookings-api";
import { formatHour, formatMoney, todayIsoDate } from "@/lib/format";
import { HOURS_OPTIONS } from "@/lib/constants";
import { useAuth } from "@/providers/auth-provider";
import type { Studio } from "@/lib/types";

interface BookingModalProps {
  studio: Studio;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ONE_DAY_MS = 24 * 60 * 60 * 1000;

/** Inclusive list of YYYY-MM-DD dates from today through the next 30 days. */
function buildDateOptions(): string[] {
  const today = new Date();
  const days: string[] = [];
  for (let index = 0; index <= 30; index += 1) {
    const date = new Date(today.getTime() + index * ONE_DAY_MS);
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    days.push(`${date.getFullYear()}-${month}-${day}`);
  }
  return days;
}

/**
 * "Book Workspace Now" — pick a date and an hour range, review the live cost,
 * then POST a booking. The API owns double-booking prevention (Challenge 2):
 * if the slot collides with a Confirmed reservation it answers 409 and we
 * surface that message verbatim so the guest can pick another window.
 */
export function BookingModal({ studio, open, onOpenChange }: BookingModalProps) {
  const router = useRouter();
  const { user, loading: sessionPending } = useAuth();

  const dateOptions = useMemo(() => buildDateOptions(), []);
  const [date, setDate] = useState(dateOptions[0] ?? "");
  const [startTime, setStartTime] = useState(9);
  const [endTime, setEndTime] = useState(13);
  const [submitting, setSubmitting] = useState(false);

  const hours = Math.max(0, endTime - startTime);
  const totalCost = hours * studio.hourlyRate;
  const invalid = hours <= 0;

  const endOptions = useMemo(
    () => HOURS_OPTIONS.filter((hour) => hour > startTime),
    [startTime]
  );

  async function handleSubmit() {
    if (invalid) return;

    if (!user) {
      toast.info("Please sign in to book this workspace.");
      onOpenChange(false);
      router.push(`/login?redirect=/studios/${studio._id}`);
      return;
    }

    setSubmitting(true);
    try {
      const booking = await createBooking({
        studioId: studio._id,
        date,
        startTime,
        endTime,
      });
      toast.success("Booking requested", {
        description: `${studio.title} · ${formatDateLabel(date)} · status ${booking.status}.`,
      });
      onOpenChange(false);
      router.push("/my-bookings");
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.message
          : "We couldn't create that booking. Please try again.";
      toast.error("Booking failed", { description: message });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Book {studio.title}</DialogTitle>
          <DialogDescription>
            Choose your date and hours. Reservations start as Pending until the
            host confirms the slot.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="booking-date">Date</Label>
            <div className="relative">
              <CalendarDaysIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="booking-date"
                type="date"
                value={date}
                min={todayIsoDate()}
                onChange={(event) => setDate(event.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-2">
              <Label>Start</Label>
              <Select
                value={String(startTime)}
                onValueChange={(value) => {
                  const next = Number(value ?? startTime);
                  setStartTime(next);
                  if (endTime <= next) setEndTime(Math.min(next + 1, 24));
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {HOURS_OPTIONS.map((hour) => (
                    <SelectItem key={hour} value={String(hour)}>
                      {formatHour(hour)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-2">
              <Label>End</Label>
              <Select
                value={String(endTime)}
                onValueChange={(value) => setEndTime(Number(value ?? endTime))}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(endOptions.length ? endOptions : [24]).map((hour) => (
                    <SelectItem key={hour} value={String(hour)}>
                      {formatHour(hour)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex flex-col gap-2 rounded-xl border bg-muted/40 p-4 text-sm">
            <Row
              label={`${formatMoney(studio.hourlyRate)} × ${hours} hour${hours === 1 ? "" : "s"}`}
              value={formatMoney(totalCost)}
            />
            <Row
              label="Refundable security deposit"
              value={formatMoney(studio.securityDeposit)}
            />
            <div className="mt-1 flex items-center justify-between border-t pt-2 font-semibold">
              <span>Due at confirmation</span>
              <span className="text-primary">
                {formatMoney(totalCost + studio.securityDeposit)}
              </span>
            </div>
          </div>

          <p className="flex items-start gap-2 text-xs text-muted-foreground">
            <ShieldCheckIcon className="mt-0.5 size-3.5 shrink-0 text-primary" />
            Cancel free up to 24 hours before your start time. The deposit is
            released back to your card after the session.
          </p>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={submitting}
          >
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={invalid || submitting}>
            {submitting ? (
              <>
                <Loader2Icon className="size-4 animate-spin" />
                Booking…
              </>
            ) : (
              `Request booking · ${formatMoney(totalCost + studio.securityDeposit)}`
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}

/** "2026-10-31" → "Fri, Oct 31, 2026" (inline so the modal stays self-contained). */
function formatDateLabel(value: string): string {
  const parts = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!parts) return value;
  const date = new Date(Number(parts[1]), Number(parts[2]) - 1, Number(parts[3]));
  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  }).format(date);
}
