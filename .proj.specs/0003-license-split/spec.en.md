---
epic: 0003-license-split
status: split
revision: 2
superseded_by: [0004, 0005]
---

# Spec 0003 — License content under CC BY-SA 4.0 and code under MIT

Definitions live in `traceability.md` and are not repeated here: repository owner, licensor,
Base B, Source LICENSE, boundary table, precedence, third-party skill set, asset inventory and
classes, notices, provenance file, root-MIT claims, stale entry, license references, valid target,
messages.

Revision 2 applies the repository owner's round-1 rulings of 2026-10-21 (`review/round-1.md`):

- The font is kept as it is, with attribution only; the "fixed" investigation is dropped.
- The ported theme is the owner's own work.
- The README section is in English, matching the README.
- Every other finding is handled as proposed.

## Problem Statement

The repository is public but has no root `LICENSE`. Its notices and provenance records still say
project material is covered by "the root MIT LICENSE". That sentence is inherited from the
harness-agile template and does not match any file.

The repository owner wants the teaching content (decks, themes, documentation) licensed for sharing
under CC BY-SA 4.0, the license they use in `CXPhoenix/0x1dea`. CC itself recommends against CC
licenses for software, so code and agent tooling should stay under MIT.

The repository also holds material the owner does not own, and none of it is marked:

- school and ISIP.hs logos
- the Ministry of Education Kai font, under CC BY-ND 3.0 TW
- vendor logos and screenshots in decks
- seven skills installed from outside the project that carry no license file

## Solution

- **Two license files at the root.**
  - `LICENSE` is the CC BY-SA 4.0 legal code, the same blob as in `0x1dea`. It is the license
    GitHub shows first.
  - `LICENSE-CODE` is MIT, in the owner's name.
- **A licensing section at the top of the notices.** It says which paths each license covers, and
  that third-party material keeps its own terms.
- **Classified assets.** The owner classifies every asset file. The notices list everything that
  is third-party or mixed, attribute the MOE font, list the seven unlicensed skills, and end with a
  catch-all exclusion.
- **Provenance records** stop calling the project MIT-only and drop a stale entry.
- **README and ADR.** The README gets a short License section. A new ADR records the decisions.
- **Verifier.** It checks that every license reference resolves to a tracked regular file, named
  with exact case and reached without symlinks, and that a provenance entry's license matches the
  root file it names. A stale license pointer cannot return silently.

## User Stories

1. As the repository owner, I want the repository's content under CC BY-SA 4.0, so that students
   and other teachers can reuse and adapt my decks with attribution.
2. As the repository owner, I want code and agent tooling under MIT, so that the tooling stays
   compatible with its MIT upstreams and with ordinary software reuse.
3. As someone reusing material from the repository, I want one place that says which license
   covers which path, so that I know what I may reuse and how.
4. As someone reusing material, I want third-party logos, fonts, screenshots and skills excluded
   and attributed, so that I do not reuse them under the wrong terms.
5. As an agent running the verifier, I want a failure when a license reference does not resolve to
   a tracked file, so that a stale license pointer is caught the next time.

## Implementation Decisions

- **One ticket.** A single tracer-bullet ticket covers the epic. Its branch starts from `main`
  after this spec lands. Its first Comment records B's full SHA.

- **License files.**
  - `LICENSE` is the Source LICENSE blob, fetched by its blob id and not retyped. The blob is
    LF-only, so `.gitattributes` needs no change.
  - `LICENSE-CODE` reuses the MIT body of the repository's vendored MIT licenses.
  - No `LICENSES/` directory, SPDX headers or `REUSE.toml`.

- **Boundary.** It is drawn by directory, not by file type, and defaults to MIT (owner,
  2026-10-21).
  - `docs/agents/`, `AGENTS.md` and `CLAUDE.md` go with the skills under MIT: they are the harness
    instructions the skills depend on, and they track the MIT harness-agile template.
  - Everything else in `docs/`, and the spec and ticket trees, is licensed as content. That is the
    owner's choice; it is not a claim that those files are written for the audience.
  - Private decks are covered too. Their files are already public in this repository, and the
    license grants nothing beyond reuse of what is published.

