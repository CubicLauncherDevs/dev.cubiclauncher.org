---
category: usage
order: 50
title: Migración desde otros launchers
description: Importá perfiles del launcher oficial, instancias de MultiMC/Prism/PolyMC/Pinecone/Freesm o de X Minecraft Launcher (XMCL) sin perder tus datos.
---

# Migración desde otros launchers

Podés migrar tus instalaciones existentes sin perder nada. CubicLauncher copia los datos y deja intacto el origen.

## Qué se puede migrar

- **Launcher oficial** — perfiles que usan `.minecraft`.
- **MultiMC y forks** — MultiMC, PolyMC, Prism Launcher, PineconeMC y Freesm Launcher.
- **X Minecraft Launcher (XMCL)** — instancias registradas en su carpeta de datos.

XMCL puede tener instancias Bedrock o componentes que Cubic no puede reinstalar, como OptiFine o LabyMod. Esos casos aparecen como no compatibles y no se copian.

## Cómo migrar

1. Abrí **Crear instancia → Local → Migrar**.
2. Elegí el origen: Launcher oficial, MultiMC (forks) o X Minecraft Launcher.
3. Hacé clic en **Buscar instalaciones** o **Elegir carpeta**:
   - Oficial: la carpeta `.minecraft` con `launcher_profiles.json`.
   - MultiMC/Prism/PolyMC/Pinecone/Freesm: la carpeta del launcher, su carpeta `instances` o una instancia puntual.
   - XMCL: la carpeta de datos que contiene `instances.json` o la carpeta `instances`.
4. Seleccioná qué instancias o perfiles querés copiar y revisá sus versiones.
5. Ajustá el nombre que tendrá cada instancia en Cubic si hace falta.
6. Confirmá con **Migrar**. El asistente muestra el progreso y un resumen por instancia.

## Qué se copia y cómo

- Mundos, mods, resource packs, shader packs, opciones del juego, capturas, servidores y varios archivos de configuración de mods.
- Los perfiles oficiales que compartían `.minecraft` pasan a tener su propia carpeta en Cubic, evitando conflictos.
- Las versiones y loaders se instalan desde la cola de descargas del launcher si hace falta.
- Las cuentas siempre se configuran desde CubicLauncher; no se migran tokens.

La lista de carpetas y archivos copiados incluye, entre otros: `mods`, `resourcepacks`, `shaderpacks`, `saves`, `screenshots`, `config`, `scripts`, `defaultconfigs`, `kubejs`, `options.txt`, `optionsof.txt`, `servers.dat`, `texturepacks`, `optionsshaders.txt`, mapas de JourneyMap y datos de Xaero.

## Compatibilidad y límites

- Fabric y su `Intermediary` se detectan correctamente; NeoForge también mediante sus argumentos.
- MultiMC: los componentes publicados se reinstalan; los cambios locales en bibliotecas o argumentos no se copian.
- XMCL: se detectan Fabric, Forge, NeoForge y Quilt. Se migran la memoria y el icono cuando están disponibles.
- Los componentes desconocidos y los parches del juego base aparecen como no compatibles.
- No se admiten enlaces simbólicos dentro de los datos copiados.
- Los archivos de cuenta, tokens y credenciales no se migran.

## Cancelación segura

Podés cancelar durante la copia. Se eliminan los temporales y la instancia incompleta; las que ya terminaron se conservan. Cerrar el asistente o cambiar de pestaña también cancela la migración pendiente.

## Después de migrar

- Revisá la versión y el loader de cada instancia.
- Esperá a que terminen las descargas pendientes de versiones y loaders.
- Iniciá sesión con tus cuentas desde CubicLauncher.
- Si una instancia no arranca, revisá su consola y consultá [Diagnóstico y logs](/docs/es-ES/Uso/diagnostico).
