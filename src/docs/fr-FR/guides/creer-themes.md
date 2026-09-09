---
title: Créer des thèmes
description: Guide complet pour créer, empaqueter et publier des thèmes personnalisés dans CubicLauncher. Couvre les formats V1 (legacy) et V2 (recommandé), les ressources, les validations et le flux de publication officiel.
---

# Comment créer des thèmes pour CubicLauncher

CubicLauncher permet de personnaliser l'interface utilisateur grâce aux **thèmes**. Un thème définit les couleurs, les polices, les bordures, les ombres, les images de fond, les icônes et, dans le format V2, des feuilles de style CSS additionnelles.

Ce guide explique comment créer un thème à partir de zéro, comment l'empaqueter, comment le tester localement et comment le publier dans le dépôt officiel.

:::details Introduction
### Qu'est-ce qu'un thème ?

Un thème est un ensemble de fichiers que CubicLauncher interprète pour modifier l'apparence visuelle de l'application. En interne, CubicLauncher convertit n'importe quel format de thème en une structure commune appelée `ThemeResponse`, que le frontend utilise pour appliquer les styles.

### Versions du format

CubicLauncher prend en charge deux versions du format de thèmes :

| Version | Format | État | Recommandation |
|---|---|---|---|
| V1 | JSON (`theme.json`) | Legacy | Maintenu par compatibilité, mais ne reçoit plus de nouvelles fonctionnalités. |
| V2 | TOML (`Meta.toml` + `Definition.toml`) | Actuel | Recommandé pour les nouveaux thèmes. Prend en charge les icônes, le CSS injecté et une organisation plus claire. |
:::

:::details Concepts généraux
### Détection des versions

CubicLauncher détecte automatiquement la version du thème selon le fichier présent dans le répertoire du thème :

- Si `Meta.toml` existe, il s'agit d'un **V2**.
- Si `theme.json` existe, il s'agit d'un **V1**.

Lors de l'importation d'un ZIP via `import_theme_zip`, CubicLauncher cherche d'abord un `theme.json` dans le paquet. S'il ne le trouve pas, il tente d'importer le fichier comme un paquet V2 (`Meta.toml`).

### Résolution des chemins

Les chemins relatifs spécifiés pour les images de fond, les polices et les icônes sont résolus automatiquement par rapport au répertoire du thème installé. Il est recommandé d'utiliser des chemins relatifs à l'intérieur du ZIP pour garder le paquet portable.

### Validations des ressources

CubicLauncher applique les validations de sécurité suivantes :

- **Images de fond** : doivent être des fichiers image valides (identification par magic bytes) et ne peuvent pas dépasser les **25 MB**.
- **Icônes personnalisées (V2)** : doivent avoir l'extension `svg`, `png`, `webp`, `jpg` ou `jpeg` ; les images rasterisées ne peuvent pas dépasser les **2 MB**.
- **Polices** : si le chemin est relatif, il est résolu localement dans le répertoire du thème.
:::

:::details Créer un thème V1 (legacy)
Le format V1 utilise un unique fichier JSON appelé `theme.json`. Il est simple mais limité : il ne prend pas en charge les icônes personnalisées ni le CSS injecté.

### Fichiers requis

```
NombreDelTheme/
└── theme.json        # obligatoire
```

### Ressources optionnelles

- `bg.EXT` — image de fond.
- Fichiers de polices référencés dans `fonts`.

### Schéma de `theme.json`

| Champ | Type | Requis | Description |
|---|---|---|---|
| `name` | string | Oui | Nom du thème. |
| `author` | string | Non | Auteur du thème. |
| `version` | string | Non | Version du thème (semver recommandée). |
| `type` | string | Non | Type du thème. Exposé tel quel dans la liste. |
| `variables` | objet | Oui | Map de variables CSS `clé: valeur`. |
| `bg_image` | string | Non | Chemin de l'image de fond. |
| `bg_image_blur` | string | Non | Flou de l'image de fond. Converti en nombre si possible. |
| `bg_image_opacity` | number | Non | Opacité de l'image de fond (0,0 à 1,0). |
| `fonts` | array | Non | Liste de polices personnalisées. |

### Polices en V1

Chaque entrée du tableau `fonts` suit ce schéma :

| Champ | Type | Requis | Description |
|---|---|---|---|
| `family` | string | Oui | Nom de la famille typographique. |
| `src` | string | Oui | Chemin vers le fichier de police. |
| `format` | string | Non | Format de la police, par exemple `woff2`. |
| `weight` | string | Non | Graisse de la police, par exemple `400` ou `700`. |
| `style` | string | Non | Style de la police, par exemple `normal` ou `italic`. |

### Exemple complet V1

```json
{
  "name": "Midnight Blue",
  "author": "CubicLabs",
  "version": "1.0.0",
  "type": "user",
  "variables": {
    "--bg-main": "#0a0e17",
    "--bg-card": "#111827",
    "--accent": "#3b82f6",
    "--text-primary": "#e5e7eb",
    "--border-radius": "8px"
  },
  "bg_image": "bg.webp",
  "bg_image_blur": "8",
  "bg_image_opacity": 0.4,
  "fonts": [
    {
      "family": "Inter",
      "src": "fonts/Inter.woff2",
      "format": "woff2",
      "weight": "400"
    }
  ]
}
```

