/**
 * Responsive variants of the blog covers (and the small icon/avatars).
 *
 * For every public/blog-thumbnails/<name>.jpg it writes next to the original:
 *   <name>-<w>.avif  (quality 50, effort 4)
 *   <name>-<w>.webp  (quality 72)
 * for w in WIDTHS, and records which widths exist in src/data/coverVariants.json
 * ({ "<name>": [240, 480, ...] }). The components (src/lib/covers.ts) read that
 * manifest: a cover that has no entry (a new autopilot post before this script
 * ran) renders the plain jpg, so a missing variant never breaks a page.
 *
 * The original jpgs are never re-encoded or touched (og:image, the <img> fallback
 * and the Article schema point at them). Idempotent: an output newer than its
 * source is skipped. Not part of `npm run build` (Vercel build minutes): run it
 * locally and commit the output.
 *
 *   node scripts/build-blog-image-variants.mjs             # every cover + small images
 *   node scripts/build-blog-image-variants.mjs <name>...   # only these covers (file name without .jpg)
 *   node scripts/build-blog-image-variants.mjs --force     # re-encode everything
 *   node scripts/build-blog-image-variants.mjs --manifest  # only rewrite the manifest from disk
 *
 * Small images (same script, same idempotence): public/icon-app-80.webp (nav and footer
 * logo, from icon-app-180.png) and public/assets/avatars/avatar-N-72.webp (hero avatars).
 */
import { existsSync, readdirSync, statSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

// sharp is deliberately NOT a dependency of the repo. Install it outside the tree and point
// SHARP_DIR at that prefix:  npm i --prefix /tmp/sharp sharp && SHARP_DIR=/tmp/sharp node scripts/...
// (--manifest does not need sharp.)
let sharp;
if (!process.argv.includes('--manifest')) {
  const req = createRequire(join(process.env.SHARP_DIR || process.cwd(), 'noop.js'));
  try {
    sharp = req('sharp');
  } catch {
    console.error('sharp not found. Install it outside the repo (npm i --prefix <dir> sharp) and set SHARP_DIR=<dir>.');
    process.exit(1);
  }
}

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dir = join(root, 'public/blog-thumbnails');
const manifestPath = join(root, 'src/data/coverVariants.json');

const WIDTHS = [240, 480, 640, 960, 1280];
const AVIF = { quality: 50, effort: 4 };
const WEBP = { quality: 72 };

const args = process.argv.slice(2);
const force = args.includes('--force');
const manifestOnly = args.includes('--manifest');
const names = args.filter((a) => !a.startsWith('--')).map((a) => a.replace(/^.*\//, '').replace(/\.jpg$/, ''));

const mtime = (p) => (existsSync(p) ? statSync(p).mtimeMs : 0);
const fresh = (out, src) => !force && mtime(out) >= mtime(src) && existsSync(out);

let made = 0;
let skipped = 0;

async function encode(src, out, w, fmt) {
  if (fresh(out, src)) {
    skipped += 1;
    return;
  }
  const img = sharp(src).resize({ width: w, withoutEnlargement: true });
  await (fmt === 'avif' ? img.avif(AVIF) : img.webp(WEBP)).toFile(out);
  made += 1;
}

const covers = readdirSync(dir)
  .filter((f) => f.endsWith('.jpg'))
  .map((f) => f.slice(0, -4));

if (!manifestOnly) {
  for (const name of covers) {
    if (names.length && !names.includes(name)) continue;
    const src = join(dir, `${name}.jpg`);
    for (const w of WIDTHS) {
      await encode(src, join(dir, `${name}-${w}.avif`), w, 'avif');
      await encode(src, join(dir, `${name}-${w}.webp`), w, 'webp');
    }
  }

  // Nav and footer logo (shown at 36 to 40 px): 80 px WebP. The 180/512 png stay for the manifest and apple-touch-icon.
  const icon = join(root, 'public/icon-app-180.png');
  const iconOut = join(root, 'public/icon-app-80.webp');
  if (!fresh(iconOut, icon)) {
    await sharp(icon).resize(80, 80).webp({ quality: 85 }).toFile(iconOut);
    made += 1;
  }

  // Hero avatars (shown at 36 px, object-cover): centre-cropped 72 px squares, same look.
  for (const n of [1, 2, 3]) {
    const src = join(root, `public/assets/avatars/avatar-${n}.jpg`);
    const out = join(root, `public/assets/avatars/avatar-${n}-72.webp`);
    if (fresh(out, src)) continue;
    await sharp(src).resize(72, 72, { fit: 'cover', position: 'centre' }).webp({ quality: 80 }).toFile(out);
    made += 1;
  }
}

// Manifest from what is on disk: a width is listed only when both formats exist.
const files = new Set(readdirSync(dir));
const manifest = {};
for (const name of covers) {
  const have = WIDTHS.filter((w) => files.has(`${name}-${w}.avif`) && files.has(`${name}-${w}.webp`));
  if (have.length) manifest[name] = have;
}
const json = JSON.stringify(manifest, null, 1).replace(/\[\s+([\d,\s]+?)\s+\]/g, (_, nums) => `[${nums.replace(/\s+/g, ' ')}]`);
writeFileSync(manifestPath, json + '\n');

console.log(
  `covers: ${covers.length}, with variants: ${Object.keys(manifest).length}; encoded ${made}, up to date ${skipped}; manifest src/data/coverVariants.json`,
);
const missing = covers.filter((c) => !manifest[c]);
if (missing.length) console.log(`no variants yet (fall back to the jpg): ${missing.join(', ')}`);
