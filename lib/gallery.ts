import { readFileSync } from "node:fs";
import { join } from "node:path";

import galeries from "@/content/galeries.json";

/**
 * SERVER ONLY. Reads from the filesystem, so it must never be imported by a
 * component marked `"use client"` — pass the result down as props instead.
 */

export type GalleryImage = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

/**
 * Every image shipped with the site is 1279×1600. Used only when a file cannot
 * be measured — a missing upload, or a format this does not know — so that a
 * bad file degrades to a slightly wrong aspect ratio rather than failing the
 * build. That matters once Anaïs is the one uploading: a build she cannot read
 * the error from is worse than a card that is a little off.
 */
const FALLBACK = { width: 1279, height: 1600 };

/**
 * Intrinsic size straight out of the file header, for WebP, PNG and JPEG.
 *
 * Written out rather than pulled from a package because it is thirty lines and
 * the alternative is a dependency in the build path for something this small.
 * The point of measuring at all: `next/image` needs the real dimensions to
 * reserve the right space before the file loads, and if those are hardcoded
 * then the day Anaïs uploads a photo straight off her phone, every card below
 * it jumps as the page settles.
 */
function measure(buffer: Buffer): { width: number; height: number } | null {
  // PNG — IHDR is always the first chunk, big-endian.
  if (buffer.length >= 24 && buffer.readUInt32BE(0) === 0x89504e47) {
    return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) };
  }

  // WebP — a RIFF container whose second chunk says which of the three
  // encodings it is, and each stores its size differently.
  if (
    buffer.length >= 30 &&
    buffer.toString("ascii", 0, 4) === "RIFF" &&
    buffer.toString("ascii", 8, 12) === "WEBP"
  ) {
    const format = buffer.toString("ascii", 12, 16);

    if (format === "VP8X") {
      // 24-bit little-endian, stored one less than the real value.
      return {
        width: 1 + buffer.readUIntLE(24, 3),
        height: 1 + buffer.readUIntLE(27, 3),
      };
    }
    if (format === "VP8L") {
      const bits = buffer.readUInt32LE(21);
      return { width: 1 + (bits & 0x3fff), height: 1 + ((bits >> 14) & 0x3fff) };
    }
    if (format === "VP8 ") {
      // 14 bits each; the top two are a scaling hint, not part of the size.
      return {
        width: buffer.readUInt16LE(26) & 0x3fff,
        height: buffer.readUInt16LE(28) & 0x3fff,
      };
    }
  }

  // JPEG — no fixed header, so walk the segments to whichever SOF marker
  // carries the frame size.
  if (buffer.length >= 4 && buffer.readUInt16BE(0) === 0xffd8) {
    let offset = 2;
    while (offset + 9 < buffer.length) {
      if (buffer[offset] !== 0xff) {
        offset += 1;
        continue;
      }
      const marker = buffer[offset + 1];
      // Every SOF except the four that are not frame headers (DHT, JPG, DAC,
      // and the restart markers).
      const isFrameHeader =
        marker >= 0xc0 &&
        marker <= 0xcf &&
        marker !== 0xc4 &&
        marker !== 0xc8 &&
        marker !== 0xcc;
      if (isFrameHeader) {
        return {
          height: buffer.readUInt16BE(offset + 5),
          width: buffer.readUInt16BE(offset + 7),
        };
      }
      offset += 2 + buffer.readUInt16BE(offset + 2);
    }
  }

  return null;
}

function withSize({ src, alt }: { src: string; alt: string }): GalleryImage {
  let size: { width: number; height: number } | null = null;

  try {
    // `src` is a public path such as "/avis-2.webp"; the file behind it lives
    // in `public/`, which is also where the CMS is configured to upload.
    size = measure(readFileSync(join(process.cwd(), "public", src)));
  } catch {
    size = null;
  }

  if (!size) {
    console.warn(
      `[galerie] Impossible de lire les dimensions de ${src} — ` +
        `dimensions par défaut utilisées (${FALLBACK.width}×${FALLBACK.height}).`
    );
    size = FALLBACK;
  }

  return { src, alt, ...size };
}

/** Avant/après cards, under "Qui je suis". */
export const RESULTS: GalleryImage[] = galeries.results.map(withSize);

/** Message screenshots, under "Témoignages". */
export const REVIEWS: GalleryImage[] = galeries.reviews.map(withSize);
