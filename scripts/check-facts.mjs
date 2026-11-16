/**
 * Compares src/data/facts.json with the live US App Store listing (iTunes lookup API, public data).
 *
 *   node scripts/check-facts.mjs                 print a short diff
 *   node scripts/check-facts.mjs --write-rating  also rewrite facts.json rating.* when, and only when,
 *                                                the 1-decimal rating value or rating.show flips
 *
 * Exit codes: 0 = in sync (or only the rating moved), 1 = lookup failed,
 *             2 = trackName or minimumOsVersion differ (a human decision: copy depends on them).
 *
 * No dependencies. Node 18+.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const FACTS_PATH = process.env.FACTS_PATH || join(dirname(fileURLToPath(import.meta.url)), '..', 'src/data/facts.json');
const facts = JSON.parse(readFileSync(FACTS_PATH, 'utf8'));
const writeRating = process.argv.includes('--write-rating');

const country = facts.rating?.storefront || 'us';
const url = `https://itunes.apple.com/lookup?id=${facts.appId}&country=${country}`;

let app;
try {
  const res = await fetch(url, { headers: { 'User-Agent': 'faithwall-check-facts' } });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  app = (await res.json()).results?.[0];
  if (!app) throw new Error('no result for this app id/storefront');
} catch (e) {
  console.error(`check-facts: lookup failed (${e.message})`);
  process.exit(1);
}

if (!Number.isFinite(Number(app.averageUserRating))) {
  console.error('check-facts: lookup returned no averageUserRating');
  process.exit(1);
}

const liveValue = (Math.round(Number(app.averageUserRating) * 10) / 10).toFixed(1);
const liveCount = Number(app.userRatingCount) || 0;
const liveShow = Number(liveValue) >= 4.5 && liveCount >= 20;

const rows = [
  ['storeName', facts.storeName, app.trackName, 'human'],
  ['minIOS', facts.minIOS, app.minimumOsVersion, 'human'],
  ['rating.value', facts.rating.value, liveValue, 'rating'],
  ['rating.count', String(facts.rating.count), String(liveCount), 'info'],
  ['rating.show', String(facts.rating.show), String(liveShow), 'rating'],
];

let needsHuman = false;
let ratingFlipped = false;
const pad = (s, n) => String(s).padEnd(n);
console.log(`${pad('field', 14)} ${pad('facts.json', 26)} ${pad('App Store (' + country + ')', 26)} status`);
for (const [field, ours, live, kind] of rows) {
  const same = ours === live;
  let status = 'ok';
  if (!same) {
    if (kind === 'human') { status = 'DIFFERS (needs a human)'; needsHuman = true; }
    else if (kind === 'rating') { status = 'DIFFERS (rating flipped)'; ratingFlipped = true; }
    else status = 'moved (no rewrite)';
  }
  console.log(`${pad(field, 14)} ${pad(ours, 26)} ${pad(live, 26)} ${status}`);
}

if (ratingFlipped) {
  if (writeRating) {
    facts.rating.value = liveValue;
    facts.rating.count = liveCount;
    facts.rating.asOf = new Date().toISOString().slice(0, 10);
    facts.rating.show = liveShow;
    writeFileSync(FACTS_PATH, JSON.stringify(facts, null, 2) + '\n');
    console.log('\nfacts.json rating.* rewritten (value, count, asOf, show).');
  } else {
    console.log('\nRating flipped. Run with --write-rating to update facts.json rating.*.');
  }
} else if (writeRating) {
  console.log('\nRating value and show unchanged: facts.json not touched.');
}

if (needsHuman) {
  console.log('\nstoreName or minIOS differ from the live listing: copy depends on them, so a human decides.');
  process.exit(2);
}
