# Traceability — 0005 license reference check

Source of truth for scope. `spec.en.md` prose is derived from this file. The repository owner's
answers are quoted in `grill.md` and in the Rulings of `review/round-1.md`. This epic is the
verifier half of the split epic 0003. It starts from the License references, Valid target and
Messages drafts in `../0003-license-split/traceability.md` (revision 2), and changes them where
`grill.md` or the round-1 Rulings say so.

Revision 2 applies the round-1 Rulings (R1–R8) and the parent fixes listed there.

Glossary terms used here (`GLOSSARY.md`): Repository owner, Reuser, Deck content work, Template
work.

## Definitions

**B0.** `2577b504fa5f22fcef047a95f6d9c2afc9a2daf4`. It is the `main` commit this spec was written
against and includes epic 0004. Facts marked "at B0" were read there.

**Base (B).** The commit on `main` that a ticket branch starts from. Its full SHA is the first
entry in the ticket's Comments. A ticket branch does not merge `main` while the ticket is open. If a
merge is needed, the repository owner must agree first, and the Comment that re-records B quotes
that agreement. The re-recorded B is the merged `main` commit. Every diff in this spec is
`git diff <B SHA>...HEAD --name-only`, where B is the latest recorded B.

**Notices.** `THIRD_PARTY_NOTICES.md`.

**Provenance file.** `docs/agents/skill-sources.json`.

**Root license files.**

| File | License | Required `license` value | Required link text |
|---|---|---|---|
| `LICENSE` | CC BY-SA 4.0 | `CC-BY-SA-4.0` | `CC BY-SA 4.0` |
| `LICENSE-CODE` | MIT | `MIT` | `MIT` |

**Facts at B0.**

- The provenance file has 9 `license_location` values and no duplicate key:
  - 4 are `LICENSE-CODE`: tune-skills, tw-emoji-commit, tw-emoji-pr-note, tw-emoji-release-note;
  - 3 are skill LICENSE paths: agent-browser, evidence-report, i-have-adhd;
  - 1 is the placeholder `.agents/skills/<skill>/LICENSE`;
  - 1 is a sentence (slide-style-design): "Upstream repository root LICENSE; the skill directories
    ship no LICENSE file."
- The notices hold 183 `\n` characters, the last one ending the file. They are LF only, with no BOM.
  They hold 33 inline links:
  - 32 have repository-path destinations, on lines 10, 11, 34–56, 67, 75, 80, 82, 84, 85 and 95;
  - 1 is `https:`, on line 93;
  - line 10 is `[CC BY-SA 4.0](LICENSE)` and line 11 is `[MIT](LICENSE-CODE)`, each after code
    spans on the same line;
  - line 34 links `.agents/skills/code-review/LICENSE`.
- 30 notices lines hold code spans. Every backtick run is closed on its own line.
- The notices hold none of these: a fence, `<`, a line led by `>`, a tab, a backslash, a link
  reference definition, an image, a title, an angle-bracket destination, link text over two lines,
  or a line indented 4 or more spaces. Lines 81, 83, 84 and 86 are indented 2 spaces; line 84 holds
  a link. Every `](` belongs to a recognized link.
- Every target above is an existing regular file, reached without symlinks, with exact case.
- The verifier (`scripts/verify-project.py`) starts no process.
- `AGENTS.md` lines 151–152 say the verifier "verifies harness plumbing and the glossary
  convention, not slide behavior".
- `README.md:51` reads "Run `python3 scripts/verify-project.py` to check the agent configuration."
  It stays unchanged (Ruling R6).

**Whitespace.** A character for which Python's `str.isspace()` is true.

