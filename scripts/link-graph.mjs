#!/usr/bin/env node
// link-graph.mjs: internal-link audit shared by the three app sites (FaithWall, QuranWall, NoteWall).
// Dependency-free. Copy it byte for byte; the sites differ only in the arguments.
//
//   node scripts/link-graph.mjs --live https://faithwall.app        # crawl the sitemap's pages on the live site
//   node scripts/link-graph.mjs --dist dist --base https://faithwall.app   # read a local build (dir/index.html or x.html)
//   options: --json (full report), --min-contextual 3, --max-depth 3
//
// Pages are the sitemap's URLs. Links are <a href> to the same host, without query or #fragment.
// "Template" links are those present on more than half of the pages (header, footer); the rest are contextual.
// Exit 0 = targets met, 1 = a target missed (orphans, unreachable pages, broken links, too deep, too few contextual links,
// a sitemap page that is noindex or canonicalises elsewhere). Page checks (title, description, H1, canonical, JSON-LD
// BreadcrumbList / Article + dateModified on posts, llms.txt coverage) print as WARN and do not fail the run.
// 1.1.0 adds WARN-only checks on indexable pages: title vs H1, a year in the title vs the updated date, and og:image
// (missing, not absolute https, under 1200 px wide, under 300,000 px total, logo or app icon, shared by 3+ pages), plus
// robots meta without max-image-preview:large. In --live mode image sizes come from a ranged GET of the image header;
// in --dist mode from the file in the build folder. They never change the exit code.

import fs from 'node:fs';
import path from 'node:path';

const VERSION = '1.1.0';
const args = process.argv.slice(2);
const opt = (k, d) => { const i = args.indexOf(k); return i >= 0 && args[i + 1] && !args[i + 1].startsWith('--') ? args[i + 1] : d; };
const has = k => args.includes(k);
const LIVE = opt('--live');
const DIST = opt('--dist');
const BASE = (LIVE || opt('--base') || '').replace(/\/+$/, '');
const MIN_CTX = Number(opt('--min-contextual', '3'));
const MAX_DEPTH = Number(opt('--max-depth', '3'));
if (!BASE || (!LIVE && !DIST)) {
  console.error(`link-graph ${VERSION}\nusage: --live <origin> | --dist <dir> --base <origin>  [--json] [--min-contextual N] [--max-depth N]`);
  process.exit(64);
}
const HOST = new URL(BASE).host;

const norm = p => {
  let s = decodeURI(p.split('#')[0].split('?')[0]) || '/';
  s = s.replace(/\/index\.html$/, '/').replace(/\.html$/, '');
  if (s.length > 1) s = s.replace(/\/+$/, '');
  return s || '/';
};

