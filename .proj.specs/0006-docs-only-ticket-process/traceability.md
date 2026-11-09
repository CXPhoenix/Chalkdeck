# Traceability — 0006 documentation-only ticket process

Source of truth for scope. `spec.en.md` prose is derived from this file. The repository owner's
answers are quoted in `grill.md`; the stage-3 rulings are in `review/round-1.md` (R1–R6) and
`review/round-2.md` (S1–S4).

Revision 2 applied R1–R6. Under R1 the takedown exception left this epic for epic 0007: revision
1's texts T3, T4, T5, T7, T10, T11, T12, the exception text E and rows D1–D12 are removed and stay
readable in revision 1. Revision 3 applies S1–S4 and the parent fixes listed in `round-2.md`. It is
self-checked; no third review round runs (Ruling S4). Text IDs are kept stable, so the remaining
IDs have gaps.

Glossary terms used here (`GLOSSARY.md`): Repository owner, Deck, Deck content work, Template
work, Documentation-only ticket.

## Definitions

**B0.** `32a51620afcdffce920459ab662d7f42173b7217`, the `origin/main` commit this spec was written
against. Line numbers marked "at B0" were read there.

**B.** As T1 defines it: the commit on `main` a ticket branch starts from, recorded as the first
Comment written on the ticket branch and re-recorded only with the owner's agreement. Each ticket is judged against its
own latest recorded B.

**Code ticket.** A ticket that is not a documentation-only ticket.

**Ticket file.** The ticket's own `.proj.tickets/0006-docs-only-ticket-process/T-NNNN-<slug>.md`.

**Region.** The part of a file a target text replaces or adds, as each text below names it. The
blank lines that separate an inserted block from its neighbours belong to its region.

**Match.** A landed region matches its target text when the two are equal character for
character after one normalisation: inside a paragraph or a list item, every run of whitespace that
contains a line break counts as one space. Nothing else is normalised:

- table rows, headings, code blocks, and lines a text says stay lines of their own are compared
  exactly, line by line;
- a line that ends in two spaces is compared exactly;
- a rewrapped line that starts with `-`, `*`, `+`, `#`, `>`, `|`, or digits followed by `.`, does
  not match;
- an inserted block has one blank line before it, and one after it unless it ends the file, which
  then ends with a single newline.

**Drift.** For a region that replaces text: its text at B differs from its text at B0. For an
inserted region: the paragraph or entry it is inserted after differs between B and B0. A drift
ruling by the owner that lets the ticket proceed with different text is quoted in the ticket's
Comments, and the quoted text replaces the target text for that ticket's checks. T13's entries
take the next unused OQ numbers at B; renumbering is not drift.

## Target texts

Each text replaces or adds exactly its region; nothing else in that file changes. Every ticket of
this epic lists, under Deliverable, which regions it lands.

**T1, `docs/agents/workflow.md` stage 5.** Replaces everything from the `## Stage 5 — Implement`
heading through the `**Gate:**` paragraph of that section (lines 112–135 at B0):

````markdown
## Stage 5 — Implement

Branch first: `tickets/<ticket-id>/<ticket-slug>`, from `main`. **B** is the commit on `main` that
the branch starts from; record its full SHA as the first Comment written on the branch. While the
ticket is open, do not merge or rebase onto `main` unless the repository owner agrees; the Comment that
re-records B quotes that agreement.

**Which kind of ticket.** A ticket is documentation-only (`docs_only: true`; term in
`GLOSSARY.md`) when every change it makes, apart from its own ticket file and the epic's files under
`.proj.specs/<epic>/review/` and `.proj.specs/<epic>/reports/`, is to prose for people and agents,
even where a script checks that prose's form. Examples of such prose: the notices, licenses,
`GLOSSARY.md`, `AGENTS.md`, `README.md`, ADRs, specs, tickets, `.proj.specs/OPEN-QUESTIONS.md`,
`docs/` prose, and a skill's body text when the change alters none of the skill's instructions (a
typo, a link, a path, a license or provenance note). A change to any of these makes it a code
ticket:

