/**
 * The canonical origin of the site.
 *
 * The sitemap, robots.txt, `metadataBase` and the structured data all have to
 * agree on this — a mismatch is read by search engines as conflicting signals
 * about which URL is the real one, so they all read it from here.
 *
 * TODO: set NEXT_PUBLIC_SITE_URL to the real domain before launch. The fallback
 * below is inferred from the contact address and is very likely wrong; leaving
 * it in production would publish a sitemap full of URLs that do not resolve.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://naiis-coaching.fr"
).replace(/\/+$/, "");

export const SITE_NAME = "Naiis Coaching";

/**
 * Anaïs's mobile in E.164. Given as "6 77 70 45 10" — a French mobile written
 * without its leading zero — so the country code is France's.
 *
 * Kept as one constant because wa.me wants the same digits with no `+` and the
 * structured data wants them with one; deriving both beats keeping two copies
 * in step by hand.
 */
export const PHONE_E164 = "+33677704510";

/**
 * The share-sheet tracking each link arrived with is stripped:
 * Instagram's `utm_source`/`igsi` and YouTube's `si` are attribution tokens
 * minted for one particular share, so leaving them in would tag every visitor
 * as having come from that single tap.
 */
export const SOCIAL = {
  instagram: "https://www.instagram.com/naiiscoaching/",
  whatsapp: `https://wa.me/${PHONE_E164.replace(/\D/g, "")}`,
  // A playlist rather than the channel — that is the link that was given.
  youtube: "https://www.youtube.com/playlist?list=PLfsuY7-4a2Vk",
};

export const SITE_DESCRIPTION =
  "Anaïs, diététicienne et coach sportive à distance à Montpellier. " +
  "Alimentation, entraînement et suivi adaptés à votre corps et à votre quotidien.";
