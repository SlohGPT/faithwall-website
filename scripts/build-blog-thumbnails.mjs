/**
 * Renders the blog covers: an iPhone lock screen showing one KJV verse, on the
 * site's own dark + warm orange look. One 1600x1067 jpg per post (same pixel
 * size as the old Unsplash covers, which the cards and the post hero crop to
 * 16:9, so everything important sits in the centre band).
 *
 * Input:  src/data/blogCovers.json  ({slug, ref, palette} per post; reviewable)
 * Output: public/blog-thumbnails/<ref>-bible-verse-iphone-lock-screen.jpg
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
import { readFileSync, writeFileSync, mkdtempSync, rmSync, existsSync } from 'fs';
import { spawn } from 'child_process';
import { tmpdir } from 'os';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { STYLE_PRESETS } from '../src/lib/wallpaper.ts';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const CHROME = process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const W = 1600;
const H = 1067;
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
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// ---------- HTML ----------
const b64 = (p) => readFileSync(join(root, p)).toString('base64');
const FONT_CSS = `
@font-face{font-family:'Gelasio';font-weight:400;font-style:normal;src:url(data:font/ttf;base64,${b64('scripts/fonts/Gelasio-Regular.ttf')})}
@font-face{font-family:'Gelasio';font-weight:400;font-style:italic;src:url(data:font/ttf;base64,${b64('scripts/fonts/Gelasio-Italic.ttf')})}
@font-face{font-family:'DM Sans';font-weight:500;src:url(data:font/ttf;base64,${b64('scripts/fonts/DMSans-Medium.ttf')})}
@font-face{font-family:'DM Sans';font-weight:700;src:url(data:font/ttf;base64,${b64('scripts/fonts/DMSans-Bold.ttf')})}`;
const ICON = `data:image/png;base64,${b64('public/icon-app-180.png')}`;

function html(c, pal) {
  const light = pal.text === '#2b2118';
  return `<!doctype html><html><head><meta charset="utf-8"><style>${FONT_CSS}
*{box-sizing:border-box;margin:0;padding:0}
html,body{width:${W}px;height:${H}px;overflow:hidden;background:#0A0A0F}
.stage{position:relative;width:${W}px;height:${H}px;overflow:hidden;font-family:${SANS};
  background:
   radial-gradient(900px 700px at 8% 92%, rgba(217,123,59,.34), transparent 70%),
   radial-gradient(800px 800px at 92% 8%, ${pal.glow}40, transparent 70%),
   linear-gradient(180deg,#12121A,#0A0A0F)}
.brand{position:absolute;left:70px;top:330px;width:500px;color:#fff}
.brand img{width:118px;height:118px;border-radius:27px;box-shadow:0 14px 40px rgba(0,0,0,.5),0 0 0 1px rgba(255,255,255,.12)}
.brand .name{margin-top:30px;font-weight:700;font-size:84px;letter-spacing:-2px;line-height:1}
.brand .name b{color:${BRAND};font-weight:700}
.brand .tag{margin-top:22px;font-weight:500;font-size:40px;line-height:1.3;color:rgba(255,255,255,.7)}
.phone{position:absolute;left:640px;top:88px;width:860px;height:1300px;border-radius:124px;
  background:linear-gradient(160deg,#3a3a44,#121217 40%,#26262e);
  box-shadow:0 0 0 2px rgba(255,255,255,.16),0 50px 140px rgba(0,0,0,.65),0 0 200px ${pal.glow}33}
.btn{position:absolute;width:8px;border-radius:4px;background:#2c2c34}
.screen{position:absolute;left:16px;top:16px;right:16px;bottom:16px;border-radius:108px;overflow:hidden;background:${pal.bg};
  ${pal.glowLayer || ''}}
.island{position:absolute;left:50%;top:26px;width:210px;height:62px;margin-left:-105px;border-radius:31px;background:#000}
.date{position:absolute;top:128px;left:0;right:0;text-align:center;font-weight:500;font-size:40px;color:${pal.time};opacity:.85}
.time{position:absolute;top:150px;left:0;right:0;text-align:center;font-weight:700;font-size:232px;letter-spacing:-6px;line-height:1.1;color:${pal.time}}
.verse{position:absolute;left:62px;right:62px;top:425px;height:410px;display:flex;flex-direction:column;justify-content:center;align-items:center;text-align:center}
.verse p{font-family:${pal.family};font-weight:${pal.weight};font-style:${pal.italic ? 'italic' : 'normal'};color:${pal.text};
  ${pal.shadow ? `text-shadow:0 2px 18px ${pal.shadow};` : ''}line-height:1.28;text-wrap:balance}
.verse .ref{margin-top:30px;font-family:${SANS};font-weight:700;font-size:44px;letter-spacing:${pal.upper ? '4px' : '1px'};color:${pal.ref};${pal.upper ? 'text-transform:uppercase;' : ''}}
</style></head><body><div class="stage">
<div class="brand"><img src="${ICON}" alt=""><div class="name">Faith<b>Wall</b></div><div class="tag">Your verse, on your iPhone lock screen</div></div>
<div class="phone"><span class="btn" style="left:-6px;top:300px;height:90px"></span><span class="btn" style="left:-6px;top:430px;height:150px"></span><span class="btn" style="right:-6px;top:380px;height:210px"></span>
<div class="screen"><div class="island"></div><div class="date">Tuesday, March 10</div><div class="time">9:41</div>
<div class="verse"><p id="v">${esc(c.text)}</p><div class="ref">${esc(c.ref)} &middot; ${TRANSLATION}</div></div></div></div>
</div></body></html>`;
}

// Fit: biggest font where the verse block (verse + ref) stays inside the box.
const FIT_JS = `(async()=>{await document.fonts.ready;
const box=document.querySelector('.verse'),p=document.getElementById('v');
let lo=34,hi=76,best=34;
while(lo<=hi){const mid=(lo+hi)>>1;p.style.fontSize=mid+'px';
 if(box.scrollHeight<=box.clientHeight){best=mid;lo=mid+1}else hi=mid-1}
p.style.fontSize=best+'px';return best})()`;

// ---------- CDP ----------
async function launch() {
  const dir = mkdtempSync(join(tmpdir(), 'fw-cover-'));
  const port = 9300 + Math.floor(Math.random() * 500);
  const proc = spawn(CHROME, [
    '--headless=new', '--disable-gpu', '--hide-scrollbars', '--no-first-run', '--no-default-browser-check',
    `--remote-debugging-port=${port}`, `--user-data-dir=${dir}`, 'about:blank',
  ], { stdio: 'ignore' });
  let ver;
  for (let i = 0; i < 60 && !ver; i++) {
    try { ver = await (await fetch(`http://127.0.0.1:${port}/json/version`)).json(); }
    catch { await new Promise((r) => setTimeout(r, 250)); }
  }
  if (!ver) throw new Error('Chrome did not start');
  const targets = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json();
  const page = targets.find((t) => t.type === 'page');
  const ws = new WebSocket(page.webSocketDebuggerUrl);
  await new Promise((res, rej) => { ws.onopen = res; ws.onerror = rej; });
  let id = 0;
  const pending = new Map();
  ws.onmessage = (e) => {
    const m = JSON.parse(e.data);
    if (m.id && pending.has(m.id)) { const { res, rej } = pending.get(m.id); pending.delete(m.id); m.error ? rej(new Error(m.error.message)) : res(m.result); }
  };
  const send = (method, params = {}) => new Promise((res, rej) => { const i = ++id; pending.set(i, { res, rej }); ws.send(JSON.stringify({ id: i, method, params })); });
  const close = () => { try { ws.close(); } catch {} proc.kill(); try { rmSync(dir, { recursive: true, force: true }); } catch {} };
  return { send, close };
}

async function render(cdp, c, pal) {
  const { frameTree } = await cdp.send('Page.getFrameTree');
  await cdp.send('Page.setDocumentContent', { frameId: frameTree.frame.id, html: html(c, pal) });
  const r = await cdp.send('Runtime.evaluate', { expression: FIT_JS, awaitPromise: true, returnByValue: true });
  const shot = await cdp.send('Page.captureScreenshot', { format: 'jpeg', quality: 88, clip: { x: 0, y: 0, width: W, height: H, scale: 1 } });
  return { jpg: Buffer.from(shot.data, 'base64'), fontSize: r.result.value };
}

// ---------- main ----------
const only = new Set(process.argv.slice(2));
const data = JSON.parse(readFileSync(coversPath, 'utf-8'));
let listingSrc = readFileSync(listingPath, 'utf-8');
const listing = JSON.parse(listingSrc);
const seenFiles = new Set();
const cdp = await launch();
try {
  await cdp.send('Page.enable');
  await cdp.send('Emulation.setDeviceMetricsOverride', { width: W, height: H, deviceScaleFactor: 1, mobile: false });
  for (const c of data.covers) {
    if (SKIP.has(c.slug)) throw new Error(`${c.slug} is in SKIP and must not have a cover entry`);
    const pal = PALETTES[c.palette];
    if (!pal) throw new Error(`Unknown palette ${c.palette} for ${c.slug}`);
    c.text = kjvText(c.ref);
    c.file = `/blog-thumbnails/${slugify(c.ref)}-bible-verse-iphone-lock-screen.jpg`;
    if (seenFiles.has(c.file)) throw new Error(`Duplicate verse ${c.ref}: each post needs its own verse (file name collision)`);
    seenFiles.add(c.file);
    c.alt = `iPhone lock screen showing ${c.ref} (${TRANSLATION})`;
    if (only.size && !only.has(c.slug)) continue;

    const { jpg, fontSize } = await render(cdp, c, pal);
    writeFileSync(join(root, 'public', c.file), jpg);

    // Point the post + the listing at the new cover; drop the Unsplash credit.
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
    if (old && old !== c.file && old.startsWith('/blog-thumbnails/')) {
      const oldAbs = join(root, 'public', old);
      // keep it if another post still points at it
      const stillUsed = listing.some((p) => p.thumbnail === old);
      if (!stillUsed && existsSync(oldAbs)) rmSync(oldAbs);
    }
    console.log(`${c.slug}  ${c.ref}  ${c.palette}  ${fontSize}px  ${(jpg.length / 1024).toFixed(0)} KB`);
  }
} finally {
  cdp.close();
}
writeFileSync(coversPath, JSON.stringify(data, null, 2) + '\n');
JSON.parse(listingSrc);
writeFileSync(listingPath, listingSrc);
console.log(`\n${only.size || data.covers.length} cover(s) rendered`);
