---
name: FHSH AiSP × ISIP.hs Universal
description: 臺北市立復興高級中學（FHSH）AiSP × ISIP.hs 資安課程通用主題，兩軸切換 themeName(fhsh/isip.hs 品牌) × courseLevel(0/1/2 等級色框 綠/藍/橘)，白底彩框、edukai 楷體 + Noto Sans TC。移植自 slidev-theme-fhsh-isiphs-universal。
---

# FHSH AiSP × ISIP.hs Universal

白底 + 一圈粗彩色外框的教學簡報主題。兩個正交切換軸：

- **themeName** `fhsh` | `isip.hs` → 品牌圖組（logo / section-img / slogon）。
- **courseLevel** `0` | `1` | `2` → 等級色框（綠 / 藍 / 橘），代表課程難度。

open-slide 無執行期切換，故以 authoring-time 的 `makeTheme(themeName, courseLevel)` 取代原 Slidev headmatter：slide 頂端 `const T = makeTheme('isip.hs', 1)`，全頁讀 `T`，改一行即整份換皮。

## Palette

| Role | Value | Notes |
| --- | --- | --- |
| bg | `#ffffff` | 頁面白底 |
| text | `#000000` | 主要文字 |
| accent / primary | `#3b82f6` | 主題藍（強調） |
| borderBlue | `#6bbae7` | 次要藍邊 |
| link | `#0284c7` | 連結（sky-600） |
| linkHover | `#1e40af` | 連結 hover（blue-800） |
| frame L0 綠 | `#c2d59b` / guide `#b3cc82` | courseLevel 0 外框 / 虛線 |
| frame L1 藍 | `#92d2ef` / guide `#92ccdc` | courseLevel 1 |
| frame L2 橘 | `#fab150` / guide `#f79646` / footer `#fdad4d` | courseLevel 2（footer 虛線較淺，為唯一例外） |

## Typography

- 內文字：`"edukai", "Noto Sans TC", "Microsoft JhengHei", sans-serif`（edukai＝本地楷體 woff2，CJK）。
- 程式碼字：`"Source Code Pro", ui-monospace, monospace`。
- 字級（1920×1080，px；由原 rem×1.959 換算）：
  - Hero / 頁標題 h1：**105**（nowrap + ellipsis）
  - h2：**94**；section h2：**81**
  - h3：**78**；ToC item：**70**
  - 內文 / 清單 lv1：**64**；lv2：**58**；lv3：**52**（閱讀體驗優化，較原 port 放大）
  - 頁碼：**31**
- 清單 marker：`❖`（lv1）/ `➢`（lv2）/ `◼︎`（lv3）。

## Layout

- 畫布 1920×1080；白底；每頁 `<Frame>` 鋪底（色框＋虛線參考線）＋左上 logo（left 38 / top 38 / w 100）＋底部置中頁碼（cover/section 預設關閉）。
- section 標題框：top **227** / left **134** / w **1651** / h **702**。
- **default 內文閱讀欄（reading column）**：top **230** / left **200** / w **1520** / h **700**——兩側各內收至 200px、不貼齊色框與參考線，body 字 **64px**（閱讀體驗規則，詳見分析 06）。
- cover：標題置中、內容框 top **290**（下移避免貼上緣參考線、並置中於 slogon 上方）；slogon left 154 / w 806 / top 605(fhsh)·540(isip.hs)，可逐頁覆寫（`slogon` + `slogonStyle`）。
- section：h1 pl 188 / pt 41，h2 pl 376；sectionImg right 106 / w 922 / top 432(fhsh)·486(isip.hs)，可逐頁覆寫（`sectionImg` + `sectionImgStyle`）。
- default：頂部置中標題（top≈100）＋內容框＋右下 slogon（w 230）。
- image：內容框內單圖 object-cover 撐滿。

## Fixed components

> 以下為 paste-ready。複製整段到 slide / demo 後，頂端設 `const T = makeTheme(themeName, courseLevel)` 即可。資產走全域 `@assets/fhsh-isiphs/...`（已隨主題放入）。完整可跑版見 `themes/fhsh-isiphs-universal.demo.tsx` 與 `slides/fhsh-isiphs-demo/index.tsx`。

