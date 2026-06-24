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

// 截圖插槽：講者 demo 時補玩家視角截圖（勿露 src/solution/flag）。
const ShotSlot = ({ hint, h = 470 }: { hint: string; h?: number }) => (
  <div style={{ width: '100%', height: h, border: '6px dashed #cfd6e0', borderRadius: 20, background: '#f6f8fb', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 16 }}>
    <div style={{ fontSize: 76, lineHeight: 1 }}>🖥️</div>
    <div style={{ fontSize: 34, fontWeight: 700, color: '#6b7a90' }}>截圖插槽（玩家視角）</div>
    <div style={{ fontSize: 30, color: '#7c8a9c', textAlign: 'center', maxWidth: 1100, lineHeight: 1.5 }}>{hint}</div>
  </div>
);

// 標籤膠囊（分類 / 技術詞）
const Pill = ({ children, color = '#e07b1a' }: { children: ReactNode; color?: string }) => (
  <span style={{ display: 'inline-block', border: `3px solid ${color}`, color, borderRadius: 999, padding: '6px 30px', fontSize: 42, fontWeight: 700, margin: '0 14px 18px 0' }}>{children}</span>
);

// mono 指令 / 程式 / 輸出塊（只放玩家視角）
const Mono = ({ children, size = 38 }: { children: ReactNode; size?: number }) => (
  <div style={{ fontFamily: MONO, fontSize: size, background: '#f4f2ec', border: '2px solid #e0dacb', borderRadius: 14, padding: '20px 28px', lineHeight: 1.55, whiteSpace: 'pre-wrap', wordBreak: 'break-word', color: '#1b1b1b' }}>{children}</div>
);

// 條列點（writeup / 一般頁用，密度比 osd-fhsh-content 低）
const Bullet = ({ children, sub = false }: { children: ReactNode; sub?: boolean }) => (
  <div style={{ display: 'flex', gap: 18, fontSize: sub ? 44 : 54, lineHeight: 1.5, marginBottom: 20 }}>
    <span style={{ color: '#e07b1a', flex: '0 0 auto' }}>{sub ? '➢' : '❖'}</span>
    <span>{children}</span>
  </div>
);

// writeup 步驟頁：徽章「步驟 N / 共 M」+ 四拍標記（動作/原理/觀察/線索）+ 低密度內容
const StepPage = ({ theme, badge, beat, title, children }: { theme: Theme; badge: string; beat?: string; title: ReactNode; children: ReactNode }) => (
  <DeckPage theme={theme}>
    <div style={{ position: 'absolute', top: 96, left: 200, right: 160, display: 'flex', gap: 24, alignItems: 'center', zIndex: 2 }}>
      <span style={{ fontSize: 38, fontWeight: 700, color: '#fff', background: '#e07b1a', borderRadius: 10, padding: '6px 26px' }}>{badge}</span>
      {beat && <span style={{ fontSize: 38, fontWeight: 700, color: '#b07d23' }}>{beat}</span>}
    </div>
    <div style={{ position: 'absolute', top: 168, left: 200, right: 160, zIndex: 2 }}>
      <h1 style={{ fontSize: 66, fontWeight: 700, margin: 0, lineHeight: 1.2 }}>{title}</h1>
    </div>
    <div style={{ position: 'absolute', top: 296, left: 200, width: 1520, height: 600, zIndex: 2 }}>{children}</div>
    <img src={theme.assets.slogon} alt="slogon" style={{ position: 'absolute', bottom: 43, right: 38, width: 230, zIndex: 2 }} />
  </DeckPage>
);

// 兩欄卡片列（教學鏡頭 / 對照）
const Cards = ({ children }: { children: ReactNode }) => (
  <div style={{ display: 'flex', gap: 40, marginTop: 12 }}>{children}</div>
);
const Card = ({ title, body, accent = '#e07b1a' }: { title: ReactNode; body: ReactNode; accent?: string }) => (
  <div style={{ flex: 1, border: `4px solid ${accent}`, borderRadius: 22, padding: '36px 40px', background: '#fffdf8' }}>
    <div style={{ fontSize: 50, fontWeight: 700, color: accent, marginBottom: 22, lineHeight: 1.25 }}>{title}</div>
    <div style={{ fontSize: 40, lineHeight: 1.5 }}>{body}</div>
  </div>
);

