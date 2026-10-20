# Compatible adjustment example

Illustrates a request for one supporting chart and three note lines, with a necessary
test-specific qualification. Counts and conditions belong to this illustrative request.

## 高橋流相容調整

`takahashi.text_primary`：以詞句作為主要視覺與訊息載體，透過相對尺度建立優先地位。
其他細節若存在，只支援詞句，不成為同等或更強的焦點；保留理解素材所需的限定。

接受 `takahashi.presentation_preferences`：一張輔助圖表與三行註解共同支援主要詞句，
維持較低視覺層級；保留「結果僅適用於本次測試條件」。這是依核心關係整理的專案
調整指引，並非高橋本人規定的圖表或註解數量。內容重組與製作由其他工具處理。

This example is for an explicit JSON request. The corresponding compatible YAML
example preserves the identical rule contract and applicability; emit only one.

```json
{
  "style_id": "takahashi",
  "core_rules": [
    {
      "rule_id": "takahashi.text_primary",
      "constraint": "以詞句承載主要視覺與訊息，透過相對尺度建立優先地位；其他細節若存在， 須支援主要詞句，而非同等或更主要的焦點。保留理解素材所需的限定， 包括結果僅適用於本次測試條件。"
    }
  ],
  "adjustable_rules": [
    {
      "rule_id": "takahashi.presentation_preferences",
      "constraint": "採用一張輔助圖表與三行註解，只支援主要詞句，維持較低的視覺層級； 詞句仍透過相對尺度保持主要視覺與訊息地位。保留結果僅適用於本次測試條件。"
    }
  ]
}
```
