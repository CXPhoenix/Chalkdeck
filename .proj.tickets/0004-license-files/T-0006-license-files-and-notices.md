---
id: T-0006
title: License content under CC BY-SA 4.0 and code under MIT, with notices and pointers
epic: 0004-license-files
status: todo
blocked_by: []
---

## Context

Spec 0004 (revision 3) and its `traceability.md` hold every definition, target text (T1–T18) and
check this ticket uses; this file does not repeat them, and where a summary below is shorter than
the spec, the spec governs.

The epic is documentation only and was sized as one ticket. A split into the license files and
notices (which alone carries E1) and the deck-track amendments was considered and rejected:

- the second ticket's B would contain the first ticket's changed target files, so it would drift
  from S0 by definition and stop for an owner ruling every time;
- the deck-track texts depend on the first half (T10 and T14 name the T4 Assets table, T13 describes
  `LICENSE` and `LICENSE-CODE`), so nothing could land in parallel;
- the drift ruling already allows splitting any single difference off into a new epic.

Branch `tickets/T-0006/license-files-and-notices` from `main` **after** the spec merge (the commit
that merges `specs/0003-license-split` into `main`). Work in a worktree, because the main checkout
is on another branch with the owner's untracked files. B is the branch's starting commit; the branch
never merges `main`, and if it must be updated it is rebased and the new B is recorded with the
reason and a fresh drift check.

A fresh worktree has no `node_modules`. Before the drift check, run `pnpm install --frozen-lockfile`
in it so that the installed `node_modules/@open-slide/core/LICENSE` exists, and record in the same
Comment that this was done and that `git status` shows no tracked change (no dependency added,
`pnpm-lock.yaml` untouched).

Documentation only: the spec adds no tests (Testing Decisions, "No new tests"), so the `/tdd`
red → green loop has no test to write, and ADR-0006 does not apply (spec, Implementation Decisions,
Ticket). Hard rule 2 still holds: the test plan table lists the acceptance checks and is approved
by the user before the first commit that touches a target file; the coverage report table, keyed
by spec AC, maps each AC to its recorded check output and is written before stage 6.

No file under `.proj.specs/0004-license-files/` changes on this branch except the stage-7 report
`review/security-T-0006.md`; `spec.zh-TW.md` landed with the spec. The epic close-out evidence report
and retrospective are committed after the merge, not on this branch.

## Deliverable

A reuser opening the repository on GitHub finds `LICENSE` (the CC BY-SA 4.0 legal code),
`LICENSE-CODE` (MIT, CXPhoenix), a README License section, and a `THIRD_PARTY_NOTICES.md` whose first
section is T1's Licensing section with the licensing table, followed by the existing entries and the
new Assets, open-slide and K-Dense entries. No file in the C1 scope still claims a "root MIT
license", the stale init-template provenance entries are gone, ADR-0007 records the decisions and
amends ADR-0004, and the agent rules keep the notices current for deck changes and open-slide
upgrades.

## Acceptance criteria

Items are numbered for this ticket only. Each cites, in parentheses, the spec ACs and traceability
rows it covers; those spec ACs are authoritative, and the coverage report table is keyed by spec AC
(AC1–AC12), not by item number. Items 13 and 14 restate the spec's Testing Decisions and Unchanged
sections.

1. **First Comment, before any commit touching a target file** (AC10, N8; AC4, N6, N7): set
   `status: processing`, then record:
   - B's full SHA and the spec merge SHA;
   - every target file's blob at B, compared with its S0 blob, except `GLOSSARY.md`, whose reference
     is its blob at the spec merge; plus the check that its `**Deck content work**` heading,
     definition and `_Avoid_` lines read exactly as at S0;
   - the `.claude/skills/` symlink set;
   - line 3 of the installed `node_modules/@open-slide/core/LICENSE`;
   - the inventory command and its output;
   - the archive check for both archives: the four results the traceability's Archive check lists
     (member count, license-like names, nested `.zip`, each `package.json` `license` field), read
     with `namelist()` and `ZipFile.read` only, never extracted, and no member path. The S0 table has
     these four columns; the definition's "two things" is a known typo for four.

   Each is stated equal to its reference or not. On any drift, stop and ask the repository owner for
   a *proceed* or *split* ruling per difference. On *proceed*, the approved text is quoted in the
   ruling Comment and replaces the affected T-block or T4 row for every AC and for the comparison
   scripts; if the difference is in the inventory or archive check, the ruling also states what AC4
   is checked against. On *split*, that work leaves this ticket. Status stays `processing` unless the
   owner sets `pending`. The ruling Comment's commit precedes every commit touching a target file.
   Repeat all of this for every later B.
