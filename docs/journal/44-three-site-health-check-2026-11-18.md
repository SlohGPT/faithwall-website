# 44 — Three-site health check after the SEO and GEO pass, 2026-11-18

Karol asked: "yesterday we implemented many SEO and GEO fixes for all three websites ... Could you please check if everything runs smoothly today?" This was a read-only check of FaithWall, QuranWall and NoteWall at about 14:40. Nothing in any site's code changed.

## Pipelines today

All nine daily runs ran and succeeded. I checked their commits on each origin/main, not only their reports.

| Site | Autopilot | Merge gate | Live |
|---|---|---|---|
| FaithWall | p68, men's verse wallpaper post (da93f8e, 08:17) | merged and pushed (entry 43) | yes, 200 |
| QuranWall | p9, same-job comparison on `best-islamic-lock-screen-app-iphone` (d60f727) | merged ed5cf7a, log 8a227a4 | yes, I found an added sentence on the live page |
| NoteWall | p46, eleven links toward six unindexed pages (b9612c8) | merged 160aada, journal 41 | yes, both new homepage links are in the live HTML |

- The one-time check `app-sites-pipeline-check-1118` (13:00) reported "All three sites ran cleanly today."
- No repo has an unmerged branch. All three main checkouts are clean on main, apart from FaithWall's benign `.agents/`.

## Live checks

- **Internal links** (`link-graph.mjs --live`, 1.1.0, the same sha256 prefix 9772194f53db in all three repos): every site exits 0. There are no orphans, unreachable pages, broken links or noindex/canonical problems in the sitemap, and every page has at least 3 contextual links in. Compared with the 11-17 baseline:
  - FaithWall: 59 pages, max depth 2 (one post had 2 contextual links in; now none is under 3).
  - QuranWall: 16 pages, max depth 1 (two posts were under 3; now none).
  - NoteWall: 112 pages, max depth 2. The baseline had 11 orphans, 18 unreachable pages, depth 5 and 44 pages under 3. All four are now 0.
  - llms.txt lists every sitemap page on all three sites, where it missed most of them on 11-17. BreadcrumbList, Article and dateModified are on every page that needs them, and the JSON-LD parses.
  - Known WARNs only: long titles (FaithWall 25, NoteWall 89), title vs H1 wording, the shared og:image on non-post pages, and one NoteWall post with 2024 in its title (`how-students-use-iphone-for-studying`, updated 2026).
- **Every sitemap URL** answers 200 with no redirect on all three sites. One NoteWall URL timed out once and answered 200 three times on retry.
- **Robots and AI crawlers.** `/`, robots.txt, sitemap.xml and llms.txt answer 200 on all three sites. The only Disallow is `/api/`, and no Cloudflare managed lines were added. GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, Claude-User, Claude-SearchBot, PerplexityBot, Perplexity-User, Googlebot, Bingbot, Applebot and CCBot user agents all get 200 on the homepage and a post, on all three sites. FaithWall's `npm run kw -- geo-probe` exits 0, and the live robots.txt is identical to the repo file. The 11-17 Cloudflare unblock holds.
- **Redirects and 404.** http → https is a 308 on all three. The 404 page answers 404 with noindex.
- **Google (FaithWall, URL Inspection, 5 URLs).** Google crawled `/` at 03:23 today and `/daily-scripture-lock-screen` at 12:08 today. Both are indexed, with fetch SUCCESSFUL, robots ALLOWED and the canonical the page declares. `/blog` is indexed (last crawl 11-06). The two new posts, Christmas (p67, live 11-17) and men's (p68, live today), are still unknown to Google, which is normal a day after publishing. Both Request indexing lines are in TODO-KAROL.
- **Lints.** `lint-facts --all`: 0 FAIL, the same 21 known WARNs. `lint-facts --prompts` on all six FaithWall task prompts and the blog skill: 0 FAIL, 0 WARN. I didn't rebuild: the gate built this same code this morning (59 of 59 prerenders, `--dist` 0 FAIL), and the only later commit is docs.

## Not checked

- **Speed.** The PageSpeed API returned "quota exceeded" for the day, so no lab numbers today. Yesterday's live measurements in entries 39 and 42 stand.
- QuranWall and NoteWall URL Inspection: QuranWall's refresh has no Search Console access yet, and NoteWall's weekly inspection runs Monday.

## Found

- **`www.faithwall.app` has no DNS record.** QuranWall and NoteWall both send `www.` to the bare domain with a 308; FaithWall's `www.` doesn't resolve. No doc mentions it and the sitemap, canonicals and links all use the bare domain, so search isn't hurt. Someone who types `www.` gets a browser error. The fix is a DNS record plus a Vercel domain redirect, and it is Karol's call.
- **QuranWall gate flag (its log 01).** The p9 post now shows QuranWall's public US rating count (two) beside competitors' counts. It is honest listing data, but QuranWall's own rule keeps the rating hidden at two ratings. Karol decides whether to keep the count.

## Open

- **Karol:** Request indexing for `/blog/christmas-bible-verse-lock-screen-iphone` and `/blog/christian-lock-screen-for-men` (TODO-KAROL lines 7 and 13). NoteWall: Request Indexing for p46's six targets (its TODO-KAROL).
- **Karol:** whether to add `www.faithwall.app` → `faithwall.app`.
- **Karol:** the QuranWall rating-count question above.

## Update, 15:05: the www redirect is live

Karol left the www question to the agent ("This is completely up to you"). The agent decided to set it up. People and AI answers sometimes add `www.` to a domain, ChatGPT is the top App Store referrer, and Google never indexes a redirecting host, so the risk is close to none. Cloudflare's own DNS page listed "Visitors cannot reach www.faithwall.app" as a recommendation.

**Done in Cloudflare (faithwall.app zone, Karol's sign-in, nothing in Vercel or the repo):**
1. Redirect Rule "www.faithwall.app to faithwall.app (308)": wildcard `http*://www.faithwall.app/*` → `https://faithwall.app/${2}`, 308, query string kept. It was deployed first, so `www.` never reached Vercel without the redirect. Cloudflare warned that no proxied record matched yet, and the agent chose "deploy anyway" and did not let it create a record.
2. DNS record: CNAME `www` → `faithwall.app`, proxied. The zone now has 10 records, and the other 9 are unchanged.

FaithWall now matches QuranWall and NoteWall, which redirect `www.` with a 308 through Vercel, because their DNS is on Porkbun.

**Verified:**
- 1.1.1.1 and 8.8.8.8 resolve `www.faithwall.app` to the Cloudflare IPs.
- Each of these answers 308 to the bare-domain URL, with path and query unchanged: `https://www.faithwall.app/`, `/blog/christian-lock-screen-for-men?ct=test&utm_source=x`, `http://www.faithwall.app/blog` and `/robots.txt`.
- Following the redirect ends at 200 after exactly one hop, including for the GPTBot, ClaudeBot and Googlebot user agents.
- The edge certificate covers `*.faithwall.app`.
- `https://faithwall.app/` still answers 200 with no redirect.
- This Mac's own resolver still held the old negative answer at 15:05. That clears by itself.

**Open:** nothing for www. The remaining items for Karol are the two Request indexing lines and the QuranWall rating-count question above.
