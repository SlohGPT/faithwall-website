# 37 — Weekly SEO refresh, 2026-11-16

Session type: scheduled weekly task `faithwall-seo-refresh`. It runs locally and is the only part of the pipeline with Search Console access. The repo is public, so this entry is qualitative only. The raw numbers stay in Karol's local report and in `~/.claude/faithwall-gsc/`.

## What was asked

The standing weekly brief is to "measure what the autopilot did, then re-aim it". Entry 26 left specific jobs for this run: write an INDEX STATE line into p63 for the four October posts, lift the new-URL hold if two are indexed, queue the hub's NLT swap if Karol hadn't answered, and read p60, p61 and p58.

## What was found

- **Once-per-week guard passed.** No refresh commit in the last five days. The pull was already up to date.
- **Google confirmed a core update.** Its status feed lists the November 2026 core update from 11-10, global, with a rollout of up to two weeks and no end date yet. Through 11-15 no page shows a step down. Comparing each page's daily visibility and position for the week before 11-10 with the five days after it: the generator and the pillar edged up, the hub and the money page are flat, and only the prayer roundup had two softer days at the end.
- **Site level.** Clicks and impressions rose again against the previous 28-day window, impressions far faster, so the click rate fell again. Nearly all of the growth is the generator page, which is now the largest click source over the 28-day window as well as the largest impression source. The maker page went from almost no web-search clicks to a steady trickle.
- **Hub.** p61 went live on 11-11. Google re-crawled the hub that day and has since shown jump links to its sections, which come from the contents box. The hub's own position is unchanged in mid page 1, where it has sat since 10-28, and its clicks are within their usual range.
- **A measurement trap.** Search Console lists each jump link as its own page row (the URL with a `#fragment`). A page filter of the "contains" kind sums those rows, which made the hub look as if its visibility had tripled on 11-11. Its base URL is flat. Six pages now have such rows: the hub, the pillar, the prayer roundup, the wallpaper roundup and two posts.
- **Money page.** Unchanged in the bottom half of page 1. Its daily visibility is back to the level before the 10-29 step, and clicks are still near zero. The stop rule from entry 26 stands.
- **Pillar.** Back to its usual level and a little better than the week before.
- **Index state of the four October posts.** One is indexed: Google crawled and indexed `/blog/lock-screen-verse-for-grief` on 11-12, five days after p58's in-body links went live. The other three are still unknown to Google. All four return 200 and sit in the sitemap Google re-read on 11-13. The indexed post has no search visibility yet.
- **`/faithwall-vs-hallow` has shown for no search since 11-05.** It is indexed with its own canonical, returns 200 and was re-crawled on 11-16. The legible part of its earlier visibility was mostly a second listing under the one-word brand query, so this reads as Google dropping that second listing. The cause isn't known.
- **Brand KPI.** The one-word "faithwall" query is still at its pre-September baseline and still ranks first, with a slightly better latest week. Branded share of identifiable clicks fell again, because generator clicks grew. Since 11-13 there is a new confound: the other FaithWall is on sale.
- **Off-site.** No draft carries a SENT note: zero pitches sent, zero placements. A fresh search under both names and direct reads of the Tier-1 pages found no third-party mention (healthyspirituality.org blocks automated reads). The Advent send-by date was today.
- **Image surface (b4).** Image visibility grew by about two-fifths against last week's read, and the maker page grew by about half and still leads. Image clicks are level and positions are still deep. The new queries add an "aesthetic" modifier to black lock-screen phrasings the gallery already covers, at a handful of impressions. No gap to queue renders for.
- **CTR and striking distance (3c).** Same picture as last week. Every striking-distance query belongs to a page that already owns it (the generator or the hub). The high-impression, low-click-rate pages at position 10 or better are the feeder, the money page (stop rule) and the prayer roundup (mostly anonymized demand). No new keyword was queued, so no SERP-overlap check was needed.
- **Cloudflare.** Unchanged: managed robots.txt in front of ours, a 403 for GPTBot and ClaudeBot, and a 200 for OAI-SearchBot, PerplexityBot, Googlebot and Bingbot.
- **App Store.** Listing unchanged: "Lock Screen Bible Verse", v2.3.2, minimum iOS 15.0. The iTunes search for "faithwall" shows no namesake listing.
- **Google-change watch.** The upstream ledger moved (newest entry 11-09, changelog 2.6.2 dated 11-15) but does not yet carry the core update, which came from Google's own status feed. Other new items: Google says it plans to support a shared robots.txt control for AI training in early 2027 (secondary source; it does not affect Search), and a 11-12 documentation page on identifying Search traffic by Referer. Nothing deprecates or penalizes anything the site does. Nothing urgent under step 4.

