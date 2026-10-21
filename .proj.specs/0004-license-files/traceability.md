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
| `docs/adr/0004-two-track-delivery.md` | `77483f64291f8dc7ffda88d530bfc3a67ddb9d70` |
| `package.json` | `224f7bfd142b146544c13771247a2e167dc4eaf3` |
| `pnpm-lock.yaml` | `82841f794e501e888af0e0e8634ca73a103d38b8` |
| `GLOSSARY.md` | see below |

`GLOSSARY.md` changes on the spec branch, so its reference is the blob at the commit that merges
this spec into `main` (the *spec merge*); the first ticket Comment records that commit's SHA. Its
`**Deck content work**` entry (the heading line, the definition line and the `_Avoid_` line) must
read exactly as at S0.

At S0 the installed `node_modules/@open-slide/core` is 2.2.0, and line 3 of its `LICENSE` reads
`Copyright (c) 2026 Yiwei Ho`.

At S0 the symlinks in `.claude/skills/` are exactly: apply-comments, create-slide, create-theme,
current-slide, new-deck, scientific-visualization, seaborn, slide-authoring.

**Base (B).** The commit on `main` that the ticket branch starts from. Its full SHA is the first
entry in the ticket's Comments.

- The ticket branch does not merge `main`. If it has to be updated, it is rebased onto `main`, and
  the new B is recorded in a later Comment with the reason.
- `<B SHA>` in a check means the most recently recorded B.
- Each time a B is recorded, the drift check runs again and its result goes into the same Comment.
- Every diff below is `git diff <B SHA>...HEAD`.

**Drift.** B drifts from S0 when any of these holds:

- a target file's blob at B differs from its S0 blob;
- the set of `.claude/skills/` symlinks at B differs from S0's;
- the asset inventory at B differs from S0's, by path or by blob;
- line 3 of the installed `node_modules/@open-slide/core/LICENSE` differs from S0's;
- the archive check at B differs from S0's result.

On drift, the ticket stops before any commit on the ticket branch touches a target file:

- The agent reports each difference to the repository owner.
- The owner rules on each difference:
  - *proceed*: the affected T-block or T4 row is amended to text the owner approves. That text is
    quoted in a Comment and replaces the T-block for every AC.
  - *split*: the affected work moves to a new epic.
- No commit touching a target file may precede the commit that adds the ruling Comment;
  `git log --reverse <B SHA>..HEAD` shows the order.
- The ticket status stays `processing` unless the owner sets `pending`.
- This rule replaces revising the spec after review (round-2 ruling).

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
owner gave no source for.

**Inventory command.** `git ls-tree -r <commit> -- assets slides`, keeping only paths under
`assets/` or `slides/<one segment>/assets/`, and dropping `assets/.gitkeep`. Run at S0 it prints
these 19 paths and blobs:

