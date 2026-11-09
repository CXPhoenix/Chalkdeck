---
synced_from: spec.en.md
synced_from_sha: 5d0a26cb3d646d3a6f51599b057c385ef76416d4
---

# Spec 0006：純文件票的流程，以及更嚴格的 code ticket 循環

本文件是 `spec.en.md` revision 3 的稽核用翻譯，以英文版為準。發現錯誤時，先改英文版，再重新產生這份翻譯。

本 spec 不重複的內容放在 `traceability.md`：

- **定義**：B0、B、code ticket、票檔、region、Match（比對規則）、drift。
- **目標文字**：T1、T2、T6、T8、T9、T13、T14、T15，全部逐字寫出。
- **矩陣**與**自審表**。

`grill.md` 逐字引用 repository owner 的答案；兩輪審查的裁決分別在 `review/round-1.md`（R1–R6）和 `review/round-2.md`（S1–S4）。

revision 2 套用了 R1–R6。依 R1，緊急下架的例外拆成 epic 0007，它需要的文字和矩陣列保留在 revision 1。revision 3 套用 S1–S4，經過自審；依 Ruling S4，不跑第 3 輪審查。

## 問題陳述

目前的 workflow 假設每張票都是程式。`docs/agents/workflow.md` 的 stage 5 只寫「Run `/implement`, which uses `/tdd`」，沒有其他分支。所以 T-0006 這張主要改授權文字和 notices 的票，只能在票裡自己說明為什麼不適用 `/tdd`。同一個 stage 對 coverage report table 的產生時點有兩種說法：「when the ticket closes」和「before stage 6」，`AGENTS.md` 的 hard rule 2 沿用前者。stage 6 重新審查 spec 已逐字給定的文字，花了約 1.9M subagent tokens，多半只是把 spec 審查時已裁決過的事項再找出來一次。

code ticket 也有自己的漏洞：

- epic 0005 有三次先整批寫測試、才記錄紅燈，每次都記錄下來了，還是一再發生；
- 約 41 個 mutation 沒有列在核准的表格裡就執行了；
- 紅燈證據存在 loose 的 `git hash-object -w` blob 裡，`git gc` 可能把它清掉。

owner 的裁決 D1（「做到完成」這類概括授權不算 test plan 的核准）只寫在一張票和 agent 的 memory 裡。

## 解法

repository owner 得到兩種票各自成文的流程：

- **純文件票**成為有定義的術語，在 ticket frontmatter 標註，於 stage 4 核准。它不跑 `/implement`、`/tdd`，也不用那兩張表，改跑一份核准過、全部由指令組成的驗收檢查清單。spec 逐字給定文字的段落，用記錄下來的比對 script 檢查，由 stage 6 的 Spec 軸確認；只有其餘部分做完整審查。
- **code ticket** 保留 `/tdd`，並加上幾條規定：
  - 核准要明確給出，並且記錄下來；
  - 一列對應一個測試，每一列一個已 commit 的循環；
  - 每一列事先寫好 mutation，只有在行為原本就存在時才使用；
  - 紅燈與綠燈紀錄以 diff 的形式寫進票裡。

## User Stories

1. 身為 repository owner，我希望純文件票有明確的定義和標註，讓 agent 從票本身就知道要走哪個流程。
2. 身為 repository owner，我希望設定、被 script 讀取的資料，以及對 skill 指示的修改，都不能算純文件票，讓任何會改變工具或 skill 行為的修改都不會跳過測試。
3. 身為 repository owner，我希望純文件票執行一份由我核准的驗收檢查清單，讓它的證據是真正的檢查，而不是不可能失敗的測試。
4. 身為 repository owner，我希望 stage 6 不再重審已經定案的逐字文字，讓審查的心力放在 spec 審查看不到的地方。
5. 身為 repository owner，我希望每一份 test plan table、檢查清單，以及對它們的任何修改，都要等我明確核准並記錄下來，讓概括授權或他人轉述都不能代替核准。
6. 身為 repository owner，我希望一列一個測試、每一列一個已 commit 的循環，而且每一列的 mutation 事先寫好，讓每一次紅燈都是真的，而且在執行前就已核准。
7. 身為 repository owner，我希望紅燈與綠燈的證據寫進票裡，讓它不會被 `git gc` 清掉，並且跟著 PR 一起保存。
8. 身為 repository owner，我希望 coverage report 只有一個明確的時點，讓 stage 6 之前的 gate 沒有歧義。

## 實作決策

