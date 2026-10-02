export const APP_STORE_BASE = 'https://apps.apple.com/us/app/lock-screen-bible-verse/id6756815070';

// Apple provider token for App Store campaign links.
// Karol fills this from App Store Connect -> App Analytics -> Campaigns link generator.
// While empty, every link stays the plain base URL (no tracking parameters).
export const APPLE_PROVIDER_TOKEN = '';

/**
 * App Store URL tagged with a campaign token so installs can be attributed per page/placement.
 * Pure and deterministic (safe for SSR). Returns the plain base URL while the provider token is empty.
 */
export function appStoreUrl(campaign: string): string {
  if (!APPLE_PROVIDER_TOKEN) return APP_STORE_BASE;
  const ct = campaign
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+/, '')
    .slice(0, 40)
    .replace(/-+$/, '');
  return `${APP_STORE_BASE}?pt=${APPLE_PROVIDER_TOKEN}&ct=${ct}&mt=8`;
}