| Path | Blob at S0 |
|---|---|
| `assets/fhsh-isiphs/fhsh/logo.png` | `fc7433a30abd783fb5961a03495d68037626aa1d` |
| `assets/fhsh-isiphs/fhsh/section-img.png` | `f3f262f2632ae32a0ec48128fbf7755e3bb50425` |
| `assets/fhsh-isiphs/fhsh/slogon.svg` | `45b6858feab850690fb63473ce514197b12b4354` |
| `assets/fhsh-isiphs/fonts/edukai-fixed.woff2` | `fddc197bd229919da195b4806cf5b0d9e0b3b0a9` |
| `assets/fhsh-isiphs/isip-hs/logo.png` | `e36225b4db25d73545c0af1b6a1acc0c7eeb22ca` |
| `assets/fhsh-isiphs/isip-hs/section-img.png` | `29d48e8bc36364e2649e946265133300c0770705` |
| `assets/fhsh-isiphs/isip-hs/slogon.svg` | `c29275969f9d76d4c94dd2f75692bc9a285acb4a` |
| `slides/ctf-competition-practice/assets/788abeb3-37ac-4f36-9018-dae67dffe210.png` | `be8f21a5a368803d49655fd1582c5c76cf7c8477` |
| `slides/ctf-competition-practice/assets/bluechall-master.zip` | `6b64f7bd52f0174aec8ec035df4edb00ba1ef4d2` |
| `slides/ctf-competition-practice/assets/cyberrange-2026.png` | `084fab25fd333db63bd13ed47ec62ac2cb4e7922` |
| `slides/ctf-competition-practice/assets/shot-1-dc-verify.jpeg` | `503769c9871d8bca7a86abe6be628b9013a838a8` |
| `slides/ctf-competition-practice/assets/webchall-master.zip` | `e0f5b88ed3834797b10e2fd84da8a7cfb1d5f5be` |
| `slides/getting-started/assets/claude.svg` | `d3007012b79a7a0217ea442cb1a7666fb7e5b47e` |
| `slides/getting-started/assets/cloudflare.svg` | `0d601bff1f0a1ed704785d61fbab560b3d590501` |
| `slides/getting-started/assets/gemini.svg` | `659155f29be36332cd8432687240c47e2ce5ac76` |
| `slides/getting-started/assets/openai.svg` | `b6d542d09904bba8d6d2d817d6b56dc74eaf9bb5` |
| `slides/getting-started/assets/opencode.svg` | `157edc4d7522f38d3d34aff1317d304cb7958752` |
| `slides/getting-started/assets/vercel.svg` | `75968916c4b9d1b6736ebcb36998fa2fa656f99f` |
| `slides/getting-started/assets/zeabur.svg` | `b0ad02e9cec67c2d2ed69897b6c40501a98f03c1` |

**Archive check.** For each `.zip` in the inventory, read with `zipfile.ZipFile(path).namelist()`
and never extracted, ticket Comments record two things and no member names:

- the member count;
- whether any member's base name, case-insensitively, starts with `LICENCE`, `LICENSE`,
  `UNLICENSE`, `COPYING`, `COPYRIGHT` or `NOTICE`;
- whether any member is itself a `.zip`;
- the `license` field of every member named `package.json`, read in memory with
  `ZipFile.read`.

S0's result:

| Archive | Members | License-like names | Nested `.zip` | `package.json` `license` |
|---|---|---|---|---|
| `bluechall-master.zip` | 200 | none | none | no `package.json` |
| `webchall-master.zip` | 236 | none | none | one `package.json`, no `license` field, `"private": true` |

**No member path is published.** No full member path from `namelist()` appears, as an exact
substring, in any of these:

- any file listed in X1 at HEAD;
- any commit message on the ticket branch;
- the PR description.

**ADR date.** The `YYYY-MM-DD` date written in the `date:` line of
`docs/adr/0007-license-split.md`, chosen when the file is written. It is a stated date, not one
derived from Git, so a squash or rebase cannot change it. `/licensing/verified_on` must equal it.

**Exact comparison.** A target region matches its target text when a script finds them
byte-identical. It compares:

- the HEAD file region with the T-block, without the fence lines;
- the untouched regions with B.

Every edited file ends with exactly one `\n`, except `LICENSE`, which is the Source LICENSE as
fetched. Reading the diff by eye does not count.

**Provenance comparison.** A script builds the expected provenance file from B's text and compares
it byte for byte with HEAD. The result must also parse as JSON. The script:

- replaces each S1–S4 and S6 value in place, inside its existing quotes, keeping the line and its
  indentation;