```tsx
import type { CSSProperties, ReactNode } from 'react';
import type { Page } from '@open-slide/core';
import { useSlidePageNumber } from '@open-slide/core';

import fhshLogo from '@assets/fhsh-isiphs/fhsh/logo.png';
import fhshSection from '@assets/fhsh-isiphs/fhsh/section-img.png';
import fhshSlogon from '@assets/fhsh-isiphs/fhsh/slogon.svg';
import isipLogo from '@assets/fhsh-isiphs/isip-hs/logo.png';
import isipSection from '@assets/fhsh-isiphs/isip-hs/section-img.png';
import isipSlogon from '@assets/fhsh-isiphs/isip-hs/slogon.svg';
import edukaiWoff2 from '@assets/fhsh-isiphs/fonts/edukai-fixed.woff2';

const SANS = '"edukai", "Noto Sans TC", "Microsoft JhengHei", sans-serif';
const MONO = '"Source Code Pro", ui-monospace, monospace';
if (typeof document !== 'undefined' && !document.getElementById('osd-fhsh-isiphs-fonts')) {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = 'https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@400;500;700;900&family=Source+Code+Pro&display=swap';
  document.head.appendChild(link);
  const style = document.createElement('style');
  style.id = 'osd-fhsh-isiphs-fonts';
  style.textContent =
    `@font-face{font-family:'edukai';src:url(${edukaiWoff2}) format('woff2');font-weight:normal;font-style:normal;font-display:swap;}` +
    `.osd-fhsh-content p{font-size:64px;line-height:1.6;margin:0 0 24px;}` +
    `.osd-fhsh-content h3{font-size:78px;line-height:1.4;margin:0 0 16px;}` +
    `.osd-fhsh-content ul{list-style:none;padding-left:64px;margin:0 0 24px;}` +
    `.osd-fhsh-content ol{list-style:decimal;padding-left:96px;font-size:64px;line-height:1.6;margin:0 0 24px;}` +
    `.osd-fhsh-content li{font-size:64px;line-height:1.6;}` +
    `.osd-fhsh-content ul>li::before{content:"\\2756  ";}` +
    `.osd-fhsh-content ul ul{padding-left:40px;}` +
    `.osd-fhsh-content ul ul>li{font-size:58px;}` +
    `.osd-fhsh-content ul ul>li::before{content:"\\27A2  ";}` +
    `.osd-fhsh-content ul ul ul>li{font-size:52px;}` +
    `.osd-fhsh-content ul ul ul>li::before{content:"\\25FC  ";}` +
    `.osd-fhsh-content a{color:#0284c7;text-decoration:underline;text-underline-offset:2px;}` +
    `.osd-fhsh-content a:hover{color:#1e40af;}`;
  document.head.appendChild(style);
}

type ThemeName = 'fhsh' | 'isip.hs';
type Lvl = 0 | 1 | 2;
const LEVELS = {
  0: { frame: '#c2d59b', guide: '#b3cc82', footer: '#b3cc82' },
  1: { frame: '#92d2ef', guide: '#92ccdc', footer: '#92ccdc' },
  2: { frame: '#fab150', guide: '#f79646', footer: '#fdad4d' },
} as const;
const ASSETS = {
  fhsh: { logo: fhshLogo, sectionImg: fhshSection, slogon: fhshSlogon },
  'isip.hs': { logo: isipLogo, sectionImg: isipSection, slogon: isipSlogon },
} as const;
function makeTheme(themeName: ThemeName = 'fhsh', courseLevel: Lvl = 0) {
  const lv = (courseLevel < 0 || courseLevel > 2 ? 0 : courseLevel) as Lvl;
  const isIsip = themeName === 'isip.hs';
  return {
    themeName, courseLevel: lv, frame: LEVELS[lv], assets: ASSETS[themeName],
    palette: { primary: '#3b82f6', borderBlue: '#6bbae7', text: '#000000', bg: '#ffffff', link: '#0284c7', linkHover: '#1e40af' },
    fonts: { sans: SANS, mono: MONO },
    coverSlogonTop: isIsip ? 540 : 605,
    sectionImgTop: isIsip ? 486 : 432,
  };
}
type Theme = ReturnType<typeof makeTheme>;

