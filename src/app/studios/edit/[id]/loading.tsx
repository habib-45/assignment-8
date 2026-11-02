import { Container } from "@/components/shared/container";
import { LoadingScreen } from "@/components/shared/skeletons";

export default function EditStudioLoading() {
  return (
    <Container className="py-10 md:py-14">
      <LoadingScreen label="Loading the listing to edit…" />
    </Container>
  );
}
