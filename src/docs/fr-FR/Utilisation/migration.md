---
category: usage
order: 50
title: Migration depuis d'autres launchers
description: Importez des profils du launcher officiel, des instances MultiMC/Prism/PolyMC/Pinecone/Freesm ou de X Minecraft Launcher (XMCL) sans perdre vos données.
---

# Migration depuis d'autres launchers

Vous pouvez migrer vos installations existantes sans rien perdre. CubicLauncher copie les données et laisse la source intacte.

## Ce qui peut être migré

- **Launcher officiel** — les profils qui utilisent `.minecraft`.
- **MultiMC et forks** — MultiMC, PolyMC, Prism Launcher, PineconeMC et Freesm Launcher.
- **X Minecraft Launcher (XMCL)** — les instances enregistrées dans son dossier de données.

XMCL peut contenir des instances Bedrock ou des composants que Cubic ne peut pas réinstaller, comme OptiFine ou LabyMod. Ces cas apparaissent comme non pris en charge et ne sont pas copiés.

## Comment migrer

1. Ouvrez **Créer une instance → Local → Migrer**.
2. Choisissez la source : Launcher officiel, MultiMC (forks) ou X Minecraft Launcher.
3. Cliquez sur **Rechercher les installations** ou **Choisir un dossier** :
   - Officiel : le dossier `.minecraft` avec `launcher_profiles.json`.
   - MultiMC/Prism/PolyMC/Pinecone/Freesm : le dossier du launcher, son dossier `instances` ou une instance précise.
   - XMCL : le dossier de données contenant `instances.json` ou le dossier `instances`.
4. Sélectionnez les instances ou profils à copier et vérifiez leurs versions.
5. Ajustez le nom que chaque instance aura dans Cubic si nécessaire.
6. Confirmez avec **Migrer**. L'assistant affiche la progression et un résumé par instance.

## Ce qui est copié et comment

- Mondes, mods, resource packs, shader packs, options du jeu, captures d'écran, serveurs et plusieurs fichiers de configuration de mods.
- Les profils officiels qui partageaient `.minecraft` obtiennent leur propre dossier dans Cubic, évitant les conflits.
- Les versions et loaders sont installés depuis la file de téléchargements du launcher si nécessaire.
- Les comptes sont toujours configurés depuis CubicLauncher ; les jetons ne sont pas migrés.

La liste des dossiers et fichiers copiés inclut, entre autres : `mods`, `resourcepacks`, `shaderpacks`, `saves`, `screenshots`, `config`, `scripts`, `defaultconfigs`, `kubejs`, `options.txt`, `optionsof.txt`, `servers.dat`, `texturepacks`, `optionsshaders.txt`, les cartes JourneyMap et les données Xaero.

## Compatibilité et limites

- Fabric et son `Intermediary` sont détectés correctement ; NeoForge aussi, via ses arguments.
- MultiMC : les composants publiés sont réinstallés ; les modifications locales des bibliothèques ou des arguments ne sont pas copiées.
- XMCL : Fabric, Forge, NeoForge et Quilt sont détectés. La mémoire et l'icône sont migrées lorsqu'elles sont disponibles.
- Les composants inconnus et les patchs du jeu de base apparaissent comme non pris en charge.
- Les liens symboliques dans les données copiées ne sont pas pris en charge.
- Les fichiers de compte, jetons et identifiants ne sont pas migrés.

## Annulation sûre

Vous pouvez annuler pendant la copie. Les fichiers temporaires et l'instance incomplète sont supprimés ; les instances déjà terminées sont conservées. Fermer l'assistant ou changer d'onglet annule aussi la migration en attente.

## Après la migration

- Vérifiez la version et le loader de chaque instance.
- Attendez la fin des téléchargements de versions et de loaders en attente.
- Connectez-vous avec vos comptes depuis CubicLauncher.
- Si une instance ne démarre pas, consultez sa console et voir [Diagnostic et logs](/docs/fr-FR/Utilisation/diagnostic).
