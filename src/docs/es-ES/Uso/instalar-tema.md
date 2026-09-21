---
title: Cómo poner un theme
description: Instalar un theme en CubicLauncher es muy sencillo. Solo tenés que seguir estos 3 pasos.
---

# Cómo poner un theme

Instalar un theme en CubicLauncher es muy sencillo. Solo tenés que seguir estos 3 pasos.

## Paso 1: Descargar el theme

Buscá un theme en la sección https://www.cubiclauncher.org/themes de la página o en el repositorio oficial de https://github.com/CubicLauncherDevs/Themes. Descargalo como archivo ZIP o CBTH.

<div class="docs-img-wrap">
  <img src="https://i.imgur.com/YJ9ujlR.png" alt="Botón de descargar" />
</div>

## Paso 2: Arrastrar el theme al launcher

Arrastrá el archivo ZIP o CBTH descargado directamente a la ventana de CubicLauncher. El launcher lo instalará automáticamente.

<div class="docs-img-wrap">
  <img src="https://i.imgur.com/YJ9ujlR.png" alt="Step2" />
</div>

## Paso 3: Seleccionar el theme

Abrí CubicLauncher, andá al selector de temas y elegí el que acabas de instalar.

<div class="docs-img-wrap">
  <img src="https://i.imgur.com/NoBw8vS.png" alt="Configurar theme en el launcher" />
</div>

¡Y listo! Ya tenés tu theme instalado.

## Detalles y formatos soportados

### Formato v1 (theme.json)

- Estructura simple con variables CSS y metadatos en `theme.json`.
- Podés importar un ZIP que contenga `theme.json` en la raíz o dentro de una carpeta.

### Formato v2 (CBTH)

- Paquete `.cbth` o ZIP con `Meta.toml` y `Definition.toml`.
- Soporta grupos de íconos, fuentes y fondo con mayor flexibilidad.

### Validaciones de imágenes e íconos

- El fondo no debe superar ~25 MB y debe ser una imagen válida (PNG/JPG/WEBP, etc.).
- Íconos soportados: SVG, PNG, WEBP y JPG/JPEG. Para raster, tamaño máximo ~2 MB.
- Rutas relativas dentro del ZIP se resuelven respecto del tema; también se aceptan rutas absolutas y `file:`.

### Dónde quedan instalados

Los temas se instalan en `~/.cubic/themes/<id_del_tema>/`. Podés borrar esa carpeta para quitar el tema o usar la opción de eliminar desde Cubic.

### Exportar un tema

Desde el selector de temas podés exportar un tema a `.zip` para compartirlo.
