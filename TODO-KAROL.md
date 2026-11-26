# TODO — Karol

Items the SEO autopilot can't do itself. Newest first. Resolved items are deleted at each weekly refresh, not archived here — the queue and `SEO-STRATEGY.md` carry the history.

## 2026-11-26 (autopilot: p81, the sleep verses post)

- **Request indexing once the merge gate has deployed it (1 minute).** The new URL is `/blog/bible-verses-for-sleep-lock-screen`. In Search Console → URL Inspection, click **Request indexing** once.
- **Keep the sleep link if either linking post is merged or retired.** `lock-screen-verses-for-anxiety` and `psalm-23-wallpaper-iphone` now carry this post's day-one links. Whichever page absorbs one of them should keep a link to `/blog/bible-verses-for-sleep-lock-screen`.

## 2026-11-23 (autopilot: p80, the Psalm 91 wallpaper post)

- **Request indexing once the merge gate has deployed it (1 minute).** The new URL is `/blog/psalm-91-wallpaper-iphone`. In Search Console → URL Inspection, click **Request indexing** once.
- **If you merge or retire `daily-scripture-wallpaper-iphone` (one of the five daily-change posts, 11-17 item 1 below), keep the Psalm 91 link.** It and `psalm-23-wallpaper-iphone` now carry this post's day-one links. Whichever page absorbs it should keep a link to `/blog/psalm-91-wallpaper-iphone`.

## 2026-11-23 (weekly refresh)

- **Google's November core update is still rolling, and the site had a two-day dip.** Google's status page still shows the update (it began 11-10) with no end date. On 11-19 and 11-20 FaithWall's search visibility fell sharply across every page, country and device, and it came back on 11-21. QuranWall and NoteWall were normal on those days, and every live check on faithwall.app was clean: pages return 200 and are indexable, canonicals are right, www redirects, and 58 of 59 URLs are indexed. It reads as update volatility, not a site fault. Nothing for you to do; the refresh keeps watching.
- **Watch: the prayer-app roundup stepped down from 11-17.** That day had both the core update and the price-wording removal (81f4eac), so the two can't be separated yet. The 11-30 refresh re-reads it, and nothing changes on the page before then.
- **Three of the four October posts are indexed now.** The 11-20 Request Indexing worked for `/blog/short-bible-verses-for-lock-screen` and `/blog/scripture-based-prayer-prompts`, and the grief post has been indexed since 11-12. `/blog/bible-app-vs-olive-tree` is still unknown to Google. Nothing for you to do: asking again doesn't speed Google up, and p63's audit from 12-02 decides it.
- **The hub's NLT row now swaps from 12-08, not 11-25.** p66 replaces the row with Literal Word: Bible & Lexicon. The core update is still running and the hub is in the control group, so the swap waits until after the 12-07 read-out. If you'd rather drop the row, keep it as it is, or name another app, add a line here before 12-08.
- **Brand KPI, for your information:** the one-word "faithwall" query still ranks first. Its clicks eased back from the October high toward the old baseline. Branded share of clicks fell further, because generator clicks keep growing. Nothing is credited to outreach.
- **Facts check:** `check-facts` passed with no change.
- **Still waiting on you, unchanged:** the Apple agreement (11-16 night, first item), which the first campaign read around 12-15 needs (11-16 evening, item 1). The control-group read-out runs on the 12-07 refresh.
- **Google-change watch:** nothing new affects the site beyond the core update. **Still proposed from 10-26 (your call):** Google's generative-AI content guide (updated 10-01) asks sites to fact-check AI output by hand, titles, meta descriptions, structured data and alt text included, and suggests telling readers how the content was made. Options: a short, honest "how these pages are made" line on the About page, and/or a weekly spot-check by you of one autopilot page.

## 2026-11-18 (autopilot: p68, the men's verse wallpaper post)

- **If you merge or retire any of the five daily-change posts (11-17 item 1 below), keep the men's link.** `verse-of-the-day-lock-screen-iphone` and `scripture-wallpaper-for-iphone-free` now carry this post's day-one links. Whichever page absorbs either of them should keep a link to `/blog/christian-lock-screen-for-men`.
- **One line on the wallpaper maker page to check (not changed, outside p68).** Under the maker's install note, `src/pages/WallpaperMaker.tsx` (about line 241) says the widget "starts with the verse you picked and then shows random verses hourly, every 8 hours, or daily". Random verses only come with the optional Auto-rotate verses setting, which is off by default. Covered (11-23): p78's work list includes this file, so it is fixed after p72. Nothing for you to do.

