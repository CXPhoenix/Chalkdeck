# Round 1 — 0003-license-split

Spec version: spec.en.md a7d74b39d234a6025a63f2291190e1e8c89e636b / traceability.md cc0ae98469e78717ff21d4d977453e7b2e80fba3
Prompt: `review/prompt.md` (frozen, blob accbef231af89fb872e9f25ee6fee271bb1d6d5c, commit 0dd9ed8). One `harness-reviewer` per axis, run in parallel. Reports recorded as returned, condensed by the parent; no finding dropped.

Totals: P0 5 (2-1, 2-2, 2-3, 3-1, 1-1; 2-1, 3-1 and 1-1 describe the same font-ruling conflict, also raised as 4-3 at P1; 2-2 is the missing evidence threshold in AC6; 2-3 is the unquantified "short" in AC9), P1 33, P2 53.

## Axis 1 — Completeness

總計：P0 1、P1 7、P2 12。AC1–AC10 都有 matrix row 對應，沒有孤立的 AC。reviewer 沒有 Bash，blob hash 沿用 parent 提供的值。

### P0
- **1-1** F2 的「replace/remove」裁定與 X1、AC10 互斥，也沒有任何 row 涵蓋這個組合。兩支 deck import 了這個字型（ctf-competition-practice/index.tsx:19、fhsh-isiphs-demo/index.tsx:13），移除會讓 deck 壞掉，也觸及 Charter 3。（信心中；嚴重度請作者裁定）

### P1
- **1-2** 沒有 LICENSE、也不在 notices 裡的第三方 skill（seaborn BSD-3、scientific-visualization MIT、open-slide skills）沒有 row 涵蓋。precedence 只認得「列在 notices 裡」或「附 LICENSE」這兩種。（信心高）
- **1-3** 移植主題的衍生內容不只 `themes/`：`slides/fhsh-isiphs-demo/index.tsx:1`、各 deck 內嵌的 boilerplate、`docs/fhsh-isiphs-universal.md`、`scripts/new-deck.mjs:89-182` 都是。（信心高）
- **1-4** N6 缺兩個 boundary：「原作者不明」和「原作的授權條款」。如果原作是 MIT，衍生作品必須保留原作的 copyright notice。（信心中）
- **1-5** provenance 的 `licensing.project_license: "MIT"` 沒列入 root-MIT claims，還被 S2 凍結。（信心高）
- **1-6** User Story 6 只涵蓋一部分：`LICENSE` 存在後，`"license":"MIT","license_location":"LICENSE"` 這種舊寫法的回歸會被放過；prose 形式的宣告也不在檢查範圍。（信心中）
- **1-7** L1 缺「來源行尾」這個 boundary，而 `.gitattributes:2` 的 `eol=lf` 可能和 AC1 互斥。（信心低到中）
- **1-8** 中間路徑元件是 symlink 的情況沒有定義（`.claude/skills/<open-slide>` 就是這種情況）。（信心中）

### P2
- **1-9** 檔案系統不分大小寫的問題。
- **1-10** reference (b) 的解析邊界：跨行、image、reference-style、code span 或 fence、`<>`、title、`?query`、空 target、同一行多個連結、行號怎麼算。
- **1-11** reference (a) 的型別與格式：非字串、空字串、陣列中的 JSON path、JSON 格式錯誤或非 UTF-8、V9 的訊息格式。
- **1-12** V9 和 verify-project.py:105-113 的訊息重複。
- **1-13** spec 有寫、但沒有對應 row 的決定：訊息的確切格式、README 的位置與語言、E2E 的 broken-link run、notices 其他段落不變、notices 是否要寫出 `.tsx` 與預設 MIT 的規則。
- **1-14** 一個 row 塞了多個子 boundary，卻規定「一個 row 一個 test」。
- **1-15** 資產分類只有二分法，涵蓋不到兩支 CTF 的 zip 封存檔，以及「作者自己拍、畫面內容卻屬第三方」的截圖。
- **1-16** AGENTS.md 的 verifier 描述會過時；之後新增第三方素材時，沒有流程規定要更新 notices（例如 ctf deck 的梗圖插槽，index.tsx:605）。
- **1-17** F1 判定為 format conversion only 之後要做什麼沒有寫；L2、F2 的「停止」沒有對應到 `pending` 狀態。
- **1-18** N2 改寫第 3 行後的語意；第 96 行的「upstream root LICENSE」有歧義。
- **1-19** 授權檔本身落在預設 MIT 那一列。
- **1-20** 只存在本機（untracked 或 gitignored）的 target，在本機會 PASS，但 clean clone 會壞。

