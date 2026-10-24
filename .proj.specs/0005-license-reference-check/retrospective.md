# Epic 0005 retrospective（verifier 的授權引用檢查）

日期：2026-10-24。範圍從 stage 1（`grill.md`）開始，到 T-0008 合併進 `main`（merge commit `2c36505`）為止。依 Agile 原則 12，這份紀錄只回答一個問題：下一個 epic 要改哪些做法。

## 結果

- **兩張票都已合併進 `main`。**
  - spec 與兩張票：PR #11，merge `46cfe03`。
  - T-0007（provenance 的授權引用）：PR #12，merge `99ba5ec`。
  - T-0008（notices 的窄文法、必要連結與 deck 軌步驟）：PR #13，merge `2c36505`。
- **stage 3**：兩輪 adversarial review 都是 0 個 P0。第 1 輪 P1 21、P2 59；第 2 輪 P1 12、P2 65。revision 3 自審後不再送審（Ruling S4）。
- **stage 5**：
  - T-0007 有 64 個子案例（#1–#64），T-0008 有 157 個（#65–#221），每列都有紅燈紀錄。
  - 最終 `python3 -m unittest discover -s scripts -p 'test_*.py'` 跑 346 個測試，全部 OK。
  - epic 0005 程式區塊的 coverage 是 213/216 行（98.6%）。未涵蓋的 3 行是 `RecursionError` guard，在 CPython 3.13.11 觸發不了（Ruling H2、J3）。
- **stage 7**：T-0007 有 13 個候選、T-0008 有 10 個，兩張票確認的 finding 都是 0 個。
- **stage 8**：E1–E4 在 T-0008 的 HEAD `382ddc3` 全部符合預期，驗證對象是 macOS 上的 verifier CLI。
- **chain analysis**：見 `review/chain-analysis.md`。19 條候選合併成 10 組，沒有任何一組越過信任邊界，不必開票；殘留都由 OQ-6、OQ-7、OQ-8 涵蓋，只有兩項例外，列在下面「交給 owner 的決定」第 4、5 項。
- **close-out 的更正與待決事項**：
  - traceability 與 spec 的 7 處文字依各票裁決更正，見 `traceability.md` 最後一節。
  - `OPEN-QUESTIONS.md` 新增 OQ-5 到 OQ-8。

## 做得好、下次照做

1. **mutation 事先寫進表格，讓「第一次就通過」也有紅燈證據。**
   - 許多子案例在實作完成後才寫，第一次執行就通過。這時改用表格裡事先固定的 mutation 取得紅燈，並以 `git hash-object -w` 記下測試檔與 verifier 的 blob。
   - 從 #203 起，mutation 一律在執行前寫進核准的表格；#217–#221 更是逐列寫、逐列跑，每筆紀錄都有自己的 test blob（Ruling J2）。
2. **安全審查由 parent 補上實際執行的證據。**
   - T-0008 的 stage 7，parent 對每個候選輸入都實際跑過 verifier，並用 pandoc 的 GFM reader 渲染對照。
   - 結果把真的 spec 缺口（C-01–C-04）和沒有重現的推論（C-04 的加重路徑）分開，reviewer 的判定因此更有根據。
   - close-out 的 chain analysis 也照做：實測發現 `.gitattributes` 的 `eol=lf` 會在 commit 時拿掉 CRLF，讓 C-01 的 CRLF 寫法進不了 `main`。
3. **裁決逐字記錄、以字母系列編號，並在票上維護 carry list。**
   - D、E、G、H、J、L 各系列的裁決都引用 owner 的原話。
   - close-out 要做的 OQ、spec 更正與 retrospective 項目，在 T-0008 的「Stage 7 rulings」已經整理成一張清單，結案時照清單做即可。
4. **修正輪的 review 只看修正的範圍。**
   - T-0008 stage 6 的修正輪只審 `1dfc146..b59a223`，用約 0.24M tokens，第一輪是約 0.36M。
   - 依 Ruling E5、J 系列的決定，不跑第三輪。
5. **事實先查再動。**
   - 本機 `main` 停在舊的 `faef941`，所以一律以 `origin/main` 為 base。
   - 每張票都在 `gh pr view` 確認 merge commit 之後才標成 `done`。

## 下次要改

1. **實作跑在測試前面、整批先寫測試，同一個問題出現了三次。**
   - T-0007 第一輪 stage 6 的 M7、T-0008 第一輪的 S-2、S-3，以及 T-0008 修正輪的 N-2（#203–#216 共用同一個 test blob `a69c3b06…`）。
   - H1 已經把 S-2、S-3 送進 retrospective，修正輪仍然重演一次。光是記錄下來沒有用。
   - **改法**：一列一個循環，順序固定為「寫一個測試、跑、記錄紅燈、實作、轉綠」，前一列的紀錄完成前不寫下一列。紀錄腳本要拒絕在同一個 test blob 下記第二筆紅燈。#217–#221 已經照這個做法進行。
2. **mutation 沒有事先列進核准的表格。**
   - T-0008 有約 41 個 mutation 不在核准的表格裡（S-4），只能靠 H1 事後核准。T-0007 的 #54 也是先改了 mutation 才回頭補核准（Ruling E1）。
   - **改法**：test plan 的最後一欄一律寫出「第一次就通過時用的 mutation」，表格核准後才執行。
3. **紅燈證據存在 loose blob 裡，`git gc` 可能把它清掉。**
   - 紀錄裡的 `git hash-object -w` blob 沒有任何 ref 指向，`git gc` 會在過期後刪除，到時就無法核對（T-0007 F10、T-0008 K-8）。
   - **改法**：mutation 用 diff 的形式寫進票裡，或在 commit 前為 blob 建一個 `refs/evidence/<ticket>/…` ref。
