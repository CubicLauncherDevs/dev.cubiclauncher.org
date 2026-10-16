---
category: getting-started
order: 40
title: Installation sur Nix
description: CubicLauncher publie des paquets pour Linux x86_64 et ARM64. Nix télécharge le binaire depuis Cachix s'il est disponible ; sinon, il compile localement.
---

## Prérequis

Vous avez besoin de Nix avec `flakes` et `nix-command` activés.

Sur NixOS, ajoutez ce qui suit à votre `configuration.nix` :

```nix
nix.settings.experimental-features = [ "nix-command" "flakes" ];
```

Sur les autres distributions, ajoutez ces lignes à `/etc/nix/nix.conf` (ou `~/.config/nix/nix.conf`) :

```text
experimental-features = nix-command flakes
```

Redémarrez le démon Nix si nécessaire et vérifiez que les commandes flake fonctionnent :

```bash
nix --version
nix flake show github:CubicLauncherDevs/CubicLauncher
```

## Installer avec Nix Flakes, sans configurer Cachix

CubicLauncher publie des paquets pour Linux x86_64 et ARM64. Nix télécharge le binaire depuis Cachix s'il est disponible ; sinon, il compile localement.

Ces commandes utilisent directement le flake. Si vous n'avez pas de cache binaire configuré, Nix compilera le paquet sur votre machine.

Installez le canal de votre choix :

### Dernière version stable

```bash
nix profile add github:CubicLauncherDevs/CubicLauncher/latest-release
```

### Dernière bêta

```bash
nix profile add github:CubicLauncherDevs/CubicLauncher/latest-beta
```

Le binaire sera disponible sous le nom `cubiclauncher` dans votre `PATH`.

## Choisir une version spécifique

Remplacez `TAG` par le tag d'une version publiée dans [GitHub Releases](https://github.com/CubicLauncherDevs/CubicLauncher/releases) :

```bash
nix profile add github:CubicLauncherDevs/CubicLauncher/TAG
```

## Optionnel : télécharger les binaires précompilés avec Cachix

Configurez le cache public une seule fois :

```bash
nix run nixpkgs#cachix -- use cubiclauncher
```

Une fois configuré, le cache permet de télécharger les binaires publiés s'il existe un build pour votre révision et votre architecture.

## Utiliser CubicLauncher depuis votre flake NixOS

Ajoutez CubicLauncher comme input du flake et passez-le à un module NixOS. Pour utiliser la bêta, remplacez `latest-release` par `latest-beta`.

```nix
{
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    cubiclauncher.url = "github:CubicLauncherDevs/CubicLauncher/latest-release";
  };

  outputs = { nixpkgs, cubiclauncher, ... }: {
    nixosConfigurations.mon-hote = nixpkgs.lib.nixosSystem {
      system = "x86_64-linux";
      modules = [
        ./configuration.nix
        ({ pkgs, ... }: {
          environment.systemPackages = [
            cubiclauncher.packages.${pkgs.system}.default
          ];
        })
      ];
    };
  };
}
```

## Activer Cachix sur NixOS

Ajoutez le cache et sa clé publique à votre configuration NixOS :

```nix
nix.settings = {
  extra-substituters = [ "https://cubiclauncher.cachix.org" ];
  extra-trusted-public-keys = [
    "cubiclauncher.cachix.org-1:tBeOuLW/CLlkYAH0AB+DNio4XNZOGVMHvQHVuQSqhcA="
  ];
};
```

Appliquez la configuration, puis installez CubicLauncher avec l'une des commandes de profil ci-dessus :

```bash
sudo nixos-rebuild switch
nix profile add github:CubicLauncherDevs/CubicLauncher/latest-release
```

Le cache du projet propose des builds pour Linux x86_64 et ARM64. Sur les autres plateformes, Nix peut compiler le paquet localement.

## Tester sans installer

Vous pouvez exécuter CubicLauncher directement depuis le flake sans l'installer :

```bash
nix run github:CubicLauncherDevs/CubicLauncher/latest-release
```

## Build local

Vous pouvez aussi compiler le paquet manuellement :

```bash
nix build .
ls -la result/bin
```

Le binaire compilé se trouvera dans `result/bin/cubiclauncher`.

## Environnement de développement

Si vous voulez contribuer ou développer CubicLauncher, le flake inclut un `devShell` avec toutes les dépendances nécessaires :

