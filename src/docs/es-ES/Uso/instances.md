---
category: usage
order: 20
title: Instancias
description: Cómo crear, organizar y administrar instancias aisladas de Minecraft, con su propio contenido, mundos, servidores y configuración.
---

# Instancias

Una **instancia** es un directorio autocontenido con su propia copia de Minecraft, mods, resource packs, shader packs, capturas, mundos y configuración. Cada instancia representa una combinación específica de versión de Minecraft y mod loader.

## Estructura en disco

Por defecto, las instancias están dentro de `.cubic/instances/`. Cada instancia es una carpeta con el nombre que le hayas puesto:

```
.cubic/
├── instances/
│   └── Mi Instancia/
│       ├── instance.cub        ← metadatos de la instancia
│       ├── mods/               ← mods (.jar / .jar.disabled)
│       ├── resourcepacks/      ← resource packs
│       ├── shaderpacks/        ← shader packs
│       ├── saves/              ← mundos
│       ├── screenshots/        ← capturas de pantalla
│       └── ...                 ← archivos de runtime de Minecraft
└── shared/                     ← versiones, librerías, assets y Java compartidos
```

El archivo `instance.cub` guarda los metadatos en JSON. Incluye, entre otros campos, el nombre, la versión, el icono, la memoria opcional, el perfil de `options.txt` asignado y si se aplica automáticamente al lanzar:

```jsonc
{
  "name": "Mi Instancia",
  "version": "1.21-fabric",
  "last_played": 1717000000,
  "playtime_seconds": 3600,
  "uuid": "550e8400-e29b-41d4-a716-446655440000",
  "icon": "/images/instances/fabric.png",
  "cover_image": null,
  "min_memory": null,
  "max_memory": null,
  "pinned": false,
  "options_profile_id": null,
  "auto_apply_options": false
}
```

Las rutas de `instances` y `shared` se pueden cambiar desde **Ajustes → Almacenamiento**. Al mover las instancias, el launcher usa enlaces duros si el disco de destino lo permite; si no, copia los datos. Los archivos compartidos se pueden vaciar y se vuelven a descargar al lanzar una instancia.

## Crear una instancia

1. Hacé clic en **"Crear Instancia"** en la barra lateral.
2. Elegí un **nombre** de hasta 24 caracteres ASCII.
3. Seleccioná una **versión** de las ya descargadas (si no aparece la que querés, descargala primero desde el botón de descargas).
4. Elegí un **icono** y, si querés, una imagen de portada.
5. Presioná **Crear**.

También podés crear una instancia desde un modpack de Modrinth o CurseForge, importar un `.mrpack`/ZIP o migrar una instalación existente desde **Crear instancia → Local**.

> La versión determina el loader automáticamente: si el ID contiene `fabric` se detecta como Fabric, `forge` como Forge, `neoforge` como NeoForge, `quilt` como Quilt y, si no coincide ninguno, se trata de Vanilla.

## La vista de instancia

Al seleccionar una instancia se abre su panel principal con:

- **Hero** — banner con nombre, icono, versión, loader, tiempo jugado y estado actual.
- **Botón "Jugar"** — inicia Minecraft con esta instancia.
- **Barra de estado** — muestra el estado en tiempo real: Off, Starting, Started o Error.
- **Chip del modpack** — si la instancia proviene de un modpack, muestra su versión y acciones para protegerlo, actualizarlo o recuperar el inventario.

### Pestaña Detalles

Muestra la información general de la instancia:

- Badges de versión y loader (Vanilla, Fabric, Forge, NeoForge, Quilt).
- Ruta en disco con botón para abrir la carpeta.
- Accesos directos a las carpetas de mods, screenshots, resource packs y shader packs.
- Consola en vivo con la salida de Minecraft y autoscroll.
- Botón **"Forzar cierre"** si la instancia está corriendo.

### Market de mods

Lista, busca e instala mods desde Modrinth y CurseForge, o administra los ya instalados desde la fuente **Local**. Podés activar o desactivar mods (renombra `.jar` ↔ `.jar.disabled`) y ver qué mods pertenecen al modpack.

Solo está disponible si la instancia usa un loader de mods. Las instancias Vanilla y OptiFine no muestran esta sección.

### Recursos y shaders

