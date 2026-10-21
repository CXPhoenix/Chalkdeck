---
id: T-0006
title: License content under CC BY-SA 4.0 and code under MIT, with notices and pointers
epic: 0004-license-files
status: processing
blocked_by: []
---

## Context

Spec 0004 (revision 3) and its `traceability.md` hold every definition, target text (T1–T18) and
check this ticket uses; this file does not repeat them, and where a summary below is shorter than
the spec, the spec governs.

The epic is documentation only and was sized as one ticket. A split into the license files and
notices (which alone carries E1) and the deck-track amendments was considered and rejected:

- the second ticket's B would contain the first ticket's changed target files, so it would drift
  from S0 by definition and stop for an owner ruling every time;
- the deck-track texts depend on the first half (T10 and T14 name the T4 Assets table, T13 describes
  `LICENSE` and `LICENSE-CODE`), so nothing could land in parallel;
- the drift ruling already allows splitting any single difference off into a new epic.

Branch `tickets/T-0006/license-files-and-notices` from `main` **after** the spec merge (the commit
that merges `specs/0003-license-split` into `main`). Work in a worktree, because the main checkout
is on another branch with the owner's untracked files. B is the branch's starting commit; the branch
never merges `main`, and if it must be updated it is rebased and the new B is recorded with the
reason and a fresh drift check.

A fresh worktree has no `node_modules`. Before the drift check, run `pnpm install --frozen-lockfile`
in it so that the installed `node_modules/@open-slide/core/LICENSE` exists, and record in the same
Comment that this was done and that `git status` shows no tracked change (no dependency added,
`pnpm-lock.yaml` untouched).

Documentation only: the spec adds no tests (Testing Decisions, "No new tests"), so the `/tdd`
red → green loop has no test to write, and ADR-0006 does not apply (spec, Implementation Decisions,
Ticket). Hard rule 2 still holds: the test plan table lists the acceptance checks and is approved
by the user before the first commit that touches a target file; the coverage report table, keyed
by spec AC, maps each AC to its recorded check output and is written before stage 6.

No file under `.proj.specs/0004-license-files/` changes on this branch except the stage-7 report
`review/security-T-0006.md`; `spec.zh-TW.md` landed with the spec. The epic close-out evidence report
and retrospective are committed after the merge, not on this branch.

## Deliverable

A reuser opening the repository on GitHub finds `LICENSE` (the CC BY-SA 4.0 legal code),
`LICENSE-CODE` (MIT, CXPhoenix), a README License section, and a `THIRD_PARTY_NOTICES.md` whose first
section is T1's Licensing section with the licensing table, followed by the existing entries and the
new Assets, open-slide and K-Dense entries. No file in the C1 scope still claims a "root MIT
license", the stale init-template provenance entries are gone, ADR-0007 records the decisions and
amends ADR-0004, and the agent rules keep the notices current for deck changes and open-slide
upgrades.

## Acceptance criteria

Items are numbered for this ticket only. Each cites, in parentheses, the spec ACs and traceability
rows it covers; those spec ACs are authoritative, and the coverage report table is keyed by spec AC
(AC1–AC12), not by item number. Items 13 and 14 restate the spec's Testing Decisions and Unchanged
sections.

1. **First Comment, before any commit touching a target file** (AC10, N8; AC4, N6, N7): set
   `status: processing`, then record:
   - B's full SHA and the spec merge SHA;
   - every target file's blob at B, compared with its S0 blob, except `GLOSSARY.md`, whose reference
     is its blob at the spec merge; plus the check that its `**Deck content work**` heading,
     definition and `_Avoid_` lines read exactly as at S0;
   - the `.claude/skills/` symlink set;
   - line 3 of the installed `node_modules/@open-slide/core/LICENSE`;
   - the inventory command and its output;
   - the archive check for both archives: the four results the traceability's Archive check lists
     (member count, license-like names, nested `.zip`, each `package.json` `license` field), read
     with `namelist()` and `ZipFile.read` only, never extracted, and no member path. The S0 table has
     these four columns; the definition's "two things" is a known typo for four.

   Each is stated equal to its reference or not. On any drift, stop and ask the repository owner for
   a *proceed* or *split* ruling per difference. On *proceed*, the approved text is quoted in the
   ruling Comment and replaces the affected T-block or T4 row for every AC and for the comparison
   scripts; if the difference is in the inventory or archive check, the ruling also states what AC4
   is checked against. On *split*, that work leaves this ticket. Status stays `processing` unless the
   owner sets `pending`. The ruling Comment's commit precedes every commit touching a target file.
   Repeat all of this for every later B.
