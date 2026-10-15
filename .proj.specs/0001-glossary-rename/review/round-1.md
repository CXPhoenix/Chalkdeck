# Round 1 — 0001-glossary-rename

Spec version: spec.en.md 3f938a737a85d8f6e5ae47c27d0d4ecbda4ab798 / traceability.md 380be484e664d565dcce393b2bc1b443adba548a
Prompt: `review/prompt.md` (frozen). One `harness-reviewer` per axis. Reports recorded as returned.

## Axis 1 — Completeness

總計：P0 0、P1 6、P2 8。AC1–AC11 皆至少有一列對到。reviewer 無 Bash，未核對 blob。

### P1
- **1-1** spec 宣稱掃描路徑與排除規則以 matrix 為準（spec.en.md:36-37），但 matrix 未寫掃描根目錄與「跳過 shared skills」（只在 spec 47-51）；「有 token 但既不掃描也不凍結」的路徑無 row（`.proj.specs/*/review/prompt.md`、spec 本身、README.md、docs/guide.md、docs/security/、.claude/agents/、.codex/、.proj.tickets/）。照 matrix 掃全 repo 會讓 AC9 失敗；反之在 .claude/agents 或 README 寫回舊 token 不會被抓。（信心高）
- **1-2** AC8 只要求埋一個 token；{6 類掃描根 × 3 token} 組合未覆蓋；`CONTEXT-MAP.md` 不含 `CONTEXT.md` 子字串，只掃 skill tree 或只比對 `CONTEXT.md` 的 verifier 都能通過。（信心高）
- **1-3** `CONTEXT templates` 無 AC 驗證已改名（tune-skills 兩份：.claude:54、.agents:50）；AC11 只限制 diff、不要求替換發生；verifier token 清單也不含 `CONTEXT templates` 與 `# Context Map`。（信心高）
- **1-4** 第 12 列「concept words → exit 0」未出現在 AC8；verifier 誤抓 `context`、`single-context` 或不分大小寫比對時 AC8 抓不到。（信心高）
- **1-5** AC10 的 provenance 記錄位於 docs/agents/（受 AC5 與 verifier 約束），自然寫法引用上游 commit 標題會含舊 token → AC5/AC9 失敗；matrix 無對應 row。（信心中）
- **1-6** 舊檔名重新出現（內容不含 token 的 `CONTEXT.md` 或 `CONTEXT-FORMAT.md` 檔）不在 verifier 邊界內，兩份 glossary 可並存。（信心中）

### P2
- **1-7** 專案文件中的 concept words 與非 token 內容無保護（AC3 只涵蓋 skill tree、AC11 只涵蓋 skill 檔；docs/agents/domain.md:5、10、11、28）。（若 Out of Scope 屬硬性約束可升 P1）
- **1-8** verifier 對 shared skill 的行為無 row；`.agents/skills/<shared>/` 實體目錄是否跳過未交代。
- **1-9** verifier 輸入邊界缺 row：多個命中逐一回報、大小寫與子字串變體、非 UTF-8／二進位檔、`GLOSSARY.md` 為目錄或 symlink。
- **1-10** AC9 的 red step 與 AC6 的 `git log --follow` 無 row 對到。
- **1-11** 大寫 Context 字樣未歸類（格式檔 `{Context Name}`、`**Single context**`、`**Multiple contexts**`、`## Contexts`；setup-matt-pocock-skills/domain.md:26）。（信心低）
- **1-12** skill 檔內連結解析邊界缺 row（domain-modeling/SKILL.md:62 的格式檔連結；格式檔 43-45 行的示意連結應標註豁免）。
- **1-13** 第 6 列「open-slide shared skills」與 AC4 名單不一致（scientific-visualization、seaborn 來源為 k-dense-ai；new-deck 為 local）；固定名單與動態推導日後可能分歧。
- **1-14** 前置條件（PR #4 未合併、CONTEXT.md 尚無提交歷史）無 row。（信心低）
- **1-15** AC8 測試的存放位置、是否提交、能否重跑未交代。（信心低）

