import Link from "next/link";

import { SITE_URL } from "@/lib/site";

/**
 * The trail above a secondary page's title: Accueil / this page.
 *
 * Only the current page is a parameter, because every page on this site is a
 * direct child of the home page — there is no third level to describe. If one
 * ever appears, this takes a list of ancestors instead of a single crumb.
 *
 * It emits its own `BreadcrumbList` JSON-LD alongside the visible trail. That
 * is the half that actually earns its place on a legal page: both of these are
 * indexed, and the structured data is what makes a search result show
 * "naiiscoaching.fr › Mentions légales" rather than a bare URL. The two are
 * built from the same two values here, so the markup and the data cannot drift
 * apart the way they would if the JSON-LD lived in a separate file.
 */
export function Breadcrumb({ label, href }: { label: string; href: string }) {
  const graph = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Accueil", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: label, item: `${SITE_URL}${href}` },
    ],
  };

  return (
    <>
      {/* `aria-label` rather than a heading: a screen reader announces this as
          "Fil d’Ariane, navigation" and can skip it, which is the whole point
          of a landmark. */}
      <nav aria-label="Fil d’Ariane">
        <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[0.72rem] font-medium uppercase tracking-[0.12em]">
          <li>
            <Link
              href="/"
              className="text-[#2d2a49]/55 underline decoration-[#2d2a49]/20 underline-offset-4
                         transition-colors duration-200 hover:text-[#2d2a49]
                         hover:decoration-[#2d2a49]/50 focus-visible:outline
                         focus-visible:outline-2 focus-visible:outline-offset-2
                         focus-visible:outline-[#2d2a49]"
            >
              Accueil
            </Link>
          </li>

          <li aria-hidden className="text-[#2d2a49]/30">
            /
          </li>

          {/* Not a link. A breadcrumb whose last crumb points at the page you
              are already on is a control that does nothing, and `aria-current`
              is what says "this one is where you are". */}
          <li>
            <span aria-current="page" className="text-[#2d2a49]/40">
              {label}
            </span>
          </li>
        </ol>
      </nav>

      <script
        type="application/ld+json"
        // Escaping `<` closes off the one way a JSON payload can break out of a
        // script tag — `label` is page-supplied, so this one is not theoretical.
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(graph).replace(/</g, "\\u003c"),
        }}
      />
    </>
  );
}