// 等級色框：參數化重繪（幾何＝原 960×540 SVG ×2）
const Frame = ({ theme }: { theme: Theme }) => (
  <svg viewBox="0 0 1920 1080" preserveAspectRatio="none" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
    <rect x="0" y="0" width="1920" height="1080" fill="#ffffff" />
    <rect x="11.4" y="11.4" width="1893.6" height="1054.56" fill="none" stroke={theme.frame.frame} strokeWidth="40" />
    <line x1="129.36" y1="0" x2="129.36" y2="1080" stroke={theme.frame.guide} strokeWidth="2" strokeDasharray="8 6" />
    <line x1="1782.72" y1="0" x2="1782.72" y2="1080" stroke={theme.frame.guide} strokeWidth="2" strokeDasharray="8 6" />
    <line x1="0" y1="89.76" x2="1920" y2="89.76" stroke={theme.frame.guide} strokeWidth="2" strokeDasharray="8 6" />
    <line x1="0" y1="228" x2="1920" y2="228" stroke={theme.frame.guide} strokeWidth="2" strokeDasharray="8 6" />
    <line x1="64.62" y1="933.54" x2="1855.38" y2="933.54" stroke={theme.frame.footer} strokeWidth="2" strokeDasharray="16 6" />
  </svg>
);

// base：色框 + logo + 頁碼
const DeckPage = ({ theme, showPageNumber = true, logo, logoStyle, children }: { theme: Theme; showPageNumber?: boolean; logo?: string; logoStyle?: CSSProperties; children?: ReactNode }) => {
  const { current, total } = useSlidePageNumber();
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', background: theme.palette.bg, color: theme.palette.text, fontFamily: theme.fonts.sans, overflow: 'hidden' }}>
      <Frame theme={theme} />
      {children}
      <img src={logo ?? theme.assets.logo} alt="logo" style={{ position: 'absolute', left: 38, top: 38, width: 100, zIndex: 10, ...logoStyle }} />
      {showPageNumber && (
        <div style={{ position: 'absolute', bottom: 54, left: 134, width: 1651, textAlign: 'center', fontSize: 31, color: theme.palette.text, zIndex: 10 }}>
          {current} / {total}
        </div>
      )}
    </div>
  );
};

const Cover = ({ theme, logo, logoStyle, title, subtitle, slogon, slogonStyle }: { theme: Theme; logo?: string; logoStyle?: CSSProperties; title: ReactNode; subtitle?: ReactNode; slogon?: string; slogonStyle?: CSSProperties }) => (
  <DeckPage theme={theme} showPageNumber={false} logo={logo} logoStyle={logoStyle}>
    <div style={{ position: 'absolute', top: 290, left: 134, width: 1651, height: 702, zIndex: 2 }}>
      <h1 style={{ fontSize: 105, fontWeight: 700, textAlign: 'center', margin: 0, lineHeight: 1.1 }}>{title}</h1>
      {subtitle && <h2 style={{ fontSize: 94, fontWeight: 700, textAlign: 'center', margin: '24px 0 0' }}>{subtitle}</h2>}
    </div>
    <img src={slogon ?? theme.assets.slogon} alt="slogon" style={{ position: 'absolute', left: 154, width: 806, top: theme.coverSlogonTop, zIndex: 2, ...slogonStyle }} />
  </DeckPage>
);

const Section = ({ theme, logo, logoStyle, title, subtitle, sectionImg, sectionImgStyle }: { theme: Theme; logo?: string; logoStyle?: CSSProperties; title: ReactNode; subtitle?: ReactNode; sectionImg?: string; sectionImgStyle?: CSSProperties }) => (
  <DeckPage theme={theme} showPageNumber={false} logo={logo} logoStyle={logoStyle}>
    <div style={{ position: 'absolute', top: 227, left: 134, width: 1651, height: 702, zIndex: 2 }}>
      <h1 style={{ fontSize: 105, fontWeight: 700, margin: 0, paddingLeft: 188, paddingTop: 41, lineHeight: 1.1 }}>{title}</h1>
      {subtitle && <h2 style={{ fontSize: 81, fontWeight: 700, margin: 0, paddingLeft: 376, paddingTop: 13 }}>{subtitle}</h2>}
    </div>
    <img src={sectionImg ?? theme.assets.sectionImg} alt="section" style={{ position: 'absolute', top: theme.sectionImgTop, right: 106, width: 922, zIndex: 1, ...sectionImgStyle }} />
  </DeckPage>
);

