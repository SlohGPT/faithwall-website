import { useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Shuffle, Copy, Share2, Check, ExternalLink, Smartphone } from 'lucide-react';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import Breadcrumbs from '../components/Breadcrumbs';
import AppStoreButton from '../components/AppStoreButton';
import AppNudge from '../components/AppNudge';
import { appStoreUrl } from '../lib/appStore';
import verses from '../data/randomVerses.json';
import chapterData from '../data/bibleChapters.json';
import {
  loadBibleIndex,
  loadBook,
  pickRandomVerse,
  referenceBookName,
  type BibleIndex,
  type VersePosition,
} from '../lib/bibleData';

const URL = 'https://faithwall.app/random-bible-verse';
const TITLE = 'Random Bible Verse Generator — All 31,102 Verses (KJV) | FaithWall';
const DESC =
  'Random Bible verse generator: a truly random pick from all 31,102 KJV verses, or 100+ curated verses by topic. Random chapter mode shows the full text.';

const THEMES = Array.from(new Set(verses.map((v) => v.theme))).sort();

type ChapterMode = 'all' | 'OT' | 'NT' | 'gospels' | 'wisdom';

const GOSPEL_BOOKS = new Set(['Matthew', 'Mark', 'Luke', 'John']);
const WISDOM_BOOKS = new Set(['Psalms', 'Proverbs']);

const CHAPTER_MODE_LABELS: Record<ChapterMode, string> = {
  all: 'Whole Bible',
  OT: 'Old Testament',
  NT: 'New Testament',
  gospels: 'Gospels',
  wisdom: 'Psalms & Proverbs',
};

function booksForMode(mode: ChapterMode) {
  if (mode === 'all') return chapterData.books;
  if (mode === 'OT') return chapterData.books.filter((b) => b.testament === 'OT');
  if (mode === 'NT') return chapterData.books.filter((b) => b.testament === 'NT');
  if (mode === 'gospels') return chapterData.books.filter((b) => GOSPEL_BOOKS.has(b.book));
  return chapterData.books.filter((b) => WISDOM_BOOKS.has(b.book));
}

// Chapter counts are a fixed reference table, not something to recompute at
// runtime — this assertion catches a bad edit to bibleChapters.json rather
// than silently skewing which chapters are reachable.
if (chapterData.books.reduce((sum, b) => sum + b.chapters, 0) !== chapterData.totalChapters) {
  throw new Error('bibleChapters.json chapter counts do not sum to totalChapters');
}

function pickRandomChapter(mode: ChapterMode): { book: string; chapter: number } {
  const books = booksForMode(mode);
  const total = books.reduce((sum, b) => sum + b.chapters, 0);
  let target = Math.floor(Math.random() * total);
  for (const b of books) {
    if (target < b.chapters) return { book: b.book, chapter: target + 1 };
    target -= b.chapters;
  }
  const fallback = books[0];
  return { book: fallback.book, chapter: 1 };
}

function bibleGatewayUrl(book: string, chapter: number, version: string) {
  return `https://www.biblegateway.com/passage/?search=${encodeURIComponent(
    `${referenceBookName(book)} ${chapter}`
  )}&version=${encodeURIComponent(version)}`;
}

interface ShownVerse {
  reference: string;
  text: string;
  translation: string;
  /** Present only for Whole Bible picks, so a translation switch can re-fetch the same verse. */
  pos?: VersePosition;
}

type Source = 'bible' | 'topic';

const FALLBACK_NOTE =
  "Couldn't load the full Bible text just now, so this verse comes from the curated set instead.";

const pillClass = (active: boolean) =>
  `px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
    active ? 'bg-brand text-white' : 'bg-surface-elevated text-white/60 hover:text-white'
  }`;

