import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import ScrollManager from './components/ScrollManager';

// Long legal pages and the author page are about 30 KB gzip together and almost nobody lands on them first:
// keep them out of the entry chunk every page pays for.
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const TermsOfUse = lazy(() => import('./pages/TermsOfUse'));
const EULA = lazy(() => import('./pages/EULA'));
const AuthorKarol = lazy(() => import('./pages/AuthorKarol'));
const Blog = lazy(() => import('./pages/Blog'));
const BlogPost = lazy(() => import('./pages/BlogPost'));
const Pillar = lazy(() => import('./pages/Pillar'));
const Compare = lazy(() => import('./pages/Compare'));
const RandomVerse = lazy(() => import('./pages/RandomVerse'));
const WallpaperMaker = lazy(() => import('./pages/WallpaperMaker'));

const blogFallback = <div className="min-h-screen bg-surface" />;

export default function App() {
  return (
    <>
      <ScrollManager />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/privacy-policy"
          element={
            <Suspense fallback={blogFallback}>
              <PrivacyPolicy />
            </Suspense>
          }
        />
        <Route
          path="/terms-of-use"
          element={
            <Suspense fallback={blogFallback}>
              <TermsOfUse />
            </Suspense>
          }
        />
        <Route
          path="/eula"
          element={
            <Suspense fallback={blogFallback}>
              <EULA />
            </Suspense>
          }
        />
        <Route
          path="/about/karol-billik"
          element={
            <Suspense fallback={blogFallback}>
              <AuthorKarol />
            </Suspense>
          }
        />
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
        <Route
          path="/faithwall-vs-youversion"
          element={
            <Suspense fallback={blogFallback}>
              <Compare slug="faithwall-vs-youversion" />
            </Suspense>
          }
        />
        <Route
          path="/faithwall-vs-hallow"
          element={
            <Suspense fallback={blogFallback}>
              <Compare slug="faithwall-vs-hallow" />
            </Suspense>
          }
        />
        <Route
          path="/best-bible-verse-lock-screen-apps"
          element={
            <Suspense fallback={blogFallback}>
              <Compare slug="best-bible-verse-lock-screen-apps" />
            </Suspense>
          }
        />
        <Route
          path="/random-bible-verse"
          element={
            <Suspense fallback={blogFallback}>
              <RandomVerse />
            </Suspense>
          }
        />
        <Route
          path="/bible-verse-wallpaper-maker"
          element={
            <Suspense fallback={blogFallback}>
              <WallpaperMaker />
            </Suspense>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}