- code or tests;
- build or deploy configuration;
- the frontmatter of a skill or of an agent role file;
- any YAML, JSON or TOML file;
- the `@AGENTS.md` import line in `CLAUDE.md`;
- the part of any file that a script reads as settings or data, such as
  `deploy/public-decks.txt`, `docs/agents/skill-sources.json`, `scripts/style-skills-baseline.json`,
  the `## Fixed components` section of a theme, the `{{PROJECT_NAME}}` token, or a reference file
  whose checksum the provenance file records.

A change to a skill's instructions is never documentation-only: a behaviour-changing skill edit
waits for the harness in [OQ-1](../../.proj.specs/OPEN-QUESTIONS.md), and a behaviour-preserving
rewrite is a code ticket under
[ADR-0006](../adr/0006-characterization-tests-for-equivalence-rewrites.md). A change to a deck is
deck content work, not a ticket.

A code ticket runs `/implement`, which uses `/tdd`. A documentation-only ticket runs neither: it
follows its approved acceptance checklist, described below. If a documentation-only ticket turns
out to need a change that would make it a code ticket, stop before making that change and ask the
repository owner. If the owner agrees to it, the ticket loses `docs_only` and `verbatim`
([issue-tracker.md](issue-tracker.md)), and a test plan table, approved as below, replaces the
checklist before the change is made.

**Approval is explicit.** The repository owner approves the test plan table, or the checklist,
before the first test is written or any file other than the ticket file changes; writing the
draft into the ticket file for review is allowed. Any later change to an approved row is approved
before the affected test is written or the item runs again: a row added, edited or removed, a
mutation added or replaced, or an Expected changed after its item ran, in which case the record
keeps the old Expected. Recording a Result or a rerun is not a change to a row. Record each
approval in the ticket's Comments with the date, the commit that holds the approved table, the
question the owner answered, and the owner's words quoted; an agent that relays an approval quotes
the owner, not itself. A standing instruction such as "do it to completion" is not approval. For
test plan tables and checklists, this rule outranks wording elsewhere that carries approvals
forward, in this repository's documents and skills; it does not change how stage 9 authorizes
landing.

**Before the first test — the test plan table.** One row is one test: one test method, or one
`subTest` or sub-case, each with its own records. This satisfies `/tdd`'s rule that no test is
written at an unconfirmed seam. Every row names, before the table is approved, the mutation that
gives it a red if its test passes on the first run. A mutation changes the code under test or a
fixture, never the test itself.

| Seam | Test intent | Scope | Acceptance criterion | Boundary conditions | Mutation if the first run passes |
|---|---|---|---|---|---|

**Between the tables — the red → green loop, governed by `/tdd`.** One row per cycle, in this
order: write the row's test, run it, record its red, write the minimal implementation, run it and
record its green, then commit the cycle. Do not write the next row's test until the current
row's cycle is committed. Before each run, `git add -N` every new file, so that `git diff HEAD`
shows it. Writing every test up front is the horizontal-slicing anti-pattern: bulk tests verify
imagined behaviour. Coverage is not a meaningful number here, because the code under test does not
exist yet.

A test may pass on its first run only when the behaviour it checks already exists at B or was made
green by an earlier row's committed cycle; its red record names B or that row. It then takes its
red from the row's mutation: apply the mutation, run the test, record the failure, restore the
mutated file, then run the test again and record its green. If the mutation does not make the test
fail, stop and ask the repository owner; a replacement mutation is a changed row. Any other
first-run pass means the implementation came first: stop and ask the repository owner. A ticket
that ADR-0006 governs follows that ADR's order instead of this cycle; its table still names every
mutation for approval, and its records take the form below.

**Each record** goes in the ticket's Comments. A red record holds:

- the HEAD commit at the run;
- the output of `git diff HEAD -- . ':!<ticket file>'` at the run, which shows this cycle's test,
  any implementation written in this cycle and, when one is applied, the mutation;
- the failing test's name and the assertion or error message it printed. An error because the
  code under test does not exist yet counts as a red; an error in the test itself does not.

