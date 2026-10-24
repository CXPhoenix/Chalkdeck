---
id: T-0008
title: The verifier enforces the notices link grammar and required links, and the deck track runs it
epic: 0005-license-reference-check
status: done
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

### 2026-10-24 — Base and drift check (item 1)

- B: `99ba5ecc5a3853ad2cf3e0a335874ec96104c0fe`, the branch's starting commit. It is the T-0007
  merge (PR #12, merged 2026-10-24T04:14:02Z, confirmed with `gh pr view 12`).
- Worktree: `.worktrees/T-0008`, branch `tickets/T-0008/notices-grammar-and-deck-track`.
- Drift. `git diff --name-only 2577b504fa5f22fcef047a95f6d9c2afc9a2daf4 99ba5ec -- THIRD_PARTY_NOTICES.md docs/agents/skill-sources.json docs/agents/workflow.md docs/adr/ docs/README.md AGENTS.md scripts/`
  lists `AGENTS.md`, `scripts/test_verify_project.py` and `scripts/verify-project.py`. Those are
  exactly the paths T-0007 changed, the same command between `46cfe03` and `99ba5ec`, so there is
  no drift.
- Facts at B0 about the notices, re-checked at B:
  - 183 `\n` characters, LF only, no BOM;
  - 33 inline links, every `](` part of one, on lines 10, 11, 34–56, 67, 75, 80, 82, 84, 85, 93 and
    95;
  - line 10 ends `[CC BY-SA 4.0](LICENSE) |`, line 11 ends `[MIT](LICENSE-CODE) |`, and line 34 is
    `- [code-review](.agents/skills/code-review/LICENSE)`;
  - no `<`, tab, backslash, fence or blockquote;
  - 23 table rows and 26 list items, none of them in the S1 or S2 shapes.
- Baseline at B: `python3 scripts/verify-project.py` exits 0 with the T1 PASS line;
  `python3 -m unittest discover -s scripts -p 'test_*.py'` ran 202 tests, OK.
- T-0007's status is set to `done` in this branch's first commit (`b391a96`).

### 2026-10-24 — Test plan table (item 2), awaiting the repository owner's approval

Seam: `check_license_references(root)` on a `LicenseFixture` (the T-0007 fixture), and `verify()`
for W1. Numbering continues from T-0007's #1–#64.

**Fixture defaults** (traceability, Matrix):

- regular files `LICENSE` and `LICENSE-CODE`;
- provenance `{}`;
- notices lines 1–2 `[CC BY-SA 4.0](LICENSE)` and `[MIT](LICENSE-CODE)`, with the row's content
  from line 3.

A row that says "replaces line 1/2" edits those lines. Expected lists are complete.

**Notation:**

- `N(l, D, r)` = `THIRD_PARTY_NOTICES.md:l: license reference D r`, D rendered by Q;
- `M(l, c)` = `THIRD_PARTY_NOTICES.md:l: unsupported Markdown (c)`;
- `NL(LICENSE)` / `NL(LICENSE-CODE)` = the two missing-link messages;
- `U(r)` / `UN(r)` = `cannot read license references (r)` for the provenance file / the notices;
- `P(V, r)` = the provenance message for value V at `"/license_location"`.

**Red:**

- Expected first-run result: every sub-case that expects a message is red, because nothing reads
  the notices yet. Every sub-case marked "pass" is expected to pass once the code it depends on
  exists.
- For those, the last column names the mutation, applied to the implementation as in T-0007.
- The command, blobs and `-I -B` rule are T-0007's. Records are committed with their green.

**Implementation order:**

1. Restructure the provenance side so an unreadable provenance file no longer returns early.
2. The notices reader.
3. Recognized links and (b).
4. Path rule 2's whitespace.
5. (c).
6. Fences and code spans.
7. The fifteen constructs.
8. Ordering.
9. W1.

| # | Row | Sub-case (line 3 unless stated) | Expected | Mutation if the first run passes |
|---|---|---|---|---|
| 65 | D4 | provenance `{"license":"MIT","license_location":"LICENSE"}`, `LICENSE` absent | `P("LICENSE", does not exist)`, the mismatch `is CC-BY-SA-4.0, not "MIT"`, `N(1, "LICENSE", does not exist)` | skip (b) for line 1 |
| 66 | N1 | `[x](LICENSE)` | `[]` | report every resolved destination as `does not exist` |
| 67 | N1 | `![x](LICENSE)` | `[]` | treat images as unrecognized |
| 68 | N1 | `[x](<LICENSE>)` | `[]` | keep the angle brackets in the destination |
| 69 | N1 | `[x](LICENSE "t")` | `[]` | drop `"…"` titles from the link pattern |
| 70 | N1 | `[x](LICENSE 't')` | `[]` | drop `'…'` titles |
| 71 | N1 | `[x](LICENSE (t))` | `[]` | drop `(…)` titles |
| 72 | N1 | `` `code` [x](LICENSE) `` | `[]` | skip the rest of a line after a code span |
| 73 | N1 | two spaces, then `[x](LICENSE)` | `[]` | treat any indented line as indented code |
| 74 | N2 | `[x](https://example.org)` | `[]` | do not skip `https` |
| 75 | N2 | `[x](http://example.org)` | `[]` | do not skip `http` |
| 76 | N2 | `[x](MAILTO:a@example.org)` | `[]` | compare schemes case-sensitively |
| 77 | N2 | `[x](#anchor)` | `[]` | do not skip `#` destinations |
| 78 | N2 | `[x](LICENSE#section)` | `[]` | keep the fragment |
| 79 | N2 | `[x](LICENSE#a%20b)` | `[]` | apply rule 2 before removing the fragment |
| 80 | N3 | `[x]()` | `N(3, "", is empty)` | — |
| 81 | N3 | `[x](<>)` | `N(3, "", is empty)` | — |
| 82 | N4 | `[x](ab:c)` | `N(3, "ab:c", uses an unsupported URL scheme)` | — |
| 83 | N4 | `[x](ftp://host/x)` | `N(3, "ftp://host/x", uses an unsupported URL scheme)` | — |
| 84 | N4 | `[x](C:x)` | `N(3, "C:x", is outside the repository)` | — |
| 85 | N5 | `[x](docs/Missing.md#top)`, `docs/missing.md` present | `N(3, "docs/Missing.md#top", differs in case from "docs/missing.md")` | — |
| 86 | N6 | line 3 `text`, line 4 `[x](missing)` | `N(4, "missing", does not exist)` | — |
| 87 | R1 | `[x](/LICENSE)` | `N(3, "/LICENSE", is outside the repository)` | — |
| 88 | R1 | `[x](\LICENSE)` | `N(3, "\\LICENSE", is outside the repository)` | — |
| 89 | R1 | `[x](a\LICENSE)` | `N(3, "a\\LICENSE", is outside the repository)` | — |
| 90 | R1 | `[x](../LICENSE)` | `N(3, "../LICENSE", is outside the repository)` | — |
| 91 | R1 | `[x](a/../LICENSE)`, `a/` present | `N(3, "a/../LICENSE", is outside the repository)` | — |
| 92 | R1 | `[x](//host/x)` | `N(3, "//host/x", is outside the repository)` | — |
| 93 | R1 | `[x](../a%20b)` | `N(3, "../a%20b", is outside the repository)` | — |
| 94 | R2 | `[x](a%20b.md)`, that file present | `N(3, "a%20b.md", is not a plain repository path)` | — |
| 95 | R2 | `[x](LICENSE?plain=1)` | `N(3, "LICENSE?plain=1", is not a plain repository path)` | — |
| 96 | R2 | `[x](./LICENSE)` | `N(3, "./LICENSE", is not a plain repository path)` | — |
| 97 | R2 | `[x](a//b)` | `N(3, "a//b", is not a plain repository path)` | — |
| 98 | R2 | `[x](docs/)` | `N(3, "docs/", is not a plain repository path)` | — |
| 99 | R2 | `[x](<docs/my file.md>)`, that file present (T-0007 handover: whitespace) | `N(3, "docs/my file.md", is not a plain repository path)` | — |
| 100 | R3 | `[x](missing)` | `N(3, "missing", does not exist)` | — |
| 101 | R3 | `[x](LICENSE/x)` | `N(3, "LICENSE/x", does not exist)` | — |
| 102 | R3 | `[x](.../LICENSE)` | `N(3, ".../LICENSE", does not exist)` | — |
| 103 | R4 | `[x](license)` | `N(3, "license", differs in case from "LICENSE")` | — |
| 104 | R4 | `[x](Docs/x.md)`, `docs/x.md` present | `N(3, "Docs/x.md", differs in case from "docs")` | — |
| 105 | R4 | an NFC name for an NFD file on disk | `N(3, <NFC name>, differs in case from <NFD name>)` | — |
| 106 | R5 | `[x](link)`, `link` → `LICENSE` | `N(3, "link", passes through a symlink at "link")` | — |
| 107 | R5 | `[x](sub/LICENSE)`, `sub` → a directory holding `LICENSE` | `N(3, "sub/LICENSE", passes through a symlink at "sub")` | — |
| 108 | R5 | `[x](LINK)`, `link` → `LICENSE` | `N(3, "LINK", differs in case from "link")` | — |
| 109 | R6 | `[x](adir)`, a directory | `N(3, "adir", is not a regular file)` | — |
| 110 | R6 | `[x](fifo)`, a FIFO (skipped without `mkfifo`) | `N(3, "fifo", is not a regular file)` | — |
| 111 | R7 | `[x](sub/LICENSE)`, `sub` mode 000 (skipped as root) | `N(3, "sub/LICENSE", does not exist)` | — |
| 112 | R7 | `[x](sub/LICENSE)`, `sub` mode 0o444 (skipped as root; T-0007 handover: `lstat` branch) | `N(3, "sub/LICENSE", does not exist)` | — |
| 113 | G1 | `` `[x](missing)` `` | `[]` | do not skip code spans |
| 114 | G1 | a backtick fence around `[x](missing)` | `[]` | do not skip fences |
| 115 | G1 | a tilde fence around `[x](missing)` | `[]` | recognize backtick fences only |
| 116 | G1 | opener ```` ``` ````, closer ```` ```` ```` around `[x](missing)` | `[]` | close only on an equal-length run |
| 117 | G1 | a fence whose closer is indented 3 spaces | `[]` | close only at column 1 |
| 118 | G1 | a fence with info string `python` | `[]` | reject openers with an info string |
| 119 | G2 | four spaces, then ```` ``` ```` | `M(3, unmatched backtick)` | — |
| 120 | G2 | ```` ``` ```` closed by `~~~`, then `[x](missing)` | `M(3, unclosed code fence)` | — |
| 121 | G2 | ```` ```` ```` closed by ```` ``` ````, then `[x](missing)` | `M(3, unclosed code fence)` | — |
| 122 | G2 | ```` ``` ```` closed by ```` ``` x ````, then `[x](missing)` | `M(3, unclosed code fence)` | — |
| 123 | G2 | two spaces, `~~~`; line 4 `[x](missing)` | `M(3, indented fence)`, `N(4, "missing", does not exist)` | — |
| 124 | G3 | BOM before line 1 | `M(1, byte order mark)` | — |
| 125 | G3 | `text` + CR | `M(3, carriage return)` | — |
| 126 | G3 | ```` ```x``` ```` | `M(3, backtick in fence info string)` | — |
| 127 | G3 | ``a ` b`` | `M(3, unmatched backtick)` | — |
| 128 | G3 | `<!-- -->` | `M(3, raw HTML or autolink)` | — |
| 129 | G3 | `<div>` | `M(3, raw HTML or autolink)` | — |
| 130 | G3 | `<https://example.org>` | `M(3, raw HTML or autolink)` | — |
| 131 | G3 | `> quote` | `M(3, blockquote)` | — |
| 132 | G3 | tab, then `text` | `M(3, tab indentation)` | — |
| 133 | G3 | two spaces, tab, `[x](LICENSE)` | `M(3, tab indentation)` | — |
| 134 | G3 | `[x]: LICENSE` | `M(3, link reference definition)` | — |
| 135 | G3 | three spaces, `[x]: LICENSE` | `M(3, link reference definition)` | — |
| 136 | G3 | four spaces, `[x](LICENSE)` | `M(3, indented line with a link)` | — |
| 137 | G3 | `a\[b` | `M(3, backslash escape)` | — |
| 138 | G3 | `a\(b` | `M(3, backslash escape)` | — |
| 139 | G3 | `[](LICENSE)` | `M(3, empty link text)` | — |
| 140 | G3 | `[ ](LICENSE)` | `M(3, empty link text)` | — |
| 141 | G3 | `[![a](a.png)](LICENSE)`, `a.png` present | `M(3, unrecognized link)` | — |
| 142 | G3 | `[a](b c)` | `M(3, unrecognized link)` | — |
| 143 | G3 | line 3 `[a`, line 4 `b](LICENSE)` | `M(4, unrecognized link)` | — |
| 144 | G4 | `<!-- a\[b -->` | `M(3, raw HTML or autolink)` | — |
| 145 | G4 | `a<b` + CR | `M(3, carriage return)` | — |
| 146 | G5 | `<!--` inside a fence | `[]` | check constructs inside fences |
| 147 | G5 | four spaces, `text` | `[]` | report every 4-space line |
| 148 | G5 | `` `<!--` `` | `[]` | look for `<` inside code spans |
| 149 | G5 | `a\x` | `[]` | report a backslash before any character |
| 150 | G5 | `[x](<LICENSE>)` | `[]` | treat every `<` as raw HTML |
| 151 | G6 | `<b>[x](missing)</b>` | `M(3, raw HTML or autolink)`, `N(3, "missing", does not exist)` | — |
| 152 | G6 | line 2 replaced by `<!-- [MIT](LICENSE-CODE) -->` | `M(2, raw HTML or autolink)` | — |
| 153 | G7 | line 2 replaced by `[x](LICENSE "[MIT](LICENSE-CODE)")` | `NL(LICENSE-CODE)` | — |
| 154 | G8 | `\| a \| [MIT](LICENSE-CODE "MIT \| code") \|` | `M(3, pipe inside a table cell element)` | — |
| 155 | G8 | ``\| `x \| y` \|`` | `M(3, pipe inside a table cell element)` | — |
| 156 | G8 | ``\| a \| `b` \| [x](LICENSE) \|`` | `[]` | report any `\|` on a table row |
| 157 | G9 | `- ~~~` | `M(3, block inside a list item)` | — |
| 158 | G9 | `-`, five spaces, `[x](LICENSE)` | `M(3, block inside a list item)` | — |
| 159 | G9 | `- [lc]: LICENSE` | `M(3, block inside a list item)` | — |
| 160 | G9 | `1. > quote` | `M(3, block inside a list item)` | — |
| 161 | G9 | `- [x](LICENSE)` | `[]` | report every list item |
| 162 | G10 | `` [`x`](LICENSE) `` | `[]` | reject code spans in link text |
| 163 | G10 | ``[x](a`b`)`` | `M(3, unrecognized link)` | — |
| 164 | C1 | line 1 removed | `NL(LICENSE)` | — |
| 165 | C1 | line 2 removed | `NL(LICENSE-CODE)` | — |
| 166 | C2 | line 1 `` `[CC BY-SA 4.0](LICENSE)` ``; lines 2–4 a fence holding `[MIT](LICENSE-CODE)` | `NL(LICENSE)`, `NL(LICENSE-CODE)` | — |
| 167 | C3 | line 1 replaced by `[CC BY-SA 4.0](LICENSE#section)` | `[]` | require an exact destination before removing the fragment |
| 168 | C3 | line 2 replaced by `[MIT](<LICENSE-CODE>)` | `[]` | keep angle brackets for (c) |
| 169 | C3 | line 2 replaced by `[MIT](LICENSE-CODE "t")` | `[]` | links with titles do not count |
| 170 | C4 | line 1 replaced by `[CC-BY-SA](LICENSE)` | `NL(LICENSE)` | — |
| 171 | C4 | lines 1–2 swapped in text: `[MIT](LICENSE)`, `[CC BY-SA 4.0](LICENSE-CODE)` | `NL(LICENSE)`, `NL(LICENSE-CODE)` | — |
| 172 | C4 | line 2 replaced by `![MIT](LICENSE-CODE)` | `NL(LICENSE-CODE)` | — |
| 173 | C4 | line 1 replaced by `[CC BY-SA 4.0](./LICENSE)` | `N(1, "./LICENSE", is not a plain repository path)`, `NL(LICENSE)` | — |
| 174 | C4 | line 2 replaced by `[MIT](license-code)` | `N(2, "license-code", differs in case from "LICENSE-CODE")`, `NL(LICENSE-CODE)` | — |
| 175 | C4 | line 2 replaced by `[ MIT ](LICENSE-CODE)` | `NL(LICENSE-CODE)` | — |
| 176 | C4 | line 2 replaced by `[mit](LICENSE-CODE)` | `NL(LICENSE-CODE)` | — |
| 177–189 | I1 | T-0007's #50–#62, each with notices line 3 `[x](missing)` (#63–#64 are I3 and keep their single message) | the existing `U(reason)`, then `N(3, "missing", does not exist)` (traceability I1) | — |
| 190 | I2 | notices missing; provenance `{"license_location":"missing"}` | `P("missing", does not exist)`, `UN(missing)` | — |
| 191 | I2 | notices a symlink to a file | as #190 with `UN(a symlink)` | — |
| 192 | I2 | notices a directory | as #190 with `UN(not a regular file)` | — |
| 193 | I2 | notices not UTF-8 | as #190 with `UN(not UTF-8)` | — |
| 194 | I2 | the notices named `third_party_notices.md` on disk | as #190 with `UN(missing)` | — |
| 195 | I3 | notices mode 000 (skipped as root) | `UN(not readable)` | — |
| 196 | I4 | both inputs missing | `U(missing)`, `UN(missing)` | — |
| 197 | O1 | provenance `{"license_location":"missing"}`; notices line 1 `[CC BY-SA 4.0](LICENSE)`, line 2 `[x](missing)`, line 3 `<b>` (no `LICENSE-CODE` link) | `P("missing", does not exist)`, `M(3, raw HTML or autolink)`, `N(2, "missing", does not exist)`, `NL(LICENSE-CODE)` | — |
| 198 | O2 | `[a](zz) [b](aa)` | `N(3, "zz", does not exist)`, `N(3, "aa", does not exist)` | — |
| 199 | O3 | provenance `license_location` = a one-item array holding a string of `"`, a backslash, a newline, U+0007 and U+2028 | `is not a string`, the value rendered `["\"\\\n\u0007\u2028"]` | — |
| 200 | O3 | provenance `license_location` = `["授權"]` | `is not a string`, rendered `["授權"]` | — |
| 201 | O4 | `"missing"` under keys `a/b`, `c~d`, `e"f`, `` (empty) | `does not exist` at `"/a~1b/c~0d/e\"f//license_location"` | — |
| 202 | W1 | `verify()` on a fixture with no `GLOSSARY.md`, notices line 3 `[x](missing)` | errors end with exactly `check_license_references(root)`'s list (holding `N(3, "missing", does not exist)`), and the error just before it is the glossary message | make `verify()` call the check before the glossary check |

**Not tests in this ticket** (judged in Comments): T4, T5, T7, T8 and T9, plus W2–W4, E1–E4 and
X1–X3.

**T-0007 handover item without a row:** whether a `RecursionError` from Q is reachable. Stage 7
reasoned that it is not on CPython 3.11–3.13. It will be checked on the installed interpreter by
building a provenance value at `json.loads`'s depth limit and rendering it. If Q raises, a new
sub-case comes back for approval; if not, the outcome is recorded.

### 2026-10-24 — Test plan approved (hard rule 2)

The repository owner: "T-0008 的 test plan 表格核准，開始 /tdd。" Red records follow the table's
numbering. Each record is committed with the green it precedes, and runs use T-0007's command:
`rm -rf scripts/__pycache__ && python3 -I -B -m unittest discover -s scripts -p test_verify_project.py -k <name>`.

### 2026-10-24 — Red records for #65 and #177–#189, committed with their green

#177–#189 extend T-0007's #50–#62 with the notices line 3 `[x](missing)` (helper `unreadable_then_notices`); each failed because the check returned after the provenance message without reading the notices.

#### #65 D4 both kinds on one object — red

- HEAD: `4bd317690842c9d54b23c217dc8d542aea0b761e`
- test file blob: `ac2c05f06adbb1d39ef4880ddf4ce55d422f5aed`; verifier blob: `626570ab339b057837b11b843d03dd06b498083b`
- command: `python3 -m unittest discover -s scripts -p test_verify_project.py -k test_d4_both` (exit 1; `-B`, `scripts/__pycache__` removed first)

```
FAIL: test_d4_both_kinds_on_one_object (test_verify_project.NoticesReferenceTest.test_d4_both_kinds_on_one_object)
AssertionError: Lists differ: ['doc[203 chars]MIT"'] != ['doc[203 chars]MIT"', 'THIRD_PARTY_NOTICES.md:1: license refe[27 chars]ist']
-  '"/license_location" is CC-BY-SA-4.0, not "MIT"']
?                                                  ^
+  '"/license_location" is CC-BY-SA-4.0, not "MIT"',
?                                                  ^
+  'THIRD_PARTY_NOTICES.md:1: license reference "LICENSE" does not exist']
Ran 1 test in 0.003s
FAILED (failures=1)
```

#### I1 ext test_i1_missing (T-0008 #177-#189) — red

- HEAD: `4bd317690842c9d54b23c217dc8d542aea0b761e`
- test file blob: `ac2c05f06adbb1d39ef4880ddf4ce55d422f5aed`; verifier blob: `626570ab339b057837b11b843d03dd06b498083b`
- command: `python3 -m unittest discover -s scripts -p test_verify_project.py -k test_i1_missing` (exit 1; `-B`, `scripts/__pycache__` removed first)

```
FAIL: test_i1_missing (test_verify_project.ProvenanceInputTest.test_i1_missing)
AssertionError: Lists differ: ['doc[65 chars]ing)'] != ['doc[65 chars]ing)', 'THIRD_PARTY_NOTICES.md:3: license refe[27 chars]ist']
- ['docs/agents/skill-sources.json: cannot read license references (missing)']
?                                                                            ^
+ ['docs/agents/skill-sources.json: cannot read license references (missing)',
?                                                                            ^
+  'THIRD_PARTY_NOTICES.md:3: license reference "missing" does not exist']
Ran 1 test in 0.002s
FAILED (failures=1)
```

#### I1 ext test_i1_symlink (T-0008 #177-#189) — red

- HEAD: `4bd317690842c9d54b23c217dc8d542aea0b761e`
- test file blob: `ac2c05f06adbb1d39ef4880ddf4ce55d422f5aed`; verifier blob: `626570ab339b057837b11b843d03dd06b498083b`
- command: `python3 -m unittest discover -s scripts -p test_verify_project.py -k test_i1_symlink` (exit 1; `-B`, `scripts/__pycache__` removed first)

```
FAIL: test_i1_symlink (test_verify_project.ProvenanceInputTest.test_i1_symlink)
AssertionError: Lists differ: ['doc[67 chars]ink)'] != ['doc[67 chars]ink)', 'THIRD_PARTY_NOTICES.md:3: license refe[27 chars]ist']
- ['docs/agents/skill-sources.json: cannot read license references (a symlink)']
?                                                                              ^
+ ['docs/agents/skill-sources.json: cannot read license references (a symlink)',
?                                                                              ^
+  'THIRD_PARTY_NOTICES.md:3: license reference "missing" does not exist']
FAIL: test_i1_symlinked_parent (test_verify_project.ProvenanceInputTest.test_i1_symlinked_parent)
AssertionError: Lists differ: ['doc[67 chars]ink)'] != ['doc[67 chars]ink)', 'THIRD_PARTY_NOTICES.md:3: license refe[27 chars]ist']
- ['docs/agents/skill-sources.json: cannot read license references (a symlink)']
?                                                                              ^
+ ['docs/agents/skill-sources.json: cannot read license references (a symlink)',
?                                                                              ^
+  'THIRD_PARTY_NOTICES.md:3: license reference "missing" does not exist']
```

#### I1 ext test_i1_symlinked_parent (T-0008 #177-#189) — red

- HEAD: `4bd317690842c9d54b23c217dc8d542aea0b761e`
- test file blob: `ac2c05f06adbb1d39ef4880ddf4ce55d422f5aed`; verifier blob: `626570ab339b057837b11b843d03dd06b498083b`
- command: `python3 -m unittest discover -s scripts -p test_verify_project.py -k test_i1_symlinked_parent` (exit 1; `-B`, `scripts/__pycache__` removed first)

```
FAIL: test_i1_symlinked_parent (test_verify_project.ProvenanceInputTest.test_i1_symlinked_parent)
AssertionError: Lists differ: ['doc[67 chars]ink)'] != ['doc[67 chars]ink)', 'THIRD_PARTY_NOTICES.md:3: license refe[27 chars]ist']
- ['docs/agents/skill-sources.json: cannot read license references (a symlink)']
?                                                                              ^
+ ['docs/agents/skill-sources.json: cannot read license references (a symlink)',
?                                                                              ^
+  'THIRD_PARTY_NOTICES.md:3: license reference "missing" does not exist']
Ran 1 test in 0.003s
FAILED (failures=1)
```

#### I1 ext test_i1_directory (T-0008 #177-#189) — red

- HEAD: `4bd317690842c9d54b23c217dc8d542aea0b761e`
- test file blob: `ac2c05f06adbb1d39ef4880ddf4ce55d422f5aed`; verifier blob: `626570ab339b057837b11b843d03dd06b498083b`
- command: `python3 -m unittest discover -s scripts -p test_verify_project.py -k test_i1_directory` (exit 1; `-B`, `scripts/__pycache__` removed first)

```
FAIL: test_i1_directory (test_verify_project.ProvenanceInputTest.test_i1_directory)
AssertionError: Lists differ: ['doc[76 chars]ile)'] != ['doc[76 chars]ile)', 'THIRD_PARTY_NOTICES.md:3: license refe[27 chars]ist']
-  'regular file)']
?                 ^
+  'regular file)',
?                 ^
+  'THIRD_PARTY_NOTICES.md:3: license reference "missing" does not exist']
FAIL: test_i1_directory_in_other_case (test_verify_project.ProvenanceInputTest.test_i1_directory_in_other_case)
AssertionError: Lists differ: ['doc[65 chars]ing)'] != ['doc[65 chars]ing)', 'THIRD_PARTY_NOTICES.md:3: license refe[27 chars]ist']
- ['docs/agents/skill-sources.json: cannot read license references (missing)']
?                                                                            ^
+ ['docs/agents/skill-sources.json: cannot read license references (missing)',
?                                                                            ^
+  'THIRD_PARTY_NOTICES.md:3: license reference "missing" does not exist']
```

#### I1 ext test_i1_fifo (T-0008 #177-#189) — red

- HEAD: `4bd317690842c9d54b23c217dc8d542aea0b761e`
- test file blob: `ac2c05f06adbb1d39ef4880ddf4ce55d422f5aed`; verifier blob: `626570ab339b057837b11b843d03dd06b498083b`
- command: `python3 -m unittest discover -s scripts -p test_verify_project.py -k test_i1_fifo` (exit 1; `-B`, `scripts/__pycache__` removed first)

```
FAIL: test_i1_fifo (test_verify_project.ProvenanceInputTest.test_i1_fifo)
AssertionError: Lists differ: ['doc[76 chars]ile)'] != ['doc[76 chars]ile)', 'THIRD_PARTY_NOTICES.md:3: license refe[27 chars]ist']
-  'regular file)']
?                 ^
+  'regular file)',
?                 ^
+  'THIRD_PARTY_NOTICES.md:3: license reference "missing" does not exist']
Ran 1 test in 0.002s
FAILED (failures=1)
```

#### I1 ext test_i1_docs_is (T-0008 #177-#189) — red

- HEAD: `4bd317690842c9d54b23c217dc8d542aea0b761e`
- test file blob: `ac2c05f06adbb1d39ef4880ddf4ce55d422f5aed`; verifier blob: `626570ab339b057837b11b843d03dd06b498083b`
- command: `python3 -m unittest discover -s scripts -p test_verify_project.py -k test_i1_docs_is` (exit 1; `-B`, `scripts/__pycache__` removed first)

```
FAIL: test_i1_docs_is_a_regular_file (test_verify_project.ProvenanceInputTest.test_i1_docs_is_a_regular_file)
AssertionError: Lists differ: ['doc[65 chars]ing)'] != ['doc[65 chars]ing)', 'THIRD_PARTY_NOTICES.md:3: license refe[27 chars]ist']
- ['docs/agents/skill-sources.json: cannot read license references (missing)']
?                                                                            ^
+ ['docs/agents/skill-sources.json: cannot read license references (missing)',
?                                                                            ^
+  'THIRD_PARTY_NOTICES.md:3: license reference "missing" does not exist']
Ran 1 test in 0.003s
FAILED (failures=1)
```

#### I1 ext test_i1_directory_in_other (T-0008 #177-#189) — red

- HEAD: `4bd317690842c9d54b23c217dc8d542aea0b761e`
- test file blob: `ac2c05f06adbb1d39ef4880ddf4ce55d422f5aed`; verifier blob: `626570ab339b057837b11b843d03dd06b498083b`
- command: `python3 -m unittest discover -s scripts -p test_verify_project.py -k test_i1_directory_in_other` (exit 1; `-B`, `scripts/__pycache__` removed first)

```
FAIL: test_i1_directory_in_other_case (test_verify_project.ProvenanceInputTest.test_i1_directory_in_other_case)
AssertionError: Lists differ: ['doc[65 chars]ing)'] != ['doc[65 chars]ing)', 'THIRD_PARTY_NOTICES.md:3: license refe[27 chars]ist']
- ['docs/agents/skill-sources.json: cannot read license references (missing)']
?                                                                            ^
+ ['docs/agents/skill-sources.json: cannot read license references (missing)',
?                                                                            ^
+  'THIRD_PARTY_NOTICES.md:3: license reference "missing" does not exist']
Ran 1 test in 0.003s
FAILED (failures=1)
```

#### I1 ext test_i1_not_utf8 (T-0008 #177-#189) — red

- HEAD: `4bd317690842c9d54b23c217dc8d542aea0b761e`
- test file blob: `ac2c05f06adbb1d39ef4880ddf4ce55d422f5aed`; verifier blob: `626570ab339b057837b11b843d03dd06b498083b`
- command: `python3 -m unittest discover -s scripts -p test_verify_project.py -k test_i1_not_utf8` (exit 1; `-B`, `scripts/__pycache__` removed first)

```
FAIL: test_i1_not_utf8 (test_verify_project.ProvenanceInputTest.test_i1_not_utf8)
AssertionError: Lists differ: ['doc[67 chars]F-8)'] != ['doc[67 chars]F-8)', 'THIRD_PARTY_NOTICES.md:3: license refe[27 chars]ist']
- ['docs/agents/skill-sources.json: cannot read license references (not UTF-8)']
?                                                                              ^
+ ['docs/agents/skill-sources.json: cannot read license references (not UTF-8)',
?                                                                              ^
+  'THIRD_PARTY_NOTICES.md:3: license reference "missing" does not exist']
Ran 1 test in 0.003s
FAILED (failures=1)
```

#### I1 ext test_i1_not_valid_json (T-0008 #177-#189) — red

- HEAD: `4bd317690842c9d54b23c217dc8d542aea0b761e`
- test file blob: `ac2c05f06adbb1d39ef4880ddf4ce55d422f5aed`; verifier blob: `626570ab339b057837b11b843d03dd06b498083b`
- command: `python3 -m unittest discover -s scripts -p test_verify_project.py -k test_i1_not_valid_json` (exit 1; `-B`, `scripts/__pycache__` removed first)

```
FAIL: test_i1_not_valid_json (test_verify_project.ProvenanceInputTest.test_i1_not_valid_json)
AssertionError: Lists differ: ['doc[72 chars]SON)'] != ['doc[72 chars]SON)', 'THIRD_PARTY_NOTICES.md:3: license refe[27 chars]ist']
-  'JSON)']
?         ^
+  'JSON)',
?         ^
+  'THIRD_PARTY_NOTICES.md:3: license reference "missing" does not exist']
Ran 1 test in 0.003s
FAILED (failures=1)
```

#### I1 ext test_i1_utf8_bom (T-0008 #177-#189) — red

- HEAD: `4bd317690842c9d54b23c217dc8d542aea0b761e`
- test file blob: `ac2c05f06adbb1d39ef4880ddf4ce55d422f5aed`; verifier blob: `626570ab339b057837b11b843d03dd06b498083b`
- command: `python3 -m unittest discover -s scripts -p test_verify_project.py -k test_i1_utf8_bom` (exit 1; `-B`, `scripts/__pycache__` removed first)

```
FAIL: test_i1_utf8_bom (test_verify_project.ProvenanceInputTest.test_i1_utf8_bom)
AssertionError: Lists differ: ['doc[72 chars]SON)'] != ['doc[72 chars]SON)', 'THIRD_PARTY_NOTICES.md:3: license refe[27 chars]ist']
-  'JSON)']
?         ^
+  'JSON)',
?         ^
+  'THIRD_PARTY_NOTICES.md:3: license reference "missing" does not exist']
Ran 1 test in 0.002s
FAILED (failures=1)
```

#### I1 ext test_i1_deep_nesting (T-0008 #177-#189) — red

- HEAD: `4bd317690842c9d54b23c217dc8d542aea0b761e`
- test file blob: `ac2c05f06adbb1d39ef4880ddf4ce55d422f5aed`; verifier blob: `626570ab339b057837b11b843d03dd06b498083b`
- command: `python3 -m unittest discover -s scripts -p test_verify_project.py -k test_i1_deep_nesting` (exit 1; `-B`, `scripts/__pycache__` removed first)

```
FAIL: test_i1_deep_nesting (test_verify_project.ProvenanceInputTest.test_i1_deep_nesting)
AssertionError: Lists differ: ['doc[72 chars]SON)'] != ['doc[72 chars]SON)', 'THIRD_PARTY_NOTICES.md:3: license refe[27 chars]ist']
-  'JSON)']
?         ^
+  'JSON)',
?         ^
+  'THIRD_PARTY_NOTICES.md:3: license reference "missing" does not exist']
Ran 1 test in 0.005s
FAILED (failures=1)
```

#### I1 ext test_i1_long_integer (T-0008 #177-#189) — red

- HEAD: `4bd317690842c9d54b23c217dc8d542aea0b761e`
- test file blob: `ac2c05f06adbb1d39ef4880ddf4ce55d422f5aed`; verifier blob: `626570ab339b057837b11b843d03dd06b498083b`
- command: `python3 -m unittest discover -s scripts -p test_verify_project.py -k test_i1_long_integer` (exit 1; `-B`, `scripts/__pycache__` removed first)

```
FAIL: test_i1_long_integer (test_verify_project.ProvenanceInputTest.test_i1_long_integer)
AssertionError: Lists differ: ['doc[72 chars]SON)'] != ['doc[72 chars]SON)', 'THIRD_PARTY_NOTICES.md:3: license refe[27 chars]ist']
-  'JSON)']
?         ^
+  'JSON)',
?         ^
+  'THIRD_PARTY_NOTICES.md:3: license reference "missing" does not exist']
Ran 1 test in 0.002s
FAILED (failures=1)
```

#### I1 ext test_i1_top_level_array (T-0008 #177-#189) — red

- HEAD: `4bd317690842c9d54b23c217dc8d542aea0b761e`
- test file blob: `ac2c05f06adbb1d39ef4880ddf4ce55d422f5aed`; verifier blob: `626570ab339b057837b11b843d03dd06b498083b`
- command: `python3 -m unittest discover -s scripts -p test_verify_project.py -k test_i1_top_level_array` (exit 1; `-B`, `scripts/__pycache__` removed first)

```
FAIL: test_i1_top_level_array (test_verify_project.ProvenanceInputTest.test_i1_top_level_array)
AssertionError: Lists differ: ['doc[75 chars]ect)'] != ['doc[75 chars]ect)', 'THIRD_PARTY_NOTICES.md:3: license refe[27 chars]ist']
-  'object)']
?           ^
+  'object)',
?           ^
+  'THIRD_PARTY_NOTICES.md:3: license reference "missing" does not exist']
Ran 1 test in 0.003s
FAILED (failures=1)
```


### 2026-10-24 — Red records for #66–#112 (N and R rows), committed with their green

- **Natural red:** #99 (R2 whitespace, the T-0007 handover). It failed until rule 2 learned
  whitespace.
- **Passed on their first run:** the other 46 sub-cases, because the notices reader of the previous
  cycle already recognized links and applied (b). For #66–#79 the table's mutation was used. #80–#112
  had "—" in the table (a natural red was expected), so each mutation recorded below is a deviation,
  named in its label.
- **Test literals:** #88 and #89 first failed because of a backslash error in the test itself; they
  were fixed to raw strings before any record.
- **Deferred until the grammar exists:** #67, #69–#71 and #73 take their red by mutation only once an
  unrecognized `](` is reported; #72 only once code spans are found. Today these mutations leave no
  message, so the tests pass. Their records follow the G rows.
- **Tooling:** several first mutation attempts had wrong anchors (no run) or a wrong `-k` pattern (no
  test ran). Those runs are not records; they were dropped and re-run.

#### #99 R2 whitespace through an angle-bracket destination (T-0007 handover) — red

- HEAD: `262bbf64857040cbba4d06567757294756e39239`
- test file blob: `3681681cdee53ae94c67a04c48b137702cd23d36`; verifier blob: `0d2770d626e813f9b3a60e0477567136d8eda5f8`
- command: `python3 -m unittest discover -s scripts -p test_verify_project.py -k test_r2_whitespace` (exit 1; `-B`, `scripts/__pycache__` removed first)

```
FAIL: test_r2_whitespace (test_verify_project.NoticesReferenceTest.test_r2_whitespace)
AssertionError: Lists differ: [] != ['THIRD_PARTY_NOTICES.md:3: license refere[49 chars]ath']
- []
+ ['THIRD_PARTY_NOTICES.md:3: license reference "docs/my file.md" is not a plain '
+  'repository path']
Ran 1 test in 0.003s
FAILED (failures=1)
```

#### #66 N1 plain link (passed on first run; mutation: report every resolved destination as does not exist) — red

- HEAD: `262bbf64857040cbba4d06567757294756e39239`
- test file blob: `3681681cdee53ae94c67a04c48b137702cd23d36`; verifier blob: `902fbbcfe32e9f3fe496e6a05c2e3f2740fd5c66`
- command: `python3 -m unittest discover -s scripts -p test_verify_project.py -k test_n1_plain` (exit 1; `-B`, `scripts/__pycache__` removed first)

```
FAIL: test_n1_plain (test_verify_project.NoticesReferenceTest.test_n1_plain)
AssertionError: Lists differ: ['THIRD_PARTY_NOTICES.md:1: license refere[174 chars]ist'] != []
+ []
- ['THIRD_PARTY_NOTICES.md:1: license reference "LICENSE" does not exist',
-  'THIRD_PARTY_NOTICES.md:2: license reference "LICENSE-CODE" does not exist',
-  'THIRD_PARTY_NOTICES.md:3: license reference "LICENSE" does not exist']
Ran 1 test in 0.002s
FAILED (failures=1)
```

#### #68 N1 angle-bracket destination (passed on first run; mutation: keep the angle brackets in the destination) — red

- HEAD: `262bbf64857040cbba4d06567757294756e39239`
- test file blob: `3681681cdee53ae94c67a04c48b137702cd23d36`; verifier blob: `d375d1cf351a024418c39560908ad9383f96e162`
- command: `python3 -m unittest discover -s scripts -p test_verify_project.py -k test_n1_angle` (exit 1; `-B`, `scripts/__pycache__` removed first)

```
FAIL: test_n1_angle (test_verify_project.NoticesReferenceTest.test_n1_angle)
AssertionError: Lists differ: ['THIRD_PARTY_NOTICES.md:3: license refere[43 chars]ath'] != []
+ []
- ['THIRD_PARTY_NOTICES.md:3: license reference "<LICENSE>" is not a plain '
-  'repository path']
Ran 1 test in 0.002s
FAILED (failures=1)
```

#### #74 N2 https (passed on first run; mutation: do not skip https) — red

- HEAD: `262bbf64857040cbba4d06567757294756e39239`
- test file blob: `3681681cdee53ae94c67a04c48b137702cd23d36`; verifier blob: `54b06d31fd36b8e15014f85a80e235ce6b340440`
- command: `python3 -m unittest discover -s scripts -p test_verify_project.py -k test_n2_https` (exit 1; `-B`, `scripts/__pycache__` removed first)

```
FAIL: test_n2_https (test_verify_project.NoticesReferenceTest.test_n2_https)
AssertionError: Lists differ: ['THIRD_PARTY_NOTICES.md:3: license refere[53 chars]eme'] != []
+ []
- ['THIRD_PARTY_NOTICES.md:3: license reference "https://example.org" uses an '
-  'unsupported URL scheme']
Ran 1 test in 0.003s
FAILED (failures=1)
```

#### #75 N2 http (passed on first run; mutation: do not skip http) — red

- HEAD: `262bbf64857040cbba4d06567757294756e39239`
- test file blob: `3681681cdee53ae94c67a04c48b137702cd23d36`; verifier blob: `b063333dcafa06819f50ecb1b6ceaf3051372d9b`
- command: `python3 -m unittest discover -s scripts -p test_verify_project.py -k test_n2_http` (exit 1; `-B`, `scripts/__pycache__` removed first)

```
FAIL: test_n2_http (test_verify_project.NoticesReferenceTest.test_n2_http)
AssertionError: Lists differ: ['THIRD_PARTY_NOTICES.md:3: license refere[52 chars]eme'] != []
+ []
- ['THIRD_PARTY_NOTICES.md:3: license reference "http://example.org" uses an '
-  'unsupported URL scheme']
Ran 2 tests in 0.004s
FAILED (failures=1)
```

#### #76 N2 MAILTO (passed on first run; mutation: compare schemes case-sensitively) — red

- HEAD: `262bbf64857040cbba4d06567757294756e39239`
- test file blob: `3681681cdee53ae94c67a04c48b137702cd23d36`; verifier blob: `88d30cb43e5d16c9698cf84525fc70531870fc24`
- command: `python3 -m unittest discover -s scripts -p test_verify_project.py -k test_n2_mailto` (exit 1; `-B`, `scripts/__pycache__` removed first)

```
FAIL: test_n2_mailto_upper (test_verify_project.NoticesReferenceTest.test_n2_mailto_upper)
AssertionError: Lists differ: ['THIRD_PARTY_NOTICES.md:3: license refere[54 chars]eme'] != []
+ []
- ['THIRD_PARTY_NOTICES.md:3: license reference "MAILTO:a@example.org" uses an '
-  'unsupported URL scheme']
Ran 1 test in 0.002s
FAILED (failures=1)
```

#### #77 N2 anchor (passed on first run; mutation: do not skip # destinations) — red

- HEAD: `262bbf64857040cbba4d06567757294756e39239`
- test file blob: `3681681cdee53ae94c67a04c48b137702cd23d36`; verifier blob: `b8b48ad01a93f6a22b47d8c95719d054926beaeb`
- command: `python3 -m unittest discover -s scripts -p test_verify_project.py -k test_n2_anchor` (exit 1; `-B`, `scripts/__pycache__` removed first)

```
FAIL: test_n2_anchor (test_verify_project.NoticesReferenceTest.test_n2_anchor)
AssertionError: Lists differ: ['THIRD_PARTY_NOTICES.md:3: license refere[41 chars]ath'] != []
+ []
- ['THIRD_PARTY_NOTICES.md:3: license reference "#anchor" is not a plain '
-  'repository path']
Ran 1 test in 0.003s
FAILED (failures=1)
```

#### #79 N2 fragment before rule 2 (passed on first run; mutation: apply rule 2 before removing the fragment) — red

- HEAD: `262bbf64857040cbba4d06567757294756e39239`
- test file blob: `3681681cdee53ae94c67a04c48b137702cd23d36`; verifier blob: `0df7cfcc259488c55d1f888a211f0dd888bddf98`
- command: `python3 -m unittest discover -s scripts -p test_verify_project.py -k test_n2_fragment_before` (exit 1; `-B`, `scripts/__pycache__` removed first)

```
FAIL: test_n2_fragment_before_rule2 (test_verify_project.NoticesReferenceTest.test_n2_fragment_before_rule2)
AssertionError: Lists differ: ['THIRD_PARTY_NOTICES.md:3: license refere[47 chars]ath'] != []
+ []
- ['THIRD_PARTY_NOTICES.md:3: license reference "LICENSE#a%20b" is not a plain '
-  'repository path']
Ran 1 test in 0.003s
FAILED (failures=1)
```

#### #81 N3 empty angle (passed on first run; mutation: drop the empty check (deviation)) — red

- HEAD: `262bbf64857040cbba4d06567757294756e39239`
- test file blob: `3681681cdee53ae94c67a04c48b137702cd23d36`; verifier blob: `231dcae898b2303ed353e31bd3afcf5be043ef1e`
- command: `python3 -m unittest discover -s scripts -p test_verify_project.py -k test_n3_empty_angle` (exit 1; `-B`, `scripts/__pycache__` removed first)

```
FAIL: test_n3_empty_angle (test_verify_project.NoticesReferenceTest.test_n3_empty_angle)
AssertionError: Lists differ: ['THI[13 chars]CES.md:3: license reference "" is not a plain repository path'] != ['THI[13 chars]CES.md:3: license reference "" is empty']
First differing element 0:
- ['THIRD_PARTY_NOTICES.md:3: license reference "" is not a plain repository '
?                                                     ^^ ------------------ -
+ ['THIRD_PARTY_NOTICES.md:3: license reference "" is empty']
?                                                     ^^^   +
-  'path']
Ran 1 test in 0.008s
FAILED (failures=1)
```

#### #82 N4 scheme ab:c (passed on first run; mutation: skip every scheme (deviation)) — red

- HEAD: `262bbf64857040cbba4d06567757294756e39239`
- test file blob: `3681681cdee53ae94c67a04c48b137702cd23d36`; verifier blob: `a446b23b2ae3534e549b1f8a471bf21354924230`
- command: `python3 -m unittest discover -s scripts -p test_verify_project.py -k test_n4_scheme` (exit 1; `-B`, `scripts/__pycache__` removed first)

```
FAIL: test_n4_scheme (test_verify_project.NoticesReferenceTest.test_n4_scheme)
AssertionError: Lists differ: [] != ['THIRD_PARTY_NOTICES.md:3: license refere[38 chars]eme']
- []
+ ['THIRD_PARTY_NOTICES.md:3: license reference "ab:c" uses an unsupported URL '
+  'scheme']
Ran 1 test in 0.003s
FAILED (failures=1)
```

#### #83 N4 ftp (passed on first run; mutation: skip every scheme (deviation)) — red

- HEAD: `262bbf64857040cbba4d06567757294756e39239`
- test file blob: `3681681cdee53ae94c67a04c48b137702cd23d36`; verifier blob: `a446b23b2ae3534e549b1f8a471bf21354924230`
- command: `python3 -m unittest discover -s scripts -p test_verify_project.py -k test_n4_ftp` (exit 1; `-B`, `scripts/__pycache__` removed first)

```
FAIL: test_n4_ftp (test_verify_project.NoticesReferenceTest.test_n4_ftp)
AssertionError: Lists differ: [] != ['THIRD_PARTY_NOTICES.md:3: license refere[46 chars]eme']
- []
+ ['THIRD_PARTY_NOTICES.md:3: license reference "ftp://host/x" uses an '
+  'unsupported URL scheme']
Ran 1 test in 0.003s
FAILED (failures=1)
```

#### #84 N4 drive (passed on first run; mutation: treat one-letter schemes as unsupported (deviation)) — red

- HEAD: `262bbf64857040cbba4d06567757294756e39239`
- test file blob: `3681681cdee53ae94c67a04c48b137702cd23d36`; verifier blob: `b7a493b893bd6610e507fe0c8e0708b137a8153e`
- command: `python3 -m unittest discover -s scripts -p test_verify_project.py -k test_n4_drive` (exit 1; `-B`, `scripts/__pycache__` removed first)

```
FAIL: test_n4_drive (test_verify_project.NoticesReferenceTest.test_n4_drive)
AssertionError: Lists differ: ['THI[16 chars].md:3: license reference "C:x" uses an unsupported URL scheme'] != ['THI[16 chars].md:3: license reference "C:x" is outside the repository']
First differing element 0:
- ['THIRD_PARTY_NOTICES.md:3: license reference "C:x" uses an unsupported URL '
?                                                        ^^^^^^^^^^   ^^^^^^^^
+ ['THIRD_PARTY_NOTICES.md:3: license reference "C:x" is outside the repository']
?                                                     ++++ + ++ ^^^^^^^  ++++ ^ +
-  'scheme']
Ran 1 test in 0.003s
FAILED (failures=1)
```

#### #85 N5 fragment in the message (passed on first run; mutation: print the destination without its fragment (deviation)) — red

- HEAD: `262bbf64857040cbba4d06567757294756e39239`
- test file blob: `3681681cdee53ae94c67a04c48b137702cd23d36`; verifier blob: `144c0fcfef4781ae4301436919f27b67011b122c`
- command: `python3 -m unittest discover -s scripts -p test_verify_project.py -k test_n5` (exit 1; `-B`, `scripts/__pycache__` removed first)

```
FAIL: test_n5_fragment_in_message (test_verify_project.NoticesReferenceTest.test_n5_fragment_in_message)
AssertionError: Lists differ: ['THI[40 chars] "docs/Missing.md" differs in case from "docs/missing.md"'] != ['THI[40 chars] "docs/Missing.md#top" differs in case from "docs/missing.md"']
First differing element 0:
- ['THIRD_PARTY_NOTICES.md:3: license reference "docs/Missing.md" differs in '
+ ['THIRD_PARTY_NOTICES.md:3: license reference "docs/Missing.md#top" differs in '
?                                                               ++++
Ran 1 test in 0.003s
FAILED (failures=1)
```

#### #87 R1 absolute (passed on first run; mutation: drop path rule 1 (deviation)) — red

- HEAD: `262bbf64857040cbba4d06567757294756e39239`
- test file blob: `3681681cdee53ae94c67a04c48b137702cd23d36`; verifier blob: `5e77c2a7e25e81d980f3c910c66c86efd1a8a7f1`
- command: `python3 -m unittest discover -s scripts -p test_verify_project.py -k test_r1_absolute` (exit 1; `-B`, `scripts/__pycache__` removed first)

```
FAIL: test_r1_absolute (test_verify_project.NoticesReferenceTest.test_r1_absolute)
AssertionError: Lists differ: ['THI[21 chars]: license reference "/LICENSE" is not a plain repository path'] != ['THI[21 chars]: license reference "/LICENSE" is outside the repository']
First differing element 0:
- ['THIRD_PARTY_NOTICES.md:3: license reference "/LICENSE" is not a plain '
?                                                             -  ^^^^^^ ^
+ ['THIRD_PARTY_NOTICES.md:3: license reference "/LICENSE" is outside the '
?                                                              + ^ ^^^^^^
-  'repository path']
?             -----
+  'repository']
Ran 1 test in 0.003s
FAILED (failures=1)
```

#### #88 R1 leading backslash (passed on first run; mutation: drop path rule 1 (deviation)) — red

- HEAD: `262bbf64857040cbba4d06567757294756e39239`
- test file blob: `3681681cdee53ae94c67a04c48b137702cd23d36`; verifier blob: `5e77c2a7e25e81d980f3c910c66c86efd1a8a7f1`
- command: `python3 -m unittest discover -s scripts -p test_verify_project.py -k test_r1_leading` (exit 1; `-B`, `scripts/__pycache__` removed first)

```
FAIL: test_r1_leading_backslash (test_verify_project.NoticesReferenceTest.test_r1_leading_backslash)
AssertionError: Lists differ: ['THI[19 chars]:3: license reference "\\\\LICENSE" does not exist'] != ['THI[19 chars]:3: license reference "\\\\LICENSE" is outside the repository']
First differing element 0:
- ['THIRD_PARTY_NOTICES.md:3: license reference "\\\\LICENSE" does not exist']
?                                                             -----------    -
+ ['THIRD_PARTY_NOTICES.md:3: license reference "\\\\LICENSE" is outside the '
?                                                               +++ +++++++++
+  'repository']
Ran 1 test in 0.003s
FAILED (failures=1)
```

#### #89 R1 inner backslash (passed on first run; mutation: drop path rule 1 (deviation)) — red

- HEAD: `262bbf64857040cbba4d06567757294756e39239`
- test file blob: `3681681cdee53ae94c67a04c48b137702cd23d36`; verifier blob: `5e77c2a7e25e81d980f3c910c66c86efd1a8a7f1`
- command: `python3 -m unittest discover -s scripts -p test_verify_project.py -k test_r1_inner` (exit 1; `-B`, `scripts/__pycache__` removed first)

```
FAIL: test_r1_inner_backslash (test_verify_project.NoticesReferenceTest.test_r1_inner_backslash)
AssertionError: Lists differ: ['THI[20 chars]3: license reference "a\\\\LICENSE" does not exist'] != ['THI[20 chars]3: license reference "a\\\\LICENSE" is outside the repository']
First differing element 0:
- ['THIRD_PARTY_NOTICES.md:3: license reference "a\\\\LICENSE" does not exist']
?                                                              -----------    -
+ ['THIRD_PARTY_NOTICES.md:3: license reference "a\\\\LICENSE" is outside the '
?                                                                +++ +++++++++
+  'repository']
Ran 1 test in 0.003s
FAILED (failures=1)
```

#### #91 R1 parent inside (passed on first run; mutation: drop path rule 1 (deviation)) — red

- HEAD: `262bbf64857040cbba4d06567757294756e39239`
- test file blob: `3681681cdee53ae94c67a04c48b137702cd23d36`; verifier blob: `5e77c2a7e25e81d980f3c910c66c86efd1a8a7f1`
- command: `python3 -m unittest discover -s scripts -p test_verify_project.py -k test_r1_parent_inside` (exit 1; `-B`, `scripts/__pycache__` removed first)

```
FAIL: test_r1_parent_inside (test_verify_project.NoticesReferenceTest.test_r1_parent_inside)
AssertionError: Lists differ: ['THI[20 chars]3: license reference "a/../LICENSE" does not exist'] != ['THI[20 chars]3: license reference "a/../LICENSE" is outside the repository']
First differing element 0:
- ['THIRD_PARTY_NOTICES.md:3: license reference "a/../LICENSE" does not exist']
?                                                              -----------    -
+ ['THIRD_PARTY_NOTICES.md:3: license reference "a/../LICENSE" is outside the '
?                                                                +++ +++++++++
+  'repository']
Ran 1 test in 0.003s
FAILED (failures=1)
```

#### #92 R1 network path (passed on first run; mutation: drop path rule 1 (deviation)) — red

- HEAD: `262bbf64857040cbba4d06567757294756e39239`
- test file blob: `3681681cdee53ae94c67a04c48b137702cd23d36`; verifier blob: `5e77c2a7e25e81d980f3c910c66c86efd1a8a7f1`
- command: `python3 -m unittest discover -s scripts -p test_verify_project.py -k test_r1_network` (exit 1; `-B`, `scripts/__pycache__` removed first)

```
FAIL: test_r1_network (test_verify_project.NoticesReferenceTest.test_r1_network)
AssertionError: Lists differ: ['THI[21 chars]: license reference "//host/x" is not a plain repository path'] != ['THI[21 chars]: license reference "//host/x" is outside the repository']
First differing element 0:
- ['THIRD_PARTY_NOTICES.md:3: license reference "//host/x" is not a plain '
?                                                             -  ^^^^^^ ^
+ ['THIRD_PARTY_NOTICES.md:3: license reference "//host/x" is outside the '
?                                                              + ^ ^^^^^^
-  'repository path']
?             -----
+  'repository']
Ran 1 test in 0.002s
FAILED (failures=1)
```

#### #93 R1 rule 1 before rule 2 (passed on first run; mutation: drop path rule 1 (deviation)) — red

- HEAD: `262bbf64857040cbba4d06567757294756e39239`
- test file blob: `3681681cdee53ae94c67a04c48b137702cd23d36`; verifier blob: `5e77c2a7e25e81d980f3c910c66c86efd1a8a7f1`
- command: `python3 -m unittest discover -s scripts -p test_verify_project.py -k test_r1_before_rule2` (exit 1; `-B`, `scripts/__pycache__` removed first)

```
FAIL: test_r1_before_rule2 (test_verify_project.NoticesReferenceTest.test_r1_before_rule2)
AssertionError: Lists differ: ['THI[21 chars]: license reference "../a%20b" is not a plain repository path'] != ['THI[21 chars]: license reference "../a%20b" is outside the repository']
First differing element 0:
- ['THIRD_PARTY_NOTICES.md:3: license reference "../a%20b" is not a plain '
?                                                             -  ^^^^^^ ^
+ ['THIRD_PARTY_NOTICES.md:3: license reference "../a%20b" is outside the '
?                                                              + ^ ^^^^^^
-  'repository path']
?             -----
+  'repository']
Ran 1 test in 0.003s
FAILED (failures=1)
```

#### #94 R2 percent (passed on first run; mutation: drop path rule 2 (deviation)) — red

- HEAD: `262bbf64857040cbba4d06567757294756e39239`
- test file blob: `3681681cdee53ae94c67a04c48b137702cd23d36`; verifier blob: `9f935d4c4e95f8f3b316fe06b8398df99b1c45c1`
- command: `python3 -m unittest discover -s scripts -p test_verify_project.py -k test_r2_percent` (exit 1; `-B`, `scripts/__pycache__` removed first)

```
FAIL: test_r2_percent (test_verify_project.NoticesReferenceTest.test_r2_percent)
AssertionError: Lists differ: [] != ['THIRD_PARTY_NOTICES.md:3: license refere[42 chars]ath']
- []
+ ['THIRD_PARTY_NOTICES.md:3: license reference "a%20b.md" is not a plain '
+  'repository path']
Ran 1 test in 0.002s
FAILED (failures=1)
```

#### #95 R2 query (passed on first run; mutation: drop path rule 2 (deviation)) — red

- HEAD: `262bbf64857040cbba4d06567757294756e39239`
- test file blob: `3681681cdee53ae94c67a04c48b137702cd23d36`; verifier blob: `9f935d4c4e95f8f3b316fe06b8398df99b1c45c1`
- command: `python3 -m unittest discover -s scripts -p test_verify_project.py -k test_r2_query` (exit 1; `-B`, `scripts/__pycache__` removed first)

```
FAIL: test_r2_query (test_verify_project.NoticesReferenceTest.test_r2_query)
AssertionError: Lists differ: ['THI[28 chars]se reference "LICENSE?plain=1" does not exist'] != ['THI[28 chars]se reference "LICENSE?plain=1" is not a plain repository path']
First differing element 0:
- ['THIRD_PARTY_NOTICES.md:3: license reference "LICENSE?plain=1" does not exist']
?                                                                 ^^^      ^^ ^^ -
+ ['THIRD_PARTY_NOTICES.md:3: license reference "LICENSE?plain=1" is not a plain '
?                                                                 ^      ^^^^^ ^^
+  'repository path']
Ran 1 test in 0.003s
FAILED (failures=1)
```

#### #96 R2 dot segment (passed on first run; mutation: drop path rule 2 (deviation)) — red

- HEAD: `262bbf64857040cbba4d06567757294756e39239`
- test file blob: `3681681cdee53ae94c67a04c48b137702cd23d36`; verifier blob: `9f935d4c4e95f8f3b316fe06b8398df99b1c45c1`
- command: `python3 -m unittest discover -s scripts -p test_verify_project.py -k test_r2_dot` (exit 1; `-B`, `scripts/__pycache__` removed first)

```
FAIL: test_r2_dot_segment (test_verify_project.NoticesReferenceTest.test_r2_dot_segment)
AssertionError: Lists differ: ['THI[22 chars] license reference "./LICENSE" does not exist'] != ['THI[22 chars] license reference "./LICENSE" is not a plain repository path']
First differing element 0:
- ['THIRD_PARTY_NOTICES.md:3: license reference "./LICENSE" does not exist']
?                                                           ^^^      ^^ ^^ -
+ ['THIRD_PARTY_NOTICES.md:3: license reference "./LICENSE" is not a plain '
?                                                           ^      ^^^^^ ^^
+  'repository path']
Ran 1 test in 0.002s
FAILED (failures=1)
```

#### #97 R2 empty segment (passed on first run; mutation: drop path rule 2 (deviation)) — red

- HEAD: `262bbf64857040cbba4d06567757294756e39239`
- test file blob: `3681681cdee53ae94c67a04c48b137702cd23d36`; verifier blob: `9f935d4c4e95f8f3b316fe06b8398df99b1c45c1`
- command: `python3 -m unittest discover -s scripts -p test_verify_project.py -k test_r2_empty_segment` (exit 1; `-B`, `scripts/__pycache__` removed first)

```
FAIL: test_r2_empty_segment (test_verify_project.NoticesReferenceTest.test_r2_empty_segment)
AssertionError: Lists differ: ['THI[17 chars]md:3: license reference "a//b" does not exist'] != ['THI[17 chars]md:3: license reference "a//b" is not a plain repository path']
First differing element 0:
- ['THIRD_PARTY_NOTICES.md:3: license reference "a//b" does not exist']
?                                                      ^^^       ^ -  -
+ ['THIRD_PARTY_NOTICES.md:3: license reference "a//b" is not a plain repository '
?                                                      ^      +++++++++ ^^^  ++++
+  'path']
Ran 1 test in 0.003s
FAILED (failures=1)
```

#### #98 R2 trailing slash (passed on first run; mutation: drop path rule 2 (deviation)) — red

- HEAD: `262bbf64857040cbba4d06567757294756e39239`
- test file blob: `3681681cdee53ae94c67a04c48b137702cd23d36`; verifier blob: `9f935d4c4e95f8f3b316fe06b8398df99b1c45c1`
- command: `python3 -m unittest discover -s scripts -p test_verify_project.py -k test_r2_trailing` (exit 1; `-B`, `scripts/__pycache__` removed first)

```
FAIL: test_r2_trailing_slash (test_verify_project.NoticesReferenceTest.test_r2_trailing_slash)
AssertionError: Lists differ: ['THI[18 chars]d:3: license reference "docs/" does not exist'] != ['THI[18 chars]d:3: license reference "docs/" is not a plain repository path']
First differing element 0:
- ['THIRD_PARTY_NOTICES.md:3: license reference "docs/" does not exist']
?                                                       ^^^      ^^ ^^ -
+ ['THIRD_PARTY_NOTICES.md:3: license reference "docs/" is not a plain '
?                                                       ^      ^^^^^ ^^
+  'repository path']
Ran 1 test in 0.003s
FAILED (failures=1)
```

#### #100 R3 missing (passed on first run; mutation: accept a missing segment (deviation)) — red

- HEAD: `262bbf64857040cbba4d06567757294756e39239`
- test file blob: `3681681cdee53ae94c67a04c48b137702cd23d36`; verifier blob: `42fd32e05e08d81f8839b5670a1ac22d42693865`
- command: `python3 -m unittest discover -s scripts -p test_verify_project.py -k test_r3_missing` (exit 1; `-B`, `scripts/__pycache__` removed first)

```
FAIL: test_r3_missing (test_verify_project.NoticesReferenceTest.test_r3_missing)
AssertionError: Lists differ: [] != ['THIRD_PARTY_NOTICES.md:3: license reference "missing" does not exist']
- []
+ ['THIRD_PARTY_NOTICES.md:3: license reference "missing" does not exist']
Ran 1 test in 0.002s
FAILED (failures=1)
```

#### #101 R3 below a file (passed on first run; mutation: let resolution errors propagate (deviation)) — red

- HEAD: `262bbf64857040cbba4d06567757294756e39239`
- test file blob: `3681681cdee53ae94c67a04c48b137702cd23d36`; verifier blob: `c764a7a91312ada21b8c1cdfc765e2bb43b2f72f`
- command: `python3 -m unittest discover -s scripts -p test_verify_project.py -k test_r3_below` (exit 1; `-B`, `scripts/__pycache__` removed first)

```
ERROR: test_r3_below_a_file (test_verify_project.NoticesReferenceTest.test_r3_below_a_file)
NotADirectoryError: [Errno 20] Not a directory: '/private/var/folders/z3/gp_vxt9j4vv4gmf09pmkprvr0000gn/T/tmpstrtz_c2/LICENSE'
Ran 1 test in 0.003s
FAILED (errors=1)
```

#### #102 R3 three dots (passed on first run; mutation: accept a missing segment (deviation)) — red

- HEAD: `262bbf64857040cbba4d06567757294756e39239`
- test file blob: `3681681cdee53ae94c67a04c48b137702cd23d36`; verifier blob: `42fd32e05e08d81f8839b5670a1ac22d42693865`
- command: `python3 -m unittest discover -s scripts -p test_verify_project.py -k test_r3_three` (exit 1; `-B`, `scripts/__pycache__` removed first)

```
FAIL: test_r3_three_dots (test_verify_project.NoticesReferenceTest.test_r3_three_dots)
AssertionError: Lists differ: [] != ['THIRD_PARTY_NOTICES.md:3: license reference ".../LICENSE" does not exist']
- []
+ ['THIRD_PARTY_NOTICES.md:3: license reference ".../LICENSE" does not exist']
Ran 1 test in 0.002s
FAILED (failures=1)
```

#### #103 R4 case (passed on first run; mutation: report a case-only match as does not exist (deviation)) — red

- HEAD: `262bbf64857040cbba4d06567757294756e39239`
- test file blob: `3681681cdee53ae94c67a04c48b137702cd23d36`; verifier blob: `832e8cd9f915f7ff0f427663c14d5ce9c7a44c16`
- command: `python3 -m unittest discover -s scripts -p test_verify_project.py -k test_r4_case` (exit 1; `-B`, `scripts/__pycache__` removed first)

```
FAIL: test_r4_case (test_verify_project.NoticesReferenceTest.test_r4_case)
AssertionError: Lists differ: ['THI[20 chars]3: license reference "license" does not exist'] != ['THI[20 chars]3: license reference "license" differs in case from "LICENSE"']
First differing element 0:
- ['THIRD_PARTY_NOTICES.md:3: license reference "license" does not exist']
?                                                           ^^^^^^^^^^^^ -
+ ['THIRD_PARTY_NOTICES.md:3: license reference "license" differs in case from '
?                                                          +++++++++++++++++ ^^
+  '"LICENSE"']
Ran 1 test in 0.003s
FAILED (failures=1)
```

#### #104 R4 directory case (passed on first run; mutation: report a case-only match as does not exist (deviation)) — red

- HEAD: `262bbf64857040cbba4d06567757294756e39239`
- test file blob: `3681681cdee53ae94c67a04c48b137702cd23d36`; verifier blob: `832e8cd9f915f7ff0f427663c14d5ce9c7a44c16`
- command: `python3 -m unittest discover -s scripts -p test_verify_project.py -k test_r4_directory` (exit 1; `-B`, `scripts/__pycache__` removed first)

```
FAIL: test_r4_directory_case (test_verify_project.NoticesReferenceTest.test_r4_directory_case)
AssertionError: Lists differ: ['THI[19 chars]:3: license reference "Docs/x.md" does not exist'] != ['THI[19 chars]:3: license reference "Docs/x.md" differs in case from "docs"']
First differing element 0:
- ['THIRD_PARTY_NOTICES.md:3: license reference "Docs/x.md" does not exist']
?                                                             ^^^^^^^^^^^^ -
+ ['THIRD_PARTY_NOTICES.md:3: license reference "Docs/x.md" differs in case from '
?                                                            +++++++++++++++++ ^^
+  '"docs"']
Ran 1 test in 0.003s
FAILED (failures=1)
```

#### #108 R5 symlink case (passed on first run; mutation: report a symlink found by a case-only match (deviation)) — red

- HEAD: `262bbf64857040cbba4d06567757294756e39239`
- test file blob: `3681681cdee53ae94c67a04c48b137702cd23d36`; verifier blob: `3206cce284ff3ed879968fd88e2d8f692d892586`
- command: `python3 -m unittest discover -s scripts -p test_verify_project.py -k test_r5_symlink_case` (exit 1; `-B`, `scripts/__pycache__` removed first)

```
FAIL: test_r5_symlink_case (test_verify_project.NoticesReferenceTest.test_r5_symlink_case)
AssertionError: Lists differ: ['THI[21 chars]: license reference "LINK" passes through a symlink at "link"'] != ['THI[21 chars]: license reference "LINK" differs in case from "link"']
First differing element 0:
- ['THIRD_PARTY_NOTICES.md:3: license reference "LINK" passes through a symlink '
?                                                      ^  - ^^^^  -------- ----
+ ['THIRD_PARTY_NOTICES.md:3: license reference "LINK" differs in case from '
?                                                      ^^^^^^^^^^^^   ^^
-  'at "link"']
?   ---
+  '"link"']
Ran 1 test in 0.003s
FAILED (failures=1)
```

#### #109 R6 directory (passed on first run; mutation: drop the regular-file check (deviation)) — red

- HEAD: `262bbf64857040cbba4d06567757294756e39239`
- test file blob: `3681681cdee53ae94c67a04c48b137702cd23d36`; verifier blob: `5f5b07888ddb13cbc70f52b2036715c4608f3f89`
- command: `python3 -m unittest discover -s scripts -p test_verify_project.py -k test_r6_directory` (exit 1; `-B`, `scripts/__pycache__` removed first)

```
FAIL: test_r6_directory (test_verify_project.NoticesReferenceTest.test_r6_directory)
AssertionError: Lists differ: [] != ['THIRD_PARTY_NOTICES.md:3: license reference "adir" is not a regular file']
- []
+ ['THIRD_PARTY_NOTICES.md:3: license reference "adir" is not a regular file']
Ran 1 test in 0.002s
FAILED (failures=1)
```

#### #110 R6 FIFO (passed on first run; mutation: drop the regular-file check (deviation)) — red

- HEAD: `262bbf64857040cbba4d06567757294756e39239`
- test file blob: `3681681cdee53ae94c67a04c48b137702cd23d36`; verifier blob: `5f5b07888ddb13cbc70f52b2036715c4608f3f89`
- command: `python3 -m unittest discover -s scripts -p test_verify_project.py -k test_r6_fifo` (exit 1; `-B`, `scripts/__pycache__` removed first)

```
FAIL: test_r6_fifo (test_verify_project.NoticesReferenceTest.test_r6_fifo)
AssertionError: Lists differ: [] != ['THIRD_PARTY_NOTICES.md:3: license reference "fifo" is not a regular file']
- []
+ ['THIRD_PARTY_NOTICES.md:3: license reference "fifo" is not a regular file']
Ran 1 test in 0.002s
FAILED (failures=1)
```

#### #111 R7 unlistable (passed on first run; mutation: let resolution errors propagate (deviation)) — red

- HEAD: `262bbf64857040cbba4d06567757294756e39239`
- test file blob: `3681681cdee53ae94c67a04c48b137702cd23d36`; verifier blob: `c764a7a91312ada21b8c1cdfc765e2bb43b2f72f`
- command: `python3 -m unittest discover -s scripts -p test_verify_project.py -k test_r7_unlistable` (exit 1; `-B`, `scripts/__pycache__` removed first)

```
ERROR: test_r7_unlistable (test_verify_project.NoticesReferenceTest.test_r7_unlistable)
PermissionError: [Errno 13] Permission denied: '/private/var/folders/z3/gp_vxt9j4vv4gmf09pmkprvr0000gn/T/tmp51v3mx76/sub'
Ran 1 test in 0.003s
FAILED (errors=1)
```

#### #112 R7 unsearchable (passed on first run; mutation: let resolution errors propagate (deviation)) — red

- HEAD: `262bbf64857040cbba4d06567757294756e39239`
- test file blob: `3681681cdee53ae94c67a04c48b137702cd23d36`; verifier blob: `c764a7a91312ada21b8c1cdfc765e2bb43b2f72f`
- command: `python3 -m unittest discover -s scripts -p test_verify_project.py -k test_r7_unsearchable` (exit 1; `-B`, `scripts/__pycache__` removed first)

```
ERROR: test_r7_unsearchable (test_verify_project.NoticesReferenceTest.test_r7_unsearchable)
PermissionError: [Errno 13] Permission denied: '/private/var/folders/z3/gp_vxt9j4vv4gmf09pmkprvr0000gn/T/tmpzy08fvmf/sub/LICENSE'
Ran 1 test in 0.003s
FAILED (errors=1)
```

#### #78 N2 fragment (passed on first run; mutation: keep the fragment) — red

- HEAD: `262bbf64857040cbba4d06567757294756e39239`
- test file blob: `3681681cdee53ae94c67a04c48b137702cd23d36`; verifier blob: `6aa41ae903f73b7d078bf82e4a7db7c6cb6b1276`
- command: `python3 -m unittest discover -s scripts -p test_verify_project.py -k *test_n2_fragment` (exit 1; `-B`, `scripts/__pycache__` removed first)

```
FAIL: test_n2_fragment (test_verify_project.NoticesReferenceTest.test_n2_fragment)
AssertionError: Lists differ: ['THIRD_PARTY_NOTICES.md:3: license reference "LICENSE#section" does not exist'] != []
- ['THIRD_PARTY_NOTICES.md:3: license reference "LICENSE#section" does not exist']
+ []
Ran 1 test in 0.003s
FAILED (failures=1)
```

#### #80 N3 empty (passed on first run; mutation: drop the empty check (deviation: the table expected a natural red)) — red

- HEAD: `262bbf64857040cbba4d06567757294756e39239`
- test file blob: `3681681cdee53ae94c67a04c48b137702cd23d36`; verifier blob: `231dcae898b2303ed353e31bd3afcf5be043ef1e`
- command: `python3 -m unittest discover -s scripts -p test_verify_project.py -k *test_n3_empty` (exit 1; `-B`, `scripts/__pycache__` removed first)

```
FAIL: test_n3_empty (test_verify_project.NoticesReferenceTest.test_n3_empty)
AssertionError: Lists differ: ['THI[13 chars]CES.md:3: license reference "" is not a plain repository path'] != ['THI[13 chars]CES.md:3: license reference "" is empty']
First differing element 0:
- ['THIRD_PARTY_NOTICES.md:3: license reference "" is not a plain repository '
?                                                     ^^ ------------------ -
+ ['THIRD_PARTY_NOTICES.md:3: license reference "" is empty']
?                                                     ^^^   +
-  'path']
Ran 1 test in 0.004s
FAILED (failures=1)
```

#### #90 R1 parent (passed on first run; mutation: drop path rule 1 (deviation)) — red

- HEAD: `262bbf64857040cbba4d06567757294756e39239`
- test file blob: `3681681cdee53ae94c67a04c48b137702cd23d36`; verifier blob: `5e77c2a7e25e81d980f3c910c66c86efd1a8a7f1`
- command: `python3 -m unittest discover -s scripts -p test_verify_project.py -k *test_r1_parent` (exit 1; `-B`, `scripts/__pycache__` removed first)

```
FAIL: test_r1_parent (test_verify_project.NoticesReferenceTest.test_r1_parent)
AssertionError: Lists differ: ['THI[18 chars]d:3: license reference "../LICENSE" does not exist'] != ['THI[18 chars]d:3: license reference "../LICENSE" is outside the repository']
First differing element 0:
- ['THIRD_PARTY_NOTICES.md:3: license reference "../LICENSE" does not exist']
?                                                            -----------    -
+ ['THIRD_PARTY_NOTICES.md:3: license reference "../LICENSE" is outside the '
?                                                              +++ +++++++++
+  'repository']
Ran 1 test in 0.003s
FAILED (failures=1)
```

#### #105 R4 normalization (passed on first run; mutation: drop NFC normalization of the listed names (deviation)) — red

- HEAD: `262bbf64857040cbba4d06567757294756e39239`
- test file blob: `3681681cdee53ae94c67a04c48b137702cd23d36`; verifier blob: `8cffd7a31f1ffcd55c614362a026c2c9b7bc6a9a`
- command: `python3 -m unittest discover -s scripts -p test_verify_project.py -k test_r4_normalization` (exit 1; `-B`, `scripts/__pycache__` removed first)

```
FAIL: test_r4_normalization (test_verify_project.NoticesReferenceTest.test_r4_normalization)
AssertionError: Lists differ: ['THI[15 chars]S.md:3: license reference "é.md" does not exist'] != ['THI[15 chars]S.md:3: license reference "é.md" differs in case from "é.md"']
First differing element 0:
- ['THIRD_PARTY_NOTICES.md:3: license reference "é.md" does not exist']
?                                                        ^^^^^^^^^^^^ -
+ ['THIRD_PARTY_NOTICES.md:3: license reference "é.md" differs in case from '
?                                                       +++++++++++++++++ ^^
+  '"é.md"']
Ran 1 test in 0.003s
FAILED (failures=1)
```

#### #106 R5 final symlink (passed on first run; mutation: use os.stat instead of os.lstat (deviation)) — red

- HEAD: `262bbf64857040cbba4d06567757294756e39239`
- test file blob: `3681681cdee53ae94c67a04c48b137702cd23d36`; verifier blob: `8e19ca9047454dba32da58133b791aee11c7035c`
- command: `python3 -m unittest discover -s scripts -p test_verify_project.py -k test_r5_final` (exit 1; `-B`, `scripts/__pycache__` removed first)

```
FAIL: test_r5_final_symlink (test_verify_project.NoticesReferenceTest.test_r5_final_symlink)
AssertionError: Lists differ: [] != ['THIRD_PARTY_NOTICES.md:3: license refere[42 chars]nk"']
- []
+ ['THIRD_PARTY_NOTICES.md:3: license reference "link" passes through a symlink '
+  'at "link"']
Ran 1 test in 0.003s
FAILED (failures=1)
```

#### #107 R5 parent symlink (passed on first run; mutation: use os.stat instead of os.lstat (deviation)) — red

- HEAD: `262bbf64857040cbba4d06567757294756e39239`
- test file blob: `3681681cdee53ae94c67a04c48b137702cd23d36`; verifier blob: `8e19ca9047454dba32da58133b791aee11c7035c`
- command: `python3 -m unittest discover -s scripts -p test_verify_project.py -k test_r5_parent` (exit 1; `-B`, `scripts/__pycache__` removed first)

```
FAIL: test_r5_parent_symlink (test_verify_project.NoticesReferenceTest.test_r5_parent_symlink)
AssertionError: Lists differ: [] != ['THIRD_PARTY_NOTICES.md:3: license refere[48 chars]ub"']
- []
+ ['THIRD_PARTY_NOTICES.md:3: license reference "sub/LICENSE" passes through a '
+  'symlink at "sub"']
Ran 1 test in 0.003s
FAILED (failures=1)
```

#### #86 N6 line number (passed on first run; mutation: count lines from 0 (deviation)) — red

- HEAD: `262bbf64857040cbba4d06567757294756e39239`
- test file blob: `3681681cdee53ae94c67a04c48b137702cd23d36`; verifier blob: `d5eb836f0dd31fa5ab9f35239b1967d84f4a03dc`
- command: `python3 -m unittest discover -s scripts -p test_verify_project.py -k test_n6` (exit 1; `-B`, `scripts/__pycache__` removed first)

```
FAIL: test_n6_line_number (test_verify_project.NoticesReferenceTest.test_n6_line_number)
AssertionError: Lists differ: ['THIRD_PARTY_NOTICES.md:3: license reference "missing" does not exist'] != ['THIRD_PARTY_NOTICES.md:4: license reference "missing" does not exist']
First differing element 0:
- ['THIRD_PARTY_NOTICES.md:3: license reference "missing" does not exist']
?                          ^
+ ['THIRD_PARTY_NOTICES.md:4: license reference "missing" does not exist']
?                          ^
Ran 1 test in 0.003s
FAILED (failures=1)
```


### 2026-10-24 — Red records for #113–#176 (G and C rows) and the deferred #67, #69–#73, committed with their green

- **Written before the code.** Tests were written before the (c) and grammar code this time, so 52
  sub-cases have natural reds:
  - #164–#166 and #170–#176 (C rows);
  - #113–#145, #151, #152, #154, #155, #157–#160 and #163 (G rows).

  The G1 rows also failed first, because links inside code spans and fences were still checked.
- **#166 (C2)** stayed red after (c) until code spans and fences were skipped; it turned green with
  the grammar.
- **Passed on their first run and took the table's mutation:**
  - #167–#169 (C3);
  - #146–#150 (G5);
  - #156, #161 and #162.

  #153 (G7) also passed on its first run, because a recognized link's title is never scanned
  again. Its table entry was "—", so the mutation used, "scan the title again", is a deviation.
- **The deferred N1 reds** (#67, #69–#73) were taken here, once an unrecognized `](` was reported
  and code spans were found.

#### #164 C1 no LICENSE link — red

- HEAD: `2c6dc76a1ebec42cfe81a8f0ddef1c9f4a25ebf3`
- test file blob: `6a468749098e0c85c0503c0977a3b1cfd1434da3`; verifier blob: `850135bacc3a818887175b2fd73a43e8d6d21b96`
- command: `python3 -m unittest discover -s scripts -p test_verify_project.py -k test_c1_no_license_link` (exit 1; `-B`, `scripts/__pycache__` removed first)

```
FAIL: test_c1_no_license_link (test_verify_project.RequiredLinkTest.test_c1_no_license_link)
AssertionError: Lists differ: [] != ['THIRD_PARTY_NOTICES.md: no inline link [CC BY-SA 4.0](LICENSE)']
- []
+ ['THIRD_PARTY_NOTICES.md: no inline link [CC BY-SA 4.0](LICENSE)']
Ran 1 test in 0.002s
FAILED (failures=1)
```

#### #165 C1 no LICENSE-CODE link — red

- HEAD: `2c6dc76a1ebec42cfe81a8f0ddef1c9f4a25ebf3`
- test file blob: `6a468749098e0c85c0503c0977a3b1cfd1434da3`; verifier blob: `850135bacc3a818887175b2fd73a43e8d6d21b96`
- command: `python3 -m unittest discover -s scripts -p test_verify_project.py -k test_c1_no_license_code` (exit 1; `-B`, `scripts/__pycache__` removed first)

```
FAIL: test_c1_no_license_code_link (test_verify_project.RequiredLinkTest.test_c1_no_license_code_link)
AssertionError: Lists differ: [] != ['THIRD_PARTY_NOTICES.md: no inline link [MIT](LICENSE-CODE)']
- []
+ ['THIRD_PARTY_NOTICES.md: no inline link [MIT](LICENSE-CODE)']
Ran 1 test in 0.002s
FAILED (failures=1)
```

#### #166 C2 only in skipped regions — red

- HEAD: `2c6dc76a1ebec42cfe81a8f0ddef1c9f4a25ebf3`
- test file blob: `6a468749098e0c85c0503c0977a3b1cfd1434da3`; verifier blob: `850135bacc3a818887175b2fd73a43e8d6d21b96`
- command: `python3 -m unittest discover -s scripts -p test_verify_project.py -k test_c2` (exit 1; `-B`, `scripts/__pycache__` removed first)

```
FAIL: test_c2_only_in_skipped_regions (test_verify_project.RequiredLinkTest.test_c2_only_in_skipped_regions)
AssertionError: Lists differ: [] != ['THIRD_PARTY_NOTICES.md: no inline link [[81 chars]DE)']
- []
+ ['THIRD_PARTY_NOTICES.md: no inline link [CC BY-SA 4.0](LICENSE)',
+  'THIRD_PARTY_NOTICES.md: no inline link [MIT](LICENSE-CODE)']
Ran 1 test in 0.002s
FAILED (failures=1)
```

#### #170 C4 wrong text — red

- HEAD: `2c6dc76a1ebec42cfe81a8f0ddef1c9f4a25ebf3`
- test file blob: `6a468749098e0c85c0503c0977a3b1cfd1434da3`; verifier blob: `850135bacc3a818887175b2fd73a43e8d6d21b96`
- command: `python3 -m unittest discover -s scripts -p test_verify_project.py -k test_c4_wrong` (exit 1; `-B`, `scripts/__pycache__` removed first)

```
FAIL: test_c4_wrong_text (test_verify_project.RequiredLinkTest.test_c4_wrong_text)
AssertionError: Lists differ: [] != ['THIRD_PARTY_NOTICES.md: no inline link [CC BY-SA 4.0](LICENSE)']
- []
+ ['THIRD_PARTY_NOTICES.md: no inline link [CC BY-SA 4.0](LICENSE)']
Ran 1 test in 0.002s
FAILED (failures=1)
```

#### #171 C4 swapped — red

- HEAD: `2c6dc76a1ebec42cfe81a8f0ddef1c9f4a25ebf3`
- test file blob: `6a468749098e0c85c0503c0977a3b1cfd1434da3`; verifier blob: `850135bacc3a818887175b2fd73a43e8d6d21b96`
- command: `python3 -m unittest discover -s scripts -p test_verify_project.py -k test_c4_swapped` (exit 1; `-B`, `scripts/__pycache__` removed first)

```
FAIL: test_c4_swapped (test_verify_project.RequiredLinkTest.test_c4_swapped)
AssertionError: Lists differ: [] != ['THIRD_PARTY_NOTICES.md: no inline link [[81 chars]DE)']
- []
+ ['THIRD_PARTY_NOTICES.md: no inline link [CC BY-SA 4.0](LICENSE)',
+  'THIRD_PARTY_NOTICES.md: no inline link [MIT](LICENSE-CODE)']
Ran 1 test in 0.003s
FAILED (failures=1)
```

#### #172 C4 image — red

- HEAD: `2c6dc76a1ebec42cfe81a8f0ddef1c9f4a25ebf3`
- test file blob: `6a468749098e0c85c0503c0977a3b1cfd1434da3`; verifier blob: `850135bacc3a818887175b2fd73a43e8d6d21b96`
- command: `python3 -m unittest discover -s scripts -p test_verify_project.py -k test_c4_image` (exit 1; `-B`, `scripts/__pycache__` removed first)

```
FAIL: test_c4_image (test_verify_project.RequiredLinkTest.test_c4_image)
AssertionError: Lists differ: [] != ['THIRD_PARTY_NOTICES.md: no inline link [MIT](LICENSE-CODE)']
- []
+ ['THIRD_PARTY_NOTICES.md: no inline link [MIT](LICENSE-CODE)']
Ran 1 test in 0.002s
FAILED (failures=1)
```

#### #173 C4 dot path — red

- HEAD: `2c6dc76a1ebec42cfe81a8f0ddef1c9f4a25ebf3`
- test file blob: `6a468749098e0c85c0503c0977a3b1cfd1434da3`; verifier blob: `850135bacc3a818887175b2fd73a43e8d6d21b96`
- command: `python3 -m unittest discover -s scripts -p test_verify_project.py -k test_c4_dot` (exit 1; `-B`, `scripts/__pycache__` removed first)

```
FAIL: test_c4_dot_path (test_verify_project.RequiredLinkTest.test_c4_dot_path)
AssertionError: Lists differ: ['THI[79 chars]path'] != ['THI[79 chars]path', 'THIRD_PARTY_NOTICES.md: no inline link[21 chars]SE)']
-  'repository path']
?                   ^
+  'repository path',
?                   ^
+  'THIRD_PARTY_NOTICES.md: no inline link [CC BY-SA 4.0](LICENSE)']
Ran 1 test in 0.002s
FAILED (failures=1)
```

#### #174 C4 case — red

- HEAD: `2c6dc76a1ebec42cfe81a8f0ddef1c9f4a25ebf3`
- test file blob: `6a468749098e0c85c0503c0977a3b1cfd1434da3`; verifier blob: `850135bacc3a818887175b2fd73a43e8d6d21b96`
- command: `python3 -m unittest discover -s scripts -p test_verify_project.py -k test_c4_case` (exit 1; `-B`, `scripts/__pycache__` removed first)

```
FAIL: test_c4_case (test_verify_project.RequiredLinkTest.test_c4_case)
AssertionError: Lists differ: ['THI[87 chars]ODE"'] != ['THI[87 chars]ODE"', 'THIRD_PARTY_NOTICES.md: no inline link[17 chars]DE)']
-  'from "LICENSE-CODE"']
?                       ^
+  'from "LICENSE-CODE"',
?                       ^
+  'THIRD_PARTY_NOTICES.md: no inline link [MIT](LICENSE-CODE)']
Ran 1 test in 0.002s
FAILED (failures=1)
```

#### #175 C4 padded text — red

- HEAD: `2c6dc76a1ebec42cfe81a8f0ddef1c9f4a25ebf3`
- test file blob: `6a468749098e0c85c0503c0977a3b1cfd1434da3`; verifier blob: `850135bacc3a818887175b2fd73a43e8d6d21b96`
- command: `python3 -m unittest discover -s scripts -p test_verify_project.py -k test_c4_padded` (exit 1; `-B`, `scripts/__pycache__` removed first)

```
FAIL: test_c4_padded_text (test_verify_project.RequiredLinkTest.test_c4_padded_text)
AssertionError: Lists differ: [] != ['THIRD_PARTY_NOTICES.md: no inline link [MIT](LICENSE-CODE)']
- []
+ ['THIRD_PARTY_NOTICES.md: no inline link [MIT](LICENSE-CODE)']
Ran 1 test in 0.002s
FAILED (failures=1)
```

#### #176 C4 lowercase text — red

- HEAD: `2c6dc76a1ebec42cfe81a8f0ddef1c9f4a25ebf3`
- test file blob: `6a468749098e0c85c0503c0977a3b1cfd1434da3`; verifier blob: `850135bacc3a818887175b2fd73a43e8d6d21b96`
- command: `python3 -m unittest discover -s scripts -p test_verify_project.py -k test_c4_lowercase` (exit 1; `-B`, `scripts/__pycache__` removed first)

```
FAIL: test_c4_lowercase_text (test_verify_project.RequiredLinkTest.test_c4_lowercase_text)
AssertionError: Lists differ: [] != ['THIRD_PARTY_NOTICES.md: no inline link [MIT](LICENSE-CODE)']
- []
+ ['THIRD_PARTY_NOTICES.md: no inline link [MIT](LICENSE-CODE)']
Ran 1 test in 0.002s
FAILED (failures=1)
```

#### #167 C3 required link with a fragment (passed on first run; mutation: require an exact destination before removing the fragment) — red

- HEAD: `2c6dc76a1ebec42cfe81a8f0ddef1c9f4a25ebf3`
- test file blob: `6a468749098e0c85c0503c0977a3b1cfd1434da3`; verifier blob: `7ab076c4880981a90cca461968c422d7cd50fa68`
- command: `python3 -m unittest discover -s scripts -p test_verify_project.py -k test_c3_fragment` (exit 1; `-B`, `scripts/__pycache__` removed first)

```
FAIL: test_c3_fragment (test_verify_project.RequiredLinkTest.test_c3_fragment)
AssertionError: Lists differ: ['THIRD_PARTY_NOTICES.md: no inline link [CC BY-SA 4.0](LICENSE)'] != []
- ['THIRD_PARTY_NOTICES.md: no inline link [CC BY-SA 4.0](LICENSE)']
+ []
Ran 1 test in 0.003s
FAILED (failures=1)
```

#### #168 C3 required link in angle brackets (passed on first run; mutation: keep angle brackets for (c)) — red

- HEAD: `2c6dc76a1ebec42cfe81a8f0ddef1c9f4a25ebf3`
- test file blob: `6a468749098e0c85c0503c0977a3b1cfd1434da3`; verifier blob: `4f0e8246449db50a92cdaa123685be04fd50100d`
- command: `python3 -m unittest discover -s scripts -p test_verify_project.py -k test_c3_angle` (exit 1; `-B`, `scripts/__pycache__` removed first)

```
FAIL: test_c3_angle (test_verify_project.RequiredLinkTest.test_c3_angle)
AssertionError: Lists differ: ['THIRD_PARTY_NOTICES.md: no inline link [MIT](LICENSE-CODE)'] != []
- ['THIRD_PARTY_NOTICES.md: no inline link [MIT](LICENSE-CODE)']
+ []
Ran 1 test in 0.002s
FAILED (failures=1)
```

#### #169 C3 required link with a title (passed on first run; mutation: links with titles do not count) — red

- HEAD: `2c6dc76a1ebec42cfe81a8f0ddef1c9f4a25ebf3`
- test file blob: `6a468749098e0c85c0503c0977a3b1cfd1434da3`; verifier blob: `b33b14cb9afff04bc088bc4106758ac780fd7033`
- command: `python3 -m unittest discover -s scripts -p test_verify_project.py -k test_c3_title` (exit 1; `-B`, `scripts/__pycache__` removed first)

```
FAIL: test_c3_title (test_verify_project.RequiredLinkTest.test_c3_title)
AssertionError: Lists differ: ['THIRD_PARTY_NOTICES.md: no inline link [MIT](LICENSE-CODE)'] != []
- ['THIRD_PARTY_NOTICES.md: no inline link [MIT](LICENSE-CODE)']
+ []
Ran 1 test in 0.003s
FAILED (failures=1)
```

#### #113 G1 code span — red

- HEAD: `2c6dc76a1ebec42cfe81a8f0ddef1c9f4a25ebf3`
- test file blob: `9804311fa404bde35a32a73cf9e9ed7c6673e9ad`; verifier blob: `c647c3d0a32d9a4339a6dceb00c434f2355e791c`
- command: `python3 -m unittest discover -s scripts -p test_verify_project.py -k test_g1_code_span` (exit 1; `-B`, `scripts/__pycache__` removed first)

```
FAIL: test_g1_code_span (test_verify_project.NoticesGrammarTest.test_g1_code_span)
AssertionError: Lists differ: ['THIRD_PARTY_NOTICES.md:3: license reference "missing" does not exist'] != []
- ['THIRD_PARTY_NOTICES.md:3: license reference "missing" does not exist']
+ []
Ran 1 test in 0.003s
FAILED (failures=1)
```

#### #114 G1 backtick fence — red

- HEAD: `2c6dc76a1ebec42cfe81a8f0ddef1c9f4a25ebf3`
- test file blob: `9804311fa404bde35a32a73cf9e9ed7c6673e9ad`; verifier blob: `c647c3d0a32d9a4339a6dceb00c434f2355e791c`
- command: `python3 -m unittest discover -s scripts -p test_verify_project.py -k test_g1_backtick_fence` (exit 1; `-B`, `scripts/__pycache__` removed first)

```
FAIL: test_g1_backtick_fence (test_verify_project.NoticesGrammarTest.test_g1_backtick_fence)
AssertionError: Lists differ: ['THIRD_PARTY_NOTICES.md:4: license reference "missing" does not exist'] != []
- ['THIRD_PARTY_NOTICES.md:4: license reference "missing" does not exist']
+ []
Ran 1 test in 0.002s
FAILED (failures=1)
```

#### #115 G1 tilde fence — red

- HEAD: `2c6dc76a1ebec42cfe81a8f0ddef1c9f4a25ebf3`
- test file blob: `9804311fa404bde35a32a73cf9e9ed7c6673e9ad`; verifier blob: `c647c3d0a32d9a4339a6dceb00c434f2355e791c`
- command: `python3 -m unittest discover -s scripts -p test_verify_project.py -k test_g1_tilde_fence` (exit 1; `-B`, `scripts/__pycache__` removed first)

```
FAIL: test_g1_tilde_fence (test_verify_project.NoticesGrammarTest.test_g1_tilde_fence)
AssertionError: Lists differ: ['THIRD_PARTY_NOTICES.md:4: license reference "missing" does not exist'] != []
- ['THIRD_PARTY_NOTICES.md:4: license reference "missing" does not exist']
+ []
Ran 1 test in 0.002s
FAILED (failures=1)
```

#### #116 G1 longer closer — red

- HEAD: `2c6dc76a1ebec42cfe81a8f0ddef1c9f4a25ebf3`
- test file blob: `9804311fa404bde35a32a73cf9e9ed7c6673e9ad`; verifier blob: `c647c3d0a32d9a4339a6dceb00c434f2355e791c`
- command: `python3 -m unittest discover -s scripts -p test_verify_project.py -k test_g1_longer_closer` (exit 1; `-B`, `scripts/__pycache__` removed first)

```
FAIL: test_g1_longer_closer (test_verify_project.NoticesGrammarTest.test_g1_longer_closer)
AssertionError: Lists differ: ['THIRD_PARTY_NOTICES.md:4: license reference "missing" does not exist'] != []
- ['THIRD_PARTY_NOTICES.md:4: license reference "missing" does not exist']
+ []
Ran 1 test in 0.002s
FAILED (failures=1)
```

#### #117 G1 indented closer — red

- HEAD: `2c6dc76a1ebec42cfe81a8f0ddef1c9f4a25ebf3`
- test file blob: `9804311fa404bde35a32a73cf9e9ed7c6673e9ad`; verifier blob: `c647c3d0a32d9a4339a6dceb00c434f2355e791c`
- command: `python3 -m unittest discover -s scripts -p test_verify_project.py -k test_g1_indented_closer` (exit 1; `-B`, `scripts/__pycache__` removed first)

```
FAIL: test_g1_indented_closer (test_verify_project.NoticesGrammarTest.test_g1_indented_closer)
AssertionError: Lists differ: ['THIRD_PARTY_NOTICES.md:4: license reference "missing" does not exist'] != []
- ['THIRD_PARTY_NOTICES.md:4: license reference "missing" does not exist']
+ []
Ran 1 test in 0.002s
FAILED (failures=1)
```

#### #118 G1 info string — red

- HEAD: `2c6dc76a1ebec42cfe81a8f0ddef1c9f4a25ebf3`
- test file blob: `9804311fa404bde35a32a73cf9e9ed7c6673e9ad`; verifier blob: `c647c3d0a32d9a4339a6dceb00c434f2355e791c`
- command: `python3 -m unittest discover -s scripts -p test_verify_project.py -k test_g1_info_string` (exit 1; `-B`, `scripts/__pycache__` removed first)

```
FAIL: test_g1_info_string (test_verify_project.NoticesGrammarTest.test_g1_info_string)
AssertionError: Lists differ: ['THIRD_PARTY_NOTICES.md:4: license reference "missing" does not exist'] != []
- ['THIRD_PARTY_NOTICES.md:4: license reference "missing" does not exist']
+ []
Ran 1 test in 0.002s
FAILED (failures=1)
```

#### #119 G2 four-space backticks — red

- HEAD: `2c6dc76a1ebec42cfe81a8f0ddef1c9f4a25ebf3`
- test file blob: `9804311fa404bde35a32a73cf9e9ed7c6673e9ad`; verifier blob: `c647c3d0a32d9a4339a6dceb00c434f2355e791c`
- command: `python3 -m unittest discover -s scripts -p test_verify_project.py -k test_g2_four_space` (exit 1; `-B`, `scripts/__pycache__` removed first)

```
FAIL: test_g2_four_space_backticks (test_verify_project.NoticesGrammarTest.test_g2_four_space_backticks)
AssertionError: Lists differ: [] != ['THIRD_PARTY_NOTICES.md:3: unsupported Markdown (unmatched backtick)']
- []
+ ['THIRD_PARTY_NOTICES.md:3: unsupported Markdown (unmatched backtick)']
Ran 1 test in 0.002s
FAILED (failures=1)
```

#### #120 G2 closed by the other character — red

- HEAD: `2c6dc76a1ebec42cfe81a8f0ddef1c9f4a25ebf3`
- test file blob: `9804311fa404bde35a32a73cf9e9ed7c6673e9ad`; verifier blob: `c647c3d0a32d9a4339a6dceb00c434f2355e791c`
- command: `python3 -m unittest discover -s scripts -p test_verify_project.py -k test_g2_closed_by` (exit 1; `-B`, `scripts/__pycache__` removed first)

```
FAIL: test_g2_closed_by_other_character (test_verify_project.NoticesGrammarTest.test_g2_closed_by_other_character)
AssertionError: Lists differ: ['THIRD_PARTY_NOTICES.md:5: license reference "missing" does not exist'] != ['THIRD_PARTY_NOTICES.md:3: unsupported Markdown (unclosed code fence)']
First differing element 0:
- ['THIRD_PARTY_NOTICES.md:5: license reference "missing" does not exist']
+ ['THIRD_PARTY_NOTICES.md:3: unsupported Markdown (unclosed code fence)']
Ran 1 test in 0.002s
FAILED (failures=1)
```

#### #121 G2 shorter closer — red

- HEAD: `2c6dc76a1ebec42cfe81a8f0ddef1c9f4a25ebf3`
- test file blob: `9804311fa404bde35a32a73cf9e9ed7c6673e9ad`; verifier blob: `c647c3d0a32d9a4339a6dceb00c434f2355e791c`
- command: `python3 -m unittest discover -s scripts -p test_verify_project.py -k test_g2_shorter` (exit 1; `-B`, `scripts/__pycache__` removed first)

```
FAIL: test_g2_shorter_closer (test_verify_project.NoticesGrammarTest.test_g2_shorter_closer)
AssertionError: Lists differ: ['THIRD_PARTY_NOTICES.md:5: license reference "missing" does not exist'] != ['THIRD_PARTY_NOTICES.md:3: unsupported Markdown (unclosed code fence)']
First differing element 0:
- ['THIRD_PARTY_NOTICES.md:5: license reference "missing" does not exist']
+ ['THIRD_PARTY_NOTICES.md:3: unsupported Markdown (unclosed code fence)']
Ran 1 test in 0.002s
FAILED (failures=1)
```

#### #122 G2 closer with text — red

- HEAD: `2c6dc76a1ebec42cfe81a8f0ddef1c9f4a25ebf3`
- test file blob: `9804311fa404bde35a32a73cf9e9ed7c6673e9ad`; verifier blob: `c647c3d0a32d9a4339a6dceb00c434f2355e791c`
- command: `python3 -m unittest discover -s scripts -p test_verify_project.py -k test_g2_closer_with` (exit 1; `-B`, `scripts/__pycache__` removed first)

```
FAIL: test_g2_closer_with_text (test_verify_project.NoticesGrammarTest.test_g2_closer_with_text)
AssertionError: Lists differ: ['THIRD_PARTY_NOTICES.md:5: license reference "missing" does not exist'] != ['THIRD_PARTY_NOTICES.md:3: unsupported Markdown (unclosed code fence)']
First differing element 0:
- ['THIRD_PARTY_NOTICES.md:5: license reference "missing" does not exist']
+ ['THIRD_PARTY_NOTICES.md:3: unsupported Markdown (unclosed code fence)']
Ran 1 test in 0.003s
FAILED (failures=1)
```

#### #123 G2 indented opener — red

- HEAD: `2c6dc76a1ebec42cfe81a8f0ddef1c9f4a25ebf3`
- test file blob: `9804311fa404bde35a32a73cf9e9ed7c6673e9ad`; verifier blob: `c647c3d0a32d9a4339a6dceb00c434f2355e791c`
- command: `python3 -m unittest discover -s scripts -p test_verify_project.py -k test_g2_indented_opener` (exit 1; `-B`, `scripts/__pycache__` removed first)

```
FAIL: test_g2_indented_opener (test_verify_project.NoticesGrammarTest.test_g2_indented_opener)
AssertionError: Lists differ: ['THI[15 chars]S.md:4: license reference "missing" does not exist'] != ['THI[15 chars]S.md:3: unsupported Markdown (indented fence)'[68 chars]ist']
First differing element 0:
+ ['THIRD_PARTY_NOTICES.md:3: unsupported Markdown (indented fence)',
- ['THIRD_PARTY_NOTICES.md:4: license reference "missing" does not exist']
? ^
+  'THIRD_PARTY_NOTICES.md:4: license reference "missing" does not exist']
? ^
Ran 1 test in 0.002s
FAILED (failures=1)
```

#### #124 G3 byte order mark — red

- HEAD: `2c6dc76a1ebec42cfe81a8f0ddef1c9f4a25ebf3`
- test file blob: `9804311fa404bde35a32a73cf9e9ed7c6673e9ad`; verifier blob: `c647c3d0a32d9a4339a6dceb00c434f2355e791c`
- command: `python3 -m unittest discover -s scripts -p test_verify_project.py -k test_g3_byte_order` (exit 1; `-B`, `scripts/__pycache__` removed first)

```
FAIL: test_g3_byte_order_mark (test_verify_project.NoticesGrammarTest.test_g3_byte_order_mark)
AssertionError: Lists differ: [] != ['THIRD_PARTY_NOTICES.md:1: unsupported Markdown (byte order mark)']
- []
+ ['THIRD_PARTY_NOTICES.md:1: unsupported Markdown (byte order mark)']
Ran 1 test in 0.004s
FAILED (failures=1)
```

#### #125 G3 carriage return — red

- HEAD: `2c6dc76a1ebec42cfe81a8f0ddef1c9f4a25ebf3`
- test file blob: `9804311fa404bde35a32a73cf9e9ed7c6673e9ad`; verifier blob: `c647c3d0a32d9a4339a6dceb00c434f2355e791c`
- command: `python3 -m unittest discover -s scripts -p test_verify_project.py -k test_g3_carriage` (exit 1; `-B`, `scripts/__pycache__` removed first)

```
FAIL: test_g3_carriage_return (test_verify_project.NoticesGrammarTest.test_g3_carriage_return)
AssertionError: Lists differ: [] != ['THIRD_PARTY_NOTICES.md:3: unsupported Markdown (carriage return)']
- []
+ ['THIRD_PARTY_NOTICES.md:3: unsupported Markdown (carriage return)']
Ran 1 test in 0.002s
FAILED (failures=1)
```

#### #126 G3 backtick in info string — red

- HEAD: `2c6dc76a1ebec42cfe81a8f0ddef1c9f4a25ebf3`
- test file blob: `9804311fa404bde35a32a73cf9e9ed7c6673e9ad`; verifier blob: `c647c3d0a32d9a4339a6dceb00c434f2355e791c`
- command: `python3 -m unittest discover -s scripts -p test_verify_project.py -k test_g3_backtick_in` (exit 1; `-B`, `scripts/__pycache__` removed first)

```
FAIL: test_g3_backtick_in_info_string (test_verify_project.NoticesGrammarTest.test_g3_backtick_in_info_string)
AssertionError: Lists differ: [] != ['THIRD_PARTY_NOTICES.md:3: unsupported Ma[35 chars]ng)']
- []
+ ['THIRD_PARTY_NOTICES.md:3: unsupported Markdown (backtick in fence info '
+  'string)']
Ran 1 test in 0.002s
FAILED (failures=1)
```

#### #127 G3 unmatched backtick — red

- HEAD: `2c6dc76a1ebec42cfe81a8f0ddef1c9f4a25ebf3`
- test file blob: `9804311fa404bde35a32a73cf9e9ed7c6673e9ad`; verifier blob: `c647c3d0a32d9a4339a6dceb00c434f2355e791c`
- command: `python3 -m unittest discover -s scripts -p test_verify_project.py -k test_g3_unmatched` (exit 1; `-B`, `scripts/__pycache__` removed first)

```
FAIL: test_g3_unmatched_backtick (test_verify_project.NoticesGrammarTest.test_g3_unmatched_backtick)
AssertionError: Lists differ: [] != ['THIRD_PARTY_NOTICES.md:3: unsupported Markdown (unmatched backtick)']
- []
+ ['THIRD_PARTY_NOTICES.md:3: unsupported Markdown (unmatched backtick)']
Ran 1 test in 0.002s
FAILED (failures=1)
```

#### #128 G3 HTML comment — red

- HEAD: `2c6dc76a1ebec42cfe81a8f0ddef1c9f4a25ebf3`
- test file blob: `9804311fa404bde35a32a73cf9e9ed7c6673e9ad`; verifier blob: `c647c3d0a32d9a4339a6dceb00c434f2355e791c`
- command: `python3 -m unittest discover -s scripts -p test_verify_project.py -k test_g3_html_comment` (exit 1; `-B`, `scripts/__pycache__` removed first)

```
FAIL: test_g3_html_comment (test_verify_project.NoticesGrammarTest.test_g3_html_comment)
AssertionError: Lists differ: [] != ['THIRD_PARTY_NOTICES.md:3: unsupported Markdown (raw HTML or autolink)']
- []
+ ['THIRD_PARTY_NOTICES.md:3: unsupported Markdown (raw HTML or autolink)']
Ran 1 test in 0.002s
FAILED (failures=1)
```

#### #129 G3 HTML block — red

- HEAD: `2c6dc76a1ebec42cfe81a8f0ddef1c9f4a25ebf3`
- test file blob: `9804311fa404bde35a32a73cf9e9ed7c6673e9ad`; verifier blob: `c647c3d0a32d9a4339a6dceb00c434f2355e791c`
- command: `python3 -m unittest discover -s scripts -p test_verify_project.py -k test_g3_html_block` (exit 1; `-B`, `scripts/__pycache__` removed first)

```
FAIL: test_g3_html_block (test_verify_project.NoticesGrammarTest.test_g3_html_block)
AssertionError: Lists differ: [] != ['THIRD_PARTY_NOTICES.md:3: unsupported Markdown (raw HTML or autolink)']
- []
+ ['THIRD_PARTY_NOTICES.md:3: unsupported Markdown (raw HTML or autolink)']
Ran 1 test in 0.002s
FAILED (failures=1)
```

#### #130 G3 autolink — red

- HEAD: `2c6dc76a1ebec42cfe81a8f0ddef1c9f4a25ebf3`
- test file blob: `9804311fa404bde35a32a73cf9e9ed7c6673e9ad`; verifier blob: `c647c3d0a32d9a4339a6dceb00c434f2355e791c`
- command: `python3 -m unittest discover -s scripts -p test_verify_project.py -k test_g3_autolink` (exit 1; `-B`, `scripts/__pycache__` removed first)

```
FAIL: test_g3_autolink (test_verify_project.NoticesGrammarTest.test_g3_autolink)
AssertionError: Lists differ: [] != ['THIRD_PARTY_NOTICES.md:3: unsupported Markdown (raw HTML or autolink)']
- []
+ ['THIRD_PARTY_NOTICES.md:3: unsupported Markdown (raw HTML or autolink)']
Ran 1 test in 0.002s
FAILED (failures=1)
```

#### #131 G3 blockquote — red

- HEAD: `2c6dc76a1ebec42cfe81a8f0ddef1c9f4a25ebf3`
- test file blob: `9804311fa404bde35a32a73cf9e9ed7c6673e9ad`; verifier blob: `c647c3d0a32d9a4339a6dceb00c434f2355e791c`
- command: `python3 -m unittest discover -s scripts -p test_verify_project.py -k test_g3_blockquote` (exit 1; `-B`, `scripts/__pycache__` removed first)

```
FAIL: test_g3_blockquote (test_verify_project.NoticesGrammarTest.test_g3_blockquote)
AssertionError: Lists differ: [] != ['THIRD_PARTY_NOTICES.md:3: unsupported Markdown (blockquote)']
- []
+ ['THIRD_PARTY_NOTICES.md:3: unsupported Markdown (blockquote)']
Ran 1 test in 0.002s
FAILED (failures=1)
```

#### #132 G3 tab-indented — red

- HEAD: `2c6dc76a1ebec42cfe81a8f0ddef1c9f4a25ebf3`
- test file blob: `9804311fa404bde35a32a73cf9e9ed7c6673e9ad`; verifier blob: `c647c3d0a32d9a4339a6dceb00c434f2355e791c`
- command: `python3 -m unittest discover -s scripts -p test_verify_project.py -k test_g3_tab_indented` (exit 1; `-B`, `scripts/__pycache__` removed first)

```
FAIL: test_g3_tab_indented (test_verify_project.NoticesGrammarTest.test_g3_tab_indented)
AssertionError: Lists differ: [] != ['THIRD_PARTY_NOTICES.md:3: unsupported Markdown (tab indentation)']
- []
+ ['THIRD_PARTY_NOTICES.md:3: unsupported Markdown (tab indentation)']
Ran 1 test in 0.003s
FAILED (failures=1)
```

#### #133 G3 spaces then tab — red

- HEAD: `2c6dc76a1ebec42cfe81a8f0ddef1c9f4a25ebf3`
- test file blob: `9804311fa404bde35a32a73cf9e9ed7c6673e9ad`; verifier blob: `c647c3d0a32d9a4339a6dceb00c434f2355e791c`
- command: `python3 -m unittest discover -s scripts -p test_verify_project.py -k test_g3_spaces_then` (exit 1; `-B`, `scripts/__pycache__` removed first)

```
FAIL: test_g3_spaces_then_tab (test_verify_project.NoticesGrammarTest.test_g3_spaces_then_tab)
AssertionError: Lists differ: [] != ['THIRD_PARTY_NOTICES.md:3: unsupported Markdown (tab indentation)']
- []
+ ['THIRD_PARTY_NOTICES.md:3: unsupported Markdown (tab indentation)']
Ran 1 test in 0.002s
FAILED (failures=1)
```

#### #134 G3 reference definition — red

- HEAD: `2c6dc76a1ebec42cfe81a8f0ddef1c9f4a25ebf3`
- test file blob: `9804311fa404bde35a32a73cf9e9ed7c6673e9ad`; verifier blob: `c647c3d0a32d9a4339a6dceb00c434f2355e791c`
- command: `python3 -m unittest discover -s scripts -p test_verify_project.py -k *test_g3_reference_definition` (exit 1; `-B`, `scripts/__pycache__` removed first)

```
FAIL: test_g3_reference_definition (test_verify_project.NoticesGrammarTest.test_g3_reference_definition)
AssertionError: Lists differ: [] != ['THIRD_PARTY_NOTICES.md:3: unsupported Markdown (link reference definition)']
- []
+ ['THIRD_PARTY_NOTICES.md:3: unsupported Markdown (link reference definition)']
Ran 1 test in 0.002s
FAILED (failures=1)
```

#### #135 G3 indented reference definition — red

- HEAD: `2c6dc76a1ebec42cfe81a8f0ddef1c9f4a25ebf3`
- test file blob: `9804311fa404bde35a32a73cf9e9ed7c6673e9ad`; verifier blob: `c647c3d0a32d9a4339a6dceb00c434f2355e791c`
- command: `python3 -m unittest discover -s scripts -p test_verify_project.py -k test_g3_indented_reference` (exit 1; `-B`, `scripts/__pycache__` removed first)

```
FAIL: test_g3_indented_reference_definition (test_verify_project.NoticesGrammarTest.test_g3_indented_reference_definition)
AssertionError: Lists differ: [] != ['THIRD_PARTY_NOTICES.md:3: unsupported Markdown (link reference definition)']
- []
+ ['THIRD_PARTY_NOTICES.md:3: unsupported Markdown (link reference definition)']
Ran 1 test in 0.003s
FAILED (failures=1)
```

#### #136 G3 indented line with a link — red

- HEAD: `2c6dc76a1ebec42cfe81a8f0ddef1c9f4a25ebf3`
- test file blob: `9804311fa404bde35a32a73cf9e9ed7c6673e9ad`; verifier blob: `c647c3d0a32d9a4339a6dceb00c434f2355e791c`
- command: `python3 -m unittest discover -s scripts -p test_verify_project.py -k test_g3_indented_line` (exit 1; `-B`, `scripts/__pycache__` removed first)

```
FAIL: test_g3_indented_line_with_link (test_verify_project.NoticesGrammarTest.test_g3_indented_line_with_link)
AssertionError: Lists differ: [] != ['THIRD_PARTY_NOTICES.md:3: unsupported Markdown (indented line with a link)']
- []
+ ['THIRD_PARTY_NOTICES.md:3: unsupported Markdown (indented line with a link)']
Ran 1 test in 0.002s
FAILED (failures=1)
```

#### #137 G3 escaped bracket — red

- HEAD: `2c6dc76a1ebec42cfe81a8f0ddef1c9f4a25ebf3`
- test file blob: `9804311fa404bde35a32a73cf9e9ed7c6673e9ad`; verifier blob: `c647c3d0a32d9a4339a6dceb00c434f2355e791c`
- command: `python3 -m unittest discover -s scripts -p test_verify_project.py -k test_g3_escaped_bracket` (exit 1; `-B`, `scripts/__pycache__` removed first)

```
FAIL: test_g3_escaped_bracket (test_verify_project.NoticesGrammarTest.test_g3_escaped_bracket)
AssertionError: Lists differ: [] != ['THIRD_PARTY_NOTICES.md:3: unsupported Markdown (backslash escape)']
- []
+ ['THIRD_PARTY_NOTICES.md:3: unsupported Markdown (backslash escape)']
Ran 1 test in 0.002s
FAILED (failures=1)
```

#### #138 G3 escaped paren — red

- HEAD: `2c6dc76a1ebec42cfe81a8f0ddef1c9f4a25ebf3`
- test file blob: `9804311fa404bde35a32a73cf9e9ed7c6673e9ad`; verifier blob: `c647c3d0a32d9a4339a6dceb00c434f2355e791c`
- command: `python3 -m unittest discover -s scripts -p test_verify_project.py -k test_g3_escaped_paren` (exit 1; `-B`, `scripts/__pycache__` removed first)

```
FAIL: test_g3_escaped_paren (test_verify_project.NoticesGrammarTest.test_g3_escaped_paren)
AssertionError: Lists differ: [] != ['THIRD_PARTY_NOTICES.md:3: unsupported Markdown (backslash escape)']
- []
+ ['THIRD_PARTY_NOTICES.md:3: unsupported Markdown (backslash escape)']
Ran 1 test in 0.005s
FAILED (failures=1)
```

#### #139 G3 empty link text — red

- HEAD: `2c6dc76a1ebec42cfe81a8f0ddef1c9f4a25ebf3`
- test file blob: `9804311fa404bde35a32a73cf9e9ed7c6673e9ad`; verifier blob: `c647c3d0a32d9a4339a6dceb00c434f2355e791c`
- command: `python3 -m unittest discover -s scripts -p test_verify_project.py -k test_g3_empty_link` (exit 1; `-B`, `scripts/__pycache__` removed first)

```
FAIL: test_g3_empty_link_text (test_verify_project.NoticesGrammarTest.test_g3_empty_link_text)
AssertionError: Lists differ: [] != ['THIRD_PARTY_NOTICES.md:3: unsupported Markdown (empty link text)']
- []
+ ['THIRD_PARTY_NOTICES.md:3: unsupported Markdown (empty link text)']
Ran 1 test in 0.002s
FAILED (failures=1)
```

#### #140 G3 blank link text — red

- HEAD: `2c6dc76a1ebec42cfe81a8f0ddef1c9f4a25ebf3`
- test file blob: `9804311fa404bde35a32a73cf9e9ed7c6673e9ad`; verifier blob: `c647c3d0a32d9a4339a6dceb00c434f2355e791c`
- command: `python3 -m unittest discover -s scripts -p test_verify_project.py -k test_g3_blank_link` (exit 1; `-B`, `scripts/__pycache__` removed first)

```
FAIL: test_g3_blank_link_text (test_verify_project.NoticesGrammarTest.test_g3_blank_link_text)
AssertionError: Lists differ: [] != ['THIRD_PARTY_NOTICES.md:3: unsupported Markdown (empty link text)']
- []
+ ['THIRD_PARTY_NOTICES.md:3: unsupported Markdown (empty link text)']
Ran 1 test in 0.003s
FAILED (failures=1)
```

#### #141 G3 nested image — red

- HEAD: `2c6dc76a1ebec42cfe81a8f0ddef1c9f4a25ebf3`
- test file blob: `9804311fa404bde35a32a73cf9e9ed7c6673e9ad`; verifier blob: `c647c3d0a32d9a4339a6dceb00c434f2355e791c`
- command: `python3 -m unittest discover -s scripts -p test_verify_project.py -k test_g3_nested` (exit 1; `-B`, `scripts/__pycache__` removed first)

```
FAIL: test_g3_nested_image (test_verify_project.NoticesGrammarTest.test_g3_nested_image)
AssertionError: Lists differ: [] != ['THIRD_PARTY_NOTICES.md:3: unsupported Markdown (unrecognized link)']
- []
+ ['THIRD_PARTY_NOTICES.md:3: unsupported Markdown (unrecognized link)']
Ran 1 test in 0.002s
FAILED (failures=1)
```

#### #142 G3 space in destination — red

- HEAD: `2c6dc76a1ebec42cfe81a8f0ddef1c9f4a25ebf3`
- test file blob: `9804311fa404bde35a32a73cf9e9ed7c6673e9ad`; verifier blob: `c647c3d0a32d9a4339a6dceb00c434f2355e791c`
- command: `python3 -m unittest discover -s scripts -p test_verify_project.py -k test_g3_space_in` (exit 1; `-B`, `scripts/__pycache__` removed first)

```
FAIL: test_g3_space_in_destination (test_verify_project.NoticesGrammarTest.test_g3_space_in_destination)
AssertionError: Lists differ: [] != ['THIRD_PARTY_NOTICES.md:3: unsupported Markdown (unrecognized link)']
- []
+ ['THIRD_PARTY_NOTICES.md:3: unsupported Markdown (unrecognized link)']
Ran 1 test in 0.002s
FAILED (failures=1)
```

#### #143 G3 link text over two lines — red

- HEAD: `2c6dc76a1ebec42cfe81a8f0ddef1c9f4a25ebf3`
- test file blob: `9804311fa404bde35a32a73cf9e9ed7c6673e9ad`; verifier blob: `c647c3d0a32d9a4339a6dceb00c434f2355e791c`
- command: `python3 -m unittest discover -s scripts -p test_verify_project.py -k test_g3_link_text_over` (exit 1; `-B`, `scripts/__pycache__` removed first)

```
FAIL: test_g3_link_text_over_two_lines (test_verify_project.NoticesGrammarTest.test_g3_link_text_over_two_lines)
AssertionError: Lists differ: [] != ['THIRD_PARTY_NOTICES.md:4: unsupported Markdown (unrecognized link)']
- []
+ ['THIRD_PARTY_NOTICES.md:4: unsupported Markdown (unrecognized link)']
Ran 1 test in 0.002s
FAILED (failures=1)
```

#### #144 G4 comment beats backslash — red

- HEAD: `2c6dc76a1ebec42cfe81a8f0ddef1c9f4a25ebf3`
- test file blob: `9804311fa404bde35a32a73cf9e9ed7c6673e9ad`; verifier blob: `c647c3d0a32d9a4339a6dceb00c434f2355e791c`
- command: `python3 -m unittest discover -s scripts -p test_verify_project.py -k test_g4_comment` (exit 1; `-B`, `scripts/__pycache__` removed first)

```
FAIL: test_g4_comment_beats_backslash (test_verify_project.NoticesGrammarTest.test_g4_comment_beats_backslash)
AssertionError: Lists differ: [] != ['THIRD_PARTY_NOTICES.md:3: unsupported Markdown (raw HTML or autolink)']
- []
+ ['THIRD_PARTY_NOTICES.md:3: unsupported Markdown (raw HTML or autolink)']
Ran 1 test in 0.002s
FAILED (failures=1)
```

#### #145 G4 carriage return beats HTML — red

- HEAD: `2c6dc76a1ebec42cfe81a8f0ddef1c9f4a25ebf3`
- test file blob: `9804311fa404bde35a32a73cf9e9ed7c6673e9ad`; verifier blob: `c647c3d0a32d9a4339a6dceb00c434f2355e791c`
- command: `python3 -m unittest discover -s scripts -p test_verify_project.py -k test_g4_carriage` (exit 1; `-B`, `scripts/__pycache__` removed first)

```
FAIL: test_g4_carriage_return_beats_html (test_verify_project.NoticesGrammarTest.test_g4_carriage_return_beats_html)
AssertionError: Lists differ: [] != ['THIRD_PARTY_NOTICES.md:3: unsupported Markdown (carriage return)']
- []
+ ['THIRD_PARTY_NOTICES.md:3: unsupported Markdown (carriage return)']
Ran 1 test in 0.002s
FAILED (failures=1)
```

#### #151 G6 link on a construct line — red

- HEAD: `2c6dc76a1ebec42cfe81a8f0ddef1c9f4a25ebf3`
- test file blob: `9804311fa404bde35a32a73cf9e9ed7c6673e9ad`; verifier blob: `c647c3d0a32d9a4339a6dceb00c434f2355e791c`
- command: `python3 -m unittest discover -s scripts -p test_verify_project.py -k test_g6_link_on` (exit 1; `-B`, `scripts/__pycache__` removed first)

```
FAIL: test_g6_link_on_construct_line (test_verify_project.NoticesGrammarTest.test_g6_link_on_construct_line)
AssertionError: Lists differ: ['THI[18 chars]d:3: license reference "missing" does not exist'] != ['THI[18 chars]d:3: unsupported Markdown (raw HTML or autolin[71 chars]ist']
First differing element 0:
+ ['THIRD_PARTY_NOTICES.md:3: unsupported Markdown (raw HTML or autolink)',
- ['THIRD_PARTY_NOTICES.md:3: license reference "missing" does not exist']
? ^
+  'THIRD_PARTY_NOTICES.md:3: license reference "missing" does not exist']
? ^
Ran 1 test in 0.005s
FAILED (failures=1)
```

#### #152 G6 required link in a comment — red

- HEAD: `2c6dc76a1ebec42cfe81a8f0ddef1c9f4a25ebf3`
- test file blob: `9804311fa404bde35a32a73cf9e9ed7c6673e9ad`; verifier blob: `c647c3d0a32d9a4339a6dceb00c434f2355e791c`
- command: `python3 -m unittest discover -s scripts -p test_verify_project.py -k test_g6_required` (exit 1; `-B`, `scripts/__pycache__` removed first)

```
FAIL: test_g6_required_link_in_comment (test_verify_project.NoticesGrammarTest.test_g6_required_link_in_comment)
AssertionError: Lists differ: [] != ['THIRD_PARTY_NOTICES.md:2: unsupported Markdown (raw HTML or autolink)']
- []
+ ['THIRD_PARTY_NOTICES.md:2: unsupported Markdown (raw HTML or autolink)']
Ran 1 test in 0.002s
FAILED (failures=1)
```

#### #154 G8 pipe in a title — red

- HEAD: `2c6dc76a1ebec42cfe81a8f0ddef1c9f4a25ebf3`
- test file blob: `9804311fa404bde35a32a73cf9e9ed7c6673e9ad`; verifier blob: `c647c3d0a32d9a4339a6dceb00c434f2355e791c`
- command: `python3 -m unittest discover -s scripts -p test_verify_project.py -k test_g8_pipe_in_title` (exit 1; `-B`, `scripts/__pycache__` removed first)

```
FAIL: test_g8_pipe_in_title (test_verify_project.NoticesGrammarTest.test_g8_pipe_in_title)
AssertionError: Lists differ: [] != ['THIRD_PARTY_NOTICES.md:3: unsupported Ma[38 chars]nt)']
- []
+ ['THIRD_PARTY_NOTICES.md:3: unsupported Markdown (pipe inside a table cell '
+  'element)']
Ran 1 test in 0.002s
FAILED (failures=1)
```

#### #155 G8 pipe in a code span — red

- HEAD: `2c6dc76a1ebec42cfe81a8f0ddef1c9f4a25ebf3`
- test file blob: `9804311fa404bde35a32a73cf9e9ed7c6673e9ad`; verifier blob: `c647c3d0a32d9a4339a6dceb00c434f2355e791c`
- command: `python3 -m unittest discover -s scripts -p test_verify_project.py -k test_g8_pipe_in_code` (exit 1; `-B`, `scripts/__pycache__` removed first)

```
FAIL: test_g8_pipe_in_code_span (test_verify_project.NoticesGrammarTest.test_g8_pipe_in_code_span)
AssertionError: Lists differ: [] != ['THIRD_PARTY_NOTICES.md:3: unsupported Ma[38 chars]nt)']
- []
+ ['THIRD_PARTY_NOTICES.md:3: unsupported Markdown (pipe inside a table cell '
+  'element)']
Ran 1 test in 0.002s
FAILED (failures=1)
```

#### #157 G9 fence in a list item — red

- HEAD: `2c6dc76a1ebec42cfe81a8f0ddef1c9f4a25ebf3`
- test file blob: `9804311fa404bde35a32a73cf9e9ed7c6673e9ad`; verifier blob: `c647c3d0a32d9a4339a6dceb00c434f2355e791c`
- command: `python3 -m unittest discover -s scripts -p test_verify_project.py -k test_g9_fence` (exit 1; `-B`, `scripts/__pycache__` removed first)

```
FAIL: test_g9_fence_in_list_item (test_verify_project.NoticesGrammarTest.test_g9_fence_in_list_item)
AssertionError: Lists differ: [] != ['THIRD_PARTY_NOTICES.md:3: unsupported Markdown (block inside a list item)']
- []
+ ['THIRD_PARTY_NOTICES.md:3: unsupported Markdown (block inside a list item)']
Ran 1 test in 0.002s
FAILED (failures=1)
```

#### #158 G9 indented code in a list item — red

- HEAD: `2c6dc76a1ebec42cfe81a8f0ddef1c9f4a25ebf3`
- test file blob: `9804311fa404bde35a32a73cf9e9ed7c6673e9ad`; verifier blob: `c647c3d0a32d9a4339a6dceb00c434f2355e791c`
- command: `python3 -m unittest discover -s scripts -p test_verify_project.py -k test_g9_indented` (exit 1; `-B`, `scripts/__pycache__` removed first)

```
FAIL: test_g9_indented_code_in_list_item (test_verify_project.NoticesGrammarTest.test_g9_indented_code_in_list_item)
AssertionError: Lists differ: [] != ['THIRD_PARTY_NOTICES.md:3: unsupported Markdown (block inside a list item)']
- []
+ ['THIRD_PARTY_NOTICES.md:3: unsupported Markdown (block inside a list item)']
Ran 1 test in 0.002s
FAILED (failures=1)
```

#### #159 G9 reference definition in a list item — red

- HEAD: `2c6dc76a1ebec42cfe81a8f0ddef1c9f4a25ebf3`
- test file blob: `9804311fa404bde35a32a73cf9e9ed7c6673e9ad`; verifier blob: `c647c3d0a32d9a4339a6dceb00c434f2355e791c`
- command: `python3 -m unittest discover -s scripts -p test_verify_project.py -k test_g9_reference` (exit 1; `-B`, `scripts/__pycache__` removed first)

```
FAIL: test_g9_reference_definition_in_list_item (test_verify_project.NoticesGrammarTest.test_g9_reference_definition_in_list_item)
AssertionError: Lists differ: [] != ['THIRD_PARTY_NOTICES.md:3: unsupported Markdown (block inside a list item)']
- []
+ ['THIRD_PARTY_NOTICES.md:3: unsupported Markdown (block inside a list item)']
Ran 1 test in 0.002s
FAILED (failures=1)
```

#### #160 G9 blockquote in a list item — red

- HEAD: `2c6dc76a1ebec42cfe81a8f0ddef1c9f4a25ebf3`
- test file blob: `9804311fa404bde35a32a73cf9e9ed7c6673e9ad`; verifier blob: `c647c3d0a32d9a4339a6dceb00c434f2355e791c`
- command: `python3 -m unittest discover -s scripts -p test_verify_project.py -k test_g9_blockquote` (exit 1; `-B`, `scripts/__pycache__` removed first)

```
FAIL: test_g9_blockquote_in_list_item (test_verify_project.NoticesGrammarTest.test_g9_blockquote_in_list_item)
AssertionError: Lists differ: [] != ['THIRD_PARTY_NOTICES.md:3: unsupported Markdown (block inside a list item)']
- []
+ ['THIRD_PARTY_NOTICES.md:3: unsupported Markdown (block inside a list item)']
Ran 1 test in 0.002s
FAILED (failures=1)
```

#### #163 G10 code span in a destination — red

- HEAD: `2c6dc76a1ebec42cfe81a8f0ddef1c9f4a25ebf3`
- test file blob: `9804311fa404bde35a32a73cf9e9ed7c6673e9ad`; verifier blob: `c647c3d0a32d9a4339a6dceb00c434f2355e791c`
- command: `python3 -m unittest discover -s scripts -p test_verify_project.py -k test_g10_code_span_in_destination` (exit 1; `-B`, `scripts/__pycache__` removed first)

```
FAIL: test_g10_code_span_in_destination (test_verify_project.NoticesGrammarTest.test_g10_code_span_in_destination)
AssertionError: Lists differ: ['THIRD_PARTY_NOTICES.md:3: license reference "a`b`" does not exist'] != ['THIRD_PARTY_NOTICES.md:3: unsupported Markdown (unrecognized link)']
First differing element 0:
- ['THIRD_PARTY_NOTICES.md:3: license reference "a`b`" does not exist']
+ ['THIRD_PARTY_NOTICES.md:3: unsupported Markdown (unrecognized link)']
Ran 1 test in 0.002s
FAILED (failures=1)
```

#### #67 N1 image (deferred) (passed on first run; mutation: treat images as unrecognized) — red

- HEAD: `2c6dc76a1ebec42cfe81a8f0ddef1c9f4a25ebf3`
- test file blob: `9804311fa404bde35a32a73cf9e9ed7c6673e9ad`; verifier blob: `d0d3b61cd9b7fe3959d77236aed46bcecba2780c`
- command: `python3 -m unittest discover -s scripts -p test_verify_project.py -k test_n1_image` (exit 1; `-B`, `scripts/__pycache__` removed first)

```
FAIL: test_n1_image (test_verify_project.NoticesReferenceTest.test_n1_image)
AssertionError: Lists differ: ['THIRD_PARTY_NOTICES.md:3: unsupported Markdown (unrecognized link)'] != []
- ['THIRD_PARTY_NOTICES.md:3: unsupported Markdown (unrecognized link)']
+ []
Ran 1 test in 0.004s
FAILED (failures=1)
```

#### #69 N1 double-quoted title (deferred) (passed on first run; mutation: drop double-quoted titles from the link pattern) — red

- HEAD: `2c6dc76a1ebec42cfe81a8f0ddef1c9f4a25ebf3`
- test file blob: `9804311fa404bde35a32a73cf9e9ed7c6673e9ad`; verifier blob: `6bab311996d0876505f9ddbab1b806e8fd096f4e`
- command: `python3 -m unittest discover -s scripts -p test_verify_project.py -k test_n1_title_double` (exit 1; `-B`, `scripts/__pycache__` removed first)

```
FAIL: test_n1_title_double (test_verify_project.NoticesReferenceTest.test_n1_title_double)
AssertionError: Lists differ: ['THIRD_PARTY_NOTICES.md:3: unsupported Markdown (unrecognized link)'] != []
- ['THIRD_PARTY_NOTICES.md:3: unsupported Markdown (unrecognized link)']
+ []
Ran 1 test in 0.003s
FAILED (failures=1)
```

#### #70 N1 single-quoted title (deferred) (passed on first run; mutation: drop single-quoted titles) — red

- HEAD: `2c6dc76a1ebec42cfe81a8f0ddef1c9f4a25ebf3`
- test file blob: `9804311fa404bde35a32a73cf9e9ed7c6673e9ad`; verifier blob: `84625359d0a611874b67f0c8e09ff036bd6f1878`
- command: `python3 -m unittest discover -s scripts -p test_verify_project.py -k test_n1_title_single` (exit 1; `-B`, `scripts/__pycache__` removed first)

```
FAIL: test_n1_title_single (test_verify_project.NoticesReferenceTest.test_n1_title_single)
AssertionError: Lists differ: ['THIRD_PARTY_NOTICES.md:3: unsupported Markdown (unrecognized link)'] != []
- ['THIRD_PARTY_NOTICES.md:3: unsupported Markdown (unrecognized link)']
+ []
Ran 1 test in 0.004s
FAILED (failures=1)
```

#### #71 N1 parenthesized title (deferred) (passed on first run; mutation: drop parenthesized titles) — red

- HEAD: `2c6dc76a1ebec42cfe81a8f0ddef1c9f4a25ebf3`
- test file blob: `9804311fa404bde35a32a73cf9e9ed7c6673e9ad`; verifier blob: `a248aac17f22d212962f5b756b7f857ab936ccff`
- command: `python3 -m unittest discover -s scripts -p test_verify_project.py -k test_n1_title_paren` (exit 1; `-B`, `scripts/__pycache__` removed first)

```
FAIL: test_n1_title_paren (test_verify_project.NoticesReferenceTest.test_n1_title_paren)
AssertionError: Lists differ: ['THIRD_PARTY_NOTICES.md:3: unsupported Markdown (unrecognized link)'] != []
- ['THIRD_PARTY_NOTICES.md:3: unsupported Markdown (unrecognized link)']
+ []
Ran 1 test in 0.003s
FAILED (failures=1)
```

#### #72 N1 link after a code span (deferred) (passed on first run; mutation: skip the rest of a line after a code span) — red

- HEAD: `2c6dc76a1ebec42cfe81a8f0ddef1c9f4a25ebf3`
- test file blob: `9804311fa404bde35a32a73cf9e9ed7c6673e9ad`; verifier blob: `5df8877cb34aca057f70b18f1e5b482727c0816d`
- command: `python3 -m unittest discover -s scripts -p test_verify_project.py -k test_n1_after_code` (exit 1; `-B`, `scripts/__pycache__` removed first)

```
FAIL: test_n1_after_code_span (test_verify_project.NoticesReferenceTest.test_n1_after_code_span)
AssertionError: Lists differ: ['THIRD_PARTY_NOTICES.md:3: unsupported Markdown (unrecognized link)'] != []
- ['THIRD_PARTY_NOTICES.md:3: unsupported Markdown (unrecognized link)']
+ []
Ran 1 test in 0.002s
FAILED (failures=1)
```

#### #73 N1 two-space indent (deferred) (passed on first run; mutation: treat any indented line as indented code) — red

- HEAD: `2c6dc76a1ebec42cfe81a8f0ddef1c9f4a25ebf3`
- test file blob: `9804311fa404bde35a32a73cf9e9ed7c6673e9ad`; verifier blob: `f1d3614c50215b0efdd12ff2071eee82e018a351`
- command: `python3 -m unittest discover -s scripts -p test_verify_project.py -k test_n1_two_space` (exit 1; `-B`, `scripts/__pycache__` removed first)

```
FAIL: test_n1_two_space_indent (test_verify_project.NoticesReferenceTest.test_n1_two_space_indent)
AssertionError: Lists differ: ['THIRD_PARTY_NOTICES.md:3: unsupported Markdown (indented line with a link)'] != []
- ['THIRD_PARTY_NOTICES.md:3: unsupported Markdown (indented line with a link)']
+ []
Ran 1 test in 0.003s
FAILED (failures=1)
```

#### #146 G5 comment inside a fence (passed on first run; mutation: check constructs inside fences) — red

- HEAD: `2c6dc76a1ebec42cfe81a8f0ddef1c9f4a25ebf3`
- test file blob: `9804311fa404bde35a32a73cf9e9ed7c6673e9ad`; verifier blob: `0265f6686b91cd4ee5351d4314c16dcd5eace7b8`
- command: `python3 -m unittest discover -s scripts -p test_verify_project.py -k test_g5_comment_in_fence` (exit 1; `-B`, `scripts/__pycache__` removed first)

```
FAIL: test_g5_comment_in_fence (test_verify_project.NoticesGrammarTest.test_g5_comment_in_fence)
AssertionError: Lists differ: ['THIRD_PARTY_NOTICES.md:4: unsupported Ma[97 chars]ck)'] != []
+ []
- ['THIRD_PARTY_NOTICES.md:4: unsupported Markdown (raw HTML or autolink)',
-  'THIRD_PARTY_NOTICES.md:5: unsupported Markdown (unmatched backtick)']
Ran 1 test in 0.003s
FAILED (failures=1)
```

#### #147 G5 four spaces without a link (passed on first run; mutation: report every 4-space line) — red

- HEAD: `2c6dc76a1ebec42cfe81a8f0ddef1c9f4a25ebf3`
- test file blob: `9804311fa404bde35a32a73cf9e9ed7c6673e9ad`; verifier blob: `fd99845de5f21ded363dc5f5c0af7b71cb1d51ea`
- command: `python3 -m unittest discover -s scripts -p test_verify_project.py -k test_g5_four_spaces` (exit 1; `-B`, `scripts/__pycache__` removed first)

```
FAIL: test_g5_four_spaces_without_link (test_verify_project.NoticesGrammarTest.test_g5_four_spaces_without_link)
AssertionError: Lists differ: ['THIRD_PARTY_NOTICES.md:3: unsupported Markdown (indented line with a link)'] != []
- ['THIRD_PARTY_NOTICES.md:3: unsupported Markdown (indented line with a link)']
+ []
Ran 1 test in 0.003s
FAILED (failures=1)
```

#### #148 G5 comment inside a code span (passed on first run; mutation: look for < inside code spans) — red

- HEAD: `2c6dc76a1ebec42cfe81a8f0ddef1c9f4a25ebf3`
- test file blob: `9804311fa404bde35a32a73cf9e9ed7c6673e9ad`; verifier blob: `aa7517ba084934653505eefe3f34da2eb7d7ed8a`
- command: `python3 -m unittest discover -s scripts -p test_verify_project.py -k test_g5_comment_in_code` (exit 1; `-B`, `scripts/__pycache__` removed first)

```
FAIL: test_g5_comment_in_code_span (test_verify_project.NoticesGrammarTest.test_g5_comment_in_code_span)
AssertionError: Lists differ: ['THIRD_PARTY_NOTICES.md:3: unsupported Markdown (raw HTML or autolink)'] != []
- ['THIRD_PARTY_NOTICES.md:3: unsupported Markdown (raw HTML or autolink)']
+ []
Ran 1 test in 0.002s
FAILED (failures=1)
```

#### #149 G5 other backslash (passed on first run; mutation: report a backslash before any character) — red

- HEAD: `2c6dc76a1ebec42cfe81a8f0ddef1c9f4a25ebf3`
- test file blob: `9804311fa404bde35a32a73cf9e9ed7c6673e9ad`; verifier blob: `b80d8976d257b1fe4805980da7ed77403b07b568`
- command: `python3 -m unittest discover -s scripts -p test_verify_project.py -k test_g5_other_backslash` (exit 1; `-B`, `scripts/__pycache__` removed first)

```
FAIL: test_g5_other_backslash (test_verify_project.NoticesGrammarTest.test_g5_other_backslash)
AssertionError: Lists differ: ['THIRD_PARTY_NOTICES.md:3: unsupported Markdown (backslash escape)'] != []
- ['THIRD_PARTY_NOTICES.md:3: unsupported Markdown (backslash escape)']
+ []
Ran 1 test in 0.003s
FAILED (failures=1)
```

#### #150 G5 angle destination (passed on first run; mutation: treat every < as raw HTML) — red

- HEAD: `2c6dc76a1ebec42cfe81a8f0ddef1c9f4a25ebf3`
- test file blob: `9804311fa404bde35a32a73cf9e9ed7c6673e9ad`; verifier blob: `ddbabf6502ca41cee44a72b9311e4158a3ffd9aa`
- command: `python3 -m unittest discover -s scripts -p test_verify_project.py -k test_g5_angle` (exit 1; `-B`, `scripts/__pycache__` removed first)

```
FAIL: test_g5_angle_destination (test_verify_project.NoticesGrammarTest.test_g5_angle_destination)
AssertionError: Lists differ: ['THIRD_PARTY_NOTICES.md:3: unsupported Markdown (raw HTML or autolink)'] != []
- ['THIRD_PARTY_NOTICES.md:3: unsupported Markdown (raw HTML or autolink)']
+ []
Ran 1 test in 0.004s
FAILED (failures=1)
```

#### #153 G7 link text in a title (passed on first run; mutation: scan the title again (deviation: the table expected a natural red)) — red

- HEAD: `2c6dc76a1ebec42cfe81a8f0ddef1c9f4a25ebf3`
- test file blob: `9804311fa404bde35a32a73cf9e9ed7c6673e9ad`; verifier blob: `5b350a1b4212703357f8a7abab80c99bbb5d3221`
- command: `python3 -m unittest discover -s scripts -p test_verify_project.py -k test_g7` (exit 1; `-B`, `scripts/__pycache__` removed first)

```
FAIL: test_g7_link_text_in_title (test_verify_project.NoticesGrammarTest.test_g7_link_text_in_title)
AssertionError: Lists differ: [] != ['THIRD_PARTY_NOTICES.md: no inline link [MIT](LICENSE-CODE)']
- []
+ ['THIRD_PARTY_NOTICES.md: no inline link [MIT](LICENSE-CODE)']
Ran 1 test in 0.003s
FAILED (failures=1)
```

#### #156 G8 plain table row (passed on first run; mutation: report any | on a table row) — red

- HEAD: `2c6dc76a1ebec42cfe81a8f0ddef1c9f4a25ebf3`
- test file blob: `9804311fa404bde35a32a73cf9e9ed7c6673e9ad`; verifier blob: `f5fc3037f7b25b28a2786751e0c65a728092acd2`
- command: `python3 -m unittest discover -s scripts -p test_verify_project.py -k test_g8_plain` (exit 1; `-B`, `scripts/__pycache__` removed first)

```
FAIL: test_g8_plain_table_row (test_verify_project.NoticesGrammarTest.test_g8_plain_table_row)
AssertionError: Lists differ: ['THIRD_PARTY_NOTICES.md:3: unsupported Ma[38 chars]nt)'] != []
+ []
- ['THIRD_PARTY_NOTICES.md:3: unsupported Markdown (pipe inside a table cell '
-  'element)']
Ran 1 test in 0.003s
FAILED (failures=1)
```

#### #161 G9 plain list item (passed on first run; mutation: report every list item) — red

- HEAD: `2c6dc76a1ebec42cfe81a8f0ddef1c9f4a25ebf3`
- test file blob: `9804311fa404bde35a32a73cf9e9ed7c6673e9ad`; verifier blob: `2f067df952d83ea1c545e8e66f86519f333c297c`
- command: `python3 -m unittest discover -s scripts -p test_verify_project.py -k test_g9_plain` (exit 1; `-B`, `scripts/__pycache__` removed first)

```
FAIL: test_g9_plain_list_item (test_verify_project.NoticesGrammarTest.test_g9_plain_list_item)
AssertionError: Lists differ: ['THIRD_PARTY_NOTICES.md:3: unsupported Markdown (block inside a list item)'] != []
- ['THIRD_PARTY_NOTICES.md:3: unsupported Markdown (block inside a list item)']
+ []
Ran 1 test in 0.006s
FAILED (failures=1)
```

#### #162 G10 code span in link text (passed on first run; mutation: reject code spans in link text) — red

- HEAD: `2c6dc76a1ebec42cfe81a8f0ddef1c9f4a25ebf3`
- test file blob: `9804311fa404bde35a32a73cf9e9ed7c6673e9ad`; verifier blob: `f9d924211a79ff4613a6b6140a2b0c75862cdfd5`
- command: `python3 -m unittest discover -s scripts -p test_verify_project.py -k test_g10_code_span_in_link` (exit 1; `-B`, `scripts/__pycache__` removed first)

```
FAIL: test_g10_code_span_in_link_text (test_verify_project.NoticesGrammarTest.test_g10_code_span_in_link_text)
AssertionError: Lists differ: ['THIRD_PARTY_NOTICES.md:3: unsupported Markdown (unrecognized link)'] != []
- ['THIRD_PARTY_NOTICES.md:3: unsupported Markdown (unrecognized link)']
+ []
Ran 1 test in 0.004s
FAILED (failures=1)
```


### 2026-10-24 — Ruling I2-order

The tests for #190–#194 followed traceability row I2: the provenance reference first, then the
unreadable notices message. That contradicts the Messages order in traceability:246–248, where
unreadable inputs form group 1, ahead of provenance references. The implementation followed the
order list, so the five tests failed. The repository owner: "I2 以 Messages 的排序規則為準：無法讀取的輸入排第 1 組，修正 #190–#194 的預期。"

- #190–#194 now expect the unreadable notices message first. Their earlier failures checked the
  wrong expectation, so they are not reds.
- With the corrected expectation they passed on their first run. Their red is by mutation: unreadable
  inputs placed after the provenance references.
- The I2 row of `traceability.md` keeps the error, because the spec is frozen. It is corrected at the
  epic close-out and added to the carry list there.

### 2026-10-24 — Red records for #190–#202, committed with their green

- **Passed on their first run:** #195–#202, because the readers and ordering already existed. W1
  (#202) used the table's mutation. #195–#201 had "—" in the table, so their mutations are
  deviations.
- **Test literals:** #199 and #201 first failed on a test-literal error (an escaped backslash in a
  non-raw string). They were fixed with `chr(92)` before any record.

### 2026-10-24 — T-0007 handover: a `RecursionError` from Q

Checked on the installed interpreter, Python 3.13.11 with recursion limit 1000:

- a provenance `license_location` that is an array nested to the deepest level `json.loads`
  accepts (9,997 levels);
- a `license` value nested to its deepest accepted level (9,996).

In every case from five levels below the limit up to the limit, `check_license_references` returned
its message without raising. Q is not reachable with a `RecursionError` on this interpreter, so no
sub-case is added. Python 3.14 and later were not tested.

#### #195 I3 notices not readable (passed on first run; mutation: let read errors propagate (deviation: the table expected a natural red)) — red

- HEAD: `153e09ac2d9457f600a86208a59025ce87468812`
- test file blob: `73f8d885702e588e2299f14571601ef08bdb501d`; verifier blob: `0897334e2893463333d10566be9d9965dbfb4bfc`
- command: `python3 -m unittest discover -s scripts -p test_verify_project.py -k test_i3_unreadable_notices` (exit 1; `-B`, `scripts/__pycache__` removed first)

```
ERROR: test_i3_unreadable_notices (test_verify_project.NoticesInputOrderTest.test_i3_unreadable_notices)
PermissionError: [Errno 13] Permission denied: '/private/var/folders/z3/gp_vxt9j4vv4gmf09pmkprvr0000gn/T/tmp8cm2mm_w/THIRD_PARTY_NOTICES.md'
Ran 1 test in 0.004s
FAILED (errors=1)
```

#### #196 I4 both inputs missing (passed on first run; mutation: read the notices before the provenance file (deviation)) — red

- HEAD: `153e09ac2d9457f600a86208a59025ce87468812`
- test file blob: `73f8d885702e588e2299f14571601ef08bdb501d`; verifier blob: `56751b36eec96bd934afb7d5be27653eb2476f4a`
- command: `python3 -m unittest discover -s scripts -p test_verify_project.py -k test_i4` (exit 1; `-B`, `scripts/__pycache__` removed first)

```
FAIL: test_i4_both_missing (test_verify_project.NoticesInputOrderTest.test_i4_both_missing)
AssertionError: Lists differ: ['THIRD_PARTY_NOTICES.md: cannot read licen[96 chars]ng)'] != ['docs/agents/skill-sources.json: cannot re[96 chars]ng)']
First differing element 0:
- ['THIRD_PARTY_NOTICES.md: cannot read license references (missing)',
-  'docs/agents/skill-sources.json: cannot read license references (missing)']
? ^                                                                          ^
+ ['docs/agents/skill-sources.json: cannot read license references (missing)',
? ^                                                                          ^
+  'THIRD_PARTY_NOTICES.md: cannot read license references (missing)']
Ran 1 test in 0.003s
FAILED (failures=1)
```

#### #197 O1 group order (passed on first run; mutation: put constructs after the notices references (deviation)) — red

- HEAD: `153e09ac2d9457f600a86208a59025ce87468812`
- test file blob: `73f8d885702e588e2299f14571601ef08bdb501d`; verifier blob: `aff06f6aacc4f2a53d68c2859fd88c297bced976`
- command: `python3 -m unittest discover -s scripts -p test_verify_project.py -k test_o1` (exit 1; `-B`, `scripts/__pycache__` removed first)

```
FAIL: test_o1_group_order (test_verify_project.NoticesInputOrderTest.test_o1_group_order)
AssertionError: Lists differ: ['doc[116 chars]S.md:2: license reference "missing" does not e[136 chars]nk)'] != ['doc[116 chars]S.md:3: unsupported Markdown (raw HTML or auto[136 chars]DE)']
First differing element 1:
+  'THIRD_PARTY_NOTICES.md:3: unsupported Markdown (raw HTML or autolink)',
-  'THIRD_PARTY_NOTICES.md: no inline link [MIT](LICENSE-CODE)',
?                                                              ^
+  'THIRD_PARTY_NOTICES.md: no inline link [MIT](LICENSE-CODE)']
?                                                              ^
-  'THIRD_PARTY_NOTICES.md:3: unsupported Markdown (raw HTML or autolink)']
Ran 1 test in 0.003s
FAILED (failures=1)
```

#### #198 O2 column order (passed on first run; mutation: sort notices references by text (deviation)) — red

- HEAD: `153e09ac2d9457f600a86208a59025ce87468812`
- test file blob: `73f8d885702e588e2299f14571601ef08bdb501d`; verifier blob: `df98f8363b632c4933fe6fb3b3fb198b578f471c`
- command: `python3 -m unittest discover -s scripts -p test_verify_project.py -k test_o2` (exit 1; `-B`, `scripts/__pycache__` removed first)

```
FAIL: test_o2_column_order (test_verify_project.NoticesInputOrderTest.test_o2_column_order)
AssertionError: Lists differ: ['THI[37 chars]nce "aa" does not exist', 'THIRD_PARTY_NOTICES[41 chars]ist'] != ['THI[37 chars]nce "zz" does not exist', 'THIRD_PARTY_NOTICES[41 chars]ist']
First differing element 0:
- ['THIRD_PARTY_NOTICES.md:3: license reference "aa" does not exist',
?                                                ^^
+ ['THIRD_PARTY_NOTICES.md:3: license reference "zz" does not exist',
?                                                ^^
-  'THIRD_PARTY_NOTICES.md:3: license reference "zz" does not exist']
?                                                ^^
+  'THIRD_PARTY_NOTICES.md:3: license reference "aa" does not exist']
?                                                ^^
Ran 1 test in 0.003s
FAILED (failures=1)
```

#### #199 O3 control characters (passed on first run; mutation: skip the printable() pass of Q (deviation; the first run failed on a test literal, not on the code)) — red

- HEAD: `153e09ac2d9457f600a86208a59025ce87468812`
- test file blob: `73f8d885702e588e2299f14571601ef08bdb501d`; verifier blob: `d6c7f0ba7009abd134a90fb15f8e6928936c18e6`
- command: `python3 -m unittest discover -s scripts -p test_verify_project.py -k test_o3_control` (exit 1; `-B`, `scripts/__pycache__` removed first)

```
FAIL: test_o3_control_characters (test_verify_project.NoticesInputOrderTest.test_o3_control_characters)
AssertionError: Lists differ: ['doc[53 chars]\\\\\n\\u0007\u2028"] at "/license_location" is not a string'] != ['doc[53 chars]\\\\\n\\u0007\\u2028"] at "/license_location" is not a string']
First differing element 0:
- ['docs/agents/skill-sources.json: license reference ["\\"\\\\\\n\\u0007\u2028'
?                                                     -------------------------
+ ['docs/agents/skill-sources.json: license reference '
-  '"] at "/license_location" is not a string']
+  '["\\"\\\\\\n\\u0007\\u2028"] at "/license_location" is not a string']
?   ++++++++++++++++++++++++++
Ran 1 test in 0.004s
FAILED (failures=1)
```

#### #200 O3 printable non-ASCII (passed on first run; mutation: encode Q with ensure_ascii=True (deviation)) — red

- HEAD: `153e09ac2d9457f600a86208a59025ce87468812`
- test file blob: `73f8d885702e588e2299f14571601ef08bdb501d`; verifier blob: `059967716c3b1c23f9edc55745ec1bc1472e9c09`
- command: `python3 -m unittest discover -s scripts -p test_verify_project.py -k test_o3_printable` (exit 1; `-B`, `scripts/__pycache__` removed first)

```
FAIL: test_o3_printable_non_ascii (test_verify_project.NoticesInputOrderTest.test_o3_printable_non_ascii)
AssertionError: Lists differ: ['doc[43 chars]nce ["\\u6388\\u6b0a"] at "/license_location" is not a string'] != ['doc[43 chars]nce ["授權"] at "/license_location" is not a string']
First differing element 0:
- ['docs/agents/skill-sources.json: license reference ["\\u6388\\u6b0a"] at '
?                                                       ^^^^^^^^^^^^^^
+ ['docs/agents/skill-sources.json: license reference ["授權"] at '
?                                                       ^^
Ran 1 test in 0.003s
FAILED (failures=1)
```

#### #201 O4 pointer escapes (passed on first run; mutation: skip the ~0/~1 escapes in JSON Pointers (deviation; the first run failed on a test literal)) — red

- HEAD: `153e09ac2d9457f600a86208a59025ce87468812`
- test file blob: `73f8d885702e588e2299f14571601ef08bdb501d`; verifier blob: `090721a6e21b82b82456a730e3fd777c6cbd27aa`
- command: `python3 -m unittest discover -s scripts -p test_verify_project.py -k test_o4` (exit 1; `-B`, `scripts/__pycache__` removed first)

```
FAIL: test_o4_pointer_escapes (test_verify_project.NoticesInputOrderTest.test_o4_pointer_escapes)
AssertionError: Lists differ: ['doc[50 chars]ssing" at "/a/b/c~d/e\\"f//license_location" does not exist'] != ['doc[50 chars]ssing" at "/a~1b/c~0d/e\\"f//license_location" does not exist']
First differing element 0:
-  '"/a/b/c~d/e\\"f//license_location" does not exist']
?      ^
+  '"/a~1b/c~0d/e\\"f//license_location" does not exist']
?      ^^    +
Ran 1 test in 0.003s
FAILED (failures=1)
```

#### #202 W1 wiring (passed on first run; mutation: make verify() call the check before the glossary check) — red

- HEAD: `153e09ac2d9457f600a86208a59025ce87468812`
- test file blob: `73f8d885702e588e2299f14571601ef08bdb501d`; verifier blob: `512e1006f5dc9afd01b35eada267b79e7d5692bd`
- command: `python3 -m unittest discover -s scripts -p test_verify_project.py -k test_w1` (exit 1; `-B`, `scripts/__pycache__` removed first)

```
FAIL: test_w1_wiring (test_verify_project.NoticesInputOrderTest.test_w1_wiring)
AssertionError: Lists differ: ['GLOSSARY.md is missing, not a regular file, or blank'] != ['THIRD_PARTY_NOTICES.md:3: license reference "missing" does not exist']
First differing element 0:
- ['GLOSSARY.md is missing, not a regular file, or blank']
+ ['THIRD_PARTY_NOTICES.md:3: license reference "missing" does not exist']
Ran 1 test in 0.003s
FAILED (failures=1)
```

#### #190 I2 notices missing (passed on first run; mutation: place unreadable inputs after the provenance references (Ruling I2-order; the first expectation followed the I2 row)) — red

- HEAD: `153e09ac2d9457f600a86208a59025ce87468812`
- test file blob: `bff6c244f0c6143c3cd028f3c4651749c0fbfdac`; verifier blob: `2d40145d6c6edb1a0defd301b384001c0c84fd0f`
- command: `python3 -m unittest discover -s scripts -p test_verify_project.py -k test_i2_missing` (exit 1; `-B`, `scripts/__pycache__` removed first)

```
FAIL: test_i2_missing (test_verify_project.NoticesInputOrderTest.test_i2_missing)
AssertionError: Lists differ: ['docs/agents/skill-sources.json: license r[121 chars]ng)'] != ['THIRD_PARTY_NOTICES.md: cannot read licen[121 chars]ist']
First differing element 0:
+ ['THIRD_PARTY_NOTICES.md: cannot read license references (missing)',
- ['docs/agents/skill-sources.json: license reference "missing" at '
? ^
+  'docs/agents/skill-sources.json: license reference "missing" at '
? ^
-  '"/license_location" does not exist',
?                                      ^
+  '"/license_location" does not exist']
?                                      ^
-  'THIRD_PARTY_NOTICES.md: cannot read license references (missing)']
Ran 1 test in 0.006s
```

#### #191 I2 notices a symlink (passed on first run; mutation: place unreadable inputs after the provenance references (Ruling I2-order; the first expectation followed the I2 row)) — red

- HEAD: `153e09ac2d9457f600a86208a59025ce87468812`
- test file blob: `bff6c244f0c6143c3cd028f3c4651749c0fbfdac`; verifier blob: `2d40145d6c6edb1a0defd301b384001c0c84fd0f`
- command: `python3 -m unittest discover -s scripts -p test_verify_project.py -k test_i2_symlink` (exit 1; `-B`, `scripts/__pycache__` removed first)

```
FAIL: test_i2_symlink (test_verify_project.NoticesInputOrderTest.test_i2_symlink)
AssertionError: Lists differ: ['docs/agents/skill-sources.json: license r[123 chars]nk)'] != ['THIRD_PARTY_NOTICES.md: cannot read licen[123 chars]ist']
First differing element 0:
+ ['THIRD_PARTY_NOTICES.md: cannot read license references (a symlink)',
- ['docs/agents/skill-sources.json: license reference "missing" at '
? ^
+  'docs/agents/skill-sources.json: license reference "missing" at '
? ^
-  '"/license_location" does not exist',
?                                      ^
+  '"/license_location" does not exist']
?                                      ^
-  'THIRD_PARTY_NOTICES.md: cannot read license references (a symlink)']
Ran 1 test in 0.004s
```

#### #192 I2 notices a directory (passed on first run; mutation: place unreadable inputs after the provenance references (Ruling I2-order; the first expectation followed the I2 row)) — red

- HEAD: `153e09ac2d9457f600a86208a59025ce87468812`
- test file blob: `bff6c244f0c6143c3cd028f3c4651749c0fbfdac`; verifier blob: `2d40145d6c6edb1a0defd301b384001c0c84fd0f`
- command: `python3 -m unittest discover -s scripts -p test_verify_project.py -k test_i2_directory` (exit 1; `-B`, `scripts/__pycache__` removed first)

```
FAIL: test_i2_directory (test_verify_project.NoticesInputOrderTest.test_i2_directory)
AssertionError: Lists differ: ['docs/agents/skill-sources.json: license r[132 chars]le)'] != ['THIRD_PARTY_NOTICES.md: cannot read licen[132 chars]ist']
First differing element 0:
+ ['THIRD_PARTY_NOTICES.md: cannot read license references (not a regular file)',
- ['docs/agents/skill-sources.json: license reference "missing" at '
? ^
+  'docs/agents/skill-sources.json: license reference "missing" at '
? ^
-  '"/license_location" does not exist',
?                                      ^
+  '"/license_location" does not exist']
?                                      ^
-  'THIRD_PARTY_NOTICES.md: cannot read license references (not a regular file)']
Ran 1 test in 0.004s
```

#### #193 I2 notices not UTF-8 (passed on first run; mutation: place unreadable inputs after the provenance references (Ruling I2-order; the first expectation followed the I2 row)) — red

- HEAD: `153e09ac2d9457f600a86208a59025ce87468812`
- test file blob: `bff6c244f0c6143c3cd028f3c4651749c0fbfdac`; verifier blob: `2d40145d6c6edb1a0defd301b384001c0c84fd0f`
- command: `python3 -m unittest discover -s scripts -p test_verify_project.py -k test_i2_not_utf8` (exit 1; `-B`, `scripts/__pycache__` removed first)

```
FAIL: test_i2_not_utf8 (test_verify_project.NoticesInputOrderTest.test_i2_not_utf8)
AssertionError: Lists differ: ['docs/agents/skill-sources.json: license r[123 chars]-8)'] != ['THIRD_PARTY_NOTICES.md: cannot read licen[123 chars]ist']
First differing element 0:
+ ['THIRD_PARTY_NOTICES.md: cannot read license references (not UTF-8)',
- ['docs/agents/skill-sources.json: license reference "missing" at '
? ^
+  'docs/agents/skill-sources.json: license reference "missing" at '
? ^
-  '"/license_location" does not exist',
?                                      ^
+  '"/license_location" does not exist']
?                                      ^
-  'THIRD_PARTY_NOTICES.md: cannot read license references (not UTF-8)']
Ran 1 test in 0.003s
```

#### #194 I2 notices in another case (passed on first run; mutation: place unreadable inputs after the provenance references (Ruling I2-order; the first expectation followed the I2 row)) — red

- HEAD: `153e09ac2d9457f600a86208a59025ce87468812`
- test file blob: `bff6c244f0c6143c3cd028f3c4651749c0fbfdac`; verifier blob: `2d40145d6c6edb1a0defd301b384001c0c84fd0f`
- command: `python3 -m unittest discover -s scripts -p test_verify_project.py -k test_i2_other_case` (exit 1; `-B`, `scripts/__pycache__` removed first)

```
FAIL: test_i2_other_case (test_verify_project.NoticesInputOrderTest.test_i2_other_case)
AssertionError: Lists differ: ['docs/agents/skill-sources.json: license r[121 chars]ng)'] != ['THIRD_PARTY_NOTICES.md: cannot read licen[121 chars]ist']
First differing element 0:
+ ['THIRD_PARTY_NOTICES.md: cannot read license references (missing)',
- ['docs/agents/skill-sources.json: license reference "missing" at '
? ^
+  'docs/agents/skill-sources.json: license reference "missing" at '
? ^
-  '"/license_location" does not exist',
?                                      ^
+  '"/license_location" does not exist']
?                                      ^
-  'THIRD_PARTY_NOTICES.md: cannot read license references (missing)']
Ran 1 test in 0.003s
```


### 2026-10-24 — Stage 5 close: texts, checks, coverage (items 3–5, 7, 8)

All checks ran at HEAD `3ef5103`, the last commit that changes code, tests or target texts. The
commit adding this Comment changes only this ticket.

**Texts (item 5)**, as committed in `3ef5103`:

- T4: `docs/adr/0008-verifier-license-reference-contract.md`, English, with `status: accepted` and
  `date: 2026-10-24`. It records:
  - the grammar contract, the fifteen constructs and the unclosed fence;
  - the file-system-only check: committed state is not checked, E2 is the one check, OQ-4 tracks a
    standing one;
  - the skipped destinations (`#` anchors and `http`, `https`, `mailto`);
  - the required link texts;
  - the end-to-end harness;
  - "Amends ADR-0007";
  - the consequences.
- T5: the `docs/README.md` index line after ADR-0007, verbatim.
- T7: the `AGENTS.md` slide hard rule ends with the T7 sentence, verbatim. The T3 paragraph is
  unchanged since T-0007.
- T8: item 6, "Notices check", in "What the track keeps" of `docs/agents/workflow.md`, verbatim.
- T9: the `_Amended by [ADR-0008]…_` line after ADR-0007's title, verbatim.
- T1–T3 and T6 still hold, from T-0007.

**Checks (items 4, 7):**

- `python3 scripts/verify-project.py` exits 0 with the T1 PASS line (W2 on the worktree).
- `python3 -m unittest discover -s scripts -p 'test_*.py'` ran 327 tests, OK: 138 at T-0007's B, 44
  and 20 from T-0007, and 125 new test methods here. #177–#189 changed existing methods.
- A direct `python3 scripts/test_verify_project.py` ran 211 tests, OK.
- `python3 scripts/check_style_skills.py` passes.
- X1: `git diff --name-only 99ba5ec...HEAD` lists:
  - the two tickets;
  - `AGENTS.md`, `docs/README.md`, `docs/adr/0007-license-split.md`, the new ADR-0008 and
    `docs/agents/workflow.md`;
  - `scripts/test_verify_project.py` and `scripts/verify-project.py`.

  All are in X1.
- W3, by AST:
  - the imports are T-0007's allow-list: `hashlib`, `json`, `os`, `pathlib`, `re`, `stat`, `sys`,
    `tomllib`, `unicodedata`;
  - there is no forbidden `os.*` call, no `__import__` and no built-in `open(`;
  - the `replace` calls are on `str`, at lines 178 (present at B) and 293.
- W4: `git diff 99ba5ec...HEAD -- scripts/verify-project.py` has five hunks. All lie in the block that
  begins with T-0007's `# chalkdeck:` epic-0005 comment: new constants, rule 2's whitespace, the
  `holder` loop unchanged in substance, the input reader, and the notices code. No other check
  changed.
- W1 passes (#202).

**Coverage, measured.** The command was `python3 -I -B <scratchpad>/cov/measure8.py .`. It runs
these seven test classes under `trace` and compares hit lines with the executable lines of the 15
new functions: `ProvenanceReferenceTest`, `LicenseAgreementTest`, `ProvenanceInputTest`,
`NoticesReferenceTest`, `RequiredLinkTest`, `NoticesGrammarTest` and `NoticesInputOrderTest`. 189
tests ran, with 0 failures, 0 errors and 0 skipped on macOS as a non-root user. This is line coverage,
not branch coverage.

| Seam | Tests | Measured coverage | Acceptance criterion | Uncovered, and why |
|---|---|---|---|---|
| `check_license_references(root)`: (b) and the path rules through the notices | #65–#112 | `_destination_reason` 11/11, `_resolve` 23/23, `_links` 9/9 | AC1 (D4); AC2 (N1–N6, R1–R7) | none |
| same: (c) | #164–#176 | within `_notices_messages`, 34/34 | AC2 (C1–C4) | none |
| same: grammar | #113–#163 | `_construct` 41/41, `_code_spans` 10/10, `_inside` 1/1 | AC2 (G1–G10) | none |
| same: inputs, order, rendering | #177–#201, with T-0007's #50–#64 | `_read_input` 25/27, `_provenance_messages` 22/22, `check_license_references` 4/4 | AC3 (I1–I4, O1–O4) | lines 320–321: `not readable` for an `os.listdir` error other than missing or not-a-directory on an input's own path, which no approved sub-case reaches (for example a parent directory without read permission) |
| `verify()` | #202 | — | AC4 (W1) | — |
| total, epic 0005 block | 189 | 210/212 lines (99.1%) | — | as above |

**AC status for the epic** (T-0007's tables cover the rows it closed):

| Spec AC | Status | Evidence |
|---|---|---|
| AC1 | met: P1–P9, D1–D3, D5, D6 in T-0007; D4 here | T-0007 red records; #65 |
| AC2 | met: N, R, C, G rows here; R2, R3 and R7 provenance-side cases in T-0007 | red records for #66–#176 |
| AC3 | met: I1 (T-0007 #50–#62, extended by #177–#189), I2 (#190–#194), I3 (T-0007 #63–#64, #195), I4 (#196), O1–O4 (#197–#201) | red records for #177–#189 and #190–#202 |
| AC4 | W1, W3 and W4 met; W2 met on the worktree; final W2 with E1 at stage 8 | this Comment |
| AC5 | T1–T3 and T6 (T-0007) and T4, T5, T7–T9 (here) met | this Comment |
| AC6 | stage 8 (E1–E4) | — |
| AC7 | X1, X2 and X3 met for this ticket | "Base and drift check"; this Comment |

**Deviations from the approved table, all recorded above:**

- **Mutations not in the table.** Some sub-cases took their red by a mutation the table did not
  name, because code written for an earlier row made them pass on their first run: #80–#112, #153
  and #195–#201.
- **Order.** #3, #4 and the deferred N1 reds (#67, #69–#73) were taken out of table order.
- **Ruling I2-order** changed #190–#194's expectation.

Stage 5 is done; `status` is `review`.

### 2026-10-24 — Stage 6 code review

Scope: committed changes, B `99ba5ec` to HEAD `c408b68`; staged, unstaged and untracked layers
empty. Two `harness-reviewer` passes, Standards and Spec, ran in parallel on one packet (about
0.36M subagent tokens). HEAD and status were unchanged when both reports came back. Findings are
condensed per axis; none is dropped.

**Standards** (18 findings and about 12 smells; repeats of T-0007 lessons are marked "repeat").

- S-1 (repeat, high, low–medium): the test plan table lacks workflow's columns.
- S-2 (high, medium): 52 G and C tests were written up front, then implemented together
  (horizontal slicing).
- S-3 (repeat, high, medium): implementation ran ahead of tests. 46 N and R sub-cases and #195–#202
  passed on their first run.
- S-4 (repeat at larger scale, high, medium): about 41 mutations were not in the approved table
  (#80–#112, #153, #195–#201). They are labelled "deviation" without approval.
- S-5 (repeat, high, low): 7 red outputs are cut short. Two records' `-k` patterns matched other
  tests too (`test_i1_symlink`, `test_i1_directory`), and #75's pattern also ran #74.
- S-6 (repeat, high, low): five top-level definitions in the test file have one blank line before
  them, not two.
- S-7 (repeat, high, low): double blank lines and unwrapped paragraphs in this ticket; workflow
  item 6 is one long line.
- S-8 (medium, low): the deviation list cites "#3, #4", which are not T-0008 numbers.
- S-9 (high, low): the I1-extension red headings carry a range, not individual numbers.
- S-10 (high, low): the #190–#202 records sit under the RecursionError heading.
- S-11 (medium, low): `processing` was set in the second commit, not the first.
- S-12 (medium, low): T-0007's `done` reaches `main` only when T-0008 lands.
- S-13 (low, low): ADR-0008 changes the deck track defined in ADR-0004 too, and ADR-0004 has no
  "Amended by" line.
- S-14 (low–medium, low): ADR-0008 says a `|` "inside a code span, link text or title"; the code also
  flags one in a destination.
- S-15 (high, low): the test file's `# chalkdeck:` marker still says "provenance side, T-0007".
- S-16 (high, low): the `_provenance_messages` and `_notices_messages` docstrings misdescribe their
  return values.
- S-17 (high, low): the coverage table lists 10 of the 15 functions, and the `verify()` row has no
  figure.
- S-18 (medium, low): the W4 record misnames hunk 3 (it is `_unreadable`, not the input reader).
- Smells:
  - the bare `== 2` drive test is repeated in `_destination_reason` (repeat of M3);
  - the backtick-info-string condition appears twice, and `FENCE.match` runs three times;
  - `_construct` and `_notices_messages` are long;
  - a lambda is assigned to a name;
  - group-1 messages pass through an output parameter;
  - tuples are unpacked by position;
  - `tail = match and …`;
  - the closer regex is rebuilt on every line;
  - test helpers are duplicated (`none`, `expect_text`, hand-written missing-link and unreadable
    strings);
  - `test_g5_angle_destination` duplicates `test_n1_angle`;
  - test names: `b = chr(92)`, O3 and O4 in a "Notices" class, D4 placed before the helpers, an
    unused `names`, the spelling `licence_messages`;
  - the `NOTICES` constant is duplicated;
  - the loose-blob evidence (F10) recurs.

**Spec** (no high finding; the grammar matches its definitions).

- A1 (medium, low): `tab indentation` treats only spaces and tabs as leading whitespace, so a line
  starting with U+3000 and then a tab is not reported.
- A2 (low, low): the table-row test uses `lstrip()`, but the spec says the "first non-space
  character". The two space notions disagree.
- A3 (medium, low): `\d` in list markers matches non-ASCII digits.
- B (high/low reachability, medium): a `RecursionError` from Q is not handled as traceability:83–85
  defines. The 3.13.11 probe does not give a general reason. On 3.11 the reviewer reasons the margin
  is zero; 3.14 is unknown.
- C (medium, low): W4 read literally fails, because some changed lines are T-0007 code already
  present at B, not a new block. The record used the intent reading.
- D1 (high, medium): as S-3 and S-4.
- D2 (medium, low): the red records' command lines omit `-I`.
- D3 (high, low): as S-8.
- D4 (high fact, low): X2 says "B is the first Comment, before any commit". Here a T-0007 handover
  Comment and commit `b391a96` came first.
- D5 (high, low): `test_r4_normalization` can skip for a reason outside the three allowed skip
  kinds.
- D6 (high, low): O1's line numbers differ from the matrix but match approved row #197.
- D7 (high, low): the I2 row still has the old order, which is on the close-out carry list.
- E (high, low): branches with no test, whose removal would survive the suite:
  - the title `<` exemption;
  - `|` in link text or a destination on a table row;
  - the escapes `\]`, `\)`, `\>`;
  - the list markers `*`, `+` and `1)`;
  - U+FEFF after line 1;
  - a tab before a destination or title.
- F (low): the texts T4, T5 and T7–T9 match. ADR-0008 adds a correct `Name <email>` consequence that
  T4 did not ask for.

Worst per axis: Standards S-4 (about 41 unapproved mutations); Spec B (the `RecursionError`
handling the spec defines is missing).

### 2026-10-24 — Stage 6 rulings and amended test plan

The repository owner: "H1–H5 都照建議，#203–#216 核准。"

- **H1** (S-4, D1): the mutations used for #80–#112, #153 and #195–#201, each recorded with its red,
  are approved after the fact. Two process faults go to the epic retrospective: implementation that
  ran ahead of its tests (S-3), and writing a batch of tests up front (S-2).
- **H2** (Spec B): a guard implements traceability:83–85. A `RecursionError` raised while the
  provenance file is walked or rendered by Q gives `not valid JSON` and drops the messages already
  collected for that file. It cannot be triggered on the reference interpreter, so it has no test;
  the coverage table names its lines.
- **H3** (E, A1–A3): rows #203–#216 are approved as shown to the owner. The last column is the
  mutation for a first-run pass, fixed here before the tests run. #214–#216 change the
  implementation: leading whitespace by `str.isspace()`, "first non-space" meaning U+0020 only, and
  ASCII digits in list markers.
- **H4** (C, D5): W4 is judged by intent: every changed line lies in the epic-0005 `# chalkdeck:`
  block, T-0007 code in it included. `test_r4_normalization`'s skip, when a file system does not keep
  NFD names, is an allowed platform skip; APFS keeps them.
- **H5** (S-13): ADR-0004 gets no "Amended by ADR-0008" line. ADR-0008 amends the notices exception
  that ADR-0007 already added to the deck track.

| # | Row | Sub-case (line 3) | Expected | Mutation if the first run passes |
|---|---|---|---|---|
| 203 | G5 | `[x](LICENSE "a<b")` | `[]` | drop the title exemption for `<` |
| 204 | G8 | `\| [a\|b](LICENSE) \|` | `M(3, pipe inside a table cell element)` | leave link text out of the pipe check |
| 205 | G8 | `\| [x](a\|b) \|` | `M(3, pipe inside a table cell element)` | leave destinations out of the pipe check |
| 206 | G3 | `a\]b` | `M(3, backslash escape)` | drop `]` from the escape set |
| 207 | G3 | `a\)b` | `M(3, backslash escape)` | drop `)` from the escape set |
| 208 | G3 | `a\>b` | `M(3, backslash escape)` | drop `>` from the escape set |
| 209 | G9 | `* ~~~` | `M(3, block inside a list item)` | accept only `-` as a bullet |
| 210 | G9 | `+ > q` | `M(3, block inside a list item)` | drop `+` as a bullet |
| 211 | G9 | `1) [lc]: LICENSE` | `M(3, block inside a list item)` | accept only `.` after an ordered marker |
| 212 | G5 | U+FEFF, then `text` | `[]` | report a BOM on any line |
| 213 | N1 | `[x](LICENSE` + tab + `"t")` | `[]` | allow only spaces before a title |
| 214 | G3 | U+3000, tab, `text` | `M(3, tab indentation)` | natural red expected |
| 215 | G3 | tab, `` \| `a\|b` \| `` | `M(3, tab indentation)` | natural red expected |
| 216 | G9 | `١. > quote` | `[]` | natural red expected |

### 2026-10-24 — Red records for #203–#216, committed with their green

- **Natural reds:** #214–#216, as the table expected. They turned green with the A1–A3 fixes:
  - leading whitespace by `str.isspace()`;
  - the table-row test uses `lstrip(" ")`;
  - ASCII `[0-9]` in list markers.
- **Passed on their first run:** #203–#213, which took the table's mutations.
- **#205:** the first run failed because the destination `a|b` did not exist, which added a
  `does not exist` reference that the approved expectation omits. The fixture now creates `a|b`; the
  expectation is unchanged. That first run is not a red record.

#### #214 G3 U+3000 then tab — red

- HEAD: `1dfc146dddc87b457d966c46783af6348d474e02`
- test file blob: `a69c3b06d765d620d15a64d6e3e184ed31c08180`; verifier blob: `48c5806ca77ad50911e9d61464450b8a3d98d29b`
- command: `python3 -m unittest discover -s scripts -p test_verify_project.py -k test_g3_unicode_space` (exit 1; `-B`, `scripts/__pycache__` removed first)

```
FAIL: test_g3_unicode_space_then_tab (test_verify_project.NoticesGrammarTest.test_g3_unicode_space_then_tab)
AssertionError: Lists differ: [] != ['THIRD_PARTY_NOTICES.md:3: unsupported Markdown (tab indentation)']
- []
+ ['THIRD_PARTY_NOTICES.md:3: unsupported Markdown (tab indentation)']
Ran 1 test in 0.003s
FAILED (failures=1)
```

#### #215 G3 tab before a table row — red

- HEAD: `1dfc146dddc87b457d966c46783af6348d474e02`
- test file blob: `a69c3b06d765d620d15a64d6e3e184ed31c08180`; verifier blob: `48c5806ca77ad50911e9d61464450b8a3d98d29b`
- command: `python3 -m unittest discover -s scripts -p test_verify_project.py -k test_g3_tab_before_table` (exit 1; `-B`, `scripts/__pycache__` removed first)

```
FAIL: test_g3_tab_before_table_row (test_verify_project.NoticesGrammarTest.test_g3_tab_before_table_row)
AssertionError: Lists differ: ['THI[17 chars]md:3: unsupported Markdown (pipe inside a table cell element)'] != ['THI[17 chars]md:3: unsupported Markdown (tab indentation)']
First differing element 0:
- ['THIRD_PARTY_NOTICES.md:3: unsupported Markdown (pipe inside a table cell '
?                                                   --------------   ^ ^^^^^^
+ ['THIRD_PARTY_NOTICES.md:3: unsupported Markdown (tab indentation)']
?                                                      ^^^^ ^^^^^^^^ +
-  'element)']
Ran 1 test in 0.003s
FAILED (failures=1)
```

#### #216 G9 non-ASCII digit marker — red

- HEAD: `1dfc146dddc87b457d966c46783af6348d474e02`
- test file blob: `a69c3b06d765d620d15a64d6e3e184ed31c08180`; verifier blob: `48c5806ca77ad50911e9d61464450b8a3d98d29b`
- command: `python3 -m unittest discover -s scripts -p test_verify_project.py -k test_g9_non_ascii` (exit 1; `-B`, `scripts/__pycache__` removed first)

```
FAIL: test_g9_non_ascii_digit_marker (test_verify_project.NoticesGrammarTest.test_g9_non_ascii_digit_marker)
AssertionError: Lists differ: ['THIRD_PARTY_NOTICES.md:3: unsupported Markdown (block inside a list item)'] != []
- ['THIRD_PARTY_NOTICES.md:3: unsupported Markdown (block inside a list item)']
+ []
Ran 1 test in 0.003s
FAILED (failures=1)
```

#### #203 G5 < in a title (passed on first run; mutation: drop the title exemption for <) — red

- HEAD: `1dfc146dddc87b457d966c46783af6348d474e02`
- test file blob: `a69c3b06d765d620d15a64d6e3e184ed31c08180`; verifier blob: `fabe7b566a809456702ef5302fc62035993a5b1e`
- command: `python3 -m unittest discover -s scripts -p test_verify_project.py -k test_g5_angle_bracket_in_title` (exit 1; `-B`, `scripts/__pycache__` removed first)

```
FAIL: test_g5_angle_bracket_in_title (test_verify_project.NoticesGrammarTest.test_g5_angle_bracket_in_title)
AssertionError: Lists differ: ['THIRD_PARTY_NOTICES.md:3: unsupported Markdown (raw HTML or autolink)'] != []
- ['THIRD_PARTY_NOTICES.md:3: unsupported Markdown (raw HTML or autolink)']
+ []
Ran 1 test in 0.004s
FAILED (failures=1)
```

#### #204 G8 | in link text (passed on first run; mutation: leave link text out of the pipe check) — red

- HEAD: `1dfc146dddc87b457d966c46783af6348d474e02`
- test file blob: `a69c3b06d765d620d15a64d6e3e184ed31c08180`; verifier blob: `c19a926c9778daf43a24fb150c4ec8692338ddc2`
- command: `python3 -m unittest discover -s scripts -p test_verify_project.py -k test_g8_pipe_in_link_text` (exit 1; `-B`, `scripts/__pycache__` removed first)

```
FAIL: test_g8_pipe_in_link_text (test_verify_project.NoticesGrammarTest.test_g8_pipe_in_link_text)
AssertionError: Lists differ: [] != ['THIRD_PARTY_NOTICES.md:3: unsupported Ma[38 chars]nt)']
- []
+ ['THIRD_PARTY_NOTICES.md:3: unsupported Markdown (pipe inside a table cell '
+  'element)']
Ran 1 test in 0.004s
FAILED (failures=1)
```

#### #205 G8 | in a destination (passed on first run; mutation: leave destinations out of the pipe check) — red

- HEAD: `1dfc146dddc87b457d966c46783af6348d474e02`
- test file blob: `a69c3b06d765d620d15a64d6e3e184ed31c08180`; verifier blob: `255c93f97d87c12ad3fbc34c9128ae6dad335a42`
- command: `python3 -m unittest discover -s scripts -p test_verify_project.py -k test_g8_pipe_in_destination` (exit 1; `-B`, `scripts/__pycache__` removed first)

```
FAIL: test_g8_pipe_in_destination (test_verify_project.NoticesGrammarTest.test_g8_pipe_in_destination)
AssertionError: Lists differ: [] != ['THIRD_PARTY_NOTICES.md:3: unsupported Ma[38 chars]nt)']
- []
+ ['THIRD_PARTY_NOTICES.md:3: unsupported Markdown (pipe inside a table cell '
+  'element)']
Ran 1 test in 0.003s
FAILED (failures=1)
```

#### #206 G3 escaped ] (passed on first run; mutation: drop ] from the escape set) — red

- HEAD: `1dfc146dddc87b457d966c46783af6348d474e02`
- test file blob: `a69c3b06d765d620d15a64d6e3e184ed31c08180`; verifier blob: `0096521bb9088a7e69e6e0efb552dc7743af6da1`
- command: `python3 -m unittest discover -s scripts -p test_verify_project.py -k test_g3_escaped_closing_bracket` (exit 1; `-B`, `scripts/__pycache__` removed first)

```
FAIL: test_g3_escaped_closing_bracket (test_verify_project.NoticesGrammarTest.test_g3_escaped_closing_bracket)
AssertionError: Lists differ: [] != ['THIRD_PARTY_NOTICES.md:3: unsupported Markdown (backslash escape)']
- []
+ ['THIRD_PARTY_NOTICES.md:3: unsupported Markdown (backslash escape)']
Ran 1 test in 0.002s
FAILED (failures=1)
```

#### #207 G3 escaped ) (passed on first run; mutation: drop ) from the escape set) — red

- HEAD: `1dfc146dddc87b457d966c46783af6348d474e02`
- test file blob: `a69c3b06d765d620d15a64d6e3e184ed31c08180`; verifier blob: `597445bcc1ca46486dd795cf9072b05aae1b5931`
- command: `python3 -m unittest discover -s scripts -p test_verify_project.py -k test_g3_escaped_closing_paren` (exit 1; `-B`, `scripts/__pycache__` removed first)

```
FAIL: test_g3_escaped_closing_paren (test_verify_project.NoticesGrammarTest.test_g3_escaped_closing_paren)
AssertionError: Lists differ: [] != ['THIRD_PARTY_NOTICES.md:3: unsupported Markdown (backslash escape)']
- []
+ ['THIRD_PARTY_NOTICES.md:3: unsupported Markdown (backslash escape)']
Ran 1 test in 0.003s
FAILED (failures=1)
```

#### #208 G3 escaped > (passed on first run; mutation: drop > from the escape set) — red

- HEAD: `1dfc146dddc87b457d966c46783af6348d474e02`
- test file blob: `a69c3b06d765d620d15a64d6e3e184ed31c08180`; verifier blob: `34175f6260ae3a79dd190c6c37e559417b4c62f3`
- command: `python3 -m unittest discover -s scripts -p test_verify_project.py -k test_g3_escaped_greater` (exit 1; `-B`, `scripts/__pycache__` removed first)

```
FAIL: test_g3_escaped_greater_than (test_verify_project.NoticesGrammarTest.test_g3_escaped_greater_than)
AssertionError: Lists differ: [] != ['THIRD_PARTY_NOTICES.md:3: unsupported Markdown (backslash escape)']
- []
+ ['THIRD_PARTY_NOTICES.md:3: unsupported Markdown (backslash escape)']
Ran 1 test in 0.002s
FAILED (failures=1)
```

#### #209 G9 * marker (passed on first run; mutation: accept only - as a bullet) — red

- HEAD: `1dfc146dddc87b457d966c46783af6348d474e02`
- test file blob: `a69c3b06d765d620d15a64d6e3e184ed31c08180`; verifier blob: `06e8456e16bce8eb910f0cb9bd6174bdc7b98a0c`
- command: `python3 -m unittest discover -s scripts -p test_verify_project.py -k test_g9_star` (exit 1; `-B`, `scripts/__pycache__` removed first)

```
FAIL: test_g9_star_marker (test_verify_project.NoticesGrammarTest.test_g9_star_marker)
AssertionError: Lists differ: [] != ['THIRD_PARTY_NOTICES.md:3: unsupported Markdown (block inside a list item)']
- []
+ ['THIRD_PARTY_NOTICES.md:3: unsupported Markdown (block inside a list item)']
Ran 1 test in 0.002s
FAILED (failures=1)
```

#### #210 G9 + marker (passed on first run; mutation: drop + as a bullet) — red

- HEAD: `1dfc146dddc87b457d966c46783af6348d474e02`
- test file blob: `a69c3b06d765d620d15a64d6e3e184ed31c08180`; verifier blob: `26a8630d0b6bbf7c5ff5a4cb1b6af76f15e0acbe`
- command: `python3 -m unittest discover -s scripts -p test_verify_project.py -k test_g9_plus` (exit 1; `-B`, `scripts/__pycache__` removed first)

```
FAIL: test_g9_plus_marker (test_verify_project.NoticesGrammarTest.test_g9_plus_marker)
AssertionError: Lists differ: [] != ['THIRD_PARTY_NOTICES.md:3: unsupported Markdown (block inside a list item)']
- []
+ ['THIRD_PARTY_NOTICES.md:3: unsupported Markdown (block inside a list item)']
Ran 1 test in 0.002s
FAILED (failures=1)
```

#### #211 G9 1) marker (passed on first run; mutation: accept only . after an ordered marker) — red

- HEAD: `1dfc146dddc87b457d966c46783af6348d474e02`
- test file blob: `a69c3b06d765d620d15a64d6e3e184ed31c08180`; verifier blob: `e69acb5e3ae88871208cfb0c8210ed4cf9e9dfb1`
- command: `python3 -m unittest discover -s scripts -p test_verify_project.py -k test_g9_paren_marker` (exit 1; `-B`, `scripts/__pycache__` removed first)

```
FAIL: test_g9_paren_marker (test_verify_project.NoticesGrammarTest.test_g9_paren_marker)
AssertionError: Lists differ: [] != ['THIRD_PARTY_NOTICES.md:3: unsupported Markdown (block inside a list item)']
- []
+ ['THIRD_PARTY_NOTICES.md:3: unsupported Markdown (block inside a list item)']
Ran 1 test in 0.003s
FAILED (failures=1)
```

#### #212 G5 BOM after line 1 (passed on first run; mutation: report a BOM on any line) — red

- HEAD: `1dfc146dddc87b457d966c46783af6348d474e02`
- test file blob: `a69c3b06d765d620d15a64d6e3e184ed31c08180`; verifier blob: `509e7539159503bdc5b5e287e321dbb232256088`
- command: `python3 -m unittest discover -s scripts -p test_verify_project.py -k test_g5_byte_order_mark_after` (exit 1; `-B`, `scripts/__pycache__` removed first)

```
FAIL: test_g5_byte_order_mark_after_line_1 (test_verify_project.NoticesGrammarTest.test_g5_byte_order_mark_after_line_1)
AssertionError: Lists differ: ['THIRD_PARTY_NOTICES.md:3: unsupported Markdown (byte order mark)'] != []
- ['THIRD_PARTY_NOTICES.md:3: unsupported Markdown (byte order mark)']
+ []
Ran 1 test in 0.003s
FAILED (failures=1)
```

#### #213 N1 tab before a title (passed on first run; mutation: allow only spaces before a title) — red

- HEAD: `1dfc146dddc87b457d966c46783af6348d474e02`
- test file blob: `a69c3b06d765d620d15a64d6e3e184ed31c08180`; verifier blob: `2132921fac536cebe7119c7fee8e1afc6bb3de45`
- command: `python3 -m unittest discover -s scripts -p test_verify_project.py -k test_n1_tab_before_title` (exit 1; `-B`, `scripts/__pycache__` removed first)

```
FAIL: test_n1_tab_before_title (test_verify_project.NoticesGrammarTest.test_n1_tab_before_title)
AssertionError: Lists differ: ['THIRD_PARTY_NOTICES.md:3: unsupported Markdown (unrecognized link)'] != []
- ['THIRD_PARTY_NOTICES.md:3: unsupported Markdown (unrecognized link)']
+ []
Ran 1 test in 0.012s
FAILED (failures=1)
```

### 2026-10-24 — Stage 6 fixes: corrections, checks and coverage at `3e0d609`

The code and texts after the stage-6 rulings are in `967a227` (#203–#216 and A1–A3) and `3e0d609`
(the H2 guard, refactors, ADR-0008 wording and the `workflow.md` rewrap). Every check below ran at
`3e0d609`; the commit adding this Comment changes only this ticket.

**Record corrections:**

- S-8/D3: in "Stage 5 close", read the order deviation as "the deferred N1 reds (#67, #69–#73)".
  "#3, #4" belong to T-0007.
- S-9: the thirteen records headed "I1 ext `test_i1_<name>` (T-0008 #177-#189)" map in table order to
  #177–#189: `missing`, `symlink`, `symlinked_parent`, `directory`, `fifo`, `docs_is…`,
  `directory_in_other…`, `not_utf8`, `not_valid_json`, `utf8_bom`, `deep_nesting`, `long_integer`,
  `top_level_array`.
- S-10: the records listed after the "T-0007 handover: a `RecursionError` from Q" heading are the
  #190–#202 records announced under "Red records for #190–#202".
- S-5: some records' `-k` patterns also matched other tests:
  - `test_i1_symlink` also ran `…symlinked_parent`, and `test_i1_directory` also ran
    `…directory_in_other_case`;
  - #75's `test_n2_http` also ran #74's `https` test.

  In the two I1 cases, both tests were red at the time and each also has its own record. In #75's
  run, the `https` test passed under the mutation and the `http` test failed, so the record still
  shows #75's red.
  Seven records keep only the first differing lines, without the `FAILED (…)` summary; their exit
  code is on the command line.
- D2: as in T-0007, every run used `python3 -I -B` after removing `scripts/__pycache__`. The
  command lines show the unittest part only.
- D4/S-11: the first branch commit (`b391a96`) only set T-0007 to `done`. This ticket's `processing`
  status and its B Comment came in the second commit (`f943f09`), before any code or test change. The
  "Handed over from T-0007" section precedes the B Comment because T-0007 wrote it. X2 holds in
  substance.
- S-18: W4's hunks are now listed below.

**Test plan in workflow columns** (S-1; the approved rows are unchanged):

| Seam | Test intent | Scope | Acceptance criterion | Boundary conditions |
|---|---|---|---|---|
| `check_license_references(root)` on a `LicenseFixture`, notices from line 3 | (b) and the path rules through notices | #65–#112, #213 | AC1 (D4); AC2 (N1–N6, R1–R7) | link forms, skipped schemes and anchors, empty, scheme, fragment, line, outside, not plain, missing, case, normalization, symlink, not a file, unlistable, unsearchable, tab before a title |
| same | (c) | #164–#176 | AC2 (C1–C4) | absent, only in skipped regions, fragment, angle, title, wrong text, swapped, image, `./`, case, padded and lower-case text |
| same | the grammar | #113–#163, #203–#212, #214–#216 | AC2 (G1–G10) | fences, code spans, each of the fifteen constructs, priority pairs, link-like text in titles, table rows, list items, code spans in links, `<` in titles, `\|` in link text and destinations, the other escapes, other list markers, BOM after line 1, Unicode leading whitespace, tab before a table row, non-ASCII digits |
| same | inputs, order, rendering | #177–#201 | AC3 (I1–I4, O1–O4) | unreadable provenance with notices, unreadable notices, both, group order, column order, control and non-ASCII characters, pointer escapes |
| `verify()` | wiring | #202 | AC4 (W1) | glossary message right before the license messages |

**Checks** (W2, X1, X3):

- `python3 scripts/verify-project.py` exits 0 with the T1 PASS line.
- `python3 -m unittest discover -s scripts -p 'test_*.py'` ran 341 tests, OK.
- A direct `python3 scripts/test_verify_project.py` ran 225 tests, OK.
- `python3 scripts/check_style_skills.py` passes.
- `git diff --name-only 99ba5ec...HEAD` lists only X1 paths: the two tickets, `AGENTS.md`,
  `docs/README.md`, ADR-0007, ADR-0008, `docs/agents/workflow.md` and the two scripts.

**W3, by AST:**

- imports: `hashlib`, `json`, `os`, `pathlib`, `re`, `stat`, `sys`, `tomllib`, `unicodedata`;
- no forbidden `os.*` call, no `__import__` and no built-in `open(`;
- `replace` only on `str`, at lines 178 and 297.

**W4, judged by intent (Ruling H4).** `git diff 99ba5ec...HEAD -- scripts/verify-project.py` has six
hunks:

1. new constants;
2. rule 2's whitespace in `_resolve`;
3. the new `_scheme_reason`;
4. `_location_reason` using it;
5. `_unreadable`'s new signature;
6. the provenance and notices code.

All lie after the epic-0005 `# chalkdeck:` comment at line 214, and no other check changed.

**Coverage, measured.** Command: `python3 -I -B <scratchpad>/cov/measure8.py .`, with the seven
license test classes under `trace`. 203 tests ran, with 0 failures, 0 errors and 0 skipped.

| Seam | Tests | Measured coverage | Acceptance criterion | Uncovered, and why |
|---|---|---|---|---|
| `check_license_references(root)`: provenance (`_locations`, `_location_reason`, `_scheme_reason`, `_quoted`, `_parse_int`, `_unreadable`) | T-0007 #1–#64; #65, #199–#201 | 11/11, 11/11, 2/2, 2/2, 3/3, 1/1 | AC1, AC3 | none |
| same: `_provenance_messages` | as above | 23/26 | AC1, AC3 | lines 372 and 375–376: the H2 `RecursionError` guard, which cannot be triggered on CPython 3.13.11 (Ruling H2) |
| same: `_read_input` | #50–#64, #177–#196 | 25/27 | AC3 | lines 324–325: `not readable` when a directory on an input's path cannot be listed (an `os.listdir` error other than missing or not-a-directory); no approved sub-case reached it then (#221 later did) |
| same: (b) and paths (`_destination_reason`, `_resolve`, `_links`) | #65–#112, #213 | 9/9, 23/23, 8/8 | AC2 | none |
| same: grammar (`_construct`, `_code_spans`, `_inside`, `_fence_opener`) | #113–#163, #203–#212, #214–#216 | 42/42, 10/10, 1/1, 2/2 | AC2 | none |
| same: `_notices_messages`, `check_license_references` | all notices rows | 34/34, 4/4 | AC2, AC3 | none |
| `verify()` | #202 | not measured (outside the epic block) | AC4 | `verify()` was changed by one call in T-0007 |
| total, epic 0005 block (17 functions) | 203 | 211/216 lines (97.7%) | — | as above |

**AC status for the epic** is unchanged from "Stage 5 close", with #203–#216 added to AC2. AC6
(E1–E4) remains for stage 8.

### 2026-10-24 — Stage 6 code review, fix round

Scope: committed changes `1dfc146..b59a223` (four commits: `967a227`, `3e0d609`, `2159b1c`,
`b59a223`), the fixes under Rulings H1–H5 and rows #203–#216. Staged, unstaged and untracked layers
were empty. Same two axes, run in parallel on one packet (about 0.24M subagent tokens). HEAD, status
and the captured diff were unchanged when both reports came back. Neither reviewer had a shell; the
parent checked what they could not:

- all 14 records for #203–#216 cite test file blob `a69c3b06…`;
- those records give the flags as `-B` only;
- the ticket has a double blank line before "Stage 6 fixes" (line 3137), as well as at 578, 1303,
  2399 and 2696.

Both reviewers found `3e0d609` behaviour-preserving apart from the H2 guard, the #203–#216 tests
matching the approved table, and the coverage figures (211/216, uncovered lines 372, 375–376 and
324–325) matching HEAD.

**Standards** (12 findings, 10 smells). First-round status:

- fixed: S-6, S-14 (rewrap aside), S-15, S-16;
- partly fixed: S-7 (item 6 rewrapped; old double blank lines remain), S-17 (`verify()` still has
  no figure);
- handled by a note: S-1 (after-the-fact column table, not approved before tests), S-5, S-8, S-9,
  S-10, S-11, S-18;
- by ruling: S-2, S-3, S-4 (H1), S-13 (H5);
- no disposition: S-12.

Smells fixed: the `== 2` repeat, the lambda, `tail = match and`, the duplicated helpers and
`NOTICES`, `b`, `names`, `licence`. Partly: `FENCE.match` runs twice, not three times; the
unreadable messages are still hand-written in tests. Not addressed: long `_construct` and
`_notices_messages`, positional tuple unpacking, the closer regex rebuilt per line, the duplicated
angle test, O3 and O4 in a Notices class, D4 before the helpers, F10.

- N-1 (high conf., medium-low): `3e0d609` is typed `refactor` but carries the H2 behaviour change,
  ADR-0008 decision text and the `workflow.md` rewrap.
- N-2 (high, medium): #203–#216 were written as one batch before any ran (one shared test blob;
  #205's first run shows all fourteen ran together). This repeats S-2, which H1 had just sent to
  the retrospective.
- N-3 (high, low): a double blank line before "Stage 6 fixes" (line 3137).
- N-4 (high, low): line 3178's table cell holds an unescaped `|` (in "`|` in link text and
  destinations"), which splits the row in GFM.
- N-5 (high, low): ADR-0008 lines 23 and 25 run to 101 and 110 columns after the edit.
- N-6 (high, low): `NoticesGrammarTest`'s docstring still says #113–#163; #213 (N1) sits in the
  grammar class while the plan table and `NoticesReferenceTest` place it under (b).
- N-7 (medium, low): the new records say `-B`; the D2 correction says every run used `-I -B`.
- N-8 (medium, low): #205's fixture `a|b` was added after the first run without row approval, and
  `|` is not a legal Windows file name (no skip guard).
- N-9 (medium, low): the guard's comment, "CPython 3.13 cannot reach it…", turns one 3.13.11 probe
  into a general claim; the project supports 3.11+.
- N-10 (high, low): S-12 has no disposition.
- N-11 (medium, low): line 3148's "test_i1_" followed by an angle-bracket placeholder sits outside a
  code span and renders as raw HTML.
- N-12 (high, low): the coverage table lists #213 under both (b) and the grammar; the plan table
  lists it under (b) only.
- Smells:
  - K-1: `_scheme_reason` matches `SCHEME` again after its callers did, and raises `TypeError` for
    a target without a scheme;
  - K-2: `_fence_opener` returns `None` for both "not a fence" and "rejected fence", so callers
    match `FENCE` again;
  - K-3: the guard's `try` spans the whole loop, `_resolve`'s I/O included;
  - K-4: #203–#216 are appended in plan order, not grouped by row;
  - K-5: `RequiredLinkTest` inherits helpers it does not use, and `NoticesCase`'s "from line 3"
    docstring does not fit `expect_text`;
  - K-6: the unaddressed first-round smells above;
  - K-7: the `_notices_messages` and `_provenance_messages` docstrings are ambiguous ("(A, then B
    followed by C)", "returns none");
  - K-8: F10 recurs, with 11 uncommitted mutation blobs;
  - K-9: `# chalkdeck:` markers differ between the two scripts, and the verifier comment cites a
    ticket id;
  - K-10: the renamed `rendered = …` line in the tests runs to about 130 columns.
  - Low confidence, possibly out of scope: `workflow.md` line 64 is one long line too.

**Spec** (15 findings, all low). First-round status: A1, A3 and B (under H2) fixed; A2 fixed but its
branch is untested (P-4, P-5); C, D1, D5 by ruling (H1, H4); D2 by note (but see P-9); D3 corrected;
D4 judged without a ruling (P-10); D6 and F not addressed (P-11); D7 deferred (Ruling I2-order);
E mostly fixed (P-2).

- P-1 (medium conf.): T8 gives item 6 "shown as Markdown source" on one line, and only T2, T3 and
  T6 allow rewrapping; `3e0d609` split it into four lines. Read literally, AC5/T8 fails; S-7 and T8
  conflict and need a ruling.
- P-2 (high): a tab before a destination (`\([ \t]*`, `[ \t]*\)` in `LINK`) has no test; #213 covers
  the title only.
- P-3 (high): the backtick in the escape set (line 460) has no test; first-round E missed it too.
- P-4 (high): the A2 branch that skips leading spaces before a table row (line 446) has no test;
  `line.startswith("|")` would pass the suite.
- P-5 (medium): A2 narrows detection. A row starting with U+3000 or U+00A0, then a `|` in a code
  span, was reported before and now gives nothing, though GFM still splits it into cells. This
  follows the spec's wording and H3, so it is a spec-level gap.
- P-6 (medium): the guard also wraps `_location_reason` and `_resolve`, wider than "by json.loads,
  or by Q" (traceability:83–85) and "walked or rendered by Q" (H2).
- P-7 (medium): as N-9; the comment also names only Q, though the guard covers the walk.
- P-8 (medium): the rulings' readings of the spec are not on the close-out carry list: H3
  ("first non-space" is U+0020, digits are ASCII), H2 ("walked"), H4 (the R4 skip outside the
  spec's three skip kinds).
- P-9 (medium): as N-7.
- P-10 (medium): D4 was judged "X2 holds in substance" without an owner ruling; X2's wording does
  not hold.
- P-11 (high): D6 (O1's line numbers differ from the matrix) and F (ADR-0008's `Name <email>`
  consequence not asked for by T4) have no ruling.
- P-12 (high): the coverage table's "on an input's own path" for lines 324–325 is imprecise (it is a
  directory on the path that cannot be listed); traceability:526 lists "parent unlistable" as an
  I1–I3 boundary with no test.
- P-13 (high): as N-12.
- P-14 (high): as N-5.
- P-15 (medium): as N-2.

Worst per axis: Standards N-2 (the fix round's own tests written as one batch); Spec P-1 (T8's
one-line text against the S-7 rewrap) and P-5 (non-ASCII-indented table rows now pass silently).

### 2026-10-24 — Fix-round rulings

The repository owner: "J1–J8 都照建議，#217–#221 核准。"

- **J1** (P-1, S-7): item 6 of `workflow.md` goes back to T8's one-line text.
- **J2** (P-2, P-3, P-4, P-12): rows #217–#221 are approved as below. Each is written and run on its
  own before the next; the last column is fixed here before the run.
- **J3** (P-6, K-3, N-9, P-7): the guard keeps its width. Its comment is corrected to say that the
  3.13.11 probe could not reach it and that it covers the walk as well as Q.
- **J4** (P-5, P-8, P-10, P-11): to the epic close-out.
  - P-5, table rows indented with non-ASCII whitespace, goes into `OPEN-QUESTIONS.md`.
  - The spec corrections, with the I2 row: the readings in H2 ("walked"), H3 (U+0020, ASCII
    digits) and H4 (the R4 skip); X2's wording (D4); O1's line numbers (D6).
  - F: ADR-0008's `Name <email>` consequence is accepted.
- **J5**: the document and docstring fixes N-3, N-4, N-5 (P-14), N-6, N-11, N-12 (P-13), P-12's
  wording, K-7 and K-10. N-7 (P-9): the record template printed `-B` while the runner ran
  `python3 -I -B`; the template is corrected for later records.
- **J6** (N-8): #205's fixture `a|b` is approved after the fact. Windows is not a verification
  surface of this verifier, so no skip guard is added.
- **J7** (N-1, N-2, K-8, N-10): N-1 (commit type), N-2 (the batch of #203–#216) and K-8 (F10 again)
  go to the retrospective; history is not rewritten. S-12 is accepted: T-0007's `done` lands with
  this ticket's PR.
- **J8**: the other smells (K-1, K-2, K-4, K-5, K-6, K-9) stay as they are.
- No third stage-6 round. After these fixes the checks and the coverage measurement are re-run at
  the final HEAD, and the ticket moves to stage 7.

| # | Row | Sub-case (line 3) | Expected | Mutation if the first run passes |
|---|---|---|---|---|
| 217 | N1 | `[x](`, tab, `LICENSE)` | `[]` | allow only spaces after `(` |
| 218 | N1 | `[x](LICENSE`, tab, `)` | `[]` | allow only spaces before `)` |
| 219 | G3 | ``a\`b\`c`` (the backticks pair, so `unmatched backtick` does not apply) | `M(3, backslash escape)` | drop the backtick from the escape set |
| 220 | G8 | two spaces, then `` \| `a\|b` \| `` | `M(3, pipe inside a table cell element)` | test `line.startswith("\|")` |
| 221 | I3 | provenance; `docs/agents` mode 0o333, searchable but not listable (skipped as root) | `U(not readable)` | let `os.listdir` errors propagate |

### 2026-10-24 — Red records for #217–#221, committed with their green

Each row was written, run on its own and recorded before the next was written (Ruling J2), so each
record cites its own test file blob. All five passed on their first run and took the approved
mutation. The template now prints the `-I -B` flags the runner has always used (Ruling J5, N-7).

#### #217 N1 tab before a destination (passed on first run; mutation: allow only spaces after `(`) — red

- HEAD: `d9bd00fca2cb20ea408d28a4c926e967bc7ad79c`
- test file blob: `e01c200690cfe56fc49fd5e1ee40cc9c58768125`; verifier blob: `76fa9f70a194a067b8c46333de041f530f34e0d7`
- command: `python3 -m unittest discover -s scripts -p test_verify_project.py -k *test_n1_tab_before_destination` (exit 1; `-I -B`, `scripts/__pycache__` removed first)

```
FAIL: test_n1_tab_before_destination (test_verify_project.NoticesReferenceTest.test_n1_tab_before_destination)
AssertionError: Lists differ: ['THIRD_PARTY_NOTICES.md:3: unsupported Markdown (unrecognized link)'] != []
- ['THIRD_PARTY_NOTICES.md:3: unsupported Markdown (unrecognized link)']
+ []
Ran 1 test in 0.003s
FAILED (failures=1)
```

#### #218 N1 tab before the closing parenthesis (passed on first run; mutation: allow only spaces before `)`) — red

- HEAD: `d9bd00fca2cb20ea408d28a4c926e967bc7ad79c`
- test file blob: `5c2715b2f6a3c4e291a1dc6a6491bb7318ea7fef`; verifier blob: `5735e84eefac625e921b06996d0615b52659d461`
- command: `python3 -m unittest discover -s scripts -p test_verify_project.py -k *test_n1_tab_before_closing_paren` (exit 1; `-I -B`, `scripts/__pycache__` removed first)

```
FAIL: test_n1_tab_before_closing_paren (test_verify_project.NoticesReferenceTest.test_n1_tab_before_closing_paren)
AssertionError: Lists differ: ['THIRD_PARTY_NOTICES.md:3: unsupported Markdown (unrecognized link)'] != []
- ['THIRD_PARTY_NOTICES.md:3: unsupported Markdown (unrecognized link)']
+ []
Ran 1 test in 0.002s
FAILED (failures=1)
```

#### #219 G3 escaped backtick (passed on first run; mutation: drop the backtick from the escape set) — red

- HEAD: `d9bd00fca2cb20ea408d28a4c926e967bc7ad79c`
- test file blob: `67cba8fb8d6689c41c84f4accae24f015248799f`; verifier blob: `cc116f43b46f92b7bad08695499b408828de7f49`
- command: `python3 -m unittest discover -s scripts -p test_verify_project.py -k *test_g3_escaped_backtick` (exit 1; `-I -B`, `scripts/__pycache__` removed first)

```
FAIL: test_g3_escaped_backtick (test_verify_project.NoticesGrammarTest.test_g3_escaped_backtick)
AssertionError: Lists differ: [] != ['THIRD_PARTY_NOTICES.md:3: unsupported Markdown (backslash escape)']
- []
+ ['THIRD_PARTY_NOTICES.md:3: unsupported Markdown (backslash escape)']
Ran 1 test in 0.004s
FAILED (failures=1)
```

#### #220 G8 spaces before a table row (passed on first run; mutation: test `line.startswith("|")`) — red

- HEAD: `d9bd00fca2cb20ea408d28a4c926e967bc7ad79c`
- test file blob: `74363dbdd719a68719effd55f604ff7ac60a86ed`; verifier blob: `1b5dcece898bb14e5a40d48383076766d2da4d9d`
- command: `python3 -m unittest discover -s scripts -p test_verify_project.py -k *test_g8_spaces_before_table_row` (exit 1; `-I -B`, `scripts/__pycache__` removed first)

```
FAIL: test_g8_spaces_before_table_row (test_verify_project.NoticesGrammarTest.test_g8_spaces_before_table_row)
AssertionError: Lists differ: [] != ['THIRD_PARTY_NOTICES.md:3: unsupported Ma[38 chars]nt)']
- []
+ ['THIRD_PARTY_NOTICES.md:3: unsupported Markdown (pipe inside a table cell '
+  'element)']
Ran 1 test in 0.005s
FAILED (failures=1)
```

#### #221 I3 provenance parent not listable (passed on first run; mutation: let `os.listdir` errors propagate) — red

- HEAD: `d9bd00fca2cb20ea408d28a4c926e967bc7ad79c`
- test file blob: `d4a99e8d678bfec0e6bbea25f8b2fa88db32b490`; verifier blob: `d255191f10a59f25542c42d81b66fc9a2488a5e2`
- command: `python3 -m unittest discover -s scripts -p test_verify_project.py -k *test_i3_unlistable_directory` (exit 1; `-I -B`, `scripts/__pycache__` removed first)

```
ERROR: test_i3_unlistable_directory (test_verify_project.ProvenanceInputTest.test_i3_unlistable_directory)
PermissionError: [Errno 13] Permission denied: '/private/var/folders/z3/gp_vxt9j4vv4gmf09pmkprvr0000gn/T/tmpzcnt2psd/docs/agents'
Ran 1 test in 0.002s
FAILED (errors=1)
```

### 2026-10-24 — Fix-round fixes and final checks at `073f843`

Code and tests are final at `073f843`: #217–#221 in `5f05675`, and the J3, J5 comments, docstrings
and test layout in `073f843`, which changes no behaviour. The commit adding this Comment carries
J1 (`workflow.md` item 6 back to T8's one-line text), N-5 (ADR-0008 rewrapped) and the ticket fixes
N-3, N-4, N-11, N-12 and P-12's wording. Every check below ran on that tree.

**Checks** (W2, X1, X3):

- `python3 scripts/verify-project.py` exits 0 with the T1 PASS line.
- `python3 -m unittest discover -s scripts -p 'test_*.py'` ran 346 tests, OK.
- A direct `python3 scripts/test_verify_project.py` ran 230 tests, OK.
- `python3 scripts/check_style_skills.py` passes.
- `git diff --name-only 99ba5ec...HEAD` lists only X1 paths, as before.

**W3, by AST:** the same nine imports; no forbidden `os.*` call, no `__import__` and no built-in
`open(`; `replace` only on `str`, at lines 178 and 297.

**W4, by intent (Ruling H4):** the diff from `99ba5ec` keeps its six hunks, all after the epic-0005
`# chalkdeck:` comment at line 214.

**Coverage, measured.** Command: `python3 -I -B <scratchpad>/cov/measure8.py .`, with the seven
license test classes under `trace`. 208 tests ran, with 0 failures, 0 errors and 0 skipped.

| Seam | Tests | Measured coverage | Acceptance criterion | Uncovered, and why |
|---|---|---|---|---|
| `check_license_references(root)`: provenance (`_locations`, `_location_reason`, `_scheme_reason`, `_quoted`, `_parse_int`, `_unreadable`) | T-0007 #1–#64; #65, #199–#201 | 11/11, 11/11, 2/2, 2/2, 3/3, 1/1 | AC1, AC3 | none |
| same: `_provenance_messages` | as above | 23/26 | AC1, AC3 | lines 372, 376 and 377: the H2 `RecursionError` guard, which a probe on CPython 3.13.11 could not trigger (Rulings H2, J3) |
| same: `_read_input` | #50–#64, #177–#196, #221 | 27/27 | AC3 | none |
| same: (b) and paths (`_destination_reason`, `_resolve`, `_links`) | #65–#112, #213, #217, #218 | 9/9, 23/23, 8/8 | AC2 | none |
| same: grammar (`_construct`, `_code_spans`, `_inside`, `_fence_opener`) | #113–#163, #203–#212, #214–#216, #219, #220 | 42/42, 10/10, 1/1, 2/2 | AC2 | none |
| same: `_notices_messages`, `check_license_references` | all notices rows | 34/34, 4/4 | AC2, AC3 | none |
| `verify()` | #202 | not measured (outside the epic block) | AC4 | `verify()` was changed by one call in T-0007 |
| total, epic 0005 block (17 functions) | 208 | 213/216 lines (98.6%) | — | as above |

**AC status:** unchanged from "Stage 5 close", with #203–#212, #214–#216, #219 and #220 added to AC2
(grammar), #213, #217 and #218 to AC2 (b), and #221 to AC3. AC6 (E1–E4) remains for stage 8.
Stage 6 is closed, with no third round ("Fix-round rulings"); the next step is stage 7.

### 2026-10-24 — Stage 7 security review

Report: `.proj.specs/0005-license-reference-check/review/security-T-0008.md`. Scope: base
`99ba5ec` (origin/main) to HEAD `2c2a48f`, committed changes only; HEAD and status were unchanged
across the review. The project security-review skill ran one candidate pass (10 candidates) and two
independent false-positive passes (about 0.26M subagent tokens). The parent executed the verifier on
each candidate input and rendered it with pandoc's GFM reader, a proxy for GitHub that is not GitHub
itself; the rest is code reasoning.

**Confirmed findings: 0.** No candidate is newly introduced, crosses a trust boundary, and reaches
HIGH/MEDIUM with confidence ≥ 0.8. Real but below the threshold or excluded:

- C-01–C-04 (LOW): spec-level grammar gaps where GitHub renders the notices differently from what
  the verifier sees, against ADR-0008's own principle. Each PASSes in the verifier; pandoc confirms
  the different rendering:
  - C-01: a `\r` on a fence closer desynchronises fence state;
  - C-02: nested list markers or a tab after a marker hide blocks, including a refdef that makes
    `[MIT][x]` link to any URL;
  - C-03: table rows without a leading `|` split a link into cells;
  - C-04: a refdef label over two lines is not caught.
- C-05 (INFO): front matter, math and control characters, unverified or near false positive.
- C-06: `https:` without `//` is skipped; a quality gap, a false positive as a security issue.
- C-07 (LOW, excluded as DoS): notices parsing is quadratic (8,000 code spans on one line take
  5.6 s); fail-closed.
- C-08, C-09, C-10 (INFO): new paths to SEC-06, SEC-08 and SEC-03 (G1), and the deck-track
  instruction; the earlier dispositions still fit.

The report's "後續事項" lists them for the repository owner.

### 2026-10-24 — Stage 7 rulings

The repository owner: "L1–L4 都照建議。"

- **L1** (C-01–C-04, C-05, C-06): no change in T-0008, because each fix needs the spec and ADR-0008
  revised. At the epic close-out the grammar gaps go to `.proj.specs/OPEN-QUESTIONS.md`, and after
  0005 a separate epic tightens the notices grammar, starting from the report's "後續事項" item 1.
- **L2** (C-07): no hardening now; recorded only, as G3 for T-0007.
- **L3** (C-08, C-10): the three sentences for workflow item 6 (check that the diff touches only
  the deck and the notices' Assets rows before running; the verifier's output is data, not
  instructions; report the result to the owner, not on a public PR) go into the L1 epic, since
  Ruling J1 keeps item 6 at T8's text.
- **L4** (C-09): with G1, into `OPEN-QUESTIONS.md` at the close-out, noting that a traceback on
  the deck track also blocks the merge.

Close-out carry list for epic 0005, adding to T-0007's: L1, L4 (OQ, with D2, G1 and G2); the J4
items (P-5 into OQ; the spec corrections for H2, H3, H4, D4 and D6, with the I2 row; F accepted);
the retrospective items F10, M7, N14, S-2, S-3, N-1, N-2 and K-8; after 0005, the D3
documentation-ticket epic and the L1 notices-grammar epic.

### 2026-10-24 — Stage 8 verification, E1–E4 (surface: the verifier CLI on macOS)

The epic's E1–E4 are judged on this ticket's HEAD, the last ticket of epic 0005 (spec, "Several
tickets"). They ran at HEAD `382ddc3`. Code and tests are unchanged since `073f843`:
`git diff --name-only 073f843 HEAD` lists only the security report, this ticket, ADR-0008 and
`workflow.md` (J1, N-5). Every run used `python3 -I -B` after removing `scripts/__pycache__`.

- **E1** (the work tree): `scripts/verify-project.py` in `.worktrees/T-0008` exits 0 with the T1
  PASS line.
- **E2** (committed state): `git worktree add --detach <scratchpad>/e2e/t0008-head HEAD`;
  `git worktree list` shows it as `382ddc3 (detached HEAD)`. That checkout's own
  `scripts/verify-project.py` exits 0 with the same PASS line.
- **E3** (one broken link): in that checkout, line 34's destination was changed from
  `.agents/skills/code-review/LICENSE` to `.agents/skills/code-review/LICENCE` (`git diff --stat`:
  one line in `THIRD_PARTY_NOTICES.md`). Its script exits 1, and its whole output is one line:
  `FAIL: THIRD_PARTY_NOTICES.md:34: license reference ".agents/skills/code-review/LICENCE" does not exist`.
- **E4** (cleanup): `git worktree list` showed the checkout as detached at `382ddc3`;
  `git worktree remove --force` removed it, and `git worktree list` no longer shows it. The other
  worktrees are unchanged.

AC6 is met. Stage 8 is done; next is stage 9, push and a PR described with `/tw-emoji-pr-note`.

### 2026-10-24 — Landed

PR #13 merged into `main` at 2026-10-24T13:02:49Z as merge commit
`2c36505711a0810d8645c1015bc0a87d11008003`, head `e28a662`, confirmed with `gh pr view 13`.
`status` is now `done`. This change is committed on the epic 0005 close-out branch
(`specs/0005-license-reference-check-closeout`, from `2c36505`) and reaches `main` with the
close-out's PR. With T-0007 and T-0008 done, every ticket of epic 0005 has landed; the close-out
follows `docs/agents/workflow.md` ("Epic close-out") and the carry list in "Stage 7 rulings".