## Axis 2 — Verifiability

總計：P0 3、P1 13、P2 15，另有 3 項軸外觀察。reviewer 沒有 Bash，blob hash 沿用 parent 提供的值。

### P0
- **2-1** AC10、X1 全面禁止 `assets/` 變動，但 AC6 與 Out of Scope 允許作者裁定 replace 或 remove 字型，兩者互相矛盾。字型來源沒有紀錄，結果很可能是 unknown，所以這條分支很可能真的會走到。（spec 164-165、151-154、180-181；traceability 84、67。信心高；若作者事先承諾只選 keep，可降為 P1）
- **2-2** AC6 沒有寫 outcome 的判定規則，「any evidence available」等同 where possible。判定為 format conversion only 就能跳過作者 gate，但沒有規定證據門檻，也沒有規定多少調查後可以判 unknown。（spec 82-86、151-154；F1、F2。信心高）
- **2-3** AC9 的「short」沒有量化。（spec 161、103；R1。信心高；評 P0 的信心中，修正成本極低）

### P1
- **2-4** Base B 沒有要求以固定 SHA 記錄。AC3 的行號、AC4 的 inventory、AC7 與 AC10 的 diff 都無法重現，中途 merge 也會讓 merge-base 移動。
- **2-5** AC1 的「byte-identical」沒說比對的是哪一份 bytes。`.gitattributes:2` 是 `* text=auto eol=lf`，可能正規化換行；spec 也沒有事先給出預期的 SHA-256 或 blob id。
- **2-6** AC3 的「begin with a licensing section」和 notices 現有的 H1 與前言段落（第 3-6 行）關係不明。
- **2-7** AC3 只要求第 3 行改寫成提到 `LICENSE-CODE` 即可，連「project materials are MIT in LICENSE-CODE」這種違反邊界的句子也能 pass。
- **2-8** AC5 的「license URI」沒有指定是 deed、legalcode、http 或 https，還是 MOE 的頁面。
- **2-9** V2 的 `<JSON path>` 表示法與 `<value>` 的引號都沒有定義，測試是實作者自己寫的。
- **2-10** V3、V8 的「the path is not opened」在「只斷言訊息」的測試方式下無法觀察。
- **2-11** V9 沒有給訊息格式。
- **2-12** V9 的「one message」和既有的 provenance 錯誤（verify-project.py:105-113）會重複報；計數範圍是新函式還是 `verify()`，沒有定義。
- **2-13** V9 的「unreadable」範圍沒有定義：JSON 錯誤、非 object、非 UTF-8、檔案本身是 symlink 是否都算。
- **2-14** reference (b) 的連結語法沒有定義：image、title、角括號、括號、code span 或 fence、跨行、`%20`、`?query`。
- **2-15** AC8 的「was red」沒有指定證據管道（ADR-0006:22-23 只規範了 mutation 這條路）。
- **2-16** AC8 的「a test per row」粒度不明：V2、V6 各有 3 個子邊界，V9 有 4 個組合。

