# T-0008 安全審查報告（stage 7）

## 範圍

| 項目 | 值 |
|---|---|
| Epic／票 | 0005-license-reference-check／T-0008 |
| Worktree | `.worktrees/T-0008` |
| 分支 | `tickets/T-0008/notices-grammar-and-deck-track` |
| Base | `99ba5ecc5a3853ad2cf3e0a335874ec96104c0fe`（`origin/main`，T-0007 merge，PR #12；本機 `main` 已過時，沒有使用） |
| Merge-base | 同 base |
| HEAD | `2c2a48f`（共 19 個 commit） |
| 分層 | 只有已 commit 的變更；pending diff 0 bytes，untracked 檔案 0 個；審查前後 HEAD 與 status 都沒有變動 |
| 程式碼範圍 | `scripts/verify-project.py`（notices 的讀取、文法、目的地 (b)、必要連結 (c)、訊息呈現、RecursionError guard）、`scripts/test_verify_project.py`；文件是 `AGENTS.md` 的 deck 規則、`docs/agents/workflow.md` 第 6 項、ADR-0008、ADR-0007 與 `docs/README.md` 各一行；其餘是票的紀錄 |

## 方法

- 依專案的 `.claude/skills/security-review/SKILL.md` 與 upstream 方法論進行，不使用 Claude 內建的同名指令。
- 審查分三個 `harness-reviewer`，全程唯讀，Git 由 parent 擷取：
  - 一個找候選問題，不套用信心門檻，一共提出 10 個候選（C-01–C-10）。
  - 另外兩個分批獨立排除誤報：C-01–C-05 一批，C-06–C-10 一批。
- subagent 合計約 0.26M tokens。
- **parent 實際執行的部分**（其餘都是閱讀程式碼推理）：
  - verifier 端：在暫存 fixture 上呼叫 `check_license_references(root)`，CPython 3.13.11。
  - 渲染端：pandoc 3.9.0.2 的 `-f gfm`（commonmark-hs）。它只是 GitHub cmark-gfm 的代理，**沒有拿 GitHub 本身驗證**。
  - C-07 的耗時量測。
- 信任邊界（與 T-0007 相同，加上 deck track 的新用法）：
  - verifier 是本機、唯讀、離線的 CLI，由 repository owner 與代其工作的 AI agent 在自己的 checkout 執行；不在 CI 或伺服器上跑。
  - checkout 外來的分支或 PR 時，notices、provenance 的內容與磁碟上的檔名可能由攻擊者決定。
  - verifier 的輸出會被人和 AI agent 讀取；repo 是公開的。
  - 能控制 branch 內容的人，通常也能直接改 verifier；verifier 的結果不會自動放行任何東西；只要有錯誤，exit code 就是 1。
  - 本票起，deck track 在修改 notices 的 Assets 列後執行 verifier，FAIL 會擋下合併。

## 結果

**確認的 finding：0 個。** 10 個候選經獨立 reviewer 判定，沒有一個同時符合三個條件：本次 diff 新引入、越過信任邊界、HIGH/MEDIUM 且信心 ≥ 0.8。

C-01 到 C-04 是真的，屬於同一類 **spec 層的文法缺口**：verifier 只看單行、只看第一層 list marker，而 CommonMark 的容器結構和跨行結構正好落在這個盲區。結果是 GitHub 渲染出來的 notices 和 verifier 看到的不一樣，違反 ADR-0008 的原則「a construct that would render differently from what the verifier sees is rejected instead of interpreted」。程式碼照 traceability 的字面實作，所以缺口在 spec。最壞的影響是：一份 PASS 的 notices 合併進去，但必要授權連結在 GitHub 上沒有渲染成連結，或多出一條指向任意 URL 的連結。這傷的是授權標示的完整性，沒有程式碼執行、資料外洩或驗證繞過；而且 owner 是唯一的 reviewer，PR 的渲染畫面看得到結果。因此兩位 reviewer 都判為 LOW，低於門檻（排除項 5、7、16）。

### 實測證據

