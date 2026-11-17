# NoteWall: port keyword engine 1.2.0 (brief, 2026-11-17)

For the NoteWall website session (`website-notewall`, branch `review8-fixes-1117`). Engine 1.2.0 is live on FaithWall: engine commit `9702a2e`, pushed to main on 2026-11-17 on top of `f57a34f` together with the update-flow copy fixes. It covers the `ixid=` image links you asked about in round 6 and the rest of your key-shaped URL lines. Port it together with your round-7 fixes in one push.

The round-7 verification was sent to your earlier session before midnight. The full evidence is in the private keyword archive of 2026-11-16, file `nw-round7-verification.txt`.

## Port

1. Byte-copy `scripts/keyword-research.mjs` from FaithWall commit `9702a2e` (the FaithWall checkout sits next to yours, so from your repo root it is `../faithwall-website-main`):
   - `git -C ../faithwall-website-main show 9702a2e:scripts/keyword-research.mjs > scripts/keyword-research.mjs`
   - Check it: `shasum -a 256 scripts/keyword-research.mjs` must equal `git -C ../faithwall-website-main show 9702a2e:scripts/keyword-research.mjs | shasum -a 256`. The hash starts with `77ac7c15b5d1`.
2. README: hand-merge two hunks from `git -C ../faithwall-website-main diff 4c2e886 9702a2e -- docs/keyword-research/README.md`:
   - the intro line gains "1.2.0 on 2026-11-17";
   - the B6 bullet in "Words the lint refuses" is replaced. The new bullet covers what B6 skips and what it still flags, the new prefix rules and the accepted limits.
3. Leave `engine_min_version` at 1.1.0: no config field needs 1.2.0.
4. In journals and docs, write only the 12-character prefix `77ac7c15b5d1`, never the full hash. B6 flags any run of 32+ hex characters (the lesson from your round 7).
5. Run the engine's self-test: it must print 108/108.

## What changed in 1.2.0 (vs 1.1.0)

Only `scripts/keyword-research.mjs` and the README changed; no config or data format changed. Commits on FaithWall: `bb64fd0`, `4810908`, `a5f886d`, `9702a2e`.

**B6 (key-shaped strings) now skips**, in a URL with a scheme:

- the value of a query parameter on an allow-list: `utm_*`, `ixid`, `ixlib`, `w`, `h`, `q`, `fit`, `crop`, `auto`, `fm`, `dpr`, `cs`, `v`, `family`, `display`. `s` is not on the list, because it is an imgix or Cloudinary signature;
- a slug or path of 3+ word-like parts, which may end in a 6-12 character id. This applies only when the run is path-shaped (in a URL, after `/`, or with a file extension) and not right after the words password, secret, token, key, auth or cred.

**B6 still flags:**

- every other parameter's value, and credential-named parameters (`token`, `sig`, `password`, `X-Amz-Signature`, `access_token`, `api_key`, `pw`, `pat`, `sas`, `hmac` and similar);
- a password in a link (`user:<secret>@host`) and a nested `name=VALUE` inside a value;
- a random path segment (webhook links) and a name-less `?<random>==` query;
- 32+ hex characters and the older key formats.

**New prefix rules, at any length:**

- Stripe live keys (`sk_live_`, `rk_live_`);
- GitHub tokens (`ghp_`, `gho_`, `ghu_`, `ghs_`, `ghr_`, `github_pat_`);
- JWTs;
- AWS key ids (`AKIA`, `ASIA`);
- Google OAuth secrets (`GOCSPX-`);
- npm tokens (`npm_`);
- Slack tokens (`xoxa-`, `xoxb-`, `xoxp-`, `xoxr-`, `xoxs-`), which need a digit in the tail.

A bare prefix word in prose is fine.

**Self-test:** 108/108 (103 in 1.1.0). Every key-like test value is built at run time, so the engine's own source passes B6.

**Accepted limits:**

- a secret under an allow-listed parameter name is skipped;
- a path made only of dictionary words passes;
- a URL without a scheme is still flagged (the safe direction);
- an all-caps 20-character word starting with AKIA or ASIA is flagged (also the safe direction).

## Expected on your tree

Checked on `a1abb53` with both engines over the top-level .md files, `docs/`, `src/`, `content/`, `public/`, `seo-log/` and `keyword-research/`: 1.1.0 flags 12 B6 lines and 1.2.0 flags 5. Nothing new is flagged. If your tree has moved past `a1abb53`, re-run both engines and explain any difference.

- **The 7 that go** are exactly your false positives:
  - journal 28:412;
  - best-vision-board-app-iphone-2026.json:54;
  - ticktick-vs-apple-reminders.json:56;
  - reduce-interruptions-focus-mode-iphone.json:42 and :103;
  - how-to-build-habits-with-your-phone.json:41;
  - motivational-wallpaper-ideas-iphone.json:54.
- **The 5 that stay** are flagged by both engines and matter only if you stage those files:
  - the base64 data URIs in `public/deal/nw-825c599e540c52d2.html` (:45, :46, :126, :349);
  - your IndexNow key file in `public/`.

None of the held posts' image `src` lines needs an edit.

## Your round-6 facts question

FaithWall's trigger is different from NoteWall's, so your own facts line was right to differ:

- the FaithWall app runs its Shortcut when the user picks or edits a verse;
- style changes need Update Wallpaper Now;
- nothing runs in the background, and a Shortcuts automation only re-applies the same image;
- FaithWall's `toggleCompletion` exists, but it is dead code: no UI calls it.

FaithWall's facts line, blog skill and lint now say this (commits `55f43ad`, `76bd968`, `af69e91`, `df27e24`, `5b1bd82`). The general lesson: before stating when an app updates the lock screen, grep every caller of its update function, drop dead code, quote file:line, and never carry one app's trigger over to another.

## When it ships

Record in NoteWall's journal: your port commit, the 12-character prefix of your copy's sha256, the self-test count and the before/after B6 counts, in the same entry as the round-7 fix hashes. Don't edit the FaithWall repo.
