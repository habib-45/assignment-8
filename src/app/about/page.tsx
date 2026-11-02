import Link from "next/link";
import type { Metadata } from "next";
import {
  ArrowRightIcon,
  Building2Icon,
  CircleCheckIcon,
  EyeIcon,
  Globe2Icon,
  HandshakeIcon,
  HeartHandshakeIcon,
  LightbulbIcon,
  MapPinIcon,
  ShieldCheckIcon,
  SparklesIcon,
  TargetIcon,
  UsersIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "StudioSpace is the peer-to-peer marketplace where creators rent the exact creative space they need by the hour — and hosts earn from studios standing empty between shoots.",
};

/** Numbers that describe the marketplace today. */
const STATS = [
  { value: "16", label: "Verified studios live" },
  { value: "6", label: "Creative categories" },
  { value: "4", label: "Cities across Bangladesh" },
  { value: "24/7", label: "Host support on call" },
] as const;

/** The beliefs the product is actually built around. */
const VALUES = [
  {
    icon: TargetIcon,
    title: "Photos, not promises",
    description:
      "Every listing shows real photographs of the room, the gear and the corners you will actually use — so what you see on the listing page is what you walk into.",
  },
  {
    icon: HandshakeIcon,
    title: "Fair on both sides",
    description:
      "Hosts approve their own bookings and keep control of the calendar. Guests see the full cost, deposit included, before a single rupee moves.",
  },
  {
    icon: ShieldCheckIcon,
    title: "Safe by default",
    description:
      "Verified profiles, refundable deposits and a booking engine that refuses to double-sell a slot keep both the keys and the equipment protected.",
  },
  {
    icon: LightbulbIcon,
    title: "Built for creators",
    description:
      "Made by people who have hunted for a cyc wall at midnight. Every filter, status and dashboard exists because a real production needed it first.",
  },
] as const;

/** Where the marketplace stands apart from a generic rental listing site. */
const DIFFERENTIATORS = [
  "Hourly pricing instead of day rates — book a two-hour podcast session, not a whole day",
  "Statuses that mirror reality: Pending, Confirmed, Completed, Cancelled, all visible at a glance",
  "Double-booking protection that checks Confirmed reservations before it accepts a new one",
  "A host dashboard that manages listings and bookings without leaving the app",
] as const;

