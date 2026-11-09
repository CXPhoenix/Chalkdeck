# Round 2 — 0006-docs-only-ticket-process

Spec version: spec.en.md 0acef2007b8d758a9430b1a4f72c174d3f8a1b7d / traceability.md 66830e17aa989894bf60244bcd4d1babe18ae231 (revision 2)
Prompt: `review/prompt.md` replayed verbatim (blob 35bf080d5c34454fec20639d0227d68d4da1ac4d); only the `Spec version:` line changed. One `harness-reviewer` per axis, run in parallel. Reports condensed by the parent to one line per finding; no finding dropped. Round-2 IDs restart at `<axis>-1` and are unrelated to round 1's.

Totals: **P0 0**, P1 46, P2 109 (axis 1: 0 / 9 / 39; axis 2: 0 / 17 / 23; axis 3: 0 / 11 / 21; axis 4: 0 / 9 / 26). Reviewers flagged possible P0 upgrades: 3-7 (with 2-15, 1-5, 4-11, the same issue), and 2-5, 2-10, 2-16 under a strict "check not stated" reading.
Subagent tokens: about 0.62M (axis 1 0.14M, axis 2 0.14M, axis 3 0.18M, axis 4 0.17M).

## Parent verification (2026-11-09)

- `git hash-object` gives the two blobs above; `git diff --stat 32a5162` outside this epic's spec directory is empty and `git status` is clean.
- Confirmed by experiment in a scratch repository: `git diff HEAD` prints nothing for a new untracked file and 7 lines after `git add -N` (1-2, 2-2, 3-9, 4-2).
- Confirmed `.claude/agents/harness-reviewer.md:4` is `tools: Read, Glob, Grep` (3-7, 2-15, 1-5, 4-11).
- Confirmed `.claude/skills/archify/test/skill-metadata.test.mjs:9` reads `SKILL.md` and `:40` caps it at 160 lines (3-8).
- Confirmed `scripts/new-deck.mjs:4-5, :83` reads `themes/<id>.md`'s `## Fixed components` as source (4-9, 2-6).
- Confirmed `OPEN-QUESTIONS.md:16-17`: OQ-1 blocks behaviour-changing edits to skills (3-2, 4-8).
- Confirmed `tune-skills/SKILL.md:12-25`: Claude tree only, and only model differences reach a rewrite (3-10).

## Axis 1 — Completeness

