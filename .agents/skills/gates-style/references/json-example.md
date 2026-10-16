# Compatible Gates example

## 比爾蓋茲流相容調整

`gates.evidence_relation`：證據、數量或系統元件連到明確比較或系統重點，保留正確
解讀所需的標籤、單位、假設與限定。本例 A 的 120 ms 與 B 的 90 ms 支援平均回應時間
比較；保留相同硬體／工作負載、各測試 10 次取平均，以及僅適用此次測試條件。

接受 `gates.presentation_preferences` 的減少裝飾／增加留白，仍維持證據關係與
必要資訊。這是來源啟發的專案綜整，不是 Gates 的固定密度公式；不計算／重組素材。

This example is for an explicit JSON request. The corresponding compatible YAML
example preserves the identical rule contract and applicability; emit only one.

```json
{
  "style_id": "gates",
  "core_rules": [
    {
      "rule_id": "gates.evidence_relation",
      "constraint": "證據、數量或系統元件連到明確比較或系統重點；若標籤、單位、假設或限定 對解讀既有證據必要，須保留。本例將 A 的 120 ms 與 B 的 90 ms 連到平均 回應時間比較，保留相同硬體與工作負載、各重複 10 次取平均，以及結果僅適用 此次測試條件。"
    }
  ],
  "adjustable_rules": [
    {
      "rule_id": "gates.presentation_preferences",
      "constraint": "減少裝飾、增加留白，維持 A/B 平均回應時間比較與 ms 單位、共同硬體及工作負載、 各重複 10 次取平均、僅適用此次條件的限定；不以留白刪除解讀所必需的資訊。"
    }
  ]
}
```
