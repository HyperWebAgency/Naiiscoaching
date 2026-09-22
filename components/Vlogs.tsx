import Image from "next/image";
import type { CSSProperties } from "react";

import { SOCIAL } from "@/lib/site";
import { getVlogs, type Vlog } from "@/lib/vlogs";

/**
 * One set has to be wider than the widest screen, or the loop shows its seam as
 * a gap sliding in from the right. Eight cards at the desktop width is about
 * 3,200px, past any common display; with fewer videos than that the list is
 * simply repeated inside the set.
 */
const MIN_CARDS_PER_SET = 8;

/**
 * Held per card rather than per loop, so the speed stays the same however many
 * videos she lists: about 50px a second at the desktop card width, slow enough
 * to read a title as it passes.
 */
const SECONDS_PER_CARD = 8;

const cardWidth = "w-[260px] sm:w-[340px] lg:w-[380px]";

function Card({ vlog, repeat }: { vlog: Vlog; repeat: boolean }) {
  return (
    // A repeat is there to fill the loop, not to be read twice: out of the tab
    // order and the accessibility tree, and dropped entirely when the loop is
    // off under reduced motion.
    <li
      inert={repeat}
      aria-hidden={repeat || undefined}
      className={`shrink-0 ${cardWidth} ${repeat ? "motion-reduce:hidden" : "motion-reduce:snap-start"}`}
    >
      <a
        href={vlog.watchUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group block rounded-xl focus-visible:outline focus-visible:outline-2
                   focus-visible:outline-offset-4 focus-visible:outline-[#2d2a49]"
      >
        <span className="relative block aspect-video overflow-hidden rounded-xl bg-[#2d2a49] ring-1 ring-[#2d2a49]/10">
          {/* The title under it is the link's name, so the thumbnail is
              decorative and says nothing twice. */}
          <Image
            src={vlog.thumbnail}
            alt=""
            fill
            sizes="(max-width: 640px) 260px, (max-width: 1024px) 340px, 380px"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]
                       motion-reduce:transition-none"
          />
          {/* Same play mark as the video testimonials, smaller. */}
          <span
            aria-hidden
            className="absolute left-1/2 top-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2
                       items-center justify-center rounded-full bg-[#f5eee8]/95 shadow-lg
                       transition-transform duration-300 group-hover:scale-110"
          >
            <svg viewBox="0 0 24 24" className="ml-0.5 h-5 w-5 fill-[#2d2a49]">
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
        </span>

        {vlog.title ? (
          <span className="mt-3 line-clamp-2 block text-[0.95rem] font-semibold leading-[1.4] text-[#2d2a49]">
            {vlog.title}
          </span>
        ) : (
          <span className="sr-only">Voir la vidéo sur YouTube</span>
        )}
      </a>
    </li>
  );
}

/**
 * Her YouTube vlogs, drifting past in a loop, after the testimonials.
 *
 * Cards are links out to YouTube in a new tab rather than players, which is
 * both what a moving row can reasonably offer and what keeps the privacy
 * policy true: the thumbnails come through the site's own image optimiser, so
 * nothing reaches YouTube until someone clicks.
 *
 * A server component with no JavaScript of its own. The loop is a CSS animation
 * over two identical halves (see `.marquee` in globals.css): it pauses under
 * the pointer or keyboard focus, and under `prefers-reduced-motion` it becomes
 * an ordinary row to swipe through, holding each video once.
 */
export async function Vlogs() {
  const vlogs = await getVlogs();
  if (vlogs.length === 0) return null;

  const copies = Math.ceil(MIN_CARDS_PER_SET / vlogs.length);
  const set = Array.from({ length: copies }, (_, copy) =>
    vlogs.map((vlog, i) => ({ vlog, key: `${copy}-${i}-${vlog.id}`, repeat: copy > 0 }))
  ).flat();

  return (
    <section
      id="vlogs"
      className="scroll-mt-24 overflow-hidden bg-[#f5eee8] py-24 sm:py-28 lg:py-32"
    >
      <div className="flex flex-col items-center gap-4 px-6 text-center">
        <h2 className="font-extrabold uppercase leading-[1.05] tracking-[-0.02em] text-[#2d2a49] text-[clamp(1.9rem,5.5vw,3.5rem)]">
          Mes vlogs
        </h2>
        <p className="text-[1.05rem] font-semibold text-[#2d2a49]/80 sm:text-[1.25rem]">
          Suis mon parcours jusqu’à la scène.
        </p>
      </div>

      {/* The faded edges say "this continues" at both ends. Under reduced
          motion the row scrolls by hand instead, and a fade would only hide
          the first and last cards. A mask also hides whatever falls outside
          the box, so the vertical padding is room for a card's focus ring. */}
      <div
        className="marquee mt-10 py-2 [mask-image:linear-gradient(to_right,transparent,#000_6%,#000_94%,transparent)]
                   lg:mt-14 motion-reduce:snap-x motion-reduce:snap-mandatory motion-reduce:overflow-x-auto
                   motion-reduce:[mask-image:none]"
      >
        <div
          className="marquee-track flex w-max"
          style={{ "--marquee-duration": `${set.length * SECONDS_PER_CARD}s` } as CSSProperties}
        >
          {/* Each half carries its own trailing gap, so the seam between them
              is spaced exactly like every other pair of cards and the jump
              back to the start is invisible. */}
          <ul className="flex gap-5 pr-5 sm:gap-6 sm:pr-6 motion-reduce:px-6">
            {set.map(({ vlog, key, repeat }) => (
              <Card key={key} vlog={vlog} repeat={repeat} />
            ))}
          </ul>
          <ul aria-hidden inert className="flex gap-5 pr-5 sm:gap-6 sm:pr-6 motion-reduce:hidden">
            {set.map(({ vlog, key }) => (
              <Card key={key} vlog={vlog} repeat />
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-12 flex justify-center px-6">
        <a
          href={SOCIAL.youtube}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full border border-[#2d2a49]/25 px-6 py-2.5 text-[0.8rem] font-semibold
                     uppercase tracking-[0.08em] text-[#2d2a49] transition-colors duration-200
                     hover:bg-[#2d2a49]/5 focus-visible:outline focus-visible:outline-2
                     focus-visible:outline-offset-2 focus-visible:outline-[#2d2a49]"
        >
          Voir toutes les vidéos
        </a>
      </div>
    </section>
  );
}