### Limitations de V1

- N'inclut pas de système d'icônes personnalisées.
- Ne permet pas d'injecter de CSS additionnel.
- Le champ `bg_image_blur` est reçu comme `string` et on tente de le parser en nombre.
- Les variables CSS sont définies manuellement telles qu'elles seront appliquées.
:::

:::details Créer un thème V2 (recommandé)
Le format V2 sépare les métadonnées des définitions visuelles dans deux fichiers TOML :

- `Meta.toml` : informations sur l'auteur, le nom, la version et si le thème injecte du CSS.
- `Definition.toml` : toutes les variables visuelles, les polices, les icônes, les fonds et les valeurs additionnelles.

### Fichiers requis

```
NombreDelTheme/
├── Meta.toml           # métadonnées
└── Definition.toml     # définitions visuelles
```

### Ressources optionnelles

- `Inject.css` — feuille de styles additionnelle.
- `bg.EXT` — image de fond.
- Fichiers de polices.
- Icônes SVG/PNG/WEBP/JPG organisées dans des sous-dossiers.

### Schéma de `Meta.toml`

| Champ | Type | Requis | Description |
|---|---|---|---|
| `name` | string | Oui | Nom du thème. |
| `author` | string | Non | Auteur du thème. |
| `version` | string | Non | Version du thème (semver recommandée). |
| `description` | string | Non | Description brève du thème. |
| `injects_css` | boolean | Non | Indique si le thème inclut un fichier `Inject.css`. |

### Schéma de `Definition.toml`

| Champ | Type | Description |
|---|---|---|
| `[background]` | section | Configuration de l'image de fond. |
| `[background.reference_path]` | string | Chemin de l'image de fond. |
| `[background.image_blur]` | number | Flou de l'image. |
| `[background.image_opacity]` | number | Opacité de l'image (0,0 à 1,0). |
| `[colors]` | objet | Couleurs du thème. |
| `[text]` | objet | Couleurs et styles de texte. |
| `[borders]` | objet | Bordures et rayons. |
| `[layout]` | objet | Espacements, largeurs, hauteurs et autres valeurs de mise en page. |
| `[shadows]` | objet | Ombres et lueurs. |
| `[backgrounds]` | objet | Couleurs de fond additionnelles. |
| `[backdrop]` | objet | Valeurs de flou d'arrière-plan (backdrop blur), en pixels. |
| `[fonts]` | array | Polices personnalisées. |
| `[icons]` | section | Icônes personnalisées. |
| `[icons.preview]` | string | Icône d'aperçu du thème. |
| `[icons.<groupe>]` | objet | Icônes groupées par catégorie. |
| `[others]` | objet | Variables additionnelles libres. |

### Système de préfixes de variables CSS

En V2, CubicLauncher convertit automatiquement les sections du TOML en variables CSS plates que le frontend peut consommer. Le tableau suivant montre le préfixe appliqué à chaque section :

| Section | Clé d'exemple | Variable générée |
|---|---|---|
| `colors` | `accent` | `--accent` |
| `text` | `primary` | `--text-primary` |
| `borders` | `radius` | `--border-radius` |
| `layout` | `spacing` | `--spacing` |
| `shadows` | `glow-accent` | `--glow-accent` |
| `backgrounds` | `card` | `--bg-card` |
| `backdrop` | `modal` | `--backdrop-blur-modal` |
| `others` | `icon-filter` | `--icon-filter` |

Notes importantes :

- Le champ `[background]` **n'est pas converti en variables CSS**. Il est exposé directement comme image de fond du thème.
- Les clés dupliquées génèrent un avertissement dans les logs et sont écrasées.

### Exemple minimal V2

`Meta.toml` :

```toml
[meta]
name = "Minimal"
author = "CubicLabs"
version = "1.0.0"
```

`Definition.toml` :

```toml
[theme.background]

[theme.colors]
accent = "#ffffff"
bg-main = "#0a0a0a"

[theme.text]
primary = "#e5e5e5"
```

### Exemple complet V2

`Meta.toml` :

```toml
[meta]
name = "Midnight Blue"
author = "CubicLabs"
version = "2.0.0"
description = "Un tema oscuro con acentos azules."
injects_css = true
```

`Definition.toml` :

```toml
[theme.background]
reference_path = "bg.webp"
image_blur = 8.0
image_opacity = 0.4

[theme.colors]
accent = "#3b82f6"
bg-main = "#0a0e17"
bg-card = "#111827"

[theme.text]
primary = "#e5e7eb"
secondary = "#9ca3af"

[theme.borders]
color = "#1f2937"
radius = "8px"

[theme.layout]
spacing = "1rem"

[theme.shadows]
glow-accent = "0 0 12px rgba(59, 130, 246, 0.3)"

[theme.backgrounds]
sidebar = "#0f172a"

[theme.backdrop]
modal = 8.0
dropdown = 4.0

[theme.others]
icon-filter = "invert(1)"

[[theme.fonts]]
family = "Inter"
src = "fonts/Inter.woff2"
format = "woff2"
weight = "400"

[[theme.fonts]]
family = "Inter"
src = "fonts/Inter-Bold.woff2"
format = "woff2"
weight = "700"

[theme.icons]
preview = "icons/preview.png"

[theme.icons.ui]
play = "icons/ui/play.svg"
settings = "icons/ui/settings.svg"

[theme.icons.sidebar]
home = "icons/sidebar/home.svg"
```

