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

// Drawn entirely from what the site already claims about Anaïs — diététicienne,
// coaching à distance, Montpellier — plus how she works. The parts only she can
// supply are her training, how long she has practised, and why she started;
// those belong here and are deliberately not invented.
const BIO = [
  "Je suis diététicienne, et je coache à distance depuis Montpellier.",
  "J’accompagne des personnes qui ont déjà essayé seules. Qui ont enchaîné les régimes, les programmes trouvés en ligne, les promesses de résultats en huit semaines, et qui n’ont jamais tenu plus d’un mois.",
  "Le problème n’a jamais été leur motivation. C’était le plan.",
  "Alors je ne donne pas de méthode toute faite. Je pars de votre corps, de votre quotidien, de vos contraintes et de ce que vous êtes réellement prêt à tenir. Je construis à partir de là.",
];

const METHOD = [
  "Une alimentation qui fait prendre du muscle et perdre du gras en même temps.",
  "Un programme d’entraînement qui corrige les points faibles et respecte votre morphologie.",
  "Un suivi qui vérifie, semaine après semaine, que tout est appliqué correctement.",
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
        {/* Left: her, then who the work is for. */}
        <div className="flex flex-col items-center gap-10 lg:items-start lg:gap-12">
          {/* Same composition as the hero — silhouette behind, nudged 2% left.
              Here the silhouette is the beige recolour, since the navy one
              would be invisible against this section. The figure slides in
              from the left and comes to rest exactly in front of it.

              Pulled up on desktop only. A transform rather than a margin, so
              she and the silhouette rise together into the section's top
              padding without dragging the copy below them up too. */}
          <div className="relative w-full max-w-[300px] sm:max-w-[380px] lg:-translate-y-20 lg:max-w-[470px] xl:max-w-[520px]">
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

          <div className="flex w-full max-w-[46ch] flex-col gap-6 text-center lg:text-left">
            <p className="text-[1.05rem] font-semibold leading-[1.5] text-[#f5eee8] sm:text-[1.15rem] lg:text-[1.45rem] lg:leading-[1.35]">
              Adapté à tout type de corps, de genre, d’âge et de mental.
            </p>

            <p className={pitchBodyClass}>
              À la fin, ils ont obtenu ce qu’ils étaient venus chercher&nbsp;: le
              corps qu’ils avaient en tête. Et souvent mieux encore.
            </p>

            <div className="flex flex-col gap-4">
              {/* A label for the list rather than a heading: this column comes
                  before the biography in the source, so an <h3> here would be
                  announced ahead of the section's own <h2>. `aria-labelledby`
                  gives the list the same name a heading would have. */}
              <p
                id="method-label"
                className="text-[1rem] font-semibold text-[#f5eee8] sm:text-[1.05rem] lg:text-[1.25rem]"
              >
                Comment je les ai aidés&nbsp;?
              </p>

              {/* Left-aligned even where the block above is centred: a bulleted
                  list with a centred rag is unreadable. */}
              <ul
                aria-labelledby="method-label"
                className="mx-auto flex max-w-[42ch] flex-col gap-3 text-left lg:mx-0"
              >
                {METHOD.map((item) => (
                  <li key={item} className={`flex gap-3 ${pitchBodyClass}`}>
                    <span
                      aria-hidden
                      className="mt-[0.62em] h-[5px] w-[5px] shrink-0 rounded-full bg-[#f5eee8]/60"
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Right: who she is, then the proof that it works. */}
        <div className="flex flex-col gap-12 lg:gap-16">
          <div className="flex max-w-[52ch] flex-col gap-5">
            {/* The section's heading now that the statement above the photo is
                gone — it is what "Qui je suis" in the nav points at, and every
                other heading here sits under it. Same size as before; only the
                level changed. */}
            <h2 className="text-[1.5rem] font-bold leading-[1.2] tracking-[-0.01em] text-[#f5eee8] sm:text-[1.75rem]">
              Moi, c’est Anaïs.
            </h2>
            {BIO.map((paragraph) => (
              <p key={paragraph} className={bodyClass}>
                {paragraph}
              </p>
            ))}

            {/* Her sign-off. Set apart from the paragraphs above it — full
                strength and heavier — so it lands as a closing statement
                rather than as one more line of the biography. */}
            <p className="mt-2 max-w-[30ch] text-[1.15rem] font-semibold leading-[1.4] tracking-[-0.01em] text-[#f5eee8] sm:text-[1.3rem]">
              Vous ne possédez vraiment qu’une seule chose dans cette vie&nbsp;:
              votre corps et votre mental. Alors, prenons-en soin.
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
