import Link from "next/link";
import type { Metadata } from "next";
import {
  ArrowRightIcon,
  CalendarCheckIcon,
  CircleCheckIcon,
  Clock3Icon,
  HeadphonesIcon,
  KeyRoundIcon,
  RefreshCcwIcon,
  SearchIcon,
  ShieldCheckIcon,
  SparklesIcon,
  UsersIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { BOOKING_STEPS } from "@/lib/constants";

export const metadata: Metadata = {
  title: "How It Works",
  description:
    "Discover a studio, pick your hours, book instantly and produce. See exactly how StudioSpace handles reservations, confirmations and cancellations.",
};

/** Booking rules shown to guests — mirrors what the API actually enforces. */
const GUEST_RULES = [
  {
    icon: CalendarCheckIcon,
    title: "Reservations start as Pending",
    description:
      "Your slot is held the moment you book. The host sees it in their dashboard and confirms usually within a couple of hours.",
  },
  {
    icon: CircleCheckIcon,
    title: "Confirmed means locked in",
    description:
      "Once the host approves, the studio is yours for those hours — no one else can reserve the same window.",
  },
  {
    icon: RefreshCcwIcon,
    title: "Cancel free up to 24 hours out",
    description:
      "Change of plans? Cancel a Pending booking any time, or a Confirmed one a day ahead, and the deposit returns in full.",
  },
  {
    icon: ShieldCheckIcon,
    title: "Double-booking is blocked",
    description:
      "Our booking engine checks every Confirmed reservation before accepting, so two crews never arrive at the same door.",
  },
] as const;

/** What a host gets once they list a space. */
const HOST_PERKS = [
  "Publish a listing with real photos, amenities and an hourly rate in under five minutes",
  "Approve or decline requests from your dashboard — you stay in control of the calendar",
  "See the deposit and total payout before every session starts",
  "Get paid out after the shoot, with the refundable deposit returned automatically",
] as const;

export default function HowItWorksPage() {
  return (
    <>
      {/* Header */}
      <section className="border-b bg-muted/40">
        <Container className="py-14 sm:py-20">
          <div className="mx-auto flex max-w-3xl flex-col items-center gap-5 text-center">
            <Badge variant="outline" className="rounded-full px-4 py-1">
              From search to final take
            </Badge>
            <h1 className="text-4xl font-bold text-balance sm:text-5xl">
              Booking a studio takes four steps
            </h1>
            <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">
              StudioSpace keeps the logistics boring so the creative work stays
              exciting. Here is exactly what happens between your first search
              and the moment the lights come up.
            </p>
            <div className="flex flex-wrap justify-center gap-3 pt-2">
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
                List your space
              </Button>
            </div>
          </div>
        </Container>
      </section>

      {/* The four steps */}
      <section className="py-16 sm:py-20">
        <Container>
          <SectionHeading
            eyebrow="The workflow"
            title="Every booking follows the same path"
            description="No hidden fees, no back-and-forth emails. Each step is visible in your dashboard from start to finish."
          />

          <ol className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {BOOKING_STEPS.map((item) => (
              <li
                key={item.step}
                className="flex h-full flex-col gap-4 rounded-2xl border bg-card p-6 transition-shadow hover:shadow-lg hover:shadow-primary/5"
              >
                <div className="flex items-center gap-3">
                  <span className="flex size-12 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm shadow-primary/30">
                    <item.icon className="size-5" aria-hidden />
                  </span>
                  <span className="text-sm font-bold tracking-[0.2em] text-primary/70">
                    STEP {item.step}
                  </span>
                </div>
                <div className="flex flex-col gap-2">
                  <h2 className="font-heading text-lg font-semibold">
                    {item.title}
                  </h2>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      {/* What the statuses mean */}
      <section className="border-y bg-muted/40 py-16 sm:py-20">
        <Container>
          <SectionHeading
            eyebrow="Reservations"
            title="What each booking status means"
            description="Your booking moves through four states. You will see the current one on every card in My Bookings."
          />

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {GUEST_RULES.map((rule) => (
              <div
                key={rule.title}
                className="flex h-full flex-col gap-3 rounded-2xl border bg-card p-5"
              >
                <span className="flex size-11 items-center justify-center rounded-xl bg-primary/12 text-primary">
                  <rule.icon className="size-5" aria-hidden />
                </span>
                <div className="flex flex-col gap-1.5">
                  <h3 className="font-heading text-base font-semibold">
                    {rule.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {rule.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap gap-2">
            {[
              { label: "Pending", className: "bg-amber-500/10 text-amber-600 ring-amber-500/30 dark:text-amber-400" },
              { label: "Confirmed", className: "bg-emerald-500/10 text-emerald-600 ring-emerald-500/30 dark:text-emerald-400" },
              { label: "Completed", className: "bg-sky-500/10 text-sky-600 ring-sky-500/30 dark:text-sky-400" },
              { label: "Cancelled", className: "bg-rose-500/10 text-rose-600 ring-rose-500/30 dark:text-rose-400" },
            ].map((status) => (
              <span
                key={status.label}
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ring-1 ${status.className}`}
              >
                {status.label}
              </span>
            ))}
          </div>
        </Container>
      </section>

      {/* For guests vs for hosts */}
      <section className="py-16 sm:py-20">
        <Container>
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Guests */}
            <div className="flex flex-col gap-5 rounded-2xl border bg-card p-6 sm:p-8">
              <span className="flex size-12 items-center justify-center rounded-xl bg-primary/12 text-primary">
                <SearchIcon className="size-6" aria-hidden />
              </span>
              <div className="flex flex-col gap-2">
                <h2 className="font-heading text-2xl font-semibold">
                  If you are booking
                </h2>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Find the room, pick the hours, show up and shoot. Everything
                  you need lives in one dashboard.
                </p>
              </div>
              <ul className="flex flex-col gap-3">
                {[
                  "Filter by category, city, amenities and price — every listing has real photos",
                  "See the total cost, including the refundable deposit, before you commit",
                  "Track every reservation by status and cancel when plans change",
                  "Reach your host directly from the listing page",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm">
                    <CircleCheckIcon className="mt-0.5 size-4 shrink-0 text-primary" />
                    <span className="leading-relaxed text-muted-foreground">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="mt-auto pt-2">
                <Button
                  className="w-full rounded-xl font-semibold"
                  render={<Link href="/studios" />}
                >
                  Start searching
                  <ArrowRightIcon className="size-4" />
                </Button>
              </div>
            </div>

            {/* Hosts */}
            <div className="flex flex-col gap-5 rounded-2xl border border-primary/30 bg-primary/5 p-6 sm:p-8">
              <span className="flex size-12 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm shadow-primary/30">
                <KeyRoundIcon className="size-6" aria-hidden />
              </span>
              <div className="flex flex-col gap-2">
                <h2 className="font-heading text-2xl font-semibold">
                  If you are hosting
                </h2>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Turn an empty room into recurring income without giving up
                  control of your calendar.
                </p>
              </div>
              <ul className="flex flex-col gap-3">
                {HOST_PERKS.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm">
                    <CircleCheckIcon className="mt-0.5 size-4 shrink-0 text-primary" />
                    <span className="leading-relaxed text-muted-foreground">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="mt-auto pt-2">
                <Button
                  className="w-full rounded-xl font-semibold"
                  render={<Link href="/add-studio" />}
                >
                  List your space
                  <ArrowRightIcon className="size-4" />
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* FAQ */}
      <section className="border-y bg-muted/40 py-16 sm:py-20">
        <Container>
          <SectionHeading
            eyebrow="Good to know"
            title="Questions people ask first"
          />

          <div className="mx-auto mt-10 grid max-w-4xl gap-5 sm:grid-cols-2">
            {[
              {
                q: "How fast do hosts respond?",
                a: "Most hosts confirm within two hours. Your booking stays Pending until they do, so the slot is held for you in the meantime.",
                icon: Clock3Icon,
              },
              {
                q: "Can two crews book the same slot?",
                a: "No. The booking engine checks every Confirmed reservation for overlap before it accepts a new one, so a window can only be sold once.",
                icon: ShieldCheckIcon,
              },
              {
                q: "What exactly is the security deposit?",
                a: "A refundable hold that guards equipment and the space. It is shown alongside the total before you confirm and released after the session.",
                icon: SparklesIcon,
              },
              {
                q: "Who do I talk to on the day?",
                a: "Your host's contact details appear on the booking once it is confirmed, and 24/7 support answers in under five minutes if anything goes wrong.",
                icon: HeadphonesIcon,
              },
            ].map((item) => (
              <div
                key={item.q}
                className="flex flex-col gap-2.5 rounded-2xl border bg-card p-5"
              >
                <div className="flex items-center gap-2.5">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/12 text-primary">
                    <item.icon className="size-4" aria-hidden />
                  </span>
                  <h3 className="font-heading text-base font-semibold">
                    {item.q}
                  </h3>
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {item.a}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section className="py-16 sm:py-20">
        <Container>
          <div className="flex flex-col items-center gap-5 rounded-3xl border border-primary/30 bg-primary/5 px-6 py-12 text-center">
            <span className="flex size-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-sm shadow-primary/30">
              <UsersIcon className="size-7" aria-hidden />
            </span>
            <h2 className="max-w-2xl text-3xl font-bold text-balance sm:text-4xl">
              Ready when you are
            </h2>
            <p className="max-w-xl text-base leading-relaxed text-muted-foreground">
              Browse verified studios across every category, or list your own
              space and start earning from the room you already have.
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
                render={<Link href="/register" />}
              >
                Create an account
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