const faqs = [
  {
    question: 'Where do these verses come from?',
    answer:
      "The Whole Bible source draws from the complete King James Version (KJV): all 31,102 verses across 66 books and 1,189 chapters. The By topic source is a curated set of KJV verses grouped by theme. The KJV is in the public domain, so every verse is shown in full and word for word, with the translation labeled on the card.",
  },
  {
    question: 'How many verses are in the Bible?',
    answer:
      'The King James Version has 31,102 verses in 1,189 chapters across 66 books: 23,145 verses in the Old Testament and 7,957 in the New Testament. Other translations divide a few verses differently, so their totals can vary slightly. This generator counts the KJV verses.',
  },
  {
    question: 'Can I set one of these verses as my lock screen?',
    answer:
      'Yes. Under any verse, "Make it a lock-screen wallpaper" opens our wallpaper maker with that verse filled in. For verses on your lock screen on an ongoing basis, FaithWall is an iPhone app where you pick the verses and it shows them as a Shortcut-applied wallpaper or a rotating lock-screen widget.',
  },
  {
    question: 'Is this the same verse list FaithWall uses?',
    answer:
      "No. This page draws from the full KJV plus a curated topic set. In FaithWall you choose which verses appear on your lock screen. FaithWall isn't a Bible reader, so for reading whole chapters, this page's chapter mode or a dedicated Bible app is the better fit.",
  },
  {
    question: 'Does this generator track or store anything?',
    answer:
      "No account is needed, and the random pick happens in your browser. The page downloads Bible text files from this site as static files (the index plus the one book your verse falls in), and nothing about which verse you land on is sent anywhere.",
  },
  {
    question: 'Does this generate random Bible chapters, not just verses?',
    answer:
      'Yes. Switch to "Random chapter" above the generator and tap New chapter for a chapter picked with equal odds from all 1,189 chapters, optionally narrowed to the Old Testament, New Testament, Gospels, or Psalms & Proverbs. The full chapter text appears inline with verse numbers, with a link to read the same chapter on BibleGateway.',
  },
  {
    question: 'Is this a Bible randomizer for the King James Version only?',
    answer:
      'Right now, yes. Every verse and chapter here is public-domain KJV text, and each verse card shows the translation next to the reference so you always know what you are reading. There is no paraphrase and no licensed modern translation on this page.',
  },
  {
    question: "What's the difference between this and a \"verse of the day\" app?",
    answer:
      'A verse-of-the-day app or widget shows one fixed verse that changes on a schedule, usually every 24 hours. This generator gives you a new random verse every time you tap, with no schedule and no waiting. That suits a quick moment, but it will not show up on its own the way a lock-screen app does.',
  },
];

function pickIndex(exclude: number, length: number): number {
  if (length <= 1) return 0;
  let next = Math.floor(Math.random() * length);
  while (next === exclude) {
    next = Math.floor(Math.random() * length);
  }
  return next;
}