## 2026-11-17 (autopilot: p67, the Christmas verses post)

- **If you merge or retire any of the five daily-change posts (item 1 below), keep the Christmas link.** `best-christian-wallpaper-app-iphone` and `scripture-wallpaper-for-iphone-free` now carry the new post's day-one links. Whichever page absorbs either of them should keep a link to `/blog/christmas-bible-verse-lock-screen-iphone`.

## 2026-11-17 (research check: owner items)

Checked against primary sources on 2026-11-17. Three small items, only you can do them.

- **1. Bing Webmaster Tools (10 minutes, then monthly).** Verify faithwall.app if it isn't verified yet. Then open AI Performance (public preview since 2026-02-10: citations, cited pages and sample grounding queries) and note the citations once a month.
- **2. Search Console's Generative AI performance report: export it by hand once a month (5 minutes).** It is in the UI only (rolled out to all sites as of 2026-08-31) and has no API: we tested the service account, and every AI `searchType`/`type` value returns HTTP 400. Save each export into the private faithwall-gsc folder.
- **3. App Store Connect idea, after the 12-02 read-out: custom product pages.** Different App Store page versions for different traffic sources. Don't start before the read-out.

## 2026-11-17 (how the wallpaper really updates)

I checked the site against the app's source code. The site said the lock-screen verse changes by itself or every day. In the app it changes only when you pick or edit a verse (the app runs the Shortcut), and a style change needs Update Wallpaper Now. Nothing runs in the background. The site, the blog skill and the autopilot prompts now say so, and the lint fails the old claims.

- **1. Five posts built on a daily change (10 minutes).** The posts are verse-of-the-day-lock-screen-iphone, rotating-bible-verse-wallpaper-iphone, daily-scripture-wallpaper-iphone, best-christian-wallpaper-app-iphone and scripture-wallpaper-for-iphone-free.
  - Their false sentences are fixed, but each topic still promises a verse that changes daily.
  - The honest framing: you pick a new verse when you want one, or turn on the widget's optional Auto-rotate verses.
  - Should they keep their topics with that framing, or should some be merged or retired? Until you answer, they keep their topics.
- **2. Two app issues for the developer (the app, not the site).**
  - An unused onboarding card, "Pro tip: make it automatic" (`overviewAutomationCard`, OnboardingView.swift ~8182), suggests an automation that would change the verse. Nothing shows it today, but if it's ever wired in, its text is false. Delete it or reword it.
  - Settings > Change Setup Mode doesn't turn Auto-rotate verses off (SettingsView.swift ~1865-1893 never calls `WidgetRotationManager.disable()`). The flag is saved, and the app rebuilds the rotation queue at launch. So someone who goes from widget to wallpaper and back may find rotation still on.
- **3. One heading on the daily-scripture pillar (1 minute, after 12-02).** The FAQ asks "Can I get a new Bible verse every day automatically?" The answer under it is now true (only in the widget setup, with Auto-rotate on). The pillar is in the control group, so the heading stays as it is until p72. Should it keep the question or get a new one?
- Still waiting from the last update: item 2, the legal pages' widget line. The same goes for "a fresh verse every day" in the App Store listing (the ASO session).

## 2026-11-16, last update (what the app really does)

Checked against the app's source code: two answers to the evening list's item 3, and three short questions.

- **Answered by the app's code** (evening item 3, bullets 1 and 3):
  - **Bible browser.** The app has one, with every book and chapter, so the site no longer says "not a Bible reader". It now says FaithWall "has a built-in Bible browser for finding your verse, but it is built for the lock screen, not for study."
  - **Widget.** The widget shows the verse you picked. It shows random verses only when "Auto-rotate verses" is on in Settings, and that is off by default.
    - The site now says so in the AI files, the home FAQ, the hub and a few pages. The other pages follow in p78, after 12-02.
    - The listing's "a fresh verse every day" is true only with that setting on. That's for the ASO session at the next listing update.
