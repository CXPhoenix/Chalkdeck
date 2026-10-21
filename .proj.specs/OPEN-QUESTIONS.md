# Open questions

Architecture-level decisions that block work downstream of them. Each entry: the question, why it
is open, what it blocks, and what would settle it.

## OQ-1 — Automated harness for skill behaviour

- **Question:** How should skill behaviour (which branch a skill takes, what it asks, selects and
  emits) be verified automatically?
- **Why open:** The only candidate so far is a headless Claude session per case. Epic 0002 deferred
  it: outputs are free text, some router cases allow several outcomes, and some cases need fixtures
  (guidance made unavailable, multi-turn context). Workflow stage 8 requires a recorded harness for
  any non-browser surface.
- **Design kept for later (author, 2026-10-16):** run each case three times per version; judge each
  run's outcome against the case's allowed set, not against the other version's run.
- **Blocks:** behaviour-changing edits to skills (epic 0002 defers them); automated end-to-end
  evidence for skill epics (0001 uses a manual agent session instead).
- **Settles it:** an ADR choosing the harness, its fixtures and its judging rules. Real-use history
  from the planned deck-production history epic is an input.

## OQ-2 — harness-agile template still names `CONTEXT.md`

- **Question:** When this repo next syncs `AGENTS.md` or `docs/agents/*` from the harness-agile
  template, how is the template's `CONTEXT.md` naming reconciled with epic 0001's `GLOSSARY.md`?
- **Why open:** Epic 0001 follows mattpocock/skills upstream; the template has not followed yet.
- **Blocks:** nothing now; the next template sync.
- **Settles it:** the template adopting the rename, or a recorded local adaptation reapplied on sync
  (the verifier lists every spot).

## OQ-3 — License notices on deployed decks

- **Question:** How do deployed decks carry the notices their bundled third-party material needs?
  For example, the license URI that CC BY-ND 3.0 TW §4(a) requires with each copy of the MOE Kai
  font, and attribution for logos.
- **Why open:** Epic 0003 marks licenses in the repository only. A built site ships the font and
  logos with no notice. Charter 3 forbids changing existing decks, so a fix has to come from the
  build or from a theme change that only new decks pick up, which is deck-surface work outside
  epic 0003.
- **Blocks:** nothing in the repository; publishing compliance of public decks.
- **Settles it:** a decision on where a deployed notice lives. Candidates: a page generated at
  build time; a theme change applied only to new decks; a footer convention for new decks.
