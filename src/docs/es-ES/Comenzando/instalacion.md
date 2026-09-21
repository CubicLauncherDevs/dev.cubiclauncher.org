---
title: Instalación
description: Cómo instalar CubicLauncher en Windows, Linux (AppImage/.deb/.rpm, AUR) y macOS, además de Nix/NixOS.
---

# Instalación

## Requisitos previos

- CubicLauncher no necesita Java instalado para abrirse, pero sí para jugar a Minecraft. Si no tenés Java, podés usar los JRE gestionados del launcher o configurar uno externo. Ver Guía de Java: /docs/es-ES/Uso/java

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

Con `flakes` y `nix-command` habilitados:

```bash
# Instalar en el perfil de usuario
nix profile add github:CubicLauncherDevs/CubicLauncher

# Ejecutar sin instalar en el perfil
nix run github:CubicLauncherDevs/CubicLauncher
```

Targets soportados: `x86_64-linux`, `aarch64-linux` y `aarch64-darwin`.

Más detalles en la guía: /docs/es-ES/guias/nix

## Notas de compatibilidad (Linux)

- Los binarios `.AppImage`, `.deb` y `.rpm` se generan en Ubuntu; en distros rolling como Arch puede haber diferencias en versiones de bibliotecas.
- Por eso, en Arch te recomendamos usar el empaquetado nativo del AUR.

## Requisitos mínimos

- Sistema operativo de 64 bits (Windows 10/11, glibc Linux moderno, macOS 12+)
- Conectividad a internet para descargar versiones, mods y autenticar cuentas
- Java lo gestiona el launcher o podés usar uno externo (ver Guía de Java)
