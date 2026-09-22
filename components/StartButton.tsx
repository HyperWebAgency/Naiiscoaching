"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

import { isExternal } from "@/lib/site";

import { BlobButton } from "./BlobButton";

/** Long enough for the blob to shatter, short enough not to read as lag. */
const SHATTER_MS = 260;

/**
 * The hero CTA. A button rather than a link, because the click has to break the
 * blob apart before it goes anywhere — so nothing prefetches the destination on
 * its own the way a <Link> would, and it is asked for explicitly.
 *
 * `href` comes from the CMS. A path on this site is prefetched and pushed once
 * the blob has shattered; a full address to another site opens in a new tab.
 */
export function StartButton({ href, className }: { href: string; className?: string }) {
  const router = useRouter();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const external = isExternal(href);

  useEffect(() => {
    if (!external) router.prefetch(href);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [router, href, external]);

  return (
    <BlobButton
      size="lg"
      className={className}
      onClick={() => {
        if (timerRef.current) clearTimeout(timerRef.current);
        // Opened here, inside the click, not after the shatter: from the timer
        // it no longer counts as something the visitor asked for, and browsers
        // block it as a popup. The blob still breaks apart on this page.
        if (external) {
          window.open(href, "_blank", "noopener,noreferrer");
          return;
        }
        timerRef.current = setTimeout(() => router.push(href), SHATTER_MS);
      }}
    >
      Réserver mon appel découverte
    </BlobButton>
  );
}
