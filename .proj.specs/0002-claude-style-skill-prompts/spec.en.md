---
epic: 0002-claude-style-skill-prompts
status: draft
revision: 2
---

# Spec 0002 — Re-tune the presentation-style skills for Claude (equivalence only)

Definitions (U, V, behaviour, keep list K1–K13, protected sentences) live in `traceability.md` and
are not repeated here.

## Problem Statement

The author added five presentation-style skills from `CXPhoenix/slide-style-design`: the router
`presentation-style-route` and four style skills (Takahashi, Steve Jobs, Wangxing, Bill Gates). They
were written to suit a GPT-family model, so the Claude copies carry prompting habits that Claude's
official guidance treats as no-ops or advises against, and they have not been checked against the
official skill-authoring guide. They are also uncommitted, have no provenance record, and their
Codex copies lack `agents/openai.yaml`, so `scripts/verify-project.py` fails.

## Solution

Vendor the five skills unchanged into both trees with provenance and Codex metadata. Pin their
current protected content in a checker. Then audit only the Claude copies against Claude's official
prompting and skill-authoring guidance and `writing-for-agents`, let the author approve findings one
by one, and apply only approved **equivalence rewrites**: wording and structure change, behaviour
does not. Findings that would change behaviour are deferred.

## User Stories

1. As the author, I want the five style skills committed with their source and revision recorded,
   so that I can update them from `slide-style-design` later.
2. As the author, I want the Claude copies to follow Claude's official prompting and skill
   guidance, so that they read the way Claude reads best.
3. As the author, I want to approve every proposed change, and to see separately any change to
   protected content, so that nothing about a style's meaning changes without my decision.
4. As a consumer of a style's settings, I want `style_id`, `core_rules`, `adjustable_rules`, every
   `rule_id` and the YAML/JSON rule unchanged, so that whatever reads the settings keeps working.
5. As the author, I want each request to the router or a style skill to behave exactly as before,
   so that the rewrite improves reliability without changing outcomes.
6. As the author, I want the Codex copies left as vendored, so that each runtime keeps the tuning
   that suits its model.

## Implementation Decisions

- **Equivalence only.** No hunk may change behaviour as `traceability.md` defines it. This keeps
  the Claude and Codex copies behaviourally identical, so `docs/agents/runtime.md`'s rule to port
  behaviour changes across trees is not triggered. Behaviour-changing findings go to the report as
  deferred, for a later epic that changes both trees.
- **Vendoring first**, in one commit V: the 43 files of U into each tree, byte-identical, plus each
  Codex copy's `agents/openai.yaml` (so V itself passes the verifier), plus `skills-lock.json` and
  `docs/agents/skill-sources.json` entries (repo, revision U, license MIT).
- **Codex `openai.yaml` wording is derived, not written**: display name from the skill's H1,
  short description from the vendored description's first clause. No other Codex change.
- **Procedure.** This epic applies `tune-skills` steps 3–5 to these five Claude copies by the
  author's explicit request (2026-10-16). Step 1's stop gate does not apply: the trigger is newly
  vendored skills, not a model change. Step 6 is replaced by AC15:
  `runtime_trees.claude_tuned_for` stays unchanged, because this audit covers five skills, not the
  tree.
- **Audit** with `/claude-api prompt-audit`; if it is unavailable, the epic stops and reports. The
  reader is the main-session model recorded in `runtime_trees.claude_tuned_for`. Guidance sources:
  the Claude prompting best-practices page, that model's prompting page, the Agent Skills authoring
  best-practices page, and `writing-for-agents` with `SKILL-MECHANICS.md`. The keep list K1–K13 is
  passed to the audit.
- **Report** at `docs/agents/skill-tuning/2026-10-16-claude-opus-5-5-style-skills.md`: English body
  for agents, with a Taiwan Traditional Chinese approval table for the author (finding, file:line,
  proposed change, keep-list flag, ruling). The combined patch sits beside it.
- **Keep-list hunks** are flagged in the report and need their own approval line, separate from
  ordinary approval.
