import variants from '../data/coverVariants.json';

/*
 * Responsive cover variants. scripts/build-blog-image-variants.mjs writes
 * public/blog-thumbnails/<name>-<w>.avif|webp next to each <name>.jpg and lists the widths in
 * src/data/coverVariants.json. A cover with no manifest entry (a new post before the script ran)
 * gets no sources and renders as the plain jpg, so a missing variant never breaks a page.
 */
const MANIFEST = variants as Record<string, number[]>;

/** Hero (post page): 768 px column on desktop, full width on phones. */
export const HERO_WIDTHS = [640, 960, 1280];
export const HERO_SIZES = '(min-width: 768px) 768px, 100vw';
/** Cards (blog index, related, pillars). */
export const CARD_WIDTHS = [240, 480, 640];

export interface CoverSources {
  avifSrcSet: string;
  webpSrcSet: string;
  /** Preload target: the variant a 2x phone picks (960 px when listed, else the widest). */
  preloadHref: string;
}

export function coverSources(src: string, widths: number[]): CoverSources | null {
  const m = /^(\/blog-thumbnails\/[^/]+)\.jpg$/.exec(src);
  if (!m) return null;
  const base = m[1];
  const have = MANIFEST[base.slice(base.lastIndexOf('/') + 1)];
  if (!have) return null;
  const ws = widths.filter((w) => have.includes(w));
  if (ws.length === 0) return null;
  const set = (ext: string) => ws.map((w) => `${base}-${w}.${ext} ${w}w`).join(', ');
  const pick = ws.includes(960) ? 960 : ws[ws.length - 1];
  return { avifSrcSet: set('avif'), webpSrcSet: set('webp'), preloadHref: `${base}-${pick}.avif` };
}
