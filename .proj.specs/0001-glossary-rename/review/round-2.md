# Round 2 — 0001-glossary-rename

Spec version: spec.en.md 6034e30cbd5e715bf52ddacd5b540f3f8d265093 / traceability.md dba0d74de02dd066104d3812bd5a2979513f39e9
Prompt: `review/prompt.md` replayed verbatim. One `harness-reviewer` per axis. Reports recorded as returned.

## Axis 3 — Contract conflict

總計：P0 0、P1 4、P2 10。reviewer 無 Bash，未核對 blob。已確認無衝突：ADR-0001～0006（ADR-0006 不適用，本 epic 改變行為）；frozen prompt:14 已列兩種檔名；zh-TW 譯本時點；runtime.md:13-15、:20、:105-108、:131；symlink 豁免一致；CLAUDE.md、.claude/agents、.codex、docs/adr 無舊 token；Charter Must-hold #4（只用 stdlib）；User Story 3 與 Author 定義一致；OQ-1、OQ-2 已存在；tune-skills R5 位置正確。

### P1
- **3-1** AGENTS.md:155-156「There is no unit-test suite」與 AC13 矛盾；改寫該句會留下未配對的 removed line，違反 AC3（只豁免 AC6、AC13 新增行）。（信心高）
- **3-2** 測試 seam 與既有 verifier 不相容：`verify(root)` 回傳不含 `FAIL: ` 前綴的字串，前綴、stderr、exit code 由寫死 `ROOT` 的 `main()` 處理；用最小 fixture 跑 `verify()`/`main()` 會因 AGENTS.md、.gitignore、REQUIRED skills、sanitizers、checksum、.codex 等無關檢查失敗，row 16「clean fixture → exit 0」做不到。ticket 須先決定改 `main()` 簽章或只斷言 errors list。（信心中高）
- **3-3** 與 0002 的 glossary 修改順序互斥：0002 寫「0001 未落地則改 CONTEXT.md、由 0001 帶過去」，但 0001 分支固定從 B 起、AC7 要求與 `B:CONTEXT.md` byte-equal；非 0001 先合必有一方 AC 失敗。兩者也都改 skill-sources.json、都新增 scripts/test_*.py。（信心高）
- **3-4** `/teach` 規則放在 teach 不會讀的 docs/agents/domain.md（其範圍是 engineering skills），且與 teach/SKILL.md:12「Treat the current directory as a teaching workspace」相反；spec 禁止改 teach，規則無法生效，User Story 5 達不到。（信心中）

### P2
- **3-5** verifier 強制 GLOSSARY.md 與 domain.md:13「proceed silently」、lazy creation 並存而矛盾（目前檔案存在，不會出錯）。
- **3-6** 分支起點固定為 B，與 hard rule 1、ADR-0005「從 main 開分支」不一致且未明說 override。
- **3-7** stage 8 用人工 agent session，未明說是 hard rule 4 的例外（OQ-1 暫存做法符合 workflow.md:163-164）。
- **3-8** docs/agents/domain.md 由 setup-matt-pocock-skills 的 domain.md 樣板產生；規則只加在產出檔、未記為 local adaptation，重跑 setup 會消失。
- **3-9** Out of Scope 排除編輯 tickets，但又要求把證據寫進 ticket Comments（推測本意為其他 tickets）。
- **3-10** 非 UTF-8 規則與既有讀檔方式不一致：既有 `verify()` 以嚴格 UTF-8 讀 AGENTS.md 等，真實執行會 traceback；row 15 只在 fixture 中可測。
- **3-11** skill-sources.json 新增頂層 `upstream_syncs` 但 `version: 1` 未更新；tune-skills 記為 local adaptation 的語意略有落差（init-template 有前例）。
- **3-12** `scripts/verify-project.py` 也來自 harness-agile 範本，加入專用檢查後的範本同步分歧未記錄（OQ-2 只提 AGENTS.md 與 docs/agents）。
- **3-13** 「workspace」一詞撞名（CONTEXT.md:3 未定義；teach 的 workspace）。
- **3-14** 「AGENTS.md 只凍結 legacy-openspec」不完整：issue-tracker.md:30 已規定 specs 審查後凍結。

## Axis 2 — Verifiability

總計：P0 0、P1 7、P2 15（2-2、2-6 嚴格解讀可能為 P0，交使用者裁定）。reviewer 無 Bash，未核對 blob；依 reflog 推論 PR #4 尚未合併、B 尚不存在。已確認：無模糊用語；AC4、AC7、AC13 可判定；round-1 的 2-2 已修正；`# Context Map` 只在兩棵樹 CONTEXT-FORMAT.md:39；`CONTEXT templates` 只在兩份 tune-skills；teach 無舊 token；`scripts/` 只有 new-deck.mjs 與 verify-project.py。