2. **`LICENSE`** is the Source LICENSE, blob `2d58298e6eda10e7204abb52722efbc840db2390`, mode
   `100644` (AC1, L1).
3. **`LICENSE-CODE`** differs from `.agents/skills/tdd/LICENSE` only on line 3, which reads
   `Copyright (c) 2026 CXPhoenix`; mode `100644` (AC2, L2).
4. **Notices**, by exact comparison: B lines 3–6 replaced by T1, line 76 by T2, lines 85–88 by T3,
   T4–T7 appended, every other B line unchanged (AC3, N1–N5).
5. **Provenance file** equals, byte for byte, the expected file the provenance comparison builds
   from B by S1–S6, and parses as JSON; `verified_on` equals the ADR date (AC5, S1–S7).
6. **agent-browser `SKILL.md`**, both trees, by exact comparison: only lines 12–13 differ from B,
   replaced by T9 (AC6, A1).
7. **`AGENTS.md`**, by exact comparison: differs from B only by T10, T11 and T17 at the places G1, G2
   and G4 name (AC7, G1–G4).
8. **`README.md`**, by exact comparison: differs from B only by T8, appended as its last section
   (AC8, R1).
9. **ADRs, index, workflow, glossary**, by exact comparison: ADR-0007 equals T13 with the ADR date;
   `docs/README.md` differs from B only by T12; ADR-0004 only by T18; `workflow.md` only by T16 and
   T14; `GLOSSARY.md` only by T15 (AC9, D1–D3, W1, W2). T10 and T13–T18 land together in this one
   merge; none is cherry-picked or landed separately.
10. **Scope and checks at HEAD** (AC11, C1, X1, X2): the C1 `git grep` returns nothing;
    `git diff --name-only <B SHA>...HEAD` lists only X1 paths; the three X2 commands exit 0 when run
    from the repository root.
11. **No archive member path** appears in any X1 file, any commit message on the branch, or the PR
    description (AC4, N7).
12. **Browser check before merge** (AC12, E1): with `/agent-browser`, or a native browser tool that
    `docs/agents/workflow.md` accepts as giving equivalent evidence, open the pushed branch's GitHub
    file views of `LICENSE`, `LICENSE-CODE`, `THIRD_PARTY_NOTICES.md` and `README.md`. Each shows its
    rendered content, not an error page; the T1 and T4 tables render as tables; every relative link
    in T1 and T8 opens a page that is not GitHub's 404 page. Page text, not screenshots, is recorded
    in Comments; the surface is the GitHub file view. GitHub's license detection on the default
    branch is noted after the merge, in the epic close-out retrospective.
13. **Recorded checks** (spec Testing Decisions): every listed check is run and its output recorded
    in Comments. The exact comparison and the provenance comparison are scripts, never a reading of
    the diff by eye.
14. **Unchanged** (spec Implementation Decisions, Unchanged; X1): nothing under `slides/`, `themes/`
    or `assets/` changes, `package.json` is untouched, and no dependency is added.

## 給使用者（zh-TW）

這張票一次做完 epic 0004 的文件改動，內容如下：

- 根目錄放上 CC 官方的 CC BY-SA 4.0 授權全文（`LICENSE`），以及你署名的 MIT（`LICENSE-CODE`）。
- `THIRD_PARTY_NOTICES.md` 標題下的第一節換成 Licensing 授權說明，附上「哪些路徑用哪個授權」的表格；文末補上第三方素材、open-slide 與 K-Dense 的標示。
- README 加一節 License。
- provenance 檔與 agent-browser skill 不再指向「根目錄 MIT」。
- 新增 ADR-0007 並修訂 ADR-0004，讓 deck 變更能在輕量軌上順手更新自己的素材列。

開工前會先記錄起點 B、在新 worktree 執行 `pnpm install --frozen-lockfile`，再跑 drift 檢查；只要有任何一項和基準不同，就停下來請你逐項裁決，看是照核准的文字繼續，還是拆成新 epic。每項檢查都會執行並記錄輸出，逐字比對與 provenance 比對用腳本做，不靠肉眼看 diff。合併前會用瀏覽器在 GitHub 上確認四個檔案都能正常顯示、連結都能打開。

## Comments
