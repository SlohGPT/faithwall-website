/**
 * Fact lint for faithwall.app: catches copy and markup that contradicts the product facts
 * (src/data/facts.json) or the Apple/Google rules the site follows.
 *
 * No dependencies. Node 18+.
 *
 * Modes (combine freely):
 *   --all                  lint every source file (src, index.html, public/*.txt|md, .claude/skills/**)
 *   --diff <base>          lint whole changed files, report only hits that overlap lines added in
 *                          `git diff <base>...HEAD -U0` (add --worktree to include uncommitted and
 *                          untracked changes too)
 *   --dist                 check the built site in dist/ (links, JSON-LD, NUL bytes, 404, sitemap, held pages)
 *   --prompts <files...>   lint scheduled-task prompt files with the same text rules
 *   --self-test            run the built-in true-positive / negative checks of the text rules
 *
 * Exit code 1 on any FAIL. WARN never fails.
 *
 *   npm run lint:facts       = --diff origin/main --worktree --dist
 *   npm run lint:facts:all   = --all
 */
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, dirname, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const facts = JSON.parse(readFileSync(join(ROOT, 'src/data/facts.json'), 'utf8'));
const APP_ID = facts.appId;
const PT = facts.providerToken;

// The 12 Apple campaign tokens that exist (spec 2.3). Never per post.
const CAMPAIGN_TOKENS = [
  'web-home-hero', 'web-site', 'web-blog-body', 'web-blog-mid', 'web-blog-end', 'web-blog-sticky',
  'web-pillar', 'web-cmp', 'web-maker', 'web-random', 'web-smart-banner', 'web-handoff',
];

// ---------------------------------------------------------------- text rules

