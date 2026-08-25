import type { Metadata } from "next";

import { ContactExperience } from "@/components/ContactExperience";

export const metadata: Metadata = {
  // Just the page name: the layout's title template appends the brand, so
  // spelling it out here would render it twice.
  title: "Contact",
  // Kept in the vouvoiement the rest of the site's metadata uses — this is the
  // line a search result shows, not page copy. The old version promised "quinze
  // minutes", which was the headline that has since been replaced.
  description:
    "Prenez contact avec Anaïs, diététicienne et coach à distance à Montpellier. Quelques informations suffisent pour faire le premier pas.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return <ContactExperience />;
}