// 下載卡（skill zip）
const DownloadCard = ({ name, desc, href, size }: { name: string; desc: string; href: string; size: string }) => (
  <div style={{ flex: 1, border: '4px solid #e07b1a', borderRadius: 22, padding: '40px 44px', background: '#fffdf8', display: 'flex', flexDirection: 'column', gap: 18 }}>
    <div style={{ fontSize: 64, lineHeight: 1 }}>📦</div>
    <div style={{ fontFamily: MONO, fontSize: 46, fontWeight: 700 }}>{name}</div>
    <div style={{ fontSize: 38, lineHeight: 1.5, color: '#3a3a3a' }}>{desc}</div>
    <a href={href} download style={{ fontFamily: MONO, fontSize: 34, color: '#0284c7', wordBreak: 'break-all' }}>⬇ 下載（{size}）</a>
  </div>
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

// 老師可下載的出題 skill 包（已複製進 assets/，線上版公開可點）
const WEBCHALL_ZIP = new URL('./assets/webchall-master.zip', import.meta.url).href;
const BLUECHALL_ZIP = new URL('./assets/bluechall-master.zip', import.meta.url).href;

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

// ════════════════════════ Part 1 打 CTF → 出 CTF ════════════════════════
const P1Section: Page = () => <Section theme={T} title="Part 1" subtitle="從打 CTF，到出 CTF" />;

const P1WhatIsCTF: Page = () => (
  <Default theme={T} title="CTF 是什麼？">
    <div style={{ marginTop: 8 }}>
      <Bullet>Capture The Flag — 把藏起來的一串 <span style={{ fontFamily: MONO }}>flag</span> 找出來，換分數</Bullet>
      <Bullet>最常見＝Jeopardy（解謎式）：一格一題、各自獨立、越難分越高</Bullet>
      <Bullet>打的不是真實系統——是出題者準備好的「靶場」，合法、安全</Bullet>
    </div>
  </Default>
);

const P1Categories: Page = () => (
  <Default theme={T} title="題目分類（今天走 4 類）">
    <div style={{ marginTop: 24, marginBottom: 40 }}>
      <Pill>OSINT</Pill><Pill>Web</Pill><Pill>REV</Pill><Pill color="#9aa3ad">Pwn</Pill>
      <Pill color="#9aa3ad">Crypto</Pill><Pill>Forensics ／ Blue</Pill><Pill color="#9aa3ad">Misc</Pill>
    </div>
    <div style={{ fontSize: 54, lineHeight: 1.5 }}>
      今天的路線：<span style={{ color: '#e07b1a', fontWeight: 700 }}>OSINT → Web → REV／WASM → Blue Team</span>
      <div style={{ fontSize: 42, color: '#555', marginTop: 18 }}>從「不用寫 code」一路到「鑑識分析」，難度與深度逐步上升。</div>
    </div>
  </Default>
);

const P1Lifecycle: Page = () => (
  <Default theme={T} title="一道題的生命週期">
    <div style={{ marginTop: 12 }}>
      <Steps>
        <Step><Bullet>① 出題：定考點 → 寫題目敘述 → 做靶機</Bullet></Step>
        <Step><Bullet>② 部署：用 Docker 把靶機架起來，給選手連</Bullet></Step>
        <Step><Bullet>③ 解題：選手分析、找漏洞、拿到 flag</Bullet></Step>
        <Step><Bullet>④ 驗題：出題者自己（或派人）確認「真的解得出來、沒有非預期解」</Bullet></Step>
        <Step><Bullet>⑤ writeup：把解法寫成步驟教學，賽後分享</Bullet></Step>
      </Steps>
    </div>
  </Default>
);

const P1Lenses: Page = () => (
  <Default theme={T} title="每一題，都用三個鏡頭看">
    <Cards>
      <Card title="① 如何分析" body="拿到題目怎麼拆？線索在哪、下一步往哪走。" />
      <Card title="② 如何帶學生" body="怎麼入門、卡關怎麼引導、適合幾年級。" />
      <Card title="③ 出題幕後" body="這題怎麼用 AI 出的、怎麼確保不被秒解。" />
    </Cards>
    <div style={{ fontSize: 40, color: '#555', marginTop: 44, textAlign: 'center' }}>同一組鏡頭看四題 → 老師學到的是「可遷移的方法」，不是單一題解。</div>
  </Default>
);

const P1Meme1: Page = () => <MemeSlot theme={T} intent="分類像 RPG 選職業：每一類都是一種『破關玩法』" />;

const P1AIIntro: Page = () => (
  <Statement theme={T} eyebrow="貫穿全場的副線">
    今天這四題，<br />全部是用 <span style={{ color: '#e07b1a' }}>AI</span> 出的。
  </Statement>
);

const P1AINouns: Page = () => (
  <Default theme={T} title="先講三個詞（從零）">
    <Cards>
      <Card title="AI agent" body="會自己讀檔、跑指令、做決定的 AI——不只是聊天框。" />
      <Card title="skill 技能包" body="給 agent 的一本專業手冊＋工具，這裡是『出 CTF 題』的手冊。" />
      <Card title="pipeline 流水線" body="把出題拆成有順序的關卡，每關交付一點、檢查一次。" />
    </Cards>
  </Default>
);

const PIPE_STAGES = ['Brief', 'Design', 'Scaffold', 'Implement', 'Analyze', 'Validate', 'Publish'];
const P1Pipeline: Page = () => (
  <Default theme={T} title="出題流水線：七關，每關都審查">
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'center', marginTop: 36 }}>
      {PIPE_STAGES.map((s, i) => (
        <span key={s} style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ fontFamily: MONO, fontSize: 40, fontWeight: 700, border: '3px solid #e07b1a', borderRadius: 14, padding: '12px 24px', color: '#b8650f' }}>{s}</span>
          {i < PIPE_STAGES.length - 1 && <span style={{ fontSize: 40, color: '#e07b1a' }}>→</span>}
        </span>
      ))}
    </div>
    <div style={{ fontSize: 48, lineHeight: 1.5, marginTop: 56 }}>
      每一關結束 → 派 AI 分身扮「攻擊者」找碴 → 把問題折回去修 → 才放行下一關。
    </div>
    <div style={{ fontSize: 40, color: '#555', marginTop: 24 }}>這就是「對抗式自我審查」：出題的人，先請 AI 來打自己出的題。</div>
  </Default>
);

const P1Personas: Page = () => (
  <Default theme={T} title="AI 分身扮各種『壞玩家』找碴">
    <div style={{ marginTop: 12 }}>
      <Bullet>scoundrel：專找作弊捷徑——flag 有沒有明文洩漏？能不能跳步？</Bullet>
      <Bullet>lazy-developer／tool-grep-solver：只會 <span style={{ fontFamily: MONO }}>strings | grep</span>、只想一鍵解</Bullet>
      <Bullet>brute-forcer：能不能暴力硬解？</Bullet>
      <Bullet>confused-player：新手看得懂題目嗎？描述會不會反而洩題？</Bullet>
      <Bullet>decompiler-trust：反編譯後，看到不該看的東西嗎？</Bullet>
    </div>
  </Default>
);

const P1Verify: Page = () => (
  <Default theme={T} title="出完題，怎麼確認它可解？">
    <div style={{ marginTop: 12 }}>
      <Bullet>每題一支 <span style={{ fontFamily: MONO }}>solve.py</span>，不寫死 flag——跑得過＝題目真的可解</Bullet>
      <Bullet>再派獨立 AI（ctf-solver）盲測：只給玩家素材、不准看答案</Bullet>
      <Bullet>跨模型驗收：Claude Sonnet／Opus／Haiku 各跑一輪都要過</Bullet>
      <Bullet>真實插曲：原訂的 OpenAI Codex 被自家安全護欄擋下，改用 Haiku 補位</Bullet>
    </div>
  </Default>
);

const P1Meme2: Page = () => <MemeSlot theme={T} intent="AI 出的題，連 AI 自己都想作弊——哭笑不得 / 通靈" />;

const P1AIAmplify: Page = () => (
  <Statement theme={T} eyebrow="記住這句">
    AI 不是取代出題者，<br />是<span style={{ color: '#e07b1a' }}>放大</span>出題者。
  </Statement>
);

