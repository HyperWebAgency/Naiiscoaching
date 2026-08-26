import type { Metadata } from "next";
import Link from "next/link";

import { Breadcrumb } from "@/components/Breadcrumb";
import { Footer } from "@/components/Footer";
import { CONTACT_EMAIL, PHONE_E164, SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: "Mentions légales",
  description:
    "Mentions légales du site Naiis Coaching : éditeur, directeur de la publication, hébergeur, propriété intellectuelle et traitement des données personnelles.",
  alternates: { canonical: "/mentions-legales" },
  // Legal boilerplate is not what anyone should land on from a search, but it
  // must stay reachable and it carries the identity signals that a business
  // site is judged on. Indexed, and left out of nothing.
  robots: { index: true, follow: true },
};

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * STILL OWED — SIX ENTRIES THE LAW ASKS FOR AND THIS PAGE NO LONGER SHOWS.
 *
 * A field left empty below is now simply omitted: its row disappears, and a
 * section whose whole substance is missing is not rendered at all. Fill the
 * value in and it comes back on its own, in place, with nothing else to edit.
 *
 * That is a presentation choice, not a compliance one. These entries are
 * required of a French site by article 6-III of the LCEN (loi n° 2004-575),
 * plus one under article L.612-1 of the code de la consommation. Missing
 * today:
 *
 *   editeurAdresse   registered address — required even for a home-based
 *                    sole trader
 *   editeurSiret     SIRET
 *   editeurTva       VAT number, or the micro-entreprise exemption wording
 *   mediateurNom     consumer mediator — mandatory for anyone selling to
 *   mediateurSite    consumers, and the article is hidden entirely without it
 *
 * This is a structure, not legal advice — have it read by someone qualified.
 * ─────────────────────────────────────────────────────────────────────────────
 */
type LegalFields = {
  /** Full legal name of the person or company publishing the site. */
  editeurNom?: string;
  /** e.g. "Entrepreneur individuel (micro-entreprise)". */
  editeurStatut?: string;
  /** Registered address. Required even for a home-based sole trader. */
  editeurAdresse?: string;
  /** Read from content/contact.json, which is also where the contact form
   *  sends and what the footer links to. */
  editeurEmail?: string;
  editeurSiret?: string;
  /** VAT number, or the exemption wording: "TVA non applicable, article 293 B
   *  du CGI" — which is the usual line for a micro-entreprise. */
  editeurTva?: string;
  /** Usually the same person as the publisher. */
  directeurPublication?: string;
  /** Name and address of the host. Filled in for Vercel; if the site ever moves
   *  off it, this has to move with it. */
  hebergeurNom?: string;
  hebergeurAdresse?: string;
  /** Consumer mediator: mandatory for anyone selling to consumers
   *  (article L.612-1 du code de la consommation). Name and website. */
  mediateurNom?: string;
  mediateurSite?: string;
};

const LEGAL: LegalFields = {
  editeurNom: "Anaïs Teck",
  editeurStatut: "Entrepreneur individuel (micro-entreprise)",
  editeurEmail: CONTACT_EMAIL,

  // A sole trader publishes in her own name, so the publication director is the
  // same person as the éditeur by construction — there is no board to appoint
  // anyone else. If the activity is ever incorporated, this becomes the legal
  // representative of the company and stops tracking `editeurNom`.
  directeurPublication: "Anaïs Teck",

  // Taken from Vercel's own Terms of Service, which names this as the address
  // to serve them at, rather than from a directory listing.
  hebergeurNom: "Vercel Inc.",
  hebergeurAdresse: "440 N Barranca Ave #4133, Covina, CA 91723, États-Unis",
};

/** Kept beside the page it stamps, so editing the text is what updates it. */
const DERNIERE_MISE_A_JOUR = "23 août 2026";

const PHONE_DISPLAY = PHONE_E164.replace("+33", "0").replace(/(\d{2})(?=\d)/g, "$1 ");

/**
 * One `dt`/`dd` pair, or nothing at all where the value has not been supplied.
 *
 * A fragment rather than a wrapper element on purpose: `dt` and `dd` have to be
 * direct children of the `dl` to be read as a term and its definition, and a
 * `div` between them would break that.
 */
function Ligne({ label, children }: { label: string; children?: string }) {
  if (!children) return null;

  return (
    <>
      <dt className={dtClass}>{label}</dt>
      <dd className={ddClass}>{children}</dd>
    </>
  );
}

