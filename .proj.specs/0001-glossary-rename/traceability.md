# Traceability — 0001 glossary rename

Source of truth for scope. `spec.en.md` prose is derived from this file.

## Definitions

**Base (B).** The commit on `main` that merges PR #4 (the first commit containing `CONTEXT.md`).
The ticket branch starts from B. "Before" means the tree at B; "after" means the ticket branch tip
(HEAD). Every diff below is `git diff B...HEAD -- <paths>`.

**Upstream.** mattpocock/skills commit `d80fa0f`.

**Rename map.** Case-sensitive literal substitutions, applied by `rename(line)` in this order:

| # | Old | New |
|---|---|---|
| R1 | `CONTEXT-FORMAT.md` | `GLOSSARY-FORMAT.md` |
| R2 | `CONTEXT-MAP.md` | `GLOSSARY-MAP.md` |
| R3 | `CONTEXT.md` | `GLOSSARY.md` |
| R4 | `# Context Map` (a line inside the format file's fenced example) | `# Glossary Map` |
| R5 | `CONTEXT templates` (tune-skills keep list) | `GLOSSARY templates` |

**Stale tokens** (what the verifier matches): `CONTEXT.md`, `CONTEXT-MAP.md`, `CONTEXT-FORMAT.md`,
matched as case-sensitive substrings. `CONTEXT-MAP.md` and `CONTEXT-FORMAT.md` are matched as their
own patterns, not through `CONTEXT.md`.

**Scanned set** (verifier, every run):

| Root | Files scanned |
|---|---|
| `.claude/skills/<skill>/` and `.agents/skills/<skill>/`, for every skill that is not a symlinked shared skill | every `*.md` file, recursively, skipping any `node_modules/` directory |
| `AGENTS.md`, `CLAUDE.md`, `docs/README.md` | the file |
| `docs/agents/` | every `*.md` directly in `docs/agents/` and in its subdirectories except `docs/agents/skill-tuning/` |

**Not scanned, with reason:** `docs/adr/` and `docs/legacy-openspec/` (history; this epic leaves
them as written), `docs/agents/skill-tuning/` (audit reports quote old text by design),
`docs/agents/*.json` (provenance records name the old tokens by design), `.proj.specs/` and
`.proj.tickets/` (frozen review prompts and specs quote old text), `scripts/` (the verifier and its
tests contain the tokens as patterns), and every other path.

**Symlinked shared skill.** A `.claude/skills/<name>` that is a symlink to
`../../.agents/skills/<name>`; the verifier already exempts these. Today: `apply-comments`,
`create-slide`, `create-theme`, `current-slide`, `new-deck`, `scientific-visualization`, `seaborn`,
`slide-authoring`.

**Forbidden paths** (must not exist after the change): `CONTEXT.md`, `CONTEXT-MAP.md` at the repo
root; any file named `CONTEXT-FORMAT.md` under either skill tree.

## Matrix

| # | Type | Field | Boundary | Expected behaviour | AC |
|---|---|---|---|---|---|
| 1 | non-shared skill file, either tree | R1–R5 occurrences | before | every occurrence replaced by its new token | AC1 |
| 2 | `domain-modeling` format file, either tree | file name | after | `GLOSSARY-FORMAT.md` exists; `CONTEXT-FORMAT.md` does not | AC2 |
| 3 | any changed line in skill files or project docs | line content | diff B...HEAD | new line == `rename(old line)`; no other edit, except the lines added for rows 6 and 22 | AC3 |
| 4 | symlinked shared skills | any file, the symlink itself | diff B...HEAD | unchanged | AC4 |
| 5 | `AGENTS.md`, `CLAUDE.md`, `docs/README.md`, `docs/agents/*.md` | R1–R3 occurrences, including link targets | before | replaced; every relative Markdown link whose target was `CONTEXT.md` now targets `GLOSSARY.md` and resolves | AC5 |
| 6 | `docs/agents/domain.md` | teach-workspace rule | after | states that the repo root is not a `/teach` workspace and root `GLOSSARY.md` holds project vocabulary only | AC6 |
| 7 | root glossary | file | after | `GLOSSARY.md` exists, is non-empty, and equals `CONTEXT.md` at B byte for byte; `git log --follow --format=%H GLOSSARY.md` lists at least one commit reachable from B | AC7 |
| 8 | `docs/adr/`, `docs/legacy-openspec/`, `docs/agents/skill-tuning/`, `.proj.specs/` | any file | diff B...HEAD | unchanged | AC8 |
| 9 | verifier stale-token check | each of the 3 stale tokens × each scanned root type (skill file Claude tree, skill file Codex tree, `AGENTS.md`, `CLAUDE.md`, `docs/README.md`, `docs/agents/*.md`) | token planted on one line | `FAIL: <repo-relative path>:<line>: stale glossary token <token>` on stderr, exit 1 | AC9 |
| 10 | verifier stale-token check | two tokens in two files | planted | one `FAIL:` line per hit | AC9 |
| 11 | verifier stale-token check | token in a not-scanned path (`docs/adr/`, `docs/agents/skill-tuning/`, `docs/agents/skill-sources.json`, a symlinked shared skill) | planted | no stale-token `FAIL:` line | AC9 |
| 12 | verifier stale-token check | non-token look-alikes: `context`, `single-context`, `Context Map`, `CONTEXT` alone, `context.md` | planted in a scanned file | no stale-token `FAIL:` line | AC9 |
| 13 | verifier glossary-file check | `GLOSSARY.md` missing, or empty | fixture | `FAIL: GLOSSARY.md is missing or empty` on stderr, exit 1 | AC9 |
| 14 | verifier forbidden-path check | each forbidden path present | fixture | `FAIL: <path> must not exist (renamed to GLOSSARY)` on stderr, exit 1 | AC9 |
| 15 | verifier stale-token check | a scanned `*.md` that is not valid UTF-8 | fixture | `FAIL: <path>: not UTF-8` on stderr, exit 1, and scanning continues | AC9 |
| 16 | verifier, clean fixture | no planted defect | fixture | exit 0 | AC9 |
| 17 | verifier on the real repo | whole run | at B with the new verifier | exit 1, naming every stale-token location | AC10 |
| 18 | verifier on the real repo | whole run | at HEAD | exit 0 | AC10 |
| 19 | provenance | `docs/agents/skill-sources.json` | after | an `upstream_syncs` entry naming `mattpocock/skills`, `d80fa0f`, date `2026-10-16`, both runtimes, and the seven upstream skills; a separate `local_adaptations` note for `tune-skills` (both runtimes) | AC11 |
| 20 | change atomicity | skill edits, doc edits, file renames | ticket branch | all land in one commit | AC12 |
| 21 | upstream drift other than R1–R5 | any skill | diff B...HEAD | not imported (covered by AC3) | AC3 |
| 22 | tests | location and command | after | `scripts/test_verify_project.py`, run by `python3 -m unittest discover -s scripts -p 'test_*.py'`, listed in `AGENTS.md` | AC13 |
