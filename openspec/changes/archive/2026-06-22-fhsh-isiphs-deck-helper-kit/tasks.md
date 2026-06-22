## 1. Scaffolding 腳本 scripts/new-deck.mjs

- [x] 1.1 依設計決策「以主題 markdown 為唯一 boilerplate 來源（執行期抽取）」與「零依賴 Node 腳本 scripts/new-deck.mjs 的 CLI 與行為」，實作 Scaffold a deck from the theme markdown as single source of truth：腳本讀 themes/<theme>.md，定位 `## Fixed components` 後第一個 tsx fenced block 作為 boilerplate，腳本內不留任何 boilerplate 副本。驗證：對合法 id 執行後，產生的 slides/<id>/index.tsx grep 得到 Frame / DeckPage / Cover 等版型；主題檔缺失或找不到該 block 時印錯誤並 exit 非 0、不建立任何 slide 目錄。
- [x] 1.2 依設計決策「型別 import 改寫策略」，實作 Rewrite the type import for a renderable slide：以 regex 整行替換 `@open-slide/core` 的 type import，預設補上 DesignSystem、Page、SlideMeta，其餘 import 不動。驗證：grep 產物 import 行含三者且檔尾有 export const design；帶 --no-design 時 import 不含 DesignSystem 且無 design 區塊。
- [x] 1.3 實作 Validate inputs and fail without leaving partial output（屬「零依賴 Node 腳本 scripts/new-deck.mjs 的 CLI 與行為」的一部分）：id 非 kebab-case、slides/<id> 已存在且無 --force、brand/level/starter 非法值皆 exit 非 0 並印明確訊息、不留半成品目錄；帶 --force 則重新產生。驗證：以非法 id 與既存目錄各跑一次，assert exit code 非 0 且未建立／未覆寫；--force 案例確認檔案被重生。
- [x] 1.4 實作 Brand and course level select theme appearance：--brand 與 --level 決定產物的 makeTheme 行，預設 fhsh / 0。驗證：以 --brand isip.hs --level 1 執行，grep 產物含 const T = makeTheme('isip.hs', 1)。
- [x] 1.5 實作 Starter variants produce defined page sets：--starter 決定產物頁面，預設 skeleton（Cover、Default+ToC、Section、兩頁 Default 內文佔位）；minimal 僅 Cover；full 為含 ImagePage 與逐頁換圖的多頁示範。驗證：三種 starter 各跑一次，檢查 export default 陣列頁數與內容符合定義。
- [x] 1.6 組出最終 index.tsx 並輸出後續指引：附上 export default ... satisfies Page[]、export const meta（含以 new Date().toISOString() 產生的 createdAt 與 theme 欄位），建立 slides/<id>/assets/.gitkeep，並印出 /s/<id> 預覽網址與 pnpm dev 提示。驗證：pnpm dev 後開 /s/<id> 能正常 render，且 meta.createdAt 為合法 ISO 字串。

## 2. new-deck skill 與整合

- [x] 2.1 依設計決策「new-deck skill 的問答流程與 dev 啟動」，實作 Skill orchestrates scaffolding and dev preview：skill 收集 id / 品牌 / 等級 / 標題 / starter，呼叫腳本，dev server 未跑才背景啟動，回傳 /s/<id> 連結，並把內容撰寫交棒給 slide-authoring（不重複其知識）。驗證：執行 /new-deck 走完問答，觀察到 scaffold 完成、dev 啟動、印出預覽連結。
- [x] 2.2 建立 .claude/skills/new-deck symlink 指向 .agents/skills/new-deck，使 skill 可被發現載入。驗證：列出可用 skills 時出現 new-deck 並可載入其 SKILL.md。
- [x] 2.3 依設計決策「package.json 新增 new:deck 捷徑」，實作 Convenience invocation via package script：package.json scripts 新增 new:deck 指向 node scripts/new-deck.mjs。驗證：執行 pnpm new:deck <id> --title "X" 產生與直接呼叫腳本相同結果。
- [x] 2.4 於 AGENTS.md「Which skill to use」新增一行指向 new-deck，提升可發現性。驗證：grep AGENTS.md 含 new-deck 指引行。

## 3. 端對端驗證與清理

- [x] 3.1 依 design 的 Acceptance criteria 做端對端驗證：scaffold test-deck（--brand isip.hs --level 1），pnpm dev 後確認 /s/test-deck 顯示 isip.hs 品牌圖與 level 1 藍色框、ToC/Section/三層清單樣式正確，並覆驗各 Failure mode 乾淨報錯；驗畢移除測試用 slides/test-deck。
