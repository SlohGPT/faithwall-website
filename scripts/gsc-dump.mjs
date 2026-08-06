// Dump rich GSC data for faithwall.app to JSON for analysis agents.
import { readFileSync, writeFileSync } from 'node:fs';
import { createSign } from 'node:crypto';

const KEY_PATH =
  process.env.GOOGLE_APPLICATION_CREDENTIALS ??
  '/Users/carly/GITHUB REPOS/karchi/scripts/service-account-key.json';
const SCOPE = 'https://www.googleapis.com/auth/webmasters.readonly';
const OUT = process.argv[2] ?? 'gsc-data.json';

const key = JSON.parse(readFileSync(KEY_PATH, 'utf8'));
const b64url = (o) => Buffer.from(JSON.stringify(o)).toString('base64url');
const now = Math.floor(Date.now() / 1000);
const header = b64url({ alg: 'RS256', typ: 'JWT' });
const claims = b64url({ iss: key.client_email, scope: SCOPE, aud: 'https://oauth2.googleapis.com/token', iat: now, exp: now + 3600 });
const s = createSign('RSA-SHA256');
s.update(`${header}.${claims}`);
const jwt = `${header}.${claims}.${s.sign(key.private_key).toString('base64url')}`;
const tokRes = await fetch('https://oauth2.googleapis.com/token', {
  method: 'POST',
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  body: new URLSearchParams({ grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer', assertion: jwt }),
});
const { access_token } = await tokRes.json();
if (!access_token) throw new Error('no token');

const SITE = encodeURIComponent('sc-domain:faithwall.app');
const q = async (body) => {
  const r = await fetch(`https://www.googleapis.com/webmasters/v3/sites/${SITE}/searchAnalytics/query`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${access_token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const d = await r.json();
  if (d.error) throw new Error(JSON.stringify(d.error));
  return d.rows ?? [];
};

const day = (n) => {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - n);
  return d.toISOString().slice(0, 10);
};
const [end, start28, prevEnd, prevStart, start90] = [day(3), day(30), day(31), day(58), day(92)];

const data = {
  property: 'sc-domain:faithwall.app',
  generated: new Date().toISOString(),
  windows: { current28: [start28, end], previous28: [prevStart, prevEnd], daily90: [start90, end] },
  daily90: await q({ startDate: start90, endDate: end, dimensions: ['date'], rowLimit: 100 }),
  queries28: await q({ startDate: start28, endDate: end, dimensions: ['query'], rowLimit: 250 }),
  queries28prev: await q({ startDate: prevStart, endDate: prevEnd, dimensions: ['query'], rowLimit: 250 }),
  pages28: await q({ startDate: start28, endDate: end, dimensions: ['page'], rowLimit: 100 }),
  pages28prev: await q({ startDate: prevStart, endDate: prevEnd, dimensions: ['page'], rowLimit: 100 }),
  pageQuery28: await q({ startDate: start28, endDate: end, dimensions: ['page', 'query'], rowLimit: 500 }),
};

writeFileSync(OUT, JSON.stringify(data, null, 1));
console.log('wrote', OUT);
for (const k of Object.keys(data)) if (Array.isArray(data[k])) console.log(k, data[k].length, 'rows');
