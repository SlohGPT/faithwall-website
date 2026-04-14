import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';

export default function NotFound() {
    return (
        <div className="min-h-screen bg-surface">
            <Helmet>
                <title>Page Not Found | FaithWall</title>
                <meta name="description" content="The page you're looking for doesn't exist. Return to FaithWall to transform your lock screen with daily scripture." />
                <meta name="robots" content="noindex, follow" />
            </Helmet>
            <Navigation />
            <main className="container-main pt-32 pb-16 flex flex-col items-center justify-center min-h-[60vh] text-center">
                <h1 className="text-6xl sm:text-8xl font-bold text-white mb-4">404</h1>
                <p className="text-xl text-white/60 mb-8 max-w-md">
                    This page doesn't exist. Let's get you back to something meaningful.
                </p>
                <Link
                    to="/"
                    className="inline-flex items-center justify-center px-8 py-3 bg-brand text-white font-bold rounded-xl hover:bg-brand-light transition-colors"
                >
                    Back to Home
                </Link>
            </main>
            <Footer />
        </div>
    );
}
