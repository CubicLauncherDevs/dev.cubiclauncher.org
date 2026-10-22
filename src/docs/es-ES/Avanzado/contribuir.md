---
category: development
order: 30
title: Contribuir
description: Cómo reportar problemas, proponer cambios, enviar PRs y colaborar con traducciones en CubicLauncher.
---

# Contribuir

Se aceptan contribuciones de código, documentación, traducciones y reportes de bugs.

## Antes de empezar

- Si el cambio es grande o puede discutirse, abrí un issue primero.
- Trabajá en una rama propia creada desde `develop`.
- Hacé commits pequeños y descriptivos.
- Actualizá la documentación si cambian las reglas del proyecto.

## Reportar un problema

Abrí un issue con:

- Descripción clara del problema.
- Pasos para reproducir.
- Versión de CubicLauncher y sistema operativo.
- Enlace al log en mclo.gs si aplica.

## Commits

El formato es:

```text
<tipo>(<alcance opcional>): <descripción breve>

[cuerpo opcional]

[breaking change / referencia a issue]
```

Tipos habituales: `feat`, `fix`, `refactor`, `perf`, `style`, `docs`, `test`, `chore`, `i18n` y `core` para el backend Rust.

- Los mensajes van en español, en infinitivo o imperativo.
- La primera línea no debe superar los 72 caracteres.
- Describí el **qué**, no el **cómo**.
- Un commit por cambio lógico.
- Marcá los cambios incompatibles con `!` o con `BREAKING CHANGE:` en el cuerpo.

## Flujo de pull request

1. Creá una rama desde `develop`.
2. Implementá el cambio y actualizá los tests.
3. Ejecutá las comprobaciones locales:
   ```bash
   bun run lint
   bun run check
   bun run test:all
   cargo fmt --all --check
   cargo clippy --workspace -- -D warnings
   ```
4. Abrí el PR contra `develop` y asigná al menos una label.
5. Respondé a la revisión con nuevos commits en la misma rama; evitá reescribir el historial salvo que se te pida.

## Labels de PR

| Label | Uso |
| --- | --- |
| `breaking` | Cambio que rompe compatibilidad. |
| `feature` | Nueva funcionalidad visible. |
| `core` | Backend Rust. |
| `ui` | Cambios visuales en Svelte o CSS. |
| `i18n` | Traducciones o archivos de idioma. |
| `bug` / `fix` / `patch` | Correcciones. |
| `perf` | Rendimiento. |
| `test` | Tests. |
| `docs` | Documentación. |
| `chore` / `refactor` / `deps` / `ci` | Mantenimiento. |
| `ignore-for-release` | No debe aparecer en el changelog. |

## Convenciones de código

- **Rust**: `rustfmt` y Clippy sin warnings. Los errores se serializan como `{"code":"...","params":{...}}` para i18n.
- **Svelte/TypeScript**: runes de Svelte 5, sin `any`, `key` en bloques `{#each}` y `$derived` para valores calculados.
- **CI**: formato, lints y tests se ejecutan en GitHub Actions; un PR no pasa a revisión completa hasta que todo esté en verde.

## Traducciones

Las traducciones se mantienen en [CubicLauncherDevs/Translations](https://github.com/CubicLauncherDevs/Translations). El launcher incluye `es-ES` y `en-US` como fallback local.

Para agregar una clave nueva:

1. Añadila en `src/lib/i18n/en-US.json` y `src/lib/i18n/es-ES.json`.
2. En el repo de traducciones, editá `src/locales/*.json`.
3. Incrementá el campo `version` de cada idioma modificado.
4. Añadí la entrada en `src/changelog.json`.
5. Ejecutá `bun run build && bun run deploy` en el Worker.

Para completar claves faltantes respecto a `en-US`, usá `bun run sync-locales` en el repositorio de traducciones.

## Recursos

- [CONTRIBUTING.md](https://github.com/CubicLauncherDevs/CubicLauncher/blob/develop/CONTRIBUTING.md)
- [TESTING.md](https://github.com/CubicLauncherDevs/CubicLauncher/blob/develop/TESTING.md)
- [Código de conducta](https://github.com/CubicLauncherDevs/CubicLauncher/blob/develop/CODE_OF_CONDUCT.md)
- [Repositorio de traducciones](https://github.com/CubicLauncherDevs/Translations)
- [Guía de desarrollo local](/docs/es-ES/Avanzado/desarrollo)
