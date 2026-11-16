import randomVerses from './randomVerses.json';

/**
 * Verses shown in the homepage mockups (hero, features, How it works). The text is looked up in
 * randomVerses.json, never typed by hand, and must be the KJV. A missing reference or another
 * translation fails the build, so a mockup can never show a verse the site does not carry.
 */
export interface ShowcaseVerse {
  reference: string;
  text: string;
}

const SHOWCASE_REFERENCES = [
  'Psalm 23:1',
  'Philippians 4:13',
  'Psalm 46:1',
  'Psalm 119:105',
  '2 Corinthians 5:7',
  'Matthew 11:28',
] as const;

export const SHOWCASE_VERSES: ShowcaseVerse[] = SHOWCASE_REFERENCES.map((reference) => {
  const row = (randomVerses as { reference: string; text: string; translation: string }[]).find(
    (v) => v.reference === reference,
  );
  if (!row) throw new Error(`showcaseVerses: ${reference} is missing from randomVerses.json`);
  if (row.translation !== 'KJV') {
    throw new Error(`showcaseVerses: ${reference} is ${row.translation} in randomVerses.json, expected KJV`);
  }
  return { reference: row.reference, text: row.text };
});
