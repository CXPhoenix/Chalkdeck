# Traceability — 0004 license files and notices

Source of truth for scope. `spec.en.md` prose is derived from this file. Epic 0004 is the
documentation half of the split epic 0003.

Decisions and the repository owner's answers are quoted in `grill.md`, which covers:

- the 0004 grill, two rounds
- the round-1 review rulings
- carried-over decisions from `../0003-license-split/`

Glossary terms used here (`GLOSSARY.md`): Repository owner, Reuser, Deck, Theme, Deck content
work, Template work.

## Definitions

**Spec base (S0).** Commit `f1a29c7`. Every line number and target text below was drafted against
it. The target files and their blob ids at S0:

| File | Blob at S0 |
|---|---|
| `THIRD_PARTY_NOTICES.md` | `292db36420d273ebaf104471ddca38d4aceca608` |
| `README.md` | `92c20604e19f3f07df25253a7efa380e207bc50b` |
| `AGENTS.md` | `3b774b557a65238e374593362d6ad3e3707ebd02` |
| `docs/agents/skill-sources.json` | `5d16c6006848c3c59e324b710b0f6a4f524ae082` |
| `.agents/skills/agent-browser/SKILL.md` | `410922f854dcb686e701f47dd76f53b9cfce92ab` |
| `.claude/skills/agent-browser/SKILL.md` | `366b05ec9b0b7bfc74eeab86cb0659ed2aacf76f` |
| `docs/README.md` | `487ec8c7bb8d82e2eefbf71e29b1bfd7c964e86a` |
| `docs/agents/workflow.md` | `2ed80934921294627b2202a30a113a99b03e9c6f` |
| `GLOSSARY.md` | the blob it holds once this spec lands on `main`, recorded in the first ticket Comment; its `**Deck content work**` entry must read as at S0 |

At S0 the symlinks in `.claude/skills/` are exactly: apply-comments, create-slide, create-theme,
current-slide, new-deck, scientific-visualization, seaborn, slide-authoring.

**Base (B).** The commit on `main` that the ticket branch starts from. Its full SHA is the first
entry in the ticket's Comments.

- The ticket branch does not merge `main`. If it has to be updated, it is rebased onto `main`, and
  the new B is recorded in a later Comment with the reason.
- `<B SHA>` in a check means the most recently recorded B.
- Every diff below is `git diff <B SHA>...HEAD`.

**Drift.** B drifts from S0 when any of these holds:

- a target file's blob at B differs from its S0 blob;
- the set of `.claude/skills/` symlinks at B differs from S0's;
- the asset inventory at B differs from S0's, by path or by blob.

On drift, the ticket stops before any target file is edited:

- The agent reports the differences to the repository owner.
- The spec is revised at stage 2, because the target texts would no longer apply.
- The ticket status stays `processing` unless the owner sets `pending`.

**Source LICENSE.** The Creative Commons Attribution-ShareAlike 4.0 International legal code, plain
text, from `https://creativecommons.org/licenses/by-sa/4.0/legalcode.txt`. It was retrieved on
2026-10-22; the server's `Last-Modified` was 2023-09-11.

- git blob id `2d58298e6eda10e7204abb52722efbc840db2390`
- 20,138 bytes, LF line endings, no CR, ends with one empty line
- SHA-256 `28a9529c7d0bb4dc51f4bf5c116a3d16ef247a052f7591466768ddf563fd1cf5`

The owner chose it over the 0x1dea copy, which differs from it in whitespace, one underscore
("More_considerations") and one misplaced blank line in §4(b) ("CC 官方 legalcode.txt").

**MIT body.** Lines 5–21 of `.agents/skills/tdd/LICENSE` at B: the standard MIT text from
"Permission is hereby granted" to "SOFTWARE.".

**Asset inventory.** Every tracked file under `assets/` and `slides/*/assets/` at B, except
`assets/.gitkeep`. At S0 it holds 19 files.

