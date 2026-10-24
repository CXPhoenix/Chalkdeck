---
id: T-0008
title: The verifier enforces the notices link grammar and required links, and the deck track runs it
epic: 0005-license-reference-check
status: todo
blocked_by: [T-0007]
---

## Context

Spec 0005 (revision 3) and its `traceability.md` hold every definition, rule, message, target text
and matrix row this ticket uses; this file does not repeat them, and where a summary below is
shorter than the spec, the spec governs.

This is the second of the epic's two tickets (owner, 2026-10-23: "照兩張票拆"). T-0007 built the
provenance side and the wiring. This ticket adds the notices side, the input and ordering rules that
need both inputs, the deck-track texts, ADR-0008 and the end-to-end runs. It is the last ticket to
land, so W2, E1–E4 and X3 are judged on its HEAD (spec, Several tickets).

Branch `tickets/T-0008/notices-grammar-and-deck-track` from `main` **after** T-0007 has merged.
Work in a worktree under `.worktrees/`. B is the branch's starting commit.

This ticket changes behaviour, so `/tdd` governs the loop, and red evidence follows the spec's
"Tests and red" rule, including mutation for any sub-case that passes on its first run (Ruling R7).
The test plan table is approved by the repository owner before the first test is written; the
coverage report table, keyed by spec AC, closes the ticket and the epic's ACs.

## Deliverable

Running the verifier also checks the notices. Each construct outside the ADR-0008 grammar fails with
its line. Each link or image destination that does not resolve fails with its line. A missing
`[CC BY-SA 4.0](LICENSE)` or `[MIT](LICENSE-CODE)` fails. Unreadable inputs are reported without
stopping the check of the other input. All messages come in the spec's five-group order. ADR-0008
records the contract. Deck content work that edits the notices' Assets rows is told, in `AGENTS.md`
and `workflow.md`, to run the verifier, and ADR-0007 says it was amended. The end-to-end runs show
the verifier passing in a detached worktree of HEAD and failing on one broken link.

## Acceptance criteria

Items are numbered for this ticket only. Each cites, in parentheses, the spec ACs and traceability
rows it covers; those are authoritative, and the coverage report table is keyed by spec AC.

1. **First Comment, before any commit** (AC7, X2): set `status: processing`, then record B's full
   SHA, the T-0007 merge SHA, and the output of
   `git diff --name-only 2577b504fa5f22fcef047a95f6d9c2afc9a2daf4 <B> -- THIRD_PARTY_NOTICES.md docs/agents/skill-sources.json docs/agents/workflow.md docs/adr/ docs/README.md AGENTS.md scripts/`.
   Every listed path must be one T-0007 changed. Otherwise, stop and ask the repository owner whether
   to proceed, and quote the answer. Re-check that the Facts at B0 about the notices still hold:
   33 links on the same lines, no construct, 23 table rows and 26 list items without the S1 and S2
   shapes.
2. **Test plan table approved** (hard rule 2): one line per sub-case of D4, N1–N6, R1–R7, G1–G10,
   C1–C4, I1–I4, O1–O4 and W1, with its expected list and, where a first-run pass is expected, its
   mutation.
3. **Rows pass** (AC1 for D4, AC2, AC3; the rows of item 2): each sub-case is its own test, passes at
   HEAD, and has its red recorded in Comments with the failing output, the HEAD commit and the
   `git hash-object -w` blob of the test file. Nothing skips on macOS as a non-root user.
4. **Wiring and real tree** (AC4; W1–W4): W1's test passes; `verify-project.py` exits 0 on the
   ticket worktree with the T1 PASS line; reading the module confirms W3; reading
   `git diff <B>...HEAD -- scripts/verify-project.py` confirms W4.
5. **Texts** (AC5; T4, T5, T7, T8, T9): ADR-0008, the `docs/README.md` index line, the `AGENTS.md`
   slide hard rule sentence, the `workflow.md` deck-track item 6 and the ADR-0007 amendment line hold
   at HEAD as the spec defines them. T1–T3 and T6 still hold.
6. **End to end** (AC6; E1–E4), run in stage 8 and recorded with commands and output, naming the
   verifier CLI on macOS as the surface: E1 on the ticket worktree; E2 and E3 with
   `python3 <tmp>/scripts/verify-project.py` in a detached worktree of HEAD; E4 removing it after
   `git worktree list` shows it.
7. **Scope and checks** (AC7; X1, X3): `git diff <B>...HEAD --name-only` lists only paths in X1, and
   the three X3 commands exit 0 at HEAD.
8. **Coverage report table** keyed by spec AC1–AC7 for the whole epic, citing T-0007's table for the
   rows it closed.

## 給使用者（zh-TW）

這張票補上 notices 這一側，並讓 deck 軌跟上，是 epic 0005 的最後一張票。完成後：

- notices 裡任何 ADR-0008 文法以外的寫法（例如 HTML、blockquote、表格儲存格裡的 `|`、清單裡的 fence）都會帶著行號 FAIL；
- 每個連結或圖片的目標都會檢查，壞掉就帶著行號 FAIL；
- 缺少 `[CC BY-SA 4.0](LICENSE)` 或 `[MIT](LICENSE-CODE)` 也會 FAIL；
- 某個輸入檔讀不到時，另一個照樣檢查，所有訊息依 spec 的五組順序輸出。

文件方面：新增 ADR-0008；AGENTS.md 與 `workflow.md` 的 deck 軌寫明「改了 Assets 列就要跑 verifier，FAIL 會擋住 merge」；ADR-0007 加上「Amended by ADR-0008」。

stage 8 會在 HEAD 的暫存 worktree 上跑 verifier（應該 PASS），再故意改壞第 34 行的連結（應該只出現一行 FAIL），最後移除暫存 worktree。開工前同樣會先請你核准 test plan 表格。

## Comments

### 2026-10-24 — Handed over from T-0007 (stage-6 Rulings C2, E2, E3)

Written on the T-0007 branch, so that these items land with it.

- **Already done in T-0007.** The provenance side of I1 (test plan items #50–#62) and of I3 (#63,
  #64) is implemented and tested. For I1, this ticket adds to each existing sub-case the notices
  line `[x](missing)` and its message, as traceability row I1 states; it does not rewrite the
  provenance handling. Rows R3 and R7 are reachable from provenance values and are tested there
  (#45, #46). Row R2's `%`, `?` and `>` are tested there too (#47–#49).
- **Rule 2's whitespace (E3, F-R3).** `_resolve` does not yet reject whitespace. Through (b), R2's
  `<docs/my file.md>` must give `is not a plain repository path`; add it when R2 is implemented.
- **A `RecursionError` from Q (E3, F-R2).** traceability "Document order" says that a
  `RecursionError` raised by Q while rendering a value counts as `not valid JSON`, and that the
  provenance file then gives that one message. T-0007 does not catch it. Determine whether it is
  reachable once `json.loads` has accepted the value. If it is, add a sub-case and the handling,
  and drop messages already collected; if not, record why.
- **`_resolve`'s `os.lstat` error branch (F-R10).** It shares one `try` with `os.listdir` and has no
  sub-case of its own. R7's notices sub-cases should include a directory that is readable but not
  searchable.
