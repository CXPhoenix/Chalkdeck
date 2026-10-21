---
epic: 0003-license-split
status: draft
revision: 1
---

# Spec 0003 — License content under CC BY-SA 4.0 and code under MIT

Definitions live in `traceability.md` and are not repeated here: Base B, Source LICENSE, licensor,
boundary table, asset inventory, notices, provenance file, root-MIT claims, license references.

## Problem Statement

The repository is public but has no root `LICENSE`. Its notices and provenance records still say
that project material is covered by "the root MIT LICENSE". That sentence is inherited from the
harness-agile template and does not match any file. The author wants the teaching content (decks,
themes, documentation) licensed for sharing under CC BY-SA 4.0, the same license they use in
`CXPhoenix/0x1dea`. CC itself recommends against CC licenses for software, so the code and agent
tooling should stay under MIT.

The repository also holds material the author does not own, and none of it is marked today:

- school and ISIP.hs logos
- the Ministry of Education Kai font, under CC BY-ND 3.0 TW
- vendor logos and screenshots in decks
- a theme ported from a Slidev theme

## Solution

- **Two license files at the root.**
  - `LICENSE` is the CC BY-SA 4.0 legal code, copied byte for byte from `0x1dea`. GitHub shows this
    one.
  - `LICENSE-CODE` is the MIT license, in the author's name.
- **Boundary.** The notices start with a licensing section that says which directories each
  license covers, and that third-party material keeps its own terms.
- **Third-party material.** The author classifies every asset file. The notices list everything
  third-party or unconfirmed, give the MOE font its required attribution, and end with a catch-all
  exclusion. The font's "fixed" variant is investigated, because an adaptation would conflict with
  its no-derivatives license.
- **Provenance records** point at `LICENSE-CODE`.
- **README** gets a short licensing section.
- **Verifier.** It reports any license reference that does not resolve to a file, so this class of
  stale pointer cannot come back silently.

## User Stories

1. As the author, I want the repository's content under CC BY-SA 4.0, so that students and other
   teachers can reuse and adapt my decks with attribution.
2. As the author, I want code and agent tooling under MIT, so that the tooling stays compatible
   with its MIT upstreams and with ordinary software reuse.
3. As a reader of the repository, I want one place that says which license covers which path, so
   that I can tell what I may reuse.
4. As a reader, I want third-party logos, fonts and screenshots clearly excluded and attributed, so
   that I do not reuse them under the wrong terms.
5. As the author, I want to know whether the bundled Kai font is an adaptation, so that I can
   decide whether its no-derivatives license allows me to keep distributing it.
6. As an agent running the verifier, I want a failure when a license reference points at a missing
   file, so that a stale "root MIT" pointer is caught the next time.

## Implementation Decisions

- **One ticket.** A single tracer-bullet ticket covers the whole epic. Its branch starts from
  `main` after PR #7 landed (`f1a29c7`), because both touch the provenance file.
- **License files.**
  - `LICENSE` is fetched from the Source LICENSE blob, not retyped. Its SHA-256 is recorded.
  - `LICENSE-CODE` reuses the MIT body already present in the repository's vendored MIT licenses,
    so the text is the standard one.
  - No `LICENSES/` directory, SPDX headers or `REUSE.toml`. REUSE compliance was not chosen; the
    notices carry the boundary.
- **The boundary is by directory, not file type.** It defaults to MIT for any path the table does
  not list (author, 2026-10-21). `docs/agents/`, `AGENTS.md` and `CLAUDE.md` are harness
  instructions and go with the skills under MIT. The rest of `docs/` is content.
- **Notices.**
  - **Structure.** A new top section holds the boundary table and the precedence rule. The existing
    sections stay. The three root-MIT sentences are rewritten to name `LICENSE-CODE`.
  - **Asset classification.** The implementation lists the asset inventory at B and asks the author
    to classify each entry. Only the author's answer can make a file licensor-owned.
  - **Unconfirmed assets.** A file the author does not confirm is listed as third-party. The
    listing shows owner unknown and terms unknown.
