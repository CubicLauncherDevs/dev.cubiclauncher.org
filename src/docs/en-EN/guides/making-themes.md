---
title: How to create themes | CubicLauncher
---

CubicLauncher lets you fully customize the interface through **themes**. A theme defines the colors, fonts, borders, shadows and, optionally, a background image for the launcher.

There are **two versions** of the theme system:

| Version | Format | Status |
|---|---|---|
| **v2** | TOML (`Meta.toml` + `Definition.toml`) | ✅ **Recommended** for new themes |
| **v1** | JSON (`theme.json`) | ⚠️ Legacy, kept for compatibility only |

**Contents of this guide:**

1. [Quick start](#quick-start) — create your first theme in 5 minutes
2. [Where themes live and how they're detected](#where-themes-live)
3. [v2 format (recommended)](#v2-format-toml--recommended)
4. [v1 format (legacy)](#v1-format-json--legacy)
5. [Shared reference](#shared-reference-v1-and-v2) — fonts, background image and CSS variables
6. [Publishing your theme](#publishing-a-theme)

---

## Quick start

Create a working v2 theme in three steps:

**1.** Create the theme folder inside `.cubic/themes/`:

```
.cubic/themes/my-theme/
```

**2.** Inside it, create `Meta.toml` with the metadata:

```toml
name = "My Theme"
author = "YourName"
version = "1.0.0"
description = "A minimalist dark theme"
```

**3.** Create `Definition.toml` with the minimal appearance:

```toml
[backgrounds]
main = "#1a1a2e"
sidebar = "#16213e"
card = "#0f3460"

[text]
primary = "#ffffff"
secondary = "#cccccc"

[colors]
accent = "#e94560"
```

Restart (or reload) the launcher and select **My Theme** in the theme selector. Done! The rest of this guide covers every available option.

---

## Where themes live

User themes go inside `.cubic/themes/`. Each theme is **a folder** whose contents depend on the version:

**v2 (recommended):**

```
.cubic/
└── themes/
    └── <id>/
        ├── Meta.toml          # metadata (name, author, version…)
        ├── Definition.toml    # appearance (colors, fonts, background…)
        ├── Inject.css         # (optional) advanced CSS
        └── bg.jpg             # (optional) background image
```

**v1 (legacy):**

```
.cubic/
└── themes/
    └── <id>/
        ├── theme.json         # everything in a single file
        └── bg.jpg             # (optional) background image
```

> ⚠️ For security reasons, the launcher **does not load anything** outside `.cubic`.

### How the version is detected

The launcher automatically decides which version to use based on which files it finds, in this order:

1. Does `Meta.toml` exist? → Treated as **v2** (loads `Meta.toml` + `Definition.toml`).
2. If not, does `theme.json` exist? → Treated as **v1**.
3. If neither exists → the theme is **ignored**.

---

## v2 format (TOML) — Recommended

v2 splits the theme into two files: `Meta.toml` (who and what the theme is) and `Definition.toml` (how it looks).

### `Meta.toml` — Metadata

```toml
name = "My Theme"
author = "YourName"
version = "1.0.0"
description = "A minimalist dark theme"
injects_css = false
```

| Field | Type | Required? | Description |
|---|---|---|---|
| `name` | `string` | **Yes** | Theme name shown in the selector. |
| `author` | `string` | No | Theme author. Empty by default. |
| `version` | `string` | No | Semantic version of the theme. Empty by default. |
| `description` | `string` | No | Short description. Empty by default. |
| `injects_css` | `bool` | No | Informational only. If `Inject.css` exists, it is **always injected**, regardless of this value. `false` by default. |

### `Definition.toml` — Appearance

Each **section** of the file groups one kind of visual property. Full example:

```toml
[background]
reference_path = "bg.webp"
image_blur = 10.0
image_opacity = 0.5

[colors]
accent = "#ff0000"
"accent-rgb" = "255, 0, 0"

[text]
primary = "#ffffff"
secondary = "#cccccc"

[borders]
color = "#333333"
radius = "8px"
"radius-sm" = "4px"

[shadows]
"shadow-sm" = "0 1px 3px rgba(0,0,0,0.5)"
"shadow-md" = "0 4px 6px rgba(0,0,0,0.3)"
"glow-accent" = "0 0 12px rgba(255,0,0,0.3)"

[backgrounds]
main = "#1a1a2e"
sidebar = "#16213e"
card = "#0f3460"
"item-active" = "#e94560"
overlay = "rgba(0,0,0,0.7)"
input = "#1a1a2e"

[layout]
"font-family" = "'Inter', sans-serif"
"font-size-base" = "14px"
"font-size-sm" = "12px"
"font-size-lg" = "18px"

[others]
"icon-filter" = "invert(1)"
"color-success" = "#22c55e"
"color-error" = "#ef4444"
"color-warning" = "#f59e0b"
"color-status-starting" = "#f97316"
"color-status-started" = "#22c55e"
"scrollbar-track" = "#1a1a2e"
"scrollbar-thumb" = "#e94560"

[backdrop]
dropdown = 10.0
modal = 4.0

[[fonts]]
family = "MyFont"
src = "fonts/my-font.woff2"
format = "woff2"
weight = "400"
style = "normal"
```

> **Important:** sections are written **without** the `theme.` prefix (i.e. `[background]`, `[colors]`, `[[fonts]]`). The `theme.` prefix only applies if you merge both files into a single TOML as a `V2Theme`.

### How sections map to CSS variables

Each key in `Definition.toml` is "flattened" into a CSS variable with a prefix depending on its section:

| Section | CSS prefix | Example key | Generated variable |
|---|---|---|---|
| `[colors]` | `--` | `accent` | `--accent` |
| `[text]` | `--text-` | `primary` | `--text-primary` |
| `[borders]` | `--border-` | `color` | `--border-color` |
| `[shadows]` | `--` | `shadow-sm` | `--shadow-sm` |
| `[backgrounds]` | `--bg-` | `main` | `--bg-main` |
| `[layout]` | `--` | `font-family` | `--font-family` |
| `[others]` | `--` | `icon-filter` | `--icon-filter` |
| `[backdrop]` | `--backdrop-blur-` | `modal` | `--backdrop-blur-modal` |

**Special cases:**

- `[backdrop]` automatically appends `px` to the value: `dropdown = 10.0` → `--backdrop-blur-dropdown: 10px`.
- `[background]` (singular — the background image) automatically generates these three variables:

| Field | Generated variable |
|---|---|
| `reference_path = "bg.webp"` | `--bg-image-path: bg.webp` |
| `image_blur = 10.0` | `--bg-image-blur: 10px` |
| `image_opacity = 0.5` | `--bg-image-opacity: 0.5` |

### `Inject.css` — Advanced CSS (optional)

If the theme directory contains an `Inject.css` file, its contents are injected directly into the interface (**always**, regardless of the `injects_css` value in `Meta.toml`).

It's useful for everything that can't be expressed with CSS variables alone:

- `@keyframes` and custom animations
- `@media` queries
- Nested selectors
- Pseudo-elements (`::before`, `::after`)

---

## v1 format (JSON) — Legacy

> Use v1 only to maintain existing themes. For new themes, use [v2](#v2-format-toml--recommended).

The whole theme is defined in a single `theme.json` file:

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

| Field | Type | Required? | Description |
|---|---|---|---|
| `name` | `string` | **Yes** | Theme name shown in the selector. |
| `variables` | `object` | **Yes** | Map of CSS variables. String keys and values. Written as-is, `--` included (see [CSS variables](#available-css-variables)). |
| `author` | `string` | No | Theme author. Empty by default. |
| `version` | `string` | No | Theme version. Empty by default. |
| `type` | `string` | No | `"user"` for user themes. `"builtin"` themes ship with the launcher. |
| `bg_image` | `string?` | No | Background image file name, relative to the theme directory. |
| `bg_image_blur` | `string?` | No | Background blur as a string (e.g. `"10px"`). Parsed to a number; if invalid, `0.0` is used. |
| `bg_image_opacity` | `number?` | No | Background opacity, from 0 to 1 (e.g. `0.6`). |
| `fonts` | `array` | No | List of custom fonts (see [Fonts](#fonts)). Empty by default. |

> In v1, `bg_image_blur` and `bg_image_opacity` remain separate fields in `ThemeResponse` — they are **not** turned into CSS variables (unlike v2).

---

## Shared reference (v1 and v2)

### Fonts

Both versions support custom fonts with the same fields. Only where they are declared changes:

- **v2:** `[[fonts]]` blocks in `Definition.toml`
- **v1:** `fonts` array in `theme.json`

| Field | Type | Required? | Description |
|---|---|---|---|
| `family` | `string` | **Yes** | Font family name (the one you later use in `font-family`). |
| `src` | `string` | **Yes** | Path to the font file, relative to the theme directory (or absolute). |
| `format` | `string?` | No | File format: `woff2`, `ttf`, `otf`, etc. |
| `weight` | `string?` | No | Weight: `400`, `700`, `bold`, etc. |
| `style` | `string?` | No | Style: `normal`, `italic`, `oblique`. |

**v2 example (TOML):**

```toml
[[fonts]]
family = "MyFont"
src = "fonts/my-font.woff2"
format = "woff2"
weight = "400"
style = "normal"
```

**v1 example (JSON):**

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

**Path resolution:**

- **Relative** paths are resolved against the theme directory.
- Paths starting with `/` (or absolute paths) are used as-is.
- To detect absolute paths: v1 recognizes the `file:` prefix; v2 recognizes `:` (for example `C:\` on Windows).

> ⚖️ **License:** when distributing a theme with custom fonts, always include the font's license and only use fonts you have the right to redistribute.

### Background image

The field referencing the image depends on the version:

- **v2:** `reference_path` inside `[background]`
- **v1:** `bg_image` in `theme.json`

In both cases it points to a file inside the theme folder (e.g. `bg.jpg`, `bg.webp`).

**Validations applied by the launcher:**

1. **Checks the real file type** via *magic number* (using the `infer` library); it does not trust the file extension.
2. **Rejects images larger than 25 MB** for security and efficiency. If exceeded, the background is ignored and a warning is shown.
3. **Only accepts valid image formats:** PNG, JPG, GIF, WEBP, etc.

If the image cannot be loaded (corrupted file, invalid format, too heavy), the launcher simply ignores it and shows no background.

**Background-related CSS variables:**

| Variable | Source | Description |
|---|---|---|
| `--bg-image` | Internal (frontend) | URL of the loaded image. |
| `--bg-image-loaded` | Internal (frontend) | `0` while loading, `1` when ready. |
| `--bg-image-path` | v2: `reference_path` | Path to the image file (v2 only). |
| `--bg-image-blur` | v2: `image_blur` | Blur in pixels (v2 only). |
| `--bg-image-opacity` | v2: `image_opacity` | Background opacity (v2 only). |

### Available CSS variables

This is the full list of variables consumed by the frontend. In **v1** they are written as-is (with `--`) inside `variables`; in **v2** they are written **without** the prefix, in the indicated section.

#### Background colors — v2: `[backgrounds]`

| Variable | Description |
|---|---|
| `--bg-main` | Main window background |
| `--bg-sidebar` | Sidebar background |
| `--bg-card` | Card background |
| `--bg-item-active` | Active item background |
| `--bg-overlay` | Overlay/modal background |
| `--bg-input` | Input background |

#### Text colors — v2: `[text]`

| Variable | Description |
|---|---|
| `--text-primary` | Primary text |
| `--text-secondary` | Secondary text |
| `--text-muted` | Disabled or subtle text |

#### Accent — v2: `[colors]`

| Variable | Description |
|---|---|
| `--accent` | Main accent color |
| `--accent-rgb` | Accent in RGB format (to use with `rgba()`) |
| `--accent-hover` | Accent on hover |
| `--accent-text` | Text color over accent background |

#### Borders — v2: `[borders]`

| Variable | Description |
|---|---|
| `--border-color` | Border color |
| `--border-radius` | General border radius |
| `--border-radius-sm` | Small border radius |

#### Shadows — v2: `[shadows]`

| Variable | Description |
|---|---|
| `--shadow-sm` | Small shadow |
| `--shadow-md` | Medium shadow |
| `--glow-accent` | Accent color glow |

#### States — v2: `[others]`

| Variable | Description |
|---|---|
| `--color-success` | Success color |
| `--color-success-rgb` | Success in RGB format |
| `--color-error` | Error color |
| `--color-error-rgb` | Error in RGB format |
| `--color-warning` | Warning color |
| `--color-warning-rgb` | Warning in RGB format |
| `--color-status-starting` | "Starting" state |
| `--color-status-started` | "Started" state |

#### Scrollbar — v2: `[others]`

| Variable | Description |
|---|---|
| `--scrollbar-track` | Scrollbar track background |
| `--scrollbar-thumb` | Scrollbar thumb color |

#### Typography — v2: `[layout]`

| Variable | Description |
|---|---|
| `--font-family` | Font family |
| `--font-size-base` | Base text size |
| `--font-size-sm` | Small size |
| `--font-size-lg` | Large size |

#### Icons — v2: `[others]`

| Variable | Description |
|---|---|
| `--icon-filter` | CSS filter for icons (e.g. `invert(1)`) |
| `--icon-filter-error` | Filter for error icons |

#### Backdrop blur — v2 only: `[backdrop]`

| Variable | Description |
|---|---|
| `--backdrop-blur-dropdown` | Dropdown blur |
| `--backdrop-blur-modal` | Modal blur |

---

## Publishing a theme

Want to share your theme with the community? Send a Pull Request to the [official Themes repository](https://github.com/CubicLauncherDevs/Themes). Published themes appear on the official website: [cubiclauncher.org/themes](https://www.cubiclauncher.org/themes).

### Repository structure

Each theme lives under `src/<Author>/<Theme>/`, with `theme.md` at the theme root and one subfolder per version (`V1`, `V2`, …):

```
src/
  <Author>/
    <Theme>/
      theme.md               # theme description (required)
      V1/
        Author_Theme.zip     # theme package (required)
        Showcase.png         # preview (optional)
        changelog.md         # version changes (optional)
      V2/                    # new versions (optional)
        ...
```

### Steps to add your theme

1. Create `src/YourAuthor/YourTheme/theme.md` with the theme description.
2. Create the version folder `src/YourAuthor/YourTheme/V1/`.
3. Add `YourAuthor_YourTheme.zip` inside it (the ZIP name must follow the `Author_Theme.zip` pattern).
4. *(Optional)* Add `Showcase.png` as a preview (the name is matched *case-insensitively*, lowercase is fine).
5. *(Optional)* Add `changelog.md` with the version's change log.
6. To publish new versions of the theme, create `V2/`, `V3/`, etc.
7. Open a Pull Request to the repository.

### Theme files

**At the theme root:**

| File | Required? | Description |
|---|---|---|
| `theme.md` | **Yes** | Theme description/README in Markdown. |

**Inside each version folder (`V1/`, `V2/`, …):**

| File | Required? | Description |
|---|---|---|
| `Author_Theme.zip` | **Yes** | Theme package. |
| `Showcase.png` | No | Preview for that version (*case-insensitive* name). |
| `changelog.md` | No | Changes for that version. |

**`theme.md` example:**

```markdown
# My Theme

Markdown description of the theme, its inspiration, etc.
```

**`changelog.md` example:**

```markdown
# V1

- First release
- Dark theme with green accents
```

### The ZIP file

**Name:** `Author_Theme.zip` — with an underscore, no spaces or colons.

**Contents for v2 (recommended):**

```
Author_Theme.zip
└── <theme-name>/
    ├── Meta.toml
    ├── Definition.toml
    ├── Inject.css        (optional)
    └── bg.EXTENSION      (optional)
```

**Contents for v1 (legacy):**

```
Author_Theme.zip
└── <theme-name>/
    ├── theme.json
    └── bg.EXTENSION      (optional)
```

**Accepted image formats:** PNG, GIF, WEBP and JPG.

### What happens after the merge?

The repository includes a **GitHub Action** (`.github/workflows/generate-themes.yml`) that runs on every push:

1. Scans the `src/` folder.
2. Reads each theme's `theme.md` and `changelog.md`.
3. Gets the git dates of each version.
4. Builds download URLs pointing to `raw.githubusercontent.com`.
5. Generates the `themes.json` file at the repository root.

That `themes.json` is served statically and is what the CubicLauncher website uses to display and download themes. You don't need to do anything extra: once your PR is accepted, the theme automatically appears on [cubiclauncher.org/themes](https://www.cubiclauncher.org/themes).

### Repository license

The Themes repository is licensed under [CC0 1.0 Universal](https://github.com/CubicLauncherDevs/Themes/blob/master/LICENSE) (public domain). By submitting your theme, you agree to publish it under that license. Remember that the **fonts** bundled with your theme keep their own license: include it and only use fonts you have the right to redistribute.