"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  ImagePlusIcon,
  Loader2Icon,
  MapPinIcon,
  SaveIcon,
  SparklesIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AMENITIES, EXPLORE_CATEGORIES } from "@/lib/constants";
import { ApiError } from "@/lib/api";
import { createStudio, updateStudio } from "@/lib/studio-api";
import { FALLBACK_STUDIO_IMAGE } from "@/lib/images";
import { formatMoney } from "@/lib/format";
import type { Studio, StudioPayload } from "@/lib/types";
import { useAuth } from "@/providers/auth-provider";

interface StudioFormProps {
  /** Prefilled values — present only on /studios/edit/[id]. */
  studio?: Studio;
}

interface FormState {
  title: string;
  category: string;
  hourlyRate: string;
  securityDeposit: string;
  maxCapacity: string;
  location: string;
  imageUrl: string;
  gallery: string;
  overview: string;
}

const EMPTY: FormState = {
  title: "",
  category: "photo-studio",
  hourlyRate: "",
  securityDeposit: "",
  maxCapacity: "",
  location: "",
  imageUrl: "",
  gallery: "",
  overview: "",
};

/** Client-side mirror of the API's validation rules. */
function validate(state: FormState): string[] {
  const issues: string[] = [];
  if (state.title.trim().length < 3 || state.title.trim().length > 120) {
    issues.push("Title must be between 3 and 120 characters.");
  }
  if (!(Number(state.hourlyRate) >= 1)) {
    issues.push("Hourly rate must be at least $1.");
  }
  if (!(Number(state.securityDeposit) >= 0)) {
    issues.push("Security deposit can't be negative.");
  }
  if (!Number.isInteger(Number(state.maxCapacity)) || Number(state.maxCapacity) < 1) {
    issues.push("Max capacity must be a whole number of at least 1.");
  }
  if (state.location.trim().length < 3) {
    issues.push("Tell us where the studio is (at least 3 characters).");
  }
  if (state.overview.trim().length < 30) {
    issues.push("Detailed overview needs at least 30 characters.");
  }
  return issues;
}

function toPayload(state: FormState, amenities: string[]): StudioPayload {
  const gallery = state.gallery
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  const images = [state.imageUrl.trim(), ...gallery].filter(Boolean);

  return {
    title: state.title.trim(),
    category: state.category as StudioPayload["category"],
    hourlyRate: Number(state.hourlyRate),
    securityDeposit: Number(state.securityDeposit || 0),
    maxCapacity: Number(state.maxCapacity),
    location: state.location.trim(),
    imageUrl: images[0] ?? "",
    images,
    amenities,
    overview: state.overview.trim(),
  };
}

/**
 * The single Add / Edit listing form. Host info is read-only (it comes from
 * the verified session), amenities are checkbox tags, and submission maps to
 * POST / PUT on the protected studio routes before redirecting to /my-listings.
 */
