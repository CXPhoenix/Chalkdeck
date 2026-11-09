# Traceability — 0006 documentation-only ticket process

Source of truth for scope. `spec.en.md` prose is derived from this file. The repository owner's
answers are quoted in `grill.md`. Revision 1.

Glossary terms used here (`GLOSSARY.md`): Repository owner, Deck, Delivered deck, Public deck,
Deck content work, Template work, Documentation-only ticket.

## Definitions

**B0.** `32a51620afcdffce920459ab662d7f42173b7217`, the `origin/main` commit this spec was written
against. Line numbers marked "at B0" were read there.

**Base (B).** The commit on `main` that a ticket branch starts from. Its full SHA is the first
entry in the ticket's Comments. A ticket branch does not merge `main` while the ticket is open
unless the repository owner agrees first; the Comment that re-records B quotes that agreement.
Every diff in this spec is `git diff <B SHA>...HEAD`, with the latest recorded B.

**Code ticket.** A ticket that is not a documentation-only ticket.

**Verbatim ticket.** A documentation-only ticket for which this spec gives the complete text of
every file region the ticket changes. Line breaks are free inside a paragraph or list item unless a
text says otherwise; everything else is exact.

**Takedown.** Defined by T5: on the repository owner's explicit instruction, for a person's privacy
or a legal claim, a change that removes assets from a deck together with their Assets rows and the
deck's references to them, and nothing else.

**Exception text E.** The paragraph that T4 and T7 both end with. The two copies are identical
except for the relative path of the ADR-0009 link (`../adr/` in `docs/agents/workflow.md`,
`docs/adr/` in `AGENTS.md`). Shown with the `workflow.md` path:

````markdown
A takedown (Charter Must-hold 5) may merge despite a FAIL only if all of these hold: the change
removes only the assets, their Assets rows and the deck's references to them; every FAIL line also
appears when the verifier runs in a detached worktree of `origin/main` after `git fetch`, apart from
notices line numbers that the removed rows shift, and none of them points at the deck's own rows;
and the repository owner explicitly approves the merge, which the PR description records together
with the FAIL lines. Merging does not change a public deck's deployed copy; a published Release
redeploys it ([ADR-0009](../adr/0009-takedown-exception.md)).
````

## Target texts

Each text replaces or adds exactly the region named; nothing else in that file changes.

**T1, `docs/agents/workflow.md` stage 5.** Replaces everything from the `## Stage 5 — Implement`
heading through the `**Gate:**` paragraph of that section (lines 112–135 at B0):

````markdown
## Stage 5 — Implement

Branch first: `tickets/<ticket-id>/<ticket-slug>`.

A code ticket runs `/implement`, which uses `/tdd`. A documentation-only ticket (`docs_only: true`
in its frontmatter; the term is in `GLOSSARY.md`) runs neither: it follows its approved acceptance
checklist, described below.

**Approval is explicit.** The user approves the test plan table, or the checklist, before the first
test is written or the first file is changed, and approves any row added later before that row
runs. A standing instruction such as "do it to completion" is not approval.

**Before the first test — the test plan table.** One row is one test. This satisfies `/tdd`'s rule
that no test is written at an unconfirmed seam. Every row names, before the table is approved, the
mutation that gives it a red if its test passes on the first run.

| Seam | Test intent | Scope | Acceptance criterion | Boundary conditions | Mutation if the first run passes |
|---|---|---|---|---|---|

**Between the tables — the red → green loop, governed by `/tdd`.** One row per cycle, in this
order: write the row's test, run it, record its red, write the minimal implementation, run it
green. Do not write the next row's test until the current row's record is complete. Writing every
test up front is the horizontal-slicing anti-pattern: bulk tests verify imagined behaviour.
Coverage is not a meaningful number here, because the code under test does not exist yet.

A test that passes on its first run takes its red from the row's mutation: apply the mutation, run
the test, record the failure, then restore the implementation. A mutation that the approved table
does not name is an added row and needs approval first.

**Each red record** goes in the ticket's Comments and holds:

- the HEAD commit at the run;
- the test added in this cycle, as a diff;
- the mutation, as a unified diff, when one was used;
- the key lines of the failing output.

Do not point a record at an object that no ref reaches, such as a `git hash-object -w` blob:
`git gc` can delete it.

**Before stage 6 — the coverage report table.** Now the numbers are real. Results from stages 7–9
are added to the ticket afterwards.

