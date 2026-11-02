# 17 — Weekly SEO refresh, 2026-11-02

Session type: scheduled weekly task `faithwall-seo-refresh`. It runs locally and is the only part of the pipeline with Search Console access. Public repo, so this entry is qualitative only. The raw numbers stay in Karol's local report and in `~/.claude/faithwall-gsc/`.

## What was asked

The standing weekly brief is to "measure what the autopilot did, then re-aim it". Entry 08 and entry 16 left specific jobs for this run: read p53, re-read the hold and the held post, re-check whether the four newest posts are indexed, look at the pillar's slide, handle the two Lectio 365 pages, and refill the queue, which was down to dated outreach.

## What was found

- **Once-per-week guard passed.** No refresh commit in the last five days. The pull was already up to date.
- **Site level.** Clicks and impressions rose again over the previous 28-day window, and average position improved a little. The click rate fell, because most of the new visibility is the low-click generator page.
- **Money page, new second step.** `/best-bible-verse-lock-screen-apps` stayed in the bottom half of page 1 through 10-28, so p53 shows no recovery after 11 days. On 10-29 its daily impressions fell by about nine-tenths, its named phrasings moved to the page-1/page-2 edge or past it, and US impressions nearly vanished. Fresh Search Console data through 11-01 shows no bounce. The 28-day figures in the weekly dump barely show this; a page-filtered daily query did.
- **Nothing on our side explains the step.** The page was last edited on 10-20. It returns 200 with the right title, canonical and robots tags. URL Inspection says it is indexed with its own canonical, and Google re-crawled it on 10-28. No deploy touched it around then.
- **Hub.** `/blog/best-free-bible-app-iphone` is still the leading click source, and its head terms rose through 10-27. They slipped from upper to mid page 1 from 10-28, the morning p54 went live, and Google re-crawled the page within about an hour. The prayer roundup slipped at the same time with no edit, and the hub rebounded partly in the last two days, so the cause can't be read yet.
- **Google.** The status dashboard lists nothing after the September 2026 spam update. Search Engine Roundtable reports unconfirmed volatility on 10-16, 10-20/21 and 10-24, and a larger spike from about 10-26 that it called more heated by 10-29. Google has confirmed nothing. A search found no announcement of a November core update.
- **Unaffected pages.** The generator page kept rising, the pillar held, and the wallpaper roundup, the wallpaper post and the maker page rose or held. So this is not a site-wide demotion.
- **Pillar watch closed.** `/daily-scripture-lock-screen` has held a flat weekly average in mid page 1 since early October. The slide has stopped.
- **The four newest posts are still not indexed, 19-25 days after publishing.** `/blog/short-bible-verses-for-lock-screen` and `/blog/scripture-based-prayer-prompts` moved from unknown to "Discovered - currently not indexed". `/blog/bible-app-vs-olive-tree` and `/blog/lock-screen-verse-for-grief` are still unknown. All four return 200, and the blog index and pillar pages link them in the prerendered HTML. **New finding: no other post links to any of them in-body.** Google last read the sitemap on 10-31.
- **Brand KPI.** The one-word "faithwall" query is higher against the previous 28-day window, but that rise is the late-September step plus the 10-21 spike, and the latest week is back near baseline. Branded share of identifiable clicks slipped, because non-brand identifiable clicks grew faster. The two-word query is unchanged in kind.
- **Off-site.** No draft carries a SENT note. Zero pitches sent, zero placements to verify.
- **Image surface (b4).** Image visibility grew by about half since last week's read. The maker page more than doubled and still leads. Positions are still deep, clicks are a trickle, and queries stay broad plus the modifiers the gallery covers. No gap to queue renders for.
- **CTR and striking distance (3c).** Every striking-distance query belongs to a page that already owns it. High-impression, low-click-rate pages at position 10 or better are the feeder, the money page, or pages with little or no legible demand (the audio and highlighting posts have none; `/blog/hallow-vs-abide` and the vs-Hallow page have only a scatter). §3 Play 3's anonymized test rules out `ctr-fix` on them. No new keyword was queued, so no SERP-overlap check was needed.
- **Cloudflare.** Unchanged since entry 08: managed robots.txt in front of ours, with a 403 for GPTBot and ClaudeBot and 200 for search and answer crawlers.
- **App Store.** Listing unchanged: "Lock Screen Bible Verse", v2.3.2, description still says FaithWall. The iTunes search for "faithwall" still shows no namesake listing.
- **Google-change watch.** The upstream ledger and its changelog have not moved since 10-22. Google's own updates page has one newer entry, on preventing user-generated spam (10-26), which doesn't apply to a site with no user content. No new relevant changes and nothing urgent under step 4.

