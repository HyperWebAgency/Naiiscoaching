import Image from "next/image";

import { ScrollFigure } from "./ScrollFigure";
import { SocialLinks } from "./SocialLinks";
import { StartButton } from "./StartButton";

export function Hero() {
  return (
    // `relative` so the social links can lift into the navbar's band at xl.
    <section className="relative min-h-svh w-full overflow-hidden bg-[#f5eee8]">
      {/* The split waits until lg: at 768 the two-column version leaves the
          headline a ~344px column, which wrapped it into nine lines. */}
      {/* The short-and-narrow query keeps the hero inside 100vh on small
          phones, where the headline, sub-headline, photo and CTA together
          would otherwise overflow. Scoped to narrow widths too, so a short
          laptop window is not affected. */}
      <div className="mx-auto grid min-h-svh max-w-[1400px] grid-cols-1 items-center gap-5 px-6 py-8 [@media(max-height:700px)_and_(max-width:640px)]:gap-2 [@media(max-height:700px)_and_(max-width:640px)]:py-3 sm:gap-6 sm:py-12 lg:grid-cols-2 lg:gap-10 lg:px-12 lg:py-0">
        {/* `contents` drops this wrapper below lg so the headline and the button
            become grid items in their own right and the photo can sit between
            them. From lg up the wrapper reappears and regroups them left. */}
        <div className="contents lg:flex lg:flex-col lg:items-start lg:gap-7">
          <h1 className="hero-in hero-in-1 order-1 mx-auto max-w-[19ch] text-balance text-center text-[2rem] font-bold leading-[1.1] tracking-[-0.02em] text-[#2d2a49] sm:text-[2.5rem] md:text-[3rem] lg:mx-0 lg:text-left lg:text-[2.6rem] xl:text-[3.1rem] 2xl:text-[3.5rem]">
            Laissez-moi vous aider à forger un mental et un corps{" "}
            <span className="box-decoration-clone rounded-[0.14em] bg-[#2d2a49] px-[0.22em] py-[0.04em] text-[#f5eee8]">
              inébranlables
            </span>{" "}
            dans votre vie sportive, étape par étape.
          </h1>

          <h2 className="hero-in hero-in-2 order-2 mx-auto max-w-[46ch] text-balance text-center text-[0.95rem] font-normal leading-[1.6] text-[#2d2a49]/75 sm:text-[1.05rem] lg:mx-0 lg:text-left lg:text-[1.1rem]">
            Diététicienne et coach à distance basée à Montpellier. Je vous aide à
            ajuster votre alimentation et vos entraînements pour enfin atteindre
            les objectifs que vous repoussez chaque jour.
          </h2>

          <div className="order-4 flex flex-col items-center gap-3 lg:items-start">
            <StartButton className="hero-in hero-in-3" />
            <p className="hero-in hero-in-4 flex items-center gap-2 text-[0.8rem] font-medium text-[#2d2a49]/70">
              <span
                aria-hidden
                className="h-[7px] w-[7px] shrink-0 rounded-full bg-[#3a9e63]"
              />
              Places limitées
            </p>

            {/* Rendered here so it has somewhere sensible to sit on small
                screens; from xl it lifts out to the navbar's line. */}
            <SocialLinks />
          </div>
        </div>

        <div className="order-3 flex justify-center lg:justify-end">
          {/* The silhouette is the same pose as the photo, so it sits directly
              behind at a small offset and reads as a graphic echo of her.
              It is matched to the photo's height, then nudged left 2%. */}
          <div className="relative w-full max-w-[210px] [@media(max-height:700px)_and_(max-width:640px)]:max-w-[125px] sm:max-w-[280px] md:max-w-[340px] lg:max-w-[510px] xl:max-w-[580px] 2xl:max-w-[650px]">
            <Image
              src="/hero-silhouette.png"
              alt=""
              aria-hidden
              width={1003}
              height={1103}
              priority
              sizes="(max-width: 1024px) 60vw, 42vw"
              className="pointer-events-none absolute left-1/2 top-0 h-full w-auto max-w-none -translate-x-[52%] -translate-y-[1%] select-none"
            />
            {/* She travels out to the right as the hero scrolls away, and
                re-enters from the left in the section below. */}
            <ScrollFigure mode="exitRight" className="relative">
              <Image
                src="/anais.png"
                alt="Anaïs, coach sportive, contractant son biceps"
                width={1229}
                height={1387}
                priority
                sizes="(max-width: 1024px) 60vw, 42vw"
                className="h-auto w-full"
              />
            </ScrollFigure>
          </div>
        </div>
      </div>
    </section>
  );
}
