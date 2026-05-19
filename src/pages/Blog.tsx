import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import BlogListing from '../components/BlogListing';
import Breadcrumbs from '../components/Breadcrumbs';
import { allListings, PILLAR_SLUGS, getPillar } from '../lib/posts';

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
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
      </Helmet>
      <Navigation />
      <main className="container-main pt-28 md:pt-32 pb-20">
        <div className="mb-8">
          <Breadcrumbs crumbs={[{ label: 'Home', to: '/' }, { label: 'Blog' }]} />
        </div>
        <header className="mb-12 max-w-3xl">
          <p className="text-brand text-sm font-semibold uppercase tracking-widest mb-3">The FaithWall Blog</p>
          <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-tight">
            Faith, prayer, and Scripture — on your iPhone.
          </h1>
          <p className="mt-5 text-lg text-white/70 leading-relaxed">
            Practical guides for using your phone as a tool for spiritual growth instead of a thief of it. New posts often.
          </p>
        </header>

        <section className="mb-14">
          <h2 className="text-2xl font-bold text-white mb-5">Explore by topic</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {PILLAR_SLUGS.map((s) => {
              const p = getPillar(s);
              if (!p) return null;
              return (
                <Link
                  key={s}
                  to={`/${s}`}
                  className="group p-5 rounded-2xl bg-surface-card border border-surface-border hover:border-brand/40 transition-colors"
                >
                  <p className="font-bold text-white group-hover:text-brand transition-colors">{p.title}</p>
                  <p className="mt-1 text-sm text-white/60 line-clamp-2">{p.description}</p>
                </Link>
              );
            })}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-5">Latest posts</h2>
          <BlogListing posts={allListings} />
        </section>
      </main>
      <Footer />
    </div>
  );
}
