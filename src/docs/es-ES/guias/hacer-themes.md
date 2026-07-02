---
title: Como hacer themes | CubicLauncher
---

# Cómo hacer themes

CubicLauncher te permite personalizar completamente la interfaz con temas. Cada tema define colores, fuentes, bordes y una imagen de fondo opcional.

Actualmente existen **dos versiones** del sistema de themes. La **v1** (JSON, legacy) y la **v2** (TOML), siendo esta última la recomendada para themes nuevos.

---

## Estructura de un tema

Los temas de usuario van dentro de `.cubic/themes/`. Cada tema es una carpeta con los siguientes archivos según la versión:

### v1 (JSON legacy)
```
.cubic/
└── themes/
    └── <id>/
        ├── theme.json
        └── bg.jpg (opcional)
```

### v2 (TOML, recomendada)
```
.cubic/
└── themes/
    └── <id>/
        ├── Meta.toml
        ├── Definition.toml
        ├── Inject.css        (opcional)
        └── bg.jpg            (opcional)
```

> El launcher **no** carga nada que esté fuera de `.cubic` por seguridad.

### Detección de versión

El launcher detecta la versión automáticamente según qué archivos existan:

1. Si existe `Meta.toml` → se trata como **v2** (carga `Meta.toml` + `Definition.toml`)
2. Si existe `theme.json` → se trata como **v1**
3. Si no existe ninguno, el tema se ignora

---

## v1 — Formato JSON (legacy)

### Esquema completo

```json
{
  "name": "Mi Tema",
  "author": "TuNombre",
  "version": "1.0.0",
  "type": "user",
  "bg_image": "bg.jpg",
  "bg_image_blur": "10px",
  "bg_image_opacity": 0.6,
  "fonts": [
    {
      "family": "MiFuente",
      "src": "fonts/mi-fuente.woff2",
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

### Campos

| Campo | Tipo | Requerido | Descripción |
|---|---|---|---|
| `name` | `string` | Sí | Nombre visible del tema en el selector. |
| `author` | `string` | No | Autor del tema. Vacío por defecto. |
| `version` | `string` | No | Versión del tema. Vacío por defecto. |
| `type` | `string` | No | `"user"` para temas de usuario. Los `"builtin"` vienen incluidos. |
| `bg_image` | `string?` | No | Nombre del archivo de imagen de fondo (relativo al directorio del tema). |
| `bg_image_blur` | `string?` | No | Desenfoque del fondo como string (ej: `"10px"`). Se parsea a número; si no es válido, se ignora. |
| `bg_image_opacity` | `number?` | No | Opacidad del fondo (0 a 1, ej: `0.6`). |
| `fonts` | `array` | No | Lista de fuentes personalizadas (ver sección Fuentes). Vacío por defecto. |
| `variables` | `object` | Sí | Mapa de variables CSS. Claves y valores string. |

---

## v2 — Formato TOML (recomendado)

La v2 separa metadatos y definiciones en dos archivos TOML.

### `Meta.toml`

Define los metadatos del tema:

```toml
[meta]
name = "Mi Tema"
author = "TuNombre"
version = "1.0.0"
description = "Un tema oscuro minimalista"
injects_css = false
```

| Campo | Tipo | Requerido | Descripción |
|---|---|---|---|
| `name` | `string` | Sí | Nombre visible del tema. |
| `author` | `string` | No | Autor del tema. Vacío por defecto. |
| `version` | `string` | No | Versión semántica del tema. Vacío por defecto. |
| `description` | `string` | No | Descripción breve del tema. Vacío por defecto. |
| `injects_css` | `bool` | No | Si es `true` y existe `Inject.css`, se inyecta en la interfaz. `false` por defecto. |

### `Definition.toml`

Define la apariencia del tema:

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
family = "MiFuente"
src = "fonts/mi-fuente.woff2"
format = "woff2"
weight = "400"
style = "normal"
```

### Mapeo de secciones a variables CSS

Cada sección de `Definition.toml` se aplana a variables CSS con un prefijo específico:

| Sección | Prefijo CSS | Ejemplo clave | Genera |
|---|---|---|---|
| `[theme.colors]` | `--` | `accent` | `--accent` |
| `[theme.text]` | `--text-` | `primary` | `--text-primary` |
| `[theme.borders]` | `--border-` | `color` | `--border-color` |
| `[theme.shadows]` | `--` | `shadow-sm` | `--shadow-sm` |
| `[theme.backgrounds]` | `--bg-` | `main` | `--bg-main` |
| `[theme.layout]` | `--` | `font-family` | `--font-family` |
| `[theme.backdrop]` | `--backdrop-blur-` | `modal` | `--backdrop-blur-modal` (valor en `px`) |
| `[theme.others]` | `--` | `icon-filter` | `--icon-filter` |

