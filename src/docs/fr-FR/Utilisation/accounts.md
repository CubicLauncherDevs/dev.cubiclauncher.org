---
category: usage
order: 10
title: Comptes utilisateur
description: Configurez des comptes Microsoft, Ely.by, CubicAuth, des serveurs Yggdrasil personnalisés ou hors ligne, et gérez les skins et capes.
---

# Comptes utilisateur

CubicLauncher permet d'enregistrer plusieurs comptes et de passer de l'un à l'autre sans fermer le launcher. Chaque instance utilise le compte actif au lancement de Minecraft.

## Ajouter un compte

1. Ouvrez la section utilisateur dans la barre latérale.
2. Choisissez **Ajouter** ou **Ajouter un compte**.
3. Sélectionnez le type de compte.

### Microsoft

Deux méthodes de connexion sont disponibles :

- **Depuis le launcher** — ouvre une fenêtre Microsoft pour terminer la connexion.
- **Avec un code d'authentification** — affiche un lien et un code à saisir manuellement dans le navigateur.

Si vous aviez déjà un compte Microsoft enregistré, vous pouvez le sélectionner au lieu de vous reconnecter. La session est renouvelée automatiquement lorsque c'est possible.

### Ely.by

Utilise le serveur prédéfini `https://account.ely.by/api/authlib-injector`. Après avoir connecté le compte, vous pouvez gérer son skin depuis la page de profil Ely.by et actualiser l'aperçu dans le launcher.

### CubicAuth

Connecte le compte au serveur `https://auth.cubiclauncher.org`. Si vous n'avez pas encore de compte, vous pouvez vous inscrire depuis le lien affiché par le launcher.

### Serveur Yggdrasil / Authlib personnalisé

Permet de saisir l'URL de n'importe quel serveur compatible Yggdrasil/Authlib-injector. Le launcher enregistre le serveur avec le compte.

### Hors ligne

Saisissez un nom de 3 à 16 caractères. Seuls les lettres, chiffres et tirets bas (`_`) sont autorisés. Ce mode ne s'authentifie ni auprès de Microsoft ni auprès d'un serveur externe.

## Gérer les comptes

Depuis le profil utilisateur, vous pouvez :

- **Activer** un compte pour les prochains lancements.
- **Se déconnecter** du compte actif.
- **Supprimer** un compte enregistré.
- Consulter le type de compte et le serveur associé.

Les jetons sont stockés dans le stockage sécurisé du système lorsqu'il est disponible. CubicLauncher ne reçoit jamais votre mot de passe Microsoft.

## Sessions expirées

Si le jeton d'un compte ne peut plus être renouvelé, le launcher affiche un avis et demande de se reconnecter. Le message indique le nom du compte et permet de choisir à nouveau la méthode d'authentification. Les autres comptes et instances ne sont pas modifiés.

## Skins et capes

Les comptes qui le permettent peuvent gérer leur skin et leurs capes depuis le profil.

### Envoyer un skin

- Format accepté : `.png`.
- Vous pouvez glisser l'image sur la zone d'envoi ou cliquer pour la choisir.
- Un aperçu est affiché avant l'enregistrement.
- Les changements sont confirmés avec **Enregistrer les modifications** et peuvent être annulés.

### Modèle classique ou fin

CubicLauncher détecte le modèle à partir des pixels du skin :

- Un skin fin (Alex) sélectionne le modèle **Fin**.
- Un skin classique (Steve) sélectionne le modèle **Classique**.
- Un skin fin **ne peut pas être enregistré comme classique**, car des bandes noires apparaîtraient sur les bras.
- Si la détection ne suffit pas, vous pouvez choisir le modèle manuellement.
- Passer de classique à fin est autorisé.

### Capes

- La liste affiche les capes disponibles sur le compte.
- Vous pouvez équiper, retirer ou changer la cape active.
- Les changements de skin et de cape sont enregistrés ensemble.
- Si vous effectuez trop de changements d'affilée, le launcher affiche un avis de limite de requêtes et vous pouvez réessayer quelques secondes plus tard.

### Vestiaire de skins

Le vestiaire permet d'enregistrer des skins pour les réutiliser :

- Enregistrer le skin actuel avec un nom.
- Renommer ou supprimer des entrées.
- Équiper un skin enregistré sur le compte.

Le vestiaire est stocké dans le dossier `.cubic/skins/` et n'est pas partagé entre les comptes.

### Skins Ely.by

Pour les comptes Ely.by, le launcher ouvre la page de skins du service pour que vous choisissiez ou envoyiez un skin. Au retour, vous pouvez actualiser l'aperçu et la tête depuis le profil.

## Problèmes fréquents

- **Le bouton d'envoi de skin n'apparaît pas** : le compte ou le serveur ne permet pas de changer le skin depuis le launcher.
- **Le skin affiche des bandes noires sur les bras** : un skin fin a été enregistré comme classique. Envoyez-le à nouveau et utilisez le modèle Fin.
- **La session Microsoft expire** : reconnectez-vous depuis l'avis de session expirée.
- **Impossible de se connecter à un serveur personnalisé** : vérifiez l'URL du serveur et sa compatibilité Yggdrasil/Authlib-injector.
