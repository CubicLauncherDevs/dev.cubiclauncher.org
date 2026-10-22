---
category: usage
order: 30
title: Qu'est-ce que Java ?
description: Ce qu'est Java, pourquoi Minecraft en a besoin, comment CubicLauncher gère les JRE et comment configurer la mémoire et les arguments JVM.
---

# Qu'est-ce que Java

Java est un langage de programmation qui s'exécute sur la **JVM** (Java Virtual Machine). Minecraft : Java Edition est écrit en Java, il a donc besoin d'une JVM pour démarrer.

## JRE et JVM

La JVM est fournie dans un **JRE** (Java Runtime Environment), qui inclut la machine virtuelle, les bibliothèques Java et tout le nécessaire pour exécuter le jeu.

CubicLauncher peut utiliser deux types de Java :

- **Géré** : le launcher télécharge et gère le JRE.
- **Externe** : vous utilisez un Java déjà installé sur votre système.

:::info Java n'est pas installé automatiquement
CubicLauncher ne télécharge pas de JRE géré tant que vous ne le demandez pas. Si vous n'avez pas Java installé, ouvrez **Paramètres → Java** et téléchargez la version nécessaire.
:::

## Versions de Java

CubicLauncher peut installer et détecter Java 8, 17, 21 et 25.

En règle générale :

- Java 8 pour les anciennes versions de Minecraft.
- Java 17 pour les versions modernes qui l'exigent.
- Java 21 pour les versions les plus récentes.
- Java 25 est disponible pour les versions ou loaders qui le demandent.

Le choix dépend de ce que déclarent la version du jeu, le loader et les remplacements de l'instance. Le launcher consulte le manifeste et, s'il n'y a pas de version explicite, en déduit une à partir de la version de Minecraft. Pour les anciens Forge/NeoForge, il peut conserver Java 8 ; pour les versions récentes, il passe automatiquement à Java 17 ou 21 lorsque le loader l'exige.

## Fournisseurs de Java

Dans **Paramètres → Java**, vous pouvez choisir le fournisseur pour chaque version :

- **Azul Zulu** — l'option par défaut, équilibrée et disponible pour Java 8, 17, 21 et 25.
- **Eclipse Temurin** — la distribution d'Eclipse, référence d'OpenJDK.
- **BellSoft Liberica** — des compilations avec support à long terme.
- **GraalVM** — souvent plus rapide avec les mods ; disponible pour Java 17 ou supérieur.

L'option **Automatique** utilise Azul Zulu et Eclipse Temurin selon leur disponibilité. Si vous changez le fournisseur d'un JRE déjà installé, le launcher peut vous demander de le désinstaller puis de le réinstaller.

## Où sont stockés les JRE gérés

Les JRE gérés sont stockés dans le dossier partagé, sous `runtimes/jre<version>`. Par défaut, il s'agit de `~/.cubic/shared/runtimes/`, mais si vous changez l'emplacement des fichiers partagés depuis **Paramètres → Stockage**, le chemin des runtimes change aussi.

## Détection de Java externe

Dans **Paramètres → Java**, vous pouvez utiliser **Détecter les chemins**. Le launcher recherche des binaires dans `JAVA_HOME` et dans les emplacements système courants, et affiche les chemins trouvés pour Java 8, 17, 21 et 25. Vous pouvez aussi indiquer un chemin manuel.

## Java par instance

Chaque instance peut utiliser une version de Java différente depuis son éditeur :

- Si l'instance n'a pas de remplacement, la configuration globale est utilisée.
- Si vous activez la configuration personnalisée, vous pouvez choisir la version de Java et ses propres arguments JVM.
- Les arguments de l'instance sont ajoutés après les arguments globaux.

## Paramètres de la JVM

Les paramètres de la JVM sont des options transmises à Java au démarrage de Minecraft. Ils permettent d'ajuster la mémoire, le ramasse-miettes ou les propriétés système.

### Où les configurer

1. Ouvrez les **Paramètres** de CubicLauncher.
2. Allez dans **Java**.
3. Repérez **Arguments JVM** et saisissez les arguments séparés par des espaces ou des retours à la ligne.

Si Minecraft est déjà ouvert, fermez-le et relancez-le pour appliquer les modifications. Vous pouvez aussi définir des arguments JVM par instance depuis l'éditeur de l'instance.

<div class="docs-img-wrap">
  <img src="/jvm-arguments.png" alt="Configuration des paramètres de la JVM dans CubicLauncher" />
</div>

### Paramètres courants

Ces exemples fonctionnent avec les distributions HotSpot de Java 8, 17, 21 et 25, comme Eclipse Temurin :

| Paramètre | À quoi sert-il ? |
| --- | --- |
| `-Xms1G` | Définit à 1 Gio la taille initiale du tas Java, où sont stockés les objets du jeu. |
| `-Xmx4G` | Limite le tas à 4 Gio. Minecraft peut utiliser de la mémoire supplémentaire en dehors de cette limite. |
| `-XX:+UseG1GC` | Sélectionne G1 comme ramasse-miettes, chargé de libérer la mémoire inutilisée. Il est déjà activé par défaut dans de nombreuses installations modernes de Java. |
| `-XX:+ParallelRefProcEnabled` | Active le traitement parallèle des références pendant le ramasse-miettes ; cela peut réduire le temps consacré à cette tâche. |

Par exemple, pour utiliser un tas initial de 1 Gio, un maximum de 4 Gio et le ramasse-miettes G1 :

```text
-Xms1G -Xmx4G -XX:+UseG1GC -XX:+ParallelRefProcEnabled
```

Si vous avez déjà configuré la RAM depuis le launcher, omettez `-Xms` et `-Xmx` du champ des paramètres pour éviter de dupliquer ces réglages :

```text
-XX:+UseG1GC -XX:+ParallelRefProcEnabled
```

Vous pouvez remplacer `4G` par une autre limite selon la mémoire disponible et les besoins de votre modpack, en laissant de la mémoire pour le système et les autres programmes. La valeur de `-Xms` doit être inférieure ou égale à celle de `-Xmx`. Ces réglages ne garantissent pas davantage de FPS : le résultat dépend de votre matériel, de la version de Java et des mods.

## Variables d'environnement Java

Dans **Paramètres → Java → Variables d'environnement**, vous pouvez définir des variables qui seront appliquées au lancement de Minecraft. Utilisez-les uniquement si un mod, un loader ou un guide spécifique le demande.

## Mémoire recommandée

Depuis **Paramètres → Minecraft**, vous pouvez voir une plage recommandée selon votre RAM totale. En règle générale :

- 4 Go ou moins : 2 Go pour Minecraft.
- 8 Go : entre 3 et 4 Go.
- 16 Go ou plus : entre 4 et 8 Go, selon les mods et les shaders.

N'oubliez pas que le système et les autres applications ont aussi besoin de mémoire. La mémoire globale se configure dans **Paramètres → Minecraft → Performances (RAM)** et peut être remplacée par instance.
