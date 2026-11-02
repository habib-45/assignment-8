import { Container } from "@/components/shared/container";
import { StudioGridSkeleton } from "@/components/shared/skeletons";
import { Skeleton } from "@/components/ui/skeleton";

/** Route-level skeleton shown while the Explore page hydrates. */
export default function Loading() {
  return (
    <Container className="py-10 md:py-14">
      <div className="mb-8 flex max-w-2xl flex-col gap-3">
        <Skeleton className="h-4 w-28 rounded-full" />
        <Skeleton className="h-9 w-full max-w-lg" />
        <Skeleton className="h-5 w-full" />
      </div>
      <div className="mb-8 flex flex-col gap-3 rounded-2xl border bg-card/60 p-4 md:flex-row">
        <Skeleton className="h-11 flex-1 rounded-xl" />
        <Skeleton className="h-11 w-full rounded-xl md:w-44" />
        <Skeleton className="h-11 w-full rounded-xl md:w-48" />
      </div>
      <StudioGridSkeleton count={6} />
    </Container>
  );
}
