# Round 1 — 0006-docs-only-ticket-process

Spec version: spec.en.md 1899c3af59fe007203265099a402bbd46f2368a1 / traceability.md d41b52029fb6bdf2ec6051e6c2ce1d6d743be7f2
Prompt: `review/prompt.md` (frozen, blob 35bf080d5c34454fec20639d0227d68d4da1ac4d, commit 095a7b0). One `harness-reviewer` per axis, run in parallel. Reports recorded as returned, condensed by the parent to one line per finding; no finding dropped. Axis 1 numbered its findings `C-n`; they are recorded here as `1-n`. Axis 4 ordered its IDs by theme; they are listed in numeric order.

Totals, counted by the parent from the IDs: **P0 2**, P1 56, P2 68 (axis 1: 1 / 14 / 21; axis 2: 1 / 14 / 14; axis 3: 0 / 12 / 17; axis 4: 0 / 16 / 16). Axes 2–4 stated slightly different P1/P2 counts in their own summaries; the per-ID grades below are the reviewers' own.
Subagent tokens: about 0.55M (axis 1 0.11M, axis 2 0.12M, axis 3 0.16M, axis 4 0.16M).

## Parent verification (2026-11-09)

- `git hash-object` of the two spec files gives the blobs above; the reviewers read that version.
- `git diff --stat 32a5162` outside `.proj.specs/0006-docs-only-ticket-process/` is empty and `git status` is clean: the work tree equals B0 apart from this epic's spec directory (axes 2 and 4 asked for this check).
- Confirmed `GLOSSARY.md:43-45`: Delivered deck says "only typo and broken-link fixes" (1-1, 3-2, 4-24).
- Confirmed `docs/deploy-and-google-sites.md:21` repeats the frozen-deck rule in Traditional Chinese (3-28).
- Confirmed 3-7: T-0006 changed `docs/agents/skill-sources.json` (its AC5, the "Provenance comparison" row). Under T9 and K8 it would not be a documentation-only ticket; the self-check line and grill round 2's reasoning are wrong on this point.
- Confirmed `AGENTS.md:80`: pipeline row 5 reads `/implement` + `/tdd` | test plan table approved, then red → green (1-2, 2-29, 3-3, 4-25).
- Confirmed `docs/adr/0006-…:20-21` limits that ADR to tickets whose spec forbids behaviour change (3-1).
- Confirmed `docs/adr/0007-license-split.md:8` carries the unconditional "a FAIL blocks the merge" amendment note (3-14).
- Confirmed Ruling L3's "report the result to the owner, not on a public PR" at `T-0008-…:3526` (3-4, 4-16).
- Confirmed `.github/workflows/deploy-pages.yml:8` has `workflow_dispatch` and `:47-54` skips deployment when the allowlist is empty (4-22).

## Axis 1 — Completeness

### P0
- **1-1** `GLOSSARY.md` Delivered deck restates Must-hold 5 and is not a target text; after landing, the glossary forbids what the Charter allows, and AC3 forbids fixing it in a ticket.（高；分級信心中）

