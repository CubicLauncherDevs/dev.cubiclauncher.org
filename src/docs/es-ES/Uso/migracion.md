---
title: Migración desde otros launchers
description: Importá perfiles del launcher oficial o instancias de MultiMC/Prism/PolyMC/Pinecone a CubicLauncher de forma segura.
---

# Migración desde otros launchers

Podés migrar tus instalaciones existentes sin perder nada. CubicLauncher copia los datos y deja intacto el origen.

## Qué se puede migrar

- Launcher oficial (perfiles que usan `.minecraft`)
- MultiMC y forks: PolyMC, Prism Launcher, PineconeMC

## Cómo migrar

1. Abrí Crear instancia → Local → Migrar.
2. Elegí el origen: Launcher oficial o MultiMC (Forks).
3. Hacé clic en Buscar instalaciones o Elegir carpeta:
   - Oficial: la carpeta `.minecraft` con `launcher_profiles.json`.
   - MultiMC/Prism/PolyMC/Pinecone: carpeta del launcher, `instances` o una instancia puntual.
4. Seleccioná qué instancias/perfiles querés copiar y revisá sus versiones.
5. Confirmá con Migrar. El asistente muestra el progreso y un resumen por instancia.

## Qué se copia y cómo

- Mundos, mods, resource packs, opciones del juego, capturas y lista de servidores.
- Los perfiles oficiales que compartían `.minecraft` pasan a tener su propia carpeta en Cubic, evitando conflictos.
- Las versiones y loaders se instalan desde la cola de descargas del launcher si hace falta.
- Las cuentas siempre se configuran desde CubicLauncher (no se migran tokens).

## Compatibilidad y límites

- Fabric y su `Intermediary` se detectan correctamente; NeoForge también mediante sus argumentos.
- MultiMC: los componentes publicados se reinstalan; cambios locales en bibliotecas o argumentos no se copian.
- Los componentes desconocidos y parches del juego base aparecen como no compatibles.
- No se admiten enlaces simbólicos dentro de los datos copiados.

## Cancelación segura

Podés cancelar durante la copia. Se eliminan los temporales y la instancia incompleta; las que ya terminaron se conservan. Cerrar el asistente o cambiar de pestaña también cancela la migración pendiente.
