import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Shuffle } from 'lucide-react';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import Breadcrumbs from '../components/Breadcrumbs';
import AppStoreButton from '../components/AppStoreButton';
import verses from '../data/randomVerses.json';

const URL = 'https://faithwall.app/random-bible-verse';
const TITLE = 'Random Bible Verse Generator — Get a New Verse Instantly | FaithWall';
const DESC =
  'Free random Bible verse generator. Tap for a new verse of peace, strength, hope, or comfort — no download, no account, public-domain KJV text.';

const faqs = [
  {
    question: 'Where do these verses come from?',
    answer:
      "Every verse in the generator is public-domain King James Version (KJV) text, so there's nothing to license and nothing to fabricate — what you see is the verse as written.",
  },
  {
    question: 'Can I set one of these verses as my lock screen automatically?',
    answer:
      'Not from this page — it just picks a random verse in your browser. FaithWall is the free iPhone app that puts a fresh verse on your actual lock screen every day, no manual tapping required.',
  },
  {
    question: 'Is this the same verse list FaithWall uses?',
    answer:
      "It's a curated cross-section — peace, strength, hope, comfort, faith, joy, gratitude, courage, and guidance — mirroring the themed packs (Anxiety, Strength, Gratitude, Psalms) inside the FaithWall app, which carries a larger rotating library.",
  },
  {
    question: 'Does this generator track or store anything?',
    answer:
      'No. The verse array loads with the page and the picker runs entirely in your browser — no account, no analytics tied to which verse you land on, nothing sent to a server.',
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
  // Deterministic index on first render (server and client match); randomize
  // only after mount so SSR/CSR hydration never disagrees on the initial verse.
  const [index, setIndex] = useState(0);
  useEffect(() => {
    setIndex((current) => pickIndex(current, verses.length));
  }, []);
  const verse = verses[index];

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
              from a curated, public-domain KJV set spanning peace, strength, hope, and comfort — so
              you always have a verse one tap away, no download required.
            </p>
          </header>

          <div className="rounded-3xl p-8 sm:p-10 bg-gradient-to-br from-surface-card to-surface-elevated border-2 border-brand/30 text-center">
            <blockquote>
              <p className="text-white text-2xl sm:text-3xl leading-relaxed font-serif italic">
                "{verse.text}"
              </p>
              <footer className="mt-4 text-brand font-semibold tracking-wide not-italic">
                — {verse.reference}
              </footer>
            </blockquote>
            <button
              type="button"
              onClick={() => setIndex((current) => pickIndex(current, verses.length))}
              className="mt-8 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand text-white font-bold hover:bg-brand-light transition-colors"
            >
              <Shuffle className="w-4 h-4" aria-hidden="true" />
              New verse
            </button>
          </div>

          <section className="prose prose-invert max-w-none mt-14">
            <h2>Why a random verse generator is only half the answer</h2>
            <p>
              A generator like this one is great for a quick moment — you tap, you read, you move on.
              But the moment ends the second you close the tab. If you want Scripture to actually meet
              you throughout the day, it needs to live somewhere you already look: your iPhone lock
              screen.{' '}
              <Link to="/best-bible-verse-lock-screen-apps">
                We compared the top scripture lock screen apps
              </Link>{' '}
              so you can see what a daily, automatic version of this looks like.
            </p>
            <p>
              FaithWall picks up where this page leaves off. Instead of tapping a button, you set it
              up once and a fresh verse appears every time you check your phone — no manual refresh,
              no remembering to open an app. Our{' '}
              <Link to="/daily-scripture-lock-screen">daily Scripture lock screen guide</Link> walks
              through the 60-second setup, wallpaper vs. widget, and which verses work best on a small
              screen.
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
