# 部署與 Google Sites 嵌入指南

Chalkdeck 是建立在 **open-slide**（`@open-slide/core`）之上的教學投影片工作區。
本文件說明：deck 如何發佈成線上網站、如何嵌進 Google Sites，以及實測過的「眉角」。

---

## 1. 分支與 Release 模型

- **`main`** — 整合分支：所有 deck（`slides/<id>/`）＋ 模板（themes / scripts / skills / config）都在這裡累積。
- **`template`** — 長壽的「模板」分支，搭配 **tag** `template-vX.Y.Z` 標記每個模板版本。
- **deck 快照** — 要凍結「某個模板版本期間的 deck」時，用 **tag**（如 `decks-v1.0.0`），不要開會繼續長的 version 分支。

規則：
- 模板更新走 `template` 分支 → 打 `template-vX.Y.Z` tag → **`git merge template`** 進 `main`（路徑不重疊、零衝突、**不要 rebase 已公開的 main**）。
- **路徑紀律**：`template` 不碰 `slides/`；deck 工作只碰 `slides/*`；全域 `assets/` 歸模板。破例就會讓兩條 lineage 分岔。
- 既有 deck **不會**因 merge 新模板而自動升級（每個 slide 自包含、boilerplate 是 inline 的）。要遷移得另做 re-sync 工具。

---

## 2. 發佈模型：Release 觸發 + allowlist（預設不公開）

線上站台由 GitHub Actions（`.github/workflows/deploy-pages.yml`）部署到 GitHub Pages，**兩道閘**：

1. **觸發**：只在「**發佈 GitHub Release**」時部署（外加手動 `workflow_dispatch`）。
   → **merge 進 `main` 不會自動公開**；公開是獨立、明確的動作。
2. **範圍**：`deploy/public-decks.txt`（allowlist）決定**哪些 deck 公開**。
   - 一行一個 deck id（＝ `slides/<id>` 資料夾名）。
   - **預設不公開**：沒列到的 deck 在 build 前被刪掉（在拋棄式 CI checkout，不動 repo）→ 站上沒有它、也沒有可達 URL。
   - 清單空（`kept=0`）→ build 與 deploy **整段跳過**：不覆蓋既有站、不外洩任何 deck。

> 重點：發佈的單位是「Release 那個 commit 當下、且在 allowlist 內的 deck」。open-slide **沒有** per-deck 的公開/不公開旗標（`SlideMeta` 只有 `title/theme/createdAt`；dev UI 的「Draft」只是側欄分組，不影響 build）。所謂「不公開」＝它不在這次 build 裡。

### 發佈一個 deck 的步驟

1. 把該 deck 的 id 加進 `deploy/public-decks.txt`，commit、push 進 `main`。
2. 發一個 **Release**（用 `/tw-emoji-release-note` 產生 release note，再建立並推送 tag）。
3. workflow 只 build 清單內的 deck → 部署 → 該 deck 上線於
   `https://chalkdeck.rtfm.diy/s/<deck-id>`。
4. **下架**：把它從清單移除，再發一次 Release。

---

## 3. 多個 deck

`open-slide build` 把整個 workspace 編成**一個**靜態站，每個 deck 是一條路由 `/s/<id>`：

```
https://chalkdeck.rtfm.diy/s/<deck-A>
https://chalkdeck.rtfm.diy/s/<deck-B>
```

- 加 deck → merge → 列入 allowlist → 發 Release → 新 URL 上線、舊 URL 不變。
- **deck id 即 URL**：公開後**別改資料夾名**，否則同時打斷線上網址與 Google Sites 的 iframe。
- 根目錄服務：custom domain（`chalkdeck.rtfm.diy`）服務於根目錄，靠 `open-slide.config.ts` 的 `base`（CI 設 `OSD_BASE=/`，本機 dev 也維持 `/`）。深層連結靠 build 後複製 `index.html → 404.html` 解掉 GitHub Pages 無 SPA fallback 的問題。（若日後改回 github.io 子路徑服務，需把 `OSD_BASE` 還原成 `/<repo>/`。）

---

## 4. 嵌進 Google Sites

Google Sites **不是檔案主機**，無法處理「html + 相對路徑 `assets/`」的資料夾。兩條可行路：

### 路線 A：PDF 從 Google Drive 嵌入（最簡單、零 asset）
1. 在 open-slide UI（Chrome）匯出 **Export as PDF** → 上傳 Google Drive → 權限設「知道連結的任何人」。
2. Sites：**Insert → Drive → 選 PDF → Insert**。
- 一個檔、Google 幫你 host、Sites 內建 viewer，完全不用碰 assets，Education 帳號也吃。
- 代價：靜態（無互動/動畫）。

### 路線 B：iframe 線上 deck（要保留互動）
- deck 已部署在 GitHub Pages（custom domain `chalkdeck.rtfm.diy`）。Sites：**Insert → Embed → By URL**，貼 `https://chalkdeck.rtfm.diy/s/<id>`。
- 主機端處理所有 assets，Sites 只負責 iframe。

### 為什麼不用 Google Apps Script（已評估、否決）
- 🔴 學校 Education 網域的 admin 常**擋掉「Anyone, even anonymous」web app 部署** → 外部訪客會被擋。
- 🔴 GAS 的 HtmlService **不是 asset host**，要塞 8.5MB 字型 + 圖只能 base64 inline 進單一 doc，慢又撞限制。
- 🟠 React SPA 跑在 GAS sandbox iframe、又被 Sites iframe 包一層，雙層 sandbox 脆弱。
- 結論：GAS 是多餘又脆的中間層，不要用。

---

## 5. 匯出格式的實測真相（open-slide 1.12.x）

UI 的 Download 選單有 **Export as HTML / Export as PDF / Export as image PPTX**（皆**瀏覽器端**動作，非 CLI）：

- **Export as HTML ＝ 一個 `.zip`**（約 12MB），內含 `<deck>.html`（~165KB，相對路徑參照）＋ `assets/` 資料夾（圖、`edukai-fixed.woff2` 8.5MB 等）。**不是**單一自包含 HTML——`.html` 單獨拿出來不會 render。可攜（解壓即用），但別期待單檔。
- **Export as PDF**：**Chrome only**（Safari 不支援），逐頁 raster、**慢且需前景分頁**（背景/節流會卡在最後一頁）。字型正確（直接 raster 畫面上的 edukai 楷體）。
- 可編輯 PPTX：尚未支援（coming soon）；image-PPTX 可。

---

## 6. Don'ts

- ❌ 別把 PDF / HTML 產物 commit 進 repo（二進位肥大）——當 **release asset** 上傳。
- ❌ 別 rebase 已公開的 `main`（用 merge）。
- ❌ 別把 deck 快照存成會繼續長的 version 分支（用 tag）。
- ❌ 別預期「merge 進 main」＝公開（要 Release + 列入 allowlist 兩件事同時成立）。
- ❌ 公開後別改 deck 資料夾名（打斷 URL 與 Sites iframe）。
