/**
 * Palettes for the lock-screen verse figure in articles (LockScreenVerse.tsx).
 *
 * These are the same ten palettes the blog covers use (PALETTES in
 * scripts/build-blog-thumbnails.mjs, which in turn reuses STYLE_PRESETS from
 * ./wallpaper.ts), copied as plain values so the article bundle does not pull
 * in the whole wallpaper maker. If a cover palette changes, change it here too.
 */

export interface LockPalette {
  /** CSS background of the screen. */
  bg: string;
  /** Verse colour. */
  text: string;
  /** Reference colour. */
  ref: string;
  /** Clock + date colour. */
  time: string;
  serif: boolean;
  weight: 400 | 500 | 700;
  italic: boolean;
  /** Reference set in tracked capitals (a lock-screen style, not page chrome). */
  upper: boolean;
  shadow?: string;
}

const BRAND_LIGHT = '#E9A06A';
const WHITE = '#ffffff';

const own = (bg: string, extra: Partial<LockPalette> = {}): LockPalette => ({
  bg, text: WHITE, ref: BRAND_LIGHT, time: WHITE, serif: true, weight: 400, italic: false, upper: false, ...extra,
});

export const LOCK_PALETTES: Record<string, LockPalette> = {
  'black-ember': own('#000000'),
  'dark-gradient': {
    bg: 'linear-gradient(180deg, #1c1b33, #0f0e1d, #050509)',
    text: '#f5f3ff', ref: 'rgba(245,243,255,0.6)', time: '#f5f3ff', serif: false, weight: 500, italic: false, upper: false,
  },
  sunrise: {
    bg: 'linear-gradient(180deg, #1a1030, #6b2c52, #d2603c, #f2a65a)',
    text: WHITE, ref: 'rgba(255,255,255,0.88)', time: WHITE, serif: true, weight: 400, italic: true, upper: false,
    shadow: 'rgba(40,10,20,0.35)',
  },
  'navy-gold': {
    bg: 'linear-gradient(180deg, #0c1f46, #08142e, #050c1d)',
    text: '#ecd48a', ref: 'rgba(236,212,138,0.7)', time: '#ecd48a', serif: true, weight: 400, italic: false, upper: true,
  },
  ember: own('linear-gradient(180deg, #1a0c05 0%, #4a2210 45%, #9a4a1d 78%, #d97b3b 100%)', { ref: '#ffe2c4' }),
  plum: own('linear-gradient(180deg, #140a1f 0%, #3b1646 50%, #8a3a55 80%, #e08a5a 100%)', { ref: '#ffd9bf', italic: true }),
  cream: {
    bg: '#f3ebd8',
    text: '#2b2118', ref: '#b4561f', time: '#2b2118', serif: true, weight: 400, italic: false, upper: false,
  },
  'charcoal-orange': {
    bg: 'linear-gradient(160deg, #0a0a0f 55%, #2a170b 100%)',
    text: WHITE, ref: '#D97B3B', time: WHITE, serif: false, weight: 700, italic: false, upper: true,
  },
  dusk: own('linear-gradient(180deg, #0b1424 0%, #1d2f52 48%, #5b5a8a 78%, #e9a06a 100%)', { ref: '#ffe6cf', serif: false, weight: 500 }),
  sand: own('linear-gradient(180deg, #f6ead7 0%, #ecd3ae 100%)', { text: '#2b2118', ref: '#b4561f', time: '#2b2118' }),
};

const PALETTE_ORDER = Object.keys(LOCK_PALETTES);

/** Same reference, same palette, every build (FNV-1a over the reference string). */
export function pickLockPalette(reference: string): LockPalette {
  let h = 0x811c9dc5;
  for (let i = 0; i < reference.length; i++) {
    h ^= reference.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return LOCK_PALETTES[PALETTE_ORDER[h % PALETTE_ORDER.length]];
}

/**
 * Verse size in design units (the phone is 860 units wide; one unit is
 * width / 860). Shorter verses get bigger type; long ones step down but stay
 * readable (about 13.5px at the 260px phone).
 */
export function lockVerseSize(text: string): number {
  const n = text.length;
  if (n <= 60) return 70;
  if (n <= 100) return 60;
  if (n <= 150) return 53;
  if (n <= 220) return 48;
  return 45;
}
