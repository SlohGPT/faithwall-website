import facts from '../data/facts.json';

export const APP_STORE_BASE = facts.storeUrl;

// Apple provider token for App Store campaign links (App Store Connect -> App Analytics -> Campaigns).
export const APPLE_PROVIDER_TOKEN = facts.providerToken;

/** Apple's campaign token limit. Apple shows a campaign only with 5+ first-time downloads, so tokens stay coarse. */
const MAX_CT_LENGTH = 30;

/**
 * Short App Store link for the desktop handoff (QR code and "Copy link"). Apple answers it with a 301 to the
 * US listing and keeps pt and ct. The same URL is encoded in public/qr/web-handoff.svg.
 */
export const HANDOFF_URL = `https://apps.apple.com/app/id${facts.appId}?pt=${facts.providerToken}&ct=web-handoff&mt=8`;

/**
 * App Store URL tagged with a campaign token so installs can be attributed per placement.
 * Pure and deterministic (safe for SSR). Returns the plain base URL while the provider token is empty.
 * A token longer than 30 characters throws while building or developing (so it is caught before shipping)
 * and is cut to 30 in the browser.
 */
export function appStoreUrl(campaign: string): string {
  if (!APPLE_PROVIDER_TOKEN) return APP_STORE_BASE;
  const clean = campaign
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+/, '');
  let ct = clean.replace(/-+$/, '');
  if (ct.length > MAX_CT_LENGTH) {
    if (import.meta.env.SSR || import.meta.env.DEV) {
      throw new Error(`App Store campaign token "${ct}" is longer than ${MAX_CT_LENGTH} characters`);
    }
    ct = ct.slice(0, MAX_CT_LENGTH).replace(/-+$/, '');
  }
  return `${APP_STORE_BASE}?pt=${APPLE_PROVIDER_TOKEN}&ct=${ct}&mt=8`;
}
