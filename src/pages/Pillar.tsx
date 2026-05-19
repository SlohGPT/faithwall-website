import { Helmet } from 'react-helmet-async';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import PillarPageView from '../components/PillarPageView';
import NotFound from './NotFound';
import { getPillar, getPillarFeatured } from '../lib/posts';
import type { BlogCluster, BlogSection } from '../types/blog';

export default function Pillar({ cluster }: { cluster: BlogCluster }) {
  const pillar = getPillar(cluster);
  if (!pillar) return <NotFound />;

  const featured = getPillarFeatured(cluster);
  const url = `https://faithwall.app/${cluster}`;

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://faithwall.app/' },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://faithwall.app/blog' },
      { '@type': 'ListItem', position: 3, name: pillar.title, item: url },
    ],
  };

  const stepSection = pillar.sections.find(
    (s): s is Extract<BlogSection, { type: 'steps' }> => s.type === 'steps'
  );
  const howToSchema = stepSection
    ? {
        '@context': 'https://schema.org',
        '@type': 'HowTo',
        name: pillar.title,
        description: pillar.metaDescription,
        step: stepSection.items.map((text, i) => ({
          '@type': 'HowToStep',
          position: i + 1,
          name: `Step ${i + 1}`,
          text: text.replace(/\*\*/g, ''),
        })),
      }
    : null;

  return (
    <div className="min-h-screen bg-surface">
      <Helmet>
        <title>{pillar.metaTitle} | FaithWall</title>
        <meta name="description" content={pillar.metaDescription} />
        <link rel="canonical" href={url} />
        <meta property="og:title" content={pillar.metaTitle} />
        <meta property="og:description" content={pillar.metaDescription} />
        <meta property="og:url" content={url} />
        <meta property="og:type" content="article" />
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
        {howToSchema && (
          <script type="application/ld+json">{JSON.stringify(howToSchema)}</script>
        )}
      </Helmet>
      <Navigation />
      <PillarPageView pillar={pillar} featured={featured} />
      <Footer />
    </div>
  );
}
