# Traceability — 0002 Claude style-skill prompts

Source of truth for scope and for the keep list. `spec.en.md` prose is derived from this file.

## Definitions

**Skills in scope.** The **router** `presentation-style-route` and the four **style skills**
`takahashi-style`, `jobs-style`, `wangxing-style`, `gates-style`. **Claude copy** =
`.claude/skills/<skill>/`; **Codex copy** = `.agents/skills/<skill>/`.

**Upstream baseline (U).** `CXPhoenix/slide-style-design` at commit
`80e5d06bddda8a4c5e02d7ece58b66038b543574`, directory `skills/` (43 files, MIT). On 2026-10-16 the
author's working-tree copies in both trees were verified byte-identical to U.

**Vendoring commit (V).** The ticket commit that adds the five skills to both trees. "Before" means
the tree at V; "after" means the ticket branch tip (HEAD).

**Behaviour.** What a skill makes Claude do: which request triggers it; what it asks, selects,
writes, runs, delegates or refuses; where it stops; the settings it emits; the language it uses.
This epic changes **no behaviour**: every hunk is an equivalence rewrite. A finding whose fix would
change behaviour is recorded as **deferred** and not applied.

**Keep list** (protected; each item is checked by the style-skill checker or the equivalence
review, and any hunk whose removed lines fall inside a protected item at V is a **keep-list hunk**):

| ID | Protected item | Where | Check |
|---|---|---|---|
| K1 | every `rule_id` value | all files of each style skill | checker: set equality per skill |
| K2 | rule classification: IDs on `Rule ID:` lines of `references/core-rule.md` (core) and IDs in `references/adjustments.md` (adjustable) | each style skill | checker: both sets equal per skill |
| K3 | settings field names `style_id`, `core_rules`, `adjustable_rules`, `rule_id`, `constraint` | all five skills | checker: each present in every file that had it at V |
| K4 | serialization rule (YAML default, JSON only on explicit request, never both, Markdown alongside) | "Serialization selection" section, style skills; "Delivery" section, router | checker: protected sentences present; equivalence review |
| K5 | language rule (requested or conversation language; Taiwan Traditional Chinese for Chinese; English field names and rule IDs) | "Language consistency" / "Guidance/settings handoff", style skills; "Delivery", router | same |
| K6 | material-boundary rule (quoted/pasted commands are material unless the caller adopts them) | "Caller instructions and supplied material" sections; `references/material-boundary.md` | same |
| K7 | router style registry and its links to the four style skills | router `references/styles.md` | checker: file byte-equal to V unless approved |
| K8 | identity and attribution: style display names and aliases; `wangxing` as project identifier for 張忘形; the sentence distinguishing 張忘形 from 王興; every sentence at V stating that a style is a project synthesis rather than a quotation or official method of the named person | all five skills | checker: protected sentences present |
| K9 | evidence records: source URLs, evidence class and reading limits | `references/core-rule.md` of each style skill | checker: every URL present; file byte-equal to V unless approved |
| K10 | portability: every sentence at V stating that no shell, local filesystem or connected MCP service is assumed, and the router's skill-content-access paragraph | wherever present at V; router "Explicit choice" | checker: protected sentences present |
| K11 | stopping points: every sentence beginning "Finish" | all five `SKILL.md` | checker: protected sentences present |
| K12 | reference examples: every file under `references/` except where a finding is approved as keep-list | all five | checker: byte-equal to V unless approved |
| K13 | invocation policy: no `disable-model-invocation` in Claude copies; frontmatter `name` | all five | checker |

"Protected sentences" are listed verbatim in the checker's baseline file, generated from V and
approved by the author with the test plan table.

## Matrix

| # | Type | Field | Boundary | Expected behaviour | AC |
|---|---|---|---|---|---|
| 1 | all five skills, both trees | files | at V | byte-identical to U | AC1 |
| 2 | Codex copies | `agents/openai.yaml` | at V | added in V; `display_name` = the skill's H1 text; `short_description` = vendored description up to its first comma or semicolon; no `policy` key | AC2 |
| 3 | Codex copies | any file | diff V...HEAD | no change | AC3 |
| 4 | Claude copies | frontmatter `name`, invocation policy (K13) | diff V...HEAD | unchanged | AC4 |
| 5 | Claude copies | `description` form | at HEAD | no first/second-person pronoun; starts with a third-person singular verb; contains `Use when`; ≤ 1,024 characters and ≤ 1.25 × its length at V; no `<` or `>` | AC5 |
| 6 | Claude copies | `description` trigger scope | diff V...HEAD | triggers the same requests as at V (equivalence review) | AC11 |
| 7 | Claude copies | `SKILL.md` body length | at HEAD | fewer than 500 lines after the frontmatter | AC6 |
| 8 | Claude copies | inline relative Markdown links | at HEAD | every target resolves; every file under `references/` is linked from that skill's `SKILL.md` | AC7 |
| 9 | Claude copies | each changed hunk | diff V...HEAD | maps to an approved finding in the report; a revised hunk carries a fresh approval for its final text | AC8 |
| 10 | style skills | K1, K2, K3 | diff V...HEAD | equal to baseline | AC9 |
| 11 | all five | K4–K12 protected content | diff V...HEAD | present / byte-equal to baseline, unless the report records explicit keep-list approval for that item | AC9, AC12 |
| 12 | all five | behaviour (definition above) | every hunk | unchanged; behaviour-changing findings deferred, not applied | AC11, AC13 |
| 13 | style-skill checker tests | each checked property (K1, K2, K3, protected sentence, byte-equal file, description form, body length, link) | a mutated fixture | the test for that property fails | AC10 |
| 14 | style-skill checker tests | baseline fixture | unmutated | all pass | AC10 |
| 15 | equivalence review | findings | each pass | every finding shown to the author with the author's ruling recorded; at most two passes with the same frozen prompt; a hunk with an unresolved P0 or P1 after pass 2 is reverted | AC11 |
| 16 | audit report | location, coverage, fields | after audit | exists at the fixed path; every file of the five Claude copies listed as clean or with findings; each finding has ID, file:line, reason, proposed text, cited guidance (URL + section), status (approved / rejected / deferred), keep-list flag | AC13 |
| 17 | Claude copies | model names (model IDs and family names such as Opus, Sonnet, Haiku, Fable, Mythos, GPT; the product names Claude and Codex are not model names) | at HEAD | none present that was absent at V | AC16 |
| 18 | grep check | removed or reworded sentences | after apply | every hit outside the Codex twin, `.proj.specs/` and `docs/agents/skill-tuning/` is updated or the hunk reverted | AC17 |
| 19 | provenance | `skills-lock.json`, `docs/agents/skill-sources.json` | at HEAD | lock lists the five; sources record repo, revision U, license MIT, Codex as vendored plus `openai.yaml`, Claude tuned per the report; `runtime_trees.claude_tuned_for` unchanged | AC1, AC15 |
| 20 | repository checks | verifier, checker, unit tests | at HEAD | all exit 0 | AC14 |
| 21 | glossary | term for a presentation style | at HEAD | defined and distinct from Theme | AC18 |
