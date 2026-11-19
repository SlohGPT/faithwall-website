# 47 — Vercel free-tier limits, 2026-11-19

## Ask

Karol forwarded the Vercel emails (Image Optimization transformations at 75 % and then 100 % of 5,000; Deployment Storage at 100 % of 10 GB on 11-18) and asked to "optimize it so we will not have to switch on the paid pro plan".

## Found (Vercel usage page, last 30 days, read in Chrome)

- The three app sites (FaithWall, QuranWall, NoteWall) are on the free **Hobby** team, not the billik Pro team. That settles the open question in the `app-sites-not-in-billik-vercel` memory.
- **Image transformations: 5,155.** website-notewall 5,003 (97 %), dreamwall-web 78, zlavozrut 74. FaithWall and QuranWall are Vite and make none.
  - The spike starts 11-17/11-18, right after NoteWall's cover commit `f78d160` (entry 45). Every cover goes through `/_next/image` at 8 widths × 2 formats (AVIF + WebP), about 16 billed transformations per new image URL, and 108 new covers came out at once.
  - Live check: an uncached NoteWall variant now answers with `x-vercel-error: OPTIMIZED_IMAGE_REQUEST_PAYMENT_REQUIRED`. The quota is spent until the month rolls over.
- **Deployment storage has fixed itself.** When storage filled up, Vercel deleted old deployments. It is now 1.49 GB of 10 GB, and most projects keep 3 deployments. NoteWall keeps the most: 47, 39 of them previews from autopilot branches. Production was never at risk. Nothing to do now. If it fills again, the lever is NoteWall preview deployments for `claude/*` branches; check first that the NW merge gate doesn't need them.
- Fast Data Transfer is 5.78 GB of 100 GB, so nothing else is near a limit.

## Decided

- Do not upgrade. The fix is for NoteWall to stop using Vercel's image optimizer: `images.unoptimized: true`, with covers pre-sized as WebP at commit time and Unsplash URLs given size params.
- Per the standing rule, NoteWall's code is changed only by its own session. Started the session `notewall-images-off` (own worktree in `website-notewall`) with the full brief: zero `/_next/image` requests, no heavier pages, a journal entry there, live curl proof.

## Open

- Verify the NoteWall session's report: its hash with `git show`, curl live `/blog` for `/_next/image` (must be none), and the cover files return 200.
- dreamwall-web and zlavozrut use about 150 transformations together. They're harmless on their own, but they're the same pattern if they grow.

## Later the same day: zlavozrut GitHub Actions turned off

Karol was still getting daily "Run failed: Refresh dead-man's switch" emails from SlohGPT/zlavozrut, a project that is no longer active. Its three scheduled workflows were still running: the dead-man's switch had failed every day since at least 11-09, plus the monthly grocery rebuild and the per-leaflet store refresh. All three are now disabled (`gh workflow disable`, as SlohGPT); `gh workflow list` shows `disabled_manually`. Nothing was deleted. To turn them back on: `gh workflow enable <id> -R SlohGPT/zlavozrut`, or the repo's Actions tab.

## NoteWall fix verified (same day)

The NoteWall session shipped it: merge `da4c86f`, journal `82b0155`, now on origin/main. `next.config.ts` has `images.unoptimized: true`, and the AVIF/WebP sizes are pre-built by `scripts/build-image-variants.mjs` and served by `SiteImage.tsx` from `/sized/…`. Checked live here: `/`, `/blog` and a post contain 0 `/_next/image` URLs; the sized cover files and the old cover URL answer 200. Still open: check that the Vercel transformation counter stays flat over the next day or two.
