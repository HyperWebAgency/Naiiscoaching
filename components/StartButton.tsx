"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

import { BlobButton } from "./BlobButton";

/** Long enough for the blob to shatter, short enough not to read as lag. */
const SHATTER_MS = 260;

/**
 * The hero CTA. A button rather than a link, because the click has to break the
 * blob apart before it goes anywhere — so nothing prefetches /contact on its
 * own the way a <Link> would, and it is asked for explicitly.
 */
export function StartButton({ className }: { className?: string }) {
  const router = useRouter();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    router.prefetch("/contact");
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [router]);

  return (
    <BlobButton
      size="lg"
      className={className}
      onClick={() => {
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => router.push("/contact"), SHATTER_MS);
      }}
    >
      Commencer
    </BlobButton>
  );
}
