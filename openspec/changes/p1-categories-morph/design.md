## Context

P1Categories 是「資安競賽實務」deck 的題目分類頁，目前為靜態 Pill 橫排（OSINT、Web、REV、Pwn[灰]、Crypto[灰]、Forensics／Blue、Misc[灰]）＋一行今日路線文字。講者要 pptx「Morph」風格的揭露：同一組標籤元件在頁內平滑位移與變色，引導觀眾依序看完今天要走的 4 類。

關鍵限制：單一 index.tsx、不可加 npm 依賴（不可用 animejs）、只能 react + 標準 web API + open-slide core；1920×1080 固定畫布不可 overflow；台灣繁體中文。

已查證 open-slide core（@open-slide/core dist）的 Steps/Step 執行期 DOM 契約，作為機制基礎：
- `<Step>` 渲染為單一 `<div data-osd-step="revealed">`（已揭露）或 `<div data-osd-step="pending">`（未揭露，opacity:0、visibility:hidden）。
- `<Steps>` 回傳 Fragment（無外層包裹元素），故各 Step 的 div 是其容器的直接子節點，依文件順序排列。
- 無 StepHostContext（overview 縮圖、PDF、反向進入）時，`effectiveRevealed = stepCount`，所有 Step 皆為 `revealed`；forward 進入時 initial=0（從零堆疊），反向／跳入時 initial=stepCount（完成態）。
- Step 在 `prefers-reduced-motion` 下 transition 時間歸零。

## Goals / Non-Goals

**Goals:**
- P1Categories 改為頁內 Morph 揭露：標籤初始四散 → 逐步收攏成左欄 → 今天 4 類（OSINT → Web → REV／WASM → Blue Team）依序點亮，被介紹者上色高亮、其餘轉灰。
- 同一組常駐標籤元件平滑位移／變色（真 magic-move），非淡入淡出、非換頁。
- overview 縮圖、PDF、反向進入呈現「完成態」（4 類已點亮收攏成左欄、3 類灰底四散），縮圖不得為空白或中間幀。
- 尊重 `prefers-reduced-motion`：關閉位移／變色 transition，直接呈現完成態。

**Non-Goals:**
- 不做跨頁 Magic-Move（open-slide 無此能力，只在單頁內）。
- 不改其他頁、不改 build／設定、不加依賴、不新增檔案。
- 不引入 JS 動畫迴圈或計時器；所有動畫以 CSS transition 完成。
- 不改變該頁要傳達的內容（仍是「今天走 4 類」），只改呈現方式。

## Decisions

### 用隱形 Step 計數器搭配 CSS :has() 驅動常駐標籤
把 4 個 `<Step>` 當成「不可見的揭露計數器」（每個 Step 內只放一個空標記元素），與「常駐標籤群」並存於同一 morph 容器；標籤群永遠在 DOM 中、絕不放進 Step（否則會被 Step 的 opacity/visibility 控制而變成淡入，而非 magic-move）。用 `.morph-root:has(.morph-steps > div:nth-child(k)[data-osd-step="revealed"]) .tag-<cat>` 偵測「第 k 步已揭露」並對該類標籤套用 active 樣式。
- 替代方案：把標籤直接放進 `<Step>` → 只能得到淡入、無法位移／變色的同元件過渡，捨棄。
- 替代方案：用 React state + onClick 自行管理揭露 → 會與 open-slide 的鍵盤揭露／overview 完成態邏輯重複且不一致，捨棄。改為複用 framework 既有 reveal 狀態。

### 標籤以絕對定位做 scatter→collect 位移與變色
morph-root 為 `position:relative` 的定高容器（置於 Default 內容區、不超出畫布）。每個標籤 `position:absolute`，預設在「四散座標」且為 muted 灰；今天 4 類在對應 Step 揭露時，transition 到「左欄第 k 槽座標」並轉為 accent 高亮色。3 個非今日類別（Pwn／Crypto／Misc）全程維持灰底四散。transition 只作用於 transform／top／left／color／opacity。
- 替代方案：用 fl/grid 重排 → 重排不會在同元件上產生平滑位移，無法達到 morph 效果，捨棄。

