---
epic: 0004-license-files
status: draft
revision: 3
split_from: 0003-license-split
---

# Spec 0004 — License files and notices: content under CC BY-SA 4.0, code under MIT

`traceability.md` holds what this spec does not repeat:

- **Definitions:** S0, B, drift, Source LICENSE, MIT body, asset inventory and classes, archive
  check, ADR date, exact comparison, stale init-template entries.
- **Target texts T1–T18:** the exact text each file holds at HEAD.

`grill.md` quotes every answer the repository owner gave. Epic 0004 is the documentation half of
epic 0003, which was split after its second review round. The verifier's license-reference check is
epic 0005, which depends on this one.

Revision 2 applied the owner's round-1 rulings of 2026-10-21 and 2026-10-22 (`review/round-1.md`,
`grill.md`).

Revision 3 is a post-review patch. Round 2 found no P0. Several P1 fixes needed changes to target
texts that the ACs compare verbatim, so the owner chose to patch the spec before tickets ("審查後修補再開票").

- Only the dispositions listed in `review/round-2.md` were applied.
- They were self-checked, and no third review round was run.

## Problem Statement

The repository is public but has no root `LICENSE`. Its notices and provenance records say the
project is covered by "the root MIT LICENSE", which matches no file.

The repository owner wants:

- the teaching content (decks, themes, documentation) shared under CC BY-SA 4.0;
- code and agent tooling kept under MIT, because CC recommends against its licenses for software.

Material the owner does not hold is mixed in and unmarked:

- school and program logos, the Ministry of Education Kai font, vendor logos, a speaker photo and
  a chat screenshot;
- seven skills from open-slide and K-Dense that carry no license file;
- the open-slide getting-started deck, configuration and scaffold text in the README and agent
  guide.

## Solution

- **Licenses.** The root gets the official CC BY-SA 4.0 legal code as `LICENSE` and the MIT
  license in the owner's name as `LICENSE-CODE`.
- **Notices.** The notices open with a licensing section:
  - which paths each license covers;
  - that third-party material keeps its own terms, while the owner's changes to it follow the
    table;
  - a catch-all exclusion for unlisted third-party works.

  They gain entries for the classified assets, the open-slide and K-Dense material with their
  copyright lines, and one copy of the MIT text.
- **Pointers.** The provenance records and the agent-browser skill stop pointing at a root MIT
  license, and the stale init-template entries go.
- **README.** It gets a short License section.
- **Agent rules.** Two lines keep the notices current: one for decks that add or remove someone
  else's material, one for open-slide upgrades.
- **ADR-0007.** It records the decisions. It also amends ADR-0004, so that a deck change may edit
  its own rows of the notices on the deck track.

## User Stories

1. As the repository owner, I want the content under CC BY-SA 4.0, so that students and other
   teachers can reuse and adapt my decks with attribution.
2. As the repository owner, I want code and agent tooling under MIT, so that they stay compatible
   with their MIT upstreams and with ordinary software reuse.
3. As the repository owner, I want one place that tells any reuser which license covers which
   path and what is excluded, so that my material is reused on the terms I chose.
4. As the repository owner, I want third-party logos, fonts, photos, skills and scaffold material
   attributed and excluded, so that the repository does not claim other people's work.
5. As an agent adding material to a deck or upgrading open-slide, I want a rule telling me to
   update the notices, so that they stay true after this epic.

## Implementation Decisions

- **Ticket.**
  - The work is expected to fit one ticket; stage 4 decides.
  - The branch starts from `main` after this spec lands.
  - First Comment: B's full SHA and the drift check. Every later B gets the check again.
  - On drift, the ticket stops. The repository owner rules on each difference: *proceed* with
    approved text, or *split* into a new epic. No commit touching a target file comes before the
    ruling. This replaces revising the spec after review.
  - The ticket is documentation only:
    - its test plan table lists the acceptance checks;
    - its coverage report table maps each AC to the recorded check output;
    - ADR-0006 does not apply.
- **License files.**
  - `LICENSE` is the Source LICENSE fetched from creativecommons.org, byte for byte. The owner
    chose it over the 0x1dea copy, which has formatting defects. It is LF-only, so
    `.gitattributes` needs no change.
  - `LICENSE-CODE` is the MIT text of `.agents/skills/tdd/LICENSE`, with the owner's copyright line
    on line 3.
  - Scope statements live in the notices and the README, not in the license files.
- **Boundary.** Drawn by directory, defaulting to MIT, as T1 states.
  - `docs/agents/`, `AGENTS.md` and `CLAUDE.md` are MIT because they are kept in step with the MIT
    harness-agile template. The other agent-facing records are CC BY-SA by the owner's choice.
  - Private decks are covered like the rest.
  - The license files and the notices are outside the table.
