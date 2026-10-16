# Explicit choice clarification examples

These are branch examples, not settings profiles or new presets. The caller's
language controls the actual question, rather than this English reference.

```yaml
ambiguous:
  request: Use Apple style to compare measured energy use
  branch: ask_supported_choice
  supported_styles: [takahashi, jobs, wangxing, gates]
  settings: null
unsupported:
  request: Use Tufte style to compare measured energy use
  branch: ask_supported_choice
  supported_styles: [takahashi, jobs, wangxing, gates]
  settings: null
multiple:
  request: Use Takahashi and Jobs together
  branch: ask_one_primary
  settings: null
per_page:
  request: Use Jobs for product pages and Gates for data pages automatically
  branch: ask_one_primary
  settings: null
resolved:
  request: I choose Jobs as the only primary style
  branch: deliver_explicit
  style_id: jobs
```

For “Apple style,” ask whether the caller means Steve Jobs, or another supported
style. Do not assume the answer from a brand association. For Tufte, explain the
supported set and ask for an intended supported choice. Measurement context does
not silently replace either unresolved explicit request with Gates. No selected
profile is delivered until the choice is resolved.

For multiple or per-page requests, ask for one primary style within the supported
set; no local exceptions or automatic mixing are implemented. After “I choose Jobs
as the only primary style,” follow the actual Jobs definition and retain previously
requested JSON and explanation language. A caller already specifying Jobs as primary
and mentioning Gates only for comparison needs no repeated choice confirmation.
