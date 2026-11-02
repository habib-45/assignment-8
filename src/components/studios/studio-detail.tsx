"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowLeftIcon,
  BadgeCheckIcon,
  CalendarCheckIcon,
  CheckIcon,
  MailIcon,
  MapPinIcon,
  MaximizeIcon,
  PencilIcon,
  RulerIcon,
  ShieldCheckIcon,
  StarIcon,
  UsersIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Container } from "@/components/shared/container";
import { RatingStars } from "@/components/shared/rating-stars";
import { StudioGallery } from "@/components/studios/studio-gallery";
import { BookingModal } from "@/components/studios/booking-modal";
import { CATEGORY_LABELS } from "@/lib/constants";
import { formatDate, formatMoney, getInitials } from "@/lib/format";
import { FALLBACK_STUDIO_IMAGE } from "@/lib/images";
import type { Studio } from "@/lib/types";
import { useAuth } from "@/providers/auth-provider";

interface StudioDetailProps {
  studio: Studio;
}

/**
 * Full studio detail: gallery, spec chips, amenities, host card, reviews and
 * the "Book Workspace Now" dialog. Hosts additionally get Edit / Delete
 * shortcuts for their own listing.
 */
export function StudioDetail({ studio }: StudioDetailProps) {
  const { user } = useAuth();
  const [bookingOpen, setBookingOpen] = useState(false);

  const gallery = studio.images?.length
    ? studio.images
    : [studio.imageUrl || FALLBACK_STUDIO_IMAGE];

  const isOwner =
    Boolean(user) && user!.email.toLowerCase() === studio.host.email.toLowerCase();

  return (
    <Container className="py-8 md:py-12">
      <Link
        href="/studios"
        className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeftIcon className="size-4" />
        Back to all studios
      </Link>

      <div className="grid gap-8 lg:grid-cols-[1.6fr_1fr]">
        {/* Left column — gallery + content */}
        <div className="flex flex-col gap-8">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="flex flex-col gap-2">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="outline">
                  {CATEGORY_LABELS[studio.category]}
                </Badge>
                <RatingStars rating={studio.rating} count={studio.reviews.length} />
              </div>
              <h1 className="font-heading text-3xl font-bold sm:text-4xl">
                {studio.title}
              </h1>
              <p className="flex items-center gap-2 text-muted-foreground">
                <MapPinIcon className="size-4 text-primary" />
                {studio.location}
              </p>
            </div>

            {isOwner ? (
              <Button
                variant="outline"
                size="sm"
                render={<Link href={`/studios/edit/${studio._id}`} />}
              >
                <PencilIcon className="size-4" />
                Edit listing
              </Button>
            ) : null}
          </div>

          <StudioGallery images={gallery} title={studio.title} />

          {/* Spec chips */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <SpecCard
              icon={RulerIcon}
              label="Hourly rate"
              value={formatMoney(studio.hourlyRate)}
              suffix="/ hr"
            />
            <SpecCard
              icon={ShieldCheckIcon}
              label="Deposit"
              value={formatMoney(studio.securityDeposit)}
            />
            <SpecCard
              icon={UsersIcon}
              label="Capacity"
              value={`Up to ${studio.maxCapacity}`}
            />
            <SpecCard
              icon={CalendarCheckIcon}
              label="Listed"
              value={formatDate(studio.createdAt)}
            />
          </div>

          {/* Overview */}
          <section className="flex flex-col gap-3">
            <SectionTitle>About this space</SectionTitle>
            <p className="leading-relaxed text-muted-foreground">
              {studio.overview}
            </p>
          </section>

          {/* Amenities */}
          <section className="flex flex-col gap-3">
            <SectionTitle>What's included</SectionTitle>
            <div className="grid gap-2 sm:grid-cols-2">
              {studio.amenities.map((amenity) => (
                <div
                  key={amenity}
                  className="flex items-center gap-2 rounded-lg border bg-card px-3 py-2 text-sm"
                >
                  <CheckIcon className="size-4 shrink-0 text-primary" />
                  {amenity}
                </div>
              ))}
            </div>
          </section>

          <Separator />

          {/* Host */}
          <section className="flex flex-col gap-3">
            <SectionTitle>Meet your host</SectionTitle>
            <div className="flex items-center gap-4 rounded-2xl border bg-card p-4">
              <Avatar className="size-14">
                <AvatarImage src={studio.host.image} alt={studio.host.name} />
                <AvatarFallback>{getInitials(studio.host.name)}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="flex items-center gap-1.5 font-heading font-semibold">
                  {studio.host.name}
                  <BadgeCheckIcon className="size-4 text-primary" />
                </p>
                <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <MailIcon className="size-3.5" />
                  {studio.host.email}
                </p>
              </div>
            </div>
          </section>

          {/* Reviews */}
          <section className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <SectionTitle>Guest reviews</SectionTitle>
              <span className="text-sm text-muted-foreground">
                {studio.reviews.length} review
                {studio.reviews.length === 1 ? "" : "s"}
              </span>
            </div>

            {studio.reviews.length === 0 ? (
              <p className="rounded-2xl border border-dashed bg-card/50 p-6 text-center text-sm text-muted-foreground">
                No reviews yet — be the first to book and leave feedback.
              </p>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {studio.reviews.map((review, index) => (
                  <figure
                    key={`${review.name}-${index}`}
                    className="flex flex-col gap-3 rounded-2xl border bg-card p-4"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="size-9">
                        <AvatarImage src={review.image} alt={review.name} />
                        <AvatarFallback>{getInitials(review.name)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <figcaption className="text-sm font-semibold">
                          {review.name}
                        </figcaption>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(review.date)}
                        </p>
                      </div>
                      <span className="flex items-center gap-1 text-sm font-semibold">
                        <StarIcon className="size-3.5 fill-amber-400 text-amber-400" />
                        {review.rating}
                      </span>
                    </div>
                    <blockquote className="text-sm leading-relaxed text-muted-foreground">
                      {review.comment}
                    </blockquote>
                  </figure>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* Right column — sticky booking panel */}
        <aside className="lg:sticky lg:top-24 lg:h-fit">
          <div className="flex flex-col gap-4 rounded-2xl border bg-card p-5 shadow-lg shadow-primary/5">
            <div className="flex items-baseline justify-between">
              <p className="font-heading text-3xl font-bold text-primary">
                {formatMoney(studio.hourlyRate)}
                <span className="text-sm font-normal text-muted-foreground">
                  {" "}
                  / hour
                </span>
              </p>
              <RatingStars rating={studio.rating} count={studio.reviews.length} />
            </div>

            <Separator />

            <ul className="flex flex-col gap-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <MapPinIcon className="size-4 text-primary" />
                {studio.location}
              </li>
              <li className="flex items-center gap-2">
                <UsersIcon className="size-4 text-primary" />
                Up to {studio.maxCapacity} people
              </li>
              <li className="flex items-center gap-2">
                <MaximizeIcon className="size-4 text-primary" />
                {studio.amenities.length} amenities included
              </li>
              <li className="flex items-center gap-2">
                <ShieldCheckIcon className="size-4 text-primary" />
                {formatMoney(studio.securityDeposit)} refundable deposit
              </li>
            </ul>

            <Button
              className="w-full rounded-xl font-semibold"
              onClick={() => setBookingOpen(true)}
            >
              <CalendarCheckIcon className="size-4" />
              Book Workspace Now
            </Button>

            <p className="text-center text-xs text-muted-foreground">
              Free cancellation up to 24 hours before your slot.
            </p>
          </div>
        </aside>
      </div>

      <BookingModal
        studio={studio}
        open={bookingOpen}
        onOpenChange={setBookingOpen}
      />
    </Container>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-heading text-xl font-semibold">{children}</h2>
  );
}

function SpecCard({
  icon: Icon,
  label,
  value,
  suffix,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  suffix?: string;
}) {
  return (
    <div className="flex flex-col gap-1 rounded-xl border bg-card p-3">
      <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Icon className="size-3.5 text-primary" />
        {label}
      </span>
      <span className="font-heading text-lg font-semibold">
        {value}
        {suffix ? (
          <span className="text-xs font-normal text-muted-foreground">
            {" "}
            {suffix}
          </span>
        ) : null}
      </span>
    </div>
  );
}
