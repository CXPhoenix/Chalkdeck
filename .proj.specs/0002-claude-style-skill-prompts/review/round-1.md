# Round 1 — 0002-claude-style-skill-prompts

Spec version: spec.en.md 2fb4f755aff8182ba26379511151cf165e231df6 / traceability.md 5ad105673f8886c0300e867f000ec5d55f3b6ab2
Prompt: `review/prompt.md` (frozen). One `harness-reviewer` per axis. Reports recorded as returned.

## Axis 2 — Verifiability

總計：P0 4、P1 9、P2 7。reviewer 無 Bash，未以 git hash-object 核對 blob（parent 已於派送時計算並列於上方）。

### P0
- **2-1** AC10 未定義如何從自由文字輸出判定 branch；branch 名稱只存在於 references 的 metadata（choice-examples.md:3、context-examples.md:4-5 明言不輸出）；settings format 未列舉為 none/YAML/JSON。（spec.en.md:109-111、77-82；traceability.md:26；信心高）
- **2-2** AC10 要求 selected style 前後一致，但 router 刻意允許 `multiple_anchors` 案例選 jobs 或 gates 任一（context-examples.md:17-20、26；SKILL.md:79-81），且每邊只跑一次，行為未變也可能失敗；Further Notes 的回退規則可能誤退無辜 hunk。（信心高）
- **2-3** 部分 fixed case 無可執行輸入：unavailable-example 需「讀不到定義」的條件，repo 內無法自然製造；material-boundary.md:10-17 只有 metadata；choice-examples.md:25-28 `resolved` 是後續回合，需多輪設定；traceability:26 的分類與 references 無一對一案例。（信心高）
- **2-4** AC12「touches a keep-list item」未定義；spec（58-61）與 traceability 第 15 列的 keep list 不一致；「meaning of every reference example」需語意判斷；keep-list 的明確核准如何與 AC8 一般核准區分未寫。（信心中，若改為以檔案／章節判定可降為 P1，需使用者裁決）

### P1
- **2-5** AC5「third person」「when to use」未給判定方式；現行 description 皆為祈使句。（信心中）
- **2-6** AC11 只要求報告列出位置，未驗證規則仍然存在；章節名稱與實際標題不完全對應（wangxing 為 "Identity and identifying core"；material boundary 對應 "Caller instructions and supplied material"）。（信心高）
- **2-7** AC9 未定抽取範圍與方法（SKILL.md 反引號、references JSON/YAML、core-rule.md 的 "Rule ID:" 行）；集合相等無法證明 core/adjustable 歸類未變。（信心高）
- **2-8** AC8 未規定 hunk 如何標註 finding ID；修訂過的 hunk 是否重新核准未寫；「cites」的引用粒度未定義。（信心中高）
- **2-9** AC16 的 behaviour-changing 分類由實作方決定且不留紀錄，可空洞通過；「the report」指哪份未明。（信心中）
- **2-10** AC1「author's supplied files」無固定基準（untracked、lock 的 ref 為 main、computedHash 範圍不明）。（信心中高）
- **2-11** AC1「first commit of this epic」與 AC3「vendoring commit」可能指向不同 commit（spec commit 可能先於 vendoring）。（信心中）
- **2-12** grep 檢查必然命中內容相同的 Codex 副本，與 AC3 互斥，只能靠詮釋「relying on」脫身；此檢查無對應 AC。（信心高；從嚴可升 P0）
- **2-13** 探測環境未指定：模型與 effort、明確呼叫或靠 description 自動觸發（後者才測得到 description 改寫）、pre-rewrite 副本放置方式、使用者層級 CLAUDE.md 是否載入。（信心中高）
- **2-14** 「只重跑 affected cases」未定義，AC10 最終證據可能混合不同 patch 狀態。（信心中）

