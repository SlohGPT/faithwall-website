/**
 * Renders the blog covers (v2, 2026-11-18, the faithwall-covers skill): a short HOOK with one orange accent
 * word, a topic pill with an icon and an optional badge on the left; on the right a tilted iPhone whose lock
 * screen shows the post's KJV verse in one of the wallpaper styles. The layout comes from
 * scripts/cover-engine.mjs, which is the same file on all three app sites. One 1600x1067 jpg per post (the
 * cards and the post hero crop to 16:9, so everything important sits in the centre band).
 *
 * Input:  src/data/blogCovers.json  ({slug, ref, palette, hook, tag, icon, badge?, layout?} per post)
 * Output: public/blog-thumbnails/<ref>-bible-verse-iphone-wallpaper.jpg
 *         and, in the same blogCovers.json, the resolved text / file / alt.
 *         It also points each post's meta.image + meta.imageAlt and its
 *         blogPosts.json thumbnail + thumbnailAlt at the new file, drops the
 *         Unsplash credit for that post, and deletes the old cover file.
 *
 * Verse text comes from public/bible/kjv by reference (never typed). Palettes
 * reuse the wallpaper maker's STYLE_PRESETS (src/lib/wallpaper.ts) plus a few
 * extra brand gradients below. Fonts are the vendored OFL files in
 * scripts/fonts (same as build-wallpaper-gallery.mjs).
 *
 * Rendering: headless Google Chrome driven over CDP (Node's built-in fetch +
 * WebSocket, no npm dependencies). macOS path by default; set CHROME_PATH to
 * override. Not used on Vercel and not in `npm run build`: outputs are committed.
 *
 *   node scripts/build-blog-thumbnails.mjs            # all covers
 *   node scripts/build-blog-thumbnails.mjs <slug>...  # only these posts
 *
 * Posts in SKIP are never touched (ranking measurement).
 */
