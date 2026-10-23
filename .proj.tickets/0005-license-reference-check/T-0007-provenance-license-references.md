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

### 2026-10-23 — Owner decisions from the epic 0004 retrospective

Asked before stage 5, as the spec's Further Notes require. Answers, as chosen by the repository
owner:

- **D1** (does a standing "do it to completion" count as test plan approval?): "不算". The agent
  stops after writing the test plan table and waits for the owner's approval. Recording this in
  `docs/agents/workflow.md` is template work outside this ticket's X1; it goes to the D3 epic.
- **D2** (a small epic for the 11 stage-6 spec wording points?): "記進 OQ，先不開". The OQ entry is
  written at the epic 0005 close-out, outside this ticket's X1.
- **D3** (a template-work epic for documentation-only tickets?): "開，排在 0005 之後".

### 2026-10-23 — Test plan table (item 2), awaiting the repository owner's approval

Scope: rows P1–P9, D1–D3, D5 and D6 (44 sub-cases). D4, I1, I2 and W1 are in T-0008.

Fixture defaults (traceability, Matrix): regular files `LICENSE` and `LICENSE-CODE`; the notices are
the two default lines. This ticket does not read the notices. Each sub-case writes the provenance
file shown and calls `check_license_references(root)` on `os.path.realpath` of a temporary
directory. The result is compared with the whole expected list.

Notation in the table:

- `V @ P: reason` stands for the message
  `docs/agents/skill-sources.json: license reference V at P reason`.
- `V` and `P` are already rendered by Q.
- `[]` means no message.
- A one-key object `{"license_location": X}` is written `loc X`, at pointer `"/license_location"`.

Red: the first test errors because `check_license_references` does not exist; that counts. Every
other sub-case records its own red. When a sub-case passes on its first run, the mutation in the
last column is applied to the implementation, and the failure is recorded before the implementation
is restored (Ruling R7). The planned order is the table order. The provenance walk and resolution
come first, so P7a drives the function into existence.