- **MOE font.**
  - **Attribution now.** Attribute it to 「中華民國教育部」 under CC BY-ND 3.0 TW, with the license URI.
  - **"fixed" investigation.** Use any evidence available without adding a project dependency: the
    Slidev theme's history, published "fixed" builds, and comparison with the official font.
  - **Outcome.** The result is recorded as format conversion only, adaptation, or unknown. Format
    conversion is allowed by the license's §3. An adaptation or an unknown result stops the ticket
    for the author's ruling.
- **Provenance file.** Only the five `license_location` values and their five `evidence` strings
  change. The JSON structure and every other entry stay byte-identical.
- **Verifier.**
  - **New check.** A function in `scripts/verify-project.py`, called from `verify()` beside
    `check_glossary`, returns one message per bad license reference. `main()` prints each message as
    `FAIL: <message>`, as today.
  - **Message forms.**
    - provenance: `docs/agents/skill-sources.json: license_location <value> at <JSON path> is not an existing file`
    - notices: `THIRD_PARTY_NOTICES.md:<line>: link target <target> is not an existing file`
    - unsafe path: the same forms, with "is outside the repository" in place of "is not an
      existing file"
  - **Resolution.** Targets resolve lexically against the root. A target that is absolute or has a
    `..` segment is rejected without being opened. Symlinks do not count as files, matching the
    glossary check.
  - **Unreadable input.** A missing or unreadable provenance file or notices file gives one message
    for that file, and the other checks still run.
- **README.** A short section in Taiwan Traditional Chinese, placed near the end, with links to
  the three files. There is no English companion README.
- **Charter constraints.**
  - Charter 3: no file under `slides/`, `themes/` or `assets/` changes. The licensing statements
    live in root files only.
  - Charter 4: no dependency is added.
  - The open-slide rules forbid touching `package.json`, so it gets no `license` field.

## Testing Decisions

- **What a good test is.** It drives `verify(root)`, or the new function, on a fixture tree in a
  temporary directory. It asserts only the returned messages and the PASS or FAIL exit, never
  internal helpers.
- **Prior art.** The glossary tests in `scripts/test_verify_project.py`, which build minimal
  fixtures and check message text, and its symlink and unreadable-file cases.
- **Covered by tests.** The license-reference check gets a test per matrix row V1–V9 (row V10 is the
  real tree), written first and red before the implementation, under the normal `/tdd` loop.
  Symlink cases skip where the platform cannot create symlinks.
- **Checked in Comments, not by tests.** The license files, notices, provenance edits and README
  are content:
  - AC1 and AC2 by `cmp` and `diff` against their sources.
  - AC3–AC7 and AC9 by reading the diff, with the author's classification quoted.
  - AC10 by the diff stat and the three check commands.
- **End to end.** The surface is the verifier CLI, run locally on the real tree. There is also one
  run on a temporary copy with a broken notices link, which must exit 1 with that line.

## Acceptance Criteria

- **AC1.** At HEAD, `LICENSE` is byte-identical to the Source LICENSE. `cmp` against the fetched
  blob succeeds, and the SHA-256 is recorded in the notices and in ticket Comments. If the Source
  LICENSE cannot be fetched, the ticket stops and reports instead of writing any text.
- **AC2.** `LICENSE-CODE` differs from `.agents/skills/tdd/LICENSE` only in the copyright line,
  which reads `Copyright (c) 2026 CXPhoenix`.
- **AC3.** The notices begin with a licensing section. It states:
  - the boundary table, the licensor with link, and each license's name and file
  - the precedence rule
  - "Except where otherwise noted"

  No sentence at HEAD says the root `LICENSE` is MIT: `git grep -n -i "root MIT"` over the notices
  and the provenance file returns nothing. The three root-MIT sentences of B (lines 3, 76, 87) name
  `LICENSE-CODE`.
