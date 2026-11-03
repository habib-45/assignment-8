# Features & routes

## Route inventory

| Route | Access | Purpose |
| --- | --- | --- |
| `/` | public | Hero slider (Swiper), featured studios (`.limit(6)`), category grid, booking workflow, host guarantee, newsletter footer |
| `/studios` | public | Explore grid with search, category filter, sort, empty state |
| `/studios/[id]` | public | Details, gallery carousel, amenities, host, reviews, booking modal |
| `/how-it-works` | public | Four-step booking workflow |
| `/about` | public | Mission, guarantees, team/support copy |
| `/login` | public | Email + password, Google sign-in, forgot-password link, link to register |
| `/register` | public | Name, email, photo URL, password with live validation, Google sign-in |
| `/dashboard` | private | Listings, bookings and saved-studio overview |
| `/add-studio` | private | Create listing form (read-only host name + email) |
| `/my-listings` | private | Own listings with Update / Delete (confirmation modal) |
| `/studios/edit/[id]` | private | Prefilled edit form, read-only host info |
| `/my-bookings` | private | Reservations with status badges, cancel, PDF invoice |
| anything else | — | Custom 404 with studio illustration and "Return to Home" |

Private routes restore the session from the cookie on reload — a logged-in
user is never redirected to `/login`.

## Navbar

- Logo (aperture/studio spotlight mark) on the left, sticky header with
  active-route underline indicators.
- Links: **Home**, **Explore Studios**, **How It Works**, **About Us**.
- Guest: **Login** and **Register** buttons.
- Signed in: avatar → dropdown with **Dashboard**, **Add New Studio**,
  **My Studio Listings**, **My Bookings** and **Logout**; the same items are
  repeated in the mobile sheet.
- Theme toggle (light/dark) sits in the header actions.

## Footer

StudioSpace logo and mission statement, quick navigation, popular studio
categories, newsletter input, copyright/terms line, and social links using
the **new X logo** (no Twitter bird).

## Feature checklist

### Content

- [x] Hero slider with ≥ 3 high-res slides and CTAs to `/studios`
- [x] Featured studios fetched from MongoDB with `.limit(6)`
- [x] Category cards that deep-link into `/studios` with the category preset
- [x] "How Booking Works" 4-step section
- [x] "Host Guarantee & Creator Support" section

### Authentication

- [x] Login with toast errors and redirect to the intended route
- [x] Register with password rules (uppercase, lowercase, ≥ 6) enforced in the
      form and on the server
- [x] Google social login on both pages
- [x] Links between Login and Register

### CRUD & bookings

- [x] Add studio → success toast → redirect to `/my-listings`
- [x] Explore grid with title, category badge, rate, location, rating
- [x] Details page with gallery, amenities, host, reviews, booking modal
- [x] My Listings with confirmation modal before delete
- [x] Edit form prefilled, host info read-only, PUT then redirect
- [x] Bookings stored as `Pending`, cancellable while pending, status badges
      for Pending / Confirmed / Completed / Cancelled

### UX & polish

- [x] Skeleton loaders and spinners during fetches and route transitions
- [x] Custom 404 page with illustration and home CTA
- [x] Sonner toasts everywhere; no `window.alert`
- [x] Empty states with CTA buttons for searches and booking lists
- [x] Equal card sizes, consistent heading scale, uniform image ratios
- [x] Responsive at mobile, tablet and desktop breakpoints
- [x] Light/dark theme toggle

### Optional

- [x] PDF booking invoice for Confirmed/Completed reservations
- [x] Saved-studios wishlist persisted in MongoDB
