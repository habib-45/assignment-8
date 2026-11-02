import Link from "next/link";
import { HomeIcon, SearchIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/shared/container";

/** Studio-space illustration: spotlight cone, aperture ring and film strip. */
function StudioIllustration() {
  return (
    <svg
      viewBox="0 0 360 260"
      role="img"
      aria-label="A spotlight shining on an empty studio cyc wall"
      className="w-full max-w-md"
    >
      <defs>
        <linearGradient id="beam" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.55" />
          <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0.02" />
        </linearGradient>
        <linearGradient id="wall" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--color-muted)" />
          <stop offset="100%" stopColor="var(--color-card)" />
        </linearGradient>
      </defs>

      {/* Cyc wall + floor */}
      <path
        d="M20 210 V70 q0-30 30-30 h260 q30 0 30 30 v140 q-40 18-160 18 T20 210 Z"
        fill="url(#wall)"
        stroke="var(--color-border)"
        strokeWidth="2"
      />
      <ellipse cx="180" cy="214" rx="150" ry="24" fill="var(--color-muted)" opacity="0.7" />

      {/* Light beam */}
      <path d="M180 26 L300 206 H60 Z" fill="url(#beam)" />

      {/* Spotlight head */}
      <g transform="translate(180 26)">
        <rect x="-34" y="-22" width="68" height="30" rx="8" fill="var(--color-foreground)" opacity="0.85" />
        <rect x="-40" y="-6" width="80" height="14" rx="7" fill="var(--color-primary)" />
        <path d="M0 -22 L0 -46" stroke="var(--color-border)" strokeWidth="4" strokeLinecap="round" />
        <circle cx="0" cy="-50" r="7" fill="var(--color-foreground)" opacity="0.7" />
      </g>

      {/* Aperture ring */}
      <g transform="translate(180 150)" stroke="var(--color-primary)" strokeWidth="3" fill="none">
        <circle r="44" />
        <path d="M0-44 L22-6 L-22-6 Z" opacity="0.85" />
        <path d="M38 22 L-4 34 L-4 -12 Z" opacity="0.85" />
        <path d="M-38 22 L-16 -26 L26 12 Z" opacity="0.85" />
      </g>

      {/* Film strip */}
      <g fill="var(--color-foreground)" opacity="0.55">
        <rect x="34" y="228" width="292" height="18" rx="4" />
        {Array.from({ length: 12 }, (_, index) => (
          <rect
            key={index}
            x={42 + index * 24}
            y={233}
            width="12"
            height="8"
            rx="2"
            fill="var(--color-background)"
          />
        ))}
      </g>
    </svg>
  );
}

export default function NotFound() {
  return (
    <Container className="flex flex-1 flex-col items-center justify-center py-16 text-center">
      <div className="flex flex-col items-center gap-6">
        <StudioIllustration />

        <div className="flex flex-col items-center gap-3">
          <span className="rounded-full border px-4 py-1 text-xs font-semibold tracking-[0.22em] text-primary uppercase">
            Error 404
          </span>
          <h1 className="text-4xl font-bold text-balance sm:text-5xl">
            This set is empty
          </h1>
          <p className="max-w-lg text-base leading-relaxed text-muted-foreground sm:text-lg">
            The page you asked for isn&apos;t on the call sheet. It may have been
            unlisted, renamed or never lit at all.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-3">
          <Button
            size="lg"
            className="rounded-xl px-6 font-semibold"
            render={<Link href="/" />}
          >
            <HomeIcon className="size-4" />
            Return to Home
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="rounded-xl px-6 font-semibold"
            render={<Link href="/studios" />}
          >
            <SearchIcon className="size-4" />
            Browse studios
          </Button>
        </div>
      </div>
    </Container>
  );
}
