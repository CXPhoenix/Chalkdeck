---
id: T-0007
title: The verifier reports bad license references in the provenance file
epic: 0005-license-reference-check
status: processing
blocked_by: []
---

## Context

Spec 0005 (revision 3) and its `traceability.md` hold every definition, rule, message, target text
and matrix row this ticket uses; this file does not repeat them, and where a summary below is
shorter than the spec, the spec governs.

The epic is split into two tickets (owner, 2026-10-23: "照兩張票拆"). This one builds the license-
reference check for the provenance file and wires it into the verifier. T-0008 adds the notices,
the deck-track texts and the end-to-end runs. Rows whose expected output includes a notices message
(D4, I1, I2, W1) belong to T-0008, so this ticket can close on its own.

Branch `tickets/T-0007/provenance-license-references` from `main` **after** the spec merge (the
commit that merges `specs/0005-license-reference-check` into `main`). Work in a worktree under
`.worktrees/`, because the main checkout is on another branch with the owner's untracked files. B is
the branch's starting commit (spec, Definitions, Base).

This ticket changes behaviour, so `/tdd` governs the loop, and red evidence follows the spec's
"Tests and red" rule, including mutation for any sub-case that passes on its first run (Ruling R7).
Hard rule 2 holds: the test plan table, listing every sub-case of the rows below and each planned
mutation, is approved by the repository owner before the first test is written. The coverage report
table, keyed by spec AC, closes the ticket.

## Deliverable

Running `python3 scripts/verify-project.py` reports, as `FAIL:` lines, every license reference in
the provenance file that is not a string, is empty, has surrounding whitespace, uses a URL scheme,
leaves the repository, is not a plain repository path, does not exist, differs in case, passes
through a symlink or is not a regular file. It also reports every root-license `license_location`
whose `license` disagrees with the root license file. Placeholders and sentences are skipped. Messages are
rendered by Q and come in document order. On the real tree the verifier still passes, and its PASS
line names license references.

## Acceptance criteria

Items are numbered for this ticket only. Each cites, in parentheses, the spec ACs and traceability
rows it covers; those are authoritative, and the coverage report table is keyed by spec AC.

1. **First Comment, before any commit** (AC7, X2): set `status: processing`, then record B's full
   SHA, the spec merge SHA, and the output of
   `git diff --name-only 2577b504fa5f22fcef047a95f6d9c2afc9a2daf4 <B> -- scripts/ AGENTS.md docs/agents/skill-sources.json THIRD_PARTY_NOTICES.md`.
   If it lists any path, stop and ask the repository owner whether to proceed; quote the answer.
2. **Test plan table approved** (hard rule 2): one line per sub-case of P1–P9, D1–D3, D5 and D6,
   with its expected list and, where a first-run pass is expected, its mutation.
3. **Provenance rows pass** (AC1; P1–P9, D1–D3, D5, D6): each sub-case is its own test, passes at
   HEAD, and has its red recorded in Comments with the failing output, the HEAD commit and the
   `git hash-object -w` blob of the test file. Nothing skips on macOS as a non-root user.
4. **Wiring and real tree** (AC4 in part; W2 in part): `verify()` extends its errors with
   `check_license_references(root)` right after `check_glossary(root)`. `verify-project.py` exits 0
   on the ticket worktree and prints the T1 PASS line. The full W1 and W2 are judged in T-0008.
5. **Texts** (AC5 in part): T1, T2, T3 and T6 hold at HEAD.
6. **Module checks** (AC4; W3, W4): reading the module confirms W3; reading
   `git diff <B>...HEAD -- scripts/verify-project.py` confirms W4.
7. **Scope and checks** (AC7; X1, X3): `git diff <B>...HEAD --name-only` lists only paths in X1, and
   the three X3 commands exit 0 at HEAD.
8. **Coverage report table** keyed by spec AC (AC1, AC4, AC5, AC7 in part), each cell pointing at
   the Comment that holds its evidence.

## 給使用者（zh-TW）

這張票替 verifier 加上 provenance 這一側的授權引用檢查。完成後，`skill-sources.json` 裡任何 `license_location` 有以下情況都會出現 `FAIL:`：不是字串、是空字串、頭尾有空白、用了 URL scheme、跑出 repo、不是單純路徑、檔案不存在、大小寫不符、經過 symlink、不是一般檔案。指向根授權檔的條目，`license` 和檔案不一致時也會 FAIL。placeholder 和說明句會略過。訊息依 JSON 的文件順序輸出，特殊字元都會跳脫。

真實檔案樹上 verifier 仍然 PASS，PASS 行會多出「license references」。notices 的檢查、deck 軌的規則、ADR-0008 與 E2E 都在 T-0008。

開工前我會先請你核准 test plan 表格（列出每個子案例與預計使用的 mutation）。

## Comments

### 2026-10-23 — Base and drift check (item 1)

- B: `46cfe0331d2edb69bdbb62fa72f162b794b05bac`, the branch's starting commit.
- Spec merge: `46cfe0331d2edb69bdbb62fa72f162b794b05bac` (PR #11, merged 2026-10-23T14:52:41Z,
  confirmed with `gh pr view 11`). B is the spec merge itself.
- Drift: `git diff --name-only 2577b504fa5f22fcef047a95f6d9c2afc9a2daf4 46cfe0331d2edb69bdbb62fa72f162b794b05bac -- scripts/ AGENTS.md docs/agents/skill-sources.json THIRD_PARTY_NOTICES.md`
  printed nothing: the verifier, its tests, `AGENTS.md` and both inputs equal B0.
- Baseline at B: `python3 scripts/verify-project.py` exits 0 (PASS, 45 skills);
  `python3 -m unittest discover -s scripts -p 'test_*.py'` ran 138 tests, OK.
- Worktree: `.worktrees/T-0007`, branch `tickets/T-0007/provenance-license-references`.
