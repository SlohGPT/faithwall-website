import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import Breadcrumbs from '../components/Breadcrumbs';

const NAME = 'Karol Billik';
const URL = 'https://faithwall.app/about/karol-billik';
const DESC =
  'Karol Billik is the founder of FaithWall, an iOS app that puts daily Bible verses on the iPhone lock screen. He writes about prayer rhythms, Scripture habits, and using technology to grow in faith.';

const personSchema = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: NAME,
  url: URL,
  jobTitle: 'Founder',
  worksFor: {
    '@type': 'Organization',
    name: 'FaithWall',
    url: 'https://faithwall.app',
  },
  knowsAbout: [
    'iPhone lock screen Scripture',
    'iOS Focus modes for prayer',
    'Bible study habits',
    'Christian iPhone setup',
    'spiritual disciplines',
  ],
  sameAs: ['https://www.karchi.xyz/'],
};

export default function AuthorKarol() {
  return (
    <div className="min-h-screen bg-surface">
      <Helmet>
        <title>About Karol Billik — Founder of FaithWall</title>
        <meta name="description" content={DESC} />
        <link rel="canonical" href={URL} />
        <meta property="og:type" content="profile" />
        <meta property="og:title" content="Karol Billik — Founder of FaithWall" />
        <meta property="og:description" content={DESC} />
        <meta property="og:url" content={URL} />
        <meta property="og:image" content="https://faithwall.app/og-image.png" />
        <meta name="twitter:title" content="Karol Billik — Founder of FaithWall" />
        <meta name="twitter:description" content={DESC} />
        <meta name="twitter:image" content="https://faithwall.app/og-image.png" />
        <script type="application/ld+json">{JSON.stringify(personSchema)}</script>
      </Helmet>
      <Navigation />
      <main className="container-main pt-28 md:pt-32 pb-20">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <Breadcrumbs
              crumbs={[
                { label: 'Home', to: '/' },
                { label: 'About' },
                { label: 'Karol Billik' },
              ]}
            />
          </div>

          <header className="mb-12 flex flex-col sm:flex-row items-start gap-6">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-brand to-brand-dark flex items-center justify-center text-white text-3xl font-bold shrink-0">
              KB
            </div>
            <div>
              <p className="text-brand text-sm font-semibold uppercase tracking-widest mb-2">Founder &amp; Author</p>
              <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-tight">
                Karol Billik
              </h1>
              <p className="mt-3 text-lg text-white/70 leading-relaxed">
                Founder of FaithWall. Building iPhone tools that turn ordinary phone moments into moments with God.
              </p>
            </div>
          </header>

          <section className="prose prose-invert max-w-none">
            <h2>About</h2>
            <p>
              I&apos;m Karol — an indie iOS builder based in Slovakia. I started FaithWall after
              years of trying to make my own quiet time stick. The pattern that finally worked
              wasn&apos;t another app. It was rearranging what I&apos;d already look at all day —
              my iPhone&apos;s lock screen — so the first thing I saw was Scripture, not a
              notification cluster.
            </p>
            <p>
              FaithWall is what I wish I&apos;d had ten years ago: a small, focused tool that
              quietly carries the Word into the most-seen surface of a smartphone. I write here
              about prayer rhythms, Scripture habits, iOS Focus modes, and the small design
              moves that compound into a centered life.
            </p>

            <h2>What I write about</h2>
            <ul>
              <li>Putting Scripture on the iPhone lock screen — wallpapers, widgets, Focus modes.</li>
              <li>Building a prayer life that survives a busy week — alarms, anchors, voice memos.</li>
              <li>Christian productivity — using your phone as a tool for the soul, not against it.</li>
              <li>Honest comparisons of Christian apps — what each one is actually good for.</li>
            </ul>

            <h2>Elsewhere</h2>
            <ul>
              <li>
                I also run{' '}
                <a href="https://www.karchi.xyz/" target="_blank" rel="noopener noreferrer">karchi.</a>
                {' '}— a small digital studio I use to ship the kind of products I want to use.
              </li>
              <li>
                Email me anytime at{' '}
                <a href="mailto:hello@faithwall.app">hello@faithwall.app</a>.
              </li>
            </ul>
          </section>

          <div className="mt-12">
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors text-sm font-semibold"
            >
              <ArrowLeft className="w-4 h-4" /> Read the blog
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
