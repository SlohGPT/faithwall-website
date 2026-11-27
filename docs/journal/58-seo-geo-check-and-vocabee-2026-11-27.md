# 58 — SEO and GEO check across the three sites, today's runs, Vocabee domain, 2026-11-27

Session type: interactive, Karol's asks, Friday 11-27 afternoon. The repo is public, so this entry describes performance qualitatively; the numbers stay in the session and in the private notes.

## What was asked

Karol, in his words: check "if the SEO of all of the projects we changed … is improving", whether "the AI SEO, so GEO, is also improving", and "if today's run actually ran, because I don't think so". Then: "I'm thinking of improving the SEO and building the whole SEO flow for vocabee as well … We should then buy a new domain specifically for it because right now it's on my company domain. What do you think?"

## What was found

### Today's runs: the autopilots fired but did nothing

- All three local autopilots fired on time (QuranWall 07:43, FaithWall 08:08, NoteWall 08:32 CET). Each session ended at its first reply with Claude's 5-hour usage limit message (reset 09:10). Nothing ran, nothing was committed.
- The three merge gates ran after the reset (10:11, 10:58, 11:24) and correctly found no branch.
- First time in the last ten days: every other autopilot and gate run since 11-18 completed. The limit was used up by a long overnight session in another project, not by the SEO tasks.
- Entry 57's guess that today's autopilot "may have fired in the other account" was wrong. Runs from both accounts write their transcripts to the same local folder, and today's transcript shows the limit message.
- Cost of the lost day: none for FaithWall (queue starved until p69 on 12-01) or NoteWall (every item held until 12-01). QuranWall did lose a working day, because it had several eligible items. Tomorrow's run picks them up as usual.

### Google (Search Console, weekly series since August)

