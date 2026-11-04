# FaithWall website — docs hub

Session journal for this repo. One entry per session, append-only, numbered in order (next entry = highest number + 1). Public repo: entries describe search performance qualitatively and never contain raw Search Console numbers. Direction lives in `SEO-STRATEGY.md`, the work order in `src/data/seo-priorities.json`, and human tasks in `TODO-KAROL.md`.

## Status (2026-11-04)

- **Watch:** the money page (`/best-bible-verse-lock-screen-apps`) stepped down again on 10-29, from the bottom of page 1 to the page-1/page-2 edge, with most of its impressions gone. p53 shows no recovery. The hub slipped from upper to mid page 1 from 10-28, with a partial rebound. Both fall inside ranking volatility that Google has not confirmed. No edits to either page; the 11-09 refresh decides and the stop rule stands. See entry 17.
- The hub (`/blog/best-free-bible-app-iphone`) is still the leading click source. The generator page keeps rising and is a feeder, so it gets no extra work. The moat pillar's slide has stopped, and the watch is closed.
- The new-URL hold is extended to the 2026-11-09 refresh. The four newest posts are still not indexed 19-25 days after publishing (two discovered, two unknown), and no other post links to them in-body. The held post `/blog/bible-study-group-iphone-tools` stays unpublished.
- Queue: p58 (in-body links to the four posts), p59 (blog skill accuracy), p60 (minimum iOS and the App Store name, from 11-10), then p30 and p31. None of these needs the Apple API. p57 (Lectio 365 now runs three prayer times a day, not two) went live on 11-04 and was submitted to IndexNow. p28 is done: its Advent drafts were merged on 11-03 and are Karol's to send, Tier-1 first, by 11-16. Two of entry 19's three wording points were fixed on 11-04 (entry 22). The third is send order: each Tier-1 pitch goes out before its Advent follow-up.
- Build bug fixed on 11-04 (entry 22): the prerender now strips the NUL bytes React 18.3.1 wrote at buffer edges, and the three affected posts are clean live.
- Regression, unchanged: Cloudflare's managed robots.txt and AI-crawler block are on faithwall.app (GPTBot and ClaudeBot get a 403). ChatGPT search and the Google and Bing crawlers are unaffected. It's flagged to Karol.
- The App Store title "Lock Screen Bible Verse" dates to at least May 2026, not 10-18. p60 names it on the site and sets the minimum iOS to 15.0, with the widget needing iOS 16 (entry 22).
- Since 11-04 (entry 22), blog covers are generated lock-screen images, each showing one KJV verse; the hub keeps its cover. Content pages also have a mobile-only install bar (campaign tokens `web-sticky-*`, client-side only) and a readability pass on article text.
- Off-site: zero pitches sent, zero placements.

## Index

