import photos from "@/content/photos.json";

import { withSize, type GalleryImage } from "./gallery";

/**
 * SERVER ONLY, for the same reason as `./gallery`: the sizes are read from the
 * files on disk. Read from content/photos.json, which Anaïs edits from /admin.
 */

type SectionPhoto = {
  photo: GalleryImage;
  /** The flat outline of the same pose, set just behind the photo. */
  silhouette: GalleryImage | null;
};

function section({
  photo,
  alt,
  silhouette,
}: {
  photo: string;
  alt: string;
  silhouette?: string;
}): SectionPhoto {
  return {
    photo: withSize({ src: photo, alt }),
    // Optional in the CMS. It traces the exact pose of the photo in front of
    // it, so a new photo without a matching outline is better shown with none
    // than with the old one peeking out around a different figure. A cleared
    // field arrives as "" or as no key at all, depending on the CMS version.
    silhouette: silhouette ? withSize({ src: silhouette, alt: "" }) : null,
  };
}

/** Hero, top of the home page. */
export const HERO_PHOTO = section(photos.hero);

/** "Qui je suis". The navy silhouette would vanish on this ground, hence its own. */
export const WHO_AM_I_PHOTO = section(photos.whoAmI);

/**
 * The block beside the posing sessions. Fitted whole into its box by CSS, so it
 * needs no measured size, and decorative, so it has no alt.
 */
export const POSING_PHOTO = photos.posing;
