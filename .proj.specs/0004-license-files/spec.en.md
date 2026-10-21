---
epic: 0004-license-files
status: draft
revision: 1
split_from: 0003-license-split
---

# Spec 0004 — License files and notices: content under CC BY-SA 4.0, code under MIT

`traceability.md` holds what this spec does not repeat:

- **Definitions:** Base B, Source LICENSE, MIT body, asset inventory and its classification,
  root-MIT claims, stale init-template entries.
- **Target texts T1–T12:** the exact text each file holds at HEAD.

Epic 0004 is the documentation half of epic 0003, which was split after its second review
round. The verifier's license-reference check is epic 0005, which depends on this one.

## Problem Statement

The repository is public but has no root `LICENSE`. Its notices and provenance records say the
project is covered by "the root MIT LICENSE", which matches no file.

The repository owner wants:

- the teaching content (decks, themes, documentation) shared under CC BY-SA 4.0, as in
  `CXPhoenix/0x1dea`;
- code and agent tooling kept under MIT, because CC recommends against its licenses for software.

Material the owner does not hold is mixed in and unmarked:

- school and program logos, the Ministry of Education Kai font, vendor logos, a speaker photo and
  a chat screenshot;
- seven skills from open-slide and K-Dense that carry no license file;
- README and agent-guide text that came from the open-slide scaffold.

## Solution

- **Licenses.** The root gets the CC BY-SA 4.0 legal code as `LICENSE` and the MIT license in the
  owner's name as `LICENSE-CODE`.
- **Notices.** The notices open with a licensing section: which paths each license covers, what
  keeps its own terms, and a catch-all exclusion for unlisted third-party works. They gain entries
  for the classified assets, the open-slide and K-Dense material with their copyright lines, and
  one copy of the MIT text.
- **Provenance and pointers.** The provenance records and the agent-browser skill stop pointing at
  a root MIT license, and the stale init-template entries go.
- **README.** It gets a short License section.
- **Agent rules.** The agent rules gain two lines that keep the notices current when material is
  added or open-slide is upgraded.
- **ADR.** A new ADR records the decisions.

## User Stories

1. As the repository owner, I want the content under CC BY-SA 4.0, so that students and other
   teachers can reuse and adapt my decks with attribution.
2. As the repository owner, I want code and agent tooling under MIT, so that they stay compatible
   with their MIT upstreams and with ordinary software reuse.
3. As a reuser, I want one place that says which license covers which path and what is excluded,
   so that I know what I may reuse and on what terms.
4. As a reuser, I want third-party logos, fonts, photos, skills and scaffold text attributed and
   excluded, so that I do not reuse them under the wrong terms.
5. As an agent adding material to a deck or upgrading open-slide, I want a rule telling me to
   update the notices, so that they stay true after this epic.

## Implementation Decisions

- **One ticket.** A single ticket covers the epic.
  - Its branch starts from `main` after this spec lands, and its first Comment records B's full
    SHA.
  - It is documentation only, so its test plan table lists the acceptance checks below. ADR-0006
    does not apply.
- **License files.**
  - `LICENSE` is the Source LICENSE blob, fetched by its blob id and not retyped. It is LF-only,
    so `.gitattributes` needs no change.
  - `LICENSE-CODE` is the MIT text of `.agents/skills/tdd/LICENSE` with the owner's copyright line.
  - Neither file carries a scope statement. Scope lives in the notices and the README.
- **Boundary.** It is drawn by directory and defaults to MIT, as T1 states:
  - Code inside a CC BY-SA path is CC BY-SA.
  - `docs/agents/`, `AGENTS.md` and `CLAUDE.md` are harness instructions and go with the skills
    under MIT.
  - Private decks are covered like the rest; their files are already public in this repository.
- **Precedence.** Third-party status comes from what the notices attribute to another holder, or
  from a license file naming another holder. The owner's own sections in the notices, such as
  "Project-authored skills", do not make anything third-party.
- **Assets.**
  - The repository owner classified the 19 inventory files in 0004's grill; T4 lists the result.
  - A file the owner gave no source for is third-party, with holder "unknown".
  - The chat screenshot is mixed: only the other participants' messages are third-party, and no
    name or nickname appears in the notices.
  - The two challenge archives are the owner's and stay CC BY-SA. Their members are listed in
    Comments by name only, without extracting them.
- **open-slide.**
  - The five skills that `pnpm sync:skills` writes and the scaffold-derived text of `README.md` and
    `AGENTS.md`'s `## open-slide` section are attributed to Yiwei Ho under MIT.
  - The notices name no version; the version is whatever `package.json` names.
  - The upgrade steps in `AGENTS.md` gain a check that the package's copyright line still matches
    the notices.
- **K-Dense.** seaborn and scientific-visualization are attributed to K-Dense Inc. under the MIT
  license of their source repository. The BSD-3-Clause field in seaborn's frontmatter describes
  the seaborn library.
- **MOE font.** It is attributed to 「中華民國教育部」, naming the work 教育部標準楷書 and CC BY-ND 3.0 TW
  with its legal-code URI. The file is not changed or investigated (owner ruling in 0003).
- **Provenance file.** Exactly the changes S1–S6:
  - four `license_location` values and their `evidence` strings point at `LICENSE-CODE`;
  - `project_license` describes the split;
  - `verified_on` is updated;
  - the two init-template entries are removed;
  - the agent-browser adaptation note is extended.

  The `claude_prompt_audit` record is kept as written.
