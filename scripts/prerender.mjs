/**
 * Post-build prerender.
 *
 * Renders every route via React 18's renderToPipeableStream from a Vite SSR
 * bundle (dist-ssr/entry-server.js), captures react-helmet-async tags, and
 * writes per-route static HTML to dist/<route>/index.html.
 *
 * No headless browser, no system Chromium dependency. Works identically on
 * macOS and Vercel's Linux build image.
 */
import { mkdirSync, writeFileSync, readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const distDir = join(root, 'dist');
const ssrEntry = join(root, 'dist-ssr', 'entry-server.js');

const STATIC_ROUTES = ['/', '/privacy-policy', '/terms-of-use', '/eula', '/about/karol-billik', '/blog'];
const PILLARS = [
  '/daily-scripture-lock-screen',
  '/prayer-life-iphone',
  '/faith-based-productivity',
  '/bible-study-tools-ios',
  '/christian-app-comparisons',
];
const COMPARISONS = [
  '/faithwall-vs-youversion',
  '/faithwall-vs-hallow',
  '/best-bible-verse-lock-screen-apps',
];

const posts = JSON.parse(
  readFileSync(join(root, 'src/data/blogPosts.json'), 'utf-8'),
).filter((p) => p.isPublished !== false);

const routes = [
  ...STATIC_ROUTES,
  ...PILLARS,
  ...COMPARISONS,
  ...posts.map((p) => `/blog/${p.slug}`),
];

function helmetToString(helmet) {
  if (!helmet) return '';
  return [
    helmet.title,
    helmet.priority,
    helmet.meta,
    helmet.link,
    helmet.script,
    helmet.style,
    helmet.base,
  ]
    .map((piece) => (piece && typeof piece.toString === 'function' ? piece.toString() : ''))
    .filter(Boolean)
    .join('\n');
}

async function prerender() {
  const template = readFileSync(join(distDir, 'index.html'), 'utf-8');
  const { render } = await import(pathToFileURL(ssrEntry).href);

  let succeeded = 0;
  let failed = 0;

  for (const route of routes) {
    try {
      const { html: appHtml, helmet } = await render(route);
      const helmetTags = helmetToString(helmet);

      const finalHtml = template
        .replace('</head>', `${helmetTags}\n</head>`)
        .replace('<div id="root"></div>', `<div id="root">${appHtml}</div>`);

      const outDir = route === '/' ? distDir : join(distDir, route.slice(1));
      mkdirSync(outDir, { recursive: true });
      writeFileSync(join(outDir, 'index.html'), finalHtml);

      succeeded += 1;
      console.log(`  ✓ ${route} (${(finalHtml.length / 1024).toFixed(1)}KB)`);
    } catch (err) {
      failed += 1;
      console.error(`  ✗ ${route}: ${err.message}`);
      if (err.stack) console.error(err.stack);
    }
  }

  console.log(`\nPrerender complete: ${succeeded} succeeded, ${failed} failed (of ${routes.length}).`);
  if (failed > 0) process.exit(1);
}

prerender().catch((err) => {
  console.error('Prerender failed:', err);
  process.exit(1);
});