A green record holds the HEAD commit, the same diff and the passing test's name. The diffs in the
ticket are the evidence: never rely on a Git object or a local ref, such as a `git hash-object -w`
blob, to hold it.

**Before stage 6 — the coverage report table.** Now the numbers are real. A later change that adds
or changes a row updates the table before the next review continues. Results from stages 7–9 are
added to the ticket's Comments afterwards.

| Seam | Tests | Measured coverage | Acceptance criterion | Uncovered, and why |
|---|---|---|---|---|

**A documentation-only ticket** replaces both tables with one acceptance checklist, approved as
above:

| # | Acceptance criterion | How it is checked | Expected | Result |
|---|---|---|---|---|

- Every acceptance criterion of the ticket has at least one item.
- "How it is checked" is a command. A comparison of a landed region against the spec's text is a
  script, whose source and full output go in the ticket.
- Run items on a committed tree: `git status --short` lists nothing but the ticket file. Result
  records the commit, the output and the outcome; "Result equals Expected" compares the outcome.
- Run the items in order; there is no red. A failing item keeps its Result, and each rerun after a
  fix is added to the same item's Result.
- One item checks scope: `git diff <B>...HEAD --name-only` lists only the files the ticket's
  Deliverable names, the ticket file, and the epic's review and report files.
- Items that can only run at stage 8 are marked `(stage 8)` and filled then; a failing
  `(stage 8)` item blocks stage 9.
- The last item not marked `(stage 8)` runs `python3 scripts/verify-project.py`,
  `python3 -m unittest discover -s scripts -p 'test_*.py'`,
  `python3 scripts/check_style_skills.py`, and the tests of any skill whose files the ticket
  changes, and expects each to exit 0.
- Before the first change, run those checks at B and record the output. If one already fails at B,
  stop and ask the repository owner, who chooses one of two outcomes: the failure is fixed in
  another ticket first and B is re-recorded with that agreement; or the ticket proceeds with that
  item's Expected quoting the exact failure lines at B, and any further failure line fails the
  item.
- After any later change to a file the ticket changes, other than the ticket file, rerun every item
  not marked `(stage 8)`.

The checklist is the ticket's coverage report once every item not marked `(stage 8)` has a latest
outcome equal to its Expected, all from runs on one commit; a commit that changes only the ticket
file counts as the same commit.

**Gate:** the test plan table or the checklist is approved before the first test is written or any
file other than the ticket file changes; the coverage report table, or the checklist meeting the
condition above, exists before stage 6.
````

**T2, `docs/agents/workflow.md` stage 6.** A new paragraph right after the paragraph that starts
"Run `/code-review`." in the `## Stage 6 — Review the change` section:

````markdown
**Verbatim regions.** A ticket with `docs_only: true` and `verbatim: true` lists the regions whose
complete text its spec gives. For each listed region the ticket records a comparison script, its
source and its full output. The script compares the landed text, at its place in the file, with
the spec's text as it stands on `main` at the ticket's B, by the comparison the spec defines
(character for character when it defines none). The stage-6 Spec axis reads the script and the spec text and
confirms that the script compares the right regions at the right places. A region whose recorded
comparison matches is not reviewed again for its wording; for those regions only, this replaces the
full-diff review that the `code-review` skill and `runtime.md` would otherwise require. A region
that does not match, a region changed after its comparison ran, and the rest of the change,
including the ticket's Comments, the evidence behind each acceptance criterion and any change
outside the ticket's scope, get the full review.
````

**T6, `AGENTS.md` hard rule 2.** Replaces item 2 of "Hard rules":

````markdown
2. **Two tables gate a ticket's tests.** A **test plan table**, which the repository owner approves
   explicitly before the first test is written or any file other than the ticket file changes; a
   **coverage report table** before stage 6. Between them, `/tdd` governs the loop: one row, one
   test, one minimal implementation per cycle. A documentation-only ticket uses one approved
   acceptance checklist instead; see the workflow doc.
````

