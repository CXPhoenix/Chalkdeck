---
id: T-0004
title: Audit the Claude copies and collect the author's rulings
epic: 0002-claude-style-skill-prompts
status: todo
blocked_by: [T-0002]
---

## Context

Spec 0002 Implementation Decisions (Procedure, Audit, Report, Keep-list hunks). This ticket produces
decisions, not skill edits: the report, the approved patch and the frozen equivalence-review prompt
that T-0005 applies and uses. It replaces `tune-skills` steps 2–4 for these five skills as follows.

Branch `tickets/T-0004/audit-claude-copies` from `main` after T-0002 has landed, in a worktree
outside the main checkout. V is the T-0002 commit.

## Deliverable

An audit report the author has ruled on line by line, a patch containing exactly the approved
hunks, and an equivalence-review prompt the author has approved, all committed.

## Acceptance criteria

1. **Budget first** (`tune-skills` step 2): before any audit or subagent runs, the plan and a
   spending cap are put to the author; the cap and the author's words are recorded in Comments.
2. **Audit tool**: `/claude-api prompt-audit` over every file of the five Claude copies, reader =
   the model in `runtime_trees.claude_tuned_for`. If the tool is unavailable, stop and report; no
   improvised audit.
3. **Inputs passed to the audit**: the keep list K1–K13; "frontmatter keeps exactly `name` and
   `description`"; "descriptions keep every style name and alias and `張忘形`"; the behaviour
   definition from `traceability.md`; and the instruction that behaviour-changing findings are
   reported but marked deferred.
4. **Report** at `docs/agents/skill-tuning/2026-10-16-claude-opus-5-5-style-skills.md` (fixed path
   from the spec, even if the audit runs later; the actual run date is stated in the report). English
   body. Every file of the five Claude copies is listed as clean or with findings. Each finding has:
   ID; file:line at V; reason; proposed text in English, verbatim; cited guidance (URL plus section
   heading for web pages, repo path plus heading for `writing-for-agents` files); classification
   (`equivalence` or `behaviour-changing`, behaviour-changing ones marked `deferred`); keep-list flag;
   status.
5. **Keep-list flag** is set when the finding's removed **or** added lines fall inside a keep-list
   item's protected content or section at V.
6. **Author table (zh-TW)** at the end of the report: one row per finding with a Chinese summary,
   the English hunk verbatim, the keep-list flag and the author's ruling (`approve`, `reject`,
   `defer`). Keep-list findings need a second, separate approval line quoting the author. A
   description finding the author rejects leaves that description as at V (adjudicated resolution of
   the AC5 deadlock).
7. **Patch** `docs/agents/skill-tuning/2026-10-16-claude-opus-5-5-style-skills.patch` contains
   exactly the approved hunks, each preceded by a comment line naming its finding ID, and
   `git apply --check` succeeds against V.
8. **Equivalence-review prompt** written to
   `.proj.specs/0002-claude-style-skill-prompts/review/equivalence-prompt.md` and approved by the
   author before T-0005. It defines grading for this review: **P0** = the hunk changes behaviour as
   defined in `traceability.md`, including description trigger scope; **P1** = the hunk may change
   behaviour and the reviewer cannot rule it out; **P2** = wording only. It names the full diff
   V...HEAD as scope and says the final diff is re-reviewed after any fix or revert.
9. Report language note: the English body serves agents (`docs/agents/*`), the zh-TW table serves the
   author's approval, per `docs/agents/language.md`'s "who accepts it" rule; stated in the report.
10. No file under `.claude/skills/` or `.agents/skills/` changes in this ticket.

## 給使用者（zh-TW）

這張票只產出決定，不改 skill。先請你訂花費上限，再用 `/claude-api prompt-audit` 稽核 5 個 Claude 版 skill，寫成一份報告。報告最後有一張中文核准表，每個建議都附上英文原文，由你逐條決定「核准、否決、暫緩」。改到受保護內容的建議要你另外再核准一次；你否決的 description 改寫就維持原樣。

最後產出只含核准項目的 patch，以及給下一張票用的等效審查 prompt，這份 prompt 也要你核准。

## Comments
