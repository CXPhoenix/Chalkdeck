---
status: accepted
date: 2026-10-16
---

# Equivalence rewrites meet the red step with characterization plus mutation

When a ticket rewrites text without changing behaviour — re-tuning a skill prompt for another
model, for example — its tests pin the current protected content (characterization) and pass from
the start. Hard rule 2's red step is met instead by mutation: before the rewrite, each test is shown
to fail on a fixture that breaks the property it guards. The test plan table lists every property
and its mutation and is approved as usual; the coverage report table closes the ticket as usual.

An equivalence rewrite has no new behaviour to drive a failing test first, so a literal red → green
loop would either be skipped or faked. Mutation keeps the purpose of the red step — proof that the
test can fail for the reason it exists — without inventing behaviour.

## Consequences

- Applies only to tickets whose spec forbids behaviour change. A ticket that changes behaviour uses
  the normal `/tdd` loop.
- Mutation runs and their failing output are saved in the ticket's Comments, so the red evidence is
  as checkable as a normal red run.
- Characterization tests protect content, not behaviour; specs using this ADR also need a
  behaviour-equivalence review (first used in epic 0002).
