import { VideoTestimonials } from "./VideoTestimonials";

/**
 * Section four. Anaïs asked for the masthead straight and modest — the earlier
 * poster-scale tilted pair read as taking too much of the page — so the title
 * is now an ordinary centred heading with her line under it, and the video
 * carousel follows close behind.
 *
 * Videos only. The message screenshots that used to follow them moved to the
 * carousel under "Leurs résultats" in Qui je suis, so they are not shown twice.
 * With them went the only state here, which is why this is a server component
 * now; the carousel is the part that ships as JavaScript.
 *
 * Beige ground with `#2d2a49` type, the same pairing as the hero. That hex is
 * the site's purple; there is no colour variable in the theme to reach for, so
 * it is written out here exactly as every other component writes it.
 *
 * The section is deliberately *not* marked `data-dark-section` — it is a light
 * ground, so the navbar and the scrollbar should stay in their light treatment
 * across it, exactly as they do over the hero.
 */
export function Testimonials() {
  return (
    <section
      id="temoignages"
      className="relative bg-[#f5eee8] px-6 py-24 scroll-mt-24 sm:py-28 lg:py-32 lg:px-12"
    >
      <div className="mx-auto flex max-w-[1400px] flex-col">
        {/* Her copy, verbatim: the heading names the section, the line under it
            makes the argument. Uppercasing is left to CSS so screen readers are
            not handed a string of capitals to spell out. */}
        <div className="flex flex-col items-center gap-4 text-center">
          <h2 className="font-extrabold uppercase leading-[1.05] tracking-[-0.02em] text-[#2d2a49] text-[clamp(1.9rem,5.5vw,3.5rem)]">
            Témoignages client·es
          </h2>
          <p className="text-[1.05rem] font-semibold text-[#2d2a49]/80 sm:text-[1.25rem]">
            Elles en parlent mieux que moi.
          </p>
        </div>

        <VideoTestimonials className="mt-12 lg:mt-16" />
      </div>
    </section>
  );
}
