"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

/**
 * TODO on a new video testimonial: append an entry here. The poster is derived
 * from the id, so one object is the whole update.
 *
 * Maëva leads. Her objective is lifestyle, which is 99% of the current
 * clientèle; Aurore's competition physique can read as intimidating to the
 * visitor this page is actually for, so she comes second.
 */
const TESTIMONIALS = [
  {
    id: "m_LVMjK8QLM",
    name: "Maëva",
    credential: "1 an d’accompagnement · Recomposition corporelle & changement d’habitudes",
    title: "Témoignage client : Maëva | Recomposition corporelle & changement d’habitudes",
    alt:
      "Témoignage vidéo : Maëva raconte un an d’accompagnement, une recomposition " +
      "corporelle et un changement complet de mode de vie.",
    quotes: [
      "Je suis hyper contente du physique et du résultat que j’ai pu obtenir, mais ce dont je suis le plus fière, c’est d’avoir réussi à changer mon mode de vie.",
      "Je me suis donné les moyens d’atteindre mes objectifs. Je ne me suis pas laissée tomber, je n’ai pas baissé les bras.",
      "Aujourd’hui, je mange plus qu’au début alors que mon poids reste le même et que ma shape reste la même.",
    ],
  },
  {
    id: "kvguvk4MvqI",
    name: "Aurore",
    credential: "2 ans d’accompagnement · De débutante à compétitrice",
    title: "Témoignage client : Aurore | De débutante à compétitrice",
    alt:
      "Témoignage vidéo : Aurore, avant / après, de débutante à compétitrice sur scène, " +
      "photographiée de face et de dos, et avec Anaïs après la compétition.",
    quotes: [
      "Je me fixais 1600 calories par jour et je sentais que mon corps avait besoin de plus. J’avais même peur d’aller au restaurant. Aujourd’hui, je crois que je n’ai jamais autant mangé de ma vie et je n’ai jamais été aussi affinée. Franchement, tout est au vert.",
    ],
  },
];

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
      <div className="grid">
        {TESTIMONIALS.map((testimonial, i) => {
          const active = i === index;
          return (
            <div
              key={testimonial.id}
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