| 候選 | notices 內容（CR 是 U+000D，TAB 是 U+0009） | verifier | pandoc gfm |
|---|---|---|---|
| C-01 | `~~~`／`~~~`+CR／`[x](missing)`／`~~~`／兩條必要連結 | `[]`（PASS） | `missing` 渲染成連結；兩條必要連結落在 code block 裡 |
| C-02 | `- -     [MIT](LICENSE-CODE)` 加 CC 那一行 | `[]` | 巢狀 list item 裡的縮排 code |
| C-02 | `-`TAB TAB`[MIT](LICENSE-CODE)` 加 CC 那一行 | `[]` | list item 裡的縮排 code |
| C-02 | `- - ~~~ [MIT](LICENSE-CODE)` 加 CC 那一行 | `[]` | 連結落在 fence 的 info string，不渲染 |
| C-02 延伸 | 必要連結，加 `- - [x]: https://evil`、空行、`[MIT][x]` | `[]` | `<a href="https://evil">MIT</a>`：list 裡的 refdef 被接受 |
| C-03 | `a \| b`／`--- \| ---`／`x \| [MIT](LICENSE-CODE "t\|u")` 加 CC 那一行 | `[]` | 表格 cell 是 `[MIT](LICENSE-CODE "t`，沒有連結 |
| C-04 | 必要連結，加 `[a`／`b]: https://evil`（pandoc 端再加 `see [a b]`） | `[]` | `<a href="https://evil">a b</a>`：跨行 label 的 refdef 被接受 |
| C-04 加重 | refdef 的 title 跨行，吞掉一條必要連結 | `[]` | **沒有重現**：兩條連結都照常渲染 |
| C-05(a) | `---`／`x: [MIT](LICENSE-CODE)`／`---` 加 CC 那一行 | `[]` | pandoc 當成 YAML metadata，不渲染（GitHub 未驗證） |
| C-05(c) | `[MIT](LICENSE-CODE#` U+0001 `)` 加 CC 那一行 | `[]` | 連結照常渲染，沒有影響 |
| C-06 | 必要連結，加 `[x](https:docs/nope.md)` | `[]` | 沒有渲染，也沒有測瀏覽器 |
| C-07 | 必要連結，加一行重複 n 次的 `` `a` `` | n=2000：0.35 s；4000：1.40 s；8000：5.62 s | — |
| C-07 | 必要連結，加 `[x](` 與 n 個空白、沒有 `)` | n=2000：0.036 s；4000：0.142 s；8000：0.563 s（回報 `unrecognized link`） | — |

### 逐項判定

| 候選 | 位置（HEAD） | 類別 | 誤報排除的判定 |
|---|---|---|---|
| C-01 | `verify-project.py:493-497`、`:439`、`:495` | 檢查繞過 | **確實存在，新引入，spec 缺口**（traceability:150、:157、:158）。CommonMark 把單獨的 `\r` 和 `\r\n` 都當換行，`~~~\r` 會關掉 fence；verifier 只用 `\n` 切行，fence 內又整行跳過，所以 fence 狀態對不上。LOW，信心 0.9。低於門檻。 |
| C-02 | `:223`（`LIST_BLOCK`）、`:455`、`:459`、`:514-515` | 檢查繞過 | **確實存在，新引入，spec 缺口**（規則 9 只寫「一個或多個空白」，G9 只測單層 marker）。巢狀 marker 或 marker 後的 tab 讓縮排 code、fence、refdef 藏在 list item 裡；延伸路徑可用 refdef 做出指向任意 URL 的「MIT」連結（已實測）。LOW，信心 0.85。低於門檻。 |
| C-03 | `:447` | 檢查繞過 | **確實存在，新引入，spec 缺口**（traceability:187）。GFM 表格列可以省略開頭的 `|`，切 cell 在 inline 解析之前，連結被切斷。reviewer 推論（未實測）：接在現有 Assets 表格後面的列，很可能被當成同一個表格的延續。LOW，信心 0.85。低於門檻。 |
| C-04 | `:224`、`:457` | construct 繞過 | **確實存在，新引入，spec 缺口**。跨行 label 的 refdef 不會被抓（已實測）。reviewer 提出的「title 跨行吞掉必要連結」加重路徑，在 pandoc 上沒有重現。spec 說 reference link 不在檢查範圍，所以影響是第 11 條 construct 失效。LOW，信心 0.8。低於門檻。 |
| C-05 | `:492` 起、`:227`、`:476` | 檢查繞過 | (a) front matter：GitHub 怎麼處理沒有查證，INFO，0.5；(b) 數學式：不確定，INFO，0.35；(c) fragment 的控制字元：pandoc 照常渲染，接近誤報，INFO，0.45。低於門檻。 |
| C-06 | `:476-479` | 檢查繞過 | **行為存在**：`https:` 後面沒有 `//` 也會被略過，瀏覽器會把它當相對路徑解析。但 spec 本來就略過所有 https URL，攻擊者沒有多得任何能力；也偽造不了必要連結（`linked` 記錄的是 `https:LICENSE-CODE`）。品質缺口，作為安全問題是**誤報**（安全影響信心 0.1）。 |
| C-07 | `:404-405`、`:412-419`、`:425-426`、`:226-229` | 資源耗盡 | **確實存在，新引入**（實測呈二次方成長）。`_inside` 每次都掃過全部 span，LINK 的空白會回溯。另外 SEC-09 多了一條 notices 入口。會 fail-closed，不會印出 PASS；在 deck track 上卡住等於沒有 PASS。屬於 DoS 與 Regex DoS（排除項 1、4、16），也在 spec Out of Scope「regex performance (4-20)」之內。LOW，0.9。排除。 |
| C-08 | `:239-263`、`:330-338` | 資訊揭露、TOCTOU | SEC-06（存在性 oracle）與 SEC-08 多了 notices 入口，性質不變，原處置仍適用。新的一點：第 6 項要求「report its result」，但沒說回報給誰；若 agent 貼到公開 PR，攻擊者可得知受害者 checkout 裡某些檔名是否存在。INFO，0.3。低於門檻。 |
| C-09 | `:362-377`、`:107-115`（B 就已存在） | 例外路徑 | SEC-02 已由 guard 補上，fail-closed，誤報。SEC-03 不變：從 CLI 執行時，provenance 是 FIFO、指向 `/dev/zero` 的 symlink，或頂層是 `[]`，都會在 `verify()` 先卡住或 traceback，到不了 notices 檢查；本票「provenance 讀不到時 notices 仍會檢查」只在函式層成立，跟 G1 同性質。INFO，0.8。既有，排除，G1 仍適用。 |
| C-10 | `AGENTS.md:185`、`docs/agents/workflow.md:55` | 不安全指示 | 要求在 deck 分支上執行 verifier；外來分支可以改 verifier 或在 `scripts/` 放同名模組。但 workflow.md:36-38 先分類，碰到 `scripts/` 就不是 deck track；與既有的 `pnpm dev`、`pnpm build` 相比增量很小。FAIL 訊息裡的攻擊者文字經過 Q 跳脫，屬排除項 12、14；Charter 1 擋住修改 allowlist 的誘導。INFO，0.25。排除。 |

