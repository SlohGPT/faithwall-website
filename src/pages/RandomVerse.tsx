import { useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Shuffle, Copy, Share2, Check } from 'lucide-react';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import Breadcrumbs from '../components/Breadcrumbs';
import AppStoreButton from '../components/AppStoreButton';
import verses from '../data/randomVerses.json';

const URL = 'https://faithwall.app/random-bible-verse';
const TITLE = 'Random Bible Verse Generator — Get a New Verse Instantly | FaithWall';
const DESC =
  'Free random Bible verse generator with 100+ public-domain KJV verses across ten themes. Pick a theme, tap for a new verse, copy or share it — no download, no account.';

const THEMES = Array.from(new Set(verses.map((v) => v.theme))).sort();

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
      'No — this tool draws from single verses only, not full chapters. That is by design: a whole chapter does not fit the tap-and-read format this page is built for. If you searched for a random chapter generator, this page will still give you a real, correctly-cited verse, just not a multi-verse passage.',
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
              to narrow the pool, or leave it on all themes for full randomness.
            </p>
          </header>

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

            <h2>One verse, not a random chapter — why this tool stays that way</h2>
            <p>
              This generator is built around single verses, so a search for a "random Bible chapter
              generator" or a full passage will not get a multi-verse block here — it gets one real,
              correctly-cited verse instead. That's a deliberate scope choice, not a limitation nobody
              noticed: a full chapter rarely fits a quick tap-and-read moment the way one verse does,
              and stretching this tool to chapter-length text would blur the thing it's actually good
              at. If the phrasing that brought you here was "bible verse random" or "random scripture
              generator," this is the same tool — the underlying behavior (one random, real, cited verse
              per tap) is identical regardless of which of those terms you used to find it.
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
