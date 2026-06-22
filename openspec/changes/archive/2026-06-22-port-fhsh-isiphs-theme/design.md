# Design

## 切換語意的移植
Slidev 靠 deck headmatter 在執行期切換；open-slide 沒有執行期切換。改為頂端一行 `const T = makeTheme(themeName, courseLevel)`，全頁讀同一個 `T`，改一行換整份皮——authoring-time 的等價物。

## 等級色框
原 `lv*-bg.svg`（960×540 白底＋20px 粗彩框＋虛線版面參考線）改用 inline `<svg viewBox="0 0 1920 1080">`（幾何 ×2 重繪、顏色由 token 帶入）。`courseLevel` 變成單一顏色 token，可無限擴充、不依賴 SVG 資產。橘色（L2）footer 虛線 `#fdad4d` 為來源唯一例外，保留。

## 字級／版面換算
原 rem（Slidev 邏輯畫布 980 基準）×1.959 → 1920 px；版面百分比直接 ×1920/1080。以截圖人工視覺核對（原規劃用 gemini-cli，因 free-tier 停用改人工核對六變體與各版型）。

## 閱讀體驗延展（超越 1:1）
R1 內文閱讀欄內收（左右各 200、寬 1520、top 230、h 700）；R2 內文 ≥ 64px（巢狀 58/52、h3 78）；R3 cover 標題 top 290 避開上緣參考線。完整見 `docs/fhsh-isiphs-universal.md`。

## 逐頁換圖
`Cover` slogon/slogonStyle、`Section` sectionImg/sectionImgStyle、所有版型 logo/logoStyle（由 `DeckPage` 提供）、`ImagePage` src。`*Style` 為 `CSSProperties`，spread 疊在預設定位之上。
