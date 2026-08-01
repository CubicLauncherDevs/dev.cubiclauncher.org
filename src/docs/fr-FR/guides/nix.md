---
title: Installation sur Nix | CubicLauncher
---

## Prérequis

CubicLauncher peut être installé depuis le flake du dépôt. Pour l'utiliser, vous avez besoin de Nix avec `flakes` et `nix-command` activés.

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

<div class="my-6 flex gap-3 rounded-lg border border-yellow-500 bg-yellow-500/5 p-4 text-yellow-500">
<div class="flex flex-col gap-1">
<span class="text-sm font-bold uppercase tracking-wider text-yellow-400">
Support des architectures
</span>

<div class="m-0 text-sm leading-relaxed text-neutral-400">
<p class="mt-1">
Le flake est actuellement testé sur <code>x86_64-linux</code>. D'autres architectures Linux (par exemple <code>aarch64-linux</code>) peuvent nécessiter d'ajuster le hash de <code>nodeModules</code> dans <code>dist/nix/package.nix</code>.
</p>
</div>
</div>
</div>

## Installation

Pour installer CubicLauncher dans votre profil utilisateur :

```bash
nix profile install github:CubicLauncherDevs/CubicLauncher
```

Si vous avez déjà cloné le dépôt, vous pouvez installer depuis le code source local :

```bash
nix profile install .
```

Le binaire sera disponible sous le nom `cubiclauncher` dans votre `PATH`.

## Tester sans installer

Vous pouvez exécuter CubicLauncher directement depuis le flake sans l'installer :

```bash
nix run github:CubicLauncherDevs/CubicLauncher
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

L'environnement inclut `bun`, `rustc`, `cargo`, `cargo-tauri`, `gtk3`, `webkitgtk_4_1`, GStreamer, entre autres outils.

## Mise à jour

Lorsqu'une nouvelle version est publiée, mettez à jour le paquet depuis le flake :

```bash
nix profile upgrade '.*cubiclauncher.*'
```

Ou réinstallez pour remplacer la version actuelle :

```bash
nix profile install github:CubicLauncherDevs/CubicLauncher
```

<div class="my-6 flex gap-3 rounded-lg border border-yellow-500 bg-yellow-500/5 p-4 text-yellow-500">
<div class="flex flex-col gap-1">
<span class="text-sm font-bold uppercase tracking-wider text-yellow-400">
La mise à jour automatique est désactivée
</span>

<div class="m-0 text-sm leading-relaxed text-neutral-400">
<p class="mt-1">
Les artefacts du mises à jour automatique sont désactivés pendant l'empaquetage Nix, car le launcher doit être mis à jour via Nix.
</p>
</div>
</div>
</div>

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

<div class="my-6 flex gap-3 rounded-lg border border-yellow-500 bg-yellow-500/5 p-4 text-yellow-500">
<div class="flex flex-col gap-1">
<span class="text-sm font-bold uppercase tracking-wider text-yellow-400">AVERTISSEMENT</span>
<div class="m-0 text-sm leading-relaxed text-neutral-400">
Ce problème n'est pas lié à CubicLauncher ; c'est une erreur de configuration de votre installation Nix.
</div>
</div>
</div>
