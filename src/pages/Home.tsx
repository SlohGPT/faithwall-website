import Navigation from '../components/Navigation';
import Hero from '../components/Hero';
import SocialProof from '../components/SocialProof';
import Features from '../components/Features';
import HowItWorks from '../components/HowItWorks';
import AppShowcase from '../components/AppShowcase';
import Testimonials from '../components/Testimonials';
import FAQ from '../components/FAQ';
import Newsletter from '../components/Newsletter';
import FinalCTA from '../components/FinalCTA';
import Footer from '../components/Footer';

export default function Home() {
    return (
        <div className="min-h-screen">
            <Navigation />
            <Hero />
            <SocialProof />
            <Features />
            <HowItWorks />
            <AppShowcase />
            <Testimonials />
            <FAQ />
            <Newsletter />
            <FinalCTA />
            <Footer />
        </div>
    );
}