- **AC4.** Ticket Comments hold the asset inventory at B and the author's classification of each
  entry, quoted, including the ported theme's origin. The notices list each third-party entry with
  path, owner and terms, or "unknown". Unconfirmed entries count as third-party, and a theme ported
  from someone else's work is marked third-party-derived. One catch-all sentence excludes unlisted
  logos, trademarks, screenshots and third-party marks.
- **AC5.** The notices attribute `assets/fhsh-isiphs/fonts/edukai-fixed.woff2` to 「中華民國教育部」
  under CC BY-ND 3.0 TW, with the license URI.
- **AC6.** Comments record the font's origin and what "fixed" changed, with evidence and one of
  three outcomes: format conversion only, adaptation, or unknown. On adaptation or unknown, the
  ticket does not land until the author has ruled (keep, replace with the official font, or remove),
  and the ruling is quoted.
- **AC7.** In the provenance file, `git diff B...HEAD` changes exactly the five `license_location`
  values (`"LICENSE"` → `"LICENSE-CODE"`) and the five matching `evidence` strings, which now name
  the MIT license in `LICENSE-CODE`.
- **AC8.** The verifier's license-reference check behaves as matrix rows V1–V9. Each row has a
  test that was red before the implementation. At HEAD the verifier exits 0, and its PASS line
  mentions license references.
- **AC9.** `README.md` has a short Taiwan Traditional Chinese 授權 section. It states the split and
  the licensor, says third-party material is excluded, and links `LICENSE`, `LICENSE-CODE` and
  `THIRD_PARTY_NOTICES.md`.
- **AC10.** `git diff B...HEAD --stat` touches only the files listed in matrix row X1, and nothing
  under `slides/`, `themes/` or `assets/`. These all exit 0 at HEAD:
  - `python3 scripts/verify-project.py`
  - `python3 scripts/check_style_skills.py`
  - `python3 -m unittest discover -s scripts -p 'test_*.py'`

## Out of Scope

- **Deployed builds.** Notices on deployed decks are out of scope. Built sites ship
  `edukai-fixed.woff2` and logos without the license URI that CC BY-ND 3.0 TW §4(a) asks for with
  each copy. Fixing that means changing decks or the theme, which Charter 3 forbids for template
  work. Recorded as OQ-3.
- **Other licensing schemes.** No per-file SPDX headers, no REUSE compliance, no `package.json`
  `license` field.
- **Other licenses.** Third-party skills keep their own LICENSE files, and their notices sections
  stay as they are.
- **Asset changes.** No asset is replaced or removed in this epic unless the author rules so under
  AC6.
- **No retroactive statements.** Nothing is said about earlier commits or already-deployed copies.

## Further Notes

Evidence gathered on 2026-10-21 (primary sources):

- **CC on software.** The CC FAQ, "Can I apply a Creative Commons license to software?", recommends
  against CC licenses for software, but allows them for documentation and artistic elements.
- **Marking excluded material.** The CC BY-SA 4.0 legal code, "Considerations for licensors", asks
  licensors to mark material that the license does not cover. The CC wiki, "Marking your work",
  suggests the "Except where otherwise noted" phrasing.
- **GitHub detection.** GitHub Docs, "Licensing a repository", says GitHub detects one root license;
  other licenses are explained elsewhere, such as the README.
- **MOE font license.** The MOE document 《國字標準字體字形檔》 states:
  - 教育部標準楷書 is CC BY-ND 3.0 TW, attributed to 「中華民國教育部」.
  - §3 allows technically necessary format changes but no adaptations.
  - §4(a) requires the license text or URI with every copy.
- **Font provenance at B.** The font came from a Slidev theme during the port recorded in
  `docs/legacy-openspec/changes/archive/2026-06-22-port-fhsh-isiphs-theme/`. Commit `1dedd3f`
  records no source URL.