| Seam | Tests | Measured coverage | Acceptance criterion | Uncovered, and why |
|---|---|---|---|---|

**A documentation-only ticket** replaces both tables with one acceptance checklist:

| # | Acceptance criterion | How it is checked | Expected | Result |
|---|---|---|---|---|

"How it is checked" is a command or an exact comparison. Result stays empty until the item runs.
Run the items in order and record each result; there is no red. A failing item stays in the
record, and its rerun after the fix is recorded below it. The last item runs
`python3 scripts/verify-project.py`, `python3 -m unittest discover -s scripts -p 'test_*.py'` and
`python3 scripts/check_style_skills.py`, and expects all three to exit 0. The checklist with every
Result filled is the ticket's coverage report.

If a documentation-only ticket turns out to need a change to code, to configuration, to a file a
script reads as settings or data, or to a deck, stop and ask the user: the ticket loses `docs_only`
and gets a test plan table.

**Gate:** the test plan table or the checklist is approved before the loop starts; the coverage
report table, or the checklist with every Result filled, exists before stage 6.
````

**T2, `docs/agents/workflow.md` stage 6.** A new paragraph right after the paragraph that starts
"Run `/code-review`." in the `## Stage 6 — Review the change` section:

````markdown
**A verbatim documentation-only ticket** (`docs_only: true` and `verbatim: true`) gets a narrower
review, because the spec review already settled its wording. First compare each text the ticket
landed with the spec's text for it: the comparison must show no difference other than line breaks
the spec leaves free. Then `/code-review` reviews only the ticket's Comments, whether the recorded
evidence supports each acceptance criterion, and any change outside the ticket's scope. A text that
differs from the spec, even by an approved ruling, gets the full review.
````

**T3, `docs/agents/workflow.md` deck track item 4.** Replaces item 4 of "What the track keeps":

````markdown
4. **Delivered decks stay frozen:** on a deck that has been presented, accept only typo and
   broken-link fixes, and a takedown under Charter Must-hold 5. Anything larger becomes a new deck
   with a new deck id.
````

**T4, `docs/agents/workflow.md` deck track item 6.** Item 6 keeps its text at B0 and ends with a
space and E (the `../adr/` copy), on the same line.

**T5, `AGENTS.md` Charter Must-hold 5.** Replaces item 5 of "Must hold":

````markdown
5. **A delivered deck is frozen.** After a deck has been presented, fix only typos and broken
   links; a reworked or repeated talk gets a new deck id. One exception is a **takedown**: on the
   repository owner's explicit instruction, for a person's privacy or a legal claim, a change may
   remove assets from a deck together with their Assets rows and the deck's references to them, and
   nothing else ([ADR-0009](docs/adr/0009-takedown-exception.md)).
````

**T6, `AGENTS.md` hard rule 2.** Replaces item 2 of "Hard rules":

````markdown
2. **Two tables gate a ticket's tests.** A **test plan table** before the first test is written, which
   the user approves explicitly; a **coverage report table** before stage 6. Between them, `/tdd`
   governs the loop: one row, one test, one minimal implementation per cycle. A documentation-only
   ticket uses one approved acceptance checklist instead; see the workflow doc.
````

**T7, `AGENTS.md` slide hard rule.** The bullet that starts "When a deck adds, removes or renames a
file under its own `slides/<id>/assets/`" keeps its text at B0 and ends with a space and E (the
`docs/adr/` copy), on the same line.

**T8, `docs/agents/issue-tracker.md` ticket format.** A new paragraph and block right after the
paragraph that starts "Tickets are single-file and English-primary":

````markdown
**Two optional frontmatter keys** mark a ticket's kind. Both are set at stage 4 and approved with
the breakdown:

```yaml
docs_only: true   # a documentation-only ticket (GLOSSARY.md)
verbatim: true    # only with docs_only: the spec gives the complete text this ticket lands
```

A ticket without `docs_only: true` is a code ticket. Write each key only with the value `true`;
`verbatim` without `docs_only`, or any other value, is an error in the breakdown. Stages 5 and 6 of
[workflow.md](workflow.md) say what each key changes.
````

**T9, `GLOSSARY.md`.** A new entry right after the **Template work** entry, under "Work":

