import { Helmet } from 'react-helmet-async';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import BlogListing from '../components/BlogListing';
import Breadcrumbs from '../components/Breadcrumbs';
import { allListings } from '../lib/posts';

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://faithwall.app/' },
    { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://faithwall.app/blog' },
  ],
};

export default function Blog() {
  return (
    <div className="min-h-screen bg-surface">
      <Helmet>
        <title>FaithWall Blog — iPhone Scripture, Prayer, and Faith</title>
        <meta
          name="description"
          content="Practical guides on putting Scripture on your iPhone lock screen, building a prayer life, and using your phone to grow in faith."
        />
        <link rel="canonical" href="https://faithwall.app/blog" />
        <meta property="og:title" content="FaithWall Blog — iPhone Scripture, Prayer, and Faith" />
        <meta
          property="og:description"
          content="Practical guides on putting Scripture on your iPhone lock screen, building a prayer life, and using your phone to grow in faith."
        />
        <meta property="og:url" content="https://faithwall.app/blog" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://faithwall.app/og-image.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:image" content="https://faithwall.app/og-image.png" />
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
      </Helmet>
      <Navigation />
      <main className="blog-page container-main !overflow-clip pt-[80px] pb-20 md:pt-[108px]">
        <div className="mb-3 md:mb-4">
          <Breadcrumbs crumbs={[{ label: 'Home', to: '/' }, { label: 'Blog' }]} />
        </div>
        <header className="mb-4 max-w-3xl md:mb-6">
          <p className="mb-1.5 text-[13px] font-semibold uppercase tracking-widest text-brand md:text-sm">The FaithWall Blog</p>
          <h1 className="text-balance text-[32px] font-extrabold leading-[1.15] tracking-tight text-white md:text-[44px]">
            Faith, prayer, and Scripture — on your iPhone.
          </h1>
          <p className="mt-2 line-clamp-2 text-[18px] leading-snug text-white/75 md:mt-3 md:line-clamp-none md:leading-relaxed">
            Practical guides for using your phone as a tool for spiritual growth instead of a thief of it. New posts often.
          </p>
        </header>

        <BlogListing posts={allListings} />
      </main>
      <Footer />
    </div>
  );
}
