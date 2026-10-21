---
synced_from: spec.en.md
synced_from_sha: 7446170185c0b009ef9c3f734c57000ab27e3c60
---

# Spec 0004：授權檔與 notices（內容採 CC BY-SA 4.0，程式採 MIT）

本文件是 `spec.en.md` revision 3 的稽核用翻譯，以英文版為準。發現錯誤時，先改英文版，再重新產生這份翻譯。

本 spec 沒有重複的內容放在 `traceability.md`：

- **定義**：S0、B、drift、Source LICENSE、MIT 本文、素材清單與分類、壓縮檔檢查、ADR 日期、精確比對、過時的 init-template 條目。
- **目標文字 T1–T18**：每個檔案在 HEAD 時的確切內容。

`grill.md` 逐字記錄 repository owner 的每一個回答。epic 0004 是 epic 0003 在第 2 輪審查後拆出來的文件部分；verifier 的授權指向檢查屬於 epic 0005，而 0005 依賴本 epic。

revision 2 套用了 owner 在 2026-10-21 與 2026-10-22 對第 1 輪的裁決（`review/round-1.md`、`grill.md`）。

revision 3 是審查後修補。第 2 輪沒有 P0，但有幾項 P1 必須修改 AC 要求逐字比對的目標文字，所以 owner 選擇在開票前先修 spec（「審查後修補再開票」）。

- 只套用 `review/round-2.md` 列出的處置。
- 修補後做過自審，沒有開第 3 輪審查。

## 問題陳述

這個 repo 是公開的，卻沒有根目錄的 `LICENSE`。它的 notices 與 provenance 紀錄寫著專案受「the root MIT LICENSE」涵蓋，但根本沒有這個檔案。

repository owner 希望：

- 教學內容（deck、theme、文件）以 CC BY-SA 4.0 分享；
- 程式與 agent 工具維持 MIT，因為 CC 官方不建議把它的授權用在軟體上。

repo 裡混著 owner 並不持有權利的素材，而且都沒有標示：

- 學校與計畫的 logo、教育部楷書字型、廠商 logo、一張講者照、一張聊天截圖；
- 來自 open-slide 與 K-Dense、沒有附授權檔的 7 個 skill；
- open-slide 的 getting-started deck、設定檔，以及 README 與 agent 指南裡的 scaffold 文字。

## 解決方案

- **授權檔**：根目錄放入 CC BY-SA 4.0 官方法律條文作為 `LICENSE`，並以 owner 名義放入 MIT 授權作為 `LICENSE-CODE`。
- **notices**：開頭新增一段授權說明，內容包括：
  - 每種授權涵蓋哪些路徑；
  - 第三方素材保留原本的條款，owner 對它們的修改則依授權表處理；
  - 一條概括排除條款，排除所有未列出的第三方作品。

  notices 另外新增：已分類的素材、open-slide 與 K-Dense 的素材及其 copyright 行，以及一份 MIT 全文。
- **指向**：provenance 紀錄與 agent-browser skill 不再指向「根目錄的 MIT」，並移除過時的 init-template 條目。
- **README**：加上一小段 License 說明。
- **agent 規則**：新增兩條規則讓 notices 保持正確，一條針對 deck 加入或移除他人素材，一條針對 open-slide 升級。
- **ADR-0007**：記錄這些決策，並修訂 ADR-0004，讓 deck 變更能在 deck 軌上直接編輯 notices 裡屬於自己的列。

## 使用者故事

1. 身為 repository owner，我希望內容採 CC BY-SA 4.0，讓學生與其他老師能在標示出處的前提下重用並改作我的 deck。
2. 身為 repository owner，我希望程式與 agent 工具採 MIT，讓它們和 MIT 上游以及一般軟體重用保持相容。
3. 身為 repository owner，我希望有一個地方告訴所有再利用者：哪種授權涵蓋哪些路徑、哪些被排除，讓我的素材依我選的條款被重用。
4. 身為 repository owner，我希望第三方的 logo、字型、照片、skill 與 scaffold 素材都有署名並被排除，讓 repo 不會宣稱別人的作品是自己的。
5. 身為替 deck 加素材或升級 open-slide 的 agent，我希望有條規則提醒我更新 notices，讓 notices 在本 epic 之後仍然正確。

## 實作決策

