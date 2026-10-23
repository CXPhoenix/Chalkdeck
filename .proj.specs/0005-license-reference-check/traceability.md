# Traceability — 0005 license reference check

Source of truth for scope. `spec.en.md` prose is derived from this file. The repository owner's
answers are quoted in `grill.md`. This epic is the verifier half of the split epic 0003; it starts
from the License references, Valid target and Messages drafts in
`../0003-license-split/traceability.md` (revision 2) and changes them where `grill.md` says so.

Glossary terms used here (`GLOSSARY.md`): Repository owner.

## Definitions

**B0.** `2577b504fa5f22fcef047a95f6d9c2afc9a2daf4`, the `main` commit this spec was written
against. Facts marked "at B0" were read there.

**Base (B).** The commit on `main` that a ticket branch starts from. Its full SHA is the first
entry in the ticket's Comments. Every diff in this spec is `git diff <B SHA>...HEAD --name-only`.
A ticket branch does not merge `main` while the ticket is open. If a merge is needed, the
repository owner must agree first; B is then re-recorded as the merged `main` commit, with a
Comment that says why.

**Notices.** `THIRD_PARTY_NOTICES.md`.

**Provenance file.** `docs/agents/skill-sources.json`.

**Root license files.**

| File | License | Required `license` value |
|---|---|---|
| `LICENSE` | CC BY-SA 4.0 | `CC-BY-SA-4.0` |
| `LICENSE-CODE` | MIT | `MIT` |

**Facts at B0.**

- The provenance file has 9 `license_location` values:
  - 4 are `LICENSE-CODE`: tune-skills, tw-emoji-commit, tw-emoji-pr-note, tw-emoji-release-note;
  - 3 are skill LICENSE paths: agent-browser, evidence-report, i-have-adhd;
  - 1 is the placeholder `.agents/skills/<skill>/LICENSE`;
  - 1 is a sentence (slide-style-design).
- The notices have 184 lines (counted on `\n`), LF only, no BOM, and 33 inline links:
  - 32 have repository-path destinations, on lines 10, 11, 34–56, 67, 75, 80, 82, 84, 85 and 95;
  - 1 is `https:`, on line 93;
  - `LICENSE` is linked on line 10 and `LICENSE-CODE` on line 11;
  - line 34 links `.agents/skills/code-review/LICENSE`.
- The notices contain no code fence, no backtick, no backslash, no HTML comment, no link reference
  definition, no indented line, no title, no image and no angle-bracket destination. Every `](`
  belongs to a recognized link.
- Every target above is an existing regular file, reached without symlinks, with exact case.
- The verifier (`scripts/verify-project.py`) runs no subprocess.
- `AGENTS.md` line 151–152 says the verifier "verifies harness plumbing and the glossary
  convention, not slide behavior".

**Whitespace.** A character for which Python's `str.isspace()` is true.

**Quoted rendering, Q(x).** `printable(json.dumps(x, ensure_ascii=False))`. `printable` is the
function at `scripts/check_style_skills.py:943`, copied into the verifier, not imported: every
character that is not printable is replaced by its `unicode_escape` form. A string renders with
double quotes, `"` as `\"` and `\` as `\\`; a non-string renders as JSON (`5`, `null`, `["x"]`).

**JSON Pointer.** RFC 6901: `/` before each key or array index, with `~` written as `~0` and `/` as
`~1`. It is printed through `printable`, without quotes.

**Document order.** A depth-first walk of the provenance file as Python's `json` module parses it:
an object's keys in order, an array's items in order. The walk enters every object and array,
including one that is itself a `license_location` value.

### License references

- **(a) Provenance values.** Every value under a `license_location` key, at any depth of the
  provenance file. Each value is handled by these steps; the first that applies decides:
  1. not a string → reason `is not a string`;
  2. empty → `is empty`;
  3. contains `<` → skipped (a placeholder);
  4. still contains whitespace after leading and trailing whitespace are removed → skipped (a
     sentence);
  5. has leading or trailing whitespace → `has leading or trailing whitespace`;
  6. starts with a URL scheme (`^[A-Za-z][A-Za-z0-9+.-]*:`) → `is outside the repository` when the
     scheme is one letter (a drive), otherwise `uses an unsupported URL scheme`;
  7. otherwise the path rules below apply.

  No scheme is skipped, and `#` has no special meaning in a provenance value.
