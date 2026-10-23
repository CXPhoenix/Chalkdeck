---
synced_from: spec.en.md
synced_from_sha: 29e982bfe4685a445426625453b4c3d629a2ad9d
---

# Spec 0005：verifier 檢查授權引用

本文件是 `spec.en.md` revision 3 的稽核用翻譯，以英文版為準。發現錯誤時，先改英文版，再重新產生這份翻譯。

本 spec 不重複的內容放在 `traceability.md`：

- **定義**：B0、B、授權引用 (a)–(d)、路徑規則、notices 文法、無法讀取的輸入、引號呈現 Q(x)。
- **訊息**：完整的訊息表與排序。
- **目標文字**：T1–T9。
- **範例**：一個完整的實例。
- **矩陣**：每一列 row，以及測試、red 與 skip 的規則。

`grill.md` 逐字引用 repository owner 在 stage 1 的所有答案；`review/round-1.md` 與 `review/round-2.md` 的 Rulings 引用兩輪審查的裁決。

Epic 0005 是 epic 0003 拆分後的 verifier 那一半；0003 在第 2 輪審查後拆分。文件那一半是 epic 0004，已包含在 B0（`2577b504fa5f22fcef047a95f6d9c2afc9a2daf4`）裡，B0 的檔案就是本 spec 核對的事實。

Revision 2 套用第 1 輪的 Rulings R1–R8 與隨附的 parent 修正。Revision 3 是審查後修補：套用第 2 輪的 Rulings S1–S3 與隨附的 parent 修正，已自審，不再送審（Ruling S4）。

## 問題陳述

Epic 0004 為 repo 加了兩份根目錄授權檔：`LICENSE`（CC BY-SA 4.0）與 `LICENSE-CODE`（MIT），並讓 notices 與 provenance 紀錄指向它們，以及各 skill 自己的授權檔。目前沒有任何檢查確認這些指向是對的。

0004 之前，notices 與 provenance 紀錄寫的是「the root MIT LICENSE」，這個檔案根本不存在，卻沒有任何檢查發現。同樣的事可能再次發生：

- 授權檔被改名或刪除；
- 路徑的大小寫打錯，但在 macOS 上仍然打得開；
- 連結在 Markdown 原始碼看得到、在渲染後的頁面上看不到，例如寫在 HTML comment 裡；
- 兩個授權連結互換，CC BY-SA 的全文變成掛在「MIT」連結後面；
- 從別處複製進來的 provenance 條目寫 `"license": "MIT"`，卻指向 CC BY-SA 的 `LICENSE`。

## 解法

`scripts/verify-project.py` 新增授權引用檢查，PASS 行也會註明。這項檢查讀取 provenance 檔與 notices，凡是授權引用沒有解析到 repo 裡的一般檔案、大小寫不完全相符，或路徑經過 symlink，都會回報。另外也回報：

- provenance 條目的 `license` 與它指向的根授權檔不一致；
- notices 缺少 `[CC BY-SA 4.0](LICENSE)` 或 `[MIT](LICENSE-CODE)`；
- notices 裡任何這項檢查無法判斷的 Markdown 寫法。

這項檢查只看檔案系統，不需要 Git，也不檢查檔案是否已 commit。已 commit 的狀態由本 epic 在 HEAD 的新 worktree 上跑一次 end-to-end 來驗證；常設的檢查由 OQ-4 追蹤。

## User Stories

1. 身為執行 verifier 的 agent，我希望 provenance 檔或 notices 裡的授權引用沒有解析到一般檔案、大小寫不符或經過 symlink 時就失敗，這樣過時的授權指向在下一次執行 verifier 時就會被抓到。
2. 身為 repository owner，我希望 provenance 條目的 `license` 與它指向的根授權檔不一致時就失敗，這樣從別處複製進來的條目就無法悄悄把內容宣稱成 MIT。
3. 身為 reuser，我希望 notices 一直保有標示為 `CC BY-SA 4.0`、指向 `LICENSE` 的連結，以及標示為 `MIT`、指向 `LICENSE-CODE` 的連結，這樣我總能找到正確的授權全文。
4. 身為編輯 notices 的 agent，我希望 verifier 判斷不了的每一種寫法都帶著行號失敗，這樣在渲染頁面上被藏起來或壞掉的連結就不會無聲通過。
5. 身為閱讀失敗訊息的 agent，我希望每則訊息都寫出檔案、行號或 JSON Pointer，以及固定的原因，不可列印的字元也已跳脫，這樣我不必猜就能修正，刻意構造的值也無法偽造輸出行。
6. 身為 repository owner，我希望 verifier 保持唯讀、離線、只看檔案系統、不需要 Git，這樣任何副本在交給另一個 runtime 之前都能檢查。
7. 身為做 deck content work、會編輯 notices Assets 列的 author，我希望被提醒要跑 verifier，這樣文法不接受的列能在同一次變更裡被抓到。