Además, `[theme.background]` genera automáticamente tres variables:

| Campo | Variable generada |
|---|---|
| `reference_path = "bg.webp"` | `--bg-image-path: bg.webp` |
| `image_blur = 10.0` | `--bg-image-blur: 10px` |
| `image_opacity = 0.5` | `--bg-image-opacity: 0.5` |

> **Nota:** `backdrop` agrega `px` automáticamente al valor (ej: `dropdown = 10.0` → `--backdrop-blur-dropdown: 10px`).

---

## Fuentes (v1 y v2)

Ambas versiones soportan fuentes personalizadas. En v1 van dentro del array `fonts` en `theme.json`; en v2 como array `[[theme.fonts]]` en `Definition.toml`.

### Campos

| Campo | Tipo | Requerido | Descripción |
|---|---|---|---|
| `family` | `string` | Sí | Nombre de la familia tipográfica (se usa en `font-family`). |
| `src` | `string` | Sí | Ruta al archivo de fuente (relativa al directorio del tema, o ruta absoluta). |
| `format` | `string?` | No | Formato del archivo (`woff2`, `ttf`, `otf`, etc.). |
| `weight` | `string?` | No | Peso de la fuente (`400`, `700`, `bold`, etc.). |
| `style` | `string?` | No | Estilo (`normal`, `italic`, `oblique`). |

### Ejemplo v1 (JSON)

```json
{
  "name": "Mi Tema",
  "fonts": [
    {
      "family": "MiFuente",
      "src": "fonts/mi-fuente.woff2",
      "format": "woff2",
      "weight": "400",
      "style": "normal"
    }
  ]
}
```

### Ejemplo v2 (TOML)

```toml
[[theme.fonts]]
family = "MiFuente"
src = "fonts/mi-fuente.woff2"
format = "woff2"
weight = "400"
style = "normal"
```

> Las rutas de fuentes relativas se resuelven contra el directorio del tema. Si la ruta empieza con `/` o `file:`, se usa tal cual (ruta absoluta).

---

## Imagen de fondo

### v1: `bg_image`
### v2: `reference_path` (dentro de `[theme.background]`)

El campo referencia un archivo dentro de la carpeta del tema (ej: `bg.jpg`, `bg.webp`). CubicLauncher aplica las siguientes validaciones:

1. **Verifica el tipo real** por magic number usando la librería `infer`. No confía en la extensión del archivo.
2. **No carga imágenes de más de 25 MB** por seguridad y eficiencia. Si excede, se ignora el fondo y se muestra una advertencia.
3. **Solo acepta formatos de imagen válidos** (PNG, JPG, GIF, WEBP, etc.).

Si el launcher no puede cargar la imagen (archivo corrupto, formato no válido, muy pesado), la ignora y no muestra fondo.

### Variables CSS de background (automáticas)

| Variable | Origen | Descripción |
|---|---|---|
| `--bg-image` | Interna (frontend) | URL de la imagen cargada. |
| `--bg-image-loaded` | Interna (frontend) | `0` mientras carga, `1` cuando está lista. |
| `--bg-image-path` | v2: `reference_path` | Ruta al archivo de imagen (solo v2). |
| `--bg-image-blur` | v2: `image_blur` | Desenfoque en píxeles (solo v2). |
| `--bg-image-opacity` | v2: `image_opacity` | Opacidad del fondo (solo v2). |

> En v1, `bg_image_blur` y `bg_image_opacity` se mantienen como campos separados en `ThemeResponse`, no como variables CSS.

---

## Variables CSS disponibles

Estas son las variables que el frontend de CubicLauncher consume. Puedes definirlas en `variables` (v1) o en las secciones correspondientes de `Definition.toml` (v2).

### Colores de fondo

v1: `--bg-*` en `variables` | v2: `[theme.backgrounds]`

| Variable | Descripción |
|---|---|
| `--bg-main` | Fondo principal de la ventana |
| `--bg-sidebar` | Fondo de la barra lateral |
| `--bg-card` | Fondo de tarjetas |
| `--bg-item-active` | Fondo del elemento activo |
| `--bg-overlay` | Fondo de overlays/modal |
| `--bg-input` | Fondo de inputs |

