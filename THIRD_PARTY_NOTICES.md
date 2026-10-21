# Third-party notices

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

## Matt Pocock skills — MIT

Copyright (c) 2026 Matt Pocock. Each of the following project skill directories
contains the complete upstream MIT text in its own LICENSE so an individually
copied skill retains the notice:

- [code-review](.agents/skills/code-review/LICENSE)
- [codebase-design](.agents/skills/codebase-design/LICENSE)
- [diagnosing-bugs](.agents/skills/diagnosing-bugs/LICENSE)
- [domain-modeling](.agents/skills/domain-modeling/LICENSE)
- [grill-me](.agents/skills/grill-me/LICENSE)
- [grill-with-docs](.agents/skills/grill-with-docs/LICENSE)
- [grilling](.agents/skills/grilling/LICENSE)
- [handoff](.agents/skills/handoff/LICENSE)
- [implement](.agents/skills/implement/LICENSE)
- [improve-codebase-architecture](.agents/skills/improve-codebase-architecture/LICENSE)
- [prototype](.agents/skills/prototype/LICENSE)
- [research](.agents/skills/research/LICENSE)
- [resolving-merge-conflicts](.agents/skills/resolving-merge-conflicts/LICENSE)
- [setup-matt-pocock-skills](.agents/skills/setup-matt-pocock-skills/LICENSE)
- [tdd](.agents/skills/tdd/LICENSE)
- [teach](.agents/skills/teach/LICENSE)
- [to-questionnaire](.agents/skills/to-questionnaire/LICENSE)
- [to-spec](.agents/skills/to-spec/LICENSE)
- [to-tickets](.agents/skills/to-tickets/LICENSE)
- [wait-what](.agents/skills/wait-what/LICENSE)
- [wayfinder](.agents/skills/wayfinder/LICENSE)
- [wizard](.agents/skills/wizard/LICENSE)
- [writing-for-agents](.agents/skills/writing-for-agents/LICENSE)

Source: https://github.com/mattpocock/skills . The installer hashes remain in
skills-lock.json; the license verification revision and SHA-256 are recorded in
docs/agents/skill-sources.json. Verification revisions do not imply that locally
adapted skill instructions match upstream HEAD byte for byte.

## agent-browser — Apache-2.0

Source: https://github.com/vercel-labs/agent-browser . The bundled discovery
guidance is an adapted upstream skill, not the browser executable. The full
[Apache-2.0 license](.agents/skills/agent-browser/LICENSE) is included; the modified
SKILL.md carries a change notice. No root NOTICE file was present at the verified
upstream revision. Installing the external CLI separately also subjects that
installation to its own distribution notices.

## i-have-adhd — MIT

Copyright (c) 2026 Ayoub Ghriss. Source: https://github.com/ayghri/i-have-adhd .
The complete [MIT license](.agents/skills/i-have-adhd/LICENSE) is included.
The project retains its existing metadata and instruction differences.

## Archify and security-review

- [Archify MIT license](.agents/skills/archify/LICENSE): Copyright (c) 2026 tt-a1i
  (Archify); Copyright (c) 2025 Cocoon AI.
- [Archify third-party notices](.agents/skills/archify/THIRD_PARTY_NOTICES.md)
  cover brand marks and their individual conditions; they are not all MIT.
  [JetBrains Mono OFL](.agents/skills/archify/assets/JetBrainsMono-OFL.txt) is retained.
- [security-review MIT license](.agents/skills/security-review/LICENSE):
  Copyright (c) 2025 Anthropic; source and pinned revision are in skill-sources.json.

## evidence-report — project adaptation with design-source attribution

Created by the maintainer using Claude Code and copied into this template.
The original session records maintainer approval to embed concise design
principles from local phoenix-design, which identifies
[alchaincyf/huashu-design](https://github.com/alchaincyf/huashu-design) as its source.
Design-source attribution: Copyright (c) 2026 alchaincyf (花叔 · 花生).
The complete upstream [MIT notice](.agents/skills/evidence-report/LICENSE) is
preserved with the skill. Project-authored additions are covered by the MIT license in LICENSE-CODE.

The session also invoked artifact-design; invocation alone is not recorded as
proof of copying an independently identified external package. No unrelated
same-name repository is attributed as the direct source. Source verification
revisions identify the license checked, not the original local installation.

## Project-authored skills — MIT

On 2026-09-13 CXPhoenix confirmed that tw-emoji-commit, tw-emoji-pr-note and tw-emoji-release-note
were authored by CXPhoenix using Claude Code; tune-skills is recorded the same way in
docs/agents/skill-sources.json. They are project-authored material under the MIT license in
LICENSE-CODE. This provenance record is based on that explicit confirmation.

## slide-style-design presentation-style skills — MIT

presentation-style-route, takahashi-style, jobs-style, wangxing-style and gates-style
are vendored from https://github.com/CXPhoenix/slide-style-design at revision
80e5d06bddda8a4c5e02d7ece58b66038b543574. That repository is the maintainer's own
project, licensed MIT (Copyright (c) 2026 CXPhoenix). Its skill directories ship no
LICENSE file; the license text is the upstream repository's root LICENSE, whose SHA-256
is recorded in docs/agents/skill-sources.json. The styles are project syntheses of public
sources named in each skill's references, not quotations or official methods of the
people they are named after.

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

## open-slide — MIT

Copyright (c) 2026 Yiwei Ho. From `@open-slide/core` as installed through `package.json`; MIT
license text below. Covered: the skills apply-comments, create-slide, create-theme, current-slide
and slide-authoring, which `pnpm sync:skills` writes into `.agents/skills/`; the deck
`slides/getting-started/`; and the text of `open-slide.config.ts`, of `README.md` and of the
`## open-slide` section of `AGENTS.md` that comes from the open-slide project scaffold (commit
05d62cd). Changes made in this repository after that commit follow the licensing table above. The
vendor logos in `slides/getting-started/assets/` are third-party marks listed under Assets.

## K-Dense scientific skills — MIT

Copyright (c) 2025 K-Dense Inc. Source: https://github.com/K-Dense-AI/claude-scientific-skills ;
MIT license text below. Covered skills: seaborn and scientific-visualization. The `license` field
in seaborn's SKILL.md (BSD-3-Clause) is the license of the seaborn library the skill teaches; any
text the skill quotes from the seaborn documentation keeps that license.

## MIT license text

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