## 實作決策

- **新增一個函式。** verifier 裡新增 `check_license_references(root)`，和其他本地新增的程式碼一樣標上 `# chalkdeck:`，依 `traceability.md` 定義的順序回傳訊息清單。`verify()` 在 glossary 檢查之後把這份清單加進錯誤，所以授權訊息排在最後。`main()` 照現在的方式把每一則印成 `FAIL: <message>`。
- **檢查什麼。** `traceability.md` 的四種授權引用 (a)–(d)：
  - provenance 裡任何深度的 `license_location` 值：
    - 含有 `traceability.md` 定義的 `<…>` placeholder 的值，以及句子（中間有空白）會被略過；
    - 只有頭尾有空白的值會失敗；
    - 不接受任何 URL scheme。
  - notices 的連結與圖片 destination，只略過 `#` 錨點，以及 `http`、`https`、`mailto` 的 URL。
  - 兩個必要連結，連結文字必須完全相符；圖片不算。
  - `license` 與根授權檔是否一致，訊息緊接在該條目自己的引用訊息之後。
- **路徑規則。** 目標依序在以下情況被拒絕：
  - 離開 repo（絕對路徑、反斜線、`..`），或在 scheme 步驟被判定為磁碟代號；
  - 不是單純的 repo 路徑（含 `%`、`?`、`<`、`>`、空白，或有 `.`、空的路徑段）；
  - 其餘用 `os.listdir` 與 `os.lstat` 逐段解析，讓大小寫、Unicode 正規化與 symlink 在每種檔案系統上都以相同方式判定。

  兩個輸入檔也用同樣方式走訪，所以父目錄是 symlink 時同樣會被拒絕。
- **不用 Git，不宣稱常設保證。** 這項檢查不問目標是否被追蹤；0003 的「必須被 Git 追蹤」規則與 no-Git 訊息已移除（grill Q2'）。spec 不宣稱有任何 workflow 規則會再檢查已 commit 的狀態（Ruling R1）。模組不啟動 process、不連網、不寫檔，只 import 允許清單內的標準函式庫模組；走訪 provenance 時使用自己的 stack，輸出不受遞迴深度影響。
- **notices 文法契約。** 只辨識單行的 inline 連結與圖片 `[text](dest)`、`![alt](dest)`，destination 可用角括號，可帶 title。先找出 code span，略過 code span 與 fenced block，再由左到右、不重疊地辨識連結。以下 15 種寫法會帶著行號失敗，而不是用猜的（Rulings R2、S1、S2）：
  - byte order mark、carriage return；
  - info string 含反引號的 backtick fence 開頭、有縮排的 fence 開頭、不成對的反引號；
  - 表格列上 code span、連結文字或 title 裡的 `|`；
  - raw HTML 或 autolink（code span 以外的任何 `<`，角括號 destination 與 title 除外）；
  - blockquote 行、含有區塊（fence、indented code、blockquote 或 link reference definition）的清單項目、開頭空白裡有 tab；
  - link reference definition、含連結的縮排行；
  - 連結字元的反斜線跳脫；
  - 空的連結文字，以及不屬於任何已辨識連結的 `](`。

  未關閉的 fence 也會失敗。B0 的 notices 不含以上任何一種。grill Q8 原本允許連結文字跨行，現在改為失敗。
- **訊息。** 來自檔案內容或磁碟上名稱的 placeholder 一律經過引號呈現：先做 JSON 編碼，再用 `scripts/check_style_skills.py` 既有的方式跳脫不可列印字元；那段程式碼複製過來，不用 import。JSON Pointer 依 RFC 6901，同樣加上引號。
- **不變的行為。** 既有的 provenance 檢查與訊息不變，所以 provenance 檔不存在時，`verify()` 會回報兩次。其他檢查都不變。
- **文件。**
  - PASS 行、verifier docstring、測試模組 docstring 與 `AGENTS.md` 的 build 段落提到 license references（T1–T3、T6）。
  - deck content work 新增、更新或移除 notices 的 Assets 列時要跑 verifier，FAIL 會擋住 merge；與該 deck 自己的列無關的 FAIL 交給 repository owner。這條規則寫在 `AGENTS.md` 的 slide hard rules（T7）與 `docs/agents/workflow.md` 的 deck 軌清單（T8）；ADR-0007 加上一行「Amended by ADR-0008」（T9）（Rulings R5、S3）。
  - 新增 ADR-0008，記錄 T4 列出的決策：文法契約、只看檔案系統的選擇、略過的 destination、必要的連結文字、end-to-end harness，以及對 ADR-0007 的修訂。
  - `docs/README.md` 的索引加上這份 ADR（T5）。
  - `docs/agents/runtime.md`、`docs/guide.md` 與 `README.md` 不改；`README.md:51` 仍然正確（Ruling R6）。
