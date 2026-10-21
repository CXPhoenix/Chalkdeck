# Round 2 — 0003-license-split

Spec version: spec.en.md 21d972f3a5f99ec7e0a54bf082a335a05697a203 / traceability.md 76a1f9c05220c318651982808e1fd424e892c25b
Prompt: `review/prompt.md` replayed verbatim (blob accbef231af89fb872e9f25ee6fee271bb1d6d5c). One `harness-reviewer` per axis, run in parallel. Reports recorded as returned, condensed by the parent; no finding dropped.

Totals: P0 4 (1-1, 2-1, 3-1, 4-1 — one defect: the notices lines named for the init-template and root-MIT edits are 87, but at B init-template is on line 86 and the sentence spans lines 87-88, so N2/N3/AC3 cannot all hold), P1 23, P2 67 (61 findings plus axis 4's 6 expected consequences I-1 to I-6).

The defect behind the P0 dates from revision 1 (which also named line 87) and was not reported in round 1.

## Axis 1 — Completeness

總計：P0 1、P1 9、P2 15。AC1–AC11 都有對應的 row，每一列 row 也都對應到 AC。

### P0
- **1-1** notices 的行號錯了。init-template 實際在第 86 行，「root MIT LICENSE」那一句跨第 87–88 行。N2 要求改這些內容，N3 卻要求其餘行不變，兩者無法同時滿足；照字面只改第 87 行，「no longer lists init-template」又是不改也成立的空條件。這和軸 3 的 3-1 是同一件事。（信心高）

### P1
- **1-2** Definitions 允許「owner 沒分類就視為 third-party」，但 N4、AC4 要求每個檔案都要引用 owner 的分類，兩者互斥。
- **1-3** 兩個 `.zip` 的內容說明沒有對應的 row 或 AC。
- **1-4** 沒有任何 AC 驗證 `verify()` 確實呼叫了新函式；只改 PASS 行也能通過 V15。E2E 那次執行也沒有 row。round 1 的 1-13 仍未解決。
- **1-5** no-Git 訊息的 `<reason>` 沒有列出：不在 work tree、沒有 git 執行檔、safe.directory、root 不是 toplevel 等情況。
- **1-6** 非字串值的 `<value>` 要怎麼印出來，以及引號或換行要怎麼 escape，都沒有定義。
- **1-7** reference (d) 的邊界不完整：同一筆 entry 同時解析失敗又 mismatch 時怎麼處理；缺 `LICENSE` + `CC-BY-SA-4.0` 的正向案例；`license` 不存在或不是字串；mismatch 訊息的 pointer 指向哪一個欄位；是否只認完全相等的字串。
- **1-8** unreadable 的 reason 沒有涵蓋目錄、權限、其他 OSError；V10 沒有對 provenance 測 symlink 和 non-UTF-8；父層路徑是 symlink 的情況沒定義；notices 讀不到時是否還報缺少 required link；BOM 怎麼處理。
- **1-9** precedence 的判準是「列在 notices」或「帶有 LICENSE」，會把 owner 自己的作品判成 third-party：notices 83-99 列了 project-authored 與 slide-style-design，mixed 檔案也列在 notices，evidence-report 還帶有上游 LICENSE。
- **1-10** stale entry 還出現在 :239 `local_adaptations.init-template` 和 :23 `claude_prompt_audit`，但 S3 凍結了這兩處。

### P2
- **1-11** reference (c) 的比對語意沒有定義（`./LICENSE`、`#x`、`<>`、image）；`.` segment、空 segment、結尾 `/` 也沒有定義。
- **1-12** (a) 和 (b) 測試的案例不對稱：(a) 缺 `//host`；(b) 缺 backslash 和空 destination。
- **1-13** CommonMark 的邊界不完整：indented code、HTML comment、未關閉的 fence、成對括號、backslash escape、`%20`、`?query`、destination 換行、column 怎麼算、`<>` 是否保留；`ab:c` 會被當成 URL 而略過。
- **1-14** 同一個 target 有多重缺陷時，應回報哪一個 reason 沒有定義；`<actual path>` 的範圍、NFC/NFD 的差異也沒有定義。
- **1-15** `git ls-files` 沒有加 `-z`，會受 quotePath 影響。
- **1-16** D1 漏列幾項決策：CC/MIT 二分本身、private deck、spec 與 ticket 樹的授權歸屬、不採用 SPDX/REUSE。
- **1-17** README 段落「near the end」的位置要求沒有 row。
- **1-18** 流程證據沒有 AC：B SHA 是否寫進 Comments、red output 對應的 commit、第三方 skill set 重新推導的證據。
- **1-19** N7 缺 BSD-3/MIT 要求保留的 copyright notice；open-slide 版本要不要記錄；`.claude/skills` 的 symlink 路徑怎麼處理；只存在 `.claude/skills` 的第三方 skill 怎麼處理。
- **1-20** inventory 範圍外的第三方素材（deck 內的 inline SVG、`themes/*.demo.tsx`、docs 裡的圖）只靠 catch-all 涵蓋。
- **1-21** notices:96 寫「upstream root LICENSE」，拆分後容易混淆；B 第 5-6 行「Preserve applicable notices」沒要求保留。
- **1-22** `verified_on` 會過時（同 3-9）。
- **1-23** 這幾項沒有 row：「GitHub shows LICENSE first」、`LICENSE` 的 file mode、「No SPDX headers」的範圍、verifier 與測試的模組 docstring。
- **1-24** V13 沒有指定要組合哪些案例。
- **1-25** 新訊息在 `verify()` 輸出中的位置沒有定義。

### 軸外觀察
- spec.zh-TW.md 不存在。依 language.md，它要等審查通過後才產生。

### round 1 仍未解決
1-13（E2E 沒有 row）、1-18（第 96 行）。

## Axis 2 — Verifiability

總計：P0 1、P1 9、P2 17，另有 2 項軸外觀察。

### P0
- **2-1** AC3 的行號錯誤：init-template 在第 86 行，句子跨第 87–88 行。照正確意圖實作會違反「Nothing else changed」；照字面實作則會留下 stale 紀錄。AC3 寫「Lines 76 and 87」時沒有標明 B，在 HEAD 上也有歧義。這和 1-1、3-1 是同一件事。（信心高）

### P1
- **2-2** S1 要改「five」個值，但 S2 刪掉了其中一個 init-template，所以 HEAD 只會有 4 個 `LICENSE-CODE`，S1 照字面不可能成立。
- **2-3** V15 驗不到新函式有沒有接進 `verify()`。PASS 行是靜態字串，只改 print 也能通過；E2E 又沒有對應的 AC。（同 1-4）
- **2-4** 期望結果是「no message」的 sub-case（V1、V4、V6×5、V8×5、V14 第三項），只能靠副作用變成 red。什麼算合格的 red 沒有定義；ADR-0006 的 mutation 方法在這裡不適用。
- **2-5** 訊息 placeholder 沒有完整定義：非字串 `<value>`、escape、`<actual path>` 與 `<component path>` 的範圍、no-Git `<reason>`（直接用 git stderr 會因版本與 locale 而不同）。
- **2-6** notices 讀不到時，(c) 的 missing-required-link 要不要報，沒有定義。
- **2-7** (c) 的比對規則沒有定義：`LICENSE#x`、`./LICENSE`（README 現有的連結就是 `./AGENTS.md` 這種寫法）、`<>`、image、code 內的連結。
- **2-8** Definitions 允許 owner 不分類，但 AC4 要求每個檔案都要 quote owner 的分類。（同 1-2）
- **2-9** AC4 的 owner 與 terms 值由誰提供、在什麼條件下可以寫「unknown」，都沒有規定；全部填 unknown 也能 pass。
- **2-10** 兩個 `.zip` 的說明沒有對應的 AC。（同 1-3）

### P2
- **2-11** reference (d) 有三點未定義：pointer 指向哪個欄位、同時無效又 mismatch 時報哪一則、非字串的 license 怎麼印。
- **2-12** 複合失敗時 reason 的優先序有歧義：如果「exists」是用精確比對判斷，`differs in case` 永遠到不了。
- **2-13** 這些情況沒有定義：`%20`、indented code、`./`、`a//b`、結尾的 `/`、Unicode 空白。
- **2-14** sub-case 怎麼計數（V3、V4 的「or」算一個還是兩個）沒有定義；V13 也沒有規定要涵蓋哪些群組。
- **2-15** 不支援 symlink 的平台會 skip 測試，這時怎麼判 pass 與 red 沒有定義（round 1 的 2-30 仍未處理）。
- **2-16** AC9 的行數要不要算空白行、「next heading」是否包含任何層級（加一個 `###` 就能繞過），都沒有定義；「near the end」也沒有 AC 對應。
- **2-17** AC11 用 `--stat` 判定，但 `--stat` 會截斷長路徑；應改用 `--name-only`。（信心高）
- **2-18** N1 的內容要逐字照抄還是可以轉述沒有規定；licensor 的連結目標也沒有指定（round 1 的 2-18 仍未處理）。
- **2-19** N3 允許新增的內容沒有列入 N6，但 MOE 字型 entry 若獨立成一段就需要 N6。
- **2-20** 第三方 skill set 的推導規則、N7 的 source 格式、`@open-slide/core` 授權的版本與讀取來源，都沒有定義。
- **2-21** S1 的 evidence 字串沒有給目標文字；N2 的 grep 範圍太窄（round 1 的 2-17、2-19 仍未處理）。
- **2-22** E2E 的判定條件有歧義；V15 要寫成 unit test 還是手動執行也不清楚。
- **2-23** ticket 分支 merge 過 main 之後，`B...HEAD` 會失真；spec 沒有說是否禁止 merge。
- **2-24** V11 規定提早返回，和訊息順序清單裡「no Git 與 unreadable 並列」不一致。
- **2-25** R1 的「states the split」、D2 的「mentions」需要詮釋。
- **2-26** owner 的引述無法在 repo 內驗證來源，這是流程本身的限制。
- **2-27** red 證據記錄的 commit 不包含當時的測試內容。

### 軸外觀察
- provenance 的 :23、:239 也有 init-template（同 1-10、3-10）。
- `verified_on` 會過時（同 1-22、3-9）。

## Axis 3 — Contract conflict

總計：P0 1、P1 1、P2 10，另有 3 項軸外觀察。

### P0
- **3-1** 行號和 B 對不上：`init-template` 在 notices 第 86 行；「root MIT LICENSE」那句跨在第 87–88 行。N3、AC3 凍結了其他所有行，所以照字面實作，要嘛 notices 仍列著 init-template、第 88 行的 `LICENSE.` 懸空，要嘛違反 N3。（traceability 85-86、150-151；spec 90、167-170。事實面信心高；評為 P0 的信心中，把行號改成 86–88 即可修正）

### P1
- **3-2** X1 沒有涵蓋 `docs/README.md` 的 ADR 索引（32-41 行列出 ADR-0001 到 0006；epic 0002 新增 ADR-0006 時有補上）。新增的 ADR-0007 會沒有入口。（信心高）

### P2
- **3-3** verifier 新增了需要 Git 的前提，和 AGENTS.md:150「Portable」、runtime.md:129-130、verify-project.py:5「run from any working directory」的描述衝突；在非 Git 的複本上會 FAIL。D2 沒有要求在描述中寫出這個前提。
- **3-4** docs/guide.md:50、:60 與 README.md:51 的 verifier 描述會過時，但 X1 不允許修改這兩個檔案。
- **3-5** 新名詞 Repository owner、Licensor，以及新的利害關係人「reuser」，都沒有收進 GLOSSARY 或 Charter 的「Who it serves」（AGENTS.md:34-38、domain.md:46-50）。
- **3-6** 「private deck」的用法和 GLOSSARY.md:28-31 的定義不一致；spec 也沒有說明這和 Charter 1 的關係。
- **3-7** D1 漏掉幾個屬於 ADR 等級的決策：private deck 一併授權、spec 與 ticket 樹歸 CC、precedence、二分授權本身。另外 ADR 排在 ticket 階段才寫，和 workflow.md:64-66「as it settles」不一致。
- **3-8** README 語言的分歧再擴大（spec 已明示），language.md 也沒有加註記。
- **3-9** S3 凍結了 `licensing.verified_on: "2026-09-13"`，和改寫 `project_license` 的日期矛盾。
- **3-10** stale entry 只移除了一部分：provenance 有三處提到 init-template（:23 `claude_prompt_audit`、:105 `skills`、:239 `local_adaptations`），S2 只移除 `skills` 那一處。
- **3-11** 「the theme `themes/fhsh-isiphs-universal`」是路徑式寫法；實際檔案是 `.md` 與 `.demo.tsx` 兩個。
- **3-12** stage 8 的非瀏覽器 harness 沒有寫成 ADR，也沒有列入 OQ（workflow.md:163-164）。這是 round 1 的 3-20(b)，仍然存在。

### 軸外觀察
- **A** V11 規定沒有 Git 時不得回報其他 license-reference 訊息，但訊息順序表又讓「no Git」可以和「unreadable inputs」一起出現，兩者互斥。
- **B** 同一份主題 boilerplate 在 `scripts/new-deck.mjs` 裡是 MIT，在 `themes/` 和 deck 裡是 CC，可以透過 `scripts/` 繞過 ShareAlike。
- **C** Testing Decisions 沒有提到 test plan table 的核准 gate。

### 已解決的 round 1 項目（reviewer 確認）
3-1（font）、3-3、3-9、3-10、3-11、3-17。

## Axis 4 — Red team

總計：P0 1、P1 4、P2 19，另有預期後果 I-1 至 I-6（P2）。reviewer 讀完了 ADR 0001–0006 全文，並實際檢視了兩張 ctf 圖檔。

### P0
- **4-1** notices 的行號錯誤。init-template 在第 86 行；句子跨第 87–88 行，第 88 行開頭的「LICENSE.」被凍結，只改第 87 行很容易寫成「MIT ... LICENSE.」這種又指回 CC BY-SA 的句子。（同 1-1、2-1、3-1。信心高）

### P1
- **4-2** 「licensor-owned」是用「誰做的」來判定，不是用「誰持有著作財產權」。依台灣著作權法第 11 條（職務著作，契約未約定時歸雇用人）與第 12 條（出資聘人著作，依契約），為學校或計畫製作的 deck 與主題，著作財產權可能不屬於作者。主題的裁定也只回答了作者身分。建議由 owner 確認權利歸屬。（信心中）
- **4-3** N7 只要求寫出 source 與 terms，但 MIT 與 BSD-3 都要求保留 copyright notice 與授權全文。open-slide 是「Copyright (c) 2026 Yiwei Ho」（@open-slide/core@2.2.0 LICENSE:3）；K-Dense 的 frontmatter `license` 可能指底層 Python 套件，不是 skill 本身；主 checkout 同時裝了 1.17.1 與 2.2.0 兩個版本。（信心中高）
- **4-4** agent-browser 的修改聲明寫「see LICENSE … in the project root」（兩棵樹的 SKILL.md:12-13），落地後會指向 CC BY-SA。X1 不允許修改這兩個檔案，verifier 也不檢查散文。（信心高）
- **4-5** N5 的 catch-all 只列出標誌類，涵蓋不到之後新增的第三方照片、插圖、文字與程式碼；asset inventory 也不含 deck 內嵌的引文與程式碼。（信心中高）

### P2
- **4-6** third-party skill set 固定在 B；之後 sync 或 installer 新增的外部 skill 都會預設為 MIT。
- **4-7** 「classified licensor-owned」只記在 Comments，reuser 看不到；B 之後作者自己做的截圖也會一律被排除。
- **4-8** precedence 照字面讀範圍過寬：「listed in the notices」連 licensing section 自己列出的路徑、作者自己的 skill 段落都包含在內；「carries its own LICENSE」對 root 本身也成立；mixed 檔案會整個變成第三方。
- **4-9** README、AGENTS.md 的 open-slide 段落與設定檔可能來自 scaffold，沒有保留 Yiwei Ho 的 MIT 聲明。（信心低到中）
- **4-10** git subprocess 帶來的問題：非 Git 副本永遠 FAIL（runtime.md:129 要求交出副本前先跑）、safe.directory、Windows 會先找目前目錄的 `git.exe`、`.git/config` 的 fsmonitor、沒有 `-z`、讀的是 index。
- **4-11** 測試 fixture 會繼承 `GIT_DIR`、`GIT_INDEX_FILE` 等環境變數，可能寫進真正 repo 的 index；TMPDIR 位在 repo 裡時 V11 不成立；V15 依賴真實樹的狀態。
- **4-12** provenance 的 :23、:239 仍有 init-template，`verified_on` 也會過時。（信心高）
- **4-13** 「cannot return silently」說得太滿：散文指向、README 的連結、reference-style 連結、含空白的 `license_location` 都抓不到。（信心高）
- **4-14** FAIL 訊息原樣輸出控制字元與換行，可能偽造出假的輸出行。
- **4-15** 解析可能誤判：indented code 與 HTML comment 裡的連結（`<!-- [x](LICENSE) -->` 讓 (c) 在畫面上看不到連結時通過）、backslash escape、`%20`、`?plain=1`、`notes:x.md` 被當成 scheme。
- **4-16** 逐段解析的邊界：PermissionError、Windows junction、NFC/NFD、父目錄是 symlink 時仍會讀到 repo 外。
- **4-17** 分類只看著作權，沒有考慮肖像權與個資：`788abeb3-…png` 是人像照，`shot-1-dc-verify.jpeg` 有第三方的暱稱與訊息；N4 要求公開點名 owner，對象可能是未成年學生；CC 4.0 §2(b)(1) 不授權肖像權，notices 也沒有說明。
- **4-18** 公開承認「來源 unknown 卻持續散布」，在法律上可能更不利。
- **4-19** 處理兩個 `.zip` 時可能直接解壓（zip-slip、惡意 payload）；公開的內容說明可能洩漏 flag；題目原始碼也因此變成 CC。
- **4-20** MOE 字型署名不完整：§4(b) 還要求作品名稱與來源 URI（保留字型、不做調查是 owner 已接受的結果）。
- **4-21** 兩個授權檔本身都沒有寫明適用範圍：MIT 的「associated documentation files」可能被讀成涵蓋 docs；GitHub 可能顯示 NOASSERTION。
- **4-22** third-party skill set 由 agent 自行判定，素材卻要經過 owner gate，兩者不對稱；Comments 裡的 quote 無從驗證。
- **4-23** E2E 用的 git worktree 沒有清理規定。
- **4-24** 之後產生的 evidence report（含 huashu-design 衍生的設計）會自動落入 CC BY-SA，也沒有對應的聲明。

### 預期後果（P2）
- **I-1** deck 程式碼適用 ShareAlike。
- **I-2** 未列出的路徑預設 MIT；`slidesDir` 搬到別的目錄或新增 `public/` 都會落到 MIT。
- **I-3** GitHub 可能顯示兩個授權。
- **I-4** notices 落地後就是公開資料。
- **I-5** private deck 一併授權，而且不可撤回。
- **I-6** BY-SA 允許商業使用；對 GPLv3 有單向相容。

## Rulings (repository owner, 2026-10-21)

- **Gate:** P0 findings survived round 2, so under AGENTS.md hard rule 3 the epic is split and
  restarted at stage 1. Owner's answer: "照規則拆 epic". The successors are:
  - **0004** — license files, notices, provenance records, README section and ADR. Documentation
    only.
  - **0005** — the verifier's license-reference check. It depends on 0004 landing.

  Decisions settled in 0003's grill and round-1 rulings carry forward unless a successor's grill
  reopens them. Every round-2 finding is input to the successor it concerns.
- **4-2, ownership of economic rights:** asked whether the copyright in the decks, themes and
  documents belongs to the owner, given Copyright Act articles 11 and 12. Answer: "屬於我".
