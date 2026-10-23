# Grill record — 0005-license-reference-check

Stage-1 questions put to the repository owner (CXPhoenix) on 2026-10-23, and the answers, quoted.
Inputs carried over:

- `../0003-license-split/traceability.md` (revision 2): the License references, Valid target and
  Messages definitions and rows V1–V15, drafted for this epic before 0003 was split.
- `../0003-license-split/review/round-1.md` and `round-2.md`: every round-2 finding about the
  verifier is input to this epic (round-2 Rulings).
- The files on `main` at `2577b504fa5f22fcef047a95f6d9c2afc9a2daf4`, which 0004 landed. Where the
  0003 drafts or the local carry-over notes disagree with them, `main` wins:
  - `LICENSE` is the creativecommons.org legal code, blob `2d58298e6eda10e7204abb52722efbc840db2390`,
    not the `CXPhoenix/0x1dea` blob `2e72ca11…` that 0003 planned.
  - Four `license_location` values are `LICENSE-CODE` (tune-skills, tw-emoji-commit,
    tw-emoji-pr-note, tw-emoji-release-note), not five; init-template was removed.

## Round 1

| Q | Question (short) | Recommended | Owner's answer |
|---|---|---|---|
| Q1 | scope of the check | keep reference kinds (a)–(d); tighten (a)'s skip rule so a value with only leading or trailing whitespace fails; defer README links and skill LICENSE contents | "都照建議" |
| Q2 | behaviour outside Git | FAIL with a no-Git message (superseded by Q2' below) | "都照建議" |
| Q3 | how far notices parsing goes | (B) a narrow link grammar for the notices; anything it cannot judge fails | "都照建議" |
| Q4 | placeholders in messages | non-string values via `json.dumps`; every placeholder through `printable()` (copied, not imported), `"` as `\"`; defined `<actual path>` and `<component path>` | "都照建議" |
| Q5 | how git runs | `ls-files -z`, `GIT_*` removed, fsmonitor off, no safe.directory override, Windows out of scope (superseded by Q2') | "都照建議" |
| Q6 | tests for wiring and for no-message cases | a `verify()` test that a bad link's message is included; no-message cases take their red by mutation, borrowing only ADR-0006's technique | "都照建議" |

## Round 2

The owner asked why a no-Git case exists at all ("等等，為什麼會到「沒有 git」的問題？"). It comes from
0003's rule that a target must be tracked by Git, which is the verifier's only reason to run git.
A file that exists but was never committed is still caught: stage 8 runs the verifier in a
`git worktree` checkout of HEAD, which holds committed files only, and every later ticket starts
from a fresh worktree of `main`.

Note added in revision 3: no workflow rule makes every later ticket start from a fresh worktree;
round-1 Ruling R1 drops that claim, and OQ-4 tracks a standing check.

| Q | Question (short) | Recommended | Owner's answer |
|---|---|---|---|
| Q2' | reopen 0003's "tracked by Git" rule | (b) drop it: the check is file-system only and runs no git; tracking is guaranteed by the stage-8 worktree run, written as an acceptance criterion. Round-1 Q2 and Q5 and round-2 Q7 (no-Git reasons) fall away | "都按照建議" |
| Q8 | the narrow grammar's rules | recognise `[text](dest)` and `![alt](dest)`; fail on an unclosed fence, HTML comment, indented line with a link, link reference definition and backslash escape; new reasons `is not a plain repository path` and `uses an unsupported URL scheme`; skip only `http`, `https` and `mailto` | "都按照建議" |
| Q9 | documents to update | `AGENTS.md` build section and the verifier docstring mention license references; nothing about Git; `docs/guide.md` and `runtime.md` unchanged | "都按照建議" |
| Q10 | diff scope and Base B | B is the full SHA in the first Comment; scope by `git diff <B>...HEAD --name-only`; no merge of `main` mid-ticket without the owner's consent, after which B is re-recorded | "都按照建議" |
| Q11 | ADR | `docs/adr/0008-verifier-license-reference-contract.md`: the notices grammar contract and the file-system-only choice; one line in the `docs/README.md` ADR index | "都按照建議" |
| Q12 | epic slug | `0005-license-reference-check` | "都按照建議" |

The owner confirmed the summary of shared understanding: "共識正確，開分支
specs/0005-license-reference-check 並進行 /to-spec。"

## Deferred

- Checking the links in the README `## License` section.
- Comparing each skill's own `LICENSE` text with the `license` value recorded for it.