### P1
- **1-1** AC1–AC4 "nothing else changes" has no base or time; a ticket landing T1 alone cannot pass AC1.（高）
- **1-2** `git diff HEAD` omits untracked new test or implementation files; no row covers them.（高）
- **1-3** the red diff includes the uncommitted ticket file, so records grow cumulatively; no row on commit cadence.（中）
- **1-4** the checklist has no "Uncovered, and why"; an AC without any item still satisfies C3.（中）
- **1-5** T2's "stage-6 review itself" cannot run commands or write Comments in this repository's roles; S2 drops the condition.（高／中）
- **1-6** a code ticket that lands verbatim prose (e.g. L3's three item-6 sentences) has no verification row.（中）
- **1-7** a documentation-only ticket with a prose AC the spec does not give verbatim (a new ADR) has no valid check.（中）
- **1-8** drift is undefined for inserted regions; anchor drift; T13 "appended" against another epic's appended OQ.（中高）
- **1-9** what happens after a kind change: which table replaces which, re-approval, files already changed.（中）

### P2
- **1-10** K9 and spec say "review reports"; T1 says "review and report files".（高）
- **1-11** `verbatim` with an empty region list, or a listed region the spec does not give, has no row.（高）
- **1-12** unclassified: `GLOSSARY.md`, `OPEN-QUESTIONS.md`, ADRs, README, `CLAUDE.md` prose, agent role bodies, `themes/*.md`, other epics' specs, binary assets, `.gitignore`, deletions and renames.（中）
- **1-13** prose whose content is pinned (style skills, the security-review upstream reference) needs a K8 change; stage 4 cannot foresee it.（中）
- **1-14** key against content: prose without a key; a `docs_only` ticket that already changed a K8 file.（中）
- **1-15** stages 7 and 8 for documentation-only tickets in general have no row.（中）
- **1-16** a code ticket's coverage table after stage 6/7 fixes.（中）
- **1-17** the green record of a first-run-pass cycle: before mutation or after restore?（中）
- **1-18** a test committed before its red is invisible to `git diff HEAD`; the commit is a Git object, against R3.（中）
- **1-19** whether R1–R3 apply to ADR-0006 tickets.（中）
- **1-20** which failures count as a red (import error, wrong reason).（低）
- **1-21** checklist Results depend on commit ids that rebase or squash can remove.（中）
- **1-22** X3 "first Comment is B" against a re-recorded B; X5 not redone after B changes.（高）
- **1-23** the Base rule against merging or rebasing has no row or AC.（高）
- **1-24** X2 exempts `.proj.specs/`, so T13's region has no per-region scope check.（中）
- **1-25** X6 is judged when no ticket is open to record it.（高）
- **1-26** E1's "before the merge" and tool remain only in prose.（高）
- **1-27** T13 at end of file cannot have a blank line after it.（高）
- **1-28** T2's "character for character when it defines none" has no row.（高）
- **1-29** a matching text in the wrong place.（中）
- **1-30** a verbatim region changed after the stage-6 comparison.（中）
- **1-31** no row for the test plan table's column set.（高）
- **1-32** "run the items in order" has no row; where the checklist sits in the ticket.（高／低）
- **1-33** where a non-verbatim documentation-only ticket lists its planned files.（中）
- **1-34** stage-8 results in two places (Result and Comments).（中）
- **1-35** every "stop and ask the owner" lacks the next step after the answer.（中）
- **1-36** "One rule, several texts" misses T8/T15 for approval, a verbatim-regions row, a stage-5-gate row; T14 against C3.（高）
- **1-37** K4/K5 found after stage 5 starts, or fixed after stage-4 approval.（中）
- **1-38** `AGENTS.md:79` pipeline row 4 does not mention the kind.（中）
- **1-39** handing work to the executor while keeping one row per cycle.（中）
- **1-40** K2 omits T6; K1's "full stage 6" omits T2.（高）
- **1-41** Z1 names only T1 and T2, not the keys (T8), T15 or T6; no fallback if the owner refuses Z1.（中）
- **1-42** the owner rejecting or revising a table before approval.（低）
- **1-43** tickets already in progress when T1 lands.（中）
- **1-44** matrix rows R1–R3 collide with Rulings R1–R6.（高）
- **1-45** "the next ticket id is T-0009" is hard-coded.（低）
- **1-46** "code ticket", "verbatim ticket" not glossary terms; `docs/README.md:29` not updated.（低）
- **1-47** A8 claims T1 says reruns are not changed rows; T1 does not say it, and writing a Result is literally an edit.（中）
- **1-48** `spec.zh-TW.md` is not mentioned anywhere.（低）

## Axis 2 — Verifiability

### P1
- **2-1** T14's "every item passes" cannot be met at stage 5 when a `(stage 8)` item exists.（高）
- **2-2** `git diff HEAD` does not show a new untracked test file.（高）
- **2-3** tests committed in advance leave every red diff empty; uncommitted runs make diffs cumulative.（高）
- **2-4** approval records only a date: no ordering against the first change, no version of the table.（高）
- **2-5** T1's prose list reads as exhaustive and omits `GLOSSARY.md` and `OPEN-QUESTIONS.md`, which this epic changes.（中高；可升 P0）
- **2-6** a file mixing prose and script-read data (`themes/*.md`, `{{PROJECT_NAME}}`, checksummed references): judge by file or by content?（中）
- **2-7** "a ticket that ADR-0006 governs" has no decidable trigger.（中）
- **2-8** drift for inserted regions has nothing to compare; OQ number collisions go undetected.（高）
- **2-9** after a drift ruling to proceed, AC1–AC4 still demand the original text.（中高）
- **2-10** AC1–AC4 "nothing else changes": base and time unstated.（高；可升 P0）
- **2-11** "one blank line after" an insert at end of file.（中）
- **2-12** X4 "at HEAD" loops: recording the Result dirties the tree.（中高）
- **2-13** drift is checked once before the first change, yet Q9 reruns every item and C3 wants one commit.（高）
- **2-14** items may run on a dirty tree; the recorded commit differs from what was tested.（中）
- **2-15** T2's "the stage-6 review itself, not the implementer" names no role able to do it.（中高）
- **2-16** AC7 names no place or form for the stage-4 record.（高；可升 P0）
- **2-17** a comparison item need not be a command or show output; Result can be a bare "matches".（中）

### P2
- **2-18** T9 and T1 define the kind differently (ADR-0006, ticket file, "configuration").（中）
- **2-19** Match lets a glossary entry collapse into one line; "rewrapped" undefined.（中）
- **2-20** E1's conditions per changed file, including `reports/*.html`.（中）
- **2-21** page text alone cannot show a table or code block rendered.（中）
- **2-22** `(stage 8)` items are not rerun after later changes.（中）
- **2-23** "Result equal to Expected" can never hold when Result includes a commit.（高）
- **2-24** filling Result is an edit; when to approve a removal or a replaced mutation.（中）
- **2-25** green records carry no output or order; the re-run after restore is implicit.（中）
- **2-26** after a switch to code ticket the approval gate cannot be met.（中）
- **2-27** the precedence clause may reach stage 9's landing authority.（中）
- **2-28** "before stage 5 starts" and K12 overlap.（中）
- **2-29** the stage-4 kind approval need not be recorded.（中）
- **2-30** Z1 does not cover T8 or T15.（中）
- **2-31** how to build the code-review scope for a verbatim ticket; placement not compared.（中）
- **2-32** X1's `reports/` has two readings.（低）
- **2-33** whether the blank lines around an insert belong to the region.（低）
- **2-34** how and where X6 is judged.（中）
- **2-35** where the comparison script lives; inside the worktree it dirties `git status`.（中）
- **2-36** when and where "already fails at B" is run and recorded.（中）
- **2-37** a code ticket's coverage table after stage-6 fixes.（中）
- **2-38** where stage-9 results go after landing.（低）
- **2-39** ADR-0006 tickets and R1/R2 record format; restoring fixtures.（中）
- **2-40** T6's approval timing is looser than T1's.（高）

## Axis 3 — Contract conflict

### P1
- **3-1** User Story 2 promises no behaviour change skips tests; T1 lets behaviour-changing skill body edits be documentation-only, since R3 excludes only ADR-0006's non-behaviour-changing rewrites.（高）
- **3-2** that also silently lifts OQ-1's block on behaviour-changing skill edits.（中）
- **3-3** T14's stage-5 gate against T1's stage-8 items.（高）
- **3-4** T9 lacks "even where a script checks its form": the notices, `GLOSSARY.md` and `AGENTS.md` are read by the verifier, so T9 excludes them, against T1, Q2′ and R2.（高）
- **3-5** T9 lacks the ADR-0006 exclusion.（高）
- **3-6** T1's list omits `GLOSSARY.md`, which Q2′ named, and `OPEN-QUESTIONS.md`; this epic's own tickets may not qualify.（中）
- **3-7** T2's comparison by "the stage-6 review itself" is impossible with read-only reviewers and a parent that implements.（高；可升 P0）
- **3-8** the last item does not run a changed skill's own tests (archify's `node --test` reads `SKILL.md`).（中高）
- **3-9** `git diff HEAD` does not show the cycle's new untracked test, against Q7.（高）
- **3-10** OQ-10's "Settles it" is outside `/tune-skills`' contract (model differences only, Claude tree only, keep list).（中）
- **3-11** editing a vendored skill's body requires a `skill-sources.json` update (K8), an incentive to skip provenance.（中）

