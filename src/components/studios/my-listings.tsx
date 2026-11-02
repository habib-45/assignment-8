"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Building2Icon,
  EyeIcon,
  MapPinIcon,
  PencilIcon,
  StarIcon,
  Trash2Icon,
} from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { StudioCardSkeleton } from "@/components/shared/skeletons";
import {
  ResultsEmpty,
  ResultsError,
} from "@/components/studios/results-state";
import { CATEGORY_LABELS } from "@/lib/constants";
import { formatMoney } from "@/lib/format";
import { FALLBACK_STUDIO_IMAGE } from "@/lib/images";
import { ApiError } from "@/lib/api";
import { deleteStudio, fetchStudiosByOwner } from "@/lib/studio-api";
import type { Studio } from "@/lib/types";
import { useAuth } from "@/providers/auth-provider";

type Status = "loading" | "ready" | "error";

/**
 * The signed-in host's listings, filtered by `ownerEmail` on the API side.
 * Deleting always passes through a confirmation modal, then a success toast,
 * and the card disappears without a full reload.
 */
export function MyListings() {
  const router = useRouter();
  const { user, loading: sessionPending } = useAuth();

  const [studios, setStudios] = React.useState<Studio[]>([]);
  const [status, setStatus] = React.useState<Status>("loading");
  const [message, setMessage] = React.useState("");
  const [pendingDelete, setPendingDelete] = React.useState<Studio | null>(null);
  const [deleting, setDeleting] = React.useState(false);

  const email = user?.email;
  const load = React.useCallback(async () => {
    if (!email) return;
    setStatus("loading");
    try {
      const data = await fetchStudiosByOwner(email);
      setStudios(data);
      setStatus("ready");
    } catch (error) {
      setMessage(
        error instanceof ApiError
          ? error.message
          : "We couldn't load your listings."
      );
      setStatus("error");
    }
  }, [email]);

  React.useEffect(() => {
    void load();
  }, [load]);

  async function handleDelete() {
    if (!pendingDelete) return;
    setDeleting(true);
    try {
      await deleteStudio(pendingDelete._id);
      setStudios((current) =>
        current.filter((studio) => studio._id !== pendingDelete._id)
      );
      toast.success("Listing deleted", {
        description: `${pendingDelete.title} is no longer visible to guests.`,
      });
      setPendingDelete(null);
    } catch (error) {
      toast.error("Delete failed", {
        description:
          error instanceof ApiError
            ? error.message
            : "The listing is still there. Please try again.",
      });
    } finally {
      setDeleting(false);
    }
  }

  if (sessionPending || (status === "loading" && !email)) {
    return (
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }, (_, index) => (
          <StudioCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (status === "error") {
    return <ResultsError message={message} onRetry={load} />;
  }

  if (status === "loading") {
    return (
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }, (_, index) => (
          <StudioCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (studios.length === 0) {
    return (
      <ResultsEmpty
        icon={Building2Icon}
        title="You haven't listed a studio yet"
        description="Publish your first space — cyc wall, sound stage or podcast lounge — and start earning from the room you already have."
        action={{ label: "Add New Studio", href: "/add-studio" }}
      />
    );
  }

  return (
    <>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {studios.map((studio) => (
          <ListingCard
            key={studio._id}
            studio={studio}
            onEdit={() => router.push(`/studios/edit/${studio._id}`)}
            onDelete={() => setPendingDelete(studio)}
          />
        ))}
      </div>

      <AlertDialog
        open={Boolean(pendingDelete)}
        onOpenChange={(open) => {
          if (!open && !deleting) setPendingDelete(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this listing?</AlertDialogTitle>
            <AlertDialogDescription>
              {pendingDelete
                ? `"${pendingDelete.title}" will be removed from Explore Studios and any saved wishlists. Bookings already made are kept for your records.`
                : ""}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Keep listing</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              disabled={deleting}
              onClick={(event) => {
                event.preventDefault();
                void handleDelete();
              }}
            >
              {deleting ? "Deleting…" : "Delete permanently"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

function ListingCard({
  studio,
  onEdit,
  onDelete,
}: {
  studio: Studio;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const image = studio.images?.[0] || studio.imageUrl || FALLBACK_STUDIO_IMAGE;

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border bg-card transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/10">
      <div className="relative aspect-[4/3] w-full overflow-hidden">
        <Image
          src={image}
          alt={studio.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
        <Badge
          className="absolute top-3 left-3 bg-black/65 text-white ring-white/20 backdrop-blur-sm hover:bg-black/65"
          variant="outline"
        >
          {CATEGORY_LABELS[studio.category]}
        </Badge>
        <span className="absolute top-3 right-3 inline-flex items-center gap-1 rounded-full bg-emerald-400 px-2 py-0.5 text-xs font-bold text-emerald-950 shadow-sm">
          Published
        </span>
        <div className="absolute right-3 bottom-3 left-3 flex items-center gap-1.5 text-xs font-medium text-white/85">
          <MapPinIcon className="size-3.5 shrink-0 text-amber-300" />
          <span className="truncate">{studio.location}</span>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex flex-1 flex-col gap-2">
          <h3 className="line-clamp-1 font-heading text-lg font-semibold transition-colors group-hover:text-primary">
            <Link
              href={`/studios/${studio._id}`}
              className="rounded-md outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              <span className="absolute inset-0" aria-hidden />
              {studio.title}
            </Link>
          </h3>
          <p className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <StarIcon className="size-3.5 fill-amber-400 text-amber-400" />
              {studio.rating.toFixed(1)}
            </span>
            <span>{studio.reviews.length} review(s)</span>
            <span>Up to {studio.maxCapacity}</span>
          </p>
          <p className="leading-none">
            <span className="font-heading text-xl font-bold text-primary">
              {formatMoney(studio.hourlyRate)}
            </span>
            <span className="text-xs text-muted-foreground"> / hr</span>
          </p>
        </div>

        <div className="relative z-10 flex gap-2 border-t pt-3">
          <Button
            size="sm"
            variant="outline"
            className="flex-1 rounded-lg font-semibold"
            onClick={onEdit}
          >
            <PencilIcon className="size-4" />
            Update
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="flex-1 rounded-lg font-semibold text-destructive hover:bg-destructive/10"
            onClick={onDelete}
          >
            <Trash2Icon className="size-4" />
            Delete
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="rounded-lg px-2.5 text-muted-foreground"
            aria-label={`View ${studio.title}`}
            render={<Link href={`/studios/${studio._id}`} />}
          >
            <EyeIcon className="size-4" />
          </Button>
        </div>
      </div>
    </article>
  );
}
