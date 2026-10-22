---
category: development
order: 40
title: Versionado y lanzamientos
description: Esquema de versiones secuencial, canales de actualización y proceso de publicación en dos etapas.
---

# Versionado y lanzamientos

CubicLauncher usa un esquema **secuencial simple**:

- **Major** — número entero que sube con cada release (27, 28, 29…).
- **Patch** — revisiones o hotfixes sobre un mismo major.

Internamente se usa semver (`MAJOR.MINOR.PATCH`) porque lo exige el updater de Tauri. El `MINOR` siempre es `0`.

| Visible para el usuario | Semver interno |
| --- | --- |
| `27` | `27.0.0` |
| `27 rev 1` | `27.0.1` |
| `27 rev 2` | `27.0.2` |
| `28` | `28.0.0` |

Si `PATCH` es `0`, se muestra solo el major. Si es mayor que `0`, se muestra como `major rev patch`.

## Canales de actualización

- **Estable** — recomendado para la mayoría de usuarios. Solo recibe releases publicados.
- **Pre-lanzamiento** — alpha, beta y rc; puede incluir cambios inestables.

El canal se elige en **Ajustes → Launcher → Actualizaciones**.

## Versionado de prereleases

El sufijo de prerelease debe coincidir en `package.json`, `src-tauri/Cargo.toml` y `src-tauri/tauri.conf.json`, incluido el título de la ventana. Por ejemplo, una beta `36.0.0-beta.1` debe figurar así en los tres archivos. Si en `tauri.conf.json` dice `36.0.0`, el updater la interpreta como versión final y rechaza betas posteriores del mismo major.

CI y las builds de release verifican esa coincidencia. Las builds por tag también comprueban que el tag sea `v` seguido de la versión empaquetada.

## Proceso de publicación

La publicación se hace en dos etapas para no distribuir binarios sin revisar.

### 1. Crear el tag

Antes de etiquetar:

1. Sincronizá la versión en `package.json`, `src-tauri/Cargo.toml` y `src-tauri/tauri.conf.json` (incluido el título de la ventana).
2. Actualizá el `Cargo.lock` de la raíz y verificá desde la raíz:
   ```bash
   cargo update --workspace --offline
   cargo clippy --workspace --locked -- -D warnings
   ```
   Si faltan dependencias en la caché local, ejecutá el primer comando sin `--offline`. Incluí el lockfile actualizado en el mismo commit del cambio de versión.
3. Ejecutá la comprobación de metadatos:
   ```bash
   bun test --conditions=browser ./tests/frontend/ui/versionMetadata.test.mjs
   ```
4. Creá y pusheá el tag:
   ```bash
   git tag v36.0.1
   git push origin v36.0.1
   ```

Para prereleases:

```bash
git tag v36.0.1-beta.1
git push origin v36.0.1-beta.1
```

### 2. Esperar el borrador

Al pushear el tag, el workflow `Build Release Draft` (o `Build Prerelease Draft`) compila Linux, Windows y macOS y sube los binarios a un **Release Draft** de GitHub con notas autogeneradas. El release todavía **no es público**.

### 3. Revisar y publicar

Cuando el borrador esté completo, ejecutá manualmente el workflow `Publish Release` desde GitHub Actions indicando el tag. Recién entonces el release se vuelve público y el updater de Tauri lo distribuye.

Las prereleases siguen el mismo proceso, pero se marcan como prerelease. Un push a `develop` genera artefactos de CI sin crear un release público ni una versión nueva.