### P2
- **2-15** AC15 未指定 skill-sources.json 的寫入鍵；tune-skills 第 6 步更新 `claude_tuned_for` 會覆蓋全樹 audit 的 report 路徑。
- **2-16** AC6「body」與 Testing Decisions「line count」用詞不一（是否扣 frontmatter）。
- **2-17** AC7「relative link」範圍不明（styles.md:15-20 的 YAML 路徑字串）。
- **2-18** AC5 的 1,024 字元計算方式（字元或 UTF-8 bytes）與 XML tag 判定 pattern 未寫。
- **2-19** AC13 路徑 `<model>` 字串未明寫。
- **2-20** AC10 probe log 格式未指定（issue-tracker.md:18 的 reports 為 HTML）。
- **2-21** User Story 2「reliably and cheaply」無 AC 驗證。

無發現：AC2、AC4、AC14。

## Axis 4 — Red team

總計：P0 0、P1 10、P2 7。reviewer 無 Bash，未核對 blob；ADR 只確認清單。
意圖內後果（非 finding）：五個 skill 在兩個 runtime 皆可隱式呼叫，description 每回合進入 context；兩棵樹刻意分歧。

### P1
- **4-1** spec 納入 tune-skills step 6，會更新 `runtime_trees.claude_tuned_for`，以只涵蓋五個 skill 的報告覆蓋 2026-09-26 全樹稽核紀錄，誤導日後判斷。建議明寫不改該欄位，只加 adaptation 註記。（spec.en.md:51-53；tune-skills SKILL.md:86-88；skill-sources.json:10-16；信心高）
- **4-2** spec 的 behaviour 定義（asks/selects/writes/refuses）比 tune-skills 的觸發條件（delegation、stopping points、writes or runs）少了 runs/delegation/stopping points；讓模型 WebFetch core-rule.md 中外部 URL 的 hunk 會跳過 reviewer，新增對外連線與 prompt-injection 面。「No shell, local filesystem or connected MCP service is assumed」（gates SKILL.md:111；router SKILL.md:37-40）不在 keep list。（信心高）
- **4-3** 歸屬聲明與來源紀錄不在 keep list 也不在 AC11：「not a quotation or official creator method」（gates SKILL.md:38-39；jobs SKILL.md:34）、「Creator identity: 張忘形, not 王興」（wangxing core-rule.md:5）、source URL 與 reading limits（gates core-rule.md:25-48）。精簡改寫可能刪除，造成對真實人物的錯誤歸屬；traceability 第 15 列 keep list 也比 spec 少。（信心高）
- **4-4** AC5 必然改寫五個 description，但 probe 只測呼叫後的 branch、不測觸發；可能搶走 create-slide／create-theme 的請求，或讓 style skill 直接觸發而繞過 router 的歧義追問（choice-examples.md:7-11、31-32）。觸發層無驗收出口。（信心中）
- **4-5** probe 未規定呼叫方式、tool allowlist、permission mode、工作目錄、舊版放置方式、model/effort；fixed case 可能觸發 create-slide 在 `slides/` 寫檔或啟動 dev server；headless 無法互動授權，實作者可能改用 permission bypass 旗標（違反 runtime.md:50-51）；就地還原中斷會留下混合狀態。（信心高）
- **4-6** unavailable 分支在 repo 內跑不到（jobs-style 實際存在，前後都 deliver 而假一致）；multiple_anchors 案例允許任一 → 誤判；單次抽樣太弱。（信心中）
- **4-7** grep 規則必命中 Codex 副本與規格文件，導向改 Codex（違反 AC3）或回退全部 hunk。（信心高）
- **4-8** probe log 存入會 commit 的 reports/，headless 輸出可能含 cwd 本機路徑、session id、CLAUDE.md 內容（runtime.md:135-136）；未規定遮蔽或摘要。（信心中）
- **4-9** main session 自行裁決 reviewer finding，AC16 只要求列出 rejected；違反「finding 不經過濾送到使用者、由使用者裁決」（claude-orchestration.md:29-32；review.md:60-62）。（信心中）
- **4-10** keep list 是否被觸及由實作者自判，報告不標記；逐一核准下「明確核准」與一般核准無異，作者可能不知情地核准改動 material boundary（防 prompt-injection）。（信心中）

