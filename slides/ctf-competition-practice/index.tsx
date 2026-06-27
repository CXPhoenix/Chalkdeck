// 資安競賽實務 — ISIP.hs 離島區種子師資研習營 Day 2（2026/06/27）· 復興高中 陳晉
// 單一 index.tsx 連貫 deck。theme = fhsh-isiphs-universal（isip.hs / courseLevel 2 橘）。
// 內容藍本見 .spectra/subject/20260626_0628/（00–08 + HANDOFF）。
import type { CSSProperties, ReactNode } from "react";
import type {
  DesignSystem,
  Page,
  SlideMeta,
  SlideTransition,
} from "@open-slide/core";
import { Step, Steps, useSlidePageNumber } from "@open-slide/core";

import isipLogo from "@assets/fhsh-isiphs/isip-hs/logo.png";
import isipSection from "@assets/fhsh-isiphs/isip-hs/section-img.png";
import isipSlogon from "@assets/fhsh-isiphs/isip-hs/slogon.svg";
import fhshLogo from "@assets/fhsh-isiphs/fhsh/logo.png";
import fhshSection from "@assets/fhsh-isiphs/fhsh/section-img.png";
import fhshSlogon from "@assets/fhsh-isiphs/fhsh/slogon.svg";
import edukaiWoff2 from "@assets/fhsh-isiphs/fonts/edukai-fixed.woff2";

// ── 字體（module 層 idempotent 注入 head 一次）─────────────────────────────────────
const SANS = '"edukai", "Noto Sans TC", "Microsoft JhengHei", sans-serif';
const MONO = '"Source Code Pro", ui-monospace, monospace';
if (
  typeof document !== "undefined" &&
  !document.getElementById("osd-fhsh-isiphs-fonts")
) {
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href =
    "https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@400;500;700;900&family=Source+Code+Pro&display=swap";
  document.head.appendChild(link);
  const style = document.createElement("style");
  style.id = "osd-fhsh-isiphs-fonts";
  style.textContent =
    `@font-face{font-family:'edukai';src:url(${edukaiWoff2}) format('woff2');font-weight:normal;font-style:normal;font-display:swap;}` +
    `.osd-fhsh-content p{font-size:64px;line-height:1.6;margin:0 0 24px;}` +
    `.osd-fhsh-content h3{font-size:78px;line-height:1.4;margin:0 0 16px;}` +
    // 真正語意化列表（ul/ol/li raw 元素，靠左對齊、不仿樣式）
    `.osd-list{list-style:none;margin:0;padding:0;}` +
    `.osd-list>li{position:relative;padding-left:54px;font-size:54px;line-height:1.5;margin-bottom:20px;}` +
    `.osd-list>li::before{content:"\\2756";position:absolute;left:-16px;color:#e07b1a;}` +
    `.osd-list>li.sub{padding-left:50px;font-size:44px;}` +
    `.osd-list>li.sub::before{content:"\\27A2";color:#e07b1a;}` +
    `.osd-list.ord{list-style:decimal;padding-left:64px;}` +
    `.osd-list.ord>li{padding-left:10px;font-size:54px;line-height:1.5;margin-bottom:20px;}` +
    `.osd-list.ord>li::before{content:none;}` +
    `.osd-list.ord>li::marker{color:#e07b1a;font-weight:700;}` +
    // P1 分類頁 Morph：常駐標籤 + 隱形 Step 計數器 + CSS :has() 驅動位移／變色
    `.osd-morph-root{position:relative;width:100%;height:100%;}` +
    `.osd-morph-steps{position:absolute;left:0;top:0;width:0;height:0;overflow:hidden;pointer-events:none;}` +
    `.osd-morph-tag{position:absolute;display:inline-block;white-space:nowrap;border:3px solid #c4ccd6;color:#9aa3ad;background:#ffffff;border-radius:999px;padding:10px 32px;font-size:46px;font-weight:700;transition:left .6s cubic-bezier(.2,.7,.2,1),top .6s cubic-bezier(.2,.7,.2,1),transform .6s cubic-bezier(.2,.7,.2,1),color .45s ease,border-color .45s ease,background .45s ease,box-shadow .45s ease;}` +
    `.osd-morph-tag.is-osint{left:160px;top:60px;transform:rotate(-7deg);}` +
    `.osd-morph-tag.is-web{left:640px;top:50px;transform:rotate(6deg);}` +
    `.osd-morph-tag.is-rev{left:380px;top:220px;transform:rotate(-4deg);}` +
    `.osd-morph-tag.is-blue{left:560px;top:330px;transform:rotate(5deg);}` +
    `.osd-morph-tag.is-pwn{left:820px;top:120px;transform:rotate(8deg);}` +
    `.osd-morph-tag.is-crypto{left:1180px;top:90px;transform:rotate(-6deg);}` +
    `.osd-morph-tag.is-misc{left:1170px;top:300px;transform:rotate(7deg);}` +
    // 第 k 步揭露 → 第 k 個今日類別收攏到左欄並高亮（OSINT→Web→REV→Blue）
    `.osd-morph-root:has(.osd-morph-steps>div:nth-child(1)[data-osd-step="revealed"]) .is-osint,` +
    `.osd-morph-root:has(.osd-morph-steps>div:nth-child(2)[data-osd-step="revealed"]) .is-web,` +
    `.osd-morph-root:has(.osd-morph-steps>div:nth-child(3)[data-osd-step="revealed"]) .is-rev,` +
    `.osd-morph-root:has(.osd-morph-steps>div:nth-child(4)[data-osd-step="revealed"]) .is-blue{border-color:#e07b1a;color:#e07b1a;background:#fff7ee;box-shadow:0 8px 24px rgba(224,123,26,.18);left:0;transform:none;}` +
    `.osd-morph-root:has(.osd-morph-steps>div:nth-child(1)[data-osd-step="revealed"]) .is-osint{top:12px;}` +
    `.osd-morph-root:has(.osd-morph-steps>div:nth-child(2)[data-osd-step="revealed"]) .is-web{top:128px;}` +
    `.osd-morph-root:has(.osd-morph-steps>div:nth-child(3)[data-osd-step="revealed"]) .is-rev{top:244px;}` +
    `.osd-morph-root:has(.osd-morph-steps>div:nth-child(4)[data-osd-step="revealed"]) .is-blue{top:360px;}` +
    `.osd-morph-caption{position:absolute;left:12px;top:480px;width:1496px;font-size:78px;font-weight:700;color:#444444;line-height:1.3;opacity:0;transition:opacity .5s ease;}` +
    `.osd-morph-root:has(.osd-morph-steps>div:nth-child(5)[data-osd-step="revealed"]) .osd-morph-caption{opacity:1;}` +
    `.osd-morph-hint{position:absolute;right:6px;top:24px;font-size:30px;color:#aeb6c2;}` +
    `@media (prefers-reduced-motion:reduce){.osd-morph-tag,.osd-morph-caption{transition:none;}}` +
    // 逐拍揭露：真 <ul><li>（保留 ❖ bullet）+ 隱形 <Steps> 計數器。
    // .osd-steplist-root/-steps 為通用骨架；每頁再用 :has(.osd-steplist-steps>div:nth-child(k)[revealed]) 把第 k 拍對應到要顯示的元素。
    `.osd-steplist-root{position:relative;}` +
    `.osd-steplist-steps{position:absolute;left:0;top:0;width:0;height:0;overflow:hidden;pointer-events:none;}` +
    // 通用 1:1 對應：第 k 拍揭露 → osd-steplist 內第 k 個 li（純文字 UL/OL 列表用，如 P1Lifecycle）
    `.osd-steplist>li{opacity:0;transition:opacity .4s ease;}` +
    Array.from({ length: 8 }, (_, i) => `.osd-steplist-root:has(.osd-steplist-steps>div:nth-child(${i + 1})[data-osd-step="revealed"]) .osd-steplist>li:nth-of-type(${i + 1}){opacity:1;}`).join("") +
    `@media (prefers-reduced-motion:reduce){.osd-steplist>li{transition:none;}}` +
    // P1WhatIsCTF（CTF 是什麼？）六拍：flag → Jeopardy → A&D → KoH（Pill 逐顆）→ 最常見 → 靶場
    `.osd-whatisctf .reveal{opacity:0;transition:opacity .4s ease;}` +
    `.osd-whatisctf .pillrow{padding-left:0;}` +
    `.osd-whatisctf .pillrow::before{content:none;}` +
    `.osd-whatisctf:has(.osd-steplist-steps>div:nth-child(1)[data-osd-step="revealed"]) .s1,` +
    `.osd-whatisctf:has(.osd-steplist-steps>div:nth-child(2)[data-osd-step="revealed"]) .s2,` +
    `.osd-whatisctf:has(.osd-steplist-steps>div:nth-child(3)[data-osd-step="revealed"]) .s3,` +
    `.osd-whatisctf:has(.osd-steplist-steps>div:nth-child(4)[data-osd-step="revealed"]) .s4,` +
    `.osd-whatisctf:has(.osd-steplist-steps>div:nth-child(5)[data-osd-step="revealed"]) .s5,` +
    `.osd-whatisctf:has(.osd-steplist-steps>div:nth-child(6)[data-osd-step="revealed"]) .s6{opacity:1;}` +
    `@media (prefers-reduced-motion:reduce){.osd-whatisctf .reveal{transition:none;}}` +
    // P1Personas：4 個壞玩家攻擊者卡（2×2 grid，紅隊色，呼應 AdvReview 對抗者節點）；沿用 osd-steplist 逐顆浮現。
    `.osd-personas{display:grid;grid-template-columns:1fr 1fr;gap:28px 32px;list-style:none;margin:0;padding:0;}` +
    `.osd-personas>li{margin:0;}` +
    `.osd-fhsh-content a{color:#0284c7;text-decoration:underline;text-underline-offset:2px;}` +
    `.osd-fhsh-content a:hover{color:#1e40af;}`;
  document.head.appendChild(style);
}

// ── makeTheme / Frame / page helper（與 themes/fhsh-isiphs-universal.md 同步）─────────
type ThemeName = "fhsh" | "isip.hs";
type Lvl = 0 | 1 | 2;
const LEVELS = {
  0: { frame: "#c2d59b", guide: "#b3cc82", footer: "#b3cc82" },
  1: { frame: "#92d2ef", guide: "#92ccdc", footer: "#92ccdc" },
  2: { frame: "#fab150", guide: "#f79646", footer: "#fdad4d" },
} as const;
const ASSETS = {
  fhsh: { logo: fhshLogo, sectionImg: fhshSection, slogon: fhshSlogon },
  "isip.hs": { logo: isipLogo, sectionImg: isipSection, slogon: isipSlogon },
} as const;
function makeTheme(themeName: ThemeName = "fhsh", courseLevel: Lvl = 0) {
  const lv = (courseLevel < 0 || courseLevel > 2 ? 0 : courseLevel) as Lvl;
  const isIsip = themeName === "isip.hs";
  return {
    themeName,
    courseLevel: lv,
    frame: LEVELS[lv],
    assets: ASSETS[themeName],
    palette: {
      primary: "#3b82f6",
      borderBlue: "#6bbae7",
      text: "#000000",
      bg: "#ffffff",
      link: "#0284c7",
      linkHover: "#1e40af",
    },
    fonts: { sans: SANS, mono: MONO },
    coverSlogonTop: isIsip ? 540 : 605,
    sectionImgTop: isIsip ? 486 : 432,
  };
}
type Theme = ReturnType<typeof makeTheme>;

const Frame = ({ theme }: { theme: Theme }) => (
  <svg
    viewBox="0 0 1920 1080"
    preserveAspectRatio="none"
    style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
  >
    <rect x="0" y="0" width="1920" height="1080" fill="#ffffff" />
    <rect
      x="11.4"
      y="11.4"
      width="1893.6"
      height="1054.56"
      fill="none"
      stroke={theme.frame.frame}
      strokeWidth="40"
    />
    <line
      x1="129.36"
      y1="0"
      x2="129.36"
      y2="1080"
      stroke={theme.frame.guide}
      strokeWidth="2"
      strokeDasharray="8 6"
    />
    <line
      x1="1782.72"
      y1="0"
      x2="1782.72"
      y2="1080"
      stroke={theme.frame.guide}
      strokeWidth="2"
      strokeDasharray="8 6"
    />
    <line
      x1="0"
      y1="89.76"
      x2="1920"
      y2="89.76"
      stroke={theme.frame.guide}
      strokeWidth="2"
      strokeDasharray="8 6"
    />
    <line
      x1="0"
      y1="228"
      x2="1920"
      y2="228"
      stroke={theme.frame.guide}
      strokeWidth="2"
      strokeDasharray="8 6"
    />
    <line
      x1="64.62"
      y1="933.54"
      x2="1855.38"
      y2="933.54"
      stroke={theme.frame.footer}
      strokeWidth="2"
      strokeDasharray="16 6"
    />
  </svg>
);

const DeckPage = ({
  theme,
  showPageNumber = true,
  logo,
  logoStyle,
  children,
}: {
  theme: Theme;
  showPageNumber?: boolean;
  logo?: string;
  logoStyle?: CSSProperties;
  children?: ReactNode;
}) => {
  const { current, total } = useSlidePageNumber();
  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        background: theme.palette.bg,
        color: theme.palette.text,
        fontFamily: theme.fonts.sans,
        overflow: "hidden",
      }}
    >
      <Frame theme={theme} />
      {children}
      <img
        src={logo ?? theme.assets.logo}
        alt="logo"
        style={{
          position: "absolute",
          left: 38,
          top: 38,
          width: 100,
          zIndex: 10,
          ...logoStyle,
        }}
      />
      {showPageNumber && (
        <div
          style={{
            position: "absolute",
            bottom: 54,
            left: 134,
            width: 1651,
            textAlign: "center",
            fontSize: 31,
            color: theme.palette.text,
            zIndex: 10,
          }}
        >
          {current} / {total}
        </div>
      )}
    </div>
  );
};

const Cover = ({
  theme,
  logo,
  logoStyle,
  title,
  subtitle,
  slogon,
  slogonStyle,
}: {
  theme: Theme;
  logo?: string;
  logoStyle?: CSSProperties;
  title: ReactNode;
  subtitle?: ReactNode;
  slogon?: string;
  slogonStyle?: CSSProperties;
}) => (
  <DeckPage
    theme={theme}
    showPageNumber={false}
    logo={logo}
    logoStyle={logoStyle}
  >
    <div
      style={{
        position: "absolute",
        top: 290,
        left: 134,
        width: 1651,
        height: 702,
        zIndex: 2,
      }}
    >
      <h1
        style={{
          fontSize: 105,
          fontWeight: 700,
          textAlign: "center",
          margin: 0,
          lineHeight: 1.1,
        }}
      >
        {title}
      </h1>
      {subtitle && (
        <h2
          style={{
            fontSize: 94,
            fontWeight: 700,
            textAlign: "center",
            margin: "24px 0 0",
          }}
        >
          {subtitle}
        </h2>
      )}
    </div>
    <img
      src={slogon ?? theme.assets.slogon}
      alt="slogon"
      style={{
        position: "absolute",
        left: 154,
        width: 806,
        top: theme.coverSlogonTop,
        zIndex: 2,
        ...slogonStyle,
      }}
    />
  </DeckPage>
);

