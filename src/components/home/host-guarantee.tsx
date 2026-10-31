import Link from "next/link";
import { ArrowRightIcon, HeadsetIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { GUARANTEES } from "@/lib/constants";

/** Host guarantee & creator support assurances. */
export function HostGuarantee() {
  return (
    <section className="border-y bg-muted/40 py-16 sm:py-20">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:items-center">
          <div className="flex flex-col items-start gap-5">
            <SectionHeading
              align="left"
              eyebrow="Host guarantee"
              title="Booked with confidence, hosted with backup"
              description="Every reservation on StudioSpace is wrapped in protection for the person opening the door and the person walking in with a camera."
            />
            <Button
              size="lg"
              className="rounded-xl px-6 font-semibold"
              render={<Link href="/how-it-works" />}
            >
              See how it works
              <ArrowRightIcon className="size-4" />
            </Button>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            {GUARANTEES.map((item) => (
              <div
                key={item.title}
                className="flex h-full flex-col gap-3 rounded-2xl border bg-card p-5"
              >
                <span className="flex size-11 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  <item.icon className="size-5" aria-hidden />
                </span>
                <div className="flex flex-col gap-1.5">
                  <h3 className="font-heading text-base font-semibold">
                    {item.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 rounded-2xl border border-primary/30 bg-primary/5 p-5 sm:flex-row">
          <p className="flex items-center gap-3 text-sm text-muted-foreground">
            <HeadsetIcon className="size-5 shrink-0 text-primary" />
            Locked out? Gear missing? Support answers in under 5 minutes, 24/7.
          </p>
          <Button
            variant="outline"
            className="shrink-0 rounded-xl font-semibold"
            render={<Link href="/about" />}
          >
            Meet the team behind the promise
          </Button>
        </div>
      </Container>
    </section>
  );
}
