---
title: Comment créer des thèmes | CubicLauncher
---

# Comment créer des thèmes

CubicLauncher vous permet de personnaliser entièrement l'interface avec des thèmes. Chaque thème définit des couleurs, des polices, des bordures et une image de fond optionnelle.

Il existe actuellement **deux versions** du système de thèmes. La **v1** (JSON, legacy) et la **v2** (TOML), cette dernière étant recommandée pour les nouveaux thèmes.

---

## Structure d'un thème

Les thèmes utilisateur se trouvent dans `.cubic/themes/`. Chaque thème est un dossier contenant les fichiers suivants selon la version :

### v1 (JSON legacy)
```
.cubic/
└── themes/
    └── <id>/
        ├── theme.json
        └── bg.jpg (optionnel)
```

### v2 (TOML, recommandée)
```
.cubic/
└── themes/
    └── <id>/
        ├── Meta.toml
        ├── Definition.toml
        ├── Inject.css        (optionnel)
        └── bg.jpg            (optionnel)
```

> Le lanceur **ne charge rien** en dehors de `.cubic` pour des raisons de sécurité.

### Détection de version

Le lanceur détecte automatiquement la version en fonction des fichiers présents :

1. Si `Meta.toml` existe → traité comme **v2** (charge `Meta.toml` + `Definition.toml`)
2. Si `theme.json` existe → traité comme **v1**
3. Si aucun n'existe, le thème est ignoré

---

## v1 — Format JSON (legacy)

### Schéma complet

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
      "src": "polices/ma-police.woff2",
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

### Champs

| Champ | Type | Requis | Description |
|---|---|---|---|
| `name` | `string` | Oui | Nom visible du thème dans le sélecteur. |
| `author` | `string` | Non | Auteur du thème. Vide par défaut. |
| `version` | `string` | Non | Version du thème. Vide par défaut. |
| `type` | `string` | Non | `"user"` pour les thèmes utilisateur. Les thèmes `"builtin"` sont inclus dans le lanceur. |
| `bg_image` | `string?` | Non | Nom du fichier d'image de fond (relatif au dossier du thème). |
| `bg_image_blur` | `string?` | Non | Flou de fond sous forme de chaîne (ex: `"10px"`). Converti en nombre ; ignoré si invalide. |
| `bg_image_opacity` | `number?` | Non | Opacité du fond (0 à 1, ex: `0.6`). |
| `fonts` | `array` | Non | Liste des polices personnalisées (voir section Polices). Vide par défaut. |
| `variables` | `object` | Oui | Tableau des variables CSS. Clés et valeurs sont des chaînes. |

---

## v2 — Format TOML (recommandée)

La v2 sépare les métadonnées et les définitions dans deux fichiers TOML.

### `Meta.toml`

Définit les métadonnées du thème :

```toml
[meta]
name = "Mon Thème"
author = "VotreNom"
version = "1.0.0"
description = "Un thème sombre minimaliste"
injects_css = false
```

| Champ | Type | Requis | Description |
|---|---|---|---|
| `name` | `string` | Oui | Nom visible du thème. |
| `author` | `string` | Non | Auteur du thème. Vide par défaut. |
| `version` | `string` | Non | Version sémantique du thème. Vide par défaut. |
| `description` | `string` | Non | Brève description du thème. Vide par défaut. |
| `injects_css` | `bool` | Non | Si `true` et que `Inject.css` existe, il est injecté dans l'interface. `false` par défaut. |

### `Definition.toml`

