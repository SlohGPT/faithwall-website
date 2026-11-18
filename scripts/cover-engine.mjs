/**
 * Cover engine 1.0.0 (2026-11-18). The SAME file ships on FaithWall, QuranWall and NoteWall (compare with
 * `shasum -a 256 scripts/cover-engine.mjs`); each site's scripts/build-covers.mjs passes its own brand and
 * lock-screen content. No npm dependencies: headless Google Chrome over CDP (Node's fetch + WebSocket).
 *
 * What a cover is (the "killer thumbnail" rules, see the site's blog-covers skill):
 * - 1600x1067 (3:2). Everything that matters sits inside the centre 16:9 band (y 84-983), because the post hero
 *   crops to 16:9 from 768 px, and it still reads at the 112 px phone card.
 * - Left: a topic pill (icon + topic), the HOOK (2-5 words, one *accent* word, huge) and an optional badge
 *   (a number or a short fact). The hook never repeats the title; it is the reason to click.
 * - A real-looking iPhone, tilted, bleeding off the frame, its lock screen showing the post's own content (a verse,
 *   an ayah, a note), in one of six layouts (right, left, fan, duo, closeup, number) so a blog grid never shows
 *   the same composition twice in a row (1.1.0, Karol 11-18: "same style, but different positions, different
 *   ideas"). An optional float card (an iOS-style notification) adds the post's own idea: a Focus pill, a
 *   reminder, a streak.
 * - Background: the site's dark base, a coloured light behind the phone, a faint site pattern, film grain and a
 *   vignette. The brand mark (app icon + name) sits bottom left.
 */
import { mkdtempSync, rmSync } from 'fs';
import { spawn } from 'child_process';
import { tmpdir } from 'os';
import { join } from 'path';

export const ENGINE_VERSION = '1.1.0';
export const W = 1600;
export const H = 1067;

export const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** "18 verses for *Christmas*" -> escaped HTML with the starred words in <em>. */
export function hookHtml(hook) {
  return esc(hook).replace(/\*([^*]+)\*/g, '<em>$1</em>');
}

const GRAIN = `url("data:image/svg+xml;utf8,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="320" height="320"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 .55 0"/></filter><rect width="100%" height="100%" filter="url(#n)"/></svg>',
)}")`;

/**
 * One phone: frame + screen. `screen` = { bg, overlay?, time, date?, inner, home? } where inner is the site's
 * HTML for the content area (it may use class "fit" on one element: the engine grows its font until the box is
 * full). `home: true` draws a Home Screen instead (no clock; inner fills the whole screen).
 */
function phoneHtml(screen, cls = '') {
  const lock = screen.home ? '' : `<div class="date" style="color:${screen.time}">${esc(screen.date || 'Tuesday, March 10')}</div>
<div class="time" style="color:${screen.time}">9:41</div>`;
  return `<div class="phone ${cls}"><span class="btn b1"></span><span class="btn b2"></span><span class="btn b3"></span>
<div class="screen" style="background:${screen.bg}">${screen.overlay || ''}<div class="island"></div>
${lock}<div class="${screen.home ? 'home' : 'content'}">${screen.inner}</div></div></div>`;
}

/**
 * "The other way" for duo (comparison) covers: a generic Home Screen full of app icons, i.e. an app you have to
 * find and open. No real app's icon or name: plain coloured tiles only.
 */
export function homeGridScreen(bg = 'linear-gradient(170deg,#2a2f3a,#14161c 60%,#0c0d11)') {
  const tones = ['#5b6b8c', '#7a5c8c', '#4f7d73', '#8c6a4f', '#4f6a8c', '#6d6d78', '#8c4f5f', '#5f8c4f'];
  let tiles = '';
  for (let i = 0; i < 20; i++) tiles += `<span style="background:${tones[(i * 5) % tones.length]}"></span>`;
  return {
    bg, home: true, time: '#fff',
    inner: `<div class="grid">${tiles}</div><div class="dock"><span></span><span></span><span></span><span></span></div>`,
  };
}

