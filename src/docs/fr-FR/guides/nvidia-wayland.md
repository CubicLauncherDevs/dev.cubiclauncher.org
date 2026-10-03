---
category: troubleshooting
order: 30
title: Problèmes graphiques sous Linux : NVIDIA et Wayland
description: Fenêtre blanche, scintillements et plantages de CubicLauncher avec NVIDIA et Wayland. Utilisation de WEBKIT_DISABLE_COMPOSITING_MODE=1 et alternatives WebKitGTK.
---

# Problèmes graphiques sous Linux : NVIDIA et Wayland

Sous Linux, CubicLauncher utilise Tauri et WebKitGTK pour afficher son interface. Certaines combinaisons de WebKitGTK, du pilote NVIDIA et du compositeur peuvent provoquer des fenêtres vides, des scintillements ou des plantages. Ces problèmes peuvent aussi survenir sous X11 ; utiliser NVIDIA ou Wayland ne signifie pas automatiquement qu'un contournement est nécessaire.

Autres langues : [Español](/docs/es-ES/guias/nvidia-wayland) · [English](/docs/en-EN/guides/nvidia-wayland).

## Contournement rapide signalé pour CubicLauncher

Si le launcher n'affiche pas correctement sa fenêtre, fermez-le complètement, y compris dans la zone de notification, puis exécutez :

```bash
WEBKIT_DISABLE_COMPOSITING_MODE=1 cubiclauncher
```

