---
epic: 0001-glossary-rename
status: draft
revision: 2
---

# Spec 0001 — Sync the upstream GLOSSARY rename

Definitions (Base B, rename map R1–R5, stale tokens, scanned set, symlinked shared skills, forbidden
paths) live in `traceability.md` and are not repeated here.

## Problem Statement

The domain-glossary skills vendored from mattpocock/skills (`domain-modeling` and six skills that
read its output) still name the project glossary `CONTEXT.md`. Upstream renamed the convention to
`GLOSSARY.md` / `GLOSSARY-MAP.md` / `GLOSSARY-FORMAT.md` in commit `d80fa0f`; that rename is the
only upstream change to `domain-modeling`. Until the local copies follow, every upstream sync of
these skills conflicts, and the author keeps a name upstream no longer uses.

## Solution

In one commit, apply the rename map to both runtime skill trees, the project docs that point at the
glossary, and the glossary file itself; add a rule separating the project glossary from `/teach`
workspaces; and give the verifier a check that fails when a stale token, a forbidden path, or a
missing glossary appears. Nothing else from upstream is imported.

## User Stories

1. As the author, I want the project glossary to be called `GLOSSARY.md`, so that its name says
   what it is and matches the upstream skills.
2. As the author, I want later upstream syncs of the glossary skills to need no rename work, so that
   keeping them current stays small.
3. As the author (and the agents working for me), I want every skill and project doc to name the
   same glossary file, so that one file is read and updated.
4. As the author, I want `scripts/verify-project.py` to fail when a stale glossary token or an old
   glossary file returns, so that a careless copy or edit cannot reintroduce it silently.
5. As the author, I want `/teach` kept from writing its teaching glossary into the project glossary,
   so that the shared file name causes no mix-up.

## Implementation Decisions

- **One ticket, one commit** for every rename, so the repository never holds a half-renamed state
  in which `domain-modeling` would lazily create an empty `GLOSSARY.md` beside `CONTEXT.md`.
- **Token substitution on local copies**, not a re-copy of upstream files: local harness and
  Claude-tree adaptations recorded in `docs/agents/skill-sources.json` must survive. Every changed
  line equals the rename map applied to its old line.
- **Both runtime trees change together**: the glossary name is a cross-runtime contract
  (`docs/agents/runtime.md` asks for deliberate porting of behaviour changes; this keeps both trees
  identical in this respect).
- **The glossary file moves with history** (`git mv`); its bytes do not change.
- **Exclusions are this epic's own decision**, stated with reasons in `traceability.md`.
  `AGENTS.md` freezes only `docs/legacy-openspec/`; leaving `docs/adr/` untouched here is a scoping
  choice, not a new repository rule.
- **`/teach` and the project glossary.** Upstream's `teach` skill also uses `GLOSSARY.md` and
  `GLOSSARY-FORMAT.md`, for a teaching workspace's glossary. This epic accepts the shared file name,
  as upstream does, and adds to `docs/agents/domain.md`: the repository root is not a `/teach`
  workspace; root `GLOSSARY.md` holds project vocabulary only.
- **Verifier check.** `scripts/verify-project.py` gains a function, called from `verify()`, that:
  scans the scanned set for stale tokens; fails when a forbidden path exists; fails when
  `GLOSSARY.md` is missing or empty; reports a non-UTF-8 scanned file as a failure and keeps
  scanning. Every failure is one `FAIL:` line on stderr in the formats of `traceability.md` rows
  9–15. The existing exit-code contract is unchanged.
- **The repo is single-context** (`docs/agents/domain.md`), so requiring root `GLOSSARY.md` is
  correct here; a future move to multiple contexts must revise this check.
- **Provenance.** `docs/agents/skill-sources.json` gains an `upstream_syncs` list with this sync's
  entry, plus a `local_adaptations` note that `tune-skills` (a project-origin skill) renamed
  its keep-list wording in both runtimes. JSON provenance is outside the scanned set, so it may name
  the old tokens.
- **Second upstream.** `AGENTS.md` and `docs/agents/*` also come from the harness-agile template,
  which still says `CONTEXT.md`. This epic accepts that a later template sync will need the same
  rename; the verifier will point at every spot. Recorded in `.proj.specs/OPEN-QUESTIONS.md`.

## Testing Decisions

- **Seam:** the verifier module, approved by the author. Tests load `scripts/verify-project.py`
  with `importlib` and call the new check function against minimal fixture repositories built in a
  temporary directory (only the files a case needs, symlinks created explicitly). They assert exit
  status, the exact `FAIL:` lines, and their absence for the not-scanned and look-alike cases.
- **Location and command:** `scripts/test_verify_project.py`, standard-library `unittest`, run with
  `python3 -m unittest discover -s scripts -p 'test_*.py'`. `scripts/` is outside the scanned set,
  so tests may contain stale tokens as data. `tests/` is not used: in harness-agile it means the
  template's own tests.