- for each S5 removal, deletes the lines from the member's key line through its closing `}` line,
  including that line's trailing comma.

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
`slides/getting-started/`; and the text of `open-slide.config.ts`, of `README.md` and of the
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
- When a deck adds, removes or renames a file under its own `slides/<id>/assets/` that is someone else's work, update that file's row in the Assets table of `THIRD_PARTY_NOTICES.md` in the same change. Name the holder as the file's license requires, and no one else, such as people shown in it. ADR-0007 lets this one edit ride on the deck track; any other change to the notices, or a third-party file in the global `assets/`, is template work.
```

**T11** is appended to `AGENTS.md` after its last line, preceded by one blank line.

```text
After `pnpm up`, `pnpm sync:skills`, or a sync accepted when `pnpm dev` starts, check that `node_modules/@open-slide/core/LICENSE` still has the license and copyright line the open-slide entry in `THIRD_PARTY_NOTICES.md` names, and that the skills listed there are still the ones open-slide writes.
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
  is `slides/getting-started/`, which comes unchanged from the open-slide scaffold, and the scaffold
  text that `open-slide.config.ts`, `README.md` and the `## open-slide` section of `AGENTS.md`
  started from; these stay MIT under Yiwei Ho's copyright, and later changes follow the table.
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

A deck change may add, update or remove the Assets-table rows of `THIRD_PARTY_NOTICES.md` for
third-party files under its own `slides/<deck-id>/assets/`, naming each holder as the file's license
requires and no one else, and stay on the deck content track. After the allowlist, it is the second
shared file the track may touch. Any other change to the notices, and any third-party file in the
global `assets/`, is template work.

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
**The notices** (`THIRD_PARTY_NOTICES.md`) are the other shared file this track may edit: a deck change adds, updates or removes the Assets-table rows for third-party files under its own `slides/<deck-id>/assets/`, naming each holder as the file's license requires and no one else ([ADR-0007](../adr/0007-license-split.md)). Any other change to the notices is template work.
```

**T15** replaces the one-line definition under `**Deck content work** (deck 內容工作):` in
`GLOSSARY.md` (the line starting `A change confined to one deck's`).

```text
A change confined to one deck's `slides/<deck id>/` folder, including its own assets. Two shared
edits ride along: the deck's line in the allowlist, and the deck's own rows in the Assets table of
`THIRD_PARTY_NOTICES.md` (ADR-0004, ADR-0007).
```

**T16** replaces lines 36–37 of `docs/agents/workflow.md` at B (the two lines starting
`**Classify before starting.**`).

```text
**Classify before starting.** If a change touches anything outside `slides/<deck-id>/`, other than
the two shared edits below (the allowlist and the deck's rows in the notices), it is template work,
even when it began as a deck edit; split the shared part into its own epic or ticket.
```

**T17** replaces lines 50–52 of `AGENTS.md` at B (the paragraph starting `**Two tracks.**`).

```text
**Two tracks.** Deck content work (only `slides/<deck id>/`, plus the two shared edits the workflow
doc names) takes the light track; template work takes the full pipeline below. See
[docs/agents/workflow.md](docs/agents/workflow.md#deck-content-track) and
[ADR-0004](docs/adr/0004-two-track-delivery.md).
```

**T18** is inserted in `docs/adr/0004-two-track-delivery.md` after line 7 at B, the blank line
after the H1, and is followed by one blank line.