Un utilisateur de CubicLauncher avec NVIDIA et Wayland a signalé que cette commande résolvait son problème. Le [guide officiel de Tauri sur les problèmes graphiques sous Linux](https://v2.tauri.app/develop/debug/linux-graphics/) documente également cette variable comme dernier recours, notamment pour les plantages lors du redimensionnement. Les versions exactes du pilote et du compositeur de ce cas ne sont pas disponibles ; ce témoignage ne définit donc pas une liste de systèmes affectés.

Pour une AppImage, remplacez le nom de fichier de l'exemple par le vôtre :

```bash
WEBKIT_DISABLE_COMPOSITING_MODE=1 ./CubicLauncher.AppImage
```

:::info Effet du réglage
Cette variable désactive la composition accélérée de WebKitGTK. Elle peut réduire la fluidité de l'interface et augmenter le travail du processeur. Elle ne désactive pas à elle seule l'accélération graphique de Minecraft : le jeu possède son propre moteur de rendu. Elle s'applique à ce lancement et n'est pas enregistrée comme préférence.
:::

## Symptômes courants

- La fenêtre s'ouvre mais reste blanche ou vide.
- L'interface scintille, particulièrement lors du redimensionnement.
- L'application se ferme lors du redimensionnement, parfois sans message explicite.
- Le terminal affiche des erreurs telles que :

```text
AcceleratedSurfaceDMABuf was unable to construct a complete framebuffer
Gdk-Message: Error 71 (Protocol error) dispatching to Wayland display.
```

Tauri associe beaucoup de ces problèmes à l'échange de buffers graphiques entre WebKitGTK et le pilote. Une fenêtre vide n'identifie pas une cause unique : les anciens rapports WebKit regroupent plusieurs problèmes aux symptômes similaires.

## Diagnostic et alternatives

Testez une seule option à la fois et fermez complètement CubicLauncher entre les essais. Les commandes ci-dessous supposent que vous n'avez pas déjà exporté ces réglages ; sinon, retirez-les avant de comparer les résultats. Utilisez le contournement le moins restrictif qui résout votre problème.

### 1. Mettre à jour et vérifier l'environnement

Mettez à jour CubicLauncher, WebKitGTK et le pilote NVIDIA avec les outils prévus par votre distribution. Redémarrez si le noyau ou le pilote a été mis à jour. Sur Arch, effectuez une mise à jour complète du système et consultez le [guide d'installation](/docs/fr-FR/guides/arch).

Pour identifier la session et le pilote :

```bash
printenv XDG_SESSION_TYPE XDG_CURRENT_DESKTOP
nvidia-smi
```

`XDG_SESSION_TYPE` indique généralement `wayland` ou `x11`. Si cette variable est vide, vérifiez la session dans votre environnement de bureau. Sur les systèmes hybrides, `nvidia-smi` ne permet pas à lui seul de déterminer quel GPU affiche la fenêtre du launcher.

Tauri recommande aussi de vérifier le *kernel mode setting* (KMS) de NVIDIA :

```bash
cat /sys/module/nvidia_drm/parameters/modeset
```

`Y` signifie activé ; `N`, désactivé. Si le fichier n'existe pas, vérifiez quel pilote est chargé. Si vous n'avez pas le droit de le lire, vous pouvez consulter le même fichier avec `sudo cat`. Lorsque KMS est désactivé, suivez les instructions de votre distribution pour l'activer ; Tauri mentionne `nvidia_drm.modeset=1`, notamment pour les anciens pilotes. Il n'est pas nécessaire d'ajouter ce paramètre si KMS est déjà activé.

### 2. Tester sans synchronisation explicite NVIDIA

Pour certaines erreurs Wayland, notamment `Error 71`, Tauri propose :

```bash
__NV_DISABLE_EXPLICIT_SYNC=1 cubiclauncher
```

Ce réglage modifie le comportement de synchronisation du pilote sans désactiver la composition accélérée de WebKit. Son efficacité dépend du pilote et du compositeur.

### 3. Tester sans le moteur de rendu DMA-BUF

Pour les erreurs de framebuffer, les fenêtres vides ou si l'essai précédent n'aide pas :

```bash
WEBKIT_DISABLE_DMABUF_RENDERER=1 cubiclauncher
```

Ce réglage évite le chemin de rendu DMA-BUF de WebKitGTK. Il peut sacrifier un chemin plus rapide, mais ne revient pas à désactiver toute la composition accélérée. Cette alternative est documentée par Tauri et dans les rapports WebKitGTK.

### 4. Désactiver la composition accélérée

Si les alternatives précédentes ne fonctionnent pas, essayez le contournement rapide :

```bash
WEBKIT_DISABLE_COMPOSITING_MODE=1 cubiclauncher
```

Comparez la stabilité à l'ouverture, au redimensionnement et pendant l'utilisation du launcher. Si c'est la seule option efficace, vous pouvez la conserver pour CubicLauncher et réessayer sans elle après une mise à jour du système.

### Essai supplémentaire avec XWayland

Si votre session Wayland dispose de XWayland et que GTK inclut le backend X11, vous pouvez comparer le comportement avec :

```bash
GDK_BACKEND=x11 cubiclauncher
```

Cette commande sélectionne X11 pour l'application GTK ; elle ne change pas toute votre session de bureau. Si XWayland est absent ou qu'aucun serveur X n'est accessible, une erreur d'ouverture de l'affichage peut apparaître. Un essai réussi aide au diagnostic, mais ne garantit pas la disparition de tous les problèmes NVIDIA sous X11.

## Appliquer le réglage au raccourci

Après avoir confirmé quelle variable fonctionne, vous pouvez l'appliquer au lancement de CubicLauncher depuis le menu des applications :

1. Localisez son fichier `.desktop`, généralement dans `/usr/share/applications/` ou `/usr/local/share/applications/`. Le nom dépend du paquet.
2. Copiez-le dans `${XDG_DATA_HOME:-$HOME/.local/share}/applications/`, en créant le répertoire si nécessaire et en conservant le même nom de fichier. Si une copie personnelle existe déjà, modifiez cette copie.
3. Dans la ligne `Exec=`, ajoutez `env WEBKIT_DISABLE_COMPOSITING_MODE=1` avant l'exécutable existant. Conservez son chemin, ses arguments et les codes comme `%u` ou `%U`.

Par exemple, **si la ligne d'origine est** `Exec=cubiclauncher %U`, elle devient :

```ini
Exec=env WEBKIT_DISABLE_COMPOSITING_MODE=1 cubiclauncher %U
```

Pour une AppImage, conservez son chemin absolu, entre guillemets s'il contient des espaces. `Exec` n'est pas interprété comme une commande shell : n'utilisez ni `~`, ni `$HOME`, ni une affectation de variable sans `env`. Si le fichier contient `DBusActivatable=true`, remplacez cette valeur par `false` dans la copie personnelle pour que le bureau utilise `Exec`.

Si une autre variable suffit, utilisez-la à la place de celle de l'exemple. Rouvrez l'application depuis le menu ; certains bureaux peuvent nécessiter de rafraîchir le menu ou de fermer puis rouvrir la session. Un alias de terminal ne modifie pas le raccourci du menu.

## Annuler les réglages et comparer

Si vous avez seulement utilisé un préfixe dans le terminal, fermez le launcher et relancez normalement `cubiclauncher`. Si vous avez modifié le raccourci, restaurez sa ligne `Exec` et toute modification de `DBusActivatable`, ou retirez la copie personnelle si vous l'avez créée uniquement pour ce réglage. Les copies personnelles peuvent aussi masquer les futures modifications du raccourci fourni par le paquet.

Si vous avez exporté des variables dans votre session, vous pouvez tester sans les quatre variables décrites ici :

```bash
env -u WEBKIT_DISABLE_COMPOSITING_MODE -u WEBKIT_DISABLE_DMABUF_RENDERER -u __NV_DISABLE_EXPLICIT_SYNC -u GDK_BACKEND cubiclauncher
```

Appliquer les variables uniquement au launcher facilite les comparaisons. Les variables d'environnement peuvent être transmises aux processus enfants ; un contournement ciblé ne devrait pas devenir un réglage global du bureau.

## Informations à joindre à un signalement

- Version de CubicLauncher et format installé : AUR, AppImage, `.deb`, `.rpm` ou Nix.
- Distribution, noyau, bureau/compositeur et type de session.
- Modèle de GPU, version du pilote et, si le paquet utilise les bibliothèques système, version de WebKitGTK. Sur Arch, vous pouvez consulter `pacman -Q webkit2gtk-4.1`.
- Si le problème apparaît au démarrage, au redimensionnement ou à l'ouverture d'une vue précise.
- Résultat de chaque essai et commande exacte qui a fonctionné.

Pour enregistrer la sortie d'un lancement normal :

```bash
cubiclauncher 2>&1 | tee cubiclauncher-graphiques.log
```

Relisez le fichier avant de le partager : la sortie du terminal ne passe pas nécessairement par le nettoyage des données de la console intégrée. Si le launcher ne s'ouvre pas, joignez cette sortie ; un log Minecraft n'est pas nécessaire. Consultez [Diagnostic du launcher](/docs/fr-FR/Avance/debug) ou le [Support](/docs/fr-FR/guides/support).

## Sources

Consultées le 3 octobre 2026. Les résultats dépendent des versions installées ; les rapports historiques ne signifient pas que toutes les versions actuelles sont affectées.

- [Tauri : Linux Graphics Issues](https://v2.tauri.app/develop/debug/linux-graphics/) — symptômes, KMS et contournements graphiques.
- [Tauri : Webview Versions](https://v2.tauri.app/reference/webview-versions/) — WebKitGTK comme moteur sous Linux.
- [WebKitGTK : rapport 261874](https://bugs.webkit.org/show_bug.cgi?id=261874) — contexte NVIDIA et DMA-BUF ; regroupe plusieurs causes et a été fermé avec la résolution MOVED.
- [GTK 3 : Running GTK Applications](https://docs.gtk.org/gtk3/running.html) — sélection du backend avec `GDK_BACKEND`.
- [freedesktop.org : The Exec key](https://specifications.freedesktop.org/desktop-entry-spec/latest/exec-variables.html) — syntaxe des raccourcis.
