/**
 * Adapter for the Express studio API.
 *
 * The API speaks the seed catalogue's vocabulary while the UI uses its own
 * model, so this module is the single place that knows about both:
 *
 *   API → name / price / image / galleryImages / hostInfo / "Photography"
 *   UI  → title / hourlyRate / imageUrl / images / host / "photo-studio"
 *
 * Every page and card keeps consuming the shared `Studio` type; the seed data
 * (each of the 16 studios stored five times) is collapsed here too.
 */

import { apiFetch, ApiError } from "@/lib/api";
import type { CategoryValue, Studio, StudioPayload } from "@/lib/types";

/** Server category vocabulary → the slugs used across the UI. */
const CATEGORY_MAP: Record<string, CategoryValue> = {
  Photography: "photo-studio",
  Video: "film-stage",
  Music: "music-suite",
  Art: "art-workshop",
  Creative: "podcast-lounge",
  Design: "design-studio",
};

const FALLBACK_CATEGORY: CategoryValue = "photo-studio";

interface ApiReview {
  userName: string;
  /** Seeded `i.ibb.co` avatars are dead links, so they are intentionally dropped. */
  userAvatar?: string;
  rating: number;
  comment: string;
  date: string;
}

interface ApiHost {
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
}

export interface StudioCardDto {
  _id: string;
  name: string;
  description: string;
  overview: string;
  image: string;
  galleryImages: string[];
  category: string;
  price: number;
  securityDeposit: number;
  maxCapacity: number;
  location: string;
  rating: number;
  amenities: string[];
  hostInfo: ApiHost;
  reviews: ApiReview[];
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Mongo ObjectIds embed their creation time in the first four bytes, which
 * gives seed documents a real `createdAt` without inventing a timestamp.
 * Listings created through the API carry an explicit `createdAt` instead.
 */
function createdAtFromId(id: string): string {
  const seconds = Number.parseInt(id.slice(0, 8), 16);
  return new Date(Number.isFinite(seconds) ? seconds * 1000 : 0).toISOString();
}

export function normalize(dto: StudioCardDto): Studio {
  const images = (dto.galleryImages?.length
    ? dto.galleryImages
    : [dto.image]
  ).filter(Boolean);

  const createdAt = dto.createdAt || createdAtFromId(dto._id);

  return {
    _id: dto._id,
    title: dto.name,
    category: CATEGORY_MAP[dto.category] ?? FALLBACK_CATEGORY,
    hourlyRate: dto.price,
    securityDeposit: dto.securityDeposit ?? 0,
    maxCapacity: dto.maxCapacity ?? 1,
    location: dto.location,
    imageUrl: images[0] ?? "",
    images,
    amenities: dto.amenities ?? [],
    overview: dto.overview || dto.description || "",
    // No `image`: the seeded avatar hosts 404, so initials render instead.
    host: {
      name: dto.hostInfo?.name ?? "StudioSpace Host",
      email: dto.hostInfo?.email ?? "",
    },
    rating: dto.rating ?? 0,
    reviews: (dto.reviews ?? []).map((review) => ({
      name: review.userName,
      rating: review.rating,
      comment: review.comment,
      date: review.date,
    })),
    createdAt,
    updatedAt: dto.updatedAt || createdAt,
  };
}

/**
 * Resolves a path under the API.
 *
 * - In the browser: same-origin via the `/api/server/*` rewrite, so the JWT
 *   cookie travels with the request and no CORS is involved.
 * - On the server: rewrites do not apply to outbound `fetch`, so the API base
 *   is used directly.
 */
function endpoint(path: string): string {
  if (typeof window === "undefined") {
    return `${process.env.API_URL || "http://localhost:5000"}${path}`;
  }
  return `/api/server${path}`;
}

async function fetchList(path: string): Promise<StudioCardDto[]> {
  let response: Response;
  try {
    response = await fetch(endpoint(path), { cache: "no-store" });
  } catch {
    throw new ApiError("We couldn't reach the studio feed. Is the API running?", 0);
  }

  if (!response.ok) {
    throw new ApiError(
      `The studio feed answered with status ${response.status}.`,
      response.status
    );
  }

  const payload: unknown = await response.json().catch(() => null);
  if (Array.isArray(payload)) return payload as StudioCardDto[];
  if (payload && typeof payload === "object" && Array.isArray((payload as { data?: unknown }).data)) {
    return (payload as { data: StudioCardDto[] }).data;
  }
  return [];
}

/** Collapses the seed catalogue's five copies of every studio. */
function dedupe(dtos: StudioCardDto[]): Studio[] {
  const seen = new Set<string>();
  const unique: Studio[] = [];

  for (const dto of dtos) {
    const key = `${dto.name}|${dto.location}|${dto.price}`;
    if (seen.has(key)) continue;
    seen.add(key);
    unique.push(normalize(dto));
  }

  return unique;
}

/** Every distinct studio, newest first. */
export async function fetchStudios(): Promise<Studio[]> {
  const dtos = await fetchList("/api/studios");
  return dedupe(dtos).sort(
    (a, b) => +new Date(b.createdAt) - +new Date(a.createdAt)
  );
}

/**
 * Home page "Featured Studio Spaces": the API applies `limit(6)` inside the
 * aggregation pipeline after collapsing duplicates, so six *distinct*
 * top-rated rooms come back in one round trip.
 */
export async function fetchFeaturedStudios(limit = 6): Promise<Studio[]> {
  const dtos = await fetchList(`/api/studios?featured=true&limit=${limit}`);
  return dedupe(dtos);
}

/** Listings owned by one host — powers /my-listings and the dashboard. */
export async function fetchStudiosByOwner(ownerEmail: string): Promise<Studio[]> {
  const dtos = await fetchList(
    `/api/studios?ownerEmail=${encodeURIComponent(ownerEmail)}`
  );
  return dedupe(dtos);
}

/** Single studio by id. */
export async function fetchStudioById(id: string): Promise<Studio | null> {
  let response: Response;
  try {
    response = await fetch(endpoint(`/api/studios/${id}`), { cache: "no-store" });
  } catch {
    throw new ApiError("We couldn't reach the studio feed. Is the API running?", 0);
  }
  if (response.status === 404) return null;
  if (!response.ok) {
    throw new ApiError(
      `The studio feed answered with status ${response.status}.`,
      response.status
    );
  }
  const dto = (await response.json().catch(() => null)) as StudioCardDto | null;
  return dto ? normalize(dto) : null;
}

/**
 * Create / update / delete all go through `apiFetch`, which attaches the
 * HTTPOnly JWT cookie and surfaces the API's validation message on failure.
 *
 * The payload travels in the UI's own vocabulary (`photo-studio`, `title`,
 * `hourlyRate`, …) — the API validates it and maps it onto the seed
 * catalogue's document shape.
 */
export async function createStudio(payload: StudioPayload): Promise<Studio> {
  const dto = await apiFetch<StudioCardDto>("/api/studios", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return normalize(dto);
}

export async function updateStudio(
  id: string,
  payload: StudioPayload
): Promise<Studio> {
  const dto = await apiFetch<StudioCardDto>(`/api/studios/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
  return normalize(dto);
}

export async function deleteStudio(id: string): Promise<void> {
  await apiFetch(`/api/studios/${id}`, { method: "DELETE" });
}

/** Prefills the edit form from an existing listing. */
export function toStudioPayload(studio: Studio): StudioPayload {
  return {
    title: studio.title,
    category: studio.category,
    hourlyRate: studio.hourlyRate,
    securityDeposit: studio.securityDeposit,
    maxCapacity: studio.maxCapacity,
    location: studio.location,
    imageUrl: studio.imageUrl,
    images: studio.images.length ? studio.images : [studio.imageUrl],
    amenities: studio.amenities,
    overview: studio.overview,
  };
}
