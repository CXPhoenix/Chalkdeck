---
name: new-deck
description: Use this skill when the user wants to QUICKLY start a NEW deck on the FHSH AiSP × ISIP.hs theme (themes/fhsh-isiphs-universal). Triggers on "開新 deck", "new deck", "用這個 theme 開一份", "快速 scaffold 投影片". It runs scripts/new-deck.mjs to generate a self-contained slides/<id>/index.tsx pre-wired with the theme boilerplate plus a skeleton outline, then starts the dev server. For full interactive authoring with arbitrary themes use create-slide; for the how-to of writing page content defer to slide-authoring.
---

# new-deck — 快速開一份 fhsh-isiphs deck

這個 skill 是用 `fhsh-isiphs-universal` 主題開新 deck 的**快速路徑**。它呼叫一支
scaffolding 腳本，把主題的 paste-ready boilerplate（約 140 行）直接注入，省去手抄，
再啟動 dev server。**寫各頁內容的「how」交給 `slide-authoring` skill**；要做任意主題的
完整互動式撰寫請用 `create-slide`。

## When to use

- 「用這個 theme 開一份新 deck」「new deck」「快速 scaffold 一份投影片」。
- 使用者想要一份 fhsh-isiphs 主題、可直接填內容的骨架，而且要快。

不適用：編輯既有 deck 內容（→ `slide-authoring`）；建立／萃取主題（→ `create-theme`）；
任意主題的引導式撰寫（→ `create-slide`）。

## Steps

### 1. 決定 slide id

- kebab-case（小寫英數 + 單一連字號），例如 `week3-network-basics`。
- 檢查 `slides/<id>/` 是否已存在；若存在，換名，或確認使用者要以 `--force` 覆寫。

### 2. 收集參數（用 AskUserQuestion；使用者訊息已給的不要重問）

- **brand 品牌**：`fhsh`（預設）或 `isip.hs`。
- **level 等級色框**：`0` 綠（預設）/ `1` 藍 / `2` 橘。
- **title 標題**（Cover 大標）／**subtitle 副標**（選用）。
- **starter 起手內容**：`skeleton`（預設，Cover + ToC + Section + 兩頁內文佔位）/ `minimal`（僅 Cover）/ `full`（含 ImagePage 與逐頁換圖的多頁示範）。

### 3. 執行 scaffold

```
pnpm new:deck <id> --brand <fhsh|isip.hs> --level <0|1|2> --title "<標題>" [--subtitle "<副標>"] --starter <skeleton|minimal|full>
```

等同 `node scripts/new-deck.mjs <id> ...`。腳本會從 `themes/fhsh-isiphs-universal.md` 抽取
boilerplate、產生 `slides/<id>/index.tsx` 與 `slides/<id>/assets/`，並印出預覽網址。
失敗時（id 非 kebab-case、目錄已存在無 `--force`、參數非法、主題檔結構異常）會乾淨報錯，
依訊息修正後重跑。

### 4. 啟動 dev 並回連結

- 先判斷 dev server 是否已在跑（例如 `node_modules/.open-slide/current.json` 是否存在、或 5173 埠是否已被佔用）。
- **未在跑才**背景啟動 `pnpm dev`；已在跑就不要重啟。
- 回給使用者預覽連結：`http://localhost:5173/s/<id>`。

### 5. 交棒撰寫內容

- 整份換皮只要改頂端一行：`const T = makeTheme('<brand>', <level>)`。
- 逐頁換圖：`Cover` 的 `slogon`/`logo`、`Section` 的 `sectionImg`（搭配 `*Style` 覆寫位置/大小），`ImagePage` 吃自訂 `src`；slide 私有圖放 `slides/<id>/assets/`、跨 deck 共用圖走 `@assets/...`。
- 要動手寫各頁實際內容時，**讀 `slide-authoring` skill**（1920×1080 canvas、字級、版位、anti-patterns），不要在這裡重述那邊的知識。

## Self-review

- [ ] `slides/<id>/index.tsx` 已產生，`pnpm dev` 下 `/s/<id>` 正常 render。
- [ ] 色框等級與品牌圖組與使用者選的 brand/level 一致。
- [ ] 沒有覆寫到非預期的既有 slide（除非使用者明確要 `--force`）。
- [ ] 後續內容撰寫已導向 `slide-authoring`。

## Do not

- ❌ 手抄 boilerplate——一律用腳本產生（主題 md 為唯一來源）。
- ❌ 修改 `open-slide.config.ts` 或其他既有 slide。
- ❌ 加新依賴；只用 `react` 與標準 web API。
- ❌ 在這裡重述 `slide-authoring` 的版面知識。
