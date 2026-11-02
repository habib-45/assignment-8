"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { cn } from "cn";

interface StudioGalleryProps {
  images: string[];
  title: string;
  className?: string;
}

/**
 * Embla-backed gallery for a studio's photos: a large primary frame plus a
 * row of clickable thumbnails that stay in sync with the active slide.
 */
export function StudioGallery({ images, title, className }: StudioGalleryProps) {
  const [api, setApi] = useState<CarouselApi>();
  const [active, setActive] = useState(0);

  const onSelect = useCallback((instance: CarouselApi) => {
    if (!instance) return;
    setActive(instance.selectedScrollSnap());
  }, []);

  useEffect(() => {
    if (!api) return;
    onSelect(api);
    api.on("select", onSelect);
    return () => {
      api?.off("select", onSelect);
    };
  }, [api, onSelect]);

  const scrollTo = useCallback(
    (index: number) => {
      api?.scrollTo(index);
    },
    [api]
  );

  if (!images.length) return null;

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <Carousel setApi={setApi} opts={{ loop: true }}>
        <CarouselContent>
          {images.map((src, index) => (
            <CarouselItem key={`${src}-${index}`}>
              <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl border bg-muted">
                <Image
                  src={src}
                  alt={`${title} — photo ${index + 1}`}
                  fill
                  priority={index === 0}
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  className="object-cover"
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="-left-3 bg-background/80 backdrop-blur" />
        <CarouselNext className="-right-3 bg-background/80 backdrop-blur" />
      </Carousel>

      {images.length > 1 ? (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {images.map((src, index) => (
            <button
              key={`thumb-${src}-${index}`}
              type="button"
              onClick={() => scrollTo(index)}
              aria-label={`Show photo ${index + 1}`}
              aria-current={index === active}
              className={cn(
                "relative aspect-[4/3] w-20 shrink-0 overflow-hidden rounded-lg border-2 transition",
                index === active
                  ? "border-primary"
                  : "border-transparent opacity-70 hover:opacity-100"
              )}
            >
              <Image
                src={src}
                alt=""
                fill
                sizes="80px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
