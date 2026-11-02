# StudioSpace 🎬

**Peer-to-peer creative workspace & production studio sharing platform.**

StudioSpace lets creators, filmmakers, photographers, podcasters and musicians
discover, inspect and reserve real production spaces by the hour — and lets
hosts publish the rooms they already own and earn from every shoot hour.

🌐 **Live site:** https://studiospace.vercel.app
🔌 **Live API:** https://studiospace-api.onrender.com

## ✨ Features

- **Dynamic studio catalogue** — photo studios, sound stages, podcast lounges,
  music suites and art workshops pulled live from MongoDB, with search,
  category pre-selection, sorting and a 6-card featured grid (`.limit(6)` on the
  server after de-duplicating the seed catalogue).
- **Full CRUD for hosts** — Add (`/add-studio`), Read (`/studios`,
  `/studios/[id]`), Update (`/studios/edit/[id]`) and Delete with a confirmation
  modal; listings are scoped to `ownerEmail` and guarded server-side.
- **Booking engine with double-booking prevention** — pick a date and hours,
  review the live cost (rate × hours + refundable deposit), and reserve. The
  API checks every *Confirmed* reservation for overlap and answers `409` with a
  human-readable message when the slot is taken. Reservations land as
  **Pending** and can be cancelled from **My Bookings** while they stay pending.
- **JWT in HTTPOnly cookies (Challenge 1)** — Better Auth signs the session,
  `/api/auth/token` mints an HS256 JWT into an HTTPOnly cookie, and Express
  rejects every unauthenticated mutation with `401 Unauthorized`. The token is
  never readable from JavaScript.
- **Wishlist, dashboard and theming** — heart any card to save it to MongoDB,
  track listings/bookings/saved studios from `/dashboard`, and flip the whole
  UI between light and dark with the navbar toggle.
- **Polished UX** — Sonner toasts for every auth/CRUD/booking action, branded
  skeleton loaders and spinners during fetches, friendly empty states with CTAs,
  a custom 404 with a studio illustration, sticky navbar with active-route
  indicators, and fully responsive layouts (mobile / tablet / desktop).
- **PDF booking invoices** — every *Confirmed* or *Completed* reservation on
  My Bookings can be downloaded as a real single-page A4 invoice (billed to,
  host, session window, rate breakdown, total), generated in the browser by a
  dependency-free PDF writer with a correct xref table.

## 🛠 Tech stack

| Layer | Technology |
| --- | --- |
| Frontend | **Next.js 16 (App Router)**, TypeScript, Tailwind CSS v4, shadcn/ui on Base UI, Swiper, Sonner, next-themes |
| Auth | **Better Auth** with MongoDB adapter + bridged HS256 JWT (HTTPOnly cookie) |
| Backend | **Express 5** + MongoDB Atlas (`studio-card`, `bookings`, `wishlist`) |
| Media | Pexels imagery, imgbb-ready image URL fields |

## 💻 Local setup

```bash
# 1. Backend
cd "SERVER SIDE/assignment-8-back"
npm install
cp .env.example .env        # add Mongo credentials, AUTH_JWT_SECRET, CLIENT_URL
npm run dev                 # http://localhost:5000

# 2. Frontend
cd "FROND SIDE/assignment-8"
npm install
npm run dev                 # http://localhost:3000
```

`.env.local` for the client:

```bash
MONGODB_URI=mongodb+srv://USER:PASS@cluster0.example.mongodb.net/
MONGODB_DB_NAME=studiospace
BETTER_AUTH_SECRET=generate-a-long-random-string
BETTER_AUTH_URL=http://localhost:3000
AUTH_JWT_SECRET=must-match-the-api-value-exactly
API_URL=http://localhost:5000
```

Optional Google login: set `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET`.

## 🧪 Examiner test credentials

| Account | Email | Password |
| --- | --- | --- |
| Demo host & guest | `examiner@studiospace.com` | `Studio1234` |
| Second reviewer | `reviewer@studiospace.com` | `Review1234` |

Password policy enforced on registration: **one uppercase letter, one
lowercase letter, minimum 6 characters**. Social login (Google) is available on
both Login and Register when OAuth credentials are configured.

## 📁 Routes

| Route | Access |
| --- | --- |
| `/`, `/studios`, `/studios/[id]`, `/how-it-works`, `/about` | public |
| `/login`, `/register` | public (redirects away when signed in) |
| `/dashboard`, `/add-studio`, `/my-listings`, `/studios/edit/[id]`, `/my-bookings` | private — session restored on reload, never bounced to `/login` |

## ✅ Challenges & extras

- **Challenge 1** — HTTPOnly JWT protecting `POST/PUT/DELETE /api/studios`,
  `POST /api/bookings` and the wishlist routes (401 without a valid token).
- **Challenge 2** — booking overlap verification against `Confirmed` bookings
  before insert, with a clear `409` message.
- **Challenge 3** — light/dark theme toggle applied across the whole system.
- **Optional** — saved-studios wishlist persisted in MongoDB.
- **Optional** — one-click PDF invoice for Confirmed/Completed bookings
  (`src/lib/invoice-pdf.ts`, zero new dependencies).
