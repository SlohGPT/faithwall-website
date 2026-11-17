# TODO — Karol

Items the SEO autopilot can't do itself. Newest first. Resolved items are deleted at each weekly refresh, not archived here — the queue and `SEO-STRATEGY.md` carry the history.

## 2026-11-17 (autopilot: p67, the Christmas verses post)

- **Request indexing once the merge gate has deployed it (1 minute).** The new URL is `/blog/christmas-bible-verse-lock-screen-iphone`. In Search Console → URL Inspection, click **Request indexing** once. It is one of the two posts the indexing brake watches (with p68), and Advent starts on 11-29.
- **If you merge or retire any of the five daily-change posts (item 1 below), keep the Christmas link.** `best-christian-wallpaper-app-iphone` and `scripture-wallpaper-for-iphone-free` now carry the new post's day-one links. Whichever page absorbs either of them should keep a link to `/blog/christmas-bible-verse-lock-screen-iphone`.

## 2026-11-17 (research check: owner items)

Checked against primary sources on 2026-11-17. Four small items, only you can do them (item 4 decided the same day).

- **1. Bing Webmaster Tools (10 minutes, then monthly).** Verify faithwall.app if it isn't verified yet. Then open AI Performance (public preview since 2026-02-10: citations, cited pages and sample grounding queries) and note the citations once a month.
- **2. Search Console's Generative AI performance report: export it by hand once a month (5 minutes).** It is in the UI only (rolled out to all sites as of 2026-08-31) and has no API: we tested the service account, and every AI `searchType`/`type` value returns HTTP 400. Save each export into the private faithwall-gsc folder.
- **3. App Store Connect idea, after the 12-02 read-out: custom product pages.** Different App Store page versions for different traffic sources. Don't start before the read-out.
- **4. Cloudflare: unblock GPTBot, ClaudeBot and PerplexityBot (decided 2026-11-17, your click, 5 minutes).** You chose "Unblock all three". Re-checked 2026-11-17 before the change: all three get 403 on faithwall.app, while OAI-SearchBot, ChatGPT-User, Perplexity-User and Claude-SearchBot get 200 (QuranWall and NoteWall return 200 to all). Steps: Cloudflare dashboard → faithwall.app → AI Crawl Control, set GPTBot, ClaudeBot and PerplexityBot to Allow, and turn off the managed robots.txt (its `Content-Signal` line is also why Lighthouse SEO is 92 instead of 100). Afterwards we verify with `npm run kw -- geo-probe` or a curl per bot user agent. This replaces the open Cloudflare questions in the sections below (the 11-16 item 8 and the weekly-refresh note): the decision is made.

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
- **4. Cloudflare AI Crawl Control: keep AI search allowed (10 minutes per Cloudflare site).** This updates the Cloudflare part of item 8 in the evening list.
  - **Why it matters now:** the ASO session found that ChatGPT's iPhone app is the biggest single referrer of App Store downloads for all three apps. For FaithWall and QuranWall it brings more than all websites together. App Store search is still much bigger.
  - **What must never be blocked:** ChatGPT's search crawler (OAI-SearchBot), which finds pages, and ChatGPT-User, which fetches a page when someone asks about it.
  - **What to check:** in Cloudflare → AI Crawl Control, the Search policy is Allow and Agent is not Block.
  - **Your decision:** whether to block the training crawlers (GPTBot, ClaudeBot).

  From now on, the weekly refresh runs the tool's `geo-probe`, which reads the live robots rules and each bot's response, and puts a blocked search bot on this list.
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
- **Vercel: which account hosts the three app sites?** faithwall.app, notewall.info and quranwall.com don't appear in the shared client Vercel team's usage report. FaithWall's and NoteWall's repos are linked to two other Vercel accounts, and QuranWall's has no link file. Check in the dashboard which account and plan each one deploys from. Vercel's Hobby plan is for non-commercial use only.

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
- **8. Still open from earlier today:** the Cloudflare AI-crawler decision (re-checked at 19:20: GPTBot and ClaudeBot still get a 403, while ChatGPT search's crawler and Googlebot get through), and Request indexing for the three unindexed October posts.
- **9. The sister sites keep their own lists.** QuranWall: retry Request indexing for its four URLs on 11-17, after Google's daily quota stopped it on 11-16. NoteWall: its widget, sale and terms questions. Each repo's TODO-KAROL.md has the details.

## 2026-11-16 (v3 re-aim)

- **v3, 2026-11-16: outreach is off, by your call.** Ignore every pitch, Advent and directory item below, in this section and in the older ones: no pitches, no directory submissions, no link building. Items p64, p30 and p31 are retired, and SEO-STRATEGY §8 and Play 4 are retired. The drafts stay in `outreach/` for the record. The brand KPI stays as measurement only. The new-URL hold is lifted and replaced by a demand test for new posts, day-one links and an indexing brake (SEO-STRATEGY §5, §6). New posts restart this week with p67 (Christmas verses) and p68 (men's lock screens). With nothing eligible, the daily run now does nothing instead of writing a fallback post. The held post `bible-study-group-iphone-tools` stays unpublished: p63 (from 11-24) checks it against the demand test, publishes it only if it passes, and otherwise adds a line here asking you to delete it. The asks below that still stand: request indexing for the unindexed October posts, the campaign review, Cloudflare, and the hub's first-person testing claim.

## 2026-11-16 (weekly refresh)

- **Google is rolling out a core update. It began on 11-10 and can take two weeks.** No page has dropped. Through 11-15 the generator and the pillar edged up, and the hub and the money page are flat. Nothing for you to do. The hub gets no edit until the rollout is over.
- **The hub's NLT row: the default now applies.** No line was added here, so p66 swaps the row from 11-25, after the core update. One thing differs from the 11-09 note. The App Store has no other single-translation publisher app besides the ESV app the list already ranks, so the replacement is Literal Word: Bible & Lexicon. Its listing says it is free, has no ads, works offline and carries five word-for-word translations. The new row will say it was added from its App Store listing and wasn't part of the original hands-on pass. Add a line here before 11-25 if you'd rather drop the row, keep it as it is, or name another app.
- **One of the four October posts is indexed.** Google indexed `/blog/lock-screen-verse-for-grief` on 11-12, five days after the in-body links went live. The other three are still unknown to Google, so the 5-minute ask stands for them: in Search Console → URL Inspection, click **Request indexing** for `/blog/short-bible-verses-for-lock-screen`, `/blog/scripture-based-prayer-prompts` and `/blog/bible-app-vs-olive-tree`. If the short-verses post is still unindexed on 11-23, p63 folds it into the pillar from 11-24. Don't use the karchi service account's Indexing API for these, because Google limits it to job-posting and livestream pages.
- **(Superseded by the v3 block above: the new-URL hold is lifted. The publish and delete steps below for the held post still work, but p63 decides it from 11-24.)** The new-URL hold stays. It lifts once two of those four posts are indexed, and one is. Until then the held post `bible-study-group-iphone-tools` stays unpublished. To publish it anyway, run `git revert c881e9d` (or set the flag to `true` yourself), change `date`/`datePublished` to the release day in `blogPosts.json` and the post JSON, run `node scripts/generate-sitemap.mjs`, push, then submit `https://faithwall.app/blog/bible-study-group-iphone-tools` to IndexNow. To drop it, delete the post's entry and its JSON.
- (Superseded by item 1 of the v3.1 block above: the campaign tokens changed on 11-16.) **Overdue since mid-October, and it now decides more: the App Store Connect campaign review (SEO-STRATEGY §10).** The generator page is now the site's largest source of clicks as well as of visibility, and the money page takes almost none. Under Sources → Campaigns, check which `web-*`, `blog-*`, `pillar-*` and `web-sticky-*` campaigns produced downloads since 2026-10-02. If the generator's clicks become installs, the page earns real work. If they don't, it stays a feeder.
- **Cloudflare is still blocking AI crawlers (re-checked today).** The live robots.txt still starts with Cloudflare's managed block (`ai-train=no`, plus `Disallow: /` for GPTBot, ClaudeBot and others), and the edge answers GPTBot and ClaudeBot with a 403. OAI-SearchBot, PerplexityBot, Googlebot and Bingbot get a 200, so Google, Bing and ChatGPT answers are not cut off. **To undo it:** in the Cloudflare dashboard for faithwall.app, turn off the AI-crawler block (AI Crawl Control, or Security → Bots) and the managed robots.txt. **If it's deliberate**, add a line here and the refresh will stop flagging it.
- **For your information: `/faithwall-vs-hallow` has not shown in search since 11-05.** It is indexed, returns 200, and Google re-crawled it today. Most of what it used to show for was a second listing under your brand name, so this looks like Google dropping that extra listing, not a fault on the page. The refresh keeps watching it.
- **Brand KPI, for your information:** the one-word "faithwall" query is still at its old baseline and still ranks first, with a slightly better latest week. Branded share of identifiable clicks fell again, because generator clicks grew. The other FaithWall going on sale (see 2026-11-13) makes this number harder to read. Nothing is credited to outreach.
- **App Store re-check:** the listing is unchanged ("Lock Screen Bible Verse", v2.3.2, iOS 15.0 or later). The iTunes search for "faithwall" still returns your app first and lists no app from the other FaithWall.
- **Done 11-16 evening (b73c084), nothing for you to do:** p65's two fixes. The sitewide app schema is gone from `index.html` (one app schema now, on the homepage, iOS 15.0), and the `/faithwall-vs-hallow` verses row is corrected.
- **Google-change watch:** the core update is the only new change that matters here. One note for the Cloudflare decision: Google says it plans to support a shared robots.txt control for AI training in early 2027. It doesn't affect Search. **Still proposed from 10-26 (your call):** Google's generative-AI content guide (updated 10-01) asks sites to fact-check AI output by hand, titles, meta descriptions, structured data and alt text included, and suggests telling readers how the content was made. Options: a short, honest "how these pages are made" line on the About page, and/or a weekly spot-check by you of one autopilot page.

## 2026-11-13 (local autopilot, monitoring pass)

- **For your information: the other "FaithWall" is now on sale.** Adam Johnson's FaithWall (Dead Hidden / The Biblical Man) was an invitation-only iPhone beta on 10-11. It now sells a Scripture-first distraction blocker under the FaithWall name: a live web app, a Chrome extension for buyers and a one-time paid licence. Its pages are deadhidden.org/faithwall and the new faithwall.deadhidden.org. It has no App Store listing yet, but its pages say native phone blocking comes next. Some one-word "faithwall" searches may now be people looking for it, so read the brand KPI with that in mind. Placements are still zero; details are in `outreach/targets.json` (`namesake_check_2026_11_13`).

## 2026-11-05 (manual session: visuals for long posts, a wrong product claim fixed)

- **Optional, your call: two titles say "rotates".** "Daily Scripture Wallpaper iPhone: The Setup That Rotates Without You" and "Rotating Bible Verse Wallpaper iPhone: The Setup That Beats Static". The widget does rotate verses on its own, so they aren't false, and they rank on those words, so they stay unless you want them changed. Their body text now says what rotates.

## 2026-11-04 evening (manual session: fixes landed, two decisions settled)

- **Local only:** the untracked `.agents/skills/faithwall-blog/` folder in your checkout is an old Codex copy of the blog skill. It still has the banned claims ("free", Focus modes). Codex is the only tool that reads it. Delete it, or copy the current `.claude` skill over it, if you still use Codex here.

## 2026-11-03 (p28 — Advent 2026 outreach drafts ready, send-by 2026-11-16)

- **Fresh restart from main, clean of the quarantined text.** Five seasonal Advent follow-up drafts now sit in `outreach/advent-2026/` (bibleversedaily, warmpeach, learnofchrist, biblegeeks, healthyspirituality — the full Tier-1 five). Each names "Lock Screen Bible Verse" (the App Store listing name since 2026-10-18) next to FaithWall, as the 11-02 refresh required, and each was checked line-by-line against the Product facts ban list (no "costs nothing"/"no cost"/"free" other than "free to download", no price, no trial length) — the exact failure that got branch `5658b65` rejected.
- **Send the original Tier-1 five first.** `outreach/{bibleversedaily,warmpeach,learnofchrist,biblegeeks,healthyspirituality}.md` are still unsent after two months — nothing has ever gone out to any of them, and nothing has declined. Those go out before these Advent follow-ups; the Advent drafts are a seasonal add-on to use alongside or shortly after, not instead of, the standing pitch.
- **No Advent/Christmas history confirmed for any of the five sites.** WebSearch (cloud sandbox, no direct page fetch) found no dedicated Advent or Christmas devotional-app roundup on any of bibleversedaily.org, warmpeach.com, biblegeeks.fm or healthyspirituality.org, and only incidental Advent mentions inside other apps' reviews on learnofchrist.com. Each draft says so plainly rather than claiming a seasonal callback that isn't there.
- **healthyspirituality.org's contact route is still unresolved** — the site 403s every automated fetch from both environments. Confirm the author's email at https://healthyspirituality.org/blog/biography/ in a normal browser before sending either draft to that site (unchanged from the standing Tier-1 TODO).
- Send-by for the Advent angle: **2026-11-16**, so a reply has time to land before Advent begins 2026-11-29.

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
- **ENVIRONMENT (2026-08-16): the cloud session's outbound network policy blocks api.unsplash.com** (403 from the proxy, confirmed as a policy denial). Posts fall back to reusing an on-theme image, so nothing breaks. Needs your access to the environment config. Not blocking anything. **Update 2026-10-10:** the local autopilot has no `$UNSPLASH_ACCESS_KEY` either, so the last two fallback posts reused stock heroes from older posts. Setting the key locally would give new posts their own images. Related and worth knowing: the same policy blocks the cloud agent from reading any target page directly, which is why contact-route resolution has moved to this weekly local refresh. **Update 2026-11-02:** the same policy also blocks `itunes.apple.com` and `apps.apple.com`. p54 and p56 each lost a day to it and only closed because the local run went first. Any future item that needs live App Store facts will hit it again unless the refresh verifies the facts first, as it did for p57. Allowing those two hosts in the cloud environment's network policy would end it.

## Informational — no action

- **Prayer-spoke SERPs carry mixed intent (found by p26, 2026-09-07).** The live SERPs for both `how-to-set-prayer-alarms-iphone` and `prayer-reminders-on-iphone` are dominated by Islamic salah-time content (Muslim Pro, Athan, Azan-alarm apps) rather than Christian-prayer results. Worth knowing if either page's impressions ever look anomalously low relative to position — the query itself carries intent no on-page fix reaches.
- **Competitor noted (p22, 2026-08-31): abbeybible.com ("Abbey").** Publishes self-ranked "best lock screen Bible app" roundups placing itself #1 ahead of FaithWall on our exact head-term family — the same self-promotional pattern as FaithLock/Psalmo/Prayhouse. Not an outreach target; a competitor worth knowing about. See `outreach/targets.json`.
- **Four additional outreach candidates surfaced and not yet drafted:** thesweetsetup.com (established independent iOS app-review publication), thecripplegate.com (independent pastoral blog), margaretfeinberg.com (independent published-author blog), codeinfaith.com (independent 2026 Bible-widgets roundup, added 2026-10-11). A future `outreach-prep` wave, after the current Tier-1 five actually ship.