const Section = ({
  theme,
  logo,
  logoStyle,
  title,
  subtitle,
  sectionImg,
  sectionImgStyle,
}: {
  theme: Theme;
  logo?: string;
  logoStyle?: CSSProperties;
  title: ReactNode;
  subtitle?: ReactNode;
  sectionImg?: string;
  sectionImgStyle?: CSSProperties;
}) => (
  <DeckPage
    theme={theme}
    showPageNumber={false}
    logo={logo}
    logoStyle={logoStyle}
  >
    <div
      style={{
        position: "absolute",
        top: 227,
        left: 134,
        width: 1651,
        height: 702,
        zIndex: 2,
      }}
    >
      <h1
        style={{
          fontSize: 105,
          fontWeight: 700,
          margin: 0,
          paddingLeft: 188,
          paddingTop: 41,
          lineHeight: 1.1,
        }}
      >
        {title}
      </h1>
      {subtitle && (
        <h2
          style={{
            fontSize: 81,
            fontWeight: 700,
            margin: 0,
            paddingLeft: 376,
            paddingTop: 13,
          }}
        >
          {subtitle}
        </h2>
      )}
    </div>
    <img
      src={sectionImg ?? theme.assets.sectionImg}
      alt="section"
      style={{
        position: "absolute",
        top: theme.sectionImgTop,
        right: 106,
        width: 922,
        zIndex: 1,
        ...sectionImgStyle,
      }}
    />
  </DeckPage>
);

const Default = ({
  theme,
  logo,
  logoStyle,
  title,
  children,
}: {
  theme: Theme;
  logo?: string;
  logoStyle?: CSSProperties;
  title?: ReactNode;
  children?: ReactNode;
}) => (
  <DeckPage theme={theme} logo={logo} logoStyle={logoStyle}>
    {title && (
      <div
        style={{
          position: "absolute",
          top: 100,
          left: 134,
          width: 1651,
          height: 125,
          textAlign: "center",
          zIndex: 2,
        }}
      >
        <h1
          style={{
            fontSize: 105,
            fontWeight: 700,
            margin: 0,
            lineHeight: 1.1,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {title}
        </h1>
      </div>
    )}
    <div
      className="osd-fhsh-content"
      style={{
        position: "absolute",
        top: 230,
        left: 200,
        width: 1520,
        height: 700,
        fontSize: 64,
        lineHeight: 1.6,
        zIndex: 2,
      }}
    >
      {children}
    </div>
    <img
      src={theme.assets.slogon}
      alt="slogon"
      style={{
        position: "absolute",
        bottom: 43,
        right: 38,
        width: 230,
        zIndex: 2,
      }}
    />
  </DeckPage>
);

const ImagePage = ({
  theme,
  logo,
  logoStyle,
  src,
  alt,
}: {
  theme: Theme;
  logo?: string;
  logoStyle?: CSSProperties;
  src: string;
  alt?: string;
}) => (
  <DeckPage theme={theme} logo={logo} logoStyle={logoStyle}>
    <div
      style={{
        position: "absolute",
        top: 227,
        left: 134,
        width: 1651,
        height: 702,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 2,
      }}
    >
      <img
        src={src}
        alt={alt ?? ""}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
    </div>
  </DeckPage>
);

const ToC = ({ items }: { items: ReactNode[] }) => (
  <ol
    style={{
      listStyle: "decimal",
      fontSize: 70,
      lineHeight: 1.6,
      paddingLeft: 96,
      margin: 0,
    }}
  >
    {items.map((t, i) => (
      <li key={i} style={{ marginBottom: 24 }}>
        {t}
      </li>
    ))}
  </ol>
);

// ── 本 deck 自訂共用元件 ──────────────────────────────────────────────────────────
// 置中大字陳述（命題埋種子 / 重捶）
const Statement = ({
  theme,
  eyebrow,
  children,
}: {
  theme: Theme;
  eyebrow?: string;
  children: ReactNode;
}) => (
  <DeckPage theme={theme} showPageNumber={false}>
    {eyebrow && (
      <div
        style={{
          position: "absolute",
          top: 100,
          left: 134,
          width: 1651,
          height: 125,
          textAlign: "center",
          zIndex: 2,
        }}
      >
        <h1
          style={{
            fontSize: 105,
            fontWeight: 700,
            margin: 0,
            lineHeight: 1.1,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {eyebrow}
        </h1>
      </div>
    )}
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "0 220px",
        zIndex: 2,
      }}
    >
      <div
        style={{
          fontSize: 88,
          fontWeight: 700,
          lineHeight: 1.35,
          textAlign: "center",
        }}
      >
        {children}
      </div>
    </div>
    <img
      src={theme.assets.slogon}
      alt="slogon"
      style={{
        position: "absolute",
        bottom: 43,
        right: 38,
        width: 230,
        zIndex: 2,
      }}
    />
  </DeckPage>
);

// 梗圖插槽：講者自填。圖檔放 assets/，命名 meme-<part>-<梗>.png；放好後在該頁 <MemeSlot/> 加 src 即可。
// 例：<MemeSlot theme={T} intent="…" src={new URL('./assets/meme-2a-aha-gitleak.png', import.meta.url).href} />
const MemeSlot = ({
  theme,
  intent,
  src,
}: {
  theme: Theme;
  intent: string;
  src?: string;
}) => (
  <DeckPage theme={theme} showPageNumber={false}>
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 2,
        padding: 70,
      }}
    >
      {src ? (
        <img
          src={src}
          alt={intent}
          style={{
            maxWidth: "100%",
            maxHeight: "100%",
            objectFit: "contain",
            borderRadius: 20,
          }}
        />
      ) : (
        <div
          style={{
            width: 1180,
            height: 540,
            border: "8px dashed #e0c485",
            borderRadius: 28,
            background: "#fbf7ee",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: 28,
          }}
        >
          <div style={{ fontSize: 140, lineHeight: 1 }}>🖼️</div>
          <div style={{ fontSize: 52, fontWeight: 700, color: "#b07d23" }}>
            MEME 插槽
          </div>
          <div
            style={{
              fontSize: 40,
              color: "#6b5836",
              textAlign: "center",
              maxWidth: 980,
              lineHeight: 1.5,
            }}
          >
            意圖：{intent}
          </div>
        </div>
      )}
    </div>
    <img
      src={theme.assets.slogon}
      alt="slogon"
      style={{
        position: "absolute",
        bottom: 43,
        right: 38,
        width: 230,
        zIndex: 2,
      }}
    />
  </DeckPage>
);

// 截圖插槽：講者 demo 時補玩家視角截圖（勿露 src/solution/flag）。放好圖後加 src 即可。
// 例：<ShotSlot hint="…" src={new URL('./assets/shot-2a-claude-md.png', import.meta.url).href} />
const ShotSlot = ({
  hint,
  h = 470,
  src,
}: {
  hint: string;
  h?: number;
  src?: string;
}) =>
  src ? (
    <img
      src={src}
      alt={hint}
      style={{
        width: "100%",
        height: h,
        objectFit: "contain",
        borderRadius: 16,
        background: "#f6f8fb",
        border: "2px solid #e3e8ef",
      }}
    />
  ) : (
    <div
      style={{
        width: "100%",
        height: h,
        border: "6px dashed #cfd6e0",
        borderRadius: 20,
        background: "#f6f8fb",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: 16,
      }}
    >
      <div style={{ fontSize: 76, lineHeight: 1 }}>🖥️</div>
      <div style={{ fontSize: 34, fontWeight: 700, color: "#6b7a90" }}>
        截圖插槽（玩家視角）
      </div>
      <div
        style={{
          fontSize: 30,
          color: "#7c8a9c",
          textAlign: "center",
          maxWidth: 1100,
          lineHeight: 1.5,
        }}
      >
        {hint}
      </div>
    </div>
  );

// 標籤膠囊（分類 / 技術詞）
const Pill = ({
  children,
  color = "#e07b1a",
}: {
  children: ReactNode;
  color?: string;
}) => (
  <span
    style={{
      display: "inline-block",
      border: `3px solid ${color}`,
      color,
      borderRadius: 999,
      padding: "6px 30px",
      fontSize: 42,
      fontWeight: 700,
      margin: "0 14px 18px 0",
    }}
  >
    {children}
  </span>
);

// mono 指令 / 程式 / 輸出塊（只放玩家視角）
const Mono = ({
  children,
  size = 38,
}: {
  children: ReactNode;
  size?: number;
}) => (
  <div
    style={{
      fontFamily: MONO,
      fontSize: size,
      background: "#f4f2ec",
      border: "2px solid #e0dacb",
      borderRadius: 14,
      padding: "20px 28px",
      lineHeight: 1.55,
      whiteSpace: "pre-wrap",
      wordBreak: "break-word",
      color: "#1b1b1b",
    }}
  >
    {children}
  </div>
);

