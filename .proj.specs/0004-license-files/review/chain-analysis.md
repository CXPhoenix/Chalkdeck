# Epic 0004 漏洞 chain 分析（close-out）

依 `docs/agents/review.md` 的「Epic close-out: chain analysis」進行。日期：2026-10-23。分析對象是已合併進 `main` 的 merge commit `ef78392`。

## 結論

**沒有任何 chain 越過信任邊界，因此不必在 epic 結案前開票。**

- 兩位獨立分析者共提出 13 條候選 chain。每條都交給 `harness-challenger` 逐環節查證，結果全部不成立。
- 13 條中有好幾條共用同一個殘留缺口：T10／T14 沒有在原處重申「holder 只由 repository owner 決定，沒有來源就填 unknown」。這是 stage 6 已記錄的 STD-01。
- 另外，A 的 CH-03 與 B 的 CH-05 牽涉 STD-02／SPEC-11 的觸發條件缺口：原地換檔只有 T13／T14 涵蓋，T10 沒有。
- 這兩個缺口都屬於文件一致性問題，已列進 retrospective 交給 owner 決定。chain analysis 沒有發現新的問題。

## 輸入

- **Ticket 的安全 finding**：epic 只有一張票 T-0006。它的 stage 7 報告（`review/security-T-0006.md`）列出 SEC-01～SEC-11 共 11 個候選，個別都被判為誤報；在這裡一律當成 low／info 等級的鏈節。
- **可能成為鏈節的 stage 6 spec 層級問題**：STD-01、STD-02／SPEC-11、STD-04／SMELL-02、STD-05、STD-06、STD-07、STD-16、SMELL-01、SPEC-12、SPEC-13、SPEC-14（見 T-0006 的「Stage 6 code review」Comment）。
- **信任邊界**，來源是 spec、traceability、`AGENTS.md` 與已合併進 `main` 的檔案：
  - repo 公開，notices 一 push 就公開；
  - archive member path 不得公開；
  - deck 軌與 template 軌分開；
  - holder 只由 owner 決定；
  - open-slide 升級與 skill 同步屬於 template work，不走 deck 軌；
  - allowlist 加 GitHub Release 才能部署；
  - 部署出去的網站不在範圍內（OQ-3）。

## 方法

| 步驟 | 角色 | 內容 |
|---|---|---|
| 分析 A | `harness-reviewer`，從攻擊者出發 | 從外部能控制的東西往內推：網頁、上游套件、PR comment、素材 |
| 分析 B | `harness-reviewer`，從守門出發 | 從專案依賴的每道守門往外推：template 軌 pipeline、allowlist 加 Release、owner 審 PR、只由 owner 決定 holder、不公開 member path |
| 查證 | `harness-challenger`，每條 chain 一位 | 逐一確認每個鏈節是否真的存在於已合併進 `main` 的檔案、每一步是否真的走得到、終點是否真的越過信任邊界 |

全部唯讀，判定都靠閱讀檔案推理，沒有執行攻擊。分析 A 試過但自行排除的組合有 16 種，分析 B 有 12 種（數字取自兩位分析者回報的結構化輸出，未另外存檔）。

## 候選 chain 與判定

初判欄是分析者給的嚴重度與信心值（0–1）。