const Default = ({ theme, logo, logoStyle, title, children }: { theme: Theme; logo?: string; logoStyle?: CSSProperties; title?: ReactNode; children?: ReactNode }) => (
  <DeckPage theme={theme} logo={logo} logoStyle={logoStyle}>
    {title && (
      <div style={{ position: 'absolute', top: 100, left: 134, width: 1651, height: 125, textAlign: 'center', zIndex: 2 }}>
        <h1 style={{ fontSize: 105, fontWeight: 700, margin: 0, lineHeight: 1.1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{title}</h1>
      </div>
    )}
    <div className="osd-fhsh-content" style={{ position: 'absolute', top: 230, left: 200, width: 1520, height: 700, fontSize: 64, lineHeight: 1.6, zIndex: 2 }}>
      {children}
    </div>
    <img src={theme.assets.slogon} alt="slogon" style={{ position: 'absolute', bottom: 43, right: 38, width: 230, zIndex: 2 }} />
  </DeckPage>
);

const ImagePage = ({ theme, logo, logoStyle, src, alt }: { theme: Theme; logo?: string; logoStyle?: CSSProperties; src: string; alt?: string }) => (
  <DeckPage theme={theme} logo={logo} logoStyle={logoStyle}>
    <div style={{ position: 'absolute', top: 227, left: 134, width: 1651, height: 702, display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 2 }}>
      <img src={src} alt={alt ?? ''} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
    </div>
  </DeckPage>
);

const ToC = ({ items }: { items: ReactNode[] }) => (
  <ol style={{ listStyle: 'decimal', fontSize: 70, lineHeight: 1.6, paddingLeft: 96, margin: 0 }}>
    {items.map((t, i) => <li key={i} style={{ marginBottom: 24 }}>{t}</li>)}
  </ol>
);
```

## Motion

Static。原主題無進場動畫；切換靠 `makeTheme` 一行，視覺以白底彩框的清晰教學風為主，不加額外 keyframe。

## Aesthetic

教育／簡潔。白底、一圈粗彩色外框（顏色＝課程難度），搭配淡色虛線版面參考線，營造「講義 / 學習單」的紙本感。楷體（edukai）顯示繁體中文，親切、好讀；強調色為主題藍 `#3b82f6`。避免漸層、陰影堆疊、裝飾性 emoji；維持大量留白與穩定格線。

## Example usage

```tsx
const T = makeTheme('isip.hs', 1); // ← 改這一行（品牌, 等級）即整份換皮

const Cover1: Page = () => <Cover theme={T} title="課程標題" subtitle="副標題" />;
const Intro: Page = () => (
  <Default theme={T} title="今天的重點">
    <ul>
      <li>第一點<ul><li>細項</li></ul></li>
      <li>第二點</li>
    </ul>
    <p>參考：<a href="#">連結</a></p>
  </Default>
);
const Chapter: Page = () => <Section theme={T} title="第一章" subtitle="導論" />;

export default [Cover1, Intro, Chapter] satisfies Page[];
```

## 圖片替換（per-slide image override）

`Cover` 與 `Section` 的圖都能逐頁替換，不想用 `themeName` 預設圖時直接傳 props（位置/大小用 `*Style` 覆寫）。`Image` 版型本來就吃自訂 `src`。

```tsx
import customCover from './assets/my-cover.png';   // slide 私有圖：slides/<id>/assets/
import customSection from '@assets/fhsh-isiphs/isip-hs/section-img.png'; // 或全域圖

// Cover：換掉品牌 slogon 圖（+ 自訂位置/大小）
<Cover theme={T} title="課程標題" subtitle="副標題"
       logo={customLogo} logoStyle={{ width: 120 }}
       slogon={customCover}
       slogonStyle={{ left: 154, top: 560, width: 900 }} />

// Section：換掉 section 圖（對應原 Slidev sectionImg / sectionImgStyleClass）
<Section theme={T} title="第一章" subtitle="導論"
         sectionImg={customSection}
         sectionImgStyle={{ top: 540, right: 134, width: 691 }} />

// Image：整頁就是一張自訂圖（object-cover 撐滿閱讀區）
<ImagePage theme={T} src={customSection} alt="說明圖" />
```

- 不傳 `slogon`/`sectionImg` → 用 `makeTheme` 的 `themeName` 預設圖。
- `slogonStyle`/`sectionImgStyle` 是 `CSSProperties`，會 spread 疊在預設定位之上（可只覆寫 `top`/`width` 等單一屬性）。
- **logo（左上角）**：所有版型都可逐頁換——傳 `logo` + `logoStyle`（由 `DeckPage` 提供，Cover/Section/Default/Image 通用）。
- 圖檔放哪：單一 slide 專用 → `slides/<id>/assets/`（相對 import）；跨 deck 共用 → 全域 `assets/...`（`@assets/...`）。
