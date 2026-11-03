# Deployment

| Piece | Host | URL |
| --- | --- | --- |
| Client (Next.js) | Vercel | https://assignment-8-frond.vercel.app |
| Server (Express) | Vercel | https://assignment-8-backend-ivory.vercel.app |
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
| `BETTER_AUTH_URL` | `https://assignment-8-frond.vercel.app` |
| `AUTH_JWT_SECRET` | identical to the API project's value |
| `API_URL` | `https://assignment-8-backend-ivory.vercel.app` |
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

## Server on Vercel

The Express app ships as a single serverless function in the
`assignment-8-backend` project:

| Field | Value |
| --- | --- |
| Entry point | `api/index.js` — re-exports the app built in `index.js` |
| Routing | `vercel.json` rewrites `/(.*)` → `/api`; Express owns every path |
| Framework preset | Express |
| Root directory | repository root (a stale subfolder setting fails every build) |
| Deploy | `vercel link --yes --project assignment-8-backend && vercel --prod` |

`index.js` exports the app and only calls `app.listen()` when `VERCEL` is
unset, so `npm start` still runs it as a regular Node process on Render, a VPS
or your machine. When `VERCEL` is set, a memoised middleware opens the MongoDB
connection and creates the indexes on the first request of each cold start
(and resets itself on failure so the next request retries).

**Environment variables** — same table as [local setup](./local-setup.md),
plus:

| Key | Value |
| --- | --- |
| `CLIENT_URL` | `https://assignment-8-frond.vercel.app,http://localhost:3000` |
| `MONGODB_DB` | `assign-8` — the catalogue database |
| `AUTH_JWT_SECRET` | must equal the client project's value, character for character |
| `PORT` | unused on Vercel; harmless to keep |

Notes:

- **Deployment Protection must be off** on both projects. If SSO protection is
  enabled, every visitor (and the examiners) get a Vercel login page instead
  of the site — check with `vercel project protection <name>`.
- A wrong `API_URL` on the client shows up as an empty `404` with the header
  `X-Vercel-Error: DNS_HOSTNAME_RESOLVED_PRIVATE`, which means the value still
  points at `localhost`.
- The API is stateless, so a cold start costs one MongoDB connection; the
  client shows a retry toast rather than hanging if it loses the race.

## Deployment checklist

- [ ] Both repositories pushed and green
- [ ] Both Vercel projects linked and deployed (`vercel --prod`)
- [ ] Env vars set on both projects **and** each project redeployed after a change
- [ ] `AUTH_JWT_SECRET` identical on both sides
- [ ] Deployment Protection (SSO) disabled on both projects
- [ ] Atlas IP access list allows Vercel's egress (`0.0.0.0/0` is fine for this project)
- [ ] `GET /api/server/api/health` on the site returns `200`, and
      `GET /api/server/api/bookings` without a cookie returns `401`
- [ ] Hard reload on `/studios/[id]`, `/my-bookings`, `/add-studio` renders
      correctly and keeps the session
- [ ] A booking round-trip works end to end (create → cancel/confirm)
- [ ] 404 page shows for an unknown URL and "Return to Home" works
