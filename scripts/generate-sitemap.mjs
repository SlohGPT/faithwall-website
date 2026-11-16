/**
 * Builds public/sitemap.xml from the blog post registry + pillar list.
 * Runs before `vite build` so the static asset is up to date with the latest posts.
 */
import { readFileSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

const SITE = 'https://faithwall.app';

// Real last-edit dates per route. Bump when content materially changes —
// Google ignores `lastmod` that always equals "today".
//
// AGENTS: these are hardcoded because static pages have no dateModified field
// to read. If a queue item changes a static route's title, meta, schema, or
// copy, bump that route's lastmod here IN THE SAME COMMIT (SEO-STRATEGY §6).
// Nothing else can do it for you — the generator cannot detect the edit.
const STATIC_ROUTES = [
  { path: '/', lastmod: '2026-11-16', changefreq: 'weekly', priority: '1.0' },
  { path: '/random-bible-verse', lastmod: '2026-11-16', changefreq: 'monthly', priority: '0.7' },
  { path: '/bible-verse-wallpaper-maker', lastmod: '2026-11-16', changefreq: 'monthly', priority: '0.8' },
  { path: '/blog', lastmod: '2026-05-19', changefreq: 'weekly', priority: '0.9' },
  { path: '/about/karol-billik', lastmod: '2026-05-19', changefreq: 'monthly', priority: '0.5' },
  { path: '/privacy-policy', lastmod: '2026-10-02', changefreq: 'monthly', priority: '0.3' },
  { path: '/terms-of-use', lastmod: '2026-10-02', changefreq: 'monthly', priority: '0.3' },
  { path: '/eula', lastmod: '2026-11-16', changefreq: 'monthly', priority: '0.3' },
];

const pillarsData = JSON.parse(
  readFileSync(join(root, 'src/data/pillars.json'), 'utf-8')
);

const PILLARS = [
  'daily-scripture-lock-screen',
  'prayer-life-iphone',
  'faith-based-productivity',
  'bible-study-tools-ios',
  'christian-app-comparisons',
];

const comparisons = JSON.parse(
  readFileSync(join(root, 'src/data/comparisons.json'), 'utf-8')
);

const posts = JSON.parse(
  readFileSync(join(root, 'src/data/blogPosts.json'), 'utf-8')
).filter((p) => p.isPublished !== false);

// Google image sitemap entries (full-size files only), keyed by page path.
// Source of truth is src/data/wallpaperGallery.json (written by
// scripts/build-wallpaper-gallery.mjs).
const gallery = JSON.parse(
  readFileSync(join(root, 'src/data/wallpaperGallery.json'), 'utf-8')
);
const IMAGES = {
  '/bible-verse-wallpaper-maker': gallery.map((g) => `${SITE}${g.file}`),
};

// No Date-based lastmod: a URL without a known date gets no <lastmod> and a
// warning, so the file is deterministic and never claims "modified today".
const warnings = [];

function dateOnly(value) {
  const d = String(value || '').slice(0, 10);
  return /^\d{4}-\d{2}-\d{2}$/.test(d) ? d : '';
}

function urlBlock(loc, lastmod, changefreq, priority) {
  if (!lastmod) warnings.push(loc);
  const images = (IMAGES[loc] || [])
    .map((src) => `
    <image:image>
      <image:loc>${src}</image:loc>
    </image:image>`)
    .join('');
  return `  <url>
    <loc>${SITE}${loc}</loc>
${lastmod ? `    <lastmod>${lastmod}</lastmod>\n` : ''}    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>${images}
  </url>`;
}

// /blog changes when a post is published or edited: use the newest published post date.
const newestPostDate = posts
  .map((p) => dateOnly(p.dateModified) || dateOnly(p.datePublished))
  .filter(Boolean)
  .sort()
  .pop();

const blocks = [
  ...STATIC_ROUTES.map((r) =>
    urlBlock(r.path, r.path === '/blog' ? newestPostDate : r.lastmod, r.changefreq, r.priority)
  ),
  ...PILLARS.map((p) => {
    const pillar = pillarsData[p] || {};
    const lastmod = dateOnly(pillar.dateModified) || dateOnly(pillar.datePublished);
    return urlBlock(`/${p}`, lastmod, 'monthly', '0.9');
  }),
  ...Object.values(comparisons).map((c) => {
    const lastmod = dateOnly(c.dateModified) || dateOnly(c.datePublished);
    return urlBlock(`/${c.slug}`, lastmod, 'monthly', '0.8');
  }),
  ...posts.map((p) => {
    const lastmod = dateOnly(p.dateModified) || dateOnly(p.datePublished);
    return urlBlock(`/blog/${p.slug}`, lastmod, 'monthly', '0.7');
  }),
];

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${blocks.join('\n')}
</urlset>
`;

const out = join(root, 'public/sitemap.xml');
writeFileSync(out, xml);
for (const loc of warnings) console.warn(`WARNING: no known date for ${loc}; written without <lastmod>`);
console.log(`Sitemap written: ${out} (${STATIC_ROUTES.length} static + ${PILLARS.length} pillars + ${posts.length} posts)`);
