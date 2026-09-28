import { useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Shuffle, Copy, Share2, Check, ExternalLink } from 'lucide-react';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import Breadcrumbs from '../components/Breadcrumbs';
import AppStoreButton from '../components/AppStoreButton';
import verses from '../data/randomVerses.json';
import chapterData from '../data/bibleChapters.json';

const URL = 'https://faithwall.app/random-bible-verse';
const TITLE = 'Random Bible Verse Generator — Get a New Verse Instantly | FaithWall';
const DESC =
  'Free random Bible verse generator with 100+ public-domain KJV verses across ten themes, plus a random chapter picker across all 66 books. No download required.';

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

function bibleGatewayUrl(book: string, chapter: number) {
  return `https://www.biblegateway.com/passage/?search=${encodeURIComponent(
    `${book} ${chapter}`
  )}&version=KJV`;
}

const faqs = [
  {
    question: 'Where do these verses come from?',
    answer:
      "Every verse in the generator is public-domain King James Version (KJV) text, labeled on the card itself, so there's nothing to license and nothing to fabricate — what you see is the verse as written.",
  },
  {
    question: 'Can I set one of these verses as my lock screen automatically?',
    answer:
      'Not from this page — it just picks a random verse in your browser. FaithWall is the free iPhone app that puts a fresh verse on your actual lock screen every day, no manual tapping required.',
  },
  {
    question: 'Is this the same verse list FaithWall uses?',
    answer:
      "It's a curated cross-section across ten themes — love, peace, strength, hope, comfort, faith, joy, gratitude, courage, and guidance — mirroring the themed packs (Anxiety, Strength, Gratitude, Psalms) inside the FaithWall app, which carries a larger rotating library.",
  },
  {
    question: 'Does this generator track or store anything?',
    answer:
      'No. The verse array loads with the page and the picker runs entirely in your browser — no account, no analytics tied to which verse you land on, nothing sent to a server.',
  },
  {
    question: 'Does this generate random Bible chapters, not just verses?',
    answer:
      'Yes — switch to "Random chapter" above the generator and tap New chapter for a chapter picked with equal odds from any of the 66 books, optionally narrowed to the Old Testament, New Testament, Gospels, or Psalms & Proverbs. It links out to the full King James Version text on BibleGateway rather than reproducing it here, so you always read the real passage.',
  },
  {
    question: 'Is this a Bible randomizer for the King James Version only?',
    answer:
      "Right now, yes — every entry is public-domain KJV text, and each verse card shows \"(KJV)\" next to the reference so you always know exactly what you're reading. There's no paraphrase and no modern-translation licensing involved.",
  },
  {
    question: "What's the difference between this and a \"verse of the day\" app?",
    answer:
      'A verse-of-the-day app or widget shows you one fixed verse that changes on a schedule, usually once every 24 hours. This generator gives you a new random verse every time you tap, with no schedule and no waiting — useful for a quick moment, but not something that shows up on its own the way a lock-screen app does.',
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

  const [activeTheme, setActiveTheme] = useState<string | null>(null);
  const pool = useMemo(
    () => (activeTheme ? verses.filter((v) => v.theme === activeTheme) : verses),
    [activeTheme]
  );

  // Deterministic index on first render (server and client match); randomize
  // only after mount so SSR/CSR hydration never disagrees on the initial verse.
  const [index, setIndex] = useState(0);
  useEffect(() => {
    setIndex((current) => pickIndex(current, verses.length));
  }, []);
  const verse = pool[index] ?? pool[0] ?? verses[0];

  const [copyState, setCopyState] = useState<'idle' | 'copied'>('idle');

  function handleThemeSelect(theme: string | null) {
    setActiveTheme(theme);
    const nextPool = theme ? verses.filter((v) => v.theme === theme) : verses;
    setIndex(pickIndex(-1, nextPool.length));
  }

  // Same deterministic-then-randomize pattern as the verse picker above, so
  // the chapter mode never disagrees between server and client on first paint.
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

  function shareText() {
    return `"${verse.text}" — ${verse.reference} (${verse.translation})`;
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

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://faithwall.app/' },
      { '@type': 'ListItem', position: 2, name: 'Random Bible Verse', item: URL },
    ],
  };

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
            <p className="text-brand text-sm font-semibold uppercase tracking-widest mb-3">Free Tool</p>
            <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-tight">
              Random Bible Verse Generator
            </h1>
            <p className="mt-5 text-lg text-white/70 leading-relaxed">
              A random Bible verse generator instantly shows you a Scripture passage — drawn at random
              from a curated, public-domain KJV set of {verses.length} verses spanning {THEMES.length}{' '}
              themes — so you always have a verse one tap away, no download required. Pick a theme below
              to narrow the pool, or switch to chapter mode for a random full chapter from any of the 66
              books instead.
            </p>
          </header>

          <div className="mb-4 flex justify-center gap-2">
            <button
              type="button"
              onClick={() => setPageMode('verse')}
              aria-pressed={pageMode === 'verse'}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors ${
                pageMode === 'verse'
                  ? 'bg-brand text-white'
                  : 'bg-surface-elevated text-white/60 hover:text-white'
              }`}
            >
              Random verse
            </button>
            <button
              type="button"
              onClick={() => setPageMode('chapter')}
              aria-pressed={pageMode === 'chapter'}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors ${
                pageMode === 'chapter'
                  ? 'bg-brand text-white'
                  : 'bg-surface-elevated text-white/60 hover:text-white'
              }`}
            >
              Random chapter
            </button>
          </div>

          {pageMode === 'verse' ? (
            <div className="rounded-3xl p-8 sm:p-10 bg-gradient-to-br from-surface-card to-surface-elevated border-2 border-brand/30 text-center">
              <blockquote>
                <p className="text-white text-2xl sm:text-3xl leading-relaxed font-serif italic">
                  "{verse.text}"
                </p>
                <footer className="mt-4 text-brand font-semibold tracking-wide not-italic">
                  — {verse.reference} ({verse.translation})
                </footer>
              </blockquote>

              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setIndex((current) => pickIndex(current, pool.length))}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand text-white font-bold hover:bg-brand-light transition-colors"
                >
                  <Shuffle className="w-4 h-4" aria-hidden="true" />
                  New verse
                </button>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-surface-elevated text-white font-semibold border border-surface-border hover:border-brand/50 transition-colors"
                >
                  {copyState === 'copied' ? (
                    <Check className="w-4 h-4" aria-hidden="true" />
                  ) : (
                    <Copy className="w-4 h-4" aria-hidden="true" />
                  )}
                  {copyState === 'copied' ? 'Copied' : 'Copy'}
                </button>
                <button
                  type="button"
                  onClick={handleShare}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-surface-elevated text-white font-semibold border border-surface-border hover:border-brand/50 transition-colors"
                >
                  <Share2 className="w-4 h-4" aria-hidden="true" />
                  Share
                </button>
              </div>

              <div className="mt-6 flex flex-wrap justify-center gap-2">
                <button
                  type="button"
                  onClick={() => handleThemeSelect(null)}
                  aria-pressed={activeTheme === null}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                    activeTheme === null
                      ? 'bg-brand text-white'
                      : 'bg-surface-elevated text-white/60 hover:text-white'
                  }`}
                >
                  All themes
                </button>
                {THEMES.map((theme) => (
                  <button
                    key={theme}
                    type="button"
                    onClick={() => handleThemeSelect(theme)}
                    aria-pressed={activeTheme === theme}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold capitalize transition-colors ${
                      activeTheme === theme
                        ? 'bg-brand text-white'
                        : 'bg-surface-elevated text-white/60 hover:text-white'
                    }`}
                  >
                    {theme}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="rounded-3xl p-8 sm:p-10 bg-gradient-to-br from-surface-card to-surface-elevated border-2 border-brand/30 text-center">
              <p className="text-brand text-sm font-semibold uppercase tracking-widest mb-3">
                Random chapter
              </p>
              <p className="text-white text-3xl sm:text-4xl font-black tracking-tight">
                {chapter.book} {chapter.chapter}
              </p>
              <p className="mt-3 text-white/60 text-sm">
                Chosen uniformly at random from {booksForMode(chapterFilter).reduce(
                  (sum, b) => sum + b.chapters,
                  0
                )}{' '}
                chapters in {CHAPTER_MODE_LABELS[chapterFilter].toLowerCase()}.
              </p>

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
                  href={bibleGatewayUrl(chapter.book, chapter.chapter)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-surface-elevated text-white font-semibold border border-surface-border hover:border-brand/50 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" aria-hidden="true" />
                  Read {chapter.book} {chapter.chapter} (KJV)
                </a>
              </div>

              <div className="mt-6 flex flex-wrap justify-center gap-2">
                {(Object.keys(CHAPTER_MODE_LABELS) as ChapterMode[]).map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => handleChapterFilterSelect(mode)}
                    aria-pressed={chapterFilter === mode}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                      chapterFilter === mode
                        ? 'bg-brand text-white'
                        : 'bg-surface-elevated text-white/60 hover:text-white'
                    }`}
                  >
                    {CHAPTER_MODE_LABELS[mode]}
                  </button>
                ))}
              </div>
            </div>
          )}

          <section className="prose prose-invert max-w-none mt-14">
            <h2>What a random Bible verse generator actually does</h2>
            <p>
              A random Bible verse generator is a tool that picks one Scripture passage at random from
              a fixed list and shows it to you instantly — no signup, no searching, no picking a book
              and chapter yourself. Some people search for this same idea as a "Bible randomizer" or a
              "Bible generator"; they all describe the same tap-and-read behavior this page provides.
            </p>
            <p>
              This page draws from a curated set of {verses.length} public-domain KJV verses across{' '}
              {THEMES.length} themes rather than the entire Bible at random, on purpose: an unfiltered
              random draw from all 31,000-plus verses in Scripture returns genealogies and legal
              passages as often as anything encouraging, which is rarely what someone opening a "random
              verse" tool actually wants. Curated randomness — random within a set built for
              encouragement — is the better match for the search intent.
            </p>

            <h2>How to get a random verse of the day automatically</h2>
            <p>
              The fastest way to get a new verse every day without opening this page and tapping is an
              app that puts Scripture where you already look — your iPhone lock screen — automatically,
              on its own schedule, with no manual refresh.{' '}
              <Link to="/best-bible-verse-lock-screen-apps">
                We compared the top scripture lock screen apps
              </Link>{' '}
              so you can see what that looks like next to a manual generator like this one.
            </p>
            <p>
              FaithWall is built specifically for that hand-off: set it up once and a fresh verse
              appears every time you check your phone, no remembering to open an app or tap a button.
              Our <Link to="/daily-scripture-lock-screen">daily Scripture lock screen guide</Link> walks
              through the 60-second setup, wallpaper vs. widget, and which verses work best on a small
              screen — the natural next step once a random verse here has made the case for having one
              every day instead of one on demand.
            </p>

            <h2>How do I get a random Bible chapter to read?</h2>
            <p>
              Switch to "Random chapter" above the generator, optionally narrow it to the Old Testament,
              New Testament, Gospels, or Psalms &amp; Proverbs, then tap New chapter. The picker weighs
              all 1,189 chapters across the 66-book canon equally and links out to the full King James
              Version text on BibleGateway, so what you read is the real passage, not an excerpt.
            </p>
            <p>
              A random chapter generator and a random verse generator answer different searches on
              purpose. If the phrasing that brought you here was "bible randomizer," "random scripture
              generator," or "random Bible chapter generator," chapter mode is built for exactly that —
              one full, correctly-cited chapter, picked with equal odds across every chapter rather than
              weighted toward the Bible's longer books. Verse mode stays a separate, curated-by-theme
              pool for the quicker tap-and-read case; neither replaces the other.
            </p>
            <p>
              Reading a whole chapter instead of a single verse matters for context: a verse pulled alone
              can read as a promise or a command it was never making on its own, while the surrounding
              chapter usually makes the actual point plain — who is speaking, to whom, and why. A random
              chapter picker will not always land somewhere devotional; sometimes it lands in a genealogy
              or a legal passage, and that is the honest trade for reading Scripture in the shape it was
              actually written, rather than only ever the pre-selected, encouraging slice.
            </p>

            <h2>Which translation this is, and why public domain matters</h2>
            <p>
              Every verse here is King James Version text, and the translation is labeled directly on
              the card — "(KJV)" next to the reference — rather than left for you to guess. The KJV
              entered the public domain centuries ago, which means the text can be quoted here in full,
              verbatim, with no licensing fee and no permission request to a publisher. That matters for
              a tool like this one: it's the reason every verse shown is complete and word-for-word
              rather than paraphrased or trimmed to fit a licensing limit.
            </p>

            <h2>Using a random verse for memorization or devotion</h2>
            <p>
              A random verse works well as a memorization prompt precisely because you didn't choose
              it: pick a theme that matches what you're working on — strength, peace, guidance — tap
              until you land on a verse that speaks to it, then read it aloud a few times before moving
              on. For devotional use, treat the randomness as a starting point rather than the whole
              practice: copy the verse, sit with it for a minute, and let the reference (not just the
              words) stick before you tap for another one.
            </p>
          </section>

          <div className="my-10 p-8 rounded-3xl bg-gradient-to-br from-brand/20 to-brand-dark/10 border border-brand/30 text-center">
            <h3 className="text-2xl md:text-3xl font-black text-white mb-3">
              Put a fresh verse on your lock screen automatically
            </h3>
            <p className="text-white/80 mb-6 max-w-xl mx-auto">
              FaithWall is the free iPhone app that does this for you every day — no tapping required.
            </p>
            <div className="flex justify-center">
              <AppStoreButton
                href="https://apps.apple.com/us/app/lock-screen-bible-verse/id6756815070"
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
