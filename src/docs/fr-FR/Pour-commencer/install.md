---
category: getting-started
order: 20
title: Installation
description: Installez CubicLauncher sur Windows, Linux, macOS, Nix/NixOS et Docker. Suivez les instructions correspondant à votre système d'exploitation pour commencer.
---

# Installation

Installer CubicLauncher est un processus simple. Suivez les instructions correspondant à votre système d'exploitation pour commencer.

## Prérequis

CubicLauncher n'a pas besoin que Java soit installé pour s'ouvrir, mais il en a besoin pour jouer à Minecraft. Vous pouvez utiliser les JRE gérés du launcher ou configurer un Java externe. Voir [Qu'est-ce que Java](/docs/fr-FR/Utilisation/java).

En règle générale, CubicLauncher peut installer et détecter Java 8, 17, 21 et 25 :

- **Java 8** pour les anciennes versions de Minecraft.
- **Java 17** pour les versions modernes qui l'exigent.
- **Java 21** pour les versions les plus récentes.
- **Java 25** pour les versions ou loaders qui le demandent.

:::info Astuce
CubicLauncher n'a pas besoin de Java installé sur le système pour fonctionner, mais vous avez besoin de Java pour jouer à Minecraft.
:::

## Windows

1. Téléchargez l'installateur `.exe` ou `.msi` depuis notre page de téléchargements.
2. Exécutez le fichier et suivez les étapes de l'installateur.
3. Une fois terminé, CubicLauncher sera prêt sur votre bureau.

## Linux

Nous offrons le support pour plusieurs formats sur Linux :

- **RPM :** Téléchargez, accordez les permissions d'exécution et ouvrez.
- **AppImage :** Téléchargez, accordez les permissions d'exécution et ouvrez.
- **Debian/Ubuntu :** Installez le paquet `.deb` avec `sudo apt install ./cubiclauncher.deb`.
- **ARCH PKGBUILD :** La compilation locale est obligatoire. Les binaires générés par les CI GitHub (Ubuntu) peuvent ne pas être compatibles avec Arch Linux en raison de son modèle de rolling release. <a href="/docs/fr-FR/guides/arch" class="text-blue-400 hover:underline">Guide</a>.
- **Nix/NixOS :** Installez le canal stable avec `nix profile add github:CubicLauncherDevs/CubicLauncher/latest-release`. Configurez éventuellement le cache Cachix avec `nix run nixpkgs#cachix -- use cubiclauncher`. <a href="/docs/fr-FR/guides/nix" class="text-blue-400 hover:underline">Guide</a>.
- **Docker :** Récupérez l'image multi-architecture avec `docker pull ghcr.io/cubiclauncherdevs/cubiclauncher:latest` et exécutez-la avec accès à X11 ou Wayland, au GPU et à un volume de données. <a href="/docs/fr-FR/guides/docker" class="text-blue-400 hover:underline">Guide</a>.

### NVIDIA et Wayland : fenêtre vide ou plantages

Si le launcher reste vide, scintille ou se ferme au redimensionnement, consultez [Problèmes graphiques sous Linux : NVIDIA et Wayland](/docs/fr-FR/guides/nvidia-wayland). Ce guide explique `WEBKIT_DISABLE_COMPOSITING_MODE=1 cubiclauncher`, les alternatives WebKitGTK et l'application du réglage à un raccourci.

## macOS

1. Téléchargez le fichier correspondant (`.dmg`, `x64.dmg`, `.app.tar.gz` ou `x64.app.tar.gz`).
2. Si vous avez téléchargé un `.dmg` ou `x64.dmg`, ouvrez-le et glissez **CubicLauncher** dans votre dossier Applications.
3. Si vous avez téléchargé un `.app.tar.gz` ou `x64.app.tar.gz`, décompressez-le et déplacez **CubicLauncher.app** dans votre dossier Applications.
4. La première fois que vous l'ouvrez, il peut être nécessaire d'autoriser l'exécution depuis **Préférences Système > Sécurité et Confidentialité**.
