/**
 * Adapter for the Express `studio-card` feed.
 *
 * The API exposes one flat endpoint (`GET /studio-card`) whose documents use a
 * different vocabulary than the client's `Studio` model:
 *
 *   API → name / price / image / galleryImages / hostInfo / "Photography"
 *   UI  → title / hourlyRate / imageUrl / images / host / "photo-studio"
 *
 * This module is the single place that knows about both, so every page and card
 * keeps consuming the shared `Studio` type. It also collapses the seed data,
 * which stores each of the 16 studios five times (once per seed run).
 */

import { ApiError } from "@/lib/api";
import type { CategoryValue, Studio } from "@/lib/types";

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
}

/**
 * Mongo ObjectIds embed their creation time in the first four bytes, which
 * gives these documents a real `createdAt` without inventing a timestamp.
 */
function createdAtFromId(id: string): string {
  const seconds = Number.parseInt(id.slice(0, 8), 16);
  return new Date(Number.isFinite(seconds) ? seconds * 1000 : 0).toISOString();
}

function normalize(dto: StudioCardDto): Studio {
  const images = (dto.galleryImages?.length
    ? dto.galleryImages
    : [dto.image]
  ).filter(Boolean);

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
    createdAt: createdAtFromId(dto._id),
    updatedAt: createdAtFromId(dto._id),
  };
}

/**
 * Resolves the feed URL.
 *
 * - In the browser: same-origin via the `/api/server/*` rewrite, so the JWT
 *   cookie travels with the request and no CORS is involved.
 * - On the server: rewrites do not apply to outbound `fetch`, so the API base
 *   is used directly.
 */
function endpoint(): string {
  if (typeof window === "undefined") {
    return `${process.env.API_URL || "http://localhost:5000"}/studio-card`;
  }
  return "/api/server/studio-card";
}

async function fetchRaw(): Promise<StudioCardDto[]> {
  let response: Response;
  try {
    response = await fetch(endpoint(), { cache: "no-store" });
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
  return Array.isArray(payload) ? (payload as StudioCardDto[]) : [];
}

/** Every distinct studio, newest first. Seed duplicates are collapsed here. */
export async function fetchStudios(): Promise<Studio[]> {
  const raw = await fetchRaw();
  const seen = new Set<string>();
  const unique: Studio[] = [];

  for (const dto of raw) {
    const key = `${dto.name}|${dto.location}|${dto.price}`;
    if (seen.has(key)) continue;
    seen.add(key);
    unique.push(normalize(dto));
  }

  return unique.sort(
    (a, b) => +new Date(b.createdAt) - +new Date(a.createdAt)
  );
}

/** Single studio by id — searches the raw feed so any seeded duplicate resolves. */
export async function fetchStudioById(id: string): Promise<Studio | null> {
  const raw = await fetchRaw();
  const dto = raw.find((item) => item._id === id);
  return dto ? normalize(dto) : null;
}
