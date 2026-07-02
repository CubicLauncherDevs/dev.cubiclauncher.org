---
title: How to make themes | CubicLauncher
---

# How to make themes

CubicLauncher lets you fully customize the UI with themes. Each theme defines colors, fonts, borders, and an optional background image.

There are currently **two versions** of the theme system. **v1** (JSON, legacy) and **v2** (TOML), the latter being the recommended one for new themes.

---

## Theme structure

User themes go inside `.cubic/themes/`. Each theme is a folder containing the following files depending on the version:

### v1 (JSON legacy)
```
.cubic/
└── themes/
    └── <id>/
        ├── theme.json
        └── bg.jpg (optional)
```

### v2 (TOML, recommended)
```
.cubic/
└── themes/
    └── <id>/
        ├── Meta.toml
        ├── Definition.toml
        ├── Inject.css        (optional)
        └── bg.jpg            (optional)
```

> The launcher **does not** load anything outside `.cubic` for security.

### Version detection

The launcher automatically detects the version based on which files exist:

1. If `Meta.toml` exists → treated as **v2** (loads `Meta.toml` + `Definition.toml`)
2. If `theme.json` exists → treated as **v1**
3. If neither exists, the theme is ignored

---

## v1 — JSON format (legacy)

### Full schema

```json
{
  "name": "My Theme",
  "author": "YourName",
  "version": "1.0.0",
  "type": "user",
  "bg_image": "bg.jpg",
  "bg_image_blur": "10px",
  "bg_image_opacity": 0.6,
  "fonts": [
    {
      "family": "MyFont",
      "src": "fonts/my-font.woff2",
      "format": "woff2",
      "weight": "400",
      "style": "normal"
    }
  ],
  "variables": {
    "--bg-main": "#1a1a2e",
    "--bg-sidebar": "#16213e",
    "--text-primary": "#ffffff",
    "--accent": "#e94560"
  }
}
```

### Fields

| Field | Type | Required | Description |
|---|---|---|---|
| `name` | `string` | Yes | Visible theme name in the selector. |
| `author` | `string` | No | Theme author. Empty by default. |
| `version` | `string` | No | Theme version. Empty by default. |
| `type` | `string` | No | `"user"` for user themes. `"builtin"` themes come with the launcher. |
| `bg_image` | `string?` | No | Background image filename (relative to the theme directory). |
| `bg_image_blur` | `string?` | No | Background blur as a string (e.g. `"10px"`). Parsed to a number; ignored if invalid. |
| `bg_image_opacity` | `number?` | No | Background opacity (0 to 1, e.g. `0.6`). |
| `fonts` | `array` | No | List of custom fonts (see Fonts section). Empty by default. |
| `variables` | `object` | Yes | Map of CSS variables. Both keys and values are strings. |

---

## v2 — TOML format (recommended)

v2 separates metadata and definitions into two TOML files.

### `Meta.toml`

Defines theme metadata:

```toml
[meta]
name = "My Theme"
author = "YourName"
version = "1.0.0"
description = "A dark minimalist theme"
injects_css = false
```

| Field | Type | Required | Description |
|---|---|---|---|
| `name` | `string` | Yes | Visible theme name. |
| `author` | `string` | No | Theme author. Empty by default. |
| `version` | `string` | No | Semantic version of the theme. Empty by default. |
| `description` | `string` | No | Brief theme description. Empty by default. |
| `injects_css` | `bool` | No | If `true` and `Inject.css` exists, it gets injected into the UI. `false` by default. |

### `Definition.toml`

Defines the theme appearance:

```toml
[theme]

[theme.background]
reference_path = "bg.webp"
image_blur = 10.0
image_opacity = 0.5

[theme.colors]
accent = "#ff0000"
"accent-rgb" = "255, 0, 0"

[theme.text]
primary = "#ffffff"
secondary = "#cccccc"

[theme.borders]
color = "#333333"
radius = "8px"
"radius-sm" = "4px"

[theme.shadows]
"shadow-sm" = "0 1px 3px rgba(0,0,0,0.5)"
"shadow-md" = "0 4px 6px rgba(0,0,0,0.3)"
"glow-accent" = "0 0 12px rgba(255,0,0,0.3)"

[theme.backgrounds]
main = "#1a1a2e"
sidebar = "#16213e"
card = "#0f3460"
"item-active" = "#e94560"
overlay = "rgba(0,0,0,0.7)"
input = "#1a1a2e"

[theme.layout]
"font-family" = "'Inter', sans-serif"
"font-size-base" = "14px"
"font-size-sm" = "12px"
"font-size-lg" = "18px"

[theme.others]
"icon-filter" = "invert(1)"
"color-success" = "#22c55e"
"color-error" = "#ef4444"
"color-warning" = "#f59e0b"
"color-status-starting" = "#f97316"
"color-status-started" = "#22c55e"
"scrollbar-track" = "#1a1a2e"
"scrollbar-thumb" = "#e94560"

[theme.backdrop]
dropdown = 10.0
modal = 4.0

[[theme.fonts]]
family = "MyFont"
src = "fonts/my-font.woff2"
format = "woff2"
weight = "400"
style = "normal"
```