const P1Download: Page = () => (
  <Default theme={T} title="把出題技能帶回去">
    <div style={{ display: 'flex', gap: 40, marginTop: 20 }}>
      <DownloadCard name="webchall-master" desc="Web／OSINT／瀏覽器端 WASM 逆向。本場 SupplyTrace、Homerun、Solivan Verify 都用它。" href={WEBCHALL_ZIP} size="170 KB" />
      <DownloadCard name="bluechall-master" desc="Blue Team／數位鑑識／逆向。本場壓軸 Eternal Relay 用它。" href={BLUECHALL_ZIP} size="232 KB" />
    </div>
    <div style={{ fontSize: 38, color: '#555', marginTop: 40, textAlign: 'center' }}>線上版簡報可直接點下載；解壓後放進 AI agent 的 skills 目錄就能用。</div>
  </Default>
);

const PART1: Page[] = [
  P1Section, P1WhatIsCTF, P1Categories, P1Lifecycle, P1Lenses, P1Meme1,
  P1AIIntro, P1AINouns, P1Pipeline, P1Personas, P1Verify, P1Meme2, P1AIAmplify, P1Download,
];

// ════════════════════ Part 2a ① OSINT — SupplyTrace（暖場）════════════════════
const P2aSection: Page = () => <Section theme={T} title="① OSINT" subtitle="SupplyTrace · 暖場" />;

const P2aScenario: Page = () => (
  <Default theme={T} title="情境：SupplyTrace">
    <div style={{ marginTop: 8 }}>
      <Bullet>一個推動 SDG 12（責任消費與生產）的開放資料站</Bullet>
      <Bullet>社群流傳一張截圖：有人「對接了非公開節點」</Bullet>
      <Bullet>你是調查者——從公開素材，循「對接夥伴的閱讀路徑」追進去</Bullet>
    </div>
  </Default>
);

const P2aEssence: Page = () => (
  <Statement theme={T} eyebrow="這題在考什麼">
    沒有漏洞可打，<br />只有線索要<span style={{ color: '#e07b1a' }}>「串」</span>。
  </Statement>
);

const P2aObjectives: Page = () => (
  <Default theme={T} title="考點">
    <div style={{ marginTop: 8 }}>
      <Bullet>沒有傳統程式漏洞（無 SQLi／SSRF／SSTI）</Bullet>
      <Bullet>pivoting（線索接力）：把分散各處的線索接起來</Bullet>
      <Bullet>cross-source correlation：網站 × git 歷史 × 第三方 SaaS</Bullet>
      <Bullet>辨識「複製貼上殘留」型憑證洩漏</Bullet>
    </div>
  </Default>
);

const P2aWarmup: Page = () => (
  <Default theme={T} title="為什麼用它暖場">
    <div style={{ marginTop: 8 }}>
      <Bullet>門檻低、不用寫 code——瀏覽器 ＋ <span style={{ fontFamily: MONO }}>curl</span> ＋ <span style={{ fontFamily: MONO }}>git</span> 就能走完</Bullet>
      <Bullet>貼近生活：可以延伸談數位足跡與隱私</Bullet>
      <Bullet>每一步都有「啊哈」時刻，失敗點明確、好除錯</Bullet>
    </div>
  </Default>
);

// ── writeup（11 步，低密度、絕不跳步）──
const P2aS1: Page = () => (
  <StepPage theme={T} badge="步驟 1 / 共 11" beat="動作" title="訪首頁，讀「給夥伴」的暗示">
    <Mono>{`http://localhost:8088/`}</Mono>
    <div style={{ marginTop: 28 }}>
      <Bullet>首頁 §Partners 寫著「給對接夥伴」「內部文件庫」「AI 輔助文書流程」</Bullet>
      <Bullet sub>← 在暗示：有非公開入口、有內部慣例可循</Bullet>
    </div>
  </StepPage>
);
const P2aS2: Page = () => (
  <StepPage theme={T} badge="步驟 2 / 共 11" beat="觀察 → 線索" title="直接敲 /.git/（注意尾斜線）">
    <Mono>{`$ curl -s http://localhost:8088/.git/HEAD\nref: refs/heads/main`}</Mono>
    <div style={{ marginTop: 28 }}>
      <Bullet>nginx 沒擋 /.git/，目錄列表（autoindex）把整個版控攤出來</Bullet>
      <Bullet sub>一個請求就確認漏洞 → 下一步：整包 clone 回來</Bullet>
    </div>
  </StepPage>
);
const P2aMemeAha: Page = () => <MemeSlot theme={T} intent="恍然大悟：原來整包 .git 都被當靜態檔 serve 出來了" />;

