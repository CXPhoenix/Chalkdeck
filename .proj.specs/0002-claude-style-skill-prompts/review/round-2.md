# Round 2 — 0002-claude-style-skill-prompts

Spec version: spec.en.md 5ab98dea710af5b3f35bd82ac0f9d01a879c4730 / traceability.md fcdbc9b69af67e84734d0b039a0461c2d09c4ccf
Prompt: `review/prompt.md` replayed verbatim. One `harness-reviewer` per axis. Reports recorded as returned.

## Axis 2 — Verifiability

總計：P0 0、P1 11、P2 7（2-4 依凍結標尺可主張 P0，reviewer 判 P1）。reviewer 無 Bash，未核對 blob；未讀 round-1 以維持獨立。已確認可判定：AC1 hash 比對（前提為 V 固定）、AC2 推導值、AC3、AC4、AC6（body 約 120 行）、AC14、AC15 的 `claude_tuned_for` 相等條件。

### P1
- **2-1** V 與 HEAD 未固定成可查 commit（未要求記錄 V 的 SHA），且隱含一票一分支；多票、squash/rebase 合併都會讓「at V」「V...HEAD」產生歧義。（信心高）
- **2-2** AC7 連結判定未定義：四個 style skill 的 english-example.md 連結跨兩行（takahashi:123-124、jobs:120-121、wangxing:129-130、gates:137-138），逐行 regex 會漏掉 → V 本身不通過；解析基準（所在檔案目錄或 skill 根目錄）與 fragment 處理未寫。（信心高）
- **2-3** K1、K2 擷取規則未定義：SKILL.md 只有反引號 ID，`rule_id:` 行都在 references（K1 若只抓 `rule_id:` 等於沒守 SKILL.md）；adjustments.md 用 `- ID:` 而非 `Rule ID:`，且第 6 行同時提到核心 ID。（信心高）
- **2-4** AC9 的比較基準「generated at V」不存在（V 時尚無 baseline、無產生指令、protected sentences 為人工選取）。可在 ticket 補「以首次 commit 的 baseline 為準」。（信心高；可主張 P0）
- **2-5** protected sentence 比對方式未定義（跨硬換行、是否正規化空白、是否限定在 K 表 Where 那一節）；AC12 以「行」判定 keep-list hunk，重排斷行會誤標；K4–K6 的範圍是整節或只有那幾句未定。（信心高）
- **2-6** AC8 未定義 hunk 與 finding 的對應鍵（hunk 切法隨 -U3 改變、相近 finding 會合併；combined patch 是核可前版本），也未要求 proposed text 等於最終文字。（信心高）
- **2-7** 等價審查的 P0/P1 分級與「unresolved」未定義（review.md 的分級是給 spec 用）；作者 reject 算不算 resolved 未寫；行為改變被評 P2 時 AC11 仍通過。（信心中）
- **2-8** row 6「觸發範圍不變」只對應流程性的 AC11，無可判定檢查；probes 已延後，而 AC5 強制加 `Use when` 正是觸發最可能改變處。屬作者有意取捨，交使用者決定是否接受。（信心中）
- **2-9** AC13「behaviour-changing → deferred」分類無判定者；「the language it uses」可讀成輸出語言或措辭。（信心中）
- **2-10** AC5 在 V 時五份全部不通過（首字 Select/Provide、無 `Use when`），等於強制改寫；作者否決或 description hunk 被 revert 時 AC5 必然失敗且無出口。（信心高）
- **2-11** AC16 模型名稱集合開放（row 17「such as」）與 AC16 括號清單不一致；model ID 格式、大小寫未定（不分大小寫會誤中英文 fable）；checker 不含 AC16。（信心中）
- **2-12** AC17 grep 搜尋鍵未定義；句子跨行，整句 grep 必零命中而空洞通過；五份「Caller instructions and supplied material」逐字相同，結果取決於搜尋鍵。（信心高）

