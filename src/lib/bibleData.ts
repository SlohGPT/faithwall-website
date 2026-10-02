/**
 * Runtime loader for the static Bible data in /public/bible (built by
 * scripts/build-bible-data.mjs). Nothing here is imported into the JS bundle:
 * the index and book files are fetched on demand and cached in memory.
 *
 * Kept free of React so the pick logic can be exercised from plain Node.
 */

export interface BibleBook {
  name: string;
  slug: string;
  /** File stem, e.g. "19-psalms" -> /bible/<translation>/19-psalms.json */
  file: string;
  testament: 'OT' | 'NT';
  /** Verse count of every chapter, in order. */
  verses: number[];
}

export interface BibleTranslation {
  id: string;
  label: string;
}

export interface BibleIndex {
  translations: BibleTranslation[];
  totals: { books: number; chapters: number; verses: number };
  books: BibleBook[];
}

export interface VersePosition {
  bookIndex: number;
  chapter: number; // 1-based
  verse: number; // 1-based
}

/** Book-level chapter text: [chapter][verse] (0-based arrays). */
export type BookText = string[][];

/**
 * Uniform pick over every verse in the Bible: each of the N verses has
 * probability 1/N, so long books and chapters are weighted by their verse
 * count (Psalm 119 is far likelier than Psalm 117, exactly as it should be).
 * `rand` must return a float in [0, 1).
 */
export function pickRandomVerse(index: BibleIndex, rand: () => number = Math.random): VersePosition {
  let target = Math.floor(rand() * index.totals.verses);
  for (let b = 0; b < index.books.length; b++) {
    const chapters = index.books[b].verses;
    for (let c = 0; c < chapters.length; c++) {
      if (target < chapters[c]) return { bookIndex: b, chapter: c + 1, verse: target + 1 };
      target -= chapters[c];
    }
  }
  throw new Error('pickRandomVerse: index totals do not match chapter verse counts');
}

/** "Psalms" reads as "Psalm 23:1" in a single reference. */
export function referenceBookName(name: string): string {
  return name === 'Psalms' ? 'Psalm' : name;
}

let indexPromise: Promise<BibleIndex> | null = null;

export function loadBibleIndex(): Promise<BibleIndex> {
  if (!indexPromise) {
    indexPromise = fetch('/bible/index.json')
      .then((res) => {
        if (!res.ok) throw new Error(`index.json: HTTP ${res.status}`);
        return res.json() as Promise<BibleIndex>;
      })
      .catch((err) => {
        indexPromise = null; // allow a retry on the next click
        throw err;
      });
  }
  return indexPromise;
}

const bookCache = new Map<string, Promise<BookText>>();

export function loadBook(translationId: string, book: BibleBook): Promise<BookText> {
  const key = `${translationId}/${book.file}`;
  let cached = bookCache.get(key);
  if (!cached) {
    cached = fetch(`/bible/${key}.json`)
      .then((res) => {
        if (!res.ok) throw new Error(`${key}: HTTP ${res.status}`);
        return res.json() as Promise<BookText>;
      })
      .catch((err) => {
        bookCache.delete(key);
        throw err;
      });
    bookCache.set(key, cached);
  }
  return cached;
}
