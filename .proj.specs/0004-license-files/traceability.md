# Traceability — 0004 license files and notices

Source of truth for scope. `spec.en.md` prose is derived from this file. Epic 0004 is the
documentation half of the split epic 0003. Decisions come from three sources, all dated
2026-10-21:

- 0003's grill
- 0003's review rulings (`../0003-license-split/review/round-1.md`, `round-2.md`)
- 0004's grill, two rounds

Glossary terms used here, all in `GLOSSARY.md`: **Repository owner**, **Reuser**, **Deck**,
**Theme**.

## Definitions

**Base (B).** The commit on `main` that the ticket branch starts from. Its full SHA is the first
entry in the ticket's Comments.
- The ticket branch does not merge `main`. If it has to be updated, it is rebased onto `main`, and
  the new B is recorded in a later Comment with the reason.
- Every diff below is `git diff <B SHA>...HEAD`.

**Source LICENSE.** Path `LICENSE` in `CXPhoenix/0x1dea` at commit
`0e690064985d9d734849e1ec44a8c0f8d84fb2a3`:
- git blob id `2e72ca1121b413a67745f02f679eb5caef6c7bef`
- 20,132 bytes, LF line endings, no CR
- SHA-256 `bae5ccc863235f984a52c07d011e48a86c0c12f923be2dedd8624c7abdc22c6c`

It is the Creative Commons Attribution-ShareAlike 4.0 International legal code. The blob id was
read with the GitHub contents API on 2026-10-21.

**MIT body.** Lines 5–21 of `.agents/skills/tdd/LICENSE` at B: the standard MIT text from
"Permission is hereby granted" to the end.

**Asset inventory.** Every tracked file under `assets/` and `slides/*/assets/` at B, except
`assets/.gitkeep`. At the spec's base `f1a29c7` this is 19 files, each classified by the repository
owner as follows:

- **Third-party, holder named.** The two school and program logos, the MOE font, the HITCON key
  visual and the seven getting-started vendor logos.
- **Third-party, holder unknown.** The two `section-img.png`, the two `slogon.svg` and the speaker
  photo. The owner was asked for their source and gave none, so by the agreed rule they are
  third-party.
- **Mixed.** The chat screenshot.
- **Licensor-owned.** The two challenge `.zip` archives.

The owner's answer was "照建議" (round 2, Q12). For the portrait photo and the chat screenshot,
the owner also confirmed "#3 都接受，都確認合法合規": use of both is lawful and compliant.

**Root-MIT claims at B.**
- `THIRD_PARTY_NOTICES.md` line 3, line 76, and lines 87–88. The init-template mention is on
  line 86.
- In `docs/agents/skill-sources.json`:
  - five `license_location: "LICENSE"` values: tune-skills, init-template, tw-emoji-commit,
    tw-emoji-pr-note, tw-emoji-release-note
  - the five `evidence` strings beside them
  - `licensing.project_license: "MIT"`

**Stale init-template entries.** Two entries in `skill-sources.json` describe a skill that exists
in neither tree at B: `skills.init-template` and `local_adaptations.init-template`.
`claude_prompt_audit` (line 23 at B) also names init-template. That line is a dated record of a
2026-09-26 audit, so it is kept as it is.

## Target texts

Each block below is the exact text the file holds at HEAD.

**T1** replaces notices lines 3–6 of B. Line 2, which is blank, stays. T1 is followed by one blank
line and then the existing `## Matt Pocock skills — MIT` heading.

```text
## Licensing

Except where otherwise noted in this file, the material in this repository is licensed by
CXPhoenix (https://github.com/CXPhoenix) as follows:

| Paths | License |
|---|---|
| `slides/`, `themes/`, `assets/`, `docs/` except `docs/agents/`, `README.md`, `GLOSSARY.md`, `.proj.specs/`, `.proj.tickets/` | [CC BY-SA 4.0](LICENSE) |
| Every other path, including `scripts/`, `.agents/`, `.claude/`, `.codex/`, `.github/`, `deploy/`, `AGENTS.md`, `CLAUDE.md`, `docs/agents/` and root configuration files | [MIT](LICENSE-CODE) |

Code inside a CC BY-SA path, such as a deck's `index.tsx`, is CC BY-SA. A path added later that the
table does not list is MIT.

Material this file attributes to someone other than CXPhoenix, and any file or directory that
carries its own license naming another holder, keeps that holder's terms wherever it sits; neither
license above covers it. Third-party works not listed in this file, including logos, trademarks,
photographs, screenshots, illustrations, quotations and code, are not covered by either license.
Neither license grants rights of publicity or privacy in people shown. Preserve applicable notices
when copying a skill or distributing a generated project.

`LICENSE` is the CC BY-SA 4.0 legal code copied from CXPhoenix/0x1dea at commit
0e690064985d9d734849e1ec44a8c0f8d84fb2a3 (SHA-256
bae5ccc863235f984a52c07d011e48a86c0c12f923be2dedd8624c7abdc22c6c).
```

