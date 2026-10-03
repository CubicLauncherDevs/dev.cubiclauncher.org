# CubicLauncher Docs

Sitio web de documentación oficial para **CubicLauncher**, un launcher de Minecraft moderno, rápido y de código abierto escrito en Rust.

> 🌐 Disponible en español, inglés y francés.

## Stack tecnológico

- **Framework:** [SvelteKit](https://kit.svelte.dev/)
- **Lenguaje:** TypeScript
- **Bundler:** Vite
- **Markdown:** `marked` + `gray-matter`
- **Estilos:** CSS personalizado con variables (modo claro/oscuro)
- **Syntax highlighting:** `highlight.js`

## Requisitos

- [Node.js](https://nodejs.org/) 20+ o [Bun](https://bun.sh/)

## Instalación

```bash
# Clonar el repositorio
git clone https://github.com/CubicLauncherDevs/dev.cubiclauncher.org.git
cd dev.cubiclauncher.org

# Instalar dependencias (con bun)
bun install

# O con npm
npm install
```

## Scripts

```bash
# Servidor de desarrollo
bun run dev

# Build de producción
bun run build

# Verificar tipos
bun run check
```

## Estructura del proyecto

```
src/
├── docs/              # Archivos markdown organizados por idioma
│   ├── es-ES/
│   ├── en-EN/
│   └── fr-FR/
├── lib/
│   ├── server/
│   │   └── docs.ts    # Lógica para leer y parsear documentos
│   └── components/    # Componentes reutilizables
├── routes/
│   ├── docs/[...path]/ # Ruta dinámica de documentación
│   └── +page.server.ts # Redirección a /docs
├── styles/            # Hojas de estilo CSS
└── app.css            # Variables globales y tema
```

## Escribir documentación

1. Coloca tus archivos `.md` dentro de `src/docs/<idioma>/<carpeta>/`. La ruta del archivo define su URL; conserva las rutas de los artículos publicados.
2. Usa frontmatter al inicio del archivo:

```md
---
title: Título del artículo
description: Breve descripción para SEO y búsquedas.
category: getting-started
order: 10
---

# Título del artículo
```

`category` y `order` son obligatorios. La categoría visible depende de estos metadatos, no de la carpeta. Usa el mismo identificador de categoría y orden para las traducciones de un artículo. Los valores menores de `order` aparecen primero; utiliza intervalos de 10 para poder insertar artículos. El índice «Todas las páginas» conserva el orden alfabético.

Las categorías y sus traducciones están definidas en `src/lib/server/doc-categories.ts`, en este orden:

| Identificador | Categoría |
| --- | --- |
| `getting-started` | Primeros pasos |
| `usage` | Uso y configuración |
| `content` | Mods y contenido |
| `customization` | Personalización |
| `troubleshooting` | Ayuda y soporte |
| `development` | Desarrollo y contribución |
| `legal` | Información legal |

Las categorías vacías se ocultan en el idioma correspondiente. Las rutas de categorías antiguas se resuelven a un tema actual o muestran una página de transición cuando sus artículos se repartieron entre varios temas.

3. Usa los callouts soportados:

```md
:::tip
Consejo útil para el usuario.
:::

:::info
Información importante.
:::

:::details Sección colapsable
Agrupá contenido extenso en categorías que el lector pueda abrir o cerrar. Soporta markdown completo dentro del bloque.
:::

4. Inserta videos fácilmente:

```md
:::youtube dQw4w9WgXcQ

:::video /videos/ejemplo.mp4

:::video https://example.com/video.webm
```

5. Las imágenes se renderizan con un visor integrado. Al hacer clic se abre un lightbox con navegación por teclado:

```md
![Descripción](https://example.com/captura.png)
```

:::warning
Advertencia a considerar.
:::

:::danger
Algo crítico que no debe pasarse por alto.
:::
```

## Contribuir

1. Haz un fork del repositorio.
2. Crea una rama para tu cambio: `git checkout -b feat/nueva-guia`.
3. Realiza tus cambios y verifica que el build pase: `bun run check && bun run build`.
4. Abre un Pull Request describiendo claramente tus cambios.

## Licencia

Este sitio se distribuye bajo la licencia [GPL-3.0](https://github.com/CubicLauncherDevs/CubicLauncher/blob/main/LICENSE).
