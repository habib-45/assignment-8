import { Container } from "@/components/shared/container";
import { DetailsSkeleton } from "@/components/shared/skeletons";

export default function StudioDetailLoading() {
  return (
    <Container className="py-8 md:py-12">
      <DetailsSkeleton />
    </Container>
  );
}
