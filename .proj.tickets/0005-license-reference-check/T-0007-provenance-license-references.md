---
id: T-0007
title: The verifier reports bad license references in the provenance file
epic: 0005-license-reference-check
status: review
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

### 2026-10-23 — Test plan approved (hard rule 2)

The repository owner: "T-0007 的 test plan 表格核准，開始 /tdd。" Red records below follow the
table's numbering. Each holds the failing output, the HEAD commit, and the `git hash-object -w`
blobs of the test file and of `scripts/verify-project.py` at that run, so the code as it ran can be
read back even between commits.

### 2026-10-24 — Red records, natural (item 3)

Fifteen sub-cases failed on their own first run. The order follows the table with two approved-plan
deviations, each noted in its record: #5 and #6 ran before #3 and #4, so the walk the latter guard
existed; #17 ran before #15 and #16, so step 5 existed for their mutations.

#### #1 P7 missing.md — red

- HEAD: `0ea0fc13d7000a8a4a1e1f7a873e33c9a9962ac7`
- test file blob: `ce66d0aa30ca8b67e94b75c90885195dc2df0e9c`; verifier blob: `452fb86fa4e0371d0b57b77ef09866c4c91793c3`
- command: `python3 -m unittest discover -s scripts -p test_verify_project.py -k test_p7_missing_file` (exit 1)

```
ERROR: test_p7_missing_file (test_verify_project.ProvenanceReferenceTest.test_p7_missing_file)
AttributeError: module 'verify_project' has no attribute 'check_license_references'
Ran 1 test in 0.003s
FAILED (errors=1)
```

#### #5 P8 pointer through an array (run before #3 and #4, which need the walk to exist) — red

- HEAD: `0ea0fc13d7000a8a4a1e1f7a873e33c9a9962ac7`
- test file blob: `2bf9b486d3d0984bc33d418bbf3a7e514731155a`; verifier blob: `a743cadcf1c90b416921b271dc10d2c073383ecb`
- command: `python3 -m unittest discover -s scripts -p test_verify_project.py -k test_p8_pointer_through_array` (exit 1)

```
FAIL: test_p8_pointer_through_array (test_verify_project.ProvenanceReferenceTest.test_p8_pointer_through_array)
AssertionError: Lists differ: [] != ['docs/agents/skill-sources.json: license [58 chars]ist']
- []
+ ['docs/agents/skill-sources.json: license reference "missing" at '
+  '"/x/0/license_location" does not exist']
Ran 1 test in 0.002s
FAILED (failures=1)
```

#### #7 P4 empty string — red

- HEAD: `0ea0fc13d7000a8a4a1e1f7a873e33c9a9962ac7`
- test file blob: `b00051baa041e09c6b2e732ac848e9f3ba290836`; verifier blob: `1d3a63ae4e3ee757f7cb1105965c3b7b0952bd3d`
- command: `python3 -m unittest discover -s scripts -p test_verify_project.py -k test_p4_empty` (exit 1)

```
FAIL: test_p4_empty (test_verify_project.ProvenanceReferenceTest.test_p4_empty)
AssertionError: Lists differ: ['doc[26 chars]n: license reference "" at "/license_location" does not exist'] != ['doc[26 chars]n: license reference "" at "/license_location" is empty']
First differing element 0:
-  'does not exist']
+  'is empty']
Ran 1 test in 0.003s
FAILED (failures=1)
```

#### #8 P3 number — red

- HEAD: `0ea0fc13d7000a8a4a1e1f7a873e33c9a9962ac7`
- test file blob: `44e595a26e80905e467da729300a98deb72bac3e`; verifier blob: `6ebdf82be55c878ea7be2a31eebbc407372f2fff`
- command: `python3 -m unittest discover -s scripts -p test_verify_project.py -k test_p3_number` (exit 1)

```
ERROR: test_p3_number (test_verify_project.ProvenanceReferenceTest.test_p3_number)
AttributeError: 'int' object has no attribute 'split'
Ran 1 test in 0.003s
FAILED (errors=1)
```

#### #13 P2 placeholder — red

- HEAD: `0ea0fc13d7000a8a4a1e1f7a873e33c9a9962ac7`
- test file blob: `7e143ddcf610b5d6cb44f7ab27b4d1ff1ef6d0f0`; verifier blob: `47df0c15c6678205fedf63032e7ddace91fc2ee2`
- command: `python3 -m unittest discover -s scripts -p test_verify_project.py -k test_p2_placeholder` (exit 1)

```
FAIL: test_p2_placeholder (test_verify_project.ProvenanceReferenceTest.test_p2_placeholder)
AssertionError: Lists differ: ['docs/agents/skill-sources.json: license [77 chars]ist'] != []
+ []
- ['docs/agents/skill-sources.json: license reference '
-  '".agents/skills/<skill>/LICENSE" at "/license_location" does not exist']
Ran 1 test in 0.002s
FAILED (failures=1)
```

#### #14 P2 sentence — red

- HEAD: `0ea0fc13d7000a8a4a1e1f7a873e33c9a9962ac7`
- test file blob: `b1d1a5f617669eb79c82dae3326beba87cfb50a9`; verifier blob: `2e5ccb918ae411101d3054d22dc0f91e3ea976fd`
- command: `python3 -m unittest discover -s scripts -p test_verify_project.py -k test_p2_sentence` (exit 1)

```
FAIL: test_p2_sentence (test_verify_project.ProvenanceReferenceTest.test_p2_sentence)
AssertionError: Lists differ: ['docs/agents/skill-sources.json: license [124 chars]ist'] != []
+ []
- ['docs/agents/skill-sources.json: license reference "Upstream repository root '
-  'LICENSE; the skill directories ship no LICENSE file." at "/license_location" '
-  'does not exist']
Ran 1 test in 0.002s
FAILED (failures=1)
```

#### #17 P5 trailing space (run before #15 and #16, which need step 5 to exist) — red

- HEAD: `0ea0fc13d7000a8a4a1e1f7a873e33c9a9962ac7`
- test file blob: `87b89c92a7fea1a13308da7a358432db163eae38`; verifier blob: `b251780e38ad1ab61685334846f01e9566cfa47e`
- command: `python3 -m unittest discover -s scripts -p test_verify_project.py -k test_p5_trailing_space` (exit 1)

```
FAIL: test_p5_trailing_space (test_verify_project.ProvenanceReferenceTest.test_p5_trailing_space)
AssertionError: Lists differ: ['doc[59 chars]E " at "/license_location" does not exist'] != ['doc[59 chars]E " at "/license_location" has leading or trailing whitespace']
First differing element 0:
-  '"/license_location" does not exist']
+  '"/license_location" has leading or trailing whitespace']
Ran 1 test in 0.002s
FAILED (failures=1)
```

#### #22 P6 URL scheme — red

- HEAD: `e34c5cff0f14f9f79a12d71d183ab0bc95b8cc5c`
- test file blob: `3c52c42310e3c9278b7399c0b6f945bff34fc753`; verifier blob: `edea4f7f28d33a599c117155b8f85751b8dca954`
- command: `python3 -m unittest discover -s scripts -p test_verify_project.py -k test_p6_url_scheme` (exit 1)

