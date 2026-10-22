---
category: development
order: 10
title: Architecture
description: "Vue d'ensemble de l'architecture de CubicLauncher : Tauri v2, backend Rust, frontend SvelteKit, crates internes, événements et données sur disque."
---

# Architecture

## Composants

- **Application de bureau** : Tauri v2 avec le WebView du système.
- **Backend** : Rust sur Tokio, avec un workspace de crates internes.
- **Interface** : Svelte 5 + SvelteKit + TypeScript, compilée en site statique.

Le frontend envoie des commandes au backend via l'IPC de Tauri. Le backend répond avec des événements `app-event` et des flux de logs ; l'interface les consomme pour mettre à jour les téléchargements, les instances, l'état de lancement et la console.

## Crates du workspace

| Crate | Responsabilité |
| --- | --- |
| `aqua` | Téléchargement des versions de Minecraft, des loaders et des JRE ; manifestes, assets, bibliothèques et fournisseurs de téléchargement. |
| `zellkern` | Modèles du manifeste, résolution des versions, utilitaires Forge, construction des arguments et `LaunchConfig`. |
| `launchwerk` | Préparation et lancement du processus Java, extraction des natives et gestion du cycle de vie. |
| `cubrinth` | Installation des modpacks `.mrpack` et utilitaires associés. |
| `communicator` | Client Discord RPC. |
| `ablage` | Dépôt local avec cache versionné pour les données sérialisées. |
| `src-tauri` | Application Tauri : commandes, services d'instances, paramètres, authentification, file de téléchargements et événements. |

## Structure du dépôt

```
src/                  # Interface, état et services du frontend
src-tauri/            # Application Tauri, commandes et services natifs
  src/tests/          # Tests du backend de l'application
  src/services/       # Instances, téléchargements, Java, launcher, authentification
crates/               # Bibliothèques internes du workspace Rust
  <crate>/src/tests/  # Tests unitaires par crate
tests/frontend/       # Tests du frontend
static/               # Ressources statiques
dist/                 # Empaquetage pour les distributions
.github/              # CI et workflows de publication
```

## Flux de lancement

1. L'interface invoque la commande `launch`.
2. Le service `Launcher` verrouille les fichiers de l'instance et marque l'état comme `Starting`.
3. Les dépendances de version sont vérifiées ; s'il en manque, elles sont mises en file dans `DownloadQueue` et `VersionNotFound` est renvoyé.
4. `aqua` télécharge la version, le loader et le JRE selon les besoins.
5. `zellkern` résout l'héritage du manifeste (Vanilla → loader) et construit les arguments.
6. Le jeton du compte est actualisé et `LaunchConfig` est assemblé avec la RAM, les arguments JVM, les variables d'environnement, l'authentification et Quick Play.
7. `launchwerk` extrait les natives et lance le processus Java ; stdout/stderr est envoyé aux logs et à l'interface.
8. À la fin, l'état revient à `Off`. Si le processus se termine avec un code non nul sans avoir été arrêté depuis le launcher, un crash est détecté et un instantané des logs est conservé pendant une heure.

## Événements et IPC

- Les commandes sont exposées depuis `src-tauri/src/commands/`.
- Les événements sont publiés sur le bus de l'application sous `app-event` et consommés depuis le frontend.
- Les téléchargements émettent séparément la progression, la fin et l'erreur.
- La console combine les lignes en direct, l'historique par instance et les instantanés de crash.

## Données sur disque

Par défaut, tout se trouve sous `~/.cubic/` :

- `instances/<nom>/` — données de chaque instance et son fichier `instance.cub`.
- `shared/` — `versions`, `libraries`, `assets`, `natives` et `runtimes`.
- `settings/settings.cub` — paramètres, comptes et préférences.
- `themes/` — thèmes installés par l'utilisateur.
- `skins/` — vestiaire de skins.

Les chemins `instances` et `shared` peuvent être modifiés depuis **Paramètres → Stockage**. La configuration de ces chemins est stockée dans `settings.cub`.

## Mises à jour

L'updater de Tauri interroge les points de terminaison du projet selon le canal configuré :

- **Stable** — releases publiées.
- **Pré-version** — versions alpha, beta ou rc.

Chaque push sur `develop` génère des artefacts de CI, mais pas de release publique. La publication suit le flux [Versionnement et publications](/docs/fr-FR/Avance/versionnement).
