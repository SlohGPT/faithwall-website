import type { BlogPost } from '../types/blog';

// Post bodies are one lazy chunk per post (about 5-25 KB) instead of one 480 KB chunk shared by /blog,
// every post and every pillar. Listings (metadata only) stay eager from blogPosts.json.
const postLoaders = import.meta.glob<{ default: BlogPost }>('../data/posts/*.json');

const postCache = new Map<string, BlogPost | null>();
const postPending = new Map<string, Promise<void>>();

/** Starts (once) loading a post body. Safe to call from anywhere, for example before hydration. */
export function preloadPost(slug: string): Promise<void> {
  const hit = postPending.get(slug);
  if (hit) return hit;
  const load = postLoaders[`../data/posts/${slug}.json`];
  const p: Promise<void> = load
    ? load().then(
        (mod) => {
          postCache.set(slug, (mod as { default?: BlogPost }).default ?? (mod as unknown as BlogPost));
        },
        () => {
          postCache.set(slug, null);
        },
      )
    : Promise.resolve().then(() => {
        postCache.set(slug, null);
      });
  postPending.set(slug, p);
  return p;
}

/**
 * Suspense-compatible post read: returns the post, or null for an unknown slug, and throws the loader
 * promise while the chunk is loading (the nearest <Suspense> shows its fallback, the server render waits).
 */
export function usePost(slug: string): BlogPost | null {
  if (postCache.has(slug)) return postCache.get(slug) ?? null;
  throw preloadPost(slug);
}
