## 1. 驗證 as-built 與更新後 spec 相符（無新程式碼）

- [x] 1.1 確認 P1Categories 已實作「Running-order summary revealed on the final step」：`slides/ctf-competition-practice/index.tsx` 的 `osd-morph-steps` 含 5 個 `<Step>`、CSS `:has(.osd-morph-steps>div:nth-child(5)[data-osd-step="revealed"]) .osd-morph-caption{opacity:1}` 驅動結論字、`.osd-morph-caption` 字級為 78px 且預設 opacity:0。驗證：`grep -c "<Step>"` 得 5、grep 到 `nth-child(5)` 與 `font-size:78px`；Present mode 走查確認第 4 步無結論字、第 5 步淡入。
- [x] 1.2 確認「Complete-state degradation for non-stepping contexts」涵蓋結論字：直接載入 `http://127.0.0.1:5173/s/ctf-competition-practice?p=8`（無 step host＝完成態）與 overview 縮圖皆顯示 4 類收攏高亮＋結論字、且為靜態不重播。驗證：實機截圖 / DOM 量測確認結論字 opacity:1 且與標籤、頁碼零重疊、落在 1520×700 內。
- [x] 1.3 確認本 change 未動程式碼且整體仍健康。驗證：`git status` 對 `slides/` 無變更、`pnpm build` 綠燈、deck 仍 127 頁、`spectra validate align-morph-caption-spec` 通過。
