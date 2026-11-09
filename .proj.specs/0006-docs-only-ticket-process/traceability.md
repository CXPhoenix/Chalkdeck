# Traceability — 0006 documentation-only ticket process

Source of truth for scope. `spec.en.md` prose is derived from this file. The repository owner's
answers are quoted in `grill.md`; the stage-3 rulings are in `review/round-1.md`.

Revision 2 applies the round-1 Rulings R1–R6 and the parent fixes listed there. Under R1 the
takedown exception left this epic for epic 0007: revision 1's texts T3, T4, T5, T7, T10, T11, T12,
the exception text E and rows D1–D12 are removed here and stay readable in revision 1. Text IDs
are kept stable, so the remaining IDs have gaps; T14 and T15 are new.

Glossary terms used here (`GLOSSARY.md`): Repository owner, Deck, Template work,
Documentation-only ticket.

## Definitions

**B0.** `32a51620afcdffce920459ab662d7f42173b7217`, the `origin/main` commit this spec was written
against. Line numbers marked "at B0" were read there.

**Base (B).** The commit on `main` that a ticket branch starts from. Its full SHA is the ticket's
first Comment. A ticket branch does not merge or rebase onto `main` while the ticket is open unless
the repository owner agrees first; the Comment that re-records B quotes that agreement. Each
ticket's diffs are `git diff <B SHA>...HEAD`, with that ticket's latest recorded B.

**Code ticket.** A ticket that is not a documentation-only ticket.

**Ticket file.** The ticket's own `.proj.tickets/0006-docs-only-ticket-process/T-NNNN-<slug>.md`.

**Region.** The part of a file a target text replaces or adds, as each text below names it.

**Match.** A landed region matches its target text when the two are equal character for
character after this one normalisation: inside a paragraph or a list item, every run of whitespace
that contains a line break counts as one space. Nothing else is normalised. Table rows, headings,
code blocks and the lines between blocks are compared exactly, and an inserted block has exactly
one blank line before it and one after it. A rewrapped line that starts with `-`, `*`, `+`, `#`,
`>`, `|`, or digits followed by `.`, does not match.

**Drift.** A region whose text at B differs from its text at B0.

## Target texts

Each text replaces or adds exactly its region; nothing else in that file changes. Every ticket of
this epic lists, under Deliverable, which of these regions it lands.

**T1, `docs/agents/workflow.md` stage 5.** Replaces everything from the `## Stage 5 — Implement`
heading through the `**Gate:**` paragraph of that section (lines 112–135 at B0):

````markdown
## Stage 5 — Implement

Branch first: `tickets/<ticket-id>/<ticket-slug>`.

**Which kind of ticket.** A ticket is documentation-only (`docs_only: true`; term in
`GLOSSARY.md`) when every file it changes, apart from its own ticket file and the epic's review and
report files under `.proj.specs/`, is prose for people and agents: the notices, licenses, `AGENTS.md`, `docs/` prose, the
body text of a skill, even where a script checks that prose's form. A change to any of these
makes it a code ticket: code; tests; build or deploy configuration; the frontmatter of a skill or
of an agent role file; any YAML, JSON or TOML file; the `@AGENTS.md` import line in `CLAUDE.md`;
any other file a script reads as settings or data, such as `deploy/public-decks.txt`,
`docs/agents/skill-sources.json` and `scripts/style-skills-baseline.json`; or a deck. A ticket
that [ADR-0006](../adr/0006-characterization-tests-for-equivalence-rewrites.md) governs is never
documentation-only.

A code ticket runs `/implement`, which uses `/tdd`. A documentation-only ticket runs neither: it
follows its approved acceptance checklist, described below. If a documentation-only ticket turns
out to need a change that would make it a code ticket, stop before making that change and ask the
repository owner.

**Approval is explicit.** The repository owner approves the test plan table, or the checklist,
before the first test is written or any file other than the ticket file changes. Writing the
table into the ticket file for review is allowed. Any later change to an approved row (a row
added, edited or removed, or a mutation added or replaced) is approved before the affected test
is written or the item runs. Record each approval in the ticket's Comments with the date and the
owner's words quoted; an agent that relays an approval quotes the owner, not itself. A standing
instruction such as "do it to completion" is not approval. This rule outranks wording elsewhere
that carries approvals forward, in this repository's documents and skills.