- **Notices.**
  - **Licensing section.** It replaces the opening paragraph after the heading.
  - **Lines 76 and 87.** These two sentences are rewritten to name `LICENSE-CODE`.
  - **Everything else.** All other existing lines stay as they are.
  - **New entries:**
    - third-party and mixed assets
    - the MOE font
    - one entry per skill in the third-party skill set
  - **The LICENSE checksum.** The Source LICENSE commit and SHA-256 are recorded in the licensing
    section.

- **Asset classification.**
  - The implementation lists the asset inventory at B. The repository owner gives each file a
    class, and the answer is quoted in Comments.
  - An agent's own judgement never makes a file licensor-owned.
  - The two `.zip` challenge archives get an explanation of what they contain.

- **MOE font.** The font is attributed and otherwise left exactly as it is; the owner ruled not to
  investigate or change it.

- **Provenance file.**
  - The five root-MIT `license_location` values and `evidence` strings change.
  - `project_license` changes to describe the split.
  - The stale `init-template` entry is removed.
  - Nothing else changes.

- **Verifier.**
  - **Placement.** A new function `check_license_references(root)` in `scripts/verify-project.py`,
    marked `# chalkdeck:` like the other local additions, is called from `verify()` beside
    `check_glossary`. It returns the messages defined in `traceability.md`, in the stated order.
  - **Tracked files.** It lists tracked files once, with `git ls-files`.
  - **Resolution.** Targets are resolved component by component with `os.listdir` and `lstat`, so
    case and symlinks are judged the same way on every file system.
  - **Unchanged behaviour.** The existing provenance check is unchanged.
  - **PASS line.** It gains the words `license references`.
  - **AGENTS.md.** Its description of the verifier is updated to match.

- **README.** An English `## License` section, at most 8 lines, near the end.

- **ADR.** `docs/adr/0007-license-split.md` records the decisions listed in matrix row D1.

- **Charter constraints.**
  - No file under `slides/`, `themes/` or `assets/` changes (Charter 3 and 5).
  - No dependency is added (Charter 4).
  - The open-slide rules forbid touching `package.json`, so it gets no `license` field.

## Testing Decisions

- **What a good test is.** It calls `check_license_references(root)` on a fixture tree in a
  temporary directory, and compares the returned list of messages exactly.
  - The fixture is a fresh Git repository: `git init`, files written, then `git add`.
  - Row V11 uses a directory that is not a Git work tree.
  - Row V15 runs the verifier on the real tree.
- **Prior art.** The glossary tests in `scripts/test_verify_project.py`: minimal fixtures, exact
  message text, symlink cases that skip where symlinks cannot be created, and a non-UTF-8 case
  that needs no permission tricks.
- **One test per sub-case.** Every sub-case named in rows V1–V14 is its own test. They are written
  one at a time under `/tdd`: one test, red, then the minimal code to make it green. Each red
  failure output is recorded in ticket Comments, with the commit it ran at.
- **Content checks.** These are checked in Comments, not by tests:
  - AC1 and AC2: `git rev-parse` and `diff`.
  - AC3: the diff hunk list of the notices.
  - AC4–AC7 and AC9: reading the diff, with the owner's classification quoted.
  - AC10: the ADR file and the `AGENTS.md` hunk.
  - AC11: the diff stat and the three check commands.
- **End to end.** The surface is the verifier CLI, run locally on the real tree. A second run uses a
  `git worktree` checkout of HEAD in a temporary directory, with one notices link broken. It must
  exit 1 and print exactly that message, among the existing checks' output.

## Acceptance Criteria

- **AC1.** `git rev-parse HEAD:LICENSE` prints `2e72ca1121b413a67745f02f679eb5caef6c7bef`. The
  notices record the Source LICENSE commit and the SHA-256
  `bae5ccc863235f984a52c07d011e48a86c0c12f923be2dedd8624c7abdc22c6c`.
- **AC2.** `diff .agents/skills/tdd/LICENSE LICENSE-CODE` shows exactly one changed line, the
  copyright line, which reads `Copyright (c) 2026 CXPhoenix` in `LICENSE-CODE`.
