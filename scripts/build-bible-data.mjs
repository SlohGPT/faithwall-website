#!/usr/bin/env node
/**
 * Builds the static Bible data served from /bible/ for the random-verse page.
 *
 * Source: scrollmapper/bible_databases, PINNED to commit ba07bc99. Do NOT point
 * this at master: master currently ships corrupted files with every verse
 * duplicated ~7x. Only public-domain translations are shipped.
 *
 * Output (committed, served as static files):
 *   public/bible/index.json                     book list, per-chapter verse counts, totals
 *   public/bible/<translation>/<NN>-<slug>.json [[v1, v2, ...] per chapter]
 *
 * Validation is strict and fails loudly (non-zero exit, nothing half-written).
 *
 * Usage: node scripts/build-bible-data.mjs
 */
import { mkdir, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const COMMIT = 'ba07bc99';
const RAW = `https://raw.githubusercontent.com/scrollmapper/bible_databases/${COMMIT}/formats/json`;
const OUT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'public', 'bible');

// KJV is the structural reference and is required. WEB (World English Bible)
// is attempted but optional: the pinned commit does not contain a WEB file, so
// it is skipped with a loud warning and the site ships KJV only.
const TRANSLATIONS = [
  { id: 'kjv', label: 'KJV', file: 'KJV', required: true },
  { id: 'web', label: 'WEB', file: 'WEB', required: false },
];

const EXPECTED = { books: 66, chapters: 1189, verses: 31102 };

const BOOKS = [
  'Genesis', 'Exodus', 'Leviticus', 'Numbers', 'Deuteronomy', 'Joshua', 'Judges', 'Ruth',
  '1 Samuel', '2 Samuel', '1 Kings', '2 Kings', '1 Chronicles', '2 Chronicles', 'Ezra',
  'Nehemiah', 'Esther', 'Job', 'Psalms', 'Proverbs', 'Ecclesiastes', 'Song of Solomon',
  'Isaiah', 'Jeremiah', 'Lamentations', 'Ezekiel', 'Daniel', 'Hosea', 'Joel', 'Amos',
  'Obadiah', 'Jonah', 'Micah', 'Nahum', 'Habakkuk', 'Zephaniah', 'Haggai', 'Zechariah',
  'Malachi', 'Matthew', 'Mark', 'Luke', 'John', 'Acts', 'Romans', '1 Corinthians',
  '2 Corinthians', 'Galatians', 'Ephesians', 'Philippians', 'Colossians', '1 Thessalonians',
  '2 Thessalonians', '1 Timothy', '2 Timothy', 'Titus', 'Philemon', 'Hebrews', 'James',
  '1 Peter', '2 Peter', '1 John', '2 John', '3 John', 'Jude', 'Revelation',
];

const slugify = (name) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

// Source names differ from the canonical list ("I Samuel", "Revelation of John", ...).
function canonicalName(raw) {
  const n = raw
    .replace(/^III\s+/, '3 ')
    .replace(/^II\s+/, '2 ')
    .replace(/^I\s+/, '1 ')
    .replace(/^Revelation of John$/, 'Revelation')
    .trim();
  return n;
}

const fail = (msg) => {
  console.error(`\nFAILED: ${msg}`);
  process.exit(1);
};

async function download(file) {
  const res = await fetch(`${RAW}/${file}.json`);
  if (!res.ok) return { ok: false, status: res.status };
  return { ok: true, json: await res.json() };
}

const stripped = {};
const MARKUP = /[<>{}[\]¶]|&[a-z#0-9]+;|\\[a-z]/i;

/** Returns { books: [{ name, chapters: string[][] }], dupesDropped } */
function normalize(label, json) {
  if (!json || !Array.isArray(json.books)) fail(`${label}: unexpected JSON shape (no books array)`);
  let dupesDropped = 0;
  const books = [];
  stripped[label] = 0;
  for (const rawBook of json.books) {
    const name = canonicalName(rawBook.name);
    const byChapter = new Map(); // chapter -> Map(verse -> text)
    for (const ch of rawBook.chapters) {
      if (!byChapter.has(ch.chapter)) byChapter.set(ch.chapter, new Map());
      const verses = byChapter.get(ch.chapter);
      for (const v of ch.verses) {
        let text = String(v.text ?? '').replace(/\s+/g, ' ').trim();
        // KJV marks translator-supplied words as [word]; keep the word, drop the brackets.
        if (/\[[^\]]*\]/.test(text)) {
          text = text.replace(/\[([^\]]*)\]/g, '$1');
          stripped[label]++;
        }
        if (verses.has(v.verse)) {
          if (verses.get(v.verse) !== text) {
            fail(`${label}: ${name} ${ch.chapter}:${v.verse} appears twice with DIFFERENT text`);
          }
          dupesDropped++;
          continue;
        }
        verses.set(v.verse, text);
      }
    }
    const chapterNumbers = [...byChapter.keys()].sort((a, b) => a - b);
    const chapters = chapterNumbers.map((cn, i) => {
      if (cn !== i + 1) fail(`${label}: ${name} chapter numbering has a gap at ${i + 1} (found ${cn})`);
      const verses = byChapter.get(cn);
      const nums = [...verses.keys()].sort((a, b) => a - b);
      return nums.map((vn, j) => {
        if (vn !== j + 1) fail(`${label}: ${name} ${cn} verse numbering has a gap at ${j + 1} (found ${vn})`);
        return verses.get(vn);
      });
    });
    books.push({ name, chapters });
  }
  return { books, dupesDropped };
}

