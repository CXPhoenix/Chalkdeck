// 資安競賽實務 — ISIP.hs 離島區種子師資研習營 Day 2（2026/06/27）· 復興高中 陳晉
// 單一 index.tsx 連貫 deck。theme = fhsh-isiphs-universal（isip.hs / courseLevel 2 橘）。
// 內容藍本見 .spectra/subject/20260626_0628/（00–08 + HANDOFF）。
import type { CSSProperties, ReactNode } from 'react';
import type { DesignSystem, Page, SlideMeta, SlideTransition } from '@open-slide/core';
import { useSlidePageNumber } from '@open-slide/core';

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
    // 真正語意化列表（UL/OL/LI 元件用，靠左對齊、不仿樣式）
    `.osd-list{list-style:none;margin:0;padding:0;}` +
    `.osd-list>li{position:relative;padding-left:50px;font-size:54px;line-height:1.5;margin-bottom:20px;}` +
    `.osd-list>li::before{content:"\\2756";position:absolute;left:0;color:#e07b1a;}` +
    `.osd-list>li.sub{padding-left:50px;font-size:44px;}` +
    `.osd-list>li.sub::before{content:"\\27A2";color:#e07b1a;}` +
    `.osd-list.ord{list-style:decimal;padding-left:64px;}` +
    `.osd-list.ord>li{padding-left:10px;font-size:54px;line-height:1.5;margin-bottom:20px;}` +
    `.osd-list.ord>li::before{content:none;}` +
    `.osd-list.ord>li::marker{color:#e07b1a;font-weight:700;}` +
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

// 梗圖插槽：講者自填。圖檔放 assets/，命名 meme-<part>-<梗>.png；放好後在該頁 <MemeSlot/> 加 src 即可。
// 例：<MemeSlot theme={T} intent="…" src={new URL('./assets/meme-2a-aha-gitleak.png', import.meta.url).href} />
const MemeSlot = ({ theme, intent, src }: { theme: Theme; intent: string; src?: string }) => (
  <DeckPage theme={theme} showPageNumber={false}>
    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', zIndex: 2, padding: 70 }}>
      {src ? (
        <img src={src} alt={intent} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', borderRadius: 20 }} />
      ) : (
        <div style={{ width: 1180, height: 540, border: '8px dashed #e0c485', borderRadius: 28, background: '#fbf7ee', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 28 }}>
          <div style={{ fontSize: 140, lineHeight: 1 }}>🖼️</div>
          <div style={{ fontSize: 52, fontWeight: 700, color: '#b07d23' }}>MEME 插槽</div>
          <div style={{ fontSize: 40, color: '#6b5836', textAlign: 'center', maxWidth: 980, lineHeight: 1.5 }}>意圖：{intent}</div>
        </div>
      )}
    </div>
  </DeckPage>
);

