# Epic 0005 漏洞 chain 分析（close-out）

依 `docs/agents/review.md` 的「Epic close-out: chain analysis」進行。日期：2026-10-24。分析對象是已合併進 `main` 的 merge commit `2c36505`；close-out 分支只多了文件，沒有改程式碼。

## 結論

**沒有任何 chain 越過信任邊界，因此不必在 epic 結案前開票。**

- 兩位獨立分析者共提出 19 條候選 chain，parent 依共同根源合併成 K1–K10，交給兩位 `harness-challenger` 分批逐環節查證。
- 結果：
  - 6 組不成立（K2、K4、K5、K7、K8、K10）；
  - 3 組只在未驗證的前提下成立（K1、K6、K9）；
  - K3 的渲染前提已由 parent 用 pandoc 實測成立，但要換掉公開的 MIT 連結，必須改第 11 行，那是 template work，所以在 deck 軌上不越界。
- 每組的殘留都已由 OQ-6、OQ-7 或 OQ-8 涵蓋，只有兩項沒有：K9 的緊急下架例外，以及 K7 的 PASS 措辭。這兩項現在就能由 owner 決定，已列進 `retrospective.md` 的「交給 owner 的決定」。
- 這些 chain 共同的形狀是：攻擊內容在 raw diff 裡都看得到，終點都停在 owner 合併 PR 這道人工關卡；epic 0005 增加的只是一個可能讓 review 放鬆的 PASS。

## 輸入

- **各票的安全 finding**，不論等級：
  - T-0007：`review/security-T-0007.md` 的 SEC-01–SEC-13，以及 Rulings G1–G3；
  - T-0008：`review/security-T-0008.md` 的 C-01–C-10，以及 Rulings L1–L4。
- **可能成為鏈節的 stage 6 spec 層級問題**：T-0008 的 P-5（以非 ASCII 空白縮排的表格列）、P-6（guard 的範圍）、Ruling I2-order，以及 T-0007 stage 6 的各項。
- **信任邊界**，來源是 spec、traceability、`AGENTS.md` 與已合併進 `main` 的檔案：
  - verifier 是本機、唯讀、離線的 CLI，由 owner 與代其工作的 agent 執行，不在 CI 上跑；
  - checkout 外來分支或 PR 時，notices、provenance 與磁碟上的檔名可能由攻擊者決定；
  - repo 公開，notices 一 push 就公開；
  - 只有 allowlist 上的 deck、而且只在發 GitHub Release 時才會部署；
  - deck 軌只能動 `slides/<id>/`、依明確指示動 allowlist、動自己 deck 的 Assets 列；
  - holder 只由 owner 決定；owner 是唯一的 reviewer，合併每一個 PR；
  - agent 把工具輸出當資料，不當指令。

## 方法

| 步驟 | 角色 | 內容 |
|---|---|---|
| 分析 A | `harness-reviewer`，從攻擊者出發 | 從外部能控制的東西往內推：公開 PR、notices 文字、provenance JSON、磁碟上的檔名、agent 會讀到的文字。提出 9 條，自行排除 20 種組合 |
| 分析 B | `harness-reviewer`，從守門出發 | 從 epic 0005 碰到或新增的守門往外推：verifier 當 deck 軌的合併關卡、PASS 當 stage 8 證據、owner 審 PR、軌道分類、allowlist 加 Release、只由 owner 決定 holder、agent 把輸出當資料。提出 10 條，自行排除 14 種組合 |
| 合併 | parent | 依共同根源把 19 條合併成 K1–K10，附上實測證據 |
| 查證 | `harness-challenger` 兩位，K1–K5 一批、K6–K10 一批 | 逐一確認每個鏈節是否存在、每一步是否走得到、終點是否越過信任邊界 |

reviewer 與 challenger 全部唯讀，判定靠閱讀檔案推理。**parent 實際執行的部分**：

- 用 verifier 檢查修改過的真實 notices 副本；
- 用 pandoc 3.9.0.2 的 `-f gfm` 渲染。它是 GitHub cmark-gfm 的代理，**不是 GitHub 本身**；
- 在一個套用本 repo `.gitattributes`（`* text=auto eol=lf`）的暫存 repo 裡做 `git add`。

### parent 的實測結果