- **Ticket**
  - 預期一張 ticket 就能完成，實際由 stage 4 決定。
  - 分支在本 spec 落地之後從 `main` 開出。
  - 第一則 Comment 記錄 B 的完整 SHA 與 drift 檢查結果；之後每記錄一個新的 B，都要重新檢查。
  - 發生 drift 時 ticket 停下，由 repository owner 逐項裁定：照核准的文字繼續（proceed），或拆成新的 epic（split）。在裁定之前，不得有任何 commit 修改目標檔。這個做法取代「審查後回頭修 spec」。
  - 這是純文件 ticket：
    - test plan table 列出驗收檢查；
    - coverage report table 把每條 AC 對應到記錄下來的檢查輸出；
    - ADR-0006 不適用。
- **授權檔**
  - `LICENSE` 是從 creativecommons.org 取得的 Source LICENSE，逐位元組照抄。owner 選用它，而不是有格式瑕疵的 0x1dea 副本。它只用 LF，所以 `.gitattributes` 不需要修改。
  - `LICENSE-CODE` 是 `.agents/skills/tdd/LICENSE` 的 MIT 本文，第 3 行換成 owner 的 copyright 行。
  - 授權範圍的說明寫在 notices 與 README，不寫進授權檔本身。
- **邊界**：依目錄劃分，預設為 MIT，如 T1 所述。
  - `docs/agents/`、`AGENTS.md`、`CLAUDE.md` 採 MIT，因為它們和 MIT 的 harness-agile 範本同步維護。其他給 agent 看的紀錄依 owner 的選擇採 CC BY-SA。
  - private deck 一併適用。
  - 授權檔與 notices 本身不在授權表的範圍內。
- **優先順序**
  - notices 歸屬給他人的素材，或附有他人具名授權檔的素材，保留該權利人的條款。
  - owner 對這類素材的修改依授權表處理。因此 owner 對第三方 skill 的改動是 MIT，和 notices 第 76 行（T2）一致。
  - 素材歸誰，只由 repository owner 的回答決定。上面這些規則就是 owner 的回答，記錄在 ADR-0007。
- **素材**
  - owner 已為清單中的 19 個檔案分類（`grill.md` Q12）；T4 列出其中的第三方與混合類檔案。
  - 聊天截圖的第三方部分包括其他參與者的訊息、名稱、頭像，以及 LINE 的介面。截圖裡出現的人一律不具名。
  - 每一列只依該素材授權的要求標示權利人。
  - 兩個題目壓縮檔屬於 owner。壓縮檔檢查只讀它們的 central directory，以及任何 `package.json` 的 `license` 欄位，不公開任何成員路徑；S0 時的結果記在 traceability。
- **open-slide**：以下項目標示為 Yiwei Ho、MIT，不寫版本號：
  - 5 個 open-slide skill；
  - scaffold deck `slides/getting-started/`，從 scaffold commit 之後沒有任何修改；
  - `open-slide.config.ts`、`README.md`、`AGENTS.md` 的 `## open-slide` 段落最初的 scaffold 文字。之後的修改依授權表處理：`open-slide.config.ts` 曾被 7e95064 與 ced6d13 修改。

  getting-started deck 裡的廠商 logo 列為第三方標誌。每次升級後，agent 要核對套件的授權、copyright 行與 skill 清單是否仍然相符（T11）。
- **K-Dense**：seaborn 與 scientific-visualization 標示為 K-Dense Inc.、MIT。skill 中引自 seaborn 官方文件的文字，保留該函式庫的 BSD-3-Clause 授權。
- **教育部字型**：只加標示，不修改也不調查（owner 在 0003 的裁定）。
- **provenance 檔**：只做 S1–S6 這些變更：
  - `project_license` 改成 SPDX 寫法 `CC-BY-SA-4.0 AND MIT`；
  - `verified_on` 等於 ADR-0007 front matter 裡寫的日期；
  - `claude_prompt_audit` 紀錄維持原樣。
