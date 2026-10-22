---
category: development
order: 40
title: Versioning and releases
description: Sequential version scheme, update channels and the two-stage publishing process.
---

# Versioning and releases

CubicLauncher uses a **simple sequential** scheme:

- **Major** — a whole number that increases with each release (27, 28, 29…).
- **Patch** — revisions or hotfixes on the same major.

Internally it uses semver (`MAJOR.MINOR.PATCH`) because the Tauri updater requires it. `MINOR` is always `0`.

| User-facing | Internal semver |
| --- | --- |
| `27` | `27.0.0` |
| `27 rev 1` | `27.0.1` |
| `27 rev 2` | `27.0.2` |
| `28` | `28.0.0` |

If `PATCH` is `0`, only the major is shown. If it is greater than `0`, it is shown as `major rev patch`.

## Update channels

- **Stable** — recommended for most users. Only receives published releases.
- **Pre-release** — alpha, beta and rc; may include unstable changes.

The channel is chosen in **Settings → Launcher → Updates**.

## Pre-release versioning

The pre-release suffix must match in `package.json`, `src-tauri/Cargo.toml` and `src-tauri/tauri.conf.json`, including the window title. For example, a `36.0.0-beta.1` beta must appear that way in all three files. If `tauri.conf.json` says `36.0.0`, the updater treats it as a final version and rejects later betas of the same major.

CI and release builds verify that match. Tag builds also check that the tag is `v` followed by the packaged version.

## Publishing process

Publishing happens in two stages to avoid distributing unreviewed binaries.

### 1. Create the tag

Before tagging:

1. Sync the version in `package.json`, `src-tauri/Cargo.toml` and `src-tauri/tauri.conf.json` (including the window title).
2. Update the root `Cargo.lock` and verify from the root:
   ```bash
   cargo update --workspace --offline
   cargo clippy --workspace --locked -- -D warnings
   ```
   If dependencies are missing from the local cache, run the first command without `--offline`. Include the updated lockfile in the same commit as the version change.
3. Run the metadata check:
   ```bash
   bun test --conditions=browser ./tests/frontend/ui/versionMetadata.test.mjs
   ```
4. Create and push the tag:
   ```bash
   git tag v36.0.1
   git push origin v36.0.1
   ```

For pre-releases:

```bash
git tag v36.0.1-beta.1
git push origin v36.0.1-beta.1
```

### 2. Wait for the draft

When the tag is pushed, the `Build Release Draft` (or `Build Prerelease Draft`) workflow builds Linux, Windows and macOS and uploads the binaries to a GitHub **Release Draft** with auto-generated notes. The release is **not public** yet.

### 3. Review and publish

When the draft is complete, manually run the `Publish Release` workflow from GitHub Actions with the tag. Only then does the release become public and the Tauri updater distribute it.

Pre-releases follow the same process but are marked as pre-release. A push to `develop` generates CI artifacts without creating a public release or a new version.