### P2
- **2-13** AC10 mutation 範圍不清（row 13 缺 K13；description form 五個子條件做幾個 mutation）；run log 未要求 commit SHA，「先於改寫」無法查證。
- **2-14** AC5 未說用 YAML 原文或解析值（folded scalar `>-`）；「first word」斷詞與 `\bI\b` 命中「i.e.」。
- **2-15** AC15 的引號字串為逐字或語意比對、寫在哪個 JSON 鍵未定。
- **2-16** spec 說 skills-lock.json 要記 revision 與 license，但 lock 格式只有 source/ref/computedHash，AC1 只查 source。
- **2-17** K8、K10 成員範圍需詮釋；無 AC 對照核可清單是否漏句（作者刻意承擔的風險，記錄備查）。
- **2-18** AC2 不擋額外手寫鍵；AC18「distinct from Theme」形式未定（Theme 的 _Avoid_ 已列 style）；作者核准紀錄的形式未定。

## Axis 1 — Completeness

總計：P0 0、P1 8、P2 9（1-1 reviewer 主張可為 P0）。reviewer 無 Bash，未核對 blob。已確認：AC1–AC18 皆有 matrix 列對應；U 的 43 檔與工作樹相符（router 7 + 4×9）；AC6、AC7 在 V 時成立（router 6 個 references、style 各 8 個皆已連結）；OQ-1 已記錄 probe 設計。

### P1
- **1-1** AC5 強制改寫五個 description（V 時全不符），但作者否決或 hunk 被回退時無期望行為 → AC5 與 AC14 失敗；row 5（形式必改）與 row 6（觸發不變）可能無同時成立的寫法。（信心高；可主張 P0）
- **1-2** keep-list hunk 只看 removed lines；在 K4–K6 範圍內「只新增」一句例外不會被標記，checker 也通過（只檢查受保護句存在）。（信心高）
- **1-3** grep 排除清單與自身產物衝突：baseline 逐字收錄受保護句且只能多 `approved_changes` → 已核准刪除必被回退；`scripts/` 的 mutation fixture 與 `.proj.tickets/` Comments 會自我命中；五份逐字相同段落會強迫同步改寫但未說明。（信心高）
- **1-4** K1 以 skill 為單位比集合，而 K12 讓 references byte-equal，故 SKILL.md 內刪掉某個 rule_id 的輸出指示（如 takahashi SKILL.md:51）K1 仍通過；缺「SKILL.md 內每個 rule_id 逐檔存在」。（信心高）
- **1-5** 等價審查 P2「輕微行為變更」可合法留下，牴觸「No hunk may change behaviour」；作者裁定「接受」是否算 resolved 未定義。（信心中）
- **1-6** row 6、row 12 只對應檢查紀錄的 AC11；無 AC 檢查 equivalence-prompt 是否含觸發範圍軸、是否涵蓋完整 diff、是否在第 1 輪前凍結；非 keep-list 的核心行為（router 選擇表 SKILL.md:72-77、gates 拒絕邊界 :51-61、核心命題 :27-32、router Availability :112-117）無獨立列。（信心中）
- **1-7** checker 的部分檢查不在 row 13 mutation 清單：K13、K9「every URL present」（spec 的 checker 描述也只寫 byte-equal）、`approved_changes` 比對核准文字的路徑。（信心中高）
- **1-8** 受保護句清單的完整性與核准無 AC 驗收（AC10 只驗 test plan table）；K10、K11 是否完整涵蓋無列檢查。（信心中）