**T8, `docs/agents/issue-tracker.md` ticket format.** A new block right after the paragraph that
starts "Tickets are single-file and English-primary":

````markdown
**Two optional frontmatter keys** mark a ticket's kind:

```yaml
docs_only: true
verbatim: true
```

`docs_only: true` marks a documentation-only ticket (`GLOSSARY.md`). `verbatim: true`, only with
`docs_only: true`, says the spec gives the complete text of the regions listed under the ticket's
Deliverable. A ticket without `docs_only: true` is a code ticket. Both keys are set at stage 4,
shown in the breakdown the repository owner approves, and that approval is recorded in each
ticket's Comments. Write each key only as `key: true`. Any other value, or `verbatim` without
`docs_only`, is an error: fix the breakdown before the ticket's status becomes `processing`.
Later, adding, removing or changing a key needs the owner's approval, recorded in the ticket's
Comments; a ticket that loses `docs_only` loses `verbatim` with it. Stages 5 and 6 of
[workflow.md](workflow.md) say what each key changes.
````

**T9, `GLOSSARY.md`.** A new entry right after the **Template work** entry, under "Work". The
term line and the `_Avoid_` line stay lines of their own; only the definition between them may
wrap:

````markdown
**Documentation-only ticket** (純文件票):
A ticket that changes only prose written for people and agents to read, even where a script checks
that prose's form: not code, configuration, the part of a file a script reads as settings or data,
a skill's instructions, or a deck. It is marked as one when the epic is broken into tickets, and
the mark changes later only with the repository owner's approval.
_Avoid_: docs ticket, prose ticket
````

**T13, `.proj.specs/OPEN-QUESTIONS.md`.** Two entries appended at the end, in the file's format,
numbered as the Drift definition says:

````markdown
## OQ-9 — A record script that enforces one row per cycle

- **Question:** Should a script refuse to record a second red under the same test state, so that
  "one row per cycle" is enforced rather than only written down?
- **Why open:** Batch-written tests recurred three times in epic 0005 although each was recorded
  (`0005-license-reference-check/retrospective.md`, 「下次要改」 item 1). Epic 0006 writes the
  rule, with one commit per cycle, into `docs/agents/workflow.md`; a script is code, outside that
  documentation-only epic (`0006-docs-only-ticket-process/grill.md`, decision 1).
- **Blocks:** nothing now; the rule relies on the agent and on stage 6.
- **Settles it:** a template-work epic that adds the script with its tests, or a code epic, such as
  the notices-grammar epic, that runs under the written rule without a recurrence in its committed
  cycles.

## OQ-10 — Project skills that predate the epic 0006 rules

- **Question:** Should the project skills state the epic 0006 rules themselves?
- **Why open:** Epic 0006 left the skills unchanged (`0006-docs-only-ticket-process/grill.md`,
  Q11; `review/round-1.md`, R5 and R6). Only `docs/agents/workflow.md` and `AGENTS.md` say that a
  documentation-only ticket skips `/implement` and `/tdd`, that verbatim regions skip the
  `code-review` skill's full-diff review, and that explicit approval outranks the carry-forward
  wording in the `implement` and `tdd` skills, `docs/agents/runtime.md` and
  `docs/agents/codex.md`. The `tune-skills` keep list still names "the two test tables", and
  `/to-tickets` does not show a ticket's kind.
- **Blocks:** nothing now; an agent that loads a skill without reading the workflow doc may follow
  the old rule.
- **Settles it:** a template-work epic that edits `implement`, `tdd`, `to-tickets`, `code-review`
  and the `tune-skills` keep list in both runtimes, records each local adaptation in
  `docs/agents/skill-sources.json`, and aligns `docs/agents/runtime.md` and `docs/agents/codex.md`.
````

**T14, `AGENTS.md` pipeline row 5.** Replaces the row that starts `| 5 | Implement |` in the
"Pipeline" table:

````markdown
| 5 | Implement | `/implement` + `/tdd`; a checklist for a documentation-only ticket | test plan table approved, then red → green; or the checklist approved, then every item not marked `(stage 8)` passes |
````

