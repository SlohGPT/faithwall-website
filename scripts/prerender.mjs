/**
 * Post-build prerender.
 * Spins up `vite preview`, visits every route with Puppeteer's bundled Chromium,
 * captures the fully-rendered DOM (so react-helmet-async tags are inlined),
 * and writes per-route static HTML to dist/<route>/index.html.
 *
 * Works locally (macOS) and on Vercel's Linux build — Puppeteer downloads
 * its own Chromium during `npm install`, so there's no hardcoded system path.
 *
 * Routes are derived from: 4 static pages + /blog + 5 pillars + every
 * published blog post slug from src/data/blogPosts.json.
 */
import { spawn } from 'child_process';
import { mkdirSync, writeFileSync, readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import puppeteer from 'puppeteer';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const distDir = join(root, 'dist');

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
  readFileSync(join(root, 'src/data/blogPosts.json'), 'utf-8')
).filter((p) => p.isPublished !== false);

const routes = [
  ...STATIC_ROUTES,
  ...PILLARS,
  ...COMPARISONS,
  ...posts.map((p) => `/blog/${p.slug}`),
];

const PORT = 4177;

function waitForServer(server) {
  return new Promise((resolve, reject) => {
    let resolved = false;
    const onData = (data) => {
      const s = data.toString();
      if (s.includes('Local:') && !resolved) {
        resolved = true;
        resolve();
      }
    };
    server.stdout.on('data', onData);
    server.stderr.on('data', onData);
    setTimeout(() => {
      if (!resolved) {
        resolved = true;
        // Best-effort: server may have started without printing the expected line
        resolve();
      }
    }, 8000);
    server.on('exit', (code) => {
      if (!resolved) reject(new Error(`vite preview exited early (code ${code})`));
    });
  });
}

async function prerender() {
  const server = spawn('npx', ['vite', 'preview', '--port', String(PORT), '--strictPort'], {
    cwd: root,
    stdio: 'pipe',
  });

  await waitForServer(server);

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
  });

  let succeeded = 0;
  let failed = 0;

  try {
    for (const route of routes) {
      const url = `http://localhost:${PORT}${route}`;
      const page = await browser.newPage();
      try {
        await page.goto(url, { waitUntil: 'networkidle0', timeout: 20000 });
        // Give react-helmet-async one more tick to flush async chunks
        await new Promise((r) => setTimeout(r, 250));
        const html = await page.content();

        const outDir = route === '/' ? distDir : join(distDir, route.slice(1));
        mkdirSync(outDir, { recursive: true });
        const outPath = join(outDir, 'index.html');
        writeFileSync(outPath, html);

        succeeded += 1;
        console.log(`  ✓ ${route} (${(html.length / 1024).toFixed(1)}KB)`);
      } catch (err) {
        failed += 1;
        console.error(`  ✗ ${route}: ${err.message}`);
      } finally {
        await page.close();
      }
    }
  } finally {
    await browser.close();
    server.kill();
  }

  console.log(`\nPrerender complete: ${succeeded} succeeded, ${failed} failed (of ${routes.length}).`);
  if (failed === routes.length) process.exit(1);
}

prerender().catch((err) => {
  console.error('Prerender failed:', err);
  process.exit(1);
});
