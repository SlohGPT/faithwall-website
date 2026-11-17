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

import fs from 'node:fs';
import path from 'node:path';

const VERSION = '1.0.0';
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
  const walk = n => {
    if (Array.isArray(n)) return n.forEach(walk);
    if (!n || typeof n !== 'object') return;
    for (const t of [].concat(n['@type'] || [])) types.add(t);
    if (n.dateModified) dateModified = true;
    for (const v of Object.values(n)) if (v && typeof v === 'object') walk(v);
  };
  for (const m of html.matchAll(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)) {
    try { walk(JSON.parse(m[1])); } catch { types.add('INVALID_JSON'); }
  }
  return { types, dateModified };
}

function pageChecks(html, p) {
  const attr = (tag, name) => (tag.match(new RegExp(`\\b${name}\\s*=\\s*["']([^"']*)["']`, 'i')) || [])[1];
  const canonTag = (html.match(/<link\b[^>]*\brel=["']canonical["'][^>]*>/i) || [])[0];
  const canon = canonTag && attr(canonTag, 'href');
  let canonPath = null;
  if (canon) { try { const u = new URL(canon, BASE); canonPath = u.host === HOST ? norm(u.pathname) : 'other-host:' + u.host; } catch { canonPath = 'invalid'; } }
  const robotsTag = (html.match(/<meta\b[^>]*\bname=["']robots["'][^>]*>/i) || [])[0];
  const title = ((html.match(/<title[^>]*>([\s\S]*?)<\/title>/i) || [])[1] || '').trim();
  const descTag = (html.match(/<meta\b[^>]*\bname=["']description["'][^>]*>/i) || [])[0];
  const { types, dateModified } = jsonLdTypes(html);
  return {
    canonical: canonPath, noindex: !!(robotsTag && /noindex/i.test(attr(robotsTag, 'content') || '')),
    titleLen: title.length, desc: !!(descTag && (attr(descTag, 'content') || '').trim()),
    h1: (html.match(/<h1\b/gi) || []).length, types: [...types], dateModified,
  };
}

function sitemapUrls(xml) {
  return [...xml.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)].map(m => m[1]);
}

async function get(url) {
  for (let a = 0; a < 3; a++) {
    try {
      const r = await fetch(url, { redirect: 'manual', headers: { 'user-agent': 'link-graph/' + VERSION } });
      return { status: r.status, text: r.status === 200 ? await r.text() : '', location: r.headers.get('location') };
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
      if (r.status === 200) { pages.set(p, linksOf(r.text, p)); checks.set(p, pageChecks(r.text, p)); }
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
    for (const x of arr.slice(0, 8)) console.log('     ' + x);
    if (arr.length > 8) console.log(`     … ${arr.length - 8} more (--json)`);
  }
}
const fail = notOk.length || orphans.length || unreachable.length || tooDeep.length || fewCtx.length || broken.size
  || canonElsewhere.length || noindexed.length;
process.exit(fail ? 1 : 0);
