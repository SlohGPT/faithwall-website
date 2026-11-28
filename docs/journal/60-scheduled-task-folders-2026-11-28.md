# 60 — Scheduled task folders and modes (Vocabee, NoteWall), 2026-11-28

Session type: interactive, Saturday 11-28, about 11:29 to 11:45. Karol made every change himself in the Claude desktop app → Scheduled. The session read the settings, guided him and checked the result.

## What was asked

"Before 13:20 today, set the permission mode on the three Vocabee tasks (vocabee-seo-autopilot-local, vocabee-merge-bot, vocabee-seo-refresh)". Entry 58 left this as Karol's last Vocabee item. Then: "any other scheduled tasks I should edit?"

## What was found

- Claude can't set this. The scheduled-tasks tool has no permission-mode field, and changing the mode Claude runs with is Karol's call. The session gave him steps.
- **Correction to entry 58 and `vocabee-website` journal 05.** They said an unsaved mode would stop the first run at a tool prompt. That was wrong. `~/.claude/settings.json` sets `"defaultMode": "bypassPermissions"`, and a task with no saved mode inherits it. This repo's three tasks and QuranWall's three have no saved mode and run every day. The editor shows the inherited mode as a grey "Bypass permissions" chip.
- **The real fault was the start folder.** The app stores each task's folder and mode in `~/Library/Application Support/Claude/claude-code-sessions/<account>/<org>/scheduled-tasks.json` (`cwd`, `permissionMode`, `useWorktree`). Each of the three accounts on this Mac has its own file. In the signed-in account, the active tasks stood like this:
  - FaithWall ×3 in `faithwall-website-main`, QuranWall ×3 in `quranwall-website`, Synapsa ×9 in `medix-takeover`: correct.
  - **Vocabee ×3 in `faithwall-website-main`.** That's wrong. Those runs would load this repo's CLAUDE.md and memory instead of Vocabee's, and they would be listed under faithwall-website.
  - **NoteWall ×3 in `ASO`.** Also wrong: their prompts work in `website-notewall`, so every run loaded the ASO project's CLAUDE.md. They still worked because the prompts use absolute paths.

## What was changed (by Karol, in the app)

- Vocabee autopilot, merge gate and weekly review now start in `~/GITHUB REPOS/vocabee-website`. The autopilot also has Bypass permissions saved; the other two inherit it.
- NoteWall autopilot, merge gate and weekly review now start in `~/GITHUB REPOS/website-notewall`. Their mode was already bypass.
- Worktree is off on all six, and no schedule changed.

## How it was verified

The session re-read the signed-in account's `scheduled-tasks.json` after the saves. All six tasks are enabled, with the new `cwd` and `useWorktree` false. Modes are as listed above. No run has started in the new folders yet: Vocabee's first is 13:20 today, NoteWall's next is 08:30 tomorrow.

## Docs

`vocabee-website` journal 06 has the Vocabee side; its `TODO-KAROL.md` line was deleted.

## Still open

- The two other Claude accounts on this Mac still carry Vocabee copies that start in `faithwall-website-main`, and NoteWall copies that start in `ASO`. Fix them only if Karol switches to one of those accounts.
- Check that the first Vocabee run (13:20) and the next NoteWall run (11-29 08:30) work from their new folders.
