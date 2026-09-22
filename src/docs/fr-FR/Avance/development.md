---
title: Développement local
description: Prérequis, commandes et flux de travail pour compiler, tester et contribuer à CubicLauncher.
---

# Développement local

Ce guide décrit comment préparer un environnement de développement complet de CubicLauncher, l'organisation interne du dépôt et le flux de travail attendu pour les contributions de code.

:::related
- [Architecture](/docs/fr-FR/Avance/architecture)
- [Contribuer](/docs/fr-FR/Avance/contribuer)
- [Versionnement et publications](/docs/fr-FR/Avance/versionnement)
- [Guide Nix](/docs/fr-FR/guides/nix)
:::

## Prérequis

| Outil | Version / notes |
|-------|-----------------|
| [Git](https://git-scm.com/) | Toute version récente |
| [Bun](https://bun.sh/) | Pour installer les dépendances et exécuter les scripts du projet |
| [Node.js](https://nodejs.org/) | Une version LTS en vigueur (solution de repli pour Bun) |
| [Rust](https://www.rust-lang.org/tools/install) | Stable, avec prise en charge de l'édition 2024, ainsi que Cargo, `rustfmt` et Clippy |
| Tauri v2 | Dépendances système selon votre plateforme ([guide officiel](https://v2.tauri.app/start/prerequisites/)) |

La CLI de Tauri fait partie des dépendances du projet et s'installe automatiquement avec `bun install` ; il n'est pas nécessaire de l'installer séparément.

## Environnement local

```bash
git clone https://github.com/CubicLauncherDevs/CubicLauncher.git
cd CubicLauncher
bun install --frozen-lockfile
bun run tauri dev
```

`bun run tauri dev` démarre l'application de bureau et le serveur de développement du frontend en parallèle, avec rechargement à chaud. Pour travailler uniquement sur l'interface, `bun run dev` lance seulement Vite ; gardez à l'esprit que les fonctionnalités qui dépendent du backend (instances, téléchargements, authentification) ne seront pas disponibles dans ce mode.

### Environnement avec Nix

Sur NixOS ou avec Nix installé, le flake du dépôt inclut un `devShell` avec toutes les dépendances nécessaires (Bun, Rust, `cargo-tauri`, GTK3, WebKitGTK, GStreamer, entre autres) :

```bash
nix develop
bun install --frozen-lockfile
bun run tauri dev
```

Consultez le [guide Nix](/docs/fr-FR/guides/nix) pour plus de détails sur l'empaquetage et le dépannage.

## Commandes principales

Toutes les commandes s'exécutent depuis la racine du dépôt.

| Commande | Description |
|----------|-------------|
| `bun run tauri dev` | Démarre l'application de bureau en mode développement. |
| `bun run dev` | Démarre le serveur Vite du frontend. |
| `bun run tauri build` | Compile et empaquète l'application pour la plateforme actuelle. |
| `bun run build` | Génère la compilation de production du frontend. |
| `bun run lint` | Exécute ESLint sur le frontend. |
| `bun run check` | Vérifie les types et les diagnostics Svelte. |
| `bun run test:frontend` | Exécute les tests du frontend avec Bun. |
| `bun run test:rust` | Exécute les tests et doctests du workspace Rust. |
| `bun run test:all` | Exécute les suites du frontend et de Rust. |
| `cargo fmt --all --check` | Vérifie le formatage du code Rust. |
| `cargo clippy --workspace -- -D warnings` | Exécute l'analyse statique du workspace Rust. |

:::tip Compilation rapide pour tester des changements du backend
Si vous souhaitez seulement valider des changements Rust sans empaqueter d'installateurs, `cargo build` dans `src-tauri/` produit un binaire de développement bien plus rapidement que `bun run tauri build`.
:::

## Structure du dépôt

```
src/                  # Interface, état et services du frontend
src-tauri/            # Application Tauri, commandes et services natifs
  src/tests/          # Tests unitaires du backend de l'application
crates/               # Bibliothèques internes du workspace Rust
  <crate>/src/tests/  # Tests unitaires de chaque bibliothèque avec leurs propres suites
tests/frontend/       # Tests du frontend regroupés par domaine
static/               # Ressources statiques de l'interface
dist/                 # Fichiers d'empaquetage pour les distributions
.github/              # Intégration continue et flux de publication
```

Le backend est organisé comme un workspace de crates internes qui encapsulent des domaines indépendants (instances, téléchargements, gestion de Java, authentification, etc.). Cela permet de tester chaque service de manière isolée et de le réutiliser entre les binaires.

## Tests

Le projet maintient des suites séparées pour le frontend et le backend :

- **Frontend (`tests/frontend/`) :** tests unitaires et d'intégration exécutés avec Bun. Le guide de tests documente les exigences de Chromium pour les tests de navigateur, les mesures de performance et les flux de vérification manuelle.
- **Rust (`src-tauri/src/tests/` et `crates/<crate>/src/tests/`) :** tests unitaires et doctests par crate, exécutés avec Cargo.

Avant d'ouvrir une pull request, exécutez `bun run test:all` pour valider les deux suites.

## Flux de travail recommandé

1. **Fork et branche :** créez un fork du dépôt et une branche descriptive depuis `main` :
   ```bash
   git checkout -b feat/nom-du-changement
   ```
2. **Commits atomiques :** gardez des changements petits et ciblés, avec des messages décrivant l'intention du changement.
3. **Validation locale :** avant d'ouvrir la PR, assurez-vous que toutes les vérifications passent :
   ```bash
   bun run lint
   bun run check
   bun run test:all
   cargo fmt --all --check
   cargo clippy --workspace -- -D warnings
   ```
4. **Pull request :** ouvrez la PR contre `main` en décrivant clairement le problème qu'elle résout et, le cas échéant, en liant l'issue associée.
5. **Révision :** un mainteneur examinera le changement. Répondez aux commentaires avec de nouveaux commits sur la même branche ; évitez de forcer l'historique sauf demande explicite.

## Conventions de code

- **Rust :** le formatage est appliqué avec `rustfmt` et l'analyse statique avec Clippy ; les deux s'exécutent en CI avec `-D warnings`, donc tout avertissement bloque l'intégration.
- **TypeScript / Svelte :** le frontend suit les règles ESLint et la configuration `svelte-check` du dépôt.
- **Commentaires et nommage :** il est recommandé d'écrire les identifiants et les commentaires en anglais, en suivant le style déjà présent dans le code.

:::warning CI bloquante
Les vérifications de formatage, de lints et de tests s'exécutent dans l'intégration continue de GitHub Actions. Une PR ne passera pas en revue complète tant que tous les checks ne sont pas au vert.
:::

## Ressources pour les contributeurs

- [CONTRIBUTING.md](https://github.com/CubicLauncherDevs/CubicLauncher/blob/develop/CONTRIBUTING.md) — conventions du projet et processus de contribution.
- [TESTING.md](https://github.com/CubicLauncherDevs/CubicLauncher/blob/develop/TESTING.md) — guide de tests, exigences de Chromium et vérification manuelle.
- [Code de conduite](https://github.com/CubicLauncherDevs/CubicLauncher/blob/develop/CODE_OF_CONDUCT.md) — règles de participation à la communauté.
- [Dépôt des traductions](https://github.com/CubicLauncherDevs/Translations) — instructions d'internationalisation.
- [État des services](https://dev.cubiclauncher.org/) — disponibilité des API du projet.
- [État des dépendances Rust](https://deps.rs/repo/github/cubiclauncherdevs/cubiclauncher?path=src-tauri) — rapport des dépendances du backend.

## Dépannage

### `bun run tauri dev` ne démarre pas

Vérifiez que vous avez installé les dépendances système de Tauri v2 pour votre plateforme. Sur Linux, il s'agit généralement des paquets de développement WebKitGTK et GTK3 ; sur Windows, des Build Tools de Visual Studio et du runtime WebView2.

### Erreurs de compilation Rust après une mise à jour du toolchain

Assurez-vous d'être sur le canal stable avec prise en charge de l'édition 2024 et mettez à jour les dépendances du lockfile :

```bash
rustup update stable
bun install --frozen-lockfile
```

### L'interface n'affiche aucune donnée du backend

Si vous avez démarré uniquement le frontend avec `bun run dev`, les fonctionnalités qui dépendent de Tauri (IPC) ne sont pas disponibles. Lancez l'application complète avec `bun run tauri dev`.
