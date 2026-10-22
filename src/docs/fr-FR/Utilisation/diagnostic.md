---
category: troubleshooting
order: 20
title: Diagnostic et logs
description: Utilisez la console intégrée, l'historique des logs, le nettoyage des données sensibles et l'envoi vers mclo.gs pour diagnostiquer les problèmes.
---

# Diagnostic et logs

La console intégrée vous aide à comprendre ce qui se passe au démarrage du jeu ou en cas d'échec.

## Console et fenêtre de logs

- Chaque instance possède une console en direct avec défilement automatique.
- Le menu d'actions permet d'ouvrir la fenêtre de logs, de copier le contenu ou de l'envoyer vers mclo.gs.
- La fenêtre de logs conserve l'historique de la session et permet de filtrer par niveau.
- Le menu est identique dans la vue de l'instance et dans la fenêtre dédiée, afin que les actions ne changent pas selon l'endroit où vous êtes.

## Options de console

Dans **Paramètres → Minecraft → Options de console**, vous pouvez configurer :

- **Limite de l'historique** — nombre maximal de lignes conservées par instance (100 à 5000). La valeur par défaut est 3000.
- **Afficher les étiquettes de niveau** — affiche ou masque les étiquettes de niveau des logs. Les masquer rend le filtrage par niveau plus difficile et n'est pas recommandé.

## Aperçu dans la vue principale

Pendant qu'une instance démarre ou s'exécute, l'en-tête affiche la dernière ligne de log pertinente comme aperçu.

## Fermetures normales et crashes

- Une fermeture normale du jeu n'est pas signalée comme un crash.
- Si le processus se termine de façon inattendue, le launcher détecte le crash et ouvre la console avec l'historique.
- L'historique du crash est conservé pendant **1 heure** pour que vous puissiez l'examiner ou l'envoyer même après la fermeture de la fenêtre.
- Si vous forcez la fermeture depuis le launcher ou si le processus s'arrête par une action contrôlée, aucun crash n'est généré.

## Confidentialité : nettoyage des données sensibles

Le launcher nettoie automatiquement les informations sensibles avant d'afficher ou d'enregistrer les logs :

- Jetons d'accès/refresh, ClientToken et en-têtes Authorization.
- Identifiants de session, adresses e-mail et adresses IP.
- Données propres à l'utilisateur actif (nom d'utilisateur, UUID, jetons) avec un filtre dédié.

## Envoi vers mclo.gs

Utilisez l'action **Envoyer** du menu des logs pour générer un lien public sur mclo.gs et le partager avec le support. C'est idéal pour signaler un problème avec le log complet.

## Signaler un problème

Si CubicLauncher n'affiche même pas l'interface sous Linux, consultez [Problèmes graphiques sous Linux : NVIDIA et Wayland](/docs/fr-FR/guides/nvidia-wayland). Le guide explique comment capturer la sortie du terminal et tester `WEBKIT_DISABLE_COMPOSITING_MODE=1 cubiclauncher` ; vous n'avez pas besoin de lancer Minecraft pour enquêter sur une défaillance de la fenêtre du launcher.

Incluez dans votre rapport :

- Version de CubicLauncher et du système d'exploitation.
- Étapes pour reproduire le problème.
- Lien vers le log sur mclo.gs et, le cas échéant, le modpack utilisé.
- Si le problème survient au démarrage, la version de Minecraft, le loader et le Java sélectionné.
