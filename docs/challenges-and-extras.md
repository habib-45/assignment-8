# Challenges & extras

## Challenge 1 — JWT security with HTTPOnly cookies

**Problem:** the Express API must reject unauthenticated mutations, and the
token must never be readable from JavaScript.

**Implementation:**

1. `POST /api/auth/token` (Next.js route handler) checks the Better Auth
   session, then signs `{ sub: email, name, email, iat, exp }` with HS256
   using `jose` and `AUTH_JWT_SECRET`.
2. It sets `studiospace_token` with `httpOnly: true`, `sameSite: "lax"`,
   `secure` in production, and a short `maxAge`.
3. `apiFetch` transparently mints/refreshes the cookie when a call answers
   `401` (single-flight, then one retry).
4. Express `requireAuth` (`src/auth.js`) re-verifies signature and expiry with
   `node:crypto` — no third-party JWT dependency.

**Protected routes:** `POST/PUT/DELETE /api/studios`, `POST/PATCH
/api/bookings`, `GET/POST/DELETE /api/wishlist`. Missing or invalid tokens get
`401 Unauthorized`; valid tokens acting on someone else's listing get `403`.

**Verified by** `scripts/smoke-test.mjs`, which signs its own tokens and
asserts both rejection paths.

## Challenge 2 — booking double-booking prevention

`POST /api/bookings` loads every **Confirmed** reservation for the same
`studioId` and `date`, then tests `[startHour, endHour)` against each stored
range before inserting. Any overlap aborts the write and answers:

```
409 { "message": "That slot is already booked from 9:00 to 13:00." }
```

`Pending`, `Cancelled` and `Completed` reservations do not block a slot, so a
cancelled hold frees the hours immediately. The client shows the server's
message in a toast and keeps the booking modal open so the guest can pick
another window.

A partial index on `studioId + date` keeps the lookup cheap.

## Challenge 3 — theme customisation

`next-themes` wraps the app (`src/providers/theme-provider.tsx`), and the
navbar toggle switches light ⇄ dark. The palette is expressed as CSS
variables, so the header, footer, cards, modals, toasts and empty states all
flip together — including on hard reload, where the stored preference is
applied before paint (no flash).

## Optional — PDF booking invoice generator

`src/lib/invoice-pdf.ts` is a dependency-free PDF writer: it builds a valid
single-page A4 document (billed-to, host, session window, rate breakdown,
total) with a correct xref table and hands it to the browser as a Blob.
Reservations in `Confirmed` or `Completed` state show a **Download invoice**
button on My Bookings.

## Optional — saved studios wishlist

The heart icon on every card calls `POST /api/wishlist` with `credentials:
"include"`. `WishlistProvider` keeps the set in React state so hearts update
optimistically across pages, and the server enforces one document per
user + studio. The dashboard lists saved studios; deleting a listing also
removes it from every wishlist.

## Testing

```bash
cd assignment-8-back
npm test      # scripts/smoke-test.mjs
```

The smoke test covers, in order: health check, unauthenticated rejection,
studio CRUD with ownership enforcement, booking overlap returning `409`,
status transitions, and wishlist add/remove — 20 assertions, with all created
documents cleaned up at the end.

Client-side checks:

```bash
npm run lint
npm run build
```