軸外順帶（未評等）：AC3 計數方式（word boundary？）、AC10 寫入鍵、AC6「body」定義；`GLOSSARY.md` 與 improve-codebase-architecture/HTML-REPORT.md:42、123 的「glossary」撞名。

## Axis 3 — Contract conflict

總計：P0 0、P1 3、P2 9。reviewer 無 Bash，未核對 blob。已確認無衝突：ADR-0001～0005（ADR 內文無舊 token）、workflow／issue-tracker 的 stage 2 gate、language.md:38（zh-TW 譯本審查後才產生）、兩棵樹一起改（runtime.md:13-15）、skills-lock 排除（runtime.md:20-21）、verifier 已跳過 shared skills、AC4 名單與實際 symlink 一致、`.claude/agents`、`.codex/`、README、docs/guide.md、CLAUDE.md 無舊 token；舊 token 位置與 spec 預期一致。

### P1
- **3-1** `teach` skill 早已使用 `GLOSSARY.md`（兩棵樹的 teach/GLOSSARY-FORMAT.md:1-3「canonical language for this teaching workspace」、LEARNING-RECORD-FORMAT.md:41、SKILL.md:12），語意不同。改名後兩個 skill 的 GLOSSARY-FORMAT.md 同名異格式，repo 根目錄的 `GLOSSARY.md` 會被兩個 skill 各自當成詞彙表；作者在 repo 根目錄跑 `/teach` 可能把教學詞彙寫進專案 glossary。spec 與 AC 未提及 teach。（信心中；作者是教師，實際踩到機率不低）
- **3-2** AC10 的 provenance 紀錄與 tune-skills／0002 的審查報告都位於 `docs/agents/`，必然引用舊文字，與「docs/agents/ 不得有舊 token」互斥（runtime.md:20-21；tune-skills:63-64；0002 AC13）。（結構衝突信心高）
- **3-3** spec 未說明 stage 8 的實際 surface 與 harness；verifier 自述只做靜態檢查（verify-project.py:128）；無非瀏覽器 harness 的 ADR 或 OPEN-QUESTIONS.md（hard rule 4；workflow.md:145-164；runtime.md:132-133）。（信心中）

### P2
- **3-4** verifier 寫死根目錄必須有 `GLOSSARY.md`，排除 domain.md:13（不存在時 proceed silently）、multi-context 佈局與延遲建立；本 repo 為 single-context，目前不會壞。
- **3-5** AC10 把 harness 自有的 tune-skills（skill-sources.json:92-101，project origin）與 mattpocock upstream `d80fa0f` 記在同一筆，provenance 混淆。
- **3-6** 稱 8 個 shared skill 為「open-slide」不精確（new-deck 為 local；scientific-visualization、seaborn 來自 k-dense-ai）。
- **3-7** 「docs/adr/ 凍結」是本 spec 默默新增的規則（AGENTS.md 只凍結 legacy-openspec；domain-modeling 允許編輯 ADR），應寫明為本 epic 自訂排除。
- **3-8** 排除清單未提 `.proj.specs/`；兩份 frozen prompt.md:14 含 `CONTEXT.md`，若擴大掃描須改 frozen prompt，違反 ADR-0003。
- **3-9** 黑箱測試存放位置未定；`tests/` 在 harness 語意上是 template 初始化測試（runtime.md:131-132；tune-skills:71-73），AGENTS.md 寫「no unit-test suite」。
- **3-10** 只處理 mattpocock upstream；AGENTS.md 與 docs/agents 的 upstream 是 harness-agile（template-source.json），若其仍用 `CONTEXT.md`，日後同步會讓 verifier 失敗。（信心低）
- **3-11** 0001 AC10 與 0002 AC15 都改 skill-sources.json，順序未定，可能 merge conflict；0002 報告會被 0001 verifier 掃到。
- **3-12** User Story 3 把 agent 與 Author 分開，與 CONTEXT.md:8-11 的 Author 定義不一致。

## Axis 2 — Verifiability

