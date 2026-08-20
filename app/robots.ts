import type { MetadataRoute } from "next";

import { SITE_URL } from "@/lib/site";

/**
 * Served at /robots.txt.
 *
 * Nothing here is private, so everything is crawlable. The one rule that earns
 * its place is the sitemap pointer: it is how a crawler that arrives at the
 * domain without a referring link finds every page in one request.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
