---
category: getting-started
order: 40
title: Установка в Nix
description: CubicLauncher публикует пакеты для Linux x86_64 и ARM64. Nix скачивает двоичный файл из Cachix, когда он доступен; в противном случае он компилирует локально.
---

## Предварительные требования

Вам нужен Nix с включёнными `flakes` и `nix-command`.

В NixOS добавьте следующее в `configuration.nix`:

```nix
nix.settings.experimental-features = [ "nix-command" "flakes" ];
```

В других дистрибутивах добавьте эти строки в `/etc/nix/nix.conf` (или `~/.config/nix/nix.conf`):

```text
experimental-features = nix-command flakes
```

Перезапустите демон Nix при необходимости и проверьте, что команды flake работают:

```bash
nix --version
nix flake show github:CubicLauncherDevs/CubicLauncher
```

## Установка с помощью Nix Flakes без настройки Cachix

CubicLauncher публикует пакеты для Linux x86_64 и ARM64. Nix скачивает двоичный файл из Cachix, когда он доступен; в противном случае он компилирует локально.

Эти команды используют flake напрямую. Если у вас не настроен кэш двоичных файлов, Nix скомпилирует пакет на вашей машине.

Установите предпочитаемый канал:

### Последняя стабильная версия

```bash
nix profile add github:CubicLauncherDevs/CubicLauncher/latest-release
```

### Последняя бета

```bash
nix profile add github:CubicLauncherDevs/CubicLauncher/latest-beta
```

Двоичный файл будет доступен как `cubiclauncher` в вашем `PATH`.

## Выбор конкретной версии