- **Open question。** 本 revision 在 `.proj.specs/OPEN-QUESTIONS.md` 新增 OQ-4，追蹤已 commit 狀態的常設檢查。
- **Charter 限制。** 不新增 dependency（Charter 4）。`slides/`、`themes/`、`assets/` 底下的檔案都不變（Charter 3、5）。notices 與 provenance 檔的內容也不變。

## 測試決策

- **好的測試長什麼樣子。** 在暫存目錄用一般檔案建立 fixture tree，不用 Git；呼叫 `check_license_references(root)`，逐項比對回傳的整份清單，和 `scripts/test_verify_project.py` 的 glossary 測試一樣。fixture 的 root 先經過 `os.path.realpath`，因為 macOS 的暫存目錄在 symlink 後面。matrix 的預設值固定了 fixture 的檔案與 notices 的前兩行。
- **每個子案例各一個測試。** matrix P1–O4 列出的每個子案例都是獨立的測試（一個 method 或一個 `subTest`），由 stage 5 的 test plan 表格列出，在 `/tdd` 下撰寫。
- **每個子案例都要有 red。** 在讓它轉綠的程式碼之前，把 red 記在 ticket 的 Comments：失敗輸出、HEAD commit，以及用 `git hash-object -w` 寫入的測試檔 blob。因為函式還不存在而出錯，也算 red。第一次執行就通過的子案例（不論是否預期有訊息）改用 mutation 取得 red：
  - 修改實作，讓它守護的規則不再成立；
  - 記錄失敗；
  - 還原實作。

  test plan 表格逐項寫出 mutation。這是把 ADR-0006 的 mutation 手法延伸到該 ADR 的適用範圍（禁止改變行為的票）之外；延伸是明示的，只適用於本 epic（grill Q6、Ruling R7）。
- **平台 skip。** symlink、FIFO 與權限類子案例，只有在平台做不出 fixture 或以 root 執行時才能 skip。在參考平台（macOS、非 root 使用者）上一律不 skip。其他平台上的 skip 要記錄，而且不算通過。
- **接線。** 一個測試在同時會讓 glossary 檢查失敗的 fixture 上呼叫 `verify()`，斷言回傳的錯誤以授權引用訊息結尾，並緊接在 glossary 訊息之後（W1）。
- **多張票。** 如果 stage 4 把 epic 拆成多張票，每張票寫明自己關閉哪些 row 與 AC；W2、E1–E4 與 X3 以最後落地那張票的 HEAD 判定。
- **在 Comments 裡人工核對的項目。** 以下用閱讀核對，不寫測試：
  - T1–T9 的文字；
  - process 與寫檔呼叫（W3）；
  - verifier 的 diff hunk（W4）；
  - diff 範圍（X1）。
- **End to end。** surface 是 macOS 上的 verifier CLI，指令與輸出都記在 Comments。
  - E1：在 ticket worktree 上執行。
  - E2：在暫存目錄用 `git worktree add --detach` 取出 HEAD，執行那份 checkout 自己的 script `python3 <tmp>/scripts/verify-project.py`。這是本 epic 對已 commit 狀態的唯一一次檢查。
  - E3：在那份 checkout 裡改壞第 34 行的連結，再跑一次它的 script，必須以 exit 1 結束，並且只輸出那一行預期的 `FAIL:`。
  - E4：先在 `git worktree list` 確認暫存路徑，再移除那個 worktree。

## 驗收條件

- **AC1.** provenance 的 row P1–P9 與 D1–D6，每個子案例在 HEAD 都有通過的測試；red 依測試決策的規定記錄；參考平台上沒有任何 skip。
- **AC2.** notices 的 row N1–N6、R1–R7、G1–G10 與 C1–C4 符合同樣條件。
- **AC3.** 輸入、排序與呈現的 row I1–I4 與 O1–O4 符合同樣條件。
- **AC4.**
  - W1 的測試通過。
  - 在 HEAD 的真實檔案樹上，`verify-project.py` 以 exit 0 結束，並印出 T1 的 PASS 行（W2）。
  - 閱讀模組確認 W3，閱讀它的 diff 確認 W4。
- **AC5.** verifier docstring、測試模組 docstring、`AGENTS.md`、ADR-0008、`docs/README.md` 的索引、`docs/agents/workflow.md` 與 ADR-0007 含有 T2–T9 的文字；PASS 行是 T1。
- **AC6.** end-to-end 執行 E1–E4 得到各自 matrix row 寫明的結果；指令與輸出記在 Comments，並寫明 surface 是 verifier CLI。
- **AC7.**
  - 以最新記錄的 B 執行 `git diff <B SHA>...HEAD --name-only`，只列出 row X1 的路徑。
  - B 是第一則 Comment；任何重新記錄的 B 都引用 repository owner 的同意（X2）。
  - row X3 的三個指令在 HEAD 都以 exit 0 結束。

