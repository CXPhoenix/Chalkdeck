---
epic: 0006-docs-only-ticket-process
status: draft
revision: 1
---

# Spec 0006 — A process for documentation-only tickets, and the takedown exception

`traceability.md` holds what this spec does not repeat: the definitions (B0, B, code ticket,
verbatim ticket, takedown, exception text E), the target texts T1–T13, the matrix and the
self-check. The owner's answers are quoted in `grill.md`.

## Problem Statement

The workflow assumes every ticket is code. `docs/agents/workflow.md` stage 5 says "Run
`/implement`, which uses `/tdd`" with no other branch, so T-0006, a ticket that changed only
license text and the notices, had to explain on its own why `/tdd` did not apply. The same stage
gives two times for the coverage report table ("when the ticket closes" and "before stage 6"), and
`AGENTS.md` hard rule 2 repeats the first. Stage 6 re-reviewed verbatim spec wording at a cost of
about 1.9M subagent tokens, mostly rediscovering points the spec review had already ruled on.

Code tickets have their own gaps. Epic 0005 wrote tests in batches ahead of their reds three times,
although each occurrence was recorded; about 41 mutations ran without being in an approved table;
and red evidence was kept in loose `git hash-object -w` blobs that `git gc` can delete. The owner's
ruling D1, that a standing "do it to completion" is not test plan approval, lives only in a ticket
and in agent memory.

Finally, nothing allows an urgent privacy or legal takedown. Charter Must-hold 5 freezes a
delivered deck except for typos and broken links, and the deck track blocks a merge on any verifier
FAIL, even one unrelated to the deck. A photo of a person who asked to be removed could stay public
because of either rule.

## Solution

The repository owner gets one written process for each kind of ticket, and one narrow exception
for takedowns:

- A **documentation-only ticket** is a defined term, marked in ticket frontmatter at stage 4. It
  runs an approved acceptance checklist instead of `/implement`, `/tdd` and the two tables. When
  the spec gives its text verbatim, stage 6 checks the text by exact comparison and reviews only
  what the comparison cannot.
- A **code ticket** keeps `/tdd`, now with explicit approval, one row per cycle, a mandatory
  mutation column and red records written into the ticket as diffs.
- A **takedown** may change a delivered deck and may merge despite a FAIL that already exists on
  `origin/main` and lies outside the deck's rows, on the owner's explicit instruction and approval.

## User Stories

1. As the repository owner, I want documentation-only tickets defined and marked, so that an agent
   knows from the ticket which process applies.
2. As the repository owner, I want a documentation-only ticket to run an acceptance checklist I
   approve, so that its evidence is real checks rather than tests that cannot fail.
3. As the repository owner, I want stage 6 of a verbatim ticket to skip re-reviewing settled
   wording, so that review effort goes where the spec review could not look.
4. As the repository owner, I want every test plan table, checklist and added row to wait for my
   explicit approval, so that a standing instruction never stands in for it.
5. As the repository owner, I want one row per cycle with each row's mutation fixed in advance, so
   that every red is genuine and was approved before it ran.
6. As the repository owner, I want red evidence written into the ticket, so that it survives
   `git gc` and travels with the PR.
7. As the repository owner, I want one stated time for the coverage report, so that the gate before
   stage 6 is unambiguous.
8. As the repository owner, I want to take down a person's photo or contested material from a
   delivered deck, so that privacy and legal requests are not blocked by the frozen-deck rule.
9. As the repository owner, I want such a takedown to merge despite a FAIL it did not cause, so
   that an unrelated defect does not keep the material public.

## Implementation Decisions

- **Documents changed.** The workflow doc (stages 5 and 6, deck track items 4 and 6), `AGENTS.md`
  (Charter Must-hold 5, hard rule 2, the slide hard rule on Assets rows), the tracker configuration
  (ticket format), the glossary, the ADR index, ADR-0008 (an amendment note), a new ADR-0009 and two
  new open questions. Every changed region has a target text, T1–T13.
- **No skill, script, test or deck changes** (grill Q11). The workflow doc carries the
  documentation-only branch of stage 5; the `implement` skill already defers to it for the coverage
  table and later gates. The residual risk is OQ-10.
- **Documentation-only ticket** (T9, K7–K9). The line is drawn by what a file is for, not by
  whether a script reads it: text for people and agents counts even where a script checks its form;
  code, configuration, files a script reads as settings or data, and decks do not. A ticket that
  turns out to need the second kind stops and returns to the owner.
- **Ticket keys** (T8, K1–K6). `docs_only: true` and `verbatim: true` are optional frontmatter keys,
  set at stage 4 and approved with the breakdown. `verbatim` requires `docs_only`. No script reads
  them.
- **Approval** (T1, T6, A1–A4). Explicit approval before the first test or the first changed file,
  and for each row added later, including an unplanned mutation. A standing instruction is not
  approval.
- **The code-ticket loop** (T1, L1–L5). One row is one test. Every row names its mutation before
  approval. Each cycle runs write, run, record red, implement, green before the next row's test is
  written. A first-run pass takes its red from the row's mutation.
