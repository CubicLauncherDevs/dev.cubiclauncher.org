---
title: Cómo crear themes
description: Guía completa para crear, empaquetar y publicar temas personalizados en CubicLauncher. Cubre los formatos V1 (legacy) y V2 (recomendado), recursos, validaciones y flujo de publicación oficial.
---

CubicLauncher permite personalizar la interfaz de usuario mediante **themes** (temas). Un theme define colores, fuentes, bordes, sombras, imágenes de fondo, iconos y, en el formato V2, hojas de estilo CSS adicionales.

Esta guía describe cómo crear un theme desde cero, cómo empaquetarlo, cómo probarlo localmente y cómo publicarlo en el repositorio oficial.

:::details Introducción
### ¿Qué es un theme?

Un theme es un conjunto de archivos que CubicLauncher interpreta para modificar la apariencia visual de la aplicación. Internamente, CubicLauncher convierte cualquier formato de theme a una estructura común llamada `ThemeResponse`, que el frontend utiliza para aplicar los estilos.

### Versiones del formato

CubicLauncher soporta dos versiones del formato de themes:

| Versión | Formato | Estado | Recomendación |
|---|---|---|---|
| V1 | JSON (`theme.json`) | Legacy | Se mantiene por compatibilidad, pero no recibe nuevas funciones. |
| V2 | TOML (`Meta.toml` + `Definition.toml`) | Actual | Se recomienda para themes nuevos. Soporta iconos, CSS inyectado y una organización más clara. |
:::

:::details Conceptos generales
### Detección de versiones

CubicLauncher detecta automáticamente la versión del theme según el archivo presente en el directorio del tema:

- Si existe `Meta.toml`, se trata de un **V2**.
- Si existe `theme.json`, se trata de un **V1**.

Al importar un ZIP mediante `import_theme_zip`, CubicLauncher primero busca un `theme.json` dentro del paquete. Si no lo encuentra, intenta importar el archivo como un paquete V2 (`Meta.toml`).

### Resolución de rutas

Las rutas relativas especificadas en imágenes de fondo, fuentes e iconos se resuelven automáticamente respecto al directorio del theme instalado. Se recomienda usar rutas relativas dentro del ZIP para mantener el paquete portable.

### Validaciones de recursos

CubicLauncher aplica las siguientes validaciones de seguridad:

- **Imágenes de fondo**: deben ser archivos de imagen válidos (identificación por magic bytes) y no pueden superar los **25 MB**.
- **Iconos personalizados (V2)**: deben tener extensión `svg`, `png`, `webp`, `jpg` o `jpeg`; las imágenes rasterizadas no pueden superar los **2 MB**.
- **Fuentes**: si la ruta es relativa, se resuelve localmente al directorio del theme.
:::

:::details Crear un theme V1 (legacy)
El formato V1 utiliza un único archivo JSON llamado `theme.json`. Es simple pero limitado: no soporta iconos personalizados ni CSS inyectado.

### Archivos requeridos

```
NombreDelTheme/
└── theme.json        # obligatorio
```

### Recursos opcionales

- `bg.EXT` — imagen de fondo.
- Archivos de fuentes referenciados en `fonts`.

### Schema de `theme.json`

| Campo | Tipo | Requerido | Descripción |
|---|---|---|---|
| `name` | string | Sí | Nombre del theme. |
| `author` | string | No | Autor del theme. |
| `version` | string | No | Versión del theme (se recomienda semver). |
| `type` | string | No | Tipo del theme. Se expone tal cual en el listado. |
| `variables` | objeto | Sí | Mapa de variables CSS `clave: valor`. |
| `bg_image` | string | No | Ruta de la imagen de fondo. |
| `bg_image_blur` | string | No | Desenfoque de la imagen de fondo. Se convierte a número si es posible. |
| `bg_image_opacity` | number | No | Opacidad de la imagen de fondo (0.0 a 1.0). |
| `fonts` | array | No | Lista de fuentes personalizadas. |

### Fuentes en V1

Cada entrada del array `fonts` sigue este schema:

| Campo | Tipo | Requerido | Descripción |
|---|---|---|---|
| `family` | string | Sí | Nombre de la familia tipográfica. |
| `src` | string | Sí | Ruta al archivo de la fuente. |
| `format` | string | No | Formato de la fuente, por ejemplo `woff2`. |
| `weight` | string | No | Peso de la fuente, por ejemplo `400` o `700`. |
| `style` | string | No | Estilo de la fuente, por ejemplo `normal` o `italic`. |

