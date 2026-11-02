/**
 * Shared domain types for the StudioSpace client.
 * The Express API mirrors these shapes in `assignment-8-server/src/types`.
 */

export type CategoryValue =
  | "photo-studio"
  | "film-stage"
  | "podcast-lounge"
  | "music-suite"
  | "art-workshop"
  /** Present in the catalogue but not one of the five home page cards. */
  | "design-studio";

export interface CategoryMeta {
  value: CategoryValue;
  label: string;
  /** Plural label used on the home page category cards. */
  plural: string;
  short: string;
}

export interface Review {
  name: string;
  image?: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Host {
  name: string;
  email: string;
  image?: string;
}

export interface Studio {
  _id: string;
  title: string;
  category: CategoryValue;
  hourlyRate: number;
  securityDeposit: number;
  maxCapacity: number;
  location: string;
  imageUrl: string;
  images: string[];
  amenities: string[];
  overview: string;
  host: Host;
  rating: number;
  reviews: Review[];
  createdAt: string;
  updatedAt: string;
}

/** Payload sent when creating or updating a studio listing. */
export interface StudioPayload {
  title: string;
  category: CategoryValue;
  hourlyRate: number;
  securityDeposit: number;
  maxCapacity: number;
  location: string;
  imageUrl: string;
  images: string[];
  amenities: string[];
  overview: string;
}

export type BookingStatus =
  | "Pending"
  | "Confirmed"
  | "Completed"
  | "Cancelled";

export interface Booking {
  _id: string;
  studioId: string;
  studioTitle: string;
  studioImage: string;
  hourlyRate: number;
  clientName: string;
  clientEmail: string;
  hostEmail: string;
  date: string; // YYYY-MM-DD
  startTime: number; // hour of day, 0-23
  endTime: number; // hour of day, 1-24
  hours: number;
  totalCost: number;
  status: BookingStatus;
  createdAt: string;
}

export interface BookingPayload {
  studioId: string;
  date: string;
  startTime: number;
  endTime: number;
}

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  image?: string;
}

export interface StudiosQuery {
  search?: string;
  category?: string;
  sort?: string;
  featured?: boolean;
  limit?: number;
  ownerEmail?: string;
}