- **FaithWall: improving.** Clicks per day have roughly tripled since early August, with steady growth through November. Impressions grew much faster than clicks over the last 28 days, average position held. The 11-19/20 core-update dip was brief, and the current week's partial data runs level with the best week on record. Branded "faithwall" searches stay small and noisy.
- **NoteWall: improving again.** It peaked in late September, stayed flat through October and early November (entry 49's "flat"), and since 11-16 has been back at or above the September peak, with record impressions.
- **QuranWall: too early to call.** The property has only a few weeks of data and a handful of clicks. Nothing to read yet.

### GEO (Bing Webmaster Tools, AI Performance: Copilot citations)

- **NoteWall: clearly improving.** Each 30-day window is higher than the last, roughly doubling from the late-August window. The grounding queries are mental-health reminders and wall notes.
- **FaithWall: flat, not improving.** The three 30-day windows since late August are about level, and the newest is slightly lower (the last days of Bing's sample may still fill in). Entry 49's "rising" read was a single-step comparison and doesn't hold over three months. One grounding query, "bible verse lock screen", carries the visible share.
- **QuranWall: no citations yet** since the site was added to Bing on 11-18.
- Bing's report is the only direct AI-citation measure we have. ChatGPT's referrals show up only on the App Store side (see the memory note on ChatGPT as top App Store referrer).

### Vocabee (iOS app "Word of the Day: Vocabee", repo `vocab-app`)

- The site is static HTML (`web/`) on Vercel at `vocabee.karchi.xyz`. The app's terms, privacy and support links and the App Store seller URL point there.
- Google barely knows it: URL Inspection says the homepage is "unknown to Google", and only the support page has had a few impressions. A move now costs nothing in search equity.
- **The name is crowded.** The US App Store has at least four other apps called Vocabee or VocaBee, three of them on their own vocabee-style domains. `vocabee.app` belongs to someone else, and `vocabee.com` is parked at a domain seller. Whois showed `vocabee.io`, `vocabee.co` and `getvocabee.com` unregistered today. Confirm at the registrar before buying.
- `vocab-app` `docs/STATE.md` notes that the karchi.xyz DNS sits at Porkbun, which blocked an R2 custom domain for sentence audio. A new domain registered on Cloudflare removes that blocker too.

## What was decided, and why

Nothing was changed. This was a read-only check plus advice; the Vocabee decision is Karol's. The advice given:

- **Own domain: yes, and now,** before Google indexes the subdomain and before any links point at it. A subdomain of the company domain gets no ranking help from it. It ties the app's brand to the company site, and it makes a later move a redirect migration. Suggested `getvocabee.com` (a .com, clear, unregistered), with `vocabee.io` as the short alternative. Registered on Cloudflare, which also fixes the audio domain.
- **Don't build the SEO around the brand word.** With five same-named apps, "vocabee" will stay contested. The site should win feature-intent queries that match what the app actually does (word-of-the-day and vocabulary widgets on the lock screen and home screen). That's the same shape that works for FaithWall ("bible verse lock screen") and NoteWall (lock-screen reminders).
- **Order:** domain → site moved with 301s from the subdomain → app links and App Store Connect URLs updated in the next build → Search Console and Bing properties → a small set of core pages → only then the autopilot and merge gate. That makes a fourth daily pair. Today showed the morning slots already share one usage window, so schedule it with that in mind.

## What was built

Only this entry and the hub update. Analysis scripts lived in the session scratchpad, not in the repo.

## How it was verified

- Run state: the scheduled-task list (lastRunAt today for all six tasks), the run lists, and the transcripts of today's three autopilot sessions (one reply each: the limit message). The last ten days of runs were tabulated the same way.
- Google: Search Console API, daily rows from 120 days back to 11-25, grouped by week, plus a "contains brand" query filter.
- GEO: Bing AI Performance, 3-month daily series for each site, read in Karol's Chrome.
- Vocabee: Search Console for the karchi.xyz property (pages and URL Inspection), the iTunes Search API, DNS and whois for candidate domains, live curl of the current URLs.

## Still open

- Karol: decide the Vocabee domain and buy it (Claude doesn't make purchases). Then a Vocabee session in `vocab-app` does the move and the SEO setup.
- FaithWall GEO is flat. Worth a look at the 12-02 cohort read-out: which pages Copilot cites, and whether the answer-first passages on the money pages need work. NoteWall's growth shows what works.
- The merge gates don't notice when an autopilot dies on a usage limit. They read it as a quiet or starved day. A check for the limit message in the day's autopilot transcript would make that visible.

## Update, afternoon: today's runs re-run, Vocabee domain prices

Karol: "please continue today's run here on all of the apps", and for Vocabee: "What domain should it be? Check the prices using pork bun or some other Black Friday deal".

### Runs (started at about 14:57 CET with the tasks' own "Run now", same prompts and approvals)

- FaithWall autopilot: succeeded, nothing due (all 13 pending items open on 12-01 or later). Nothing to merge.
- NoteWall autopilot: succeeded, nothing due (all 20 pending items open on 12-01 or later). Nothing to merge.
- QuranWall autopilot: did p24, a depth pass on the best-dhikr-app roundup: two tables from live listings, seven ranked apps, a four-question FAQ (`9424202`). The QuranWall merge gate then ran by hand, passed every check, merged it (`28f48ab`) and wrote its log (`bb78b12`). The page answers 200 live with both tables and the FAQ. The lost QuranWall day is made up, and tomorrow's 07:43 run starts from a clean queue.
- `claude/qw-no-price` on the QuranWall remote is an old 11-17 branch, not bot output; the gate already treats it that way.

### Vocabee domain

Read 11-27 in Karol's Chrome (Porkbun search and Porkbun's public price API, Spaceship search), plus Black Friday round-ups from a web search:

- Free and sensible: `getvocabee.com`, `tryvocabee.com`, `vocabee.net`, `vocabee.day`. Taken: `vocabee.app`, `vocabee.com` (parked), `vocabee.org`, `vocabee.xyz`.
- `.com` costs about the same everywhere and keeps renewing at that price: Porkbun charges the same each year with a $1 first-year coupon and no extra Black Friday cut on .com. Spaceship shows a slightly lower first year and a slightly lower renewal, and a reported Black Friday code may cut the first year further (unverified). Cloudflare sells at cost with no sale.
- First-year bait to avoid: `.co`, `.io`, `.xyz`, `.online` and similar look cheap for year one and renew at several times the price.
- **Recommendation: `getvocabee.com`**, bought at Porkbun (Karol already has the account there and karchi.xyz lives there; the Spaceship saving is a few dollars over three years). Point its nameservers at a free Cloudflare zone so the sentence-audio R2 custom domain works. Runner-up: `vocabee.day`, which echoes the app title "Word of the Day: Vocabee", renews flat, but is an unusual ending people won't guess.
- Karol buys it himself; Claude doesn't purchase.

### Update, evening: cheapest way to buy getvocabee.com

Karol: "Check for the Black Friday coupon in Spaceship or something. I don't care which organization it is … I'm just about price."

- Spaceship, read on its own site: `getvocabee.com` costs $9.68 for the first year including the ICANN fee, with no code; it renews at $10.68 plus the fee, the lowest renewal seen. Spaceship's site shows no Black Friday banner. The reported code COM67 could not be tested, because Spaceship asks for a login before it applies any promo code, and Claude doesn't sign in for Karol. One coupon site said it expired on 11-19. The domain was left in the browser's anonymous Spaceship cart; nothing was bought.
- Michael Cyger's curated Black Friday list (GitHub) gives these first-year .com deals: Atom.com $5.00 with BFCOM until 12-07, renewing at $16.20; Name.com $6.99 until 11-30, renewing at $21.99; Namecheap $8.98 with THEGAMESTLD26, renewing at $15.98. All are first-year only. Spaceship's COM67 isn't on the list.
- Porkbun: $10.81 for the first year with the $1 code, then $11.81.
- Cheapest over three years: Spaceship with COM67, if the code works once Karol is logged in, at about $26. Next, Atom at $5 followed by a transfer to Spaceship before the first renewal, at about $27. Spaceship without a code costs about $31, Porkbun about $34. Name.com and Namecheap cost more over time because of their renewals.
- Advice: open a Spaceship account, put `getvocabee.com` in the cart and try COM67. If the code is rejected, buy it there anyway at $9.68, since its renewal is the cheapest. Atom saves about $5 only if the domain is moved before its $16.20 renewal.

- **Decided (Karol, evening): "Okay, let's do it."** `getvocabee.com` at Spaceship, one year. The cart in Karol's Chrome holds only that domain: 1-year registration, free privacy, total $9.68 before any code, no add-ons. Karol signs in, tries COM67 and checks out himself.
- **Bought (Karol, 15:26):** `getvocabee.com` at Spaceship for $3.80 with COM67 (sub total $10.58, savings $6.78). 1-year registration, auto-renew on (yearly), free privacy. Next: a Vocabee session in `vocab-app` moves the site to it.

## Update, late afternoon: today's runs confirmed, Vocabee move checked

Karol: "did the today's run finish on all of them … so that everything is fine?"

- **Runs: yes, all finished.** The task run lists show today's re-runs as succeeded: FaithWall and NoteWall autopilots found nothing due (their queues open on 12-01), QuranWall did p24 and its merge gate merged it. No autopilot branch is left on any remote, and every checkout is clean and level with `origin/main`. The three homepages and the QuranWall p24 page answer 200; p24 serves its new listing-facts table and today's `dateModified`. The QuranWall gate's IndexNow submit got 200. Tomorrow's runs start from clean queues.
- **Vocabee move (session in `vocab-app`, commits `de9658f`, `61343f7`, `8e96989`, `1546a6c`): checked, works.** `getvocabee.com` and its five pages, `robots.txt` and `sitemap.xml` answer 200 with the new canonical and og:url. `www` and every old `vocabee.karchi.xyz` path redirect permanently to the same path on the new domain, query kept. Nameservers are Cloudflare's, set at Spaceship. The service account sees `sc-domain:getvocabee.com` as a restricted user and the sitemap with no errors. The site is hosted on Karol's free GEEflies Vercel team, not the billik client team.
- Still open there, both in `vocab-app`: the App Store Connect URLs change with the next app version (Karol's OK), and a second session is moving the sentence audio to `audio.getvocabee.com` (its `Config.swift` change is not committed yet).
- **Later: the audio move is done too.** The audio session committed and pushed `6ef95b2`, so the app now loads sentence audio from `audio.getvocabee.com`. One real sound file fetched from there answers 200. The old r2.dev address stays on, because version 1.0 and build 6 still use it. Left for Karol in `vocab-app`: the App Store Connect URLs with the next version, and, if he wants, deleting the unused `vocabee-audio` Worker and its old upload token in Cloudflare.

## Update, evening: Vocabee gets the blog factory and a design pass

Karol: "implement all the like blog factory and everything we also have on the other website to this website as well … more free tools, whatever people need", then on the design: "Everything is completely up to you, boss."

- All of this work is in the private `vocabee-website` repo; its journal entries 01 to 05 hold the details. Nothing changed in FaithWall, QuranWall, NoteWall or `vocab-app`.
- **getvocabee.com now runs on the sister sites' stack**, and the same session rebuilt it from vocab-app's static page:
  - free tools (word of the day, random word generator, wallpaper maker, vocabulary test);
  - the SEO foundation (strategy, queue, keyword engine 1.2.0, link-graph 1.1.0, cover engine);
  - a blog with three launch posts.
- **Word accuracy** replaces the scripture checks. Every definition is copied verbatim from the app's word list, with its licence named (WordNet, Wiktionary, CMU).
- **A design pass** went live too: a new blog index and post template, an animated mobile menu that respects Reduce Motion, and a dictionary-style word card. Live commit `4ee7a43`.
- **A fourth daily pair** (Vocabee autopilot 13:20, merge gate 14:30, refresh Mondays 16:00) starts 11-28. It runs in the afternoon so it doesn't share the morning usage window. Vocabee has no git deploy, so its gate runs the production deploy itself and checks `/build.txt` against main.
- Karol: set the permission mode on the three Vocabee tasks (it was not saved at creation), then Request Indexing for the blog. The rest is in that repo's `TODO-KAROL.md`.
