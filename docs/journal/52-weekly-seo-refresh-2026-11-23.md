# 52 — Weekly SEO refresh, 2026-11-23

Session type: scheduled weekly task `faithwall-seo-refresh`. It runs locally and is the only part of the pipeline with Search Console access. The repo is public, so this entry is qualitative only. The raw numbers stay in Karol's local report and in `~/.claude/faithwall-gsc/`.

## What was asked

The standing weekly brief is to "measure what the autopilot did, then re-aim it". Entry 37 left specific jobs for this run: write the INDEX STATE line that decides p63, read the core update on base URLs once the rollout is nearly done, re-date p66 if the rollout is still running, and read `/faithwall-vs-hallow` and the prayer roundup again.

## What was found

- **Once-per-week guard passed.** No refresh commit in the last five days; the pull was up to date.
- **The core update is still rolling.** Google's status feed lists the November 2026 core update from 11-10 with no end date on 11-23, past its stated two weeks.
- **A FaithWall-only sitewide dip on 11-19 and 11-20.** Visibility fell sharply on every page, country and device; outside the US it went to almost nothing. The generator's head phrasing dropped out of results on 11-19. It recovered most of the way on 11-21. The sister sites (QuranWall, NoteWall) and an unrelated property on the same account were normal on those days, so it is not a Search Console reporting gap. Live checks were clean: pages return 200, robots tags are index/follow, canonicals are right, `www` redirects with a 308, URL Inspection shows 58 of 59 sitemap URLs indexed with recent crawls, and geo-probe exits 0. Reading: core-update volatility, not a site fault. Not urgent; the next refresh re-reads it.
- **Site level (28-day windows, the dip included).** Clicks rose clearly again against the previous window; impressions more than doubled, so the click rate fell again. The week to 11-20 was the best week on record by clicks despite the dip. Nearly all of the growth is still the generator, now several times its previous window and the site's largest click source; the maker grew from almost nothing to a steady trickle. The hub and the homepage lost clicks.
- **Hub.** Flat on its named queries in mid page 1. One "best free bible app" phrasing slipped lower on page 1. The growth in its visibility is jump-link and anonymized rows, which is also why its 28-day click rate fell.
- **Money page.** Unchanged in the bottom half of page 1, clicks near zero, level through the dip. Stop rule stands; p53 archived.
- **Prayer roundup.** A step down from 11-17. That day carries both the core update and the price-wording change (81f4eac, the page re-crawled the same day), so the cause can't be separated yet. Re-read on 11-30; no change before.
- **`/faithwall-vs-hallow`** shows in search again since 11-17.
- **Index state of the four October posts.** Three of four are indexed: short-bible and scripture-based-prayer were re-crawled and indexed on 11-20 after the manual Request Indexing (entry 49), and grief has been indexed since 11-12. `/blog/bible-app-vs-olive-tree` is still unknown to Google. None of the four has visibility yet.
- **v3 posts.** p67 (Christmas) was indexed the day after publishing and sits in lower page 1 for its phrasings. p68 (men) was indexed on its publish day and sits in mid page 1. The indexing brake (§6) is clear. Day 14 of the new-page gate is 12-01 and 12-02.
- **Brand KPI.** The one-word "faithwall" query still ranks first; its clicks eased back from the October high toward the old baseline. Branded share of identifiable clicks fell further, because generator clicks keep growing. The two-word "faith wall" still shows without converting.
- **Image surface (b4).** Image visibility up about a sixth against last week's read, the maker up about a quarter and still leading, image clicks edged up. The new image queries are out-of-scope 4K PC/desktop phrasings plus aesthetic black lock-screen phrasings the gallery covers. No renders queued.
- **CTR and striking distance (3c).** No new item. The high-impression, low-click pages at position 10 or better are the generator (p70 after 12-02), held pages, or the money page (stop rule).
- **Conversion layer (3e).** `check-facts` exit 0 with no change. URL Inspection as above. The cohort read-out is not due yet: it runs on the first refresh on or after 12-02, which is 12-07. No campaign answer from Karol; the TODO stays.
- **Keyword engine (2b).** doctor passed; `gsc --fresh` pulled the 90 days to 11-20 (without `--fresh` it reused last week's pull); geo-probe exit 0; two seasonal seeds added; autocomplete expand within the allowance. Details in `docs/keyword-research/2026-11-23-faithwall.md`.
- **Google-change watch (4).** Upstream ledger unchanged since last week (newest entry 11-09). Nothing new deprecates or penalizes anything the site does. The 10-26 proposal on Google's generative-AI content guide is still open for Karol.
- **Today's autopilot branch.** `claude/local-autopilot-20261123` (p80, the Psalm 91 post) was on origin, not yet merged, when this refresh pushed. Both touch `src/data/seo-priorities.json`; the merge gate resolves that by its step e2.

## What was decided, and why

- **p66 re-dated from 11-25 to 12-08 and moved after p83.** The core update is still rolling and the site just had a sitewide swing. The hub is the largest held page, so an edit now couldn't be read afterwards and would muddy the 12-07 cohort read-out. Karol keeps a line in TODO-KAROL.md to change the swap before 12-08.
- **p63's premise changed.** With three of four indexed, the 12-02 audit judges demand and overlap, not indexing. Olive-tree was requested on 11-20 and is still unknown; asking again doesn't speed Google up, so the audit decides it.
- **No new queue item.** The v3 supply (p80, p81, p69, p82, p83) covers about two posts a week to 12-07, the update is still rolling, and the v3 posts are too young to read.
- **p53 archived** at the 28-day mark. Pending items re-ranked in array order (p80 44 through p79 58).
- **SEO-STRATEGY.md unchanged.** No strategy fact changed in our own data; the dip and the rolling update are monitoring, recorded here and in the queue note.

## What was built

- `src/data/seo-priorities.json`: effect notes on p53-p58, p60, p61, p67, p68, and on p48 and p40 in `done[]`; the INDEX STATE line and a premise note on p63; p66 re-dated and moved; autocomplete notes on p69 and p81; p53 archived; ranks renumbered; `updated` bumped and the top-level note appended.
- `src/data/keyword-clusters.json`: six new clusters (p67, p69, p80-p83), the men cluster to monitor, two draft merges, the hub's hold reason re-dated, `updated` and `engine_version` bumped.
- `src/data/kw-config.json`: two seasonal seeds, to come out after 2027-01-15.
- `TODO-KAROL.md`: a new 2026-11-23 section. Removed as resolved or carried forward: the Request indexing asks for p67 and p68, the Cloudflare items (done 11-17), the whole 11-16 weekly section, the 11-03 Advent outreach section, the 10-05 IndexNow re-ping, the 10-02 and 09-24 outreach and directory items and the outreach-candidates line (outreach retired in v3), and the 11-16 evening item 8. The Vercel question is marked answered (11-19). The maker page's widget line is marked as covered by p78.
- `docs/keyword-research/2026-11-23-faithwall.md`, this entry and `docs/README.md`.
- Commit: "seo: weekly priorities refresh".

## How it was verified

- Both JSON files were written through Python `json.dumps(indent=2)` with each file's own `ensure_ascii` setting, and `npm run kw -- check --staged` passed before the commit.
- Page timing comes from page-by-date Search Console queries with fresh data included, read on base URLs; the dip was checked by country, device and page, and against the sister properties. Index state and crawl dates come from the URL Inspection API.
- The core update status was read on Google's status feed directly.
- geo-probe re-run before the commit: exit 0, llms.txt 200.

## Still open

- Karol: the Apple agreement, then the first campaign read around 12-15; a line on the NLT row before 12-08 if he wants something other than the swap; the 10-26 generative-AI content-guide proposal; the older open items in TODO-KAROL.md.
- 11-30 refresh: re-read the prayer roundup step and the 11-19/20 dip on base URLs; check whether the core update has ended (p66 stays 12-08 either way).
- 12-07 refresh: the first cohort read-out (§11), then p72.
- Still proposed from 10-19: a page-by-date pull with an exact-URL filter in `scripts/gsc-dump.mjs`. This run built it ad hoc again.