- **agent-browser.** Both trees' `SKILL.md` point at the skill's own Apache-2.0 `LICENSE`.
- **Documentation.** ADR-0007 records the decisions, and `docs/README.md` indexes it. The verifier
  and its descriptions in `docs/guide.md` and `README.md` belong to epic 0005.
- **Charter.** Nothing under `slides/`, `themes/` or `assets/` changes (Charter 3 and 5). No
  dependency is added (Charter 4). `package.json` is not touched.

## Testing Decisions

- **No code changes here.** Epic 0004 changes no code, so it adds no test. The existing unit tests
  and both checkers must still pass (X2).
- **Mechanical acceptance checks.** Each one is run and its output is recorded in ticket Comments:
  - `git rev-parse HEAD:LICENSE` (AC1);
  - `diff` against the tdd LICENSE (AC2);
  - for AC3 and AC6–AC9, a comparison of each changed region with its target text — a script that
    extracts the B and HEAD versions and checks the T-blocks, or the `git diff` hunks read against
    them;
  - a JSON diff of the provenance file (AC5);
  - the scoped `git grep` (C1);
  - `git diff --name-only` (X1);
  - the three check commands (X2).
- **End to end.** The surfaces are a GitHub file view of the branch and the repository page after
  the merge. The check is that `LICENSE`, `LICENSE-CODE`, the notices and the README render, and
  that their relative links open. No browser automation is required; the result is reported in
  Comments, naming the surface.

## Acceptance Criteria

- **AC1.** `git rev-parse HEAD:LICENSE` prints `2e72ca1121b413a67745f02f679eb5caef6c7bef` (L1).
- **AC2.** `diff .agents/skills/tdd/LICENSE LICENSE-CODE` shows exactly one changed line, and in
  `LICENSE-CODE` that line reads `Copyright (c) 2026 CXPhoenix` (L2).
- **AC3.** `THIRD_PARTY_NOTICES.md` at HEAD is B's file with three replacements and one addition,
  and no other line changes (N4):
  - B lines 3–6 replaced by T1 (N1);
  - B line 76 replaced by T2 (N2);
  - B lines 85–88 replaced by T3 (N3);
  - T4, T5, T6 and T7 appended, in that order (N5).
- **AC4.** Ticket Comments hold three records:
  - the asset inventory at B, which is the 19 files of the definition;
  - the repository owner's classification, quoted;
  - the member names of each `.zip`, read without extraction.

  If B's inventory differs, the ticket stops and asks the owner about each new file before landing
  (N6, N7).
- **AC5.** Parsing `docs/agents/skill-sources.json` at B and at HEAD as JSON shows exactly the
  changes S1–S6 and no other (S7).
- **AC6.** Lines 12–13 of both trees' `agent-browser/SKILL.md` equal T9, and no other line of
  either file changes (A1).
- **AC7.** `AGENTS.md` differs from B only by T10 and T11, in the places G1 and G2 name (G3).
- **AC8.** `README.md` differs from B only by T8, appended as its last section (R1).
- **AC9.** `docs/adr/0007-license-split.md` exists and records each decision listed in D1.
  `docs/README.md` differs from B only by T12 (D2).
- **AC10.** At HEAD, all of these hold:
  - the scoped `git grep` of C1 returns nothing;
  - `git diff --name-only <B SHA>...HEAD` lists only the paths in X1;
  - the three commands of X2 exit 0.

## Out of Scope

- **The verifier.** Its license-reference check, and its descriptions in `docs/guide.md`,
  `README.md` and `docs/agents/runtime.md`, belong to epic 0005.
- **The font itself.** It is not investigated, replaced or removed (owner, 2026-10-21).
- **Deployed builds.** Built sites still ship the font and logos without notices; see OQ-3.
- **Other licensing schemes.** No per-file SPDX headers, REUSE compliance or `package.json`
  `license` field.
- **README language.** The README is English although `docs/agents/language.md` says README is
  Traditional Chinese. This epic follows the file as it is.
- **Notices line 96.** It refers to the slide-style-design repository's own root LICENSE and is
  correct as written.
- **Earlier copies.** Nothing is said about earlier commits or already-deployed copies.

## Further Notes

- **Expected consequences, accepted by the owner.**
  - Deck and theme code is CC BY-SA, so reusing it in software brings ShareAlike with it.
  - CC BY-SA allows commercial reuse, and adaptations may be relicensed under GPLv3.
  - The license grant cannot be revoked for copies already taken.
  - New top-level paths default to MIT unless the table changes.
  - GitHub may detect `LICENSE-CODE` too and show two licenses.
  - The notices are public once they land.
- **Rights.** The owner confirmed holding the economic rights in the decks, themes and documents
  ("屬於我", 0003 round-2 rulings), and confirmed the portrait photo and chat screenshot are
  lawfully used ("#3 都接受，都確認合法合規").
- **Evidence, 2026-10-21.**
  - CC FAQ on software.
  - CC BY-SA 4.0 "Considerations for licensors" and the CC wiki "Marking your work" (the phrase
    "Except where otherwise noted").
  - GitHub Docs, "Licensing a repository".
  - The MOE document 《國字標準字體字形檔》 for the font's license and attribution.
  - The GitHub contents API for the Source LICENSE blob.
  - The installed `@open-slide/core` 1.17.1 and 2.2.0 LICENSE files: both MIT,
    "Copyright (c) 2026 Yiwei Ho".
  - `K-Dense-AI/claude-scientific-skills` LICENSE.md: MIT, "Copyright (c) 2025 K-Dense Inc.".
  - Commit `05d62cd` for the scaffold origin of `README.md` and `AGENTS.md`.
