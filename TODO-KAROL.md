# TODO — Karol

Items the SEO autopilot can't do itself. Newest first.

## 2026-08-17 (weekly refresh)

- **DECISION NEEDED — opt into Google Preferred Sources, and decide whether to ask readers for it.** Google extended Preferred Sources into AI Overviews and AI Mode (announced 2026-05-27; official publisher guide at `developers.google.com/search/docs/appearance/preferred-sources`), and states that people are roughly twice as likely to click through to a source they have marked as preferred. This is the first *earned-visibility* lever that operates inside the AI surfaces where the majority of our impressions already live — which, given how much of our visibility carries no identifiable query, is potentially the highest-leverage thing available to us that is not a content edit. Two parts, both needing you: (a) confirm faithwall.app is eligible and correctly configured per Google's guide; (b) decide whether we are willing to put a light "add FaithWall as a preferred source" prompt on the site or in the app, which is a brand/UX call, not an SEO one. The autopilot has NOT changed SEO-STRATEGY.md for this — it is a proposal awaiting your decision.

## 2026-08-16

- **Cloud session's outbound network policy blocks api.unsplash.com.** Today's p15 post (bible-verse-widget-iphone) hit a `403` on every CONNECT to `api.unsplash.com` from this cloud sandbox — confirmed via the proxy's own status endpoint as a policy denial, not a flaky request (it retried and failed consistently). Fell back to reusing an on-theme image per the runbook, so nothing broke, but every future cloud-run post will hit the same wall until Unsplash is allow-listed for this environment's network policy. Needs your access to the environment config, not something the autopilot can fix from inside the sandbox.

## 2026-08-06 (weekly refresh)

- **Check whether faithwall.app has the Search Console generative-AI performance report yet** (Search Console → Performance → Search, look for the AI Overviews / AI Mode breakdown). Google shipped it 2026-06-03 to a subset of properties first; it is impressions-only with data from 2026-05-18 and no backfill. If we have it, the weekly dump should start pulling it — it is the only first-party read we can get on the AI-surface impressions §1 says are a large share of our visibility. Needs the Search Console UI, so the autopilot cannot check.
  - *Reinforced at the 2026-08-10 refresh — this is now the highest-value item on this list.* The share of our impressions that carries no identifiable query turned out to be far larger than assumed: several of our page-1 posts have **zero** named queries, and the moat pillar surfaces only about one impression in ten as a real query. That means roughly the majority of the site's visibility is currently invisible to the weekly analysis, and two queue items (p17, p18) are being planned essentially blind. This report is the only way to see it.
  - *Reinforced again at the 2026-08-17 refresh — still the highest-value item here, and now blocking measurement of shipped work.* The five spokes hardened by p17 grew their impressions several-fold this window and **still show zero identifiable queries between them**, so the only evidence we have that the AEO work is landing is raw impression growth — we cannot see citations at all. The same is true of the newly-added p20 target, which is now the site's fourth-largest surface with almost no legible demand. Every AEO item in the queue is being judged on a proxy. Note also that this report pairs directly with the Preferred Sources item above: both concern the same invisible AI surface.

## 2026-08-06

- **Photograph real lock screens of every app listed on `/best-bible-verse-lock-screen-apps`** (FaithWall, YouVersion, Glorify, Bible Gateway). No competitor in this niche has real device photography — it's the single biggest trust/differentiation lever available on the site's top page (SEO-STRATEGY.md §3 Play 2). Screenshots via simulator won't read as authentic; needs actual iPhone captures.