- **Precedence.**
  - Material the notices attribute to another holder, or that carries a license file naming
    another holder, keeps that holder's terms.
  - The owner's changes to such material follow the table. This keeps the owner's adaptations of
    third-party skills under MIT, matching notices line 76 (T2).
  - Only the repository owner's answer settles who holds a file. The rules above are that answer,
    recorded in ADR-0007.
- **Assets.**
  - The owner classified the 19 inventory files (`grill.md` Q12); T4 lists the third-party and
    mixed ones.
  - The chat screenshot's third-party parts are the other participants' messages, names, avatars
    and the LINE interface. Nobody shown in it is named.
  - A row names a holder only as that material's license requires.
  - The two challenge archives are the owner's. The archive check reads only their central
    directory and the `license` field of any `package.json`, and publishes no member path. Its S0
    result is in traceability.
- **open-slide.** These are attributed to Yiwei Ho under MIT, with no version number:
  - the five open-slide skills;
  - the scaffold deck `slides/getting-started/`, which is unchanged since the scaffold commit;
  - the scaffold text that `open-slide.config.ts`, `README.md` and `AGENTS.md`'s `## open-slide`
    section started from. Later changes follow the table: `open-slide.config.ts` was changed by
    7e95064 and ced6d13.

  The getting-started deck's vendor logos are listed as third-party marks. After each upgrade, an
  agent checks that the package license, the copyright line and the skill list still match (T11).
- **K-Dense.** seaborn and scientific-visualization are attributed to K-Dense Inc. under MIT. Any
  text quoted from seaborn's documentation keeps the library's BSD-3-Clause license.
- **MOE font.** It is attributed and not changed or investigated (owner ruling in 0003).
- **Provenance file.** Exactly the changes S1–S6:
  - `project_license` becomes the SPDX expression `CC-BY-SA-4.0 AND MIT`;
  - `verified_on` equals the date written in ADR-0007's front matter;
  - the `claude_prompt_audit` record stays as written.
- **agent-browser.** Both trees' `SKILL.md` name the skill's own Apache-2.0 `LICENSE`. They keep
  "in the project root" for the provenance file's path.
- **Deck track.**
  - ADR-0007 amends ADR-0004. A deck change may add, update or remove the Assets-table rows for
    third-party files under its own `slides/<deck-id>/assets/`. Inline quotations and code stay
    under the catch-all, and a third-party file in the global `assets/` is template work.
  - The rule is stated in ADR-0007 (T13), `docs/agents/workflow.md` (T14), the `AGENTS.md` slide
    hard rules (T10) and the glossary (T15).
  - The absolute sentences it qualifies are amended too: workflow.md's "Classify before starting"
    (T16), the Charter's "Two tracks" paragraph in `AGENTS.md` (T17), and an "Amended by" line in
    ADR-0004 (T18).
  - All of these land together on the ticket branch, so the exception is never stated before
    ADR-0007 exists.
- **Documentation.** `docs/README.md` indexes ADR-0007. The verifier and its descriptions belong to
  epic 0005.
- **Unchanged.**
  - Nothing under `slides/`, `themes/` or `assets/` changes. This epic changes no deck (Charter 3)
    and touches no delivered deck's files (Charter 5).
  - No dependency is added (Charter 4).
  - `package.json` is not touched.
- **Language.** `spec.zh-TW.md` is produced after review passes and lands with this spec, not on
  the ticket branch.

## Testing Decisions

- **No new tests.** No code changes, so no test is added. The existing unit tests and both checkers
  must still pass (X2).
- **Recorded checks.** Each check below is run, and its output is recorded in ticket Comments:
  - the drift check (AC10)
  - `git rev-parse` and `git ls-tree` (AC1, AC2)
  - `diff` against the tdd LICENSE (AC2)
  - the exact-comparison script for AC3 and AC6–AC9
  - the provenance comparison script (AC5)
  - the inventory and archive checks (AC4)
  - the scoped `git grep`, `git diff --name-only` and the three check commands (AC11)
- **End to end.** The surface is the GitHub file view of the pushed ticket branch. It is driven
  before the merge by `/agent-browser`, or by a native browser tool that the workflow accepts as
  giving equivalent evidence (E1, AC12). Page text, not screenshots, is recorded. GitHub's license
  detection on the default branch is noted after the merge, in the epic close-out retrospective.

## Acceptance Criteria

- **AC1.** `LICENSE` is the Source LICENSE with mode `100644` (L1).
- **AC2.** `LICENSE-CODE` differs from `.agents/skills/tdd/LICENSE` only on line 3, which reads
  `Copyright (c) 2026 CXPhoenix`. Its mode is `100644` (L2).
- **AC3.** By exact comparison, `THIRD_PARTY_NOTICES.md` is B's file with these changes and no
  other (N4):
  - B lines 3–6 replaced by T1 (N1);
  - B line 76 replaced by T2 (N2);
  - B lines 85–88 replaced by T3 (N3);
  - T4–T7 appended (N5).
