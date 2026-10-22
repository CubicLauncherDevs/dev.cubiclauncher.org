---
category: development
order: 20
title: Локальная разработка
description: Требования, команды и рабочий процесс для сборки, тестирования и участия в разработке CubicLauncher.
---

# Локальная разработка

Это руководство описывает, как настроить полноценную среду разработки CubicLauncher, внутреннюю организацию репозитория и ожидаемый процесс работы над кодом.

:::related
- [Архитектура](/docs/ru-RU/Advanced/architecture)
- [Участие в разработке](/docs/ru-RU/Advanced/contributing)
- [Версионирование и релизы](/docs/ru-RU/Advanced/versioning)
- [Руководство по Nix](/docs/ru-RU/guides/nix)
:::

## Требования

| Инструмент | Версия / примечания |
|------|-----------------|
| [Git](https://git-scm.com/) | Любая современная версия |
| [Bun](https://bun.sh/) | Для установки зависимостей и запуска скриптов проекта |
| [Node.js](https://nodejs.org/) | Актуальная LTS-версия (резервный вариант для Bun) |
| [Rust](https://www.rust-lang.org/tools/install) | >= 1.85, с поддержкой редакции 2024, а также Cargo, `rustfmt` и Clippy |
| Tauri v2 | Системные зависимости для вашей платформы ([официальное руководство](https://v2.tauri.app/start/prerequisites/)) |

Tauri CLI входит в зависимости проекта и устанавливается автоматически вместе с `bun install`; отдельно устанавливать его не нужно.

## Локальная среда

```bash
git clone https://github.com/CubicLauncherDevs/CubicLauncher.git
cd CubicLauncher
bun install --frozen-lockfile
bun run tauri dev
```

`bun run tauri dev` параллельно запускает настольное приложение и сервер разработки фронтенда с горячей перезагрузкой. Чтобы работать только с интерфейсом, `bun run dev` запускает один Vite; учитывайте, что функции, зависящие от бэкенда (инстансы, загрузки, аутентификация), в этом режиме будут недоступны.

### Среда Nix

В NixOS или при установленном Nix flake репозитория включает `devShell` со всеми необходимыми зависимостями (Bun, Rust, `cargo-tauri`, GTK3, WebKitGTK, GStreamer и другие):

```bash
nix develop
bun install --frozen-lockfile
bun run tauri dev
```

Подробнее об упаковке и устранении неполадок см. в [руководстве по Nix](/docs/ru-RU/guides/nix).

## Основные команды

Все команды выполняются из корня репозитория.

| Команда | Описание |
|---------|-------------|
| `bun run tauri dev` | Запускает настольное приложение в режиме разработки. |
| `bun run dev` | Запускает сервер фронтенда Vite. |
| `bun run tauri build` | Собирает и упаковывает приложение для текущей платформы. |
| `bun run build` | Создаёт production-сборку фронтенда. |
| `bun run lint` | Запускает ESLint для фронтенда. |
| `bun run check` | Проверяет типы и диагностику Svelte. |
| `bun run test:frontend` | Запускает тесты фронтенда с помощью Bun. |
| `bun run test:rust` | Запускает тесты и doctests рабочего пространства Rust. |
| `bun run test:all` | Запускает наборы тестов фронтенда и Rust. |
| `cargo fmt --all --check` | Проверяет форматирование кода Rust. |
| `cargo clippy --workspace -- -D warnings` | Запускает статический анализ рабочего пространства Rust. |

:::tip Быстрая сборка для проверки изменений бэкенда
Если вы хотите только проверить изменения в Rust без упаковки установщиков, `cargo build` в каталоге `src-tauri/` создаёт отладочный бинарный файл гораздо быстрее, чем `bun run tauri build`.
:::

## Структура репозитория

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

Бэкенд организован как рабочее пространство внутренних крейтов, которые инкапсулируют независимые домены (инстансы, загрузки, управление Java, аутентификация и т. д.). Это позволяет тестировать каждый сервис изолированно и переиспользовать его в разных бинарниках.

## Тестирование

Проект поддерживает отдельные наборы тестов для фронтенда и бэкенда:

- **Фронтенд (`tests/frontend/`):** модульные и интеграционные тесты, выполняемые с Bun. Руководство по тестированию описывает требования к Chromium для браузерных тестов, измерения производительности и сценарии ручной проверки.
- **Rust (`src-tauri/src/tests/` и `crates/<crate>/src/tests/`):** модульные тесты и doctests для каждого крейта, выполняемые через Cargo.

Перед открытием pull request запустите `bun run test:all`, чтобы проверить оба набора.

## Рекомендуемый процесс

1. **Форк и ветка:** сделайте форк репозитория и создайте описательную ветку от `develop`:
   ```bash
   git checkout develop
   git pull
   git checkout -b feat/name-of-the-change
   ```
2. **Атомарные коммиты:** делайте изменения небольшими и целенаправленными, а сообщения коммитов — описывающими суть изменения.
3. **Локальная проверка:** перед открытием PR убедитесь, что все проверки проходят:
   ```bash
   bun run lint
   bun run check
   bun run test:all
   cargo fmt --all --check
   cargo clippy --workspace -- -D warnings
   ```
4. **Pull request:** откройте PR в `develop`, чётко описав решаемую проблему и, если применимо, сославшись на связанный issue.
5. **Ревью:** сопровождающий рассмотрит изменение. Отвечайте на комментарии новыми коммитами в той же ветке; избегайте force-push, если об этом не попросят.

## Соглашения о коде

- **Rust:** форматирование применяется через `rustfmt`, статический анализ — через Clippy; оба запускаются в CI с `-D warnings`, поэтому любое предупреждение блокирует интеграцию.
- **TypeScript / Svelte:** фронтенд следует правилам ESLint и конфигурации `svelte-check` репозитория.
- **Комментарии и именование:** идентификаторы и комментарии рекомендуется писать на английском языке, следуя стилю, уже принятому в кодовой базе.

:::warning Блокирующий CI
Проверки форматирования, линтов и тестов выполняются в непрерывной интеграции GitHub Actions. PR не перейдёт к полному ревью, пока все проверки не станут зелёными.
:::

## Ресурсы для участников

- [CONTRIBUTING.md](https://github.com/CubicLauncherDevs/CubicLauncher/blob/develop/CONTRIBUTING.md) — соглашения проекта и процесс участия.
- [TESTING.md](https://github.com/CubicLauncherDevs/CubicLauncher/blob/develop/TESTING.md) — руководство по тестированию, требования к Chromium и ручная проверка.
- [Кодекс поведения](https://github.com/CubicLauncherDevs/CubicLauncher/blob/develop/CODE_OF_CONDUCT.md) — правила участия в сообществе.
- [Репозиторий переводов](https://github.com/CubicLauncherDevs/Translations) — инструкции по интернационализации.
- [Статус сервисов](https://dev.cubiclauncher.org/) — доступность API проекта.
- [Статус зависимостей Rust](https://deps.rs/repo/github/cubiclauncherdevs/cubiclauncher?path=src-tauri) — отчёт о зависимостях бэкенда.

## Устранение неполадок

### `bun run tauri dev` не запускается

Убедитесь, что вы установили системные зависимости Tauri v2 для вашей платформы. В Linux это обычно пакеты разработки WebKitGTK и GTK3; в Windows — Visual Studio Build Tools и WebView2 Runtime.

### Ошибки компиляции Rust после обновления инструментов

Убедитесь, что вы используете стабильный канал с поддержкой редакции 2024, и обновите зависимости lockfile:

```bash
rustup update stable
bun install --frozen-lockfile
```

### Интерфейс не показывает данные бэкенда

Если вы запустили только фронтенд с помощью `bun run dev`, функции, зависящие от Tauri (IPC), недоступны. Запустите приложение целиком с `bun run tauri dev`.