### P2
- **1-9** K11 只保護 Finish 開頭句；router Availability 停止點「An honest limitation report completes this branch without settings.」（SKILL.md:116-117）不受保護。
- **1-10** AC8 要求 URL 引用，但 writing-for-agents 與 SKILL-MECHANICS.md 是本地檔、無 URL。
- **1-11** 多項決策無列或 AC：稽核工具不可用即停止、reader model、四個指南來源與傳入 keep list、報告英文本文與 zh-TW 核准表、combined patch 位置、tune-skills step 2 預算未套用或豁免、「Reports name that surface」、coverage report table、V 本身通過 verifier、V 時寫入 skill-sources.json、deferred findings 的追蹤處。
- **1-12** Out of Scope 無對應列：「Re-tuning any other skill」（row 18 的「updated」反而允許改其他檔）；Claude 副本新增 V 時不存在的檔案。
- **1-13** row 17「such as」開放清單與 AC16 封閉清單不一致；model ID 未定義。
- **1-14** K3 是否涵蓋 router 不明（row 10 只寫 style skills；router choice-examples.md:28 有 `style_id`）。
- **1-15** AC11 未明寫兩輪上限（row 15 有）。
- **1-16** row 5「third-person singular verb」與 AC5 regex（首字 s 結尾）不一致；`\bI\b` 會命中「i.e.」。
- **1-17** AC10、AC17、V 的定義假設單一 ticket。
- **1-18** AC2 未限制 openai.yaml 其他 key。

## Axis 4 — Red team

總計：P0 0、P1 7、P2 13。reviewer 無 Bash，未核對 blob；ADR 只全文讀了 0006。
意圖內後果：Claude 與 Codex 文字永久分歧；五個 description 常駐 context、兩個 runtime 皆可隱式呼叫；無 behaviour probe，等價只由 LLM reviewer 判斷（OQ-1）；`claude_tuned_for` 不更新；報告與 patch 會 commit 進 `docs/agents/skill-tuning/`。
Round 1 紅隊狀態：已解決 4-1、4-2、4-3、4-5、4-6、4-9、4-10、4-12、4-13、4-15、4-16、4-17；部分殘留 4-4、4-7、4-8、4-14；仍存在 4-11。

### P1
- **4-1** AC5 強制五個 description 全改（V 時皆不符），而 `Use when` 正是改變觸發的手段，與「changes no behaviour」矛盾；pass 2 後 description hunk 若需回退，AC5／AC9／AC14 失敗成死結；1.25× 上限可能壓掉 router 的風格名稱；寫太寬會搶走 create-slide、new-deck、slide-authoring 的請求並反問使用者。（機制信心高、影響中）
- **4-2** AC4／K13 只鎖 `name` 與不得有 `disable-model-invocation`；`allowed-tools`、`user-invocable`、`paths`、`context: fork`、`agent`、`model`、`effort`、`hooks` 等會改變行為或權限的 frontmatter 未限制，checker 與 verifier 都不查；audit 建議加 `allowed-tools: Read` 實為放寬權限。（信心中高）
- **4-3** grep 排除清單仍不足：`scripts/style-skills-baseline.json`（逐字收錄受保護句）、`scripts/` fixture、`.proj.tickets/`（記錄 grep 指令本身會自我命中）、`node_modules/`、`dist/`、`.proj.handoffs/`、worktrees；keep-list 核准改寫的舊文字必命中 baseline 而只能回退。round 1 4-7 的殘留。（信心高）
- **4-4** mutation fixture 位置未規定：若以 `.claude/skills/<name>/SKILL.md` 結構 commit 在 `scripts/` 下，Claude Code 可能發現刻意弄壞的同名 skill（如拿掉 material-boundary 的 gates-style）；若在原檔上 mutate 再還原，中途當掉會留下壞內容。（信心低到中）
- **4-5** `check_style_skills.py` 未接進 verifier 或任何流程；tune-skills 的 keep 清單只 grep 各 skill 的 `test/`、`tests/`，掃不到 `scripts/` 的 baseline；下次整樹 tune-skills 會在不知情下改寫這五個 skill，保護靜默失效；上游更新時 baseline 如何重產未定義。（信心中高）
- **4-6** SKILL.md 的 Identifying core 條列不在 keep list，但各 skill 明寫「The core above is sufficient for direct use」，Claude 實際依此執行；router 的 context-selection 表、「any one eligible choice is valid」、「Do not infer expertise … from an audience label」皆未受保護；否定改正向最易悄悄改變行為。（信心中）
- **4-7** 核准表以 zh-TW 寫「proposed change」，未要求逐字附英文 hunk；作者核准的可能是翻譯摘要而非實際措辭（K6、K8 尤其敏感）。（信心中）

