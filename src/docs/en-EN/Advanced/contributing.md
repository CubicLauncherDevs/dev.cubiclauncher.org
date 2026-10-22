---
category: development
order: 30
title: Contributing
description: How to report issues, propose changes, send PRs and collaborate with translations in CubicLauncher.
---

# Contributing

Code, documentation, translations and bug reports are welcome.

## Before you start

- If the change is large or open to discussion, open an issue first.
- Work on your own branch created from `develop`.
- Make small and descriptive commits.
- Update the documentation if the project rules change.

## Reporting an issue

Open an issue with:

- A clear description of the problem.
- Steps to reproduce.
- CubicLauncher and operating system version.
- A log link on mclo.gs if applicable.

## Commits

The format is:

```text
<type>(<optional scope>): <short description>

[optional body]

[breaking change / issue reference]
```

Common types: `feat`, `fix`, `refactor`, `perf`, `style`, `docs`, `test`, `chore`, `i18n`, and `core` for the Rust backend.

- Messages are in Spanish, in infinitive or imperative form.
- The first line must not exceed 72 characters.
- Describe the **what**, not the **how**.
- One commit per logical change.
- Mark breaking changes with `!` or with `BREAKING CHANGE:` in the body.

## Pull request workflow

1. Create a branch from `develop`.
2. Implement the change and update the tests.
3. Run the local checks:
   ```bash
   bun run lint
   bun run check
   bun run test:all
   cargo fmt --all --check
   cargo clippy --workspace -- -D warnings
   ```
4. Open the PR against `develop` and assign at least one label.
5. Reply to review with new commits on the same branch; avoid rewriting history unless asked.

## PR labels

| Label | Use |
| --- | --- |
| `breaking` | Change that breaks compatibility. |
| `feature` | New user-visible feature. |
| `core` | Rust backend. |
| `ui` | Visual changes in Svelte or CSS. |
| `i18n` | Translations or language files. |
| `bug` / `fix` / `patch` | Fixes. |
| `perf` | Performance. |
| `test` | Tests. |
| `docs` | Documentation. |
| `chore` / `refactor` / `deps` / `ci` | Maintenance. |
| `ignore-for-release` | Must not appear in the changelog. |

## Code conventions

- **Rust**: `rustfmt` and Clippy with no warnings. Errors are serialized as `{"code":"...","params":{...}}` for i18n.
- **Svelte/TypeScript**: Svelte 5 runes, no `any`, `key` in `{#each}` blocks and `$derived` for computed values.
- **CI**: formatting, lints and tests run on GitHub Actions; a PR does not move to full review until everything is green.

## Translations

Translations are maintained in [CubicLauncherDevs/Translations](https://github.com/CubicLauncherDevs/Translations). The launcher bundles `es-ES` and `en-US` as local fallbacks.

To add a new key:

1. Add it in `src/lib/i18n/en-US.json` and `src/lib/i18n/es-ES.json`.
2. In the translations repo, edit `src/locales/*.json`.
3. Increase the `version` field of each modified language.
4. Add the entry in `src/changelog.json`.
5. Run `bun run build && bun run deploy` in the Worker.

To fill missing keys compared to `en-US`, use `bun run sync-locales` in the translations repository.

## Resources

- [CONTRIBUTING.md](https://github.com/CubicLauncherDevs/CubicLauncher/blob/develop/CONTRIBUTING.md)
- [TESTING.md](https://github.com/CubicLauncherDevs/CubicLauncher/blob/develop/TESTING.md)
- [Code of conduct](https://github.com/CubicLauncherDevs/CubicLauncher/blob/develop/CODE_OF_CONDUCT.md)
- [Translations repository](https://github.com/CubicLauncherDevs/Translations)
- [Local development guide](/docs/en-EN/Advanced/development)