### Ejemplo completo V1

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

### Limitaciones de V1

- No incluye sistema de iconos personalizados.
- No permite inyectar CSS adicional.
- El campo `bg_image_blur` se recibe como `string` y se intenta parsear a número.
- Las variables CSS se definen manualmente tal cual serán aplicadas.
:::

:::details Crear un theme V2 (recomendado)
El formato V2 separa los metadatos de las definiciones visuales en dos archivos TOML:

- `Meta.toml`: información del autor, nombre, versión y si el theme inyecta CSS.
- `Definition.toml`: todas las variables visuales, fuentes, iconos, fondos y valores adicionales.

### Archivos requeridos

```
NombreDelTheme/
├── Meta.toml           # metadatos
└── Definition.toml     # definiciones visuales
```

### Recursos opcionales

- `Inject.css` — hoja de estilos adicional.
- `bg.EXT` — imagen de fondo.
- Archivos de fuentes.
- Iconos SVG/PNG/WEBP/JPG organizados en subcarpetas.

### Schema de `Meta.toml`

| Campo | Tipo | Requerido | Descripción |
|---|---|---|---|
| `name` | string | Sí | Nombre del theme. |
| `author` | string | No | Autor del theme. |
| `version` | string | No | Versión del theme (se recomienda semver). |
| `description` | string | No | Descripción breve del theme. |
| `injects_css` | boolean | No | Indica si el theme incluye un archivo `Inject.css`. |

### Schema de `Definition.toml`

| Campo | Tipo | Descripción |
|---|---|---|
| `[background]` | sección | Configuración de la imagen de fondo. |
| `[background.reference_path]` | string | Ruta de la imagen de fondo. |
| `[background.image_blur]` | number | Desenfoque de la imagen. |
| `[background.image_opacity]` | number | Opacidad de la imagen (0.0 a 1.0). |
| `[colors]` | objeto | Colores del theme. |
| `[text]` | objeto | Colores y estilos de texto. |
| `[borders]` | objeto | Bordes y radios. |
| `[layout]` | objeto | Espaciados, anchos, alturas y demás valores de layout. |
| `[shadows]` | objeto | Sombras y glows. |
| `[backgrounds]` | objeto | Colores de fondo adicionales. |
| `[backdrop]` | objeto | Valores de desenfoque de fondo (backdrop blur), en píxeles. |
| `[fonts]` | array | Fuentes personalizadas. |
| `[icons]` | sección | Iconos personalizados. |
| `[icons.preview]` | string | Icono de vista previa del theme. |
| `[icons.<grupo>]` | objeto | Iconos agrupados por categoría. |
| `[others]` | objeto | Variables adicionales libres. |

### Sistema de prefijos de variables CSS

En V2, CubicLauncher convierte automáticamente las secciones del TOML en variables CSS planas que el frontend puede consumir. La siguiente tabla muestra el prefijo que se aplica a cada sección:

| Sección | Clave de ejemplo | Variable generada |
|---|---|---|
| `colors` | `accent` | `--accent` |
| `text` | `primary` | `--text-primary` |
| `borders` | `radius` | `--border-radius` |
| `layout` | `spacing` | `--spacing` |
| `shadows` | `glow-accent` | `--glow-accent` |
| `backgrounds` | `card` | `--bg-card` |
| `backdrop` | `modal` | `--backdrop-blur-modal` |
| `others` | `icon-filter` | `--icon-filter` |

Notas importantes:

- El campo `[background]` **no se convierte en variables CSS**. Se expone directamente como imagen de fondo del theme.
- Las claves duplicadas generan una advertencia en los logs y se sobrescriben.

### Ejemplo mínimo V2

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

### Ejemplo completo V2

`Meta.toml`:

```toml
[meta]
name = "Midnight Blue"
author = "CubicLabs"
version = "2.0.0"
description = "Un tema oscuro con acentos azules."
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

`Inject.css` (opcional):

```css
/* CSS adicional para personalizar componentes específicos */
.custom-button {
  text-transform: uppercase;
}
```
:::

:::details Recursos adicionales
### Imagen de fondo

La imagen de fondo se configura de forma distinta según la versión:

- **V1**: `bg_image`, `bg_image_blur`, `bg_image_opacity`.
- **V2**: sección `[background]` con `reference_path`, `image_blur`, `image_opacity`.

Formatos soportados: **PNG, WEBP, JPG, JPEG y GIF** (la validación interna utiliza `infer`, pero se recomienda PNG, WEBP o JPG para evitar problemas).

Si la imagen supera los **25 MB** o no es reconocida como imagen válida, CubicLauncher la ignora y, en V1, registra una clave de advertencia.

### Personalización de la sidebar

La sidebar de CubicLauncher se estiliza principalmente mediante variables CSS. Las siguientes variables controlan su apariencia:

| Variable | Descripción |
|---|---|
| `--bg-sidebar` | Color sólido de fondo de la sidebar. |
| `--bg-sidebar-gradient` | Gradiente aplicado sobre el fondo. Si está definido, tiene prioridad sobre `--bg-sidebar`. |
| `--sidebar-width` | Ancho de la sidebar en modo normal. |
| `--bg-item-active` | Fondo del item activo o seleccionado en la sidebar. |
| `--text-primary` | Color del texto principal de la sidebar. |
| `--text-secondary` | Color del texto secundario. |
| `--accent` | Color de acento para botones y estados interactivos. |
| `--border-color` | Color de bordes y separadores. |

#### Comportamiento del gradiente

En el frontend la sidebar utiliza la siguiente regla:

```css
background: var(--bg-sidebar-gradient, var(--bg-sidebar));
```

Esto significa que si se define `--bg-sidebar-gradient`, se aplicará el gradiente. Si no está definido, se usará `--bg-sidebar` como color sólido de respaldo.

#### Modo normal y modo compacto

La sidebar puede alternar entre dos modos desde la interfaz:

- **Modo normal**: utiliza el ancho definido por `--sidebar-width` (valor por defecto: `260px`).
- **Modo compacto**: conserva los mismos colores y gradientes, pero muestra solo iconos.

#### Ejemplo en V1

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

#### Ejemplo en V2

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

> En V2, las claves de la sección `colors` generan variables con el prefijo `--` directamente (`bg-sidebar` → `--bg-sidebar`), mientras que las claves de `layout` también generan variables con el prefijo `--` (`sidebar-width` → `--sidebar-width`).

### Personalización de modales

Los modales de CubicLauncher usan una combinación de variables globales para definir el overlay, el desenfoque y el cuerpo del diálogo.

| Variable | Descripción |
|---|---|
| `--bg-overlay` | Color o fondo del overlay oscuro que cubre la pantalla detrás del modal. |
| `--backdrop-blur-modal` | Cantidad de desenfoque aplicado al overlay del modal. |
| `--bg-sidebar` | Fondo del cuerpo del modal. CubicLauncher reutiliza este color para mantener consistencia visual. |
| `--border` / `--border-color` | Color del borde del modal. |
| `--border-radius` | Radio de borde del modal. |
| `--shadow-lg` | Sombra proyectada del modal. |
| `--text-primary` | Color del título y texto principal del modal. |
| `--text-muted` | Color de botones secundarios y texto auxiliar. |

#### Comportamiento del overlay

En el frontend, el overlay de un modal se define así:

```css
background: var(--bg-overlay, rgba(0, 0, 0, 0.75));
backdrop-filter: blur(var(--backdrop-blur-modal, 4px));
```

Si no se define `--bg-overlay`, se usa un negro semitransparente por defecto (`rgba(0, 0, 0, 0.75)`). Si no se define `--backdrop-blur-modal`, el desenfoque por defecto es de `4px`.

#### Nota sobre el fondo del modal

El cuerpo del modal usa `--bg-sidebar` como color de fondo:

```css
.modal {
  background: var(--bg-sidebar);
}
```

Esto significa que personalizando `--bg-sidebar` también se modifica la apariencia de los modales. Si querés un fondo diferente exclusivamente para modales, podés sobrescribirlo mediante `Inject.css` con un selector como `.modal`.

#### Ejemplo en V1

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

#### Ejemplo en V2

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

### Personalización de scrollbars

CubicLauncher estiliza las barras de desplazamiento mediante variables CSS que luego se aplican con selectores `::-webkit-scrollbar`.

| Variable | Descripción |
|---|---|
| `--scrollbar-track` | Fondo de la pista de la scrollbar. |
| `--scrollbar-thumb` | Color del "pulgar" de la scrollbar. |
| `--scrollbar-thumb-hover` | Color del pulgar al pasar el cursor. |

#### Comportamiento

En el archivo base se usa:

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

Si no se definen estas variables, la scrollbar usa `--border` para el pulgar y `--text-secondary` para el estado hover.

#### Nota sobre scrollbars internas

Algunos componentes específicos (como `.qm-scroll` en ciertos paneles o `.modal`) tienen sus propias reglas de scrollbar que no dependen completamente de estas variables globales. Para un control total sobre todos los scrollbars, podés usar `Inject.css` con selectores `::-webkit-scrollbar`.

#### Ejemplo en V1

```json
"variables": {
  "--scrollbar-track": "#0c0c0c",
  "--scrollbar-thumb": "#333333",
  "--scrollbar-thumb-hover": "#555555"
}
```

#### Ejemplo en V2

```toml
[theme.colors]
scrollbar-track = "#0c0c0c"
scrollbar-thumb = "#333333"
scrollbar-thumb-hover = "#555555"
```

---

### Personalización de tipografía

La tipografía base de la aplicación se controla principalmente con dos variables:

| Variable | Descripción |
|---|---|
| `--font-family` | Fuente principal de toda la interfaz. |
| `--font-size-base` | Tamaño de fuente base. Por defecto es `14px`; el resto de los tamaños se calcula a partir de este valor. |
| `--font-loaded` | Flag interno que indica si la fuente personalizada ya cargó. Normalmente no es necesario modificarlo. |

#### Comportamiento

En el CSS base se define:

```css
html {
  font-size: var(--font-size-base, 14px);
}