- **要改的文件。** workflow 文件（stage 4 的 gate、stage 5、stage 6）、`AGENTS.md`（pipeline 表第 5 列、hard rule 2）、tracker 設定（票的格式）、glossary，以及兩條新的 open question。每一段要改的地方都有目標文字：T1、T2、T6、T8、T9、T13、T14、T15。
- **不改 skill、script、測試或 deck**（grill Q11）。所有規則都寫在 workflow 文件裡，並寫明它在哪些地方優先於 skill（Rulings R5、R6）；讓 skill 跟上的工作由 OQ-10 追蹤。
- **workflow 裡的 B**（T1）。ticket 分支從 `main` 的 B 開出，B 記錄為這個分支上寫下的第一則 Comment；沒有 owner 同意，不 merge 或 rebase 到 `main`。
- **票的種類**（T1、T9、K7–K13；Rulings R2、R3、S2）。
  - **算純文件**：給人和 agent 讀的文字，即使 script 會檢查它的格式也算，workflow 裡列有例子。
  - **不算純文件**：程式、測試、建置與部署設定、skill 或 agent role 檔的 frontmatter、YAML／JSON／TOML 檔、`CLAUDE.md` 的 import 行，以及任何檔案中被 script 當設定或資料讀取的部分。
  - **skill 指示**：修改 skill 的指示一律不算純文件票，它要嘛被 OQ-1 封鎖，要嘛由 ADR-0006 管轄。
  - **deck**：deck 屬於 deck 內容工作，不開票。
  - **中途需要改 code**：純文件票發現需要做 code ticket 才能做的修改時，先停下來；owner 同意後轉成 code ticket，並在做那項修改之前先取得 test plan table 的核准。
- **票的 key**（T8、T15、K1–K6、K14）。
  - `docs_only: true` 與 `verbatim: true` 在 stage 4 設定，列在 owner 核准的拆票結果裡，核准記錄在每張票上。
  - `verbatim` 必須搭配 `docs_only`，並在 Deliverable 底下列出段落。
  - key 寫錯時，要在票進入 `processing` 之前修正；之後要改 key，需要記錄下來的核准。
- **核准**（T1、T6、A1–A8）。
  - **時點**：repository owner 要在寫第一個測試、或改動票檔以外的任何檔案之前核准。
  - **修改已核准的列**：每一次都要再核准，包括項目跑過之後才修改 Expected。
  - **紀錄**：每次核准都記下日期、存放該表格的 commit、owner 回答的問題，以及 owner 的原話。
  - **優先順序**：概括授權不算核准。對表格和檢查清單而言，這條規則優先於其他地方「沿用既有核准」的措辭，但不影響 stage 9。
- **code ticket 的循環**（T1、L1–L9；Ruling R4，以及 S4 一併處理的修正）。
  - 一列等於一個 test method 或一個 `subTest`。每一輪都要記錄紅燈與綠燈，並在寫下一列的測試之前 commit；新檔案先用 `git add -N` 加入。
  - 只有行為在 B 上已經存在、或由前一輪已 commit 的循環做出來時，才可以第一次就通過；這時改用該列的 mutation 取得紅燈，而 mutation 永遠不能改測試本身。
  - 其他情況的第一次就通過，或 mutation 沒有讓測試失敗，都要停下來。
  - ADR-0006 管轄的票照該 ADR 的順序進行。
- **紀錄**（T1、V1–V3）。紅燈與綠燈紀錄都包含 HEAD，以及排除票檔的 `git diff HEAD`；紅燈另外記下失敗測試的名稱與訊息。這些 diff 本身就是證據，不依賴任何 Git object 或本機 ref。自訂的 `refs/evidence/…` ref 被否決，因為它預設不會被 push，也不會出現在 PR 裡（決定 2）。
- **coverage 的時點**（T1、T6、C1–C3）。所有票都在 stage 6 之前產生，之後有修改就更新；stage 7–9 的結果之後補記在 Comments。
- **檢查清單**（T1、Q1–Q9；Ruling S3）。
  - **項目**：每條 AC 都要有項目；每個項目都是指令，比對就是一支記錄下來的 script。
  - **執行**：在已 commit 的狀態下執行，記錄 commit、輸出與結果。
  - **必備項目**：一定要有一個 scope 項目，以及最後的檢查項目；最後的檢查也包括改到的 skill 自帶的測試。
  - **stage 8 項目**：要標註出來，失敗時擋住 stage 9。
  - **在 B 上先跑**：開工前先在 B 上跑過檢查；在 B 上就失敗時，只有兩種由 owner 選擇的處理方式。
  - **之後的修改**：有修改就重跑其餘項目。
  - **算作 coverage report 的條件**：每個沒標註的項目，最新結果都等於 Expected，而且出自同一個 commit。
- **逐字段落**（T2、S1–S6；Ruling S1）。每個列出的段落，票上都要記錄比對 script 和它的輸出，比對對象是 `main` 上 B 的 spec 文字。stage 6 的 Spec 軸確認 script 比對的是正確的段落、正確的位置；比對相符的段落不再審措辭。只有在這些比對相符的段落上，這條規則才取代 `code-review` skill 和 `runtime.md` 要求的完整 diff 審查。

