"use client";

import Image from "next/image";
import { useState } from "react";

import type { GalleryImage } from "@/lib/gallery";

import { ImageLightbox } from "./ImageLightbox";
import { VideoTestimonials } from "./VideoTestimonials";

/**
 * Section four. Anaïs asked for the masthead straight and modest — the earlier
 * poster-scale tilted pair read as taking too much of the page — so the title
 * is now an ordinary centred heading with her line under it, and the video
 * carousel follows close behind.
 *
 * Beige ground with `#2d2a49` type, the same pairing as the hero. That hex is
 * the site's purple; there is no colour variable in the theme to reach for, so
 * it is written out here exactly as every other component writes it.
 *
 * The section is deliberately *not* marked `data-dark-section` — it is a light
 * ground, so the navbar and the scrollbar should stay in their light treatment
 * across it, exactly as they do over the hero.
 */
// Only the first row shows by default; the rest is a click away rather than
// a wall of six screenshots before the visitor has read any of them.
const VISIBLE_COUNT = 3;

export function Testimonials({ reviews }: { reviews: GalleryImage[] }) {
  const [expanded, setExpanded] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const shown = expanded ? reviews : reviews.slice(0, VISIBLE_COUNT);

  return (
    <section
      id="temoignages"
      className="relative bg-[#f5eee8] px-6 py-24 scroll-mt-24 sm:py-28 lg:py-32 lg:px-12"
    >
      <div className="mx-auto flex max-w-[1400px] flex-col">
        {/* Her copy, verbatim: the heading names the section, the line under it
            makes the argument. Uppercasing is left to CSS so screen readers are
            not handed a string of capitals to spell out. */}
        <div className="flex flex-col items-center gap-4 text-center">
          <h2 className="font-extrabold uppercase leading-[1.05] tracking-[-0.02em] text-[#2d2a49] text-[clamp(1.9rem,5.5vw,3.5rem)]">
            Témoignages client·es
          </h2>
          <p className="text-[1.05rem] font-semibold text-[#2d2a49]/80 sm:text-[1.25rem]">
            Elles en parlent mieux que moi.
          </p>
        </div>

        {/* Above the screenshots: someone speaking on camera carries more than
            a screenshot does, and 16:9 cannot be cropped into the portrait grid
            without losing the outer figures and the title along with them. */}
        <VideoTestimonials className="mt-12 lg:mt-16" />

        <ul className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:mt-16 lg:grid-cols-3">
          {shown.map((review, i) => (
            <li key={review.src}>
              {/* Opens the carousel rather than the raw file: these are
                  screenshots of real messages, and at a third of a column the
                  smaller text is not readable, but a new tab per card also
                  meant no way to browse from one to the next. */}
              <button
                type="button"
                onClick={() => setActiveIndex(i)}
                // The card ground is nearly the section's own beige, so without
                // a hairline it would dissolve into the page.
                className="block w-full overflow-hidden rounded-xl ring-1 ring-[#2d2a49]/10 transition-shadow duration-200 hover:ring-[#2d2a49]/25 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2d2a49]"
              >
                <Image
                  src={review.src}
                  alt={review.alt}
                  width={review.width}
                  height={review.height}
                  sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 30vw"
                  className="h-auto w-full"
                />
              </button>
            </li>
          ))}
        </ul>

        {reviews.length > VISIBLE_COUNT && (
          <div className="mt-10 flex justify-center">
            <button
              type="button"
              onClick={() => {
                // Collapsing scrolls back up first: with all six open, closing
                // to three can leave the button — and the visitor — stranded
                // below the fold with nothing under them.
                if (expanded) {
                  document.getElementById("temoignages")?.scrollIntoView({ block: "start" });
                }
                setExpanded((v) => !v);
              }}
              className="rounded-full border border-[#2d2a49]/25 px-6 py-2.5 text-[0.8rem] font-semibold uppercase tracking-[0.08em] text-[#2d2a49] transition-colors duration-200 hover:bg-[#2d2a49]/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2d2a49]"
            >
              {expanded ? "Voir moins" : "Voir plus"}
            </button>
          </div>
        )}
      </div>

      {activeIndex !== null && (
        <ImageLightbox
          images={reviews}
          index={activeIndex}
          onIndexChange={setActiveIndex}
          onClose={() => setActiveIndex(null)}
          noun="Témoignage"
        />
      )}
    </section>
  );
}
