## ADDED Requirements

### Requirement: Running-order summary revealed on the final step

After the four featured categories are collected, a final (fifth) reveal step SHALL display a running-order summary caption (for example "就照這個順序破關：OSINT → Web → REV／WASM → Blue"). The caption SHALL stay hidden during the four category reveal steps and SHALL fade in only on the final reveal. The caption MUST be rendered at a font size of at least 78px, positioned below the collected left-hand column, and MUST remain within the 1920x1080 canvas content area without overlapping any category tag or the page footer.

#### Scenario: Caption hidden until the final reveal

- **WHEN** the presenter has advanced four reveal steps (all four featured categories collected) but not the fifth
- **THEN** the running-order summary caption is not visible

#### Scenario: Caption appears on the final reveal

- **WHEN** the presenter advances the fifth and final reveal step
- **THEN** the running-order summary caption fades in below the collected column at a font size of at least 78px, fully within the canvas and not overlapping any tag or the footer

#### Scenario: Reduced motion disables the caption fade

- **WHEN** the environment reports `prefers-reduced-motion: reduce`
- **THEN** the caption appears without an animated fade on the final reveal

## MODIFIED Requirements

### Requirement: Complete-state degradation for non-stepping contexts

When the page is shown without an active step host (overview grid thumbnail, PDF export) or is entered backward or by jumping from a later page, the page SHALL display the fully-revealed completed state — all four featured categories collected in the left column and highlighted, non-featured categories muted and scattered, and the running-order summary caption shown. The completed state MUST be shown statically, without replaying the scatter-to-collect motion or the caption fade, and MUST NOT appear blank or as an intermediate frame.

#### Scenario: Overview thumbnail shows the finished morph

- **WHEN** the category page is rendered as an overview thumbnail or in PDF export
- **THEN** it shows the completed state with all four featured categories collected and highlighted and the running-order caption visible, and no transition animation plays

#### Scenario: Backward entry shows the finished morph

- **WHEN** the presenter arrives at the category page by moving backward from a later page or by jumping to it
- **THEN** it shows the completed state with categories collected and the caption shown rather than the empty scattered start
