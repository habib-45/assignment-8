import Link from "next/link";
import { ArrowUpRightIcon } from "lucide-react";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { CATEGORY_ICONS, CATEGORIES } from "@/lib/constants";

/**
 * Browse-by-category cards. Each one deep-links to /studios with the
 * category pre-selected via the query string.
 */
export function CategoryGrid() {
  return (
    <section className="bg-muted/40 py-16 sm:py-20">
      <Container>
        <SectionHeading
          eyebrow="Browse by category"
          title="Every kind of creative room"
          description="From cyc walls to podcast booths — jump straight into the category that matches your next production."
        />

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {CATEGORIES.map((category) => {
            const Icon = CATEGORY_ICONS[category.value];
            return (
              <Link
                key={category.value}
                href={`/studios?category=${category.value}`}
                className="group relative flex h-full flex-col gap-4 rounded-2xl border bg-card p-5 transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                <div className="flex items-start justify-between">
                  <span className="flex size-12 items-center justify-center rounded-xl bg-primary/12 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <Icon className="size-6" aria-hidden />
                  </span>
                  <ArrowUpRightIcon className="size-4 text-muted-foreground transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <h3 className="font-heading text-base font-semibold">
                    {category.plural}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {category.short}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