function validateText(label, books) {
  for (const b of books) {
    b.chapters.forEach((ch, ci) =>
      ch.forEach((text, vi) => {
        const ref = `${label} ${b.name} ${ci + 1}:${vi + 1}`;
        if (!text) fail(`${ref} is empty`);
        if (MARKUP.test(text)) fail(`${ref} contains leftover markup: ${text.slice(0, 120)}`);
      })
    );
  }
}

function totals(books) {
  const chapters = books.reduce((s, b) => s + b.chapters.length, 0);
  const verses = books.reduce((s, b) => s + b.chapters.reduce((t, c) => t + c.length, 0), 0);
  return { books: books.length, chapters, verses };
}

async function main() {
  console.log(`Source: scrollmapper/bible_databases @ ${COMMIT}`);
  const loaded = [];
  for (const t of TRANSLATIONS) {
    const res = await download(t.file);
    if (!res.ok) {
      if (t.required) fail(`${t.label}: download failed (HTTP ${res.status})`);
      console.warn(
        `\nWARNING: ${t.label} is NOT available at commit ${COMMIT} (HTTP ${res.status}). ` +
          `Skipping it. The site will ship without ${t.label}.\n`
      );
      continue;
    }
    const { books, dupesDropped } = normalize(t.label, res.json);
    validateText(t.label, books);
    const tot = totals(books);
    console.log(
      `${t.label}: ${tot.books} books, ${tot.chapters} chapters, ${tot.verses} verses ` +
        `(${dupesDropped} exact duplicates dropped, ` +
        `${stripped[t.label]} verse(s) had [bracket] markers stripped)`
    );
    loaded.push({ ...t, books, tot });
  }

  // KJV structure must match the canonical Protestant canon exactly.
  const kjv = loaded.find((t) => t.id === 'kjv');
  if (kjv.tot.books !== EXPECTED.books || kjv.tot.chapters !== EXPECTED.chapters || kjv.tot.verses !== EXPECTED.verses) {
    fail(`KJV totals ${JSON.stringify(kjv.tot)} != expected ${JSON.stringify(EXPECTED)}`);
  }
  kjv.books.forEach((b, i) => {
    if (b.name !== BOOKS[i]) fail(`KJV book #${i + 1} is "${b.name}", expected "${BOOKS[i]}"`);
  });

  // Other translations: compare structure to KJV, and report (never hide) differences.
  const differences = {};
  for (const t of loaded.filter((x) => x.id !== 'kjv')) {
    const diffs = [];
    if (t.books.length !== kjv.books.length) fail(`${t.label}: ${t.books.length} books vs KJV ${kjv.books.length}`);
    t.books.forEach((b, i) => {
      const k = kjv.books[i];
      if (b.name !== k.name) fail(`${t.label}: book #${i + 1} is "${b.name}", KJV has "${k.name}"`);
      if (b.chapters.length !== k.chapters.length) {
        fail(`${t.label}: ${b.name} has ${b.chapters.length} chapters, KJV has ${k.chapters.length}`);
      }
      b.chapters.forEach((ch, ci) => {
        if (ch.length !== k.chapters[ci].length) {
          diffs.push(`${b.name} ${ci + 1}: ${t.label} ${ch.length} verses vs KJV ${k.chapters[ci].length}`);
        }
      });
    });
    differences[t.id] = diffs;
    console.log(`${t.label} vs KJV: ${diffs.length} chapter(s) with different verse counts`);
    diffs.forEach((d) => console.log(`  - ${d}`));
  }

  // Write output only after everything validated.
  await rm(OUT, { recursive: true, force: true });
  const sizes = [];
  for (const t of loaded) {
    await mkdir(path.join(OUT, t.id), { recursive: true });
    for (let i = 0; i < t.books.length; i++) {
      const b = t.books[i];
      const file = `${String(i + 1).padStart(2, '0')}-${slugify(b.name)}.json`;
      const body = JSON.stringify(b.chapters);
      await writeFile(path.join(OUT, t.id, file), body);
      sizes.push([`${t.id}/${file}`, Buffer.byteLength(body)]);
    }
  }

  const index = {
    source: `scrollmapper/bible_databases@${COMMIT}`,
    translations: loaded.map((t) => ({ id: t.id, label: t.label })),
    totals: kjv.tot,
    books: kjv.books.map((b, i) => ({
      name: b.name,
      slug: slugify(b.name),
      file: `${String(i + 1).padStart(2, '0')}-${slugify(b.name)}`,
      testament: i < 39 ? 'OT' : 'NT',
      verses: b.chapters.map((c) => c.length),
    })),
  };
  const indexBody = JSON.stringify(index);
  await writeFile(path.join(OUT, 'index.json'), indexBody);

  sizes.sort((a, b) => b[1] - a[1]);
  const totalBytes = sizes.reduce((s, [, n]) => s + n, 0);
  console.log(`\nindex.json: ${Buffer.byteLength(indexBody)} bytes`);
  console.log(`Total book data: ${(totalBytes / 1024 / 1024).toFixed(2)} MB across ${sizes.length} files`);
  console.log('Largest files:');
  sizes.slice(0, 5).forEach(([f, n]) => console.log(`  ${f}  ${(n / 1024).toFixed(0)} KB`));
  console.log(`Translations shipped: ${loaded.map((t) => t.label).join(', ')}`);
  console.log('OK');
}

main().catch((e) => fail(e.stack || String(e)));
