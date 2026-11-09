---
id: T-0009
title: Write the documentation-only ticket process and the stricter code-ticket loop into the workflow
epic: 0006-docs-only-ticket-process
status: todo
blocked_by: []
docs_only: true
verbatim: true
---

## Context

The workflow assumes every ticket is code (stage 5 says only "Run `/implement`, which uses
`/tdd`"), gives two times for the coverage report table, and keeps the owner's ruling D1 only in a
ticket and agent memory. Epic 0005 also showed gaps in the code-ticket loop: batch-written tests,
mutations outside the approved table, and red evidence in loose blobs. Spec
`.proj.specs/0006-docs-only-ticket-process/spec.en.md` (revision 3) and its `traceability.md`
define the fix; this ticket lands all of it.

This is a documentation-only ticket: every region it lands is prose in `docs/`, `AGENTS.md`,
`GLOSSARY.md` and `.proj.specs/OPEN-QUESTIONS.md`. By Ruling R6 (Z1) it runs under T1's checklist,
T2's verbatim review and T8's keys before those texts are on `main`.

## Deliverable

Lands every target text of the spec, each in the region `traceability.md` names. All eight are
verbatim regions:

- `docs/agents/workflow.md`: T15 (stage 4 gate), T1 (stage 5), T2 (stage 6).
- `AGENTS.md`: T14 (pipeline row 5), T6 (hard rule 2).
- `docs/agents/issue-tracker.md`: T8 (the two frontmatter keys).
- `GLOSSARY.md`: T9 (Documentation-only ticket).
- `.proj.specs/OPEN-QUESTIONS.md`: T13 (OQ-9, OQ-10).

No other file changes outside this ticket file and the epic's review and report files.

## Acceptance criteria

Traced to `traceability.md`; judged against this ticket's latest recorded B.

- **AC1.** `docs/agents/workflow.md`: T1, T2, T15 match (rows K1–K15, A1–A8, L1–L9, V1–V3,
  C1–C3, Q1–Q9, S1–S6, T-rows); nothing else changes.
- **AC2.** `AGENTS.md`: T6, T14 match; nothing else changes.
- **AC3.** `docs/agents/issue-tracker.md`: T8 matches; `GLOSSARY.md`: T9 matches; nothing else
  changes in either.
- **AC4.** `.proj.specs/OPEN-QUESTIONS.md` ends with T13, numbered as the Drift definition says;
  nothing else changes.
- **AC5.** E1, on the GitHub file view of the pushed branch, recorded in Comments.
- **AC6.** X1–X5 against this ticket's B; X6, as the only ticket of the epic.
- **AC7.** The owner's approval of Z1 is recorded in Comments (below).

The acceptance checklist (T1's form) is written into this file at stage 5 and approved before any
other file changes.

## 給使用者（zh-TW）

這張票把 epic 0006 的 8 段目標文字，一次逐字落地到 workflow、`AGENTS.md`、tracker 設定、glossary 和 open questions。

做完之後：
- agent 從票的 frontmatter 就能判斷是純文件票還是 code ticket；
- 純文件票照一份你核准的檢查清單執行；
- code ticket 照「一列一個測試、每一輪 commit、事先寫好 mutation、紀錄附上 diff」的循環執行；
- 逐字段落在 stage 6 改用記錄下來的比對 script 檢查。

這張票本身就是第一張照這些規則執行的純文件票。正文以英文為準。

## Comments

### 2026-11-09 — Stage 4 breakdown approval (Z1)

Question put to the repository owner: "核准這份拆票嗎？", covering the one-ticket breakdown above,
the kind `docs_only: true` and `verbatim: true` with the eight regions listed under Deliverable, and
the self-application of Ruling R6 (Z1): this ticket runs under T1's checklist, T2's verbatim review
and T8's keys before those texts land. The proposal was shown in the conversation; this file did
not exist yet.

The owner answered: "核准，一張票".
