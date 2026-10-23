# Epic 0004 retrospective（授權檔與 notices）

日期：2026-10-23。範圍從 epic 0003 拆分出 0004 開始，到 T-0006 合併進 `main`（merge commit `ef78392`）為止。依 Agile 原則 12，這份紀錄只回答一個問題：下一個 epic 要改哪些做法。

## 結果

- 唯一的一張票 T-0006 已經合併進 `main`。
  - `LICENSE` 的 blob 等於 CC 官方 legal code（`2d58298e`）。
  - `LICENSE-CODE` 和 tdd 的 LICENSE 只差第 3 行的署名。
  - 其餘目標檔都和「B 加上 T-block」逐位元組相同，涵蓋 T1–T18 與 S1–S6。
  - AC1–AC12 都有腳本輸出或頁面文字作為證據。
- 各階段的結果：drift 0 項；獨立比對腳本 0 項失敗；stage 7 確認 0 個安全問題。
- **GitHub 授權偵測**（spec Testing Decisions 規定要記在這裡），2026-10-23 查詢：
  - REST API `repos/CXPhoenix/Chalkdeck` 與 `/license` 只回報一個授權：`CC-BY-SA-4.0`，來源是 `LICENSE`（blob `2d58298e`）。
  - repo 首頁側欄顯示「CC-BY-SA-4.0, MIT licenses found」，連到 `LICENSE` 和 `LICENSE-CODE`。這是內建瀏覽器讀取頁面文字的結果，repo 裡沒有其他紀錄。
  - 這和 ADR-0007 Consequences 寫的「GitHub may detect both license files and show two licenses」一致。要注意：只看 API `license` 欄位的工具，會把整個 repo 當成 CC BY-SA。

## 做得好、下次照做

1. **P0 存活就拆 epic。** 0003 到第 2 輪仍有 P0；拆出只含文件的 0004 之後，第 2 輪就是零 P0。hard rule 3 的這個出口有效。
2. **逐字 T-block 加上腳本比對，讓實作變成機械工作。**
   - 套用腳本直接從 `traceability.md` 擷取 T-block，沒有手打任何文字。
   - AC 驗證 workflow 有 6 個 agent，各自從 traceability 重寫比對腳本，而且看不到套用腳本。票上記錄了其中四支比對腳本的輸出。
   - 結果是 0 項失敗。這代表 spec 寫得夠精確，不是運氣。
3. **起點 B 與 drift 規則。** 第一則 Comment 在動任何目標檔之前，就記下 B、各檔 blob、素材清單與 archive 檢查，證明沒有 drift。整個過程不需要任何裁決。
4. **事實先查再動。**
   - 本機 `main` 停在舊的 `faef941`，所以一律改用 `origin/main` 和完整 SHA。
   - 票在 merge commit `ef78392`（2026-10-23T07:51:20Z）出現之後才標成 `done`。先前使用者回報 PR #9 已合併時，我用 `gh pr view 9` 查到它其實還是 OPEN，就沒有動作；這次查詢沒有存檔。

## 下次要改

1. **同一條規則寫在七處，措辭就會分歧。**
   - deck 軌的 notices 例外分別寫在 T10、T13、T14、T15、T16、T17、T18。
   - stage 6 的 11 項 spec 層級問題中，有 5 項直接和這個重複寫法有關：STD-01、STD-02／SPEC-11、SMELL-01、SPEC-12、SPEC-13。另外 6 項是其他措辭問題：STD-04／SMELL-02、STD-05、STD-06、STD-07、STD-16、SPEC-14。
   - 原因：revision 3 是 owner 核准的審查後修補（見 round-2.md 的 Rulings；hard rule 3 規定最多兩輪）。它的自審只檢查範圍、錨點、命名與 `verify-project.py`，沒有逐格比對新加的 T-block 之間措辭是否一致。
   - **改法**：spec 凍結前，只要同一條規則出現在兩個以上的 T-block，就列一張「同一規則 × 每處措辭」對照表，逐格檢查觸發條件、範圍與例外。這是全域規則 3「單一真相來源」的具體做法。
2. **test plan table 的核准 gate 和事前的概括授權互相衝突。**
   - 使用者事前說「直接開始 /implement 到整個 epic 完成」，但 hard rule 2 要求表格先給使用者看過、核准後才能開始。
   - 這次照實記為「approved in advance」，表格是事後才給使用者看。
   - **待 owner 決定**，見下面「交給 owner 的決定」第 1 項。