### P2
- **4-8** gates、wangxing 的 core-rule.md 寫 `Mandatory rule ID:`（小寫 r），字面比對 `Rule ID:` 會讓 K2 core 集合為空。
- **4-9** protected sentence 只查存在；加限定或推翻句、搬節、新增 Finish 停止點都能通過。
- **4-10** `equivalence-prompt.md` 由實作方撰寫，不經 stage 3 也不需作者先核准；hash 只證明兩輪同一份。
- **4-11** pass 2 只重審 fixed hunks，回退後的最終文字未被審。
- **4-12** spec 寫「applies tune-skills steps 3–5」，但 step 5.3 規定只審 behaviour-changing hunk 並由 main session 裁決；未明寫由 Testing Decisions 取代。
- **4-13** lock 為 `ref: main`，AC1 未要求釘在 U；安裝工具 update 可能覆蓋 Claude 調校或改成 symlink（被 verifier 視為 shared 豁免）。round 1 4-11 持續存在。
- **4-14** unittest traceback 與 grep 輸出常含本機絕對路徑，ticket 會 commit，未要求遮蔽（runtime.md:135-136）。
- **4-15** 推導的 `short_description` 約 62–80 字元，明顯長於 repo 既有短描述，Codex UI 可能截斷。
- **4-16** K8 是否涵蓋 wangxing description 中的「(張忘形)」未說明，AC5 壓力下可能被刪。
- **4-17** body 只要求少於 500 行，目前約 120–140 行，容許約 3.5 倍膨脹。
- **4-18** AC1 未禁止 V 時多出其他檔案。
- **4-19** English example 連結文字跨行（gates SKILL.md:137-138 等），以行為單位的 AC7 解析器在 V 就 FAIL。
- **4-20** AC18 以「0001 是否已 land」決定改哪個檔案，未定義判定時點；merge 時可能讓 CONTEXT.md 復活。
- **4-21** 五份 SKILL.md 多段逐字相同，改一份的共用句會讓 grep 命中其他四份，迫使連鎖修改或回退。
- **4-22** 跳過 tune-skills step 2 預算上限；baseline 與 checker 的 commit 不必早於改寫，baseline 可能從部分改寫的樹產生。

## Axis 3 — Contract conflict

總計：P0 0、P1 2、P2 14，另有 2 項軸外觀察。reviewer 無 Bash，未核對 blob。
reviewer 要求補的 context（parent 已查證）：(1) 五個 `.claude/skills/<style>` 皆為實體目錄，非 symlink（`ls -la`）；(2) 磁碟上的 AGENTS.md 已含 Charter，該變更已 commit 於 `3e6b0a5`（PR #4，尚未合併），`git status` 顯示 AGENTS.md 無未 commit 變更。
已確認無衝突：CONTEXT.md 用詞（AC18 補上後與 Theme 區分）；ADR-0001/0002/0003/0005；ADR-0006 的 Comments 紀錄與 equivalence review；invocation policy 與 verifier 一致；runtime.md:13-14、:32-35；五個 skill 無 model 名稱；`claude_tuned_for` 明文不變；OQ-1 符合 workflow.md:163-164；Charter Must hold #4。

### P1
- **3-1** 未對真實 surface（agent session）做 E2E，也未明文申請例外：違反 stage 8 gate（AGENTS.md:82）、hard rule 4、workflow.md:145-161、ADR-0004「keeps every gate」；ADR-0006 只豁免 stage 5 red step；OQ-1 只延後「自動化」，0001 仍有手動 session，0002 連手動都沒有。建議比照 0001 加手動 session，或明文例外並寫 ADR。（信心中高）
- **3-2** ADR-0006 被套用到新寫的 checker：`check_style_skills.py` 有新的輸出契約（FAIL 行、exit 1/0），可走一般 red → green；目前測試只斷言內容，checker 本身的 FAIL/exit 契約無可 red 的測試；checker 與改寫同票違反 ADR-0006 適用條件。（信心中）

