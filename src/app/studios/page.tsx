import { Suspense } from "react";
import type { Metadata } from "next";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { StudioFilters } from "@/components/studios/studio-filters";
import { StudioResults } from "@/components/studios/studio-results";
import { StudioGridSkeleton } from "@/components/shared/skeletons";

export const metadata: Metadata = {
  title: "Explore Studios",
  description:
    "Browse verified photo studios, sound stages, podcast lounges, music suites and art workshops — filter by category, city and price.",
};

/** `useSearchParams` requires a Suspense boundary so the shell stays static. */
function ExploreContent() {
  return (
    <>
      <StudioFilters className="mb-8" />
      <Suspense fallback={<StudioGridSkeleton count={6} />}>
        <StudioResults />
      </Suspense>
    </>
  );
}

export default function ExplorePage() {
  return (
    <Container className="py-10 md:py-14">
      <SectionHeading
        eyebrow="Explore Studios"
        title="Find a workspace that fits the brief"
        description="Every listing is host-verified with real photos, transparent hourly rates and live availability. Filter down to the exact room you need."
        align="left"
        className="mb-8 max-w-2xl"
      />
      <ExploreContent />
    </Container>
  );
}
