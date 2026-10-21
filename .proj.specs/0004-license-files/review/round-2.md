# Round 2 — 0004-license-files

Spec version: spec.en.md 041628e5bd13d1c86ac48d3b3623f22396a0c057 / traceability.md 102da03488adcd9b83e1572bd03537b1dd2c9fcf
Prompt: `review/prompt.md` replayed verbatim (blob 7b85650a0d2f91502a39bcca0ca12b14931b7c3a). One `harness-reviewer` per axis, run in parallel. Reports recorded as returned, condensed by the parent; no finding dropped.

Totals: **P0 0**, P1 14 (axis 1: 3, axis 2: 5, axis 3: 5, axis 4: 1), P2 57, plus axis 4 expected consequences. The stage-3 gate (zero P0) is met.

Reviewers on axes 2, 3 and 4 ask the owner whether to escalate P1 findings whose fix needs T-block text that the ACs require verbatim (2-5, 3-2 to 3-5, 4-1).

Parent checks after the reports:
- `git diff --name-only f1a29c7 869a637` over the S0 target files lists only `GLOSSARY.md`, as the S0 table expects.
- Archive check, run read-only on both `.zip` (central directory only, no extraction, no member names printed): bluechall-master.zip 200 members, webchall-master.zip 236 members; no base name starts with LICENCE/LICENSE/UNLICENSE/COPYING/COPYRIGHT/NOTICE; no nested `.zip`; webchall-master.zip has one `package.json` (read in memory: no `license` field, `"private": true`).
- `git log --follow -- open-slide.config.ts`: changed after 05d62cd by 7e95064 and ced6d13 (deployment settings), so T13's "unchanged" is wrong for that file (3-4, 4-8 confirmed).

## Axis 1 — Completeness

總計：P0 0、P1 3、P2 15，另有 1 項軸外觀察。沒有孤立的 AC；T1–T15 與每個定義都有 row 對應。

### P1
- **1-1** rebase 之後是否要重做 drift 檢查，沒有對應的 row。漂移檢查只在第一則 Comment 做一次，而行號定位依賴 B = S0。
- **1-2** drift 集合沒有涵蓋 `@open-slide/core` 的已安裝版本、LICENSE，以及 skill 的內容。如果 S0 與 B 之間有人升級 open-slide，T5 會悄悄變成錯的。
- **1-3** archive check 命中授權檔之後，下一步怎麼做沒有寫，T1 與 T4 又是逐字比對。（建議 parent 先跑一次 archive check，確認這條分支是否會觸發）

### P2
- **1-4** 檔名比對漏了 LICENCE、UNLICENSE、COPYRIGHT、`package.json`，也沒處理巢狀 zip。
- **1-5** `.agents/skills/tdd/LICENSE` 不在 drift 集合裡。
- **1-6** 新路徑（LICENSE、ADR-0007）在 B 上已經存在的情況，不算 drift。
- **1-7** drift 只比對 `.claude/skills` 的 symlink；`.agents` 新增的第三方 skill 不會被偵測到。
- **1-8** GLOSSARY 的基準 commit 沒有定義；也沒有 row 檢查 B 是否包含 spec 落地的那個 commit。
- **1-9** deck track 例外列出的四處不完整：AGENTS.md:50、workflow.md:33/36-37、deploy-and-google-sites.md:12/19、ADR-0004:8/27-28 仍寫著原本的規則，而 G3、W1、X1 讓這些在 ticket 內無法修改。
- **1-10** T10 的「quotation or code」不是檔案，在 T4 的 Assets 表裡無法建 row；deck 內嵌的第三方內容也不在 inventory 裡。
- **1-11** spec 說 ADR-0007 會記錄「notices public once pushed」，但 T13 沒有這一條。
- **1-12** AC9 寫「all three」，實際列了四項。
- **1-13** 流程類要求沒有 row：test plan 與 coverage table、「不 merge main」、status、drift 後回到 stage 2 之後要不要重新審查。
- **1-14** spec 預設只有一張 ticket；如果 stage 4 拆成多張，X1 與「四處一起落地」都沒有定義。
- **1-15** 除了 L1 與 L2，其他檔案的 file mode 都沒有檢查。
- **1-16** N7 的防外洩範圍沒有涵蓋 security report、commit message、PR 與 E1 的截圖。
- **1-17** S0 的 asset blob id 沒有列出，取得 blob 的指令也沒寫。
- **1-18** 其他：ADR date 可能出現多行；E1 沒有涵蓋 T12 與 T14 的連結（reviewer 已人工確認可以解析）；C1 的標題比實際範圍寬；AC10 的「first Comment after B」與 B 定義中的「first entry」衝突。

