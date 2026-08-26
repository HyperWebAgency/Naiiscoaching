"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef } from "react";

import type { GalleryImage } from "@/lib/gallery";

/**
 * Full-screen lightbox opened from a thumbnail. Slides across the whole set it
 * is given — not just whichever rows a grid currently shows — so "Voir plus"
 * and browsing here stay two separate questions.
 *
 * Serves both galleries on the site: the message screenshots under Témoignages
 * and the avant/après cards under Qui je suis. Each image carries its own
 * measured size, so an upload that is not the usual 1279×1600 portrait still
 * gets the right box reserved for it.
 */
export function ImageLightbox({
  images,
  index,
  onIndexChange,
  onClose,
  noun,
}: {
  images: GalleryImage[];
  index: number;
  onIndexChange: (index: number) => void;
  onClose: () => void;
  /**
   * What is being browsed, as a masculine singular noun — "Témoignage",
   * "Résultat". Names the dialog and its two arrows, so a screen reader says
   * which gallery is open rather than "previous, next" with no subject.
   * Required rather than defaulted: two callers, and neither should inherit the
   * other's wording by accident.
   */
  noun: string;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const touchStartX = useRef<number | null>(null);

  const goTo = useCallback(
    (next: number) => onIndexChange((next + images.length) % images.length),
    [onIndexChange, images.length]
  );

  // Body scroll lock + keyboard nav for as long as the lightbox is open.
  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") goTo(index + 1);
      if (e.key === "ArrowLeft") goTo(index - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [goTo, index, onClose]);

  const image = images[index];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${noun}s clients`}
      className="fixed inset-0 z-[60] flex items-center justify-center bg-[#171426]/90 p-4 backdrop-blur-sm"
      onClick={onClose}
      onTouchStart={(e) => {
        touchStartX.current = e.touches[0].clientX;
      }}
      onTouchEnd={(e) => {
        if (touchStartX.current === null) return;
        const delta = e.changedTouches[0].clientX - touchStartX.current;
        // A real swipe, not a tap that drifted a few pixels.
        if (Math.abs(delta) > 40) goTo(delta < 0 ? index + 1 : index - 1);
        touchStartX.current = null;
      }}
    >
      <button
        ref={closeRef}
        type="button"
        onClick={onClose}
        aria-label="Fermer"
        className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full text-[#f5eee8]/70 transition-colors hover:bg-[#f5eee8]/10 hover:text-[#f5eee8] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f5eee8]"
      >
        <svg viewBox="0 0 24 24" aria-hidden className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
        </svg>
      </button>

      {images.length > 1 && (
        <>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              goTo(index - 1);
            }}
            aria-label={`${noun} précédent`}
            className="absolute left-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full text-[#f5eee8]/70 transition-colors hover:bg-[#f5eee8]/10 hover:text-[#f5eee8] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f5eee8] sm:left-4"
          >
            <svg viewBox="0 0 24 24" aria-hidden className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 6l-6 6 6 6" />
            </svg>
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              goTo(index + 1);
            }}
            aria-label={`${noun} suivant`}
            className="absolute right-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full text-[#f5eee8]/70 transition-colors hover:bg-[#f5eee8]/10 hover:text-[#f5eee8] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f5eee8] sm:right-4"
          >
            <svg viewBox="0 0 24 24" aria-hidden className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 6l6 6-6 6" />
            </svg>
          </button>
        </>
      )}

      <div className="relative max-h-[85vh] max-w-[90vw]" onClick={(e) => e.stopPropagation()}>
        <Image
          key={image.src}
          src={image.src}
          alt={image.alt}
          width={image.width}
          height={image.height}
          sizes="90vw"
          className="max-h-[85vh] w-auto rounded-xl object-contain"
          priority
        />
      </div>

      <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[0.75rem] font-medium tracking-[0.08em] text-[#f5eee8]/60">
        {index + 1} / {images.length}
      </p>
    </div>
  );
}
