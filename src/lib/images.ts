/**
 * Curated imagery for StudioSpace.
 *
 * All photos are free-to-use Pexels originals served from the Pexels CDN
 * (`images.pexels.com`, whitelisted in `next.config.ts`). Keeping every URL in
 * one module means the hero, category cards and seed listings never drift apart
 * and any swap happens in exactly one place.
 */

/** Build a Pexels CDN URL for a photo id at a given render width. */
export function pexels(id: number, width = 1200): string {
  return `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${width}`;
}

/** Verified hero slide photos (podcast lounge, control room, film set). */
export const HERO_IMAGES = {
  podcast: pexels(7383469, 2000),
  controlRoom: pexels(12622097, 2000),
  filmSet: pexels(8088380, 2000),
} as const;

/** One representative photo per category (used by the home category cards). */
export const CATEGORY_IMAGES = {
  "photo-studio": pexels(1932666),
  "film-stage": pexels(7865064),
  "podcast-lounge": pexels(38578266),
  "music-suite": pexels(7586136),
  "art-workshop": pexels(39205323),
} as const;

/** Used whenever a listing is missing an image, so the grid never shows a hole. */
export const FALLBACK_STUDIO_IMAGE = pexels(1932666);

/**
 * Curated Pexels photo ids for the demo studio catalogue (used by the seed
 * script and as a fallback pool on the client). Every id here was verified to
 * be reachable before being added.
 */
export const STUDIO_PHOTOS = {
  "photo-studio": [1932666, 3784221, 205316, 1264210, 2510428],
  "film-stage": [7991579, 3062541, 2925326, 1117132, 2873486],
  "podcast-lounge": [7586136, 3771839, 6953852, 4784364, 8090137],
  "music-suite": [164829, 6320, 995301, 39205323, 4087996],
  "art-workshop": [1047540, 3094218, 6728159, 5648354, 5063384],
} as const;
