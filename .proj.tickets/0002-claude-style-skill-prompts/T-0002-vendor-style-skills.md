---
id: T-0002
title: Vendor the five presentation-style skills with provenance and Codex metadata
epic: 0002-claude-style-skill-prompts
status: done
blocked_by: [T-0001]
---

## Context

Spec: `.proj.specs/0002-claude-style-skill-prompts/spec.en.md` (revision 2) and `traceability.md`
(U, V, K1–K13). Review: `review/round-1.md`, `review/round-2.md` with the author's adjudication.
The spec is frozen; the refinements below win where they are more specific.

Branch `tickets/T-0002/vendor-style-skills` starts from `main` after T-0001 has landed, in a git
worktree outside the main checkout. The five skills currently sit untracked in the main checkout;
they are copied from U, not from the working tree.

## Deliverable

The five skills present in both runtime trees exactly as published at U, discoverable by Claude Code
and Codex, with their source pinned, and the repository verifier passing. The commit that adds them
is V for every later ticket of this epic.

## Acceptance criteria

1. **Spec AC1.** All 43 files under `skills/` at U are added at the matching path in both trees,
   each `git hash-object` equal to U's blob, and no other file is added under those ten skill
   directories except the five `agents/openai.yaml` below.
2. **Spec AC2.** Each Codex copy has `agents/openai.yaml` containing only the `interface` block with
   `display_name` (the skill's H1 text without `# `) and `short_description` (the vendored
   description up to, not including, its first `,` or `;`). No other key.
3. **Real directories.** Each `.claude/skills/<skill>` and `.agents/skills/<skill>` of the five is a
   real directory, not a symlink.
4. **Lock.** `skills-lock.json` lists the five with source `CXPhoenix/slide-style-design` and
   `ref` set to `80e5d06bddda8a4c5e02d7ece58b66038b543574` (pinned, not `main`).
5. **Provenance.** `docs/agents/skill-sources.json` `skills` gains one entry per skill with
   `source` (the repository URL), `revision` (U), `license` (`MIT`) and `adaptations` containing
   "Codex: as vendored plus agents/openai.yaml." The Claude adaptation is added by T-0005.
   `THIRD_PARTY_NOTICES.md` lists the five skills under the author's own projects, noting that U
   ships no LICENSE file and that the upstream repository is MIT.
6. **V is one commit** containing items 1–5; `python3 scripts/verify-project.py` exits 0 at that
   commit. Its SHA is written in this ticket's Comments and is the V of tickets T-0003 to T-0005.
7. **Discovery check.** A fresh Claude Code session in the worktree lists the five skills; Codex
   discovery is checked with the Codex skills listing if available, otherwise reported as not
   checked. Surfaces named in Comments.
8. Evidence in Comments uses repo-relative paths only.

## 給使用者（zh-TW）

這張票把 5 個 style skills 原樣放進 repo：兩棵樹的內容都和 `slide-style-design` 的 `80e5d06` 逐位元組相同。Codex 版補上 `openai.yaml`，lock 檔改成固定在這個 commit，並寫好來源與授權紀錄。

做完之後 verifier 會通過，兩個工具都看得到這 5 個 skill。這個 commit 的 SHA 就是後面 3 張票的比較基準 V。

## Comments

### 2026-10-16 — Branch and base