Las pestañas **Recursos** y **Shaders** usan el mismo Market, pero limitado a resource packs o shader packs. Podés buscar contenido compatible, instalarlo y administrar los archivos locales.

Los shader packs no están disponibles en instancias Vanilla.

### Mundos y servidores

Cada instancia tiene su propia lista de mundos y servidores. Desde estas secciones podés abrir la carpeta de `saves/`, agregar servidores, consultar su estado y conectarte con Quick Play. Ver [Servidores y mundos](/docs/es-ES/Uso/servidores-mundos).

### Capturas

Galería de capturas de pantalla tomadas dentro de la instancia:

- Vista previa en miniatura.
- Visor con lightbox al hacer clic.
- Eliminar capturas.

## Ciclo de vida

```
Off ──► Starting ──► Started ──► Off
 │         │            │
 │         │            │
 └────► Error ◄─────────┘
```

- **Off** — la instancia no se está ejecutando.
- **Starting** — el launcher está preparando y lanzando Minecraft.
- **Started** — Minecraft está corriendo.
- **Error** — ocurrió un error al iniciar (versión faltante, Java incorrecto, etc.).

Un cierre normal del juego no se reporta como crash. Si el proceso termina de forma inesperada, el launcher conserva el historial de logs y abre la ventana de consola para revisarlo. Ver [Diagnóstico y logs](/docs/es-ES/Uso/diagnostico).

## Administrar instancias

Desde la barra lateral o el menú de la instancia podés:

- **Renombrar** — cambia el nombre y también la carpeta en disco.
- **Eliminar** — borra la instancia y todo su contenido.
- **Abrir carpeta** — accede directamente al directorio de la instancia.
- **Fijar** — coloca la instancia arriba de la lista.
- **Exportar** — genera un `.mrpack` con el contenido seleccionado.
- **Importar** — restaura una instancia desde un ZIP compatible con vista previa antes de confirmar.

### Editor de instancia

El editor permite cambiar la versión y el loader, reparar la instalación, ajustar la memoria y los argumentos JVM propios de la instancia, y asignar un perfil de `options.txt`.

:::warning Cambiar versión o loader
Cambiar la versión o el cargador puede dañar la instalación y hacer que los mods dejen de funcionar. El launcher muestra una advertencia antes de aplicar el cambio.
:::

## Perfiles de options.txt

Los perfiles guardan el contenido de un `options.txt` y se pueden aplicar a cualquier instancia, manualmente o antes de lanzar. Esta función es **experimental**.

- Se administran desde **Ajustes → Minecraft → Perfiles de options.txt**.
- En el editor de cada instancia se elige el perfil y si se aplica automáticamente al lanzar.
- Si la instancia ya tiene un `options.txt`, se guarda un respaldo antes de reemplazarlo.
- Al aplicar un perfil automáticamente, los cambios que hagas dentro del juego se perderán en el siguiente lanzamiento.
- También podés importar un `options.txt` desde archivo o guardar las opciones actuales de una instancia como perfil.

## Modpacks

- Importá un `.mrpack` de Modrinth o un ZIP de CurseForge.
- El launcher resuelve dependencias y descarga las versiones correctas.
- Podés ver un plan previo a la instalación y cancelar si algo no te convence.
- El chip del modpack permite **proteger** el pack para evitar cambios accidentales, **actualizarlo** desde una versión publicada o un archivo local y revisar conflictos antes de aplicar.
- Si el inventario original falta, el chip ofrece **recuperar inventario** para identificar los mods del pack.

La actualización de modpacks es **experimental**.

## Descargar versiones

Usá el botón de descargas en la barra lateral para abrir el **Version Downloader**. Ahí podés descargar:

- Versiones Vanilla (release y snapshot).
- Versiones Alpha/Beta.
- Fabric, Forge, NeoForge, Quilt y OptiFine.

Las versiones descargadas se guardan en la carpeta `shared` y se comparten entre todas las instancias. Desde **Ajustes → Minecraft** podés elegir si se muestran snapshots, versiones Alpha y versiones inestables de los loaders.

## Memoria RAM

La memoria global se configura desde **Ajustes → Minecraft → Rendimiento (RAM)**. El launcher muestra un rango recomendado según la RAM total del equipo.

Cada instancia puede sobrescribir la memoria desde su editor si activás la configuración personalizada. Si no hay overrides, se usan los valores globales.