### 軸外觀察
- notices B 版的第 70、71、94 行仍有 Avoid 詞「maintainer」，但 N4 凍結了這幾行。

## Axis 2 — Verifiability

總計：P0 0、P1 5、P2 8，另有 3 項軸外觀察。reviewer 表示，若依凍結 prompt 的字面解讀，2-5 可以升為 P0，請使用者裁定。

### P1
- **2-1** AC4 要求依 path 與 blob 比對，但指定的 `git ls-files` 指令只輸出路徑，讀的也是 index，不是 B。建議改用 `git ls-tree -r <B> -- <pathspec>` 對照 S0，或直接列出 19 個 blob id。
- **2-2** 「no archive member name is published」沒有定義怎麼比對：完整路徑、base name 還是子字串？`*-master/` 這個頂層目錄名稱和 inventory 輸出裡的檔名重疊。範圍也沒有涵蓋 commit message、PR 描述與 security report。
- **2-3** GLOSSARY 的漂移基準是「spec 落地時的 blob」，但沒有寫明是哪個 commit；「entry」包含哪幾行（62–64？）也沒有定義。
- **2-4** rebase 產生新的 B 之後，要不要重做 drift check 沒有規定；AC10 的「first Comment after B」有兩種讀法。
- **2-5** AC10 的漂移分支「no target file was edited before the spec was revised」沒有寫出檢查方法；尚未 commit 的修改也無法觀察。依凍結 prompt 字面可升為 P0；reviewer 評 P1，理由是只在發生漂移時才會觸發。

### P2
- **2-6** AC9 寫「all three hold」，底下卻列了四項。
- **2-7** 刪除 init-template 時，S7 的 text diff 會因 diff 演算法不同而出現兩種合法的最小 diff。建議改成「依 S1–S6 組出預期全文，再逐 byte 比對」。
- **2-8** AC12 的「rendering」與 E1 的定義不一致（表格渲染壞掉算不算失敗）；workflow 允許用等效工具，AC12 卻只寫 `/agent-browser`。
- **2-9** ADR date 的 `git log` 沒有指定 ref；squash 落地後日期可能改變；AC1–AC10 都沒寫判定的時間點。
- **2-10** symlink set 是否要連目標一起比對，沒有規定。
- **2-11** AC4 沒有要求 inventory check 必須在修改任何目標檔之前完成。
- **2-12** drift 沒有涵蓋「新路徑（LICENSE、ADR-0007）在 B 上已存在」的情況。
- **2-13** 「fetched byte for byte」和 AC1 的 blob id 可能分歧（CC 官網若改版），且沒有停止規則。

### 軸外觀察
- **A** 請 parent 確認 spec 分支 HEAD 沒有修改另外 8 個目標檔。
- **B** T14 加入後，workflow.md:36-37 的原本規則與新例外並存在同一份文件裡。
- **C** PR 描述、commit message 與 evidence report 不在 AC4 的檢查範圍內。

## Axis 3 — Contract conflict

總計：P0 0、P1 5、P2 13，另有 1 項軸外觀察。reviewer 指出：3-2、3-4、3-5 要修就得改 T-block 原文，3-3 則要改受 W1／G3 保護的檔案，所以都無法在 ticket 內修正；是否要比照 round 1 升為 P0，請使用者裁定。

### P1
- **3-1** 發生 drift 時要「回 stage 2 修改 spec」，但 spec 審查後即凍結（issue-tracker.md:30），審查又最多兩輪（ADR-0003）。改完的 spec 不管怎麼處理都會違反其中一條規範。
- **3-2** T10 的範圍（包含 quotation 和 code，也包含全域 `assets/`）比 ADR-0007 與 T14 允許的「only its own asset rows」大。
- **3-3** workflow.md:33-37、AGENTS.md:50、ADR-0004:8-10/27-28、GLOSSARY 的 Template work 定義，都仍寫著「只能動 `slides/<deck-id>/`」的絕對句，和新增的例外直接矛盾（allowlist 也有同樣的先例）。
- **3-4** T13 說 `open-slide.config.ts`「unchanged」，但檔案裡有本專案自己的部署設定，和 T5 的說法也矛盾。（parent 已用 git 查證：`7e95064`、`ced6d13` 都修改過這個檔案）
- **3-5** T10 與 T14 的「name no person」，和第三方授權要求的署名義務衝突，例如 CC BY 圖片必須標示作者。