export default function AboutPage() {
  return (
    <>
      {/* Header */}
      <section className="border-b bg-muted/40">
        <Container className="py-14 sm:py-20">
          <div className="mx-auto flex max-w-3xl flex-col items-center gap-5 text-center">
            <Badge variant="outline" className="rounded-full px-4 py-1">
              About StudioSpace
            </Badge>
            <h1 className="text-4xl font-bold text-balance sm:text-5xl">
              The creative space marketplace, by the hour
            </h1>
            <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">
              StudioSpace is the peer-to-peer marketplace where creators rent
              the exact creative space they need by the hour — and hosts earn
              from gear-ready studios standing empty between shoots.
            </p>
          </div>
        </Container>
      </section>

      {/* Stats */}
      <section className="py-12">
        <Container>
          <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
            {STATS.map((stat) => (
              <div
                key={stat.label}
                className="flex flex-col items-center gap-1 rounded-2xl border bg-card px-4 py-6 text-center"
              >
                <span className="font-heading text-3xl font-bold text-primary sm:text-4xl">
                  {stat.value}
                </span>
                <span className="text-xs leading-snug text-muted-foreground sm:text-sm">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Story */}
      <section className="py-8 sm:py-12">
        <Container>
          <div className="grid gap-8 lg:grid-cols-[1fr_1.3fr] lg:items-start">
            <SectionHeading
              align="left"
              eyebrow="Our story"
              title="Empty studios on one side, crews without a room on the other"
            />
            <div className="flex flex-col gap-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
              <p>
                Every city has the same mismatch. Photographers, podcasters,
                bands and filmmakers spend days hunting for a room that fits the
                brief, while perfectly equipped studios sit dark between
                bookings — lights rigged, mics tested, nobody coming through
                the door.
              </p>
              <p>
                StudioSpace exists to close that gap. We built a marketplace
                where a host can publish a space in minutes and a creator can
                find it by category, city, amenities and price — then book the
                exact hours they need instead of paying for a whole day.
              </p>
              <p>
                It started as a simple question: why does booking a studio still
                feel like sending messages into the void? The answer became a
                platform with transparent hourly rates, real photos, a status
                every party can trust, and support that actually picks up.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* Values */}
      <section className="border-y bg-muted/40 py-16 sm:py-20">
        <Container>
          <SectionHeading
            eyebrow="What we stand for"
            title="Four principles behind every decision"
            description="Not poster words — these are the trade-offs we make when a feature is hard or a shortcut is tempting."
          />

          <div className="mt-10 grid gap-5 sm:grid-cols-2">
            {VALUES.map((value) => (
              <div
                key={value.title}
                className="flex h-full flex-col gap-3 rounded-2xl border bg-card p-6"
              >
                <span className="flex size-11 items-center justify-center rounded-xl bg-primary/12 text-primary">
                  <value.icon className="size-5" aria-hidden />
                </span>
                <div className="flex flex-col gap-1.5">
                  <h3 className="font-heading text-lg font-semibold">
                    {value.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {value.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Mission / vision */}
      <section className="py-16 sm:py-20">
        <Container>
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="flex flex-col gap-4 rounded-2xl border bg-card p-6 sm:p-8">
              <span className="flex size-12 items-center justify-center rounded-xl bg-primary/12 text-primary">
                <HeartHandshakeIcon className="size-6" aria-hidden />
              </span>
              <div className="flex flex-col gap-2">
                <span className="text-xs font-semibold tracking-[0.22em] text-primary uppercase">
                  Our mission
                </span>
                <h2 className="font-heading text-2xl font-semibold">
                  Make great rooms reachable
                </h2>
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Give every creator access to professional space without the
                professional overhead, and give every host a fair way to earn
                from the room they already built. Fair pricing, honest photos
                and bookings that hold up.
              </p>
            </div>

            <div className="flex flex-col gap-4 rounded-2xl border border-primary/30 bg-primary/5 p-6 sm:p-8">
              <span className="flex size-12 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm shadow-primary/30">
                <EyeIcon className="size-6" aria-hidden />
              </span>
              <div className="flex flex-col gap-2">
                <span className="text-xs font-semibold tracking-[0.22em] text-primary uppercase">
                  Our vision
                </span>
                <h2 className="font-heading text-2xl font-semibold">
                  A network of spaces, one booking away
                </h2>
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground">
                A future where no production is limited by whether it happens
                to own a studio. Where listing a room is as normal as listing a
                spare flat, and finding the right one takes minutes instead of
                a week of phone calls.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* What makes it different */}
      <section className="border-y bg-muted/40 py-16 sm:py-20">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:items-center">
            <div className="flex flex-col items-start gap-5">
              <SectionHeading
                align="left"
                eyebrow="Why StudioSpace"
                title="Not just another rental listing board"
                description="Generic marketplaces treat a podcast booth like a spare bedroom. We built for the way productions actually run."
              />
              <Button
                size="lg"
                nativeButton={false}
                className="rounded-xl px-6 font-semibold"
                render={<Link href="/how-it-works" />}
              >
                See how it works
                <ArrowRightIcon className="size-4" />
              </Button>
            </div>

            <ul className="flex flex-col gap-3">
              {DIFFERENTIATORS.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 rounded-2xl border bg-card p-4"
                >
                  <CircleCheckIcon className="mt-0.5 size-5 shrink-0 text-primary" />
                  <span className="text-sm leading-relaxed text-muted-foreground">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      {/* Categories we cover */}
      <section className="py-16 sm:py-20">
        <Container>
          <SectionHeading
            eyebrow="What you can book"
            title="Six kinds of creative room"
            description="From cyc walls to colour-calibrated desks — every category is stocked with host-verified spaces."
          />

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: SparklesIcon, title: "Photo Studios", desc: "Cyc walls, daylight lofts and headshot bays" },
              { icon: Building2Icon, title: "Sound Stages", desc: "Cinema stages with grid lighting and drive-in access" },
              { icon: UsersIcon, title: "Podcast Rooms", desc: "Treated lounges wired for multi-mic recording" },
              { icon: Globe2Icon, title: "Music Suites", desc: "Isolated booths, live rooms and mixing desks" },
              { icon: LightbulbIcon, title: "Art Workshops", desc: "Washable studios for ceramics, paint and print" },
              { icon: MapPinIcon, title: "Design Studios", desc: "Colour-calibrated desks for design, 3D and animation" },
            ].map((category) => (
              <Link
                key={category.title}
                href="/studios"
                className="group flex items-start gap-3 rounded-2xl border bg-card p-5 transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/12 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <category.icon className="size-5" aria-hidden />
                </span>
                <span className="flex flex-col gap-1">
                  <span className="font-heading text-base font-semibold">
                    {category.title}
                  </span>
                  <span className="text-sm leading-relaxed text-muted-foreground">
                    {category.desc}
                  </span>
                </span>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section className="pb-16 sm:pb-20">
        <Container>
          <div className="flex flex-col items-center gap-5 rounded-3xl border border-primary/30 bg-primary/5 px-6 py-12 text-center">
            <h2 className="max-w-2xl text-3xl font-bold text-balance sm:text-4xl">
              Come find your room — or list yours
            </h2>
            <p className="max-w-xl text-base leading-relaxed text-muted-foreground">
              Join the creators and hosts already booking space by the hour.
              It takes two minutes to get started.
            </p>
            <div className="flex flex-wrap justify-center gap-3 pt-1">
              <Button
                size="lg"
                className="rounded-xl px-6 font-semibold"
                render={<Link href="/studios" />}
              >
                Explore Studios
                <ArrowRightIcon className="size-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="rounded-xl px-6 font-semibold"
                render={<Link href="/add-studio" />}
              >
                Host your space
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
