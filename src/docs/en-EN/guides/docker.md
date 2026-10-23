---
category: getting-started
order: 50
title: Installing with Docker
description: Run CubicLauncher in a Docker container with X11 or Wayland, GPU, audio and persistent data. Multi-architecture image published on GitHub Packages.
---

# Installing with Docker

CubicLauncher is published as a multi-architecture container image on GitHub Packages for `linux/amd64` and `linux/arm64`.

- Repository: [CubicLauncher](https://github.com/CubicLauncherDevs/CubicLauncher)
- Image: [ghcr.io/cubiclauncherdevs/cubiclauncher](https://github.com/CubicLauncherDevs/CubicLauncher/pkgs/container/cubiclauncher)

:::info Desktop application
CubicLauncher needs access to the host's graphical server. The container does not include a desktop environment or its own X11 or Wayland server.
:::

## Requirements

- Docker installed on the host.
- A running X11 or Wayland graphical server.
- Access to `/dev/dri` for hardware acceleration.
- A volume or folder to keep the `~/.cubic` data.

## Get the image

```bash
docker pull ghcr.io/cubiclauncherdevs/cubiclauncher:latest
```

The published tags are the full version (`36.0.1`), the minor version (`36.0`), the major version (`36`) and `latest`. `latest` only points to the most recent stable release; pre-releases only receive their own tag.

## Run with X11

Allow your local user to connect to the X11 server and start the container:

```bash
xhost +si:localuser:$(id -un)

docker run --rm -it \
  --user "$(id -u):$(id -g)" \
  -e HOME=/data \
  -e DISPLAY \
  -v /tmp/.X11-unix:/tmp/.X11-unix:ro \
  -v cubic-data:/data \
  --device /dev/dri \
  ghcr.io/cubiclauncherdevs/cubiclauncher:latest
```

When you are done, you can revoke the permission:

```bash
xhost -si:localuser:$(id -un)
```

## Run with Wayland

```bash
docker run --rm -it \
  --user "$(id -u):$(id -g)" \
  -e HOME=/data \
  -e XDG_RUNTIME_DIR=/run/user/$(id -u) \
  -e WAYLAND_DISPLAY \
  -e GDK_BACKEND=wayland \
  -v "$XDG_RUNTIME_DIR:/run/user/$(id -u)" \
  -v cubic-data:/data \
  --device /dev/dri \
  ghcr.io/cubiclauncherdevs/cubiclauncher:latest
```

## Persistent data

The `cubic-data` volume keeps `~/.cubic`: instances, settings and the JRE downloaded by the launcher.

To use your host user's data, mount the folder directly:

```bash
-v "$HOME/.cubic:/data/.cubic"
```

The image works with any UID through `--user`, but the `/data` directory must be writable by that UID. The volume is created with `1777` permissions.

## NVIDIA

If you use an NVIDIA GPU, install `nvidia-container-toolkit` and add `--gpus all` to the X11 or Wayland command.

If the interface appears blank, try disabling WebKit's DMA-BUF renderer:

```bash
-e WEBKIT_DISABLE_DMABUF_RENDERER=1
```

## Audio

For PulseAudio, mount the server socket and set `PULSE_SERVER` according to your configuration. For ALSA, add the sound device:

```bash
--device /dev/snd
```

## Limitations

- The built-in updater does not work inside the container. To update, pull the new image tag.
- The container does not install the host's graphics drivers; configure them on the host system.
- If WebKit fails to start because of the sandbox, try `--security-opt seccomp=unconfined`.

## Build the image locally

From the repository root:

```bash
docker build -t cubiclauncher .
```

The `.github/workflows/docker.yml` workflow publishes the image when a `v*` tag is created. To publish the latest release manually, run **Actions → Docker Image → Run workflow** and leave the `tag` field empty; the latest stable release will be resolved automatically. If you enter a specific tag that is not the latest release, `latest` will not be moved.
