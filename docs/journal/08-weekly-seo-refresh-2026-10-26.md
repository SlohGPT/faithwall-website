# 08 — Weekly SEO refresh, 2026-10-26

Session type: scheduled weekly task `faithwall-seo-refresh`. It runs locally and is the only part of the pipeline with Search Console access. Public repo, so this entry is qualitative only. The raw numbers stay in Karol's local report and in `~/.claude/faithwall-gsc/`.

## What was asked

The standing weekly brief is to "measure what the autopilot did, then re-aim it". This run also had three open items from the week: decide whether to publish or drop the held post `bible-study-group-iphone-tools`, re-read the precautionary new-URL hold, and give the starved queue work that is due now. A fourth came from the 10-25 merge gate: check the App Store rename to "Lock Screen Bible Verse".

## What was found

- **Once-per-week guard passed.** No refresh commit in the last five days. The pull was already up to date.
- **Site level.** Clicks and impressions both rose over the previous 28-day window, and average position improved. The click rate dipped, because the latest week's visibility jump came mostly from the low-click generator page. Visibility is also widening outside the US.
- **Hub.** `/blog/best-free-bible-app-iphone` is still the leading click source. Its head terms moved from mid page 1 into upper page 1 over the window, and their click rates rose.
- **Generator page.** `/random-bible-verse` dipped for two days in mid-October, then its daily visibility rose steeply in the final week. The plain head term "random bible verse" is visible for the first time, near the page-1/page-2 edge. It is still a feeder (§10 item 5), so nothing was queued for it.
- **Money page.** `/best-bible-verse-lock-screen-apps` is still in the bottom half of page 1, where it has been since 2026-09-30. p53 went live on 10-20, so the window holds only four days after it. URL Inspection shows Google re-crawled the page on 10-23. Too early to read.
- **Moat pillar.** `/daily-scripture-lock-screen` has eased gradually since mid-September and lost its first-place slot on a few how-to phrasings. It is indexed with its own canonical, and there is no single-day step. It is on watch, with no item.
- **The four newest posts are still unknown to Google** (URL Inspection, 12-18 days after publishing). Each one returns 200, is self-canonical and indexable, and is in the sitemap and the blog index. Google re-read the sitemap on 10-23. So there's no on-site technical fault, but Google is not discovering new URLs.
- **Cloudflare regression.** The live robots.txt again starts with Cloudflare's managed block: content signals plus `Disallow: /` for GPTBot, ClaudeBot, Google-Extended, CCBot, Applebot-Extended, GoogleOther and others. A user-agent test also gets a 403 for GPTBot and ClaudeBot at the edge. OAI-SearchBot, ChatGPT-User, PerplexityBot, Claude-SearchBot, Googlebot and Bingbot get 200. Karol fixed this in September (TODO-KAROL, 2026-09-24/10-05), so the setting has come back. When it came back can't be dated: there is no archive copy of the file. The edge certificates show Cloudflare has fronted the site since July.
- **Brand KPI.** After the mid-October lull, the one-word "faithwall" query rose again in the latest week, mostly on one day (10-21). Branded share of identifiable clicks rose against the previous window. The two-word query is unchanged in kind. Placements are still zero, so nothing is credited to §8. New confound: the App Store listing was renamed on 10-18.
- **App Store listing.** The iTunes lookup shows trackName "Lock Screen Bible Verse" (v2.3.2, 10-18). The description still uses "FaithWall". The iTunes search for "faithwall" still returns Karol's app first and no namesake listing.
- **Off-site.** No draft carries a SENT note, so zero pitches were sent and there are zero placements to verify.
- **Image surface (b4).** Image visibility grew by more than half since last week's read, led by the maker page, which took a couple of image clicks. Positions are still deep. The queries are broad ("bible wallpaper") plus the black, 4K and laptop/desktop modifiers the gallery already covers. There is no gap to queue renders for.
- **CTR and striking distance (3c).** Every high-impression, low-click-rate page at position 10 or better is either a feeder (the generator), under measurement (the money page), or has no legible demand (prayer roundup, audio post, vs-pages). Every striking-distance query belongs to a page that already owns it. No new data-backed new-post or ctr-fix items. PrayerBuilt still doesn't turn up in the App Store search, the same precedent as p49.
- **Google-change watch.** The upstream ledger has five entries new to us, all confirmed on developers.google.com/search/updates. The only relevant one is the 10-01 update to Google's generative-AI content guide, which now points to the rater guidelines' sections on scaled content and on low-effort pages, asks for manual fact-checking of AI output, and suggests telling readers how content was made. That is proposed to Karol, not applied. The status dashboard lists nothing after the September 2026 spam update. Nothing urgent.

