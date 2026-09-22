---
title: Desarrollo local
description: Requisitos, comandos y flujo de trabajo para compilar, probar y contribuir a CubicLauncher.
---

# Desarrollo local

Esta guía describe cómo preparar un entorno de desarrollo completo de CubicLauncher, la organización interna del repositorio y el flujo de trabajo esperado para contribuciones de código.

:::related
- [Arquitectura](/docs/es-ES/Avanzado/arquitectura)
- [Contribuir](/docs/es-ES/Avanzado/contribuir)
- [Versionado y lanzamientos](/docs/es-ES/Avanzado/versionado)
- [Instalación en Nix](/docs/es-ES/guias/nix)
:::

## Requisitos

| Herramienta | Versión / notas |
|-------------|-----------------|
| Git | Cualquier versión reciente |
| Bun | Para gestionar dependencias y scripts del proyecto |
| Node.js | Una versión LTS vigente (respaldo de Bun) |
| Rust | Estable, con soporte para la edición 2024, junto con Cargo, `rustfmt` y Clippy |
| Tauri v2 | Dependencias del sistema según tu plataforma ([guía oficial](https://v2.tauri.app/start/prerequisites/)) |

La CLI de Tauri forma parte de las dependencias del proyecto y se instala automáticamente con `bun install`; no es necesario instalarla por separado.

## Entorno local

```bash
git clone https://github.com/CubicLauncherDevs/CubicLauncher.git
cd CubicLauncher
bun install --frozen-lockfile
bun run tauri dev
```

`bun run tauri dev` levanta la aplicación de escritorio y el servidor de desarrollo del frontend en paralelo, con recarga en caliente. Para trabajar únicamente en la interfaz, `bun run dev` inicia solo Vite; ten en cuenta que las funciones que dependen del backend (instancias, descargas, autenticación) no estarán disponibles en este modo.

### Entorno con Nix

En NixOS o con Nix instalado, el flake del repositorio incluye un `devShell` con todas las dependencias necesarias (Bun, Rust, `cargo-tauri`, GTK3, WebKitGTK, GStreamer, entre otras):

```bash
nix develop
bun install --frozen-lockfile
bun run tauri dev
```

Consultá la [guía de Nix](/docs/es-ES/guias/nix) para más detalles sobre empaquetado y solución de problemas.

## Comandos principales

Todos los comandos se ejecutan desde la raíz del repositorio.

| Comando | Descripción |
|---------|-------------|
| `bun run tauri dev` | Inicia la aplicación de escritorio en modo de desarrollo. |
| `bun run dev` | Inicia el servidor Vite del frontend. |
| `bun run tauri build` | Compila y empaqueta la aplicación para la plataforma actual. |
| `bun run build` | Genera la compilación de producción del frontend. |
| `bun run lint` | Ejecuta ESLint sobre el frontend. |
| `bun run check` | Verifica tipos y diagnósticos de Svelte. |
| `bun run test:frontend` | Ejecuta los tests del frontend con Bun. |
| `bun run test:rust` | Ejecuta los tests y doctests del workspace Rust. |
| `bun run test:all` | Ejecuta las suites del frontend y de Rust. |
| `cargo fmt --all --check` | Comprueba el formato del código Rust. |
| `cargo clippy --workspace -- -D warnings` | Ejecuta el análisis estático del workspace Rust. |

:::tip Generar build rápido para probar cambios del backend
Si solo querés validar cambios en Rust sin empaquetar instaladores, `cargo build` dentro de `src-tauri/` produce un binario de desarrollo mucho más rápido que `bun run tauri build`.
:::

## Estructura del repositorio

```
src/                  # Interfaz, estado y servicios del frontend
src-tauri/            # Aplicación Tauri, comandos y servicios nativos
  src/tests/          # Tests unitarios del backend de la aplicación
crates/               # Bibliotecas internas del workspace Rust
  <crate>/src/tests/  # Tests unitarios de cada biblioteca con suites propias
tests/frontend/       # Tests del frontend agrupados por área
static/               # Recursos estáticos de la interfaz
dist/                 # Archivos de empaquetado para distribuciones
.github/              # Integración continua y flujos de publicación
```

El backend está organizado como un workspace de crates internos que encapsulan dominios independientes (instancias, descargas, gestión de Java, autenticación, etc.). Esto permite probar cada servicio de forma aislada y reutilizarlo entre binarios.

## Pruebas

El proyecto mantiene suites separadas para frontend y backend:

- **Frontend (`tests/frontend/`):** tests unitarios y de integración ejecutados con Bun. La guía de pruebas documenta requisitos de Chromium para pruebas de navegador, mediciones de rendimiento y flujos de verificación manual.
- **Rust (`src-tauri/src/tests/` y `crates/<crate>/src/tests/`):** tests unitarios y doctests por crate, ejecutados con Cargo.

Antes de abrir un pull request, ejecutá `bun run test:all` para validar ambas suites.

## Flujo de trabajo recomendado

1. **Fork y rama:** creá un fork del repositorio y una rama descriptiva desde `main`:
   ```bash
   git checkout -b feat/nombre-del-cambio
   ```
2. **Commits atómicos:** realizá cambios pequeños y enfocados, con mensajes que describan la intención del cambio.
3. **Validación local:** antes de abrir el PR, asegurate de que pasan las comprobaciones:
   ```bash
   bun run lint
   bun run check
   bun run test:all
   cargo fmt --all --check
   cargo clippy --workspace -- -D warnings
   ```
4. **Pull request:** abrí el PR contra `main` describiendo claramente el problema que resuelve y, si aplica, enlazando el issue relacionado.
5. **Revisión:** un mantenedor revisará el cambio. Respondé a los comentarios con nuevos commits en la misma rama; evitá forzar el historial salvo que se te pida.

## Convenciones de código

- **Rust:** el formato se aplica con `rustfmt` y el análisis estático con Clippy; ambos se ejecutan en CI con `-D warnings`, por lo que cualquier advertencia bloquea la integración.
- **TypeScript / Svelte:** el frontend sigue las reglas de ESLint y `svelte-check` del repositorio.
- **Comentarios y nombres:** se recomienda escribir identificadores y comentarios en inglés, siguiendo el estilo ya presente en el código.

:::warning CI bloqueante
Las comprobaciones de formato, lints y tests se ejecutan en la integración continua de GitHub Actions. Un PR no pasará a revisión completa hasta que todos los checks estén en verde.
:::

## Recursos para contribuidores

- [CONTRIBUTING.md](https://github.com/CubicLauncherDevs/CubicLauncher/blob/develop/CONTRIBUTING.md) — convenciones del proyecto y proceso de contribución.
- [TESTING.md](https://github.com/CubicLauncherDevs/CubicLauncher/blob/develop/TESTING.md) — guía de pruebas, requisitos de Chromium y verificación manual.
- [Código de conducta](https://github.com/CubicLauncherDevs/CubicLauncher/blob/develop/CODE_OF_CONDUCT.md) — normas de participación en la comunidad.
- [Repositorio de traducciones](https://github.com/CubicLauncherDevs/Translations) — instrucciones de internacionalización.
- [Estado de los servicios](https://dev.cubiclauncher.org/) — disponibilidad de las API del proyecto.
- [Estado de dependencias Rust](https://deps.rs/repo/github/cubiclauncherdevs/cubiclauncher?path=src-tauri) — informe de dependencias del backend.

## Solución de problemas comunes

### `bun run tauri dev` falla al iniciar

Verificá que instalaste las dependencias del sistema de Tauri v2 para tu plataforma. En Linux, suelen ser paquetes de desarrollo de WebKitGTK y GTK3; en Windows, las Build Tools de Visual Studio y el WebView2 Runtime.

### Errores de compilación de Rust tras actualizar el toolchain

Asegurate de estar en el canal estable con soporte para la edición 2024 y actualizá las dependencias del lockfile:

```bash
rustup update stable
bun install --frozen-lockfile
```

### La interfaz no muestra datos del backend

Si iniciaste solo el frontend con `bun run dev`, las funciones que dependen de Tauri (IPC) no están disponibles. Levantá la aplicación completa con `bun run tauri dev`.