### P2
- **4-11** lock 為 `ref: main` 未釘 commit；安裝工具若以 symlink 模式更新，Claude 調校會被覆蓋且 verifier 視為 shared 豁免而通過。（信心低）
- **4-12** 未要求記錄五個 skill 的授權（skill-sources.json:8）。（信心中）
- **4-13** description 無「不得變長」限制，與 user story 2「cheaply」牴觸。（信心中）
- **4-14** Codex `interface.short_description` 為新寫文字，與 user story 6 輕微衝突且未經審查。（信心中）
- **4-15** 報告檔名 `<YYYY-MM-DD>-<model>.md` 可能與同日全樹 tune-skills 撞名。（信心低）
- **4-16** 「one reviewer pass」與「no P0/P1 open」並存，修正後的 hunk 不再被審。（信心中）
- **4-17** AC1 byte-for-byte 無外部雜湊對照基準。（信心低）

備註：harness 標記此報告含 permission bypass 旗標字樣；該字樣出現在 4-5 的風險描述中，是 finding 而非指示。

## Axis 3 — Contract conflict

總計：P0 0、P1 5、P2 12。reviewer 無 Bash，未核對 blob。無衝突：ADR-0001/0002/0003/0005、model names 規則、報告路徑、AC5/AC6 與官方指南、router 連到 6 個 references、SKILL.md 英文；repo 內無其他檔案讀取 `style_id` settings。

### P1
- **3-1** 只改 Claude 樹的行為變更與 runtime.md:11-14「port a behavior change to the other tree deliberately」衝突；spec 預期有 behaviour-changing hunk，但 AC3 禁止 Codex 變更，且與 User Story 5 矛盾。需二擇一：禁止行為變更 hunk，或明文聲明不移植並記錄。（信心高）
- **3-3** 採用 tune-skills step 6 會覆寫 `claude_tuned_for`（skill-sources.json:10-16）；未標 runtime 的 adaptation 依 :23 會被視為 Codex 樹的。（信心高）
- **3-5** 模板工作「keeps every gate」（ADR-0004:15-16；AGENTS.md hard rule 2；workflow.md:112-131），但 spec 的「前後相等」檢查在改寫前就通過，無法先 red；spec 未說明兩張表與 TDD 如何套用或申請例外。（信心中）
- **3-7** headless probe 是非瀏覽器 harness，依 workflow.md:156-164 須記為 ADR 或列入 `.proj.specs/OPEN-QUESTIONS.md`（不存在）；未說明 headless 與互動式 main session 是否為同一 surface（hard rule 4）。（信心中）

### P2
- **3-2** 引用 SKILL-MECHANICS.md:12 可能產生「改為 user-invoked」的 finding，但 AC2/AC3 鎖死 Codex 且 verifier 強制兩邊一致；invocation policy 應列入 keep list 或排除。
- **3-4** 從 step 3 開始等於跳過 tune-skills step 1 的停止閘門（記錄 opus-5-5/high 與本 session 相同會直接停止），也未說明 manual-only skill 的呼叫授權來源。
- **3-6** reviewer finding 由 main session 裁決，與 harness-reviewer.md:14-18、claude-orchestration.md:29-32 不一致（tune-skills:80-81 本身也允許，專案文件間本就不一致）。
- **3-8** probe log 放 `reports/` 與 layout 的 standalone HTML evidence report 慣例不符。
- **3-9** audit report 語言未指定（docs/agents 為英文，但作者需逐條核准）。
- **3-10** 詞彙衝突：「style」是 CONTEXT.md Theme 的 _Avoid_ 詞；「Codex user」應為 Author；需補 glossary 或標為缺口。
- **3-11** behaviour 定義缺 stopping points；router 有多處「Finish …」停止點（SKILL.md:50、60、95、107、116）。
- **3-12** 分歧後「revised」hunk 未要求重新核准。
- **3-13** 未寫明 probe 只能由 main session 執行（executor 不得啟動 agent）。
- **3-14** 原樣 vendoring commit 缺 openai.yaml，該 commit 的 verifier 必然失敗。
- **3-15** reviewer pass 未指定 axis 或 prompt（runtime.md:55-56）。
- **3-16** 未記錄 vendored skill 的 licensing 與 notice（tune-skills:55；skill-sources.json 既有慣例）。
- **3-17** 上游來源未固定 revision（skills-lock 為 `ref: main`）。

