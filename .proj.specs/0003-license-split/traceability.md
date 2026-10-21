# Traceability — 0003 license split

Source of truth for scope. `spec.en.md` prose is derived from this file. Author decisions are from
the stage-1 grill of 2026-10-21 (two rounds plus two boundary clarifications).

## Definitions

**Base (B).** The commit on `main` that the ticket branch starts from. It contains PR #7's merge
`f1a29c7` and this spec. "After" means the ticket branch tip (HEAD). Every diff below is
`git diff B...HEAD`.

**Source LICENSE.** The blob at path `LICENSE` in `CXPhoenix/0x1dea`, commit
`0e690064985d9d734849e1ec44a8c0f8d84fb2a3`. It is the Creative Commons Attribution-ShareAlike 4.0
International legal code.

**Licensor.** `CXPhoenix` (https://github.com/CXPhoenix), the repository owner.

**Boundary table.** It assigns the licensor's own rights in each path:

| License file | License | Paths |
|---|---|---|
| `LICENSE` | CC BY-SA 4.0 | `slides/`, `themes/`, `assets/`, `docs/` except `docs/agents/`, `README.md`, `GLOSSARY.md`, `.proj.specs/`, `.proj.tickets/` |
| `LICENSE-CODE` | MIT | every other tracked path, including `scripts/`, `.agents/`, `.claude/`, `.codex/`, `.github/`, `deploy/`, `AGENTS.md`, `CLAUDE.md`, `docs/agents/`, root configuration and lock files, and any path added later that the table does not list |

- `.tsx`, `.ts` and other code files inside a CC BY-SA path are CC BY-SA. The split is by
  directory, not by file type.
- **Precedence.** Third-party material keeps its own terms wherever it sits, whether it is listed
  in the notices or carries its own `LICENSE`. The table only covers rights the licensor holds.

**Asset inventory.** Every tracked file under `assets/` and `slides/*/assets/`, except
`assets/.gitkeep`, plus one origin row for the ported theme `themes/fhsh-isiphs-universal.*`.
At B that is 7 files under `assets/fhsh-isiphs/` and 12 under `slides/*/assets/`. The
implementation lists the inventory again at B.

**Notices.** `THIRD_PARTY_NOTICES.md`.

**Provenance file.** `docs/agents/skill-sources.json`.

**Root-MIT claims at B.**

- Notices lines 3, 76 and 87.
- Five `license_location: "LICENSE"` values in the provenance file (tune-skills, init-template,
  tw-emoji-commit, tw-emoji-pr-note, tw-emoji-release-note).
- The five `evidence` strings next to them, which say "Covered by the maintainer-selected root
  MIT license".

**License references** (what the verifier checks):

- (a) In the provenance file, every `license_location` string, at any depth, that contains no
  whitespace and no `<`. Other values are descriptions or placeholders and are skipped.
- (b) In the notices, every inline link `[text](target)` whose target has no URL scheme and does
  not start with `#`. A `#fragment` is stripped.

Both kinds resolve relative to the repository root, because the notices file sits at the root.

## Matrix

| ID | Type × field × boundary | Expected behaviour | AC |
|---|---|---|---|
| L1 | `LICENSE` × content × after | byte-identical to the Source LICENSE; its SHA-256 is recorded in the notices and in ticket Comments | AC1 |
| L2 | `LICENSE` × content × source unreachable | the ticket stops and reports; no LICENSE text is written from memory or from another copy | AC1 |
| L3 | `LICENSE-CODE` × content × after | the standard MIT text, identical to the body of `.agents/skills/tdd/LICENSE` except the copyright line, which reads `Copyright (c) 2026 CXPhoenix` | AC2 |
| N1 | notices × licensing section × after | a section at the top states the boundary table, with licensor, link, license name and file for each side, the precedence rule, and the scoping phrase "Except where otherwise noted" | AC3 |
| N2 | notices × root-MIT claims × after | lines 3, 76 and 87 at B now refer to `LICENSE-CODE`; no sentence says the root `LICENSE` is MIT | AC3 |
| N3 | notices × asset inventory × each file | the author classifies each file as licensor-owned or third-party in ticket Comments; every third-party file, and every file the author does not confirm as licensor-owned, is listed in the notices with its path, the owner if known, and the terms if known | AC4 |
| N4 | notices × catch-all × after | one sentence excludes logos, trademarks, screenshots and other third-party marks that are not listed | AC4 |
| N5 | notices × MOE font × after | `assets/fhsh-isiphs/fonts/edukai-fixed.woff2` is attributed to 「中華民國教育部」, CC BY-ND 3.0 TW, with the license URI | AC5 |
| N6 | notices × ported theme × origin | the origin row of `themes/fhsh-isiphs-universal.*` (a port of a Slidev theme) records who holds the original, as the author states; if it is not the licensor, the ported files are listed as third-party-derived | AC4 |
| F1 | font × "fixed" × finding | Comments record the font's origin and what "fixed" changed, with evidence, as one of: format conversion only; adaptation; unknown | AC6 |
| F2 | font × "fixed" × adaptation or unknown | the ticket stops before landing and the author rules on the font (keep, replace with the official font, or remove); the ruling is quoted in Comments | AC6 |
| S1 | provenance × `license_location` × the five root entries | `"LICENSE"` becomes `"LICENSE-CODE"`; no other `license_location` value changes | AC7 |
| S2 | provenance × `evidence` × the five root entries | "root MIT license" becomes a reference to the MIT license in `LICENSE-CODE`; no other provenance field changes | AC7 |
| V1 | verifier × reference (a) × existing regular file | no message | AC8 |
| V2 | verifier × reference (a) × missing, directory or symlink | one message naming the value and its JSON location | AC8 |
| V3 | verifier × reference (a) × absolute or contains a `..` segment | one message; the path is not opened | AC8 |
| V4 | verifier × reference (a) × whitespace or `<` in value | skipped, no message | AC8 |
| V5 | verifier × reference (b) × existing regular file | no message | AC8 |
| V6 | verifier × reference (b) × missing, directory or symlink | one message naming notices line and target | AC8 |
| V7 | verifier × reference (b) × URL scheme or `#anchor` | skipped; `#fragment` stripped before resolving | AC8 |
| V8 | verifier × reference (b) × absolute or contains a `..` segment | one message; the path is not opened | AC8 |
| V9 | verifier × provenance or notices × missing or unreadable | one message for that file; other checks still run; no traceback | AC8 |
| V10 | verifier × real tree × after | `verify-project.py` exits 0; its PASS line mentions license references | AC8, AC10 |
| R1 | `README.md` × 授權 section × after | a short Taiwan Traditional Chinese section states the split, the licensor, that third-party material is excluded, and links `LICENSE`, `LICENSE-CODE` and the notices | AC9 |
| X1 | repository × diff scope | `git diff B...HEAD --stat` touches only `LICENSE`, `LICENSE-CODE`, the notices, `README.md`, the provenance file, `scripts/verify-project.py`, `scripts/test_verify_project.py`, `AGENTS.md` (only if its verifier description changes), and this epic's ticket files; nothing under `slides/`, `themes/` or `assets/` changes (Charter 3) | AC10 |
| X2 | checks × after | `verify-project.py`, `check_style_skills.py` and `python3 -m unittest discover -s scripts -p 'test_*.py'` exit 0 | AC10 |