Définit l'apparence du thème :

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
src = "polices/ma-police.woff2"
format = "woff2"
weight = "400"
style = "normal"
```

### Correspondance sections → variables CSS

Chaque section de `Definition.toml` est aplatie en variables CSS avec un préfixe spécifique :

| Section | Préfixe CSS | Exemple de clé | Génère |
|---|---|---|---|
| `[colors]` | `--` | `accent` | `--accent` |
| `[text]` | `--text-` | `primary` | `--text-primary` |
| `[borders]` | `--border-` | `color` | `--border-color` |
| `[shadows]` | `--` | `shadow-sm` | `--shadow-sm` |
| `[backgrounds]` | `--bg-` | `main` | `--bg-main` |
| `[layout]` | `--` | `font-family` | `--font-family` |
| `[backdrop]` | `--backdrop-blur-` | `modal` | `--backdrop-blur-modal` (valeur en `px`) |
| `[others]` | `--` | `icon-filter` | `--icon-filter` |

De plus, `[background]` génère automatiquement trois variables :

| Champ | Variable générée |
|---|---|
| `reference_path = "bg.webp"` | `--bg-image-path: bg.webp` |
| `image_blur = 10.0` | `--bg-image-blur: 10px` |
| `image_opacity = 0.5` | `--bg-image-opacity: 0.5` |

> **Note :** `backdrop` ajoute automatiquement `px` à la valeur (ex: `dropdown = 10.0` → `--backdrop-blur-dropdown: 10px`).

---

## Polices (v1 et v2)

Les deux versions prennent en charge les polices personnalisées. En v1, elles se trouvent dans le tableau `fonts` de `theme.json` ; en v2, dans `[[fonts]]` de `Definition.toml`.

### Champs

| Champ | Type | Requis | Description |
|---|---|---|---|
| `family` | `string` | Oui | Nom de la famille de polices (utilisé dans `font-family`). |
| `src` | `string` | Oui | Chemin vers le fichier de police (relatif au dossier du thème, ou absolu). |
| `format` | `string?` | Non | Format du fichier (`woff2`, `ttf`, `otf`, etc.). |
| `weight` | `string?` | Non | Poids de la police (`400`, `700`, `bold`, etc.). |
| `style` | `string?` | Non | Style (`normal`, `italic`, `oblique`). |

### Exemple v1 (JSON)

```json
{
  "name": "Mon Thème",
  "fonts": [
    {
      "family": "MaPolice",
      "src": "polices/ma-police.woff2",
      "format": "woff2",
      "weight": "400",
      "style": "normal"
    }
  ]
}
```

### Exemple v2 (TOML)

```toml
[[fonts]]
family = "MaPolice"
src = "polices/ma-police.woff2"
format = "woff2"
weight = "400"
style = "normal"
```

> Les chemins de polices relatifs sont résolus par rapport au dossier du thème. Si le chemin commence par `/` ou `file:`, il est utilisé tel quel (chemin absolu).

---

## Image de fond

### v1 : `bg_image`
### v2 : `reference_path` (dans `[theme.background]`)

Le champ référence un fichier dans le dossier du thème (ex: `bg.jpg`, `bg.webp`). CubicLauncher applique les validations suivantes :

1. **Vérifie le type réel** par magic number en utilisant la bibliothèque `infer`. Ne se fie pas à l'extension du fichier.
2. **Ne charge pas les images de plus de 25 Mo** pour des raisons de sécurité et d'efficacité. Si dépassé, le fond est ignoré et un avertissement est affiché.
3. **Accepte uniquement les formats d'image valides** (PNG, JPG, GIF, WEBP, etc.).

Si le lanceur ne peut pas charger l'image (fichier corrompu, format invalide, trop lourd), il l'ignore et n'affiche aucun fond.

### Variables CSS de fond (automatiques)

| Variable | Origine | Description |
|---|---|---|
| `--bg-image` | Interne (frontend) | URL de l'image chargée. |
| `--bg-image-loaded` | Interne (frontend) | `0` pendant le chargement, `1` quand prête. |
| `--bg-image-path` | v2 : `reference_path` | Chemin vers le fichier image (v2 seulement). |
| `--bg-image-blur` | v2 : `image_blur` | Flou en pixels (v2 seulement). |
| `--bg-image-opacity` | v2 : `image_opacity` | Opacité du fond (v2 seulement). |

> En v1, `bg_image_blur` et `bg_image_opacity` sont conservés comme champs séparés dans `ThemeResponse`, pas comme variables CSS.

---

## Variables CSS disponibles

Voici les variables consommées par le frontend de CubicLauncher. Vous pouvez les définir dans `variables` (v1) ou dans les sections correspondantes de `Definition.toml` (v2).

### Couleurs de fond

v1 : `--bg-*` dans `variables` | v2 : `[theme.backgrounds]`

| Variable | Description |
|---|---|
| `--bg-main` | Fond principal de la fenêtre |
| `--bg-sidebar` | Fond de la barre latérale |
| `--bg-card` | Fond des cartes |
| `--bg-item-active` | Fond de l'élément actif |
| `--bg-overlay` | Fond des overlays/modales |
| `--bg-input` | Fond des champs de saisie |

### Couleurs de texte

v1 : `--text-*` dans `variables` | v2 : `[theme.text]`

| Variable | Description |
|---|---|
| `--text-primary` | Texte principal |
| `--text-secondary` | Texte secondaire |
| `--text-muted` | Texte désactivé ou subtil |

### Accent

v1 : `--*` dans `variables` | v2 : `[theme.colors]`

| Variable | Description |
|---|---|
| `--accent` | Couleur d'accent principale |
| `--accent-rgb` | Accent au format RGB (pour utilisation avec `rgba()`) |
| `--accent-hover` | Accent au survol |
| `--accent-text` | Couleur du texte sur fond d'accent |

### Bordures

v1 : `--border-*` dans `variables` | v2 : `[theme.borders]`

| Variable | Description |
|---|---|
| `--border-color` | Couleur des bordures |
| `--border-radius` | Rayon de bordure général |
| `--border-radius-sm` | Petit rayon de bordure |

### Ombres

v1 : `--shadow-*` dans `variables` | v2 : `[theme.shadows]`

| Variable | Description |
|---|---|
| `--shadow-sm` | Petite ombre |
| `--shadow-md` | Ombre moyenne |
| `--glow-accent` | Lueur de la couleur d'accent |

### Couleurs d'état

v1 : `--color-*` dans `variables` | v2 : `[theme.others]`

| Variable | Description |
|---|---|
| `--color-success` | Couleur de succès |
| `--color-success-rgb` | Succès au format RGB |
| `--color-error` | Couleur d'erreur |
| `--color-error-rgb` | Erreur au format RGB |
| `--color-warning` | Couleur d'avertissement |
| `--color-warning-rgb` | Avertissement au format RGB |
| `--color-status-starting` | Statut "démarrage" |
| `--color-status-started` | Statut "démarré" |

### Barre de défilement

v1 : `--scrollbar-*` dans `variables` | v2 : `[theme.others]`

| Variable | Description |
|---|---|
| `--scrollbar-track` | Fond de la barre de défilement |
| `--scrollbar-thumb` | Couleur du curseur de défilement |

### Typographie

v1 : `--font-*` dans `variables` | v2 : `[theme.layout]`

| Variable | Description |
|---|---|
| `--font-family` | Famille de polices |
| `--font-size-base` | Taille de police de base |
| `--font-size-sm` | Petite taille de police |
| `--font-size-lg` | Grande taille de police |

### Icônes

v1 : `--icon-*` dans `variables` | v2 : `[theme.others]`

| Variable | Description |
|---|---|
| `--icon-filter` | Filtre CSS pour les icônes (ex: `invert(1)`) |
| `--icon-filter-error` | Filtre pour les icônes d'erreur |

### Flou d'arrière-plan (v2 seulement)

v2 : `[theme.backdrop]`

| Variable | Description |
|---|---|
| `--backdrop-blur-dropdown` | Flou d'arrière-plan des menus déroulants |
| `--backdrop-blur-modal` | Flou d'arrière-plan des modales |

---

## Inject.css (v2 seulement)

Si `injects_css = true` est défini dans `Meta.toml` et qu'un fichier `Inject.css` existe dans le dossier du thème, son contenu est injecté directement dans l'interface.

Il est utile pour les overrides CSS complexes qui ne peuvent pas être exprimés uniquement avec des variables, comme :

- `@keyframes` et animations personnalisées
- Requêtes `@media`
- Sélecteurs imbriqués
- Pseudo-éléments (`::before`, `::after`)

---

## Publier un thème

Si vous souhaitez partager votre thème avec la communauté, envoyez une PR au [dépôt officiel des Thèmes](https://github.com/CubicLauncherDevs/Themes).

### Structure du dépôt

```
src/
  <Auteur>/
    <Thème>/
      theme.md
      V1/
        Auteur_Theme.zip
        Showcase.png       (optionnel)
        changelog.md       (optionnel)
      V2/                  (optionnel)
        ...