- **agent-browser**：兩棵樹的 `SKILL.md` 改成指向 skill 自己的 Apache-2.0 `LICENSE`，並保留「in the project root」作為 provenance 檔路徑的錨點。
- **deck 軌**
  - ADR-0007 修訂 ADR-0004：deck 變更可以新增、更新或移除 Assets 表中「自己 `slides/<deck-id>/assets/` 底下第三方檔案」的列。內嵌的引文與程式碼仍由概括排除條款涵蓋；全域 `assets/` 裡的第三方檔案屬於 template work。
  - 這條規則寫在 ADR-0007（T13）、`docs/agents/workflow.md`（T14）、`AGENTS.md` 的 slide hard rules（T10）與 glossary（T15）。
  - 被這條例外修訂的絕對句也一併修改：workflow.md 的「Classify before starting」（T16）、`AGENTS.md` Charter 的「Two tracks」段落（T17），以及在 ADR-0004 加一行「Amended by」（T18）。
  - 以上全部在 ticket 分支上一起落地，因此在 ADR-0007 存在之前，任何地方都不會先出現這條例外。
- **文件**：`docs/README.md` 的索引加入 ADR-0007。verifier 及其相關描述屬於 epic 0005。
- **不變動的部分**
  - `slides/`、`themes/`、`assets/` 底下的檔案都不變。本 epic 不改任何 deck（Charter 3），也不碰已講過的 deck 的檔案（Charter 5）。
  - 不新增任何依賴（Charter 4）。
  - 不碰 `package.json`。
- **語言**：`spec.zh-TW.md` 在審查通過後產生，隨本 spec 一起落地，不放在 ticket 分支上。

## 測試決策

- **不新增測試**：本 epic 沒有程式變更，所以不加測試。既有的 unit test 與兩個 checker 必須照樣通過（X2）。
- **要記錄的檢查**：下列檢查都要實際執行，輸出記在 ticket Comments：
  - drift 檢查（AC10）
  - `git rev-parse` 與 `git ls-tree`（AC1、AC2）
  - 與 tdd LICENSE 的 `diff`（AC2）
  - AC3、AC6–AC9 的精確比對 script
  - provenance 比對 script（AC5）
  - 素材清單與壓縮檔檢查（AC4）
  - 限定範圍的 `git grep`、`git diff --name-only`，以及三個檢查指令（AC11）
- **端對端**：驗證的 surface 是 push 後 ticket 分支在 GitHub 上的檔案頁面。在 merge 之前，用 `/agent-browser`，或 workflow 認可、能提供同等證據的原生瀏覽器工具來驗證（E1、AC12），只記錄頁面文字，不 commit 截圖。merge 後 GitHub 在預設分支上的授權偵測結果，記在 epic close-out 的回顧。

## 驗收條件

- **AC1**：`LICENSE` 就是 Source LICENSE，mode 為 `100644`（L1）。
- **AC2**：`LICENSE-CODE` 和 `.agents/skills/tdd/LICENSE` 只有第 3 行不同，內容為 `Copyright (c) 2026 CXPhoenix`；mode 為 `100644`（L2）。
- **AC3**：依精確比對，`THIRD_PARTY_NOTICES.md` 等於 B 版本加上以下變更，沒有其他變更（N4）：
  - B 的第 3–6 行換成 T1（N1）；
  - B 的第 76 行換成 T2（N2）；
  - B 的第 85–88 行換成 T3（N3）；
  - 檔尾附加 T4–T7（N5）。
- **AC4**：每記錄一個 B，Comments 都要記下素材清單與壓縮檔檢查（N6、N7）：
  - B 的素材清單等於 S0 表中的 19 個路徑與 blob；
  - 壓縮檔檢查的結果等於 S0 的結果；
  - 任何 X1 檔案、commit message 或 PR 描述都沒有出現壓縮檔的成員路徑。
- **AC5**：HEAD 的 provenance 檔，和比對 script 從 B 套用 S1–S6 組出的預期檔案逐位元組相同，並且能解析為 JSON（S7）。
- **AC6**：依精確比對，兩棵樹的 `agent-browser/SKILL.md` 和 B 相比，只有第 12–13 行換成 T9（A1）。
- **AC7**：依精確比對，`AGENTS.md` 和 B 相比，只多了 T10、T11、T17，位置依 G1、G2、G4 所定（G3）。
- **AC8**：依精確比對，`README.md` 和 B 相比，只在最後多了 T8 這一節（R1）。
- **AC9**：依精確比對，以下五項都成立：
  - `docs/adr/0007-license-split.md` 等於填入 ADR 日期後的 T13（D1）；
  - `docs/README.md` 和 B 相比只多了 T12（D2）；
  - `docs/adr/0004-two-track-delivery.md` 和 B 相比只多了 T18（D3）；
  - `docs/agents/workflow.md` 和 B 相比只有 T16 與 T14（W1）；
  - `GLOSSARY.md` 和 B 相比只有 T15（W2）。