| # | Row | Sub-case | Expected | Mutation if the first run passes |
|---|---|---|---|---|
| 1 | P7 | loc `"missing.md"` | `"missing.md" @ "/license_location": does not exist` | resolution accepts any name |
| 2 | P1 | loc `"LICENSE"` | `[]` | resolution reports `does not exist` for an existing regular file |
| 3 | P1 | `{"a":{"b":{"c":{"license_location":"LICENSE-CODE"}}}}` | `[]` | same, for values below the top level |
| 4 | P1 | `{"x":[{"license_location":"LICENSE"}]}` | `[]` | same, for values inside an array |
| 5 | P8 | `{"x":[{"license_location":"missing"}]}` | `"missing" @ "/x/0/license_location": does not exist` | array indices count from 1 |
| 6 | P9 | `{"b":{"license_location":"missing-b"},"a":[{"license_location":"missing-1"},{"license_location":"missing-0"}]}` | `"missing-b" @ "/b/license_location": does not exist`, `"missing-1" @ "/a/0/license_location": does not exist`, `"missing-0" @ "/a/1/license_location": does not exist` | walk keys in sorted order |
| 7 | P4 | loc `""` | `"" @ "/license_location": is empty` | drop step 2 |
| 8 | P3 | loc `5` | `5 @ "/license_location": is not a string` | drop step 1 |
| 9 | P3 | loc `null` | `null @ …: is not a string` | drop step 1 |
| 10 | P3 | loc `true` | `true @ …: is not a string` | drop step 1 |
| 11 | P3 | loc `["x"]` | `["x"] @ …: is not a string` | drop step 1 |
| 12 | P3 | loc `{"license_location":"missing"}` | `{"license_location": "missing"} @ "/license_location": is not a string`, `"missing" @ "/license_location/license_location": does not exist` | walk does not enter a `license_location` value |
| 13 | P2 | loc `".agents/skills/<skill>/LICENSE"` | `[]` | drop step 3 |
| 14 | P2 | loc `"Upstream repository root LICENSE; the skill directories ship no LICENSE file."` | `[]` | drop step 4 |
| 15 | P2 | loc `" <x>"` | `[]` | step 5 before step 3 |
| 16 | P2 | loc `" a b"` | `[]` | step 5 before step 4 |
| 17 | P5 | loc `"LICENSE-CODE "` | `"LICENSE-CODE " @ …: has leading or trailing whitespace` | drop step 5 |
| 18 | P5 | loc `" LICENSE-CODE"` | `" LICENSE-CODE" @ …: has leading or trailing whitespace` | drop step 5 |
| 19 | P5 | loc `"LICENSE-CODE\n"` | `"LICENSE-CODE\n" @ …: has leading or trailing whitespace` | drop step 5 |
| 20 | P5 | loc `"  "` | `"  " @ …: has leading or trailing whitespace` | drop step 5 |
| 21 | P5 | loc `"LICENSE-CODE"` + U+3000 | `"LICENSE-CODE\u3000" @ …: has leading or trailing whitespace` | drop step 5 |
| 22 | P6 | loc `"https://example.org/LICENSE"` | `… @ …: uses an unsupported URL scheme` | drop step 6 |
| 23 | P6 | loc `"C:LICENSE"` | `"C:LICENSE" @ …: is outside the repository` | treat one-letter schemes as unsupported |
| 24 | P7 | loc `"LICENSE#x"` | `"LICENSE#x" @ …: does not exist` | strip `#…` in provenance values |
| 25 | P7 | loc `"/LICENSE"` | `"/LICENSE" @ …: is outside the repository` | drop path rule 1 |
| 26 | P7 | loc `"./LICENSE"` | `"./LICENSE" @ …: is not a plain repository path` | drop the `.` segment check |
| 27 | P7 | loc `"LICENSE<old"` | `"LICENSE<old" @ …: is not a plain repository path` | drop `<` from rule 2 |
| 28 | P7 | loc `"license"` | `"license" @ …: differs in case from "LICENSE"` | compare names case-insensitively |
| 29 | P7 | loc `"link"`, `link` a symlink to `LICENSE` | `"link" @ …: passes through a symlink at "link"` | use `os.stat` instead of `os.lstat` |
| 30 | P7 | loc `"adir"`, `adir/` a directory | `"adir" @ …: is not a regular file` | drop the regular-file check |
| 31 | D1 | `{"license":"MIT","license_location":"LICENSE"}` | `"LICENSE" @ …: is CC-BY-SA-4.0, not "MIT"` | drop (d) |
| 32 | D1 | `{"license":"CC-BY-SA-4.0","license_location":"LICENSE-CODE"}` | `"LICENSE-CODE" @ …: is MIT, not "CC-BY-SA-4.0"` | drop (d) |
| 33 | D1 | `{"license":null,"license_location":"LICENSE-CODE"}` | `"LICENSE-CODE" @ …: is MIT, not null` | treat a non-string `license` as matching |
| 34 | D1 | `{"license":"mit","license_location":"LICENSE-CODE"}` | `"LICENSE-CODE" @ …: is MIT, not "mit"` | compare `license` case-insensitively |
| 35 | D1 | `{"license":"MIT ","license_location":"LICENSE-CODE"}` | `"LICENSE-CODE" @ …: is MIT, not "MIT "` | strip `license` before comparing |
| 36 | D2 | `{"license":"MIT","license_location":"LICENSE-CODE"}` | `[]` | report a mismatch when the values are equal |
| 37 | D2 | `{"license":"CC-BY-SA-4.0","license_location":"LICENSE"}` | `[]` | same |
| 38 | D3 | `{"license":"Apache-2.0","license_location":"skills/x/LICENSE"}`, that file existing | `[]` | apply (d) to every location, requiring `MIT` |
| 39 | D3 | `{"license_location":"LICENSE-CODE"}` | `[]` | treat a missing `license` key as a mismatch |
| 40 | D3 | `{"license":"CC-BY-SA-4.0","license_location":" LICENSE-CODE"}` | `" LICENSE-CODE" @ …: has leading or trailing whitespace` | strip the location before (d) |
| 41 | D3 | `{"license":"CC-BY-SA-4.0","license_location":"license-code"}` | `"license-code" @ …: differs in case from "LICENSE-CODE"` | casefold the location before (d) |
| 42 | D5 | `{"license_location":"LICENSE-CODE","x":{"license_location":"missing"},"license":"CC-BY-SA-4.0"}` | `"LICENSE-CODE" @ "/license_location": is MIT, not "CC-BY-SA-4.0"`, `"missing" @ "/x/license_location": does not exist` | emit (d) at the end of the object |
| 43 | D6 | `{"skills":{"x":{"licensing":{"license":"CC-BY-SA-4.0","license_location":"LICENSE-CODE"}}}}` | `"LICENSE-CODE" @ "/skills/x/licensing/license_location": is MIT, not "CC-BY-SA-4.0"` | apply (d) to the top-level object only |
| 44 | D6 | `{"list":[{"license":"CC-BY-SA-4.0","license_location":"LICENSE-CODE"}]}` | `"LICENSE-CODE" @ "/list/0/license_location": is MIT, not "CC-BY-SA-4.0"` | skip objects inside arrays for (d) |

Not tests in this ticket (judged in Comments): T1, T2, T3, T6, W3, W4 and X1–X3. A CLI run on the
worktree records the PASS line, together with a run on a temporary copy whose provenance holds one
bad value; the copy is outside the repository and is deleted after the run.