### Colores de texto

v1: `--text-*` en `variables` | v2: `[theme.text]`

| Variable | Descripción |
|---|---|
| `--text-primary` | Texto principal |
| `--text-secondary` | Texto secundario |
| `--text-muted` | Texto desactivado o sutil |

### Acento

v1: `--*` en `variables` | v2: `[theme.colors]`

| Variable | Descripción |
|---|---|
| `--accent` | Color de acento principal |
| `--accent-rgb` | Acento en formato RGB (para usar con `rgba()`) |
| `--accent-hover` | Acento al hacer hover |
| `--accent-text` | Color de texto sobre fondo de acento |

### Bordes

v1: `--border-*` en `variables` | v2: `[theme.borders]`

| Variable | Descripción |
|---|---|
| `--border-color` | Color de bordes |
| `--border-radius` | Radio de borde general |
| `--border-radius-sm` | Radio de borde pequeño |

### Sombras

v1: `--shadow-*` en `variables` | v2: `[theme.shadows]`

| Variable | Descripción |
|---|---|
| `--shadow-sm` | Sombra pequeña |
| `--shadow-md` | Sombra mediana |
| `--glow-accent` | Brillo del color de acento |

### Estados

v1: `--color-*` en `variables` | v2: `[theme.others]`

| Variable | Descripción |
|---|---|
| `--color-success` | Color de éxito |
| `--color-success-rgb` | Éxito en formato RGB |
| `--color-error` | Color de error |
| `--color-error-rgb` | Error en formato RGB |
| `--color-warning` | Color de advertencia |
| `--color-warning-rgb` | Advertencia en formato RGB |
| `--color-status-starting` | Estado "iniciando" |
| `--color-status-started` | Estado "iniciado" |

### Scrollbar

v1: `--scrollbar-*` en `variables` | v2: `[theme.others]`

| Variable | Descripción |
|---|---|
| `--scrollbar-track` | Fondo de la barra de scroll |
| `--scrollbar-thumb` | Color del indicador de scroll |

### Tipografía

v1: `--font-*` en `variables` | v2: `[theme.layout]`

| Variable | Descripción |
|---|---|
| `--font-family` | Familia de fuente |
| `--font-size-base` | Tamaño base |
| `--font-size-sm` | Tamaño pequeño |
| `--font-size-lg` | Tamaño grande |

### Iconos

v1: `--icon-*` en `variables` | v2: `[theme.others]`

| Variable | Descripción |
|---|---|
| `--icon-filter` | Filtro CSS para iconos (ej: `invert(1)`) |
| `--icon-filter-error` | Filtro para iconos de error |

### Backdrop blur (solo v2)

v2: `[theme.backdrop]`

| Variable | Descripción |
|---|---|
| `--backdrop-blur-dropdown` | Desenfoque de dropdowns |
| `--backdrop-blur-modal` | Desenfoque de modales |

---

## Inject.css (solo v2)

Si en `Meta.toml` se define `injects_css = true` y existe un archivo `Inject.css` en el directorio del tema, su contenido se inyecta directamente en la interfaz.

Es útil para overrides CSS complejos que no pueden expresarse solo con variables, como:

- `@keyframes` y animaciones personalizadas
- `@media` queries
- Selectores anidados
- Pseudo-elementos (`::before`, `::after`)

---

## Publicar un theme

Si querés compartir tu theme con la comunidad, mandate un PR al [repositorio oficial de Themes](https://github.com/CubicLauncherDevs/Themes).

### Estructura del repo

```
src/
└── <tu-usuario>/
    └── <nombre-del-theme>/
        ├── showcase.png
        └── Nombre:Autor.zip
```

### Archivos

| Archivo | Descripción |
|---|---|
| `showcase.png` | Captura del launcher con tu theme aplicado para mostrarlo en la galería. |
| `Nombre:Autor.zip` | ZIP con el directorio del theme adentro. El nombre sigue la convención `Nombre:Autor.zip`. |

### Contenido del ZIP

Para v2 (recomendado):
```
Nombre:Autor.zip
└── <nombre-del-theme>/
    ├── Meta.toml
    ├── Definition.toml
    ├── Inject.css (opcional)
    └── bg.EXTENSION (opcional)
```

Para v1 (legacy):
```
Nombre:Autor.zip
└── <nombre-del-theme>/
    ├── theme.json
    └── bg.EXTENSION (opcional)
```

### Formatos de imagen aceptados

**PNG**, **GIF**, **WEBP**, **JPG**.