### P2
- **3-6** Avoid 詞「maintainer」仍然出現在 notices 第 70-71 行，以及 S2 產生的新字串裡。
- **3-7** README 用英文，但 language.md:16 沒有同步修訂。
- **3-8** 「private decks… already public」和 GLOSSARY 對 Public deck 的定義衝突。
- **3-9** ADR-0004 本身沒有註記已被 ADR-0007 修訂。
- **3-10** ADR-0007 延到 ticket 才寫，和 workflow 要求「決策定案時就寫」不一致，spec 也沒有明說這是刻意的。
- **3-11** 純文件 ticket 跳過 `/tdd`，沒有 ADR 作為依據。
- **3-12** T8 的摘要和 T1 的細則不一致（deck 的程式碼歸 CC）。
- **3-13** AC12 只接受 `/agent-browser`，比 workflow 的規定嚴格。
- **3-14** 「close-out 時記錄 license detection」不在 close-out 的既定項目裡。
- **3-15** X1 允許寫入已凍結的 spec 目錄（屬既有慣例，僅記錄）。
- **3-16** 「docs/agents 歸 MIT」的理由，同樣適用於歸到 CC 的 ADR-0001–0003、docs/README、guide。
- **3-17** T11 的觸發條件漏掉 `pnpm dev` 的同步路徑。
- **3-18** User Story 1 和 GLOSSARY 對 Reuser 的定義有張力。

### 軸外觀察
- AC9 寫「all three」，但實際列了四項。

## Axis 4 — Red team

總計：P0 0、P1 1、P2 21，另有預期後果清單。reviewer 指出 4-1 要修就得改 T10、T14 的原文，是否要升為 P0 請使用者裁定。

### P1
- **4-1** T10 與 T14 的「name no person」套用到所有素材後，會和第三方授權要求的署名義務衝突：CC BY 要標作者，MIT／BSD 的 copyright 行常是個人姓名。這條規則在四個地方的寫法也不一致（T13、T15 沒有寫）。另外，spec.en.md:108 的全稱句被 T5（Yiwei Ho）推翻。（信心高）

### P2
- **4-2** deck 的輕量軌可以寫入承載整個 repo 授權的 notices，卻沒有任何守門（allowlist 至少還要求作者明確指示）。
- **4-3** T10 涵蓋 quotation 與 code，但 Assets 表只收錄檔案，兩者範圍對不上。
- **4-4** template work 加入第三方素材時，沒有對應的規則。
- **4-5** 「owner 的改動依授權表授權」寫成了通則，套用到 BY-ND 字型時，等於公開授權它的改作版本。
- **4-6** 只要放一個 LICENSE 檔，就可能在 owner 不知情的情況下改變某個目錄的授權歸屬。
- **4-7** ADR date 綁在 author date，squash merge 後可能失準；寫入時必須預測 commit 的日期。
- **4-8** `open-slide.config.ts` 的「unchanged」可能不符事實（parent 已查證屬實：後續有兩個 commit 修改過）。
- **4-9** drift 一旦觸發就停下，流程可能卡死；ticket 期間 deck 輕量軌新增的素材也會觸發 drift。
- **4-10** `assets/` 底下 7 個檔案全是第三方素材；T8 寫「code 是 MIT」，容易被誤讀。
- **4-11** 已講過的公開 deck 若收到素材下架請求，Charter 5 沒有提供處理途徑。
- **4-12** archive 的檔名比對範圍太窄。
- **4-13** E1 的截圖若放進公開的 ticket 目錄，可能帶進 GitHub UI 或帳號資訊。
- **4-14** 授權人身分綁在可以改名的 GitHub URL 上。
- **4-15** docs 底下的其他 scaffold 文字（例如 legacy-openspec/config.yaml）沒有署名。
- **4-16** T11 讓 package 的檔案進入 agent 的 context；觸發條件也漏掉 `pnpm dev` 的同步路徑。
- **4-17** 指令文件之間仍然互相矛盾（同 3-3）。
- **4-18** T13 的「未給來源視為 third-party」照字面讀，會套用到整個 repo。
- **4-19** 單一 Assets 表容易產生 merge conflict；deck 改名或刪除後會留下過期的列。
- **4-20** notices 本身不在授權表的範圍內。
- **4-21** 下游工具可能只讀根目錄的 LICENSE，把整個 repo 標成 CC-BY-SA。
- **4-22** 來自 harness-agile 的 docs 歸 CC，但歸類理由前後不一致。

### 預期後果
ShareAlike、允許商業使用與 GPLv3、授權無法撤回、新路徑預設 MIT、GitHub 顯示兩個授權、notices 公開、private deck 也一併授權、boilerplate 同時採 CC 與 MIT、README 用英文、部署網站沒有 notices、字型不調查、CTF 壓縮檔歸 owner 並採 CC。