function toPath(href, fromPath) {
  if (!href) return null;
  href = href.trim().replace(/&amp;/g, '&');
  if (/^(mailto:|tel:|javascript:|data:|#)/i.test(href)) return null;
  let u;
  try { u = new URL(href, BASE + (fromPath === '/' ? '/' : fromPath + '/')); } catch { return null; }
  if (u.host !== HOST) return null;
  if (u.pathname.startsWith('/cdn-cgi/')) return null; // Cloudflare-injected (email obfuscation etc.), not site pages
  if (/\.(png|jpe?g|webp|avif|gif|svg|ico|pdf|xml|txt|json|webmanifest|css|js|mp4|woff2?)$/i.test(u.pathname)) return null;
  return norm(u.pathname);
}

function linksOf(html, fromPath) {
  const out = new Set();
  const body = html.replace(/<script[\s\S]*?<\/script>/gi, '').replace(/<!--[\s\S]*?-->/g, '');
  for (const m of body.matchAll(/<a\b[^>]*?\bhref\s*=\s*("([^"]*)"|'([^']*)')/gi)) {
    const p = toPath(m[2] ?? m[3], fromPath);
    if (p && p !== fromPath) out.add(p);
  }
  return out;
}

function jsonLdTypes(html) {
  const types = new Set();
  let dateModified = false;
  const dm = []; // [{ date, article }]
  const pubNames = [], siteNames = [], logos = [], appImages = [];
  const urlOf = v => (typeof v === 'string' ? v : v && typeof v === 'object' ? (Array.isArray(v) ? urlOf(v[0]) : v.url || v.contentUrl) : null);
  const walk = n => {
    if (Array.isArray(n)) return n.forEach(walk);
    if (!n || typeof n !== 'object') return;
    const ts = [].concat(n['@type'] || []);
    for (const t of ts) types.add(t);
    if (n.dateModified) {
      dateModified = true;
      if (typeof n.dateModified === 'string') dm.push({ date: n.dateModified, article: ts.some(t => /^(Article|BlogPosting|NewsArticle|TechArticle)$/.test(t)) });
    }
    if (n.publisher && typeof n.publisher === 'object' && typeof n.publisher.name === 'string') pubNames.push(n.publisher.name);
    if (ts.includes('WebSite') && typeof n.name === 'string') siteNames.push(n.name);
    if (n.logo) { const u = urlOf(n.logo); if (u) logos.push(u); }
    if (ts.includes('SoftwareApplication') || ts.includes('MobileApplication')) { const u = urlOf(n.image); if (u) appImages.push(u); }
    for (const v of Object.values(n)) if (v && typeof v === 'object') walk(v);
  };
  for (const m of html.matchAll(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)) {
    try { walk(JSON.parse(m[1])); } catch { types.add('INVALID_JSON'); }
  }
  return { types, dateModified, dm, pubNames, siteNames, logos, appImages };
}

const decodeEnt = s => s.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (m, e) => {
  if (e[0] === '#') { const c = e[1] === 'x' || e[1] === 'X' ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10); try { return String.fromCodePoint(c); } catch { return m; } }
  return ({ amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ' })[e.toLowerCase()] ?? m;
});
// normalise for the title/H1 comparison: lowercase, strip accents, "&" -> and, curly -> straight quotes, runs of non-alphanumerics -> one space
const textNorm = s => decodeEnt(s).normalize('NFKD').replace(/\p{M}/gu, '').toLowerCase().replace(/&/g, ' and ')
  .replace(/[\u2018\u2019\u201a\u2032]/g, "'").replace(/[\u201c\u201d\u201e]/g, '"').replace(/[^\p{L}\p{N}]+/gu, ' ').trim();
const MON = 'jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|june?|july?|aug(?:ust)?|sep(?:t(?:ember)?)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?';
const UPDATED_RE = new RegExp(`\\bupdated(?:\\s+on)?\\s*[:\\-]?\\s*(?:(?:${MON})\\.?\\s+\\d{1,2}(?:st|nd|rd|th)?,?\\s+(20\\d{2})|\\d{1,2}(?:st|nd|rd|th)?\\s+(?:${MON})\\.?,?\\s+(20\\d{2})|(20\\d{2})-\\d{2}-\\d{2})`, 'i');
const yearsIn = s => [...new Set((s.match(/\b20\d{2}\b/g) || []))];

function pageChecks(html, p, xRobots) {
  const attr = (tag, name) => (tag.match(new RegExp(`\\b${name}\\s*=\\s*["']([^"']*)["']`, 'i')) || [])[1];
  const metaOf = (re) => [...html.matchAll(new RegExp(`<meta\\b[^>]*\\b${re}[^>]*>`, 'gi'))].map(m => m[0]);
  const canonTag = (html.match(/<link\b[^>]*\brel=["']canonical["'][^>]*>/i) || [])[0];
  const canon = canonTag && attr(canonTag, 'href');
  let canonPath = null;
  if (canon) { try { const u = new URL(canon, BASE); canonPath = u.host === HOST ? norm(u.pathname) : 'other-host:' + u.host; } catch { canonPath = 'invalid'; } }
  const robotsTag = (html.match(/<meta\b[^>]*\bname=["']robots["'][^>]*>/i) || [])[0];
  const title = ((html.match(/<title[^>]*>([\s\S]*?)<\/title>/i) || [])[1] || '').trim();
  const descTag = (html.match(/<meta\b[^>]*\bname=["']description["'][^>]*>/i) || [])[0];
  const { types, dateModified, dm, pubNames, siteNames, logos, appImages } = jsonLdTypes(html);

  // 1.1.0 inputs
  const h1m = html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i);
  const h1Text = h1m ? decodeEnt(h1m[1].replace(/<br\s*\/?>/gi, ' ').replace(/<[^>]*>/g, '')).replace(/\s+/g, ' ').trim() : '';
  const val = tag => decodeEnt((tag && attr(tag, 'content')) || '').trim();
  const siteNameTag = metaOf('property=["\']og:site_name["\']')[0];
  const brand = val(siteNameTag) || pubNames[0] || siteNames[0] || '';
  const ogTag = metaOf('property=["\']og:image["\']').find(t => val(t));
  const twTag = metaOf('(?:name|property)=["\']twitter:image(?::src)?["\']').find(t => val(t));
  const robotsMetas = [...metaOf('name=["\']robots["\']'), ...metaOf('name=["\']googlebot["\']')];
  const robotsAll = robotsMetas.map(val).join(',').replace(/\s+/g, '').toLowerCase();
  const visible = decodeEnt(html.replace(/<(script|style|noscript)\b[\s\S]*?<\/\1>/gi, ' ').replace(/<!--[\s\S]*?-->/g, ' ').replace(/<[^>]*>/g, ' ')).replace(/\s+/g, ' ');
  const um = visible.match(UPDATED_RE);
  const dmPick = dm.find(d => d.article) || dm[0];
  const links = [...html.matchAll(/<link\b[^>]*>/gi)].map(m => m[0]);
  const icons = links.filter(t => /\brel=["'][^"']*\b(apple-touch-icon(?:-precomposed)?|icon|shortcut icon)\b[^"']*["']/i.test(t)).map(t => attr(t, 'href')).filter(Boolean);
  const manifestTag = links.find(t => /\brel=["']manifest["']/i.test(t));
  return {
    canonical: canonPath, noindex: !!(robotsTag && /noindex/i.test(attr(robotsTag, 'content') || '')),
    titleLen: title.length, desc: !!(descTag && (attr(descTag, 'content') || '').trim()),
    h1: (html.match(/<h1\b/gi) || []).length, types: [...types], dateModified,
    titleRaw: decodeEnt(title), h1Text, brand,
    updatedYear: um ? (um[1] || um[2] || um[3]) : null,
    dateModifiedYear: dmPick ? (String(dmPick.date).match(/\b(20\d{2})\b/) || [])[1] || null : null,
    ogImage: val(ogTag) || val(twTag) || null, ogMissing: !ogTag && !twTag,
    robotsLarge: /max-image-preview:large/.test(robotsAll) || /max-image-preview:large/i.test((xRobots || '').replace(/\s+/g, '')),
    hasRobotsMeta: robotsMetas.length > 0,
    icons, logos, appImages, manifest: manifestTag ? attr(manifestTag, 'href') : null,
  };
}

function sitemapUrls(xml) {
  return [...xml.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)].map(m => m[1]);
}

async function get(url) {
  for (let a = 0; a < 3; a++) {
    try {
      const r = await fetch(url, { redirect: 'manual', headers: { 'user-agent': 'link-graph/' + VERSION } });
      return { status: r.status, text: r.status === 200 ? await r.text() : '', location: r.headers.get('location'), xRobots: r.headers.get('x-robots-tag') };
    } catch (e) { if (a === 2) return { status: 0, text: '', error: String(e) }; }
  }
}

async function loadLive() {
  let sm = await get(BASE + '/sitemap.xml');
  let urls = sitemapUrls(sm.text);
  const nested = urls.filter(u => /\.xml$/i.test(u));
  if (nested.length) {
    urls = urls.filter(u => !/\.xml$/i.test(u));
    for (const n of nested) urls.push(...sitemapUrls((await get(n)).text));
  }
  const pages = new Map();
  const queue = [...new Set(urls.map(u => norm(new URL(u).pathname)))];
  if (!queue.includes('/')) queue.unshift('/');
  const status = new Map();
  const checks = new Map();
  let i = 0;
  await Promise.all(Array.from({ length: 4 }, async () => {
    while (i < queue.length) {
      const p = queue[i++];
      const r = await get(BASE + (p === '/' ? '/' : p));
      status.set(p, r.status);
      if (r.status === 200) { pages.set(p, linksOf(r.text, p)); checks.set(p, pageChecks(r.text, p, r.xRobots)); }
    }
  }));
  const llms = await get(BASE + '/llms.txt');
  return { inSitemap: new Set(queue), pages, status, checks, llms: llms.status === 200 ? llms.text : null,
    checkTarget: async t => (await get(BASE + t)).status };
}

function loadDist() {
  const root = path.resolve(DIST);
  const pages = new Map();
  const files = new Map();
  (function walk(d) {
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      const f = path.join(d, e.name);
      if (e.isDirectory()) walk(f);
      else if (e.name.endsWith('.html')) {
        const rel = '/' + path.relative(root, f).split(path.sep).join('/');
        if (/^\/404(\.html|\/index\.html)$/.test(rel)) continue;
        files.set(norm(rel), f);
      }
    }
  })(root);
  const smFile = path.join(root, 'sitemap.xml');
  const sm = fs.existsSync(smFile) ? sitemapUrls(fs.readFileSync(smFile, 'utf8')).map(u => norm(new URL(u).pathname)) : [...files.keys()];
  const inSitemap = new Set(sm);
  inSitemap.add('/');
  const status = new Map();
  const checks = new Map();
  for (const p of inSitemap) {
    const f = files.get(p);
    status.set(p, f ? 200 : 404);
    if (f) { const html = fs.readFileSync(f, 'utf8'); pages.set(p, linksOf(html, p)); checks.set(p, pageChecks(html, p)); }
  }
  const llmsFile = path.join(root, 'llms.txt');
  return { inSitemap, pages, status, checks, llms: fs.existsSync(llmsFile) ? fs.readFileSync(llmsFile, 'utf8') : null,
    checkTarget: async t => (files.has(t) ? 200 : 404) };
}

const { inSitemap, pages, status, checks, llms, checkTarget } = LIVE ? await loadLive() : loadDist();

// template links: on more than half of the crawled pages
const freq = new Map();
for (const ls of pages.values()) for (const t of ls) freq.set(t, (freq.get(t) || 0) + 1);
const template = new Set([...freq].filter(([, n]) => n > pages.size / 2).map(([t]) => t));

const inbound = new Map([...inSitemap].map(p => [p, new Set()]));
const ctxIn = new Map([...inSitemap].map(p => [p, new Set()]));
const broken = new Map();
const targetStatus = new Map();
for (const [from, ls] of pages) {
  for (const t of ls) {
    if (!inSitemap.has(t)) {
      if (!targetStatus.has(t)) targetStatus.set(t, await checkTarget(t));
      const s = targetStatus.get(t);
      if (s !== 200) { if (!broken.has(t)) broken.set(t, { status: s, from: [] }); broken.get(t).from.push(from); }
      continue;
    }
    inbound.get(t).add(from);
    if (!template.has(t)) ctxIn.get(t).add(from);
  }
}
// Template targets (linked from most pages) are exempt from the contextual-inbound target: HTML alone can't
// tell a body link to them from the header link, and they are one click from everywhere anyway.

const depth = new Map([['/', 0]]);
const q = ['/'];
while (q.length) {
  const p = q.shift();
  for (const t of pages.get(p) || []) if (inSitemap.has(t) && !depth.has(t)) { depth.set(t, depth.get(p) + 1); q.push(t); }
}

const all = [...inSitemap].filter(p => status.get(p) === 200);
const notOk = [...inSitemap].filter(p => status.get(p) !== 200).map(p => ({ page: p, status: status.get(p) }));
const orphans = all.filter(p => p !== '/' && inbound.get(p).size === 0);
const unreachable = all.filter(p => !depth.has(p));
const tooDeep = all.filter(p => depth.has(p) && depth.get(p) > MAX_DEPTH).map(p => ({ page: p, depth: depth.get(p) }));
const legal = p => /(privacy|terms|eula|legal|cookie|imprint|refund|support|contact|404)/i.test(p);
const fewCtx = all.filter(p => p !== '/' && !template.has(p) && !legal(p) && ctxIn.get(p).size < MIN_CTX)
  .map(p => ({ page: p, contextual: ctxIn.get(p).size })).sort((a, b) => a.contextual - b.contextual);
const depths = all.filter(p => depth.has(p)).map(p => depth.get(p)).sort((a, b) => a - b);
const ctxCounts = all.filter(p => p !== '/' && !template.has(p)).map(p => ctxIn.get(p).size).sort((a, b) => a - b);
const median = a => (a.length ? a[Math.floor(a.length / 2)] : 0);

// page checks
const isPost = p => /^\/blog\/./.test(p);
const C = [...checks].filter(([p]) => status.get(p) === 200);
const canonElsewhere = C.filter(([p, c]) => c.canonical && c.canonical !== p).map(([p, c]) => ({ page: p, canonical: c.canonical }));
const noindexed = C.filter(([, c]) => c.noindex).map(([p]) => p);
const warn = {
  'no canonical': C.filter(([, c]) => !c.canonical).map(([p]) => p),
  'title missing or over 65 chars': C.filter(([, c]) => !c.titleLen || c.titleLen > 65).map(([p, c]) => `${p} (${c.titleLen})`),
  'no meta description': C.filter(([, c]) => !c.desc).map(([p]) => p),
  'H1 count not 1': C.filter(([, c]) => c.h1 !== 1).map(([p, c]) => `${p} (${c.h1})`),
  'invalid JSON-LD': C.filter(([, c]) => c.types.includes('INVALID_JSON')).map(([p]) => p),
  'no BreadcrumbList (non-home)': C.filter(([p, c]) => p !== '/' && !legal(p) && !c.types.includes('BreadcrumbList')).map(([p]) => p),
  'post without Article/BlogPosting': C.filter(([p, c]) => isPost(p) && !c.types.some(t => /^(Article|BlogPosting|NewsArticle|TechArticle)$/.test(t))).map(([p]) => p),
  'post without dateModified': C.filter(([p, c]) => isPost(p) && !c.dateModified).map(([p]) => p),
};
let llmsMissing = null;
if (llms !== null) {
  const listed = new Set();
  for (const m of llms.matchAll(/https?:\/\/[^\s)\]>"']+/g)) { try { const u = new URL(m[0]); if (u.host === HOST) listed.add(norm(u.pathname)); } catch {} }
  for (const m of llms.matchAll(/\]\((\/[^)\s]*)\)/g)) listed.add(norm(m[1]));
  llmsMissing = all.filter(p => !legal(p) && !listed.has(p));
}
warn['llms.txt missing or not listing the page'] = llms === null ? ['(no llms.txt)'] : llmsMissing;

// ---- 1.1.0 WARN-only checks (indexable pages: status 200, no noindex, in the sitemap) ----
const NEW_WARN_KEYS = [];
const IDX = C.filter(([, c]) => !c.noindex);
const sepRe = / \| | - | – | — | · /;
const titleVsH1 = ([p, c]) => {
  if (p === '/') return null;
  if (!c.h1) return `${p}: (no h1)`;
  if (c.h1 > 1) return `${p}: (multiple h1)`;
  let t = c.titleRaw;
  const segs = t.split(sepRe);
  const brand = textNorm(c.brand);
  if (segs.length > 1 && brand) { const last = textNorm(segs[segs.length - 1]); if (last === brand || last.includes(brand)) t = segs.slice(0, -1).join(' '); }
  const nt = textNorm(t), nh = textNorm(c.h1Text);
  if (!nt || !nh || nt.includes(nh) || nh.includes(nt)) return null;
  return `${p}: "${c.titleRaw}" vs "${c.h1Text}"`;
};
const yearVsUpdated = ([p, c]) => {
  const years = [...new Set([...yearsIn(c.titleRaw), ...yearsIn(c.h1Text)])];
  if (!years.length) return null;
  const ref = c.updatedYear || c.dateModifiedYear;
  if (!ref) return `${p}: year ${years.join(', ')} in title (no updated date)`;
  const split = c.updatedYear && c.dateModifiedYear && c.updatedYear !== c.dateModifiedYear ? ` [visible updated ${c.updatedYear} vs dateModified ${c.dateModifiedYear}]` : '';
  if (years.some(y => y !== ref)) return `${p}: year ${years.join(', ')} in title vs updated ${ref}${split}`;
  return null;
};
const absOg = c => { try { return new URL(c.ogImage, BASE + '/'); } catch { return null; } };
const stripQ = u => { const x = new URL(u.href); x.search = ''; x.hash = ''; return x.href; };

// image header: PNG / JPEG / WebP / GIF dimensions from the first bytes
function imageInfo(buf) {
  if (!buf || buf.length < 12) return { note: '(dimensions unreadable)' };
  const head = buf.subarray(0, 256).toString('latin1').trimStart();
  if (/^(<\?xml|<svg|<!doctype svg)/i.test(head)) return { note: '(svg, not supported by og scrapers)' };
  if (buf[0] === 0x89 && buf.toString('latin1', 1, 4) === 'PNG' && buf.length >= 24) return { w: buf.readUInt32BE(16), h: buf.readUInt32BE(20) };
  if (buf.toString('latin1', 0, 4) === 'GIF8' && buf.length >= 10) return { w: buf.readUInt16LE(6), h: buf.readUInt16LE(8) };
  if (buf[0] === 0xff && buf[1] === 0xd8) {
    let i = 2;
    while (i + 9 < buf.length) {
      if (buf[i] !== 0xff) { i++; continue; }
      const m = buf[i + 1];
      if (m === 0xff) { i++; continue; }
      if (m === 0xd8 || m === 0x01 || (m >= 0xd0 && m <= 0xd7)) { i += 2; continue; }
      if (m >= 0xc0 && m <= 0xcf && m !== 0xc4 && m !== 0xc8 && m !== 0xcc) return { w: buf.readUInt16BE(i + 7), h: buf.readUInt16BE(i + 5) };
      i += 2 + buf.readUInt16BE(i + 2);
    }
    return { more: true, note: '(dimensions unreadable)' };
  }
  if (buf.toString('latin1', 0, 4) === 'RIFF' && buf.toString('latin1', 8, 12) === 'WEBP' && buf.length >= 30) {
    const k = buf.toString('latin1', 12, 16);
    if (k === 'VP8 ') return { w: buf.readUInt16LE(26) & 0x3fff, h: buf.readUInt16LE(28) & 0x3fff };
    if (k === 'VP8L') return { w: 1 + (((buf[22] & 0x3f) << 8) | buf[21]), h: 1 + (((buf[24] & 0xf) << 10) | (buf[23] << 2) | ((buf[22] & 0xc0) >> 6)) };
    if (k === 'VP8X') return { w: 1 + buf.readUIntLE(24, 3), h: 1 + buf.readUIntLE(27, 3) };
  }
  return { note: '(dimensions unreadable)' };
}
async function fetchHead(url, bytes) {
  const ac = new AbortController();
  const timer = setTimeout(() => ac.abort(), 8000);
  try {
    const r = await fetch(url, { headers: { range: `bytes=0-${bytes - 1}`, 'user-agent': 'link-graph/' + VERSION }, signal: ac.signal });
    if (r.status !== 200 && r.status !== 206) return null;
    const chunks = []; let n = 0;
    const rd = r.body.getReader();
    while (n < bytes) { const { done, value } = await rd.read(); if (done) break; chunks.push(value); n += value.length; }
    try { await rd.cancel(); } catch {}
    return Buffer.concat(chunks).subarray(0, bytes);
  } catch { return null; } finally { clearTimeout(timer); }
}
function readDistHead(u, bytes) {
  let f;
  try { f = path.join(path.resolve(DIST), decodeURIComponent(u.pathname)); } catch { return undefined; }
  if (!f.startsWith(path.resolve(DIST)) || !fs.existsSync(f) || !fs.statSync(f).isFile()) return undefined;
  const fd = fs.openSync(f, 'r');
  try { const b = Buffer.alloc(bytes); const n = fs.readSync(fd, b, 0, bytes, 0); return b.subarray(0, n); } finally { fs.closeSync(fd); }
}
async function imageSize(u) {
  if (!LIVE && u.host === HOST) {
    let b = readDistHead(u, 65536);
    if (b === undefined) return { note: '(not in dist)' };
    let info = imageInfo(b);
    if (info.more) info = imageInfo(readDistHead(u, 262144));
    return info.more ? { note: '(dimensions unreadable)' } : info;
  }
  let info = imageInfo(await fetchHead(u.href, 65536));
  if (info.more) info = imageInfo(await fetchHead(u.href, 262144));
  return info.more ? { note: '(dimensions unreadable)' } : info;
}
async function auxText(p) {
  if (LIVE) return (await get(BASE + p)).text;
  const f = path.join(path.resolve(DIST), p);
  return fs.existsSync(f) ? fs.readFileSync(f, 'utf8') : '';
}

// logo / app icon set: JSON-LD logos on every page, SoftwareApplication.image on the home page, <link> icons, manifest icons
const logoReason = new Map();
const addLogo = (u, why) => { try { const k = stripQ(new URL(u, BASE + '/')); if (!logoReason.has(k)) logoReason.set(k, why); } catch {} };
for (const [p, c] of C) {
  c.logos.forEach(u => addLogo(u, 'JSON-LD logo'));
  if (p === '/') c.appImages.forEach(u => addLogo(u, 'SoftwareApplication image'));
  c.icons.forEach(u => addLogo(u, 'icon link'));
}
{
  const home = checks.get('/');
  let manifests = new Set();
  for (const [, c] of C) if (c.manifest) manifests.add(c.manifest);
  if (!manifests.size && home) manifests.add('/manifest.webmanifest');
  for (const mp of manifests) {
    try {
      const mu = new URL(mp, BASE + '/');
      if (mu.host !== HOST) continue;
      const j = JSON.parse(await auxText(mu.pathname));
      for (const ic of j.icons || []) if (ic.src) addLogo(new URL(ic.src, mu).href, 'manifest icon');
    } catch {}
  }
}
const LOGO_NAME = /(^|[-_/])(icon|logo|favicon|apple-touch)([-_.]|$)/i;

// sizes, one fetch per distinct URL, at most 6 in flight
const ogUrls = [...new Set(IDX.map(([, c]) => c.ogImage && absOg(c)).filter(Boolean).map(u => u.href))];
const sizeOf = new Map();
{
  let k = 0;
  await Promise.all(Array.from({ length: 6 }, async () => {
    while (k < ogUrls.length) { const h = ogUrls[k++]; sizeOf.set(h, await imageSize(new URL(h))); }
  }));
}
const ogUse = new Map();
for (const [p, c] of IDX) if (c.ogImage) { const u = absOg(c); if (u) { if (!ogUse.has(u.href)) ogUse.set(u.href, []); ogUse.get(u.href).push(p); } }

const addWarn = (k, arr) => { warn[k] = arr; NEW_WARN_KEYS.push(k); };
addWarn('title vs H1 mismatch', IDX.map(titleVsH1).filter(Boolean));
addWarn('year in title differs from updated year', IDX.map(yearVsUpdated).filter(Boolean));
addWarn('og:image missing', IDX.filter(([, c]) => c.ogMissing).map(([p]) => p));
addWarn('og:image not absolute https URL', IDX.filter(([, c]) => c.ogImage && !/^https:\/\//i.test(c.ogImage)).map(([p, c]) => `${p}: ${c.ogImage}`));
addWarn('og:image under 1200 px wide', IDX.filter(([, c]) => c.ogImage && absOg(c)).map(([p, c]) => {
  const s = sizeOf.get(absOg(c).href);
  if (s.note) return `${p}: ${s.note}`;
  return s.w < 1200 ? `${p}: ${s.w}x${s.h}` : null;
}).filter(Boolean));
addWarn('og:image under 300,000 px total', IDX.filter(([, c]) => c.ogImage && absOg(c)).map(([p, c]) => {
  const s = sizeOf.get(absOg(c).href);
  return s.w && s.w * s.h < 300000 ? `${p}: ${s.w}x${s.h} = ${s.w * s.h}` : null;
}).filter(Boolean));
addWarn('og:image is the site logo or app icon', IDX.filter(([, c]) => c.ogImage && absOg(c)).map(([p, c]) => {
  const k = stripQ(absOg(c));
  const why = logoReason.get(k) || (LOGO_NAME.test(new URL(k).pathname) ? 'file name looks like an icon or logo' : null);
  return why ? `${p}: ${new URL(k).pathname} (${why})` : null;
}).filter(Boolean));
addWarn('og:image shared by 3 or more pages', [...ogUse].filter(([, ps]) => ps.length >= 3)
  .map(([u, ps]) => `${new URL(u).pathname}: ${ps.length} pages (${ps.slice(0, 5).join(', ')}${ps.length > 5 ? ', ...' : ''})`));
addWarn('robots meta lacks max-image-preview:large', IDX.filter(([, c]) => !c.robotsLarge).map(([p, c]) => c.hasRobotsMeta ? p : `${p} (no robots meta)`));

const report = {
  tool: 'link-graph', version: VERSION, site: BASE, mode: LIVE ? 'live' : 'dist',
  pages: all.length, sitemap_not_200: notOk, template_targets: [...template].sort(),
  max_depth: depths.at(-1) ?? 0, median_depth: median(depths),
  depth_histogram: depths.reduce((h, d) => ((h[d] = (h[d] || 0) + 1), h), {}),
  median_contextual_inbound: median(ctxCounts),
  orphans, unreachable, too_deep: tooDeep, few_contextual: fewCtx,
  broken: [...broken].map(([t, v]) => ({ target: t, status: v.status, from: v.from.slice(0, 5), count: v.from.length })),
  canonical_elsewhere: canonElsewhere, noindex_in_sitemap: noindexed, warn,
};

if (has('--json')) console.log(JSON.stringify(report, null, 1));
else {
  console.log(`link-graph ${VERSION} ${report.mode} ${BASE}`);
  console.log(`pages ${report.pages} | max depth ${report.max_depth} | median depth ${report.median_depth} | depth ${JSON.stringify(report.depth_histogram)}`);
  console.log(`template links (header/footer, on >50% of pages): ${report.template_targets.length}`);
  console.log(`median contextual inbound links per page: ${report.median_contextual_inbound}`);
  const sec = (name, arr, fmt) => { console.log(`${arr.length ? 'FAIL' : 'ok  '} ${name}: ${arr.length}`); for (const x of arr.slice(0, 15)) console.log('     ' + fmt(x)); if (arr.length > 15) console.log(`     … ${arr.length - 15} more (--json)`); };
  sec('sitemap URLs not 200', notOk, x => `${x.page} ${x.status}`);
  sec('orphans (no internal link in)', orphans, x => x);
  sec('unreachable from home', unreachable, x => x);
  sec(`deeper than ${MAX_DEPTH} clicks`, tooDeep, x => `${x.page} depth ${x.depth}`);
  sec(`fewer than ${MIN_CTX} contextual links in`, fewCtx, x => `${x.page} ${x.contextual}`);
  sec('broken internal links', report.broken, x => `${x.target} ${x.status} from ${x.from[0]}${x.count > 1 ? ` (+${x.count - 1})` : ''}`);
  sec('sitemap pages canonicalised elsewhere', canonElsewhere, x => `${x.page} -> ${x.canonical}`);
  sec('sitemap pages marked noindex', noindexed, x => x);
  for (const [name, arr] of Object.entries(warn)) {
    console.log(`${arr.length ? 'WARN' : 'ok  '} ${name}: ${arr.length}`);
    const lim = NEW_WARN_KEYS.includes(name) ? 10 : 8;
    for (const x of arr.slice(0, lim)) console.log('     ' + x);
    if (arr.length > lim) console.log(`     … ${arr.length - lim} more (--json)`);
  }
}
const fail = notOk.length || orphans.length || unreachable.length || tooDeep.length || fewCtx.length || broken.size
  || canonElsewhere.length || noindexed.length;
process.exit(fail ? 1 : 0);
