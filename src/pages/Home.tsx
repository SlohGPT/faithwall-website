import { lazy, Suspense } from 'react';
import Navigation from '../components/Navigation';
import Hero from '../components/Hero';
import Footer from '../components/Footer';

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
            <Navigation />
            <Hero />
            <Suspense fallback={<div className="h-40 flex items-center justify-center text-white/20">Loading...</div>}>
                <SocialProof />
                <Features />
                <HowItWorksAndPreview />
                <TestimonialsAndFAQ />
                <Newsletter />
                <FinalCTA />
                <Pricing />
            </Suspense>
            <Footer />
        </div>
    );
}