| 測試 | verifier | git | pandoc gfm |
|---|---|---|---|
| K1，CRLF 寫法：在第 130 行後插入 `~~~`、`~~~`+CRLF、`<!--`、`~~~` | `[]`（PASS） | `git add` 把 CRLF 換成 LF，index 裡 0 個 CR byte；commit 後的檔案沒有去同步 | 打開一個永不關閉的 HTML 註解（notices 裡沒有 `-->`），第 130 行之後全部藏起來 |
| K1，單獨 CR 寫法：一行實體內容 `~~~`+CR+`<!--`+CR+`~~~` | `[]` | CR 原樣保存（index 有 2 個 CR byte）；`git diff` 仍以文字顯示，出現 `^M`，**不是** binary（分析者 A 的推論不成立） | **沒有**去同步，最後一節照常渲染 |
| K3：在 Assets 表格最後一列（第 144 行）後面，加一列開頭沒有 `\|`、或以 U+3000 縮排的列，內含 `[MIT](LICENSE-CODE "t\|u")` | `[]` | — | 被當成同一個表格的延續；連結被切斷，或整列錯位一格 |

## 候選 chain 與判定

| 組 | 來源 | 主張的路徑（摘要） | 初判 | 查證結果 | 主因 |
|---|---|---|---|---|---|
| K1 | A CH-A1；B CH-B1、CH-B2 | C-01 讓 fence 狀態對不上（必要時加上 C-02）→ (c) 由 GitHub 顯示成 code 的連結滿足 → deck agent 回報 PASS → owner 合併 → 公開的 notices 藏住別人的著作權聲明或必要連結 | low，0.3–0.6 | **只在未驗證的前提下成立** | CRLF 寫法在 commit 時就被 `.gitattributes` 正規化而失效；單獨 CR 寫法在 pandoc 上不會去同步。只有在 GitHub 的 cmark-gfm 對 commit 進去的單獨 CR 會去同步時才成立，這點沒有驗證。插入點若不在自己 deck 的列，就屬於 template work。殘留由 OQ-8 涵蓋 |
| K2 | A CH-A2 | 用 C-02 的巢狀 list 或 C-04 的跨行 label 藏 refdef，讓 deck 列裡的 `[MIT][x]` 指向攻擊者網址 | low，0.3 | **不成立** | 沒有增加任何能力：`[MIT](https://evil)` 本來就會通過（https 不檢查、標錯的連結被接受，4-4），reference link 也明定不在範圍內；refdef 那一行落在 deck 自己的列以外，屬 template work。殘留由 OQ-8 涵蓋 |
| K3 | A CH-A3；B CH-B3 | C-03 或 P-5 讓 verifier 看到完整連結、GFM 卻切開 → 用被切開的列滿足 (c)，同時把第 11 行換成 https 的攻擊者網址 | low–medium，0.25–0.55 | **渲染前提已實測成立，但在 deck 軌上不越界** | 換掉公開 MIT 連結必須改第 11 行，那是授權表，不是 deck 的 Assets 列，屬 template work，要走完整 pipeline 並經 owner 看渲染畫面。只動自己 deck 那一列時，最多讓那一列顯示錯位或斷掉的連結，PR 的渲染畫面看得到。殘留由 OQ-8 涵蓋 |
| K4 | A CH-A4、CH-A5；B CH-B7 | 在 verifier 輸出裡注入給 agent 的指令或偽造整行 | low／info，0.1–0.25 | **不成立** | epic 0005 的訊息全部經過 Q，`\n` 與 ESC 都會被跳脫；SEC-04 只能在同一行內造成混淆；有錯誤時 exit code 一律是 1。唯一能偽造整行的 SEC-11 是既有問題（OQ-7）。誘導修改 allowlist 會被 Charter 1 與 Release 擋下 |
| K5 | A CH-A6；B CH-B5 | C-07 的二次方解析或 SEC-03 讓 verifier 卡住、逾時或 traceback，「沒有 FAIL」被當成可以合併 | low／info，0.15 | **不成立** | 卡住或 traceback 是很顯眼的「沒有結果」，不是無聲的 PASS；owner 會看每個 PR 與渲染後的 notices；SEC-03 的觸發點在 provenance 檔，屬 template work，而且 B 就已存在。「非零 exit 都要擋」的措辭已由 OQ-6（Ruling L4）涵蓋 |
| K6 | A CH-A7；B CH-B6 | 存在性與大小寫 oracle（SEC-06、C-08）探測 `.env` 這類本機檔案 → 第 6 項沒說結果回報給誰 → agent 貼到公開 PR | info，0.15–0.25 | **只在未驗證的前提下成立** | 前提是 agent 真的把 verifier 輸出貼到公開 PR。洩漏的只有檔名是否存在。Ruling L3 要補的「結果回報給 owner，不貼到公開 PR」已由 OQ-8 涵蓋；既有的 `:108` 路徑由 OQ-6 涵蓋 |
| K7 | A CH-A8；B CH-B4 | Assets 列的路徑寫在 code span 裡，verifier 從不解析 → PASS 被當成列已檢查 → 標錯或缺漏的第三方素材隨下一次 Release 公開 | low，0.25–0.35 | **不成立** | 關鍵鏈節是誤讀：`AGENTS.md:185` 只說「跑 verifier，FAIL 擋合併」，PASS 行說的「license references」依 spec 只指 (a)–(d)，從沒宣稱檢查 Assets 列的路徑。終點的風險是 epic 0004 就有的 deck 軌風險，0004 的 chain 分析已處理（OQ-5）；未 commit 的目標屬 OQ-4；部署出去的網站沒有 notices 屬 OQ-3。**附帶的措辭疑慮**（信心 0.4）：「改了 Assets 列就跑 verifier」加上寫著「license references」的 PASS，可能讓人以為列的內容被驗證過。沒有 OQ 涵蓋 |
| K8 | A CH-A9；B CH-B8 | 第 6 項執行 verifier 時沒有 `-I`，分支可在 `scripts/` 放同名模組或改 verifier；SEC-12(a) 的 `.pyc` 讓測試維持綠燈 | 影響高但信心 0.1；low 0.15 | **不成立** | 每一步都要改 `slides/<deck-id>/` 以外的檔案，依 workflow.md:36-38 屬 template work，要走完整 pipeline；能力等同直接改 verifier；`pnpm dev` 本來就會執行分支程式碼。`.pyc` 變體由 OQ-7 涵蓋 |
| K9 | B CH-B9 | verifier 檢查整棵樹 → deck 自己的列以外有 FAIL 時，第 6 項會擋下合併 → 移除一張拍到人物的照片與它那一列被延誤 | info，0.15 | **只在未驗證的前提下成立** | 前提有兩個：下架當下剛好有一個與 deck 無關的 FAIL；owner 把「FAIL 擋合併」當成緊急下架也不能例外的硬規則（這只是慣例，沒有 CI 關卡）。**沒有 OQ 涵蓋**緊急的隱私或法律下架例外 |
| K10 | B CH-B10 | R4 的句子略過、4-6 子字串 placeholder、4-13 重複 key、(d) 只看完全相同的值 → `{"license":"MIT","license_location":"LICENSE (root)"}` 通過 | info，0.15 | **不成立** | 這段程式確實走得到，但它是 spec Out of Scope「Sentences in provenance」（Ruling R4）與 4-5 事先接受的殘餘風險；provenance 檔屬 template work |

