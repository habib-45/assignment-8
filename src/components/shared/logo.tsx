import Link from "next/link";
import { Aperture } from "lucide-react";
import { cn } from "cn";

/**
 * StudioSpace wordmark — one component used by the navbar, footer, auth pages
 * and the 404 screen so the brand always renders at the same size/weight.
 */
export function Logo({
  href = "/",
  className,
  iconClassName,
}: {
  href?: string;
  className?: string;
  iconClassName?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "group inline-flex shrink-0 items-center gap-2.5 rounded-xl outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
        className
      )}
      aria-label="StudioSpace home"
    >
      <span
        className={cn(
          "flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm shadow-primary/30 transition-transform group-hover:-rotate-6",
          iconClassName
        )}
      >
        <Aperture className="size-5" aria-hidden />
      </span>
      <span className="font-heading text-lg font-bold tracking-tight text-foreground">
        Studio<span className="text-primary">Space</span>
      </span>
    </Link>
  );
}
