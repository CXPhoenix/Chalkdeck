# Frozen adversarial-review prompt — 0006-docs-only-ticket-process

Replay this file verbatim in every round. Only the two lines the parent appends change:
`Axis: <1-4>` and `Spec version: spec.en.md <blob> / traceability.md <blob>`.

---

You are reviewing the spec for epic `0006-docs-only-ticket-process` on exactly one axis, given in the `Axis:` line below.
The repository is the worktree `/Users/phoenix/dev/chalkdeck/.worktrees/epic-0006`; read every path below relative to it.
Read:

- `.proj.specs/0006-docs-only-ticket-process/spec.en.md` and `.proj.specs/0006-docs-only-ticket-process/traceability.md` (the versions named in the
  `Spec version:` line; read the files as they are on disk), and
  `.proj.specs/0006-docs-only-ticket-process/grill.md` for the repository owner's decisions,
- `AGENTS.md`, `GLOSSARY.md`, `docs/agents/review.md`, `docs/agents/workflow.md`,
  `docs/agents/issue-tracker.md`, `docs/agents/language.md`, `docs/README.md`,
  `.proj.specs/OPEN-QUESTIONS.md`, and every ADR under `docs/adr/`,
- any repository file the spec names, as far as you need it to judge your axis. The texts the spec
  replaces are in the files above as they stand at B0 (the work tree is at B0 apart from
  `.proj.specs/0006-docs-only-ticket-process/`). Background on the decisions carried in:
  `.proj.specs/0004-license-files/retrospective.md`, `.proj.specs/0005-license-reference-check/retrospective.md`,
  `.proj.tickets/0004-license-files/T-0006-license-files-and-notices.md` (the documentation-only
  precedent), the "Owner decisions from the epic 0004 retrospective" section of
  `.proj.tickets/0005-license-reference-check/T-0007-provenance-license-references.md`, and the
  project skills `.claude/skills/implement/SKILL.md`, `.claude/skills/tdd/SKILL.md`,
  `.claude/skills/to-tickets/SKILL.md` and `.claude/skills/code-review/SKILL.md`. Which files a
  script reads: `scripts/verify-project.py` and `scripts/check_style_skills.py`.

Axes (apply only yours):

1. **Completeness.** Does `traceability.md` have holes? Every applicable
   `{type × field × boundary}` combination must reach an acceptance criterion. Report each
   combination that does not, and each acceptance criterion no matrix row reaches.
2. **Verifiability.** Can each acceptance criterion be judged pass or fail without
   interpretation? Words such as "appropriately", "reasonably", "as needed", "where possible", or
   any criterion whose check is not stated, make it unjudgeable: grade those P0. For the target
   texts, also judge whether an agent following the landed text could tell, without
   interpretation, which process applies and when a gate is met.
3. **Contract conflict.** Does the spec contradict the glossary, an ADR, `AGENTS.md`,
   `docs/agents/*`, the owner's decisions in `grill.md`, a project skill, or an established seam?
   Name the conflicting document and line. Overriding an ADR or a carried-over decision is allowed
   only when the spec says so explicitly. Also check each target text against the other target
   texts and against the text it leaves in place around it.
4. **Red team.** Once this spec is built, what behaviour exists that the spec did not intend? This
   epic changes rules that agents follow, so consider an agent or contributor reading the landed
   texts literally or opportunistically: loopholes that skip a gate, a ticket misclassified to
   avoid tests, a takedown used to rework a delivered deck, a merge exception used to land an
   unrelated FAIL. Separate intended consequences from accidental ones.

Grade every finding: **P0** — the spec cannot be implemented correctly as written (blocks
tickets); **P1** — real problem, resolvable inside a ticket; **P2** — worth recording.

This stage is about coverage. Report every finding you discover, including uncertain or
low-severity ones. For each give: an ID (`<axis>-<n>`), file:line, the violated requirement,
evidence, impact, confidence (high/medium/low) and grade. Write the report in Taiwan Traditional
Chinese, keeping English technical terms. If you find nothing on your axis, say so and list what
you checked. Do not edit files.
