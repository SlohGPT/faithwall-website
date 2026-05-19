import { lazy, Suspense } from 'react';
import { Helmet } from 'react-helmet-async';
import Navigation from '../components/Navigation';
import Hero from '../components/Hero';
import Footer from '../components/Footer';

const HOME_TITLE = 'FaithWall — Daily Bible Verses on Your iPhone Lock Screen';
const HOME_DESC =
  'FaithWall is a free iOS app that displays a fresh Bible verse on your iPhone lock screen every day using wallpapers and widgets. 60-second setup, iOS 16.0+, premium plans from $1.99/month.';

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is FaithWall?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'FaithWall is a free iOS app that displays daily Bible verses on your iPhone lock screen using wallpapers and widgets. It requires iOS 16.0 or later.',
      },
    },
    {
      '@type': 'Question',
      name: 'How does FaithWall work?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'FaithWall installs a Scripture wallpaper or rotating verse widget on your iPhone lock screen using iOS Focus modes. You pick a verse pack — Anxiety, Strength, Gratitude, Psalms — and FaithWall surfaces a fresh verse each day. Setup takes about 60 seconds.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is FaithWall free?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. FaithWall is free to download and includes the core daily verse and lock-screen widgets. Premium plans for unlimited verse packs and customization are $1.99 per month or $8.99 per year.',
      },
    },
    {
      '@type': 'Question',
      name: 'Which iPhones does FaithWall work on?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'FaithWall supports iPhones running iOS 16.0 or later. It uses iOS lock-screen widgets and Focus modes, both available on all compatible iPhone models from iPhone XS onward.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is my data private?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. FaithWall does not require an account and your verse selections stay on your device. Payment data, if you upgrade to a premium plan, is handled by RevenueCat — FaithWall never sees your card details.',
      },
    },
  ],
};

// Below the fold components - Lazy Loaded
const SocialProof = lazy(() => import('../components/SocialProof'));
const Features = lazy(() => import('../components/Features'));
const HowItWorksAndPreview = lazy(() => import('../components/HowItWorksAndPreview'));
const TestimonialsAndFAQ = lazy(() => import('../components/TestimonialsAndFAQ'));
const Newsletter = lazy(() => import('../components/Newsletter'));
const FinalCTA = lazy(() => import('../components/FinalCTA'));
const Pricing = lazy(() => import('../components/Pricing'));

export default function Home() {
    return (
        <div className="min-h-screen">
            <Helmet>
                <title>{HOME_TITLE}</title>
                <meta name="description" content={HOME_DESC} />
                <link rel="canonical" href="https://faithwall.app/" />
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://faithwall.app/" />
                <meta property="og:title" content={HOME_TITLE} />
                <meta property="og:description" content={HOME_DESC} />
                <meta property="og:image" content="https://faithwall.app/og-image.png" />
                <meta property="og:image:width" content="1200" />
                <meta property="og:image:height" content="630" />
                <meta property="og:image:alt" content="FaithWall — Daily Bible Verses on Your iPhone Lock Screen" />
                <meta name="twitter:title" content={HOME_TITLE} />
                <meta name="twitter:description" content={HOME_DESC} />
                <meta name="twitter:image" content="https://faithwall.app/og-image.png" />
                <meta name="twitter:image:alt" content="FaithWall — Daily Bible Verses on Your iPhone Lock Screen" />
                <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
            </Helmet>
            <Navigation />
            <Hero />
            <Suspense fallback={<div className="h-40 flex items-center justify-center text-white/20">Loading...</div>}>
                <SocialProof />
            </Suspense>
            <Suspense fallback={null}>
                <Features />
            </Suspense>
            <Suspense fallback={null}>
                <HowItWorksAndPreview />
            </Suspense>
            <Suspense fallback={null}>
                <TestimonialsAndFAQ />
            </Suspense>
            <Suspense fallback={null}>
                <Newsletter />
            </Suspense>
            <Suspense fallback={null}>
                <FinalCTA />
            </Suspense>
            <Suspense fallback={null}>
                <Pricing />
            </Suspense>
            <Footer />
        </div>
    );
}
