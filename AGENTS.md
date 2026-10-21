# Agent instructions

Shared project instructions for the coding assistants Claude Code and Codex. Use the
shared contract and active-runtime section of [docs/agents/runtime.md](docs/agents/runtime.md)
when invoking skills, delegating, or configuring tools; use its handoff section when
writing or resuming from a handoff. Reuse context already read unless it changed. Each runtime owns its project
skills: Claude Code `.claude/skills/`, Codex `.agents/skills/`. Same-named skills may differ,
tuned to each vendor's prompting guidance; resolve helpers relative to the loaded skill.
Claude Code imports this file through `CLAUDE.md`; keep project rules here.

Skill names below use Claude's `/name` notation. In Codex explicitly use `$name`
or select it in `/skills`; an upstream instruction to call the Skill tool means
load and follow the named project SKILL.md using the active host's supported mechanism.

## Template maintenance

When the user asks to inspect or improve this template, keep the project tokens and
Charter placeholder intact and perform that maintenance. The product gates below
apply when adopting the template for a product; they do not force template maintainers
to invent a product or initialize the source template. Existing user authorization
and approved choices carry forward; ask only for a decision not already settled.
While `.tmpl.docs/` exists, read its README for template maintenance and save template
plans, research and change history there. Keep adopted project rules in `docs/`.

## Project Charter

**chalkdeck** — 以 open-slide 撰寫、建置並發佈 React 投影片的 repo。

**Purpose.** Let the author produce interactive teaching decks quickly with AI agents, publish them
safely, and keep the public ones as a talk record, on a consistent FHSH AiSP × ISIP.hs visual
identity. When these pull against each other, the order is: speed of authoring, then publishing
safety, then visual consistency.

**Who it serves.** The author is the repository owner plus the agents working for them; no other
teacher contributes. The audience is the students and workshop participants a deck is presented to.
Public URLs exist for sharing and for the talk record, not for a general web audience.

**Must hold.** Vocabulary is defined in [GLOSSARY.md](GLOSSARY.md).

1. **Private by default.** Only decks listed in the allowlist (`deploy/public-decks.txt`) are built
   and deployed, and only when a GitHub Release is published. An agent edits the allowlist only on
   the author's explicit instruction.
2. **A deck id is its URL.** Never rename a public deck's folder.
3. **Decks are self-contained.** Template work never changes an existing deck.
4. **No framework changes, no new dependencies.** Use `@open-slide/core` as shipped, `react`, and
   standard web APIs.
5. **A delivered deck is frozen.** After a deck has been presented, fix only typos and broken
   links; a reworked or repeated talk gets a new deck id.

