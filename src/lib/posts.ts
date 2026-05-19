import postsRegistry from '../data/blogPosts.json';
import pillarsData from '../data/pillars.json';
import type { BlogPost, BlogPostListing, PillarConfig, BlogCluster } from '../types/blog';

const postModules = import.meta.glob<{ default: BlogPost }>('../data/posts/*.json', { eager: true });

const postsBySlug: Record<string, BlogPost> = {};
for (const [path, mod] of Object.entries(postModules)) {
  const slug = path.replace('../data/posts/', '').replace('.json', '');
  postsBySlug[slug] = (mod as { default: BlogPost }).default ?? (mod as unknown as BlogPost);
}

export const allListings: BlogPostListing[] = (postsRegistry as BlogPostListing[])
  .filter((p) => p.isPublished !== false);

export function getPost(slug: string): BlogPost | null {
  return postsBySlug[slug] ?? null;
}

export function getListing(slug: string): BlogPostListing | null {
  return allListings.find((p) => p.slug === slug) ?? null;
}

export function getRelated(slug: string, cluster: BlogCluster, limit = 3): BlogPostListing[] {
  return allListings
    .filter((p) => p.slug !== slug && p.cluster === cluster)
    .slice(0, limit);
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