## 範圍外

- **常設的已 commit 檢查。** 存在於磁碟上的未追蹤或被忽略的檔案會通過這項檢查。E2 驗證已 commit 狀態一次，OQ-4 處理如何在每次變更時檢查。T8 的 deck 軌步驟只在 work tree 上跑 verifier，沒有任何 workflow 規則檢查已 commit 狀態。
- **provenance 裡的句子。** 中間有空白的 `license_location` 值一律當句子略過，即使它提到根授權檔，例如「the root MIT LICENSE」。這是接受的殘餘風險（Ruling R4）。(d) 只檢查值完全等於 `LICENSE` 或 `LICENSE-CODE` 的條目。
- **其他檔案。** `README.md` 的連結（包括 `## License` 段落），以及 notices 與 provenance 檔以外任何地方的連結。發現這類連結在落地後壞掉時再重新評估。
- **授權內容。** 各 skill 自己的 `LICENSE` 內容是否符合紀錄的 `license`。只比對兩份根授權檔，而且只比對檔名。發現某個 skill 紀錄的授權有誤時再重新評估。
- **文法以外的 Markdown。** reference-style 連結不算授權引用。目標不是完整符合 CommonMark：這套文法是 notices 的契約，記錄在 ADR-0008。
- **內容變更。** notices、provenance 檔或任何授權檔的內容都不改。
- **CI。** 不把 verifier 加進 GitHub workflow。
- **第 1 輪只記錄、不修改的項目：**
  - JSON 重複 key，解析器保留最後一個值（4-13）；
  - 大型非字串值產生很長的單行訊息（4-14）；
  - 輸入檔的檢查與使用之間的競態（4-18）；
  - hardlink（4-19）；
  - regex 效能（4-20）；
  - 拼錯的 `license_location` key（4-21）。
- **重複的訊息。** provenance 檔不存在時 `verify()` 的 provenance 訊息維持不變。

## 補充說明

- **本 spec 改動的 0003 草案。** 依據：grill Q1、Q2'、Q4、Q8；Rulings R2–R4。
  - 移除：`is not tracked by Git` 這個原因、no-Git 訊息與 row V11。
  - scheme：規則改成允許清單。
  - 新增原因：`has leading or trailing whitespace` 與 `is not a plain repository path`。
  - 無法讀取的輸入：新增 `not a regular file` 與 `not readable`，並和目標一樣逐段走訪。
  - 必要連結：連結文字必須完全相符。
  - placeholder：一律使用引號呈現，JSON Pointer 也一樣。
- **相對 revision 1 的變更。** Rulings R1–R7，以及以下 parent 修正：
  - 修正 Facts at B0；
  - O3 的期望值；
  - O1 拆成 O1 與 I4；
  - E3 的行號與 E4；
  - matrix 預設值；
  - 未關閉 fence 的範圍；
  - (d) 訊息的位置；
  - 輸入檔走訪；
  - `RecursionError`；
  - W1、W3 與 W4；
  - T6；
  - 新增 row P8、D5、R7、G2、G6 與額外的子案例。
- **相對 revision 2 的變更。** Rulings S1–S3，以及以下 parent 修正：
  - row P9、D6、G7–G10，以及 G1、G2、C3、C4、I1、I2、O1–O4 的額外子案例；
  - 先找 code span 再辨識連結，連結由左到右、不重疊；
  - provenance 以自己的 stack 走訪；
  - 輸入檔改為逐步驟判定；
  - 解析時 `os.lstat` 的錯誤；
  - W1 改為「緊接在後」、W3 以識別字與 import 允許清單判定、W4 以變更行判定；
  - 改寫 T6 與 T7，新增 T8 與 T9；
  - E2、E3 執行那份 checkout 自己的 script，E4 先確認再移除；
  - red 的定義與 `git hash-object -w`；
  - 多張票的規則；
  - 改寫 OQ-4。
- **第 2 輪只記錄、不修改的項目：**
  - placeholder 以子字串判定略過（4-6）；
  - (d) 只檢查同一物件裡的 key（4-5）；
  - 標錯的額外連結（4-4）；
  - `\!` 與 HTML entity（4-17）；
  - NFD 與 casefold 造成的誤報（4-18）；
  - axis 3 其餘的 glossary、延後項目與措辭問題。
- **Retrospective 決定 1。** epic 0004 的 retrospective 問：「做到完成」這類概括授權算不算 test plan 的核准？repository owner 尚未回答。agent 會在本 epic 進入 stage 5 之前詢問。