// 截圖插槽：講者 demo 時補玩家視角截圖（勿露 src/solution/flag）。放好圖後加 src 即可。
// 例：<ShotSlot hint="…" src={new URL('./assets/shot-2a-claude-md.png', import.meta.url).href} />
const ShotSlot = ({ hint, h = 470, src }: { hint: string; h?: number; src?: string }) =>
  src ? (
    <img src={src} alt={hint} style={{ width: '100%', height: h, objectFit: 'contain', borderRadius: 16, background: '#f6f8fb', border: '2px solid #e3e8ef' }} />
  ) : (
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

// 語意化列表（真 ul/ol/li，不仿樣式）。LI sub=true → 次層（➢）。
const UL = ({ children, style }: { children: ReactNode; style?: CSSProperties }) => (
  <ul className="osd-list" style={style}>{children}</ul>
);
const OL = ({ children, style }: { children: ReactNode; style?: CSSProperties }) => (
  <ol className="osd-list ord" style={style}>{children}</ol>
);
const LI = ({ children, sub = false }: { children: ReactNode; sub?: boolean }) => (
  <li className={sub ? 'sub' : undefined}>{children}</li>
);

// Bullet＝LI 別名（語意化 li）；外層必須是 <UL>/<OL>。沿用既有 <Bullet> 呼叫點。
const Bullet = LI;

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
// HITCON CyberRange 2026 官方主視覺（KKTIX，已抓進 assets/；講者簡報前可換最新官方圖）
const CYBERRANGE_BANNER = new URL('./assets/cyberrange-2026.png', import.meta.url).href;

// ════════════════════════════ Part 0 開場（精簡）════════════════════════════
const P0Cover: Page = () => <Cover theme={T} title="資安競賽實務" subtitle="從解題，到防禦" />;
P0Cover.transition = SETTLE;

// 自我介紹（照片講者自填：把右側 placeholder 換成 <img src={new URL('./assets/speaker.png', import.meta.url).href} ...>）
const P0Intro: Page = () => (
  <DeckPage theme={T}>
    <div style={{ position: 'absolute', top: 100, left: 134, width: 1651, height: 125, textAlign: 'center', zIndex: 2 }}>
      <h1 style={{ fontSize: 105, fontWeight: 700, margin: 0, lineHeight: 1.1 }}>自我介紹</h1>
    </div>
    <div style={{ position: 'absolute', top: 280, left: 200, width: 1000, zIndex: 2 }}>
      <div style={{ fontSize: 92, fontWeight: 700, marginBottom: 48, letterSpacing: '0.15em' }}>陳　晉</div>
      <UL>
        <LI>北區資安教學資源師培中心副主任</LI>
        <LI>高中職資安推廣中心講師</LI>
        <LI>復興高中資訊科技代理教師</LI>
        <LI>國防管理學院資管系 CTF 教練</LI>
      </UL>
    </div>
    <div style={{ position: 'absolute', top: 250, right: 150, width: 540, height: 620, border: '6px dashed #cfd6e0', borderRadius: 20, background: '#f6f8fb', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 18, zIndex: 2 }}>
      <div style={{ fontSize: 96, lineHeight: 1 }}>🧑‍🏫</div>
      <div style={{ fontSize: 32, fontWeight: 700, color: '#6b7a90' }}>講者照片（待提供）</div>
    </div>
  </DeckPage>
);

const P0Outline: Page = () => (
  <Default theme={T} title="OUTLINE">
    <OL style={{ marginTop: 16 }}>
      <LI>CTF 是什麼、怎麼用 AI 出題</LI>
      <LI>四題實戰：OSINT → Web → REV → Blue Team</LI>
      <LI>藍隊靶場：HITCON CyberRange</LI>
      <LI>收束：學攻擊，是為了更會防禦</LI>
    </OL>
  </Default>
);

const P0Roadmap: Page = () => (
  <Default theme={T} title="今天的路線">
    <UL>
      <LI>OSINT — 從公開足跡找線索</LI>
      <LI>Web — 一條龍打進後台</LI>
      <LI>REV／WASM — 在瀏覽器裡作弊</LI>
      <LI>Blue Team — 當一次鑑識分析師</LI>
      <LI>用 AI 幫你出題</LI>
      <LI>學攻擊，為了變成更強的藍隊</LI>
    </UL>
  </Default>
);

const P0Thesis: Page = () => (
  <Statement theme={T} eyebrow="今天的主軸">
    學攻擊，<br />是為了更好的學會防禦！
  </Statement>
);

const P0Meme: Page = () => <MemeSlot theme={T} intent="開場破冰：駭客 ≠ 壞人，我們在教『防禦』" />;

// ════════════════════════ Part 1 打 CTF → 出 CTF ════════════════════════
const P1Section: Page = () => <Section theme={T} title="Part 1" subtitle="從打 CTF，到出 CTF" />;

const P1WhatIsCTF: Page = () => (
  <Default theme={T} title="CTF 是什麼？">
    <UL style={{ marginTop: 8 }}>
      <LI>Capture The Flag — 把藏起來的一串 <span style={{ fontFamily: MONO }}>flag</span> 找出來，換分數</LI>
      <LI>最常見＝Jeopardy（解謎式）：一格一題、各自獨立、越難分越高</LI>
      <LI>打的不是真實系統——是出題者準備好的「靶場」，合法、安全</LI>
    </UL>
  </Default>
);

const P1Categories: Page = () => (
  <Default theme={T} title="題目分類（今天走 4 類）">
    <div style={{ marginTop: 24, marginBottom: 40 }}>
      <Pill>OSINT</Pill><Pill>Web</Pill><Pill>REV</Pill><Pill color="#9aa3ad">Pwn</Pill>
      <Pill color="#9aa3ad">Crypto</Pill><Pill>Forensics ／ Blue</Pill><Pill color="#9aa3ad">Misc</Pill>
    </div>
    <div style={{ fontSize: 54, lineHeight: 1.5, marginTop: 12 }}>
      今天要介紹的內容：<span style={{ color: '#e07b1a', fontWeight: 700 }}>OSINT → Web → REV／WASM → Blue Team</span>
    </div>
  </Default>
);

const P1Lifecycle: Page = () => (
  <Default theme={T} title="一道題的生命週期">
    <OL style={{ marginTop: 12 }}>
      <LI>出題：定考點 → 寫題目敘述 → 做靶機</LI>
      <LI>部署：用 Docker 把靶機架起來，給選手連</LI>
      <LI>解題：選手分析、找漏洞、拿到 flag</LI>
      <LI>驗題：出題者自己（或派人）確認「真的解得出來、沒有非預期解」</LI>
      <LI>writeup：把解法寫成步驟教學，賽後分享</LI>
    </OL>
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
    <ul className="osd-list" style={{ marginTop: 12 }}>
      <Bullet>scoundrel：專找作弊捷徑——flag 有沒有明文洩漏？能不能跳步？</Bullet>
      <Bullet>lazy-developer／tool-grep-solver：只會 <span style={{ fontFamily: MONO }}>strings | grep</span>、只想一鍵解</Bullet>
      <Bullet>brute-forcer：能不能暴力硬解？</Bullet>
      <Bullet>confused-player：新手看得懂題目嗎？描述會不會反而洩題？</Bullet>
      <Bullet>decompiler-trust：反編譯後，看到不該看的東西嗎？</Bullet>
    </ul>
  </Default>
);

const P1Verify: Page = () => (
  <Default theme={T} title="出完題，怎麼確認它可解？">
    <ul className="osd-list" style={{ marginTop: 12 }}>
      <Bullet>每題一支 <span style={{ fontFamily: MONO }}>solve.py</span>，不寫死 flag——跑得過＝題目真的可解</Bullet>
      <Bullet>再派獨立 AI（ctf-solver）盲測：只給玩家素材、不准看答案</Bullet>
      <Bullet>跨模型驗收：Claude Sonnet／Opus／Haiku 各跑一輪都要過</Bullet>
      <Bullet>真實插曲：原訂的 OpenAI Codex 被自家安全護欄擋下，改用 Haiku 補位</Bullet>
    </ul>
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
    <ul className="osd-list" style={{ marginTop: 8 }}>
      <Bullet>一個推動 SDG 12（責任消費與生產）的開放資料站</Bullet>
      <Bullet>社群流傳一張截圖：有人「對接了非公開節點」</Bullet>
      <Bullet>你是調查者——從公開素材，循「對接夥伴的閱讀路徑」追進去</Bullet>
    </ul>
  </Default>
);

const P2aEssence: Page = () => (
  <Statement theme={T} eyebrow="這題在考什麼">
    沒有漏洞可打，<br />只有線索要<span style={{ color: '#e07b1a' }}>「串」</span>。
  </Statement>
);

const P2aObjectives: Page = () => (
  <Default theme={T} title="考點">
    <ul className="osd-list" style={{ marginTop: 8 }}>
      <Bullet>沒有傳統程式漏洞（無 SQLi／SSRF／SSTI）</Bullet>
      <Bullet>pivoting（線索接力）：把分散各處的線索接起來</Bullet>
      <Bullet>cross-source correlation：網站 × git 歷史 × 第三方 SaaS</Bullet>
      <Bullet>辨識「複製貼上殘留」型憑證洩漏</Bullet>
    </ul>
  </Default>
);

const P2aWarmup: Page = () => (
  <Default theme={T} title="為什麼用它暖場">
    <ul className="osd-list" style={{ marginTop: 8 }}>
      <Bullet>門檻低、不用寫 code——瀏覽器 ＋ <span style={{ fontFamily: MONO }}>curl</span> ＋ <span style={{ fontFamily: MONO }}>git</span> 就能走完</Bullet>
      <Bullet>貼近生活：可以延伸談數位足跡與隱私</Bullet>
      <Bullet>每一步都有「啊哈」時刻，失敗點明確、好除錯</Bullet>
    </ul>
  </Default>
);

// ── writeup（11 步，低密度、絕不跳步）──
const P2aS1: Page = () => (
  <StepPage theme={T} badge="步驟 1 / 共 11" beat="動作" title="訪首頁，讀「給夥伴」的暗示">
    <Mono>{`http://localhost:8088/`}</Mono>
    <ul className="osd-list" style={{ marginTop: 28 }}>
      <Bullet>首頁 §Partners 寫著「給對接夥伴」「內部文件庫」「AI 輔助文書流程」</Bullet>
      <Bullet sub>← 在暗示：有非公開入口、有內部慣例可循</Bullet>
    </ul>
  </StepPage>
);
const P2aS2: Page = () => (
  <StepPage theme={T} badge="步驟 2 / 共 11" beat="觀察 → 線索" title="直接敲 /.git/（注意尾斜線）">
    <Mono>{`$ curl -s http://localhost:8088/.git/HEAD\nref: refs/heads/main`}</Mono>
    <ul className="osd-list" style={{ marginTop: 28 }}>
      <Bullet>nginx 沒擋 /.git/，目錄列表（autoindex）把整個版控攤出來</Bullet>
      <Bullet sub>一個請求就確認漏洞 → 下一步：整包 clone 回來</Bullet>
    </ul>
  </StepPage>
);
const P2aMemeAha: Page = () => <MemeSlot theme={T} intent="恍然大悟：原來整包 .git 都被當靜態檔 serve 出來了" />;

const P2aS3a: Page = () => (
  <StepPage theme={T} badge="步驟 3 / 共 11" beat="動作" title="git clone 整包歷史">
    <Mono>{`$ git clone http://localhost:8088/.git supplytrace`}</Mono>
    <ul className="osd-list" style={{ marginTop: 28 }}>
      <Bullet><span style={{ fontFamily: MONO }}>.git/HEAD</span> 回 200 → dumb-HTTP 相容，clone 直接成立</Bullet>
    </ul>
  </StepPage>
);
const P2aS3b: Page = () => (
  <StepPage theme={T} badge="步驟 3 / 共 11" beat="原理" title="為什麼整個 repo 能被拉回？">
    <ul className="osd-list" style={{ marginTop: 8 }}>
      <Bullet>.git 目錄被當成「靜態檔」對外 serve，沒有任何存取控制</Bullet>
      <Bullet>版控歷史＝所有改過的檔案 ＋ 訊息，全都在裡面</Bullet>
      <Bullet sub>教學點：別把 .git 推到公開的網站根目錄</Bullet>
    </ul>
  </StepPage>
);
const P2aS4: Page = () => (
  <StepPage theme={T} badge="步驟 4 / 共 11" beat="動作 → 觀察" title="看有哪些 branch">
    <Mono>{`$ git branch -a\n* main\n  remotes/origin/internal/api-handover`}</Mono>
    <ul className="osd-list" style={{ marginTop: 28 }}>
      <Bullet>main 是乾淨的；<span style={{ fontFamily: MONO }}>internal/api-handover</span> 才藏東西</Bullet>
    </ul>
  </StepPage>
);
const P2aS5: Page = () => (
  <StepPage theme={T} badge="步驟 5 / 共 11" beat="動作" title="先讀 main 的 CONTRIBUTING.md">
    <Mono>{`$ git checkout main`}</Mono>
    <ul className="osd-list" style={{ marginTop: 28 }}>
      <Bullet>CONTRIBUTING.md 提到「交接事項在 handover branch」</Bullet>
      <Bullet sub>連這種小步也交代——這就是「不跳步」的 writeup</Bullet>
    </ul>
  </StepPage>
);
const P2aS6: Page = () => (
  <StepPage theme={T} badge="步驟 6 / 共 11" beat="動作 → 線索" title="切到 internal branch，檔案變多了">
    <Mono>{`$ git checkout internal/api-handover`}</Mono>
    <ul className="osd-list" style={{ marginTop: 28 }}>
      <Bullet>多出 <span style={{ fontFamily: MONO }}>CLAUDE.md</span>、<span style={{ fontFamily: MONO }}>SKILL.md</span>、<span style={{ fontFamily: MONO }}>RUNBOOK.md</span></Bullet>
      <Bullet sub>「給 AI 與內部人看」的文件 → 下一步：讀 CLAUDE.md</Bullet>
    </ul>
  </StepPage>
);
const P2aS7a: Page = () => (
  <StepPage theme={T} badge="步驟 7 / 共 11" beat="動作" title="從 CLAUDE.md 撈出 Postman 連結">
    <ul className="osd-list" style={{ marginBottom: 24 }}>
      <Bullet>CLAUDE.md 裡寫著一個 Postman 公開 workspace 的 URL</Bullet>
    </ul>
    <ShotSlot hint="CLAUDE.md 內文：含一行 Postman workspace URL（玩家視角）" h={360} />
  </StepPage>
);
const P2aS7b: Page = () => (
  <StepPage theme={T} badge="步驟 7 / 共 11" beat="原理" title="教育意義最濃的一段">
    <ul className="osd-list" style={{ marginTop: 8 }}>
      <Bullet>CLAUDE.md 還有一段「為什麼我們把 token 留在範例裡」的辯護</Bullet>
      <Bullet>AI 時代的新資安面：把憑證寫進「給 AI 讀的規格檔」</Bullet>
      <Bullet sub>可以問學生：你的 repo 有沒有夾帶 .env、截圖有沒有露 token？</Bullet>
    </ul>
  </StepPage>
);
const P2aS8: Page = () => (
  <StepPage theme={T} badge="步驟 8 / 共 11" beat="動作 → 觀察" title="打開 Postman 公開 workspace">
    <ul className="osd-list" style={{ marginTop: 8 }}>
      <Bullet>免登入就能看 → 裡面有 production 與 internal-development 兩個 collection</Bullet>
      <Bullet sub>我們要的東西在 internal-development</Bullet>
    </ul>
  </StepPage>
);
const P2aS9: Page = () => (
  <StepPage theme={T} badge="步驟 9 / 共 11" beat="動作" title="找 'Redeem (treasury)' 範例請求">
    <ul className="osd-list" style={{ marginTop: 8 }}>
      <Bullet>internal-development collection 裡有一個 Redeem 範例請求</Bullet>
      <Bullet sub>這就是後台兌換端點的「使用範例」</Bullet>
    </ul>
  </StepPage>
);
const P2aS10a: Page = () => (
  <StepPage theme={T} badge="步驟 10 / 共 11" beat="觀察" title="token 不在你以為的地方">
    <ul className="osd-list" style={{ marginBottom: 24 }}>
      <Bullet>Headers 分頁看起來空空的——Postman 把明文 Bearer 自動加密 vault 了</Bullet>
    </ul>
    <Mono>{`Authorization: Bearer ••••••`}</Mono>
  </StepPage>
);
const P2aS10b: Page = () => (
  <StepPage theme={T} badge="步驟 10 / 共 11" beat="線索" title="token 藏在「說明文字」裡">
    <ul className="osd-list" style={{ marginBottom: 24 }}>
      <Bullet>範例請求的 description 有一段 cURL snippet → 32-hex 的 Bearer token</Bullet>
      <Bullet>nonce 藏在 url.raw（網址）裡</Bullet>
    </ul>
    <Mono>{`Authorization: Bearer <32-hex token>\nPOST /internal/admin/<nonce>/redeem`}</Mono>
  </StepPage>
);
const P2aMemeEvil: Page = () => <MemeSlot theme={T} intent="作者太壞了／這是通靈：token 不在 header，藏在『說明文字』裡" />;

const P2aS10c: Page = () => (
  <StepPage theme={T} badge="步驟 10 / 共 11" beat="原理" title="為什麼會這樣漏？">
    <ul className="osd-list" style={{ marginTop: 8 }}>
      <Bullet>「複製貼上殘留」型洩漏——示範請求裡寫死了真 token，忘了改掉</Bullet>
      <Bullet sub>flag 的文字直接點題：<span style={{ fontFamily: MONO }}>pasted postman token</span></Bullet>
    </ul>
  </StepPage>
);
const P2aS11a: Page = () => (
  <StepPage theme={T} badge="步驟 11 / 共 11" beat="動作" title="帶著 token ＋ nonce 打後台">
    <Mono size={34}>{`$ curl -X POST \\\n    http://localhost:8088/internal/admin/<nonce>/redeem \\\n    -H "Authorization: Bearer <32-hex token>"`}</Mono>
    <ul className="osd-list" style={{ marginTop: 28 }}>
      <Bullet sub>把撿到的 nonce 填進網址、token 填進 Authorization</Bullet>
    </ul>
  </StepPage>
);
const P2aS11b: Page = () => (
  <StepPage theme={T} badge="步驟 11 / 共 11" beat="觀察 → 收網" title="後端怎麼驗？對了才給 flag">
    <ul className="osd-list" style={{ marginTop: 8 }}>
      <Bullet>nonce 用 <span style={{ fontFamily: MONO }}>hmac.compare_digest</span> 比對，錯 → 404</Bullet>
      <Bullet>token 須 32-hex → sha256 → 比對，錯 → 401</Bullet>
      <Bullet sub>兩關都過 → 回傳 flag（玩家視角，此處不投影）</Bullet>
    </ul>
  </StepPage>
);

// ── 帶學生 + 出題幕後 ──
const P2aTeach: Page = () => (
  <Default theme={T} title="怎麼帶學生走這題">
    <ul className="osd-list" style={{ marginTop: 8 }}>
      <Bullet>全班一起看首頁找線索 → 引導發現 /.git/</Bullet>
      <Bullet>一起 <span style={{ fontFamily: MONO }}>git clone</span> ＋ <span style={{ fontFamily: MONO }}>git branch -a</span></Bullet>
      <Bullet>分組讀 CLAUDE.md 找 URL → 開 Postman 撿 token → 一個 curl 拿 flag</Bullet>
    </ul>
  </Default>
);
const P2aPunch: Page = () => (
  <Statement theme={T} eyebrow="這題的金句">
    真實的資料外洩，<br />常常不是高超駭客技術，<br />而是<span style={{ color: '#e07b1a' }}>「複製貼上忘了改回去」</span>。
  </Statement>
);
const P2aBehind1: Page = () => (
  <Default theme={T} title="出題幕後：可控的擬真網路">
    <ul className="osd-list" style={{ marginTop: 8 }}>
      <Bullet>OSINT 天生依賴外部資源（這題靠 Postman 公開 workspace）</Bullet>
      <Bullet>但自動驗題不能每次真的去建一個 Postman workspace</Bullet>
      <Bullet>解法：本機假 Postman（mock），與真實路徑共用同一份 template、同一組 token</Bullet>
      <Bullet sub>→「驗過的鏈 ＝ 玩家會走的鏈」，且離線、可重現</Bullet>
    </ul>
  </Default>
);
const P2aBehind2: Page = () => (
  <Default theme={T} title="出題幕後：不能洩題">
    <ul className="osd-list" style={{ marginTop: 8 }}>
      <Bullet>題目描述用 grep 強制檢查（reverse blacklist）</Bullet>
      <Bullet>禁止出現 <span style={{ fontFamily: MONO }}>.git／postman／OSINT／token／leak／bearer</span> 等字眼</Bullet>
      <Bullet sub>出題的藝術：給夠線索，但不能破梗</Bullet>
    </ul>
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
    <ul className="osd-list" style={{ marginTop: 8 }}>
      <Bullet>一個「買一雙送一雙」的公益送鞋活動站</Bullet>
      <Bullet>站方深信：「沒有公開連結，就等於沒人找得到」</Bullet>
      <Bullet sub>← 這個假設，正是整題的破口</Bullet>
    </ul>
  </Default>
);

const P2bEssence: Page = () => (
  <Statement theme={T} eyebrow="這題在打什麼">
    以為藏起來，<br />就<span style={{ color: '#e07b1a' }}>安全</span>了。
  </Statement>
);

const P2bChain: Page = () => (
  <Default theme={T} title="一條三段式攻擊鏈">
    <ul className="osd-list" style={{ marginTop: 8 }}>
      <Bullet>① OpenAPI schema 洩漏（資訊洩漏 · CWE-200）</Bullet>
      <Bullet>② 自助提權（授權失效 · CWE-862 · OWASP Top 10 #1）</Bullet>
      <Bullet>③ nginx alias off-by-slash 路徑遍歷</Bullet>
      <Bullet sub>三段都是「設定／授權」錯誤——不用記艱深 payload，口頭就能講清為什麼中招</Bullet>
    </ul>
  </Default>
);

// ── writeup（9 步）──
const P2bS1: Page = () => (
  <StepPage theme={T} badge="步驟 1 / 共 9" beat="動作" title="開首頁，聽公益送鞋的故事">
    <Mono>{`http://localhost:8082/`}</Mono>
    <ul className="osd-list" style={{ marginTop: 28 }}>
      <Bullet>先把「正常使用者看到的網站」走過一遍</Bullet>
      <Bullet sub>偵察永遠是第一步——先知道有哪些功能、哪些頁面</Bullet>
    </ul>
  </StepPage>
);
const P2bS2: Page = () => (
  <StepPage theme={T} badge="步驟 2 / 共 9" beat="動作 → 原理" title="註冊、登入一個一般會員">
    <ul className="osd-list" style={{ marginTop: 8 }}>
      <Bullet>註冊與登入要先 GET 表單頁拿 CSRF token，再帶 token POST</Bullet>
      <Bullet sub>連「先拿 CSRF token」這種小步也照樣交代清楚</Bullet>
      <Bullet sub>目的：先有一個「低權限身分」，等下從這裡往上爬</Bullet>
    </ul>
  </StepPage>
);
const P2bS3: Page = () => (
  <StepPage theme={T} badge="步驟 3 / 共 9" beat="觀察" title="以會員身分留言，確認自己很弱">
    <ul className="osd-list" style={{ marginTop: 8 }}>
      <Bullet>用 member 身分留言成功 → 確認目前是「一般會員」權限</Bullet>
      <Bullet sub>先確立「我現在能做什麼、不能做什麼」，提權才有對照</Bullet>
    </ul>
  </StepPage>
);
const P2bS4a: Page = () => (
  <StepPage theme={T} badge="步驟 4 / 共 9" beat="動作" title="啊哈點 ①：要一份 API 地圖">
    <Mono>{`$ curl -s http://localhost:8082/api/openapi.json`}</Mono>
    <ul className="osd-list" style={{ marginTop: 28 }}>
      <Bullet>整份 API schema（所有端點）一次攤在眼前</Bullet>
    </ul>
  </StepPage>
);
const P2bS4b: Page = () => (
  <StepPage theme={T} badge="步驟 4 / 共 9" beat="原理" title="為什麼這份地圖會外洩？">
    <ul className="osd-list" style={{ marginTop: 8 }}>
      <Bullet>FastAPI／Swagger 預設就會開 <span style={{ fontFamily: MONO }}>/openapi.json</span> 與 docs</Bullet>
      <Bullet>沒人連到 ≠ 不存在——它一直在那裡（CWE-200 資訊洩漏）</Bullet>
      <Bullet sub>真實世界超高頻：上線忘了關 API 文件</Bullet>
    </ul>
  </StepPage>
);
const P2bS4c: Page = () => (
  <StepPage theme={T} badge="步驟 4 / 共 9" beat="觀察 → 線索" title="地圖上有一個不該給你的端點">
    <Mono>{`POST /api/admin/promote/{user_id}`}</Mono>
    <ul className="osd-list" style={{ marginTop: 28 }}>
      <Bullet>schema 裡有個「把使用者升成 admin」的端點</Bullet>
      <Bullet sub>下一步：試試看一般會員能不能直接呼叫它</Bullet>
    </ul>
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
    <ul className="osd-list" style={{ marginTop: 8 }}>
      <Bullet>這個端點漏掉了 <span style={{ fontFamily: MONO }}>require_admin</span> 的權限檢查</Bullet>
      <Bullet>於是任何登入的會員，都能呼叫它把自己升成 admin</Bullet>
      <Bullet sub>授權失效（CWE-862）——OWASP Top 10 2021 排名第一</Bullet>
    </ul>
  </StepPage>
);
const P2bS5c: Page = () => (
  <StepPage theme={T} badge="步驟 5 / 共 9" beat="觀察" title="role 從 member 變 admin 的瞬間">
    <Mono>{`{ "id": <my_id>, "role": "admin" }`}</Mono>
    <ul className="osd-list" style={{ marginTop: 28 }}>
      <Bullet><span style={{ fontFamily: MONO }}>role</span> 從 member 變成 admin——一個請求就完成</Bullet>
    </ul>
  </StepPage>
);
const P2bMemeAdmin: Page = () => <MemeSlot theme={T} intent="作弊爽感：一個 curl，member 秒變 admin" />;

const P2bS6: Page = () => (
  <StepPage theme={T} badge="步驟 6 / 共 9" beat="觀察" title="驗證提權真的有用">
    <ul className="osd-list" style={{ marginTop: 8 }}>
      <Bullet>升權前：<span style={{ fontFamily: MONO }}>/sales</span> 對非 admin 是擋的（403）</Bullet>
      <Bullet>升權後：同一個 <span style={{ fontFamily: MONO }}>/sales</span> 通了</Bullet>
      <Bullet sub>確認手上的 admin 是「真的能用」的，再往下走</Bullet>
    </ul>
  </StepPage>
);
const P2bS7a: Page = () => (
  <StepPage theme={T} badge="步驟 7 / 共 9" beat="動作" title="啊哈點 ②：在網址上動手腳">
    <Mono>{`GET /sales../meetings/2026-Q1-africa-expansion.md`}</Mono>

    <ul className="osd-list" style={{ marginTop: 28 }}>
      <Bullet>用 <span style={{ fontFamily: MONO }}>/sales..</span> 跳出原本的目錄，讀到內部會議檔</Bullet>
      <Bullet sub>這一步只是「示範遍歷原語」——還沒拿到 flag</Bullet>
    </ul>
  </StepPage>
);
const P2bS7b: Page = () => (
  <StepPage theme={T} badge="步驟 7 / 共 9" beat="原理" title="一個尾斜線的差別">
    <Mono size={32}>{`location /sales            ← 無尾斜線\nalias    /srv/internal/sales/   ← 有尾斜線\n\n/sales../flag.txt\n  → /srv/internal/sales/../flag.txt\n  → /srv/internal/flag.txt   ✗ 跳出去了`}</Mono>
    <ul className="osd-list" style={{ marginTop: 22 }}>
      <Bullet sub>nginx 著名設定陷阱：location 與 alias 尾斜線錯位 → 路徑遍歷</Bullet>
    </ul>
  </StepPage>
);
const P2bS8: Page = () => (
  <StepPage theme={T} badge="步驟 8 / 共 9" beat="觀察 → 線索" title="遍歷落地頁，把內部目錄看光">
    <ul className="osd-list" style={{ marginTop: 8 }}>
      <Bullet>遍歷到內部目錄根，落地頁列出裡面所有檔案</Bullet>
      <Bullet>清單裡指出 <span style={{ fontFamily: MONO }}>flag.txt</span> 的位置</Bullet>
      <Bullet sub>注意：flag 在獨立的 flag.txt——會議檔只是「示範遍歷」的中繼，不是終點</Bullet>
    </ul>
  </StepPage>
);
const P2bS9: Page = () => (
  <StepPage theme={T} badge="步驟 9 / 共 9" beat="動作 → 收網" title="讀出那一格 flag.txt">
    <Mono>{`GET /sales../flag.txt`}</Mono>
    <ul className="osd-list" style={{ marginTop: 28 }}>
      <Bullet>同一招遍歷，這次直接讀內部目錄根下的 flag.txt</Bullet>
      <Bullet sub>flag 字面 b0g0＝Buy One Get One，呼應送鞋故事（玩家視角，不投影明文）</Bullet>
    </ul>
  </StepPage>
);

// ── 帶學生 + 出題幕後 ──
const P2bTeach: Page = () => (
  <Default theme={T} title="怎麼帶學生走這題">
    <ul className="osd-list" style={{ marginTop: 8 }}>
      <Bullet>開站講送鞋故事 → 點出兩個錯誤的安全假設</Bullet>
      <Bullet>打開 openapi.json，讓學生看「地圖被攤開」</Bullet>
      <Bullet>當場 curl promote → <span style={{ fontFamily: MONO }}>role: admin</span> 出現的瞬間最有戲</Bullet>
      <Bullet>示範遍歷讀 flag → 最後跑 solve.py 看「出題者怎麼自動驗題」</Bullet>
    </ul>
  </Default>
);
const P2bPunch: Page = () => (
  <Statement theme={T} eyebrow="這題的金句">
    藏起來，<br /><span style={{ color: '#e07b1a' }}>不等於</span>安全。
  </Statement>
);
const P2bBehind: Page = () => (
  <Default theme={T} title="出題幕後：最具體的 audit 紀錄">
    <ul className="osd-list" style={{ marginTop: 8 }}>
      <Bullet>完整的 stages ledger，每階段都留 audit_verdict 與具體 notes</Bullet>
      <Bullet>4 個 persona 平行對抗審查：scoundrel／lazy-developer／confused-developer／confused-player</Bullet>
      <Bullet sub>其中一階段「採納了 6 個 Critical 修正」——出題不是一次到位，是反覆找碴</Bullet>
    </ul>
  </Default>
);
const P2bDemoRisk: Page = () => (
  <Default theme={T} title="現場 demo 的小提醒">
    <ul className="osd-list" style={{ marginTop: 8 }}>
      <Bullet>register／login 各有獨立的 <span style={{ fontFamily: MONO }}>5 次 / 5 分鐘</span> 限流桶</Bullet>
      <Bullet>連跑幾次 solve.py 會撞 429</Bullet>
      <Bullet sub>對策：demo 前 <span style={{ fontFamily: MONO }}>docker compose restart api</span> 清乾淨</Bullet>
    </ul>
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
    <ul className="osd-list" style={{ marginTop: 8 }}>
      <Bullet>一張 SDG 主題的 2D 像素 RPG 地圖，要跑三項永續驗證</Bullet>
      <Bullet>系統「全程靜默」：做對做錯都不回應</Bullet>
      <Bullet>地圖上有塊金色「封閉現場」，看得到、走得近，<span style={{ color: '#e07b1a' }}>就是走不進去</span></Bullet>
    </ul>
  </Default>
);

const P2cEssence: Page = () => (
  <Statement theme={T} eyebrow="這題在玩什麼">
    走不進去的牆，<br />用記憶體把它<span style={{ color: '#e07b1a' }}>「推開」</span>。
  </Statement>
);

const P2cWasm: Page = () => (
  <Default theme={T} title="WASM 為什麼有趣">
    <ul className="osd-list" style={{ marginTop: 8 }}>
      <Bullet>WebAssembly＝編譯後的二進位，<span style={{ fontFamily: MONO }}>strings／wasm2wat</span> 只看到框架痕跡</Bullet>
      <Bullet>但它活在瀏覽器裡——記憶體完全攤在 DevTools 面前</Bullet>
      <Bullet sub>「難靜態反編譯、易動態分析」的最佳教材</Bullet>
    </ul>
  </Default>
);

const P2cMethod: Page = () => (
  <Default theme={T} title="這題在考什麼">
    <ul className="osd-list" style={{ marginTop: 8 }}>
      <Bullet>client-side trust 的反例：封閉區只靠「前端碰撞檢查」把關（CWE-693）</Bullet>
      <Bullet>位置加密用 WASM 內的 RSA-OAEP（不是瀏覽器 crypto.subtle）→ 逼你真的去碰 WASM</Bullet>
      <Bullet sub>核心方法論：靜態分析撈不到 → 改用動態分析</Bullet>
    </ul>
  </Default>
);

// ── writeup（9 步，console script demo 路徑）──
const P2cS1: Page = () => (
  <StepPage theme={T} badge="步驟 1 / 共 9" beat="動作" title="先把三項 SDG 驗證答對">
    <ul className="osd-list" style={{ marginTop: 8 }}>
      <Bullet>地圖上跑 SDG 6／7／13 三題問答，答對 3 題</Bullet>
      <Bullet sub>題庫共 150 題、5 張隨機地圖——反 speedrun，不能事先背答案</Bullet>
    </ul>
  </StepPage>
);
const P2cS2: Page = () => (
  <StepPage theme={T} badge="步驟 2 / 共 9" beat="觀察" title="最後一關：走不進那塊金色的地">
    <ul className="osd-list" style={{ marginTop: 8 }}>
      <Bullet>最後一筆簽核非得在封閉區內完成</Bullet>
      <Bullet>但方向鍵怎麼走，都停在牆外一格</Bullet>
      <Bullet sub>通行證一核發只有 120 秒——時間壓力</Bullet>
    </ul>
  </StepPage>
);
const P2cMemeFrustrate: Page = () => <MemeSlot theme={T} intent="覺得自己太笨／作者太壞：方向鍵怎麼按都進不去" />;

const P2cS3: Page = () => (
  <StepPage theme={T} badge="步驟 3 / 共 9" beat="原理" title="為什麼走不進去？">
    <ul className="osd-list" style={{ marginTop: 8 }}>
      <Bullet>封閉區是 1×1 單格，碰撞檢查刻意寫成 off-by-one（邊界差一格）</Bullet>
      <Bullet>於是你永遠卡在牆外一格——一道「幽靈牆」(phantom wall)</Bullet>
      <Bullet sub>這不是 bug，是出題者埋的刻意線索</Bullet>
    </ul>
  </StepPage>
);
const P2cS4: Page = () => (
  <StepPage theme={T} badge="步驟 4 / 共 9" beat="觀察" title="靜態分析：什麼都撈不到">
    <Mono>{`$ strings wasm_game_bg.wasm | grep -i flag\n(無)`}</Mono>
    <ul className="osd-list" style={{ marginTop: 28 }}>
      <Bullet>strings／wasm2wat 只看到 Rust crate 路徑，沒有答案</Bullet>
      <Bullet sub>製造懸念：那答案到底在哪？→ 換動態分析</Bullet>
    </ul>
  </StepPage>
);
const P2cMemeStatic: Page = () => <MemeSlot theme={T} intent="通靈：strings | grep flag 什麼都沒有，這是要我通靈嗎" />;

const P2cS5: Page = () => (
  <StepPage theme={T} badge="步驟 5 / 共 9" beat="動作" title="F12 開 console，把 WASM 攤開">
    <Mono size={34}>{`> Object.keys(window.__GAME_WASM__)   // 列出 WASM exports\n> window.__GAME_MEMORY__               // WebAssembly.Memory（記憶體攤開）`}</Mono>
    <ul className="osd-list" style={{ marginTop: 24 }}>
      <Bullet sub>前端開場就把 WASM 與記憶體掛到 window，不用裝任何擴充</Bullet>
    </ul>
  </StepPage>
);
const P2cS6: Page = () => (
  <StepPage theme={T} badge="步驟 6 / 共 9" beat="觀察" title="它一直在偷偷印自己的座標">
    <Mono>{`[pos] x=12 y=34      // 每個 frame 印出當前座標`}</Mono>
    <ul className="osd-list" style={{ marginTop: 28 }}>
      <Bullet>console 持續印當前 (x, y) → 我們知道「現在的值」是多少</Bullet>
      <Bullet sub>有了已知值，就能在記憶體裡反查它的位址</Bullet>
    </ul>
  </StepPage>
);
const P2cS7: Page = () => (
  <StepPage theme={T} badge="步驟 7 / 共 9" beat="動作 → 原理" title="掃描記憶體，收斂到座標的位址">
    <Mono size={34}>{`> const mem = new Int32Array(window.__GAME_MEMORY__.buffer)\n> // 掃 mem 找出值 = 當前 x 的位址；走一格再掃；交集收斂`}</Mono>
    <ul className="osd-list" style={{ marginTop: 24 }}>
      <Bullet sub>3–4 次掃描就能定位 player_x／player_y 的 offset——這就是 Cheat Engine 的精神</Bullet>
    </ul>
  </StepPage>
);
const P2cS8: Page = () => (
  <StepPage theme={T} badge="步驟 8 / 共 9" beat="動作 → 高潮" title="改一個數字，角色瞬移進去">
    <Mono size={34}>{`> mem[player_x_offset] = <封閉區 x>\n> mem[player_y_offset] = <封閉區 y>`}</Mono>
    <ul className="osd-list" style={{ marginTop: 24 }}>
      <Bullet>角色當場瞬移進封閉區 → HUD 變「通行證已核發」</Bullet>
      <Bullet sub>WASM 自動把（加密的）座標送給後端 → server 唯一一次簽 JWT，寫進 <span style={{ fontFamily: MONO }}>window.__GAME_PASS__</span></Bullet>
    </ul>
  </StepPage>
);
const P2cMemeTeleport: Page = () => <MemeSlot theme={T} intent="恍然大悟＋爽：改一個數字，角色直接瞬移進金色封閉區" />;

const P2cS9: Page = () => (
  <StepPage theme={T} badge="步驟 9 / 共 9" beat="動作 → 收網" title="按 E，換出 flag">
    <ul className="osd-list" style={{ marginTop: 8 }}>
      <Bullet>在封閉區按 E → 前端 flag-terminal.js 算出 proof（sha256）</Bullet>
      <Bullet>帶著 JWT ＋ proof 打 <span style={{ fontFamily: MONO }}>POST /api/flag</span> → console 印出 flag</Bullet>
      <Bullet sub>JWT 只活 120 秒、alg=none 會被拒——雙重把關（玩家視角，不投影明文）</Bullet>
    </ul>
  </StepPage>
);

const P2cPunch: Page = () => (
  <Statement theme={T} eyebrow="這題的金句">
    跑在使用者瀏覽器裡的驗證，<br />永遠<span style={{ color: '#e07b1a' }}>不能信任</span>。
  </Statement>
);
const P2cTeach: Page = () => (
  <Default theme={T} title="怎麼帶學生走這題">
    <ul className="osd-list" style={{ marginTop: 8 }}>
      <Bullet>視覺化、遊戲化：不是枯燥的 ELF，是會動的 SDG 像素 RPG</Bullet>
      <Bullet>即時爽感：改一個數字角色就瞬移——把 Cheat Engine 搬到瀏覽器</Bullet>
      <Bullet>連結日常：為什麼線上遊戲會被外掛？因為前端不能信任</Bullet>
      <Bullet sub>（正規工具是 Cetus 擴充；現場我們用 console script，免裝、節奏更穩）</Bullet>
    </ul>
  </Default>
);
const P2cBehind: Page = () => (
  <Default theme={T} title="出題幕後：最有說服力的故事">
    <ul className="osd-list" style={{ marginTop: 8 }}>
      <Bullet>扮 brute-forcer 的 AI 找到致命缺陷：答案曾被放進玩家可讀的 JSON → 可秒解（F-8）</Bullet>
      <Bullet>第一次修補（答案搬進 WASM 表）→ 扮 tool-grep-solver 的 AI 用一條 regex 就還原 → 判定無效</Bullet>
      <Bullet sub>最終逼出整個架構重構（改成 RSA-OAEP ＋ server 端題庫）——AI 出題是對抗式迭代，不是一次生成</Bullet>
    </ul>
  </Default>
);
const P2cDemoRisk: Page = () => (
  <Default theme={T} title="現場 demo 的小提醒">
    <ul className="osd-list" style={{ marginTop: 8 }}>
      <Bullet>JWT 只活 120 秒——先把 offset 找好、或一鍵 script 到位</Bullet>
      <Bullet>舊頁面快取會卡 → 用無痕新分頁</Bullet>
      <Bullet sub>保底：跑 blackbox 的 exploit.py 直接送密文，0.2 秒秒出 flag（少了爽感但保證可動）</Bullet>
    </ul>
  </Default>
);

const PART2C: Page[] = [
  P2cSection, P2cScenario, P2cEssence, P2cWasm, P2cMethod,
  P2cS1, P2cS2, P2cMemeFrustrate, P2cS3, P2cS4, P2cMemeStatic,
  P2cS5, P2cS6, P2cS7, P2cS8, P2cMemeTeleport, P2cS9,
  P2cPunch, P2cTeach, P2cBehind, P2cDemoRisk,
];

// ════════════ Part 2d ④ Blue Team — Eternal Relay（壓軸 · 銜接防禦）════════════
const P2dSection: Page = () => <Section theme={T} title="④ Blue Team" subtitle="Eternal Relay · 壓軸" />;

const P2dScenario: Page = () => (
  <Default theme={T} title="情境：Eternal Relay">
    <ul className="osd-list" style={{ marginTop: 8 }}>
      <Bullet>某夜內部監測在 SPAN 港側錄到三段可疑訊號</Bullet>
      <Bullet>三段來自三台不同主機，卻都指向同一個內網位址</Bullet>
      <Bullet>鑑識小組另從一台受影響工作站，取回一份 Windows 執行檔</Bullet>
    </ul>
  </Default>
);

const P2dFlip: Page = () => (
  <Statement theme={T} eyebrow="壓軸的轉折">
    這一次，<br />你是<span style={{ color: '#e07b1a' }}>藍隊</span>。
  </Statement>
);

const P2dEssence: Page = () => (
  <Default theme={T} title="你不是攻擊者，是鑑識分析師">
    <ul className="osd-list" style={{ marginTop: 8 }}>
      <Bullet>不是發動攻擊——是「事後鑑識」，重建攻擊者做了什麼</Bullet>
      <Bullet>素材＝三份 PCAP（側錄流量）＋ 一份取回的執行檔</Bullet>
      <Bullet sub>這正是真實 SOC／DFIR 的工作模式</Bullet>
    </ul>
  </Default>
);

const P2dSkills: Page = () => (
  <Default theme={T} title="要同時動用三條技能線">
    <Cards>
      <Card title="PE 靜態結構" body="看 section table、抓 .rdata、認 C++ name mangling" />
      <Card title="PCAP / 自訂協定" body="取 TCP payload、逆向 binary frame 格式" />
      <Card title="對稱密碼學" body="ChaCha20、stream cipher、known-plaintext oracle" />
    </Cards>
    <div style={{ fontSize: 38, color: '#555', marginTop: 36, textAlign: 'center' }}>工具全是 OSS；不需商用 RE 工具、不需執行 PE、不需暴力。</div>
  </Default>
);

// ── writeup（四步鑑識契約）──
const P2dS1a: Page = () => (
  <StepPage theme={T} badge="步驟 1 / 共 4" beat="動作" title="先 triage 那份執行檔">
    <Mono>{`$ strings relay.exe | grep -E "relay|crypto|SMB2"`}</Mono>
    <ul className="osd-list" style={{ marginTop: 28 }}>
      <Bullet>用 pefile 載入 relay.exe，定位 <span style={{ fontFamily: MONO }}>.rdata</span>（常數材料區）</Bullet>
    </ul>
  </StepPage>
);
const P2dS1b: Page = () => (
  <StepPage theme={T} badge="步驟 1 / 共 4" beat="觀察" title="符號表沒被 strip——線索全露了">
    <Mono size={34}>{`relay::crypto::K\nderive_nonce\nchacha20_encrypt`}</Mono>
    <ul className="osd-list" style={{ marginTop: 24 }}>
      <Bullet>mangled symbol 直接告訴你：用的是 ChaCha20，金鑰叫 K</Bullet>
      <Bullet sub>未 strip 的符號表，本身就是鑑識的禮物</Bullet>
    </ul>
  </StepPage>
);
const P2dS1c: Page = () => (
  <StepPage theme={T} badge="步驟 1 / 共 4" beat="陷阱（最重要的一拍）" title="別被假 IOC 帶著走">
    <ul className="osd-list" style={{ marginBottom: 22 }}>
      <Bullet>PE 裡還有一排 SMB banner：NEGOTIATE／NTLM relay／TREE_CONNECT IPC$／WRITE</Bullet>
      <Bullet>看起來像 SMB 橫向移動（呼應題名 Eternal）</Bullet>
    </ul>
    <Mono size={34}>{`但它們是空的 stub——沒有任何遠端呼叫實作`}</Mono>
    <ul className="osd-list" style={{ marginTop: 22 }}>
      <Bullet sub>真正的資料外傳走自訂 TCP frame。教藍隊：追真資料流，別追裝飾</Bullet>
    </ul>
  </StepPage>
);
const P2dMemeFakeIOC: Page = () => <MemeSlot theme={T} intent="作者太壞：一排 SMB banner 全是裝飾，真的資料流藏在別處" />;

const P2dS2a: Page = () => (
  <StepPage theme={T} badge="步驟 2 / 共 4" beat="動作 → 原理" title="把三份 PCAP 切成 frame">
    <Mono size={30}>{`magic 0xC2C2 切 frame：\n[2B magic][1B index][1B total][12B nonce][2B len BE][N B 密文]`}</Mono>
    <ul className="osd-list" style={{ marginTop: 22 }}>
      <Bullet sub>tshark／scapy 取 TCP payload，照這個格式拆開每個 frame</Bullet>
    </ul>
  </StepPage>
);
const P2dS2b: Page = () => (
  <StepPage theme={T} badge="步驟 2 / 共 4" beat="觀察 → 陷阱" title="檔名順序，不是重組順序">
    <Mono size={32}>{`host_a.pcap   MAC 02:aa:..   chunk_index = 2\nhost_b.pcap   MAC 02:bb:..   chunk_index = 0\nhost_c.pcap   MAC 02:cc:..   chunk_index = 1`}</Mono>
    <ul className="osd-list" style={{ marginTop: 22 }}>
      <Bullet sub>a/b/c 的檔名順序，與 chunk_index（2/0/1）刻意不重合 → 必須依 index 排</Bullet>
    </ul>
  </StepPage>
);
const P2dS3a: Page = () => (
  <StepPage theme={T} badge="步驟 3 / 共 4" beat="原理" title="nonce 是從 source MAC 長出來的">
    <Mono size={34}>{`12B nonce = 00 00 00 00 │ <6B source MAC> │ 00 00`}</Mono>
    <ul className="osd-list" style={{ marginTop: 24 }}>
      <Bullet>每台主機的 nonce 都能從它的 MAC 推出來</Bullet>
      <Bullet sub>看懂這條規律，就能對每段各自還原 keystream</Bullet>
    </ul>
  </StepPage>
);
const P2dS3b: Page = () => (
  <StepPage theme={T} badge="步驟 3 / 共 4" beat="動作（金鑰還原）" title="用「已知開頭」把金鑰逼出來">
    <Mono size={30}>{`chunk_index==0 的明文 必以 "ISIP" 起首   ← crib（已知明文）\n對 .rdata 跑 32-byte sliding window：\n  解密前 4 bytes == b"ISIP" ? → 命中\n→ 命中 .rdata offset 64，取得 ChaCha20 金鑰`}</Mono>
  </StepPage>
);
const P2dMemeKeyHit: Page = () => <MemeSlot theme={T} intent="恍然大悟：sliding window 在 .rdata offset 64 命中金鑰的瞬間" />;

const P2dS3c: Page = () => (
  <StepPage theme={T} badge="步驟 3 / 共 4" beat="陷阱" title="counter 不是 0，是 1">
    <Mono size={34}>{`⚠ initial_counter = 1   （不是 RFC 8439 預設的 0）\n   solver 端用 cipher.seek(64) 對應`}</Mono>
    <ul className="osd-list" style={{ marginTop: 24 }}>
      <Bullet sub>用預設 counter=0 解出來會是亂碼——這一格差別卡死很多人</Bullet>
    </ul>
  </StepPage>
);
const P2dS4: Page = () => (
  <StepPage theme={T} badge="步驟 4 / 共 4" beat="動作 → 收網" title="解密、依序拼回，flag 現形">
    <Mono size={34}>{`B(0) → C(1) → A(2)  依 chunk_index 排序\n→ 串接 → rstrip \\x00 → 過 FLAG_REGEX`}</Mono>
    <ul className="osd-list" style={{ marginTop: 24 }}>
      <Bullet>三段各自 ChaCha20 解密，依 index 拼回一條明文</Bullet>
      <Bullet sub>flag 重組完成（玩家視角，不投影明文）</Bullet>
    </ul>
  </StepPage>
);

// ── 帶學生 + 防禦銜接 + 出題幕後 ──
const P2dTeach: Page = () => (
  <Default theme={T} title="怎麼帶學生走這題">
    <ul className="osd-list" style={{ marginTop: 8 }}>
      <Bullet>適合進階學生／資安社團：要同時動用 PE、PCAP、密碼學三條線</Bullet>
      <Bullet>零基礎設施：離線 PCAP ＋ 執行檔，發下去就能練</Bullet>
      <Bullet>帶法：先一起 strings 找線索 → 分組拆 frame → 一起算金鑰</Bullet>
      <Bullet sub>卡關引導：先點破「假 SMB 是裝飾」，再提示「counter 不是 0」</Bullet>
    </ul>
  </Default>
);
const P2dDefenseValue: Page = () => (
  <Default theme={T} title="這題，就是命題的縮影">
    <ul className="osd-list" style={{ marginTop: 8 }}>
      <Bullet>要還原攻擊，你得先懂攻擊——怎麼拆片、用 MAC 衍生 nonce、把 key 藏進 binary</Bullet>
      <Bullet>但題目刻意把「攻擊裝飾（假 SMB）」和「真資料流」分開</Bullet>
      <Bullet sub>訓練分析者：把 offensive 知識，翻轉成 defensive 判斷力</Bullet>
    </ul>
  </Default>
);
const P2dBehind: Page = () => (
  <Default theme={T} title="出題幕後：被獨立 AI 盲測過">
    <ul className="osd-list" style={{ marginTop: 8 }}>
      <Bullet>七階段 pipeline，每階段一個 commit（git SHA 鏈可佐證）</Bullet>
      <Bullet>最後一階段派 ctf-solver 盲測：只給玩家素材、10 分鐘解出</Bullet>
      <Bullet>並記錄數條死胡同（全 XOR、不排序串接、counter 試 0/2/3…）</Bullet>
      <Bullet sub>scoundrel 防線：任何 frame 若含明文 ISIP 直接 fail-fast → 確保沒洩 flag</Bullet>
    </ul>
  </Default>
);
const P2dBridge: Page = () => (
  <Default theme={T} title="從這裡，走向藍隊靶場">
    <ul className="osd-list" style={{ marginTop: 8 }}>
      <Bullet>這題零基礎設施：離線 PCAP ＋ PE，研習場地直接能跑</Bullet>
      <Bullet>但它涵蓋的技能——network forensics、binary triage、crypto recovery、multi-source correlation</Bullet>
      <Bullet sub>正是 CyberRange 藍隊演練的核心模組 → 先建鑑識直覺，再進動態事件應變</Bullet>
    </ul>
  </Default>
);

const PART2D: Page[] = [
  P2dSection, P2dScenario, P2dFlip, P2dEssence, P2dSkills,
  P2dS1a, P2dS1b, P2dS1c, P2dMemeFakeIOC,
  P2dS2a, P2dS2b, P2dS3a, P2dS3b, P2dMemeKeyHit, P2dS3c, P2dS4,
  P2dTeach, P2dDefenseValue, P2dBehind, P2dBridge,
];

// ════════════════ Part 3 藍隊靶場 — HITCON CyberRange ════════════════
const P3Section: Page = () => <Section theme={T} title="Part 3" subtitle="藍隊靶場 · CyberRange" />;

const P3Banner: Page = () => (
  <DeckPage theme={T} showPageNumber>
    <div style={{ position: 'absolute', top: 250, left: 134, width: 1651, height: 560, display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 2 }}>
      <img src={CYBERRANGE_BANNER} alt="HITCON CyberRange 2026" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', borderRadius: 16 }} />
    </div>
    <div style={{ position: 'absolute', bottom: 90, left: 134, width: 1651, textAlign: 'center', fontSize: 32, color: '#777', zIndex: 2 }}>
      HITCON CyberRange 2026 主視覺 · 來源：KKTIX 官方活動頁
    </div>
  </DeckPage>
);

const P3What: Page = () => (
  <Default theme={T} title="CyberRange 是什麼">
    <ul className="osd-list" style={{ marginTop: 8 }}>
      <Bullet>以「資安事件應變」為核心的企業<span style={{ color: '#e07b1a', fontWeight: 700 }}>藍隊</span>競賽 / 網路靶場</Bullet>
      <Bullet>高擬真環境，模擬企業遭複雜攻擊</Bullet>
      <Bullet>參賽隊扮演企業內部 IR 團隊，從大量告警與日誌找出攻擊者足跡並應變</Bullet>
      <Bullet sub>被定位為「臺灣難度最高的藍隊資安競賽之一」</Bullet>
    </ul>
  </Default>
);

const P3Orgs: Page = () => (
  <Default theme={T} title="誰辦的">
    <ul className="osd-list" style={{ marginTop: 8 }}>
      <Bullet>指導：數位發展部數位產業署（moda）</Bullet>
      <Bullet>主辦：台灣駭客協會 ＋ 工業技術研究院</Bullet>
      <Bullet>2026 協辦：TRAPA Security</Bullet>
      <Bullet sub>賽制：全球線上初賽 ＋ 台北線下決賽；每隊最多 4 人、需同一組織</Bullet>
    </ul>
  </Default>
);

const P3Features: Page = () => (
  <Default theme={T} title="它在練什麼">
    <ul className="osd-list" style={{ marginTop: 8 }}>
      <Bullet>依 MITRE ATT&amp;CK 重現真實攻擊組織（如 APT41）的完整攻擊鏈</Bullet>
      <Bullet>分析 traffic／server 與 endpoint logs／detection events，找出 IOC</Bullet>
      <Bullet>兩大題型：① 事件調查（找關鍵 IOC）② 事件應對（寫指令／規則，系統自動驗證）</Bullet>
      <Bullet sub>強制跨職能團隊：IT／網管、DC 管理員、AP 管理員、SOC／IR／鑑識</Bullet>
    </ul>
  </Default>
);

const P3Compare: Page = () => (
  <Default theme={T} title="CTF 與 CyberRange 的差別">
    <Cards>
      <Card title="傳統 CTF" accent="#9aa3ad" body={<>個別解題、搶 flag<br />個人 · 攻擊視角<br />單一題目附件<br />評分＝flag 對錯</>} />
      <Card title="HITCON CyberRange" body={<>企業環境中調查＋應變整起事件<br />IR 藍隊 · 貼近真實 SOC<br />全套 traffic／logs／detection<br />評分＝調查正確 ＋ 補救由系統驗證 ＋ 時間</>} />
    </Cards>
  </Default>
);

const P3Student: Page = () => (
  <Statement theme={T} eyebrow="這條線，直接連到你的學生">
    CyberRange 有「學生場」，<br />與 <span style={{ color: '#e07b1a' }}>ISIP</span> 合辦。
  </Statement>
);

const P3StudentNote: Page = () => (
  <Default theme={T} title="而這場研習，正是 ISIP 體系">
    <ul className="osd-list" style={{ marginTop: 8 }}>
      <Bullet>學生在貼近實戰的環境學：修補漏洞、強化防禦、團隊應變、分析複雜日誌</Bullet>
      <Bullet>本研習主辦正是 ISIP（教育部高中資安計畫）——你的學生，正站在這條線的起點</Bullet>
    </ul>
  </Default>
);

const P3Path: Page = () => (
  <Default theme={T} title="一條真實的成長路徑">
    <ul className="osd-list" style={{ marginTop: 8 }}>
      <Bullet>高中玩 CTF（攻擊）：2025 HITCON CTF 銅牌隊 ICEDTEA 就是高中起家</Bullet>
      <Bullet>進階藍隊（CyberRange）：同年藍隊賽金牌是國家資安院 NICS 的 OTEX 隊</Bullet>
      <Bullet sub>同一批人，從高中社團，一路打進國家級的資安團隊</Bullet>
    </ul>
  </Default>
);

const PART3: Page[] = [
  P3Section, P3Banner, P3What, P3Orgs, P3Features, P3Compare, P3Student, P3StudentNote, P3Path,
];

// ════════════════════════════ Part 4 收束 ════════════════════════════
const P4Section: Page = () => <Section theme={T} title="Part 4" subtitle="收束" />;

const P4Recap: Page = () => (
  <Default theme={T} title="今天我們走過">
    <UL style={{ marginTop: 12 }}>
      <LI>四題：OSINT → Web → REV → Blue（從攻擊技巧，走到鑑識視角）</LI>
      <LI>一條 AI 出題流水線（對抗式自我審查，把出題變工程）</LI>
      <LI>一座藍隊靶場（HITCON CyberRange，把技巧放進真實事件）</LI>
    </UL>
  </Default>
);

const P4Argument: Page = () => (
  <Default theme={T} title="會攻擊，不是終點">
    <ul className="osd-list" style={{ marginTop: 8 }}>
      <Bullet>CTF 教的是「攻擊者怎麼想」</Bullet>
      <Bullet>但 Eternal Relay 已經示範：要還原攻擊，你得先懂攻擊</Bullet>
      <Bullet sub>讀懂了攻擊怎麼來，你才有辦法把它擋下來——這就是防禦者的養成</Bullet>
    </ul>
  </Default>
);

const P4Thesis: Page = () => (
  <Statement theme={T} eyebrow="所以，回到最初那句">
    學攻擊，<br />是為了更好的<br />學會防禦！
    <div style={{ fontSize: 42, fontWeight: 400, color: '#555', marginTop: 52, lineHeight: 1.5 }}>
      這不是口號——是一條從高中 CTF，通往國家資安人才庫的真實路徑。
    </div>
  </Statement>
);

const P4Takeaway: Page = () => (
  <Default theme={T} title="帶回課堂的三件事">
    <ul className="osd-list" style={{ marginTop: 8 }}>
      <Bullet>用 AI skill 起一題：webchall-master／bluechall-master（已附下載）</Bullet>
      <Bullet>用今天四題當分級教材：OSINT 暖場 → Blue 壓軸</Bullet>
      <Bullet sub>帶學生從 CTF，一路走向 CyberRange</Bullet>
    </ul>
  </Default>
);

const P4Meme: Page = () => <MemeSlot theme={T} intent="收尾：一起把學生帶上路／『防禦者集合』" />;

const P4Thanks: Page = () => (
  <Cover theme={T} title="謝謝聆聽" subtitle="Q & A" />
);

const PART4: Page[] = [P4Section, P4Recap, P4Argument, P4Thesis, P4Takeaway, P4Meme, P4Thanks];

// ── 匯出 ──────────────────────────────────────────────────────────────────────────
export default [
  P0Cover, P0Intro, P0Outline, P0Roadmap, P0Thesis, P0Meme,
  ...PART1, ...PART2A, ...PART2B, ...PART2C, ...PART2D, ...PART3, ...PART4,
] satisfies Page[];

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
