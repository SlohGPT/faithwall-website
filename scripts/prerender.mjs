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

const STATIC_ROUTES = ['/', '/privacy-policy', '/terms-of-use', '/eula', '/about/karol-billik', '/blog', '/random-bible-verse', '/bible-verse-wallpaper-maker'];
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
  let template = readFileSync(join(distDir, 'index.html'), 'utf-8');

  // Inline the built stylesheet (about 12 KB gzip) in place of the render-blocking <link>, so first paint does not wait
  // for a second request. Done once on the template, so every route and 404.html get it. Fonts use absolute /fonts/ urls,
  // so the CSS is path-independent. Falls back to the plain <link> if the file or the tag is not found.
  template = template.replace(
    /<link rel="stylesheet"[^>]*href="(\/assets\/[^"]+\.css)"[^>]*>/,
    (tag, href) => {
      try {
        const css = readFileSync(join(distDir, href), 'utf-8').trim();
        if (css.includes('</style')) return tag;
        return `<style>${css}</style>`;
      } catch {
        return tag;
      }
    },
  );
  const { render } = await import(pathToFileURL(ssrEntry).href);

  let succeeded = 0;
  let failed = 0;

  for (const route of routes) {
    try {
      const { html: appHtml, helmet } = await render(route);
      const helmetTags = helmetToString(helmet);

      // React 18.3.1's stream writer can flush its whole 2048-byte buffer when a
      // multi-byte char (e.g. an em dash) doesn't fit, emitting 1-2 unused zero
      // bytes. Real content never contains NUL, so strip them.
      const finalHtml = template
        .replace('</head>', `${helmetTags}\n</head>`)
        .replace('<div id="root"></div>', `<div id="root">${appHtml}</div>`)
        .replace(/\0/g, '');

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

  // dist/404.html: Vercel serves it with status 404 for any path that has no file in dist
  // (the catch-all rewrite is gone). Rendered from a path no route matches, so the `*` route
  // (NotFound) wins. The root is flagged so src/main.tsx renders it instead of hydrating.
  try {
    const { html: appHtml, helmet } = await render('/__not-found__');
    // The template and NotFound's Helmet each carry a robots meta: drop both and write exactly one.
    const helmetTags = helmetToString(helmet)
      .replace(/<meta\b[^>]*\bname="robots"[^>]*>/gi, '')
      .replace(/<link\b[^>]*\brel="canonical"[^>]*>/gi, '');
    const finalHtml = template
      .replace(/<meta\s+name="robots"[^>]*>\s*/i, '')
      .replace('</head>', `<meta name="robots" content="noindex, follow" />\n${helmetTags}\n</head>`)
      .replace('<div id="root"></div>', `<div id="root" data-not-found="1">${appHtml}</div>`)
      .replace(/\0/g, '');
    writeFileSync(join(distDir, '404.html'), finalHtml);
    console.log(`  ✓ 404.html (${(finalHtml.length / 1024).toFixed(1)}KB)`);
  } catch (err) {
    failed += 1;
    console.error(`  ✗ 404.html: ${err.message}`);
    if (err.stack) console.error(err.stack);
  }

  console.log(`\nPrerender complete: ${succeeded} succeeded, ${failed} failed (of ${routes.length} routes + 404.html).`);
  if (failed > 0) process.exit(1);
}

prerender().catch((err) => {
  console.error('Prerender failed:', err);
  process.exit(1);
});
