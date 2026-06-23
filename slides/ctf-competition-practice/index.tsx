// 資安競賽實務 — ISIP.hs 離島區種子師資研習營 Day 2（2026/06/27）· 復興高中 陳晉
// 單一 index.tsx 連貫 deck。theme = fhsh-isiphs-universal（isip.hs / courseLevel 2 橘）。
// 內容藍本見 .spectra/subject/20260626_0628/（00–08 + HANDOFF）。
import type { CSSProperties, ReactNode } from 'react';
import type { DesignSystem, Page, SlideMeta, SlideTransition } from '@open-slide/core';
import { Step, Steps, useSlidePageNumber } from '@open-slide/core';

import isipLogo from '@assets/fhsh-isiphs/isip-hs/logo.png';
import isipSection from '@assets/fhsh-isiphs/isip-hs/section-img.png';
import isipSlogon from '@assets/fhsh-isiphs/isip-hs/slogon.svg';
import fhshLogo from '@assets/fhsh-isiphs/fhsh/logo.png';
import fhshSection from '@assets/fhsh-isiphs/fhsh/section-img.png';
import fhshSlogon from '@assets/fhsh-isiphs/fhsh/slogon.svg';
import edukaiWoff2 from '@assets/fhsh-isiphs/fonts/edukai-fixed.woff2';

// ── 字體（module 層 idempotent 注入 head 一次）─────────────────────────────────────
const SANS = '"edukai", "Noto Sans TC", "Microsoft JhengHei", sans-serif';
const MONO = '"Source Code Pro", ui-monospace, monospace';
if (typeof document !== 'undefined' && !document.getElementById('osd-fhsh-isiphs-fonts')) {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href =
    'https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@400;500;700;900&family=Source+Code+Pro&display=swap';
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

// ── makeTheme / Frame / page helper（與 themes/fhsh-isiphs-universal.md 同步）─────────
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
    themeName,
    courseLevel: lv,
    frame: LEVELS[lv],
    assets: ASSETS[themeName],
    palette: { primary: '#3b82f6', borderBlue: '#6bbae7', text: '#000000', bg: '#ffffff', link: '#0284c7', linkHover: '#1e40af' },
    fonts: { sans: SANS, mono: MONO },
    coverSlogonTop: isIsip ? 540 : 605,
    sectionImgTop: isIsip ? 486 : 432,
  };
}
type Theme = ReturnType<typeof makeTheme>;

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
    {items.map((t, i) => (
      <li key={i} style={{ marginBottom: 24 }}>{t}</li>
    ))}
  </ol>
);

// ── 本 deck 自訂共用元件 ──────────────────────────────────────────────────────────
// 置中大字陳述（命題埋種子 / 重捶）
const Statement = ({ theme, eyebrow, children }: { theme: Theme; eyebrow?: string; children: ReactNode }) => (
  <DeckPage theme={theme} showPageNumber={false}>
    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '0 220px', zIndex: 2 }}>
      {eyebrow && <div style={{ fontSize: 44, fontWeight: 700, color: '#e07b1a', letterSpacing: '0.08em', marginBottom: 44 }}>{eyebrow}</div>}
      <div style={{ fontSize: 88, fontWeight: 700, lineHeight: 1.35, textAlign: 'center' }}>{children}</div>
    </div>
  </DeckPage>
);

// 條列列（逐步揭露用，Step 的直接內容）
const RoadRow = ({ children }: { children: ReactNode }) => (
  <div style={{ fontSize: 60, lineHeight: 1.5, marginBottom: 22, display: 'flex', gap: 20 }}>
    <span style={{ color: '#e07b1a', flex: '0 0 auto' }}>❖</span>
    <span>{children}</span>
  </div>
);

