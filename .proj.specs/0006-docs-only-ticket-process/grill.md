# Grill record — 0006-docs-only-ticket-process

Stage-1 questions put to the repository owner (CXPhoenix) on 2026-11-09, and the answers, quoted.
This is the D3 epic, approved at the epic 0004 retrospective ("開，排在 0005 之後"). Base:
`origin/main` at `32a5162`.

Inputs carried over:

- `../0004-license-files/retrospective.md`, 「下次要改」 items 3–4.
- `../../.proj.tickets/0005-license-reference-check/T-0007-*.md`, "Owner decisions from the epic
  0004 retrospective": D1–D3.
- `../0005-license-reference-check/retrospective.md`, 「下次要改」 items 1–3 and 「交給 owner 的決定」.

## Decisions carried in

The five decisions in the epic 0005 retrospective, answered on 2026-11-09 with "全部照建議":

| # | Decision | Answer (the recommendation taken) | Epic |
|---|---|---|---|
| 1 | Write "one row per cycle" and "the mutation column is mandatory" into `workflow.md`? | Yes, in this epic. The record script refusing a second red under one test blob is a code change: record it as an OQ. | 0006 |
| 2 | Red evidence as a diff in the ticket, or blobs under `refs/evidence/…`? | A diff in the ticket. Custom refs are not pushed by default and do not appear in a PR. | 0006 |
| 3 | D3 or L1 first? | D3 first, so L1's tests run under decision 1's rules. | — |
| 4 | May an urgent privacy or legal takedown merge despite an unrelated verifier FAIL? | Yes, narrowly: the change only removes; the FAIL already occurs on `origin/main` without it and lies outside the deck's rows; the owner approves explicitly and the PR records why. A public deck also needs a published Release to redeploy. | 0006 |
| 5 | State that the verifier does not check Assets-row paths, holders or terms? | Yes, in the PASS line itself. | L1 |

## Round 1

| Q | Question (short) | Recommended | Owner's answer |
|---|---|---|---|
| Q1 | scope | (a) documentation-only ticket process; (b) record D1; (c) one row per cycle and a mandatory mutation column; (d) red evidence as a diff in the ticket; (e) the urgent-takedown exception; (f) 0004 retrospective item 4: stage 6 reviews only the non-verbatim parts of a documentation-only ticket whose target text the spec gives verbatim. Out: 0005 retrospective items 4–5. | "全部照建議" |
| Q2 | what a documentation-only ticket is | No file it changes is read by a script, build or test. The notices, `docs/agents/skill-sources.json` and `deploy/public-decks.txt` are therefore excluded; `SKILL.md` and `AGENTS.md` count. Declared on the ticket at stage 4 and approved with the breakdown. | "全部照建議" |
| Q3 | when the coverage table is produced | For every ticket, before stage 6; stage 7–9 items are added afterwards. Removes the "when the ticket closes" / "before stage 6" conflict. | "全部照建議" |
| Q4 | the mutation column | Every row of a code ticket's test plan fills it. A documentation-only ticket has no such column, because its test plan is a checklist. | "全部照建議" |
| Q5 | the takedown exception against Charter Must-hold 5 | (i) Add a privacy or legal takedown exception to Charter Must-hold 5. Rejected: (ii) a new deck id leaves the photo public at the old URL; (iii) a `workflow.md`-only exception contradicts the Charter. | "全部照建議" |

## Round 2

Correction to round 1 Q2, put to the owner before this round. Its premise was wrong:

- `scripts/verify-project.py:150-170` scans every non-shared skill's `*.md`, `AGENTS.md`,
  `CLAUDE.md` and `docs/agents/*.md` for stale glossary names, and `:188` checks `GLOSSARY.md`.
- `scripts/check_style_skills.py` compares the five style skills' `SKILL.md` with a baseline.
- T-0006, the ticket that prompted this epic, changed `LICENSE-CODE` and `THIRD_PARTY_NOTICES.md`
  and called itself "Documentation only" (`T-0006-license-files-and-notices.md:35`). Round 1 Q2's
  definition would have excluded it.

Two consequences inside the agreed scope, needing no decision: `AGENTS.md` hard rule 2 also says
the coverage table comes "when the ticket closes" (Q3 changes it too), and the `AGENTS.md` deck rule
also says "a FAIL blocks the merge" (the takedown exception changes it too).

