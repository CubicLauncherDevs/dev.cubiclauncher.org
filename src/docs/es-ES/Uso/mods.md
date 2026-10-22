---
category: content
order: 20
title: Mods
description: Gestioná mods de Minecraft desde el Market, con soporte para Modrinth, CurseForge y los mods ya instalados.
---

# Mods

Los **mods** son modificaciones que alteran o agregan contenido a Minecraft. CubicLauncher los administra desde el **Market**, una vista integrada que también permite buscar resource packs y shader packs.

## Requisitos

Para usar la sección de mods necesitás una **instancia** con un loader compatible:

- Fabric
- Forge
- NeoForge
- Quilt

Si tu instancia es Vanilla u OptiFine, la sección de mods no está disponible. Los resource packs y shaders se pueden administrar igualmente desde sus propias secciones.

## Acceder al Market

1. Seleccioná una instancia con un loader compatible.
2. En la vista de la instancia, elegí **Market**.
3. Elegí el proveedor: **Modrinth**, **CurseForge** o **Local**.

También podés abrir el Market desde las secciones **Recursos** y **Shaders** para buscar únicamente esos tipos de contenido.

<div class="docs-img-wrap">
  <img src="https://i.ibb.co/0yzDqtYW/imagen.png" alt="UI del launcher" />
</div>

## Proveedores

:::info Proveedores online
Permiten buscar y descargar contenido directamente desde internet.
:::

- **Modrinth** — busca mods por nombre, categoría, versión y loader.
- **CurseForge** — accede al catálogo de CurseForge desde el launcher.
- **Local** — muestra los mods ya instalados, con su origen y estado.

## Instalar y actualizar

- En mods, el botón de instalar muestra las dependencias y conflictos antes de confirmar.
- Podés hacer **doble clic en la tarjeta** para instalar más rápido.
- Si el mod ya está instalado, la tarjeta lo indica y ofrece actualizarlo cuando hay una versión nueva.
- Los mods de un modpack pueden aparecer como protegidos; desbloqueá el pack antes de modificarlos.

## Activar y desactivar

- Un mod activo usa la extensión `.jar`.
- Al desactivarlo, se renombra a `.jar.disabled` sin borrar el archivo.
- Podés volver a activarlo desde la misma lista.

## Compatibilidad

Por defecto el Market muestra solo versiones compatibles con la versión de Minecraft y el loader de tu instancia. Si un mod no es compatible, aparece marcado antes de intentar instalarlo.

## Más información

Consultá [Contenido y Marketplace](/docs/es-ES/Uso/marketplace) para ver proveedores, filtros, resource packs, shaders y actualización de modpacks.
