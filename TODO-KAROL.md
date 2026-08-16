# TODO — Karol

Items the SEO autopilot can't do itself. Newest first.

## 2026-08-16

- **Cloud session's outbound network policy blocks api.unsplash.com.** Today's p15 post (bible-verse-widget-iphone) hit a `403` on every CONNECT to `api.unsplash.com` from this cloud sandbox — confirmed via the proxy's own status endpoint as a policy denial, not a flaky request (it retried and failed consistently). Fell back to reusing an on-theme image per the runbook, so nothing broke, but every future cloud-run post will hit the same wall until Unsplash is allow-listed for this environment's network policy. Needs your access to the environment config, not something the autopilot can fix from inside the sandbox.

## 2026-08-06 (weekly refresh)

- **Check whether faithwall.app has the Search Console generative-AI performance report yet** (Search Console → Performance → Search, look for the AI Overviews / AI Mode breakdown). Google shipped it 2026-06-03 to a subset of properties first; it is impressions-only with data from 2026-05-18 and no backfill. If we have it, the weekly dump should start pulling it — it is the only first-party read we can get on the AI-surface impressions §1 says are a large share of our visibility. Needs the Search Console UI, so the autopilot cannot check.
  - *Reinforced at the 2026-08-10 refresh — this is now the highest-value item on this list.* The share of our impressions that carries no identifiable query turned out to be far larger than assumed: several of our page-1 posts have **zero** named queries, and the moat pillar surfaces only about one impression in ten as a real query. That means roughly the majority of the site's visibility is currently invisible to the weekly analysis, and two queue items (p17, p18) are being planned essentially blind. This report is the only way to see it.

## 2026-08-06

- **Photograph real lock screens of every app listed on `/best-bible-verse-lock-screen-apps`** (FaithWall, YouVersion, Glorify, Bible Gateway). No competitor in this niche has real device photography — it's the single biggest trust/differentiation lever available on the site's top page (SEO-STRATEGY.md §3 Play 2). Screenshots via simulator won't read as authentic; needs actual iPhone captures.