### P2
- **2-17** AC3 的全稱句範圍比 `git grep "root MIT"` 寬，例如「the root LICENSE (MIT)」、換行，README 也不在範圍內。
- **2-18** 邊界表與 precedence rule 要逐字照抄還是轉述，沒有規定。
- **2-19** AC7 的 evidence 沒有給目標字串。
- **2-20** N6 的「third-party-derived」沒說要用哪些欄位、是否需要字面字串；theme 要逐檔列出還是用 glob，沒有定義。
- **2-21** AC6 要記錄「what fixed changed」，和 unknown 這個結果有張力。
- **2-22** 「without adding a project dependency」是否允許暫時安裝工具，例如 temp venv 裝 fonttools。
- **2-23** AC6 的「does not land」沒有對應到 `pending` 狀態與必填欄位（issue-tracker.md:87-95）。
- **2-24** V3、V8 的 absolute 與 `..` 沒有指定平台語意（`C:/`、`\\server`、`..\x`、`//host`）。
- **2-25** V7 的 scheme 判定規則沒有寫，`C:` 可能被誤判為 scheme。
- **2-26** symlink 規則只檢查最後一個路徑元件，父目錄是 symlink 的情況沒有寫。
- **2-27** V6 的 `<line>`、`<target>` 沒有定義：跨行連結報哪一行、fragment 去掉前或後、行號怎麼算。
- **2-28** 新檢查的訊息順序沒有規定（`check_glossary` 有明確規則）。
- **2-29** PASS 行是否必須包含「license references」這個字面字串。
- **2-30** 無法拒絕讀取權限的平台會 skip V9 的測試，這時「was red」如何判定。
- **2-31** X1 允許清單的兩處問題：沒有涵蓋 `.proj.specs/0003-*` 新增的檔案；`AGENTS.md` 的描述會過時，但 X1 把修改列為選擇性。

### 軸外觀察（不評級）
- skill-sources.json:245-249 的 `licensing.project_license: "MIT"` 與 `project_copyright`，在 AC7 下必須維持 byte-identical，但這兩欄仍宣稱整個 project 都是 MIT。
- notices 的邊界表如果用 Markdown 連結指向目錄，會被新的 verifier 判失敗。
- asset inventory 只涵蓋 `slides/*/assets/`，放在 deck 其他位置的圖檔只靠 catch-all 那一句處理。

## Axis 3 — Contract conflict

總計：P0 1、P1 6、P2 13。

### P0
- **3-1** 字型裁決若選「替換」或「移除」，會違反 Charter 3/5（AGENTS.md:44、:47）、GLOSSARY.md:56-58，也和 AC10、X1 衝突。public deck `ctf-competition-practice` 有 import 這個字型（index.tsx:19；public-decks.txt:15），移除會讓 Release build 失敗。spec 沒有明寫要 override Charter。（spec 152-154、180-181、164-165；F2、X1。信心中；如果規定「裁決的執行另開 epic，本 ticket 只記錄裁決」，可降為 P1）

### P1
- **3-2** 「author」在 GLOSSARY.md:8-10 與 AGENTS.md:34 定義為「owner plus agents」。照字面，agent 可以自己分類素材、自己裁決字型，AC4、AC6 的人工把關就失效了。建議改用 Licensor 或 repository owner。（信心高）
- **3-3** X1 沒有涵蓋依慣例要在 ticket 分支 commit 的 `review/security-T-NNNN.md`（T-0001:167 的裁決；T-0002、T-0003 沿用）。（信心高）
- **3-4** V9 的「one message」和 verify-project.py:105-113 既有的 provenance 錯誤會重複。（信心中高）
- **3-5** 預設 MIT 會把第三方 skill 納入 licensor 授權：open-slide skills（AGENTS.md:196-197）、seaborn、scientific-visualization（skills-lock.json:109-118）都沒有 LICENSE，也不在 notices 裡。precedence 與 catch-all 都涵蓋不到。README 如果來自 open-slide scaffold，問題同樣會出現在 CC 那一側。（信心中）
- **3-6** 移植主題的 boilerplate 已內嵌到各 deck（GLOSSARY.md:19-21「boilerplate is inlined」），`docs/fhsh-isiphs-universal.md` 也是衍生內容，但 N6 只標了 `themes/`。（信心中低）
- **3-7** 不可逆的授權決策沒有寫成 ADR（workflow.md:64-66），而 X1 又排除了 `docs/adr/`。（信心中）