/** Layouts. Each says where the copy column, the phones, the glow, the brand mark and the float card go. */
const LAYOUTS = {
  // copy left, one phone right tilted left
  right: { copy: [100, 760], hookMax: 150, glow: [820, -330], mark: 100, float: [850, 842, -3],
    phones: ['left:950px;top:118px;transform:rotate(-6deg)'] },
  // mirror: phone left tilted right, copy right
  left: { copy: [790, 710], hookMax: 140, glow: [-470, -330], glowB: [880, null], mark: 790, float: [150, 842, 3],
    phones: ['left:110px;top:118px;transform:rotate(6deg)'] },
  // three phones for list posts: two more items behind the front one
  fan: { copy: [100, 700], hookMax: 150, glow: [700, -330], mark: 100, float: null,
    phones: ['left:960px;top:118px;transform:rotate(-6deg)', 'left:790px;top:210px;transform:rotate(-15deg) scale(.84);filter:brightness(.6) saturate(.9)', 'left:1200px;top:190px;transform:rotate(7deg) scale(.84);filter:brightness(.6) saturate(.9)'] },
  // comparison: "an app you open" (generic Home Screen) vs our lock screen, with a VS disc
  duo: { copy: [100, 640], hookMax: 128, glow: [760, -360], mark: 100, float: null, vs: [1046, 500],
    phones: ['left:1090px;top:126px;transform:rotate(5deg) scale(.9)', 'left:790px;top:176px;transform:rotate(-9deg) scale(.84);filter:brightness(.62) saturate(.55)'] },
  // close-up: a big phone cropped by the frame, the clock and the content fill the right half
  closeup: { copy: [100, 700], hookMax: 140, glow: [760, -420], mark: 100, float: null,
    phones: ['left:900px;top:-14px;transform-origin:0 0;transform:rotate(-4deg) scale(1.28)'] },
  // a giant number over a shorter hook, phone tilted the other way
  number: { copy: [100, 740], hookMax: 104, glow: [840, -300], mark: 100, float: [880, 842, 3],
    phones: ['left:1000px;top:128px;transform:rotate(5deg)'] },
};
export const LAYOUT_NAMES = Object.keys(LAYOUTS);

/**
 * brand: { name, iconSrc, fontCss, display, accent, accentInk, base, pattern, markHtml?, screenCss? }
 * cover: { hook, tag, tagIconSvg, badge?, number?, layout, glow, screens: [front, ...],
 *          float?: { iconSvg, title, text } (a small iOS-style card that says what the post is about) }
 * The front screen comes first; fan needs 3 screens, duo uses screens[1] or a generic Home Screen.
 */
