# 26 — Weekly SEO refresh, 2026-11-09

Session type: scheduled weekly task `faithwall-seo-refresh`. It runs locally and is the only part of the pipeline with Search Console access. The repo is public, so this entry is qualitative only. The raw numbers stay in Karol's local report and in `~/.claude/faithwall-gsc/`.

## What was asked

The standing weekly brief is to "measure what the autopilot did, then re-aim it". Entry 17 left specific jobs for this run: read the money page against the 11-09 stop rule, read p54 on the hub, check p58's effect on the four unindexed posts, and decide on the new-URL hold and the held post.

## What was found

- **Once-per-week guard passed.** No refresh commit in the last five days. The pull was already up to date.
- **Site level.** Clicks and impressions rose against the previous 28-day window, with impressions rising much faster, so the click rate fell again. Nearly all the growth is the generator page, which in the latest week took more clicks than any other page. Average position was about flat.
- **Money page: the stop rule applies.** Forty days after the 09-30 drop, `/best-bible-verse-lock-screen-apps` still sits in the bottom half of page 1 on its named phrasings, and clicks are near zero. The 10-29 second step partly reversed from 11-04: daily impressions came back to about two-thirds of their earlier level, at the same position. Google re-crawled the page on 11-03 and it is indexed with its own canonical.
- **Hub: the slip held.** `/blog/best-free-bible-app-iphone` stayed in mid page 1 through 11-08. The 11-01/02 rebound did not last, and the click rate fell with the position. The shorter free-app phrasings moved most. The prayer roundup, which slipped at the same time with no edit, recovered after Google re-crawled it on 11-04. So p54 stays a suspect, but nothing proves it.
- **Pillar.** `/daily-scripture-lock-screen` had two very quiet days on 11-04/05 and returned to its usual level after Google re-crawled it on 11-06. Since then Google has shown jump links to two of its sections, which come from the contents box added on 11-05. That is the only measurable effect of the visual layer so far, and no page with the layer shows a step down the layer explains.
- **The four October posts went backwards.** URL Inspection now says Google does not know any of them, including the two it had listed as "Discovered - currently not indexed" on 11-02. All four return 200 with their own canonical and an index robots tag, and all four are in the sitemap Google re-read this morning. p58's in-body links have only been live since 11-07. The pillar holds the short-verses post's phrasing in mid page 1, and `/blog/bible-verse-lock-screen-iphone` shows for it near the top. The other three posts' topics show no search demand on any page of the site.
- **Brand KPI.** For two weeks the one-word "faithwall" query has sat at about its pre-September baseline and still ranks first. It is down against the previous 28-day window, which held the late-September step. Branded share of identifiable clicks fell sharply, because generator clicks grew while branded clicks shrank. The two-word query is unchanged in kind.
- **Off-site.** No draft carries a SENT note: zero pitches sent, zero placements. A search under both FaithWall and the store title "Lock Screen Bible Verse" found no third-party mention.
- **Image surface (b4).** Image visibility grew by about a third against last week's read, and the maker page grew by about half and still leads. Positions are still deep and clicks are a trickle. Queries stay broad plus the 4K, desktop/laptop and black modifiers the gallery already covers. No gap to queue renders for.
- **CTR and striking distance (3c).** Every striking-distance query belongs to a page that already owns it (the generator page or the hub). The high-impression, low-click-rate pages at position 10 or better are the feeder, the money page, the prayer roundup (mostly anonymized demand, just refreshed) and two posts with no legible demand. §3 Play 3's test rules out `ctr-fix` on all of them. No new keyword was queued, so no SERP-overlap check was needed.
- **Cloudflare.** Unchanged: managed robots.txt in front of ours, with a 403 for GPTBot and ClaudeBot and a 200 for OAI-SearchBot, PerplexityBot, Googlebot and Bingbot.
- **App Store.** Listing unchanged: "Lock Screen Bible Verse", v2.3.2, minimum iOS 15.0. The iTunes search for "faithwall" still shows no namesake listing. A different publisher's app is titled "Bible Verse Lock Screen", the same words in another order.
- **Google-change watch.** The upstream ledger and its changelog have not moved since 10-22. Google's search updates page was last updated on 10-26, and the status dashboard lists nothing after the September 2026 spam update. Third-party reports through early November mention unconfirmed volatility in late October and no confirmed November update. Google also clarified its help text on "Crawled - currently not indexed"; it doesn't change anything here. No new relevant changes and nothing urgent under step 4.

