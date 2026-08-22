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