Замените `TAG` на тег версии, опубликованной в [GitHub Releases](https://github.com/CubicLauncherDevs/CubicLauncher/releases):

```bash
nix profile add github:CubicLauncherDevs/CubicLauncher/TAG
```

## Необязательно: скачивание предварительно скомпилированных двоичных файлов с помощью Cachix

Настройте публичный кэш один раз:

```bash
nix run nixpkgs#cachix -- use cubiclauncher
```

После настройки кэш позволяет скачивать опубликованные двоичные файлы, если для вашей ревизии и архитектуры есть сборка.

## Использование CubicLauncher из вашего flake NixOS

Добавьте CubicLauncher как вход flake и передайте его в модуль NixOS. Чтобы использовать бета-версию, замените `latest-release` на `latest-beta`.

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

## Включение Cachix в NixOS

Добавьте кэш и его публичный ключ в конфигурацию NixOS:

```nix
nix.settings = {
  extra-substituters = [ "https://cubiclauncher.cachix.org" ];
  extra-trusted-public-keys = [
    "cubiclauncher.cachix.org-1:tBeOuLW/CLlkYAH0AB+DNio4XNZOGVMHvQHVuQSqhcA="
  ];
};
```

Примените конфигурацию и затем установите CubicLauncher одной из команд профиля выше:

```bash
sudo nixos-rebuild switch
nix profile add github:CubicLauncherDevs/CubicLauncher/latest-release
```

Кэш проекта предоставляет сборки для Linux x86_64 и ARM64. На других платформах Nix может скомпилировать пакет локально.

## Запуск без установки

Вы можете запустить CubicLauncher прямо из flake, не устанавливая его:

```bash
nix run github:CubicLauncherDevs/CubicLauncher/latest-release
```

## Локальная сборка

Вы также можете собрать пакет вручную:

```bash
nix build .
ls -la result/bin
```

Скомпилированный двоичный файл будет находиться в `result/bin/cubiclauncher`.

## Среда разработки

Если вы хотите участвовать в разработке CubicLauncher или разрабатывать его, flake включает `devShell` со всеми необходимыми зависимостями:

```bash
nix develop
bun install
bun run tauri dev
```

Среда включает `bun`, `rustc`, `cargo`, `cargo-tauri`, GTK3, WebKitGTK, GStreamer и другие инструменты.

В Linux devShell привязывает Mesa, EGL, GBM и Wayland к той же ревизии Nixpkgs, что и glibc компилятора (закреплённой в `flake.lock`), и автоматически определяет NVIDIA на Wayland. Вы можете принудительно включить или отключить программный рендеринг WebKitGTK с помощью `CUBICLAUNCHER_WEBKIT_SOFTWARE=1` или `CUBICLAUNCHER_WEBKIT_SOFTWARE=0`.

При использовании проприетарного драйвера NVIDIA, если системные драйверы требуют более новой glibc, используйте системный Nixpkgs в среде разработки:

```bash
nix develop --override-input nixpkgs nixpkgs --no-write-lock-file
```

Дополнительные сведения см. в [руководстве по разработке](/docs/ru-RU/Advanced/development).

## Обновление

Если вы установили из канала, обновляйте, сохраняя его. Найдите имя записи и обновите её:

```bash
nix profile list
nix profile upgrade --refresh <name>
```

Вы также можете переустановить, чтобы заменить текущую версию:

```bash
nix profile add github:CubicLauncherDevs/CubicLauncher/latest-release
```

:::warning Самообновление отключено
Артефакты обновления отключаются при упаковке для Nix, поскольку лаунчер следует обновлять через Nix.
:::

## Устранение неполадок

### `error: the group 'nixbld' specified in 'build-users-group' does not exist`

Эта ошибка возникает, когда Nix установлен в многопользовательском режиме, но группа `nixbld`, используемая демоном для сборок, не существует. Чтобы исправить это, запустите скрипт из репозитория от имени root:

```bash
git clone https://github.com/CubicLauncherDevs/CubicLauncher.git
cd CubicLauncher
sudo ./dist/nix/setup-nix-build-users.sh
```

Затем повторите попытку:

```bash
nix run github:CubicLauncherDevs/CubicLauncher
# or
nix develop
```

:::warning ВНИМАНИЕ
Эта проблема не связана с CubicLauncher; это ошибка конфигурации вашей установки Nix.
:::

### `EGL_BAD_PARAMETER` при запуске

Эта ошибка появляется, когда EGL выбирает Mesa из `/run/opengl-driver`, собранную против другой glibc, чем та, что используется flake. devShell и установленный пакет привязывают Mesa, EGL, GBM и Wayland к той же ревизии Nixpkgs, что и glibc компилятора. Повторно войдите в оболочку или используйте системный Nixpkgs:

```bash
nix develop --override-input nixpkgs nixpkgs --no-write-lock-file
```

:::details Упаковка и публикация (мейнтейнеры)
Flake предоставляет пакет, `devShell`, форматтер и базовую проверку. Упаковка находится в `dist/nix/` (`flake.nix`, `flake.lock` и `package.nix`).

**Публикация в Cachix.** Рабочий процесс `.github/workflows/nix-cache.yml` собирает и публикует пакет для Linux x86_64 и ARM64. Он запускается при публикации релиза, по завершении рабочего процесса *Publish Release* и вручную. Он обновляет перемещаемые теги `latest-release` и `latest-beta` по отдельности.

**`cargoHash`.** Он охватывает дерево зависимостей Rust и зависит от `Cargo.lock` и ревизии nixpkgs, закреплённой в `flake.lock`. При изменении `Cargo.lock` пересоздайте его так:

```bash
nix build --no-link \
  ".#packages.$(nix eval --raw --impure --expr builtins.currentSystem).default.cargoDeps"
```

Скопируйте хэш из строки `got:` в `cargoHash` в `dist/nix/package.nix`. Всегда генерируйте его с помощью `nix build .#...`, чтобы учитывать зафиксированный `flake.lock`.

**Другие архитектуры.** Добавьте систему в `supportedSystems` в `flake.nix` и соответствующий хэш `nodeModules` в `dist/nix/package.nix`.

**Скрипт сборки.** Если у многопользовательского демона нет группы `nixbld`, запустите `sudo ./dist/nix/setup-nix-build-users.sh` из репозитория.
:::