### P2
- **3-12** OQ-10 says "only workflow.md" though T6 and T14 also say it; overridden sources listed inconsistently.（高／中）
- **3-13** workflow.md claims to outrank `AGENTS.md`'s carry-forward wording, inverting their hierarchy; T6 lacks the clause.（中）
- **3-14** the precedence clause may reach stage 9's landing authority.（中）
- **3-15** "materially changed" in implement and tdd is a threshold, maybe outside the precedence clause.（中）
- **3-16** T6's approval timing is looser than T1's.（中）
- **3-17** T2 overrides the `code-review` skill but not `runtime.md:97-99`.（中）
- **3-18** Z1 also overrides B0's stage 6, ticket format and stage-4 gate without saying so.（中）
- **3-19** ADR-0006:12 still says "closes the ticket" while T1 cites the ADR as live.（中）
- **3-20** T1's mutation red changes ADR-0006's "normal `/tdd` loop" without saying so.（中低）
- **3-21** ADR-0004's "template work keeps every gate"; `themes/*.md` as prose.（中低）
- **3-22** listing "a deck" as a code-ticket trigger implies a ticket may change a deck.（低）
- **3-23** switching kinds mid-ticket cannot meet the approval gate.（中）
- **3-24** `AGENTS.md:79` row 4 and `/to-tickets` show no kind.（中）
- **3-25** T9 "marked when broken into tickets" against T8's later changes.（低）
- **3-26** T8's YAML example carries comments, against "write each key only as `key: true`".（低）
- **3-27** spec and K9 say "review reports"; T1 says "review and report files".（低）
- **3-28** E1 checks rendering, not agent behaviour (stated; OQ-1).（低）
- **3-29** the last item runs the branch's own checker, not a trusted copy.（低）
- **3-30** "code ticket", "ticket file", "verbatim region", "acceptance checklist" not in the glossary.（低）
- **3-31** red records grow cumulatively.（中）
- **3-32** `docs/README.md:29` glossary description not updated.（低）

