# Local setup

## Prerequisites

| Tool | Version used |
| --- | --- |
| Node.js | 24.x (LTS also fine) |
| npm | 11.x |
| MongoDB | Atlas account, or a local `mongod` on `27017` |
| Git | any recent |

## 1. Clone

```bash
git clone https://github.com/habib-45/assignment-8-back.git
git clone https://github.com/habib-45/assignment-8.git
```

## 2. Server (Express + MongoDB)

```bash
cd assignment-8-back
npm install
cp .env.example .env      # then edit the values
npm run dev               # http://localhost:5000
```

`.env`:

| Key | Purpose |
| --- | --- |
| `MONGODB_USER` / `MONGODB_PASS` | Atlas credentials used to build the connection string |
| `MONGODB_URI` | Full connection string — overrides the two above |
| `MONGODB_DB` | Database name (defaults to `assign-8`) |
| `AUTH_JWT_SECRET` | **Must equal** the client's `AUTH_JWT_SECRET` |
| `CLIENT_URL` | Comma-separated browser origins allowed to send credentials |
| `PORT` | Defaults to `5000` |

## 3. Client (Next.js)

```bash
cd assignment-8
npm install
cp .env.example .env.local
npm run dev                # http://localhost:3000
```

`.env.local`:

| Key | Purpose |
| --- | --- |
| `MONGODB_URI` | Atlas connection string for Better Auth |
| `MONGODB_DB_NAME` | Auth database name (defaults to `studiospace`) |
| `BETTER_AUTH_SECRET` | Better Auth signing secret |
| `BETTER_AUTH_URL` | `http://localhost:3000` while developing |
| `AUTH_JWT_SECRET` | Shared with the API — must match exactly |
| `API_URL` | `http://localhost:5000` — target of the `/api/server/*` rewrite |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | optional, enables Google login |

> The rewrite in `next.config.ts` is what makes the single-origin design work
> locally. If `API_URL` is wrong you will see 502s on `/api/server/*` rather
> than a helpful message.

## 4. Verify

```bash
# server smoke test (20 assertions: auth, CRUD, overlaps, wishlist)
npm test                       # run inside assignment-8-back

# client
npm run lint
npm run build
```

Health check: `GET http://localhost:5000/api/health`.

## Examiner test credentials

| Account | Email | Password |
| --- | --- | --- |
| Demo host & guest | `examiner@studiospace.com` | `Studio1234` |
| Second reviewer | `reviewer@studiospace.com` | `Review1234` |

Registration rules: **uppercase letter, lowercase letter, minimum 6
characters**. Errors and successes are reported with Sonner toasts and custom
modals — the app never uses `window.alert`.

## Scripts

| Command | Where | Purpose |
| --- | --- | --- |
| `npm run dev` | both | development server with hot reload |
| `npm run build` / `npm start` | client | production build and serve |
| `npm run lint` | client | ESLint |
| `npm test` | server | end-to-end API smoke test |
