---
category: content
order: 10
title: Contenu et Marketplace
description: Installez des mods, resource packs, shader packs et modpacks depuis Modrinth et CurseForge, et mettez à jour vos modpacks depuis le launcher.
---

# Contenu et Marketplace

Le Market intègre des fournisseurs pour rechercher et installer du contenu directement depuis le launcher. Il s'ouvre depuis les sections **Market**, **Ressources** et **Shaders** de chaque instance.

## Fournisseurs

- **Modrinth** : recherche de mods, resource packs et shader packs, avec filtres par version et loader.
- **CurseForge** : recherche de mods, modpacks, texture packs et shaders.
- **Local** : affiche le contenu déjà installé dans votre instance.

## Types de contenu

| Section | Contenu | Disponibilité |
| --- | --- | --- |
| Market | Mods | Instances avec Fabric, Forge, NeoForge ou Quilt |
| Ressources | Resource packs / texture packs | Toutes les instances |
| Shaders | Shader packs | Toutes les instances sauf Vanilla |

Sur de très anciennes versions de Minecraft, les resource packs sont stockés dans le dossier `texturepacks` au lieu de `resourcepacks`. Le launcher détecte le bon dossier selon la version.

## Compatibilité automatique

Le Market filtre selon la version de Minecraft et le loader de votre instance. S'il n'existe pas de version compatible, il vous le signale avant l'installation.

## Installer depuis le catalogue

- Pour les **mods**, le bouton d'installation ouvre un aperçu avec l'arbre des dépendances et les conflits détectés. Vous pouvez vérifier ce qui sera téléchargé avant de confirmer.
- Pour les **resource packs** et les **shaders**, l'installation se fait directement depuis la carte.
- Dans tous les cas, vous pouvez **double-cliquer sur la carte** pour installer sans ouvrir le détail.
- Si c'est déjà installé, la carte l'indique et permet la mise à jour lorsqu'une nouvelle version existe.

## Filtres et tri

Le panneau de filtres permet de rechercher par nom, catégorie, loader, source et état local. Vous pouvez aussi trier par pertinence, nom, téléchargements ou date, et basculer entre Modrinth, CurseForge et Local.

## Mods et dépendances

- Les mods sont installés avec leurs dépendances requises.
- Si un mod est déjà installé, le Market évite de le dupliquer.
- Vous pouvez activer ou désactiver des mods sans les supprimer : ils sont renommés en `.jar.disabled`.
- La vue **Local** affiche les mods installés, leur origine et s'ils appartiennent à un modpack.

## Modpacks (MRPack et CurseForge)

- Importez un `.mrpack` Modrinth ou un ZIP CurseForge.
- Le launcher résout les dépendances et télécharge les bonnes versions.
- Vous pouvez voir un plan avant l'installation et annuler si quelque chose ne vous convient pas.
- La puce du modpack dans l'en-tête de l'instance permet de protéger le pack, de le mettre à jour et de récupérer l'inventaire d'origine.

### Mettre à jour un modpack

La mise à jour des modpacks est **expérimentale**. Depuis la puce du modpack :

1. Choisissez **Mettre à jour le modpack**.
2. Sélectionnez une version publiée ou un fichier local (`.mrpack` / `.zip`).
3. Examinez les fichiers ajoutés, supprimés et modifiés.
4. Résolvez les conflits en conservant votre fichier ou en utilisant celui du pack.
5. Appliquez la mise à jour.

Si le pack est protégé, vous devez d'abord le déverrouiller pour modifier ses mods.

## Où est-ce stocké

Chaque instance conserve son propre dossier `mods/`, `resourcepacks/` ou `texturepacks/` et `shaderpacks/`. Les versions du jeu et les bibliothèques sont partagées dans le dossier `shared`, qui par défaut est `~/.cubic/shared/` et peut être modifié depuis **Paramètres → Stockage**.

## Dépannage

- Si le Market n'apparaît pas, vérifiez que l'instance possède un loader compatible.
- Si un mod n'apparaît pas, essayez de changer la version, le loader ou la source dans les filtres.
- Si le contenu ne s'installe pas, vérifiez la file de téléchargements et la console de l'instance. Voir [Diagnostic et logs](/docs/fr-FR/Utilisation/diagnostic).