## What was decided, and why

- **The hold is extended to the 2026-11-02 refresh.** The reason has shifted from the spam-update precaution to discovery. Google is not picking up new URLs, so a fifth new URL adds no reach. p53 also can't be read yet. SEO-STRATEGY §6 rule 1 and §9 rule 6 were updated.
- **The held post stays unpublished until 11-02.** It is merged with `isPublished: false`. It isn't dropped, because it is verified work. Publishing it now would add no reach.
- **Due-now work, existing URLs only:** p54 (hub, due now), p55 (the two root vs-pages, from 10-29) and p56 (prayer and wallpaper roundups, from 10-31). These are the §5 monthly materially-true refreshes. Each is facts-only: re-checked App Store facts, no new passages, no heading or meta changes, and no date bump unless a fact changed. That ends the starved queue without new URLs and without fake freshness.
- **The App Store rename is a decision for Karol, not a queue item.** If it is an ASO test, editing the site would be churn. TODO-KAROL has the small change ready to queue if he says it's permanent.
- **The Cloudflare block goes to TODO-KAROL as a regression, not an URGENT Google item.** ChatGPT search and the Google and Bing crawlers are unaffected. The loss is AI training crawls, plus a self-contradicting robots.txt, against §7's "keep robots.txt welcoming".
- **No new keywords, so no SERP-overlap checks were needed.**

## What was built

- `src/data/seo-priorities.json`: effect notes on p33, p39-p42, p44, p46-p48, p50 and p52-p53. p33 and p39 archived to `done[]` at the 28-day mark. p54-p56 added, p28/p30/p31 re-ranked after them, `updated` bumped, top-level note appended.
- `SEO-STRATEGY.md`: header date; a §2 pillar 1 watch line; the generator-surface update; the Play 2 p53 status; the Play 4 KPI update with the rename confound; the §6 hold line; the §9 rule 6 extension; the §10 image line.
- `TODO-KAROL.md`: a new 2026-10-26 section replaces both 2026-10-19 sections, carrying their still-open items forward.
- This entry and `docs/README.md`.
- Commit: "seo: weekly priorities refresh".

## How it was verified

- The JSON was checked to round-trip byte-identically through Python `json.dumps(indent=2)` before the edit, and parses after it. The file is not imported by app code, so no build is needed.
- Page timing comes from page-filtered Search Console date queries, and index state from the URL Inspection API. The live-page checks used curl for status, robots meta, canonical, sitemap membership and blog-index links. The Cloudflare check used the live robots.txt plus user-agent requests. The app facts come from the iTunes Lookup/Search API. The Google items were checked against developers.google.com/search/updates, the gen-AI guide itself and status.search.google.com.

## Still open

- Karol: undo or confirm the Cloudflare AI block; run a live test and request indexing for the four posts; send the Tier-1 pitches (week eight); do the App Store Connect campaign review; decide on the App Store name; consider the gen-AI disclosure proposal.
- 11-02 refresh: read p53, re-read the hold and the held post, re-check whether the four posts are indexed, and look at the pillar's slow slide.
- Still proposed from 10-19: add a page-by-date pull for the money pages to `scripts/gsc-dump.mjs`.
- Still open from p51: `.claude/skills/faithwall-blog/SKILL.md` still pitches "themed packs" and "we pick the verse". That matters little during the hold, but it should be fixed before fallback posts resume.
