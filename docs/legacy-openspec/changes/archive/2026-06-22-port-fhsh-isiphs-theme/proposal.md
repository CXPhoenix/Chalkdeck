# Proposal：移植 fhsh-isiphs-universal 主題到 open-slide

> 回溯記錄：實作已完成，本提案補上脈絡供後續移植參考。

## Why

復興高中（FHSH）AiSP × ISIP.hs 原本的簡報主題是 Slidev 版（`slidev-theme-fhsh-isiphs-universal`），核心價值是執行期用 `themeName × courseLevel` 兩軸切換品牌與課程難度。本專案改用 open-slide，需要把這套主題（圖片、樣式、切換方法）忠實移植，並讓後續可再被移植。

## What Changes

- 新增 open-slide 主題包 `themes/fhsh-isiphs-universal.{md,demo.tsx}`。
- 切換機制改為 authoring-time 的 `makeTheme(themeName, courseLevel)`（open-slide 無執行期切換）。
- 等級色框改用參數化 `<Frame>`（inline SVG，幾何 ×2 重繪、顏色 token 化），取代 3 個 `lv*-bg.svg`。
- 品牌資產與 edukai 楷體放進 `assets/fhsh-isiphs/`。
- 範例 deck `slides/fhsh-isiphs-demo/`（移植 `example.md`，省略 quiz / code）。
- 使用說明 `docs/fhsh-isiphs-universal.md`。
- 閱讀體驗延展（超越 1:1）：內文閱讀欄內收、字級放大、cover 標題下移（R1–R3）。
- 逐頁換圖：Cover slogon、Section sectionImg、全版型 logo override。

## Non-goals

- Quiz / MultiChoice / WebSocket 線上作答（上游未完成）。
- ToC 跨 slide 自動導覽（open-slide 無 API）→ 以資料驅動取代。
- Monaco / Shiki 執行期程式碼高亮 → 以靜態樣式對應。
