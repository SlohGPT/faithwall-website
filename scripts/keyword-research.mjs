#!/usr/bin/env node
/**
 * Keyword engine 1.0.0: first-party keyword analysis + a lint for the public keyword files.
 *
 * It never produces or invents a search volume. It reads Search Console (your own data), Google
 * Autocomplete (a few requests a day, hard capped) and your own robots.txt, writes everything to a
 * PRIVATE directory outside the repo, and lints the small public, qualitative files.
 *
 * No dependencies, no MCP, no third-party code. Node 18+ built-ins only.
 * The script holds nothing site-specific: every site setting lives in the config file
 * (src/data/kw-config.json, data/kw-config.json or kw-config.json; override with --config <path> or
 * the KW_CONFIG env var). Sister sites copy this file byte for byte and write only their own config.
 *
 *   node scripts/keyword-research.mjs <command> [options]
 *
 *   doctor [--online]      engine/node versions, config validation, private dir, credential status
 *                          (present yes|no, mode 600 yes|no, never the content), autocomplete budget,
 *                          cache, latest gsc pull, JSON round-trip check. --online asks Search Console
 *                          whether the configured property is reachable (exit 2 if it is not).
 *   gsc [--days N] [--end YYYY-MM-DD] [--country xxx] [--fresh]
 *                          pull query/page data (default 90 days ending today-3, all countries),
 *                          reuse a pull younger than 7 days (with no --end, the newest such pull for the
 *                          same days and country, whatever its end date), write analysis.json,
 *                          report.md and a number-free draft-clusters.json to <private>/gsc/<run-key>/.
 *                          A failed --fresh pull drops the run from the index, so it is never reused.
 *   expand [seeds...] [--from-config] [--file path] [--market id] [--modifiers] [--plan]
 *                          Google Autocomplete for seeds. 30 day cache, a locked per-day budget
 *                          (hard cap 15), stops at the first sign of trouble. --plan sends nothing.
 *                          --market is only the default for seeds that have no market of their own.
 *                          Seeds with an @, http, www. or a run of 5+ digits are refused (nothing
 *                          personal goes to Google). in_gsc uses the newest all-country pull. Each
 *                          suggestion that is not an exact GSC query also gets a PRIVATE near_gsc hint
 *                          {query, page}: the query of that pull with the highest token Jaccard (at
 *                          least 0.5) and its main page, else null. It is written to expand/<date>.json
 *                          and .md only, never to draft-clusters.json or a public file, and holds no number.
 *   check [--staged] [--self-test]
 *                          lint the public files (clusters file, docs dir, extra files, the config)
 *                          against the ban rules B1-B8 and the clusters schema. --staged reads the
 *                          staged blobs. --self-test runs every fixture offline (mock server only).
 *                          Staged files outside the engine-public set (clusters file, config, docs dir,
 *                          extra_public_files), such as seo-priorities.json or a journal entry under
 *                          docs/, are linted too (every text file under docs/ and src/data/, whatever
 *                          the extension; binary files and other folders are not scanned): B6 and the
 *                          hard B5 words (an absolute home path /Users/, /home/<name>/, C:\Users\ or
 *                          the percent-encoded %2FUsers%2F, .claude/secrets, service-account-key) FAIL;
 *                          merely NAMING a private file (~/.claude/..., <x>-gsc, <x>-gsc/kw, budget.json,
 *                          gsc-data*.json) and B1-B4 are WARN only, so the weekly refresh can commit.
 *                          Engine-public files keep every B rule as a FAIL (the config's private_dir and
 *                          gsc.key_path are the only places a private path may be named). B1 also
 *                          catches "searched" ("searched 300 times").
 *   geo-probe              fetch the live robots.txt, evaluate it per bot (RFC 9309) and send one
 *                          request per bot user agent; exit 4 if a search bot is blocked.
 *   bing | volumes | serp  stubs in 1.0.0 (no credentials, nothing is read or sent).
 *   help                   this text
 *
 * Global: --version, --config <path>.
 * Environment: KW_CONFIG (config path), GSC_KEY_FILE or GOOGLE_APPLICATION_CREDENTIALS (service
 * account key; else config gsc.key_path), BING_WMT_KEY_FILE (only stat()ed, never read).
 * Exit codes: 0 ok (incl. budget exhausted, "skipped: no credentials"), 1 check violations or
 * self-test failure, 2 a network source stopped (partial output kept; a busy budget lock counts as
 * a stop), 3 insufficient data, 4 geo-probe found a search-bot regression, 64 usage or config
 * error (also an unexpected I/O error, a corrupt budget.json or a missing Node 18+ fetch: exit 1
 * is reserved for check violations).
 *
 * Config notes: intent_rules patterns run on the NORMALISED query (lowercase, punctuation stripped,
 * so "?" never matches) and are compiled with the u flag. JavaScript's \b is ASCII-only: for words
 * that start or end in a non-ASCII letter use (?<![\p{L}\p{N}])word(?![\p{L}\p{N}]) instead.
 * Optional config key tool_pages: array of site paths (each starting with /) that are tool pages, default
 * []. A cluster whose target is one gets content_type tool-page. Page kinds for the prune-merge test: tool
 * page, home page (/), blog post (/blog/...), any other page; only two pages of the same kind that share a
 * query are cannibalisation, so a post next to a landing, legal, comparison or tool page is not (no prune-merge).
 * Private flag shared_pages (in the analysis and the report, never the draft) marks a cluster where two or
 * more pages hold 20%+ each, whatever the decision: a hold hides it, a new-post/new-tool next to it should
 * become "link the pages" (agent check).
 * Suggested decision rubric of `gsc` (first match wins; the agent decides, the engine only suggests):
 * navigational intent -> monitor; follow-up fragment -> monitor (the head matches the AI Mode fragment
 * words, a head of 2-6 words that ends in a bare pronoun such as "how can i change it", or, only when
 * gsc.regex_families is non-empty, the head has at most two words, does not match any
 * family pattern, and the family-matching members hold less than half of the cluster's impressions);
 * hold (main page on a hold); prune-merge (two pages share the query and are the same kind of page: both
 * tool pages, both blog posts or both other pages); long question (head of 9+ words): monitor when the main page is at position 5
 * or better, else faq-add on it; one page owns it (share 80%+): ctr-fix (position 10 or better) or
 * refresh (20 or better); aso-handoff; short question faq-add; tool new-tool; compare compare; new-post.
 * Normalisation folds the Turkish dotted capital I to i, so "İstanbul" and "istanbul" are one query;
 * a plain capital I becomes i (not the dotless ı).
 *
 * The engine writes nothing inside the repo. Private data (budget, cache, raw pulls, reports) lives
 * in config.private_dir with modes 700 (the kw dir) and 600 (files). Errors go through redact().
 *
 *   npm run kw -- <command>   = this script
 *   npm run kw:check          = check
 */
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import crypto from 'node:crypto';
import http from 'node:http';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

// ---------------------------------------------------------------- constants

export const ENGINE_VERSION = '1.0.0';
const HARD_CAP = 15; // autocomplete requests per site per UTC day, whatever the config says
const MIN_DAYS = 28; // days with impressions needed before "no demand" conclusions are allowed
const ROW_LIMIT = 25000; // Search Console page size
const ROW_CAP = 100000; // rows per pull
const MIN_IMPR = 10; // striking distance + draft minimum impressions
const STRIKE_MIN = 4;
const STRIKE_MAX = 20;
const GAP_POSITION = 20;
const CANNIBAL_SHARE = 0.2;
const CANNIBAL_MIN_IMPR = 5;
const JACCARD = 0.5; // leader clustering threshold
const NEAR_GSC = 0.5; // expand: token Jaccard for the private near_gsc hint
const REUSE_DAYS = 7; // gsc pull reuse window
const TTL_DAYS = 30; // autocomplete cache lifetime
const GAP_MS = 1500; // between suggest requests (plus jitter)
const JITTER_MS = 300;
const API_GAP_MS = 200; // between Search Console calls
const FETCH_TIMEOUT_MS = 10000;
const GSC_TIMEOUT_MS = 60000;
const LOCK_RETRY_MS = 100;
const LOCK_WAIT_MS = 5000;
const LOCK_STALE_MS = 30000;
const BUDGET_KEEP_DAYS = 14;
const DRAFT_TOP = 60;
const DRAFT_MEMBERS = 15;
const REPORT_TOP = 60;
const LIST_TOP = 50;
const STABLE_ID_JACCARD = 0.3;
const AI_FRAGMENT_WORDS = 9;
const FRAGMENT_FAMILY_SHARE = 0.5; // a short head is a topic when family-matching members hold at least this share of the cluster
const AI_FRAGMENT_RE = /^(and|or|but|so|also|what about|how about|are any|is any|any of|which one|which of|a few more|more|others?|them|those|these|it|that|another)\b/;
const AI_FRAGMENT_TAIL_RE = /\b(it|this|that|them|these|those)$/; // a short head that ends in a bare pronoun refers back to the conversation ("how can i change it")
const AI_FRAGMENT_TAIL_WORDS = 6;
const GENERIC_UA = `Mozilla/5.0 (compatible; kw-engine/${ENGINE_VERSION})`;
const SUGGEST_BASE = 'https://suggestqueries.google.com';
const GSC_BASE = 'https://www.googleapis.com';
const TOKEN_URL = 'https://oauth2.googleapis.com/token';
const GSC_SCOPE = 'https://www.googleapis.com/auth/webmasters.readonly';
const EXIT = { OK: 0, CHECK: 1, NET: 2, DATA: 3, GEO: 4, USAGE: 64 };

const INTENTS = ['question', 'tool', 'app-install', 'compare', 'mood', 'how-to', 'informational', 'navigational'];
const CONTENT_TYPES = ['blog', 'pillar', 'faq', 'tool-page', 'compare', 'money-page', 'aso-handoff', 'none'];
const DECISIONS = ['refresh', 'ctr-fix', 'depth-pass', 'prune-merge', 'faq-add', 'new-post', 'new-tool', 'compare', 'aso-handoff', 'hold', 'monitor', 'no-action'];
const EVIDENCE_TYPES = ['gsc', 'autocomplete', 'forum', 'bing', 'bing-grounding', 'ads', 'dataforseo'];
const SOURCE_REQUIRED = ['forum', 'ads', 'dataforseo'];
const VOLUME_BANDS = ['<10', '10-100', '100-1k', '1k-10k', '10k+'];
const CLUSTER_KEYS = ['id', 'name', 'head_keyword', 'members', 'intent', 'content_type', 'target_url', 'decision', 'hold_reason', 'held_until', 'aso_handoff', 'evidence', 'volume_band', 'queue_id', 'notes'];
const TOP_KEYS = ['engine_min_version', 'site', 'origin', 'private_dir', 'clusters_file', 'public_docs_dir', 'extra_public_files', 'sitemap_path', 'repo_robots_path', 'priorities_file', 'readonly_json', 'tool_pages', 'gsc', 'autocomplete', 'seeds', 'intent_rules', 'modifiers', 'stopwords', 'hold_lists', 'public_ban_phrases', 'geo'];

// Small generic English stopword list (site words come from config.stopwords).
const STOPWORDS = new Set(('a an the and or of for to in on at by with from is are was were be been am it its this that these those ' +
  'as into about i you your my me we our what how why when where which who whom do does did can could should would will vs not no').split(' '));

export class KwError extends Error {
  constructor(message, code = EXIT.USAGE) {
    super(message);
    this.name = 'KwError';
    this.code = code;
  }
}

// ---------------------------------------------------------------- small utils

export function redact(input) {
  let s = typeof input === 'string' ? input : input && typeof input.message === 'string' ? input.message : String(input);
  s = s.replace(/-----BEGIN [A-Z ]+-----[\s\S]*?(?:-----END [A-Z ]+-----|$)/g, '[redacted pem]');
  s = s.replace(/"?private_key(?:_id)?"?\s*:\s*"(?:[^"\\]|\\.)*"/gi, '"private_key": "[redacted]"');
  s = s.replace(/"?client_email"?\s*:\s*"(?:[^"\\]|\\.)*"/gi, '"client_email": "[redacted]"');
  s = s.replace(/["']?(access_token|refresh_token|id_token|client_secret|assertion)["']?\s*:\s*(?:"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')/gi, '"$1": "[redacted]"');
  s = s.replace(/["']?(access_token|refresh_token|id_token|client_secret|api[_-]?key|apikey|assertion)["']?\s*:\s*[^\s"',}&]+/gi, '$1: [redacted]');
  s = s.replace(/\b(authorization\s*[:=]\s*)(?:Basic|Bearer|Token|Digest)\s+[^\s"',}]+/gi, '$1[redacted]');
  s = s.replace(/Bearer\s+[A-Za-z0-9._~+\/=-]+/gi, 'Bearer [redacted]');
  s = s.replace(/ya29\.[A-Za-z0-9._-]+/g, '[redacted token]');
  s = s.replace(/eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]*/g, '[redacted jwt]');
  s = s.replace(/\b(api[_-]?key|key|access_token|refresh_token|id_token|client_secret|assertion|token)(=|%3D)([^&\s"'<>]+)/gi, '$1$2[redacted]');
  const home = os.homedir();
  if (home && home.length > 1) {
    const esc = (x) => x.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    s = s.replace(new RegExp(esc(home), 'gi'), '~');
    s = s.replace(new RegExp(esc(encodeURIComponent(home)), 'gi'), '~');
  }
  return s;
}

export function isoDate(d) {
  return d.toISOString().slice(0, 10);
}
export function validDate(s) {
  if (typeof s !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(s)) return false;
  const d = new Date(`${s}T00:00:00Z`);
  return !Number.isNaN(d.getTime()) && isoDate(d) === s;
}
export function addDays(dateStr, n) {
  const d = new Date(`${dateStr}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + n);
  return isoDate(d);
}
export function daysBetween(a, b) {
  return Math.round((new Date(`${b}T00:00:00Z`) - new Date(`${a}T00:00:00Z`)) / 86400000);
}

export function parseSemver(s) {
  const m = /^(\d+)\.(\d+)\.(\d+)$/.exec(String(s ?? ''));
  return m ? [Number(m[1]), Number(m[2]), Number(m[3])] : null;
}
export function cmpSemver(a, b) {
  const x = parseSemver(a);
  const y = parseSemver(b);
  if (!x || !y) return 0;
  for (let i = 0; i < 3; i++) if (x[i] !== y[i]) return x[i] < y[i] ? -1 : 1;
  return 0;
}

const isObj = (v) => v !== null && typeof v === 'object' && !Array.isArray(v);
const isStr = (v) => typeof v === 'string' && v.trim() !== '';
const isInt = (v) => Number.isInteger(v);

export function sleepSync(ms) {
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
}
const realSleep = (ms) => new Promise((r) => setTimeout(r, ms));

export function expandHome(p, home = os.homedir()) {
  if (p === '~') return home;
  if (typeof p === 'string' && p.startsWith('~/')) return path.join(home, p.slice(2));
  return p;
}

// Resolve symlinks of the deepest existing ancestor, so /tmp vs /private/tmp compare equal.
function realish(p) {
  let cur = path.resolve(p);
  const rest = [];
  for (;;) {
    try {
      return path.join(fs.realpathSync(cur), ...rest.reverse());
    } catch {
      const parent = path.dirname(cur);
      if (parent === cur) return path.resolve(p);
      rest.push(path.basename(cur));
      cur = parent;
    }
  }
}
// Compared lowercased: macOS and Windows volumes are case-insensitive, and refusing too much is the safe side.
export function isInside(root, dir) {
  const rel = path.relative(realish(root).toLowerCase(), realish(dir).toLowerCase());
  return !rel.startsWith('..') && !path.isAbsolute(rel);
}

export function readJsonSafe(file, fallback) {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch {
    return fallback;
  }
}

export function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true, mode: 0o700 });
}
export function writeAtomic(file, data) {
  ensureDir(path.dirname(file));
  const tmp = `${file}.tmp-${process.pid}`;
  fs.writeFileSync(tmp, data, { mode: 0o600 });
  fs.chmodSync(tmp, 0o600);
  fs.renameSync(tmp, file);
}
export function writeJson(file, obj) {
  writeAtomic(file, JSON.stringify(obj, null, 2) + '\n');
}
const modeOf = (p) => {
  try {
    return (fs.statSync(p).mode & 0o777).toString(8);
  } catch {
    return null;
  }
};

// ---------------------------------------------------------------- text, tokens, clusters

export function normalize(s) {
  // Turkish dotted capital I (U+0130) lowercases to i + U+0307; fold both spellings to a plain i.
  let t = String(s ?? '').normalize('NFKC').replace(/İ/g, 'i').toLowerCase().replace(/i̇/g, 'i');
  t = t.replace(/[‘’‛′ʼ]/g, "'").replace(/[“”„‟″]/g, '"');
  t = t.replace(/[^\p{L}\p{M}\p{N}\s'-]/gu, ' ');
  t = t.replace(/(?<![\p{L}\p{M}\p{N}])['-]+|['-]+(?![\p{L}\p{M}\p{N}])/gu, ' ');
  return t.replace(/\s+/g, ' ').trim();
}

export function slugify(s, max = 60) {
  const t = String(s ?? '').normalize('NFKD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  return (t.slice(0, max).replace(/-+$/g, '') || 'cluster');
}
function uniqueId(base, taken) {
  let id = base;
  for (let n = 2; taken.has(id); n++) {
    const suffix = `-${n}`;
    id = base.slice(0, 60 - suffix.length).replace(/-+$/g, '') + suffix;
  }
  taken.add(id);
  return id;
}

function stem(w) {
  return w.length > 3 && w.endsWith('s') && !w.endsWith('ss') ? w.slice(0, -1) : w;
}
const stopCache = new Map();
function stopSet(extra) {
  const key = extra.join('\u0001');
  let set = stopCache.get(key);
  if (!set) {
    set = new Set([...STOPWORDS, ...extra.map((x) => normalize(x))]);
    stopCache.set(key, set);
  }
  return set;
}
export function tokenSet(q, extraStop = []) {
  const stop = stopSet(extraStop);
  const words = normalize(q).split(' ').filter(Boolean);
  const kept = words.filter((w) => !stop.has(w));
  // A query made only of stopwords keeps its words, so those queries do not all collapse together.
  return new Set((kept.length ? kept : words).map(stem));
}
export function jaccard(a, b) {
  if (!a.size || !b.size) return 0;
  let inter = 0;
  for (const x of a) if (b.has(x)) inter++;
  return inter / (a.size + b.size - inter);
}

/**
 * Leader clustering. Items sorted by weight desc; an item joins the FIRST existing cluster whose
 * LEADER token set has Jaccard >= threshold, else it becomes a new leader. Never member chaining.
 * items: [{q, weight, ...}] -> [{leader, tokens, members: [item]}]
 */
export function leaderCluster(items, { stopwords = [], threshold = JACCARD } = {}) {
  const sorted = items
    .map((it, i) => ({ it, i }))
    .sort((a, b) => (b.it.weight ?? 0) - (a.it.weight ?? 0) || a.i - b.i)
    .map((x) => x.it);
  const sets = sorted.map((it) => tokenSet(it.q, stopwords));
  // Prefix filter: order tokens rarest first. Two sets with Jaccard >= t share a token inside the
  // first n - ceil(t*n) + 1 tokens of each, so only those prefixes are indexed and probed. The result
  // is exactly the naive "first leader with Jaccard >= t", without comparing against every leader.
  const df = new Map();
  for (const set of sets) for (const w of set) df.set(w, (df.get(w) ?? 0) + 1);
  const rarer = (a, b) => df.get(a) - df.get(b) || (a < b ? -1 : a > b ? 1 : 0);
  const prefixLen = (n) => Math.max(1, Math.min(n, n - Math.ceil(threshold * n - 1e-9) + 1));
  const clusters = [];
  const byToken = new Map();
  sorted.forEach((item, k) => {
    const tokens = sets[k];
    const n = tokens.size;
    let joined = -1;
    let prefix = [];
    if (n) {
      prefix = [...tokens].sort(rarer).slice(0, prefixLen(n));
      const cand = new Set();
      for (const w of prefix) for (const ci of byToken.get(w) ?? []) cand.add(ci);
      for (const ci of [...cand].sort((a, b) => a - b)) {
        const m = clusters[ci].tokens.size;
        if (m < threshold * n - 1e-9 || n < threshold * m - 1e-9) continue; // sizes alone rule it out
        if (jaccard(tokens, clusters[ci].tokens) >= threshold) {
          joined = ci;
          break;
        }
      }
    }
    if (joined >= 0) clusters[joined].members.push(item);
    else {
      clusters.push({ leader: item, tokens, members: [item] });
      const ci = clusters.length - 1;
      for (const w of prefix) {
        if (!byToken.has(w)) byToken.set(w, []);
        byToken.get(w).push(ci);
      }
    }
  });
  return clusters;
}

const intentRe = new Map();
// Compiled with the u flag so \p{L} lookarounds work; a pattern that is not valid under u falls back to plain i.
function compileIntent(pattern) {
  let re = intentRe.get(pattern);
  if (re === undefined) {
    try {
      re = new RegExp(pattern, 'iu');
    } catch {
      try {
        re = new RegExp(pattern, 'i');
      } catch {
        re = null;
      }
    }
    intentRe.set(pattern, re);
  }
  return re;
}
export function classifyIntent(q, config) {
  const n = normalize(q);
  for (const r of config.intent_rules ?? []) {
    const re = compileIntent(r.pattern);
    if (re && re.test(n)) return r.intent;
  }
  return 'informational';
}
export function findModifiers(q, config) {
  const words = new Set(normalize(q).split(' '));
  return (config.modifiers ?? []).filter((m) => words.has(normalize(m)));
}

export function pathOf(u) {
  let p;
  try {
    p = new URL(u, 'https://x.invalid').pathname;
  } catch {
    p = String(u);
  }
  return normPath(p);
}
export function normPath(p) {
  let s = String(p).trim().toLowerCase().replace(/[?#].*$/, '');
  if (!s.startsWith('/')) s = `/${s}`;
  if (s.length > 1) s = s.replace(/\/+$/g, '');
  return s || '/';
}

// ---------------------------------------------------------------- credentials

export function gscKeyPath(config, env = process.env) {
  const p = env.GSC_KEY_FILE || env.GOOGLE_APPLICATION_CREDENTIALS || config?.gsc?.key_path;
  if (p) return path.resolve(expandHome(p));
  return path.join(os.homedir(), 'GITHUB REPOS', 'karchi', 'scripts', 'service-account-key.json');
}
export function gscKeySource(config, env = process.env) {
  if (env.GSC_KEY_FILE) return 'env GSC_KEY_FILE';
  if (env.GOOGLE_APPLICATION_CREDENTIALS) return 'env GOOGLE_APPLICATION_CREDENTIALS';
  return config?.gsc?.key_path ? 'config gsc.key_path' : 'built-in default location (no key_path in the config)';
}
export function bingKeyPath(env = process.env) {
  return path.resolve(expandHome(env.BING_WMT_KEY_FILE || '~/.claude/secrets/bing-wmt.key'));
}
function credStatus(p) {
  try {
    const st = fs.statSync(p);
    return { present: true, mode600: (st.mode & 0o777) === 0o600 };
  } catch {
    return { present: false, mode600: false };
  }
}
const yn = (b) => (b ? 'yes' : 'no');

class NoCredentials extends Error {}

// ---------------------------------------------------------------- config

export function checkRe2(pattern) {
  if (typeof pattern !== 'string' || pattern === '') return 'pattern must be a non-empty string';
  try {
    new RegExp(pattern, 'i');
  } catch (e) {
    return `does not compile (${e.message})`;
  }
  let inClass = false;
  for (let i = 0; i < pattern.length; i++) {
    const ch = pattern[i];
    if (ch === '\\') {
      const n = pattern[i + 1];
      if (!inClass && n && /[1-9]/.test(n)) return 'backreferences are not supported by RE2';
      if (!inClass && n === 'k' && pattern[i + 2] === '<') return 'named backreferences are not supported by RE2';
      i++;
      continue;
    }
    if (ch === '[') inClass = true;
    else if (ch === ']') inClass = false;
    else if (!inClass && ch === '(' && pattern[i + 1] === '?') {
      const r = pattern.slice(i + 2, i + 4);
      if (r[0] === '=' || r[0] === '!' || r === '<=' || r === '<!') return 'lookarounds are not supported by RE2';
    }
  }
  return null;
}

function compiles(p) {
  try {
    new RegExp(p, 'i');
    return null;
  } catch (e) {
    return e.message;
  }
}

export function validateConfig(c) {
  const problems = [];
  const warnings = [];
  if (!isObj(c)) return { problems: ['config must be a JSON object'], warnings };
  for (const k of Object.keys(c)) if (!TOP_KEYS.includes(k)) warnings.push(`unknown top-level key: ${k}`);
  const need = (cond, msg) => {
    if (!cond) problems.push(msg);
  };
  need(typeof c.site === 'string' && /^(?=.{1,253}$)([a-z0-9]([a-z0-9-]*[a-z0-9])?\.)+[a-z]{2,}$/i.test(c.site), 'site: must be a hostname');
  let originOk = false;
  try {
    const u = new URL(c.origin);
    originOk = u.protocol === 'https:' && (u.pathname === '/' || u.pathname === '') && !u.search && !u.hash && !u.username;
  } catch {
    /* falls through */
  }
  need(originOk && /^https:\/\/[^/?#\s]+\/?$/.test(c.origin), 'origin: must be an https URL with no path');
  need(isStr(c.private_dir), 'private_dir: required string');
  need(isStr(c.clusters_file), 'clusters_file: required string');
  need(isStr(c.public_docs_dir), 'public_docs_dir: required string');
  if (c.engine_min_version !== undefined) need(parseSemver(c.engine_min_version), 'engine_min_version: must be semver x.y.z');

  if (!isObj(c.gsc)) problems.push('gsc: required object');
  else {
    need(isStr(c.gsc.property), 'gsc.property: required string');
    if (c.gsc.key_path !== undefined) need(isStr(c.gsc.key_path), 'gsc.key_path: must be a string');
    if (c.gsc.regex_families !== undefined) {
      if (!Array.isArray(c.gsc.regex_families)) problems.push('gsc.regex_families: must be an array');
      else {
        const ids = new Set();
        c.gsc.regex_families.forEach((f, i) => {
          if (!isObj(f) || !isStr(f.id) || !isStr(f.pattern)) return problems.push(`gsc.regex_families[${i}]: needs {id, pattern}`);
          if (!/^[a-z0-9][a-z0-9-]*$/.test(f.id)) problems.push(`gsc.regex_families[${i}].id: use lowercase letters, digits and hyphens`);
          if (ids.has(f.id)) problems.push(`gsc.regex_families[${i}].id: duplicate "${f.id}"`);
          ids.add(f.id);
          const e = checkRe2(f.pattern);
          if (e) problems.push(`gsc.regex_families[${i}].pattern: ${e}`);
        });
      }
    }
  }

  const marketIds = new Set();
  if (!isObj(c.autocomplete)) problems.push('autocomplete: required object');
  else {
    const a = c.autocomplete;
    need(isInt(a.daily_cap) && a.daily_cap >= 1 && a.daily_cap <= HARD_CAP, `autocomplete.daily_cap: integer 1-${HARD_CAP}`);
    if (!Array.isArray(a.markets) || !a.markets.length) problems.push('autocomplete.markets: non-empty array required');
    else {
      let sum = 0;
      a.markets.forEach((m, i) => {
        if (!isObj(m) || !isStr(m.id) || !isStr(m.hl) || !isStr(m.gl) || !isInt(m.cap) || m.cap < 0) return problems.push(`autocomplete.markets[${i}]: needs {id, hl, gl, cap (integer >= 0)}`);
        if (marketIds.has(m.id)) problems.push(`autocomplete.markets[${i}].id: duplicate "${m.id}"`);
        marketIds.add(m.id);
        sum += m.cap;
      });
      if (isInt(a.daily_cap) && sum > a.daily_cap) problems.push(`autocomplete.markets: caps sum to ${sum}, above daily_cap ${a.daily_cap}`);
    }
    if (a.modifiers !== undefined && !(Array.isArray(a.modifiers) && a.modifiers.every(isStr))) problems.push('autocomplete.modifiers: array of strings');
  }

  if (!Array.isArray(c.intent_rules) || !c.intent_rules.length) problems.push('intent_rules: non-empty array required');
  else
    c.intent_rules.forEach((r, i) => {
      if (!isObj(r) || !isStr(r.pattern)) return problems.push(`intent_rules[${i}]: needs {intent, pattern}`);
      if (!INTENTS.includes(r.intent)) problems.push(`intent_rules[${i}].intent: must be one of ${INTENTS.join(', ')}`);
      const e = compiles(r.pattern);
      if (e) problems.push(`intent_rules[${i}].pattern: does not compile (${e})`);
      else {
        try {
          new RegExp(r.pattern, 'iu');
        } catch {
          warnings.push(`intent_rules[${i}].pattern: not valid with the u flag (unneeded escapes?); \\p{L} lookarounds will not work in it`);
        }
        if (/\\b[^\x00-\x7F]|[^\x00-\x7F]\\b/.test(r.pattern)) warnings.push(`intent_rules[${i}].pattern: \\b is ASCII-only in JavaScript and will not match next to a non-ASCII letter; use (?<![\\p{L}\\p{N}])word(?![\\p{L}\\p{N}])`);
        if (/\\\?/.test(r.pattern)) warnings.push(`intent_rules[${i}].pattern: patterns run on the normalised query, which has no punctuation, so \\? never matches`);
      }
    });

  if (!isObj(c.geo)) problems.push('geo: required object');
  else {
    for (const k of ['paths', 'search_bots', 'training_bots']) if (!Array.isArray(c.geo[k]) || !c.geo[k].every(isStr)) problems.push(`geo.${k}: array of strings required`);
    if (Array.isArray(c.geo.paths) && !c.geo.paths.every((p) => typeof p === 'string' && p.startsWith('/'))) problems.push('geo.paths: every path must start with /');
    if (!isObj(c.geo.user_agents) || !Object.values(c.geo.user_agents).every(isStr)) problems.push('geo.user_agents: object of strings required');
  }

  if (c.seeds !== undefined) {
    if (!Array.isArray(c.seeds)) problems.push('seeds: must be an array');
    else
      c.seeds.forEach((s, i) => {
        if (!isObj(s) || !isStr(s.seed)) return problems.push(`seeds[${i}]: needs {seed, market?}`);
        if (s.market !== undefined && !marketIds.has(s.market)) problems.push(`seeds[${i}].market: unknown market "${s.market}"`);
      });
  }
  if (c.tool_pages !== undefined && !(Array.isArray(c.tool_pages) && c.tool_pages.every((p) => isStr(p) && p.startsWith('/')))) problems.push('tool_pages: array of site paths, each starting with /');
  for (const k of ['modifiers', 'stopwords', 'readonly_json', 'extra_public_files'])
    if (c[k] !== undefined && !(Array.isArray(c[k]) && c[k].every(isStr))) problems.push(`${k}: array of strings`);
  for (const k of ['sitemap_path', 'repo_robots_path', 'priorities_file']) if (c[k] !== undefined && !isStr(c[k])) problems.push(`${k}: must be a string`);
  if (c.hold_lists !== undefined) {
    if (!Array.isArray(c.hold_lists)) problems.push('hold_lists: must be an array');
    else
      c.hold_lists.forEach((h, i) => {
        if (!isObj(h) || !validDate(h.until) || !isStr(h.reason) || !Array.isArray(h.urls) || !h.urls.every(isStr)) problems.push(`hold_lists[${i}]: needs {until YYYY-MM-DD, reason, urls[]}`);
      });
  }
  if (c.public_ban_phrases !== undefined) {
    if (!Array.isArray(c.public_ban_phrases)) problems.push('public_ban_phrases: must be an array');
    else
      c.public_ban_phrases.forEach((p, i) => {
        const e = isStr(p) ? compiles(p) : 'not a string';
        if (e) problems.push(`public_ban_phrases[${i}]: ${e}`);
      });
  }
  return { problems, warnings };
}

export function findRepoRoot(cwd) {
  try {
    const out = execFileSync('git', ['rev-parse', '--show-toplevel'], { cwd, stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim();
    if (out) return out;
  } catch {
    /* not a git repo */
  }
  return cwd;
}

export function resolveConfigPath(root, flag, env = process.env) {
  if (flag) return path.resolve(flag);
  if (env.KW_CONFIG) return path.resolve(env.KW_CONFIG);
  for (const rel of ['src/data/kw-config.json', 'data/kw-config.json', 'kw-config.json']) {
    const p = path.join(root, rel);
    if (fs.existsSync(p)) return p;
  }
  return null;
}

export function resolvePrivateDir(config, root) {
  const dir = path.resolve(root, expandHome(config.private_dir));
  if (isInside(root, dir)) throw new KwError(`private_dir resolves inside the repo (${redact(dir)}); refusing. Point it outside the repo.`, EXIT.USAGE);
  // The kw dir gets chmod 700: never the home folder, a parent of it, or a parent of the repo.
  if (isInside(dir, os.homedir()) || isInside(dir, root)) throw new KwError(`private_dir (${redact(dir)}) is the home folder or a parent of it or of the repo; refusing. Use a dedicated folder such as ~/.claude/<site>-gsc/kw.`, EXIT.USAGE);
  return dir;
}
export function ensurePrivateDir(dir) {
  const existed = fs.existsSync(dir);
  fs.mkdirSync(dir, { recursive: true, mode: 0o700 });
  fs.chmodSync(dir, 0o700);
  return { created: !existed };
}

// ---------------------------------------------------------------- holds

export function extractPaths(text) {
  const out = new Set();
  const s = String(text ?? '');
  for (const m of s.matchAll(/(?:^|[\s(+`])(\/[a-z0-9][a-z0-9\-_\/]*)/gi)) out.add(normPath(m[1]));
  // The homepage: "/" as the first token of the text, or wrapped as (/) or `/`. A "/" used as a
  // separator ("title / meta only") must not hold the homepage.
  if (/^\s*[`(]?\/[`)]?(?=$|[\s,;:.])/.test(s) || /\(\/\)|`\/`/.test(s)) out.add('/');
  return [...out];
}