// writeup 步驟頁：徽章「N/M」（報告人視角，精簡）+ 標題 + 低密度內容
const StepPage = ({
  theme,
  badge,
  title,
  children,
}: {
  theme: Theme;
  badge: string;
  title: ReactNode;
  children: ReactNode;
}) => (
  <DeckPage theme={theme}>
    <div
      style={{
        position: "absolute",
        top: 120,
        left: 200,
        right: 160,
        zIndex: 2,
      }}
    >
      <h1 style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 66, fontWeight: 700, margin: 0, lineHeight: 1.2 }}>
        <span
          style={{
            fontSize: 38,
            fontWeight: 700,
            color: "#fff",
            background: "#e07b1a",
            borderRadius: 10,
            padding: "6px 26px",
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {badge}
        </span>
        {title}
      </h1>
    </div>
    <div
      style={{
        position: "absolute",
        top: 296,
        left: 200,
        width: 1520,
        height: 600,
        zIndex: 2,
      }}
    >
      {children}
    </div>
    <img
      src={theme.assets.slogon}
      alt="slogon"
      style={{
        position: "absolute",
        bottom: 43,
        right: 38,
        width: 230,
        zIndex: 2,
      }}
    />
  </DeckPage>
);

// 兩欄卡片列（教學鏡頭 / 對照）
const Cards = ({ children }: { children: ReactNode }) => (
  <div style={{ display: "flex", gap: 40, marginTop: 12 }}>{children}</div>
);
const Card = ({
  title,
  body,
  accent = "#e07b1a",
}: {
  title: ReactNode;
  body: ReactNode;
  accent?: string;
}) => (
  <div
    style={{
      flex: 1,
      border: `4px solid ${accent}`,
      borderRadius: 22,
      padding: "36px 40px",
      background: "#fffdf8",
    }}
  >
    <div
      style={{
        fontSize: 50,
        fontWeight: 700,
        color: accent,
        marginBottom: 22,
        lineHeight: 1.25,
      }}
    >
      {title}
    </div>
    <div style={{ fontSize: 40, lineHeight: 1.5 }}>{body}</div>
  </div>
);

// 下載卡（skill zip）
const DownloadCard = ({
  name,
  desc,
  href,
  size,
}: {
  name: string;
  desc: string;
  href: string;
  size: string;
}) => (
  <div
    style={{
      flex: 1,
      border: "4px solid #e07b1a",
      borderRadius: 22,
      padding: "40px 44px",
      background: "#fffdf8",
      display: "flex",
      flexDirection: "column",
      gap: 18,
    }}
  >
    <div style={{ fontSize: 64, lineHeight: 1 }}>📦</div>
    <div style={{ fontFamily: MONO, fontSize: 46, fontWeight: 700 }}>
      {name}
    </div>
    <div style={{ fontSize: 38, lineHeight: 1.5, color: "#3a3a3a" }}>
      {desc}
    </div>
    <a
      href={href}
      download
      style={{
        fontFamily: MONO,
        fontSize: 34,
        color: "#0284c7",
        wordBreak: "break-all",
      }}
    >
      ⬇ 下載（{size}）
    </a>
  </div>
);

// ── 原生轉場（單一 DNA：RISE 房間預設 + SETTLE 封面）────────────────────────────────
const EASE_OUT = "cubic-bezier(0, 0, 0.2, 1)";
const EASE_IN = "cubic-bezier(0.4, 0, 1, 1)";
const RISE: SlideTransition = {
  duration: 200,
  exit: {
    duration: 140,
    easing: EASE_IN,
    keyframes: [
      { opacity: 1, transform: "translateY(0)" },
      { opacity: 0, transform: "translateY(-4px)" },
    ],
  },
  enter: {
    duration: 200,
    delay: 80,
    easing: EASE_OUT,
    keyframes: [
      { opacity: 0, transform: "translateY(6px)" },
      { opacity: 1, transform: "translateY(0)" },
    ],
  },
};
const SETTLE: SlideTransition = {
  duration: 280,
  exit: {
    duration: 160,
    easing: EASE_IN,
    keyframes: [
      { opacity: 1, transform: "translateY(0)" },
      { opacity: 0, transform: "translateY(-6px)" },
    ],
  },
  enter: {
    duration: 280,
    delay: 100,
    easing: EASE_OUT,
    keyframes: [
      { opacity: 0, transform: "translateY(12px)", filter: "blur(4px)" },
      { opacity: 1, transform: "translateY(0)", filter: "blur(0)" },
    ],
  },
};

// ── deck 設定 ─────────────────────────────────────────────────────────────────────
const T = makeTheme("isip.hs", 2); // isip.hs 品牌 · courseLevel 2（橘 / 進階）

// 老師可下載的出題 skill 包（已複製進 assets/，線上版公開可點）
const WEBCHALL_ZIP = new URL("./assets/webchall-master.zip", import.meta.url)
  .href;
const BLUECHALL_ZIP = new URL("./assets/bluechall-master.zip", import.meta.url)
  .href;
// HITCON CyberRange 2026 官方主視覺（KKTIX，已抓進 assets/；講者簡報前可換最新官方圖）
const CYBERRANGE_BANNER = new URL(
  "./assets/cyberrange-2026.png",
  import.meta.url,
).href;
const SPEAKER_PHOTO = new URL(
  "./assets/788abeb3-37ac-4f36-9018-dae67dffe210.png",
  import.meta.url,
).href;
const SHOT_DC_VERIFY = new URL(
  "./assets/shot-1-dc-verify.jpeg",
  import.meta.url,
).href;

// ════════════════════════════ Part 0 開場（精簡）════════════════════════════
const P0Cover: Page = () => (
  <Cover theme={T} title="資安競賽實務" subtitle="從攻擊走向防禦攻擊" />
);
P0Cover.transition = SETTLE;

// 自我介紹（左：姓名＋經歷；右：講者照片）
const P0Intro: Page = () => (
  <DeckPage theme={T}>
    <div
      style={{
        position: "absolute",
        top: 100,
        left: 134,
        width: 1651,
        height: 125,
        textAlign: "center",
        zIndex: 2,
      }}
    >
      <h1
        style={{ fontSize: 105, fontWeight: 700, margin: 0, lineHeight: 1.1 }}
      >
        自我介紹
      </h1>
    </div>
    {/* 名字＋經歷（左）與照片（右）兩欄，垂直置中、平衡上下空間 */}
    <div
      style={{
        position: "absolute",
        top: 248,
        left: 200,
        right: 140,
        bottom: 110,
        display: "flex",
        alignItems: "center",
        gap: 70,
        zIndex: 2,
      }}
    >
      <div style={{ flex: 1 }}>
        <div
          style={{
            fontSize: 112,
            fontWeight: 700,
            marginBottom: 44,
            letterSpacing: "0.08em",
            lineHeight: 1.1,
          }}
        >
          陳　晉
        </div>
        <ul className="osd-list">
          <li style={{ fontSize: 54 }}>北區資安教學資源師培中心副主任</li>
          <li style={{ fontSize: 54 }}>高中職資安推廣中心講師</li>
          <li style={{ fontSize: 54 }}>復興高中資訊科技代理教師</li>
          <li style={{ fontSize: 54 }}>國防管理學院資管系 CTF 教練</li>
        </ul>
      </div>
      <img
        src={SPEAKER_PHOTO}
        alt="講者照片：陳晉"
        style={{
          flex: "0 0 auto",
          height: "680px",
          objectFit: "contain",
          filter: "drop-shadow(0 14px 26px rgba(0,0,0,0.16))",
        }}
      />
    </div>
  </DeckPage>
);

const P0Outline: Page = () => (
  <Default theme={T} title="OUTLINE">
    <ol className="osd-list ord" style={{ marginTop: 16 }}>
      <li>CTF 從解題到出題</li>
      <li>解題實戰與出題故事分享</li>
      <li>另一種 CTF：Blue team cyber range</li>
      <li>總結</li>
    </ol>
  </Default>
);

const P0Thesis: Page = () => (
  <Statement theme={T} eyebrow="今天的主軸">
    學攻擊，
    <br />
    是為了更好的學會防禦！
  </Statement>
);

const P0Meme: Page = () => (
  <MemeSlot theme={T} intent="開場破冰：駭客 ≠ 壞人，我們在教『防禦』" />
);

// ════════════════════════ Part 1 打 CTF → 出 CTF ════════════════════════
const P1Section: Page = () => (
  <Section theme={T} title="CTF 出題心得" subtitle="從打 CTF，到出 CTF" />
);

// 逐拍揭露示範：真 <ul><li>（osd-list 保留 ❖ bullet）+ 同層隱形 <Steps> 當計數器。
// 六拍＝flag→Jeopardy→A&D→KoH（Pill 逐顆）→最常見→靶場；對應規則見上方 .osd-whatisctf CSS。
// 編輯器／縮圖／PDF 無 step host → 全部 revealed（完成態）；只有 Present（按 f）從前頁翻入才分段。
// 賽制三選項（Pill）刻意放在 <ul> 外的獨立 <div>：避免任一 render 情境（字型晚載、CSS override 未生效）
// 出現孤兒項目符號；reveal class（s2~s4）放 span 上、靠 :has() 對應，與結構無關，移出後仍正確分拍。
const P1WhatIsCTF: Page = () => (
  <Default theme={T} title="CTF 是什麼？">
    <div className="osd-steplist-root osd-whatisctf">
      <ul className="osd-list" style={{ marginTop: 8 }}>
        <li className="reveal s1">
          Capture The Flag：找出藏起來的{" "}
          <span style={{ fontFamily: MONO }}>flag</span>，換分數
        </li>
      </ul>
      <div
        className="pillrow"
        style={{ display: "flex", justifyContent: "space-around", margin: "20px 0" }}
      >
        <span className="reveal s2"><Pill>🧩 Jeopardy</Pill></span>
        <span className="reveal s3"><Pill>⚔️ Attack & Defense (A&D)</Pill></span>
        <span className="reveal s4"><Pill>👑 King of Hill (KoH)</Pill></span>
      </div>
      <ul className="osd-list">
        <li className="reveal s5">最常見是 Jeopardy（解謎式）：一格一題、越難分越高</li>
        <li className="reveal s6">打的不是真實系統，是出題者準備的「靶場」——合法、安全</li>
      </ul>
      <div className="osd-steplist-steps" aria-hidden={true}>
        <Steps>
          <Step />
          <Step />
          <Step />
          <Step />
          <Step />
          <Step />
        </Steps>
      </div>
    </div>
  </Default>
);

// 分類頁 Morph：7 個常駐標籤先四散、灰；每按一次 → 今日 4 類依序收攏左欄並高亮。
// 隱形的 <Steps> 只當揭露計數器（DOM 上 data-osd-step=revealed/pending），CSS :has() 據此驅動常駐標籤。
// 無 step host（overview 縮圖／反向進入）時 framework 讓所有 Step revealed → 直接呈現完成態。
const P1Categories: Page = () => (
  <Default theme={T} title="CTF 題目分類">
    <div className="osd-morph-root">
      <span className="osd-morph-tag is-osint">OSINT</span>
      <span className="osd-morph-tag is-web">Web</span>
      <span className="osd-morph-tag is-rev">REV</span>
      <span className="osd-morph-tag is-blue">Blue Team</span>
      <span className="osd-morph-tag is-pwn">Pwn</span>
      <span className="osd-morph-tag is-crypto">Crypto</span>
      <span className="osd-morph-tag is-misc">Misc</span>
      <div className="osd-morph-caption">
        今天介紹的類型：
        <br />
        <b style={{ color: "#e07b1a" }}>OSINT → Web → REV → Blue Team</b>
      </div>
      <div className="osd-morph-steps" aria-hidden>
        {/* 順序攸關：第 1~4 步依序對應 OSINT／Web／REV／Blue，第 5 步（最後一 click）才顯示結論字（見上方 CSS :has nth-child 規則），勿增刪或重排 */}
        <Steps>
          <Step>
            <i />
          </Step>
          <Step>
            <i />
          </Step>
          <Step>
            <i />
          </Step>
          <Step>
            <i />
          </Step>
          <Step>
            <i />
          </Step>
        </Steps>
      </div>
    </div>
  </Default>
);

const P1Bridge1: Page = () => (
  <Statement theme={T}>
    對老師們而言，打 CTF 不是重點，
    <br />
    出題才是！
  </Statement>
);

// 出題生命週期：5 關水平流程圖（靜態，無高亮，與 P1Pipeline 同一視覺語彙）。
const LIFE_STAGES = [
  { n: "①", name: "出題", desc: "定考點・做靶機" },
  { n: "②", name: "驗題", desc: "確認可解・無非預期解" },
  { n: "③", name: "部署", desc: "用 Docker 架靶機" },
  { n: "④", name: "解題", desc: "選手找漏洞・拿 flag" },
  { n: "⑤", name: "writeup", desc: "寫解法・賽後分享" },
];
const P1Lifecycle: Page = () => (
  <Default theme={T} title="出題的生命週期">
    <div style={{ height: "100%", display: "flex", alignItems: "center" }}>
      <svg viewBox="0 108 1520 174" width="100%" style={{ display: "block" }}>
        <defs>
          <marker id="ahLife" markerUnits="userSpaceOnUse" markerWidth="20" markerHeight="20" refX="14" refY="10" orient="auto">
            <path d="M2,2 L18,10 L2,18 Z" fill="#e07b1a" />
          </marker>
        </defs>
        {LIFE_STAGES.map((s, i) => {
          const x = 10 + i * 306;
          const cx = x + 136;
          return (
            <g key={s.name}>
              {i < LIFE_STAGES.length - 1 && (
                <line x1={x + 276} y1={185} x2={x + 302} y2={185} stroke="#e07b1a" strokeWidth="5" markerEnd="url(#ahLife)" />
              )}
              <rect x={x} y={120} width={272} height={150} rx={22} fill="#fffaf3" stroke="#e8a460" strokeWidth={3.5} />
              <text x={cx} y={190} textAnchor="middle" fontSize="40" fontWeight="700" fill="#b8650f">
                {s.n} {s.name}
              </text>
              <text x={cx} y={236} textAnchor="middle" fontSize="24" fill="#8a5a2a">
                {s.desc}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  </Default>
);

// const P1Lenses: Page = () => (
//   <Default theme={T} title="每一題，都用三個鏡頭看">
//     <Cards>
//       <Card title="① 如何分析" body="拿到題目怎麼拆？線索在哪、下一步往哪走。" />
//       <Card title="② 如何帶學生" body="怎麼入門、卡關怎麼引導、適合幾年級。" />
//       <Card title="③ 出題幕後" body="這題怎麼用 AI 出的、怎麼確保不被秒解。" />
//     </Cards>
//     <div style={{ fontSize: 40, color: '#555', marginTop: 44, textAlign: 'center' }}>同一組鏡頭看四題 → 老師學到的是「可遷移的方法」，不是單一題解。</div>
//   </Default>
// );

const P1Meme1: Page = () => (
  <MemeSlot theme={T} intent="分類像 RPG 選職業：每一類都是一種『破關玩法』" />
);

const P1AIIntro: Page = () => (
  <Statement theme={T} eyebrow="但我知道大家忙，所以...">
    今天要先分享如何 <span style={{ color: "#e02253" }}>用 AI 出題目</span>！
    <br />
  </Statement>
);

const P1AIIntro2: Page = () => (
  <Statement theme={T} eyebrow="BTW">
    今天這四題，都是用 <span style={{ color: "#e07b1a" }}>AI</span> 出的。
  </Statement>
);

const P1AINouns: Page = () => (
  <Default theme={T} title="AI 出題要了解的三件事">
    <div style={{ paddingTop: "8%" }}>
      <Cards>
        <Card
          title="🤖 AI agent"
          body="會自己讀檔、跑指令、做決定的 AI：不只是聊天框。"
        />
        <Card
          title="📦 skill 技能包"
          body="給 agent 的一本專業手冊＋工具，這裡是「出 CTF 題」的手冊。"
        />
        <Card
          title="🏭 pipeline 流水線"
          body="把出題拆成有順序的關卡，每關交付一點、檢查一次。"
        />
      </Cards>
    </div>
  </Default>
);

const PIPE_STAGES = [
  { en: "Brief", zh: "接題" },
  { en: "Design", zh: "設計考點" },
  { en: "Implement", zh: "做靶機" },
  { en: "V&V", zh: "驗題", focus: true },
  { en: "Publish", zh: "上線" },
];
const P1Pipeline: Page = () => (
  <Default theme={T} title="AI 出題路徑">
    <div
      style={{
        display: "flex",
        justifyContent: "space-around",
        flexWrap: "wrap",
        gap: 18,
        alignItems: "center",
        marginTop: 28,
      }}
    >
      <Steps>
        {PIPE_STAGES.map((s, i) => (
          <Step key={s.en}>
            <span style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <span
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  border: s.focus ? "4px solid #e07b1a" : "3px solid #e8a460",
                  borderRadius: 14,
                  padding: "8px 20px",
                  background: s.focus ? "#fde7cf" : "transparent",
                }}
              >
                <span style={{ fontFamily: MONO, fontSize: 38, fontWeight: 700, color: "#b8650f" }}>
                  {s.en}
                </span>
                <span style={{ fontSize: 23, color: "#8a5a2a", marginTop: 2 }}>{s.zh}</span>
              </span>
              {i < PIPE_STAGES.length - 1 && (
                <span style={{ fontSize: 38, color: "#e07b1a" }}>→</span>
              )}
            </span>
          </Step>
        ))}
      </Steps>
    </div>
    <div style={{ fontSize: 28, color: "#8a5a2a", textAlign: "center", marginTop: 16 }}>
      ＝生命週期的「出題＋驗題」用 AI skill 跑一遍（
      <b style={{ color: "#b8650f" }}>V&amp;V＝驗題</b>那一關）
    </div>
    <div style={{ fontSize: 48, lineHeight: 1.5, marginTop: 36 }}>
      <Steps>
        <Step>
          每一關出完 →<br />
        </Step>
        <Step>
          <span style={{ paddingLeft: "4rem" }}>
            派 AI 分身扮「攻擊者」找碴 → 把問題折回去修 →
          </span>
          <br />
        </Step>
        <Step>
          <span style={{ paddingLeft: "67%" }}>才放行下一關。</span>
        </Step>
      </Steps>
    </div>
    <Steps>
      <Step>
        <div
          style={{
            backgroundColor: "rgba(224,123,26,0.2)",
            borderRadius: "2rem",
            textAlign: "center",
            fontSize: 40,
            marginTop: 24,
            paddingTop: 16,
          }}
        >
          出完題後的關鍵字： <Pill>Adversarial Review</Pill>
        </div>
      </Step>
    </Steps>
  </Default>
);

// 4 個壞玩家攻擊者卡（紅隊色，呼應 AdvReview「對抗者 AI 分身」節點）；清單型 → 沿用 osd-steplist 逐顆浮現。
const PERSONAS = [
  { icon: "🃏", name: "scoundrel", q: "有沒有什麼作弊捷徑？" },
  { icon: "🔨", name: "brute-forcer", q: "能不能暴力硬解？" },
  { icon: "🧩", name: "confused-player", q: "新手能懂題目嗎？描述會不會反而洩題？" },
  { icon: "🔍", name: "decompiler-trust", q: "反編譯後，會看到不該看的東西嗎？" },
];
const P1Personas: Page = () => (
  <Default theme={T} title="用 Sub Agent 扮演『壞玩家』們">
    <div className="osd-steplist-root">
      <div style={{ fontSize: 34, color: "#555", marginTop: 4, marginBottom: 24 }}>
        前面那個「<span style={{ fontWeight: 700, color: "#c0392b" }}>對抗者 AI 分身</span>
        」，其實就是這 4 個壞玩家分身：
      </div>
      <ul className="osd-steplist osd-personas">
        {PERSONAS.map((p) => (
          <li key={p.name}>
            <div
              style={{
                border: "3px solid #c0392b",
                borderRadius: 20,
                background: "#fdf3f2",
                padding: "18px 28px",
                height: "100%",
                boxSizing: "border-box",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
                <span style={{ fontSize: 52 }}>{p.icon}</span>
                <span style={{ fontFamily: MONO, fontSize: 38, fontWeight: 700, color: "#b03a30" }}>
                  {p.name}
                </span>
              </div>
              <div style={{ fontSize: 33, marginTop: 10, color: "#333", lineHeight: 1.4 }}>{p.q}</div>
            </div>
          </li>
        ))}
      </ul>
      <div className="osd-steplist-steps" aria-hidden={true}>
        <Steps>
          <Step />
          <Step />
          <Step />
          <Step />
        </Steps>
      </div>
    </div>
  </Default>
);

// 3 道驗證關卡（綠色 gate＝要通過的檢查）→ 清單型保留逐關浮現；過完三關才接 AR callout。
const VERIFY_GATES = [
  { tag: "① 可解？", title: "solve.py", mono: true, desc: "每題一支、不寫死 flag；跑得過＝可解" },
  { tag: "② 不靠答案？", title: "獨立 AI 盲測", desc: "派 ctf-solver，只給玩家素材、不准看答案" },
  { tag: "③ 換腦也過？", title: "跨模型驗收", desc: "Claude／Codex／Gemini 各跑一輪都過", note: "有錢的話 😄" },
];
const P1Verify: Page = () => (
  <Default theme={T} title="出完題，怎麼確認它可解？">
    <div style={{ display: "flex", alignItems: "stretch", justifyContent: "center", marginTop: 40 }}>
      <Steps>
        {VERIFY_GATES.map((g, i) => (
          <Step key={g.title}>
            <div style={{ display: "flex", alignItems: "center", height: "100%" }}>
              {i > 0 && <span style={{ fontSize: 44, color: "#e07b1a", margin: "0 14px" }}>→</span>}
              <div
                style={{
                  width: 416,
                  boxSizing: "border-box",
                  border: "3px solid #2e8b57",
                  borderRadius: 18,
                  background: "#edf7f0",
                  padding: "16px 24px",
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: 26, fontWeight: 700, color: "#2e8b57" }}>{g.tag}</div>
                <div
                  style={{
                    fontFamily: g.mono ? MONO : undefined,
                    fontSize: 36,
                    fontWeight: 700,
                    color: "#b8650f",
                    marginTop: 4,
                  }}
                >
                  {g.title}
                </div>
                <div style={{ fontSize: 26, color: "#555", marginTop: 8, lineHeight: 1.35 }}>{g.desc}</div>
                {g.note && <div style={{ fontSize: 22, color: "#aaa", marginTop: 6 }}>{g.note}</div>}
              </div>
            </div>
          </Step>
        ))}
      </Steps>
    </div>
    <Steps>
      <Step>
        <div
          style={{
            backgroundColor: "rgba(224,123,26,0.12)",
            border: "2px solid #e07b1a",
            borderRadius: "1.5rem",
            marginTop: 36,
            padding: "16px 32px",
            fontSize: 34,
            lineHeight: 1.45,
          }}
        >
          ⚔️ 三關都過，也只證明『可解』 → 下一步是{" "}
          <span style={{ fontSize: "4.2rem", fontWeight: 700, color: "#b8650f" }}>Adversarial Review</span>：<br />
          <span style={{ paddingLeft: "4rem" }}>派 AI 當「攻擊者」反過來攻破它（作弊／非預期解／洩題）</span>
        </div>
      </Step>
    </Steps>
  </Default>
);

// ① 名詞解釋（從字根講起）：Merriam-Webster 定義 + 字源 + 「兩方對立」視覺化。
const P1AdvReviewTerm: Page = () => (
  <Default theme={T} title="先拆字：Adversarial（對抗的）">
    <div
      style={{
        backgroundColor: "rgba(224,123,26,0.12)",
        border: "2px solid #e07b1a",
        borderRadius: "1.5rem",
        padding: "20px 36px",
        marginTop: 8,
      }}
    >
      <div style={{ fontSize: 46, fontWeight: 700, lineHeight: 1.3 }}>
        <span style={{ color: "#b8650f" }}>Adversarial</span>
        ＝兩方相互對立、彼此較勁
      </div>
      <div style={{ fontSize: 32, color: "#888", marginTop: 10 }}>
        「two sides who oppose each other」— Merriam-Webster
      </div>
    </div>
    <svg viewBox="0 0 1520 250" width="100%" style={{ display: "block", marginTop: 44 }}>
      <defs>
        <marker id="ahTermB" markerUnits="userSpaceOnUse" markerWidth="22" markerHeight="22" refX="15" refY="11" orient="auto">
          <path d="M2,2 L20,11 L2,20 Z" fill="#3a6ea5" />
        </marker>
        <marker id="ahTermR" markerUnits="userSpaceOnUse" markerWidth="22" markerHeight="22" refX="15" refY="11" orient="auto">
          <path d="M2,2 L20,11 L2,20 Z" fill="#c0392b" />
        </marker>
      </defs>
      <rect x="100" y="30" width="470" height="170" rx="26" fill="#eef4fb" stroke="#3a6ea5" strokeWidth="4" />
      <text x="335" y="108" textAnchor="middle" fontSize="58" fontWeight="700" fill="#2c5378">一方</text>
      <text x="335" y="162" textAnchor="middle" fontSize="32" fill="#5a7a9a">提出主張／作品</text>
      <rect x="950" y="30" width="470" height="170" rx="26" fill="#fdeeee" stroke="#c0392b" strokeWidth="4" />
      <text x="1185" y="108" textAnchor="middle" fontSize="50" fontWeight="700" fill="#c0392b">對手 adversary</text>
      <text x="1185" y="162" textAnchor="middle" fontSize="32" fill="#8a3a36">專挑毛病、反對</text>
      <line x1="585" y1="115" x2="730" y2="115" stroke="#3a6ea5" strokeWidth="7" markerEnd="url(#ahTermB)" />
      <line x1="935" y1="115" x2="790" y2="115" stroke="#c0392b" strokeWidth="7" markerEnd="url(#ahTermR)" />
      <text x="760" y="132" textAnchor="middle" fontSize="64">⚔️</text>
      <text x="760" y="234" textAnchor="middle" fontSize="36" fontWeight="700" fill="#555">對立・互相較勁</text>
    </svg>
    <div style={{ fontSize: 34, lineHeight: 1.45, color: "#555", marginTop: 22 }}>
      字源 <b>ad-</b>（朝向）＋ <b>vertere</b>（轉向）→ adversary：雙方目標「朝著彼此」而來。
    </div>
  </Default>
);

// ② 為什麼在 LLM 上需要：模型審「自己的作品」會偏心、同盲點；要換個 AI 站對立面（並換模型）才補得起來。
//    對抗＝換立場、換不同模型＝換多樣性，兩個槓桿互補（也回應「換模型 review 會更好」的社群討論）。
const P1AdvReviewLLM: Page = () => (
  <Default theme={T} title="為什麼需要讓 LLM 做對抗式審查？">
    <div style={{ fontSize: 48, fontWeight: 700, lineHeight: 1.35, marginTop: 8 }}>
      AI 出題、又自己審 →{" "}
      <span style={{ color: "#c0392b" }}>看不見自己的盲點</span>
    </div>
    <svg viewBox="0 0 1520 320" width="100%" style={{ display: "block", marginTop: 40 }}>
      <line x1="760" y1="20" x2="760" y2="300" stroke="#dce0e6" strokeWidth="2" strokeDasharray="6 8" />
      <text x="380" y="52" textAnchor="middle" fontSize="38" fontWeight="700" fill="#c0392b">❌ 同一個 AI 自己審自己</text>
      <circle cx="338" cy="178" r="90" fill="rgba(224,123,26,0.28)" stroke="#e07b1a" strokeWidth="3" />
      <circle cx="422" cy="178" r="90" fill="rgba(224,123,26,0.28)" stroke="#e07b1a" strokeWidth="3" />
      <text x="296" y="192" textAnchor="middle" fontSize="42" fontWeight="700" fill="#9a5a1a">A</text>
      <text x="464" y="192" textAnchor="middle" fontSize="42" fontWeight="700" fill="#9a5a1a">A</text>
      <text x="380" y="308" textAnchor="middle" fontSize="30" fill="#8a5a2a">同立場・同盲點 → 一起漏</text>
      <text x="1140" y="52" textAnchor="middle" fontSize="38" fontWeight="700" fill="#2e8b57">✅ 換個 AI 站對立面攻</text>
      <circle cx="1060" cy="178" r="90" fill="rgba(224,123,26,0.28)" stroke="#e07b1a" strokeWidth="3" />
      <circle cx="1220" cy="178" r="90" fill="rgba(58,110,165,0.28)" stroke="#3a6ea5" strokeWidth="3" />
      <text x="1022" y="192" textAnchor="middle" fontSize="42" fontWeight="700" fill="#9a5a1a">A</text>
      <text x="1258" y="192" textAnchor="middle" fontSize="42" fontWeight="700" fill="#2c5378">B</text>
      <text x="1140" y="308" textAnchor="middle" fontSize="30" fill="#4a7a5a">換立場・換模型 → 互相補刀</text>
    </svg>
    <div
      style={{
        backgroundColor: "rgba(224,123,26,0.12)",
        border: "2px solid #e07b1a",
        borderRadius: "1.5rem",
        padding: "16px 32px",
        fontSize: 36,
        lineHeight: 1.45,
        marginTop: 20,
      }}
    >
      對抗式審查＝請<b>另一個 AI 站到對立面</b>、專門攻破你的題；
      再<b>換一個模型</b>來當對手，盲點錯得更開。{" "}
      <span style={{ fontWeight: 700, color: "#b8650f" }}>對抗（立場）× 換模型（多樣性），互補最強。</span>
    </div>
  </Default>
);

// ③ 應用在 AI 出題審題的概念圖：出題 →(交付) 對抗者攻擊 →(攻不破) 放行；有漏洞則紅色虛線折回修。
// 靜態圖（一眼看懂、不分拍）；原生 SVG，不依賴外部圖檔。內容區 1520×700。
const P1AdvReview: Page = () => (
  <Default theme={T} title="出題審題：派 AI 攻破自己的題">
    <svg viewBox="0 0 1520 350" width="100%" style={{ display: "block", marginTop: "2rem" }}>
      <defs>
        <marker id="ahO" markerUnits="userSpaceOnUse" markerWidth="20" markerHeight="20" refX="14" refY="10" orient="auto">
          <path d="M2,2 L18,10 L2,18 Z" fill="#e07b1a" />
        </marker>
        <marker id="ahR" markerUnits="userSpaceOnUse" markerWidth="20" markerHeight="20" refX="14" refY="10" orient="auto">
          <path d="M2,2 L18,10 L2,18 Z" fill="#c0392b" />
        </marker>
        <marker id="ahG" markerUnits="userSpaceOnUse" markerWidth="20" markerHeight="20" refX="14" refY="10" orient="auto">
          <path d="M2,2 L18,10 L2,18 Z" fill="#2e8b57" />
        </marker>
      </defs>

      {/* ① 交付題目：出題 → 攻擊 */}
      <line x1="395" y1="225" x2="552" y2="225" stroke="#e07b1a" strokeWidth="5" markerEnd="url(#ahO)" />
      <text x="473" y="206" textAnchor="middle" fontSize="28" fontWeight="700" fill="#b8650f">① 交付題目</text>

      {/* ③ 攻不破 → 放行：攻擊 → 放行 */}
      <line x1="1005" y1="225" x2="1162" y2="225" stroke="#2e8b57" strokeWidth="5" markerEnd="url(#ahG)" />
      <text x="1085" y="206" textAnchor="middle" fontSize="28" fontWeight="700" fill="#2e8b57">③ 攻不破</text>

      {/* ② 有漏洞 → 折回修：攻擊 top → 出題 top（紅色虛線回饋） */}
      <path d="M 780 120 C 780 35, 210 35, 210 145" fill="none" stroke="#c0392b" strokeWidth="5" strokeDasharray="11 8" markerEnd="url(#ahR)" />
      <text x="495" y="28" textAnchor="middle" fontSize="30" fontWeight="700" fill="#c0392b">② 有漏洞 → 折回去修</text>

      {/* 節點 A：出題 */}
      <rect x="30" y="150" width="360" height="150" rx="24" fill="#fff7ee" stroke="#e07b1a" strokeWidth="4" />
      <text x="210" y="212" textAnchor="middle" fontSize="40" fontWeight="700" fill="#b8650f">出題者 ＋ AI</text>
      <text x="210" y="258" textAnchor="middle" fontSize="27" fill="#8a5a2a">做出題目・寫預期解</text>

      {/* 節點 B：對抗者攻擊 */}
      <rect x="560" y="120" width="440" height="210" rx="24" fill="#fdeeee" stroke="#c0392b" strokeWidth="4" />
      <text x="780" y="170" textAnchor="middle" fontSize="38" fontWeight="700" fill="#c0392b">對抗者 AI 分身</text>
      <text x="780" y="212" textAnchor="middle" fontSize="26" fill="#8a3a36">扮壞玩家、想方設法攻破：</text>
      <text x="780" y="258" textAnchor="middle" fontSize="28" fill="#b03a30">作弊捷徑？暴力硬解？</text>
      <text x="780" y="300" textAnchor="middle" fontSize="28" fill="#b03a30">描述洩題？反編譯外洩？</text>

      {/* 節點 C：放行 */}
      <rect x="1170" y="150" width="320" height="150" rx="24" fill="#edf7f0" stroke="#2e8b57" strokeWidth="4" />
      <text x="1330" y="212" textAnchor="middle" fontSize="40" fontWeight="700" fill="#2e8b57">✅ 放行給選手</text>
      <text x="1330" y="258" textAnchor="middle" fontSize="26" fill="#4a7a5a">攻不破才送上線</text>
    </svg>

    <div
      style={{
        backgroundColor: "rgba(224,123,26,0.12)",
        border: "2px solid #e07b1a",
        borderRadius: "1.5rem",
        marginTop: 28,
        padding: "16px 32px",
        fontSize: 34,
        lineHeight: 1.5,
      }}
    >
      <span style={{ fontWeight: 700, color: "#b8650f" }}>為什麼有效：</span>
      人對自己出的題會偏心、看不見盲點；換一個專門想「攻破」的敵對視角反覆測試，才逼得出非預期解與洩題風險。
    </div>
  </Default>
);

const P1Meme2: Page = () => (
  <MemeSlot theme={T} intent="AI 出的題，連 AI 自己都想作弊——哭笑不得 / 通靈" />
);

const P1AIAmplify: Page = () => (
  <Statement theme={T} eyebrow="一定要記得">
    <Steps>
      AI 不是取代出題者，
      <br />
      <Step>
        出完題一定要<span style={{ fontSize: 108, color: "#c45" }}>檢查</span>
        啊...
      </Step>
    </Steps>
  </Statement>
);

const P1DCChat: Page = () => (
  <Default theme={T} title="和驗題組的 DC 對話">
    <div style={{ paddingTop: 20 }}>
      <ShotSlot
        hint="與驗題組在 Discord 的對話：回報問題 → 折回去修 → 放行"
        src={SHOT_DC_VERIFY}
        h={600}
      />
    </div>
  </Default>
);

const P1Download: Page = () => (
  <Default theme={T} title="把出題技能帶回去">
    <div style={{ display: "flex", gap: 40, marginTop: 20 }}>
      <DownloadCard
        name="webchall-master"
        desc="Web／OSINT／瀏覽器端 WASM 逆向。本場 SupplyTrace、Homerun、Solivan Verify 都用它。"
        href={WEBCHALL_ZIP}
        size="170 KB"
      />
      <DownloadCard
        name="bluechall-master"
        desc="Blue Team／數位鑑識／逆向。本場 Eternal Relay 用它。"
        href={BLUECHALL_ZIP}
        size="232 KB"
      />
    </div>
    <div
      style={{
        fontSize: 38,
        color: "#555",
        marginTop: 40,
        textAlign: "center",
      }}
    >
      線上版簡報可直接點下載；解壓後放進 AI agent 的 skills 目錄就能用。
    </div>
  </Default>
);

const PART1: Page[] = [
  P1Section,
  P1WhatIsCTF,
  P1Categories,
  P1Bridge1,
  P1Lifecycle,
  // P1Lenses,
  // P1Meme1,
  P1AIIntro,
  P1AIIntro2,
  P1AINouns,
  P1Pipeline,
  P1Verify,
  P1AdvReviewTerm,
  P1AdvReviewLLM,
  P1AdvReview,
  // P1Meme2,
  P1Personas,
  P1AIAmplify,
  P1DCChat,
  P1Download,
];

// ════════════════════════ Part 2 解題實戰（四題）════════════════════════
const P2Section: Page = () => (
  <Section theme={T} title="Part 2" subtitle="解題實戰" />
);

// Part 2 總覽：四題一頁看完。每張卡＝編號＋類別＋題名（mono）＋一句核心命題；
// ④ Blue Team 用藍色，視覺上預告「攻 → 防」視角翻轉（顏色＋編號＋類別三重冗餘編碼，
// 不靠顏色單獨承載語意；設計法見 /scientific-visualization）。本頁為總覽 → 靜態、不分拍。
const P2_CHALLENGES = [
  { n: "①", cat: "OSINT", name: "SupplyTrace", concept: "沒有漏洞可打，只有線索要「串」", accent: "#e07b1a" },
  { n: "②", cat: "Web", name: "Homerun", concept: "以為藏起來，就安全了", accent: "#e07b1a" },
  { n: "③", cat: "REV / WASM", name: "Solivan Verify", concept: "靜態撈不到 → 改用動態分析", accent: "#e07b1a" },
  { n: "④", cat: "Blue Team", name: "Eternal Relay", concept: "視角翻轉：攻擊者 → 鑑識分析師", accent: "#2e7bd6" },
];

const P2Preview: Page = () => (
  <Default theme={T} title="四道題目">
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "28px 32px",
        marginTop: 4,
      }}
    >
      {P2_CHALLENGES.map((c) => (
        <div
          key={c.n}
          style={{
            border: `4px solid ${c.accent}`,
            borderRadius: 22,
            background: "#fffdf8",
            padding: "26px 36px",
            display: "flex",
            flexDirection: "column",
            gap: 10,
          }}
        >
          <div style={{ display: "flex", alignItems: "baseline", gap: 18 }}>
            <span style={{ fontSize: 60, fontWeight: 700, color: c.accent, lineHeight: 1 }}>
              {c.n}
            </span>
            <span style={{ fontSize: 46, fontWeight: 700, color: c.accent }}>{c.cat}</span>
          </div>
          <div style={{ fontFamily: MONO, fontSize: 40, fontWeight: 700, color: "#2a2a2a" }}>
            {c.name}
          </div>
          <div style={{ fontSize: 34, lineHeight: 1.4, color: "#555" }}>{c.concept}</div>
        </div>
      ))}
    </div>
  </Default>
);

// ════════════════════ Part 2a ① OSINT — SupplyTrace（線索串接）════════════════════
const P2aSection: Page = () => (
  <Section theme={T} title="① OSINT" subtitle="SupplyTrace · 線索串接" />
);

const P2aScenario: Page = () => (
  <Default theme={T} title="情境：SupplyTrace">
    <ul className="osd-list" style={{ marginTop: 8 }}>
      <li>一個推動 SDG 12（責任消費與生產）的開放資料站</li>
      <li>社群流傳一張截圖：有人「對接了非公開節點」</li>
      <li>你是調查者——從公開素材，循「對接夥伴的閱讀路徑」追進去</li>
    </ul>
  </Default>
);

const P2aEssence: Page = () => (
  <Statement theme={T} eyebrow="這題在考什麼">
    沒有漏洞可打，
    <br />
    只有線索要<span style={{ color: "#e07b1a" }}>「串」</span>。
  </Statement>
);

const P2aObjectives: Page = () => (
  <Default theme={T} title="考點">
    <ul className="osd-list" style={{ marginTop: 8 }}>
      <li>沒有傳統程式漏洞（無 SQLi／SSRF／SSTI）</li>
      <li>pivoting（線索接力）：把分散各處的線索接起來</li>
      <li>cross-source correlation：網站 × git 歷史 × 第三方 SaaS</li>
      <li>辨識「複製貼上殘留」型憑證洩漏</li>
    </ul>
  </Default>
);

const P2aWarmup: Page = () => (
  <Default theme={T} title="為什麼把它放第一題">
    <ul className="osd-list" style={{ marginTop: 8 }}>
      <li>
        門檻低、不用寫 code——瀏覽器 ＋{" "}
        <span style={{ fontFamily: MONO }}>curl</span> ＋{" "}
        <span style={{ fontFamily: MONO }}>git</span> 就能走完
      </li>
      <li>貼近生活：可以延伸談數位足跡與隱私</li>
      <li>每一步的結果都明確，失敗點清楚、容易定位除錯</li>
    </ul>
  </Default>
);

// ── writeup（11 步，低密度、絕不跳步）──
const P2aS1: Page = () => (
  <StepPage
    theme={T}
    badge="1/11"
    title="訪首頁，讀「給夥伴」的暗示"
  >
    <Mono>{`http://localhost:8088/`}</Mono>
    <ul className="osd-list" style={{ marginTop: 28 }}>
      <li>
        首頁 §Partners 寫著「給對接夥伴」「內部文件庫」「AI 輔助文書流程」
      </li>
      <li className="sub">← 在暗示：有非公開入口、有內部慣例可循</li>
    </ul>
  </StepPage>
);
const P2aS2: Page = () => (
  <StepPage
    theme={T}
    badge="2/11"
    title="直接敲 /.git/（注意尾斜線）"
  >
    <Mono>{`$ curl -s http://localhost:8088/.git/HEAD\nref: refs/heads/main`}</Mono>
    <ul className="osd-list" style={{ marginTop: 28 }}>
      <li>nginx 沒擋 /.git/，目錄列表（autoindex）把整個版控攤出來</li>
      <li className="sub">一個請求就確認漏洞 → 下一步：整包 clone 回來</li>
    </ul>
  </StepPage>
);
const P2aMemeAha: Page = () => (
  <MemeSlot
    theme={T}
    intent="恍然大悟：原來整包 .git 都被當靜態檔 serve 出來了"
  />
);

const P2aS3a: Page = () => (
  <StepPage
    theme={T}
    badge="3/11"
    title="git clone 整包歷史"
  >
    <Mono>{`$ git clone http://localhost:8088/.git supplytrace`}</Mono>
    <ul className="osd-list" style={{ marginTop: 28 }}>
      <li>
        <span style={{ fontFamily: MONO }}>.git/HEAD</span> 回 200 → dumb-HTTP
        相容，clone 直接成立
      </li>
    </ul>
  </StepPage>
);
const P2aS3b: Page = () => (
  <StepPage
    theme={T}
    badge="3/11"
    title="為什麼整個 repo 能被拉回？"
  >
    <ul className="osd-list" style={{ marginTop: 8 }}>
      <li>.git 目錄被當成「靜態檔」對外 serve，沒有任何存取控制</li>
      <li>版控歷史＝所有改過的檔案 ＋ 訊息，全都在裡面</li>
      <li className="sub">教學點：別把 .git 推到公開的網站根目錄</li>
    </ul>
  </StepPage>
);
const P2aS4: Page = () => (
  <StepPage
    theme={T}
    badge="4/11"
    title="看有哪些 branch"
  >
    <Mono>{`$ git branch -a\n* main\n  remotes/origin/internal/api-handover`}</Mono>
    <ul className="osd-list" style={{ marginTop: 28 }}>
      <li>
        main 是乾淨的；
        <span style={{ fontFamily: MONO }}>internal/api-handover</span> 才藏東西
      </li>
    </ul>
  </StepPage>
);
const P2aS5: Page = () => (
  <StepPage
    theme={T}
    badge="5/11"
    title="先讀 main 的 CONTRIBUTING.md"
  >
    <Mono>{`$ git checkout main`}</Mono>
    <ul className="osd-list" style={{ marginTop: 28 }}>
      <li>CONTRIBUTING.md 提到「交接事項在 handover branch」</li>
      <li className="sub">連這種小步也交代——這就是「不跳步」的 writeup</li>
    </ul>
  </StepPage>
);
const P2aS6: Page = () => (
  <StepPage
    theme={T}
    badge="6/11"
    title="切到 internal branch，檔案變多了"
  >
    <Mono>{`$ git checkout internal/api-handover`}</Mono>
    <ul className="osd-list" style={{ marginTop: 28 }}>
      <li>
        多出 <span style={{ fontFamily: MONO }}>CLAUDE.md</span>、
        <span style={{ fontFamily: MONO }}>SKILL.md</span>、
        <span style={{ fontFamily: MONO }}>RUNBOOK.md</span>
      </li>
      <li className="sub">「給 AI 與內部人看」的文件 → 下一步：讀 CLAUDE.md</li>
    </ul>
  </StepPage>
);
const P2aS7a: Page = () => (
  <StepPage
    theme={T}
    badge="7/11"
    title="從 CLAUDE.md 撈出 Postman 連結"
  >
    <ul className="osd-list" style={{ marginBottom: 24 }}>
      <li>CLAUDE.md 裡寫著一個 Postman 公開 workspace 的 URL</li>
    </ul>
  </StepPage>
);
const P2aS7b: Page = () => (
  <StepPage
    theme={T}
    badge="7/11"
    title="教育意義最濃的一段"
  >
    <ul className="osd-list" style={{ marginTop: 8 }}>
      <li>CLAUDE.md 還有一段「為什麼我們把 token 留在範例裡」的辯護</li>
      <li>AI 時代的新資安面：把憑證寫進「給 AI 讀的規格檔」</li>
      <li className="sub">
        可以問學生：你的 repo 有沒有夾帶 .env、截圖有沒有露 token？
      </li>
    </ul>
  </StepPage>
);
const P2aS8: Page = () => (
  <StepPage
    theme={T}
    badge="8/11"
    title="打開 Postman 公開 workspace"
  >
    <ul className="osd-list" style={{ marginTop: 8 }}>
      <li>
        免登入就能看 → 裡面有 production 與 internal-development 兩個 collection
      </li>
      <li className="sub">我們要的東西在 internal-development</li>
    </ul>
  </StepPage>
);
const P2aS9: Page = () => (
  <StepPage
    theme={T}
    badge="9/11"
    title="找 'Redeem (treasury)' 範例請求"
  >
    <ul className="osd-list" style={{ marginTop: 8 }}>
      <li>internal-development collection 裡有一個 Redeem 範例請求</li>
      <li className="sub">這就是後台兌換端點的「使用範例」</li>
    </ul>
  </StepPage>
);
const P2aS10a: Page = () => (
  <StepPage
    theme={T}
    badge="10/11"
    title="token 不在你以為的地方"
  >
    <ul className="osd-list" style={{ marginBottom: 24 }}>
      <li>
        Headers 分頁看起來空空的——Postman 把明文 Bearer 自動加密 vault 了
      </li>
    </ul>
    <Mono>{`Authorization: Bearer ••••••`}</Mono>
  </StepPage>
);
const P2aS10b: Page = () => (
  <StepPage
    theme={T}
    badge="10/11"
    title="token 藏在「說明文字」裡"
  >
    <ul className="osd-list" style={{ marginBottom: 24 }}>
      <li>
        範例請求的 description 有一段 cURL snippet → 32-hex 的 Bearer token
      </li>
      <li>nonce 藏在 url.raw（網址）裡</li>
    </ul>
    <Mono>{`Authorization: Bearer <32-hex token>\nPOST /internal/admin/<nonce>/redeem`}</Mono>
  </StepPage>
);
const P2aMemeEvil: Page = () => (
  <MemeSlot
    theme={T}
    intent="作者太壞了／這是通靈：token 不在 header，藏在『說明文字』裡"
  />
);

const P2aS10c: Page = () => (
  <StepPage
    theme={T}
    badge="10/11"
    title="為什麼會這樣漏？"
  >
    <ul className="osd-list" style={{ marginTop: 8 }}>
      <li>
        「複製貼上殘留」型洩漏——示範請求裡寫死了真 token，忘了改掉
      </li>
      <li className="sub">
        flag 的文字直接點題：
        <span style={{ fontFamily: MONO }}>pasted postman token</span>
      </li>
    </ul>
  </StepPage>
);
const P2aS11a: Page = () => (
  <StepPage
    theme={T}
    badge="11/11"
    title="帶著 token ＋ nonce 打後台"
  >
    <Mono
      size={34}
    >{`$ curl -X POST \\\n    http://localhost:8088/internal/admin/<nonce>/redeem \\\n    -H "Authorization: Bearer <32-hex token>"`}</Mono>
    <ul className="osd-list" style={{ marginTop: 28 }}>
      <li className="sub">把撿到的 nonce 填進網址、token 填進 Authorization</li>
    </ul>
  </StepPage>
);
const P2aS11b: Page = () => (
  <StepPage
    theme={T}
    badge="11/11"
    title="後端怎麼驗？對了才給 flag"
  >
    <ul className="osd-list" style={{ marginTop: 8 }}>
      <li>
        nonce 用 <span style={{ fontFamily: MONO }}>hmac.compare_digest</span>{" "}
        比對，錯 → 404
      </li>
      <li>token 須 32-hex → sha256 → 比對，錯 → 401</li>
      <li className="sub">兩關都過 → 回傳 flag（玩家視角，此處不投影）</li>
    </ul>
  </StepPage>
);

// ── 帶學生（出題幕後已暫時隱藏，見下方 block comment）──
const P2aTeach: Page = () => (
  <Default theme={T} title="如何帶學生解這題">
    <ul className="osd-list" style={{ marginTop: 8 }}>
      <li>全班一起看首頁找線索 → 引導發現 /.git/</li>
      <li>
        一起 <span style={{ fontFamily: MONO }}>git clone</span> ＋{" "}
        <span style={{ fontFamily: MONO }}>git branch -a</span>
      </li>
      <li>
        分組讀 CLAUDE.md 找 URL → 開 Postman 撿 token → 一個 curl 拿 flag
      </li>
    </ul>
  </Default>
);
const P2aPunch: Page = () => (
  <Statement theme={T} eyebrow="這題的重點概念">
    真實的資料外洩，
    <br />
    常常不是高超駭客技術，
    <br />
    而是<span style={{ color: "#e07b1a" }}>「複製貼上忘了改回去」</span>。
  </Statement>
);
// ── 出題幕後（暫時隱藏，未刪除；恢復＝解除下方 block comment ＋ 還原 PART2 陣列中對應引用）──
/*
const P2aBehind1: Page = () => (
  <Default theme={T} title="出題幕後：可控的擬真網路">
    <ul className="osd-list" style={{ marginTop: 8 }}>
      <li>OSINT 天生依賴外部資源（這題靠 Postman 公開 workspace）</li>
      <li>但自動驗題不能每次真的去建一個 Postman workspace</li>
      <li>
        解法：本機假 Postman（mock），與真實路徑共用同一份 template、同一組
        token
      </li>
      <li className="sub">→「驗過的鏈 ＝ 玩家會走的鏈」，且離線、可重現</li>
    </ul>
  </Default>
);
const P2aBehind2: Page = () => (
  <Default theme={T} title="出題幕後：不能洩題">
    <ul className="osd-list" style={{ marginTop: 8 }}>
      <li>題目描述用 grep 強制檢查（reverse blacklist）</li>
      <li>
        禁止出現{" "}
        <span style={{ fontFamily: MONO }}>
          .git／postman／OSINT／token／leak／bearer
        </span>{" "}
        等字眼
      </li>
      <li className="sub">出題的藝術：給夠線索，但不能破梗</li>
    </ul>
  </Default>
);
*/

const PART2A: Page[] = [
  P2aSection,
  P2aScenario,
  P2aEssence,
  P2aObjectives,
  P2aWarmup,
  P2aS1,
  P2aS2,
  // P2aMemeAha,
  P2aS3a,
  P2aS3b,
  P2aS4,
  P2aS5,
  P2aS6,
  P2aS7a,
  P2aS7b,
  P2aS8,
  P2aS9,
  P2aS10a,
  P2aS10b,
  // P2aMemeEvil,
  P2aS10c,
  P2aS11a,
  P2aS11b,
  P2aTeach,
  P2aPunch,
  // 出題幕後（暫時隱藏）
  // P2aBehind1,
  // P2aBehind2,
];

// ════════════════════ Part 2b ② Web — Homerun（主動攻擊）════════════════════
const P2bSection: Page = () => (
  <Section theme={T} title="② Web" subtitle="Homerun · 主動攻擊" />
);

const P2bScenario: Page = () => (
  <Default theme={T} title="情境：Homerun">
    <ul className="osd-list" style={{ marginTop: 8 }}>
      <li>一個「買一雙送一雙」的公益送鞋活動站</li>
      <li>站方深信：「沒有公開連結，就等於沒人找得到」</li>
      <li className="sub">← 這個假設，正是整題的破口</li>
    </ul>
  </Default>
);

const P2bEssence: Page = () => (
  <Statement theme={T} eyebrow="這題在打什麼">
    以為藏起來，
    <br />就<span style={{ color: "#e07b1a" }}>安全</span>了。
  </Statement>
);

const P2bChain: Page = () => (
  <Default theme={T} title="一條三段式攻擊鏈">
    <ul className="osd-list" style={{ marginTop: 8 }}>
      <li>① OpenAPI schema 洩漏（資訊洩漏 · CWE-200）</li>
      <li>② 自助提權（授權失效 · CWE-862 · OWASP Top 10 #1）</li>
      <li>③ nginx alias off-by-slash 路徑遍歷</li>
      <li className="sub">
        三段都是「設定／授權」錯誤——不用記艱深 payload，口頭就能講清為什麼中招
      </li>
    </ul>
  </Default>
);

// ── writeup（9 步）──
const P2bS1: Page = () => (
  <StepPage
    theme={T}
    badge="1/9"
    title="開首頁，聽公益送鞋的故事"
  >
    <Mono>{`http://localhost:8082/`}</Mono>
    <ul className="osd-list" style={{ marginTop: 28 }}>
      <li>先把「正常使用者看到的網站」走過一遍</li>
      <li className="sub">偵察永遠是第一步——先知道有哪些功能、哪些頁面</li>
    </ul>
  </StepPage>
);
const P2bS2: Page = () => (
  <StepPage
    theme={T}
    badge="2/9"
    title="註冊、登入一個一般會員"
  >
    <ul className="osd-list" style={{ marginTop: 8 }}>
      <li>註冊與登入要先 GET 表單頁拿 CSRF token，再帶 token POST</li>
      <li className="sub">連「先拿 CSRF token」這種小步也照樣交代清楚</li>
      <li className="sub">目的：先有一個「低權限身分」，等下從這裡往上爬</li>
    </ul>
  </StepPage>
);
const P2bS3: Page = () => (
  <StepPage
    theme={T}
    badge="3/9"
    title="以會員身分留言，確認自己很弱"
  >
    <ul className="osd-list" style={{ marginTop: 8 }}>
      <li>用 member 身分留言成功 → 確認目前是「一般會員」權限</li>
      <li className="sub">先確立「我現在能做什麼、不能做什麼」，提權才有對照</li>
    </ul>
  </StepPage>
);
const P2bS4a: Page = () => (
  <StepPage
    theme={T}
    badge="4/9"
    title="啊哈點 ①：要一份 API 地圖"
  >
    <Mono>{`$ curl -s http://localhost:8082/api/openapi.json`}</Mono>
    <ul className="osd-list" style={{ marginTop: 28 }}>
      <li>整份 API schema（所有端點）一次攤在眼前</li>
    </ul>
  </StepPage>
);
const P2bS4b: Page = () => (
  <StepPage
    theme={T}
    badge="4/9"
    title="為什麼這份地圖會外洩？"
  >
    <ul className="osd-list" style={{ marginTop: 8 }}>
      <li>
        FastAPI／Swagger 預設就會開{" "}
        <span style={{ fontFamily: MONO }}>/openapi.json</span> 與 docs
      </li>
      <li>沒人連到 ≠ 不存在——它一直在那裡（CWE-200 資訊洩漏）</li>
      <li className="sub">真實世界超高頻：上線忘了關 API 文件</li>
    </ul>
  </StepPage>
);
const P2bS4c: Page = () => (
  <StepPage
    theme={T}
    badge="4/9"
    title="地圖上有一個不該給你的端點"
  >
    <Mono>{`POST /api/admin/promote/{user_id}`}</Mono>
    <ul className="osd-list" style={{ marginTop: 28 }}>
      <li>schema 裡有個「把使用者升成 admin」的端點</li>
      <li className="sub">下一步：試試看一般會員能不能直接呼叫它</li>
    </ul>
  </StepPage>
);
const P2bMemeMap: Page = () => (
  <MemeSlot
    theme={T}
    intent="恍然大悟：整張 API 地圖（含後台端點）被一次攤開"
  />
);

const P2bS5a: Page = () => (
  <StepPage
    theme={T}
    badge="5/9"
    title="自助提權：把自己升成 admin"
  >
    <Mono
      size={34}
    >{`$ curl -X POST \\\n    http://localhost:8082/api/admin/promote/<my_id> \\\n    -H "Cookie: session=<member session>"`}</Mono>
  </StepPage>
);
const P2bS5b: Page = () => (
  <StepPage
    theme={T}
    badge="5/9"
    title="為什麼一般會員打得動後台？"
  >
    <ul className="osd-list" style={{ marginTop: 8 }}>
      <li>
        這個端點漏掉了 <span style={{ fontFamily: MONO }}>require_admin</span>{" "}
        的權限檢查
      </li>
      <li>於是任何登入的會員，都能呼叫它把自己升成 admin</li>
      <li className="sub">授權失效（CWE-862）——OWASP Top 10 2021 排名第一</li>
    </ul>
  </StepPage>
);
const P2bS5c: Page = () => (
  <StepPage
    theme={T}
    badge="5/9"
    title="role 從 member 變 admin 的瞬間"
  >
    <Mono>{`{ "id": <my_id>, "role": "admin" }`}</Mono>
    <ul className="osd-list" style={{ marginTop: 28 }}>
      <li>
        <span style={{ fontFamily: MONO }}>role</span> 從 member 變成
        admin——一個請求就完成
      </li>
    </ul>
  </StepPage>
);
const P2bMemeAdmin: Page = () => (
  <MemeSlot theme={T} intent="作弊爽感：一個 curl，member 秒變 admin" />
);

const P2bS6: Page = () => (
  <StepPage
    theme={T}
    badge="6/9"
    title="驗證提權真的有用"
  >
    <ul className="osd-list" style={{ marginTop: 8 }}>
      <li>
        升權前：<span style={{ fontFamily: MONO }}>/sales</span> 對非 admin
        是擋的（403）
      </li>
      <li>
        升權後：同一個 <span style={{ fontFamily: MONO }}>/sales</span> 通了
      </li>
      <li className="sub">確認手上的 admin 是「真的能用」的，再往下走</li>
    </ul>
  </StepPage>
);
const P2bS7a: Page = () => (
  <StepPage
    theme={T}
    badge="7/9"
    title="啊哈點 ②：在網址上動手腳"
  >
    <Mono>{`GET /sales../meetings/2026-Q1-africa-expansion.md`}</Mono>

    <ul className="osd-list" style={{ marginTop: 28 }}>
      <li>
        用 <span style={{ fontFamily: MONO }}>/sales..</span>{" "}
        跳出原本的目錄，讀到內部會議檔
      </li>
      <li className="sub">這一步只是「示範遍歷原語」——還沒拿到 flag</li>
    </ul>
  </StepPage>
);
const P2bS7b: Page = () => (
  <StepPage
    theme={T}
    badge="7/9"
    title="一個尾斜線的差別"
  >
    <Mono
      size={32}
    >{`location /sales            ← 無尾斜線\nalias    /srv/internal/sales/   ← 有尾斜線\n\n/sales../flag.txt\n  → /srv/internal/sales/../flag.txt\n  → /srv/internal/flag.txt   ✗ 跳出去了`}</Mono>
    <ul className="osd-list" style={{ marginTop: 22 }}>
      <li className="sub">
        nginx 著名設定陷阱：location 與 alias 尾斜線錯位 → 路徑遍歷
      </li>
    </ul>
  </StepPage>
);
const P2bS8: Page = () => (
  <StepPage
    theme={T}
    badge="8/9"
    title="遍歷落地頁，把內部目錄看光"
  >
    <ul className="osd-list" style={{ marginTop: 8 }}>
      <li>遍歷到內部目錄根，落地頁列出裡面所有檔案</li>
      <li>
        清單裡指出 <span style={{ fontFamily: MONO }}>flag.txt</span> 的位置
      </li>
      <li className="sub">
        注意：flag 在獨立的 flag.txt——會議檔只是「示範遍歷」的中繼，不是終點
      </li>
    </ul>
  </StepPage>
);
const P2bS9: Page = () => (
  <StepPage
    theme={T}
    badge="9/9"
    title="讀出那一格 flag.txt"
  >
    <Mono>{`GET /sales../flag.txt`}</Mono>
    <ul className="osd-list" style={{ marginTop: 28 }}>
      <li>同一招遍歷，這次直接讀內部目錄根下的 flag.txt</li>
      <li className="sub">
        flag 字面 b0g0＝Buy One Get One，呼應送鞋故事（玩家視角，不投影明文）
      </li>
    </ul>
  </StepPage>
);

// ── 帶學生（出題幕後已暫時隱藏，見下方 block comment）──
const P2bTeach: Page = () => (
  <Default theme={T} title="如何帶學生解這題">
    <ul className="osd-list" style={{ marginTop: 8 }}>
      <li>開站講送鞋故事 → 點出兩個錯誤的安全假設</li>
      <li>打開 openapi.json，讓學生看「地圖被攤開」</li>
      <li>
        當場 curl promote →{" "}
        <span style={{ fontFamily: MONO }}>role: admin</span> 出現的瞬間最有戲
      </li>
      <li>
        示範遍歷讀 flag → 最後跑 solve.py 看「出題者怎麼自動驗題」
      </li>
    </ul>
  </Default>
);
const P2bPunch: Page = () => (
  <Statement theme={T} eyebrow="這題的重點概念">
    藏起來，
    <br />
    <span style={{ color: "#e07b1a" }}>不等於</span>安全。
  </Statement>
);
// ── 出題幕後（暫時隱藏，未刪除；恢復方式同上）──
/*
const P2bBehind: Page = () => (
  <Default theme={T} title="出題幕後：最具體的 audit 紀錄">
    <ul className="osd-list" style={{ marginTop: 8 }}>
      <li>
        完整的 stages ledger，每階段都留 audit_verdict 與具體 notes
      </li>
      <li>
        4 個 persona
        平行對抗審查：scoundrel／lazy-developer／confused-developer／confused-player
      </li>
      <li className="sub">
        其中一階段「採納了 6 個 Critical 修正」——出題不是一次到位，是反覆找碴
      </li>
    </ul>
  </Default>
);
*/
const P2bDemoRisk: Page = () => (
  <Default theme={T} title="現場 demo 的小提醒">
    <ul className="osd-list" style={{ marginTop: 8 }}>
      <li>
        register／login 各有獨立的{" "}
        <span style={{ fontFamily: MONO }}>5 次 / 5 分鐘</span> 限流桶
      </li>
      <li>連跑幾次 solve.py 會撞 429</li>
      <li className="sub">
        對策：demo 前{" "}
        <span style={{ fontFamily: MONO }}>docker compose restart api</span>{" "}
        清乾淨
      </li>
    </ul>
  </Default>
);

const PART2B: Page[] = [
  P2bSection,
  P2bScenario,
  P2bEssence,
  P2bChain,
  P2bS1,
  P2bS2,
  P2bS3,
  P2bS4a,
  P2bS4b,
  P2bS4c,
  // P2bMemeMap,
  P2bS5a,
  P2bS5b,
  P2bS5c,
  // P2bMemeAdmin,
  P2bS6,
  P2bS7a,
  P2bS7b,
  P2bS8,
  P2bS9,
  P2bTeach,
  P2bPunch,
  // 出題幕後（暫時隱藏）
  // P2bBehind,
  P2bDemoRisk,
];

// ════════════════ Part 2c ③ REV／WASM — Solivan Verify（動態分析）════════════════
const P2cSection: Page = () => (
  <Section theme={T} title="③ REV／WASM" subtitle="Solivan Verify · 動態分析" />
);

const P2cScenario: Page = () => (
  <Default theme={T} title="情境：Solivan Verify">
    <ul className="osd-list" style={{ marginTop: 8 }}>
      <li>一張 SDG 主題的 2D 像素 RPG 地圖，要跑三項永續驗證</li>
      <li>系統「全程靜默」：做對做錯都不回應</li>
      <li>
        地圖上有塊金色「封閉現場」，看得到、走得近，
        <span style={{ color: "#e07b1a" }}>就是走不進去</span>
      </li>
    </ul>
  </Default>
);

const P2cEssence: Page = () => (
  <Statement theme={T} eyebrow="這題在玩什麼">
    走不進去的牆，
    <br />
    用記憶體把它<span style={{ color: "#e07b1a" }}>「推開」</span>。
  </Statement>
);

const P2cWasm: Page = () => (
  <Default theme={T} title="WASM 為什麼有趣">
    <ul className="osd-list" style={{ marginTop: 8 }}>
      <li>
        WebAssembly＝編譯後的二進位，
        <span style={{ fontFamily: MONO }}>strings／wasm2wat</span>{" "}
        只看到框架痕跡
      </li>
      <li>但它活在瀏覽器裡——記憶體完全攤在 DevTools 面前</li>
      <li className="sub">「難靜態反編譯、易動態分析」的最佳教材</li>
    </ul>
  </Default>
);

const P2cMethod: Page = () => (
  <Default theme={T} title="這題在考什麼">
    <ul className="osd-list" style={{ marginTop: 8 }}>
      <li>
        client-side trust 的反例：封閉區只靠「前端碰撞檢查」把關（CWE-693）
      </li>
      <li>
        位置加密用 WASM 內的 RSA-OAEP（不是瀏覽器 crypto.subtle）→ 逼你真的去碰
        WASM
      </li>
      <li className="sub">核心方法論：靜態分析撈不到 → 改用動態分析</li>
    </ul>
  </Default>
);

// ── writeup（9 步，console script demo 路徑）──
const P2cS1: Page = () => (
  <StepPage
    theme={T}
    badge="1/9"
    title="先把三項 SDG 驗證答對"
  >
    <ul className="osd-list" style={{ marginTop: 8 }}>
      <li>地圖上跑 SDG 6／7／13 三題問答，答對 3 題</li>
      <li className="sub">
        題庫共 150 題、5 張隨機地圖——反 speedrun，不能事先背答案
      </li>
    </ul>
  </StepPage>
);
const P2cS2: Page = () => (
  <StepPage
    theme={T}
    badge="2/9"
    title="最後一關：走不進那塊金色的地"
  >
    <ul className="osd-list" style={{ marginTop: 8 }}>
      <li>最後一筆簽核非得在封閉區內完成</li>
      <li>但方向鍵怎麼走，都停在牆外一格</li>
      <li className="sub">通行證一核發只有 120 秒——時間壓力</li>
    </ul>
  </StepPage>
);
const P2cMemeFrustrate: Page = () => (
  <MemeSlot theme={T} intent="覺得自己太笨／作者太壞：方向鍵怎麼按都進不去" />
);

const P2cS3: Page = () => (
  <StepPage
    theme={T}
    badge="3/9"
    title="為什麼走不進去？"
  >
    <ul className="osd-list" style={{ marginTop: 8 }}>
      <li>
        封閉區是 1×1 單格，碰撞檢查刻意寫成 off-by-one（邊界差一格）
      </li>
      <li>於是你永遠卡在牆外一格——一道「幽靈牆」(phantom wall)</li>
      <li className="sub">這不是 bug，是出題者埋的刻意線索</li>
    </ul>
  </StepPage>
);
const P2cS4: Page = () => (
  <StepPage
    theme={T}
    badge="4/9"
    title="靜態分析：什麼都撈不到"
  >
    <Mono>{`$ strings wasm_game_bg.wasm | grep -i flag\n(無)`}</Mono>
    <ul className="osd-list" style={{ marginTop: 28 }}>
      <li>strings／wasm2wat 只看到 Rust crate 路徑，沒有答案</li>
      <li className="sub">製造懸念：那答案到底在哪？→ 換動態分析</li>
    </ul>
  </StepPage>
);
const P2cMemeStatic: Page = () => (
  <MemeSlot
    theme={T}
    intent="通靈：strings | grep flag 什麼都沒有，這是要我通靈嗎"
  />
);

const P2cS5: Page = () => (
  <StepPage
    theme={T}
    badge="5/9"
    title="F12 開 console，把 WASM 攤開"
  >
    <Mono
      size={34}
    >{`> Object.keys(window.__GAME_WASM__)   // 列出 WASM exports\n> window.__GAME_MEMORY__               // WebAssembly.Memory（記憶體攤開）`}</Mono>
    <ul className="osd-list" style={{ marginTop: 24 }}>
      <li className="sub">前端載入時就把 WASM 與記憶體掛到 window，不用裝任何擴充</li>
    </ul>
  </StepPage>
);
const P2cS6: Page = () => (
  <StepPage
    theme={T}
    badge="6/9"
    title="它一直在偷偷印自己的座標"
  >
    <Mono>{`[pos] x=12 y=34      // 每個 frame 印出當前座標`}</Mono>
    <ul className="osd-list" style={{ marginTop: 28 }}>
      <li>console 持續印當前 (x, y) → 我們知道「現在的值」是多少</li>
      <li className="sub">有了已知值，就能在記憶體裡反查它的位址</li>
    </ul>
  </StepPage>
);
const P2cS7: Page = () => (
  <StepPage
    theme={T}
    badge="7/9"
    title="掃描記憶體，收斂到座標的位址"
  >
    <Mono
      size={34}
    >{`> const mem = new Int32Array(window.__GAME_MEMORY__.buffer)\n> // 掃 mem 找出值 = 當前 x 的位址；走一格再掃；交集收斂`}</Mono>
    <ul className="osd-list" style={{ marginTop: 24 }}>
      <li className="sub">
        3–4 次掃描就能定位 player_x／player_y 的 offset——這就是 Cheat Engine
        的精神
      </li>
    </ul>
  </StepPage>
);
const P2cS8: Page = () => (
  <StepPage
    theme={T}
    badge="8/9"
    title="改一個數字，角色瞬移進去"
  >
    <Mono
      size={34}
    >{`> mem[player_x_offset] = <封閉區 x>\n> mem[player_y_offset] = <封閉區 y>`}</Mono>
    <ul className="osd-list" style={{ marginTop: 24 }}>
      <li>角色當場瞬移進封閉區 → HUD 變「通行證已核發」</li>
      <li className="sub">
        WASM 自動把（加密的）座標送給後端 → server 唯一一次簽 JWT，寫進{" "}
        <span style={{ fontFamily: MONO }}>window.__GAME_PASS__</span>
      </li>
    </ul>
  </StepPage>
);
const P2cMemeTeleport: Page = () => (
  <MemeSlot
    theme={T}
    intent="恍然大悟＋爽：改一個數字，角色直接瞬移進金色封閉區"
  />
);

const P2cS9: Page = () => (
  <StepPage
    theme={T}
    badge="9/9"
    title="按 E，換出 flag"
  >
    <ul className="osd-list" style={{ marginTop: 8 }}>
      <li>在封閉區按 E → 前端 flag-terminal.js 算出 proof（sha256）</li>
      <li>
        帶著 JWT ＋ proof 打{" "}
        <span style={{ fontFamily: MONO }}>POST /api/flag</span> → console 印出
        flag
      </li>
      <li className="sub">
        JWT 只活 120 秒、alg=none 會被拒——雙重把關（玩家視角，不投影明文）
      </li>
    </ul>
  </StepPage>
);

const P2cPunch: Page = () => (
  <Statement theme={T} eyebrow="這題的重點概念">
    跑在使用者瀏覽器裡的驗證，
    <br />
    永遠<span style={{ color: "#e07b1a" }}>不能信任</span>。
  </Statement>
);
const P2cTeach: Page = () => (
  <Default theme={T} title="如何帶學生解這題">
    <ul className="osd-list" style={{ marginTop: 8 }}>
      <li>視覺化、遊戲化：不是枯燥的 ELF，是會動的 SDG 像素 RPG</li>
      <li>
        即時回饋：改一個數字，角色就瞬移——把 Cheat Engine 搬到瀏覽器
      </li>
      <li>連結日常：為什麼線上遊戲會被外掛？因為前端不能信任</li>
      <li className="sub">
        （正規工具是 Cetus 擴充；現場我們用 console script，免裝、節奏更穩）
      </li>
    </ul>
  </Default>
);
// ── 出題幕後（暫時隱藏，未刪除；恢復方式同上）──
/*
const P2cBehind: Page = () => (
  <Default theme={T} title="出題幕後：最有說服力的故事">
    <ul className="osd-list" style={{ marginTop: 8 }}>
      <li>
        扮 brute-forcer 的 AI 找到致命缺陷：答案曾被放進玩家可讀的 JSON →
        可秒解（F-8）
      </li>
      <li>
        第一次修補（答案搬進 WASM 表）→ 扮 tool-grep-solver 的 AI 用一條 regex
        就還原 → 判定無效
      </li>
      <li className="sub">
        最終逼出整個架構重構（改成 RSA-OAEP ＋ server 端題庫）——AI
        出題是對抗式迭代，不是一次生成
      </li>
    </ul>
  </Default>
);
*/
const P2cDemoRisk: Page = () => (
  <Default theme={T} title="現場 demo 的小提醒">
    <ul className="osd-list" style={{ marginTop: 8 }}>
      <li>JWT 只活 120 秒——先把 offset 找好、或一鍵 script 到位</li>
      <li>舊頁面快取會卡 → 用無痕新分頁</li>
      <li className="sub">
        保底：跑 blackbox 的 exploit.py 直接送密文，0.2 秒秒出
        flag（少了現場手動操作的過程，但保證可動）
      </li>
    </ul>
  </Default>
);

const PART2C: Page[] = [
  P2cSection,
  P2cScenario,
  P2cEssence,
  P2cWasm,
  P2cMethod,
  P2cS1,
  P2cS2,
  // P2cMemeFrustrate,
  P2cS3,
  P2cS4,
  // P2cMemeStatic,
  P2cS5,
  P2cS6,
  P2cS7,
  P2cS8,
  // P2cMemeTeleport,
  P2cS9,
  P2cPunch,
  P2cTeach,
  // 出題幕後（暫時隱藏）
  // P2cBehind,
  P2cDemoRisk,
];

// ════════════ Part 2d ④ Blue Team — Eternal Relay（數位鑑識 · 銜接防禦）════════════
const P2dSection: Page = () => (
  <Section theme={T} title="④ Blue Team" subtitle="Eternal Relay · 數位鑑識" />
);

const P2dScenario: Page = () => (
  <Default theme={T} title="情境：Eternal Relay">
    <ul className="osd-list" style={{ marginTop: 8 }}>
      <li>某夜內部監測在 SPAN 港側錄到三段可疑訊號</li>
      <li>三段來自三台不同主機，卻都指向同一個內網位址</li>
      <li>鑑識小組另從一台受影響工作站，取回一份 Windows 執行檔</li>
    </ul>
  </Default>
);

const P2dFlip: Page = () => (
  <Statement theme={T} eyebrow="視角的轉折">
    這一次，
    <br />
    你是<span style={{ color: "#e07b1a" }}>藍隊</span>。
  </Statement>
);

const P2dEssence: Page = () => (
  <Default theme={T} title="你不是攻擊者，是鑑識分析師">
    <ul className="osd-list" style={{ marginTop: 8 }}>
      <li>不是發動攻擊——是「事後鑑識」，重建攻擊者做了什麼</li>
      <li>素材＝三份 PCAP（側錄流量）＋ 一份取回的執行檔</li>
      <li className="sub">這正是真實 SOC／DFIR 的工作模式</li>
    </ul>
  </Default>
);

const P2dSkills: Page = () => (
  <Default theme={T} title="要同時動用三條技能線">
    <Cards>
      <Card
        title="PE 靜態結構"
        body="看 section table、抓 .rdata、認 C++ name mangling"
      />
      <Card
        title="PCAP / 自訂協定"
        body="取 TCP payload、逆向 binary frame 格式"
      />
      <Card
        title="對稱密碼學"
        body="ChaCha20、stream cipher、known-plaintext oracle"
      />
    </Cards>
    <div
      style={{
        fontSize: 38,
        color: "#555",
        marginTop: 36,
        textAlign: "center",
      }}
    >
      工具全是 OSS；不需商用 RE 工具、不需執行 PE、不需暴力。
    </div>
  </Default>
);

// ── writeup（四步鑑識契約）──
const P2dS1a: Page = () => (
  <StepPage
    theme={T}
    badge="1/4"
    title="先 triage 那份執行檔"
  >
    <Mono>{`$ strings relay.exe | grep -E "relay|crypto|SMB2"`}</Mono>
    <ul className="osd-list" style={{ marginTop: 28 }}>
      <li>
        用 pefile 載入 relay.exe，定位{" "}
        <span style={{ fontFamily: MONO }}>.rdata</span>（常數材料區）
      </li>
    </ul>
  </StepPage>
);
const P2dS1b: Page = () => (
  <StepPage
    theme={T}
    badge="1/4"
    title="符號表沒被 strip——線索全露了"
  >
    <Mono size={34}>{`relay::crypto::K\nderive_nonce\nchacha20_encrypt`}</Mono>
    <ul className="osd-list" style={{ marginTop: 24 }}>
      <li>mangled symbol 直接告訴你：用的是 ChaCha20，金鑰叫 K</li>
      <li className="sub">未 strip 的符號表，本身就是鑑識的禮物</li>
    </ul>
  </StepPage>
);
const P2dS1c: Page = () => (
  <StepPage
    theme={T}
    badge="1/4"
    title="別被假 IOC 帶著走"
  >
    <ul className="osd-list" style={{ marginBottom: 22 }}>
      <li>
        PE 裡還有一排 SMB banner：NEGOTIATE／NTLM relay／TREE_CONNECT
        IPC$／WRITE
      </li>
      <li>看起來像 SMB 橫向移動（呼應題名 Eternal）</li>
    </ul>
    <Mono size={34}>{`但它們是空的 stub——沒有任何遠端呼叫實作`}</Mono>
    <ul className="osd-list" style={{ marginTop: 22 }}>
      <li className="sub">
        真正的資料外傳走自訂 TCP frame。教藍隊：追真資料流，別追裝飾
      </li>
    </ul>
  </StepPage>
);
const P2dMemeFakeIOC: Page = () => (
  <MemeSlot
    theme={T}
    intent="作者太壞：一排 SMB banner 全是裝飾，真的資料流藏在別處"
  />
);

const P2dS2a: Page = () => (
  <StepPage
    theme={T}
    badge="2/4"
    title="把三份 PCAP 切成 frame"
  >
    <Mono
      size={30}
    >{`magic 0xC2C2 切 frame：\n[2B magic][1B index][1B total][12B nonce][2B len BE][N B 密文]`}</Mono>
    <ul className="osd-list" style={{ marginTop: 22 }}>
      <li className="sub">
        tshark／scapy 取 TCP payload，照這個格式拆開每個 frame
      </li>
    </ul>
  </StepPage>
);
const P2dS2b: Page = () => (
  <StepPage
    theme={T}
    badge="2/4"
    title="檔名順序，不是重組順序"
  >
    <Mono
      size={32}
    >{`host_a.pcap   MAC 02:aa:..   chunk_index = 2\nhost_b.pcap   MAC 02:bb:..   chunk_index = 0\nhost_c.pcap   MAC 02:cc:..   chunk_index = 1`}</Mono>
    <ul className="osd-list" style={{ marginTop: 22 }}>
      <li className="sub">
        a/b/c 的檔名順序，與 chunk_index（2/0/1）刻意不重合 → 必須依 index 排
      </li>
    </ul>
  </StepPage>
);
const P2dS3a: Page = () => (
  <StepPage
    theme={T}
    badge="3/4"
    title="nonce 是從 source MAC 長出來的"
  >
    <Mono size={34}>{`12B nonce = 00 00 00 00 │ <6B source MAC> │ 00 00`}</Mono>
    <ul className="osd-list" style={{ marginTop: 24 }}>
      <li>每台主機的 nonce 都能從它的 MAC 推出來</li>
      <li className="sub">看懂這條規律，就能對每段各自還原 keystream</li>
    </ul>
  </StepPage>
);
const P2dS3b: Page = () => (
  <StepPage
    theme={T}
    badge="3/4"
    title="用「已知開頭」把金鑰逼出來"
  >
    <Mono
      size={30}
    >{`chunk_index==0 的明文 必以 "ISIP" 起首   ← crib（已知明文）\n對 .rdata 跑 32-byte sliding window：\n  解密前 4 bytes == b"ISIP" ? → 命中\n→ 命中 .rdata offset 64，取得 ChaCha20 金鑰`}</Mono>
  </StepPage>
);
const P2dMemeKeyHit: Page = () => (
  <MemeSlot
    theme={T}
    intent="恍然大悟：sliding window 在 .rdata offset 64 命中金鑰的瞬間"
  />
);

const P2dS3c: Page = () => (
  <StepPage
    theme={T}
    badge="3/4"
    title="counter 不是 0，是 1"
  >
    <Mono
      size={34}
    >{`⚠ initial_counter = 1   （不是 RFC 8439 預設的 0）\n   solver 端用 cipher.seek(64) 對應`}</Mono>
    <ul className="osd-list" style={{ marginTop: 24 }}>
      <li className="sub">用預設 counter=0 解出來會是亂碼——這一格差別卡死很多人</li>
    </ul>
  </StepPage>
);
const P2dS4: Page = () => (
  <StepPage
    theme={T}
    badge="4/4"
    title="解密、依序拼回，flag 現形"
  >
    <Mono
      size={34}
    >{`B(0) → C(1) → A(2)  依 chunk_index 排序\n→ 串接 → rstrip \\x00 → 過 FLAG_REGEX`}</Mono>
    <ul className="osd-list" style={{ marginTop: 24 }}>
      <li>三段各自 ChaCha20 解密，依 index 拼回一條明文</li>
      <li className="sub">flag 重組完成（玩家視角，不投影明文）</li>
    </ul>
  </StepPage>
);

// ── 帶學生 + 防禦銜接（出題幕後已暫時隱藏，見下方 block comment）──
const P2dTeach: Page = () => (
  <Default theme={T} title="如何帶學生解這題">
    <ul className="osd-list" style={{ marginTop: 8 }}>
      <li>適合進階學生／資安社團：要同時動用 PE、PCAP、密碼學三條線</li>
      <li>零基礎設施：離線 PCAP ＋ 執行檔，發下去就能練</li>
      <li>帶法：先一起 strings 找線索 → 分組拆 frame → 一起算金鑰</li>
      <li className="sub">
        卡關引導：先點破「假 SMB 是裝飾」，再提示「counter 不是 0」
      </li>
    </ul>
  </Default>
);
const P2dDefenseValue: Page = () => (
  <Default theme={T} title="這題就是翻轉的重點">
    <ul className="osd-list" style={{ marginTop: 8 }}>
      <li>
        要還原攻擊，你得先懂攻擊——怎麼拆片、用 MAC 衍生 nonce、把 key 藏進
        binary
      </li>
      <li>但題目刻意把「攻擊裝飾（假 SMB）」和「真資料流」分開</li>
      <li className="sub">
        訓練分析者：把 offensive 知識，翻轉成 defensive 判斷力
      </li>
    </ul>
  </Default>
);
// ── 出題幕後（暫時隱藏，未刪除；恢復方式同上）──
/*
const P2dBehind: Page = () => (
  <Default theme={T} title="出題幕後：被獨立 AI 盲測過">
    <ul className="osd-list" style={{ marginTop: 8 }}>
      <li>七階段 pipeline，每階段一個 commit（git SHA 鏈可佐證）</li>
      <li>最後一階段派 ctf-solver 盲測：只給玩家素材、10 分鐘解出</li>
      <li>並記錄數條死胡同（全 XOR、不排序串接、counter 試 0/2/3…）</li>
      <li className="sub">
        scoundrel 防線：任何 frame 若含明文 ISIP 直接 fail-fast → 確保沒洩 flag
      </li>
    </ul>
  </Default>
);
*/
const P2dBridge: Page = () => (
  <Default theme={T} title="從這裡，走向藍隊靶場">
    <ul className="osd-list" style={{ marginTop: 8 }}>
      <li>這題零基礎設施：離線 PCAP ＋ PE，研習場地直接能跑</li>
      <li>
        但它涵蓋的技能——network forensics、binary triage、crypto
        recovery、multi-source correlation
      </li>
      <li className="sub">
        正是 CyberRange 藍隊演練的核心模組 → 先建鑑識直覺，再進動態事件應變
      </li>
    </ul>
  </Default>
);

const PART2D: Page[] = [
  P2dSection,
  P2dScenario,
  // P2dFlip,  // 刪頁
  P2dEssence,
  P2dSkills,
  P2dS1a,
  P2dS1b,
  P2dS1c,
  // P2dMemeFakeIOC,
  P2dS2a,
  P2dS2b,
  P2dS3a,
  P2dS3b,
  // P2dMemeKeyHit,
  P2dS3c,
  P2dS4,
  // P2dTeach,  // 刪頁
  // P2dDefenseValue,  // 刪頁
  // 出題幕後（暫時隱藏）
  // P2dBehind,
  P2dBridge,
];

// ════════════════ Part 3 藍隊靶場 — HITCON CyberRange ════════════════
const P3Section: Page = () => (
  <Section theme={T} title="Part 3" subtitle="藍隊靶場 · CyberRange" />
);

const P3Banner: Page = () => (
  <DeckPage theme={T} showPageNumber>
    <div
      style={{
        position: "absolute",
        top: 250,
        left: 134,
        width: 1651,
        height: 560,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 2,
      }}
    >
      <img
        src={CYBERRANGE_BANNER}
        alt="HITCON CyberRange 2026"
        style={{
          maxWidth: "100%",
          maxHeight: "100%",
          objectFit: "contain",
          borderRadius: 16,
        }}
      />
    </div>
    <div
      style={{
        position: "absolute",
        bottom: 90,
        left: 134,
        width: 1651,
        textAlign: "center",
        fontSize: 32,
        color: "#777",
        zIndex: 2,
      }}
    >
      HITCON CyberRange 2026 主視覺 · 來源：KKTIX 官方活動頁
    </div>
  </DeckPage>
);

const P3What: Page = () => (
  <Default theme={T} title="CyberRange 是什麼">
    <ul className="osd-list" style={{ marginTop: 8 }}>
      <li>
        以「資安事件應變」為核心的企業
        <span style={{ color: "#e07b1a", fontWeight: 700 }}>藍隊</span>競賽 /
        網路靶場
      </li>
      <li>高擬真環境，模擬企業遭複雜攻擊</li>
      <li>
        參賽隊扮演企業內部 IR 團隊，從大量告警與日誌找出攻擊者足跡並應變
      </li>
      <li className="sub" style={{ marginLeft: "2rem" }}>
        被定位為「臺灣難度最高的藍隊資安競賽之一」</li>
    </ul>
  </Default>
);

const P3Orgs: Page = () => (
  <Default theme={T} title="誰辦的">
    <ul className="osd-list" style={{ marginTop: 8 }}>
      <li>指導：數位發展部數位產業署（moda）</li>
      <li>主辦：台灣駭客協會 ＋ 工業技術研究院</li>
      <li>2026 協辦：TRAPA Security</li>
      <li className="sub">
        賽制：全球線上初賽 ＋ 台北線下決賽；每隊最多 4 人、需同一組織
      </li>
    </ul>
  </Default>
);

const P3Features: Page = () => (
  <Default theme={T} title="它在練什麼">
    <ul className="osd-list" style={{ marginTop: 8 }}>
      <li>
        依 MITRE ATT&amp;CK 重現真實攻擊組織（如 APT41）的完整攻擊鏈
      </li>
      <li>
        分析 traffic／server 與 endpoint logs／detection events，找出 IOC
      </li>
      <li>
        兩大題型：① 事件調查（找關鍵 IOC）②
        事件應對（寫指令／規則，系統自動驗證）
      </li>
      <li className="sub">
        強制跨職能團隊：IT／網管、DC 管理員、AP 管理員、SOC／IR／鑑識
      </li>
    </ul>
  </Default>
);

const P3Compare: Page = () => (
  <Default theme={T} title="CTF 與 CyberRange 的差別">
    <Cards>
      <Card
        title="傳統 CTF"
        accent="#9aa3ad"
        body={
          <>
            個別解題、搶 flag
            <br />
            個人 · 攻擊視角
            <br />
            單一題目附件
            <br />
            評分＝flag 對錯
          </>
        }
      />
      <Card
        title="HITCON CyberRange"
        body={
          <>
            企業環境中調查＋應變整起事件
            <br />
            IR 藍隊 · 貼近真實 SOC
            <br />
            全套 traffic／logs／detection
            <br />
            評分＝調查正確 ＋ 補救由系統驗證 ＋ 時間
          </>
        }
      />
    </Cards>
  </Default>
);

const P3Student: Page = () => (
  <Statement theme={T} eyebrow="這條線，直接連到你的學生">
    CyberRange 有「學生場」，
    <br />與 <span style={{ color: "#e07b1a" }}>ISIP</span> 合辦。
    <div
      style={{
        fontSize: 40,
        fontWeight: 400,
        color: "#555",
        marginTop: 56,
        lineHeight: 1.6,
      }}
    >
      「解完這題我學會超多 wireshark 技能，而且也看到攻擊時的樣貌」
      <div style={{ fontSize: 28, color: "#888", marginTop: 18 }}>
        —— 我帶的學生
      </div>
    </div>
  </Statement>
);

const P3StudentNote: Page = () => (
  <Default theme={T} title="而這場研習，正是 ISIP 體系">
    <ul className="osd-list" style={{ marginTop: 8 }}>
      <li>
        學生在貼近實戰的環境學：修補漏洞、強化防禦、團隊應變、分析複雜日誌
      </li>
      <li>
        本研習主辦正是 ISIP（教育部高中資安計畫）——你的學生，正站在這條線的起點
      </li>
    </ul>
  </Default>
);

const P3Path: Page = () => (
  <Default theme={T} title="一條真實的成長路徑">
    <ul className="osd-list" style={{ marginTop: 8 }}>
      <li>
        高中玩 CTF（攻擊）：2025 HITCON CTF 銅牌隊 ICEDTEA 就是高中起家
      </li>
      <li>
        進階藍隊（CyberRange）：同年藍隊賽金牌是國家資安院 NICS 的 OTEX 隊
      </li>
      <li className="sub">同一批人，從高中社團，一路打進國家級的資安團隊</li>
    </ul>
  </Default>
);

const PART3: Page[] = [
  P3Section,
  P3Banner,
  // P3What,  // 刪頁
  // P3Orgs,  // 刪頁
  // P3Features,  // 刪頁
  P3Compare,
  P3Student,
  P3StudentNote,
  P3Path,
];

// ════════════════════════════ Part 4 總結 ════════════════════════════
const P4Section: Page = () => (
  <Section theme={T} title="Part 4" subtitle="總結" />
);

const P4Recap: Page = () => (
  <Default theme={T} title="今天我們走過">
    <ul className="osd-list" style={{ marginTop: 12 }}>
      <li>
        四題：OSINT → Web → REV → Blue</li>
      <li>一條 AI 出題流水線（對抗式自我審查，把出題變工程）</li>
      <li>介紹藍隊靶場</li>
    </ul>
  </Default>
);

const P4Argument: Page = () => (
  <Default theme={T} title="會攻擊，不是終點">
    <ul className="osd-list" style={{ marginTop: 8 }}>
      <li>CTF 教的是「攻擊者怎麼想」</li>
      <li>但 Eternal Relay 已經示範：要還原攻擊，你得先懂攻擊</li>
      <li className="sub">
        讀懂了攻擊怎麼來，你才有辦法把它擋下來——這就是防禦者的養成
      </li>
    </ul>
  </Default>
);

const P4Thesis: Page = () => (
  <Statement theme={T} eyebrow="所以，回到最初那句">
    學攻擊，
    <br />
    是為了更好的
    <br />
    學會防禦！
  </Statement>
);

const P4Takeaway: Page = () => (
  <Default theme={T} title="帶回課堂的兩件事">
    <ul className="osd-list" style={{ marginTop: 8 }}>
      <li>
        用 AI skill 起一題：webchall-master／bluechall-master（已附下載）
      </li>
      <li>用今天四題當分級教材：難度從 OSINT 遞增到 Blue Team</li>
    </ul>
  </Default>
);

const P4Meme: Page = () => (
  <MemeSlot theme={T} intent="一起把學生帶上路／『防禦者集合』" />
);

const P4Thanks: Page = () => (
  <Cover theme={T} title="謝謝聆聽" subtitle="Q & A" />
);

const PART4: Page[] = [
  P4Section,
  P4Recap,
  P4Argument,
  P4Thesis,
  P4Takeaway,
  // P4Meme,
  P4Thanks,
];

// ── 匯出 ──────────────────────────────────────────────────────────────────────────
export default [
  P0Cover,
  P0Intro,
  P0Outline,
  P0Thesis,
  // P0Meme,
  ...PART1,
  P2Section,
  P2Preview,
  ...PART2A,
  ...PART2B,
  ...PART2C,
  ...PART2D,
  ...PART3,
  ...PART4,
] satisfies Page[];

export const transition: SlideTransition = RISE;

export const meta: SlideMeta = {
  title: "資安競賽實務 — ISIP.hs 種子師資研習",
  theme: "fhsh-isiphs-universal",
  createdAt: "2026-06-23T18:19:45.565Z",
};

export const design: DesignSystem = {
  palette: { bg: "#ffffff", text: "#000000", accent: "#e07b1a" },
  fonts: { display: SANS, body: SANS },
  typeScale: { hero: 105, body: 64 },
  radius: 16,
};