````markdown
**Documentation-only ticket** (純文件票):
A ticket that changes only text written for people and agents to read, such as the notices,
licenses, skills, `AGENTS.md` and `docs/`, even where a script checks that text's form. It changes
no code, no configuration, no file a script reads as settings or data, and no deck. The ticket is
marked as one when the epic is broken into tickets.
_Avoid_: docs ticket, prose ticket
````

**T10, ADR-0009.** `docs/adr/0009-takedown-exception.md`, English, with frontmatter keys
`status: accepted` and `date:` set to the author date (`git log -1 --format=%as`) of the commit that
adds it. Not verbatim. It records:

- the decision: a takedown as T5 defines it, allowed on a delivered deck;
- the merge exception E and each of its conditions;
- why: the Charter puts publishing safety before visual consistency, and a frozen deck or an
  unrelated FAIL must not keep a person's photo or contested material public;
- the rejected alternatives: a new deck id (the old URL keeps the material public); an exception in
  `workflow.md` only (it would contradict the Charter);
- that merging does not change a deployed copy, so a public deck needs a published Release;
- a section `## Amends ADR-0008`: the "a FAIL blocks the merge" rule now has the exception E.

**T11, `docs/README.md` ADR index.** One line right after the ADR-0008 line:

````markdown
- [ADR-0009](adr/0009-takedown-exception.md)：隱私或法律下架可以修改已講過的 deck，並在限定條件下不受無關的 verifier FAIL 阻擋。
````

**T12, ADR-0008 amendment note.** In `docs/adr/0008-verifier-license-reference-contract.md`, a blank
line and this line right after the `#` title, as ADR-0004 and ADR-0007 carry theirs:

````markdown
_Amended by [ADR-0009](0009-takedown-exception.md): a takedown may merge despite a FAIL outside the deck's own rows, under the conditions it names._
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

## OQ-10 — `/implement` on a documentation-only ticket

- **Question:** Should the `implement` skill itself skip `/tdd` for a ticket with `docs_only: true`?
- **Why open:** Epic 0006 left the skills unchanged (`0006-docs-only-ticket-process/grill.md`,
  Q11). The skill says to use `/tdd`, so an agent that runs `/implement` on a documentation-only
  ticket is told to write tests; only `docs/agents/workflow.md` stage 5 says not to.
- **Blocks:** nothing now.
- **Settles it:** the next retune of the project skills, or a documentation-only ticket that runs
  `/tdd` anyway.
````

## Matrix

Each row is a behaviour the documents must state. "Carried by" names the text that states it; the
row is met when that text is in place (AC1–AC5), and the E2E and diff rows are checked directly.

### Ticket kind

| ID | Type × field × boundary | Expected behaviour | Carried by | AC |
|---|---|---|---|---|
| K1 | ticket × no `docs_only` | a code ticket: `/implement` with `/tdd`, a test plan table, full stage 6 | T1, T2, T8 | AC1, AC3 |
| K2 | ticket × `docs_only: true`, no `verbatim` | a checklist instead of both tables; no `/implement` or `/tdd`; full stage 6 | T1, T2, T8 | AC1, AC3 |
| K3 | ticket × `docs_only: true` and `verbatim: true` | as K2, with the narrowed stage 6 | T1, T2, T8 | AC1, AC3 |
| K4 | ticket × `verbatim: true` without `docs_only: true` | an error in the breakdown | T8 | AC3 |
| K5 | ticket × a key with a value other than `true` | an error in the breakdown | T8 | AC3 |
| K6 | ticket × when the kind is set | at stage 4, approved with the breakdown | T8, T9 | AC3 |
| K7 | file × text for people and agents (notices, licenses, `GLOSSARY.md`, `AGENTS.md`, skills, `docs/`), even where a script checks its form | may be changed by a documentation-only ticket | T9 | AC3 |
| K8 | file × code, configuration, a file a script reads as settings or data (`deploy/public-decks.txt`, `docs/agents/skill-sources.json`, `scripts/style-skills-baseline.json`), or a deck | a ticket changing it is a code ticket | T9 | AC3 |
| K9 | documentation-only ticket × turns out to need a K8 change | stop and ask the user; the ticket loses `docs_only` and gets a test plan table | T1 | AC1 |

### Approval (D1)

| ID | Type × field × boundary | Expected behaviour | Carried by | AC |
|---|---|---|---|---|
| A1 | test plan table × before the first test | explicit approval by the user | T1, T6 | AC1, AC2 |
| A2 | checklist × before the first file is changed | explicit approval by the user | T1, T6 | AC1, AC2 |
| A3 | row or item × added after approval, including an unplanned mutation | approved before that row runs | T1 | AC1 |
| A4 | approval × a standing instruction such as "do it to completion" | not approval | T1 | AC1 |

