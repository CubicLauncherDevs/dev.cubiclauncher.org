---
category: usage
order: 20
title: Instances
description: Comment créer, organiser et gérer des instances Minecraft isolées, chacune avec son propre contenu, mondes, serveurs et configuration.
---

# Instances

Une **instance** est un répertoire autonome avec sa propre copie de Minecraft, mods, resource packs, shader packs, captures d'écran, mondes et configuration. Chaque instance représente une combinaison spécifique de version Minecraft et de mod loader.

## Structure sur le disque

Par défaut, les instances se trouvent dans `.cubic/instances/`. Chaque instance est un dossier portant le nom que vous avez choisi :

```
.cubic/
├── instances/
│   └── Mon Instance/
│       ├── instance.cub        ← métadonnées de l'instance
│       ├── mods/               ← mods (.jar / .jar.disabled)
│       ├── resourcepacks/      ← resource packs
│       ├── shaderpacks/        ← shader packs
│       ├── saves/              ← mondes
│       ├── screenshots/        ← captures d'écran
│       └── ...                 ← fichiers d'exécution Minecraft
└── shared/                     ← versions, bibliothèques, assets et Java partagés
```

Le fichier `instance.cub` stocke les métadonnées en JSON. Il contient, entre autres, le nom, la version, l'icône, la mémoire optionnelle, le profil `options.txt` assigné et s'il est appliqué automatiquement au lancement :

```jsonc
{
  "name": "Mon Instance",
  "version": "1.21-fabric",
  "last_played": 1717000000,
  "playtime_seconds": 3600,
  "uuid": "550e8400-e29b-41d4-a716-446655440000",
  "icon": "/images/instances/fabric.png",
  "cover_image": null,
  "min_memory": null,
  "max_memory": null,
  "pinned": false,
  "options_profile_id": null,
  "auto_apply_options": false
}
```

Les chemins `instances` et `shared` peuvent être modifiés depuis **Paramètres → Stockage**. Lors du déplacement des instances, le launcher utilise des liens physiques si le disque cible le permet ; sinon il copie les données. Les fichiers partagés peuvent être vidés et sont retéléchargés au lancement d'une instance.

## Créer une instance

