# Round 2 — 0005-license-reference-check

Spec version: spec.en.md 656a8a250fd54cab1eb562ebe16136a318df65d3 / traceability.md 3a745116629c33e53e3488b1ca36cf65193164b9 (revision 2, commit 574cbef)
Prompt: `review/prompt.md` replayed verbatim (blob 39b928d7e9b39545425f50e7fe613ed8e21e3215, unchanged since aad94f7). One `harness-reviewer` per axis, run in parallel. Reports recorded as returned, condensed by the parent; no finding dropped.

Totals: **P0 0**, P1 12 (axis 1: 4, axis 2: 4, axis 3: 1, axis 4: 3; 1-2 and 2-3 are the same finding), P2 65, plus axis 4's 7 intended consequences (I-1 to I-7).
Subagent tokens: about 0.56M (axis 1 0.13M, axis 2 0.14M, axis 3 0.15M, axis 4 0.14M). Both rounds: about 1.04M.

## Parent verification (2026-10-23)

- 2-1 confirmed: the required reason `is empty` contains the substring `pty`.
- 2-5 confirmed: `\n` and U+2028 are whitespace to `str.isspace()`, so a provenance string holding them inside is skipped as a sentence by (a) step 4.
- 4-1 and 4-2 at B0: 23 notices lines are table rows (lines 8–144); no code span on a table row holds `|`. 26 lines are list items; none has a fence, a link reference definition, `>` or 5 or more spaces after its marker.
- 3-3 / 4-9 confirmed: OQ-4's "deck content work does not run the verifier at all (round-1 Ruling R1)" contradicts T7 and Ruling R5, and R1 says no such thing. The parent's wording error.

## Axis 1 — Completeness

總計：P0 0、P1 4、P2 19。AC1–AC7 與每一列 row 雙向對應；round-1 的 1-1 至 1-8 大多已補 row。

### P1
- **1-1** document order 的「同層 key 依序、array item 依序」沒有 row 能判定：每個 P／D fixture 只有一個產生訊息的值，`sort_keys` 或倒序走 array 的實作照樣通過；只有 Example 區分得出來。（高）
- **1-2** I1、I2 的「另一個輸入仍會被檢查」在預設 fixture（`{}` 與兩條合法連結）下觀察不到；讀不到就整個停掉的實作照樣通過；第 1 組與第 2–5 組同時出現也沒有 row。（中高；同 2-3）
- **1-3** 輸入檔路徑大小寫不符時視為 `missing`，沒有 row；在 macOS 上這是區分「逐段走訪」與「直接開檔」的唯一情況。（中）
- **1-4** (d) 套用到巢狀物件與 array 內物件沒有 row；只檢查頂層的實作通過 D1–D5 與 W2，而真實檔案的 (d) 物件都在 `/skills/<name>/licensing`。（中）

