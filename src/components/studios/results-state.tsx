"use client";

import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { AlertTriangleIcon, CompassIcon, RefreshCwIcon } from "lucide-react";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "cn";

/**
 * Self-contained status block for client-fetched lists (Explore, My Listings,
 * My Bookings). Unlike the shared `EmptyState`, it owns its own CTA markup so
 * pages can pass a plain `{ label, href }` and get consistent buttons.
 */

interface Action {
  label: string;
  href: string;
}

interface ResultsStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: Action;
  className?: string;
}

export function ResultsEmpty({
  icon: Icon = CompassIcon,
  title,
  description,
  action,
  className,
}: ResultsStateProps) {
  return (
    <Empty className={cn("py-16", className)}>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Icon className="size-6" />
        </EmptyMedia>
        <EmptyTitle className="text-xl">{title}</EmptyTitle>
        <EmptyDescription className="max-w-md">{description}</EmptyDescription>
      </EmptyHeader>
      {action ? (
        <EmptyContent>
          <Button
            className="rounded-xl font-semibold"
            render={<Link href={action.href} />}
          >
            {action.label}
          </Button>
        </EmptyContent>
      ) : null}
    </Empty>
  );
}

export function ResultsError({
  message = "Something went wrong while loading.",
  onRetry,
}: {
  message?: string;
  onRetry?: () => void;
}) {
  return (
    <Empty className="py-16">
      <EmptyHeader>
        <EmptyMedia variant="icon" className="bg-rose-500/10 text-rose-500">
          <AlertTriangleIcon className="size-6" />
        </EmptyMedia>
        <EmptyTitle className="text-xl">We hit a snag</EmptyTitle>
        <EmptyDescription className="max-w-md">{message}</EmptyDescription>
      </EmptyHeader>
      {onRetry ? (
        <EmptyContent>
          <Button
            variant="outline"
            className="rounded-xl font-semibold"
            onClick={onRetry}
          >
            <RefreshCwIcon className="size-4" />
            Try again
          </Button>
        </EmptyContent>
      ) : null}
    </Empty>
  );
}

export function ResultsLoading({ label = "Loading studios…" }: { label?: string }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex flex-col items-center justify-center gap-3 py-20"
    >
      <Spinner className="size-8 animate-spin text-primary" />
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  );
}
