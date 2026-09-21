---
title: Desarrollo local
description: Requisitos, comandos y flujo de trabajo para contribuir a CubicLauncher.
---

# Desarrollo local

## Requisitos

- Git
- Bun o Node.js LTS
- Rust estable (edición 2024) con Cargo, `rustfmt` y Clippy
- Dependencias de Tauri v2 según tu plataforma

## Entorno local

```bash
git clone https://github.com/CubicLauncherDevs/CubicLauncher.git
cd CubicLauncher
bun install --frozen-lockfile
bun run tauri dev
```

- `bun run tauri dev` levanta la app y el servidor de desarrollo del frontend.
- Para trabajar solo el frontend, usá `bun run dev` (algunas funciones requieren el backend).

Con Nix podés preparar el entorno con `nix develop` desde la raíz del repo.

## Comandos principales

```bash
bun run tauri dev         # Desarrollo (app de escritorio)
bun run dev               # Solo frontend (Vite)
bun run tauri build       # Build y empaquetado
bun run build             # Build de frontend
bun run lint              # ESLint
bun run check             # Svelte check
bun run test:frontend     # Tests frontend (Bun)
bun run test:rust         # Tests y doctests Rust
bun run test:all          # Todas las suites
cargo fmt --all --check   # Formato Rust
cargo clippy --workspace -- -D warnings  # Lints Rust
```

## Tests

Consultá la guía de pruebas del proyecto para requisitos de Chromium, mediciones de rendimiento y flujos de verificación manual.
