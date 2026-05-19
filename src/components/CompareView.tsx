import { Helmet } from 'react-helmet-async';
import { Calendar, Zap, Check, X as XIcon } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Navigation from './Navigation';
import Footer from './Footer';
import Breadcrumbs from './Breadcrumbs';
import AppStoreButton from './AppStoreButton';

export interface CompareRow {
  feature: string;
  faithwall: string;
  competitor: string;
}

export interface CompareConfig {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  datePublished: string;
  dateModified: string;
  quickAnswer: string;
  comparisonRows: CompareRow[];
  whenToChooseUs: string;
  whenToChooseThem: string;
  useBoth: string;
  competitorName: string;
  competitorTagline: string;
  competitorIcon: string;
  ctaTitle: string;
  ctaDescription: string;
}

const APP_STORE_URL = 'https://apps.apple.com/us/app/lock-screen-bible-verse/id6756815070';

function formatDate(iso: string): string {
  if (!iso) return '';
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

function Inline({ text }: { text: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        strong: ({ children }) => <strong className="font-bold text-white">{children}</strong>,
        p: ({ children }) => <p className="text-white/85 leading-relaxed">{children}</p>,
      }}
    >
      {text}
    </ReactMarkdown>
  );
}

export default function CompareView({ config }: { config: CompareConfig }) {
  const url = `https://faithwall.app/${config.slug}`;
  const docTitle = `${config.metaTitle} | FaithWall`;

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://faithwall.app/' },
      { '@type': 'ListItem', position: 2, name: 'Comparisons', item: 'https://faithwall.app/christian-app-comparisons' },
      { '@type': 'ListItem', position: 3, name: config.title, item: url },
    ],
  };

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: config.title,
    description: config.metaDescription,
    datePublished: config.datePublished,
    dateModified: config.dateModified || config.datePublished,
    author: {
      '@type': 'Person',
      name: 'Karol Billik',
      url: 'https://faithwall.app/about/karol-billik',
      jobTitle: 'Founder',
      worksFor: { '@type': 'Organization', name: 'FaithWall' },
    },
    publisher: {
      '@type': 'Organization',
      name: 'FaithWall',
      logo: { '@type': 'ImageObject', url: 'https://faithwall.app/icon-app-512.png' },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
  };

  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: config.title,
    itemListElement: config.comparisonRows.map((row, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: row.feature,
    })),
  };

  return (
    <div className="min-h-screen bg-surface">
      <Helmet>
        <title>{docTitle}</title>
        <meta name="description" content={config.metaDescription} />
        <link rel="canonical" href={url} />
        <meta property="og:type" content="article" />
        <meta property="og:title" content={config.metaTitle} />
        <meta property="og:description" content={config.metaDescription} />
        <meta property="og:url" content={url} />
        <meta property="og:image" content="https://faithwall.app/og-image.png" />
        <meta name="twitter:title" content={config.metaTitle} />
        <meta name="twitter:description" content={config.metaDescription} />
        <meta name="twitter:image" content="https://faithwall.app/og-image.png" />
        <meta property="article:published_time" content={config.datePublished} />
        <meta property="article:modified_time" content={config.dateModified || config.datePublished} />
        <meta property="article:author" content="Karol Billik" />
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(articleSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(itemListSchema)}</script>
      </Helmet>
      <Navigation />
      <article className="container-main pt-28 md:pt-32 pb-20">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <Breadcrumbs
              crumbs={[
                { label: 'Home', to: '/' },
                { label: 'Comparisons', to: '/christian-app-comparisons' },
                { label: config.title },
              ]}
            />
          </div>

          <header className="mb-10">
            <p className="text-brand text-sm font-semibold uppercase tracking-widest mb-3">Comparison</p>
            <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-tight">
              {config.title}
            </h1>
            <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-white/50">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" /> Last updated {formatDate(config.dateModified || config.datePublished)}
              </span>
              <span>By Karol Billik</span>
            </div>
          </header>

          {/* Quick Answer */}
          <div className="my-8 p-6 rounded-2xl bg-brand/10 border border-brand/30 flex gap-4">
            <Zap className="w-6 h-6 text-brand shrink-0 mt-1" />
            <div className="flex-1">
              <p className="font-bold text-white text-lg mb-2">Quick Answer</p>
              <div className="text-white/85 leading-relaxed">
                <Inline text={config.quickAnswer} />
              </div>
            </div>
          </div>

          {/* Logo header */}
          <div className="my-10 grid grid-cols-2 gap-4">
            <div className="rounded-2xl p-5 bg-surface-card border border-brand/30 text-center">
              <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br from-brand to-brand-dark flex items-center justify-center text-white font-bold">
                F
              </div>
              <p className="font-bold text-white">FaithWall</p>
              <p className="text-xs text-white/50 mt-1">Lock-Screen Scripture</p>
            </div>
            <div className="rounded-2xl p-5 bg-surface-card border border-surface-border text-center">
              <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-surface-elevated flex items-center justify-center text-white/80 font-bold text-xl">
                {config.competitorIcon}
              </div>
              <p className="font-bold text-white">{config.competitorName}</p>
              <p className="text-xs text-white/50 mt-1">{config.competitorTagline}</p>
            </div>
          </div>

          {/* Comparison table */}
          <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight mt-12 mb-5">At a glance</h2>
          <div className="overflow-x-auto rounded-2xl border border-surface-border">
            <table className="w-full text-left text-sm">
              <thead className="bg-surface-elevated">
                <tr>
                  <th className="py-3 px-4 text-white/70 font-semibold">Feature</th>
                  <th className="py-3 px-4 text-white font-semibold">FaithWall</th>
                  <th className="py-3 px-4 text-white font-semibold">{config.competitorName}</th>
                </tr>
              </thead>
              <tbody>
                {config.comparisonRows.map((row, i) => (
                  <tr key={i} className="border-t border-surface-border">
                    <td className="py-3 px-4 text-white/80 font-medium align-top">{row.feature}</td>
                    <td className="py-3 px-4 text-white/85 align-top">
                      <RowCell value={row.faithwall} />
                    </td>
                    <td className="py-3 px-4 text-white/70 align-top">
                      <RowCell value={row.competitor} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight mt-12 mb-4">
            When to choose FaithWall
          </h2>
          <div className="text-white/85 leading-relaxed text-lg">
            <Inline text={config.whenToChooseUs} />
          </div>

          <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight mt-10 mb-4">
            When to choose {config.competitorName}
          </h2>
          <div className="text-white/85 leading-relaxed text-lg">
            <Inline text={config.whenToChooseThem} />
          </div>

          <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight mt-10 mb-4">
            Or use both
          </h2>
          <div className="text-white/85 leading-relaxed text-lg">
            <Inline text={config.useBoth} />
          </div>

          {/* CTA */}
          <div className="my-10 p-8 rounded-3xl bg-gradient-to-br from-brand/20 to-brand-dark/10 border border-brand/30 text-center">
            <h3 className="text-2xl md:text-3xl font-black text-white mb-3">{config.ctaTitle}</h3>
            <p className="text-white/80 mb-6 max-w-xl mx-auto">{config.ctaDescription}</p>
            <div className="flex justify-center">
              <AppStoreButton href={APP_STORE_URL} theme="light" />
            </div>
          </div>
        </div>
      </article>
      <Footer />
    </div>
  );
}

function RowCell({ value }: { value: string }) {
  if (value === 'Yes') {
    return (
      <span className="inline-flex items-center gap-1.5 text-emerald-400">
        <Check className="w-4 h-4" /> Yes
      </span>
    );
  }
  if (value === 'No') {
    return (
      <span className="inline-flex items-center gap-1.5 text-white/40">
        <XIcon className="w-4 h-4" /> No
      </span>
    );
  }
  return <span>{value}</span>;
}