body {
  font-family: var(--font-family);
}
```

Esto significa que cambiar `--font-size-base` afecta proporcionalmente a todos los textos que usen unidades `rem`, y cambiar `--font-family` afecta toda la interfaz.

#### Usar una fuente personalizada

Para que `--font-family` funcione correctamente, se deben incluir los archivos de fuente en el theme y declararlos en la sección `fonts`. La familia declarada en `fonts` debe coincidir con el valor de `--font-family`.

Si la fuente tiene múltiples pesos o estilos, declará cada variante por separado.

#### Ejemplo en V1

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

#### Ejemplo en V2

```toml
[meta]
name = "Tipografía personalizada"
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

> En V2, `--font-family` y `--font-size-base` no pertenecen a ninguna categoría semántica específica. Se recomienda definir `--font-family` en `[theme.others]` y `--font-size-base` en `[theme.layout]`.

### Fuentes personalizadas

Tanto V1 como V2 permiten fuentes personalizadas mediante el siguiente schema:

```toml
[[theme.fonts]]
family = "Inter"
src = "fonts/Inter.woff2"
format = "woff2"
weight = "400"
style = "normal"
```

| Campo | Descripción |
|---|---|
| `family` | Nombre de la familia tipográfica. |
| `src` | Ruta al archivo de fuente. Puede ser relativa al theme, absoluta o comenzar con `file:`. |
| `format` | Formato de fuente (`woff2`, `ttf`, etc.). |
| `weight` | Peso tipográfico (`100` a `900`, `bold`, etc.). |
| `style` | Estilo (`normal`, `italic`, etc.). |

### Iconos personalizados (solo V2)

V2 permite reemplazar iconos del frontend mediante la sección `[theme.icons]`.

La estructura es la siguiente:

```toml
[theme.icons]
preview = "icons/preview.png"

[theme.icons.ui]
play = "icons/ui/play.svg"
settings = "icons/ui/settings.svg"
```

| Campo | Descripción |
|---|---|
| `preview` | Ruta al icono que se muestra como vista previa del theme en el listado. |
| `[icons.<grupo>]` | Grupos de iconos. Cada clave dentro del grupo se expone al frontend como `{grupo}:{nombre}`. |

Ejemplo: la clave `play` dentro del grupo `ui` se expone como `ui:play`.

Restricciones:

- Extensiones permitidas: `svg`, `png`, `webp`, `jpg`, `jpeg`.
- Imágenes rasterizadas: máximo **2 MB**.
- Se valida que el archivo sea una imagen válida (PNG/WEBP/JPG) o que exista (SVG).

Iconos inválidos se eliminan silenciosamente con una advertencia en los logs.

### CSS inyectado (solo V2)

V2 permite incluir una hoja de estilos adicional llamada `Inject.css` en la raíz del theme.

Para indicar que el theme incluye CSS personalizado, establecé `injects_css = true` en `Meta.toml`:

```toml
[meta]
name = "Advanced Theme"
injects_css = true
```

El contenido de `Inject.css` se lee y se envía al frontend en el campo `inject_css` del `ThemeResponse`. Desde el frontend se puede aplicar como estilos adicionales.

