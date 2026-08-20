import type { Metadata } from "next";

import { ContactExperience } from "@/components/ContactExperience";

export const metadata: Metadata = {
  // Just the page name: the layout's title template appends the brand, so
  // spelling it out here would render it twice.
  title: "Contact",
  description:
    "Prenez contact avec Anaïs, diététicienne et coach à distance à Montpellier. Quinze minutes suffisent pour commencer.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return <ContactExperience />;
}
