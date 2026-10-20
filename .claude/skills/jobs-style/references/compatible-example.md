# Compatible Jobs adjustment example

## 賈伯斯流相容調整

`jobs.single_focus`：展示、效益、揭露或比較元素支援一個明確焦點；文字與視覺共同
服務焦點，不形成互相競爭的主要主張。本例四款產品共同支援同一測試條件下的
電池續航比較，保留「結果不代表其他使用情境」。

接受 `jobs.presentation_preferences`：彩色背景與 A、B、C、D 四款產品仍服務這個
比較；不是四個獨立主要主張。這是專案綜整的偏好選項，非創作者固定顏色或數量公式。
只提供風格約束，內容改寫與製作由其他工具處理。

```yaml
style_id: jobs
core_rules:
  - rule_id: jobs.single_focus
    constraint: >-
      展示、效益、揭露或比較元素支援一個明確陳述的焦點；文字與視覺服務焦點，
      不成為互相競爭的主要主張。多個物件可共同服務一項比較。保留本例共同測試條件，
      且結果不代表其他使用情境。
adjustable_rules:
  - rule_id: jobs.presentation_preferences
    constraint: >-
      採用彩色背景，同時呈現 A、B、C、D 四款產品，共同服務同一測試條件下的
      電池續航比較；維持單一比較焦點，保留結果不代表其他使用情境的限定。
```
