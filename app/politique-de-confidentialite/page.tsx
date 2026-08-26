import type { Metadata } from "next";
import Link from "next/link";

import { Breadcrumb } from "@/components/Breadcrumb";
import { Footer } from "@/components/Footer";
import { CONTACT_EMAIL, SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: "Politique de confidentialité",
  description:
    "Politique de confidentialité du site Naiis Coaching : données collectées, finalités, durées de conservation, sous-traitants, cookies et exercice de vos droits RGPD.",
  alternates: { canonical: "/politique-de-confidentialite" },
  robots: { index: true, follow: true },
};

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * THIS DOCUMENT DESCRIBES HOW THE SITE ACTUALLY WORKS TODAY.
 *
 * A privacy policy that describes a site other than the one it is published on
 * is worse than none at all — it is a written statement that can be shown to be
 * false. So every claim below is checked against the code:
 *
 *   - the contact form has no backend and opens the visitor's mail client;
 *   - the two YouTube blocks are click-to-load facades on youtube-nocookie;
 *   - there is no analytics, no ad tag and no consent banner anywhere.
 *
 * If any of those three change, this page changes in the same commit.
 *
 * This is a structure, not legal advice — have it read by someone qualified.
 * ─────────────────────────────────────────────────────────────────────────────
 */

/**
 * Flip to `true` in the same commit that wires the Formspree endpoint into
 * `handleSubmit` in components/ContactExperience.tsx.
 *
 * It is a switch rather than a rewrite because the two states are genuinely
 * different in law: with the mailto the form data never reaches a third party,
 * so there is no processor to name and no transfer to justify. The moment a
 * POST leaves the browser, Formspree becomes a sous-traitant that has to be
 * disclosed here by name. Leaving that paragraph switched off while the POST is
 * live would make this page false.
 */
const FORMSPREE_ACTIVE = false;

const RESPONSABLE = "Anaïs Teck";
const EMAIL = CONTACT_EMAIL;

/** Kept beside the text it stamps, so editing the page is what updates it. */
const DERNIERE_MISE_A_JOUR = "25 août 2026";

const sectionClass = "mt-14";

const h2Class = "text-[0.78rem] font-bold uppercase tracking-[0.14em] text-[#2d2a49]";

const pClass = "mt-4 text-[1rem] leading-[1.75] text-[#2d2a49]/75";

const ulClass = "mt-4 flex flex-col gap-2.5";

const liClass =
  "relative pl-5 text-[1rem] leading-[1.7] text-[#2d2a49]/75 " +
  "before:absolute before:left-0 before:top-[0.7em] before:h-1 before:w-1 " +
  "before:rounded-full before:bg-[#2d2a49]/35";

const inlineLinkClass =
  "underline decoration-[#2d2a49]/30 underline-offset-4 transition-colors duration-200 " +
  "hover:decoration-[#2d2a49] focus-visible:outline focus-visible:outline-2 " +
  "focus-visible:outline-offset-2 focus-visible:outline-[#2d2a49]";