**Two tracks.** Deck content work (only `slides/<deck id>/`, plus the two shared edits the workflow
doc names) takes the light track; template work takes the full pipeline below. See
[docs/agents/workflow.md](docs/agents/workflow.md#deck-content-track) and
[ADR-0004](docs/adr/0004-two-track-delivery.md).

## Delivery model

Work ships as **epics**. One epic = one spec = one pass through the pipeline = one demoable
increment. Finish an epic, then return to stage 1 for the next one.

Round 0 is the **walking skeleton**: the thinnest path that runs end to end, built so that real
**seams** exist. It carries no spec and no adversarial review, because both take seams as input and
a new repository has none yet. That exemption expires the moment the skeleton merges to `main`;
every ticket after that has a spec behind it.
See [ADR-0001](docs/adr/0001-walking-skeleton-then-epic-loop.md).

**This repository adopted harness-agile on 2026-10-15 as an existing project.** The open-slide
toolchain and the decks already on `main` are the walking skeleton, so the exemption has expired:
start every new piece of template work at stage 1. The earlier Spectra/OpenSpec specs and archived changes
are frozen in [docs/legacy-openspec/](docs/legacy-openspec/README.md) — read them for background,
never write to them, and carry any still-binding requirement into a new `.proj.specs/` epic.

## Pipeline

| # | Stage | Skill | Gate before moving on |
|---|---|---|---|
| 1 | Converge the requirement | `/grill-with-docs` | user confirms shared understanding |
| 2 | Write the spec | `/to-spec` | spec **and** traceability matrix exist |
| 3 | Adversarial review | 4 subagents, ≤2 rounds | zero P0 findings |
| 4 | Break into tickets | `/to-tickets` | user approves the breakdown |
| 5 | Implement | `/implement` + `/tdd` | test plan table approved, then red → green |
| 6 | Review the change | `/code-review` | direction and requirement confirmed |
| 7 | Security review | `/security-review` | findings triaged and resolved |
| 8 | End-to-end | see workflow doc | behaviour verified against the real surface |
| 9 | Land it | PR, or `--no-ff` merge with no remote | on `main` |

Stage detail, gates, exceptions, and the epic close-out: **[docs/agents/workflow.md](docs/agents/workflow.md)**.

**[docs/agents/issue-tracker.md](docs/agents/issue-tracker.md) is the tracker configuration** —
read it before `/to-spec` or `/to-tickets` writes a file. Its paths and statuses override
upstream examples; use the existing configuration without asking to set it up again.

## Hard rules

1. **One branch per ticket:** `tickets/<ticket-id>/<ticket-slug>` (e.g. `tickets/T-0007/session-store`).
   Ticket ids are global, sequential, and permanent — branch names depend on them never changing.
   Ticket branches start from `main` and land on `main`; the old `template` branch is retired
   ([ADR-0005](docs/adr/0005-retire-template-branch.md)). Deck content work has no ticket and uses
   `decks/<deck-id>` instead, landing through a PR.
2. **Two tables gate a ticket's tests.** A **test plan table** before the first test is written, which
   the user approves; a **coverage report table** when the ticket closes. Between them, `/tdd` governs
   the loop: one seam, one test, one minimal implementation per cycle.
3. **Adversarial review runs a frozen prompt.** Round 2 replays round 1's prompt verbatim; only the
   spec version changes. Two rounds is the ceiling. P0 findings surviving round 2 mean the epic is
   too large: split it and restart at stage 1.
4. **Verify against the surface that actually runs the behaviour.** `/agent-browser` drives
   Chrome/Chromium and Electron over CDP, so it verifies browser-reachable surfaces only. Any other
   surface — a native client, a daemon, a CLI, a game server — needs a harness this project supplies.
   State which surface a verification covers whenever you report one.
5. **Skills own their output.** Every `git commit` invocation (including amend) must use `/tw-emoji-commit`, PR descriptions use
   `/tw-emoji-pr-note`, release notes use `/tw-emoji-release-note`. Load the project copy even if a global skill has the same name. Generate and sanitize
   the message with that skill, then use a UTF-8 message file for Git. If one is
   unavailable, stop the affected action and report; do not write a fallback message.

## Language

All Chinese output uses Taiwan Traditional Chinese, including conversation, documents,
comments and Git messages. Keep customary English technical terms (commit, PR, API,
cache, log, debug). Correct inconsistent source wording before presenting it.
Document language and bilingual sync rules: [docs/agents/language.md](docs/agents/language.md).

## Repository layout

```
.proj.specs/
  OPEN-QUESTIONS.md               deferred architecture-level decisions
  NNNN-<epic-slug>/
    spec.en.md                    source of truth
    spec.zh-TW.md                 audit translation for the user
    traceability.md               {type x field x boundary} -> acceptance criteria
    review/prompt.md              the frozen adversarial-review prompt
    review/round-N.md             findings, graded P0 / P1 / P2
    reports/*.html                standalone evidence reports
  _reports/*.html                 project-level reports
.proj.handoffs/                   session handoffs; local only, gitignored
.proj.tickets/
  NNNN-<epic-slug>/
    T-NNNN-<slug>.md              status lives in frontmatter, not in the path
docs/adr/                         architecture decisions
docs/agents/                      the docs this file points at
docs/legacy-openspec/             frozen Spectra/OpenSpec specs; read-only
slides/<id>/                      one deck per directory (see "open-slide" below)
themes/                           slide themes: <id>.md + <id>.demo.tsx
assets/                           assets shared across decks, imported via @assets/...
```

Both `.proj.specs/` and `.proj.tickets/` are committed: they are the evidence chain behind every
review and every deferral. `.proj.handoffs/` is not: a handoff expires, so it stays out of history.

## Build and test commands

Portable structure check: `python3 scripts/verify-project.py` (Python 3.11+). It verifies
harness plumbing and the glossary convention, not slide behavior. Skills that open-slide
manages — a `.claude/skills/<name>` symlink to `../../.agents/skills/<name>` — are exempt from
its per-runtime copy checks.

Slides use pnpm: `pnpm dev` (dev server with inspector), `pnpm build` (static build into `dist/`),
`pnpm new:deck <id>` (scaffold a deck on the `fhsh-isiphs-universal` theme). The unit tests under
`scripts/` (the verifier's and the style-skill checker's) run with
`python3 -m unittest discover -s scripts -p 'test_*.py'`; decks have none, so verify a deck by
rendering it in the dev server — that browser page is the real surface.

Style-skill check: `python3 scripts/check_style_skills.py` compares the Claude copies of the five
presentation-style skills with their pinned content in `scripts/style-skills-baseline.json`
(epic 0002). Run it before and after any change to those skills.

## Reference

- **[docs/agents/workflow.md](docs/agents/workflow.md)** — the nine stages in full: entry conditions, gates, the walking-skeleton exemption, epic close-out, branching and landing.
- **[docs/agents/issue-tracker.md](docs/agents/issue-tracker.md)** — where specs and tickets live, ticket frontmatter, the six status views, how blocking is derived.
- **[docs/agents/review.md](docs/agents/review.md)** — the four adversarial-review axes, P0/P1/P2 grading, and the two-stage security review.
- **[docs/agents/language.md](docs/agents/language.md)** — which documents are English, which are Traditional Chinese, and how the bilingual spec stays in sync.
- **[docs/agents/domain.md](docs/agents/domain.md)** — how to consume `GLOSSARY.md` and ADRs while exploring.

## open-slide

You are authoring **slides** in this repo. Every slide is arbitrary React code that you write.

### Slide hard rules

- Put your slide under `slides/<kebab-case-id>/`.
- The entry is `slides/<id>/index.tsx`.
- Put slide-specific images/videos/fonts under `slides/<id>/assets/`. For assets reused across decks or themes (logos, avatars), use the global `assets/` folder and import via `@assets/...`.
- Do **not** touch `package.json`, `open-slide.config.ts`, or other slides.
- Do not add dependencies. Use only `react` and standard web APIs.
- When a deck adds, removes or renames a file under its own `slides/<id>/assets/` that is someone else's work, update that file's row in the Assets table of `THIRD_PARTY_NOTICES.md` in the same change. Name the holder as the file's license requires, and no one else, such as people shown in it. ADR-0007 lets this one edit ride on the deck track; any other change to the notices, or a third-party file in the global `assets/`, is template work.

### Which slide skill to use

- **Drafting a new deck** — use the `create-slide` skill. It walks through scoping questions, structure, and hand-off.
- **Quickly scaffolding a deck on the `fhsh-isiphs-universal` theme** — use the `new-deck` skill (local, not managed by `@open-slide/core`). It runs `scripts/new-deck.mjs` (`pnpm new:deck <id>`) to inject the theme boilerplate into `slides/<id>/index.tsx`, then starts the dev server. Defers page-content authoring to `slide-authoring`.
- **Applying inspector comments** (`@slide-comment` markers in a page) — use the `apply-comments` skill.
- **Creating or extracting a theme** — use the `create-theme` skill. Themes live as markdown under `themes/<id>.md` and are read by `create-slide` before authoring.
- **Resolving "this page" / "this element"** — when the user references the current slide or selection without naming it, consult the `current-slide` skill. It reads the dev server's `node_modules/.open-slide/current.json` to find which slide, page, and inspector-picked element they mean.
- **Any other slide edit** — read the `slide-authoring` skill before writing. It is the technical reference for everything inside `slides/<id>/`: file contract, the 1920×1080 canvas, type scale, palette, layout, assets, self-review checklist, and anti-patterns. `create-slide` and `apply-comments` both defer to it for the *how*.

### Updating open-slide skills

The open-slide skills live in `.agents/skills/` with `.claude/skills/` symlinks, both written by
`@open-slide/core`. Do not edit them in place, and do not convert the symlinks into copies. To pull
the latest versions:

```
pnpm up @open-slide/core
pnpm sync:skills
```

`pnpm dev` will also detect drift on startup and offer to sync. `pnpm sync:skills --dry-run` (via `pnpm exec open-slide sync:skills --dry-run`) previews changes without writing.

After `pnpm up`, `pnpm sync:skills`, or a sync accepted when `pnpm dev` starts, check that `node_modules/@open-slide/core/LICENSE` still has the license and copyright line the open-slide entry in `THIRD_PARTY_NOTICES.md` names, and that the skills listed there are still the ones open-slide writes.