- [01 — Weekly SEO refresh, 2026-10-19](journal/01-weekly-seo-refresh-2026-10-19.md): money-page drop dated to 09-30, p53 queued, new-URL hold, newest posts not indexed.
- [02 — Merge gate, 2026-10-19](journal/02-merge-gate-2026-10-19.md): fallback post merged but held unpublished under the new-URL hold; gate cleared.
- [03 — Local autopilot, 2026-10-20: p53](journal/03-autopilot-p53-2026-10-20.md): money-page passage that listed search phrasings rewritten as a reader question; verified, pushed for the merge gate.
- [04 — Merge gate, 2026-10-20](journal/04-merge-gate-2026-10-20.md): p53 verified, fast-forwarded, live and submitted to IndexNow; gate cleared.
- [05 — Merge gate, 2026-10-21](journal/05-merge-gate-2026-10-21.md): no branch to merge; liveness fine (last bot commit 10-20); queue starved until 11-02.
- [06 — Merge gate, 2026-10-23](journal/06-merge-gate-2026-10-23.md): no branch; 3-day liveness alarm tripped, but it's a starved queue plus the hold, not a blocked routine. Covers the 10-22 gate, which left no entry.
- [07 — Merge gate, 2026-10-25](journal/07-merge-gate-2026-10-25.md): no branch; still a starved queue; no runs on 10-24; App Store name is now "Lock Screen Bible Verse".
- [08 — Weekly SEO refresh, 2026-10-26](journal/08-weekly-seo-refresh-2026-10-26.md): hold extended to 11-02 (new posts still undiscovered), facts-only refreshes p54-p56 queued, Cloudflare AI block back, App Store rename sent to Karol.
- [09 — Merge gate, 2026-10-26](journal/09-merge-gate-2026-10-26.md): no branch; the refresh queued p54 after today's autopilot run, so this was the last starved-queue day. Expect a p54 branch on 10-27.
- [10 — Merge gate, 2026-10-27](journal/10-merge-gate-2026-10-27.md): cloud branch merged (TODO only). p54 is blocked by the cloud proxy's Apple-domain 403, and the local run, which can reach the API, guard-exits behind it. Gate cleared.
- [11 — Merge gate, 2026-10-28](journal/11-merge-gate-2026-10-28.md): local p54 branch (hub facts refresh) verified, facts spot-checked against the iTunes API, fast-forwarded, live, IndexNow 200; gate cleared.
- [12 — Merge gate, 2026-10-28 (second firing)](journal/12-merge-gate-2026-10-28-second-firing.md): the other account's copy of the gate caught up at 17:02 and found nothing to do; no branch, liveness fine.
- [13 — Merge gate, 2026-10-30](journal/13-merge-gate-2026-10-30.md): local p55 branch (vs-pages facts refresh) verified, facts spot-checked against the iTunes API, fast-forwarded a day late (10-29 gate hit a session limit), live, IndexNow 200; gate cleared.
- [14 — Merge gate, 2026-10-31](journal/14-merge-gate-2026-10-31.md): cloud branch merged (TODO only). p56 hit the same cloud-proxy iTunes block as p54 in entry 10, and the local run guard-exited behind it, so p56 is still pending. Gate cleared.
- [15 — Merge gate, 2026-10-31 (second firing)](journal/15-merge-gate-2026-10-31-second-firing.md): a late catch-up at 20:51 found nothing to do; the local run that fired with it guard-exited, so p56 is still pending. No branch, liveness fine.
- [16 — Merge gate, 2026-11-01](journal/16-merge-gate-2026-11-01.md): local p56 branch (prayer roundup facts, wallpaper roundup verified) spot-checked against the iTunes API, fast-forwarded, live and submitted to IndexNow. Queue is down to dated outreach, so the 11-02 refresh must refill it.
- [17 — Weekly SEO refresh, 2026-11-02](journal/17-weekly-seo-refresh-2026-11-02.md): money page stepped down again on 10-29 and the hub slipped during unconfirmed volatility, no edits; hold extended to 11-09; p57-p59 queued, including in-body links to the four unindexed posts.
- [18 — Merge gate, 2026-11-02](journal/18-merge-gate-2026-11-02.md): cloud p28 branch (Advent pitches) rejected for a banned "costs nothing to try" line in one draft, quarantined to a tag, p28 restarts from main. Gate cleared.
- [19 — Merge gate, 2026-11-03](journal/19-merge-gate-2026-11-03.md): cloud p28 restart (five Advent drafts) passed the Product facts read and fast-forwarded. Three wording points were flagged to Karol for review before sending. Gate cleared.
- [20 — Merge gate, 2026-11-04](journal/20-merge-gate-2026-11-04.md): local p57 branch (Lectio 365 runs three prayer times a day) verified, fast-forwarded, live and submitted to IndexNow. Found a React prerender bug that puts NUL bytes into three live posts and flagged it to Karol. Gate cleared.
- [21 — Merge gate, 2026-11-04 (second firing)](journal/21-merge-gate-2026-11-04-second-firing.md): a late catch-up at 20:14 found nothing to do. The local run that fired with it guard-exited on today's p57. There was no branch, and liveness is fine.
- [22 — Manual session, 2026-11-04](journal/22-manual-fixes-covers-2026-11-04.md): NUL fix, Advent wording fixed, homepage stats render real values, generated lock-screen blog covers, mobile install bar and readability pass; App Store name and minimum iOS settled into p60.
