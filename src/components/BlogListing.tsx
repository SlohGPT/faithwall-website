import { Link } from 'react-router-dom';
import BlogCard from './BlogCard';
import { useStaticBars } from '../lib/useVisualZoom';
import { PILLAR_SLUGS, clusterLabel } from '../lib/posts';
import type { BlogPostListing, BlogCluster } from '../types/blog';

/** Cards shown per topic; a topic with more than MORE_AFTER posts puts the rest in a native details list of text rows. */
const CARDS_PER_TOPIC = 6;
const MORE_AFTER = 8;

function groupByCluster(posts: BlogPostListing[]): { cluster: BlogCluster; posts: BlogPostListing[] }[] {
  const order: BlogCluster[] = [...PILLAR_SLUGS];
  for (const p of posts) if (!order.includes(p.cluster)) order.push(p.cluster);
  return order
    .map((cluster) => ({ cluster, posts: posts.filter((p) => p.cluster === cluster) }))
    .filter((g) => g.posts.length > 0);
}

/**
 * Sticky topic chips (plain anchors to the sections below, no JS filter) followed by one section per topic.
 * The chip row stays in the document flow while the header is not fixed (pinch zoom, short viewports).
 */
export default function BlogListing({ posts }: { posts: BlogPostListing[] }) {
  const barStatic = useStaticBars();
  if (posts.length === 0) {
    return (
      <div className="py-20 text-center text-white/65">
        <p className="text-lg">New posts coming soon.</p>
      </div>
    );
  }
  const groups = groupByCluster(posts);
  let cardIndex = 0;
  return (
    <>
      <nav
        aria-label="Blog topics"
        className={`blog-chips ${barStatic ? 'is-static' : ''} z-30 -mx-4 border-b border-white/10 bg-surface px-4 sm:-mx-6 sm:px-6 lg:-mx-12 lg:px-12`}
      >
        <ul className="blog-chips-row flex h-12 items-center gap-2 overflow-x-auto">
          <li className="shrink-0">
            <a href="#all-posts" className="blog-chip">
              All <span className="blog-chip-count">{posts.length}</span>
            </a>
          </li>
          {groups.map((g) => (
            <li key={g.cluster} className="shrink-0">
              <a href={`#${g.cluster}`} className="blog-chip">
                {clusterLabel(g.cluster)} <span className="blog-chip-count">{g.posts.length}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div id="all-posts" className="blog-topics">
        {groups.map((g) => {
          const label = clusterLabel(g.cluster);
          const cards = g.posts.length > MORE_AFTER ? g.posts.slice(0, CARDS_PER_TOPIC) : g.posts;
          const rest = g.posts.length > MORE_AFTER ? g.posts.slice(CARDS_PER_TOPIC) : [];
          return (
            <section key={g.cluster} className="blog-topic" aria-labelledby={g.cluster}>
              <div className="mb-2 flex items-center justify-between gap-x-4 md:mb-4">
                <h2 id={g.cluster} className="blog-topic-h text-[22px] font-bold tracking-tight text-white md:text-[28px]">
                  {label} <span className="font-medium text-white/65">{g.posts.length}</span>
                </h2>
                <Link
                  to={`/${g.cluster}`}
                  className="blog-link inline-flex min-h-[44px] items-center text-[15px] font-semibold text-brand-light underline-offset-[3px] hover:text-white hover:underline"
                >
                  All {g.posts.length}
                  <span className="sr-only md:not-sr-only md:ml-1"> in the {label} guide</span>
                  <span aria-hidden="true" className="ml-1">→</span>
                </Link>
              </div>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-6 min-[1180px]:grid-cols-3">
                {cards.map((post) => (
                  <BlogCard key={post.slug} post={post} index={cardIndex++} />
                ))}
              </div>
              {rest.length > 0 && (
                <details className="blog-more mt-4 rounded-2xl border border-white/10">
                  <summary className="blog-more-summary flex min-h-[48px] cursor-pointer list-none items-center justify-between gap-3 px-4 text-[15px] font-semibold text-white [&::-webkit-details-marker]:hidden">
                    <span>Show {rest.length} more</span>
                    <span aria-hidden="true" className="blog-more-chev text-white/65">+</span>
                  </summary>
                  <ul className="border-t border-white/10 px-4 py-1">
                    {rest.map((post) => (
                      <li key={post.slug} className="border-b border-white/5 last:border-b-0">
                        <Link
                          to={`/blog/${post.slug}`}
                          className="blog-link flex min-h-[44px] items-center justify-between gap-4 py-2 text-[16px] leading-snug text-white/85 hover:text-white"
                        >
                          <span>{post.title}</span>
                          <span className="shrink-0 text-[13px] text-white/65">{post.readTime}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </details>
              )}
            </section>
          );
        })}
      </div>
    </>
  );
}
