import { Helmet } from 'react-helmet-async';
import Navigation from '../components/Navigation';
import Hero from '../components/Hero';
import SocialProof from '../components/SocialProof';
import Features from '../components/Features';
import HowItWorksAndPreview from '../components/HowItWorksAndPreview';
import TestimonialsAndFAQ from '../components/TestimonialsAndFAQ';
import Newsletter from '../components/Newsletter';
import FinalCTA from '../components/FinalCTA';
import Pricing from '../components/Pricing';
import Footer from '../components/Footer';

const HOME_TITLE = 'FaithWall — Daily Bible Verse Lock Screen App for iPhone (Free)';
const HOME_DESC =
  "FaithWall (Faith Wall) is the free iPhone app that puts a fresh Bible verse on your lock screen every day. See how it works, browse verse packs, and set it up in 60 seconds.";

const softwareApplicationSchema = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'FaithWall',
  alternateName: 'Faith Wall',
  applicationCategory: 'LifestyleApplication',
  operatingSystem: 'iOS 16.0 or later',
  url: 'https://faithwall.app/',
  downloadUrl: 'https://apps.apple.com/us/app/lock-screen-bible-verse/id6756815070',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
};

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'FaithWall',
  alternateName: 'Faith Wall',
  url: 'https://faithwall.app/',
};

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
        text: 'Yes. FaithWall is free to download and includes the core daily verse and lock-screen widgets. Optional premium plans unlock unlimited verse packs and customization — the price, billing period, and any free trial are shown in the App Store at checkout, in your local currency.',
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
                <script type="application/ld+json">{JSON.stringify(softwareApplicationSchema)}</script>
                <script type="application/ld+json">{JSON.stringify(websiteSchema)}</script>
            </Helmet>
            <Navigation />
            <Hero />
            <SocialProof />
            <Features />
            <HowItWorksAndPreview />
            <TestimonialsAndFAQ />
            <Newsletter />
            <FinalCTA />
            <Pricing />
            <Footer />
        </div>
    );
}
