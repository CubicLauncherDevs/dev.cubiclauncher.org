---
category: usage
order: 40
title: Configuration du launcher
description: Guide de toutes les sections des paramètres de CubicLauncher : stockage, interface, notifications, Minecraft, téléchargements, console, Java et mises à jour.
---

# Configuration du launcher

Les paramètres s'ouvrent depuis l'engrenage de la barre latérale et sont organisés en quatre onglets : **Launcher**, **Minecraft**, **Personnaliser** et **Java**. Les modifications sont enregistrées automatiquement.

## Onglet Launcher

### Général

- **Langue** — change la langue de l'interface. Espagnol, anglais, français, allemand, ukrainien, japonais et russe sont disponibles.
- **Rechercher les mises à jour au démarrage** — vérifie s'il existe une nouvelle version à l'ouverture du launcher.
- **Présence Discord** — affiche l'activité de CubicLauncher sur Discord.
- **Masquer le launcher pendant le jeu** — réduit ou masque la fenêtre au lancement de Minecraft.
- **Ouvrir la console au démarrage des instances** — ouvre la fenêtre de logs au lancement d'une instance.
- **Notifications mises en avant** — utilise des avis grands et centrés avec des titres en majuscules et des messages plus lisibles.
- **Tester la notification** — affiche un aperçu des notifications actuelles.

### Stockage

Permet de choisir sur quel disque sont stockées les instances et les fichiers partagés :

- **Emplacement des instances** — affiche le chemin actuel et le nombre d'instances. Vous pouvez le changer ou rétablir l'emplacement par défaut.
- **Déplacement avec liens physiques** — si le disque cible le permet, les instances sont déplacées sans dupliquer l'espace. Si la cible est sur un autre disque, les données sont copiées.
- **La source n'est supprimée** qu'une fois chaque instance complète au nouvel emplacement. En cas d'échec, le launcher indique les fichiers qui n'ont pas pu être déplacés.
- **Fichiers partagés** — affiche l'espace utilisé par les versions, bibliothèques, assets et runtimes. Vous pouvez changer l'emplacement, le rétablir ou supprimer tout le contenu.
- Supprimer les fichiers partagés ne touche pas vos mondes ni vos réglages : les versions et bibliothèques sont retéléchargées au lancement d'une instance.
- Le nouveau dossier de fichiers partagés doit être vide. Fermez Minecraft et attendez la fin des téléchargements avant de modifier ces chemins.

La configuration est stockée dans `settings.cub`, et les chemins personnalisés sont lus au démarrage du launcher.

### Thèmes

- Affiche le thème actif.
- **Importer un thème** — charge un ZIP ou un `.cbth`.
- **Parcourir les thèmes** — ouvre le catalogue web de thèmes.
- **Exporter** — enregistre le thème actif pour le partager.
- **Supprimer** — supprime un thème installé par l'utilisateur.

### Performances

- **Réduire les animations de l'interface**.
- **Désactiver les effets de flou**.
- **Désactiver les animations de chargement continues**.
- **Désactiver l'animation de la visionneuse 3D de skin**.
- **Réduire les animations des logs**.

Ces options aident sur du matériel modeste ou si vous préférez une interface plus sobre.

### Mises à jour

- Affiche la version actuelle et si une mise à jour est disponible.
- **Canal de mise à jour** — Stable ou Pré-version.
- Permet de rechercher les mises à jour, de voir les notes de version, de télécharger et d'installer.
- La date de la dernière vérification réussie apparaît dans cette section.

### À propos

Contient des liens vers Discord, le code open source et le signalement de problèmes.

## Onglet Minecraft

### Performances (RAM)

- **Mémoire minimale** et **maximale** en Go.
- **Utiliser la RAM recommandée** calcule une plage selon la mémoire totale de la machine.
- La mémoire globale est utilisée lorsqu'une instance n'a pas de remplacement.

### Options Minecraft

- **Afficher les Snapshots**.
- **Afficher les versions Alpha**.
- **Afficher les versions instables des loaders**.

Ces options influent sur les versions affichées dans le téléchargeur et lors de la création d'instances.

### Fournisseur de téléchargements

- **Officiel (Mojang)** — serveurs officiels ; recommandé hors de Chine.
- **BMCLAPI (Chine)** — miroir pour les joueurs en Chine avec des téléchargements lents. Si le miroir échoue, le launcher utilise les serveurs officiels en secours.

Le fournisseur s'applique aux métadonnées, assets, bibliothèques et à l'installation de Forge, NeoForge, Fabric et OptiFine.

### Options de console

- **Limite de l'historique** — lignes conservées par instance (100 à 5000).
- **Afficher les étiquettes de niveau** — utile pour filtrer les logs. Les masquer n'est pas recommandé.

### Profils options.txt

- Créer, modifier, importer et supprimer des profils `options.txt`.
- Assigner un profil à une instance depuis son éditeur.
- Appliquer le profil manuellement ou automatiquement avant le lancement.
- Lors du remplacement d'un `options.txt` existant, une sauvegarde est créée.

:::warning Fonctionnalité expérimentale
Les profils `options.txt` peuvent changer dans de futures versions. Appliquer un profil automatiquement remplace le fichier de l'instance ; les changements faits dans le jeu seront perdus au lancement suivant.
:::

## Onglet Personnaliser

### Interface

- **Échelle de l'interface** — change la taille de toute la fenêtre. 100 % est la taille d'origine.
- **Densité** — Du thème, Compacte ou Confortable. Ajuste l'espacement entre les cartes, listes et options sans changer la police.
- **Police** — Du thème ou l'une des polices incluses dans le launcher.
- **Réinitialiser l'interface** — revient aux valeurs par défaut.

### Notifications

- Activer ou désactiver la personnalisation des notifications.
- **Position** — six coins ou bords de l'écran.
- **Taille du cadre** — Compact, Normal ou Large.
- **Taille du titre** et **du message**.
- **Durée** — s'applique aux avis temporaires ; les téléchargements restent visibles jusqu'à leur fin.
- **Titre en majuscules** et **titre en gras**.
- **Réinitialiser les notifications** et aperçu.

## Onglet Java

### Runtimes Java

Pour Java 8, 17, 21 et 25 :

- Voir si le JRE est installé et quelle version il utilise.
- Choisir le **fournisseur** : Automatique, Azul Zulu, Eclipse Temurin, BellSoft Liberica ou GraalVM.
- **Installer** ou **désinstaller** le JRE géré.
- **Détecter les chemins** pour trouver des Java externes.
- Indiquer des chemins manuels pour chaque version.

Les JRE gérés sont stockés dans le dossier partagé (`shared/runtimes/jre<version>`).

### Avancé

- **Arguments JVM** — appliqués globalement au lancement de Minecraft.
- **Variables d'environnement** — ajoutées au processus Java. Utilisez-les uniquement si un guide ou un mod le demande.

Les arguments et variables d'une instance sont ajoutés après les globaux. Voir [Qu'est-ce que Java](/docs/fr-FR/Utilisation/java) pour des exemples de paramètres.

## Réinitialiser les paramètres

Chaque section possède son propre bouton de réinitialisation lorsque cela s'applique. Si vous avez besoin d'une configuration propre, vérifiez aussi les chemins de stockage et les profils Java avant de supprimer des données.
