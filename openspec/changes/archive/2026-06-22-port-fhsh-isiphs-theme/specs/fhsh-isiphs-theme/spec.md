# fhsh-isiphs-theme

## ADDED Requirements

### Requirement: 兩軸主題切換
主題 SHALL 透過 `makeTheme(themeName, courseLevel)` 在 authoring-time 決定整份 deck 的品牌圖組與等級色框，每頁讀同一個回傳值。

#### Scenario: 預設值
- **WHEN** 呼叫 `makeTheme()` 不帶參數
- **THEN** `themeName = 'fhsh'`、`courseLevel = 0`（綠框）

#### Scenario: courseLevel 越界夾回
- **WHEN** `courseLevel < 0` 或 `> 2`
- **THEN** 夾回 `0`

#### Scenario: 兩軸正交
- **WHEN** 只改 `themeName`
- **THEN** 框色不變、品牌圖切換
- **WHEN** 只改 `courseLevel`
- **THEN** 品牌圖不變、框色切換

### Requirement: 等級色框
`<Frame>` SHALL 依 `courseLevel` 畫出白底＋彩色外框＋虛線版面參考線。

#### Scenario: 三個等級對應色
- **WHEN** `courseLevel` 為 0 / 1 / 2
- **THEN** 外框色為 `#c2d59b`（綠）/ `#92d2ef`（藍）/ `#fab150`（橘）

### Requirement: 版型 helper
主題 SHALL 提供 `Cover`、`Section`、`Default`、`ImagePage`、`ToC` 五個 paste-ready 版型，皆接 `theme` 並回傳 `Page`。

#### Scenario: 頁碼顯示
- **WHEN** 版型為 `Cover` 或 `Section`
- **THEN** 不顯示頁碼
- **WHEN** 版型為 `Default` 或 `ImagePage`
- **THEN** 顯示頁碼

### Requirement: 逐頁換圖
版型 SHALL 允許逐頁覆寫圖片，不傳則用 `themeName` 預設圖。

#### Scenario: Cover / Section / logo 覆寫
- **WHEN** 傳入 `slogon`（Cover）/ `sectionImg`（Section）/ `logo`（任一版型）
- **THEN** 以傳入圖取代預設圖；對應 `*Style` 疊在預設定位之上

### Requirement: 閱讀體驗規則
內文版型 SHALL 採用內收閱讀欄與放大字級，避免貼齊色框。

#### Scenario: 內文閱讀欄
- **WHEN** 使用 `Default` 內文
- **THEN** 內容欄左右各內收至 200px、內文字級 ≥ 64px、不貼齊色框與虛線參考線