### P2
- **1-5** 目標解析時 `os.lstat` 拋出 `OSError`（目錄有 r 沒有 x）沒定義、沒 row。
- **1-6** construct 行上的 recognized link 計入 (c)，沒有 row（round-1 1-18 的另一半）。
- **1-7** self-check 宣稱的邊界在 matrix 沒有：`<a b>`、`<>`、任何 `>` 的 path rule 2 row、priority pairs 只有兩組。
- **1-8** construct 優先序只測兩組：`\<`、backslash 加反引號、`[x](<a> b)`、tab 開頭的 triple backtick、`![](a.png)` 都沒有 row。
- **1-9** backslash escape 只測 `\[`、`\(`；`\]`、`\)`、`\>`、`` \` `` 沒有 row。
- **1-10** fence 邊界：tilde opener 的 info string 含反引號、tilde fence 被反引號收尾、closer 後只有空白或 tab、縮排 4 格的 closer、fence 行帶 `\r`。
- **1-11** code span 規則：雙反引號 span 含單反引號、長度不同的 run、unmatched backtick 之後的連結（應同時有 construct 與 reference 訊息並計入 (c)）、連結文字內的 code span、destination 含反引號。
- **1-12** recognized link 語法邊界：destination 前後空白（影響 (c)）、title 前沒有空白、title 含自身分隔字元、成對括號、U+3000。
- **1-13** 縮排邊界：3 格縮排加連結、1–3 格與 4 格的 `>`、只含 tab 的空白行、不在行首的 tab、第 1 行以外的 U+FEFF。
- **1-14** (c) 的連結文字邊界：`[ MIT ](LICENSE-CODE)`、`[mit](LICENSE-CODE)`、帶 title 的必要連結、reference-style `[MIT][1]`。
- **1-15** Q 沒被完整釘住：O3 在 `ensure_ascii` 為 True 或 False 時輸出相同；沒有可列印非 ASCII 值、含 `"` 或控制字元的磁碟名稱、含 `"` 的 destination 的 row。
- **1-16** O1 沒規定 construct 在壞 destination 之後的行；O2 沒要求字典序與欄位順序相反；第 3 組內多行 construct 的排序沒有同一 fixture 驗證。
- **1-17** casefold 多候選取 sorted 第一個、exact 優先，都沒 row；macOS 做不出 fixture，spec 沒說可以 patch `os.listdir` 或接受不驗證。
- **1-18** unreadable 表裡缺 row：過長整數、只在 walk 發生的 `RecursionError`、輸入檔是 FIFO、`docs` 是一般檔案、provenance 父目錄無法列出、空的 notices、沒有結尾 `\n` 的 notices。
- **1-19** 「offline」沒有 row；W3 沒列 `socket`、`urllib`、`http.client`，「writes no file」漏了 `mkdir`、`unlink`、`rename`、`replace`、`os.open` 寫入 flag、`Path.touch`、`shutil`。
- **1-20** W4 允許的 hunk 不含新增的頂層 import（`unicodedata`、可能還有 `stat`）。
- **1-21** (a) 的特殊值：`NaN`、`Infinity`、lone surrogate、空 placeholder `<>`。
- **1-22** 「`verify()` 報兩次」沒有 row；Retrospective decision 1 沒有 gate；coverage report table 沒有 AC。
- **1-23** 「reference-style link 不檢查」沒有 row（`[x][missing]` 應無訊息）。

### 軸外觀察
- OQ-4 與 T7、R5 矛盾；T7 只改 AGENTS.md 而 workflow.md 的 deck 軌清單不變；ADR-0007 沒有對應的 Amended-by 註記（轉軸 3）。

## Axis 2 — Verifiability

總計：P0 0、P1 4、P2 15。AC1–AC7 沒有含糊用語，每條都寫了檢查方式；手算全部 row 與 Example，除 O3 外與定義一致。

### P1
- **2-1** W3 要求模組裡找不到 `pty`，但必要 reason `is empty` 就含這個子字串；`os.exec*` 等 glob 的比對方式也沒定義。（事實高，分級中）
- **2-2** W4 允許的四種 hunk 不含頂層 `import unicodedata`；最直接的實作照字面會 FAIL。（中）
- **2-3** 「另一個輸入仍會被檢查」在預設 fixture 下無法觀察，mutation 也轉不紅（同 1-2）。（高）
- **2-4** T7 的句子把反引號寫成 `` \` ``，放在 code span 內時反斜線不會跳脫；AGENTS.md 應該是字面 `` \` `` 還是 code span，兩種都能說符合。（中高）

### P2
- **2-5** O3：`\n` 與 U+2028 是空白，放在 provenance 字串中間會被當句子略過；O3 沒說要放在頭尾或包在非字串值裡。Q 的 oracle 本身正確。（高）
- **2-6** W4 的 hunk 邊界：新函式靠近 T1 會併成同一個 hunk；「under a `# chalkdeck:` comment」的範圍未定義，與 W 的「marked」不一致。
- **2-7** W3 抓不到 `open(p, "r+")`、`os.open(..., O_WRONLY)`、`os.replace`／`remove`／`mkdir`／`chmod`／`symlink`、`shutil`、`tempfile`、`Path.touch`、`__import__("subprocess")`；「standard library」沒有判準。
- **2-8** walk 的 `RecursionError` 讓輸出依實作策略而異（遞迴與迭代），中途失敗時已收集的訊息保留與否未定義。
- **2-9** code span 出現在連結文字或 destination 裡（`` [`x`](LICENSE) ``、`` [x](a`b`) ``）有兩種合理實作。
- **2-10** unreadable 表的全域優先序與逐段走訪衝突（`docs` 無讀取權限、`docs/agents` 是 symlink）。（低）
- **2-11** red 證據：時間順序無法從 Comments 判定；`git hash-object` 沒加 `-w`；「函式不存在時的 `AttributeError`」算不算 red 未定義。
- **2-12** 多張 ticket 時，AC 的「at HEAD」、W2、E1–E4、X1 歸哪張票、在哪個 HEAD 判定未定義（可在 stage 4 解決）。
- **2-13** W1 只寫「glossary message comes before it」，沒說緊接在前。
- **2-14** T4 是內容清單而非精確文字；`date:` 是 author 還是 committer date、時區。（低）
- **2-15** D3 第一個子案例需要另建 skill 路徑檔案；I2 沒列四個 reason；O1、O2、N6 只寫順序或前綴；O4 沒指定產生訊息的值。
- **2-16** T6「first line … or split over lines」自相矛盾；spec 的「Reading the module confirms W3 and W4」但 W4 判定的是 diff。（低）
- **2-17** Retrospective decision 1 沒有 AC 或 gate（round-1 2-20）。
- **2-18** spec prose 的「`<word>`」比 traceability 的定義窄（`<a.b/c>`）。（低）
- **2-19** angle-bracket destination 是否允許零個字元，N3 `[x](<>)` 靠隱含推論。（低）