| Q | Question (short) | Recommended | Owner's answer |
|---|---|---|---|
| Q2′ | what a documentation-only ticket is (replaces Q2) | Not one if it changes code or configuration: scripts, tests, build and deploy configuration, files a script reads as settings or data (`deploy/public-decks.txt`, `skill-sources.json`, `style-skills-baseline.json`), or a deck. Text for people and agents counts even where a script checks its form: the notices, licenses, `GLOSSARY.md`, `AGENTS.md`, skills, `docs/`. The checklist's last item runs the existing checks (`verify-project.py`, `check_style_skills.py`, the unit tests), all PASS. | "全部照建議" |
| Q6 | the documentation-only checklist | Columns `| # | acceptance criterion | how it is checked (command or exact comparison) | expected |`. D1 applies: no change before the owner approves it. Run in order and record each result; no red. T-0006's table (lines 218–219) is the model. | "全部照建議" |
| Q7 | what each red record holds | The cycle's added test as a diff; the mutation as a unified diff when one is used; the key lines of the failing output. No `git hash-object -w`. | "全部照建議" |
| Q8 | the narrowed stage 6 | "Verbatim" means the spec gives the complete text to land. Stage 4 marks a ticket documentation-only and verbatim, approved with the breakdown. Stage 6 first diffs the landed text against the spec text, which must be empty, then reviews only the ticket's Comments, whether the evidence supports each AC, and out-of-scope changes. | "全部照建議" |
| Q9 | the takedown exception's wording and place | Charter Must-hold 5 gains: on the owner's explicit instruction, a privacy or legal takedown may remove an asset from a delivered deck, with its Assets row and the deck's references to it. The merge exception (decision 4's three conditions, plus a Release for a public deck) goes into `workflow.md` deck track item 6 and the `AGENTS.md` deck rule, in identical wording. It runs on the deck track (`decks/<id>`), so Must-hold 3 is untouched. | "全部照建議" |

## Round 3

| Q | Question (short) | Recommended | Owner's answer |
|---|---|---|---|
| Q10 | where a ticket is marked documentation-only and verbatim | Two optional frontmatter fields, `docs_only: true` and `verbatim: true` (`verbatim` only when `docs_only` is true), documented in `docs/agents/issue-tracker.md`. No script parses them. | "全部照建議" |
| Q11 | whether skills change | (ii) No skill changes. `workflow.md` stage 5 says a documentation-only ticket does not run `/implement` and follows its approved checklist instead. Rejected: (i) editing `implement`, `to-tickets` and `code-review` in both runtimes, which carry provenance and tuning (`docs/agents/skill-sources.json:219-261`). The residual risk, an agent running `/implement` anyway, becomes an OQ. | "全部照建議" |
| Q12 | an ADR for the takedown exception | Yes, ADR-0009: it changes the Charter, surprises a reader without context, and rejected two alternatives. The documentation-only process gets no ADR. | "全部照建議" |

## Shared understanding

Put to the owner at the end of round 3 and confirmed on 2026-11-09: "正確，進 stage 2".

Files the epic changes, all documentation: `docs/agents/workflow.md`, `AGENTS.md` (Charter
Must-hold 5, hard rule 2, the deck rule), `docs/agents/issue-tracker.md`, `GLOSSARY.md` (drafted
during stage 1, then kept as the spec's target text T9 and landed by a ticket, so the spec branch
leaves `GLOSSARY.md` unchanged), new `docs/adr/0009-*.md`, and two new OQs in
`.proj.specs/OPEN-QUESTIONS.md`. No script, test, skill or deck changes. Every ticket is itself
documentation-only, and the spec gives its target text verbatim where it can.

1. **Documentation-only ticket** (Q2′, Q6, Q10, Q11): defined in `GLOSSARY.md`; marked with
   `docs_only` (and `verbatim`) in frontmatter at stage 4; its test plan is the acceptance checklist
   of Q6, approved under D1; it does not run `/implement` or `/tdd`; the checklist ends with the
   existing checks, all PASS.
2. **D1** (Q1 b): a test plan table, a checklist, and any added row need the owner's explicit
   approval; a standing "do it to completion" never counts.
3. **One row per cycle and the mutation column** (decision 1, Q4): write one test, run it, record its
   red, implement, go green, then the next row; every row of a code ticket's test plan names its
   mutation before the table is approved.
4. **Red evidence** (decision 2, Q7): the added test and any mutation as diffs, with the failing
   output's key lines, written into the ticket.
5. **Coverage table timing** (Q3): for every ticket, before stage 6, in both `workflow.md` and
   `AGENTS.md` hard rule 2; stage 7–9 items are added afterwards.
6. **Narrowed stage 6** (Q1 f, Q8): for a `verbatim` documentation-only ticket, an empty diff against
   the spec text, then only Comments, evidence against each AC, and out-of-scope changes.
7. **Takedown exception** (decision 4, Q5, Q9, Q12): Charter Must-hold 5 gains the exception;
   `workflow.md` deck track item 6 and the `AGENTS.md` deck rule share one wording for the merge
   exception; ADR-0009 records why, written as a ticket deliverable as ADR-0008 was.

Out of scope: the verifier's PASS line (decision 5, epic L1); 0005 retrospective items 4–5.

## Deferred

- The record script refusing a second red under one test blob (decision 1): an OQ, written by this
  epic's spec.
- An agent running `/implement` on a documentation-only ticket despite `workflow.md` (Q11): an OQ,
  written by this epic's spec.
- 0005 retrospective 「下次要改」 items 4 (commit type) and 5 (cross-checking matrix rows against
  rules before freeze): not decided; outside this epic.