**T2** replaces notices line 76 of B.

```text
preserved with the skill. Project-authored additions are covered by the MIT license in LICENSE-CODE.
```

**T3** replaces notices lines 85–88 of B.

```text
On 2026-09-13 the maintainer confirmed that tw-emoji-commit, tw-emoji-pr-note and
tw-emoji-release-note were authored by the maintainer using Claude Code; tune-skills is recorded
the same way in docs/agents/skill-sources.json. They are project-authored material under the MIT
license in LICENSE-CODE. This provenance record is based on the maintainer's explicit confirmation.
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
| `slides/ctf-competition-practice/assets/shot-1-dc-verify.jpeg` | mixed: the chat messages of other participants | unknown |
| `slides/getting-started/assets/claude.svg` | Anthropic | unknown |
| `slides/getting-started/assets/cloudflare.svg` | Cloudflare | unknown |
| `slides/getting-started/assets/gemini.svg` | Google | unknown |
| `slides/getting-started/assets/openai.svg` | OpenAI | unknown |
| `slides/getting-started/assets/opencode.svg` | opencode | unknown |
| `slides/getting-started/assets/vercel.svg` | Vercel | unknown |
| `slides/getting-started/assets/zeabur.svg` | Zeabur | unknown |

For the mixed file, only the named part is third-party; the rest follows the table above.
```

**T5**

```text
## open-slide — MIT

Copyright (c) 2026 Yiwei Ho. From `@open-slide/core`, at the version `package.json` names; MIT
license text below. Covered parts: the skills apply-comments, create-slide, create-theme,
current-slide and slide-authoring, which `pnpm sync:skills` writes into `.agents/skills/`; the text
of `README.md` and of the `## open-slide` section of `AGENTS.md` that comes from the open-slide
project scaffold (commit 05d62cd). Changes made in this repository after that commit follow the
licensing table above.
```

**T6**

```text
## K-Dense scientific skills — MIT

Copyright (c) 2025 K-Dense Inc. Source: https://github.com/K-Dense-AI/claude-scientific-skills ;
MIT license text below. Covered skills: seaborn and scientific-visualization. The `license` field
in seaborn's SKILL.md (BSD-3-Clause) describes the seaborn library the skill teaches, not the
skill text.
```

**T7** is the heading line `## MIT license text`, then one blank line, then the MIT body verbatim.

**T8** is appended to `README.md` after its last line, preceded by one blank line, and is the last
section.

```text
## License

Except where otherwise noted, the decks, themes, assets and documentation in this repository are
licensed by [CXPhoenix](https://github.com/CXPhoenix) under [CC BY-SA 4.0](LICENSE), and the code
and agent tooling under [MIT](LICENSE-CODE). Third-party material, including the open-slide
scaffold text in this README, keeps its own terms; see
[THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md) for the full boundary and attributions.
```

**T9** replaces lines 12–13 of both `.agents/skills/agent-browser/SKILL.md` and
`.claude/skills/agent-browser/SKILL.md`.

```text
Upstream source and Apache-2.0 license: see this skill's LICENSE and
docs/agents/skill-sources.json. License restoration: 2026-09-13.
```

**T10** is added to `AGENTS.md` as the last bullet of `### Slide hard rules`.

```text
- When you add someone else's material (an image, font, quotation or code), list it in `THIRD_PARTY_NOTICES.md` in the same change.
```

**T11** is added to `AGENTS.md` as a paragraph after the code block of
`### Updating open-slide skills`, preceded by one blank line.

```text
After `pnpm up`, check that the copyright line of `node_modules/@open-slide/core/LICENSE` still matches the open-slide entry in `THIRD_PARTY_NOTICES.md`.
```

**T12** is added to `docs/README.md` as the line after the ADR-0006 bullet.

```text
- [ADR-0007](adr/0007-license-split.md)：內容採 CC BY-SA 4.0、程式採 MIT，依目錄劃分授權。
```

## Matrix

