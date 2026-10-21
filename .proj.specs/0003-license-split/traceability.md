# Traceability — 0003 license split

Source of truth for scope. `spec.en.md` prose is derived from this file. Owner decisions come from
the stage-1 grill of 2026-10-21 (two rounds and two boundary clarifications) and the round-1 review
rulings of 2026-10-21 (`review/round-1.md`).

## Definitions

**Repository owner.** CXPhoenix (https://github.com/CXPhoenix), in person. The glossary's
"Author" includes agents; this term does not. Classifications and rulings in this epic need the
repository owner's answer, quoted in ticket Comments.

**Licensor.** The repository owner, as the holder of the rights licensed here.

**Base (B).** The commit on `main` that the ticket branch starts from. Its full SHA is the first
entry in the ticket's Comments. Every diff below is `git diff <B SHA>...HEAD`.

**Source LICENSE.** Path `LICENSE` in `CXPhoenix/0x1dea` at commit
`0e690064985d9d734849e1ec44a8c0f8d84fb2a3`:

- git blob id `2e72ca1121b413a67745f02f679eb5caef6c7bef`
- 20,132 bytes, LF line endings, no CR
- SHA-256 `bae5ccc863235f984a52c07d011e48a86c0c12f923be2dedd8624c7abdc22c6c`

It is the Creative Commons Attribution-ShareAlike 4.0 International legal code. The blob id was
read with the GitHub contents API on 2026-10-21.

**Boundary table.** It assigns the licensor's own rights in each tracked path.

| License file | License | Paths |
|---|---|---|
| `LICENSE` | CC BY-SA 4.0 | `slides/`, `themes/`, `assets/`, `docs/` except `docs/agents/`, `README.md`, `GLOSSARY.md`, `.proj.specs/`, `.proj.tickets/` |
| `LICENSE-CODE` | MIT | every other tracked path, including `scripts/`, `.agents/`, `.claude/`, `.codex/`, `.github/`, `deploy/`, `AGENTS.md`, `CLAUDE.md`, `docs/agents/`, root configuration and lock files, and any path added later that the table does not list |

- Code files (`.tsx`, `.ts` and others) inside a CC BY-SA path are CC BY-SA.
- `LICENSE`, `LICENSE-CODE` and the notices are license texts and notices; the table does not
  license them.
- The theme `themes/fhsh-isiphs-universal` and the Slidev theme it was ported from are the
  repository owner's own work (owner, 2026-10-21). Its copies inlined into decks, its
  documentation, and the generator `scripts/new-deck.mjs` are licensor-owned.

**Precedence.** Third-party material keeps its own terms, whichever directory it sits in. It is
third-party if any of these holds:

- it is listed in the notices
- it carries its own `LICENSE`
- it is in the third-party skill set

**Third-party skill set.** Skills in `.agents/skills/` that were installed by an external tool or
written by `@open-slide/core`, and that at B have neither their own `LICENSE` nor a notices
section. At B these are:

- `seaborn` and `scientific-visualization`, from `k-dense-ai/claude-scientific-skills` per
  `skills-lock.json`
- `apply-comments`, `create-slide`, `create-theme`, `current-slide` and `slide-authoring`, written
  by `@open-slide/core`, whose package license is MIT

The implementation derives the set again at B.

**Asset inventory.** Every tracked file under `assets/` and `slides/*/assets/`, except
`assets/.gitkeep`. At B that is 7 files under `assets/fhsh-isiphs/` and 12 under
`slides/*/assets/`. The implementation lists the inventory again at B.

**Asset classes**, assigned by the repository owner:

- *licensor-owned*: made by the licensor, with no third-party content
- *third-party*: someone else's work
- *mixed*: made by the licensor but containing third-party content, such as a screenshot of
  someone else's interface or an archive bundling others' files

A file the owner does not classify is third-party.

**Notices.** `THIRD_PARTY_NOTICES.md`.

**Provenance file.** `docs/agents/skill-sources.json`.

**Root-MIT claims at B.**

- Notices lines 3, 76 and 87.
- Five `license_location: "LICENSE"` values (tune-skills, init-template, tw-emoji-commit,
  tw-emoji-pr-note, tw-emoji-release-note).
- The five `evidence` strings next to them.
- `licensing.project_license: "MIT"`.

**Stale entry.** `init-template` is listed in the provenance file and on notices line 87, but no
skill directory of that name exists in either tree at B.

**License references** (what the verifier checks):

- (a) Every value under a `license_location` key, at any depth of the provenance file.
  - A string that contains whitespace or `<` is a description or placeholder and is skipped.
  - Any other value, including a non-string or an empty string, is checked.
- (b) Every CommonMark inline link or image destination in the notices.
  - The link text may span lines. A `"title"`, `'title'` or `(title)` and an angle-bracket
    destination `<...>` are allowed.
  - Links inside code spans and fenced code blocks are skipped.
  - Reference-style links and HTML tags are not checked.
  - A destination that has a URL scheme (`^[A-Za-z][A-Za-z0-9+.-]+:`, two or more characters
    before the colon) or starts with `#` is skipped.
  - Any `#fragment` is stripped before the target is checked.
- (c) The notices must contain inline links to `LICENSE` and to `LICENSE-CODE`.
- (d) In the provenance file, an object that holds both `license` and `license_location` must
  agree with the root license files. `license_location` `LICENSE` requires `license`
  `CC-BY-SA-4.0`, and `LICENSE-CODE` requires `MIT`. This catches a re-imported template entry
  such as `"license": "MIT", "license_location": "LICENSE"`.

**Valid target.** A target is valid when all of these hold:

- It is a relative POSIX path.
- It is not empty.
- It does not start with `/`, `\` or `//`, and has no drive prefix `X:`.
- It contains no backslash and no `..` segment.
- Resolved from the repository root, every component matches a name from `os.listdir` of its
  parent exactly, including case, and no component is a symlink.
- The final component is a regular file.
- The path is tracked by Git (`git ls-files`).

**Messages** (each is printed by `main()` as `FAIL: <message>`):

| Case | Message |
|---|---|
| provenance target | `docs/agents/skill-sources.json: license reference "<value>" at <JSON Pointer> <reason>` |
| notices target | `THIRD_PARTY_NOTICES.md:<line>: license reference "<destination>" <reason>`, where `<line>` is the 1-based line, counted on `\n`, holding the destination's first character, and `<destination>` is the destination as written, fragment included |
| reasons | `is not a string`, `is empty`, `is outside the repository` (absolute, drive, backslash, `//` or `..`), `does not exist`, `differs in case from <actual path>`, `passes through a symlink at <component path>`, `is not a regular file`, `is not tracked by Git` |
| unreadable input | `<file>: cannot read license references (<reason>)`; `<reason>` is one of `missing`, `a symlink`, `not UTF-8`, `not valid JSON`, `not a JSON object` |
| no Git | `license references: cannot list tracked files (<reason>)` |
| missing required link | `THIRD_PARTY_NOTICES.md: no inline link to LICENSE`, and the same for `LICENSE-CODE` |
| license mismatch | `docs/agents/skill-sources.json: license reference "<value>" at <JSON Pointer> is <CC-BY-SA-4.0 or MIT>, not "<license value>"` |

Each bad reference gives one message, with the first failing reason in the order listed. Messages
come in this order:

1. no Git
2. unreadable inputs: provenance, then notices
3. provenance references and license mismatches, in document order
4. notices references, by line and then column
5. missing required links: `LICENSE`, then `LICENSE-CODE`

The existing provenance message in `verify()` (`Skill provenance cannot be checked: ...`) is
unchanged, so `verify()` can report a missing provenance file twice. The license-reference
function is tested on its own.

## Matrix

| ID | Type × field × boundary | Expected behaviour | AC |
|---|---|---|---|
| L1 | `LICENSE` × content × after | `git rev-parse HEAD:LICENSE` is `2e72ca1121b413a67745f02f679eb5caef6c7bef`; its SHA-256 is recorded in the notices | AC1 |
| L2 | `LICENSE-CODE` × content × after | `diff` against `.agents/skills/tdd/LICENSE` shows only the copyright line, which reads `Copyright (c) 2026 CXPhoenix` | AC2 |
| N1 | notices × licensing section × after | line 1 is the B heading; lines 3–6 of B are replaced by a `## Licensing` section with the boundary table, the code-file rule, the precedence rule, the licensor with link, the phrase "Except where otherwise noted", inline links to `LICENSE` and `LICENSE-CODE`, and the Source LICENSE commit and SHA-256 | AC3 |
| N2 | notices × root-MIT claims × after | B lines 76 and 87 name the MIT license in `LICENSE-CODE`; line 87 no longer lists `init-template`; `git grep -n -i "root MIT" -- THIRD_PARTY_NOTICES.md docs/agents/skill-sources.json README.md` returns nothing | AC3 |
| N3 | notices × other B content × after | every B line other than 3–6, 76 and 87 is unchanged; new content is only the licensing section and new sections or entries for N4, N5 and N7 | AC3 |
| N4 | notices × asset inventory × each file | ticket Comments quote the owner's class for each file; every third-party or mixed file is listed with its path, owner (or "unknown"), terms (or "unknown") and, for mixed files, what the third-party part is | AC4 |
| N5 | notices × catch-all × after | one sentence excludes logos, trademarks, screenshots and other third-party marks that are neither listed nor classified licensor-owned | AC4 |
| N6 | notices × MOE font × after | `assets/fhsh-isiphs/fonts/edukai-fixed.woff2` is attributed to 「中華民國教育部」 under CC BY-ND 3.0 TW with `https://creativecommons.org/licenses/by-nd/3.0/tw/legalcode`; the font file and its use are unchanged (owner, 2026-10-21) | AC5 |
| N7 | notices × third-party skill set × each skill | one entry per skill with its source and terms: the terms in its `SKILL.md` frontmatter, the `@open-slide/core` package license for open-slide skills, or "unknown" | AC6 |
| S1 | provenance × root-MIT claims × after | the five `license_location` values become `"LICENSE-CODE"`; the five `evidence` strings name the MIT license in `LICENSE-CODE`; `project_license` becomes `"CC-BY-SA-4.0 (content) and MIT (code); see THIRD_PARTY_NOTICES.md"` | AC7 |
| S2 | provenance × stale entry × after | the `skills.init-template` entry is removed | AC7 |
| S3 | provenance × everything else × after | no other key or value changes | AC7 |
| V1 | verifier × reference (a) × valid target | no message | AC8 |
| V2 | verifier × reference (a) × missing / directory / final symlink / parent symlink / case mismatch / untracked | one message each, reasons `does not exist`, `is not a regular file`, `passes through a symlink at …` (twice), `differs in case from …`, `is not tracked by Git` | AC8 |
| V3 | verifier × reference (a) × absolute / `..` / backslash or drive | one message each, `is outside the repository`, even when the named path exists | AC8 |
| V4 | verifier × reference (a) × whitespace or `<` | skipped, no message | AC8 |
| V5 | verifier × reference (a) × non-string / empty string | one message each, `is not a string` / `is empty` | AC8 |
| V6 | verifier × reference (b) × valid target, written as plain link, image, angle-bracket destination, link with title, and link whose text spans two lines | no message for any of the five | AC8 |
| V7 | verifier × reference (b) × the six invalid targets of V2 | one message each with the notices line | AC8 |
| V8 | verifier × reference (b) × URL scheme / `#anchor` / `path#fragment` with valid path / link in code span / link in fenced block | no message for any of the five | AC8 |
| V9 | verifier × reference (b) × absolute / `..` / `//host` / `C:x` | one message each, `is outside the repository` | AC8 |
| V10 | verifier × input files × provenance missing / provenance not JSON / provenance not an object / notices missing / notices not UTF-8 / notices a symlink | one `cannot read` message each from the license-reference function; the other input is still checked | AC8 |
| V11 | verifier × Git × root not in a work tree | one `cannot list tracked files` message; no other license-reference message | AC8 |
| V12 | verifier × reference (c) × link to `LICENSE` absent / link to `LICENSE-CODE` absent | one message each | AC8 |
| V13 | verifier × several bad references | messages come in the stated order | AC8 |
| V14 | verifier × reference (d) × `LICENSE` with `MIT` / `LICENSE-CODE` with `CC-BY-SA-4.0` / `LICENSE-CODE` with `MIT` | one message each for the first two, none for the third | AC8 |
| V15 | verifier × real tree × after | `verify-project.py` exits 0 and its PASS line contains the words `license references` | AC8, AC11 |
| R1 | `README.md` × license section × after | an English `## License` section of at most 8 lines states the split and the licensor, says third-party material is excluded, and links `LICENSE`, `LICENSE-CODE` and `THIRD_PARTY_NOTICES.md` | AC9 |
| D1 | `docs/adr/0007-license-split.md` × decisions × after | records the directory boundary, the MIT default, `docs/agents/` under MIT, the theme's origin, and the font kept as it is with attribution only, each with the owner's date | AC10 |
| D2 | `AGENTS.md` × verifier description × after | the "Build and test commands" sentence on `verify-project.py` mentions license references | AC10 |
| X1 | repository × diff scope | `git diff <B SHA>...HEAD --stat` touches only `LICENSE`, `LICENSE-CODE`, the notices, `README.md`, the provenance file, `scripts/verify-project.py`, `scripts/test_verify_project.py`, `AGENTS.md`, `docs/adr/0007-license-split.md`, `.proj.specs/0003-license-split/review/security-T-*.md` and this epic's ticket files; nothing under `slides/`, `themes/` or `assets/` changes | AC11 |
| X2 | checks × after | `verify-project.py`, `check_style_skills.py` and `python3 -m unittest discover -s scripts -p 'test_*.py'` exit 0 | AC11 |