export function coverHtml(brand, cover) {
  const L = LAYOUTS[cover.layout] || LAYOUTS.right;
  if (!LAYOUTS[cover.layout]) throw new Error(`Unknown layout ${cover.layout} (${LAYOUT_NAMES.join(', ')})`);
  if (cover.layout === 'fan' && cover.screens.length < 3) throw new Error('fan needs 3 screens');
  if (cover.layout === 'number' && !cover.number) throw new Error('number layout needs cover.number');
  const screens = cover.layout === 'duo' ? [cover.screens[0], cover.screens[1] || homeGridScreen()] : cover.screens.slice(0, L.phones.length);
  const [copyX, copyW] = L.copy;
  const phones = screens.map((sc, i) => ({ html: phoneHtml(sc, i === 0 ? 'front' : 'back'), style: L.phones[i] }))
    .reverse() // back phones first in the DOM, the front one on top
    .map((p) => p.html.replace('<div class="phone ', `<div style="${p.style}" class="phone `)).join('\n');
  const fl = cover.float && L.float;
  return `<!doctype html><html><head><meta charset="utf-8"><style>${brand.fontCss}
*{box-sizing:border-box;margin:0;padding:0}
html,body{width:${W}px;height:${H}px;overflow:hidden;background:#000}
.stage{position:relative;width:${W}px;height:${H}px;overflow:hidden;background:${brand.base};font-family:${brand.display}}
.glow{position:absolute;border-radius:50%;pointer-events:none}
.glow.a{left:${L.glow[0]}px;top:${L.glow[1]}px;width:1250px;height:1250px;background:radial-gradient(closest-side,${cover.glow}cc,${cover.glow}55 45%,transparent 72%)}
.glow.b{left:${L.glowB ? L.glowB[0] : -420}px;bottom:-560px;width:1200px;height:1200px;background:radial-gradient(closest-side,${brand.accent}52,transparent 70%)}
.pattern{position:absolute;inset:0;background:${brand.pattern || 'none'};opacity:.55;
  -webkit-mask-image:radial-gradient(ellipse 70% 80% at ${cover.layout === 'left' ? 30 : 70}% 40%,#000 20%,transparent 75%)}
.grain{position:absolute;inset:0;background-image:${GRAIN};background-size:320px;opacity:.10;mix-blend-mode:overlay}
.vig{position:absolute;inset:0;background:radial-gradient(ellipse 85% 85% at 55% 45%,transparent 55%,rgba(0,0,0,.6) 100%)}
.copy{position:absolute;left:${copyX}px;top:84px;bottom:196px;width:${copyW}px;display:flex;flex-direction:column;justify-content:center;z-index:5}
.tag{display:inline-flex;align-items:center;gap:14px;align-self:flex-start;height:60px;padding:0 28px 0 20px;border-radius:30px;
  background:rgba(255,255,255,.08);box-shadow:inset 0 0 0 1.5px rgba(255,255,255,.16);color:rgba(255,255,255,.92);
  font-weight:700;font-size:24px;letter-spacing:.14em;text-transform:uppercase;white-space:nowrap}
.tag svg{width:30px;height:30px;color:${brand.accent};flex-shrink:0}
.num{margin-top:22px;font-weight:800;font-size:300px;line-height:.82;letter-spacing:-.06em;
  background:linear-gradient(180deg,${brand.accent},${brand.accent}66);-webkit-background-clip:text;background-clip:text;color:transparent}
.hook{margin-top:34px;font-weight:800;line-height:.98;letter-spacing:-.035em;color:#fff;text-wrap:balance;
  text-shadow:0 6px 40px rgba(0,0,0,.45)}
.num+.hook{margin-top:18px}
.hook em{font-style:normal;color:${brand.accent}}
.badge{margin-top:40px;align-self:flex-start;display:inline-flex;align-items:center;gap:12px;height:76px;padding:0 32px;border-radius:22px;
  background:${brand.accent};color:${brand.accentInk};font-weight:800;font-size:36px;letter-spacing:-.01em;white-space:nowrap;
  box-shadow:0 16px 40px rgba(0,0,0,.35)}
.mark{position:absolute;left:${L.mark}px;bottom:92px;display:flex;align-items:center;gap:20px;z-index:5;color:rgba(255,255,255,.94);
  font-weight:800;font-size:44px;letter-spacing:-.02em;text-shadow:0 4px 24px rgba(0,0,0,.5)}
.mark img{width:84px;height:84px;border-radius:19px;box-shadow:0 8px 24px rgba(0,0,0,.45),0 0 0 1px rgba(255,255,255,.12)}
.phones{position:absolute;inset:0;z-index:3}
.phone{position:absolute;width:540px;height:1170px;border-radius:80px;
  background:linear-gradient(160deg,#4a4a55,#16161b 38%,#2b2b33 70%,#0f0f13);
  box-shadow:0 0 0 2px rgba(255,255,255,.14),inset 0 0 0 1px rgba(255,255,255,.08),0 60px 120px rgba(0,0,0,.7),0 0 160px ${cover.glow}40}
.btn{position:absolute;width:6px;border-radius:3px;background:#2d2d35}
.b1{left:-4px;top:210px;height:62px}.b2{left:-4px;top:300px;height:104px}.b3{right:-4px;top:260px;height:150px}
.screen{position:absolute;inset:11px;border-radius:70px;overflow:hidden}
.island{position:absolute;left:50%;top:18px;width:150px;height:44px;margin-left:-75px;border-radius:22px;background:#000;z-index:2}
.date{position:absolute;top:96px;left:0;right:0;text-align:center;font-weight:600;font-size:27px;opacity:.88;z-index:1}
.time{position:absolute;top:112px;left:0;right:0;text-align:center;font-weight:700;font-size:168px;letter-spacing:-5px;line-height:1.1;z-index:1}
.content{position:absolute;left:40px;right:40px;top:330px;height:400px;z-index:1;display:flex;flex-direction:column;justify-content:center}
.home{position:absolute;inset:0;z-index:1}
.home .grid{position:absolute;left:44px;right:44px;top:120px;display:grid;grid-template-columns:repeat(4,1fr);gap:46px 34px}
.home .grid span,.home .dock span{display:block;aspect-ratio:1;border-radius:26px;opacity:.9;box-shadow:inset 0 0 0 1px rgba(255,255,255,.12)}
.home .dock{position:absolute;left:24px;right:24px;bottom:26px;height:150px;border-radius:52px;background:rgba(255,255,255,.14);
  display:grid;grid-template-columns:repeat(4,1fr);gap:34px;padding:24px 34px}
.home .dock span{background:rgba(255,255,255,.28)}
.vs{position:absolute;left:${L.vs ? L.vs[0] : 0}px;top:${L.vs ? L.vs[1] : 0}px;width:132px;height:132px;border-radius:50%;z-index:6;
  display:flex;align-items:center;justify-content:center;background:${brand.accent};color:${brand.accentInk};font-weight:800;font-size:50px;
  letter-spacing:-.02em;box-shadow:0 0 0 10px rgba(0,0,0,.35),0 20px 50px rgba(0,0,0,.5)}
.float{position:absolute;left:${fl ? L.float[0] : 0}px;top:${fl ? L.float[1] : 0}px;width:610px;z-index:6;transform:rotate(${fl ? L.float[2] : 0}deg);
  display:flex;gap:24px;align-items:center;padding:24px 30px;border-radius:40px;background:rgba(28,28,34,.82);
  backdrop-filter:blur(18px);-webkit-backdrop-filter:blur(18px);box-shadow:inset 0 0 0 1.5px rgba(255,255,255,.14),0 30px 70px rgba(0,0,0,.55)}
.float .ic{width:88px;height:88px;flex-shrink:0;border-radius:24px;background:${brand.accent};color:${brand.accentInk};display:flex;align-items:center;justify-content:center}
.float .ic svg{width:48px;height:48px}
.float b{display:block;font-weight:800;font-size:36px;color:rgba(255,255,255,.95);letter-spacing:-.005em}
.float span{display:block;margin-top:4px;font-weight:600;font-size:31px;line-height:1.25;color:rgba(255,255,255,.72)}
${brand.screenCss || ''}
.has-float .front .content{height:310px}
</style></head><body><div class="stage${fl ? ' has-float' : ''}">
<div class="glow a"></div><div class="glow b"></div><div class="pattern"></div>
<div class="phones">
${phones}
</div>
<div class="grain"></div><div class="vig"></div>
${L.vs ? '<div class="vs">VS</div>' : ''}
${fl ? `<div class="float"><div class="ic">${cover.float.iconSvg || ''}</div><div><b>${esc(cover.float.title)}</b><span>${esc(cover.float.text)}</span></div></div>` : ''}
<div class="copy">
<div class="tag">${cover.tagIconSvg || ''}<span>${esc(cover.tag)}</span></div>
${cover.layout === 'number' ? `<div class="num">${esc(cover.number)}</div>` : ''}
<div class="hook" id="hook" data-max="${L.hookMax}">${hookHtml(cover.layout === 'number' ? cover.hook.replace(/^\*?\d+\*?\s+/, '') : cover.hook)}</div>
${cover.badge ? `<div class="badge">${esc(cover.badge)}</div>` : ''}
</div>
<div class="mark"><img src="${brand.iconSrc}" alt="">${brand.markHtml || esc(brand.name)}</div>
</div></body></html>`;
}

