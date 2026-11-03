# StudioSpace Documentation

StudioSpace is a peer-to-peer marketplace where creators rent production
spaces by the hour and hosts publish the rooms they own. This folder is the
engineering documentation set for the project — start here and follow the
links below.

**Live site:** https://assignment-8-frond.vercel.app
**Live API:** https://assignment-8-backend-ivory.vercel.app

## Documents

| Document | What it covers |
| --- | --- |
| [Architecture](./architecture.md) | System diagram, request paths, auth chain, folder layout, data model |
| [API reference](./api.md) | Every Express endpoint, query/body contracts, response envelope, error codes |
| [Local setup](./local-setup.md) | Prerequisites, environment variables, run instructions, test credentials |
| [Deployment](./deployment.md) | Vercel (client and API) configuration, environment checklist |
| [Features & routes](./features-and-routes.md) | Page inventory, access rules, feature checklist |
| [Challenges & extras](./challenges-and-extras.md) | Security, booking collision, theming, wishlist, PDF invoices, testing |

## Repositories

| Repository | Contents |
| --- | --- |
| [habib-45/assignment-8](https://github.com/habib-45/assignment-8) | Next.js client (this repository) |
| [habib-45/assignment-8-back](https://github.com/habib-45/assignment-8-back) | Express + MongoDB API |

## At a glance

- **Client** — Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4,
  shadcn/ui on Base UI, Sonner toasts, next-themes, Swiper.
- **Auth** — Better Auth with the MongoDB adapter; a signed HS256 JWT is
  bridged into an HTTPOnly cookie for the API.
- **Server** — Express 5 on Node.js with the native MongoDB driver.
- **Database** — MongoDB Atlas: `studio-card`, `bookings`, `wishlist` for the
  product data and Better Auth's plural collections (`users`, `sessions`,
  `accounts`, `verifications`) for identities.
