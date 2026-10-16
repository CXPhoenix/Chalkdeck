# Core conflict example

The caller wants dense-chart dominance and a minor text heading, with a necessary
test-specific qualification, and has not accepted the suggested alternative.

## 高橋流核心衝突

你要求「密集圖表承載主要視覺與訊息，詞句只當小標題」，與 `takahashi.text_primary`
衝突：詞句失去主要載體的角色，相對尺度不再建立詞句優先，圖表也不再是輔助。

保留核心的建議是讓主要詞句維持相對尺度的優先，圖表支援其訊息；這只是建議，
尚未視為你已接受的調整。以下交付原本核心：詞句為主要視覺與訊息載體，透過相對
尺度建立優先；其他細節若出現，須支援詞句，不成為同等或更強的焦點。保留
「結果僅適用於本次測試條件」。設定不套用圖表主導要求，也不將替代建議列為已套用偏好。

此核心關係是來源啟發的專案綜整，不是創作者的逐字原話或固定字級公式。
只提供風格約束，不改寫、重組或製作素材。

```yaml
style_id: takahashi
core_rules:
  - rule_id: takahashi.text_primary
    constraint: >-
      以詞句承載主要視覺與訊息，透過相對尺度建立優先地位；其他細節若存在，
      須支援主要詞句，而非同等或更主要的焦點。保留理解素材所需的限定，
      包括結果僅適用於本次測試條件。
adjustable_rules: []
```
