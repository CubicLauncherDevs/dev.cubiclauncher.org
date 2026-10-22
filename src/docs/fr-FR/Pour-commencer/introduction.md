---
category: getting-started
order: 10
title: Introduction à CubicLauncher
description: Ce qu'est CubicLauncher, ce qu'il peut faire et comment démarrer en quelques minutes.
---

# Introduction

CubicLauncher est un launcher open source pour Minecraft : Java Edition. Il permet de créer et gérer des instances isolées, d'installer des versions et des loaders, de gérer des comptes, de télécharger du contenu depuis Modrinth et CurseForge et de personnaliser l'apparence avec des thèmes.

## Fonctionnalités principales

- Instances indépendantes avec leur propre configuration, mods, resource packs, shader packs, captures d'écran, mondes et serveurs.
- Prise en charge de Vanilla, Fabric, Forge, Quilt et NeoForge.
- Comptes Microsoft, Ely.by, CubicAuth, serveurs Yggdrasil/Authlib personnalisés et mode hors ligne.
- Contenu depuis Modrinth et CurseForge : mods, resource packs, shader packs et modpacks.
- Gestion des mondes et des serveurs par instance, avec ping et connexion rapide.
- Skins et capes, vestiaire de skins et détection automatique du modèle classique ou fin.
- Java géré par le launcher ou externe, avec les fournisseurs Azul Zulu, Eclipse Temurin, BellSoft Liberica et GraalVM.
- Console intégrée avec historique, nettoyage des données sensibles et envoi vers mclo.gs.
- Thèmes (v1 JSON et v2 CBTH), arrière-plans, icônes et polices personnalisées.
- Interface disponible en espagnol, anglais, français, allemand, ukrainien, japonais et russe.

## Où sont stockées mes données

Par défaut, les données se trouvent dans votre dossier utilisateur, sous `.cubic` :

```
~/.cubic/
├── instances/   # Instances et leur contenu
├── shared/      # Versions, bibliothèques, assets et runtimes Java partagés
├── settings/    # Configuration du launcher (settings.cub)
├── themes/      # Thèmes installés
└── skins/       # Vestiaire de skins
```

Les dossiers `instances` et `shared` peuvent être déplacés vers un autre disque depuis **Paramètres → Stockage**. Le launcher déplace les instances avec des liens physiques lorsque c'est possible et permet de vider les fichiers partagés pour libérer de l'espace ; les versions et bibliothèques sont retéléchargées au besoin.

## Démarrage rapide

1. Installez le launcher en suivant le guide [Installation](/docs/fr-FR/Pour-commencer/install).
2. Ouvrez CubicLauncher et téléchargez la version du jeu souhaitée.
3. Créez une instance avec cette version et, si vous le souhaitez, choisissez un loader.
4. Connectez-vous avec Microsoft, Ely.by/CubicAuth, un serveur Yggdrasil personnalisé, ou utilisez le mode hors ligne.
5. Ouvrez le Market pour installer des mods, resource packs ou shaders, ou importez un modpack.
6. Réglez la RAM, Java, l'interface et les notifications depuis **Paramètres**.

## Liens rapides

- [Installation](/docs/fr-FR/Pour-commencer/install)
- [Instances](/docs/fr-FR/Utilisation/instances)
- [Contenu et Marketplace](/docs/fr-FR/Utilisation/marketplace)
- [Comptes utilisateur](/docs/fr-FR/Utilisation/accounts)
- [Configuration du launcher](/docs/fr-FR/Avance/config)