const P2aS3a: Page = () => (
  <StepPage theme={T} badge="步驟 3 / 共 11" beat="動作" title="git clone 整包歷史">
    <Mono>{`$ git clone http://localhost:8088/.git supplytrace`}</Mono>
    <div style={{ marginTop: 28 }}>
      <Bullet><span style={{ fontFamily: MONO }}>.git/HEAD</span> 回 200 → dumb-HTTP 相容，clone 直接成立</Bullet>
    </div>
  </StepPage>
);
const P2aS3b: Page = () => (
  <StepPage theme={T} badge="步驟 3 / 共 11" beat="原理" title="為什麼整個 repo 能被拉回？">
    <div style={{ marginTop: 8 }}>
      <Bullet>.git 目錄被當成「靜態檔」對外 serve，沒有任何存取控制</Bullet>
      <Bullet>版控歷史＝所有改過的檔案 ＋ 訊息，全都在裡面</Bullet>
      <Bullet sub>教學點：別把 .git 推到公開的網站根目錄</Bullet>
    </div>
  </StepPage>
);
const P2aS4: Page = () => (
  <StepPage theme={T} badge="步驟 4 / 共 11" beat="動作 → 觀察" title="看有哪些 branch">
    <Mono>{`$ git branch -a\n* main\n  remotes/origin/internal/api-handover`}</Mono>
    <div style={{ marginTop: 28 }}>
      <Bullet>main 是乾淨的；<span style={{ fontFamily: MONO }}>internal/api-handover</span> 才藏東西</Bullet>
    </div>
  </StepPage>
);
const P2aS5: Page = () => (
  <StepPage theme={T} badge="步驟 5 / 共 11" beat="動作" title="先讀 main 的 CONTRIBUTING.md">
    <Mono>{`$ git checkout main`}</Mono>
    <div style={{ marginTop: 28 }}>
      <Bullet>CONTRIBUTING.md 提到「交接事項在 handover branch」</Bullet>
      <Bullet sub>連這種小步也交代——這就是「不跳步」的 writeup</Bullet>
    </div>
  </StepPage>
);
const P2aS6: Page = () => (
  <StepPage theme={T} badge="步驟 6 / 共 11" beat="動作 → 線索" title="切到 internal branch，檔案變多了">
    <Mono>{`$ git checkout internal/api-handover`}</Mono>
    <div style={{ marginTop: 28 }}>
      <Bullet>多出 <span style={{ fontFamily: MONO }}>CLAUDE.md</span>、<span style={{ fontFamily: MONO }}>SKILL.md</span>、<span style={{ fontFamily: MONO }}>RUNBOOK.md</span></Bullet>
      <Bullet sub>「給 AI 與內部人看」的文件 → 下一步：讀 CLAUDE.md</Bullet>
    </div>
  </StepPage>
);
const P2aS7a: Page = () => (
  <StepPage theme={T} badge="步驟 7 / 共 11" beat="動作" title="從 CLAUDE.md 撈出 Postman 連結">
    <div style={{ marginBottom: 24 }}>
      <Bullet>CLAUDE.md 裡寫著一個 Postman 公開 workspace 的 URL</Bullet>
    </div>
    <ShotSlot hint="CLAUDE.md 內文：含一行 Postman workspace URL（玩家視角）" h={360} />
  </StepPage>
);
const P2aS7b: Page = () => (
  <StepPage theme={T} badge="步驟 7 / 共 11" beat="原理" title="教育意義最濃的一段">
    <div style={{ marginTop: 8 }}>
      <Bullet>CLAUDE.md 還有一段「為什麼我們把 token 留在範例裡」的辯護</Bullet>
      <Bullet>AI 時代的新資安面：把憑證寫進「給 AI 讀的規格檔」</Bullet>
      <Bullet sub>可以問學生：你的 repo 有沒有夾帶 .env、截圖有沒有露 token？</Bullet>
    </div>
  </StepPage>
);
const P2aS8: Page = () => (
  <StepPage theme={T} badge="步驟 8 / 共 11" beat="動作 → 觀察" title="打開 Postman 公開 workspace">
    <div style={{ marginTop: 8 }}>
      <Bullet>免登入就能看 → 裡面有 production 與 internal-development 兩個 collection</Bullet>
      <Bullet sub>我們要的東西在 internal-development</Bullet>
    </div>
  </StepPage>
);
const P2aS9: Page = () => (
  <StepPage theme={T} badge="步驟 9 / 共 11" beat="動作" title="找 'Redeem (treasury)' 範例請求">
    <div style={{ marginTop: 8 }}>
      <Bullet>internal-development collection 裡有一個 Redeem 範例請求</Bullet>
      <Bullet sub>這就是後台兌換端點的「使用範例」</Bullet>
    </div>
  </StepPage>
);
const P2aS10a: Page = () => (
  <StepPage theme={T} badge="步驟 10 / 共 11" beat="觀察" title="token 不在你以為的地方">
    <div style={{ marginBottom: 24 }}>
      <Bullet>Headers 分頁看起來空空的——Postman 把明文 Bearer 自動加密 vault 了</Bullet>
    </div>
    <Mono>{`Authorization: Bearer ••••••`}</Mono>
  </StepPage>
);
const P2aS10b: Page = () => (
  <StepPage theme={T} badge="步驟 10 / 共 11" beat="線索" title="token 藏在「說明文字」裡">
    <div style={{ marginBottom: 24 }}>
      <Bullet>範例請求的 description 有一段 cURL snippet → 32-hex 的 Bearer token</Bullet>
      <Bullet>nonce 藏在 url.raw（網址）裡</Bullet>
    </div>
    <Mono>{`Authorization: Bearer <32-hex token>\nPOST /internal/admin/<nonce>/redeem`}</Mono>
  </StepPage>
);
const P2aMemeEvil: Page = () => <MemeSlot theme={T} intent="作者太壞了／這是通靈：token 不在 header，藏在『說明文字』裡" />;

const P2aS10c: Page = () => (
  <StepPage theme={T} badge="步驟 10 / 共 11" beat="原理" title="為什麼會這樣漏？">
    <div style={{ marginTop: 8 }}>
      <Bullet>「複製貼上殘留」型洩漏——示範請求裡寫死了真 token，忘了改掉</Bullet>
      <Bullet sub>flag 的文字直接點題：<span style={{ fontFamily: MONO }}>pasted postman token</span></Bullet>
    </div>
  </StepPage>
);
const P2aS11a: Page = () => (
  <StepPage theme={T} badge="步驟 11 / 共 11" beat="動作" title="帶著 token ＋ nonce 打後台">
    <Mono size={34}>{`$ curl -X POST \\\n    http://localhost:8088/internal/admin/<nonce>/redeem \\\n    -H "Authorization: Bearer <32-hex token>"`}</Mono>
    <div style={{ marginTop: 28 }}>
      <Bullet sub>把撿到的 nonce 填進網址、token 填進 Authorization</Bullet>
    </div>
  </StepPage>
);
const P2aS11b: Page = () => (
  <StepPage theme={T} badge="步驟 11 / 共 11" beat="觀察 → 收網" title="後端怎麼驗？對了才給 flag">
    <div style={{ marginTop: 8 }}>
      <Bullet>nonce 用 <span style={{ fontFamily: MONO }}>hmac.compare_digest</span> 比對，錯 → 404</Bullet>
      <Bullet>token 須 32-hex → sha256 → 比對，錯 → 401</Bullet>
      <Bullet sub>兩關都過 → 回傳 flag（玩家視角，此處不投影）</Bullet>
    </div>
  </StepPage>
);

