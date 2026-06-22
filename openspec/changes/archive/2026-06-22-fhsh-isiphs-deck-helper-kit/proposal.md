## Why

目前要用 fhsh-isiphs-universal 主題開一份新 deck，唯一辦法是把 themes/fhsh-isiphs-universal.md 裡 `## Fixed components` 那段約 140 行 paste-ready boilerplate 整段手抄進 slides/<id>/index.tsx，再自行補上 makeTheme 設定、頁面、export 與 meta。每開一份就重抄一次，費時且容易抄錯或漏改 import。需要一個 helper kit 把「開新 deck → 啟動 dev → 開始填內容」一鍵化，並以主題 markdown 為唯一來源確保不 drift。

## What Changes

- 新增零依賴 Node 腳本 scripts/new-deck.mjs：執行期從主題 markdown 抽取 `## Fixed components` 的 boilerplate，改寫型別 import，依參數附上 deck 設定、skeleton 起手頁、export default、meta（含 createdAt）與選用的 design，產生 slides/<id>/index.tsx。
- 新增 new-deck skill（.agents/skills/new-deck/SKILL.md，並由 .claude/skills/new-deck symlink 指向）：問答收集 slide id / 品牌 / 等級 / 標題 / starter，呼叫腳本 scaffold，背景啟動 dev server 並回 /s/<id> 預覽連結，再把內容撰寫交棒給 slide-authoring。
- package.json scripts 新增 new:deck 捷徑（指向 node scripts/new-deck.mjs），方便手動呼叫。
- AGENTS.md 的「Which skill to use」新增一行指向 new-deck，提升可發現性。

## Capabilities

### New Capabilities

- `deck-scaffolding`: 以零依賴腳本 + new-deck skill，從主題 markdown 抽取 boilerplate 快速 scaffold 一份新 deck（skeleton 起手頁），並自動啟動 dev、回傳預覽連結。

### Modified Capabilities

(none)

## Impact

- Affected specs: 新增 deck-scaffolding capability。相關但不修改既有 fhsh-isiphs-theme spec（本 kit 建構於該主題之上，不更動其需求）。
- Affected code:
  - New:
    - scripts/new-deck.mjs
    - .agents/skills/new-deck/SKILL.md
    - .claude/skills/new-deck（symlink 指向 .agents/skills/new-deck）
  - Modified:
    - package.json（新增 new:deck script）
    - AGENTS.md（新增 new-deck skill 指引一行）
  - Removed: 無
