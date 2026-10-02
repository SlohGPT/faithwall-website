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

const HOME_TITLE = 'FaithWall — Daily Bible Verse Lock Screen App for iPhone';
const HOME_DESC =
  "FaithWall (Faith Wall) is an iPhone app, free to download, that puts the Bible verses you choose on your lock screen. A subscription unlocks it. See how it works and which translations it supports.";

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
        text: 'FaithWall is an iPhone app, free to download, that puts the Bible verses you choose on your lock screen as a wallpaper or a widget. Using it requires a FaithWall subscription. It requires iOS 16.0 or later.',
      },
    },
    {
      '@type': 'Question',
      name: 'How does FaithWall work?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'You pick your own verses by book, chapter and verse or by search, in 24 translations. After subscribing you choose how to show them: a full-screen lock-screen wallpaper applied with an Apple Shortcut, or a compact lock-screen widget that rotates your saved verses every hour, 8 hours or day. FaithWall is not a Bible reader.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is FaithWall free?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'FaithWall is free to download, but using it requires a subscription. The price, billing period and any trial offer are shown in the App Store before you pay, in your local currency.',
      },
    },
    {
      '@type': 'Question',
      name: 'Which iPhones does FaithWall work on?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'FaithWall supports iPhones running iOS 16.0 or later. It uses iOS lock-screen wallpapers and widgets, which are available on all compatible iPhone models.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is my data private?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Your subscription payment is handled by Apple through the App Store, so FaithWall never sees your card details.',
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
