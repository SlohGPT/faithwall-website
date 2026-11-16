/**
 * Google Search Console URL Inspection for every sitemap URL (read-only).
 *
 *   node scripts/inspect-urls.mjs                    inspect every URL in public/sitemap.xml
 *   node scripts/inspect-urls.mjs <url> [url ...]    inspect only these URLs
 *   node scripts/inspect-urls.mjs --dry-run          list the URLs and output paths, call no API
 *   node scripts/inspect-urls.mjs --no-perf          skip the 93-day clicks/impressions lookup
 *
 * Writes ONLY ~/.claude/faithwall-gsc/inspect-YYYY-MM-DD.{json,csv} (never inside the repo) and prints
 * counts by coverageState. Auth: service-account key (same path as scripts/gsc-report.mjs, override with
 * GOOGLE_APPLICATION_CREDENTIALS), scope webmasters.readonly. Key material is never printed.
 * Override the property with SITE (default sc-domain:faithwall.app).
 *
 * Dependency-free: node:crypto JWT + fetch (Node 18+). Quota: 2,000 inspections/day/property.
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { createSign } from 'node:crypto';
import { homedir } from 'node:os';
import { join, dirname, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const KEY_PATH =
  process.env.GOOGLE_APPLICATION_CREDENTIALS ??
  '/Users/carly/GITHUB REPOS/karchi/scripts/service-account-key.json';
const SCOPE = 'https://www.googleapis.com/auth/webmasters.readonly';
const PROPERTY = process.env.SITE ?? 'sc-domain:faithwall.app';
const WORKERS = 6;

const args = process.argv.slice(2);
if (args.includes('--help') || args.includes('-h')) {
  console.log(readFileSync(fileURLToPath(import.meta.url), 'utf8').split('*/')[0].replace(/^\/\*\*\n?/, '').replace(/^ \* ?/gm, ''));
  process.exit(0);
}
const dryRun = args.includes('--dry-run');
const withPerf = !args.includes('--no-perf');
const explicitUrls = args.filter((a) => /^https?:\/\//.test(a));

const day = (n) => {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - n);
  return d.toISOString().slice(0, 10);
};
const today = day(0);
const outDir = join(homedir(), '.claude', 'faithwall-gsc');
const outJson = join(outDir, `inspect-${today}.json`);
const outCsv = join(outDir, `inspect-${today}.csv`);
if (resolve(outDir).startsWith(resolve(ROOT) + sep)) {
  console.error('Refusing to write inside the repo.');
  process.exit(1);
}

// ---- URLs
let entries;
if (explicitUrls.length) {
  entries = explicitUrls.map((loc) => ({ loc, lastmod: '' }));
} else {
  const xml = readFileSync(join(ROOT, 'public/sitemap.xml'), 'utf8');
  entries = [...xml.matchAll(/<url>([\s\S]*?)<\/url>/g)].map((m) => ({
    loc: /<loc>([^<]*)/.exec(m[1])[1].trim(),
    lastmod: (/<lastmod>([^<]*)/.exec(m[1]) || [])[1] || '',
  }));
}

if (dryRun) {
  console.log(`DRY RUN: ${entries.length} URL(s) for ${PROPERTY}, no API calls.`);
  for (const e of entries.slice(0, 5)) console.log(`  ${e.loc}  ${e.lastmod}`);
  if (entries.length > 5) console.log(`  ... and ${entries.length - 5} more`);
  console.log(`Would write:\n  ${outJson}\n  ${outCsv}`);
  console.log(`Key file ${existsSync(KEY_PATH) ? 'found' : 'NOT found'} (path not shown further, contents never printed).`);
  process.exit(0);
}

// ---- auth
async function getToken() {
  const key = JSON.parse(readFileSync(KEY_PATH, 'utf8'));
  const b64url = (o) => Buffer.from(JSON.stringify(o)).toString('base64url');
  const now = Math.floor(Date.now() / 1000);
  const header = b64url({ alg: 'RS256', typ: 'JWT' });
  const claims = b64url({
    iss: key.client_email,
    scope: SCOPE,
    aud: 'https://oauth2.googleapis.com/token',
    iat: now,
    exp: now + 3600,
  });
  const signer = createSign('RSA-SHA256');
  signer.update(`${header}.${claims}`);
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: `${header}.${claims}.${signer.sign(key.private_key, 'base64url')}`,
    }),
  });
  const data = await res.json();
  if (!data.access_token) {
    console.error('Token error:', data.error_description || data.error || 'no access_token');
    process.exit(1);
  }
  return data.access_token;
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const token = await getToken();
const H = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };

