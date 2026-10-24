# T-0007 安全審查報告（stage 7）

## 範圍

| 項目 | 值 |
|---|---|
| Epic／票 | 0005-license-reference-check／T-0007 |
| Worktree | `.worktrees/T-0007` |
| 分支 | `tickets/T-0007/provenance-license-references` |
| Base | `46cfe0331d2edb69bdbb62fa72f162b794b05bac`（`origin/main`，spec merge，PR #11） |
| Merge-base | 同 base |
| HEAD | `e9b3962`（共 14 個 commit） |
| 分層 | 只有已 commit 的變更；pending diff 0 bytes，untracked 檔案 0 個；審查前後 HEAD 與 status 都沒有變動 |
| 程式碼範圍 | `scripts/verify-project.py`、`scripts/test_verify_project.py`、`AGENTS.md`（只改 build 段落的字樣）；其餘是票的紀錄 |

## 方法

- 依專案的 `.claude/skills/security-review/SKILL.md` 與 upstream 方法論進行，不使用 Claude 內建的同名指令。
- 審查分三個 `harness-reviewer`，全程唯讀，Git 由 parent 擷取：
  - 一個找候選問題，不套用信心門檻，一共提出 13 個候選。
  - 另外兩個分批獨立排除誤報：SEC-01–06 一批，SEC-07–13 一批。
- subagent 合計約 0.38M tokens。
- 所有判定都靠閱讀程式碼推理，沒有執行任何重現。
- 信任邊界：
  - verifier 是本機、唯讀、離線的 CLI，由 repository owner 與代其工作的 AI agent 在自己的 checkout 執行；不在 CI 或伺服器上跑。
  - checkout 外來的分支或 PR 時，provenance 檔的內容與磁碟上的檔名可能由攻擊者決定。
  - verifier 的輸出會被人和 AI agent 讀取。
  - repo 是公開的。
- 兩個誤報排除 reviewer 都指出一個共同前提：能控制 branch 內容的人，通常也能直接改 `scripts/verify-project.py`；verifier 的結果不會自動放行任何東西；只要有錯誤，exit code 就是 1，偽造輸出行也無法讓它變成真的 PASS。

## 結果

**確認的 finding：0 個。** 13 個候選經獨立 reviewer 判定，沒有一個同時符合三個條件：本次 diff 新引入、越過信任邊界、HIGH/MEDIUM 且信心 ≥ 0.8。以下是逐項判定。

