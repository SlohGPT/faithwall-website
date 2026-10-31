# FaithWall website — docs hub

Session journal for this repo. One entry per session, append-only, numbered in order (next entry = highest number + 1). Public repo: entries describe search performance qualitatively and never contain raw Search Console numbers. Direction lives in `SEO-STRATEGY.md`, the work order in `src/data/seo-priorities.json`, and human tasks in `TODO-KAROL.md`.

## Status (2026-10-31)

- The hub (`/blog/best-free-bible-app-iphone`) is still the site's leading click source, now in upper page 1 on its head terms. The generator page's visibility rose steeply in the latest week. It is a feeder, so it gets no extra work.
- The money page (`/best-bible-verse-lock-screen-apps`) is still in the bottom half of page 1 since 2026-09-30. p53 went live on 10-20. Read it on 11-02; the stop rule is 11-09. The moat pillar is easing slowly, on watch.
- The new-URL hold is extended to the 2026-11-02 refresh. The four newest posts are still unknown to Google 12-18 days after publishing, with no on-site fault found. The held post `/blog/bible-study-group-iphone-tools` stays unpublished until then.
- The queue now has due-now work: p54 (hub facts refresh), p55 (vs-pages, from 10-29) and p56 (prayer and wallpaper roundups, from 10-31). All three are facts-only and bump no dates unless a fact changed. p28 (Advent pitches) follows on 11-02.
- **(10-28) p54 is done and live.** No cloud branch was there today, so the local autopilot ran it with the iTunes API. Hub facts were refreshed and spot-checked against live listings, merged, live and submitted to IndexNow. Two hub decisions went to Karol: the NLT app is no longer on the US App Store (the page still says "10 apps"), and the method paragraph's first-person testing claim. p55 (10-29) and p56 (10-31) need the same API, so the entry 10 cloud-proxy loop can return if the cloud routine pushes first. See entry 11.
- **(10-30) p55 is done and live.** The local 10-29 branch updated competitor Minimum iOS cells on both vs-pages (YouVersion 18.0+, Hallow 16.4+). It was merged a day late because the 10-29 gate hit a session limit, then confirmed live and submitted to IndexNow. FaithWall's own minimum iOS (15.0 vs 16.0) went to Karol. p56 is due from 10-31. See entry 13.
- **(10-31) p56 is blocked again.** The cloud routine ran first, hit the Apple-domain 403 and pushed a TODO-only note, and the local run guard-exited behind it. The gate merged the note. p56 stays pending until the local run goes first or the cloud network policy allows the iTunes API. See entry 14.
- Regression: Cloudflare's managed robots.txt and AI-crawler block are back on faithwall.app (GPTBot and ClaudeBot get a 403). ChatGPT search and the Google and Bing crawlers are unaffected. It's flagged to Karol.
- The App Store lists the app as "Lock Screen Bible Verse" (since 10-18), while the site says FaithWall. Karol decides whether the site should name the listing.
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
