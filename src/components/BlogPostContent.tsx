import { Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock } from 'lucide-react';
import BlogRenderer from './BlogRenderer';
import AuthorBio from './AuthorBio';
import BlogCard from './BlogCard';
import Breadcrumbs from './Breadcrumbs';
import type { BlogPost, BlogPostListing } from '../types/blog';

interface Props {
  post: BlogPost;
  slug: string;
  related: BlogPostListing[];
}

export default function BlogPostContent({ post, slug: _slug, related }: Props) {
  const { meta, sections } = post;

  return (
    <article className="container-main pt-28 md:pt-32 pb-20">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <Breadcrumbs
            crumbs={[
              { label: 'Home', to: '/' },
              { label: 'Blog', to: '/blog' },
              { label: meta.title },
            ]}
          />
        </div>

        <header className="mb-10">
          <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-tight">
            {meta.title}
          </h1>
          <p className="mt-4 text-lg text-white/70 leading-relaxed">{meta.description}</p>
          <div className="mt-6 flex items-center gap-5 text-sm text-white/50">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" /> {meta.date}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" /> {meta.readTime}
            </span>
            <span>By Karol Billik</span>
          </div>
        </header>

        {meta.image && (
          <figure className="mb-10 rounded-2xl overflow-hidden">
            <img
              src={meta.image}
              alt={meta.title}
              width={1600}
              height={900}
              className="w-full aspect-[16/9] object-cover"
              loading="eager"
              decoding="async"
            />
            {meta.imageAttribution && (
              <figcaption className="mt-2 text-xs text-white/40 text-right">
                Photo by{' '}
                <a
                  href={meta.imageAttribution.photographerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-white/70"
                >
                  {meta.imageAttribution.photographer}
                </a>{' '}
                on{' '}
                <a
                  href={meta.imageAttribution.unsplashUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-white/70"
                >
                  Unsplash
                </a>
              </figcaption>
            )}
          </figure>
        )}

        <BlogRenderer sections={sections} />

        <AuthorBio />

        <div className="mt-10">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors text-sm font-semibold"
          >
            <ArrowLeft className="w-4 h-4" /> Back to all posts
          </Link>
        </div>
      </div>

      {related.length > 0 && (
        <div className="max-w-6xl mx-auto mt-20">
          <h2 className="text-2xl md:text-3xl font-black text-white mb-6">Keep reading</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {related.slice(0, 3).map((p) => (
              <BlogCard key={p.slug} post={p} />
            ))}
          </div>
        </div>
      )}
    </article>
  );
}
