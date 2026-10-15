---
id: T-0001
title: Rename the project glossary to GLOSSARY and guard it in the verifier
epic: 0001-glossary-rename
status: todo
blocked_by: []
---

## Context

Spec: `.proj.specs/0001-glossary-rename/spec.en.md` (revision 2) and `traceability.md` (the source of
truth for B, R1–R5, the stale tokens, the scanned set and the forbidden paths). Review:
`review/round-1.md`, `review/round-2.md`, including the author's adjudication at the end of round 2.
The spec is frozen; the P1 resolutions below refine its acceptance criteria and win where they are
more specific.

Start condition: PR #4 is merged into `main`. B is that merge commit. The branch
`tickets/T-0001/glossary-rename` starts from `main` at B, in a git worktree outside the main
checkout (for example under the session scratchpad), so untracked epic-0002 files and the main
checkout's `AGENTS.md` cannot affect it.

This ticket lands before any ticket of epic 0002.

## Deliverable

One branch that: adds the verifier's glossary check with tests (`/tdd`, red → green); renames the
glossary convention across both skill trees, the project docs and the glossary file in a single
commit; adds the `/teach` rule to `docs/agents/domain.md` and the one-sentence local adaptation to
`teach/SKILL.md` in both trees; lists the test command in `AGENTS.md`; records provenance; and passes
a manual end-to-end check whose test edit is reverted.

## Acceptance criteria

Spec AC1–AC13 apply, with these refinements (P1 resolutions from review):

1. **Verifier seam (spec AC9; rows 9–16).** `scripts/verify-project.py` gains
   `check_glossary(root) -> list[str]`, called from `verify()`, whose messages carry no `FAIL: `
   prefix; `main()` keeps adding the prefix, writing to stderr and setting the exit code. Tests
   assert the returned list exactly, against fixtures built in a temporary directory outside the
   repository; they do not run `main()` or the other checks.
2. **Message format.** One message per (path, line, token) occurrence:
   `<repo-relative POSIX path>:<1-based line>: stale glossary token <token>`; the list is sorted by
   path, then line, then token. Other messages: `GLOSSARY.md is missing, not a regular file, or
   blank`; `<path> must not exist (renamed to GLOSSARY)`; `<path>: cannot read as UTF-8`.
3. **Read failures.** Any `UnicodeDecodeError` or `OSError` on a scanned file yields the
   cannot-read message and scanning continues. The existing reads elsewhere in `verify()` are out of
   scope.
4. **Forbidden paths** are found by exact name match in directory listings (not `Path.exists()`),
   so the result is the same on case-insensitive file systems. `CONTEXT-FORMAT.md` is searched in
   every non-shared skill directory of both trees, skipping `node_modules/`.
5. **Glossary file check.** `GLOSSARY.md` must be a regular file (not a symlink) whose content
   contains at least one non-whitespace character.
6. **Tests cover** every row 9–16 case: each stale token in each scanned root type, including a
   nested subdirectory of a skill and of `docs/agents/`; two tokens on one line and the same token
   twice on one line; each not-scanned path in row 11 plus `docs/legacy-openspec/`, `.proj.specs/`,
   `scripts/` and a skill's `node_modules/`; each look-alike in row 12 plus `GLOSSARY.md` and
   `GLOSSARY-FORMAT.md` (no message); substring hits `CONTEXT.mdx` and `./src/x/CONTEXT.md` (one
   message each, since tokens match as substrings); missing, symlinked and whitespace-only `GLOSSARY.md`;
   each forbidden path; a non-UTF-8 file; a clean fixture returning an empty list. The red run
   fails on assertions (not on a missing attribute): the first commit adds a stub
   `check_glossary` returning `[]`.
