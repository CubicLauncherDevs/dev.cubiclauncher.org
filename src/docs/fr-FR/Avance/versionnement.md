---
category: development
order: 40
title: Versionnement et publications
description: Schéma de versions séquentiel, canaux de mise à jour et processus de publication en deux étapes.
---

# Versionnement et publications

CubicLauncher utilise un schéma **séquentiel simple** :

- **Major** — un nombre entier qui augmente à chaque release (27, 28, 29…).
- **Patch** — révisions ou correctifs sur un même major.

En interne, il utilise semver (`MAJOR.MINOR.PATCH`) car l'updater de Tauri l'exige. `MINOR` vaut toujours `0`.

| Visible par l'utilisateur | Semver interne |
| --- | --- |
| `27` | `27.0.0` |
| `27 rev 1` | `27.0.1` |
| `27 rev 2` | `27.0.2` |
| `28` | `28.0.0` |

Si `PATCH` vaut `0`, seul le major est affiché. S'il est supérieur à `0`, il est affiché sous la forme `major rev patch`.

## Canaux de mise à jour

- **Stable** — recommandé pour la plupart des utilisateurs. Ne reçoit que les releases publiées.
- **Pré-version** — alpha, beta et rc ; peut inclure des changements instables.

Le canal se choisit dans **Paramètres → Launcher → Mises à jour**.

## Versionnement des pré-versions

Le suffixe de pré-version doit correspondre dans `package.json`, `src-tauri/Cargo.toml` et `src-tauri/tauri.conf.json`, y compris le titre de la fenêtre. Par exemple, une beta `36.0.0-beta.1` doit apparaître ainsi dans les trois fichiers. Si `tauri.conf.json` indique `36.0.0`, l'updater l'interprète comme une version finale et rejette les betas suivantes du même major.

La CI et les builds de release vérifient cette correspondance. Les builds par tag vérifient aussi que le tag est `v` suivi de la version empaquetée.

## Processus de publication

La publication se fait en deux étapes pour ne pas distribuer de binaires non révisés.

### 1. Créer le tag

Avant de taguer :

1. Synchronisez la version dans `package.json`, `src-tauri/Cargo.toml` et `src-tauri/tauri.conf.json` (y compris le titre de la fenêtre).
2. Mettez à jour le `Cargo.lock` à la racine et vérifiez depuis la racine :
   ```bash
   cargo update --workspace --offline
   cargo clippy --workspace --locked -- -D warnings
   ```
   Si des dépendances manquent dans le cache local, exécutez la première commande sans `--offline`. Incluez le lockfile mis à jour dans le même commit que le changement de version.
3. Exécutez la vérification des métadonnées :
   ```bash
   bun test --conditions=browser ./tests/frontend/ui/versionMetadata.test.mjs
   ```
4. Créez et poussez le tag :
   ```bash
   git tag v36.0.1
   git push origin v36.0.1
   ```

Pour les pré-versions :

```bash
git tag v36.0.1-beta.1
git push origin v36.0.1-beta.1
```

### 2. Attendre le brouillon

Lorsque le tag est poussé, le workflow `Build Release Draft` (ou `Build Prerelease Draft`) compile Linux, Windows et macOS et envoie les binaires dans un **Release Draft** GitHub avec des notes générées automatiquement. La release n'est pas encore **publique**.

### 3. Réviser et publier

Une fois le brouillon complet, exécutez manuellement le workflow `Publish Release` depuis GitHub Actions en indiquant le tag. C'est seulement alors que la release devient publique et que l'updater de Tauri la distribue.

Les pré-versions suivent le même processus mais sont marquées comme pré-version. Un push sur `develop` génère des artefacts de CI sans créer de release publique ni de nouvelle version.
