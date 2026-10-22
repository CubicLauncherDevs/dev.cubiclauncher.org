---
category: development
order: 10
title: Architecture
description: "Overview of CubicLauncher architecture: Tauri v2, Rust backend, SvelteKit frontend, internal crates, events and on-disk data."
---

# Architecture

## Components

- **Desktop application**: Tauri v2 with the system WebView.
- **Backend**: Rust on Tokio, with a workspace of internal crates.
- **Interface**: Svelte 5 + SvelteKit + TypeScript, compiled as a static site.

The frontend sends commands to the backend through Tauri IPC. The backend responds with `app-event` events and log streams; the UI consumes them to update downloads, instances, launch status and the console.

## Workspace crates

| Crate | Responsibility |
| --- | --- |
| `aqua` | Downloading Minecraft versions, loaders and JREs; manifests, assets, libraries and download providers. |
| `zellkern` | Manifest models, version resolution, Forge utilities, argument building and `LaunchConfig`. |
| `launchwerk` | Preparing and launching the Java process, extracting natives and handling the lifecycle. |
| `cubrinth` | Installing `.mrpack` modpacks and related utilities. |
| `communicator` | Discord RPC client. |
| `ablage` | Local repository with a versioned cache for serialized data. |
| `src-tauri` | Tauri application: commands, instance services, settings, authentication, download queue and events. |

## Repository structure

```
src/                  # Frontend interface, state and services
src-tauri/            # Tauri app, commands and native services
  src/tests/          # Application backend tests
  src/services/       # Instances, downloads, Java, launcher, authentication
crates/               # Internal crates of the Rust workspace
  <crate>/src/tests/  # Unit tests per crate
tests/frontend/       # Frontend tests
static/               # Static assets
dist/                 # Packaging for distributions
.github/              # CI and publishing workflows
```

## Launch flow

1. The UI invokes the `launch` command.
2. The `Launcher` service locks the instance files and marks the status as `Starting`.
3. Version dependencies are checked; if any are missing, they are queued in `DownloadQueue` and `VersionNotFound` is returned.
4. `aqua` downloads version, loader and JRE as needed.
5. `zellkern` resolves manifest inheritance (Vanilla → loader) and builds the arguments.
6. The account token is refreshed and `LaunchConfig` is assembled with RAM, JVM arguments, environment variables, authentication and Quick Play.
7. `launchwerk` extracts the natives and launches the Java process; stdout/stderr is sent to the logs and the UI.
8. When it ends, the status returns to `Off`. If the process exits with a non-zero code without being stopped from the launcher, a crash is detected and a log snapshot is saved for one hour.

## Events and IPC

- Commands are exposed from `src-tauri/src/commands/`.
- Events are published on the application bus as `app-event` and consumed from the frontend.
- Downloads emit progress, completion and error separately.
- The console combines live lines, per-instance history and crash snapshots.

## On-disk data

By default, everything lives under `~/.cubic/`:

- `instances/<name>/` — data for each instance and its `instance.cub` file.
- `shared/` — `versions`, `libraries`, `assets`, `natives` and `runtimes`.
- `settings/settings.cub` — settings, accounts and preferences.
- `themes/` — user-installed themes.
- `skins/` — skin closet.

The `instances` and `shared` paths can be changed from **Settings → Storage**. The configuration for those paths is stored in `settings.cub`.

## Updates

The Tauri updater queries the project endpoints according to the configured channel:

- **Stable** — published releases.
- **Pre-release** — alpha, beta or rc versions.

Each push to `develop` generates CI artifacts, but not a public release. Publishing follows the [Versioning and releases](/docs/en-EN/Advanced/versioning) flow.