7. **Project docs (spec AC3, AC5)** are exactly the row 5 set: `AGENTS.md`, `CLAUDE.md`,
   `docs/README.md` and the scanned `docs/agents/*.md`. AC3's line-equivalence check runs over
   `git diff -M B...HEAD` of those files and of every changed skill file, pairing removed and added
   lines by position within each hunk. Exempt from the check, and listed in Comments with their
   final text:
   - in `docs/agents/domain.md`, the added lines stating the `/teach` rule (AC6);
   - in `AGENTS.md` "Build and test commands", the sentence "There is no unit-test suite; …"
     rewritten to name the verifier's unittest suite while keeping "verify a deck by rendering it
     in the dev server", and the added unittest command (AC13);
   - in `AGENTS.md` "Build and test commands", the sentence describing what the verifier checks,
     extended to mention the glossary check;
   - in `.claude/skills/teach/SKILL.md` and `.agents/skills/teach/SKILL.md`, one added sentence: when
     the current directory is a repository root that has a project `GLOSSARY.md` (see
     `docs/agents/domain.md`), use a subdirectory as the teaching workspace.
8. **Teach adaptation provenance.** `docs/agents/skill-sources.json` `local_adaptations` gains a
   `teach` entry beginning "Both runtimes:" that describes the sentence and says to reapply it after
   upstream updates. `tune-skills` gets a `local_adaptations` entry beginning "Both runtimes:" for R5.
9. **Upstream sync record (spec AC11)** is a top-level `upstream_syncs` array whose first object has
   exactly the fields `upstream`, `commit`, `date`, `runtimes`, `skills` with the spec's values; the
   `skills` value equals the listed seven names in that order.
10. **History untouched (spec AC8)** is judged by `git log --format=%H B..HEAD -- docs/adr
    docs/legacy-openspec docs/agents/skill-tuning .proj.specs` printing nothing.
11. **Single rename commit (spec AC12)**: the files changed for AC1, AC2, AC5, AC6, AC7 and the teach
    sentence all change in one commit; the verifier, tests, `AGENTS.md` test-command lines and
    provenance may be separate commits.
12. **AC10 runs.** "Before": check out B in a second worktree, copy the new `scripts/verify-project.py`
    into it, run it there; it exits 1 and its stale-token messages cover every location that
    `grep -rnF` finds for the three stale tokens in the scanned set at B. "After": run the verifier in
    the ticket worktree at HEAD; it exits 0. Both outputs go to Comments.
13. **End-to-end (stage 8).** In a fresh interactive Claude Code session started in the ticket
    worktree, run `/domain-modeling` and ask it to add the term "Smoke test term" with a one-line
    definition. Pass: it edits `GLOSSARY.md` and creates no `CONTEXT.md`. Then restore with
    `git checkout -- GLOSSARY.md` and confirm `git status` is clean. Record the surface ("Claude Code
    interactive session, Claude tree only") and the diff excerpt in Comments.
14. **Evidence hygiene.** Everything pasted into Comments uses repo-relative paths; absolute home
    paths are replaced with `<repo>`.
15. **Coverage report table** in Comments at close, mapping each test to the rows and ACs it covers.

## 給使用者（zh-TW）

這張票一次完成 GLOSSARY 改名：兩棵 skill 樹、專案文件，以及把 `CONTEXT.md` 改名成 `GLOSSARY.md`，全部放在同一個 commit。verifier 會新增一項檢查：舊檔名或舊名稱只要再出現，就會判定失敗。另外，teach skill 加一句話，讓 `/teach` 不會把 repo 根目錄當成教學工作區，`docs/agents/domain.md` 也寫明這條規則。

做完之後，`python3 scripts/verify-project.py` 和 `python3 -m unittest discover -s scripts -p 'test_*.py'` 都會通過。我也會開一個新的 session 實際跑 `/domain-modeling`，確認它寫的是 `GLOSSARY.md`，測試用的詞彙在驗證後會還原。

開工前需要你做的事：合併 PR #4。開始寫測試之前，我會先把 test plan table 給你核准。

## Comments
