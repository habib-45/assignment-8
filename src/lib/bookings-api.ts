/**
 * Booking + wishlist calls.
 *
 * Every mutation runs through `apiFetch`, which carries the bridged HTTPOnly
 * JWT cookie (Challenge 1). The API owns the business rules: reservations are
 * created as "Pending", collisions with a Confirmed slot answer 409, and only
 * the guest or the host may change a status.
 */

import { apiFetch } from "@/lib/api";
import { normalize, type StudioCardDto } from "@/lib/studio-api";
import type { Booking, BookingPayload, BookingStatus, Studio } from "@/lib/types";

/** Reservations owned by the signed-in user (always scoped server-side). */
export async function fetchMyBookings(): Promise<Booking[]> {
  return apiFetch<Booking[]>("/api/bookings");
}

export async function createBooking(payload: BookingPayload): Promise<Booking> {
  return apiFetch<Booking>("/api/bookings", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function setBookingStatus(
  id: string,
  status: BookingStatus
): Promise<Booking> {
  return apiFetch<Booking>(`/api/bookings/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}

/** Saved studios joined with their listing documents. */
export async function fetchSavedStudios(): Promise<Studio[]> {
  const dtos = await apiFetch<StudioCardDto[]>("/api/wishlist");
  return dtos.map(normalize);
}

export async function saveStudio(studioId: string): Promise<void> {
  await apiFetch("/api/wishlist", {
    method: "POST",
    body: JSON.stringify({ studioId }),
  });
}

export async function unsaveStudio(studioId: string): Promise<void> {
  await apiFetch(`/api/wishlist/${studioId}`, { method: "DELETE" });
}
