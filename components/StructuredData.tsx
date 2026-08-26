import { PHONE_E164, SITE_DESCRIPTION, SITE_NAME, SITE_URL, SOCIAL } from "@/lib/site";

/**
 * Schema.org structured data, as JSON-LD.
 *
 * Everything here is asserted on the page itself — a coach working remotely
 * from Montpellier, and the three things the accompaniment consists of. Nothing is inferred: no street address, no phone number, no opening
 * hours, no ratings, because none of those are known and structured data that
 * contradicts the page is worse than no structured data at all.
 *
 * `@id` values tie the three nodes together, so a crawler reads one business
 * described from three angles rather than three unrelated entities.
 */
const graph = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: SITE_NAME,
      description: SITE_DESCRIPTION,
      inLanguage: "fr-FR",
      publisher: { "@id": `${SITE_URL}/#business` },
    },
    {
      // `Dietician` would be the precise type for that regulated profession,
      // and stating it here is a machine-readable claim to hold a title she
      // does not. `ProfessionalService` is the accurate parent for a remote
      // coaching practice.
      "@type": "ProfessionalService",
      "@id": `${SITE_URL}/#business`,
      name: SITE_NAME,
      description: SITE_DESCRIPTION,
      url: SITE_URL,
      image: `${SITE_URL}/anais.png`,
      telephone: PHONE_E164,
      // `sameAs` is what lets a search engine treat the accounts and the site as
      // one entity rather than three unconnected things with a similar name.
      sameAs: [SOCIAL.instagram, SOCIAL.youtube],
      // No street address: the coaching is remote, and inventing one would be
      // both false and a local-SEO liability.
      address: {
        "@type": "PostalAddress",
        addressLocality: "Montpellier",
        addressRegion: "Occitanie",
        addressCountry: "FR",
      },
      areaServed: { "@type": "Country", name: "France" },
      availableLanguage: { "@type": "Language", name: "French" },
      founder: { "@id": `${SITE_URL}/#anais` },
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Accompagnement",
        itemListElement: [
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Plan alimentaire personnalisé",
              description:
                "Une alimentation qui fait prendre du muscle et perdre du gras en même temps.",
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Programme d’entraînement personnalisé",
              description:
                "Un programme d’entraînement qui corrige les points faibles et respecte votre morphologie.",
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Suivi hebdomadaire",
              description:
                "Un suivi qui vérifie, semaine après semaine, que tout est appliqué correctement.",
            },
          },
        ],
      },
    },
    {
      "@type": "Person",
      "@id": `${SITE_URL}/#anais`,
      name: "Anaïs",
      jobTitle: "Coach sportive",
      image: `${SITE_URL}/anais.png`,
      worksFor: { "@id": `${SITE_URL}/#business` },
      knowsLanguage: "fr-FR",
    },
  ],
};

export function StructuredData() {
  return (
    <script
      type="application/ld+json"
      // Escaping `<` closes off the one way a JSON payload can break out of a
      // script tag. Everything above is a static constant, but the escape costs
      // nothing and stays correct if any of it later becomes dynamic.
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(graph).replace(/</g, "\\u003c"),
      }}
    />
  );
}
