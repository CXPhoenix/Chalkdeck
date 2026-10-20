---
id: T-0005
title: Apply the approved rewrites and prove the style skills still behave the same
epic: 0002-claude-style-skill-prompts
status: todo
blocked_by: [T-0003, T-0004]
---

## Context

Spec 0002 acceptance criteria AC4–AC18, with the round-2 adjudication. Inputs: the approved patch,
report and equivalence-review prompt from T-0004; the checker and baseline from T-0003. V is the
T-0002 commit.

Branch `tickets/T-0005/apply-approved-rewrites` from `main` after T-0003 and T-0004 have landed, in
a worktree outside the main checkout.

## Deliverable

The five Claude copies carry every approved rewrite and nothing else; every pinned property still
holds; an independent equivalence review and a manual smoke test show no behaviour change; the
glossary and provenance record the result.

## Acceptance criteria

1. **Apply.** The approved patch applies with `git apply`; every changed line of
   `git diff V...HEAD -- .claude/skills/<the five>` lies within the V line range of an approved
   finding, and its final text equals the approved English text in the report verbatim. A hunk
   revised during review carries a new approval row in the report quoting the author.
2. **Descriptions (spec AC5)** are checked only where the author approved a rewrite; a rejected or
   reverted description is byte-equal to V and its finding is marked `deferred` in the report.
3. **Codex untouched (spec AC3)**: `git diff V...HEAD --stat -- .agents/skills/<the five>` is empty.
4. **Checks**: `python3 scripts/check_style_skills.py`, `python3 scripts/verify-project.py` and
   `python3 -m unittest discover -s scripts -p 'test_*.py'` exit 0. The baseline differs from its
   T-0003 commit only by `approved_changes` entries, each naming a keep-list-approved finding.
5. **Equivalence review (spec AC11)**: `harness-reviewer` runs the approved
   `equivalence-prompt.md` over the full `git diff V...HEAD` of the five Claude copies. Every finding
   goes to the author unfiltered; the author rules on each (`accept as equivalent`, `fix`, `revert`).
   After any fix or revert, pass 2 replays the same prompt (same `git hash-object`) over the full final
   diff. A hunk with a P0 or P1 the author has not accepted after pass 2 is reverted, and the final
   diff after reverts is checked again with item 4. The report records both prompt hashes, all
   findings and all rulings.
6. **Grep check (spec AC17)**: for each removed or reworded sentence, the search key is the
   sentence with whitespace runs collapsed, matched whitespace-insensitively across the repository,
   excluding: the Codex twin of the same skill, `.proj.specs/`, `.proj.tickets/`,
   `docs/agents/skill-tuning/`, `scripts/style-skills-baseline.json`, `scripts/check_style_skills.py`
   (its `PROTECTED` list records V's text for baseline generation), `scripts/test_*.py`,
   `node_modules/`, `dist/`, `.proj.handoffs/`, `.worktrees/`, `.claude/worktrees/`, `.git/`.
   A hit in another Claude style copy is resolved by applying the same approved finding there (listed
   in the report) or by reverting. Command and output in Comments, repo-relative paths only.
7. **Smoke test (stage 8, adjudicated)**: a fresh interactive Claude Code session in the worktree,
   default permission mode, writes denied outside the session scratchpad. Three requests, once each:
   - explicit choice: "用高橋流整理這份講稿的呈現方式" → Takahashi guidance delivered, settings in YAML;
   - context selection: "Introduce AI to high-school students" → Wangxing selected with its anchor
     cited (router `context-examples.md` `ai_concept`);
   - missing context: "幫我選一個簡報風格" → a question for purpose or expression need, in Taiwan
     Traditional Chinese, no settings.
   Each judged against its allowed outcome; transcript excerpts in Comments with repo-relative paths.
   Surface named: "Claude Code interactive session, Claude tree only".
8. **Glossary (spec AC18)**: `GLOSSARY.md` gains **Presentation style** under Decks: one or two
   sentences defining it as a way of expressing a talk (Takahashi, Steve Jobs, Wangxing, Bill Gates),
   with `_Avoid_: theme, template`. The Theme entry is unchanged.
9. **Provenance (spec AC15)**: each of the five `skills` entries gains the adaptation "Claude:
   equivalence-tuned per docs/agents/skill-tuning/2026-10-16-claude-opus-5-5-style-skills.md";
   `runtime_trees.claude_prompt_audit` gains one sentence naming the five skills and that report;
   `runtime_trees.claude_tuned_for` is byte-identical to its value at V.
   `licensing.groups.slide-style-design` also gains a maintenance note: do not update these five
   skills with the skill installer; re-vendor from upstream and reapply the Claude tuning
   (author ruling 2026-10-21 in T-0002; documentation only, no behaviour change).
10. **Spec AC4, AC6, AC7, AC12, AC13, AC16** hold as checked by the checker and the report.
11. Coverage report table in Comments at close; epic close-out steps from `docs/agents/workflow.md`
    follow this ticket.

## 給使用者（zh-TW）

這張票把你核准的改寫套用到 5 個 Claude 版 skill，再證明行為沒有改變：
- 檢查程式、verifier、unittest 全部要通過。
- 用你核准的等效審查 prompt 請 reviewer 審查整份 diff，最多兩輪，每項發現都由你裁決，沒解決的就回退。
- 開一個新的 session 手動測 3 個請求：指定高橋流、依情境選風格、資訊不足時反問。

最後在 GLOSSARY.md 加上「Presentation style（簡報風格）」這個詞，並在 skill-sources.json 記下這次調校，並註明這 5 個 skill 不要用 installer 更新，要重新 vendor 再套用 Claude 調校。Codex 版完全不動。

## Comments
