import { StarIcon } from "lucide-react";
import { cn } from "cn";

/** Amber star rating used on cards, details and reviews. */
export function RatingStars({
  rating,
  count,
  size = "sm",
  className,
}: {
  rating: number;
  count?: number;
  size?: "sm" | "md";
  className?: string;
}) {
  const starClass = size === "sm" ? "size-3.5" : "size-4.5";
  return (
    <span
      className={cn("inline-flex items-center gap-1.5", className)}
      aria-label={`Rated ${rating} out of 5`}
    >
      <span className="flex items-center gap-0.5">
        {Array.from({ length: 5 }, (_, index) => (
          <StarIcon
            key={index}
            className={cn(
              starClass,
              index + 1 <= Math.round(rating)
                ? "fill-amber-400 text-amber-400"
                : "fill-muted text-muted"
            )}
          />
        ))}
      </span>
      <span
        className={cn(
          "font-semibold text-foreground",
          size === "sm" ? "text-xs" : "text-sm"
        )}
      >
        {rating.toFixed(1)}
      </span>
      {typeof count === "number" ? (
        <span
          className={cn(
            "text-muted-foreground",
            size === "sm" ? "text-xs" : "text-sm"
          )}
        >
          ({count})
        </span>
      ) : null}
    </span>
  );
}