// ── 帶學生 + 出題幕後 ──
const P2aTeach: Page = () => (
  <Default theme={T} title="怎麼帶學生走這題">
    <div style={{ marginTop: 8 }}>
      <Bullet>全班一起看首頁找線索 → 引導發現 /.git/</Bullet>
      <Bullet>一起 <span style={{ fontFamily: MONO }}>git clone</span> ＋ <span style={{ fontFamily: MONO }}>git branch -a</span></Bullet>
      <Bullet>分組讀 CLAUDE.md 找 URL → 開 Postman 撿 token → 一個 curl 拿 flag</Bullet>
    </div>
  </Default>
);
const P2aPunch: Page = () => (
  <Statement theme={T} eyebrow="這題的金句">
    真實的資料外洩，<br />常常不是高超駭客技術，<br />而是<span style={{ color: '#e07b1a' }}>「複製貼上忘了改回去」</span>。
  </Statement>
);
const P2aBehind1: Page = () => (
  <Default theme={T} title="出題幕後：可控的擬真網路">
    <div style={{ marginTop: 8 }}>
      <Bullet>OSINT 天生依賴外部資源（這題靠 Postman 公開 workspace）</Bullet>
      <Bullet>但自動驗題不能每次真的去建一個 Postman workspace</Bullet>
      <Bullet>解法：本機假 Postman（mock），與真實路徑共用同一份 template、同一組 token</Bullet>
      <Bullet sub>→「驗過的鏈 ＝ 玩家會走的鏈」，且離線、可重現</Bullet>
    </div>
  </Default>
);
const P2aBehind2: Page = () => (
  <Default theme={T} title="出題幕後：不能洩題">
    <div style={{ marginTop: 8 }}>
      <Bullet>題目描述用 grep 強制檢查（reverse blacklist）</Bullet>
      <Bullet>禁止出現 <span style={{ fontFamily: MONO }}>.git／postman／OSINT／token／leak／bearer</span> 等字眼</Bullet>
      <Bullet sub>出題的藝術：給夠線索，但不能破梗</Bullet>
    </div>
  </Default>
);

const PART2A: Page[] = [
  P2aSection, P2aScenario, P2aEssence, P2aObjectives, P2aWarmup,
  P2aS1, P2aS2, P2aMemeAha, P2aS3a, P2aS3b, P2aS4, P2aS5, P2aS6,
  P2aS7a, P2aS7b, P2aS8, P2aS9, P2aS10a, P2aS10b, P2aMemeEvil, P2aS10c, P2aS11a, P2aS11b,
  P2aTeach, P2aPunch, P2aBehind1, P2aBehind2,
];

// ════════════════════ Part 2b ② Web — Homerun（主動攻擊）════════════════════
const P2bSection: Page = () => <Section theme={T} title="② Web" subtitle="Homerun · 主動攻擊" />;

const P2bScenario: Page = () => (
  <Default theme={T} title="情境：Homerun">
    <div style={{ marginTop: 8 }}>
      <Bullet>一個「買一雙送一雙」的公益送鞋活動站</Bullet>
      <Bullet>站方深信：「沒有公開連結，就等於沒人找得到」</Bullet>
      <Bullet sub>← 這個假設，正是整題的破口</Bullet>
    </div>
  </Default>
);

const P2bEssence: Page = () => (
  <Statement theme={T} eyebrow="這題在打什麼">
    以為藏起來，<br />就<span style={{ color: '#e07b1a' }}>安全</span>了。
  </Statement>
);

const P2bChain: Page = () => (
  <Default theme={T} title="一條三段式攻擊鏈">
    <div style={{ marginTop: 8 }}>
      <Bullet>① OpenAPI schema 洩漏（資訊洩漏 · CWE-200）</Bullet>
      <Bullet>② 自助提權（授權失效 · CWE-862 · OWASP Top 10 #1）</Bullet>
      <Bullet>③ nginx alias off-by-slash 路徑遍歷</Bullet>
      <Bullet sub>三段都是「設定／授權」錯誤——不用記艱深 payload，口頭就能講清為什麼中招</Bullet>
    </div>
  </Default>
);

// ── writeup（9 步）──
const P2bS1: Page = () => (
  <StepPage theme={T} badge="步驟 1 / 共 9" beat="動作" title="開首頁，聽公益送鞋的故事">
    <Mono>{`http://localhost:8082/`}</Mono>
    <div style={{ marginTop: 28 }}>
      <Bullet>先把「正常使用者看到的網站」走過一遍</Bullet>
      <Bullet sub>偵察永遠是第一步——先知道有哪些功能、哪些頁面</Bullet>
    </div>
  </StepPage>
);
const P2bS2: Page = () => (
  <StepPage theme={T} badge="步驟 2 / 共 9" beat="動作 → 原理" title="註冊、登入一個一般會員">
    <div style={{ marginTop: 8 }}>
      <Bullet>註冊與登入要先 GET 表單頁拿 CSRF token，再帶 token POST</Bullet>
      <Bullet sub>連「先拿 CSRF token」這種小步也要交代——不跳步</Bullet>
      <Bullet sub>目的：先有一個「低權限身分」，等下從這裡往上爬</Bullet>
    </div>
  </StepPage>
);
const P2bS3: Page = () => (
  <StepPage theme={T} badge="步驟 3 / 共 9" beat="觀察" title="以會員身分留言，確認自己很弱">
    <div style={{ marginTop: 8 }}>
      <Bullet>用 member 身分留言成功 → 確認目前是「一般會員」權限</Bullet>
      <Bullet sub>先確立「我現在能做什麼、不能做什麼」，提權才有對照</Bullet>
    </div>
  </StepPage>
);
const P2bS4a: Page = () => (
  <StepPage theme={T} badge="步驟 4 / 共 9" beat="動作" title="啊哈點 ①：要一份 API 地圖">
    <Mono>{`$ curl -s http://localhost:8082/api/openapi.json`}</Mono>
    <div style={{ marginTop: 28 }}>
      <Bullet>整份 API schema（所有端點）一次攤在眼前</Bullet>
    </div>
  </StepPage>
);
const P2bS4b: Page = () => (
  <StepPage theme={T} badge="步驟 4 / 共 9" beat="原理" title="為什麼這份地圖會外洩？">
    <div style={{ marginTop: 8 }}>
      <Bullet>FastAPI／Swagger 預設就會開 <span style={{ fontFamily: MONO }}>/openapi.json</span> 與 docs</Bullet>
      <Bullet>沒人連到 ≠ 不存在——它一直在那裡（CWE-200 資訊洩漏）</Bullet>
      <Bullet sub>真實世界超高頻：上線忘了關 API 文件</Bullet>
    </div>
  </StepPage>
);
const P2bS4c: Page = () => (
  <StepPage theme={T} badge="步驟 4 / 共 9" beat="觀察 → 線索" title="地圖上有一個不該給你的端點">
    <Mono>{`POST /api/admin/promote/{user_id}`}</Mono>
    <div style={{ marginTop: 28 }}>
      <Bullet>schema 裡有個「把使用者升成 admin」的端點</Bullet>
      <Bullet sub>下一步：試試看一般會員能不能直接呼叫它</Bullet>
    </div>
  </StepPage>
);
const P2bMemeMap: Page = () => <MemeSlot theme={T} intent="恍然大悟：整張 API 地圖（含後台端點）被一次攤開" />;

