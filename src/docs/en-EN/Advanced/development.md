---
title: Local development
description: Requirements, commands and workflow to build, test and contribute to CubicLauncher.
---

# Local development

This guide describes how to set up a complete CubicLauncher development environment, the internal organization of the repository and the expected workflow for code contributions.

:::related
- [Architecture](/docs/en-EN/Advanced/architecture)
- [Contributing](/docs/en-EN/Advanced/contributing)
- [Versioning and releases](/docs/en-EN/Advanced/versioning)
- [Nix guide](/docs/en-EN/guides/nix)
:::

## Requirements

| Tool | Version / notes |
|------|-----------------|
| [Git](https://git-scm.com/) | Any recent version |
| [Bun](https://bun.sh/) | To install dependencies and run project scripts |
| [Node.js](https://nodejs.org/) | A current LTS version (fallback for Bun) |
| [Rust](https://www.rust-lang.org/tools/install) | Stable, with 2024 edition support, along with Cargo, `rustfmt` and Clippy |
| Tauri v2 | System dependencies for your platform ([official guide](https://v2.tauri.app/start/prerequisites/)) |

The Tauri CLI is part of the project dependencies and is installed automatically with `bun install`; there is no need to install it separately.

## Local environment

```bash
git clone https://github.com/CubicLauncherDevs/CubicLauncher.git
cd CubicLauncher
bun install --frozen-lockfile
bun run tauri dev
```

`bun run tauri dev` starts the desktop application and the frontend development server in parallel, with hot reloading. To work only on the interface, `bun run dev` starts Vite alone; keep in mind that features that depend on the backend (instances, downloads, authentication) will not be available in this mode.

### Nix environment

On NixOS or with Nix installed, the repository flake includes a `devShell` with all the required dependencies (Bun, Rust, `cargo-tauri`, GTK3, WebKitGTK, GStreamer, among others):

```bash
nix develop
bun install --frozen-lockfile
bun run tauri dev
```

See the [Nix guide](/docs/en-EN/guides/nix) for more details about packaging and troubleshooting.

## Main commands

All commands are run from the repository root.

| Command | Description |
|---------|-------------|
| `bun run tauri dev` | Starts the desktop application in development mode. |
| `bun run dev` | Starts the Vite frontend server. |
| `bun run tauri build` | Builds and packages the application for the current platform. |
| `bun run build` | Generates the production build of the frontend. |
| `bun run lint` | Runs ESLint on the frontend. |
| `bun run check` | Checks types and Svelte diagnostics. |
| `bun run test:frontend` | Runs the frontend tests with Bun. |
| `bun run test:rust` | Runs the Rust workspace tests and doctests. |
| `bun run test:all` | Runs the frontend and Rust suites. |
| `cargo fmt --all --check` | Checks Rust code formatting. |
| `cargo clippy --workspace -- -D warnings` | Runs static analysis on the Rust workspace. |

:::tip Quick build to test backend changes
If you only want to validate Rust changes without packaging installers, `cargo build` inside `src-tauri/` produces a development binary much faster than `bun run tauri build`.
:::

## Repository structure

```
src/                  # Frontend interface, state and services
src-tauri/            # Tauri application, commands and native services
  src/tests/          # Unit tests for the application backend
crates/               # Internal Rust workspace libraries
  <crate>/src/tests/  # Unit tests for each library with their own suites
tests/frontend/       # Frontend tests grouped by area
static/               # Frontend static assets
dist/                 # Packaging files for distributions
.github/              # Continuous integration and release workflows
```

The backend is organized as a workspace of internal crates that encapsulate independent domains (instances, downloads, Java management, authentication, etc.). This allows testing each service in isolation and reusing it across binaries.

## Testing

The project maintains separate suites for frontend and backend:

- **Frontend (`tests/frontend/`):** unit and integration tests executed with Bun. The testing guide documents Chromium requirements for browser tests, performance measurements and manual verification flows.
- **Rust (`src-tauri/src/tests/` and `crates/<crate>/src/tests/`):** unit tests and doctests per crate, executed with Cargo.

Before opening a pull request, run `bun run test:all` to validate both suites.

## Recommended workflow

1. **Fork and branch:** fork the repository and create a descriptive branch from `main`:
   ```bash
   git checkout -b feat/name-of-the-change
   ```
2. **Atomic commits:** keep changes small and focused, with commit messages that describe the intent of the change.
3. **Local validation:** before opening the PR, make sure all checks pass:
   ```bash
   bun run lint
   bun run check
   bun run test:all
   cargo fmt --all --check
   cargo clippy --workspace -- -D warnings
   ```
4. **Pull request:** open the PR against `main` clearly describing the problem it solves and, if applicable, linking the related issue.
5. **Review:** a maintainer will review the change. Respond to comments with new commits on the same branch; avoid force-pushing history unless requested.

## Code conventions

- **Rust:** formatting is applied with `rustfmt` and static analysis with Clippy; both run in CI with `-D warnings`, so any warning blocks integration.
- **TypeScript / Svelte:** the frontend follows the ESLint rules and `svelte-check` configuration of the repository.
- **Comments and naming:** identifiers and comments are recommended to be written in English, following the style already present in the codebase.

:::warning Blocking CI
Formatting, lint and test checks run in the GitHub Actions continuous integration. A PR will not move to full review until all checks are green.
:::

## Contributor resources

- [CONTRIBUTING.md](https://github.com/CubicLauncherDevs/CubicLauncher/blob/develop/CONTRIBUTING.md) — project conventions and contribution process.
- [TESTING.md](https://github.com/CubicLauncherDevs/CubicLauncher/blob/develop/TESTING.md) — testing guide, Chromium requirements and manual verification.
- [Code of conduct](https://github.com/CubicLauncherDevs/CubicLauncher/blob/develop/CODE_OF_CONDUCT.md) — rules for participating in the community.
- [Translations repository](https://github.com/CubicLauncherDevs/Translations) — internationalization instructions.
- [Service status](https://dev.cubiclauncher.org/) — availability of the project APIs.
- [Rust dependencies status](https://deps.rs/repo/github/cubiclauncherdevs/cubiclauncher?path=src-tauri) — backend dependencies report.

## Troubleshooting

### `bun run tauri dev` fails to start

Make sure you installed the Tauri v2 system dependencies for your platform. On Linux, these are usually WebKitGTK and GTK3 development packages; on Windows, the Visual Studio Build Tools and the WebView2 Runtime.

### Rust compilation errors after updating the toolchain

Make sure you are on the stable channel with 2024 edition support and refresh the lockfile dependencies:

```bash
rustup update stable
bun install --frozen-lockfile
```

### The interface shows no backend data

If you started only the frontend with `bun run dev`, features that depend on Tauri (IPC) are not available. Start the full application with `bun run tauri dev`.
