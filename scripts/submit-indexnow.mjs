/**
 * Submits one or more URLs to IndexNow (Bing, Yandex, Seznam, Naver).
 * Google does not participate — it picks up changes via sitemap + Search Console.
 *
 * Usage:
 *   node scripts/submit-indexnow.mjs https://faithwall.app/blog/post-1 https://faithwall.app/blog/post-2
 *   node scripts/submit-indexnow.mjs --latest        # submits the newest post from src/data/blogPosts.json
 *
 * The key is stored in scripts/indexnow.config.json and the matching key
 * verification file lives at public/{key}.txt — both must be deployed for
 * IndexNow to accept submissions.
 */
import { readFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

const config = JSON.parse(readFileSync(join(root, 'scripts/indexnow.config.json'), 'utf-8'));
const { host, key } = config;
const keyLocation = `https://${host}/${key}.txt`;

const args = process.argv.slice(2);

let urlList;
if (args.length === 0) {
  console.error('Usage: node scripts/submit-indexnow.mjs <url> [url ...]  OR  --latest');
  process.exit(1);
} else if (args[0] === '--latest') {
  const posts = JSON.parse(readFileSync(join(root, 'src/data/blogPosts.json'), 'utf-8'));
  if (posts.length === 0) {
    console.error('No posts found in src/data/blogPosts.json');
    process.exit(1);
  }
  urlList = [`https://${host}/blog/${posts[0].slug}`];
} else {
  urlList = args;
}

const body = { host, key, keyLocation, urlList };

console.log(`IndexNow → submitting ${urlList.length} URL(s) to ${host}:`);
for (const u of urlList) console.log(`  ${u}`);

const res = await fetch('https://api.indexnow.org/IndexNow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify(body),
});

const text = await res.text();
console.log(`\nIndexNow response: ${res.status} ${res.statusText}`);
if (text) console.log(text);

// 200/202 = accepted; 422 = invalid URL / not the same host; 403 = key file invalid
if (res.status >= 200 && res.status < 300) {
  console.log('✓ Submission accepted. Bing/Yandex/Seznam/Naver will crawl shortly.');
  process.exit(0);
} else {
  console.error(`✗ Submission failed (status ${res.status}).`);
  if (res.status === 403) {
    console.error('  Key file probably not yet deployed. Wait for Vercel deploy and retry.');
  }
  process.exit(1);
}