/**
 * Fit after fonts load: the hook gets the biggest size (72 px up to the layout's max) that keeps it within 3 lines and the copy
 * column; every .fit element on a screen grows until its .content box is full (min/max from data-min/data-max).
 */
const FIT_JS = `(async()=>{await document.fonts.ready;
const hook=document.getElementById('hook'),col=hook.parentElement;
let lo=72,hi=+(hook.dataset.max||150),best=72;
const okHook=()=>{const lh=parseFloat(getComputedStyle(hook).fontSize)*0.98;return hook.scrollWidth<=col.clientWidth+1&&hook.getBoundingClientRect().height<=lh*3+4&&col.scrollHeight<=col.clientHeight+1};
while(lo<=hi){const m=(lo+hi)>>1;hook.style.fontSize=m+'px';if(okHook()){best=m;lo=m+1}else hi=m-1}
hook.style.fontSize=best+'px';
const sizes=[];
for(const el of document.querySelectorAll('.fit')){const box=el.closest('.content');
 let a=+(el.dataset.min||28),b=+(el.dataset.max||64),bst=a;
 while(a<=b){const m=(a+b)>>1;el.style.fontSize=m+'px';if(box.scrollHeight<=box.clientHeight&&el.scrollWidth<=el.clientWidth+1){bst=m;a=m+1}else b=m-1}
 el.style.fontSize=bst+'px';sizes.push(bst)}
return {hook:best,screens:sizes}})()`;