## Axis 1 — Completeness

總計：P0 1、P1 11、P2 9（報告標題寫 21 項，實列 22 項，缺編號 1-3）。ADR 0001/0002 未開檔。

### P0
- **1-8** row 10／AC10 要求 selected style 前後一致，但 router 契約允許 `multiple_anchors` 任選 jobs 或 gates（SKILL.md:80-81；context-examples.md:17-20、26）；正確改寫可能被判失敗並被迫回退。（信心中高；若裁定改為「選中 style ∈ eligible 集合」可降 P1）

### P1
- **1-1** AC11 列的 identifying core 與 guidance boundary 無矩陣列對應。
- **1-2** 「改寫後規則仍成立」無 AC 真正檢查（AC11 只是位置索引，AC9 只比 ID，AC16 分類自判）；四個 style skill 的核心意義漂移不會被擋下。
- **1-4** spec 與矩陣的 keep list 不一致（矩陣缺 language、material-boundary、registry；「reference 範例意義」縮成「example outputs」）；AC12 未指明用哪份。
- **1-5** 出處與歸屬紀錄（takahashi core-rule.md:7-8、21-41；各 SKILL.md「not a quotation」）不在 contract、keep list 或矩陣；tune-skills:55 的 license/notice keep 項未帶入。
- **1-6** router 語言規則無矩陣列，probe 不記錄語言（router SKILL.md:45-46、91-92、105-106、113；missing-context 中英兩案例）。
- **1-7** probe 固定案例集合未列舉（ambiguous、unsupported、multiple、per_page、resolved、ai_concept、measured_energy、multiple_anchors、generic、audience-only、unavailable、quoted_commands、explicit_adoption），row 10 用另一套分類。
- **1-9** unavailable 情境無 fixture，實際走 delivery，假一致。
- **1-10** material-boundary 案例無具體請求；explicit adoption（改 style／format）無矩陣列。
- **1-11** 多輪延續行為（釐清後保留 JSON 與語言；`resolved` 案例）無矩陣列，單輪 fresh session 無法表達。
- **1-12** description 改寫對觸發與 skill 選擇的影響無矩陣列；probe 未指定明確呼叫或自動選擇。
- **1-13** grep 檢查無 AC，且與 AC3 互斥（Codex 副本與五份相同段落必然命中）。

### P2
- **1-14** 多項決策無列或 AC：model names 不入 skill 文字、prompt-audit 不可用時停止、目標讀者與檔名 `<model>`、combined patch 位置、行數比對、剩餘 P2 記為 deferred、只重跑受影響案例。（model names 可考慮升 P1）
- **1-15** step 6 的 `claude_tuned_for` 更新無規範。
- **1-16** row 16 與 AC13、row 19 與 AC16 內容只部分重疊。
- **1-17** 出處列時點與內容缺口（AC1 只查 lock；`ref: main`；無 revision 與 licensing）。
- **1-18** 「one level deep」與現有巢狀連結（takahashi core-rule.md:55）、跨 skill 連結（router styles.md:10-19，屬 registry）無期望行為。
- **1-19** AC9 抽取範圍未定義（全域 regex 會抓到 archify 的 `gates.semantic` 等）。
- **1-20** style skill 行為缺列：讀不到 supporting record 時誠實揭露、可不經 router 直接使用、wangxing「張忘形，不是王興」區辨句。
- **1-21** router 可觀察行為未記錄：reason 引用 anchor 與 focus、不從 audience 推論、不做內容改寫。
- **1-22** row 10 未寫 settings format；非 delivery branch 的 format 值未定義。