## 殘留，不需開票

- **共同根源**：notices 文法只看單行、只看第一層，GitHub 的容器與跨行結構正好落在盲區（OQ-8）。K1 是否真能在 `main` 上發生，取決於 GitHub 對單獨 CR 的處理；要確認，就得把一份 commit 進去的 notices 交給 GitHub 本身渲染。這一步會把測試內容送到 GitHub，所以這次沒有做，留給 OQ-8 的 epic 決定。
- **沒有 OQ 涵蓋、但現在就能決定的兩項**，見 `retrospective.md` 的「交給 owner 的決定」：
  - K9：緊急的隱私或法律下架，遇到與 deck 無關的 FAIL 時能不能照樣合併；
  - K7：PASS 行或 `AGENTS.md:185` 要不要補一句「verifier 不檢查 Assets 列的路徑、holder 與 terms」。

## 不在範圍內

- GitHub 本身的渲染：所有渲染判斷都只用 pandoc 代理。
- 授權與署名在法律上是否正確：由 owner 裁決。
- 部署出去的網站：OQ-3。
- 依賴套件與供應鏈掃描。
- 實際攻擊：除了上表的本機實測，其餘都是閱讀推理。

這份分析不代表整個專案是安全的。

## 成本

4 個 agent，約 0.54M subagent tokens：分析 A 約 0.17M、分析 B 約 0.19M、兩位 challenger 各約 0.09M（數字取自完成通知）。epic 0004 的同一步驟是 15 個 agent、約 1.01M。這次的差別在於：先合併成 10 組再分兩批查證，而不是一條 chain 派一位 challenger；同時由 parent 先做實測，把能直接驗證的前提先處理掉。