`Inject.css` (optionnel) :

```css
/* CSS adicional para personalizar componentes específicos */
.custom-button {
  text-transform: uppercase;
}
```
:::

:::details Ressources additionnelles
### Image de fond

L'image de fond se configure différemment selon la version :

- **V1** : `bg_image`, `bg_image_blur`, `bg_image_opacity`.
- **V2** : section `[background]` avec `reference_path`, `image_blur`, `image_opacity`.

Formats pris en charge : **PNG, WEBP, JPG, JPEG et GIF** (la validation interne utilise `infer`, mais PNG, WEBP ou JPG sont recommandés pour éviter les problèmes).

Si l'image dépasse les **25 MB** ou n'est pas reconnue comme image valide, CubicLauncher l'ignore et, en V1, enregistre une clé d'avertissement.

### Personnalisation de la barre latérale

La barre latérale de CubicLauncher se stylise principalement via des variables CSS. Les variables suivantes contrôlent son apparence :

| Variable | Description |
|---|---|
| `--bg-sidebar` | Couleur unie de fond de la barre latérale. |
| `--bg-sidebar-gradient` | Dégradé appliqué sur le fond. S'il est défini, il a priorité sur `--bg-sidebar`. |
| `--sidebar-width` | Largeur de la barre latérale en mode normal. |
| `--bg-item-active` | Fond de l'élément actif ou sélectionné dans la barre latérale. |
| `--text-primary` | Couleur du texte principal de la barre latérale. |
| `--text-secondary` | Couleur du texte secondaire. |
| `--accent` | Couleur d'accent pour les boutons et les états interactifs. |
| `--border-color` | Couleur des bordures et séparateurs. |

#### Comportement du dégradé

Dans le frontend, la barre latérale utilise la règle suivante :

```css
background: var(--bg-sidebar-gradient, var(--bg-sidebar));
```

Cela signifie que si `--bg-sidebar-gradient` est défini, le dégradé sera appliqué. S'il n'est pas défini, `--bg-sidebar` sera utilisé comme couleur unie de secours.

#### Mode normal et mode compacte

La barre latérale peut alterner entre deux modes depuis l'interface :

- **Mode normal** : utilise la largeur définie par `--sidebar-width` (valeur par défaut : `260px`).
- **Mode compacte** : conserve les mêmes couleurs et dégradés, mais n'affiche que les icônes.

#### Exemple en V1

```json
"variables": {
  "--bg-sidebar": "#0f1010",
  "--bg-sidebar-gradient": "linear-gradient(180deg, #1a1a2e 0%, #0f1010 100%)",
  "--sidebar-width": "260px",
  "--bg-item-active": "#1c1d1d",
  "--text-primary": "#d8d8d8",
  "--accent": "#3b82f6"
}
```

#### Exemple en V2

```toml
[theme.colors]
bg-sidebar = "#0f1010"
bg-sidebar-gradient = "linear-gradient(180deg, #1a1a2e 0%, #0f1010 100%)"
bg-item-active = "#1c1d1d"
accent = "#3b82f6"

[theme.layout]
sidebar-width = "260px"

[theme.text]
primary = "#d8d8d8"
```

> En V2, les clés de la section `colors` génèrent des variables avec le préfixe `--` directement (`bg-sidebar` → `--bg-sidebar`), tandis que les clés de `layout` génèrent également des variables avec le préfixe `--` (`sidebar-width` → `--sidebar-width`).

### Personnalisation des modales

Les modales de CubicLauncher utilisent une combinaison de variables globales pour définir l'overlay, le flou et le corps de la boîte de dialogue.

| Variable | Description |
|---|---|
| `--bg-overlay` | Couleur ou fond de l'overlay sombre qui recouvre l'écran derrière la modale. |
| `--backdrop-blur-modal` | Quantité de flou appliqué à l'overlay de la modale. |
| `--bg-sidebar` | Fond du corps de la modale. CubicLauncher réutilise cette couleur pour maintenir la cohérence visuelle. |
| `--border` / `--border-color` | Couleur de la bordure de la modale. |
| `--border-radius` | Rayon de bordure de la modale. |
| `--shadow-lg` | Ombre portée de la modale. |
| `--text-primary` | Couleur du titre et du texte principal de la modale. |
| `--text-muted` | Couleur des boutons secondaires et du texte auxiliaire. |

#### Comportement de l'overlay

Dans le frontend, l'overlay d'une modale se définit ainsi :

