import Image from "next/image";
import Link from "next/link";
import { SparklesIcon } from "lucide-react";
import { Container } from "@/components/shared/container";
import { Logo } from "@/components/shared/logo";
import { pexels } from "@/lib/images";

interface AuthShellProps {
  eyebrow: string;
  title: string;
  description: string;
  children: React.ReactNode;
}

/**
 * Shared chrome for /login and /register: a branded spotlight panel on the
 * left, the form card on the right. Collapses to a single column on mobile.
 */
export function AuthShell({ eyebrow, title, description, children }: AuthShellProps) {
  return (
    <section className="relative isolate overflow-hidden">
      <Container className="grid items-stretch gap-10 py-14 lg:grid-cols-2 lg:gap-16 lg:py-20">
        {/* Brand panel */}
        <div className="relative flex flex-col justify-between gap-10">
          <div className="flex flex-col gap-6">
            <Link href="/" className="w-fit">
              <Logo />
            </Link>

            <div className="flex flex-col gap-4">
              <span className="inline-flex w-fit items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold tracking-wide text-primary">
                <SparklesIcon className="size-3.5" />
                {eyebrow}
              </span>
              <h1 className="font-heading text-3xl leading-tight font-bold sm:text-4xl lg:text-[2.75rem]">
                {title}
              </h1>
              <p className="max-w-lg text-base leading-relaxed text-muted-foreground">
                {description}
              </p>
            </div>

            <div className="relative hidden overflow-hidden rounded-3xl border sm:block">
              <Image
                src={pexels(12622097, 1400)}
                alt="Warm control room with a mixing console"
                width={1200}
                height={800}
                priority
                className="h-64 w-full object-cover lg:h-80"
              />
              <div
                aria-hidden
                className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"
              />
              <div className="absolute right-5 bottom-5 left-5 flex flex-wrap gap-3">
                {["Verified hosts", "Instant confirmation", "Hourly pricing"].map(
                  (item) => (
                    <span
                      key={item}
                      className="rounded-full border border-white/25 bg-black/40 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm"
                    >
                      {item}
                    </span>
                  )
                )}
              </div>
            </div>
          </div>

          <p className="text-xs text-muted-foreground">
            By continuing you agree to the StudioSpace terms of service and our
            host protection policy.
          </p>
        </div>

        {/* Form card */}
        <div className="flex items-center">
          <div className="w-full rounded-3xl border bg-card p-6 shadow-xl shadow-black/5 sm:p-8">
            <div className="mb-6 flex flex-col gap-2">
              <h2 className="font-heading text-xl font-semibold sm:text-2xl">
                {title}
              </h2>
              <p className="text-sm text-muted-foreground">{description}</p>
            </div>
            {children}
          </div>
        </div>
      </Container>
    </section>
  );
}