### Loop and red records

| ID | Type × field × boundary | Expected behaviour | Carried by | AC |
|---|---|---|---|---|
| L1 | test plan row × count | one row is one test | T1, T6 | AC1, AC2 |
| L2 | test plan row × mutation column | filled for every row before approval | T1 | AC1 |
| L3 | cycle × order | write the test, run it, record its red, implement, run it green | T1 | AC1 |
| L4 | next row × current record incomplete | its test is not written yet | T1 | AC1 |
| L5 | test × passes on its first run | the table's mutation: apply, run, record, restore | T1 | AC1 |
| R1 | red record × contents | HEAD commit; the added test as a diff; the key failing lines | T1 | AC1 |
| R2 | red record × a mutation was used | also the mutation as a unified diff | T1 | AC1 |
| R3 | red record × an object no ref reaches (`git hash-object -w` blob) | not used as evidence | T1 | AC1 |

### Coverage and checklist

| ID | Type × field × boundary | Expected behaviour | Carried by | AC |
|---|---|---|---|---|
| C1 | code ticket × coverage report table | exists before stage 6 | T1, T6 | AC1, AC2 |
| C2 | any ticket × results of stages 7–9 | added to the ticket afterwards | T1 | AC1 |
| C3 | documentation-only ticket × coverage report | the checklist with every Result filled, before stage 6 | T1 | AC1 |
| Q1 | checklist × columns | `#`, acceptance criterion, how it is checked, expected, result | T1 | AC1 |
| Q2 | checklist item × how it is checked | a command or an exact comparison | T1 | AC1 |
| Q3 | checklist × run | in order, each result recorded, no red | T1 | AC1 |
| Q4 | checklist item × fails | stays in the record; the rerun after the fix is recorded below it | T1 | AC1 |
| Q5 | checklist × last item | the three existing checks, each exits 0 | T1 | AC1 |

### Stage 6

| ID | Type × field × boundary | Expected behaviour | Carried by | AC |
|---|---|---|---|---|
| S1 | code ticket, or documentation-only without `verbatim` | the full `/code-review`, unchanged from B0 | T2 | AC1 |
| S2 | verbatim ticket × every landed text equals the spec's | the comparison shows no difference beyond free line breaks; then only Comments, evidence against each AC, and out-of-scope changes are reviewed | T2 | AC1 |
| S3 | verbatim ticket × a landed text differs from the spec, even by an approved ruling | that text gets the full review | T2 | AC1 |

### Takedown

| ID | Type × field × boundary | Expected behaviour | Carried by | AC |
|---|---|---|---|---|
| D1 | delivered deck × takedown on the owner's explicit instruction | allowed: removes the assets, their Assets rows and the deck's references | T3, T5 | AC1, AC2 |
| D2 | delivered deck × removal without the owner's explicit instruction | not a takedown; Must-hold 5's normal rule | T5 | AC2 |
| D3 | delivered deck × removal plus anything added or replaced (e.g. a substitute photo) | not a takedown; a larger change needs a new deck id | T3, T5 | AC1, AC2 |
| D4 | deck not yet delivered × takedown | the merge exception E applies the same way | T4, T7 | AC1, AC2 |
| D5 | takedown × no FAIL | merges as any deck change | T4, T7 | AC1, AC2 |
| D6 | takedown × a FAIL that points at the deck's own rows | blocks the merge | T4, T7 | AC1, AC2 |
| D7 | takedown × a FAIL line absent from `origin/main` | blocks the merge | T4, T7 | AC1, AC2 |
| D8 | takedown × FAIL lines equal to `origin/main`'s except notices line numbers shifted by the removed rows | counts as present on `origin/main` | T4, T7 | AC1, AC2 |
| D9 | takedown × conditions met, no explicit owner approval of the merge | blocks the merge | T4, T7 | AC1, AC2 |
| D10 | takedown × merged | the PR description records the approval and the FAIL lines | T4, T7 | AC1, AC2 |
| D11 | public deck × takedown merged | the deployed copy is unchanged until a published Release redeploys it | T4, T7, T10 | AC1, AC2, AC4 |
| D12 | E × its two copies | identical except the ADR link's relative path | T4, T7 | AC1, AC2 |

