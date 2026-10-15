## ADDED Requirements

### Requirement: In-page morph reveal of category tags

The category page SHALL render a single persistent set of category tags that morph in place — translating position and changing color via CSS transition — as the slide's reveal steps advance. The tags MUST NOT be placed inside reveal `<Step>` elements (which would cause fade-in instead of same-element movement). The morph MUST be driven by reveal state only (open-slide `<Steps>`/`<Step>` plus CSS `:has()`), with no JavaScript animation loop or timer.

#### Scenario: Forward entry builds up the morph

- **WHEN** the presenter enters the category page moving forward and no reveal steps are yet advanced
- **THEN** all category tags appear scattered across the content area in a muted (grey) state, and no category is highlighted

#### Scenario: Each advance collects and highlights one featured category

- **WHEN** the presenter advances the reveal one step
- **THEN** exactly one additional featured category tag translates smoothly to its slot in the left-hand column and switches to the accent highlight color, while previously revealed featured tags remain collected and highlighted and all non-featured tags remain muted and scattered

### Requirement: Sequential highlight follows the day's running order

The four featured categories SHALL light up in the fixed running order OSINT → Web → REV → Blue Team, one per reveal step, so that reveal step k highlights the k-th featured category. Non-featured categories (Pwn, Crypto, Misc) SHALL remain muted throughout and SHALL NOT occupy a left-column slot.

#### Scenario: Step-to-category mapping

- **WHEN** the presenter has advanced exactly k reveal steps (k from 1 to 4)
- **THEN** the first k featured categories in running order are collected and highlighted and the remaining featured categories are still muted

##### Example: reveal step to highlighted categories

| Steps advanced | Highlighted (collected, accent) | Muted |
| -------------- | ------------------------------- | ----- |
| 0 | (none) | OSINT, Web, REV, Blue, Pwn, Crypto, Misc |
| 1 | OSINT | Web, REV, Blue, Pwn, Crypto, Misc |
| 2 | OSINT, Web | REV, Blue, Pwn, Crypto, Misc |
| 3 | OSINT, Web, REV | Blue, Pwn, Crypto, Misc |
| 4 | OSINT, Web, REV, Blue | Pwn, Crypto, Misc |

### Requirement: Complete-state degradation for non-stepping contexts

When the page is shown without an active step host (overview grid thumbnail, PDF export) or is entered backward or by jumping from a later page, the page SHALL display the fully-revealed completed state — all four featured categories collected in the left column and highlighted, non-featured categories muted and scattered. The completed state MUST be shown statically, without replaying the scatter-to-collect motion, and MUST NOT appear blank or as an intermediate frame.

#### Scenario: Overview thumbnail shows the finished morph

- **WHEN** the category page is rendered as an overview thumbnail or in PDF export
- **THEN** it shows the completed state with all four featured categories collected and highlighted, and no transition animation plays

#### Scenario: Backward entry shows the finished morph

- **WHEN** the presenter arrives at the category page by moving backward from a later page or by jumping to it
- **THEN** it shows the completed state rather than the empty scattered start

### Requirement: Motion respects reduced-motion preference and the fixed canvas

The morph SHALL disable its position and color transitions when the environment requests reduced motion, presenting the target state directly. All tag positions, in both the scattered and the collected layout, SHALL remain within the 1920x1080 canvas content area and MUST NOT be clipped.

#### Scenario: Reduced motion disables transitions

- **WHEN** the environment reports `prefers-reduced-motion: reduce`
- **THEN** category tags change between scattered and collected states without animated position or color transitions

#### Scenario: No tag overflows the canvas

- **WHEN** the page is shown in any reveal state
- **THEN** every category tag is fully inside the 1920x1080 content area and none is cropped by the canvas edge
