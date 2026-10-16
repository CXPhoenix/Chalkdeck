---
id: T-0001
title: Rename the project glossary to GLOSSARY and guard it in the verifier
epic: 0001-glossary-rename
status: review
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

### 2026-10-16 — Branch and base

Branch `tickets/T-0001/glossary-rename` created from `main` at B = `3b383c27e041ed6a103e875ce6cde09cf094625a` (merge of PR #4), in a worktree outside the main checkout.

### 2026-10-16 — Test plan table (approved)

Approved by the author on 2026-10-16: 「核准 T-0001 的 test plan table。PR #4 合併後就開始 red → green。」

Seam: `check_glossary(root) -> list[str]` in `scripts/verify-project.py`, loaded with `importlib`; fixtures built in a temporary directory outside the repository, symlinks created explicitly; tests assert the returned list only. Test file `scripts/test_verify_project.py`. The first commit adds a stub returning `[]`, so red runs fail on assertions.

| Seam | Test intent | Scope | Acceptance criterion | Boundary conditions |
|---|---|---|---|---|
| `check_glossary` | clean fixture returns an empty list | `GLOSSARY.md`, one skill per tree, `docs/agents/` | Row 16, AC9 | no tokens |
| `check_glossary` | every stale token is found in every scanned root type | 3 tokens × 6 root types (Claude skill, Codex skill, AGENTS.md, CLAUDE.md, docs/README.md, docs/agents/*.md) | Row 9, AC9 | message `<path>:<1-based line>: stale glossary token <token>` |
| `check_glossary` | hits in subdirectories are found | a skill's `references/`, a `docs/agents/` subdirectory | Row 9 | recursive scan |
| `check_glossary` | one message per (path, line, token), ordered | two tokens on one line, same token twice on one line, two files | Row 10, ticket item 2 | sorted by path, line, token |
| `check_glossary` | not-scanned paths give no message | `docs/adr/`, `docs/legacy-openspec/`, `docs/agents/skill-tuning/`, `skill-sources.json`, shared-skill symlink, `scripts/`, `.proj.specs/`, a skill's `node_modules/` | Row 11, ticket item 6 | non-`.md` files are not scanned |
| `check_glossary` | look-alikes give no message; substrings hit | `context`, `single-context`, `Context Map`, bare `CONTEXT`, `context.md`, `GLOSSARY.md`, `GLOSSARY-FORMAT.md` → none; `CONTEXT.mdx`, `./src/x/CONTEXT.md` → hit | Row 12, ticket item 6 | case-sensitive |
| `check_glossary` | glossary file problems are reported | `GLOSSARY.md` missing, a symlink, whitespace-only | Row 13, ticket item 5 | regular file with non-whitespace content |
| `check_glossary` | forbidden paths are reported | root `CONTEXT.md`, root `CONTEXT-MAP.md`, `CONTEXT-FORMAT.md` in a skill of each tree; root lowercase `context.md` is not forbidden | Row 14, ticket item 4 | exact-name match from directory listings |
| `check_glossary` | unreadable files are reported and scanning continues | one non-UTF-8 `.md` plus a hit in another file | Row 15, ticket item 3 | both messages present |

Not unit tests (results recorded here): new verifier exit 1 on B's tree and exit 0 at HEAD (AC10); line-equivalence check (AC3); manual E2E with `/domain-modeling`, test term reverted afterwards.

### 2026-10-16 — Implementation (stage 5)

Commits on the branch (oldest first): `0d33df6` stub + first test; `47fe68e` glossary check (TDD);
`01af5f3` single rename commit; `db08bcb` provenance + test command; `7398c6e`, `265b27f`
stage-6 fixes; `6716700` stage-7 hardening; `bf9792c` security report.

**Red → green log.** Each cycle's red run failed on assertions or on the defect under test:
cycle 2 (stale token in a Claude skill) list mismatch; cycle 3 (3 tokens × 6 roots) 17 of 18
subtests failed; cycle 5 (ordering) token order mismatch; cycle 6 (not-scanned paths) 3 failures
(`skill-tuning/`, shared skill's Codex copy, `node_modules/`); cycle 8 (glossary file) 3 failures;
cycle 9 (forbidden paths) 4 failures; cycle 10 (non-UTF-8) `UnicodeDecodeError` raised.
Cycles 4 (subdirectories) and 7 (look-alikes and substrings) passed on first run: `rglob` and the
case-sensitive substring match already covered them; recorded as characterization.
Stage-6 fixes added red tests first: Unicode-blank `GLOSSARY.md`, unreadable `GLOSSARY.md`
(`PermissionError`), line numbers with `\x0c`/U+2028; stage-7 hardening: symlinked `.md` file and
symlinked directory (2 failures).

### 2026-10-16 — Acceptance evidence (HEAD `bf9792c`, base B `3b383c2`)

- **AC1** — 0 hits for the R1–R5 old strings in `*.md` of non-shared skills, both trees.
- **AC2** — `git diff -M --name-status B...HEAD`: `R070 .claude/skills/domain-modeling/CONTEXT-FORMAT.md → GLOSSARY-FORMAT.md`, same for `.agents/`.
- **AC3** — line-equivalence check (pairs removed/added lines by position within each `-U0` hunk and
  compares `rename(old) == new`) over `git diff -M -U0 B...HEAD -- .claude/skills .agents/skills AGENTS.md CLAUDE.md docs/README.md 'docs/agents/*.md'`
  at `db08bcb`: 104 pairs checked; remaining items are exactly the exempt `AGENTS.md` edits below.
  Exempt lines (final text):
  - `docs/agents/domain.md`: "The root `GLOSSARY.md` holds project vocabulary only. The repository root is not a `/teach` workspace: `/teach` keeps its own `GLOSSARY.md` in a subdirectory."
  - `AGENTS.md` (verifier sentence): "It verifies harness plumbing and the glossary convention, not slide behavior." (rewrapped)
  - `AGENTS.md` (test sentence): "The only unit-test suite is the verifier's, `python3 -m unittest discover -s scripts -p 'test_*.py'`; decks have none, so verify a deck by rendering it in the dev server — that browser page is the real surface."
  - `.claude/skills/teach/SKILL.md` and `.agents/skills/teach/SKILL.md`: "If the current directory is a repository root that has a project `GLOSSARY.md` (see `docs/agents/domain.md`), first create a subdirectory for the topic and treat it as the current directory below, so the teaching glossary never overwrites the project's."
- **AC4** — all 8 shared skills still link to `../../.agents/skills/<name>`; `git diff --stat B...HEAD` over their 16 paths is empty.
- **AC5** — 0 stale tokens in the row-5 docs; `AGENTS.md` links `(GLOSSARY.md)`, `docs/README.md` links `(../GLOSSARY.md)`; the file exists.
- **AC6** — `docs/agents/domain.md` lines 7–8 (quoted above).
- **AC7** — `git show B:CONTEXT.md | cmp - GLOSSARY.md`: identical; `CONTEXT.md` absent; `git log --follow` lists `01af5f3` and `3e6b0a5` (reachable from B).
- **AC8** — `git log B..HEAD -- docs/adr docs/legacy-openspec docs/agents/skill-tuning` prints nothing. `.proj.specs/` has one added file, `review/security-T-0001.md`, placed there by the author's decision (2026-10-16, "照 skill 放 .proj.specs"); no existing spec file changed.
- **AC9** — `python3 -m unittest discover -s scripts -p 'test_*.py'`: 22 tests, OK.
- **AC10** — before: new verifier on the pre-rename tree (`47fe68e`, identical to B outside `scripts/`) exited 1 with 109 stale-token messages on 98 distinct lines, plus the missing-`GLOSSARY.md` and 3 forbidden-path messages; the (path, line) set equals `grep -nF` over the scanned set. After: exit 0 at HEAD.
- **AC11** — `upstream_syncs[0]` = {mattpocock/skills, d80fa0f, 2026-10-16, [claude, codex], 7 skills in order}; `local_adaptations.teach` and `.tune-skills` begin "Both runtimes:"; `skills.tune-skills.adaptations` also records R5 (review F12).
- **AC12** — `01af5f3` contains all 28 rename-set files; no other commit touches them.
- **AC13** — `AGENTS.md` "Build and test commands" names the unittest command.

### 2026-10-16 — Reviews

- **Stage 6 code review** (two `harness-reviewer` passes, Standards and Spec): no high-impact findings.
  Author approved the fix set (2026-10-16, 「全部套用」): status/evidence/coverage, shared-skill helper,
  constant placement, docstrings and PASS text, `# chalkdeck:` marker, Unicode blank check, `OSError`
  on `GLOSSARY.md`, newline-only line numbers, extra tests, AGENTS.md wording and wrap, tune-skills
  adaptation. Not changed, with reasons: non-shared symlinked skills (already fail `verify()`),
  `version` bump (unchecked), `OPEN-QUESTIONS.md`/`runtime.md` notes (would breach AC8/AC3),
  "paragraph" vs "sentence" wording. Ordering kept as grouped-then-sorted (author, 「維持分組排序」).
- **Stage 7 security review**: `.proj.specs/0001-glossary-rename/review/security-T-0001.md` — 9 candidates, 0 confirmed findings.
  Hardening applied by the author's choice: symlinks not followed; Windows-safe test guards.
  Deferred as P2: `os.walk` `onerror`, output escaping, fixed gitignored teach workspace, verifier guard for the teach sentence.

### 2026-10-16 — End-to-end (stage 8)

Surface: an AI agent following the worktree's skill files (subagent reading
`.claude/skills/domain-modeling/SKILL.md`, its format file and `docs/agents/domain.md`), Claude tree only.
A headless `claude -p` session was tried first and failed to authenticate (expired OAuth); the author
chose the subagent route. Result: it added "Smoke test term" to `GLOSSARY.md` (git diff: 3 added lines),
created no `CONTEXT.md`; the edit was reverted with `git checkout -- GLOSSARY.md` and `git status` was clean.

### 2026-10-16 — Coverage report table

Measured with the standard-library `trace` module while running the unittest suite.

| Seam | Tests | Measured coverage | Acceptance criterion | Uncovered, and why |
|---|---|---|---|---|
| `check_glossary` and its helpers | 22 tests in `scripts/test_verify_project.py` | 56/56 executable lines (100%) | AC9, rows 9–16, ticket items 1–6 | none |
| `shared_skill_names` | via the not-scanned and shared-skill tests | 4/4 lines (100%) | row 11 | none |
| `verify()` call site and refactored shared-link loop | real-repository runs (AC10) | not unit-tested | AC10 | exercised by the real verifier runs, not by the minimal fixtures |
| Rename, docs, teach sentence | AC1–AC8, AC11–AC13 checks above | n/a (content) | AC1–AC8, AC11–AC13 | — |