**T15, `docs/agents/workflow.md` stage 4 gate.** Replaces the `**Gate:**` paragraph of
`## Stage 4 — Break into tickets` (lines 109–110 at B0):

````markdown
**Gate:** the repository owner approves the breakdown — granularity, blocking edges, what each
ticket delivers, and each ticket's kind: `docs_only`, and `verbatim` with its listed regions
([issue-tracker.md](issue-tracker.md)). Each ticket's Comments record that approval with the
owner's words.
````

## Matrix

Each row is a behaviour the documents must state. "Carried by" names the text that states it; the
row is met when that text matches (AC1–AC4). E, X and Z rows are checked directly.

### Ticket kind

| ID | Type × field × boundary | Expected behaviour | Carried by | AC |
|---|---|---|---|---|
| K1 | ticket × no `docs_only` | a code ticket: `/implement` with `/tdd`, a test plan table, full stage 6 | T1, T2, T6, T8, T14 | AC1–AC3 |
| K2 | ticket × `docs_only: true`, no `verbatim` | a checklist instead of both tables; no `/implement` or `/tdd`; full stage 6 | T1, T2, T6, T8, T14 | AC1–AC3 |
| K3 | ticket × `docs_only: true` and `verbatim: true` | as K2, with listed regions reviewed by recorded comparison | T1, T2, T8 | AC1, AC3 |
| K4 | ticket × `verbatim: true` without `docs_only: true` | an error, fixed before `processing`; T2 does not apply | T2, T8 | AC1, AC3 |
| K5 | ticket × a key with any value other than `true` | an error, fixed before `processing` | T8 | AC3 |
| K6 | ticket × when the kind is set | at stage 4, shown in the approved breakdown, approval recorded in each ticket | T8, T15 | AC1, AC3 |
| K7 | change × prose (examples in T1), even where a script checks its form | may be made by a documentation-only ticket | T1, T9 | AC1, AC3 |
| K8 | change × code, tests, build or deploy configuration, skill or agent-role frontmatter, YAML/JSON/TOML, the `CLAUDE.md` import line, the script-read part of any file | makes a code ticket | T1, T9 | AC1, AC3 |
| K9 | change × a skill's instructions | never documentation-only: OQ-1 blocks it, or ADR-0006 governs it as a code ticket | T1, T9 | AC1, AC3 |
| K10 | change × a skill's body text that alters no instruction (typo, link, path, license or provenance note) | prose (K7) | T1 | AC1 |
| K11 | change × a deck | deck content work, not a ticket | T1, T9 | AC1, AC3 |
| K12 | ticket × its own ticket file and the epic's review and report files | do not count toward the kind | T1 | AC1 |
| K13 | documentation-only ticket × turns out to need a K8 or K9 change | stops before that change; on the owner's agreement loses `docs_only` and `verbatim`, and an approved test plan table replaces the checklist before the change | T1, T8 | AC1, AC3 |
| K14 | ticket × a key added, removed or changed after stage 4 | needs the owner's approval, recorded | T8, T9 | AC3 |
| K15 | `AGENTS.md` pipeline summary × stage 5 | names both the code-ticket loop and the checklist, with the stage-8 exception | T14 | AC2 |

### Approval (D1)

| ID | Type × field × boundary | Expected behaviour | Carried by | AC |
|---|---|---|---|---|
| A1 | test plan table × before the first test or any change outside the ticket file | explicit approval by the repository owner | T1, T6 | AC1, AC2 |
| A2 | checklist × before any change outside the ticket file | explicit approval by the repository owner | T1 | AC1 |
| A3 | ticket file × the draft table, B, status before approval | allowed | T1 | AC1 |
| A4 | approved row × added, edited or removed; mutation added or replaced; Expected changed after its run | approved before the affected test is written or the item runs again; the old Expected stays in the record | T1 | AC1 |
| A5 | approval × record | in Comments: date, commit holding the approved table, the question answered, the owner's words quoted; a relaying agent quotes the owner | T1 | AC1 |
| A6 | approval × a standing instruction such as "do it to completion" | not approval | T1 | AC1 |
| A7 | approval rule × carry-forward wording in other documents and skills | outranks it for tables and checklists; stage 9's landing authority is unchanged | T1 | AC1 |
| A8 | checklist item × a Result or a rerun recorded | not a change to a row | T1 | AC1 |

