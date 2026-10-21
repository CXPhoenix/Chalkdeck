# 安全審查報告：T-0003

- **範圍**：分支 `tickets/T-0003/style-skill-checker`（worktree `.worktrees/T-0003`）。base 為 `main` 的 `f24335cd4e0c7789bc4426899d3f8aae0f966b2d`，merge-base 相同；審查時的 HEAD 是 `0392166`。
- **層級**：只審查已 commit 的內容，包括：
  - `scripts/check_style_skills.py`
  - `scripts/test_check_style_skills.py`
  - `scripts/style-skills-baseline.json`
  - `AGENTS.md`
  - 兩棵樹的 `tune-skills/SKILL.md`
  - `docs/agents/skill-sources.json`
  - ticket 文件

  審查當下沒有 pending 或 untracked 變更。
- **方法**：依專案的 `security-review` skill 進行：
  - 一位 `harness-reviewer` 負責找候選。
  - 兩位獨立的 `harness-reviewer` 分組做誤判過濾，分別負責 C1–C10 與 C11–C21。
  - 全部都是讀程式碼推論，沒有執行任何程式。
- **信任邊界**：
  - 可信：作者、agent、命令列參數（`--root`、`--sha`、`--baseline`），以及作者本機的 Git。
  - 不可信：經 PR 帶進來的 skill 內容，也就是 checker 要檢查的對象。如果 PR 同時改了 checker 或 baseline，可信度就要看審查的人有沒有用可信版本的 checker 來跑（見 C9）。

## 結論

共 21 項候選，經過獨立過濾後，**沒有任何一項同時達到「HIGH 或 MEDIUM」且「信心 ≥ 0.8」的報告門檻**，所以本報告沒有正式的安全 finding。

- 最接近門檻的是 C2（MEDIUM，0.75）：frontmatter 中帶引號或帶空白的 key 如果出現在 `name:` 之前，會被略過，使 AC4/K13 漏掉 `disable-model-invocation` 這類 key。過濾者建議把它當作 P1 的 checker 缺陷處理。
- 作者在 2026-10-21 的第二輪裁決已把它和 C1、C3 一起修正。

下表的「處置」欄記錄審查後在同一張 ticket 裡的修正。這些修正沒有再交給安全 reviewer 複審，驗證方式是第二輪的 red → green 測試與 mutation，紀錄在 ticket 的 Comments。

## 候選與處置

