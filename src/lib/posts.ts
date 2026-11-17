import postsRegistry from '../data/blogPosts.json';
import pillarsData from '../data/pillars.json';
import type { BlogPostListing, PillarConfig, BlogCluster } from '../types/blog';

export { preloadPost, usePost } from './postLoader';

export const allListings: BlogPostListing[] = (postsRegistry as BlogPostListing[])
  .filter((p) => p.isPublished !== false);

export function getListing(slug: string): BlogPostListing | null {
  return allListings.find((p) => p.slug === slug) ?? null;
}

// Related posts: the next `limit` posts after this one in the cluster's stable
// (registry) order, wrapping around. Every post then gets about `limit` related
// links in, instead of the first three posts of a cluster collecting all of them.
export function getRelated(slug: string, cluster: BlogCluster, limit = 3): BlogPostListing[] {
  const inCluster = allListings.filter((p) => p.cluster === cluster);
  const idx = inCluster.findIndex((p) => p.slug === slug);
  if (idx === -1) return inCluster.slice(0, limit);
  const others = inCluster.length - 1;
  const count = Math.min(limit, others);
  const out: BlogPostListing[] = [];
  for (let i = 1; i <= count; i++) out.push(inCluster[(idx + i) % inCluster.length]);
  return out;
}

export function getPillar(slug: string): PillarConfig | null {
  const data = (pillarsData as Record<string, PillarConfig>)[slug];
  return data ?? null;
}

export function getPillarFeatured(slug: string): BlogPostListing[] {
  const pillar = getPillar(slug);
  if (!pillar) return [];
  const featured = pillar.featured
    .map((s) => allListings.find((p) => p.slug === s))
    .filter((p): p is BlogPostListing => Boolean(p));
  if (featured.length >= 6) return featured.slice(0, 6);
  const extras = allListings
    .filter((p) => p.cluster === slug && !pillar.featured.includes(p.slug))
    .slice(0, 6 - featured.length);
  return [...featured, ...extras];
}

export function getPillarAll(slug: string): BlogPostListing[] {
  return allListings.filter((p) => p.cluster === slug);
}

/** Short topic names: chips, cluster headers, breadcrumb, topic chip and card labels. */
export const CLUSTER_LABEL: Record<BlogCluster, string> = {
  'daily-scripture-lock-screen': 'Daily Scripture',
  'prayer-life-iphone': 'Prayer Life',
  'faith-based-productivity': 'Productivity',
  'bible-study-tools-ios': 'Bible Study',
  'christian-app-comparisons': 'App Comparisons',
};

export function clusterLabel(cluster: string): string {
  return (CLUSTER_LABEL as Record<string, string>)[cluster] ?? cluster;
}

/** Previous and next post in the same topic, in listing order, wrapping around (like getRelated). */
export function getPrevNext(
  slug: string,
  cluster: BlogCluster,
): { prev: BlogPostListing | null; next: BlogPostListing | null } {
  const inCluster = allListings.filter((p) => p.cluster === cluster);
  const idx = inCluster.findIndex((p) => p.slug === slug);
  if (idx === -1 || inCluster.length < 2) return { prev: null, next: null };
  const prev = inCluster[(idx - 1 + inCluster.length) % inCluster.length];
  const next = inCluster[(idx + 1) % inCluster.length];
  // Two posts in a topic: prev and next are the same post, so show it once.
  return { prev: prev.slug === next.slug ? null : prev, next };
}

export function allSlugs(): string[] {
  return allListings.map((p) => p.slug);
}

export const PILLAR_SLUGS: BlogCluster[] = [
  'daily-scripture-lock-screen',
  'prayer-life-iphone',
  'faith-based-productivity',
  'bible-study-tools-ios',
  'christian-app-comparisons',
];