/** -> Map(path -> {reason, until, source}). priorities is the parsed priorities file or null. */
export function detectHolds(config, priorities, today) {
  const map = new Map();
  for (const h of config.hold_lists ?? []) {
    if (!(h.until > today)) continue;
    for (const u of h.urls ?? []) {
      const p = normPath(u);
      if (!map.has(p)) map.set(p, { reason: h.reason, until: h.until, source: 'hold_list' });
    }
  }
  for (const item of priorities?.queue ?? []) {
    if (item?.status !== 'pending' || !item.not_before || !(String(item.not_before) > today)) continue;
    for (const p of extractPaths(item.target_url)) {
      if (!map.has(p)) map.set(p, { reason: `queued as ${item.id} until ${item.not_before}`, until: String(item.not_before), source: 'queue' });
    }
  }
  return map;
}
export function loadHolds(config, root, today) {
  const pr = config.priorities_file ? readJsonSafe(path.resolve(root, config.priorities_file), null) : null;
  return detectHolds(config, pr, today);
}

// ---------------------------------------------------------------- budget

export function acquireLock(lockPath) {
  const start = Date.now();
  const token = `${process.pid}-${crypto.randomBytes(6).toString('hex')}`;
  for (;;) {
    try {
      const fd = fs.openSync(lockPath, 'wx', 0o600);
      try {
        fs.writeSync(fd, token);
      } finally {
        fs.closeSync(fd);
      }
      return () => {
        // Only remove the lock if it is still ours (a stale-lock takeover may have replaced it).
        try {
          if (fs.readFileSync(lockPath, 'utf8') === token) fs.unlinkSync(lockPath);
        } catch {
          /* already gone */
        }
      };
    } catch (e) {
      if (e.code !== 'EEXIST') throw e;
      try {
        if (Date.now() - fs.statSync(lockPath).mtimeMs > LOCK_STALE_MS) {
          // Take over by renaming to a unique name: only one waiter wins the rename. If what we
          // renamed turns out to be fresh (someone else took over first), put it back.
          const moved = `${lockPath}.stale-${token}`;
          fs.renameSync(lockPath, moved);
          let stale = true;
          try {
            stale = Date.now() - fs.statSync(moved).mtimeMs > LOCK_STALE_MS;
          } catch {
            /* gone */
          }
          if (!stale) {
            try {
              fs.linkSync(moved, lockPath);
            } catch {
              /* someone created a new lock meanwhile; the moved one is dropped */
            }
          }
          try {
            fs.unlinkSync(moved);
          } catch {
            /* gone */
          }
          continue;
        }
      } catch {
        continue; // vanished between exists and stat/rename: retry at once
      }
      if (Date.now() - start > LOCK_WAIT_MS) throw new KwError('budget lock is busy (waited 5 s); try again', EXIT.NET);
      sleepSync(LOCK_RETRY_MS);
    }
  }
}

export function budgetCaps(config, marketId) {
  const market = (config.autocomplete.markets ?? []).find((m) => m.id === marketId);
  return { daily: Math.min(config.autocomplete.daily_cap, HARD_CAP), market: market ? market.cap : 0 };
}

const BUDGET_CORRUPT = 'budget.json exists but is unreadable or has an unexpected shape; the daily cap cannot be checked. Repair or delete it by hand (never reset it on a day you already used requests).';
const nonNegInt = (v) => Number.isInteger(v) && v >= 0;

/** Only a missing file is an empty budget. Anything unreadable or malformed refuses (exit 64): failing open would reset the cap. */
function loadBudgetFile(file, site) {
  let text;
  try {
    text = fs.readFileSync(file, 'utf8');
  } catch (e) {
    if (e.code === 'ENOENT') return {};
    throw new KwError(BUDGET_CORRUPT, EXIT.USAGE);
  }
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    throw new KwError(BUDGET_CORRUPT, EXIT.USAGE);
  }
  if (!isObj(data)) throw new KwError(BUDGET_CORRUPT, EXIT.USAGE);
  for (const sd of Object.values(data)) {
    if (!isObj(sd)) throw new KwError(BUDGET_CORRUPT, EXIT.USAGE);
    for (const day of Object.values(sd)) {
      if (!isObj(day) || !nonNegInt(day.total ?? 0) || (day.markets !== undefined && !(isObj(day.markets) && Object.values(day.markets).every(nonNegInt)))) throw new KwError(BUDGET_CORRUPT, EXIT.USAGE);
    }
  }
  void site;
  return data;
}

export function readBudget(privateDir, site, date) {
  const data = loadBudgetFile(path.join(privateDir, 'budget.json'), site);
  const day = data?.[site]?.[date];
  return { total: day?.total ?? 0, markets: day?.markets ?? {} };
}

/**
 * Reserve one autocomplete request: lock, re-read, check caps, increment, write atomically, unlock.
 * The caller sends the request only after this returns ok. A request that later fails still counts.
 * A corrupt budget.json throws a KwError (exit 64) instead of starting from zero.
 */
export function reserveBudget({ privateDir, site, marketId, dailyCap, marketCap, now }) {
  ensureDir(privateDir);
  const date = isoDate(now());
  const file = path.join(privateDir, 'budget.json');
  const release = acquireLock(path.join(privateDir, 'budget.lock'));
  try {
    const data = loadBudgetFile(file, site);
    if (!isObj(data[site])) data[site] = {};
    for (const d of Object.keys(data[site])) if (daysBetween(d, date) > BUDGET_KEEP_DAYS) delete data[site][d];
    if (!isObj(data[site][date])) data[site][date] = { total: 0, markets: {} };
    const day = data[site][date];
    if (!isObj(day.markets)) day.markets = {};
    const cap = Math.min(dailyCap, HARD_CAP);
    if ((day.total ?? 0) >= cap) return { ok: false, reason: 'daily', total: day.total ?? 0 };
    const used = day.markets[marketId] ?? 0;
    if (used >= marketCap) return { ok: false, reason: 'market', total: day.total ?? 0 };
    day.total = (day.total ?? 0) + 1;
    day.markets[marketId] = used + 1;
    writeJson(file, data);
    return { ok: true, total: day.total, market: used + 1 };
  } finally {
    release();
  }
}

// ---------------------------------------------------------------- network helpers

function netError(e) {
  const code = e?.cause?.code || e?.code;
  const msg = e?.name === 'AbortError' ? 'timeout' : `network error${code ? ` (${code})` : ''}: ${redact(e?.message ?? e)}`;
  return msg;
}

/**
 * One Google Autocomplete request. Returns {ok:true, suggestions} or {ok:false, reason}.
 * Injectable: fetchImpl, baseUrl, timeoutMs. No retry, no budget logic (the caller reserves first).
 */
export async function fetchSuggest({ query, hl, gl, fetchImpl = globalThis.fetch, baseUrl = SUGGEST_BASE, timeoutMs = FETCH_TIMEOUT_MS }) {
  const url = `${baseUrl}/complete/search?client=firefox&hl=${encodeURIComponent(hl)}&gl=${encodeURIComponent(gl)}&ie=utf-8&oe=utf-8&q=${encodeURIComponent(query)}`;
  const ac = new AbortController();
  const timer = setTimeout(() => ac.abort(), timeoutMs);
  try {
    const res = await fetchImpl(url, { headers: { 'User-Agent': GENERIC_UA, Accept: 'application/json' }, signal: ac.signal });
    if (res.status !== 200) {
      try {
        await res.arrayBuffer();
      } catch {
        /* discard */
      }
      return { ok: false, reason: `HTTP ${res.status}` };
    }
    const ctype = String(res.headers?.get?.('content-type') ?? '');
    const bytes = await res.arrayBuffer();
    const body = new TextDecoder('utf-8').decode(bytes);
    if (/text\/html/i.test(ctype) || body.trimStart().startsWith('<')) return { ok: false, reason: 'html instead of json' };
    let j;
    try {
      j = JSON.parse(body);
    } catch {
      return { ok: false, reason: 'response is not json' };
    }
    if (!Array.isArray(j) || typeof j[0] !== 'string' || !Array.isArray(j[1]) || !j[1].every((x) => typeof x === 'string')) return { ok: false, reason: 'unexpected json shape' };
    return { ok: true, suggestions: j[1] };
  } catch (e) {
    return { ok: false, reason: netError(e) };
  } finally {
    clearTimeout(timer);
  }
}

// ---------------------------------------------------------------- ban rules

