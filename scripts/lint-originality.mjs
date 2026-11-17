#!/usr/bin/env node
// lint-originality.mjs 1.0.0: guard against templated posts. WARN-only, dependency-free, exit 0 unless --strict.
//
//   node scripts/lint-originality.mjs                 # newest post by datePublished
//   node scripts/lint-originality.mjs --slug <slug>   # one post (compared with the 10 posts published before it)
//   node scripts/lint-originality.mjs --all           # every post, short table
//   options: --dir src/data/posts   --strict (exit 1 when any WARN)
//
// Three warnings, none of them a quota (a post may legitimately differ on none of them; read the WARN and decide):
//   first sentence: the first body sentence (first paragraph block) starts with the same 6 normalised words as one of
//                   the 10 previous posts.
//   H2 set:         the post's set of H2s overlaps another post's set by Jaccard >= 0.6 after normalisation (sets of 3+).
//   statistic:      a sentence with a number and "per <Source>" repeats a statistic (same source and a shared number
//                   that is not a year) already used in one of the 10 previous posts.

import fs from 'node:fs';
import path from 'node:path';

const args = process.argv.slice(2);
const opt = (k, d) => { const i = args.indexOf(k); return i >= 0 && args[i + 1] && !args[i + 1].startsWith('--') ? args[i + 1] : d; };
const has = k => args.includes(k);
const DIR = opt('--dir', 'src/data/posts');
const SLUG = opt('--slug');
const ALL = has('--all');
const STRICT = has('--strict');
const WINDOW = 10, WORDS = 6, JACCARD = 0.6;

