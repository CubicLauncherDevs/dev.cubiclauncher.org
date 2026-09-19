---
title: Qu'est-ce que Java ?
description: Qu'est-ce que Java et pourquoi est-il nécessaire pour lancer le jeu ?
---

# Java ?

Qu'est-ce que Java et pourquoi est-il nécessaire pour lancer le jeu ?

Java est un langage de programmation, pas aussi courant que d'autres car il utilise quelque chose appelé la JVM. La JVM est un programme qui se charge de lancer les programmes faits en Java, comme Minecraft lui-même.

> Et oui, Minecraft s'appelle Minecraft Java Edition pour cette raison :v

## JVM ?
Comme je l'ai dit plus tôt, pour lancer des programmes Java, on utilise un programme appelé JVM. Cela vient dans des "kits" appelés JRE ou Java Runtime Environment. Cela inclut tout le nécessaire pour que la JVM fonctionne, à la fois les bibliothèques JVM et la bibliothèque standard Java.

## Comment le télécharger ?
Dans Cubic, vous avez deux options pour utiliser Java. Vous pouvez utiliser un JRE géré par le launcher ou vous pouvez également utiliser un JRE externe si vous préférez. Cubic n'installe PAS automatiquement le JRE géré, vous devez aller dans la section de configuration et le télécharger.

### Où ?
Dans la section Java de la configuration, vous pouvez ouvrir le menu des environnements Java et télécharger ceux que vous souhaitez.
<div class="docs-img-wrap">
  <img src="https://i.ibb.co/60thDTQw/java.png" alt=">_<" />
</div>

### Quelles versions télécharger ?
Généralement : Java 8 pour les versions inférieures à 1.16.5, Java 17 pour les versions inférieures à 1.20.4, Java 21 pour les versions inférieures à 1.21.11 et Java 25 pour les versions supérieures à celle mentionnée précédemment (1.21.11 pour ceux qui n'ont pas de compréhension en lecture).

## Paramètres de la JVM

Les paramètres de la JVM sont des options transmises à Java au démarrage de Minecraft. Ils permettent d'ajuster l'exécution du jeu, par exemple la gestion de la mémoire, le ramasse-miettes ou les propriétés système de Java.

### Où les configurer ?

1. Ouvrez les **Paramètres** de CubicLauncher.
2. Allez dans la section **Java**.
3. Repérez l'option **paramètres de la JVM** et saisissez les arguments souhaités, séparés par des espaces.

Ces paramètres sont utilisés au démarrage du jeu. Si Minecraft est déjà ouvert, fermez-le et relancez-le pour appliquer les modifications.

<div class="docs-img-wrap">
  <img src="jvm-arguments.png" alt="Configuration des paramètres de la JVM dans CubicLauncher" />
</div>

### Paramètres utilisables dans Minecraft

Ces exemples fonctionnent avec les distributions de Java 8, 17, 21 et 25 basées sur HotSpot, comme Eclipse Temurin :

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