| Class | Files at S0 |
|---|---|
| Third-party, holder named | `assets/fhsh-isiphs/fhsh/logo.png`, `assets/fhsh-isiphs/isip-hs/logo.png`, `assets/fhsh-isiphs/fonts/edukai-fixed.woff2`, `slides/ctf-competition-practice/assets/cyberrange-2026.png`, and the 7 SVG files under `slides/getting-started/assets/` |
| Third-party, holder unknown | `assets/fhsh-isiphs/fhsh/section-img.png`, `assets/fhsh-isiphs/isip-hs/section-img.png`, `assets/fhsh-isiphs/fhsh/slogon.svg`, `assets/fhsh-isiphs/isip-hs/slogon.svg`, `slides/ctf-competition-practice/assets/788abeb3-37ac-4f36-9018-dae67dffe210.png` |
| Mixed | `slides/ctf-competition-practice/assets/shot-1-dc-verify.jpeg` |
| Owner-owned | `slides/ctf-competition-practice/assets/bluechall-master.zip`, `slides/ctf-competition-practice/assets/webchall-master.zip` |

The owner classified each file in `grill.md` Q12. "Third-party, holder unknown" are the files the
owner gave no source for. The inventory command is
`git ls-files -- ':(glob)assets/**' ':(glob)slides/*/assets/**'`, with `assets/.gitkeep` removed.

**Archive check.** For each `.zip` in the inventory, read with `zipfile.ZipFile(path).namelist()`
and never extracted, ticket Comments record two things and no member names:

- the member count;
- whether any member's base name, case-insensitively, starts with `LICENSE`, `COPYING` or
  `NOTICE`.

If one does, the ticket stops and asks the owner how to classify the archive.

**ADR date.** The author date, in UTC+08:00 and written `YYYY-MM-DD`, of the commit that adds
`docs/adr/0007-license-split.md`:
`git log --diff-filter=A --format=%ad --date=format-local:%Y-%m-%d -- docs/adr/0007-license-split.md`,
run with `TZ=Asia/Taipei`.

**Exact comparison.** A target region matches its target text when a script finds them
byte-identical. It compares:

- the HEAD file region with the T-block, without the fence lines;
- the untouched regions with B.

Every edited file ends with exactly one `\n`, except `LICENSE`, which is the Source LICENSE as
fetched. Reading the diff by eye does not count.

**Stale init-template entries.** `skills.init-template` and `local_adaptations.init-template` in
the provenance file describe a skill that exists in neither tree. `claude_prompt_audit` also names
init-template; it is a dated record of a 2026-09-26 audit and is kept as written.

**Provenance file.** `docs/agents/skill-sources.json`. The top-level `licensing` object is called
`/licensing` below, in JSON Pointer form.

## Target texts

Each block is the exact text the file holds at HEAD.

**T1** replaces notices lines 3–6 of B. Line 2, a blank line, and line 7, a blank line, stay
around it.

```text
## Licensing

Except where otherwise noted in this file, the material in this repository is licensed by
CXPhoenix (https://github.com/CXPhoenix) as follows:

| Paths | License |
|---|---|
| `slides/`, `themes/`, `assets/`, `docs/` except `docs/agents/`, `README.md`, `GLOSSARY.md`, `.proj.specs/`, `.proj.tickets/` | [CC BY-SA 4.0](LICENSE) |
| Every other path, including `scripts/`, `.agents/`, `.claude/`, `.codex/`, `.github/`, `deploy/`, `AGENTS.md`, `CLAUDE.md`, `docs/agents/` and root configuration files | [MIT](LICENSE-CODE) |

Code inside a CC BY-SA path, such as a deck's `index.tsx`, is CC BY-SA. A path added later that the
table does not list is MIT. `LICENSE`, `LICENSE-CODE` and this file are license texts and notices,
not covered by the table; `LICENSE` is the Creative Commons legal code.

Material this file attributes to someone other than CXPhoenix, and any file or directory that
carries its own license naming another holder, keeps that holder's terms wherever it sits; changes
CXPhoenix made to such material follow the table above. Third-party works not listed in this file,
including logos, trademarks, photographs, screenshots, illustrations, quotations and code, are not
covered by either license. Neither license grants rights of publicity or privacy in people shown.
Preserve applicable notices when copying a skill.

`LICENSE` is the CC BY-SA 4.0 legal code from
https://creativecommons.org/licenses/by-sa/4.0/legalcode.txt (SHA-256
28a9529c7d0bb4dc51f4bf5c116a3d16ef247a052f7591466768ddf563fd1cf5).
```