總計：P0 0、P1 9、P2 11（2-2 依凍結標尺嚴格解讀可能為 P0，交使用者裁定）。reviewer 無 Bash，未核對 blob。確認：AC4 的 8 個 shared skill 與實際 symlink 名單一致；`# Context Map` 兩棵樹各出現一次；掃描範圍外無其他舊 token；AC 無模糊用語。

### P1
- **2-1** 「變更前」基準未指定 Git ref（AC1、AC3、AC6、AC9、AC11 與 AC4／AC7 的 `git diff`）；若基準早於 PR #4，AC6 無法通過。建議明定為 PR #4 合入 main 後的 `git merge-base main HEAD`。（信心高）
- **2-2** AC4、AC7 的不帶參數 `git diff` 在 commit 後恆為空，照字面恆真。建議 `git diff <base>...HEAD -- <paths>`，並涵蓋 shared symlink 本身。（信心高；可能 P0）
- **2-3** AC3 計數方法未定義（整字或子字串、行數或次數、是否跟隨 symlink）；`per-context`（setup-matt-pocock-skills/SKILL.md:61）不在詞表；計數相等只代表淨值不變。（信心高）
- **2-4** `CONTEXT templates`（tune-skills .claude:54、.agents:50）無 AC 檢查改名；AC10 卻把 tune-skills 列為受影響 skill。（信心高）
- **2-5** traceability 第 12 列「concept words 不觸發」歸到 AC8，但 AC8 無此案例；大寫 `Context`、裸 `CONTEXT` 等邊界未判定。（信心中）
- **2-6** AC8 量詞太寬：未要求三個 token 各測（`CONTEXT-MAP.md` 不含 `CONTEXT.md` 子字串）、未要求每個掃描根各測、未測跳過 shared skill 與多處命中；只掃 .claude/skills 的實作也能通過。（信心中）
- **2-7** scratch copy 建立方式未說明：預設 `copytree(symlinks=False)` 會把 shared skill 變實體目錄，8 個 shared skill 缺 openai.yaml 會讓 verifier 因無關原因失敗。建議保留 symlink 並先跑未植入的對照組。（信心中）
- **2-8** AC9 後半未說用哪版 verifier（舊 verifier 跑舊 repo 會 exit 0）與要留何證據。（信心中）
- **2-9** 黑箱測試位置與是否 commit 未寫；repo 無 `tests/`，coverage 表無實體測試可指，User Story 4 的防回歸本身無回歸測試。（信心中）

### P2
- **2-10** 移除 glossary 時 traceback 的 `FileNotFoundError: …GLOSSARY.md` 也字面滿足「names GLOSSARY.md」；建議要求 `FAIL:` 開頭並指定輸出串流。
- **2-11** verifier 比對語意與輸出格式未定義（大小寫、子字串或邊界、相對或絕對路徑、stdout 或 stderr）。
- **2-12** AC10 的 entry 位置（`skills.<name>.adaptations`、`local_adaptations`、`runtime_trees`）與日期格式未定義；skill-sources.json:23 慣例為未標 runtime 視為 Codex。
- **2-13** AC10 與 AC5／verifier 可能互斥（skill-sources.json 位於掃描範圍）。
- **2-14** AC6「body」與「shows the earlier history」判定門檻含糊。
- **2-15** AC5「relative link」判定方式未寫（目前僅 AGENTS.md:38、docs/README.md:29 兩處 inline link）。
- **2-16** AC2 的「map heading」其實位於 fenced code block 內（CONTEXT-FORMAT.md:38-39），嚴格解析下不是 heading。
- **2-17** 非 UTF-8 檔案處理未寫，解碼失敗會丟例外。
- **2-18** AC1 涵蓋 shared skill 但 verifier 跳過；「open-slide shared skills」與 AC4 名單來源不一致。
- **2-19** User Story 2「apply cleanly」無對應 AC 或代理指標。
- **2-20** AC9 的 exit 0 也取決於既有無關檢查（security-review checksum、.codex 設定）。

## Axis 4 — Red team