```css
background: var(--bg-overlay, rgba(0, 0, 0, 0.75));
backdrop-filter: blur(var(--backdrop-blur-modal, 4px));
```

Si `--bg-overlay` n'est pas défini, un noir semi-transparent est utilisé par défaut (`rgba(0, 0, 0, 0.75)`). Si `--backdrop-blur-modal` n'est pas défini, le flou par défaut est de `4px`.

#### Note sur le fond de la modale

Le corps de la modale utilise `--bg-sidebar` comme couleur de fond :

```css
.modal {
  background: var(--bg-sidebar);
}
```

Cela signifie que la personnalisation de `--bg-sidebar` modifie également l'apparence des modales. Si vous voulez un fond différent exclusivement pour les modales, vous pouvez l'écraser via `Inject.css` avec un sélecteur comme `.modal`.

#### Exemple en V1

```json
"variables": {
  "--bg-overlay": "rgba(0, 0, 0, 0.85)",
  "--backdrop-blur-modal": "6px",
  "--bg-sidebar": "#141414",
  "--border-color": "#2a2a2a",
  "--border-radius": "12px",
  "--shadow-lg": "0 8px 28px rgba(0, 0, 0, 0.6)",
  "--text-primary": "#e5e5e5",
  "--text-muted": "#888888"
}
```

#### Exemple en V2

```toml
[theme.colors]
bg-overlay = "rgba(0, 0, 0, 0.85)"
bg-sidebar = "#141414"

[theme.borders]
color = "#2a2a2a"
radius = "12px"

[theme.backdrop]
modal = 6.0

[theme.shadows]
shadow-lg = "0 8px 28px rgba(0, 0, 0, 0.6)"

[theme.text]
primary = "#e5e5e5"
muted = "#888888"
```

---

### Personnalisation des scrollbars

CubicLauncher stylise les barres de défilement via des variables CSS qui sont ensuite appliquées avec les sélecteurs `::-webkit-scrollbar`.

| Variable | Description |
|---|---|
| `--scrollbar-track` | Fond de la piste de la scrollbar. |
| `--scrollbar-thumb` | Couleur du « pouce » de la scrollbar. |
| `--scrollbar-thumb-hover` | Couleur du pouce au survol. |

#### Comportement

Dans le fichier de base, on utilise :

```css
::-webkit-scrollbar-track {
  background: var(--scrollbar-track, transparent);
}

::-webkit-scrollbar-thumb {
  background: var(--scrollbar-thumb, var(--border));
  border-radius: 10px;
}

::-webkit-scrollbar-thumb:hover {
  background: var(--scrollbar-thumb-hover, var(--text-secondary));
}
```

Si ces variables ne sont pas définies, la scrollbar utilise `--border` pour le pouce et `--text-secondary` pour l'état hover.

#### Note sur les scrollbars internes

Certains composants spécifiques (comme `.qm-scroll` dans certains panneaux ou `.modal`) ont leurs propres règles de scrollbar qui ne dépendent pas entièrement de ces variables globales. Pour un contrôle total sur toutes les scrollbars, vous pouvez utiliser `Inject.css` avec les sélecteurs `::-webkit-scrollbar`.

#### Exemple en V1

```json
"variables": {
  "--scrollbar-track": "#0c0c0c",
  "--scrollbar-thumb": "#333333",
  "--scrollbar-thumb-hover": "#555555"
}
```

#### Exemple en V2

```toml
[theme.colors]
scrollbar-track = "#0c0c0c"
scrollbar-thumb = "#333333"
scrollbar-thumb-hover = "#555555"
```

---

### Personnalisation de la typographie

La typographie de base de l'application se contrôle principalement avec les variables suivantes :

| Variable | Description |
|---|---|
| `--font-family` | Police principale de toute l'interface. |
| `--font-size-base` | Taille de police de base. La valeur par défaut est `14px` ; les autres tailles se calculent à partir de cette valeur. |
| `--font-loaded` | Flag interne qui indique si la police personnalisée a déjà chargé. Normalement, il n'est pas nécessaire de le modifier. |

#### Comportement

Dans le CSS de base, on définit :

```css
html {
  font-size: var(--font-size-base, 14px);
}

body {
  font-family: var(--font-family);
}
```

Cela signifie que changer `--font-size-base` affecte proportionnellement tous les textes qui utilisent des unités `rem`, et changer `--font-family` affecte toute l'interface.

#### Utiliser une police personnalisée

Pour que `--font-family` fonctionne correctement, les fichiers de police doivent être inclus dans le thème et déclarés dans la section `fonts`. La famille déclarée dans `fonts` doit correspondre à la valeur de `--font-family`.

Si la police a plusieurs graisses ou styles, déclarez chaque variante séparément.

#### Exemple en V1

```json
{
  "variables": {
    "--font-family": "\"Inter\", system-ui, sans-serif",
    "--font-size-base": "14px"
  },
  "fonts": [
    {
      "family": "Inter",
      "src": "fonts/Inter-Regular.woff2",
      "format": "woff2",
      "weight": "400"
    },
    {
      "family": "Inter",
      "src": "fonts/Inter-Bold.woff2",
      "format": "woff2",
      "weight": "700"
    }
  ]
}
```