2. **`LICENSE`** is the Source LICENSE, blob `2d58298e6eda10e7204abb52722efbc840db2390`, mode
   `100644` (AC1, L1).
3. **`LICENSE-CODE`** differs from `.agents/skills/tdd/LICENSE` only on line 3, which reads
   `Copyright (c) 2026 CXPhoenix`; mode `100644` (AC2, L2).
4. **Notices**, by exact comparison: B lines 3–6 replaced by T1, line 76 by T2, lines 85–88 by T3,
   T4–T7 appended, every other B line unchanged (AC3, N1–N5).
5. **Provenance file** equals, byte for byte, the expected file the provenance comparison builds
   from B by S1–S6, and parses as JSON; `verified_on` equals the ADR date (AC5, S1–S7).
6. **agent-browser `SKILL.md`**, both trees, by exact comparison: only lines 12–13 differ from B,
   replaced by T9 (AC6, A1).
7. **`AGENTS.md`**, by exact comparison: differs from B only by T10, T11 and T17 at the places G1, G2
   and G4 name (AC7, G1–G4).
8. **`README.md`**, by exact comparison: differs from B only by T8, appended as its last section
   (AC8, R1).
9. **ADRs, index, workflow, glossary**, by exact comparison: ADR-0007 equals T13 with the ADR date;
   `docs/README.md` differs from B only by T12; ADR-0004 only by T18; `workflow.md` only by T16 and
   T14; `GLOSSARY.md` only by T15 (AC9, D1–D3, W1, W2). T10 and T13–T18 land together in this one
   merge; none is cherry-picked or landed separately.
10. **Scope and checks at HEAD** (AC11, C1, X1, X2): the C1 `git grep` returns nothing;
    `git diff --name-only <B SHA>...HEAD` lists only X1 paths; the three X2 commands exit 0 when run
    from the repository root.
11. **No archive member path** appears in any X1 file, any commit message on the branch, or the PR
    description (AC4, N7).
12. **Browser check before merge** (AC12, E1): with `/agent-browser`, or a native browser tool that
    `docs/agents/workflow.md` accepts as giving equivalent evidence, open the pushed branch's GitHub
    file views of `LICENSE`, `LICENSE-CODE`, `THIRD_PARTY_NOTICES.md` and `README.md`. Each shows its
    rendered content, not an error page; the T1 and T4 tables render as tables; every relative link
    in T1 and T8 opens a page that is not GitHub's 404 page. Page text, not screenshots, is recorded
    in Comments; the surface is the GitHub file view. GitHub's license detection on the default
    branch is noted after the merge, in the epic close-out retrospective.
13. **Recorded checks** (spec Testing Decisions): every listed check is run and its output recorded
    in Comments. The exact comparison and the provenance comparison are scripts, never a reading of
    the diff by eye.
14. **Unchanged** (spec Implementation Decisions, Unchanged; X1): nothing under `slides/`, `themes/`
    or `assets/` changes, `package.json` is untouched, and no dependency is added.

## 給使用者（zh-TW）

這張票一次做完 epic 0004 的文件改動，內容如下：

- 根目錄放上 CC 官方的 CC BY-SA 4.0 授權全文（`LICENSE`），以及你署名的 MIT（`LICENSE-CODE`）。
- `THIRD_PARTY_NOTICES.md` 標題下的第一節換成 Licensing 授權說明，附上「哪些路徑用哪個授權」的表格；文末補上第三方素材、open-slide 與 K-Dense 的標示。
- README 加一節 License。
- provenance 檔與 agent-browser skill 不再指向「根目錄 MIT」。
- 新增 ADR-0007 並修訂 ADR-0004，讓 deck 變更能在輕量軌上順手更新自己的素材列。

