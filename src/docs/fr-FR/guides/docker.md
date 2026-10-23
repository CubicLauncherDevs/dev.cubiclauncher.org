---
category: getting-started
order: 50
title: Installation avec Docker
description: Exécutez CubicLauncher dans un conteneur Docker avec X11 ou Wayland, GPU, audio et données persistantes. Image multi-architecture publiée sur GitHub Packages.
---

# Installation avec Docker

CubicLauncher est publié sous forme d'image de conteneur multi-architecture sur GitHub Packages pour `linux/amd64` et `linux/arm64`.

- Dépôt : [CubicLauncher](https://github.com/CubicLauncherDevs/CubicLauncher)
- Image : [ghcr.io/cubiclauncherdevs/cubiclauncher](https://github.com/CubicLauncherDevs/CubicLauncher/pkgs/container/cubiclauncher)

:::info Application de bureau
CubicLauncher doit accéder au serveur graphique de l'hôte. Le conteneur n'inclut ni environnement de bureau ni serveur X11 ou Wayland.
:::

## Prérequis

- Docker installé sur l'hôte.
- Un serveur graphique X11 ou Wayland en cours d'exécution.
- Accès à `/dev/dri` pour l'accélération graphique.
- Un volume ou un dossier pour conserver les données de `~/.cubic`.

## Obtenir l'image

```bash
docker pull ghcr.io/cubiclauncherdevs/cubiclauncher:latest
```

Les étiquettes publiées sont la version complète (`36.0.1`), la version mineure (`36.0`), la version majeure (`36`) et `latest`. `latest` pointe uniquement vers la dernière version stable ; les préversions ne reçoivent que leur propre étiquette.

## Exécuter avec X11

Autorisez votre utilisateur local à se connecter au serveur X11, puis démarrez le conteneur :

```bash
xhost +si:localuser:$(id -un)

docker run --rm -it \
  --user "$(id -u):$(id -g)" \
  -e HOME=/data \
  -e DISPLAY \
  -v /tmp/.X11-unix:/tmp/.X11-unix:ro \
  -v cubic-data:/data \
  --device /dev/dri \
  ghcr.io/cubiclauncherdevs/cubiclauncher:latest
```

Une fois terminé, vous pouvez révoquer l'autorisation :

```bash
xhost -si:localuser:$(id -un)
```

## Exécuter avec Wayland

```bash
docker run --rm -it \
  --user "$(id -u):$(id -g)" \
  -e HOME=/data \
  -e XDG_RUNTIME_DIR=/run/user/$(id -u) \
  -e WAYLAND_DISPLAY \
  -e GDK_BACKEND=wayland \
  -v "$XDG_RUNTIME_DIR:/run/user/$(id -u)" \
  -v cubic-data:/data \
  --device /dev/dri \
  ghcr.io/cubiclauncherdevs/cubiclauncher:latest
```

## Données persistantes

Le volume `cubic-data` conserve `~/.cubic` : les instances, les réglages et le JRE téléchargé par le launcher.

Pour utiliser les données de votre utilisateur sur l'hôte, montez directement le dossier :

```bash
-v "$HOME/.cubic:/data/.cubic"
```

L'image fonctionne avec n'importe quel UID grâce à `--user`, mais le répertoire `/data` doit être accessible en écriture par cet UID. Le volume est créé avec les permissions `1777`.

## NVIDIA

Si vous utilisez un GPU NVIDIA, installez `nvidia-container-toolkit` et ajoutez `--gpus all` à la commande X11 ou Wayland.

Si l'interface apparaît vide, essayez de désactiver le rendu DMA-BUF de WebKit :

```bash
-e WEBKIT_DISABLE_DMABUF_RENDERER=1
```

## Audio

Pour PulseAudio, montez le socket du serveur et définissez `PULSE_SERVER` selon votre configuration. Pour ALSA, ajoutez le périphérique audio :

```bash
--device /dev/snd
```

## Limitations

- Le programme de mise à jour intégré ne fonctionne pas dans le conteneur. Pour mettre à jour, téléchargez la nouvelle étiquette de l'image.
- Le conteneur n'installe pas les pilotes graphiques de l'hôte ; configurez-les sur le système hôte.
- Si WebKit échoue au démarrage à cause du sandbox, essayez `--security-opt seccomp=unconfined`.

## Compiler l'image localement

Depuis la racine du dépôt :

```bash
docker build -t cubiclauncher .
```

Le workflow `.github/workflows/docker.yml` publie l'image lors de la création d'un tag `v*`. Pour publier manuellement la dernière version, lancez **Actions → Docker Image → Run workflow** et laissez le champ `tag` vide ; la dernière version stable sera résolue automatiquement. Si vous indiquez une étiquette précise qui n'est pas la dernière version, `latest` ne sera pas déplacé.