```
FAIL: test_p6_url_scheme (test_verify_project.ProvenanceReferenceTest.test_p6_url_scheme)
AssertionError: Lists differ: ['doc[69 chars]ICENSE" at "/license_location" does not exist'] != ['doc[69 chars]ICENSE" at "/license_location" uses an unsupported URL scheme']
First differing element 0:
-  '"https://example.org/LICENSE" at "/license_location" does not exist']
?                                                        ^^      - ^^^^ -
+  '"https://example.org/LICENSE" at "/license_location" uses an unsupported URL '
?                                                        ^^   + +++++++ +  ^^^^^^
+  'scheme']
Ran 1 test in 0.003s
FAILED (failures=1)
```

#### #25 P7 absolute path — red

- HEAD: `e34c5cff0f14f9f79a12d71d183ab0bc95b8cc5c`
- test file blob: `4dfaf3d9def759a6ac45e3576ff20c50c5c4ed40`; verifier blob: `a9213e94ffce036e83af1ed7e596b446c52d5be7`
- command: `python3 -m unittest discover -s scripts -p test_verify_project.py -k test_p7_absolute` (exit 1)

```
FAIL: test_p7_absolute (test_verify_project.ProvenanceReferenceTest.test_p7_absolute)
AssertionError: Lists differ: ['doc[45 chars]e "/LICENSE" at "/license_location" does not exist'] != ['doc[45 chars]e "/LICENSE" at "/license_location" is outside the repository']
First differing element 0:
-  '"/license_location" does not exist']
+  '"/license_location" is outside the repository']
Ran 1 test in 0.004s
FAILED (failures=1)
```

#### #26 P7 dot segment — red

- HEAD: `e34c5cff0f14f9f79a12d71d183ab0bc95b8cc5c`
- test file blob: `a5368faf4547a9794c43e2f66f2e415f729daa20`; verifier blob: `786e6035694a433348f61a2d3b5044648c712f6c`
- command: `python3 -m unittest discover -s scripts -p test_verify_project.py -k test_p7_dot_segment` (exit 1)

```
FAIL: test_p7_dot_segment (test_verify_project.ProvenanceReferenceTest.test_p7_dot_segment)
AssertionError: Lists differ: ['doc[51 chars]ICENSE" at "/license_location" does not exist'] != ['doc[51 chars]ICENSE" at "/license_location" is not a plain repository path']
First differing element 0:
-  '"/license_location" does not exist']
+  '"/license_location" is not a plain repository path']
Ran 1 test in 0.003s
FAILED (failures=1)
```

#### #27 P7 unpaired angle bracket — red

- HEAD: `e34c5cff0f14f9f79a12d71d183ab0bc95b8cc5c`
- test file blob: `17ee262863af47490892245eca70486ed570d46d`; verifier blob: `862a253253c09aa9c8b57d1eb7d6d031c9ce4969`
- command: `python3 -m unittest discover -s scripts -p test_verify_project.py -k test_p7_unpaired` (exit 1)

```
FAIL: test_p7_unpaired_angle_bracket (test_verify_project.ProvenanceReferenceTest.test_p7_unpaired_angle_bracket)
AssertionError: Lists differ: ['doc[53 chars]SE<old" at "/license_location" does not exist'] != ['doc[53 chars]SE<old" at "/license_location" is not a plain repository path']
First differing element 0:
-  '"/license_location" does not exist']
+  '"/license_location" is not a plain repository path']
Ran 1 test in 0.003s
FAILED (failures=1)
```

#### #28 P7 case mismatch — red

- HEAD: `e34c5cff0f14f9f79a12d71d183ab0bc95b8cc5c`
- test file blob: `991ce67faca9f4e36d3edeca36c376b3180ada1b`; verifier blob: `ffed2087e360fc30864a47513f6c35a3c0ada211`
- command: `python3 -m unittest discover -s scripts -p test_verify_project.py -k test_p7_case` (exit 1)

```
FAIL: test_p7_case_mismatch (test_verify_project.ProvenanceReferenceTest.test_p7_case_mismatch)
AssertionError: Lists differ: ['doc[49 chars]icense" at "/license_location" does not exist'] != ['doc[49 chars]icense" at "/license_location" differs in case from "LICENSE"']
First differing element 0:
-  '"/license_location" does not exist']
+  '"/license_location" differs in case from "LICENSE"']
Ran 1 test in 0.003s
FAILED (failures=1)
```

#### #29 P7 symlink — red

- HEAD: `e34c5cff0f14f9f79a12d71d183ab0bc95b8cc5c`
- test file blob: `7609f5accc08392e6083b2279065e9d7cc5544a9`; verifier blob: `680fb3d9e2722c4b5ebdffea58f434ff375ff56f`
- command: `python3 -m unittest discover -s scripts -p test_verify_project.py -k test_p7_symlink` (exit 1)

```
FAIL: test_p7_symlink (test_verify_project.ProvenanceReferenceTest.test_p7_symlink)
AssertionError: Lists differ: [] != ['docs/agents/skill-sources.json: license [71 chars]nk"']
- []
+ ['docs/agents/skill-sources.json: license reference "link" at '
+  '"/license_location" passes through a symlink at "link"']
Ran 1 test in 0.005s
FAILED (failures=1)
```

#### #30 P7 directory — red

- HEAD: `e34c5cff0f14f9f79a12d71d183ab0bc95b8cc5c`
- test file blob: `a24cd29b6ee8c31bcb1c96614deca6aaf7d75f06`; verifier blob: `a6ba7f9f94494cef2bde281fbbf68c1c8739a0cb`
- command: `python3 -m unittest discover -s scripts -p test_verify_project.py -k test_p7_directory` (exit 1)

```
FAIL: test_p7_directory (test_verify_project.ProvenanceReferenceTest.test_p7_directory)
AssertionError: Lists differ: [] != ['docs/agents/skill-sources.json: license [58 chars]ile']
- []
+ ['docs/agents/skill-sources.json: license reference "adir" at '
+  '"/license_location" is not a regular file']
Ran 1 test in 0.003s
FAILED (failures=1)
```

#### #31 D1 LICENSE with MIT — red

- HEAD: `e34c5cff0f14f9f79a12d71d183ab0bc95b8cc5c`
- test file blob: `fe7cdb439783530f4f07778cbca9c8db1d50e78a`; verifier blob: `77796f261af9b8f79ee3b8c42180b1a4dc55db4e`
- command: `python3 -m unittest discover -s scripts -p test_verify_project.py -k test_d1_license_with_mit` (exit 1)

```
FAIL: test_d1_license_with_mit (test_verify_project.LicenseAgreementTest.test_d1_license_with_mit)
AssertionError: Lists differ: [] != ['docs/agents/skill-sources.json: license [66 chars]IT"']
- []
+ ['docs/agents/skill-sources.json: license reference "LICENSE" at '
+  '"/license_location" is CC-BY-SA-4.0, not "MIT"']
Ran 1 test in 0.003s
FAILED (failures=1)
```

### 2026-10-24 — Red records, by mutation (item 3)