## Axis 3 — Contract conflict

總計：P0 0、P1 1、P2 16。Charter 3–5、hard rules 1–5、ADR-0001 至 0005、verifier 既有 seam、Facts at B0、語言規則、0003 沿用決定的明示都已核對無衝突。

### P1
- **3-1** T7 只寫進 AGENTS.md，deck 軌的權威文件 `workflow.md:45-54`、`:60` 與 ADR-0004:10-12 沒有同步；X1 不允許改 workflow.md；也沒說 verifier 在 deck 分支 FAIL 時是 gate 還是建議。同一條規則散在五處（0004 retrospective「下次要改」第 1 項）。（中高）

### P2
- **3-2** ADR-0008 修改 ADR-0007 的 deck 軌許可，沒照「Amended by」慣例（ADR-0004:8、ADR-0007:44-50）；X1 不允許改 ADR-0007。
- **3-3** OQ-4 寫「deck content work does not run the verifier at all (round-1 Ruling R1)」，與 T7、R5 矛盾，出處也寫錯。（高）
- **3-4** T7 掛在「adds, removes or renames a file」的 bullet 上，比 ADR-0007、workflow.md 的「add, update or remove rows」窄；T7 的理由「checks the notices' links」與 US7 的「a row the grammar rejects」對不上，Assets 列的路徑是 code span 不是連結。
- **3-5** ADR-0008 延到 stage 5 才寫、`date:` 取 commit 日；harness 選擇在這段期間既不是 ADR 也不是 OQ（`workflow.md:67-69`、`:166-167`；round-1 3-8、3-9）。
- **3-6** ADR-0008 在 stage 5 寫下「E2 verified it once」，E2 在 stage 8 才執行；E2 失敗時 ADR 怎麼處理未定義。
- **3-7** spec 的「break the rule … restore the rule」比較像改實作，ADR-0006 是改 fixture；「rule」指程式還是 fixture 不明確。（低）
- **3-8** 0003 的三項決定（HTML 不檢查、連結文字可跨行、含 `<` 就略過）由 0005 round-1 Rulings 推翻，不是 grill；0003 round-2 Rulings 寫的是「unless a successor's grill reopens them」。（低）
- **3-9** grill Q8 字面只略過三種 scheme，spec 另外略過 `#anchor`，Further Notes 沒列為變更。（低）
- **3-10** Out of Scope 的延後項目沒寫成 `pending` ticket 或 OQ（`workflow.md:200-210`；round-1 3-13）。
- **3-11** traceability:11 宣告用了「Template work」但沒用；US7 用了「the author」沒列；「notices」「provenance file」「license reference」會進 AGENTS.md 與 ADR，GLOSSARY 沒收錄。
- **3-12** US3 以 Reuser 為服務對象，與 GLOSSARY:18-21「Not someone the repository is built for」有張力。（低）
- **3-13** `grill.md` 不在 issue-tracker 的 layout 中，0004 有前例。（高）
- **3-14** `docs/guide.md:60` 列舉 verifier 檢查項目，0005 後會過時；Q9、R6 已決定不改，僅記錄。
- **3-15** 文法禁止 `<`，常見署名格式「Name <email>」會 FAIL，T7 與 ADR-0008 沒給 deck 軌寫法指引。（低）
- **3-16** `grill.md:31-34` 仍寫「every later ticket starts from a fresh worktree」作為理由，R1 已確認沒有此規則。（低）
- **3-17** 同一條 deck 軌規則出現在 T4 與 T7，沒附措辭對照表（0004 retrospective 第 1 項，尚未寫進 workflow）。（低）