// 梗圖插槽：講者自填。改成真梗圖時把整頁換成 <ImagePage src={...}/> 即可。
const MemeSlot = ({ theme, intent }: { theme: Theme; intent: string }) => (
  <DeckPage theme={theme} showPageNumber={false}>
    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', zIndex: 2 }}>
      <div style={{ width: 1180, height: 540, border: '8px dashed #e0c485', borderRadius: 28, background: '#fbf7ee', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 28 }}>
        <div style={{ fontSize: 140, lineHeight: 1 }}>🖼️</div>
        <div style={{ fontSize: 52, fontWeight: 700, color: '#b07d23' }}>MEME 插槽</div>
        <div style={{ fontSize: 40, color: '#6b5836', textAlign: 'center', maxWidth: 980, lineHeight: 1.5 }}>意圖：{intent}</div>
      </div>
    </div>
  </DeckPage>
);

// ── 原生轉場（單一 DNA：RISE 房間預設 + SETTLE 封面）────────────────────────────────
const EASE_OUT = 'cubic-bezier(0, 0, 0.2, 1)';
const EASE_IN = 'cubic-bezier(0.4, 0, 1, 1)';
const RISE: SlideTransition = {
  duration: 200,
  exit: { duration: 140, easing: EASE_IN, keyframes: [{ opacity: 1, transform: 'translateY(0)' }, { opacity: 0, transform: 'translateY(-4px)' }] },
  enter: { duration: 200, delay: 80, easing: EASE_OUT, keyframes: [{ opacity: 0, transform: 'translateY(6px)' }, { opacity: 1, transform: 'translateY(0)' }] },
};
const SETTLE: SlideTransition = {
  duration: 280,
  exit: { duration: 160, easing: EASE_IN, keyframes: [{ opacity: 1, transform: 'translateY(0)' }, { opacity: 0, transform: 'translateY(-6px)' }] },
  enter: { duration: 280, delay: 100, easing: EASE_OUT, keyframes: [{ opacity: 0, transform: 'translateY(12px)', filter: 'blur(4px)' }, { opacity: 1, transform: 'translateY(0)', filter: 'blur(0)' }] },
};

// ── deck 設定 ─────────────────────────────────────────────────────────────────────
const T = makeTheme('isip.hs', 2); // isip.hs 品牌 · courseLevel 2（橘 / 進階）

// ════════════════════════════ Part 0 開場（精簡）════════════════════════════
const P0Cover: Page = () => <Cover theme={T} title="資安競賽實務" subtitle="從解題，到防禦" />;
P0Cover.transition = SETTLE;

const P0Roadmap: Page = () => (
  <Default theme={T} title="今天的路線">
    <Steps>
      <Step><RoadRow>OSINT — 從公開足跡找線索（暖場）</RoadRow></Step>
      <Step><RoadRow>Web — 一條龍打進後台</RoadRow></Step>
      <Step><RoadRow>REV／WASM — 在瀏覽器裡作弊（高潮）</RoadRow></Step>
      <Step><RoadRow>Blue Team — 當一次鑑識分析師（壓軸）</RoadRow></Step>
      <Step><RoadRow>貫穿全場：用 AI 幫你出題</RoadRow></Step>
      <Step><RoadRow>收束：教攻擊，為了教更強的藍隊</RoadRow></Step>
    </Steps>
  </Default>
);

const P0Thesis: Page = () => (
  <Statement theme={T} eyebrow="今天的主軸">
    教攻擊，<br />是為了教出更棒的<br />藍隊防禦者。
  </Statement>
);

const P0Meme: Page = () => <MemeSlot theme={T} intent="開場破冰：駭客 ≠ 壞人，我們在教『防禦』" />;

// ── 匯出 ──────────────────────────────────────────────────────────────────────────
export default [P0Cover, P0Roadmap, P0Thesis, P0Meme] satisfies Page[];

export const transition: SlideTransition = RISE;

export const meta: SlideMeta = {
  title: '資安競賽實務 — ISIP.hs 種子師資研習',
  theme: 'fhsh-isiphs-universal',
  createdAt: '2026-06-23T18:19:45.565Z',
};

export const design: DesignSystem = {
  palette: { bg: '#ffffff', text: '#000000', accent: '#e07b1a' },
  fonts: { display: SANS, body: SANS },
  typeScale: { hero: 105, body: 64 },
  radius: 16,
};
