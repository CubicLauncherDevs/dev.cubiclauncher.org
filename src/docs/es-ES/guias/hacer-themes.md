---
title: Cómo crear themes | CubicLauncher
---

CubicLauncher te permite personalizar completamente la interfaz mediante **themes** (temas). Un tema define los colores, las fuentes, los bordes, las sombras y, opcionalmente, una imagen de fondo del launcher.

Existen **dos versiones** del sistema de themes:

| Versión | Formato | Estado |
|---|---|---|
| **v2** | TOML (`Meta.toml` + `Definition.toml`) | ✅ **Recomendada** para temas nuevos |
| **v1** | JSON (`theme.json`) | ⚠️ Legacy, solo por compatibilidad |

**Contenido de esta guía:**

1. [Inicio rápido](#inicio-rápido) — crea tu primer tema en 5 minutos
2. [Dónde viven los temas y cómo se detectan](#dónde-viven-los-temas)
3. [Formato v2 (recomendado)](#formato-v2-toml--recomendado)
4. [Formato v1 (legacy)](#formato-v1-json--legacy)
5. [Referencia común](#referencia-común-v1-y-v2) — fuentes, imagen de fondo y variables CSS
6. [Publicar tu tema](#publicar-un-theme)

---

## Inicio rápido

Crea un tema v2 funcional en tres pasos:

**1.** Crea la carpeta del tema dentro de `.cubic/themes/`:

```
.cubic/themes/mi-tema/
```

**2.** Dentro, crea `Meta.toml` con los metadatos:

```toml
name = "Mi Tema"
author = "TuNombre"
version = "1.0.0"
description = "Un tema oscuro minimalista"
```

**3.** Crea `Definition.toml` con la apariencia mínima:

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

Reinicia (o recarga) el launcher y selecciona **Mi Tema** en el selector de temas. ¡Listo! El resto de esta guía cubre todas las opciones disponibles.

---

## Dónde viven los temas

Los temas de usuario van dentro de `.cubic/themes/`. Cada tema es **una carpeta** cuyo contenido depende de la versión:

**v2 (recomendada):**

```
.cubic/
└── themes/
    └── <id>/
        ├── Meta.toml          # metadatos (nombre, autor, versión…)
        ├── Definition.toml    # apariencia (colores, fuentes, fondo…)
        ├── Inject.css         # (opcional) CSS avanzado
        └── bg.jpg             # (opcional) imagen de fondo
```

**v1 (legacy):**

```
.cubic/
└── themes/
    └── <id>/
        ├── theme.json         # todo en un solo archivo
        └── bg.jpg             # (opcional) imagen de fondo
```

> ⚠️ Por seguridad, el launcher **no carga nada** que esté fuera de `.cubic`.

### Cómo se detecta la versión

El launcher decide automáticamente qué versión usar según los archivos que encuentre, en este orden:

1. ¿Existe `Meta.toml`? → Se trata como **v2** (carga `Meta.toml` + `Definition.toml`).
2. Si no, ¿existe `theme.json`? → Se trata como **v1**.
3. Si no existe ninguno → el tema **se ignora**.

---

## Formato v2 (TOML) — Recomendado

La v2 separa el tema en dos archivos: `Meta.toml` (quién y qué es el tema) y `Definition.toml` (cómo se ve).

### `Meta.toml` — Metadatos

```toml
name = "Mi Tema"
author = "TuNombre"
version = "1.0.0"
description = "Un tema oscuro minimalista"
injects_css = false
```

| Campo | Tipo | ¿Requerido? | Descripción |
|---|---|---|---|
| `name` | `string` | **Sí** | Nombre visible del tema en el selector. |
| `author` | `string` | No | Autor del tema. Vacío por defecto. |
| `version` | `string` | No | Versión semántica del tema. Vacío por defecto. |
| `description` | `string` | No | Descripción breve. Vacía por defecto. |
| `injects_css` | `bool` | No | Solo informativo. Si existe `Inject.css`, **se inyecta siempre**, sin importar este valor. `false` por defecto. |

### `Definition.toml` — Apariencia

Cada **sección** del archivo agrupa un tipo de propiedad visual. Ejemplo completo:

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
family = "MiFuente"
src = "fonts/mi-fuente.woff2"
format = "woff2"
weight = "400"
style = "normal"
```

> **Importante:** las secciones van **sin** el prefijo `theme.` (es decir, `[background]`, `[colors]`, `[[fonts]]`). El prefijo `theme.` solo aplica si combinás ambos archivos en un único TOML como `V2Theme`.

### Cómo se convierten las secciones en variables CSS

Cada clave de `Definition.toml` se "aplana" a una variable CSS con un prefijo según su sección:

| Sección | Prefijo CSS | Ejemplo de clave | Variable generada |
|---|---|---|---|
| `[colors]` | `--` | `accent` | `--accent` |
| `[text]` | `--text-` | `primary` | `--text-primary` |
| `[borders]` | `--border-` | `color` | `--border-color` |
| `[shadows]` | `--` | `shadow-sm` | `--shadow-sm` |
| `[backgrounds]` | `--bg-` | `main` | `--bg-main` |
| `[layout]` | `--` | `font-family` | `--font-family` |
| `[others]` | `--` | `icon-filter` | `--icon-filter` |
| `[backdrop]` | `--backdrop-blur-` | `modal` | `--backdrop-blur-modal` |

**Casos especiales:**

- `[backdrop]` agrega `px` automáticamente al valor: `dropdown = 10.0` → `--backdrop-blur-dropdown: 10px`.
- `[background]` (en singular, la imagen de fondo) genera automáticamente estas tres variables:

| Campo | Variable generada |
|---|---|
| `reference_path = "bg.webp"` | `--bg-image-path: bg.webp` |
| `image_blur = 10.0` | `--bg-image-blur: 10px` |
| `image_opacity = 0.5` | `--bg-image-opacity: 0.5` |

### `Inject.css` — CSS avanzado (opcional)

Si el directorio del tema contiene un archivo `Inject.css`, su contenido se inyecta directamente en la interfaz (**siempre**, independientemente del valor de `injects_css` en `Meta.toml`).

Es útil para todo lo que no se puede expresar solo con variables CSS:

- `@keyframes` y animaciones personalizadas
- `@media` queries
- Selectores anidados
- Pseudo-elementos (`::before`, `::after`)

---

## Formato v1 (JSON) — Legacy

> Usá v1 solo para mantener temas existentes. Para temas nuevos, usá [v2](#formato-v2-toml--recomendado).

Todo el tema se define en un único archivo `theme.json`:

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

| Campo | Tipo | ¿Requerido? | Descripción |
|---|---|---|---|
| `name` | `string` | **Sí** | Nombre visible del tema en el selector. |
| `variables` | `object` | **Sí** | Mapa de variables CSS. Claves y valores string. Se escriben tal cual, con `--` incluido (ver [Variables CSS](#variables-css-disponibles)). |
| `author` | `string` | No | Autor del tema. Vacío por defecto. |
| `version` | `string` | No | Versión del tema. Vacía por defecto. |
| `type` | `string` | No | `"user"` para temas de usuario. Los `"builtin"` vienen incluidos con el launcher. |
| `bg_image` | `string?` | No | Nombre del archivo de imagen de fondo, relativo al directorio del tema. |
| `bg_image_blur` | `string?` | No | Desenfoque del fondo como string (ej: `"10px"`). Se parsea a número; si no es válido, se usa `0.0`. |
| `bg_image_opacity` | `number?` | No | Opacidad del fondo, de 0 a 1 (ej: `0.6`). |
| `fonts` | `array` | No | Lista de fuentes personalizadas (ver [Fuentes](#fuentes)). Vacía por defecto. |

> En v1, `bg_image_blur` y `bg_image_opacity` se mantienen como campos separados en `ThemeResponse`, **no** se convierten en variables CSS (a diferencia de v2).

---

## Referencia común (v1 y v2)

### Fuentes

Ambas versiones soportan fuentes personalizadas con los mismos campos. Cambia solo dónde se declaran:

- **v2:** bloques `[[fonts]]` en `Definition.toml`
- **v1:** array `fonts` en `theme.json`

| Campo | Tipo | ¿Requerido? | Descripción |
|---|---|---|---|
| `family` | `string` | **Sí** | Nombre de la familia tipográfica (el que usás luego en `font-family`). |
| `src` | `string` | **Sí** | Ruta al archivo de fuente, relativa al directorio del tema (o absoluta). |
| `format` | `string?` | No | Formato del archivo: `woff2`, `ttf`, `otf`, etc. |
| `weight` | `string?` | No | Peso: `400`, `700`, `bold`, etc. |
| `style` | `string?` | No | Estilo: `normal`, `italic`, `oblique`. |

**Ejemplo v2 (TOML):**

```toml
[[fonts]]
family = "MiFuente"
src = "fonts/mi-fuente.woff2"
format = "woff2"
weight = "400"
style = "normal"
```

**Ejemplo v1 (JSON):**

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

**Resolución de rutas:**

- Las rutas **relativas** se resuelven contra el directorio del tema.
- Las rutas que empiezan con `/` (o son absolutas) se usan tal cual.
- Para detectar rutas absolutas: v1 reconoce el prefijo `file:`; v2 reconoce `:` (por ejemplo `C:\` en Windows).

> ⚖️ **Licencia:** al distribuir un tema con fuentes personalizadas, incluí siempre la licencia de la fuente y usá únicamente fuentes que tengas derecho a redistribuir.

### Imagen de fondo

El campo que referencia la imagen depende de la versión:

- **v2:** `reference_path` dentro de `[background]`
- **v1:** `bg_image` en `theme.json`

En ambos casos apunta a un archivo dentro de la carpeta del tema (ej: `bg.jpg`, `bg.webp`).

**Validaciones que aplica el launcher:**

1. **Verifica el tipo real del archivo** por *magic number* (con la librería `infer`); no confía en la extensión.
2. **Rechaza imágenes de más de 25 MB** por seguridad y eficiencia. Si se excede, ignora el fondo y muestra una advertencia.
3. **Solo acepta formatos de imagen válidos:** PNG, JPG, GIF, WEBP, etc.

Si la imagen no se puede cargar (archivo corrupto, formato inválido, muy pesada), el launcher simplemente la ignora y no muestra fondo.

**Variables CSS relacionadas con el fondo:**

| Variable | Origen | Descripción |
|---|---|---|
| `--bg-image` | Interna (frontend) | URL de la imagen ya cargada. |
| `--bg-image-loaded` | Interna (frontend) | `0` mientras carga, `1` cuando está lista. |
| `--bg-image-path` | v2: `reference_path` | Ruta al archivo de imagen (solo v2). |
| `--bg-image-blur` | v2: `image_blur` | Desenfoque en píxeles (solo v2). |
| `--bg-image-opacity` | v2: `image_opacity` | Opacidad del fondo (solo v2). |

### Variables CSS disponibles

Esta es la lista completa de variables que consume el frontend. En **v1** se escriben tal cual (con `--`) dentro de `variables`; en **v2** se escriben **sin** prefijo, en la sección indicada.

#### Colores de fondo — v2: `[backgrounds]`

| Variable | Descripción |
|---|---|
| `--bg-main` | Fondo principal de la ventana |
| `--bg-sidebar` | Fondo de la barra lateral |
| `--bg-card` | Fondo de tarjetas |
| `--bg-item-active` | Fondo del elemento activo |
| `--bg-overlay` | Fondo de overlays/modales |
| `--bg-input` | Fondo de inputs |

#### Colores de texto — v2: `[text]`

| Variable | Descripción |
|---|---|
| `--text-primary` | Texto principal |
| `--text-secondary` | Texto secundario |
| `--text-muted` | Texto desactivado o sutil |

#### Acento — v2: `[colors]`

| Variable | Descripción |
|---|---|
| `--accent` | Color de acento principal |
| `--accent-rgb` | Acento en formato RGB (para usar con `rgba()`) |
| `--accent-hover` | Acento al hacer hover |
| `--accent-text` | Color de texto sobre fondo de acento |

#### Bordes — v2: `[borders]`

| Variable | Descripción |
|---|---|
| `--border-color` | Color de bordes |
| `--border-radius` | Radio de borde general |
| `--border-radius-sm` | Radio de borde pequeño |

#### Sombras — v2: `[shadows]`

| Variable | Descripción |
|---|---|
| `--shadow-sm` | Sombra pequeña |
| `--shadow-md` | Sombra mediana |
| `--glow-accent` | Brillo del color de acento |

#### Estados — v2: `[others]`

| Variable | Descripción |
|---|---|
| `--color-success` | Color de éxito |
| `--color-success-rgb` | Éxito en formato RGB |
| `--color-error` | Color de error |
| `--color-error-rgb` | Error en formato RGB |
| `--color-warning` | Color de advertencia |
| `--color-warning-rgb` | Advertencia en formato RGB |
| `--color-status-starting` | Estado «iniciando» |
| `--color-status-started` | Estado «iniciado» |

#### Scrollbar — v2: `[others]`

| Variable | Descripción |
|---|---|
| `--scrollbar-track` | Fondo de la barra de scroll |
| `--scrollbar-thumb` | Color del indicador de scroll |

#### Tipografía — v2: `[layout]`

| Variable | Descripción |
|---|---|
| `--font-family` | Familia de fuente |
| `--font-size-base` | Tamaño de texto base |
| `--font-size-sm` | Tamaño pequeño |
| `--font-size-lg` | Tamaño grande |

#### Iconos — v2: `[others]`

| Variable | Descripción |
|---|---|
| `--icon-filter` | Filtro CSS para iconos (ej: `invert(1)`) |
| `--icon-filter-error` | Filtro para iconos de error |

#### Backdrop blur — solo v2: `[backdrop]`

| Variable | Descripción |
|---|---|
| `--backdrop-blur-dropdown` | Desenfoque de dropdowns |
| `--backdrop-blur-modal` | Desenfoque de modales |

---

## Publicar un theme

¿Querés compartir tu tema con la comunidad? Enviá un Pull Request al [repositorio oficial de Themes](https://github.com/CubicLauncherDevs/Themes). Los temas publicados aparecen en la web oficial: [cubiclauncher.org/themes](https://www.cubiclauncher.org/themes).

### Estructura del repositorio

Cada tema vive bajo `src/<Autor>/<Theme>/`, con `theme.md` en la raíz del tema y una subcarpeta por versión (`V1`, `V2`, …):

```
src/
  <Autor>/
    <Theme>/
      theme.md               # descripción del tema (obligatorio)
      V1/
        Autor_Theme.zip      # paquete del tema (obligatorio)
        Showcase.png         # vista previa (opcional)
        changelog.md         # cambios de la versión (opcional)
      V2/                    # nuevas versiones (opcional)
        ...
```

### Pasos para agregar tu tema

1. Creá `src/TuAutor/TuTema/theme.md` con la descripción del tema.
2. Creá la carpeta de versión `src/TuAutor/TuTema/V1/`.
3. Agregá dentro `TuAutor_TuTema.zip` (el nombre del ZIP debe seguir el patrón `Autor_Tema.zip`).
4. *(Opcional)* Agregá `Showcase.png` como vista previa (el nombre se busca *case-insensitive*, puede ir en minúsculas).
5. *(Opcional)* Agregá `changelog.md` con el registro de cambios de la versión.
6. Para publicar nuevas versiones del tema, creá `V2/`, `V3/`, etc.
7. Abrí un Pull Request al repositorio.

### Archivos del tema

**En la raíz del tema:**

| Archivo | ¿Obligatorio? | Descripción |
|---|---|---|
| `theme.md` | **Sí** | Descripción/README del tema en Markdown. |

**Dentro de cada carpeta de versión (`V1/`, `V2/`, …):**

| Archivo | ¿Obligatorio? | Descripción |
|---|---|---|
| `Autor_Tema.zip` | **Sí** | Paquete del tema. |
| `Showcase.png` | No | Vista previa de esa versión (nombre *case-insensitive*). |
| `changelog.md` | No | Cambios de esa versión. |

**Ejemplo de `theme.md`:**

```markdown
# Mi Tema

Descripción en markdown del tema, su inspiración, etc.
```

**Ejemplo de `changelog.md`:**

```markdown
# V1

- Primer lanzamiento
- Tema oscuro con acentos verdes
```

### El archivo ZIP

**Nombre:** `Autor_Tema.zip` — con guion bajo, sin espacios ni dos puntos.

**Contenido para v2 (recomendado):**

```
Autor_Tema.zip
└── <nombre-del-theme>/
    ├── Meta.toml
    ├── Definition.toml
    ├── Inject.css        (opcional)
    └── bg.EXTENSION      (opcional)
```

**Contenido para v1 (legacy):**

```
Autor_Tema.zip
└── <nombre-del-theme>/
    ├── theme.json
    └── bg.EXTENSION      (opcional)
```

**Formatos de imagen aceptados:** PNG, GIF, WEBP y JPG.

### ¿Qué pasa después del merge?

El repositorio incluye un **GitHub Action** (`.github/workflows/generate-themes.yml`) que se ejecuta en cada push:

1. Escanea la carpeta `src/`.
2. Lee el `theme.md` y `changelog.md` de cada tema.
3. Obtiene las fechas de git de cada versión.
4. Construye las URLs de descarga hacia `raw.githubusercontent.com`.
5. Genera el archivo `themes.json` en la raíz del repositorio.

Ese `themes.json` se sirve estáticamente y es el que consume la web de CubicLauncher para mostrar y descargar los temas. No necesitás hacer nada extra: una vez aceptado tu PR, el tema aparece automáticamente en [cubiclauncher.org/themes](https://www.cubiclauncher.org/themes).

### Licencia del repositorio

El repositorio de Themes está bajo [CC0 1.0 Universal](https://github.com/CubicLauncherDevs/Themes/blob/master/LICENSE) (dominio público). Al enviar tu tema, aceptás publicarlo bajo esa licencia. Recordá que las **fuentes** incluidas en tu tema mantienen su propia licencia: incluíla y usá solo fuentes que tengas derecho a redistribuir.