## What was decided, and why

- **The money page's drop is a results-page change, and on-page work for it is closed.** This is the stop rule set on 10-19. p60 and p61 still run from 11-10, because they fix product facts, not the drop. Authority (§8) is the only lever left for the top-5 slot.
- **p61 runs as written.** Holding the hub longer would not separate p54 from the volatility, and the false rotation claim should not stay live. The pillar's jump links and the lack of any layer-explained drop make the hub's layout change low-risk.
- **The NLT row gets a default.** Karol has had the decision since 10-28. If there's no answer by the 11-16 refresh, that refresh queues a swap to a listed free single-translation app, which keeps the title and the count. A list that tells readers one of its ten apps doesn't exist is the one weakness p54 left on the site's leading page.
- **The hold now ends on a condition, not a date.** It lifts once at least two of the four October posts are indexed. Re-extending it by a week every week was ritual. A condition resolves itself and says what the hold is for: new URLs add nothing while Google isn't indexing new posts.
- **p62, a citation audit under both names.** p51 predates knowing the store title, so no audit has searched it. It also records which Tier-1 sites published seasonal app content this month, for Karol's 11-16 sends. It drafts nothing, because the Tier-1 five are still unsent.
- **p63, a consolidation audit from 11-24.** If the short-verses post is still unindexed at the 11-23 refresh, it folds into the pillar, which already ranks for its phrasing (§5: consolidate before creating). The other three posts get an audit only, because no data says where they belong. The autopilot can't read index state, so the 11-16 and 11-23 refreshes write it into the item.
- **p48-p51 archived** at the 28-day mark. p52 completed exactly 28 days ago, so it stays, as p48 did last week.

## What was built

- `src/data/seo-priorities.json`: effect notes on p28, p48 and p50-p59. p53's note is final. Read-outs added to p60 and p61, p48-p51 archived to `done[]`, p62 and p63 added, p30/p31 re-ranked after them, `updated` bumped and the top-level note appended.
- `SEO-STRATEGY.md`: header date; pillar, generator, Play 1, Play 2 (stop rule applied) and Play 4 updates; the §6 hold line now has an end condition; §9 rule 6 update; §10 image line.
- `TODO-KAROL.md`: a new 2026-11-09 section carries the open items forward and sets the NLT default. Removed as resolved: the 11-02 weekly section, the p28 quarantine note, the 11-03 wording check (two points fixed on 11-04, send order carried forward), the NUL-byte bug (zero NUL bytes live on all three pages today), the minimum-iOS decision (settled into p60), and the blog skill's themed-packs line (fixed on 11-05).
- This entry and `docs/README.md`.
- Commit: "seo: weekly priorities refresh".

## How it was verified

- The JSON round-tripped byte-identically through Python `json.dumps(indent=2)` before the edit, and parses after it. App code doesn't import it, so no build is needed.
- Page timing comes from page-filtered daily Search Console queries with fresh data included, from per-page before/after windows around 10-29 and 11-04, and from query and country splits for the money page and hub. Index state and crawl dates come from the URL Inspection API, and sitemap reads from the sitemaps endpoint.
- Live checks used curl for status, canonical, robots tag, sitemap entries, robots.txt, bot user-agents and NUL bytes. App facts come from the iTunes Lookup/Search API. The Advent draft fixes were read in the file.
- Google claims were checked against status.search.google.com (incidents feed) and developers.google.com/search/updates. Volatility reports are third-party and labelled unconfirmed.

## Still open

- Karol: the five Tier-1 pitches and the Advent follow-ups by 11-16; request indexing for the four posts; the NLT row (default from 11-16); the campaign review; Cloudflare; the hub's first-person testing claim and the prayer roundup's "ranked and tested" meta.
- 11-16 refresh: write an INDEX STATE line into p63 for the four posts; lift the hold if two are indexed; queue the NLT swap if Karol hasn't answered; read p60 and p61 (live from about 11-10) and p58.
- 11-23 refresh: the INDEX STATE line that decides p63.
- Still proposed from 10-19: add a page-by-date pull for the money pages to `scripts/gsc-dump.mjs`. This run needed it again.