export default function PolitiqueDeConfidentialitePage() {
  return (
    <>
      {/* Same measure and the same clearance under the fixed navbar as the
          legal notice — the two are read as one pair of documents. */}
      <main className="bg-[#f5eee8] px-6 pt-32 pb-24 md:pt-40 lg:px-12">
        <div className="mx-auto max-w-[68ch]">
          <Breadcrumb
            label="Politique de confidentialité"
            href="/politique-de-confidentialite"
          />

          <h1 className="mt-5 font-extrabold uppercase leading-[0.95] tracking-[-0.03em] text-[clamp(2.25rem,7vw,4rem)] text-[#2d2a49]">
            Politique de confidentialité
          </h1>

          <p className="mt-4 text-[0.78rem] font-medium uppercase tracking-[0.12em] text-[#2d2a49]/45">
            Dernière mise à jour&nbsp;: {DERNIERE_MISE_A_JOUR}
          </p>

          <p className={`${pClass} mt-8`}>
            Cette page explique quelles données personnelles sont collectées sur
            le site {SITE_NAME}, pourquoi elles le sont, combien de temps elles
            sont conservées et comment exercer vos droits. Elle complète les{" "}
            <Link href="/mentions-legales" className={inlineLinkClass}>
              mentions légales
            </Link>
            .
          </p>

          <section className={sectionClass}>
            <h2 className={h2Class}>1. Responsable du traitement</h2>
            <p className={pClass}>
              Le responsable du traitement des données collectées sur ce site
              est {RESPONSABLE}, éditrice du site {SITE_NAME}. Les coordonnées
              complètes figurent dans les{" "}
              <Link href="/mentions-legales" className={inlineLinkClass}>
                mentions légales
              </Link>
              . Pour toute question relative à vos données&nbsp;:{" "}
              <a href={`mailto:${EMAIL}`} className={inlineLinkClass}>
                {EMAIL}
              </a>
              .
            </p>
          </section>

          <section className={sectionClass}>
            <h2 className={h2Class}>2. Données collectées</h2>
            <p className={pClass}>
              Ce site ne collecte aucune donnée à votre insu. Il n’y a ni
              création de compte, ni profilage, ni mesure d’audience. Les seules
              données traitées sont celles que vous saisissez vous-même&nbsp;:
            </p>
            <ul className={ulClass}>
              <li className={liClass}>
                <strong className="font-semibold text-[#2d2a49]">
                  Formulaire de contact
                </strong>{" "}
                : nom et prénom, numéro de téléphone, adresse e-mail le cas
                échéant, accompagnement qui vous intéresse, et le message que
                vous rédigez.
              </li>
              <li className={liClass}>
                <strong className="font-semibold text-[#2d2a49]">
                  Prise de rendez-vous
                </strong>{" "}
                : les informations demandées par Calendly au moment de réserver
                un créneau, collectées directement par cette plateforme.
              </li>
              <li className={liClass}>
                <strong className="font-semibold text-[#2d2a49]">
                  Échanges qui suivent
                </strong>{" "}
                : les informations que vous transmettez ensuite par e-mail,
                téléphone ou messagerie dans le cadre d’un accompagnement.
              </li>
            </ul>
            <p className={pClass}>
              Aucune donnée de santé n’est demandée par ce site. Si vous en
              communiquez spontanément dans le cadre d’un accompagnement, elles
              sont traitées de manière strictement confidentielle et
              ne sont jamais publiées.
            </p>
          </section>

          <section className={sectionClass}>
            <h2 className={h2Class}>3. Comment le formulaire fonctionne</h2>
            {FORMSPREE_ACTIVE ? (
              <>
                <p className={pClass}>
                  L’envoi du formulaire de contact transmet les informations
                  saisies au service Formspree, qui les achemine par e-mail vers
                  la boîte de réception de l’éditrice. Formspree agit comme
                  sous-traitant au sens de l’article 28 du RGPD et n’utilise pas
                  ces données à d’autres fins.
                </p>
                <p className={pClass}>
                  La politique de confidentialité de ce prestataire est
                  consultable sur{" "}
                  <a
                    href="https://formspree.io/legal/privacy-policy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={inlineLinkClass}
                  >
                    formspree.io
                  </a>
                  .
                </p>
              </>
            ) : (
              <p className={pClass}>
                Le formulaire de contact de ce site ne transmet aucune donnée à
                un serveur. Il prépare un message dans votre propre logiciel de
                messagerie, que vous restez libre d’envoyer, de modifier ou
                d’abandonner. Les informations saisies ne quittent votre appareil
                qu’au moment où vous envoyez ce message, et ne sont alors reçues
                que par l’éditrice du site.
              </p>
            )}
          </section>

          <section className={sectionClass}>
            <h2 className={h2Class}>4. Finalités et bases légales</h2>
            <ul className={ulClass}>
              <li className={liClass}>
                Répondre à votre demande et vous recontacter&nbsp;: exécution de
                mesures précontractuelles prises à votre demande (article 6.1.b
                du RGPD).
              </li>
              <li className={liClass}>
                Assurer le suivi de votre accompagnement&nbsp;: exécution du
                contrat qui nous lie (article 6.1.b du RGPD).
              </li>
              <li className={liClass}>
                Respecter les obligations comptables et fiscales attachées à
                l’activité&nbsp;: obligation légale (article 6.1.c du RGPD).
              </li>
            </ul>
            <p className={pClass}>
              Aucune donnée n’est utilisée à des fins de prospection
              publicitaire, et il n’existe aucune newsletter sur ce site.
            </p>
          </section>

          <section className={sectionClass}>
            <h2 className={h2Class}>5. Destinataires</h2>
            <p className={pClass}>
              Vos données sont destinées à l’éditrice du site et à elle seule.
              Elles ne sont ni cédées, ni louées, ni vendues à des tiers. Seuls
              interviennent les prestataires techniques nécessaires au
              fonctionnement du site&nbsp;:
            </p>
            <ul className={ulClass}>
              <li className={liClass}>
                <strong className="font-semibold text-[#2d2a49]">Vercel Inc.</strong>{" "}
                : hébergement du site.
              </li>
              {FORMSPREE_ACTIVE && (
                <li className={liClass}>
                  <strong className="font-semibold text-[#2d2a49]">Formspree</strong>{" "}
                  : acheminement des messages envoyés depuis le formulaire de
                  contact.
                </li>
              )}
              <li className={liClass}>
                <strong className="font-semibold text-[#2d2a49]">Calendly</strong>{" "}
                : prise de rendez-vous en visioconférence, dont les conditions
                de traitement sont accessibles sur{" "}
                <a
                  href="https://calendly.com/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={inlineLinkClass}
                >
                  calendly.com
                </a>
                .
              </li>
            </ul>
            <p className={pClass}>
              Ces prestataires sont établis aux États-Unis. Les transferts de
              données qui en découlent sont encadrés par les clauses
              contractuelles types de la Commission européenne et, le cas
              échéant, par le cadre de protection des données UE–États-Unis
              (Data Privacy Framework).
            </p>
          </section>

          <section className={sectionClass}>
            <h2 className={h2Class}>6. Durées de conservation</h2>
            <ul className={ulClass}>
              <li className={liClass}>
                Demande restée sans suite&nbsp;: les échanges sont supprimés au
                plus tard trois ans après le dernier contact.
              </li>
              <li className={liClass}>
                Accompagnement en cours&nbsp;: les données sont conservées
                pendant toute sa durée, puis trois ans après son terme.
              </li>
              <li className={liClass}>
                Pièces comptables&nbsp;: dix ans, comme l’impose l’article
                L.123-22 du code de commerce.
              </li>
            </ul>
          </section>

          <section className={sectionClass}>
            <h2 className={h2Class}>7. Cookies et traceurs</h2>
            {/* Accurate as the site is built today: no analytics, no ad tags,
                and both YouTube blocks are click-to-load facades pointed at
                youtube-nocookie. Adding any measurement tool means this
                paragraph stops being true and a consent banner starts being
                required. */}
            <p className={pClass}>
              Ce site ne dépose aucun cookie de mesure d’audience, de publicité
              ou de traçage. Il n’affiche donc aucune bannière de consentement,
              n’ayant rien à vous demander.
            </p>
            <p className={pClass}>
              Les vidéos YouTube ne sont pas chargées à l’ouverture de la page.
              Seule une image de prévisualisation est affichée&nbsp;; le lecteur
              n’est chargé qu’après un clic explicite de votre part, et transite
              par le domaine youtube-nocookie.com. Tant que vous ne lancez pas
              une vidéo, aucune donnée n’est transmise à YouTube. Si vous en
              lancez une, les conditions de Google s’appliquent au lecteur.
            </p>
          </section>

          <section className={sectionClass}>
            <h2 className={h2Class}>8. Sécurité</h2>
            <p className={pClass}>
              Le site est servi exclusivement en HTTPS. Les échanges liés aux
              accompagnements sont conservés sur des comptes protégés par mot de
              passe, accessibles à la seule éditrice.
            </p>
          </section>

          <section className={sectionClass}>
            <h2 className={h2Class}>9. Vos droits</h2>
            <p className={pClass}>
              Conformément au règlement (UE) 2016/679 (RGPD) et à la loi
              Informatique et Libertés, vous disposez d’un droit d’accès, de
              rectification, d’effacement, de limitation, d’opposition et de
              portabilité de vos données, ainsi que du droit de définir des
              directives relatives à leur sort après votre décès.
            </p>
            <p className={pClass}>
              Ces droits s’exercent par simple demande à{" "}
              <a href={`mailto:${EMAIL}`} className={inlineLinkClass}>
                {EMAIL}
              </a>
              . Une réponse vous sera apportée dans un délai d’un mois. Si la
              réponse ne vous satisfait pas, vous pouvez introduire une
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
          </section>

          <section className={sectionClass}>
            <h2 className={h2Class}>10. Modification de cette politique</h2>
            <p className={pClass}>
              Cette politique peut évoluer si le site change, par exemple si un
              outil de mesure d’audience venait à être ajouté. La date de
              dernière mise à jour affichée en haut de cette page fait foi.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
}
