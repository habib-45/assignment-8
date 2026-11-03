# Architecture

## High-level view

```
┌──────────────────────────────────────────────────────────────────────┐
│ Browser                                                              │
│  Next.js App Router pages ──► src/lib/api.ts (apiFetch)              │
│  Better Auth client ────────► /api/auth/*                            │
└───────────────┬──────────────────────────────────┬───────────────────┘
                │ same-origin fetch                │ session cookie
                ▼                                  ▼
┌──────────────────────────────────────────────────────────────────────┐
│ Next.js (Vercel)                                                     │
│  /api/server/*  ── rewrite (next.config.ts) ──┐                      │
│  /api/auth/token  mints studiospace_token ────┼── HTTPOnly cookie    │
│  /api/auth/[...all]  Better Auth handlers     │                      │
└───────────────────────────────────────────────┼──────────────────────┘
                                                ▼
┌──────────────────────────────────────────────────────────────────────┐
│ Express API (Render)                                                 │
│  src/auth.js   verifies studiospace_token (HS256, node:crypto)       │
│  src/routes/*  studios · bookings · wishlist                         │
└───────────────────────────────┬──────────────────────────────────────┘
                                ▼
                    MongoDB Atlas (driver 7)
```

Two properties fall out of this layout:

1. **The browser only ever talks to one origin.** Every product call goes to
   `/api/server/...` on the Next.js host and is rewritten to `API_URL`, so
   cookies, CORS and mixed-content rules stay simple.
2. **The API never sees a Better Auth session.** It only trusts a short-lived
   JWT it can verify itself, so the two apps can be deployed, scaled and
   restarted independently.

## Request paths

### Public read (studio catalogue)

```
GET /studios
  → page component calls studio-api.ts
  → apiFetch("/api/studios?category=photo-studio&sort=rating")
  → Next rewrite → GET {API_URL}/api/studios?...
  → Express studios router → MongoDB `studio-card`
  → { data: [...] } unwrapped by apiFetch
```

### Authenticated mutation (create a booking)

```
POST /api/server/bookings   (credentials: "include")
  1. apiFetch sees 401 → ensureApiToken()
     POST /api/auth/token  → Better Auth session → sets studiospace_token
  2. retry POST /api/server/bookings
  3. Express requireAuth() verifies the cookie signature + expiry
  4. overlap check against Confirmed bookings → 200 or 409
  5. insert into `bookings` with status "Pending"
```

`ensureApiToken()` de-duplicates in-flight mints (a module-level promise), so
parallel requests trigger exactly one token round-trip.

## Auth chain

| Layer | Credential | Issued by | Lifetime |
| --- | --- | --- | --- |
| Next.js session | `better_auth.session_token` (HTTPOnly) | Better Auth | rolling session |
| Express API | `studiospace_token` (HTTPOnly, SameSite=Lax) | `POST /api/auth/token` using `jose` HS256 | short-lived, re-minted on 401 |

- The session is created by Better Auth and stored in MongoDB (`sessions`,
  `accounts`, `users`, `verifications` — `usePlural: true`).
- `AuthProvider` calls `ensureApiToken()` whenever a user id exists, keeping
  the API cookie fresh before any protected action.
- `logout()` deletes the API cookie (`DELETE /api/auth/token`), signs the
  Better Auth session out and refetches.
- The token secret (`AUTH_JWT_SECRET`) is shared with the Express service —
  the two values **must match exactly**.

## Client folder layout

```
src/
  app/                 routes (App Router)
    api/auth/token/    mints/clears the HTTPOnly API JWT
    api/auth/[...all]  Better Auth handler
    studios/           explore · details · edit/[id]
    ...                dashboard, add-studio, my-listings, my-bookings,
                       login, register, how-it-works, about, not-found
  components/
    home/  studios/  auth/  dashboard/  layout/  shared/  ui/
  lib/                 api client, studio/booking adapters, auth, password
                       rules, PDF invoice writer, constants, types
  providers/            auth · theme · wishlist · app-providers
  hooks/
```

## Server folder layout

```
src/
  index.js             express app, cors allowlist, rewrites, error handler
  db.js                shared MongoClient + collection indexes
  auth.js              HTTPOnly JWT verification middleware
  routes/
    studios.js         catalogue CRUD + featured feed
    bookings.js        reservations + overlap prevention
    wishlist.js        saved studios
  lib/ids.js           hex-string id normalisation
  lib/studio-model.js  payload validation
scripts/smoke-test.mjs end-to-end API test (20 assertions)
```

## Data model

| Collection | Owner | Notable fields / indexes |
| --- | --- | --- |
| `studio-card` | Express API | `name`, `category`, `price`, `securityDeposit`, `maxCapacity`, `location`, `galleryImages[]`, `amenities[]`, `hostInfo`, `reviews[]`, `rating` |
| `bookings` | Express API | `studioId`, `userEmail`, `date`, `startHour`, `endHour`, `status` (`Pending` / `Confirmed` / `Completed` / `Cancelled`); index on `studioId + date` for collision lookups |
| `wishlist` | Express API | unique per `userEmail + studioId` |
| `users`, `sessions`, `accounts`, `verifications` | Better Auth | standard Better Auth schema, plural collection names |

Ids are normalised to 24-character hex strings (`src/lib/ids.js`) so every
response serialises identically whether Mongo handed back an `ObjectId` or a
string.

## UI conventions

- One heading scale and one button style shared by the home page, navbar and
  every inner page; cards use a uniform grid with equal heights.
- Feedback is always a **Sonner toast** or a **custom modal** — never
  `window.alert`.
- Route transitions and fetches show branded skeletons/spinners; empty lists
  render friendly empty states with a CTA.
- The theme toggle (Challenge 3) drives `next-themes` across the whole app,
  including the navbar and footer.
