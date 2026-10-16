---
category: getting-started
order: 40
title: Instalación en Nix
description: CubicLauncher publica paquetes para Linux x86_64 y ARM64. Nix descarga el binario de Cachix si está disponible; si no, lo compila localmente.
---

## Prerrequisitos

Necesitas Nix con `flakes` y `nix-command` habilitados.

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

## Instalar con Nix Flakes, sin configurar Cachix

CubicLauncher publica paquetes para Linux x86_64 y ARM64. Nix descarga el binario de Cachix si está disponible; si no, lo compila localmente.

Estos comandos usan el flake directamente. Si no tienes una caché binaria configurada, Nix compilará el paquete en tu equipo.

Instala el canal que prefieras:

### Última versión estable

```bash
nix profile add github:CubicLauncherDevs/CubicLauncher/latest-release
```

### Última beta

```bash
nix profile add github:CubicLauncherDevs/CubicLauncher/latest-beta
```

El binario quedará disponible como `cubiclauncher` en tu `PATH`.

## Elegir una versión específica

Reemplaza `TAG` por el tag de una versión publicada en [GitHub Releases](https://github.com/CubicLauncherDevs/CubicLauncher/releases):

```bash
nix profile add github:CubicLauncherDevs/CubicLauncher/TAG
```

## Opcional: descargar binarios precompilados con Cachix

Configura la caché pública una vez:

```bash
nix run nixpkgs#cachix -- use cubiclauncher
```

Una vez configurada, la caché permite descargar los binarios publicados si hay un build para tu revisión y arquitectura.

## Usar CubicLauncher desde tu flake de NixOS

Añade CubicLauncher como input del flake y pásalo a un módulo de NixOS. Para usar la beta, cambia `latest-release` por `latest-beta`.

```nix
{
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    cubiclauncher.url = "github:CubicLauncherDevs/CubicLauncher/latest-release";
  };

  outputs = { nixpkgs, cubiclauncher, ... }: {
    nixosConfigurations.mi-host = nixpkgs.lib.nixosSystem {
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

## Activar Cachix en NixOS

Añade la caché y su clave pública a tu configuración de NixOS:

```nix
nix.settings = {
  extra-substituters = [ "https://cubiclauncher.cachix.org" ];
  extra-trusted-public-keys = [
    "cubiclauncher.cachix.org-1:tBeOuLW/CLlkYAH0AB+DNio4XNZOGVMHvQHVuQSqhcA="
  ];
};
```

Aplica la configuración y luego instala CubicLauncher con uno de los comandos de perfil anteriores:

```bash
sudo nixos-rebuild switch
nix profile add github:CubicLauncherDevs/CubicLauncher/latest-release
```

La caché del proyecto ofrece builds para Linux x86_64 y ARM64. En otras plataformas Nix puede compilar el paquete localmente.

## Ejecutar sin instalar

Puedes ejecutar CubicLauncher directamente desde el flake sin instalarlo:

```bash
nix run github:CubicLauncherDevs/CubicLauncher/latest-release
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

El entorno incluye `bun`, `rustc`, `cargo`, `cargo-tauri`, GTK3, WebKitGTK, GStreamer, entre otras herramientas.

En Linux, el devShell fija Mesa, EGL, GBM y Wayland a la misma revisión de Nixpkgs que la glibc del compilador (fijada en `flake.lock`) y detecta automáticamente NVIDIA con Wayland. Puedes forzar o desactivar el renderizado por software de WebKitGTK con `CUBICLAUNCHER_WEBKIT_SOFTWARE=1` o `CUBICLAUNCHER_WEBKIT_SOFTWARE=0`.

Con NVIDIA propietario, si los controladores del sistema requieren una glibc más nueva, usa el Nixpkgs del sistema en el entorno de desarrollo:

```bash
nix develop --override-input nixpkgs nixpkgs --no-write-lock-file
```

Consulta la [guía de desarrollo](/docs/es-ES/Avanzado/desarrollo) para más detalles.

## Actualizar

Si instalaste desde un canal, actualiza conservándolo. Consulta el nombre de la entrada y actualízala:

```bash
nix profile list
nix profile upgrade --refresh <nombre>
```

También puedes reinstalar para reemplazar la versión actual:

```bash
nix profile add github:CubicLauncherDevs/CubicLauncher/latest-release
```

:::warning La auto-actualización está desactivada
Durante el empaquetado para Nix se desactivan los artefactos del auto-actualizador, ya que el launcher debe actualizarse a través de Nix.
:::

## Solución de problemas

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

:::warning AVISO
Este problema no está relacionado con CubicLauncher; es un error de configuración de la instalación de Nix en tu sistema.
:::

### `EGL_BAD_PARAMETER` al iniciar

Este error aparece cuando EGL selecciona el Mesa de `/run/opengl-driver`, compilado con una glibc distinta a la del flake. El devShell y el paquete instalado fijan Mesa, EGL, GBM y Wayland a la misma revisión de Nixpkgs que la glibc del compilador. Vuelve a entrar al entorno o usa el Nixpkgs del sistema:

```bash
nix develop --override-input nixpkgs nixpkgs --no-write-lock-file
```

:::details Empaquetado y publicación (mantenedores)
El flake expone el paquete, el `devShell`, el formateador y un check básico. El empaquetado vive en `dist/nix/` (`flake.nix`, `flake.lock` y `package.nix`).

**Publicación en Cachix.** El workflow `.github/workflows/nix-cache.yml` compila y publica el paquete para Linux x86_64 y ARM64. Se ejecuta al publicar releases, al terminar el workflow *Publish Release* y manualmente. Actualiza por separado los tags móviles `latest-release` y `latest-beta`.

**`cargoHash`.** Cubre el árbol de dependencias de Rust y depende de `Cargo.lock` y de la revisión de nixpkgs fijada en `flake.lock`. Al cambiar `Cargo.lock`, regenéralo así:

```bash
nix build --no-link \
  ".#packages.$(nix eval --raw --impure --expr builtins.currentSystem).default.cargoDeps"
```

Copia el hash de la línea `got:` en `cargoHash` de `dist/nix/package.nix`. Genera siempre con `nix build .#...` para respetar el `flake.lock` commiteado.

**Otras arquitecturas.** Añade el sistema a `supportedSystems` en `flake.nix` y el hash de `nodeModules` correspondiente en `dist/nix/package.nix`.

**Script de builds.** Si el daemon multi-usuario no tiene el grupo `nixbld`, ejecuta `sudo ./dist/nix/setup-nix-build-users.sh` desde el repositorio.
:::
