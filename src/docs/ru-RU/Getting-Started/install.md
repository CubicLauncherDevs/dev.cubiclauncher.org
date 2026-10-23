---
category: getting-started
order: 20
title: Установка
description: Установите CubicLauncher в Windows, Linux, macOS, Nix/NixOS и Docker. Следуйте инструкциям для вашей операционной системы, чтобы начать.
---

# Установка

Установка CubicLauncher — простой процесс. Следуйте инструкциям для вашей операционной системы, чтобы начать.

## Требования

CubicLauncher не требует установленной Java для запуска, но она нужна для игры в Minecraft. Вы можете использовать управляемые JRE лаунчера или настроить внешнюю. См. [Что такое Java](/docs/ru-RU/Usage/java).

Как правило, CubicLauncher может устанавливать и обнаруживать Java 8, 17, 21 и 25:

- **Java 8** для старых версий Minecraft.
- **Java 17** для современных версий, которые её требуют.
- **Java 21** для самых последних версий.
- **Java 25** для версий или загрузчиков, которые её запрашивают.

:::tip Совет
CubicLauncher не требует установленной в системе Java для работы, но Java нужна для игры в Minecraft.
:::

## Windows

1. Загрузите установщик `.exe` или `.msi` со страницы загрузок.
2. Запустите файл и следуйте шагам установщика.
3. После завершения CubicLauncher будет готов к работе на рабочем столе.

## Linux

Мы поддерживаем несколько форматов на Linux:

- **RPM:** загрузите, выдайте права на выполнение и откройте.
- **AppImage:** загрузите, выдайте права на выполнение и откройте.
- **Debian/Ubuntu:** установите пакет `.deb` с помощью `sudo apt install ./cubiclauncher.deb`.
- **ARCH PKGBUILD:** требуется локальная компиляция. Бинарные файлы, созданные в GitHub CI (Ubuntu), могут быть несовместимы с Arch Linux из-за его модели непрерывных обновлений. <a href="/docs/ru-RU/guides/arch" class="text-blue-400 hover:underline">Руководство</a>.
- **Nix/NixOS:** установите последний стабильный канал с помощью `nix profile add github:CubicLauncherDevs/CubicLauncher/latest-release`. При желании настройте кэш Cachix с помощью `nix run nixpkgs#cachix -- use cubiclauncher`. <a href="/docs/ru-RU/guides/nix" class="text-blue-400 hover:underline">Руководство</a>.
- **Docker:** загрузите мультиархитектурный образ с помощью `docker pull ghcr.io/cubiclauncherdevs/cubiclauncher:latest` и запустите его с доступом к X11 или Wayland, GPU и томом данных. <a href="/docs/ru-RU/guides/docker" class="text-blue-400 hover:underline">Руководство</a>.

### NVIDIA и Wayland: пустые окна или сбои

Если лаунчер остаётся пустым, мерцает или падает при изменении размера окна, см. [Проблемы с графикой в Linux: NVIDIA и Wayland](/docs/ru-RU/guides/nvidia-wayland). В руководстве объясняются `WEBKIT_DISABLE_COMPOSITING_MODE=1 cubiclauncher`, альтернативы WebKitGTK и способы применить обходное решение к ярлыку на рабочем столе.

## macOS

1. Загрузите соответствующий файл (`.dmg`, `x64.dmg`, `.app.tar.gz` или `x64.app.tar.gz`).
2. Если вы загрузили `.dmg` или `x64.dmg`, откройте его и перетащите **CubicLauncher** в папку «Программы».
3. Если вы загрузили `.app.tar.gz` или `x64.app.tar.gz`, распакуйте его и переместите **CubicLauncher.app** в папку «Программы».
4. При первом открытии может потребоваться разрешить запуск в разделе **Системные настройки > Защита и безопасность**.