**T2** replaces notices line 76 of B.

```text
preserved with the skill. Project-authored additions are covered by the MIT license in LICENSE-CODE.
```

**T3** replaces notices lines 85–88 of B.

```text
On 2026-09-13 CXPhoenix confirmed that tw-emoji-commit, tw-emoji-pr-note and tw-emoji-release-note
were authored by CXPhoenix using Claude Code; tune-skills is recorded the same way in
docs/agents/skill-sources.json. They are project-authored material under the MIT license in
LICENSE-CODE. This provenance record is based on that explicit confirmation.
```

**T4–T7** are appended after the last line of B's notices, in order, each preceded by one blank
line.

**T4**

```text
## Assets

Third-party and mixed files under `assets/` and `slides/*/assets/`. "unknown" means the holder or
terms were not established; such a file is still excluded from both licenses.

| File | Holder | Terms |
|---|---|---|
| `assets/fhsh-isiphs/fhsh/logo.png` | 臺北市立復興高級中學 | unknown |
| `assets/fhsh-isiphs/isip-hs/logo.png` | ISIP.hs | unknown |
| `assets/fhsh-isiphs/fhsh/section-img.png` | unknown | unknown |
| `assets/fhsh-isiphs/isip-hs/section-img.png` | unknown | unknown |
| `assets/fhsh-isiphs/fhsh/slogon.svg` | unknown | unknown |
| `assets/fhsh-isiphs/isip-hs/slogon.svg` | unknown | unknown |
| `assets/fhsh-isiphs/fonts/edukai-fixed.woff2` | 中華民國教育部 (教育部標準楷書) | CC BY-ND 3.0 TW, https://creativecommons.org/licenses/by-nd/3.0/tw/legalcode |
| `slides/ctf-competition-practice/assets/788abeb3-37ac-4f36-9018-dae67dffe210.png` | unknown | unknown |
| `slides/ctf-competition-practice/assets/cyberrange-2026.png` | HITCON (CyberRange 2026 key visual) | unknown |
| `slides/ctf-competition-practice/assets/shot-1-dc-verify.jpeg` | mixed: other participants' messages, names and avatars, and the LINE interface | unknown |
| `slides/getting-started/assets/claude.svg` | Anthropic | unknown |
| `slides/getting-started/assets/cloudflare.svg` | Cloudflare | unknown |
| `slides/getting-started/assets/gemini.svg` | Google | unknown |
| `slides/getting-started/assets/openai.svg` | OpenAI | unknown |
| `slides/getting-started/assets/opencode.svg` | opencode | unknown |
| `slides/getting-started/assets/vercel.svg` | Vercel | unknown |
| `slides/getting-started/assets/zeabur.svg` | Zeabur | unknown |

For the mixed file, only the named parts are third-party; the rest follows the table above.
```

**T5**

```text
## open-slide — MIT

Copyright (c) 2026 Yiwei Ho. From `@open-slide/core` as installed through `package.json`; MIT
license text below. Covered: the skills apply-comments, create-slide, create-theme, current-slide
and slide-authoring, which `pnpm sync:skills` writes into `.agents/skills/`; the deck
`slides/getting-started/` and `open-slide.config.ts`; and the text of `README.md` and of the
`## open-slide` section of `AGENTS.md` that comes from the open-slide project scaffold (commit
05d62cd). Changes made in this repository after that commit follow the licensing table above. The
vendor logos in `slides/getting-started/assets/` are third-party marks listed under Assets.
```

**T6**

```text
## K-Dense scientific skills — MIT

Copyright (c) 2025 K-Dense Inc. Source: https://github.com/K-Dense-AI/claude-scientific-skills ;
MIT license text below. Covered skills: seaborn and scientific-visualization. The `license` field
in seaborn's SKILL.md (BSD-3-Clause) is the license of the seaborn library the skill teaches; any
text the skill quotes from the seaborn documentation keeps that license.
```

**T7** is the line `## MIT license text`, one blank line, then the MIT body verbatim.

**T8** is appended to `README.md` after its last line, preceded by one blank line, as its last
section.

```text
## License

Except where otherwise noted, the decks, themes, assets and project documentation in this
repository are licensed by [CXPhoenix](https://github.com/CXPhoenix) under
[CC BY-SA 4.0](LICENSE), and the code, agent tooling and agent instructions under
[MIT](LICENSE-CODE). Third-party material, including the open-slide scaffold, keeps its own terms;
see [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md) for the exact boundary and attributions.
```

**T9** replaces lines 12–13 of both `.agents/skills/agent-browser/SKILL.md` and
`.claude/skills/agent-browser/SKILL.md`.

```text
Upstream source and Apache-2.0 license: see this skill's LICENSE and
docs/agents/skill-sources.json in the project root. License restoration: 2026-09-13.
```

**T10** is added to `AGENTS.md` directly after the bullet that starts
`- Do not add dependencies.` under `### Slide hard rules`.

```text
- When a deck adds, removes or renames someone else's material (an image, font, quotation or code), update its row in the Assets table of `THIRD_PARTY_NOTICES.md` in the same change, and name no person in it; ADR-0007 lets this one edit ride on the deck track.
```

**T11** is appended to `AGENTS.md` after its last line, preceded by one blank line.

```text
After `pnpm up` and `pnpm sync:skills`, check that `node_modules/@open-slide/core/LICENSE` still has the license and copyright line the open-slide entry in `THIRD_PARTY_NOTICES.md` names, and that the skills listed there are still the ones open-slide writes.
```

**T12** is added to `docs/README.md` as the line after the ADR-0006 bullet.

```text
- [ADR-0007](adr/0007-license-split.md)：內容採 CC BY-SA 4.0、程式採 MIT，依目錄劃分授權。
```

**T13** is the whole of `docs/adr/0007-license-split.md`, with `{ADR_DATE}` replaced by the ADR
date.

```text
---
status: accepted
date: {ADR_DATE}
---

# License content under CC BY-SA 4.0 and code under MIT, split by directory

The repository is public and needs a license. Content, meaning decks, themes, assets and most
documentation, is licensed under CC BY-SA 4.0 so teachers and students can reuse and adapt it with
attribution. Code and agent tooling stay under MIT, because Creative Commons recommends against its
licenses for software and the tooling follows MIT upstreams. `LICENSE` holds the CC BY-SA 4.0 legal
code, `LICENSE-CODE` the MIT license, and `THIRD_PARTY_NOTICES.md` the boundary and every
attribution.

The boundary follows directories, not file types. `slides/`, `themes/`, `assets/`, `docs/` except
`docs/agents/`, `README.md`, `GLOSSARY.md`, `.proj.specs/` and `.proj.tickets/` are CC BY-SA, code
inside them included; every other path, and any path added later, is MIT. `docs/agents/`,
`AGENTS.md` and `CLAUDE.md` are MIT because they are the harness instructions kept in step with the
MIT harness-agile template, next to the skills. The other agent-facing records (`docs/adr/`,
`.proj.specs/`, `.proj.tickets/`) are CC BY-SA by the repository owner's choice.

## Decisions recorded here (repository owner, 2026-10-21 and 2026-10-22)

- The repository owner holds the economic rights in the decks, themes and documents. The exception
  is `slides/getting-started/` and `open-slide.config.ts`, which come unchanged from the open-slide
  scaffold and stay MIT under Yiwei Ho's copyright, like the scaffold text in `README.md` and in
  the `## open-slide` section of `AGENTS.md`.
- The theme `fhsh-isiphs-universal`, its Slidev original and its copies in decks and in
  `scripts/new-deck.mjs` are the owner's work. The same boilerplate is therefore available under CC
  BY-SA in decks and themes and under MIT in the generator script; this is intended.
- Private decks are licensed like public ones; their files are already public in the repository.
- Material attributed to another holder, or carrying its own license naming another holder, keeps
  that holder's terms; the owner's changes to it follow the table. Only the repository owner decides
  who holds a piece of material, and a file the owner gave no source for is listed as third-party
  with holder unknown.
- The Ministry of Education Kai font is kept unchanged and only attributed; its "fixed" variant is
  not investigated.
- `LICENSE` is the Creative Commons legal code as published at creativecommons.org, not a copy from
  another repository.
- The README's license section is in English, matching the existing README, although
  `docs/agents/language.md` asks for Traditional Chinese READMEs.
- No per-file SPDX headers, no REUSE compliance and no `license` field in `package.json`.

## Amends ADR-0004

A deck change may add, update or remove the rows for its own assets in the Assets table of
`THIRD_PARTY_NOTICES.md` and stay on the deck content track. After the allowlist, it is the second
shared file the track may touch. Any other change to the notices is template work.

## Consequences

- Reusing deck or theme code brings ShareAlike with it. CC BY-SA also allows commercial reuse and
  one-way adaptation to GPLv3, and a grant cannot be revoked for copies already taken.
- A new top-level path is MIT until the table changes.
- GitHub may detect both license files and show two licenses.
- Deployed sites still ship third-party material without notices (OQ-3).
```

**T14** is added to `docs/agents/workflow.md` after the paragraph that starts `**The allowlist**`
in `## Deck content track`, with one blank line before and after it.

```text
**The notices** (`THIRD_PARTY_NOTICES.md`) are the other shared file this track may edit: a deck change adds, updates or removes the rows for its own assets in the Assets table, naming no person ([ADR-0007](../adr/0007-license-split.md)). Any other change to the notices is template work.
```

**T15** replaces the one-line definition under `**Deck content work** (deck 內容工作):` in
`GLOSSARY.md` (the line starting `A change confined to one deck's`).

```text
A change confined to one deck's `slides/<deck id>/` folder, including its own assets. Two shared
edits ride along: the deck's line in the allowlist, and the deck's own rows in the Assets table of
`THIRD_PARTY_NOTICES.md` (ADR-0004, ADR-0007).
```

## Matrix

| ID | Type × field × boundary | Expected behaviour | AC |
|---|---|---|---|
| L1 | `LICENSE` × content and mode | `git rev-parse HEAD:LICENSE` is `2d58298e6eda10e7204abb52722efbc840db2390`; `git ls-tree HEAD LICENSE` shows mode `100644` | AC1 |
| L2 | `LICENSE-CODE` × content and mode | `diff .agents/skills/tdd/LICENSE LICENSE-CODE` reports only `3c3`, with line 3 of `LICENSE-CODE` reading `Copyright (c) 2026 CXPhoenix`; mode `100644` | AC2 |
| N1 | notices × B lines 3–6 | replaced by T1 | AC3 |
| N2 | notices × B line 76 | replaced by T2 | AC3 |
| N3 | notices × B lines 85–88 | replaced by T3 | AC3 |
| N4 | notices × every other B line | unchanged | AC3 |
| N5 | notices × appended content | T4, T5, T6, T7 in that order | AC3 |
| N6 | asset inventory × B | Comments record the inventory command, its output and the drift result; the output equals S0's 19 files by path and blob | AC4 |
| N7 | asset × `.zip` archives | Comments record the archive check for both archives; no member name appears in Comments or notices | AC4 |
| N8 | target files and symlinks × B | Comments record each target file's blob at B and the `.claude/skills/` symlink set, and that they equal S0; on drift the ticket stops as defined | AC10 |
| S1 | `/skills/{tune-skills,tw-emoji-commit,tw-emoji-pr-note,tw-emoji-release-note}/licensing/license_location` | `"LICENSE"` becomes `"LICENSE-CODE"` | AC5 |
| S2 | the `evidence` beside each of those four | the substring `root MIT license` becomes `MIT license in LICENSE-CODE`; nothing else in the string changes | AC5 |
| S3 | `/licensing/project_license` | `"CC-BY-SA-4.0 AND MIT"` | AC5 |
| S4 | `/licensing/verified_on` | equals the ADR date | AC5 |
| S5 | `/skills/init-template`, `/local_adaptations/init-template` | both removed | AC5 |
| S6 | `/local_adaptations/agent-browser` | gains the suffix ` Both runtimes: the SKILL.md license pointer names this skill's LICENSE instead of the project root (epic 0004).` | AC5 |
| S7 | provenance × everything else | JSON comparison of B and HEAD shows nothing beyond S1–S6; the text diff touches only the lines holding those values and the removed entries, with indentation and key order unchanged | AC5 |
| A1 | agent-browser `SKILL.md` × lines 12–13 × both trees | replaced by T9; no other line changes | AC6 |
| G1 | `AGENTS.md` × slide hard rules | T10 added at its place | AC7 |
| G2 | `AGENTS.md` × end of file | T11 appended | AC7 |
| G3 | `AGENTS.md` × everything else | unchanged | AC7 |
| R1 | `README.md` | T8 appended as the last section; nothing else changes | AC8 |
| D1 | `docs/adr/0007-license-split.md` | equals T13 with the ADR date | AC9 |
| D2 | `docs/README.md` | T12 added; nothing else changes | AC9 |
| W1 | `docs/agents/workflow.md` | T14 added; nothing else changes | AC9 |
| W2 | `GLOSSARY.md` × Deck content work | its definition replaced by T15; nothing else changes | AC9 |
| C1 | repository × root-MIT claims | `git grep -n -i "root MIT" -- THIRD_PARTY_NOTICES.md README.md AGENTS.md docs/agents/skill-sources.json .agents/skills/agent-browser .claude/skills/agent-browser` returns nothing at HEAD | AC11 |
| X1 | repository × diff scope | `git diff --name-only <B SHA>...HEAD` lists only `LICENSE`, `LICENSE-CODE`, `THIRD_PARTY_NOTICES.md`, `README.md`, `AGENTS.md`, `docs/agents/skill-sources.json`, `.agents/skills/agent-browser/SKILL.md`, `.claude/skills/agent-browser/SKILL.md`, `docs/adr/0007-license-split.md`, `docs/README.md`, `docs/agents/workflow.md`, `GLOSSARY.md`, `.proj.specs/0004-license-files/review/security-T-*.md` and files under `.proj.tickets/0004-license-files/` | AC11 |
| X2 | checks | run from the repository root: `python3 scripts/verify-project.py`, `python3 scripts/check_style_skills.py`, `python3 -m unittest discover -s scripts -p 'test_*.py'`; each exits 0 | AC11 |
| E1 | GitHub file view of the pushed ticket branch × `LICENSE`, `LICENSE-CODE`, `THIRD_PARTY_NOTICES.md`, `README.md` | before merging, `/agent-browser` opens each file's page on the branch: each renders without an error page, and each relative link in T1 and T8 opens a page that is not GitHub's 404 page. Screenshots or page text go in Comments. GitHub's license detection on the default branch is observed after the merge as a close-out note, not as this gate. | AC12 |