4. **commit type 和內容不符。**
   - T-0007 的 `9b3a0e1` 與 T-0008 的 `3e0d609` 都標成 `refactor`，卻含有行為變更或決策文字（N14、N-1）。
   - **改法**：`refactor` commit 只放不改行為的變更；行為變更、文件決策各自成 commit。T-0008 的 J 系列修正已照這個做法拆開。
5. **spec 的規則和矩陣列互相矛盾，到實作才發現。**
   - traceability 的 I2 列和 Messages 的排序規則不一致（Ruling I2-order），O1、X2 的字面也和實際情況不同（D6、D4）。
   - revision 3 的自審只檢查新加的規則，沒有核對「寫在矩陣列裡的預期」和「寫在定義裡的規則」是否一致。
   - **改法**：spec 凍結前，凡是矩陣列的預期引用了某條規則（排序、行號、訊息），就從規則推一次預期，再和列的文字比對。這是全域規則 3「單一真相來源」的具體做法。
6. **「渲染不同就拒絕」的契約，從沒拿真正的 renderer 驗證。**
   - stage 3 與 stage 6 都只拿 spec 的文法定義核對實作，到 stage 7 才發現 C-01–C-04 這類 GitHub 渲染不同、verifier 卻判 PASS 的寫法（OQ-8）。
   - **改法**：下一個 notices 文法的 epic，在 spec 裡加一列差異測試：每個文法 construct 都用一個 CommonMark／GFM 實作（例如本機的 pandoc）渲染，確認 verifier 的判斷和渲染結果一致。GitHub 本身的渲染另外抽查。
7. **工具與環境的陷阱。**
   - 工具會把輸入裡的 `\uXXXX` 轉成實際字元，寫檔時改用 `chr()` 再掃描不可列印字元。
   - bytecode cache 曾讓一次 mutation 的紅燈失真，之後一律 `rm -rf scripts/__pycache__` 再用 `python3 -I -B`。
   - `unittest -k` 是子字串比對，曾讓一筆紀錄同時跑到別的測試；要精確比對時用 `*test_name`。
   - zsh 裡 `echo` 以 `==` 開頭的參數會出錯（0004 已記錄，本 epic 又遇到一次）。

## 交給 owner 的決定

1. 上面第 1、2 項的「一列一個循環」與「mutation 欄位必填」，要不要寫進 `docs/agents/workflow.md`？這屬於 template work，可以併入已決定在 0005 之後開的 D3 epic（純文件票的流程，也要記錄決定 D1）。
2. 第 3 項的紅燈證據，要改成寫 diff 進票，還是建 `refs/evidence/…` ref？
3. 0005 之後有兩個已決定要開的 epic：D3（純文件票的流程）與 L1（收緊 notices 文法，OQ-8）。要先開哪一個？
4. 緊急的隱私或法律下架（例如移除一張拍到人物的照片和它那一列），遇到與該 deck 無關的 verifier FAIL 時，能不能照樣合併？目前 workflow 第 6 項寫的是「FAIL 擋合併」，沒有例外（chain 分析 K9）。
5. PASS 行或 `AGENTS.md` 的 deck 規則，要不要補一句「verifier 不檢查 Assets 列的路徑、holder 與 terms」，避免 PASS 被當成那一列已經驗證過（chain 分析 K7）？

這五項你現在就能回答，所以沒有寫進 `OPEN-QUESTIONS.md`。retrospective 也沒有另外新增 ADR：ADR-0008 是 T-0008 的交付物，上面的改法都還沒經過你決定。

## 下一步

- 依你對上面第 3 項的回答，從 stage 1 開下一個 epic。
- 仍然開著的 OQ：OQ-1 到 OQ-8。其中 OQ-4（committed state 的常態檢查）、OQ-6（CLI 先讀 provenance）、OQ-8（notices 文法缺口）都和本 epic 直接相關。
- **可清理的 worktree**：`.worktrees/epic-0005`、`.worktrees/T-0007`、`.worktrees/T-0008` 都已合併，經你同意後就能移除。close-out 分支合併之後，`.worktrees/epic-0005-closeout` 也一樣。

## 成本紀錄

各階段的 subagent tokens，數字取自紀錄或完成通知，不含主 session：

| 階段 | Agent 數 | Subagent tokens |
|---|---|---|
| adversarial review（stage 3，兩輪） | 8 | 約 1.04M |
| T-0007 code review（stage 6，兩輪） | 4 | 約 0.52M |
| T-0007 安全審查（stage 7） | 3 | 約 0.38M |
| T-0008 code review（stage 6，兩輪） | 4 | 約 0.60M |
| T-0008 安全審查（stage 7） | 3 | 約 0.26M |
| chain analysis（close-out） | 4 | 約 0.54M |

有紀錄的合計約 3.34M subagent tokens、26 個 agent；stage 1、2、4、5 的 subagent 用量沒有記錄。epic 0004 是 78 個 agent、約 4.40M。

這次比較省，主要有三個原因：

- stage 6 改成 Standards、Spec 兩軸各一位，不再逐項 challenge；
- 修正輪只審修正的範圍；
- chain analysis 先合併成 10 組再分兩批查證，並由 parent 先實測能直接驗證的前提。

代價是：stage 6 的 finding 沒有經過獨立 challenge，有幾項（例如 T-0008 的 S-1、D4）是主 session 自己判定處理方式，再交給 owner 裁決。
