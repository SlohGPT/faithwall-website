# Internal links and SEO/GEO pass, shared by FaithWall, QuranWall and NoteWall (2026-11-17)

Karol, 11-17: do "everything that you need to do to actually really maximize the GEO and SEO impact of these websites": more links between existing pages, more blog links in the navigation, more links throughout. Strategy v3 has no backlinks (journal 39), so the internal link graph and clean page signals are the main levers we control. This file is the shared brief. Each site runs the same pass in its own repo and session.

## The tool: `scripts/link-graph.mjs` 1.0.0

Dependency-free Node. Copy it byte for byte from this repo, then check the copy against the git blob, the same way as the keyword engine:

```
git -C ../faithwall-website-main show <commit>:scripts/link-graph.mjs > scripts/link-graph.mjs
shasum -a 256 scripts/link-graph.mjs     # must match the prefix in this repo's journal
```

```
node scripts/link-graph.mjs --live https://<site>                 # crawl every sitemap URL on the live site
node scripts/link-graph.mjs --dist dist --base https://<site>     # same checks on a local build, before the push
  --json   full report     --min-contextual 3     --max-depth 3
```

- **Pages and links.** The pages are the sitemap's URLs. A link is an `<a href>` to the same host in the served HTML, so JS-only links don't count. That is deliberate: crawlers see the same thing.
- **Template links** are the targets linked from more than half of the pages, such as the header and footer. Every other link counts as contextual. Template targets are exempt from the contextual target, because they are one click from everywhere.
- **FAIL** (exit 1):
  - a sitemap URL that isn't 200;
  - an orphan, meaning a page with no internal link in;
  - a page unreachable from `/`;
  - a page more than 3 clicks deep;
  - a non-legal page with fewer than 3 contextual links in;
  - a broken internal link;
  - a sitemap page that is noindex or canonicalises elsewhere.
