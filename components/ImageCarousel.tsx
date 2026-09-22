"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";

import type { GalleryImage } from "@/lib/gallery";

import { ImageLightbox } from "./ImageLightbox";

// Tailwind's `sm`. Below it the column is the full width of a phone, and two
// portrait cards side by side would be too small to read anything printed on
// them, so each slide is a single image.
const TWO_UP_QUERY = "(min-width: 640px)";

// Time on each slide before it moves on by itself.
const AUTOPLAY_MS = 5_000;

function subscribe(onChange: () => void) {
  const mq = window.matchMedia(TWO_UP_QUERY);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

/**
 * A row of cards that pages two at a time (one on a phone), opening into the
 * same full-screen lightbox as before when a card is tapped.
 *
 * Built on native scroll-snap rather than a transform-driven track: the swipe
 * on a phone is then the browser's own, with its momentum and its edge
 * behaviour, and there is no gesture code here to get wrong. The arrows and
 * dots only ever call `scrollTo`, and the active dot is read back from the
 * scroll position, so the two ways of moving can never disagree.
 *
 * It advances by itself every five seconds, but holds still whenever that
 * would get in the way: under the pointer or a finger, while a card or a
 * control has focus, while the lightbox is open, off screen, and never at all
 * under `prefers-reduced-motion`. Any move, manual or not, restarts the count,
 * so a slide someone just chose always gets its full five seconds.
 *
 * The list arrives as a prop because it is measured from the files on disk,
 * which only the server can do. Both rows under "Leurs résultats" use this: the
 * avant/après cards, and the message screenshots shared with Témoignages.
 */
export function ImageCarousel({
  images,
  label,
  noun,
}: {
  images: GalleryImage[];
  /** Names the carousel for screen readers, e.g. "Avant / après". */
  label: string;
  /** Passed to the lightbox, and pluralised for the arrows. */
  noun: string;
}) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [page, setPage] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [touching, setTouching] = useState(false);
  const [onScreen, setOnScreen] = useState(false);

  const rootRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLUListElement>(null);

  // Two per slide on the server, so the desktop layout (the one most likely to
  // be seen first-paint at this size) matches without a correction.
  const perView = useSyncExternalStore(
    subscribe,
    () => (window.matchMedia(TWO_UP_QUERY).matches ? 2 : 1),
    () => 2
  );
  const pageCount = Math.ceil(images.length / perView);

  // Which page is showing, from where the track actually is. The last page is
  // pinned to the end of the scroll range: with an odd count its lone card
  // cannot snap to the left edge, so it would otherwise never register.
  const syncPage = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const max = track.scrollWidth - track.clientWidth;
    if (track.scrollLeft >= max - 2) {
      setPage(pageCount - 1);
      return;
    }
    const items = Array.from(track.children) as HTMLElement[];
    const start = items[0]?.offsetLeft ?? 0;
    let closest = 0;
    items.forEach((item, i) => {
      const distance = Math.abs(item.offsetLeft - start - track.scrollLeft);
      const best = Math.abs(items[closest].offsetLeft - start - track.scrollLeft);
      if (distance < best) closest = i;
    });
    setPage(Math.floor(closest / perView));
  }, [pageCount, perView]);

  // Crossing the breakpoint changes what a page is, so re-read it.
  useEffect(syncPage, [syncPage]);

  const goTo = useCallback((target: number) => {
    const track = trackRef.current;
    if (!track) return;
    const next = (target + pageCount) % pageCount;
    const items = Array.from(track.children) as HTMLElement[];
    const item = items[next * perView];
    if (!item) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    track.scrollTo({
      left: item.offsetLeft - items[0].offsetLeft,
      behavior: reduced ? "auto" : "smooth",
    });
  }, [pageCount, perView]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const observer = new IntersectionObserver(([entry]) => setOnScreen(entry.isIntersecting));
    observer.observe(root);
    return () => observer.disconnect();
  }, []);

  const paused = hovered || focused || touching || !onScreen || activeIndex !== null;

  useEffect(() => {
    if (paused || pageCount < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setTimeout(() => goTo(page + 1), AUTOPLAY_MS);
    return () => clearTimeout(t);
  }, [page, paused, pageCount, goTo]);

  const arrowClass =
    "flex h-10 w-10 items-center justify-center rounded-full border border-[#f5eee8]/30 " +
    "text-[#f5eee8]/85 transition-colors duration-200 hover:border-[#f5eee8]/60 " +
    "hover:text-[#f5eee8] focus-visible:outline focus-visible:outline-2 " +
    "focus-visible:outline-offset-2 focus-visible:outline-[#f5eee8]";

  return (
    <section
      ref={rootRef}
      aria-roledescription="carrousel"
      aria-label={label}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      // Only keyboard focus holds it: a mouse click on an arrow also focuses
      // the button, and that would stop the autoplay for as long as it kept
      // focus, which is until the visitor clicks somewhere else entirely.
      onFocus={(e) => setFocused(e.target.matches(":focus-visible"))}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setFocused(false);
      }}
    >
      <ul
        ref={trackRef}
        onScroll={syncPage}
        onTouchStart={() => setTouching(true)}
        onTouchEnd={() => setTouching(false)}
        onTouchCancel={() => setTouching(false)}
        // The padding is room for the hover ring and the focus outline, which
        // sit outside each card and would otherwise be clipped by the scroll
        // container; `scroll-px-1` keeps the snap points in step with it.
        //
        // Every card is a snap point on a phone; from `sm` only the first of
        // each pair is, so a swipe always lands on a whole slide rather than
        // halfway between two.
        className="relative flex snap-x snap-mandatory scroll-px-1 gap-3 overflow-x-auto
                   overscroll-x-contain p-1 [scrollbar-width:none] sm:gap-4
                   [&::-webkit-scrollbar]:hidden"
      >
        {images.map((image, i) => (
          <li
            key={image.src}
            className="shrink-0 basis-full snap-start sm:basis-[calc((100%-1rem)/2)]
                       sm:snap-align-none sm:odd:snap-start"
          >
            <button
              type="button"
              onClick={() => setActiveIndex(i)}
              // The cards are printed on a pale ground, so on this navy section
              // they already stand away from the page. The ring is a hover
              // affordance rather than a border, which is why it is invisible
              // at rest and only answers the pointer.
              className="block w-full overflow-hidden rounded-xl ring-1 ring-transparent
                         transition-shadow duration-200 hover:ring-[#f5eee8]/40
                         focus-visible:outline focus-visible:outline-2
                         focus-visible:outline-offset-2 focus-visible:outline-[#f5eee8]
                         motion-reduce:transition-none"
            >
              {/* `h-auto w-full` at the file's own measured ratio, never
                  `object-cover`: the screenshots are messages, and cropping one
                  would cut someone off mid-sentence. */}
              <Image
                src={image.src}
                alt={image.alt}
                width={image.width}
                height={image.height}
                sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 23vw"
                className="h-auto w-full"
              />
            </button>
          </li>
        ))}
      </ul>

      {pageCount > 1 && (
        <div className="mt-5 flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => goTo(page - 1)}
            aria-label={`${noun}s précédents`}
            className={arrowClass}
          >
            <svg viewBox="0 0 24 24" aria-hidden focusable="false" className="h-4 w-4 fill-none stroke-current stroke-2">
              <path d="M15 5l-7 7 7 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <div className="flex items-center gap-1">
            {Array.from({ length: pageCount }, (_, p) => (
              <button
                key={p}
                type="button"
                onClick={() => goTo(p)}
                aria-label={`Page ${p + 1} sur ${pageCount}`}
                aria-current={p === page ? "true" : undefined}
                className="flex h-8 w-8 items-center justify-center rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-6px] focus-visible:outline-[#f5eee8]"
              >
                <span
                  aria-hidden
                  className={`block h-2 w-2 rounded-full transition-colors duration-200 ${
                    p === page ? "bg-[#f5eee8]" : "bg-[#f5eee8]/25 hover:bg-[#f5eee8]/45"
                  }`}
                />
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => goTo(page + 1)}
            aria-label={`${noun}s suivants`}
            className={arrowClass}
          >
            <svg viewBox="0 0 24 24" aria-hidden focusable="false" className="h-4 w-4 fill-none stroke-current stroke-2">
              <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      )}

      {activeIndex !== null && (
        <ImageLightbox
          images={images}
          index={activeIndex}
          onIndexChange={setActiveIndex}
          onClose={() => setActiveIndex(null)}
          noun={noun}
        />
      )}
    </section>
  );
}