## Axis 4 — Red team

### P1
- **4-1** L5's "earlier row or commit" lets implementation written in an earlier cycle or committed first make a later first-run pass compliant.（高）
- **4-2** untracked files hide both the new test and pre-written implementation from the red diff.（高）
- **4-4** landed T1 never defines `<B>`, so a later B can hide changes or pick a failing commit.（高）
- **4-5** after an item fails, its Expected can be edited to the Result; ticket-file edits trigger no rerun, so C3 holds.（高）
- **4-6** approval records do not pin the approved version or the question answered.（中）
- **4-7** "fails at B → ask the owner" is an unconditioned exit; an Expected of exit 1 masks new FAILs, wider than the moved takedown exception.（中）
- **4-8** behaviour-changing skill body rewrites are documentation-only, against User Story 2 and OQ-1, and less protected than ADR-0006's behaviour-preserving ones.（高）
- **4-9** `themes/*.md` is read by `new-deck.mjs` as code but not named; it can be classed as prose.（中）
- **4-11** T2's independent comparison is impossible with read-only reviewers; self-certification remains.（中）

### P2
- **4-3** green records carry no diff, so a test can be weakened between red and green.（中）
- **4-10** T8 points to the glossary, whose T9 lacks the ADR-0006 and frontmatter detail.（中）
- **4-12** T2's "spec's text" is not pinned to a version.（中）
- **4-13** T2 applies to `verbatim: true` without requiring `docs_only`.（中）
- **4-14** landed T2 has no drift guard; matched regions' interaction with surrounding text goes unreviewed.（中）
- **4-15** checklist Results need no output, weaker than T-0006.（中）
- **4-16** "same commit", clean `git status` and Results in the ticket file are mutually exclusive.（中；可升 P1）
- **4-17** `(stage 8)` marks are self-chosen; changes after stage 6 are not re-reviewed.（中）
- **4-18** a mutation may change the test itself.（中）
- **4-19** review and report files are unrestricted in type, and X1 allows editing frozen review records.（中）
- **4-20** Claude role bodies are prose but Codex `.toml` roles are code; `skill-tuning/*.patch`; deletions and renames.（低）
- **4-21** T-0004 and T-0005, open `todo` tickets, have no transition rule.（中）
- **4-22** the code-ticket gate only needs the coverage table to "exist".（中）
- **4-23** T6 and T14 in the always-loaded file are looser than T1.（中）
- **4-24** the precedence clause's scope (stage 9; tdd's "existing approval").（中）
- **4-25** losing `docs_only` mid-ticket: changes made before escape the code-ticket gate.（中）
- **4-26** delegating several rows to the executor at once.（低）
- **4-27** OQ-9's "no recurrence" exit depends on unenforced records.（低）
- **4-28** no mandatory kind check in the checklist.（中）
- **4-29** (intended) the Charter and hard rules can go documentation-only and verbatim.（高）
- **4-30** Match normalises a Markdown hard line break.（低）
- **4-31** a relayed approval quote cannot be verified (inherent).（低）
- **4-32** the red record's HEAD still depends on a commit object.（低）
- **4-33** nothing checks that B is on `main`.（低）
- **4-34** (intended) the ticket landing T2 narrows its own review.（高）
- **4-35** "one test method" may hold dozens of sub-cases.（低）

Checked by axis 4 and found clean: the takedown paths are gone (R1); the allowlist is K8; notices Assets rows may go documentation-only, as T-0006 intended; style-skill and security-review pinned content are caught by their checks.

## Rulings

Pending: put to the repository owner on 2026-11-09.