### P1
- **2-1** 測試 seam 與 verifier 架構不符：`verify(root)` 只回傳 `(names, errors)`，`FAIL: `、stderr、exit code 只在寫死 ROOT 的 `main()`；直接呼叫函式看不到 exit status，走 `main()` 則 minimal fixture 會因既有檢查多出 FAIL，row 16 做不到。（信心高）
- **2-2** row 3 的「project doc」未定義；分支上必改 `docs/agents/skill-sources.json`（AC11 新增 JSON 行）、ticket 檔、可能還有 OPEN-QUESTIONS.md，算入則 AC3 必失敗。（信心中；嚴格可為 P0）
- **2-3** AC3 排除「為 AC6、AC13 新增的行」未指明哪幾行：任何新增行都能宣稱為此而來；反之若改寫既有行（AGENTS.md:155-156「no unit-test suite」、domain.md:5）會留下未配對的 removed line。（信心高）
- **2-4** AC3 檢查程序未固定：無配對規則、無固定腳本、未指定 `-M`（`diff.renames=false` 時整檔變刪除＋新增）。（信心中高）
- **2-5** B 有兩個定義（PR #4 的 merge commit；第一個含 CONTEXT.md 的 commit），merge commit 合併時指向不同 commit，squash 則無 merge commit。（信心中高）
- **2-6** AC8 用 `git diff B...HEAD --stat` 判定「this ticket's commit」造成的變更，三點 diff 會彙總分支上所有 commit；ticket 可能多 commit；OPEN-QUESTIONS、spec 狀態、round-2.md 可能落在同分支。（信心中；嚴格可為 P0）
- **2-7** E2E 要求 `/domain-modeling` 編輯 `GLOSSARY.md`，與 AC7（HEAD 與 `B:CONTEXT.md` byte-identical）、AC12 互斥；未說明編輯須還原或保存什麼證據。（信心高）

### P2
- **2-8** E2E 無 AC 與 matrix row；「add one term」未指定詞；只跑一次；只驗 Claude 樹。
- **2-9** AC6「states both」、AC11「naming both runtimes and the R5 rename」需語意判讀。
- **2-10** AC10 新 verifier 跑 B 的樹需把腳本複製進 B 的 worktree（ROOT 取自 `__file__`）；grep 選項未給；「at HEAD exits 0」未指定 checkout（main checkout 有 0002 未追蹤檔）。
- **2-11** `<line>` 起算、同一行同 token 出現兩次（domain-modeling/SKILL.md:64、improve-codebase-architecture/SKILL.md:68）算幾個 hit、FAIL 行順序未定。
- **2-12** 「empty」定義不清（0 bytes 或純空白；目錄或 symlink）。
- **2-13** 「each forbidden path」測試數不清；`<path>` 格式未定；Python 3.13 起 `rglob` 不跟隨 symlink，版本差異可能重複回報。
- **2-14** `<path>` 是否 repo-relative 未定；AC9 漏「scanning continues」斷言；實機遇非 UTF-8 的 AGENTS.md/CLAUDE.md 會在新檢查前 traceback。
- **2-15** AC9「each not-scanned path」指 row 11 的四項或 Definitions 全清單不明。
- **2-16** `upstream_syncs` 層級、`skills` 完全相等或包含、`date` 寫死、`local_adaptations` 與 `skills.tune-skills.adaptations` 寫入位置易混。
- **2-17** 兩棵樹 CONTEXT-FORMAT.md 內容相同，`git diff -M` 可能跨樹配對。
- **2-18** AC1 的 `grep -rn` 未加 `-F`、完整排除指令未給（實際不會誤判）。
- **2-19** red step 只要求「fail before the check exists」，AttributeError 也算，red 證據可能無意義。
- **2-20** Solution 說「in one commit … and give the verifier a check」，AC12 只涵蓋 rename 類變更。
- **2-21** User Story 2 無可量測 AC。
- **2-22** AC5「relative Markdown link」列舉方式未寫（目前僅 2 個 inline 連結）。

## Axis 1 — Completeness

總計：P0 0、P1 7、P2 13。reviewer 無 Bash。確認：AC1–AC13 與 22 列 matrix 雙向對應；舊 token 位置與預期一致；CLAUDE.md、README.md、docs/guide.md、.claude/agents、skill-sources.json 無舊 token；`docs/agents/skill-tuning/` 目前不存在。第 1 輪 1-1～1-15 大多已在 revision 2 處理。