| ID | 候選（審查時 HEAD `0392166`） | 過濾結果 | 處置 |
|---|---|---|---|
| C1 | frontmatter 的 block scalar 中，以 `#` 開頭的行會被當成註解略過，注入的內容可以繞過 DESC 與 K13 | checker 缺陷確認（0.85）；單獨看不構成弱點，LOW | 已修：frontmatter 限定為 V 的形狀（作者裁決 b），block scalar 與 `#` 行都判 K13 失敗 |
| C2 | 帶引號或帶空白的 key 出現在 `name:` 之前時會被丟掉，可以繞過 K13 | MEDIUM 0.75，P1 checker 缺陷 | 已修：同 C1 |
| C3 | 縮排的 `---` 也會被當成結尾，和 host 的解析可能不一致 | LOW–MEDIUM，0.55 | 已修：開頭與結尾都必須是剛好 `---` 的一行 |
| C4 | 隱藏檔不受釘選，卻能被連結；隱藏的 symlink 不會回報 | 合約或 K12 缺口確認（0.8）；安全面約 0.4，LOW | 已修：只忽略 `.DS_Store`，其他隱藏項目一律回報 |
| C5 | skill 目錄、`.claude`、`.claude/skills` 本身是 symlink 時會被跟隨 | 以安全來看是誤判（host 也會跟隨同一個 symlink，兩邊沒有差異），但和 docstring 的承諾不符 | 已修：這些 symlink 都會回報，也不會往下讀 |
| C6 | 受保護句「存在」不等於「生效」：HTML 註解、縮排程式碼、檔尾的反轉句、重複的同名段落 | 誤判；這是存在性檢查本身的限制 | 部分修正：被釘選的 heading 重複出現就判失敗（作者裁決 d）。其餘限制寫進 docstring 的「What PASS means」 |
| C7 | 新增內容不受釘選（`SKILL.md` 新句子、非 reference 的新檔案） | 誤判；符合 spec 範圍 | 已寫進 docstring |
| C8 | approval 能自我授權，而且可以很弱：哨兵 heading、型別沒檢查、`approved_urls: []` | 設計上屬誤判；`(description)` 加 `" "` 的瑣碎比對確實存在 | 已修：拒絕哨兵 heading、未知 key、型別錯誤、空白值、重複核准；`approved_urls` 必須是非空的 URL 清單 |
| C9 | 沒有信任錨點：checker、baseline、測試都來自被檢查的樹 | 誤判；屬一般性的「執行 PR 程式碼」問題 | 已在 docstring 寫明：檢查 PR 時，要用可信版本的 checker 與 baseline，並加 `-I` |
| C10 | `--sha` 會被當成選項注入（例如 `--output=…`、`--cached`） | 以安全來看是誤判（CLI 屬可信輸入）；穩健性問題確實存在 | 已修：只接受 40 位小寫 hex，並用 `git rev-parse --verify --end-of-options` 確認是 commit |
| C11 | 在不可信的 `--root` 執行 git 時，可能觸發 git config 執行指令 | 誤判（0.1）：只有 generation 會執行 git，而 `--root` 是可信參數 | 收 |
| C12 | 沒有 git 時，generation 仍照樣放行 | 行為確實存在，但不是弱點（0.2） | 已修：沒有 git 就失敗，除非加上 `--allow-unverified` |
| C13 | 寫入 baseline 時會跟隨 symlink；懸空的 symlink 可以繞過 `--force` | 合理的強化項目，不是弱點（0.3） | 已修：拒絕 symlink 路徑，改成「暫存檔＋`os.replace`」 |
| C14 | 檔名中的控制字元會直接印到終端機或 agent | 誤判（0.2）：exit code 仍是 1 | 已修：輸出前把不可列印字元轉成跳脫序列 |
| C15 | 二次方時間的 regex 與處理 | 排除：屬 DoS 類（0.1） | 收 |
| C16 | LINK 略過所有 scheme 與其他連結語法 | 誤判（0.15）：符合 AC7 | 已寫進 docstring |
| C17 | 中間層的 symlink 目錄會讓 LINK 越界 | 和 docstring 不符，但不是弱點（0.2） | 已修：連結目標只能是 5 個 skill 內實際走訪到的檔案（作者裁決 c），以字面解析，不跟隨 symlink |
| C18 | 未處理的例外會讓程式中斷（fail closed） | 不是弱點（0.1）；連結目標太短會造成 IndexError，屬功能缺陷 | 已修：一律改報 FAIL 行。另外處理了 PermissionError、RecursionError、非字串的 `generated_from`，並讓輸出用 `backslashreplace` |
| C19 | baseline JSON 有重複 key 時，後面的值會蓋掉前面的 | 合理，但不是弱點（0.25） | 已修：遇到重複 key 判 `BASELINE` 失敗 |
| C20 | 在 Python < 3.11.4 上，測試的 `extractall` 沒有加 filter | 誤判（0.05）：來源是 hash 釘住的 V | 收 |
| C21 | 範圍缺口：其他 skill 可以宣告同樣的 name；Codex 版沒有檢查 | 屬涵蓋範圍的限制（0.2），由 spec 決定 | 收 |

候選 reviewer 自己排除的項目：

- 經由 baseline key 或 `approved_changes[].path` 的路徑穿越：它們只拿來比對 `Tree` 的成員，不會當成檔案路徑。
- `--root` 注入：參數放在 `-C` 之後。
- 其他 regex 的 ReDoS：這些 regex 都是線性時間。
- 不是隱藏檔的 symlink 檔案：已經會回報，不會跟隨，也有測試。

## 涵蓋範圍限制

- 這是讀程式碼的推論。修正後的版本只用單元測試和 mutation 驗證，沒有再做一次獨立的安全審查。
- 沒有驗證 Claude Code 實際怎麼解析 frontmatter。C2、C3 的利用需要 host 的解析器配合；修正方式是把 checker 收緊成 V 的形狀，因此不依賴 host 的行為。
- 範圍不含 dependency scanning（本專案沒有新增依賴）與 availability（DoS）。
- PASS 只代表被釘選的內容存在、被釘選的檔案沒有變，不代表這些 skill 的行為是安全的。
- 本報告不代表整個專案是安全的。跨 ticket 的串鏈分析留到 epic close-out 進行。
