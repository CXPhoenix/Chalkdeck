# fhsh-isiphs-universal 主題使用說明

臺北市立復興高級中學（FHSH）AiSP × ISIP.hs 的 open-slide 簡報主題，移植自 Slidev 版。白底、一圈彩色外框、edukai 楷體，用兩個軸切換品牌與課程難度。

讀者對象：要用這個主題做 slides 的人，或代為產生 slides 的 agent。完整可跑範例在 `slides/fhsh-isiphs-demo/index.tsx`（8 頁，涵蓋所有版型與換圖）。

## 它怎麼運作

一份 deck 用一行 `makeTheme(themeName, courseLevel)` 決定外觀：

- `themeName` 決定品牌圖（左上 logo、章節圖、slogon）。
- `courseLevel` 決定外框顏色（代表難度）。

每頁讀同一個 `T`，改那一行就換掉整份 deck 的皮。這對應原 Slidev 用 headmatter 切換的做法；open-slide 沒有執行期切換，所以改成 authoring-time 的一行設定。

## 開始

1. 複製 helper kit：把 `slides/fhsh-isiphs-demo/index.tsx` 從最上方 import 到 `const ToC = ...` 為止整段貼進你的 `slides/<你的 id>/index.tsx`。這段是 boilerplate，每份 deck 各帶一份（open-slide 主題是 paste-ready，不是共用 library）。
2. 設定主題：

   ```tsx
   const T = makeTheme('fhsh', 0); // (themeName, courseLevel)
   ```

3. 用版型 helper 寫頁面並 export：

   ```tsx
   const P1: Page = () => <Cover theme={T} title="標題" subtitle="副標" />;
   const P2: Page = () => (
     <Default theme={T} title="重點">
       <ul><li>第一點</li><li>第二點</li></ul>
     </Default>
   );
   export default [P1, P2] satisfies Page[];
   export const meta: SlideMeta = { title: '我的課程', theme: 'fhsh-isiphs-universal' };
   ```

## 兩軸切換

`makeTheme(themeName, courseLevel)`：

| 軸 | 值 | 效果 |
|---|---|---|
| `themeName` | `'fhsh'`（預設） | 復興高中品牌圖 |
| | `'isip.hs'` | ISIP.hs 品牌圖 |
| `courseLevel` | `0`（預設） | 綠框 `#c2d59b` |
| | `1` | 藍框 `#92d2ef` |
| | `2` | 橘框 `#fab150` |

兩軸正交：換 `themeName` 不動框色，換 `courseLevel` 不動品牌圖。`courseLevel` 越界會夾回 0。

## 版型

每個 helper 都接 `theme={T}`，回傳一個 `Page`。

| Helper | 用途 | 主要 props |
|---|---|---|
| `Cover` | 封面 | `title`, `subtitle` |
| `Section` | 章節分隔 | `title`, `subtitle` |
| `Default` | 內文頁 | `title`, `children` |
| `ImagePage` | 整頁圖 | `src`, `alt` |
| `ToC` | 目錄清單 | `items: ReactNode[]` |

- `Cover`/`Section` 不顯示頁碼；`Default`/`ImagePage` 顯示。
- `Default` 的 `children` 包在 `.osd-fhsh-content` 裡：`<h3>`/`<p>`/`<ul>`/`<ol>`/`<a>` 會自動套字級、清單符號（❖ ➢ ◼︎ 三層）、連結色。
- `ToC` 是手動清單（open-slide 沒有跨頁導覽 API），自己把章節字串列進 `items`。

## 換圖

不想用 `themeName` 預設圖時，逐頁傳 props。`*Style` 是 `CSSProperties`，疊在預設定位之上，可以只覆寫單一屬性（例如只改 `top`）。

| 版型 | 換什麼 | props |
|---|---|---|
| `Cover` | slogon | `slogon` / `slogonStyle` |
| `Section` | 章節圖 | `sectionImg` / `sectionImgStyle` |
| 所有版型 | 左上 logo | `logo` / `logoStyle` |
| `ImagePage` | 整頁圖 | `src` |

```tsx
import myCover from './assets/cover.png';                       // 單一 slide 專用：slides/<id>/assets/
import isipSec from '@assets/fhsh-isiphs/isip-hs/section-img.png'; // 跨 deck 共用：assets/

<Cover   theme={T} title="標題" slogon={myCover} slogonStyle={{ top: 560, width: 900 }} />
<Section theme={T} title="第一章" sectionImg={isipSec} sectionImgStyle={{ top: 540, right: 134, width: 691 }} />
<Default theme={T} title="客座講者" logo={isipSec} logoStyle={{ width: 120 }}>…</Default>
```

不傳就用預設。範例 deck 的 page 4（換 section 圖）與 page 8（換 logo + slogon）是可照抄的樣板。

## 版面與字級規則

畫布固定 1920×1080、不捲動。照這些值走，整份 deck 的閱讀體驗才一致。

字級（px）：h1 `105` / h2 `94` / section h2 `81` / h3 `78` / 內文 `64` / 清單 `64`·`58`·`52` / 頁碼 `31`。

版面：

- 內文閱讀欄：`top 230`、左右各留 `200`（寬 `1520`）、高 `700`。正文不貼色框與虛線參考線。
- `Cover` 標題框 `top 290`：清開上緣參考線，並置中於 slogon 上方。
- 左上 logo：`left 38` / `top 38` / `width 100`。
- 一頁塞不下就拆頁——超出 1080 的部分會被裁切。

## 資產與字體

- 品牌圖：`assets/fhsh-isiphs/{fhsh,isip-hs}/{logo.png, section-img.png, slogon.svg}`。
- 字體：`assets/fhsh-isiphs/fonts/edukai-fixed.woff2`（楷體，CJK，8.7MB；首次載入較慢，`font-display:swap` 會先用 fallback 顯示）。helper kit 在 module 層注入一次 `@font-face` 與 Noto Sans TC（Google Fonts）。

## 注意

- 不要改 `package.json`、`open-slide.config.ts`、其他 slide；不加相依（只用 `react` 與 web API）。
- 每頁會同時掛載（縮圖列、總覽、PDF），所以字體與樣式注入寫在 module 層，不要放進 component 的 render。
- `themeName: 'isip.hs'` 對應的資產資料夾是 `isip-hs`（避開路徑裡的點），`makeTheme` 內部已處理對應。
