import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";
import { HomeIcon, PencilIcon, PlusCircleIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { PrivateRoute } from "@/components/auth/private-route";
import { StudioForm } from "@/components/studios/studio-form";
import { fetchStudioById } from "@/lib/studio-api";

export const metadata: Metadata = {
  title: "Edit Studio",
  description: "Update pricing, amenities and photos for one of your listings.",
};

interface EditStudioPageProps {
  params: Promise<{ id: string }>;
}

async function getStudio(id: string) {
  try {
    return await fetchStudioById(id);
  } catch {
    return null;
  }
}

export default async function EditStudioPage(props: EditStudioPageProps) {
  const { id } = await props.params;
  const studio = await getStudio(id);
  if (!studio) notFound();

  return (
    <Container className="py-10 md:py-14">
      <PrivateRoute>
        <div className="mb-6 flex flex-wrap items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            className="rounded-xl text-muted-foreground"
            render={<Link href="/my-listings" />}
          >
            <HomeIcon className="size-4" />
            My listings
          </Button>
          <span className="text-muted-foreground">/</span>
          <span className="flex items-center gap-2 text-sm font-medium">
            <PencilIcon className="size-4 text-primary" />
            Edit studio
          </span>
        </div>

        <div className="mb-8">
          <SectionHeading
            align="left"
            eyebrow="Update listing"
            title={`Edit ${studio.title}`}
            description="Changes apply to the public listing straight away — pricing, photos and amenities stay in sync everywhere."
          />
        </div>

        <Suspense fallback={null}>
          <StudioForm studio={studio} />
        </Suspense>
      </PrivateRoute>
    </Container>
  );
}
