# API reference

Base URL (production): `https://assignment-8-backend-ivory.vercel.app`
Browser-facing base: `/api/server/*` on the Next.js host (rewritten to
`API_URL` — see `next.config.ts`).

## Conventions

**Success envelope**

```json
{ "data": <payload> }
```

**Error envelope**

```json
{ "message": "Human readable reason" }
```

`apiFetch` unwraps `data` on success and throws an `ApiError` carrying
`status` + `message` on failure; every caller surfaces that message through a
Sonner toast.

| Status | Meaning |
| --- | --- |
| `200` / `201` | OK / created |
| `400` | payload failed validation |
| `401` | missing, invalid or expired `studiospace_token` cookie |
| `403` | valid token, but you do not own the resource |
| `404` | no such document |
| `409` | booking overlap (or other state conflict) |
| `500` | unexpected server error |

## Authentication routes (Next.js host)

| Method | Route | Notes |
| --- | --- | --- |
| `ALL` | `/api/auth/[...all]` | Better Auth handler (sign in, sign up, sign out, session, Google OAuth) |
| `POST` | `/api/auth/token` | Mints the `studiospace_token` HTTPOnly cookie from the current Better Auth session |
| `DELETE` | `/api/auth/token` | Clears the API cookie (called on logout) |

Password policy enforced at registration: **≥ 6 characters, at least one
uppercase and one lowercase letter** (`src/lib/password-rules.ts`).

## Studios

| Method | Route | Auth | Notes |
| --- | --- | --- | --- |
| `GET` | `/studio-card` | public | Legacy flat feed used by the home page |
| `GET` | `/api/health` | public | Liveness probe |
| `GET` | `/api/studios` | public | Catalogue with query params (below) |
| `GET` | `/api/studios/:id` | public | Single listing incl. gallery, amenities, host, reviews |
| `POST` | `/api/studios` | **JWT** | Creates a listing; `hostInfo` is taken from the token subject |
| `PUT` | `/api/studios/:id` | **JWT + owner** | Host info is never editable |
| `DELETE` | `/api/studios/:id` | **JWT + owner** | Also clears the document from any wishlist |

### `GET /api/studios` query parameters

| Param | Example | Effect |
| --- | --- | --- |
| `search` | `?search=soho` | case-insensitive match on name/location/description |
| `category` | `?category=photo-studio` | UI slug, mapped to the API vocabulary |
| `sort` | `?sort=rating` | `newest`, `rating`, `price-asc`, `price-desc` |
| `limit` | `?limit=6` | caps the result set (featured grid) |
| `ownerEmail` | `?ownerEmail=a@b.c` | host's own listings |
| `featured` | `?featured=true` | de-duplicated feed used on the home page |

### Category vocabulary

The API stores `Photography`, `Video`, `Music`, `Art`, `Creative`, `Design`;
the UI uses slugs `photo-studio`, `film-stage`, `music-suite`,
`art-workshop`, `podcast-lounge`, `design-studio`. The translation lives in
one place — `src/lib/studio-api.ts` (`CATEGORY_MAP`).

### `POST /api/studios` body

```jsonc
{
  "name": "Daylight Cyc Loft",
  "category": "Photography",
  "price": 85,               // hourly rate, USD
  "securityDeposit": 250,
  "maxCapacity": 12,
  "location": "Greenpoint, Brooklyn",
  "image": "https://i.ibb.co/...",
  "galleryImages": ["https://..."],
  "overview": "…",
  "description": "…",
  "amenities": ["Infinity Cyc Wall", "Wi-Fi"],
  "hostInfo": { "name": "…", "email": "…" }
}
```

`hostInfo.email` is validated against the JWT subject — a listing cannot be
created on someone else's behalf.

## Bookings

| Method | Route | Auth | Notes |
| --- | --- | --- | --- |
| `GET` | `/api/bookings` | **JWT** | Always scoped to the requester's own email |
| `POST` | `/api/bookings` | **JWT** | Creates a `Pending` reservation |
| `PATCH` | `/api/bookings/:id` | **JWT** | Status transitions |

### `POST /api/bookings` body

```jsonc
{
  "studioId": "65f0…",
  "studioName": "Daylight Cyc Loft",
  "userEmail": "guest@example.com",
  "date": "2026-11-14",
  "startHour": 9,             // 06:00 → 22:00
  "endHour": 13,
  "total": 590                // rate × hours + refundable deposit
}
```

**Collision rule (Challenge 2):** before inserting, the route loads every
`Confirmed` reservation for the same `studioId` + `date` and rejects any hour
overlap with:

```
409 { "message": "That slot is already booked from 9:00 to 13:00." }
```

`Pending`, `Cancelled` and `Completed` reservations do not block a slot.

### Status transitions

| From | To | Who |
| --- | --- | --- |
| `Pending` | `Cancelled` | the guest (from My Bookings) |
| `Pending` | `Confirmed` | the host |
| `Confirmed` | `Completed` | the host |
| `Pending` / `Confirmed` | `Cancelled` | the host |

## Wishlist

| Method | Route | Auth | Notes |
| --- | --- | --- | --- |
| `GET` | `/api/wishlist` | **JWT** | Saved studios for the current user |
| `POST` | `/api/wishlist` | **JWT** | `{ studioId }` — unique per user + studio |
| `DELETE` | `/api/wishlist/:studioId` | **JWT** | Toggles the heart off |

## Security (Challenge 1)

Every route marked **JWT** runs `requireAuth` (`src/auth.js`):

1. reads the `studiospace_token` cookie,
2. verifies HS256 signature and `exp` with `node:crypto` (no third-party JWT
   dependency),
3. rejects with `401 Unauthorized` when missing/invalid/expired,
4. checks resource ownership and answers `403` for listings you do not host.

CORS is credentialed and restricted to the `CLIENT_URL` allowlist, so only the
deployed client (and `localhost:3000`) can send the cookie.

## Running the smoke test

With the API running locally:

```bash
npm test
```

`scripts/smoke-test.mjs` signs its own JWTs and walks the whole surface —
auth rejection, CRUD ownership, booking overlaps and wishlist behaviour — with
20 assertions, then deletes everything it created.