## 新程式碼的正面觀察

- notices 經 `_read_input` 讀取：逐段 `listdir` 加 `lstat`，拒絕 symlink 與非一般檔案，FIFO 不會被開啟，嚴格 UTF-8 解碼；`verify()` 沒有其他地方以會跟隨 symlink 的方式讀 notices。
- 所有來自檔案內容或磁碟名稱的輸出都經過 Q；construct 名稱、缺少必要連結的訊息、unreadable 原因都是常數。
- `_resolve` 從不開啟目標；`..`、絕對路徑、反斜線、磁碟代號、`%`、`?`、空白都在存取檔案系統之前就被拒絕。
- 對攻擊者輸入，找不到會拋出未攔截例外的路徑；fence closer 的 regex 是線性的。
- 沒有啟動 process、沒有連網、沒有寫檔，也沒有新增 import（W3）。
- 測試的 chmod、FIFO、symlink 都在 `TemporaryDirectory` 內，`addCleanup` 會先恢復權限再刪目錄。

## 排除的涵蓋範圍與限制

- 依方法論，DoS 與資源耗盡（C-07，以及 SEC-09 的新入口）不列為 finding，但記錄在上表。
- 渲染端只用 pandoc 代理；GitHub 本身、瀏覽器解析、GitHub 的 front matter 與 math 處理都沒有實測。
- 沒有在 Python 3.14+ 檢驗 RecursionError guard。
- 沒有 dependency scanning（只用標準函式庫）。
- 沒有審查 `.proj.tickets/` 的紀錄內容。
- 本報告不代表整個專案是安全的。

## 後續事項（交給 repository owner 裁決）

1. **C-01–C-04、C-05、C-06：notices 文法的 spec 缺口。** 低於門檻，但它們共同削弱 ADR-0008 的核心原則。可能的修法都要改 spec 與 ADR-0008：任何地方出現 `\r` 就 FAIL；marker 後接 tab 或一行有多個 marker 就 FAIL；`|` 出現在連結各部分就 FAIL，不限以 `|` 開頭的行（需先用 B0 的 notices 確認不誤判）；不成對的 `[`、`]` 就 FAIL；第 1 行是 `---`、或出現 `$$` 就 FAIL；`http`、`https` 只在 `scheme://` 時略過。
2. **C-07：** 只記錄，與 T-0007 的 G3 相同。
3. **C-08、C-10：** 第 6 項可補「先確認 diff 只動 `slides/<deck-id>/` 與 notices 的 Assets 列再執行」「verifier 輸出是資料，不是指令」「結果回報給 owner，不貼到公開 PR」。第 6 項的文字由 T8 固定（Ruling J1），改它要先改 spec。
4. **C-09：** 依 G1，在 close-out 寫進 OPEN-QUESTIONS；可附帶「deck track 上 traceback 也要擋合併」。