const norm = s => String(s).normalize('NFKD').replace(/\p{M}/gu, '').toLowerCase().replace(/&/g, ' and ').replace(/[^\p{L}\p{N}]+/gu, ' ').trim();
const plain = s => String(s || '').replace(/!?\[([^\]]*)\]\([^)]*\)/g, '$1').replace(/[*_`]+/g, '').replace(/\s+/g, ' ').trim();
const sentences = t => plain(t).split(/(?<=[.!?])\s+(?=[A-Z0-9"'(])/).map(x => x.trim()).filter(Boolean);

if (!fs.existsSync(DIR)) { console.error(`lint-originality: no such directory ${DIR} (run from the repo root)`); process.exit(64); }
const posts = fs.readdirSync(DIR).filter(f => f.endsWith('.json')).map(f => {
  const j = JSON.parse(fs.readFileSync(path.join(DIR, f), 'utf8'));
  const sections = j.sections || [];
  const firstPara = sections.find(s => s.type === 'paragraph' && s.text);
  const h2 = new Set(sections.filter(s => s.type === 'heading' && s.level === 2).map(s => norm(s.text)).filter(Boolean));
  // every text field that can carry a cited statistic
  const texts = [];
  for (const s of sections) {
    if (s.type === 'stat') texts.push([s.label, s.value, s.context].filter(Boolean).join(' '));
    for (const k of ['text', 'content', 'description']) if (typeof s[k] === 'string') texts.push(s[k]);
    if (Array.isArray(s.items)) for (const it of s.items) texts.push(typeof it === 'string' ? it : [it.title, it.text, it.description].filter(Boolean).join(' '));
  }
  const stats = [];
  for (const t of texts) for (const sent of sentences(t)) {
    const m = sent.match(/\b[Pp]er ((?:the )?[A-Z][^\s,;:()]*(?:\s+[A-Z][^\s,;:()]*)*)/);
    if (!m || !/\d/.test(sent)) continue;
    const source = norm(m[1].replace(/['’]s\b/g, ''));
    const nums = [...new Set((sent.replace(m[0], ' ').match(/\d[\d,.]*\d|\d/g) || []).map(n => n.replace(/[,.]+$/, '')).filter(n => !/^20\d{2}$/.test(n)))];
    if (source && nums.length) stats.push({ source, nums, sent });
  }
  return {
    slug: f.replace(/\.json$/, ''), title: j.meta?.title || '',
    date: Date.parse(j.meta?.datePublished || j.meta?.date || '') || 0,
    first: firstPara ? sentences(firstPara.text)[0] || '' : '', h2, stats,
  };
}).sort((a, b) => b.date - a.date || a.slug.localeCompare(b.slug));

const key6 = s => norm(s).split(' ').slice(0, WORDS).join(' ');
const jaccard = (a, b) => { let i = 0; for (const x of a) if (b.has(x)) i++; const u = a.size + b.size - i; return u ? i / u : 0; };

function check(p) {
  const idx = posts.indexOf(p);
  const prev = posts.slice(idx + 1, idx + 1 + WINDOW); // posts published before it
  const out = { first: [], h2: [], stat: [] };
  const k = p.first && key6(p.first);
  if (k && k.split(' ').length >= WORDS) for (const q of prev) if (q.first && key6(q.first) === k) out.first.push(`${q.slug}: "${k}..."`);
  if (p.h2.size >= 3) for (const q of posts) {
    if (q === p || q.h2.size < 3) continue;
    const j = jaccard(p.h2, q.h2);
    if (j >= JACCARD) out.h2.push(`${q.slug}: ${j.toFixed(2)}`);
  }
  for (const s of p.stats) for (const q of prev) for (const t of q.stats) {
    if (t.source === s.source && t.nums.some(n => s.nums.includes(n))) out.stat.push(`${q.slug}: "${s.sent.slice(0, 90)}${s.sent.length > 90 ? '...' : ''}"`);
  }
  out.stat = [...new Set(out.stat)];
  return out;
}

check.statHit = (p, st) => posts.slice(posts.indexOf(p) + 1, posts.indexOf(p) + 1 + WINDOW).some(q => q.stats.some(t => t.source === st.source && t.nums.some(n => st.nums.includes(n))));

let warned = 0;
if (ALL) {
  const w = Math.max(...posts.map(p => p.slug.length), 4);
  console.log(`lint-originality 1.0.0 --all: ${posts.length} posts (window ${WINDOW}, first ${WORDS} words, Jaccard >= ${JACCARD})`);
  console.log(`${'post'.padEnd(w)}  first-sentence  h2-overlap  repeated-stat`);
  const tot = { first: 0, h2: 0, stat: 0 }, posts_with = { first: 0, h2: 0, stat: 0 };
  const detail = [], reuse = new Map();
  for (const p of posts) {
    const r = check(p);
    const n = { first: r.first.length, h2: r.h2.length, stat: r.stat.length };
    for (const x of Object.keys(n)) { tot[x] += n[x]; if (n[x]) posts_with[x]++; }
    if (n.first || n.h2 || n.stat) {
      warned++;
      console.log(`${p.slug.padEnd(w)}  ${String(n.first).padStart(14)}  ${String(n.h2).padStart(10)}  ${String(n.stat).padStart(13)}`);
      for (const x of ['first', 'h2']) for (const line of r[x]) detail.push(`  ${p.slug} [${x}] ${line}`);
      for (const st of p.stats) if (check.statHit(p, st)) reuse.set(`${st.source} ${st.nums.join('/')}`, (reuse.get(`${st.source} ${st.nums.join('/')}`) || new Set()).add(p.slug));
    }
  }
  console.log(`posts with a WARN: ${warned} of ${posts.length} | first-sentence ${posts_with.first}, h2-overlap ${posts_with.h2}, repeated-stat ${posts_with.stat} (pairs: ${tot.first}, ${tot.h2}, ${tot.stat})`);
  if (detail.length) { console.log('first-sentence and H2 detail:'); for (const d of detail.slice(0, 30)) console.log(d); if (detail.length > 30) console.log(`  ... ${detail.length - 30} more`); }
  const top = [...reuse].map(([k, v]) => [k, v.size]).sort((a, b) => b[1] - a[1]).slice(0, 5);
  if (top.length) { console.log('most reused statistics (source + numbers: posts that repeat it from a recent post):'); for (const [k, n] of top) console.log(`  ${k}: ${n}`); }
} else {
  const p = SLUG ? posts.find(x => x.slug === SLUG) : posts[0];
  if (!p) { console.error(`lint-originality: no post with slug "${SLUG}" in ${DIR}`); process.exit(64); }
  const r = check(p);
  console.log(`lint-originality 1.0.0 ${p.slug} (compared with the ${Math.min(WINDOW, posts.length - 1 - posts.indexOf(p))} posts published before it)`);
  const sec = (name, arr, why) => { console.log(`${arr.length ? 'WARN' : 'ok  '} ${name}: ${arr.length}`); for (const x of arr.slice(0, 10)) console.log('     ' + x); if (arr.length) console.log('     ' + why); };
  sec('first sentence starts like a recent post', r.first, `first sentence: "${p.first.slice(0, 100)}"; vary the opening unless there is a reason`);
  sec('H2 set overlaps another post (Jaccard >= 0.6)', r.h2, 'a templated outline; keep shared H2s only where the topic truly repeats');
  sec('cited statistic repeated from a recent post', r.stat, 'pick a different fact or source, or say why the same one is needed here');
  if (r.first.length || r.h2.length || r.stat.length) warned = 1;
}
process.exit(STRICT && warned ? 1 : 0);