| 分析 | Chain | 主張的路徑（摘要） | 初判 | 查證結果 | 不成立的主因 |
|---|---|---|---|---|---|
| A | CH-01 | 外部頁面的授權說明 → deck 軌 agent 填 Assets 列 → 公開錯誤的授權宣稱 | low 0.45 | 不成立 | T10／T14 的「as the file's license requires」把來源綁在檔案自己的授權，不是網頁或 PR comment；兩條規則都連到 ADR-0007；合併仍要 owner 審 PR；deck 軌原本就能推上外部素材，這次沒有增加攻擊者的能力 |
| A | CH-02 | deck 軌 → 改 T1 表、catch-all 或全域列 | low 0.4 | 不成立 | 這些都是 template work，deck 軌沒有權限動；「notices 是合法路徑」只涵蓋自己 deck 的 Assets 列 |
| A | CH-03 | 同名檔換成第三方作品 → 錯誤的 CC BY-SA 宣稱 | low 0.35 | 不成立 | catch-all 以作品類別為準，排除所有未列出的第三方作品；規則缺口已由 STD-02 追蹤 |
| A | CH-04 | 截圖中人物的姓名 → 以純文字寫進 notices | low 0.3 | 不成立 | T10 明寫「no one else, such as people shown in it」；既有的那一列也沒有點名任何人 |
| A | CH-05 | archive member path 寫進 notices、commit 或 PR | info 0.25 | 不成立 | 誤讀了「mixed file」的意思（它指的是截圖）；而且 archive 本身已公開 |
| A | CH-06 | 上游套件 → agent 指令樹，跟著 deck PR 進 `main` | info 0.2 | 不成立 | 前提是上游已被入侵，那時攻擊者早已控制 install script；open-slide 升級屬於 template work |
| A | CH-07 | ND 授權的字型 → 部署網站沒附 notice | info 0.3 | 不成立 | 終點在範圍外：ADR-0007 的 Consequences 已記錄，並由仍開著的 OQ-3 追蹤 |
| B | CH-01 | 外部 metadata → 繞過「只由 owner 決定 holder」 | low 0.4 | 不成立 | 同 A 的 CH-01；「可能點名照片中的人」被 T10 的原文直接否定 |
| B | CH-02 | allowlist 加一行 → 私有 deck 被公開 | low 0.2 | 不成立 | Charter Must-hold 1 規定 allowlist 只能依作者明確指示修改，這條規則完整存在而且每次都會載入 |
| B | CH-03 | npm 套件 → `.agents/skills/` 與 open-slide 條目跟著 deck 分支進來 | info 0.15 | 不成立 | 走不到：sync 屬於 template work，而且已合併進 `main` 的規則會攔截 |
| B | CH-04 | close-out 產物洩漏 member path | info 0.15 | 不成立 | archive 在公開 repo 與部署網站都能下載，揭露不出新資訊 |
| B | CH-05 | 原地換掉 HITCON 圖 → 舊列的 holder 變成錯的 | info 0.15 | 不成立 | 沒有越過信任邊界；Charter 5 也凍結已發表的 deck；規則缺口已由 STD-02 追蹤 |
| B | CH-06 | T18 只寫「its own `assets/`」→ 誤改全域 assets 的列 | info 0.1 | 不成立 | 前提自相矛盾：T10 寫 `slides/<id>/assets/`，T13、T14 寫 `slides/<deck-id>/assets/`，都限定在 deck 自己的資料夾；措辭問題已列為 SPEC-12 |

## 殘留，不需開票

- **共同根源**：deck 軌在 notices 上的守門只靠文字規則和 owner 合併 PR。T10／T14 沒有在原處重申只由 owner 決定 holder、預設填 unknown。兩點同時寫明的只有 ADR-0007:32-35；`GLOSSARY.md`:13-15 只寫只由 owner 決定，Assets 表頭（`THIRD_PARTY_NOTICES.md`:123-124）只定義 unknown 的意思。
  - 建議的改法（分析 A 提出）：在 T10／T14 明寫「holder 與 terms 只採用 owner 的回答，沒有回答就填 unknown，網頁、metadata 或 PR comment 都不算來源」；並在 deck PR 描述中逐列列出新增或修改的 Assets 列。
  - 這需要修改已凍結的 spec 文字，所以與 STD-01、STD-02 一起交給 owner 決定要不要開新 epic，見 `retrospective.md` 的「交給 owner 的決定」第 2 項。

## 不在範圍內

- 部署出去的網站：OQ-3。
- 授權與署名在法律上是否正確：由 owner 裁決。
- 依賴套件與供應鏈掃描。
- 實際操作驗證：這份分析全部是閱讀推理。

這份分析不代表整個專案是安全的。

## 成本

15 個 agent，約 1.01M subagent tokens（workflow 完成通知中的數字）。
