import BlogRenderer from './BlogRenderer';
import BlogCard from './BlogCard';
import Breadcrumbs from './Breadcrumbs';
import type { PillarConfig, BlogPostListing } from '../types/blog';

interface Props {
  pillar: PillarConfig;
  featured: BlogPostListing[];
}

export default function PillarPageView({ pillar, featured }: Props) {
  return (
    <div className="container-main pt-28 md:pt-32 pb-20">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <Breadcrumbs
            crumbs={[
              { label: 'Home', to: '/' },
              { label: 'Blog', to: '/blog' },
              { label: pillar.title },
            ]}
          />
        </div>

        <header className="mb-10">
          <p className="text-brand text-sm font-semibold uppercase tracking-widest mb-3">Pillar Guide</p>
          <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-tight">
            {pillar.title}
          </h1>
          <p className="mt-5 text-lg text-white/70 leading-relaxed">{pillar.intro}</p>
        </header>

        <BlogRenderer sections={pillar.sections} />
      </div>

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
    </div>
  );
}
