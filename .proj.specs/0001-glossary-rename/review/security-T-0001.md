# 安全審查報告 — T-0001

- 範圍：分支 `tickets/T-0001/glossary-rename`（獨立 worktree），base B `3b383c27e041ed6a103e875ce6cde09cf094625a`（merge-base 相同），HEAD `265b27f7553d463890f5fe1f4ee9301f888821a2`
- 層級：committed 32 個檔案；pending 與 untracked 皆為空
- 方法：專案 `security-review` skill。一位 `harness-reviewer` 找候選，三位獨立的 `harness-reviewer` 做誤判過濾；全部為讀碼推論，未執行任何重現
- 信任邊界：verifier 只在作者自己的 checkout 本機執行，沒有網路、沒有 CI；攻擊者能控制的只有進入 repo 的內容（上游 skill 同步、`pnpm sync:skills`、合併的分支）。skill 與文件是 agent 讀取的 prompt 內容

## 結論

候選 9 項，經獨立過濾後 **0 項成立為安全 finding**，沒有 HIGH 或 MEDIUM。下列非安全觀察留作 P2 hardening 參考。

## 候選與處置

| ID | 候選 | 處置 | 最終嚴重度 | 理由摘要 |
|---|---|---|---|---|
| F1 | `docs/agents/` 下的 symlink 目錄會被走訪，可讀到 repo 外 | 誤判 | INFO | 放 symlink 需要 commit 進 repo，此人已能直接改 verifier、測試、`package.json`；輸出只有 repo 相對路徑、行號與 token；PASS 不印路徑 |
| F2 | 掃描集合中的 `.md` symlink 會被跟隨 | 誤判 | INFO | 同 F1；最多洩漏「讀不到」1 bit，不洩漏內容；AGENTS.md、CLAUDE.md 的跟隨原本就有 |
| F3 | 沒有檔案大小與輸出上限 | 誤判 | INFO | 屬 DoS／資源耗盡排除類；Ctrl-C 即可結束；原本的讀檔方式就沒有上限 |
| F4 | `is_file()` 與 `read_text()` 之間的 TOCTOU（FIFO） | 誤判 | INFO | Git 無法儲存 FIFO；需要本機同時寫入者，等於已控制本機 |
| F5 | 檔名未跳脫就輸出到 `FAIL:` | 誤判（hardening） | LOW | 屬 log spoofing 排除類；攻擊者可直接改 skill 與文件，檔名注入沒有多得能力；同類 sink 原本就有 |
| F6 | `os.walk` 未傳 `onerror`，讀不到的子目錄被靜默略過 | 誤判（安全面） | INFO | Git 不保存目錄權限，repo 內容無法造出；後果只是文件一致性 |
| F7 | teach 自選子目錄名稱、未 gitignore | 誤判 | INFO | `/teach` 僅手動觸發、由作者驅動；改動前檔案散落在 repo 根目錄，這次反而縮小曝險；Pages 只部署 allowlist 中的 deck |
| F8 | 專案 glossary 與 teach glossary 同名，只靠 prompt 防止覆蓋 | 誤判 | INFO | 只有受信任的作者與 agent 會寫入；GLOSSARY.md 由 git 追蹤可還原；round 2 已裁定接受同名並加緩解句 |
| F9 | 測試在 Windows 上匯入時 `os.geteuid` 不存在 | 誤判（安全面）；可攜性 bug 成立 | INFO | 只影響測試，fail-closed；候選修法會讓 Windows 測試假失敗，宜改用 `hasattr` 判斷 |

## 非安全觀察（P2，作者決定是否處理）

1. 收集掃描檔時略過 symlink 檔案與 symlink 目錄（F1、F2、F3 的共同根源），與 `GLOSSARY.md` 拒絕 symlink 的政策一致。
2. `os.walk` 傳入 `onerror`，把讀不到的目錄回報為 `cannot read`（F6）；巢狀 symlink 目錄與懸空的 `.md` symlink 也會被靜默略過，需另外處理。
3. 在 `main()` 統一跳脫控制字元，同時涵蓋既有與新增的輸出點（F5）。
4. teach 工作區固定放在 gitignore 的位置，名稱用 kebab-case，撞名時先詢問（F7）。
5. verifier 檢查 teach 的本地調整句仍存在，防止日後上游同步時被覆蓋（F8）。
6. 測試的 `skipIf` 改為 `not hasattr(os, "geteuid") or os.geteuid() == 0`，symlink 測試遇到 `OSError` 時 skip（F9）。

## 涵蓋範圍限制

- 未做 dependency scanning（本變更沒有新增相依套件）。
- availability 與 rate limiting 只以候選身分評估，未實測。
- 所有結論都來自讀碼推論，未建立 symlink 或 FIFO 實際重現。
- 跨 ticket 的 chain analysis（F1＋F2＋F3＋F5）留到 epic close-out；過濾 reviewer 判斷這條鏈只會洩漏 repo 外的路徑與「哪一行含 token」。
- 本報告不代表整個專案是安全的。
