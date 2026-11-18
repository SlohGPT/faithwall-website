/**
 * Visual rhythm for post bodies (2026-11-18, "don't make the blog posts overwhelmed with the images").
 *
 * Some blocks are always drawn as a picture: images, the spot illustration, the mid-article install card and the
 * closing card ("fixed"). Others can be drawn big or quiet ("flex": verse and stat blocks). A flex block is drawn
 * big only when
 *   1. at least MIN_GAP characters of reading text come since the last big visual (the cover counts as one), and
 *   2. at least MIN_GAP characters come before the next fixed visual (or the article ends first), and
 *   3. the post still has visual budget: one big visual per CHARS_PER_VISUAL characters of text, fixed ones first.
 * Every other flex block is drawn in its quiet form (a quote line or a plain number), so the words stay and the
 * page breathes. Verses are placed before stats. The same rule and numbers are used on all three app sites.
 */
export const MIN_GAP = 650; // about 110 words
export const CHARS_PER_VISUAL = 1500; // about 250 words

/** 'end' is the post's own closing card: it breaks a run like a fixed visual but takes no budget. */
export type RhythmKind = 'text' | 'fixed' | 'flex' | 'end';

export interface RhythmItem {
  kind: RhythmKind;
  /** Characters of reader-facing text in the block. */
  chars: number;
  /** Flex blocks only: lower ranks get their places first (verses 0, stats 1), so the picture that carries the post wins. */
  rank?: number;
}

/**
 * @param items one entry per section, in order
 * @param slots section indexes that get a fixed visual drawn in front of them (illustration, mid card)
 * @returns the set of flex section indexes that render big
 */
export function bigFlexIndexes(items: RhythmItem[], slots: number[]): Set<number> {
  const n = items.length;
  const slotSet = new Set(slots.filter((s) => s >= 0 && s < n));
  const total = items.reduce((sum, it) => sum + it.chars, 0);
  const fixedCount = slotSet.size + items.filter((it, i) => it.kind === 'fixed' && !slotSet.has(i)).length;
  let budget = Math.max(1, Math.floor(total / CHARS_PER_VISUAL)) - fixedCount;
  const big = new Set<number>();
  const breaksAt = (i: number) => slotSet.has(i) || items[i].kind === 'fixed' || items[i].kind === 'end' || big.has(i);
  const ranks = [...new Set(items.filter((it) => it.kind === 'flex').map((it) => it.rank ?? 0))].sort((a, b) => a - b);
  for (const rank of ranks) {
    let since = 0;
    for (let i = 0; i < n; i++) {
      const it = items[i];
      if (slotSet.has(i)) since = 0;
      if (it.kind === 'fixed' || it.kind === 'end' || big.has(i)) {
        since = 0;
        continue;
      }
      if (it.kind === 'flex' && (it.rank ?? 0) === rank && budget > 0 && since >= MIN_GAP) {
        let ahead = 0;
        let j = i + 1;
        for (; j < n && !breaksAt(j); j++) ahead += items[j].chars;
        if (j >= n || ahead >= MIN_GAP) {
          big.add(i);
          budget--;
          since = 0;
          continue;
        }
      }
      since += it.chars;
    }
  }
  return big;
}