- **AC3.** The notices satisfy rows N1–N3:
  - **Licensing section.** It sits after the unchanged heading, in place of B's lines 3–6, and
    contains every item listed in N1.
  - **Lines 76 and 87.** They name `LICENSE-CODE`, and line 87 no longer lists `init-template`.
  - **No root-MIT claim left.** The `git grep` in N2 returns nothing.
  - **Nothing else changed.** The notices diff has hunks only at lines 3–6, 76 and 87, plus
    added sections or entries.
- **AC4.**
  - Ticket Comments list the asset inventory at B and quote the repository owner's class for each
    file.
  - The notices list every third-party or mixed file with path, owner, terms and, for mixed files,
    the third-party part. Unknown values are written as "unknown".
  - The notices contain the catch-all sentence of N5.
- **AC5.** The notices attribute `assets/fhsh-isiphs/fonts/edukai-fixed.woff2` to 「中華民國教育部」
  under CC BY-ND 3.0 TW, with the URI given in N6. `git diff <B SHA>...HEAD -- assets/` is empty.
- **AC6.** The notices have one entry per skill in the third-party skill set, as derived at B, with
  source and terms as N7 defines.
- **AC7.** In the provenance file, `git diff <B SHA>...HEAD` shows exactly the changes of rows S1
  and S2, and parsing both versions as JSON shows no other difference (S3).
- **AC8.** Each sub-case of rows V1–V14 has its own test whose red output is recorded in Comments
  before its implementation. All of them pass at HEAD. `verify-project.py` exits 0 on the real tree,
  and its PASS line contains `license references` (V15).
- **AC9.** `README.md` contains the `## License` section of row R1. It has at most 8 lines between
  its heading and the next heading or end of file.
- **AC10.** `docs/adr/0007-license-split.md` exists and records each decision in D1. `AGENTS.md`
  satisfies D2.
- **AC11.** `git diff <B SHA>...HEAD --stat` touches only the paths in row X1, and the three
  commands in row X2 exit 0 at HEAD.

## Out of Scope

- **The font itself.** No investigation of the "fixed" variant, and no replacement or removal
  (owner, 2026-10-21). Only the attribution is added.
- **Deployed builds.** Built sites ship the font and logos without the notices their terms ask for;
  recorded as OQ-3. Charter 3 forbids changing existing decks. A theme or build-time change for new
  decks is possible, but it belongs to a deck-surface epic, not this repository-licensing one.
- **Other licensing schemes.** No per-file SPDX headers, REUSE compliance, or `package.json`
  `license` field.
- **README language.** The README is in English although `docs/agents/language.md` says README is
  Traditional Chinese. This epic follows the file as it is and does not resolve that divergence.
- **Process for future assets.** No rule yet requires an agent that adds a third-party asset to
  update the notices. The catch-all and precedence rules cover such material in the meantime.
- **No retroactive statements.** Nothing is said about earlier commits or already-deployed copies.

## Further Notes

- **Expected consequences, accepted by the owner.**
  - Deck and theme code is CC BY-SA, so reusing it in software brings ShareAlike with it.
  - New top-level paths default to MIT unless the table is updated.
  - GitHub may also detect `LICENSE-CODE` and show two licenses.
  - These notices are public once they land.

- **Evidence, 2026-10-21 (primary sources).**
  - **CC on software.** The CC FAQ, "Can I apply a Creative Commons license to software?",
    recommends against CC licenses for software, and allows them for documentation and artistic
    elements.
  - **Marking.** The CC BY-SA 4.0 legal code, "Considerations for licensors", asks licensors to
    mark excluded material. The CC wiki, "Marking your work", gives the phrase "Except where
    otherwise noted".
  - **GitHub.** GitHub Docs, "Licensing a repository", says GitHub detects a root license and
    leaves other licenses to be explained elsewhere.
  - **MOE font.** The MOE document 《國字標準字體字形檔》 says 教育部標準楷書 is CC BY-ND 3.0 TW and
    must be attributed to 「中華民國教育部」.
  - **Source LICENSE blob.** The GitHub contents API, read on 2026-10-21.
  - **open-slide license.** The `license` field of `@open-slide/core`'s `package.json` in the
    author's installed copy.
