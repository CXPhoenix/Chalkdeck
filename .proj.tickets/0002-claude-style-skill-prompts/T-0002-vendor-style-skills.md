---
id: T-0002
title: Vendor the five presentation-style skills with provenance and Codex metadata
epic: 0002-claude-style-skill-prompts
status: todo
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
