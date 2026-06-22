## Context

fhsh-isiphs-universal 主題的所有版型（makeTheme / Frame / DeckPage / Cover / Section / Default / ImagePage / ToC）以 paste-ready 形式集中在 themes/fhsh-isiphs-universal.md 的 `## Fixed components` 區段（單一 ```tsx fenced block）。slides/fhsh-isiphs-demo/index.tsx 已逐字 inline 同一段，並於檔頭註明「與主題 md 同步」。open-slide 的硬規則是每個 slide 自包含、內容全部寫在 slides/<id>/index.tsx，框架只編譯 slides/**，故無法把 boilerplate 抽成共用 import 模組。每開一份新 deck 都必須重抄那段 boilerplate，是重複且易錯的手工流程。

本變更不改主題本身，而是在其上加一層 scaffolding 工具，讓開新 deck 變成一行指令／一次問答。

## Goals / Non-Goals

**Goals:**

- 一支零依賴 Node 腳本，能從主題 markdown 抽取 boilerplate 並產生可直接 render 的 slides/<id>/index.tsx。
- 以主題 markdown 為唯一 source of truth，新 deck 永遠與主題同步、不 drift。
- 一個 new-deck skill 把問答 → scaffold → 啟動 dev → 交棒撰寫串起來。
- 尊重 open-slide「slide 自包含」硬規則：產物仍是單一 index.tsx、inline 全部 boilerplate。

**Non-Goals:**

- 不替既有 deck 做 boilerplate 同步／去重（既有 inline 副本的 drift 屬另議題）。
- 不把 boilerplate 抽成共用模組（違反框架硬規則且不可靠）。
- 不更動 open-slide.config.ts、既有 slide、或既有 fhsh-isiphs-theme spec 的需求。
- 不在本變更撰寫任何實際課程內容（交棒給 slide-authoring）。

## Decisions

### 以主題 markdown 為唯一 boilerplate 來源（執行期抽取）

腳本在執行時讀 themes/<theme>.md，定位 `## Fixed components` 標題後的第一個 ```tsx fenced block，整段作為 boilerplate。**替代方案**：在腳本內保存一份 boilerplate 副本——否決，因為會與主題 md 形成第二份需手動同步的副本，正是要消除的 drift 來源。

### 零依賴 Node 腳本 scripts/new-deck.mjs 的 CLI 與行為

採 Node ESM + 只用 stdlib（node:util parseArgs、node:fs、node:path、import.meta.url 推 repo root），不新增任何 dependency，符合 repo「不加依賴」原則。**替代方案**：寫成 open-slide CLI 插件或 TS 檔——否決，前者需改框架、後者需 build step，過重。

### 型別 import 改寫策略

主題 md 的 block 只 `import type { Page } from '@open-slide/core'`，但可 render 的 slide 需要 SlideMeta（與選用的 DesignSystem）。腳本以 regex 比對 `import type { ... } from '@open-slide/core'` 該行整段替換，補上所需型別；其餘 import（react 的 CSSProperties/ReactNode、useSlidePageNumber 值 import）不動。**替代方案**：字串插入 token——否決，較脆弱。

### new-deck skill 的問答流程與 dev 啟動

skill 收集 slide id（kebab-case，檢查碰撞）、品牌、等級、標題/副標、starter（預設 skeleton），呼叫腳本，背景啟動 dev server 並回 /s/<id> 連結，最後把內容撰寫交棒給 slide-authoring（不重複那邊知識）。**替代方案**：擴充既有 create-slide——否決，create-slide 由 @open-slide/core 管理且「不可就地修改」，且其定位是任意主題的完整互動撰寫，與本 kit 的「快速 scaffold」分工不同。

### package.json 新增 new:deck 捷徑

於 scripts 新增 new:deck（指向 node scripts/new-deck.mjs）。使用者已明確同意此一破例修改 package.json（AGENTS.md 原則上不動該檔）。

## Implementation Contract

**Behavior（使用者觀察到的）**：執行 scaffold 指令後，slides/<id>/ 下出現可直接被 dev server render 的 index.tsx；開 dev 後 /s/<id> 顯示對應品牌圖組與等級色框的 deck（skeleton 含 Cover、ToC、Section、兩頁內文佔位）。

**Interface（腳本 CLI 契約）**：

```
node scripts/new-deck.mjs <slide-id> [options]
  --brand <fhsh|isip.hs>             預設 fhsh
  --level <0|1|2>                    預設 0
  --title "<text>"                  預設由 id 推導
  --subtitle "<text>"               選用
  --starter <skeleton|minimal|full>  預設 skeleton
  --theme <theme-id>                 預設 fhsh-isiphs-universal
  --no-design                        略過 export const design（預設輸出）
  --force                            覆寫已存在的 slides/<id>
```

**產物結構（index.tsx）**：抽取並改寫 import 後的 boilerplate，接上 `const T = makeTheme('<brand>', <level>)`、依 starter 產生頁面、`export default [...] satisfies Page[]`、`export const meta: SlideMeta`（含 title、theme、以 new Date().toISOString() 產生的 createdAt），以及（預設）`export const design: DesignSystem`。同時建立 slides/<id>/assets/.gitkeep。

**starter 對應頁面**：skeleton＝Cover + (Default+ToC) + Section + 兩頁 Default 內文佔位；minimal＝僅 Cover；full＝代表性多頁示範（含 ImagePage 與逐頁換圖），僅供教學參考。

**Failure modes（皆 exit code 非 0 並印明確訊息）**：slide-id 非 kebab-case；slides/<id> 已存在且未帶 --force；themes/<theme>.md 不存在或找不到 `## Fixed components` 的 tsx block；brand/level/starter 值非法。

**Acceptance criteria**：
- 對合法輸入產生的 index.tsx，其 import 含 SlideMeta（及 design 模式下的 DesignSystem），含完整 boilerplate、makeTheme 設定行、對應 starter 的頁面、export default 與含 createdAt 的 meta。
- pnpm dev 後 /s/<id> 能正常 render，色框等級與品牌圖組與參數一致。
- 各 Failure mode 皆乾淨報錯、exit 非 0、不留半成品目錄。
- skill 走完問答後完成 scaffold、背景啟 dev、回傳 /s/<id> 連結。

**Scope boundaries**：in scope＝scripts/new-deck.mjs、new-deck skill（含 .claude/skills symlink）、package.json new:deck、AGENTS.md 指引一行。out of scope＝既有 deck 同步、共用模組抽取、其他主題的品牌/等級軸特化、實際內容撰寫。

## Risks / Trade-offs

- [主題 md 的 `## Fixed components` 結構若變動，抽取會失敗] → 腳本以標題 + 第一個 tsx fence 定位並於失敗時明確報錯指出主題檔結構；抽取邏輯集中一處便於更新。
- [產物仍 inline ~140 行 boilerplate，多份 deck 各有副本，未來主題改版時舊 deck 不會自動更新] → 屬刻意取捨（遵守框架自包含硬規則）；新 deck 一律重新抽取故產生當下即同步，既有 deck 同步列為 Non-Goal。
- [背景啟動 dev server 可能與既有執行中的 server 衝突或佔埠] → skill 啟動前先判斷是否已在跑，已跑則只回連結、不重啟。
- [package.json 被修改違反 AGENTS.md 預設] → 使用者已明確同意此破例，僅新增一個 script 條目、不動其他欄位。