## 測試決策

- **不新增測試。** 本 epic 的每張票都是純文件票，stage 5 的證據是一份 T1 規定格式的驗收檢查清單。
- **什麼是好的檢查。**
  - 每個落地的段落都有一支依 Match 規則比對的 script，並記錄輸出；
  - 每張票用 `git diff --name-only` 加上逐段的範圍檢查（X1、X2）；
  - 第一次修改前的 drift 檢查（X5）；
  - 三項既有檢查，加上乾淨的 work tree（X4）。
- **前例。** T-0006 的檢查清單（逐字比對、`git diff --name-only`、既有檢查），以及 0005 的目標文字 T1–T9。
- **End to end。** surface 是推上去的 ticket 分支在 GitHub 上的檔案檢視頁面，在 merge 之前由 `/agent-browser`，或 workflow 認可具同等證據力的原生瀏覽器工具驅動（E1）。記錄頁面文字和 accessibility tree，不用截圖。它是檢查清單裡標 `(stage 8)` 的項目。目前沒有驗證 agent 行為的 harness（OQ-1），所以沒有任何執行能確認 agent 會遵守新規則。

## 驗收條件

每張票只對自己負責的段落判定 AC1–AC4，比對基準是該票最新記錄的 B。

- **AC1.** `docs/agents/workflow.md` 裡，T1、T2、T15 的段落符合各自的目標文字（或經 drift 裁決後的替代文字），檔案其他部分沒有改動。
- **AC2.** `AGENTS.md` 裡，T6 與 T14 的段落相符，其他部分沒有改動。
- **AC3.** `docs/agents/issue-tracker.md` 裡 T8 的段落相符，`GLOSSARY.md` 裡 T9 的段落相符；兩個檔案的其他部分都沒有改動。
- **AC4.** `.proj.specs/OPEN-QUESTIONS.md` 以 T13 結尾，編號依 Drift 定義決定，內容相符，其他部分沒有改動。
- **AC5.** E1 得到它矩陣列寫明的結果，記錄在票的 Comments，並註明 surface 是 GitHub 的檔案檢視頁面。
- **AC6.** 每張票都以自己最新記錄的 B 判定 X1–X5；拆票結果與最後落地的那張票滿足 X6。
- **AC7.** 每張票的 Comments 都記錄 repository owner 的核准（附 owner 的原話）：這張票在 T1、T2、T8 落地之前，就照 T1 的檢查清單、T2 的逐字審查，以及 T8 的 key 執行（Z1）。

## 範圍外

- 已講過的 deck 的緊急下架例外，以及與 deck 無關的 verifier FAIL：移到 epic 0007（Ruling R1），從 revision 1 的草稿文字和 `review/round-1.md` 列出的第 1 輪 findings 開始。
- verifier 的 PASS 行說明它不檢查哪些東西（決定 5）：歸 notices 文法的 epic。
- 強制「一列一個循環」的紀錄 script：OQ-9。
- 修改 `implement`、`tdd`、`to-tickets`、`code-review`、`tune-skills` 等 skill，以及 `docs/agents/runtime.md` 與 `docs/agents/codex.md`：OQ-10。
- spec 如何讓非逐字的文字類驗收條件可以用指令檢查（第 2 輪的 1-6、1-7）：交給各個 spec 自行處理，epic 0007 會最先遇到。
- epic 0005 retrospective 的第 4 項（commit type）與第 5 項（凍結前核對矩陣列與規則）：owner 尚未決定。
- ADR-0006 及其他提到 coverage table 的 ADR：屬於歷史紀錄，不修改。
- 尚未開始的票 T-0004 與 T-0005：開始時依新規則重新標註。

## 補充說明

- **自我套用**（Ruling R6、Z1）。本 epic 的票在 T1、T2、T8 等文字落地到 `main` 之前，就帶上 T8 的 key，照 T1 的檢查清單與 T2 的逐字審查執行。這等於只針對這幾張票，覆寫了 B0 的這些規則：
  - stage 4 的 gate、stage 5、stage 6；
  - 票的格式；
  - hard rule 2 與 pipeline 表第 5 列。

  owner 在 stage 4 核准這件事，並記錄在每張票上。
- **超出 grill 答案的延伸**，在此寫明，方便檢驗：
  - 檢查清單的 Result 欄，以及紀錄裡的 HEAD commit 與每輪 commit（`grill.md` 的 Q6、Q7 都沒有提到）；
  - drift 規則與 Match 規則；
  - T14 與 T15：確認過的檔案清單沒有列出它們，但 stage 3 的裁決需要它們。
- **Stage 4。** 每張票都列出它負責落地的段落；X6 檢查所有票合起來剛好把每個段落落地一次。ticket id 依 `docs/agents/issue-tracker.md` 的規定掃描配號。
