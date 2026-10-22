---
category: getting-started
order: 20
title: Instalación
description: Cómo instalar CubicLauncher en Windows, Linux (AppImage/.deb/.rpm, AUR) y macOS, además de Nix/NixOS.
---

# Instalación

## Requisitos previos

CubicLauncher no necesita Java instalado para abrirse, pero sí para jugar a Minecraft. Podés usar los JRE gestionados del launcher o configurar uno externo. Ver [Qué es Java](/docs/es-ES/Uso/java).

Como guía general, CubicLauncher puede instalar y detectar Java 8, 17, 21 y 25:

- **Java 8** para versiones antiguas de Minecraft.
- **Java 17** para versiones modernas que lo requieren.
- **Java 21** para las versiones más recientes.
- **Java 25** para versiones o loaders que lo soliciten.

## Descargas oficiales

Descargá la última versión estable desde GitHub Releases:

- Windows: instalador `.exe` (NSIS)
- Linux: AppImage y paquetes `.deb` y `.rpm`
- macOS: imagen `.dmg` para Apple Silicon e Intel

Encontrás todos los archivos en la página de Releases del proyecto.

:::info Consejos
- En Linux, si usás Arch, te recomendamos el paquete del AUR para mayor compatibilidad con bibliotecas del sistema.
- En macOS, si Gatekeeper bloquea la app, hacé clic derecho → Abrir la primera vez.
:::

## Arch Linux (AUR)

El paquete `cubiclauncher` está disponible en el AUR. Con `yay`:

```bash
yay -S cubiclauncher
```

También podés compilar con el PKGBUILD del repositorio. Mirá la guía específica: /docs/es-ES/guias/arch

## Nix y NixOS (flake)

Con `flakes` y `nix-command` habilitados, instala el canal estable o la beta:

```bash
# Última versión estable
nix profile add github:CubicLauncherDevs/CubicLauncher/latest-release

# Última beta
nix profile add github:CubicLauncherDevs/CubicLauncher/latest-beta

# Ejecutar sin instalar en el perfil
nix run github:CubicLauncherDevs/CubicLauncher/latest-release
```

Opcionalmente, configura la caché pública de Cachix para descargar binarios precompilados:

```bash
nix run nixpkgs#cachix -- use cubiclauncher
```

El flake soporta `x86_64-linux`, `aarch64-linux` y `aarch64-darwin`; la caché del proyecto publica builds solo para Linux.

Más detalles en la guía: /docs/es-ES/guias/nix

## Notas de compatibilidad (Linux)

- Los binarios `.AppImage`, `.deb` y `.rpm` se generan en Ubuntu; en distros rolling como Arch puede haber diferencias en versiones de bibliotecas.
- Por eso, en Arch te recomendamos usar el empaquetado nativo del AUR.

### NVIDIA y Wayland: ventana vacía o cierres

Si el launcher queda en blanco, parpadea o se cierra al redimensionar, consultá [Problemas gráficos en Linux: NVIDIA y Wayland](/docs/es-ES/guias/nvidia-wayland). La guía explica el uso de `WEBKIT_DISABLE_COMPOSITING_MODE=1 cubiclauncher`, las alternativas de WebKitGTK y cómo aplicar el ajuste a un acceso directo.

## Requisitos mínimos

- Sistema operativo de 64 bits (Windows 10/11, glibc Linux moderno, macOS 12+)
- Conectividad a internet para descargar versiones, mods y autenticar cuentas
- Java lo gestiona el launcher o podés usar uno externo (ver Guía de Java)