### P1
- **1-1** 同一行多命中無 row：同行兩種 token（wait-what .claude:7/.agents:6、domain.md:10、setup-matt-pocock-skills 多處）、同行同 token 兩次（domain-modeling:64、improve-codebase-architecture 多處）；三種回報粒度都能過 AC9；AC10 以 `grep -n` 的「行」為單位，與 row 9 的 (path, line, token) 不一致。（信心高）
- **1-2** 非 UTF-8 缺「掃描根類型」維度：既有 `verify()` 以嚴格 UTF-8 讀 AGENTS.md、CLAUDE.md、SKILL.md（:33-34、:69），整支 verifier 會 traceback；只測新函式時 AC9 仍通過。（信心中高）
- **1-3** 測試 seam 與 row 9–16 的 stderr/exit 預期不符（同 axis 2 的 2-1）；新函式回傳契約未定；AC10 執行方式受 ROOT 寫死影響。（信心中高）
- **1-4** AC13／AC6 新增內容與既有行衝突（AGENTS.md:155-156；AGENTS.md:150-152 描述 verifier 只驗 harness plumbing），AC3 豁免不夠；改寫既有行或段落重排都產生未配對刪除行。（信心高）
- **1-5** row 3 的「project docs」未定義（skill-sources.json、OPEN-QUESTIONS.md 歸屬不明）。（信心中）
- **1-6** E2E 無 matrix row 與 AC；Codex 樹無行為驗證。（信心中）
- **1-7** 落地（merge 回 main）邊界無 row：若 main 在 B 之後改過 CONTEXT.md（0002）或新增檔案，merge 後 GLOSSARY.md 內容、rename/modify 衝突、main 上 verifier 是否 exit 0 皆未規範。（信心中低，可視為 P2）

### P2
- **1-8** row 11 只覆蓋 4 種不掃描路徑；`docs/legacy-openspec/`、`.proj.specs/`、`.proj.tickets/`、`scripts/`、skill 內 `node_modules/`、非 .md 檔、「every other path」未測；AC1 未排除 node_modules。
- **1-9** row 9 未列 `docs/agents/` 子目錄與 skill 內遞迴子目錄。
- **1-10** row 13 邊界不完整（目錄、symlink、純空白、非 UTF-8；根目錄 `GLOSSARY-MAP.md`）。
- **1-11** row 14 邊界不完整（shared skill、node_modules、深層路徑、symlink 重複回報；darwin 大小寫不敏感使 `context.md`／`glossary.md` 讓存在判斷成立；非根目錄 `CONTEXT.md`）。
- **1-12** verifier 抓不到 R4／R5 回歸，且未說明排除理由。
- **1-13** User Story 5 只由 AC6 文字檢查，teach 不讀 domain.md，未驗證；User Story 2 無 row。（可升 P1）
- **1-14** 流程證據無 AC（Comments 保存、乾淨 worktree、測試檔名、exit-code 契約不變）；0002 的測試會被同一 discover 指令撈到。
- **1-15** Out of Scope 的 `skills-lock.json` 無 AC 保護（row 21 說 AC3 涵蓋，但不成立）。
- **1-16** row 12 缺新 token 不命中、子字串正向案例（`CONTEXT.mdx`、`./src/x/CONTEXT.md`）。
- **1-17** 讀取失敗只定義解碼錯誤，OSError 未處理。
- **1-18** skill 根目錄下的散檔是否掃描未歸類。
- **1-19** AC8 單數「this ticket's commit」；Out of Scope「Editing … tickets」與寫入 Comments 的語意需釐清。
- **1-20** `<line>` 起算與輸出排序未定。

## Axis 4 — Red team

總計：P0 0、P1 3、P2 18。reviewer 無 Bash，未核對 blob。已確認掃描範圍外無其他舊 token；使用者層級無 domain-modeling。
意圖內後果：所有指向改為 GLOSSARY.md；舊檔名重現時 verifier 失敗；verifier 在 B 上失敗；template 同步時 verifier 列出每處（OQ-2）；接受與 /teach 同名；shared skill 不掃描；verifier 只讀檔。

### P1
- **4-1** 若 0002 先 land，0001 分支為解 skill-sources.json 衝突而 merge main：AC7 byte-equal 失敗，`git diff B...HEAD` 把 0002 變更算入使 AC3/AC4/AC8 假失敗；不 merge 則 AC10 只在缺少 main 新 commit 的樹上成立，merge 後無 AC 要求重跑 verifier。分支從 B 起與 ADR-0005 不同。（信心中高）
- **4-2** `/teach` 防護只有 domain.md 一句話，teach 不讀 domain.md 且 SKILL.md:12 把 cwd 當教學工作區；Claude Code 的 cwd 通常就是 repo root；改名後 /teach 會直接寫進專案 glossary（本 epic 新造成的寫入目標）；verifier 只檢查非空，偵測不到內容被換成 teach 格式。（信心中）
- **4-3** E2E 在 ticket worktree 讓 `/domain-modeling` 新增詞彙，未規定還原或與 AC7 的先後；假詞可能被 commit 污染專案 glossary，或 AC7 失敗。（信心中）

