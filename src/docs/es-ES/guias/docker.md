---
category: getting-started
order: 50
title: Instalación con Docker
description: Ejecuta CubicLauncher en un contenedor Docker con X11 o Wayland, GPU, audio y datos persistentes. Imagen multiarquitectura publicada en GitHub Packages.
---

# Instalación con Docker

CubicLauncher se publica como imagen de contenedor multiarquitectura en GitHub Packages para `linux/amd64` y `linux/arm64`.

- Repositorio: [CubicLauncher](https://github.com/CubicLauncherDevs/CubicLauncher)
- Imagen: [ghcr.io/cubiclauncherdevs/cubiclauncher](https://github.com/CubicLauncherDevs/CubicLauncher/pkgs/container/cubiclauncher)

:::info Aplicación de escritorio
CubicLauncher necesita acceder al servidor gráfico del host. El contenedor no incluye un entorno de escritorio ni un servidor X11 o Wayland propio.
:::

## Requisitos

- Docker instalado en el host.
- Un servidor gráfico X11 o Wayland en funcionamiento.
- Acceso a `/dev/dri` para la aceleración gráfica.
- Un volumen o carpeta para conservar los datos de `~/.cubic`.

## Obtener la imagen

```bash
docker pull ghcr.io/cubiclauncherdevs/cubiclauncher:latest
```

Las etiquetas publicadas son la versión completa (`36.0.1`), la versión menor (`36.0`), la mayor (`36`) y `latest`. `latest` solo apunta al release estable más reciente; las versiones preliminares únicamente reciben su propia etiqueta.

## Ejecutar con X11

Permite que tu usuario local se conecte al servidor X11 y arranca el contenedor:

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

Cuando termines, puedes revocar el permiso:

```bash
xhost -si:localuser:$(id -un)
```

## Ejecutar con Wayland

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

## Datos persistentes

El volumen `cubic-data` conserva `~/.cubic`: las instancias, los ajustes y el JRE que descarga el launcher.

Para usar los datos de tu usuario en el host, monta la carpeta directamente:

```bash
-v "$HOME/.cubic:/data/.cubic"
```

La imagen funciona con cualquier UID mediante `--user`, pero el directorio `/data` debe ser escribible por ese UID. El volumen se crea con permisos `1777`.

## NVIDIA

Si usas una GPU NVIDIA, instala `nvidia-container-toolkit` y añade `--gpus all` al comando de X11 o Wayland.

Si la interfaz aparece en blanco, prueba a desactivar el renderizador DMA-BUF de WebKit:

```bash
-e WEBKIT_DISABLE_DMABUF_RENDERER=1
```

## Audio

Para PulseAudio, monta el socket del servidor y define `PULSE_SERVER` según tu configuración. Para ALSA, añade el dispositivo de sonido:

```bash
--device /dev/snd
```

## Limitaciones

- El actualizador integrado no funciona dentro del contenedor. Para actualizar, descarga la nueva etiqueta de la imagen.
- El contenedor no instala los controladores gráficos del host; debes configurarlos en el sistema anfitrión.
- Si WebKit falla al iniciar por el sandbox, prueba `--security-opt seccomp=unconfined`.

## Compilar la imagen localmente

Desde la raíz del repositorio:

```bash
docker build -t cubiclauncher .
```

El workflow `.github/workflows/docker.yml` publica la imagen al crear un tag `v*`. Para publicar el último release manualmente, ejecuta **Actions → Docker Image → Run workflow** y deja el campo `tag` vacío; se resolverá automáticamente el último release estable. Si indicas una etiqueta concreta que no sea el último release, `latest` no se moverá.