**Before the first test — the test plan table.** One row is one test: one test method, or one
`subTest` or sub-case, each with its own records. This satisfies `/tdd`'s rule that no test is
written at an unconfirmed seam. Every row names, before the table is approved, the mutation that
gives it a red if its test passes on the first run.

| Seam | Test intent | Scope | Acceptance criterion | Boundary conditions | Mutation if the first run passes |
|---|---|---|---|---|---|

**Between the tables — the red → green loop, governed by `/tdd`.** One row per cycle, in this
order: write the row's test, run it, record its red, write the minimal implementation, run it and
record its green. Do not write the next row's test until the current row has both records.
Writing every test up front is the horizontal-slicing anti-pattern: bulk tests verify imagined
behaviour. Coverage is not a meaningful number here, because the code under test does not exist
yet.

A test may pass on its first run only when the behaviour it checks existed before this cycle; its
red record says which earlier row or which commit provides that behaviour. It then takes its red
from the row's mutation: apply the mutation, run the test, record the failure, restore the mutated
file. If the mutation does not make the test fail, stop and ask the repository owner; a
replacement mutation is a changed row. A first-run pass for behaviour that did not exist before
this cycle means the implementation came first: stop and ask the repository owner. A ticket that ADR-0006 governs follows that ADR's order
instead of this cycle, and its table still names every mutation for approval.

**Each record** goes in the ticket's Comments. A red record holds:

- the HEAD commit at the run;
- the output of `git diff HEAD` at the run, which shows the test added in this cycle, any
  uncommitted implementation and, when one is applied, the mutation;
- the failing test's name and the assertion or error message it printed.

A green record holds the HEAD commit and the passing test's name. The diffs in the ticket are the
evidence: never rely on a Git object or a local ref, such as a `git hash-object -w` blob, to hold
it.

**Before stage 6 — the coverage report table.** Now the numbers are real. Results from stages 7–9
are added to the ticket's Comments afterwards.

| Seam | Tests | Measured coverage | Acceptance criterion | Uncovered, and why |
|---|---|---|---|---|

**A documentation-only ticket** replaces both tables with one acceptance checklist, approved as
above:

| # | Acceptance criterion | How it is checked | Expected | Result |
|---|---|---|---|---|

- "How it is checked" is a command, or a comparison of a landed region against the text the spec
  gives for it.
- Result stays empty until the item runs, then records the commit it ran on and its outcome.
- Run the items in order; there is no red. A failing item keeps its Result, and each rerun after a
  fix is added to the same item's Result.
- One item checks scope: `git diff <B>...HEAD --name-only` lists only the files the ticket plans
  to change.
- Items that can only run at stage 8 are marked `(stage 8)` and filled then.
- The last item not marked `(stage 8)` runs `python3 scripts/verify-project.py`,
  `python3 -m unittest discover -s scripts -p 'test_*.py'` and
  `python3 scripts/check_style_skills.py`, expects all three to exit 0, and expects
  `git status --short` to print nothing.
- If one of those three checks already fails at B, stop and ask the repository owner.
- After any later change to a file the ticket changes, other than the ticket file, rerun every
  item not marked `(stage 8)`.

The checklist is the ticket's coverage report once every item not marked `(stage 8)` has a
latest Result equal to its Expected, all from the same commit.

**Gate:** the test plan table or the checklist is approved before the first test is written or any
file other than the ticket file changes; the coverage report table, or the checklist meeting the
condition above, exists before stage 6.
````

**T2, `docs/agents/workflow.md` stage 6.** A new paragraph right after the paragraph that starts
"Run `/code-review`." in the `## Stage 6 — Review the change` section:

````markdown
**Verbatim regions.** A ticket with `verbatim: true` lists the regions whose complete text its spec
gives. For each listed region, the stage-6 review itself, not the ticket's implementer, compares
the landed text with the spec's text by the comparison the spec defines (character for character
when it defines none), and records the command
and its output in the ticket's Comments. A region that matches is not reviewed again for its
wording; for those regions only, this replaces the full-diff review the `code-review` skill would
otherwise give. A region that does not match, and the rest of the change, including the ticket's
Comments, the evidence behind each acceptance criterion and any change outside the ticket's scope,
get the full review.
````