const P2bS5a: Page = () => (
  <StepPage theme={T} badge="步驟 5 / 共 9" beat="動作" title="自助提權：把自己升成 admin">
    <Mono size={34}>{`$ curl -X POST \\\n    http://localhost:8082/api/admin/promote/<my_id> \\\n    -H "Cookie: session=<member session>"`}</Mono>
  </StepPage>
);
const P2bS5b: Page = () => (
  <StepPage theme={T} badge="步驟 5 / 共 9" beat="原理" title="為什麼一般會員打得動後台？">
    <div style={{ marginTop: 8 }}>
      <Bullet>這個端點漏掉了 <span style={{ fontFamily: MONO }}>require_admin</span> 的權限檢查</Bullet>
      <Bullet>於是任何登入的會員，都能呼叫它把自己升成 admin</Bullet>
      <Bullet sub>授權失效（CWE-862）——OWASP Top 10 2021 排名第一</Bullet>
    </div>
  </StepPage>
);
const P2bS5c: Page = () => (
  <StepPage theme={T} badge="步驟 5 / 共 9" beat="觀察" title="最強的「啊哈」瞬間">
    <Mono>{`{ "id": <my_id>, "role": "admin" }`}</Mono>
    <div style={{ marginTop: 28 }}>
      <Bullet><span style={{ fontFamily: MONO }}>role</span> 從 member 變成 admin——一個請求就完成</Bullet>
    </div>
  </StepPage>
);
const P2bMemeAdmin: Page = () => <MemeSlot theme={T} intent="作弊爽感：一個 curl，member 秒變 admin" />;

const P2bS6: Page = () => (
  <StepPage theme={T} badge="步驟 6 / 共 9" beat="觀察" title="驗證提權真的有用">
    <div style={{ marginTop: 8 }}>
      <Bullet>升權前：<span style={{ fontFamily: MONO }}>/sales</span> 對非 admin 是擋的（403）</Bullet>
      <Bullet>升權後：同一個 <span style={{ fontFamily: MONO }}>/sales</span> 通了</Bullet>
      <Bullet sub>確認手上的 admin 是「真的能用」的，再往下走</Bullet>
    </div>
  </StepPage>
);
const P2bS7a: Page = () => (
  <StepPage theme={T} badge="步驟 7 / 共 9" beat="動作" title="啊哈點 ②：在網址上動手腳">
    <Mono>{`GET /sales../meetings/2026-Q1-africa-expansion.md`}</Mono>

    <div style={{ marginTop: 28 }}>
      <Bullet>用 <span style={{ fontFamily: MONO }}>/sales..</span> 跳出原本的目錄，讀到內部會議檔</Bullet>
      <Bullet sub>這一步只是「示範遍歷原語」——還沒拿到 flag</Bullet>
    </div>
  </StepPage>
);
const P2bS7b: Page = () => (
  <StepPage theme={T} badge="步驟 7 / 共 9" beat="原理" title="一個尾斜線的差別">
    <Mono size={32}>{`location /sales            ← 無尾斜線\nalias    /srv/internal/sales/   ← 有尾斜線\n\n/sales../flag.txt\n  → /srv/internal/sales/../flag.txt\n  → /srv/internal/flag.txt   ✗ 跳出去了`}</Mono>
    <div style={{ marginTop: 22 }}>
      <Bullet sub>nginx 著名設定陷阱：location 與 alias 尾斜線錯位 → 路徑遍歷</Bullet>
    </div>
  </StepPage>
);
const P2bS8: Page = () => (
  <StepPage theme={T} badge="步驟 8 / 共 9" beat="觀察 → 線索" title="遍歷落地頁，把內部目錄看光">
    <div style={{ marginTop: 8 }}>
      <Bullet>遍歷到內部目錄根，落地頁列出裡面所有檔案</Bullet>
      <Bullet>清單裡指出 <span style={{ fontFamily: MONO }}>flag.txt</span> 的位置</Bullet>
      <Bullet sub>注意：flag 在獨立的 flag.txt——會議檔只是「示範遍歷」的中繼，不是終點</Bullet>
    </div>
  </StepPage>
);
const P2bS9: Page = () => (
  <StepPage theme={T} badge="步驟 9 / 共 9" beat="動作 → 收網" title="讀出那一格 flag.txt">
    <Mono>{`GET /sales../flag.txt`}</Mono>
    <div style={{ marginTop: 28 }}>
      <Bullet>同一招遍歷，這次直接讀內部目錄根下的 flag.txt</Bullet>
      <Bullet sub>flag 字面 b0g0＝Buy One Get One，呼應送鞋故事（玩家視角，不投影明文）</Bullet>
    </div>
  </StepPage>
);

