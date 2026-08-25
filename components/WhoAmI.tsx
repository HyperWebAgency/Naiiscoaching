import Image from "next/image";

import { ScrollFigure } from "./ScrollFigure";

// Alt text carries the figures printed on each card, so the results are not
// lost to anyone using a screen reader or with images disabled.
const RESULTS = [
  {
    src: "/avant-apres-1.webp",
    alt: "Résultat client : 4 mois d’accompagnement, de 67,5 kg à 58,5 kg, soit −9 kg.",
  },
  {
    src: "/avant-apres-2.webp",
    alt: "Résultat cliente : transformation avant / après un accompagnement Naiis Coaching.",
  },
  {
    src: "/avant-apres-3.webp",
    alt: "Résultat cliente : 2 ans d’accompagnement, jusqu’à la scène de compétition.",
  },
  {
    src: "/avant-apres-4.webp",
    alt: "Résultat client : prise de masse musculaire avant / après un accompagnement Naiis Coaching.",
  },
];

// Anaïs's own words. The opening line that stands on its own.
const BIO_LEAD =
  "Sportive depuis toujours, scientifique de formation, coach par passion et aujourd’hui athlète de bodybuilding.";

// The story itself, set evenly. Her document bolds the closing phrase of each of
// these, but at reading size on this dark ground three emphasised tails in a row
// pull harder than they help; the lead and the sign-off carry the weight here
// instead.
const BIO = [
  "Le sport a façonné une grande partie de la personne que je suis. Il m’a appris la discipline, la rigueur, la confiance en moi et surtout cette conviction : les plus belles choses demandent du temps, de la constance et surtout un pourquoi suffisamment profond et puissant pour continuer lorsque les choses deviennent difficiles.",
  "Après un Master en chimie et une première carrière dans laquelle j’ai fini par ne plus me sentir alignée, j’ai choisi de reconstruire mon quotidien autour de ce qui m’animait réellement : le sport, la nutrition, le mindset et l’envie de transmettre.",
  "Aujourd’hui, j’accompagne à mon tour celles et ceux qui veulent aller au bout de leurs objectifs, pas seulement en leur donnant un plan, mais en les aidant à construire les habitudes et l’état d’esprit nécessaires pour y parvenir.",
];

// Her closing statement, bold in full.
const BIO_CLOSING =
  "Un accompagnement humain, exigeant et bienveillant, où l’on travaille autant sur le corps que sur la personne qui le construit.";

// Opens the results column, above the line that states what they are.
const RESULTS_INTRO =
  "Derrière ces photos, il y a évidemment des kilos perdus, du muscle construit et des physiques qui évoluent. Mais il y a aussi des habitudes qui changent, de la confiance qui se construit et des personnes qui découvrent qu’elles sont capables de bien plus qu’elles ne le pensaient.";

// The five steps, in order — the numbering in the markup is what carries that,
// so these are plain sentences with no emphasis of their own.
const METHOD = [
  "Une analyse approfondie de ton point de départ : habitudes alimentaires et sportives, rythme de vie, activité quotidienne, environnement, contraintes et état d’esprit, pour construire tes plans personnalisés, et non te faire suivre une méthode préétablie.",
  "Une stratégie nutritionnelle construite autour de tes objectifs, tes préférences, tes besoins et ton quotidien.",
  "Un entraînement individualisé selon ton niveau, tes capacités, ta morphologie et tes axes de progression.",
  "Un bilan chaque semaine pour analyser ton évolution, comprendre tes difficultés et ajuster ton accompagnement au fil de ta progression.",
  "Et surtout, un travail sur tes habitudes et ton mindset, pour ne pas seulement atteindre tes objectifs, mais construire des changements capables de réellement durer dans le temps.",
];

// Reused by the two small section labels, so they stay identical.
const labelClass =
  "text-[0.72rem] font-medium uppercase tracking-[0.12em] text-[#f5eee8]/60";

const bodyClass = "text-[0.95rem] leading-[1.7] text-[#f5eee8]/70 sm:text-[1rem]";

// The left column is the pitch, not the story, so it steps up on desktop where
// there is room for it. The biography opposite stays at reading size — the two
// are doing different jobs and should not be the same weight.
const pitchBodyClass = `${bodyClass} lg:text-[1.15rem] lg:leading-[1.75]`;