- **1. Free exports (2 minutes).** The site says "there is no free tier" (llms.txt, pricing.md and the prayer-app roundup).
  - The app's code gives new users 3 free wallpaper exports, and your Terms say so too.
  - But the paywall has no close button.
  - What does a new user actually get today? Until you answer, the site keeps "no free tier".
- **2. Legal pages (5 minutes).** The Privacy Policy and the Terms of Use say FaithWall works through "a rotating lock-screen widget". Rotation is an option, off by default.
  - Suggested wording: "or a lock-screen widget (with an optional auto-rotate setting)".
  - It's legal text, so it's your call. Tell the next session.
- **3. Two phrases to confirm (1 minute).** The site says FaithWall is "not a study app" and has "no reading plans", because the source has neither feature.
  - If either is wrong, say so.
  - If both are right, the next session also adjusts one FAQ answer on /best-bible-verse-lock-screen-apps. It says lock-screen apps lack translations and search, but FaithWall has both, for picking a verse.
- Nothing to do: /blog/best-free-all-time had links pointing at it but no page. It now redirects to the free Bible apps roundup.

## 2026-11-16 late night (keyword research tool)

The App Store agreement at the top of the next section still comes first.

- **New: a free keyword research tool, the same on all three sites.** You asked for a free keyword researcher we could use through MCP or an API. No free tool gives real search volumes. The open-source "keyword researchers" either scrape Google, which breaks Google's terms, or resell Keyword Planner data. No MCP server offers keyword ideas either, Google's own Ads MCP server included. So this session built a small script, `scripts/keyword-research.mjs`, that uses only free, allowed sources:
  - Search Console: what people already find us for.
  - Google autocomplete: a small daily allowance per site. It proves a phrase is searched, never how often.
  - Bing, once you create a key (item 2).

  The script groups searches into clusters and suggests one move per cluster: a refresh, an FAQ answer, a tool, a comparison or a new post. Nothing was bought. The how-to is in `docs/keyword-research/README.md`. QuranWall and NoteWall get the same script with their own keywords. If you'd rather skip Bing entirely, say so.
- **1. Which analytics tool does each site use, and is it behind Cloudflare? (5 minutes)** Counting visits from ChatGPT, Perplexity, Claude, Gemini and Copilot waits on this. So does the Cloudflare check in item 4 for QuranWall and NoteWall. Only FaithWall is known to be on Cloudflare.
- **2. Bing Webmaster Tools API key (about 20 minutes, only you can).**
  1. Sign in to Bing Webmaster Tools.
  2. Import the three sites from Search Console.
  3. Go to Settings → API Access and generate an API key.
  4. Save the key to a file outside every repo: `~/.claude/secrets/bing-wmt.key`, readable only by you (`chmod 600`). Don't paste it into chat.

  The next session then makes three test calls to see what the real responses look like, and only then wires Bing into the tool. Bing's AI Performance report, in the same dashboard, shows how often Copilot cites each site. It has no API yet, so glance at it once a month.
- **3. Search Console's AI report (5 minutes).** Google now reports how often each page shows in its AI features (AI Overviews and AI Mode). It shows impressions only: no queries, no clicks. Open each of the three properties and tell the next session whether the report appears. An empty report is normal at our size.
- **4. Cloudflare AI Crawl Control: done for faithwall.app on 11-17 (journal 42).** QuranWall's and NoteWall's check waits on item 1. On all three sites ChatGPT's search crawler (OAI-SearchBot) and ChatGPT-User must never be blocked: ChatGPT's iPhone app is the biggest single App Store referrer for all three apps. The weekly refresh runs `geo-probe` and puts a blocked search bot on this list.
- **5. Optional (5 minutes): apply for the Google Trends API alpha.** It gives relative interest over time, not volumes. It's a small pilot, so don't wait for it. Scraping Trends (pytrends) is off-limits.
- **6. Later, not now: paid search volumes.** If the free data can't decide between topics after about 4 weeks, there are two options:
  - DataForSEO: you create the account and top up a $50 minimum, which doesn't expire. That is roughly a few dollars a month at our use.
  - Google Ads' Keyword Planner API: 45 to 90 minutes of setup, plus Google's approval wait.

  Keywords Everywhere, about $7 a month, is the small alternative.
