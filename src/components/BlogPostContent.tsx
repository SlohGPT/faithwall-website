import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import BlogRenderer from './BlogRenderer';
import AuthorBio from './AuthorBio';
import BlogCard from './BlogCard';
import CoverPicture from './CoverPicture';
import PostContents from './PostContents';
import ReadingProgress from './ReadingProgress';
import { HERO_WIDTHS, HERO_SIZES } from '../lib/covers';
import Breadcrumbs from './Breadcrumbs';
import { clusterLabel, getPillar, getPrevNext } from '../lib/posts';
import { contentsItems } from '../lib/postHeadings';
import type { BlogPost, BlogPostListing } from '../types/blog';

interface Props {
  post: BlogPost;
  slug: string;
  related: BlogPostListing[];
}

/** Posts of this many minutes or more get the reading-progress bar. */
const PROGRESS_FROM_MIN = 8;

export default function BlogPostContent({ post, slug, related }: Props) {
  const { meta, sections } = post;
  const label = clusterLabel(meta.cluster);
  const items = contentsItems(sections);
  const pillar = getPillar(meta.cluster);
  const { prev, next } = getPrevNext(slug, meta.cluster);
  const updated =
    meta.dateModified && meta.dateModified.slice(0, 10) !== meta.datePublished.slice(0, 10)
      ? new Date(meta.dateModified).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
      : null;

  return (
    <article className="post-page container-main !overflow-clip pt-[76px] pb-[calc(80px+env(safe-area-inset-bottom,0px))] md:pt-[104px] md:pb-20">
      {parseInt(meta.readTime, 10) >= PROGRESS_FROM_MIN && <ReadingProgress targetId="post-body" />}

      <div className={`post-layout ${items.length > 0 ? 'post-layout--rail' : ''}`}>
        <header className="post-head">
          <div className="post-crumbs">
            <Breadcrumbs
              crumbs={[
                { label: 'Home', to: '/' },
                { label: 'Blog', to: '/blog' },
                { label, to: `/${meta.cluster}` },
                { label: meta.title },
              ]}
            />
          </div>
          <Link to={`/${meta.cluster}`} className="post-chip">
            {label}
          </Link>
          <h1 className="post-h1 text-balance font-extrabold text-white">{meta.title}</h1>
          <p className="post-dek line-clamp-2">{meta.description}</p>
          <p className="post-byline">
            By{' '}
            <Link to="/about/karol-billik" className="post-byline-link">
              Karol Billik
            </Link>{' '}
            · {meta.date}
            {updated && <> · Updated {updated}</>} · {meta.readTime}
          </p>
        </header>

        {meta.image && (
          <figure className="post-hero">
            <div className="overflow-hidden rounded-2xl">
              <CoverPicture
                src={meta.image}
                alt={meta.imageAlt ?? meta.title}
                widths={HERO_WIDTHS}
                sizes={HERO_SIZES}
                className="aspect-[3/2] w-full object-cover md:aspect-[16/9]"
                loading="eager"
                priority
              />
            </div>
            {meta.imageAttribution && (
              <figcaption className="mt-2 text-right text-sm text-white/65">
                Photo by{' '}
                <a
                  href={meta.imageAttribution.photographerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-white"
                >
                  {meta.imageAttribution.photographer}
                </a>{' '}
                on{' '}
                <a
                  href={meta.imageAttribution.unsplashUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-white"
                >
                  Unsplash
                </a>
              </figcaption>
            )}
          </figure>
        )}

        {items.length > 0 && (
          <nav aria-label="Table of contents" className="post-toc">
            <PostContents items={items} />
          </nav>
        )}

        <BlogRenderer sections={sections} slug={slug} title={meta.title} pageType="blog" />

        <div className="post-end">
          <AuthorBio />

          {pillar && (
            <p className="post-pillar">
              Part of the{' '}
              <Link to={`/${meta.cluster}`} className="post-pillar-link">
                {pillar.title}
              </Link>
            </p>
          )}

          {(prev || next) && (
            <nav aria-label="More in this topic" className="post-prevnext">
              {prev && (
                <Link to={`/blog/${prev.slug}`} rel="prev" className="post-prevnext-link">
                  <span className="post-prevnext-dir">Previous in {label}</span>
                  <span className="post-prevnext-title">{prev.title}</span>
                </Link>
              )}
              {next && (
                <Link to={`/blog/${next.slug}`} rel="next" className="post-prevnext-link">
                  <span className="post-prevnext-dir">Next in {label}</span>
                  <span className="post-prevnext-title">{next.title}</span>
                </Link>
              )}
            </nav>
          )}

          <div className="mt-8">
            <Link
              to="/blog"
              className="inline-flex min-h-[44px] items-center gap-2 text-sm font-semibold text-white/75 transition-colors hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" /> Back to all posts
            </Link>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section aria-labelledby="keep-reading" className="mx-auto mt-14 max-w-6xl md:mt-20">
          <h2 id="keep-reading" className="mb-5 text-2xl font-bold tracking-tight text-white md:mb-6 md:text-3xl">
            Keep reading
          </h2>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3 md:gap-6">
            {related.slice(0, 3).map((p) => (
              <BlogCard key={p.slug} post={p} showExcerpt={false} />
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
