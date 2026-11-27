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
