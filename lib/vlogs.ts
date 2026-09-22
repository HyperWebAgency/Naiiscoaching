import vlogs from "@/content/vlogs.json";

/**
 * SERVER ONLY. Asks YouTube for each video's title while the page is built.
 *
 * Read from content/vlogs.json, which Anaïs edits from /admin by pasting links.
 * The title comes from YouTube's oEmbed endpoint, which needs no API key, so
 * the link is all she enters and the title can never disagree with the video.
 * A plain `fetch` in a statically rendered page runs once per build (see the
 * `fetch` reference in the Next docs), so a title changed on YouTube shows up
 * at the next deploy, which is every save in the CMS.
 */

export type Vlog = {
  id: string;
  /** Null when YouTube could not be reached; the card then shows no title. */
  title: string | null;
  watchUrl: string;
  thumbnail: string;
};

const ID = /^[A-Za-z0-9_-]{11}$/;

/**
 * The 11-character id out of whatever gets pasted: a share link
 * (youtu.be/ID?si=…), a watch, shorts, live or embed address, or the bare id.
 * Null when there is none, so one bad entry is skipped rather than failing the
 * build she cannot read the error of.
 */
export function youtubeId(input: string): string | null {
  const value = input.trim();
  if (ID.test(value)) return value;
  try {
    const url = new URL(value);
    const host = url.hostname.replace(/^(www|m)\./, "");
    let candidate: string | null = null;
    if (host === "youtu.be") {
      candidate = url.pathname.slice(1);
    } else if (host === "youtube.com" || host === "youtube-nocookie.com") {
      candidate =
        url.searchParams.get("v") ??
        url.pathname.match(/^\/(?:shorts|live|embed)\/([^/]+)/)?.[1] ??
        null;
    }
    return candidate && ID.test(candidate) ? candidate : null;
  } catch {
    return null;
  }
}

// A slow or unreachable YouTube should cost the build a few seconds, not hang it.
const TIMEOUT_MS = 8_000;

async function describe(id: string): Promise<Vlog> {
  const watchUrl = `https://www.youtube.com/watch?v=${id}`;

  const [oembed, hasMaxres] = await Promise.all([
    fetch(`https://www.youtube.com/oembed?format=json&url=${encodeURIComponent(watchUrl)}`, {
      signal: AbortSignal.timeout(TIMEOUT_MS),
    })
      .then((res) => (res.ok ? (res.json() as Promise<{ title?: string }>) : null))
      .catch(() => null),
    // Same trade as the vlog tab: `maxresdefault` is the sharp 16:9 frame but
    // is not generated for every upload. Checked here rather than with an
    // onError in the browser, because this section ships no JavaScript.
    fetch(`https://i.ytimg.com/vi/${id}/maxresdefault.jpg`, {
      method: "HEAD",
      signal: AbortSignal.timeout(TIMEOUT_MS),
    })
      .then((res) => res.ok)
      .catch(() => false),
  ]);

  if (!oembed?.title) {
    console.warn(`[vlogs] Titre introuvable pour ${id} : la carte s’affichera sans titre.`);
  }

  return {
    id,
    title: oembed?.title ?? null,
    watchUrl,
    // `hqdefault` always exists. It is 4:3 with the frame letterboxed inside,
    // which the card's 16:9 box and `object-cover` crop back to the frame.
    thumbnail: `https://i.ytimg.com/vi/${id}/${hasMaxres ? "maxresdefault" : "hqdefault"}.jpg`,
  };
}

/** In her order. Entries that are not a YouTube link are dropped. */
export async function getVlogs(): Promise<Vlog[]> {
  const ids = vlogs.videos.flatMap((link) => {
    const id = youtubeId(link);
    if (!id) console.warn(`[vlogs] Lien YouTube non reconnu, ignoré : ${link}`);
    return id ? [id] : [];
  });
  return Promise.all(ids.map(describe));
}