1. Cliquez sur **« Créer une instance »** dans la barre latérale.
2. Choisissez un **nom** de 24 caractères ASCII maximum.
3. Sélectionnez une **version** parmi celles déjà téléchargées (si celle souhaitée manque, téléchargez-la d'abord depuis le bouton de téléchargements).
4. Choisissez une **icône** et, si vous le souhaitez, une image de couverture.
5. Appuyez sur **Créer**.

Vous pouvez aussi créer une instance depuis un modpack Modrinth ou CurseForge, importer un `.mrpack`/ZIP ou migrer une installation existante depuis **Créer une instance → Local**.

> La version détermine automatiquement le loader : si l'ID contient `fabric` il est détecté comme Fabric, `forge` comme Forge, `neoforge` comme NeoForge, `quilt` comme Quilt, et si aucun ne correspond il est traité comme Vanilla.

## La vue d'instance

Sélectionner une instance ouvre son panneau principal avec :

- **Hero** — bannière avec nom, icône, version, loader, temps de jeu et état actuel.
- **Bouton « Jouer »** — lance Minecraft avec cette instance.
- **Barre d'état** — affiche l'état en temps réel : Off, Starting, Started ou Error.
- **Puce de modpack** — si l'instance provient d'un modpack, affiche sa version et des actions pour la protéger, la mettre à jour ou récupérer l'inventaire.

### Onglet Détails

Affiche les informations générales de l'instance :

- Badges de version et de loader (Vanilla, Fabric, Forge, NeoForge, Quilt).
- Chemin sur le disque avec un bouton pour ouvrir le dossier.
- Accès directs aux dossiers mods, captures d'écran, resource packs et shader packs.
- Console en direct avec la sortie de Minecraft et le défilement automatique.
- Bouton **« Forcer la fermeture »** si l'instance est en cours d'exécution.

### Market de mods

Liste, recherche et installe des mods depuis Modrinth et CurseForge, ou gère les mods déjà installés depuis la source **Local**. Vous pouvez activer ou désactiver des mods (renomme `.jar` ↔ `.jar.disabled`) et voir quels mods appartiennent au modpack.

Il n'est disponible que si l'instance utilise un mod loader. Les instances Vanilla et OptiFine n'affichent pas cette section.

### Ressources et shaders

Les onglets **Ressources** et **Shaders** utilisent le même Market, mais limité aux resource packs ou shader packs. Vous pouvez rechercher du contenu compatible, l'installer et gérer les fichiers locaux.

Les shader packs ne sont pas disponibles sur les instances Vanilla.

### Mondes et serveurs

Chaque instance possède sa propre liste de mondes et de serveurs. Depuis ces sections, vous pouvez ouvrir le dossier `saves/`, ajouter des serveurs, consulter leur état et vous connecter avec Quick Play. Voir [Serveurs et mondes](/docs/fr-FR/Utilisation/serveurs-mondes).

### Captures d'écran

Galerie des captures prises dans l'instance :

- Aperçu miniature.
- Visionneuse lightbox au clic.
- Suppression des captures.

## Cycle de vie

```
Off ──► Starting ──► Started ──► Off
 │         │            │
 │         │            │
 └────► Error ◄─────────┘
```

- **Off** — l'instance n'est pas en cours d'exécution.
- **Starting** — le launcher prépare et lance Minecraft.
- **Started** — Minecraft est en cours d'exécution.
- **Error** — une erreur est survenue au démarrage (version manquante, Java incorrect, etc.).

Une fermeture normale du jeu n'est pas signalée comme un crash. Si le processus se termine de façon inattendue, le launcher conserve l'historique des logs et ouvre la fenêtre de console pour l'examiner. Voir [Diagnostic et logs](/docs/fr-FR/Utilisation/diagnostic).

## Gérer les instances

Depuis la barre latérale ou le menu de l'instance, vous pouvez :

- **Renommer** — change le nom ainsi que le dossier sur le disque.
- **Supprimer** — efface l'instance et tout son contenu.
- **Ouvrir le dossier** — accède directement au répertoire de l'instance.
- **Épingler** — place l'instance en haut de la liste.
- **Exporter** — génère un `.mrpack` avec le contenu sélectionné.
- **Importer** — restaure une instance depuis un ZIP compatible avec aperçu avant confirmation.

### Éditeur d'instance

L'éditeur permet de changer la version et le loader, réparer l'installation, ajuster la mémoire et les arguments JVM propres à l'instance, et assigner un profil `options.txt`.

:::warning Changer de version ou de loader
Changer la version ou le loader peut endommager l'installation et empêcher les mods de fonctionner. Le launcher affiche un avertissement avant d'appliquer le changement.
:::

## Profils options.txt

Les profils stockent le contenu d'un `options.txt` et peuvent être appliqués à n'importe quelle instance, manuellement ou avant le lancement. Cette fonctionnalité est **expérimentale**.

- Ils se gèrent depuis **Paramètres → Minecraft → Profils options.txt**.
- Dans l'éditeur de chaque instance, vous choisissez le profil et s'il est appliqué automatiquement au lancement.
- Si l'instance possède déjà un `options.txt`, une sauvegarde est créée avant de le remplacer.
- Lorsqu'un profil est appliqué automatiquement, les changements faits dans le jeu sont perdus au lancement suivant.
- Vous pouvez aussi importer un `options.txt` depuis un fichier ou enregistrer les options actuelles d'une instance comme profil.

## Modpacks

- Importez un `.mrpack` Modrinth ou un ZIP CurseForge.
- Le launcher résout les dépendances et télécharge les bonnes versions.
- Vous pouvez voir un plan avant l'installation et annuler si quelque chose ne vous convient pas.
- La puce du modpack permet de **protéger** le pack pour éviter des changements accidentels, de le **mettre à jour** depuis une version publiée ou un fichier local, et de vérifier les conflits avant d'appliquer.
- Si l'inventaire d'origine manque, la puce propose de **récupérer l'inventaire** pour identifier les mods du pack.

La mise à jour des modpacks est **expérimentale**.

## Télécharger des versions

Utilisez le bouton de téléchargements dans la barre latérale pour ouvrir le **Version Downloader**. Vous pouvez y télécharger :

- Versions Vanilla (release et snapshot).
- Versions Alpha/Beta.
- Fabric, Forge, NeoForge, Quilt et OptiFine.

Les versions téléchargées sont stockées dans le dossier `shared` et partagées entre toutes les instances. Depuis **Paramètres → Minecraft**, vous pouvez choisir d'afficher ou non les snapshots, les versions Alpha et les versions instables des loaders.

## Mémoire RAM

La mémoire globale se configure depuis **Paramètres → Minecraft → Performances (RAM)**. Le launcher affiche une plage recommandée selon la RAM totale de la machine.

Chaque instance peut remplacer la mémoire depuis son éditeur si vous activez la configuration personnalisée. S'il n'y a pas de remplacement, les valeurs globales sont utilisées.