開工前會先記錄起點 B、在新 worktree 執行 `pnpm install --frozen-lockfile`，再跑 drift 檢查；只要有任何一項和基準不同，就停下來請你逐項裁決，看是照核准的文字繼續，還是拆成新 epic。每項檢查都會執行並記錄輸出，逐字比對與 provenance 比對用腳本做，不靠肉眼看 diff。合併前會用瀏覽器在 GitHub 上確認四個檔案都能正常顯示、連結都能打開。

## Comments

### 2026-10-22 — Branch, base B and drift check (B #1)

PR #8 (`specs/0003-license-split`) merged into `main` as a merge commit. Spec merge:
`746378fda6d65434bb78f3499cfec29b5ed76530` (parents `f1a29c7` and `920fa9d`). Branch
`tickets/T-0006/license-files-and-notices` created from it in the worktree `.worktrees/T-0006`, so
B is the spec merge.

`pnpm install --frozen-lockfile` was run in the worktree before the check (pnpm 11.14.0, exit 0);
`git status --short` afterwards printed nothing, so no tracked file changed, no dependency was added
and `pnpm-lock.yaml` is untouched.

Output of the drift-check script (run from the worktree root):

- B: `746378fda6d65434bb78f3499cfec29b5ed76530`
- Spec merge: `746378fda6d65434bb78f3499cfec29b5ed76530`
- S0: `f1a29c75bf142219cc88ca6774ef0476bbc2d465`

**Target file blobs at B**

| File | Blob at B | Reference | Result |
|---|---|---|---|
| `THIRD_PARTY_NOTICES.md` | `292db36420d273ebaf104471ddca38d4aceca608` | S0 `292db36420d273ebaf104471ddca38d4aceca608` | equal |
| `README.md` | `92c20604e19f3f07df25253a7efa380e207bc50b` | S0 `92c20604e19f3f07df25253a7efa380e207bc50b` | equal |
| `AGENTS.md` | `3b774b557a65238e374593362d6ad3e3707ebd02` | S0 `3b774b557a65238e374593362d6ad3e3707ebd02` | equal |
| `docs/agents/skill-sources.json` | `5d16c6006848c3c59e324b710b0f6a4f524ae082` | S0 `5d16c6006848c3c59e324b710b0f6a4f524ae082` | equal |
| `.agents/skills/agent-browser/SKILL.md` | `410922f854dcb686e701f47dd76f53b9cfce92ab` | S0 `410922f854dcb686e701f47dd76f53b9cfce92ab` | equal |
| `.claude/skills/agent-browser/SKILL.md` | `366b05ec9b0b7bfc74eeab86cb0659ed2aacf76f` | S0 `366b05ec9b0b7bfc74eeab86cb0659ed2aacf76f` | equal |
| `docs/README.md` | `487ec8c7bb8d82e2eefbf71e29b1bfd7c964e86a` | S0 `487ec8c7bb8d82e2eefbf71e29b1bfd7c964e86a` | equal |
| `docs/agents/workflow.md` | `2ed80934921294627b2202a30a113a99b03e9c6f` | S0 `2ed80934921294627b2202a30a113a99b03e9c6f` | equal |
| `docs/adr/0004-two-track-delivery.md` | `77483f64291f8dc7ffda88d530bfc3a67ddb9d70` | S0 `77483f64291f8dc7ffda88d530bfc3a67ddb9d70` | equal |
| `package.json` | `224f7bfd142b146544c13771247a2e167dc4eaf3` | S0 `224f7bfd142b146544c13771247a2e167dc4eaf3` | equal |
| `pnpm-lock.yaml` | `82841f794e501e888af0e0e8634ca73a103d38b8` | S0 `82841f794e501e888af0e0e8634ca73a103d38b8` | equal |
| `GLOSSARY.md` | `64bc6c14b37d67fb6f2fb02b59b11cef0eb3b770` | spec merge `64bc6c14b37d67fb6f2fb02b59b11cef0eb3b770` | equal |

`GLOSSARY.md` `**Deck content work**` entry (heading, definition, `_Avoid_` line, 3 lines) at B vs S0: equal

**`.claude/skills/` symlinks at B:** apply-comments, create-slide, create-theme, current-slide, new-deck, scientific-visualization, seaborn, slide-authoring — vs S0: equal