/** Starts headless Chrome; returns { render(html) -> { jpg, fit }, close() }. */
export async function launch({ chrome = process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', quality = 86 } = {}) {
  const dir = mkdtempSync(join(tmpdir(), 'cover-engine-'));
  const port = 9300 + Math.floor(Math.random() * 600);
  const proc = spawn(chrome, [
    '--headless=new', '--disable-gpu', '--hide-scrollbars', '--no-first-run', '--no-default-browser-check',
    `--remote-debugging-port=${port}`, `--user-data-dir=${dir}`, 'about:blank',
  ], { stdio: 'ignore' });
  let ver;
  for (let i = 0; i < 80 && !ver; i++) {
    try { ver = await (await fetch(`http://127.0.0.1:${port}/json/version`)).json(); }
    catch { await new Promise((r) => setTimeout(r, 250)); }
  }
  if (!ver) { proc.kill(); throw new Error('Chrome did not start (set CHROME_PATH)'); }
  const targets = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json();
  const ws = new WebSocket(targets.find((t) => t.type === 'page').webSocketDebuggerUrl);
  await new Promise((res, rej) => { ws.onopen = res; ws.onerror = rej; });
  let id = 0;
  const pending = new Map();
  ws.onmessage = (e) => {
    const m = JSON.parse(e.data);
    if (m.id && pending.has(m.id)) {
      const { res, rej } = pending.get(m.id);
      pending.delete(m.id);
      m.error ? rej(new Error(m.error.message)) : res(m.result);
    }
  };
  const send = (method, params = {}) => new Promise((res, rej) => { const i = ++id; pending.set(i, { res, rej }); ws.send(JSON.stringify({ id: i, method, params })); });
  await send('Page.enable');
  await send('Emulation.setDeviceMetricsOverride', { width: W, height: H, deviceScaleFactor: 1, mobile: false });
  const { frameTree } = await send('Page.getFrameTree');
  const frameId = frameTree.frame.id;
  return {
    async render(html) {
      await send('Page.setDocumentContent', { frameId, html });
      const r = await send('Runtime.evaluate', { expression: FIT_JS, awaitPromise: true, returnByValue: true });
      await new Promise((res) => setTimeout(res, 60));
      const shot = await send('Page.captureScreenshot', { format: 'jpeg', quality, clip: { x: 0, y: 0, width: W, height: H, scale: 1 } });
      return { jpg: Buffer.from(shot.data, 'base64'), fit: r.result.value };
    },
    close() {
      try { ws.close(); } catch {}
      proc.kill();
      try { rmSync(dir, { recursive: true, force: true }); } catch {}
    },
  };
}