### P1
- **1-2** `AGENTS.md:80` pipeline row 5 has no target text; it still tells every ticket to run `/implement` + `/tdd`.（高）
- **1-3** "before the first file is changed" covers the ticket file itself (B Comment, status, the checklist); no row closes it.（高）
- **1-4** editing or removing an approved row has no row; only added rows need approval.（高）
- **1-5** a planned mutation that leaves the test passing has no row.（高）
- **1-6** adding `docs_only` or `verbatim` after stage 4 has no row; a code ticket can be relabelled to avoid tests.（高）
- **1-7** K4/K5 "an error in the breakdown": who acts and what happens is open; T8 also calls such a ticket a code ticket.（中）
- **1-8** a ticket with both verbatim and non-verbatim regions has no row; T10 is not verbatim, so its ticket loses the narrowed stage 6, unlike grill Q1(f)'s "non-verbatim parts".（高）
- **1-9** with several tickets, X1/X2 on the last ticket's B miss earlier tickets; the base of AC1–AC5's "no other change" is unstated.（高）
- **1-10** no drift rule for a target region that changed between B0 and B (T4, T7 "keeps its text at B0").（高）
- **1-11** E1/AC6 is a stage-8 item, but C3 wants every Result filled before stage 6 and Q5 wants the three checks last.（高）
- **1-12** ADR-0009 is "checked by reading", which Q2 does not allow.（高）
- **1-13** takedown on the owner's instruction for a reason other than privacy or law has no row.（高）
- **1-14** a removed asset that has no Assets row (the owner's own photo) has no row.（高）
- **1-15** files that are both text and configuration (SKILL.md frontmatter, `.claude/agents/*.md`, the `CLAUDE.md` import line) are not classified.（中）

### P2
- **1-16** K9 does not say `verbatim` goes too, nor what happens to recorded checklist results.（高）
- **1-17** a style-skill change also needs `style-skills-baseline.json` (K8); no row lets stage 4 foresee it.（中）
- **1-18** who approves: T1 says "the user", T5/E "repository owner"; GLOSSARY avoids "user".（中）
- **1-19** A1/A2 cite T6, which does not state the checklist timing.（高）
- **1-20** no row for the test plan table's column set.（低）
- **1-21** R1 misses uncommitted work at the run; the base of "the test … as a diff" is unstated.（中）
- **1-22** R3 permits a local-only ref such as `refs/evidence/…`, which decision 2 rejected.（高）
- **1-23** "record complete" in L4: does it include green? A red from an import error?（中）
- **1-24** ADR-0006 tickets mutate fixtures and run before the rewrite; L5 says "restore the implementation".（中）
- **1-25** no row for stage-6 fix rounds: new rows, redoing the coverage report.（中）
- **1-26** one of Q5's checks already failing on `origin/main` leaves no exit.（中）
- **1-27** stages 7 and 8 for a documentation-only ticket are not stated as unchanged.（低）
- **1-28** E1's "before the merge" and tool appear only in prose; which ticket runs E1 is unstated.（高）
- **1-29** a takedown leaves the file in Git history; not stated as out of scope.（中）
- **1-30** no row says a takedown runs on the deck track, `decks/<id>`.（中）
- **1-31** privacy material that is not an asset (a name in slide text) has no row.（中）
- **1-32** a removed asset in the global `assets/` has no row.（中）
- **1-33** a verifier non-zero exit with no `FAIL:` line (traceback) has no row.（中）
- **1-34** `origin/main` moving between the comparison and the merge has no row.（低）
- **1-35** the takedown instruction itself need not be recorded.（中）
- **1-36** takedown, code ticket and verbatim ticket are not glossary terms; T10's `date:` under rebase; "No script reads them" has no exit.（低–中）

## Axis 2 — Verifiability

### P0
- **2-1** AC4 judges ADR-0009 "by reading" against T10's interpretive list, which also breaks T1's rule that a check is a command or an exact comparison.（中；可降 P1）

### P1
- **2-2** a stage-8 item cannot have its Result before stage 6, and cannot follow the "last item"; "added to the ticket afterwards" is unplaced.（高）
- **2-3** the gate needs every Result filled, not every Result equal to Expected; a recorded exit 1 passes.（高）
- **2-4** "before the first file is changed" cannot be met: the B Comment, status and the checklist itself are file changes.（高）
- **2-5** approval need not be recorded; stage 6 cannot tell whether A1–A4 held.（高）
- **2-6** is a rerun line an added row needing approval?（中）
- **2-7** changing an approved row's command or Expected is unregulated.（中）
- **2-8** "One row is one test": a method or each subTest? Dozens of subTests in one method satisfy the letter.（中）
- **2-9** exact comparison normalisation: continuation indent after rewrapping, which whitespace collapses, blank lines around inserted blocks.（高）
- **2-10** T4/T7 "on the same line" against "line breaks free" for the multi-line E.（中）
- **2-11** with several tickets, which B and HEAD judge AC7.（高）
- **2-12** X1 excludes `review/security-T-NNNN.md`, where stage-7 reports are kept by precedent.（中）
- **2-13** T9's line for skill files (frontmatter, `scripts/*.py`, `agents/openai.yaml`), `docs/agents/skill-sources.json` under `docs/`, `.claude/agents/*.md`, `CLAUDE.md`, `themes/*.md`.（中）
- **2-14** takedown scope: what "the deck's references" covers; whether global `assets/` count; an external-URL image.（中）
- **2-15** the takedown instruction and reason are recorded nowhere; a takedown with no FAIL records nothing.（高）

### P2
- **2-16** E1 "renders" has no pass condition; links are not checked.（中；可升 P1）
- **2-17** X3 "before any other change" has no stated check.（中）
- **2-18** X4 does not require a clean work tree.（中）
- **2-19** `git log -1 --format=%as` is HEAD's date, not the adding commit's; use `--diff-filter=A`.（高）
- **2-20** the Verbatim ticket definition fits no ticket, since every ticket edits its own ticket file.（中）
- **2-21** T2 does not map onto `/code-review`'s two axes, nor say where the comparison result goes.（中）
- **2-22** `/to-tickets` does not show the keys, so "approved with the breakdown" is unjudgeable.（中；可升 P1）
- **2-23** "an error in the breakdown" has no consequence; YAML 1.1 `yes`.（低）
- **2-24** K9: fixed outcome or the owner's call? Re-approval? `verbatim`?（中）
- **2-25** an added row's test may be written before approval ("before that row runs").（中）
- **2-26** "key lines", the diff's base, "restore" for fixture mutations, whether "record complete" includes green.（中）
- **2-27** a rebased branch leaves R1's HEAD commit unreachable, against R3.（低）
- **2-28** E: how line shifts are computed; timing; traceback; D4 only implied.（中）
- **2-29** pipeline row 5 unchanged (could be P1); stage-9 results arrive after the merge, on which branch.（中／低）

## Axis 3 — Contract conflict

### P1
- **3-1** T1's mutation-for-red on every code ticket overrides ADR-0006:20-21 (behaviour-changing tickets use the normal loop) without saying so.（高）
- **3-2** GLOSSARY Delivered deck contradicts T5, locked by AC3.（高；可升 P0）
- **3-3** `AGENTS.md:80` pipeline row 5 contradicts T1/T6, locked by AC2.（高；可升 P0）
- **3-4** E puts FAIL lines in the public PR; Ruling L3, planned for the same item 6, says "not on a public PR".（高；可升 P0）
- **3-5** "before the first file is changed" conflicts with `processing` before the first edit, X3's B Comment, and the practice of writing the table into the ticket.（高）
- **3-6** X1 excludes the stage-7 report path that 0003, 0005 and T-0006 used.（高）
- **3-7** T-0006 changed `docs/agents/skill-sources.json`, a K8 file; the self-check and grill round 2 wrongly say it falls under K7.（高）
- **3-8** script-read parts of skills (SKILL.md frontmatter as invocation policy, `agents/openai.yaml`, checksummed references) sit on both sides of K7/K8.（中）
- **3-9** the stage-4 gate (workflow.md:109-110) and `/to-tickets` show no ticket kind, so K6's approval cannot happen.（中）
- **3-10** T2 narrows stage 6, but `code-review` and runtime.md:98-99 require both axes on the full diff, and T2's preceding paragraph still says "two axes".（中）
- **3-11** losing `docs_only` mid-ticket can leave `verbatim` alone, which T8 calls an error.（中高）
- **3-12** this epic's tickets use T1/T2 before they land, overriding B0's hard rule 2 and stage 5 without saying so.（中）

### P2
- **3-13** a rerun recorded "below" is an added row needing approval.（中）
- **3-14** ADR-0006:12 and ADR-0007:8 keep the old wording ("closes the ticket", "a FAIL blocks the merge").（中）
- **3-15** ADR-0006's write-all-characterization-tests-first flow does not fit T1's per-row cycle.（中）
- **3-16** "the user" against the owner's decision and the glossary's _Avoid_.（中低）
- **3-17** takedown and code ticket are not glossary terms although the Charter says vocabulary lives there.（中）
- **3-18** T6 "one row" against tdd's "One seam".（低）
- **3-19** carry-forward clauses (codex.md:9-13, tdd:22, AGENTS.md:21-22) do not point to D1.（中低）
- **3-20** T2 is all-or-nothing and tolerates line breaks; grill Q1(f) said "non-verbatim parts" and Q8 "must be empty".（中低）
- **3-21** T1 adds a Result column and R1 adds HEAD beyond grill Q6/Q7 without saying so.（低）
- **3-22** a takedown of a global `assets/` file has no fast path.（中低）
- **3-23** D4 is in no text; T3 and T10 speak of delivered decks only.（低）
- **3-24** a traceback leaves "every FAIL line also appears" vacuously true; Ruling L4 blocks on traceback.（低）
- **3-25** tune-skills' keep list still says "the two test tables".（低）
- **3-26** T11/T12 widen the file list confirmed in grill without saying so.（低）
- **3-27** the gate's "before the loop starts" does not fit a checklist.（低）
- **3-28** `docs/deploy-and-google-sites.md:21` keeps the frozen-deck rule with no exception.（高）
- **3-29** decision 4's "the PR records why" became "records the approval and the FAIL lines".（中）

## Axis 4 — Red team

### P1
- **4-1** every row has a mutation, so any test may "pass first" and take a mutation red: implementation-first becomes compliant.（高）
- **4-2** "record is complete" means the red record, so all reds can be recorded before any implementation.（高）
- **4-3** red records omit uncommitted implementation, so 4-1/4-2 cannot be detected later.（中）
- **4-4** approval is not recorded and says "the user"; a relayed "approved" in multi-agent work is undefined.（高）
- **4-5** carry-forward clauses (AGENTS.md:20-21, codex.md:9-13, workflow.md:184-185, tdd:22, implement:8-9) let an agent cite standing approval.（中）
- **4-6** an approved row can be changed (weaker mutation, new intent) without re-approval.（中）
- **4-7** a behaviour-changing skill rewrite, ADR-0006's own case, can be labelled documentation-only and skip all tests.（高；可升 P0）
- **4-10** T2's comparison may be the implementer's own Comment, so the narrowed review self-certifies; placement is not compared.（中）
- **4-12** checklist Results carry no commit; fixing one item does not rerun the rest; later changes need no update.（中）
- **4-15** a takedown leaves the file in public Git history and in the PR's Files changed; the texts imply it is gone.（高）
- **4-16** E's public PR record, plus tw-emoji-pr-note's "why" and screenshots, re-expose the person; conflicts with L3.（高）
- **4-17** "the deck's references" is unbounded: strictly it breaks the build or keeps a caption with the name; loosely it permits rewriting.（高）
- **4-18** names in slide text, inline SVG or data URIs, external images and embedded video are not assets and stay frozen.（中）
- **4-19** a photo in global `assets/` is template work, which Must-hold 3 forbids from changing a deck; several decks need several PRs.（中）
- **4-24** GLOSSARY Delivered deck contradicts the Charter; a takedown silently changes the talk record.（中）
- **4-25** pipeline row 5 unchanged, and AGENTS.md is the always-loaded file.（中）

### P2
- **4-8** agent role `model:`/`tools:`, SKILL.md invocation policy, `openai.yaml`, the `{{PROJECT_NAME}}` check can be classed as text.（中）
- **4-9** keys can be added mid-ticket to gain the narrowed stage 6 or skip `/tdd`.（中）
- **4-11** a rewrap that starts a line with `- `, `1. `, `#`, `>` or `|` changes the rendering but passes the comparison.（低）
- **4-13** no mandatory scope item; a script change under `docs_only` is caught only at stage 6.（中）
- **4-14** "first file is changed" cannot be met as written; a loose reading has no boundary.（中）
- **4-20** with no FAIL, the takedown instruction is recorded nowhere.（中）
- **4-21** a takedown blocked by an existing FAIL in the deck's other rows, or by a FAIL the removal causes, has no exit.（中）
- **4-22** `workflow_dispatch` deploys any ref without a Release; an empty allowlist skips deployment and leaves the old site up.（中）
- **4-23** traceback with no `FAIL:` line; FAIL lines without a line number; `origin/main` moving; a self-written "owner approved" in the PR.（低）
- **4-26** this epic's tickets apply T1/T2 before landing; the ticket landing T2 narrows its own review.（中）
- **4-27** a squash or rebase merge leaves R1's HEAD unreachable.（低）
- **4-28** an added row's test can be written before approval.（低）
- **4-29** X1 excludes `review/` and `reports/`; X1/X2 on the last ticket only.（低）
- **4-30** OQ-10 settles only after a failure, and blocks nothing.（低）
- **4-31** an ordinary deletion dressed as a legal claim on an undelivered deck; still needs the owner.（低）
- **4-32** switching from documentation-only to code mid-ticket makes the test plan come after the change.（中）

Intended consequences listed by axis 4: fewer re-reviews of verbatim wording; `main` stays red after a takedown under E; E applies to undelivered decks (D4); no harness checks agent behaviour (OQ-1).

## Rulings

Put to the repository owner on 2026-11-09 and answered "全部照建議". Each ruling is the
recommendation the parent gave.

- **R1 — split the takedown exception out.** Epic 0006 keeps the ticket process; the takedown
  exception becomes epic 0007 and restarts at stage 1. Both P0s (1-1, 2-1) move with it, so the
  P0/P1 grading disagreement on the Delivered deck definition (1-1 P0; 3-2, 4-24 P1) is settled
  there. Moved to 0007: 1-1, 1-13, 1-14, 1-29–1-35, 2-1, 2-14, 2-15, 2-28, 3-2, 3-4, the
  ADR-0007 half of 3-14, 3-22–3-24, 3-28, 3-29, 4-15–4-24, 4-31, and decision 4 with grill Q5, Q9
  and Q12. The deploy findings in 4-22 go with them. Revision 1's texts T3, T4, T5, T7, T10, T11,
  T12 and E remain readable in that revision as 0007's starting draft.
- **R2 — keep the classification strict (3-7).** `docs/agents/skill-sources.json` stays a file a
  script reads as data. Under the new rule T-0006 would have been two tickets: a
  documentation-only one for the notices and `LICENSE-CODE`, and a code ticket for the provenance
  file. `grill.md` records that its round-2 reasoning was wrong on this point.
- **R3 — configuration frontmatter and ADR-0006 tickets are not documentation-only** (4-7, 1-15,
  2-13, 3-8, 4-8). Frontmatter of a skill or an agent role file, any YAML, JSON or TOML file, and
  the `CLAUDE.md` import line count as configuration. A ticket that ADR-0006 governs is never
  documentation-only.
- **R4 — mutation for a first-run pass is a fallback** (3-1, 3-15, 1-24, 4-1). It applies only
  when the row's behaviour existed before the cycle, and the record says why. Tickets under
  ADR-0006 follow that ADR; T1 does not override its scope.
- **R5 — narrowed stage 6 by region** (1-8, 3-20, 4-10). The ticket lists its verbatim regions.
  The stage-6 review runs and records the comparison itself; matched regions are not re-reviewed
  for wording, everything else is. The text states that it overrides the `code-review` skill's
  full-diff review for matched regions only; the skill is unchanged and OQ-10 tracks it.
- **R6 — state the self-application and the precedence** (3-12, 4-26, 4-5, 3-19). The spec states
  that 0006's tickets run under T1 and T2 before they land, approved by the owner at stage 4. T1
  states that D1 outranks wording elsewhere that carries approvals forward; those files are
  unchanged.

Parent fixes in revision 2, needing no new decision: approval timing, recording, approver,
changed rows and reruns (1-3, 1-4, 2-4–2-7, 3-5, 3-13, 3-16, 4-4, 4-6, 4-14, 4-28); one test per
row, record completeness, `git diff HEAD` in red records, a mutation that does not fail (1-5,
1-21, 1-22, 1-23, 2-8, 2-26, 2-27, 4-2, 4-3, 4-27); checklist gate, stage-8 items, scope item,
reruns, a check already failing (1-11, 1-26, 2-2, 2-3, 4-12, 4-13); ticket kind after stage 4 and
the stage-4 gate (1-6, 1-7, 1-16, 2-22–2-24, 3-9, 3-11, 4-9, 4-32); pipeline row 5 (1-2, 2-29,
3-3, 4-25); X1 report paths, per-ticket B, drift, comparison rule, checks, E1 (1-9, 1-10, 1-28,
2-9–2-12, 2-16–2-18, 3-6, 4-11, 4-29); the code-review mapping and comparison record (2-20,
2-21, 3-10); OQ-10's scope and exit (3-25, 4-30); the approver's name (1-18).

Recorded and not changed: 1-12 (moves with ADR-0009 under R1), 1-17 (closed by R3's K8), 1-19 and
1-20 (matrix citations, fixed in passing), 1-25, 1-27, 1-36, 2-19 (moves with ADR-0009), 3-14's
ADR-0006 half (history), 3-17, 3-18 ("one row" is intended), 3-21 and 3-26 (stated in revision 2),
3-27 (fixed in passing), 4-11 (closed by the comparison rule), 4-30 (fixed with OQ-10).
