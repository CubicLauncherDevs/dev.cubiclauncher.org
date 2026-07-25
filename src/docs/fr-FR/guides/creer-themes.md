---
title: Comment créer des thèmes | CubicLauncher
---

CubicLauncher vous permet de personnaliser entièrement l'interface grâce aux **thèmes**. Un thème définit les couleurs, les polices, les bordures, les ombres et, en option, une image de fond pour le launcher.

Il existe **deux versions** du système de thèmes :

| Version | Format | Statut |
|---|---|---|
| **v2** | TOML (`Meta.toml` + `Definition.toml`) | ✅ **Recommandée** pour les nouveaux thèmes |
| **v1** | JSON (`theme.json`) | ⚠️ Legacy, conservée uniquement pour compatibilité |

**Sommaire de ce guide :**

1. [Démarrage rapide](#démarrage-rapide) — créez votre premier thème en 5 minutes
2. [Où se trouvent les thèmes et comment ils sont détectés](#où-se-trouvent-les-thèmes)
3. [Format v2 (recommandé)](#format-v2-toml--recommandé)
4. [Format v1 (legacy)](#format-v1-json--legacy)
5. [Référence commune](#référence-commune-v1-et-v2) — polices, image de fond et variables CSS
6. [Publier votre thème](#publier-un-thème)

---

## Démarrage rapide

Créez un thème v2 fonctionnel en trois étapes :

**1.** Créez le dossier du thème dans `.cubic/themes/` :

```
.cubic/themes/mon-theme/
```

**2.** À l'intérieur, créez `Meta.toml` avec les métadonnées :

```toml
name = "Mon Thème"
author = "VotreNom"
version = "1.0.0"
description = "Un thème sombre minimaliste"
```

**3.** Créez `Definition.toml` avec l'apparence minimale :

```toml
[backgrounds]
main = "#1a1a2e"
sidebar = "#16213e"
card = "#0f3460"

[text]
primary = "#ffffff"
secondary = "#cccccc"

[colors]
accent = "#e94560"
```

Redémarrez (ou rechargez) le launcher et sélectionnez **Mon Thème** dans le sélecteur de thèmes. C'est fait ! Le reste de ce guide couvre toutes les options disponibles.

---

## Où se trouvent les thèmes

Les thèmes utilisateur vont dans `.cubic/themes/`. Chaque thème est **un dossier** dont le contenu dépend de la version :

**v2 (recommandée) :**

```
.cubic/
└── themes/
    └── <id>/
        ├── Meta.toml          # métadonnées (nom, auteur, version…)
        ├── Definition.toml    # apparence (couleurs, polices, fond…)
        ├── Inject.css         # (optionnel) CSS avancé
        └── bg.jpg             # (optionnel) image de fond
```

**v1 (legacy) :**

```
.cubic/
└── themes/
    └── <id>/
        ├── theme.json         # tout dans un seul fichier
        └── bg.jpg             # (optionnel) image de fond
```

> ⚠️ Pour des raisons de sécurité, le launcher **ne charge rien** en dehors de `.cubic`.

### Comment la version est détectée

Le launcher décide automatiquement quelle version utiliser selon les fichiers qu'il trouve, dans cet ordre :

1. `Meta.toml` existe-t-il ? → Traité comme **v2** (charge `Meta.toml` + `Definition.toml`).
2. Sinon, `theme.json` existe-t-il ? → Traité comme **v1**.
3. Si aucun des deux n'existe → le thème est **ignoré**.

---

## Format v2 (TOML) — Recommandé

La v2 sépare le thème en deux fichiers : `Meta.toml` (qui et quoi est le thème) et `Definition.toml` (à quoi il ressemble).

### `Meta.toml` — Métadonnées

```toml
name = "Mon Thème"
author = "VotreNom"
version = "1.0.0"
description = "Un thème sombre minimaliste"
injects_css = false
```

| Champ | Type | Requis ? | Description |
|---|---|---|---|
| `name` | `string` | **Oui** | Nom du thème affiché dans le sélecteur. |
| `author` | `string` | Non | Auteur du thème. Vide par défaut. |
| `version` | `string` | Non | Version sémantique du thème. Vide par défaut. |
| `description` | `string` | Non | Brève description. Vide par défaut. |
| `injects_css` | `bool` | Non | Purement informatif. Si `Inject.css` existe, il est **toujours injecté**, quelle que soit cette valeur. `false` par défaut. |

### `Definition.toml` — Apparence

Chaque **section** du fichier regroupe un type de propriété visuelle. Exemple complet :

```toml
[background]
reference_path = "bg.webp"
image_blur = 10.0
image_opacity = 0.5

[colors]
accent = "#ff0000"
"accent-rgb" = "255, 0, 0"

[text]
primary = "#ffffff"
secondary = "#cccccc"

[borders]
color = "#333333"
radius = "8px"
"radius-sm" = "4px"

[shadows]
"shadow-sm" = "0 1px 3px rgba(0,0,0,0.5)"
"shadow-md" = "0 4px 6px rgba(0,0,0,0.3)"
"glow-accent" = "0 0 12px rgba(255,0,0,0.3)"

[backgrounds]
main = "#1a1a2e"
sidebar = "#16213e"
card = "#0f3460"
"item-active" = "#e94560"
overlay = "rgba(0,0,0,0.7)"
input = "#1a1a2e"

[layout]
"font-family" = "'Inter', sans-serif"
"font-size-base" = "14px"
"font-size-sm" = "12px"
"font-size-lg" = "18px"

[others]
"icon-filter" = "invert(1)"
"color-success" = "#22c55e"
"color-error" = "#ef4444"
"color-warning" = "#f59e0b"
"color-status-starting" = "#f97316"
"color-status-started" = "#22c55e"
"scrollbar-track" = "#1a1a2e"
"scrollbar-thumb" = "#e94560"

[backdrop]
dropdown = 10.0
modal = 4.0

[[fonts]]
family = "MaPolice"
src = "fonts/ma-police.woff2"
format = "woff2"
weight = "400"
style = "normal"
```

> **Important :** les sections s'écrivent **sans** le préfixe `theme.` (c.-à-d. `[background]`, `[colors]`, `[[fonts]]`). Le préfixe `theme.` ne s'applique que si vous fusionnez les deux fichiers en un seul TOML en tant que `V2Theme`.

### Comment les sections deviennent des variables CSS

Chaque clé de `Definition.toml` est « aplatie » en une variable CSS avec un préfixe selon sa section :

| Section | Préfixe CSS | Exemple de clé | Variable générée |
|---|---|---|---|
| `[colors]` | `--` | `accent` | `--accent` |
| `[text]` | `--text-` | `primary` | `--text-primary` |
| `[borders]` | `--border-` | `color` | `--border-color` |
| `[shadows]` | `--` | `shadow-sm` | `--shadow-sm` |
| `[backgrounds]` | `--bg-` | `main` | `--bg-main` |
| `[layout]` | `--` | `font-family` | `--font-family` |
| `[others]` | `--` | `icon-filter` | `--icon-filter` |
| `[backdrop]` | `--backdrop-blur-` | `modal` | `--backdrop-blur-modal` |

**Cas particuliers :**

- `[backdrop]` ajoute automatiquement `px` à la valeur : `dropdown = 10.0` → `--backdrop-blur-dropdown: 10px`.
- `[background]` (au singulier — l'image de fond) génère automatiquement ces trois variables :

| Champ | Variable générée |
|---|---|
| `reference_path = "bg.webp"` | `--bg-image-path: bg.webp` |
| `image_blur = 10.0` | `--bg-image-blur: 10px` |
| `image_opacity = 0.5` | `--bg-image-opacity: 0.5` |

### `Inject.css` — CSS avancé (optionnel)

Si le dossier du thème contient un fichier `Inject.css`, son contenu est injecté directement dans l'interface (**toujours**, indépendamment de la valeur de `injects_css` dans `Meta.toml`).

C'est utile pour tout ce qui ne peut pas s'exprimer avec les seules variables CSS :

- `@keyframes` et animations personnalisées
- Requêtes `@media`
- Sélecteurs imbriqués
- Pseudo-éléments (`::before`, `::after`)

---

## Format v1 (JSON) — Legacy

> Utilisez la v1 uniquement pour maintenir des thèmes existants. Pour les nouveaux thèmes, utilisez la [v2](#format-v2-toml--recommandé).

Tout le thème est défini dans un seul fichier `theme.json` :

```json
{
  "name": "Mon Thème",
  "author": "VotreNom",
  "version": "1.0.0",
  "type": "user",
  "bg_image": "bg.jpg",
  "bg_image_blur": "10px",
  "bg_image_opacity": 0.6,
  "fonts": [
    {
      "family": "MaPolice",
      "src": "fonts/ma-police.woff2",
      "format": "woff2",
      "weight": "400",
      "style": "normal"
    }
  ],
  "variables": {
    "--bg-main": "#1a1a2e",
    "--bg-sidebar": "#16213e",
    "--text-primary": "#ffffff",
    "--accent": "#e94560"
  }
}
```

| Champ | Type | Requis ? | Description |
|---|---|---|---|
| `name` | `string` | **Oui** | Nom du thème affiché dans le sélecteur. |
| `variables` | `object` | **Oui** | Map de variables CSS. Clés et valeurs string. Écrites telles quelles, avec `--` (voir [Variables CSS](#variables-css-disponibles)). |
| `author` | `string` | Non | Auteur du thème. Vide par défaut. |
| `version` | `string` | Non | Version du thème. Vide par défaut. |
| `type` | `string` | Non | `"user"` pour les thèmes utilisateur. Les `"builtin"` sont fournis avec le launcher. |
| `bg_image` | `string?` | Non | Nom du fichier d'image de fond, relatif au dossier du thème. |
| `bg_image_blur` | `string?` | Non | Flou du fond sous forme de string (ex : `"10px"`). Converti en nombre ; si invalide, `0.0` est utilisé. |
| `bg_image_opacity` | `number?` | Non | Opacité du fond, de 0 à 1 (ex : `0.6`). |
| `fonts` | `array` | Non | Liste de polices personnalisées (voir [Polices](#polices)). Vide par défaut. |

> En v1, `bg_image_blur` et `bg_image_opacity` restent des champs séparés dans `ThemeResponse` — ils ne sont **pas** convertis en variables CSS (contrairement à la v2).

---

## Référence commune (v1 et v2)

### Polices

Les deux versions prennent en charge les polices personnalisées avec les mêmes champs. Seul l'endroit où on les déclare change :

- **v2 :** blocs `[[fonts]]` dans `Definition.toml`
- **v1 :** tableau `fonts` dans `theme.json`

| Champ | Type | Requis ? | Description |
|---|---|---|---|
| `family` | `string` | **Oui** | Nom de la famille de police (celui utilisé ensuite dans `font-family`). |
| `src` | `string` | **Oui** | Chemin vers le fichier de police, relatif au dossier du thème (ou absolu). |
| `format` | `string?` | Non | Format du fichier : `woff2`, `ttf`, `otf`, etc. |
| `weight` | `string?` | Non | Graisse : `400`, `700`, `bold`, etc. |
| `style` | `string?` | Non | Style : `normal`, `italic`, `oblique`. |

**Exemple v2 (TOML) :**

```toml
[[fonts]]
family = "MaPolice"
src = "fonts/ma-police.woff2"
format = "woff2"
weight = "400"
style = "normal"
```

**Exemple v1 (JSON) :**

```json
{
  "name": "Mon Thème",
  "fonts": [
    {
      "family": "MaPolice",
      "src": "fonts/ma-police.woff2",
      "format": "woff2",
      "weight": "400",
      "style": "normal"
    }
  ]
}
```

**Résolution des chemins :**

- Les chemins **relatifs** sont résolus par rapport au dossier du thème.
- Les chemins commençant par `/` (ou absolus) sont utilisés tels quels.
- Pour détecter les chemins absolus : la v1 reconnaît le préfixe `file:` ; la v2 reconnaît `:` (par exemple `C:\` sous Windows).

> ⚖️ **Licence :** lorsque vous distribuez un thème avec des polices personnalisées, incluez toujours la licence de la police et n'utilisez que des polices que vous avez le droit de redistribuer.

### Image de fond

Le champ qui référence l'image dépend de la version :

- **v2 :** `reference_path` dans `[background]`
- **v1 :** `bg_image` dans `theme.json`

Dans les deux cas, il pointe vers un fichier dans le dossier du thème (ex : `bg.jpg`, `bg.webp`).

**Validations appliquées par le launcher :**

1. **Vérifie le type réel du fichier** via le *magic number* (avec la bibliothèque `infer`) ; il ne fait pas confiance à l'extension.
2. **Rejette les images de plus de 25 Mo** pour des raisons de sécurité et d'efficacité. En cas de dépassement, le fond est ignoré et un avertissement s'affiche.
3. **N'accepte que les formats d'image valides :** PNG, JPG, GIF, WEBP, etc.

Si l'image ne peut pas être chargée (fichier corrompu, format invalide, trop lourde), le launcher l'ignore simplement et n'affiche aucun fond.

**Variables CSS liées au fond :**

| Variable | Origine | Description |
|---|---|---|
| `--bg-image` | Interne (frontend) | URL de l'image chargée. |
| `--bg-image-loaded` | Interne (frontend) | `0` pendant le chargement, `1` une fois prête. |
| `--bg-image-path` | v2 : `reference_path` | Chemin vers le fichier image (v2 uniquement). |
| `--bg-image-blur` | v2 : `image_blur` | Flou en pixels (v2 uniquement). |
| `--bg-image-opacity` | v2 : `image_opacity` | Opacité du fond (v2 uniquement). |

### Variables CSS disponibles

Voici la liste complète des variables consommées par le frontend. En **v1**, elles s'écrivent telles quelles (avec `--`) dans `variables` ; en **v2**, elles s'écrivent **sans** préfixe, dans la section indiquée.

#### Couleurs de fond — v2 : `[backgrounds]`

| Variable | Description |
|---|---|
| `--bg-main` | Fond principal de la fenêtre |
| `--bg-sidebar` | Fond de la barre latérale |
| `--bg-card` | Fond des cartes |
| `--bg-item-active` | Fond de l'élément actif |
| `--bg-overlay` | Fond des overlays/modales |
| `--bg-input` | Fond des champs de saisie |

#### Couleurs de texte — v2 : `[text]`

| Variable | Description |
|---|---|
| `--text-primary` | Texte principal |
| `--text-secondary` | Texte secondaire |
| `--text-muted` | Texte désactivé ou discret |

#### Accent — v2 : `[colors]`

| Variable | Description |
|---|---|
| `--accent` | Couleur d'accent principale |
| `--accent-rgb` | Accent au format RGB (à utiliser avec `rgba()`) |
| `--accent-hover` | Accent au survol |
| `--accent-text` | Couleur du texte sur fond d'accent |

#### Bordures — v2 : `[borders]`

| Variable | Description |
|---|---|
| `--border-color` | Couleur des bordures |
| `--border-radius` | Rayon de bordure général |
| `--border-radius-sm` | Petit rayon de bordure |

#### Ombres — v2 : `[shadows]`

| Variable | Description |
|---|---|
| `--shadow-sm` | Petite ombre |
| `--shadow-md` | Ombre moyenne |
| `--glow-accent` | Halo de la couleur d'accent |

#### États — v2 : `[others]`

| Variable | Description |
|---|---|
| `--color-success` | Couleur de succès |
| `--color-success-rgb` | Succès au format RGB |
| `--color-error` | Couleur d'erreur |
| `--color-error-rgb` | Erreur au format RGB |
| `--color-warning` | Couleur d'avertissement |
| `--color-warning-rgb` | Avertissement au format RGB |
| `--color-status-starting` | État « démarrage » |
| `--color-status-started` | État « démarré » |

#### Barre de défilement — v2 : `[others]`

| Variable | Description |
|---|---|
| `--scrollbar-track` | Fond de la barre de défilement |
| `--scrollbar-thumb` | Couleur du curseur de défilement |

#### Typographie — v2 : `[layout]`

| Variable | Description |
|---|---|
| `--font-family` | Famille de police |
| `--font-size-base` | Taille de texte de base |
| `--font-size-sm` | Petite taille |
| `--font-size-lg` | Grande taille |

#### Icônes — v2 : `[others]`

| Variable | Description |
|---|---|
| `--icon-filter` | Filtre CSS pour les icônes (ex : `invert(1)`) |
| `--icon-filter-error` | Filtre pour les icônes d'erreur |

#### Backdrop blur — v2 uniquement : `[backdrop]`

| Variable | Description |
|---|---|
| `--backdrop-blur-dropdown` | Flou des menus déroulants |
| `--backdrop-blur-modal` | Flou des modales |

---

## Publier un thème

Vous voulez partager votre thème avec la communauté ? Envoyez une Pull Request au [dépôt officiel de Themes](https://github.com/CubicLauncherDevs/Themes). Les thèmes publiés apparaissent sur le site officiel : [cubiclauncher.org/themes](https://www.cubiclauncher.org/themes).

### Structure du dépôt

Chaque thème vit sous `src/<Auteur>/<Theme>/`, avec `theme.md` à la racine du thème et un sous-dossier par version (`V1`, `V2`, …) :

```
src/
  <Auteur>/
    <Theme>/
      theme.md               # description du thème (obligatoire)
      V1/
        Auteur_Theme.zip     # paquet du thème (obligatoire)
        Showcase.png         # aperçu (optionnel)
        changelog.md         # changements de la version (optionnel)
      V2/                    # nouvelles versions (optionnel)
        ...
```

### Étapes pour ajouter votre thème

1. Créez `src/VotreAuteur/VotreTheme/theme.md` avec la description du thème.
2. Créez le dossier de version `src/VotreAuteur/VotreTheme/V1/`.
3. Ajoutez-y `VotreAuteur_VotreTheme.zip` (le nom du ZIP doit suivre le modèle `Auteur_Theme.zip`).
4. *(Optionnel)* Ajoutez `Showcase.png` comme aperçu (le nom est reconnu sans tenir compte de la casse, les minuscules sont acceptées).
5. *(Optionnel)* Ajoutez `changelog.md` avec le journal des modifications de la version.
6. Pour publier de nouvelles versions du thème, créez `V2/`, `V3/`, etc.
7. Ouvrez une Pull Request vers le dépôt.

### Fichiers du thème

**À la racine du thème :**

| Fichier | Obligatoire ? | Description |
|---|---|---|
| `theme.md` | **Oui** | Description/README du thème en Markdown. |

**Dans chaque dossier de version (`V1/`, `V2/`, …) :**

| Fichier | Obligatoire ? | Description |
|---|---|---|
| `Auteur_Theme.zip` | **Oui** | Paquet du thème. |
| `Showcase.png` | Non | Aperçu de cette version (nom insensible à la casse). |
| `changelog.md` | Non | Changements de cette version. |

**Exemple de `theme.md` :**

```markdown
# Mon Thème

Description en markdown du thème, son inspiration, etc.
```

**Exemple de `changelog.md` :**

```markdown
# V1

- Première publication
- Thème sombre avec accents verts
```

### Le fichier ZIP

**Nom :** `Auteur_Theme.zip` — avec un underscore, sans espaces ni deux-points.

**Contenu pour la v2 (recommandé) :**

```
Auteur_Theme.zip
└── <nom-du-theme>/
    ├── Meta.toml
    ├── Definition.toml
    ├── Inject.css        (optionnel)
    └── bg.EXTENSION      (optionnel)
```

**Contenu pour la v1 (legacy) :**

```
Auteur_Theme.zip
└── <nom-du-theme>/
    ├── theme.json
    └── bg.EXTENSION      (optionnel)
```

**Formats d'image acceptés :** PNG, GIF, WEBP et JPG.

### Que se passe-t-il après le merge ?

Le dépôt inclut une **GitHub Action** (`.github/workflows/generate-themes.yml`) qui s'exécute à chaque push :

1. Analyse le dossier `src/`.
2. Lit le `theme.md` et le `changelog.md` de chaque thème.
3. Récupère les dates git de chaque version.
4. Construit les URLs de téléchargement vers `raw.githubusercontent.com`.
5. Génère le fichier `themes.json` à la racine du dépôt.

Ce `themes.json` est servi statiquement et c'est lui que le site de CubicLauncher utilise pour afficher et télécharger les thèmes. Vous n'avez rien de plus à faire : une fois votre PR acceptée, le thème apparaît automatiquement sur [cubiclauncher.org/themes](https://www.cubiclauncher.org/themes).

### Licence du dépôt

Le dépôt Themes est sous licence [CC0 1.0 Universal](https://github.com/CubicLauncherDevs/Themes/blob/master/LICENSE) (domaine public). En soumettant votre thème, vous acceptez de le publier sous cette licence. N'oubliez pas que les **polices** incluses dans votre thème conservent leur propre licence : incluez-la et n'utilisez que des polices que vous avez le droit de redistribuer.