總計：P0 0、P1 5、P2 9。reviewer 無 Bash，未核對 blob。意圖內後果：所有指向改為 `GLOSSARY.md`、舊 token 回歸時 verifier 失敗、rename 保留歷史、ADR 與 legacy 不動；verifier 只讀檔，無新的跨 trust boundary 執行面。

### P1
- **4-1** 根目錄 `CONTEXT.md` 復活（舊 skill catalog 的 long-running session 依舊版「lazily 建立 CONTEXT.md」，runtime.md:132-133；或其他 worktree）時 verifier 偵測不到，形成兩份分歧 glossary；AC6 只在交付當下成立。（信心高）
- **4-2** 若 skill 改名與 `git mv CONTEXT.md GLOSSARY.md` 拆成不同 ticket，過渡期 lazy creation 可能產生空的 `GLOSSARY.md`，之後搬檔撞名，AC6 的 `--follow` 與 byte-identical 失敗。（信心中）
- **4-3** verifier 會被自己的 provenance 紀錄（AC10）與 `docs/agents/skill-tuning/` 審查報告觸發；歷史紀錄類文件無豁免，否則逼作者避寫舊檔名，反而違背 User Story 2。（信心中）
- **4-4** 「every regular file」未定義編碼與 binary 處理：磁碟上的 `.DS_Store`、`.pyc` 用 UTF-8 讀會丟 UnicodeDecodeError，掃描段無 try/except（verify-project.py:96-116 才有）；改成略過或 `errors="ignore"` 則成為 bypass。（信心中高）
- **4-5** 與 0002 尚未 commit 的 style skills 互相干擾：它們缺 openai.yaml，磁碟上 verifier 必然失敗；實作者為達成 AC9 可能把 0002 檔案掃進 0001 分支（違反 hard rule 1 與 0002「Vendoring first」）；AC3 計數基準會被 0002 的 re-tune 改動漂移。（信心中）

### P2
- **4-6** 子字串過度匹配且無豁免機制（「formerly CONTEXT.md」等正當提及會被擋）。
- **4-7** 硬性要求根目錄 `GLOSSARY.md` 且只檢查存在；multi-context 佈局會被判失敗，空檔即可通過，agent 可能直接 touch 空檔。
- **4-8** shared 豁免依 symlink 形狀判定而非歸屬；任何 skill 改成該形狀的連結即脫離檢查（如 skills CLI 以 symlink 模式安裝）；AC1 不排除 shared，verifier 卻排除。
- **4-9** 掃描範圍漏洞：README.md、docs/guide.md、docs/*.md、docs/security/、.claude/agents/、.codex/agents/、.proj.tickets/；`CONTEXT templates` 與 `# Context Map` 不在 verifier token 中。
- **4-10** 掃描磁碟而非 Git 追蹤內容；archify 目錄內 `npm install` 產生的 node_modules 會被逐檔掃描，可能誤判。
- **4-11** scratch copy 未限定範圍（會複製 .env、.proj.handoffs、worktrees、node_modules）；測試放 `tests/` 會改變 tune-skills 行為，放在掃描路徑內會讓 verifier 自己失敗。
- **4-12** AC10 把 project-origin 的 tune-skills 記在上游 `d80fa0f` 同步紀錄，可能被同步工具誤覆蓋。
- **4-13** 未考慮 harness-agile 範本這個上游；範本若未跟進，日後同步會失敗或衝突。
- **4-14** domain-modeling description 不再含 `CONTEXT.md`，習慣用語觸發機會降低；舊 handoff、ticket、spec 中的 `CONTEXT.md` 參照會懸空。

## Parent 註記（事實查核，非 reviewer finding）

- 3-1（teach 已使用 `GLOSSARY.md`）：上游 mattpocock/skills 現況同時存在 `skills/productivity/teach/GLOSSARY-FORMAT.md` 與 `skills/engineering/domain-modeling/GLOSSARY-FORMAT.md`，repo 根目錄也有 `GLOSSARY.md`。這個撞名在上游已存在，並非本 spec 引入；上游以 teach 的「current directory 為教學工作區」區隔兩者。是否接受同名，交作者裁決。