### Records, delivery and diff

| ID | Type × field × boundary | Expected behaviour | Carried by | AC |
|---|---|---|---|---|
| T1–T9, T11–T13 | texts × after | each text as defined above, by exact comparison | — | AC1–AC5 |
| T10 | ADR-0009 × content | holds each item T10 lists | — | AC4 |
| E1 | E2E × GitHub file view of the pushed ticket branch | every changed file renders; T1's three tables and T8's YAML block render as a table and a code block; the page text is recorded | — | AC6 |
| X1 | diff × paths | `git diff <B>...HEAD --name-only` lists only `docs/agents/workflow.md`, `AGENTS.md`, `docs/agents/issue-tracker.md`, `GLOSSARY.md`, `docs/adr/0009-takedown-exception.md`, `docs/README.md`, `docs/adr/0008-verifier-license-reference-contract.md`, `.proj.specs/OPEN-QUESTIONS.md`, and files under `.proj.tickets/0006-docs-only-ticket-process/` | — | AC7 |
| X2 | diff × regions | in each file of X1 outside `.proj.tickets/`, every changed line belongs to one of T1–T13 | — | AC7 |
| X3 | branch × base | B is the first Comment the ticket writes, before any other change | — | AC7 |
| X4 | checks × at HEAD | the three checks of Q5 exit 0 | — | AC7 |

## Self-check of rules added in revision 1

Global rule 2 asks that each new rule be checked for complete parameters, closed boundaries and an
acceptance exit before review. Global rule 5 asks that each added guarantee be checked against
existing rules.

| Rule | Parameters | Boundaries closed by | Exit | Conflicts checked |
|---|---|---|---|---|
| Documentation-only ticket (T9) | changed files | K7, K8, K9 | AC3 | 0004 T-0006 (notices, `LICENSE-CODE`) falls under K7, as intended |
| Ticket keys (T8) | `docs_only`, `verbatim`, value | K1–K6 | AC3 | no script under `scripts/` reads ticket frontmatter at B0 (only `SKILL.md` frontmatter), so the keys change no tool's behaviour |
| Explicit approval (T1, T6) | table, checklist, added row, standing instruction | A1–A4 | AC1, AC2 | memory and T-0007 D1 agree |
| One row per cycle (T1, T6) | row, order, first-run pass | L1–L5 | AC1, AC2 | ADR-0006's mutation technique is unchanged; ADR-0006 is not edited |
| Red record (T1) | contents, mutation | R1–R3 | AC1 | `docs/agents/language.md`'s `git hash-object` is for `synced_from_sha`, not evidence; untouched |
| Coverage timing (T1, T6) | ticket kind, stages 7–9 | C1–C3 | AC1, AC2 | removes the B0 conflict between "when the ticket closes" and "before stage 6"; ADR-0006's "closes the ticket as usual" stays as history |
| Checklist (T1) | columns, order, failure, last item | Q1–Q5 | AC1 | T-0006's table is a prior instance |
| Narrowed stage 6 (T2) | `verbatim`, difference | S1–S3 | AC1 | stage 3 review still covers the wording before freeze |
| Takedown and E (T3–T5, T7) | instruction, removal only, FAIL lines, approval, Release | D1–D12 | AC1, AC2 | Must-hold 3 (template work never changes a deck): a takedown is deck content work, untouched; Must-hold 1: publishing still needs a Release (D11); OQ-8's three missing item-6 sentences (Ruling L3) stay with the notices-grammar epic and are not added here |

### One rule, several texts

Epic 0004's retrospective (「下次要改」 item 1) asks for this check whenever one rule appears in two
or more texts.

| Rule | Texts | Trigger | Scope | Exception |
|---|---|---|---|---|
| explicit approval | T1, T6 | before the first test (T1 also: first changed file, added row) | test plan table; T1 also the checklist | none |
| coverage timing | T1, T6 | before stage 6 | every ticket; T1 names the checklist form | none |
| one row per cycle | T1, T6 | each cycle | code tickets | T6 points documentation-only tickets to the checklist, as T1 does |
| takedown | T3, T5, E | the owner's explicit instruction (T5, E) | assets, their Assets rows, the deck's references, nothing else (T5); "removes only" the same three (E) | T3 refers to T5 rather than restating it |
| merge exception | T4, T7 | a FAIL during a takedown | E, identical in both | only the ADR link path differs (D12) |
