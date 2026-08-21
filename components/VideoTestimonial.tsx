"use client";

import Image from "next/image";
import { useState } from "react";

/**
 * TODO on a new video testimonial: paste the id, title and alt. The poster is
 * derived from the id, so those three are the whole update.
 */
const VIDEO = {
  id: "kvguvk4MvqI",
  title: "Témoignage client — Aurore | De débutante à compétitrice",
  alt:
    "Témoignage vidéo : Aurore, avant / après — de débutante à compétitrice sur scène, " +
    "photographiée de face et de dos, et avec Anaïs après la compétition.",
};

// 1280×720 and truly 16:9. `hqdefault` is 4:3 with the frame letterboxed into
// black bars, which would show as banding inside the rounded corners; `mqdefault`
// is the 16:9 fallback for videos that never got a maxres render.
const POSTER = `https://i.ytimg.com/vi/${VIDEO.id}/maxresdefault.jpg`;
const POSTER_FALLBACK = `https://i.ytimg.com/vi/${VIDEO.id}/mqdefault.jpg`;

/**
 * A click-to-load facade rather than an iframe on page load.
 *
 * Two reasons. The player pulls in a few hundred KB of third-party script that
 * most visitors will never press play on; and `youtube-nocookie` plus deferring
 * the embed means YouTube is not contacted at all — no cookies, no tracking —
 * until someone actually asks to watch. On a French site that is the difference
 * between needing a consent banner for this and not.
 */
export function VideoTestimonial({ className = "" }: { className?: string }) {
  const [playing, setPlaying] = useState(false);
  const [poster, setPoster] = useState(POSTER);

  return (
    <figure className={`mx-auto w-full max-w-[860px] ${className}`}>
      {/* `aspect-video` holds the 16:9 box from the first paint, so the poster
          and the iframe that replaces it occupy exactly the same space and
          nothing on the page shifts when it loads. */}
      <div className="relative aspect-video overflow-hidden rounded-xl bg-[#2d2a49] ring-1 ring-[#2d2a49]/10">
        {playing ? (
          <iframe
            // Autoplay is honoured because the click that mounted this iframe is
            // the user gesture browsers require.
            src={`https://www.youtube-nocookie.com/embed/${VIDEO.id}?autoplay=1&rel=0`}
            title={VIDEO.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="absolute inset-0 h-full w-full"
          />
        ) : (
          <button
            type="button"
            onClick={() => setPlaying(true)}
            aria-label={`Lire la vidéo : ${VIDEO.title}`}
            className="group absolute inset-0 h-full w-full cursor-inherit focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2d2a49]"
          >
            <Image
              src={poster}
              onError={() => setPoster(POSTER_FALLBACK)}
              alt={VIDEO.alt}
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

      {/* The written pull-out. A play button on its own asks someone to commit
          forty minutes to find out whether it is worth forty minutes, and most
          people decline that trade. The quote answers the question first, so
          pressing play becomes a choice to hear more rather than a gamble.

          The middle clause is set at full strength and the rest a shade lighter.
          It is the line that carries the whole story — ate more, got leaner —
          and letting the eye land there first means a visitor who only skims
          still leaves with the point. */}
      <figcaption className="mt-5 text-center sm:mt-6">
        <span className="block text-[0.72rem] font-medium uppercase tracking-[0.12em] text-[#2d2a49]/50">
          Témoignage en vidéo
        </span>

        {/* Held to a reading measure rather than the video's full width: at
            860px the eye loses the start of the next line and a paragraph this
            long stops being skimmable, which is the one job it has. */}
        <blockquote className="mx-auto mt-4 max-w-[54ch] text-[1.15rem] leading-[1.55] text-[#2d2a49]/75 sm:text-[1.35rem]">
          &laquo;&nbsp;Je me fixais 1600 calories par jour, et je sentais que mon corps avait
          besoin de plus. J&rsquo;avais même peur d&rsquo;aller au restaurant : quand on me le
          proposait, je disais non, je ne m&rsquo;autorisais pas à y aller. Aujourd&rsquo;hui, je
          crois que{" "}
          <strong className="font-semibold text-[#2d2a49]">
            je n&rsquo;ai jamais autant mangé de ma vie, et je n&rsquo;ai jamais été aussi affinée
          </strong>
          . Franchement, tout est ouvert.&nbsp;&raquo;
        </blockquote>

        {/* Two lines rather than one joined by punctuation: the name and the
            credential are separate facts, and stacking them says so without
            needing a dash or a third comma in a line that already has one. */}
        <cite className="mt-5 block not-italic">
          <span className="block text-[0.86rem] font-semibold uppercase tracking-[0.1em] text-[#2d2a49]/80">
            Aurore
          </span>
          <span className="mt-1 block text-[0.84rem] text-[#2d2a49]/50">
            2 ans de coaching, top 3 catégorie Fit Model au Fibo
          </span>
        </cite>
      </figcaption>
    </figure>
  );
}