// ── 帶學生 + 出題幕後 ──
const P2bTeach: Page = () => (
  <Default theme={T} title="怎麼帶學生走這題">
    <div style={{ marginTop: 8 }}>
      <Bullet>開站講送鞋故事 → 點出兩個錯誤的安全假設</Bullet>
      <Bullet>打開 openapi.json，讓學生看「地圖被攤開」</Bullet>
      <Bullet>當場 curl promote → <span style={{ fontFamily: MONO }}>role: admin</span> 出現的瞬間最有戲</Bullet>
      <Bullet>示範遍歷讀 flag → 最後跑 solve.py 看「出題者怎麼自動驗題」</Bullet>
    </div>
  </Default>
);
const P2bPunch: Page = () => (
  <Statement theme={T} eyebrow="這題的金句">
    藏起來，<br /><span style={{ color: '#e07b1a' }}>不等於</span>安全。
  </Statement>
);
const P2bBehind: Page = () => (
  <Default theme={T} title="出題幕後：最具體的 audit 紀錄">
    <div style={{ marginTop: 8 }}>
      <Bullet>八階段 stages ledger，每階段都留 audit_verdict 與具體 notes</Bullet>
      <Bullet>4 個 persona 平行對抗審查：Scoundrel／Lazy Developer／Confused Developer／Confused Player</Bullet>
      <Bullet sub>其中一階段「採納了 6 個 Critical 修正」——出題不是一次到位，是反覆找碴</Bullet>
    </div>
  </Default>
);
const P2bDemoRisk: Page = () => (
  <Default theme={T} title="現場 demo 的小提醒">
    <div style={{ marginTop: 8 }}>
      <Bullet>register／login 各有獨立的 <span style={{ fontFamily: MONO }}>5 次 / 5 分鐘</span> 限流桶</Bullet>
      <Bullet>連跑幾次 solve.py 會撞 429</Bullet>
      <Bullet sub>對策：demo 前 <span style={{ fontFamily: MONO }}>docker compose restart api</span> 清乾淨</Bullet>
    </div>
  </Default>
);

const PART2B: Page[] = [
  P2bSection, P2bScenario, P2bEssence, P2bChain,
  P2bS1, P2bS2, P2bS3, P2bS4a, P2bS4b, P2bS4c, P2bMemeMap,
  P2bS5a, P2bS5b, P2bS5c, P2bMemeAdmin, P2bS6, P2bS7a, P2bS7b, P2bS8, P2bS9,
  P2bTeach, P2bPunch, P2bBehind, P2bDemoRisk,
];

// ════════════════ Part 2c ③ REV／WASM — Solivan Verify（高潮）════════════════
const P2cSection: Page = () => <Section theme={T} title="③ REV／WASM" subtitle="Solivan Verify · 高潮" />;

const P2cScenario: Page = () => (
  <Default theme={T} title="情境：Solivan Verify">
    <div style={{ marginTop: 8 }}>
      <Bullet>一張 SDG 主題的 2D 像素 RPG 地圖，要跑三項永續驗證</Bullet>
      <Bullet>系統「全程靜默」：做對做錯都不回應</Bullet>
      <Bullet>地圖上有塊金色「封閉現場」，看得到、走得近，<span style={{ color: '#e07b1a' }}>就是走不進去</span></Bullet>
    </div>
  </Default>
);

const P2cEssence: Page = () => (
  <Statement theme={T} eyebrow="這題在玩什麼">
    走不進去的牆，<br />用記憶體把它<span style={{ color: '#e07b1a' }}>「推開」</span>。
  </Statement>
);

const P2cWasm: Page = () => (
  <Default theme={T} title="WASM 為什麼有趣">
    <div style={{ marginTop: 8 }}>
      <Bullet>WebAssembly＝編譯後的二進位，<span style={{ fontFamily: MONO }}>strings／wasm2wat</span> 只看到框架痕跡</Bullet>
      <Bullet>但它活在瀏覽器裡——記憶體完全攤在 DevTools 面前</Bullet>
      <Bullet sub>「難靜態反編譯、易動態分析」的最佳教材</Bullet>
    </div>
  </Default>
);

const P2cMethod: Page = () => (
  <Default theme={T} title="這題在考什麼">
    <div style={{ marginTop: 8 }}>
      <Bullet>client-side trust 的反例：封閉區只靠「前端碰撞檢查」把關（CWE-693）</Bullet>
      <Bullet>位置加密用 WASM 內的 RSA-OAEP（不是瀏覽器 crypto.subtle）→ 逼你真的去碰 WASM</Bullet>
      <Bullet sub>核心方法論：靜態分析撈不到 → 改用動態分析</Bullet>
    </div>
  </Default>
);

// ── writeup（9 步，console script demo 路徑）──
const P2cS1: Page = () => (
  <StepPage theme={T} badge="步驟 1 / 共 9" beat="動作" title="先把三項 SDG 驗證答對">
    <div style={{ marginTop: 8 }}>
      <Bullet>地圖上跑 SDG 6／7／13 三題問答，答對 3 題</Bullet>
      <Bullet sub>題庫共 150 題、5 張隨機地圖——反 speedrun，不能事先背答案</Bullet>
    </div>
  </StepPage>
);
const P2cS2: Page = () => (
  <StepPage theme={T} badge="步驟 2 / 共 9" beat="觀察" title="最後一關：走不進那塊金色的地">
    <div style={{ marginTop: 8 }}>
      <Bullet>最後一筆簽核非得在封閉區內完成</Bullet>
      <Bullet>但方向鍵怎麼走，都停在牆外一格</Bullet>
      <Bullet sub>通行證一核發只有 120 秒——時間壓力</Bullet>
    </div>
  </StepPage>
);
const P2cMemeFrustrate: Page = () => <MemeSlot theme={T} intent="覺得自己太笨／作者太壞：方向鍵怎麼按都進不去" />;

const P2cS3: Page = () => (
  <StepPage theme={T} badge="步驟 3 / 共 9" beat="原理" title="為什麼走不進去？">
    <div style={{ marginTop: 8 }}>
      <Bullet>封閉區是 1×1 單格，碰撞檢查刻意寫成 off-by-one（邊界差一格）</Bullet>
      <Bullet>於是你永遠卡在牆外一格——一道「幽靈牆」(phantom wall)</Bullet>
      <Bullet sub>這不是 bug，是出題者埋的刻意線索</Bullet>
    </div>
  </StepPage>
);
const P2cS4: Page = () => (
  <StepPage theme={T} badge="步驟 4 / 共 9" beat="觀察" title="靜態分析：什麼都撈不到">
    <Mono>{`$ strings wasm_game_bg.wasm | grep -i flag\n(無)`}</Mono>
    <div style={{ marginTop: 28 }}>
      <Bullet>strings／wasm2wat 只看到 Rust crate 路徑，沒有答案</Bullet>
      <Bullet sub>製造懸念：那答案到底在哪？→ 換動態分析</Bullet>
    </div>
  </StepPage>
);
const P2cMemeStatic: Page = () => <MemeSlot theme={T} intent="通靈：strings | grep flag 什麼都沒有，這是要我通靈嗎" />;