### Section to CSS variable mapping

Each section of `Definition.toml` is flattened to CSS variables with a specific prefix:

| Section | CSS prefix | Key example | Generates |
|---|---|---|---|
| `[theme.colors]` | `--` | `accent` | `--accent` |
| `[theme.text]` | `--text-` | `primary` | `--text-primary` |
| `[theme.borders]` | `--border-` | `color` | `--border-color` |
| `[theme.shadows]` | `--` | `shadow-sm` | `--shadow-sm` |
| `[theme.backgrounds]` | `--bg-` | `main` | `--bg-main` |
| `[theme.layout]` | `--` | `font-family` | `--font-family` |
| `[theme.backdrop]` | `--backdrop-blur-` | `modal` | `--backdrop-blur-modal` (value in `px`) |
| `[theme.others]` | `--` | `icon-filter` | `--icon-filter` |

Additionally, `[theme.background]` automatically generates three variables:

| Field | Generated variable |
|---|---|
| `reference_path = "bg.webp"` | `--bg-image-path: bg.webp` |
| `image_blur = 10.0` | `--bg-image-blur: 10px` |
| `image_opacity = 0.5` | `--bg-image-opacity: 0.5` |

> **Note:** `backdrop` automatically appends `px` to the value (e.g. `dropdown = 10.0` → `--backdrop-blur-dropdown: 10px`).

---

## Fonts (v1 and v2)

Both versions support custom fonts. In v1 they go inside the `fonts` array in `theme.json`; in v2 as `[[theme.fonts]]` in `Definition.toml`.

### Fields

| Field | Type | Required | Description |
|---|---|---|---|
| `family` | `string` | Yes | Font family name (used in `font-family`). |
| `src` | `string` | Yes | Path to the font file (relative to the theme directory, or absolute). |
| `format` | `string?` | No | Font format (`woff2`, `ttf`, `otf`, etc.). |
| `weight` | `string?` | No | Font weight (`400`, `700`, `bold`, etc.). |
| `style` | `string?` | No | Font style (`normal`, `italic`, `oblique`). |

### v1 example (JSON)

```json
{
  "name": "My Theme",
  "fonts": [
    {
      "family": "MyFont",
      "src": "fonts/my-font.woff2",
      "format": "woff2",
      "weight": "400",
      "style": "normal"
    }
  ]
}
```

### v2 example (TOML)

```toml
[[theme.fonts]]
family = "MyFont"
src = "fonts/my-font.woff2"
format = "woff2"
weight = "400"
style = "normal"
```

> Relative font paths are resolved against the theme directory. If the path starts with `/` or `file:`, it is used as-is (absolute path).

---

## Background image

### v1: `bg_image`
### v2: `reference_path` (inside `[theme.background]`)

The field references a file inside the theme directory (e.g. `bg.jpg`, `bg.webp`). CubicLauncher applies the following validations:

1. **Checks the actual type** via magic number using the `infer` library. Does not trust the file extension.
2. **Does not load images larger than 25 MB** for safety and efficiency. If exceeded, the background is ignored and a warning is shown.
3. **Only accepts valid image formats** (PNG, JPG, GIF, WEBP, etc.).

If the launcher cannot load the image (corrupt file, invalid format, too heavy), it ignores it and shows no background.

### Background CSS variables (automatic)

| Variable | Origin | Description |
|---|---|---|
| `--bg-image` | Internal (frontend) | URL of the loaded image. |
| `--bg-image-loaded` | Internal (frontend) | `0` while loading, `1` when ready. |
| `--bg-image-path` | v2: `reference_path` | Path to the image file (v2 only). |
| `--bg-image-blur` | v2: `image_blur` | Blur in pixels (v2 only). |
| `--bg-image-opacity` | v2: `image_opacity` | Background opacity (v2 only). |

> In v1, `bg_image_blur` and `bg_image_opacity` are kept as separate fields in `ThemeResponse`, not as CSS variables.