export function StudioForm({ studio }: StudioFormProps) {
  const router = useRouter();
  const { user } = useAuth();
  const isEdit = Boolean(studio);

  const [state, setState] = React.useState<FormState>(() =>
    studio
      ? {
          title: studio.title,
          category: studio.category,
          hourlyRate: String(studio.hourlyRate),
          securityDeposit: String(studio.securityDeposit),
          maxCapacity: String(studio.maxCapacity),
          location: studio.location,
          imageUrl: studio.imageUrl,
          gallery: studio.images.slice(1).join("\n"),
          overview: studio.overview,
        }
      : EMPTY
  );
  const [amenities, setAmenities] = React.useState<string[]>(
    () => studio?.amenities ?? []
  );
  const [submitting, setSubmitting] = React.useState(false);

  const preview = state.imageUrl.trim() || studio?.images[0] || FALLBACK_STUDIO_IMAGE;

  const set = (key: keyof FormState) => (value: string) =>
    setState((current) => ({ ...current, [key]: value }));

  const toggleAmenity = (amenity: string) =>
    setAmenities((current) =>
      current.includes(amenity)
        ? current.filter((item) => item !== amenity)
        : [...current, amenity]
    );

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;

    const issues = validate(state);
    if (issues.length) {
      toast.error("Check the listing details", { description: issues[0] });
      return;
    }

    setSubmitting(true);
    try {
      const payload = toPayload(state, amenities);
      if (isEdit && studio) {
        await updateStudio(studio._id, payload);
        toast.success("Listing updated", {
          description: `${payload.title} is live with your latest details.`,
        });
      } else {
        await createStudio(payload);
        toast.success("Studio published", {
          description: `${payload.title} is now visible in Explore Studios.`,
        });
      }
      router.push("/my-listings");
      router.refresh();
    } catch (error) {
      toast.error(isEdit ? "Update failed" : "Publishing failed", {
        description:
          error instanceof ApiError
            ? error.message
            : "We couldn't save the listing. Please try again.",
      });
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8" noValidate>
      {/* Basics */}
      <section className="flex flex-col gap-4 rounded-2xl border bg-card p-5 sm:p-6">
        <div className="flex items-center gap-2">
          <SparklesIcon className="size-4 text-primary" />
          <h2 className="font-heading text-lg font-semibold">Studio basics</h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Title" htmlFor="studio-title" className="sm:col-span-2">
            <Input
              id="studio-title"
              value={state.title}
              onChange={(event) => set("title")(event.target.value)}
              placeholder="Daylight Cyc Wall & Grip Bay"
              className="h-11"
            />
          </Field>

          <Field label="Category" htmlFor="studio-category">
            <Select
              value={state.category}
              onValueChange={(value) => set("category")(value ?? "photo-studio")}
            >
              <SelectTrigger id="studio-category" className="h-11 w-full">
                <SelectValue placeholder="Pick a category" />
              </SelectTrigger>
              <SelectContent>
                {EXPLORE_CATEGORIES.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          <Field label="Location" htmlFor="studio-location">
            <div className="relative">
              <MapPinIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="studio-location"
                value={state.location}
                onChange={(event) => set("location")(event.target.value)}
                placeholder="Gulshan, Dhaka"
                className="h-11 pl-9"
              />
            </div>
          </Field>
        </div>
      </section>

      {/* Pricing */}
      <section className="flex flex-col gap-4 rounded-2xl border bg-card p-5 sm:p-6">
        <h2 className="font-heading text-lg font-semibold">Pricing & capacity</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Hourly rate ($)" htmlFor="studio-rate">
            <Input
              id="studio-rate"
              type="number"
              min={1}
              step="1"
              value={state.hourlyRate}
              onChange={(event) => set("hourlyRate")(event.target.value)}
              placeholder="85"
              className="h-11"
            />
          </Field>
          <Field label="Security deposit ($)" htmlFor="studio-deposit">
            <Input
              id="studio-deposit"
              type="number"
              min={0}
              step="1"
              value={state.securityDeposit}
              onChange={(event) => set("securityDeposit")(event.target.value)}
              placeholder="250"
              className="h-11"
            />
          </Field>
          <Field label="Max capacity" htmlFor="studio-capacity">
            <Input
              id="studio-capacity"
              type="number"
              min={1}
              step="1"
              value={state.maxCapacity}
              onChange={(event) => set("maxCapacity")(event.target.value)}
              placeholder="8"
              className="h-11"
            />
          </Field>
        </div>
        <p className="text-xs text-muted-foreground">
          Guests see{" "}
          <span className="font-semibold text-foreground">
            {Number(state.hourlyRate) > 0
              ? `${formatMoney(Number(state.hourlyRate))} / hr`
              : "your hourly rate"}
          </span>{" "}
          plus the refundable deposit before they book.
        </p>
      </section>

      {/* Photos */}
      <section className="flex flex-col gap-4 rounded-2xl border bg-card p-5 sm:p-6">
        <div className="flex items-center gap-2">
          <ImagePlusIcon className="size-4 text-primary" />
          <h2 className="font-heading text-lg font-semibold">Photos</h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-[200px_1fr]">
          <div className="relative aspect-[4/3] overflow-hidden rounded-xl border bg-muted">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={preview}
              alt="Studio cover preview"
              className="size-full object-cover"
              onError={(event) => {
                event.currentTarget.src = FALLBACK_STUDIO_IMAGE;
              }}
            />
          </div>

          <div className="flex flex-col gap-4">
            <Field label="Cover image URL" htmlFor="studio-image">
              <Input
                id="studio-image"
                type="url"
                value={state.imageUrl}
                onChange={(event) => set("imageUrl")(event.target.value)}
                placeholder="https://images.pexels.com/photos/…"
                className="h-11"
              />
            </Field>
            <Field
              label="Gallery photos"
              htmlFor="studio-gallery"
              hint="One URL per line — shown in the detail page carousel."
            >
              <Textarea
                id="studio-gallery"
                value={state.gallery}
                onChange={(event) => set("gallery")(event.target.value)}
                rows={3}
                placeholder={"https://…/wide-shot.jpg\nhttps://…/grip-corner.jpg"}
                className="min-h-24"
              />
            </Field>
          </div>
        </div>
      </section>

      {/* Amenities */}
      <section className="flex flex-col gap-4 rounded-2xl border bg-card p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="font-heading text-lg font-semibold">Amenities</h2>
          <span className="text-xs text-muted-foreground">
            {amenities.length} selected
          </span>
        </div>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {AMENITIES.map((amenity) => (
            <label
              key={amenity}
              className="flex cursor-pointer items-center gap-2.5 rounded-lg border bg-background px-3 py-2.5 text-sm transition-colors hover:border-primary/40 has-data-checked:border-primary/50 has-data-checked:bg-primary/5"
            >
              <Checkbox
                checked={amenities.includes(amenity)}
                onCheckedChange={() => toggleAmenity(amenity)}
              />
              {amenity}
            </label>
          ))}
        </div>
      </section>

      {/* Overview */}
      <section className="flex flex-col gap-4 rounded-2xl border bg-card p-5 sm:p-6">
        <h2 className="font-heading text-lg font-semibold">Detailed overview</h2>
        <Textarea
          value={state.overview}
          onChange={(event) => set("overview")(event.target.value)}
          rows={5}
          placeholder="Describe the room, the gear included, noise levels, access hours and anything a crew should know before they arrive."
          className="min-h-32"
        />
        <p className="text-xs text-muted-foreground">
          {state.overview.trim().length}/30 characters minimum
        </p>
      </section>

      {/* Host (read-only) */}
      <section className="flex flex-col gap-4 rounded-2xl border border-primary/25 bg-primary/5 p-5 sm:p-6">
        <h2 className="font-heading text-lg font-semibold">Host details</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Host name" htmlFor="host-name">
            <Input
              id="host-name"
              value={user?.name ?? ""}
              readOnly
              disabled
              className="h-11 bg-muted/60"
            />
          </Field>
          <Field label="Host email" htmlFor="host-email">
            <Input
              id="host-email"
              type="email"
              value={user?.email ?? ""}
              readOnly
              disabled
              className="h-11 bg-muted/60"
            />
          </Field>
        </div>
        <p className="text-xs text-muted-foreground">
          Taken from your verified session — bookings for this studio arrive in
          this inbox.
        </p>
      </section>

      <Separator />

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Button
          type="button"
          variant="outline"
          size="lg"
          className="rounded-xl font-semibold"
          onClick={() => router.back()}
          disabled={submitting}
        >
          Cancel
        </Button>
        <Button type="submit" size="lg" className="rounded-xl font-semibold" disabled={submitting}>
          {submitting ? (
            <>
              <Loader2Icon className="size-4 animate-spin" />
              {isEdit ? "Saving changes…" : "Publishing studio…"}
            </>
          ) : (
            <>
              <SaveIcon className="size-4" />
              {isEdit ? "Save changes" : "Publish studio"}
            </>
          )}
        </Button>
      </div>

      <p className="text-center text-sm text-muted-foreground">
        Need to check how listings appear first?{" "}
        <Link
          href="/studios"
          className="font-semibold text-primary underline-offset-4 hover:underline"
        >
          Explore Studios
        </Link>
      </p>
    </form>
  );
}

function Field({
  label,
  htmlFor,
  hint,
  className,
  children,
}: {
  label: string;
  htmlFor: string;
  hint?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`flex flex-col gap-2 ${className ?? ""}`}>
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
      {hint ? <p className="text-xs text-muted-foreground">{hint}</p> : null}
    </div>
  );
}
