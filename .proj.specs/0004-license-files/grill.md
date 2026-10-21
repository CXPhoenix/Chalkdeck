# Grill record — 0004-license-files

Stage-1 questions put to the repository owner (CXPhoenix) and the answers, quoted. Earlier decisions
carried over from epic 0003 are in `../0003-license-split/` (traceability revision 2, round-1 and
round-2 rulings).

## Round 1 (2026-10-21)

| Q | Question (short) | Recommended | Owner's answer |
|---|---|---|---|
| Q1 | agent-browser `SKILL.md` lines 12–13 point at "LICENSE … in the project root" | (a) point at the skill's own LICENSE in both trees, note it in `local_adaptations` | "Q1 a" |
| Q2 | where the open-slide and K-Dense copyright lines and MIT text go | (a) in the notices, MIT text once | "Q2 a" |
| Q3 | open-slide scaffold text in `README.md` and `AGENTS.md` | (a) attribute to open-slide (MIT, Yiwei Ho); later changes follow the table | "Q3 a" |
| Q4 | catch-all scope | widen to logos, trademarks, photographs, screenshots, illustrations, quotations and code | "照建議" |
| Q5 | rule for agents adding someone else's material | add a line to `AGENTS.md` slide hard rules | "照建議" |
| Q6 | the two challenge `.zip` archives | (a) CC BY-SA by the directory rule; list members without extracting | "Q6 a" |
| Q7 | init-template leftovers and `verified_on` | keep line 23, remove `local_adaptations.init-template`, update `verified_on` | "照建議" |
| Q8 | ADR index in `docs/README.md` | add ADR-0007; verifier descriptions belong to 0005 | "照建議" |
| Q9 | glossary terms | add Repository owner and Reuser; Charter unchanged | "照建議" |
| Q10 | which open-slide version the notices cite | 2.2.0 per `package.json` | "最新版為準，目前最新版應該是 2.2.0，但是看作者的社交媒體，似乎又會改版" |

## Round 2 (2026-10-21)

| Q | Question (short) | Recommended | Owner's answer |
|---|---|---|---|
| Q11 | keeping the open-slide entry true across upgrades | (a) no version in the notices; check the copyright line after `pnpm up` | "Q11 a" |
| Q12 | class of each asset file (table of 11 rows covering 19 files) | as proposed; four rows asked the owner for a source | "Q12 照建議" |

For Q12 the owner gave no source for `fhsh/section-img.png`, `isip-hs/section-img.png`, the two
`slogon.svg` and the speaker photo, so they are third-party with holder unknown by the agreed rule.
Separately, on the speaker photo and chat screenshot: "#3 都接受，都確認合法合規".

## Review round 1 rulings (2026-10-21 and 2026-10-22)

| Finding | Question (short) | Owner's answer |
|---|---|---|
| 3-1, 1-4, 4-4 | T10 vs ADR-0004's deck track | "列為輕量軌例外" |
| 4-3 | `slides/getting-started/` and `open-slide.config.ts` come from the scaffold | "列為 open-slide 作品" |
| 4-1, 4-2 | the owner's changes to third-party skills | "你的改動屬 MIT" |
| all other round-1 findings | dispositions as proposed | "照建議處置" |
| 4-18 | `LICENSE` source: 0x1dea copy or the CC official legalcode.txt | "CC 官方 legalcode.txt" |
