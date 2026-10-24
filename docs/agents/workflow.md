# Workflow

The nine stages of the delivery pipeline, in order. `AGENTS.md` carries the summary table and the
hard rules; this file carries the entry conditions, gates, and exceptions.

The unit of work is the **epic**: one spec, one pass through stages 1–9, one demoable increment.
Agile principle 7 is the yardstick — working software is the measure of progress, so every epic ends
with something that runs, not with a document.

## Round 0: the walking skeleton

A **walking skeleton** is the thinnest path that runs end to end. Every layer is the worst possible
version of itself, and every layer is genuinely connected — no mocks, no TODOs, no architecture
diagram standing in for a running process.

It exists to make **seams** real. `/to-spec` requires you to sketch the seams a feature will be
tested at, preferring existing seams; in an empty repository there are none to prefer, so a spec
written first can only describe imagined seams. The skeleton produces the real ones.

**The exemption:** round 0 skips stage 2 (spec) and stage 3 (adversarial review).

**Its expiry:** the exemption ends when the skeleton merges to `main`. From that merge onward every
ticket has a spec behind it. The merge is the terminating ritual, which is why the skeleton still
takes a branch — `tickets/T-0000/walking-skeleton` — rather than committing straight to `main`.

**Its output is the seams, not the code.** Expect most of the skeleton's implementation to be
replaced by the epics that follow. That is the plan working, not the plan failing.

## Deck content track

Two kinds of work run through this repository (terms in `GLOSSARY.md`). **Template work** — themes,
scripts, global assets, deploy configuration, skills, project configuration — takes stages 1–9.
**Deck content work** — a change confined to one deck's `slides/<deck-id>/` folder, its own assets
included — takes this lighter track instead. See [ADR-0004](../adr/0004-two-track-delivery.md).

