# 安全審查報告 — T-0002

- 範圍：分支 `tickets/T-0002/vendor-style-skills`（獨立 worktree），base `3cfa72b53ff23d5908b73db6800ea5aa35c957f1`（merge-base 相同），HEAD＝V `d1c8857b0d668ad565d26da4a8bbdbb27f89bdb4`
- 層級：committed（96 個檔案，其中 91 個為新增的 skill 檔）；pending 與 untracked 皆為空
- 方法：專案 `security-review` skill。一位 `harness-reviewer` 找候選，兩位獨立的 `harness-reviewer` 分組做誤判過濾；全部為讀碼推論，未實際觸發 skill、未連網
- 信任邊界：作者與 agent 屬可信端；不可信的是作者貼入或 agent 讀入的第三方素材、外部網頁、上游 repo 與 skill 安裝工具抓下的內容。上游 `CXPhoenix/slide-style-design` 與本 repo 屬同一位維護者

## 結論

候選 6 項，經獨立過濾後 **0 項成立為安全 finding**，全部為 INFO。新增內容都是純文字指引：沒有 `allowed-tools`、shell 注入語法、hook 或 script，也沒有抓取網頁或寫檔的指示；Codex 的 `openai.yaml` 只有 `interface` 欄位，不改任何權限。

## 候選與處置

| ID | 候選 | 處置 | 理由摘要 |
|---|---|---|---|
| F1 | lock 把五個 skill 登記為安裝工具管理；安裝工具更新或 symlink 安裝可能覆蓋內容而 verifier 照樣通過 | 誤判（維護面 INFO） | 上游與本 repo 同一維護者；`pnpm sync:skills` 不讀 lock，repo 也沒有自動化會跑安裝工具；覆蓋會出現在 `git status` 且需經審查的 commit；symlink 豁免是既有行為；V 把 `ref` 釘在上游 commit，比原本的 `ref: main` 更收斂 |
| F2 | router 把「已提供的 guidance」當作 style 定義，可能被仿冒內容利用 | 誤判 | router 第 34 行要求讀取 repo 內實際的 skill 檔；第 39–40 行處理 host 已注入的內容；素材只能提供用途、對象、表達需求；最壞結果是被污染的風格指引，公開仍需作者修改 allowlist 並發 Release |
| F3 | 「素材不能改的項目」沒有列出工具操作；adoption 未限定在 caller 自己的訊息 | 誤判 | 第一句已把素材中的所有指令定為素材；這些 skill 只交付指引、不假設 shell 或 MCP；引用中的同意不能代替 caller 同意 |
| F4 | router 觸發範圍偏寬，可能攔截 create-slide 的做簡報請求 | 誤判（使用體驗觀察） | 觸發只看 description，其對象是「選擇簡報風格」；create-slide 的 description 明列做簡報的觸發詞；誤觸發最多多問一題，不會越權 |
| F5 | core-rule.md 的來源 URL 可能讓 agent 抓取第三方網頁 | 誤判 | skill 沒有任何抓取指示；URL 是 provenance 紀錄；抓取需作者指示與 host 權限 |
| F6 | 五個 description 常駐兩個 runtime 的每個 session | 誤判（意圖內） | 內容公開、無機密；spec AC4、AC5 刻意要求；約 250–300 tokens／session，屬資源類排除 |

## 留給作者決定的觀察（非安全 finding）

1. 在 provenance 註明「這五個 skill 不要用安裝工具更新；更新時從上游 diff 後手動重新套用 Claude 調校」（F1，純文件，不改 skill 行為）。
2. 把 verifier 的 shared 豁免限縮為明確的 open-slide skill 名單（F1，影響所有 skill 的模板工作，宜另開 ticket）。
3. `AGENTS.md` 的「Which slide skill to use」說明 style skills 與 create-slide 的分工（F4，間接影響路由）。
4. 收窄 router description、明寫 guidance 來源、素材不得要求工具操作、改為手動觸發（F2、F3、F4、F6）：都會改變 skill 行為，依 epic 0002 只能列為 deferred，需在兩棵樹與上游一起處理。

## 涵蓋範圍限制

- Git 範圍與 blob 一致性依 parent 的核對（86 個檔案與上游 `80e5d06` 逐一吻合；上游 LICENSE SHA-256 前綴 `c78dc136`）。
- 未驗證 skill 安裝工具是否遵守 `ref`、未做實際觸發測試、未抓取任何 URL。
- dependency scanning、availability 不在範圍內。
- 可能的串鏈（F2/F3 污染指引＋F4 誤觸發＋下游寫入 deck）留給 epic close-out 的 chain analysis；目前在「公開需作者修改 allowlist 並發 Release」這一步被擋住。
- 本報告不代表整個專案是安全的。