- **AC4.** For every recorded B, Comments record the inventory and archive checks (N6, N7):
  - the inventory at B equals the S0 table of 19 paths and blobs;
  - the archive check equals S0's result;
  - no archive member path appears in any X1 file, commit message or the PR description.
- **AC5.** The provenance file at HEAD equals, byte for byte, the expected file the provenance
  comparison builds from B by applying S1–S6, and parses as JSON (S7).
- **AC6.** By exact comparison, both trees' `agent-browser/SKILL.md` differ from B only by T9 on
  lines 12–13 (A1).
- **AC7.** By exact comparison, `AGENTS.md` differs from B only by T10, T11 and T17, at the places
  G1, G2 and G4 name (G3).
- **AC8.** By exact comparison, `README.md` differs from B only by T8, appended as its last section
  (R1).
- **AC9.** By exact comparison, all five hold:
  - `docs/adr/0007-license-split.md` equals T13 with the ADR date (D1);
  - `docs/README.md` differs from B only by T12 (D2);
  - `docs/adr/0004-two-track-delivery.md` differs from B only by T18 (D3);
  - `docs/agents/workflow.md` differs from B only by T16 and T14 (W1);
  - `GLOSSARY.md` differs from B only by T15 (W2).
- **AC10.** Each Comment that records a B gives everything N8 lists and states whether it equals
  S0. On drift, `git log --reverse <B SHA>..HEAD` shows the commit adding the owner's ruling Comment
  before every commit that touches a target file (N8).
- **AC11.** At HEAD, all three hold:
  - the scoped `git grep` of C1 returns nothing;
  - `git diff --name-only <B SHA>...HEAD` lists only the paths in X1;
  - the three commands of X2, run from the repository root, exit 0.
- **AC12.** Before the merge, a browser check of the pushed branch, as E1 defines it, shows:
  - each of the four files rendering, with the T1 and T4 tables shown as tables;
  - each relative link in T1 and T8 opening a page that is not GitHub's 404 page.

  The page text is recorded in Comments (E1).

## Out of Scope

- **The verifier.** Its license-reference check, and its descriptions in `docs/guide.md`,
  `README.md` and `docs/agents/runtime.md`, belong to epic 0005.
- **The font itself.** No investigation, replacement or removal (owner, 2026-10-21).
- **Deployed builds.** Built sites ship the font, logos and bundled MIT packages without notices;
  see OQ-3.
- **Other schemes.** No per-file SPDX headers, no REUSE compliance, and no `package.json`
  `license` field.
- **README language.** The README is English although `docs/agents/language.md` says Traditional
  Chinese. ADR-0007 records this; `language.md` is not changed here.
- **Provenance entries for the seven third-party skills.** The notices carry their attribution;
  adding entries to `skill-sources.json` is not part of this epic.
- **Upstream-root wording.** Notices line 96 and `skill-sources.json`'s slide-style-design
  `license_location` refer to that repository's own root LICENSE and are correct as written.
- **Earlier copies.** Nothing is said about earlier commits or already-deployed copies.

## Further Notes

- **Expected consequences, accepted by the owner.** ADR-0007 records them:
  - Deck and theme code is CC BY-SA, so reusing it in software brings ShareAlike with it.
  - CC BY-SA allows commercial reuse and adaptation to GPLv3.
  - A grant cannot be revoked for copies already taken.
  - New top-level paths default to MIT.
  - GitHub may show two licenses.
  - The notices, including the "unknown" holders, are public once pushed.
- **Owner's confirmations.**
  - The owner holds the economic rights in the decks, themes and documents, except the open-slide
    scaffold ("屬於我"; "列為 open-slide 作品").
  - The portrait photo and chat screenshot are lawfully used ("#3 都接受，都確認合法合規").
- **Evidence, 2026-10-21 and 2026-10-22.**
  - The CC FAQ on software; the CC BY-SA 4.0 "Considerations for licensors"; the CC wiki page
    "Marking your work".
  - GitHub Docs, "Licensing a repository"; the GitHub API, which reports 0x1dea's copy as
    `CC-BY-SA-4.0`.
  - The MOE document 《國字標準字體字形檔》.
  - creativecommons.org's `legalcode.txt` (Last-Modified 2023-09-11) and its comparison with the
    0x1dea copy.
  - The installed `@open-slide/core` 1.17.1 and 2.2.0 licenses (MIT, Yiwei Ho).
  - `K-Dense-AI/claude-scientific-skills` LICENSE.md (MIT, K-Dense Inc.).
  - `git log` for commit 05d62cd, which added `README.md`, `AGENTS.md`, `slides/getting-started/`
    and `open-slide.config.ts`.
