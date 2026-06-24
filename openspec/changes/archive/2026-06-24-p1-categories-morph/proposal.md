## Why

P1 分類頁（P1Categories）目前是靜態的 Pill 標籤橫排，無法引導觀眾注意力。講者希望用 pptx「Morph」風格的揭露節奏，把「題目分類」這個抽象清單變成有敘事感的動畫——標籤先四散，再隨講解逐步收攏成左側一欄，並依序點亮今天要走的 4 類（OSINT → Web → REV／WASM → Blue Team）。要在不加任何 npm 依賴、單一 index.tsx、單頁內完成。

## What Changes

- P1Categories 由「靜態 Pill 橫排」改為「同一組常駐標籤元件」的頁內 Morph 揭露：初始四散分布 → 隨揭露平滑位移收攏成左側一欄 → 正在介紹的那一類上色高亮、其餘轉灰；4 類依序點亮。
- 重新引入 open-slide core 的 `<Steps>`/`<Step>` 揭露機制（core 允許，非 npm 依賴），讓 DOM 帶揭露狀態；以 CSS `:has()` 偵測目前揭露到第幾步，驅動常駐標籤元件的 transform／opacity／color transition（同一元件平滑過渡＝頁內 magic-move）。
- 定義並實作降級行為：overview 縮圖與「反向進入／從後面跳回」時，呈現「全部已揭露」的完成態（4 類已點亮、已收攏成左欄），縮圖不得是空白或半完成的中間幀。
- 不改其他頁、不改 build／設定、不加依賴；變更僅限 slides/ctf-competition-practice/index.tsx。

## Capabilities

### New Capabilities

- `deck-morph-reveal`: 在單一 slide 頁內，以 open-slide `<Steps>`/`<Step>` 揭露狀態搭配 CSS `:has()`，驅動一組常駐元件做 pptx Morph 風格的平滑位移與變色（頁內 magic-move），並規範 overview 縮圖／反向進入時的完成態降級行為。

### Modified Capabilities

(none)

## Impact

- Affected specs: 新增 `deck-morph-reveal`
- Affected code:
  - Modified: slides/ctf-competition-practice/index.tsx（改寫 P1Categories 頁、重新引入 Steps／Step import、注入 morph 專用 CSS）
  - New: (none — 單檔 deck，無新增檔案)
  - Removed: (none)