### Loop and records (code tickets)

| ID | Type × field × boundary | Expected behaviour | Carried by | AC |
|---|---|---|---|---|
| L1 | test plan row × unit | one test method, or one `subTest` or sub-case, each with its own records | T1, T6 | AC1, AC2 |
| L2 | test plan row × mutation column | filled for every row before approval; changes code under test or a fixture, never the test | T1 | AC1 |
| L3 | cycle × order | write the test, run, record red, implement, run, record green, commit the cycle | T1 | AC1 |
| L4 | next row × current cycle not committed | its test is not written yet | T1 | AC1 |
| L5 | run × a new file | `git add -N` first, so the diff shows it | T1 | AC1 |
| L6 | test × first-run pass, behaviour at B or from an earlier committed cycle | the record names B or that row; red from the mutation, restore, record green | T1 | AC1 |
| L7 | test × any other first-run pass | the implementation came first: stop and ask the owner | T1 | AC1 |
| L8 | mutation × the test still passes | stop and ask the owner; a replacement is a changed row (A4) | T1 | AC1 |
| L9 | ticket × ADR-0006 governs it | follows that ADR's order; mutations named for approval; records as V1–V2 | T1 | AC1 |
| V1 | red record × contents | HEAD; `git diff HEAD` excluding the ticket file; the failing test's name and message; an error in the test itself is not a red | T1 | AC1 |
| V2 | green record × contents | HEAD; the same diff; the passing test's name | T1 | AC1 |
| V3 | evidence × a Git object or local ref | never relied on; the diffs in the ticket are the evidence | T1 | AC1 |

### Coverage and checklist

| ID | Type × field × boundary | Expected behaviour | Carried by | AC |
|---|---|---|---|---|
| C1 | code ticket × coverage report table | exists before stage 6; updated before review continues after a change that adds or changes a row | T1, T6 | AC1, AC2 |
| C2 | any ticket × results of stages 7–9 | added to Comments afterwards | T1 | AC1 |
| C3 | documentation-only ticket × coverage report | the checklist once every unmarked item's latest outcome equals Expected, from one commit (ticket-file-only commits count as the same) | T1 | AC1 |
| Q1 | checklist × columns and coverage | `#`, acceptance criterion, how it is checked, expected, result; every AC has an item | T1 | AC1 |
| Q2 | checklist item × how it is checked | a command; a comparison is a script whose source and output are recorded | T1 | AC1 |
| Q3 | checklist item × run | on a committed tree; Result holds the commit, the output and the outcome | T1 | AC1 |
| Q4 | checklist × order and failure | in order; a failing item's Result stays and reruns are added to it | T1 | AC1 |
| Q5 | checklist × scope | one item: `git diff <B>...HEAD --name-only` lists only the Deliverable's files, the ticket file, and the epic's review and report files | T1 | AC1 |
| Q6 | checklist item × only runnable at stage 8 | marked `(stage 8)`, filled then, outside C3; a failure blocks stage 9 | T1, T14 | AC1, AC2 |
| Q7 | checklist × last unmarked item | the three checks and the changed skills' own tests exit 0 | T1 | AC1 |
| Q8 | checklist × a check already fails at B | recorded at B before the first change; stop and ask; the owner chooses a fix in another ticket with B re-recorded, or Expected quoting the exact failure lines | T1 | AC1 |
| Q9 | checklist × a later change to a file the ticket changes, other than the ticket file | every unmarked item reruns | T1 | AC1 |

### Stage 6

