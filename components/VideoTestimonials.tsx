"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import temoignages from "@/content/temoignages-video.json";

/**
 * Read from content/temoignages-video.json, which Anaïs edits from /admin.
 *
 * She supplies four things per testimonial: the YouTube id, the client's name,
 * the credential line and the quotes. The player title and the poster's alt
 * text are built from those rather than being two more boxes to fill — they are
 * the fields an editor leaves blank, and blank alt text on a poster is a real
 * loss for anyone who cannot see it.
 *
 * Maëva leads because she is first in the file. Her objective is lifestyle,
 * which is 99% of the current clientèle; Aurore's competition physique can read
 * as intimidating to the visitor this page is actually for, so she comes
 * second. Reordering is a drag in the CMS.
 */
const TESTIMONIALS = temoignages.items.map((item) => ({
  id: item.youtubeId,
  name: item.name,
  credential: item.credential,
  title: `Témoignage client : ${item.name} | ${item.credential}`,
  alt: `Témoignage vidéo : ${item.name}, ${item.credential}.`,
  quotes: item.quotes,
}));

// Long enough to read the longest slide's three quotes, per the brief.
const ROTATE_MS = 10_000;

// Same swap as the pricing toggle in Services, so the two moments where the
// page exchanges one block for another feel like the same gesture.
const SWAP_BASE =
  "col-start-1 row-start-1 transition-[opacity,translate,filter] duration-300 " +
  "ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none";
const SWAP_HIDDEN = "pointer-events-none opacity-0 translate-y-2 blur-[5px]";

/**
 * One slide: the click-to-load facade above, the written pull-out below.
 *
 * The facade rather than an iframe on page load, for two reasons. The player
 * pulls in a few hundred KB of third-party script that most visitors will never
 * press play on; and `youtube-nocookie` plus deferring the embed means YouTube
 * is not contacted at all — no cookies, no tracking — until someone actually
 * asks to watch. On a French site that is the difference between needing a
 * consent banner for this and not.
 *
 * The quotes answer "is this worth forty minutes?" before the play button asks
 * it, so pressing play becomes a choice to hear more rather than a gamble.
 */
