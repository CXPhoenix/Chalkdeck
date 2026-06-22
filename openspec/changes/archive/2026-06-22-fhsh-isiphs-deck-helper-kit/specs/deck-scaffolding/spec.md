## ADDED Requirements

### Requirement: Scaffold a deck from the theme markdown as single source of truth

The scaffolding script SHALL generate a self-contained `slides/<id>/index.tsx` by reading the theme markdown (default `themes/fhsh-isiphs-universal.md`), locating the `## Fixed components` heading, and extracting the first fenced `tsx` code block that follows it as the boilerplate. The script SHALL NOT carry its own embedded copy of the boilerplate.

#### Scenario: Successful skeleton scaffold

- **WHEN** the script runs with a valid kebab-case id and no conflicting directory
- **THEN** it creates `slides/<id>/index.tsx` containing the extracted boilerplate, a `const T = makeTheme(...)` line, the starter pages, an `export default [...] satisfies Page[]`, and an `export const meta` with a `createdAt` produced by `new Date().toISOString()`
- **AND** it creates `slides/<id>/assets/` containing a `.gitkeep`

#### Scenario: Theme block cannot be located

- **WHEN** the resolved theme markdown is missing, or has no `## Fixed components` heading followed by a `tsx` fenced block
- **THEN** the script prints an error identifying the theme file and exits with a non-zero status without creating any slide directory

### Requirement: Rewrite the type import for a renderable slide

When assembling the output, the script SHALL replace the boilerplate's `@open-slide/core` type import line so that the generated file imports `SlideMeta` (and `DesignSystem` unless design output is disabled) in addition to `Page`, while leaving all other imports unchanged.

#### Scenario: Import includes SlideMeta and DesignSystem by default

- **WHEN** a deck is scaffolded without disabling design output
- **THEN** the generated file's `@open-slide/core` type import line includes `DesignSystem`, `Page`, and `SlideMeta`
- **AND** the generated file ends with an `export const design: DesignSystem` block

#### Scenario: Design output disabled

- **WHEN** the design output is disabled via flag
- **THEN** the type import includes `Page` and `SlideMeta` but not `DesignSystem`
- **AND** the generated file contains no `export const design` block

### Requirement: Validate inputs and fail without leaving partial output

The script SHALL validate inputs before writing and SHALL exit with a non-zero status and a clear message on any invalid input, leaving no partially created slide directory.

#### Scenario: Invalid id, existing directory, or bad option

- **WHEN** the id is not kebab-case, OR `slides/<id>` already exists and the force flag is absent, OR a brand/level/starter value is outside its allowed set
- **THEN** the script prints a specific error for that condition and exits non-zero without creating or overwriting any file

#### Scenario: Force overwrite

- **WHEN** `slides/<id>` already exists and the force flag is present
- **THEN** the script regenerates `slides/<id>/index.tsx`

### Requirement: Brand and course level select theme appearance

The script SHALL accept a brand and a course level that determine the generated `makeTheme('<brand>', <level>)` line, defaulting to `fhsh` and `0` respectively.

#### Scenario: Brand and level map to makeTheme arguments

- **WHEN** a deck is scaffolded with explicit brand and level
- **THEN** the generated file contains the corresponding `makeTheme` call

##### Example: brand/level to makeTheme line

| brand | level | Generated line |
| ----- | ----- | -------------- |
| (default) | (default) | const T = makeTheme('fhsh', 0); |
| isip.hs | 1 | const T = makeTheme('isip.hs', 1); |
| fhsh | 2 | const T = makeTheme('fhsh', 2); |

### Requirement: Starter variants produce defined page sets

The script SHALL support starter variants that determine which pages the generated deck contains, defaulting to `skeleton`.

#### Scenario: Starter selection determines pages

- **WHEN** a deck is scaffolded with a given starter variant
- **THEN** the generated `export default` array contains exactly the pages defined for that variant

##### Example: starter to pages

| starter | Pages in export default |
| ------- | ----------------------- |
| skeleton (default) | Cover, Default+ToC, Section, Default content, Default content |
| minimal | Cover |
| full | representative multi-page sample including ImagePage and per-page image override |

### Requirement: Skill orchestrates scaffolding and dev preview

The `new-deck` skill SHALL collect the deck id, brand, course level, title, and starter, invoke the scaffolding script, ensure the dev server is running, and return the `/s/<id>` preview link, then hand authoring of page content to the `slide-authoring` skill.

#### Scenario: Skill end-to-end

- **WHEN** the user invokes the skill and answers the prompts
- **THEN** the skill runs the scaffolding script, starts the dev server only if it is not already running, and reports the `/s/<id>` preview URL
- **AND** the skill defers page-content authoring guidance to the `slide-authoring` skill rather than duplicating it

### Requirement: Convenience invocation via package script

The repository SHALL expose a `new:deck` package script that invokes the scaffolding script, so the kit can be run without typing the full node command.

#### Scenario: Package script forwards arguments

- **WHEN** the user runs the `new:deck` package script with an id and options
- **THEN** the underlying scaffolding script receives those arguments and produces the same result as a direct invocation
