import type { BlogSection } from '../types/blog';

const slugify = (text: string) =>
  text.toLowerCase().replace(/&/g, ' and ').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

/** Stable, unique id per H2 (heading text; "-2", "-3" on repeats), keyed by section index. */
export function headingIds(sections: BlogSection[]): Map<number, { id: string; text: string }> {
  const out = new Map<number, { id: string; text: string }>();
  const seen = new Map<string, number>();
  sections.forEach((sec, i) => {
    if (sec.type !== 'heading' || sec.level !== 2) return;
    const base = slugify(sec.text) || `section-${out.size + 1}`;
    const n = (seen.get(base) ?? 0) + 1;
    seen.set(base, n);
    out.set(i, { id: n === 1 ? base : `${base}-${n}`, text: sec.text });
  });
  return out;
}

/** The "On this page" entries: H2 only, 14 at most, and only from three H2 on. Shared by the post layout and the pillar view. */
export function contentsItems(sections: BlogSection[]): { id: string; text: string }[] {
  const items = [...headingIds(sections).values()];
  return items.length >= 3 ? items.slice(0, 14) : [];
}

