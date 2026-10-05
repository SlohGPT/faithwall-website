/**
 * Renders the ready-made Bible verse wallpapers shown in the gallery on
 * /bible-verse-wallpaper-maker, as real image files Google Images can index.
 *
 * It imports the SAME layout + drawing code the in-browser maker uses
 * (src/lib/wallpaper.ts: style presets, text fitting, iPhone lock-screen safe
 * area), so the files match what the tool produces. Node 22.18+ runs the .ts
 * file directly (type stripping).
 *
 * Fonts: the maker's stacks start with Georgia (proprietary) and DM Sans. In
 * this script Georgia is replaced by Gelasio, the OFL, metric-compatible
 * Georgia substitute; DM Sans is the same face the site self-hosts. Static
 * instances live in scripts/fonts/ with their OFL licenses.
 *
 * Verse text is read from public/bible/kjv/*.json (public-domain KJV) by
 * reference; nothing is typed from memory.
 *
 * This is a manual, occasional build step. Its outputs are committed:
 *   public/wallpapers/*.jpg, public/wallpapers/*-thumb.webp, src/data/wallpaperGallery.json
 * The dependencies are NOT in package.json (so the Vercel build is unaffected).
 * Run from the repo root:
 *
 *   npm ci && npm install --no-save @napi-rs/canvas sharp && node scripts/build-wallpaper-gallery.mjs
 *
 * (`npm install --no-save` after `npm ci` is required, or the extra packages are
 * pruned again by the next `npm ci`.)
 */
