"use client";

import Image from "next/image";
import { useRef, useState } from "react";

import type { GalleryImage } from "@/lib/gallery";

import { ImageLightbox } from "./ImageLightbox";

/**
 * Two columns, so four cards is the last complete pair. A fifth would sit alone
 * on a new row with a gap beside it, and every photo after that pushes the
 * biography further from the pitch it belongs to. So four is what shows, and
 * the rest waits behind a button that only exists once there is a rest.
 */
const VISIBLE_COUNT = 4;

/**
 * The avant/après grid, opening into the same full-screen lightbox the message
 * screenshots use. At two columns inside one half of the section these land
 * around 200px wide on a phone, where the weights and the durations printed on
 * them are too small to read — which is the whole point of the cards.
 *
 * Split out of `WhoAmI` rather than making that whole section a client
 * component: this is the only part of it that needs to react to a click, so it
 * is the only part that ships as JavaScript. The list arrives as a prop for the
 * same reason — it is measured from the files on disk, which only the server
 * can do.
 */
export function ResultsGallery({ images }: { images: GalleryImage[] }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [expanded, setExpanded] = useState(false);

  const listRef = useRef<HTMLUListElement>(null);

  // Nothing hidden, nothing to reveal: with four or fewer the button never
  // renders at all, which is what makes this invisible until Anaïs uploads a
  // fifth photo and visible the moment she does.
  const hasMore = images.length > VISIBLE_COUNT;
  const shown = expanded || !hasMore ? images : images.slice(0, VISIBLE_COUNT);

  return (
    <>
      <ul
        ref={listRef}
        id="resultats-galerie"
        className="grid grid-cols-2 gap-3 sm:gap-4 lg:gap-5"
      >
        {shown.map((result, i) => (
          <li key={result.src}>
            <button
              type="button"
              onClick={() => setActiveIndex(i)}
              // The cards are printed on a pale ground, so on this navy section
              // they already stand away from the page — the ring is a hover
              // affordance rather than a border, which is why it is invisible
              // at rest and only answers the pointer.
              className="block w-full overflow-hidden rounded-xl ring-1 ring-transparent
                         transition-[box-shadow,scale] duration-200 hover:ring-[#f5eee8]/40
                         hover:scale-[1.02] focus-visible:outline focus-visible:outline-2
                         focus-visible:outline-offset-2 focus-visible:outline-[#f5eee8]
                         motion-reduce:transition-none motion-reduce:hover:scale-100"
            >
              <Image
                src={result.src}
                alt={result.alt}
                width={result.width}
                height={result.height}
                sizes="(max-width: 1024px) 45vw, 23vw"
                className="h-auto w-full"
              />
            </button>
          </li>
        ))}
      </ul>

      {hasMore && (
        <div className="mt-5 flex justify-center lg:justify-start">
          <button
            type="button"
            aria-expanded={expanded}
            aria-controls="resultats-galerie"
            onClick={() => {
              // Closing scrolls the grid back into view first. Opened to a
              // dozen photos and then collapsed, the button travels hundreds of
              // pixels up the page and leaves the visitor staring at whatever
              // happened to be below it.
              if (expanded) {
                listRef.current?.scrollIntoView({ block: "center" });
              }
              setExpanded((v) => !v);
            }}
            // The beige counterpart of the outlined button under the avis
            // screenshots: same shape and weight, inverted for the navy ground
            // this section sits on.
            className="rounded-full border border-[#f5eee8]/30 px-6 py-2.5 text-[0.8rem]
                       font-semibold uppercase tracking-[0.08em] text-[#f5eee8]/85
                       transition-colors duration-200 hover:border-[#f5eee8]/60
                       hover:text-[#f5eee8] focus-visible:outline focus-visible:outline-2
                       focus-visible:outline-offset-2 focus-visible:outline-[#f5eee8]"
          >
            {expanded
              ? "Voir moins"
              : `Voir toutes les transformations (${images.length})`}
          </button>
        </div>
      )}

      {activeIndex !== null && (
        // Always the full set, never just what the grid is showing: the
        // lightbox's arrows should reach every photo whether or not the grid
        // has been expanded. `shown` and `images` share an order and a start,
        // so the index the grid hands over is right either way.
        <ImageLightbox
          images={images}
          index={activeIndex}
          onIndexChange={setActiveIndex}
          onClose={() => setActiveIndex(null)}
          noun="Résultat"
        />
      )}
    </>
  );
}
