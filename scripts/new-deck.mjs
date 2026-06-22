#!/usr/bin/env node
// new-deck — scaffold a new deck that uses the fhsh-isiphs-universal theme.
//
// 以主題 markdown 為唯一 source of truth：執行期從 themes/<theme>.md 的
// `## Fixed components` 區段抽出 paste-ready boilerplate，改寫型別 import，
// 接上 deck 設定行、起手頁、export default、meta（含 createdAt）與選用的 design，
// 產生自包含的 slides/<id>/index.tsx。本腳本內不保存任何 boilerplate 副本。
//
// 用法：
//   node scripts/new-deck.mjs <slide-id> [options]
//     --brand <fhsh|isip.hs>             預設 fhsh
//     --level <0|1|2>                    預設 0
//     --title "<text>"                  預設由 id 推導
//     --subtitle "<text>"               選用
//     --starter <skeleton|minimal|full>  預設 skeleton
//     --theme <theme-id>                 預設 fhsh-isiphs-universal
//     --no-design                        略過 export const design（預設會輸出）
//     --force                            覆寫已存在的 slides/<id>
//
// 零依賴：只用 Node 內建模組。

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const BRANDS = new Set(['fhsh', 'isip.hs']);
const LEVELS = new Set(['0', '1', '2']);
const STARTERS = new Set(['skeleton', 'minimal', 'full']);
const ID_RE = /^[a-z0-9]+(-[a-z0-9]+)*$/;

function fail(message) {
  console.error(`✖ ${message}`);
  process.exit(1);
}

// ── 解析參數 ───────────────────────────────────────────────────────────────────
let parsed;
try {
  parsed = parseArgs({
    allowPositionals: true,
    options: {
      brand: { type: 'string', default: 'fhsh' },
      level: { type: 'string', default: '0' },
      title: { type: 'string' },
      subtitle: { type: 'string' },
      starter: { type: 'string', default: 'skeleton' },
      theme: { type: 'string', default: 'fhsh-isiphs-universal' },
      'no-design': { type: 'boolean', default: false },
      force: { type: 'boolean', default: false },
    },
  });
} catch (err) {
  fail(`參數解析失敗：${err.message}`);
}

const { values, positionals } = parsed;
const id = positionals[0];

// ── 驗證輸入（Validate inputs and fail without leaving partial output）──────────────
if (!id) fail('缺少 <slide-id>。用法：node scripts/new-deck.mjs <slide-id> [options]');
if (!ID_RE.test(id)) fail(`slide-id「${id}」不是 kebab-case（只允許小寫英數與單一連字號，例如 my-deck）。`);
if (!BRANDS.has(values.brand)) fail(`--brand「${values.brand}」非法，必須是 fhsh 或 isip.hs。`);
if (!LEVELS.has(values.level)) fail(`--level「${values.level}」非法，必須是 0、1 或 2。`);
if (!STARTERS.has(values.starter)) fail(`--starter「${values.starter}」非法，必須是 skeleton、minimal 或 full。`);

const slideDir = join(ROOT, 'slides', id);
const indexPath = join(slideDir, 'index.tsx');
if (existsSync(slideDir) && !values.force) {
  fail(`slides/${id} 已存在。要覆寫請加 --force。`);
}

const brand = values.brand;
const level = Number(values.level);
const starter = values.starter;
const themeId = values.theme;
const withDesign = !values['no-design'];
const title = values.title ?? id.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
const subtitle = values.subtitle ?? '副標題';

// ── 從主題 markdown 抽取 boilerplate（single source of truth）────────────────────
const themePath = join(ROOT, 'themes', `${themeId}.md`);
if (!existsSync(themePath)) {
  fail(`找不到主題檔 themes/${themeId}.md。請確認 --theme 名稱，或主題尚未建立。`);
}
const themeMd = readFileSync(themePath, 'utf8');

const marker = themeMd.indexOf('## Fixed components');
if (marker === -1) {
  fail(`themes/${themeId}.md 內找不到「## Fixed components」標題；主題檔結構可能已變動。`);
}
const fenceOpen = themeMd.indexOf('```tsx', marker);
if (fenceOpen === -1) {
  fail(`themes/${themeId}.md 的「## Fixed components」之後找不到 tsx 程式碼區塊；主題檔結構可能已變動。`);
}
const bodyStart = themeMd.indexOf('\n', fenceOpen) + 1;
const fenceClose = themeMd.indexOf('\n```', bodyStart);
if (fenceClose === -1) {
  fail(`themes/${themeId}.md 的 boilerplate 區塊沒有收尾的 \`\`\`；主題檔結構可能已變動。`);
}
let boilerplate = themeMd.slice(bodyStart, fenceClose).trimEnd();

// ── 改寫型別 import（Rewrite the type import for a renderable slide）────────────────
const typeImportRe = /import type \{[^}]*\} from '@open-slide\/core';/;
if (!typeImportRe.test(boilerplate)) {
  fail(`抽出的 boilerplate 內找不到 @open-slide/core 的 type import；主題檔結構可能已變動。`);
}
const newTypeImport = withDesign
  ? "import type { DesignSystem, Page, SlideMeta } from '@open-slide/core';"
  : "import type { Page, SlideMeta } from '@open-slide/core';";
