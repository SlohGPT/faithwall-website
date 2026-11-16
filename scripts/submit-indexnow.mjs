/**
 * Submits URLs to IndexNow (Bing, Yandex, Seznam, Naver).
 * Google does not participate: it picks up changes via sitemap + Search Console.
 *
 * Usage:
 *   node scripts/submit-indexnow.mjs https://faithwall.app/blog/post-1 [more urls]
 *   node scripts/submit-indexnow.mjs --latest          the newest published post (by date)
 *   node scripts/submit-indexnow.mjs --changed <base>  URLs whose source changed in `git diff <base>...HEAD`
 *   node scripts/submit-indexnow.mjs --all             every URL in public/sitemap.xml, one POST (<= 10,000)
 *   add --dry-run to print what would be sent without POSTing (always use it while testing)
 *
 * --changed maps changed files to URLs through one registry (see classify() below). Changes to
 * site-wide files (index.html, shared components, global CSS...) print "site-wide change: run --all"
 * and submit nothing for them. Every URL is filtered against the sitemap URL set.
 *
 * The key is stored in scripts/indexnow.config.json and the matching key verification file lives at
 * public/{key}.txt: both must be deployed for IndexNow to accept submissions.
 */
import { readFileSync, existsSync, statSync } from 'node:fs';
import { dirname, join, resolve, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

const config = JSON.parse(readFileSync(join(root, 'scripts/indexnow.config.json'), 'utf-8'));
const { host, key } = config;
const keyLocation = `https://${host}/${key}.txt`;
const origin = `https://${host}`;

const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const flagValue = (name) => {
  const i = args.indexOf(name);
  return i >= 0 ? args[i + 1] : undefined;
};

const readJson = (rel) => JSON.parse(readFileSync(join(root, rel), 'utf-8'));
const allPosts = () => readJson('src/data/blogPosts.json');

// ------------------------------------------------------------------ sitemap

function sitemapUrls() {
  const xml = readFileSync(join(root, 'public/sitemap.xml'), 'utf-8');
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());
}

// ------------------------------------------------------------------ git helpers

function git(gitArgs) {
  return execFileSync('git', gitArgs, { cwd: root, encoding: 'utf-8', maxBuffer: 256 * 1024 * 1024 });
}

/** Parsed JSON of a file at a git ref, or null when it does not exist there. */
function jsonAt(ref, rel) {
  try {
    return JSON.parse(git(['show', `${ref}:${rel}`]));
  } catch {
    return null;
  }
}

// ------------------------------------------------------------------ registry: changed file -> URLs

// Page components that map to exactly one public URL. A shared file that only one of these
// reaches (through imports) maps to that URL; a file several of them reach is site-wide.
const PAGE_ROUTES = {
  'src/pages/Home.tsx': ['/'],
  'src/pages/RandomVerse.tsx': ['/random-bible-verse'],
  'src/pages/WallpaperMaker.tsx': ['/bible-verse-wallpaper-maker'],
  'src/pages/Blog.tsx': ['/blog'],
  'src/pages/AuthorKarol.tsx': ['/about/karol-billik'],
  'src/pages/PrivacyPolicy.tsx': ['/privacy-policy'],
  'src/pages/TermsOfUse.tsx': ['/terms-of-use'],
  'src/pages/EULA.tsx': ['/eula'],
};
// Templates that render many URLs: a change there touches every post / pillar / compare page.
const TEMPLATE_PAGES = new Set(['src/pages/BlogPost.tsx', 'src/pages/Pillar.tsx', 'src/pages/Compare.tsx']);
// Not indexed, nothing to submit.
const NO_URL_PAGES = new Set(['src/pages/NotFound.tsx']);
// Always site-wide.
const SITE_WIDE_FILES = new Set([
  'index.html', 'src/index.css', 'src/App.tsx', 'src/main.tsx', 'src/entry-server.tsx',
  'tailwind.config.js', 'tailwind.config.ts', 'postcss.config.js', 'vercel.json',
]);

const SRC_EXT = ['', '.tsx', '.ts', '.json', '.css', '/index.tsx', '/index.ts'];

/** Reverse import graph of src/: file -> Set of files that import it (App/main/entry-server skipped). */
function buildReverseImports() {
  const files = git(['ls-files', 'src']).split('\n').filter((f) => /\.(tsx?|jsx?)$/.test(f));
  const reverse = new Map();
  const skip = new Set(['src/App.tsx', 'src/main.tsx', 'src/entry-server.tsx']);
  for (const f of files) {
    if (skip.has(f) || !existsSync(join(root, f))) continue;
    const text = readFileSync(join(root, f), 'utf-8');
    for (const m of text.matchAll(/(?:from|import)\s*\(?\s*['"](\.[^'"]+)['"]/g)) {
      const base = resolve(root, dirname(f), m[1]);
      const hit = SRC_EXT.map((e) => base + e).find(isFile);
      if (!hit) continue;
      const target = relative(root, hit).split('\\').join('/');
      if (!reverse.has(target)) reverse.set(target, new Set());
      reverse.get(target).add(f);
    }
  }
  return reverse;
}

function isFile(p) {
  try {
    return statSync(p).isFile();
  } catch {
    return false;
  }
}

/** Pages (src/pages/*) that transitively import `file`. */
function pagesReaching(file, reverse) {
  const seen = new Set([file]);
  const pages = new Set();
  const queue = [file];
  while (queue.length) {
    const cur = queue.pop();
    if (cur.startsWith('src/pages/')) pages.add(cur);
    for (const parent of reverse.get(cur) || []) {
      if (!seen.has(parent)) {
        seen.add(parent);
        queue.push(parent);
      }
    }
  }
  return pages;
}

const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);