| ID | Type × field × boundary | Expected behaviour | Carried by | AC |
|---|---|---|---|---|
| S1 | code ticket, or a ticket without `docs_only` and `verbatim` | the full `/code-review`, unchanged from B0 | T2 | AC1 |
| S2 | listed verbatim region × recorded comparison matches | the Spec axis confirms the script compares the right regions at the right places; wording not re-reviewed | T2 | AC1 |
| S3 | listed verbatim region × does not match, or changed after its comparison | the full review | T2 | AC1 |
| S4 | verbatim ticket × everything outside matched regions (Comments, evidence, out-of-scope changes) | the full review | T2 | AC1 |
| S5 | `code-review` skill and `runtime.md` × matched regions | their full-diff review is replaced for those regions only | T2 | AC1 |
| S6 | comparison × which spec text | the spec's text on `main` at the ticket's B, so a branch cannot edit what it is compared against | T2 | AC1 |

### This epic's own tickets

| ID | Type × field × boundary | Expected behaviour | AC |
|---|---|---|---|
| Z1 | each 0006 ticket × before T1, T2, T6, T8, T14 and T15 land on `main` | carries `docs_only` (and `verbatim` where it lists regions), runs under T1's checklist and T2's verbatim review, as an owner ruling recorded in its Comments | AC7 |

### Texts, delivery and diff

| ID | Type × field × boundary | Expected behaviour | AC |
|---|---|---|---|
| T-rows | T1, T2, T6, T8, T9, T13, T14, T15 × after | each landed region matches its text, or the drift-ruled text that replaces it | AC1–AC4 |
| E1 | E2E × GitHub file view of the pushed ticket branch, each Markdown file the ticket lands a region in, before the merge, by `/agent-browser` or an accepted native browser tool | the page shows rendered Markdown, not raw text or an error; T1's three tables and the Pipeline table render as tables with their header cells, read from the accessibility tree; T8's YAML renders as a code block; each relative link a landed text adds opens a file page; the page text of each landed region is recorded | AC5 |
| X1 | each ticket × `git diff <B>...HEAD --name-only` | lists only files among `docs/agents/workflow.md`, `AGENTS.md`, `docs/agents/issue-tracker.md`, `GLOSSARY.md`, `.proj.specs/OPEN-QUESTIONS.md`, the ticket file, and files under `.proj.specs/0006-docs-only-ticket-process/review/` and `.proj.specs/0006-docs-only-ticket-process/reports/`; outside `.proj.tickets/` and that spec directory, only files its Deliverable lists | AC6 |
| X2 | each ticket × regions | outside `.proj.tickets/` and that spec directory, every changed line belongs to a region the ticket lands | AC6 |
| X3 | each ticket × base | the first Comment the branch adds is B (Comments written at stage 4, before the branch exists, come before it); any later B is re-recorded with the owner's agreement quoted; the branch's first commit changes only the ticket file | AC6 |
| X4 | each ticket × final commit | the three checks exit 0 and `git status --short` prints nothing | AC6 |
| X5 | each ticket × drift | before its first change outside the ticket file, and again after any re-recorded B, each region it lands is checked for drift; on drift, stop and ask the owner | AC6 |
| X6 | epic × breakdown and landing | the stage-4 breakdown assigns every region of T1, T2, T6, T8, T9, T13, T14 and T15 to exactly one ticket, recorded in the tickets' Deliverables; the last ticket to land confirms each region landed | AC6 |

## Self-check of rules added or changed in revisions 2 and 3

Global rule 2 asks that each new rule be checked for complete parameters, closed boundaries and an
acceptance exit before review. Global rule 5 asks that each added guarantee be checked against
existing rules. Revision 3 is not reviewed again (Ruling S4), so this check is its only gate.

