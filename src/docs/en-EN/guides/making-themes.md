---
title: How to create themes
description: Complete guide to create, package, and publish custom themes for CubicLauncher. Covers the V1 (legacy) and V2 (recommended) formats, resources, validations, and the official publishing flow.
---

# How to create themes for CubicLauncher

CubicLauncher allows you to customize the user interface through **themes**. A theme defines colors, fonts, borders, shadows, background images, icons, and, in the V2 format, additional CSS stylesheets.

This guide describes how to create a theme from scratch, how to package it, how to test it locally, and how to publish it to the official repository.

> **Compatibility reference:** updated to [commit `5a7e752` on `develop` (September 16, 2026)](https://github.com/CubicLauncherDevs/CubicLauncher/commit/5a7e752bbb34b0c4573830cbf43616931a8263ca). The new dimensions and `Inject.css` precedence require a build that includes this change. See the [default variables in `reset.css`](https://github.com/CubicLauncherDevs/CubicLauncher/blob/5a7e752bbb34b0c4573830cbf43616931a8263ca/src/styles/shared/reset.css) for reference names and values.

:::details Introduction
### What is a theme?

A theme is a set of files that CubicLauncher interprets to modify the visual appearance of the application. Internally, CubicLauncher converts any theme format into a common structure called `ThemeResponse`, which the frontend uses to apply styles.

### Format versions

CubicLauncher supports two versions of the theme format:

| Version | Format | Status | Recommendation |
|---|---|---|---|
| V1 | JSON (`theme.json`) | Legacy | Kept for compatibility, but does not receive new features. |
| V2 | TOML (`Meta.toml` + `Definition.toml`) | Current | Recommended for new themes. Supports icons, injected CSS, and a clearer organization. |
:::

:::details General concepts
### Version detection

CubicLauncher automatically detects the theme version based on the file present in the theme directory:

- If `Meta.toml` exists, it is a **V2**.
- If `theme.json` exists, it is a **V1**.

When importing a ZIP through `import_theme_zip`, CubicLauncher first looks for a `theme.json` inside the package. If it is not found, it tries to import the file as a V2 package (`Meta.toml`).

### Path resolution

Relative paths specified in background images, fonts, and icons are automatically resolved relative to the installed theme directory. It is recommended to use relative paths inside the ZIP to keep the package portable.

### Resource validations

CubicLauncher applies the following security validations:

- **Background images**: must be valid image files (identified by magic bytes) and cannot exceed **25 MB**.
- **Custom icons (V2)**: must have the `svg`, `png`, `webp`, `jpg`, or `jpeg` extension; raster images cannot exceed **2 MB**.
- **Fonts**: if the path is relative, it is resolved locally to the theme directory.
:::

:::details Creating a V1 theme (legacy)
The V1 format uses a single JSON file named `theme.json`. It is simple but limited: it does not support custom icons or injected CSS.

### Required files

```
ThemeName/
└── theme.json        # required
```

### Optional resources

- `bg.EXT` — background image.
- Font files referenced in `fonts`.

### `theme.json` schema

| Field | Type | Required | Description |
|---|---|---|---|
| `name` | string | Yes | Theme name. |
| `author` | string | No | Theme author. |
| `version` | string | No | Theme version (semver recommended). |
| `type` | string | No | Theme type. Exposed as-is in the listing. |
| `variables` | object | Yes | Map of CSS variables `key: value`. |
| `bg_image` | string | No | Path to the background image. |
| `bg_image_blur` | string | No | Background image blur. Converted to a number if possible. |
| `bg_image_opacity` | number | No | Background image opacity (0.0 to 1.0). |
| `fonts` | array | No | List of custom fonts. |

### Fonts in V1

Each entry in the `fonts` array follows this schema:

| Field | Type | Required | Description |
|---|---|---|---|
| `family` | string | Yes | Font family name. |
| `src` | string | Yes | Path to the font file. |
| `format` | string | No | Font format, for example `woff2`. |
| `weight` | string | No | Font weight, for example `400` or `700`. |
| `style` | string | No | Font style, for example `normal` or `italic`. |

### Complete V1 example

```json
{
  "name": "Midnight Blue",
  "author": "CubicLabs",
  "version": "1.0.0",
  "type": "user",
  "variables": {
    "--bg-main": "#0a0e17",
    "--bg-card": "#111827",
    "--accent": "#3b82f6",
    "--text-primary": "#e5e7eb",
    "--border-radius": "8px"
  },
  "bg_image": "bg.webp",
  "bg_image_blur": "8",
  "bg_image_opacity": 0.4,
  "fonts": [
    {
      "family": "Inter",
      "src": "fonts/Inter.woff2",
      "format": "woff2",
      "weight": "400"
    }
  ]
}
```

### V1 limitations

- No custom icon system.
- Does not allow injecting additional CSS.
- The `bg_image_blur` field is received as a `string` and is parsed to a number.
- CSS variables are defined manually exactly as they will be applied.
:::

:::details Creating a V2 theme (recommended)
The V2 format separates metadata from visual definitions into two TOML files:

- `Meta.toml`: author information, name, version, and whether the theme injects CSS.
- `Definition.toml`: all visual variables, fonts, icons, backgrounds, and additional values.

### Required files

```
ThemeName/
├── Meta.toml           # metadata
└── Definition.toml     # visual definitions
```

### Optional resources

- `Inject.css` — additional stylesheet.
- `bg.EXT` — background image.
- Font files.
- SVG/PNG/WEBP/JPG icons organized in subfolders.

### `Meta.toml` schema

| Field | Type | Required | Description |
|---|---|---|---|
| `name` | string | Yes | Theme name. |
| `author` | string | No | Theme author. |
| `version` | string | No | Theme version (semver recommended). |
| `description` | string | No | Brief theme description. |
| `injects_css` | boolean | No | Indicates if the theme includes an `Inject.css` file. |

### `Definition.toml` schema

| Field | Type | Description |
|---|---|---|
| `[background]` | section | Background image configuration. |
| `[background.reference_path]` | string | Path to the background image. |
| `[background.image_blur]` | number | Image blur. |
| `[background.image_opacity]` | number | Image opacity (0.0 to 1.0). |
| `[colors]` | object | Theme colors. |
| `[text]` | object | Text colors and styles. |
| `[borders]` | object | Borders and radii. |
| `[layout]` | object | Spacing, widths, heights, and other layout values. |
| `[shadows]` | object | Shadows and glows. |
| `[backgrounds]` | object | Additional background colors. |
| `[backdrop]` | object | Backdrop blur values, in pixels. |
| `[fonts]` | array | Custom fonts. |
| `[icons]` | section | Custom icons. |
| `[icons.preview]` | string | Theme preview icon. |
| `[icons.<group>]` | object | Icons grouped by category. |
| `[others]` | object | Free additional variables. |

### CSS variable prefix system

In V2, CubicLauncher automatically converts the TOML sections into flat CSS variables that the frontend can consume. The following table shows the prefix applied to each section:

| Section | Example key | Generated variable |
|---|---|---|
| `colors` | `accent` | `--accent` |
| `text` | `primary` | `--text-primary` |
| `borders` | `radius` | `--border-radius` |
| `layout` | `spacing` | `--spacing` |
| `shadows` | `glow-accent` | `--glow-accent` |
| `backgrounds` | `card` | `--bg-card` |
| `backdrop` | `modal` | `--backdrop-blur-modal` |
| `others` | `icon-filter` | `--icon-filter` |

Important notes:

- The `[background]` field **is not converted into CSS variables**. It is exposed directly as the theme background image.
- Duplicate keys generate a warning in the logs and are overwritten.

### Minimal V2 example

`Meta.toml`:

```toml
[meta]
name = "Minimal"
author = "CubicLabs"
version = "1.0.0"
```

`Definition.toml`:

```toml
[theme.background]

[theme.colors]
accent = "#ffffff"
bg-main = "#0a0a0a"

[theme.text]
primary = "#e5e5e5"
```

### Complete V2 example

`Meta.toml`:

```toml
[meta]
name = "Midnight Blue"
author = "CubicLabs"
version = "2.0.0"
description = "A dark theme with blue accents."
injects_css = true
```

`Definition.toml`:

```toml
[theme.background]
reference_path = "bg.webp"
image_blur = 8.0
image_opacity = 0.4

[theme.colors]
accent = "#3b82f6"
bg-main = "#0a0e17"
bg-card = "#111827"

[theme.text]
primary = "#e5e7eb"
secondary = "#9ca3af"

[theme.borders]
color = "#1f2937"
radius = "8px"

[theme.layout]
spacing = "1rem"

[theme.shadows]
glow-accent = "0 0 12px rgba(59, 130, 246, 0.3)"

[theme.backgrounds]
sidebar = "#0f172a"

[theme.backdrop]
modal = 8.0
dropdown = 4.0

[theme.others]
icon-filter = "invert(1)"

[[theme.fonts]]
family = "Inter"
src = "fonts/Inter.woff2"
format = "woff2"
weight = "400"

[[theme.fonts]]
family = "Inter"
src = "fonts/Inter-Bold.woff2"
format = "woff2"
weight = "700"

[theme.icons]
preview = "icons/preview.png"

[theme.icons.ui]
play = "icons/ui/play.svg"
settings = "icons/ui/settings.svg"

[theme.icons.sidebar]
home = "icons/sidebar/home.svg"
```

`Inject.css` (optional):

```css
/* Customize Market cards without !important */
.market-item {
  padding: 20px;
}
```
:::

:::details Interface dimensions and styles
Change `5a7e752` expands customization through CSS variables without changing the file formats. V1 themes can use these variables in `variables`; V2 themes declare them in the categories of `Definition.toml`. Omitting a variable preserves the launcher's default value.

### Lists and the Market grid

| Variable | Default value | Usage |
|---|---|---|
| `--sidebar-width` / `--sidebar-compact-width` | `260px` / `70px` | Width of the normal / compact sidebar. |
| `--sidebar-row-height` / `--sidebar-compact-row-height` | `52px` / `50px` | Instance row height in each mode. |
| `--sidebar-row-gap` | `8px` | Spacing between sidebar rows. |
| `--version-row-height` | `78px` | Row height in the version download selector. |
| `--resource-row-height` / `--resource-row-gap` | `130px` / `6px` | Total row height and spacing in mod and resource pack catalogs. |
| `--resource-card-padding` / `--resource-icon-size` | `14px 16px` / `56px` | Card padding and icon size. |
| `--market-row-height` / `--market-grid-gap` | `224px` / `12px` | Total row height and spacing in the Market. |
| `--market-card-min-width` | `280px` | Reference width for calculating Market columns (between 1 and 4). |
| `--market-grid-padding` | `8px` | Space on the right of Market rows. |
| `--market-card-padding` / `--market-icon-size` | `14px` / `48px` | Market card padding and icon size. |

Virtualized lists only render visible items. Use these variables to change their dimensions: changing only a card's CSS `height` or margins can desynchronize scroll calculations. In the Market, the visible row height is `--market-row-height` minus `--market-grid-gap`; resource cards subtract `--resource-row-gap` from the total height.

Dimensions are resolved through CSS and observed with `ResizeObserver`: they support `px`, `rem`, `calc()`, and `var()`, and update when the font size changes or `Inject.css` loads. Use positive lengths for heights and widths; the Market grid gap and padding can be `0px`. Adjust the total height when increasing padding, icons, or text size.

### Colors, states, and effects

| Variables | Usage and notable defaults |
|---|---|
| `--accent-text` | Text on accent buttons; `#0a0a0a`. Adjust it alongside `--accent` to maintain contrast. |
| `--surface-rgb`, `--surface-subtle`, `--surface-raised` | Base RGB (`255, 255, 255`) and surfaces with opacity `0.02` / `0.04`. Light themes can use a dark base. |
| `--border-hover`, `--border-focus` | Interaction borders derived from `--surface-rgb` with opacity `0.1` / `0.3`. |
| `--color-success`, `--color-error`, `--color-warning`, `--color-info` | Semantic colors: `#22c55e`, `#ef4444`, `#eab308`, `#60a5fa`. |
| `--color-on-success`, `--color-on-error`, `--color-on-warning`, `--color-on-info` | Text on status backgrounds; `#fff`. |
| `--color-status-starting`, `--color-status-started` | Starting / running status; use `--color-info` / `--color-success`. |
| `--toast-bg`, `--toast-border` | Notification background and border; derived from `--bg-card` and `--surface-rgb`. |
| `--download-library`, `--download-asset`, `--download-native`, `--download-client` | Library, asset, native, and client colors: `#4ade80`, `#60a5fa`, `#f59e0b`, `#a78bfa`. |
| `--download-verifying`, `--download-generic`, `--download-processing`, `--download-jre` | Verification, generic download, processing, and Java: `#f472b6`, `#94a3b8`, `#fb923c`, `#22d3ee`. |
| `--log-trace`, `--log-debug`, `--log-info`, `--log-message`, `--log-warn`, `--log-error`, `--log-fatal`, `--log-launcher`, `--log-stderr`, `--log-unknown` | Colors by log level/source; default to values derived from text and status colors. |
| `--media-overlay`, `--media-overlay-text`, `--viewer-overlay` | Image overlay (`rgba(0, 0, 0, 0.6)`), text (`#fff`), and viewer (`rgba(0, 0, 0, 0.9)`). |
| `--shadow-inset`, `--shadow-floating`, `--shadow-image`, `--shadow-indicator` | Inset, floating, image, and indicator shadows. The last three use `--shadow-lg`, `--shadow-md`, and `--shadow-sm`. |
| `--shadow-drawer-left`, `--shadow-drawer-right`, `--shadow-drawer-top`, `--shadow-drawer-bottom` | Drawer shadows by direction. |
| `--bg-image-brightness`, `--bg-image-size`, `--bg-image-position` | Background brightness (`0.4`), size (`cover`), and position (`center`). Brightness is independent of the opacity and blur configured in `[theme.background]`. |

The variables `--error` and `--warning` remain as legacy names. For new themes, prefer the semantic `--color-*` colors. If you change `--accent`, `--color-success`, `--color-error`, or `--color-warning`, keep their `*-rgb` variables consistent when used for transparency; write RGB values as `"239, 68, 68"`, without `rgb()`.

### V2 example: dimensions and contrast

This `Definition.toml` can be used with the earlier minimal `Meta.toml`. When adapting it to an existing theme, merge the keys into the corresponding sections: do not repeat a TOML table.

```toml
[theme.background]

[theme.colors]
accent = "#d89b53"
accent-rgb = "216, 155, 83"
accent-hover = "#e5ad6d"
accent-text = "#17120d"
bg-main = "#17120d"
bg-sidebar = "#211a13"
bg-card = "#292017"
surface-rgb = "255, 240, 220"
log-warn = "#f1c875"
download-jre = "#8dcbb8"

[theme.text]
primary = "#f5eadb"
secondary = "#c6b6a1"

[theme.layout]
font-size-base = "14px"
sidebar-row-height = "4rem"
sidebar-compact-row-height = "4rem"
version-row-height = "6rem"
resource-row-height = "10rem"
resource-card-padding = "16px"
market-row-height = "calc(18rem + 12px)"
market-grid-gap = "12px"
market-card-min-width = "300px"
market-card-padding = "20px"
modal-width = "480px"
modal-padding = "24px"
icon-scale = "1.1"

[theme.others]
font-family-mono = "ui-monospace, Consolas, monospace"
bg-image-brightness = "0.55"
```

Variable values are strings, including unitless factors such as `icon-scale`. Use `[theme.layout]` to generate `--modal-width` or `--font-size-base`, and `[theme.others]` for `--font-family-mono`. Placing `font-family-mono` in `[theme.text]` would generate `--text-font-family-mono`, which does not control the monospace font.
:::

:::details Additional resources
### Background image

The background image is configured differently depending on the version:

- **V1**: `bg_image`, `bg_image_blur`, `bg_image_opacity`.
- **V2**: `[background]` section with `reference_path`, `image_blur`, `image_opacity`.

Supported formats: **PNG, WEBP, JPG, JPEG, and GIF** (internal validation uses `infer`, but PNG, WEBP, or JPG are recommended to avoid issues).

If the image exceeds **25 MB** or is not recognized as a valid image, CubicLauncher ignores it and, in V1, logs a warning key.

### Customizing the sidebar

The CubicLauncher sidebar is styled mainly through CSS variables. The following variables control its appearance:

| Variable | Description |
|---|---|
| `--bg-sidebar` | Solid background color of the sidebar. |
| `--bg-sidebar-gradient` | Gradient applied over the background. If defined, it takes priority over `--bg-sidebar`. |
| `--sidebar-width` | Width of the sidebar in normal mode. |
| `--bg-item-active` | Background of the active or selected item in the sidebar. |
| `--text-primary` | Primary text color of the sidebar. |
| `--text-secondary` | Secondary text color. |
| `--accent` | Accent color for buttons and interactive states. |
| `--border-color` | Color of borders and separators. |

#### Gradient behavior

In the frontend, the sidebar uses the following rule:

```css
background: var(--bg-sidebar-gradient, var(--bg-sidebar));
```

This means that if `--bg-sidebar-gradient` is defined, the gradient will be applied. If it is not defined, `--bg-sidebar` will be used as the fallback solid color.

#### Normal mode and compact mode

The sidebar can switch between two modes from the interface:

- **Normal mode**: uses the width defined by `--sidebar-width` (default value: `260px`).
- **Compact mode**: keeps the same colors and gradients, but displays only icons. Its width is controlled by `--sidebar-compact-width` (default `70px`).

#### V1 example

```json
"variables": {
  "--bg-sidebar": "#0f1010",
  "--bg-sidebar-gradient": "linear-gradient(180deg, #1a1a2e 0%, #0f1010 100%)",
  "--sidebar-width": "260px",
  "--bg-item-active": "#1c1d1d",
  "--text-primary": "#d8d8d8",
  "--accent": "#3b82f6"
}
```

#### V2 example

```toml
[theme.colors]
bg-sidebar = "#0f1010"
bg-sidebar-gradient = "linear-gradient(180deg, #1a1a2e 0%, #0f1010 100%)"
bg-item-active = "#1c1d1d"
accent = "#3b82f6"

[theme.layout]
sidebar-width = "260px"

[theme.text]
primary = "#d8d8d8"
```

> In V2, keys in the `colors` section generate variables with the `--` prefix directly (`bg-sidebar` → `--bg-sidebar`), while keys in `layout` also generate variables with the `--` prefix (`sidebar-width` → `--sidebar-width`).

### Customizing modals

CubicLauncher modals use a combination of global variables to define the overlay, blur, and dialog body.

| Variable | Description |
|---|---|
| `--bg-overlay` | Color or background of the dark overlay that covers the screen behind the modal. |
| `--backdrop-blur-modal` | Amount of blur applied to the modal overlay. |
| `--bg-sidebar` | Background color of the modal body. CubicLauncher reuses this color to maintain visual consistency. |
| `--border` / `--border-color` | Modal border color. |
| `--border-radius` | Modal border radius. |
| `--shadow-lg` | Modal drop shadow. |
| `--text-primary` | Color of the modal title and primary text. |
| `--text-muted` | Color of secondary buttons and auxiliary text. |
| `--modal-width` | Desired width, capped at `90vw`. If omitted, uses the component's width (`400px` if none is specified). |
| `--modal-max-height` | Maximum height; defaults to `90vh`. |
| `--modal-padding` / `--modal-gap` | Content padding and spacing; default to `var(--space-xl)` (`24px`) / `20px`. |
| `--modal-title-size` / `--modal-footer-gap` | Title size and action spacing; `1rem` / `10px`. |
| `--drawer-width` / `--drawer-max-height` | Side drawer width (`340px`, capped at `90vw`) and top/bottom drawer maximum height (`85vh`). |

#### Overlay behavior

In the frontend, the modal overlay is defined as follows:

```css
background: var(--bg-overlay, rgba(0, 0, 0, 0.75));
backdrop-filter: blur(var(--backdrop-blur-modal, 4px));
```

The base CSS already defines `--bg-overlay` as `rgba(0, 0, 0, 0.7)` and `--backdrop-blur-modal` as `4px`. The `0.75` value in this rule is only a fallback if the variable is unavailable, not the launcher's base value.

#### Note on modal background

The modal body uses `--bg-sidebar` as its background color:

```css
.modal {
  background: var(--bg-sidebar);
}
```

This means that customizing `--bg-sidebar` also changes the appearance of modals. If you want a different background exclusively for modals, you can override it using `Inject.css` with a selector like `.modal`.

#### V1 example

```json
"variables": {
  "--bg-overlay": "rgba(0, 0, 0, 0.85)",
  "--backdrop-blur-modal": "6px",
  "--bg-sidebar": "#141414",
  "--border-color": "#2a2a2a",
  "--border-radius": "12px",
  "--shadow-lg": "0 8px 28px rgba(0, 0, 0, 0.6)",
  "--text-primary": "#e5e5e5",
  "--text-muted": "#888888"
}
```

#### V2 example

```toml
[theme.colors]
bg-overlay = "rgba(0, 0, 0, 0.85)"
bg-sidebar = "#141414"

[theme.borders]
color = "#2a2a2a"
radius = "12px"

[theme.backdrop]
modal = 6.0

[theme.shadows]
shadow-lg = "0 8px 28px rgba(0, 0, 0, 0.6)"

[theme.text]
primary = "#e5e5e5"
muted = "#888888"
```

---

### Customizing scrollbars

CubicLauncher styles scrollbars through CSS variables that are later applied with `::-webkit-scrollbar` selectors.

| Variable | Description |
|---|---|
| `--scrollbar-track` | Background of the scrollbar track. |
| `--scrollbar-thumb` | Color of the scrollbar thumb. |
| `--scrollbar-thumb-hover` | Thumb color on hover. |
| `--scrollbar-size` | Scrollbar width and height; defaults to `6px`. |
| `--scrollbar-radius` | Thumb radius; defaults to `10px`. |

#### Behavior

The base file uses:

```css
::-webkit-scrollbar-track {
  background: var(--scrollbar-track, transparent);
}

::-webkit-scrollbar-thumb {
  background: var(--scrollbar-thumb, var(--border));
  border-radius: var(--scrollbar-radius);
}

::-webkit-scrollbar-thumb:hover {
  background: var(--scrollbar-thumb-hover, var(--text-secondary));
}
```

The base CSS defines the track as `var(--bg-main)`, the thumb as `rgba(var(--surface-rgb), 0.12)`, and hover as `var(--text-secondary)`. The second arguments of `var()` are fallbacks if those variables are unavailable.

#### Note on internal scrollbars

The internal scrollbars of `.qm-scroll` and `.modal` also use `--scrollbar-size`, `--scrollbar-thumb`, and `--scrollbar-radius`. Some details remain local, such as the transparent track in `.qm-scroll`; you can customize them through `Inject.css`.

#### V1 example

```json
"variables": {
  "--scrollbar-track": "#0c0c0c",
  "--scrollbar-thumb": "#333333",
  "--scrollbar-thumb-hover": "#555555"
}
```

#### V2 example

```toml
[theme.colors]
scrollbar-track = "#0c0c0c"
scrollbar-thumb = "#333333"
scrollbar-thumb-hover = "#555555"
```

---

### Customizing typography

Base typography and controls can be customized with these variables:

| Variable | Description |
|---|---|
| `--font-family` | Main font used throughout the interface. |
| `--font-size-base` | Base font size (`14px`); affects dimensions expressed in `rem`. |
| `--font-family-mono` | Monospace font for logs and technical content; defaults to a system font stack. |
| `--font-size-sm` / `--font-size-lg` | Small / large sizes; `0.8rem` / `1.2rem`. |
| `--font-size-control` / `--font-size-label` | Control / label size; `0.85rem` / `0.65rem`. |
| `--font-weight-normal` / `--font-weight-medium` / `--font-weight-bold` | Text weights; `400` / `600` / `700`. |
| `--line-height` | Base line height; `1.5`. |
| `--log-font-size` / `--log-line-height` | Log size and line height; `0.75rem` / `var(--line-height)`. |
| `--log-line-padding` / `--log-line-min-height` | Log line padding and minimum height; `2px 14px` / `22px`. |
| `--control-padding` / `--button-padding` | Control / button padding; `10px 12px` / `8px 16px`. |
| `--icon-scale` | Scale factor for icons using the shared `Icon` component; `1`. |
| `--font-loaded` | Internal flag indicating whether the custom font has loaded. Usually not necessary to modify. |

#### Behavior

The base CSS defines:

```css
html {
  font-size: var(--font-size-base, 14px);
}

body {
  font-family: var(--font-family);
}
```

This means that changing `--font-size-base` proportionally affects all text that uses `rem` units, and changing `--font-family` affects the entire interface.

#### Using a custom font

For `--font-family` to work correctly, the font files must be included in the theme and declared in the `fonts` section. The family declared in `fonts` must match the value of `--font-family`.

If the font has multiple weights or styles, declare each variant separately.

#### V1 example

```json
{
  "variables": {
    "--font-family": "\"Inter\", system-ui, sans-serif",
    "--font-size-base": "14px"
  },
  "fonts": [
    {
      "family": "Inter",
      "src": "fonts/Inter-Regular.woff2",
      "format": "woff2",
      "weight": "400"
    },
    {
      "family": "Inter",
      "src": "fonts/Inter-Bold.woff2",
      "format": "woff2",
      "weight": "700"
    }
  ]
}
```

#### V2 example

```toml
[meta]
name = "Custom Typography"
author = "CubicLabs"
version = "1.0.0"
```

`Definition.toml`:

```toml
[theme.background]

[theme.others]
font-family = "\"Inter\", system-ui, sans-serif"

[theme.layout]
font-size-base = "14px"

[[theme.fonts]]
family = "Inter"
src = "fonts/Inter-Regular.woff2"
format = "woff2"
weight = "400"

[[theme.fonts]]
family = "Inter"
src = "fonts/Inter-Bold.woff2"
format = "woff2"
weight = "700"
```

> In V2, `--font-family` and `--font-size-base` do not belong to a specific semantic category. It is recommended to define `--font-family` in `[theme.others]` and `--font-size-base` in `[theme.layout]`.

### Custom fonts

Both V1 and V2 allow custom fonts through the following schema:

```toml
[[theme.fonts]]
family = "Inter"
src = "fonts/Inter.woff2"
format = "woff2"
weight = "400"
style = "normal"
```

| Field | Description |
|---|---|
| `family` | Font family name. |
| `src` | Path to the font file. Can be relative to the theme, absolute, or start with `file:`. |
| `format` | Font format (`woff2`, `ttf`, etc.). |
| `weight` | Font weight (`100` to `900`, `bold`, etc.). |
| `style` | Style (`normal`, `italic`, etc.). |

### Custom icons (V2 only)

V2 allows replacing frontend icons through the `[theme.icons]` section.

The structure is as follows:

```toml
[theme.icons]
preview = "icons/preview.png"

[theme.icons.ui]
play = "icons/ui/play.svg"
settings = "icons/ui/settings.svg"
```

| Field | Description |
|---|---|
| `preview` | Path to the icon shown as the theme preview in the listing. |
| `[icons.<group>]` | Icon groups. Each key inside the group is exposed to the frontend as `{group}:{name}`. |

Example: the key `play` inside the group `ui` is exposed as `ui:play`.

Restrictions:

- Allowed extensions: `svg`, `png`, `webp`, `jpg`, `jpeg`.
- Raster images: maximum **2 MB**.
- The file is validated as a valid image (PNG/WEBP/JPG) or checked for existence (SVG).

Invalid icons are silently removed with a warning in the logs.

### Injected CSS (V2 only)

V2 allows including an additional stylesheet named `Inject.css` at the root of the theme.

To indicate that the theme includes custom CSS, set `injects_css = true` in `Meta.toml`:

```toml
[meta]
name = "Advanced Theme"
injects_css = true
```

The contents of `Inject.css` are read and sent to the frontend in the `inject_css` field of the `ThemeResponse`, and the launcher applies them when the theme is activated.

Since `5a7e752`, global styles and Svelte's scoped styles are grouped in `@layer cubic`. Normal `Inject.css` rules **outside any layer** take precedence over normal rules in that layer, without requiring Svelte's generated classes or `!important`:

```css
/* Inject.css: keep these rules outside @layer cubic */
.market-item {
  padding: 20px;
}

.modal {
  background: var(--bg-card);
}

/* Dimensions inherited by the grid and its observers */
.market-grid {
  --market-row-height: calc(18rem + 12px);
  --market-grid-gap: 12px;
}
```

Layer precedence does not override the rules for inline styles or `!important` declarations. Prefer defining global variables in `Definition.toml`; when using CSS, apply them to the container that consumes them, such as `.market-grid`. Do not override calculated internal values (`--row-height`, `--columns`, or the heights and transforms of virtualized rows).

When switching back to a built-in theme, check that injected rules disappear and default dimensions are restored.
:::

:::details Packaging a theme
A theme is distributed as a ZIP file. Inside the ZIP, files must be inside a root folder with the theme name.

### ZIP structure for V2

```
Author_Theme.zip
└── ThemeName/
    ├── Meta.toml
    ├── Definition.toml
    ├── Inject.css            (optional)
    ├── bg.webp               (optional)
    ├── fonts/
    │   └── Inter.woff2
    └── icons/
        ├── preview.png
        └── ui/
            ├── play.svg
            └── settings.svg
```

### ZIP structure for V1

```
Author_Theme.zip
└── ThemeName/
    ├── theme.json
    ├── bg.webp               (optional)
    └── fonts/
        └── Inter.woff2
```

### ZIP rules

- The ZIP can contain the target file at the root (`theme.json` or `Meta.toml`) or inside a subfolder.
- If multiple target files or multiple subfolders with them exist, the import is rejected.
- The ZIP file name for publishing in the official repository must follow the pattern `Author_Theme.zip`.
:::

:::details Testing a theme locally
CubicLauncher exposes several commands to import themes. During development, you can use any of the following methods:

### Importing a V1 JSON file directly

Use the `import_theme` command and select the `theme.json` file.

### Importing a V1 or V2 ZIP

Use the `import_theme_zip` command. CubicLauncher will try to automatically detect whether it is V1 (`theme.json`) or V2 (`Meta.toml`).

### Importing a V2 package directly

Use the `import_theme_cbth` command for `.cbth` files (V2 package format).

### Installed themes location

The `get_themes_dir_path` command returns the path where CubicLauncher stores installed themes. During development, you can check that folder to verify that files were extracted correctly.

### Checking the new customizations

1. Use a build that includes `5a7e752`, import the theme, and activate it.
2. Check contrast on buttons using `--accent-text`, notifications, logs, downloads, and overlays.
3. Change sidebar, version, and resource row heights and `--market-*` dimensions while scrolling. Check for overlaps or gaps; repeat with `rem` and a different `--font-size-base`.
4. In V2, try `.market-item { padding: 20px; }` in `Inject.css` without `!important` and verify that it applies. Increase row height if the content needs more space.
5. Check modals, icons, monospace fonts, and background brightness, including with blur and animations disabled in the launcher.
6. Switch back to a built-in theme and verify that styles and dimensions are restored; alternate between two themes to detect leftover values.
:::

:::details Publishing a theme
Want to share your theme with the community? Open a Pull Request to the [official Themes repository](https://github.com/CubicLauncherDevs/Themes). Published themes appear on the official website: [cubiclauncher.org/themes](https://www.cubiclauncher.org/themes).

### Repository structure

Each theme lives under `src/<Author>/<Theme>/`, with `theme.md` at the theme root and a subfolder per version (`V1`, `V2`, …):

> `V1/`, `V2/`, … refer to **version folders inside the repository**, not the legacy V1 format of CubicLauncher. Inside each version folder you place the theme files in whichever format you prefer (V2 recommended).

```
src/
  <Author>/
    <Theme>/
      theme.md               # theme description (required)
      vflag.txt              # theme verification, staff only (optional)
      V1/
        Meta.toml            # metadata
        Definition.toml      # visual definitions
        bg.png               # background image
        fonts/               # custom fonts
          Font.ttf
        Showcase.png         # preview (optional)
        changelog.md         # version changes (optional)
      V2/                    # new versions (optional)
        ...
```

:::info Binary files
Binary files (images, fonts) are **not stored in Git**. The CI workflow automatically uploads them to Cloudflare R2 and then deletes them from the repository. Therefore, only text files persist in the repo: TOML, CSS, TXT, MD, etc.
:::

### Steps to add your theme

1. Create `src/YourAuthor/YourTheme/theme.md` with the theme description.
2. Create the version folder `src/YourAuthor/YourTheme/V1/`.
3. Add `Meta.toml` and `Definition.toml` (CubicLauncher TOML format).
4. Add `bg.png` (or `.jpg`, `.gif`, `.webp`) as the background image.
5. *(Optional)* Add `Showcase.png` as a preview, fonts in `fonts/`, and `Inject.css`, `icons/`, etc.
6. *(Optional)* Add `changelog.md` with the version change log.
7. To publish new versions of the theme, create `V2/`, `V3/`, etc.
8. Open a Pull Request to the repository.

### Theme files

**At the theme root:**

| File | Required? | Description |
|---|---|---|
| `theme.md` | **Yes** | Theme description/README in Markdown. |
| `vflag.txt` | No | Full theme verification flag. **Only staff should add it; if the author includes it, the theme won't be verified.** |

**Inside each version folder (`V1/`, `V2/`, …):**

| File | Required? | Description |
|---|---|---|
| `Meta.toml` | **Yes** | Theme metadata. |
| `Definition.toml` | **Yes** | Theme visual definitions. |
| `bg.EXT` | **Yes** | Background image. Formats: PNG, GIF, WEBP, JPG. |
| `fonts/` | No | Custom fonts. |
| `Inject.css` | No | Additional CSS (requires `injects_css = true` in `Meta.toml`). |
| `icons/` | No | Custom icons (V2 format only). |
| `Showcase.png` | No | Preview of that version (name is *case-insensitive*). |
| `changelog.md` | No | Changes in that version. |

**Example of `theme.md`:**

```markdown
# My Theme

Markdown description of the theme, its inspiration, etc.
```

**Example of `changelog.md`:**

```markdown
# V1

- First release
- Dark theme with green accents
```

### Theme verification

The `themes.json` catalog marks a theme with `verified: true` only if a file named exactly `vflag.txt` exists in `src/<Author>/<Theme>/`, next to `theme.md`. It can be empty: its content is not read.

> **Important:** the `vflag.txt` file **should only be added by staff**. If you, as the theme author, include it in your PR, your theme **will not be verified**.

Verification applies to the theme as a whole. A directory named `vflag.txt` or a file inside `V1/`, `V2/`, etc. does not verify it. Without the file, or if it is removed, the catalog is generated with `verified: false`.

Adding or removing only this flag updates the catalog without regenerating previews or uploading/removing assets on R2.

### How to add only a `Showcase.png` to an existing theme?

1. Add `Showcase.png` to `src/<Author>/<Theme>/V1/Showcase.png`.
2. Commit and push to `master` (or open a PR).

The workflow uploads the file to R2, updates `showcaseUrl`, and preserves the existing R2 URLs of the other assets (bg, fonts, etc.).

> The preview is regenerated automatically. If `bg.png` is not on disk (it was already uploaded to R2 in a previous run), the preview will use a gradient as a fallback.

### What happens after the merge?

The repository includes a `Generate + Assets to R2` workflow (`.github/workflows/`) that runs on **push to `master`** and on **PRs** when files in `src/` are modified:

1. Detects which version directories changed (e.g. `src/YourAuthor/YourTheme/V1`).
2. Optimizes new PNGs with `oxipng`.
3. Generates previews only for the modified directories (`generate.js --dirs`).
4. Merges external *collections* into `packages.json`.
5. Uploads new binary assets to R2, updates `themes.json` with R2 URLs, and deletes local binaries (`scripts/upload-assets.mjs`).
6. Commits and pushes the changes (`[skip ci]` to avoid loops).

The resulting `themes.json` is served statically and is what the CubicLauncher website consumes to display and download themes. You don't need to do anything extra: once your PR is accepted, the theme automatically appears at [cubiclauncher.org/themes](https://www.cubiclauncher.org/themes).

### Themes Archive file

There is also a manual **`Themes Archive Release`** workflow in the *Actions* tab. When run, it generates a GitHub release named `archive-YYYY-MM-DD-HHMM` containing a ZIP with all themes and all their versions:

- Rebuilds the full `src/` by downloading text files from GitHub raw and binary assets from R2.
- Attaches `themes.json`, `packages.json`, `README.md`, and `LICENSE`.
- Verifies that the ZIP does not exceed GitHub's 2 GB limit before publishing it.

### Assets on R2

- Binaries are uploaded to `https://themes.cubiclauncher.org/` with hashed names (`file.<hash8>.ext`) and `Cache-Control: immutable`.
- Text files are served from GitHub raw.
- The R2 bucket has CORS enabled to allow downloads from the frontend.

```
Example:
  src/4xnl/Jadol/V1/bg.jpg
  → https://themes.cubiclauncher.org/src/4xnl/Jadol/V1/bg.132191b1.jpg
```

### Repository license

The Themes repository is under [CC0 1.0 Universal](https://github.com/CubicLauncherDevs/Themes/blob/master/LICENSE) (public domain). By submitting your theme, you agree to publish it under that license. Remember that the **fonts** included in your theme keep their own license: include it and use only fonts you have the right to redistribute.
:::

:::details Designing themes with AI (agents.md)
AI can greatly speed up theme design, but it also tends to reproduce generic combinations: dark backgrounds + blue accent, Inter fonts, and little else. To leverage AI without falling into repetition, use this prompt or adapt it to your assistant.

> This block works as an `agents.md`-style reference for AI and creators. Feel free to copy it, paste it into your favorite chat, and adjust it to the concept you want.

### Recommended prompt for AI agents

Copy and paste this into your assistant, adjusting the concept:

```text
[ROLE]
You are a designer specialized in desktop interfaces for Minecraft launchers. You will create a theme for CubicLauncher in V2 format (`Meta.toml` + `Definition.toml`).

[GOAL]
Generate a visually unique theme with a clear, coherent identity that is NOT a "generic dark theme with blue accents".

[DESIGN RULES]
- Choose a concrete and uncommon source of inspiration: a video game aesthetic, a design era, a visual subculture, an art movement, etc.
- Avoid the default blue/green/purple accent. Propose ochre, coral, muted turquoise, grayish lavender, etc.
- Use typefaces that add personality. You can combine a display font for titles with a legible sans for body text.
- The background should have texture, a subtle pattern, or an atmospheric gradient; not a flat dark color.
- Add icons that are coherent with the concept.
- Use `Inject.css` when variables alone are not enough (neon shadows, clipped borders, filters, etc.).
- Name variables semantically and consistently.

[TECHNICAL RULES]
- V2 format.
- Consult the actual variables in src/styles/shared/reset.css (reference: commit 5a7e752); use --accent-text and semantic colors with sufficient contrast.
- Use dimension variables for virtualized lists; do not override internal heights or transforms.
- Keep Inject.css rules outside @layer cubic to override normal component styles without !important.
- Relative paths for resources.
- Do not include `vflag.txt`.
- Background ≤ 25 MB; raster icons ≤ 2 MB.
- Validate TOML before delivering.

[EXPECTED OUTPUT]
1. `[meta]` with name, author, version, description, and `injects_css` if applicable.
2. Complete `[theme]` in `Definition.toml`.
3. List of recommended files (bg, fonts, icons).
4. Brief explanation of the concept and why it is unique.
```

### How to avoid generic results

- **Don't ask for "a dark theme"**: ask for something like "VT220 terminal UI", "mall vaporwave aesthetic", "Swiss brutalist design", "Pip-Boy interface", "Japanese lo-fi aesthetic", etc.
- **Limit "safe" colors**: if the AI defaults to blue/green/purple, ask it to change the accent to ochre, coral, muted turquoise, grayish lavender, etc.
- **Ask for deliberate imperfections**: subtle background noise, slightly worn edges, long shadows, unusual contrasts.
- **Make typography part of the identity**: a serif font for titles in a modern launcher can be more memorable than using Inter everywhere.
- **Use `Inject.css` for visual signatures**: gradient borders, alternate corners, glass/neo effects, monospaced type in certain panels.
- **Review the `icons/` folder**: custom icons are a huge differentiator; if you don't draw them manually, ask the AI for a coherent set and export them as SVG.

### Checklist before publishing

- [ ] The theme has a clear concept, not just "dark with an accent".
- [ ] The palette is distinguishable from popular themes such as Midnight Blue.
- [ ] Fonts load and readability is good.
- [ ] `bg.png` has detail, texture, or a gradient, not just a flat color.
- [ ] Icons (if any) are consistent with the concept.
- [ ] The TOML validates correctly.
- [ ] It does not include `vflag.txt`.
:::

:::details Quick reference
### V1 vs V2 comparison table

| Feature | V1 | V2 |
|---|---|---|
| Main format | JSON | TOML |
| Theme files | `theme.json` | `Meta.toml`, `Definition.toml` |
| Optional resources | Background image, fonts | Background image, fonts, icons, CSS |
| Icon system | No | Yes |
| Injected CSS | No | Yes (`Inject.css`) |
| Variable definition | Flat and manual | By categories with automatic prefixes |
| Background section | Root fields | `[background]` in `Definition.toml` |
| Status | Legacy | Recommended |

### Common frontend CSS variables

These variables are not required, but they are frequently used by the frontend and by the `extract_preview` function to generate the theme preview:

| Variable | Typical use |
|---|---|
| `--bg-main` | Main background. |
| `--bg-card` | Card or panel background. |
| `--bg-sidebar` | Sidebar background. |
| `--accent` | Accent color. |
| `--text-primary` | Primary text color. |

In V2, these variables come from the `colors`, `backgrounds`, and `text` sections with the corresponding prefixes.
:::

:::details Notes and best practices
- **Use semver** in the `version` field to keep a clear change history.
- **Compress images**: background images have a 25 MB limit and icons 2 MB. Lightweight images improve load time.
- **Prefer SVG or WEBP** for icons, since they offer better quality and compression.
- **Validate TOML/JSON** before packaging. Syntax errors cause CubicLauncher to silently ignore the theme during listing.
- **Keep paths relative** inside the ZIP so the package is portable.
- **Document licenses** for the fonts and images you include in your `theme.md`.
- **Avoid variable collisions** in V2: if two sections generate the same CSS variable, the theme will emit a warning and one value will overwrite the other.
- **Test the theme locally** before publishing it using `import_theme_zip` or the corresponding commands.
:::
