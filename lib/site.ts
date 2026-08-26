import contact from "@/content/contact.json";

/**
 * The canonical origin of the site.
 *
 * The sitemap, robots.txt, `metadataBase` and the structured data all have to
 * agree on this — a mismatch is read by search engines as conflicting signals
 * about which URL is the real one, so they all read it from here.
 *
 * The fallback is the current Vercel deployment, which is where the site
 * actually lives today. It has to be a URL that resolves: `metadataBase` builds
 * the absolute Open Graph image URL from it, so a domain nobody owns means
 * every link preview asks for an image that isn't there.
 *
 * TODO: when a real domain is bought, set NEXT_PUBLIC_SITE_URL in the Vercel
 * project rather than editing this line. It is read at build time, so the
 * change needs a redeploy to take effect.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://naiiscoaching.vercel.app"
).replace(/\/+$/, "");

export const SITE_NAME = "Naiis Coaching";

/**
 * Anaïs's mobile in E.164. Given as "6 77 70 45 10" — a French mobile written
 * without its leading zero — so the country code is France's.
 *
 * Kept as one value because wa.me wants the same digits with no `+` and the
 * structured data wants them with one; deriving both beats keeping two copies
 * in step by hand.
 */
export const PHONE_E164 = contact.phone;

/** Where the contact form and the footer's "Me contacter" both send. */
export const CONTACT_EMAIL = contact.email;

/** The booking link behind "Choisir un créneau d'appel". */
export const CALENDLY_URL = contact.calendly;

/**
 * Strip the share-sheet tracking each link may arrive with: Instagram's
 * `utm_source`/`igsi` and YouTube's `si` are attribution tokens minted for one
 * particular share, so leaving them in would tag every visitor as having come
 * from that single tap. Done here rather than trusted to whoever pastes the
 * link into the CMS.
 */
function clean(url: string) {
  try {
    const parsed = new URL(url);
    for (const key of ["utm_source", "utm_medium", "utm_campaign", "igsh", "igsi", "si"]) {
      parsed.searchParams.delete(key);
    }
    return parsed.toString();
  } catch {
    // Not a URL at all — hand it back untouched rather than losing the value.
    return url;
  }
}

export const SOCIAL = {
  instagram: clean(contact.instagram),
  // Derived, never entered: one wrong digit here and the number that rings is
  // not the number printed on the page.
  whatsapp: `https://wa.me/${PHONE_E164.replace(/\D/g, "")}`,
  youtube: clean(contact.youtube),
};

/**
 * Feeds the meta description, the Open Graph card and the structured data.
 *
 * Says coach, not diététicienne. That title is reserved in France to holders of
 * the diploma (articles L.4371-1 et seq. du code de la santé publique), so
 * claiming it without one is an offence rather than a wording preference.
 */
export const SITE_DESCRIPTION =
  "Anaïs, coach sportive en ligne à Montpellier. Entraînement, nutrition et " +
  "mindset : un accompagnement adapté à votre objectif, votre niveau et votre parcours.";