### 完成態與降級交給 open-slide 既有 reveal 行為
不另外寫降級程式碼：無 step host（overview／PDF）時 framework 自動讓所有 Step `revealed`，CSS 規則即呈現完成態；反向／跳入時 initial=stepCount 亦為完成態。元件在完成態直接掛載、無狀態變化，故不觸發 transition（不會在縮圖上「跑動畫」）。

### 尊重 prefers-reduced-motion 並確保不 overflow
在 morph CSS 以 `@media (prefers-reduced-motion: reduce)` 關閉 transition。所有四散與左欄座標需驗證落在 1920×1080 內容區內、不被裁切。重新引入 `Step, Steps` 至 `@open-slide/core` import。

## Implementation Contract

- **Behavior**：在 P1Categories 頁，forward 進入時 7 個分類標籤先四散且為灰；每按一次 → 依序揭露今天 4 類之一：該類標籤平滑移動到左欄對應位置並變為 accent 高亮，先前已揭露者維持高亮收攏，未揭露之今日類別與 3 個非今日類別維持灰底。揭露第 4 步後為完成態。今日路線文字（OSINT → Web → REV／WASM → Blue Team）維持可見。
- **Interface / DOM 契約**：morph 容器 className `osd-morph-root`；步驟計數器容器 `osd-morph-steps`，內含 `<Steps>` 包 4 個 `<Step>`（每個 Step 內放單一空標記）；標籤 className 形如 `osd-morph-tag` + 類別修飾（如 `is-osint`/`is-web`/`is-rev`/`is-blue` 與非今日類別）。CSS 選擇器以 `.osd-morph-root:has(.osd-morph-steps > div:nth-child(k)[data-osd-step="revealed"])` 對應第 k 步，k∈{1,2,3,4} 對應 OSINT／Web／REV／Blue。樣式規則注入在既有頁面頂端 style block，class 一律 `osd-morph-` 前綴避免全域碰撞。
- **Failure modes**：若瀏覽器不支援 `:has()`，標籤退化為靜態完成態（仍可讀，不報錯）；`prefers-reduced-motion` 下無位移動畫、直接完成態。皆為靜默降級、不丟錯。
- **Acceptance criteria**：(1) `pnpm build` 綠燈；(2) `http://127.0.0.1:5173/s/ctf-competition-practice?p=<P1Categories 頁碼>` forward 進入時初始為四散、連按 → 4 次依序點亮 4 類並收攏成左欄；(3) overview 縮圖／反向進入該頁為完成態（非空白、非中間幀）；(4) 標籤無一超出 1920×1080；(5) deck 仍為 127 頁、無 @slide-comment marker、無 flag／secret 洩漏、無中國大陸用語。
- **Scope boundaries**：In scope＝僅 slides/ctf-competition-practice/index.tsx 中 P1Categories 頁改寫、Step/Steps import、morph CSS 注入。Out of scope＝其他頁、其他 deck、build／設定、新增依賴或檔案、命題文字定稿（講者自理）。

## Risks / Trade-offs

- [CSS `:has()` 相容性] → open-slide 在 Chromium 執行，原生支援；不支援時靜默退化為完成態（仍可讀）。
- [四散座標可能超出畫布或互相重疊難讀] → 在 apply 時以實機截圖（127.0.0.1）逐步驗證座標落在內容區、四散標籤不壓字。
- [縮圖誤觸發位移動畫] → 已查證完成態直接掛載、無狀態變化故不 transition；apply 時截 overview 縮圖確認為靜態完成態。
- [Step 數與類別數對不上導致選擇器錯位] → 固定 4 個 Step 對應 4 個今日類別，`nth-child(k)` 與類別一一對應，於 apply 以逐步揭露截圖驗證對位。
- [重新引入 Steps import 後與既有頁互動] → Steps 僅出現在本頁，其他頁不含 `<Steps>`，無 host 影響；build 驗證無未使用 import 警告。
