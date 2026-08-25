import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "lenis/dist/lenis.css";
import "./globals.css";

import { Navbar } from "@/components/Navbar";
import { SmoothScroll } from "@/components/SmoothScroll";
import { StructuredData } from "@/components/StructuredData";
import { ViewportTheme } from "@/components/ViewportTheme";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  // Makes every relative URL in the metadata below absolute. Without it, Open
  // Graph tags ship relative paths, which crawlers and link unfurlers cannot
  // resolve.
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME}, diététicienne et coach sportive à distance à Montpellier`,
    // Pages set only their own name; the brand is appended here so it can never
    // drift between routes. A pipe rather than the comma above: this one is a
    // separator between two names, not a phrase describing one.
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  authors: [{ name: "Anaïs" }],
  creator: "Anaïs",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME}, diététicienne et coach sportive à distance à Montpellier`,
    description: SITE_DESCRIPTION,
  },
  // Without this the card defaults to `summary`, which is the small square
  // thumbnail. The Open Graph image is a 1200x630 banner, and `summary` crops it
  // to a postage stamp. Title and description are inherited from `openGraph`
  // above; only the card type has to be stated.
  twitter: { card: "summary_large_image" },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>
        {/* In the layout rather than on the home page, so a crawler that lands
            on /contact first still sees who the site belongs to. */}
        <StructuredData />

        {/* Both live in the layout rather than in a page: layouts survive
            navigation, so the wordmark does not replay its slide-out on every
            route change, and the scrollbar keeps tracking the section under it
            on every page rather than only on the home page. */}
        <SmoothScroll>
          <Navbar />
          {children}
          <ViewportTheme />
        </SmoothScroll>
      </body>
    </html>
  );
}
