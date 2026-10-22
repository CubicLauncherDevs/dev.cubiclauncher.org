---
category: usage
order: 60
title: Serveurs et mondes
description: Gérez vos mondes locaux et vos listes de serveurs par instance. Consultez l'état du serveur et connectez-vous rapidement.
---

# Serveurs et mondes

Chaque instance possède sa propre liste de mondes et de serveurs, pour ne pas mélanger les choses entre Vanilla et vos modpacks.

## Mondes

- Liste des mondes locaux avec nom, dossier et version de Minecraft.
- Recherche et tri pour trouver les mondes rapidement.
- Ouvrez le dossier `saves/` pour faire des sauvegardes ou importer un monde.
- Importez un monde depuis un ZIP ou depuis un dossier.
- Supprimez les mondes que vous n'utilisez plus depuis la même vue.

Les mondes sont stockés dans `saves/` dans le dossier de l'instance.

## Serveurs

- Ajoutez des serveurs avec nom, hôte et port.
- Modifiez ou supprimez des serveurs de la liste.
- Le launcher consulte l'état (ping) et affiche le MOTD, la version et les joueurs connectés.
- Les serveurs sont stockés dans la liste de l'instance (`servers.dat`).

## Connexion rapide

- Depuis la vue serveur, vous pouvez lancer Minecraft et rejoindre automatiquement.
- Pour les serveurs compatibles, l'hôte/port est transmis via Quick Play.
- Si le serveur ne répond pas, vérifiez l'hôte, le port et votre connexion ; le ping peut échouer même si le serveur est disponible.

## Importer et migrer

Lors de l'import ou de la migration d'une instance depuis un autre launcher, CubicLauncher copie les mondes (`saves`) et la liste de serveurs (`servers.dat`) avec le reste du contenu. Voir [Migration depuis d'autres launchers](/docs/fr-FR/Utilisation/migration).