- **Model names stay out of skill text.**
- **Behaviour probes are deferred** (author's decision): the router probe design (three runs per
  version per case, outcome judged against each case's allowed set) is recorded in
  `.proj.specs/OPEN-QUESTIONS.md`. Real-use evidence will come from the deck-production history
  planned as a separate epic.
- **Glossary.** "Presentation style" (a way of expressing a talk, e.g. Takahashi) is a different
  concept from **Theme** (a deck's visual system); the project glossary gains that term so specs and
  skills stop overloading "style".

## Testing Decisions

Hard rule 2's red step is met by characterization plus mutation, per ADR-0006: an equivalence
rewrite has no behaviour to make red, so the tests pin current content and are shown to be
sensitive before the rewrite.

- **Checker** `scripts/check_style_skills.py`: reads the five Claude copies and a baseline file
  `scripts/style-skills-baseline.json` generated from V; checks K1, K2, K3, protected sentences
  (K4–K6, K8, K10, K11), byte-equal files (K7, K9, K12), K13, description form (AC5), body length
  (AC6) and links (AC7); prints one `FAIL:` line per violation and exits 1, else exits 0. An item
  approved as a keep-list change is listed in the baseline's `approved_changes` with its finding ID
  and is then checked against its approved text.
- **Tests** `scripts/test_check_style_skills.py` (standard-library `unittest`, run with
  `python3 -m unittest discover -s scripts -p 'test_*.py'`): pass on the baseline fixture; for each
  checked property, a mutated fixture makes that property's test fail. The test plan table lists
  every property and its mutation and is approved by the author before the tests are written; the
  protected-sentence list in the baseline is approved with it.
- **Equivalence review**: `harness-reviewer` with a frozen prompt
  (`.proj.specs/0002-claude-style-skill-prompts/review/equivalence-prompt.md`), one axis — "does any
  hunk change behaviour as defined in `traceability.md`, including trigger scope of the
  description?" — over the full Claude-copy diff V...HEAD. Every finding goes to the author
  unfiltered; the author rules; fixed hunks are re-reviewed with the same prompt; at most two
  passes; a hunk with an unresolved P0 or P1 after pass 2 is reverted.
- **Grep check**: every removed or reworded sentence is searched across the repository excluding
  the Codex twin, `.proj.specs/` and `docs/agents/skill-tuning/`; each remaining hit is updated or
  the hunk reverted.
- **Surface**: these checks read files; no browser or agent session is exercised in this epic
  (probes deferred). Reports name that surface.

## Acceptance Criteria

- **AC1** — At V, each of the 43 files of U exists at the matching path in both trees and its
  `git hash-object` equals U's blob; `skills-lock.json` lists the five skills with source
  `CXPhoenix/slide-style-design`.
- **AC2** — At V, each Codex copy has `agents/openai.yaml` whose `interface.display_name` equals the
  skill's H1 text (without `# `), whose `interface.short_description` equals the vendored
  description up to (not including) its first `,` or `;`, and which has no `policy` key.
- **AC3** — `git diff V...HEAD --stat -- .agents/skills/<each of the five>` is empty.
- **AC4** — Each Claude copy's frontmatter `name` equals its folder name and its value at V, and no
  Claude copy has a `disable-model-invocation` key.
- **AC5** — Each Claude copy's `description`: matches none of `\b(I|me|my|you|your|we|our)\b`
  (case-insensitive); its first word matches `^[A-Z][a-z]+s$`; contains `Use when`; has at most
  1,024 characters (Python `len`) and at most 1.25 × its length at V; contains no `<` or `>`.
- **AC6** — Each Claude copy's `SKILL.md` has fewer than 500 lines after the closing `---` of its
  frontmatter.
- **AC7** — In each Claude copy, every inline Markdown link `[text](target)` whose target is not a
  URL or `#anchor` resolves to an existing file, and every file under `references/` is the target
  of at least one such link in that skill's `SKILL.md`.
- **AC8** — Every hunk of `git diff V...HEAD -- .claude/skills/<the five>` appears in the report
  with a finding ID whose status is approved for the hunk's final text; each finding cites at least
  one guidance source by URL and section heading.
- **AC9** — `python3 scripts/check_style_skills.py` exits 0 at HEAD, and the baseline file at HEAD
  differs from the one generated at V only by `approved_changes` entries, each naming a finding
  marked keep-list-approved in the report.
- **AC10** — The checker tests pass at HEAD; the ticket's Comments contain the test plan table with
  the author's approval, and a run log showing each mutated fixture failing its property's test
  before the rewrite was applied.
- **AC11** — The report records each equivalence-review pass: the prompt file's `git hash-object`,
  every finding, the author's ruling on each, and for pass 2 the same prompt hash; after the final
  pass no P0 or P1 finding is unresolved.
- **AC12** — Each hunk whose removed lines fall inside a keep-list item at V is flagged keep-list in
  the report and has a separate author approval line.
- **AC13** — The report exists at the fixed path, lists every file of the five Claude copies as
  clean or with findings, gives each finding the fields of `traceability.md` row 16, and marks every
  behaviour-changing finding deferred.
- **AC14** — At HEAD, `python3 scripts/verify-project.py`, `python3 scripts/check_style_skills.py`
  and `python3 -m unittest discover -s scripts -p 'test_*.py'` each exit 0.
- **AC15** — `docs/agents/skill-sources.json` at HEAD records, for each of the five skills, the
  source repo, revision `80e5d06bddda8a4c5e02d7ece58b66038b543574`, license MIT, "Codex: as
  vendored plus agents/openai.yaml", and "Claude: equivalence-tuned per <report path>"; the value of
  `runtime_trees.claude_tuned_for` is identical to its value at V.
- **AC16** — No Claude copy at HEAD contains a model ID or model family name (Opus, Sonnet, Haiku,
  Fable, Mythos, GPT) that it did not contain at V.
- **AC17** — The ticket's Comments contain the grep check's command and output, and no hit outside
  the excluded paths remains unresolved.
- **AC18** — The project glossary defines "Presentation style" and lists it as distinct from Theme.

## Out of Scope

- Any behaviour change, in either tree.
- Re-tuning the Codex copies.
- Behaviour probes (deferred to `.proj.specs/OPEN-QUESTIONS.md`).
- Changing `CXPhoenix/slide-style-design`.
- Re-tuning any other skill, or updating `runtime_trees.claude_tuned_for`.

## Further Notes

- Depends on epic 0001 for the glossary file name used in AC18; if 0001 has not landed, AC18 edits
  `CONTEXT.md` and 0001's rename carries it.
- The descriptions are model-invoked and always in context, so AC5's length cap keeps the rewrite
  from adding per-turn cost.
