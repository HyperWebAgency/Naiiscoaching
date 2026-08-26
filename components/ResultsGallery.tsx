"use client";

import Image from "next/image";
import { useState } from "react";

import type { GalleryImage } from "@/lib/gallery";

import { ImageLightbox } from "./ImageLightbox";

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

  return (
    <>
      <ul className="grid grid-cols-2 gap-3 sm:gap-4 lg:gap-5">
        {images.map((result, i) => (
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

      {activeIndex !== null && (
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
