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

// ── 匯出 ──────────────────────────────────────────────────────────────────────────
export default [P0Cover, P0Roadmap, P0Thesis, P0Meme, ...PART1] satisfies Page[];

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
