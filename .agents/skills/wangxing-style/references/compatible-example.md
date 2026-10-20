# Compatible Wangxing example

## 忘形流相容調整

本風格是張忘形；wangxing 是專案識別字，不是官方英文名。
`wangxing.text_visual_relation`：精簡觀點與視覺共同傳達同一觀點或明確關係；圖像
幫助理解而非僅裝飾。本例的任務區塊與人員分工對應，支援清楚分工有助減少重複
工作的觀點，保留「在這個團隊中」。自行閱讀時，圖文與限定都須不靠講者即可理解。

接受 `wangxing.presentation_preferences` 的彩色、不使用幽默，仍保留上述關係與限定。
這是來源啟發的專案偏好規則，不是創作者必用顏色或幽默頻率；只交付風格約束。

```yaml
style_id: wangxing
core_rules:
  - rule_id: wangxing.text_visual_relation
    constraint: >-
      精簡觀點文字與視覺共同表達同一觀點或明確關係，視覺實際幫助理解而非僅裝飾；
      透過任務區塊與人員分工對應支援觀點，保留在這個團隊中的限定。
      自行閱讀的圖文、觀點與必要限定須在沒有講者補充時仍可理解。
adjustable_rules:
  - rule_id: wangxing.presentation_preferences
    constraint: >-
      採用彩色且不使用幽默，仍保留精簡觀點與任務區塊／人員對應的有意義關係；
      保留在這個團隊中的限定。自行閱讀時，所有必要資訊不依賴講者補充。
```
