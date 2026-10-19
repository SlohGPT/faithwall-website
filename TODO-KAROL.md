# TODO — Karol

Items the SEO autopilot can't do itself. Newest first. Resolved items are deleted at each weekly refresh, not archived here — the queue and `SEO-STRATEGY.md` carry the history.

## 2026-10-19 (weekly refresh)

- **WATCH, already queued: the money page fell on 2026-09-30 and has not recovered.** `/best-bible-verse-lock-screen-apps` dropped out of the top 5 into the bottom half of page 1 in a single day, and its clicks have nearly stopped. Its impressions held. The date falls inside Google's September 2026 spam update (rollout 09-24 to 10-08), on a day trade press reported a second wave of impact. The 10-02 and 10-04 edits did not cause it, because the drop came first. The one suspect on the page is a 09-25 passage that lists search phrasings in quotes, which reads as keyword stuffing. p53, now at the top of the queue, removes it on the next daily run. You don't need to do anything unless you want to review p53's diff. Your local report has the numbers.
- **Precautionary hold: no new URLs until the 2026-10-26 refresh** (SEO-STRATEGY §9 rule 6). Apart from p53, nothing in the queue is eligible yet, so the autopilot will run monitoring passes instead of fallback posts. Tell it if you want the hold lifted.
- **5 minutes: request indexing for the four newest posts.** In Search Console, open URL Inspection and click Request indexing for each one. Google doesn't know three of them yet and lists the fourth as "Discovered – currently not indexed", 5-11 days after publishing:
  - /blog/short-bible-verses-for-lock-screen
  - /blog/scripture-based-prayer-prompts
  - /blog/bible-app-vs-olive-tree
  - /blog/lock-screen-verse-for-grief
  Do the five pages from the 2026-10-11 list in the same session.
- **THE ONE THING, week seven: send the five corrected Tier-1 pitches.** Nothing has been sent yet, so there are still no placements to check. Contact routes are in the 2026-09-24 entry below. Send only the copies corrected on 2026-10-02, generate the offer codes first, and mark each draft file "SENT YYYY-MM-DD".
- **Due now: the App Store Connect campaign review (SEO-STRATEGY §10).** Under Sources → Campaigns, check which `web-*`, `blog-*` and `pillar-*` campaigns produced downloads since 2026-10-02. The weekly refresh can't read App Store Connect. Bring the numbers to a session and the queue gets re-ranked from them. It matters more now that the money page has lost its clicks: the review shows whether that page was producing installs.
- **Brand KPI: the late-September jump has faded.** The one-word "faithwall" query is back near its old weekly level. It was a one-off outside event, not a trend, and nothing is credited to outreach. If you know what happened between about 09-29 and 10-08 (an App Store feature, a mention, an ASO change), note it here. It would show what actually moves branded search.
- **Namesake re-check (from p51): still no public App Store listing found** for the other "FaithWall" (beta name "FaithWall Verse"). The autopilot's search tool isn't Google, so treat this as a weak negative. The name call is still yours.

## 2026-10-14