- **WARN** (doesn't fail):
  - a title missing or over 65 characters;
  - no meta description;
  - an H1 count other than 1;
  - invalid JSON-LD;
  - a non-home page without `BreadcrumbList`;
  - a post without Article/BlogPosting or `dateModified`;
  - `llms.txt` not listing a page.

## Baseline, live, 2026-11-17

| | FaithWall | QuranWall | NoteWall |
|---|---|---|---|
| Pages in sitemap | 57 | 16 | 112 |
| Max click depth from home | 2 | 2 | **5** |
| Median contextual links in | 7 | 4 | 3 |
| Orphans | 0 | 0 | **11** |
| Unreachable from home | 0 | 0 | **18** |
| Deeper than 3 clicks | 0 | 0 | **12** |
| Under 3 contextual links in | 1 | 2 | **44** |
| Broken internal links | 0 | 0 | 0 |
| Titles over 65 characters (WARN) | 24 | 2 | 89 |
| Non-home pages without BreadcrumbList (WARN) | 1 | 2 | 0 |
| Pages `llms.txt` doesn't list (WARN) | 47 | 9 | 101 |
| AI crawlers (GPTBot, ClaudeBot, OAI-SearchBot, PerplexityBot) | **GPTBot and ClaudeBot get 403** (Cloudflare managed robots.txt and bot rule) | 200 to all | 200 to all |

- **FaithWall:** `/blog/faithwall-vs-glorify` has 2 contextual links in. `/about/karol-billik` has no BreadcrumbList. A Cloudflare email-obfuscation link (`/cdn-cgi/l/email-protection`) appears on every page; the tool ignores `/cdn-cgi/`.
- **QuranWall:**
  - `/blog/quran-reading-plan-app-iphone` has 1 contextual link in, and `/blog/best-dhikr-app-for-iphone` has 2.
  - The two pages without BreadcrumbList are named by `--json`.
- **NoteWall:**
  - The 11 orphans are blog posts that nothing links to, the blog index included. 18 posts can't be reached from home at all. That is the biggest single gap across the three sites.

## What to change, in order of impact

1. **Every post reachable in two clicks.**
   - The blog index lists every published post as a real `<a href>` in the server-rendered HTML.
   - No "load more" button, no client-only pagination, no list cut to the newest N.
   - If the list is long, group it by topic cluster: one H2 per cluster, each linking its pillar or hub, so the index also works as a topic map.
2. **A related-guides block on every post that spreads links evenly.**
   - Show 3 or 4 posts from the same cluster.
   - Pick them by position, for example the next 3 posts after this one in the cluster list, wrapping around. Don't take "the first 3 of the cluster": that hands every related link to the same three posts and leaves the rest with none, which is what FaithWall's `getRelated` does today.
   - The anchor is the target post's title.
   - Add one link up to the cluster's pillar or hub page.
3. **Pillar and hub pages link to every post in their cluster,** not only to a featured six.
4. **Breadcrumbs** on every non-home page: visible Home › Cluster › Page, plus `BreadcrumbList` JSON-LD.
5. **Navigation.**
   - The header stays short: Blog or Guides, FAQ, and the install button. A long header hurts the phone layout, and the footer already gives crawlers every hub.
   - The footer has one column per topic cluster, linking the pillar or hub and optionally its 3 to 5 strongest posts.
   - Both are server-rendered `<a href>`.
6. **In-body contextual links:** 2 to 4 per post, to the most closely related guides. The anchor is the target's main keyword phrase, written into a sentence that reads naturally. Only on pages that no control group holds (see the rules below).
7. **`llms.txt`.**
   - Keep the curated header (entity sentence, key facts, pricing wording from the facts file).
   - Add a "Guides" section that lists every published guide (title, one-line summary, URL), grouped by cluster.
   - Generate that section at build time from the post data, so it can't go stale.
   - It is cheap, and AI agents that fetch it get the whole map. Its effect on citations is unproven, so it comes after items 1 to 6.
8. **Titles over 65 characters:** shorten them only on pages that no control group holds, with an annotations row for each. Otherwise they wait for the read-out.

## GEO (answer engines)

- **Crawler access comes first.**
  - robots.txt and the CDN must let these through: OAI-SearchBot, ChatGPT-User, GPTBot, PerplexityBot, ClaudeBot, Claude-SearchBot, Claude-User, Google-Extended and Applebot-Extended.
  - ChatGPT is the biggest single App Store referrer for all three apps, so never block OAI-SearchBot or ChatGPT-User.
  - Check with `npm run kw -- geo-probe`, or with `curl -A '<bot UA>' -I https://<site>/`.
  - FaithWall is the only site that blocks: GPTBot and ClaudeBot get 403. The block is a Cloudflare dashboard setting, so it is Karol's click (TODO-KAROL).
- **Answer first:** every guide opens with a 40–60 word direct answer right under the H1, followed by the detail. Apply it on new pages and on pages that no control group holds.
- **One entity sentence:** "<App> is an iPhone app that …", taken from the facts file and identical on the home page, the about page and `llms.txt`.
- **Question-shaped H2s** that match real queries (the keyword engine's `gsc` and `suggest` output), and dated facts with a named source.
- **Never write content for AI Mode follow-up rows** ("yes please", "are these free"). Monitor them only.

## Rules for all three sites

- **Facts:** facts come only from the site's facts source, and the site's facts lint must pass on the diff and on the build.
- **Control groups:** FaithWall and NoteWall hold page bodies (fact fixes only) until the 2026-12-02 read-out.
  - Template changes are allowed: navigation, footer, related block, breadcrumbs, blog index and `llms.txt`. They change every page the same way, so held and treated pages stay comparable.
  - Write one annotations row with the date and commit, so the read-out can see the step.
  - QuranWall has no hold.
- **No new posts in this pass.** New posts still go through the §5 demand test.
- **QuranWall's repo is public:** no Search Console, App Store Connect or revenue numbers in its docs.
- **One bundled push per site.**
  - Before the push: `link-graph --dist` exits 0, and the site's own gates pass (typecheck baseline, build, facts lint, keyword engine `check --staged`).
  - After the deploy: `link-graph --live` exits 0, IndexNow is pinged for the changed URLs, and a journal entry records the before and after numbers from this table.
- **Done** means both runs exit 0. Any WARN left in place is named in the journal with its reason, usually a hold.
