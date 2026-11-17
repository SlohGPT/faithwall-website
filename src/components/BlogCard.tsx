import { Link } from 'react-router-dom';
import CoverPicture from './CoverPicture';
import { CARD_WIDTHS } from '../lib/covers';
import { clusterLabel } from '../lib/posts';
import type { BlogPostListing } from '../types/blog';

interface Props {
  post: BlogPostListing;
  /** Position on the page: the first three cards load their image eagerly, the rest lazily. */
  index?: number;
  /** Excerpt on tablet and desktop (never on phones). Related rows leave it out. */
  showExcerpt?: boolean;
}

/**
 * One post card. Phones: compact horizontal row (112 x 75 thumbnail, topic as plain text, title up to 3 lines,
 * no excerpt). Tablet and desktop: vertical card (3:2 image, title, excerpt). The whole card is one link.
 */
export default function BlogCard({ post, index = 99, showExcerpt = true }: Props) {
  return (
    <Link
      to={`/blog/${post.slug}`}
      className="blog-card group flex items-start gap-3 rounded-2xl border border-surface-border bg-surface-card p-3 transition-colors hover:border-brand/40 md:block md:overflow-hidden md:p-0"
    >
      <div className="blog-card-img h-[75px] w-28 shrink-0 overflow-hidden rounded-[10px] bg-surface-elevated md:aspect-[3/2] md:h-auto md:w-full md:rounded-none">
        <CoverPicture
          src={post.thumbnail}
          alt={post.thumbnailAlt ?? post.title}
          widths={CARD_WIDTHS}
          sizes="(min-width: 1180px) 360px, (min-width: 768px) 50vw, 112px"
          className="h-full w-full object-cover md:transition-transform md:duration-500 md:group-hover:scale-105"
          loading={index < 3 ? 'eager' : 'lazy'}
        />
      </div>
      <div className="min-w-0 flex-1 md:p-4">
        <p className="mb-1 text-[13px] font-semibold leading-snug text-brand md:mb-2 md:inline-block md:rounded-full md:bg-brand/15 md:px-2.5 md:py-0.5">
          {clusterLabel(post.cluster)}
        </p>
        <h3 className="line-clamp-3 text-[17px] font-bold leading-[1.3] text-white transition-colors group-hover:text-brand md:text-[20px] md:leading-[1.3]">
          {post.title}
        </h3>
        {showExcerpt && (
          <p className="mt-1.5 line-clamp-2 text-[15px] leading-normal text-white/70 max-md:hidden">{post.description}</p>
        )}
        <p className="mt-1.5 text-[13px] leading-snug text-white/65 md:mt-3">
          {post.readTime} · {post.date}
        </p>
      </div>
    </Link>
  );
}