```text
_Amended by [ADR-0007](0007-license-split.md): a deck change may also edit the notices' Assets-table rows for third-party files under its own `assets/` folder._
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
| N6 | asset inventory × each recorded B | Comments record the inventory command, its output and the drift result; the output equals the S0 table of 19 paths and blobs | AC4 |
| N7 | asset × `.zip` archives | Comments record the archive check for both archives and that it equals S0's result; no member path is published, as defined | AC4 |
| N8 | target files, symlinks, open-slide license × each recorded B | the Comment recording each B gives every target file's blob, the `.claude/skills/` symlink set, the spec merge SHA with the glossary entry check, and line 3 of the installed open-slide `LICENSE`, and states whether they equal S0; on drift, the ruling Comment's commit precedes every commit touching a target file | AC10 |
| S1 | `/skills/{tune-skills,tw-emoji-commit,tw-emoji-pr-note,tw-emoji-release-note}/licensing/license_location` | `"LICENSE"` becomes `"LICENSE-CODE"` | AC5 |
| S2 | the `evidence` beside each of those four | the substring `root MIT license` becomes `MIT license in LICENSE-CODE`; nothing else in the string changes | AC5 |
| S3 | `/licensing/project_license` | `"CC-BY-SA-4.0 AND MIT"` | AC5 |
| S4 | `/licensing/verified_on` | equals the ADR date | AC5 |
| S5 | `/skills/init-template`, `/local_adaptations/init-template` | both removed | AC5 |
| S6 | `/local_adaptations/agent-browser` | gains the suffix ` Both runtimes: the SKILL.md license pointer names this skill's LICENSE instead of the project root (epic 0004).` | AC5 |
| S7 | provenance × everything else | HEAD equals the expected file of the provenance comparison byte for byte and parses as JSON | AC5 |
| A1 | agent-browser `SKILL.md` × lines 12–13 × both trees | replaced by T9; no other line changes | AC6 |
| G1 | `AGENTS.md` × slide hard rules | T10 added at its place | AC7 |
| G4 | `AGENTS.md` × lines 50–52 | replaced by T17 | AC7 |
| G2 | `AGENTS.md` × end of file | T11 appended | AC7 |
| G3 | `AGENTS.md` × everything else | unchanged | AC7 |
| R1 | `README.md` | T8 appended as the last section; nothing else changes | AC8 |
| D1 | `docs/adr/0007-license-split.md` | equals T13 with the ADR date | AC9 |
| D2 | `docs/README.md` | T12 added; nothing else changes | AC9 |
| W1 | `docs/agents/workflow.md` | lines 36–37 replaced by T16 and T14 added; nothing else changes | AC9 |
| D3 | `docs/adr/0004-two-track-delivery.md` | T18 inserted; nothing else changes | AC9 |
| W2 | `GLOSSARY.md` × Deck content work | its definition replaced by T15; nothing else changes | AC9 |
| C1 | repository × root-MIT claims | `git grep -n -i "root MIT" -- THIRD_PARTY_NOTICES.md README.md AGENTS.md docs/agents/skill-sources.json .agents/skills/agent-browser .claude/skills/agent-browser` returns nothing at HEAD | AC11 |
| X1 | repository × diff scope | `git diff --name-only <B SHA>...HEAD` lists only `LICENSE`, `LICENSE-CODE`, `THIRD_PARTY_NOTICES.md`, `README.md`, `AGENTS.md`, `docs/agents/skill-sources.json`, `.agents/skills/agent-browser/SKILL.md`, `.claude/skills/agent-browser/SKILL.md`, `docs/adr/0007-license-split.md`, `docs/adr/0004-two-track-delivery.md`, `docs/README.md`, `docs/agents/workflow.md`, `GLOSSARY.md`, `.proj.specs/0004-license-files/review/security-T-*.md` and files under `.proj.tickets/0004-license-files/` | AC11 |
| X2 | checks | run from the repository root: `python3 scripts/verify-project.py`, `python3 scripts/check_style_skills.py`, `python3 -m unittest discover -s scripts -p 'test_*.py'`; each exits 0 | AC11 |
| E1 | GitHub file view of the pushed ticket branch × `LICENSE`, `LICENSE-CODE`, `THIRD_PARTY_NOTICES.md`, `README.md` | before merging, `/agent-browser`, or a native browser tool `docs/agents/workflow.md` accepts as giving equivalent evidence, opens each file's page on the branch: each shows the file's rendered content, not an error page, with the T1 and T4 tables rendered as tables; each relative link in T1 and T8 opens a page that is not GitHub's 404 page. Page text, not screenshots, goes in Comments. GitHub's license detection on the default branch is noted after the merge in the epic close-out retrospective, not as this gate. | AC12 |
