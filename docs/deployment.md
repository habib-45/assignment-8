# Deployment

| Piece | Host | URL |
| --- | --- | --- |
| Client (Next.js) | Vercel | https://studiospace.vercel.app |
| Server (Express) | Render | https://studiospace-api.onrender.com |
| Database | MongoDB Atlas | `studio-card`, `bookings`, `wishlist` + Better Auth collections |

The client repository is [habib-45/assignment-8](https://github.com/habib-45/assignment-8),
the API repository is
[habib-45/assignment-8-back](https://github.com/habib-45/assignment-8-back).

## Client on Vercel

**Import settings**

| Field | Value |
| --- | --- |
| Framework preset | Next.js |
| Root directory | repository root |
| Build command | `next build` (default) |
| Output | default (Next.js runtime) |
| Node version | 20+ (24 locally) |

**Environment variables** (Project → Settings → Environment Variables)

| Key | Value |
| --- | --- |
| `MONGODB_URI` | Atlas connection string used by Better Auth |
| `MONGODB_DB_NAME` | e.g. `studiospace` |
| `BETTER_AUTH_SECRET` | long random string |
| `BETTER_AUTH_URL` | `https://studiospace.vercel.app` |
| `AUTH_JWT_SECRET` | identical to the Render value |
| `API_URL` | `https://studiospace-api.onrender.com` |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | optional |

Redeploy after changing an environment variable — Next.js inlines
`process.env` values at build time.

### Why the app survives a hard reload

- Every page is a real App Router route, so `/studios`, `/my-bookings`,
  `/studios/edit/[id]` and friends resolve on a fresh request instead of 404ing.
- `AuthProvider` restores the Better Auth session from the cookie on mount, so a
  private route renders its own content — it is never bounced to `/login`.
- API calls are same-origin (`/api/server/*`), so no CORS preflight or
  third-party cookie blocking occurs after a reload.

## Server on Render

| Field | Value |
| --- | --- |
| Runtime | Node |
| Build command | `npm install` |
| Start command | `npm start` |
| Health check | `/api/health` |
| Instance | free/starter is enough for the assignment |

**Environment variables** — same table as [local setup](./local-setup.md),
with `CLIENT_URL=https://studiospace.vercel.app` and `PORT` left to Render.

Notes:

- Set `AUTH_JWT_SECRET` to the **exact same** value as on Vercel or every
  protected request returns `401`.
- The free Render instance sleeps when idle; the first request after a cold
  start takes ~30 s. The client surfaces a retry toast rather than hanging.
- `MONGODB_URI` should be an Atlas URI whose network access allows Render's
  egress IPs (`0.0.0.0/0` is acceptable for a class project).

## Deployment checklist

- [ ] Both repositories pushed and green
- [ ] Vercel env vars set **and** the project redeployed
- [ ] Render env vars set, `CLIENT_URL` points at the Vercel domain
- [ ] `AUTH_JWT_SECRET` identical on both sides
- [ ] Atlas IP access list updated
- [ ] Hard reload on `/studios/[id]`, `/my-bookings`, `/add-studio` renders
      correctly and keeps the session
- [ ] A booking round-trip works end to end (create → cancel/confirm)
- [ ] 404 page shows for an unknown URL and "Return to Home" works