**T6, `AGENTS.md` hard rule 2.** Replaces item 2 of "Hard rules":

````markdown
2. **Two tables gate a ticket's tests.** A **test plan table** before the first test is written, which
   the repository owner approves explicitly; a **coverage report table** before stage 6. Between
   them, `/tdd` governs the loop: one row, one test, one minimal implementation per cycle. A
   documentation-only ticket uses one approved acceptance checklist instead; see the workflow doc.
````

**T8, `docs/agents/issue-tracker.md` ticket format.** A new paragraph and block right after the
paragraph that starts "Tickets are single-file and English-primary":

````markdown
**Two optional frontmatter keys** mark a ticket's kind. Both are set at stage 4 and shown in the
breakdown the repository owner approves:

```yaml
docs_only: true   # a documentation-only ticket (GLOSSARY.md)
verbatim: true    # only with docs_only: the spec gives the complete text of the regions listed under Deliverable
```

A ticket without `docs_only: true` is a code ticket. Write each key only as `key: true`. Any other
value, or `verbatim` without `docs_only`, is an error: fix the breakdown before stage 5 starts.
After stage 4, adding, removing or changing a key needs the owner's approval, recorded in the
ticket's Comments; a ticket that loses `docs_only` loses `verbatim` with it. Stages 5 and 6 of
[workflow.md](workflow.md) say what each key changes.
````

**T9, `GLOSSARY.md`.** A new entry right after the **Template work** entry, under "Work":

````markdown
**Documentation-only ticket** (純文件票):
A ticket that changes only prose written for people and agents to read, not code, configuration,
a file a script reads as settings or data, or a deck. It is marked as one when the epic is broken
into tickets.
_Avoid_: docs ticket, prose ticket
````

**T13, `.proj.specs/OPEN-QUESTIONS.md`.** Two entries appended at the end, in the file's format:

````markdown
## OQ-9 — A record script that enforces one row per cycle

- **Question:** Should a script refuse to record a second red under the same test state, so that
  "one row per cycle" is enforced rather than only written down?
- **Why open:** Batch-written tests recurred three times in epic 0005 although each was recorded
  (`0005-license-reference-check/retrospective.md`, 「下次要改」 item 1). Epic 0006 writes the
  rule into `docs/agents/workflow.md`; a script is code, outside that documentation-only epic
  (`0006-docs-only-ticket-process/grill.md`, decision 1).
- **Blocks:** nothing now; the rule relies on the agent and on stage 6.
- **Settles it:** a template-work epic that adds the script with its tests, or a code epic, such as
  the notices-grammar epic, that runs under the written rule without a recurrence.

## OQ-10 — Project skills that predate the epic 0006 rules

- **Question:** Should the project skills state the epic 0006 rules themselves?
- **Why open:** Epic 0006 left the skills unchanged (`0006-docs-only-ticket-process/grill.md`,
  Q11; `review/round-1.md`, R5 and R6). Only `docs/agents/workflow.md` says that a
  documentation-only ticket skips `/implement` and `/tdd`, that verbatim regions skip the
  `code-review` skill's full-diff review, and that explicit approval outranks the carry-forward
  wording in the `tdd` skill and `docs/agents/codex.md`. The `tune-skills` keep list still names
  "the two test tables".
- **Blocks:** nothing now; an agent that loads a skill without reading the workflow doc may follow
  the old rule.
- **Settles it:** the next `/tune-skills` run, which carries these rules into `implement`, `tdd`,
  `to-tickets`, `code-review` and the keep list, in both runtimes.
````

**T14, `AGENTS.md` pipeline row 5.** Replaces the row that starts `| 5 | Implement |` in the
"Pipeline" table:

````markdown
| 5 | Implement | `/implement` + `/tdd`; a checklist for a documentation-only ticket | test plan table approved, then red → green; or the checklist approved, then every item passes |
````

**T15, `docs/agents/workflow.md` stage 4 gate.** Replaces the `**Gate:**` paragraph of
`## Stage 4 — Break into tickets` (lines 109–110 at B0):

