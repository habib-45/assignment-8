import { cn } from "cn";
import { STATUS_STYLES } from "@/lib/constants";
import type { BookingStatus } from "@/lib/types";

/** Pill badge shared by My Bookings and the host booking manager. */
export function StatusBadge({
  status,
  className,
}: {
  status: BookingStatus;
  className?: string;
}) {
  const style = STATUS_STYLES[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset",
        style.className,
        className
      )}
    >
      <span className={cn("size-1.5 rounded-full", style.dot)} aria-hidden />
      {status}
    </span>
  );
}
