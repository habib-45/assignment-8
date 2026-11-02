"use client";

import * as React from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { RatingStars } from "@/components/shared/rating-stars";
import { StudioGridSkeleton } from "@/components/shared/skeletons";
import { ResultsError } from "@/components/studios/results-state";

import { ArrowRight, MapPin, RefreshCw, UsersIcon } from "lucide-react";
import Image from "next/image";

import { fetchStudios } from "@/lib/studio-api";
import { CATEGORY_LABELS } from "@/lib/constants";
import { formatMoney } from "@/lib/format";
import { FALLBACK_STUDIO_IMAGE } from "@/lib/images";
import type { Studio } from "@/lib/types";

/** Home grid always shows six hand-picked spaces, newest first. */
const FEATURED_LIMIT = 6;

export function FeaturedStudios() {
  const [studios, setStudios] = React.useState<Studio[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [failed, setFailed] = React.useState(false);
  const [message, setMessage] = React.useState(
    "Please check your backend server and try again."
  );

  // Fetch studios from the shared adapter (dedupes the seed catalogue).
  const load = React.useCallback(async () => {
    setLoading(true);
    setFailed(false);

    try {
      const data = await fetchStudios();
      setStudios(data.slice(0, FEATURED_LIMIT));
    } catch (error) {
      setMessage(
        error instanceof Error && error.message
          ? error.message
          : "Please check your backend server and try again."
      );
      setFailed(true);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    void load();
  }, [load]);

  return (
    <section className="py-16 sm:py-20">
      <Container>
        {/* Section Heading */}
        <div className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            align="left"
            eyebrow="Handpicked for you"
            title="Featured Studio Spaces"
            description="Explore top-rated creative spaces for photography, music, video production and more."
          />

          <Button
            nativeButton={false}
            variant="outline"
            size="lg"
            className="shrink-0 rounded-xl px-5 font-semibold"
            render={<Link href="/studios" />}
          >
            Explore All Studios
            <ArrowRight className="ml-2 size-4" />
          </Button>
        </div>

        {/* Loading State */}
        {loading && <StudioGridSkeleton count={FEATURED_LIMIT} />}

        {/* Error State */}
        {!loading && failed && (
          <ResultsError message={message} onRetry={load} />
        )}

        {/* Empty State */}
        {!loading && !failed && studios.length === 0 && (
          <div className="rounded-2xl border border-dashed p-10 text-center">
            <h3 className="text-lg font-semibold">No studios available</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              New studio spaces will appear here soon.
            </p>
            <Button
              nativeButton={false}
              className="mt-5 rounded-xl"
              render={<Link href="/add-studio" />}
            >
              List your first studio
            </Button>
          </div>
        )}

        {/* Studio Cards */}
        {!loading && !failed && studios.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {studios.map((studio) => (
              <Card
                key={studio._id}
                className="group overflow-hidden rounded-2xl border bg-card pt-0 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                {/* Studio Image */}
                <div className="relative overflow-hidden">
                  <Image
                    src={studio.images?.[0] || studio.imageUrl || FALLBACK_STUDIO_IMAGE}
                    alt={studio.title}
                    width={600}
                    height={400}
                    className="h-56 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />

                  {/* Category */}
                  <div className="absolute left-3 top-3">
                    <Badge className="rounded-full bg-white px-3 py-1 text-black hover:bg-white">
                      {CATEGORY_LABELS[studio.category]}
                    </Badge>
                  </div>

                  {/* Rating */}
                  <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-black/70 px-3 py-1 text-sm text-white">
                    <span className="text-amber-400">★</span>
                    {studio.rating.toFixed(1)}
                  </div>
                </div>

                {/* Card Content */}
                <CardHeader className="gap-3">
                  <CardAction>
                    <Badge variant="secondary">Featured</Badge>
                  </CardAction>

                  <CardTitle className="line-clamp-1 text-xl">
                    {studio.title}
                  </CardTitle>

                  <CardDescription className="line-clamp-2 min-h-10">
                    {studio.overview}
                  </CardDescription>

                  {/* Location + capacity */}
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                    <span className="flex items-center gap-2">
                      <MapPin className="size-4" />
                      {studio.location}
                    </span>
                    <span className="flex items-center gap-2">
                      <UsersIcon className="size-4" />
                      Up to {studio.maxCapacity}
                    </span>
                  </div>

                  <RatingStars
                    rating={studio.rating}
                    count={studio.reviews.length}
                  />
                </CardHeader>

                {/* Card Footer */}
                <CardFooter className="flex items-center justify-between gap-3 border-t pt-4">
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Starting from
                    </p>

                    <p className="text-lg font-bold">
                      {formatMoney(studio.hourlyRate)}
                      <span className="text-sm font-normal text-muted-foreground">
                        /hour
                      </span>
                    </p>
                  </div>

                  <Button
                    nativeButton={false}
                    className="rounded-xl"
                    render={<Link href={`/studios/${studio._id}`} />}
                  >
                    View Details
                    <ArrowRight className="ml-2 size-4" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}
