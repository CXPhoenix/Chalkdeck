# T-0006 安全審查報告（stage 7）

## 範圍

| 項目 | 值 |
|---|---|
| Epic／票 | 0004-license-files／T-0006 |
| Worktree | `.worktrees/T-0006` |
| 分支 | `tickets/T-0006/license-files-and-notices` |
| Base | `746378fda6d65434bb78f3499cfec29b5ed76530`（`origin/main`，spec merge） |
| Merge-base | 同 base |
| HEAD | `5aff4fd`（共 5 個 commit：`ba31ea3`、`8bef110`、`3cb8124`、`5a9846a`、`5aff4fd`） |
| 分層 | 只有已 commit 的變更；審查時沒有 pending 或 untracked 檔案 |
| 排除在 diff 文字之外 | `LICENSE`：20,138 bytes 的 CC BY-SA 4.0 legal code，已用 blob `2d58298e` 與 SHA-256 驗證和 creativecommons.org 的 `legalcode.txt` 逐位元組相同 |

變更全是文件：兩個授權檔、`THIRD_PARTY_NOTICES.md`、`README.md`、`AGENTS.md`、`GLOSSARY.md`、`docs/README.md`、ADR-0004、ADR-0007、`docs/agents/workflow.md`、`docs/agents/skill-sources.json`、兩個 `agent-browser/SKILL.md`，以及票檔。

## 方法

- 依專案的 `.claude/skills/security-review/SKILL.md` 與 upstream 方法論進行。
- 一個 `harness-reviewer` 找候選問題，不套用信心門檻；每個候選再交給另一個 `harness-reviewer` 獨立排除誤報。全程唯讀。
- 審查依據的信任邊界：
  - repo 是公開的；
  - `AGENTS.md`、`docs/agents/*` 與 skills 是 AI agent 會照著做的指令，agent 可用 shell、git、gh 和瀏覽器；
  - notices 與 README 會公開姓名和授權宣稱；
  - `skill-sources.json` 會被 `scripts/verify-project.py` 讀取；
  - 兩個 challenge archive 的 member path 不得公開。
- 判定都靠閱讀程式碼與文件推理；archive 的 member-path 掃描則有實際執行，見票的 Comment「Acceptance checks at HEAD」。

## 結果

**確認的 finding：0 個。** 11 個候選都經獨立 reviewer 判定為誤報，原因不外乎：沒有越過任何信任邊界、不是這次 diff 造成的、或已由 stage 6 的 spec 層級 finding 追蹤。

| 候選 | 位置 | 類別 | 初判 | 誤報判定理由（摘要） |
|---|---|---|---|---|
| SEC-01 | `AGENTS.md:185`、`workflow.md:60` | agent 指令擴權 | low, 0.5 | deck 軌原本就能把外部素材推上公開 repo；多一列 notices 不會給攻擊者新能力，PR 仍由 owner 合併，catch-all 也排除未列出的第三方作品。這是文件一致性問題，已併入 STD-01。 |
| SEC-02 | `workflow.md:60`、ADR-0007:46-50 | 守門被弱化 | low, 0.4 | 唯一貢獻者是 owner 與代其工作的 agent，刪錯列屬於正確性錯誤，不是繞過權限；「add, update or remove」是 spec 核准的語意。併入 STD-02。 |
| SEC-03 | `AGENTS.md:209` | 指令注入 | low, 0.3 | 前提是 `@open-slide/core` 已被入侵，但那時攻擊者早已控制 install script 與 skills 本身，這條檢查規則不會增加攻擊面。 |
| SEC-04 | 票檔第 229 行 | 授權紀錄 | low, 0.3 | 只有 owner 和代其工作的 agent 能寫 `.proj.tickets/`；核准措辭已在 stage 6（STD-08、SPEC-04）修正為「事前授權」。 |
| SEC-05 | 票檔第 199-204 行 | 資訊揭露 | info, 0.2 | 只記錄數量與旗標，沒有 member path；archive 本身已在公開 repo，而且 deck 已在 allowlist 上。 |
| SEC-06 | `THIRD_PARTY_NOTICES.md:137` | 隱私 | info, 0.25 | 截圖是既有檔案，deck 也已公開；這列沒有點名任何人，符合「no one else」規則。 |
| SEC-07 | `skill-sources.json:23` | provenance 殘留 | info, 0.3 | 這行沒有改動，spec 刻意保留；`verify-project.py` 不讀這個欄位。 |
| SEC-08 | `skill-sources.json:230-231` | provenance 語意 | info, 0.25 | 沒有程式讀 `project_license` 或頂層 `verified_on`；SPDX `AND` 的解讀只會偏嚴格。 |
| SEC-09 | ADR-0004:8 | 指令歧義 | info, 0.3 | 「its own」指這個 deck 自己的資料夾，同一份 ADR 也限定在 `slides/<deck-id>/`。已列為 SPEC-12。 |
| SEC-10 | `AGENTS.md:50-53`、`GLOSSARY.md:63-65` | 範圍間接定義 | info, 0.2 | 能改 `workflow.md` 的人也能直接改 Charter，不會取得新權限；Charter 也限定只有「two」項共用編輯。 |
| SEC-11 | `THIRD_PARTY_NOTICES.md:134` | 授權宣稱 | info, 0.2 | 字型檔是既有檔案，這次只是補上署名；owner 已裁定不調查 fixed 變體（ADR-0007、spec Out of Scope）。這點只供 owner 知悉。 |

## 已檢查且乾淨的項目

- `LICENSE-CODE` 與 notices 裡的 MIT 本文，和標準 MIT 文字一致。
- 新增的外部連結都是 https 的正規網域：creativecommons.org、github.com、CC BY-ND 3.0 TW legalcode。相對連結的目標都存在。
- diff 裡沒有任何秘密值。
- 依程式碼推論，provenance JSON 的變更不會讓 `verify-project.py` 壞掉；實際執行也 exit 0。
- 兩個 `agent-browser/SKILL.md` 只改了授權指標，沒有動到執行指引。

## 不在本次範圍

- dependency scanning、可用性與 rate limiting。
- 部署後的網站：Out of Scope，見 OQ-3。
- GitHub 實際渲染：AC12，在 stage 8 驗證。
- 授權與署名在法律上是否正確：由 owner 裁決，這份報告只從安全與隱私角度檢視。
- 跨票的 chain analysis：在 epic close-out 進行。

本報告不代表整個專案是安全的，只涵蓋上述 diff。
