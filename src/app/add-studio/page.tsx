import type { Metadata } from "next";
import Link from "next/link";
import { HomeIcon, PlusCircleIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { PrivateRoute } from "@/components/auth/private-route";
import { StudioForm } from "@/components/studios/studio-form";

export const metadata: Metadata = {
  title: "Add New Studio",
  description:
    "List your photo studio, sound stage, podcast lounge, music suite or art workshop on StudioSpace and start earning per shoot hour.",
};

export default function AddStudioPage() {
  return (
    <Container className="py-10 md:py-14">
      <PrivateRoute>
        <div className="mb-6 flex flex-wrap items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            className="rounded-xl text-muted-foreground"
            render={<Link href="/" />}
          >
            <HomeIcon className="size-4" />
            Home
          </Button>
          <span className="text-muted-foreground">/</span>
          <span className="flex items-center gap-2 text-sm font-medium">
            <PlusCircleIcon className="size-4 text-primary" />
            Add New Studio
          </span>
        </div>

        <div className="mb-8">
          <SectionHeading
            align="left"
            eyebrow="Host your space"
            title="Publish a new studio listing"
            description="Tell crews what is in the room, what it costs and where it is. Listings go live the moment you hit publish."
          />
        </div>

        <StudioForm />
      </PrivateRoute>
    </Container>
  );
}
