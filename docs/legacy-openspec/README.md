# Spectra／OpenSpec 封存區（唯讀）

本專案在 2026-10-15 由 Spectra 改用 harness-agile。這個目錄保存改用前的 OpenSpec 規格與已封存的 change，內容維持搬移當下的原樣。

- **只供參考，不再寫入。** 新的需求、規格與 tickets 一律走 [AGENTS.md](../../AGENTS.md) 的 pipeline，寫在 `.proj.specs/` 與 `.proj.tickets/`。
- **仍需遵守的需求要重新立案。** 若某條舊規格仍約束現在的行為，在新 epic 的 spec 裡重寫，並附上追溯矩陣；不要直接引用這裡的條文當驗收依據。
- 檔案內提到的 `openspec/...` 路徑、`spectra` 指令與 skills 已不存在。

| 規格 | 內容 |
| --- | --- |
| [deck-scaffolding](specs/deck-scaffolding/spec.md) | `pnpm new:deck` 產生 deck 骨架的行為 |
| [fhsh-isiphs-theme](specs/fhsh-isiphs-theme/spec.md) | `fhsh-isiphs-universal` theme |
| [deck-morph-reveal](specs/deck-morph-reveal/spec.md) | 分類頁標籤的就地 morph 揭示 |

已封存的 change 在 [changes/archive/](changes/archive/)。
