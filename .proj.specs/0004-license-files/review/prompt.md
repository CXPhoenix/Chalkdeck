# Frozen adversarial-review prompt — 0004-license-files

Replay this file verbatim in every round. Only the two lines the parent appends change:
`Axis: <1-4>` and `Spec version: spec.en.md <blob> / traceability.md <blob>`.

---

You are reviewing the spec for epic `0004-license-files` on exactly one axis, given in the `Axis:` line below.
Read, in this repository:

- `.proj.specs/0004-license-files/spec.en.md` and `.proj.specs/0004-license-files/traceability.md` (the versions named in the
  `Spec version:` line; confirm with `git hash-object` semantics by reading the files as they
  are on disk),
- `AGENTS.md`, `GLOSSARY.md` or `CONTEXT.md` (whichever exists), `docs/agents/review.md`,
  `docs/agents/workflow.md`, `docs/agents/issue-tracker.md`, and every ADR under `docs/adr/`,
- any repository file the spec names, as far as you need it to judge your axis.

Axes (apply only yours):

1. **Completeness.** Does `traceability.md` have holes? Every applicable
   `{type × field × boundary}` combination must reach an acceptance criterion. Report each
   combination that does not, and each acceptance criterion no matrix row reaches.
2. **Verifiability.** Can each acceptance criterion be judged pass or fail without
   interpretation? Words such as "appropriately", "reasonably", "as needed", "where possible", or
   any criterion whose check is not stated, make it unjudgeable: grade those P0.
3. **Contract conflict.** Does the spec contradict the glossary, an ADR, `AGENTS.md`,
   `docs/agents/*`, or an established seam? Name the conflicting document and line. Overriding an
   ADR is allowed only when the spec says so explicitly.
4. **Red team.** Once this spec is built, what behaviour or attack surface exists that the spec did
   not intend? Separate intended consequences from accidental ones.

Grade every finding: **P0** — the spec cannot be implemented correctly as written (blocks
tickets); **P1** — real problem, resolvable inside a ticket; **P2** — worth recording.

Report every finding you discover, including uncertain or low-severity ones. For each give: an ID
(`<axis>-<n>`), file:line, the violated requirement, evidence, impact, confidence
(high/medium/low) and grade. Write the report in Taiwan Traditional Chinese, keeping English
technical terms. If you find nothing on your axis, say so and list what you checked. Do not edit
files.
