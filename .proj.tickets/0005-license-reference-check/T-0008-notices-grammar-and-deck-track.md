---
id: T-0008
title: The verifier enforces the notices link grammar and required links, and the deck track runs it
epic: 0005-license-reference-check
status: processing
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