#### Exemple en V2

```toml
[meta]
name = "Tipografía personalizada"
author = "CubicLabs"
version = "1.0.0"

[theme.others]
font-family = "\"Inter\", system-ui, sans-serif"

[theme.layout]
font-size-base = "14px"

[[theme.fonts]]
family = "Inter"
src = "fonts/Inter-Regular.woff2"
format = "woff2"
weight = "400"

[[theme.fonts]]
family = "Inter"
src = "fonts/Inter-Bold.woff2"
format = "woff2"
weight = "700"
```

> En V2, `--font-family` et `--font-size-base` n'appartiennent à aucune catégorie sémantique spécifique. Il est recommandé de définir `--font-family` dans `[theme.others]` et `--font-size-base` dans `[theme.layout]`.

### Polices personnalisées

V1 et V2 permettent tous deux des polices personnalisées via le schéma suivant :

```toml
[[theme.fonts]]
family = "Inter"
src = "fonts/Inter.woff2"
format = "woff2"
weight = "400"
style = "normal"
```

| Champ | Description |
|---|---|
| `family` | Nom de la famille typographique. |
| `src` | Chemin vers le fichier de police. Peut être relatif au thème, absolu ou commencer par `file:`. |
| `format` | Format de police (`woff2`, `ttf`, etc.). |
| `weight` | Graisse typographique (`100` à `900`, `bold`, etc.). |
| `style` | Style (`normal`, `italic`, etc.). |

### Icônes personnalisées (V2 uniquement)

V2 permet de remplacer les icônes du frontend via la section `[theme.icons]`.

La structure est la suivante :

```toml
[theme.icons]
preview = "icons/preview.png"

[theme.icons.ui]
play = "icons/ui/play.svg"
settings = "icons/ui/settings.svg"
```

| Champ | Description |
|---|---|
| `preview` | Chemin vers l'icône affichée comme aperçu du thème dans la liste. |
| `[icons.<groupe>]` | Groupes d'icônes. Chaque clé au sein du groupe est exposée au frontend sous la forme `{groupe}:{nom}`. |

Exemple : la clé `play` à l'intérieur du groupe `ui` est exposée comme `ui:play`.

Restrictions :

- Extensions autorisées : `svg`, `png`, `webp`, `jpg`, `jpeg`.
- Images rasterisées : maximum **2 MB**.
- On valide que le fichier soit une image valide (PNG/WEBP/JPG) ou qu'il existe (SVG).

Les icônes invalides sont supprimées silencieusement avec un avertissement dans les logs.

### CSS injecté (V2 uniquement)

V2 permet d'inclure une feuille de styles additionnelle appelée `Inject.css` à la racine du thème.

Pour indiquer que le thème inclut du CSS personnalisé, définissez `injects_css = true` dans `Meta.toml` :

```toml
[meta]
name = "Advanced Theme"
injects_css = true
```

Le contenu de `Inject.css` est lu et envoyé au frontend dans le champ `inject_css` du `ThemeResponse`. Depuis le frontend, il peut être appliqué comme styles additionnels.

> **Avertissement** : le CSS injecté s'exécute dans le contexte de l'application. N'incluez que du CSS de confiance et évitez d'écraser les sélecteurs critiques du système, sauf si c'est intentionnel.
:::

:::details Empaqueter un thème
Un thème se distribue sous forme de fichier ZIP. À l'intérieur du ZIP, les fichiers doivent se trouver dans un dossier racine portant le nom du thème.

### Structure du ZIP pour V2

```
Autor_Tema.zip
└── NombreDelTheme/
    ├── Meta.toml
    ├── Definition.toml
    ├── Inject.css            (optionnel)
    ├── bg.webp               (optionnel)
    ├── fonts/
    │   └── Inter.woff2
    └── icons/
        ├── preview.png
        └── ui/
            ├── play.svg
            └── settings.svg
```

### Structure du ZIP pour V1

```
Autor_Tema.zip
└── NombreDelTheme/
    ├── theme.json
    ├── bg.webp               (optionnel)
    └── fonts/
        └── Inter.woff2
```

### Règles du ZIP

- Le ZIP peut contenir le fichier cible à la racine (`theme.json` ou `Meta.toml`) ou à l'intérieur d'un sous-dossier.
- S'il existe plusieurs fichiers cibles ou plusieurs sous-dossiers les contenant, l'importation est rejetée.
- Le nom du fichier ZIP pour la publication dans le dépôt officiel doit suivre le motif `Autor_Tema.zip`.
:::

:::details Tester un thème localement
CubicLauncher expose plusieurs commandes pour importer des thèmes. Pendant le développement, vous pouvez utiliser l'une des méthodes suivantes :

### Importer un fichier JSON V1 directement

Utilisez la commande `import_theme` et sélectionnez le fichier `theme.json`.

### Importer un ZIP V1 ou V2

Utilisez la commande `import_theme_zip`. CubicLauncher tentera de détecter automatiquement s'il s'agit de V1 (`theme.json`) ou V2 (`Meta.toml`).

