import type { Metadata } from "next";

import { Footer } from "@/components/Footer";
import { PHONE_E164, SITE_NAME } from "@/lib/site";

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
 * FILL THIS IN BEFORE LAUNCH.
 *
 * Every field left out below renders on the page as a loud "À COMPLÉTER" flag,
 * on purpose: an incomplete legal notice should be impossible to miss rather
 * than quietly wrong. Add the line, the flag disappears.
 *
 * These are the entries required of a French site by article 6-III of the LCEN
 * (loi n° 2004-575), plus the extra ones a regulated health profession owes
 * under articles L.4371-1 et seq. of the code de la santé publique. This is a
 * structure, not legal advice — have it read by someone qualified.
 * ─────────────────────────────────────────────────────────────────────────────
 */
type LegalFields = {
  /** Full legal name of the person or company publishing the site. */
  editeurNom?: string;
  /** e.g. "Entrepreneur individuel (micro-entreprise)". */
  editeurStatut?: string;
  /** Registered address. Required even for a home-based sole trader. */
  editeurAdresse?: string;
  /** Shares a value with `CONTACT_EMAIL` in ContactExperience.tsx, which is
   *  where the contact form sends. Change both together. */
  editeurEmail?: string;
  editeurSiret?: string;
  /** VAT number, or the exemption wording: "TVA non applicable, article 293 B
   *  du CGI" — which is the usual line for a micro-entreprise. */
  editeurTva?: string;
  /** Usually the same person as the publisher. */
  directeurPublication?: string;
  /** e.g. "BTS Diététique, obtenu en France". */
  diplome?: string;
  /** ADELI or RPPS registration number for the dietician's title. */
  numeroAdeli?: string;
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
  editeurEmail: "anais.workspace@gmail.com",

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
 * Renders a value, or a flag where one is missing. The flag borrows the form
 * error colour already used by the contact form, so "something here needs
 * attention" looks the same everywhere on the site.
 */
function Champ({ children }: { children?: string }) {
  if (children) return <>{children}</>;

  return (
    <mark className="rounded bg-[#e08b7a]/30 px-1.5 py-0.5 text-[0.82em] font-bold uppercase tracking-[0.08em] text-[#2d2a49]">
      à compléter
    </mark>
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
          <h1 className="font-extrabold uppercase leading-[0.95] tracking-[-0.03em] text-[clamp(2.25rem,7vw,4rem)] text-[#2d2a49]">
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
              <dt className={dtClass}>Nom</dt>
              <dd className={ddClass}>
                <Champ>{LEGAL.editeurNom}</Champ>
              </dd>

              <dt className={dtClass}>Statut juridique</dt>
              <dd className={ddClass}>
                <Champ>{LEGAL.editeurStatut}</Champ>
              </dd>

              <dt className={dtClass}>Adresse</dt>
              <dd className={ddClass}>
                <Champ>{LEGAL.editeurAdresse}</Champ>
              </dd>

              <dt className={dtClass}>Téléphone</dt>
              <dd className={ddClass}>
                <a href={`tel:${PHONE_E164}`} className={inlineLinkClass}>
                  {PHONE_DISPLAY}
                </a>
              </dd>

              <dt className={dtClass}>E-mail</dt>
              <dd className={ddClass}>
                <Champ>{LEGAL.editeurEmail}</Champ>
              </dd>

              <dt className={dtClass}>SIRET</dt>
              <dd className={ddClass}>
                <Champ>{LEGAL.editeurSiret}</Champ>
              </dd>

              <dt className={dtClass}>TVA intracommunautaire</dt>
              <dd className={ddClass}>
                <Champ>{LEGAL.editeurTva}</Champ>
              </dd>
            </dl>
          </section>

          <section className={sectionClass}>
            <h2 className={h2Class}>2. Directeur de la publication</h2>
            <p className={pClass}>
              <Champ>{LEGAL.directeurPublication}</Champ>
            </p>
          </section>

          <section className={sectionClass}>
            <h2 className={h2Class}>3. Profession réglementée</h2>
            <p className={pClass}>
              Le titre de diététicien est réglementé en France par les articles
              L.4371-1 à L.4371-6 du code de la santé publique. L’exercice de
              cette profession est soumis aux règles professionnelles qui s’y
              rattachent.
            </p>
            <dl className="mt-6">
              <dt className={dtClass}>Diplôme</dt>
              <dd className={ddClass}>
                <Champ>{LEGAL.diplome}</Champ>
              </dd>

              <dt className={dtClass}>Pays de délivrance</dt>
              <dd className={ddClass}>France</dd>

              <dt className={dtClass}>Numéro ADELI / RPPS</dt>
              <dd className={ddClass}>
                <Champ>{LEGAL.numeroAdeli}</Champ>
              </dd>
            </dl>
            <p className={pClass}>
              Les prestations proposées sur ce site relèvent de
              l’accompagnement diététique et sportif. Elles ne constituent en
              aucun cas un diagnostic ni un traitement médical, et ne remplacent
              pas l’avis d’un médecin.
            </p>
          </section>

          <section className={sectionClass}>
            <h2 className={h2Class}>4. Hébergement</h2>
            <p className={pClass}>Le site est hébergé par :</p>
            <dl className="mt-6">
              <dt className={dtClass}>Hébergeur</dt>
              <dd className={ddClass}>
                <Champ>{LEGAL.hebergeurNom}</Champ>
              </dd>

              <dt className={dtClass}>Adresse</dt>
              <dd className={ddClass}>
                <Champ>{LEGAL.hebergeurAdresse}</Champ>
              </dd>
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

          <section className={sectionClass}>
            <h2 className={h2Class}>7. Données personnelles</h2>
            <p className={pClass}>
              Le formulaire de contact de ce site ne transmet aucune donnée à un
              serveur : il prépare un message dans votre propre logiciel de
              messagerie, que vous restez libre d’envoyer ou non. Les
              informations saisies (nom et prénom, téléphone, adresse e-mail et
              message) ne quittent votre appareil qu’au moment où vous envoyez
              ce message, et ne sont alors reçues que par l’éditeur du site.
            </p>
            <p className={pClass}>
              Ces informations sont utilisées uniquement pour répondre à votre
              demande et assurer le suivi de votre accompagnement. Elles ne sont
              ni cédées ni vendues à des tiers.
            </p>
            <p className={pClass}>
              Conformément au règlement (UE) 2016/679 (RGPD) et à la loi
              Informatique et Libertés, vous disposez d’un droit d’accès, de
              rectification, d’effacement, de limitation, d’opposition et de
              portabilité de vos données. Vous pouvez les exercer à l’adresse
              indiquée à l’article 1. Vous pouvez également introduire une
              réclamation auprès de la CNIL (
              <a
                href="https://www.cnil.fr"
                target="_blank"
                rel="noopener noreferrer"
                className={inlineLinkClass}
              >
                cnil.fr
              </a>
              ).
            </p>
            <p className={pClass}>
              La prise de rendez-vous s’effectue via Calendly, dont les
              conditions de traitement des données sont accessibles sur{" "}
              <a
                href="https://calendly.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className={inlineLinkClass}
              >
                calendly.com
              </a>
              .
            </p>
          </section>

          <section className={sectionClass}>
            <h2 className={h2Class}>8. Cookies</h2>
            {/* Accurate as the site is built today: no analytics, no ad tags,
                and the two YouTube blocks are click-to-load facades pointed at
                youtube-nocookie. Adding any measurement tool means this
                paragraph stops being true and a consent banner starts being
                required. */}
            <p className={pClass}>
              Ce site ne dépose aucun cookie de mesure d’audience, de publicité
              ou de traçage. Les vidéos YouTube ne sont chargées qu’après un
              clic explicite de votre part, et transitent par le domaine
              youtube-nocookie.com : tant que vous ne lancez pas une vidéo,
              aucune donnée n’est transmise à YouTube.
            </p>
          </section>

          <section className={sectionClass}>
            <h2 className={h2Class}>9. Liens hypertextes</h2>
            <p className={pClass}>
              Ce site comporte des liens vers des sites tiers (réseaux sociaux,
              YouTube, plateforme de prise de rendez-vous). L’éditeur n’exerce
              aucun contrôle sur ces sites et décline toute responsabilité quant
              à leur contenu.
            </p>
          </section>

          <section className={sectionClass}>
            <h2 className={h2Class}>10. Médiation de la consommation</h2>
            <p className={pClass}>
              Conformément à l’article L.612-1 du code de la consommation, tout
              consommateur a le droit de recourir gratuitement à un médiateur de
              la consommation en vue de la résolution amiable d’un litige.
              Médiateur compétent : <Champ>{LEGAL.mediateurNom}</Champ>
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

          <section className={sectionClass}>
            <h2 className={h2Class}>11. Droit applicable</h2>
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
