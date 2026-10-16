---
category: getting-started
order: 40
title: Installing on Nix
description: CubicLauncher publishes packages for Linux x86_64 and ARM64. Nix downloads the binary from Cachix when available; otherwise it compiles locally.
---

## Prerequisites

You need Nix with `flakes` and `nix-command` enabled.

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

## Install with Nix Flakes, without configuring Cachix

CubicLauncher publishes packages for Linux x86_64 and ARM64. Nix downloads the binary from Cachix when available; otherwise it compiles locally.

These commands use the flake directly. If you do not have a binary cache configured, Nix will compile the package on your machine.

Install the channel you prefer:

### Latest stable release

```bash
nix profile add github:CubicLauncherDevs/CubicLauncher/latest-release
```

### Latest beta

```bash
nix profile add github:CubicLauncherDevs/CubicLauncher/latest-beta
```

The binary will be available as `cubiclauncher` on your `PATH`.

## Choose a specific version

Replace `TAG` with the tag of a version published in [GitHub Releases](https://github.com/CubicLauncherDevs/CubicLauncher/releases):

```bash
nix profile add github:CubicLauncherDevs/CubicLauncher/TAG
```

## Optional: download precompiled binaries with Cachix

Configure the public cache once:

```bash
nix run nixpkgs#cachix -- use cubiclauncher
```

Once configured, the cache lets you download the published binaries if there is a build for your revision and architecture.

## Use CubicLauncher from your NixOS flake

Add CubicLauncher as a flake input and pass it to a NixOS module. To use the beta, replace `latest-release` with `latest-beta`.

```nix
{
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    cubiclauncher.url = "github:CubicLauncherDevs/CubicLauncher/latest-release";
  };

  outputs = { nixpkgs, cubiclauncher, ... }: {
    nixosConfigurations.my-host = nixpkgs.lib.nixosSystem {
      system = "x86_64-linux";
      modules = [
        ./configuration.nix
        ({ pkgs, ... }: {
          environment.systemPackages = [
            cubiclauncher.packages.${pkgs.system}.default
          ];
        })
      ];
    };
  };
}
```

## Enable Cachix on NixOS

Add the cache and its public key to your NixOS configuration:

```nix
nix.settings = {
  extra-substituters = [ "https://cubiclauncher.cachix.org" ];
  extra-trusted-public-keys = [
    "cubiclauncher.cachix.org-1:tBeOuLW/CLlkYAH0AB+DNio4XNZOGVMHvQHVuQSqhcA="
  ];
};
```

Apply the configuration and then install CubicLauncher with one of the profile commands above:

```bash
sudo nixos-rebuild switch
nix profile add github:CubicLauncherDevs/CubicLauncher/latest-release
```

The project cache provides builds for Linux x86_64 and ARM64. On other platforms Nix may compile the package locally.

## Run without installing

You can run CubicLauncher directly from the flake without installing it:

```bash
nix run github:CubicLauncherDevs/CubicLauncher/latest-release
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

The environment includes `bun`, `rustc`, `cargo`, `cargo-tauri`, GTK3, WebKitGTK, GStreamer, and other tools.

On Linux, the devShell pins Mesa, EGL, GBM and Wayland to the same Nixpkgs revision as the compiler's glibc (pinned in `flake.lock`) and automatically detects NVIDIA on Wayland. You can force or disable WebKitGTK software rendering with `CUBICLAUNCHER_WEBKIT_SOFTWARE=1` or `CUBICLAUNCHER_WEBKIT_SOFTWARE=0`.

With the proprietary NVIDIA driver, if your system drivers require a newer glibc, use the system's Nixpkgs in the development environment:

```bash
nix develop --override-input nixpkgs nixpkgs --no-write-lock-file
```

See the [development guide](/docs/en-EN/Advanced/development) for more details.

## Update

If you installed from a channel, update while keeping it. Look up the entry name and upgrade it:

```bash
nix profile list
nix profile upgrade --refresh <name>
```

You can also reinstall to replace the current version:

```bash
nix profile add github:CubicLauncherDevs/CubicLauncher/latest-release
```

:::warning Self-update is disabled
Updater artifacts are disabled during Nix packaging, since the launcher should be updated through Nix.
:::

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

:::warning WARNING
This problem is not related to CubicLauncher; it is a configuration error in your Nix installation.
:::

### `EGL_BAD_PARAMETER` on startup

This error appears when EGL selects the Mesa from `/run/opengl-driver`, built against a different glibc than the one used by the flake. The devShell and the installed package pin Mesa, EGL, GBM and Wayland to the same Nixpkgs revision as the compiler's glibc. Re-enter the shell or use the system's Nixpkgs:

```bash
nix develop --override-input nixpkgs nixpkgs --no-write-lock-file
```

:::details Packaging and publishing (maintainers)
The flake exposes the package, the `devShell`, the formatter and a basic check. The packaging lives in `dist/nix/` (`flake.nix`, `flake.lock` and `package.nix`).

**Cachix publishing.** The `.github/workflows/nix-cache.yml` workflow builds and publishes the package for Linux x86_64 and ARM64. It runs on release publication, when the *Publish Release* workflow finishes, and manually. It updates the moving tags `latest-release` and `latest-beta` separately.

**`cargoHash`.** It covers the Rust dependency tree and depends on `Cargo.lock` and the nixpkgs revision pinned in `flake.lock`. When `Cargo.lock` changes, regenerate it like this:

```bash
nix build --no-link \
  ".#packages.$(nix eval --raw --impure --expr builtins.currentSystem).default.cargoDeps"
```

Copy the hash from the `got:` line into `cargoHash` in `dist/nix/package.nix`. Always generate it with `nix build .#...` to respect the committed `flake.lock`.

**Other architectures.** Add the system to `supportedSystems` in `flake.nix` and the matching `nodeModules` hash in `dist/nix/package.nix`.

**Build script.** If the multi-user daemon does not have the `nixbld` group, run `sudo ./dist/nix/setup-nix-build-users.sh` from the repository.
:::