### Importer un paquet V2 directement

Utilisez la commande `import_theme_cbth` pour les fichiers `.cbth` (format de paquete V2).

### Emplacement des thèmes installés

La commande `get_themes_dir_path` retourne le chemin où CubicLauncher stocke les thèmes installés. Pendant le développement, vous pouvez consulter ce dossier pour vérifier que les fichiers ont été extraits correctement.
:::

:::details Publier un thème
Vous voulez partager votre thème avec la communauté ? Envoyez une Pull Request au [dépôt officiel de Themes](https://github.com/CubicLauncherDevs/Themes). Les thèmes publiés apparaissent sur le site officiel : [cubiclauncher.org/themes](https://www.cubiclauncher.org/themes).

### Structure du dépôt

Chaque thème réside sous `src/<Auteur>/<Theme>/`, avec `theme.md` à la racine du thème et un sous-dossier par version (`V1`, `V2`, …) :

> `V1/`, `V2/`, … désignent les **versions du thème au sein du dépôt**, et non l'ancien format V1 de CubicLauncher. À l'intérieur de chaque dossier de version, placez les fichiers du thème dans le format de votre choix (V2 recommandé).

```
src/
  <Auteur>/
    <Theme>/
      theme.md               # description du thème (obligatoire)
      vflag.txt              # vérification du thème, staff uniquement (optionnel)
      V1/
        Meta.toml            # métadonnées
        Definition.toml      # définitions visuelles
        bg.png               # image de fond
        fonts/               # polices personnalisées
          Font.ttf
        Showcase.png         # aperçu (optionnel)
        changelog.md         # modifications de la version (optionnel)
      V2/                    # nouvelles versions (optionnel)
        ...
```

:::info Fichiers binaires
Les fichiers binaires (images, polices) **ne sont pas stockés dans Git**. Le workflow CI les téléverse automatiquement sur Cloudflare R2, puis les supprime du dépôt. C'est pourquoi seuls les fichiers texte persistent dans le dépôt : TOML, CSS, TXT, MD, etc.
:::

### Étapes pour ajouter votre thème

1. Créez `src/VotreAuteur/VotreTheme/theme.md` avec la description du thème.
2. Créez le dossier de version `src/VotreAuteur/VotreTheme/V1/`.
3. Ajoutez-y `Meta.toml` et `Definition.toml` (format TOML de CubicLauncher).
4. Ajoutez-y `bg.png` (ou `.jpg`, `.gif`, `.webp`) comme image de fond.
5. *(Optionnel)* Ajoutez `Showcase.png` comme aperçu, des polices dans `fonts/`, ainsi que `Inject.css`, `icons/`, etc.
6. *(Optionnel)* Ajoutez `changelog.md` avec le journal des modifications de la version.
7. Pour publier de nouvelles versions du thème, créez `V2/`, `V3/`, etc.
8. Ouvrez une Pull Request vers le dépôt.

### Fichiers du thème

**À la racine du thème :**

| Fichier | Obligatoire ? | Description |
|---|---|---|
| `theme.md` | **Oui** | Description/README du thème en Markdown. |
| `vflag.txt` | Non | Flag de vérification du thème complet. **Seul le staff doit l'ajouter ; si l'auteur l'inclut, le thème ne sera pas vérifié.** |

**À l'intérieur de chaque dossier de version (`V1/`, `V2/`, …) :**

| Fichier | Obligatoire ? | Description |
|---|---|---|
| `Meta.toml` | **Oui** | Métadonnées du thème. |
| `Definition.toml` | **Oui** | Définitions visuelles du thème. |
| `bg.EXT` | **Oui** | Image de fond. Formats : PNG, GIF, WEBP, JPG. |
| `fonts/` | Non | Polices personnalisées. |
| `Inject.css` | Non | CSS additionnel (requiert `injects_css = true` dans `Meta.toml`). |
| `icons/` | Non | Icônes personnalisées (format V2 uniquement). |
| `Showcase.png` | Non | Aperçu de cette version (nom insensible à la casse). |
| `changelog.md` | Non | Modifications de cette version. |

**Exemple de `theme.md` :**

```markdown
# Mon thème

Description en markdown du thème, son inspiration, etc.
```

**Exemple de `changelog.md` :**

```markdown
# V1

- Première version
- Thème sombre avec des accents verts
```

### Vérification des thèmes

Le catalogue `themes.json` marque un thème avec `verified: true` uniquement s'il existe un fichier nommé exactement `vflag.txt` dans `src/<Auteur>/<Theme>/`, à côté de `theme.md`. Il peut être vide : son contenu n'est pas lu.

> **Important :** le fichier `vflag.txt` **ne doit être ajouté que par le staff**. Si vous, en tant qu'auteur du thème, l'incluez dans votre PR, votre thème **ne sera pas vérifié**.

La vérification s'applique au thème complet. Un dossier nommé `vflag.txt` ou un fichier à l'intérieur de `V1/`, `V2/`, etc. ne le rend pas vérifié. Sans le fichier, ou si vous le supprimez, le catalogue est généré avec `verified: false`.

Ajouter ou supprimer uniquement ce flag met à jour le catalogue sans régénérer les aperçus ni téléverser ou supprimer d'assets sur R2.

### Comment ajouter uniquement un `Showcase.png` à un thème existant ?

1. Ajoutez `Showcase.png` dans `src/<Auteur>/<Theme>/V1/Showcase.png`.
2. Faites un commit et un push vers `master` (ou ouvrez une PR).

Le workflow téléverse le fichier sur R2, met à jour `showcaseUrl` et préserve les URLs R2 existantes des autres assets (image de fond, polices, etc.).

> L'aperçu se régénère automatiquement. Si `bg.png` n'est pas sur le disque (il a déjà été téléversé sur R2 lors d'une exécution antérieure), l'aperçu utilisera un gradient comme solution de secours.

### Que se passe-t-il après le merge ?

Le dépôt inclut un workflow `Generate + Assets to R2` (`.github/workflows/`) qui s'exécute sur **push vers `master`** et en **PR** lorsque des fichiers de `src/` sont modifiés :

1. Il détecte quels dossiers de version ont changé (p. ex. `src/VotreAuteur/VotreTheme/V1`).
2. Il optimise les PNGs nouveaux avec `oxipng`.
3. Il génère les aperçus uniquement pour les dossiers modifiés (`generate.js --dirs`).
4. Il fusionne les *collections* externes dans `packages.json`.
5. Il téléverse sur R2 les assets binaires nouveaux, met à jour `themes.json` avec les URLs R2, puis supprime les fichiers binaires locaux (`scripts/upload-assets.mjs`).
6. Il commite et pousse les changements (`[skip ci]` pour éviter les boucles).

Le `themes.json` résultant est servi statiquement et est consommé par le site de CubicLauncher pour afficher et télécharger les thèmes. Vous n'avez pas besoin de faire quoi que ce soit de plus : une fois votre PR acceptée, le thème apparaît automatiquement sur [cubiclauncher.org/themes](https://www.cubiclauncher.org/themes).

### Archive des thèmes — Themes Archive

Il existe également un workflow manuel **`Themes Archive Release`** dans l'onglet *Actions*. En l'exécutant, il génère une release GitHub nommée `archive-YYYY-MM-DD-HHMM` contenant un ZIP avec tous les thèmes et toutes leurs versions :

- Il reconstruit `src/` complet en téléchargeant les fichiers de texte depuis GitHub raw et les assets binaires depuis R2.
- Il joint `themes.json`, `packages.json`, `README.md` et `LICENSE`.
- Il vérifie que le ZIP ne dépasse pas la limite de 2 Go de GitHub avant de le publier.

### Assets sur R2

- Les fichiers binaires sont téléversés vers `https://themes.cubiclauncher.org/` avec des noms hachés (`file.<hash8>.ext`) et `Cache-Control: immutable`.
- Les fichiers de texte sont servis depuis GitHub raw.
- Le bucket R2 a CORS activé pour permettre les téléchargements depuis le frontend.

```
Exemple :
  src/4xnl/Jadol/V1/bg.jpg
  → https://themes.cubiclauncher.org/src/4xnl/Jadol/V1/bg.132191b1.jpg
```

### Licence du dépôt

Le dépôt de Themes est sous licence [CC0 1.0 Universal](https://github.com/CubicLauncherDevs/Themes/blob/master/LICENSE) (domaine public). En envoyant votre thème, vous acceptez de le publier sous cette licence. Rappelez-vous que les **polices** incluses dans votre thème conservent leur propre licence : incluez-la et n'utilisez que des polices que vous avez le droit de redistribuer.
:::

:::details Concevoir des thèmes avec l'IA (agents.md)
L'IA peut beaucoup accélérer la conception d'un thème, mais elle a aussi tendance à reproduire des combinaisons génériques : fonds sombres + accent bleu, police Inter et peu plus. Pour en profiter sans tomber dans la répétition, utilisez ce prompt ou adaptez-le à votre assistant.

> Ce bloc fonctionne comme une référence de type `agents.md` pour l'IA et les créateurs. Vous pouvez le copier, le coller dans votre chat préféré et l'ajuster au concept que vous souhaitez.

### Prompt recommandé pour agents IA

Copiez et collez ceci dans votre assistant, en ajustant le concept :

```text
[RÔLE]
Tu es un designer spécialisé dans les interfaces de bureau pour les launchers Minecraft. Tu vas créer un thème pour CubicLauncher au format V2 (`Meta.toml` + `Definition.toml`).

[OBJECTIF]
Générer un thème visuellement unique, avec une identité claire et cohérente, qui NE ressemble pas à un « thème sombre avec des accents bleus génériques ».

[RÈGLES DE DESIGN]
- Choisis une source d'inspiration concrète et peu commune : une esthétique de jeu vidéo, une époque du design, une sous-culture visuelle, un mouvement artistique, etc.
- Évite l'accent par défaut bleu/vert/violet. Propose de l'ocre, du corail, du turquoise atténué, du lavande grisâtre, etc.
- Utilise des typographies qui apportent de la personnalité. Tu peux combiner une police display pour les titres et une sans-serif lisible pour le corps.
- Le fond doit avoir une texture, un motif subtil ou un dégradé atmosphérique ; pas une couleur sombre plate.
- Ajoute des icônes cohérentes avec le concept.
- Utilise `Inject.css` quand les variables seules ne suffisent pas (ombres de néon, bordures avec clip, filtres, etc.).
- Nomme les variables de manière sémantique et cohérente.

[RÈGLES TECHNIQUES]
- Format V2.
- Chemins relatifs pour les ressources.
- Ne pas inclure `vflag.txt`.
- Image de fond ≤ 25 Mo ; icônes rasterisées ≤ 2 Mo.
- Valider le TOML avant de livrer.

[SORTIE ATTENDUE]
1. `[meta]` avec nom, auteur, version, description et `injects_css` si applicable.
2. `[theme]` complet dans `Definition.toml`.
3. Liste des fichiers recommandés (bg, polices, icônes).
4. Brève explication du concept et pourquoi il est unique.
```

### Comment éviter les résultats génériques

- **Ne demandez pas « un thème sombre »** : demandez plutôt quelque chose comme « UI de terminal VT220 », « aesthetic vaporwave de mall », « design suisse brutaliste », « interface Pip-Boy », « esthétique lo-fi japonaise », etc.
- **Limitez les couleurs « sûres »** : si l'IA vous donne du bleu/vert/violet par défaut, demandez-lui de changer l'accent pour de l'ocre, du corail, du turquoise atténué, du lavande grisâtre, etc.
- **Demandez des imperfections délibérées** : bruit subtil dans le fond, bordures légèrement usées, ombres longues, contrastes inhabituels.
- **Intégrez la typographie comme identité** : une police avec empattements pour les titres dans un launcher moderne peut être plus mémorable qu'utiliser Inter partout.
- **Utilisez `Inject.css` pour des signatures visuelles** : bordures en dégradé, coins alternatifs, effets de verre/néon, typographie monoespacée dans certains panneaux.
- **Vérifiez le dossier `icons/`** : les icônes personnalisées sont un excellent différenciateur ; si vous ne les dessinez pas à la main, demandez à l'IA un ensemble cohérent et exportez-les en SVG.

### Checklist avant de publier

- [ ] Le thème a un concept clair, pas seulement « sombre avec un accent ».
- [ ] La palette se distingue de thèmes populaires comme Midnight Blue.
- [ ] Les polices se chargent et la lisibilité est bonne.
- [ ] `bg.png` comporte des détails, une texture ou un dégradé, et n'est pas une couleur unie.
- [ ] Les icônes (s'il y en a) sont cohérentes avec le concept.
- [ ] Le TOML est valide.
- [ ] Il n'inclut pas `vflag.txt`.
:::

:::details Référence rapide
### Table comparative V1 vs V2

| Fonctionnalité | V1 | V2 |
|---|---|---|
| Format principal | JSON | TOML |
| Fichiers du thème | `theme.json` | `Meta.toml`, `Definition.toml` |
| Ressources optionnelles | Image de fond, polices | Image de fond, polices, icônes, CSS |
| Système d'icônes | Non | Oui |
| CSS injecté | Non | Oui (`Inject.css`) |
| Définition des variables | Plat et manuel | Par catégories avec préfixes automatiques |
| Section de fond | Champs à la racine | `[background]` dans `Definition.toml` |
| État | Legacy | Recommandé |

### Variables CSS communes du frontend

Ces variables ne sont pas obligatoires, mais sont fréquemment utilisées par le frontend et par la fonction `extract_preview` pour générer l'aperçu du thème :

| Variable | Usage typique |
|---|---|
| `--bg-main` | Fond principal. |
| `--bg-card` | Fond de cartes ou de panneaux. |
| `--bg-sidebar` | Fond de la barre latérale. |
| `--accent` | Couleur d'accent. |
| `--text-primary` | Couleur de texte principal. |

En V2, ces variables proviennent des sections `colors`, `backgrounds` et `text` avec les préfixes correspondants.
:::

:::details Notes et bonnes pratiques
- **Utilisez semver** dans le champ `version` pour maintenir un historique clair des modifications.
- **Compressez les images** : les images de fond ont une limite de 25 MB et les icônes de 2 MB. Des images légères réduisent le temps de chargement.
- **Privilégiez SVG ou WEBP** pour les icônes, car ils offrent une meilleure qualité et compression.
- **Validez le TOML/JSON** avant d'empaqueter. Les erreurs de syntaxe font que CubicLauncher ignore silencieusement le thème lors du listage.
- **Maintenez les chemins relatifs** à l'intérieur du ZIP pour que le paquet soit portable.
- **Documentez les licences** des polices et images que vous incluez dans votre `theme.md`.
- **Évitez les collisions de variables** en V2 : si deux sections génèrent la même variable CSS, le thème émettra un avertissement et une valeur écrasera l'autre.
- **Testez le thème localement** avant de le publier via `import_theme_zip` ou les commandes correspondantes.
:::
