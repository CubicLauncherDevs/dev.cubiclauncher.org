---
title: Instalación en Nix | CubicLauncher
---

## Prerrequisitos

CubicLauncher se puede instalar desde el flake del repositorio. Para usarlo necesitas Nix con `flakes` y `nix-command` habilitados.

En NixOS, añade lo siguiente a tu `configuration.nix`:

```nix
nix.settings.experimental-features = [ "nix-command" "flakes" ];
```

En otras distribuciones, agrega estas líneas a `/etc/nix/nix.conf` (o `~/.config/nix/nix.conf`):

```text
experimental-features = nix-command flakes
```

Reinicia el daemon de Nix si es necesario y verifica que los comandos de flake funcionen:

```bash
nix --version
nix flake show github:CubicLauncherDevs/CubicLauncher
```

<div class="my-6 flex gap-3 rounded-lg border border-yellow-500 bg-yellow-500/5 p-4 text-yellow-500">
<div class="flex flex-col gap-1">
<span class="text-sm font-bold uppercase tracking-wider text-yellow-400">
Soporte de arquitecturas
</span>

<div class="m-0 text-sm leading-relaxed text-neutral-400">
<p class="mt-1">
Actualmente el flake está probado en <code>x86_64-linux</code>. Otras arquitecturas Linux (por ejemplo <code>aarch64-linux</code>) pueden necesitar ajustar el hash de <code>nodeModules</code> en <code>dist/nix/package.nix</code>.
</p>
</div>
</div>
</div>

## Instalar

Para instalar CubicLauncher en tu perfil de usuario:

```bash
nix profile install github:CubicLauncherDevs/CubicLauncher
```

Si ya clonaste el repositorio, puedes instalar desde el código local:

```bash
nix profile install .
```

El binario quedará disponible como `cubiclauncher` en tu `PATH`.

## Probar sin instalar

Puedes ejecutar CubicLauncher directamente desde el flake sin instalarlo:

```bash
nix run github:CubicLauncherDevs/CubicLauncher
```

## Build local

También puedes construir el paquete manualmente:

```bash
nix build .
ls -la result/bin
```

El binario compilado estará en `result/bin/cubiclauncher`.

## Entorno de desarrollo

Si quieres contribuir o desarrollar CubicLauncher, el flake incluye un `devShell` con todas las dependencias necesarias:

```bash
nix develop
bun install
bun run tauri dev
```

El entorno incluye `bun`, `rustc`, `cargo`, `cargo-tauri`, `gtk3`, `webkitgtk_4_1`, GStreamer, entre otras herramientas.

## Actualizar

Cuando se publique una nueva versión, actualiza el paquete desde el flake:

```bash
nix profile upgrade '.*cubiclauncher.*'
```

O reinstala para reemplazar la versión actual:

```bash
nix profile install github:CubicLauncherDevs/CubicLauncher
```

<div class="my-6 flex gap-3 rounded-lg border border-yellow-500 bg-yellow-500/5 p-4 text-yellow-500">
<div class="flex flex-col gap-1">
<span class="text-sm font-bold uppercase tracking-wider text-yellow-400">
La auto-actualización está desactivada
</span>

<div class="m-0 text-sm leading-relaxed text-neutral-400">
<p class="mt-1">
Durante el empaquetado para Nix se desactivan los artefactos del auto-actualizador, ya que el launcher debe actualizarse a través de Nix.
</p>
</div>
</div>
</div>

## Problemas comunes

### `error: the group 'nixbld' specified in 'build-users-group' does not exist`

Este error ocurre cuando Nix está instalado en modo multi-usuario pero el grupo `nixbld` que usa el daemon para los builds no existe. Para corregirlo, ejecuta como root el script incluido en el repositorio:

```bash
git clone https://github.com/CubicLauncherDevs/CubicLauncher.git
cd CubicLauncher
sudo ./dist/nix/setup-nix-build-users.sh
```

Luego reintenta:

```bash
nix run github:CubicLauncherDevs/CubicLauncher
# o
nix develop
```

<div class="my-6 flex gap-3 rounded-lg border border-yellow-500 bg-yellow-500/5 p-4 text-yellow-500">
<div class="flex flex-col gap-1">
<span class="text-sm font-bold uppercase tracking-wider text-yellow-400">AVISO</span>
<div class="m-0 text-sm leading-relaxed text-neutral-400">
Este problema no está relacionado con CubicLauncher; es un error de configuración de la instalación de Nix en tu sistema.
</div>
</div>
</div>
