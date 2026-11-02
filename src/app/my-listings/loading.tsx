import { Container } from "@/components/shared/container";
import { StudioCardSkeleton } from "@/components/shared/skeletons";

export default function MyListingsLoading() {
  return (
    <Container className="py-10 md:py-14">
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }, (_, index) => (
          <StudioCardSkeleton key={index} />
        ))}
      </div>
    </Container>
  );
}