3. **純文件的票沒有對應的流程。**
   - workflow.md 的 stage 5 只寫「Run `/implement`, which uses `/tdd`」（workflow.md:115），沒有純文件票的分支。T-0006 只好在票裡自己說明為什麼 `/tdd` 不適用。
   - workflow.md 對 coverage table 的時點也有兩種說法：「when the ticket closes」與「before stage 6」（workflow.md:128、:133-134）。
   - **改法**：在 workflow.md 寫明「純文件票的 test plan 就是驗收檢查清單；coverage table 在 stage 6 之前產生，stage 8 和 9 的項目之後補記」。這屬於 template work，需要另開 epic。
4. **stage 6 審查逐字 spec 時，成本和產出不成比例。**
   - code review 動用 39 個 agent，約 1.9M subagent tokens，產出 37 項 finding：
     - 6 項是票面紀錄問題，已在範圍內修正；
     - 13 個 ID（共 11 列）是 spec 措辭問題，已上報 owner；
     - 18 項經 challenge 判定為誤讀，或沒有規則依據的風格偏好，已撤回。
   - 逐字比對已經證明實作等於 spec。上報的 spec 措辭問題中：
     - STD-04、STD-05、STD-06 在 stage 3 第 2 輪就已記為 P2（3-12、3-7、3-6），並依 round-2.md 的 Rulings「All other P2 findings are recorded and not changed」決定不改；
     - SPEC-13 的殘留全稱句源自 3-3，revision 3 只用 T16–T18 處理了其中幾句。
   - 也就是說，stage 6 大多是再發現一次已經裁決過的事項。
   - **改法**：純文件、而且目標文字逐字指定的票，stage 6 只審非逐字的部分：票的 Comments、證據是否足以佐證 AC、是否超出範圍。這需要 owner 同意。
5. **spec 本身的小瑕疵。** traceability 的 Archive check 寫「record two things」，下面卻列了四項。實作時以 S0 表的四欄為準並在票上註明；spec 已凍結，所以沒有改它。
6. **shell 的小陷阱。**
   - zsh 預設不會對未加引號的 `$PY` 做字詞分割。例如設定 `PY="python3 -I"` 之後執行 `$PY script.py`，結果有一次比對腳本根本沒有執行。
   - `echo` 的參數以 `==` 開頭時，zsh 會把它當成 `=指令` 展開而出錯。
   - 兩次都在讀輸出時發現並重跑。**改法**：腳本一律寫完整路徑，並在同一輪讀回 exit code。

## 交給 owner 的決定

1. 「做到完成」這類概括授權，算不算 hard rule 2 的 test plan table 核准？
   - 算的話，在 workflow.md 註明。
   - 不算的話，以後 agent 寫完表格就先停下來等你看。
2. stage 6 列為 spec 層級的 11 項（清單在 T-0006 的「Stage 6 code review」Comment），要不要開一個小 epic 統一 deck 軌例外的措辭？
3. 純文件票的流程（上面第 3、4 項），要不要開一個 template work epic？

這三項你現在就能回答，所以沒有寫進 `.proj.specs/OPEN-QUESTIONS.md`。retrospective 也沒有另外新增 ADR（ADR-0007 是 T-0006 的交付物），因為上面的改法都還沒經過你決定。

## 下一步

- **Epic 0005**（verifier 的授權引用檢查）現在可以開始 stage 1：請你執行 `/grill-with-docs 0005`。依據是 `.proj.handoffs/license-epic/carry-over-0004-0005.md`，以及 0003 traceability 的 V1–V15。
- **OQ-3**（部署出去的網站沒有附 notices）仍然開著。
- **可清理的 worktree**：`.worktrees/T-0003`、`.worktrees/epic-0003`、`.worktrees/T-0006` 都已合併，經你同意後就能移除。

## 成本紀錄

各 workflow 的 subagent tokens，數字取自 workflow 完成通知，不含主 session：

| Workflow | Agent 數 | Subagent tokens |
|---|---|---|
| 拆票審查（stage 4） | 3 | 約 0.18M |
| AC 獨立驗證（stage 5） | 6 | 約 0.55M |
| code review（stage 6） | 39 | 約 1.92M |
| 安全審查（stage 7） | 12 | 約 0.39M |
| chain analysis（close-out） | 15 | 約 1.01M |
| 結案文件查核（close-out） | 3 | 約 0.35M |

合計約 4.40M subagent tokens。其中 stage 6 與 chain analysis 合計約 2.93M，約占 67%：

- stage 6 的 37 項中，只有 13 個 ID 是 spec 措辭問題，18 項被撤回；
- chain analysis 的 13 條候選全部不成立，沒有發現新問題。

這就是上面「下次要改」第 4 項的依據。