**Classify before starting.** If a change touches anything outside `slides/<deck-id>/`, other than
the two shared edits below (the allowlist and the deck's rows in the notices), it is template work,
even when it began as a deck edit; split the shared part into its own epic or ticket.
Editing another deck is a separate piece of deck content work, not part of this one.

**What the track skips:** the spec, adversarial review, tickets, the test plan and coverage tables,
and the TDD loop. A deck has no seam that a unit test can hold, so those gates would produce paper,
not evidence.

**What the track keeps:**

1. **Branch:** `decks/<deck-id>` from `main`, landing on `main` through a PR whose description
   comes from `/tw-emoji-pr-note`. Merging does not publish anything.
2. **Authoring rules:** the `open-slide` section of `AGENTS.md` and the `slide-authoring` skill.
3. **Verification:** render every changed page in the dev server (`pnpm dev`) and check it there;
   that browser page is the real surface. Report which pages were checked.
4. **Delivered decks stay frozen:** on a deck that has been presented, accept only typo and
   broken-link fixes. Anything larger becomes a new deck with a new deck id.
5. **Commits** use `/tw-emoji-commit`, as everywhere.
6. **Notices check:** when the change adds, updates or removes an Assets-table row in the notices, run `python3 scripts/verify-project.py` and report its result. A FAIL blocks the merge; a FAIL outside the deck's own rows is reported to the repository owner, not fixed on this track ([ADR-0008](../adr/0008-verifier-license-reference-contract.md)).

**The allowlist** (`deploy/public-decks.txt`) is edited on this track, but only on the author's
explicit instruction for a named deck id. Never add a deck because it looks finished. Going public
still requires a published GitHub Release, which uses `/tw-emoji-release-note`.

**The notices** (`THIRD_PARTY_NOTICES.md`) are the other shared file this track may edit: a deck change adds, updates or removes the Assets-table rows for third-party files under its own `slides/<deck-id>/assets/`, naming each holder as the file's license requires and no one else ([ADR-0007](../adr/0007-license-split.md)). Any other change to the notices is template work.

## Stage 1 — Converge the requirement

Run `/grill-with-docs`. It is user-invoked; ask the user to run it rather than trying to invoke it
yourself.

Grilling produces decisions. When a decision is hard to reverse, surprising without context, and the
result of a real trade-off, record it as an ADR (`docs/adr/`) as it settles rather than batching them
at the end.

**Gate:** the user confirms shared understanding. Not "the agent stopped asking questions."

## Stage 2 — Write the spec

Run `/to-spec`. It publishes to `.proj.specs/NNNN-<epic-slug>/spec.en.md`.

Alongside the spec, write `traceability.md`: a single table mapping
`{type × field × boundary} → {expected behaviour → acceptance criterion}`. The spec's prose is
derived from this matrix, so a gap in the matrix is a gap in the spec. This is the single source of
truth that stops the "fix A, miss B" class of revision failure.

**Gate:** spec and traceability matrix both exist, and every row of the matrix reaches an acceptance
criterion.

## Stage 3 — Adversarial review

Four independent reviewers, four fixed axes, at most two rounds. Use the active
host's native agents and available models as described in [runtime.md](runtime.md);
run in batches if its concurrency limit is lower than four. Axes, grading, and the frozen-prompt
mechanism live in [review.md](review.md).

**Gate:** zero P0 findings.

**Escalation:** P0 findings surviving round 2 are a signal that the epic is too large, not a reason
to open round 3. Split the epic and restart at stage 1. Adding rounds is how a review stops
converging — the ruler drifts upward and "not converged" becomes an artefact of the moving
threshold rather than a property of the spec.

## Stage 4 — Break into tickets

Run `/to-tickets`. Tickets are **tracer bullets**: each one cuts a narrow but complete path through
every layer and is demoable on its own.

Ticket ids are allocated globally and sequentially (`T-0001`, `T-0002`, …) and never change, because
branch names embed them. Files live under `.proj.tickets/NNNN-<epic-slug>/`. Layout and frontmatter:
[issue-tracker.md](issue-tracker.md).

**Gate:** the user approves the breakdown — granularity, blocking edges, and what each ticket
delivers.

## Stage 5 — Implement

Branch first: `tickets/<ticket-id>/<ticket-slug>`.

Run `/implement`, which uses `/tdd`. Two tables bracket the loop:

**Before the first test — the test plan table.** The user approves it before any test is written.
This satisfies `/tdd`'s rule that no test is written at an unconfirmed seam.

| Seam | Test intent | Scope | Acceptance criterion | Boundary conditions |
|---|---|---|---|---|

**Between the tables — the red → green loop, governed by `/tdd`.** One seam, one failing test, one
minimal implementation, repeat. Writing every test up front is the horizontal-slicing anti-pattern:
bulk tests verify imagined behaviour. Coverage is not a meaningful number here, because the code
under test does not exist yet.

**When the ticket closes — the coverage report table.** Now the numbers are real.

| Seam | Tests | Measured coverage | Acceptance criterion | Uncovered, and why |
|---|---|---|---|---|

**Gate:** test plan table approved before the loop starts; coverage report table produced before
stage 6.

## Stage 6 — Review the change

Run `/code-review`. It reviews on two axes: does the code follow this repo's documented standards,
and does it match what the spec asked for. Direction and requirement are what matter here;
Quality-only cleanup is a separate optional task; use a host-provided simplify
command when available or review the proposed cleanup directly.

## Stage 7 — Security review

Load the active runtime's project `security-review/SKILL.md` on the diff. The cross-cutting chain analysis is not part of this stage; it
runs at epic close-out. See [review.md](review.md).

## Stage 8 — End-to-end

Verify the behaviour against the surface that actually runs it.

- **Browser-reachable surface:** use `/agent-browser` or available native browser tools
  that provide equivalent evidence. For accessibility, verify the applicable criteria
  with accessibility-tree inspection, keyboard interaction and any other required checks.
  `/chrome-devtools-mcp:a11y-debugging` is one option. Unless the user requires that exact
  tool, use an available equivalent before requesting installation. If no tool can obtain
  the required evidence, report the missing capability and leave that criterion unverified;
  dependent gates remain blocked. Screenshots alone do not prove keyboard accessibility.
- **Any other surface** — a native client, a daemon, a CLI, a game server, a device: use a harness
  this project supplies. `/agent-browser` drives Chrome/Chromium and Electron over CDP, so anything
  outside that is outside its reach.

Report which surface a verification covered. A browser screenshot is evidence about a browser
surface, and saying so keeps it from being read as evidence about anything else.

Record the choice of non-browser harness as an ADR once it is made; until then it belongs in
`.proj.specs/OPEN-QUESTIONS.md`.

## Stage 9 — Land it

Inspect the actual remote host and intended base first.

- GitHub: create a PR with `gh pr create`; generate the description with the project
  `tw-emoji-pr-note` skill and pass its UTF-8 file with `--body-file`.
- GitLab or another host: use that host's supported PR/MR tool and the same description
  skill. A remote existing does not imply GitHub.
- No remote: merge into local `main` with `git merge --no-ff --no-commit`, then
  generate and sanitize the message with `tw-emoji-commit` and run `git commit
  --file <sanitized message file>`. Resolve any conflicts before generating the
  final message. The merge command itself does not generate a separate message
  outside that skill.

Every `git commit` variant uses `tw-emoji-commit`. Existing user authorization for
landing work remains valid; report unresolved decisions instead of silently choosing
an unexpected remote or base. Update ticket status to `done` after landing.

## Epic close-out

After the last ticket of an epic lands:

1. **Vulnerability chain analysis.** Input: every security finding from the epic's tickets, plus the
   trust boundaries the spec describes. Question: can individually low-severity defects be composed
   into a chain? This is epic-scoped rather than ticket-scoped because a chain by definition spans
   units.
2. **Evidence report.** Run `/evidence-report` to produce a standalone HTML report of what the epic
   delivered and what the evidence for it is.
3. **Retrospective.** Agile principle 12 — what to change about how the next epic runs. Decisions
   worth keeping become ADRs; questions not yet answerable go to `.proj.specs/OPEN-QUESTIONS.md`.

## Deferred decisions

Two different things, kept apart:

- A **ticket with `status: pending`** exists and is deliberately paused. It lives in
  `.proj.tickets/` with its reason and evidence in frontmatter.
- An **open question** is not yet a ticket: an architecture-level decision that blocks work
  downstream of it. It lives in `.proj.specs/OPEN-QUESTIONS.md`.

Both record why they were deferred, the evidence behind that call, and the condition that should
bring them back.
