---
epic: 0006-docs-only-ticket-process
status: draft
revision: 2
---

# Spec 0006 — A process for documentation-only tickets, and a stricter code-ticket loop

`traceability.md` holds what this spec does not repeat: the definitions (B0, B, code ticket,
ticket file, region, match, drift), the target texts, the matrix and the self-checks. The owner's
answers are quoted in `grill.md`; the stage-3 rulings are in `review/round-1.md`.

Revision 2 applies the round-1 Rulings R1–R6. Under R1 the takedown exception left this epic for
epic 0007; the texts and rows it needed are removed and remain readable in revision 1.

## Problem Statement

The workflow assumes every ticket is code. `docs/agents/workflow.md` stage 5 says "Run
`/implement`, which uses `/tdd`" with no other branch, so T-0006, a ticket that changed mostly
license text and the notices, had to explain on its own why `/tdd` did not apply. The same stage
gives two times for the coverage report table ("when the ticket closes" and "before stage 6"), and
`AGENTS.md` hard rule 2 repeats the first. Stage 6 re-reviewed verbatim spec wording at a cost of
about 1.9M subagent tokens, mostly rediscovering points the spec review had already ruled on.

Code tickets have their own gaps. Epic 0005 wrote tests in batches ahead of their reds three times,
although each occurrence was recorded; about 41 mutations ran without being in an approved table;
and red evidence was kept in loose `git hash-object -w` blobs that `git gc` can delete. The owner's
ruling D1, that a standing "do it to completion" is not test plan approval, lives only in a ticket
and in agent memory.

## Solution

The repository owner gets one written process for each kind of ticket:

- A **documentation-only ticket** is a defined term, marked in ticket frontmatter and approved at
  stage 4. It runs an approved acceptance checklist instead of `/implement`, `/tdd` and the two
  tables. Regions whose text the spec gives verbatim are checked at stage 6 by a comparison the
  review runs itself, and only the rest is reviewed in full.
- A **code ticket** keeps `/tdd`, now with recorded explicit approval, one test per row and one row
  per cycle, a mutation fixed in advance for every row and allowed only where the behaviour
  already existed, and red and green records written into the ticket as diffs.

## User Stories

1. As the repository owner, I want documentation-only tickets defined and marked, so that an agent
   knows from the ticket which process applies.
2. As the repository owner, I want configuration, script-read data and ADR-0006 rewrites kept out
   of documentation-only tickets, so that no change that alters a tool's or a skill's behaviour
   skips its tests.
3. As the repository owner, I want a documentation-only ticket to run an acceptance checklist I
   approve, so that its evidence is real checks rather than tests that cannot fail.
4. As the repository owner, I want stage 6 to skip re-reviewing settled verbatim wording, so that
   review effort goes where the spec review could not look.
5. As the repository owner, I want every test plan table, checklist and change to them to wait for
   my explicit, recorded approval, so that neither a standing instruction nor a relayed claim
   stands in for it.
6. As the repository owner, I want one test per row, one row per cycle and each row's mutation
   fixed in advance, so that every red is genuine and was approved before it ran.
7. As the repository owner, I want red evidence written into the ticket, so that it survives
   `git gc` and travels with the PR.
8. As the repository owner, I want one stated time for the coverage report, so that the gate before
   stage 6 is unambiguous.

## Implementation Decisions

- **Documents changed.** The workflow doc (stage 4 gate, stages 5 and 6), `AGENTS.md` (pipeline row
  5, hard rule 2), the tracker configuration (ticket format), the glossary, and two new open
  questions. Every changed region has a target text: T1, T2, T6, T8, T9, T13, T14, T15.
- **No skill, script, test or deck changes** (grill Q11). The workflow doc carries every rule. It
  states where it outranks the skills (Rulings R5, R6); OQ-10 tracks bringing the skills in line.
- **Kind of ticket** (T1, T9, K7–K11; Rulings R2, R3). Prose for people and agents counts, even
  where a script checks its form. Code, tests, build and deploy configuration, any frontmatter of a
  skill or agent role file, any YAML, JSON or TOML file, the `CLAUDE.md` import line, other files a
  script reads as settings or data, and decks do not. The ticket file and the epic's review reports
  do not count. A ticket ADR-0006 governs is never documentation-only. A documentation-only ticket
  that needs a code-ticket change stops before making it.
- **Ticket keys** (T8, T15, K1–K6, K12). `docs_only: true` and `verbatim: true`, set at stage 4 and
  shown in the breakdown the owner approves; `verbatim` requires `docs_only` and a list of regions
  under Deliverable. A wrong key is fixed before stage 5; a key changed after stage 4 needs recorded
  approval.
- **Approval** (T1, T6, A1–A8). The repository owner approves before the first test or any change
  outside the ticket file, and approves every later change to an approved row. Approvals are
  recorded with the owner's words and a date. A standing instruction is not approval, and the rule
  outranks carry-forward wording elsewhere.
