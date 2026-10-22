---
category: development
order: 30
title: Участие в разработке
description: Как сообщать об ошибках, предлагать изменения, отправлять PR и помогать с переводами в CubicLauncher.
---

# Участие в разработке

Мы рады коду, документации, переводам и сообщениям об ошибках.

## Перед началом

- Если изменение крупное или требует обсуждения, сначала откройте issue.
- Работайте в собственной ветке, созданной от `develop`.
- Делайте небольшие и содержательные коммиты.
- Обновляйте документацию, если меняются правила проекта.

## Сообщение об ошибке

Откройте issue с:

- Чётким описанием проблемы.
- Шагами для воспроизведения.
- Версией CubicLauncher и операционной системы.
- Ссылкой на журнал на mclo.gs, если это применимо.

## Коммиты

Формат:

```text
<type>(<optional scope>): <short description>

[optional body]

[breaking change / issue reference]
```

Основные типы: `feat`, `fix`, `refactor`, `perf`, `style`, `docs`, `test`, `chore`, `i18n` и `core` для бэкенда на Rust.

- Сообщения пишутся на испанском языке в инфинитиве или повелительном наклонении.
- Первая строка не должна превышать 72 символа.
- Описывайте **что**, а не **как**.
- Один коммит на одно логическое изменение.
- Отмечайте ломающие изменения с помощью `!` или `BREAKING CHANGE:` в теле.

## Процесс работы с pull request

1. Создайте ветку от `develop`.
2. Внесите изменение и обновите тесты.
3. Запустите локальные проверки:
   ```bash
   bun run lint
   bun run check
   bun run test:all
   cargo fmt --all --check
   cargo clippy --workspace -- -D warnings
   ```
4. Откройте PR в `develop` и назначьте хотя бы один ярлык.
5. Отвечайте на замечания новыми коммитами в той же ветке; не переписывайте историю без просьбы.

## Ярлыки PR

| Ярлык | Назначение |
| --- | --- |
| `breaking` | Изменение, нарушающее совместимость. |
| `feature` | Новая видимая пользователю функция. |
| `core` | Бэкенд на Rust. |
| `ui` | Визуальные изменения в Svelte или CSS. |
| `i18n` | Переводы или языковые файлы. |
| `bug` / `fix` / `patch` | Исправления. |
| `perf` | Производительность. |
| `test` | Тесты. |
| `docs` | Документация. |
| `chore` / `refactor` / `deps` / `ci` | Поддержка проекта. |
| `ignore-for-release` | Не должен попадать в список изменений. |

## Соглашения о коде

- **Rust**: `rustfmt` и Clippy без предупреждений. Ошибки сериализуются как `{"code":"...","params":{...}}` для i18n.
- **Svelte/TypeScript**: руны Svelte 5, никакого `any`, `key` в блоках `{#each}` и `$derived` для вычисляемых значений.
- **CI**: форматирование, линты и тесты выполняются в GitHub Actions; PR не переходит к полному ревью, пока всё не станет зелёным.

## Переводы

Переводы ведутся в [CubicLauncherDevs/Translations](https://github.com/CubicLauncherDevs/Translations). Лаунчер включает `es-ES` и `en-US` как локальные резервные варианты.

Чтобы добавить новый ключ:

1. Добавьте его в `src/lib/i18n/en-US.json` и `src/lib/i18n/es-ES.json`.
2. В репозитории переводов отредактируйте `src/locales/*.json`.
3. Увеличьте поле `version` каждого изменённого языка.
4. Добавьте запись в `src/changelog.json`.
5. Запустите `bun run build && bun run deploy` в Worker.

Чтобы заполнить отсутствующие ключи относительно `en-US`, используйте `bun run sync-locales` в репозитории переводов.

## Ресурсы

- [CONTRIBUTING.md](https://github.com/CubicLauncherDevs/CubicLauncher/blob/develop/CONTRIBUTING.md)
- [TESTING.md](https://github.com/CubicLauncherDevs/CubicLauncher/blob/develop/TESTING.md)
- [Кодекс поведения](https://github.com/CubicLauncherDevs/CubicLauncher/blob/develop/CODE_OF_CONDUCT.md)
- [Репозиторий переводов](https://github.com/CubicLauncherDevs/Translations)
- [Руководство по локальной разработке](/docs/ru-RU/Advanced/development)