Branch `tickets/T-0002/vendor-style-skills` created from `main` at `3cfa72b53ff23d5908b73db6800ea5aa35c957f1` (merge of PR #5, so T-0001 has landed), in a worktree outside the main checkout.

This ticket writes no unit tests: its checks are the existing verifier and one-off hash and structure comparisons recorded below. The author's ruling on hard rule 2 is recorded below.

### 2026-10-16 — V (items 1–6)

**V = `d1c8857b0d668ad565d26da4a8bbdbb27f89bdb4`**, the V of tickets T-0003 to T-0005. Land this
branch with a **merge commit** so that V stays on `main`; a squash or rebase merge would remove it.

- `git show --stat d1c8857`: `94 files changed, 3518 insertions(+)`. V alone holds items 1–5.
- Verifier at V (`python3 scripts/verify-project.py`, rerun 2026-10-21 with HEAD = V), exit 0:
  `PASS: shared instructions, 45 skills across Claude/Codex trees, invocation policies, helper assets, native role configs and the glossary convention`
- Item 1 blob check (rerun 2026-10-21): the upstream tree came from
  `gh api repos/CXPhoenix/slide-style-design/git/trees/80e5d06bddda8a4c5e02d7ece58b66038b543574?recursive=1`
  and was compared with `git ls-tree -r d1c8857` for the five directories in both trees. Result:
  43 upstream files under `skills/`, none missing in either tree, `matching blobs=86 mismatched=0`.
  The only extra files are the five `.agents/skills/<skill>/agents/openai.yaml`.
- Item 3: `git ls-tree -r d1c8857 -- .claude/skills .agents/skills` shows no mode `120000` entry
  for any of the five, so all ten directories are real directories.
- Item 4, where `computedHash` came from: the five values were copied from the author's working-tree
  `skills-lock.json` in the main checkout, whose installed content equals U. They are still equal
  there. The only change was `ref`, from `main` to the U SHA.
- Item 5, the LICENSE hash in `licensing.groups.slide-style-design`:
  `gh api repos/CXPhoenix/slide-style-design/contents/LICENSE?ref=<U> -H 'Accept: application/vnd.github.raw' | shasum -a 256`
  gives `c78dc1360729f89b00ab55d961e5a5917121bf297dfa3f2a785cd28d8c846bb8`. This is the upstream
  repository's root LICENSE; its `skills/` directories ship none.

### 2026-10-16 — Discovery (item 7)

- **Codex: checked.** Surface: Codex CLI 0.161.0, non-interactive (`codex exec -s read-only`),
  run in this ticket's worktree. Asked without running commands, the model listed `gates-style`,
  `jobs-style`, `presentation-style-route`, `takahashi-style` and `wangxing-style`. The one other
  entry was an unrelated namespaced plugin skill.
- **Claude Code: waived by the author on 2026-10-21** ("豁免，記靜態證據"). The local Claude Code
  CLI could not start a session (expired OAuth session), and agents do not handle credentials.
  The static evidence: all ten directories are real directories (item 3), each `SKILL.md`
  frontmatter has `name` and `description` only, with no `disable-model-invocation`, and the
  verifier passes at V. Claude-side discovery is exercised again by T-0005's smoke test (surface:
  Claude Code interactive session).

### 2026-10-16 — Code review (stage 6)

Two `harness-reviewer` passes, standards and spec, ran over the committed range
`3cfa72b..d1c8857`. Dispositions:

| Finding | Disposition |
|---|---|
| Status still `processing` (S1, F10) | Fixed: `status: review`. |
| No coverage table; hard rule 2 waived without approval (S2, F12) | Author ruling below; coverage table added. |
| No evidence in Comments (S3, F2, F3) | Fixed: recorded above. |
| Claude discovery not checked (F1) | Waived by the author; see item 7 above. |
| Merge strategy could drop V (F4) | Land with a merge commit; stated above and in the PR. |
| Codex evidence surface (F5) | Recorded above with its surface; no absolute paths. |
| `computedHash` and `ref` provenance (S7, F9) | Recorded under item 4 above. |
| LICENSE hash derivation (F7) | Recorded under item 5 above. |
| `revision_scope` said "later" adaptations (J3) | Fixed in `docs/agents/skill-sources.json`. |
| Repository root has no `LICENSE`, yet `THIRD_PARTY_NOTICES.md` and five `license_location` entries point at it (S4) | Pre-existing. Author ruling 2026-10-21: separate follow-up task, outside this ticket. |
| T-0001 `done` committed on this branch (S5, F11) | Accepted; `main` catches up when this branch lands. |
| `openai.yaml` values longer than repository convention (S6, F13) | Accepted: spec AC2 fixes the derivation. |
| Notices layout and extra sentence (F6, F8); smells J1, J2, J4–J6 | Accepted; no change. |

### 2026-10-16 — Security review (stage 7)

Report: `.proj.specs/0002-claude-style-skill-prompts/review/security-T-0002.md`. There were six
candidates and none was confirmed after independent false-positive filtering. Observation 1 there,
the "do not update with the installer" provenance note, was assigned to T-0005 by the author on
2026-10-21 ("放進 T-0005"). It is documentation only.

### 2026-10-21 — Hard rule 2 ruling and coverage report

Author ruling: "豁免計畫表，補 coverage 表". This follows the T-0001 precedent: no test plan table
for a ticket without unit tests, and a coverage report table at close.

| Item | Check | Test | Result |
|---|---|---|---|
| 1 Files equal U | blob comparison against the upstream tree | n/a (content) | 86/86 match, 0 missing, 5 expected extras |
| 2 Codex `openai.yaml` | spec reviewer read all five | n/a (content) | `interface` only; values derived per AC2 |
| 3 Real directories | `git ls-tree` modes | n/a (content) | no symlinks |
| 4 Lock pinned | `skills-lock.json` at V | n/a (content) | five entries, `ref` = U |
| 5 Provenance and notices | spec reviewer, LICENSE hash rerun | n/a (content) | entries present; hash matches |
| 6 One commit, verifier | `git show --stat`, verifier at V | existing verifier suite | exit 0 |
| 7 Discovery | Codex CLI listing | n/a (manual) | Codex listed five; Claude waived by author |
| 8 Repo-relative evidence | this section | n/a | no absolute paths |
