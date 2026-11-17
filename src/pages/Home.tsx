import { Helmet } from 'react-helmet-async';
import Navigation from '../components/Navigation';
import Hero from '../components/Hero';
import SocialProof from '../components/SocialProof';
import Features from '../components/Features';
import HowItWorksAndPreview from '../components/HowItWorksAndPreview';
import TestimonialsAndFAQ from '../components/TestimonialsAndFAQ';
import FinalCTA from '../components/FinalCTA';
import Footer from '../components/Footer';
import facts from '../data/facts.json';
import { homeFaq } from '../data/homeFaq';

const HOME_TITLE = 'FaithWall — Daily Bible Verse Lock Screen App for iPhone';
const HOME_DESC =
  "FaithWall (Faith Wall) is an iPhone app, free to download, that puts the Bible verses you choose on your lock screen. See how it works and which translations it supports.";

const mobileApplicationSchema = {
  '@context': 'https://schema.org',
  '@type': 'MobileApplication',
  name: facts.brand,
  alternateName: ['Faith Wall', facts.storeName],
  operatingSystem: facts.minIOSText,
  applicationCategory: 'LifestyleApplication',
  description:
    'FaithWall is an iOS app that displays daily Bible verses on the iPhone lock screen using wallpapers and widgets. Pick your own verse and see Scripture every time you check your phone. Free to download.',
  url: 'https://faithwall.app/',
  downloadUrl: facts.storeUrl,
  installUrl: facts.storeUrl,
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
    description:
      'Free to download.',
  },
  screenshot: [
    'https://faithwall.app/assets/slideshow/slide1.webp',
    'https://faithwall.app/assets/slideshow/slide2.webp',
    'https://faithwall.app/assets/slideshow/slide3.webp',
    'https://faithwall.app/assets/slideshow/slide4.webp',
    'https://faithwall.app/assets/slideshow/slide5.webp',
  ],
  author: {
    '@type': 'Person',
    name: 'Karol Billik',
    url: 'https://faithwall.app/about/karol-billik',
  },
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: homeFaq.map((item) => ({
    '@type': 'Question',
    name: item.q,
    acceptedAnswer: { '@type': 'Answer', text: item.a },
  })),
};

// A hairline that fades out at both ends, so neighbouring sections meet softly instead of at a hard edge.
function Seam() {
    return <div aria-hidden="true" className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />;
}

export default function Home() {
    return (
        <div className="min-h-screen">
            <Helmet>
                <title>{HOME_TITLE}</title>
                <meta name="description" content={HOME_DESC} />
                <link rel="canonical" href="https://faithwall.app/" />
                {/* Lora subset: the Lock Screen verse in the hero phone is only in the first viewport on wide screens, so the
                    preload is wide-only and low priority; on phones the font loads when the verse is laid out. */}
                <link rel="preload" as="font" type="font/woff2" href="/fonts/lora-semibold-latin.woff2" crossOrigin="anonymous" media="(min-width: 768px)" {...{ fetchpriority: 'low' }} />
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
                <script type="application/ld+json">{JSON.stringify(mobileApplicationSchema)}</script>
            </Helmet>
            <Navigation />
            <Hero />
            <SocialProof />
            <Seam />
            <Features />
            <Seam />
            <HowItWorksAndPreview />
            <Seam />
            <TestimonialsAndFAQ />
            <Seam />
            <FinalCTA />
            <Footer />
        </div>
    );
}
