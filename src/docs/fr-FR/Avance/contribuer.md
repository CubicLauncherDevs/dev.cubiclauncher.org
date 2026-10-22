---
category: development
order: 30
title: Contribuer
description: Comment signaler des problèmes, proposer des changements, envoyer des PR et collaborer aux traductions de CubicLauncher.
---

# Contribuer

Les contributions de code, de documentation, de traduction et les rapports de bugs sont les bienvenues.

## Avant de commencer

- Si le changement est important ou discutable, ouvrez d'abord une issue.
- Travaillez sur une branche propre créée depuis `develop`.
- Faites des commits petits et descriptifs.
- Mettez à jour la documentation si les règles du projet changent.

## Signaler un problème

Ouvrez une issue avec :

- Une description claire du problème.
- Les étapes pour le reproduire.
- La version de CubicLauncher et du système d'exploitation.
- Un lien vers le log sur mclo.gs si applicable.

## Commits

Le format est :

```text
<type>(<portée optionnelle>): <description courte>

[corps optionnel]

[breaking change / référence d'issue]
```

Types courants : `feat`, `fix`, `refactor`, `perf`, `style`, `docs`, `test`, `chore`, `i18n`, et `core` pour le backend Rust.

- Les messages sont en espagnol, à l'infinitif ou à l'impératif.
- La première ligne ne doit pas dépasser 72 caractères.
- Décrivez le **quoi**, pas le **comment**.
- Un commit par changement logique.
- Marquez les changements incompatibles avec `!` ou `BREAKING CHANGE:` dans le corps.

## Flux de pull request

1. Créez une branche depuis `develop`.
2. Implémentez le changement et mettez à jour les tests.
3. Exécutez les vérifications locales :
   ```bash
   bun run lint
   bun run check
   bun run test:all
   cargo fmt --all --check
   cargo clippy --workspace -- -D warnings
   ```
4. Ouvrez la PR contre `develop` et assignez au moins une label.
5. Répondez à la révision avec de nouveaux commits sur la même branche ; évitez de réécrire l'historique sauf demande explicite.

## Labels de PR

| Label | Utilisation |
| --- | --- |
| `breaking` | Changement qui casse la compatibilité. |
| `feature` | Nouvelle fonctionnalité visible. |
| `core` | Backend Rust. |
| `ui` | Changements visuels en Svelte ou CSS. |
| `i18n` | Traductions ou fichiers de langue. |
| `bug` / `fix` / `patch` | Corrections. |
| `perf` | Performances. |
| `test` | Tests. |
| `docs` | Documentation. |
| `chore` / `refactor` / `deps` / `ci` | Maintenance. |
| `ignore-for-release` | Ne doit pas apparaître dans le changelog. |

## Conventions de code

- **Rust** : `rustfmt` et Clippy sans avertissement. Les erreurs sont sérialisées en `{"code":"...","params":{...}}` pour l'i18n.
- **Svelte/TypeScript** : runes de Svelte 5, pas de `any`, `key` dans les blocs `{#each}` et `$derived` pour les valeurs calculées.
- **CI** : formatage, lints et tests s'exécutent sur GitHub Actions ; une PR ne passe pas en révision complète tant que tout n'est pas au vert.

## Traductions

Les traductions sont maintenues dans [CubicLauncherDevs/Translations](https://github.com/CubicLauncherDevs/Translations). Le launcher inclut `es-ES` et `en-US` comme solutions de repli locales.

Pour ajouter une nouvelle clé :

1. Ajoutez-la dans `src/lib/i18n/en-US.json` et `src/lib/i18n/es-ES.json`.
2. Dans le dépôt de traductions, modifiez `src/locales/*.json`.
3. Incrémentez le champ `version` de chaque langue modifiée.
4. Ajoutez l'entrée dans `src/changelog.json`.
5. Exécutez `bun run build && bun run deploy` dans le Worker.

Pour compléter les clés manquantes par rapport à `en-US`, utilisez `bun run sync-locales` dans le dépôt de traductions.

## Ressources

- [CONTRIBUTING.md](https://github.com/CubicLauncherDevs/CubicLauncher/blob/develop/CONTRIBUTING.md)
- [TESTING.md](https://github.com/CubicLauncherDevs/CubicLauncher/blob/develop/TESTING.md)
- [Code de conduite](https://github.com/CubicLauncherDevs/CubicLauncher/blob/develop/CODE_OF_CONDUCT.md)
- [Dépôt de traductions](https://github.com/CubicLauncherDevs/Translations)
- [Guide de développement local](/docs/fr-FR/Avance/development)