- **Red step:** the new tests fail before the check exists; the new verifier also fails on the tree
  at B (AC10), and that output is saved in the ticket's Comments.
- **Line-equivalence check (AC3)** runs over `git diff B...HEAD` of the changed skill and doc files:
  for every hunk, each added line equals `rename()` of the paired removed line and there are no
  unpaired lines. The command and its output are saved in the ticket's Comments.
- **End-to-end surface:** a fresh interactive Claude Code session in the ticket worktree runs
  `/domain-modeling` and is asked to add one term; the evidence is that it edits `GLOSSARY.md` and
  creates no `CONTEXT.md`. This is an agent session, not a browser; the surface is named in the
  report, and the lack of an automated harness for skill behaviour is recorded in
  `.proj.specs/OPEN-QUESTIONS.md`.
- **Isolation:** implementation runs in a clean git worktree of the ticket branch, so epic 0002's
  untracked files in the main checkout cannot enter this branch or affect the verifier.

## Acceptance Criteria

- **AC1** — At HEAD, no `*.md` file in a non-shared skill of either tree contains any R1–R5 old
  string (`grep -rn` for each old string over those files returns nothing).
- **AC2** — In both trees, `domain-modeling/GLOSSARY-FORMAT.md` exists and
  `domain-modeling/CONTEXT-FORMAT.md` does not; `git diff -M B...HEAD --name-status` reports each as
  a rename (`R`), not delete-and-add.
- **AC3** — The line-equivalence check over `git diff B...HEAD` of every changed skill file and every
  changed project doc reports zero violations, excluding only the lines added for AC6 and AC13.
- **AC4** — `git diff B...HEAD --stat -- <each shared skill path in both trees>` is empty, and each
  `.claude/skills/<shared>` is still a symlink to `../../.agents/skills/<shared>`.
- **AC5** — At HEAD, `AGENTS.md`, `CLAUDE.md`, `docs/README.md` and every scanned `docs/agents/*.md`
  contain no stale token, and each relative Markdown link that targeted `CONTEXT.md` at B now
  targets `GLOSSARY.md`, which exists.
- **AC6** — `docs/agents/domain.md` at HEAD states both: the repository root is not a `/teach`
  workspace; root `GLOSSARY.md` holds project vocabulary only.
- **AC7** — At HEAD `GLOSSARY.md` exists, is non-empty, and `git show B:CONTEXT.md | cmp -
  GLOSSARY.md` reports no difference; `CONTEXT.md` does not exist; `git log --follow --format=%H
  GLOSSARY.md` lists at least one commit reachable from B.
- **AC8** — `git diff B...HEAD --stat -- docs/adr docs/legacy-openspec docs/agents/skill-tuning
  .proj.specs` shows no change made by this ticket's commit.
- **AC9** — `python3 -m unittest discover -s scripts -p 'test_*.py'` passes, and its tests cover every
  case in `traceability.md` rows 9–16: each stale token in each scanned root type; two hits giving
  two lines; each not-scanned path and each look-alike giving no stale-token line; missing and
  empty `GLOSSARY.md`; each forbidden path; a non-UTF-8 scanned file; a clean fixture exiting 0.
- **AC10** — The new verifier run against the tree at B exits 1 and names every stale-token location
  that `grep` finds in the scanned set at B; `python3 scripts/verify-project.py` at HEAD exits 0.
- **AC11** — `docs/agents/skill-sources.json` has an `upstream_syncs` entry with `upstream:
  "mattpocock/skills"`, `commit: "d80fa0f"`, `date: "2026-10-16"`, `runtimes: ["claude", "codex"]`
  and `skills` listing `codebase-design`, `diagnosing-bugs`, `domain-modeling`,
  `improve-codebase-architecture`, `setup-matt-pocock-skills`, `tdd`, `wait-what`; and a
  `local_adaptations` entry for `tune-skills` naming both runtimes and the R5 rename.
- **AC12** — Every file change in AC1, AC2, AC5, AC6 and AC7 is in a single commit on the ticket
  branch.
- **AC13** — `AGENTS.md` "Build and test commands" lists the unittest command from AC9.

## Out of Scope

- Any upstream change to these skills other than R1–R5.
- `skills-lock.json` hashes (they record upstream provenance, not local content).
- Renaming the word "context" in prose.
- Editing ADRs, the legacy OpenSpec archive, specs, tickets or audit reports.
- Syncing the harness-agile template.

## Further Notes

- Depends on PR #4 being merged; B is its merge commit on `main`.
- In `wait-what`, the old tokens sit inside one long prompt sentence; only the tokens change.
- `teach` keeps its own `GLOSSARY.md` / `GLOSSARY-FORMAT.md`; this epic does not edit it.