- **2026-10-14 (optional): one real lock-screen screenshot for `/blog/lock-screen-verse-for-grief` (fallback post).** It shipped with a reused stock hero (the Simon Wilkes photo from `psalm-23-wallpaper-iphone`, since there's no Unsplash key locally). Its effort signals are KJV word counts from the site's own Bible text, the widget's rotation options with a named judgment call (once a day for grief), and an editorial call on which verses to hold back. It has no device evidence. The post's core setup is the FaithWall widget sitting under the clock on a personal-photo lock screen, so one screenshot of exactly that (any photo, with Psalm 34:18 or Matthew 5:4 in the widget) would be the strongest addition. Drop it in the repo and the autopilot can embed it.

## 2026-10-11 (p51 accuracy audit)

- **No correction requests to send. One five-minute check for you instead.** Details are in `outreach/targets.json`, under `summary.accuracy_audit_2026_10_11` and `summary.namesake_check_2026_10_11`.
  - **No third-party page describes FaithWall wrongly, because none mentions it at all.** The two competitor roundups recorded in August as listing it (abbeybible.com, getfaithlock.com) don't list it on a direct read. No reviews, directory listings or App Store mirror pages turned up either. So `outreach/corrections.md` was not needed and was not created.
  - **The only stale descriptions found are search-engine summaries of our *own* pages.** They still quote copy from before 2026-10-02: a monthly price, "no paywall", themed packs, Focus modes. The live site and main are clean. ChatGPT is the second install source and leans on Bing, so ask it "Is the FaithWall app free?" and "What does FaithWall do?". If it repeats the old claims, request re-indexing in Bing Webmaster Tools (URL submission) and Search Console (URL Inspection) for:
    - /best-bible-verse-lock-screen-apps
    - /faithwall-vs-hallow
    - /blog/scripture-wallpaper-for-iphone-free
    - /blog/best-christian-wallpaper-app-iphone
    - /blog/best-free-bible-app-iphone
  - **The namesake still has no public App Store listing.** Its beta page now calls it "FaithWall Verse". It is a TestFlight beta, and its public App Store release is listed as "still in progress". In the autopilot's search tool (not Google), its June Substack post ranks first for "faithwall app" and "faithwall bible app". The name and trademark call is still yours. p51 has closed, so nothing in the queue tracks the namesake any more. The weekly refresh should re-check it.
  - **Our own blog skill still pitches "themed packs" and "we pick the verse for you"** in `.claude/skills/faithwall-blog/SKILL.md` (friction angles, the "Zero curation" wedge, a CTA example). That contradicts its own Product facts rule, and a future post could put the claim back on the site. Rewriting it is a skill edit, outside what this item allowed.
  - **Placements: still zero.** All five Tier-1 pitches are unsent. New candidate for a later outreach wave: codeinfaith.com's 2026 Bible-widgets roundup, which is independent and doesn't mention FaithWall.

## 2026-10-10

- **2026-10-10 (optional): one real lock-screen screenshot for `/blog/scripture-based-prayer-prompts` (fallback post).** It shipped with a reused stock hero (the Jeremy Yap photo from `best-prayer-app-for-iphone`, since there's no Unsplash key locally). Its effort signals are the widget's rotation options, the iOS Customize path and your named judgment call (rotate every 8 hours). It has no device evidence. A screenshot of the FaithWall lock-screen widget showing one of the post's 12 prompt verses (e.g. Psalm 46:10) would be the strongest addition. Drop it in the repo and the autopilot can embed it.

## 2026-10-08

- **2026-10-08 (optional): one real lock-screen screenshot for `/blog/short-bible-verses-for-lock-screen` (p50).** The post shipped with a reused stock hero (the same Anthony Garand photo as `bible-verse-lock-screen-iphone`, because there's no Unsplash key locally) and no device evidence. A screenshot of your own iPhone lock screen with a short verse such as Lamentations 3:23 in the FaithWall widget would be the strongest effort signal the page could carry. Drop it in the repo and the autopilot can embed it.

## 2026-10-05 (weekly refresh)

- **Re-ping the pages fixed on 2026-10-02 to IndexNow (Bing, which ChatGPT search leans on).** A web-search snippet check today still shows the old copy for faithwall.app: "free with premium" pricing, verse packs and Focus-mode integration. The repo is clean, so the index is stale. One command from the repo: `node scripts/submit-indexnow.mjs https://faithwall.app/ https://faithwall.app/best-bible-verse-lock-screen-apps https://faithwall.app/daily-scripture-lock-screen https://faithwall.app/blog/best-free-bible-app-iphone https://faithwall.app/faithwall-vs-hallow https://faithwall.app/faithwall-vs-youversion`. Then run URL inspection on the homepage in Bing Webmaster Tools. The weekly refresh doesn't submit on its own.

## 2026-10-02 (pricing-accuracy fix)

- **The five outreach drafts and the directory pack are corrected and ready to send.** Since v2.3 FaithWall needs a subscription, but the site and drafts still called it free. I rewrote the pitch bodies in `outreach/bibleversedaily.md`, `warmpeach.md`, `learnofchrist.md`, `biblegeeks.md`, `healthyspirituality.md` and the app description in `outreach/directories.md`. Each now says: free to download, subscription required, you pick your own verses, wallpaper or rotating widget. Each offers a subscription offer code so the reviewer can test the full app, and each file starts with a "Facts corrected 2026-10-02" line. **Send only these corrected copies.** Before sending, generate the offer codes in App Store Connect. The site copy and posts got the same fix, and a Product facts rule now guards the daily blog skill and SEO-STRATEGY §5.

## 2026-09-24 (weekly refresh)

- **Contact routes for the five Tier-1 pitches** (still unsent as of 2026-10-10):
  - `outreach/bibleversedaily.md` → **info@bibleversedaily.org** (best of the five)
  - `outreach/warmpeach.md` → **hello@warmpeach.com** (caveat: content marketing for their own pre-launch Bible chat app)
  - `outreach/learnofchrist.md` → **the form at https://learnofchrist.com/contact** (pitch the missing lock-screen/widget category)
  - `outreach/biblegeeks.md` → **the form at https://biblegeeks.fm/contact**
  - `outreach/healthyspirituality.md` → **confirm the address in a normal browser** at https://healthyspirituality.org/blog/biography/
  - When you send one, add a line "SENT YYYY-MM-DD" to its draft file so the weekly refresh can start tracking it.
- **ACCOUNTS + one small paid decision: the Tier-2 directory pack at `outreach/directories.md` is still unsubmitted.** faith.tools (paid, needs your go-ahead), AlternativeTo (sign up now, 7-day account age rule), SaaSHub (free, lowest friction; re-checked today, FaithWall absent), MochiLaunch (free with badge or $1.99).

## Still open — needs your access or your decision

- **HIGHEST-VALUE INFO ITEM (2026-08-06, updated 2026-09-24 — now answerable): open the Search Console generative-AI performance report.** Google's help page now says it reached **all** sites by 2026-08-31 (https://support.google.com/webmasters/answer/16908024), so faithwall.app should have it. Two checks, five minutes: (a) Settings → **Search generative AI** should say "Include" (the default). If it says exclude or inherit-from-parent with exclude, we are invisible in AI Overviews and AI Mode. (b) Performance → the generative-AI report. Screenshot or export it for the next refresh. Why it matters: roughly four impressions in five across the site still carry no identifiable query, and the prayer page is visibly being shown for assistant-style full questions at position 1 with no clicks. This report is the only view into that. If it can be exported, the weekly dump should start pulling it.
- **DECISION (2026-08-17): Google Preferred Sources.** Google extended it into AI Overviews and AI Mode (2026-05-27) and states people are roughly twice as likely to click through to a source they have marked as preferred. Google shipped an official custom button — a script tag plus a `<div google-add-preferred-source-btn></div>` element, auto-localized, with a JS API and a plain deeplink alternative (`https://www.google.com/preferences/source?q=faithwall.app`). Domain-level sites are eligible. Two things needed from you: (a) confirm we appear in Google's source-preferences tool (needs your Search Console/Google account); (b) decide whether we're willing to put a light "add FaithWall as a preferred source" prompt on the site or in the app. That is a brand/UX call, not an SEO one. If yes, the code is about two lines. Given that most of our impressions live in exactly the AI surfaces this operates in, it is still the highest-leverage earned-visibility lever available. **Update 2026-09-24:** Google's Preferred Sources page (updated 2026-09-18) now says a site must be *included* in the Search generative AI setting to show as a preferred source in AI Mode/AI Overviews (https://developers.google.com/search/docs/appearance/preferred-sources). The check in the item above covers this too.
- **PHOTOGRAPHY (2026-08-06): photograph real lock screens of every app on `/best-bible-verse-lock-screen-apps`** (FaithWall, YouVersion, Glorify, Bible Gateway). No competitor in this niche has real device photography — the single biggest trust and differentiation lever on the site's top page (§3 Play 2). Simulator screenshots won't read as authentic. This is also the clean fix for the whole class of problem behind the p21 fabrication incident: the agent cannot produce first-hand device evidence, and your photos are the only thing that can.
- **DECISION (2026-08-22): owned audience.** The site converts nothing it can keep — no email capture, no community channel. Options: a light email capture ("verse pack of the month"), or leaning on the app itself as the owned channel. Product/brand call, yours. Rented attention should land somewhere we keep.
- **DATA EXPORT WANTED (2026-08-22): original data study.** The strongest citable asset we could own is aggregate, anonymized app data — most-set verses by month, verse-category popularity by season. Nobody in this niche has published anything like it. If you can export aggregate numbers (no user-level data), a `data-study` queue item turns it into a citable page.
- **APP-SIDE (2026-08-22): App Store review velocity.** Review prompts timed to a genuine win-moment (e.g. after the 7th daily verse shown) feed the same brand composite §8 is built on. Flagging, not prescribing.
- **ENVIRONMENT (2026-08-16): the cloud session's outbound network policy blocks api.unsplash.com** (403 from the proxy, confirmed as a policy denial). Posts fall back to reusing an on-theme image, so nothing breaks. Needs your access to the environment config. Not blocking anything. **Update 2026-10-10:** the local autopilot has no `$UNSPLASH_ACCESS_KEY` either, so the last two fallback posts reused stock heroes from older posts. Setting the key locally would give new posts their own images. Related and worth knowing: the same policy blocks the cloud agent from reading any target page directly, which is why contact-route resolution has moved to this weekly local refresh.

## Informational — no action

- **Prayer-spoke SERPs carry mixed intent (found by p26, 2026-09-07).** The live SERPs for both `how-to-set-prayer-alarms-iphone` and `prayer-reminders-on-iphone` are dominated by Islamic salah-time content (Muslim Pro, Athan, Azan-alarm apps) rather than Christian-prayer results. Worth knowing if either page's impressions ever look anomalously low relative to position — the query itself carries intent no on-page fix reaches.
- **Competitor noted (p22, 2026-08-31): abbeybible.com ("Abbey").** Publishes self-ranked "best lock screen Bible app" roundups placing itself #1 ahead of FaithWall on our exact head-term family — the same self-promotional pattern as FaithLock/Psalmo/Prayhouse. Not an outreach target; a competitor worth knowing about. See `outreach/targets.json`.
- **Four additional outreach candidates surfaced and not yet drafted:** thesweetsetup.com (established independent iOS app-review publication), thecripplegate.com (independent pastoral blog), margaretfeinberg.com (independent published-author blog), codeinfaith.com (independent 2026 Bible-widgets roundup, added 2026-10-11). A future `outreach-prep` wave, after the current Tier-1 five actually ship.