export default function RandomVerse() {
  const [pageMode, setPageMode] = useState<'verse' | 'chapter'>('verse');
  const [source, setSource] = useState<Source>('bible');
  const [activeTheme, setActiveTheme] = useState<string | null>(null);

  // First paint (server and client) is always the same curated verse. Nothing
  // random happens until the user clicks, so hydration can never disagree.
  const [shown, setShown] = useState<ShownVerse>(verses[0]);
  const [loading, setLoading] = useState(false);
  const [note, setNote] = useState<string | null>(null);
  const [copyState, setCopyState] = useState<'idle' | 'copied'>('idle');

  // Bible index (about 9 KB) is fetched after mount; book files only on demand.
  const [bibleIndex, setBibleIndex] = useState<BibleIndex | null>(null);
  const [translationId, setTranslationId] = useState('kjv');
  useEffect(() => {
    let cancelled = false;
    loadBibleIndex()
      .then((index) => {
        if (!cancelled) setBibleIndex(index);
      })
      .catch(() => {
        // Retried on the first click; the curated fallback covers a failure.
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const translations = bibleIndex?.translations ?? [{ id: 'kjv', label: 'KJV' }];
  const translationLabel = translations.find((t) => t.id === translationId)?.label ?? 'KJV';

  const requestRef = useRef(0);

  function pickCurated(theme: string | null) {
    const pool = theme ? verses.filter((v) => v.theme === theme) : verses;
    const current = pool.findIndex((v) => v.reference === shown.reference);
    setShown(pool[pickIndex(current, pool.length)] ?? verses[0]);
  }

  /** Whole Bible pick. `fixed` re-fetches a given verse (used when the translation changes). */
  async function pickWholeBible(trId: string, fixed?: VersePosition) {
    const requestId = ++requestRef.current;
    setLoading(true);
    try {
      const index = await loadBibleIndex();
      setBibleIndex(index);
      const translation = index.translations.find((t) => t.id === trId) ?? index.translations[0];
      const pos = fixed ?? pickRandomVerse(index);
      const book = index.books[pos.bookIndex];
      const text = (await loadBook(translation.id, book))[pos.chapter - 1]?.[pos.verse - 1];
      if (!text) throw new Error('verse missing from book file');
      if (requestId !== requestRef.current) return;
      setShown({
        reference: `${referenceBookName(book.name)} ${pos.chapter}:${pos.verse}`,
        text,
        translation: translation.label,
        pos,
      });
      setNote(null);
    } catch {
      if (requestId !== requestRef.current) return;
      pickCurated(null);
      setNote(FALLBACK_NOTE);
    } finally {
      if (requestId === requestRef.current) setLoading(false);
    }
  }

  function handleNewVerse() {
    if (source === 'bible') {
      void pickWholeBible(translationId);
    } else {
      requestRef.current++; // drop any in-flight Whole Bible response
      setLoading(false);
      setNote(null);
      pickCurated(activeTheme);
    }
  }

  function handleSourceSelect(next: Source) {
    setSource(next);
    if (next === 'bible') {
      void pickWholeBible(translationId);
    } else {
      requestRef.current++;
      setLoading(false);
      setNote(null);
      pickCurated(activeTheme);
    }
  }

  function handleThemeSelect(theme: string | null) {
    setActiveTheme(theme);
    setNote(null);
    pickCurated(theme);
  }

  function handleTranslationSelect(id: string) {
    setTranslationId(id);
    if (source === 'bible') void pickWholeBible(id, shown.pos);
  }

  // Chapter mode: same deterministic-then-randomize pattern, so the chapter
  // never disagrees between server and client on first paint.
  const [chapterFilter, setChapterFilter] = useState<ChapterMode>('all');
  const [chapter, setChapter] = useState<{ book: string; chapter: number }>({
    book: chapterData.books[0].book,
    chapter: 1,
  });
  useEffect(() => {
    setChapter(pickRandomChapter('all'));
  }, []);

  function handleChapterFilterSelect(mode: ChapterMode) {
    setChapterFilter(mode);
    setChapter(pickRandomChapter(mode));
  }

  const [chapterText, setChapterText] = useState<{
    status: 'loading' | 'ready' | 'error';
    verses: string[];
  }>({ status: 'loading', verses: [] });
  useEffect(() => {
    if (pageMode !== 'chapter') return;
    let cancelled = false;
    setChapterText({ status: 'loading', verses: [] });
    loadBibleIndex()
      .then((index) => {
        const book = index.books.find((b) => b.name === chapter.book);
        const translation = index.translations.find((t) => t.id === translationId) ?? index.translations[0];
        if (!book) throw new Error('unknown book');
        return loadBook(translation.id, book);
      })
      .then((text) => {
        const chapterVerses = text[chapter.chapter - 1];
        if (!chapterVerses) throw new Error('unknown chapter');
        if (!cancelled) setChapterText({ status: 'ready', verses: chapterVerses });
      })
      .catch(() => {
        if (!cancelled) setChapterText({ status: 'error', verses: [] });
      });
    return () => {
      cancelled = true;
    };
  }, [pageMode, chapter, translationId]);

  function shareText() {
    return `"${shown.text}" — ${shown.reference} (${shown.translation})`;
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(shareText());
      setCopyState('copied');
      setTimeout(() => setCopyState('idle'), 2000);
    } catch {
      // Clipboard API unavailable (unsupported browser or blocked permission); no-op.
    }
  }

  async function handleShare() {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({ text: shareText(), url: URL });
      } catch {
        // User cancelled the native share sheet, or share isn't actually
        // supported at runtime despite feature-detecting true; no-op either way.
      }
    } else {
      handleCopy();
    }
  }

  // Contract with the wallpaper-maker page: /bible-verse-wallpaper-maker?text=&ref=&tr=
  const wallpaperHref = `/bible-verse-wallpaper-maker?text=${encodeURIComponent(
    shown.text
  )}&ref=${encodeURIComponent(shown.reference)}&tr=${encodeURIComponent(shown.translation)}`;

  const translationToggle =
    translations.length > 1 ? (
      <div className="mt-6 flex flex-wrap items-center justify-center gap-2" role="group" aria-label="Translation">
        <span className="text-xs font-semibold uppercase tracking-widest text-white/50">Translation</span>
        {translations.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => handleTranslationSelect(t.id)}
            aria-pressed={translationId === t.id}
            className={pillClass(translationId === t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>
    ) : null;

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://faithwall.app/' },
      { '@type': 'ListItem', position: 2, name: 'Random Bible Verse', item: URL },
    ],
  };

  const modeButtonClass = (active: boolean) =>
    `px-4 py-2 rounded-xl text-sm font-bold transition-colors ${
      active ? 'bg-brand text-white' : 'bg-surface-elevated text-white/60 hover:text-white'
    }`;
  const secondaryButtonClass =
    'inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-surface-elevated text-white font-semibold border border-surface-border hover:border-brand/50 transition-colors';

  return (
    <div className="min-h-screen bg-surface">
      <Helmet>
        <title>{TITLE}</title>
        <meta name="description" content={DESC} />
        <link rel="canonical" href={URL} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={URL} />
        <meta property="og:title" content={TITLE} />
        <meta property="og:description" content={DESC} />
        <meta property="og:image" content="https://faithwall.app/og-image.png" />
        <meta name="twitter:title" content={TITLE} />
        <meta name="twitter:description" content={DESC} />
        <meta name="twitter:image" content="https://faithwall.app/og-image.png" />
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
      </Helmet>
      <Navigation />

      <main className="container-main pt-28 md:pt-32 pb-20">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <Breadcrumbs
              crumbs={[
                { label: 'Home', to: '/' },
                { label: 'Random Bible Verse' },
              ]}
            />
          </div>

          <header className="mb-10">
            <p className="text-brand text-sm font-semibold uppercase tracking-widest mb-3">Bible Tool</p>
            <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-tight">
              Random Bible Verse Generator
            </h1>
            <p className="mt-5 text-lg text-white/70 leading-relaxed">
              This random Bible verse generator picks one verse at random from all 31,102 verses of the
              King James Version, from Genesis 1:1 to Revelation 22:21, with every verse equally likely.
              Prefer a theme? Switch to By topic for a curated set of {verses.length} verses across{' '}
              {THEMES.length} themes, or use Random chapter to read a full chapter inline. The KJV is
              public domain, so every verse is shown in full.
            </p>
          </header>

          <div className="mb-4 flex justify-center gap-2">
            <button
              type="button"
              onClick={() => setPageMode('verse')}
              aria-pressed={pageMode === 'verse'}
              className={modeButtonClass(pageMode === 'verse')}
            >
              Random verse
            </button>
            <button
              type="button"
              onClick={() => setPageMode('chapter')}
              aria-pressed={pageMode === 'chapter'}
              className={modeButtonClass(pageMode === 'chapter')}
            >
              Random chapter
            </button>
          </div>

          {pageMode === 'verse' ? (
            <div className="rounded-3xl p-8 sm:p-10 bg-gradient-to-br from-surface-card to-surface-elevated border-2 border-brand/30 text-center">
              <blockquote aria-live="polite">
                <p className="text-white text-2xl sm:text-3xl leading-relaxed font-serif italic">
                  "{shown.text}"
                </p>
                <footer className="mt-4 text-brand font-semibold tracking-wide not-italic">
                  — {shown.reference} ({shown.translation})
                </footer>
              </blockquote>
              {note && <p className="mt-4 text-xs text-white/50">{note}</p>}

              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={handleNewVerse}
                  disabled={loading}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand text-white font-bold hover:bg-brand-light transition-colors disabled:opacity-70"
                >
                  <Shuffle className="w-4 h-4" aria-hidden="true" />
                  {loading ? 'Loading…' : 'New verse'}
                </button>
                <button type="button" onClick={handleCopy} className={secondaryButtonClass}>
                  {copyState === 'copied' ? (
                    <Check className="w-4 h-4" aria-hidden="true" />
                  ) : (
                    <Copy className="w-4 h-4" aria-hidden="true" />
                  )}
                  {copyState === 'copied' ? 'Copied' : 'Copy'}
                </button>
                <button type="button" onClick={handleShare} className={secondaryButtonClass}>
                  <Share2 className="w-4 h-4" aria-hidden="true" />
                  Share
                </button>
              </div>

              <div className="mt-3 flex justify-center">
                <a href={wallpaperHref} className={secondaryButtonClass}>
                  <Smartphone className="w-4 h-4" aria-hidden="true" />
                  Make it a lock-screen wallpaper
                </a>
              </div>

              <AppNudge
                campaign="web-random-verse-card"
                title="Want a verse on your lock screen every day?"
                className="mt-5"
              >
                You do not have to come back here. FaithWall is an iPhone app that puts the verses you
                choose on your lock screen.
              </AppNudge>

              <div className="mt-6 flex flex-wrap justify-center gap-2" role="group" aria-label="Verse source">
                <button
                  type="button"
                  onClick={() => handleSourceSelect('bible')}
                  aria-pressed={source === 'bible'}
                  className={pillClass(source === 'bible')}
                >
                  Whole Bible
                </button>
                <button
                  type="button"
                  onClick={() => handleSourceSelect('topic')}
                  aria-pressed={source === 'topic'}
                  className={pillClass(source === 'topic')}
                >
                  By topic
                </button>
              </div>

              {source === 'bible' ? (
                <>
                  <p className="mt-3 text-xs text-white/50">
                    Picked uniformly from all 31,102 verses of the KJV.
                  </p>
                  {translationToggle}
                </>
              ) : (
                <div className="mt-4 flex flex-wrap justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleThemeSelect(null)}
                    aria-pressed={activeTheme === null}
                    className={pillClass(activeTheme === null)}
                  >
                    All themes
                  </button>
                  {THEMES.map((theme) => (
                    <button
                      key={theme}
                      type="button"
                      onClick={() => handleThemeSelect(theme)}
                      aria-pressed={activeTheme === theme}
                      className={`${pillClass(activeTheme === theme)} capitalize`}
                    >
                      {theme}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="rounded-3xl p-8 sm:p-10 bg-gradient-to-br from-surface-card to-surface-elevated border-2 border-brand/30 text-center">
              <p className="text-brand text-sm font-semibold uppercase tracking-widest mb-3">
                Random chapter
              </p>
              <p className="text-white text-3xl sm:text-4xl font-black tracking-tight">
                {referenceBookName(chapter.book)} {chapter.chapter}{' '}
                <span className="text-white/50 text-lg font-semibold">({translationLabel})</span>
              </p>
              <p className="mt-3 text-white/60 text-sm">
                Chosen uniformly at random from {booksForMode(chapterFilter).reduce(
                  (sum, b) => sum + b.chapters,
                  0
                )}{' '}
                chapters in {CHAPTER_MODE_LABELS[chapterFilter].toLowerCase()}.
              </p>

              <div className="mt-6 max-h-96 overflow-y-auto rounded-2xl bg-surface/60 border border-surface-border p-5 text-left">
                {chapterText.status === 'ready' ? (
                  <div className="space-y-2 font-serif text-white/90 leading-relaxed">
                    {chapterText.verses.map((text, i) => (
                      <p key={i}>
                        <sup className="mr-1.5 text-xs font-sans font-bold text-brand">{i + 1}</sup>
                        {text}
                      </p>
                    ))}
                  </div>
                ) : chapterText.status === 'loading' ? (
                  <p className="text-sm text-white/50">Loading chapter text…</p>
                ) : (
                  <p className="text-sm text-white/60">
                    Couldn't load the chapter text just now. You can read it on BibleGateway with the
                    link below.
                  </p>
                )}
              </div>

              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setChapter(pickRandomChapter(chapterFilter))}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand text-white font-bold hover:bg-brand-light transition-colors"
                >
                  <Shuffle className="w-4 h-4" aria-hidden="true" />
                  New chapter
                </button>
                <a
                  href={bibleGatewayUrl(chapter.book, chapter.chapter, translationLabel)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={secondaryButtonClass}
                >
                  <ExternalLink className="w-4 h-4" aria-hidden="true" />
                  Read on BibleGateway
                </a>
              </div>

              {translationToggle}

              <div className="mt-6 flex flex-wrap justify-center gap-2">
                {(Object.keys(CHAPTER_MODE_LABELS) as ChapterMode[]).map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => handleChapterFilterSelect(mode)}
                    aria-pressed={chapterFilter === mode}
                    className={pillClass(chapterFilter === mode)}
                  >
                    {CHAPTER_MODE_LABELS[mode]}
                  </button>
                ))}
              </div>
            </div>
          )}

          <section className="prose prose-invert max-w-none mt-14">
            <h2>What does a random Bible verse generator do?</h2>
            <p>
              A random Bible verse generator picks one Scripture verse for you at the tap of a button,
              with no signup and no choosing a book or chapter yourself. This one can draw from all
              31,102 verses of the King James Version or from a curated topic set. It is also called a
              Bible randomizer or a random scripture generator.
            </p>
            <p>
              Whole Bible mode includes everything, genealogies and legal passages as well as the
              well-known promises, which is what makes it a real random draw. If you want something
              encouraging, By topic mode draws from {verses.length} curated verses across{' '}
              {THEMES.length} themes: love, peace, strength, hope, comfort, faith, joy, gratitude,
              courage, and guidance.
            </p>

            <h2>Is this generator truly random?</h2>
            <p>
              Yes, as random as your browser's random number generator allows. In Whole Bible mode the
              page treats all 31,102 verses as one numbered list, draws a single number uniformly with
              JavaScript's Math.random(), and returns the verse at that position, so every verse has
              exactly the same chance. Because the draw is per verse rather than per book, long books
              come up more often: Psalms holds 2,461 verses, about 8% of the Bible, while 2 John has 13.
              Math.random() is pseudo-random, not cryptographic, and the generator keeps no memory of
              earlier picks, so a repeat is possible. For picking a verse to read, that is more than
              random enough.
            </p>

            <h2>Which Bible translation does this generator use?</h2>
            <p>
              This generator uses the King James Version (KJV), and the translation is labeled next to
              every reference. The KJV is in the public domain, so the text can be shown in full,
              word for word, with no licensing fee and no paraphrase. Both the Whole Bible source and
              the curated topic set use the same KJV text.
            </p>
            <p>
              The public-domain choice is deliberate: it is why this page can show complete verses and
              full chapters inline instead of linking you elsewhere for every passage. Modern
              translations such as the NIV or ESV are under copyright and cannot be reproduced at this
              scale without a license.
            </p>

            <h2>How do I get a random Bible chapter to read?</h2>
            <p>
              Switch to "Random chapter" above the generator, optionally narrow it to the Old
              Testament, New Testament, Gospels, or Psalms &amp; Proverbs, then tap New chapter. The
              picker gives all 1,189 chapters across the 66 books equal odds, and the full chapter text
              appears right on the page with verse numbers. A link lets you read the same chapter on
              BibleGateway.
            </p>
            <p>
              If your search was "random Bible chapter generator," chapter mode is built for exactly
              that: one complete, correctly cited chapter, picked with equal odds per chapter rather
              than weighted toward the longer books. Reading the whole chapter also gives context a
              single verse cannot: who is speaking, to whom, and why. A random chapter will not always
              land somewhere devotional, and that is the honest trade for reading Scripture in the
              shape it was written.
            </p>

            <h2>How can I get a random Bible verse automatically every day?</h2>
            <p>
              The easiest way is an app that keeps Scripture on your iPhone lock screen, so you never
              have to open a page and tap. FaithWall does this with verses you pick yourself, shown as
              a wallpaper applied through an iOS Shortcut or as a rotating lock-screen widget. It is
              not a Bible reader.
            </p>
            <p>
              <Link to="/best-bible-verse-lock-screen-apps">
                We compared the top scripture lock screen apps
              </Link>{' '}
              to show how that looks next to a manual generator like this one. Our{' '}
              <Link to="/daily-scripture-lock-screen">daily Scripture lock screen guide</Link> walks
              through setup, wallpaper versus widget, and which verses work best on a small screen. If
              a verse here catches your eye, the "Make it a lock-screen wallpaper" button under it
              turns it into a wallpaper image.
            </p>

            <h2>How do I use a random verse for memorization or devotion?</h2>
            <p>
              Treat the random pick as a starting prompt, not the whole practice. Read the verse aloud
              a few times, then sit with it for a minute. For memorization, choose By topic to match
              what you are working on, such as strength or peace, and tap until a verse speaks to it.
            </p>
            <p>
              Copy the verse, note the reference as well as the words, and then move on.
            </p>
          </section>

          <div className="my-10 p-8 rounded-3xl bg-gradient-to-br from-brand/20 to-brand-dark/10 border border-brand/30 text-center">
            <h3 className="text-2xl md:text-3xl font-black text-white mb-3">
              Keep your verses on your lock screen
            </h3>
            <p className="text-white/80 mb-6 max-w-xl mx-auto">
              With FaithWall you pick the verses, and they show on your iPhone lock screen as a
              wallpaper or a rotating widget, with no tapping required.
            </p>
            <div className="flex justify-center">
              <AppStoreButton
                href={appStoreUrl('web-random-verse')}
                theme="light"
              />
            </div>
          </div>

          <section className="mt-4">
            <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight mb-5">
              Frequently asked questions
            </h2>
            <div className="space-y-4">
              {faqs.map((item) => (
                <div key={item.question} className="p-5 rounded-xl bg-surface-card border border-surface-border">
                  <p className="font-bold text-white mb-2">{item.question}</p>
                  <p className="text-white/75 leading-relaxed text-sm">{item.answer}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
