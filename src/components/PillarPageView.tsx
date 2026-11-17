import { Link } from 'react-router-dom';
import BlogRenderer from './BlogRenderer';
import BlogCard from './BlogCard';
import Breadcrumbs from './Breadcrumbs';
import PillarHeaderVisual from './visual-pages/PillarHeaderScene';
import PillarClusterMap from './visual-pages/PillarClusterMap';
import type { PillarConfig, BlogPostListing, BlogCluster } from '../types/blog';

interface Props {
  pillar: PillarConfig;
  featured: BlogPostListing[];
  allPosts?: BlogPostListing[];
}

function formatDate(iso: string): string {
  if (!iso) return '';
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

export default function PillarPageView({ pillar, featured, allPosts = [] }: Props) {
  const updated = pillar.dateModified || pillar.datePublished;
  return (
    <div className="container-main !overflow-clip pt-[76px] pb-20 md:pt-[104px]">
      <div className="post-layout">
        <div className="post-crumbs">
          <Breadcrumbs
            crumbs={[
              { label: 'Home', to: '/' },
              { label: 'Blog', to: '/blog' },
              { label: pillar.title },
            ]}
          />
        </div>

        <header className="post-head">
          <p className="mb-3 text-[13px] font-semibold uppercase tracking-widest text-brand">Pillar Guide</p>
          <h1 className="post-h1 text-balance font-extrabold text-white">{pillar.title}</h1>
          <p className="post-dek">{pillar.intro}</p>
          {updated && (
            <p className="post-byline">
              Last updated {formatDate(updated)} · By Karol Billik
            </p>
          )}
        </header>

        <PillarHeaderVisual cluster={pillar.slug as BlogCluster} />

        <BlogRenderer sections={pillar.sections} slug={pillar.slug} title={pillar.title} pageType="pillar" inlineContents />
      </div>

      <PillarClusterMap cluster={pillar.slug as BlogCluster} posts={allPosts} />

      {featured.length > 0 && (
        <div className="max-w-6xl mx-auto mt-20">
          <h2 className="text-2xl md:text-3xl font-black text-white mb-6">Featured articles in this guide</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featured.map((p) => (
              <BlogCard key={p.slug} post={p} />
            ))}
          </div>
        </div>
      )}

      {allPosts.length > 0 && (
        <div className="max-w-3xl mx-auto mt-16">
          <h2 className="text-2xl md:text-3xl font-black text-white mb-6">All {pillar.title} guides</h2>
          <ul className="divide-y divide-white/10 border-t border-b border-white/10">
            {allPosts.map((p) => (
              <li key={p.slug}>
                <Link
                  to={`/blog/${p.slug}`}
                  className="block py-3 text-white/80 hover:text-brand transition-colors"
                >
                  {p.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
