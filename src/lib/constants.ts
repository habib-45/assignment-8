import {
  Camera,
  Clapperboard,
  Mic,
  Music,
  Palette,
  PenTool,
  Compass,
  MousePointerClick,
  CalendarCheck,
  ClapperboardIcon,
  ShieldCheck,
  BadgeCheck,
  Wrench,
  Headphones,
  type LucideIcon,
} from "lucide-react";
import type { BookingStatus, CategoryMeta, CategoryValue } from "@/lib/types";

/** Studio categories shared by the add form, filters and home cards. */
export const CATEGORIES: CategoryMeta[] = [
  {
    value: "photo-studio",
    label: "Photo Studio",
    plural: "Photo Studios",
    short: "Cyc walls, daylight lofts and headshot bays",
  },
  {
    value: "film-stage",
    label: "Film Stage",
    plural: "Sound Stages",
    short: "Cinema stages with grid lighting and drive-in access",
  },
  {
    value: "podcast-lounge",
    label: "Podcast Lounge",
    plural: "Podcast Rooms",
    short: "Treated lounges wired for multi-mic recording",
  },
  {
    value: "music-suite",
    label: "Music Suite",
    plural: "Music Suites",
    short: "Isolated booths, live rooms and mixing desks",
  },
  {
    value: "art-workshop",
    label: "Art Workshop",
    plural: "Art Workshops",
    short: "Washable studios for ceramics, paint and print",
  },
];

/**
 * Every category the catalogue can contain. The home grid and footer keep the
 * five marketing categories above; the Explore filter uses this full list so
 * no seeded listing is unreachable.
 */
export const EXPLORE_CATEGORIES: CategoryMeta[] = [
  ...CATEGORIES,
  {
    value: "design-studio",
    label: "Design Studio",
    plural: "Design Studios",
    short: "Colour-calibrated desks for design, 3D and animation",
  },
];

export const CATEGORY_ICONS: Record<CategoryValue, LucideIcon> = {
  "photo-studio": Camera,
  "film-stage": Clapperboard,
  "podcast-lounge": Mic,
  "music-suite": Music,
  "art-workshop": Palette,
  "design-studio": PenTool,
};

export const CATEGORY_LABELS = Object.fromEntries(
  EXPLORE_CATEGORIES.map((c) => [c.value, c.label])
) as Record<CategoryValue, string>;

/** Checkbox options offered on the Add / Edit studio forms. */
export const AMENITIES: string[] = [
  "Wi-Fi",
  "Blackout Curtains",
  "Infinity Cyc Wall",
  "Professional Lighting Kit",
  "Green Screen",
  "Makeup Station",
  "Blackout Soundproofing",
  "Live Room Isolation",
  "Mixing Console",
  "Podcast Mics",
  "Monitor Speakers",
  "Acoustic Treatment",
  "Washable Floor & Sinks",
  "Easels & Drying Racks",
  "Metered Parking",
  "Loading Bay",
  "Kitchenette",
  "Climate Control",
  "24/7 Access",
  "Wheelchair Access",
];

export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/studios", label: "Explore Studios" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/about", label: "About Us" },
] as const;

export const SORT_OPTIONS = [
  { value: "newest", label: "Newest first" },
  { value: "rating", label: "Highest rated" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
] as const;

/** Home section — 4-step booking workflow. */
export const BOOKING_STEPS = [
  {
    step: "01",
    title: "Discover Spaces",
    description:
      "Browse verified studios by category, city, amenities and hourly rate — with real photos of every corner.",
    icon: Compass,
  },
  {
    step: "02",
    title: "Select Shoot Hours",
    description:
      "Pick the exact date and the hours you need. Availability and pricing update live before you commit.",
    icon: MousePointerClick,
  },
  {
    step: "03",
    title: "Book Instantly",
    description:
      "Confirm the reservation in one click. Your booking lands in Pending while the host approves the slot.",
    icon: CalendarCheck,
  },
  {
    step: "04",
    title: "Create & Produce",
    description:
      "Show up, plug in and shoot. Gear lists, access codes and host contacts are all in your dashboard.",
    icon: ClapperboardIcon,
  },
] as const;

/** Home section — host guarantee & creator support assurances. */
export const GUARANTEES = [
  {
    title: "Liability Protection",
    description:
      "Every reservation includes up to $25,000 in host liability coverage, so property and people stay protected.",
    icon: ShieldCheck,
  },
  {
    title: "Verified Profiles",
    description:
      "ID-verified badges for hosts and renters keep the community trustworthy before anyone gets the keys.",
    icon: BadgeCheck,
  },
  {
    title: "Equipment Safety",
    description:
      "Damage deposits and condition checklists guard lighting rigs, consoles and instruments on both sides.",
    icon: Wrench,
  },
  {
    title: "24/7 Host Support",
    description:
      "Real humans on call around the clock — from booking disputes to last-minute gear emergencies.",
    icon: Headphones,
  },
] as const;

/** Status badge styling shared by My Bookings and the dashboard. */
export const STATUS_STYLES: Record<
  BookingStatus,
  { className: string; dot: string }
> = {
  Pending: {
    className:
      "bg-amber-500/10 text-amber-600 ring-amber-500/30 dark:text-amber-400",
    dot: "bg-amber-500",
  },
  Confirmed: {
    className:
      "bg-emerald-500/10 text-emerald-600 ring-emerald-500/30 dark:text-emerald-400",
    dot: "bg-emerald-500",
  },
  Completed: {
    className:
      "bg-sky-500/10 text-sky-600 ring-sky-500/30 dark:text-sky-400",
    dot: "bg-sky-500",
  },
  Cancelled: {
    className:
      "bg-rose-500/10 text-rose-600 ring-rose-500/30 dark:text-rose-400",
    dot: "bg-rose-500",
  },
};

export const HOURS_OPTIONS = Array.from({ length: 17 }, (_, i) => i + 6); // 06:00 → 22:00

export const NEWSLETTER_TOPICS =
  "New studios, city guides and creator interviews";