````markdown
**Gate:** the repository owner approves the breakdown — granularity, blocking edges, what each
ticket delivers, and each ticket's kind: `docs_only`, and `verbatim` with its listed regions
([issue-tracker.md](issue-tracker.md)).
````

## Matrix

Each row is a behaviour the documents must state. "Carried by" names the text that states it; the
row is met when that text matches (AC1–AC4). E, X and Z rows are checked directly.

### Ticket kind

| ID | Type × field × boundary | Expected behaviour | Carried by | AC |
|---|---|---|---|---|
| K1 | ticket × no `docs_only` | a code ticket: `/implement` with `/tdd`, a test plan table, full stage 6 | T1, T8, T14 | AC1–AC3 |
| K2 | ticket × `docs_only: true`, no `verbatim` | a checklist instead of both tables; no `/implement` or `/tdd`; full stage 6 | T1, T8, T14 | AC1–AC3 |
| K3 | ticket × `docs_only: true` and `verbatim: true` | as K2, with listed regions reviewed by comparison | T1, T2, T8 | AC1, AC3 |
| K4 | ticket × `verbatim: true` without `docs_only: true` | an error; the breakdown is fixed before stage 5 | T8 | AC3 |
| K5 | ticket × a key with any value other than `true` | an error; the breakdown is fixed before stage 5 | T8 | AC3 |
| K6 | ticket × when the kind is set | at stage 4, shown in the breakdown the owner approves | T8, T15 | AC1, AC3 |
| K7 | file × prose (notices, licenses, `AGENTS.md`, `docs/` prose, a skill's body text), even where a script checks its form | may be changed by a documentation-only ticket | T1, T9 | AC1, AC3 |
| K8 | file × code, tests, build or deploy configuration, skill or agent-role frontmatter, YAML/JSON/TOML, the `CLAUDE.md` import line, other script-read settings or data, a deck | a ticket changing it is a code ticket | T1, T9 | AC1, AC3 |
| K9 | ticket × the ticket file and the epic's review reports | do not count toward the kind | T1 | AC1 |
| K10 | ticket × ADR-0006 governs it | never documentation-only | T1 | AC1 |
| K11 | documentation-only ticket × turns out to need a K8 change | stops before that change and asks the owner | T1 | AC1 |
| K12 | ticket × a key added, removed or changed after stage 4 | needs the owner's approval, recorded; losing `docs_only` drops `verbatim` | T8 | AC3 |
| K13 | `AGENTS.md` pipeline summary × stage 5 | names both the code-ticket loop and the checklist | T14 | AC2 |

### Approval (D1)

| ID | Type × field × boundary | Expected behaviour | Carried by | AC |
|---|---|---|---|---|
| A1 | test plan table × before the first test or any change outside the ticket file | explicit approval by the repository owner | T1, T6 | AC1, AC2 |
| A2 | checklist × before any change outside the ticket file | explicit approval by the repository owner | T1 | AC1 |
| A3 | ticket file × writing the draft table, B, status before approval | allowed | T1 | AC1 |
| A4 | approved row × added, edited or removed, or a mutation added or replaced | approved before the affected test is written or the item runs | T1 | AC1 |
| A5 | approval × record | in Comments, dated, the owner's words quoted; a relaying agent quotes the owner | T1 | AC1 |
| A6 | approval × a standing instruction such as "do it to completion" | not approval | T1 | AC1 |
| A7 | approval rule × carry-forward wording in other documents and skills | the approval rule outranks it | T1 | AC1 |
| A8 | checklist item × rerun after a fix | not a changed row; added to the same item's Result | T1 | AC1 |

### Loop and records (code tickets)

| ID | Type × field × boundary | Expected behaviour | Carried by | AC |
|---|---|---|---|---|
| L1 | test plan row × unit | one test method, or one `subTest` or sub-case, each with its own records | T1, T6 | AC1, AC2 |
| L2 | test plan row × mutation column | filled for every row before approval | T1 | AC1 |
| L3 | cycle × order | write the test, run it, record red, implement, run it, record green | T1 | AC1 |
| L4 | next row × current row lacks a red or a green record | its test is not written yet | T1 | AC1 |
| L5 | test × passes on its first run, behaviour existed before the cycle | the record names the earlier row or commit; red from the row's mutation, then restore | T1 | AC1 |
| L6 | test × passes on its first run, behaviour did not exist before the cycle | the implementation came first: stop and ask the owner | T1 | AC1 |
| L7 | mutation × the test still passes | stop and ask the owner; a replacement is a changed row (A4) | T1 | AC1 |
| L8 | ticket × ADR-0006 governs it | follows that ADR's order; every mutation still named for approval | T1 | AC1 |
| R1 | red record × contents | HEAD commit; `git diff HEAD` at the run; the failing test's name and message | T1 | AC1 |
| R2 | green record × contents | HEAD commit; the passing test's name | T1 | AC1 |
| R3 | evidence × a Git object or local ref (`git hash-object -w` blob, `refs/evidence/…`) | never relied on; the diffs in the ticket are the evidence | T1 | AC1 |

### Coverage and checklist

| ID | Type × field × boundary | Expected behaviour | Carried by | AC |
|---|---|---|---|---|
| C1 | code ticket × coverage report table | exists before stage 6 | T1, T6 | AC1, AC2 |
| C2 | any ticket × results of stages 7–9 | added to Comments afterwards | T1 | AC1 |
| C3 | documentation-only ticket × coverage report | the checklist once every unmarked item's latest Result equals Expected, from one commit | T1 | AC1 |
| Q1 | checklist × columns | `#`, acceptance criterion, how it is checked, expected, result | T1 | AC1 |
| Q2 | checklist item × how it is checked | a command, or a comparison against the spec's text | T1 | AC1 |
| Q3 | checklist item × Result | the commit it ran on and its outcome | T1 | AC1 |
| Q4 | checklist item × fails | its Result stays; each rerun is added to it | T1 | AC1 |
| Q5 | checklist × scope | one item: `git diff <B>...HEAD --name-only` lists only the planned files | T1 | AC1 |
| Q6 | checklist item × only runnable at stage 8 | marked `(stage 8)`, filled then, outside C3 | T1 | AC1 |
| Q7 | checklist × last unmarked item | the three checks exit 0 and `git status --short` prints nothing | T1 | AC1 |
| Q8 | checklist × one of the three checks fails at B | stop and ask the owner | T1 | AC1 |
| Q9 | checklist × a later change to a file the ticket changes, other than the ticket file | every unmarked item reruns | T1 | AC1 |

### Stage 6

| ID | Type × field × boundary | Expected behaviour | Carried by | AC |
|---|---|---|---|---|
| S1 | code ticket, or a ticket without `verbatim` | the full `/code-review`, unchanged from B0 | T2 | AC1 |
| S2 | listed verbatim region × matches | the stage-6 review runs and records the comparison; the region's wording is not re-reviewed | T2 | AC1 |
| S3 | listed verbatim region × does not match | the full review | T2 | AC1 |
| S4 | verbatim ticket × everything outside matched regions (Comments, evidence, out-of-scope changes) | the full review | T2 | AC1 |
| S5 | `code-review` skill × matched regions | its full-diff review is replaced for those regions only | T2 | AC1 |

### This epic's own tickets

| ID | Type × field × boundary | Expected behaviour | AC |
|---|---|---|---|
| Z1 | each 0006 ticket × before T1 and T2 land on `main` | runs under T1's checklist and T2's narrowed review, as an owner ruling recorded at stage 4 | AC7 |

### Texts, delivery and diff

| ID | Type × field × boundary | Expected behaviour | AC |
|---|---|---|---|
| T-rows | T1, T2, T6, T8, T9, T13, T14, T15 × after | each landed region matches its text | AC1–AC4 |
| E1 | E2E × GitHub file view of the pushed ticket branch, each file the ticket changes | the page shows rendered Markdown, not raw text or an error; T1's three tables and the Pipeline table render as tables with their header cells; T8's YAML renders as a code block; each relative link a landed text adds opens a file page; the page text of each landed region is recorded | AC5 |
| X1 | each ticket × `git diff <B>...HEAD --name-only` | lists only files among `docs/agents/workflow.md`, `AGENTS.md`, `docs/agents/issue-tracker.md`, `GLOSSARY.md`, `.proj.specs/OPEN-QUESTIONS.md`, files under `.proj.tickets/0006-docs-only-ticket-process/`, and files under `.proj.specs/0006-docs-only-ticket-process/review/` and `reports/`; outside `.proj.tickets/` and `.proj.specs/`, only files its Deliverable lists | AC6 |
| X2 | each ticket × regions | outside `.proj.tickets/` and `.proj.specs/`, every changed line belongs to a region the ticket lands | AC6 |
| X3 | each ticket × base | the ticket's first Comment is B, and the branch's first commit changes only the ticket file | AC6 |
| X4 | each ticket × at HEAD | the three checks exit 0 and `git status --short` prints nothing | AC6 |
| X5 | each ticket × drift | before its first change outside the ticket file, each region it lands is compared at B and B0; on drift, stop and ask the owner | AC6 |
| X6 | epic × all tickets landed | every region T1–T15 (removed IDs excepted) is landed by exactly one ticket | AC6 |

## Self-check of rules added in revision 2

Global rule 2 asks that each new rule be checked for complete parameters, closed boundaries and an
acceptance exit before review. Global rule 5 asks that each added guarantee be checked against
existing rules.

| Rule | Parameters | Boundaries closed by | Exit | Conflicts checked |
|---|---|---|---|---|
| Kind of ticket (T1, T9) | changed files, ADR-0006 | K7–K11 | AC1, AC3 | T-0006 changed `docs/agents/skill-sources.json`, a K8 file: under this rule it would have been two tickets (Ruling R2) |
| Ticket keys (T8, T15) | key, value, when | K1–K6, K12 | AC1, AC3 | no script under `scripts/` reads ticket frontmatter at B0; `/to-tickets` does not show the keys (OQ-10), so T15 puts them in the gate |
| Explicit approval (T1, T6) | approver, timing, changes, record, precedence | A1–A8 | AC1, AC2 | `issue-tracker.md` sets `processing` before the first edit and X3 writes B first: both touch only the ticket file (A3); carry-forward wording in `AGENTS.md` (template maintenance), `docs/agents/codex.md`, `workflow.md` stage 9 and the `tdd` skill is outranked, not edited (A7, OQ-10) |
| Loop (T1, T6) | unit, order, first-run pass, failed mutation | L1–L8 | AC1, AC2 | ADR-0006 keeps its scope and order (L8); L5–L6 narrow revision 1's unconditional mutation fallback |
| Records (T1) | contents, evidence | R1–R3 | AC1 | `git diff HEAD` captures uncommitted work; `docs/agents/language.md`'s `git hash-object` is for `synced_from_sha`, untouched |
| Coverage timing (T1, T6) | ticket kind, stages 7–9 | C1–C3 | AC1, AC2 | removes B0's "when the ticket closes" / "before stage 6" conflict; ADR-0006:12 stays as history |
| Checklist (T1) | columns, Result, failure, scope, stage 8, last item, rerun | Q1–Q9 | AC1 | stage-8 items no longer conflict with "every Result before stage 6" (Q6); T-0006's table is a prior instance |
| Verbatim regions (T2) | listed regions, who compares, record | S1–S5 | AC1 | the `code-review` skill is replaced only for matched regions and is unchanged (OQ-10); runtime.md's stage-6 evidence requirement still holds for everything else |
| Self-application (Z1) | which tickets, when | Z1 | AC7 | B0's hard rule 2 and stage 5 are overridden for 0006's tickets only, by an owner ruling at stage 4 |

### One rule, several texts

| Rule | Texts | Trigger | Scope | Exception |
|---|---|---|---|---|
| explicit approval | T1, T6 | before the first test (T1 also: any change outside the ticket file, any changed row) | test plan table; T1 also the checklist | none |
| approver | T1, T6, T8, T15 | — | "the repository owner" in all four | none |
| coverage timing | T1, T6 | before stage 6 | every ticket; T1 names the checklist form | stage-8 checklist items (T1 only) |
| one row per cycle | T1, T6 | each cycle | code tickets | ADR-0006 tickets (T1); T6 points documentation-only tickets to the checklist |
| ticket kind | T1, T8, T9, T14, T15 | stage 4 | T1 lists the files; T9 is the short definition; T8 the keys; T14 and T15 name both kinds | none |