// ---- 93-day performance per page (read-only), for context next to the coverage state
const perf = {};
if (withPerf) {
  const site = encodeURIComponent(PROPERTY);
  const res = await fetch(`https://www.googleapis.com/webmasters/v3/sites/${site}/searchAnalytics/query`, {
    method: 'POST',
    headers: H,
    body: JSON.stringify({ startDate: day(93), endDate: day(3), dimensions: ['page'], rowLimit: 1000 }),
  });
  const data = await res.json();
  if (data.error) console.error(`searchAnalytics: ${data.error.message} (continuing without clicks/impressions)`);
  for (const r of data.rows || []) perf[r.keys[0]] = r;
}

// ---- inspect
const rows = new Array(entries.length);
let next = 0;
async function worker() {
  while (next < entries.length) {
    const i = next++;
    const e = entries[i];
    let r;
    for (let attempt = 0; attempt < 3; attempt++) {
      const res = await fetch('https://searchconsole.googleapis.com/v1/urlInspection/index:inspect', {
        method: 'POST',
        headers: H,
        body: JSON.stringify({ inspectionUrl: e.loc, siteUrl: PROPERTY }),
      });
      try {
        r = await res.json();
      } catch {
        r = { error: { code: res.status, message: `non-JSON response (HTTP ${res.status})`, nonJson: true } };
        if (res.status === 429 || res.status >= 500) {
          if (attempt < 2) await sleep(5000);
          continue;
        }
        break;
      }
      if (r.error && (r.error.code === 429 || r.error.code >= 500)) {
        await sleep(5000);
        continue;
      }
      break;
    }
    const x = r.inspectionResult?.indexStatusResult || {};
    rows[i] = {
      url: e.loc,
      sitemapLastmod: e.lastmod,
      coverageState: x.coverageState || `ERR:${r.error?.message || 'none'}`,
      verdict: x.verdict,
      indexingState: x.indexingState,
      robotsTxtState: x.robotsTxtState,
      pageFetchState: x.pageFetchState,
      lastCrawlTime: x.lastCrawlTime || '',
      crawledAs: x.crawledAs || '',
      googleCanonical: x.googleCanonical || '',
      userCanonical: x.userCanonical || '',
      referringUrls: (x.referringUrls || []).length,
      sitemapSeen: (x.sitemap || []).length,
      clicks93: perf[e.loc]?.clicks ?? 0,
      impr93: perf[e.loc]?.impressions ?? 0,
    };
    await sleep(200);
  }
}
await Promise.all(Array.from({ length: Math.min(WORKERS, entries.length) }, worker));

// ---- write (outside the repo only)
mkdirSync(outDir, { recursive: true });
writeFileSync(outJson, JSON.stringify({ property: PROPERTY, date: today, inspected: rows.length, rows }, null, 1));
const CSV_COLS = ['site', 'url', 'sitemapLastmod', 'coverageState', 'verdict', 'indexingState', 'pageFetchState', 'lastCrawlTime', 'googleCanonical', 'userCanonical', 'clicks93', 'impr93'];
const esc = (v) => {
  const s = String(v ?? '');
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};
const site = PROPERTY.replace(/^sc-domain:/, '');
writeFileSync(outCsv, [CSV_COLS.join(','), ...rows.map((r) => CSV_COLS.map((c) => esc(c === 'site' ? site : r[c])).join(','))].join('\n') + '\n');

const counts = {};
for (const r of rows) counts[r.coverageState] = (counts[r.coverageState] || 0) + 1;
console.log(`Inspected ${rows.length} URL(s) for ${PROPERTY}`);
for (const [state, n] of Object.entries(counts).sort((a, b) => b[1] - a[1])) console.log(`  ${String(n).padStart(4)}  ${state}`);
console.log(`Wrote ${outJson}\n      ${outCsv}`);
if (rows.length > 0 && rows.every((r) => String(r.coverageState).startsWith('ERR:'))) {
  console.error('inspect-urls: every row is an ERR row (see coverageState in the output); exiting 1.');
  process.exit(1);
}