export function WhoAmI() {
  return (
    <section
      id="qui-je-suis"
      data-dark-section
      className="scroll-mt-24 overflow-hidden bg-[#2d2a49] px-6 py-20 sm:py-24 lg:px-12 lg:py-32"
    >
      {/* Top-aligned rather than centred: both columns now carry a full stack of
          content, so they should start on the same line. */}
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 items-start gap-14 lg:grid-cols-2 lg:gap-16">
        {/* Left: her, then who the work is for.
            `contents` below `lg` so the photo and the pitch stop being one
            block and become grid items in their own right — which is what lets
            the pitch be placed after the results while the photo stays at the
            top. From `lg` the wrapper reappears and regroups them into the left
            column. */}
        <div className="contents lg:flex lg:flex-col lg:items-start lg:gap-12">
          {/* Same composition as the hero — silhouette behind, nudged 2% left.
              Here the silhouette is the beige recolour, since the navy one
              would be invisible against this section. The figure slides in
              from the left and comes to rest exactly in front of it.

              Pulled up on desktop only. A transform rather than a margin, so
              she and the silhouette rise together into the section's top
              padding without dragging the copy below them up too. */}
          <div className="relative order-1 mx-auto w-full max-w-[300px] sm:max-w-[380px] lg:mx-0 lg:-translate-y-20 lg:max-w-[470px] xl:max-w-[520px]">
            <Image
              src="/hero-silhouette-beige.png"
              alt=""
              aria-hidden
              width={1003}
              height={1103}
              sizes="(max-width: 1024px) 62vw, 28vw"
              className="pointer-events-none absolute left-1/2 top-0 h-full w-auto max-w-none -translate-x-[52%] -translate-y-[1%] select-none"
            />
            <ScrollFigure mode="enterLeft" className="relative">
              <Image
                src="/anais.png"
                alt="Anaïs, coach sportive, contractant son biceps"
                width={1229}
                height={1387}
                sizes="(max-width: 1024px) 62vw, 28vw"
                className="h-auto w-full"
              />
            </ScrollFigure>
          </div>

          {/* Last on a phone, so the claim about who this suits lands after the
              before/afters have already made the case. `order` moves it
              visually only — in the source it stays with the photo, which is
              what keeps the desktop column intact. */}
          <div className="order-3 mx-auto flex w-full max-w-[46ch] flex-col gap-6 text-center lg:mx-0 lg:text-left">
            {/* Styled like a heading but written as a label, for the same
                reason the list below is: this column comes before the
                biography in the source, so a real heading here would be
                announced ahead of the section's own <h2>. */}
            <div className="flex flex-col gap-2">
              <p className={labelClass}>Résultats</p>
              <p className="text-[1.05rem] font-semibold leading-[1.5] text-[#f5eee8] sm:text-[1.15rem] lg:text-[1.45rem] lg:leading-[1.35]">
                Des résultats qui vont bien au-delà du physique.
              </p>
            </div>

            <p className={pitchBodyClass}>{RESULTS_INTRO}</p>

            <div className="flex flex-col gap-4">
              {/* A label for the list rather than a heading, for the reason
                  above. `aria-labelledby` gives the list the same name a
                  heading would have. */}
              <p
                id="method-label"
                className="text-[1rem] font-semibold text-[#f5eee8] sm:text-[1.05rem] lg:text-[1.25rem]"
              >
                Comment allons-nous construire tes résultats&nbsp;?
              </p>

              {/* Left-aligned even where the block above is centred: a list
                  with a centred rag is unreadable. */}
              {/* An ordered list now that these are steps: the sequence is part
                  of the meaning, and `ol` is what states it to a screen reader.
                  The painted numbers are decorative for that reason — the list
                  already announces "1 of 5". */}
              <ol
                aria-labelledby="method-label"
                className="mx-auto flex max-w-[42ch] flex-col gap-6 text-left lg:mx-0"
              >
                {METHOD.map((item, i) => (
                  <li key={item} className="flex flex-col gap-1.5">
                    {/* Same numbering as the mobile menu: zero-padded, small,
                        widely tracked and held well back, sitting over the line
                        it counts rather than beside it. Decorative here — the
                        `ol` already announces the position. */}
                    <span
                      aria-hidden
                      className="text-[0.7rem] font-medium uppercase tracking-[0.14em] text-[#f5eee8]/35"
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className={pitchBodyClass}>{item}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>

        {/* Right: who she is, then the proof that it works. On a phone this
            sits between the photo and the pitch; from `lg` it is the second
            column, which `order-2` already describes. */}
        <div className="order-2 flex flex-col gap-12 lg:gap-16">
          <div className="flex max-w-[52ch] flex-col gap-5">
            {/* The section's heading now that the statement above the photo is
                gone — it is what "Qui je suis" in the nav points at, and every
                other heading here sits under it. Same size as before; only the
                level changed. */}
            <h2 className="text-[1.5rem] font-bold leading-[1.2] tracking-[-0.01em] text-[#f5eee8] sm:text-[1.75rem]">
              Moi, c’est Anaïs.
            </h2>
            {/* Opens the biography at full strength, so the four-part summary
                of who she is reads as a statement before the story explains
                it. */}
            <p className="text-[1.05rem] font-semibold leading-[1.5] text-[#f5eee8] sm:text-[1.15rem]">
              {BIO_LEAD}
            </p>

            {BIO.map((paragraph) => (
              <p key={paragraph} className={bodyClass}>
                {paragraph}
              </p>
            ))}

            {/* Her sign-off. Set apart from the paragraphs above it — full
                strength and heavier — so it lands as a closing statement
                rather than as one more line of the biography. */}
            <p className="mt-2 text-[1.15rem] font-semibold leading-[1.4] tracking-[-0.01em] text-[#f5eee8] sm:text-[1.3rem]">
              {BIO_CLOSING}
            </p>
          </div>

          {/* Client results. Each file is already a self-contained before/after
              card with its own badges and branding, so it only needs a grid —
              but under a biography it needs a label, or it reads as decoration
              rather than as evidence. */}
          <div className="flex flex-col gap-5">
            <h3 className={labelClass}>Leurs résultats</h3>
            <ul className="grid grid-cols-2 gap-3 sm:gap-4 lg:gap-5">
              {RESULTS.map((result) => (
                <li key={result.src} className="overflow-hidden rounded-xl">
                  <Image
                    src={result.src}
                    alt={result.alt}
                    width={1279}
                    height={1600}
                    sizes="(max-width: 1024px) 45vw, 23vw"
                    className="h-auto w-full"
                  />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
