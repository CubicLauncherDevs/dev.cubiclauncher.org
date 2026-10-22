---
category: development
order: 10
title: Arquitectura
description: "Vista general de la arquitectura de CubicLauncher: Tauri v2, backend Rust, frontend SvelteKit, crates internos, eventos y datos en disco."
---

# Arquitectura

## Componentes

- **Aplicación de escritorio**: Tauri v2 con el WebView del sistema.
- **Backend**: Rust sobre Tokio, con un workspace de crates internos.
- **Interfaz**: Svelte 5 + SvelteKit + TypeScript, compilada como sitio estático.

El frontend envía comandos al backend mediante IPC de Tauri. El backend responde con eventos `app-event` y transmisiones de logs; la UI los consume para actualizar descargas, instancias, estado de lanzamiento y consola.

## Crates del workspace

| Crate | Responsabilidad |
| --- | --- |
| `aqua` | Descarga de versiones de Minecraft, loaders y JRE; manifiestos, assets, librerías y proveedores de descarga. |
| `zellkern` | Modelos del manifiesto, resolución de versiones, utilidades de Forge, construcción de argumentos y `LaunchConfig`. |
| `launchwerk` | Preparación y lanzamiento del proceso Java, extracción de natives y manejo del ciclo de vida. |
| `cubrinth` | Instalación de modpacks en formato `.mrpack` y utilidades asociadas. |
| `communicator` | Cliente de Discord RPC. |
| `ablage` | Repositorio local con caché versionada para datos serializados. |
| `src-tauri` | Aplicación Tauri: comandos, servicios de instancias, ajustes, autenticación, cola de descargas y eventos. |

## Estructura del repositorio

```
src/                  # Interfaz, estado y servicios del frontend
src-tauri/            # Aplicación Tauri, comandos y servicios nativos
  src/tests/          # Tests del backend de la aplicación
  src/services/       # Instancias, descargas, Java, launcher, autenticación
crates/               # Bibliotecas internas del workspace Rust
  <crate>/src/tests/  # Tests unitarios por crate
tests/frontend/       # Tests del frontend
static/               # Recursos estáticos
dist/                 # Empaquetado para distribuciones
.github/              # CI y flujos de publicación
```

## Flujo de lanzamiento

1. La UI invoca el comando `launch`.
2. El servicio `Launcher` bloquea los archivos de la instancia y marca el estado como `Starting`.
3. Se verifican las dependencias de la versión; si faltan, se encolan en `DownloadQueue` y se devuelve `VersionNotFound`.
4. `aqua` descarga versión, loader y JRE según corresponda.
5. `zellkern` resuelve la herencia del manifiesto (Vanilla → loader) y construye los argumentos.
6. Se refresca el token de la cuenta y se arma `LaunchConfig` con RAM, argumentos JVM, variables de entorno, autenticación y Quick Play.
7. `launchwerk` extrae los natives y lanza el proceso Java; stdout/stderr se envían a los logs y a la UI.
8. Al terminar, el estado vuelve a `Off`. Si el proceso sale con un código distinto de cero sin haber sido detenido desde el launcher, se detecta un crash y se guarda un snapshot de logs durante una hora.

## Eventos e IPC

- Los comandos se exponen desde `src-tauri/src/commands/`.
- Los eventos se publican en el bus de la aplicación como `app-event` y se consumen desde el frontend.
- Las descargas emiten progreso, finalización y error por separado.
- La consola combina líneas en vivo, historial por instancia y snapshots de crash.

## Datos en disco

Por defecto, todo vive bajo `~/.cubic/`:

- `instances/<nombre>/` — datos de cada instancia y su archivo `instance.cub`.
- `shared/` — `versions`, `libraries`, `assets`, `natives` y `runtimes`.
- `settings/settings.cub` — ajustes, cuentas y preferencias.
- `themes/` — temas instalados por el usuario.
- `skins/` — armario de skins.

Las rutas de `instances` y `shared` se pueden cambiar desde **Ajustes → Almacenamiento**. La configuración de esas rutas se guarda en `settings.cub`.

## Actualizaciones

El updater de Tauri consulta los endpoints del proyecto según el canal configurado:

- **Estable** — releases publicados.
- **Pre-lanzamiento** — versiones alpha, beta o rc.

Cada push a `develop` genera artefactos de CI, pero no un release público. La publicación sigue el flujo de [Versionado y lanzamientos](/docs/es-ES/Avanzado/versionado).