| Rule | Parameters | Boundaries closed by | Exit | Conflicts checked |
|---|---|---|---|---|
| Kind of ticket (T1, T9) | change, file part, skill instructions, deck | K7–K13 | AC1, AC3 | T-0006 changed `docs/agents/skill-sources.json`, a K8 file: two tickets under this rule (R2); OQ-1 keeps blocking skill-instruction edits (K9, S2); ADR-0006 keeps its scope; `themes/*.md` prose outside `## Fixed components` stays prose |
| Ticket keys (T8, T15) | key, value, when, record | K1–K6, K14 | AC1, AC3 | no script under `scripts/` reads ticket frontmatter at B0; `/to-tickets` does not show the keys (OQ-10), so T15 puts them in the gate |
| Explicit approval (T1, T6) | approver, timing, changes, record, precedence | A1–A8 | AC1, AC2 | `processing` and B touch only the ticket file (A3); carry-forward wording in `AGENTS.md`, `docs/agents/codex.md`, `docs/agents/runtime.md` and the `implement` and `tdd` skills is outranked for tables and checklists only, not edited (A7, OQ-10); stage 9 unchanged |
| Loop (T1, T6) | unit, order, commit, first-run pass, failed mutation | L1–L9 | AC1, AC2 | ADR-0006 keeps its order (L9); per-cycle commits make each red diff this cycle's alone, so batching shows as a cycle with more than one test |
| Records (T1) | contents, evidence | V1–V3 | AC1 | the diff excludes the ticket file, so records do not accumulate; `docs/agents/language.md`'s `git hash-object` is for `synced_from_sha`, untouched |
| Coverage timing (T1, T6) | ticket kind, later changes, stages 7–9 | C1–C3 | AC1, AC2 | removes B0's "when the ticket closes" / "before stage 6" conflict; ADR-0006:12 stays as history |
| Checklist (T1) | items, commands, tree state, order, scope, stage 8, last item, B failures, reruns | Q1–Q9 | AC1 | "same commit" tolerates ticket-file-only commits, so recording Results does not break it; the B-failure exit cannot hide a new failure line (S3) |
| Verbatim regions (T2) | listed regions, script, the spec on `main` at B, Spec axis | S1–S6 | AC1 | read-only reviewers can read a recorded script and output (S1 ruling); requires `docs_only` (K4) |
| Self-application (Z1) | which tickets, which texts | Z1 | AC7 | B0's stage 4 gate, stage 5, stage 6, ticket format, hard rule 2 and pipeline row 5 are overridden for 0006's tickets only, by an owner ruling recorded in each ticket |

### One rule, several texts

| Rule | Texts | Trigger | Scope | Exception |
|---|---|---|---|---|
| explicit approval | T1, T6, T8, T15 | T1, T6: before the first test or any change outside the ticket file; T8, T15: the breakdown and later key changes | tables, checklists (T1, T6); ticket kind (T8, T15) | none |
| approver | T1, T6, T8, T9, T15 | — | "the repository owner" in all five | none |
| coverage timing | T1, T6 | before stage 6 | every ticket | `(stage 8)` items (T1, T14) |
| stage 5 gate | T1, T6, T14 | stage 5 | code ticket: table approved, red → green; documentation-only: checklist approved, unmarked items pass | `(stage 8)` items in T1 and T14 alike |
| one row per cycle | T1, T6 | each cycle | code tickets | ADR-0006 tickets (T1) |
| ticket kind | T1, T8, T9, T14, T15 | stage 4 | T1 lists changes and examples; T9 is the short definition, with the same exclusions; T8 the keys; T14 and T15 name both kinds | the ticket file and review and report files (T1 only; T9 speaks of the ticket's changes) |
| verbatim regions | T2, T8, T15 | stage 4 listing, stage 6 review | listed regions only; requires `docs_only` in T2 and T8 | none |

## Correction after stage 4 (2026-11-09)

Found while writing T-0009 and approved by the repository owner ("套用並開 PR"). Revision 3 said B
is "the ticket's first Comment" (T1, the B definition, X3), while T8 and T15 record the stage-4
breakdown approval in each ticket's Comments before the ticket branch exists, so no ticket could
meet X3 as written. The three places now say "the first Comment written on the branch". The intent
is unchanged: B is recorded before any other change on the branch. No review round runs for this
correction. `spec.en.md` (Implementation Decisions, "B in the workflow") and `spec.zh-TW.md` carry
the same wording and are corrected with it; the translation's `synced_from_sha` is updated.
