"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef } from "react";

type Review = { src: string; alt: string };

/**
 * Full-screen lightbox opened from a testimonial thumbnail. Slides across the
 * whole review set — not just whichever rows the grid currently shows — so
 * "Voir plus" and browsing here stay two separate questions.
 */
export function TestimonialCarousel({
  reviews,
  index,
  onIndexChange,
  onClose,
}: {
  reviews: Review[];
  index: number;
  onIndexChange: (index: number) => void;
  onClose: () => void;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const touchStartX = useRef<number | null>(null);

  const goTo = useCallback(
    (next: number) => onIndexChange((next + reviews.length) % reviews.length),
    [onIndexChange, reviews.length]
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

  const review = reviews[index];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Témoignage client"
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

      {reviews.length > 1 && (
        <>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              goTo(index - 1);
            }}
            aria-label="Témoignage précédent"
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
            aria-label="Témoignage suivant"
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
          key={review.src}
          src={review.src}
          alt={review.alt}
          width={1279}
          height={1600}
          sizes="90vw"
          className="max-h-[85vh] w-auto rounded-xl object-contain"
          priority
        />
      </div>

      <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[0.75rem] font-medium tracking-[0.08em] text-[#f5eee8]/60">
        {index + 1} / {reviews.length}
      </p>
    </div>
  );
}
