---
title: How to create themes
description: Complete guide to create, package, and publish custom themes for CubicLauncher. Covers the V1 (legacy) and V2 (recommended) formats, resources, validations, and the official publishing flow.
---

# How to create themes for CubicLauncher

CubicLauncher allows you to customize the user interface through **themes**. A theme defines colors, fonts, borders, shadows, background images, icons, and, in the V2 format, additional CSS stylesheets.

This guide describes how to create a theme from scratch, how to package it, how to test it locally, and how to publish it to the official repository.

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
/* Additional CSS to customize specific components */
.custom-button {
  text-transform: uppercase;
}
```
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
- **Compact mode**: keeps the same colors and gradients, but displays only icons.

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

#### Overlay behavior

In the frontend, the modal overlay is defined as follows:

```css
background: var(--bg-overlay, rgba(0, 0, 0, 0.75));
backdrop-filter: blur(var(--backdrop-blur-modal, 4px));
```

If `--bg-overlay` is not defined, a semi-transparent black is used as default (`rgba(0, 0, 0, 0.75)`). If `--backdrop-blur-modal` is not defined, the default blur is `4px`.

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

#### Behavior

The base file uses:

```css
::-webkit-scrollbar-track {
  background: var(--scrollbar-track, transparent);
}

::-webkit-scrollbar-thumb {
  background: var(--scrollbar-thumb, var(--border));
  border-radius: 10px;
}

::-webkit-scrollbar-thumb:hover {
  background: var(--scrollbar-thumb-hover, var(--text-secondary));
}
```

If these variables are not defined, the scrollbar uses `--border` for the thumb and `--text-secondary` for the hover state.

#### Note on internal scrollbars

Some specific components (such as `.qm-scroll` in certain panels or `.modal`) have their own scrollbar rules that do not fully depend on these global variables. For full control over all scrollbars, you can use `Inject.css` with `::-webkit-scrollbar` selectors.

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

The base application typography is mainly controlled by two variables:

| Variable | Description |
|---|---|
| `--font-family` | Main font used throughout the interface. |
| `--font-size-base` | Base font size. Defaults to `14px`; the rest of the sizes are calculated from this value. |
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

The contents of `Inject.css` are read and sent to the frontend in the `inject_css` field of the `ThemeResponse`. The frontend can then apply it as additional styles.

> **Warning**: injected CSS runs in the context of the application. Include only trusted CSS and avoid overriding critical system selectors unless intentional.
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
:::

:::details Publishing a theme
Want to share your theme with the community? Open a Pull Request to the [official Themes repository](https://github.com/CubicLauncherDevs/Themes). Published themes appear on the official website: [cubiclauncher.org/themes](https://www.cubiclauncher.org/themes).

### Repository structure

Each theme lives under `src/<Author>/<Theme>/`, with `theme.md` at the theme root and a subfolder per version (`V1`, `V2`, …):

```
src/
  <Author>/
    <Theme>/
      theme.md               # theme description (required)
      V1/
        Author_Theme.zip      # theme package (required)
        Showcase.png         # preview (optional)
        changelog.md         # version changes (optional)
      V2/                    # new versions (optional)
        ...
```

### Steps to add your theme

1. Create `src/YourAuthor/YourTheme/theme.md` with the theme description.
2. Create the version folder `src/YourAuthor/YourTheme/V1/`.
3. Add `YourAuthor_YourTheme.zip` inside it (the ZIP name must follow the `Author_Theme.zip` pattern).
4. *(Optional)* Add `Showcase.png` as a preview (the name is searched case-insensitive, lowercase is fine).
5. *(Optional)* Add `changelog.md` with the version change log.
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

**Accepted image formats:** PNG, GIF, WEBP, and JPG.

### What happens after the merge?

The repository includes a **GitHub Action** (`.github/workflows/generate-themes.yml`) that runs on every push:

1. Scans the `src/` folder.
2. Reads `theme.md` and `changelog.md` for each theme.
3. Gets git dates for each version.
4. Builds download URLs to `raw.githubusercontent.com`.
5. Generates the `themes.json` file at the repository root.

That `themes.json` is served statically and is what the CubicLauncher website consumes to display and download themes. You don't need to do anything extra: once your PR is accepted, the theme automatically appears at [cubiclauncher.org/themes](https://www.cubiclauncher.org/themes).

### Repository license

The Themes repository is under [CC0 1.0 Universal](https://github.com/CubicLauncherDevs/Themes/blob/master/LICENSE) (public domain). By submitting your theme, you agree to publish it under that license. Remember that the **fonts** included in your theme keep their own license: include it and use only fonts you have the right to redistribute.
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