## Axis 4 — Red team

總計：P0 0、P1 3、P2 15，另記 7 項刻意的後果。issue-tracker.md 與 ADR-0001、0002、0003、0005 未逐字讀。

### P1
- **4-1** 文法不處理 GFM 表格的儲存格切分：未跳脫的 `|` 即使在 code span 或 title 裡也會切開儲存格。`| … | [MIT](LICENSE-CODE "MIT | code") |` 渲染時連結被切斷，文法卻計入 (c)；`` | `x | [tool](missing) | y` | `` 渲染出看得見的壞連結，文法當 code span 跳過。必要連結正好在表格列（第 10、11 行）。（GFM 行為高，實際發生中）
- **4-2** 清單項目是容器，可以繞過只看行首的 construct：`- ~~~` 開 tilde fence、標記後 5 格空白是 indented code、`- [lc]: …` 是 reference definition；`- item`／`  ~~~`／`[x](missing)`／`  ~~~` 在 CommonMark 第 3 行就結束 fence，文法卻把第 2–4 行都當 fence。B0 已有清單（第 34–56、80–86 行）。（高）
- **4-3** recognized link 能否重疊或巢狀未定義：`[x](LICENSE "[MIT](LICENSE-CODE)")` 在「每個 `[` 都嘗試比對」的實作下，title 內的連結被認成 recognized link、計入 (c)，也不報 construct；沒有 row 能區分兩種實作。建議寫明由左到右、不重疊、title 與 destination 不再掃描，並加一列 G row。（中）