import { readFileSync, writeFileSync, rmSync, existsSync, readdirSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import * as Lucide from 'lucide-react';
import { STYLE_PRESETS } from '../src/lib/wallpaper.ts';
import { launch, coverHtml, esc, LAYOUT_NAMES } from './cover-engine.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const TRANSLATION = 'KJV';
const SKIP = new Set(['best-free-bible-app-iphone']);

const coversPath = join(root, 'src/data/blogCovers.json');
const listingPath = join(root, 'src/data/blogPosts.json');
const postPath = (slug) => join(root, `src/data/posts/${slug}.json`);

// ---------- palettes ----------
const preset = (id) => STYLE_PRESETS.find((s) => s.id === id);
const SERIF = "'Gelasio', Georgia, serif";
const SANS = "'DM Sans', system-ui, sans-serif";
const BRAND = '#D97B3B';
const BRAND_LIGHT = '#E9A06A';

function fromPreset(id, extra = {}) {
  const p = preset(id);
  return {
    bg: p.background.length === 1 ? p.background[0] : `linear-gradient(180deg, ${p.background.join(', ')})`,
    text: p.textColor,
    ref: p.refColor,
    time: p.textColor,
    family: p.family.startsWith('Georgia') ? SERIF : SANS,
    weight: p.weight,
    italic: p.italic,
    upper: p.uppercaseRef,
    shadow: p.shadow,
    glow: BRAND,
    ...extra,
  };
}
const own = (bg, glow, extra = {}) => ({
  bg, glow, text: '#ffffff', ref: BRAND_LIGHT, time: '#ffffff',
  family: SERIF, weight: 400, italic: false, upper: false, ...extra,
});

const PALETTES = {
  'black-ember': own('#000000', BRAND, { ref: BRAND_LIGHT }),
  'dark-gradient': fromPreset('dark-gradient', { glow: '#6a5cff' }),
  sunrise: fromPreset('sunrise', { glow: '#d2603c' }),
  'navy-gold': fromPreset('navy-gold', { glow: '#3a63c9', time: '#ecd48a' }),
  ember: own('linear-gradient(180deg, #1a0c05 0%, #4a2210 45%, #9a4a1d 78%, #d97b3b 100%)', BRAND, { ref: '#ffe2c4' }),
  plum: own('linear-gradient(180deg, #140a1f 0%, #3b1646 50%, #8a3a55 80%, #e08a5a 100%)', '#b5487a', { ref: '#ffd9bf', italic: true }),
  cream: fromPreset('cream', { glow: BRAND, ref: '#b4561f', time: '#2b2118' }),
  'charcoal-orange': fromPreset('bold-sans', {
    bg: 'linear-gradient(160deg, #0a0a0f 55%, #2a170b 100%)', ref: BRAND, glow: BRAND, time: '#ffffff',
  }),
  dusk: own('linear-gradient(180deg, #0b1424 0%, #1d2f52 48%, #5b5a8a 78%, #e9a06a 100%)', '#5b7fd6', { ref: '#ffe6cf', family: SANS, weight: 500 }),
  sand: own('linear-gradient(180deg, #f6ead7 0%, #ecd3ae 100%)', BRAND, {
    text: '#2b2118', ref: '#b4561f', time: '#2b2118',
  }),
};

// ---------- verse lookup ----------
const bibleIndex = JSON.parse(readFileSync(join(root, 'public/bible/index.json'), 'utf-8'));
function kjvText(ref) {
  const m = ref.match(/^(.*) (\d+):(\d+)$/);
  if (!m) throw new Error(`Bad ref ${ref} (single verses only)`);
  const name = m[1] === 'Psalm' ? 'Psalms' : m[1];
  const book = bibleIndex.books.find((b) => b.name === name);
  if (!book) throw new Error(`Unknown book in ${ref}`);
  const data = JSON.parse(readFileSync(join(root, `public/bible/kjv/${book.file}.json`), 'utf-8'));
  const text = data[Number(m[2]) - 1]?.[Number(m[3]) - 1];
  if (!text) throw new Error(`No KJV text for ${ref}`);
  return text.trim().replace(/\s+/g, ' ');
}
const slugify = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

// ---------- brand + lock screen ----------
const b64 = (p) => readFileSync(join(root, p)).toString('base64');
const FONT_CSS = `
@font-face{font-family:'Gelasio';font-weight:400;font-style:normal;src:url(data:font/ttf;base64,${b64('scripts/fonts/Gelasio-Regular.ttf')})}
@font-face{font-family:'Gelasio';font-weight:400;font-style:italic;src:url(data:font/ttf;base64,${b64('scripts/fonts/Gelasio-Italic.ttf')})}
@font-face{font-family:'DM Sans';font-weight:500;src:url(data:font/ttf;base64,${b64('scripts/fonts/DMSans-Medium.ttf')})}
@font-face{font-family:'DM Sans';font-weight:700;src:url(data:font/ttf;base64,${b64('scripts/fonts/DMSans-Bold.ttf')})}`;

const BRAND_CFG = {
  name: 'FaithWall',
  markHtml: '<span>Faith<b style="color:#D97B3B">Wall</b></span>',
  iconSrc: `data:image/png;base64,${b64('public/icon-app-180.png')}`,
  fontCss: FONT_CSS,
  display: SANS,
  accent: BRAND_LIGHT,
  accentInk: '#1a0d04',
  base: 'radial-gradient(120% 90% at 70% 0%, #1b1410 0%, #0d0b0c 45%, #08080b 100%)',
  // light rays from above the phone: "a verse in view", not a gadget ad
  pattern: 'repeating-conic-gradient(from 196deg at 78% -18%, rgba(255,236,214,.05) 0deg 3deg, transparent 3deg 8deg)',
  screenCss: `.verse{display:flex;flex-direction:column;align-items:center;text-align:center;height:100%;justify-content:center}
.verse p{line-height:1.3;text-wrap:balance}
.verse .ref{margin-top:24px;font-family:${SANS};font-weight:700;font-size:26px}`,
};

function screen(c, pal) {
  return {
    bg: pal.bg,
    time: pal.time,
    date: c.date,
    inner: `<div class="verse"><p class="fit" data-min="24" data-max="58" style="font-family:${pal.family};font-weight:${pal.weight};font-style:${pal.italic ? 'italic' : 'normal'};color:${pal.text};${pal.shadow ? `text-shadow:0 2px 14px ${pal.shadow};` : ''}">${esc(c.text)}</p>`
      + `<div class="ref" style="letter-spacing:${pal.upper ? '3px' : '.5px'};color:${pal.ref};${pal.upper ? 'text-transform:uppercase;' : ''}">${esc(c.ref)} &middot; ${TRANSLATION}</div></div>`,
  };
}

function iconSvg(name) {
  const Icon = Lucide[name];
  if (!Icon) throw new Error(`Unknown lucide icon ${name}`);
  return renderToStaticMarkup(createElement(Icon, { size: 30, strokeWidth: 2.25 }));
}

const HOOK_WORDS = 6; // hard cap; aim for 2-4
const BANNED = /\b(free|price|priced|pricing|cost|costs|trial|subscribe|subscription|paywall|premium)\b|\$\d/i;

// ---------- main ----------
// Flags: --out <dir> writes the jpgs there and touches no data file (samples / review);
//        --dry checks every entry (hook, tag, icon, verse) without rendering.
const args = process.argv.slice(2);
const outIdx = args.indexOf('--out');
const outDir = outIdx >= 0 ? args[outIdx + 1] : null;
const dry = args.includes('--dry');
const only = new Set(args.filter((a, i) => !a.startsWith('--') && (outIdx < 0 || i !== outIdx + 1)));
const data = JSON.parse(readFileSync(coversPath, 'utf-8'));
let listingSrc = readFileSync(listingPath, 'utf-8');
const listing = JSON.parse(listingSrc);
const seenFiles = new Set();
const problems = [];
for (const c of data.covers) {
  if (SKIP.has(c.slug)) problems.push(`${c.slug} is in SKIP and must not have a cover entry`);
  if (!PALETTES[c.palette]) problems.push(`${c.slug}: unknown palette ${c.palette}`);
  if (!c.hook) problems.push(`${c.slug}: no hook`);
  else {
    const words = c.hook.replace(/\*/g, '').split(/\s+/).filter(Boolean).length;
    if (words > HOOK_WORDS) problems.push(`${c.slug}: hook has ${words} words (max ${HOOK_WORDS})`);
    if (!/\*[^*]+\*/.test(c.hook)) problems.push(`${c.slug}: hook needs one *accent* word`);
  }
  for (const f of ['hook', 'tag', 'badge']) if (c[f] && BANNED.test(c[f])) problems.push(`${c.slug}: no price/free/trial words on covers (${f}: ${c[f]})`);
  if (!c.tag) problems.push(`${c.slug}: no tag`);
  if (!LAYOUT_NAMES.includes(c.layout)) problems.push(`${c.slug}: layout must be one of ${LAYOUT_NAMES.join(', ')}`);
  if (c.layout === 'number' && !(c.number && c.hook.replace(/\*/g, '').startsWith(c.number + ' '))) problems.push(`${c.slug}: number layout needs "number" and a hook that starts with it`);
  if (c.float) {
    if (!Lucide[c.float.icon]) problems.push(`${c.slug}: unknown float icon ${c.float.icon}`);
    for (const f of ['title', 'text']) if (!c.float[f] || c.float[f].length > 24 || BANNED.test(c.float[f])) problems.push(`${c.slug}: float ${f} must be 1-24 characters, no price words`);
    if (!['right', 'left', 'number'].includes(c.layout)) problems.push(`${c.slug}: float cards only fit right, left, number`);
  }
  if (!Lucide[c.icon]) problems.push(`${c.slug}: unknown icon ${c.icon}`);
  if (c.badge && c.badge.length > 24) problems.push(`${c.slug}: badge longer than 24 characters`);
  try { c.text = kjvText(c.ref); } catch (e) { problems.push(`${c.slug}: ${e.message}`); }
  if (c.fan && (c.fan.length !== 2 || c.fan.includes(c.ref))) problems.push(`${c.slug}: fan needs exactly two other refs`);
  for (const r of c.fan || []) { try { kjvText(r); } catch (e) { problems.push(`${c.slug} fan: ${e.message}`); } }
  for (const fp of c.fanPalettes || []) if (!PALETTES[fp]) problems.push(`${c.slug}: unknown fan palette ${fp}`);
  c.file = `/blog-thumbnails/${slugify(c.ref)}-bible-verse-iphone-wallpaper.jpg`;
  if (seenFiles.has(c.file)) problems.push(`Duplicate verse ${c.ref}: each post needs its own verse (file name collision)`);
  seenFiles.add(c.file);
  c.alt = `iPhone lock screen showing ${c.ref} (${TRANSLATION}) as a wallpaper`;
}
// Grid neighbours (blogPosts.json order, the order the blog grid shows) never share a layout: same style, a different
// picture each time. Pick one the 3 neighbours do not use (the covers skill, step 2).
{
  const bySlug = new Map(data.covers.map((c) => [c.slug, c]));
  const grid = listing.map((p) => bySlug.get(p.slug)).filter(Boolean);
  for (let i = 1; i < grid.length; i++) {
    if (grid[i].layout === grid[i - 1].layout) problems.push(`${grid[i].slug}: same layout (${grid[i].layout}) as its grid neighbour ${grid[i - 1].slug}`);
  }
}
if (problems.length) { console.error(problems.join('\n')); process.exit(1); }
if (dry) { console.log(`${data.covers.length} cover entries OK`); process.exit(0); }

const engine = await launch();
let n = 0;
try {
  for (const c of data.covers) {
    if (only.size && !only.has(c.slug)) continue;
    const pal = PALETTES[c.palette];
    // fan: two more verses (refs in c.fan) on phones behind the front one, for list posts
    // fan: two more verses (c.fan) behind the front phone for list posts; without c.fan, the same verse in two
    // other wallpaper styles (one verse, three looks)
    const others = Object.keys(PALETTES).filter((k) => k !== c.palette);
    const h = [...c.slug].reduce((a, ch) => (a * 31 + ch.charCodeAt(0)) >>> 0, 7);
    const fanPal = c.fanPalettes || [others[h % others.length], others[(h + 3) % others.length]];
    const backs = c.layout !== 'fan' ? [] : c.fan
      ? c.fan.map((ref, k) => screen({ ref, text: kjvText(ref), date: c.date }, PALETTES[fanPal[k] || c.palette]))
      : fanPal.map((k) => screen(c, PALETTES[k]));
    const html = coverHtml(BRAND_CFG, {
      hook: c.hook, tag: c.tag, tagIconSvg: iconSvg(c.icon), badge: c.badge, layout: c.layout, number: c.number, float: c.float && { iconSvg: iconSvg(c.float.icon), title: c.float.title, text: c.float.text },
      glow: pal.glow, screens: [screen(c, pal), ...backs],
    });
    const { jpg, fit } = await engine.render(html);
    n++;
    if (outDir) {
      writeFileSync(join(outDir, `${c.slug}.jpg`), jpg);
      console.log(`${c.slug}  hook ${fit.hook}px  verse ${fit.screens[0]}px  ${(jpg.length / 1024).toFixed(0)} KB`);
      continue;
    }
    writeFileSync(join(root, 'public', c.file), jpg);

    // Point the post + the listing at the new cover; drop any Unsplash credit.
    // Text edits (not JSON.stringify) so the files keep their formatting.
    const pp = postPath(c.slug);
    let postSrc = readFileSync(pp, 'utf-8');
    const old = JSON.parse(postSrc).meta.image;
    postSrc = postSrc
      .replace(/\n\s*"imageAlt": "[^"\n]*",?/, '')
      .replace(/\n\s*"imageAttribution": \{[^}]*\},?/, '')
      .replace(/^(\s*)"image": "[^"\n]*",/m, (_, ind) => `${ind}"image": ${JSON.stringify(c.file)},\n${ind}"imageAlt": ${JSON.stringify(c.alt)},`);
    JSON.parse(postSrc); // must stay valid
    writeFileSync(pp, postSrc);
    const entry = listing.find((p) => p.slug === c.slug);
    if (entry) {
      const at = listingSrc.indexOf(`"slug": ${JSON.stringify(c.slug)}`);
      const end = listingSrc.indexOf('\n  }', at); // end of this entry only
      const seg = listingSrc.slice(at, end)
        .replace(/\n\s*"thumbnailAlt": "[^"\n]*",?/, '')
        .replace(/(\s*)"thumbnail": "[^"\n]*",/, (_, ws) => `${ws}"thumbnail": ${JSON.stringify(c.file)},${ws}"thumbnailAlt": ${JSON.stringify(c.alt)},`);
      listingSrc = listingSrc.slice(0, at) + seg + listingSrc.slice(end);
      entry.thumbnail = c.file;
    }
    // Covers are served immutable, so a new look gets a new file name; remove the old jpg and its variants
    // once nothing points at it.
    if (old && old !== c.file && old.startsWith('/blog-thumbnails/')) {
      const stillUsed = listing.some((p) => p.thumbnail === old);
      if (!stillUsed) {
        const base = old.replace(/^\/blog-thumbnails\//, '').replace(/\.jpg$/, '');
        for (const f of readdirSync(join(root, 'public/blog-thumbnails'))) {
          if (f === `${base}.jpg` || (f.startsWith(`${base}-`) && /-\d+\.(webp|avif)$/.test(f))) rmSync(join(root, 'public/blog-thumbnails', f));
        }
      }
    }
    console.log(`${c.slug}  ${c.ref}  hook ${fit.hook}px  verse ${fit.screens[0]}px  ${(jpg.length / 1024).toFixed(0)} KB`);
  }
} finally {
  engine.close();
}
if (!outDir) {
  writeFileSync(coversPath, JSON.stringify(data, null, 2) + '\n');
  JSON.parse(listingSrc);
  writeFileSync(listingPath, listingSrc);
}
console.log(`\n${n} cover(s) rendered${outDir ? ` to ${outDir}` : ''}`);
