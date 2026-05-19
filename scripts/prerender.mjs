/**
 * Post-build prerender script.
 * Spins up Vite preview, visits each route with Chrome headless,
 * captures the rendered HTML, and writes it to dist/<route>/index.html.
 * This gives Google real HTML to crawl instead of an empty <div id="root">.
 *
 * Routes are dynamically derived: the 4 static pages + /blog + 5 pillars + every
 * published blog post slug from src/data/blogPosts.json.
 */
import { execSync, spawn } from 'child_process';
import { mkdirSync, writeFileSync, readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const distDir = join(__dirname, '..', 'dist');

const STATIC_ROUTES = ['/', '/privacy-policy', '/terms-of-use', '/eula', '/blog'];
const PILLARS = [
  '/daily-scripture-lock-screen',
  '/prayer-life-iphone',
  '/faith-based-productivity',
  '/bible-study-tools-ios',
  '/christian-app-comparisons',
];

const posts = JSON.parse(
  readFileSync(join(__dirname, '..', 'src/data/blogPosts.json'), 'utf-8')
).filter((p) => p.isPublished !== false);

const routes = [
  ...STATIC_ROUTES,
  ...PILLARS,
  ...posts.map((p) => `/blog/${p.slug}`),
];

const PORT = 4177;

async function prerender() {
  // Start preview server
  const server = spawn('npx', ['vite', 'preview', '--port', String(PORT)], {
    cwd: join(__dirname, '..'),
    stdio: 'pipe',
  });

  // Wait for server to start
  await new Promise((resolve) => {
    server.stdout.on('data', (data) => {
      if (data.toString().includes('Local:')) resolve(undefined);
    });
    setTimeout(resolve, 3000);
  });

  const chromePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

  try {
    for (const route of routes) {
      const url = `http://localhost:${PORT}${route}`;
      console.log(`Prerendering ${route}...`);

      // Use Chrome headless to dump DOM
      const html = execSync(
        `"${chromePath}" --headless=new --disable-gpu --dump-dom "${url}" 2>/dev/null`,
        { encoding: 'utf-8', timeout: 15000, maxBuffer: 10 * 1024 * 1024 }
      );

      // Write to dist/<route>/index.html
      const outDir = route === '/'
        ? distDir
        : join(distDir, route.slice(1));

      mkdirSync(outDir, { recursive: true });
      const outPath = join(outDir, 'index.html');

      // For the root route, we need to write a full HTML document
      const fullHtml = html.startsWith('<!') ? html : `<!DOCTYPE html>\n${html}`;
      writeFileSync(outPath, fullHtml);
      console.log(`  -> ${outPath} (${(fullHtml.length / 1024).toFixed(1)}KB)`);
    }
  } finally {
    server.kill();
  }

  console.log(`\nPrerendering complete! ${routes.length} routes have static HTML.`);
}

prerender().catch((err) => {
  console.error('Prerender failed:', err.message);
  console.log('Build succeeded but prerendering was skipped. Site will still work as a normal SPA.');
  process.exit(0); // Don't fail the build
});