- **AC10**：每則記錄 B 的 Comment 都列出 N8 要求的全部項目，並說明是否與 S0 相同。發生 drift 時，`git log --reverse <B SHA>..HEAD` 要顯示：加入 owner 裁定 Comment 的 commit，排在所有修改目標檔的 commit 之前（N8）。
- **AC11**：在 HEAD，以下三項都成立：
  - C1 限定範圍的 `git grep` 沒有結果；
  - `git diff --name-only <B SHA>...HEAD` 只列出 X1 中的路徑；
  - 在 repo 根目錄執行 X2 的三個指令，結束碼都是 0。
- **AC12**：merge 之前，依 E1 定義對 push 後的分支做瀏覽器檢查，結果顯示：
  - 四個檔案都能正常呈現，T1 與 T4 的表格以表格形式顯示；
  - T1 與 T8 中每個相對連結開啟的頁面都不是 GitHub 的 404 頁面。

  頁面文字記錄在 Comments（E1）。

## 範圍外

- **verifier**：授權指向檢查，以及 `docs/guide.md`、`README.md`、`docs/agents/runtime.md` 中對 verifier 的描述，都屬於 epic 0005。
- **字型本身**：不調查、不替換、不移除（owner，2026-10-21）。
- **部署出去的網站**：網站上的字型、logo 與打包進去的 MIT 套件都沒有附 notices，見 OQ-3。
- **其他授權標示方式**：不加逐檔 SPDX header、不做 REUSE 合規，也不在 `package.json` 加 `license` 欄位。
- **README 的語言**：README 是英文，但 `docs/agents/language.md` 規定用繁體中文。ADR-0007 記錄這項例外；本 epic 不修改 `language.md`。
- **7 個第三方 skill 的 provenance 條目**：它們的署名已寫在 notices；在 `skill-sources.json` 新增條目不在本 epic 範圍內。
- **上游根目錄的說法**：notices 第 96 行，以及 `skill-sources.json` 中 slide-style-design 的 `license_location`，指的都是那個上游 repo 自己的根目錄 LICENSE，原文正確，不修改。
- **較早的版本**：不對過去的 commit 或已經部署出去的副本做任何聲明。

## 補充說明

- **owner 已接受的預期後果**（ADR-0007 會記錄）：
  - deck 與 theme 的程式碼是 CC BY-SA，拿去重用在軟體裡時，必須遵守 ShareAlike。
  - CC BY-SA 允許商業使用，也允許改作後改用 GPLv3。
  - 已被取走的副本，授權無法撤回。
  - 新的頂層路徑預設為 MIT。
  - GitHub 可能會顯示兩個授權。
  - notices（包括標示為「unknown」的權利人）一 push 就公開。
- **owner 的確認**
  - deck、theme 與文件的著作財產權屬於 owner，open-slide scaffold 除外（「屬於我」；「列為 open-slide 作品」）。
  - 人像照與聊天截圖的使用合法合規（「#3 都接受，都確認合法合規」）。
- **依據（2026-10-21 與 2026-10-22 查證）**
  - CC FAQ 關於軟體的說明；CC BY-SA 4.0 的「Considerations for licensors」；CC wiki 的「Marking your work」。
  - GitHub Docs〈Licensing a repository〉；GitHub API 對 0x1dea 副本的辨識結果為 `CC-BY-SA-4.0`。
  - 教育部《國字標準字體字形檔》。
  - creativecommons.org 的 `legalcode.txt`（Last-Modified 2023-09-11），以及它和 0x1dea 副本的比對結果。
  - 已安裝的 `@open-slide/core` 1.17.1 與 2.2.0 的授權（MIT，Yiwei Ho）。
  - `K-Dense-AI/claude-scientific-skills` 的 LICENSE.md（MIT，K-Dense Inc.）。
  - commit 05d62cd 的 `git log`：`README.md`、`AGENTS.md`、`slides/getting-started/` 與 `open-slide.config.ts` 都是這個 commit 加進來的。