function Slide({
  testimonial,
  playing,
  onPlay,
}: {
  testimonial: (typeof TESTIMONIALS)[number];
  playing: boolean;
  onPlay: () => void;
}) {
  // 1280×720 and truly 16:9. `hqdefault` is 4:3 with the frame letterboxed into
  // black bars, which would show as banding inside the rounded corners;
  // `mqdefault` is the 16:9 fallback for videos that never got a maxres render.
  const [poster, setPoster] = useState(
    `https://i.ytimg.com/vi/${testimonial.id}/maxresdefault.jpg`
  );

  return (
    <figure>
      {/* `aspect-video` holds the 16:9 box from the first paint, so the poster
          and the iframe that replaces it occupy exactly the same space and
          nothing on the page shifts when it loads. */}
      <div className="relative aspect-video overflow-hidden rounded-xl bg-[#2d2a49] ring-1 ring-[#2d2a49]/10">
        {playing ? (
          <iframe
            // Autoplay is honoured because the click that mounted this iframe
            // is the user gesture browsers require.
            src={`https://www.youtube-nocookie.com/embed/${testimonial.id}?autoplay=1&rel=0`}
            title={testimonial.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="absolute inset-0 h-full w-full"
          />
        ) : (
          <button
            type="button"
            onClick={onPlay}
            aria-label={`Lire la vidéo : ${testimonial.title}`}
            className="group absolute inset-0 h-full w-full cursor-inherit focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2d2a49]"
          >
            <Image
              src={poster}
              onError={() =>
                setPoster(`https://i.ytimg.com/vi/${testimonial.id}/mqdefault.jpg`)
              }
              alt={testimonial.alt}
              fill
              sizes="(max-width: 900px) 92vw, 860px"
              className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
            />

            {/* Darkens on hover rather than at rest, so the poster is fully
                legible until the pointer is on it. */}
            <span
              aria-hidden
              className="absolute inset-0 bg-[#2d2a49]/0 transition-colors duration-300 group-hover:bg-[#2d2a49]/20"
            />

            <span
              aria-hidden
              className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[#f5eee8]/95 shadow-lg transition-transform duration-300 group-hover:scale-110 sm:h-20 sm:w-20"
            >
              {/* Nudged right by a hair: a triangle's optical centre sits left
                  of its bounding box, so a centred one looks off-centre. */}
              <svg viewBox="0 0 24 24" className="ml-1 h-7 w-7 fill-[#2d2a49] sm:h-8 sm:w-8">
                <path d="M8 5v14l11-7z" />
              </svg>
            </span>
          </button>
        )}
      </div>

      <figcaption className="mt-5 text-center sm:mt-6">
        {/* Held to a reading measure rather than the video's full width: at
            860px the eye loses the start of the next line and paragraphs this
            long stop being skimmable, which is the one job they have. */}
        <blockquote className="mx-auto flex max-w-[54ch] flex-col gap-4 text-[1.05rem] leading-[1.55] text-[#2d2a49]/75 sm:text-[1.2rem]">
          {testimonial.quotes.map((quote) => (
            <p key={quote}>
              &laquo;&nbsp;{quote}&nbsp;&raquo;
            </p>
          ))}
        </blockquote>

        {/* Two lines rather than one joined by punctuation: the name and the
            credential are separate facts, and stacking them says so. */}
        <cite className="mt-5 block not-italic">
          <span className="block text-[0.86rem] font-semibold uppercase tracking-[0.1em] text-[#2d2a49]/80">
            {testimonial.name}
          </span>
          <span className="mt-1 block text-[0.84rem] text-[#2d2a49]/50">
            {testimonial.credential}
          </span>
        </cite>
      </figcaption>
    </figure>
  );
}

/**
 * The slides rotate on their own every ten seconds so a visitor who only
 * watches sees both stories — but the rotation stops the moment it could do
 * harm or the visitor takes over:
 *
 * - a playing video is never switched away from;
 * - touching the arrows or dots hands control over for good, because a
 *   carousel that snatches itself back is worse than one that never moved;
 * - `prefers-reduced-motion` means it never auto-advances at all.
 *
 * The slides are stacked in one grid cell rather than mounted one at a time,
 * so the block's height is the tallest slide's height at every width and the
 * screenshots below never jump when the short slide is showing.
 */
export function VideoTestimonials({ className = "" }: { className?: string }) {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [autoRotate, setAutoRotate] = useState(true);

  const trackRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);

  /**
   * The slides are stacked in one grid cell so they can crossfade in place,
   * which makes the cell as tall as the tallest of them. Aurore's single quote
   * then sat in a pocket of empty space with the arrows stranded far below it,
   * while Maëva's three quotes reached them. Measuring whichever slide is
   * actually showing, and animating the track to that height, puts the controls
   * the same distance under every caption.
   *
   * Written straight to the node rather than through state: this is an effect
   * synchronising the DOM with React's idea of the current slide, which is what
   * effects are for, and it avoids a re-render on every resize.
   *
   * Before this runs the track has no explicit height, so it falls back to the
   * natural one — the tallest slide, which is Maëva's, and she is also the
   * slide it opens on. So the first paint already shows the right height and
   * nothing moves at hydration.
   */
  useEffect(() => {
    const track = trackRef.current;
    const slide = slideRefs.current[index];
    if (!track || !slide) return;

    const apply = () => {
      track.style.height = `${slide.offsetHeight}px`;
    };

    // Fires once on observe, and again whenever that slide reflows: a rotated
    // phone, a narrower window, a font swapping in late.
    const observer = new ResizeObserver(apply);
    observer.observe(slide);
    return () => observer.disconnect();
  }, [index]);

  useEffect(() => {
    if (!autoRotate || playing) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const t = setTimeout(
      () => setIndex((i) => (i + 1) % TESTIMONIALS.length),
      ROTATE_MS
    );
    return () => clearTimeout(t);
  }, [index, autoRotate, playing]);

  // Manual navigation takes over: the timer stops for good, and any playing
  // video is unmounted rather than left talking behind the next slide.
  const goTo = (i: number) => {
    setAutoRotate(false);
    setPlaying(false);
    setIndex(i);
  };

  const count = TESTIMONIALS.length;

  return (
    <section
      aria-roledescription="carrousel"
      aria-label="Témoignages en vidéo"
      className={`mx-auto w-full max-w-[860px] ${className}`}
    >
      <div
        ref={trackRef}
        // Clipped, so the taller outgoing slide cannot spill over the controls
        // while it fades. Opened again on focus because the play button's
        // outline sits 2px outside its own box and would otherwise be clipped
        // away from keyboard users — and only the showing slide can take focus,
        // since the others are `inert`.
        // `items-start` matters more than it looks: grid items stretch to the
        // cell by default, so every slide reported the height of the tallest
        // one and there was nothing to measure. Sized to their own content,
        // each slide is its own height and the cell is still the tallest —
        // which is exactly the fallback wanted before the effect runs.
        className="grid items-start overflow-hidden transition-[height] duration-[420ms]
                   ease-[cubic-bezier(0.22,1,0.36,1)] focus-within:overflow-visible
                   motion-reduce:transition-none"
      >
        {TESTIMONIALS.map((testimonial, i) => {
          const active = i === index;
          return (
            <div
              key={testimonial.id}
              ref={(el) => {
                slideRefs.current[i] = el;
              }}
              role="group"
              aria-roledescription="diapositive"
              aria-label={`${i + 1} sur ${count}`}
              // Hidden slides are only faded out, which leaves their play
              // button and quotes in the tab order; `inert` is what actually
              // removes them.
              inert={!active}
              aria-hidden={!active}
              className={`${SWAP_BASE} ${active ? "" : SWAP_HIDDEN}`}
            >
              <Slide
                testimonial={testimonial}
                playing={active && playing}
                onPlay={() => {
                  // Watching is also taking over: the rotation must not pull
                  // the video away mid-sentence, and once someone has pressed
                  // play there is no coming back to "idle browsing".
                  setAutoRotate(false);
                  setPlaying(true);
                }}
              />
            </div>
          );
        })}
      </div>

      <div className="mt-7 flex items-center justify-center gap-5">
        <button
          type="button"
          onClick={() => goTo((index - 1 + count) % count)}
          aria-label="Témoignage précédent"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-[#2d2a49]/25 text-[#2d2a49] transition-colors duration-200 hover:bg-[#2d2a49]/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2d2a49]"
        >
          <svg viewBox="0 0 24 24" aria-hidden focusable="false" className="h-4 w-4 fill-none stroke-current stroke-2">
            <path d="M15 5l-7 7 7 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {/* One dot per client, named rather than numbered: "voir le témoignage
            de Maëva" tells a screen reader what the dot is for, where "2" would
            not. */}
        <div className="flex items-center gap-2.5">
          {TESTIMONIALS.map((testimonial, i) => (
            <button
              key={testimonial.id}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Voir le témoignage de ${testimonial.name}`}
              aria-current={i === index ? "true" : undefined}
              className="flex h-8 w-8 items-center justify-center rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-6px] focus-visible:outline-[#2d2a49]"
            >
              <span
                aria-hidden
                className={`block h-2 w-2 rounded-full transition-colors duration-200 ${
                  i === index ? "bg-[#2d2a49]" : "bg-[#2d2a49]/25 hover:bg-[#2d2a49]/45"
                }`}
              />
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => goTo((index + 1) % count)}
          aria-label="Témoignage suivant"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-[#2d2a49]/25 text-[#2d2a49] transition-colors duration-200 hover:bg-[#2d2a49]/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2d2a49]"
        >
          <svg viewBox="0 0 24 24" aria-hidden focusable="false" className="h-4 w-4 fill-none stroke-current stroke-2">
            <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </section>
  );
}