- **The code-ticket loop** (T1, L1–L8; Ruling R4). One row is one test method or one `subTest`.
  Each cycle records a red and a green before the next row's test is written. A first-run pass is
  allowed only for behaviour that already existed, with the reason recorded, and then takes its red
  from the row's mutation; a mutation that fails to fail stops the loop. ADR-0006 tickets keep that
  ADR's order.
- **Records** (T1, R1–R3). A red record holds HEAD, `git diff HEAD` at the run and the failing
  test's name and message; a green record holds HEAD and the test's name. The diffs are the
  evidence; no Git object or local ref is relied on. A custom `refs/evidence/…` ref was rejected
  because it is not pushed by default and does not appear in a PR (decision 2).
- **Coverage timing** (T1, T6, C1–C3). Before stage 6 for every ticket; results of stages 7–9 go to
  Comments afterwards.
- **Checklist** (T1, Q1–Q9). Five columns; each item is a command or a comparison against the spec;
  each Result names its commit; failures and reruns stay in the same item; a scope item and a final
  three-checks item are mandatory; stage-8 items are marked and filled later; any later change
  reruns the rest. It counts as the coverage report once every unmarked item's latest Result equals
  its Expected, from one commit.
- **Verbatim regions** (T2, S1–S5; Ruling R5). The stage-6 review runs and records the comparison
  for each listed region; matched regions skip the wording review, and everything else gets the
  full review. This replaces the `code-review` skill's full-diff review for matched regions only.

## Testing Decisions

- **No new tests.** Every ticket of this epic is documentation-only; its stage-5 evidence is an
  acceptance checklist in the form T1 defines.
- **What a good check is here.** A comparison of each landed region with its target text under the
  Match rule; a `git diff --name-only` per ticket and a per-region check for scope (X1, X2); the
  drift check before the first change (X5); the three existing checks with a clean work tree (X4).
- **Prior art.** T-0006's checklist (exact comparisons, `git diff --name-only`, the existing checks)
  and 0005's target texts T1–T9.
- **End to end.** The surface is the GitHub file view of the pushed ticket branch, driven before
  the merge by `/agent-browser` or a native browser tool the workflow accepts as equivalent (E1).
  Page text, not screenshots, is recorded. It is the checklist's `(stage 8)` item. There is no
  harness for agent behaviour (OQ-1), so no run checks that an agent follows the new rules.

## Acceptance Criteria

- **AC1.** In `docs/agents/workflow.md`, the regions of T1, T2 and T15 match their texts, and
  nothing else in the file changes.
- **AC2.** In `AGENTS.md`, the regions of T6 and T14 match, and nothing else changes.
- **AC3.** In `docs/agents/issue-tracker.md` the region of T8 matches and in `GLOSSARY.md` the region
  of T9 matches; nothing else in either file changes.
- **AC4.** `.proj.specs/OPEN-QUESTIONS.md` ends with T13, which matches, and nothing else changes.
- **AC5.** E1 gives the result its matrix row states, recorded in the ticket's Comments, naming the
  GitHub file view as the surface.
- **AC6.** For each ticket, X1–X5 hold, judged against that ticket's own latest B; once all tickets
  have landed, X6 holds.
- **AC7.** The stage-4 breakdown records the repository owner's approval that this epic's tickets
  run under T1's checklist and T2's verbatim review before those texts land (Z1).

## Out of Scope

- The takedown exception for delivered decks and unrelated verifier FAILs: epic 0007 (Ruling R1),
  starting from revision 1's draft texts and round-1 findings listed in `review/round-1.md`.
- The verifier's PASS line stating what it does not check (decision 5): the notices-grammar epic.
- A record script enforcing one row per cycle: OQ-9.
- Changes to the `implement`, `tdd`, `to-tickets`, `code-review` or `tune-skills` skills, and to
  `docs/agents/codex.md`: OQ-10.
- The epic 0005 retrospective's items 4 (commit type) and 5 (checking matrix rows against rules
  before freeze), which the owner has not decided.
- ADR-0006 and other ADRs that mention the coverage table: history, not edited.

## Further Notes

- **Self-application** (Ruling R6, Z1). This epic's tickets run under T1's checklist and T2's
  verbatim review before those texts are on `main`, overriding B0's hard rule 2 and stage 5 for
  these tickets only. The owner approves this at stage 4.
- **Extensions beyond the grill answers**, stated so review can test them: the checklist's Result
  column and the HEAD commit in records (Q6, Q7 of `grill.md` named neither); the drift rule and the
  Match rule; T14 and T15, which the confirmed file list did not name but which the stage-3 rulings
  require.
- **Stage 4.** The next ticket id is T-0009. Each ticket lists the regions it lands; X6 checks that
  together they land every region exactly once.