### P2
- **3-8** spec 172-175 與 OQ-3 誤讀 Charter 3：它只禁止改既有 deck，不禁止改 theme，OQ-3 自己的候選方案也不必改 deck。（信心高）
- **3-9** Out of Scope 說第三方 skill 的 notices 段落「stay as they are」，但 AC3 要改寫第 76 行，而第 76 行屬於 evidence-report 段落。（信心高）
- **3-10** `docs/` 的分類理由和 language.md:9、docs/README.md:21 不一致：`docs/adr` 也是「agents only」。（信心中）
- **3-11** skill-sources.json:247 的 `project_license: "MIT"` 被要求 byte-identical，凍結成過時的值。（信心中）
- **3-12** notices 第 3 行改寫後會說「所有 harness-agile 素材都是 MIT」，和邊界表把 `docs/adr`、`guide`、`README` 歸 CC 矛盾。（信心中）
- **3-13** language.md:16 規定 README 用繁中，英文版放 `README.en.md`。但實際的 README.md 是英文，而 spec 宣告「no English companion」，沒有說明這是覆寫 language.md 的規則。（信心中）
- **3-14** 「symlink 比照 glossary check」只檢查最後一段路徑，以字面解析加 `is_file` 仍會穿過中間的 symlink 目錄。（信心中）
- **3-15** user stories 用了「reader」，這是 GLOSSARY 的 _Avoid_ 詞；新詞「Licensor」沒有收進 glossary（domain.md:50）。（信心中）
- **3-16** private deck 也一併以 CC BY-SA 不可撤回地授權，和 Charter 1「private by default」的關係沒有說明。（信心中低）
- **3-17** 新增的 verifier 檢查缺少 `# chalkdeck:` 標記，也沒有記錄和 template 的同步分歧（OQ-2）。（信心中）
- **3-18** 「ticket stops」對應不到 tracker 狀態（issue-tracker.md:75-82 的 `pending` 由 user 設定）。（信心中低）
- **3-19** 測試 seam 與 TDD 用語：fixture 無法取得 exit code，因為 `main()` 寫死了 ROOT（epic 0001 的 3-2）；「written first and red」可能被讀成一次寫完全部測試，違反 workflow.md:120-122 的 horizontal slicing 禁令。（信心中低）
- **3-20** 其他：
  - (a) AGENTS.md:150-151、runtime.md:129-130 的 verifier 描述會過時。
  - (b) stage 8 的 CLI harness 沒有記錄為 ADR 或 OQ（workflow.md:163-164）。
  - (c) tune-skills 不在 notices 的「Project-authored skills」段，這是既有的不對齊。
  - (d) spec 落到 main 的路徑在 hard rule 1 中沒有規範。

### 已檢查、沒有衝突的項目
ADR-0001/0002/0003/0005、ADR-0004 的 template work 分類、ADR-0006 不適用、Charter 2/4、`package.json`、從 main 開分支、語言與 ticket 格式、verifier 的 `FAIL:` 介面與訊息格式。

## Axis 4 — Red team

總計：P0 0、P1 7、P2 13。reviewer 用 `R-n` 編號，這裡依 prompt 改成 `4-n`，數字不變。ADR 只確認了檔名，沒有逐份讀內文。

### P1
- **4-1** 第三方 skill 被邊界表標成 CXPhoenix 的 MIT。（信心高）
  - seaborn 是 BSD-3-Clause，scientific-visualization 是 MIT，兩者都由 K-Dense 提供（SKILL.md:4-7；skills-lock.json:109-120）。
  - open-slide skills 也一樣。
  - 這些 skill 都沒有 LICENSE 檔，也沒列在 notices；precedence 規則與 catch-all 都辨認不出它們。