/**
 * The gap between sections belongs to the section, not to its heading. Putting
 * it on the `h2` meant reaching for `first:mt-0` to spare the top one — and
 * every `h2` here is the first child of its own `section`, so that variant
 * matched all ten and flattened the whole page.
 */
const sectionClass = "mt-14";

const h2Class = "text-[0.78rem] font-bold uppercase tracking-[0.14em] text-[#2d2a49]";

const pClass = "mt-4 text-[1rem] leading-[1.75] text-[#2d2a49]/75";

const dtClass = "text-[0.76rem] font-medium uppercase tracking-[0.1em] text-[#2d2a49]/45";

const ddClass = "mt-1 mb-4 text-[1rem] leading-[1.6] text-[#2d2a49]/85";

const inlineLinkClass =
  "underline decoration-[#2d2a49]/30 underline-offset-4 transition-colors duration-200 " +
  "hover:decoration-[#2d2a49] focus-visible:outline focus-visible:outline-2 " +
  "focus-visible:outline-offset-2 focus-visible:outline-[#2d2a49]";

export default function MentionsLegalesPage() {
  return (
    <>
      {/* `pt-32` clears the fixed navbar, whose bottom edge sits at 78px from
          md up — the same clearance problem the contact page hit at py-16. */}
      <main className="bg-[#f5eee8] px-6 pt-32 pb-24 md:pt-40 lg:px-12">
        <div className="mx-auto max-w-[68ch]">
          <Breadcrumb label="Mentions légales" href="/mentions-legales" />

          <h1 className="mt-5 font-extrabold uppercase leading-[0.95] tracking-[-0.03em] text-[clamp(2.25rem,7vw,4rem)] text-[#2d2a49]">
            Mentions légales
          </h1>

          <p className="mt-4 text-[0.78rem] font-medium uppercase tracking-[0.12em] text-[#2d2a49]/45">
            Dernière mise à jour : {DERNIERE_MISE_A_JOUR}
          </p>

          <section className={sectionClass}>
            <h2 className={h2Class}>1. Éditeur du site</h2>
            <p className={pClass}>
              Le site {SITE_NAME} est édité par :
            </p>
            <dl className="mt-6">
              <Ligne label="Nom">{LEGAL.editeurNom}</Ligne>
              <Ligne label="Statut juridique">{LEGAL.editeurStatut}</Ligne>
              <Ligne label="Adresse">{LEGAL.editeurAdresse}</Ligne>

              {/* Not a `Ligne`: the phone is derived from a constant rather
                  than read from `LEGAL`, so it is always present. */}
              <dt className={dtClass}>Téléphone</dt>
              <dd className={ddClass}>
                <a href={`tel:${PHONE_E164}`} className={inlineLinkClass}>
                  {PHONE_DISPLAY}
                </a>
              </dd>

              <Ligne label="E-mail">{LEGAL.editeurEmail}</Ligne>
              <Ligne label="SIRET">{LEGAL.editeurSiret}</Ligne>
              <Ligne label="TVA intracommunautaire">{LEGAL.editeurTva}</Ligne>
            </dl>
          </section>

          <section className={sectionClass}>
            <h2 className={h2Class}>2. Directeur de la publication</h2>
            <p className={pClass}>{LEGAL.directeurPublication}</p>
          </section>

          {/* This article used to open by quoting the statute that reserves the
              title of diététicien, which on a page about the éditrice reads as
              a claim to hold it. She does not, so it says the opposite now —
              plainly, because the disclaimer below is worth more when the
              boundary above it is stated rather than implied. */}
          <section className={sectionClass}>
            <h2 className={h2Class}>3. Nature des prestations</h2>
            <p className={pClass}>
              Les prestations proposées sur ce site relèvent du coaching sportif
              et de l’accompagnement nutritionnel de personnes en bonne santé.
            </p>
            <p className={pClass}>
              L’éditrice n’exerce pas la profession de diététicien, dont le titre
              est réservé en France aux titulaires du diplôme correspondant par
              les articles L.4371-1 à L.4371-6 du code de la santé publique.
            </p>
            <p className={pClass}>
              Ces prestations ne constituent en aucun cas un diagnostic, une
              consultation diététique ni un traitement médical, et ne remplacent
              pas l’avis d’un médecin ou d’un diététicien. En cas de pathologie,
              de traitement en cours ou de régime prescrit, l’avis d’un
              professionnel de santé est indispensable.
            </p>
          </section>

          <section className={sectionClass}>
            <h2 className={h2Class}>4. Hébergement</h2>
            <p className={pClass}>Le site est hébergé par :</p>
            <dl className="mt-6">
              <Ligne label="Hébergeur">{LEGAL.hebergeurNom}</Ligne>
              <Ligne label="Adresse">{LEGAL.hebergeurAdresse}</Ligne>
            </dl>
          </section>

          <section className={sectionClass}>
            <h2 className={h2Class}>5. Conception et réalisation</h2>
            <p className={pClass}>
              Ce site a été conçu et réalisé par HyperWeb,{" "}
              <a
                href="https://agencehyperweb.com/"
                target="_blank"
                rel="noopener noreferrer"
                className={inlineLinkClass}
              >
                agencehyperweb.com
              </a>
              .
            </p>
          </section>

          <section className={sectionClass}>
            <h2 className={h2Class}>6. Propriété intellectuelle</h2>
            <p className={pClass}>
              L’ensemble des contenus présents sur ce site (textes,
              photographies, vidéos, logos et éléments graphiques) est protégé
              par le droit d’auteur. Toute reproduction, représentation ou
              diffusion, totale ou partielle, sans autorisation écrite
              préalable, est interdite.
            </p>
            <p className={pClass}>
              Les photographies de résultats et les témoignages publiés le sont
              avec l’accord des personnes concernées. Les résultats présentés
              sont individuels et ne constituent pas une promesse de résultat.
            </p>
          </section>

          {/* Summary plus a pointer, not a second copy. The detail lives in
              /politique-de-confidentialite, and two full versions of the same
              legal text in one site is how they end up contradicting each other
              — which is worse than having only one. */}
          <section id="donnees-personnelles" className={`${sectionClass} scroll-mt-28`}>
            <h2 className={h2Class}>7. Données personnelles et cookies</h2>
            <p className={pClass}>
              Ce site ne collecte aucune donnée à votre insu et ne dépose aucun
              cookie de mesure d’audience, de publicité ou de traçage. Les
              seules informations traitées sont celles que vous transmettez
              vous-même, pour répondre à votre demande et assurer le suivi de
              votre accompagnement. Elles ne sont ni cédées ni vendues à des
              tiers.
            </p>
            <p className={pClass}>
              Le détail des traitements, des durées de conservation, des
              sous-traitants et des modalités d’exercice de vos droits RGPD
              figure dans la{" "}
              <Link href="/politique-de-confidentialite" className={inlineLinkClass}>
                politique de confidentialité
              </Link>
              .
            </p>
          </section>

          <section className={sectionClass}>
            <h2 className={h2Class}>8. Liens hypertextes</h2>
            <p className={pClass}>
              Ce site comporte des liens vers des sites tiers (réseaux sociaux,
              YouTube, plateforme de prise de rendez-vous). L’éditeur n’exerce
              aucun contrôle sur ces sites et décline toute responsabilité quant
              à leur contenu.
            </p>
          </section>

          {/* The point of this article is to name the mediator; without one the
              sentence would announce a right and then trail off. Hidden whole
              until `mediateurNom` is filled in, at which point it reappears and
              the article below it steps back down to 10. */}
          {LEGAL.mediateurNom && (
            <section className={sectionClass}>
              <h2 className={h2Class}>9. Médiation de la consommation</h2>
              <p className={pClass}>
                Conformément à l’article L.612-1 du code de la consommation, tout
                consommateur a le droit de recourir gratuitement à un médiateur
                de la consommation en vue de la résolution amiable d’un litige.
                Médiateur compétent : {LEGAL.mediateurNom}
                {LEGAL.mediateurSite ? (
                  <>
                    {", "}
                    <a
                      href={LEGAL.mediateurSite}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={inlineLinkClass}
                    >
                      {LEGAL.mediateurSite.replace(/^https?:\/\//, "")}
                    </a>
                  </>
                ) : null}
                .
              </p>
            </section>
          )}

          <section className={sectionClass}>
            {/* The only number that moves, because it is the only article that
                follows a conditional one. */}
            <h2 className={h2Class}>
              {LEGAL.mediateurNom ? 10 : 9}. Droit applicable
            </h2>
            <p className={pClass}>
              Les présentes mentions légales sont soumises au droit français. En
              cas de litige, et à défaut de résolution amiable, les tribunaux
              français sont seuls compétents.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
}
