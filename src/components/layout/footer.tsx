"use client";

import * as React from "react";
import Link from "next/link";
import { toast } from "sonner";
import { ArrowRightIcon, MailIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Container } from "@/components/shared/container";
import { Logo } from "@/components/shared/logo";
import { CATEGORIES, NAV_LINKS, NEWSLETTER_TOPICS } from "@/lib/constants";

/* ------------------------------------------------------------------ */
/* Social icons — X uses the current (rebranded) logo, not the bird.   */
/* ------------------------------------------------------------------ */

function SocialLink({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer noopener"
      aria-label={label}
      title={label}
      className="flex size-9 items-center justify-center rounded-lg border bg-background text-muted-foreground transition-all hover:-translate-y-0.5 hover:border-primary hover:text-primary focus-visible:ring-3 focus-visible:ring-ring/50 outline-none"
    >
      {children}
    </a>
  );
}

function XLogo() {
  // The X (formerly Twitter) wordmark glyph.
  return (
    <svg viewBox="0 0 24 24" className="size-4" fill="currentColor" aria-hidden>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.451-6.231Zm-1.161 17.52h1.833L7.084 4.126H5.117l11.966 15.644Z" />
    </svg>
  );
}

function YouTubeLogo() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" fill="currentColor" aria-hidden>
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814ZM9.545 15.568V8.432L15.818 12l-6.273 3.568Z" />
    </svg>
  );
}

function InstagramLogo() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" fill="currentColor" aria-hidden>
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069ZM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12s.014 3.667.072 4.947c.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24s3.667-.014 4.947-.072c4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948s-.014-3.667-.072-4.947c-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0Zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324ZM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8Zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881Z" />
    </svg>
  );
}

function LinkedInLogo() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" fill="currentColor" aria-hidden>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286ZM5.337 7.433a2.062 2.062 0 1 1 0-4.124 2.062 2.062 0 0 1 0 4.124Zm1.782 13.019H3.555V9h3.564v11.452ZM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0Z" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */

/** Evaluated at module load — keeps `new Date()` out of the render path. */
const CURRENT_YEAR = new Date().getFullYear();

export function Footer() {
  const [email, setEmail] = React.useState("");
  const [subscribing, setSubscribing] = React.useState(false);

  const handleSubscribe = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = email.trim();

    if (!/^\S+@\S+\.\S+$/.test(trimmed)) {
      toast.error("That email doesn't look right", {
        description: "Enter a valid email address to join the newsletter.",
      });
      return;
    }

    setSubscribing(true);
    window.setTimeout(() => {
      setSubscribing(false);
      setEmail("");
      toast.success("You're on the list!", {
        description: `${NEWSLETTER_TOPICS} — landing in ${trimmed}.`,
      });
    }, 500);
  };

  return (
    <footer className="border-t bg-muted/30">
      <Container className="py-12 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-4 md:grid-cols-2">
          {/* Brand + mission + socials */}
          <div className="flex flex-col gap-4 lg:col-span-1">
            <Logo />
            <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
              StudioSpace is the peer-to-peer marketplace where creators rent
              the exact creative space they need by the hour — and hosts earn
              from gear-ready studios standing empty between shoots.
            </p>
            <div className="flex items-center gap-2">
              <SocialLink href="https://x.com" label="StudioSpace on X">
                <XLogo />
              </SocialLink>
              <SocialLink
                href="https://youtube.com"
                label="StudioSpace on YouTube"
              >
                <YouTubeLogo />
              </SocialLink>
              <SocialLink
                href="https://instagram.com"
                label="StudioSpace on Instagram"
              >
                <InstagramLogo />
              </SocialLink>
              <SocialLink
                href="https://linkedin.com"
                label="StudioSpace on LinkedIn"
              >
                <LinkedInLogo />
              </SocialLink>
            </div>
          </div>

          {/* Quick navigation */}
          <nav aria-label="Footer quick links" className="flex flex-col gap-3">
            <h3 className="text-sm font-semibold tracking-wide uppercase">
              Quick Links
            </h3>
            <ul className="flex flex-col gap-2.5 text-sm">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground transition-colors hover:text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/dashboard"
                  className="text-muted-foreground transition-colors hover:text-primary"
                >
                  Host Dashboard
                </Link>
              </li>
              <li>
                <Link
                  href="/my-bookings"
                  className="text-muted-foreground transition-colors hover:text-primary"
                >
                  Manage Bookings
                </Link>
              </li>
            </ul>
          </nav>

          {/* Popular categories */}
          <nav
            aria-label="Popular studio categories"
            className="flex flex-col gap-3"
          >
            <h3 className="text-sm font-semibold tracking-wide uppercase">
              Popular Categories
            </h3>
            <ul className="flex flex-col gap-2.5 text-sm">
              {CATEGORIES.map((category) => (
                <li key={category.value}>
                  <Link
                    href={`/studios?category=${category.value}`}
                    className="text-muted-foreground transition-colors hover:text-primary"
                  >
                    {category.plural}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Newsletter */}
          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-semibold tracking-wide uppercase">
              Creator Newsletter
            </h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Monthly drops: new studios in your city, pricing playbooks for
              hosts and interview stories from working creators.
            </p>
            <form
              onSubmit={handleSubscribe}
              className="flex items-center gap-2"
              noValidate
            >
              <label htmlFor="footer-newsletter" className="sr-only">
                Email address
              </label>
              <div className="relative flex-1">
                <MailIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="footer-newsletter"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@studio.com"
                  className="h-10 rounded-xl pl-9"
                  autoComplete="email"
                />
              </div>
              <Button
                type="submit"
                size="lg"
                disabled={subscribing}
                className="h-10 shrink-0 rounded-xl px-4 font-semibold"
                aria-label="Subscribe to the newsletter"
              >
                {subscribing ? "Joining…" : "Join"}
                <ArrowRightIcon className="size-4" />
              </Button>
            </form>
            <p className="text-xs text-muted-foreground">
              No spam, ever. Unsubscribe in one click.
            </p>
          </div>
        </div>

        {/* Copyright + terms notice */}
        <div className="mt-10 flex flex-col gap-3 border-t pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {CURRENT_YEAR} StudioSpace. All rights reserved.
          </p>
          <p className="max-w-xl sm:text-right">
            By browsing or booking on StudioSpace you agree to our Terms of
            Service, Cancellation Policy and Privacy Notice. Equipment deposits
            are refunded within 48 hours of checkout.
          </p>
        </div>
      </Container>
    </footer>
  );
}
