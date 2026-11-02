import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { StudioDetail } from "@/components/studios/studio-detail";
import { DetailsSkeleton } from "@/components/shared/skeletons";
import { fetchStudioById } from "@/lib/studio-api";
import type { Studio } from "@/lib/types";
import { Suspense } from "react";

interface StudioDetailPageProps {
  params: Promise<{ id: string }>;
}

async function getStudio(id: string): Promise<Studio | null> {
  try {
    return await fetchStudioById(id);
  } catch {
    return null;
  }
}

export async function generateMetadata(
  props: StudioDetailPageProps
): Promise<Metadata> {
  const { id } = await props.params;
  const studio = await getStudio(id);
  if (!studio) return { title: "Studio not found" };
  return {
    title: `${studio.title} · StudioSpace`,
    description: studio.overview.slice(0, 150),
  };
}

export default async function StudioDetailPage(props: StudioDetailPageProps) {
  const { id } = await props.params;
  const studio = await getStudio(id);
  if (!studio) notFound();

  return (
    <Suspense fallback={<DetailsSkeleton />}>
      <StudioDetail studio={studio} />
    </Suspense>
  );
}
