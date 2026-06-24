## Why

`deck-morph-reveal` spec 是在 `p1-categories-morph` archive 時建立的，描述 P1 分類頁的 morph 揭露為「4 步收攏 4 類」。但依講者回饋微調後（commit `7c5966f`），as-built 行為已是 **5 步**：前 4 步依序收攏 4 類，第 5 步（最後一 click）才淡入「破關順序」結論字。spec 因此與現況產生 drift——既未描述第 5 步的 caption 揭露，完成態（overview／反向進入）也漏列 caption。本 change 純粹把 spec 對齊到 as-built，無新程式工作。

## What Changes

- 在 `deck-morph-reveal` 新增需求：結論字（running-order caption）在最後一步才出現——前 4 步隱藏、第 5 步淡入，字級 ≥78px、置於收攏左欄下方、不超出畫布、不壓任何標籤或頁碼，並尊重 reduced-motion。
- 修改既有需求「Complete-state degradation for non-stepping contexts」：完成態（overview 縮圖／PDF／反向或跳入）除 4 類收攏高亮外，也須一併顯示結論字（靜態、不重播淡入）。
- 不改任何程式碼（P1Categories 已是 5 步）；本 change 僅更新 spec 並以驗證型任務確認 as-built 相符。

## Non-Goals

- 不改 deck 程式碼、不改其他 spec、不改版面座標或字級（已於 `7c5966f` 定案）。
- 不重新設計 morph 機制；只把既有 5 步行為寫進 spec。
- 不調整 `Sequential highlight` 需求的 step→category 表（步驟 1–4 對應 4 類仍正確；第 5 步不點亮類別，由新需求涵蓋）。

## Capabilities

### New Capabilities

(none)

### Modified Capabilities

- `deck-morph-reveal`: 新增「結論字最後一步揭露」需求，並修改「完成態降級」需求把結論字納入完成態。

## Impact

- Affected specs: `deck-morph-reveal`（modified）
- Affected code:
  - New: (none)
  - Modified: (none — 程式已於 commit 7c5966f 符合，本 change 不動 slides/ctf-competition-practice/index.tsx)
  - Removed: (none)