```

Chaque thème se trouve sous `src/<Auteur>/<Thème>/` avec des sous-dossiers versionnés (`V1`, `V2`, ...).

### Fichiers du thème

| Fichier | Obligatoire | Description |
|---|---|---|
| `theme.md` | Oui | Markdown avec la description et README du thème |
| `Auteur_Theme.zip` | Oui | Paquet du thème (format `Auteur_Theme.zip`) |
| `Showcase.png` | Non | Aperçu de la version (case-insensitive) |
| `changelog.md` | Non | Journal des modifications de cette version |

### theme.md

```markdown
# Mon Thème

Description en markdown du thème, son inspiration, etc.
```

### changelog.md

```markdown
# V1

- Première version
- Thème sombre avec accents verts
```

### Convention de nommage du ZIP

Le ZIP est nommé `Auteur_Theme.zip` (avec underscore, sans espaces ni deux-points).

### Contenu du ZIP

Pour v2 (recommandée) :
```
Auteur_Theme.zip
└── <nom-du-thème>/
    ├── Meta.toml
    ├── Definition.toml
    ├── Inject.css (optionnel)
    └── bg.EXTENSION (optionnel)
```

Pour v1 (legacy) :
```
Auteur_Theme.zip
└── <nom-du-thème>/
    ├── theme.json
    └── bg.EXTENSION (optionnel)
```

### Formats d'image acceptés

**PNG**, **GIF**, **WEBP**, **JPG**.
