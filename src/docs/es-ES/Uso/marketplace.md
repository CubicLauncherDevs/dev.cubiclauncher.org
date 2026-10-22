---
category: content
order: 10
title: Contenido y Marketplace
description: Instalá mods, resource packs, shader packs y modpacks desde Modrinth y CurseForge, y actualizá tus modpacks desde el launcher.
---

# Contenido y Marketplace

El Market integra proveedores para buscar e instalar contenido directamente desde el launcher. Se abre desde las secciones **Market**, **Recursos** y **Shaders** de cada instancia.

## Proveedores

- **Modrinth**: búsqueda de mods, resource packs y shader packs, con filtros por versión y loader.
- **CurseForge**: búsqueda de mods, modpacks, texture packs y shaders.
- **Local**: muestra el contenido ya instalado en tu instancia.

## Tipos de contenido

| Sección | Contenido | Disponibilidad |
| --- | --- | --- |
| Market | Mods | Instancias con Fabric, Forge, NeoForge o Quilt |
| Recursos | Resource packs / texture packs | Todas las instancias |
| Shaders | Shader packs | Todas las instancias que no sean Vanilla |

En versiones muy antiguas de Minecraft, los resource packs se guardan en la carpeta `texturepacks` en lugar de `resourcepacks`. El launcher detecta la carpeta correcta según la versión.

## Compatibilidad automática

El Market filtra por la versión de Minecraft y el loader de tu instancia. Si no hay una versión compatible, te lo indica antes de instalar.

## Instalar desde el catálogo

- En **mods**, el botón de instalar abre una vista previa con el árbol de dependencias y los conflictos detectados. Podés revisar qué se va a descargar antes de confirmar.
- En **resource packs** y **shaders**, la instalación se hace directamente desde la tarjeta.
- En todos los casos podés hacer **doble clic en la tarjeta** para instalar sin abrir el detalle.
- Si ya está instalado, la tarjeta lo indica y permite actualizarlo cuando hay una versión nueva.

## Filtros y orden

El panel de filtros permite buscar por nombre, categoría, loader, fuente y estado local. También podés ordenar por relevancia, nombre, descargas o fecha, y alternar entre Modrinth, CurseForge y Local.

## Mods y dependencias

- Los mods se instalan con sus dependencias requeridas.
- Si un mod ya está instalado, el Market evita duplicarlo.
- Podés activar o desactivar mods sin borrarlos: se renombran a `.jar.disabled`.
- La vista **Local** muestra los mods instalados, su origen y si pertenecen a un modpack.

## Modpacks (MRPack y CurseForge)

- Importá un `.mrpack` de Modrinth o un ZIP de CurseForge.
- El launcher resuelve dependencias y descarga las versiones correctas.
- Podés ver un plan previo a la instalación y cancelar si algo no te convence.
- El chip del modpack en la cabecera de la instancia permite proteger el pack, actualizarlo y recuperar el inventario original.

### Actualizar un modpack

La actualización de modpacks es **experimental**. Desde el chip del modpack:

1. Elegí **Actualizar modpack**.
2. Seleccioná una versión publicada o un archivo local (`.mrpack` / `.zip`).
3. Revisá los archivos añadidos, eliminados y modificados.
4. Resolvé los conflictos conservando tu archivo o usando el del pack.
5. Aplicá la actualización.

Si el pack está protegido, primero tenés que desbloquearlo para modificar sus mods.

## Dónde se guarda

Cada instancia mantiene su carpeta de `mods/`, `resourcepacks/` o `texturepacks/` y `shaderpacks/`. Las versiones del juego y librerías se comparten en la carpeta `shared`, que por defecto es `~/.cubic/shared/` y se puede cambiar desde **Ajustes → Almacenamiento**.

## Solución de problemas

- Si el Market no aparece, verificá que la instancia tenga un loader compatible.
- Si un mod no aparece, probá cambiar la versión, el loader o la fuente en los filtros.
- Si el contenido no se instala, revisá la cola de descargas y la consola de la instancia. Ver [Diagnóstico y logs](/docs/es-ES/Uso/diagnostico).