- **7. Later, after a 3-month review: an AI answer tracker.** Each month, it would ask ChatGPT, Gemini and Claude about 30 fixed questions per site through their official APIs, to see whether each site gets cited. The cap would be about $15 a month. It needs your OK and keys you create. Not now.
- **8. Optional (1 minute): make the Search Console key file readable only by you.** The tool's check shows it is readable by other accounts on this Mac. It is not in git (checked). Run `chmod 600` on `scripts/service-account-key.json` in the karchi folder.
- **QuranWall's list gets one item from this work:** before any QuranWall tool or mood page, name a Quran translation whose licence allows commercial website use (or choose Arabic only with a link out), and name a reviewer for meanings. Its session adds this to its own TODO-KAROL.md.

## 2026-11-16 night (the first item blocks the campaign read)

- **First: accept Apple's updated agreement in App Store Connect (2 minutes, only you can).** Since about 11-11 Apple's analytics API answers every request with `REQUIRED_AGREEMENTS_MISSING_OR_EXPIRED`, so the App Store data our sessions read stops at 11-11. Only the Account Holder can fix it: App Store Connect → Business (Agreements, Tax, and Banking) → review and accept the pending agreement. Until then the 12-15 campaign read (item 1 below), the control-group read-out and the other-language decision all work from data frozen at 11-11. It covers all three apps, because they share one developer account.
- **Other languages: for now, English only on all three sites, with one test to watch on QuranWall.** You asked whether to publish blogs in other languages for the countries where the apps' customers are.
  - **FaithWall: no Portuguese site yet.** A Brazilian customer brings in much less than a US one, mostly because App Store prices there are lower. A Portuguese page would need many times the clicks of an English page to pay for itself. Google barely shows this site in Brazil, while the App Store already reaches Brazil through the Portuguese listing. p77 looks again from 2027-01-15.
  - **QuranWall: Turkey is its biggest market.** A 3-page Turkish test is decided from 12-15. It goes ahead if its English pages are indexed, you have found a Turkish reviewer, and you have picked a quote policy (Diyanet's written permission, or pages that cite verse references only). Details are in QuranWall's TODO-KAROL.md.
  - **NoteWall stays English.** Most of its money comes from English-speaking countries.
  - The next two items are what to do about Brazil and the Bible texts instead.
- **Brazil: two App Store moves instead of a Portuguese website.** Approve the Portuguese (Brazil) keyword refresh the ASO session plans for after the 12-14 hold. And ask the ASO session to check the Brazil price tier and paywall offer: Brazilian users buy far less often than US users. Both move more money than a translated blog would.
- **Credit the Bible texts in the app (a licence question, only you can decide).**
  - **Bíblia Livre needs a credit.** The app's Portuguese default, Bíblia Livre (BLIVRE), is a Creative Commons Attribution text, and attribution means a visible credit. The app's code has no user-facing credit, only code comments; the Settings screens and the listing weren't checked. Add a credits line, after confirming which licence version applies (sources disagree between CC BY 3.0 Brasil and 4.0).
  - **Two texts are labelled non-commercial.** The source collection labels Schlachter 1951 (German) and Uwspółcześniona Biblia Gdańska (Polish) as "free non-commercial distribution", and FaithWall is a paid app. For each: ask permission, swap to a cleared edition, or accept the risk knowingly.
  - **The Italian Riveduta 1927 file has no recorded source.**
  - **Small fix:** the app's short name "RVR" for the Spanish Reina-Valera 1909 reads as Reina-Valera 1960, a registered mark. "RV1909" avoids that.
- **Vercel: answered 11-19.** The three app sites deploy from a free Vercel Hobby account, not the shared client team. Vercel's Hobby plan is for non-commercial use only, so whether to move them to a paid plan is your call.

## 2026-11-16 evening (v3.1: install cards and measurement, live)

- **Live since about 19:15 (b73c084): the site now asks for the install properly.** Posts outside the control group get an install card in the middle and at the end, with Apple's official badge. On a computer the cards show a QR code and a Copy link button, so a desktop reader can get the app onto their iPhone. On phones a small "Get the app" bar appears after one screen of scrolling. Unknown URLs now return a real 404. The control group keeps its old buttons until p72, not before 12-02, so we can tell whether the cards cost any Google traffic: the hub, six posts, the five pillars and the three comparison pages. QuranWall and NoteWall got the same build brief tonight, and their sessions build it in their own repos.
- **1. Your first campaign read, around 12-15, then monthly.** App Store Connect → App Analytics → Acquisition → Campaigns, plus Sources → Web Referrer. Every App Store link on the site now carries one of 12 fixed campaign tokens: `web-home-hero`, `web-site`, `web-blog-body`, `web-blog-mid`, `web-blog-end`, `web-blog-sticky`, `web-pillar`, `web-cmp`, `web-maker`, `web-random`, `web-smart-banner`, `web-handoff`. Apple lists a campaign only once it has 5 or more first-time downloads in the date range, so an empty list early on means "not enough yet". On the first read, please check whether `web-smart-banner` (Safari's banner at the top of the page) shows up at all; Apple doesn't document it. Then tell the next session which tokens bring downloads. The old `blog-*`, `pillar-*` and `web-sticky-*` tokens are retired, and their history stays in App Store Connect.
- **2. Two minutes on your iPhone.** In Safari, open faithwall.app/blog/bible-verse-lock-screen-iphone. You should see Apple's banner at the top, the install cards, and the "Get the app" bar after one screen of scrolling (it hides over the cards and the footer, and the × closes it). Then, on your Mac, scan the QR code in the end card with the iPhone camera: it should open the App Store listing.
- **3. The App Store listing and the site disagree in five places. Your call on each; until you answer, the site keeps its wording.**
  - The listing says "The full Bible, beautifully readable". Many site pages say FaithWall is not a Bible reader.
  - The listing says "Tell FaithWall what you're walking through". The site never says the app suggests verses.
  - The listing promises widgets "with a fresh verse every day". The site says the widget shows your verse first, then random verses every hour, 8 hours or day.
  - The listing says "rated 4.9". The site shows a rating only from Apple's live data.
  - The listing mentions "every Faith Wallpaper pack". The site never uses the word packs.
  For each one, either the site or the listing is out of date. Tell the next session which.
- **4. Read the EULA once (5 minutes).** `/eula` described NoteWall ("organize their goals, reminders, and notes"): it was copied from the NoteWall site. Its description now uses the Terms page's wording. It's a legal page, so please read it and confirm.
- **5. Were the waitlist testimonials real?** The home page's testimonials, the stock avatars and the newsletter form (which sent nowhere) are gone. If the testimonials came from real people who agreed to be quoted, say so and they come back.
- **6. Does the setup work on iOS 15?** The listing says iOS 15.0 or later, and the site now says so too, with the widget needing iOS 16. The wallpaper is applied through an Apple Shortcut. Please confirm the Shortcut setup works on iOS 15, or tell us the real minimum for the wallpaper.
- **7. How long does setup take?** Some posts say "60-second setup", and the home page says "under 2 minutes". Time it once on a fresh install, and the site will use one number everywhere.
- **8. The sister sites keep their own lists.** QuranWall: retry Request indexing for its four URLs on 11-17, after Google's daily quota stopped it on 11-16. NoteWall: its widget, sale and terms questions. Each repo's TODO-KAROL.md has the details.

## 2026-11-16 (v3 re-aim)

- **v3, 2026-11-16: outreach is off, by your call.** Ignore every pitch, Advent and directory item below, in this section and in the older ones: no pitches, no directory submissions, no link building. Items p64, p30 and p31 are retired, and SEO-STRATEGY §8 and Play 4 are retired. The drafts stay in `outreach/` for the record. The brand KPI stays as measurement only. The new-URL hold is lifted and replaced by a demand test for new posts, day-one links and an indexing brake (SEO-STRATEGY §5, §6). New posts restart this week with p67 (Christmas verses) and p68 (men's lock screens). With nothing eligible, the daily run now does nothing instead of writing a fallback post. The held post `bible-study-group-iphone-tools` stays unpublished: p63 (from 12-02) checks it against the demand test, publishes it only if it passes, and otherwise adds a line here asking you to delete it. The asks below that still stand: the campaign read (item 1 of the v3.1 block) and the hub's first-person testing claim (10-28).

## 2026-11-13 (local autopilot, monitoring pass)

- **For your information: the other "FaithWall" is now on sale.** Adam Johnson's FaithWall (Dead Hidden / The Biblical Man) was an invitation-only iPhone beta on 10-11. It now sells a Scripture-first distraction blocker under the FaithWall name: a live web app, a Chrome extension for buyers and a one-time paid licence. Its pages are deadhidden.org/faithwall and the new faithwall.deadhidden.org. It has no App Store listing yet, but its pages say native phone blocking comes next. Some one-word "faithwall" searches may now be people looking for it, so read the brand KPI with that in mind. Placements are still zero; details are in `outreach/targets.json` (`namesake_check_2026_11_13`).

## 2026-11-05 (manual session: visuals for long posts, a wrong product claim fixed)

- **Optional, your call: two titles say "rotates".** "Daily Scripture Wallpaper iPhone: The Setup That Rotates Without You" and "Rotating Bible Verse Wallpaper iPhone: The Setup That Beats Static". The widget does rotate verses on its own, so they aren't false, and they rank on those words, so they stay unless you want them changed. Their body text now says what rotates.

## 2026-11-04 evening (manual session: fixes landed, two decisions settled)

- **Local only:** the untracked `.agents/skills/faithwall-blog/` folder in your checkout is an old Codex copy of the blog skill. It still has the banned claims ("free", Focus modes). Codex is the only tool that reads it. Delete it, or copy the current `.claude` skill over it, if you still use Codex here.

## 2026-11-01 (local autopilot, p56)

- **CHECK: "ranked and tested" in the prayer roundup's meta description.** p56 left it alone under rule (c). It is the same kind of claim as the hub's method sentence flagged on 10-28: if you didn't test these apps yourself, it should go.

## 2026-10-28 (local autopilot, p54)

- **DECISION: the hub's NLT Bible App row** (a default is set from the 11-16 refresh, see 2026-11-09). p54 re-checked every app on `/blog/best-free-bible-app-iphone` against the iTunes API. Tyndale House has no NLT Bible App on the US App Store. Its only Bible-related listing is Filament Bible, which describes itself as "not a Bible app" but a companion to Filament-enabled print Bibles. Under p54's rule (b), the row now says plainly that the app isn't listed, and every place that called it a live, free, offline app was corrected. The page still ranks "10 Bible apps", and its H2, title and meta say so. A facts-only refresh can't touch those. Your call: drop the row (and edit the count in the H2, title and meta description), or swap in another free single-translation app. Either one is a small queue item.
- **CHECK: one first-person testing claim on the same hub.** The method section says "Every app below was installed fresh on an iPhone". p54 left it alone because it's facts-only. If you didn't do that testing yourself, the sentence breaks the §5 device-claim rule and should be reworded. Only you know whether it's true.

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

## 2026-10-10

- **2026-10-10 (optional): one real lock-screen screenshot for `/blog/scripture-based-prayer-prompts` (fallback post).** It shipped with a reused stock hero (the Jeremy Yap photo from `best-prayer-app-for-iphone`, since there's no Unsplash key locally). Its effort signals are the widget's rotation options, the iOS Customize path and your named judgment call (rotate every 8 hours). It has no device evidence. A screenshot of the FaithWall lock-screen widget showing one of the post's 12 prompt verses (e.g. Psalm 46:10) would be the strongest addition. Drop it in the repo and the autopilot can embed it.

## 2026-10-08

- **2026-10-08 (optional): one real lock-screen screenshot for `/blog/short-bible-verses-for-lock-screen` (p50).** The post shipped with a reused stock hero (the same Anthony Garand photo as `bible-verse-lock-screen-iphone`, because there's no Unsplash key locally) and no device evidence. A screenshot of your own iPhone lock screen with a short verse such as Lamentations 3:23 in the FaithWall widget would be the strongest effort signal the page could carry. Drop it in the repo and the autopilot can embed it.

## Still open — needs your access or your decision

- **HIGHEST-VALUE INFO ITEM (2026-08-06, updated 2026-09-24 — now answerable): open the Search Console generative-AI performance report.** Google's help page now says it reached **all** sites by 2026-08-31 (https://support.google.com/webmasters/answer/16908024), so faithwall.app should have it. Two checks, five minutes: (a) Settings → **Search generative AI** should say "Include" (the default). If it says exclude or inherit-from-parent with exclude, we are invisible in AI Overviews and AI Mode. (b) Performance → the generative-AI report. Screenshot or export it for the next refresh. Why it matters: roughly four impressions in five across the site still carry no identifiable query, and the prayer page is visibly being shown for assistant-style full questions at position 1 with no clicks. This report is the only view into that. If it can be exported, the weekly dump should start pulling it.
- **DECISION (2026-08-17): Google Preferred Sources.** Google extended it into AI Overviews and AI Mode (2026-05-27) and states people are roughly twice as likely to click through to a source they have marked as preferred. Google shipped an official custom button — a script tag plus a `<div google-add-preferred-source-btn></div>` element, auto-localized, with a JS API and a plain deeplink alternative (`https://www.google.com/preferences/source?q=faithwall.app`). Domain-level sites are eligible. Two things needed from you: (a) confirm we appear in Google's source-preferences tool (needs your Search Console/Google account); (b) decide whether we're willing to put a light "add FaithWall as a preferred source" prompt on the site or in the app. That is a brand/UX call, not an SEO one. If yes, the code is about two lines. Given that most of our impressions live in exactly the AI surfaces this operates in, it is still the highest-leverage earned-visibility lever available. **Update 2026-09-24:** Google's Preferred Sources page (updated 2026-09-18) now says a site must be *included* in the Search generative AI setting to show as a preferred source in AI Mode/AI Overviews (https://developers.google.com/search/docs/appearance/preferred-sources). The check in the item above covers this too.
- **PHOTOGRAPHY (2026-08-06): photograph real lock screens of every app on `/best-bible-verse-lock-screen-apps`** (FaithWall, YouVersion, Glorify, Bible Gateway). No competitor in this niche has real device photography — the single biggest trust and differentiation lever on the site's top page (§3 Play 2). Simulator screenshots won't read as authentic. This is also the clean fix for the whole class of problem behind the p21 fabrication incident: the agent cannot produce first-hand device evidence, and your photos are the only thing that can.
- **DECISION (2026-08-22): owned audience.** The site converts nothing it can keep — no email capture, no community channel. Options: a light email capture ("verse pack of the month"), or leaning on the app itself as the owned channel. Product/brand call, yours. Rented attention should land somewhere we keep.
- **DATA EXPORT WANTED (2026-08-22): original data study.** The strongest citable asset we could own is aggregate, anonymized app data — most-set verses by month, verse-category popularity by season. Nobody in this niche has published anything like it. If you can export aggregate numbers (no user-level data), a `data-study` queue item turns it into a citable page.
- **APP-SIDE (2026-08-22): App Store review velocity.** Review prompts timed to a genuine win-moment (e.g. after the 7th daily verse shown) feed the same brand composite §8 is built on. Flagging, not prescribing.
- **ENVIRONMENT (2026-08-16): the cloud session's outbound network policy blocks api.unsplash.com** (403 from the proxy, confirmed as a policy denial). Posts fall back to reusing an on-theme image, so nothing breaks. Needs your access to the environment config. Not blocking anything. **Update 2026-10-10:** the local autopilot has no `$UNSPLASH_ACCESS_KEY` either, so the last two fallback posts reused stock heroes from older posts. Setting the key locally would give new posts their own images. Related and worth knowing: the same policy blocks the cloud agent from reading any target page directly, which is why contact-route resolution has moved to this weekly local refresh. **Update 2026-11-02:** the same policy also blocks `itunes.apple.com` and `apps.apple.com`. p54 and p56 each lost a day to it and only closed because the local run went first. Any future item that needs live App Store facts will hit it again unless the refresh verifies the facts first, as it did for p57. Allowing those two hosts in the cloud environment's network policy would end it.

## Informational — no action

- **Prayer-spoke SERPs carry mixed intent (found by p26, 2026-09-07).** The live SERPs for both `how-to-set-prayer-alarms-iphone` and `prayer-reminders-on-iphone` are dominated by Islamic salah-time content (Muslim Pro, Athan, Azan-alarm apps) rather than Christian-prayer results. Worth knowing if either page's impressions ever look anomalously low relative to position — the query itself carries intent no on-page fix reaches.
- **Competitor noted (p22, 2026-08-31): abbeybible.com ("Abbey").** Publishes self-ranked "best lock screen Bible app" roundups placing itself #1 ahead of FaithWall on our exact head-term family — the same self-promotional pattern as FaithLock/Psalmo/Prayhouse. Not an outreach target; a competitor worth knowing about. See `outreach/targets.json`.
