/**
 * Pages held out of the visible conversion layer (mid-article install card, restyled end card)
 * until the November 2026 core-update read-out. Queue item p72 releases them, not before 2026-12-02.
 *
 * Fact corrections, the official App Store badge artwork, campaign tokens and site-wide chrome
 * (navigation, footer, sticky bar) still apply to these pages.
 *
 * Membership is fixed until the read-out: these pages are the comparison group, so never add or
 * remove a slug before p72 runs.
 */
export const HOLD_BLOG_SLUGS: ReadonlySet<string> = new Set([
  // hub
  'best-free-bible-app-iphone',
  // control posts (comparison group)
  'hallow-vs-abide',
  'best-bible-study-app-iphone-2026',
  'faithwall-vs-pray-com',
  'bible-verse-widget-iphone',
  'sermon-notes-iphone-app',
  'prayer-journal-app-iphone-2026',
]);

/** Every pillar page and every compare page is held. */
export const HOLD_ALL_PILLARS = true;
export const HOLD_ALL_COMPARE = true;

export type ConversionPageType = 'blog' | 'pillar' | 'compare';

export function isConversionHeld(pageType: ConversionPageType, slug: string): boolean {
  if (pageType === 'pillar') return HOLD_ALL_PILLARS;
  if (pageType === 'compare') return HOLD_ALL_COMPARE;
  return HOLD_BLOG_SLUGS.has(slug);
}
