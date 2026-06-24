## 1. 結構：常駐標籤 + 隱形 Step 計數器

- [ ] 1.1 重新引入 `Step, Steps`（`@open-slide/core` import），依設計「用隱形 Step 計數器搭配 CSS :has() 驅動常駐標籤」改寫 P1Categories：7 個分類標籤為常駐元件置於 `osd-morph-root`、4 個空標記 `<Step>` 置於 `osd-morph-steps`，標籤一律不巢狀於 `<Step>` 內。交付 In-page morph reveal of category tags 的 DOM 骨架（標籤永遠在 DOM）。驗證：`pnpm build` 綠燈；grep 確認 `<Step>` 內無標籤元素。

## 2. 視覺：scatter→collect 位移與變色

- [ ] 2.1 注入 `osd-morph-` 前綴 CSS 實作「標籤以絕對定位做 scatter→collect 位移與變色」：標籤預設四散灰底，`.osd-morph-root:has(.osd-morph-steps > div:nth-child(k)[data-osd-step="revealed"]) .is-<cat>` 於第 k 步令該類 transition 到左欄第 k 槽並轉 accent 高亮。交付 Sequential highlight follows the day's running order（OSINT → Web → REV → Blue，step k 點亮第 k 類）。驗證：以 127.0.0.1 實機逐步揭露截圖，比對 specs 中 step→category 對照表（0..4 步）。
- [ ] 2.2 確保 3 個非今日類別（Pwn／Crypto／Misc）全程維持灰底四散、不佔左欄槽位，完成 Sequential highlight follows the day's running order 的「其餘轉灰」面向。驗證：完成態實機截圖確認該 3 類仍為灰且位於散位。

## 3. 降級與完成態

- [ ] 3.1 驗證「完成態與降級交給 open-slide 既有 reveal 行為」交付 Complete-state degradation for non-stepping contexts：overview 縮圖／PDF／反向進入該頁時呈現 4 類已點亮並收攏左欄的完成態，靜態、非空白、非中間幀、不重播位移動畫。驗證：截 overview 縮圖與反向進入該頁，確認為靜態完成態。

## 4. 動畫降級與畫布邊界

- [ ] 4.1 依設計「尊重 prefers-reduced-motion 並確保不 overflow」加入 `@media (prefers-reduced-motion: reduce)` 關閉 morph 的位移／變色 transition，交付 Motion respects reduced-motion preference and the fixed canvas 的 reduced-motion 面向（直接呈現目標態）。驗證：模擬 `prefers-reduced-motion: reduce` 截圖確認無 transition 動畫。
- [ ] 4.2 驗證「尊重 prefers-reduced-motion 並確保不 overflow」中所有四散與左欄座標皆落在 1920×1080 內容區、無被畫布邊緣裁切，完成 Motion respects reduced-motion preference and the fixed canvas 的畫布邊界面向。驗證：各揭露狀態實機截圖檢查無標籤超出或被裁切。

## 5. 收尾回歸

- [ ] 5.1 全頁回歸：deck 仍為 127 頁、無 `@slide-comment` marker、無 flag／secret 洩漏、無中國大陸用語、`pnpm build` 綠燈。驗證：grep 計數 + `pnpm build` + 人工複查。
