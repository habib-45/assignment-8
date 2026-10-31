"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRightIcon, RefreshCwIcon, TelescopeIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { EmptyState } from "@/components/shared/empty-state";
import { StudioGridSkeleton } from "@/components/shared/skeletons";
import { StudioCard } from "@/components/studios/studio-card";
import { apiFetch } from "@/lib/api";
import type { Studio } from "@/lib/types";

/**
 * Featured studios — fetched dynamically from MongoDB through the Express
 * API (`.limit(6)` of the highest-rated / newest spaces).
 */
export function FeaturedStudios() {
  const [studios, setStudios] = React.useState<Studio[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [failed, setFailed] = React.useState(false);

  const load = React.useCallback(async () => {
    setLoading(true);
    setFailed(false);
    try {
      const data = await apiFetch<Studio[]>(
        "/studios?featured=true&limit=6"
      );
      setStudios(data);
    } catch {
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
        <div className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            align="left"
            eyebrow="Handpicked for you"
            title="Featured Studio Spaces"
            description="Top-rated and freshly listed rooms from verified hosts — updated live from our studios collection."
          />
          <Button
            variant="outline"
            size="lg"
            className="shrink-0 rounded-xl px-5 font-semibold"
            render={<Link href="/studios" />}
          >
            Browse all studios
            <ArrowRightIcon className="size-4" />
          </Button>
        </div>

        {loading ? (
          <StudioGridSkeleton count={6} />
        ) : failed ? (
          <EmptyState
            icon={RefreshCwIcon}
            title="We couldn't reach the studio feed"
            description="The listings service didn't respond. Check that the Express API is running and try again."
            action={
              <Button
                onClick={() => void load()}
                className="rounded-xl px-5 font-semibold"
              >
                Retry
                <RefreshCwIcon className="size-4" />
              </Button>
            }
          />
        ) : studios.length === 0 ? (
          <EmptyState
            icon={TelescopeIcon}
            title="No studios published yet"
            description="Be the first creative to list a space — featured studios appear here the moment they go live."
            action={
              <Button
                className="rounded-xl px-5 font-semibold"
                render={<Link href="/add-studio" />}
              >
                Add the first studio
                <ArrowRightIcon className="size-4" />
              </Button>
            }
          />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {studios.map((studio) => (
              <StudioCard key={studio._id} studio={studio} />
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}