---

## Available CSS variables

These are the variables that the CubicLauncher frontend consumes. You can define them in `variables` (v1) or in the corresponding sections of `Definition.toml` (v2).

### Background colors

v1: `--bg-*` in `variables` | v2: `[theme.backgrounds]`

| Variable | Description |
|---|---|
| `--bg-main` | Main window background |
| `--bg-sidebar` | Sidebar background |
| `--bg-card` | Card background |
| `--bg-item-active` | Active item background |
| `--bg-overlay` | Overlay/modal background |
| `--bg-input` | Input background |

### Text colors

v1: `--text-*` in `variables` | v2: `[theme.text]`

| Variable | Description |
|---|---|
| `--text-primary` | Primary text |
| `--text-secondary` | Secondary text |
| `--text-muted` | Disabled or subtle text |

### Accent

v1: `--*` in `variables` | v2: `[theme.colors]`

| Variable | Description |
|---|---|
| `--accent` | Main accent color |
| `--accent-rgb` | Accent in RGB format (for use with `rgba()`) |
| `--accent-hover` | Accent on hover |
| `--accent-text` | Text color on accent background |

### Borders

v1: `--border-*` in `variables` | v2: `[theme.borders]`

| Variable | Description |
|---|---|
| `--border-color` | Border color |
| `--border-radius` | General border radius |
| `--border-radius-sm` | Small border radius |

### Shadows

v1: `--shadow-*` in `variables` | v2: `[theme.shadows]`

| Variable | Description |
|---|---|
| `--shadow-sm` | Small shadow |
| `--shadow-md` | Medium shadow |
| `--glow-accent` | Accent color glow |

### State colors

v1: `--color-*` in `variables` | v2: `[theme.others]`

| Variable | Description |
|---|---|
| `--color-success` | Success color |
| `--color-success-rgb` | Success in RGB format |
| `--color-error` | Error color |
| `--color-error-rgb` | Error in RGB format |
| `--color-warning` | Warning color |
| `--color-warning-rgb` | Warning in RGB format |
| `--color-status-starting` | "Starting" status |
| `--color-status-started` | "Started" status |

### Scrollbar

v1: `--scrollbar-*` in `variables` | v2: `[theme.others]`

| Variable | Description |
|---|---|
| `--scrollbar-track` | Scrollbar track background |
| `--scrollbar-thumb` | Scrollbar handle color |

### Typography

v1: `--font-*` in `variables` | v2: `[theme.layout]`

| Variable | Description |
|---|---|
| `--font-family` | Font family |
| `--font-size-base` | Base font size |
| `--font-size-sm` | Small font size |
| `--font-size-lg` | Large font size |

### Icons

v1: `--icon-*` in `variables` | v2: `[theme.others]`

| Variable | Description |
|---|---|
| `--icon-filter` | CSS filter for icons (e.g. `invert(1)`) |
| `--icon-filter-error` | Filter for error icons |

### Backdrop blur (v2 only)

v2: `[theme.backdrop]`

| Variable | Description |
|---|---|
| `--backdrop-blur-dropdown` | Dropdown backdrop blur |
| `--backdrop-blur-modal` | Modal backdrop blur |

---

## Inject.css (v2 only)

If `injects_css = true` is set in `Meta.toml` and an `Inject.css` file exists in the theme directory, its content is injected directly into the UI.

It is useful for complex CSS overrides that cannot be expressed with variables alone, such as:

- `@keyframes` and custom animations
- `@media` queries
- Nested selectors
- Pseudo-elements (`::before`, `::after`)

---

## Publishing a theme

If you want to share your theme with the community, send a PR to the [official Themes repository](https://github.com/CubicLauncherDevs/Themes).

### Repository structure

```
src/
└── <your-username>/
    └── <theme-name>/
        ├── showcase.png
        └── Name:Author.zip
```

### Files

| File | Description |
|---|---|
| `showcase.png` | Screenshot of the launcher with your theme applied, for the gallery. |
| `Name:Author.zip` | ZIP with the theme directory inside. Name follows the `Name:Author.zip` convention. |

### ZIP contents

For v2 (recommended):
```
Name:Author.zip
└── <theme-name>/
    ├── Meta.toml
    ├── Definition.toml
    ├── Inject.css (optional)
    └── bg.EXTENSION (optional)
```

For v1 (legacy):
```
Name:Author.zip
└── <theme-name>/
    ├── theme.json
    └── bg.EXTENSION (optional)
```

### Accepted image formats

**PNG**, **GIF**, **WEBP**, **JPG**.
