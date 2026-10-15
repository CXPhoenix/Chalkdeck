---
status: accepted
date: 2026-10-16
---

# Retire the long-lived `template` branch

Ticket branches start from `main` and land on `main`; template versions are tagged on `main`
(`template-vX.Y.Z`). The `template` branch and its existing tags (`template-v1.0.0` to
`template-v1.1.1`) stay as history but receive no new work.

The `template` branch kept template and deck lineages apart so that merging a new template never
touched a deck. With a single author, and with self-contained decks already guaranteeing that
template work cannot alter an existing deck, the second lineage only adds a merge step to every
template change. harness-agile's one-branch-per-ticket rule also needs a single base to branch from.

## Consequences

- `docs/deploy-and-google-sites.md` §1 describes this model; older notes that mention merging
  `template` into `main` are superseded.
- If a second author or a forked template line ever appears, revisit this decision rather than
  reviving the branch ad hoc.
