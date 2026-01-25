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

export default function Home() {
    return (
        <div className="min-h-screen">
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
