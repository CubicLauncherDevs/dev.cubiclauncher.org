---
title: Installation on Nix | CubicLauncher
---

## Prerequisites

CubicLauncher can be installed from the repository's flake. To use it you need Nix with `flakes` and `nix-command` enabled.

On NixOS, add the following to your `configuration.nix`:

```nix
nix.settings.experimental-features = [ "nix-command" "flakes" ];
```

On other distributions, add these lines to `/etc/nix/nix.conf` (or `~/.config/nix/nix.conf`):

```text
experimental-features = nix-command flakes
```

Restart the Nix daemon if necessary and verify that flake commands work:

```bash
nix --version
nix flake show github:CubicLauncherDevs/CubicLauncher
```

<div class="my-6 flex gap-3 rounded-lg border border-yellow-500 bg-yellow-500/5 p-4 text-yellow-500">
<div class="flex flex-col gap-1">
<span class="text-sm font-bold uppercase tracking-wider text-yellow-400">
Architecture support
</span>

<div class="m-0 text-sm leading-relaxed text-neutral-400">
<p class="mt-1">
The flake is currently tested on <code>x86_64-linux</code>. Other Linux architectures (for example <code>aarch64-linux</code>) may require adjusting the <code>nodeModules</code> hash in <code>dist/nix/package.nix</code>.
</p>
</div>
</div>
</div>

## Install

To install CubicLauncher into your user profile:

```bash
nix profile install github:CubicLauncherDevs/CubicLauncher
```

If you already cloned the repository, you can install from the local source:

```bash
nix profile install .
```

The binary will be available as `cubiclauncher` on your `PATH`.

## Run without installing

You can run CubicLauncher directly from the flake without installing it:

```bash
nix run github:CubicLauncherDevs/CubicLauncher
```

## Local build

You can also build the package manually:

```bash
nix build .
ls -la result/bin
```

The compiled binary will be in `result/bin/cubiclauncher`.

## Development environment

If you want to contribute to or develop CubicLauncher, the flake includes a `devShell` with all the necessary dependencies:

```bash
nix develop
bun install
bun run tauri dev
```

The environment includes `bun`, `rustc`, `cargo`, `cargo-tauri`, `gtk3`, `webkitgtk_4_1`, GStreamer, and other tools.

## Update

When a new version is released, update the package from the flake:

```bash
nix profile upgrade '.*cubiclauncher.*'
```

Or reinstall to replace the current version:

```bash
nix profile install github:CubicLauncherDevs/CubicLauncher
```

<div class="my-6 flex gap-3 rounded-lg border border-yellow-500 bg-yellow-500/5 p-4 text-yellow-500">
<div class="flex flex-col gap-1">
<span class="text-sm font-bold uppercase tracking-wider text-yellow-400">
Self-update is disabled
</span>

<div class="m-0 text-sm leading-relaxed text-neutral-400">
<p class="mt-1">
Updater artifacts are disabled during Nix packaging, since the launcher should be updated through Nix.
</p>
</div>
</div>
</div>

## Troubleshooting

### `error: the group 'nixbld' specified in 'build-users-group' does not exist`

This error occurs when Nix is installed in multi-user mode but the `nixbld` group used by the daemon for builds does not exist. To fix it, run the script included in the repository as root:

```bash
git clone https://github.com/CubicLauncherDevs/CubicLauncher.git
cd CubicLauncher
sudo ./dist/nix/setup-nix-build-users.sh
```

Then retry:

```bash
nix run github:CubicLauncherDevs/CubicLauncher
# or
nix develop
```

<div class="my-6 flex gap-3 rounded-lg border border-yellow-500 bg-yellow-500/5 p-4 text-yellow-500">
<div class="flex flex-col gap-1">
<span class="text-sm font-bold uppercase tracking-wider text-yellow-400">WARNING</span>
<div class="m-0 text-sm leading-relaxed text-neutral-400">
This problem is not related to CubicLauncher; it is a configuration error in your Nix installation.
</div>
</div>
</div>
