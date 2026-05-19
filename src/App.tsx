import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfUse from './pages/TermsOfUse';
import EULA from './pages/EULA';
import NotFound from './pages/NotFound';

const Blog = lazy(() => import('./pages/Blog'));
const BlogPost = lazy(() => import('./pages/BlogPost'));
const Pillar = lazy(() => import('./pages/Pillar'));

const blogFallback = <div className="min-h-screen bg-surface" />;

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-of-use" element={<TermsOfUse />} />
        <Route path="/eula" element={<EULA />} />
        <Route
          path="/blog"
          element={
            <Suspense fallback={blogFallback}>
              <Blog />
            </Suspense>
          }
        />
        <Route
          path="/blog/:slug"
          element={
            <Suspense fallback={blogFallback}>
              <BlogPost />
            </Suspense>
          }
        />
        <Route
          path="/daily-scripture-lock-screen"
          element={
            <Suspense fallback={blogFallback}>
              <Pillar cluster="daily-scripture-lock-screen" />
            </Suspense>
          }
        />
        <Route
          path="/prayer-life-iphone"
          element={
            <Suspense fallback={blogFallback}>
              <Pillar cluster="prayer-life-iphone" />
            </Suspense>
          }
        />
        <Route
          path="/faith-based-productivity"
          element={
            <Suspense fallback={blogFallback}>
              <Pillar cluster="faith-based-productivity" />
            </Suspense>
          }
        />
        <Route
          path="/bible-study-tools-ios"
          element={
            <Suspense fallback={blogFallback}>
              <Pillar cluster="bible-study-tools-ios" />
            </Suspense>
          }
        />
        <Route
          path="/christian-app-comparisons"
          element={
            <Suspense fallback={blogFallback}>
              <Pillar cluster="christian-app-comparisons" />
            </Suspense>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}
