"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import type { Swiper as SwiperType } from "swiper";
import { Autoplay, EffectFade, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  BadgeCheckIcon,
  MapPinIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/shared/container";
import { HERO_IMAGES } from "@/lib/images";

import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/pagination";

const SLIDES = [
  {
    image: HERO_IMAGES.podcast,
    eyebrow: "Photography Cyc Walls",
    title: "Book the perfect frame, hour by hour.",
    subtitle:
      "Daylight lofts, infinity cyc walls and grip-ready bays — compare verified photo studios and lock your shoot window in minutes.",
    stat: "480+ photo studios live now",
  },
  {
    image:
      HERO_IMAGES.filmSet,
    eyebrow: "Cinema Sound Stages",
    title: "Roll camera on a real sound stage.",
    subtitle:
      "Drive-in doors, lighting grids and acoustically isolated stages for narrative, commercial and documentary productions.",
    stat: "Grid-ready stages in 38 cities",
  },
  {
    image:
      HERO_IMAGES.controlRoom,
    eyebrow: "Podcast & Music Rooms",
    title: "Plug in. Press record. Sound great.",
    subtitle:
      "Treated podcast lounges and recording suites with consoles, mics and monitors already dialled in for your session.",
    stat: "Avg. booking confirmed in 11 min",
  },
] as const;

export function HeroSlider() {
  const [swiper, setSwiper] = React.useState<SwiperType | null>(null);
  const [activeIndex, setActiveIndex] = React.useState(0);

  return (
    <section
      aria-label="Featured studio collections"
      className="relative isolate h-[min(88vh,760px)] min-h-[540px] w-full overflow-hidden bg-black"
    >
      <Swiper
        modules={[Autoplay, EffectFade, Pagination]}
        effect="fade"
        loop
        speed={900}
        autoplay={{ delay: 6000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        onSwiper={setSwiper}
        onSlideChange={(instance) => setActiveIndex(instance.realIndex)}
        className="hero-swiper h-full w-full"
      >
        {SLIDES.map((slide, index) => (
          <SwiperSlide key={slide.eyebrow} className="h-full w-full">
            <div className="relative h-full w-full">
              <Image
                src={slide.image}
                alt={slide.title}
                fill
                priority={index === 0}
                sizes="100vw"
                className="object-cover"
              />
              {/* Legibility gradient + spotlight glow */}
              <div
                aria-hidden
                className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-black/25"
              />
              <div
                aria-hidden
                className="spotlight-glow absolute inset-0 opacity-70 mix-blend-screen"
              />

              <Container className="relative flex h-full items-center">
                <div className="flex max-w-2xl flex-col items-start gap-5 pb-16">
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-1.5 text-xs font-semibold tracking-wide text-white backdrop-blur-sm">
                    <BadgeCheckIcon className="size-3.5 text-amber-300" />
                    {slide.eyebrow}
                  </span>

                  <h1 className="text-4xl leading-[1.05] font-bold text-white sm:text-5xl lg:text-6xl">
                    {slide.title}
                  </h1>

                  <p className="max-w-xl text-base leading-relaxed text-white/80 sm:text-lg">
                    {slide.subtitle}
                  </p>

                  <div className="flex flex-wrap items-center gap-3 pt-1">
                    <Button
                      nativeButton={false}
                      size="lg"
                      className="h-12 rounded-xl px-7 text-base font-semibold"
                      render={<Link href="/studios" />}
                    >
                      Explore Studios
                      <ArrowRightIcon className="size-4" />
                    </Button>
                    <Button
                      nativeButton={false}
                      size="lg"
                      variant="outline"
                      className="h-12 rounded-xl border-white/40 bg-white/10 px-7 text-base font-semibold text-white backdrop-blur-sm hover:bg-white/20 hover:text-white dark:border-white/40 dark:bg-white/10 dark:hover:bg-white/20"
                      render={<Link href="/studios" />}
                    >
                      Host Your Space
                    </Button>
                  </div>

                  <p className="flex items-center gap-1.5 pt-1 text-xs font-medium text-white/70">
                    <MapPinIcon className="size-3.5 text-amber-300" />
                    {slide.stat}
                  </p>
                </div>
              </Container>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom arrows */}
      <div className="absolute right-4 bottom-14 z-10 flex items-center gap-2 sm:right-8 lg:right-16">
        <button
          type="button"
          onClick={() => swiper?.slidePrev()}
          aria-label="Previous slide"
          className="flex size-10 items-center justify-center rounded-full border border-white/30 bg-black/30 text-white backdrop-blur-sm transition hover:bg-primary hover:text-primary-foreground focus-visible:ring-3 focus-visible:ring-white/60 outline-none"
        >
          <ArrowLeftIcon className="size-4" />
        </button>
        <button
          type="button"
          onClick={() => swiper?.slideNext()}
          aria-label="Next slide"
          className="flex size-10 items-center justify-center rounded-full border border-white/30 bg-black/30 text-white backdrop-blur-sm transition hover:bg-primary hover:text-primary-foreground focus-visible:ring-3 focus-visible:ring-white/60 outline-none"
        >
          <ArrowRightIcon className="size-4" />
        </button>
      </div>

      {/* Slide counter */}
      <div className="absolute bottom-16 left-0 z-10 w-full">
        <Container>
          <span className="font-heading text-sm font-semibold text-white/70">
            <span className="text-white">
              {String(activeIndex + 1).padStart(2, "0")}
            </span>{" "}
            / {String(SLIDES.length).padStart(2, "0")}
          </span>
        </Container>
      </div>
    </section>
  );
}
