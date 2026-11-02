import Image from "next/image";
import Link from "next/link";
import { MapPinIcon, StarIcon, UsersIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RatingStars } from "@/components/shared/rating-stars";
import { CATEGORY_LABELS } from "@/lib/constants";
import { formatMoney } from "@/lib/format";
import { FALLBACK_STUDIO_IMAGE } from "@/lib/images";
import type { Studio } from "@/lib/types";
import { cn } from "cn";

interface StudioCardProps {
  studio: Studio;
  className?: string;
}

/**
 * The canonical listing card — equal height in any grid, used on Home,
 * Explore and the host's listings.
 */
export function StudioCard({ studio, className }: StudioCardProps) {
  const image = studio.images?.[0] || studio.imageUrl || FALLBACK_STUDIO_IMAGE;

  return (
    <article
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-2xl border bg-card transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/10",
        className
      )}
    >
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

        <span className="absolute top-3 right-3 inline-flex items-center gap-1 rounded-full bg-amber-400 px-2 py-0.5 text-xs font-bold text-amber-950 shadow-sm">
          <StarIcon className="size-3 fill-current" />
          {studio.rating.toFixed(1)}
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

          <RatingStars rating={studio.rating} count={studio.reviews.length} />

          <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <UsersIcon className="size-3.5" />
              Up to {studio.maxCapacity}
            </span>
            <span className="inline-flex items-center gap-1">
              <MapPinIcon className="size-3.5" />
              <span className="max-w-[10rem] truncate">{studio.location}</span>
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 border-t pt-3">
          <p className="leading-none">
            <span className="font-heading text-xl font-bold text-primary">
              {formatMoney(studio.hourlyRate)}
            </span>
            <span className="text-xs text-muted-foreground"> / hr</span>
          </p>
          <Button
            size="sm"
            variant="outline"
            className="relative z-10 rounded-lg font-semibold"
            render={<Link href={`/studios/${studio._id}`} />}
          >
            View Details
          </Button>
        </div>
      </div>
    </article>
  );
}
