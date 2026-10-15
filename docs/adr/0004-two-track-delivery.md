---
status: accepted
date: 2026-10-16
---

# Two tracks: deck content work skips the pipeline, template work does not

Deck content work — a change confined to one deck's `slides/<deck-id>/` folder — takes a light track:
a `decks/<deck-id>` branch, the slide authoring rules, a check of every changed page in the dev
server, and a PR. Template work — anything shared across decks — takes the full nine-stage pipeline.

harness-agile assumes every change after the walking skeleton has a spec, an adversarial review and a
TDD loop. A deck is self-contained presentation code with no seam a unit test can hold, and the
Charter ranks authoring speed first, so those gates would cost the most on the work that gains the
least from them. Template work is the opposite: a theme, script or deploy change reaches every deck
and can widen what is public, so it keeps every gate.

## Considered options

- **Full pipeline for everything.** Rejected: a typo fix on one deck would need a spec and a
  traceability matrix.
- **Light track for everything** (adopt only harness skills and layout). Rejected: deploy and theme
  changes would lose review, and they carry the publishing-safety risk the Charter ranks second.

## Consequences

- The boundary is the folder, not the size of the change: anything outside `slides/<deck-id>/` is
  template work, so a deck edit that needs a theme change splits in two.
- Allowlist edits stay on the light track but require the author's explicit instruction; publishing
  still needs a Release.
