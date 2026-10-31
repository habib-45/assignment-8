import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { BOOKING_STEPS } from "@/lib/constants";

/** 4-step "How booking works" workflow. */
export function HowBookingWorks() {
  return (
    <section className="py-16 sm:py-20">
      <Container>
        <SectionHeading
          eyebrow="How booking works"
          title="From first search to final take in four steps"
          description="StudioSpace keeps the logistics boring so the creative work stays exciting."
        />

        <ol className="relative mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {/* Connecting line (desktop) */}
          <span
            aria-hidden
            className="absolute top-9 right-[12%] left-[12%] hidden h-px bg-gradient-to-r from-transparent via-border to-transparent lg:block"
          />

          {BOOKING_STEPS.map((item) => (
            <li
              key={item.step}
              className="relative flex h-full flex-col gap-4 rounded-2xl border bg-card p-6 transition-shadow hover:shadow-lg hover:shadow-primary/5"
            >
              <div className="flex items-center gap-3">
                <span className="flex size-12 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm shadow-primary/30">
                  <item.icon className="size-5" aria-hidden />
                </span>
                <span className="font-heading text-sm font-bold tracking-[0.2em] text-primary/70">
                  STEP {item.step}
                </span>
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="font-heading text-lg font-semibold">
                  {item.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