### P2
- **4-4** shared 由 symlink 形狀推導；skills CLI 的 symlink 安裝模式會讓非 shared skill 變成該形狀而脫離掃描；AC4 未禁止其他 skill 變 symlink；forbidden-path 只抓 domain-modeling。
- **4-5** AC3 只豁免 AC13 新增行，AGENTS.md「There is no unit-test suite」無法修改，常駐指示自相矛盾。
- **4-6** AC6、AC13 新增行無行數或內容限制，可夾帶任意指示。
- **4-7** 對 verify-project.py 的修改只約束 exit-code 契約；無 AC 要求既有檢查（security-review checksum、Codex config、invocation policy）保持不變，可能靠放寬既有檢查達成 exit 0。
- **4-8** 子字串比對無豁免；vendored 第三方 .md（如 checksum 鎖定的 upstream-security-review.md）日後合法提到 `CONTEXT.md` 會死鎖。
- **4-9** verifier 未接任何自動 gate（CI 只有 release 時的 deploy-pages），「不會悄悄重新引入」只在有人手動執行時成立。
- **4-10** R4、R5 不是 stale token，日後回改抓不到。
- **4-11** tune-skills keep list 改為「GLOSSARY templates」後字面也涵蓋 teach/GLOSSARY-FORMAT.md，意外擴大禁止調整範圍且語意不清。
- **4-12** domain-modeling 為 model 自動觸發，description 改為「writing or editing a GLOSSARY.md」後，teach session 編輯教學 GLOSSARY.md 也符合觸發條件。
- **4-13** setup-matt-pocock-skills 以 seed 範本重寫 docs/agents/domain.md，重跑會刪掉 AC6 規則，verifier 不檢查。
- **4-14** worktree 位置未規定；`.claude/worktrees/` 在主 checkout 內，Claude Code 向上載入 CLAUDE.md，會同時看到主 checkout 仍寫 CONTEXT.md 的 AGENTS.md。
- **4-15** E2E 只驗 Claude 樹。
- **4-16** AC8「made by this ticket's commit」只約束單一 commit，其他 commit 改到 docs/adr 或 .proj.specs 不會擋。
- **4-17** glossary 檢查只看存在且非空，空白檔、指向 repo 外的 symlink、teach 格式內容皆可通過。
- **4-18** 只掃 *.md，Codex `agents/openai.yaml` 與 skill 內 .html 模板中的舊 token 回歸抓不到（目前無）。
- **4-19** macOS APFS 大小寫不敏感，同一棵樹在不同平台 verifier 結果不一致。
- **4-20** 名為 `*.md` 的目錄或無法讀取的檔案丟 OSError，verify() 無 try，會 traceback。
- **4-21** lock 中 7 個 skill 的 computedHash 仍為改名前上游值，skills CLI 可能持續提示更新，引誘覆蓋 local adaptation 或改為 symlink 安裝。

補充（未評等）：檔名含換行或控制字元可偽造 `FAIL:` 輸出行，需已有寫入權限，風險極低。

## Adjudication (author, 2026-10-16)

- **Gate:** zero P0 after round 2. The four borderline items (0001: axis 2 items 2-2 and 2-6; 0002: axis 1 item 1-1 / axis 4 item 4-1, and axis 2 item 2-4) are ruled **P1**, to be fixed in ticket acceptance criteria:
  - 0001 "project doc" = the row 5 file set only; 0001 AC8 is judged with `git log B..HEAD -- <paths>` showing no commit.
  - 0002 AC5 applies only to descriptions whose rewrite the author approves; a rejected or reverted description stays as at V and is recorded deferred.
  - 0002 baseline = the version in the commit that first adds it, with that commit's SHA recorded.
- **Order:** epic 0001 lands on `main` first; epic 0002's branches start from `main` after that.
- **`/teach`:** add a one-sentence local adaptation to `teach/SKILL.md` in both trees so the repository root is not used as a teaching workspace; record it in `docs/agents/skill-sources.json`. This overrides 0001 AC3 for that sentence.
- **0002 stage 8:** one manual smoke test in a fresh session with the rewritten skills: three representative requests (explicit style, context selection, missing context), once each, judged against each case's allowed outcomes. No before/after comparison.
- All other P1 findings are carried by the tickets; P2 findings are recorded here and block nothing.