### P2
- **3-3** 略過 tune-skills step 2 預算 gate 且未宣告。（信心高）
- **3-4** 自稱「applies steps 3–5」，但 keep list、報告路徑、5.1 比對未 patch 樹、5.3 審查範圍與裁決者都被替換，未聲明覆寫 tune-skills。（信心高、影響低）
- **3-5** `review/equivalence-prompt.md` 於實作期寫進已凍結的 spec 目錄；審查紀錄放在 skill-tuning 報告而非 `review/round-N.md`，證據鏈分家。
- **3-6** 報告放 `docs/agents/`（英文）卻附 zh-TW 核准表，language.md 無混合文件類別。
- **3-7** 0002 先合併並改 CONTEXT.md 時，0001 AC7 必然失敗；合併順序成為隱性限制。
- **3-8** 新 checker 與測試未寫入 AGENTS.md「Build and test commands」，tune-skills:71-75 也看不到，未來全樹 re-tune 可能破壞 baseline。（信心中高）
- **3-9** 授權與 notice 未沿用既有 seam（THIRD_PARTY_NOTICES.md、skill-sources.json 的 revision/sha/LICENSE 慣例）；U 無 LICENSE 檔；權利人同為 CXPhoenix，風險低。
- **3-10** 推導的 short_description 約 63–81 字元，既有 26 個皆 ≤53 字元。
- **3-11** AC5 首字須為第三人稱動詞，與 writing-for-agents「Front-load the leading word」拉扯，未定優先順序。
- **3-12** 未規定 Claude copy 須為實體目錄（runtime.md:48-49）；若為 symlink 會被 verifier 視為 shared 豁免。（parent 已確認目前為實體目錄）
- **3-13** spec 預設單一 ticket，限制 stage 4 拆票選擇。
- **3-14** provenance 寫入位置與既有 `claude_prompt_audit`、`source/revision/license/adaptations` 結構不同，日後 re-tune 可能漏掉。
- **3-15** 無 AC 涵蓋 coverage report table（ADR-0006:11-12）。
- **3-16** harness-reviewer 用在 stage 5，超出角色表（tune-skills 有先例）。

軸外觀察：AC8 要求 URL 引用但兩個指南來源是本地檔（P2）；AC17 必命中 baseline 中的受保護句，與 AC9 的關係未定義（P2）。

## Adjudication (author, 2026-10-16)

- **Gate:** zero P0 after round 2. The four borderline items (0001: axis 2 items 2-2 and 2-6; 0002: axis 1 item 1-1 / axis 4 item 4-1, and axis 2 item 2-4) are ruled **P1**, to be fixed in ticket acceptance criteria:
  - 0001 "project doc" = the row 5 file set only; 0001 AC8 is judged with `git log B..HEAD -- <paths>` showing no commit.
  - 0002 AC5 applies only to descriptions whose rewrite the author approves; a rejected or reverted description stays as at V and is recorded deferred.
  - 0002 baseline = the version in the commit that first adds it, with that commit's SHA recorded.
- **Order:** epic 0001 lands on `main` first; epic 0002's branches start from `main` after that.
- **`/teach`:** add a one-sentence local adaptation to `teach/SKILL.md` in both trees so the repository root is not used as a teaching workspace; record it in `docs/agents/skill-sources.json`. This overrides 0001 AC3 for that sentence.
- **0002 stage 8:** one manual smoke test in a fresh session with the rewritten skills: three representative requests (explicit style, context selection, missing context), once each, judged against each case's allowed outcomes. No before/after comparison.
- All other P1 findings are carried by the tickets; P2 findings are recorded here and block nothing.