- **(b) Notices destinations.** Every destination of a recognized link in the notices (see Notices
  grammar). Angle brackets are removed. Each destination is then handled by these steps; the first
  that applies decides:
  1. empty → `is empty`;
  2. starts with `#` → skipped;
  3. everything from the first `#` is removed (the fragment);
  4. starts with a URL scheme → skipped when the scheme is `http`, `https` or `mailto` (any case),
     `is outside the repository` when it is one letter, otherwise `uses an unsupported URL scheme`;
  5. otherwise the path rules below apply.
- **(c) Required links.** At least one recognized link whose destination, with angle brackets and
  fragment removed, is exactly `LICENSE`; the same for `LICENSE-CODE`.
- **(d) License agreement.** In every object of the provenance file that holds both a `license` key
  and a `license_location` key whose value is exactly `LICENSE` or `LICENSE-CODE`, the `license`
  value must equal the required value in the Root license files table. A non-string `license`
  never matches. A `license_location` naming any other path is not checked by (d).

### Path rules

They apply to a target string `t` from (a) step 7 or (b) step 5. The first that applies decides.

1. `is outside the repository`: `t` starts with `/` or `\`, contains `\`, or has a `..` segment
   (segments are the parts of `t` split on `/`). `//host` starts with `/`.
2. `is not a plain repository path`: `t` contains `%`, `?` or whitespace, or has an empty segment
   or a `.` segment. This covers `./x`, `a//b` and a trailing `/`.
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
   - Whether the target is tracked by Git is not checked (grill Q2').

### Notices grammar

The notices are split into lines on `\n`. Line numbers are 1-based.

- **Fences.** A line that is at most 3 spaces followed by 3 or more backticks or 3 or more tildes
  opens a fence. The next line that is at most 3 spaces, then at least as many of the same
  character, then only spaces or tabs closes it. Fence lines and the lines between them are not
  checked at all. A fence still open at the end of the file is reported at its opening line.
- **Code spans.** Outside fences, a run of backticks opens a code span that closes at the next run
  of the same length on the same line. Code-span text is not checked. A run with no closing run on
  its line is an unmatched backtick.
- **Recognized link.** Outside fences and code spans: an optional `!`, then `[`, link text, `]`,
  `(`, optional spaces or tabs, a destination, an optional title, optional spaces or tabs, `)`.
  - Link text holds no `[` or `]`. It may run over several lines, but not over a blank line or a
    fence line.
  - Everything from `(` to `)` is on one line.
  - A destination is either `<`, characters other than `<`, `>` and newline, `>`; or zero or more
    characters other than whitespace, `(`, `)`, `<` and `>`.
  - A title follows one or more spaces or tabs and is `"…"` without `"`, `'…'` without `'`, or
    `(…)` without parentheses.
- **Unsupported constructs.** Each line outside fences reports at most one, the first that applies
  in this order:
  1. `unmatched backtick`;
  2. `HTML comment`: the line holds `<!--` outside code spans;
  3. `link reference definition`: the line is at most 3 spaces, `[`, one or more characters other
     than `]`, then `]:`;
  4. `indented line with a link`: the line starts with 4 spaces or a tab and holds `](` outside
     code spans;
  5. `backslash escape`: outside code spans, `\` followed by `[`, `]`, `(`, `)`, `<`, `>` or a
     backtick;
  6. `unrecognized link`: the line holds a `](` outside code spans that is not the `](` of a
     recognized link.
- A link on a line with an unsupported construct is still recognized and checked.
- Reference-style links (`[x][y]`), autolinks (`<https://…>`) and raw HTML other than comments are
  not license references and are not checked.

### Unreadable inputs

The provenance file is read first, then the notices. For each, the first that applies:

| Condition | `<reason>` |
|---|---|
| the path is a symlink (`os.lstat`) | `a symlink` |
| it does not exist | `missing` |
| it is not a regular file | `not a regular file` |
| reading it raises `OSError` | `not readable` |
| its bytes are not strict UTF-8 | `not UTF-8` |
| provenance only: `json.loads` fails (a UTF-8 BOM included) | `not valid JSON` |
| provenance only: the top level is not an object | `not a JSON object` |

An unreadable provenance file skips (a) and (d). Unreadable notices skip (b) and (c). The other
input is still checked.

### Messages

Each is returned without a prefix; `main()` prints it as `FAIL: <message>`.

| Case | Message |
|---|---|
| provenance reference | `docs/agents/skill-sources.json: license reference <Q(value)> at <JSON Pointer> <reason>` |
| notices reference | `THIRD_PARTY_NOTICES.md:<line>: license reference <Q(destination)> <reason>`; `<line>` holds the destination's first character; the destination is as written, without angle brackets, fragment included |
| reasons | `is not a string`, `is empty`, `has leading or trailing whitespace`, `uses an unsupported URL scheme`, `is outside the repository`, `is not a plain repository path`, `does not exist`, `differs in case from <Q(actual path)>`, `passes through a symlink at <Q(component path)>`, `is not a regular file` |
| unsupported construct | `THIRD_PARTY_NOTICES.md:<line>: unsupported Markdown (<construct>)` |
| unreadable input | `<file>: cannot read license references (<reason>)`, `<file>` being `docs/agents/skill-sources.json` or `THIRD_PARTY_NOTICES.md` |
| missing required link | `THIRD_PARTY_NOTICES.md: no inline link to LICENSE`, and the same for `LICENSE-CODE` |
| license mismatch | `docs/agents/skill-sources.json: license reference <Q(location)> at <JSON Pointer> is <required value>, not <Q(license value)>`; the pointer is the `license_location` value's |

Each bad reference gives one message. Messages come in this order:

1. unreadable inputs: provenance, then notices;
2. provenance references and license mismatches, in document order; for one object, the (a)
   message for its `license_location` comes before its (d) message;
3. unsupported constructs, by line;
4. notices references, by line, then by the destination's column (code points from the line start);
5. missing required links: `LICENSE`, then `LICENSE-CODE`.

The existing provenance message in `verify()` (`Skill provenance cannot be checked: ...`) is
unchanged, so `verify()` can report a missing provenance file twice.

### Wiring and target texts

- **W.** A function `check_license_references(root)` in `scripts/verify-project.py`, marked
  `# chalkdeck:` like the other local additions, returns the messages above. `verify()` extends its
  errors with them right after `check_glossary(root)`. The module uses the standard library only
  and runs no subprocess.
- **T1, PASS line.** It reads `PASS: shared instructions, <n> skills across Claude/Codex trees,
  invocation policies, helper assets, native role configs, the glossary convention and license
  references`. The second output line is unchanged.
- **T2, docstring.** Its first sentence reads `Check portable project instructions, per-runtime
  skill trees, native role configs, the project glossary convention and license references.`
  (line breaks free). The rest is unchanged.
- **T3, `AGENTS.md`.** The sentence in "Build and test commands" reads `It verifies harness
  plumbing, the glossary convention and license references, not slide behavior.` Only that
  paragraph may be rewrapped; no other line changes.
- **T4, ADR.** `docs/adr/0008-verifier-license-reference-contract.md`, English, frontmatter
  `status: accepted` and the date it is written. It records:
  - the notices follow the narrow grammar above, and anything outside it fails rather than being
    guessed;
  - the check is file-system only; 0003's "tracked by Git" rule was dropped, and tracking is
    guaranteed by the stage-8 run in a worktree of HEAD (E2);
  - only `http`, `https` and `mailto` destinations are skipped;
  - the consequence: a new construct in the notices needs this ADR and the verifier changed
    together.
- **T5, ADR index.** `docs/README.md` gains one line after the ADR-0007 line:
  `- [ADR-0008](adr/0008-verifier-license-reference-contract.md)：verifier 只做檔案系統檢查，notices 的連結須符合窄文法。`

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
[content](LICENSE) and [code](LICENSE-CODE)
<!-- [hidden](LICENSE) -->
[tool](docs/Missing.md#top)
```

`check_license_references(root)` returns exactly:

```
docs/agents/skill-sources.json: license reference "LICENSE" at /licensing/project/license_location is CC-BY-SA-4.0, not "MIT"
docs/agents/skill-sources.json: license reference "LICENSE-CODE " at /licensing/a/license_location has leading or trailing whitespace
docs/agents/skill-sources.json: license reference 5 at /licensing/c/license_location is not a string
THIRD_PARTY_NOTICES.md:3: unsupported Markdown (HTML comment)
THIRD_PARTY_NOTICES.md:4: license reference "docs/Missing.md#top" differs in case from "docs/missing.md"
```

`/licensing/b` is a placeholder and is skipped. The link inside the comment is valid, so line 3
gives only the construct message.

## Matrix

Every sub-case is its own test (a test method or a `subTest`). Unless a row says otherwise, the
fixture's notices also hold valid links to `LICENSE` and `LICENSE-CODE`, both files exist, and the
expected result is the full returned list.

### Provenance (a)

| ID | Type × field × boundary | Expected behaviour | AC |
|---|---|---|---|
| P1 | (a) × valid target × top-level key / nested three objects deep / inside an array item | no message for any of the three | AC1 |
| P2 | (a) × skipped value × contains `<` / a sentence with inner whitespace | no message for either | AC1 |
| P3 | (a) × non-string × number / `null` / array / object holding a nested `license_location` of `"missing"` | `is not a string` each, rendered `5`, `null`, `["x"]`, the object as JSON; the fourth also gives the nested `does not exist`, after the outer message | AC1 |
| P4 | (a) × empty string | `is empty` | AC1 |
| P5 | (a) × surrounding whitespace × trailing space / leading space / trailing `\n` / whitespace only | `has leading or trailing whitespace` each, the value rendered with Q | AC1 |
| P6 | (a) × scheme × `https://example.org/LICENSE` / `C:LICENSE` | `uses an unsupported URL scheme` / `is outside the repository` | AC1 |
| P7 | (a) × path rules reach provenance × `missing.md` / `LICENSE#x` | `does not exist` for both; `#` is not stripped | AC1 |

### License agreement (d)

| ID | Type × field × boundary | Expected behaviour | AC |
|---|---|---|---|
| D1 | (d) × mismatch × `LICENSE` with `MIT` / `LICENSE-CODE` with `CC-BY-SA-4.0` / `LICENSE-CODE` with `null` | one mismatch message each: `is CC-BY-SA-4.0, not "MIT"`, `is MIT, not "CC-BY-SA-4.0"`, `is MIT, not null` | AC1 |
| D2 | (d) × agreement × `LICENSE-CODE` with `MIT` / `LICENSE` with `CC-BY-SA-4.0` | no message for either | AC1 |
| D3 | (d) × not applicable × skill path with `Apache-2.0` / `LICENSE-CODE` with no `license` key | no message for either | AC1 |
| D4 | (d) × both kinds on one object × `LICENSE` absent from disk, `license` `MIT` | `does not exist`, then the mismatch message; the notices' own `LICENSE` link also gives `does not exist` | AC1 |

### Notices destinations (b)

| ID | Type × field × boundary | Expected behaviour | AC |
|---|---|---|---|
| N1 | (b) × valid target × plain link / image / angle-bracket destination / `"title"` / `'title'` / `(title)` / link text over two lines | no message for any of the seven | AC2 |
| N2 | (b) × skipped × `https:` / `http:` / `MAILTO:` / `#anchor` / `LICENSE#section` | no message for any of the five | AC2 |
| N3 | (b) × empty × `[x]()` / `[x](<>)` | `is empty` for both | AC2 |
| N4 | (b) × scheme × `ab:c` / `ftp://host/x` / `C:x` | `uses an unsupported URL scheme`, the same, `is outside the repository` | AC2 |
| N5 | (b) × message text × `docs/Missing.md#top` where `docs/missing.md` exists | the destination printed with its fragment, `differs in case from "docs/missing.md"` | AC2 |
| N6 | (b) × line number × link text over two lines with a bad destination / a `\r` inside line 1 | the line holding the destination's first character / lines counted on `\n` only | AC2 |

### Path rules (via the notices)

| ID | Type × field × boundary | Expected behaviour | AC |
|---|---|---|---|
| R1 | path × outside × `/LICENSE` / `\LICENSE` / `a\LICENSE` / `../LICENSE` / `a/../LICENSE` with `a/` existing / `//host/x` | `is outside the repository` for all six, even when the named path exists | AC2 |
| R2 | path × not plain × `a%20b.md` / `LICENSE?plain=1` / `./LICENSE` / `a//b` / `docs/` / `<docs/my file.md>` with that file existing | `is not a plain repository path` for all six | AC2 |
| R3 | path × missing × no such file / a segment below a regular file (`LICENSE/x`) | `does not exist` for both | AC2 |
| R4 | path × case × `license` for `LICENSE` / `Docs/x.md` for `docs/x.md` / an NFC name for an NFD file on disk | `differs in case from "LICENSE"` / `"docs"` / the on-disk name | AC2 |
| R5 | path × symlink × final component / parent directory | `passes through a symlink at` the link's path, for both; skipped where symlinks cannot be created | AC2 |
| R6 | path × not a file × a directory | `is not a regular file` | AC2 |

### Notices grammar

| ID | Type × field × boundary | Expected behaviour | AC |
|---|---|---|---|
| G1 | grammar × skipped regions × link to a missing file in a code span / in a backtick fence / in a tilde fence / in a fence closed by a longer run | no message for any of the four | AC2 |
| G2 | grammar × unsupported × unclosed fence / unmatched backtick / `<!--` / `[x]: LICENSE` / 4-space line with `](` / tab line with `](` / `\[` / `[![a](a.png)](LICENSE)` with `a.png` existing / `[a](b c)` | one `unsupported Markdown (…)` each: `unclosed code fence` at the opening line, `unmatched backtick`, `HTML comment`, `link reference definition`, `indented line with a link` (twice), `backslash escape`, `unrecognized link` (twice) | AC2 |
| G3 | grammar × one line, two constructs × `<!--` and `\[` | only `HTML comment` | AC2 |
| G4 | grammar × no construct × `<!--` inside a fence / a 4-space line without `](` / `` `<!--` `` in a code span | no message for any of the three | AC2 |
| G5 | grammar × link text over a blank line | `unrecognized link` at the line holding `](` | AC2 |

### Required links (c)

| ID | Type × field × boundary | Expected behaviour | AC |
|---|---|---|---|
| C1 | (c) × absent × no link to `LICENSE` / no link to `LICENSE-CODE` | `no inline link to LICENSE` / `no inline link to LICENSE-CODE` | AC2 |
| C2 | (c) × only in skipped regions × both links only in a code span and a fence | both missing-link messages | AC2 |
| C3 | (c) × satisfied × `LICENSE#section` / `<LICENSE-CODE>` | no message | AC2 |
| C4 | (c) × not exact × `./LICENSE` as the only `LICENSE` link | `is not a plain repository path` for it, then `no inline link to LICENSE` | AC2 |

### Inputs, order and rendering

| ID | Type × field × boundary | Expected behaviour | AC |
|---|---|---|---|
| I1 | provenance input × missing / symlink / directory / not UTF-8 / not valid JSON / UTF-8 BOM / top-level array | one `cannot read license references (…)` each, reasons `missing`, `a symlink`, `not a regular file`, `not UTF-8`, `not valid JSON` (twice), `not a JSON object`; notices still checked | AC3 |
| I2 | notices input × missing / symlink / directory / not UTF-8 | one message each; provenance still checked; no missing-link messages | AC3 |
| I3 | input × permission denied | `not readable`; skipped when running as root or where permissions cannot be removed | AC3 |
| O1 | order × one bad reference of every group | messages in the five-group order | AC3 |
| O2 | order × two bad destinations on one line | by column | AC3 |
| O3 | rendering × value holding `"`, `\`, a newline, U+0007 and U+2028 | rendered by Q: `\"`, `\\`, `\n`, `\u0007`, ` ` | AC3 |
| O4 | rendering × key holding `/` and `~` on the pointer path | pointer uses `~1` and `~0` | AC3 |

### Wiring, texts and delivery

| ID | Type × field × boundary | Expected behaviour | AC |
|---|---|---|---|
| W1 | `verify()` × a fixture with one bad notices link | its returned errors include that message | AC4 |
| W2 | verifier CLI × real tree at HEAD | exits 0; the PASS line is T1 | AC4 |
| W3 | verifier module × imports | standard library only; no `subprocess` | AC4 |
| T1–T5 | texts × after | each text as defined above | AC5 |
| E1 | E2E × real tree | as W2, run in the ticket worktree | AC6 |
| E2 | E2E × `git worktree add --detach` of HEAD in a temporary directory | the verifier there exits 0; this is the guarantee that every target is committed | AC6 |
| E3 | E2E × in that worktree, the line-34 destination at B0 changed to `.agents/skills/code-review/LICENCE` | exits 1; the only `FAIL:` line is `FAIL: THIRD_PARTY_NOTICES.md:<line>: license reference ".agents/skills/code-review/LICENCE" does not exist` | AC6 |
| X1 | diff × paths | `git diff <B>...HEAD --name-only` lists only `scripts/verify-project.py`, `scripts/test_verify_project.py`, `AGENTS.md`, `docs/README.md`, the ADR of T4, files under `.proj.tickets/0005-license-reference-check/`, and `.proj.specs/0005-license-reference-check/review/security-T-NNNN.md` | AC7 |
| X2 | branch × base | B is recorded first in Comments; `main` is not merged without the owner's consent | AC7 |
| X3 | checks × at HEAD | `python3 scripts/verify-project.py`, `python3 -m unittest discover -s scripts -p 'test_*.py'` and `python3 scripts/check_style_skills.py` exit 0 | AC7 |

## Self-check of rules added in this revision

| Rule | Parameters complete | Boundaries closed | Acceptance exit | Conflict checked against |
|---|---|---|---|---|
| (a) skip and whitespace steps | yes | empty, whitespace-only, `<`, inner and outer whitespace | P2, P4, P5 | B0 placeholder and sentence are still skipped |
| (b) scheme allow-list | yes | one letter, allowed, other, uppercase | N2, N4, P6 | 0003's two-letter rule replaced; `C:` stays outside |
| path rule 2 | yes | `%`, `?`, whitespace, `.`, empty segment, trailing `/` | R2, C4 | no B0 target hits it |
| resolution with NFC and casefold | yes | exact, case, NFC, missing, below a file | R3, R4 | symlink check runs only on exact matches |
| grammar constructs | yes | each construct, fences, code spans, priority | G1–G5 | no B0 line hits any (Facts at B0) |
| unreadable reasons | yes | symlink, missing, directory, OSError, UTF-8, JSON, BOM, top level | I1–I3 | existing `verify()` provenance message unchanged |
| Q rendering | yes | quote, backslash, control, U+2028, non-string | O3, P3 | strings keep the 0003 `"<value>"` look |
| no Git | yes | untracked files pass the unit check | E2 | Out of Scope states it |
