---
title: Contenido y Marketplace
description: Instalá mods, resource packs, shader packs y modpacks desde Modrinth y CurseForge con resolución de dependencias.
---

# Contenido y Marketplace

El Market integra proveedores para buscar e instalar contenido directamente desde el launcher.

## Proveedores

- Modrinth: búsqueda de mods, resource packs y shaderpacks, con filtros por versión y loader.
- CurseForge: búsqueda de mods y modpacks, con listado y detalles.
- Local: muestra el contenido ya instalado en tu instancia.

## Compatibilidad automática

El Market filtra por la versión de Minecraft y el loader de tu instancia. Si no hay una versión compatible, te lo indica antes de instalar.

## Modpacks (MRPack y CurseForge)

- Importá un `.mrpack` de Modrinth o un ZIP de CurseForge.
- El launcher resuelve dependencias y descarga las versiones correctas.
- Podés ver un plan previo a la instalación y cancelar si algo no te convence.

## Activar y desactivar contenido

- Mods: se renombran a `.jar.disabled` para desactivarlos sin borrarlos.
- Resource packs y shaderpacks: administralos desde sus secciones o arrastrando archivos a la instancia.

## Dónde se guarda

Cada instancia mantiene su carpeta de `mods/`, `resourcepacks/` y `shaderpacks/`. Las versiones del juego y librerías se comparten en `~/.cubic/shared/versions/`.
