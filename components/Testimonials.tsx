"use client";

import Image from "next/image";
import { useState } from "react";

import { TestimonialCarousel } from "./TestimonialCarousel";

/**
 * Each file is already a finished card — its own header, its own branding, the
 * client's messages inside — so it only needs a grid, exactly like the
 * before/after cards in the section above.
 *
 * The alt text summarises what each client actually says rather than repeating
 * "témoignage client" six times: with images off, or on a screen reader, the
 * summaries are the only thing carrying the proof this section exists for.
 */
const REVIEWS = [
  {
    src: "/avis-2.webp",
    alt: "Témoignage : perdue entre les régimes et les programmes trouvés en ligne avant le coaching, elle décrit un suivi entièrement personnalisé et une bien meilleure relation avec la nourriture.",
  },
  {
    src: "/avis-3.webp",
    alt: "Témoignage : après une année familiale très lourde, un coaching à distance entre la France et la Suisse, où les vidéos et les retours précis ont remplacé la présence physique.",
  },
  {
    src: "/avis-4.webp",
    alt: "Témoignage : un poids maîtrisé tout en mangeant plus qu'au début, et des douleurs de genoux disparues après plusieurs opérations.",
  },
  {
    src: "/avis-5.webp",
    alt: "Témoignage : accompagnée pendant la préparation d'un concours, elle décrit un changement complet de routine alimentaire et sportive.",
  },
  {
    src: "/avis-6.webp",
    alt: "Témoignage : dix-huit semaines de préparation, avec un ajustement continu des paramètres et un soutien psychologique dans les phases difficiles.",
  },
  {
    src: "/avis-7.webp",
    alt: "Témoignage : descendu d'une catégorie, de −93 kg à −83 kg, tout en gagnant en force et avec le physique le plus sec de sa vie.",
  },
];

/**
 * Section three. The two words are the section's masthead: type at poster
 * scale, each tilted off the horizontal, no images. The client cards sit
 * underneath.
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

export function Testimonials() {
  const [expanded, setExpanded] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const shown = expanded ? REVIEWS : REVIEWS.slice(0, VISIBLE_COUNT);

  return (
    <section
      id="temoignages"
      // `overflow-hidden` earns its place here: the words are sized in vw and
      // then rotated, and a rotated box is wider than the text inside it. Without
      // the clip, the tilt alone would put the page into horizontal scroll.
      className="relative overflow-hidden bg-[#f5eee8] px-6 py-24 scroll-mt-24 sm:py-28 lg:px-12 lg:py-36"
    >
      <div className="mx-auto flex max-w-[1400px] flex-col">
        {/* One heading, two spans. "Avis" is a graphic echo of "Témoignages"
            rather than a second idea — near-synonyms in French — so it is
            hidden from assistive tech and the heading reads as the single word
            it means. Uppercasing is left to CSS so screen readers are not
            handed a string of capitals to spell out. */}
        <h2 className="flex flex-col items-center font-extrabold uppercase leading-[0.95] tracking-[-0.035em] text-[#2d2a49]">
          <span className="block -rotate-3 text-[clamp(2.5rem,12vw,9.5rem)]">
            Témoignages
          </span>
          {/* Tilted the other way and pushed to the right edge of the word
              above, so the pair reads as a composition rather than two centred
              lines. The shorter word carries a larger size to hold its own
              against the longer one. Leading stays just under 1: any tighter
              and the two tilts bring the glyphs into each other. */}
          <span
            aria-hidden
            className="block self-end rotate-[4deg] text-[clamp(3.5rem,19vw,14rem)]"
          >
            Avis
          </span>
        </h2>

        <ul className="mt-16 grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:mt-24 lg:grid-cols-3">
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
                  width={1279}
                  height={1600}
                  sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 30vw"
                  className="h-auto w-full"
                />
              </button>
            </li>
          ))}
        </ul>

        {REVIEWS.length > VISIBLE_COUNT && (
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
        <TestimonialCarousel
          reviews={REVIEWS}
          index={activeIndex}
          onIndexChange={setActiveIndex}
          onClose={() => setActiveIndex(null)}
        />
      )}
    </section>
  );
}