| 候選 | 位置 | 類別 | 初判 | 誤報排除的判定 |
|---|---|---|---|---|
| SEC-01 | `verify-project.py:282-287`、`:345`、`:351` | 資源耗盡 | low, 0.8 | **確實存在，而且是新引入的**：`_locations` 展開節點時，會一次建出所有子節點的完整 JSON Pointer，構造好的 3 MB 檔可放大到 TB 級配置；Q 對巢狀的 `license_location` 有 O(深度×大小) 的重複呈現。但它屬於 DoS（upstream hard exclusion 1、4），會 fail-closed，不會印出 PASS。不列入；記入排除的涵蓋範圍。 |
| SEC-02 | `:224`（`_quoted` 的 `json.dumps`） | 例外路徑 | low, 0.55 | 已依 Ruling E3 延到 T-0008。依程式碼推理，在 CPython 3.11–3.13 觸發不了：頂層必須是物件，使 dumps 的深度不會超過 loads 已接受的深度。3.14+ 需要實測。不列入。 |
| SEC-03 | `:107-115`（B 就已存在，不在 diff 內） | DoS、例外路徑 | low, 0.85 | **既有問題**：`verify()` 先用 `read_text` 讀同一個檔案，會跟著 symlink 走（指向 `/dev/zero` 會讀到記憶體耗盡，指向 `/dev/tty` 會卡住）；頂層是 `[]` 或 `{"skills": 5}` 時拋出的 `TypeError`，以及深層巢狀拋出的 `RecursionError`，都不在 except 名單裡。因此從 CLI 執行時，本票新增的「頂層不是物件」「深層巢狀」「FIFO」處理走不到。指向一般檔案的 symlink、missing、目錄、權限 000、非 UTF-8、無效 JSON 在 CLI 上仍看得到新訊息。spec 明訂既有檢查不變。不列入；另列功能缺口（見下方「後續事項」）。 |
| SEC-04 | `:221-225` | 輸出注入 | info, 0.5 | `isprintable()` 會放行可列印但具欺騙性的字元（組合符號、外觀像空白的 Lo 字元、全形引號、RTL 字母），只能在同一行內造成混淆，無法偽造新的一行或注入 ANSI。屬 log spoofing 與 AI context 的排除項（12、14），行為符合 spec 的 Q 定義。不列入。 |
| SEC-05 | `:225` | 輸出格式 | info, 0.4 | `unicode_escape` 會產生 `\x7f`、`\U000e0001` 這類不合法的 JSON 跳脫，但 spec 沒有要求輸出是 JSON，而且輸出可以唯一還原。誤報。（附帶：docstring 的「JSON text」措辭容易讓人誤以為可以直接當 JSON 解析。） |
| SEC-06 | `:228-252` | 資訊揭露 | info, 0.3 | 只能在 repo 內，用猜測的名稱確認檔案是否存在，或得知實際的大小寫；不讀內容，也無法越出 repo；而且要受害者主動公開輸出才會外洩。這是 spec Out of Scope「Committed state, standing」明訂的行為。不列入。 |
| SEC-07 | `:262-263`、`:339`、`:349-350` | 檢查可被繞過 | info, 0.7 | placeholder 以子字串判定（4-6）、句子略過（R4）、重複 key（4-13）、(d) 只檢查同一物件（4-5），都是 spec 已記錄並接受的。同形字檔名只要檔案真的存在就會通過，這是契約規定的正確行為，不是繞過。不列入。 |
| SEC-08 | `:315-323`、`:238-247` | TOCTOU | info, 0.2 | 需要另一個同時執行的本機程序（hard exclusion 8），spec 已以 4-18 記錄。而且既有的 `:108` 會直接跟著 symlink 讀，比這個 race 更直接。不列入。 |
| SEC-09 | `:238-241` | 資源耗盡 | low, 0.6 | 每個值、每一段路徑都會重新列目錄；只有找不到時才對整個目錄做 NFC 加 casefold。屬 CPU 耗盡（exclusion 1、4），而且要在 PR 裡塞大量檔案，非常顯眼。不列入；記入排除的涵蓋範圍。 |
| SEC-10 | `:323` | 資源耗盡 | info, 0.5 | 只在確認是一般檔案後才讀，所以大小受限於 checkout 裡實際存在的檔案；既有的 `:108` 本來就會先整份讀入。整數位數已由 `_parse_int` 限制。不列入。 |
| SEC-11 | `:209-210`、`:59`、`:75`、`:77`、`:83-84`、`:90-91`、`:95`、`:100-101`、`:104`（都在 B 就已存在） | log forging | low, 0.75 | **既有問題**：glossary 與 skill tree 的訊息直接印出磁碟上的名稱，沒有跳脫；committed 的檔名若夾帶換行、ESC 或 bidi 字元，可以在 stderr 偽造整行，但 exit code 仍是 1。本票新增的程式碼，所有來自磁碟或檔案內容的值都經過 Q。不列入；另列後續事項。 |
| SEC-12 | `test_verify_project.py:14-16`、`:543` | 測試 | info, 0.35 | (a) **既有問題**：`spec_from_file_location` 加 `exec_module` 會載入 `scripts/__pycache__` 裡強制 commit 的 unchecked-hash pyc，而不是原始碼。這只影響跑測試，不影響以 `__main__` 執行的 CLI；且在不受信任的分支上跑測試，本來就等於執行對方的程式碼（exclusion 11）。(b) FIFO 測試沒有 timeout，屬於測試穩定性，不是安全問題。不列入。 |
| SEC-13 | `:233`、`:236-251` | 延後項目 | info, 0.6 | rule 2 的空白字元在 T-0007 走不到；共用的 `try` 一律 fail-closed 回報 `does not exist`。不會越出 repo，也不會 fail-open。不列入。 |

## 新程式碼的正面觀察

- 解析授權目標時只做 `os.listdir` 與 `os.lstat`，從不開啟目標檔案，每一段路徑都拒絕 symlink。
- 讀 provenance 檔前，先逐段拒絕 symlink 與非一般檔案，FIFO 不會被開啟。
- 所有來自檔案內容或磁碟名稱的輸出都經過 Q，找不到未經 Q 就印出的值。
- 沒有寫檔、沒有啟動 process、沒有連網，也沒有新增依賴（W3）。

## 排除的涵蓋範圍與限制

- 依方法論，DoS 與資源耗盡（SEC-01、SEC-09、SEC-10）和 hardening 類（SEC-04、SEC-05、SEC-08）不列為 finding，但記錄在上表。
- 沒有做 dependency scanning：本變更只用標準函式庫。
- notices 這一側屬於 T-0008，不在本次範圍。
- 票的紀錄只用來比對延後項目，沒有當作程式碼審查。
- 所有判定都是程式碼推理；SEC-02 在 Python 3.14+ 是否觸發得了，沒有實測。
- 本報告不代表整個專案是安全的。

## 後續事項（不是本票的 finding，交給 owner 決定）

1. **SEC-03 的 CLI 層缺口。** 票的 Deliverable 說，provenance 讀不到時會「給一行 `cannot read license references` 而不是 traceback」。這在函式層成立，但在 CLI 層，頂層是 array、深層巢狀、symlink 指向特殊裝置時，既有的 `verify()` 會先 traceback 或卡住。spec 規定既有檢查不變，要修就需要 owner 裁決，可以放進 T-0008，或另開 epic。
2. **SEC-11** 既有訊息沒有跳脫，以及 **SEC-12(a)** 測試會載入強制 commit 的 pyc：都是 B 就存在的 hardening 缺口，建議在 epic 結案時寫進 OPEN-QUESTIONS 或後續 epic。
3. **SEC-01** 可選擇性 hardening：pointer 改成延後組出，Q 加上長度上限。
4. **SEC-02** 的可達性推導，交給 T-0008 的「Determine whether it is reachable」當參考。