## What was decided, and why

- **The hold stays.** Its condition is two of four posts indexed, and one is. p63 got its INDEX STATE line for 11-16; the line is dated before 11-23, so it authorizes nothing yet.
- **The NLT default applies, with two changes.** Karol left no line, so the swap is queued as p66. It is dated 11-25, after the core update, because p54 already showed that a hub edit landing inside ranking movement can't be read afterwards. And the replacement is not a single-translation app: an App Store search found no first-party one besides the ESV app the list already ranks, so p66 names Literal Word, a free, ad-free, offline reader, with its listing facts verified today so a cloud run doesn't need the Apple API. The new row must say it was added from its listing and wasn't part of the original hands-on pass, because the page's method section carries a first-person testing claim that is still an open check for Karol.
- **p64, draft fixes, runs first.** The Tier-1 pitches are the only open lever for the money pages and have waited ten weeks. Three drafts and the directory pack still say the widget rotates the user's saved verses. The Advent follow-ups refer to an earlier email that was never sent, and their date has passed. p64 corrects the wording and adds an optional seasonal paragraph to each Tier-1 pitch, so each is one sendable email. It adds no new drafts.
- **p65, two fact leftovers.** The sitewide app schema in `index.html` still says iOS 16.0+, so the homepage carries two app schemas that disagree, and one `faithwall-vs-hallow` row keeps the wording p61 replaced elsewhere. It is not held for the core update: one schema string and one table cell won't blur the read.
- **No generator item.** It is the largest pool of striking-distance demand on the site, and its position is rising without help. Whether it deserves more than feeder treatment depends on installs, which only the App Store Connect campaign review shows. That review is Karol's and is overdue.
- **p52 archived** at the 28-day mark. p53 completed 27 days ago, so it stays one more week.

## What was built

- `src/data/seo-priorities.json`: effect notes on p28, p52, p54-p58 and p60-p62, an image note on p48, the INDEX STATE line on p63, p52 archived to `done[]`, p64-p66 added, pending items re-ranked, `updated` bumped and the top-level note appended.
- `SEO-STRATEGY.md`: header date; generator, Play 1, Play 2 and Play 4 updates; the §6 hold line; §9 rule 6 (core update, index state); §10 image line.
- `TODO-KAROL.md`: a new 2026-11-16 section. Removed as resolved or carried forward: the 11-09 weekly section, the 11-10 p60 section (its two leftovers are now p64 and p65), the "done" lists of 11-04 and 11-05, and the two settled decisions (store name, minimum iOS), which shipped in p60.
- This entry and `docs/README.md`.
- Commit: "seo: weekly priorities refresh".

## How it was verified

- The JSON round-tripped byte-identically through Python `json.dumps(indent=2)` before the edit, and parses after it. App code doesn't import it, so no build is needed.
- Page timing comes from page-by-date Search Console queries with fresh data included, read on base URLs, and from per-page windows before and after 11-10. Index state and crawl dates come from the URL Inspection API, and sitemap reads from the sitemaps endpoint.
- Live checks used curl for status, robots tags, sitemap entries, robots.txt and bot user-agents. App facts come from the iTunes Lookup and Search API.
- The core update was read on Google's status feed directly, after a research agent reported it. Placement checks were a web search under both names plus direct page reads.

## Still open

- Karol: the Tier-1 pitches (biblegeeks can go now, the rest after p64); request indexing for the three unindexed posts; the campaign review; a line on the NLT row before 11-25 if he wants something other than the swap; Cloudflare; the hub's first-person testing claim and the prayer roundup's "ranked and tested" meta.
- 11-23 refresh: the INDEX STATE line that decides p63; read the core update once the rollout is nearly done, on base URLs; re-date p66 if the rollout is still running; read `/faithwall-vs-hallow` and the prayer roundup again.
- Still proposed from 10-19: add a page-by-date pull for the money pages to `scripts/gsc-dump.mjs`, with an exact-URL filter so jump-link rows don't inflate it. This run needed it again.