boilerplate = boilerplate.replace(typeImportRe, newTypeImport);

// ── 依 starter 組頁面（Starter variants produce defined page sets）──────────────────
const attr = (s) => String(s).replace(/"/g, '&quot;');
const cover = `const P1: Page = () => <Cover theme={T} title="${attr(title)}" subtitle="${attr(subtitle)}" />;`;

function pagesFor(kind) {
  if (kind === 'minimal') {
    return { body: cover, list: ['P1'] };
  }
  if (kind === 'full') {
    const body = [
      cover,
      '',
      `const P2: Page = () => (
  <Default theme={T} title="目錄">
    <ToC items={['第一章', '內文示範', '示意圖頁', '逐頁換圖示範']} />
  </Default>
);`,
      '',
      `const P3: Page = () => <Section theme={T} title="第一章" subtitle="導論" />;`,
      '',
      `const P4: Page = () => (
  <Default theme={T} title="內文示範">
    <h3>重點標題</h3>
    <p>
      一段內文，含連結範例：<a href="#">參考連結</a>。
    </p>
    <ul>
      <li>
        第一層
        <ul>
          <li>
            第二層
            <ul>
              <li>第三層</li>
            </ul>
          </li>
        </ul>
      </li>
      <li>第二點</li>
    </ul>
  </Default>
);`,
      '',
      `const P5: Page = () => <ImagePage theme={T} src={fhshSection} alt="示意圖" />;`,
      '',
      `// 逐頁換圖示範：用 isip.hs 的 section 圖並自訂位置/大小`,
      `const P6: Page = () => (
  <Section
    theme={T}
    title="逐頁換圖示範"
    subtitle="使用 isip.hs 圖片"
    sectionImg={isipSection}
    sectionImgStyle={{ top: 540, right: 134, width: 691 }}
  />
);`,
    ].join('\n');
    return { body, list: ['P1', 'P2', 'P3', 'P4', 'P5', 'P6'] };
  }
  // skeleton（預設）
  const body = [
    cover,
    '',
    `const P2: Page = () => (
  <Default theme={T} title="目錄">
    <ToC items={['第一節', '第二節', '第三節']} />
  </Default>
);`,
    '',
    `const P3: Page = () => <Section theme={T} title="第一節" subtitle="小節副標" />;`,
    '',
    `const P4: Page = () => (
  <Default theme={T} title="內文頁一">
    <h3>重點標題</h3>
    <p>在這裡寫一段內文。</p>
    <ul>
      <li>
        第一點
        <ul>
          <li>
            細項
            <ul>
              <li>更細的說明</li>
            </ul>
          </li>
        </ul>
      </li>
      <li>第二點</li>
    </ul>
  </Default>
);`,
    '',
    `const P5: Page = () => (
  <Default theme={T} title="內文頁二">
    <h3>另一個重點</h3>
    <p>
      補充說明，連結範例：<a href="#">參考連結</a>。
    </p>
    <ul>
      <li>項目 A</li>
      <li>項目 B</li>
    </ul>
  </Default>
);`,
  ].join('\n');
  return { body, list: ['P1', 'P2', 'P3', 'P4', 'P5'] };
}

const { body: pagesBody, list: pageList } = pagesFor(starter);

// ── meta / design（Brand and course level select theme appearance + 組裝）───────────
const createdAt = new Date().toISOString();
const metaTitle = title.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
const designBlock = withDesign
  ? `

export const design: DesignSystem = {
  palette: { bg: '#ffffff', text: '#000000', accent: '#3b82f6' },
  fonts: { display: SANS, body: SANS },
  typeScale: { hero: 105, body: 55 },
  radius: 12,
};`
  : '';

const tail = `
// ── deck 設定：改這一行即整份換皮 ────────────────────────────────────────────────
const T = makeTheme('${brand}', ${level}); // (themeName: 'fhsh'|'isip.hs', courseLevel: 0|1|2)

${pagesBody}

export default [${pageList.join(', ')}] satisfies Page[];

export const meta: SlideMeta = {
  title: '${metaTitle}',
  theme: '${themeId}',
  createdAt: '${createdAt}',
};${designBlock}
`;

const fileContent = `${boilerplate}\n${tail}`;

// ── 寫檔（含 assets/.gitkeep）─────────────────────────────────────────────────────
mkdirSync(join(slideDir, 'assets'), { recursive: true });
const gitkeep = join(slideDir, 'assets', '.gitkeep');
if (!existsSync(gitkeep)) writeFileSync(gitkeep, '');
writeFileSync(indexPath, fileContent);

// ── 成功訊息與後續指引 ────────────────────────────────────────────────────────────
console.log(`✔ 已建立 slides/${id}/index.tsx`);
console.log(`  主題 ${themeId}｜品牌 ${brand}｜等級 ${level}｜起手 ${starter}${withDesign ? '' : '｜無 design'}`);
console.log('');
console.log('  下一步：');
console.log('    pnpm dev');
console.log(`    開 http://localhost:5173/s/${id}`);