**Installed `node_modules/@open-slide/core/LICENSE` line 3** (version 2.2.0): `Copyright (c) 2026 Yiwei Ho` — vs S0: equal

**Inventory command:** `git ls-tree -r 746378fda6d6 -- assets slides`, keeping paths under `assets/` or `slides/<one segment>/assets/`, dropping `assets/.gitkeep`. Output (19 files):

| Path | Blob at B |
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

Inventory vs S0 table of 19 paths and blobs: equal

**Archive check** (`namelist()` and `ZipFile.read` of `package.json` only, in memory, never extracted; no member names)

| Archive | Members | License-like names | Nested `.zip` | `package.json` `license` | vs S0 |
|---|---|---|---|---|---|
| `bluechall-master.zip` | 200 | none | none | no `package.json` | equal |
| `webchall-master.zip` | 236 | none | none | `package.json`: no license field, `"private": true` yes | equal |

**Drift result:** no drift; B equals S0 on every item

### 2026-10-22 — Test plan table (approved)

Documentation only: each seam is an acceptance check, run as a script against B and HEAD, never by
reading the diff by eye. The comparison scripts are kept outside the repository (X1); their output
is recorded in later Comments.

| Seam | Test intent | Scope | Acceptance criterion | Boundary conditions |
|---|---|---|---|---|
| Drift check | B equals S0 on target blobs, symlinks, installed open-slide line 3, inventory, archives | every recorded B | AC10, AC4 (N6–N8) | `GLOSSARY.md` against the spec merge; archives read in memory, no member path printed |
| `git rev-parse` / `git ls-tree` | `LICENSE` is the Source LICENSE | `LICENSE` | AC1 (L1) | blob `2d58298e…`, mode `100644`, no CR, final empty line kept |
| `diff` against the tdd LICENSE | only line 3 differs | `LICENSE-CODE` | AC2 (L2) | `3c3` only; mode `100644`; one final `\n` |
| Exact comparison | T1–T3 in place, T4–T7 appended, rest equals B | `THIRD_PARTY_NOTICES.md` | AC3 (N1–N5) | blank lines 2 and 7 kept around T1; one blank line before each of T4–T7; T7 body equals tdd LICENSE lines 5–21 |
| Provenance comparison | expected file from B by S1–S6 equals HEAD and parses | `docs/agents/skill-sources.json` | AC5 (S1–S7) | only top-level `/licensing/verified_on`; S5 removes key line through `}` with its comma; `claude_prompt_audit` unchanged |
| Exact comparison | T9 on lines 12–13 only | both `agent-browser/SKILL.md` | AC6 (A1) | the two trees differ elsewhere; each compared with its own B |
| Exact comparison | T10, T17, T11 at G1, G4, G2 | `AGENTS.md` | AC7 (G1–G4) | T10 directly after the `- Do not add dependencies.` bullet; T11 after one blank line at EOF |
| Exact comparison | T8 last section | `README.md` | AC8 (R1) | one blank line before T8 |
| Exact comparison | T13 with the ADR date; T12, T18, T16+T14, T15 in place | ADR-0007, `docs/README.md`, ADR-0004, `workflow.md`, `GLOSSARY.md` | AC9 (D1–D3, W1, W2) | ADR date equals `/licensing/verified_on`; blank lines around T14 and after T18 |
| Scoped `git grep`, `git diff --name-only`, X2 commands | no root-MIT claim; diff only in X1; checks exit 0 | repository at HEAD | AC11 (C1, X1, X2) | three-dot diff from B |
| Member-path scan | no full member path from either archive appears as an exact substring | X1 files at HEAD, branch commit messages, PR description | AC4 (N7) | names compared in memory, never printed |
| GitHub file view | four files render, T1/T4 tables render, relative links in T1 and T8 are not 404 | pushed branch on github.com | AC12 (E1) | page text recorded, not screenshots |

Approval: the repository owner approved the breakdown and the implementation in advance ("票開完後接受你的建議，直接開始 /implement 到整個 epic 完成"; "ultracode /implement T-0006 做到完成", 2026-10-22). This table is shown to the owner in the session report.