## What was decided, and why

- **The hold is extended to the 2026-11-09 refresh, and the held post stays unpublished.** New posts still aren't reaching the index, so a fifth adds no reach, and publishing during an unexplained slide in the "best app" pages would muddy the read.
- **No edits to the money page or the hub for this slide.** Four days of data during unconfirmed volatility can't separate causes, and an edit now would make the 11-09 read impossible. The 11-09 stop rule stands.
- **Flagged at the top of Karol's report as a watch, not a penalty.** §9 rule 6 says to flag step drops at once, but nothing here shows a penalty.
- **p28 ranks first.** Its send-by date is 11-16, and §5's shape puts off-site work above refreshes.
- **p57 carries its facts in the item.** The Lectio 365 listing was verified here, so the cloud run can execute it without the Apple API. That avoids a repeat of the entry 10 and entry 14 loop.
- **p58 adds the missing links rather than more sitemap pings.** Sibling links are the one on-site signal not yet tried. Link edits aren't a material change, so no dates are bumped. The hub and money page are excluded while under measurement.
- **p59 fixes the blog skill now,** before fallback posts can resume and carry the themed-packs claim back onto the site.
- **§4 gains rule 8:** new posts get in-body links from indexed siblings when they ship. The cause of the index delay isn't proven, but the rule costs almost nothing.
- **The hub's NLT row, the first-person testing claims, the minimum iOS and the store name stay with Karol.** Each one depends on something only he knows or decides.

## What was built

- `src/data/seo-priorities.json`: effect notes on p40-p48, p50 and p52-p56. p40-p47 archived to `done[]` at the 28-day mark. p57-p59 added, p30/p31 re-ranked after them, a listing-name note added to p28, `updated` bumped, top-level note appended.
- `SEO-STRATEGY.md`: header date; pillar watch closed; generator update; Play 1, Play 2 and Play 4 updates; §4 rule 8; §6 hold line; §9 rule 6 extension; §10 image line.
- `TODO-KAROL.md`: a new 2026-11-02 section replaces the 10-26 section and carries its open items forward. Resolved cloud-egress and p54 notes removed, with the environment fact folded into the standing item.
- This entry and `docs/README.md`.
- Commit: "seo: weekly priorities refresh".

## How it was verified

- The JSON round-tripped byte-identically through Python `json.dumps(indent=2)` before the edit, and parses after it. The file is not imported by app code, so no build is needed.
- Page timing comes from page-filtered daily Search Console queries with fresh data included, split by country, and from a before/after comparison of every page. Index state comes from the URL Inspection API. Live checks used curl for status, title, canonical, robots, bot user-agents and rendered links. Inbound links were counted with a search of the post files. App facts come from the iTunes Lookup/Search API.
- Google claims were checked against status.search.google.com and developers.google.com/search/updates. The volatility reports are third-party only and are labelled unconfirmed everywhere.

## Still open

- Karol: request indexing for the four posts; send the Tier-1 pitches (week nine); do the campaign review; decide on the Cloudflare block, the store name, the NLT row, the testing claims and the minimum iOS; consider the gen-AI disclosure proposal.
- 11-09 refresh: read the money page against the stop rule, read p54 on the hub, check p58's effect on the four posts, and re-read the hold and the held post. If the money page is still down, decide whether a monthly facts-only refresh goes ahead anyway under §5.
- Still proposed from 10-19: add a page-by-date pull for the money pages to `scripts/gsc-dump.mjs`. This run needed it again.
