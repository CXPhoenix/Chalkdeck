# Round 1 — 0004-license-files

Spec version: spec.en.md c2fabc8ec115d557155264992a31869c0fa1dfff / traceability.md 8c04f1917560c46bb6fe9d0b0ce117e42a009522
Prompt: `review/prompt.md` (frozen, blob 7b85650a0d2f91502a39bcca0ca12b14931b7c3a, commit dfcf4cf). One `harness-reviewer` per axis, run in parallel. Reports recorded as returned, condensed by the parent; no finding dropped.

Totals: P0 2 (2-1 ADR content has no stated check; 3-1 T10 overrides ADR-0004 silently, also 1-4 and 4-4 at P1), P1 15, P2 64 (56 findings plus axis 4's 8 expected consequences E-1 to E-8).

Parent verification of 4-3 after the reports: `git log` shows `slides/getting-started/index.tsx` (3,406 lines), its seven SVG assets and `open-slide.config.ts` were all added by scaffold commit 05d62cd and the deck has no later commit.

## Axis 1 — Completeness

總計：P0 0、P1 4、P2 12，另有 2 項軸外觀察。沒有孤立的 AC。

### P1
- **1-1** E2E 沒有 matrix row，也沒有 AC。T1 與 T8 的相對連結都沒有任何 AC 驗證。（0003 的 1-13 至今仍未解決）
- **1-2** 「B 的 inventory 不等於 19」這條分支，和 AC3 要求 T4 逐字相符互斥；owner 回答之後怎麼處理也沒有 row 定義。deck content track 可以平行新增素材，所以這條分支真的可能發生。（發生時等同 P0）
- **1-3** 只有 asset inventory 有「B 漂移」的處理；N1–N4、A1、G1/G2、D2、S1–S6 都沒有「B 與 f1a29c7 不同就停下」的規定。
- **1-4** T10 要求「在同一個變更裡改 notices」，但 workflow.md:36-37 與 ADR-0004:27-28 規定 deck content track 只能動 `slides/<id>/`，一碰 notices 就成了 template work。matrix 沒有對應的 row。

### P2
- **1-5** 第三方 skill set 不在 B 重新推導，也沒有停止規則（0003 有，0004 刪掉了）。
- **1-6** provenance 沒有 7 個第三方 skill 的 entry，spec 也沒說明這是刻意的。
- **1-7** S4 的 `verified_on` 有循環定義，也沒有規定多則 Comment 與時區怎麼處理。
- **1-8** D1 與 AC9 涵蓋不完整：front matter 算不算在內、「ticket's date」沒有定義；另外漏掉 precedence、unknown 規則、mixed、open-slide 與 K-Dense 的署名、T10/T11、取得 blob 的方式。
- **1-9** 授權檔與 notices 本身會落進「Every other path → MIT」（0003 寫過「the table does not license them」，0004 刪掉了）。
- **1-10** 主題 boilerplate 同時存在 `scripts/new-deck.mjs`（MIT）與 deck（CC）兩處，spec 沒有說明這是不是刻意的。
- **1-11** 流程證據沒有 row：B 寫進 Comment、不 merge main、test plan 與 coverage table、stop 對應到 `pending`。
- **1-12** inventory 的比對基準沒有逐一列出（兩個 zip 的路徑沒有出現）；「differs」比的是路徑還是內容也沒有定義。
- **1-13** 序列化與位置的邊界：JSON 縮排、檔尾換行、T11 放在哪裡及後面要不要空行、file mode。
- **1-14** skill-sources.json:300 的「Upstream repository root LICENSE」沒有像 notices:96 一樣被豁免。
- **1-15** zip 的成員若是第三方內容，沒有對應的 row。
- **1-16** spec.zh-TW.md 該在哪裡落地，以及它和 X1 的關係，沒有定義。

### 軸外觀察
- **A** 「Licensor-owned」和 T3 的「maintainer」都是 GLOSSARY 的 Avoid 詞。
- **B** 移除 init-template 之後，日後從母範本同步回來時就沒有授權紀錄（docs/guide.md:20）。

## Axis 2 — Verifiability

總計：P0 1、P1 6、P2 10，另有 3 項軸外觀察。

### P0
- **2-1** AC9 對 ADR 的內容沒有寫出檢查方式：ADR 沒有對應的 T-block，而 D1 的 9 項決策（例如「its copies」）是否「recorded」都要靠詮釋判斷。修正方向：補上 ADR 全文 T13，或為每項決策訂出必須出現的關鍵句，再用 grep 檢查。（事實面信心高；評為 P0 的信心中，請使用者裁定）

### P1
- **2-2** S4 的 `verified_on` 取「Comment 的日期」，但 Comment 格式裡沒有日期欄位；結果分散在多則 Comment 時不知道取哪一則；AC5 自己檢查 `verified_on`，形成循環；rebase 後也要重寫；時區未定義。
- **2-3** D1 的「the ticket's date」沒有定義，ticket 的 frontmatter 裡沒有日期欄位。
- **2-4** 行號都量在 f1a29c7 上，但 spec 沒有檢查 B 和 f1a29c7 一致；只有 AC4 設了「B 不同就停下」。修正方向：在 Definitions 寫出各檔在 f1a29c7 的 blob id，B 不符就停下。
- **2-5** AC4 的「inventory differs」分支沒有寫通過條件；它和 AC3 要求 T4 逐字相符互相衝突；被刪除、改名或替換內容的檔案也沒處理。deck 內容工作可以直接新增素材，所以這種情況真的可能發生。
- **2-6** T11 的插入位置與前後空白行有兩種讀法：可以放在 code fence 和第 205 行之間，也可以放在第 205 行之後；AC7 就無法判定。
- **2-7** E2E 的「render」和「links open」沒有定義；「repository page after the merge」在 stage 8 時還不存在；E2E 也沒有 AC。

### P2
- **2-8** AC2 沒有指定要改第 3 行；把第 1 行換掉也能通過，Matt Pocock 的版權行仍會留著（L2 有寫，AC2 本文沒寫）。
- **2-9** 允許「用肉眼讀 diff」來比對，看不出行尾空白、NBSP、em dash、全形與半形的差異。
- **2-10** 附加內容的檔尾換行沒有規定。
- **2-11** AC5 用 JSON 語意比對，重新縮排或改變 key 順序算不算變更，沒有規定。
- **2-12** 「照建議」本身沒有分類內容；grill 紀錄也不在 repo 裡。
- **2-13** 列 inventory 用的指令沒有指定（pathspec 的 `*` 會跨越 `/`）；「without extraction」也沒有可查核的紀錄。
- **2-14** AC1 沒有檢查 file mode。
- **2-15** spec 正文寫「「中華民國教育部」」，有全形引號；T4 沒有引號，兩處不一致。
- **2-16** X2 沒有規定要在哪個目錄執行。
- **2-17** skill-sources.json 有多處 `licensing.verified_on`，沒有寫明 root 層的完整路徑。

### 軸外觀察
- **A** 純文件 ticket 的 coverage report table 要填什麼（workflow.md:125-128），沒有規定。
- **B** 「first Comment records B」沒有 AC。
- **C** GLOSSARY 把 licensor、maintainer 列為 Avoid，但 spec 用了「Licensor-owned」，T3 也沿用了「maintainer」。

## Axis 3 — Contract conflict

總計：P0 1、P1 1、P2 17。

### P0
- **3-1** T10 在沒有明說的情況下推翻了 ADR-0004 的雙軌邊界。
  - 違反的規範：ADR-0004:27-29、workflow.md:36-37、AGENTS.md:50、:96-97、GLOSSARY.md:62-63。
  - 衝突點：「in the same change」會讓 deck 加一張第三方圖的工作，因為動到 `THIRD_PARTY_NOTICES.md` 而變成模板工作。
  - 比較：allowlist 的例外有寫進 ADR，T10 沒有。
  - 結果：T10 是逐字的目標文字，X1 又不允許修改 ADR-0004 與 workflow，所以 ticket 內無法解決。（信心高）

### P1
- **3-2** E2E 的「after the merge」違反 stage 8 → 9 的順序：merge 後的檢查一定在 `done` 之後，事後補寫的 Comment 也不在 ticket 分支的 diff 裡。在 ticket 內的解法：只驗分支的 file view，merge 後的檢查改列為 close-out 觀察。（信心中高）

### P2
- **3-3** 「純文件、不加 test」沒有依據，coverage table 也沒提到；T-0002 的先例是相反做法（豁免 plan table、補 coverage）。
- **3-4** 用了 GLOSSARY 列為 _Avoid_ 的詞：「Licensor-owned」，以及 T3 的「maintainer」（出現 3 次）。
- **3-5** ADR-0007 會把「README 用英文」固定下來，但 language.md:16 沒有修訂，X1 也不允許修改它。
- **3-6** `docs/adr` 和 `docs/agents` 都是 agent-only，也都來自 harness-agile，授權卻分屬兩邊（template-source.json:2），分類理由不一致。
- **3-7** ADR-0007 要到 ticket 才寫，違反 workflow.md:64-66「as it settles」。
- **3-8** 「private deck… already public」和 GLOSSARY.md:38-41 的定義有張力。
- **3-9** User Story 3、4 把 reuser 當成服務對象，和 GLOSSARY.md:19-20、Charter 不一致。
- **3-10** precedence 讓 LICENSE 檔自動決定權利歸屬，和 GLOSSARY.md:14-15「only their answer」有張力。
- **3-11** 援引 Charter 3/5 的範圍偏寬；重新授權已交付的 deck 和 Charter 5 的關係沒有說明。
- **3-12** OQ-3 仍寫 epic 0003，X1 不允許更新。
- **3-13** T5 寫「`package.json` 指名的版本」，但 `package.json` 寫的是範圍 `^2.2.0`，實際版本要看 lockfile。
- **3-14** 「ticket stops」沒有對應到任何 tracker 狀態。
- **3-15** X1 允許寫入已凍結的 spec 目錄（review/security），這是既有慣例，僅記錄。
- **3-16** 「No browser automation is required」不符合 workflow.md:149-155 對瀏覽器 surface 的證據要求。
- **3-17** spec 在 stage 2 就定死「One ticket」，侵犯 stage 4 的決定權。
- **3-18** T1 保留了「distributing a generated project」，但本 repo 已經沒有 init-template。
- **3-19** T9 拿掉「in the project root」後，依「resolve relative to the loaded skill」的慣例，`docs/agents/skill-sources.json` 會被解析成 skill 目錄底下的路徑。

### 已檢查、沒有衝突的項目
ADR-0001/0002/0003/0005；ADR-0006 不適用（判斷正確）；Charter 2、4；hard rule 1、5；移除 init-template 不會讓 verifier 失敗；`pnpm sync:skills` 不會覆寫 AGENTS.md 的 open-slide 段；T12 格式、ADR front matter、T9 兩棵樹同改、S6 寫法、X2 指令、glossary scan，都沒有問題。

## Axis 4 — Red team

總計：P0 0、P1 4、P2 17，另有預期後果 E-1 至 E-8（P2）。reviewer 指出 4-1 到 4-4 都必須修改 T-block 的原文；AC3、AC7 要求逐字相符，所以 ticket 內無法修正。是否升為 P0，請 parent 與使用者裁定。

### P1
- **4-1** owner 改過的第三方 skill，改動的部分不在任何授權範圍內。T1 規定「目錄裡有他人的 LICENSE，兩種授權都不涵蓋」，但 agent-browser、archify、code-review、grilling、to-spec、implement、tdd、writing-for-agents、teach、security-review 這些目錄都有 owner 的改動，結果等於 all rights reserved。B 的版本有涵蓋這些改動。（信心中高）
- **4-2** T2 說 evidence-report 中 project-authored 的部分是 MIT，但依 T1，整個目錄兩種授權都不涵蓋，notices 自相矛盾；T1 的「Except where otherwise noted」也沒說明優先順序。（信心高）
- **4-3** `slides/getting-started/` 很可能整份是 open-slide scaffold（index.tsx:3389 的標題是「Getting started with open-slide」，:622 有 `npx @open-slide/cli init`），但 T5 只列了 README 與 AGENTS.md 的段落，結果會被標成 CXPhoenix 的 CC BY-SA。`open-slide.config.ts` 等設定檔也沒提到。（信心中）
- **4-4** T10 會把 deck 加素材變成 template work，和 ADR-0004、workflow.md:36-37 衝突；修正需要改這兩份文件，但 X1 不允許。（信心高；同 3-1、1-4）

### P2
- **4-5** 混合截圖只把「訊息」列為第三方，但頭像、暱稱、引用框與 LINE UI 也是第三方內容。
- **4-6** T10 沒有寫進「不公開人名或暱稱」的隱私約束。
- **4-7** T11 只比對 copyright 行；sync 之後新增的 skill、授權類型的變更都偵測不到。
- **4-8** T10 只講新增，沒講移除或改名；規則放在 Slide hard rules 底下，做 template work 的 agent 讀不到。
- **4-9** `-master.zip` 可能夾帶第三方 LICENSE 或 vendor 程式碼，和 precedence 衝突。
- **4-10** zip 的成員名稱寫進公開的 Comments，可能洩漏 flag，或帶入不受信任的檔名。
- **4-11** T6 否認 BSD-3 適用；但 seaborn 的 references 可能轉錄了官方文件。
- **4-12** T8 的摘要（docs 歸 CC、code 歸 MIT）和 T1 細節不一致（docs/agents 是 MIT，deck code 是 CC）。
- **4-13** T9 拿掉「in the project root」後，skill 被單獨複製出去時，路徑就沒有錨點。
- **4-14** 授權檔本身落入 MIT；CC legal code 的作者是 CC，T1 沒有寫明。
- **4-15** `project_license` 寫成散文，不是 SPDX expression（可改為 `CC-BY-SA-4.0 AND MIT`）。
- **4-16** OQ-3 沒有涵蓋 bundle 裡的 React 與 open-slide 等 MIT notice；OQ-3 仍寫 Epic 0003。
- **4-17** T5 寫的版本依據其實是版本範圍。
- **4-18** Source LICENSE 只和 0x1dea 比對，沒有和 CC 官方 legalcode 比對。
- **4-19** 字型檔名帶 `-fixed`，卻公開標為 BY-ND（僅記錄；owner 已裁定不調查）。
- **4-20** 來自 harness-agile 的文件在這裡改成 CC BY-SA；日後同步時，MIT 文字會持續流入 CC 路徑。
- **4-21** inventory 與 T4 會互相卡住（同 1-2、2-5）。

### 預期後果
- **E-1** ShareAlike。
- **E-2** 允許商業使用，可改用 GPLv3。
- **E-3** 已被取走的副本無法撤回授權。
- **E-4** 新路徑預設為 MIT。
- **E-5** GitHub 會顯示兩個授權。
- **E-6** notices 公開後即無法收回。
- **E-7** private deck 一併授權。
- **E-8** OQ-3、字型、README 語言、第 96 行維持原樣。