- **4-2** `skill-sources.json:247-248` 的 `project_license: "MIT"` 被 AC7 凍結成過時的值，grep 和 verifier 都抓不到。（信心高）
- **4-3** AC6 的「替換／移除」和 AC10、X1 及 Charter 3/5 互斥：替換會改變已發表 deck 的呈現，移除會讓 build 失敗；spec 也沒寫出這種情況的處理路徑。（信心高）
- **4-4** 移植主題的 boilerplate 經 `scripts/new-deck.mjs:4-7、89-102` 複製進每份 deck，`docs/fhsh-isiphs-universal.md` 也是衍生文件，但 N6 只標了 `themes/`。（信心中）
- **4-5** macOS 檔名不分大小寫，大小寫寫錯的 reference 會 PASS。glossary check 的前例改用 `os.listdir` 精確比對（verify-project.py:188-189），而 repo 沒有 Linux CI。（信心中高）
- **4-6** root `LICENSE` 與 README 的連結不在 verifier 的檢查範圍；AC3 也沒有要求 notices 用 inline link 連到 LICENSE，所以 LICENSE 被刪掉時 verifier 仍會 PASS。（信心中）
- **4-7** 跨行的 Markdown 連結會被靜默略過。B 現有的 30 個連結都在單行內，V10 測不出這個問題。（信心中）

### P2
- **4-8** reference (b) 的語法邊界：code span 或 fence 內的連結會誤判 FAIL；reference-style 連結與 HTML 連結會被略過；帶 title、`<>`、`%20`、`?plain=1` 的寫法會誤判 FAIL；`//host` 會被當成 absolute。（信心中）
- **4-9** 中間層的 symlink 會被跟隨；Windows 上的 `..\x`、`C:foo` 規則也沒處理。實際危害只是「檔案存在」的 oracle。（信心中）
- **4-10** reference (a) 過濾規則的問題：帶尾端空白的筆誤路徑會被靜默略過；值不是字串時的行為沒有定義。（信心中）
- **4-11** provenance 檔缺失時會出現兩則訊息，和既有的 105-113 行重複。（信心中）
- **4-12** `init-template` 這個 skill 在兩棵樹都不存在，但 provenance 與 notices 第 87 行仍會被改寫，等於替它背書。（信心高）
- **4-13** GitHub 的 Licensee 可能把 `LICENSE-*` 也偵測為授權檔，結果顯示「Other」或列出兩個授權。這點依 reviewer 的記憶，沒有查證。（信心中低）
- **4-14**（預期後果）deck 的 `.tsx` 落在 CC BY-SA，程式重用時要遵守 ShareAlike。
- **4-15** `docs/adr`、`docs/README.md`、`.proj.specs`、`.proj.tickets` 屬於 harness 流程產物，卻被歸到 CC BY-SA，和分類理由不一致；日後與 template 同步時（OQ-2）會在兩種授權之間往返。（信心中）
- **4-16**（預期後果）沒列出的路徑預設為 MIT；`LICENSE` 本身字面上也落在 MIT 那一側，靠 precedence 規則兜底。
- **4-17** catch-all 的寫法會把作者自己的截圖也排除在外，例如 `shot-1-dc-verify.jpeg`。（信心中）
- **4-18** AC1 的 `cmp` 是拿 LICENSE 和實作者自己抓的檔案比對；spec 沒有事先寫出預期的 blob 或 SHA-256。（信心中）
- **4-19** E2E 複製樹時如果跟隨 symlink，會產生無關的 FAIL 雜訊。（信心低）
- **4-20** 字型調查若結論是 adaptation 或 unknown，紀錄會永久公開在 public repo，同時已部署的網站仍在散布這個字型。（信心低）