import { readFileSync, writeFileSync, mkdirSync, rmSync, statSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { createCanvas, GlobalFonts } from '@napi-rs/canvas';
import sharp from 'sharp';
import {
  SIZE_PRESETS,
  STYLE_PRESETS,
  drawWallpaper,
  referenceLine,
} from '../src/lib/wallpaper.ts';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const outDir = join(root, 'public/wallpapers');
const TRANSLATION = 'KJV';

GlobalFonts.registerFromPath(join(root, 'scripts/fonts/Gelasio-Regular.ttf'), 'Gelasio');
GlobalFonts.registerFromPath(join(root, 'scripts/fonts/Gelasio-Italic.ttf'), 'Gelasio');
GlobalFonts.registerFromPath(join(root, 'scripts/fonts/DMSans-Medium.ttf'), 'DM Sans');
GlobalFonts.registerFromPath(join(root, 'scripts/fonts/DMSans-Bold.ttf'), 'DM Sans');

// [reference, theme, style id, size id, optional alt-text lead-in]
const PLAN = [
  ['Philippians 4:13', 'strength', 'black', 'iphone'],
  ['Psalm 46:1', 'strength', 'navy-gold', 'iphone'],
  ['Isaiah 26:3', 'peace', 'dark-gradient', 'iphone'],
  ['Philippians 4:7', 'peace', 'minimal-white', 'iphone'],
  ['1 Peter 5:7', 'anxiety', 'bold-sans', 'iphone'],
  ['2 Timothy 1:7', 'fear', 'black', 'iphone'],
  ['Romans 8:28', 'hope', 'navy-gold', 'iphone'],
  ['Jeremiah 29:11', 'hope', 'sunrise', 'iphone'],
  ['1 Corinthians 13:13', 'love', 'cream', 'iphone'],
  ['John 3:16', 'love', 'dark-gradient', 'iphone'],
  ['Proverbs 3:5', 'trust', 'black', 'iphone'],
  ['Psalm 31:24', 'courage', 'bold-sans', 'iphone'],
  ['1 Thessalonians 5:18', 'gratitude', 'sunrise', 'iphone'],
  ['Isaiah 41:10', 'strength', 'black', 'desktop-4k'],
  ['Joshua 1:9', 'courage', 'bold-sans', 'desktop-4k'],
  ['Psalm 23:1', 'trust', 'navy-gold', 'desktop-4k'],
  // 2026-10-05 (p48): themes from Google Images queries for the maker page.
  ['Psalm 23:1', 'trust', 'navy-gold', 'iphone', 'The Lord is my shepherd'],
  ['Psalm 46:10', 'peace', 'black', 'iphone', 'Be still, and know that I am God'],
  ['Isaiah 41:10', 'fear', 'dark-gradient', 'iphone', 'Fear thou not; for I am thy God'],
  ['Psalm 119:105', 'trust', 'cream', 'iphone', 'Thy word is a lamp unto my feet'],
  ['Genesis 22:14', 'trust', 'minimal-white', 'iphone', 'Jehovah-jireh'],
  ['Psalm 46:10', 'peace', 'cream', 'desktop-4k', 'Be still, and know that I am God'],
  ['Matthew 11:28', 'anxiety', 'dark-gradient', 'desktop-4k', 'Come unto me and I will give you rest'],
  ['Isaiah 40:31', 'strength', 'sunrise', 'desktop-4k', 'They that wait upon the Lord shall renew their strength'],
];

const BG_WORDS = {
  black: 'pure black',
  'dark-gradient': 'dark indigo gradient',
  sunrise: 'purple-to-gold sunrise gradient',
  cream: 'cream paper',
  'navy-gold': 'navy and gold',
  'minimal-white': 'clean white',
  'bold-sans': 'near-black with an orange accent',
};

// Swap the proprietary/system stacks for the vendored open fonts.
const FAMILY = (id, s) => (s.family.startsWith('Georgia') ? 'Gelasio' : '"DM Sans"');

const bibleIndex = JSON.parse(readFileSync(join(root, 'public/bible/index.json'), 'utf-8'));
function kjvText(ref) {
  const m = ref.match(/^(.*) (\d+):(\d+)$/);
  if (!m) throw new Error(`Bad ref ${ref}`);
  const name = m[1] === 'Psalm' ? 'Psalms' : m[1];
  const book = bibleIndex.books.find((b) => b.name === name);
  if (!book) throw new Error(`Unknown book in ${ref}`);
  const data = JSON.parse(readFileSync(join(root, `public/bible/kjv/${book.file}.json`), 'utf-8'));
  const text = data[Number(m[2]) - 1]?.[Number(m[3]) - 1];
  if (!text) throw new Error(`No KJV text for ${ref}`);
  return text.trim();
}

const slugify = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

rmSync(outDir, { recursive: true, force: true });
mkdirSync(outDir, { recursive: true });

const gallery = [];
let totalBytes = 0;

for (const [ref, theme, styleId, sizeId, altLead] of PLAN) {
  const size = SIZE_PRESETS.find((s) => s.id === sizeId);
  const base = STYLE_PRESETS.find((s) => s.id === styleId);
  if (!size || !base) throw new Error(`Bad plan row ${ref}`);
  const style = { ...base, family: FAMILY(styleId, base) };
  const text = kjvText(ref);

  const canvas = createCanvas(size.width, size.height);
  const ctx = canvas.getContext('2d');
  const fit = drawWallpaper(ctx, {
    text,
    reference: referenceLine(ref, TRANSLATION),
    size,
    style,
    position: 'middle',
  });
  if (fit.overflow) throw new Error(`Text overflow for ${ref}`);

  const device = size.phone ? 'iphone' : 'desktop';
  const slug = `${slugify(ref)}-${styleId}-${size.phone ? 'iphone' : 'desktop-4k'}`;
  const file = `bible-verse-wallpaper-${slug}.jpg`;
  const thumb = `bible-verse-wallpaper-${slug}-thumb.webp`;

  const png = canvas.toBuffer('image/png');
  const jpg = await sharp(png).jpeg({ quality: 82, progressive: true, mozjpeg: true }).toBuffer();
  const thumbBuf = await sharp(png).resize({ width: 360 }).webp({ quality: 78 }).toBuffer();
  const thumbMeta = await sharp(thumbBuf).metadata();
  writeFileSync(join(outDir, file), jpg);
  writeFileSync(join(outDir, thumb), thumbBuf);
  totalBytes += jpg.length + thumbBuf.length;

  const deviceWords = size.phone ? 'iPhone lock screen wallpaper' : '4K desktop and laptop wallpaper';
  gallery.push({
    slug,
    ref,
    text,
    translation: TRANSLATION,
    theme,
    style: styleId,
    device,
    width: size.width,
    height: size.height,
    file: `/wallpapers/${file}`,
    thumb: `/wallpapers/${thumb}`,
    thumbWidth: thumbMeta.width,
    thumbHeight: thumbMeta.height,
    alt: `${altLead ? `${altLead}: ` : ''}${ref} ${TRANSLATION} Bible verse ${deviceWords} on a ${BG_WORDS[styleId]} background`,
  });
  console.log(`${file}  ${(jpg.length / 1024).toFixed(0)} KB  font ${fit.fontSize}px  ${fit.lines.length} lines`);
}

writeFileSync(join(root, 'src/data/wallpaperGallery.json'), JSON.stringify(gallery, null, 2) + '\n');
console.log(`\n${gallery.length} wallpapers, ${(totalBytes / 1024 / 1024).toFixed(2)} MB total (full-size + thumbnails)`);