- **Red records** (T1, R1–R3). In the ticket's Comments: the HEAD commit, the added test as a diff,
  the mutation as a unified diff when used, and the key failing lines. No evidence points at an
  object that no ref reaches. A custom `refs/evidence/…` ref was rejected because it is not pushed
  by default and does not appear in a PR (decision 2).
- **Coverage timing** (T1, T6, C1–C3). Before stage 6 for every ticket; results of stages 7–9 are
  added afterwards. A documentation-only ticket's coverage report is its checklist with every
  Result filled.
- **Checklist** (T1, Q1–Q5). Five columns; each item is a command or an exact comparison; run in
  order with each result recorded and no red; a failure and its rerun both stay; the last item runs
  the three existing checks.
- **Narrowed stage 6** (T2, S1–S3). For a verbatim ticket only: an exact comparison against the
  spec first, then a review of Comments, evidence against each AC and out-of-scope changes. A text
  that differs from the spec gets the full review.
- **Takedown** (T3, T5, D1–D3). Defined in the Charter as a removal of assets, their Assets rows and
  the deck's references, on the owner's explicit instruction, for privacy or a legal claim, and
  nothing else. Anything added or replaced is not a takedown.
- **Merge exception E** (T4, T7, D4–D12). One paragraph in two places, identical except for the
  ADR link path. Its conditions: removal only; every FAIL line also appears on `origin/main`, apart
  from shifted notices line numbers, and none points at the deck's rows; the owner explicitly
  approves the merge, recorded in the PR with the FAIL lines. A public deck needs a published
  Release to redeploy.
- **ADR-0009** (T10, T12) records the takedown decision, its alternatives and its amendment of
  ADR-0008, which gains an amendment note in the form ADR-0004 and ADR-0007 already use.

## Testing Decisions

- **No new tests.** Every ticket of this epic is documentation-only; its stage-5 evidence is an
  acceptance checklist in the form T1 defines. This epic is the first to use that form, so its
  tickets also exercise it.
- **What a good check is here.** An exact comparison of each landed region with its target text,
  with line breaks free only where the definitions say so; a `git diff --name-only` and a per-region
  diff check for scope (X1, X2); the three existing checks (X4). ADR-0009 is not verbatim and is
  checked against T10's list by reading.
- **Prior art.** T-0006's checklist (exact comparisons, `git diff --name-only`, the existing checks)
  and 0005's target texts T1–T9.
- **End to end.** The surface is the GitHub file view of the pushed ticket branch, driven before
  the merge by `/agent-browser` or a native browser tool the workflow accepts as equivalent (E1).
  Page text, not screenshots, is recorded. There is no harness for agent behaviour (OQ-1), so no
  run checks that an agent follows the new rules.

## Acceptance Criteria

- **AC1.** `docs/agents/workflow.md` holds T1–T4, by exact comparison, and no other change.
- **AC2.** `AGENTS.md` holds T5–T7, by exact comparison, and no other change.
- **AC3.** `docs/agents/issue-tracker.md` holds T8 and `GLOSSARY.md` holds T9, by exact comparison,
  and no other change.
- **AC4.** ADR-0009 exists with the frontmatter and every item T10 lists; `docs/README.md` holds
  T11; ADR-0008 holds T12; none has another change.
- **AC5.** `.proj.specs/OPEN-QUESTIONS.md` ends with T13, and no other change.
- **AC6.** E1 gives the result its matrix row states, recorded in Comments, naming the GitHub file
  view as the surface.
- **AC7.**
  - `git diff <B SHA>...HEAD --name-only`, with the latest recorded B, lists only the paths of X1.
  - Every changed line outside `.proj.tickets/` belongs to one of T1–T13 (X2).
  - B is the first Comment the ticket writes (X3).
  - The three checks exit 0 at HEAD (X4).

## Out of Scope

- The verifier's PASS line stating what it does not check (decision 5): the notices-grammar epic.
- The three item-6 sentences of OQ-8 (Ruling L3): the notices-grammar epic. T4 adds E to item 6
  without touching its other sentences, so that epic can add them later.
- A record script enforcing one row per cycle: OQ-9.
- Changes to the `implement`, `tdd`, `to-tickets` or `code-review` skills: OQ-10.
- The epic 0005 retrospective's items 4 (commit type) and 5 (checking matrix rows against rules
  before freeze), which the owner has not decided.
- Removing a whole deck from publication: already covered by the allowlist rule.
- ADR-0006 and other ADRs that mention the coverage table: history, not edited.

## Further Notes

- **Derived, not asked.** Three details follow from confirmed answers rather than from a direct
  question, and stage 3 should test them: a documentation-only ticket's coverage report is its
  filled checklist (C3); FAIL lines are compared apart from notices line numbers the removed rows
  shift (D8); E applies to a deck not yet delivered as well (D4).
- **Order against the notices-grammar epic.** That epic follows this one (decision 3) and will edit
  deck track item 6 again. T4 appends to the item, so the later edit starts from B0's sentences.
- **Stage 4.** The next ticket id is T-0009. Whether the epic lands as one ticket or several, each
  ticket names the T-texts and matrix rows it closes; X1 and X2 are judged on the HEAD of the last
  ticket to land.
