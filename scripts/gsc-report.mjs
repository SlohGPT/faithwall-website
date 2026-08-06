// Google Search Console report for faithwall.app
// Usage: node scripts/gsc-report.mjs
// Auth: service account JSON (default: karchi-indexing project key, shared across Karol's sites).
// Override with GOOGLE_APPLICATION_CREDENTIALS or SITE (e.g. SITE=sc-domain:faithwall.app).
// Dependency-free: node:crypto JWT + fetch (Node 18+).
import { readFileSync } from 'node:fs';
import { createSign } from 'node:crypto';

const KEY_PATH =
  process.env.GOOGLE_APPLICATION_CREDENTIALS ??
  '/Users/carly/GITHUB REPOS/karchi/scripts/service-account-key.json';
const SCOPE = 'https://www.googleapis.com/auth/webmasters.readonly';
const SITE_HINT = process.env.SITE ?? 'faithwall';

async function getToken() {
  const key = JSON.parse(readFileSync(KEY_PATH, 'utf8'));
  const b64url = (obj) => Buffer.from(JSON.stringify(obj)).toString('base64url');
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
  const signature = signer.sign(key.private_key).toString('base64url');
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: `${header}.${claims}.${signature}`,
    }),
  });
  const data = await res.json();
  if (!data.access_token) {
    console.error('Token error:', JSON.stringify(data));
    process.exit(1);
  }
  return data.access_token;
}

async function api(token, path, body) {
  const res = await fetch(`https://www.googleapis.com/webmasters/v3${path}`, {
    method: body ? 'POST' : 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      ...(body && { 'Content-Type': 'application/json' }),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json();
  if (data.error) {
    console.error(`API error on ${path}:`, data.error.message);
    process.exit(1);
  }
  return data;
}

function dateStr(daysAgo) {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - daysAgo);
  return d.toISOString().slice(0, 10);
}

function table(rows, dimLabel) {
  if (!rows?.length) return console.log('  (no data)');
  const pad = (s, n) => String(s).padEnd(n).slice(0, n);
  console.log(
    `  ${pad(dimLabel, 58)} ${pad('clicks', 7)} ${pad('impr', 8)} ${pad('ctr', 6)} pos`,
  );
  for (const r of rows) {
    console.log(
      `  ${pad(r.keys[0], 58)} ${pad(r.clicks, 7)} ${pad(r.impressions, 8)} ${pad(
        (r.ctr * 100).toFixed(1) + '%',
        6,
      )} ${r.position.toFixed(1)}`,
    );
  }
}

const token = await getToken();

const { siteEntry = [] } = await api(token, '/sites');
const site = siteEntry.find((s) => s.siteUrl.includes(SITE_HINT));
if (!site) {
  console.error(
    `No property matching "${SITE_HINT}" among:`,
    siteEntry.map((s) => s.siteUrl),
  );
  process.exit(1);
}
const siteId = encodeURIComponent(site.siteUrl);
// GSC data lags ~2-3 days; end the window 3 days back.
const [end, start, prevEnd, prevStart] = [dateStr(3), dateStr(30), dateStr(31), dateStr(58)];
console.log(`Property: ${site.siteUrl} (${site.permissionLevel})`);
console.log(`Window: ${start} → ${end} (vs previous 28d)\n`);

const query = (body) =>
  api(token, `/sites/${siteId}/searchAnalytics/query`, { startDate: start, endDate: end, ...body });

const [totals, prevTotals, byQuery, byPage, byPageQuery] = await Promise.all([
  query({ rowLimit: 1 }),
  query({ startDate: prevStart, endDate: prevEnd, rowLimit: 1 }),
  query({ dimensions: ['query'], rowLimit: 25 }),
  query({ dimensions: ['page'], rowLimit: 25 }),
  query({ dimensions: ['query'], rowLimit: 100 }),
]);

const t = totals.rows?.[0] ?? { clicks: 0, impressions: 0 };
const p = prevTotals.rows?.[0] ?? { clicks: 0, impressions: 0 };
console.log(
  `TOTALS: ${t.clicks} clicks (prev ${p.clicks}), ${t.impressions} impressions (prev ${p.impressions})\n`,
);

console.log('TOP QUERIES (28d):');
table(byQuery.rows, 'query');

console.log('\nTOP PAGES (28d):');
table(byPage.rows, 'page');

// Quick wins: ranking on page 1-2 but not top 3 — content to double down on.
const wins = (byPageQuery.rows ?? [])
  .filter((r) => r.position >= 4 && r.position <= 20 && r.impressions >= 20)
  .sort((a, b) => b.impressions - a.impressions)
  .slice(0, 25);
console.log('\nQUICK WINS (position 4-20, ≥20 impressions — double down here):');
table(wins, 'query');