```bash
nix develop
bun install
bun run tauri dev
```

L'environnement inclut `bun`, `rustc`, `cargo`, `cargo-tauri`, GTK3, WebKitGTK, GStreamer, entre autres outils.

Sous Linux, le devShell fixe Mesa, EGL, GBM et Wayland à la même révision de Nixpkgs que la glibc du compilateur (figée dans `flake.lock`) et détecte automatiquement NVIDIA sous Wayland. Vous pouvez forcer ou désactiver le rendu logiciel de WebKitGTK avec `CUBICLAUNCHER_WEBKIT_SOFTWARE=1` ou `CUBICLAUNCHER_WEBKIT_SOFTWARE=0`.

Avec le pilote NVIDIA propriétaire, si les pilotes du système nécessitent une glibc plus récente, utilisez le Nixpkgs du système dans l'environnement de développement :

```bash
nix develop --override-input nixpkgs nixpkgs --no-write-lock-file
```

Consultez le [guide de développement](/docs/fr-FR/Advanced/development) pour plus de détails.

## Mise à jour

Si vous avez installé depuis un canal, mettez à jour en le conservant. Consultez le nom de l'entrée et mettez-la à jour :

```bash
nix profile list
nix profile upgrade --refresh <nom>
```

Vous pouvez aussi réinstaller pour remplacer la version actuelle :

```bash
nix profile add github:CubicLauncherDevs/CubicLauncher/latest-release
```

:::warning La mise à jour automatique est désactivée
Les artefacts de mise à jour automatique sont désactivés pendant l'empaquetage Nix, car le launcher doit être mis à jour via Nix.
:::

## Problèmes courants

### `error: the group 'nixbld' specified in 'build-users-group' does not exist`

Cette erreur se produit lorsque Nix est installé en mode multi-utilisateur mais que le groupe `nixbld` utilisé par le démon pour les builds n'existe pas. Pour la corriger, exécutez le script inclus dans le dépôt en tant que root :

```bash
git clone https://github.com/CubicLauncherDevs/CubicLauncher.git
cd CubicLauncher
sudo ./dist/nix/setup-nix-build-users.sh
```

Puis réessayez :

```bash
nix run github:CubicLauncherDevs/CubicLauncher
# ou
nix develop
```

:::warning AVERTISSEMENT
Ce problème n'est pas lié à CubicLauncher ; c'est une erreur de configuration de votre installation Nix.
:::

### `EGL_BAD_PARAMETER` au démarrage

Cette erreur apparaît lorsque EGL sélectionne le Mesa de `/run/opengl-driver`, compilé avec une glibc différente de celle du flake. Le devShell et le paquet installé fixent Mesa, EGL, GBM et Wayland à la même révision de Nixpkgs que la glibc du compilateur. Relancez le shell ou utilisez le Nixpkgs du système :

```bash
nix develop --override-input nixpkgs nixpkgs --no-write-lock-file
```

:::details Empaquetage et publication (mainteneurs)
Le flake expose le paquet, le `devShell`, le formateur et un check de base. L'empaquetage se trouve dans `dist/nix/` (`flake.nix`, `flake.lock` et `package.nix`).

**Publication sur Cachix.** Le workflow `.github/workflows/nix-cache.yml` compile et publie le paquet pour Linux x86_64 et ARM64. Il s'exécute à la publication d'une release, à la fin du workflow *Publish Release* et manuellement. Il met à jour séparément les tags mobiles `latest-release` et `latest-beta`.

**`cargoHash`.** Il couvre l'arbre des dépendances Rust et dépend de `Cargo.lock` et de la révision de nixpkgs figée dans `flake.lock`. Lorsque `Cargo.lock` change, régénérez-le ainsi :

```bash
nix build --no-link \
  ".#packages.$(nix eval --raw --impure --expr builtins.currentSystem).default.cargoDeps"
```

Copiez le hash de la ligne `got:` dans `cargoHash` de `dist/nix/package.nix`. Générez-le toujours avec `nix build .#...` pour respecter le `flake.lock` commité.

**Autres architectures.** Ajoutez le système à `supportedSystems` dans `flake.nix` et le hash `nodeModules` correspondant dans `dist/nix/package.nix`.

**Script de builds.** Si le démon multi-utilisateur n'a pas le groupe `nixbld`, exécutez `sudo ./dist/nix/setup-nix-build-users.sh` depuis le dépôt.
:::