**Quoted rendering, Q(x).** `printable(json.dumps(x, ensure_ascii=False))`. `printable` is the
function at `scripts/check_style_skills.py:943`, copied into the verifier, not imported: every
character that is not printable is replaced by its `unicode_escape` form. A string renders with
double quotes, `"` as `\"` and `\` as `\\`; a non-string renders as JSON (`5`, `null`, `["x"]`).
Every placeholder in a message that comes from file content, or from a name on disk, is printed
through Q.

**JSON Pointer.** RFC 6901: `/` before each key or array index, `~` written as `~0` and `/` as `~1`.
Array indices are decimal and count from 0.

**Document order.** A depth-first walk of the provenance file as Python's `json` module parses it:
an object's keys in order, an array's items in order. The walk enters every object and array,
including one that is itself a `license_location` value. A `RecursionError` raised while parsing or
walking counts as `not valid JSON` (see Unreadable inputs).

### License references

- **(a) Provenance values.** Every value under a `license_location` key, at any depth of the
  provenance file. Each value is handled by these steps; the first that applies decides:
  1. not a string → reason `is not a string`;
  2. empty → `is empty`;
  3. contains a placeholder (`<`, one or more characters other than `<`, `>` and whitespace, `>`)
     → skipped;
  4. still contains whitespace after leading and trailing whitespace are removed → skipped (a
     sentence);
  5. has leading or trailing whitespace → `has leading or trailing whitespace`;
  6. starts with a URL scheme (`^[A-Za-z][A-Za-z0-9+.-]*:`) → `is outside the repository` when the
     scheme is one letter (a drive), otherwise `uses an unsupported URL scheme`;
  7. otherwise the path rules below apply.

  No scheme is skipped, and `#` has no special meaning in a provenance value.
- **(b) Notices destinations.** Every destination of a recognized link or image in the notices (see
  Notices grammar). Angle brackets are removed. Each destination is then handled by these steps; the
  first that applies decides:
  1. empty → `is empty`;
  2. starts with `#` → skipped;
  3. everything from the first `#` is removed (the fragment);
  4. starts with a URL scheme → skipped when the scheme is `http`, `https` or `mailto` (any case),
     `is outside the repository` when it is one letter, otherwise `uses an unsupported URL scheme`;
  5. otherwise the path rules below apply.
- **(c) Required links.** For each root license file, at least one recognized link, not an image,
  whose link text is exactly the required link text and whose destination, with angle brackets and
  fragment removed, is exactly the file name.
- **(d) License agreement.** It applies to every object of the provenance file that holds a
  `license` key and a `license_location` key whose value is exactly `LICENSE` or `LICENSE-CODE`. In
  such an object, the `license` value must equal the required value in the Root license files table.
  A non-string `license` never matches. A `license_location` naming any other path, or holding
  surrounding whitespace, is not checked by (d).

### Path rules

They apply to a target string `t` from (a) step 7 or (b) step 5. The first that applies decides.

1. `is outside the repository`: `t` starts with `/` or `\`, contains `\`, or has a `..` segment
   (segments are the parts of `t` split on `/`). `//host` starts with `/`.
2. `is not a plain repository path`: `t` contains `%`, `?`, `<`, `>` or whitespace, or has an
   empty segment or a `.` segment. This covers `./x`, `a//b` and a trailing `/`.
