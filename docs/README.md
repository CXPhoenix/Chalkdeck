# 文件導覽

第一次使用，先讀[協作指南](guide.md)，了解如何啟動工作、使用 skills 與交接。以下文件會隨專案保留，初始化後仍可查閱。

[Windows 自動開啟停用公告與自行驗證](security/windows-opener.md)。

## 依工作找文件

| 你遇到的問題 | 文件 |
| --- | --- |
| 開發助理需要遵守哪些共用規則？ | [AGENTS.md](../AGENTS.md) |
| 從需求到交付，每一步何時可以往下走？ | [交付流程](agents/workflow.md) |
| Spec 與 tickets 放哪裡？狀態怎麼判定？ | [Issue tracker](agents/issue-tracker.md) |
| 四軸 review 與安全審查如何進行？ | [審查規則](agents/review.md) |
| Claude Code 與 Codex 如何共用 skills、交接？ | [Runtime adapters](agents/runtime.md) |
| Claude 各角色用哪個模型？何時委派？ | [Claude 模型分工](agents/claude-orchestration.md) |
| Codex 如何區分 prompt、skill 與宿主能力？ | [Codex 執行指引](agents/codex.md) |
| 哪些文件用英文？中英文規格如何同步？ | [語言規則](agents/language.md) |
| 探索程式碼前，如何閱讀領域模型？ | [領域文件指引](agents/domain.md) |

`agents/` 內的英文文件供開發助理執行流程，也可用來查核工作是否符合規範。面向使用者的說明採台灣繁體中文。

## 專案文件

| 主題 | 文件 |
| --- | --- |
| deck 如何發佈成網站、嵌入 Google Sites | [部署與 Google Sites 嵌入指南](deploy-and-google-sites.md) |
| `fhsh-isiphs-universal` 主題怎麼用 | [主題使用說明](fhsh-isiphs-universal.md) |
| 專案名詞（deck、deck id、allowlist、兩種工作類型） | [CONTEXT.md](../CONTEXT.md) |
| 改用 harness-agile 前的 Spectra 規格 | [Spectra／OpenSpec 封存區](legacy-openspec/README.md)（唯讀） |

## 設計決策

ADR 保存已採用的決策與理由，方便後續修改時判斷影響。

- [ADR-0001](adr/0001-walking-skeleton-then-epic-loop.md)：先建立 walking skeleton，再以 epic 交付。
- [ADR-0002](adr/0002-ticket-status-in-frontmatter.md)：ticket 狀態存於 frontmatter。
- [ADR-0003](adr/0003-adversarial-review-fixed-axes-two-rounds.md)：規格審查使用固定四軸，最多兩輪。
- [ADR-0004](adr/0004-two-track-delivery.md)：deck 內容工作走輕量流程，模板工作走完整 pipeline。
- [ADR-0005](adr/0005-retire-template-branch.md)：退役長期存在的 `template` 分支。

[Archify 依賴處理與可執行測試](security/archify-dependencies.md)。
