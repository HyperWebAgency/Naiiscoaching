import type { MetadataRoute } from "next";

import { SITE_URL } from "@/lib/site";

/**
 * Served at /sitemap.xml.
 *
 * Listed by hand rather than crawled from the filesystem: there are four
 * routes, and an explicit list means a new page has to be added deliberately
 * instead of appearing in the sitemap the moment someone drops a file in
 * `app/`.
 *
 * `lastModified` is the build time. That is honest for a site whose content
 * ships with the deploy — it changes exactly when the pages do.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    {
      url: SITE_URL,
      lastModified,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/contact`,
      lastModified,
      changeFrequency: "yearly",
      priority: 0.8,
    },
    {
      // Low priority on purpose. It has to be crawlable — the identity details
      // on it are part of how a business site is judged — but it is not a page
      // anyone should be sent to from a search result.
      url: `${SITE_URL}/mentions-legales`,
      lastModified,
      changeFrequency: "yearly",
      priority: 0.2,
    },
    {
      // Same reasoning as the legal notice: it has to be crawlable, but it is
      // not a landing page.
      url: `${SITE_URL}/politique-de-confidentialite`,
      lastModified,
      changeFrequency: "yearly",
      priority: 0.2,
    },
  ];
}
