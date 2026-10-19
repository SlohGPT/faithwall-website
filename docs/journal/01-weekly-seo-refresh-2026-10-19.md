# 01 — Weekly SEO refresh, 2026-10-19

Session type: scheduled weekly task `faithwall-seo-refresh`. It runs locally and is the only part of the pipeline with Search Console access. Public repo, so this entry is qualitative only. The raw numbers stay in Karol's local report and in `~/.claude/faithwall-gsc/`.

## What was asked

The standing weekly brief is to "measure what the autopilot did, then re-aim it". That covers: verify the effects of done queue items, re-rank pending items, track the brand KPI, verify off-site placements, check the image surface, append data-backed items, run the Google-change watch, review TODO-KAROL.md, commit and push.

## What was found

- **Once-per-week guard passed.** The last refresh was 2026-10-10.
- **Site level.** Clicks and impressions are both up over the previous 28-day window, average position improved, and the click rate edged up. The final week was softer than the week before it.
- **The money page dropped on a single day.** The page-filtered daily series shows `/best-bible-verse-lock-screen-apps` holding around positions 4-6 through 2026-09-29. On 2026-09-30 it fell to around 8.5-9 and stayed there. Clicks nearly stopped and impressions held. 2026-09-30 falls inside the confirmed September 2026 spam update (status dashboard: started 09-24, about 13 days 16 hours). Search Engine Roundtable reported a second wave of impact on 09-30 and 10-01; Google does not define phases. This corrects the 10-10 refresh, which read the slide as starting after p45/p47 (10-02/10-04). It started before both, five days after p33 (09-25).
- **Suspect on the page.** p33's second descriptive passage lists search phrasings in quotes and says FaithWall "turns up under so many different phrasings of the same search". That is text written for a search engine, the pattern Google's spam policies call keyword stuffing. A sweep of posts, comparisons and page components found no other visible passage like it; the only other matches were posts' `keywords` metadata arrays. Causation is not proven: the rest of the site rose in the same period, so this is not a site-wide demotion.
- **The four newest posts are not indexed** (URL Inspection API, 2026-10-19). Three are "URL is unknown to Google" and one is "Discovered – currently not indexed". That is 5-11 days after publishing, even though Google re-read the sitemap on 10-16 and the pillars link the posts. September posts, by contrast, were indexed within the window.
- **The hub keeps compounding.** `/blog/best-free-bible-app-iphone` is now the site's leading click source, and its named head terms are in upper page 1.
- **Generator family.** The phrasings for `/random-bible-verse` hold page 1 after p40/p41. The click rate stays structurally low.
- **Brand KPI.** The late-September step in the one-word "faithwall" query faded within about ten days and is back near its old baseline. The two-word query is unchanged in kind. Nothing is credited to off-site work.
- **Off-site.** Zero pitches sent, so zero placements to verify.
- **Image surface.** Image clicks rose from one to a handful. The maker page's image impressions grew modestly at deep positions. There is no verse-specific image demand cluster to build gallery renders for.
- **Google-change watch.** Upstream ledger and changelog have no entries newer than the 10-10 marker. The status dashboard lists nothing after the spam update ended on 10-08. There is no October core update.

## What was decided, and why

- **p53 queued at the top:** remove the keyword-variant passage from the money page and add no new descriptive passages. It is cheap and reversible, and right on its own merits whatever the cause. It is measured at the 2026-11-02 refresh. If nothing has recovered by 11-09, treat the drop as a results-page change and stop editing the page for it.
- **Precautionary hold on new URLs until the 2026-10-26 refresh.** This follows SEO-STRATEGY §9 rule 6 ("rather than continuing to publish into a penalty"). New posts are not even being indexed right now, so more URLs add risk and no reach. When nothing is eligible, the daily run does a §8 monitoring pass.
- **No new ctr-fix items.** `/random-bible-verse` already leads its title with the head term, and §10 says it is a feeder. The prayer roundup's legible queries are thin and odd, so the §3 Play 3 test fails.
- **No PrayerBuilt roundup item.** The app could not be verified to exist, the same precedent as p49.
- **No wave-two outreach drafts** (codeinfaith.com and others) until the five Tier-1 pitches ship.
- **SEO-STRATEGY.md updated from our own data:** Play 1 hub status, the Play 2 drop, the Play 4 KPI fade, the §6 rule 1 hold line, a new §7 rule ("never write passages for the search engine"), the §9 rule 6 flag, and the §10 image line.

## What was built

- `src/data/seo-priorities.json`: effect notes on p33, p37-p48, p50 and p52 (p49 is retired and p51 was an audit, so neither got one). p37 and p38 archived to `done[]`, p53 added, pending ranks shifted, `updated` bumped.
- `SEO-STRATEGY.md`, `TODO-KAROL.md` (new 2026-10-19 section; resolved and superseded 10-10 and 10-06 items removed), and this journal plus `docs/README.md`.
- Commit: "seo: weekly priorities refresh".

## How it was verified

- The JSON round-trips byte-identically through Python `json.dumps(indent=2)` before the edit, and parses after it.
- The money-page timing comes from a page-filtered Search Console query by date, not the 28-day windows. Index status comes from the URL Inspection API. The Google update dates come from status.search.google.com.

## Still open

- p53 runs on the next daily autopilot run; measure at 11-02.
- Karol: request indexing for the four new posts, send the Tier-1 pitches (week seven), and do the App Store Connect campaign review (now due).
- Re-read the hold at the 2026-10-26 refresh.
- Proposed, not done: add a page-by-date pull for the money pages to `scripts/gsc-dump.mjs`, so the weekly read dates drops without a side script.
