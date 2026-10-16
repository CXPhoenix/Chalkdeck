# English guidance example

Bill Gates-inspired analytical style: gates.evidence_relation. Evidence, quantities and system elements support a stated comparison or system point. The A/B average response time comparison requires A120ms/B90ms, shared hardware/workload, 10 repetitions averaged and a test-condition limitation. Whitespace and reduced decoration are accepted without removing necessary labels, units, assumptions or qualifiers; high density is not mandatory.

The accepted preferences use `gates.presentation_preferences`.

These rules are source-led project synthesis, not creator quotations or official numerical formulas. Style constraints only; no content transformation.

```yaml
style_id: gates
core_rules:
- rule_id: gates.evidence_relation
  constraint: Relate evidence, quantities or system elements to a stated comparison or system point. For the stated A/B average response time comparison, retain A120ms/B90ms labels and units, shared hardware/workload, averages from 10 repetitions and applicability only to these test conditions. Preserve labels, assumptions and qualifiers whenever necessary for interpretation.
adjustable_rules:
- rule_id: gates.presentation_preferences
  constraint: Reduce decoration and increase whitespace while retaining the stated A/B average response time relation, all labels/units, shared hardware/workload, averages from 10 repetitions and applicability limited to these test conditions.
```
