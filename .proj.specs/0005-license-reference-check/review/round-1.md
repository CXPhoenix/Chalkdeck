# Round 1 — 0005-license-reference-check

Spec version: spec.en.md d7ac275ca82a84b5d7401477c58ada13104f4c97 / traceability.md be6013a410236ccb565550f82ac8975518218df3
Prompt: `review/prompt.md` (frozen, blob 39b928d7e9b39545425f50e7fe613ed8e21e3215, commit aad94f7). One `harness-reviewer` per axis, run in parallel. Reports recorded as returned, condensed by the parent; no finding dropped. Axis 4 numbered its findings `R4-n`; they are recorded here as `4-n`.

Totals: **P0 0**, P1 21, P2 59, plus axis 4's 6 intended consequences (E-1 to E-6) and 4 out-of-axis observations.
Subagent tokens: about 0.48M (axis 1 0.12M, axis 2 0.10M, axis 3 0.15M, axis 4 0.11M).

## Parent verification (2026-10-23)

- `git diff --stat 2577b504… -- THIRD_PARTY_NOTICES.md docs/agents/skill-sources.json scripts/ AGENTS.md` is empty: the reviewers' disk reads equal B0.
- Confirmed: `traceability.md:341` holds a literal U+2028 (the parent's tool call turned the escape ` ` into the character). Q(x) yields the six characters ` `.
- Confirmed: notices have 30 lines with backticks, all in same-line pairs, lines 10 and 11 included. "no backtick" in Facts at B0 is wrong; "no indented line" holds only for 4+ spaces (lines 81, 83, 84 and 86 have 2; line 84 holds a link).
- Confirmed: the notices end with a newline; `wc -l` is 183, `split("\n")` gives 184 items.
- Confirmed for 4-3 to 4-5 at B0: no `<`, no blockquote line, no tab, no image in the notices.

## Axis 1 — Completeness

總計：P0 0、P1 8、P2 18。AC1–AC7 都有 row 對應，每一列 row 也都對應到 AC；缺口在沒有 row 的組合，以及 row 本身的缺陷。

### P1
- **1-1** O1 要求同一個 fixture 涵蓋五組各一個壞 reference，但輸入讀不到時會跳過 (a)(d) 或 (b)(c)，第 1 組不可能與第 2–5 組並存；也沒有「兩個輸入都讀不到」的順序 row。（高）
- **1-2** O3 的 U+2028 期望值是字面上的字元，與 Q 的定義矛盾。（高）
- **1-3** Facts at B0 寫「no backtick」，但 notices 有 30 行 code span，第 10、11 行的 code span 和必要連結在同一行；沒有「code span 與 recognized link 同一行」的 row。「no indented line」也有歧義（第 84 行是 2 格縮排加連結）。（事實高，分級中）
- **1-4** (a) 的 path rules 只有 `does not exist` 有 row；provenance 的 outside、not plain、case、symlink、not a regular file 都沒有 row，簡化的實作也能通過。（中）
- **1-5** 沒有任何會產生訊息的 row，其 JSON Pointer 經過 array index。（中）
- **1-6** (d) 訊息相對於巢狀 reference 的位置，以及 `license` key 排在後面時的順序，都沒有定義也沒有 row。（中）
- **1-7** fence 的邊界沒有 row：1–3 格縮排、4 格縮排不開 fence、換字元收尾、收尾較短、收尾行後還有文字、info string、tab。（中低）
- **1-8** 輸入檔的父目錄是 symlink 時沒有定義也沒有 row（沿用 0003 round-2 1-8、4-16）。（中）

### P2
- **1-9** 矩陣前言沒定義預設的 provenance fixture；G2 的 unclosed fence 放在必要連結前或後，會影響完整 list。
- **1-10** I3 沒說是哪個輸入；notices 的 BOM 與 CRLF（收尾 fence 行帶 `\r` 會被當成未關閉）沒有 row。
- **1-11** 深層巢狀 JSON 的 `RecursionError` 沒有 row（`check_style_skills.py:931` 有先例）。
- **1-12** (a) 步驟優先序：`" <x>"`、`" a b"`、Unicode 空白（U+3000、U+00A0）、`true`/`false`、`NaN` 沒有 row。
- **1-13** 路徑規則優先序：`../a b`、`...` segment、`LICENSE#a%20b`（fragment 先移除）沒有 row。
- **1-14** 逐段解析：多個 casefold 候選（macOS 做不出 fixture）、exact 優先於 casefold、大小寫不符的 symlink、`listdir` 的 `PermissionError`、FIFO，都沒有 row。
- **1-15** code span：雙反引號、長度不同的 run、跨行、destination 或連結文字含反引號，沒有 row。
- **1-16** recognized link：連結文字跨 fence 行、`(`…`)` 跨行、destination 前後空白、title 前無空白、成對括號 `[x](a(b))`、空連結文字，沒有 row。
- **1-17** unsupported construct：六種之間的優先序只測 G3 一組；backslash 只測 `\[`；`\` 接其他字元；1–3 格縮排的 reference definition 與帶連結的行（B0 第 84 行的形狀），沒有 row。
- **1-18** 「construct 那一行的連結仍被辨識與檢查」只出現在 Example，沒有 row；這種連結能否滿足 (c) 也沒有。
- **1-19** (c)：只有圖片、大小寫不同的 `[x](license)`、reference-style、autolink、`<a href>`，沒有 row。
- **1-20** (d)：`"mit"`、`"MIT "`、數字型 `license`、`" LICENSE"` 或 `license` 的 location，沒有 row。
- **1-21** JSON Pointer 的 key 含控制字元、空字串、`"`，沒有 row。
- **1-22** spec 承諾但沒有 row：「No other check changes」、「right after `check_glossary`」、`# chalkdeck:` 標記、read-only、「runs no subprocess」（W3 只看 import，抓不到 `os.system`、`os.popen`、`os.exec*`）。
- **1-23** 測試檔的模組 docstring（`scripts/test_verify_project.py:1`）會過時，沒有 T row。
- **1-24** 流程要求沒有 row：coverage report table、Retrospective decision 1、red 證據所記 commit 不含當時的測試、非瀏覽器 harness 的 ADR 或 OQ（X1 不允許改 `OPEN-QUESTIONS.md`）。
- **1-25** E3 的 `<line>` 未填（B0 是 34）；暫存 worktree 沒有清理 row。
- **1-26** 「184 lines (counted on `\n`)」有兩種讀法（183 個換行，184 個 split 元素）。（低）

### 軸外觀察
- deck 軌可以改 notices 的 Assets 表而不跑 verifier，日後可能讓 main FAIL；T4 的後果沒處理（轉軸 3、4）。

## Axis 2 — Verifiability

總計：P0 0、P1 5、P2 14。逐條檢查 AC1–AC7 沒有含糊用語；手算矩陣與 Example，除下列外都與定義一致。

### P1
- **2-1** O3 的 U+2028 期望值與 Q 的定義矛盾，判斷時必須先決定哪一邊是 oracle。（高）
- **2-2** O1 照字面寫不出來（同 1-1）。（高；從嚴可主張 P0）
- **2-3** 只為「不預期訊息」的 sub-case 定了 mutation；「預期訊息」但前面實作已涵蓋、第一次就綠的 sub-case（P7、N5、D4、O1、O2、C4）沒有 red 程序。（中）
- **2-4** unclosed fence 開頭之後的行是否仍不檢查沒定義，預設必要連結的位置也沒定義，G2 的完整 list 因此不唯一；`unclosed code fence` 不在構造清單裡。（中）
- **2-5** Facts at B0 的「no backtick」錯誤，code span 是 W2 的承重路徑，矩陣沒有對應 row。（事實高，分級中）

### P2
- **2-6** 預設 fixture 沒有說 provenance 是否存在、內容為何。
- **2-7** red 是每列 row 一份還是每個 sub-case 一份不清楚；「with the commit it ran at」在 test 未 commit 時的意思；mutation 由誰指定、記在哪裡（ADR-0006 要求 test plan 列出）。
- **2-8** E3 的 `<line>` placeholder 未填，任何行號都能判為通過。（高）
- **2-9** 未定義：unmatched backtick 之後的文字算 code 還是一般文字；連結文字內的 code span 含 `]`；空連結文字；「blank line」是否含只有空白的行。
- **2-10** 「runs no subprocess」只檢查 import，`os.system` 等抓不到。
- **2-11** 「right after `check_glossary`」、`# chalkdeck:`、「No other check changes」沒有 AC 能判定。
- **2-12** R5、I3 允許 skip，skip 不等於 pass；skip 時 AC 算不算通過沒定義。
- **2-13** I3 沒指定是哪個輸入。（低）
- **2-14** merge main 之後 B 被重新記錄，與 AC7「B is the first Comment」衝突；X1 該用哪個 B；owner consent 的證據形式。
- **2-15** T4 不是固定文字，只能靠閱讀判斷；ADR 日期的 key 名稱與「撰寫日」無法驗證。（低）
- **2-16** (d) 訊息與夾在中間的巢狀子物件訊息的順序（同 1-6）。（低）
- **2-17** 輸入檔 `os.lstat` 拋出其他 `OSError` 時的 reason 未定義。（低）
- **2-18** N6、O1、O2、I2、R5 只寫性質，沒列完整 list；N6 第二個 sub-case 沒說 `\r` 與壞 destination 的位置。
- **2-19** 「184 lines」的讀法（同 1-26）。（低）
- **2-20** spec prose 把 drive 放在 path rule 1，traceability 放在 scheme 步驟；「Retrospective decision 1 must be answered before stage 5」沒有 gate。（低）

### 軸外觀察
- deck 軌改 notices 會受文法檢查；兩個輸入檔名大小寫錯誤時結果隨平台不同；深層巢狀 JSON 的 `RecursionError`。

## Axis 3 — Contract conflict

總計：P0 0、P1 4、P2 10。Charter 3–5、ADR-0001 至 0005（ADR-0004 除 3-2）、hard rules 1、3、4、5、語言規則、GLOSSARY 用詞、verifier 既有 seam、0003→0005 的明示變更、Facts at B0 的數量與行號都已核對無衝突。

### P1
- **3-1** spec 說 stage 8 要求在 HEAD 的新 worktree 跑 verifier、之後每張票都從新的 `main` worktree 開始，但 `workflow.md:148-167` 與 `runtime.md:105-106` 都沒有這種規定；ADR-0008 卻要把它記成長期保證。（文字高，影響中）
- **3-2** 窄文法綁到 deck 軌也能改的 notices（ADR-0007:44-50、`workflow.md:60`、GLOSSARY:62-66、AGENTS.md），但 deck 軌不跑 verifier；spec 沒明說這是對 ADR-0007 的新增限制。（中）
- **3-3** O3 違反 Q 的定義、`printable` seam 與 user story 5。（高）
- **3-4** 0004 spec:221-222 把 `README.md` 的 verifier 描述交給 0005，本 spec 沒處理也沒明說不處理（`README.md:51`）。（中高；也可能只算 P2）

### P2
- **3-5** ADR-0006:20-21 限定「禁止行為改變的票」才用 mutation；spec 寫「只借技術」但沒明說覆寫。此外「no-message sub-case 一有函式就綠」不普遍成立（P2 placeholder、N2 `https:` 在一般 `/tdd` 順序下會自然紅）。owner 已在 Q6 核准。（中）
- **3-6** Facts at B0「no backtick」錯誤，self-check 的衝突檢查建立在錯誤事實上。（事實高）
- **3-7** spec.en.md:96-97 說「每個 placeholder 都經 Q」，traceability:59-60 說 JSON Pointer 只經 `printable` 不加引號，兩處矛盾。（高）
- **3-8** `workflow.md:166-167` 要求非瀏覽器 harness 記成 ADR 或列入 OQ；ADR-0008 沒記錄 verifier CLI 的 harness 選擇，X1 也不允許改 `OPEN-QUESTIONS.md`（沿用 0003 3-20(b)、3-12）。（中）
- **3-9** `workflow.md:67-69` 要求決定成形時就寫 ADR，ADR-0008 卻延到 stage 5。（中低）
- **3-10** spec.en.md:30 的「reader」是 GLOSSARY 的 Avoid 詞（Reuser、Audience）。（中）
- **3-11** spec.en.md:55 的「template entry」易與 GLOSSARY 的 template 用法混淆。（低）
- **3-12** 測試模組 docstring 會過時（同 1-23）。（中）
- **3-13** Deferred 項目沒照 `workflow.md:200-210` 記成 `pending` ticket 或 OQ，沒有 revisit 條件。（低）
- **3-14** (a) spec 說 0004「landed on main at B0」，實際 0004 合併是 `ef78392`，B0 是之後的 close-out 合併，應寫「B0 已包含 0004」；(b) 構造比 grill Q8 多兩種，符合 Q3 原則，不算衝突；(c) spec 目錄裡的 `grill.md` 不在 layout 中，但 0004 已有前例。（低）

### 軸外觀察
- E2、E3 的暫存 worktree 沒有清理規定（沿用 0003 4-23）；spec.zh-TW.md 依 language.md 尚未產生，不算衝突。

## Axis 4 — Red team

總計：P0 0、P1 4、P2 17，另記 6 項刻意的後果。未逐字讀 GLOSSARY.md、issue-tracker.md 與 ADR-0001 至 0006。

### P1
- **4-1** provenance 的「句子略過」放過問題陳述自己舉的回歸：`"the root MIT LICENSE"`、`"LICENSE (repository root)"` 都被當句子略過，(d) 也只看完全等於 `LICENSE` 的值；含 `<` 的值（`LICENSE<old>`）一律略過。（高）
- **4-2** 「每個目標都已 commit」的保證沒有成文：沒有規則要求 ticket 從新 worktree 開始，E2 只跑一次，CI 不跑，deck 軌不跑 verifier；`node_modules/` 下的檔案或沒 `git add` 的改名都會在本機通過。（高）
- **4-3** raw HTML 與 autolink 裡的連結樣文字會被當成 recognized link 並滿足 (c)：type 6 HTML block（`<div>` 下一行）、`<pre>`、`<?…?>`、`<![CDATA[`、`<img alt="[x](LICENSE)">`、`<https://example.org/[x](LICENSE)>`，頁面上都沒有連結。（高）
- **4-8** O3 的 U+2028 期望值與 Q 矛盾；若遷就 O3 放過 U+2028，會在把它當換行的工具裡偽造輸出行。（高；從 verifiability 看可升 P0）

（報告開頭的總計寫 P1 5、P2 16，但內文逐項標為 P1 的只有 4-1、4-2、4-3、4-8 四項，其餘 17 項標為 P2。這裡依內文記錄。）

### P2
- **4-4** 區塊模型與 CommonMark 不一致：blockquote 裡的 tilde fence、1–3 格空白加 tab 的 indented code、檔首 BOM、單獨的 `\r`，都能讓連結「看不見卻計數」，或讓看得見的壞連結不被檢查。（中高）
- **4-5** info string 含反引號的行（`` ```x``` ``）被誤判成 fence，造成雙向錯位：壞連結不檢查、程式碼裡的連結卻滿足 (c)。（中高）
- **4-6** 多行連結文字只禁止空行與 fence 行，跨標題、list、表格分隔行、`---` 仍被當連結；「blank line」未定義。（中）
- **4-7** 空連結文字 `[](LICENSE)` 與圖片 `![x](LICENSE)` 都能滿足 (c)。（高）
- **4-9** (c) 不檢查連結文字與檔案的對應，`[CC BY-SA 4.0](LICENSE-CODE)` 與 `[MIT](LICENSE)` 互換照樣通過。（高；是否列入範圍由 owner 決定）
- **4-10** 輸入檔的上層目錄若是 symlink，會讀到 repo 外的 provenance；與逐段拒絕 symlink 的規則不一致（沿用 0003 4-16）。（中）
- **4-11** 深層巢狀 JSON 的 `RecursionError`、Python 3.11 超過 4300 位數整數的 `ValueError` 不在規格內，verifier 會以 traceback 結束。（中）
- **4-12** JSON Pointer 不加引號，key 如 `x does not exist` 能在同一行偽裝成另一種 reason。（中）
- **4-13** JSON 重複 key 只檢查最後一個值，人讀原始檔看到的是第一個。（中）
- **4-14** 非字串 `license_location` 整個序列化成一行 FAIL，可能非常長。（高）
- **4-15** Facts at B0「no backtick」錯誤。（高）
- **4-16** T4 寫「only http, https and mailto destinations are skipped」，漏了 `#anchor`。（高）
- **4-17** deck 軌改 notices 可能讓 verifier 壞掉而不在當下被發現，錯誤歸屬轉到無關的 ticket。（中）
- **4-18** 輸入檔與逐段解析的 TOCTOU（換成 FIFO 會阻塞、換成 symlink 會讀別的檔），需要本機寫入權限。（中）
- **4-19** hardlink 通過檢查；Git 不保留 hardlink，影響極小。（高）
- **4-20** 多行連結文字若用回溯式 regex 實作，可能二次方時間。（低）
- **4-21** `license_location` key 拼錯時整筆靜默略過；placeholder 不會對照 group 的 `skills` 清單。（高）

### 刻意的後果（不算 finding）
- **E-1** 未追蹤或被忽略的檔案在單元檢查中通過，只靠 E2 補（強度見 4-2）。
- **E-2** `http`、`https`、`mailto` 與 `#anchor` 從不檢查，包括可能指向錯誤授權的絕對 URL。
- **E-3** README 連結、散文授權敘述、skill LICENSE 內容都不檢查。
- **E-4** notices 出現文法以外的寫法就一律 FAIL，影響撰寫速度，屬已接受的取捨。
- **E-5** 缺少 provenance 時 `verify()` 報兩次。
- **E-6** case 不符的訊息會揭露磁碟上相近的檔名，只限本機執行。

## Rulings

Pending: the repository owner adjudicates the P1 findings and the revision path.
