# Gates Markdown/YAML handoff example

This illustrates the existing contract; wording is not an exact-output template.

## 比爾蓋茲流核心指引

`gates.evidence_relation` 要求證據、數量或系統元件連到明確陳述的比較／系統重點。
透過層級與相關註記，讓讀者理解證據支持什麼、數量在比較什麼或元件如何關聯。
若標籤、單位、假設或限定對正確解讀不可或缺，兩種表示都保留它們；不能為了
留白或精簡而刪除。大量留白或減少裝飾仍可保留核心，高密度不是必要條件。
這是來源啟發的專案綜整，不是 Gates 的官方方法。計算、內容改寫與製作由其他工具處理。

```yaml
style_id: gates
core_rules:
  - rule_id: gates.evidence_relation
    constraint: >-
      讓證據、數量或系統元件連到明確陳述的比較或系統重點，保留可理解的關係；
      若標籤、單位、假設或限定是解讀既有證據所必需，須保留其關係與條件。
      可保留留白或減少裝飾，但不得因此刪除必要資訊；高密度不是必要條件。
adjustable_rules: []
```