### P2
- **4-4** (c) 只看正確連結在不在，標錯的連結從不報；檔案他處還有 `[MIT](LICENSE-CODE)` 時，第 11 行改成 `[MIT](LICENSE)` 也會 PASS。（高）
- **4-5** (d) 只在 `license` 與 `license_location` 位於同一物件時才檢查；security-review 的 `license` 在 skill 層（`skill-sources.json:163-166`），照這個形狀補 `license_location` 就避開 (d)。（中）
- **4-6** placeholder 略過看子字串：`LICENSE-CODE<v2>`、`<x>`、`../<x>`、`https://<host>/LICENSE` 都靜默略過。（高）
- **4-7** T7 的「it checks the notices' links」給人錯誤保證：Assets 列的路徑是 code span，不檢查是否存在。（高）
- **4-8** T7 的觸發範圍（只掛在 adds/removes/renames 的 bullet）、與 deck 無關的 FAIL 怎麼辦、workflow.md 不更新、「that edit」指涉不清。（中）
- **4-9** OQ-4 與同一版的 T7 矛盾，X1 不允許 ticket 改 OPEN-QUESTIONS.md。（高）
- **4-10** 目標解析時 `os.lstat` 的 `OSError` 未定義，可能以 traceback 結束（同 1-5）。（中）
- **4-11** `RecursionError` 邊界：3.12 起 json 的 C 解析器有獨立遞迴上限，walk 可能失敗而 loads 成功；Q(value) 的 `json.dumps` 也可能拋出。（低到中）
- **4-12** W3 擋不住 `socket`、`urllib.request`、`http.client`、`os.remove`、`Path.unlink`、`os.rename`、`os.replace`、`os.chmod`、`os.mkdir`、`shutil`、`tempfile`。（中）
- **4-13** E2/E3 沒規定執行哪一份 script：`ROOT` 由 `__file__` 決定，在暫存 worktree 執行 ticket worktree 的 script 會讓 E2 名不副實；建議寫明 `python3 <tmp>/scripts/verify-project.py`。（中）
- **4-14** E4 的 `git worktree remove --force <tmp>` 沒有前置確認，指錯會刪掉 ticket worktree。（低）
- **4-15** E2 驗的是 ticket HEAD，不是落地後的 main；ADR-0008 在 E2 之前就寫「verified once」。（中）
- **4-16** FIFO fixture 可能讓測試永遠卡住，`unittest discover` 不會失敗；輸入檔沒有 FIFO row；既有 `verify()` 讀 provenance 遇 FIFO 本來就會卡。（中）
- **4-17** `\![MIT](LICENSE-CODE)` 渲染成連結，但 `\!` 不在 construct 10 的清單，文法當圖片而誤報缺連結；destination 裡的 HTML entity 讓檢查路徑與 href 不同。（中）
- **4-18** macOS `core.precomposeunicode` 使 NFD 檔名以 NFC commit，工作樹會誤報 `differs in case`；casefold 把 `ß`／`ss` 當成大小寫差異。只有誤報。（低）

### 刻意的後果（不算 finding）
- **I-1** 未追蹤、被忽略的檔案在單元檢查通過，只靠 E2 驗一次（OQ-4、R1）。
- **I-2** `#`、`http`、`https`、`mailto` 一律不檢查。
- **I-3** 不比對根授權檔內容，`LICENSE` 與 `LICENSE-CODE` 內容互換也會 PASS。
- **I-4** 含內部空白的句子一律略過（R4）。
- **I-5** notices 不能連到目錄或經過 symlink 的路徑（例如 pnpm 的 `node_modules/@open-slide/core/LICENSE`）。
- **I-6** Claude 樹的 skill LICENSE 副本沒有 reference 指到，所以不檢查。
- **I-7** deck 軌碰到文法以外的寫法（例如 `Name <email>`）就 FAIL，放寬要同時改 ADR-0008 與 verifier。

## Rulings (repository owner, 2026-10-23)

Owner's answer: "S1–S4 都照建議，做 revision 3 後自審就進 stage 4。"

- **Gate:** round 2 is the ceiling under `docs/agents/review.md`, and no P0 survived. Stage 3 is
  passed.
- **S1** (4-1), table pipes: on a table row (a line whose first non-space character is `|`), a `|`
  inside a code span, link text or title fails as `pipe inside a table cell element`.
- **S2** (4-2), list containers: two rules.
  - A fence opener must start in column 1. A fence opener indented 1–3 spaces fails as
    `indented fence`.
  - A list marker followed by a fence run, `[x]:`, `>` or 4 or more spaces fails as
    `block inside a list item`.
- **S3** (3-1, 3-2), deck-track rule placement: X1 gains two files.
  - `docs/agents/workflow.md`: its deck-track list gains T8. After adding, updating or removing an
    Assets row, run the verifier; a FAIL blocks the merge.
  - `docs/adr/0007-license-split.md`: it gains an `_Amended by ADR-0008_` line.
- **S4**, carrying the findings: (a) revision 3 applies S1–S3 and the parent fixes and is
  self-checked. No third round runs. Stage 4 follows.
- **Parent fixes without a ruling**, as listed for the owner on 2026-10-23:
  - rows for 1-1, 1-2/2-3, 1-3 and 1-4;
  - W3 by identifier (2-1), and W4 allows new top-level imports (2-2);
  - T7 without escaped backticks (2-4), and O3's characters at the string ends (2-5);
  - left-to-right, non-overlapping link scanning with a G row (4-3);
  - the OQ-4 wording (3-3, 4-9);
  - the cheap P2 items.