| ID | Type × field × boundary | Expected behaviour | AC |
|---|---|---|---|
| L1 | `LICENSE` × content | `git rev-parse HEAD:LICENSE` is `2e72ca1121b413a67745f02f679eb5caef6c7bef` | AC1 |
| L2 | `LICENSE-CODE` × content | `diff .agents/skills/tdd/LICENSE LICENSE-CODE` shows one changed line: line 3 becomes `Copyright (c) 2026 CXPhoenix` | AC2 |
| N1 | notices × B lines 3–6 | replaced by T1 | AC3 |
| N2 | notices × B line 76 | replaced by T2 | AC3 |
| N3 | notices × B lines 85–88 | replaced by T3 | AC3 |
| N4 | notices × every other B line | unchanged | AC3 |
| N5 | notices × appended content | T4, T5, T6 and T7, in that order | AC3 |
| N6 | notices × asset inventory | Comments list the inventory at B (expected: the 19 files above) and quote the owner's classification; T4 rows equal the third-party and mixed files; if B's inventory differs from the 19, the ticket stops and asks the owner about each new file | AC4 |
| N7 | asset × `.zip` archives | Comments record each archive's member list read with `zipfile.ZipFile(...).namelist()` only, without extracting; nothing about their contents goes into the notices | AC4 |
| S1 | provenance × `license_location` of tune-skills, tw-emoji-commit, tw-emoji-pr-note, tw-emoji-release-note | `"LICENSE"` becomes `"LICENSE-CODE"` | AC5 |
| S2 | provenance × `evidence` of those four | the substring `root MIT license` becomes `MIT license in LICENSE-CODE`; nothing else in the string changes | AC5 |
| S3 | provenance × `licensing.project_license` | `"CC-BY-SA-4.0 (content) and MIT (code); see THIRD_PARTY_NOTICES.md"` | AC5 |
| S4 | provenance × `licensing.verified_on` | the date of the ticket Comment that records the AC1–AC5 checks, as `YYYY-MM-DD` | AC5 |
| S5 | provenance × `skills.init-template`, `local_adaptations.init-template` | both keys removed | AC5 |
| S6 | provenance × `local_adaptations.agent-browser` | the string gains the suffix ` Both runtimes: the SKILL.md license pointer names this skill's LICENSE instead of the project root (epic 0004).` | AC5 |
| S7 | provenance × everything else | parsing B and HEAD as JSON shows no difference beyond S1–S6, including `claude_prompt_audit` | AC5 |
| A1 | agent-browser `SKILL.md` × lines 12–13 × both trees | replaced by T9; no other line changes | AC6 |
| G1 | `AGENTS.md` × slide hard rules | T10 added as the last bullet | AC7 |
| G2 | `AGENTS.md` × open-slide update steps | T11 added after the code block | AC7 |
| G3 | `AGENTS.md` × everything else | unchanged | AC7 |
| R1 | `README.md` × license section | T8 appended as the last section; no other line changes | AC8 |
| D1 | `docs/adr/0007-license-split.md` | front matter `status: accepted` and the ticket's date; records each decision: the CC BY-SA / MIT split by directory; MIT as the default; `docs/agents/`, `AGENTS.md` and `CLAUDE.md` under MIT; code inside CC paths is CC BY-SA; private decks licensed with the rest; the theme and its copies are the owner's work and the owner holds the economic rights (owner, 2026-10-21); the font kept unchanged with attribution only; no SPDX headers, REUSE or `package.json` license field; README section in English | AC9 |
| D2 | `docs/README.md` × ADR index | T12 added after the ADR-0006 line | AC9 |
| C1 | repository × root-MIT claims | `git grep -n -i "root MIT" -- THIRD_PARTY_NOTICES.md README.md AGENTS.md docs/agents/skill-sources.json .agents/skills/agent-browser .claude/skills/agent-browser` returns nothing at HEAD (specs and tickets quote the old wording on purpose and are not searched) | AC10 |
| X1 | repository × diff scope | `git diff --name-only <B SHA>...HEAD` lists only `LICENSE`, `LICENSE-CODE`, `THIRD_PARTY_NOTICES.md`, `README.md`, `AGENTS.md`, `docs/agents/skill-sources.json`, `.agents/skills/agent-browser/SKILL.md`, `.claude/skills/agent-browser/SKILL.md`, `docs/adr/0007-license-split.md`, `docs/README.md`, `.proj.specs/0004-license-files/review/security-T-*.md` and files under `.proj.tickets/0004-license-files/` | AC10 |
| X2 | checks | `python3 scripts/verify-project.py`, `python3 scripts/check_style_skills.py` and `python3 -m unittest discover -s scripts -p 'test_*.py'` exit 0 | AC10 |