const P2cS5: Page = () => (
  <StepPage theme={T} badge="步驟 5 / 共 9" beat="動作" title="F12 開 console，把 WASM 攤開">
    <Mono size={34}>{`> Object.keys(window.__GAME_WASM__)   // 列出 WASM exports\n> window.__GAME_MEMORY__               // WebAssembly.Memory（記憶體攤開）`}</Mono>
    <div style={{ marginTop: 24 }}>
      <Bullet sub>前端開場就把 WASM 與記憶體掛到 window，不用裝任何擴充</Bullet>
    </div>
  </StepPage>
);
const P2cS6: Page = () => (
  <StepPage theme={T} badge="步驟 6 / 共 9" beat="觀察" title="它一直在偷偷印自己的座標">
    <Mono>{`[pos] x=12 y=34      // 每個 frame 印出當前座標`}</Mono>
    <div style={{ marginTop: 28 }}>
      <Bullet>console 持續印當前 (x, y) → 我們知道「現在的值」是多少</Bullet>
      <Bullet sub>有了已知值，就能在記憶體裡反查它的位址</Bullet>
    </div>
  </StepPage>
);
const P2cS7: Page = () => (
  <StepPage theme={T} badge="步驟 7 / 共 9" beat="動作 → 原理" title="掃描記憶體，收斂到座標的位址">
    <Mono size={34}>{`> const mem = new Int32Array(window.__GAME_MEMORY__.buffer)\n> // 掃 mem 找出值 = 當前 x 的位址；走一格再掃；交集收斂`}</Mono>
    <div style={{ marginTop: 24 }}>
      <Bullet sub>3–4 次掃描就能定位 player_x／player_y 的 offset——這就是 Cheat Engine 的精神</Bullet>
    </div>
  </StepPage>
);
const P2cS8: Page = () => (
  <StepPage theme={T} badge="步驟 8 / 共 9" beat="動作 → 高潮" title="改一個數字，角色瞬移進去">
    <Mono size={34}>{`> mem[player_x_offset] = <封閉區 x>\n> mem[player_y_offset] = <封閉區 y>`}</Mono>
    <div style={{ marginTop: 24 }}>
      <Bullet>角色當場瞬移進封閉區 → HUD 變「通行證已核發」</Bullet>
      <Bullet sub>WASM 自動把（加密的）座標送給後端 → server 唯一一次簽 JWT，寫進 <span style={{ fontFamily: MONO }}>window.__GAME_PASS__</span></Bullet>
    </div>
  </StepPage>
);
const P2cMemeTeleport: Page = () => <MemeSlot theme={T} intent="恍然大悟＋爽：改一個數字，角色直接瞬移進金色封閉區" />;

const P2cS9: Page = () => (
  <StepPage theme={T} badge="步驟 9 / 共 9" beat="動作 → 收網" title="按 E，換出 flag">
    <div style={{ marginTop: 8 }}>
      <Bullet>在封閉區按 E → 前端 flag-terminal.js 算出 proof（sha256）</Bullet>
      <Bullet>帶著 JWT ＋ proof 打 <span style={{ fontFamily: MONO }}>POST /api/flag</span> → console 印出 flag</Bullet>
      <Bullet sub>JWT 只活 120 秒、alg=none 會被拒——雙重把關（玩家視角，不投影明文）</Bullet>
    </div>
  </StepPage>
);

const P2cPunch: Page = () => (
  <Statement theme={T} eyebrow="這題的金句">
    跑在使用者瀏覽器裡的驗證，<br />永遠<span style={{ color: '#e07b1a' }}>不能信任</span>。
  </Statement>
);
const P2cTeach: Page = () => (
  <Default theme={T} title="怎麼帶學生走這題">
    <div style={{ marginTop: 8 }}>
      <Bullet>視覺化、遊戲化：不是枯燥的 ELF，是會動的 SDG 像素 RPG</Bullet>
      <Bullet>即時爽感：改一個數字角色就瞬移——把 Cheat Engine 搬到瀏覽器</Bullet>
      <Bullet>連結日常：為什麼線上遊戲會被外掛？因為前端不能信任</Bullet>
      <Bullet sub>（正規工具是 Cetus 擴充；現場我們用 console script，免裝、節奏更穩）</Bullet>
    </div>
  </Default>
);
const P2cBehind: Page = () => (
  <Default theme={T} title="出題幕後：最有說服力的故事">
    <div style={{ marginTop: 8 }}>
      <Bullet>扮 brute-forcer 的 AI 找到致命缺陷：答案曾被放進玩家可讀的 JSON → 可秒解（F-8）</Bullet>
      <Bullet>第一次修補（答案搬進 WASM 表）→ 扮 tool-grep-solver 的 AI 用一條 regex 就還原 → 判定無效</Bullet>
      <Bullet sub>最終逼出整個架構重構（改成 RSA-OAEP ＋ server 端題庫）——AI 出題是對抗式迭代，不是一次生成</Bullet>
    </div>
  </Default>
);
const P2cDemoRisk: Page = () => (
  <Default theme={T} title="現場 demo 的小提醒">
    <div style={{ marginTop: 8 }}>
      <Bullet>JWT 只活 120 秒——先把 offset 找好、或一鍵 script 到位</Bullet>
      <Bullet>舊頁面快取會卡 → 用無痕新分頁</Bullet>
      <Bullet sub>保底：跑 blackbox 的 exploit.py 直接送密文，0.2 秒秒出 flag（少了爽感但保證可動）</Bullet>
    </div>
  </Default>
);

const PART2C: Page[] = [
  P2cSection, P2cScenario, P2cEssence, P2cWasm, P2cMethod,
  P2cS1, P2cS2, P2cMemeFrustrate, P2cS3, P2cS4, P2cMemeStatic,
  P2cS5, P2cS6, P2cS7, P2cS8, P2cMemeTeleport, P2cS9,
  P2cPunch, P2cTeach, P2cBehind, P2cDemoRisk,
];

// ── 匯出 ──────────────────────────────────────────────────────────────────────────
export default [P0Cover, P0Roadmap, P0Thesis, P0Meme, ...PART1, ...PART2A, ...PART2B, ...PART2C] satisfies Page[];

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
