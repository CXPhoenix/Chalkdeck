---
status: accepted
date: 2026-10-22
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