const B1 = [
  /\b\d[\d,.]*\s*[km]?\+?\s*(searches|search(es|ed)?|monthly searches|search volume|volume|impressions?|impr|clicks?|ctr|positions?|pos|avg\.? positions?|rank(s|ing|ed)?|visits?|sessions?|installs?|downloads?)\b/gi,
  /\b(search(es|ed)?|search volume|volume|impressions?|clicks?|ctr|positions?|rank(s|ing|ed)?|visits?|sessions?|installs?|downloads?)\b\s*(of|:|=|~|≈|at|is|was|around|about)?\s*[~≈#]?\s*\d/gi,
  /[~≈]\s?\d[\d,.]*\s?[km]\b/gi, // an approximate figure like ~1.4k (spec gap, closed on the safe side)
];
const B2 = [/\bpage (1|2|one|two)\b/gi, /\b(first|1st|2nd|second) page\b/gi, /\btop \d+\b/gi, /#\d+\b/g, /\bpositions? \d/gi];
const B3 = [/\d+(\.\d+)?\s?(%|percent\b|per cent\b)/gi];
const B4 = [/[€$£]\s?\d/g, /\d\s?(€|eur|usd)\b/gi];
const B5 = [/~\/\.claude\//gi, /\/Users\//gi, /(?:[a-z]:)?\\+Users\\+[^\\\s]/gi, /%2FUsers%2F/gi, /%2Fhome%2F[a-z0-9._-]+%2F/gi, /\/home\/[a-z0-9._-]+\//gi, /\.claude\/secrets/gi, /\.claude\/[a-z-]*-gsc/gi, /service-account-key/gi, /gsc-data[\w-]*\.json/gi, /budget\.json/gi, /[a-z]+-gsc\/kw/gi];
// B5 hits that stay a FAIL in every staged file: an absolute home path, the secrets folder, the key file name.
// The other B5 words (~/.claude/, <x>-gsc, budget.json, gsc-data*.json) only NAME a private file: WARN outside the engine-public files.
const B5_HARD = [/\/Users\//i, /(?:[a-z]:)?\\+Users\\+[^\\\s]/i, /%2FUsers%2F/i, /%2Fhome%2F[a-z0-9._-]+%2F/i, /\/home\/[a-z0-9._-]+\//i, /\.claude\/secrets/i, /service-account-key/i];
export const b5Level = (snippet) => (B5_HARD.some((re) => re.test(String(snippet ?? ''))) ? 'FAIL' : 'WARN');
const B6 = [
  /-----BEGIN [A-Z ]+-----/gi,
  /"?private_key(_id)?"?\s*:/gi,
  /AIza[0-9A-Za-z_\-]{35}/gi,
  /ya29\.[0-9A-Za-z_\-]+/gi,
  /Bearer\s+[0-9A-Za-z._\-]{20,}/gi,
  /\b(api[_-]?key|apikey|access_token|client_secret|refresh_token)\s*[=:]/gi,
  /[0-9a-f]{32,}/gi,
];
const B6_TOKEN = /[A-Za-z0-9_\-+/=]{40,}/g;
const B7_CELL = /^\s*[~≈]?\d[\d,.]*\s*[k%]?\s*$/;

export const BAN_RULE_IDS = ['B1', 'B2', 'B3', 'B4', 'B5', 'B6', 'B7', 'B8'];

function blank(t, re) {
  return t.replace(re, (m) => ' '.repeat(m.length));
}
// Fullwidth, Arabic-Indic and other Unicode decimal digits become ASCII digits, so "１２００ searches" is still seen.
function asciiDigits(t) {
  return t.replace(/\p{Nd}/gu, (ch) => {
    let cp = ch.codePointAt(0);
    if (cp >= 48 && cp <= 57) return ch;
    let start = cp;
    while (/\p{Nd}/u.test(String.fromCodePoint(start - 1))) start--;
    return String((cp - start) % 10);
  });
}
function hits(text, res, rule, out) {
  for (const re of res) {
    re.lastIndex = 0;
    for (const m of text.matchAll(re)) out.push({ rule, index: m.index ?? 0, snippet: m[0].trim().slice(0, 60) });
  }
}

/**
 * Scan one string. opts: {prose (B8 applies), table (B7 applies to markdown tables),
 * skip: array of rule ids to skip, phrases: config.public_ban_phrases}.
 * B6 hits carry no snippet (never echo a possible secret): {rule:'B6', index}.
 */
export function scanBan(text, opts = {}) {
  const skip = new Set(opts.skip ?? []);
  const out = [];
  const folded = asciiDigits(String(text).normalize('NFKC'));
  // B1 sees the text with dates removed only: a semver-shaped "1.200.000 impressions" must not slip through.
  const noDates = blank(folded, /\d{4}-\d{2}-\d{2}/g);
  const stripped = blank(noDates, /\d+\.\d+\.\d+/g);
  if (!skip.has('B1')) hits(noDates, B1, 'B1', out);
  if (!skip.has('B2')) hits(stripped, B2, 'B2', out);
  if (!skip.has('B3')) hits(stripped, B3, 'B3', out);
  if (!skip.has('B4')) hits(stripped, B4, 'B4', out);
  if (!skip.has('B5')) hits(String(text), B5, 'B5', out);
  if (!skip.has('B6')) {
    const six = [];
    hits(String(text), B6, 'B6', six);
    B6_TOKEN.lastIndex = 0;
    if (!skip.has('B6TOKEN')) for (const m of String(text).matchAll(B6_TOKEN)) if (/\d/.test(m[0]) && /[A-Z]/.test(m[0]) && /[a-z]/.test(m[0])) six.push({ rule: 'B6', index: m.index ?? 0 });
    for (const h of six) out.push({ rule: 'B6', index: h.index });
  }
  if (!skip.has('B7') && opts.table && /^\s*\|/.test(stripped)) {
    const cells = stripped.split('|').slice(1);
    if (cells.length && stripped.trimEnd().endsWith('|')) cells.pop();
    for (const cell of cells) if (B7_CELL.test(cell)) out.push({ rule: 'B7', index: 0, snippet: cell.trim().slice(0, 60) });
  }
  if (!skip.has('B8') && opts.prose)
    for (const p of opts.phrases ?? []) {
      try {
        for (const m of stripped.matchAll(new RegExp(p, 'gi'))) out.push({ rule: 'B8', index: m.index ?? 0, snippet: m[0].trim().slice(0, 60) });
      } catch {
        /* validated in config */
      }
    }
  return out;
}

// A key that looks like a secret (or is absurdly long) is never echoed: it shows as <key>.
const B6_ONLY = ['B1', 'B2', 'B3', 'B4', 'B5', 'B7', 'B8'];
export function safeKey(k) {
  const key = String(k);
  return key.length > 40 || scanBan(key, { skip: B6_ONLY }).length ? '<key>' : key;
}
function jsonStrings(value, base = '', out = []) {
  if (typeof value === 'string') out.push({ path: base, value });
  else if (Array.isArray(value)) value.forEach((v, i) => jsonStrings(v, `${base}[${i}]`, out));
  else if (isObj(value))
    for (const [k, v] of Object.entries(value)) {
      const sk = safeKey(k);
      const p = base ? `${base}.${sk}` : sk;
      if (sk === '<key>') out.push({ path: p, value: k, keyOnly: true }); // keys are scanned for B6 too
      jsonStrings(v, p, out);
    }
  return out;
}

// How a JSON string is scanned, by where it sits. kind: 'clusters' | 'config' | 'other'.
export function jsonScanOpts(kind, p, phrases) {
  if (kind === 'clusters') {
    if (/(^|\.)volume_band$/.test(p)) return { skip: ['B1', 'B3', 'B7'], phrases };
    if (/\.(name|notes|hold_reason)$/.test(p) || /\.evidence\[\d+\]\.note$/.test(p)) return { prose: true, phrases };
    return { phrases }; // head_keyword, members, ids: search records, never B8
  }
  if (kind === 'config' && (p === 'private_dir' || p === 'gsc.key_path')) return { skip: ['B5', 'B6TOKEN'], phrases }; // the one place a private path must be named (a long path is not a key)
  return { phrases };
}

function lineOfValue(text, value) {
  let idx = text.indexOf(JSON.stringify(value));
  if (idx < 0) idx = text.indexOf(value);
  if (idx < 0) return 1;
  let n = 1;
  for (let i = 0; i < idx; i++) if (text.charCodeAt(i) === 10) n++;
  return n;
}

export function scanMarkdown(text, phrases = []) {
  const out = [];
  text.split('\n').forEach((line, i) => {
    for (const h of scanBan(line, { prose: true, table: true, phrases })) out.push({ ...h, line: i + 1, where: null });
  });
  return out;
}
export function scanJsonText(text, kind, phrases = []) {
  const out = [];
  let obj;
  try {
    obj = JSON.parse(text);
  } catch {
    return [{ rule: 'json', line: 1, index: 0, snippet: 'file is not valid JSON', where: null }];
  }
  for (const s of jsonStrings(obj)) {
    const opts = s.keyOnly ? { skip: B6_ONLY } : jsonScanOpts(kind, s.path, phrases);
    for (const h of scanBan(s.value, opts)) out.push({ ...h, line: lineOfValue(text, s.value), where: s.path });
  }
  return out;
}

export function formatViolation(level, file, v) {
  const where = v.where ? ` [${v.where}]` : '';
  if (v.rule === 'B6') return `${level} ${file}:${v.line} B6${where} (key-shaped text at column ${v.index + 1})`;
  return `${level} ${file}:${v.line} ${v.rule}${where} ${JSON.stringify(v.snippet)}`;
}

// ---------------------------------------------------------------- clusters schema

export function sitemapPaths(xml) {
  const set = new Set();
  for (const m of String(xml).matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)) set.add(pathOf(m[1]));
  return set;
}

/** -> {fails: [{path, msg}], warns: [{path, msg}]} for the public clusters file. */
export function validateClusters(doc, { config, today, sitemap = null, priorities = null }) {
  const fails = [];
  const warns = [];
  const fail = (p, msg) => fails.push({ path: p, msg });
  const warn = (p, msg) => warns.push({ path: p, msg });
  if (!isObj(doc)) {
    fail('', 'top level must be an object');
    return { fails, warns };
  }
  const top = ['engine_version', 'site', 'updated', 'clusters'];
  for (const k of Object.keys(doc)) if (!top.includes(k)) fail(safeKey(k), 'unknown top-level key');
  if (!parseSemver(doc.engine_version)) fail('engine_version', 'must be semver x.y.z');
  if (doc.site !== config.site) fail('site', `must equal config site "${config.site}"`);
  if (!validDate(doc.updated)) fail('updated', 'must be YYYY-MM-DD');
  if (!Array.isArray(doc.clusters)) {
    fail('clusters', 'must be an array');
    return { fails, warns };
  }
  const ids = new Set();
  const memberOwner = new Map();
  doc.clusters.forEach((c, i) => {
    const at = (k) => `clusters[${i}]${k ? `.${k}` : ''}`;
    if (!isObj(c)) return fail(at(''), 'must be an object');
    for (const k of Object.keys(c)) if (!CLUSTER_KEYS.includes(k)) fail(at(safeKey(k)), 'unknown key (no numbers, scores or positions in the public file)');
    if (typeof c.id !== 'string' || !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(c.id) || c.id.length > 60) fail(at('id'), 'must match ^[a-z0-9]+(-[a-z0-9]+)*$ and be at most 60 characters');
    else if (ids.has(c.id)) fail(at('id'), `duplicate id "${c.id}"`);
    else ids.add(c.id);
    if (!isStr(c.name) || c.name.length > 80) fail(at('name'), 'non-empty string of at most 80 characters');
    const members = Array.isArray(c.members) ? c.members : null;
    if (!members || members.length < 1 || members.length > 40) fail(at('members'), 'array of 1 to 40 strings');
    else {
      const seen = new Set();
      members.forEach((m, j) => {
        if (!isStr(m) || m !== m.toLowerCase()) return fail(at(`members[${j}]`), 'must be a non-empty lowercase string');
        if (seen.has(m)) fail(at(`members[${j}]`), `duplicate member "${m}" in this cluster`);
        seen.add(m);
        if (memberOwner.has(m) && memberOwner.get(m) !== i) fail(at(`members[${j}]`), `member "${m}" is also in clusters[${memberOwner.get(m)}]`);
        else memberOwner.set(m, i);
      });
    }
    if (!isStr(c.head_keyword) || c.head_keyword !== c.head_keyword.toLowerCase()) fail(at('head_keyword'), 'non-empty lowercase string');
    else if (members && !members.includes(c.head_keyword)) fail(at('head_keyword'), 'must be one of the members');
    if (!INTENTS.includes(c.intent)) fail(at('intent'), `must be one of ${INTENTS.join(' | ')}`);
    if (!CONTENT_TYPES.includes(c.content_type)) fail(at('content_type'), `must be one of ${CONTENT_TYPES.join(' | ')}`);
    if (!DECISIONS.includes(c.decision)) fail(at('decision'), `must be one of ${DECISIONS.join(' | ')}`);
    if (!('target_url' in c)) fail(at('target_url'), 'required (use null when there is no page)');
    else if (c.target_url !== null) {
      if (typeof c.target_url !== 'string' || !/^\/(?!\/)[^?#\s:]*$/.test(c.target_url)) fail(at('target_url'), 'null or a path starting with / (no scheme, host, query or fragment)');
      else if (sitemap && c.target_url !== '/' && !sitemap.has(normPath(c.target_url)) && !['new-post', 'new-tool', 'aso-handoff'].includes(c.decision)) warn(at('target_url'), `${c.target_url} is not in the sitemap`);
    }
    if (c.decision === 'hold' && !isStr(c.hold_reason)) fail(at('hold_reason'), 'required when decision is hold');
    else if (c.hold_reason !== undefined && !isStr(c.hold_reason)) fail(at('hold_reason'), 'must be a non-empty string');
    if (c.held_until !== undefined && !validDate(c.held_until)) fail(at('held_until'), 'must be YYYY-MM-DD');
    if (c.aso_handoff !== undefined && typeof c.aso_handoff !== 'boolean') fail(at('aso_handoff'), 'must be a boolean');
    let paid = false;
    if (!Array.isArray(c.evidence) || !c.evidence.length) fail(at('evidence'), 'non-empty array required');
    else
      c.evidence.forEach((e, j) => {
        const ea = (k) => at(`evidence[${j}]${k ? `.${k}` : ''}`);
        if (!isObj(e)) return fail(ea(''), 'must be an object');
        for (const k of Object.keys(e)) if (!['type', 'fetched', 'note', 'source'].includes(k)) fail(ea(safeKey(k)), 'unknown key');
        if (!EVIDENCE_TYPES.includes(e.type)) fail(ea('type'), `must be one of ${EVIDENCE_TYPES.join(' | ')}`);
        if (e.type === 'ads' || e.type === 'dataforseo') paid = true;
        if (!('fetched' in e)) fail(ea('fetched'), 'required (YYYY-MM-DD)');
        else if (!validDate(e.fetched)) fail(ea('fetched'), 'must be YYYY-MM-DD');
        else if (e.fetched > today) fail(ea('fetched'), 'must not be after today');
        if (!isStr(e.note) || e.note.length > 200) fail(ea('note'), 'non-empty string of at most 200 characters');
        else if (e.type === 'gsc' && /\d/.test(e.note)) fail(ea('note'), 'a gsc note contains no digit at all');
        if (SOURCE_REQUIRED.includes(e.type) && !isStr(e.source)) fail(ea('source'), `required for ${e.type}`);
        else if (e.source !== undefined && !isStr(e.source)) fail(ea('source'), 'must be a non-empty string');
      });
    if (c.volume_band !== undefined) {
      if (!VOLUME_BANDS.includes(c.volume_band)) fail(at('volume_band'), `must be one of ${VOLUME_BANDS.join(' | ')}`);
      if (!paid) fail(at('volume_band'), 'allowed only with an ads or dataforseo evidence entry');
    }
    if (c.queue_id !== undefined && !(typeof c.queue_id === 'string' && /^p\d+$/.test(c.queue_id))) fail(at('queue_id'), 'must match ^p\\d+$');
    if (c.notes !== undefined && !(typeof c.notes === 'string' && c.notes.length <= 300)) fail(at('notes'), 'string of at most 300 characters');
  });
  if (priorities) {
    const queued = new Set();
    for (const list of ['queue', 'done'])
      for (const it of priorities[list] ?? []) {
        if (it?.id) queued.add(it.id);
        if (it && it.cluster_id !== undefined && !ids.has(it.cluster_id)) fail(`priorities.${list}.${it.id ?? '?'}.cluster_id`, `"${it.cluster_id}" matches no cluster id`);
      }
    doc.clusters.forEach((c, i) => {
      if (isObj(c) && typeof c.queue_id === 'string' && !queued.has(c.queue_id)) warn(`clusters[${i}].queue_id`, `${c.queue_id} is in neither the queue nor done list`);
    });
  }
  return { fails, warns };
}

// ---------------------------------------------------------------- robots.txt (RFC 9309)

export function parseRobots(text) {
  const groups = [];
  let cur = null;
  let lastWasAgent = false;
  for (const raw of String(text).replace(/^﻿/, '').split(/\r\n|\r|\n/)) {
    const line = raw.replace(/#.*$/, '').trim();
    if (!line) continue;
    const i = line.indexOf(':');
    if (i < 0) continue;
    const field = line.slice(0, i).trim().toLowerCase();
    const value = line.slice(i + 1).trim();
    if (field === 'user-agent') {
      const token = value.split(/[\s/]/)[0].toLowerCase();
      if (!cur || !lastWasAgent) {
        cur = { agents: [], rules: [] };
        groups.push(cur);
      }
      cur.agents.push(token);
      lastWasAgent = true;
    } else if (field === 'allow' || field === 'disallow') {
      if (cur) cur.rules.push({ type: field, path: value });
      lastWasAgent = false;
    } else {
      lastWasAgent = false; // sitemap, crawl-delay, content-signal ...: ignored, never ends a group wrongly
    }
  }
  return groups;
}

/** Rules that apply to a bot: exact (case-insensitive) product token groups combined, else the * groups combined. */
export function rulesFor(groups, bot) {
  const b = String(bot).toLowerCase();
  const exact = groups.filter((g) => g.agents.includes(b));
  const chosen = exact.length ? exact : groups.filter((g) => g.agents.includes('*'));
  return { matched: exact.length ? b : chosen.length ? '*' : null, rules: chosen.flatMap((g) => g.rules) };
}

// RFC 9309: non-ASCII is compared percent-encoded (UTF-8), escapes are upper case, and escapes of unreserved characters are decoded.
export function normPercent(s) {
  let t = String(s);
  try {
    t = t.replace(/[^\x00-\x7F]/gu, (ch) => encodeURIComponent(ch));
  } catch {
    /* lone surrogate: leave as is */
  }
  return t.replace(/%([0-9a-fA-F]{2})/g, (m, h) => {
    const ch = String.fromCharCode(parseInt(h, 16));
    return /[A-Za-z0-9\-._~]/.test(ch) ? ch : `%${h.toUpperCase()}`;
  });
}

export function robotsPatternMatches(pattern, p) {
  if (pattern === '') return false;
  p = normPercent(p);
  let anchored = false;
  let pat = normPercent(pattern);
  if (pat.endsWith('$')) {
    anchored = true;
    pat = pat.slice(0, -1);
  }
  const re = new RegExp(`^${pat.split('*').map((s) => s.replace(/[.+?^${}()|[\]\\]/g, '\\$&')).join('.*')}${anchored ? '$' : ''}`);
  return re.test(p);
}

/** Longest matching pattern wins; Allow wins ties; no match means allowed. */
export function robotsAllows(groups, bot, p) {
  const { rules } = rulesFor(groups, bot);
  let best = null;
  for (const r of rules) {
    if (r.path === '' || !robotsPatternMatches(r.path, p)) continue;
    const len = normPercent(r.path).length;
    if (!best || len > best.len || (len === best.len && r.type === 'allow' && best.type !== 'allow')) best = { type: r.type, len };
  }
  return !best || best.type === 'allow';
}

// ---------------------------------------------------------------- check command

function listMarkdown(dir) {
  const out = [];
  const walk = (d) => {
    let ents;
    try {
      ents = fs.readdirSync(d, { withFileTypes: true });
    } catch {
      return;
    }
    for (const e of ents) {
      const p = path.join(d, e.name);
      if (e.isDirectory()) walk(p);
      else if (e.isFile() && e.name.toLowerCase().endsWith('.md')) out.push(p);
    }
  };
  walk(dir);
  return out.sort();
}

/** The engine-public files: the default scope. Returns [{abs, rel, kind}] for those that exist. */
export function publicScope(ctx) {
  const { root, config, configPath } = ctx;
  const list = [];
  const add = (abs, kind) => {
    if (fs.existsSync(abs) && fs.statSync(abs).isFile() && !list.some((x) => x.abs === abs)) list.push({ abs, rel: path.relative(root, abs) || abs, kind });
  };
  add(path.resolve(root, config.clusters_file), 'clusters');
  for (const f of listMarkdown(path.resolve(root, config.public_docs_dir))) add(f, 'md');
  for (const f of config.extra_public_files ?? []) {
    const abs = path.resolve(root, f);
    add(abs, abs.toLowerCase().endsWith('.json') ? 'json' : 'md');
  }
  if (configPath) add(configPath, 'config');
  return list;
}

export function checkContent(text, kind, ctx, level = 'FAIL') {
  const phrases = ctx.config.public_ban_phrases ?? [];
  const out = [];
  if (kind === 'md') out.push(...scanMarkdown(text, phrases));
  else out.push(...scanJsonText(text, kind === 'config' ? 'config' : kind === 'clusters' ? 'clusters' : 'other', phrases));
  return out.map((v) => ({ ...v, level }));
}

function schemaCheck(text, ctx, file) {
  const out = [];
  let doc;
  try {
    doc = JSON.parse(text);
  } catch {
    return [{ level: 'FAIL', line: 1, rule: 'schema', where: null, snippet: 'clusters file is not valid JSON' }];
  }
  const { root, config } = ctx;
  const priorities = config.priorities_file ? readJsonSafe(path.resolve(root, config.priorities_file), null) : null;
  let sitemap = null;
  if (config.sitemap_path) {
    try {
      sitemap = sitemapPaths(fs.readFileSync(path.resolve(root, config.sitemap_path), 'utf8'));
    } catch {
      sitemap = null;
    }
  }
  const { fails, warns } = validateClusters(doc, { config, today: isoDate(ctx.now()), sitemap, priorities });
  for (const f of fails) out.push({ level: 'FAIL', line: 1, rule: 'schema', where: f.path, snippet: f.msg });
  for (const w of warns) out.push({ level: 'WARN', line: 1, rule: 'schema', where: w.path, snippet: w.msg });
  void file;
  return out;
}

const BINARY_EXT = /\.(png|jpe?g|gif|webp|avif|ico|svg|pdf|woff2?|ttf|otf|eot|mp[34]|mov|webm|zip|gz|ico)$/i;

function gitStaged(root) {
  // -z: names come back raw (NUL separated), not as quoted octal escapes for non-ASCII names.
  const out = execFileSync('git', ['diff', '--cached', '--name-only', '-z', '--diff-filter=ACMR'], { cwd: root, stdio: ['ignore', 'pipe', 'ignore'], maxBuffer: 64 * 1024 * 1024 }).toString('utf8');
  return out.split('\0').filter(Boolean);
}
function gitBlob(root, rel) {
  return execFileSync('git', ['show', `:${rel}`], { cwd: root, stdio: ['ignore', 'pipe', 'ignore'], maxBuffer: 64 * 1024 * 1024 }).toString('utf8');
}

export async function runCheck(ctx, opts = {}) {
  const { root, config, log } = ctx;
  const report = []; // {file, level, ...}
  let files = 0;
  if (opts.staged) {
    let staged;
    try {
      staged = gitStaged(root);
    } catch (e) {
      throw new KwError(`git diff --cached failed: ${redact(e.message)}`, EXIT.USAGE);
    }
    const scope = new Map(publicScope(ctx).map((s) => [s.rel, s.kind]));
    scope.set(path.relative(root, path.resolve(root, config.clusters_file)), 'clusters');
    const docsDir = path.relative(root, path.resolve(root, config.public_docs_dir));
    for (const rel of staged) {
      const isEngine = scope.has(rel) || (rel.toLowerCase().endsWith('.md') && (rel === docsDir || rel.startsWith(`${docsDir}/`))) || (config.extra_public_files ?? []).some((f) => path.normalize(f) === path.normalize(rel));
      const other = !isEngine && !BINARY_EXT.test(rel) && (rel.startsWith('docs/') || rel.startsWith('src/data/'));
      if (!isEngine && !other) continue;
      let text;
      try {
        text = gitBlob(root, rel);
      } catch {
        files++;
        report.push({ file: rel, level: 'FAIL', rule: 'schema', line: 1, where: null, snippet: 'cannot read the staged blob; this file was NOT checked' });
        continue;
      }
      if (!isEngine && text.includes('\0')) continue; // a binary blob under docs/ or src/data/ is not text
      files++;
      let kind = scope.get(rel) ?? (rel.toLowerCase().endsWith('.json') ? 'other' : 'md');
      if (isEngine && kind === 'md' && rel.toLowerCase().endsWith('.json')) kind = 'json';
      if (isEngine) {
        for (const v of checkContent(text, kind, ctx, 'FAIL')) report.push({ file: rel, ...v });
        if (kind === 'clusters') for (const v of schemaCheck(text, ctx, rel)) report.push({ file: rel, ...v });
      } else {
        for (const v of checkContent(text, kind, ctx, 'WARN')) report.push({ file: rel, ...v, level: v.rule === 'B6' ? 'FAIL' : v.rule === 'B5' ? b5Level(v.snippet) : 'WARN' });
      }
    }
  } else {
    const scope = publicScope(ctx);
    if (!scope.length) {
      log('nothing to check yet');
      return EXIT.OK;
    }
    for (const s of scope) {
      const text = fs.readFileSync(s.abs, 'utf8');
      files++;
      for (const v of checkContent(text, s.kind, ctx, 'FAIL')) report.push({ file: s.rel, ...v });
      if (s.kind === 'clusters') for (const v of schemaCheck(text, ctx, s.rel)) report.push({ file: s.rel, ...v });
    }
  }
  const shown = report.slice(0, 200);
  for (const r of shown) log(r.rule === 'schema' ? `${r.level} ${r.file}:${r.line} schema ${r.where ? `[${r.where}] ` : ''}${r.snippet}` : formatViolation(r.level, r.file, r));
  if (report.length > shown.length) log(`... ${report.length - shown.length} more`);
  const nf = report.filter((r) => r.level === 'FAIL').length;
  const nw = report.length - nf;
  if (!files) {
    log('nothing to check yet');
    return EXIT.OK;
  }
  log(`check: ${files} file(s), ${nf} fail, ${nw} warn`);
  return nf ? EXIT.CHECK : EXIT.OK;
}

// ---------------------------------------------------------------- context

export function makeCtx(o) {
  return {
    root: o.root,
    config: o.config,
    configPath: o.configPath ?? null,
    privateDir: o.privateDir,
    env: o.env ?? process.env,
    fetchImpl: o.fetchImpl ?? globalThis.fetch,
    now: o.now ?? (() => new Date()),
    sleep: o.sleep ?? realSleep,
    log: o.log ?? ((s) => console.log(s)),
    suggestBase: o.suggestBase ?? SUGGEST_BASE,
    gscBase: o.gscBase ?? GSC_BASE,
    tokenUrl: o.tokenUrl ?? TOKEN_URL,
    origin: o.origin ?? o.config?.origin,
    suggestTimeoutMs: o.suggestTimeoutMs ?? FETCH_TIMEOUT_MS,
    _token: null,
    _apiCalls: 0,
  };
}

async function timedFetch(ctx, url, init, ms) {
  const ac = new AbortController();
  const timer = setTimeout(() => ac.abort(), ms);
  try {
    return await ctx.fetchImpl(url, { ...init, signal: ac.signal });
  } finally {
    clearTimeout(timer);
  }
}

// ---------------------------------------------------------------- Search Console auth + calls

export async function getToken(ctx) {
  if (ctx._token) return ctx._token;
  const keyPath = gscKeyPath(ctx.config, ctx.env);
  if (!fs.existsSync(keyPath)) throw new NoCredentials();
  let key;
  try {
    key = JSON.parse(fs.readFileSync(keyPath, 'utf8'));
  } catch {
    throw new KwError('cannot read the GSC key file (unreadable or not JSON)', EXIT.NET);
  }
  if (!isObj(key) || typeof key.client_email !== 'string' || typeof key.private_key !== 'string') throw new KwError('GSC key file lacks client_email or private_key', EXIT.NET);
  const b64url = (o) => Buffer.from(JSON.stringify(o)).toString('base64url');
  const iat = Math.floor(ctx.now().getTime() / 1000);
  const header = b64url({ alg: 'RS256', typ: 'JWT' });
  const claims = b64url({ iss: key.client_email, scope: GSC_SCOPE, aud: TOKEN_URL, iat, exp: iat + 3600 });
  let sig;
  try {
    const s = crypto.createSign('RSA-SHA256');
    s.update(`${header}.${claims}`);
    sig = s.sign(key.private_key).toString('base64url');
  } catch {
    throw new KwError('cannot sign the token request with the GSC key', EXIT.NET);
  }
  let res;
  let j = null;
  try {
    res = await timedFetch(
      ctx,
      ctx.tokenUrl,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'User-Agent': GENERIC_UA },
        body: new URLSearchParams({ grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer', assertion: `${header}.${claims}.${sig}` }),
      },
      GSC_TIMEOUT_MS,
    );
    j = await res.json().catch(() => null);
  } catch (e) {
    throw new KwError(`token request: ${netError(e)}`, EXIT.NET);
  }
  if (res.status !== 200 || !j || typeof j.access_token !== 'string') {
    const why = j && typeof j.error === 'string' ? ` ${redact(j.error)}${j.error_description ? `: ${redact(String(j.error_description)).slice(0, 120)}` : ''}` : '';
    throw new KwError(`token request failed: HTTP ${res.status}${why}`, EXIT.NET);
  }
  ctx._token = j.access_token;
  return ctx._token;
}

async function gscApi(ctx, method, url, body) {
  const token = await getToken(ctx);
  if (ctx._apiCalls++ > 0) await ctx.sleep(API_GAP_MS);
  let res;
  let j = null;
  try {
    res = await timedFetch(
      ctx,
      url,
      { method, headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json', 'User-Agent': GENERIC_UA }, body: body ? JSON.stringify(body) : undefined },
      GSC_TIMEOUT_MS,
    );
    j = await res.json().catch(() => null);
  } catch (e) {
    throw new KwError(`Search Console: ${netError(e)}`, EXIT.NET);
  }
  if (res.status !== 200 || (j && j.error)) {
    const msg = j?.error?.message ?? (typeof j?.error === 'string' ? j.error : '');
    throw new KwError(`Search Console API HTTP ${res.status}${msg ? `: ${redact(String(msg)).slice(0, 200)}` : ''}`, EXIT.NET);
  }
  return j ?? {};
}

async function gscQuery(ctx, body) {
  const url = `${ctx.gscBase}/webmasters/v3/sites/${encodeURIComponent(ctx.config.gsc.property)}/searchAnalytics/query`;
  const j = await gscApi(ctx, 'POST', url, body);
  return j.rows ?? [];
}

async function pullAll(ctx, base) {
  const rows = [];
  for (let startRow = 0; ; startRow += ROW_LIMIT) {
    const page = await gscQuery(ctx, { ...base, rowLimit: ROW_LIMIT, startRow });
    for (const r of page) rows.push(r);
    if (page.length < ROW_LIMIT || rows.length >= ROW_CAP) break;
  }
  return rows.slice(0, ROW_CAP);
}

// ---------------------------------------------------------------- analysis

const r2 = (n) => Math.round(n * 100) / 100;
const r4 = (n) => Math.round(n * 10000) / 10000;
const wordCount = (s) => normalize(s).split(' ').filter(Boolean).length;
const isUnsafeRaw = (s) => /@|http|www\./i.test(s) || /\d{5,}/.test(s);
const pageOrder = (a, b) => b.clicks - a.clicks || b.impressions - a.impressions || a.position - b.position;
const shareOrder = (a, b) => b.impressions - a.impressions || b.clicks - a.clicks || a.position - b.position;

const toolPath = (p) => {
  const t = String(p ?? '').split(/[?#]/)[0];
  return t.length > 1 ? t.replace(/\/+$/, '') : t;
};
// Page kind for the prune-merge test: a tool page (config tool_pages), the home page, a blog post (/blog/...), or any other page.
// Two pages of the same kind that share a query are cannibalisation; a post next to a landing, legal or comparison page,
// or a tool page next to anything else, is two answers to different needs. The home page never counts as a pair.
export const pageKind = (p, tools = new Set()) => {
  const t = toolPath(p);
  return tools.has(t) ? 'tool' : t === '/' ? 'home' : t.startsWith('/blog/') ? 'blog' : 'page';
};
export const toolPageSet = (config) => new Set((config?.tool_pages ?? []).map(toolPath));

/**
 * Decision rubric, first match wins:
 *  1 navigational (brand) intent -> monitor
 *  2 follow-up fragment -> monitor: AI_FRAGMENT_RE, a 2-6 word head ending in a bare pronoun, or (only when the config defines regex families) a head
 *    of at most two words where neither the head nor any member matches any family pattern
 *  3 main page on a hold -> hold
 *  4 two pages share the query (>= 20% each) and are the same kind of page (pageKind: tool, home, blog, other)
 *    -> prune-merge (a post next to a landing or tool page is not cannibalisation: that pair falls through)
 *  5 head of AI_FRAGMENT_WORDS words or more (a long AI Mode question): main page at position 5 or better
 *    -> monitor, else faq-add on the main page (no main page: falls through)
 *  6 one page owns it (share >= 80%): position <= 10 ctr-fix, <= 20 refresh
 *  7 app-install intent and no page within 20 -> aso-handoff
 *  8 short question (<= 6 words) with a main page -> faq-add
 *  9 tool intent new-tool, 10 compare intent compare, 11 anything else new-post.
 * c: {head, members?:[query], intent, pages:[{path, share, position, ...}] (best first), position}.
 * holds: Map(path -> {reason, until}). config: kw config (regex_families, tool_pages). The agent decides;
 * the engine only suggests.
 */
export function suggestDecision(c, holds = new Map(), config = {}) {
  const pages = c.pages ?? [];
  const main = pages[0];
  if (c.intent === 'navigational') return { decision: 'monitor' };
  const head = normalize(c.head ?? '');
  const heads = head.split(' ').filter(Boolean);
  let fragment = AI_FRAGMENT_RE.test(head) || (heads.length >= 2 && heads.length <= AI_FRAGMENT_TAIL_WORDS && AI_FRAGMENT_TAIL_RE.test(head));
  const fams = config?.gsc?.regex_families ?? [];
  if (!fragment && fams.length && heads.length <= 2) {
    const res = fams.map((f) => compileIntent(f.pattern)).filter(Boolean);
    const inFamily = (t) => res.some((re) => re.test(t));
    // Members may be query strings or {query, impressions}. A cluster is rescued by its members only when the
    // family-matching ones carry at least half of its weight (impressions, else count): one stray "free
    // alternatives" among twenty "are they free" variants does not make "free" a topic.
    const ms = (c.members ?? []).map((m) => (typeof m === 'string' ? { q: normalize(m), w: 1 } : { q: normalize(m.query ?? ''), w: m.impressions ?? 1 }));
    const total = ms.reduce((n, m) => n + m.w, 0);
    const inW = ms.filter((m) => inFamily(m.q)).reduce((n, m) => n + m.w, 0);
    fragment = !inFamily(head) && !(total > 0 && inW / total >= FRAGMENT_FAMILY_SHARE);
  }
  if (fragment) return { decision: 'monitor' };
  const held = main ? holds.get(main.path) : null;
  if (held) return { decision: 'hold', hold_reason: held.reason, held_until: held.until };
  const tools = toolPageSet(config);
  const sharing = pages.filter((p) => p.share >= CANNIBAL_SHARE);
  const kinds = new Map();
  for (const p of sharing) kinds.set(pageKind(p.path, tools), (kinds.get(pageKind(p.path, tools)) ?? 0) + 1);
  if ([...kinds.values()].some((n) => n >= 2)) return { decision: 'prune-merge' };
  if (heads.length >= AI_FRAGMENT_WORDS && main) return { decision: main.position <= 5 ? 'monitor' : 'faq-add' };
  if (main && main.share >= 0.8) {
    if (main.position <= 10) return { decision: 'ctr-fix' };
    if (main.position <= 20) return { decision: 'refresh' };
  }
  if (c.intent === 'app-install' && !pages.some((p) => p.position <= 20)) return { decision: 'aso-handoff' };
  if (c.intent === 'question' && wordCount(c.head) <= 6 && main) return { decision: 'faq-add' };
  if (c.intent === 'tool') return { decision: 'new-tool' };
  if (c.intent === 'compare') return { decision: 'compare' };
  return { decision: 'new-post' };
}

export function contentTypeFor(decision, targetUrl, config = {}) {
  if (decision === 'aso-handoff') return 'aso-handoff';
  if (decision === 'new-tool') return 'tool-page';
  if (decision === 'compare') return 'compare';
  if (decision === 'faq-add') return 'faq';
  if (decision === 'new-post') return 'blog';
  if (decision === 'no-action') return 'none';
  if (!targetUrl) return 'none';
  if (toolPageSet(config).has(toolPath(targetUrl))) return 'tool-page';
  return targetUrl.startsWith('/blog/') ? 'blog' : 'money-page';
}

function aggregate(rows, qi) {
  const m = new Map();
  for (const r of rows) {
    const n = normalize(r.keys[qi]);
    if (!n) continue;
    let x = m.get(n);
    if (!x) m.set(n, (x = { query: n, impressions: 0, clicks: 0, posSum: 0 }));
    x.impressions += r.impressions ?? 0;
    x.clicks += r.clicks ?? 0;
    x.posSum += (r.position ?? 0) * (r.impressions ?? 0);
  }
  return [...m.values()].map((x) => ({ query: x.query, impressions: x.impressions, clicks: x.clicks, position: x.impressions ? r2(x.posSum / x.impressions) : 0 }));
}

/**
 * input: {dateRows, queryRows, pageQueryRows (keys [page, query]), familyRows {id: rows (keys [query, page])}}
 * Pure: no I/O. Returns the analysis object (private; contains numbers).
 */
export function analyse(input, config, holds = new Map()) {
  const recs = new Map();
  const get = (n) => {
    let r = recs.get(n);
    if (!r) recs.set(n, (r = { query: n, impressions: 0, clicks: 0, posSum: 0, unsafe: false, pageMap: new Map() }));
    return r;
  };
  for (const r of input.queryRows ?? []) {
    const n = normalize(r.keys[0]);
    if (!n) continue;
    const x = get(n);
    x.impressions += r.impressions ?? 0;
    x.clicks += r.clicks ?? 0;
    x.posSum += (r.position ?? 0) * (r.impressions ?? 0);
    if (isUnsafeRaw(r.keys[0])) x.unsafe = true;
  }
  for (const r of input.pageQueryRows ?? []) {
    const n = normalize(r.keys[1]);
    if (!n) continue;
    const x = get(n);
    if (isUnsafeRaw(r.keys[1])) x.unsafe = true;
    const p = pathOf(r.keys[0]);
    let a = x.pageMap.get(p);
    if (!a) x.pageMap.set(p, (a = { impressions: 0, clicks: 0, posSum: 0 }));
    a.impressions += r.impressions ?? 0;
    a.clicks += r.clicks ?? 0;
    a.posSum += (r.position ?? 0) * (r.impressions ?? 0);
  }

  const queries = [];
  for (const x of recs.values()) {
    const pages = [...x.pageMap].map(([p, a]) => ({ path: p, impressions: a.impressions, clicks: a.clicks, position: a.impressions ? a.posSum / a.impressions : 0 })).sort(pageOrder);
    if (!x.impressions && pages.length) {
      for (const p of pages) {
        x.impressions += p.impressions;
        x.clicks += p.clicks;
        x.posSum += p.position * p.impressions;
      }
    }
    if (!x.impressions) continue;
    const best = pages[0] ?? null;
    queries.push({
      query: x.query,
      impressions: x.impressions,
      clicks: x.clicks,
      ctr: r4(x.clicks / x.impressions),
      position: r2(x.posSum / x.impressions),
      pages: pages.map((p) => ({ path: p.path, impressions: p.impressions, clicks: p.clicks, position: r2(p.position) })),
      best_page: best ? best.path : null,
      best_page_position: best ? r2(best.position) : null,
      intent: classifyIntent(x.query, config),
      modifiers: findModifiers(x.query, config),
      unsafe: x.unsafe,
    });
  }
  queries.sort((a, b) => b.impressions - a.impressions || (a.query < b.query ? -1 : 1));

  // same-URL groups
  const groups = new Map();
  for (const q of queries) {
    if (!q.best_page) continue;
    let g = groups.get(q.best_page);
    if (!g) groups.set(q.best_page, (g = { page: q.best_page, queries: [], impressions: 0, clicks: 0, posSum: 0 }));
    g.queries.push(q);
    g.impressions += q.impressions;
    g.clicks += q.clicks;
    g.posSum += q.position * q.impressions;
  }
  const sameUrl = [...groups.values()]
    .map((g) => ({ page: g.page, query_count: g.queries.length, impressions: g.impressions, clicks: g.clicks, position: r2(g.posSum / g.impressions), top_queries: g.queries.slice(0, 25).map((q) => ({ query: q.query, impressions: q.impressions, position: q.position })) }))
    .sort((a, b) => b.impressions - a.impressions);

  // cannibalisation
  const cannibal = [];
  for (const q of queries) {
    const total = q.pages.reduce((s, p) => s + p.impressions, 0);
    if (!total) continue;
    const big = q.pages.filter((p) => p.impressions >= CANNIBAL_MIN_IMPR && p.impressions / total >= CANNIBAL_SHARE);
    if (big.length >= 2) cannibal.push({ query: q.query, impressions: q.impressions, pages: big.map((p) => ({ path: p.path, impressions: p.impressions, share: r2(p.impressions / total), position: p.position })) });
  }
  const cannibalSet = new Set(cannibal.map((c) => c.query));
  const striking = queries.filter((q) => q.position >= STRIKE_MIN && q.position <= STRIKE_MAX && q.impressions >= MIN_IMPR);
  const strikeSet = new Set(striking.map((q) => q.query));
  // Gap: the best page's position for the query is above 20. A query with no page row falls back to its own position.
  const gaps = queries.filter((q) => (q.best_page_position ?? q.position) > GAP_POSITION);
  const gapSet = new Set(gaps.map((q) => q.query));
  const aiFragments = queries.filter((q) => AI_FRAGMENT_RE.test(q.query) || q.query.split(' ').length >= AI_FRAGMENT_WORDS).slice(0, 200).map((q) => ({ query: q.query, impressions: q.impressions, position: q.position }));

  // families
  const families = [];
  for (const f of config.gsc?.regex_families ?? []) {
    const agg = aggregate(input.familyRows?.[f.id] ?? [], 0).sort((a, b) => b.impressions - a.impressions);
    const impressions = agg.reduce((s, x) => s + x.impressions, 0);
    families.push({
      id: f.id,
      pattern: f.pattern,
      query_count: agg.length,
      impressions,
      clicks: agg.reduce((s, x) => s + x.clicks, 0),
      position: impressions ? r2(agg.reduce((s, x) => s + x.position * x.impressions, 0) / impressions) : 0,
      top_queries: agg.slice(0, 25),
    });
  }

  // lexical clusters (leader clustering, never chaining)
  // Leaders are picked by their own impressions, but clusters are ranked by the TOTAL of their members.
  const taken = new Set();
  const rawClusters = leaderCluster(queries.map((q) => ({ q: q.query, weight: q.impressions, rec: q })), { stopwords: config.stopwords ?? [] }).map((c) => ({ c, impressions: c.members.reduce((s, m) => s + m.rec.impressions, 0), clicks: c.members.reduce((s, m) => s + m.rec.clicks, 0) }));
  rawClusters.sort((x, y) => y.impressions - x.impressions || y.clicks - x.clicks || (x.c.leader.q < y.c.leader.q ? -1 : x.c.leader.q > y.c.leader.q ? 1 : 0));
  const clusters = rawClusters.map(({ c }) => {
    const members = c.members.map((m) => m.rec);
    const impressions = members.reduce((s, m) => s + m.impressions, 0);
    const clicks = members.reduce((s, m) => s + m.clicks, 0);
    const position = r2(members.reduce((s, m) => s + m.position * m.impressions, 0) / impressions);
    const iw = new Map([[c.leader.rec.intent, 0]]);
    for (const m of members) iw.set(m.intent, (iw.get(m.intent) ?? 0) + m.impressions);
    let intent = c.leader.rec.intent;
    for (const [k, v] of iw) if (v > iw.get(intent)) intent = k;
    const pm = new Map();
    for (const m of members)
      for (const p of m.pages) {
        let a = pm.get(p.path);
        if (!a) pm.set(p.path, (a = { impressions: 0, clicks: 0, posSum: 0 }));
        a.impressions += p.impressions;
        a.clicks += p.clicks;
        a.posSum += p.position * p.impressions;
      }
    const pageTotal = [...pm.values()].reduce((s, a) => s + a.impressions, 0);
    const pages = [...pm]
      .map(([p, a]) => ({ path: p, impressions: a.impressions, clicks: a.clicks, share: pageTotal ? r4(a.impressions / pageTotal) : 0, position: a.impressions ? r2(a.posSum / a.impressions) : 0 }))
      .sort(shareOrder);
    const sug = suggestDecision({ head: c.leader.q, members: members.map((m) => ({ query: m.query, impressions: m.impressions })), intent, pages, position }, holds, config);
    return {
      id: uniqueId(slugify(c.leader.q), taken),
      head: c.leader.q,
      members: members.map((m) => ({ query: m.query, impressions: m.impressions, clicks: m.clicks, position: m.position, unsafe: m.unsafe })),
      impressions,
      clicks,
      position,
      intent,
      pages,
      main_page: pages[0]?.path ?? null,
      flags: {
        cannibalisation: members.some((m) => cannibalSet.has(m.query)),
        striking_distance: members.some((m) => strikeSet.has(m.query)),
        gap: members.some((m) => gapSet.has(m.query)),
        held: sug.decision === 'hold',
        shared_pages: pages.filter((p) => p.share >= CANNIBAL_SHARE).length >= 2, // two or more pages hold 20%+ each: read it at the hold read-out; on new-post/new-tool link the pages instead of adding a third
      },
      suggested_decision: sug.decision,
      hold_reason: sug.hold_reason ?? null,
      held_until: sug.held_until ?? null,
      aso_handoff: intent === 'app-install',
    };
  });

  const dateRows = input.dateRows ?? [];
  const daysWithData = dateRows.filter((r) => (r.impressions ?? 0) > 0).length;
  return {
    days_with_data: daysWithData,
    insufficient: daysWithData < MIN_DAYS,
    rows: { date: dateRows.length, query: (input.queryRows ?? []).length, page_query: (input.pageQueryRows ?? []).length, families: Object.fromEntries(Object.entries(input.familyRows ?? {}).map(([k, v]) => [k, v.length])) },
    totals: { queries: queries.length, impressions: queries.reduce((s, q) => s + q.impressions, 0), clicks: queries.reduce((s, q) => s + q.clicks, 0) },
    queries,
    same_url_groups: sameUrl,
    cannibalisation: cannibal,
    striking_distance: striking.map((q) => ({ query: q.query, impressions: q.impressions, clicks: q.clicks, position: q.position, best_page: q.best_page })),
    gaps: gaps.map((q) => ({ query: q.query, impressions: q.impressions, position: q.best_page_position ?? q.position, best_page: q.best_page })),
    ai_fragments: aiFragments,
    families,
    clusters,
    held: [...holds].map(([p, h]) => ({ path: p, reason: h.reason, until: h.until, source: h.source })),
  };
}

// ---------------------------------------------------------------- report + public-safe draft

const cell = (s) => String(s ?? '').replace(/\|/g, '\\|').replace(/\n/g, ' ');

export function buildReport(a, meta) {
  const L = [];
  L.push(`# Keyword report ${meta.run_key}`, '');
  L.push(`- Property: ${meta.property}`);
  L.push(`- Window: ${meta.start} to ${meta.end} (${meta.days} days), country: ${meta.country ?? 'all'}`);
  L.push(`- Days with data: ${a.days_with_data}`);
  L.push(`- Rows per pull: date ${a.rows.date}, query ${a.rows.query}, page x query ${a.rows.page_query}${Object.entries(a.rows.families).map(([k, v]) => `, ${k} ${v}`).join('')}`);
  L.push(`- Pulled at: ${meta.pulled_at}${meta.reused ? ' (reused, analysis rebuilt from the saved pull)' : ''}`, '');
  if (a.insufficient) L.push(`> INSUFFICIENT DATA (${a.days_with_data} days): draw no "no page ranks" or "no demand" conclusion`, '');
  L.push(`## Top ${REPORT_TOP} clusters`, '');
  L.push('| head | members | impressions | clicks | position | main pages | intent | flags | suggested decision |', '|---|---|---|---|---|---|---|---|---|');
  for (const c of a.clusters.slice(0, REPORT_TOP)) {
    const flags = Object.entries(c.flags).filter(([, v]) => v).map(([k]) => k).join(', ');
    const pages = c.pages.slice(0, 3).map((p) => `${p.path} (${Math.round(p.share * 100)}%)`).join('; ');
    L.push(`| ${cell(c.head)} | ${c.members.length} | ${c.impressions} | ${c.clicks} | ${c.position} | ${cell(pages)} | ${c.intent} | ${flags} | ${c.suggested_decision}${c.aso_handoff ? ' (aso)' : ''} |`);
  }
  L.push('', `## Striking distance (top ${LIST_TOP}, position ${STRIKE_MIN}-${STRIKE_MAX}, at least ${MIN_IMPR} impressions)`, '');
  for (const q of a.striking_distance.slice(0, LIST_TOP)) L.push(`- ${q.query}: ${q.impressions} impr, pos ${q.position}${q.best_page ? `, ${q.best_page}` : ''}`);
  L.push('', `## Gaps (top ${LIST_TOP}, best page position above ${GAP_POSITION})`, '');
  for (const q of a.gaps.slice(0, LIST_TOP)) L.push(`- ${q.query}: ${q.impressions} impr, pos ${q.position}${q.best_page ? `, ${q.best_page}` : ''}`);
  L.push('', '## Cannibalisation flags', '');
  for (const c of a.cannibalisation.slice(0, 100)) L.push(`- ${c.query} (${c.impressions} impr): ${c.pages.map((p) => `${p.path} ${Math.round(p.share * 100)}%`).join(', ')}`);
  L.push('', '## Possible AI-Mode follow-up fragments (unverified signal)', '');
  for (const q of a.ai_fragments.slice(0, 100)) L.push(`- possible: ${q.query} (${q.impressions} impr)`);
  L.push('', '## Families', '');
  for (const f of a.families) L.push(`- ${f.id}: ${f.query_count} queries, ${f.impressions} impr, ${f.clicks} clicks, pos ${f.position}`);
  L.push('', '## Held URLs', '');
  for (const h of a.held) L.push(`- ${h.path}: ${h.reason} (until ${h.until})`);
  return L.join('\n') + '\n';
}

function memberOk(q) {
  return scanBan(q, {}).length === 0;
}

/**
 * PUBLIC-SAFE draft, exactly the clusters schema, no numbers. existing: parsed clusters file or null.
 * Stable ids: an existing cluster is reused (id, decision, target_url, notes, queue_id) when its head
 * matches or its member Jaccard on normalised strings is at least 0.3.
 */
export function buildDraft(a, { config, today, end, existing = null }) {
  const out = [];
  const taken = new Set();
  const used = new Set();
  const ex = Array.isArray(existing?.clusters) ? existing.clusters : [];
  const exSets = ex.map((c) => new Set((c.members ?? []).map(normalize)));
  const top = a.clusters.filter((c) => c.impressions >= MIN_IMPR).slice(0, DRAFT_TOP);
  for (const c of top) {
    const members = c.members.filter((m) => !m.unsafe && m.query && memberOk(m.query)).slice(0, DRAFT_MEMBERS).map((m) => m.query);
    if (!members.length) continue;
    const head = members.includes(c.head) ? c.head : members[0];
    const mset = new Set(members.map(normalize));
    let hit = -1;
    let hitScore = 0;
    ex.forEach((e, i) => {
      if (used.has(i) || !isObj(e)) return;
      const score = normalize(e.head_keyword ?? '') === normalize(head) ? 2 : jaccard(mset, exSets[i]);
      if ((score === 2 || score >= STABLE_ID_JACCARD) && score > hitScore) {
        hit = i;
        hitScore = score;
      }
    });
    let id = slugify(c.head);
    let reuse = null;
    if (hit >= 0) {
      used.add(hit);
      reuse = ex[hit];
      if (typeof reuse.id === 'string') id = reuse.id;
    }
    if (taken.has(id) || scanBan(id, {}).length) id = taken.has(id) ? id : `cluster-${out.length + 1}`;
    id = uniqueId(id, taken);
    let decision = c.suggested_decision;
    let targetUrl = c.main_page && /^\/(?!\/)[^?#\s:]*$/.test(c.main_page) ? c.main_page : null;
    let holdReason = c.hold_reason;
    let heldUntil = c.held_until;
    if (reuse) {
      if (DECISIONS.includes(reuse.decision)) decision = reuse.decision;
      if ('target_url' in reuse) targetUrl = reuse.target_url;
      if (decision === 'hold' && isStr(reuse.hold_reason)) holdReason = reuse.hold_reason;
      if (decision === 'hold' && validDate(reuse.held_until)) heldUntil = reuse.held_until;
    }
    let name = head.slice(0, 80);
    if (scanBan(name, { prose: true, phrases: config.public_ban_phrases ?? [] }).length) name = 'keyword cluster';
    const rec = {
      id,
      name,
      head_keyword: head,
      members,
      intent: c.intent,
      content_type: contentTypeFor(decision, targetUrl, config),
      target_url: targetUrl,
      decision,
    };
    if (decision === 'hold') {
      rec.hold_reason = holdReason || 'held';
      if (heldUntil && validDate(heldUntil)) rec.held_until = heldUntil;
    }
    if (c.aso_handoff) rec.aso_handoff = true;
    rec.evidence = [{ type: 'gsc', fetched: end, note: 'Search Console queries' }];
    if (reuse && isStr(reuse.notes) && reuse.notes.length <= 300) rec.notes = reuse.notes;
    if (reuse && typeof reuse.queue_id === 'string' && /^p\d+$/.test(reuse.queue_id)) rec.queue_id = reuse.queue_id;
    out.push(rec);
  }
  // A member may sit in one cluster only.
  const seen = new Set();
  for (const r of out) {
    r.members = r.members.filter((m) => !seen.has(m));
    r.members.forEach((m) => seen.add(m));
    if (!r.members.includes(r.head_keyword)) r.head_keyword = r.members[0];
  }
  return { engine_version: ENGINE_VERSION, site: config.site, updated: today, clusters: out.filter((r) => r.members.length) };
}

// ---------------------------------------------------------------- gsc command

// Only all-country pulls: a --country pull would mislabel suggestions as new or already ranking.
function newestAnalysis(privateDir) {
  const dir = path.join(privateDir, 'gsc');
  let best = null;
  let names = [];
  try {
    names = fs.readdirSync(dir, { withFileTypes: true }).filter((e) => e.isDirectory()).map((e) => e.name);
  } catch {
    return null;
  }
  for (const n of names) {
    const f = path.join(dir, n, 'analysis.json');
    const j = readJsonSafe(f, null);
    if (!j || !Array.isArray(j.queries) || (j.country ?? null) !== null) continue;
    const t = Date.parse(j.pulled_at ?? '') || fs.statSync(f).mtimeMs;
    if (!best || t > best.t) best = { t, run_key: j.run_key ?? n, pulled_at: j.pulled_at ?? new Date(t).toISOString(), analysis: j };
  }
  return best;
}

/**
 * PRIVATE hint for expand: the GSC query closest to a suggestion by token Jaccard (at least NEAR_GSC),
 * with its main page path, or null. {query, page}; no numbers. Never written to a public file.
 */
export function nearGsc(text, pool, config = {}) {
  const tk = tokenSet(text, config.stopwords ?? []);
  let best = null;
  let bestScore = 0;
  for (const e of pool) {
    const sc = jaccard(tk, e.tokens);
    if (sc > bestScore) {
      best = e.q;
      bestScore = sc;
    }
  }
  return best && bestScore >= NEAR_GSC ? { query: best.query, page: best.best_page ?? null } : null;
}

export async function runGsc(ctx, opts = {}) {
  const { config, log, privateDir: priv } = ctx;
  const now = ctx.now();
  const today = isoDate(now);
  const days = opts.days ?? 90;
  const country = opts.country ?? null;
  const keyOf = (e) => `${e}_${days}d${country ? `_${country}` : ''}`;
  ensurePrivateDir(priv);
  const idxFile = path.join(priv, 'gsc', 'index.json');
  const index = readJsonSafe(idxFile, { runs: {} });
  if (!isObj(index.runs)) index.runs = {};
  const families = config.gsc.regex_families ?? [];
  const rawFiles = (dir) => ['raw-date.json', 'raw-query.json', 'raw-page-query.json', ...families.map((f) => `raw-family-${f.id}.json`)].every((n) => fs.existsSync(path.join(dir, n)));
  const isFresh = (r) => r && (now.getTime() - Date.parse(r.pulled_at)) / 86400000 < REUSE_DAYS;
  let end = opts.end ?? addDays(today, -3);
  // With no --end, the default end moves every day: reuse the newest young pull for the same days and country instead.
  if (!opts.end && !opts.fresh && !(isFresh(index.runs[keyOf(end)]) && rawFiles(path.join(priv, 'gsc', keyOf(end))))) {
    const alt = Object.entries(index.runs)
      .filter(([k, r]) => isObj(r) && r.days === days && (r.country ?? null) === country && validDate(r.end) && r.end <= end && isFresh(r) && k === keyOf(r.end) && rawFiles(path.join(priv, 'gsc', k)))
      .sort((x, y) => (x[1].end < y[1].end ? 1 : -1))[0];
    if (alt) end = alt[1].end;
  }
  const start = addDays(end, -(days - 1));
  const runKey = keyOf(end);
  const runDir = path.join(priv, 'gsc', runKey);
  const filt = (extra = []) => {
    const filters = [...extra];
    if (country) filters.push({ dimension: 'country', operator: 'equals', expression: country });
    return filters.length ? { dimensionFilterGroups: [{ filters }] } : {};
  };
  const base = { startDate: start, endDate: end, searchType: 'web' };
  const raw = { dateRows: null, queryRows: null, pageQueryRows: null, familyRows: {} };
  const rawName = { dateRows: 'raw-date.json', queryRows: 'raw-query.json', pageQueryRows: 'raw-page-query.json' };
  const prev = index.runs[runKey];
  const reusable = !opts.fresh && isFresh(prev) && rawFiles(runDir);
  let pulledAt = now.toISOString();
  let reused = false;
  if (reusable) {
    reused = true;
    pulledAt = prev.pulled_at;
    raw.dateRows = readJsonSafe(path.join(runDir, 'raw-date.json'), {}).rows ?? [];
    raw.queryRows = readJsonSafe(path.join(runDir, 'raw-query.json'), {}).rows ?? [];
    raw.pageQueryRows = readJsonSafe(path.join(runDir, 'raw-page-query.json'), {}).rows ?? [];
    for (const f of families) raw.familyRows[f.id] = readJsonSafe(path.join(runDir, `raw-family-${f.id}.json`), {}).rows ?? [];
    log(`reused the pull ${runKey} from ${pulledAt.slice(0, 10)} (younger than ${REUSE_DAYS} days; no API calls; --fresh to pull again)`);
  } else {
    try {
      await getToken(ctx);
    } catch (e) {
      if (e instanceof NoCredentials) {
        log('skipped: no credentials');
        return EXIT.OK;
      }
      log(`stopped: ${redact(e)}`);
      return EXIT.NET;
    }
    // The old pull is overwritten file by file. Take it out of the index first, so a failed refresh
    // can never be mistaken for a complete pull (mixed vintages) by the next default run.
    if (index.runs[runKey]) {
      delete index.runs[runKey];
      writeJson(idxFile, index);
    }
    const save = (name, dims, rows) => writeJson(path.join(runDir, name), { run_key: runKey, dimensions: dims, window: [start, end], country, pulled_at: pulledAt, rows });
    try {
      raw.dateRows = await pullAll(ctx, { ...base, dimensions: ['date'], ...filt() });
      save(rawName.dateRows, ['date'], raw.dateRows);
      raw.queryRows = await pullAll(ctx, { ...base, dimensions: ['query'], ...filt() });
      save(rawName.queryRows, ['query'], raw.queryRows);
      raw.pageQueryRows = await pullAll(ctx, { ...base, dimensions: ['page', 'query'], ...filt() });
      save(rawName.pageQueryRows, ['page', 'query'], raw.pageQueryRows);
      for (const f of families) {
        raw.familyRows[f.id] = await pullAll(ctx, { ...base, dimensions: ['query', 'page'], ...filt([{ dimension: 'query', operator: 'includingRegex', expression: f.pattern }]) });
        save(`raw-family-${f.id}.json`, ['query', 'page'], raw.familyRows[f.id]);
      }
    } catch (e) {
      log(`stopped: ${redact(e)} (partial pull kept in ${runDir.replace(os.homedir(), '~')})`);
      return EXIT.NET;
    }
    index.runs[runKey] = { pulled_at: pulledAt, days, end, country };
    writeJson(idxFile, index);
  }

  const holds = loadHolds(config, ctx.root, today);
  const a = analyse(raw, config, holds);
  const meta = { run_key: runKey, property: config.gsc.property, start, end, days, country, pulled_at: pulledAt, reused };
  writeJson(path.join(runDir, 'analysis.json'), { engine_version: ENGINE_VERSION, ...meta, ...a });
  writeAtomic(path.join(runDir, 'report.md'), buildReport(a, meta));
  const existing = readJsonSafe(path.resolve(ctx.root, config.clusters_file), null);
  const draft = buildDraft(a, { config, today, end, existing });
  writeJson(path.join(runDir, 'draft-clusters.json'), draft);

  const fam = Object.entries(a.rows.families).map(([k, v]) => `${k}=${v}`).join(' ');
  log(`days with data: ${a.days_with_data}${a.insufficient ? ` (INSUFFICIENT DATA, fewer than ${MIN_DAYS}: draw no "no page ranks" or "no demand" conclusion)` : ''}`);
  log(`rows: date ${a.rows.date}, query ${a.rows.query}, page-query ${a.rows.page_query}${fam ? `, families ${fam}` : ''}`);
  log(`clusters: ${a.clusters.length} (${draft.clusters.length} in the draft)`);
  log(`flags: cannibalisation ${a.cannibalisation.length}, striking distance ${a.striking_distance.length}, gaps ${a.gaps.length}, possible AI fragments ${a.ai_fragments.length}, held clusters ${a.clusters.filter((c) => c.flags.held).length}`);
  log(`report: ${path.join(runDir, 'report.md').replace(os.homedir(), '~')}`);
  log(`analysis: ${path.join(runDir, 'analysis.json').replace(os.homedir(), '~')}`);
  log(`draft: ${path.join(runDir, 'draft-clusters.json').replace(os.homedir(), '~')}`);
  return a.insufficient ? EXIT.DATA : EXIT.OK;
}

// ---------------------------------------------------------------- expand (Google Autocomplete)

const cacheFile = (priv) => path.join(priv, 'cache', 'autocomplete.json');
const cacheKey = (market, q) => `${market.hl}|${market.gl}|${q}`;
// Entries without a valid date and a string[] of suggestions are dropped: they count as "never fetched".
function readCache(priv) {
  const j = readJsonSafe(cacheFile(priv), {});
  if (!isObj(j)) return {};
  const out = {};
  for (const [k, e] of Object.entries(j)) if (isObj(e) && validDate(e.fetched) && Array.isArray(e.suggestions) && e.suggestions.every((x) => typeof x === 'string')) out[k] = e;
  return out;
}
const entryAge = (e, today) => (e && validDate(e.fetched) ? daysBetween(e.fetched, today) : Infinity);

export function collectSeeds(config, opts = {}, readFile = (f) => fs.readFileSync(f, 'utf8')) {
  const markets = config.autocomplete.markets;
  const byId = new Map(markets.map((m) => [m.id, m]));
  const defId = opts.market ?? markets[0].id;
  if (!byId.has(defId)) throw new KwError(`unknown market "${defId}" (known: ${[...byId.keys()].join(', ')})`, EXIT.USAGE);
  const raw = [];
  for (const s of opts.seeds ?? []) raw.push({ seed: s, market: defId });
  if (opts.fromConfig) for (const s of config.seeds ?? []) raw.push({ seed: s.seed, market: s.market ?? defId });
  if (opts.file) {
    let text;
    try {
      text = readFile(opts.file);
    } catch (e) {
      throw new KwError(`cannot read seed file: ${redact(e.message)}`, EXIT.USAGE);
    }
    for (const line of text.split(/\r?\n/)) {
      const s = line.replace(/#.*$/, '').trim();
      if (s) raw.push({ seed: s, market: defId });
    }
  }
  // Query text goes to Google: nothing that looks like an email, a URL or a long number. The seed is not echoed.
  const personal = raw.findIndex((r) => isUnsafeRaw(String(r.seed)));
  if (personal >= 0) throw new KwError(`seed #${personal + 1} looks like personal data (@, http, www. or a run of 5+ digits); refusing to send it to Google`, EXIT.USAGE);
  const items = [];
  const seen = new Set();
  const add = (q, marketId) => {
    const key = `${marketId}|${q}`;
    if (!q || seen.has(key)) return;
    seen.add(key);
    items.push({ seed: q, market: byId.get(marketId) });
  };
  for (const r of raw) {
    const n = normalize(r.seed);
    add(n, r.market);
    if (opts.modifiers) for (const m of config.autocomplete.modifiers ?? []) add(normalize(`${n} ${m}`), r.market);
  }
  return items;
}

function orderItems(items, cache, today, fromConfig) {
  const info = items.map((it, i) => {
    const e = cache[cacheKey(it.market, it.seed)];
    const age = entryAge(e, today);
    const status = !e ? 'never' : age < TTL_DAYS ? 'cache-fresh' : 'cache-stale';
    return { ...it, status, fetched: e?.fetched ?? null, i };
  });
  if (fromConfig) {
    const rank = { never: 0, 'cache-stale': 1, 'cache-fresh': 2 };
    info.sort((a, b) => rank[a.status] - rank[b.status] || (a.status === 'cache-stale' ? (a.fetched < b.fetched ? -1 : a.fetched > b.fetched ? 1 : 0) : 0) || a.i - b.i);
  }
  return info;
}

function clusterNewToUs(list, config) {
  const items = list.map((x, i) => ({ q: normalize(x.text), weight: list.length - i, text: x.text, intent: x.intent }));
  return leaderCluster(items, { stopwords: config.stopwords ?? [] }).map((c) => {
    const iw = new Map();
    for (const m of c.members) iw.set(m.intent, (iw.get(m.intent) ?? 0) + 1);
    let intent = c.leader.intent;
    for (const [k, v] of iw) if (v > iw.get(intent)) intent = k;
    return { head: c.leader.text, intent, members: c.members.map((m) => m.text) };
  });
}

export async function runExpand(ctx, opts = {}) {
  const { config, log, privateDir: priv } = ctx;
  const now = ctx.now();
  const today = isoDate(now);
  const site = config.site;
  const items = collectSeeds(config, opts);
  if (!items.length) throw new KwError('no seeds: pass seeds, --from-config or --file', EXIT.USAGE);
  const cache = readCache(priv);
  const ordered = orderItems(items, cache, today, opts.fromConfig);

  if (opts.plan) {
    const b = readBudget(priv, site, today);
    const daily = Math.min(config.autocomplete.daily_cap, HARD_CAP);
    let leftDaily = Math.max(0, daily - b.total);
    const leftMarket = {};
    let allowed = 0;
    let needing = 0;
    ordered.forEach((it, n) => {
      const need = it.status !== 'cache-fresh';
      let skipped = '';
      if (need) {
        needing++;
        leftMarket[it.market.id] ??= Math.max(0, it.market.cap - (b.markets[it.market.id] ?? 0));
        if (leftDaily > 0 && leftMarket[it.market.id] > 0) {
          leftDaily--;
          leftMarket[it.market.id]--;
          allowed++;
        } else skipped = leftDaily > 0 ? ' | skipped (market cap)' : ' | skipped (daily cap)';
      }
      log(`${n + 1}. ${it.seed} | ${it.market.id} | ${it.status}${it.fetched ? ` (fetched ${it.fetched})` : ''}${skipped}`);
    });
    log(`plan: ${needing} request(s) needed, today's remaining budget allows ${allowed} (used ${b.total}/${daily})`);
    return EXIT.OK;
  }

  ensurePrivateDir(priv);
  const newest = newestAnalysis(priv);
  const gscIndex = new Map();
  let nearPool = [];
  if (newest) {
    for (const q of newest.analysis.queries) gscIndex.set(q.query, q);
    nearPool = [...gscIndex.values()].map((q) => ({ q, tokens: tokenSet(q.query, config.stopwords ?? []) }));
    log(`gsc analysis: ${newest.run_key}, pulled ${newest.pulled_at.slice(0, 10)} (${Math.max(0, daysBetween(newest.pulled_at.slice(0, 10), today))} day(s) old)`);
  } else log('gsc analysis: none yet (all-country pulls only; in_gsc will say no for everything; run `gsc` first)');

  const results = []; // {seed, market, status: cache|net|deferred|stopped, reason?, fetched, suggestions[]}
  let stopped = null;
  let stopCode = EXIT.NET;
  let sent = 0;
  for (const it of ordered) {
    const key = cacheKey(it.market, it.seed);
    const e = cache[key];
    if (e && entryAge(e, today) < TTL_DAYS) {
      results.push({ seed: it.seed, market: it.market.id, status: 'cache', fetched: e.fetched, suggestions: e.suggestions });
      continue;
    }
    // After a stop nothing more is sent; the remaining seeds are listed (cache hits are still served).
    if (stopped) {
      results.push({ seed: it.seed, market: it.market.id, status: 'deferred', reason: 'stopped', fetched: null, suggestions: [] });
      continue;
    }
    const caps = budgetCaps(config, it.market.id);
    let r;
    try {
      r = reserveBudget({ privateDir: priv, site, marketId: it.market.id, dailyCap: caps.daily, marketCap: caps.market, now: ctx.now });
    } catch (err) {
      // A busy lock or a corrupt budget file: stop here, keep what was fetched, merge and write it.
      stopped = `${redact(err.message ?? err)} (seed "${it.seed}")`;
      stopCode = err instanceof KwError ? err.code : EXIT.USAGE;
      results.push({ seed: it.seed, market: it.market.id, status: 'deferred', reason: 'stopped', fetched: null, suggestions: [] });
      continue;
    }
    if (!r.ok) {
      results.push({ seed: it.seed, market: it.market.id, status: 'deferred', reason: 'budget', fetched: null, suggestions: [] });
      continue;
    }
    if (sent++ > 0) await ctx.sleep(GAP_MS + Math.floor(Math.random() * (JITTER_MS + 1)));
    const res = await fetchSuggest({ query: it.seed, hl: it.market.hl, gl: it.market.gl, fetchImpl: ctx.fetchImpl, baseUrl: ctx.suggestBase, timeoutMs: ctx.suggestTimeoutMs });
    if (!res.ok) {
      stopped = `${res.reason} (seed "${it.seed}")`;
      results.push({ seed: it.seed, market: it.market.id, status: 'stopped', fetched: null, suggestions: [] });
      continue;
    }
    cache[key] = { fetched: today, suggestions: res.suggestions };
    writeJson(cacheFile(priv), cache);
    results.push({ seed: it.seed, market: it.market.id, status: 'net', fetched: today, suggestions: res.suggestions });
  }

  // Enrich + merge into today's file.
  const outFile = path.join(priv, 'expand', `${today}.json`);
  const day = readJsonSafe(outFile, null) ?? { date: today, seeds: {} };
  if (!isObj(day.seeds)) day.seeds = {};
  const perSeed = [];
  for (const r of results) {
    if (r.status === 'deferred' || r.status === 'stopped') {
      perSeed.push({ ...r, n: 0, fresh: 0 });
      continue;
    }
    const sug = r.suggestions.map((text) => {
      const rec = gscIndex.get(normalize(text));
      return { text, in_gsc: Boolean(rec), best_page: rec?.best_page ?? null, intent: classifyIntent(text, config), near_gsc: rec ? null : nearGsc(text, nearPool, config) };
    });
    day.seeds[`${r.market}|${r.seed}`] = { seed: r.seed, market: r.market, fetched: r.fetched, from_cache: r.status === 'cache', suggestions: sug };
    perSeed.push({ ...r, n: sug.length, fresh: sug.filter((s) => !s.in_gsc).length });
  }
  day.gsc_analysis = newest ? { run_key: newest.run_key, pulled_at: newest.pulled_at } : null;
  const uniqNew = new Map();
  for (const s of Object.values(day.seeds)) for (const x of s.suggestions) if (!x.in_gsc && !uniqNew.has(normalize(x.text))) uniqNew.set(normalize(x.text), x);
  day.new_to_us = clusterNewToUs([...uniqNew.values()], config);
  day.updated_at = now.toISOString();
  if (results.some((r) => r.status === 'net' || r.status === 'cache')) {
    writeJson(outFile, day);
    const md = [`# Autocomplete expansion ${today}`, ''];
    for (const s of Object.values(day.seeds)) {
      md.push(`## ${s.seed} (${s.market}, fetched ${s.fetched}${s.from_cache ? ', from cache' : ''})`, '');
      for (const x of s.suggestions) md.push(`- ${x.text} [${x.intent}]${x.in_gsc ? ` in GSC${x.best_page ? `: ${x.best_page}` : ''}` : ' new to us'}${x.near_gsc ? ` (near GSC: "${x.near_gsc.query}"${x.near_gsc.page ? `, ${x.near_gsc.page}` : ''})` : ''}`);
      md.push('');
    }
    md.push('## New to us (clustered)', '');
    for (const c of day.new_to_us) md.push(`- ${c.head} [${c.intent}]${c.members.length > 1 ? `: ${c.members.slice(0, 8).join('; ')}` : ''}`);
    writeAtomic(path.join(priv, 'expand', `${today}.md`), md.join('\n') + '\n');
  }

  for (const r of perSeed) log(`${r.seed} | ${r.market} | ${r.status === 'cache' ? 'cache' : r.status === 'net' ? 'net' : r.status === 'deferred' ? 'deferred' : 'stopped'} | ${r.n} suggestions | ${r.fresh} new-to-us`);
  const deferredBudget = perSeed.filter((r) => r.status === 'deferred' && r.reason !== 'stopped').length;
  const deferredStopped = perSeed.filter((r) => r.status === 'deferred' && r.reason === 'stopped').length;
  if (deferredBudget) log(`deferred: budget (${deferredBudget} seed(s) left for another day)`);
  if (deferredStopped) log(`deferred: stopped (${deferredStopped} seed(s) not sent because the run stopped)`);
  let b;
  try {
    b = readBudget(priv, site, today);
  } catch (err) {
    log(`budget today: unreadable (${redact(err.message)})`);
    log(`stopped: ${stopped ?? 'budget file'}`);
    return err instanceof KwError ? err.code : EXIT.USAGE;
  }
  const daily = Math.min(config.autocomplete.daily_cap, HARD_CAP);
  log(`budget today: ${b.total}/${daily} used, ${Math.max(0, daily - b.total)} left (${Object.entries(b.markets).map(([k, v]) => `${k} ${v}`).join(', ') || 'no market used'})`);
  if (stopped) {
    log(`stopped: ${stopped}`);
    return stopCode;
  }
  return EXIT.OK;
}

// ---------------------------------------------------------------- doctor

export async function runDoctor(ctx, opts = {}) {
  const { config, log, root, configPath } = ctx;
  const home = (p) => String(p).split(os.homedir()).join('~');
  const today = isoDate(ctx.now());
  log(`engine: ${ENGINE_VERSION} | node: ${process.version}`);
  log(`repo root: ${home(root)}`);
  log(`config: ${home(configPath)}`);
  const v = validateConfig(config);
  log(`config validation: ${v.problems.length ? `PROBLEMS (${v.problems.length})` : 'OK'}`);
  for (const w of v.warnings) log(`  WARN ${w}`);
  const priv = ctx.privateDir;
  const { created } = ensurePrivateDir(priv);
  log(`private dir: ${home(priv)} (${created ? 'created' : 'exists'}, mode ${modeOf(priv)})`);
  const g = credStatus(gscKeyPath(config, ctx.env));
  log(`gsc credential: present: ${yn(g.present)}, mode 600: ${yn(g.mode600)}, source: ${gscKeySource(config, ctx.env)}`);
  const bg = credStatus(bingKeyPath(ctx.env));
  log(`bing credential: present: ${yn(bg.present)}`);
  log('ads: not configured');
  log('dataforseo: not configured');
  const daily = Math.min(config.autocomplete.daily_cap, HARD_CAP);
  let budgetBad = false;
  try {
    const b = readBudget(priv, config.site, today);
    log(`autocomplete budget today (UTC ${today}): ${config.autocomplete.markets.map((m) => `${m.id} ${b.markets[m.id] ?? 0}/${m.cap}`).join(', ')}; total ${b.total}/${daily}`);
  } catch (e) {
    budgetBad = true;
    log(`autocomplete budget today: UNREADABLE (${redact(e.message)})`);
  }
  const cache = readCache(priv);
  const stale = Object.values(cache).filter((e) => !(entryAge(e, today) < TTL_DAYS)).length;
  log(`autocomplete cache: ${Object.keys(cache).length} entries, ${stale} stale (older than ${TTL_DAYS} days)`);
  const idx = readJsonSafe(path.join(priv, 'gsc', 'index.json'), { runs: {} });
  const latest = Object.entries(idx.runs ?? {}).sort((a, b2) => (a[1].pulled_at < b2[1].pulled_at ? 1 : -1))[0];
  log(`latest gsc pull: ${latest ? `${latest[0]} (pulled ${String(latest[1].pulled_at).slice(0, 10)})` : 'none'}`);
  for (const f of config.readonly_json ?? []) {
    const abs = path.resolve(root, f);
    let state;
    try {
      const text = fs.readFileSync(abs, 'utf8');
      state = JSON.stringify(JSON.parse(text), null, 2) + '\n' === text ? 'yes' : 'no';
    } catch {
      state = 'unreadable';
    }
    log(`readonly_json ${f}: round-trips byte for byte: ${state} (informational)`);
  }
  let onlineFailed = false;
  if (opts.online) {
    try {
      const j = await gscApi(ctx, 'GET', `${ctx.gscBase}/webmasters/v3/sites`);
      const entry = (j.siteEntry ?? []).find((s) => s.siteUrl === config.gsc.property);
      if (!entry) onlineFailed = true;
      log(`gsc property accessible: ${yn(Boolean(entry))}${entry?.permissionLevel ? ` (permissionLevel ${entry.permissionLevel})` : ''}`);
    } catch (e) {
      if (!(e instanceof NoCredentials)) onlineFailed = true; // no credentials is a skip, a failed probe is a stopped network source
      log(`gsc property accessible: no (${e instanceof NoCredentials ? 'no credentials' : redact(e)})`);
    }
  }
  if (v.problems.length || budgetBad) return EXIT.USAGE;
  return onlineFailed ? EXIT.NET : EXIT.OK;
}

// ---------------------------------------------------------------- geo-probe

export async function runGeoProbe(ctx) {
  const { config, log } = ctx;
  const origin = String(ctx.origin).replace(/\/+$/, '');
  const today = isoDate(ctx.now());
  let robotsText;
  let ctype = '';
  try {
    const res = await timedFetch(ctx, `${origin}/robots.txt`, { headers: { 'User-Agent': GENERIC_UA, Accept: 'text/plain,*/*' } }, FETCH_TIMEOUT_MS);
    if (res.status !== 200) {
      log(`stopped: robots.txt answered HTTP ${res.status}`);
      return EXIT.NET;
    }
    robotsText = await res.text();
    ctype = String(res.headers?.get?.('content-type') ?? '');
  } catch (e) {
    log(`stopped: robots.txt ${netError(e)}`);
    return EXIT.NET;
  }
  const groups = parseRobots(robotsText);
  // A 200 that is an HTML page (SPA fallback) or has no user-agent line says nothing about the bots.
  if (/text\/html/i.test(ctype) || robotsText.trimStart().startsWith('<') || !groups.length) {
    log('stopped: robots.txt is not a robots file (HTML or no User-agent line); nothing was probed');
    return EXIT.NET;
  }
  const bots = [...config.geo.search_bots.map((b) => ({ bot: b, kind: 'search' })), ...config.geo.training_bots.map((b) => ({ bot: b, kind: 'training' }))];
  for (const b of bots) b.rules = Object.fromEntries(config.geo.paths.map((p) => [p, robotsAllows(groups, b.bot, p)]));

  let repoCompare = 'n/a (no repo_robots_path)';
  if (config.repo_robots_path) {
    try {
      const repo = fs.readFileSync(path.resolve(ctx.root, config.repo_robots_path), 'utf8');
      const nl = (s) => s.replace(/\r\n/g, '\n').trim();
      repoCompare = nl(repo) === nl(robotsText) ? 'identical' : 'differs';
    } catch {
      repoCompare = 'repo file unreadable';
    }
  }
  const contentSignal = /content-signal/i.test(robotsText);
  const cfMarker = /cloudflare/i.test(robotsText);

  let n = 0;
  const pace = async () => {
    if (n++ > 0) await ctx.sleep(GAP_MS);
  };
  for (const b of bots) {
    const ua = config.geo.user_agents[b.bot];
    if (!ua) continue;
    await pace();
    try {
      const res = await timedFetch(ctx, `${origin}/`, { headers: { 'User-Agent': ua }, redirect: 'manual' }, FETCH_TIMEOUT_MS);
      b.status = res.status;
      try {
        await res.arrayBuffer();
      } catch {
        /* body discarded */
      }
    } catch (e) {
      b.status = null;
      b.error = netError(e);
    }
  }
  await pace();
  let llms = null;
  try {
    const res = await timedFetch(ctx, `${origin}/llms.txt`, { headers: { 'User-Agent': GENERIC_UA }, redirect: 'manual' }, FETCH_TIMEOUT_MS);
    llms = res.status;
    try {
      await res.arrayBuffer();
    } catch {
      /* discarded */
    }
  } catch {
    llms = null;
  }

  log(`robots.txt: fetched; live vs repo file: ${repoCompare}${contentSignal ? '; live file has Content-Signal' : ''}${cfMarker ? '; live file has a Cloudflare marker' : ''}`);
  log(`bot | kind | rules (${config.geo.paths.join(' ')}) | live status`);
  for (const b of bots) log(`${b.bot} | ${b.kind} | ${config.geo.paths.map((p) => (b.rules[p] ? 'allow' : 'BLOCK')).join(' ')} | ${b.status === undefined ? 'no probe' : b.status ?? `error`}`);
  log(`llms.txt: ${llms ?? 'error'}`);
  log('rules-only proof: a spoofed user agent is not the real bot; Cloudflare verifies real bots by IP. The real check is the Cloudflare dashboard.');

  const badStatus = (s) => s === 401 || s === 403 || s === 429 || (typeof s === 'number' && s >= 500);
  const regressions = bots.filter((b) => b.kind === 'search' && (b.rules['/'] === false || badStatus(b.status))).map((b) => b.bot);
  const trainingBlocked = bots.filter((b) => b.kind === 'training' && (b.rules['/'] === false || badStatus(b.status))).map((b) => b.bot);
  if (trainingBlocked.length) log(`training bots blocked (information only, Karol's decision): ${trainingBlocked.join(', ')}`);
  writeJson(path.join(ctx.privateDir, 'geo', `${today}.json`), {
    date: today,
    origin,
    repo_compare: repoCompare,
    content_signal: contentSignal,
    cloudflare_marker: cfMarker,
    llms_status: llms,
    bots: bots.map((b) => ({ bot: b.bot, kind: b.kind, rules: b.rules, status: b.status ?? null, error: b.error ?? null })),
    search_bot_regressions: regressions,
    training_blocked: trainingBlocked,
  });
  if (regressions.length) {
    log(`REGRESSION: search bot(s) blocked: ${regressions.join(', ')}`);
    return EXIT.GEO;
  }
  return EXIT.OK;
}

// ---------------------------------------------------------------- main

const USAGE = `keyword-research ${ENGINE_VERSION}
usage: node scripts/keyword-research.mjs <command> [options]
  doctor [--online]
  gsc [--days N] [--end YYYY-MM-DD] [--country xxx] [--fresh]
  expand [seeds...] [--from-config] [--file path] [--market id] [--modifiers] [--plan]
  check [--staged] [--self-test]
  geo-probe
  bing | volumes | serp      (stubs in ${ENGINE_VERSION})
  help
global: --version, --config <path>   (or env KW_CONFIG)
exit: 0 ok, 1 check/self-test failure, 2 network source stopped, 3 insufficient data, 4 geo regression, 64 usage/config`;

const COMMANDS = ['doctor', 'gsc', 'expand', 'check', 'geo-probe', 'bing', 'volumes', 'serp', 'help'];
const VALUE_FLAGS = ['config', 'days', 'end', 'country', 'market', 'file'];
const BOOL_FLAGS = ['online', 'fresh', 'from-config', 'modifiers', 'plan', 'staged', 'self-test', 'help', 'version'];

export function parseArgs(argv) {
  const flags = {};
  const positional = [];
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '-h') flags.help = true;
    else if (a.startsWith('--')) {
      const eq = a.indexOf('=');
      const name = a.slice(2, eq < 0 ? undefined : eq);
      if (VALUE_FLAGS.includes(name)) {
        const val = eq >= 0 ? a.slice(eq + 1) : argv[++i];
        if (val === undefined || (eq < 0 && val.startsWith('--'))) throw new KwError(`--${name} needs a value`, EXIT.USAGE);
        flags[name] = val;
      } else if (BOOL_FLAGS.includes(name) && eq < 0) flags[name] = true;
      else throw new KwError(`unknown option ${a}`, EXIT.USAGE);
    } else positional.push(a);
  }
  return { command: positional[0] ?? null, positional: positional.slice(1), flags };
}

export async function main(argv = process.argv.slice(2), env = process.env, cwd = process.cwd()) {
  try {
    const { command, positional, flags } = parseArgs(argv);
    if (flags.version) {
      console.log(ENGINE_VERSION);
      return EXIT.OK;
    }
    if (!command || command === 'help' || flags.help) {
      console.log(USAGE);
      return EXIT.OK;
    }
    if (!COMMANDS.includes(command)) {
      console.log(`unknown command "${command}"\n${USAGE}`);
      return EXIT.USAGE;
    }
    if (command === 'check' && flags['self-test']) return await runSelfTest();
    if (typeof globalThis.fetch !== 'function') throw new KwError(`Node 18+ is required (this is ${process.version}): the global fetch is missing`, EXIT.USAGE);
    const root = findRepoRoot(cwd);
    const configPath = resolveConfigPath(root, flags.config, env);
    if (!configPath || !fs.existsSync(configPath)) throw new KwError('no config found (src/data/kw-config.json, data/kw-config.json, kw-config.json, --config or KW_CONFIG)', EXIT.USAGE);
    let config;
    try {
      config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    } catch (e) {
      throw new KwError(`config is not valid JSON: ${redact(e.message)}`, EXIT.USAGE);
    }
    const v = validateConfig(config);
    if (v.problems.length) {
      console.log(`config invalid (${configPath.replace(os.homedir(), '~')}):`);
      for (const p of v.problems) console.log(`  - ${p}`);
      return EXIT.USAGE;
    }
    if (config.engine_min_version && cmpSemver(config.engine_min_version, ENGINE_VERSION) > 0) throw new KwError(`config needs engine ${config.engine_min_version} or newer; this is ${ENGINE_VERSION}. Copy the newer script.`, EXIT.USAGE);
    const privateDir = resolvePrivateDir(config, root);
    // The stubs run after config validation like every command, but touch nothing and never read a key file.
    if (command === 'bing') {
      console.log(bingKeyPathPresent(env) ? 'bing: key present; API calls not built in 1.0.0 (needs the 3-call spike, see TODO-KAROL)' : 'skipped: no credentials');
      return EXIT.OK;
    }
    if (command === 'volumes' || command === 'serp') {
      console.log("skipped: no credentials (phase 3, needs Karol's OK)");
      return EXIT.OK;
    }
    const ctx = makeCtx({ root, config, configPath, privateDir, env });
    switch (command) {
      case 'doctor':
        return await runDoctor(ctx, { online: Boolean(flags.online) });
      case 'gsc': {
        const opts = { fresh: Boolean(flags.fresh) };
        if (flags.days !== undefined) {
          const n = Number(flags.days);
          if (!Number.isInteger(n) || n < 1 || n > 480) throw new KwError('--days must be an integer from 1 to 480', EXIT.USAGE);
          opts.days = n;
        }
        if (flags.end !== undefined) {
          if (!validDate(flags.end)) throw new KwError('--end must be YYYY-MM-DD', EXIT.USAGE);
          opts.end = flags.end;
        }
        if (flags.country !== undefined) {
          if (!/^[a-z]{3}$/.test(flags.country)) throw new KwError('--country takes a lowercase ISO-3166 alpha-3 code such as usa, tur, idn', EXIT.USAGE);
          opts.country = flags.country;
        }
        return await runGsc(ctx, opts);
      }
      case 'expand':
        return await runExpand(ctx, { seeds: positional, fromConfig: Boolean(flags['from-config']), file: flags.file, market: flags.market, modifiers: Boolean(flags.modifiers), plan: Boolean(flags.plan) });
      case 'check':
        return await runCheck(ctx, { staged: Boolean(flags.staged) });
      case 'geo-probe':
        ensurePrivateDir(privateDir);
        return await runGeoProbe(ctx);
      default:
        return EXIT.USAGE;
    }
  } catch (e) {
    if (e instanceof KwError) {
      console.log(`error: ${redact(e.message)}`);
      return e.code;
    }
    // Unexpected I/O or internal errors: not 1, which means "check violations".
    console.log(`error: ${redact(e)}`);
    return EXIT.USAGE;
  }
}

function bingKeyPathPresent(env) {
  return credStatus(bingKeyPath(env)).present; // stat only, never read
}

// ---------------------------------------------------------------- self-test (offline; mock server on 127.0.0.1 only)

export async function runSelfTest(log = (s) => console.log(s)) {
  const tests = [];
  const t = (name, fn) => tests.push({ name, fn });
  const ok = (cond, msg) => {
    if (!cond) throw new Error(msg || 'assertion failed');
  };
  const eq = (a, b, msg = '') => ok(JSON.stringify(a) === JSON.stringify(b), `${msg} expected ${JSON.stringify(b)}, got ${JSON.stringify(a)}`.trim());

  const tmp = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), 'kw-selftest-')));
  const repo = path.join(tmp, 'repo');
  fs.mkdirSync(path.join(repo, 'public'), { recursive: true });
  let dirN = 0;
  const newPriv = () => path.join(tmp, `priv-${++dirN}`);

  const baseConfig = (priv) => ({
    engine_min_version: '1.0.0',
    site: 'example.test',
    origin: 'https://example.test',
    private_dir: priv,
    clusters_file: 'clusters.json',
    public_docs_dir: 'docs/kw',
    repo_robots_path: 'public/robots.txt',
    gsc: { property: 'sc-domain:example.test', regex_families: [{ id: 'widget', pattern: 'widget' }] },
    autocomplete: { daily_cap: 15, markets: [{ id: 'us', hl: 'en', gl: 'us', cap: 10 }, { id: 'tr', hl: 'tr', gl: 'tr', cap: 5 }], modifiers: ['for'] },
    seeds: [{ seed: 'seed one' }, { seed: 'seed two' }],
    intent_rules: [
      { intent: 'navigational', pattern: '\\bexample\\b' },
      { intent: 'question', pattern: '^(what|how|why)\\b' },
      { intent: 'compare', pattern: '\\b(vs|best)\\b' },
      { intent: 'tool', pattern: '\\bgenerator\\b' },
      { intent: 'app-install', pattern: '\\b(app|widget)\\b' },
    ],
    modifiers: ['kjv'],
    public_ban_phrases: ['\\bexample( app)? is (totally )?free\\b'],
    geo: {
      paths: ['/', '/blog/', '/llms.txt'],
      search_bots: ['Searchy', 'Fetchy'],
      training_bots: ['Trainy'],
      user_agents: { Searchy: 'Searchy/1.0', Fetchy: 'Fetchy/1.0', Trainy: 'Trainy/1.0' },
    },
  });

  // ---- mock server
  const mock = { requests: [], gscFail: 0, gsc: null, robots: '', blockUa: '' };
  const server = http.createServer((req, res) => {
    const u = new URL(req.url, 'http://127.0.0.1');
    let body = '';
    req.on('data', (c) => (body += c));
    req.on('end', () => {
      mock.requests.push({ path: u.pathname, q: u.searchParams.get('q'), hl: u.searchParams.get('hl'), gl: u.searchParams.get('gl'), ua: req.headers['user-agent'], auth: req.headers.authorization });
      const send = (status, ctype, text) => {
        res.writeHead(status, { 'Content-Type': ctype });
        res.end(Buffer.from(text, 'utf8'));
      };
      if (u.pathname === '/complete/search') {
        const q = u.searchParams.get('q') ?? '';
        if (q.startsWith('trigger429')) return send(429, 'text/plain', 'slow down');
        if (q.startsWith('trigger500')) return send(500, 'text/plain', 'oops');
        if (q.startsWith('triggerhtml')) return send(200, 'text/html; charset=utf-8', '<html>captcha</html>');
        if (q.startsWith('triggerbad')) return send(200, 'application/json', '{"a":1}');
        if (q.startsWith('triggerhang')) return; // never answers
        return send(200, 'application/json; charset=UTF-8', JSON.stringify([q, [`${q} a`, `${q} b`]]));
      }
      if (u.pathname === '/robots.txt') return send(200, 'text/plain', mock.robots);
      if (u.pathname === '/llms.txt') return send(404, 'text/plain', 'no');
      if (u.pathname === '/') return send(mock.blockUa && String(req.headers['user-agent']).includes(mock.blockUa) ? 403 : 200, 'text/html', '<html></html>');
      if (u.pathname === '/token') return send(200, 'application/json', JSON.stringify({ access_token: 'mock-access', expires_in: 3600 }));
      if (u.pathname.startsWith('/webmasters/v3/sites') && !u.pathname.endsWith('/query')) return send(200, 'application/json', JSON.stringify({ siteEntry: [{ siteUrl: 'sc-domain:example.test', permissionLevel: 'siteOwner' }] }));
      if (u.pathname.endsWith('/searchAnalytics/query')) {
        if (mock.gscFail) return send(mock.gscFail, 'application/json', JSON.stringify({ error: { message: 'denied for key=SECRETVALUE123 Bearer abcdefabcdefabcdefabcdef' } }));
        const b = JSON.parse(body || '{}');
        const dims = (b.dimensions ?? []).join(',');
        const rows = mock.gsc?.[dims] ?? [];
        return send(200, 'application/json', JSON.stringify({ rows }));
      }
      return send(404, 'text/plain', 'nf');
    });
  });
  await new Promise((r) => server.listen(0, '127.0.0.1', r));
  const base = `http://127.0.0.1:${server.address().port}`;

  let clock = new Date('2026-11-16T10:00:00Z');
  const lines = [];
  const mk = (over = {}) => {
    const priv = over.priv ?? newPriv();
    const config = over.config ?? baseConfig(priv);
    lines.length = 0;
    return makeCtx({ root: repo, config, configPath: null, privateDir: priv, now: () => clock, sleep: async () => {}, log: (s) => lines.push(s), suggestBase: base, gscBase: base, tokenUrl: `${base}/token`, env: over.env ?? {}, origin: over.origin, ...over.extra });
  };
  const reqCount = (p) => mock.requests.filter((r) => r.path === p).length;

  // ---------------------------------------------------------------- 1. ban rules
  const GOOD = ['bible verse for anxiety', 'updated 2026-11-16', 'iOS 16 widget', 'best bible app 2026', 'engine 1.0.0', 'demand: autocomplete shows the phrase', 'best free bible app iphone', '.claude/skills/faithwall-blog/SKILL.md', '3 verses a day', 'she searched for a verse'];
  const key35 = 'x'.repeat(35);
  const BAD = {
    B1: ['about 1,200 searches a month', 'impressions: 340', '5 clicks last week', 'about 1.200.000 impressions', 'impressions 1.200.000', '1.2.3 searches', '１２００ searches', '١٢٠٠ searches', 'it gets ~1.4k', 'Post ranks 5 for this phrase', 'searched 300 times', 'about 300 searched', 'searched: 40'],
    B2: ['ranks on page 1 of Google', 'the first page result', 'top 10 apps', 'it is #1 for that', 'positions 3-5 on Google', 'a 1st page result'],
    B3: ['a 50% jump', 'ctr of 12.5 %', 'up 5 per cent', '20 percent more'],
    B4: ['costs $9 a month', 'pay 5 eur', '€ 20 budget'],
    B5: ['see ~/.claude/secrets/x', 'file /Users/someone/x', 'service-account-key.json', 'budget.json holds it', 'in faithwall-gsc/kw', 'file /users/someone/x', 'in C:\\Users\\someone\\x', 'see %2FUsers%2Fsomeone', 'see %2fusers%2fsomeone'],
    B6: ['-----BEGIN ' + 'PRIVATE KEY-----', '-----begin ' + 'private key-----', '"private_key": "abc"', 'AIza' + key35, 'ya29.a0AfH6SMBxxxx', 'Bearer ' + 'a'.repeat(24), 'api_key=abc', 'deadbeef'.repeat(4), 'Ab1' + 'x'.repeat(40)],
    B7: ['| widget | ~340 |', '| 1,200 | x |', '| a | 5k |'],
    B8: ['Example is free to use', 'example app is totally free'],
  };
  const phrases = baseConfig('x').public_ban_phrases;
  t('ban rules: shared good strings pass every rule', () => {
    for (const g of GOOD) {
      const hit = scanBan(g, { prose: true, table: true, phrases });
      ok(!hit.length, `good string flagged: "${g}" -> ${hit.map((h) => h.rule)}`);
    }
  });
  for (const rule of BAN_RULE_IDS) {
    t(`ban rule ${rule}: bad strings fail`, () => {
      for (const s of BAD[rule]) {
        const hit = scanBan(s, { prose: true, table: true, phrases });
        ok(hit.some((h) => h.rule === rule), `${rule} did not flag "${s.slice(0, 30)}"`);
      }
    });
  }
  t('ban rule B6: a failure never echoes the secret', () => {
    const secret = 'AIza' + 'Q'.repeat(35);
    const hit = scanBan(`key ${secret}`, {});
    ok(hit.some((h) => h.rule === 'B6'), 'B6 not raised');
    const out = formatViolation('FAIL', 'f.md', { ...hit.find((h) => h.rule === 'B6'), line: 3, where: null });
    ok(!out.includes(secret) && !out.includes('QQQQ'), 'secret echoed');
    ok(!('snippet' in hit.find((h) => h.rule === 'B6')), 'B6 hit carries a snippet');
  });
  t('ban rules: volume_band is exempt from B1, B3, B7 only; members skip B8, prose does not', () => {
    eq(jsonScanOpts('clusters', 'clusters[0].volume_band', phrases).skip, ['B1', 'B3', 'B7']);
    ok(!jsonScanOpts('clusters', 'clusters[0].members[1]', phrases).prose, 'member treated as prose');
    ok(jsonScanOpts('clusters', 'clusters[0].notes', phrases).prose, 'notes not prose');
    ok(jsonScanOpts('clusters', 'clusters[0].evidence[0].note', phrases).prose, 'evidence note not prose');
    ok(scanJsonText(JSON.stringify({ clusters: [{ members: ['example is free app'] }] }), 'clusters', phrases).length === 0, 'member hit B8');
    ok(scanJsonText(JSON.stringify({ clusters: [{ notes: 'example is free' }] }), 'clusters', phrases).some((h) => h.rule === 'B8'), 'notes missed B8');
  });
  t('ban rules: dates and semver are removed before testing', () => {
    ok(!scanBan('| 2026-11-16 | 1.0.0 |', { table: true }).length, 'date/semver flagged');
  });

  // ---------------------------------------------------------------- 2. schema
  const today = '2026-11-16';
  const cfg0 = baseConfig('x');
  const validDoc = () => ({
    engine_version: '1.0.0',
    site: 'example.test',
    updated: today,
    clusters: [
      { id: 'anxiety', name: 'anxiety verses', head_keyword: 'bible verse for anxiety', members: ['bible verse for anxiety', 'bible verses for anxiety'], intent: 'mood', content_type: 'blog', target_url: '/blog/anxiety', decision: 'refresh', evidence: [{ type: 'gsc', fetched: '2026-11-13', note: 'Search Console queries' }] },
      { id: 'widgets', name: 'widget verses', head_keyword: 'bible verse widget', members: ['bible verse widget'], intent: 'app-install', content_type: 'aso-handoff', target_url: null, decision: 'aso-handoff', aso_handoff: true, evidence: [{ type: 'autocomplete', fetched: today, note: 'demand: autocomplete shows the phrase' }] },
    ],
  });
  const schema = (doc, extra = {}) => validateClusters(doc, { config: cfg0, today, ...extra });
  t('schema: a valid file passes', () => {
    const r = schema(validDoc());
    eq(r.fails, [], 'fails');
  });
  const bad = {
    'duplicate id': (d) => (d.clusters[1].id = 'anxiety'),
    'a member in two clusters': (d) => d.clusters[1].members.push('bible verse for anxiety'),
    'an unknown key': (d) => (d.clusters[0].impressions = 5),
    'a volume_band without ads/dataforseo evidence': (d) => (d.clusters[0].volume_band = '10-100'),
    'a gsc note with a digit': (d) => (d.clusters[0].evidence[0].note = 'Search Console queries 90 days'),
    'evidence without fetched': (d) => delete d.clusters[0].evidence[0].fetched,
    'a future fetched date': (d) => (d.clusters[0].evidence[0].fetched = '2026-11-17'),
    'hold without hold_reason': (d) => (d.clusters[0].decision = 'hold'),
    'target_url with a host': (d) => (d.clusters[0].target_url = 'https://example.test/blog/x'),
    'head_keyword not in members': (d) => (d.clusters[0].head_keyword = 'something else'),
    'a source-less forum evidence': (d) => d.clusters[0].evidence.push({ type: 'forum', fetched: today, note: 'thread' }),
    'a stray top-level key': (d) => (d.score = 1),
  };
  for (const [name, mut] of Object.entries(bad))
    t(`schema: fails on ${name}`, () => {
      const d = validDoc();
      mut(d);
      ok(schema(d).fails.length > 0, 'no failure raised');
    });
  t('schema: volume_band passes with ads evidence and a source; sitemap warns; queue links', () => {
    const d = validDoc();
    d.clusters[0].evidence.push({ type: 'ads', fetched: today, note: 'planner band', source: 'Keyword Planner export' });
    d.clusters[0].volume_band = '100-1k';
    eq(schema(d).fails, [], 'band with ads');
    const w = schema(validDoc(), { sitemap: new Set(['/']) });
    ok(w.warns.some((x) => x.path.endsWith('target_url')), 'no sitemap warning');
    ok(!w.fails.length, 'sitemap warn failed');
    const d2 = validDoc();
    d2.clusters[0].queue_id = 'p9';
    const q = schema(d2, { priorities: { queue: [{ id: 'p1', cluster_id: 'nope' }], done: [] } });
    ok(q.fails.some((x) => x.msg.includes('matches no cluster id')), 'cluster_id link not enforced');
    ok(q.warns.some((x) => x.path.endsWith('queue_id')), 'queue_id warn missing');
  });

  // ---------------------------------------------------------------- 3. redact
  t('redact: key=, Bearer, PEM, private_key, client_email, home path', () => {
    const home = os.homedir();
    const pem = '-----BEGIN ' + 'PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASC\n-----END ' + 'PRIVATE KEY-----';
    const s = redact(`GET https://x.test/a?q=1&key=SECRETKEY123&z=2 Bearer abcdefghij.klmnop-qrstuv ya29.a0AbCdEf ${pem} {"private_key": "SECRETPK", "client_email": "sa@proj.iam.test"} ${home}/file access_token=TOK123`);
    for (const bad2 of ['SECRETKEY123', 'abcdefghij.klmnop', 'ya29.a0AbCdEf', 'MIIEvQIBADANBg', 'SECRETPK', 'sa@proj.iam.test', 'TOK123']) ok(!s.includes(bad2), `leaked ${bad2.slice(0, 6)}`);
    if (home.length > 1) ok(!s.includes(home) && s.includes('~/file'), 'home path not replaced');
    ok(redact(new Error('boom key=ABC')).includes('boom'), 'Error message dropped');
  });

  // ---------------------------------------------------------------- normalise, clustering, holds, decisions
  t('normalize: quotes, punctuation, inner apostrophes and hyphens', () => {
    eq(normalize('  Bible’s “Verse” — for…  ANXIETY!! '), "bible's verse for anxiety");
    eq(normalize('well-known -lead trail- a--b'), 'well-known lead trail a b');
    eq(normalize('namaz vakti için dua'), 'namaz vakti için dua');
  });
  t('leader clustering never chains (union-find would join all four)', () => {
    const items = [['alpha beta gamma', 40], ['beta gamma delta', 30], ['gamma delta epsilon', 20], ['delta epsilon zeta', 10]].map(([q, weight]) => ({ q, weight }));
    const cl = leaderCluster(items);
    eq(cl.length, 2, 'cluster count');
    eq(cl[0].members.map((m) => m.q), ['alpha beta gamma', 'beta gamma delta']);
    eq(cl[1].members.map((m) => m.q), ['gamma delta epsilon', 'delta epsilon zeta']);
  });
  t('hold detection: "/blog/a + /blog/b (notes)" with a future not_before holds both; past or done does not', () => {
    const pr = { queue: [{ id: 'p1', status: 'pending', not_before: '2026-12-01', target_url: '/blog/a + /blog/b (notes)' }, { id: 'p2', status: 'done', not_before: '2026-12-01', target_url: '/blog/c' }, { id: 'p3', status: 'pending', not_before: '2026-11-01', target_url: '/blog/d' }, { id: 'p4', status: 'pending', not_before: '2026-12-05', target_url: '/ (homepage FAQ) + outreach/ (x)' }] };
    const h = detectHolds({ hold_lists: [{ until: '2026-12-02', reason: 'control group', urls: ['/blog/z/'] }, { until: '2026-11-01', reason: 'old', urls: ['/blog/old'] }] }, pr, today);
    eq([...h.keys()].sort(), ['/', '/blog/a', '/blog/b', '/blog/z']);
    eq(h.get('/blog/a').reason, 'queued as p1 until 2026-12-01');
    eq(h.get('/blog/z').reason, 'control group');
  });
  t('suggested decision rubric, first match wins', () => {
    const pg = (path2, share, position) => ({ path: path2, share, position });
    const holds = new Map([['/held', { reason: 'r', until: '2026-12-01' }]]);
    eq(suggestDecision({ head: 'x', intent: 'tool', pages: [pg('/held', 1, 5)], position: 5 }, holds).decision, 'hold');
    eq(suggestDecision({ head: 'x', intent: 'tool', pages: [pg('/a', 0.5, 5), pg('/b', 0.5, 6)], position: 5 }).decision, 'prune-merge');
    eq(suggestDecision({ head: 'x', intent: 'tool', pages: [pg('/a', 0.9, 8)], position: 8 }).decision, 'ctr-fix');
    eq(suggestDecision({ head: 'x', intent: 'tool', pages: [pg('/a', 0.9, 14)], position: 14 }).decision, 'refresh');
    eq(suggestDecision({ head: 'x', intent: 'app-install', pages: [pg('/a', 0.9, 40)], position: 40 }).decision, 'aso-handoff');
    eq(suggestDecision({ head: 'how long is a verse', intent: 'question', pages: [pg('/a', 0.9, 40)], position: 40 }).decision, 'faq-add');
    eq(suggestDecision({ head: 'x', intent: 'tool', pages: [], position: 40 }).decision, 'new-tool');
    eq(suggestDecision({ head: 'x', intent: 'compare', pages: [], position: 40 }).decision, 'compare');
    eq(suggestDecision({ head: 'x', intent: 'informational', pages: [], position: 40 }).decision, 'new-post');
  });

  t('rubric: navigational intent is monitor, ahead of hold and ctr-fix', () => {
    const pg = (path2, share, position) => ({ path: path2, share, position });
    const holds = new Map([['/held', { reason: 'r', until: '2026-12-01' }]]);
    eq(suggestDecision({ head: 'examplebrand', intent: 'navigational', pages: [pg('/a', 0.95, 2)], position: 2 }).decision, 'monitor');
    eq(suggestDecision({ head: 'example brand', intent: 'navigational', pages: [pg('/held', 1, 3)], position: 3 }, holds).decision, 'monitor');
    eq(suggestDecision({ head: 'example brand', intent: 'navigational', pages: [], position: 30 }).decision, 'monitor');
  });
  t('rubric: follow-up fragments are monitor, even on a held page; the short-head test needs regex families', () => {
    const pg = (path2, share, position) => ({ path: path2, share, position });
    const holds = new Map([['/held', { reason: 'r', until: '2026-12-01' }]]);
    const cfg = { gsc: { regex_families: [{ id: 'w', pattern: 'widget|lock ?screen' }, { id: 'u', pattern: 'daily' }] } };
    const dec = (head, members, pages, config, h) => suggestDecision({ head, members, intent: 'informational', pages, position: 8 }, h, config).decision;
    eq(dec('and what about the others', [], [pg('/a', 0.9, 8)], cfg), 'monitor'); // AI_FRAGMENT_RE, no family needed
    eq(dec('and what about the others', [], [pg('/a', 0.9, 8)], {}), 'monitor');
    eq(dec('yes', ['yes'], [pg('/held', 1, 5)], cfg, holds), 'monitor'); // before hold
    eq(dec('gadget', ['gadget', 'gadget new'], [pg('/a', 0.9, 8)], cfg), 'monitor'); // two words or fewer, no family match
    eq(dec('gadget', ['gadget', 'widget gadget'], [pg('/a', 0.9, 8)], cfg), 'ctr-fix'); // half the members match a family
    eq(dec('gadget', ['gadget', 'gadget a', 'gadget b', 'gadget c', 'widget gadget'], [pg('/a', 0.9, 8)], cfg), 'monitor'); // one stray member in five does not rescue it
    eq(dec('gadget', [{ query: 'gadget', impressions: 5 }, { query: 'widget gadget', impressions: 95 }], [pg('/a', 0.9, 8)], cfg), 'ctr-fix'); // weighted by impressions
    eq(dec('gadget', [{ query: 'gadget', impressions: 95 }, { query: 'widget gadget', impressions: 5 }], [pg('/a', 0.9, 8)], cfg), 'monitor');
    eq(dec('daily gadget', ['daily gadget'], [pg('/a', 0.9, 8)], cfg), 'ctr-fix'); // head matches
    eq(dec('gadget of many parts', [], [pg('/a', 0.9, 8)], cfg), 'ctr-fix'); // three words: not a short fragment
    eq(dec('gadget', ['gadget'], [pg('/a', 0.9, 8)], {}), 'ctr-fix'); // no families configured: test skipped
    eq(dec('gadget', ['gadget'], [pg('/a', 0.9, 8)], { gsc: { regex_families: [] } }), 'ctr-fix');
    eq(dec('gadget', ['gadget'], [], { gsc: {} }), 'new-post');
    eq(dec('another', ['another'], [pg('/a', 0.9, 8)], {}), 'monitor'); // AI_FRAGMENT_RE, even with no families
    eq(dec('how can i change it', ['how can i change it'], [pg('/a', 0.5, 8), pg('/b', 0.5, 8)], {}), 'monitor'); // ends in a bare pronoun, ahead of prune-merge
    eq(dec('give me this', [], [pg('/a', 0.9, 8)], {}), 'monitor');
    eq(dec('how can i change the gadget', [], [pg('/a', 0.9, 8)], {}), 'ctr-fix'); // a real question stays
    eq(dec('it', [], [pg('/a', 0.9, 8)], {}), 'monitor'); // single word: AI_FRAGMENT_RE
  });
  t('rubric: a long AI Mode question is monitor at position 5 or better, else faq-add; no page falls through', () => {
    const pg = (path2, share, position) => ({ path: path2, share, position });
    const q = 'what are some alternatives to the example gadget for guided example tasks and more';
    ok(q.split(' ').length >= 9, 'fixture too short');
    eq(suggestDecision({ head: q, intent: 'compare', pages: [pg('/a', 0.9, 1.4)], position: 1.4 }).decision, 'monitor');
    eq(suggestDecision({ head: q, intent: 'compare', pages: [pg('/a', 0.9, 5)], position: 5 }).decision, 'monitor');
    eq(suggestDecision({ head: q, intent: 'compare', pages: [pg('/a', 0.9, 5.1)], position: 5.1 }).decision, 'faq-add');
    eq(suggestDecision({ head: q, intent: 'question', pages: [pg('/a', 0.9, 9)], position: 9 }).decision, 'faq-add');
    eq(suggestDecision({ head: q, intent: 'compare', pages: [], position: 9 }).decision, 'compare');
    eq(suggestDecision({ head: q, intent: 'question', pages: [pg('/a', 0.5, 9), pg('/b', 0.5, 9)], position: 9 }).decision, 'prune-merge'); // prune-merge still comes first
  });
  t('rubric: prune-merge only between pages of the same kind (tool_pages); contentTypeFor knows tool pages', () => {
    const pg = (path2, share, position) => ({ path: path2, share, position });
    const cfg = { tool_pages: ['/maker', '/picker/'] };
    const two = (a, b, intent) => suggestDecision({ head: 'x', intent, pages: [pg(a, 0.5, 8), pg(b, 0.5, 9)], position: 8 }, new Map(), cfg).decision;
    eq(two('/blog/a', '/blog/b', 'tool'), 'prune-merge');
    eq(two('/maker', '/picker', 'tool'), 'prune-merge');
    eq(two('/blog/a', '/maker', 'tool'), 'new-tool'); // falls through to the next rules
    eq(two('/picker', '/blog/a', 'compare'), 'compare');
    eq(two('/blog/a', '/maker', 'informational'), 'new-post');
    eq(suggestDecision({ head: 'x', intent: 'tool', pages: [pg('/a', 0.5, 8), pg('/b', 0.5, 9)], position: 8 }).decision, 'prune-merge'); // no tool_pages configured: two other pages
    // page kinds: blog / home / other / tool; only the same kind pairs up
    eq(two('/blog/a', '/landing', 'informational'), 'new-post');
    eq(two('/', '/blog/a', 'informational'), 'new-post');
    eq(two('/', '/landing', 'informational'), 'new-post');
    eq(two('/landing', '/privacy', 'informational'), 'prune-merge');
    eq(two('/vs-a', '/vs-b', 'compare'), 'prune-merge'); // two comparison pages
    eq(two('/landing', '/maker', 'informational'), 'new-post');
    eq(pageKind('/blog/a/', new Set()), 'blog');
    eq(pageKind('/', new Set()), 'home');
    eq(pageKind('/maker/', toolPageSet(cfg)), 'tool');
    eq(contentTypeFor('ctr-fix', '/maker', cfg), 'tool-page');
    eq(contentTypeFor('refresh', '/picker/', cfg), 'tool-page');
    eq(contentTypeFor('refresh', '/blog/a', cfg), 'blog');
    eq(contentTypeFor('refresh', '/maker'), 'money-page');
    const bad = validateConfig({ ...baseConfig(newPriv()), tool_pages: ['maker'] });
    ok(bad.problems.some((p) => p.startsWith('tool_pages')), 'tool_pages without a leading slash accepted');
    for (const v of ['/x', {}, [1], ['/x', 2], null, [null], ['']]) ok(validateConfig({ ...baseConfig(newPriv()), tool_pages: v }).problems.some((p) => p.startsWith('tool_pages')), `tool_pages ${JSON.stringify(v)} accepted`);
    eq(validateConfig({ ...baseConfig(newPriv()), tool_pages: ['/maker'] }).problems.filter((p) => p.startsWith('tool_pages')), []);
    eq(validateConfig({ ...baseConfig(newPriv()), tool_pages: [] }).problems.filter((p) => p.startsWith('tool_pages')), []);
    eq(validateConfig({ ...baseConfig(newPriv()), tool_pages: ['/maker'] }).warnings.filter((p) => p.includes('tool_pages')), []);
  });
  t('analyse: the suggested decision sees members and the config (fragment and tool-page rules)', () => {
    const cfg = { ...baseConfig(newPriv()), tool_pages: ['/maker'] };
    const rows = (q, page, impressions, position) => ({ keys: [page, q], impressions, clicks: 0, position });
    const a = analyse({ queryRows: [{ keys: ['gadget'], impressions: 50, clicks: 0, position: 8 }, { keys: ['widget setup guide'], impressions: 40, clicks: 2, position: 6 }], pageQueryRows: [rows('gadget', 'https://example.test/a', 50, 8), rows('widget setup guide', 'https://example.test/blog/b', 20, 6), rows('widget setup guide', 'https://example.test/maker', 20, 6)] }, cfg);
    eq(a.clusters.find((c) => c.head === 'gadget').suggested_decision, 'monitor');
    ok(a.clusters.find((c) => c.head === 'widget setup guide').suggested_decision !== 'prune-merge', 'blog + tool page pair still prune-merge');
    ok(a.clusters.find((c) => c.head === 'widget setup guide').flags.shared_pages, 'two pages sharing 20%+ must set flags.shared_pages even without prune-merge');
    ok(!a.clusters.find((c) => c.head === 'gadget').flags.shared_pages, 'one page: no shared_pages flag');
  });
  t('gscKeySource names where the credential comes from, never the path', () => {
    eq(gscKeySource({ gsc: { key_path: '/x/k.json' } }, {}), 'config gsc.key_path');
    eq(gscKeySource({ gsc: { key_path: '/x/k.json' } }, { GSC_KEY_FILE: '/y' }), 'env GSC_KEY_FILE');
    eq(gscKeySource({ gsc: {} }, { GOOGLE_APPLICATION_CREDENTIALS: '/y' }), 'env GOOGLE_APPLICATION_CREDENTIALS');
    ok(gscKeySource({ gsc: {} }, {}).startsWith('built-in default'), 'default');
  });

  // ---------------------------------------------------------------- 4. budget
  const mkBudget = (priv, over = {}) => ({ privateDir: priv, site: 'example.test', marketId: 'us', dailyCap: 15, marketCap: 15, now: () => clock, ...over });
  t('budget: 15 requests allowed, the rest deferred', () => {
    const priv = newPriv();
    let allowed = 0;
    for (let i = 0; i < 20; i++) if (reserveBudget(mkBudget(priv)).ok) allowed++;
    eq(allowed, 15);
    eq(readBudget(priv, 'example.test', '2026-11-16').total, 15);
  });
  t('budget: a configured daily_cap above the hard cap is still 15', () => {
    const priv = newPriv();
    let allowed = 0;
    for (let i = 0; i < 20; i++) if (reserveBudget(mkBudget(priv, { dailyCap: 99, marketCap: 99 })).ok) allowed++;
    eq(allowed, 15);
  });
  t('budget: per-market caps hold', () => {
    const priv = newPriv();
    let us = 0;
    let tr = 0;
    for (let i = 0; i < 12; i++) if (reserveBudget(mkBudget(priv, { marketId: 'us', marketCap: 10 })).ok) us++;
    for (let i = 0; i < 12; i++) if (reserveBudget(mkBudget(priv, { marketId: 'tr', marketCap: 5 })).ok) tr++;
    eq([us, tr], [10, 5]);
    eq(reserveBudget(mkBudget(priv, { marketId: 'tr', marketCap: 9 })).ok, false, 'daily cap after 15');
  });
  t('budget: two runs on one day share the counter; the next day resets', () => {
    const priv = newPriv();
    for (let i = 0; i < 3; i++) reserveBudget(mkBudget(priv));
    for (let i = 0; i < 4; i++) reserveBudget(mkBudget(priv));
    eq(readBudget(priv, 'example.test', '2026-11-16').total, 7);
    clock = new Date('2026-11-17T00:00:01Z');
    const r = reserveBudget(mkBudget(priv));
    clock = new Date('2026-11-16T10:00:00Z');
    ok(r.ok && r.total === 1, 'next day did not reset');
  });
  t('budget: file mode 600, lock released, stale lock removed, fresh lock blocks', () => {
    const priv = newPriv();
    reserveBudget(mkBudget(priv));
    eq(modeOf(path.join(priv, 'budget.json')), '600');
    ok(!fs.existsSync(path.join(priv, 'budget.lock')), 'lock left behind');
    const lock = path.join(priv, 'budget.lock');
    fs.writeFileSync(lock, '1');
    fs.utimesSync(lock, new Date(Date.now() - 60000), new Date(Date.now() - 60000));
    ok(reserveBudget(mkBudget(priv)).ok, 'stale lock not removed');
  });
  t('budget: entries older than 14 days are pruned', () => {
    const priv = newPriv();
    ensureDir(priv);
    writeJson(path.join(priv, 'budget.json'), { 'example.test': { '2026-10-01': { total: 3, markets: { us: 3 } } } });
    reserveBudget(mkBudget(priv));
    ok(!('2026-10-01' in readJsonSafe(path.join(priv, 'budget.json'), {})['example.test']), 'old day kept');
  });

  // ---------------------------------------------------------------- 5. expand against the mock server
  t('expand: a 200 JSON response parses, request uses the generic user agent, budget counts it', async () => {
    const ctx = mk();
    const before = mock.requests.length;
    const code = await runExpand(ctx, { seeds: ['Bible Verse'] });
    eq(code, 0);
    const day = readJsonSafe(path.join(ctx.privateDir, 'expand', '2026-11-16.json'), null);
    eq(day.seeds['us|bible verse'].suggestions.map((s) => s.text), ['bible verse a', 'bible verse b']);
    eq(mock.requests.length - before, 1);
    eq(mock.requests.at(-1).ua, GENERIC_UA);
    eq(mock.requests.at(-1).gl, 'us');
    eq(readBudget(ctx.privateDir, 'example.test', '2026-11-16').total, 1);
    eq(modeOf(path.join(ctx.privateDir, 'cache', 'autocomplete.json')), '600');
    ok(fs.existsSync(path.join(ctx.privateDir, 'expand', '2026-11-16.md')), 'md missing');
  });
  t('expand: a cache hit makes no request, spends no budget and keeps its original date', async () => {
    const priv = newPriv();
    await runExpand(mk({ priv }), { seeds: ['cached seed'] });
    clock = new Date('2026-11-20T10:00:00Z');
    const before = mock.requests.length;
    const ctx = mk({ priv });
    const code = await runExpand(ctx, { seeds: ['cached seed'] });
    clock = new Date('2026-11-16T10:00:00Z');
    eq(code, 0);
    eq(mock.requests.length, before, 'request sent');
    eq(readBudget(priv, 'example.test', '2026-11-20').total, 0);
    const day = readJsonSafe(path.join(priv, 'expand', '2026-11-20.json'), null);
    eq([day.seeds['us|cached seed'].from_cache, day.seeds['us|cached seed'].fetched], [true, '2026-11-16']);
  });
  t('expand: an entry past its TTL is refetched', async () => {
    const priv = newPriv();
    await runExpand(mk({ priv }), { seeds: ['ttl seed'] });
    clock = new Date('2026-12-17T10:00:00Z'); // 31 days later
    const before = mock.requests.length;
    const code = await runExpand(mk({ priv }), { seeds: ['ttl seed'] });
    clock = new Date('2026-11-16T10:00:00Z');
    eq(code, 0);
    eq(mock.requests.length - before, 1, 'not refetched');
    eq(readJsonSafe(path.join(priv, 'cache', 'autocomplete.json'), {})['en|us|ttl seed'].fetched, '2026-12-17');
  });
  for (const [label, trig, reason] of [['429', 'trigger429', 'HTTP 429'], ['an HTML body', 'triggerhtml', 'html'], ['a 500', 'trigger500', 'HTTP 500'], ['a non-array JSON body', 'triggerbad', 'shape']])
    t(`expand: ${label} stops the run with exit 2 and keeps partial results`, async () => {
      const priv = newPriv();
      const ctx = mk({ priv });
      const before = mock.requests.length;
      const code = await runExpand(ctx, { seeds: ['good seed', `${trig} seed`, 'never reached'] });
      eq(code, 2);
      ok(lines.some((l) => l.startsWith('stopped:') && l.includes(reason)), `no "stopped: ${reason}" line: ${lines.join(' / ')}`);
      eq(mock.requests.length - before, 2, 'requests after the stop');
      const day = readJsonSafe(path.join(priv, 'expand', '2026-11-16.json'), null);
      ok(day && day.seeds['us|good seed'], 'partial result lost');
      eq(readBudget(priv, 'example.test', '2026-11-16').total, 2, 'failed request must count');
    });
  t('expand: a timeout stops the run with exit 2', async () => {
    const ctx = mk({ extra: { suggestTimeoutMs: 150 } });
    const code = await runExpand(ctx, { seeds: ['triggerhang seed'] });
    eq(code, 2);
    ok(lines.some((l) => l.includes('stopped: timeout')), lines.join(' / '));
  });
  t('expand: a network error stops the run with exit 2 and still counts', async () => {
    const priv = newPriv();
    const ctx = mk({ priv, extra: { fetchImpl: async () => { throw new Error('connect ECONNREFUSED key=LEAKME'); } } });
    const code = await runExpand(ctx, { seeds: ['one'] });
    eq(code, 2);
    ok(!lines.join('\n').includes('LEAKME'), 'secret leaked in stop line');
    eq(readBudget(priv, 'example.test', '2026-11-16').total, 1);
  });
  t('expand: UTF-8 round-trips (namaz vakti için dua, doa sebelum tidur)', async () => {
    const ctx = mk();
    const code = await runExpand(ctx, { seeds: ['namaz vakti için dua', 'doa sebelum tidur'], market: 'tr' });
    eq(code, 0);
    const day = readJsonSafe(path.join(ctx.privateDir, 'expand', '2026-11-16.json'), null);
    eq(day.seeds['tr|namaz vakti için dua'].suggestions[0].text, 'namaz vakti için dua a');
    eq(day.seeds['tr|doa sebelum tidur'].suggestions[1].text, 'doa sebelum tidur b');
    eq([mock.requests.at(-1).hl, mock.requests.at(-1).gl], ['tr', 'tr']);
  });
  t('expand: caps defer the rest (daily 15, market 10 + 5), exit 0, nothing more sent', async () => {
    const priv = newPriv();
    const seeds = Array.from({ length: 20 }, (_, i) => `capseed ${i}`);
    const before = mock.requests.length;
    const code = await runExpand(mk({ priv }), { seeds });
    eq(code, 0);
    eq(mock.requests.length - before, 10, 'us market cap');
    ok(lines.some((l) => l.startsWith('deferred: budget')), 'no deferred line');
    await runExpand(mk({ priv }), { seeds: Array.from({ length: 8 }, (_, i) => `trseed ${i}`), market: 'tr' });
    eq(mock.requests.length - before, 15, 'daily cap');
    eq(readBudget(priv, 'example.test', '2026-11-16').total, 15);
  });
  t('expand --plan sends nothing and changes no budget; --from-config orders never before stale before fresh', async () => {
    const priv = newPriv();
    ensureDir(path.join(priv, 'cache'));
    writeJson(cacheFile(priv), { 'en|us|seed one': { fetched: '2026-11-15', suggestions: ['x'] }, 'en|us|seed two': { fetched: '2026-09-01', suggestions: ['y'] } });
    const ctx = mk({ priv });
    const before = mock.requests.length;
    const code = await runExpand(ctx, { fromConfig: true, plan: true });
    eq(code, 0);
    eq(mock.requests.length, before);
    ok(!fs.existsSync(path.join(priv, 'budget.json')), 'plan touched the budget');
    ok(lines[0].includes('seed two') && lines[0].includes('cache-stale') && lines[1].includes('seed one') && lines[1].includes('cache-fresh'), `order: ${lines.slice(0, 2).join(' / ')}`);
    const c2 = mk({ priv });
    await runExpand(c2, { fromConfig: true, plan: true, modifiers: true });
    ok(lines.some((l) => l.includes('seed one for') && l.includes('never')), 'modifier seeds missing from plan');
    // seeds beyond the daily or market cap are labelled in the plan, and the total still counts only what is allowed
    const p3 = newPriv();
    const b3 = baseConfig(p3);
    await runExpand(mk({ priv: p3, config: { ...b3, autocomplete: { ...b3.autocomplete, daily_cap: 1 } } }), { fromConfig: true, plan: true });
    ok(lines.filter((l) => l.includes('skipped (daily cap)')).length === 1 && lines.some((l) => l.includes('allows 1 ')), lines.join(' / '));
    const p4 = newPriv();
    const b4 = baseConfig(p4);
    await runExpand(mk({ priv: p4, config: { ...b4, autocomplete: { ...b4.autocomplete, markets: [{ id: 'us', hl: 'en', gl: 'us', cap: 1 }] } } }), { fromConfig: true, plan: true });
    ok(lines.filter((l) => l.includes('skipped (market cap)')).length === 1, lines.join(' / '));
  });
  t('expand: in_gsc enrichment from the newest analysis, and new-to-us clustering', async () => {
    const priv = newPriv();
    ensureDir(path.join(priv, 'gsc', 'k1'));
    writeJson(path.join(priv, 'gsc', 'k1', 'analysis.json'), { run_key: 'k1', pulled_at: '2026-11-10T00:00:00.000Z', queries: [{ query: 'enrich seed a', best_page: '/blog/p', impressions: 5 }] });
    const ctx = mk({ priv });
    await runExpand(ctx, { seeds: ['enrich seed'] });
    const day = readJsonSafe(path.join(priv, 'expand', '2026-11-16.json'), null);
    const s = day.seeds['us|enrich seed'].suggestions;
    eq([s[0].in_gsc, s[0].best_page, s[1].in_gsc], [true, '/blog/p', false]);
    eq(day.new_to_us.length, 1);
    ok(lines.some((l) => l.includes('gsc analysis: k1')), 'analysis age not printed');
  });

  t('expand: near_gsc is a private hint (closest GSC query by token Jaccard, with its page), null below 0.5', async () => {
    const priv = newPriv();
    ensureDir(path.join(priv, 'gsc', 'k1'));
    writeJson(path.join(priv, 'gsc', 'k1', 'analysis.json'), { run_key: 'k1', pulled_at: '2026-11-10T00:00:00.000Z', queries: [{ query: 'enrich seed a', best_page: '/blog/p', impressions: 5 }, { query: 'enrich seed a long phrase', best_page: '/blog/q', impressions: 90 }, { query: 'unrelated thing', best_page: '/blog/z', impressions: 9 }] });
    const ctx = mk({ priv });
    await runExpand(ctx, { seeds: ['enrich seed'] });
    const day = readJsonSafe(path.join(priv, 'expand', '2026-11-16.json'), null);
    const s = day.seeds['us|enrich seed'].suggestions;
    eq(s[0].in_gsc, true);
    eq(s[0].near_gsc, null); // an exact match needs no hint
    eq(s[1].in_gsc, false);
    ok(s[1].near_gsc && typeof s[1].near_gsc.query === 'string' && s[1].near_gsc.query.startsWith('enrich seed') && /^\/blog\//.test(s[1].near_gsc.page), `near_gsc: ${JSON.stringify(s[1].near_gsc)}`);
    eq(Object.keys(s[1].near_gsc).sort(), ['page', 'query']); // no score, no number
    const md = fs.readFileSync(path.join(priv, 'expand', '2026-11-16.md'), 'utf8');
    ok(md.includes('near GSC:'), 'near_gsc missing from the private md');
    const nn = nearGsc('zebra crossing', [{ q: { query: 'unrelated thing', best_page: '/blog/z' }, tokens: tokenSet('unrelated thing') }]);
    eq(nn, null);
    // the public draft never carries it
    const draft = buildDraft({ clusters: [{ id: 'a', head: 'enrich seed a', members: [{ query: 'enrich seed a', impressions: 20, clicks: 0, position: 3, unsafe: false }], impressions: 20, intent: 'informational', pages: [], main_page: null, suggested_decision: 'new-post', hold_reason: null, held_until: null }] }, { config: baseConfig(priv), today: '2026-11-16', end: '2026-11-13' });
    ok(!JSON.stringify(draft).includes('near_gsc'), 'near_gsc leaked into the draft');
  });

  // ---------------------------------------------------------------- 6. private-dir guard
  t('private dir inside the repo is refused (exit 64); outside is fine', () => {
    let err = null;
    try {
      resolvePrivateDir({ private_dir: path.join(repo, 'kw-private') }, repo);
    } catch (e) {
      err = e;
    }
    ok(err instanceof KwError && err.code === 64, 'not refused');
    let err2 = null;
    try {
      resolvePrivateDir({ private_dir: repo }, repo);
    } catch (e) {
      err2 = e;
    }
    ok(err2 && err2.code === 64, 'root itself not refused');
    eq(resolvePrivateDir({ private_dir: path.join(tmp, 'elsewhere') }, repo), path.join(tmp, 'elsewhere'));
    eq(resolvePrivateDir({ private_dir: '~/x/y' }, repo), path.join(os.homedir(), 'x', 'y'));
  });
  t('private dir: created with mode 700; files 600; atomic write leaves no tmp file', () => {
    const priv = path.join(tmp, 'fresh-priv');
    ensurePrivateDir(priv);
    eq(modeOf(priv), '700');
    writeJson(path.join(priv, 'a', 'b.json'), { a: 1 });
    eq(modeOf(path.join(priv, 'a', 'b.json')), '600');
    eq(fs.readdirSync(path.join(priv, 'a')), ['b.json']);
  });

  // ---------------------------------------------------------------- 7. RE2 guard + config validation
  t('RE2 guard: lookaheads, lookbehinds and backreferences are rejected; plain patterns pass', () => {
    for (const p of ['foo(?=bar)', 'foo(?!bar)', '(?<=a)b', '(?<!a)b', '(a)\\1', '(']) ok(checkRe2(p), `accepted ${p}`);
    for (const p of ['lock ?screen|lockscreen', 'for (anxiety|fear)', '[(?=]x', 'a\\\\1']) eq(checkRe2(p), null, p);
    const c = baseConfig('x');
    c.gsc.regex_families = [{ id: 'bad', pattern: 'a(?=b)' }];
    ok(validateConfig(c).problems.some((p) => p.includes('lookaround')), 'config accepted a lookahead family');
  });
  t('config validation: caps sum, unknown market, bad intent, unknown key is a warning only', () => {
    const c = baseConfig('x');
    eq(validateConfig(c).problems, []);
    const c2 = baseConfig('x');
    c2.autocomplete.markets[0].cap = 12;
    ok(validateConfig(c2).problems.some((p) => p.includes('above daily_cap')), 'cap sum not enforced');
    const c3 = baseConfig('x');
    c3.seeds = [{ seed: 'a', market: 'zz' }];
    c3.intent_rules.push({ intent: 'nope', pattern: 'x' });
    c3.origin = 'https://example.test/path';
    c3.extra_thing = 1;
    const v = validateConfig(c3);
    ok(v.problems.length >= 3 && v.warnings.length === 1, `problems ${v.problems.length} warnings ${v.warnings.length}`);
    const c4 = baseConfig('x');
    c4.autocomplete.daily_cap = 16;
    ok(validateConfig(c4).problems.length > 0, 'daily_cap 16 accepted');
    eq(cmpSemver('1.0.1', '1.0.0'), 1);
    eq(cmpSemver('1.0.0', '1.10.0'), -1);
  });

  // ---------------------------------------------------------------- 8. robots parser
  const ROBOTS = [
    '# BEGIN Cloudflare Managed content',
    'User-agent: *',
    'Content-Signal: search=yes,ai-train=no',
    'Allow: /',
    '',
    'User-agent: GPTBot',
    'Disallow: /',
    '',
    'User-agent: ClaudeBot',
    'User-agent: CCBot',
    'Disallow: /',
    '# END Cloudflare Managed Content',
    '',
    'User-agent: *',
    'Disallow: /api/',
    'Disallow: /*.pdf$',
    'Allow: /api/public',
    '',
    'User-agent: ClaudeBot',
    'Allow: /',
    'Disallow: /private/',
    '',
    'User-agent: Searchy',
    'Disallow: /blog/',
    'Allow: /blog/open',
    'Disallow: /*/draft',
    '',
    'Sitemap: https://example.test/sitemap.xml',
  ].join('\n');
  t('robots: Cloudflare-style block plus own groups, per bot and path', () => {
    const g = parseRobots(ROBOTS);
    const A = (bot, p) => robotsAllows(g, bot, p);
    eq([A('GPTBot', '/'), A('gptbot', '/blog/')], [false, false], 'GPTBot disallowed (case-insensitive token)');
    eq([A('CCBot', '/'), A('CCBot', '/x')], [false, false], 'stacked user-agent lines share one group');
    eq(A('ClaudeBot', '/'), true, 'Allow wins the tie against Disallow /');
    eq([A('ClaudeBot', '/private/x'), A('ClaudeBot', '/blog/')], [false, true], 'longest match; combined groups for the same bot');
    eq([A('Unknown', '/'), A('Unknown', '/api/x'), A('Unknown', '/api/public/x')], [true, false, true], 'falls back to the * groups, combined');
    eq([A('Searchy', '/blog/post'), A('Searchy', '/blog/open-door'), A('Searchy', '/')], [false, true, true], 'most specific group replaces *, longest match wins');
    eq([A('Searchy', '/a/draft'), A('Searchy', '/a/drafty')], [false, false], '* wildcard in the middle');
    eq([A('Unknown', '/a/b.pdf'), A('Unknown', '/a/b.pdf?x=1'), A('Unknown', '/a/b.pdfx')], [false, true, true], '$ end anchor');
    eq(A('Searchy', '/api/x'), true, 'Searchy group has no api rule, * group is not merged in');
  });
  t('robots: empty Disallow allows everything; no groups allows everything', () => {
    eq(robotsAllows(parseRobots('User-agent: *\nDisallow:'), 'Bot', '/x'), true);
    eq(robotsAllows(parseRobots(''), 'Bot', '/x'), true);
  });

  // ---------------------------------------------------------------- geo-probe against the mock
  t('geo-probe: a search bot answered 403 gives exit 4; a blocked training bot alone gives exit 0', async () => {
    mock.robots = ROBOTS.replace('User-agent: Searchy', 'User-agent: Searchy\nAllow: /').replace('Disallow: /blog/\n', '');
    mock.robots += '\nUser-agent: Trainy\nDisallow: /\n';
    fs.writeFileSync(path.join(repo, 'public', 'robots.txt'), mock.robots);
    mock.blockUa = 'Fetchy';
    let ctx = mk({ origin: base });
    let code = await runGeoProbe(ctx);
    eq(code, 4);
    ok(lines.some((l) => l.startsWith('rules-only proof: a spoofed user agent is not the real bot; Cloudflare verifies real bots by IP. The real check is the Cloudflare dashboard.')), 'footer missing');
    ok(lines.some((l) => l.includes('identical')), 'repo compare line missing');
    ok(lines.some((l) => l.startsWith('Trainy | training') && l.includes('BLOCK')), 'training row missing');
    mock.blockUa = '';
    ctx = mk({ origin: base });
    code = await runGeoProbe(ctx);
    eq(code, 0);
    ok(fs.existsSync(path.join(ctx.privateDir, 'geo', '2026-11-16.json')), 'geo json missing');
    mock.robots = 'User-agent: Searchy\nDisallow: /\n';
    code = await runGeoProbe(mk({ origin: base }));
    eq(code, 4, 'rules block of a search bot');
  });

  // ---------------------------------------------------------------- gsc pipeline against the mock
  const FIX = {
    date: Array.from({ length: 40 }, (_, i) => ({ keys: [addDays('2026-10-01', i)], clicks: 1, impressions: 10, ctr: 0.1, position: 9 })),
    query: [
      ['Bible Verse for Anxiety', 200, 10, 8.1],
      ['bible verses for anxiety', 120, 4, 9.5],
      ['bible verse lock screen', 90, 1, 25],
      ['how to put a bible verse on lock screen', 40, 0, 12],
      ['and what about widgets', 30, 0, 30],
      ['bible verse generator', 60, 0, 15],
      ['best bible app', 50, 0, 40],
      ['contact me@x.test bible', 15, 0, 5],
      ['bible verse 123456 app', 12, 0, 6],
      ['alpha beta gamma', 30, 0, 5],
      ['beta gamma delta', 25, 0, 5],
      ['gamma delta epsilon', 20, 0, 5],
      ['delta epsilon zeta', 15, 0, 5],
      ['top 10 bible apps', 14, 0, 7],
    ].map(([q, impressions, clicks, position]) => ({ keys: [q], clicks, impressions, ctr: clicks / impressions, position })),
    'page,query': [
      ['https://example.test/blog/anxiety', 'Bible Verse for Anxiety', 150, 9, 8],
      ['https://example.test/blog/anxiety#part', 'bible verse for anxiety', 50, 1, 8],
      ['https://example.test/other', 'bible verse for anxiety', 60, 0, 12],
      ['https://example.test/blog/lock', 'bible verse lock screen', 90, 1, 25],
      ['https://example.test/', 'bible verse generator', 60, 0, 15],
    ].map(([p, q, impressions, clicks, position]) => ({ keys: [p, q], clicks, impressions, ctr: 0, position })),
    'query,page': [{ keys: ['bible verse widget', 'https://example.test/w'], clicks: 1, impressions: 20, ctr: 0.05, position: 6 }],
  };
  let keyFile = null;
  const gscEnv = () => {
    if (!keyFile) {
      const { privateKey } = crypto.generateKeyPairSync('rsa', { modulusLength: 2048 });
      keyFile = path.join(tmp, 'sa.json');
      fs.writeFileSync(keyFile, JSON.stringify({ client_email: 'sa@example.test', private_key: privateKey.export({ type: 'pkcs8', format: 'pem' }) }), { mode: 0o600 });
    }
    return { GSC_KEY_FILE: keyFile };
  };
  t('gsc: pull, analysis, outputs (mode 600/700), draft is schema-valid and number-free, 7-day reuse', async () => {
    mock.gsc = FIX;
    mock.gscFail = 0;
    const priv = newPriv();
    const ctx = mk({ priv, env: gscEnv() });
    const code = await runGsc(ctx, {});
    eq(code, 0);
    const runDir = path.join(priv, 'gsc', '2026-11-13_90d');
    for (const f of ['analysis.json', 'report.md', 'draft-clusters.json', 'raw-date.json', 'raw-query.json', 'raw-page-query.json', 'raw-family-widget.json']) eq(modeOf(path.join(runDir, f)), '600', f);
    eq(modeOf(priv), '700');
    const a = readJsonSafe(path.join(runDir, 'analysis.json'), null);
    eq(a.days_with_data, 40);
    ok(!a.insufficient, 'flagged insufficient');
    const clusterOf = (q) => a.clusters.find((c) => c.members.some((m) => m.query === q));
    ok(clusterOf('bible verse for anxiety') === clusterOf('bible verses for anxiety'), 'anxiety phrasings split');
    ok(clusterOf('alpha beta gamma') !== clusterOf('gamma delta epsilon'), 'chained clusters');
    ok(a.cannibalisation.some((c) => c.query === 'bible verse for anxiety'), 'cannibalisation missed');
    ok(a.striking_distance.some((c) => c.query === 'bible verse generator'), 'striking distance missed');
    ok(a.gaps.some((c) => c.query === 'bible verse lock screen'), 'gap missed');
    ok(a.ai_fragments.some((c) => c.query === 'and what about widgets'), 'AI fragment missed');
    eq(a.queries.find((q) => q.query === 'bible verse for anxiety').best_page, '/blog/anxiety');
    eq(a.families[0].query_count, 1);
    const draft = readJsonSafe(path.join(runDir, 'draft-clusters.json'), null);
    const v = validateClusters(draft, { config: ctx.config, today });
    eq(v.fails, [], 'draft schema');
    const allMembers = draft.clusters.flatMap((c) => c.members);
    ok(!allMembers.some((m) => m.includes('@') || /\d{5}/.test(m) || /top \d/.test(m)), 'unsafe member kept in draft');
    ok(!/\d{3,}/.test(JSON.stringify(draft).replace(/\d{4}-\d{2}-\d{2}/g, '').replace(/\d+\.\d+\.\d+/g, '')), 'numbers in the draft');
    const rep = fs.readFileSync(path.join(runDir, 'report.md'), 'utf8');
    ok(rep.includes('## Striking distance') && !rep.includes('INSUFFICIENT'), 'report sections');
    const before = mock.requests.length;
    const again = mk({ priv, env: gscEnv() });
    eq(await runGsc(again, {}), 0);
    eq(mock.requests.length, before, 'reuse made API calls');
    ok(again.privateDir && lines.some((l) => l.startsWith('reused')), 'reuse line missing');
    await runGsc(mk({ priv, env: gscEnv() }), { fresh: true });
    ok(mock.requests.length > before, '--fresh did not pull');
  });
  t('gsc: stable ids and kept decisions from an existing clusters file', async () => {
    mock.gsc = FIX;
    const priv = newPriv();
    const cfgFile = path.join(repo, 'clusters.json');
    fs.writeFileSync(cfgFile, JSON.stringify({ ...validDoc(), clusters: [{ ...validDoc().clusters[0], id: 'my-stable-id', decision: 'monitor', content_type: 'none', notes: 'kept', queue_id: 'p7', head_keyword: 'bible verse for anxiety' }] }));
    const ctx = mk({ priv, env: gscEnv() });
    await runGsc(ctx, {});
    fs.unlinkSync(cfgFile);
    const draft = readJsonSafe(path.join(priv, 'gsc', '2026-11-13_90d', 'draft-clusters.json'), null);
    const c = draft.clusters.find((x) => x.id === 'my-stable-id');
    ok(c && c.decision === 'monitor' && c.notes === 'kept' && c.queue_id === 'p7' && c.target_url === '/blog/anxiety', 'existing cluster not reused');
  });
  t('gsc: holds from hold_lists make the cluster a hold with a reason', async () => {
    mock.gsc = FIX;
    const cfg = baseConfig(newPriv());
    cfg.hold_lists = [{ until: '2026-12-02', reason: 'control group', urls: ['/blog/anxiety'] }];
    const ctx = mk({ config: cfg, priv: cfg.private_dir, env: gscEnv() });
    await runGsc(ctx, {});
    const draft = readJsonSafe(path.join(cfg.private_dir, 'gsc', '2026-11-13_90d', 'draft-clusters.json'), null);
    const c = draft.clusters.find((x) => x.members.includes('bible verse for anxiety'));
    eq([c.decision, c.hold_reason, c.held_until], ['hold', 'control group', '2026-12-02']);
    eq(validateClusters(draft, { config: cfg, today }).fails, []);
  });
  t('gsc: fewer than 28 days of data gives exit 3 with the banner', async () => {
    mock.gsc = { ...FIX, date: FIX.date.slice(0, 10) };
    const priv = newPriv();
    const code = await runGsc(mk({ priv, env: gscEnv() }), {});
    eq(code, 3);
    ok(fs.readFileSync(path.join(priv, 'gsc', '2026-11-13_90d', 'report.md'), 'utf8').includes('INSUFFICIENT DATA (10 days): draw no "no page ranks" or "no demand" conclusion'), 'banner missing');
  });
  t('gsc: an API error stops with exit 2, redacted, partial kept; no credentials is a skip with exit 0', async () => {
    mock.gsc = FIX;
    mock.gscFail = 403;
    const priv = newPriv();
    const code = await runGsc(mk({ priv, env: gscEnv() }), {});
    mock.gscFail = 0;
    eq(code, 2);
    const out = lines.join('\n');
    ok(out.includes('stopped:') && !out.includes('SECRETVALUE123') && !out.includes('abcdefabcdef'), `unredacted: ${out}`);
    const none = mk({ env: { GSC_KEY_FILE: path.join(tmp, 'missing.json') } });
    eq(await runGsc(none, {}), 0);
    ok(lines.includes('skipped: no credentials'), 'skip line missing');
  });
  t('gsc: pagination follows startRow until a short page; the row cap holds; --country adds a filter', async () => {
    const calls = [];
    const fetchImpl = async (url, init) => {
      const b = JSON.parse(init.body);
      calls.push(b);
      const n = b.startRow === 0 ? ROW_LIMIT : 7;
      return new Response(JSON.stringify({ rows: Array.from({ length: n }, (_, i) => ({ keys: [`q${b.startRow + i}`], impressions: 1, clicks: 0, position: 1 })) }), { status: 200 });
    };
    const ctx = mk({ extra: { fetchImpl } });
    ctx._token = 'x';
    const rows = await pullAll(ctx, { startDate: 'a', endDate: 'b', searchType: 'web', dimensions: ['query'], dimensionFilterGroups: [{ filters: [{ dimension: 'country', operator: 'equals', expression: 'usa' }] }] });
    eq([rows.length, calls.map((c) => c.startRow)], [ROW_LIMIT + 7, [0, ROW_LIMIT]]);
    eq(calls[0].dimensionFilterGroups[0].filters[0].expression, 'usa');
    const calls2 = [];
    const ctx2 = mk({ extra: { fetchImpl: async (u, init) => { calls2.push(1); return new Response(JSON.stringify({ rows: Array.from({ length: ROW_LIMIT }, () => ({ keys: ['q'] })) }), { status: 200 }); } } });
    ctx2._token = 'x';
    const capped = await pullAll(ctx2, { dimensions: ['query'] });
    eq([capped.length, calls2.length], [ROW_CAP, 4]);
  });
  t('doctor --online: property accessible (mock); credentials print only yes/no', async () => {
    const priv = newPriv();
    const ctx = mk({ priv, env: gscEnv() });
    const code = await runDoctor(ctx, { online: true });
    eq(code, 0);
    const out = lines.join('\n');
    ok(out.includes('gsc property accessible: yes (permissionLevel siteOwner)'), out);
    ok(/gsc credential: present: yes, mode 600: yes/.test(out), out);
    ok(!out.includes('BEGIN') && !out.includes('mock-access') && !out.includes('sa@example.test'), 'secret in doctor output');
    ok(out.includes('ads: not configured') && out.includes('dataforseo: not configured'), 'ads lines');
  });

  // ---------------------------------------------------------------- check end to end on a temp repo
  t('check: clean public files pass, violations FAIL with exit 1, B6 never echoed, WARN alone exits 0', async () => {
    const cfg = baseConfig(newPriv());
    const cfgPath = path.join(repo, 'kw-config.json');
    fs.writeFileSync(cfgPath, JSON.stringify({ ...cfg, private_dir: '~/.claude/selftest-gsc/kw' }, null, 2));
    const docs = path.join(repo, 'docs', 'kw');
    fs.mkdirSync(docs, { recursive: true });
    fs.writeFileSync(path.join(docs, 'ok.md'), '# Notes\n\nbible verse for anxiety is a mood cluster, updated 2026-11-16.\n');
    const ctx = mk({ config: cfg, priv: cfg.private_dir });
    ctx.configPath = cfgPath;
    eq(await runCheck(ctx, {}), 0, lines.join(' / '));
    const secret = 'AIza' + 'Z'.repeat(35);
    fs.writeFileSync(path.join(docs, 'bad.md'), `# Bad\n\nThe page gets 40% of clicks.\n\n| kw | n |\n|---|---|\n| widget | 340 |\n\nkey ${secret}\n\nExample is free.\n`);
    const ctx2 = mk({ config: cfg, priv: cfg.private_dir });
    ctx2.configPath = cfgPath;
    eq(await runCheck(ctx2, {}), 1);
    const out = lines.join('\n');
    for (const r of ['B3', 'B7', 'B6', 'B8']) ok(new RegExp(`FAIL docs/kw/bad.md:\\d+ ${r}`).test(out), `${r} not reported: ${out}`);
    ok(!out.includes(secret) && !out.includes('ZZZZ'), 'secret echoed');
    fs.unlinkSync(path.join(docs, 'bad.md'));
    fs.writeFileSync(path.join(repo, 'clusters.json'), JSON.stringify({ ...validDoc(), clusters: [{ ...validDoc().clusters[0], target_url: '/blog/missing' }] }));
    fs.writeFileSync(path.join(repo, 'public', 'sitemap.xml'), '<urlset><url><loc>https://example.test/</loc></url></urlset>');
    const ctx3 = mk({ config: { ...cfg, sitemap_path: 'public/sitemap.xml' }, priv: cfg.private_dir });
    ctx3.configPath = cfgPath;
    eq(await runCheck(ctx3, {}), 0);
    ok(lines.some((l) => l.startsWith('WARN clusters.json') && l.includes('sitemap')), `no sitemap WARN: ${lines.join(' / ')}`);
    fs.unlinkSync(path.join(repo, 'clusters.json'));
  });
  t('check: the config file scan allows the private_dir path but nothing else private', () => {
    const cfg = baseConfig('~/.claude/some-gsc/kw');
    eq(scanJsonText(JSON.stringify(cfg), 'config', cfg.public_ban_phrases), []);
    const c2 = { ...cfg, note: 'see ~/.claude/secrets/x' };
    ok(scanJsonText(JSON.stringify(c2), 'config', []).some((h) => h.rule === 'B5'), 'B5 not applied to other config strings');
  });
  t('args: unknown flags and missing values are usage errors', () => {
    let e1 = null;
    try {
      parseArgs(['gsc', '--nope']);
    } catch (e) {
      e1 = e;
    }
    ok(e1 && e1.code === 64, 'unknown flag accepted');
    eq(parseArgs(['expand', 'a b', '--market=tr', '--plan']).flags, { market: 'tr', plan: true });
  });


  // ---------------------------------------------------------------- review fixes (regression tests)
  t('analyse: clusters are ranked by TOTAL impressions, so the report and the draft top lists are right', () => {
    const rows = [['zz yy xx', 150], ['aa bb cc', 100], ['aa bb cc dd', 90], ['aa bb cc ee', 80]].map(([q, impressions]) => ({ keys: [q], impressions, clicks: 0, position: 5 }));
    const a = analyse({ dateRows: [], queryRows: rows, pageQueryRows: [], familyRows: {} }, baseConfig('x'));
    eq(a.clusters.map((c) => c.head), ['aa bb cc', 'zz yy xx']);
    eq(a.clusters.map((c) => c.impressions), [270, 150]);
    const d = buildDraft(a, { config: baseConfig('x'), today, end: '2026-11-13' });
    eq(d.clusters[0].head_keyword, 'aa bb cc');
    ok(buildReport(a, { run_key: 'k', property: 'p', start: 'a', end: 'b', days: 1, country: null, pulled_at: 'now' }).indexOf('| aa bb cc |') < buildReport(a, { run_key: 'k', property: 'p', start: 'a', end: 'b', days: 1, country: null, pulled_at: 'now' }).indexOf('| zz yy xx |'), 'report order');
  });
  t('leader clustering: the prefix-filtered search equals the naive first-leader scan', () => {
    let seed = 12345;
    const rnd = () => (seed = (seed * 1664525 + 1013904223) % 4294967296) / 4294967296;
    const vocab = Array.from({ length: 30 }, (_, i) => `w${i}x`);
    const items = Array.from({ length: 700 }, () => {
      const n = 1 + Math.floor(rnd() * 6);
      const ws = new Set();
      while (ws.size < n) ws.add(vocab[Math.floor(rnd() * rnd() * 30)]);
      return { q: [...ws].join(' '), weight: Math.floor(rnd() * 1000) };
    });
    const sorted = items.map((it, i) => ({ it, i })).sort((x, y) => y.it.weight - x.it.weight || x.i - y.i).map((x) => x.it);
    const leaders = [];
    const naive = [];
    for (const it of sorted) {
      const tk = tokenSet(it.q);
      const j = leaders.findIndex((l) => jaccard(tk, l) >= JACCARD);
      if (j < 0) {
        leaders.push(tk);
        naive.push([it.q]);
      } else naive[j].push(it.q);
    }
    eq(leaderCluster(items).map((c) => c.members.map((m) => m.q)), naive);
  });
  t('leader clustering: 4,000 queries that all share the niche words stay fast', () => {
    let seed = 7;
    const rnd = () => (seed = (seed * 1664525 + 1013904223) % 4294967296) / 4294967296;
    const items = Array.from({ length: 4000 }, (_, i) => ({ q: `bible verse ${Array.from({ length: 3 + Math.floor(rnd() * 3) }, () => `t${Math.floor(rnd() * 5000)}x`).join(' ')}`, weight: 4000 - i }));
    const t0 = Date.now();
    const cl = leaderCluster(items);
    ok(cl.length > 100, 'unexpected cluster count');
    ok(Date.now() - t0 < 4000, `took ${Date.now() - t0} ms`);
  });
  t('gsc: a failed --fresh pull is never reused as a complete pull (no mixed vintages)', async () => {
    mock.gsc = FIX;
    mock.gscFail = 0;
    const priv = newPriv();
    eq(await runGsc(mk({ priv, env: gscEnv() }), {}), 0);
    let n = 0;
    const flaky = async (url, init) => (String(url).endsWith('/query') && ++n === 3 ? new Response(JSON.stringify({ error: { message: 'boom' } }), { status: 500 }) : fetch(url, init));
    eq(await runGsc(mk({ priv, env: gscEnv(), extra: { fetchImpl: flaky } }), { fresh: true }), 2);
    const before = mock.requests.length;
    eq(await runGsc(mk({ priv, env: gscEnv() }), {}), 0);
    ok(mock.requests.length > before, 'the half-refreshed pull was reused');
  });
  t('gsc: with no --end a young pull for the same days and country is reused the next day, an 8-day-old one is not', async () => {
    mock.gsc = FIX;
    const priv = newPriv();
    try {
      eq(await runGsc(mk({ priv, env: gscEnv() }), {}), 0);
      clock = new Date('2026-11-17T10:00:00Z');
      const before = mock.requests.length;
      eq(await runGsc(mk({ priv, env: gscEnv() }), {}), 0);
      eq(mock.requests.length, before, 'next-day default run made API calls');
      ok(lines.some((l) => l.startsWith('reused the pull 2026-11-13_90d')), lines.join(' / '));
      clock = new Date('2026-11-24T10:00:00Z');
      await runGsc(mk({ priv, env: gscEnv() }), {});
      ok(mock.requests.length > before, 'an 8-day-old pull was reused');
      ok(fs.existsSync(path.join(priv, 'gsc', '2026-11-21_90d', 'analysis.json')), 'new run key missing');
    } finally {
      clock = new Date('2026-11-16T10:00:00Z');
    }
  });
  t('budget: a corrupt, truncated or negative budget.json refuses (exit 64) instead of resetting the count', async () => {
    for (const bad2 of ['garbage', '{"example.test": {"2026-11-16": {"total": 15, "markets": {"us": 15', JSON.stringify({ 'example.test': { '2026-11-16': { total: -5, markets: {} } } }), '[]']) {
      const priv = newPriv();
      ensureDir(priv);
      fs.writeFileSync(path.join(priv, 'budget.json'), bad2);
      let err = null;
      try {
        reserveBudget(mkBudget(priv));
      } catch (e) {
        err = e;
      }
      ok(err instanceof KwError && err.code === 64, `no refusal for ${bad2.slice(0, 12)}`);
      eq(fs.readFileSync(path.join(priv, 'budget.json'), 'utf8'), bad2, 'file was rewritten');
    }
    const priv = newPriv();
    ensureDir(priv);
    fs.writeFileSync(path.join(priv, 'budget.json'), 'garbage');
    const before = mock.requests.length;
    eq(await runExpand(mk({ priv }), { seeds: ['one seed'] }), 64);
    eq(mock.requests.length, before, 'a request was sent on a corrupt budget');
  });
  t('budget: a corrupt budget stops expand but keeps cache results already gathered; a lock is only released by its owner', async () => {
    const priv = newPriv();
    ensureDir(path.join(priv, 'cache'));
    writeJson(cacheFile(priv), { 'en|us|cached one': { fetched: '2026-11-15', suggestions: ['cached one x'] } });
    fs.writeFileSync(path.join(priv, 'budget.json'), 'garbage');
    const code = await runExpand(mk({ priv }), { seeds: ['cached one', 'new one', 'new two'] });
    eq(code, 64);
    const day = readJsonSafe(path.join(priv, 'expand', '2026-11-16.json'), null);
    ok(day && day.seeds['us|cached one'], 'cache result lost');
    ok(lines.some((l) => l.startsWith('new two | us | deferred')) && lines.some((l) => l.startsWith('deferred: stopped (2')), lines.join(' / '));
    const lock = path.join(newPriv(), 'budget.lock');
    ensureDir(path.dirname(lock));
    const release = acquireLock(lock);
    fs.writeFileSync(lock, 'someone-else');
    release();
    ok(fs.existsSync(lock), 'released a lock it does not own');
  });
  t('expand: after a stop the remaining seeds are listed as deferred and nothing more is sent', async () => {
    const priv = newPriv();
    const before = mock.requests.length;
    const code = await runExpand(mk({ priv }), { seeds: ['ok seed', 'trigger429 seed', 'tail one', 'tail two'] });
    eq(code, 2);
    eq(mock.requests.length - before, 2);
    ok(lines.some((l) => l.startsWith('tail one | us | deferred')) && lines.some((l) => l.startsWith('deferred: stopped (2')), lines.join(' / '));
  });
  t('expand: a cache entry without a suggestions array counts as never fetched (no crash)', async () => {
    const priv = newPriv();
    ensureDir(path.join(priv, 'cache'));
    writeJson(cacheFile(priv), { 'en|us|bad entry': { fetched: '2026-11-15' }, 'en|us|bad two': { fetched: 'x', suggestions: [] } });
    const before = mock.requests.length;
    eq(await runExpand(mk({ priv }), { seeds: ['bad entry', 'bad two'] }), 0);
    eq(mock.requests.length - before, 2);
  });
  t('expand: Turkish İstanbul and istanbul are one query (one cache key, one budget unit)', async () => {
    eq(normalize('İstanbul namaz vakti'), normalize('istanbul namaz vakti'));
    eq(normalize('İSTANBUL'), 'istanbul');
    const priv = newPriv();
    await runExpand(mk({ priv }), { seeds: ['İstanbul namaz vakti'], market: 'tr' });
    await runExpand(mk({ priv }), { seeds: ['istanbul namaz vakti'], market: 'tr' });
    eq(readBudget(priv, 'example.test', '2026-11-16').total, 1);
    eq(Object.keys(readJsonSafe(cacheFile(priv), {})), ['tr|tr|istanbul namaz vakti']);
    eq(jaccard(tokenSet('İstanbul namaz'), tokenSet('istanbul namaz')), 1);
  });
  t('expand: seeds that look like personal data are refused before any budget is spent', async () => {
    for (const bad2 of ['mail me@x.test verses', 'see https://x.test verse', 'call 123456789 verse']) {
      let err = null;
      try {
        collectSeeds(baseConfig('x'), { seeds: ['fine seed', bad2] });
      } catch (e) {
        err = e;
      }
      ok(err instanceof KwError && err.code === 64 && !err.message.includes('x.test'), `not refused: ${bad2}`);
    }
    eq(collectSeeds(baseConfig('x'), { seeds: ['verses for 2026'] }).length, 1);
  });
  t('expand: in_gsc uses the newest ALL-country pull, never a --country pull', async () => {
    const priv = newPriv();
    ensureDir(path.join(priv, 'gsc', 'all'));
    ensureDir(path.join(priv, 'gsc', 'tur'));
    writeJson(path.join(priv, 'gsc', 'all', 'analysis.json'), { run_key: 'all', pulled_at: '2026-11-10T00:00:00.000Z', country: null, queries: [] });
    writeJson(path.join(priv, 'gsc', 'tur', 'analysis.json'), { run_key: 'tur', pulled_at: '2026-11-15T00:00:00.000Z', country: 'tur', queries: [{ query: 'country seed a', best_page: '/t', impressions: 5 }] });
    await runExpand(mk({ priv }), { seeds: ['country seed'] });
    ok(lines.some((l) => l.includes('gsc analysis: all')), lines.join(' / '));
    const day = readJsonSafe(path.join(priv, 'expand', '2026-11-16.json'), null);
    eq(day.seeds['us|country seed'].suggestions[0].in_gsc, false);
  });
  t('hold detection: a "/" used as a separator holds nothing; the homepage needs "/" first or (/)', () => {
    eq(extractPaths('title / meta only'), []);
    eq(extractPaths('p60 / p61 (/blog/a + /blog/b)').sort(), ['/blog/a', '/blog/b']);
    eq(extractPaths('/blog/some_slug (notes)'), ['/blog/some_slug']);
    eq(extractPaths('/').sort(), ['/']);
    eq(extractPaths('(/) and /blog/x').sort(), ['/', '/blog/x']);
    eq(extractPaths('`/` homepage').sort(), ['/']);
  });
  t('robots: CR-only line endings, percent-encoding and non-ASCII paths follow RFC 9309', () => {
    eq(robotsAllows(parseRobots('User-agent: *\rDisallow: /'), 'Bot', '/x'), false, 'CR only');
    eq(robotsAllows(parseRobots('User-agent: *\nDisallow: /a%2fb'), 'Bot', '/a%2Fb'), false, 'hex case');
    eq(robotsAllows(parseRobots('User-agent: *\nDisallow: /é'), 'Bot', '/%C3%A9'), false, 'non-ASCII pattern');
    eq(robotsAllows(parseRobots('User-agent: *\nDisallow: /%7Euser'), 'Bot', '/~user'), false, 'unreserved decoded');
    eq(robotsAllows(parseRobots('User-agent: *\nDisallow: /a'), 'Bot', '/b'), true);
  });
  t('geo-probe: a 200 HTML page (SPA fallback) is not a robots file: exit 2, nothing else probed', async () => {
    mock.robots = '<!doctype html><html><body>app</body></html>';
    const before = mock.requests.length;
    const code = await runGeoProbe(mk({ origin: base }));
    eq(code, 2);
    eq(mock.requests.length - before, 1, 'probes were sent');
    ok(lines.some((l) => l.includes('not a robots file')), lines.join(' / '));
  });
  t('doctor --online: a failed probe exits 2, a missing credential is only a skip (0)', async () => {
    const fetchImpl = async (url) => (String(url).endsWith('/token') ? new Response(JSON.stringify({ access_token: 'x' }), { status: 200 }) : new Response('{}', { status: 403 }));
    eq(await runDoctor(mk({ env: gscEnv(), extra: { fetchImpl } }), { online: true }), 2);
    eq(await runDoctor(mk({ env: { GSC_KEY_FILE: path.join(tmp, 'missing.json') } }), { online: true }), 0);
  });
  t('private dir: case variants, the home folder and a parent of the repo are refused', () => {
    const refused = (dir) => {
      try {
        resolvePrivateDir({ private_dir: dir }, repo);
        return false;
      } catch (e) {
        return e instanceof KwError && e.code === 64;
      }
    };
    ok(refused(path.join(path.dirname(repo), 'REPO', 'w')), 'upper-case repo path accepted');
    ok(refused('~') && refused('~/'), 'home folder accepted');
    ok(refused(path.dirname(repo)), 'parent of the repo accepted');
    ok(refused(path.dirname(os.homedir())), 'parent of home accepted');
    ok(!refused('~/.claude/x-gsc/kw'), 'normal private dir refused');
  });
  t('redact: encoded and single-quoted secrets, colon forms, JWTs, Basic credentials, upper-case home path', () => {
    const home = os.homedir();
    const jwt = 'eyJhbGciOiJSUzI1NiJ9.eyJpc3MiOiJ4In0.c2lnbmF0dXJl';
    const out = redact(`key%3DSECRETKEYABC access_token: abc123tok {'access_token': 'abc456tok'} id_token=abc789 refresh_token%3Dabc000 authorization: Basic dXNlcjpwYXNz assertion=${jwt} ${encodeURIComponent(home)}/x ${home.toUpperCase()}/y`);
    for (const leak of ['SECRETKEYABC', 'abc123tok', 'abc456tok', 'abc789', 'abc000', 'dXNlcjpwYXNz', 'eyJhbGci']) ok(!out.includes(leak), `leaked ${leak}`);
    if (home.length > 1) ok(!out.toLowerCase().includes(home.toLowerCase()) && !out.includes(encodeURIComponent(home)), 'home path kept');
  });
  t('check: unknown JSON keys that look like secrets are not echoed and are B6-flagged', () => {
    const secretKey = 'AIza' + 'Q'.repeat(35);
    const doc = { ...validDoc(), clusters: [{ ...validDoc().clusters[0], ['ya29.SECRETTOKENVALUE123']: 1, [secretKey]: 2 }] };
    const r = schema(doc);
    const text = JSON.stringify(r.fails);
    ok(r.fails.length >= 2 && !text.includes('SECRETTOKEN') && !text.includes('QQQQ'), text);
    const h = scanJsonText(JSON.stringify(doc), 'clusters', []);
    ok(h.some((x) => x.rule === 'B6') && !JSON.stringify(h).includes('QQQQ') && !JSON.stringify(h).includes('SECRETTOKEN'), 'key not B6-scanned or echoed');
  });
  t('check: a long absolute private_dir in the config is not a key-shaped token; real keys still are', () => {
    const cfg = baseConfig('/Users/someone/Library/Application Support/Some-Long-Folder/AbC123dEf456GhI789JkL/kw');
    eq(scanJsonText(JSON.stringify(cfg), 'config', []), []);
    const c2 = { ...cfg, private_dir: 'AIza' + 'Z'.repeat(35) };
    ok(scanJsonText(JSON.stringify(c2), 'config', []).some((h) => h.rule === 'B6'), 'key in private_dir not caught');
  });
  t('intent rules: the u flag and \\p{L} lookarounds work for non-ASCII words; \\b next to them is warned about', () => {
    const cfg = baseConfig('x');
    cfg.intent_rules = [{ intent: 'mood', pattern: '(?<![\\p{L}\\p{N}])çocuk(?![\\p{L}\\p{N}])' }];
    eq(classifyIntent('çocuk duası', cfg), 'mood');
    eq(classifyIntent('çocukluk duası', cfg), 'informational');
    cfg.intent_rules = [{ intent: 'mood', pattern: '\\bçocuk\\b' }, { intent: 'question', pattern: '\\?$' }];
    const w = validateConfig(cfg).warnings.join(' | ');
    ok(w.includes('ASCII-only') && w.includes('never matches'), w);
  });
  t('stubs validate the config first; unexpected I/O errors exit 64, not 1', async () => {
    const good = path.join(tmp, 'cfg-good.json');
    fs.writeFileSync(good, JSON.stringify(baseConfig(newPriv())));
    const bad2 = path.join(tmp, 'cfg-bad.json');
    const c = baseConfig(newPriv());
    c.autocomplete.markets[0].cap = 15;
    fs.writeFileSync(bad2, JSON.stringify(c));
    const afile = path.join(tmp, 'afile');
    fs.writeFileSync(afile, 'x');
    const io = path.join(tmp, 'cfg-io.json');
    fs.writeFileSync(io, JSON.stringify(baseConfig(path.join(afile, 'sub'))));
    const quiet = console.log;
    console.log = () => {};
    try {
      eq(await main(['volumes', '--config', bad2], {}, repo), 64, 'volumes skipped validation');
      eq(await main(['bing', '--config', bad2], {}, repo), 64, 'bing skipped validation');
      eq(await main(['serp', '--config', good], {}, repo), 0);
      eq(await main(['bing', '--config', good], { BING_WMT_KEY_FILE: path.join(tmp, 'none.key') }, repo), 0);
      eq(await main(['doctor', '--config', io], {}, repo), 64, 'I/O error did not map to 64');
    } finally {
      console.log = quiet;
    }
  });
  t('check --staged: files with non-ASCII names are scanned, and an unreadable staged blob is a FAIL', async () => {
    let gitOk = true;
    try {
      execFileSync('git', ['--version'], { stdio: 'ignore' });
    } catch {
      gitOk = false;
    }
    if (!gitOk) return;
    const saved = {};
    for (const k of Object.keys(process.env)) if (k.startsWith('GIT_')) {
      saved[k] = process.env[k];
      delete process.env[k];
    }
    try {
      const g = path.join(tmp, 'gitrepo');
      fs.mkdirSync(path.join(g, 'docs', 'kw'), { recursive: true });
      const git = (...a) => execFileSync('git', a, { cwd: g, stdio: ['ignore', 'pipe', 'ignore'] });
      git('init', '-q');
      fs.writeFileSync(path.join(g, 'docs', 'kw', 'çok dua.md'), 'see /Users/someone/secret.json\n');
      fs.writeFileSync(path.join(g, 'docs', 'kw', 'plain name.md'), 'see /Users/someone/secret.json\n');
      git('add', '.');
      const cfg = baseConfig(newPriv());
      const ctx = makeCtx({ root: g, config: cfg, configPath: null, privateDir: cfg.private_dir, now: () => clock, log: (x) => lines.push(x) });
      lines.length = 0;
      eq(await runCheck(ctx, { staged: true }), 1);
      ok(lines.filter((l) => l.startsWith('FAIL') && l.includes('B5')).length === 2, lines.join(' / '));
      ok(lines.some((l) => l.includes('check: 2 file(s), 2 fail')), lines.join(' / '));
    } finally {
      Object.assign(process.env, saved);
    }
  });

  t('check --staged: a non-engine file may NAME a private file (WARN, exit 0) but not leak a path (FAIL); engine files stay strict', async () => {
    let gitOk = true;
    try {
      execFileSync('git', ['--version'], { stdio: 'ignore' });
    } catch {
      gitOk = false;
    }
    if (!gitOk) return;
    const saved = {};
    for (const k of Object.keys(process.env)) if (k.startsWith('GIT_')) {
      saved[k] = process.env[k];
      delete process.env[k];
    }
    try {
      const cfg = baseConfig(newPriv());
      const stage = async (files) => {
        const g = path.join(tmp, `gitrepo-b5-${Math.random().toString(36).slice(2, 8)}`);
        fs.mkdirSync(g, { recursive: true });
        const git = (...a) => execFileSync('git', a, { cwd: g, stdio: ['ignore', 'pipe', 'ignore'] });
        git('init', '-q');
        for (const [rel, body] of Object.entries(files)) {
          fs.mkdirSync(path.dirname(path.join(g, rel)), { recursive: true });
          fs.writeFileSync(path.join(g, rel), body);
        }
        git('add', '.');
        const ctx = makeCtx({ root: g, config: cfg, configPath: null, privateDir: cfg.private_dir, now: () => clock, log: (x) => lines.push(x) });
        lines.length = 0;
        const code = await runCheck(ctx, { staged: true });
        return { code, out: lines.join('\n') };
      };
      const named = await stage({ 'src/data/other.json': JSON.stringify({ note: 'see ~/.claude/example-gsc/annotations.csv' }) });
      eq(named.code, 0, named.out);
      ok(/WARN src\/data\/other\.json:\d+ B5/.test(named.out) && !/FAIL/.test(named.out), named.out);
      const leak = await stage({ 'docs/journal/01-x.md': 'notes in /Users/someone/notes.txt\n' });
      eq(leak.code, 1, leak.out);
      ok(/FAIL docs\/journal\/01-x\.md:\d+ B5/.test(leak.out), leak.out);
      const home = await stage({ 'docs/journal/02-x.md': 'in /home/someone/notes.txt\n' });
      eq(home.code, 1, home.out);
      const key = await stage({ 'docs/journal/03-x.md': 'file service-account-key.json and .claude/secrets/x\n' });
      eq(key.code, 1, key.out);
      const win = await stage({ 'docs/journal/05-x.md': 'in C:\\Users\\someone\\x\n' });
      eq(win.code, 1, win.out);
      const enc = await stage({ 'docs/journal/06-x.md': 'see %2FUsers%2Fsomeone\n' });
      eq(enc.code, 1, enc.out);
      const txt = await stage({ 'docs/other.txt': 'in /Users/someone/x\n', 'docs/data.csv': 'a,b\n/home/someone/x,1\n' });
      eq(txt.code, 1, txt.out);
      ok(/FAIL docs\/other\.txt:\d+ B5/.test(txt.out) && /FAIL docs\/data\.csv:\d+ B5/.test(txt.out), txt.out);
      const bin = await stage({ 'docs/pic.png': 'x\0/Users/someone/x' });
      eq(bin.code, 0, bin.out);
      const six = await stage({ 'src/data/other.json': JSON.stringify({ k: 'deadbeef'.repeat(4) }) });
      eq(six.code, 1, six.out);
      const eng = await stage({ 'docs/kw/a.md': 'see ~/.claude/example-gsc/kw\n' });
      eq(eng.code, 1, eng.out);
      ok(/FAIL docs\/kw\/a\.md:\d+ B5/.test(eng.out), eng.out);
      const mix = await stage({ 'src/data/other.json': JSON.stringify({ note: 'see ~/.claude/example-gsc/annotations.csv' }), 'docs/journal/04-x.md': 'a budget.json and gsc-data-1.json are private\n' });
      eq(mix.code, 0, mix.out);
      ok(/check: 2 file\(s\), 0 fail, [1-9]\d* warn/.test(mix.out), mix.out);
    } finally {
      Object.assign(process.env, saved);
    }
  });

  // ---------------------------------------------------------------- run
  let failed = 0;
  try {
    for (const tc of tests) {
      try {
        await tc.fn();
        log(`ok   ${tc.name}`);
      } catch (e) {
        failed++;
        log(`FAIL ${tc.name}: ${redact(e.message ?? e).slice(0, 300)}`);
      }
    }
  } finally {
    server.closeAllConnections?.();
    await new Promise((r) => server.close(r));
    fs.rmSync(tmp, { recursive: true, force: true });
  }
  log(`self-test: ${tests.length - failed}/${tests.length} passed`);
  return failed ? EXIT.CHECK : EXIT.OK;
}

// ---------------------------------------------------------------- entry

function isMain() {
  try {
    return Boolean(process.argv[1]) && fs.realpathSync(fileURLToPath(import.meta.url)) === fs.realpathSync(path.resolve(process.argv[1]));
  } catch {
    return false;
  }
}
if (isMain()) {
  main().then((code) => {
    process.exitCode = code;
  });
}