const rules = [
  // wrong: rotation of the user's own set
  ['rotate-own-set', /\brotat\w*\s+(?:through\s+)?(?:all\s+)?(?:your|the|these|those)\s+(?:(?:saved|chosen|picked|own|favou?rite|selected|bookmarked)\s+)*(?:bible\s+)?(?:verses|scriptures|passages|favou?rites)\b|\brotat\w*\s+(?:the\s+)?verses\s+(?:that\s+)?you\s+(?:pick|choose|chose|save|saved)\b|\brotates?\s+(?:fresh\s+|random\s+)?verses\s+through\b/i, null],
  // wrong: the wallpaper itself rotates (needs FaithWall + wallpaper as subject, not "rotating wallpaper" keyword/titles)
  ['wallpaper-rotates', /\b(?:FaithWall|Faith ?Wall)'?s?\b[^.,;]{0,60}\bwallpaper\b[^.,;]{0,30}\b(?:rotates|cycles|changes (?:itself|by itself|automatically|every)|auto-?rotates)\b/i, null],
  // free about FaithWall (copula or adjective on the brand); allow "free to download|install", questions
  ['free-claim', /\bFaith ?Wall\b(?:'s)?\s+(?:is|are|was|stays|remains)\s+(?:a\s+|an\s+)?(?:completely\s+|totally\s+|100%\s+|truly\s+|also\s+)?free\b(?!\s+to\s+(?:download|install|get))|\bfree\s+(?:app|Bible app)\b[^.]{0,20}\bFaith ?Wall\b|\bFaith ?Wall\b[^.?]{0,40}\b(?:for free|free of charge|at no cost|free forever|free tier|free version|free plan|no paywall)\b|\bFaith ?Wall\b[^.?]{0,40}\bcosts? nothing\b|\bno cost\b[^.]{0,30}\bFaith ?Wall\b/i, null, /\bno free tier\b|there is no free\b|has no free\b|not free\b|isn'?t free\b/i],
  ['price-or-trial', /\bFaith ?Wall\b[^.]{0,120}(?:\$\s?\d|€\s?\d|£\s?\d|\b\d+[- ]days?\s+(?:free\s+)?trial|\bfree trial\b|\b\d+\s+days?\s+free\b|\bper (?:week|month|year)\b|\/(?:wk|week|mo|month|yr|year)\b)/i, null],
  ['ios16-as-min', /\b(?:Faith ?Wall|the app)\b[^.]{0,100}\biOS\s?16(?:\.0)?(?:\+|\s+or\s+(?:later|newer|higher)|\s+and\s+(?:later|newer|up))|\b(?:requires?|needs?|minimum|min\.?)\s+(?:iOS\s*)?16(?:\.0)?\b|Platform\W{1,8}iOS 16|Minimum iOS\W{1,8}16|operatingSystem"?\W{1,6}iOS 16|^[-*\s]*iOS 16(?:\.0)?(?:\+|\s+or later|\s+and later)?\s*$/i, null, /widget|Glorify|Hallow|Focus|competitor/i],
  ['picks-for-you', /\b(?:Faith ?Wall|the app|it)\b[^.]{0,40}\b(?:picks|chooses|selects|curates|recommends|suggests|finds|matches)\b[^.]{0,25}\b(?:verses?|scriptures?|passages?)\b[^.]{0,15}\bfor you\b|\bverses?\s+(?:picked|chosen|selected|curated)\s+for\s+you\b|\bpersonali[sz]ed\s+(?:verses?|scripture)\b/i, null],
  ['unverified-feature', /\bFaith ?Wall\b[^.]{0,80}\b(?:no account (?:required|needed)|on-?device|offline|verse packs?|wallpaper packs?|themed packs?|ad-?free|no ads|Focus modes?\b)/i, null, /\bnever\b|\bno\b.{0,6}\bFocus|\blink\b/i],
  // bare (no brand needed): "No accounts required" / "without creating an account" is an unverified feature claim
  // wrong: FaithWall has a Bible browser with full chapter text (BibleExplorerView / VerseListView), so it is not "not a Bible reader"
  ['bible-reader-denial', /\b(?:Faith ?Wall|it|this app|the app)\s+(?:is(?:n'?t|\s+not|\s+no)|was(?:n'?t|\s+not)|(?:is\s+)?not|can'?t\s+be\s+used\s+as)\s+(?:really\s+|actually\s+)?(?:a|an)?\s*(?:full\s+|real\s+|proper\s+)?Bible(?:[- ]read(?:er|ing(?:\s+app)?)|\s+app)\b|(?:^|[-*(:;.—–]\s*|\bNo \()\s*not a (?:full\s+)?Bible(?:[- ]read(?:er|ing app)|\s+app)\b/i, null],
  ['no-account-bare', /\bno (?:user )?accounts?\b[^.]{0,30}\b(?:required|needed|necessary)\b|\bwithout (?:creating |signing up for |making )?an account\b/i, null],
];

// A sentence that states the ban itself ("never write ...") is not a violation.
const NEG = /\b(?:never|don'?t|do not|doesn'?t|does not|banned|avoid|no claim)\b/i;

// JSON keys that hold identifiers, not prose.
const SKIPKEYS = new Set(['keywords', 'slug', 'image', 'url', 'href', 'id', 'imageAlt', 'alternateName', 'related', 'featured']);

// A list item about another app ("**Fighter Verses** — ... verses chosen for you") that never names
// FaithWall can't make a FaithWall claim through a bare phrase, so the bare-phrase rules skip it.
const OTHER_APP_ITEM = /^\s*(?:[-*]\s+)?\*\*(?!Faith ?Wall\b)[^*]{2,60}\*\*/;
const BARE_RULES = new Set(['picks-for-you', 'rotate-own-set', 'no-account-bare', 'bible-reader-denial']);

// Widget rotation is an optional setting, off by default (SettingsView widgetRotationEnabled = false).
// A sentence about FaithWall's widget that says it rotates or shows random/fresh verses needs an opt-in
// qualifier in the same sentence. WARN in --all, FAIL on added lines in --diff.
const WIDGET_ROTATION = /\bwidgets?\b[^.]{0,140}\b(?:rotat\w*|auto-?rotat\w*|(?:will\s+)?change\w*\s+(?:to\s+)?(?:a\s+)?(?:different|new)\s+verse|(?:shows?|displays?|cycles? through|changes? to)\s+(?:random|fresh|new|different)\s+(?:Bible\s+)?verses?|random\s+(?:Bible\s+)?verses?|fresh\s+verses?)\b|\b(?:rotat\w*|random\s+(?:Bible\s+)?verses?|fresh\s+verses?)\b[^.]{0,100}\bwidgets?\b|\b(?:rotat\w*|cycl\w*|brings?|delivers?|pushes|swaps?)\b[^.;]{0,50}\b(?:itself|on its own|by itself|automatically)\b|\b(?:auto-?rotat\w*|rotates?)\s+(?:automatically|fresh|random|new|different)\b|\b(?:brings?|cycles?|delivers?|pushes)\s+(?:a\s+)?(?:fresh|new|random|different)\s+verses?\b|^[|\s]*Rotates automatically\b|\|\s*Rotates automatically\s*\|/i;
const ROTATION_OPT_IN = /\b(?:turn(?:s|ed)?\s+on|turning\s+on|switch(?:es|ed)?\s+on|enable[sd]?|opt(?:s|ed)?[- ]in|optional(?:ly)?(?!\?)|off by default|toggle|Auto-rotate verses|(?:only\s+)?(?:if|when)\s+you\s+(?:want|choose|decide|ask)|only\s+(?:if|when))\b/i;
// A bare "if you" or "setting" is not an opt-in; "by default" without "off" and "optional?" (a rhetorical denial) cancel one.
const NOT_OPT_IN = /\b(?<!off )by default\b|\boptional\?/i;
const hasOptIn = (t) => ROTATION_OPT_IN.test(t) && !NOT_OPT_IN.test(t);
const OTHER_APPS = /\b(?:YouVersion|Olive Tree|Glorify|Hallow|Bible Gateway|Logos|Pray\.com|Abide|Dwell|Blue Letter|Bible\.is|Abbey|Fighter Verses|competitors?|Quran ?Wall|Note ?Wall)\b/i;

// How the wallpaper updates (app truth): the user picks a verse, the app itself launches an Apple Shortcut that
// applies it, and it stays until the user picks another. Nothing runs in the background or on a schedule, a
// Shortcuts automation can only re-apply the last image, and the widget rotates only with the opt-in setting.
// wallpaper-automatic: a FaithWall sentence saying the wallpaper or lock-screen verse changes automatically.
// STRONG phrases are wrong in any FaithWall sentence; WEAK ones are skipped when the sentence is about the widget
// (widget rotation has its own soft rule above).
const AUTO_STRONG = /\btoday['’]s verse\b|\bnothing to (?:tap|open)\b|\bno opening required\b|\b(?:runs?|works?|updates?|changes?|refreshes|rotates?|applies|sets?|swaps?)\b[^.;]{0,50}\b(?:in the background|behind the scenes)\b|\bin the background\b|\bbehind the scenes\b|\bwhile the app is closed\b|\bShortcuts?\s+(?:you can\s+)?automat\w+|\bautomat\w*\s+Shortcuts?\b|\bShortcuts?\s+automations?\b[^.;]{0,60}\b(?:change|swap|update|new verse|different verse|rotat)/i;
const AUTO_WEAK = /\bautomatic(?:ally)?\b|\bby itself\b|\bon its own\b(?!\s+(?:lock|home)[- ]screen)|\bon a schedule\b|\b(?:wallpaper|lock[- ]screen|verse)\b[^.;]{0,50}\b(?:changes?|updates?|refreshes|swaps?|rotates?)\b[^.;]{0,30}\b(?:every day|daily|each (?:morning|day)|every morning|overnight)\b|\b(?:changes?|updates?|refreshes|swaps?|rotates?)\b[^.;]{0,50}\b(?:wallpaper|lock[- ]screen|verse)s?\b[^.;]{0,40}\b(?:every day|daily|each (?:morning|day)|every morning|overnight)\b|\b(?:updates?|changes?|refreshes|swaps?|rotates?)\s+itself\b|\bkeeps?\b[^.;]{0,40}\b(?:wallpaper|lock[- ]screen|verse)s?\b[^.;]{0,30}\bfresh\b|\b(?:new|fresh|different)\s+(?:verse|wallpaper)\b[^.;]{0,30}\b(?:every day|each (?:morning|day)|every morning|daily)\b/i;
const AUTO_SKIP = /\b(?:renew\w*|subscri\w+|billed|billing|cancel\w*|trial|sync\w*|iCloud|backup|terminat\w*|licen[sc]e\w*)\b/i;
// wallpaper-widget-combo: a FaithWall sentence recommending a wallpaper plus a rotating or daily widget in one setup.
// The setups are alternatives (Settings > Change Setup Mode switches between them).
const WP_WIDGET_COMBO = /\b(?:run|runs|running|use|using|pair|combine|stack|layer)\s+both\b|\b(?:wallpaper|widget)s?\b[^.;]{0,30}\b(?:and|with|alongside)\b[^.;]{0,20}\b(?:widget|wallpaper)s?\b[^.;]{0,40}\b(?:together|at the same time|side by side|both|simultaneously)\b|\balongside\s+(?:its|the|a|your)\s+(?:widget|wallpaper)\b|\bpairs?\s+(?:a|the|your)\s+wallpaper\s+with\s+(?:a|the|its)\s+widget\b|\bboth together\b|\b(?:widget|wallpaper)\s*\+\s*(?:widget|wallpaper)\b|\bcombo\b[^.;]{0,40}\b(?:wallpaper|widget)s?\b|\b(?:wallpaper|widget)s?\b[^.;]{0,40}\bcombo\b|\bwallpaper\b[^.;]{0,100}\b(?:plus|with|and|alongside|together with|as well as)\s+(?:a\s+|an\s+|its\s+|the\s+)?(?:small\s+|lock[- ]screen\s+|rotating\s+|daily\s+)*widget\b[^.;]{0,50}\b(?:rotat\w*|daily|fresh|random|new verses?|different verses?|every day)\b|\banchor\b[^.;]{0,60}\bwallpaper\b[^.;]{0,80}\b(?:daily|rotat\w*|fresh|random)\b[^.;]{0,50}\bwidget\b|\bwidget\b[^.;]{0,60}\b(?:on top of|above|over)\s+(?:the\s+|your\s+)?(?:wallpaper|anchor)\b|\bwidgets?\b[^.;]{0,60}\b(?:rotat\w*|fresh|daily|random)\b[^.;]{0,60},?\s+(?:and|plus|with)\s+(?:a\s+|an\s+|the\s+)?(?:Shortcuts?[- ](?:applied|based)\s+)?wallpaper\b/i;

// facts.json counts: a "<N> translations" / "<N> languages" claim about FaithWall must match.
const COUNT_CLAIMS = [
  ['translations', /(?<![\d,.])(\d{1,3})\+?\s+(?:Bible\s+)?translations\b/gi, facts.translationCount],
  ['languages', /(?<![\d,.])(\d{1,3})\+?\s+(?:interface\s+|app\s+|display\s+)?languages\b/gi, facts.uiLanguageCount],
];

// true while linting a file that is wholly about FaithWall (public/*.txt|md), where bullets need no brand name
let FW_DOC = false;

/** Lint one piece of text. Pushes { id, s } into `out`. */
function lintText(text, out) {
  const aboutOtherApp = OTHER_APP_ITEM.test(text) && !/Faith ?Wall/i.test(text);
  for (const s of text.split(/(?<=[.!?])["']?\s+/)) {
    for (const [id, re, , allow] of rules) {
      if (aboutOtherApp && BARE_RULES.has(id)) continue;
      if (!re.test(s)) continue;
      if (allow && allow.test(s)) continue;
      if (NEG.test(s)) continue;
      out.push({ id, s: s.replace(/\s+/g, ' ').slice(0, 190) });
    }
    // facts.json counts
    const aboutFw = /Faith ?Wall/i.test(s) || FW_DOC;
    if (aboutFw && !OTHER_APPS.test(s) && !NEG.test(s) && !/\bone of\s+\d/i.test(s)) {
      for (const [what, re, want] of COUNT_CLAIMS) {
        if (want === undefined) continue;
        for (const m of s.matchAll(re)) {
          if (Number(m[1]) !== want) out.push({ id: 'count-mismatch', s: `${m[0]} (facts.json ${what === 'translations' ? 'translationCount' : 'uiLanguageCount'} is ${want}): ${s.replace(/\s+/g, ' ').slice(0, 150)}` });
        }
      }
    }
    // wallpaper update flow: no automatic change (a), no wallpaper-plus-rotating-widget in one setup (b)
    if (aboutFw && !(aboutOtherApp && !FW_DOC) && !/\?\s*["']?\s*$/.test(s) && !NEG.test(s) && !/\b(?:another|other) apps?\b/i.test(s)) {
      for (const c of s.split(/;\s+/)) {
        const fwClause = /Faith ?Wall/i.test(c) || FW_DOC;
        if (!fwClause || (OTHER_APPS.test(c) && !/Faith ?Wall/i.test(c)) || AUTO_SKIP.test(c)) continue;
        const widgetClause = /\bwidgets?\b/i.test(c);
        if (AUTO_STRONG.test(c) || (!widgetClause && AUTO_WEAK.test(c))) {
          out.push({ id: 'wallpaper-automatic', s: s.replace(/\s+/g, ' ').slice(0, 190) });
          break;
        }
      }
      const comboWords = /\bcombo\b|\bboth together\b|\brun both\b|\bat the same time\b|\byou get both\b|\bside by side\b|\bsimultaneously\b|\balongside\b|\btogether\b/i;
      const bothNamed = /\bwallpapers?\b/i.test(s) && /\bwidgets?\b/i.test(s) && /\b(?:at the same time|you get both|side by side|simultaneously)\b/i.test(s);
      if ((WP_WIDGET_COMBO.test(s) || bothNamed) && !OTHER_APPS.test(s) && !(hasOptIn(s) && !comboWords.test(s))) {
        out.push({ id: 'wallpaper-widget-combo', s: s.replace(/\s+/g, ' ').slice(0, 190) });
      }
    }
    // widget rotation default
    if (aboutFw && !(aboutOtherApp && !FW_DOC) && !OTHER_APPS.test(s) && !/\?\s*["']?\s*$/.test(s) && !/\b(?:another|other) apps?\b/i.test(s) && WIDGET_ROTATION.test(s) && !hasOptIn(s)) {
      out.push({ id: 'widget-rotation-default', soft: true, s: s.replace(/\s+/g, ' ').slice(0, 190) });
    }
  }
}

/** Walk a parsed JSON value, linting every prose string. */
function walkJson(node, loc, file, out) {
  if (typeof node === 'string') {
    const found = [];
    lintText(node, found);
    for (const h of found) out.push({ ...h, loc });
    return;
  }
  if (Array.isArray(node)) {
    node.forEach((n, i) => walkJson(n, `${loc}[${i}]`, file, out));
    return;
  }
  if (node && typeof node === 'object') {
    // A comparison row's FaithWall cell may describe a competitor-relative feature; only lint it when
    // the feature is about FaithWall itself or a generic one.
    const compRow = 'feature' in node && 'faithwall' in node && node.feature !== 'FaithWall' &&
      !/^(Pricing model|Lock-screen format|Wallpaper)/.test(node.feature);
    // seo-priorities.json: only pending items are future copy; done/closed items are history.
    if (file.endsWith('seo-priorities.json') && 'status' in node && node.status !== 'pending') return;
    for (const k of Object.keys(node)) {
      if (k.startsWith('_')) continue;
      if (SKIPKEYS.has(k)) continue;
      if (compRow && k === 'faithwall') continue;
      walkJson(node[k], `${loc}.${k}`, file, out);
    }
  }
}

/** Lint a whole file. Returns hits { id, loc, s, lines: number[] | null } (lines: 1-based candidate lines). */
function lintFile(abs) {
  const txt = readFileSync(abs, 'utf8');
  const hits = [];
  FW_DOC = /^public\/[^/]+\.(txt|md)$/.test(rel(abs));
  if (abs.endsWith('.json')) {
    let data;
    try { data = JSON.parse(txt); } catch (e) {
      return [{ id: 'json-parse', loc: '', s: `JSON does not parse: ${e.message}`, lines: null }];
    }
    const found = [];
    walkJson(data, '', abs, found);
    for (const h of found) hits.push({ ...h, lines: jsonLines(txt, h.s) });
  } else {
    txt.split('\n').forEach((ln, i) => {
      const found = [];
      lintText(ln, found);
      for (const h of found) hits.push({ ...h, loc: `L${i + 1}`, lines: [i + 1] });
    });
  }
  return hits;
}

/** Candidate 1-based line numbers where a JSON string value containing `sentence` sits in the raw file. */
function jsonLines(raw, sentence) {
  const needles = [JSON.stringify(sentence).slice(1, -1)];
  // The hit text was whitespace-collapsed and truncated; also try a prefix without risky characters.
  const safe = sentence.slice(0, 60).replace(/[^\x20-\x7e]/g, '\0').split('\0')[0].trim();
  if (safe.length >= 12) needles.push(JSON.stringify(safe).slice(1, -1));
  const lines = new Set();
  for (const n of needles) {
    let from = 0;
    for (;;) {
      const at = raw.indexOf(n, from);
      if (at < 0) break;
      lines.add(raw.slice(0, at).split('\n').length);
      from = at + n.length;
    }
    if (lines.size) break;
  }
  return lines.size ? [...lines] : null; // null: could not locate, treat as overlapping
}

// ---------------------------------------------------------------- file sets

function walk(dir, out = []) {
  if (!existsSync(dir)) return out;
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    if (e.name === 'node_modules' || e.name === '.git') continue;
    const p = join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else out.push(p);
  }
  return out;
}

const LINTABLE = /\.(tsx?|json|html|md|txt)$/;
const rel = (abs) => relative(ROOT, abs).split(sep).join('/');

function isLintable(relPath) {
  if (!LINTABLE.test(relPath)) return false;
  if (relPath.startsWith('src/') || relPath.startsWith('.claude/skills/')) return true;
  if (relPath === 'index.html') return true;
  return /^public\/[^/]+\.(txt|md)$/.test(relPath);
}

function allFiles() {
  return [
    ...walk(join(ROOT, 'src')),
    join(ROOT, 'index.html'),
    ...walk(join(ROOT, 'public')).filter((f) => /^public\/[^/]+\.(txt|md)$/.test(rel(f))),
    ...walk(join(ROOT, '.claude/skills')),
  ].filter((f) => existsSync(f) && isLintable(rel(f)));
}

// ---------------------------------------------------------------- diff mode

function git(args) {
  return execFileSync('git', args, { cwd: ROOT, encoding: 'utf8', maxBuffer: 256 * 1024 * 1024 });
}

/** Parse `git diff -U0` output into Map<relPath, Array<[start, end]>> of added line ranges. */
function parseAdded(diffText, into) {
  let file = null;
  for (const ln of diffText.split('\n')) {
    if (ln.startsWith('+++ ')) {
      file = ln === '+++ /dev/null' ? null : ln.replace(/^\+\+\+ b\//, '');
    } else if (file && ln.startsWith('@@')) {
      const m = /^@@ -\d+(?:,\d+)? \+(\d+)(?:,(\d+))? @@/.exec(ln);
      if (!m) continue;
      const start = Number(m[1]);
      const count = m[2] === undefined ? 1 : Number(m[2]);
      if (count === 0) continue;
      if (!into.has(file)) into.set(file, []);
      into.get(file).push([start, start + count - 1]);
    }
  }
}

function addedRanges(base, worktree) {
  const map = new Map();
  parseAdded(git(['diff', `${base}...HEAD`, '-U0', '--no-color', '--no-ext-diff']), map);
  if (worktree) {
    parseAdded(git(['diff', 'HEAD', '-U0', '--no-color', '--no-ext-diff']), map);
    for (const f of git(['ls-files', '--others', '--exclude-standard']).split('\n').filter(Boolean)) {
      if (!isLintable(f)) continue;
      const n = readFileSync(join(ROOT, f), 'utf8').split('\n').length;
      if (!map.has(f)) map.set(f, []);
      map.get(f).push([1, n]);
    }
  }
  return map;
}

// ---------------------------------------------------------------- reporting

const results = []; // { level: 'FAIL' | 'WARN', rule, where, msg }
const fail = (rule, where, msg) => results.push({ level: 'FAIL', rule, where, msg });
const warn = (rule, where, msg) => results.push({ level: 'WARN', rule, where, msg });

function report() {
  const byRule = new Map();
  for (const r of results) {
    const k = `${r.level} ${r.rule}`;
    if (!byRule.has(k)) byRule.set(k, []);
    byRule.get(k).push(r);
  }
  for (const [k, list] of [...byRule].sort((a, b) => a[0].localeCompare(b[0]))) {
    console.log(`\n## ${k} (${list.length})`);
    for (const r of list) console.log(`${r.where}${r.where ? '  ' : ''}${r.msg}`);
  }
  const nFail = results.filter((r) => r.level === 'FAIL').length;
  const nWarn = results.length - nFail;
  console.log(`\nlint-facts: ${nFail} FAIL, ${nWarn} WARN`);
  process.exit(nFail > 0 ? 1 : 0);
}

// ---------------------------------------------------------------- text modes

function runText(files, rangesByFile) {
  for (const abs of files) {
    const r = rel(abs);
    const ranges = rangesByFile ? rangesByFile.get(r) : null;
    if (rangesByFile && !ranges) continue; // not changed
    for (const h of lintFile(abs)) {
      if (ranges) {
        const inAdded = h.lines === null || h.lines.some((l) => ranges.some(([a, b]) => l >= a && l <= b));
        if (!inAdded) continue;
      }
      // soft rules: WARN in --all, FAIL on added lines in --diff
      if (h.soft && !ranges) warn(h.id, `${r} ${h.loc}`, h.s);
      else fail(h.id, `${r} ${h.loc}`, h.s);
    }
  }
}

function runPrompts(files) {
  for (const f of files) {
    const abs = f.startsWith('/') ? f : join(process.cwd(), f);
    if (!existsSync(abs)) { fail('prompt-missing', f, 'file not found'); continue; }
    const txt = readFileSync(abs, 'utf8');
    FW_DOC = false;
    txt.split('\n').forEach((ln, i) => {
      const found = [];
      lintText(ln, found);
      for (const h of found) fail(h.id, `${f} L${i + 1}`, h.s);
    });
  }
}

// ---------------------------------------------------------------- dist mode

function readHeldSlugs() {
  const src = readFileSync(join(ROOT, 'src/data/conversionHold.ts'), 'utf8');
  const block = /HOLD_BLOG_SLUGS[^=]*=\s*new Set\(\[([\s\S]*?)\]\)/.exec(src);
  if (!block) return [];
  return [...block[1].replace(/\/\/.*$/gm, '').matchAll(/'([^']+)'|"([^"]+)"/g)].map((m) => m[1] || m[2]);
}

function* walkJsonLdNodes(v) {
  if (Array.isArray(v)) { for (const x of v) yield* walkJsonLdNodes(x); return; }
  if (v && typeof v === 'object') {
    yield v;
    for (const k of Object.keys(v)) yield* walkJsonLdNodes(v[k]);
  }
}

const typesOf = (n) => [].concat(n['@type'] || []);

function runDist() {
  const DIST = join(ROOT, 'dist');
  if (!existsSync(DIST)) { fail('dist-missing', 'dist/', 'dist/ does not exist: run `npm run build` first'); return; }

  const htmlFiles = walk(DIST).filter((f) => f.endsWith('.html'));
  const apps = []; // { file, node }
  const mid = new Map(); // file -> count of data-install-card="mid"
  let linkCount = 0;

  for (const abs of htmlFiles) {
    const r = rel(abs);
    const buf = readFileSync(abs);
    // (3) NUL bytes: React 18.3.1 writeStringChunk bug, stripped in prerender.mjs.
    if (buf.includes(0)) fail('dist-nul', r, 'contains NUL bytes');
    const html = buf.toString('utf8');

    // (1) App Store links
    for (const m of html.matchAll(/<a\b[^>]*?\bhref="([^"]*)"/gi)) {
      const href = m[1].replace(/&amp;/g, '&');
      if (!href.includes(`/id${APP_ID}`)) continue;
      linkCount += 1;
      if (href.includes('apps.apple.com/account/')) continue;
      let u;
      try { u = new URL(href, 'https://faithwall.app'); } catch { fail('dist-link', r, `unparseable App Store link: ${href}`); continue; }
      if (u.searchParams.get('pt') !== PT) fail('dist-link-pt', r, `pt != ${PT}: ${href}`);
      const ct = u.searchParams.get('ct');
      if (!ct) fail('dist-link-ct', r, `no ct: ${href}`);
      else if (!CAMPAIGN_TOKENS.includes(ct)) fail('dist-link-ct', r, `ct "${ct}" is not one of the 12 tokens: ${href}`);
    }
    // Smart App Banner carries a campaign too.
    const banner = /<meta\s+name="apple-itunes-app"\s+content="([^"]*)"/i.exec(html);
    if (banner) {
      const content = banner[1].replace(/&amp;/g, '&');
      const ct = /[?&,\s]ct=([^&,\s]+)/.exec(content)?.[1];
      const pt = /(?:^|[?&,\s=])pt=([^&,\s]+)/.exec(content)?.[1];
      if (pt !== PT) fail('dist-link-pt', r, `apple-itunes-app pt != ${PT}: ${content}`);
      if (!ct || !CAMPAIGN_TOKENS.includes(ct)) fail('dist-link-ct', r, `apple-itunes-app ct "${ct}" is not one of the 12 tokens`);
    }

    // (2) JSON-LD
    let websites = 0;
    for (const m of html.matchAll(/<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)) {
      let data;
      try { data = JSON.parse(m[1]); } catch (e) { fail('dist-jsonld', r, `JSON-LD does not parse: ${e.message}`); continue; }
      for (const node of walkJsonLdNodes(data)) {
        const types = typesOf(node);
        if (types.includes('MobileApplication') || types.includes('SoftwareApplication')) apps.push({ file: r, node });
        if (types.includes('WebSite')) {
          websites += 1;
          const alt = node.alternateName;
          if (!alt || (Array.isArray(alt) && alt.length === 0)) fail('dist-website', r, 'WebSite node has no alternateName');
        }
        if ('aggregateRating' in node || types.includes('AggregateRating')) fail('dist-aggregate-rating', r, 'aggregateRating in JSON-LD');
      }
    }
    if (websites !== 1) fail('dist-website', r, `expected exactly one WebSite node, found ${websites}`);

    // (6) install card counts
    mid.set(r, (html.match(/data-install-card="mid"/g) || []).length);
  }

  // (2) one app node site-wide, on dist/index.html only
  if (apps.length !== 1) fail('dist-app-node', 'dist/', `expected exactly one MobileApplication/SoftwareApplication node site-wide, found ${apps.length}${apps.length ? ` (${apps.map((a) => a.file).join(', ')})` : ''}`);
  for (const a of apps) {
    if (a.file !== 'dist/index.html') fail('dist-app-node', a.file, 'app node must be on the home page only');
    if (a.node.operatingSystem !== facts.minIOSText) fail('dist-app-node', a.file, `operatingSystem "${a.node.operatingSystem}" != "${facts.minIOSText}"`);
    if (a.node.downloadUrl !== facts.storeUrl) fail('dist-app-node', a.file, `downloadUrl "${a.node.downloadUrl}" != "${facts.storeUrl}"`);
  }

  // (4) 404.html
  const nf = join(DIST, '404.html');
  if (!existsSync(nf)) fail('dist-404', 'dist/404.html', 'missing');
  else {
    const html = readFileSync(nf, 'utf8');
    if (!/<div id="root" data-not-found="1">/.test(html)) fail('dist-404', 'dist/404.html', 'root is not <div id="root" data-not-found="1">');
    const robots = [...html.matchAll(/<meta\b[^>]*\bname="robots"[^>]*>/gi)].map((m) => m[0]);
    if (robots.length !== 1) fail('dist-404', 'dist/404.html', `expected exactly one robots meta, found ${robots.length}`);
    else if (!/noindex/i.test(robots[0])) fail('dist-404', 'dist/404.html', `robots meta is not noindex: ${robots[0]}`);
    if (/<link\b[^>]*rel="canonical"/i.test(html)) fail('dist-404', 'dist/404.html', 'has a canonical link');
  }

  // (5) every sitemap <loc> maps to a dist file
  const distSitemap = join(DIST, 'sitemap.xml');
  const sitemapPaths = new Set();
  if (!existsSync(distSitemap)) fail('dist-sitemap', 'dist/sitemap.xml', 'missing');
  else {
    const xml = readFileSync(distSitemap, 'utf8');
    for (const m of xml.matchAll(/<loc>([^<]+)<\/loc>/g)) {
      const u = new URL(m[1].trim());
      const p = u.pathname.replace(/\/$/, '') || '/';
      sitemapPaths.add(p);
      const file = p === '/' ? join(DIST, 'index.html') : join(DIST, p.slice(1), 'index.html');
      if (!existsSync(file)) fail('dist-sitemap', m[1], `no dist file (${rel(file)})`);
    }
  }
  // Prerendered pages that the sitemap does not list (informational).
  for (const abs of htmlFiles) {
    const r = rel(abs);
    if (r === 'dist/404.html') continue;
    const p = r === 'dist/index.html' ? '/' : '/' + r.replace(/^dist\//, '').replace(/\/index\.html$/, '');
    if (sitemapPaths.size && !sitemapPaths.has(p)) warn('dist-not-in-sitemap', r, `${p} is prerendered but not in the sitemap`);
  }

  // (6) held pages carry no mid card; no page carries more than one
  const held = [];
  for (const slug of readHeldSlugs()) held.push(`dist/blog/${slug}/index.html`);
  const pillars = JSON.parse(readFileSync(join(ROOT, 'src/data/pillars.json'), 'utf8'));
  for (const slug of Object.keys(pillars)) held.push(`dist/${slug}/index.html`);
  const comps = JSON.parse(readFileSync(join(ROOT, 'src/data/comparisons.json'), 'utf8'));
  for (const c of Object.values(comps)) held.push(`dist/${c.slug}/index.html`);
  for (const f of held) {
    if (!mid.has(f)) { fail('dist-held', f, 'held page not found in dist'); continue; }
    if (mid.get(f) > 0) fail('dist-held', f, 'held page carries a mid install card');
  }
  for (const [f, n] of mid) if (n > 1) fail('dist-mid-count', f, `${n} mid install cards (max 1)`);

  console.log(`dist: ${htmlFiles.length} html files, ${linkCount} App Store links, ${apps.length} app node(s), ${held.length} held pages checked`);
}

// ---------------------------------------------------------------- self-test

/** Each case: [text, ruleId, shouldHit, fwDoc?]. Exits 0 when every case behaves, 1 otherwise. */
function selfTest() {
  const cases = [
    // bible-reader-denial
    ['FaithWall is not a Bible reader.', 'bible-reader-denial', true],
    ["It isn't a Bible reader, so it complements either one.", 'bible-reader-denial', true],
    ['- Not a Bible reader', 'bible-reader-denial', true],
    ['No (not a Bible reader)', 'bible-reader-denial', true],
    ['The app is not a Bible-reading app.', 'bible-reader-denial', true],
    ['FaithWall has a built-in Bible browser (all books and chapters), but it is not a study app.', 'bible-reader-denial', false],
    ["FaithWall doesn't try to be a Bible-reading app, a journal, or a community.", 'bible-reader-denial', false],
    ['- **Pray.com** isn\'t a Bible reader.', 'bible-reader-denial', false],
    ['Free to download; a subscription unlocks it. Not a Bible-reading app — a verse you pick', 'bible-reader-denial', true],
    ['FaithWall is not a Bible app.', 'bible-reader-denial', true],
    ['FaithWall is not really a Bible reader.', 'bible-reader-denial', true],
    ["FaithWall isn't a Bible app for reading.", 'bible-reader-denial', true],
    ['FaithWall is no Bible reader.', 'bible-reader-denial', true],
    // count-mismatch
    ['FaithWall offers 40 translations of the Bible.', 'count-mismatch', true],
    ['The FaithWall interface comes in 12 languages.', 'count-mismatch', true],
    ['- Pick your own verse in 20 translations', 'count-mismatch', true, true],
    ['FaithWall offers 24 translations and a 10-language interface in 10 languages.', 'count-mismatch', false],
    ['YouVersion has 2,000 translations; FaithWall has 24 translations.', 'count-mismatch', false],
    ['The Bible has been translated into 3,000 languages.', 'count-mismatch', false],
    ['FaithWall quotes the KJV, one of 500 translations of the Bible.', 'count-mismatch', false],
    ['- App interface in 10 languages', 'count-mismatch', false, true],
    // widget-rotation-default (soft)
    ['FaithWall has a widget that starts with your verse and then shows random verses.', 'widget-rotation-default', true],
    ['FaithWall\'s lock-screen widget rotates fresh verses every hour.', 'widget-rotation-default', true],
    ['- **Widget**: a lock-screen widget that rotates random verses.', 'widget-rotation-default', true, true],
    ['FaithWall\'s widget shows the verse you picked; an optional setting (off by default) shows random verses instead.', 'widget-rotation-default', false],
    ['If you turn on rotation, the FaithWall widget shows random verses.', 'widget-rotation-default', false],
    ['YouVersion has a widget that rotates a new verse every day.', 'widget-rotation-default', false],
    ['- **Fighter Verses** has a widget that rotates random verses.', 'widget-rotation-default', false, true],
    ['FaithWall shows the verse you picked in a lock-screen widget.', 'widget-rotation-default', false],
    ["FaithWall's widget will change to a different verse each hour.", 'widget-rotation-default', true],
    ['Does the FaithWall widget rotate verses?', 'widget-rotation-default', false],
    ['FaithWall pairs well with a rotating-verse widget from another app.', 'widget-rotation-default', false],
    // widget-rotation-default: widened phrasings
    ['FaithWall brings a fresh verse on its own.', 'widget-rotation-default', true],
    ['FaithWall cycles a fresh verse onto your lock screen automatically.', 'widget-rotation-default', true],
    ['The direct answer: FaithWall is the only option here that rotates itself.', 'widget-rotation-default', true],
    ['| FaithWall | Wallpaper plus widget | Rotates automatically | Free download + subscription |', 'widget-rotation-default', true],
    ["FaithWall's widget brings a fresh verse on its own, hourly, every 8 hours or daily.", 'widget-rotation-default', true],
    ['FaithWall rotates verses only if you turn on the optional Auto-rotate verses setting.', 'widget-rotation-default', false],
    ['Auto-rotate verses exists only in the widget setup.', 'widget-rotation-default', false, true],
    ['The Bible App brings a fresh verse on its own.', 'widget-rotation-default', false],
    // wallpaper-automatic
    ["FaithWall puts today's verse on your lock screen automatically.", 'wallpaper-automatic', true],
    ['FaithWall runs in the background, nothing to open.', 'wallpaper-automatic', true],
    ['FaithWall applies the wallpaper through an Apple Shortcut you can automate — nothing to tap.', 'wallpaper-automatic', true],
    ['The FaithWall wallpaper changes every morning.', 'wallpaper-automatic', true],
    ['FaithWall is the app that makes that lock screen change automatically.', 'wallpaper-automatic', true],
    ['Hallow is what you open intentionally; FaithWall is what you see automatically.', 'wallpaper-automatic', true],
    ["- Puts today's verse on your lock screen", 'wallpaper-automatic', true, true],
    ['FaithWall changes your wallpaper while the app is closed.', 'wallpaper-automatic', true],
    ['A Shortcuts automation in FaithWall swaps the verse each day.', 'wallpaper-automatic', true],
    ['FaithWall asks for 60 seconds once, then works on its own.', 'wallpaper-automatic', true],
    ['The wallpaper never changes by itself.', 'wallpaper-automatic', false, true],
    ['FaithWall runs the Shortcut for you after you pick a verse.', 'wallpaper-automatic', false],
    ['If you turn on Auto-rotate verses, the FaithWall widget shows a fresh verse every day.', 'wallpaper-automatic', false],
    ["Hallow sends today's verse automatically; FaithWall keeps the verse you picked.", 'wallpaper-automatic', false],
    ['YouVersion puts the verse of the day on your lock screen automatically.', 'wallpaper-automatic', false],
    ['Does FaithWall change the wallpaper automatically?', 'wallpaper-automatic', false],
    ['FaithWall renews automatically unless you cancel in Settings.', 'wallpaper-automatic', false],
    ["- **Fighter Verses** shows today's verse automatically.", 'wallpaper-automatic', false, true],
    ['- Wallpaper: applied with an Apple Shortcut; it stays until you pick another verse.', 'wallpaper-automatic', false, true],
    ['FaithWall keeps the verse you picked on your lock screen until you pick another.', 'wallpaper-automatic', false],
    ['FaithWall changes your lock screen every morning.', 'wallpaper-automatic', true],
    ['FaithWall changes your wallpaper every day.', 'wallpaper-automatic', true],
    ['FaithWall updates your lock screen daily.', 'wallpaper-automatic', true],
    ['FaithWall swaps your wallpaper verse daily without you opening the app.', 'wallpaper-automatic', true],
    ['FaithWall rotates your wallpaper each morning.', 'wallpaper-automatic', true],
    ['Set it once and FaithWall keeps your wallpaper fresh every day.', 'wallpaper-automatic', true],
    ['Your FaithWall lock screen updates itself overnight.', 'wallpaper-automatic', true],
    ['FaithWall updates your wallpaper in the background.', 'wallpaper-automatic', true],
    ['FaithWall changes the verse in the background.', 'wallpaper-automatic', true],
    ['FaithWall works behind the scenes to update your wallpaper.', 'wallpaper-automatic', true],
    ["FaithWall's widget changes your wallpaper in the background, and the setting is easy to find.", 'wallpaper-automatic', true],
    ['FaithWall does not update your wallpaper in the background.', 'wallpaper-automatic', false],
    ['If you turn on Auto-rotate verses, the FaithWall widget rotates verses every day.', 'wallpaper-automatic', false],
    ['If you install FaithWall, the widget rotates fresh verses every hour.', 'widget-rotation-default', true],
    ['If you use FaithWall, the widget rotates random verses.', 'widget-rotation-default', true],
    ['The FaithWall widget shows random verses, and the setting is easy to find.', 'widget-rotation-default', true],
    ['If you turn on Auto-rotate verses, the FaithWall widget shows random verses.', 'widget-rotation-default', false],
    // wallpaper-widget-combo
    ["FaithWall's widget and wallpaper work together.", 'wallpaper-widget-combo', true],
    ["Run FaithWall's wallpaper alongside its widget.", 'wallpaper-widget-combo', true],
    ["Use FaithWall's wallpaper and widget at the same time.", 'wallpaper-widget-combo', true],
    ['FaithWall pairs a wallpaper with a widget so you get both.', 'wallpaper-widget-combo', true],
    ['FaithWall sits on your lock screen as a wallpaper, with a widget that rotates fresh verses.', 'wallpaper-widget-combo', true],
    ['Most people run both together: FaithWall for the wallpaper and its widget.', 'wallpaper-widget-combo', true],
    ['With FaithWall, use an anchor verse as the wallpaper and a daily rotation in a small widget.', 'wallpaper-widget-combo', true],
    ['FaithWall lets you run a wallpaper for one anchor verse plus a widget for daily rotation.', 'wallpaper-widget-combo', true],
    ["FaithWall's widget + wallpaper combo is the strongest setup.", 'wallpaper-widget-combo', true],
    ['FaithWall: a lock-screen widget that rotates fresh verses, and a Shortcuts-applied wallpaper.', 'wallpaper-widget-combo', true],
    ['FaithWall has two setups: a wallpaper or a widget.', 'wallpaper-widget-combo', false],
    ['FaithWall has two separate setups: the wallpaper setup keeps one verse until you pick another, and the widget setup shows your verse in a small widget.', 'wallpaper-widget-combo', false],
    ['FaithWall puts it on your lock screen as a wallpaper, or shows it in a widget with an optional Auto-rotate verses setting.', 'wallpaper-widget-combo', false],
    ['YouVersion offers a widget and a wallpaper with fresh verses daily.', 'wallpaper-widget-combo', false],
    ['- Wallpaper and widget are separate setups; you switch between them in Settings.', 'wallpaper-widget-combo', false, true],
  ];
  let bad = 0;
  for (const [text, id, want, doc] of cases) {
    FW_DOC = !!doc;
    const found = [];
    lintText(text, found);
    const got = found.some((h) => h.id === id);
    if (got !== want) { bad++; console.log(`SELF-TEST FAIL [${id}] expected ${want ? 'hit' : 'no hit'}: ${text}`); }
  }
  // soft hits must be WARN in --all (no ranges) and FAIL in --diff (ranges)
  FW_DOC = false;
  const soft = []; lintText('FaithWall has a widget that shows random verses.', soft);
  if (!soft.some((h) => h.id === 'widget-rotation-default' && h.soft === true)) { bad++; console.log('SELF-TEST FAIL widget-rotation-default is not soft'); }
  const hard = []; lintText('FaithWall is not a Bible reader.', hard);
  if (hard.some((h) => h.soft)) { bad++; console.log('SELF-TEST FAIL bible-reader-denial must not be soft'); }
  for (const [txt, id] of [["FaithWall puts today's verse on your lock screen automatically.", 'wallpaper-automatic'], ['FaithWall sits on your lock screen as a wallpaper, with a widget that rotates fresh verses.', 'wallpaper-widget-combo']]) {
    const h = []; lintText(txt, h);
    if (!h.some((x) => x.id === id) || h.some((x) => x.id === id && x.soft)) { bad++; console.log(`SELF-TEST FAIL ${id} must be a hard rule`); }
  }
  console.log(`lint-facts self-test: ${cases.length + 4} checks, ${bad} failed`);
  process.exit(bad ? 1 : 0);
}

// ---------------------------------------------------------------- main

const argv = process.argv.slice(2);
if (argv.includes('--self-test')) selfTest();

if (argv.length === 0 || argv.includes('--help') || argv.includes('-h')) {
  console.log('Usage: node scripts/lint-facts.mjs [--all] [--diff <base> [--worktree]] [--dist] [--prompts <files...>]');
  process.exit(argv.length === 0 ? 1 : 0);
}

const flag = (n) => argv.includes(n);
const valueOf = (n) => { const i = argv.indexOf(n); return i >= 0 ? argv[i + 1] : undefined; };

if (flag('--all')) runText(allFiles(), null);

if (flag('--diff')) {
  const base = valueOf('--diff');
  if (!base || base.startsWith('--')) { console.error('--diff needs a base ref'); process.exit(1); }
  try {
    git(['rev-parse', '--verify', '--quiet', `${base}^{commit}`]);
    const ranges = addedRanges(base, flag('--worktree'));
    runText(allFiles(), ranges);
  } catch (e) {
    fail('diff-base', base, `cannot diff against "${base}": ${String(e.message).split('\n')[0]}`);
  }
}

if (flag('--prompts')) {
  const i = argv.indexOf('--prompts');
  const files = [];
  for (const a of argv.slice(i + 1)) { if (a.startsWith('--')) break; files.push(a); }
  if (files.length === 0) { console.error('--prompts needs at least one file'); process.exit(1); }
  runPrompts(files);
}

if (flag('--dist')) runDist();

report();
