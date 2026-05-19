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
const today = new Date().toISOString().slice(0, 10);

const STATIC_ROUTES = [
  { path: '/', changefreq: 'weekly', priority: '1.0' },
  { path: '/blog', changefreq: 'weekly', priority: '0.9' },
  { path: '/privacy-policy', changefreq: 'monthly', priority: '0.3' },
  { path: '/terms-of-use', changefreq: 'monthly', priority: '0.3' },
  { path: '/eula', changefreq: 'monthly', priority: '0.3' },
];

const PILLARS = [
  'daily-scripture-lock-screen',
  'prayer-life-iphone',
  'faith-based-productivity',
  'bible-study-tools-ios',
  'christian-app-comparisons',
];

const posts = JSON.parse(
  readFileSync(join(root, 'src/data/blogPosts.json'), 'utf-8')
).filter((p) => p.isPublished !== false);

function urlBlock(loc, lastmod, changefreq, priority) {
  return `  <url>
    <loc>${SITE}${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

const blocks = [
  ...STATIC_ROUTES.map((r) => urlBlock(r.path, today, r.changefreq, r.priority)),
  ...PILLARS.map((p) => urlBlock(`/${p}`, today, 'monthly', '0.9')),
  ...posts.map((p) => {
    const lastmod = (p.datePublished || '').slice(0, 10) || today;
    return urlBlock(`/blog/${p.slug}`, lastmod, 'monthly', '0.7');
  }),
];

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${blocks.join('\n')}
</urlset>
`;

const out = join(root, 'public/sitemap.xml');
writeFileSync(out, xml);
console.log(`Sitemap written: ${out} (${STATIC_ROUTES.length} static + ${PILLARS.length} pillars + ${posts.length} posts)`);
