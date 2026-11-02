import { Container } from "@/components/shared/container";
import { LoadingScreen } from "@/components/shared/skeletons";

export default function AddStudioLoading() {
  return (
    <Container className="py-10 md:py-14">
      <LoadingScreen label="Preparing the listing form…" />
    </Container>
  );
}
