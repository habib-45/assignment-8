import { Container } from "@/components/shared/container";
import { TableSkeleton } from "@/components/shared/skeletons";

export default function MyBookingsLoading() {
  return (
    <Container className="py-10 md:py-14">
      <TableSkeleton rows={4} />
    </Container>
  );
}
