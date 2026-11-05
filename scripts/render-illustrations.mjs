/**
 * Contact sheet for the spot illustrations (src/components/illustrations).
 * Every scene is server-rendered to an SVG string (via Vite's SSR loader, so
 * the .tsx is used as is) and drawn at 358px (phone column) and 720px
 * (desktop column) on the site's dark surface, each row with its byte size.
 * One tall jpg is written, by default illustrations-contact-sheet.jpg at the
 * repo root (not committed).
 *
 * Rendering: headless Google Chrome over CDP (Node's built-in fetch +
 * WebSocket, no npm dependencies). macOS path by default; set CHROME_PATH to
 * override. Not part of `npm run build`.
 *
 *   node scripts/render-illustrations.mjs                 # all scenes
 *   node scripts/render-illustrations.mjs lockscreen plans  # only these
 *   node scripts/render-illustrations.mjs --out=/path.jpg   # other file
 *   node scripts/render-illustrations.mjs --mapping         # also print the slug mapping
 */
import { readFileSync, writeFileSync, mkdtempSync, rmSync, readdirSync } from 'fs';
import { spawn } from 'child_process';
import { tmpdir } from 'os';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { createServer } from 'vite';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const CHROME = process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const args = process.argv.slice(2);
const outArg = args.find((a) => a.startsWith('--out='));
const OUT = outArg ? outArg.slice(6) : join(root, 'illustrations-contact-sheet.jpg');
const only = new Set(args.filter((a) => !a.startsWith('--')));
const SHEET_W = 1260;
const PAD = 40;
const SIZES = [358, 720];

// ---------- render the scenes ----------
const vite = await createServer({ root, logLevel: 'error', server: { middlewareMode: true }, appType: 'custom' });
let scenes, picker;
try {
  scenes = (await vite.ssrLoadModule('/src/components/illustrations/scenes.tsx')).SCENES;
  picker = (await vite.ssrLoadModule('/src/components/illustrations/index.tsx')).pickIllustration;
} catch (e) {
  await vite.close();
  throw e;
}
const names = Object.keys(scenes).filter((k) => !only.size || only.has(k));
const svgs = Object.fromEntries(names.map((k) => [k, renderToStaticMarkup(createElement(scenes[k]))]));

if (args.includes('--mapping')) {
  const listing = JSON.parse(readFileSync(join(root, 'src/data/blogPosts.json'), 'utf-8'));
  const pillars = JSON.parse(readFileSync(join(root, 'src/data/pillars.json'), 'utf-8'));
  const titles = new Map(listing.map((p) => [p.slug, p.title]));
  for (const f of readdirSync(join(root, 'src/data/posts'))) {
    const s = f.replace('.json', '');
    if (!titles.has(s)) titles.set(s, JSON.parse(readFileSync(join(root, 'src/data/posts', f), 'utf-8')).meta.title);
  }
  for (const [s, p] of Object.entries(pillars)) titles.set(s, p.title || p.h1 || s);
  const rows = [...titles].map(([s, t]) => [picker(s, t) ?? 'null', s, t]).sort();
  for (const r of rows) console.log(r.join('\t'));
}
await vite.close();

// ---------- html ----------
const b64 = (p) => readFileSync(join(root, p)).toString('base64');
const FONT_CSS = `
@font-face{font-family:'DM Sans';font-weight:500;src:url(data:font/ttf;base64,${b64('scripts/fonts/DMSans-Medium.ttf')})}
@font-face{font-family:'DM Sans';font-weight:700;src:url(data:font/ttf;base64,${b64('scripts/fonts/DMSans-Bold.ttf')})}`;

const bytes = (s) => Buffer.byteLength(s);
const rows = names
  .map(
    (k) => `<section><h2>${k} <small>${(bytes(svgs[k]) / 1024).toFixed(1)} KB</small></h2><div class="row">
${SIZES.map((w) => `<div class="col" style="width:${w}px"><div class="w">${w}px</div>${svgs[k]}</div>`).join('')}</div></section>`,
  )
  .join('\n');
const html = `<!doctype html><html><head><meta charset="utf-8"><style>${FONT_CSS}
*{box-sizing:border-box;margin:0;padding:0}
body{width:${SHEET_W}px;background:#0A0A0F;color:#fff;font-family:'DM Sans',system-ui,sans-serif;padding:${PAD}px}
section{margin-bottom:34px}
h2{font-size:15px;font-weight:700;color:#E9A06A;margin-bottom:10px;letter-spacing:.5px}
h2 small{color:rgba(255,255,255,.4);font-weight:500;margin-left:8px}
.row{display:flex;gap:${SHEET_W - 2 * PAD - SIZES.reduce((a, b) => a + b, 0)}px;align-items:flex-start}
.col{position:relative}
.w{position:absolute;right:0;top:-24px;font-size:11px;color:rgba(255,255,255,.3)}
</style></head><body>${rows}</body></html>`;

// ---------- CDP ----------
async function launch() {
  const dir = mkdtempSync(join(tmpdir(), 'fw-illus-'));
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

const cdp = await launch();
try {
  await cdp.send('Page.enable');
  await cdp.send('Emulation.setDeviceMetricsOverride', { width: SHEET_W, height: 800, deviceScaleFactor: 1, mobile: false });
  const { frameTree } = await cdp.send('Page.getFrameTree');
  await cdp.send('Page.setDocumentContent', { frameId: frameTree.frame.id, html });
  const r = await cdp.send('Runtime.evaluate', { expression: 'document.fonts.ready.then(()=>document.documentElement.scrollHeight)', awaitPromise: true, returnByValue: true });
  const H = r.result.value;
  await cdp.send('Emulation.setDeviceMetricsOverride', { width: SHEET_W, height: H, deviceScaleFactor: 1, mobile: false });
  const shot = await cdp.send('Page.captureScreenshot', { format: 'jpeg', quality: 90, clip: { x: 0, y: 0, width: SHEET_W, height: H, scale: 1 } });
  writeFileSync(OUT, Buffer.from(shot.data, 'base64'));
  console.log(`${OUT}  ${SHEET_W}x${H}`);
  for (const k of names) console.log(`${k.padEnd(12)} ${bytes(svgs[k])} bytes`);
} finally {
  cdp.close();
}