Twenty-nine sub-cases passed on their first run and took their red by the mutation the approved
table names. Each mutation was applied to `scripts/verify-project.py`, the sub-case's test was run
and failed, and the file was restored byte for byte (the helper asserts it).

A tooling fault was found and corrected before these records. Python's bytecode cache keys on
source mtime in whole seconds and on size. Two mutations of equal length written within one second
(#40 `value.strip()` and #41 `value.upper()`) therefore ran #40's cached code for #41, which passed.
Reading the #41 verifier blob back (`8cdb416`) and running it directly gave the expected two
messages, confirming the cause. Every run since uses `python3 -I -B` after removing
`scripts/__pycache__`. All 29 mutation reds were then re-run at HEAD `18bd008`; each exited 1 and
the file was restored. Those re-runs are the records below; the earlier mutation runs are
superseded. The natural reds above came from code changes of different sizes and match the code
each recorded blob holds.

#### #2 P1 top-level valid (passed on first run; mutation: resolution reports does not exist for an existing regular file) — red

- HEAD: `18bd008a60d61b1d4b85bdb4f0fcdaed2354ad8d`
- test file blob: `2ea64fdcc837405823b90631a7fe5b2fedaa4df3`; verifier blob: `5d23686a6af6988ff953aaf0ad511fc1097801e0`
- command: `python3 -m unittest discover -s scripts -p test_verify_project.py -k test_p1_valid_top_level` (exit 1; `-B`, `scripts/__pycache__` removed first)

```
FAIL: test_p1_valid_top_level (test_verify_project.ProvenanceReferenceTest.test_p1_valid_top_level)
AssertionError: Lists differ: ['docs/agents/skill-sources.json: license [54 chars]ist'] != []
+ []
- ['docs/agents/skill-sources.json: license reference "LICENSE" at '
-  '"/license_location" does not exist']
Ran 1 test in 0.002s
FAILED (failures=1)
```

#### #3 P1 nested valid (passed on first run; mutation: report does not exist for values below the top level) — red

- HEAD: `18bd008a60d61b1d4b85bdb4f0fcdaed2354ad8d`
- test file blob: `2ea64fdcc837405823b90631a7fe5b2fedaa4df3`; verifier blob: `bb6b7d85d2cffe88819c4867e96cb9b58b9493d6`
- command: `python3 -m unittest discover -s scripts -p test_verify_project.py -k test_p1_valid_nested` (exit 1; `-B`, `scripts/__pycache__` removed first)

```
FAIL: test_p1_valid_nested (test_verify_project.ProvenanceReferenceTest.test_p1_valid_nested)
AssertionError: Lists differ: ['docs/agents/skill-sources.json: license [65 chars]ist'] != []
+ []
- ['docs/agents/skill-sources.json: license reference "LICENSE-CODE" at '
-  '"/a/b/c/license_location" does not exist']
Ran 1 test in 0.002s
FAILED (failures=1)
```

#### #4 P1 valid in an array (passed on first run; mutation: report does not exist for values inside an array) — red

- HEAD: `18bd008a60d61b1d4b85bdb4f0fcdaed2354ad8d`
- test file blob: `2ea64fdcc837405823b90631a7fe5b2fedaa4df3`; verifier blob: `0776ca72628b7892235682ea91bb23b38679d907`
- command: `python3 -m unittest discover -s scripts -p test_verify_project.py -k test_p1_valid_in_array` (exit 1; `-B`, `scripts/__pycache__` removed first)

```
FAIL: test_p1_valid_in_array (test_verify_project.ProvenanceReferenceTest.test_p1_valid_in_array)
AssertionError: Lists differ: ['docs/agents/skill-sources.json: license [58 chars]ist'] != []
+ []
- ['docs/agents/skill-sources.json: license reference "LICENSE" at '
-  '"/x/0/license_location" does not exist']
Ran 1 test in 0.002s
FAILED (failures=1)
```

#### #6 P9 document order (passed on first run; mutation: walk keys in sorted order) — red

- HEAD: `18bd008a60d61b1d4b85bdb4f0fcdaed2354ad8d`
- test file blob: `2ea64fdcc837405823b90631a7fe5b2fedaa4df3`; verifier blob: `ea38bc60cc93e3d169b6c4398d29ab856eba09aa`
- command: `python3 -m unittest discover -s scripts -p test_verify_project.py -k test_p9_document_order` (exit 1; `-B`, `scripts/__pycache__` removed first)

```
FAIL: test_p9_document_order (test_verify_project.ProvenanceReferenceTest.test_p9_document_order)
AssertionError: Lists differ: ['doc[51 chars]sing-1" at "/a/0/license_location" does not ex[212 chars]ist'] != ['doc[51 chars]sing-b" at "/b/license_location" does not exis[212 chars]ist']
First differing element 0:
Ran 1 test in 0.003s
FAILED (failures=1)
```

#### #9 P3 null (passed on first run; mutation: drop step 1) — red

- HEAD: `18bd008a60d61b1d4b85bdb4f0fcdaed2354ad8d`
- test file blob: `2ea64fdcc837405823b90631a7fe5b2fedaa4df3`; verifier blob: `d1cc35708053d8458425a7d988798aed031a298e`
- command: `python3 -m unittest discover -s scripts -p test_verify_project.py -k test_p3_null` (exit 1; `-B`, `scripts/__pycache__` removed first)

```
ERROR: test_p3_null (test_verify_project.ProvenanceReferenceTest.test_p3_null)
TypeError: expected string or bytes-like object, got 'NoneType'
Ran 1 test in 0.002s
FAILED (errors=1)
```

#### #10 P3 true (passed on first run; mutation: drop step 1) — red

- HEAD: `18bd008a60d61b1d4b85bdb4f0fcdaed2354ad8d`
- test file blob: `2ea64fdcc837405823b90631a7fe5b2fedaa4df3`; verifier blob: `d1cc35708053d8458425a7d988798aed031a298e`
- command: `python3 -m unittest discover -s scripts -p test_verify_project.py -k test_p3_true` (exit 1; `-B`, `scripts/__pycache__` removed first)

```
ERROR: test_p3_true (test_verify_project.ProvenanceReferenceTest.test_p3_true)
TypeError: expected string or bytes-like object, got 'bool'
Ran 1 test in 0.003s
FAILED (errors=1)
```

#### #11 P3 array (passed on first run; mutation: drop step 1) — red

- HEAD: `18bd008a60d61b1d4b85bdb4f0fcdaed2354ad8d`
- test file blob: `2ea64fdcc837405823b90631a7fe5b2fedaa4df3`; verifier blob: `d1cc35708053d8458425a7d988798aed031a298e`
- command: `python3 -m unittest discover -s scripts -p test_verify_project.py -k test_p3_array` (exit 1; `-B`, `scripts/__pycache__` removed first)

```
ERROR: test_p3_array (test_verify_project.ProvenanceReferenceTest.test_p3_array)
TypeError: expected string or bytes-like object, got 'list'
Ran 1 test in 0.002s
FAILED (errors=1)
```

#### #12 P3 object holding a nested location (passed on first run; mutation: walk does not enter a license_location value) — red

- HEAD: `18bd008a60d61b1d4b85bdb4f0fcdaed2354ad8d`
- test file blob: `2ea64fdcc837405823b90631a7fe5b2fedaa4df3`; verifier blob: `f86acd4fc1f594fb4b29c97905378472630fb934`
- command: `python3 -m unittest discover -s scripts -p test_verify_project.py -k test_p3_object` (exit 1; `-B`, `scripts/__pycache__` removed first)

```
FAIL: test_p3_object_with_nested_location (test_verify_project.ProvenanceReferenceTest.test_p3_object_with_nested_location)
AssertionError: Lists differ: ['doc[113 chars]ring'] != ['doc[113 chars]ring', 'docs/agents/skill-sources.json: licens[73 chars]ist']
-  '"missing"} at "/license_location" is not a string']
?                                                     ^
+  '"missing"} at "/license_location" is not a string',
?                                                     ^
+  'docs/agents/skill-sources.json: license reference "missing" at '
+  '"/license_location/license_location" does not exist']
Ran 1 test in 0.003s
FAILED (failures=1)
```

#### #15 P2 leading space with a placeholder (passed on first run; mutation: step 5 before step 3) — red

- HEAD: `18bd008a60d61b1d4b85bdb4f0fcdaed2354ad8d`
- test file blob: `2ea64fdcc837405823b90631a7fe5b2fedaa4df3`; verifier blob: `2a684173122a380f57aec27cc91875be88eaaeaf`
- command: `python3 -m unittest discover -s scripts -p test_verify_project.py -k test_p2_leading_space_with_placeholder` (exit 1; `-B`, `scripts/__pycache__` removed first)

```
FAIL: test_p2_leading_space_with_placeholder (test_verify_project.ProvenanceReferenceTest.test_p2_leading_space_with_placeholder)
AssertionError: Lists differ: ['docs/agents/skill-sources.json: license [71 chars]ace'] != []
+ []
- ['docs/agents/skill-sources.json: license reference " <x>" at '
-  '"/license_location" has leading or trailing whitespace']
Ran 1 test in 0.002s
FAILED (failures=1)
```

#### #16 P2 leading space with inner space (passed on first run; mutation: step 5 before step 4) — red

- HEAD: `18bd008a60d61b1d4b85bdb4f0fcdaed2354ad8d`
- test file blob: `2ea64fdcc837405823b90631a7fe5b2fedaa4df3`; verifier blob: `2a684173122a380f57aec27cc91875be88eaaeaf`
- command: `python3 -m unittest discover -s scripts -p test_verify_project.py -k test_p2_leading_space_with_inner_space` (exit 1; `-B`, `scripts/__pycache__` removed first)

```
FAIL: test_p2_leading_space_with_inner_space (test_verify_project.ProvenanceReferenceTest.test_p2_leading_space_with_inner_space)
AssertionError: Lists differ: ['docs/agents/skill-sources.json: license [71 chars]ace'] != []
+ []
- ['docs/agents/skill-sources.json: license reference " a b" at '
-  '"/license_location" has leading or trailing whitespace']
Ran 1 test in 0.002s
FAILED (failures=1)
```

#### #18 P5 leading space (passed on first run; mutation: drop step 5) — red

- HEAD: `18bd008a60d61b1d4b85bdb4f0fcdaed2354ad8d`
- test file blob: `2ea64fdcc837405823b90631a7fe5b2fedaa4df3`; verifier blob: `031545f88d283e6052aa07f3976f40f346764542`
- command: `python3 -m unittest discover -s scripts -p test_verify_project.py -k test_p5_leading_space` (exit 1; `-B`, `scripts/__pycache__` removed first)

```
FAIL: test_p5_leading_space (test_verify_project.ProvenanceReferenceTest.test_p5_leading_space)
AssertionError: Lists differ: ['doc[59 chars]DE" at "/license_location" does not exist'] != ['doc[59 chars]DE" at "/license_location" has leading or trailing whitespace']
First differing element 0:
-  '"/license_location" does not exist']
+  '"/license_location" has leading or trailing whitespace']
Ran 1 test in 0.002s
FAILED (failures=1)
```

#### #19 P5 trailing newline (passed on first run; mutation: drop step 5) — red

- HEAD: `18bd008a60d61b1d4b85bdb4f0fcdaed2354ad8d`
- test file blob: `2ea64fdcc837405823b90631a7fe5b2fedaa4df3`; verifier blob: `031545f88d283e6052aa07f3976f40f346764542`
- command: `python3 -m unittest discover -s scripts -p test_verify_project.py -k test_p5_trailing_newline` (exit 1; `-B`, `scripts/__pycache__` removed first)

```
FAIL: test_p5_trailing_newline (test_verify_project.ProvenanceReferenceTest.test_p5_trailing_newline)
AssertionError: Lists differ: ['doc[61 chars]\n" at "/license_location" does not exist'] != ['doc[61 chars]\n" at "/license_location" has leading or trailing whitespace']
First differing element 0:
-  '"/license_location" does not exist']
+  '"/license_location" has leading or trailing whitespace']
Ran 1 test in 0.002s
FAILED (failures=1)
```

#### #20 P5 whitespace only (passed on first run; mutation: drop step 5) — red

- HEAD: `18bd008a60d61b1d4b85bdb4f0fcdaed2354ad8d`
- test file blob: `2ea64fdcc837405823b90631a7fe5b2fedaa4df3`; verifier blob: `031545f88d283e6052aa07f3976f40f346764542`
- command: `python3 -m unittest discover -s scripts -p test_verify_project.py -k test_p5_whitespace_only` (exit 1; `-B`, `scripts/__pycache__` removed first)

```
FAIL: test_p5_whitespace_only (test_verify_project.ProvenanceReferenceTest.test_p5_whitespace_only)
AssertionError: Lists differ: ['doc[48 chars]  " at "/license_location" does not exist'] != ['doc[48 chars]  " at "/license_location" has leading or trailing whitespace']
First differing element 0:
-  '"/license_location" does not exist']
+  '"/license_location" has leading or trailing whitespace']
Ran 1 test in 0.002s
FAILED (failures=1)
```

#### #21 P5 trailing U+3000 (passed on first run; mutation: drop step 5) — red

- HEAD: `18bd008a60d61b1d4b85bdb4f0fcdaed2354ad8d`
- test file blob: `2ea64fdcc837405823b90631a7fe5b2fedaa4df3`; verifier blob: `031545f88d283e6052aa07f3976f40f346764542`
- command: `python3 -m unittest discover -s scripts -p test_verify_project.py -k test_p5_trailing_ideographic` (exit 1; `-B`, `scripts/__pycache__` removed first)

```
FAIL: test_p5_trailing_ideographic_space (test_verify_project.ProvenanceReferenceTest.test_p5_trailing_ideographic_space)
AssertionError: Lists differ: ['doc[65 chars]00" at "/license_location" does not exist'] != ['doc[65 chars]00" at "/license_location" has leading or trailing whitespace']
First differing element 0:
-  '"/license_location" does not exist']
+  '"/license_location" has leading or trailing whitespace']
Ran 1 test in 0.003s
FAILED (failures=1)
```

#### #23 P6 drive (passed on first run; mutation: treat one-letter schemes as unsupported) — red

- HEAD: `18bd008a60d61b1d4b85bdb4f0fcdaed2354ad8d`
- test file blob: `2ea64fdcc837405823b90631a7fe5b2fedaa4df3`; verifier blob: `1000717b9fd1b19959437e3e2f05c477c71058dc`
- command: `python3 -m unittest discover -s scripts -p test_verify_project.py -k test_p6_drive` (exit 1; `-B`, `scripts/__pycache__` removed first)

```
FAIL: test_p6_drive (test_verify_project.ProvenanceReferenceTest.test_p6_drive)
AssertionError: Lists differ: ['doc[51 chars]ICENSE" at "/license_location" uses an unsupported URL scheme'] != ['doc[51 chars]ICENSE" at "/license_location" is outside the repository']
First differing element 0:
-  '"/license_location" uses an unsupported URL scheme']
+  '"/license_location" is outside the repository']
Ran 1 test in 0.002s
FAILED (failures=1)
```

#### #24 P7 fragment is not stripped (passed on first run; mutation: strip #... in provenance values) — red

- HEAD: `18bd008a60d61b1d4b85bdb4f0fcdaed2354ad8d`
- test file blob: `2ea64fdcc837405823b90631a7fe5b2fedaa4df3`; verifier blob: `73e9305c7b0a9400b66d95bb73ea02ae242226f7`
- command: `python3 -m unittest discover -s scripts -p test_verify_project.py -k test_p7_fragment` (exit 1; `-B`, `scripts/__pycache__` removed first)

```
FAIL: test_p7_fragment_is_not_stripped (test_verify_project.ProvenanceReferenceTest.test_p7_fragment_is_not_stripped)
AssertionError: Lists differ: [] != ['docs/agents/skill-sources.json: license [56 chars]ist']
- []
+ ['docs/agents/skill-sources.json: license reference "LICENSE#x" at '
+  '"/license_location" does not exist']
Ran 1 test in 0.002s
FAILED (failures=1)
```

#### #32 D1 LICENSE-CODE with CC-BY-SA-4.0 (passed on first run; mutation: drop (d)) — red

- HEAD: `18bd008a60d61b1d4b85bdb4f0fcdaed2354ad8d`
- test file blob: `2ea64fdcc837405823b90631a7fe5b2fedaa4df3`; verifier blob: `3908631f12c728f6838a28bb6617c75ecdbd2bd3`
- command: `python3 -m unittest discover -s scripts -p test_verify_project.py -k test_d1_license_code_with_cc` (exit 1; `-B`, `scripts/__pycache__` removed first)

```
FAIL: test_d1_license_code_with_cc (test_verify_project.LicenseAgreementTest.test_d1_license_code_with_cc)
AssertionError: Lists differ: [] != ['docs/agents/skill-sources.json: license [71 chars].0"']
- []
+ ['docs/agents/skill-sources.json: license reference "LICENSE-CODE" at '
+  '"/license_location" is MIT, not "CC-BY-SA-4.0"']
Ran 1 test in 0.002s
FAILED (failures=1)
```

#### #33 D1 LICENSE-CODE with null (passed on first run; mutation: a non-string license matches) — red

- HEAD: `18bd008a60d61b1d4b85bdb4f0fcdaed2354ad8d`
- test file blob: `2ea64fdcc837405823b90631a7fe5b2fedaa4df3`; verifier blob: `d9c15c9cb31cc71f67c6b37757c0eb90576ce0fc`
- command: `python3 -m unittest discover -s scripts -p test_verify_project.py -k test_d1_license_code_with_null` (exit 1; `-B`, `scripts/__pycache__` removed first)

```
FAIL: test_d1_license_code_with_null (test_verify_project.LicenseAgreementTest.test_d1_license_code_with_null)
AssertionError: Lists differ: [] != ['docs/agents/skill-sources.json: license [61 chars]ull']
- []
+ ['docs/agents/skill-sources.json: license reference "LICENSE-CODE" at '
+  '"/license_location" is MIT, not null']
Ran 1 test in 0.002s
FAILED (failures=1)
```

#### #34 D1 LICENSE-CODE with mit (passed on first run; mutation: compare license case-insensitively) — red

- HEAD: `18bd008a60d61b1d4b85bdb4f0fcdaed2354ad8d`
- test file blob: `2ea64fdcc837405823b90631a7fe5b2fedaa4df3`; verifier blob: `8c16220fc2407a8af3bb0575fc135f59d2b5cf32`
- command: `python3 -m unittest discover -s scripts -p test_verify_project.py -k test_d1_license_code_with_lowercase` (exit 1; `-B`, `scripts/__pycache__` removed first)

```
FAIL: test_d1_license_code_with_lowercase (test_verify_project.LicenseAgreementTest.test_d1_license_code_with_lowercase)
AssertionError: Lists differ: [] != ['docs/agents/skill-sources.json: license [62 chars]it"']
- []
+ ['docs/agents/skill-sources.json: license reference "LICENSE-CODE" at '
+  '"/license_location" is MIT, not "mit"']
Ran 1 test in 0.002s
FAILED (failures=1)
```

#### #35 D1 LICENSE-CODE with MIT and a space (passed on first run; mutation: strip license before comparing) — red

- HEAD: `18bd008a60d61b1d4b85bdb4f0fcdaed2354ad8d`
- test file blob: `2ea64fdcc837405823b90631a7fe5b2fedaa4df3`; verifier blob: `41e85cef05e7ba23f83e5ecf3372f21ea65c72e0`
- command: `python3 -m unittest discover -s scripts -p test_verify_project.py -k test_d1_license_code_with_trailing` (exit 1; `-B`, `scripts/__pycache__` removed first)

```
FAIL: test_d1_license_code_with_trailing_space (test_verify_project.LicenseAgreementTest.test_d1_license_code_with_trailing_space)
AssertionError: Lists differ: [] != ['docs/agents/skill-sources.json: license [63 chars]T "']
- []
+ ['docs/agents/skill-sources.json: license reference "LICENSE-CODE" at '
+  '"/license_location" is MIT, not "MIT "']
Ran 1 test in 0.002s
FAILED (failures=1)
```

#### #36 D2 LICENSE-CODE with MIT (passed on first run; mutation: report a mismatch when equal) — red

- HEAD: `18bd008a60d61b1d4b85bdb4f0fcdaed2354ad8d`
- test file blob: `2ea64fdcc837405823b90631a7fe5b2fedaa4df3`; verifier blob: `2955676843cb5bc2f93569df0cd57c73d336e12d`
- command: `python3 -m unittest discover -s scripts -p test_verify_project.py -k test_d2_license_code_with_mit` (exit 1; `-B`, `scripts/__pycache__` removed first)

```
FAIL: test_d2_license_code_with_mit (test_verify_project.LicenseAgreementTest.test_d2_license_code_with_mit)
AssertionError: Lists differ: ['docs/agents/skill-sources.json: license [62 chars]IT"'] != []
+ []
- ['docs/agents/skill-sources.json: license reference "LICENSE-CODE" at '
-  '"/license_location" is MIT, not "MIT"']
Ran 1 test in 0.002s
FAILED (failures=1)
```

#### #37 D2 LICENSE with CC-BY-SA-4.0 (passed on first run; mutation: report a mismatch when equal) — red

- HEAD: `18bd008a60d61b1d4b85bdb4f0fcdaed2354ad8d`
- test file blob: `2ea64fdcc837405823b90631a7fe5b2fedaa4df3`; verifier blob: `2955676843cb5bc2f93569df0cd57c73d336e12d`
- command: `python3 -m unittest discover -s scripts -p test_verify_project.py -k test_d2_license_with_cc` (exit 1; `-B`, `scripts/__pycache__` removed first)

```
FAIL: test_d2_license_with_cc (test_verify_project.LicenseAgreementTest.test_d2_license_with_cc)
AssertionError: Lists differ: ['docs/agents/skill-sources.json: license [75 chars].0"'] != []
+ []
- ['docs/agents/skill-sources.json: license reference "LICENSE" at '
-  '"/license_location" is CC-BY-SA-4.0, not "CC-BY-SA-4.0"']
Ran 1 test in 0.002s
FAILED (failures=1)
```

#### #38 D3 skill LICENSE path with Apache-2.0 (passed on first run; mutation: apply (d) to every location, requiring MIT) — red

- HEAD: `18bd008a60d61b1d4b85bdb4f0fcdaed2354ad8d`
- test file blob: `2ea64fdcc837405823b90631a7fe5b2fedaa4df3`; verifier blob: `5dbf3261dedb1c67525aa9e77a54c825186d2048`
- command: `python3 -m unittest discover -s scripts -p test_verify_project.py -k test_d3_skill` (exit 1; `-B`, `scripts/__pycache__` removed first)

```
FAIL: test_d3_skill_license_path (test_verify_project.LicenseAgreementTest.test_d3_skill_license_path)
AssertionError: Lists differ: ['docs/agents/skill-sources.json: license [73 chars].0"'] != []
+ []
- ['docs/agents/skill-sources.json: license reference "skills/x/LICENSE" at '
-  '"/license_location" is MIT, not "Apache-2.0"']
Ran 1 test in 0.003s
FAILED (failures=1)
```

#### #39 D3 no license key (passed on first run; mutation: a missing license key is a mismatch) — red

- HEAD: `18bd008a60d61b1d4b85bdb4f0fcdaed2354ad8d`
- test file blob: `2ea64fdcc837405823b90631a7fe5b2fedaa4df3`; verifier blob: `a22401ce781030577d8954338ddd60fa743c2a3c`
- command: `python3 -m unittest discover -s scripts -p test_verify_project.py -k test_d3_no_license` (exit 1; `-B`, `scripts/__pycache__` removed first)

```
ERROR: test_d3_no_license_key (test_verify_project.LicenseAgreementTest.test_d3_no_license_key)
KeyError: 'license'
Ran 1 test in 0.002s
FAILED (errors=1)
```

#### #40 D3 location with a leading space (passed on first run; mutation: strip the location before (d)) — red

- HEAD: `18bd008a60d61b1d4b85bdb4f0fcdaed2354ad8d`
- test file blob: `2ea64fdcc837405823b90631a7fe5b2fedaa4df3`; verifier blob: `700c3f74e516065ee21615e3fad04f6b0479c8ef`
- command: `python3 -m unittest discover -s scripts -p test_verify_project.py -k test_d3_location_with_leading` (exit 1; `-B`, `scripts/__pycache__` removed first)

```
FAIL: test_d3_location_with_leading_space (test_verify_project.LicenseAgreementTest.test_d3_location_with_leading_space)
AssertionError: Lists differ: ['doc[116 chars]pace', 'docs/agents/skill-sources.json: licens[74 chars].0"'] != ['doc[116 chars]pace']
-  '"/license_location" has leading or trailing whitespace',
?                                                          ^
+  '"/license_location" has leading or trailing whitespace']
?                                                          ^
-  'docs/agents/skill-sources.json: license reference " LICENSE-CODE" at '
-  '"/license_location" is MIT, not "CC-BY-SA-4.0"']
Ran 1 test in 0.002s
FAILED (failures=1)
```

#### #41 D3 location in another case (passed on first run; mutation: casefold the location before (d)) — red

- HEAD: `18bd008a60d61b1d4b85bdb4f0fcdaed2354ad8d`
- test file blob: `2ea64fdcc837405823b90631a7fe5b2fedaa4df3`; verifier blob: `8cdb416bd3b7b6c95bf6481e89cfcbe082525528`
- command: `python3 -m unittest discover -s scripts -p test_verify_project.py -k test_d3_location_in_other` (exit 1; `-B`, `scripts/__pycache__` removed first)

```
FAIL: test_d3_location_in_other_case (test_verify_project.LicenseAgreementTest.test_d3_location_in_other_case)
AssertionError: Lists differ: ['doc[116 chars]ODE"', 'docs/agents/skill-sources.json: licens[73 chars].0"'] != ['doc[116 chars]ODE"']
-  '"/license_location" differs in case from "LICENSE-CODE"',
?                                                           ^
+  '"/license_location" differs in case from "LICENSE-CODE"']
?                                                           ^
-  'docs/agents/skill-sources.json: license reference "license-code" at '
-  '"/license_location" is MIT, not "CC-BY-SA-4.0"']
Ran 1 test in 0.002s
FAILED (failures=1)
```

#### #42 D5 position before nested (passed on first run; mutation: emit (d) after every other message) — red

- HEAD: `18bd008a60d61b1d4b85bdb4f0fcdaed2354ad8d`
- test file blob: `2ea64fdcc837405823b90631a7fe5b2fedaa4df3`; verifier blob: `fb6453ea9840c38c38901f2550f83b17f7f1f6c3`
- command: `python3 -m unittest discover -s scripts -p test_verify_project.py -k test_d5_position` (exit 1; `-B`, `scripts/__pycache__` removed first)

```
FAIL: test_d5_position_before_nested (test_verify_project.LicenseAgreementTest.test_d5_position_before_nested)
AssertionError: Lists differ: ['doc[43 chars]nce "missing" at "/x/license_location" does no[122 chars].0"'] != ['doc[43 chars]nce "LICENSE-CODE" at "/license_location" is M[122 chars]ist']
First differing element 0:
- ['docs/agents/skill-sources.json: license reference "missing" at '
-  '"/x/license_location" does not exist',
-  'docs/agents/skill-sources.json: license reference "LICENSE-CODE" at '
? ^
+ ['docs/agents/skill-sources.json: license reference "LICENSE-CODE" at '
? ^
-  '"/license_location" is MIT, not "CC-BY-SA-4.0"']
?                                                  ^
+  '"/license_location" is MIT, not "CC-BY-SA-4.0"',
?                                                  ^
+  'docs/agents/skill-sources.json: license reference "missing" at '
```

#### #43 D6 nested object (passed on first run; mutation: apply (d) to the top-level object only) — red

- HEAD: `18bd008a60d61b1d4b85bdb4f0fcdaed2354ad8d`
- test file blob: `2ea64fdcc837405823b90631a7fe5b2fedaa4df3`; verifier blob: `10b7e795e4f8c835ddd71dbb76112634e8a88e85`
- command: `python3 -m unittest discover -s scripts -p test_verify_project.py -k test_d6_nested` (exit 1; `-B`, `scripts/__pycache__` removed first)

```
FAIL: test_d6_nested_object (test_verify_project.LicenseAgreementTest.test_d6_nested_object)
AssertionError: Lists differ: [] != ['docs/agents/skill-sources.json: license [90 chars].0"']
- []
+ ['docs/agents/skill-sources.json: license reference "LICENSE-CODE" at '
+  '"/skills/x/licensing/license_location" is MIT, not "CC-BY-SA-4.0"']
Ran 1 test in 0.003s
FAILED (failures=1)
```

#### #44 D6 object in an array (passed on first run; mutation: skip objects inside arrays for (d)) — red

- HEAD: `18bd008a60d61b1d4b85bdb4f0fcdaed2354ad8d`
- test file blob: `2ea64fdcc837405823b90631a7fe5b2fedaa4df3`; verifier blob: `90e74ce145e1d97bfcb7c89be2041d906cb2bc4a`
- command: `python3 -m unittest discover -s scripts -p test_verify_project.py -k test_d6_object_in_array` (exit 1; `-B`, `scripts/__pycache__` removed first)

```
FAIL: test_d6_object_in_array (test_verify_project.LicenseAgreementTest.test_d6_object_in_array)
AssertionError: Lists differ: [] != ['docs/agents/skill-sources.json: license [78 chars].0"']
- []
+ ['docs/agents/skill-sources.json: license reference "LICENSE-CODE" at '
+  '"/list/0/license_location" is MIT, not "CC-BY-SA-4.0"']
Ran 1 test in 0.003s
FAILED (failures=1)
```

### 2026-10-24 — Wiring, texts, module checks and scope (items 4–7)

- **Wiring (item 4):** `verify()` now ends with `errors.extend(check_license_references(root))`
  right after `errors.extend(check_glossary(root))` (commit `6b13094`). On the ticket worktree,
  `python3 scripts/verify-project.py` exits 0 and prints
  `PASS: shared instructions, 45 skills across Claude/Codex trees, invocation policies, helper assets, native role configs, the glossary convention and license references`.
  The full W1 test and the final W2 run belong to T-0008.
- **CLI demonstration** (surface: the verifier CLI on macOS). The tree at HEAD `6b13094` was
  exported with `git archive` into a `mktemp -d` directory outside the repository. Its
  tune-skills `license_location` was set to `LICENSE`, and that copy's own script was run. It exited
  1 with exactly one FAIL line:
  `FAIL: docs/agents/skill-sources.json: license reference "LICENSE" at "/skills/tune-skills/licensing/license_location" is CC-BY-SA-4.0, not "MIT"`.
  The directory was then removed. This is the regression the spec's Problem Statement names.
- **Texts (item 5):** at HEAD these hold, read in the diff:
  - T1 is the PASS line above;
  - T2 is the docstring's first sentence, "Check portable project instructions, per-runtime skill
    trees, native role configs, the project glossary convention and license references.";
  - T3: `AGENTS.md` reads "It verifies harness plumbing, the glossary convention and license
    references, not slide behavior." Only that paragraph is rewrapped;
  - T6 is the test module's first sentence, as T6 defines it.
- **W3 (item 6):**
  - the imports are `hashlib`, `json`, `os`, `pathlib`, `re`, `sys`, `tomllib`, `unicodedata`, all
    in the W allow-list;
  - `grep -nE` for `subprocess`, `multiprocessing`, `pty`, the listed `os.*` names, `__import__`,
    `write_text`, `write_bytes`, `touch(` and `open(` in `scripts/verify-project.py` printed
    nothing.
- **W4 (item 6):** `git diff 46cfe03...HEAD -- scripts/verify-project.py` has three kinds of changed
  line:
  - T2;
  - the added `import unicodedata`;
  - one hunk with the new block, which starts with
    `# chalkdeck: license-reference check (epic 0005-license-reference-check).`, the `verify()` call,
    and the T1 line, which diff merges into that same hunk.

  No other line of an existing check changed.
- **Scope (item 7):** `git diff --name-only 46cfe03...HEAD` lists `AGENTS.md`,
  `scripts/test_verify_project.py`, `scripts/verify-project.py` and this ticket, all in X1.
- **Checks (item 7, X3):**
  - `python3 scripts/verify-project.py` exits 0;
  - `python3 -m unittest discover -s scripts -p 'test_*.py'` ran 182 tests, OK (138 at B plus 44
    new);
  - `python3 scripts/check_style_skills.py` prints "PASS: 5 style skills match the baseline" and
    exits 0.
- **Known interim gap until T-0008:** this ticket has no unreadable-input handling (rows I1–I4).
  A missing or invalid provenance file raises an exception from `check_license_references`, so
  `verify()` stops with a traceback instead of reporting. The real tree is unaffected. T-0008's I1
  closes the gap.

### 2026-10-24 — Coverage report table (item 8)

| Spec AC | Rows closed here | Evidence | Status |
|---|---|---|---|
| AC1 | P1–P9, D1–D3, D5, D6 (44 sub-cases) | red records above; 182 tests OK at `6b13094` | met for these rows; D4 is in T-0008 |
| AC2 | — | — | T-0008 |
| AC3 | — | — | T-0008 |
| AC4 | W3, W4; wiring and PASS line | Wiring, W3 and W4 entries above | in part; W1 and the final W2 in T-0008 |
| AC5 | T1, T2, T3, T6 | Texts entry above | in part; T4, T5, T7–T9 in T-0008 |
| AC6 | — | — | T-0008 |
| AC7 | X1, X2, X3 for this ticket | first Comment (B, drift), Scope and Checks entries above | met for this ticket |

Stage 5 is done; `status` moves to `review` for stages 6–8.

### 2026-10-24 — Stage 6 code review

Scope: committed changes only, B `46cfe03` to HEAD `7096b5f`; the staged, unstaged and untracked
layers were empty. Two `harness-reviewer` passes ran in parallel on the same captured packet, one
for Standards and one for Spec (about 0.26M subagent tokens). HEAD and status were unchanged when
both reports came back. Findings are recorded per axis as returned, condensed; none is dropped.
Parent reproductions:

- S1/F11: `python3 scripts/test_verify_project.py` printed OK without defining the new classes.
- S5/F1: a provenance value of `LICENSE/x` raised `NotADirectoryError` from
  `check_license_references`.
- S11: line 405 holds a literal U+3000 (the same tool fault that once wrote U+2028 into the spec).

**Standards** (11 breaches of documented rules or local conventions, 7 smells):

- S1 (high conf., medium): the new tests sit after `if __name__ == "__main__": unittest.main()`, so
  a direct run skips them.
- S2 (medium, low): the test plan table's columns differ from `docs/agents/workflow.md:117-121`
  (no Seam, Scope or AC column).
- S3 (medium-high, medium): the coverage report table's columns differ from
  `workflow.md:128-131`, and it has no measured coverage.
- S4 (high, medium): reading the provenance file has no error handling, so `verify()` raises
  instead of returning errors (the recorded interim gap).
- S5 (high, medium): `_resolve` raises `NotADirectoryError` or `PermissionError` for a path through
  a regular file or an unreadable directory.
- S6 (medium, low): the W4 record says the `verify()` call shares the new block's hunk; it is its
  own hunk (`@@ -125,6 +126,7 @@`).
- S7 (high, low): the red records' command lines omit the `-I` flag that every run used.
- S8 (medium, low): #42's mutation as recorded ("after every other message") is worded differently
  from the approved one ("at the end of the object") without a deviation note.
- S9 (high, low): #42's recorded output is cut before `Ran`/`FAILED`; #6's body is short.
- S10 (high, low): the new test classes have no docstrings naming their rows; there is a double
  blank line inside a class.
- S11 (high, low): the U+3000 input is a literal invisible character, not an escape.
- Smells, judged against the baseline:
  - M1: `LicenseFixture` duplicates `Fixture`.
  - M2: the provenance path is written three times, and the file is read twice per `verify()`.
  - M3: the spec symbols Q and (a), and the bare `== 2` drive test, need the spec to read.
  - M4: the SPDX map duplicates ADR-0007 knowledge.
  - M5: the same object is called `parent` and `holder`.
  - M6: the default notices are written though unread here.
  - M7: implementations ran ahead of their tests, so 29 of 44 reds came by mutation.

**Spec** (13 findings):

- F1 (high, high): resolution has no `OSError` handling; traceability:129-131 requires
  `does not exist`. A provenance value such as `LICENSE/x` crashes the verifier.
- F2 (high, medium): path rule 2 checks only `<`; `%`, `?`, `>` and whitespace are missing. For
  example, `a%20b.md` with that file present passes when it should fail.
- F3 (medium, low-medium): resolution uses `Path.is_symlink()` and `Path.is_file()`, not
  `os.lstat`. `is_file()` follows links and swallows `OSError`.
- F4 (high, medium): when this ticket lands alone, the existing `Skill provenance cannot be checked`
  message is replaced by a traceback for a missing, invalid or non-UTF-8 provenance file. A symlinked
  or array-topped file is read silently. The interim-gap note lists only part of this.
- F5 (medium, low-medium): the W3 evidence used a substring grep, which W3 forbids, so the recorded
  "printed nothing" cannot be the pattern as listed (`pty` matches `is empty`). The new
  `name.replace(...)` is literally a `replace` method call; the rule's intent is presumably
  `Path.replace`.
- F6 (medium, low-medium): the red records reached Git in the last commit, after the code that
  turned them green. Order is shown only by the recorded HEAD and blobs.
- F7 (high, low): as S8.
- F8 (medium, low): #39's mutation produced `KeyError: 'license'`. The mutated guard let the message
  line read the missing key; the red is valid, but the effect differs from the table's wording.
- F9 (high, low): #15 and #16 ran the same mutation blob, because steps 3 and 4 share one condition;
  each still went red for its own input.
- F10 (medium, low): the `git hash-object -w` blobs are unreachable loose objects, so `git gc` can
  prune them after `gc.pruneExpire` (two weeks by default).
- F11 (high, low): as S1.
- F12 (low, low): the 15 natural reds ran without `-B`; that they were unaffected is argued, not
  shown.
- F13 (low, low): one garbled sentence in the deviation note; "182 tests, OK" is quoted without the
  skip count.

Worst per axis: Standards S1 (new tests silently skipped by a direct run); Spec F1 (a provenance
value can crash the verifier).

### 2026-10-24 — Stage 6 rulings and amended test plan

The repository owner: "C1–C4 都照建議，修正後重跑檢查。"

- **C1** (F1, F2, F3, S5): fix resolution and path rule 2 in this ticket; F3 moves resolution to
  `os.lstat` and `stat.S_ISREG` without its own test. Approved sub-cases #45–#49 below.
- **C2** (F4, S4): bring the provenance side of I1 into this ticket, with the spec's messages
  `docs/agents/skill-sources.json: cannot read license references (<reason>)`. The sub-cases are
  #50–#62 below. T-0008's I1 adds the notices line to each of them.
- **C3** (S3, S2): measure line coverage with the standard library's `trace`, and add workflow's
  columns to the coverage table. The amended rows below carry a Seam column.
- **C4** (F5): W3's "`replace` method call" means the file-system `Path.replace` and its kin, not
  `str.replace`. W3 is re-judged by identifier with an AST walk.
- Mechanical fixes without a ruling: S1, S6, S7, S9, S10, S11, M3, M5, and the wording of F7, F8,
  F9 and F13.
- Process fixes without a ruling: from here on, each green commit carries that round's red records
  (F6). Blob pruning (F10) goes to the epic retrospective.

Amended test plan rows (seam: `check_license_references(root)` on a `LicenseFixture`; notation as
in the approved table, with `U(reason)` for
`docs/agents/skill-sources.json: cannot read license references (reason)`):

| # | Row | Sub-case | Expected | Mutation if the first run passes |
|---|---|---|---|---|
| 45 | P7 / R3 | loc `"LICENSE/x"` | `"LICENSE/x" @ …: does not exist` | let resolution errors propagate |
| 46 | P7 / R7 | loc `"sub/LICENSE"`, `sub/` mode 000 (skipped as root) | `"sub/LICENSE" @ …: does not exist` | let resolution errors propagate |
| 47 | P7 / R2 | loc `"LICENSE>old"` | `"LICENSE>old" @ …: is not a plain repository path` | drop `>` from rule 2 |
| 48 | P7 / R2 | loc `"LICENSE?x"` | `"LICENSE?x" @ …: is not a plain repository path` | drop `?` from rule 2 |
| 49 | P7 / R2 | loc `"a%20b.md"`, that file existing | `"a%20b.md" @ …: is not a plain repository path` | drop `%` from rule 2 |
| 50 | I1 | provenance missing | `U(missing)` | treat a missing file as `{}` |
| 51 | I1 | provenance a symlink to a file | `U(a symlink)` | follow the symlink |
| 52 | I1 | `docs/agents` a symlink to a directory holding the file | `U(a symlink)` | check only the last segment for a symlink |
| 53 | I1 | provenance a directory | `U(not a regular file)` | skip the regular-file check |
| 54 | I1 | provenance a FIFO (skipped where `mkfifo` is unavailable) | `U(not a regular file)` | skip the regular-file check; the run must not hang |
| 55 | I1 | `docs` a regular file | `U(missing)` | report `not readable` for `NotADirectoryError` |
| 56 | I1 | the directory named `Docs` on disk | `U(missing)` | match segments case-insensitively |
| 57 | I1 | bytes not UTF-8 | `U(not UTF-8)` | decode with `errors="replace"` |
| 58 | I1 | `{` | `U(not valid JSON)` | treat a parse error as `{}` |
| 59 | I1 | UTF-8 BOM before `{}` | `U(not valid JSON)` | strip a BOM before parsing |
| 60 | I1 | 100,000 nested arrays | `U(not valid JSON)` | treat `RecursionError` as `{}` |
| 61 | I1 | a 5,000-digit integer as `license_location` | `U(not valid JSON)` | raise the int digit limit |
| 62 | I1 | top-level `[]` | `U(not a JSON object)` | accept a top-level array |
