---
title: Arquitectura
description: "Vista general de la arquitectura de CubicLauncher: Tauri (Rust) + SvelteKit (frontend), eventos e IPC, y estructura de carpetas."
---

# Arquitectura

## Componentes

- Aplicación de escritorio: Tauri v2 + WebView del sistema.
- Backend: Rust (Tokio), con un workspace de crates internos para servicios (instancias, descargas, Java, etc.).
- Interfaz: Svelte 5 + SvelteKit + TypeScript.

El frontend se comunica con el backend mediante comandos de Tauri (IPC). El backend publica eventos que la UI consume para actualizar estados (descargas, logs, cambios en instancias, etc.).

## Estructura del repositorio (resumen)

```
src/                  # Interfaz, estado y servicios del frontend
src-tauri/            # Aplicación Tauri, comandos y servicios nativos
  src/tests/          # Tests del backend de la app
crates/               # Bibliotecas internas (workspace Rust)
  <crate>/src/tests/  # Tests unitarios por crate
tests/frontend/       # Tests del frontend
static/               # Recursos estáticos
dist/                 # Empaquetado para distribuciones
.github/              # CI/CD
```

## Datos en disco

`~/.cubic/` aloja datos del launcher y de instancias:

- `instances/` — carpetas por instancia.
- `shared/` — versiones del juego y runtimes Java gestionados.
- `settings/` — `settings.cub` con configuración.
- `themes/` — temas instalados por el usuario.
- `skins/` — guardarropa de skins.

## Actualizaciones

El updater integrado consulta endpoints del proyecto para ofrecer versiones estables o de pre-release (según el canal configurado en `settings.cub`).