3. Resolution. Starting at the repository root, for each segment in turn:
   - list the current directory with `os.listdir`; any `OSError` gives `does not exist`;
   - a listed name equal to the segment: if `os.lstat` says it is a symlink, the reason is
     `passes through a symlink at <component path>`; otherwise descend into it;
   - else, a listed name equal to the segment after Unicode NFC normalization and `casefold()` on
     both: `differs in case from <actual path>`, using the first such name in sorted order;
   - else `does not exist`.

   After the last segment, a target that is not a regular file (`os.lstat`) gives
   `is not a regular file`.
   - `<component path>` is the segments from the root through the symlink, joined with `/`.
   - `<actual path>` is the segments from the root through the mismatched one, joined with `/`,
     with the on-disk name in place of the mismatched segment. Normalization differences are
     reported as case differences.
   - The symlink test runs only on an exact match, so a case-mismatched symlink is reported as a
     case difference.
   - Whether the target is tracked by Git is not checked (grill Q2', Ruling R1).

### Notices grammar

The notices are decoded as strict UTF-8 and split into lines on `\n` only. Line numbers are 1-based.
A file that ends with `\n` has an empty last item, which holds nothing to check.

- **Fences.** A line is a fence opener when it is at most 3 spaces followed by 3 or more backticks
  or 3 or more tildes. A backtick opener whose remaining text holds a backtick opens no fence: it is
  the construct `backtick in fence info string`. A fence closes at the next line that is at most 3
  spaces, then at least as many of the opener's character, then only spaces or tabs. Fence lines and
  the lines between them are not checked at all.
  - A fence still open at the end of the file gives `unclosed code fence` at its opening line.
  - Every line after that opener is inside the fence and is not checked.
- **Code spans.** Outside fences, a run of backticks opens a code span that closes at the next run
  of the same length on the same line. Code-span text is not checked. A run with no closing run on
  its line is the construct `unmatched backtick`; the text after it is checked as ordinary text.
- **Recognized link.** Outside fences and code spans, all on one line: an optional `!` (an image),
  then `[`, link text, `]`, `(`, optional spaces or tabs, a destination, an optional title, optional
  spaces or tabs, `)`.
  - Link text holds no `[`, `]` or newline.
  - A destination is either `<`, characters other than `<`, `>` and newline, `>`; or zero or more
    characters other than whitespace, `(`, `)`, `<` and `>`.
  - A title follows one or more spaces or tabs and is `"…"` without `"`, `'…'` without `'`, or
    `(…)` without parentheses.
  - A recognized link is checked under (b), and counts toward (c), even when its line has an
    unsupported construct.
- **Unsupported constructs.** Each line outside fences reports at most one, the first that applies
  in this order:
  1. `byte order mark`: line 1 starts with U+FEFF;
  2. `carriage return`: the line holds `\r`;
  3. `backtick in fence info string` (see Fences);
  4. `unmatched backtick` (see Code spans);
  5. `raw HTML or autolink`: outside code spans, the line holds a `<` that is not the opening `<`
     of a recognized link's angle-bracket destination; this covers HTML comments, HTML blocks,
     inline tags and autolinks;
  6. `blockquote`: the line is at most 3 spaces, then `>`;
  7. `tab indentation`: the line's leading whitespace holds a tab;
  8. `link reference definition`: the line is at most 3 spaces, `[`, one or more characters other
     than `]`, then `]:`;
  9. `indented line with a link`: the line starts with 4 or more spaces and holds `](` outside
     code spans;
  10. `backslash escape`: outside code spans, `\` followed by `[`, `]`, `(`, `)`, `<`, `>` or a
      backtick;
  11. `empty link text`: a recognized link or image whose link text is empty or only whitespace;
  12. `unrecognized link`: the line holds a `](` outside code spans that is not the `](` of a
      recognized link. Link text started on an earlier line ends up here.
- Reference-style links (`[x][y]`) are not license references and are not checked.

### Unreadable inputs

The provenance file is read first, then the notices. Each input path is walked from the repository
root segment by segment, with exact names, as in Resolution. For each input, the first that
applies:

| Condition | `<reason>` |
|---|---|
| a segment of the path is a symlink (`os.lstat`) | `a symlink` |
| a segment is not listed with its exact name, or `os.listdir` raises `FileNotFoundError` or `NotADirectoryError` | `missing` |
| the input is not a regular file (`os.lstat`) | `not a regular file` |
| any other `OSError` while listing, checking or reading | `not readable` |
| its bytes are not strict UTF-8 | `not UTF-8` |
| provenance only: `json.loads` raises `ValueError` (a UTF-8 BOM and an over-long integer included) or `RecursionError`, or the walk raises `RecursionError` | `not valid JSON` |
| provenance only: the top level is not an object | `not a JSON object` |

An unreadable provenance file skips (a) and (d). Unreadable notices skip (b), (c) and the grammar.
The other input is still checked.

### Messages

Each is returned without a prefix; `main()` prints it as `FAIL: <message>`.

| Case | Message |
|---|---|
| provenance reference | `docs/agents/skill-sources.json: license reference <Q(value)> at <Q(JSON Pointer)> <reason>` |
| notices reference | `THIRD_PARTY_NOTICES.md:<line>: license reference <Q(destination)> <reason>`; `<line>` holds the destination; the destination is as written, without angle brackets, fragment included |
| reasons | `is not a string`, `is empty`, `has leading or trailing whitespace`, `uses an unsupported URL scheme`, `is outside the repository`, `is not a plain repository path`, `does not exist`, `differs in case from <Q(actual path)>`, `passes through a symlink at <Q(component path)>`, `is not a regular file` |
| unsupported construct | `THIRD_PARTY_NOTICES.md:<line>: unsupported Markdown (<construct>)`, `<construct>` being one of the twelve names above or `unclosed code fence` |
| unreadable input | `<file>: cannot read license references (<reason>)`, `<file>` being `docs/agents/skill-sources.json` or `THIRD_PARTY_NOTICES.md` |
| missing required link | `THIRD_PARTY_NOTICES.md: no inline link [CC BY-SA 4.0](LICENSE)`, and `THIRD_PARTY_NOTICES.md: no inline link [MIT](LICENSE-CODE)` |
| license mismatch | `docs/agents/skill-sources.json: license reference <Q(location)> at <Q(JSON Pointer)> is <required value>, not <Q(license value)>`; the pointer is the `license_location` value's |

Each bad reference gives one message. Messages come in this order:

1. unreadable inputs: provenance, then notices;
2. provenance references and license mismatches, in document order. An object's (d) message comes
   right after the (a) message, if any, for its `license_location` value, before anything nested in
   that value or in later keys. The `license` key's position does not matter;
3. unsupported constructs, by line;
4. notices references, by line, then by the destination's column (code points from the line start);
5. missing required links: `LICENSE`, then `LICENSE-CODE`.

The existing provenance message in `verify()` (`Skill provenance cannot be checked: ...`) is
unchanged, so `verify()` can report a missing provenance file twice.

### Wiring and target texts

- **W.** A function `check_license_references(root)` in `scripts/verify-project.py`, marked
  `# chalkdeck:` like the other local additions, returns the messages above. `verify()` extends its
  errors with them right after `check_glossary(root)`, so they are the last errors it returns. The
  module uses the standard library only. It starts no process and writes no file.
- **T1, PASS line.** It reads `PASS: shared instructions, <n> skills across Claude/Codex trees,
  invocation policies, helper assets, native role configs, the glossary convention and license
  references`. The second output line is unchanged.
- **T2, verifier docstring.** Its first sentence reads `Check portable project instructions,
  per-runtime skill trees, native role configs, the project glossary convention and license
  references.` (line breaks free). The rest is unchanged.
- **T3, `AGENTS.md` build section.** The sentence in "Build and test commands" reads `It verifies
  harness plumbing, the glossary convention and license references, not slide behavior.` Only that
  paragraph may be rewrapped.
- **T4, ADR.** `docs/adr/0008-verifier-license-reference-contract.md`, English, with frontmatter
  keys `status: accepted` and `date:` set to the date of the commit that adds it. It records:
  - the notices follow the grammar above, and anything outside it fails rather than being guessed;
  - the check is file-system only. 0003's "tracked by Git" rule was dropped. Committed state is not
    checked; this epic's E2 verified it once, and OQ-4 tracks a standing check;
  - skipped destinations: `#` anchors and `http`, `https` and `mailto` URLs; everything else is
    checked;
  - the notices must link both root license files with the required link text;
  - the end-to-end harness for the verifier CLI: run it on the work tree, and in a detached
    `git worktree` of HEAD, which holds committed files only (workflow stage 8);
  - its effect on ADR-0007: deck content work that edits the notices' Assets rows now runs the
    verifier (T7);
  - the consequence: a new construct in the notices needs this ADR and the verifier changed
    together.
- **T5, ADR index.** `docs/README.md` gains one line after the ADR-0007 line:
  `- [ADR-0008](adr/0008-verifier-license-reference-contract.md)：verifier 只做檔案系統檢查，notices 的連結須符合窄文法。`
- **T6, test docstring.** The first line of `scripts/test_verify_project.py` reads
  `"""Tests for the glossary check and the license-reference check in verify-project.py (epics 0001-glossary-rename and 0005-license-reference-check)."""`
  or the same words split over lines.
- **T7, `AGENTS.md` slide hard rule.** The bullet that starts "When a deck adds, removes or renames a
  file under its own `slides/<id>/assets/`" ends with the added sentence `After that edit, run
  \`python3 scripts/verify-project.py\`: it checks the notices' links (ADR-0008).` No other line in
  `AGENTS.md` changes, apart from T3.

## Example

A fixture root holds `LICENSE`, `LICENSE-CODE` and `docs/missing.md`. The provenance file is:

```json
{
  "licensing": {
    "project": {"license": "MIT", "license_location": "LICENSE"},
    "a": {"license_location": "LICENSE-CODE "},
    "b": {"license_location": ".agents/skills/<skill>/LICENSE"},
    "c": {"license_location": 5}
  }
}
```

The notices are:

```
# Notices
`code` [CC BY-SA 4.0](LICENSE) and [MIT](LICENSE-CODE)
<!-- [CC BY-SA 4.0](LICENSE) -->
[tool](docs/Missing.md#top)
```

`check_license_references(root)` returns exactly:

```
docs/agents/skill-sources.json: license reference "LICENSE" at "/licensing/project/license_location" is CC-BY-SA-4.0, not "MIT"
docs/agents/skill-sources.json: license reference "LICENSE-CODE " at "/licensing/a/license_location" has leading or trailing whitespace
docs/agents/skill-sources.json: license reference 5 at "/licensing/c/license_location" is not a string
THIRD_PARTY_NOTICES.md:3: unsupported Markdown (raw HTML or autolink)
THIRD_PARTY_NOTICES.md:4: license reference "docs/Missing.md#top" differs in case from "docs/missing.md"
```

`/licensing/b` is a placeholder and is skipped. The link inside the comment is recognized and
valid, so line 3 gives only the construct message.

## Matrix

**Defaults.** Unless a row says otherwise:

- the fixture root holds regular files `LICENSE` and `LICENSE-CODE`;
- the provenance file is `{}`;
- the notices' first two lines are `[CC BY-SA 4.0](LICENSE)` and `[MIT](LICENSE-CODE)`, and the
  row's content follows from line 3;
- the expected result is the full returned list. A row that names only the row's own messages
  expects exactly those.

**Tests and red.** Every sub-case is its own test, a method or a `subTest`. Its red is recorded in
the ticket's Comments before the code that turns it green. The record holds:

- the failing output;
- the HEAD commit;
- the `git hash-object` of the test file at that run.

A sub-case that passes on its first run, whether or not it expects a message, takes its red by
mutation instead (Ruling R7):

- break the rule it guards;
- run it and record the failure;
- restore the rule.

The stage-5 test plan table lists each such sub-case with its mutation.

**Skips.** A symlink, FIFO or permission sub-case may skip only where the platform cannot create
the fixture or the run is as root. On macOS as a non-root user, the reference platform, no sub-case
skips. A skip on another platform is recorded in Comments with the platform and does not count as
a pass.

### Provenance (a)

| ID | Type × field × boundary | Expected behaviour | AC |
|---|---|---|---|
| P1 | (a) × valid target × top-level key / nested three objects deep / inside an array item | no message for any of the three | AC1 |
| P2 | (a) × skipped value × `.agents/skills/<skill>/LICENSE` / a sentence with inner whitespace / `" <x>"` / `" a b"` | no message for any of the four (step 3 and step 4 come before step 5) | AC1 |
| P3 | (a) × non-string × `5` / `null` / `true` / `["x"]` / an object holding a nested `license_location` of `"missing"` | `is not a string` each, rendered `5`, `null`, `true`, `["x"]`, the object as JSON; the fifth also gives the nested `does not exist`, after the outer message | AC1 |
| P4 | (a) × empty string | `is empty` | AC1 |
| P5 | (a) × surrounding whitespace × trailing space / leading space / trailing `\n` / whitespace only / trailing U+3000 | `has leading or trailing whitespace` each, the value rendered with Q | AC1 |
| P6 | (a) × scheme × `https://example.org/LICENSE` / `C:LICENSE` | `uses an unsupported URL scheme` / `is outside the repository` | AC1 |
| P7 | (a) × path rules × `missing.md` / `LICENSE#x` / `/LICENSE` / `./LICENSE` / `LICENSE<old` / `license` / a symlink to `LICENSE` / a directory | `does not exist` (twice; `#` is not stripped), `is outside the repository`, `is not a plain repository path` (twice), `differs in case from "LICENSE"`, `passes through a symlink at` the link, `is not a regular file` | AC1 |
| P8 | (a) × pointer through an array × `{"x": [{"license_location": "missing"}]}` | the pointer is `"/x/0/license_location"` | AC1 |

### License agreement (d)

| ID | Type × field × boundary | Expected behaviour | AC |
|---|---|---|---|
| D1 | (d) × mismatch × `LICENSE` with `MIT` / `LICENSE-CODE` with `CC-BY-SA-4.0` / `LICENSE-CODE` with `null` / `LICENSE-CODE` with `mit` / `LICENSE-CODE` with `MIT ` | one mismatch message each: `is CC-BY-SA-4.0, not "MIT"`, `is MIT, not "CC-BY-SA-4.0"`, `is MIT, not null`, `is MIT, not "mit"`, `is MIT, not "MIT "` | AC1 |
| D2 | (d) × agreement × `LICENSE-CODE` with `MIT` / `LICENSE` with `CC-BY-SA-4.0` | no message for either | AC1 |
| D3 | (d) × not applicable × skill path with `Apache-2.0` / `LICENSE-CODE` with no `license` key / location `" LICENSE-CODE"` with `CC-BY-SA-4.0` / location `license-code` with `CC-BY-SA-4.0` | none / none / only `has leading or trailing whitespace` / only `differs in case from "LICENSE-CODE"` | AC1 |
| D4 | (d) × both kinds on one object × `LICENSE` absent from disk, `license` `MIT` | `does not exist`, then the mismatch message; the notices' line-1 link then gives `does not exist` | AC1 |
| D5 | (d) × position × `{"license_location": "LICENSE-CODE", "x": {"license_location": "missing"}, "license": "CC-BY-SA-4.0"}` | the mismatch message, then the nested `does not exist` | AC1 |

### Notices destinations (b)

| ID | Type × field × boundary | Expected behaviour | AC |
|---|---|---|---|
| N1 | (b) × valid target × plain link / image / angle-bracket destination / `"title"` / `'title'` / `(title)` / a link after code spans on the same line / a link on a line indented 2 spaces | no message for any of the eight | AC2 |
| N2 | (b) × skipped × `https:` / `http:` / `MAILTO:` / `#anchor` / `LICENSE#section` / `LICENSE#a%20b` | no message for any of the six (the fragment goes before the path rules) | AC2 |
| N3 | (b) × empty × `[x]()` / `[x](<>)` | `is empty` for both | AC2 |
| N4 | (b) × scheme × `ab:c` / `ftp://host/x` / `C:x` | `uses an unsupported URL scheme`, the same, `is outside the repository` | AC2 |
| N5 | (b) × message text × `docs/Missing.md#top` where `docs/missing.md` exists | `"docs/Missing.md#top" differs in case from "docs/missing.md"` | AC2 |
| N6 | (b) × line number × a bad destination on line 4, after a line holding only text | the message starts `THIRD_PARTY_NOTICES.md:4:` | AC2 |

### Path rules (via the notices)

| ID | Type × field × boundary | Expected behaviour | AC |
|---|---|---|---|
| R1 | path × outside × `/LICENSE` / `\LICENSE` / `a\LICENSE` / `../LICENSE` / `a/../LICENSE` with `a/` existing / `//host/x` / `../a%20b` | `is outside the repository` for all seven, even when the named path exists (rule 1 before rule 2) | AC2 |
| R2 | path × not plain × `a%20b.md` / `LICENSE?plain=1` / `./LICENSE` / `a//b` / `docs/` / `<docs/my file.md>` with that file existing | `is not a plain repository path` for all six | AC2 |
| R3 | path × missing × no such file / a segment below a regular file (`LICENSE/x`) / a `...` segment (`.../LICENSE`) | `does not exist` for all three | AC2 |
| R4 | path × case × `license` for `LICENSE` / `Docs/x.md` for `docs/x.md` / an NFC name for an NFD file on disk | `differs in case from "LICENSE"` / `"docs"` / the on-disk name | AC2 |
| R5 | path × symlink × final component / parent directory / a case-mismatched name of a symlink | `passes through a symlink at` the link's path for the first two; `differs in case from` the link's name for the third | AC2 |
| R6 | path × not a file × a directory / a FIFO | `is not a regular file` for both | AC2 |
| R7 | path × unlistable × a parent directory without read permission | `does not exist` | AC2 |

### Notices grammar

| ID | Type × field × boundary | Expected behaviour | AC |
|---|---|---|---|
| G1 | grammar × skipped regions × a link to a missing file in a code span / in a backtick fence / in a tilde fence / in a fence closed by a longer run / in a fence whose opener and closer are indented 3 spaces / in a fence with an info string | no message for any of the six | AC2 |
| G2 | grammar × fence boundaries × a 4-space-indented triple backtick / a backtick fence closed by tildes / a closer shorter than the opener / a closer followed by text | `unmatched backtick` at that line / `unclosed code fence` at the opener for the other three, and nothing for the lines after it | AC2 |
| G3 | grammar × each construct × a BOM before line 1's link (reported at line 1) / `\r` / a backtick opener with a backtick in its info string / unmatched backtick / `<!-- -->` / `<div>` / `<https://example.org>` / `> quote` / a tab-indented line / 2 spaces and a tab before a link / `[x]: LICENSE` / `   [x]: LICENSE` / a 4-space line with `](` / `\[` / `\(` / `[](LICENSE)` / `[ ](LICENSE)` / `[![a](a.png)](LICENSE)` with `a.png` existing / `[a](b c)` / link text over two lines | one `unsupported Markdown (…)` each: `byte order mark`, `carriage return`, `backtick in fence info string`, `unmatched backtick`, `raw HTML or autolink` (three times), `blockquote`, `tab indentation` (twice), `link reference definition` (twice), `indented line with a link`, `backslash escape` (twice), `empty link text` (twice), `unrecognized link` (three times) | AC2 |
| G4 | grammar × one line, two constructs × `<!--` and `\[` / `\r` and `<` | only `raw HTML or autolink` / only `carriage return` | AC2 |
| G5 | grammar × no construct × `<!--` inside a fence / a 4-space line without `](` / `` `<!--` `` in a code span / `\x` / `[x](<LICENSE>)` | no message for any of the five | AC2 |
| G6 | grammar × link on a construct line × `<b>[x](missing)</b>` | `raw HTML or autolink`, then `does not exist` for `"missing"` | AC2 |

### Required links (c)

The rows below replace the defaults' first two lines as they state.

| ID | Type × field × boundary | Expected behaviour | AC |
|---|---|---|---|
| C1 | (c) × absent × no `LICENSE` link / no `LICENSE-CODE` link | `no inline link [CC BY-SA 4.0](LICENSE)` / `no inline link [MIT](LICENSE-CODE)` | AC2 |
| C2 | (c) × only in skipped regions × both links only in a code span and in a fence | both missing-link messages | AC2 |
| C3 | (c) × satisfied × `[CC BY-SA 4.0](LICENSE#section)` / `[MIT](<LICENSE-CODE>)` | no message | AC2 |
| C4 | (c) × not satisfied × `[CC-BY-SA](LICENSE)` / the two link texts swapped / `![MIT](LICENSE-CODE)` / `[CC BY-SA 4.0](./LICENSE)` / `[MIT](license-code)` | the missing-link message(s) for the affected file; the fourth first gives `is not a plain repository path`, the fifth first gives `differs in case from "LICENSE-CODE"` | AC2 |

### Inputs, order and rendering

| ID | Type × field × boundary | Expected behaviour | AC |
|---|---|---|---|
| I1 | provenance input × missing / a symlink / `docs/agents` a symlink to a directory holding the file / a directory / not UTF-8 / not valid JSON / UTF-8 BOM / 100,000 nested arrays / a top-level array | one `cannot read license references (…)` each: `missing`, `a symlink` (twice), `not a regular file`, `not UTF-8`, `not valid JSON` (three times), `not a JSON object`; the notices are still checked | AC3 |
| I2 | notices input × missing / a symlink / a directory / not UTF-8 | one message each; the provenance file is still checked; no grammar or missing-link messages | AC3 |
| I3 | input × permission denied × provenance / notices | `not readable` for each | AC3 |
| I4 | both inputs unreadable × both missing | the provenance message, then the notices message, and nothing else | AC3 |
| O1 | order × one readable fixture with a bad provenance value, an unsupported construct, a bad notices destination and no `LICENSE-CODE` link | the four messages in groups 2, 3, 4, 5 order | AC3 |
| O2 | order × two bad destinations on one line | by column | AC3 |
| O3 | rendering × a value holding `"`, `\`, a newline, U+0007 and U+2028 | rendered by Q: `\"`, `\\`, `\n`, `\u0007`, `\u2028` | AC3 |
| O4 | rendering × keys `a/b`, `c~d`, `e"f` and the empty key on the pointer path | the pointer renders as `"/a~1b/c~0d/e\"f//license_location"` | AC3 |

### Wiring, texts and delivery

| ID | Type × field × boundary | Expected behaviour | AC |
|---|---|---|---|
| W1 | `verify()` × a fixture with no `GLOSSARY.md` and one bad notices link | the returned errors end with exactly `check_license_references(root)`'s list, which holds that link's message, and the glossary message comes before it | AC4 |
| W2 | verifier CLI × real tree at HEAD | exits 0; the PASS line is T1 | AC4 |
| W3 | verifier module × process and write calls | reading `scripts/verify-project.py` finds none of `subprocess`, `multiprocessing`, `pty`, `os.system`, `os.popen`, `os.exec*`, `os.spawn*`, `os.posix_spawn*`, `os.fork*`, `write_text`, `write_bytes`; every `open(` call passes no mode or a mode starting with `r`; every import is from the standard library | AC4 |
| W4 | verifier diff × other checks | in `git diff <B>...HEAD -- scripts/verify-project.py`, every hunk is T1, T2, the one call in `verify()`, or new code under a `# chalkdeck:` comment | AC4 |
| T1–T7 | texts × after | each text as defined above | AC5 |
| E1 | E2E × real tree | as W2, run in the ticket worktree | AC6 |
| E2 | E2E × `git worktree add --detach <tmp> HEAD` | the verifier there exits 0 (committed state verified once) | AC6 |
| E3 | E2E × in that worktree, line 34's destination changed to `.agents/skills/code-review/LICENCE` | exits 1; the only `FAIL:` line is `FAIL: THIRD_PARTY_NOTICES.md:34: license reference ".agents/skills/code-review/LICENCE" does not exist` | AC6 |
| E4 | E2E × cleanup | `git worktree remove --force <tmp>` runs, and `git worktree list` no longer shows `<tmp>` | AC6 |
| X1 | diff × paths | `git diff <B>...HEAD --name-only` lists only `scripts/verify-project.py`, `scripts/test_verify_project.py`, `AGENTS.md`, `docs/README.md`, the ADR of T4, files under `.proj.tickets/0005-license-reference-check/`, and `.proj.specs/0005-license-reference-check/review/security-T-NNNN.md` | AC7 |
| X2 | branch × base | B is the first Comment; any re-recorded B quotes the repository owner's agreement | AC7 |
| X3 | checks × at HEAD | `python3 scripts/verify-project.py`, `python3 -m unittest discover -s scripts -p 'test_*.py'` and `python3 scripts/check_style_skills.py` exit 0 | AC7 |

## Self-check of rules added or changed in revision 2

| Rule | Parameters complete | Boundaries closed | Acceptance exit | Conflict checked against |
|---|---|---|---|---|
| (a) placeholder form `<word>` | yes | `<x>`, `<old` without `>`, `<` with whitespace | P2, P7 | B0 placeholder still skipped; `<` and `>` now fail path rule 2, which only (a) values reach |
| (c) link text | yes | exact text, swapped, image, wrong text, case, `./` | C1–C4 | B0 lines 10 and 11 match; the 0003 message text changed |
| (d) message position | yes | nested value, later `license` key | D5 | document order otherwise unchanged |
| path rule 2 adds `<`, `>` | yes | `LICENSE<old` | P7 | notices destinations cannot hold them, so only (a) is affected |
| input walk by segment | yes | parent symlink, missing segment, other `OSError` | I1–I3 | the reason names are unchanged except the scope of `a symlink` |
| `RecursionError` and `ValueError` as `not valid JSON` | yes | deep nesting, BOM, long integer | I1 | the existing `verify()` message unchanged |
| grammar constructs 1–12 | yes | each construct, priority pairs, fences, code spans | G1–G6 | B0 holds none (Facts at B0, re-read 2026-10-23); B0 lines 10, 11 and 84 are covered by N1 |
| single-line link text | yes | text over two lines | G3 | reverses grill Q8 by Ruling R2; B0 has no multi-line link text |
| images do not count toward (c) | yes | `![MIT](LICENSE-CODE)` | C4 | images are still checked under (b) (N1) |
| Q on JSON Pointers | yes | `/`, `~`, `"`, empty key | O4, P8 | the Example and messages updated together |
| red by mutation for any first-run pass | yes | expects a message or not | Tests and red | extends ADR-0006 for this epic only, stated in the spec |
| skips | yes | macOS non-root never skips | Skips | glossary tests' prior art |
| W1 order, W3 grep, W4 hunks | yes | glossary before, nothing after | W1, W3, W4 | — |
| T7 deck rule | yes | the one bullet | T7, X1 | ADR-0007's deck-track allowance; T3 is the only other `AGENTS.md` change |
| no Git, no standing guarantee | yes | untracked files pass the unit check | E2, OQ-4 | Ruling R1; workflow.md unchanged |
