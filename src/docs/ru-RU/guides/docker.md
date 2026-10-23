---
category: getting-started
order: 50
title: Установка с Docker
description: Запустите CubicLauncher в контейнере Docker с X11 или Wayland, GPU, звуком и постоянным хранилищем данных. Мультиархитектурный образ опубликован на GitHub Packages.
---

# Установка с Docker

CubicLauncher публикуется как мультиархитектурный образ контейнера на GitHub Packages для `linux/amd64` и `linux/arm64`.

- Репозиторий: [CubicLauncher](https://github.com/CubicLauncherDevs/CubicLauncher)
- Образ: [ghcr.io/cubiclauncherdevs/cubiclauncher](https://github.com/CubicLauncherDevs/CubicLauncher/pkgs/container/cubiclauncher)

:::info Настольное приложение
CubicLauncher должен иметь доступ к графическому серверу хоста. Контейнер не содержит рабочего окружения и собственного сервера X11 или Wayland.
:::

## Требования

- Docker, установленный на хосте.
- Работающий графический сервер X11 или Wayland.
- Доступ к `/dev/dri` для аппаратного ускорения.
- Том или папка для хранения данных `~/.cubic`.

## Получение образа

```bash
docker pull ghcr.io/cubiclauncherdevs/cubiclauncher:latest
```

Публикуемые теги: полная версия (`36.0.1`), минорная версия (`36.0`), мажорная версия (`36`) и `latest`. `latest` указывает только на последний стабильный релиз; предварительные версии получают только собственный тег.

## Запуск с X11

Разрешите локальному пользователю подключаться к серверу X11 и запустите контейнер:

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

После завершения можно отозвать разрешение:

```bash
xhost -si:localuser:$(id -un)
```

## Запуск с Wayland

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

## Постоянные данные

Том `cubic-data` сохраняет `~/.cubic`: экземпляры, настройки и JRE, загруженную лаунчером.

Чтобы использовать данные вашего пользователя на хосте, смонтируйте папку напрямую:

```bash
-v "$HOME/.cubic:/data/.cubic"
```

Образ работает с любым UID благодаря `--user`, но каталог `/data` должен быть доступен для записи этому UID. Том создаётся с правами `1777`.

## NVIDIA

Если вы используете GPU NVIDIA, установите `nvidia-container-toolkit` и добавьте `--gpus all` в команду для X11 или Wayland.

Если интерфейс отображается пустым, попробуйте отключить рендерер DMA-BUF в WebKit:

```bash
-e WEBKIT_DISABLE_DMABUF_RENDERER=1
```

## Звук

Для PulseAudio смонтируйте сокет сервера и задайте `PULSE_SERVER` в соответствии с вашей конфигурацией. Для ALSA добавьте звуковое устройство:

```bash
--device /dev/snd
```

## Ограничения

- Встроенное средство обновления не работает внутри контейнера. Для обновления загрузите новый тег образа.
- Контейнер не устанавливает графические драйверы хоста; настройте их в хост-системе.
- Если WebKit не запускается из-за sandbox, попробуйте `--security-opt seccomp=unconfined`.

## Локальная сборка образа

Из корня репозитория:

```bash
docker build -t cubiclauncher .
```

Workflow `.github/workflows/docker.yml` публикует образ при создании тега `v*`. Чтобы вручную опубликовать последний релиз, запустите **Actions → Docker Image → Run workflow** и оставьте поле `tag` пустым; последний стабильный релиз будет определён автоматически. Если указать конкретный тег, не являющийся последним релизом, `latest` не будет перемещён.