> **Advertencia**: el CSS inyectado se ejecuta en el contexto de la aplicación. Incluí solo CSS confiable y evitá sobrescribir selectores críticos del sistema a menos que sea intencional.
:::

:::details Empaquetar un theme
Un theme se distribuye como un archivo ZIP. Dentro del ZIP, los archivos deben estar dentro de una carpeta raíz con el nombre del theme.

### Estructura del ZIP para V2

```
Autor_Tema.zip
└── NombreDelTheme/
    ├── Meta.toml
    ├── Definition.toml
    ├── Inject.css            (opcional)
    ├── bg.webp               (opcional)
    ├── fonts/
    │   └── Inter.woff2
    └── icons/
        ├── preview.png
        └── ui/
            ├── play.svg
            └── settings.svg
```

### Estructura del ZIP para V1

```
Autor_Tema.zip
└── NombreDelTheme/
    ├── theme.json
    ├── bg.webp               (opcional)
    └── fonts/
        └── Inter.woff2
```

### Reglas del ZIP

- El ZIP puede contener el archivo objetivo en la raíz (`theme.json` o `Meta.toml`) o dentro de una subcarpeta.
- Si existen múltiples archivos objetivo o múltiples subcarpetas con ellos, la importación se rechaza.
- El nombre del archivo ZIP para publicar en el repositorio oficial debe seguir el patrón `Autor_Tema.zip`.
:::

:::details Probar un theme localmente
CubicLauncher expone varios comandos para importar themes. Durante el desarrollo, podés usar cualquiera de los siguientes métodos:

### Importar un archivo JSON V1 directamente

Usá el comando `import_theme` y seleccioná el archivo `theme.json`.

### Importar un ZIP V1 o V2

Usá el comando `import_theme_zip`. CubicLauncher intentará detectar automáticamente si es V1 (`theme.json`) o V2 (`Meta.toml`).

### Importar un paquete V2 directamente

Usá el comando `import_theme_cbth` para archivos `.cbth` (formato de paquete V2).

### Ubicación de themes instalados

El comando `get_themes_dir_path` devuelve la ruta donde CubicLauncher almacena los themes instalados. Durante el desarrollo, podés revisar esa carpeta para verificar que los archivos se extrajeron correctamente.
:::

:::details Publicar un theme
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
:::

:::details Referencia rápida
### Tabla comparativa V1 vs V2

| Característica | V1 | V2 |
|---|---|---|
| Formato principal | JSON | TOML |
| Archivos del theme | `theme.json` | `Meta.toml`, `Definition.toml` |
| Recursos opcionales | Imagen de fondo, fuentes | Imagen de fondo, fuentes, iconos, CSS |
| Sistema de iconos | No | Sí |
| CSS inyectado | No | Sí (`Inject.css`) |
| Definición de variables | Plano y manual | Por categorías con prefijos automáticos |
| Sección de fondo | Campos en raíz | `[background]` en `Definition.toml` |
| Estado | Legacy | Recomendado |

### Variables CSS comunes del frontend

Estas variables no son obligatorias, pero se utilizan frecuentemente por el frontend y por la función `extract_preview` para generar la vista previa del theme:

| Variable | Uso típico |
|---|---|
| `--bg-main` | Fondo principal. |
| `--bg-card` | Fondo de tarjetas o paneles. |
| `--bg-sidebar` | Fondo de la barra lateral. |
| `--accent` | Color de acento. |
| `--text-primary` | Color de texto principal. |

En V2, estas variables surgen de las secciones `colors`, `backgrounds` y `text` con los prefijos correspondientes.
:::

:::details Notas y buenas prácticas
- **Usá semver** en el campo `version` para mantener un historial claro de cambios.
- **Comprimí las imágenes**: las imágenes de fondo tienen un límite de 25 MB y los iconos de 2 MB. Imágenes livianas mejoran el tiempo de carga.
- **Preferí SVG o WEBP** para iconos, ya que ofrecen mejor calidad y compresión.
- **Validá el TOML/JSON** antes de empaquetar. Errores de sintaxis hacen que CubicLauncher ignore silenciosamente el theme durante el listado.
- **Mantené las rutas relativas** dentro del ZIP para que el paquete sea portable.
- **Documentá las licencias** de las fuentes e imágenes que incluyas en tu `theme.md`.
- **Evitá colisiones de variables** en V2: si dos secciones generan la misma variable CSS, el tema emitirá una advertencia y un valor sobrescribirá al otro.
- **Probá el theme localmente** antes de publicarlo mediante `import_theme_zip` o los comandos correspondientes.
:::