function changedUrls(base) {
  git(['rev-parse', '--verify', '--quiet', `${base}^{commit}`]);
  const changed = git(['diff', '--name-only', `${base}...HEAD`]).split('\n').filter(Boolean);
  const urls = new Set();
  const siteWide = [];
  let reverse = null;
  const published = new Set(allPosts().filter((p) => p.isPublished !== false).map((p) => p.slug));

  for (const f of changed) {
    let m;
    if ((m = /^src\/data\/posts\/([^/]+)\.json$/.exec(f))) {
      if (published.has(m[1])) {
        urls.add(`/blog/${m[1]}`);
        urls.add('/blog');
      }
    } else if (f === 'src/data/blogPosts.json') {
      urls.add('/blog');
      const before = Object.fromEntries((jsonAt(base, f) || []).map((p) => [p.slug, p]));
      for (const p of readJson(f)) {
        if (p.isPublished !== false && !same(before[p.slug], p)) urls.add(`/blog/${p.slug}`);
      }
    } else if (f === 'src/data/pillars.json') {
      const before = jsonAt(base, f) || {};
      for (const [slug, v] of Object.entries(readJson(f))) if (!same(before[slug], v)) urls.add(`/${slug}`);
    } else if (f === 'src/data/comparisons.json') {
      const before = jsonAt(base, f) || {};
      for (const [k, v] of Object.entries(readJson(f))) if (!same(before[k], v)) urls.add(`/${v.slug || k}`);
    } else if (f === 'src/data/facts.json') {
      // rating.*-only changes never change page content that search engines index.
      const strip = (o) => (o ? { ...o, rating: undefined } : o);
      const before = jsonAt(base, f);
      if (!before || !same(strip(before), strip(readJson(f)))) siteWide.push(f);
    } else if (SITE_WIDE_FILES.has(f)) {
      siteWide.push(f);
    } else if (NO_URL_PAGES.has(f)) {
      // nothing
    } else if (TEMPLATE_PAGES.has(f)) {
      siteWide.push(f);
    } else if (PAGE_ROUTES[f]) {
      PAGE_ROUTES[f].forEach((u) => urls.add(u));
    } else if (/^src\/.+\.(tsx?|json)$/.test(f) && existsSync(join(root, f))) {
      reverse ??= buildReverseImports();
      const pages = [...pagesReaching(f, reverse)].filter((p) => !NO_URL_PAGES.has(p));
      if (pages.length === 0) continue; // not rendered by any page (scripts, types, unused data)
      const single = pages.length === 1 ? pages[0] : null;
      if (single && PAGE_ROUTES[single]) PAGE_ROUTES[single].forEach((u) => urls.add(u));
      else siteWide.push(f);
    }
  }
  return { urls: [...urls].map((p) => origin + (p === '/' ? '/' : p)), siteWide };
}

// ------------------------------------------------------------------ main

const positional = args.filter((a, i) => !a.startsWith('--') && args[i - 1] !== '--changed');
let urlList = [...positional];

if (args.length === 0) {
  console.error('Usage: node scripts/submit-indexnow.mjs <url> [url ...] | --latest | --changed <base> | --all  [--dry-run]');
  process.exit(1);
}

if (args.includes('--latest')) {
  const published = allPosts().filter((p) => p.isPublished !== false);
  if (published.length === 0) {
    console.error('No published posts found in src/data/blogPosts.json');
    process.exit(1);
  }
  const stamp = (p) => p.datePublished || p.date || '';
  const newest = published.reduce((a, b) => (stamp(b) > stamp(a) ? b : a));
  urlList.push(`${origin}/blog/${newest.slug}`);
}

if (args.includes('--changed')) {
  const base = flagValue('--changed');
  if (!base || base.startsWith('--')) {
    console.error('--changed needs a base ref, e.g. --changed origin/main');
    process.exit(1);
  }
  let result;
  try {
    result = changedUrls(base);
  } catch (e) {
    console.error(`Cannot diff against "${base}": ${String(e.message).split('\n')[0]}`);
    process.exit(1);
  }
  for (const f of result.siteWide) console.log(`site-wide change: run --all (${f})`);
  // Only --changed output is filtered against the sitemap; explicit URLs and --latest are kept as given.
  const listed = new Set(sitemapUrls());
  for (const u of result.urls) {
    if (listed.has(u)) urlList.push(u);
    else console.log(`skipped (not in sitemap): ${u}`);
  }
}

if (args.includes('--all')) {
  urlList.push(...sitemapUrls());
}

urlList = [...new Set(urlList)];

if (urlList.length === 0) {
  console.log('IndexNow: nothing to submit.');
  process.exit(0);
}
if (urlList.length > 10000) {
  console.error(`IndexNow accepts at most 10,000 URLs per POST (got ${urlList.length}).`);
  process.exit(1);
}

console.log(`IndexNow → ${dryRun ? 'DRY RUN, would submit' : 'submitting'} ${urlList.length} URL(s) to ${host}:`);
for (const u of urlList) console.log(`  ${u}`);

if (dryRun) process.exit(0);

const body = { host, key, keyLocation, urlList };
const res = await fetch('https://api.indexnow.org/IndexNow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify(body),
});

const text = await res.text();
console.log(`\nIndexNow response: ${res.status} ${res.statusText}`);
if (text) console.log(text);

// 200/202 = accepted; 422 = invalid URL / not the same host; 403 = key file invalid
if (res.status >= 200 && res.status < 300) {
  console.log('✓ Submission accepted. Bing/Yandex/Seznam/Naver will crawl shortly.');
  process.exit(0);
} else {
  console.error(`✗ Submission failed (status ${res.status}).`);
  if (res.status === 403) {
    console.error('  Key file probably not yet deployed. Wait for Vercel deploy and retry.');
  }
  process.exit(1);
}
